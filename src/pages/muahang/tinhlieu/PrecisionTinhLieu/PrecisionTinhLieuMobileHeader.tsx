import React from "react";
import { FiCpu, FiBarChart2, FiFilter, FiRefreshCw } from "react-icons/fi";

interface PrecisionTinhLieuMobileHeaderProps {
  currentMode: "DETAIL" | "SUMMARY" | "PLAN";
  totalCount: number;
  filteredCount: number;
  showKpi: boolean;
  onToggleKpi: () => void;
  onOpenFilterDrawer: () => void;
  onReload: () => void;
  activeFilterCount: number;
}

const PrecisionTinhLieuMobileHeader: React.FC<PrecisionTinhLieuMobileHeaderProps> = ({
  currentMode,
  totalCount,
  filteredCount,
  showKpi,
  onToggleKpi,
  onOpenFilterDrawer,
  onReload,
  activeFilterCount,
}) => {
  const getModeShortLabel = () => {
    switch (currentMode) {
      case "DETAIL":
        return "Chi Tiết";
      case "SUMMARY":
        return "Tổng Hợp";
      case "PLAN":
        return "Kế Hoạch";
      default:
        return "MRP";
    }
  };

  return (
    <div className="precision-tinhlieu__mobileHeader">
      <div className="mobile-header-top">
        <div className="mobile-header-brand">
          <div className="brand-icon">
            <FiCpu size={16} />
          </div>
          <div className="brand-text">
            <div className="brand-title">
              <span>TÍNH LIỆU MRP</span>
              <span className="brand-badge">M120</span>
              <span className="brand-mode-badge">{getModeShortLabel()}</span>
            </div>
            <div className="brand-meta">
              <span className="live-dot" />
              <span>LIVE</span>
              <span className="divider">•</span>
              <span>
                {filteredCount.toLocaleString("en-US")} / {totalCount.toLocaleString("en-US")} dòng
              </span>
            </div>
          </div>
        </div>

        <div className="mobile-header-actions">
          {/* Nút bật/tắt Micro-KPI */}
          <button
            type="button"
            className={`btn-header-action ${showKpi ? "active" : ""}`}
            onClick={onToggleKpi}
            title={showKpi ? "Ẩn tóm tắt KPI" : "Hiện tóm tắt KPI"}
          >
            <FiBarChart2 size={15} />
            <span>KPI</span>
          </button>

          {/* Nút mở Drawer bộ lọc */}
          <button
            type="button"
            className={`btn-header-action ${activeFilterCount > 0 ? "has-filter" : ""}`}
            onClick={onOpenFilterDrawer}
            title="Mở bộ lọc MRP nâng cao"
          >
            <FiFilter size={15} />
            {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
          </button>

          {/* Nút Reload */}
          <button
            type="button"
            className="btn-header-action"
            onClick={onReload}
            title="Tải lại dữ liệu MRP"
          >
            <FiRefreshCw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionTinhLieuMobileHeader);
