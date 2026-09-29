import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import type { ChatConversation } from "./chat.types";
import ChatRoomAvatar from "./chatAvatars";
import { FILE_KIND_COLOR, FileKindIcon, fileKindOf, formatFileSize } from "./chatUtils";

interface Props {
  open: boolean;
  /** Tiêu đề/nội dung nhận từ app chia sẻ. */
  title?: string;
  text?: string;
  files: File[];
  conversations: ChatConversation[];
  busy?: boolean;
  onClose: () => void;
  onSend: (conversationId: number, content: string, files: File[]) => Promise<void>;
}

/**
 * Hộp nhận nội dung chia sẻ từ ứng dụng khác (Zalo, Kakao, Thư viện ảnh...):
 * xem trước nội dung/tệp rồi chọn phòng chat để gửi vào.
 */
export default function ChatShareDialog({
  open,
  title,
  text,
  files,
  conversations,
  busy = false,
  onClose,
  onSend,
}: Props) {
  const [keyword, setKeyword] = useState("");
  const [content, setContent] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setContent(String(text || "").trim());
    setKeyword("");
    setSelectedId(null);
    setError(null);
  }, [open, text, files]);

  /** Ảnh xem trước — thu hồi URL khi đóng để không rò rỉ bộ nhớ. */
  const previews = useMemo(() => {
    const map = new Map<File, string>();
    files.forEach((file) => {
      if (file.type.startsWith("image/")) map.set(file, URL.createObjectURL(file));
    });
    return map;
  }, [files]);

  useEffect(
    () => () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    },
    [previews]
  );

  const filtered = useMemo(() => {
    const key = keyword.trim().toLowerCase();
    if (!key) return conversations;
    return conversations.filter(
      (conversation) =>
        conversation.DISPLAY_NAME.toLowerCase().includes(key) ||
        conversation.MEMBERS.some((member) =>
          (member.FULL_NAME || "").toLowerCase().includes(key)
        )
    );
  }, [conversations, keyword]);

  const handleSend = async () => {
    if (!selectedId) {
      setError("Chọn một cuộc trò chuyện để gửi");
      return;
    }
    if (!content.trim() && files.length === 0) {
      setError("Không có nội dung để gửi");
      return;
    }
    setError(null);
    try {
      await onSend(selectedId, content, files);
      onClose();
    } catch (sendError: any) {
      setError(sendError?.message || "Không gửi được nội dung chia sẻ");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth className="erp-chat__shareDialog">
      <DialogTitle sx={{ fontSize: 15, fontWeight: 700, pb: 1 }}>
        Chia sẻ vào chat nội bộ
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
          aria-label="Đóng"
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {title && <div className="erp-chat__shareTitle">{title}</div>}

        {files.length > 0 && (
          <div className="erp-chat__shareFiles">
            {files.map((file, index) => {
              const kind = fileKindOf(file.name, file.type);
              const color = FILE_KIND_COLOR[kind];
              const preview = previews.get(file);
              return (
                <span key={`${file.name}-${index}`} className="erp-chat__shareFile">
                  {preview ? (
                    <img src={preview} alt={file.name} />
                  ) : (
                    <i style={{ background: color.bg, color: color.fg }}>
                      <FileKindIcon kind={kind} />
                    </i>
                  )}
                  <span className="erp-chat__shareFileMeta">
                    <strong>{file.name}</strong>
                    <small>{formatFileSize(file.size)}</small>
                  </span>
                  {!preview && <InsertDriveFileRoundedIcon sx={{ fontSize: 15 }} />}
                </span>
              );
            })}
          </div>
        )}

        <TextField
          multiline
          minRows={2}
          maxRows={6}
          size="small"
          fullWidth
          label="Nội dung gửi kèm"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          sx={{ mt: 1 }}
        />

        <div className="erp-chat__searchBox erp-chat__searchBox--dialog">
          <SearchRoundedIcon fontSize="small" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm cuộc trò chuyện để gửi vào"
          />
        </div>

        <div className="erp-chat__shareList">
          {filtered.length === 0 && (
            <div className="erp-chat-dialog__empty">Không tìm thấy cuộc trò chuyện phù hợp</div>
          )}

          {filtered.map((conversation) => (
            <button
              key={conversation.CONVERSATION_ID}
              type="button"
              className={`erp-chat__shareItem${
                selectedId === conversation.CONVERSATION_ID ? " is-active" : ""
              }`}
              onClick={() => setSelectedId(conversation.CONVERSATION_ID)}
            >
              <ChatRoomAvatar
                value={conversation.DISPLAY_AVATAR}
                name={conversation.DISPLAY_NAME}
                size={34}
                isDirect={conversation.CONV_TYPE === "DIRECT"}
              />
              <span className="erp-chat__shareItemName">
                {conversation.DISPLAY_NAME}
                <small>
                  {conversation.CONV_TYPE === "GROUP"
                    ? `${conversation.MEMBERS.length} thành viên`
                    : conversation.CONV_TYPE === "SELF"
                      ? "Cloud cá nhân"
                      : "Trò chuyện riêng"}
                </small>
              </span>
            </button>
          ))}
        </div>

        {error && <div className="erp-chat-dialog__error">{error}</div>}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button size="small" onClick={onClose} disabled={busy}>
          Huỷ
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={() => void handleSend()}
          disabled={busy || !selectedId}
        >
          {busy ? <CircularProgress size={16} color="inherit" /> : "Gửi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
