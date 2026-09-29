import React, { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, IconButton, LinearProgress, Tooltip } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupsRounded";
import type { ChatConversation, ChatMember, ChatMessage } from "./chat.types";
import { chatFileUrl } from "../../api/services/chatService";
import type { PendingUpload } from "../../hooks/useChatController";
import {
  chatAvatarUrl,
  dayLabel,
  formatFileSize,
  initialsOf,
  renderMentions,
  timeLabel,
} from "./chatUtils";

interface Props {
  conversation: ChatConversation;
  messages: ChatMessage[];
  myEmplNo: string;
  typingNames: string[];
  onlineUsers: Set<string>;
  pendingUploads: PendingUpload[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  isMobile: boolean;
  onBack: () => void;
  onOpenInfo: () => void;
  onLoadMore: () => void;
  onSend: (payload: { content: string; files?: File[]; mentions?: string[] }) => void;
  onRetry: (message: ChatMessage) => void;
  onDelete: (message: ChatMessage) => void;
  onTyping: (typing: boolean) => void;
}

const MAX_FILE_BYTES = 25 * 1024 * 1024;

function memberOf(conversation: ChatConversation, emplNo: string): ChatMember | undefined {
  return conversation.MEMBERS.find((m) => m.EMPL_NO === emplNo);
}

export default function ChatConversationView({
  conversation,
  messages,
  myEmplNo,
  typingNames,
  onlineUsers,
  pendingUploads,
  loading,
  loadingMore,
  hasMore,
  isMobile,
  onBack,
  onOpenInfo,
  onLoadMore,
  onSend,
  onRetry,
  onDelete,
  onTyping,
}: Props) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [mentionKeyword, setMentionKeyword] = useState<string | null>(null);
  const [mentions, setMentions] = useState<string[]>([]);

  const listRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const typingSentRef = useRef(false);
  const lastMessageIdRef = useRef<number>(0);

  const isDirect = conversation.CONV_TYPE === "DIRECT";
  const peerOnline = isDirect && conversation.PEER_EMPL_NO
    ? onlineUsers.has(conversation.PEER_EMPL_NO)
    : false;

  // Tự cuộn xuống cuối khi có tin mới (chỉ khi đang ở gần đáy để không phá thao tác đọc).
  useEffect(() => {
    const element = listRef.current;
    if (!element) return;
    const newest = messages.length > 0 ? messages[messages.length - 1].MESSAGE_ID : 0;
    const append = newest > lastMessageIdRef.current;
    lastMessageIdRef.current = newest;
    if (!append) return;

    const nearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 240;
    if (nearBottom || newest < 0) {
      requestAnimationFrame(() => {
        element.scrollTop = element.scrollHeight;
      });
    }
  }, [messages]);

  // Lần đầu mở phòng: cuộn xuống cuối ngay.
  useEffect(() => {
    const element = listRef.current;
    if (!element) return;
    lastMessageIdRef.current = 0;
    requestAnimationFrame(() => {
      element.scrollTop = element.scrollHeight;
    });
  }, [conversation.CONVERSATION_ID]);

  const grouped = useMemo(() => {
    const groups: { day: string; items: ChatMessage[] }[] = [];
    messages.forEach((message) => {
      const day = dayLabel(message.CREATED_AT);
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.day === day) lastGroup.items.push(message);
      else groups.push({ day, items: [message] });
    });
    return groups;
  }, [messages]);

  const mentionCandidates = useMemo(() => {
    if (mentionKeyword === null) return [];
    const key = mentionKeyword.toLowerCase();
    return conversation.MEMBERS.filter((m) => m.EMPL_NO !== myEmplNo).filter((m) =>
      (m.FULL_NAME || "").toLowerCase().includes(key)
    ).slice(0, 6);
  }, [conversation.MEMBERS, mentionKeyword, myEmplNo]);

  const handleTextChange = (value: string) => {
    setText(value);

    if (!typingSentRef.current && value.trim().length > 0) {
      typingSentRef.current = true;
      onTyping(true);
      window.setTimeout(() => {
        typingSentRef.current = false;
        onTyping(false);
      }, 2500);
    }

    // Phát hiện "@từ khoá" ở cuối chuỗi để mở gợi ý tag tên.
    const match = value.match(/@([^\s@]*)$/);
    setMentionKeyword(match ? match[1] : null);
  };

  const insertMention = (member: ChatMember) => {
    const label = member.FULL_NAME || member.EMPL_NO;
    setText((prev) => prev.replace(/@([^\s@]*)$/, `@${label} `));
    setMentions((prev) => (prev.includes(member.EMPL_NO) ? prev : [...prev, member.EMPL_NO]));
    setMentionKeyword(null);
    textareaRef.current?.focus();
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    const accepted: File[] = [];
    let error: string | null = null;

    Array.from(incoming).forEach((file) => {
      if (file.size > MAX_FILE_BYTES) {
        error = `"${file.name}" vượt quá 25MB`;
        return;
      }
      accepted.push(file);
    });

    setFileError(error);
    if (accepted.length > 0) setFiles((prev) => [...prev, ...accepted].slice(0, 5));
  };

  const handleSubmit = () => {
    if (!text.trim() && files.length === 0) return;
    onSend({ content: text, files, mentions });
    setText("");
    setFiles([]);
    setMentions([]);
    setFileError(null);
    setMentionKeyword(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const canModerate =
    conversation.MY_ROLE === "OWNER" ||
    conversation.MY_ROLE === "ADMIN" ||
    conversation.MY_ROLE === "MODERATOR";

  return (
    <div className="erp-chat__main">
      <div className="erp-chat__mainHead">
        {isMobile && (
          <IconButton size="small" className="erp-chat__iconBtn" onClick={onBack} aria-label="Quay lại">
            <ArrowBackRoundedIcon fontSize="small" />
          </IconButton>
        )}
        <Avatar
          src={conversation.DISPLAY_AVATAR || undefined}
          sx={{ width: 36, height: 36, fontSize: 14, bgcolor: "#2563eb" }}
        >
          {isDirect ? initialsOf(conversation.DISPLAY_NAME) : <GroupRoundedIcon fontSize="small" />}
        </Avatar>
        <div className="erp-chat__mainMeta">
          <span className="erp-chat__mainName">{conversation.DISPLAY_NAME}</span>
          <span className="erp-chat__mainStatus">
            {typingNames.length > 0 ? (
              <em>{typingNames.join(", ")} đang nhập...</em>
            ) : isDirect ? (
              peerOnline ? (
                <>
                  <span className="erp-chat__statusDot" /> Đang hoạt động
                </>
              ) : (
                "Không hoạt động"
              )
            ) : (
              `${conversation.MEMBERS.length} thành viên`
            )}
          </span>
        </div>
        <Tooltip title={isDirect ? "Thông tin hội thoại" : "Quản lý nhóm"}>
          <IconButton size="small" className="erp-chat__iconBtn" onClick={onOpenInfo}>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

      <div className="erp-chat__messages" ref={listRef}>
        {hasMore && (
          <div className="erp-chat__loadMore">
            <button type="button" onClick={onLoadMore} disabled={loadingMore}>
              {loadingMore ? "Đang tải..." : "Tải tin nhắn cũ hơn"}
            </button>
          </div>
        )}

        {loading && messages.length === 0 && <LinearProgress sx={{ mx: 2, my: 1 }} />}

        {!loading && messages.length === 0 && (
          <div className="erp-chat__empty erp-chat__empty--messages">
            <span>Chưa có tin nhắn</span>
            <small>Hãy gửi lời chào đầu tiên 👋</small>
          </div>
        )}

        {grouped.map((group) => (
          <div key={`${conversation.CONVERSATION_ID}-${group.day}`} className="erp-chat__dayGroup">
            <div className="erp-chat__daySeparator">
              <span>{group.day}</span>
            </div>

            {group.items.map((message, index) => {
              const mine = message.SENDER_EMPL_NO === myEmplNo;
              const isSystem = message.MSG_TYPE === "SYSTEM";
              const sender = memberOf(conversation, message.SENDER_EMPL_NO);
              const prev = group.items[index - 1];
              const showAvatar = !mine && (!prev || prev.SENDER_EMPL_NO !== message.SENDER_EMPL_NO);
              const deleted = Boolean(message.DELETED_AT);
              const attachmentList = message.ATTACHMENTS || [];
              const mentionList = message.MENTIONS
                ? String(message.MENTIONS).replace(/[[\]"]/g, "").split(",").map((v) => v.trim())
                : [];

              if (isSystem) {
                return (
                  <div key={message.MESSAGE_ID} className="erp-chat__systemMsg">
                    {message.CONTENT}
                  </div>
                );
              }

              return (
                <div
                  key={message.MESSAGE_ID}
                  className={`erp-chat__row${mine ? " is-mine" : ""}${
                    showAvatar ? " has-avatar" : ""
                  }`}
                >
                  <div className="erp-chat__rowAvatar">
                    {showAvatar && (
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
                      <span className="erp-chat__senderName">
                        {sender?.FULL_NAME || message.SENDER_EMPL_NO}
                      </span>
                    )}

                    <div className={`erp-chat__bubble${deleted ? " is-deleted" : ""}`}>
                      {deleted ? (
                        <em className="erp-chat__deleted">Tin nhắn đã được thu hồi</em>
                      ) : (
                        <>
                          {attachmentList.length > 0 && (
                            <div className="erp-chat__attachments">
                              {attachmentList.map((attachment) =>
                                /^image\//.test(String(attachment.mimeType || "")) ? (
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
                                  <a
                                    key={attachment.attachmentId}
                                    href={chatFileUrl(attachment.attachmentId)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="erp-chat__attachFile"
                                  >
                                    <InsertDriveFileRoundedIcon fontSize="small" />
                                    <span className="erp-chat__attachMeta">
                                      <strong>{attachment.originalName}</strong>
                                      <small>{formatFileSize(attachment.fileSize)}</small>
                                    </span>
                                    <DownloadRoundedIcon fontSize="small" />
                                  </a>
                                )
                              )}
                            </div>
                          )}

                          {message.CONTENT && (
                            <div className="erp-chat__text">
                              {renderMentions(message.CONTENT, mentionList)}
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

                    {!deleted && (mine || canModerate) && (
                      <div className="erp-chat__rowActions">
                        {mine && message._status === "failed" && (
                          <Tooltip title="Gửi lại">
                            <IconButton size="small" onClick={() => onRetry(message)}>
                              <ReplayRoundedIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Thu hồi">
                          <IconButton size="small" onClick={() => onDelete(message)}>
                            <DeleteOutlineRoundedIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {pendingUploads.length > 0 && (
        <div className="erp-chat__uploads">
          {pendingUploads.map((upload) => (
            <div key={upload.id} className={`erp-chat__upload${upload.error ? " is-error" : ""}`}>
              <span className="erp-chat__uploadName">{upload.name}</span>
              {upload.error ? (
                <span className="erp-chat__uploadError">{upload.error}</span>
              ) : (
                <>
                  <LinearProgress variant="determinate" value={upload.progress} />
                  <span>{upload.progress}%</span>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {fileError && <div className="erp-chat__fileError">{fileError}</div>}

      {files.length > 0 && (
        <div className="erp-chat__pendingFiles">
          {files.map((file, index) => (
            <span key={`${file.name}-${index}`} className="erp-chat__pendingFile">
              <InsertDriveFileRoundedIcon sx={{ fontSize: 14 }} />
              {file.name}
              <button
                type="button"
                aria-label={`Bỏ ${file.name}`}
                onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
              >
                <CloseRoundedIcon sx={{ fontSize: 13 }} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="erp-chat__composer">
        {mentionCandidates.length > 0 && (
          <div className="erp-chat__mentions">
            {mentionCandidates.map((member) => (
              <button key={member.EMPL_NO} type="button" onClick={() => insertMention(member)}>
                <Avatar
                  src={chatAvatarUrl(member.EMPL_NO, member.EMPL_IMAGE)}
                  sx={{ width: 22, height: 22, fontSize: 10 }}
                >
                  {initialsOf(member.FULL_NAME)}
                </Avatar>
                <span>{member.FULL_NAME}</span>
                <small>{member.JOB_NAME || ""}</small>
              </button>
            ))}
          </div>
        )}

        <IconButton
          size="small"
          className="erp-chat__iconBtn"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Đính kèm tệp"
        >
          <AttachFileRoundedIcon fontSize="small" />
        </IconButton>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          multiple
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />

        <textarea
          ref={textareaRef}
          className="erp-chat__input"
          rows={1}
          value={text}
          placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter xuống dòng, @ để tag tên)"
          onChange={(event) => handleTextChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onInput={(event) => {
            const target = event.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
          }}
        />

        <IconButton
          size="small"
          className="erp-chat__sendBtn"
          onClick={handleSubmit}
          disabled={!text.trim() && files.length === 0}
          aria-label="Gửi tin nhắn"
        >
          <SendRoundedIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
}
