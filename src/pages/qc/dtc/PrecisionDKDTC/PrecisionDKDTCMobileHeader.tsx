// PrecisionDKDTCMobileHeader.tsx - Mobile Header tinh gọn cho module Đăng Ký Test ĐTC (DKDTC)

import React from "react";
import { IoFlaskOutline, IoRefreshOutline, IoBarChartOutline } from "react-icons/io5";

interface PrecisionDKDTCMobileHeaderProps {
  totalCount: number;
  filteredCount: number;
  checkNVL: boolean;
  showKpi: boolean;
  onToggleKpi: () => void;
  onReload: () => void;
}

const PrecisionDKDTCMobileHeader: React.FC<PrecisionDKDTCMobileHeaderProps> = ({
  totalCount,
  filteredCount,
  checkNVL,
  showKpi,
  onToggleKpi,
  onReload,
}) => {
  return (
    <div className="precision-dkdtc__mobileHeader" data-purpose="mobile-header">
      <div className="mobile-header-brand">
        <div className="brand-icon">
          <IoFlaskOutline size={16} />
        </div>
        <div className="brand-text">
          <div className="brand-title">
            <span>ĐKÝ TEST ĐTC</span>
            <span className="brand-badge">Q041</span>
            <span
              className={`brand-mode-badge ${
                checkNVL ? "brand-mode-badge--nvl" : "brand-mode-badge--sp"
              }`}
            >
              {checkNVL ? "IQC" : "PQC"}
            </span>
          </div>
          <div className="brand-meta">
            <span className="live-dot" />
            <span>LIVE</span>
            <span className="divider">•</span>
            <span>
              {filteredCount.toLocaleString("vi-VN")} /{" "}
              {totalCount.toLocaleString("vi-VN")} dòng
            </span>
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

        {/* Nút nạp lại dữ liệu bảng */}
        <button
          type="button"
          className="btn-header-action"
          onClick={onReload}
          title="Nạp lại danh sách đăng ký DTC"
        >
          <IoRefreshOutline size={16} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDKDTCMobileHeader);
