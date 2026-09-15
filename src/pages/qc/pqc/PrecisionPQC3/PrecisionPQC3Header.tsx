import React from "react";
import { AiOutlineReload, AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { UserData } from "../../../../api/GlobalInterface";

interface PrecisionPQC3HeaderProps {
  userData?: UserData;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
  onReload: () => void;
}

export const PrecisionPQC3Header: React.FC<PrecisionPQC3HeaderProps> = ({
  userData,
  isFullScreen,
  onToggleFullScreen,
  onReload,
}) => {
  return (
    <header className="precision-pqc3-header">
      <div className="precision-pqc3-header__left">
        <span className="brand-badge">CMS ERP</span>
        <span className="badge-module">DEFECT PQC3</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-title">
          04. QC • PQC / ĐĂNG KÝ & THEO DÕI LỖI CÔNG ĐOẠN (PQC3 CONTROL)
        </span>
      </div>

      <div className="precision-pqc3-header__right">
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
          title="Nạp lại dữ liệu sự cố lỗi PQC3"
          onClick={onReload}
          type="button"
        >
          <AiOutlineReload size={13} />
        </button>

        <button
          className="header-btn"
          title={isFullScreen ? "Thu nhỏ cửa sổ" : "Mở rộng toàn màn hình"}
          onClick={onToggleFullScreen}
          type="button"
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

export default React.memo(PrecisionPQC3Header);
