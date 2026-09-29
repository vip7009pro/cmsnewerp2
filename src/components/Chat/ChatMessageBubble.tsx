import React, { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import ForwardRoundedIcon from "@mui/icons-material/ForwardRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import type {
  ChatAttachment,
  ChatConversation,
  ChatMember,
  ChatMessage,
  ChatReactionBurst,
  ChatReactionType,
} from "./chat.types";
import { chatFileUrl } from "../../api/services/chatService";
import {
  FILE_KIND_COLOR,
  FileKindIcon,
  REACTION_EMOJI,
  REACTION_ORDER,
  chatAvatarUrl,
  fileKindLabel,
  fileKindOf,
  formatFileSize,
  initialsOf,
  reactionLabel,
  renderMentions,
  timeLabel,
} from "./chatUtils";

interface Props {
  message: ChatMessage;
  conversation: ChatConversation;
  myEmplNo: string;
  canModerate: boolean;
  showAvatar: boolean;
  /** Người khác vừa thả cảm xúc cho đúng tin này ⇒ bắn tim bay. */
  burst?: ChatReactionBurst | null;
  onOpenMenu: (message: ChatMessage, x: number, y: number) => void;
  /** Thả cảm xúc — mỗi lần gọi là +1 (không giới hạn). */
  onAddReaction: (message: ChatMessage, reaction: ChatReactionType) => void;
  onReply: (message: ChatMessage) => void;
  onMentionClick: (emplNo: string, name: string, preview: string) => void;
}

const LONG_PRESS_MS = 450;
const FLYER_LIFETIME_MS = 1100;

function memberOf(conversation: ChatConversation, emplNo: string): ChatMember | undefined {
  return conversation.MEMBERS.find((m) => m.EMPL_NO === emplNo);
}

/** Phần mở rộng viết hoa để hiển thị nhỏ bên cạnh dung lượng tệp. */
function extOf(name?: string | null): string {
  const parts = String(name || "").split(".");
  return parts.length > 1 ? parts.pop()!.toUpperCase().slice(0, 5) : "";
}

/** Thẻ tệp đính kèm (không phải ảnh): biểu tượng theo loại + tên tệp + dung lượng. */
function FileAttachmentCard({ attachment }: { attachment: ChatAttachment }) {
  const kind = fileKindOf(attachment.originalName, attachment.mimeType);
  const color = FILE_KIND_COLOR[kind];
  return (
    <a
      href={chatFileUrl(attachment.attachmentId)}
      target="_blank"
      rel="noreferrer"
      className="erp-chat__attachFile"
      title={attachment.originalName}
    >
      <span
        className="erp-chat__attachIcon"
        style={{ background: color.bg, color: color.fg }}
        aria-hidden="true"
      >
        <FileKindIcon kind={kind} />
        <em>{fileKindLabel(kind)}</em>
      </span>
      <span className="erp-chat__attachMeta">
        <strong>{attachment.originalName}</strong>
        <small>
          {extOf(attachment.originalName) ? `${extOf(attachment.originalName)} · ` : ""}
          {formatFileSize(attachment.fileSize)}
        </small>
      </span>
      <DownloadRoundedIcon sx={{ fontSize: 18 }} />
    </a>
  );
}

export default function ChatMessageBubble({
  message,
  conversation,
  myEmplNo,
  canModerate,
  showAvatar,
  burst,
  onOpenMenu,
  onAddReaction,
  onReply,
  onMentionClick,
}: Props) {
  const longPressTimer = useRef<number | null>(null);
  const longPressFired = useRef(false);
  /** Tim/cảm xúc "bay" khi người dùng vừa thả — chỉ là hiệu ứng hình ảnh phía client. */
  const [flyers, setFlyers] = useState<{ id: number; emoji: string; drift: number }[]>([]);

  const mine = message.SENDER_EMPL_NO === myEmplNo;
  const sender = memberOf(conversation, message.SENDER_EMPL_NO);
  const deleted = Boolean(message.DELETED_AT);
  const attachments = message.ATTACHMENTS || [];
  const memberNames = conversation.MEMBERS.map((m) => ({ name: m.FULL_NAME, emplNo: m.EMPL_NO }));

  // Chip cảm xúc: chỉ hiện loại đã có người thả, sắp xếp theo số lượng giảm dần.
  const reactionChips = REACTION_ORDER.map((key) => {
    const entry = message.REACTIONS?.[key];
    if (!entry || entry.count <= 0) return null;
    return { key, count: entry.count, mine: (entry.users || []).includes(myEmplNo), users: entry.users || [] };
  })
    .filter(Boolean)
    .sort((a, b) => (b as any).count - (a as any).count) as {
    key: ChatReactionType;
    count: number;
    mine: boolean;
    users: string[];
  }[];

  const spawnFlyer = useCallback((reaction: ChatReactionType) => {
    const emoji = REACTION_EMOJI[reaction] || "👍";
    const id = Date.now() + Math.random();
    const drift = Math.round((Math.random() - 0.5) * 40);
    setFlyers((prev) => [...prev.slice(-8), { id, emoji, drift }]);
    window.setTimeout(() => {
      setFlyers((prev) => prev.filter((item) => item.id !== id));
    }, FLYER_LIFETIME_MS);
  }, []);

  const handleReact = useCallback(
    (reaction: ChatReactionType) => {
      spawnFlyer(reaction);
      onAddReaction(message, reaction);
    },
    [message, onAddReaction, spawnFlyer]
  );

  // Người khác thả cảm xúc cho tin này ⇒ hiệu ứng tim bay cũng hiện bên phía họ (và mọi thành viên khác).
  const lastBurstSeqRef = useRef(0);
  useEffect(() => {
    const event = burst;
    if (!event || !event.reaction) return;
    if (lastBurstSeqRef.current === event.seq) return;
    lastBurstSeqRef.current = event.seq;
    // Bỏ qua chính mình: đã bắn tim ngay lúc bấm để hiệu ứng không bị nhân đôi.
    if (event.emplNo === myEmplNo) return;
    spawnFlyer(event.reaction);
  }, [burst, myEmplNo, spawnFlyer]);

  const openMenuAt = (clientX: number, clientY: number) => {
    onOpenMenu(message, clientX, clientY);
  };

  const startLongPress = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    longPressFired.current = false;
    longPressTimer.current = window.setTimeout(() => {
      longPressFired.current = true;
      openMenuAt(touch.clientX, Math.max(60, touch.clientY - 40));
    }, LONG_PRESS_MS);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  if (message.MSG_TYPE === "SYSTEM") {
    return <div className="erp-chat__systemMsg">{message.CONTENT}</div>;
  }

  return (
    <div
      className={`erp-chat__row${mine ? " is-mine" : ""}${showAvatar ? " has-avatar" : ""}`}
      onContextMenu={(event) => {
        event.preventDefault();
        openMenuAt(event.clientX, event.clientY);
      }}
      onTouchStart={startLongPress}
      onTouchEnd={cancelLongPress}
      onTouchMove={cancelLongPress}
      onClick={() => {
        if (longPressFired.current) longPressFired.current = false;
      }}
      data-message-id={message.MESSAGE_ID}
    >
      <div className="erp-chat__rowAvatar">
        {showAvatar && !mine && (
          <Avatar
            src={chatAvatarUrl(message.SENDER_EMPL_NO, sender?.EMPL_IMAGE)}
            sx={{ width: 30, height: 30, fontSize: 12, bgcolor: "#64748b" }}
          >
            {initialsOf(sender?.FULL_NAME || message.SENDER_EMPL_NO)}
          </Avatar>
        )}
      </div>

      <div className="erp-chat__bubbleWrap">
        {showAvatar && !mine && (
          <span className="erp-chat__senderName">{sender?.FULL_NAME || message.SENDER_EMPL_NO}</span>
        )}

        <div className={`erp-chat__bubble${deleted ? " is-deleted" : ""}`}>
          {/* Hiệu ứng cảm xúc bay lên khi vừa thả */}
          {flyers.length > 0 && (
            <div className="erp-chat__flyers" aria-hidden="true">
              {flyers.map((flyer) => (
                <span
                  key={flyer.id}
                  className="erp-chat__flyer"
                  style={{ ["--drift" as any]: `${flyer.drift}px` }}
                >
                  {flyer.emoji}
                </span>
              ))}
            </div>
          )}

          {message.IS_FORWARDED && !deleted && (
            <div className="erp-chat__forwardBadge">
              <ForwardRoundedIcon sx={{ fontSize: 13 }} /> Đã chuyển tiếp
            </div>
          )}

          {message.REPLY_TO && !deleted && (
            <div className="erp-chat__quoted">
              <span className="erp-chat__quotedName">
                {memberOf(conversation, message.REPLY_TO.SENDER_EMPL_NO)?.FULL_NAME ||
                  message.REPLY_TO.SENDER_EMPL_NO}
              </span>
              <span className="erp-chat__quotedText">{message.REPLY_TO.PREVIEW}</span>
            </div>
          )}

          {deleted ? (
            <em className="erp-chat__deleted">Tin nhắn đã được thu hồi</em>
          ) : (
            <>
              {attachments.length > 0 && (
                <div className="erp-chat__attachments">
                  {attachments.map((attachment) =>
                    fileKindOf(attachment.originalName, attachment.mimeType) === "image" ? (
                      <a
                        key={attachment.attachmentId}
                        href={chatFileUrl(attachment.attachmentId)}
                        target="_blank"
                        rel="noreferrer"
                        className="erp-chat__attachImage"
                      >
                        <img
                          src={chatFileUrl(attachment.attachmentId)}
                          alt={attachment.originalName}
                          loading="lazy"
                        />
                      </a>
                    ) : (
                      <FileAttachmentCard key={attachment.attachmentId} attachment={attachment} />
                    )
                  )}
                </div>
              )}

              {message.CONTENT && (
                <div className="erp-chat__text">
                  {renderMentions(message.CONTENT, {
                    memberNames,
                    onMentionClick: (emplNo, name) =>
                      onMentionClick(emplNo, name, message.CONTENT || ""),
                  })}
                </div>
              )}
            </>
          )}

          <div className="erp-chat__bubbleMeta">
            <span>{timeLabel(message.CREATED_AT)}</span>
            {message.EDITED_AT && <span>· đã sửa</span>}
            {mine && message._status === "sending" && <span>· đang gửi</span>}
            {mine && message._status === "failed" && (
              <span className="erp-chat__failed">
                <ErrorOutlineRoundedIcon sx={{ fontSize: 13 }} /> gửi lỗi
              </span>
            )}
          </div>
        </div>

        {/* Số lượng từng loại cảm xúc — bấm để thả thêm (+1) */}
        {reactionChips.length > 0 && (
          <div className="erp-chat__reactionRow">
            {reactionChips.map((chip) => (
              <Tooltip
                key={chip.key}
                title={`${reactionLabel(chip.key)} · ${chip.count} lượt${
                  chip.users.length > 0
                    ? ` — ${chip.users
                        .map((emplNo) => memberOf(conversation, emplNo)?.FULL_NAME || emplNo)
                        .join(", ")}`
                    : ""
                }`}
              >
                <button
                  type="button"
                  className={`erp-chat__reactionChip${chip.mine ? " is-mine" : ""}`}
                  onClick={() => handleReact(chip.key)}
                >
                  <span className="erp-chat__reactionEmoji">{REACTION_EMOJI[chip.key] || "👍"}</span>
                  <em>{chip.count}</em>
                </button>
              </Tooltip>
            ))}
          </div>
        )}

        <div className="erp-chat__rowActions">
          {!deleted && (
            <>
              <Tooltip title="Trả lời">
                <IconButton size="small" onClick={() => onReply(message)}>
                  <ReplyRoundedIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
              {REACTION_ORDER.slice(0, 3).map((reaction) => (
                <Tooltip key={reaction} title={reactionLabel(reaction)}>
                  <IconButton size="small" onClick={() => handleReact(reaction)}>
                    <span style={{ fontSize: 14 }}>{REACTION_EMOJI[reaction]}</span>
                  </IconButton>
                </Tooltip>
              ))}
              <Tooltip title="Chuyển tiếp">
                <IconButton size="small" onClick={(event) => openMenuAt(event.clientX, event.clientY)}>
                  <ForwardRoundedIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
