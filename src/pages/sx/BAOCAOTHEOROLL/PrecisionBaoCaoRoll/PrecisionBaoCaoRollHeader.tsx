import React, { useState, useEffect } from "react";
import { FiRefreshCw, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { HiOutlineServer } from "react-icons/hi";

interface Props {
  onReload: () => void;
  totalRows: number;
}

const PrecisionBaoCaoRollHeader: React.FC<Props> = ({ onReload, totalRows }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  return (
    <header className="precision-bcr-header">
      <div className="precision-bcr-header__left">
        <span className="precision-bcr-header__badge-brand">CMS ERP</span>
        <nav className="precision-bcr-header__breadcrumb" aria-label="Breadcrumb">
          <span>SX • REPORT</span>
          <span>/</span>
          <span className="active">Báo Cáo Sản Xuất Theo Roll (Production Roll Analytics)</span>
        </nav>
        <div className="precision-bcr-header__telemetry">
          <span className="pulse-dot"></span>
          <HiOutlineServer size={12} />
          <span>{totalRows.toLocaleString("en-US")} dòng</span>
        </div>
      </div>
      <div className="precision-bcr-header__right">
        <button type="button" className="precision-bcr-header__btn-action" onClick={onReload} title="Tải lại toàn bộ dữ liệu">
          <FiRefreshCw size={12} />
          <span>Làm Mới</span>
        </button>
        <button type="button" className="precision-bcr-header__btn-action" onClick={toggleFullscreen} title={isFullscreen ? "Thoát" : "Toàn màn hình"}>
          {isFullscreen ? <FiMinimize2 size={12} /> : <FiMaximize2 size={12} />}
          <span>{isFullscreen ? "Thu Nhỏ" : "Toàn Màn Hình"}</span>
        </button>
      </div>
    </header>
  );
};

const MemoizedPrecisionBaoCaoRollHeader = React.memo(PrecisionBaoCaoRollHeader);
export { MemoizedPrecisionBaoCaoRollHeader as PrecisionBaoCaoRollHeader };
export default MemoizedPrecisionBaoCaoRollHeader;
