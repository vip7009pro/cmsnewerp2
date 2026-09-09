import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserData } from "../../../../api/GlobalInterface";

interface PrecisionDangKyHeaderProps {
  userData?: UserData;
}

export const PrecisionDangKyHeader: React.FC<PrecisionDangKyHeaderProps> = ({ userData }) => {
  const glbUserData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const currentUser = userData || glbUserData;
  const fullName = currentUser
    ? `${currentUser.MIDLAST_NAME ?? ""} ${currentUser.FIRST_NAME ?? ""}`.trim()
    : "Nhân viên CMS";
  const emplNo = currentUser?.EMPL_NO ?? "CMS Vina";
  const roleName = currentUser?.WORK_POSITION_NAME ?? currentUser?.MAINDEPTNAME ?? "Nhân viên";

  const initialLetter = currentUser?.FIRST_NAME
    ? currentUser.FIRST_NAME.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="precision-dangky__header">
      <div className="header-left">
        <div className="icon-box">
          <span className="material-symbols-outlined">event_available</span>
        </div>
        <div className="title-info">
          <span className="breadcrumb">01. Nhân sự &amp; Hành chính • NS3 - Self-Service Portal</span>
          <h1 className="title">Cổng Đăng Ký Nghỉ Phép, Tăng Ca &amp; Chấm Công</h1>
        </div>
      </div>

      <div className="header-right">
        <div className="user-pill" title={`${fullName} - ${roleName}`}>
          <div className="user-avatar">{initialLetter}</div>
          <div className="user-text">
            <span className="user-name">{fullName}</span>
            <span className="user-role">• {roleName}</span>
            <span className="user-code">({emplNo})</span>
          </div>
        </div>

        <div className="status-pill">
          <span className="dot"></span>
          <span>HRM SYNC ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDangKyHeader);
