export type ChatConversationType = "DIRECT" | "GROUP" | "SELF";
export type ChatRole = "OWNER" | "ADMIN" | "MODERATOR" | "MEMBER";
export type ChatMessageType = "TEXT" | "IMAGE" | "FILE" | "SYSTEM" | "RICH";
export type ChatReactionType = "LIKE" | "LOVE" | "HAHA" | "WOW" | "SAD" | "ANGRY";

/** Tổng hợp cảm xúc của 1 loại trên 1 tin nhắn. */
export interface ChatReactionSummary {
  /** Tổng số lần thả (một người có thể thả nhiều lần). */
  count: number;
  /** Danh sách nhân viên đã thả loại này (để biết "tôi đã thả chưa"). */
  users: string[];
}

/**
 * Sự kiện "vừa có người thả cảm xúc" — dùng để bắn hiệu ứng tim bay ở CẢ HAI phía.
 * `seq` đổi mỗi lần nên cùng 1 tin thả nhiều lần vẫn kích hoạt hiệu ứng mới.
 */
export interface ChatReactionBurst {
  conversationId: number;
  messageId: number;
  emplNo: string;
  reaction: ChatReactionType;
  seq: number;
}

/** Nhóm loại tệp dùng cho bộ lọc tìm kiếm / xem media. */
export type ChatFileKindFilter =
  | "all"
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "word"
  | "excel"
  | "csv"
  | "ppt"
  | "zip"
  | "other"
  /** Tin nhắn CHỨA LIÊN KẾT (không phải loại tệp — lọc theo nội dung). */
  | "link";

/** Bộ lọc dùng chung cho tìm kiếm và xem media. */
export interface ChatSearchFilters {
  keyword?: string;
  senderEmplNo?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  fileKind?: ChatFileKindFilter;
  onlyWithFiles?: boolean;
  /** Chỉ lấy tin nhắn chứa liên kết. */
  hasLink?: boolean;
}

/** 1 kết quả tìm kiếm (kèm thông tin phòng để hiển thị khi tìm toàn cục). */
export interface ChatSearchResult {
  MESSAGE_ID: number;
  CONVERSATION_ID: number;
  SENDER_EMPL_NO: string;
  MSG_TYPE: ChatMessageType;
  CONTENT: string | null;
  CREATED_AT: string;
  DELETED_AT?: string | null;
  ATTACHMENTS: ChatAttachment[];
  CONVERSATION_NAME: string;
  CONVERSATION_TYPE: ChatConversationType;
  CONVERSATION_PEER: string | null;
}

/** 1 mục media/tệp trong cửa sổ xem media của phòng. */
export interface ChatMediaItem {
  attachmentId: number;
  messageId: number;
  originalName: string;
  mimeType?: string | null;
  fileSize?: number | null;
  senderEmplNo: string;
  createdAt: string;
}

/** Nội dung được trích dẫn khi trả lời tin nhắn. */
export interface ChatReplyPreview {
  MESSAGE_ID: number;
  SENDER_EMPL_NO: string;
  MSG_TYPE: ChatMessageType;
  DELETED_AT?: string | null;
  PREVIEW: string;
}

export interface ChatAttachment {
  attachmentId: number;
  originalName: string;
  mimeType?: string | null;
  fileSize?: number | null;
}

export interface ChatMessage {
  MESSAGE_ID: number;
  CONVERSATION_ID: number;
  SENDER_EMPL_NO: string;
  MSG_TYPE: ChatMessageType;
  CONTENT: string | null;
  MENTIONS?: string | null;
  REPLY_TO_MESSAGE_ID?: number | null;
  REPLY_TO?: ChatReplyPreview | null;
  FORWARDED_FROM_MESSAGE_ID?: number | null;
  IS_FORWARDED?: boolean;
  /** Cảm xúc theo loại: { LIKE: { count: 12, users: ["A"] } } */
  REACTIONS?: Partial<Record<ChatReactionType, ChatReactionSummary>>;
  CLIENT_MESSAGE_ID?: string | null;
  CREATED_AT: string;
  EDITED_AT?: string | null;
  DELETED_AT?: string | null;
  ATTACHMENTS?: ChatAttachment[];
  /** Mốc ghim trong phòng (null/undefined = chưa ghim). */
  PINNED_AT?: string | null;
  /** Chỉ tồn tại ở client: trạng thái gửi của tin lạc quan. */
  _status?: "sending" | "sent" | "failed";
}

export interface ChatMember {
  EMPL_NO: string;
  CMS_ID?: string | null;
  FULL_NAME: string;
  EMPL_IMAGE?: string | null;
  JOB_NAME?: string | null;
  /** Phòng ban chính — hiển thị kèm tên dạng `TÊN [PHÒNG BAN]-[BỘ PHẬN]`. */
  MAINDEPTNAME?: string | null;
  /** Bộ phận (phòng ban con). */
  SUBDEPTNAME?: string | null;
  ROLE: ChatRole;
  LEFT_AT?: string | null;
  /** MESSAGE_ID lớn nhất mà người này đã đọc trong phòng — dùng để đếm/liệt kê "ai đã xem". */
  LAST_READ_MESSAGE_ID?: number;
}

/** 1 tin nhắn đang được ghim trong phòng (hiển thị ở thanh ghim dưới header). */
export interface ChatPinnedMessage {
  MESSAGE_ID: number;
  SENDER_EMPL_NO: string;
  MSG_TYPE: ChatMessageType;
  CONTENT: string | null;
  CREATED_AT: string;
  PINNED_AT?: string | null;
  PINNED_BY?: string | null;
}

/** Chế độ tắt thông báo cho 1 phòng. */
export type ChatMuteMode =
  | { mode: "off" }
  | { mode: "minutes"; minutes: number }
  | { mode: "untilOpen" };

export interface ChatLastMessage {
  MESSAGE_ID: number;
  SENDER_EMPL_NO: string;
  MSG_TYPE: ChatMessageType;
  CONTENT: string | null;
  CREATED_AT: string;
  DELETED_AT?: string | null;
}

export interface ChatConversation {
  CONVERSATION_ID: number;
  CONV_TYPE: ChatConversationType;
  TITLE: string | null;
  AVATAR: string | null;
  DISPLAY_NAME: string;
  DISPLAY_AVATAR: string | null;
  PEER_EMPL_NO: string | null;
  OWNER_EMPL_NO: string | null;
  MY_ROLE: ChatRole;
  MUTED: boolean;
  /** Số giây còn tắt thông báo cho riêng phòng này (null = đang nhận thông báo). */
  MUTED_SECONDS_LEFT?: number | null;
  /** true khi đang ở chế độ "cho tới khi mở lại phòng". */
  MUTED_UNTIL_OPEN?: boolean;
  /** Tin nhắn đang ghim của phòng (ghim mới nhất trước). */
  PINNED?: ChatPinnedMessage[];
  /** Thời điểm TÔI ghim phòng này (null = không ghim). Ghim mới hơn lên trên. */
  PINNED_AT?: string | null;
  /** Mốc tạo phòng — dùng để sắp xếp khi phòng chưa có tin nhắn nào. */
  CREATED_AT?: string | null;
  UNREAD_COUNT: number;
  LAST_MESSAGE: ChatLastMessage | null;
  MEMBERS: ChatMember[];
}

export interface ChatEmployee {
  EMPL_NO: string;
  CMS_ID?: string | null;
  FULL_NAME: string;
  EMPL_IMAGE?: string | null;
  JOB_NAME?: string | null;
  MAINDEPTNAME?: string | null;
  SUBDEPTNAME?: string | null;
}

export interface ChatFriendEntry {
  FRIEND_ID: number;
  PARTNER: string;
  FULL_NAME?: string;
  EMPL_IMAGE?: string | null;
  JOB_NAME?: string | null;
  MAINDEPTNAME?: string | null;
  SUBDEPTNAME?: string | null;
  STATUS: string;
  DIRECTION?: "INCOMING" | "OUTGOING";
  CREATED_AT?: string;
}

export interface ChatBootstrap {
  conversations: ChatConversation[];
  unreadTotal: number;
  /** Những EMPL_NO đang có socket active (để hiển thị đúng trạng thái online). */
  onlineEmplNos?: string[];
  friends: { FRIEND_ID: number; PARTNER: string; STATUS: string }[];
  requests: ChatFriendEntry[];
}

/** Tin nhắn đang được trả lời (hiện trong composer). */
export interface ChatReplyTarget {
  messageId: number;
  senderEmplNo: string;
  preview: string;
}
