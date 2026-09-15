import React from "react";
import { FiAlertTriangle, FiCheckCircle, FiLayers, FiShield } from "react-icons/fi";
import { PatrolKpiStats } from "./usePatrolData";

interface PrecisionPatrolKpiProps {
  kpis: PatrolKpiStats;
}

export const PrecisionPatrolKpi: React.FC<PrecisionPatrolKpiProps> = ({ kpis }) => {
  return (
    <div className="precision-patrol-kpi">
      {/* 1. Tổng sự cố */}
      <div className="precision-patrol-kpi__card card-total">
        <div className="kpi-content">
          <span className="kpi-label">Tổng Sự Cố Phát Sinh</span>
          <span className="kpi-value">{kpis.totalIncidents.toLocaleString()}</span>
          <span className="kpi-subtext">Sự cố toàn bộ các trạm</span>
        </div>
        <div className="kpi-icon">
          <FiAlertTriangle size={15} />
        </div>
      </div>

      {/* 2. PQC3 Lỗi công đoạn */}
      <div className="precision-patrol-kpi__card card-pqc">
        <div className="kpi-content">
          <span className="kpi-label">Lỗi Công Đoạn PQC3</span>
          <span className="kpi-value">{kpis.pqcCount.toLocaleString()}</span>
          <span className="kpi-subtext">Sản xuất phát sinh</span>
        </div>
        <div className="kpi-icon">
          <FiLayers size={15} />
        </div>
      </div>

      {/* 3. DTC Độ tin cậy */}
      <div className="precision-patrol-kpi__card card-dtc">
        <div className="kpi-content">
          <span className="kpi-label">Thử Nghiệm Độ Tin Cậy (DTC)</span>
          <span className="kpi-value">{kpis.dtcCount.toLocaleString()}</span>
          <span className="kpi-subtext">Lô mẫu đo test ĐTC</span>
        </div>
        <div className="kpi-icon">
          <FiShield size={15} />
        </div>
      </div>

      {/* 4. INS Patrol */}
      <div className="precision-patrol-kpi__card card-ins">
        <div className="kpi-content">
          <span className="kpi-label">Kiểm Tra Ngoại Quan (INS)</span>
          <span className="kpi-value">{kpis.insCount.toLocaleString()}</span>
          <span className="kpi-subtext">Lô NVL & Phụ kiện lỗi</span>
        </div>
        <div className="kpi-icon">
          <FiCheckCircle size={15} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPatrolKpi);
