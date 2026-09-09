import React from "react";
import { DiemDanhLichSuData } from "../../interfaces/nhansuInterface";

interface PrecisionLichSuKpiProps {
  data: DiemDanhLichSuData[];
  timelineHoursTotal?: number;
}

export const PrecisionLichSuKpi: React.FC<PrecisionLichSuKpiProps> = ({
  data,
  timelineHoursTotal,
}) => {
  // 1. Tổng ngày làm việc (ON_OFF === 1)
  const workDaysCount = data.filter((item) => item.ON_OFF === 1).length;

  // 2. Tổng giờ tích lũy (giờ hành chính hoặc từ timeline)
  const totalWorkingMinutes = data.reduce(
    (total, item) => total + (item.WORKING_MINUTES || 0),
    0
  );
  const totalWorkingHours =
    timelineHoursTotal !== undefined && timelineHoursTotal > 0
      ? timelineHoursTotal
      : Math.round((totalWorkingMinutes / 60) * 10) / 10;

  // 3. Tăng ca OT (FINAL_OVERTIMES / 60)
  const totalOtMinutes = data.reduce(
    (total, item) => total + (item.FINAL_OVERTIMES || 0),
    0
  );
  const totalOtHours = Math.round((totalOtMinutes / 60) * 10) / 10;

  // 4. Nghỉ phép / Nghỉ tuần (ON_OFF === 0 hoặc Chủ nhật)
  const offDaysCount = data.filter(
    (item) => item.ON_OFF === 0 || item.WEEKDAY === "Sunday"
  ).length;

  return (
    <div className="precision-lichsu__kpiGrid">
      {/* KPI 1: Ngày làm việc */}
      <div className="precision-lichsu__kpiCard">
        <div className="kpi-info">
          <span className="kpi-label">Tổng ngày làm việc</span>
          <div className="kpi-value-row">
            <span className="kpi-value kpi-value--blue">
              {String(workDaysCount).padStart(2, "0")}
            </span>
            <span className="kpi-subtext">ngày (Ca 480p)</span>
          </div>
        </div>
        <div className="kpi-icon-box kpi-icon-box--blue">
          <span className="material-symbols-outlined">event_available</span>
        </div>
      </div>

      {/* KPI 2: Giờ tích lũy */}
      <div className="precision-lichsu__kpiCard">
        <div className="kpi-info">
          <span className="kpi-label">Tổng giờ tích lũy</span>
          <div className="kpi-value-row">
            <span className="kpi-value kpi-value--green">
              {totalWorkingHours.toFixed(1)}
            </span>
            <span className="kpi-subtext">giờ thực tế</span>
          </div>
        </div>
        <div className="kpi-icon-box kpi-icon-box--green">
          <span className="material-symbols-outlined">schedule</span>
        </div>
      </div>

      {/* KPI 3: Tăng ca OT */}
      <div className="precision-lichsu__kpiCard">
        <div className="kpi-info">
          <span className="kpi-label">Tăng ca (OT)</span>
          <div className="kpi-value-row">
            <span className="kpi-value kpi-value--purple">
              {totalOtHours.toFixed(1)}
            </span>
            <span className="kpi-subtext">giờ lũy kế</span>
          </div>
        </div>
        <div className="kpi-icon-box kpi-icon-box--purple">
          <span className="material-symbols-outlined">more_time</span>
        </div>
      </div>

      {/* KPI 4: Nghỉ phép / Nghỉ tuần */}
      <div className="precision-lichsu__kpiCard">
        <div className="kpi-info">
          <span className="kpi-label">Nghỉ phép / Nghỉ tuần</span>
          <div className="kpi-value-row">
            <span className="kpi-value kpi-value--amber">
              {String(offDaysCount).padStart(2, "0")}
            </span>
            <span className="kpi-subtext">ngày nghỉ</span>
          </div>
        </div>
        <div className="kpi-icon-box kpi-icon-box--amber">
          <span className="material-symbols-outlined">free_cancellation</span>
        </div>
      </div>
    </div>
  );
};

export default PrecisionLichSuKpi;
