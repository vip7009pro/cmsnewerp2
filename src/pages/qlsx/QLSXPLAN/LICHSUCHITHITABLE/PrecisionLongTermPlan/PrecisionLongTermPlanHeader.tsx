import React from "react";
import { FiCalendar, FiCpu, FiLayers, FiRefreshCw } from "react-icons/fi";

interface PrecisionLongTermPlanHeaderProps {
  fromDate: string;
  totalPlans: number;
  selectedMachine: string;
  isLoading: boolean;
  onReload: () => void;
}

const PrecisionLongTermPlanHeader: React.FC<PrecisionLongTermPlanHeaderProps> = ({
  fromDate,
  totalPlans,
  selectedMachine,
  isLoading,
  onReload,
}) => {
  return (
    <div className="precision-longterm-header">
      <div className="precision-longterm-header__left">
        <span className="precision-longterm-header__badge-brand">QLSX PRECISION</span>
        <div className="precision-longterm-header__breadcrumb">
          <span>Kế Hoạch</span>
          <span className="sep">/</span>
          <span>Lịch Sử Chỉ Thị</span>
          <span className="sep">/</span>
          <span className="active">Kế Hoạch Dài Hạn (16 Ngày)</span>
        </div>
      </div>

      <div className="precision-longterm-header__right">
        {/* Telemetry Status */}
        <div className="precision-longterm-header__telemetry">
          <span className="pulse-dot" />
          <span>Realtime Synchronized</span>
        </div>

        {/* Thống kê nhanh */}
        <div className="precision-longterm-header__meta-item">
          <FiCalendar size={12} color="#2563eb" />
          <span>Ngày:</span>
          <strong>{fromDate}</strong>
        </div>

        <div className="precision-longterm-header__meta-item">
          <FiLayers size={12} color="#059669" />
          <span>Tổng Lệnh:</span>
          <strong>{totalPlans.toLocaleString("en-US")}</strong>
        </div>

        <div className="precision-longterm-header__meta-item">
          <FiCpu size={12} color="#d97706" />
          <span>Thiết Bị:</span>
          <strong>{selectedMachine}</strong>
        </div>

        <button
          type="button"
          className="btn-action"
          style={{ height: 24, padding: "0 8px", backgroundColor: "#ffffff" }}
          onClick={onReload}
          title="Tải lại toàn bộ dữ liệu"
        >
          <FiRefreshCw size={11} className={isLoading ? "spin-animation" : ""} />
          <span>Làm mới</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionLongTermPlanHeader);
