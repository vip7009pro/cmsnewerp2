import React from "react";
import { AiOutlineInbox } from "react-icons/ai";
import { FiCheckCircle, FiSlash, FiClock } from "react-icons/fi";

interface PrecisionHoldingKpiProps {
  kpiStats: {
    total: number;
    passed: number;
    failed: number;
    pending: number;
    passRate: string;
    failRate: string;
  };
}

export const PrecisionHoldingKpi: React.FC<PrecisionHoldingKpiProps> = ({ kpiStats }) => {
  return (
    <section className="precision-holding-kpi">
      <div className="precision-holding-kpi__grid">
        {/* Card 1: Total Holding */}
        <div className="precision-holding-kpi__card">
          <div className="card-left">
            <div className="card-icon card-icon--amber">
              <AiOutlineInbox />
            </div>
            <div className="card-details">
              <span className="card-label">Tổng Lô Holding</span>
              <div className="card-value card-value--amber">
                {kpiStats.total.toLocaleString()}
                <span className="card-unit">Lô</span>
              </div>
            </div>
          </div>
          <span className="card-badge card-badge--amber">QC Giữ Hàng</span>
        </div>

        {/* Card 2: Passed */}
        <div className="precision-holding-kpi__card">
          <div className="card-left">
            <div className="card-icon card-icon--emerald">
              <FiCheckCircle />
            </div>
            <div className="card-details">
              <span className="card-label">Đã Phê Duyệt (PASSED)</span>
              <div className="card-value card-value--emerald">
                {kpiStats.passed.toLocaleString()}
                <span className="card-unit">({kpiStats.passRate}%)</span>
              </div>
            </div>
          </div>
          <span className="card-badge card-badge--emerald">Đã Mở Chặn</span>
        </div>

        {/* Card 3: Failed */}
        <div className="precision-holding-kpi__card">
          <div className="card-left">
            <div className="card-icon card-icon--rose">
              <FiSlash />
            </div>
            <div className="card-details">
              <span className="card-label">Chưa Phê Duyệt (FAIL)</span>
              <div className="card-value card-value--rose">
                {kpiStats.failed.toLocaleString()}
                <span className="card-unit">({kpiStats.failRate}%)</span>
              </div>
            </div>
          </div>
          <span className="card-badge card-badge--rose">Cần Xử Lý</span>
        </div>

        {/* Card 4: Pending */}
        <div className="precision-holding-kpi__card">
          <div className="card-left">
            <div className="card-icon card-icon--blue">
              <FiClock />
            </div>
            <div className="card-details">
              <span className="card-label">Chờ Đánh Giá (PENDING)</span>
              <div className="card-value card-value--blue">
                {kpiStats.pending.toLocaleString()}
                <span className="card-unit">Lô Tồn</span>
              </div>
            </div>
          </div>
          <span className="card-badge card-badge--blue">Chờ Phê Duyệt</span>
        </div>
      </div>
    </section>
  );
};
