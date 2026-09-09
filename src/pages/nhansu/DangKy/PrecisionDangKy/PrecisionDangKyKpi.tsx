import React from "react";

interface PrecisionDangKyKpiProps {
  annualLeaveRemaining?: number;
  annualLeaveTotal?: number;
  monthlyOtHours?: number;
  monthlyOtMax?: number;
  pendingAttConfirmCount?: number;
}

export const PrecisionDangKyKpi: React.FC<PrecisionDangKyKpiProps> = ({
  annualLeaveRemaining = 10,
  annualLeaveTotal = 12,
  monthlyOtHours = 28.0,
  monthlyOtMax = 40.0,
  pendingAttConfirmCount = 1,
}) => {
  const leavePercent = Math.min(100, Math.round((annualLeaveRemaining / (annualLeaveTotal || 1)) * 100));
  const otPercent = Math.min(100, Math.round((monthlyOtHours / (monthlyOtMax || 1)) * 100));

  return (
    <div className="precision-dangky__kpis">
      {/* Card 1: Quỹ phép năm */}
      <div className="kpi-card kpi-card--leave">
        <div className="kpi-icon">
          <span className="material-symbols-outlined">calendar_month</span>
        </div>
        <div className="kpi-content">
          <span className="label">Quỹ phép năm 2026</span>
          <div className="metrics">
            <span className="main-num">{annualLeaveRemaining}</span>
            <span className="sub-num">/ {annualLeaveTotal} ngày còn</span>
          </div>
          <div className="kpi-progress">
            <div className="fill" style={{ width: `${leavePercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Card 2: OT Lũy kế tháng */}
      <div className="kpi-card kpi-card--ot">
        <div className="kpi-icon">
          <span className="material-symbols-outlined">more_time</span>
        </div>
        <div className="kpi-content">
          <span className="label">OT lũy kế tháng này</span>
          <div className="metrics">
            <span className="main-num">{monthlyOtHours.toFixed(1)}</span>
            <span className="sub-num">/ {monthlyOtMax.toFixed(1)}h định mức</span>
          </div>
          <div className="kpi-progress">
            <div className="fill" style={{ width: `${otPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Card 3: Giải trình công */}
      <div className="kpi-card kpi-card--att">
        <div className="kpi-icon">
          <span className="material-symbols-outlined">rule_folder</span>
        </div>
        <div className="kpi-content">
          <span className="label">Giải trình công</span>
          <div className="metrics">
            <span className="main-num">{pendingAttConfirmCount.toString().padStart(2, "0")}</span>
            <span className="sub-num">lần cần duyệt</span>
          </div>
          <div className="kpi-progress">
            <div className="fill" style={{ width: `${pendingAttConfirmCount > 0 ? 100 : 0}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDangKyKpi);
