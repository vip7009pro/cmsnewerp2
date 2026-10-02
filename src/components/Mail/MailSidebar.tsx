import type { MailAccountLite, MailFolder } from "./mail.types";
import { folderIcon } from "./mailUtils";

interface MailSidebarProps {
  folders: MailFolder[];
  accounts: MailAccountLite[];
  activeFolder: string;
  unreadTotal: number;
  onSelect: (folderKey: string) => void;
  /** Mở dialog cấu hình mailbox cá nhân. */
  onOpenAccount: () => void;
  /** Mở hộp soạn email mới. */
  onCompose?: () => void;
  /** Mailbox đã tắt thông báo đẩy (Phase 7). */
  mutedAccountIds?: number[];
  onToggleMute?: (accountId: number) => void;
}

/** Cột thư mục (Inbox/Starred/Sent/...) — chỉ là thư mục hiển thị phía client (POP3 không sync folder server). */
export default function MailSidebar({
  folders,
  accounts,
  activeFolder,
  unreadTotal,
  onSelect,
  onOpenAccount,
  onCompose,
  mutedAccountIds = [],
  onToggleMute,
}: MailSidebarProps) {
  const list = folders.length > 0 ? folders : [];

  return (
    <nav className="erp-mail__sidebar" aria-label="Thư mục email">
      <div className="erp-mail__sidebarTitle">
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          mail
        </span>
        Hộp thư
      </div>

      {/* Danh sách mailbox + nút bật/tắt thông báo đẩy cho từng mailbox. */}
      {accounts.map((account) => {
        const muted = mutedAccountIds.includes(Number(account.ID));
        return (
          <div className="erp-mail__sidebarAccount" key={account.ID} title={account.EMAIL_ADDRESS}>
            <span className="erp-mail__sidebarAccountName">{account.DISPLAY_NAME || account.EMAIL_ADDRESS}</span>
            {onToggleMute && (
              <button
                type="button"
                className={`erp-mail__muteBtn${muted ? " is-muted" : ""}`}
                onClick={() => onToggleMute(Number(account.ID))}
                title={muted ? "Đang TẮT thông báo đẩy — bấm để bật" : "Đang BẬT thông báo đẩy — bấm để tắt"}
                aria-label={muted ? "Bật thông báo đẩy" : "Tắt thông báo đẩy"}
              >
                <span className="material-symbols-outlined">
                  {muted ? "notifications_off" : "notifications"}
                </span>
              </button>
            )}
          </div>
        );
      })}

      {onCompose && (
        <button type="button" className="erp-mail__composeBtn" onClick={onCompose}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
          Soạn thư
        </button>
      )}

      {list.map((folder) => {
        const isInbox = folder.FOLDER_KEY === "INBOX";
        return (
          <button
            key={folder.FOLDER_KEY}
            type="button"
            className={`erp-mail__folder${activeFolder === folder.FOLDER_KEY ? " is-active" : ""}`}
            onClick={() => onSelect(folder.FOLDER_KEY)}
          >
            <span className="material-symbols-outlined">{folderIcon(folder.FOLDER_KEY)}</span>
            <span>{folder.DISPLAY_NAME || folder.FOLDER_KEY}</span>
            {isInbox && unreadTotal > 0 && (
              <span className="erp-mail__folderCount">{unreadTotal > 99 ? "99+" : unreadTotal}</span>
            )}
          </button>
        );
      })}

      <button type="button" className="erp-mail__folder" onClick={onOpenAccount} style={{ marginTop: 6 }}>
        <span className="material-symbols-outlined">settings</span>
        <span>Cấu hình Email của tôi</span>
      </button>
    </nav>
  );
}
