import type { MailListItemModel } from "./mail.types";
import { addressLabel, formatMailTimeVn, initialsOf } from "./mailUtils";

interface MailListItemProps {
  item: MailListItemModel;
  active: boolean;
  onOpen: (item: MailListItemModel) => void;
  onToggleStar: (item: MailListItemModel) => void;
}

/** 1 dòng email trong danh sách hộp thư. */
export default function MailListItem({ item, active, onOpen, onToggleStar }: MailListItemProps) {
  const sender = addressLabel(item.from);
  return (
    <div
      role="button"
      tabIndex={0}
      className={`erp-mail__item${active ? " is-active" : ""}${item.isRead ? "" : " is-unread"}`}
      onClick={() => onOpen(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(item);
        }
      }}
    >
      <div className="erp-mail__itemAvatar">{initialsOf(sender)}</div>
      <div className="erp-mail__itemHead">
        <span className="erp-mail__itemSender" title={item.from.address || sender}>
          {sender}
        </span>
      </div>
      <div className="erp-mail__itemMeta">
        {item.hasAttachment && (
          <span className="erp-mail__clip" title={`${item.attachmentCount} tệp đính kèm`}>
            <span className="material-symbols-outlined">attach_file</span>
          </span>
        )}
        <span>{formatMailTimeVn(item.receivedAt || item.sentAt)}</span>
        <button
          type="button"
          className={`erp-mail__itemStar${item.isStarred ? " is-on" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(item);
          }}
          aria-label={item.isStarred ? "Bỏ gắn sao" : "Gắn sao"}
          title={item.isStarred ? "Bỏ gắn sao" : "Gắn sao"}
        >
          <span className="material-symbols-outlined">{item.isStarred ? "star" : "star_border"}</span>
        </button>
      </div>
      <div className="erp-mail__itemSubject" title={item.subject}>
        {item.subject}
      </div>
      <div className="erp-mail__itemPreview">{item.preview || "—"}</div>
    </div>
  );
}
