import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SendIcon from "@mui/icons-material/Send";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";

interface PrecisionSettingNotificationProps {
  isMobile?: boolean;
}

export const PrecisionSettingNotification: React.FC<PrecisionSettingNotificationProps> = ({
  isMobile = false,
}) => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleSendNotification = async () => {
    if (!title.trim() || !body.trim()) {
      Swal.fire("Cảnh báo", "Vui lòng nhập đầy đủ tiêu đề và nội dung thông báo", "warning");
      return;
    }

    try {
      setIsSending(true);
      const response = await generalQuery("sendNotificationAPI", {
        title: title.trim(),
        body: body.trim(),
      });

      if (response?.data?.tk_status === "OK") {
        Swal.fire("Thành công", "Đã gửi thông báo đẩy đến toàn bộ người dùng!", "success");
        setTitle("");
        setBody("");
      } else {
        Swal.fire("Lỗi", "Không thể gửi thông báo. Vui lòng kiểm tra lại!", "error");
      }
    } catch (error) {
      console.error("Lỗi khi gửi thông báo:", error);
      Swal.fire("Lỗi", "Có lỗi xảy ra khi gửi thông báo", "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={`precision-setting__card ${isMobile ? "precision-setting__card--mobile" : ""}`}>
      <div className={`precision-setting__card-header ${isMobile ? "precision-setting__card-header--mobile" : ""}`}>
        <h3 className="card-title">
          <NotificationsActiveIcon className="card-icon" sx={{ color: "#ea580c" }} />
          <span>Quản Trị Push Notification (Admin NHU1903)</span>
        </h3>
      </div>

      <div className="precision-setting__card-body" style={{ padding: isMobile ? "10px" : "14px" }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
          }}
        >
          <TextField
            size="small"
            label="Tiêu đề thông báo"
            placeholder="VD: Thông báo bảo trì máy chủ..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth={isMobile}
            sx={{ flex: isMobile ? "unset" : 1, minWidth: isMobile ? "100%" : "200px" }}
          />
          <TextField
            size="small"
            label="Nội dung chi tiết"
            placeholder="Nội dung phát sóng đến trình duyệt..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            fullWidth={isMobile}
            sx={{ flex: isMobile ? "unset" : 2, minWidth: isMobile ? "100%" : "280px" }}
          />
          <Button
            variant="contained"
            color="warning"
            size="medium"
            disabled={isSending || !title.trim() || !body.trim()}
            startIcon={<SendIcon />}
            onClick={handleSendNotification}
            fullWidth={isMobile}
            sx={{
              backgroundColor: "#ea580c",
              textTransform: "none",
              fontWeight: 600,
              height: "40px",
              minHeight: "40px",
              whiteSpace: "nowrap",
            }}
          >
            {isSending ? "Đang gửi..." : "Phát Thông Báo"}
          </Button>
        </div>
      </div>
    </div>
  );
};

