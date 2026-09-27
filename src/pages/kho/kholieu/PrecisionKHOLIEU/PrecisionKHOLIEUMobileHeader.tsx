// PrecisionKHOLIEUMobileHeader.tsx - Mobile Header tinh gọn cho Kho Liệu

import React from "react";
import { FiPackage, FiBarChart2, FiFilter, FiRefreshCw } from "react-icons/fi";

interface PrecisionKHOLIEUMobileHeaderProps {
  mode: "NHAP" | "XUAT" | "TON";
  totalCount: number;
  filteredCount: number;
  showKpi: boolean;
  onToggleKpi: () => void;
  onOpenFilterDrawer: () => void;
  onReload: () => void;
  activeFilterCount: number;
}

const PrecisionKHOLIEUMobileHeader: React.FC<PrecisionKHOLIEUMobileHeaderProps> = ({
  mode,
  totalCount,
  filteredCount,
  showKpi,
  onToggleKpi,
  onOpenFilterDrawer,
  onReload,
  activeFilterCount,
}) => {
  const getModeLabel = () => {
    switch (mode) {
      case "NHAP":
        return "NHẬP LIỆU";
      case "XUAT":
        return "XUẤT LIỆU";
      case "TON":
        return "TỒN KHO";
      default:
        return mode;
    }
  };

  return (
    <div className="precision-kholieu__mobileHeader">
      <div className="mobile-header-top">
        <div className="mobile-header-brand">
          <div className="brand-icon">
            <FiPackage size={16} />
          </div>
          <div className="brand-text">
            <div className="brand-title">
              <span>KHO LIỆU</span>
              <span className="brand-badge">W10</span>
              <span className={`brand-mode-badge brand-mode-badge--${mode.toLowerCase()}`}>
                {getModeLabel()}
              </span>
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
            title="Tải lại dữ liệu kho"
          >
            <FiRefreshCw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKHOLIEUMobileHeader);
