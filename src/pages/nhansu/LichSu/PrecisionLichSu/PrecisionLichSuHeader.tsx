import React from "react";
import { UserData } from "../../../../api/GlobalInterface";

interface PrecisionLichSuHeaderProps {
  userData?: UserData;
}

export const PrecisionLichSuHeader: React.FC<PrecisionLichSuHeaderProps> = ({
  userData,
}) => {
  const initialLetter = userData?.FIRST_NAME
    ? userData.FIRST_NAME.charAt(0).toUpperCase()
    : "U";

  const fullName = userData
    ? `${userData.MIDLAST_NAME || ""} ${userData.FIRST_NAME || ""}`.trim()
    : "NHÂN VIÊN";

  const emplCode = userData?.CMS_ID || userData?.EMPL_NO || "CMS_ERP";
  const department = userData?.MAINDEPTNAME || userData?.SUBDEPTNAME || "CMS VINA";

  return (
    <div className="precision-lichsu__header">
      <div className="precision-lichsu__headerLeft">
        <span className="precision-lichsu__headerBadge">
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
            history_edu
          </span>
          NS5 LEDGER
        </span>
        <h1 className="precision-lichsu__headerTitle">
          01. NHÂN SỰ &amp; HÀNH CHÍNH &bull; LỊCH SỬ ĐI LÀM &amp; CHẤM CÔNG CÁ NHÂN
        </h1>
      </div>

      <div className="precision-lichsu__headerRight">
        {/* User Identity Chip */}
        <div className="precision-lichsu__userChip" title={`${fullName} - ${department}`}>
          <div className="user-avatar">{initialLetter}</div>
          <span className="user-name">{fullName}</span>
          <span className="user-code">{emplCode}</span>
        </div>

        {/* Telemetry Pills */}
        <div className="precision-lichsu__statusPill" title="Kết nối đồng bộ máy chấm công ZKTeco">
          <span className="status-dot"></span>
          <span>ZKTECO: 100% SYNC</span>
        </div>

        <div className="precision-lichsu__statusPill" title="Đồng bộ thời gian thực HRM">
          <span className="status-dot"></span>
          <span>HRM ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

export default PrecisionLichSuHeader;
