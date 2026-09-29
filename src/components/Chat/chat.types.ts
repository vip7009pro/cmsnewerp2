export type ChatConversationType = "DIRECT" | "GROUP";
export type ChatRole = "OWNER" | "ADMIN" | "MODERATOR" | "MEMBER";
export type ChatMessageType = "TEXT" | "IMAGE" | "FILE" | "SYSTEM";

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
  CLIENT_MESSAGE_ID?: string | null;
  CREATED_AT: string;
  EDITED_AT?: string | null;
  DELETED_AT?: string | null;
  ATTACHMENTS?: ChatAttachment[];
  /** Chỉ tồn tại ở client: trạng thái gửi của tin lạc quan. */
  _status?: "sending" | "sent" | "failed";
}

export interface ChatMember {
  EMPL_NO: string;
  CMS_ID?: string | null;
  FULL_NAME: string;
  EMPL_IMAGE?: string | null;
  JOB_NAME?: string | null;
  ROLE: ChatRole;
  LEFT_AT?: string | null;
}

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
  friends: { FRIEND_ID: number; PARTNER: string; STATUS: string }[];
  requests: ChatFriendEntry[];
}
