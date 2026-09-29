import moment from "moment";

/**
 * Múi giờ nghiệp vụ của hệ thống: Việt Nam (UTC+7).
 *
 * Thời gian chat được SQL Server sinh bằng `GETDATE()` (giờ Việt Nam) và driver mssql cấu hình
 * `useUTC: true` nên trả về dưới dạng UTC mang ĐÚNG con số của giờ VN. Vì vậy phải đọc thẳng
 * bằng `moment.utc(...)` — nếu gọi `.local()` sẽ bị cộng thêm 7 giờ khi trình duyệt ở VN.
 */
export const VN_UTC_OFFSET_MINUTES = 420;

/** Moment của một mốc thời gian chat (đã ở đúng giờ VN, không phụ thuộc múi giờ máy khách). */
export function vnMoment(value?: string | null): moment.Moment | null {
  if (!value) return null;
  const parsed = moment.utc(value);
  return parsed.isValid() ? parsed : null;
}

/** Thời điểm hiện tại theo giờ Việt Nam. */
export function vnNow(): moment.Moment {
  return moment.utc().utcOffset(VN_UTC_OFFSET_MINUTES);
}

/** Ngày hôm nay theo giờ Việt Nam, dạng YYYY-MM-DD (dùng cho bộ lọc ngày). */
export function vnToday(): string {
  return vnNow().format("YYYY-MM-DD");
}

/** Cộng/trừ ngày so với hôm nay (giờ VN), trả về YYYY-MM-DD. */
export function vnDayOffset(days: number): string {
  return vnNow().add(days, "day").format("YYYY-MM-DD");
}

/**
 * Chuẩn hoá văn bản để so khớp khi người dùng gõ không dấu (NFD + bỏ đ/Đ).
 * Ví dụ: "NGUYỄN VĂN HÙNG" → "nguyen van hung".
 */
export function normalizeText(value?: string | null): string {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import AudioFileRoundedIcon from "@mui/icons-material/AudioFileRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import FolderZipRoundedIcon from "@mui/icons-material/FolderZipRounded";
import GridOnRoundedIcon from "@mui/icons-material/GridOnRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import SlideshowRoundedIcon from "@mui/icons-material/SlideshowRounded";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import VideoFileRoundedIcon from "@mui/icons-material/VideoFileRounded";

/**
 * Nhận diện loại tệp để hiển thị đúng biểu tượng + màu.
 * Ưu tiên phần mở rộng tên tệp (đáng tin hơn MIME do trình duyệt có thể trả chung chung).
 */
export type ChatFileKind =
  | "pdf"
  | "word"
  | "excel"
  | "csv"
  | "powerpoint"
  | "zip"
  | "image"
  | "audio"
  | "video"
  | "text"
  | "file";

export function fileKindOf(name?: string | null, mimeType?: string | null): ChatFileKind {
  const ext = String(name || "")
    .toLowerCase()
    .split(".")
    .pop() || "";
  const mime = String(mimeType || "").toLowerCase();

  if (ext === "pdf" || mime === "application/pdf") return "pdf";
  if (["doc", "docx", "rtf", "odt"].includes(ext)) return "word";
  if (["xls", "xlsx", "xlsm", "ods"].includes(ext)) return "excel";
  if (ext === "csv" || mime.includes("csv")) return "csv";
  if (["ppt", "pptx", "pps", "ppsx", "odp"].includes(ext)) return "powerpoint";
  if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(ext)) return "zip";
  if (mime.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg", "heic"].includes(ext))
    return "image";
  if (mime.startsWith("audio/") || ["mp3", "wav", "m4a", "ogg", "aac", "flac"].includes(ext)) return "audio";
  if (mime.startsWith("video/") || ["mp4", "mov", "avi", "mkv", "webm", "wmv"].includes(ext)) return "video";
  if (mime.startsWith("text/") || ["txt", "log", "md", "json", "xml", "html"].includes(ext)) return "text";
  return "file";
}

/** Màu nền + màu chữ của ô biểu tượng theo loại tệp. */
export const FILE_KIND_COLOR: Record<ChatFileKind, { bg: string; fg: string }> = {
  pdf: { bg: "#fdeaea", fg: "#d32f2f" },
  word: { bg: "#e7f0fd", fg: "#185abd" },
  excel: { bg: "#e6f5ec", fg: "#1d7a3e" },
  csv: { bg: "#e6f5ec", fg: "#1d7a3e" },
  powerpoint: { bg: "#fdeee4", fg: "#d24726" },
  zip: { bg: "#fdf4e3", fg: "#b78103" },
  image: { bg: "#eaf3fe", fg: "#2563eb" },
  audio: { bg: "#f2ebfd", fg: "#6d28d9" },
  video: { bg: "#fdeaf4", fg: "#be185d" },
  text: { bg: "#eef2f7", fg: "#475569" },
  file: { bg: "#eef2f7", fg: "#64748b" },
};

/** Nhãn ngắn hiển thị trong ô biểu tượng khi không có icon riêng. */
export function fileKindLabel(kind: ChatFileKind): string {
  return kind === "file" ? "TỆP" : kind.toUpperCase();
}

/** Biểu tượng MUI theo loại tệp. */
export function FileKindIcon({ kind }: { kind: ChatFileKind }) {
  switch (kind) {
    case "pdf":
      return <PictureAsPdfRoundedIcon fontSize="inherit" />;
    case "word":
      return <DescriptionRoundedIcon fontSize="inherit" />;
    case "excel":
      return <TableChartRoundedIcon fontSize="inherit" />;
    case "csv":
      return <GridOnRoundedIcon fontSize="inherit" />;
    case "powerpoint":
      return <SlideshowRoundedIcon fontSize="inherit" />;
    case "zip":
      return <FolderZipRoundedIcon fontSize="inherit" />;
    case "image":
      return <ImageRoundedIcon fontSize="inherit" />;
    case "audio":
      return <AudioFileRoundedIcon fontSize="inherit" />;
    case "video":
      return <VideoFileRoundedIcon fontSize="inherit" />;
    case "text":
      return <ArticleRoundedIcon fontSize="inherit" />;
    default:
      return <InsertDriveFileRoundedIcon fontSize="inherit" />;
  }
}

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
  const time = vnMoment(value);
  if (!time) return "";
  return time.format("YYYY-MM-DD") === vnToday() ? time.format("HH:mm") : time.format("DD/MM");
}

/** Nhãn ngày cho dải phân cách trong khung tin nhắn. */
export function dayLabel(value?: string | null): string {
  const time = vnMoment(value);
  if (!time) return "";
  const day = time.format("YYYY-MM-DD");
  if (day === vnToday()) return "Hôm nay";
  if (day === vnDayOffset(-1)) return "Hôm qua";
  return time.format("DD/MM/YYYY");
}

export function timeLabel(value?: string | null): string {
  const time = vnMoment(value);
  return time ? time.format("HH:mm") : "";
}

/** Ngày dạng DD/MM/YYYY theo giờ Việt Nam (dùng cho tệp media). */
export function dateLabel(value?: string | null): string {
  const time = vnMoment(value);
  return time ? time.format("DD/MM/YYYY") : "";
}

export function formatFileSize(bytes?: number | null): string {
  const size = Number(bytes) || 0;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

/** Người nhận được tag trong nội dung tin nhắn (@TÊN) — bấm được để mở chat riêng. */
export function renderMentions(
  content: string,
  options: {
    memberNames?: { name: string; emplNo: string }[];
    onMentionClick?: (emplNo: string, name: string) => void;
  } = {}
): (string | JSX.Element)[] {
  if (!content) return [];

  const { memberNames = [], onMentionClick } = options;
  // Khớp theo TÊN đầy đủ (ưu tiên, tên dài trước để không cắt nhầm) và cả mã nhân viên
  // cho các tin nhắn cũ đã tag bằng mã.
  const candidates = memberNames
    .filter((item) => item.name || item.emplNo)
    .map((item) => ({ ...item, label: item.name || item.emplNo }))
    .sort((a, b) => b.label.length - a.label.length);

  if (candidates.length === 0) return [content];

  const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    ...new Set(candidates.flatMap((item) => [item.label, item.emplNo]).filter(Boolean)),
  ]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegex);

  const regex = new RegExp(`(@(?:${patterns.join("|")}))`, "g");

  return content.split(regex).map((part, index) => {
    if (!part || !part.startsWith("@")) return part;
    const keyword = part.slice(1);
    const matched = candidates.find((item) => item.label === keyword || item.emplNo === keyword);
    if (!matched) return part;

    return (
      <span
        key={`mention-${index}`}
        className="erp-chat__mention"
        role={onMentionClick ? "button" : undefined}
        tabIndex={onMentionClick ? 0 : undefined}
        title={onMentionClick ? `Chat riêng với ${matched.label}` : undefined}
        onClick={
          onMentionClick
            ? (event) => {
                event.stopPropagation();
                onMentionClick(matched.emplNo, matched.label);
              }
            : undefined
        }
      >
        {part}
      </span>
    );
  });
}

/* --------------------------- Cảm xúc (reaction) --------------------------- */

export const REACTION_EMOJI: Record<string, string> = {
  LIKE: "👍",
  LOVE: "❤️",
  HAHA: "😆",
  WOW: "😮",
  SAD: "😢",
  ANGRY: "😡",
};

/** Thứ tự hiển thị trong thanh chọn cảm xúc (giống Zalo/Messenger). */
export const REACTION_ORDER = ["LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY"] as const;

export function reactionLabel(key: string): string {
  const labels: Record<string, string> = {
    LIKE: "Thích",
    LOVE: "Yêu thích",
    HAHA: "Haha",
    WOW: "Ngạc nhiên",
    SAD: "Buồn",
    ANGRY: "Tức giận",
  };
  return labels[key] || key;
}
