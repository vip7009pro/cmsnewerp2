import React from "react";
import {
  AiOutlineFileText,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineWarning,
} from "react-icons/ai";

interface PrecisionNCRKpiProps {
  kpiStats: {
    total: number;
    completed: number;
    completedPercent: string;
    pending: number;
    totalRollHold: number;
    totalMHold: number;
  };
}

export const PrecisionNCRKpi: React.FC<PrecisionNCRKpiProps> = ({ kpiStats }) => {
  return (
    <section className="precision-ncr-kpi">
      {/* Card 1: Tổng NCR */}
      <div className="kpi-card">
        <div className="kpi-card__info">
          <span className="kpi-card__label">TỔNG SỐ PHIẾU NCR</span>
          <div className="kpi-card__value-row">
            <span className="kpi-card__value primary">{kpiStats.total}</span>
            <span className="kpi-card__badge primary">MTD</span>
          </div>
          <span className="kpi-card__subtext">Dữ liệu tra cứu hiện tại</span>
        </div>
        <div className="kpi-card__icon-box primary">
          <AiOutlineFileText />
        </div>
      </div>

      {/* Card 2: Đã Đóng / Completed */}
      <div className="kpi-card">
        <div className="kpi-card__info">
          <span className="kpi-card__label">ĐÃ ĐÓNG / COMPLETED</span>
          <div className="kpi-card__value-row">
            <span className="kpi-card__value success">{kpiStats.completed}</span>
            <span className="kpi-card__badge success">{kpiStats.completedPercent}%</span>
          </div>
          <span className="kpi-card__subtext">Biên bản xử lý triệt để</span>
        </div>
        <div className="kpi-card__icon-box success">
          <AiOutlineCheckCircle />
        </div>
      </div>

      {/* Card 3: Đang Xử Lý / Pending */}
      <div className="kpi-card">
        <div className="kpi-card__info">
          <span className="kpi-card__label">ĐANG XỬ LÝ / PENDING</span>
          <div className="kpi-card__value-row">
            <span className="kpi-card__value warning">{kpiStats.pending}</span>
            <span className="kpi-card__badge warning">Cần duyệt</span>
          </div>
          <span className="kpi-card__subtext">Chờ đối sách hoặc xác nhận</span>
        </div>
        <div className="kpi-card__icon-box warning">
          <AiOutlineClockCircle />
        </div>
      </div>

      {/* Card 4: Chặn giữ / Holding */}
      <div className="kpi-card">
        <div className="kpi-card__info">
          <span className="kpi-card__label">LÔ LIÊN QUAN CHẶN GIỮ</span>
          <div className="kpi-card__value-row">
            <span className="kpi-card__value danger">
              {kpiStats.totalRollHold} <small style={{ fontSize: 11, fontWeight: 600 }}>cuộn</small>
            </span>
            <span className="kpi-card__badge danger">{kpiStats.totalMHold}m</span>
          </div>
          <span className="kpi-card__subtext">Theo NCR đang chọn</span>
        </div>
        <div className="kpi-card__icon-box danger">
          <AiOutlineWarning />
        </div>
      </div>
    </section>
  );
};
