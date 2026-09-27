import React from "react";
import { FiRefreshCw, FiSliders, FiFilter } from "react-icons/fi";

interface PrecisionKpiNvSxMobileHeaderProps {
  totalRecords: number;
  filteredCount: number;
  uniqueEmpl: number;
  option: string;
  isLoading: boolean;
  showKpi: boolean;
  onToggleKpi: () => void;
  onOpenFilterDrawer: () => void;
  onReload: () => void;
  activeFilterCount: number;
}

const PrecisionKpiNvSxMobileHeader: React.FC<PrecisionKpiNvSxMobileHeaderProps> = ({
  totalRecords,
  filteredCount,
  uniqueEmpl,
  option,
  isLoading,
  showKpi,
  onToggleKpi,
  onOpenFilterDrawer,
  onReload,
  activeFilterCount,
}) => {
  return (
    <div className="precision-kpinvsx__mobileHeader">
      <div className="header-left">
        <div className="brand-badge">
          <span className="pulse-dot" />
          <span className="brand-text">SX • KPI NV</span>
        </div>
        <div className="telemetry-chip">
          <span className="telemetry-highlight">{uniqueEmpl}</span>
          <span className="telemetry-sub">NV ({option})</span>
        </div>
      </div>

      <div className="header-actions">
        {/* Nút bật/tắt dải KPI cuộn ngang */}
        <button
          type="button"
          className={`btn-mobile-action ${showKpi ? "active" : ""}`}
          onClick={onToggleKpi}
          title="Xem tóm tắt KPI nhân viên"
        >
          <FiSliders size={13} />
          <span>KPI</span>
        </button>

        {/* Nút mở Filter Drawer với badge */}
        <button
          type="button"
          className="btn-mobile-action btn-mobile-filter"
          onClick={onOpenFilterDrawer}
          title="Mở bộ lọc chu kỳ & thời gian"
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
          disabled={isLoading}
          title="Làm mới dữ liệu từ máy chủ"
        >
          <FiRefreshCw size={13} className={isLoading ? "spin" : ""} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKpiNvSxMobileHeader);
