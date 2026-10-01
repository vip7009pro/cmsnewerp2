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
