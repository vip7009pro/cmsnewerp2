// PrecisionKQDTCMobileHeader.tsx - Mobile Header tinh gọn cho module Kiểm Tra Độ Tin Cậy (DTC)

import React from "react";
import { FiActivity, FiBarChart2, FiFilter, FiRefreshCw, FiPieChart } from "react-icons/fi";

interface PrecisionKQDTCMobileHeaderProps {
  totalCount: number;
  filteredCount: number;
  showKpi: boolean;
  onToggleKpi: () => void;
  onOpenFilterDrawer: () => void;
  onOpenChartsModal: () => void;
  hasSelectedChart: boolean;
  onReload: () => void;
  activeFilterCount: number;
}

const PrecisionKQDTCMobileHeader: React.FC<PrecisionKQDTCMobileHeaderProps> = ({
  totalCount,
  filteredCount,
  showKpi,
  onToggleKpi,
  onOpenFilterDrawer,
  onOpenChartsModal,
  hasSelectedChart,
  onReload,
  activeFilterCount,
}) => {
  return (
    <div className="precision-kqdtc__mobileHeader" data-purpose="mobile-header">
      <div className="mobile-header-top">
        <div className="mobile-header-brand">
          <div className="brand-icon">
            <FiActivity size={16} />
          </div>
          <div className="brand-text">
            <div className="brand-title">
              <span>KẾT QUẢ ĐTC</span>
              <span className="brand-badge">Q040</span>
              <span className="brand-mode-badge brand-mode-badge--spc">SPC</span>
            </div>
            <div className="brand-meta">
              <span className="live-dot" />
              <span>LIVE</span>
              <span className="divider">•</span>
              <span>
                {filteredCount.toLocaleString("en-US")} / {totalCount.toLocaleString("en-US")} mẫu
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

          {/* Nút mở Modal Biểu Đồ SPC */}
          <button
            type="button"
            className={`btn-header-action ${hasSelectedChart ? "active active--spc" : ""}`}
            onClick={onOpenChartsModal}
            title="Xem biểu đồ SPC (Histogram, Xbar, R, Cpk)"
          >
            <FiPieChart size={15} />
            <span>SPC</span>
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

          {/* Nút Reload */}
          <button
            type="button"
            className="btn-header-action"
            onClick={onReload}
            title="Tải lại dữ liệu ĐTC"
          >
            <FiRefreshCw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKQDTCMobileHeader);
