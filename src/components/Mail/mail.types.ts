/**
 * Kiểu dữ liệu cho module Email tập trung (FE).
 * Khớp với payload trả về từ `services/mail/mailService.js` (BE).
 */

export interface MailFolder {
  ID: number;
  FOLDER_KEY: string;
  DISPLAY_NAME: string | null;
  SORT_ORDER: number;
  IS_SYSTEM: boolean | number;
}

export interface MailAccountLite {
  ID: number;
  EMAIL_ADDRESS: string;
  DISPLAY_NAME?: string | null;
}

export interface MailBootstrap {
  folders: MailFolder[];
  accounts: MailAccountLite[];
  unreadTotal: number;
  counts: Record<string, number>;
  myEmplNo: string;
  hasOwnAccount?: boolean;
  ownAccountId?: number | null;
  /** Mailbox đã TẮT thông báo đẩy (Phase 7). */
  mutedAccountIds?: number[];
}

export interface MailAddress {
  address: string | null;
  name?: string | null;
}

export interface MailListItemModel {
  id: number;
  accountId: number;
  threadId: number | null;
  from: MailAddress;
  subject: string;
  preview: string;
  sentAt: string | null;
  receivedAt: string | null;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  hasAttachment: boolean;
  attachmentCount: number;
  folder: string;
}

export interface MailInboxPage {
  messages: MailListItemModel[];
  hasMore: boolean;
  nextCursor: { receivedAt: string; id: number } | null;
}

/** Bộ lọc tìm kiếm email (khớp `emailSearch` phía BE). */
export interface MailSearchFilters {
  from?: string;
  to?: string;
  subject?: string;
  body?: string;
  filename?: string;
  hasAttachment?: boolean;
  isUnread?: boolean;
  isRead?: boolean;
  isStarred?: boolean;
  /** ISO date (yyyy-mm-dd hoặc ISO đầy đủ). */
  after?: string;
  before?: string;
}

export type MailSearchSort = "newest" | "oldest" | "sender" | "subject";

export interface MailSearchPage extends MailInboxPage {
  total?: number;
  tookMs?: number;
}

/** Kết quả `emailSync` — lấy email mới hơn mốc đã biết (realtime / sau khi kết nối lại). */
export interface MailSyncPage {
  messages: MailListItemModel[];
  hasMore: boolean;
  latest: { receivedAt: string; id: number } | null;
  unreadTotal: number;
}

export interface MailAttachment {
  id: number;
  messageId: number;
  fileName: string;
  contentType: string;
  fileSize: number;
  isInline: boolean;
  contentId: string | null;
  status: string;
  available: boolean;
}

export interface MailThreadItem {
  id: number;
  from: MailAddress;
  subject: string;
  sentAt: string | null;
  receivedAt: string | null;
  preview: string;
  isRead: boolean;
}

export interface MailDetailModel {
  id: number;
  accountId: number;
  threadId: number | null;
  messageId: string | null;
  inReplyTo: string | null;
  from: MailAddress;
  to: MailAddress[];
  cc: MailAddress[];
  bcc: MailAddress[];
  subject: string;
  sentAt: string | null;
  receivedAt: string | null;
  bodyHtml: string | null;
  bodyExternal: boolean;
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  folder: string;
}

export interface MailDetailResponse {
  message: MailDetailModel;
  attachments: MailAttachment[];
  thread: MailThreadItem[];
}

/** Cấu hình mailbox của CHÍNH người dùng (self-service) — KHÔNG chứa mật khẩu. */
export interface MailAccountConfig {
  id: number;
  emailAddress: string;
  displayName: string | null;
  pop3Host: string | null;
  pop3Port: number | null;
  pop3Secure: boolean;
  pop3Username: string | null;
  smtpHost: string | null;
  smtpPort: number | null;
  smtpSecure: boolean;
  smtpUsername: string | null;
  isActive: boolean;
  lastSyncAt: string | null;
  lastSyncStatus: string | null;
  lastError: string | null;
  hasPassword: boolean;
}

/** Dữ liệu form cấu hình mailbox (mật khẩu chỉ gửi khi người dùng nhập mới). */
export interface MailAccountFormValues {
  EMAIL_ADDRESS: string;
  DISPLAY_NAME: string;
  POP3_HOST: string;
  POP3_PORT: number | string;
  POP3_SECURE: boolean;
  POP3_USERNAME: string;
  POP3_PASSWORD: string;
  SMTP_HOST: string;
  SMTP_PORT: number | string;
  SMTP_SECURE: boolean;
  IS_ACTIVE: boolean;
}

/** Trạng thái đồng bộ của 1 mailbox. */
export interface MailSyncAccount {
  accountId: number;
  emailAddress: string;
  displayName: string | null;
  isActive: boolean;
  lastSyncAt: string | null;
  lastSyncStatus: string | null;
  lastError: string | null;
  inProgress: boolean;
  serverTotal: number;
  imported: number;
  pending: number;
}

export interface MailSyncStatusResponse {
  accounts: MailSyncAccount[];
  totals: { serverTotal: number; imported: number; pending: number; syncing: number };
}

/** Thư mục mặc định (khớp BE `SYSTEM_FOLDERS`). */
export const MAIL_FOLDER_KEYS = [
  "INBOX",
  "STARRED",
  "SENT",
  "DRAFT",
  "ARCHIVE",
  "SPAM",
  "TRASH",
] as const;

export type MailFolderKey = (typeof MAIL_FOLDER_KEYS)[number];
