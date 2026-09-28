import React from "react";
import {
  AiOutlineFileText,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineWarning,
} from "react-icons/ai";

interface PrecisionNCRMobileKpiProps {
  kpiStats: {
    total: number;
    completed: number;
    completedPercent: string;
    pending: number;
    totalRollHold: number;
    totalMHold: number;
  };
}

export const PrecisionNCRMobileKpi: React.FC<PrecisionNCRMobileKpiProps> = ({
  kpiStats,
}) => {
  return (
    <div className="precision-ncr-mobile-kpi">
      <div className="mobile-kpi-chip primary">
        <AiOutlineFileText size={12} />
        <span className="mobile-kpi-chip__label">Tổng</span>
        <span className="mobile-kpi-chip__value">{kpiStats.total}</span>
      </div>
      <div className="mobile-kpi-chip success">
        <AiOutlineCheckCircle size={12} />
        <span className="mobile-kpi-chip__label">Đóng</span>
        <span className="mobile-kpi-chip__value">{kpiStats.completed}</span>
        <span className="mobile-kpi-chip__badge">{kpiStats.completedPercent}%</span>
      </div>
      <div className="mobile-kpi-chip warning">
        <AiOutlineClockCircle size={12} />
        <span className="mobile-kpi-chip__label">Pending</span>
        <span className="mobile-kpi-chip__value">{kpiStats.pending}</span>
      </div>
      <div className="mobile-kpi-chip danger">
        <AiOutlineWarning size={12} />
        <span className="mobile-kpi-chip__label">Hold</span>
        <span className="mobile-kpi-chip__value">
          {kpiStats.totalRollHold}R / {kpiStats.totalMHold}m
        </span>
      </div>
    </div>
  );
};
