import React, { useState, useEffect } from "react";
import { FiRefreshCw, FiMaximize2, FiMinimize2, FiDatabase } from "react-icons/fi";
import { HiOutlineServer } from "react-icons/hi";

interface PrecisionKhoTPHeaderProps {
  onReload: () => void;
  totalRecords: number;
}

const PrecisionKhoTPHeader: React.FC<PrecisionKhoTPHeaderProps> = ({ onReload, totalRecords }) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  return (
    <header className="precision-khotp__header">
      <div className="precision-khotp__header-left">
        <span className="precision-khotp__header-badge">CMS ERP • KHO TP</span>
        <nav className="precision-khotp__header-breadcrumb" aria-label="Breadcrumb">
          <span>KHO • REPORT</span>
          <span>/</span>
          <span className="active">Báo Cáo Tồn Kho Thành Phẩm Dài Hạn (Product WH Analytics)</span>
        </nav>
        <div className="precision-khotp__header-telemetry">
          <span className="pulse-dot" />
          <HiOutlineServer size={12} />
          <span>
            <FiDatabase size={11} />
            &nbsp;{totalRecords.toLocaleString("en-US")} dòng
          </span>
        </div>
      </div>

      <div className="precision-khotp__header-right">
        <button
          type="button"
          className="precision-khotp__header-btn"
          onClick={onReload}
          title="Tải lại dữ liệu"
        >
          <FiRefreshCw size={12} />
          <span>Làm Mới</span>
        </button>
        <button
          type="button"
          className="precision-khotp__header-btn"
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

export default React.memo(PrecisionKhoTPHeader);
