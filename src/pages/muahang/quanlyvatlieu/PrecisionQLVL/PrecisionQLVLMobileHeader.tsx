import React from "react";
import { FiPackage, FiBarChart2, FiFilter, FiRefreshCw } from "react-icons/fi";

interface PrecisionQLVLMobileHeaderProps {
  totalCount: number;
  filteredCount: number;
  showKpi: boolean;
  onToggleKpi: () => void;
  onOpenFilterDrawer: () => void;
  onReload: () => void;
  activeFilterCount: number;
}

const PrecisionQLVLMobileHeader: React.FC<PrecisionQLVLMobileHeaderProps> = ({
  totalCount,
  filteredCount,
  showKpi,
  onToggleKpi,
  onOpenFilterDrawer,
  onReload,
  activeFilterCount,
}) => {
  return (
    <div className="precision-qlvl__mobileHeader">
      <div className="mobile-header-top">
        <div className="mobile-header-brand">
          <div className="brand-icon">
            <FiPackage size={16} />
          </div>
          <div className="brand-text">
            <div className="brand-title">
              <span>QUẢN LÝ VẬT LIỆU</span>
              <span className="brand-badge">QLVL</span>
            </div>
            <div className="brand-meta">
              <span className="live-dot" />
              <span>LIVE</span>
              <span className="divider">•</span>
              <span>
                {filteredCount.toLocaleString("en-US")} / {totalCount.toLocaleString("en-US")} mã
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
            title="Mở bộ lọc nâng cao"
          >
            <FiFilter size={15} />
            {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
          </button>

          {/* Nút Reload nạp dữ liệu */}
          <button
            type="button"
            className="btn-header-action"
            onClick={onReload}
            title="Tải lại toàn bộ dữ liệu vật liệu"
          >
            <FiRefreshCw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionQLVLMobileHeader);
