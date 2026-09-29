import moment from "moment";
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
  // Ưu tiên khớp theo tên đầy đủ của thành viên để biết chính xác người được tag.
  const candidates = memberNames
    .filter((item) => item.name)
    .sort((a, b) => b.name.length - a.name.length);

  if (candidates.length === 0) return [content];

  const escaped = candidates.map((item) => item.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(@(?:${escaped.join("|")}))`, "g");

  return content.split(regex).map((part, index) => {
    if (!part || !part.startsWith("@")) return part;
    const matched = candidates.find((item) => part === `@${item.name}`);
    if (!matched) return part;

    return (
      <span
        key={`mention-${index}`}
        className="erp-chat__mention"
        role={onMentionClick ? "button" : undefined}
        tabIndex={onMentionClick ? 0 : undefined}
        title={onMentionClick ? `Chat riêng với ${matched.name}` : undefined}
        onClick={
          onMentionClick
            ? (event) => {
                event.stopPropagation();
                onMentionClick(matched.emplNo, matched.name);
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
