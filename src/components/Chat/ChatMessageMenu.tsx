import React from "react";
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import ForwardRoundedIcon from "@mui/icons-material/ForwardRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import type { ChatMessage, ChatReactionType } from "./chat.types";
import { REACTION_EMOJI, REACTION_ORDER, reactionLabel } from "./chatUtils";

export interface ChatMessageMenuState {
  message: ChatMessage;
  /** Toạ độ chuột (desktop) hoặc tâm màn hình (mobile long-press). */
  top: number;
  left: number;
}

interface Props {
  state: ChatMessageMenuState | null;
  myEmplNo: string;
  canRecall: boolean;
  onClose: () => void;
  onReply: (message: ChatMessage) => void;
  /** Thả cảm xúc — mỗi lần gọi là +1 (không giới hạn). */
  onReact: (message: ChatMessage, reaction: ChatReactionType) => void;
  /** Bỏ toàn bộ cảm xúc của mình trên tin nhắn. */
  onClearReaction: (message: ChatMessage) => void;
  onForward: (message: ChatMessage) => void;
  onCopy: (message: ChatMessage) => void;
  onHide: (message: ChatMessage) => void;
  onRecall: (message: ChatMessage) => void;
}

/**
 * Menu hành động cho 1 tin nhắn: mở bằng chuột phải (desktop) hoặc nhấn giữ (mobile).
 * Gồm thanh cảm xúc + trả lời + chuyển tiếp + sao chép + xoá 1 phía / thu hồi 2 phía.
 */
export default function ChatMessageMenu({
  state,
  myEmplNo,
  canRecall,
  onClose,
  onReply,
  onReact,
  onClearReaction,
  onForward,
  onCopy,
  onHide,
  onRecall,
}: Props) {
  const message = state?.message;
  const mine = message?.SENDER_EMPL_NO === myEmplNo;
  const deleted = Boolean(message?.DELETED_AT);
  const myReaction = message
    ? (Object.keys(message.REACTIONS || {}) as ChatReactionType[]).find((key) =>
        (message.REACTIONS?.[key]?.users || []).includes(myEmplNo)
      )
    : undefined;

  return (
    <Menu
      open={Boolean(state)}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={state ? { top: state.top, left: state.left } : undefined}
      slotProps={{ paper: { className: "erp-chat-menu__paper" } }}
      // Không cho hành động trên tin đã thu hồi (trừ xoá ở phía tôi).
      disableAutoFocusItem
    >
      {!deleted && message && (
        <div className="erp-chat-menu__reactions">
          {REACTION_ORDER.map((reaction) => {
            const count = message.REACTIONS?.[reaction]?.count || 0;
            const isMine = (message.REACTIONS?.[reaction]?.users || []).includes(myEmplNo);
            return (
              <button
                key={reaction}
                type="button"
                title={count > 0 ? `${reactionLabel(reaction)} · ${count}` : reactionLabel(reaction)}
                aria-label={reactionLabel(reaction)}
                className={isMine ? "is-active" : undefined}
                onClick={() => {
                  onReact(message, reaction);
                  onClose();
                }}
              >
                {REACTION_EMOJI[reaction]}
                {count > 0 && <em className="erp-chat-menu__rxCount">{count}</em>}
              </button>
            );
          })}
        </div>
      )}

      {!deleted && message && myReaction && (
        <MenuItem
          onClick={() => {
            onClearReaction(message);
            onClose();
          }}
        >
          <ListItemIcon>
            <DeleteSweepRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={`Bỏ cảm xúc ${REACTION_EMOJI[myReaction]} của tôi`}
            primaryTypographyProps={{ fontSize: 12.5 }}
          />
        </MenuItem>
      )}

      {!deleted && message && (
        <MenuItem
          onClick={() => {
            onReply(message);
            onClose();
          }}
        >
          <ListItemIcon>
            <ReplyRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Trả lời" primaryTypographyProps={{ fontSize: 12.5 }} />
        </MenuItem>
      )}

      {!deleted && message && (
        <MenuItem
          onClick={() => {
            onForward(message);
            onClose();
          }}
        >
          <ListItemIcon>
            <ForwardRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Chuyển tiếp" primaryTypographyProps={{ fontSize: 12.5 }} />
        </MenuItem>
      )}

      {!deleted && message && (
        <MenuItem
          onClick={() => {
            onCopy(message);
            onClose();
          }}
        >
          <ListItemIcon>
            <ContentCopyRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Sao chép tin nhắn" primaryTypographyProps={{ fontSize: 12.5 }} />
        </MenuItem>
      )}

      {message && (
        <>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            onClick={() => {
              onHide(message);
              onClose();
            }}
          >
            <ListItemIcon>
              <VisibilityOffRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Xoá ở phía tôi"
              secondary="Chỉ ẩn với bạn, người khác vẫn thấy"
              primaryTypographyProps={{ fontSize: 12.5 }}
              secondaryTypographyProps={{ fontSize: 10.5 }}
            />
          </MenuItem>
        </>
      )}

      {!deleted && message && (mine || canRecall) && (
        <MenuItem
          onClick={() => {
            onRecall(message);
            onClose();
          }}
          sx={{ color: "#e11d48" }}
        >
          <ListItemIcon>
            <UndoRoundedIcon fontSize="small" sx={{ color: "#e11d48" }} />
          </ListItemIcon>
          <ListItemText
            primary="Thu hồi với cả hai phía"
            secondary="Mọi người đều thấy tin đã thu hồi"
            primaryTypographyProps={{ fontSize: 12.5, fontWeight: 600 }}
            secondaryTypographyProps={{ fontSize: 10.5 }}
          />
        </MenuItem>
      )}
    </Menu>
  );
}
