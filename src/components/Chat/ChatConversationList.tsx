import React, { useMemo, useState } from "react";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupsRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import FolderSpecialRoundedIcon from "@mui/icons-material/FolderSpecialRounded";
import type { ChatConversation } from "./chat.types";
import { chatAvatarUrl, initialsOf, shortTime } from "./chatUtils";

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
}: Props) {
  const [keyword, setKeyword] = useState("");

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

          return (
            <button
              key={conversation.CONVERSATION_ID}
              type="button"
              className={`erp-chat__convItem${
                activeId === conversation.CONVERSATION_ID ? " is-active" : ""
              }`}
              onClick={() => onSelect(conversation.CONVERSATION_ID)}
            >
              <div className="erp-chat__convAvatar">
                <Avatar
                  src={conversation.DISPLAY_AVATAR || undefined}
                  sx={{ width: 44, height: 44, fontSize: 15, bgcolor: isSelf ? "#0f766e" : "#2563eb" }}
                >
                  {isSelf ? (
                    <FolderSpecialRoundedIcon fontSize="small" />
                  ) : isDirect ? (
                    initialsOf(conversation.DISPLAY_NAME)
                  ) : (
                    <GroupRoundedIcon fontSize="small" />
                  )}
                </Avatar>
                {peerOnline && <span className="erp-chat__onlineDot" />}
              </div>

              <div className="erp-chat__convBody">
                <div className="erp-chat__convTop">
                  <span className="erp-chat__convName">{conversation.DISPLAY_NAME}</span>
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
    </div>
  );
}
