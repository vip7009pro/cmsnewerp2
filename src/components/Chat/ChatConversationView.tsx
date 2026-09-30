import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Avatar, IconButton, LinearProgress, Snackbar, Tooltip } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PermMediaRoundedIcon from "@mui/icons-material/PermMediaRounded";
import FolderSpecialRoundedIcon from "@mui/icons-material/FolderSpecialRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupsRounded";
import type {
  ChatAttachment,
  ChatConversation,
  ChatMember,
  ChatMessage,
  ChatReactionBurst,
  ChatReactionType,
  ChatReplyTarget,
} from "./chat.types";
import ChatMessageBubble from "./ChatMessageBubble";
import ChatMessageMenu, { type ChatMessageMenuState } from "./ChatMessageMenu";
import ChatSearchPanel from "./ChatSearchPanel";
import ChatMediaDialog from "./ChatMediaDialog";
import ChatRoomAvatar from "./chatAvatars";
import { shareAttachmentOut, shareMessageOut } from "./chatShareOut";
import type { PendingUpload } from "../../hooks/useChatController";
import { chatService, type ChatStorage } from "../../api/services/chatService";
import {
  FILE_KIND_COLOR,
  FileKindIcon,
  chatAvatarUrl,
  dayLabel,
  fileKindOf,
  formatFileSize,
  initialsOf,
  normalizeText,
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
  replyTarget: ChatReplyTarget | null;
  draftText?: string | null;
  /** Sự kiện cảm xúc vừa được thả ở nơi khác (tim bay hiện ở cả 2 phía). */
  reactionBurst?: ChatReactionBurst | null;
  onBack: () => void;
  onOpenInfo: () => void;
  onLoadMore: () => void;
  onSend: (payload: { content: string; files?: File[]; mentions?: string[] }) => void;
  onRetry: (message: ChatMessage) => void;
  onReply: (message: ChatMessage) => void;
  onClearReply: () => void;
  onAddReaction: (message: ChatMessage, reaction: ChatReactionType) => void;
  onClearReaction: (message: ChatMessage) => void;
  onForward: (message: ChatMessage) => void;
  onHide: (message: ChatMessage) => void;
  onRecall: (message: ChatMessage) => void;
  onMentionClick: (emplNo: string, name: string, preview: string) => void;
  onConsumeDraft: () => void;
  /** Báo trạng thái "đang nhập" cho phòng hiện tại. */
  onTyping: (typing: boolean) => void;
  /** Tin nhắn cần cuộn tới và làm nổi bật (từ kết quả tìm kiếm). */
  focusMessage?: { conversationId: number; messageId: number; seq: number } | null;
  /** Nhảy tới tin nhắn ở phòng khác (tìm kiếm toàn cục). */
  onJumpToMessage: (conversationId: number, messageId: number) => void;
}

/** Giới hạn dung lượng mỗi tệp — khớp với env CHAT_UPLOAD_MAX_BYTES của backend. */
const MAX_FILE_BYTES = 1024 * 1024 * 1024;
const MAX_FILES_PER_MESSAGE = 5;

/** Tên tệp suy ra từ MIME khi clipboard không kèm tên (ảnh copy từ trang web). */
function nameFromMime(mime: string): string {
  const ext = (mime.split("/")[1] || "bin").split("+")[0].replace(/[^a-z0-9]/gi, "");
  return `clipboard-${Date.now()}.${ext || "bin"}`;
}

/** Lấy danh sách tệp từ clipboard (hỗ trợ copy tệp và copy ảnh). */
function clipboardFiles(data: DataTransfer | null): File[] {
  if (!data) return [];
  const out: File[] = [];
  const push = (file: File | null) => {
    if (!file) return;
    const named =
      file.name && file.name.trim()
        ? file
        : new File([file], nameFromMime(file.type || "application/octet-stream"), {
            type: file.type,
          });
    const duplicated = out.some(
      (item) => item.name === named.name && item.size === named.size && item.type === named.type
    );
    if (!duplicated) out.push(named);
  };

  // Chrome có thể đưa cùng 1 tệp vào cả `files` và `items` ⇒ ưu tiên `files` để khỏi trùng.
  if (data.files && data.files.length > 0) Array.from(data.files).forEach(push);
  else if (data.items) {
    Array.from(data.items)
      .filter((item) => item.kind === "file")
      .forEach((item) => push(item.getAsFile()));
  }
  return out;
}

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
  replyTarget,
  draftText,
  reactionBurst,
  onBack,
  onOpenInfo,
  onLoadMore,
  onSend,
  onRetry,
  onReply,
  onClearReply,
  onAddReaction,
  onClearReaction,
  onForward,
  onHide,
  onRecall,
  onMentionClick,
  onConsumeDraft,
  onTyping,
  focusMessage,
  onJumpToMessage,
}: Props) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [mentionKeyword, setMentionKeyword] = useState<string | null>(null);
  const [mentions, setMentions] = useState<string[]>([]);
  const [menuState, setMenuState] = useState<ChatMessageMenuState | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  /** Đang kéo tệp vào khung chat. */
  const [dragging, setDragging] = useState(false);
  /** Mở bảng tìm kiếm trong phòng. */
  const [showSearch, setShowSearch] = useState(false);
  /** Mở cửa sổ media/tệp của phòng. */
  const [showMedia, setShowMedia] = useState(false);
  /** Tin nhắn đang được làm nổi bật sau khi nhảy tới. */
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [storage, setStorage] = useState<ChatStorage | null>(null);

  const listRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const typingSentRef = useRef(false);
  const lastMessageIdRef = useRef<number>(0);
  /** Đếm độ sâu dragenter/dragleave để không nhấp nháy khi rê qua phần tử con. */
  const dragDepthRef = useRef(0);
  /** Vừa đổi phòng ⇒ cần cuộn xuống đáy ngay khi tin nhắn tải xong. */
  const pendingScrollRef = useRef(false);

  const isDirect = conversation.CONV_TYPE === "DIRECT";
  /** "My Files" — cloud cá nhân, không phải hội thoại với người khác. */
  const isSelf = conversation.CONV_TYPE === "SELF";
  const canModerate =
    conversation.MY_ROLE === "OWNER" ||
    conversation.MY_ROLE === "ADMIN" ||
    conversation.MY_ROLE === "MODERATOR";
  const peerOnline =
    isDirect && conversation.PEER_EMPL_NO ? onlineUsers.has(conversation.PEER_EMPL_NO) : false;

  // Văn bản soạn sẵn (bấm vào tên được tag ⇒ mở chat riêng kèm trích dẫn).
  useEffect(() => {
    if (!draftText) return;
    setText(draftText);
    onConsumeDraft();
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, [draftText, onConsumeDraft]);

  /**
   * Cuộn xuống cuối khung tin nhắn. Gọi lặp vài nhịp vì chiều cao danh sách còn thay đổi
   * sau khi React render xong (ảnh/font/video tải chậm).
   */
  const scrollToBottom = useCallback(() => {
    const element = listRef.current;
    if (!element) return;
    const apply = () => {
      element.scrollTop = element.scrollHeight;
    };
    apply();
    requestAnimationFrame(apply);
    window.setTimeout(apply, 90);
    window.setTimeout(apply, 320);
  }, []);

  // Đổi phòng ⇒ đánh dấu cần cuộn xuống đáy (dữ liệu về sau nên không cuộn ngay được).
  useEffect(() => {
    lastMessageIdRef.current = 0;
    pendingScrollRef.current = true;
  }, [conversation.CONVERSATION_ID]);

  // Cuộn xuống khi mở phòng: chờ tin nhắn tải xong rồi mới cuộn ⇒ luôn thấy tin mới nhất.
  useEffect(() => {
    if (!pendingScrollRef.current) return;
    if (loading) return;
    if (messages.length === 0) return;
    pendingScrollRef.current = false;
    scrollToBottom();
  }, [messages, loading, conversation.CONVERSATION_ID, scrollToBottom]);

  // Cuộn xuống khi có tin mới (chỉ khi đang ở gần đáy để không phá thao tác đọc).
  useEffect(() => {
    const element = listRef.current;
    if (!element) return;
    const newest = messages.length > 0 ? messages[messages.length - 1].MESSAGE_ID : 0;
    const append = newest > lastMessageIdRef.current;
    lastMessageIdRef.current = newest;
    if (!append) return;

    const nearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 240;
    if (nearBottom) scrollToBottom();
  }, [messages, scrollToBottom]);

  // Nhảy tới tin nhắn (từ kết quả tìm kiếm): cuộn tới giữa khung và làm nổi bật ~2.4s.
  useEffect(() => {
    if (!focusMessage || focusMessage.conversationId !== conversation.CONVERSATION_ID) return;
    let cancelled = false;
    const timers: number[] = [];

    const reveal = (attempt: number) => {
      if (cancelled) return;
      const target = listRef.current?.querySelector<HTMLElement>(
        `[data-message-id="${focusMessage.messageId}"]`
      );
      if (target) {
        target.scrollIntoView({ block: "center" });
        setHighlightId(focusMessage.messageId);
        timers.push(window.setTimeout(() => setHighlightId(null), 2400));
        return;
      }
      if (attempt < 8) timers.push(window.setTimeout(() => reveal(attempt + 1), 180));
    };

    reveal(0);
    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [focusMessage, conversation.CONVERSATION_ID]);

  // My Files: hiển thị dung lượng đã dùng ở tiêu đề (cloud cá nhân).
  // Theo dõi "chữ ký" của tin cuối (id + số tệp) vì tin lạc quan được thêm TRƯỚC khi
  // upload xong ⇒ chỉ theo dõi messages.length sẽ bỏ lỡ lúc tệp thực sự được lưu.
  const lastMessageSignature = useMemo(() => {
    const last = messages[messages.length - 1];
    if (!last) return "";
    return `${last.MESSAGE_ID}:${(last.ATTACHMENTS || []).length}:${last.DELETED_AT ? "d" : "a"}`;
  }, [messages]);

  useEffect(() => {
    if (!isSelf) {
      setStorage(null);
      return;
    }
    let cancelled = false;
    chatService
      .conversationStorage(conversation.CONVERSATION_ID)
      .then((data) => {
        if (!cancelled) setStorage(data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [isSelf, conversation.CONVERSATION_ID, lastMessageSignature]);

  /**
   * Dán ảnh/tệp từ clipboard (copy ảnh ở nơi khác hoặc copy tệp trong Explorer).
   * Gắn ở document vì sự kiện paste chỉ phát cho phần tử đang được focus.
   */
  const addFilesRef = useRef<(incoming: FileList | File[] | null) => void>(() => undefined);

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const incoming = clipboardFiles(event.clipboardData);
      if (incoming.length === 0) return;
      // Chỉ chặn hành vi mặc định khi thực sự có tệp để đính kèm.
      event.preventDefault();
      addFilesRef.current(incoming);
      setToast(`Đã dán ${incoming.length} tệp vào khung soạn tin`);
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, []);

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

  /**
   * Danh sách gợi ý khi gõ `@`: khớp theo TÊN (không dấu cũng được) hoặc MÃ nhân viên,
   * ưu tiên người có tên bắt đầu bằng từ khoá.
   */
  const mentionCandidates = useMemo(() => {
    if (mentionKeyword === null) return [];
    const key = normalizeText(mentionKeyword);
    const others = conversation.MEMBERS.filter((m) => m.EMPL_NO !== myEmplNo);
    if (!key) return others.slice(0, 8);
    return others
      .map((member) => {
        const name = normalizeText(member.FULL_NAME);
        const code = normalizeText(member.EMPL_NO);
        let score = -1;
        if (name.startsWith(key) || code.startsWith(key)) score = 0;
        else if (name.includes(key) || code.includes(key)) score = 1;
        return { member, score };
      })
      .filter((item) => item.score >= 0)
      .sort((a, b) => a.score - b.score)
      .slice(0, 8)
      .map((item) => item.member);
  }, [conversation.MEMBERS, mentionKeyword, myEmplNo]);

  /** Vị trí đang chọn trong danh sách gợi ý (điều hướng bằng phím mũi tên). */
  const [mentionIndex, setMentionIndex] = useState(0);
  const mentionListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMentionIndex(0);
  }, [mentionKeyword]);

  // Giữ mục đang chọn luôn nằm trong vùng nhìn thấy khi bấm mũi tên.
  useEffect(() => {
    const list = mentionListRef.current;
    if (!list) return;
    const active = list.children[mentionIndex] as HTMLElement | undefined;
    active?.scrollIntoView({ block: "nearest" });
  }, [mentionIndex, mentionCandidates.length]);

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

    const match = value.match(/@([^\s@]*)$/);
    setMentionKeyword(match ? match[1] : null);
  };

  const insertMention = useCallback(
    (member: ChatMember) => {
      // Tag hiển thị bằng TÊN nhân viên (rơi về mã nếu chưa có tên).
      const label = member.FULL_NAME || member.EMPL_NO;
      setText((prev) => prev.replace(/@([^\s@]*)$/, `@${label} `));
      setMentions((prev) => (prev.includes(member.EMPL_NO) ? prev : [...prev, member.EMPL_NO]));
      setMentionKeyword(null);
      textareaRef.current?.focus();
    },
    []
  );

  const addFiles = (incoming: FileList | File[] | null) => {
    if (!incoming) return;
    const list = Array.isArray(incoming) ? incoming : Array.from(incoming);
    if (list.length === 0) return;

    const accepted: File[] = [];
    let error: string | null = null;
    let oversized = 0;

    list.forEach((file) => {
      if (file.size > MAX_FILE_BYTES) {
        oversized += 1;
        return;
      }
      accepted.push(file);
    });

    if (oversized > 0) {
      error = `${oversized} tệp vượt quá 1GB nên bị bỏ qua`;
    }
    setFileError(error);
    if (accepted.length > 0) {
      setFiles((prev) => [...prev, ...accepted].slice(0, MAX_FILES_PER_MESSAGE));
    }
  };
  addFilesRef.current = addFiles;

  /* ---------------------- Kéo - thả tệp vào khung chat -------------------- */
  const dragHasFiles = (event: React.DragEvent<HTMLElement>) => {
    const types = event.dataTransfer?.types ? Array.from(event.dataTransfer.types) : [];
    return types.includes("Files");
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    if (!dragHasFiles(event)) return;
    event.preventDefault();
    dragDepthRef.current += 1;
    setDragging(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!dragHasFiles(event)) return;
    // Bắt buộc preventDefault thì trình duyệt mới cho phép thả.
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    if (!dragging) setDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    if (!dragHasFiles(event)) return;
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) setDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (!dragHasFiles(event)) return;
    event.preventDefault();
    dragDepthRef.current = 0;
    setDragging(false);
    addFiles(event.dataTransfer?.files || null);
  };

  const handleSubmit = () => {
    if (!text.trim() && files.length === 0) return;
    onSend({ content: text, files, mentions });
    setText("");
    setFiles([]);
    setMentions([]);
    setFileError(null);
    setMentionKeyword(null);
    onClearReply();
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Khi bảng gợi ý tag đang mở: mũi tên di chuyển, Enter/Tab chọn, Esc đóng.
    if (mentionKeyword !== null && mentionCandidates.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setMentionIndex((prev) => (prev + 1) % mentionCandidates.length);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setMentionIndex(
          (prev) => (prev - 1 + mentionCandidates.length) % mentionCandidates.length
        );
        return;
      }
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault();
        insertMention(mentionCandidates[Math.min(mentionIndex, mentionCandidates.length - 1)]);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setMentionKeyword(null);
        return;
      }
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleCopy = async (message: ChatMessage) => {
    const lines: string[] = [];
    if (message.CONTENT) lines.push(message.CONTENT);
    (message.ATTACHMENTS || []).forEach((attachment) =>
      lines.push(`[Tệp] ${attachment.originalName}`)
    );
    const payload = lines.join("\n") || "(tin nhắn trống)";

    try {
      await navigator.clipboard.writeText(payload);
      setToast("Đã sao chép tin nhắn");
    } catch (error) {
      console.warn("[chat] không sao chép được:", error);
      setToast("Không sao chép được (trình duyệt chặn clipboard)");
    }
  };

  /**
   * Chia sẻ ra app bên ngoài (Zalo, Kakao, Mail, ...).
   * - Không truyền `attachment` ⇒ chia sẻ cả tin nhắn (nội dung + tệp).
   * - Truyền `attachment` ⇒ chỉ chia sẻ đúng ảnh/tệp vừa bấm.
   */
  const handleShareOut = async (message: ChatMessage, attachment?: ChatAttachment) => {
    const outcome = attachment
      ? await shareAttachmentOut(attachment)
      : await shareMessageOut({
          message,
          conversation,
          senderName:
            memberOf(conversation, message.SENDER_EMPL_NO)?.FULL_NAME || message.SENDER_EMPL_NO,
        });
    setToast(outcome.message);
  };

  return (
    <div
      className={`erp-chat__main${dragging ? " is-dragging" : ""}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {dragging && (
        <div className="erp-chat__dropOverlay" aria-hidden="true">
          <CloudUploadRoundedIcon sx={{ fontSize: 44 }} />
          <strong>Thả tệp để đính kèm</strong>
          <small>
            Tối đa {MAX_FILES_PER_MESSAGE} tệp · mỗi tệp không quá 1GB · mọi định dạng
          </small>
        </div>
      )}

      <div className="erp-chat__mainHead">
        {isMobile && (
          <IconButton size="small" className="erp-chat__iconBtn" onClick={onBack} aria-label="Quay lại">
            <ArrowBackRoundedIcon fontSize="small" />
          </IconButton>
        )}
        <ChatRoomAvatar
          value={conversation.DISPLAY_AVATAR}
          name={conversation.DISPLAY_NAME}
          size={36}
          isDirect={isDirect}
        />
        <div className="erp-chat__mainMeta">
          <span className="erp-chat__mainName">{conversation.DISPLAY_NAME}</span>
          <span className="erp-chat__mainStatus">
            {isSelf ? (
              <>
                Cloud cá nhân, dung lượng không giới hạn
                {storage ? ` · ${storage.fileCount} tệp` : ""}
              </>
            ) : typingNames.length > 0 ? (
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

        <Tooltip title={showSearch ? "Đóng tìm kiếm" : "Tìm kiếm trong cuộc trò chuyện"}>
          <IconButton
            size="small"
            className={`erp-chat__iconBtn${showSearch ? " is-active" : ""}`}
            onClick={() => setShowSearch((prev) => !prev)}
            aria-label="Tìm kiếm trong cuộc trò chuyện"
          >
            <SearchRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Media & tệp của cuộc trò chuyện">
          <IconButton
            size="small"
            className="erp-chat__iconBtn"
            onClick={() => setShowMedia(true)}
            aria-label="Xem media của cuộc trò chuyện"
          >
            <PermMediaRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {!isSelf && (
          <Tooltip title={isDirect ? "Thông tin hội thoại" : "Quản lý nhóm"}>
            <IconButton size="small" className="erp-chat__iconBtn" onClick={onOpenInfo}>
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </div>

      {showSearch ? (
        <ChatSearchPanel
          conversationId={conversation.CONVERSATION_ID}
          conversation={conversation}
          myEmplNo={myEmplNo}
          onClose={() => setShowSearch(false)}
          onOpenResult={(conversationId, messageId) => {
            setShowSearch(false);
            onJumpToMessage(conversationId, messageId);
          }}
        />
      ) : (
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
              const prev = group.items[index - 1];
              const showAvatar =
                message.SENDER_EMPL_NO !== myEmplNo &&
                (!prev || prev.SENDER_EMPL_NO !== message.SENDER_EMPL_NO);

              return (
                <ChatMessageBubble
                  key={message.MESSAGE_ID}
                  message={message}
                  conversation={conversation}
                  myEmplNo={myEmplNo}
                  canModerate={canModerate}
                  showAvatar={showAvatar}
                  burst={
                    reactionBurst && reactionBurst.messageId === message.MESSAGE_ID
                      ? reactionBurst
                      : null
                  }
                  highlight={highlightId === message.MESSAGE_ID}
                  onOpenMenu={(target, x, y) => setMenuState({ message: target, top: y, left: x })}
                  onAddReaction={onAddReaction}
                  onReply={onReply}
                  onShareOut={(target, attachment) => void handleShareOut(target, attachment)}
                  onMentionClick={onMentionClick}
                />
              );
            })}
          </div>
        ))}
      </div>
      )}

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
          {files.map((file, index) => {
            const kind = fileKindOf(file.name, file.type);
            const color = FILE_KIND_COLOR[kind];
            return (
              <span key={`${file.name}-${index}`} className="erp-chat__pendingFile" title={file.name}>
                <i
                  className="erp-chat__pendingIcon"
                  style={{ background: color.bg, color: color.fg }}
                  aria-hidden="true"
                >
                  <FileKindIcon kind={kind} />
                </i>
                <span className="erp-chat__pendingName">{file.name}</span>
                <span className="erp-chat__pendingSize">{formatFileSize(file.size)}</span>
                <button
                  type="button"
                  aria-label={`Bỏ ${file.name}`}
                  onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                >
                  <CloseRoundedIcon sx={{ fontSize: 13 }} />
                </button>
              </span>
            );
          })}
        </div>
      )}

      <div className="erp-chat__composer">
        {mentionCandidates.length > 0 && (
          <div className="erp-chat__mentions" ref={mentionListRef} role="listbox">
            {mentionCandidates.map((member, index) => (
              <button
                key={member.EMPL_NO}
                type="button"
                role="option"
                aria-selected={index === mentionIndex}
                className={index === mentionIndex ? "is-active" : undefined}
                onMouseEnter={() => setMentionIndex(index)}
                onClick={() => insertMention(member)}
              >
                <Avatar
                  src={chatAvatarUrl(member.EMPL_NO, member.EMPL_IMAGE)}
                  sx={{ width: 22, height: 22, fontSize: 10 }}
                >
                  {initialsOf(member.FULL_NAME)}
                </Avatar>
                <span className="erp-chat__mentionName">{member.FULL_NAME || member.EMPL_NO}</span>
                <small className="erp-chat__mentionCode">({member.EMPL_NO})</small>
                {member.JOB_NAME && <small className="erp-chat__mentionJob">{member.JOB_NAME}</small>}
              </button>
            ))}
            <div className="erp-chat__mentionHint">
              ↑↓ để chọn · Enter để tag · Esc để đóng
            </div>
          </div>
        )}

        {replyTarget && (
          <div className="erp-chat__replyBar">
            <div className="erp-chat__replyBarBody">
              <span className="erp-chat__replyBarName">
                Trả lời{" "}
                {memberOf(conversation, replyTarget.senderEmplNo)?.FULL_NAME ||
                  replyTarget.senderEmplNo}
              </span>
              <span className="erp-chat__replyBarText">{replyTarget.preview}</span>
            </div>
            <IconButton size="small" onClick={onClearReply} aria-label="Bỏ trả lời">
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </div>
        )}

        <div className="erp-chat__composerRow">
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
            placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter xuống dòng, @ để tag tên)"            onChange={(event) => handleTextChange(event.target.value)}
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

      <ChatMediaDialog
        open={showMedia}
        conversationId={conversation.CONVERSATION_ID}
        conversationName={conversation.DISPLAY_NAME}
        isSelf={isSelf}
        onClose={() => setShowMedia(false)}
      />

      <ChatMessageMenu
        state={menuState}
        myEmplNo={myEmplNo}
        canRecall={canModerate}
        onClose={() => setMenuState(null)}
        onReply={onReply}
        onReact={(message, reaction) => onAddReaction(message, reaction)}
        onClearReaction={onClearReaction}
        onForward={onForward}
        onShareOut={(message) => void handleShareOut(message)}
        onCopy={(message) => void handleCopy(message)}
        onHide={onHide}
        onRecall={onRecall}
      />

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={2200}
        onClose={() => setToast(null)}
        message={toast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
}
