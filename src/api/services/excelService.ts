import * as XLSX from "xlsx";
import moment from "moment";

/**
 * Excel export service - extracted from GlobalFunction.tsx
 */
export const SaveExcel = (data: any, title: string) => {
  const EXCEL_MAX_COLS = 16384;
  const EXCEL_MAX_ROWS = 1048576;
  const MAX_CELLS_PER_SHEET = 12_200_000;
  const BATCH_ROWS = 500;

  const safeCellValue = (v: any) => {
    if (v == null) return '';
    const t = typeof v;
    if (t === 'string' || t === 'number' || t === 'boolean') return v;
    if (v instanceof Date) return moment(v).format('YYYY-MM-DD HH:mm:ss');
    try {
      const s = JSON.stringify(v);
      return s.length > 32760 ? s.slice(0, 32760) : s;
    } catch {
      return String(v);
    }
  };

  const chunkArray = <T,>(arr: T[], size: number) => {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  };

  const normalizeRows = (input: any) => {
    if (Array.isArray(input)) return input;
    if (input != null && typeof input === 'object') return [input];
    return [{ Value: input }];
  };

  const rows: any[] = normalizeRows(data);
  const workbook = XLSX.utils.book_new();

  if (rows.length === 0) {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([['No data']]), 'Sheet1');
    XLSX.writeFile(workbook, `${title}.xlsx`);
    return;
  }

  const headerSet = new Set<string>();
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (r == null || typeof r !== 'object' || Array.isArray(r)) {
      headerSet.add('Value');
      continue;
    }
    try {
      Object.keys(r).forEach((k) => headerSet.add(k));
    } catch {
      // ignore
    }
  }
  const headers = Array.from(headerSet);
  const baseHeaders = headers.length ? headers : ['Value'];
  const colChunks = chunkArray(baseHeaders, EXCEL_MAX_COLS);

  let sheetIndex = 1;

  for (let cci = 0; cci < colChunks.length; cci++) {
    const colChunk = colChunks[cci];
    const excelRowLimit = EXCEL_MAX_ROWS - 1;
    const byCells = Math.max(1, Math.floor(MAX_CELLS_PER_SHEET / Math.max(1, colChunk.length)));
    const rowsPerSheet = Math.max(1, Math.min(excelRowLimit, byCells));

    for (let start = 0; start < rows.length; start += rowsPerSheet) {
      const end = Math.min(rows.length, start + rowsPerSheet);
      const ws = XLSX.utils.aoa_to_sheet([colChunk], { dense: true } as any);

      for (let i = start; i < end; i += BATCH_ROWS) {
        const batchEnd = Math.min(end, i + BATCH_ROWS);
        const batch: any[][] = [];

        for (let ri = i; ri < batchEnd; ri++) {
          const r = rows[ri];
          if (r == null || typeof r !== 'object' || Array.isArray(r)) {
            const val = safeCellValue(r);
            batch.push(colChunk.map((h) => (h === 'Value' ? val : '')));
            continue;
          }
          batch.push(colChunk.map((h) => safeCellValue((r as any)[h])));
        }

        XLSX.utils.sheet_add_aoa(ws, batch, { origin: -1 } as any);
      }

      const name = `Sheet${sheetIndex}`;
      XLSX.utils.book_append_sheet(workbook, ws, name);
      sheetIndex++;
    }
  }

  XLSX.writeFile(workbook, `${title}.xlsx`);
};
