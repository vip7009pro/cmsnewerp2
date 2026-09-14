import React from "react";
import { AiOutlineInbox } from "react-icons/ai";
import { FiCheckCircle, FiSlash, FiClock } from "react-icons/fi";

interface PrecisionBLOCKKpiProps {
  kpiStats: {
    total: number;
    passed: number;
    failed: number;
    pending: number;
    passRate: string;
    failRate: string;
  };
}

export const PrecisionBLOCKKpi: React.FC<PrecisionBLOCKKpiProps> = ({ kpiStats }) => {
  return (
    <section className="precision-block-kpi">
      <div className="precision-block-kpi__grid">
        {/* Card 1: Total Blocking */}
        <div className="precision-block-kpi__card">
          <div className="card-left">
            <div className="card-icon card-icon--blue">
              <AiOutlineInbox />
            </div>
            <div className="card-details">
              <span className="card-label">Tổng Lô Bị Blocking</span>
              <div className="card-value card-value--blue">
                {kpiStats.total.toLocaleString()}
                <span className="card-unit">Lô</span>
              </div>
            </div>
          </div>
          <span className="card-badge card-badge--blue">QC Cảnh Báo</span>
        </div>

        {/* Card 2: Passed */}
        <div className="precision-block-kpi__card">
          <div className="card-left">
            <div className="card-icon card-icon--emerald">
              <FiCheckCircle />
            </div>
            <div className="card-details">
              <span className="card-label">Lô Đã Xử Lý (PASSED)</span>
              <div className="card-value card-value--emerald">
                {kpiStats.passed.toLocaleString()}
                <span className="card-unit">({kpiStats.passRate}%)</span>
              </div>
            </div>
          </div>
          <span className="card-badge card-badge--emerald">Đã Mở Chặn</span>
        </div>

        {/* Card 3: Failed */}
        <div className="precision-block-kpi__card">
          <div className="card-left">
            <div className="card-icon card-icon--rose">
              <FiSlash />
            </div>
            <div className="card-details">
              <span className="card-label">Lô Không Đạt (FAILED)</span>
              <div className="card-value card-value--rose">
                {kpiStats.failed.toLocaleString()}
                <span className="card-unit">({kpiStats.failRate}%)</span>
              </div>
            </div>
          </div>
          <span className="card-badge card-badge--rose">Cần NCR/Báo Phế</span>
        </div>

        {/* Card 4: Pending */}
        <div className="precision-block-kpi__card">
          <div className="card-left">
            <div className="card-icon card-icon--amber">
              <FiClock />
            </div>
            <div className="card-details">
              <span className="card-label">Chờ Xử Lý (PENDING)</span>
              <div className="card-value card-value--amber">
                {kpiStats.pending.toLocaleString()}
                <span className="card-unit">Lô Tồn</span>
              </div>
            </div>
          </div>
          <span className="card-badge card-badge--amber">Cần Duyệt Gấp</span>
        </div>
      </div>
    </section>
  );
};
