import React from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiPackage,
} from "react-icons/fi";

interface PrecisionFailingKpiProps {
  kpiStats: {
    total: number;
    passed: number;
    pending: number;
    passRate: string;
    pendingRate: string;
    totalQty: number;
  };
}

export const PrecisionFailingKpi: React.FC<PrecisionFailingKpiProps> = ({ kpiStats }) => {
  return (
    <section className="precision-failing-kpi">
      <div className="precision-failing-kpi__grid">
        {/* Card 1: Tổng Lô Failing Cần Xử Lý */}
        <div className="precision-failing-kpi__card">
          <div className="card-left">
            <div className="card-icon card-icon--total">
              <FiAlertTriangle />
            </div>
            <div className="card-info">
              <span className="card-label">TỔNG LÔ FAILING CẦN XỬ LÝ</span>
              <div className="card-value-row">
                <span className="card-value">{kpiStats.total.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 font-semibold">Lô NVL</span>
              </div>
            </div>
          </div>
          <div className="card-right">
            <span className="badge-indicator badge-indicator--danger">NG Critical</span>
          </div>
        </div>

        {/* Card 2: Đã Tái Kiểm (PASSED) */}
        <div className="precision-failing-kpi__card">
          <div className="card-left">
            <div className="card-icon card-icon--pass">
              <FiCheckCircle />
            </div>
            <div className="card-info">
              <span className="card-label">ĐÃ TÁI KIỂM (PASSED)</span>
              <div className="card-value-row">
                <span className="card-value card-value--pass">
                  {kpiStats.passed.toLocaleString()}
                </span>
                <span className="card-rate card-rate--pass">{kpiStats.passRate}%</span>
              </div>
            </div>
          </div>
          <div className="card-right">
            <span className="badge-indicator badge-indicator--success">Phê Duyệt</span>
          </div>
        </div>

        {/* Card 3: Chờ Xử Lý NCR / Trả NCC */}
        <div className="precision-failing-kpi__card">
          <div className="card-left">
            <div className="card-icon card-icon--pending">
              <FiClock />
            </div>
            <div className="card-info">
              <span className="card-label">CHỜ XỬ LÝ NCR / TRẢ NCC</span>
              <div className="card-value-row">
                <span className="card-value card-value--pending">
                  {kpiStats.pending.toLocaleString()}
                </span>
                <span className="card-rate card-rate--pending">{kpiStats.pendingRate}%</span>
              </div>
            </div>
          </div>
          <div className="card-right">
            <span className="badge-indicator badge-indicator--warning">Pending</span>
          </div>
        </div>

        {/* Card 4: Tồn Kho Liệu Failing */}
        <div className="precision-failing-kpi__card">
          <div className="card-left">
            <div className="card-icon card-icon--qty">
              <FiPackage />
            </div>
            <div className="card-info">
              <span className="card-label">TỒN KHO LIỆU FAILING</span>
              <div className="card-value-row">
                <span className="card-value card-value--qty">
                  {kpiStats.totalQty.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">EA/m²</span>
              </div>
            </div>
          </div>
          <div className="card-right">
            <span className="badge-indicator badge-indicator--purple">Kho NVL</span>
          </div>
        </div>
      </div>
    </section>
  );
};
