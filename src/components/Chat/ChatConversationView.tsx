import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Snackbar,
  Tooltip,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PermMediaRoundedIcon from "@mui/icons-material/PermMediaRounded";
import FolderSpecialRoundedIcon from "@mui/icons-material/FolderSpecialRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupsRounded";
import TextFormatRoundedIcon from "@mui/icons-material/TextFormatRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import NotificationsOffRoundedIcon from "@mui/icons-material/NotificationsOffRounded";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ViewSidebarRoundedIcon from "@mui/icons-material/ViewSidebarRounded";
import type {
  ChatAttachment,
  ChatConversation,
  ChatMember,
  ChatMessage,
  ChatPinnedMessage,
  ChatReactionBurst,
  ChatReactionType,
  ChatReplyTarget,
} from "./chat.types";

import ChatMessageMenu, { type ChatMessageMenuState } from "./ChatMessageMenu";
import ChatSearchPanel from "./ChatSearchPanel";
import ChatMediaDialog from "./ChatMediaDialog";
import ChatRichEditor, { type ChatRichEditorHandle } from "./ChatRichEditor";
import {
  isRichContentEmpty,
  plainTextToRichHtml,
  richToPlainText,
  sanitizeRichHtml,
} from "./chatRichText";
import ChatRoomAvatar from "./chatAvatars";
import { shareAttachmentOut, shareMessageOut, shareMessagesOut } from "./chatShareOut";
import type { PendingUpload } from "../../hooks/useChatController";
import { chatService, type ChatStorage } from "../../api/services/chatService";
import {
  FILE_KIND_COLOR,
  FileKindIcon,
  MENTION_ALL_ID,
  MENTION_ALL_NAME,
  RECALL_WINDOW_MINUTES,
  chatAvatarUrl,
  dayLabel,
  fileKindOf,
  formatFileSize,
  formatMuteRemaining,
  initialsOf,
  matchesMentionAll,
  memberFullLabel,
  mentionQueryFromText,
  messageAgeMinutes,
  messagePreview,
  normalizeName,
  normalizeText,
} from "./chatUtils";
import ChatMessageBubble from "./ChatMessageBubble";
import {
  clipboardHasTable,
  extractTableGrid,
  gridToText,
  renderGridToPngFile,
  renderTableHtmlToPngFile,
} from "./chatClipboardTable";

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
  onSend: (payload: { content: string; files?: File[]; mentions?: string[]; msgType?: string }) => void;
  onRetry: (message: ChatMessage) => void;
  onReply: (message: ChatMessage) => void;
  onClearReply: () => void;
  onAddReaction: (message: ChatMessage, reaction: ChatReactionType) => void;
  onClearReaction: (message: ChatMessage) => void;
  onForward: (message: ChatMessage) => void;
  onHide: (message: ChatMessage) => void;
  onRecall: (message: ChatMessage) => void;
  /** Xoá NHIỀU tin nhắn đang chọn: "hide" = ẩn phía tôi, "recall" = thu hồi 2 phía. */
  onDeleteMessages: (
    messageIds: number[],
    mode: "hide" | "recall"
  ) => Promise<{ recalled?: number[]; hidden?: number[]; skipped?: number } | null | void>;
  onMentionClick: (emplNo: string, name: string, preview: string) => void;
  onConsumeDraft: () => void;
  /** Báo trạng thái "đang nhập" cho phòng hiện tại. */
  onTyping: (typing: boolean) => void;
  /** Tin nhắn cần cuộn tới và làm nổi bật (từ kết quả tìm kiếm). */
  focusMessage?: { conversationId: number; messageId: number; seq: number } | null;
  /** Nhảy tới tin nhắn ở phòng khác (tìm kiếm toàn cục). */
  onJumpToMessage: (conversationId: number, messageId: number) => void;
  /** Mở menu tắt/bật thông báo cho RIÊNG phòng này (neo vào nút chuông). */
  onOpenMuteMenu: (anchor: HTMLElement) => void;
  /** Số giây còn tắt thông báo của phòng (null = đang nhận thông báo). */
  muteSecondsLeft: number | null;
  /** Đang ở chế độ "cho tới khi mở lại phòng". */
  muteUntilOpen: boolean;
  /** Tin nhắn đang ghim của phòng (ghim mới nhất trước). */
  pins: ChatPinnedMessage[];
  /** Mốc "đã đọc" của từng thành viên trong phòng (emplNo → messageId). */
  readState: Record<string, number>;
  /** Ghim / bỏ ghim 1 tin nhắn. */
  onTogglePin: (message: ChatMessage, pinned: boolean) => void;
  /**
   * Mobile: nút đóng cửa sổ chat được đưa vào header phòng (header "Tin nhắn nội bộ" bị bỏ).
   * `null` = không hiển thị nút đóng.
   */
  onCloseWindow?: (() => void) | null;
  /** Desktop: cột danh sách cuộc trò chuyện đang bị thu gọn hay không. */
  sidebarCollapsed?: boolean;
  /** Desktop: ẩn/hiện cột danh sách cuộc trò chuyện (nút ở header phòng). */
  onToggleSidebar?: () => void;
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

/** Ảnh bitmap mà app nguồn (Excel, Word...) đặt kèm trên clipboard — nếu có. */
function clipboardImageFile(data: DataTransfer | null): File | null {
  return clipboardFiles(data).find((file) => file.type.startsWith("image/")) || null;
}

/** Mục "@All" (tag cả phòng) trong danh sách gợi ý tag tên. */
const MENTION_ALL_MEMBER: ChatMember = {
  EMPL_NO: MENTION_ALL_ID,
  FULL_NAME: MENTION_ALL_NAME,
  ROLE: "MEMBER",
};

/** Nội dung rút gọn hiển thị trên thanh ghim (bỏ HTML với tin RICHTEXT). */
function pinPreview(pin: ChatPinnedMessage): string {
  return messagePreview(pin.MSG_TYPE, pin.CONTENT, false);
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
  onDeleteMessages,
  onMentionClick,
  onConsumeDraft,
  onTyping,
  focusMessage,
  onJumpToMessage,
  onOpenMuteMenu,
  muteSecondsLeft,
  muteUntilOpen,
  pins,
  readState,
  onTogglePin,
  onCloseWindow,
  sidebarCollapsed = false,
  onToggleSidebar,
}: Props) {
  const [text, setText] = useState("");
  /**
   * Chế độ soạn tin RICHTEXT (định dạng đậm/nghiêng/màu/cỡ chữ...).
   * Nhớ theo người dùng để lần sau mở lại vẫn đúng chế độ đang dùng.
   */
  const [richMode, setRichMode] = useState(() => {
    try {
      return localStorage.getItem("chat_rich_mode") === "1";
    } catch {
      return false;
    }
  });
  /** HTML hiện tại của vùng soạn richtext (đã lọc theo allowlist). */
  const [richHtml, setRichHtml] = useState("");
  const richEditorRef = useRef<ChatRichEditorHandle | null>(null);
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
  /** Tin nhắn đang mở danh sách "ai đã xem". */
  const [readersOf, setReadersOf] = useState<number | null>(null);
  /** Thu gọn thanh ghim (khi có nhiều ghim). */
  const [pinsOpen, setPinsOpen] = useState(true);
  /** Đang ở chế độ CHỌN NHIỀU tin nhắn (để chia sẻ/chuyển tiếp 1 lượt). */
  const [selectMode, setSelectMode] = useState(false);
  /** MESSAGE_ID của các tin đang được chọn. */
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  /** Mở hộp xác nhận xoá HÀNG LOẠT các tin đang chọn. */
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  /** Bảng vừa dán từ Excel ⇒ hỏi người dùng dán thành ẢNH hay CHỮ. */
  const [tablePaste, setTablePaste] = useState<{
    grid: string[][];
    html: string;
    /** Ảnh bitmap gốc do Excel đặt kèm clipboard (null nếu không có). */
    image: File | null;
  } | null>(null);
  /** Đang dựng ảnh từ bảng (nút "Dán thành ảnh"). */
  const [tableBusy, setTableBusy] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  /** Input riêng cho ảnh/video (mở thư viện ảnh trên mobile). */
  const mediaInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  /** Vị trí con trỏ gần nhất trong ô soạn tin (giữ lại cả khi textarea mất focus khi bấm chọn tag). */
  const caretRef = useRef<number>(0);
  /** Nhãn vừa chèn bằng tag tên — dùng để không tự mở lại danh sách gợi ý ngay sau khi chèn. */
  const justInsertedLabelRef = useRef<string>("");
  const typingSentRef = useRef(false);
  const lastMessageIdRef = useRef<number>(0);
  /** Đếm độ sâu dragenter/dragleave để không nhấp nháy khi rê qua phần tử con. */
  const dragDepthRef = useRef(0);
  /** Vừa đổi phòng ⇒ cần cuộn xuống đáy ngay khi tin nhắn tải xong. */
  const pendingScrollRef = useRef(false);
  /**
   * Mốc neo khi nạp thêm lịch sử: chiều cao khung + MESSAGE_ID của tin ĐẦU TIÊN lúc bấm.
   * Dùng để bù scrollTop sau khi prepend ⇒ vị trí đang đọc không bị nhảy.
   */
  const prependAnchorRef = useRef<{ scrollHeight: number; firstId: number } | null>(null);

  const isDirect = conversation.CONV_TYPE === "DIRECT";
  /** "My Files" — cloud cá nhân, không phải hội thoại với người khác. */
  const isSelf = conversation.CONV_TYPE === "SELF";
  const canModerate =
    conversation.MY_ROLE === "OWNER" ||
    conversation.MY_ROLE === "ADMIN" ||
    conversation.MY_ROLE === "MODERATOR";
  /** Thành viên KHÁC (trừ tôi) — dùng đếm "ai đã xem" tin nhắn của tôi. */
  const otherMembers = useMemo(
    () => (conversation.MEMBERS || []).filter((m) => m.EMPL_NO !== myEmplNo),
    [conversation.MEMBERS, myEmplNo]
  );
  const peerOnline =
    isDirect && conversation.PEER_EMPL_NO ? onlineUsers.has(conversation.PEER_EMPL_NO) : false;

  // Văn bản soạn sẵn (bấm vào tên được tag ⇒ mở chat riêng kèm trích dẫn).
  useEffect(() => {
    if (!draftText) return;
    setText(draftText);
    if (richMode) {
      const html = plainTextToRichHtml(draftText);
      setRichHtml(html);
      requestAnimationFrame(() => {
        richEditorRef.current?.setHtml(html);
        richEditorRef.current?.focus();
      });
    } else {
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
    onConsumeDraft();
  }, [draftText, onConsumeDraft, richMode]);

  /**
   * Bấm "Trả lời" ⇒ tự focus ô soạn tin để gõ ngay (trước đây phải trỏ chuột lại vào ô).
   * Con trỏ được đặt ở cuối nội dung đang soạn.
   */
  useEffect(() => {
    if (!replyTarget) return;
    const frame = requestAnimationFrame(() => {
      if (richMode) {
        richEditorRef.current?.focus();
        return;
      }
      const element = textareaRef.current;
      if (!element) return;
      element.focus();
      const end = element.value.length;
      element.setSelectionRange(end, end);
      caretRef.current = end;
    });
    return () => cancelAnimationFrame(frame);
  }, [replyTarget, richMode]);

  // Đổi phòng ⇒ thoát chế độ chọn nhiều (phạm vi chọn thuộc từng phòng).
  useEffect(() => {
    setSelectMode(false);
    setSelectedIds([]);
  }, [conversation.CONVERSATION_ID]);

  /** Bật chế độ chọn nhiều ngay từ menu ngữ cảnh của 1 tin. */
  const startSelectMode = useCallback((message: ChatMessage) => {
    setSelectMode(true);
    setSelectedIds([message.MESSAGE_ID]);
  }, []);

  const exitSelectMode = useCallback(() => {
    setSelectMode(false);
    setSelectedIds([]);
  }, []);

  const toggleSelectMessage = useCallback((message: ChatMessage) => {
    setSelectedIds((prev) =>
      prev.includes(message.MESSAGE_ID)
        ? prev.filter((id) => id !== message.MESSAGE_ID)
        : [...prev, message.MESSAGE_ID]
    );
  }, []);

  /** Các tin đang chọn, theo đúng thứ tự hiển thị trong khung chat. */
  const selectedMessages = useMemo(
    () => messages.filter((message) => selectedIds.includes(message.MESSAGE_ID)),
    [messages, selectedIds]
  );

  /** Báo "đang nhập" — tự chống spam trong 2.5s (dùng chung cho cả 2 chế độ soạn tin). */
  const notifyTyping = useCallback(() => {
    if (typingSentRef.current) return;
    typingSentRef.current = true;
    onTyping(true);
    window.setTimeout(() => {
      typingSentRef.current = false;
      onTyping(false);
    }, 2500);
  }, [onTyping]);

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

  /**
   * Giữ nguyên vị trí đang đọc khi nạp thêm tin CŨ (prepend).
   * Không có bước này, nội dung chèn lên trên sẽ đẩy phần đang xem xuống ⇒ giật màn hình.
   */
  useEffect(() => {
    const element = listRef.current;
    if (!element) return;
    const anchor = prependAnchorRef.current;
    if (!anchor) return;
    // Chỉ xử lý 1 lần cho mỗi lần bấm (dù dữ liệu về sau vài nhịp render).
    prependAnchorRef.current = null;
    const firstId = messages.length > 0 ? messages[0].MESSAGE_ID : 0;
    // Chỉ bù khi thật sự đã prepend tin cũ hơn; tin mới/không đổi thì bỏ qua.
    if (firstId > 0 && firstId < anchor.firstId) {
      const delta = element.scrollHeight - anchor.scrollHeight;
      if (delta > 0) element.scrollTop += delta;
    }
  }, [messages]);

  /** Bấm "Tải tin nhắn cũ hơn": ghi mốc TRƯỚC khi dữ liệu được thêm vào. */
  const handleLoadMore = useCallback(() => {
    const element = listRef.current;
    const firstId = messages.length > 0 ? messages[0].MESSAGE_ID : 0;
    if (element && firstId > 0) {
      prependAnchorRef.current = { scrollHeight: element.scrollHeight, firstId };
    }
    onLoadMore();
  }, [messages, onLoadMore]);

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

  // Dán ảnh/tệp từ clipboard (copy ảnh ở nơi khác hoặc copy tệp trong Explorer).
  // Gắn ở document vì sự kiện paste chỉ phát cho phần tử đang được focus.
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

  // Dán BẢNG (copy từ Excel hoặc bảng trên web) trong khung chat ⇒ hỏi "Ảnh hay Chữ".
  // Dùng pha CAPTURE để chặn TRƯỚC khi trình soạn thảo (richtext/textarea) tự chèn HTML bảng.
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const data = event.clipboardData;
      if (!data) return;
      const inChat =
        event.target instanceof Element && Boolean(event.target.closest(".erp-chat__main"));
      if (!inChat || !clipboardHasTable(data)) return;
      const html = data.getData("text/html") || "";
      const grid = extractTableGrid(html);
      if (grid.length === 0) return;
      event.preventDefault();
      event.stopPropagation();
      setTablePaste({ grid, html, image: clipboardImageFile(data) });
    };
    document.addEventListener("paste", onPaste, true);
    return () => document.removeEventListener("paste", onPaste, true);
  }, []);

  /** Dán bảng dạng CHỮ vào ô soạn tin (giữ đúng thứ tự ô, mỗi hàng 1 dòng). */
  const applyTableAsText = useCallback(() => {
    const grid = tablePaste?.grid;
    if (!grid) return;
    const plain = gridToText(grid);
    if (richMode) {
      richEditorRef.current?.insertText(`\n${plain}\n`);
    } else {
      const element = textareaRef.current;
      const caret =
        element?.selectionStart ?? caretRef.current ?? text.length;
      const next = `${text.slice(0, caret)}${plain}${text.slice(caret)}`;
      setText(next);
      const nextCaret = caret + plain.length;
      requestAnimationFrame(() => {
        const el = textareaRef.current;
        el?.focus();
        el?.setSelectionRange(nextCaret, nextCaret);
        caretRef.current = nextCaret;
      });
    }
    setTablePaste(null);
    setToast("Đã dán bảng dạng chữ");
  }, [tablePaste, richMode, text]);

  /** Dựng bảng thành ảnh PNG rồi đính kèm vào khung soạn tin. */
  const applyTableAsImage = useCallback(async () => {
    const grid = tablePaste?.grid;
    if (!grid) return;
    setTableBusy(true);
    try {
      const name = `bang-${Date.now()}.png`;
      // Ưu tiên dựng ảnh từ HTML gốc (GIỐNG bảng Excel); lỗi thì vẽ thủ công từ ma trận ô.
      const file =
        (await renderTableHtmlToPngFile(tablePaste?.html || "", name)) ||
        (await renderGridToPngFile(grid, name));
      if (!file) {
        setToast("Không dựng được ảnh từ bảng");
        return;
      }
      addFilesRef.current([file]);
      setTablePaste(null);
      setToast("Đã dán bảng thành ảnh — bấm Gửi để hoàn tất");
    } finally {
      setTableBusy(false);
    }
  }, [tablePaste]);

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
    const key = normalizeName(mentionKeyword);
    const others = conversation.MEMBERS.filter((m) => m.EMPL_NO !== myEmplNo);
    // "@All" luôn đứng ĐẦU khi từ khoá khớp (trống ⇒ cũng gợi ý luôn).
    const allEntry = matchesMentionAll(key) ? [MENTION_ALL_MEMBER] : [];
    if (!key) return [...allEntry, ...others].slice(0, 8);
    return [
      ...allEntry,
      ...others
        .map((member) => {
          const name = normalizeName(member.FULL_NAME);
          const code = normalizeText(member.EMPL_NO);
          let score = -1;
          if (name.startsWith(key) || code.startsWith(key)) score = 0;
          else if (name.includes(key) || code.includes(key)) score = 1;
          return { member, score };
        })
        .filter((item) => item.score >= 0)
        .sort((a, b) => a.score - b.score)
        .map((item) => item.member),
    ].slice(0, 8);
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

  /**
   * Đồng bộ từ khoá tag tên từ vị trí con trỏ.
   * Bỏ qua ngay sau khi vừa chèn 1 tag (nếu không danh sách sẽ tự bật lại đúng người vừa chọn).
   */
  const applyMentionQuery = useCallback((raw: string | null) => {
    const inserted = justInsertedLabelRef.current;
    if (inserted) {
      if (normalizeName(raw) === inserted) return; // vừa chèn xong ⇒ giữ đóng
      justInsertedLabelRef.current = ""; // đã gõ tiếp nội dung khác ⇒ cho phép gợi ý lại
    }
    setMentionKeyword(raw);
  }, []);

  const handleTextChange = (value: string, caret?: number | null) => {
    setText(value);

    if (value.trim().length > 0) notifyTyping();

    // Lấy từ khoá theo đúng vị trí con trỏ (sửa giữa câu vẫn phải đúng).
    const position = typeof caret === "number" ? caret : value.length;
    caretRef.current = position;
    applyMentionQuery(mentionQueryFromText(value.slice(0, position)));
  };

  /** Bật/tắt chế độ richtext — chuyển đổi nội dung đang soạn giữa text thuần và HTML. */
  const toggleRichMode = () => {
    const next = !richMode;
    if (next) {
      const html = richHtml || plainTextToRichHtml(text);
      setRichHtml(html);
      setRichMode(true);
      requestAnimationFrame(() => {
        richEditorRef.current?.setHtml(html);
        richEditorRef.current?.focus();
      });
    } else {
      setText(richToPlainText(richHtml));
      setRichMode(false);
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
    try {
      localStorage.setItem("chat_rich_mode", next ? "1" : "0");
    } catch {
      /* localStorage bị chặn — bỏ qua, chỉ mất tính năng nhớ chế độ. */
    }
  };

  const insertMention = useCallback(
    (member: ChatMember) => {
      const isAll = member.EMPL_NO === MENTION_ALL_ID;
      // Tag hiển thị bằng TÊN nhân viên (rơi về mã nếu chưa có tên); @All dùng chữ "All".
      const label = isAll ? MENTION_ALL_NAME : member.FULL_NAME || member.EMPL_NO;
      if (richMode) {
        richEditorRef.current?.insertMention(label);
      } else {
        // Thay thế ĐÚNG đoạn `@...` đang gõ (có thể gồm nhiều từ) tại vị trí con trỏ.
        const element = textareaRef.current;
        const caret = element?.selectionStart ?? caretRef.current ?? text.length;
        const query = mentionQueryFromText(text.slice(0, caret));
        if (query !== null) {
          const start = caret - query.length - 1;
          const next = `${text.slice(0, start)}@${label} ${text.slice(caret)}`;
          setText(next);
          const nextCaret = start + label.length + 2;
          requestAnimationFrame(() => {
            const el = textareaRef.current;
            el?.focus();
            el?.setSelectionRange(nextCaret, nextCaret);
            caretRef.current = nextCaret;
          });
        } else {
          setText((prev) => `${prev}@${label} `);
          textareaRef.current?.focus();
        }
      }
      justInsertedLabelRef.current = normalizeName(label);
      if (isAll) {
        // Tag cả phòng ⇒ đánh dấu MỌI thành viên khác trong `mentions`.
        const allNos = conversation.MEMBERS.filter((m) => m.EMPL_NO !== myEmplNo).map(
          (m) => m.EMPL_NO
        );
        setMentions((prev) => [...new Set([...prev, ...allNos])]);
      } else {
        setMentions((prev) => (prev.includes(member.EMPL_NO) ? prev : [...prev, member.EMPL_NO]));
      }
      setMentionKeyword(null);
    },
    [richMode, text, conversation.MEMBERS, myEmplNo]
  );

  const addFiles = (incoming: FileList | File[] | null, options?: { mediaOnly?: boolean }) => {
    if (!incoming) return;
    const list = Array.isArray(incoming) ? incoming : Array.from(incoming);
    if (list.length === 0) return;

    const mediaOnly = options?.mediaOnly === true;
    const accepted: File[] = [];
    const errors: string[] = [];
    let oversized = 0;
    let rejected = 0;

    list.forEach((file) => {
      if (file.size > MAX_FILE_BYTES) {
        oversized += 1;
        return;
      }
      if (mediaOnly) {
        // "Gửi ảnh/video" chỉ nhận ảnh và video; nhận diện theo MIME, rơi về đuôi tệp
        // vì có máy trả MIME chung chung (application/octet-stream).
        const kind = fileKindOf(file.name, file.type);
        if (kind !== "image" && kind !== "video") {
          rejected += 1;
          return;
        }
      }
      accepted.push(file);
    });

    if (oversized > 0) {
      errors.push(`${oversized} tệp vượt quá 1GB nên bị bỏ qua`);
    }
    if (rejected > 0) {
      errors.push(`${rejected} tệp không phải ảnh/video nên bị bỏ qua`);
    }
    setFileError(errors.length > 0 ? errors.join("; ") : null);
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
    if (richMode) {
      // Gửi HTML ĐÃ LỌC — server vẫn có lớp lọc riêng trước khi lưu.
      const html = sanitizeRichHtml(richHtml);
      if (isRichContentEmpty(html) && files.length === 0) return;
      onSend({ content: html, files, mentions, msgType: "RICH" });
    } else {
      if (!text.trim() && files.length === 0) return;
      onSend({ content: text, files, mentions });
    }
    setText("");
    setRichHtml("");
    richEditorRef.current?.clear();
    setFiles([]);
    setMentions([]);
    setFileError(null);
    setMentionKeyword(null);
    justInsertedLabelRef.current = "";
    onClearReply();
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  /**
   * Điều hướng bảng gợi ý tag khi đang ở chế độ richtext.
   * Trả về true nghĩa là đã xử lý phím ⇒ ChatRichEditor không gửi tin/xuống dòng.
   */
  const handleRichMentionKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (mentionKeyword === null || mentionCandidates.length === 0) return false;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setMentionIndex((prev) => (prev + 1) % mentionCandidates.length);
      return true;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setMentionIndex(
        (prev) => (prev - 1 + mentionCandidates.length) % mentionCandidates.length
      );
      return true;
    }
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      insertMention(mentionCandidates[Math.min(mentionIndex, mentionCandidates.length - 1)]);
      return true;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setMentionKeyword(null);
      return true;
    }
    return false;
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
    if (message.CONTENT) {
      // Tin RICHTEXT lưu HTML ⇒ sao chép phải ra chữ thuần.
      lines.push(
        message.MSG_TYPE === "RICH" ? richToPlainText(message.CONTENT) : message.CONTENT
      );
    }
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

  /** Chia sẻ NHIỀU tin nhắn đang chọn trong 1 lượt (Web Share / sao chép / tải tệp). */
  const handleShareSelected = async () => {
    if (selectedMessages.length === 0) return;
    const outcome = await shareMessagesOut({
      messages: selectedMessages,
      conversation,
      senderNameOf: (emplNo) => memberOf(conversation, emplNo)?.FULL_NAME || emplNo,
    });
    setToast(outcome.message);
    if (outcome.ok) exitSelectMode();
  };

  /** Sao chép nội dung của TẤT CẢ tin đang chọn. */
  const handleCopySelected = async () => {
    if (selectedMessages.length === 0) return;
    const payload = selectedMessages
      .map((message) => {
        const lines: string[] = [];
        if (message.CONTENT) {
          lines.push(message.MSG_TYPE === "RICH" ? richToPlainText(message.CONTENT) : message.CONTENT);
        }
        (message.ATTACHMENTS || []).forEach((attachment) =>
          lines.push(`[Tệp] ${attachment.originalName}`)
        );
        return lines.join("\n") || "(tin nhắn trống)";
      })
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(payload);
      setToast(`Đã sao chép ${selectedMessages.length} tin nhắn`);
      exitSelectMode();
    } catch (error) {
      console.warn("[chat] không sao chép được:", error);
      setToast("Không sao chép được (trình duyệt chặn clipboard)");
    }
  };

  /**
   * Tin nhắn CÓ THỂ THU HỒI (xoá cả hai phía):
   *  - chỉ tin do CHÍNH MÌNH gửi;
   *  - đối phương CHƯA XEM, hoặc trong vòng `RECALL_WINDOW_MINUTES` phút.
   * (Backend kiểm tra lại lần nữa — đây chỉ để ẩn/hiện nút cho đúng.)
   */
  const canRecallMessage = useCallback(
    (message: ChatMessage) => {
      if (!message || message.DELETED_AT) return false;
      if (message.SENDER_EMPL_NO !== myEmplNo) return false;
      if (!Number.isFinite(message.MESSAGE_ID) || message.MESSAGE_ID <= 0) return false;
      const withinWindow = messageAgeMinutes(message.CREATED_AT) <= RECALL_WINDOW_MINUTES;
      const unseen = otherMembers.some(
        (member) => Number(readState?.[member.EMPL_NO] || 0) < message.MESSAGE_ID
      );
      return unseen || withinWindow;
    },
    [myEmplNo, otherMembers, readState]
  );

  /** Toàn bộ tin đang chọn đều thu hồi được (chỉ tin của tôi + đủ điều kiện). */
  const canRecallSelected = useMemo(
    () => selectedMessages.length > 0 && selectedMessages.every((m) => canRecallMessage(m)),
    [selectedMessages, canRecallMessage]
  );

  const handleDeleteSelected = async (mode: "hide" | "recall") => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    setBulkDeleteOpen(false);
    const result = await onDeleteMessages([...selectedIds], mode);
    exitSelectMode();
    if (mode === "recall") {
      const recalledCount = result?.recalled?.length ?? count;
      const skipped = result?.skipped ?? 0;
      setToast(
        skipped > 0
          ? `Đã thu hồi ${recalledCount} tin · bỏ qua ${skipped} tin không đủ điều kiện`
          : `Đã thu hồi ${recalledCount} tin nhắn`
      );
    } else {
      setToast(`Đã xoá ${count} tin nhắn`);
    }
  };

  /** Dán ẢNH GỐC do Excel đặt kèm trên clipboard (không qua vẽ lại). */
  const applyTableAsOriginalImage = useCallback(() => {
    const image = tablePaste?.image;
    if (!image) {
      setToast("Clipboard không kèm ảnh gốc từ Excel");
      return;
    }
    addFilesRef.current([image]);
    setTablePaste(null);
    setToast("Đã dán ảnh gốc từ Excel — bấm Gửi để hoàn tất");
  }, [tablePaste]);

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
          <span className="erp-chat__mainName">{conversation.DISPLAY_NAME}</span>          <span className="erp-chat__mainStatus">
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

        {/* Desktop: ẩn/hiện cột danh sách cuộc trò chuyện để tiết kiệm không gian. */}
        {!isMobile && onToggleSidebar && (
          <Tooltip
            title={sidebarCollapsed ? "Hiện danh sách cuộc trò chuyện" : "Ẩn danh sách cuộc trò chuyện"}
          >
            <IconButton
              size="small"
              className={`erp-chat__iconBtn${sidebarCollapsed ? " is-active" : ""}`}
              onClick={onToggleSidebar}
              aria-label={
                sidebarCollapsed ? "Hiện danh sách cuộc trò chuyện" : "Ẩn danh sách cuộc trò chuyện"
              }
            >
              <ViewSidebarRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

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

        {/* Chuông tắt thông báo RIÊNG cho phòng này (trước đây là chuông toàn cục ở header cửa sổ). */}
        <Tooltip
          title={
            muteSecondsLeft
              ? muteUntilOpen
                ? "Đang tắt thông báo cho tới khi mở lại phòng này · bấm để đổi"
                : `Đang tắt thông báo phòng này (còn ${formatMuteRemaining(muteSecondsLeft)}) · bấm để đổi`
              : "Tắt thông báo cho phòng này"
          }
        >
          <IconButton
            size="small"
            className={`erp-chat__iconBtn${muteSecondsLeft ? " is-muted" : ""}`}
            onClick={(event) => onOpenMuteMenu(event.currentTarget)}
            aria-label="Tắt thông báo cho phòng này"
          >
            {muteSecondsLeft ? (
              <NotificationsOffRoundedIcon fontSize="small" />
            ) : (
              <NotificationsActiveRoundedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        {/* Mobile: nút đóng cửa sổ chat nằm trong header phòng (bỏ header "Tin nhắn nội bộ"). */}
        {onCloseWindow && (
          <IconButton
            size="small"
            className="erp-chat__iconBtn"
            onClick={onCloseWindow}
            aria-label="Đóng chat"
            title="Đóng chat"
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        )}
      </div>

      {/* Thanh ghim — tin nhắn đang ghim của phòng, bấm để nhảy tới tin gốc */}
      {pins.length > 0 && (
        <div className={`erp-chat__pins${pinsOpen ? "" : " is-collapsed"}`}>
          <button
            type="button"
            className="erp-chat__pinsToggle"
            onClick={() => setPinsOpen((prev) => !prev)}
            title={pinsOpen ? "Thu gọn danh sách ghim" : "Mở danh sách ghim"}
            aria-label={pinsOpen ? "Thu gọn danh sách ghim" : "Mở danh sách ghim"}
          >
            <PushPinRoundedIcon sx={{ fontSize: 15 }} />
            <em>{pins.length}</em>
          </button>
          {pinsOpen && (
            <div className="erp-chat__pinsList">
              {pins.map((pin) => (
                <button
                  key={pin.MESSAGE_ID}
                  type="button"
                  className="erp-chat__pinItem"
                  onClick={() =>
                    onJumpToMessage(conversation.CONVERSATION_ID, pin.MESSAGE_ID)
                  }
                  title="Bấm để tới tin nhắhandlegốc"
                >
                  <span className="erp-chat__pinWho">
                    {memberOf(conversation, pin.SENDER_EMPL_NO)?.FULL_NAME ||
                      pin.SENDER_EMPL_NO}
                  </span>
                  <span className="erp-chat__pinText">{pinPreview(pin)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

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
                  onOpenMenu={(target, x, y) =>
                    setMenuState({
                      // Tin nhắn trong bộ đang hiển thị KHÔNG kèm cờ ghim (ghim nằm ở
                      // danh sách PINNED của phòng) ⇒ gắn thêm để menu hiện đúng
                      // "Ghim tin nhắn" / "Bỏ ghim tin nhắn".
                      message: {
                        ...target,
                        PINNED_AT:
                          (pins || []).find((p) => p.MESSAGE_ID === target.MESSAGE_ID)
                            ?.PINNED_AT || null,
                      },
                      top: y,
                      left: x,
                    })
                  }
                  isPinned={(pins || []).some((p) => p.MESSAGE_ID === message.MESSAGE_ID)}
                  readReceipt={
                    message.SENDER_EMPL_NO === myEmplNo && message.MSG_TYPE !== "SYSTEM"
                      ? {
                          readCount: otherMembers.filter(
                            (member) =>
                              (readState?.[member.EMPL_NO] || 0) >= message.MESSAGE_ID
                          ).length,
                          totalCount: otherMembers.length,
                          onOpen: () => setReadersOf(message.MESSAGE_ID),
                        }
                      : null
                  }
                  onAddReaction={onAddReaction}
                  onReply={onReply}
                  onShareOut={(target, attachment) => void handleShareOut(target, attachment)}
                  onMentionClick={onMentionClick}
                  selectionMode={selectMode}
                  selected={selectedIds.includes(message.MESSAGE_ID)}
                  onToggleSelect={toggleSelectMessage}
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

      {/* Thanh chọn nhiều tin nhắn: chia sẻ / sao chép một lượt. */}
      {selectMode && (
        <div className="erp-chat__selectBar" role="toolbar" aria-label="Chọn nhiều tin nhắn">
          <span className="erp-chat__selectCount">
            Đã chọn <strong>{selectedIds.length}</strong> tin nhắn
          </span>
          <div className="erp-chat__selectActions">
            <Button
              size="small"
              startIcon={<ContentCopyRoundedIcon sx={{ fontSize: 16 }} />}
              disabled={selectedIds.length === 0}
              onClick={() => void handleCopySelected()}
            >
              Sao chép
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<IosShareRoundedIcon sx={{ fontSize: 16 }} />}
              disabled={selectedIds.length === 0}
              onClick={() => void handleShareSelected()}
            >
              Chia sẻ
            </Button>
            <Button
              size="small"
              color="error"
              startIcon={<DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />}
              disabled={selectedIds.length === 0}
              onClick={() => setBulkDeleteOpen(true)}
            >
              Xoá
            </Button>
            <Button size="small" onClick={exitSelectMode}>
              Huỷ
            </Button>
          </div>
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
                {member.EMPL_NO === MENTION_ALL_ID ? (
                  <span className="erp-chat__mentionAllIcon" aria-hidden="true">
                    <GroupRoundedIcon sx={{ fontSize: 16 }} />
                  </span>
                ) : (
                  <Avatar
                    src={chatAvatarUrl(member.EMPL_NO, member.EMPL_IMAGE)}
                    sx={{ width: 22, height: 22, fontSize: 10 }}
                  >
                    {initialsOf(member.FULL_NAME)}
                  </Avatar>
                )}
                <span className="erp-chat__mentionName">
                  {member.EMPL_NO === MENTION_ALL_ID ? "All — cả phòng" : memberFullLabel(member)}
                </span>
                {member.EMPL_NO === MENTION_ALL_ID ? (
                  <small className="erp-chat__mentionJob">tất cả mọi người</small>
                ) : (
                  <>
                    <small className="erp-chat__mentionCode">({member.EMPL_NO})</small>
                    {member.JOB_NAME && (
                      <small className="erp-chat__mentionJob">{member.JOB_NAME}</small>
                    )}
                  </>
                )}
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

        <div className={`erp-chat__composerRow${richMode ? " is-rich" : ""}`}>
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

          {/*
           * Nút riêng cho ẢNH/VIDEO: trên mobile, `accept="image/*,video/*"` mở thẳng
           * thư viện ảnh của máy, nhanh hơn nhiều so với phải duyệt cây thư mục ở nút tệp.
           */}
          <Tooltip title="Gửi ảnh / video (mở thư viện ảnh)">
            <IconButton
              size="small"
              className="erp-chat__iconBtn"
              onClick={() => mediaInputRef.current?.click()}
              aria-label="Gửi ảnh hoặc video"
            >
              <ImageRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <input
            ref={mediaInputRef}
            type="file"
            hidden
            multiple
            accept="image/*,video/*"
            onChange={(event) => {
              addFiles(event.target.files, { mediaOnly: true });
              event.target.value = "";
            }}
          />

          <Tooltip
            title={
              richMode
                ? "Tắt chế độ định dạng (quay về văn bản thuần)"
                : "Bật chế độ định dạng (Richtext)"
            }
          >
            <IconButton
              size="small"
              className={`erp-chat__iconBtn${richMode ? " is-rich" : ""}`}
              onClick={toggleRichMode}
              aria-label={richMode ? "Tắt chế độ định dạng" : "Bật chế độ định dạng"}
            >
              <TextFormatRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {richMode ? (
            <ChatRichEditor
              ref={richEditorRef}
              onChange={setRichHtml}
              onSubmit={handleSubmit}
              onTyping={notifyTyping}
              onMentionQuery={applyMentionQuery}
              mentionOpen={mentionKeyword !== null && mentionCandidates.length > 0}
              onMentionKeyDown={handleRichMentionKeyDown}
            />
          ) : (
            <textarea
              ref={textareaRef}
              className="erp-chat__input"
              rows={1}
              value={text}
              placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter xuống dòng, @ để tag tên)"
              onChange={(event) =>
                handleTextChange(event.target.value, event.target.selectionStart)
              }
              onSelect={(event) => {
                const target = event.target as HTMLTextAreaElement;
                caretRef.current = target.selectionStart ?? caretRef.current;
              }}
              onKeyDown={handleKeyDown}
              onInput={(event) => {
                const target = event.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
            />
          )}

          <IconButton
            size="small"
            className="erp-chat__sendBtn"
            onClick={handleSubmit}
            disabled={
              files.length === 0 &&
              (richMode ? isRichContentEmpty(richHtml) : !text.trim())
            }
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
        myEmplNo={myEmplNo}
        members={conversation.MEMBERS}
        onOpenMessage={(conversationId, messageId) => {
          setShowMedia(false);
          onJumpToMessage(conversationId, messageId);
        }}
        onClose={() => setShowMedia(false)}
      />

      <ChatMessageMenu
        state={menuState}
        myEmplNo={myEmplNo}
        canRecall={menuState ? canRecallMessage(menuState.message) : false}
        onClose={() => setMenuState(null)}
        onReply={onReply}
        onReact={(message, reaction) => onAddReaction(message, reaction)}
        onClearReaction={onClearReaction}
        onForward={onForward}
        onShareOut={(message) => void handleShareOut(message)}
        onCopy={(message) => void handleCopy(message)}
        onHide={onHide}
        onRecall={onRecall}
        onTogglePin={onTogglePin}
        onSelectMultiple={startSelectMode}
      />

      {/* Xác nhận xoá HÀNG LOẠT các tin nhắn đang chọn */}
      <Dialog
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: 16, fontWeight: 700 }}>Xoá tin nhắn đã chọn?</DialogTitle>
        <DialogContent>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55 }}>
            Bạn đã chọn <b>{selectedIds.length}</b> tin nhắn.
          </p>
          <p style={{ margin: "8px 0 0", fontSize: 12.5, color: "#475569" }}>
            "Xoá ở phía tôi" chỉ ẩn với bạn; "Thu hồi" khiến cả phòng thấy tin đã thu hồi.
          </p>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1.5, gap: 1, flexWrap: "wrap" }}>
          <Button size="small" onClick={() => setBulkDeleteOpen(false)}>
            Huỷ
          </Button>
          <Button size="small" onClick={() => void handleDeleteSelected("hide")}>
            Xoá ở phía tôi
          </Button>
          {canRecallSelected && (
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={() => void handleDeleteSelected("recall")}
            >
              Thu hồi với cả hai phía
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Dán bảng từ Excel: hỏi dán thành ẢNH hay CHỮ */}
      <Dialog
        open={Boolean(tablePaste)}
        onClose={() => setTablePaste(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: 16, fontWeight: 700 }}>Dán bảng vào chat</DialogTitle>
        <DialogContent>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55 }}>
            Bạn vừa dán một bảng ({tablePaste?.grid.length || 0} hàng). Chọn cách dán:
          </p>
          <div className="erp-chat__tablePreview">
            <table>
              <tbody>
                {(tablePaste?.grid || []).slice(0, 12).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.slice(0, 8).map((cell, cellIndex) => (
                      <td key={cellIndex} title={cell}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {(tablePaste?.grid.length || 0) > 12 && (
              <small>… và {tablePaste!.grid.length - 12} hàng nữa</small>
            )}
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "#475569" }}>
            <b>Ảnh theo HTML</b>: dựng ảnh từ chính bảng HTML — giữ màu/kẻ/font, bỏ dòng bị ẩn.
            <br />
            <b>Ảnh gốc Excel</b>: dùng ảnh bitmap Excel đặt kèm clipboard (nếu có).
            <br />
            <b>Dán dạng chữ</b>: chèn văn bản thuần (dán lại vào Excel vẫn ra bảng).
          </p>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1.5, gap: 1, flexWrap: "wrap" }}>
          <Button size="small" onClick={() => setTablePaste(null)} disabled={tableBusy}>
            Huỷ
          </Button>
          <Button size="small" onClick={applyTableAsText} disabled={tableBusy}>
            Dán dạng chữ
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={applyTableAsOriginalImage}
            disabled={tableBusy || !tablePaste?.image}
            title={
              tablePaste?.image
                ? "Ảnh bitmap do Excel đặt trên clipboard"
                : "Clipboard không kèm ảnh gốc từ Excel"
            }
          >
            Ảnh gốc Excel
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => void applyTableAsImage()}
            disabled={tableBusy}
          >
            {tableBusy ? "Đang tạo ảnh..." : "Ảnh theo HTML"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Danh sách người đã xem 1 tin nhắn của tôi */}
      <Dialog
        open={readersOf !== null}
        onClose={() => setReadersOf(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: 15, fontWeight: 700, pb: 0.5 }}>
          Người đã xem tin nhắn
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {(() => {
            const read = otherMembers.filter(
              (member) => (readState?.[member.EMPL_NO] || 0) >= (readersOf || 0)
            );
            const notRead = otherMembers.filter(
              (member) => (readState?.[member.EMPL_NO] || 0) < (readersOf || 0)
            );
            if (otherMembers.length === 0) {
              return <div className="erp-chat__readersEmpty">Phòng này chỉ có mình bạn.</div>;
            }
            return (
              <div className="erp-chat__readers">
                <div className="erp-chat__readersGroup">
                  <strong>Đã xem · {read.length}</strong>
                  {read.length === 0 && <em>Chưa ai xem</em>}
                  {read.map((member) => (
                    <span key={member.EMPL_NO} className="erp-chat__readerItem">
                      <Avatar
                        src={chatAvatarUrl(member.EMPL_NO, member.EMPL_IMAGE)}
                        sx={{ width: 24, height: 24, fontSize: 11, bgcolor: "#64748b" }}
                      >
                        {initialsOf(member.FULL_NAME || member.EMPL_NO)}
                      </Avatar>
                      {member.FULL_NAME || member.EMPL_NO}
                    </span>
                  ))}
                </div>
                {notRead.length > 0 && (
                  <div className="erp-chat__readersGroup is-muted">
                    <strong>Chưa xem · {notRead.length}</strong>
                    {notRead.map((member) => (
                      <span key={member.EMPL_NO} className="erp-chat__readerItem">
                        <Avatar
                          src={chatAvatarUrl(member.EMPL_NO, member.EMPL_IMAGE)}
                          sx={{ width: 24, height: 24, fontSize: 11, bgcolor: "#cbd5e1" }}
                        >
                          {initialsOf(member.FULL_NAME || member.EMPL_NO)}
                        </Avatar>
                        {member.FULL_NAME || member.EMPL_NO}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setReadersOf(null)}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

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
