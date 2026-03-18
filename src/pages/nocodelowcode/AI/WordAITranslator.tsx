import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import JSZip from 'jszip';
import { Button, TextField } from '@mui/material';
import { generalQuery } from '../../../api/Api';

type ParagraphTextItem = {
  path: string;
  p: number;
  text: string;
};

type PromptPayload = {
  meta: {
    fileName: string;
    from: string;
    to: string;
    total: number;
  };
  paragraphs: ParagraphTextItem[];
};

type TranslationPayload = {
  paragraphs: ParagraphTextItem[];
};

const getParagraphsInDocumentOrder = (doc: Document) => {
  const all = Array.from(doc.getElementsByTagName('*')) as Element[];
  return all.filter((el) => {
    const tag = (el.tagName || '').toLowerCase();
    return tag === 'w:p' || tag.endsWith(':p');
  });
};

const WordAITranslator = () => {
  const [fileName, setFileName] = useState<string>('');
  const [fromLang, setFromLang] = useState<string>(() => localStorage.getItem('word_ai_translator_from') || 'korean');
  const [toLang, setToLang] = useState<string>(() => localStorage.getItem('word_ai_translator_to') || 'vietnamese');
  const [backendModel, setBackendModel] = useState<string>('gemini-2.5-flash');
  const [backendTemperature, setBackendTemperature] = useState<number>(0.2);
  const [backendTranslating, setBackendTranslating] = useState<boolean>(false);
  const [chunkSize, setChunkSize] = useState<number>(120);
  const [maxPromptChars, setMaxPromptChars] = useState<number>(28000);

  useEffect(() => {
    localStorage.setItem('word_ai_translator_from', fromLang);
  }, [fromLang]);

  useEffect(() => {
    localStorage.setItem('word_ai_translator_to', toLang);
  }, [toLang]);

  const [paragraphs, setParagraphs] = useState<ParagraphTextItem[]>([]);
  const [promptText, setPromptText] = useState<string>('');
  const [aiResponseText, setAiResponseText] = useState<string>('');

  const zipRef = useRef<JSZip | null>(null);
  const uploadedFileRef = useRef<File | null>(null);

  const readFileAsArrayBuffer = (file: File) => {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  };

  const extractParagraphTextsFromXml = useCallback((path: string, xml: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const out: ParagraphTextItem[] = [];

    const ps = getParagraphsInDocumentOrder(doc);
    for (let p = 0; p < ps.length; p++) {
      const pNode = ps[p];
      const tNodes = Array.from(pNode.getElementsByTagName('w:t'));
      const text = tNodes
        .map((t) => t.textContent ?? '')
        .join('')
        .replace(/\r\n/g, '\n');
      out.push({ path, p, text });
    }

    return out;
  }, []);

  const buildPrompt = useCallback((items: ParagraphTextItem[], fn: string, from: string, to: string) => {
    const payload: PromptPayload = {
      meta: {
        fileName: fn,
        from,
        to,
        total: items.length,
      },
      paragraphs: items,
    };

    const schema: any = {
      paragraphs: [{ path: 'word/document.xml', p: 0, text: 'translated text (use \\n for line breaks if needed)' }],
    };

    return [
      `You are an expert translator. Translate from ${from} to ${to}.`,
      `Return ONLY valid JSON matching this schema (no markdown, no extra keys):`,
      JSON.stringify(schema, null, 2),
      `Rules:`,
      `- Keep the SAME number of items as input.`,
      `- Keep each path exactly the same.`,
      `- Keep each p exactly the same for each path.`,
      `- Preserve placeholders like {0}, {name}, %s.`,
      `- Do not reorder items.`,
      `- Translate each item independently; do not rely on missing context outside the provided items.`,
      `Input JSON:`,
      JSON.stringify(payload, null, 2),
    ].join('\n');
  }, []);

  const chunkParagraphsForBackend = useCallback(
    (items: ParagraphTextItem[], maxItems: number, maxChars: number) => {
      const out: ParagraphTextItem[][] = [];
      let cur: ParagraphTextItem[] = [];
      let curChars = 0;

      const safeMaxItems = Math.max(5, Math.floor(Number(maxItems) || 120));
      const safeMaxChars = Math.max(4000, Math.floor(Number(maxChars) || 28000));

      for (const it of items) {
        const txt = String(it?.text ?? '');
        const approx = txt.length + 60;
        const willExceedItems = cur.length >= safeMaxItems;
        const willExceedChars = cur.length > 0 && curChars + approx > safeMaxChars;

        if (willExceedItems || willExceedChars) {
          out.push(cur);
          cur = [];
          curChars = 0;
        }

        cur.push(it);
        curChars += approx;
      }

      if (cur.length) out.push(cur);
      return out;
    },
    [],
  );

  const onUpload = useCallback(
    async (file: File) => {
      setFileName(file.name);
      setParagraphs([]);
      setPromptText('');
      setAiResponseText('');
      uploadedFileRef.current = file;

      const buf = await readFileAsArrayBuffer(file);
      const zip = await JSZip.loadAsync(buf);
      zipRef.current = zip;

      const xmlPaths = Object.keys(zip.files).filter(
        (p) =>
          /^word\/document\.xml$/i.test(p) ||
          /^word\/header\d+\.xml$/i.test(p) ||
          /^word\/footer\d+\.xml$/i.test(p),
      );
      xmlPaths.sort((a, b) => a.localeCompare(b));

      let items: ParagraphTextItem[] = [];
      for (const p of xmlPaths) {
        const f = zip.file(p);
        if (!f) continue;
        const xml = await f.async('text');
        items = items.concat(extractParagraphTextsFromXml(p, xml));
      }

      setParagraphs(items);
      const prompt = buildPrompt(items, file.name, fromLang, toLang);
      setPromptText(prompt);
    },
    [buildPrompt, extractParagraphTextsFromXml, fromLang, toLang],
  );

  const applyTranslationPayloadToZip = useCallback(
    async (payload: TranslationPayload) => {
      const zip = zipRef.current;
      if (!zip) throw new Error('No docx loaded');

      if (!payload?.paragraphs || !Array.isArray(payload.paragraphs)) {
        throw new Error('Missing paragraphs array');
      }

      if (payload.paragraphs.length !== paragraphs.length) {
        throw new Error(`Length mismatch: expected ${paragraphs.length} items, got ${payload.paragraphs.length}`);
      }

      const byPath = new Map<string, ParagraphTextItem[]>();
      for (const it of payload.paragraphs) {
        if (!it || typeof it.path !== 'string') continue;
        const cur = byPath.get(it.path) ?? [];
        cur.push(it);
        byPath.set(it.path, cur);
      }

      for (const [p, items] of byPath.entries()) {
        const f = zip.file(p);
        if (!f) continue;
        const xml = await f.async('text');
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'application/xml');

        const ps = getParagraphsInDocumentOrder(doc);
        items.sort((a, b) => a.p - b.p);
        for (const it of items) {
          const pNode = ps[it.p];
          if (!pNode) continue;

          const translatedText = String(it.text ?? '').replace(/\r\n/g, '\n');
          const tNodes = Array.from(pNode.getElementsByTagName('w:t'));
          if (tNodes.length === 0) continue;

          (tNodes[0] as Element).textContent = translatedText;
          for (let i = 1; i < tNodes.length; i++) {
            (tNodes[i] as Element).textContent = '';
          }
        }

        const serializer = new XMLSerializer();
        zip.file(p, serializer.serializeToString(doc));
      }
    },
    [paragraphs.length],
  );

  const downloadTranslatedDocx = useCallback(async () => {
    const zip = zipRef.current;
    if (!zip) throw new Error('No docx loaded');

    let parsed: TranslationPayload;
    try {
      parsed = JSON.parse(aiResponseText);
    } catch (e: any) {
      throw new Error('AI response is not valid JSON');
    }

    await applyTranslationPayloadToZip(parsed);

    const outBuf = await zip.generateAsync({ type: 'blob' });
    const outName = fileName ? fileName.replace(/\.docx$/i, '') + `_translated.docx` : 'translated.docx';

    const url = URL.createObjectURL(outBuf);
    const a = document.createElement('a');
    a.href = url;
    a.download = outName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [aiResponseText, applyTranslationPayloadToZip, fileName]);

  const translateViaBackendAndDownload = useCallback(async () => {
    const f = uploadedFileRef.current;
    if (!f) throw new Error('No uploaded file');

    setBackendTranslating(true);
    try {
      const nonEmpty = paragraphs.filter((x) => String(x?.text ?? '').trim() !== '');
      if (nonEmpty.length === 0) {
        throw new Error('No non-empty paragraphs to translate');
      }

      const chunks = chunkParagraphsForBackend(nonEmpty, chunkSize, maxPromptChars);
      const translatedMap = new Map<string, string>();

      for (let ci = 0; ci < chunks.length; ci++) {
        const chunk = chunks[ci];
        const chunkPrompt = buildPrompt(chunk, fileName || f.name, fromLang, toLang);

        const resp: any = await generalQuery('gemini_prompt', {
          prompt: chunkPrompt,
          model: backendModel,
          temperature: backendTemperature,
        });
        if (resp?.data?.tk_status?.toUpperCase() === 'NG') {
          throw new Error(resp?.data?.message ?? 'Backend error');
        }

        const raw =
          resp?.data?.data?.response ?? resp?.data?.data?.result ?? resp?.data?.data?.text ?? resp?.data?.data;

        let translated: any = raw;
        if (typeof translated === 'string') {
          const trimmed = translated.trim();
          try {
            translated = JSON.parse(trimmed);
          } catch {
            const start = trimmed.indexOf('{');
            const end = trimmed.lastIndexOf('}');
            if (start >= 0 && end > start) {
              translated = JSON.parse(trimmed.slice(start, end + 1));
            } else {
              throw new Error(
                `Backend returned non-JSON text at chunk ${ci + 1}/${chunks.length}. Please ensure AI returns JSON only.`,
              );
            }
          }
        }

        if (!translated || typeof translated !== 'object') {
          throw new Error(`Backend response is not a JSON object at chunk ${ci + 1}/${chunks.length}`);
        }

        if (!translated.paragraphs || !Array.isArray(translated.paragraphs)) {
          throw new Error(`Backend JSON missing paragraphs array at chunk ${ci + 1}/${chunks.length}`);
        }

        if (translated.paragraphs.length !== chunk.length) {
          throw new Error(
            `Chunk length mismatch at ${ci + 1}/${chunks.length}: expected ${chunk.length}, got ${translated.paragraphs.length}`,
          );
        }

        for (let i = 0; i < chunk.length; i++) {
          const src = chunk[i];
          const dst = translated.paragraphs[i];
          if (String(dst?.path) !== String(src?.path) || Number(dst?.p) !== Number(src?.p)) {
            throw new Error(`Chunk item mismatch at ${ci + 1}/${chunks.length}, index ${i}`);
          }
          const key = `${String(dst.path)}::${String(dst.p)}`;
          translatedMap.set(key, String(dst?.text ?? ''));
        }
      }

      const mergedParagraphs: ParagraphTextItem[] = paragraphs.map((p) => {
        const key = `${String(p.path)}::${String(p.p)}`;
        if (!translatedMap.has(key)) return p;
        return { ...p, text: String(translatedMap.get(key) ?? p.text) };
      });

      const mergedPayload: TranslationPayload = { paragraphs: mergedParagraphs };
      setAiResponseText(JSON.stringify(mergedPayload, null, 2));
      await applyTranslationPayloadToZip(mergedPayload);

      const zip = zipRef.current;
      if (!zip) throw new Error('No docx loaded');
      const outBuf = await zip.generateAsync({ type: 'blob' });
      const outName = fileName ? fileName.replace(/\.docx$/i, '') + `_translated.docx` : 'translated.docx';

      const url = URL.createObjectURL(outBuf);
      const a = document.createElement('a');
      a.href = url;
      a.download = outName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setBackendTranslating(false);
    }
  }, [
    applyTranslationPayloadToZip,
    backendModel,
    backendTemperature,
    buildPrompt,
    chunkParagraphsForBackend,
    chunkSize,
    fileName,
    fromLang,
    maxPromptChars,
    paragraphs,
    toLang,
  ]);

  const stats = useMemo(() => {
    const total = paragraphs.length;
    const nonEmpty = paragraphs.filter((x) => (x.text ?? '').trim() !== '').length;
    return { total, nonEmpty };
  }, [paragraphs]);

  return (
    <div
      style={{
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        height: 'calc(100vh - 160px)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button variant="contained" component="label">
          Upload .docx
          <input
            type="file"
            hidden
            accept=".docx"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                await onUpload(f);
              } catch (err: any) {
                alert(err?.message ?? String(err));
              }
            }}
          />
        </Button>

        <TextField
          label="From"
          size="small"
          value={fromLang}
          onChange={(e) => setFromLang(e.target.value)}
          style={{ width: 120 }}
        />
        <TextField
          label="To"
          size="small"
          value={toLang}
          onChange={(e) => setToLang(e.target.value)}
          style={{ width: 120 }}
        />

        <TextField
          label="Backend model"
          size="small"
          value={backendModel}
          onChange={(e) => setBackendModel(e.target.value)}
          style={{ width: 220 }}
        />

        <TextField
          label="Temperature"
          size="small"
          value={backendTemperature}
          onChange={(e) => setBackendTemperature(Number(e.target.value))}
          style={{ width: 140 }}
        />

        <TextField
          label="Chunk size"
          size="small"
          value={chunkSize}
          onChange={(e) => setChunkSize(Number(e.target.value))}
          style={{ width: 140 }}
        />

        <TextField
          label="Max prompt chars"
          size="small"
          value={maxPromptChars}
          onChange={(e) => setMaxPromptChars(Number(e.target.value))}
          style={{ width: 160 }}
        />

        <div style={{ fontSize: 13 }}>
          <b>File:</b> {fileName || '(none)'} &nbsp; | &nbsp;<b>paragraphs:</b> {stats.nonEmpty}/{stats.total}
        </div>

        <Button
          variant="outlined"
          onClick={() => {
            if (!paragraphs.length) return;
            setPromptText(buildPrompt(paragraphs, fileName || 'document.docx', fromLang, toLang));
          }}
          disabled={!paragraphs.length}
        >
          Rebuild Prompt
        </Button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 12,
          flex: 1,
          minHeight: 0,
          flexWrap: 'wrap',
        }}
      >
        <TextField
          label="Prompt (copy and send to external AI)"
          multiline
          minRows={8}
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          fullWidth
          sx={{
            flex: 1,
            minWidth: 420,
            height: '100%',
            '& .MuiInputBase-root': {
              height: '100%',
              alignItems: 'flex-start',
            },
            '& textarea': {
              height: '100% !important',
              overflow: 'auto !important',
              resize: 'none',
            },
          }}
        />

        <TextField
          label="AI Response JSON (paste here)"
          multiline
          minRows={8}
          value={aiResponseText}
          onChange={(e) => setAiResponseText(e.target.value)}
          fullWidth
          sx={{
            flex: 1,
            minWidth: 420,
            height: '100%',
            '& .MuiInputBase-root': {
              height: '100%',
              alignItems: 'flex-start',
            },
            '& textarea': {
              height: '100% !important',
              overflow: 'auto !important',
              resize: 'none',
            },
          }}
        />
      </div>

      <div
        style={{
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          gap: 12,
          paddingTop: 10,
          paddingBottom: 10,
          background: '#fff',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <Button
          variant="contained"
          onClick={async () => {
            try {
              await downloadTranslatedDocx();
            } catch (err: any) {
              alert(err?.message ?? String(err));
            }
          }}
          disabled={!zipRef.current || !aiResponseText.trim()}
        >
          Download translated .docx
        </Button>

        <Button
          variant="outlined"
          onClick={async () => {
            try {
              await translateViaBackendAndDownload();
            } catch (err: any) {
              alert(err?.message ?? String(err));
            }
          }}
          disabled={!zipRef.current || !uploadedFileRef.current || backendTranslating}
        >
          Translate via Backend
        </Button>
      </div>
    </div>
  );
};

export default WordAITranslator;
