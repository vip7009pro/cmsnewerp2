import axios from "axios";
import Cookies from "universal-cookie";
import { generalQuery, getCtrCd, getSever } from "../Api";
import type {
  ChatBootstrap,
  ChatConversation,
  ChatEmployee,
  ChatFriendEntry,
  ChatMediaItem,
  ChatMessage,
  ChatSearchResult,
} from "../../components/Chat/chat.types";

/** Dung lượng đã dùng của một phòng chat. */
export interface ChatStorage {
  fileCount: number;
  totalBytes: number;
}

const cookies = new Cookies();

/** Bóc tách payload { tk_status, data } và ném lỗi khi thất bại. */
function unwrap<T>(response: any): T {
  const payload = response?.data;
  if (!payload || String(payload.tk_status).toUpperCase() !== "OK") {
    const error: any = new Error(payload?.message || "Yêu cầu chat thất bại");
    error.code = payload?.code;
    throw error;
  }
  return payload.data as T;
}

export async function chatQuery<T>(command: string, data: Record<string, unknown> = {}): Promise<T> {
  const response = await generalQuery(command, data);
  return unwrap<T>(response);
}

export const chatService = {
  bootstrap: () => chatQuery<ChatBootstrap>("chatBootstrap"),

  /** Bản nhẹ: chỉ danh sách phòng + số chưa đọc + danh sách đang online. */
  sync: () =>
    chatQuery<{ conversations: ChatConversation[]; unreadTotal: number; onlineEmplNos?: string[] }>(
      "chatSync"
    ),

  /**
   * Tìm nhân sự. `options.all = true` ⇒ lấy TOÀN BỘ nhân sự đang làm việc
   * (dùng cho nút "Chọn tất cả" khi tạo phòng toàn công ty; chỉ tài khoản quản trị).
   */
  searchEmployees: (keyword: string, options?: { all?: boolean; limit?: number }) =>
    chatQuery<ChatEmployee[]>("chatSearchEmployees", {
      keyword,
      limit: options?.limit ?? 30,
      all: options?.all === true,
    }),

  getOrCreateDirect: (otherEmplNo: string) =>
    chatQuery<ChatConversation>("chatGetOrCreateDirect", { otherEmplNo }),

  createGroup: (title: string, memberEmplNos: string[], avatar?: string) =>
    chatQuery<ChatConversation>("chatCreateGroup", { title, memberEmplNos, avatar }),

  loadMessages: (conversationId: number, beforeMessageId?: number, limit = 40) =>
    chatQuery<{ conversationId: number; messages: ChatMessage[]; hasMore: boolean }>("chatLoadMessages", {
      conversationId,
      beforeMessageId,
      limit,
    }),

  sendMessage: (params: {
    conversationId: number;
    content: string;
    clientMessageId?: string;
    mentions?: string[];
    replyToMessageId?: number;
    attachmentIds?: number[];
    msgType?: string;
  }) => chatQuery<{ conversationId: number; message: ChatMessage }>("chatSendMessage", params),

  markRead: (conversationId: number, lastMessageId: number) =>
    chatQuery<{ conversationId: number; updated: number }>("chatMarkRead", {
      conversationId,
      lastMessageId,
    }),

  /** Ghim / bỏ ghim cuộc trò chuyện — tuỳ chọn của RIÊNG người dùng hiện tại. */
  pinConversation: (conversationId: number, pinned: boolean) =>
    chatQuery<{ conversationId: number; pinned: boolean; pinnedAt: string | null }>(
      "chatPinConversation",
      { conversationId, pinned }
    ),

  deleteMessage: (conversationId: number, messageId: number) =>
    chatQuery<{ conversationId: number; messageId: number }>("chatDeleteMessage", {
      conversationId,
      messageId,
    }),

  /** Thả cảm xúc: mỗi lần gọi là +1. reaction = "NONE" để bỏ. */
  react: (conversationId: number, messageId: number, reaction: string) =>
    chatQuery<{
      conversationId: number;
      messageId: number;
      reaction: string | null;
      removed: boolean;
      reactions?: Record<string, { count: number; users: string[] }>;
    }>("chatReact", { conversationId, messageId, reaction }),

  /** "Xoá ở phía tôi" — chỉ ẩn với chính mình. */
  hideMessage: (conversationId: number, messageId: number) =>
    chatQuery<{ conversationId: number; messageId: number }>("chatHideMessage", {
      conversationId,
      messageId,
    }),

  /** Chuyển tiếp 1 tin nhắn sang các phòng khác. */
  forward: (conversationId: number, messageId: number, targetConversationIds: number[]) =>
    chatQuery<{ messageId: number; forwarded: number[] }>("chatForward", {
      conversationId,
      messageId,
      targetConversationIds,
    }),

  updateGroup: (conversationId: number, patch: { title?: string; avatar?: string }) =>
    chatQuery<ChatConversation>("chatUpdateGroup", { conversationId, ...patch }),
  addMembers: (conversationId: number, memberEmplNos: string[]) =>
    chatQuery<ChatConversation>("chatAddMembers", { conversationId, memberEmplNos }),

  removeMember: (conversationId: number, emplNo: string) =>
    chatQuery<{ conversationId: number }>("chatRemoveMember", { conversationId, emplNo }),

  setRole: (conversationId: number, emplNo: string, role: "MODERATOR" | "MEMBER") =>
    chatQuery<{ conversationId: number }>("chatSetRole", { conversationId, emplNo, role }),

  transferOwner: (conversationId: number, newOwnerEmplNo: string) =>
    chatQuery<{ conversationId: number }>("chatTransferOwner", {
      conversationId,
      newOwnerEmplNo,
    }),

  leaveGroup: (conversationId: number) =>
    chatQuery<{ conversationId: number }>("chatLeaveGroup", { conversationId }),

  listFriends: () =>
    chatQuery<{ friends: ChatFriendEntry[]; requests: ChatFriendEntry[] }>("chatListFriends"),

  friendRequest: (recipient: string) =>
    chatQuery<{ status: string; friendId?: number }>("chatFriendRequest", { recipient }),

  friendRespond: (friendId: number, action: "accept" | "reject") =>
    chatQuery<{ friendId: number; status: string }>("chatFriendRespond", { friendId, action }),

  friendCancel: (friendId: number) =>
    chatQuery<{ friendId: number; status: string }>("chatFriendCancel", { friendId }),

  /**
   * Tìm kiếm tin nhắn/tệp. Bỏ `conversationId` để tìm toàn cục trong mọi phòng của user.
   */
  searchMessages: (params: {
    conversationId?: number;
    keyword?: string;
    senderEmplNo?: string | null;
    fromDate?: string | null;
    toDate?: string | null;
    fileKind?: string;
    onlyWithFiles?: boolean;
    beforeMessageId?: number;
    limit?: number;
  }) =>
    chatQuery<{ results: ChatSearchResult[]; hasMore: boolean }>("chatSearchMessages", params),

  /** Danh sách media/tệp của 1 phòng (cửa sổ "Xem media"). */
  listMedia: (params: {
    conversationId: number;
    fileKind?: string;
    fromDate?: string | null;
    toDate?: string | null;
    beforeAttachmentId?: number;
    limit?: number;
  }) =>
    chatQuery<{ items: ChatMediaItem[]; hasMore: boolean; storage: ChatStorage }>(
      "chatListMedia",
      params
    ),

  conversationStorage: (conversationId: number) =>
    chatQuery<ChatStorage>("chatConversationStorage", { conversationId }),

  /** Metadata (OG) của 1 liên kết để hiển thị link preview. Server fetch hộ (tránh CORS). */
  linkPreview: (url: string) =>
    chatQuery<{
      url: string;
      title: string;
      description: string;
      image: string;
      siteName: string;
    }>("chatLinkPreview", { url }),
};

/** Upload 1 file vào phòng chat, trả về attachment vừa lưu. */
export async function uploadChatFile(
  file: File,
  conversationId: number,
  onUploadProgress?: (progressEvent: any) => void
): Promise<{ attachmentId: number; originalName: string; mimeType?: string; fileSize?: number; url: string }> {
  const formData = new FormData();
  formData.append("uploadedfile", file);
  formData.append("CONVERSATION_ID", String(conversationId));
  formData.append("token_string", cookies.get("token"));
  formData.append("CTR_CD", getCtrCd());

  const response = await axios.post(`${getSever()}/chatfile`, formData, { onUploadProgress });
  return unwrap(response);
}

/** Upload ảnh avatar cho phòng nhóm (chỉ cần đăng nhập, không cần là thành viên). */
export async function uploadChatAvatar(file: File): Promise<{ url: string; size: number }> {
  const formData = new FormData();
  formData.append("uploadedfile", file);
  formData.append("token_string", cookies.get("token"));
  const response = await axios.post(`${getSever()}/chatavatar`, formData);
  return unwrap(response);
}

/** URL tải/preview file chat (kèm token cho trường hợp không dùng cookie). */
export function chatFileUrl(attachmentId: number): string {
  const token = cookies.get("token");
  return `${getSever()}/chatfile/${attachmentId}?token_string=${encodeURIComponent(token || "")}`;
}
