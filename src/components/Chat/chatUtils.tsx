import moment from "moment";

/** URL avatar dùng đúng quy ước ảnh nhân sự hiện có của ERP. */
export function chatAvatarUrl(emplNo?: string | null, emplImage?: string | null): string | undefined {
  if (!emplNo || emplImage !== "Y") return undefined;
  return `/Picture_NS/NS_${emplNo}.jpg`;
}

/** Ảnh từ tên: "NGUYỄN VĂN A" -> "A" (ký tự cuối là tên gọi). */
export function initialsOf(name?: string | null): string {
  const clean = String(name || "").trim();
  if (!clean) return "?";
  const parts = clean.split(/\s+/);
  return (parts[parts.length - 1] || clean).charAt(0).toUpperCase();
}

/** Thời gian trong danh sách phòng: hôm nay -> HH:mm, cũ hơn -> DD/MM. */
export function shortTime(value?: string | null): string {
  if (!value) return "";
  const time = moment.utc(value).local();
  if (!time.isValid()) return "";
  return time.isSame(moment(), "day") ? time.format("HH:mm") : time.format("DD/MM");
}

/** Nhãn ngày cho dải phân cách trong khung tin nhắn. */
export function dayLabel(value?: string | null): string {
  if (!value) return "";
  const time = moment.utc(value).local();
  if (!time.isValid()) return "";
  if (time.isSame(moment(), "day")) return "Hôm nay";
  if (time.isSame(moment().subtract(1, "day"), "day")) return "Hôm qua";
  return time.format("DD/MM/YYYY");
}

export function timeLabel(value?: string | null): string {
  if (!value) return "";
  const time = moment.utc(value).local();
  return time.isValid() ? time.format("HH:mm") : "";
}

export function formatFileSize(bytes?: number | null): string {
  const size = Number(bytes) || 0;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

/** Người nhận được tag trong nội dung tin nhắn (@TÊN). */
export function renderMentions(content: string, mentions: string[] = []): (string | JSX.Element)[] {
  if (!content) return [];
  if (mentions.length === 0) return [content];

  const escaped = mentions.filter(Boolean).map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (escaped.length === 0) return [content];

  const regex = new RegExp(`(@(?:${escaped.join("|")}))`, "g");
  return content.split(regex).map((part, index) =>
    regex.test(part) ? (
      <span key={`mention-${index}`} className="erp-chat__mention">
        {part}
      </span>
    ) : (
      part
    )
  );
}
