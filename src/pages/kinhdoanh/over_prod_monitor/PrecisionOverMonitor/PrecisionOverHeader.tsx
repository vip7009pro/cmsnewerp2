import React, { useState, useEffect } from "react";
import { FiRefreshCw, FiMaximize2, FiMinimize2, FiBarChart2 } from "react-icons/fi";
import { HiOutlineServer } from "react-icons/hi";

interface PrecisionOverHeaderProps {
  onReload: () => void;
  showChart: boolean;
  onToggleChart: () => void;
}

const PrecisionOverHeader: React.FC<PrecisionOverHeaderProps> = ({
  onReload,
  showChart,
  onToggleChart,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Lỗi bật toàn màn hình:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Lỗi thoát toàn màn hình:", err);
      });
    }
  };

  return (
    <header className="precision-over-header">
      <div className="precision-over-header__left">
        <span className="precision-over-header__badge-brand">CMS ERP</span>
        <nav className="precision-over-header__breadcrumb" aria-label="Breadcrumb">
          <span>KD • QLSX</span>
          <span>/</span>
          <span className="active">Giám Sát Hàng Sản Xuất Dư (Production Over Monitor)</span>
        </nav>
        <div className="precision-over-header__telemetry">
          <span className="pulse-dot"></span>
          <HiOutlineServer size={12} />
          <span>NET_SERVER: 3007</span>
        </div>
      </div>

      <div className="precision-over-header__right">
        <button
          type="button"
          className={`precision-over-header__btn-action ${showChart ? "precision-over-header__btn-action--active" : ""}`}
          onClick={onToggleChart}
          title={showChart ? "Ẩn biểu đồ để mở rộng bảng dữ liệu" : "Hiện biểu đồ phân tích tuần"}
        >
          <FiBarChart2 size={13} />
          <span>{showChart ? "Ẩn Biểu Đồ" : "Hiện Biểu Đồ"}</span>
        </button>

        <button
          type="button"
          className="precision-over-header__btn-action"
          onClick={onReload}
          title="Tải lại toàn bộ dữ liệu"
        >
          <FiRefreshCw size={12} />
          <span>Làm Mới</span>
        </button>

        <button
          type="button"
          className="precision-over-header__btn-action"
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

export default React.memo(PrecisionOverHeader);
