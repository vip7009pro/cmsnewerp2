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
}

/** Cột thư mục (Inbox/Starred/Sent/...) — chỉ là thư mục hiển thị phía client (POP3 không sync folder server). */
export default function MailSidebar({ folders, accounts, activeFolder, unreadTotal, onSelect, onOpenAccount, onCompose }: MailSidebarProps) {
  const list = folders.length > 0 ? folders : [];
  const primaryAccount = accounts[0];

  return (
    <nav className="erp-mail__sidebar" aria-label="Thư mục email">
      <div className="erp-mail__sidebarTitle">
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          mail
        </span>
        Hộp thư
      </div>
      {primaryAccount && (
        <div className="erp-mail__sidebarAccount" title={primaryAccount.EMAIL_ADDRESS}>
          {primaryAccount.DISPLAY_NAME || primaryAccount.EMAIL_ADDRESS}
        </div>
      )}

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
