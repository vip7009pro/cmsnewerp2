import React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import SecurityIcon from "@mui/icons-material/Security";
import { getUserData, getCtrCd } from "../../../api/Api";

interface PrecisionSettingHeaderProps {
  isMobile?: boolean;
}

export const PrecisionSettingHeader: React.FC<PrecisionSettingHeaderProps> = ({
  isMobile = false,
}) => {
  const userData = getUserData();
  const ctrCd = getCtrCd();

  return (
    <div className={`precision-setting__header ${isMobile ? "precision-setting__header--mobile" : ""}`}>
      <div className="precision-setting__header-left">
        <h1 className="precision-setting__title">
          <SettingsIcon className="header-icon" />
          <span>{isMobile ? "Cài Đặt Hệ Thống" : "Cấu Hình & Cài Đặt Hệ Thống"}</span>
        </h1>
        {!isMobile && (
          <div className="precision-setting__breadcrumb">
            <span>Hệ thống</span>
            <span>/</span>
            <span>Cấu hình tham số & Xác thực bảo mật (MFA)</span>
          </div>
        )}
      </div>

      <div className="precision-setting__header-right">
        <div className="precision-setting__badge-telemetry">
          <span className="dot" />
          <span>
            {userData?.FIRST_NAME || userData?.EMPL_NO}
          </span>
        </div>
        <div className="precision-setting__badge-telemetry">
          <SecurityIcon sx={{ fontSize: "13px", color: "#2563eb" }} />
          <span>{ctrCd === "001" ? "NM1" : "NM2"}</span>
        </div>
      </div>
    </div>
  );
};
