import React, { useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import type { ChatConversation } from "./chat.types";
import ChatRoomAvatar from "./chatAvatars";

interface Props {
  open: boolean;
  conversations: ChatConversation[];
  excludeConversationId?: number | null;
  sending?: boolean;
  onClose: () => void;
  onSubmit: (targetConversationIds: number[]) => void;
}

/** Dialog chọn nơi để chuyển tiếp tin nhắn (giống Zalo). */
export default function ChatForwardDialog({
  open,
  conversations,
  excludeConversationId,
  sending = false,
  onClose,
  onSubmit,
}: Props) {
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const options = useMemo(() => {
    const key = keyword.trim().toLowerCase();
    return conversations
      .filter((conversation) => conversation.CONVERSATION_ID !== excludeConversationId)
      .filter((conversation) => !key || conversation.DISPLAY_NAME.toLowerCase().includes(key));
  }, [conversations, excludeConversationId, keyword]);

  const toggle = (conversationId: number) => {
    setSelected((prev) =>
      prev.includes(conversationId) ? prev.filter((id) => id !== conversationId) : [...prev, conversationId]
    );
  };

  const handleClose = () => {
    setKeyword("");
    setSelected([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: 15, fontWeight: 700, pb: 1 }}>
        Chuyển tiếp tin nhắn
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
          aria-label="Đóng"
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 1.5 }}>
        <div className="erp-chat__searchBox erp-chat__searchBox--dialog">
          <SearchRoundedIcon fontSize="small" />
          <input
            autoFocus
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm cuộc trò chuyện để chuyển tiếp"
          />
        </div>

        <div className="erp-chat-forward__list">
          {options.length === 0 && <div className="erp-chat-dialog__empty">Không có cuộc trò chuyện phù hợp</div>}

          {options.map((conversation) => (
            <label key={conversation.CONVERSATION_ID} className="erp-chat-forward__row">
              <Checkbox
                size="small"
                checked={selected.includes(conversation.CONVERSATION_ID)}
                onChange={() => toggle(conversation.CONVERSATION_ID)}
              />
              <ChatRoomAvatar
                value={conversation.DISPLAY_AVATAR}
                name={conversation.DISPLAY_NAME}
                size={30}
                isDirect={conversation.CONV_TYPE === "DIRECT"}
              />
              <span className="erp-chat-forward__name">
                {conversation.DISPLAY_NAME}
                <small>
                  {conversation.CONV_TYPE === "GROUP"
                    ? `${conversation.MEMBERS.length} thành viên`
                    : "Hội thoại 1-1"}
                </small>
              </span>
            </label>
          ))}
        </div>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5 }}>
        <Button size="small" onClick={handleClose}>
          Huỷ
        </Button>
        <Button
          size="small"
          variant="contained"
          disabled={selected.length === 0 || sending}
          onClick={() => {
            onSubmit(selected);
            setSelected([]);
            setKeyword("");
          }}
        >
          Gửi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
