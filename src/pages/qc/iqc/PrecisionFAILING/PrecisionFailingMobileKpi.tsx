import React from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiX,
} from "react-icons/fi";

interface PrecisionFailingMobileKpiProps {
  kpiStats: {
    total: number;
    passed: number;
    pending: number;
    passRate: string;
    pendingRate: string;
    totalQty: number;
  };
  onClose: () => void;
}

export const PrecisionFailingMobileKpi: React.FC<PrecisionFailingMobileKpiProps> = ({
  kpiStats,
  onClose,
}) => {
  return (
    <div className="precision-failing-mobile-kpi">
      <div className="mobile-kpi-scroll">
        {/* Card 1: Tổng Lô */}
        <div className="mobile-kpi-card mobile-kpi-card--total">
          <div className="kpi-icon">
            <FiAlertTriangle />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">TỔNG LÔ FAILING</span>
            <div className="kpi-val-row">
              <span className="kpi-val">{kpiStats.total.toLocaleString()}</span>
              <span className="kpi-unit">Lô</span>
            </div>
          </div>
        </div>

        {/* Card 2: Đã Pass */}
        <div className="mobile-kpi-card mobile-kpi-card--pass">
          <div className="kpi-icon">
            <FiCheckCircle />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">ĐÃ TÁI KIỂM PASS</span>
            <div className="kpi-val-row">
              <span className="kpi-val kpi-val--pass">{kpiStats.passed.toLocaleString()}</span>
              <span className="kpi-tag kpi-tag--pass">{kpiStats.passRate}%</span>
            </div>
          </div>
        </div>

        {/* Card 3: Chờ Xử Lý Pending */}
        <div className="mobile-kpi-card mobile-kpi-card--pending">
          <div className="kpi-icon">
            <FiClock />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">CHỜ XỬ LÝ (PENDING)</span>
            <div className="kpi-val-row">
              <span className="kpi-val kpi-val--pending">{kpiStats.pending.toLocaleString()}</span>
              <span className="kpi-tag kpi-tag--pending">{kpiStats.pendingRate}%</span>
            </div>
          </div>
        </div>

        {/* Card 4: Tồn Kho Liệu */}
        <div className="mobile-kpi-card mobile-kpi-card--qty">
          <div className="kpi-icon">
            <FiPackage />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">TỒN KHO FAILING</span>
            <div className="kpi-val-row">
              <span className="kpi-val kpi-val--qty">{kpiStats.totalQty.toLocaleString()}</span>
              <span className="kpi-unit">EA/m²</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nút đóng nhanh micro KPI */}
      <button
        type="button"
        className="btn-close-kpi"
        onClick={onClose}
        title="Đóng KPI để mở rộng bảng dữ liệu"
      >
        <FiX size={13} />
      </button>
    </div>
  );
};

export default PrecisionFailingMobileKpi;
