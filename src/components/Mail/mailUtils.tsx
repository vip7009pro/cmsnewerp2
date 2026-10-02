import moment from "moment";
import type { MailAddress } from "./mail.types";

/**
 * Định dạng thời gian email.
 * DB dùng GETDATE() (giờ VN) + driver `useUTC:true` ⇒ các thành phần UTC của Date
 * chính là giờ VN ⇒ đọc thẳng bằng moment.utc (giống chatUtils.vnMoment).
 */
export function mailMoment(value?: string | null) {
  return value ? moment.utc(value) : null;
}

export function formatMailTime(value?: string | null): string {
  const m = mailMoment(value);
  if (!m) return "";
  const now = moment.utc();
  if (m.isSame(now, "day")) return m.format("HH:mm");
  if (m.isSame(now, "year")) return m.format("DD/MM");
  return m.format("DD/MM/YYYY");
}

export function formatMailFull(value?: string | null): string {
  const m = mailMoment(value);
  return m ? m.format("DD/MM/YYYY HH:mm") : "";
}

export function formatBytes(bytes?: number | null): string {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function addressLabel(addr?: MailAddress | null): string {
  if (!addr) return "(Không rõ)";
  return addr.name?.trim() || addr.address || "(Không rõ)";
}

export function addressEmail(addr?: MailAddress | null): string {
  return addr?.address || "";
}

export function initialsOf(text?: string | null): string {
  const value = String(text || "").trim();
  if (!value) return "?";
  const source = value.includes("@") ? value.split("@")[0] : value;
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Icon Material theo thư mục. */
export function folderIcon(key: string): string {
  switch (key) {
    case "INBOX":
      return "inbox";
    case "STARRED":
      return "star";
    case "SENT":
      return "send";
    case "DRAFT":
      return "draft";
    case "ARCHIVE":
      return "archive";
    case "SPAM":
      return "report";
    case "TRASH":
      return "delete";
    default:
      return "folder";
  }
}

/** Icon theo loại tệp đính kèm (ưu tiên đuôi tệp). */
export function attachmentIcon(fileName?: string | null, contentType?: string | null): string {
  const name = String(fileName || "").toLowerCase();
  const ext = name.includes(".") ? name.split(".").pop() || "" : "";
  const type = String(contentType || "").toLowerCase();
  if (type.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"].includes(ext)) return "image";
  if (ext === "pdf" || type.includes("pdf")) return "picture_as_pdf";
  if (["xls", "xlsx", "csv"].includes(ext) || type.includes("sheet") || type.includes("excel")) return "table_chart";
  if (["doc", "docx"].includes(ext) || type.includes("word")) return "description";
  if (["ppt", "pptx"].includes(ext) || type.includes("presentation")) return "slideshow";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "folder_zip";
  return "attach_file";
}

/** Bỏ tiền tố Re:/Fwd: để hiển thị tiêu đề hội thoại gọn. */
export function stripSubjectPrefix(subject?: string | null): string {
  return String(subject || "").replace(/^\s*((re|fwd?|tr|aw)\s*(\[\d+\])?\s*:\s*)+/gi, "").trim() || "(Không có tiêu đề)";
}

/** Kết quả tách cú pháp tìm kiếm của người dùng. */
export interface ParsedMailQuery {
  terms: string[];
  filters: {
    from?: string;
    to?: string;
    subject?: string;
    body?: string;
    filename?: string;
    hasAttachment?: boolean;
    isUnread?: boolean;
    isRead?: boolean;
    isStarred?: boolean;
    after?: string;
    before?: string;
  };
  /** Cảnh báo cú pháp (ví dụ `after:` sai định dạng) — hiển thị cho người dùng. */
  warnings: string[];
}

/**
 * Tách cú pháp tìm kiếm nâng cao: `from:`, `to:`, `subject:`, `body:`, `filename:`,
 * `has:attachment`, `is:unread|read|starred`, `after:YYYY-MM-DD`, `before:YYYY-MM-DD`.
 * Từ còn lại (và các cụm trong dấu `"`) trở thành từ khoá.
 */
export function parseMailQuery(input: string): ParsedMailQuery {
  const result: ParsedMailQuery = { terms: [], filters: {}, warnings: [] };
  const text = String(input || "").trim();
  if (!text) return result;

  // Tôn trọng cụm trong dấu ngoặc kép (`"bao cao"`).
  const tokens = text.match(/"[^"]*"|\S+/g) || [];
  const isDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isNaN(new Date(value).getTime());

  for (const token of tokens) {
    const match = /^(from|to|subject|body|filename|has|is|after|before):(.*)$/i.exec(token);
    if (!match) {
      result.terms.push(token.replace(/^"|"$/g, ""));
      continue;
    }
    const key = match[1].toLowerCase();
    const value = match[2].replace(/^"|"$/g, "").trim();
    if (!value) {
      result.warnings.push(`Thiếu giá trị cho "${key}:"`);
      continue;
    }
    switch (key) {
      case "from":
        result.filters.from = value;
        break;
      case "to":
        result.filters.to = value;
        break;
      case "subject":
        result.filters.subject = value;
        break;
      case "body":
        result.filters.body = value;
        break;
      case "filename":
        result.filters.filename = value;
        break;
      case "has":
        if (/^attachment/i.test(value)) result.filters.hasAttachment = true;
        else result.warnings.push(`"has:${value}" không hỗ trợ (chỉ có has:attachment)`);
        break;
      case "is": {
        const flag = value.toLowerCase();
        if (flag === "unread") result.filters.isUnread = true;
        else if (flag === "read") result.filters.isRead = true;
        else if (flag === "starred") result.filters.isStarred = true;
        else result.warnings.push(`"is:${value}" không hỗ trợ`);
        break;
      }
      case "after":
      case "before":
        if (isDate(value)) result.filters[key] = value;
        else result.warnings.push(`Ngày "${value}" không hợp lệ (dùng YYYY-MM-DD)`);
        break;
      default:
        result.terms.push(token);
    }
  }
  return result;
}

/** Nhãn ngắn gọn cho các bộ lọc đang áp dụng (hiển thị dưới ô tìm kiếm). */
export function describeMailFilters(filters: ParsedMailQuery["filters"]): { key: string; label: string }[] {
  const chips: { key: keyof ParsedMailQuery["filters"]; label: string }[] = [];
  if (filters.from) chips.push({ key: "from", label: `Từ: ${filters.from}` });
  if (filters.to) chips.push({ key: "to", label: `Đến: ${filters.to}` });
  if (filters.subject) chips.push({ key: "subject", label: `Tiêu đề: ${filters.subject}` });
  if (filters.body) chips.push({ key: "body", label: `Nội dung: ${filters.body}` });
  if (filters.filename) chips.push({ key: "filename", label: `Tệp: ${filters.filename}` });
  if (filters.hasAttachment) chips.push({ key: "hasAttachment", label: "Có đính kèm" });
  if (filters.isUnread) chips.push({ key: "isUnread", label: "Chưa đọc" });
  if (filters.isRead) chips.push({ key: "isRead", label: "Đã đọc" });
  if (filters.isStarred) chips.push({ key: "isStarred", label: "Có gắn sao" });
  if (filters.after) chips.push({ key: "after", label: `Sau: ${filters.after}` });
  if (filters.before) chips.push({ key: "before", label: `Trước: ${filters.before}` });
  return chips;
}

/** Đuôi tệp (chữ thường, không dấu chấm). */
export function fileExtension(fileName?: string | null): string {
  const name = String(fileName || "");
  const dot = name.lastIndexOf(".");
  return dot > -1 ? name.slice(dot + 1).toLowerCase() : "";
}

/** Đuôi tệp thực thi được ⇒ cảnh báo người dùng (khớp danh sách BE). */
const DANGEROUS_EXT = new Set([
  "exe", "com", "scr", "pif", "bat", "cmd", "msi", "msp", "cpl", "hta", "jar", "lnk", "reg", "sys",
  "dll", "ps1", "psm1", "vbs", "vbe", "js", "jse", "ws", "wsf", "wsh", "sct", "shb", "gadget", "inf",
  "apk", "app", "dmg", "scf", "vb", "vxd", "workflow",
]);

export function isDangerousAttachment(fileName?: string | null): boolean {
  return DANGEROUS_EXT.has(fileExtension(fileName));
}

/** Xem trước inline an toàn: chỉ ảnh (trừ SVG) và PDF. */
export function canPreviewAttachment(fileName?: string | null, contentType?: string | null): boolean {
  if (isDangerousAttachment(fileName)) return false;
  const type = String(contentType || "").split(";")[0].trim().toLowerCase();
  if (type === "application/pdf") return true;
  if (/^image\/(png|jpe?g|gif|webp|bmp|avif|tiff)$/.test(type)) return true;
  const ext = fileExtension(fileName);
  return ["png", "jpg", "jpeg", "gif", "webp", "bmp", "avif", "tiff", "pdf"].includes(ext);
}
