import { useCallback, useMemo, useRef, useState } from 'react';
import JSZip from 'jszip';
import { Button, MenuItem, TextField } from '@mui/material';
import { generalQuery } from '../../api/Api';

type SharedStringItem = {
  i: number;
  text: string;
};

type InlineStringItem = {
  sheet: string;
  cell: string;
  i: number;
  text: string;
};

type ShapeTextItem = {
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
    mode: 'sharedStrings' | 'all';
  };
  sharedStrings: SharedStringItem[];
  inlineStrings?: InlineStringItem[];
  shapeTexts?: ShapeTextItem[];
};

type TranslationPayload = {
  sharedStrings: SharedStringItem[];
  inlineStrings?: InlineStringItem[];
  shapeTexts?: ShapeTextItem[];
};

type TranslationMode = 'sharedStrings' | 'all';

const ExcelAITranslator = () => {
  const [fileName, setFileName] = useState<string>('');
  const [fromLang, setFromLang] = useState<string>('vi');
  const [toLang, setToLang] = useState<string>('en');
  const [mode, setMode] = useState<TranslationMode>('sharedStrings');
  const [backendModel, setBackendModel] = useState<string>('gemini-2.5-flash');
  const [backendTemperature, setBackendTemperature] = useState<number>(0.2);
  const [backendTranslating, setBackendTranslating] = useState<boolean>(false);

  const [sharedStrings, setSharedStrings] = useState<SharedStringItem[]>([]);
  const [inlineStrings, setInlineStrings] = useState<InlineStringItem[]>([]);
  const [shapeTexts, setShapeTexts] = useState<ShapeTextItem[]>([]);
  const [promptText, setPromptText] = useState<string>('');
  const [aiResponseText, setAiResponseText] = useState<string>('');

  const zipRef = useRef<JSZip | null>(null);
  const sharedStringsPathRef = useRef<string>('xl/sharedStrings.xml');

  const sheetXmlCacheRef = useRef<Map<string, string>>(new Map());
  const uploadedFileRef = useRef<File | null>(null);

  const readFileAsArrayBuffer = (file: File) => {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    let binary = '';
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
  };

  const extractSharedStrings = useCallback((xml: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');

    const siNodes = Array.from(doc.getElementsByTagName('si'));
    const out: SharedStringItem[] = [];

    for (let i = 0; i < siNodes.length; i++) {
      const si = siNodes[i];
      const tNodes = Array.from(si.getElementsByTagName('t'));

      const text = tNodes
        .map((t) => (t.textContent ?? ''))
        .join('')
        .replace(/\r\n/g, '\n');

      out.push({ i, text });
    }

    return { doc, siNodes, out };
  }, []);

  const extractShapeTextsFromXml = useCallback((path: string, xml: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const out: ShapeTextItem[] = [];
    let idx = 0;

    const isVml = /vmlDrawing\d+\.vml$/i.test(path);
    if (isVml) {
      const tNodes = Array.from(doc.getElementsByTagName('w:t'));
      for (const t of tNodes) {
        const text = (t.textContent ?? '').replace(/\r\n/g, '\n');
        out.push({ path, i: idx, text });
        idx++;
      }
      return out;
    }

    // drawing*.xml (xdr + a namespaces): collect all a:t (usually inside txBody)
    const aTNodes = Array.from(doc.getElementsByTagName('a:t'));
    for (const t of aTNodes) {
      const text = (t.textContent ?? '').replace(/\r\n/g, '\n');
      out.push({ path, i: idx, text });
      idx++;
    }
    return out;
  }, []);

  const extractInlineStringsFromSheet = useCallback((sheetPath: string, xml: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');

    // inline string: <c t="inlineStr"><is>...<t>TEXT</t>...</is></c>
    const cNodes = Array.from(doc.getElementsByTagName('c')) as Element[];
    const out: InlineStringItem[] = [];
    let idx = 0;
    for (const c of cNodes) {
      const tAttr = c.getAttribute('t');
      if (tAttr !== 'inlineStr') continue;
      const r = c.getAttribute('r') ?? '';
      const isNodes = Array.from(c.getElementsByTagName('is'));
      if (isNodes.length === 0) continue;
      const tNodes = Array.from(isNodes[0].getElementsByTagName('t'));
      const text = tNodes
        .map((t) => (t.textContent ?? ''))
        .join('')
        .replace(/\r\n/g, '\n');
      out.push({ sheet: sheetPath, cell: r, i: idx, text });
      idx++;
    }
    return { doc, out };
  }, []);

  const buildPrompt = useCallback(
    (
      items: SharedStringItem[],
      inline: InlineStringItem[],
      shapes: ShapeTextItem[],
      fn: string,
      from: string,
      to: string,
      m: TranslationMode,
    ) => {
      const payload: PromptPayload = {
        meta: {
          fileName: fn,
          from,
          to,
          total: items.length,
          mode: m,
        },
        sharedStrings: items,
        ...(m === 'all' ? { inlineStrings: inline, shapeTexts: shapes } : {}),
      };

      const schema: any = {
        sharedStrings: [{ i: 0, text: 'translated text' }],
      };
      if (m === 'all') {
        schema.inlineStrings = [{ sheet: 'xl/worksheets/sheet1.xml', cell: 'A1', i: 0, text: 'translated text' }];
        schema.shapeTexts = [{ path: 'xl/drawings/drawing1.xml', i: 0, text: 'translated text' }];
      }

      return [
        `You are an expert translator. Translate from ${from} to ${to}.`,
        `Return ONLY valid JSON matching this schema (no markdown, no extra keys):`,
        JSON.stringify(schema, null, 2),
        `Rules:`,
        `- Keep the SAME number of items as input.`,
        `- Keep each i exactly the same.`,
        `- Preserve placeholders like {0}, {name}, %s, and Excel-like tokens.`,
        `- Do not reorder items.`,
        `Input JSON:`,
        JSON.stringify(payload, null, 2),
      ].join('\n');
    },
    [],
  );

  const onUpload = useCallback(
    async (file: File) => {
      setFileName(file.name);
      setSharedStrings([]);
      setInlineStrings([]);
      setShapeTexts([]);
      setPromptText('');
      setAiResponseText('');
      sheetXmlCacheRef.current = new Map();
      uploadedFileRef.current = file;

      const buf = await readFileAsArrayBuffer(file);
      const zip = await JSZip.loadAsync(buf);
      zipRef.current = zip;

      const path = sharedStringsPathRef.current;
      const ssFile = zip.file(path);
      if (!ssFile) {
        throw new Error(`Cannot find ${path}. This workbook may not use sharedStrings.`);
      }

      const ssXml = await ssFile.async('text');
      const { out } = extractSharedStrings(ssXml);
      setSharedStrings(out);

      let inline: InlineStringItem[] = [];
      let shapes: ShapeTextItem[] = [];
      if (mode === 'all') {
        const sheetPaths = Object.keys(zip.files).filter((p) => /^xl\/worksheets\/sheet\d+\.xml$/i.test(p));
        sheetPaths.sort((a, b) => a.localeCompare(b));
        for (const p of sheetPaths) {
          const sheetFile = zip.file(p);
          if (!sheetFile) continue;
          const sheetXml = await sheetFile.async('text');
          sheetXmlCacheRef.current.set(p, sheetXml);
          const { out: list } = extractInlineStringsFromSheet(p, sheetXml);
          inline = inline.concat(list);
        }

        const shapePaths = Object.keys(zip.files).filter(
          (p) => /^xl\/drawings\/drawing\d+\.xml$/i.test(p) || /^xl\/drawings\/vmlDrawing\d+\.vml$/i.test(p),
        );
        shapePaths.sort((a, b) => a.localeCompare(b));
        for (const p of shapePaths) {
          const f = zip.file(p);
          if (!f) continue;
          const xml = await f.async('text');
          shapes = shapes.concat(extractShapeTextsFromXml(p, xml));
        }
      }
      setInlineStrings(inline);

      setShapeTexts(shapes);

      const prompt = buildPrompt(out, inline, shapes, file.name, fromLang, toLang, mode);
      setPromptText(prompt);
    },
    [
      buildPrompt,
      extractInlineStringsFromSheet,
      extractShapeTextsFromXml,
      extractSharedStrings,
      fromLang,
      mode,
      toLang,
    ],
  );

  const applyTranslationPayloadToZip = useCallback(
    async (payload: TranslationPayload) => {
      const zip = zipRef.current;
      if (!zip) throw new Error('No workbook loaded');

      const path = sharedStringsPathRef.current;
      const ssFile = zip.file(path);
      if (!ssFile) throw new Error(`Cannot find ${path}`);

      if (!payload?.sharedStrings || !Array.isArray(payload.sharedStrings)) {
        throw new Error('Missing sharedStrings array');
      }

      const ssXml = await ssFile.async('text');
      const { doc, siNodes, out: current } = extractSharedStrings(ssXml);

      if (payload.sharedStrings.length !== current.length) {
        throw new Error(`Length mismatch: expected ${current.length} items, got ${payload.sharedStrings.length}`);
      }

      for (let i = 0; i < payload.sharedStrings.length; i++) {
        const item = payload.sharedStrings[i];
        if (item?.i !== i) {
          throw new Error(`Index mismatch at position ${i}. Expected i=${i} but got i=${item?.i}`);
        }

        const si = siNodes[i];
        const tNodes = Array.from(si.getElementsByTagName('t'));
        const nextText = (item.text ?? '').replace(/\r\n/g, '\n');

        if (tNodes.length === 0) {
          const t = doc.createElement('t');
          t.textContent = nextText;
          si.appendChild(t);
        } else {
          tNodes[0].textContent = nextText;
          for (let k = 1; k < tNodes.length; k++) tNodes[k].textContent = '';
        }
      }

      const serializer = new XMLSerializer();
      const newXml = serializer.serializeToString(doc);
      zip.file(path, newXml);

      if (mode === 'all') {
        const inline = payload.inlineStrings;
        if (!inline || !Array.isArray(inline)) {
          throw new Error('Missing inlineStrings array (mode=all)');
        }

        const bySheet = new Map<string, InlineStringItem[]>();
        for (const it of inline) {
          if (!it || typeof it.sheet !== 'string') continue;
          const cur = bySheet.get(it.sheet) ?? [];
          cur.push(it);
          bySheet.set(it.sheet, cur);
        }

        for (const [sheetPath, items] of bySheet.entries()) {
          const sheetFile = zip.file(sheetPath);
          if (!sheetFile) continue;
          const sheetXml = sheetXmlCacheRef.current.get(sheetPath) ?? (await sheetFile.async('text'));
          const parser = new DOMParser();
          const sheetDoc = parser.parseFromString(sheetXml, 'application/xml');

          const perCell = new Map<string, InlineStringItem[]>();
          for (const it of items) {
            const key = `${it.cell}`;
            const cur = perCell.get(key) ?? [];
            cur.push(it);
            perCell.set(key, cur);
          }

          for (const [cell, cellItems] of perCell.entries()) {
            cellItems.sort((a, b) => a.i - b.i);

            const cNode = Array.from(sheetDoc.getElementsByTagName('c')).find(
              (c) => (c as Element).getAttribute('r') === cell,
            ) as Element | undefined;
            if (!cNode) continue;
            if (cNode.getAttribute('t') !== 'inlineStr') continue;

            const isNode = cNode.getElementsByTagName('is')[0];
            if (!isNode) continue;
            const tNodes = Array.from(isNode.getElementsByTagName('t'));
            const nextText = (cellItems[0]?.text ?? '').replace(/\r\n/g, '\n');
            if (tNodes.length === 0) {
              const t = sheetDoc.createElement('t');
              t.textContent = nextText;
              isNode.appendChild(t);
            } else {
              tNodes[0].textContent = nextText;
              for (let k = 1; k < tNodes.length; k++) tNodes[k].textContent = '';
            }
          }

          const newSheetXml = serializer.serializeToString(sheetDoc);
          zip.file(sheetPath, newSheetXml);
        }

        const shapeItems = payload.shapeTexts;
        if (shapeItems && Array.isArray(shapeItems) && shapeItems.length > 0) {
          const byPath = new Map<string, ShapeTextItem[]>();
          for (const it of shapeItems) {
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

            const isVml = /vmlDrawing\d+\.vml$/i.test(p);
            const tNodes = isVml
              ? Array.from(doc.getElementsByTagName('w:t'))
              : Array.from(doc.getElementsByTagName('a:t'));

            items.sort((a, b) => a.i - b.i);
            for (const it of items) {
              const node = tNodes[it.i] as Element | undefined;
              if (!node) continue;
              node.textContent = (it.text ?? '').replace(/\r\n/g, '\n');
            }

            const serializer = new XMLSerializer();
            zip.file(p, serializer.serializeToString(doc));
          }
        }
      }
    },
    [extractSharedStrings, mode],
  );

  const applyTranslationsAndZip = useCallback(async () => {
    const zip = zipRef.current;
    if (!zip) throw new Error('No workbook loaded');

    const path = sharedStringsPathRef.current;
    const ssFile = zip.file(path);
    if (!ssFile) throw new Error(`Cannot find ${path}`);

    let parsed: TranslationPayload;
    try {
      parsed = JSON.parse(aiResponseText);
    } catch (e: any) {
      throw new Error('AI response is not valid JSON');
    }

    await applyTranslationPayloadToZip(parsed);

    const outBuf = await zip.generateAsync({ type: 'blob' });
    const outName = fileName ? fileName.replace(/\.xlsx$/i, '') + `_translated.xlsx` : 'translated.xlsx';

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
        : buildPrompt(sharedStrings, inlineStrings, shapeTexts, fileName || f.name, fromLang, toLang, mode);

      const resp: any = await generalQuery('gemini_prompt', {
        prompt,
        model: backendModel,
        temperature: backendTemperature,
      });
      if (resp?.data?.tk_status?.toUpperCase() === 'NG') {
        throw new Error(resp?.data?.message ?? 'Backend error');
      }

      const raw =
        resp?.data?.data?.response ??
        resp?.data?.data?.result ??
        resp?.data?.data?.text ??
        resp?.data?.data;

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

      if (!translated.sharedStrings) {
        throw new Error('Backend JSON missing sharedStrings');
      }

      setAiResponseText(JSON.stringify(translated, null, 2));
      await applyTranslationPayloadToZip(translated as TranslationPayload);

      const zip = zipRef.current;
      if (!zip) throw new Error('No workbook loaded');
      const outBuf = await zip.generateAsync({ type: 'blob' });
      const outName = fileName ? fileName.replace(/\.xlsx$/i, '') + `_translated.xlsx` : 'translated.xlsx';

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
    inlineStrings,
    mode,
    promptText,
    shapeTexts,
    sharedStrings,
    toLang,
  ]);

  const stats = useMemo(() => {
    const total = sharedStrings.length;
    const nonEmpty = sharedStrings.filter((x) => (x.text ?? '').trim() !== '').length;
    const inlineTotal = inlineStrings.length;
    const inlineNonEmpty = inlineStrings.filter((x) => (x.text ?? '').trim() !== '').length;
    const shapeTotal = shapeTexts.length;
    const shapeNonEmpty = shapeTexts.filter((x) => (x.text ?? '').trim() !== '').length;
    return { total, nonEmpty, inlineTotal, inlineNonEmpty, shapeTotal, shapeNonEmpty };
  }, [inlineStrings, shapeTexts, sharedStrings]);

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
          Upload .xlsx
          <input
            type="file"
            hidden
            accept=".xlsx"
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
          select
          label="Mode"
          size="small"
          value={mode}
          onChange={(e) => setMode(e.target.value as TranslationMode)}
          style={{ width: 220 }}
        >
          <MenuItem value={'sharedStrings'}>sharedStrings only</MenuItem>
          <MenuItem value={'all'}>all (sharedStrings + inlineStr)</MenuItem>
        </TextField>

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
          <b>File:</b> {fileName || '(none)'} &nbsp; | &nbsp;
          <b>sharedStrings:</b> {stats.nonEmpty}/{stats.total}
          {mode === 'all' && (
            <>
              &nbsp; | &nbsp;<b>inlineStr:</b> {stats.inlineNonEmpty}/{stats.inlineTotal}
              &nbsp; | &nbsp;<b>textboxes:</b> {stats.shapeNonEmpty}/{stats.shapeTotal}
            </>
          )}
        </div>

        <Button
          variant="outlined"
          onClick={() => {
            if (!sharedStrings.length) return;
            setPromptText(
              buildPrompt(sharedStrings, inlineStrings, shapeTexts, fileName || 'workbook.xlsx', fromLang, toLang, mode),
            );
          }}
          disabled={!sharedStrings.length}
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
          Download translated .xlsx
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

export default ExcelAITranslator;
