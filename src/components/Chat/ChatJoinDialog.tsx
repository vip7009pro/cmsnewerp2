import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { chatService, ChatInviteInfo } from "../../api/services/chatService";
import type { ChatConversation } from "./chat.types";
import ChatRoomAvatar from "./chatAvatars";

interface Props {
  open: boolean;
  conversationId: number | null;
  onClose: () => void;
  onJoined: (conversation: ChatConversation) => void;
}

export default function ChatJoinDialog({
  open,
  conversationId,
  onClose,
  onJoined,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<ChatInviteInfo | null>(null);

  useEffect(() => {
    if (!open || !conversationId) {
      setInfo(null);
      setError(null);
      setLoading(false);
      setJoining(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    chatService
      .getInviteInfo(conversationId)
      .then((data) => {
        if (!cancelled) setInfo(data);
      })
      .catch((err: any) => {
        if (!cancelled) {
          setError(err?.message || "Không tìm thấy phòng chat hoặc liên kết không hợp lệ");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, conversationId]);

  const handleConfirmJoin = async () => {
    if (!conversationId) return;
    setJoining(true);
    setError(null);
    try {
      const conv = await chatService.joinViaLink(conversationId);
      onJoined(conv);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Không thể gia nhập phòng chat");
    } finally {
      setJoining(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={joining ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      className="erp-chat-dialog"
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontSize: 16, fontWeight: 700, pb: 1, pr: 5 }}>
        Tham gia phòng chat
        {!joining && (
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ position: "absolute", right: 12, top: 12 }}
            aria-label="Đóng"
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 1 }}>
        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px 0",
              gap: 12,
            }}
          >
            <CircularProgress size={32} />
            <Typography variant="body2" color="text.secondary">
              Đang tải thông tin phòng chat...
            </Typography>
          </div>
        )}

        {!loading && error && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "16px 0",
              gap: 12,
            }}
          >
            <ErrorOutlineRoundedIcon sx={{ fontSize: 48, color: "#ef4444" }} />
            <Typography variant="subtitle1" fontWeight={600} color="error">
              Không thể tham gia phòng
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {error}
            </Typography>
          </div>
        )}

        {!loading && !error && info && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "12px 0",
              gap: 12,
            }}
          >
            <div style={{ position: "relative" }}>
              <ChatRoomAvatar
                avatar={info.avatar}
                title={info.title}
                convType="GROUP"
                size={64}
              />
            </div>

            <div>
              <Typography variant="h6" fontWeight={700} sx={{ fontSize: 18, mb: 0.5 }}>
                {info.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}
              >
                <GroupsRoundedIcon sx={{ fontSize: 16 }} />
                {info.memberCount} thành viên
              </Typography>
            </div>

            {info.isMember ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  borderRadius: 8,
                  backgroundColor: "#f0fdf4",
                  color: "#166534",
                  marginTop: 6,
                }}
              >
                <CheckCircleOutlineRoundedIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2" fontWeight={500}>
                  Bạn hiện đã là thành viên của phòng này
                </Typography>
              </div>
            ) : (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  marginTop: 6,
                  width: "100%",
                }}
              >
                <Typography variant="body1" fontWeight={500} color="text.primary">
                  Bạn có muốn gia nhập phòng <strong>{info.title}</strong> hay không?
                </Typography>
              </div>
            )}
          </div>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={onClose} size="small" disabled={joining} color="inherit">
          {error || (info && info.isMember) ? "Đóng" : "Huỷ"}
        </Button>

        {!loading && !error && info && (
          <Button
            variant="contained"
            size="small"
            disabled={joining}
            onClick={handleConfirmJoin}
            startIcon={joining ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{ px: 2.5 }}
          >
            {info.isMember ? "Vào phòng chat" : "Đồng ý gia nhập"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
