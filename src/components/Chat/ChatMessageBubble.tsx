import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import ForwardRoundedIcon from "@mui/icons-material/ForwardRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
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
  MENTION_ALL_ID,
  MENTION_ALL_NAME,
  REACTION_EMOJI,
  REACTION_ORDER,
  chatAvatarUrl,
  extractFirstUrl,
  fileKindLabel,
  fileKindOf,
  formatFileSize,
  initialsOf,
  reactionLabel,
  renderMentions,
  timeLabel,
} from "./chatUtils";
import { decorateMentionsInHtml, richToPlainText } from "./chatRichText";
import ChatLinkPreview from "./ChatLinkPreview";

interface Props {
  message: ChatMessage;
  conversation: ChatConversation;
  myEmplNo: string;
  canModerate: boolean;
  showAvatar: boolean;
  /** Người khác vừa thả cảm xúc cho đúng tin này ⇒ bắn tim bay. */
  burst?: ChatReactionBurst | null;
  /** Tin nhắn vừa được nhảy tới từ kết quả tìm kiếm ⇒ làm nổi bật. */
  highlight?: boolean;
  /** Tin này đang được ghim trong phòng. */
  isPinned?: boolean;
  /** Đang ở chế độ CHỌN NHIỀU tin nhắn ⇒ hiện checkbox và bấm vào là chọn/bỏ chọn. */
  selectionMode?: boolean;
  /** Tin này có đang được chọn hay không (chỉ có ý nghĩa khi `selectionMode`). */
  selected?: boolean;
  onToggleSelect?: (message: ChatMessage) => void;
  /**
   * Trạng thái đã xem của tin nhắn CỦA TÔI (chỉ truyền cho tin do mình gửi).
   * Bấm vào để xem danh sách người đã xem.
   */
  readReceipt?: { readCount: number; totalCount: number; onOpen: () => void } | null;
  onOpenMenu: (message: ChatMessage, x: number, y: number) => void;
  /** Thả cảm xúc — mỗi lần gọi là +1 (không giới hạn). */
  onAddReaction: (message: ChatMessage, reaction: ChatReactionType) => void;
  onReply: (message: ChatMessage) => void;
  /** Chia sẻ ra app khác: không truyền `attachment` là chia sẻ cả tin nhắn. */
  onShareOut?: (message: ChatMessage, attachment?: ChatAttachment) => void;
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
  highlight,
  isPinned,
  selectionMode = false,
  selected = false,
  onToggleSelect,
  readReceipt,
  onOpenMenu,
  onAddReaction,
  onReply,
  onShareOut,
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
  // Thêm mục "@All" để tô sáng tag cả phòng (bấm vào KHÔNG mở chat riêng).
  const memberNames = [
    { name: MENTION_ALL_NAME, emplNo: MENTION_ALL_ID },
    ...conversation.MEMBERS.map((m) => ({ name: m.FULL_NAME, emplNo: m.EMPL_NO })),
  ];
  /** Tin RICHTEXT ⇒ HTML đã lọc + bọc sẵn tag tên (bấm được qua delegation bên dưới). */
  const isRich = message.MSG_TYPE === "RICH";
  const richHtml = useMemo(
    () => (isRich ? decorateMentionsInHtml(message.CONTENT, memberNames) : ""),
    [isRich, message.CONTENT, memberNames]
  );
  /** Liên kết đầu tiên trong tin nhắn ⇒ hiện thẻ xem trước (bỏ qua tin đã thu hồi). */
  const firstUrl = useMemo(
    () => (deleted ? null : extractFirstUrl(message.CONTENT)),
    [deleted, message.CONTENT]
  );

  /** Bấm vào tag tên trong tin richtext (span có `data-mention`). */
  const handleRichTextClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const emplNo = (event.target as HTMLElement)?.dataset?.mention;
    if (!emplNo) return;
    event.stopPropagation();
    if (emplNo === MENTION_ALL_ID) return; // @All: chỉ để nhắc, không mở chat riêng
    const name = memberNames.find((item) => item.emplNo === emplNo)?.name || emplNo;
    onMentionClick(emplNo, name, richToPlainText(message.CONTENT));
  };

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
      className={`erp-chat__row${mine ? " is-mine" : ""}${showAvatar ? " has-avatar" : ""}${
        highlight ? " is-highlight" : ""
      }${selectionMode ? " is-selecting" : ""}${selected ? " is-selected" : ""}`}
      onContextMenu={(event) => {
        // Ở chế độ chọn nhiều: không mở menu hành động (tránh nhầm thao tác).
        if (selectionMode) return;
        event.preventDefault();
        openMenuAt(event.clientX, event.clientY);
      }}
      onTouchStart={selectionMode ? undefined : startLongPress}
      onTouchEnd={selectionMode ? undefined : cancelLongPress}
      onTouchMove={selectionMode ? undefined : cancelLongPress}
      onClick={() => {
        if (selectionMode) {
          onToggleSelect?.(message);
          return;
        }
        if (longPressFired.current) longPressFired.current = false;
      }}
      data-message-id={message.MESSAGE_ID}
    >
      {selectionMode && (
        <span
          className={`erp-chat__selectBox${selected ? " is-checked" : ""}`}
          aria-hidden="true"
        >
          {selected && <CheckRoundedIcon sx={{ fontSize: 15 }} />}
        </span>
      )}

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
                      <span key={attachment.attachmentId} className="erp-chat__attachImage">
                        <a
                          href={chatFileUrl(attachment.attachmentId)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={chatFileUrl(attachment.attachmentId)}
                            alt={attachment.originalName}
                            loading="lazy"
                          />
                        </a>
                        {onShareOut && (
                          <button
                            type="button"
                            className="erp-chat__imageShare"
                            title="Chia sẻ ảnh ra ngoài (Zalo, Kakao, ...)"
                            aria-label={`Chia sẻ ảnh ${attachment.originalName} ra ngoài`}
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              onShareOut(message, attachment);
                            }}
                          >
                            <IosShareRoundedIcon sx={{ fontSize: 15 }} />
                          </button>
                        )}
                      </span>
                    ) : (
                      <FileAttachmentCard key={attachment.attachmentId} attachment={attachment} />
                    )
                  )}
                </div>
              )}

              {message.CONTENT &&
                (isRich ? (
                  <div
                    className="erp-chat__text erp-chat__text--rich"
                    onClick={handleRichTextClick}
                    dangerouslySetInnerHTML={{ __html: richHtml }}
                  />
                ) : (
                  <div className="erp-chat__text">
                    {renderMentions(message.CONTENT, {
                      memberNames,
                      onMentionClick: (emplNo, name) => {
                        if (emplNo === MENTION_ALL_ID) return; // @All không mở chat riêng
                        onMentionClick(emplNo, name, message.CONTENT || "");
                      },
                    })}
                  </div>
                ))}

              {firstUrl && <ChatLinkPreview url={firstUrl} />}
            </>
          )}

          <div className="erp-chat__bubbleMeta">
            <span className="erp-chat__bubbleTime">{timeLabel(message.CREATED_AT)}</span>
            {message.EDITED_AT && <span>· đã sửa</span>}
            {mine && message._status === "sending" && <span>· đang gửi</span>}
            {mine && message._status === "failed" && (
              <span className="erp-chat__failed">
                <ErrorOutlineRoundedIcon sx={{ fontSize: 13 }} /> gửi lỗi
              </span>
            )}

            {/*
             * Cảm xúc đưa LÊN CÙNG DÒNG với giờ gửi (trước đây là hàng riêng với
             * margin âm nên đè lên nhãn "Đã xem").
             */}
            {reactionChips.length > 0 && (
              <span className="erp-chat__reactionRow">
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
                      onClick={(event) => {
                        event.stopPropagation();
                        handleReact(chip.key);
                      }}
                    >
                      <span className="erp-chat__reactionEmoji">
                        {REACTION_EMOJI[chip.key] || "👍"}
                      </span>
                      <em>{chip.count}</em>
                    </button>
                  </Tooltip>
                ))}
              </span>
            )}

            {/* Ai đã xem — chỉ hiện với tin do mình gửi (bấm để xem danh sách) */}
            {readReceipt && !deleted && (
              <button
                type="button"
                className={`erp-chat__receipt${
                  readReceipt.readCount > 0 ? " is-seen" : ""
                }${readReceipt.readCount >= readReceipt.totalCount ? " is-full" : ""}`}
                onClick={(event) => {
                  event.stopPropagation();
                  readReceipt.onOpen();
                }}
                title="Bấm để xem danh sách người đã xem"
              >
                <DoneAllRoundedIcon sx={{ fontSize: 13 }} />
                {readReceipt.totalCount === 0
                  ? "Đã gửi"
                  : readReceipt.readCount > 0
                    ? `Đã xem ${readReceipt.readCount}/${readReceipt.totalCount}`
                    : `Chưa ai xem (0/${readReceipt.totalCount})`}
              </button>
            )}
          </div>
        </div>

        {/* Tin đang ghim trong phòng */}
        {isPinned && !deleted && (
          <span className="erp-chat__pinBadge" title="Tin nhắn đã được ghim">
            <PushPinRoundedIcon sx={{ fontSize: 12 }} /> Đã ghim
          </span>
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
              {onShareOut && (
                <Tooltip title="Chia sẻ ra ngoài">
                  <IconButton size="small" onClick={() => onShareOut(message)}>
                    <IosShareRoundedIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
