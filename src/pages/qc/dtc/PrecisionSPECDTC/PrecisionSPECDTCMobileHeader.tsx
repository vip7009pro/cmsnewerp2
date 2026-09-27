// PrecisionSPECDTCMobileHeader.tsx - Mobile Header tinh gọn cho module Tiêu Chuẩn Kỹ Thuật ĐTC (SPECDTC)

import React from "react";
import { FiSliders, FiBarChart2, FiFilter, FiRefreshCw } from "react-icons/fi";

interface PrecisionSPECDTCMobileHeaderProps {
  totalCount: number;
  filteredCount: number;
  showKpi: boolean;
  onToggleKpi: () => void;
  onOpenFilterDrawer: () => void;
  onReload: () => void;
  activeFilterCount: number;
}

const PrecisionSPECDTCMobileHeader: React.FC<PrecisionSPECDTCMobileHeaderProps> = ({
  totalCount,
  filteredCount,
  showKpi,
  onToggleKpi,
  onOpenFilterDrawer,
  onReload,
  activeFilterCount,
}) => {
  return (
    <div className="precision-specdtc__mobileHeader" data-purpose="mobile-header">
      <div className="mobile-header-top">
        <div className="mobile-header-brand">
          <div className="brand-icon">
            <FiSliders size={16} />
          </div>
          <div className="brand-text">
            <div className="brand-title">
              <span>TIÊU CHUẨN ĐTC</span>
              <span className="brand-badge">Q041</span>
              <span className="brand-mode-badge brand-mode-badge--spec">SPEC</span>
            </div>
            <div className="brand-meta">
              <span className="live-dot" />
              <span>LIVE</span>
              <span className="divider">•</span>
              <span>
                {filteredCount.toLocaleString("vi-VN")} / {totalCount.toLocaleString("vi-VN")} dòng
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

          {/* Nút Reload */}
          <button
            type="button"
            className="btn-header-action"
            onClick={onReload}
            title="Tải lại dữ liệu tiêu chuẩn SPEC DTC"
          >
            <FiRefreshCw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionSPECDTCMobileHeader);
