import { useMemo, useState } from "react";
import { CircularProgress, IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MailHtmlView from "./MailHtmlView";
import MailAttachmentList from "./MailAttachmentList";
import type { MailAddress, MailDetailResponse } from "./mail.types";
import { addressEmail, addressLabel, formatMailFull, stripSubjectPrefix } from "./mailUtils";
import { mailFileUrl } from "../../api/services/emailService";

interface MailDetailProps {
  detail: MailDetailResponse | null;
  loading: boolean;
  isMobile: boolean;
  onClose: () => void;
  onToggleStar: (isStarred: boolean) => void;
  /** Ẩn/hiện cột danh sách (cột 2) để rộng chỗ đọc nội dung. */
  listCollapsed?: boolean;
  onToggleList?: () => void;
  /** Soạn thảo (Phase 3). */
  onReply?: () => void;
  onReplyAll?: () => void;
  onForward?: () => void;
}

/** Số người nhận hiển thị trước khi thu gọn. */
const RECIP_VISIBLE = 2;

/**
 * Một dòng người nhận (Đến/CC) — TỰ THU GỌN khi danh sách dài,
 * tránh đẩy nội dung email xuống quá thấp.
 */
function RecipientLine({ label, list }: { label: string; list: MailAddress[] }) {
  const [expanded, setExpanded] = useState(false);
  if (!list || list.length === 0) return null;
  const shown = expanded ? list : list.slice(0, RECIP_VISIBLE);
  const hidden = list.length - shown.length;
  return (
    <div className="erp-mail__recip">
      <b>{label}:</b>{" "}
      <span className="erp-mail__recipList">
        {shown.map((a, i) => (
          <span key={`${a.address}-${i}`} className="erp-mail__recipItem">
            {a.name ? `${a.name} ` : ""}
            {a.address ? `<${a.address}>` : ""}
            {i < shown.length - 1 ? "," : ""}
          </span>
        ))}
      </span>
      {hidden > 0 && (
        <button type="button" className="erp-mail__recipToggle" onClick={() => setExpanded(true)}>
          +{hidden} người nhận
        </button>
      )}
      {expanded && list.length > RECIP_VISIBLE && (
        <button type="button" className="erp-mail__recipToggle" onClick={() => setExpanded(false)}>
          Thu gọn
        </button>
      )}
    </div>
  );
}

/** Chi tiết 1 email: người gửi/nhận, thời gian, nội dung HTML an toàn, đính kèm, hội thoại. */
export default function MailDetail({ detail, loading, isMobile, onClose, onToggleStar, listCollapsed, onToggleList, onReply, onReplyAll, onForward }: MailDetailProps) {
  // Ảnh nhúng theo Content-ID ⇒ URL tải từ server để hiển thị trong nội dung.
  const inlineImages = useMemo(() => {
    const map: Record<string, string> = {};
    for (const a of detail?.attachments || []) {
      if ((a.isInline || a.contentId) && a.contentId) map[a.contentId] = mailFileUrl("inline", a.id);
    }
    return map;
  }, [detail]);

  if (loading && !detail) {
    return (
      <div className="erp-mail__detail">
        <div className="erp-mail__empty">
          <CircularProgress size={22} />
        </div>
      </div>
    );
  }
  if (!detail) return null;

  const { message, attachments, thread } = detail;

  return (
    <div className="erp-mail__detail">
      <div className="erp-mail__detailHead">
        {isMobile && (
          <button type="button" className="erp-mail__backBtn" onClick={onClose} aria-label="Quay lại danh sách">
            <ArrowBackRoundedIcon fontSize="small" />
          </button>
        )}
        {!isMobile && onToggleList && (
          <button
            type="button"
            className={`erp-mail__backBtn${listCollapsed ? " is-off" : ""}`}
            onClick={onToggleList}
            title={listCollapsed ? "Hiện danh sách email" : "Ẩn danh sách email (rộng chỗ đọc)"}
            aria-label={listCollapsed ? "Hiện danh sách email" : "Ẩn danh sách email"}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              {listCollapsed ? "right_panel_open" : "right_panel_close"}
            </span>
          </button>
        )}
        <span className="erp-mail__detailSubject" title={message.subject}>
          {message.subject}
        </span>
        {onReply && (
          <IconButton size="small" className="erp-mail__iconBtn" onClick={onReply} title="Trả lời" aria-label="Trả lời">
            <span className="material-symbols-outlined" style={{ fontSize: 19 }}>reply</span>
          </IconButton>
        )}
        {onReplyAll && (
          <IconButton size="small" className="erp-mail__iconBtn" onClick={onReplyAll} title="Trả lời tất cả" aria-label="Trả lời tất cả">
            <span className="material-symbols-outlined" style={{ fontSize: 19 }}>reply_all</span>
          </IconButton>
        )}
        {onForward && (
          <IconButton size="small" className="erp-mail__iconBtn" onClick={onForward} title="Chuyển tiếp" aria-label="Chuyển tiếp">
            <span className="material-symbols-outlined" style={{ fontSize: 19 }}>forward</span>
          </IconButton>
        )}
        <IconButton
          size="small"
          className="erp-mail__iconBtn"
          onClick={() => onToggleStar(!message.isStarred)}
          aria-label={message.isStarred ? "Bỏ gắn sao" : "Gắn sao"}
          title={message.isStarred ? "Bỏ gắn sao" : "Gắn sao"}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: message.isStarred ? "#f59e0b" : "#94a3b8" }}>
            {message.isStarred ? "star" : "star_border"}
          </span>
        </IconButton>
        {!isMobile && (
          <IconButton size="small" className="erp-mail__iconBtn" onClick={onClose} aria-label="Đóng chi tiết email" title="Đóng">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        )}
      </div>

      <div className="erp-mail__detailMeta">
        <div>
          <b>{addressLabel(message.from)}</b> {addressEmail(message.from) && `<${addressEmail(message.from)}>`}
        </div>
        <RecipientLine label="Đến" list={message.to} />
        <RecipientLine label="CC" list={message.cc} />
        <div>{formatMailFull(message.receivedAt || message.sentAt)}</div>
      </div>

      {thread.length > 1 && (
        <div className="erp-mail__attachments" style={{ maxHeight: 92 }}>
          {thread.map((t) => (
            <span key={t.id} className="erp-mail__attachment" title={stripSubjectPrefix(t.subject)}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                forum
              </span>
              {addressLabel(t.from)}
            </span>
          ))}
        </div>
      )}

      <div className="erp-mail__detailBody">
        <MailHtmlView
          messageId={message.id}
          html={message.bodyHtml}
          external={message.bodyExternal}
          title={message.subject}
          inlineImages={inlineImages}
        />
      </div>

      <MailAttachmentList attachments={attachments} />
    </div>
  );
}
