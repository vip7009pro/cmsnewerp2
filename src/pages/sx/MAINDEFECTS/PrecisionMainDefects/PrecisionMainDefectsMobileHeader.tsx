import React from "react";
import { FiRefreshCw, FiSliders, FiFilter } from "react-icons/fi";

interface PrecisionMainDefectsMobileHeaderProps {
  totalCount: number;
  filteredCount: number;
  uniqueProducts: number;
  loading: boolean;
  showKpi: boolean;
  onToggleKpi: () => void;
  onOpenFilterDrawer: () => void;
  onReload: () => void;
  activeFilterCount: number;
}

const PrecisionMainDefectsMobileHeader: React.FC<PrecisionMainDefectsMobileHeaderProps> = ({
  totalCount,
  filteredCount,
  uniqueProducts,
  loading,
  showKpi,
  onToggleKpi,
  onOpenFilterDrawer,
  onReload,
  activeFilterCount,
}) => {
  return (
    <div className="precision-maindefects__mobileHeader">
      <div className="header-left">
        <div className="brand-badge">
          <span className="pulse-dot" />
          <span className="brand-text">SX • DEFECTS</span>
        </div>
        <div className="telemetry-chip">
          <span className="telemetry-highlight">{filteredCount.toLocaleString("en-US")}</span>
          <span className="telemetry-sub">/{totalCount.toLocaleString("en-US")} Lỗi</span>
        </div>
      </div>

      <div className="header-actions">
        {/* Nút bật/tắt dải KPI cuộn ngang */}
        <button
          type="button"
          className={`btn-mobile-action ${showKpi ? "active" : ""}`}
          onClick={onToggleKpi}
          title="Xem tóm tắt KPI"
        >
          <FiSliders size={13} />
          <span>KPI</span>
        </button>

        {/* Nút mở Filter Drawer với badge */}
        <button
          type="button"
          className="btn-mobile-action btn-mobile-filter"
          onClick={onOpenFilterDrawer}
          title="Mở bộ lọc nâng cao"
        >
          <FiFilter size={13} />
          <span>Lọc</span>
          {activeFilterCount > 0 && (
            <span className="filter-badge">{activeFilterCount}</span>
          )}
        </button>

        {/* Nút Làm mới dữ liệu */}
        <button
          type="button"
          className="btn-mobile-action btn-mobile-reload"
          onClick={onReload}
          disabled={loading}
          title="Làm mới dữ liệu từ server"
        >
          <FiRefreshCw size={13} className={loading ? "spin" : ""} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionMainDefectsMobileHeader);
