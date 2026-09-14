import React from "react";
import { FiMaximize, FiMinimize, FiRefreshCw } from "react-icons/fi";
import { UserData } from "../../../../api/GlobalInterface";

interface PrecisionBLOCKHeaderProps {
  userData?: UserData;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onRefresh: () => void;
}

export const PrecisionBLOCKHeader: React.FC<PrecisionBLOCKHeaderProps> = ({
  userData,
  isFullscreen,
  onToggleFullscreen,
  onRefresh,
}) => {
  const userInitial = userData?.MIDLAST_NAME
    ? userData.MIDLAST_NAME.charAt(0).toUpperCase()
    : "U";

  return (
    <header className="precision-block-header">
      <div className="precision-block-header__left">
        <div className="precision-block-header__breadcrumb">
          <span className="breadcrumb-root">04. QC • IQC</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">QUẢN LÝ LÔ BỊ KHÓA (BLOCKING CONTROL)</span>
        </div>
        <span className="precision-block-header__badge">BLOCK ENGINE</span>
        <div className="precision-block-header__telemetry">
          <span className="pulse-dot" />
          <span>NET_SERVER: 3007 (Online)</span>
        </div>
      </div>

      <div className="precision-block-header__right">
        {userData && (
          <div className="precision-block-header__user">
            <div className="user-avatar">{userInitial}</div>
            <span className="user-name">
              {userData.EMPL_NO} • {userData.MIDLAST_NAME}
            </span>
            <span className="user-dept">({userData.SUBDEPTNAME || "QC"})</span>
          </div>
        )}

        <div className="precision-block-header__actions">
          <button
            type="button"
            className="btn-header-action"
            onClick={onRefresh}
            title="Làm mới dữ liệu"
          >
            <FiRefreshCw size={13} />
          </button>
          <button
            type="button"
            className="btn-header-action"
            onClick={onToggleFullscreen}
            title={isFullscreen ? "Thu nhỏ cửa sổ" : "Xem toàn màn hình"}
          >
            {isFullscreen ? <FiMinimize size={13} /> : <FiMaximize size={13} />}
          </button>
        </div>
      </div>
    </header>
  );
};
