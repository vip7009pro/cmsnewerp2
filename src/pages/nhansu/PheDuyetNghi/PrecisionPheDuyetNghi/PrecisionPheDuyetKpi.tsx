import React from "react";

interface PrecisionPheDuyetKpiProps {
  totalCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export const PrecisionPheDuyetKpi: React.FC<PrecisionPheDuyetKpiProps> = ({
  totalCount,
  pendingCount,
  approvedCount,
  rejectedCount,
}) => {
  return (
    <div className="precision-pheduyet__kpis">
      {/* Card 1: Tổng đơn */}
      <div className="kpi-card kpi-card--total">
        <div className="kpi-info">
          <span className="label">Tổng đơn trong kỳ</span>
          <div className="metrics">
            <span className="main-num">{totalCount}</span>
            <span className="unit">Đơn</span>
          </div>
        </div>
        <div className="kpi-icon">
          <span className="material-symbols-outlined">inbox</span>
        </div>
      </div>

      {/* Card 2: Chờ phê duyệt */}
      <div className="kpi-card kpi-card--pending">
        <div className="kpi-info">
          <span className="label" style={{ color: "#b45309" }}>Chờ phê duyệt (Pending)</span>
          <div className="metrics">
            <span className="main-num" style={{ color: "#b45309" }}>
              {pendingCount.toString().padStart(2, "0")}
            </span>
            <span className="unit" style={{ color: "#d97706" }}>Đơn</span>
          </div>
          {pendingCount > 0 && (
            <span className="kpi-badge kpi-badge--pending">
              Cần xử lý trước 16:30
            </span>
          )}
        </div>
        <div className="kpi-icon">
          <span className="material-symbols-outlined">hourglass_top</span>
        </div>
      </div>

      {/* Card 3: Đã phê duyệt */}
      <div className="kpi-card kpi-card--approved">
        <div className="kpi-info">
          <span className="label" style={{ color: "#047857" }}>Đã phê duyệt (Approved)</span>
          <div className="metrics">
            <span className="main-num" style={{ color: "#047857" }}>
              {approvedCount.toString().padStart(2, "0")}
            </span>
            <span className="unit" style={{ color: "#059669" }}>Đơn</span>
          </div>
        </div>
        <div className="kpi-icon">
          <span className="material-symbols-outlined">verified</span>
        </div>
      </div>

      {/* Card 4: Từ chối / Đã xóa */}
      <div className="kpi-card kpi-card--rejected">
        <div className="kpi-info">
          <span className="label" style={{ color: "#be123c" }}>Từ chối / Đã xóa</span>
          <div className="metrics">
            <span className="main-num" style={{ color: "#be123c" }}>
              {rejectedCount.toString().padStart(2, "0")}
            </span>
            <span className="unit" style={{ color: "#e11d48" }}>Đơn</span>
          </div>
        </div>
        <div className="kpi-icon">
          <span className="material-symbols-outlined">cancel</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPheDuyetKpi);
