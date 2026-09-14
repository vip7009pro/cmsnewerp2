import React from "react";
import { FiCheckCircle, FiLayers, FiActivity, FiAlertTriangle } from "react-icons/fi";

interface PrecisionPQC1KpiProps {
  kpis: {
    total: number;
    dktCount: number;
    cktCount: number;
    totalSample: number;
    avgDefectRate: string;
  };
}

export const PrecisionPQC1Kpi: React.FC<PrecisionPQC1KpiProps> = ({ kpis }) => {
  return (
    <div className="precision-pqc1-kpi">
      {/* KPI 1: Tổng số lô Setting */}
      <div className="kpi-card">
        <div className="kpi-card__info">
          <span className="kpi-card__label">Tổng Lô Setting</span>
          <span className="kpi-card__value">
            {kpis.total.toLocaleString("en-US")}
            <span className="unit">LÔ</span>
          </span>
          <span className="kpi-card__sub">Dữ liệu kiểm tra cài đặt</span>
        </div>
        <div className="kpi-card__icon blue">
          <FiLayers />
        </div>
      </div>

      {/* KPI 2: Độ tin cậy DTC */}
      <div className="kpi-card">
        <div className="kpi-card__info">
          <span className="kpi-card__label">Độ Tin Cậy DTC</span>
          <span className="kpi-card__value">
            {kpis.dktCount.toLocaleString("en-US")}
            <span className="unit">DKT / {kpis.cktCount} CKT</span>
          </span>
          <span className="kpi-card__sub">
            Đã KT: {kpis.total > 0 ? ((kpis.dktCount / kpis.total) * 100).toFixed(0) : 0}%
          </span>
        </div>
        <div className="kpi-card__icon emerald">
          <FiCheckCircle />
        </div>
      </div>

      {/* KPI 3: Tổng sản lượng mẫu kiểm tra */}
      <div className="kpi-card">
        <div className="kpi-card__info">
          <span className="kpi-card__label">Tổng Lượng Mẫu KT</span>
          <span className="kpi-card__value">
            {kpis.totalSample.toLocaleString("en-US")}
            <span className="unit">EA</span>
          </span>
          <span className="kpi-card__sub">Inspect Sample Qty</span>
        </div>
        <div className="kpi-card__icon amber">
          <FiActivity />
        </div>
      </div>

      {/* KPI 4: Tỷ lệ lỗi khuyết tật */}
      <div className="kpi-card">
        <div className="kpi-card__info">
          <span className="kpi-card__label">Tỷ Lệ Lỗi Bình Quân</span>
          <span className="kpi-card__value">
            {kpis.avgDefectRate}
            <span className="unit">%</span>
          </span>
          <span className="kpi-card__sub">PQC Defect Rate</span>
        </div>
        <div className="kpi-card__icon rose">
          <FiAlertTriangle />
        </div>
      </div>
    </div>
  );
};
