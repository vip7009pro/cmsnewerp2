import React from "react";
import {
  FiUsers,
  FiUserCheck,
  FiCpu,
  FiClock,
  FiActivity,
  FiTrendingUp,
  FiCheckCircle,
} from "react-icons/fi";

interface PrecisionCapaSxKpiProps {
  totalReqWorkforce: number;
  retainWorkforce: number;
  realtimeWorkforce: number;
  totalMachines: number;
  runningMachines: number;
  maxDailyCapaMinutes: number;
  totalYcsxBalanceMinutes: number;
  avgLeadTimeDays: number;
}

export const PrecisionCapaSxKpi: React.FC<PrecisionCapaSxKpiProps> = ({
  totalReqWorkforce,
  retainWorkforce,
  realtimeWorkforce,
  totalMachines,
  runningMachines,
  maxDailyCapaMinutes,
  totalYcsxBalanceMinutes,
  avgLeadTimeDays,
}) => {
  const attendanceRate = retainWorkforce > 0 ? (realtimeWorkforce / retainWorkforce) * 100 : 0;
  const runningRate = totalMachines > 0 ? (runningMachines / totalMachines) * 100 : 0;

  return (
    <div className="precision-capa-kpi-grid">
      {/* 1. Nhân Lực Cần Cho Full Capa */}
      <div className="kpi-card kpi-card--purple">
        <div className="kpi-info">
          <span className="kpi-label">Nhân Lực Cần Full Capa</span>
          <div className="kpi-amount">{totalReqWorkforce.toLocaleString("en-US")} <small style={{ fontSize: "11px", fontWeight: "normal" }}>Người</small></div>
          <div className="kpi-meta">
            <span>Tiêu chuẩn 100% ca:</span>
            <span className="meta-val">{totalReqWorkforce} người</span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiUsers />
        </div>
      </div>

      {/* 2. Điểm Danh Thực Tế */}
      <div className="kpi-card kpi-card--emerald">
        <div className="kpi-info">
          <span className="kpi-label">Điểm Danh Có Mặt</span>
          <div className="kpi-amount">
            {realtimeWorkforce} / {retainWorkforce} <small style={{ fontSize: "11px", fontWeight: "normal" }}>Người</small>
          </div>
          <div className="kpi-meta">
            <span>Tỷ lệ đi làm:</span>
            <span className={`growth-pill ${attendanceRate >= 90 ? "growth-pill--up" : "growth-pill--down"}`}>
              {attendanceRate.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiUserCheck />
        </div>
      </div>

      {/* 3. Tỷ Lệ Máy Đang Chạy */}
      <div className="kpi-card kpi-card--blue">
        <div className="kpi-info">
          <span className="kpi-label">Máy Đang Chạy (Running)</span>
          <div className="kpi-amount">
            {runningMachines} / {totalMachines} <small style={{ fontSize: "11px", fontWeight: "normal" }}>Máy</small>
          </div>
          <div className="kpi-meta">
            <span>Tỷ lệ vận hành:</span>
            <span className={`growth-pill ${runningRate >= 80 ? "growth-pill--up" : "growth-pill--down"}`}>
              {runningRate.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiCpu />
        </div>
      </div>

      {/* 4. Tổng Năng Lực Máy Ngày */}
      <div className="kpi-card kpi-card--indigo">
        <div className="kpi-info">
          <span className="kpi-label">Tổng Năng Lực Máy / Ngày</span>
          <div className="kpi-amount">
            {(maxDailyCapaMinutes / 60).toLocaleString("en-US", { maximumFractionDigits: 0 })}{" "}
            <small style={{ fontSize: "11px", fontWeight: "normal" }}>Giờ</small>
          </div>
          <div className="kpi-meta">
            <span>Quy đổi:</span>
            <span className="meta-val">{maxDailyCapaMinutes.toLocaleString("en-US")} phút</span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiClock />
        </div>
      </div>

      {/* 5. Tồn Yêu Cầu Sản Xuất (YCSX Balance) */}
      <div className="kpi-card kpi-card--amber">
        <div className="kpi-info">
          <span className="kpi-label">Tồn Yêu Cầu Chờ Dập</span>
          <div className="kpi-amount">
            {(totalYcsxBalanceMinutes / 60).toLocaleString("en-US", { maximumFractionDigits: 0 })}{" "}
            <small style={{ fontSize: "11px", fontWeight: "normal" }}>Giờ</small>
          </div>
          <div className="kpi-meta">
            <span>Khối lượng:</span>
            <span className="meta-val">{totalYcsxBalanceMinutes.toLocaleString("en-US")} phút</span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiActivity />
        </div>
      </div>

      {/* 6. Lead Time Bình Quân */}
      <div className="kpi-card kpi-card--rose">
        <div className="kpi-info">
          <span className="kpi-label">Lead Time Trung Bình</span>
          <div className="kpi-amount">
            {avgLeadTimeDays.toFixed(1)} <small style={{ fontSize: "11px", fontWeight: "normal" }}>Ngày</small>
          </div>
          <div className="kpi-meta">
            <span>Dựa trên thực tế:</span>
            <span className="meta-val">PO Balance</span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiTrendingUp />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCapaSxKpi);
