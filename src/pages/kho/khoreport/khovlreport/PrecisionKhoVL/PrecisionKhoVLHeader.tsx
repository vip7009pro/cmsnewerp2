import React, { useState, useEffect } from "react";
import { FiRefreshCw, FiMaximize2, FiMinimize2, FiDatabase } from "react-icons/fi";
import { HiOutlineServer } from "react-icons/hi";

interface PrecisionKhoVLHeaderProps {
  onReload: () => void;
  totalRecords: number;
}

const PrecisionKhoVLHeader: React.FC<PrecisionKhoVLHeaderProps> = ({ onReload, totalRecords }) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
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

  return (
    <header className="precision-khovl__header">
      <div className="precision-khovl__header-left">
        <span className="precision-khovl__header-badge">CMS ERP • KHO</span>
        <nav className="precision-khovl__header-breadcrumb" aria-label="Breadcrumb">
          <span>KHO • REPORT</span>
          <span>/</span>
          <span className="active">Báo Cáo Nhập / Xuất / Tồn Nguyên Liệu (Material WH Analytics)</span>
        </nav>
        <div className="precision-khovl__header-telemetry">
          <span className="pulse-dot" />
          <HiOutlineServer size={12} />
          <span>
            <FiDatabase size={11} />
            &nbsp;{totalRecords.toLocaleString("en-US")} dòng
          </span>
        </div>
      </div>

      <div className="precision-khovl__header-right">
        <button
          type="button"
          className="precision-khovl__header-btn"
          onClick={onReload}
          title="Tải lại toàn bộ dữ liệu"
        >
          <FiRefreshCw size={12} />
          <span>Làm Mới</span>
        </button>

        <button
          type="button"
          className="precision-khovl__header-btn"
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

export default React.memo(PrecisionKhoVLHeader);
