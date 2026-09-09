import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Swal from "sweetalert2";
import { generalQuery, getUserData } from "../../../../api/Api";

interface PrecisionChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function PrecisionChangePasswordDialog({
  open,
  onClose,
}: PrecisionChangePasswordDialogProps) {
  const [currentPW, setCurrentPW] = useState("");
  const [newPW, setNewPW] = useState("");

  const handleChangePassword = () => {
    if (!currentPW.trim() || !newPW.trim()) {
      Swal.fire("Thông báo", "Vui lòng nhập đầy đủ mật khẩu", "warning");
      return;
    }

    if (currentPW === getUserData()?.PASSWORD) {
      generalQuery("changepassword", { PASSWORD: newPW })
        .then(() => {
          Swal.fire("Thông báo", "Thay đổi mật khẩu thành công", "success");
          setCurrentPW("");
          setNewPW("");
          onClose();
        })
        .catch((error) => {
          console.error(error);
          Swal.fire("Lỗi", "Thay đổi mật khẩu thất bại", "error");
        });
    } else {
      Swal.fire("Thông báo", "Mật khẩu hiện tại không đúng", "error");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "10px",
          boxShadow: "0 20px 25px -5px rgba(15, 23, 42, 0.15)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>
        Đổi Mật Khẩu Tài Khoản
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        <TextField
          label="Mật khẩu hiện tại"
          type="password"
          size="small"
          fullWidth
          value={currentPW}
          onChange={(e) => setCurrentPW(e.target.value)}
          sx={{ mt: 1 }}
        />
        <TextField
          label="Mật khẩu mới"
          type="password"
          size="small"
          fullWidth
          value={newPW}
          onChange={(e) => setNewPW(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button variant="outlined" onClick={onClose} size="small">
          Hủy bỏ
        </Button>
        <Button
          variant="contained"
          onClick={handleChangePassword}
          size="small"
          sx={{ bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" } }}
        >
          Xác nhận đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
