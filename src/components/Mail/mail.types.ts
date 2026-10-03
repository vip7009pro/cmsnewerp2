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
  /** Admin có cho phép nhân viên tự cấu hình mailbox không (mặc định true). */
  selfServiceEnabled?: boolean;
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

/* ---------------- Danh bạ: nhóm gửi nhanh / CC nhanh ---------------- */

export interface MailContactMember {
  address: string;
  name?: string | null;
}

/** Nhóm danh bạ email (do người dùng tạo, có thể chia sẻ cho công ty). */
export interface MailContactGroup {
  id: number;
  name: string;
  description: string | null;
  isShared: boolean;
  memberCount: number;
  ownerEmplNo: string | null;
  isOwner: boolean;
  canEdit: boolean;
  members: MailContactMember[];
  updatedAt?: string | null;
}

export interface MailContactGroupListResponse {
  groups: MailContactGroup[];
  total: number;
}

/** Kết quả `emailContactGroupSave`. */
export interface MailContactSaveResult {
  id: number;
  name: string;
  memberCount: number;
  created: boolean;
  invalidAddresses: string[];
  message: string;
}

/** Kết quả `emailContactGroupFromMessage` — gợi ý tạo nhóm từ To/Cc của 1 email. */
export interface MailContactFromMessageResponse {
  messageId: string | null;
  subject: string | null;
  receivedAt: string | null;
  from: MailAddress;
  to: MailContactMember[];
  cc: MailContactMember[];
  bcc: MailContactMember[];
  suggestedMembers: MailContactMember[];
  suggestedName: string;
}

/* ---------------- Phase 8: quản trị + dung lượng ---------------- */

/** 1 mailbox kèm số liệu tổng hợp (trang quản trị). */
export interface MailAdminMailbox {
  id: number;
  emplNo: string | null;
  emplName: string | null;
  emailAddress: string;
  displayName: string | null;
  pop3Host: string | null;
  pop3Port: number | null;
  pop3Secure: boolean;
  smtpHost: string | null;
  smtpPort: number | null;
  smtpSecure: boolean;
  isActive: boolean;
  isShared: boolean;
  syncFromDate: string | null;
  syncToDate: string | null;
  skippedCount: number;
  lastSyncAt: string | null;
  lastSyncStatus: string | null;
  lastError: string | null;
  inProgress: boolean;
  lockedAt: string | null;
  serverTotal: number;
  pending: number;
  messageCount: number;
  attachmentCount: number;
  unreadCount: number;
  messageBytes: number;
  attachmentBytes: number;
  storageBytes: number;
}

export interface MailAdminTotals {
  mailboxCount: number;
  activeMailboxCount: number;
  errorMailboxCount: number;
  messageCount: number;
  attachmentCount: number;
  unreadCount: number;
  storageBytes: number;
  pending: number;
  physicalFiles?: number;
  physicalBytes?: number;
  orphanFiles?: number;
  dedupSavedBytes?: number;
}

export interface MailAdminEmployee {
  emplNo: string | null;
  emplName: string | null;
  mailboxCount: number;
  messageCount: number;
  attachmentCount: number;
  unreadCount: number;
  storageBytes: number;
}

/** Dòng THÔ từ `ZTB_MAIL_ACCOUNT` (admin list) — KHÔNG chứa credential. */
export interface MailRawAccountRow {
  ID: number;
  CTR_CD: string;
  EMPL_NO: string | null;
  EMAIL_ADDRESS: string;
  DISPLAY_NAME: string | null;
  POP3_HOST: string | null;
  POP3_PORT: number | null;
  POP3_SECURE: boolean | number;
  POP3_USERNAME: string | null;
  SMTP_HOST: string | null;
  SMTP_PORT: number | null;
  SMTP_SECURE: boolean | number;
  SMTP_USERNAME: string | null;
  IS_ACTIVE: boolean | number;
  IS_SHARED: boolean | number;
  SYNC_FROM_DATE: string | null;
  SYNC_TO_DATE: string | null;
  LAST_SYNC_AT: string | null;
  LAST_SYNC_STATUS: string | null;
  LAST_ERROR: string | null;
}

export interface MailAdminOverview {
  mailboxes: MailAdminMailbox[];
  totals: MailAdminTotals;
  byEmployee: MailAdminEmployee[];
}export interface MailStorageDashboard {
  totals: MailAdminTotals;
  byEmployee: MailAdminEmployee[];
  byYear: { year: number; messageCount: number; bytes: number }[];
  growth: { day: string; messageCount: number }[];
}

/** 1 dòng nhật ký đồng bộ (`ZTB_MAIL_SYNC_LOG`). */
export interface MailSyncLogRow {
  ID: number;
  MAIL_ACCOUNT_ID: number;
  STARTED_AT: string;
  FINISHED_AT: string | null;
  STATUS: string;
  CONNECTED: boolean | number;
  NEW_COUNT: number;
  IMPORTED_COUNT: number;
  ATTACH_COUNT: number;
  ERROR_CODE: string | null;
  ERROR_MESSAGE: string | null;
  DURATION_MS: number | null;
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
  /** Chỉ đồng bộ email từ ngày này (YYYY-MM-DD); null = không giới hạn. */
  syncFromDate: string | null;
  /** Chỉ đồng bộ email tới ngày này (YYYY-MM-DD); null = không giới hạn. */
  syncToDate: string | null;
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
  /** Bật giới hạn khoảng thời gian đồng bộ. */
  SYNC_RANGE_ENABLED: boolean;
  SYNC_FROM_DATE: string;
  SYNC_TO_DATE: string;
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
