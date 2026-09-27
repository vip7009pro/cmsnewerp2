// PrecisionIncomingMobileKpi.tsx - Collapsible Micro-KPI strip (horizontal scroll, mobile only)
import React from "react";
import { FiX } from "react-icons/fi";

interface PrecisionIncomingMobileKpiProps {
  totalLots: number;
  passRate: string;
  dtcTestCount: number;
  holdingCount: number;
  onClose: () => void;
}

export const PrecisionIncomingMobileKpi: React.FC<PrecisionIncomingMobileKpiProps> = ({
  totalLots,
  passRate,
  dtcTestCount,
  holdingCount,
  onClose,
}) => {
  return (
    <div className="precision-incoming-mobile-kpi">
      <div className="kpi-scroll">
        <div className="kpi-chip kpi-chip--blue">
          <span className="kpi-chip__label">Tổng lô hôm nay</span>
          <span className="kpi-chip__value">
            {totalLots} <em>Lô</em>
          </span>
        </div>

        <div className="kpi-chip kpi-chip--green">
          <span className="kpi-chip__label">IQC Pass Rate</span>
          <span className="kpi-chip__value">
            {passRate}% <em>Đạt</em>
          </span>
        </div>

        <div className="kpi-chip kpi-chip--amber">
          <span className="kpi-chip__label">Đang test ĐTC</span>
          <span className="kpi-chip__value">
            {dtcTestCount} <em>Chỉ tiêu</em>
          </span>
        </div>

        <div className={`kpi-chip ${holdingCount > 0 ? "kpi-chip--red" : "kpi-chip--slate"}`}>
          <span className="kpi-chip__label">Nghi vấn / Hold</span>
          <span className="kpi-chip__value">
            {holdingCount} <em>Lô</em>
          </span>
        </div>
      </div>

      <button type="button" className="kpi-close" onClick={onClose} title="Ẩn KPI để mở rộng bảng dữ liệu">
        <FiX size={13} />
      </button>
    </div>
  );
};

export default PrecisionIncomingMobileKpi;
