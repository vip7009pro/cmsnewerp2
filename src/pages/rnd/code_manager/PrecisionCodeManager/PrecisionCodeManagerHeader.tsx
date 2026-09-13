// PrecisionCodeManagerHeader.tsx - Sub-Header for Product Master (Google Stitch)

import React, { useState, useEffect } from "react";
import moment from "moment";
import { MdInventory2, MdRefresh, MdFullscreen } from "react-icons/md";
import { FiClock } from "react-icons/fi";

interface PrecisionCodeManagerHeaderProps {
  onRefresh: () => void;
}

const PrecisionCodeManagerHeader: React.FC<PrecisionCodeManagerHeaderProps> = ({
  onRefresh,
}) => {
  const [liveTime, setLiveTime] = useState(moment().format("HH:mm:ss"));

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(moment().format("HH:mm:ss"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div className="precision-code-manager__header">
      <div className="header-left">
        <div className="dept-tag">
          <span className="dept-dot" />
          <span>R&D / QLSX / SẢN PHẨM</span>
        </div>

        <span className="divider-slash">/</span>

        <div className="page-title-box">
          <MdInventory2 className="page-icon" />
          <h1 className="page-title">Quản Lý Danh Mục Sản Phẩm (Product Master Info - ERP)</h1>
        </div>

        <span className="version-badge">v2.7-LIVE</span>
      </div>

      <div className="header-right">
        <div className="sync-box">
          <FiClock className="sync-icon" />
          <span>Đồng bộ: <strong>{liveTime}</strong></span>
        </div>

        <button
          type="button"
          className="btn-refresh"
          onClick={onRefresh}
          title="Tải lại danh sách sản phẩm"
        >
          <MdRefresh size={15} />
          <span>Làm mới</span>
        </button>

        <button
          type="button"
          className="btn-fullscreen"
          onClick={handleToggleFullscreen}
          title="Bật/Tắt toàn màn hình"
        >
          <MdFullscreen size={16} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCodeManagerHeader);
