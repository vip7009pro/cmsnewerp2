import React, { useState } from "react";
import { Button, TextField, InputAdornment, IconButton } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { changeGLBSetting } from "../../../redux/slices/globalSlice";
import { WEB_SETTING_DATA } from "../../../api/GlobalInterface";

interface PrecisionSettingTableProps {
  settings: WEB_SETTING_DATA[];
  onUpdateSettingValue: (ID: number, newValue: any) => void;
  onResetSettingValue: () => void;
  isMobile?: boolean;
}

export const PrecisionSettingTable: React.FC<PrecisionSettingTableProps> = ({
  settings,
  onUpdateSettingValue,
  onResetSettingValue,
  isMobile = false,
}) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const globalSetting = useSelector((state: RootState) => state.totalSlice.globalSetting);

  const filteredSettings = settings.filter(
    (s) =>
      s.ITEM_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.ID).includes(searchTerm)
  );

  const handleSave = () => {
    Swal.fire({
      title: "Lưu cấu hình hệ thống?",
      text: "Cấu hình sẽ được lưu vào thiết bị làm việc hiện tại",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Lưu Cấu Hình",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem("setting", JSON.stringify(settings));
        dispatch(changeGLBSetting(settings));
        Swal.fire("Thành công", "Đã lưu cấu hình thiết bị thành công!", "success");
      }
    });
  };

  const handleReset = () => {
    Swal.fire({
      title: "Khôi phục cấu hình mặc định?",
      text: "Toàn bộ tham số sẽ được hoàn nguyên về giá trị chuẩn của hệ thống",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Khôi Phục Mặc Định",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        onResetSettingValue();
        Swal.fire("Đã khôi phục", "Các tham số đã được đặt lại mặc định", "success");
      }
    });
  };

  return (
    <div className={`precision-setting__card ${isMobile ? "precision-setting__card--mobile" : ""}`}>
      {/* CARD HEADER */}
      <div className={`precision-setting__card-header ${isMobile ? "precision-setting__card-header--mobile" : ""}`}>
        <h3 className="card-title">
          <TuneIcon className="card-icon" />
          <span>Tham Số Cấu Hình ({filteredSettings.length})</span>
        </h3>

        {!isMobile && (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Tìm tham số..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: "16px", color: "#64748b" }} />
                  </InputAdornment>
                ),
                sx: { height: "28px", fontSize: "0.75rem", width: "160px" },
              }}
            />
            <Button
              variant="contained"
              size="small"
              startIcon={<SaveIcon sx={{ fontSize: "14px" }} />}
              onClick={handleSave}
              sx={{ backgroundColor: "#2563eb", textTransform: "none", fontSize: "0.75rem", fontWeight: 600, height: "28px" }}
            >
              Lưu
            </Button>
            <Button
              variant="outlined"
              color="warning"
              size="small"
              startIcon={<RestartAltIcon sx={{ fontSize: "14px" }} />}
              onClick={handleReset}
              sx={{ textTransform: "none", fontSize: "0.75rem", fontWeight: 600, height: "28px" }}
            >
              Đặt Lại
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              startIcon={<VisibilityIcon sx={{ fontSize: "14px" }} />}
              onClick={() => console.log("Current Global Settings:", globalSetting)}
              sx={{ textTransform: "none", fontSize: "0.75rem", fontWeight: 600, height: "28px" }}
            >
              Xem
            </Button>
          </div>
        )}
      </div>

      {/* MOBILE TOOLBAR & SEARCH */}
      {isMobile && (
        <div className="precision-setting__mobile-table-toolbar">
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm theo tên hoặc mã tham số..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#64748b" }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
              sx: { borderRadius: "8px", background: "#f8fafc", fontSize: "0.85rem" },
            }}
          />

          <div className="mobile-action-buttons">
            <Button
              variant="contained"
              size="medium"
              fullWidth
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ backgroundColor: "#2563eb", textTransform: "none", fontWeight: 600, minHeight: "40px" }}
            >
              Lưu Cấu Hình
            </Button>
            <Button
              variant="outlined"
              color="warning"
              size="medium"
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
              sx={{ textTransform: "none", fontWeight: 600, minHeight: "40px", whiteSpace: "nowrap" }}
            >
              Đặt Lại
            </Button>
          </div>
        </div>
      )}

      {/* BODY CONTENT: MOBILE CARDS vs DESKTOP TABLE */}
      <div className="precision-setting__card-body" style={{ padding: isMobile ? "8px" : "8px" }}>
        {isMobile ? (
          /* MOBILE CARD LIST VIEW */
          <div className="precision-setting__mobile-param-list">
            {filteredSettings.length === 0 ? (
              <div className="mobile-empty-msg">Không tìm thấy tham số nào phù hợp</div>
            ) : (
              filteredSettings.map((setting) => (
                <div key={setting.ID} className="param-card-item">
                  <div className="param-card-header">
                    <span className="param-id-badge">#{setting.ID}</span>
                    <span className="param-item-name">{setting.ITEM_NAME}</span>
                  </div>
                  <div className="param-card-default">
                    <span>Mặc định:</span>
                    <code>{setting.DEFAULT_VALUE || "(trống)"}</code>
                  </div>
                  <div className="param-card-input-box">
                    <label>Giá trị hiện tại:</label>
                    <input
                      type="text"
                      className="param-mobile-input"
                      placeholder="Nhập giá trị..."
                      value={setting.CURRENT_VALUE ?? ""}
                      onChange={(e) => onUpdateSettingValue(setting.ID, e.target.value)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* DESKTOP TABLE VIEW */
          <div className="precision-setting__table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "50px", textAlign: "center" }}>STT</th>
                  <th>Tên Tham Số (Item)</th>
                  <th style={{ width: "120px" }}>Mặc Định</th>
                  <th style={{ width: "300px" }}>Giá Trị Hiện Tại</th>
                </tr>
              </thead>
              <tbody>
                {filteredSettings.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>
                      Không tìm thấy tham số phù hợp
                    </td>
                  </tr>
                ) : (
                  filteredSettings.map((setting) => (
                    <tr key={setting.ID}>
                      <td style={{ textAlign: "center", fontWeight: 600, color: "#64748b" }}>
                        {setting.ID}
                      </td>
                      <td style={{ fontWeight: 600, color: "#0f172a" }}>
                        {setting.ITEM_NAME}
                      </td>
                      <td style={{ color: "#64748b" }}>
                        {setting.DEFAULT_VALUE}
                      </td>
                      <td>
                        <input
                          className="table-input"
                          type="text"
                          value={setting.CURRENT_VALUE ?? ""}
                          onChange={(e) => onUpdateSettingValue(setting.ID, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
