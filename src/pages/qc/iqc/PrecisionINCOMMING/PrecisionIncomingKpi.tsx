// PrecisionIncomingKpi.tsx - 4 Micro-KPI cards realtime
import React from "react";

interface PrecisionIncomingKpiProps {
  totalLots: number;
  passRate: string;
  dtcTestCount: number;
  holdingCount: number;
}

export const PrecisionIncomingKpi: React.FC<PrecisionIncomingKpiProps> = ({
  totalLots,
  passRate,
  dtcTestCount,
  holdingCount,
}) => {
  return (
    <div className="precision-incoming__kpi-banner">
      <div className="precision-incoming__kpi-card">
        <div className="kpi-info">
          <span className="kpi-title">Tổng Lô Incoming Hôm Nay</span>
          <div className="kpi-value">
            {totalLots} <span className="unit">Lô NVL</span>
          </div>
        </div>
        <span className="kpi-badge kpi-badge--blue">100% On-Time</span>
      </div>

      <div className="precision-incoming__kpi-card">
        <div className="kpi-info">
          <span className="kpi-title">IQC Pass Rate (Đạt Spec)</span>
          <div className="kpi-value" style={{ color: "#059669" }}>
            {passRate}% <span className="unit">Tỷ lệ đạt</span>
          </div>
        </div>
        <span className="kpi-badge kpi-badge--success">Standard OK</span>
      </div>

      <div className="precision-incoming__kpi-card">
        <div className="kpi-info">
          <span className="kpi-title">Đang Test Độ Tin Cậy (ĐTC)</span>
          <div className="kpi-value" style={{ color: "#d97706" }}>
            {dtcTestCount} <span className="unit">Chỉ tiêu cơ lý</span>
          </div>
        </div>
        <span className="kpi-badge kpi-badge--warning">Kiểm tra kéo keo</span>
      </div>

      <div className="precision-incoming__kpi-card">
        <div className="kpi-info">
          <span className="kpi-title">Lô Nghi Vấn / Holding NCR</span>
          <div className="kpi-value" style={{ color: holdingCount > 0 ? "#e11d48" : "#475569" }}>
            {holdingCount} <span className="unit">Lô cảnh báo</span>
          </div>
        </div>
        <span className={`kpi-badge ${holdingCount > 0 ? "kpi-badge--danger" : "kpi-badge--blue"}`}>
          {holdingCount > 0 ? `${holdingCount} Hold/NCR` : "NCR Zero Alert"}
        </span>
      </div>
    </div>
  );
};
