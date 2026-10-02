import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import FullscreenExitRoundedIcon from "@mui/icons-material/FullscreenExitRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import NotificationsOffRoundedIcon from "@mui/icons-material/NotificationsOffRounded";
import ChatConversationList from "./ChatConversationList";
import ChatConversationView from "./ChatConversationView";
import ChatGroupPanel from "./ChatGroupPanel";
import ChatNewChatDialog from "./ChatNewChatDialog";
import ChatForwardDialog from "./ChatForwardDialog";
import ChatSearchPanel from "./ChatSearchPanel";
import ChatShareDialog from "./ChatShareDialog";
import {
  collectLaunchQueueFiles,
  readSharedPayload,
  SHARE_QUERY_FLAG,
  sharedFileToFile,
  sharedPayloadHasContent,
} from "./chatShareTarget";
import type { ChatMessage } from "./chat.types";
import { chatService } from "../../api/services/chatService";
import { formatMuteRemaining } from "./chatUtils";
import {
  isMuteUntilOpen,
  useChatController,
  type ChatMuteOption,
} from "../../hooks/useChatController";
import { useMobileBackClose } from "../NavMenu/useMobileBackClose";
import "./chat.scss";

interface ChatDockProps {
  isMobile?: boolean;
  /** Cho phép điều khiển từ bên ngoài (ví dụ menu overflow trên mobile). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

/** Các mốc thời gian tắt thông báo cho 1 phòng. */
const MUTE_OPTIONS: { label: string; value: ChatMuteOption }[] = [
  { label: "Trong 10 phút", value: 10 },
  { label: "Trong 1 giờ", value: 60 },
  { label: "Trong 4 giờ", value: 240 },
  { label: "Trong 1 ngày", value: 1440 },
  // Không hết hạn theo thời gian — chỉ bật lại khi người dùng TỰ bấm "Bật lại thông báo".
  { label: "Cho tới khi tôi bật lại", value: "untilOpen" },
];

export default function ChatDock({ isMobile = false, open, onOpenChange, showTrigger = true }: ChatDockProps) {
  const controller = useChatController();
  const [internalOpen, setInternalOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [forwardMessage, setForwardMessage] = useState<ChatMessage | null>(null);
  /** Nội dung nhận từ app khác (Zalo/Kakao/Gallery) qua Web Share Target. */
  const [share, setShare] = useState<{ title: string; text: string; files: File[] } | null>(null);
  const [shareBusy, setShareBusy] = useState(false);
  /** Cửa sổ chat đang chiếm toàn màn hình (desktop). */
  const [fullscreen, setFullscreen] = useState(false);
  /** Neo menu chọn thời gian "Tạm ngừng thông báo". */
  const [muteAnchor, setMuteAnchor] = useState<HTMLElement | null>(null);
  /**
   * Desktop: thu gọn cột danh sách cuộc trò chuyện để rộng chỗ cho khung tin nhắn.
   * Nhớ lựa chọn của người dùng giữa các lần mở.
   */
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem("chat_sidebar_collapsed") === "1";
    } catch {
      return false;
    }
  });
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("chat_sidebar_collapsed", next ? "1" : "0");
      } catch {
        /* localStorage bị chặn — chỉ mất tính năng nhớ trạng thái. */
      }
      return next;
    });
  }, []);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? Boolean(open) : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  /**
   * Mobile: nút Back (Android) / vuốt cạnh (iOS) đi theo TỪNG TẦNG.
   *  - Đang mở một hội thoại ⇒ về danh sách chat.
   *  - Đang ở danh sách ⇒ đóng chat, về home.
   *
   * Trước đây không chặn Back nên ở màn chat vuốt Back là THOÁT LUÔN app.
   * `rearm: true` vì UI có 2 tầng — nếu không đặt lại guard, lần Back thứ hai
   * vẫn thoát app thay vì xuống tầng tiếp theo.
   */
  useMobileBackClose(
    isMobile && isOpen,
    () => {
      if (controller.activeId) controller.clearActive();
      else setOpen(false);
    },
    { rearm: true }
  );

  // Nạp dữ liệu đầy đủ ở lần mở đầu tiên (badge đã có sẵn từ chatSync).
  useEffect(() => {
    if (isOpen && !controller.bootstrapped && !controller.booting) {
      void controller.bootstrap();
    }
  }, [controller, isOpen]);

  // Deep-link từ thông báo đẩy hoặc liên kết chia sẻ: /?chat=<conversationId> ⇒ mở panel và vào đúng phòng.
  const deepLinkHandledRef = useRef(false);
  /** Phòng cần mở ngay khi danh sách hội thoại sẵn sàng. */
  const pendingDeepLinkRef = useRef<number | null>(null);

  useEffect(() => {
    if (deepLinkHandledRef.current) return;
    const conversationId = Number(new URLSearchParams(window.location.search).get("chat"));
    if (!Number.isInteger(conversationId) || conversationId <= 0) return;

    deepLinkHandledRef.current = true;
    pendingDeepLinkRef.current = conversationId;
    setOpen(true);
  }, [setOpen]);

  // Chọn phòng của deep-link khi danh sách đã nạp xong.
  // KHÔNG dùng setTimeout: React StrictMode (dev) chạy effect 2 lần nên mọi timer
  // đặt trong effect đều bị cleanup của lần chạy đầu huỷ mất ⇒ deep-link không hoạt động.
  // Cách này idempotent: ref được xoá TRƯỚC khi gọi nên chạy lại cũng không chọn hai lần.
  useEffect(() => {
    const conversationId = pendingDeepLinkRef.current;
    if (!conversationId) return;
    if (!controller.conversations.some((item) => item.CONVERSATION_ID === conversationId)) return;

    pendingDeepLinkRef.current = null;
    void controller.selectConversation(conversationId);
  }, [controller]);

  // Đóng cửa sổ thì đóng luôn pane thông tin nhóm đang mở.
  useEffect(() => {
    if (!isOpen) setShowInfo(false);
  }, [isOpen]);

  // Đồng bộ trạng thái mở/đóng xuống controller để biết khi nào cần TỰ BẬT cửa sổ.
  useEffect(() => {
    controller.setDockOpen(isOpen);
  }, [controller, isOpen]);

  /**
   * Có tin mới ⇒ tự bật cửa sổ chat và vào đúng phòng.
   * `consumeAutoOpen()` được gọi TRƯỚC khi mở nên effect chạy lặp (do `controller`
   * đổi identity mỗi render) cũng không mở lại lần hai.
   */
  useEffect(() => {
    const request = controller.autoOpen;
    if (!request) return;
    controller.consumeAutoOpen();
    setOpen(true);
    if (controller.conversations.some((c) => c.CONVERSATION_ID === request.conversationId)) {
      void controller.selectConversation(request.conversationId);
    }
  }, [controller, setOpen]);

  // Nhịp 30 giây để nhãn "còn lại" của chế độ tắt thông báo tự cập nhật.
  const anyConversationMuted = controller.conversations.some((c) => c.MUTED);
  const [, setClockTick] = useState(0);
  useEffect(() => {
    if (!anyConversationMuted) return;
    const timer = window.setInterval(() => setClockTick((value) => value + 1), 30_000);
    return () => window.clearInterval(timer);
  }, [anyConversationMuted]);

  // Esc để thoát toàn màn hình.
  useEffect(() => {
    if (!fullscreen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fullscreen]);

  /**
   * Chuông tắt thông báo nay thuộc TỪNG PHÒNG và nằm trong header phòng
   * (ChatConversationView báo lên đây để mở menu, tránh phải truyền ReactNode xuống).
   */
  const activeMuteSeconds = controller.activeId
    ? controller.muteSecondsLeftOfConversation(controller.activeId)
    : null;
  const activeMuteUntilOpen = Boolean(
    activeMuteSeconds && isMuteUntilOpen(activeMuteSeconds)
  );
  const muteLabel = activeMuteSeconds ? formatMuteRemaining(activeMuteSeconds) : "";

  /** Nút bật/tắt toàn màn hình — chỉ có ý nghĩa ở cửa sổ desktop. */
  const fullscreenButton = (
    <Tooltip title={fullscreen ? "Thoát toàn màn hình" : "Xem toàn màn hình"}>
      <IconButton
        size="small"
        className="erp-chat__iconBtn"
        onClick={() => setFullscreen((value) => !value)}
        aria-label={fullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
      >
        {fullscreen ? (
          <FullscreenExitRoundedIcon fontSize="small" />
        ) : (
          <FullscreenRoundedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );

  /**
   * Nhận nội dung chia sẻ từ app khác.
   * - Web Share Target: SW lưu payload vào Cache rồi redirect về `/share-target`.
   * - `file_handlers`: tệp đến qua `launchQueue` (mở app bằng "Mở bằng...").
   */
  const shareCheckedRef = useRef(false);
  useEffect(() => {
    if (shareCheckedRef.current) return;
    shareCheckedRef.current = true;

    const collect = async () => {
      const payload = await readSharedPayload();
      const launchFiles = payload ? [] : await collectLaunchQueueFiles();
      const files = payload
        ? (payload.files.map(sharedFileToFile).filter(Boolean) as File[])
        : launchFiles;

      if (!payload && files.length === 0) return;
      if (payload && !sharedPayloadHasContent(payload) && files.length === 0) return;

      setShare({ title: payload?.title || "", text: payload?.text || "", files });
      setOpen(true);

      // Dọn cờ `?shared=1` trên URL để F5 không kích hoạt lại luồng chia sẻ.
      const params = new URLSearchParams(window.location.search);
      if (params.has(SHARE_QUERY_FLAG)) {
        window.history.replaceState({}, "", window.location.pathname);
      }
    };

    void collect();
  }, [setOpen]);

  /** Gửi nội dung chia sẻ vào phòng đã chọn. */
  const handleShareSend = useCallback(
    async (conversationId: number, content: string, files: File[]) => {
      setShareBusy(true);
      try {
        await controller.selectConversation(conversationId);
        await controller.sendMessage({ conversationId, content, files });
      } finally {
        setShareBusy(false);
      }
    },
    [controller]
  );

  const typingNamesFor = useCallback(
    (conversationId: number) => Object.values(controller.typingUsers[conversationId] || {}),
    [controller.typingUsers]
  );

  const handleSelectConversation = useCallback(
    (conversationId: number) => {
      setShowInfo(false);
      void controller.selectConversation(conversationId);
    },
    [controller]
  );

  const handleAddMembers = useCallback(
    async (memberEmplNos: string[]) => {
      if (!controller.activeId) return;
      await chatService.addMembers(controller.activeId, memberEmplNos);
      await controller.refreshConversation();
    },
    [controller]
  );

  const handleRemoveMember = useCallback(
    async (emplNo: string) => {
      if (!controller.activeId) return;
      await chatService.removeMember(controller.activeId, emplNo);
      await controller.refreshConversation();
    },
    [controller]
  );

  const handleSetRole = useCallback(
    async (emplNo: string, role: "MODERATOR" | "MEMBER") => {
      if (!controller.activeId) return;
      await chatService.setRole(controller.activeId, emplNo, role);
      await controller.refreshConversation();
    },
    [controller]
  );

  const handleTransferOwner = useCallback(
    async (emplNo: string) => {
      if (!controller.activeId) return;
      await chatService.transferOwner(controller.activeId, emplNo);
      await controller.refreshConversation();
    },
    [controller]
  );

  const handleRenameGroup = useCallback(
    async (title: string) => {
      if (!controller.activeId) return;
      await chatService.updateGroup(controller.activeId, { title });
      await controller.refreshConversation();
    },
    [controller]
  );

  const handleLeave = useCallback(async () => {
    if (!controller.activeId) return;
    await chatService.leaveGroup(controller.activeId);
    await controller.refreshConversation();
    setShowInfo(false);
  }, [controller]);

  /** Đổi avatar phòng nhóm: chuỗi rỗng là bỏ avatar. */
  const handleChangeAvatar = useCallback(
    async (avatar: string) => {
      if (!controller.activeId) return;
      await chatService.updateGroup(controller.activeId, { avatar });
      await controller.refreshConversation();
    },
    [controller]
  );

  /** Bấm 1 kết quả tìm kiếm: đóng bảng tìm kiếm rồi nhảy tới tin nhắn trong phòng tương ứng. */
  const handleJumpToMessage = useCallback(
    (conversationId: number, messageId: number) => {
      setShowGlobalSearch(false);
      setShowInfo(false);
      void controller.jumpToMessage(conversationId, messageId);
    },
    [controller]
  );

  const panel = useMemo(
    () => (
      <div
        className={`erp-chat__panel${controller.activeConversation ? " has-active" : ""}${
          !isMobile && sidebarCollapsed ? " is-sidebar-collapsed" : ""
        }`}
      >
        <ChatConversationList
          conversations={controller.conversations}
          activeId={controller.activeId}
          myEmplNo={controller.myEmplNo}
          typingUsers={controller.typingUsers}
          onlineUsers={controller.onlineUsers}
          onSelect={handleSelectConversation}
          onNewChat={() => setShowNewChat(true)}
          onShowRequests={() => setShowRequests(true)}
          onGlobalSearch={() => setShowGlobalSearch(true)}
          requestCount={controller.requests.filter((r) => r.DIRECTION === "INCOMING").length}
          onTogglePin={(conversationId, pinned) => {
            void controller.togglePin(conversationId, pinned);
          }}
          onDeleteConversation={(conversationId) => {
            void controller.deleteConversation(conversationId);
          }}
          /* Mobile: nút đóng danh sách chat để về màn hình chính. */
          onCloseMobile={isMobile ? () => setOpen(false) : undefined}
        />

        {controller.activeConversation ? (
          <ChatConversationView
            conversation={controller.activeConversation}
            messages={controller.activeMessages}
            myEmplNo={controller.myEmplNo}
            typingNames={typingNamesFor(controller.activeConversation.CONVERSATION_ID)}
            onlineUsers={controller.onlineUsers}
            pendingUploads={controller.pendingUploads}
            loading={controller.loadingMessages}
            loadingMore={controller.loadingMore}
            hasMore={Boolean(controller.hasMore[controller.activeConversation.CONVERSATION_ID])}
            isMobile={isMobile}
            replyTarget={controller.replyTarget}
            reactionBurst={controller.reactionBurst}
            draftText={
              controller.draft?.conversationId === controller.activeConversation.CONVERSATION_ID
                ? controller.draft.text
                : null
            }
            onBack={controller.clearActive}
            onOpenInfo={() => setShowInfo(true)}
            onOpenMuteMenu={(anchor) => setMuteAnchor(anchor)}
            muteSecondsLeft={activeMuteSeconds}
            muteUntilOpen={activeMuteUntilOpen}
            pins={controller.pins[controller.activeConversation.CONVERSATION_ID] || []}
            readState={controller.readState[controller.activeConversation.CONVERSATION_ID] || {}}
            onTogglePin={(message, pinned) =>
              void controller.setMessagePinned(
                controller.activeConversation!.CONVERSATION_ID,
                message.MESSAGE_ID,
                pinned
              )
            }
            /* Mobile: nút đóng cửa sổ nằm trong header phòng (bỏ header "Tin nhắn nội bộ"). */
            onCloseWindow={isMobile ? () => setOpen(false) : null}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={toggleSidebar}
            onLoadMore={() =>
              controller.activeId ? controller.loadMore(controller.activeId) : Promise.resolve()
            }
            onSend={(payload) => void controller.sendMessage(payload)}
            onRetry={(message) => void controller.retryMessage(message)}
            onReply={(message) => controller.startReply(message)}
            onClearReply={controller.clearReply}
            onAddReaction={(message, reaction) =>
              void controller.addReaction(message.CONVERSATION_ID, message.MESSAGE_ID, reaction)
            }
            onClearReaction={(message) =>
              void controller.clearReaction(message.CONVERSATION_ID, message.MESSAGE_ID)
            }
            onForward={(message) => setForwardMessage(message)}
            onHide={(message) =>
              void controller.hideMessage(message.CONVERSATION_ID, message.MESSAGE_ID)
            }
            onRecall={(message) =>
              void controller.deleteMessage(message.CONVERSATION_ID, message.MESSAGE_ID)
            }
            onDeleteMessages={(messageIds, mode) =>
              controller.deleteMessages(
                controller.activeConversation!.CONVERSATION_ID,
                messageIds,
                mode
              )
            }
            onMentionClick={(emplNo, name, preview) =>
              void controller.openPrivateChatWithQuote({
                emplNo,
                name,
                preview: preview.length > 120 ? `${preview.slice(0, 120)}…` : preview,
              })
            }
            onConsumeDraft={controller.consumeDraft}
            onTyping={controller.notifyTyping}
            focusMessage={controller.focusMessage}
            onJumpToMessage={handleJumpToMessage}
          />
        ) : (
          <div className="erp-chat__main erp-chat__main--empty">
            <ChatBubbleRoundedIcon sx={{ fontSize: 44, color: "#cbd5e1" }} />
            <span>Chọn một cuộc trò chuyện để bắt đầu</span>
            <small>Hoặc bấm dấu + để tìm đồng nghiệp và tạo nhóm</small>
          </div>
        )}

        {showInfo && controller.activeConversation && (
          <ChatGroupPanel
            conversation={controller.activeConversation}
            myEmplNo={controller.myEmplNo}
            onlineUsers={controller.onlineUsers}
            onClose={() => setShowInfo(false)}
            onAddMembers={handleAddMembers}
            onRemoveMember={handleRemoveMember}
            onSetRole={handleSetRole}
            onTransferOwner={handleTransferOwner}
            onRenameGroup={handleRenameGroup}
            onChangeAvatar={handleChangeAvatar}
            onLeave={handleLeave}
            onSearch={controller.searchEmployees}
          />
        )}
      </div>
    ),
    [
      controller,
      handleAddMembers,
      handleChangeAvatar,
      handleLeave,
      handleRemoveMember,
      handleRenameGroup,
      handleSelectConversation,
      handleSetRole,
      handleTransferOwner,
      isMobile,
      showInfo,
      typingNamesFor,
      handleJumpToMessage,
      sidebarCollapsed,
      toggleSidebar,
    ]
  );

  return (
    <>
      {showTrigger && (
        <button
          ref={triggerRef}
          type="button"
          className={`precision-header__actionBtn${isOpen ? " is-active" : ""}`}
          onClick={() => setOpen(!isOpen)}
          title="Tin nhắn nội bộ"
          aria-label="Mở chat nội bộ"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 19 }}>
            chat_bubble
          </span>
          {controller.unreadTotal > 0 && (
            <span className="precision-header__badge">
              {controller.unreadTotal > 99 ? "99+" : controller.unreadTotal}
            </span>
          )}
        </button>
      )}

      {isMobile ? (
        isOpen && (
          /* Mobile: KHÔNG có header "Tin nhắn nội bộ" — chuông tắt thông báo và nút đóng
             nằm trong header của phòng (xem ChatConversationView). */
          <div className="erp-chat__mobileOverlay">
            <div className="erp-chat__mobileBody">{panel}</div>
          </div>
        )
      ) : (
        isOpen && (
          /* Cửa sổ neo góc phải-dưới kiểu Messenger: KHÔNG có backdrop, không tự đóng
             khi click ra ngoài — chỉ đóng bằng nút X hoặc bấm lại icon trên navbar. */
          <div
            className={`erp-chat__window${fullscreen ? " is-fullscreen" : ""}`}
            role="dialog"
            aria-label="Chat nội bộ"
          >
            <div className="erp-chat__windowHead">
              <span className="erp-chat__windowTitle">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  chat_bubble
                </span>
                Tin nhắn nội bộ
                {controller.unreadTotal > 0 && (
                  <span className="erp-chat__windowCount">{controller.unreadTotal}</span>
                )}
              </span>
              <div className="erp-chat__windowActions">
                {fullscreenButton}
                <IconButton
                  size="small"
                  className="erp-chat__iconBtn"
                  onClick={() => setOpen(false)}
                  aria-label="Đóng cửa sổ chat"
                  title="Đóng cửa sổ chat"
                >
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
            <div className="erp-chat__windowBody">{panel}</div>
          </div>
        )
      )}

      {/* Menu tắt thông báo cho ĐÚNG phòng đang mở (nút chuông nằm ở header phòng). */}
      <Menu
        anchorEl={muteAnchor}
        open={Boolean(muteAnchor)}
        onClose={() => setMuteAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem disabled sx={{ fontSize: 12, opacity: "1 !important", fontWeight: 700 }}>
          Tắt thông báo phòng này
        </MenuItem>
        {MUTE_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            sx={{ fontSize: 13 }}
            onClick={() => {
              const conversationId = controller.activeId;
              setMuteAnchor(null);
              if (conversationId) void controller.setConversationMute(conversationId, option.value);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
        {activeMuteSeconds && (
          <MenuItem
            sx={{ fontSize: 13, color: "#dc2626" }}
            onClick={() => {
              const conversationId = controller.activeId;
              setMuteAnchor(null);
              if (conversationId) void controller.setConversationMute(conversationId, null);
            }}
          >
            Bật lại thông báo
          </MenuItem>
        )}
        {activeMuteSeconds && (
          <MenuItem disabled sx={{ fontSize: 11, opacity: "1 !important", color: "#64748b" }}>
            {activeMuteUntilOpen
              ? "Đang tắt cho tới khi bạn tự bật lại"
              : `Còn ${muteLabel} · tin mới sẽ không tự bật cửa sổ`}
          </MenuItem>
        )}
      </Menu>

      <ChatForwardDialog
        open={Boolean(forwardMessage)}
        conversations={controller.conversations}
        excludeConversationId={controller.activeId}
        onClose={() => setForwardMessage(null)}
        onSubmit={(targets) => {
          if (!forwardMessage) return;
          const source = forwardMessage;
          setForwardMessage(null);
          void controller.forwardMessage(source.CONVERSATION_ID, source.MESSAGE_ID, targets);
        }}
      />

      <ChatShareDialog
        open={Boolean(share)}
        title={share?.title}
        text={share?.text}
        files={share?.files || []}
        conversations={controller.conversations}
        busy={shareBusy}
        onClose={() => setShare(null)}
        onSend={handleShareSend}
      />

      <ChatNewChatDialog
        open={showNewChat}
        onClose={() => setShowNewChat(false)}
        onSearch={controller.searchEmployees}
        onStartDirect={controller.startDirect}
        onCreateGroup={controller.createGroup}
        // "Chọn tất cả" + lọc theo phòng ban — nay MỞ cho mọi tài khoản.
        canSelectAll
        onLoadAll={() => controller.searchEmployees("", { all: true })}
      />
      <Dialog
        open={showGlobalSearch}
        onClose={() => setShowGlobalSearch(false)}
        maxWidth="md"
        fullWidth
        className="erp-chat__globalSearchDialog"
      >
        <DialogTitle sx={{ fontSize: 15, fontWeight: 700, pb: 1 }}>
          Tìm kiếm toàn bộ tin nhắn &amp; tệp
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <ChatSearchPanel
            myEmplNo={controller.myEmplNo}
            onClose={() => setShowGlobalSearch(false)}
            onOpenResult={handleJumpToMessage}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showRequests} onClose={() => setShowRequests(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: 15, fontWeight: 700 }}>Lời mời kết bạn</DialogTitle>
        <DialogContent dividers>
          {controller.requests.length === 0 && (
            <div className="erp-chat__empty">
              <span>Không có lời mời nào</span>
            </div>
          )}
          {controller.requests.map((request) => (
            <div key={request.FRIEND_ID} className="erp-chat__requestRow">
              <span className="erp-chat__requestName">
                {request.FULL_NAME || request.PARTNER}
                <small>{request.DIRECTION === "INCOMING" ? "Gửi tới bạn" : "Bạn đã gửi"}</small>
              </span>
              {request.DIRECTION === "INCOMING" ? (
                <span className="erp-chat__requestActions">
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => void controller.respondFriendRequest(request.FRIEND_ID, "accept")}
                  >
                    Đồng ý
                  </Button>
                  <Button
                    size="small"
                    onClick={() => void controller.respondFriendRequest(request.FRIEND_ID, "reject")}
                  >
                    Từ chối
                  </Button>
                </span>
              ) : (
                <Button
                  size="small"
                  onClick={() => void chatService.friendCancel(request.FRIEND_ID).then(() => controller.refreshConversation())}
                >
                  Huỷ
                </Button>
              )}
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setShowRequests(false)}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
