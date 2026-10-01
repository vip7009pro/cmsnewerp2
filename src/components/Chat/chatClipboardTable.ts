/**
 * Dán BẢNG từ Excel (hoặc bất kỳ nguồn nào có HTML <table>) vào chat.
 *
 * Khi người dùng copy một vùng bảng trong Excel rồi dán vào khung chat, clipboard có:
 *   - `text/html`  : bảng HTML đầy đủ (dùng để dựng ảnh).
 *   - `text/plain` : dữ liệu TSV (giữ nguyên để dán dạng chữ).
 *
 * Module này KHÔNG phụ thuộc thư viện ngoài: tự dựng HTML table → canvas → PNG.
 */

/** Clipboard có chứa bảng HTML hay không (ưu tiên nhận diện thẻ <table>). */
export function clipboardHasTable(data: DataTransfer | null): boolean {
  if (!data) return false;
  const html = data.getData("text/html") || "";
  return /<table[\s>]/i.test(html);
}

/** Đọc bảng HTML thành ma trận ô chữ (bỏ markup). Trả [] nếu không có bảng. */
export function extractTableGrid(html: string): string[][] {
  if (!html || typeof DOMParser === "undefined") return [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const table = doc.querySelector("table");
  if (!table) return [];

  const grid: string[][] = [];
  table.querySelectorAll("tr").forEach((row) => {
    const cells: string[] = [];
    row.querySelectorAll("th,td").forEach((cell) => {
      // Gộp khoảng trắng để ô không bị xuống dòng vô nghĩa.
      cells.push(String(cell.textContent || "").replace(/\s+/g, " ").trim());
    });
    // Bỏ hàng rỗng hoàn toàn (Excel hay sinh thêm).
    if (cells.some((value) => value !== "")) grid.push(cells);
  });
  return grid;
}

/** Ma trận ô → chuỗi TSV (dán dạng chữ, dán lại Excel vẫn ra bảng). */
export function gridToTsv(grid: string[][]): string {
  return grid.map((row) => row.join("\t")).join("\n");
}

/** Văn bản thuần của bảng (mỗi hàng 1 dòng, các ô cách nhau bằng dấu " | "). */
export function gridToText(grid: string[][]): string {
  return grid.map((row) => row.join(" | ")).join("\n");
}

const FONT_FAMILY =
  'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const CELL_FONT = `13px ${FONT_FAMILY}`;
const HEADER_FONT = `600 13px ${FONT_FAMILY}`;
const PADDING_X = 10;
const PADDING_Y = 7;
const MAX_COL_WIDTH = 420;

/**
 * Dựng ma trận ô thành ảnh PNG (trả về `File` để đưa vào luồng đính kèm chat).
 *
 * Vẽ thủ công trên canvas (thay vì render HTML) để ổn định và không phụ thuộc
 * `foreignObject` — vốn bị chặn ở một số trình duyệt khi vẽ ảnh.
 */
export async function renderGridToPngFile(
  grid: string[][],
  fileName = `bang-${Date.now()}.png`
): Promise<File | null> {
  if (grid.length === 0) return null;

  const columnCount = Math.max(...grid.map((row) => row.length));
  const scale = 2;
  const measure = document.createElement("canvas").getContext("2d");
  if (!measure) return null;

  // Độ rộng mỗi cột = max bề rộng chữ + padding (chặn trần để không quá khổ).
  const columnWidths: number[] = new Array(columnCount).fill(0);
  grid.forEach((row, rowIndex) => {
    const font = rowIndex === 0 ? HEADER_FONT : CELL_FONT;
    measure.font = font;
    for (let col = 0; col < columnCount; col += 1) {
      const width = measure.measureText(row[col] || "").width + PADDING_X * 2;
      columnWidths[col] = Math.min(MAX_COL_WIDTH, Math.max(columnWidths[col], width));
    }
  });

  const rowHeight = 15 + PADDING_Y * 2;
  const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0) + 1;
  const totalHeight = rowHeight * grid.length + 1;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(totalWidth));
  canvas.height = Math.max(1, Math.round(totalHeight));
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Nền trắng để dán vào nền tối vẫn đọc được.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textBaseline = "middle";

  let y = 0;
  grid.forEach((row, rowIndex) => {
    const isHeader = rowIndex === 0;
    if (isHeader) {
      ctx.fillStyle = "#f1f5f9";
      ctx.fillRect(0, y, canvas.width, rowHeight);
    }
    let x = 0;
    for (let col = 0; col < columnCount; col += 1) {
      const cellWidth = columnWidths[col];
      if (col > 0) {
        // Đường kẻ dọc.
        ctx.strokeStyle = "#e2e8f0";
        ctx.beginPath();
        ctx.moveTo(x + 0.5, y);
        ctx.lineTo(x + 0.5, y + rowHeight);
        ctx.stroke();
      }
      const text = row[col] || "";
      if (text) {
        ctx.font = isHeader ? HEADER_FONT : CELL_FONT;
        ctx.fillStyle = isHeader ? "#0f172a" : "#1e293b";
        // Cắt chữ quá dài cho vừa ô.
        let display = text;
        while (display.length > 1 && ctx.measureText(display).width > cellWidth - PADDING_X * 2) {
          display = display.slice(0, -1);
        }
        if (display !== text) display = `${display.slice(0, -1)}…`;
        ctx.fillText(display, x + PADDING_X, y + rowHeight / 2);
      }
      x += cellWidth;
    }
    // Đường kẻ ngang.
    ctx.strokeStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(canvas.width, y + 0.5);
    ctx.stroke();
    y += rowHeight;
  });

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((result) => resolve(result), "image/png")
  );
  if (!blob) return null;
  return new File([blob], fileName, { type: "image/png" });
}

/* ------------------------------------------------------------------ */
/* Dựng ảnh GIỐNG HỆT bảng Excel (giữ định dạng, màu, gộp ô, font)     */
/* ------------------------------------------------------------------ */

/** Bỏ script/iframe và thuộc tính nguy hiểm khỏi HTML clipboard trước khi render. */
function sanitizeClipboardHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<\s*(script|iframe|object|embed|link|meta)[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|iframe|object|embed|link|meta)[^>]*\/?>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript:/gi, "");
}

/**
 * Chuyển các khai báo CSS ĐẶC THÙ EXCEL về CSS chuẩn để trình duyệt hiểu:
 *  - `windowtext` (màu hệ thống, Chrome không hỗ trợ) → `#000000`.
 *  - `mso-border-top-alt: solid windowtext .5pt` (Chrome BỎ QUA ⇒ mất đường kẻ!)
 *    → `border-top: .5pt solid #000000` (và giữ nguyên vị trí để ghi đè `border-*:none`).
 */
function translateExcelStyles(html: string): string {
  return html
    .replace(/windowtext/gi, "#000000")
    // `mso-hide:all` = phần tử bị ẩn trong Excel (Chrome bỏ qua) ⇒ display:none.
    .replace(/mso-hide\s*:\s*all/gi, "display:none")
    .replace(
      /mso-border-(?:(top|right|bottom|left)-)?alt\s*:\s*([a-z]+)\s+(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|[a-zA-Z]+)\s+([\d.]+(?:pt|px|in|cm|mm))/gi,
      (_match, side: string | undefined, style: string, color: string, width: string) =>
        `${side ? `border-${side.toLowerCase()}` : "border"}: ${width} ${style} ${color}`
    );
}

/**
 * Dựng ảnh PNG từ HTML bảng (clipboard Excel) — GIỐNG bảng Excel:
 * màu nền ô, đường kẻ, font, gộp ô, canh lề, xuống dòng trong ô.
 *
 * ⚠️ KHÔNG dùng `SVG <foreignObject>` + `<img>` để rasterize: Chrome ĐÁNH DẤU (taint)
 * canvas khi vẽ ảnh SVG có foreignObject ⇒ `toBlob` ném SecurityError ⇒ ảnh không tạo được.
 * Thay vào đó: render bảng ra DOM để đo hình học thật, rồi ĐỌC `getComputedStyle`
 * từng ô và tự vẽ lên canvas (nền → viền → chữ). Trả `null` nếu không có bảng.
 */
export async function renderTableHtmlToPngFile(
  html: string,
  fileName = `bang-${Date.now()}.png`
): Promise<File | null> {
  if (!html || typeof document === "undefined") return null;
  // Excel dùng màu hệ thống `windowtext` + thuộc tính `mso-border-*-alt` mà Chrome BỎ QUA
  // ⇒ chuyển về CSS chuẩn, nếu không bảng sẽ MẤT hết đường kẻ/viền.
  const safe = translateExcelStyles(sanitizeClipboardHtml(html));

  const holder = document.createElement("div");
  holder.setAttribute("aria-hidden", "true");
  holder.style.cssText =
    "position:fixed;left:-10000px;top:0;background:#fff;padding:0;margin:0;z-index:-1;";
  holder.innerHTML = safe;
  document.body.appendChild(holder);

  // Vẽ ĐỒNG BỘ rồi gỡ holder NGAY (CSS của Excel chỉ tồn tại trong lúc vẽ, không kịp "rò" ra app).
  let canvas: HTMLCanvasElement | null = null;
  try {
    const table = holder.querySelector("table");
    if (!table) return null;

    const tableRect = table.getBoundingClientRect();
    const width = Math.max(1, Math.ceil(tableRect.width || table.scrollWidth));
    const height = Math.max(1, Math.ceil(tableRect.height || table.scrollHeight));

    // Canvas có giới hạn kích thước (~16k px) ⇒ giảm scale nếu bảng quá lớn.
    const scale = Math.max(1, Math.min(2, 8000 / width, 8000 / height));

    canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.scale(scale, scale);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    const num = (value: string) => parseFloat(value) || 0;
    const isVisible = (color: string) =>
      Boolean(color) && color !== "transparent" && color !== "rgba(0, 0, 0, 0)";

    // Nguồn CÓ khai báo viền? (để biết có nên vẽ lưới dự phòng khi không đọc được viền)
    const sourceHadBorders =
      /mso-border-[^;:]*alt\s*:/i.test(html) ||
      /border[^:;]*:\s*[^;]*\b(solid|double|dashed|dotted)\b/i.test(html);
    let drewAnyBorder = false;
    const cellRects: { x: number; y: number; w: number; h: number }[] = [];

    const cells = table.querySelectorAll("td, th");
    cells.forEach((cell) => {
      const rect = cell.getBoundingClientRect();
      const x = rect.left - tableRect.left;
      const y = rect.top - tableRect.top;
      const w = rect.width;
      const h = rect.height;
      const cs = window.getComputedStyle(cell);

      // BỎ QUA dòng/cột bị ẨN trong Excel: hàng chứa ô bị `display:none`/
      // `mso-hide:all` (đã dịch) hoặc có kích thước 0 ⇒ không vẽ ra ảnh.
      const row = cell.parentElement;
      const rowCs = row ? window.getComputedStyle(row) : null;
      const hidden =
        cs.display === "none" ||
        cs.visibility === "hidden" ||
        (rowCs !== null && (rowCs.display === "none" || rowCs.visibility === "hidden")) ||
        w <= 0 ||
        h <= 0;
      if (hidden) return;

      cellRects.push({ x, y, w, h });

      // 1) Nền ô
      if (isVisible(cs.backgroundColor)) {
        ctx.fillStyle = cs.backgroundColor;
        ctx.fillRect(x, y, w, h);
      }

      // 2) Viền 4 cạnh
      const sides: [string, number, number, number, number][] = [
        ["borderTop", x, y, x + w, y],
        ["borderRight", x + w, y, x + w, y + h],
        ["borderBottom", x, y + h, x + w, y + h],
        ["borderLeft", x, y, x, y + h],
      ];
      sides.forEach(([key, x1, y1, x2, y2]) => {
        const bw = num(cs.getPropertyValue(`${key}Width`));
        const bs = cs.getPropertyValue(`${key}Style`);
        if (bw > 0 && bs && bs !== "none" && bs !== "hidden") {
          const color = cs.getPropertyValue(`${key}Color`);
          if (isVisible(color)) {
            drewAnyBorder = true;
            ctx.strokeStyle = color;
            // Viền Excel thường 0.5pt (~0.67px) ⇒ nâng tối thiểu 1px cho rõ.
            ctx.lineWidth = Math.max(bw, 1);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      });

      // 3) Chữ (tự ngắt dòng theo bề rộng ô)
      const text = String(cell.textContent || "").replace(/\s+/g, " ").trim();
      if (!text) return;
      ctx.fillStyle = cs.color || "#000000";
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      ctx.textBaseline = "middle";
      const align =
        cs.textAlign === "center"
          ? "center"
          : cs.textAlign === "right" || cs.textAlign === "end"
            ? "right"
            : "left";
      ctx.textAlign = align;

      const padL = num(cs.paddingLeft);
      const padR = num(cs.paddingRight);
      const avail = Math.max(1, w - padL - padR);
      const words = text.split(" ");
      const lines: string[] = [];
      let line = "";
      words.forEach((word) => {
        const candidate = line ? `${line} ${word}` : word;
        if (ctx.measureText(candidate).width > avail && line) {
          lines.push(line);
          line = word;
        } else {
          line = candidate;
        }
      });
      if (line) lines.push(line);

      const lineHeight = num(cs.lineHeight) || num(cs.fontSize) * 1.25;
      const blockHeight = lines.length * lineHeight;
      let ty = y + Math.max(0, (h - blockHeight) / 2) + lineHeight / 2;
      const tx = align === "center" ? x + w / 2 : align === "right" ? x + w - padR : x + padL;
      lines.forEach((ln) => {
        ctx.fillText(ln, tx, ty);
        ty += lineHeight;
      });
    });

    // Dự phòng: nguồn CÓ viền nhưng trình duyệt không đọc được cạnh nào (CSS Excel lạ)
    // ⇒ vẽ lưới đen mảnh theo đúng ô để bảng vẫn có đường kẻ như Excel.
    if (!drewAnyBorder && sourceHadBorders) {
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1;
      cellRects.forEach(({ x, y, w, h }) => {
        ctx.strokeRect(x + 0.5, y + 0.5, w, h);
      });
    }
  } catch {
    return null;
  } finally {
    if (holder.parentNode) holder.parentNode.removeChild(holder);
  }

  if (!canvas) return null;
  const target = canvas;
  const blob = await new Promise<Blob | null>((resolve) =>
    target.toBlob((result) => resolve(result), "image/png")
  );
  if (!blob) return null;
  return new File([blob], fileName, { type: "image/png" });
}
