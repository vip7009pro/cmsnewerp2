import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChatConversationList from "./ChatConversationList";
import ChatConversationView from "./ChatConversationView";
import ChatGroupPanel from "./ChatGroupPanel";
import ChatNewChatDialog from "./ChatNewChatDialog";
import { chatService } from "../../api/services/chatService";
import { useChatController } from "../../hooks/useChatController";
import "./chat.scss";

interface ChatDockProps {
  isMobile?: boolean;
  /** Cho phép điều khiển từ bên ngoài (ví dụ menu overflow trên mobile). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export default function ChatDock({ isMobile = false, open, onOpenChange, showTrigger = true }: ChatDockProps) {
  const controller = useChatController();
  const [internalOpen, setInternalOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
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

  // Nạp dữ liệu đầy đủ ở lần mở đầu tiên (badge đã có sẵn từ chatSync).
  useEffect(() => {
    if (isOpen && !controller.bootstrapped && !controller.booting) {
      void controller.bootstrap();
    }
  }, [controller, isOpen]);

  // Deep-link từ thông báo đẩy: /?chat=<conversationId> ⇒ mở panel và vào đúng phòng.
  const deepLinkHandledRef = useRef(false);
  useEffect(() => {
    if (deepLinkHandledRef.current) return;
    const conversationId = Number(new URLSearchParams(window.location.search).get("chat"));
    if (!Number.isInteger(conversationId) || conversationId <= 0) return;

    deepLinkHandledRef.current = true;
    setOpen(true);

    const timer = window.setTimeout(() => {
      void controller.selectConversation(conversationId);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [controller, setOpen]);

  // Đóng cửa sổ thì đóng luôn pane thông tin nhóm đang mở.
  useEffect(() => {
    if (!isOpen) setShowInfo(false);
  }, [isOpen]);

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

  const panel = useMemo(
    () => (
      <div className={`erp-chat__panel${controller.activeConversation ? " has-active" : ""}`}>
        <ChatConversationList
          conversations={controller.conversations}
          activeId={controller.activeId}
          myEmplNo={controller.myEmplNo}
          typingUsers={controller.typingUsers}
          onlineUsers={controller.onlineUsers}
          onSelect={handleSelectConversation}
          onNewChat={() => setShowNewChat(true)}
          onShowRequests={() => setShowRequests(true)}
          requestCount={controller.requests.filter((r) => r.DIRECTION === "INCOMING").length}
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
            onBack={controller.clearActive}
            onOpenInfo={() => setShowInfo(true)}
            onLoadMore={() =>
              controller.activeId ? controller.loadMore(controller.activeId) : Promise.resolve()
            }
            onSend={(payload) => void controller.sendMessage(payload)}
            onRetry={(message) => void controller.retryMessage(message)}
            onDelete={(message) => {
              if (controller.activeId) {
                void controller.deleteMessage(controller.activeId, message.MESSAGE_ID);
              }
            }}
            onTyping={controller.notifyTyping}
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
            onLeave={handleLeave}
            onSearch={controller.searchEmployees}
          />
        )}
      </div>
    ),
    [
      controller,
      handleAddMembers,
      handleLeave,
      handleRemoveMember,
      handleRenameGroup,
      handleSelectConversation,
      handleSetRole,
      handleTransferOwner,
      isMobile,
      showInfo,
      typingNamesFor,
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
          <div className="erp-chat__mobileOverlay">
            <div className="erp-chat__mobileHead">
              <span>Tin nhắn nội bộ</span>
              <IconButton size="small" onClick={() => setOpen(false)} aria-label="Đóng chat">
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </div>
            <div className="erp-chat__mobileBody">{panel}</div>
          </div>
        )
      ) : (
        isOpen && (
          /* Cửa sổ neo góc phải-dưới kiểu Messenger: KHÔNG có backdrop, không tự đóng
             khi click ra ngoài — chỉ đóng bằng nút X hoặc bấm lại icon trên navbar. */
          <div className="erp-chat__window" role="dialog" aria-label="Chat nội bộ">
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
            <div className="erp-chat__windowBody">{panel}</div>
          </div>
        )
      )}

      <ChatNewChatDialog
        open={showNewChat}
        onClose={() => setShowNewChat(false)}
        onSearch={controller.searchEmployees}
        onStartDirect={controller.startDirect}
        onCreateGroup={controller.createGroup}
      />

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
