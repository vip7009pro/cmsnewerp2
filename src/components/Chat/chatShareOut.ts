import type { ChatAttachment, ChatConversation, ChatMediaItem, ChatMessage } from "./chat.types";
import { chatFileUrl } from "../../api/services/chatService";
import { timeLabel } from "./chatUtils";

/**
 * Chia sẻ nội dung chat RA app bên ngoài (Zalo, Kakao, Telegram, Mail, ...)
 * thông qua Web Share API (`navigator.share`) — API này cần secure context (https hoặc localhost).
 *
 * Hỗ trợ 3 chế độ, theo thứ tự ưu tiên:
 *  1. `native`    — bảng chia sẻ của hệ điều hành, chia sẻ được cả tệp thật.
 *  2. `clipboard` — trình duyệt không có Web Share ⇒ sao chép nội dung để dán sang app khác.
 *  3. `download`  — không chia sẻ được tệp ⇒ tải tệp xuống để người dùng gửi thủ công.
 */

export type ShareOutMode = "native" | "clipboard" | "download" | "cancelled" | "failed";

export interface ShareOutcome {
  ok: boolean;
  mode: ShareOutMode;
  /** Thông báo hiển thị lại cho người dùng (toast). */
  message: string;
}

/** Số tệp tối đa gửi ra ngoài trong 1 lượt (Zalo/Mail thường chặn nhiều tệp). */
export const MAX_SHARE_OUT_FILES = 5;

/**
 * Ngưỡng nạp tệp vào RAM để chia sẻ. Tệp lớn hơn sẽ chuyển sang tải xuống,
 * tránh làm treo tab khi phải `fetch` + `base64` một tệp hàng trăm MB.
 */
export const MAX_SHARE_OUT_BYTES = 120 * 1024 * 1024;

const SHARE_APP_TITLE = "Tin nhắn nội bộ ERP";

type NavigatorWithShare = Navigator & {
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data?: ShareData) => boolean;
};

function shareNavigator(): NavigatorWithShare | null {
  return typeof navigator === "undefined" ? null : (navigator as NavigatorWithShare);
}

/** Trình duyệt có Web Share API (bảng chia sẻ của hệ điều hành) hay không. */
export function canShareNative(): boolean {
  const nav = shareNavigator();
  return Boolean(nav && typeof nav.share === "function");
}

/** Trình duyệt có chia sẻ được TỆP thật hay không (cần cả `canShare`). */
export function canShareFiles(files: File[]): boolean {
  const nav = shareNavigator();
  if (!nav || typeof nav.share !== "function" || typeof nav.canShare !== "function") return false;
  if (files.length === 0) return false;
  try {
    return Boolean(nav.canShare({ files }));
  } catch {
    return false;
  }
}

/** Sao chép văn bản, có fallback cho trình duyệt cũ / context không bảo mật. */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* rơi xuống fallback bên dưới */
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

/** Tải 1 tệp về máy. Trả về `true` nếu tải được qua blob. */
async function downloadAttachmentFile(attachment: {
  attachmentId: number;
  originalName: string;
  fileSize?: number | null;
}): Promise<boolean> {
  const url = chatFileUrl(attachment.attachmentId);
  const name = attachment.originalName || `file-${attachment.attachmentId}`;
  const size = Number(attachment.fileSize || 0);

  // Tệp lớn: mở tab mới để trình duyệt tự xử lý, tránh nạp cả tệp vào RAM.
  if (size > MAX_SHARE_OUT_BYTES) {
    window.open(url, "_blank", "noopener,noreferrer");
    return false;
  }

  try {
    // LƯU Ý: thuộc tính `download` KHÔNG có tác dụng với URL khác origin
    // (file chat nằm ở host API, khác origin với app). Vì vậy phải tải blob rồi
    // tạo object URL cùng origin mới kích hoạt được việc tải xuống.
    const response = await fetch(url, { credentials: "include" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
    return true;
  } catch (error) {
    console.warn("[chat] không tải được tệp:", error);
    window.open(url, "_blank", "noopener,noreferrer");
    return false;
  }
}

/** Nạp nội dung tệp đính kèm thành `File` để đưa vào bảng chia sẻ của hệ điều hành. */
export async function fetchAttachmentFile(attachment: {
  attachmentId: number;
  originalName: string;
  mimeType?: string | null;
}): Promise<File> {
  const response = await fetch(chatFileUrl(attachment.attachmentId), { credentials: "include" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const blob = await response.blob();
  return new File([blob], attachment.originalName || `file-${attachment.attachmentId}`, {
    type: attachment.mimeType || blob.type || "application/octet-stream",
  });
}

async function runNativeShare(
  payload: { files?: File[]; title?: string; text?: string },
  successMessage: string
): Promise<ShareOutcome> {
  const nav = shareNavigator();
  if (!nav || typeof nav.share !== "function") {
    return { ok: false, mode: "failed", message: "Trình duyệt không hỗ trợ chia sẻ ra ngoài" };
  }
  try {
    await nav.share({
      title: payload.title || SHARE_APP_TITLE,
      text: payload.text,
      files: payload.files,
    } as ShareData);
    return { ok: true, mode: "native", message: successMessage };
  } catch (error: any) {
    // Người dùng tự đóng bảng chia sẻ ⇒ không phải lỗi, không cần báo động.
    if (error?.name === "AbortError") {
      return { ok: false, mode: "cancelled", message: "Đã huỷ chia sẻ" };
    }
    console.warn("[chat] chia sẻ ra ngoài thất bại:", error);
    return { ok: false, mode: "failed", message: "Không chia sẻ được ra ngoài" };
  }
}

/** Liên kết sâu mở đúng phòng chat trong app (dùng `?chat=<conversationId>`). */
export function conversationDeepLink(conversationId?: number | null): string {
  if (!conversationId || typeof window === "undefined") return "";
  const { origin, pathname } = window.location;
  return `${origin}${pathname}?chat=${conversationId}`;
}

/** Dựng nội dung văn bản của 1 tin nhắn để chia sẻ ra ngoài. */
export function buildMessageShareText(params: {
  content?: string | null;
  attachments?: { originalName: string }[] | null;
  conversationId?: number | null;
  conversationName?: string | null;
  senderName?: string | null;
  createdAt?: string | null;
  includeLink?: boolean;
}): string {
  const lines: string[] = [];
  const headerParts: string[] = [];
  if (params.senderName) headerParts.push(params.senderName);
  if (params.conversationName) headerParts.push(params.conversationName);
  if (params.createdAt) {
    const time = timeLabel(params.createdAt);
    if (time) headerParts.push(time);
  }
  if (headerParts.length > 0) lines.push(`— ${headerParts.join(" · ")} —`);

  if (params.content && params.content.trim()) lines.push(params.content.trim());
  (params.attachments || []).forEach((attachment) =>
    lines.push(`📎 ${attachment.originalName}`)
  );

  if (params.includeLink !== false) {
    const link = conversationDeepLink(params.conversationId);
    if (link) lines.push(link);
  }

  return lines.join("\n").trim();
}

/** Chia sẻ một đoạn văn bản thuần ra app ngoài. */
export async function shareTextOut(text: string, title?: string): Promise<ShareOutcome> {
  if (!text.trim()) {
    return { ok: false, mode: "failed", message: "Không có nội dung để chia sẻ" };
  }
  if (canShareNative()) {
    const outcome = await runNativeShare({ text, title }, "Đã chia sẻ ra ngoài");
    if (outcome.ok || outcome.mode === "cancelled") return outcome;
  }
  const copied = await copyTextToClipboard(text);
  return copied
    ? { ok: true, mode: "clipboard", message: "Đã sao chép nội dung — dán vào app bạn muốn gửi" }
    : { ok: false, mode: "failed", message: "Trình duyệt không hỗ trợ chia sẻ ra ngoài" };
}

/** Chia sẻ 1 tệp/ảnh đính kèm ra app ngoài (kèm phương án tải xuống dự phòng). */
export async function shareAttachmentOut(
  attachment: Pick<ChatAttachment, "attachmentId" | "originalName" | "mimeType" | "fileSize">,
  options: { title?: string; text?: string } = {}
): Promise<ShareOutcome> {
  const size = Number(attachment.fileSize || 0);
  const title = options.title || attachment.originalName;

  if (canShareNative() && (size <= 0 || size <= MAX_SHARE_OUT_BYTES)) {
    try {
      const file = await fetchAttachmentFile(attachment);
      if (canShareFiles([file])) {
        return await runNativeShare(
          { files: [file], title, text: options.text },
          `Đã chia sẻ "${attachment.originalName}"`
        );
      }
    } catch (error) {
      console.warn("[chat] không nạp được tệp để chia sẻ:", error);
    }
  }

  const downloaded = await downloadAttachmentFile(attachment);
  return {
    ok: true,
    mode: "download",
    message: downloaded
      ? `Trình duyệt không chia sẻ tệp trực tiếp được — đã tải "${attachment.originalName}" để bạn gửi thủ công`
      : `Trình duyệt không chia sẻ tệp trực tiếp được — đã mở "${attachment.originalName}" ở tab mới để bạn lưu về máy`,
  };
}

/** Chia sẻ 1 tệp trong cửa sổ "Media & tệp". */
export function shareMediaItemOut(item: ChatMediaItem, conversationName?: string | null): Promise<ShareOutcome> {
  return shareAttachmentOut(item, {
    title: item.originalName,
    text: conversationName ? `${item.originalName} · ${conversationName}` : item.originalName,
  });
}

export interface ShareMessageOutParams {
  message: ChatMessage;
  conversation?: ChatConversation | null;
  /** Tên người gửi để người nhận biết nguồn tin. */
  senderName?: string | null;
}

/**
 * Chia sẻ 1 tin nhắn (nội dung + tệp/ảnh đính kèm) ra app bên ngoài.
 */
export async function shareMessageOut({
  message,
  conversation,
  senderName,
}: ShareMessageOutParams): Promise<ShareOutcome> {
  if (message.DELETED_AT) {
    return { ok: false, mode: "failed", message: "Tin nhắn đã thu hồi, không thể chia sẻ" };
  }

  const attachments = message.ATTACHMENTS || [];
  const text = buildMessageShareText({
    content: message.CONTENT,
    attachments,
    conversationId: message.CONVERSATION_ID,
    conversationName: conversation?.DISPLAY_NAME,
    senderName,
    createdAt: message.CREATED_AT,
  });

  // Không có tệp ⇒ chia sẻ/chép nội dung là đủ.
  if (attachments.length === 0) {
    return shareTextOut(text, conversation?.DISPLAY_NAME || SHARE_APP_TITLE);
  }

  const picked = attachments.slice(0, MAX_SHARE_OUT_FILES);
  const totalBytes = picked.reduce((sum, item) => sum + Number(item.fileSize || 0), 0);

  if (canShareNative() && totalBytes <= MAX_SHARE_OUT_BYTES) {
    try {
      const files = await Promise.all(picked.map((item) => fetchAttachmentFile(item)));
      if (canShareFiles(files)) {
        return await runNativeShare(
          { files, title: conversation?.DISPLAY_NAME || SHARE_APP_TITLE, text },
          files.length > 1
            ? `Đã chia sẻ tin nhắn kèm ${files.length} tệp`
            : `Đã chia sẻ tin nhắn kèm "${picked[0].originalName}"`
        );
      }
    } catch (error) {
      console.warn("[chat] không nạp được tệp để chia sẻ tin nhắn:", error);
    }
  }

  // Dự phòng: sao chép nội dung + tải tệp xuống để gửi thủ công.
  const copied = text ? await copyTextToClipboard(text) : false;
  let saved = 0;
  for (const item of picked) {
    if (await downloadAttachmentFile(item)) saved += 1;
  }
  return {
    ok: true,
    mode: "download",
    message: copied
      ? `Đã sao chép nội dung & tải ${saved}/${picked.length} tệp để gửi thủ công`
      : `Trình duyệt không chia sẻ tệp trực tiếp được — đã tải ${saved}/${picked.length} tệp để bạn gửi thủ công`,
  };
}
