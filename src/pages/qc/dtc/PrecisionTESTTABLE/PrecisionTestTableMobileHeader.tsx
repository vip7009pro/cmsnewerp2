// PrecisionTestTableMobileHeader.tsx
// Mobile Header tinh gọn cho module Danh Mục Hạng Mục & Điểm Đo ĐTC (TEST_TABLE)

import React from "react";
import {
  IoOptionsOutline,
  IoRefreshOutline,
  IoBarChartOutline,
} from "react-icons/io5";

interface PrecisionTestTableMobileHeaderProps {
  totalItems: number;
  filteredItems: number;
  totalPoints: number;
  showKpi: boolean;
  onToggleKpi: () => void;
  onReload: () => void;
}

const PrecisionTestTableMobileHeader: React.FC<
  PrecisionTestTableMobileHeaderProps
> = ({
  totalItems,
  filteredItems,
  totalPoints,
  showKpi,
  onToggleKpi,
  onReload,
}) => {
  return (
    <div
      className="precision-testtable__mobileHeader"
      data-purpose="mobile-header"
    >
      <div className="mobile-header-brand">
        <div className="brand-icon">
          <IoOptionsOutline size={16} />
        </div>
        <div className="brand-text">
          <div className="brand-title">
            <span>TEST TABLE</span>
            <span className="brand-badge">Q041</span>
            <span className="brand-mode-badge">MASTER</span>
          </div>
          <div className="brand-meta">
            <span className="live-dot" />
            <span>LIVE</span>
            <span className="divider">•</span>
            <span>{filteredItems.toLocaleString("vi-VN")}/{totalItems.toLocaleString("vi-VN")} HM</span>
            <span className="divider">•</span>
            <span>{totalPoints.toLocaleString("vi-VN")} điểm đo</span>
          </div>
        </div>
      </div>

      <div className="mobile-header-actions">
        {/* Nút bật/tắt Micro-KPI compact */}
        <button
          type="button"
          className={`btn-header-action ${showKpi ? "active" : ""}`}
          onClick={onToggleKpi}
          title={showKpi ? "Ẩn tóm tắt KPI" : "Hiện tóm tắt KPI"}
        >
          <IoBarChartOutline size={16} />
        </button>

        {/* Nút nạp lại toàn bộ danh mục */}
        <button
          type="button"
          className="btn-header-action"
          onClick={onReload}
          title="Nạp lại danh mục hạng mục và điểm đo"
        >
          <IoRefreshOutline size={16} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionTestTableMobileHeader);
