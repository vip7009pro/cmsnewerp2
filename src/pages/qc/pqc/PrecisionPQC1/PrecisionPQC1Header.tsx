import React from "react";
import { AiOutlineReload, AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { UserData } from "../../../../api/GlobalInterface";

interface PrecisionPQC1HeaderProps {
  userData?: UserData;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
  onReload: () => void;
}

export const PrecisionPQC1Header: React.FC<PrecisionPQC1HeaderProps> = ({
  userData,
  isFullScreen,
  onToggleFullScreen,
  onReload,
}) => {
  return (
    <header className="precision-pqc1-header">
      <div className="precision-pqc1-header__left">
        <span className="brand-badge">CMS ERP</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-title">
          04. QC • PQC / CÀI ĐẶT CÔNG ĐOẠN (PQC1 - SETTING CONTROL)
        </span>
      </div>

      <div className="precision-pqc1-header__right">
        <div className="telemetry-chip">
          <span className="status-dot" />
          <span>NET_SERVER: 3007 (Online)</span>
        </div>

        {userData && (
          <div className="user-chip">
            <span>{userData.EMPL_NO}</span>
            <span>•</span>
            <span>{userData.MIDLAST_NAME} {userData.FIRST_NAME}</span>
          </div>
        )}

        <button
          className="header-btn"
          title="Tải lại dữ liệu"
          onClick={onReload}
        >
          <AiOutlineReload size={13} />
        </button>

        <button
          className="header-btn"
          title={isFullScreen ? "Thu nhỏ" : "Toàn màn hình"}
          onClick={onToggleFullScreen}
        >
          {isFullScreen ? (
            <AiOutlineFullscreenExit size={14} />
          ) : (
            <AiOutlineFullscreen size={14} />
          )}
        </button>
      </div>
    </header>
  );
};
