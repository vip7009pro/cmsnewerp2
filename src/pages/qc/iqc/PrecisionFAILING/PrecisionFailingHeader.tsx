import React from "react";
import { FiMaximize, FiMinimize, FiRefreshCw } from "react-icons/fi";
import { UserData } from "../../../../api/GlobalInterface";

interface PrecisionFailingHeaderProps {
  userData?: UserData;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onRefresh: () => void;
}

export const PrecisionFailingHeader: React.FC<PrecisionFailingHeaderProps> = ({
  userData,
  isFullscreen,
  onToggleFullscreen,
  onRefresh,
}) => {
  const userInitial = userData?.FIRST_NAME ? userData.FIRST_NAME.charAt(0) : "Q";

  return (
    <header className="precision-failing-header">
      {/* Left: Breadcrumbs & Telemetry */}
      <div className="precision-failing-header__left">
        <div className="breadcrumb">
          <span className="brand">04. QC • IQC</span>
          <span className="sep">/</span>
          <span className="current">QUẢN LÝ LÔ LỖI (QC FAILING CONTROL)</span>
        </div>

        <span className="badge-engine">FAILING ENGINE</span>

        <div className="telemetry">
          <span className="pulse-dot"></span>
          <span>NET_SERVER: 3007 (Online)</span>
        </div>
      </div>

      {/* Right: User Information & Actions */}
      <div className="precision-failing-header__right">
        <div className="user-pill">
          <div className="user-avatar">{userInitial}</div>
          <span className="user-name">
            {userData?.MIDLAST_NAME} {userData?.FIRST_NAME}
          </span>
          <span className="user-dept">({userData?.SUBDEPTNAME || "QC"})</span>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn-icon"
            onClick={onRefresh}
            title="Làm mới dữ liệu (Refresh)"
          >
            <FiRefreshCw size={12} />
          </button>

          <button
            type="button"
            className="btn-icon"
            onClick={onToggleFullscreen}
            title={isFullscreen ? "Thu nhỏ (Exit Fullscreen)" : "Toàn màn hình (Fullscreen)"}
          >
            {isFullscreen ? <FiMinimize size={13} /> : <FiMaximize size={13} />}
          </button>
        </div>
      </div>
    </header>
  );
};
