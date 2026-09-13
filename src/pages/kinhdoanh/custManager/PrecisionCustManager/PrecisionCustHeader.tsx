import React, { useState } from "react";
import { FiMaximize, FiMinimize, FiRefreshCw } from "react-icons/fi";

interface PrecisionCustHeaderProps {
  onRefresh: () => void;
}

const PrecisionCustHeader: React.FC<PrecisionCustHeaderProps> = ({ onRefresh }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      }
    }
  };

  return (
    <header className="precision-cust__header">
      <div className="header-left">
        <span className="brand-badge">KD • CUST</span>
        <span className="title">Quản Lý Danh Mục Đối Tác & Khách Hàng / Vendor Master</span>
        <span className="subtitle">
          — Phân hệ Kinh Doanh • Tra cứu, chuẩn hóa hồ sơ pháp nhân & thông tin giao dịch
        </span>
      </div>

      <div className="header-right">
        <div className="telemetry-chip">
          <span className="ping-dot" />
          <span>NET_SERVER: 3007 (Online)</span>
        </div>

        <button
          type="button"
          className="btn-icon"
          onClick={onRefresh}
          title="Tải lại toàn bộ dữ liệu đối tác"
        >
          <FiRefreshCw size={14} />
        </button>

        <button
          type="button"
          className="btn-icon"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
        >
          {isFullscreen ? <FiMinimize size={14} /> : <FiMaximize size={14} />}
        </button>
      </div>
    </header>
  );
};

export default React.memo(PrecisionCustHeader);
