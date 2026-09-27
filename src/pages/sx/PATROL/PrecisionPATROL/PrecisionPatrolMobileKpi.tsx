import React from "react";
import { FiAlertTriangle, FiLayers, FiShield, FiCheckCircle, FiX } from "react-icons/fi";
import { PatrolKpiStats, PatrolFilterLane } from "./usePatrolData";

interface PrecisionPatrolMobileKpiProps {
  kpis: PatrolKpiStats;
  currentFilterLane: PatrolFilterLane;
  onSelectLane: (lane: PatrolFilterLane) => void;
  onClose: () => void;
}

export const PrecisionPatrolMobileKpi: React.FC<PrecisionPatrolMobileKpiProps> = ({
  kpis,
  currentFilterLane,
  onSelectLane,
  onClose,
}) => {
  return (
    <div className="precision-patrol-mobile-kpi-container">
      <div className="mobile-kpi-scroll">
        {/* Thẻ Tất Cả */}
        <div
          className={`mobile-kpi-chip chip-total ${currentFilterLane === "ALL" ? "selected" : ""}`}
          onClick={() => onSelectLane("ALL")}
          title="Chạm để lọc tất cả sự cố"
        >
          <div className="chip-icon">
            <FiAlertTriangle size={13} />
          </div>
          <div className="chip-body">
            <span className="chip-label">TỔNG SỰ CỐ</span>
            <span className="chip-value">{kpis.totalIncidents}</span>
          </div>
        </div>

        {/* Thẻ PQC3 */}
        <div
          className={`mobile-kpi-chip chip-pqc ${currentFilterLane === "PQC3" ? "selected" : ""}`}
          onClick={() => onSelectLane("PQC3")}
          title="Chạm để lọc chỉ lỗi PQC3"
        >
          <div className="chip-icon">
            <FiLayers size={13} />
          </div>
          <div className="chip-body">
            <span className="chip-label">LỖI PQC3</span>
            <span className="chip-value">{kpis.pqcCount}</span>
          </div>
        </div>

        {/* Thẻ DTC */}
        <div
          className={`mobile-kpi-chip chip-dtc ${currentFilterLane === "DTC" ? "selected" : ""}`}
          onClick={() => onSelectLane("DTC")}
          title="Chạm để lọc chỉ thử nghiệm DTC"
        >
          <div className="chip-icon">
            <FiShield size={13} />
          </div>
          <div className="chip-body">
            <span className="chip-label">ĐỘ TIN CẬY DTC</span>
            <span className="chip-value">{kpis.dtcCount}</span>
          </div>
        </div>

        {/* Thẻ INS */}
        <div
          className={`mobile-kpi-chip chip-ins ${currentFilterLane === "INS" ? "selected" : ""}`}
          onClick={() => onSelectLane("INS")}
          title="Chạm để lọc kiểm tra INS"
        >
          <div className="chip-icon">
            <FiCheckCircle size={13} />
          </div>
          <div className="chip-body">
            <span className="chip-label">NGOẠI QUAN INS</span>
            <span className="chip-value">{kpis.insCount}</span>
          </div>
        </div>
      </div>

      {/* Nút đóng KPI nhanh */}
      <button
        type="button"
        className="btn-close-kpi"
        onClick={onClose}
        title="Đóng dải KPI để mở rộng không gian"
      >
        <FiX size={14} />
      </button>
    </div>
  );
};

export default React.memo(PrecisionPatrolMobileKpi);
