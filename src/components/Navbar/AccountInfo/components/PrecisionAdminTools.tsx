import React, { useState } from "react";
import { Button, Collapse, TextField } from "@mui/material";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { generalQuery, getSocket, uploadQuery } from "../../../../api/Api";
import { update_socket } from "../../../../redux/slices/globalSlice";

export default function PrecisionAdminTools() {
  const dispatch = useDispatch();
  const [showTools, setShowTools] = useState(false);
  const [logoutID, setLogOutID] = useState("");
  const [webver, setWebVerState] = useState<number>(0);
  const [serverString, setServerString] = useState("https://cmsvina4285.com:5013");
  const [updateFile, setUpdateFile] = useState<File | null>(null);

  const handleSetWebVer = (ver: number) => {
    getSocket().emit("setWebVer", ver);
    generalQuery("setWebVer", { WEB_VER: ver })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Set Web Ver thành công", "success");
        } else {
          Swal.fire("Thông báo", "Set Web Ver thất bại: " + response.data.message, "error");
        }
      })
      .catch((err) => console.error(err));
  };

  const handleUpdateBackend = () => {
    if (!updateFile) {
      Swal.fire("Thông báo", "Chưa chọn file updatebe.exe", "warning");
      return;
    }
    uploadQuery(updateFile, "updatebe.exe", "backend")
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Upload thành công", "success");
          window.open("http://192.168.1.192:5005/api/test/updatebackend", "_blank");
        } else {
          Swal.fire("Thông báo", "Upload thất bại: " + response.data.message, "error");
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Thông báo", "Upload thất bại", "error");
      });
  };

  return (
    <div className="precision-hub__card precision-hub__adminCard">
      <div className="precision-hub__cardHeader">
        <div className="precision-hub__cardHeaderLeft">
          <div className="precision-hub__headerIconWrap" style={{ background: "#fef3c7", color: "#d97706" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              build
            </span>
          </div>
          <div>
            <h2 className="precision-hub__cardTitle">Công Cụ Quản Trị Hệ Thống (Admin Tools)</h2>
            <p className="precision-hub__cardSubtitle">Đặc quyền quản trị viên Core ERP (NHU1903)</p>
          </div>
        </div>

        <Button
          size="small"
          variant={showTools ? "contained" : "outlined"}
          onClick={() => setShowTools(!showTools)}
          sx={{ textTransform: "none", fontSize: 12 }}
        >
          {showTools ? "Ẩn công cụ" : "Hiện công cụ"}
        </Button>
      </div>

      <Collapse in={showTools} timeout="auto" unmountOnExit>
        <div className="precision-hub__adminGrid">
          {/* Logout Remote Empl */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <TextField
              label="Mã NV cần Logout"
              size="small"
              value={logoutID}
              onChange={(e) => setLogOutID(e.target.value)}
              sx={{ width: 160 }}
            />
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => {
                if (!logoutID.trim()) return;
                dispatch(
                  update_socket({
                    event: "notification",
                    data: {
                      command: "logout",
                      EMPL_NO: logoutID,
                    },
                  })
                );
                Swal.fire("Thông báo", `Đã gửi lệnh logout tới ${logoutID}`, "info");
              }}
            >
              Logout từ xa
            </Button>
          </div>

          {/* Web Version */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <TextField
              label="Web Ver mới"
              size="small"
              type="number"
              value={webver || ""}
              onChange={(e) => setWebVerState(Number(e.target.value))}
              sx={{ width: 130 }}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                if (webver > 0) {
                  handleSetWebVer(webver);
                } else {
                  Swal.fire("Cảnh báo", "Vui lòng nhập web ver > 0", "warning");
                }
              }}
            >
              Cập nhật Ver
            </Button>
          </div>

          {/* Server Switch */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <select
              value={serverString}
              onChange={(e) => setServerString(e.target.value)}
              style={{
                height: 38,
                padding: "0 10px",
                borderRadius: 6,
                border: "1px solid #cbd5e1",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <option value="https://cmsvina4285.com:5013">NET_SERVER (5013)</option>
              <option value="https://cmsvina4285.com:3007">SUBNET_SERVER (3007)</option>
            </select>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                getSocket().emit("changeServer", { server: serverString, empl_no: logoutID });
                Swal.fire("Thông báo", "Đã gửi lệnh đổi Server", "info");
              }}
            >
              Set Server
            </Button>
          </div>

          {/* Update backend */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="file"
              onChange={(e) => setUpdateFile(e.target.files?.[0] || null)}
              style={{ fontSize: 12 }}
            />
            <Button
              variant="contained"
              size="small"
              color="warning"
              onClick={handleUpdateBackend}
            >
              Update BE
            </Button>
          </div>
        </div>
      </Collapse>
    </div>
  );
}
