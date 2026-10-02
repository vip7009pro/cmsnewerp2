import Cookies from "universal-cookie";
import axios from "axios";
import { generalQuery, getCtrCd, getSever } from "../Api";
import type {
  MailAccountConfig,
  MailAttachment,
  MailBootstrap,
  MailDetailResponse,
  MailInboxPage,
  MailSearchFilters,
  MailSearchPage,
  MailSyncPage,
  MailSyncStatusResponse,
} from "../../components/Mail/mail.types";

const cookies = new Cookies();

/** Bóc payload { tk_status, data } và ném lỗi khi thất bại (giống chatService). */
function unwrap<T>(response: any): T {
  const payload = response?.data;
  if (!payload || String(payload.tk_status).toUpperCase() !== "OK") {
    const error: any = new Error(payload?.message || "Yêu cầu email thất bại");
    error.code = payload?.code;
    throw error;
  }
  return payload.data as T;
}

export async function mailQuery<T>(command: string, data: Record<string, unknown> = {}): Promise<T> {
  const response = await generalQuery(command, data);
  return unwrap<T>(response);
}

/** Kết quả gửi thư (mailSendService trả về thêm thông tin ảnh nhúng). */
export interface MailSendResult {
  messageId?: string;
  sentMessageRowId?: number;
  /** Số ảnh `data:` trong nội dung đã tự chuyển thành ảnh nhúng `cid:`. */
  inlineImagesEmbedded?: number;
  /** Số ảnh quá lớn KHÔNG nhúng được (nơi nhận có thể không thấy). */
  inlineImagesSkipped?: number;
  inlineImagesSkippedBytes?: number;
}

export const emailService = {
  bootstrap: () => mailQuery<MailBootstrap>("emailBootstrap"),

  inbox: (params: { folder?: string; limit?: number; cursor?: { receivedAt: string; id: number } | null }) =>
    mailQuery<MailInboxPage>("emailInbox", {
      folder: params.folder || "INBOX",
      limit: params.limit ?? 30,
      cursor: params.cursor ?? null,
    }),

  get: (id: number) => mailQuery<MailDetailResponse>("emailGet", { ID: id }),

  /**
   * Lấy email MỚI HƠN mốc đã biết (realtime `email:new` / sau khi socket nối lại).
   * Trả kèm `unreadTotal` để cập nhật badge chính xác.
   */
  syncSince: (params: { folder?: string; since?: { receivedAt: string; id: number } | null; limit?: number }) =>
    mailQuery<MailSyncPage>("emailSync", {
      FOLDER: params.folder || "INBOX",
      SINCE: params.since ?? null,
      LIMIT: params.limit ?? 50,
    }),

  /** Tìm kiếm email server-side (Phase 5). */
  search: (params: {
    terms?: string[];
    filters?: MailSearchFilters;
    folder?: string;
    sort?: string;
    limit?: number;
    cursor?: { receivedAt: string; id: number } | null;
    offset?: number;
    includeCount?: boolean;
  }) =>
    mailQuery<MailSearchPage>("emailSearch", {
      TERMS: params.terms || [],
      FROM: params.filters?.from,
      TO: params.filters?.to,
      SUBJECT: params.filters?.subject,
      BODY: params.filters?.body,
      FILENAME: params.filters?.filename,
      HAS_ATTACHMENT: params.filters?.hasAttachment,
      IS_UNREAD: params.filters?.isUnread,
      IS_READ: params.filters?.isRead,
      IS_STARRED: params.filters?.isStarred,
      AFTER: params.filters?.after,
      BEFORE: params.filters?.before,
      FOLDER: params.folder || "ALL",
      SORT: params.sort || "newest",
      LIMIT: params.limit ?? 30,
      CURSOR: params.cursor ?? null,
      OFFSET: params.offset || 0,
      INCLUDE_COUNT: params.includeCount === true,
    }),

  listAttachments: (id: number) => mailQuery<MailAttachment[]>("emailListAttachments", { ID: id }),

  markRead: (id: number, isRead: boolean) => mailQuery<{ id: number; isRead: boolean }>("emailMarkRead", { ID: id, IS_READ: isRead }),

  star: (id: number, isStarred: boolean) => mailQuery<{ id: number; isStarred: boolean }>("emailStar", { ID: id, IS_STARRED: isStarred }),

  /* --- Self-service: cấu hình mailbox của chính người dùng --- */
  myAccount: () => mailQuery<{ account: MailAccountConfig | null }>("emailMyAccount"),

  saveMyAccount: (values: Record<string, unknown>) => mailQuery<{ id: number }>("emailSaveMyAccount", values),

  testMyAccount: (values: Record<string, unknown>) =>
    mailQuery<{
      message: string;
      pop3?: { ok: boolean; message: string };
      smtp?: { ok: boolean; message: string };
    }>("emailTestMyAccount", values),

  /** Dò lần lượt các cổng SMTP phổ biến để tìm cấu hình gửi được. */
  testSmtp: (values: Record<string, unknown>) =>
    mailQuery<{
      results: { port: number; secure: boolean; label?: string; ok: boolean; message: string }[];
      recommended: { port: number; secure: boolean; relaxTls?: boolean } | null;
    }>("emailTestSmtp", values),

  deleteMyAccount: () => mailQuery<{ id: number }>("emailDeleteMyAccount"),

  /** Ép đồng bộ ngay 1 mailbox (trả về ngay, worker chạy nền). */
  syncNow: (id: number) => mailQuery<{ id: number; started: boolean }>("emailSyncNow", { ID: id }),

  /** Trạng thái đồng bộ (tổng/đã tải/còn lại) của các mailbox thuộc quyền người dùng. */
  syncStatus: (all = false) => mailQuery<MailSyncStatusResponse>("emailSyncStatus", { all }),

  /* --- Gửi email (Phase 3) --- */
  send: (payload: Record<string, unknown>) => mailQuery<MailSendResult>("emailSend", payload),
  reply: (payload: Record<string, unknown>) => mailQuery<MailSendResult>("emailReply", payload),
  replyAll: (payload: Record<string, unknown>) => mailQuery<MailSendResult>("emailReplyAll", payload),
  forward: (payload: Record<string, unknown>) => mailQuery<MailSendResult>("emailForward", payload),

  /* --- Bản nháp --- */
  saveDraft: (payload: Record<string, unknown>) => mailQuery<{ id: number }>("emailSaveDraft", payload),
  draftList: () => mailQuery<unknown[]>("emailDraftList"),
  draftGet: (id: number) => mailQuery<Record<string, unknown>>("emailDraftGet", { ID: id }),
  deleteDraft: (id: number) => mailQuery<{ id: number }>("emailDeleteDraft", { ID: id }),

  /* --- Tệp đính kèm soạn thảo (outbox) --- */
  uploadOutbox: (file: File) => uploadOutboxFile(file),
  deleteOutbox: (id: number) =>
    axios
      .delete(`${getSever()}/mailfile/outbox/${id}`, { params: { token_string: String(cookies.get("token") || "") } })
      .then((r) => r.data?.data || { id }),

  /* --- Tải / xem trước đính kèm (Phase 4) --- */
  fetchAttachmentBlob: (id: number, opts: { signal?: AbortSignal } = {}) => fetchMailAttachmentBlob(id, opts),
  downloadAttachment: (id: number, fileName: string) => downloadMailAttachment(id, fileName),
};

/** Upload 1 tệp đính kèm soạn thảo ⇒ trả {id, fileName, fileSize, contentType, dangerous}. */
async function uploadOutboxFile(
  file: File
): Promise<{ id: number; fileName: string; fileSize: number; contentType: string; dangerous?: boolean }> {
  const form = new FormData();
  form.append("uploadedfile", file);
  form.append("token_string", String(cookies.get("token") || ""));
  form.append("CTR_CD", String(getCtrCd() || ""));
  const res = await axios.post(`${getSever()}/mailfile/outbox`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const payload = res.data;
  if (!payload || String(payload.tk_status).toUpperCase() !== "OK") {
    throw new Error(payload?.message || "Tải tệp lên thất bại");
  }
  return payload.data;
}

/**
 * URL stream file email (body hoặc đính kèm) — kèm token dạng query vì
 * `<iframe>`/`<img>` không gửi header Authorization. Cùng origin với API nên an toàn.
 */
export function mailFileUrl(kind: "body" | "attachment" | "inline", id: number): string {
  const token = cookies.get("token") || "";
  const path = kind === "body" ? `body/${id}` : kind === "inline" ? `attachment/${id}/inline` : `attachment/${id}`;
  return `${getSever()}/mailfile/${path}?token_string=${encodeURIComponent(String(token))}`;
}

/**
 * Tải nội dung đính kèm về dưới dạng Blob (khác origin nên phải qua XHR/fetch,
 * không dùng `<a download>` trực tiếp được).
 */
export async function fetchMailAttachmentBlob(id: number, opts: { signal?: AbortSignal } = {}): Promise<Blob> {
  const res = await axios.get(`${getSever()}/mailfile/attachment/${id}`, {
    params: { token_string: String(cookies.get("token") || "") },
    responseType: "blob",
    signal: opts.signal,
  });
  const blob = res.data as Blob;
  const type = String((res.headers as any)?.["content-type"] || blob?.type || "");
  // Lỗi nghiệp vụ vẫn trả JSON ⇒ phải đọc ra thông báo thay vì tải file rác.
  if (type.includes("application/json")) {
    const text = await blob.text();
    let message = "Không tải được tệp đính kèm";
    try {
      message = JSON.parse(text)?.message || message;
    } catch {
      /* giữ thông báo mặc định */
    }
    throw new Error(message);
  }
  return blob;
}

/** Tải 1 đính kèm về máy (Blob → object URL → `<a download>`). Trả về kích thước (byte). */
export async function downloadMailAttachment(id: number, fileName: string): Promise<number> {
  const blob = await fetchMailAttachmentBlob(id);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName || "attachment";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  return blob.size;
}
