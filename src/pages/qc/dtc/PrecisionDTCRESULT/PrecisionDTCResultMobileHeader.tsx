// PrecisionDTCResultMobileHeader.tsx - Mobile Header tinh gọn cho module Nhập KQ ĐTC (DTCRESULT)
// Mobile bỏ Sub-Header banner / breadcrumb / telemetry rườm rà của desktop:
// chỉ giữ brand + đếm dòng (đã lọc / tổng) + các nút bật/tắt KPI, mở Phiếu Nhập, Reload.

import React from "react";
import {
  IoPulseOutline,
  IoBarChartOutline,
  IoCreateOutline,
  IoRefreshOutline,
} from "react-icons/io5";

interface PrecisionDTCResultMobileHeaderProps {
  totalCount: number;
  filteredCount: number;
  showKpi: boolean;
  onToggleKpi: () => void;
  onOpenRecordSheet: () => void;
  hasContext: boolean;
  activeTestName?: string;
  onReload: () => void;
}

const PrecisionDTCResultMobileHeader: React.FC<PrecisionDTCResultMobileHeaderProps> = ({
  totalCount,
  filteredCount,
  showKpi,
  onToggleKpi,
  onOpenRecordSheet,
  hasContext,
  activeTestName,
  onReload,
}) => {
  return (
    <div className="precision-dtcresult__mobileHeader" data-purpose="mobile-header">
      <div className="mobile-header-top">
        <div className="mobile-header-brand">
          <div className="brand-icon">
            <IoPulseOutline size={16} />
          </div>
          <div className="brand-text">
            {/* Tên module chỉ 1 dòng để không bị badge bóp hẹp ở viewport 320px */}
            <div className="brand-title">
              <span>NHẬP KQ ĐTC</span>
            </div>
            {/* Dòng meta: số dòng đã lọc / tổng + hạng mục test đang chọn */}
            <div className="brand-meta">
              <span className="live-dot" />
              <span>
                {filteredCount.toLocaleString("en-US")} /{" "}
                {totalCount.toLocaleString("en-US")} điểm đo
              </span>
              {activeTestName && (
                <span className="brand-mode-badge">{activeTestName}</span>
              )}
            </div>
          </div>
        </div>

        <div className="mobile-header-actions">
          {/* Nút bật/tắt micro-KPI (ẩn mặc định để nhường chỗ cho bảng) */}
          <button
            type="button"
            className={`btn-header-action ${showKpi ? "active" : ""}`}
            onClick={onToggleKpi}
            title={showKpi ? "Ẩn tóm tắt KPI" : "Hiện tóm tắt KPI"}
          >
            <IoBarChartOutline size={15} />
            <span className="btn-label">KPI</span>
          </button>

          {/* Nút mở Bottom Sheet "Phiếu Nhập Kết Quả" (ID TEST / LOT NVL / Remark / XRF) */}
          <button
            type="button"
            className={`btn-header-action btn-header-action--primary ${
              hasContext ? "active" : ""
            }`}
            onClick={onOpenRecordSheet}
            title="Mở phiếu nhập kết quả đo"
          >
            <IoCreateOutline size={15} />
            <span className="btn-label">Phiếu</span>
          </button>

          {/* Reload dữ liệu điểm đo */}
          <button
            type="button"
            className="btn-header-action"
            onClick={onReload}
            title="Tải lại spec và điểm đo"
          >
            <IoRefreshOutline size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDTCResultMobileHeader);
