import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupsRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import FolderSpecialRoundedIcon from "@mui/icons-material/FolderSpecialRounded";
import type { ChatConversation } from "./chat.types";
import { chatAvatarUrl, initialsOf, shortTime } from "./chatUtils";
import ChatRoomAvatar from "./chatAvatars";

interface Props {
  conversations: ChatConversation[];
  activeId: number | null;
  myEmplNo: string;
  typingUsers: Record<number, Record<string, string>>;
  onlineUsers: Set<string>;
  onSelect: (conversationId: number) => void;
  onNewChat: () => void;
  onShowRequests: () => void;
  /** Mở tìm kiếm toàn cục (mọi phòng). */
  onGlobalSearch: () => void;
  requestCount: number;
  /** Ghim / bỏ ghim cuộc trò chuyện — tuỳ chọn của RIÊNG tôi. */
  onTogglePin: (conversationId: number, pinned: boolean) => void;
}

/**
 * Icon ghim dạng SVG nội tuyến.
 * Bộ `@mui/icons-material` đang dùng KHÔNG có `PushPin` nên không thể import như các icon khác.
 */
function PinIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" />
    </svg>
  );
}

function previewText(conversation: ChatConversation): string {
  const last = conversation.LAST_MESSAGE;
  if (!last) return "Chưa có tin nhắn";
  const prefix = last.SENDER_EMPL_NO === "SYSTEM" ? "" : "";
  if (last.DELETED_AT) return `${prefix}Tin nhắn đã được thu hồi`;
  if (last.MSG_TYPE === "IMAGE") return `${prefix}[Hình ảnh]`;
  if (last.MSG_TYPE === "FILE") return `${prefix}[Tệp đính kèm]`;
  return `${prefix}${last.CONTENT || ""}`;
}

export default function ChatConversationList({
  conversations,
  activeId,
  myEmplNo,
  typingUsers,
  onlineUsers,
  onSelect,
  onNewChat,
  onShowRequests,
  onGlobalSearch,
  requestCount,
  onTogglePin,
}: Props) {
  const [keyword, setKeyword] = useState("");
  /** Menu ngữ cảnh (chuột phải / nhấn giữ) — toạ độ tính theo viewport. */
  const [menu, setMenu] = useState<{ conversationId: number; x: number; y: number } | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const longPressFired = useRef(false);

  const closeMenu = useCallback(() => setMenu(null), []);

  const openMenu = useCallback((conversationId: number, x: number, y: number) => {
    // Giữ menu trong khung nhìn (menu rộng ~230px, cao ~50px).
    const left = Math.max(8, Math.min(x, window.innerWidth - 240));
    const top = Math.max(8, Math.min(y, window.innerHeight - 60));
    setMenu({ conversationId, x: left, y: top });
  }, []);

  useEffect(() => {
    if (!menu) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", closeMenu);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", closeMenu);
    };
  }, [menu, closeMenu]);

  /** Nhấn giữ 450ms trên mobile ⇒ mở menu (thay cho chuột phải). */
  const startLongPress = (conversationId: number, event: React.TouchEvent<HTMLButtonElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    const { clientX, clientY } = touch;
    longPressFired.current = false;
    longPressTimer.current = window.setTimeout(() => {
      longPressFired.current = true;
      openMenu(conversationId, clientX, clientY);
    }, 450);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const menuTarget = useMemo(
    () =>
      menu
        ? conversations.find((c) => c.CONVERSATION_ID === menu.conversationId) || null
        : null,
    [menu, conversations]
  );

  const filtered = useMemo(() => {
    const key = keyword.trim().toLowerCase();
    if (!key) return conversations;
    return conversations.filter((c) => {
      if (c.DISPLAY_NAME.toLowerCase().includes(key)) return true;
      return c.MEMBERS.some((m) => (m.FULL_NAME || "").toLowerCase().includes(key));
    });
  }, [conversations, keyword]);

  return (
    <div className="erp-chat__sidebar">
      <div className="erp-chat__sidebarHead">
        <div className="erp-chat__searchBox">
          <SearchRoundedIcon fontSize="small" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm cuộc trò chuyện"
            aria-label="Tìm cuộc trò chuyện"
          />
        </div>
        <Tooltip title="Tìm kiếm trong toàn bộ tin nhắn">
          <IconButton
            size="small"
            className="erp-chat__iconBtn"
            onClick={onGlobalSearch}
            aria-label="Tìm kiếm toàn cục"
          >
            <SearchRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cuộc trò chuyện mới">
          <IconButton size="small" className="erp-chat__iconBtn" onClick={onNewChat}>
            <AddRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

      {requestCount > 0 && (
        <button type="button" className="erp-chat__requestBar" onClick={onShowRequests}>
          <span className="erp-chat__requestDot" />
          {requestCount} lời mời kết bạn đang chờ
        </button>
      )}

      <div className="erp-chat__convList">
        {filtered.length === 0 && (
          <div className="erp-chat__empty">
            <GroupRoundedIcon />
            <span>Chưa có cuộc trò chuyện</span>
            <small>Bấm dấu + để bắt đầu chat với đồng nghiệp</small>
          </div>
        )}

        {filtered.map((conversation) => {
          const typing = Object.keys(typingUsers[conversation.CONVERSATION_ID] || {});
          const isDirect = conversation.CONV_TYPE === "DIRECT";
          const isSelf = conversation.CONV_TYPE === "SELF";
          const peerOnline = isDirect && conversation.PEER_EMPL_NO
            ? onlineUsers.has(conversation.PEER_EMPL_NO)
            : false;
          const last = conversation.LAST_MESSAGE;
          const mineLast = last?.SENDER_EMPL_NO === myEmplNo;
          const isPinned = Boolean(conversation.PINNED_AT);

          return (
            <button
              key={conversation.CONVERSATION_ID}
              type="button"
              className={`erp-chat__convItem${
                activeId === conversation.CONVERSATION_ID ? " is-active" : ""
              }${isPinned ? " is-pinned" : ""}`}
              onClick={() => {
                // Nhấn giữ vừa mở menu ⇒ bỏ qua click để không vừa ghim vừa mở phòng.
                if (longPressFired.current) {
                  longPressFired.current = false;
                  return;
                }
                onSelect(conversation.CONVERSATION_ID);
              }}
              onContextMenu={(event) => {
                event.preventDefault();
                openMenu(conversation.CONVERSATION_ID, event.clientX, event.clientY);
              }}
              onTouchStart={(event) => startLongPress(conversation.CONVERSATION_ID, event)}
              onTouchEnd={cancelLongPress}
              onTouchMove={cancelLongPress}
            >
              <div className="erp-chat__convAvatar">
                <ChatRoomAvatar
                  value={conversation.DISPLAY_AVATAR}
                  name={conversation.DISPLAY_NAME}
                  size={44}
                  isDirect={isDirect}
                />
                {peerOnline && <span className="erp-chat__onlineDot" />}
              </div>

              <div className="erp-chat__convBody">
                <div className="erp-chat__convTop">
                  <span className="erp-chat__convName">
                    {isPinned && <PinIcon className="erp-chat__convPin" size={13} />}
                    <span className="erp-chat__convNameText">{conversation.DISPLAY_NAME}</span>
                  </span>
                  <span className="erp-chat__convTime">{shortTime(last?.CREATED_AT)}</span>
                </div>
                <div className="erp-chat__convBottom">
                  <span className="erp-chat__convPreview">
                    {typing.length > 0 ? (
                      <em className="erp-chat__typingInline">
                        {typing[0]} đang nhập...
                      </em>
                    ) : (
                      <>
                        {mineLast && <DoneAllRoundedIcon sx={{ fontSize: 14, mr: 0.5 }} />}
                        {previewText(conversation)}
                      </>
                    )}
                  </span>
                  {conversation.UNREAD_COUNT > 0 && (
                    <span className="erp-chat__unread">{conversation.UNREAD_COUNT}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Menu ngữ cảnh: chuột phải (desktop) hoặc nhấn giữ 450ms (mobile). */}
      {menu && menuTarget && (
        <>
          <div
            className="erp-chat__convMenuBackdrop"
            onClick={closeMenu}
            onContextMenu={(event) => {
              event.preventDefault();
              closeMenu();
            }}
          />
          <div
            className="erp-chat__convMenu"
            style={{ left: menu.x, top: menu.y }}
            role="menu"
            aria-label="Tuỳ chọn cuộc trò chuyện"
          >
            <button
              type="button"
              role="menuitem"
              className="erp-chat__convMenuItem"
              onClick={() => {
                onTogglePin(menu.conversationId, !menuTarget.PINNED_AT);
                closeMenu();
              }}
            >
              <PinIcon size={15} />
              <span>{menuTarget.PINNED_AT ? "Bỏ ghim cuộc trò chuyện" : "Ghim cuộc trò chuyện"}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
