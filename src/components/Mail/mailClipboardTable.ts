/**
 * Hỗ trợ DÁN BẢNG TỪ EXCEL vào nội dung email.
 *
 * Excel đặt nhiều định dạng lên clipboard: `text/html` (bảng + `<style>` với class `.xl65…`),
 * `text/plain` (TSV), và đôi khi cả ảnh bitmap. Trình duyệt chỉ đưa `text/html`/`text/plain`
 * nên bảng mất định dạng (mọi style nằm trong `<style>` bị sanitizer loại).
 *
 * Module này:
 *  1. `inspectPastedHtml` — phát hiện bảng + kích thước để hỏi người dùng cách dán.
 *  2. `preparePastedTableHtml` — "nhúng" (inline) CSS từ `<style>` vào từng ô để giữ định dạng.
 *  3. `renderHtmlToPngDataUrl` — kết xuất bảng thành ảnh PNG (dán dạng ảnh nguyên bản).
 */

/** Kết quả dò bảng trong clipboard. */
export interface PastedTableInfo {
  hasTable: boolean;
  rows: number;
  cols: number;
  /** HTML gốc từ clipboard (đã kiểm tra có bảng). */
  html: string;
}

/** Có `<table>` với tối thiểu 1 ô dữ liệu ⇒ coi là "dán bảng". */
export function inspectPastedHtml(html?: string | null): PastedTableInfo {
  const raw = String(html || "");
  const empty: PastedTableInfo = { hasTable: false, rows: 0, cols: 0, html: raw };
  if (!raw || !/<table[\s>]/i.test(raw) || typeof DOMParser === "undefined") return empty;

  const doc = new DOMParser().parseFromString(raw, "text/html");
  const table = doc.querySelector("table");
  if (!table) return empty;

  const rows = table.querySelectorAll("tr").length;
  const firstRow = table.querySelector("tr");
  const cols = firstRow ? firstRow.children.length : 0;
  return { hasTable: rows > 0 && cols > 0, rows, cols, html: raw };
}

/** Nhúng CSS từ các thẻ `<style>` vào thuộc tính `style` của từng phần tử (Excel dùng class `.xl65`). */
function inlineStyleSheets(doc: Document): void {
  const classRules = new Map<string, string>();
  const tagRules = new Map<string, string>();

  doc.querySelectorAll("style").forEach((styleEl) => {
    const css = styleEl.textContent || "";
    const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
    let match: RegExpExecArray | null;
    while ((match = rulePattern.exec(css))) {
      const declarations = match[2].trim();
      if (!declarations) continue;
      match[1]
        .split(",")
        .map((selector) => selector.trim())
        .forEach((selector) => {
          const classMatch = /^\.([A-Za-z0-9_-]+)$/.exec(selector);
          const tagMatch = /^([a-z][a-z0-9]*)$/.exec(selector);
          const target = classMatch ? classRules : tagMatch ? tagRules : null;
          const key = classMatch ? classMatch[1] : tagMatch ? tagMatch[1] : "";
          if (!target || !key) return; // bỏ selector phức tạp (`td.xl65`, `:hover`…)
          const previous = target.get(key) || "";
          const separator = previous && !previous.trim().endsWith(";") ? ";" : "";
          target.set(key, `${previous}${separator}${declarations}`);
        });
    }
  });

  if (classRules.size === 0 && tagRules.size === 0) return;

  const merge = (el: Element, declarations: string) => {
    if (!declarations) return;
    const existing = el.getAttribute("style") || "";
    const separator = existing && !existing.trim().endsWith(";") ? ";" : "";
    el.setAttribute("style", `${existing}${separator}${declarations}`);
  };

  // Rule theo thẻ trước (độ ưu tiên thấp hơn class).
  tagRules.forEach((declarations, tag) => {
    doc.querySelectorAll(tag).forEach((el) => merge(el, declarations));
  });
  doc.querySelectorAll("[class]").forEach((el) => {
    const classes = String(el.getAttribute("class") || "")
      .split(/\s+/)
      .filter(Boolean);
    const declarations = classes
      .map((name) => classRules.get(name) || "")
      .filter(Boolean)
      .join(";");
    merge(el, declarations);
  });
}

/** Tính tổng số ký tự "không phải bảng" trong body (để biết clipboard chỉ có bảng hay có cả nội dung khác). */
function nonTableTextLength(doc: Document): number {
  const clone = doc.body.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("table").forEach((table) => table.remove());
  return (clone.textContent || "").replace(/\s+/g, "").length;
}

/**
 * Chuẩn bị HTML bảng để chèn vào email:
 *  - nhúng CSS từ `<style>` vào inline style (giữ định dạng)
 *  - chỉ lấy phần bảng nếu clipboard chỉ có bảng (Excel chèn thêm comment/`&nbsp;` rác)
 */
export function preparePastedTableHtml(html?: string | null): string {
  const raw = String(html || "");
  if (!raw || typeof DOMParser === "undefined") return "";
  const doc = new DOMParser().parseFromString(raw, "text/html");
  inlineStyleSheets(doc);

  const tables = Array.from(doc.querySelectorAll("table"));
  if (tables.length === 0) return raw;

  // Clipboard chỉ có bảng (Excel) ⇒ bỏ text rác quanh bảng.
  if (nonTableTextLength(doc) === 0) {
    const holder = doc.createElement("div");
    tables.forEach((table) => holder.appendChild(table));
    return holder.innerHTML;
  }
  return doc.body.innerHTML;
}

/**
 * Kết xuất HTML thành ảnh PNG (dùng `foreignObject` của SVG — không cần thêm thư viện).
 * Trả về `null` nếu trình duyệt chặn (canvas bị "taint" hoặc không hỗ trợ).
 */
export async function renderHtmlToPngDataUrl(
  html: string,
  scale = 2
): Promise<{ dataUrl: string; width: number; height: number } | null> {
  if (!html || typeof document === "undefined") return null;
  const host = document.createElement("div");
  host.setAttribute(
    "style",
    "position:fixed;left:-10000px;top:0;background:#ffffff;padding:8px;display:inline-block;"
  );
  host.innerHTML = html;
  document.body.appendChild(host);

  try {
    const rect = host.getBoundingClientRect();
    const width = Math.max(1, Math.ceil(rect.width));
    const height = Math.max(1, Math.ceil(rect.height));
    if (width < 2 || height < 2) return null;

    const inner = new XMLSerializer().serializeToString(host);
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
      `<foreignObject x="0" y="0" width="${width}" height="${height}">` +
      `<div xmlns="http://www.w3.org/1999/xhtml">${inner}</div>` +
      `</foreignObject></svg>`;

    const image = new Image();
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    await image.decode();

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.drawImage(image, 0, 0);
    return { dataUrl: canvas.toDataURL("image/png"), width, height };
  } catch (error) {
    console.warn("[mail] không kết xuất được bảng thành ảnh:", (error as Error)?.message || error);
    return null;
  } finally {
    host.remove();
  }
}

/** Đọc 1 File ảnh thành data URL. */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Không đọc được tệp"));
    reader.readAsDataURL(file);
  });
}
