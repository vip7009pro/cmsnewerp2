import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import JSZip from 'jszip';
import { Button, MenuItem, TextField } from '@mui/material';
import { generalQuery } from '../../../api/Api';

type TextBoxTextItem = {
  path: string;
  box: number;
  text: string;
};

type PromptPayload = {
  meta: {
    fileName: string;
    from: string;
    to: string;
    total: number;
  };
  textboxTexts: TextBoxTextItem[];
};

type TranslationPayload = {
  textboxTexts: TextBoxTextItem[];
};

const getTxBodiesInDocumentOrder = (doc: Document) => {
  const all = Array.from(doc.getElementsByTagName('*')) as Element[];
  return all.filter((el) => {
    const tag = (el.tagName || '').toLowerCase();
    return tag === 'p:txbody' || tag === 'a:txbody' || tag.endsWith(':txbody');
  });
};

const PROMPT_PRESETS = [
  { label: 'Mặc định', value: 'default', instruction: '' },
  { label: 'Báo cáo đối sách cải tiến', value: 'countermeasure', instruction: 'Dịch theo phong cách báo cáo kỹ thuật, cải tiến đối sách. Sử dụng thuật ngữ chuyên môn chính xác.' },
  { label: 'Thông báo, công văn', value: 'official', instruction: 'Dịch theo phong cách trang trọng của thông báo, công văn hành chính.' },
  { label: 'Quy trình chất lượng', value: 'quality', instruction: 'Dịch theo phong cách quy trình hệ thống chất lượng (ISO/IATF), đảm bảo rõ ràng, mạch lạc.' },
  { label: 'Văn bản pháp luật', value: 'legal', instruction: 'Dịch theo thuật ngữ pháp lý, hành văn trang trọng của văn bản luật, hợp đồng.' },
];

const PowerPointAITranslator = () => {
  const [fileName, setFileName] = useState<string>('');
  const [fromLang, setFromLang] = useState<string>('vi');
  const [toLang, setToLang] = useState<string>('en');
  const [backendModel, setBackendModel] = useState<string>('gemini-2.5-flash');
  const [backendTemperature, setBackendTemperature] = useState<number>(0.2);
  const [backendTranslating, setBackendTranslating] = useState<boolean>(false);
  const [promptPreset, setPromptPreset] = useState<string>('default');
  const [isBilingual, setIsBilingual] = useState<boolean>(false);

  const [textboxTexts, setTextboxTexts] = useState<TextBoxTextItem[]>([]);
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

  const extractTextBoxesFromXml = useCallback((path: string, xml: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const out: TextBoxTextItem[] = [];

    const bodies = getTxBodiesInDocumentOrder(doc);

    for (let box = 0; box < bodies.length; box++) {
      const body = bodies[box];
      const paragraphs = Array.from(body.getElementsByTagName('a:p'));

      const lines: string[] = [];
      for (const p of paragraphs) {
        const tNodes = Array.from(p.getElementsByTagName('a:t'));
        const line = tNodes.map((t) => t.textContent ?? '').join('');
        lines.push(line);
      }

      const text = lines.join('\n').replace(/\r\n/g, '\n');
      out.push({ path, box, text });
    }

    return out;
  }, []);

  const buildPrompt = useCallback((items: TextBoxTextItem[], fn: string, from: string, to: string) => {
    const payload: PromptPayload = {
      meta: {
        fileName: fn,
        from,
        to,
        total: items.length,
      },
      textboxTexts: items,
    };

    const schema: any = {
      textboxTexts: [{ path: 'ppt/slides/slide1.xml', box: 0, text: 'translated text (use \\n for line breaks)' }],
    };

    const presetObj = PROMPT_PRESETS.find(p => p.value === promptPreset);
    const presetInstruction = presetObj?.instruction ? `\n- Style: ${presetObj.instruction}` : '';
    const bilingualInstruction = isBilingual 
      ? `\n- Bilingual mode: Nếu đoạn văn bản đã có cả hai ngôn ngữ ${fromLang} và ${toLang}, hãy giữ nguyên. Nếu chỉ có một ngôn ngữ, hãy dịch sang ${toLang} và trình bày dưới dạng: [Ngôn ngữ gốc] / [Ngôn ngữ đích].`
      : `Nếu đoạn văn bản đã có cả hai ngôn ngữ ${fromLang} và ${toLang}, hãy giữ nguyên, Nếu chỉ có một ngôn ngữ, hãy dịch sang ${toLang}`;

    return [
      `You are an expert translator. Translate from ${from} to ${to}.`,
      `Return ONLY valid JSON matching this schema (no markdown, no extra keys):`,
      JSON.stringify(schema, null, 2),
      `Rules:`,
      `- Keep the SAME number of items as input.`,
      `- Keep each path exactly the same.`,
      `- Keep each box exactly the same for each path.`,
      `- Preserve placeholders like {0}, {name}, %s.`,
      `- Do not reorder items.`,
      `- Keep line breaks (\\n) to preserve slide paragraph breaks as much as possible.`,
      presetInstruction,
      bilingualInstruction,
      `Input JSON:`,
      JSON.stringify(payload, null, 2),
    ].filter(Boolean).join('\n');
  }, [promptPreset, isBilingual, fromLang, toLang]);

  const onUpload = useCallback(
    async (file: File) => {
      setFileName(file.name);
      setTextboxTexts([]);
      setPromptText('');
      setAiResponseText('');
      uploadedFileRef.current = file;

      const buf = await readFileAsArrayBuffer(file);
      const zip = await JSZip.loadAsync(buf);
      zipRef.current = zip;

      const slidePaths = Object.keys(zip.files).filter((p) => /^ppt\/slides\/slide\d+\.xml$/i.test(p));
      slidePaths.sort((a, b) => a.localeCompare(b));

      let items: TextBoxTextItem[] = [];
      for (const p of slidePaths) {
        const f = zip.file(p);
        if (!f) continue;
        const xml = await f.async('text');
        items = items.concat(extractTextBoxesFromXml(p, xml));
      }

      setTextboxTexts(items);
      const prompt = buildPrompt(items, file.name, fromLang, toLang);
      setPromptText(prompt);
    },
    [buildPrompt, extractTextBoxesFromXml, fromLang, toLang],
  );

  const applyTranslationPayloadToZip = useCallback(async (payload: TranslationPayload) => {
    const zip = zipRef.current;
    if (!zip) throw new Error('No pptx loaded');

    if (!payload?.textboxTexts || !Array.isArray(payload.textboxTexts)) {
      throw new Error('Missing textboxTexts array');
    }

    if (payload.textboxTexts.length !== textboxTexts.length) {
      throw new Error(
        `Length mismatch: expected ${textboxTexts.length} items, got ${payload.textboxTexts.length}`,
      );
    }

    const byPath = new Map<string, TextBoxTextItem[]>();
    for (const it of payload.textboxTexts) {
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

      const bodies = getTxBodiesInDocumentOrder(doc);

      items.sort((a, b) => a.box - b.box);
      for (const it of items) {
        const body = bodies[it.box];
        if (!body) continue;

        const paragraphs = Array.from(body.getElementsByTagName('a:p'));
        const translatedText = String(it.text ?? '').replace(/\r\n/g, '\n');
        const lines = translatedText.split('\n');

        for (let pi = 0; pi < paragraphs.length; pi++) {
          const pNode = paragraphs[pi];
          const tNodes = Array.from(pNode.getElementsByTagName('a:t'));
          if (tNodes.length === 0) continue;

          let line = lines[pi] ?? '';
          if (pi === paragraphs.length - 1 && lines.length > paragraphs.length) {
            line = [line, ...lines.slice(paragraphs.length)].filter((x) => x !== '').join('\n');
          }

          (tNodes[0] as Element).textContent = line;
          for (let ti = 1; ti < tNodes.length; ti++) {
            (tNodes[ti] as Element).textContent = '';
          }
        }
      }

      const serializer = new XMLSerializer();
      zip.file(p, serializer.serializeToString(doc));
    }
  }, [textboxTexts.length]);

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
      const prompt = promptText.trim()
        ? promptText
        : buildPrompt(textboxTexts, fileName || f.name, fromLang, toLang);

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

      if (!translated.textboxTexts) {
        throw new Error('Backend JSON missing textboxTexts');
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
    textboxTexts,
    toLang,
    promptPreset,
    isBilingual,
  ]);

  useEffect(() => {
    if (!textboxTexts.length) return;
    if (backendTranslating) return;

    const t = setTimeout(() => {
      setPromptText(buildPrompt(textboxTexts, fileName || 'slides.pptx', fromLang, toLang));
    }, 250);

    return () => clearTimeout(t);
  }, [
    textboxTexts,
    fileName,
    fromLang,
    toLang,
    promptPreset,
    isBilingual,
    buildPrompt,
    backendTranslating,
  ]);

  const stats = useMemo(() => {
    const total = textboxTexts.length;
    const nonEmpty = textboxTexts.filter((x) => (x.text ?? '').trim() !== '').length;
    return { total, nonEmpty };
  }, [textboxTexts]);

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

        <TextField
          select
          label="Prompt Preset"
          size="small"
          value={promptPreset}
          onChange={(e) => setPromptPreset(e.target.value)}
          style={{ width: 200 }}
        >
          {PROMPT_PRESETS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Bilingual"
          size="small"
          value={isBilingual ? 'yes' : 'no'}
          onChange={(e) => setIsBilingual(e.target.value === 'yes')}
          style={{ width: 140 }}
        >
          <MenuItem value="no">Không (Chỉ dịch)</MenuItem>
          <MenuItem value="yes">Có (Song ngữ)</MenuItem>
        </TextField>

        <div style={{ fontSize: 13 }}>
          <b>File:</b> {fileName || '(none)'} &nbsp; | &nbsp;<b>texts:</b> {stats.nonEmpty}/{stats.total}
        </div>

        <Button
          variant="outlined"
          onClick={() => {
            if (!textboxTexts.length) return;
            setPromptText(buildPrompt(textboxTexts, fileName || 'slides.pptx', fromLang, toLang));
          }}
          disabled={!textboxTexts.length}
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
