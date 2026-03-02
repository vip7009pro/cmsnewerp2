import { useCallback, useMemo, useRef, useState } from 'react';
import JSZip from 'jszip';
import { Button, MenuItem, TextField } from '@mui/material';
import { generalQuery } from '../../api/Api';

type SlideTextItem = {
  path: string;
  i: number;
  text: string;
};

type PromptPayload = {
  meta: {
    fileName: string;
    from: string;
    to: string;
    total: number;
  };
  slideTexts: SlideTextItem[];
};

type TranslationPayload = {
  slideTexts: SlideTextItem[];
};

const PowerPointAITranslator = () => {
  const [fileName, setFileName] = useState<string>('');
  const [fromLang, setFromLang] = useState<string>('vi');
  const [toLang, setToLang] = useState<string>('en');
  const [backendModel, setBackendModel] = useState<string>('gemini-2.5-flash');
  const [backendTemperature, setBackendTemperature] = useState<number>(0.2);
  const [backendTranslating, setBackendTranslating] = useState<boolean>(false);

  const [slideTexts, setSlideTexts] = useState<SlideTextItem[]>([]);
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

  const extractSlideTextsFromXml = useCallback((path: string, xml: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const out: SlideTextItem[] = [];
    let idx = 0;

    const aTNodes = Array.from(doc.getElementsByTagName('a:t'));
    for (const t of aTNodes) {
      const text = (t.textContent ?? '').replace(/\r\n/g, '\n');
      out.push({ path, i: idx, text });
      idx++;
    }

    return out;
  }, []);

  const buildPrompt = useCallback((items: SlideTextItem[], fn: string, from: string, to: string) => {
    const payload: PromptPayload = {
      meta: {
        fileName: fn,
        from,
        to,
        total: items.length,
      },
      slideTexts: items,
    };

    const schema: any = {
      slideTexts: [{ path: 'ppt/slides/slide1.xml', i: 0, text: 'translated text' }],
    };

    return [
      `You are an expert translator. Translate from ${from} to ${to}.`,
      `Return ONLY valid JSON matching this schema (no markdown, no extra keys):`,
      JSON.stringify(schema, null, 2),
      `Rules:`,
      `- Keep the SAME number of items as input.`,
      `- Keep each path exactly the same.`,
      `- Keep each i exactly the same for each path.`,
      `- Preserve placeholders like {0}, {name}, %s.`,
      `- Do not reorder items.`,
      `Input JSON:`,
      JSON.stringify(payload, null, 2),
    ].join('\n');
  }, []);

  const onUpload = useCallback(
    async (file: File) => {
      setFileName(file.name);
      setSlideTexts([]);
      setPromptText('');
      setAiResponseText('');
      uploadedFileRef.current = file;

      const buf = await readFileAsArrayBuffer(file);
      const zip = await JSZip.loadAsync(buf);
      zipRef.current = zip;

      const slidePaths = Object.keys(zip.files).filter((p) => /^ppt\/slides\/slide\d+\.xml$/i.test(p));
      slidePaths.sort((a, b) => a.localeCompare(b));

      let items: SlideTextItem[] = [];
      for (const p of slidePaths) {
        const f = zip.file(p);
        if (!f) continue;
        const xml = await f.async('text');
        items = items.concat(extractSlideTextsFromXml(p, xml));
      }

      setSlideTexts(items);
      const prompt = buildPrompt(items, file.name, fromLang, toLang);
      setPromptText(prompt);
    },
    [buildPrompt, extractSlideTextsFromXml, fromLang, toLang],
  );

  const applyTranslationPayloadToZip = useCallback(async (payload: TranslationPayload) => {
    const zip = zipRef.current;
    if (!zip) throw new Error('No pptx loaded');

    if (!payload?.slideTexts || !Array.isArray(payload.slideTexts)) {
      throw new Error('Missing slideTexts array');
    }

    if (payload.slideTexts.length !== slideTexts.length) {
      throw new Error(`Length mismatch: expected ${slideTexts.length} items, got ${payload.slideTexts.length}`);
    }

    const byPath = new Map<string, SlideTextItem[]>();
    for (const it of payload.slideTexts) {
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
      const tNodes = Array.from(doc.getElementsByTagName('a:t'));

      items.sort((a, b) => a.i - b.i);
      for (const it of items) {
        const node = tNodes[it.i] as Element | undefined;
        if (!node) continue;
        node.textContent = (it.text ?? '').replace(/\r\n/g, '\n');
      }

      const serializer = new XMLSerializer();
      zip.file(p, serializer.serializeToString(doc));
    }
  }, [slideTexts.length]);

  const applyTranslationsAndZip = useCallback(async () => {
    const zip = zipRef.current;
    if (!zip) throw new Error('No pptx loaded');

    let parsed: TranslationPayload;
    try {
      parsed = JSON.parse(aiResponseText);
    } catch (e: any) {
      throw new Error('AI response is not valid JSON');
    }

    await applyTranslationPayloadToZip(parsed);

    const outBuf = await zip.generateAsync({ type: 'blob' });
    const outName = fileName ? fileName.replace(/\.pptx$/i, '') + `_translated.pptx` : 'translated.pptx';

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
      const prompt = promptText.trim() ? promptText : buildPrompt(slideTexts, fileName || f.name, fromLang, toLang);

      const resp: any = await generalQuery('gemini_prompt', {
        prompt,
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
            throw new Error('Backend returned non-JSON text. Please ensure AI returns JSON only.');
          }
        }
      }

      if (!translated || typeof translated !== 'object') {
        throw new Error('Backend response is not a JSON object');
      }

      if (!translated.slideTexts) {
        throw new Error('Backend JSON missing slideTexts');
      }

      setAiResponseText(JSON.stringify(translated, null, 2));
      await applyTranslationPayloadToZip(translated as TranslationPayload);

      const zip = zipRef.current;
      if (!zip) throw new Error('No pptx loaded');
      const outBuf = await zip.generateAsync({ type: 'blob' });
      const outName = fileName ? fileName.replace(/\.pptx$/i, '') + `_translated.pptx` : 'translated.pptx';

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
    fileName,
    fromLang,
    promptText,
    slideTexts,
    toLang,
  ]);

  const stats = useMemo(() => {
    const total = slideTexts.length;
    const nonEmpty = slideTexts.filter((x) => (x.text ?? '').trim() !== '').length;
    return { total, nonEmpty };
  }, [slideTexts]);

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
          Upload .pptx
          <input
            type="file"
            hidden
            accept=".pptx"
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

        <div style={{ fontSize: 13 }}>
          <b>File:</b> {fileName || '(none)'} &nbsp; | &nbsp;<b>texts:</b> {stats.nonEmpty}/{stats.total}
        </div>

        <Button
          variant="outlined"
          onClick={() => {
            if (!slideTexts.length) return;
            setPromptText(buildPrompt(slideTexts, fileName || 'slides.pptx', fromLang, toLang));
          }}
          disabled={!slideTexts.length}
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
              await applyTranslationsAndZip();
            } catch (err: any) {
              alert(err?.message ?? String(err));
            }
          }}
          disabled={!zipRef.current || !aiResponseText.trim()}
        >
          Download translated .pptx
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

export default PowerPointAITranslator;
