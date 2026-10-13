import React, { useState, useEffect } from "react";
import { FiRefreshCw, FiMaximize2, FiMinimize2, FiClock } from "react-icons/fi";
import { HiOutlineServer } from "react-icons/hi";

interface PrecisionKDHeaderProps {
  onReload?: () => void;
  onSync?: () => void;
  lastSyncTime?: string;
  isSyncing?: boolean;
}

const PrecisionKDHeader: React.FC<PrecisionKDHeaderProps> = ({
  onReload,
  onSync,
  lastSyncTime,
  isSyncing = false,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  const handleActionClick = () => {
    if (onSync) {
      onSync();
    } else if (onReload) {
      onReload();
    }
  };

  return (
    <header className="precision-kd-header">
      <div className="precision-kd-header__left">
        <span className="precision-kd-header__badge-brand">CMS ERP</span>
        <nav className="precision-kd-header__breadcrumb" aria-label="Breadcrumb">
          <span>KD • REPORT</span>
          <span>/</span>
          <span className="active">Báo Cáo Doanh Thu & Chỉ Số Kinh Doanh (Executive Analytics)</span>
        </nav>
        <div className="precision-kd-header__telemetry">
          <span className="pulse-dot"></span>
          <HiOutlineServer size={12} />
          <span>NET_SERVER: 3007</span>
        </div>
      </div>

      <div className="precision-kd-header__right">
        {/* Hiển thị thời điểm cập nhật dữ liệu của báo cáo */}
        <div className="precision-kd-header__sync-info" title="Thời điểm cơ sở dữ liệu báo cáo được cập nhật mới nhất">
          <FiClock size={12} className="sync-clock-icon" />
          <span className="sync-label">Dữ liệu cập nhật:</span>
          <strong className="sync-time">{lastSyncTime || "Đang tải..."}</strong>
        </div>

        {/* Nút Cập nhật dữ liệu mới nhất (Làm mới) */}
        <button
          type="button"
          className={`precision-kd-header__btn-action precision-kd-header__btn-sync ${isSyncing ? "is-loading" : ""}`}
          onClick={handleActionClick}
          disabled={isSyncing}
          title="Đồng bộ dữ liệu phát sinh mới nhất từ hệ thống và nạp lại toàn bộ báo cáo"
        >
          <FiRefreshCw size={12} className={isSyncing ? "animate-spin" : ""} />
          <span>{isSyncing ? "Đang Cập Nhật..." : "Cập Nhật Dữ Liệu Mới Nhất"}</span>
        </button>

        <button
          type="button"
          className="precision-kd-header__btn-action"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
        >
          {isFullscreen ? <FiMinimize2 size={12} /> : <FiMaximize2 size={12} />}
          <span>{isFullscreen ? "Thu Nhỏ" : "Toàn Màn Hình"}</span>
        </button>
      </div>
    </header>
  );
};

export default React.memo(PrecisionKDHeader);
