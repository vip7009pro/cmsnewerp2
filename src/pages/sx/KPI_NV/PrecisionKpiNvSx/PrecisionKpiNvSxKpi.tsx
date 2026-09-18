import React from "react";
import {
  FiTrendingUp,
  FiAward,
  FiUsers,
  FiLayers,
  FiCheckCircle,
  FiTarget,
} from "react-icons/fi";
import { KpiNvSxSummaryStats } from "./kpiNvSxHelpers";

interface PrecisionKpiNvSxKpiProps {
  summary: KpiNvSxSummaryStats;
}

const PrecisionKpiNvSxKpi: React.FC<PrecisionKpiNvSxKpiProps> = ({ summary }) => {
  const {
    totalPlanMet,
    totalOutputMetTt,
    totalPlanQty,
    totalOutputEaTt,
    avgRateM,
    avgRateEa,
    uniqueEmplCount,
    totalRecords,
    bestPerformerMet,
  } = summary;

  // Tính tỷ lệ % hoàn thành mét tổng thể
  const overallRateM = totalPlanMet > 0 ? (totalOutputMetTt / totalPlanMet) * 100 : 0;
  // Tính tỷ lệ % hoàn thành EA tổng thể
  const overallRateEa = totalPlanQty > 0 ? (totalOutputEaTt / totalPlanQty) * 100 : 0;

  return (
    <div className="precision-kpinvsx__kpiGrid">
      {/* Thẻ 1: Tổng Sản Lượng Mét (Output Mét) */}
      <div className="kpi-card kpi-card--blue">
        <div className="kpi-card__header">
          <span className="kpi-card__title">Tổng Sản Lượng Mét Thực Tế</span>
          <div className="kpi-card__icon">
            <FiLayers size={15} />
          </div>
        </div>
        <div className="kpi-card__body">
          <div className="kpi-card__value">
            {totalOutputMetTt.toLocaleString("en-US")} <span className="kpi-card__unit">m</span>
          </div>
          <div className="kpi-card__subtext">
            <span>Kế hoạch: <strong>{totalPlanMet.toLocaleString("en-US")} m</strong></span>
            <span className="kpi-card__badge-rate">Đạt {overallRateM.toFixed(1)}%</span>
          </div>
          <div className="kpi-card__progress-bar">
            <div
              className="kpi-card__progress-fill kpi-card__progress-fill--blue"
              style={{ width: `${Math.min(overallRateM, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Thẻ 2: Tổng Sản Lượng Con EA (Output EA) */}
      <div className="kpi-card kpi-card--emerald">
        <div className="kpi-card__header">
          <span className="kpi-card__title">Tổng Sản Lượng Con (EA)</span>
          <div className="kpi-card__icon">
            <FiCheckCircle size={15} />
          </div>
        </div>
        <div className="kpi-card__body">
          <div className="kpi-card__value">
            {totalOutputEaTt.toLocaleString("en-US")} <span className="kpi-card__unit">EA</span>
          </div>
          <div className="kpi-card__subtext">
            <span>Kế hoạch: <strong>{totalPlanQty.toLocaleString("en-US")} EA</strong></span>
            <span className="kpi-card__badge-rate">Đạt {overallRateEa.toFixed(1)}%</span>
          </div>
          <div className="kpi-card__progress-bar">
            <div
              className="kpi-card__progress-fill kpi-card__progress-fill--emerald"
              style={{ width: `${Math.min(overallRateEa, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Thẻ 3: Tỷ Lệ Đạt Mét Bình Quân (Avg Rate Mét) */}
      <div className="kpi-card kpi-card--indigo">
        <div className="kpi-card__header">
          <span className="kpi-card__title">Tỷ Lệ Hoàn Thành Mét BQ</span>
          <div className="kpi-card__icon">
            <FiTrendingUp size={15} />
          </div>
        </div>
        <div className="kpi-card__body">
          <div className="kpi-card__value">
            {avgRateM.toFixed(1)} <span className="kpi-card__unit">%</span>
          </div>
          <div className="kpi-card__subtext">
            <span>Định mức chuẩn: <strong>100.0%</strong></span>
            <span className={`kpi-card__status-pill ${avgRateM >= 100 ? "status--ok" : "status--warning"}`}>
              {avgRateM >= 100 ? "Đạt Chỉ Tiêu" : "Dưới Chỉ Tiêu"}
            </span>
          </div>
          <div className="kpi-card__progress-bar">
            <div
              className="kpi-card__progress-fill kpi-card__progress-fill--indigo"
              style={{ width: `${Math.min(avgRateM, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Thẻ 4: Tỷ Lệ Đạt Con Bình Quân (Avg Rate EA) */}
      <div className="kpi-card kpi-card--amber">
        <div className="kpi-card__header">
          <span className="kpi-card__title">Tỷ Lệ Hoàn Thành Con BQ</span>
          <div className="kpi-card__icon">
            <FiTarget size={15} />
          </div>
        </div>
        <div className="kpi-card__body">
          <div className="kpi-card__value">
            {avgRateEa.toFixed(1)} <span className="kpi-card__unit">%</span>
          </div>
          <div className="kpi-card__subtext">
            <span>Chỉ tiêu mục tiêu: <strong>100.0%</strong></span>
            <span className={`kpi-card__status-pill ${avgRateEa >= 100 ? "status--ok" : "status--warning"}`}>
              {avgRateEa >= 100 ? "Xuất Sắc" : "Cần Cải Thiện"}
            </span>
          </div>
          <div className="kpi-card__progress-bar">
            <div
              className="kpi-card__progress-fill kpi-card__progress-fill--amber"
              style={{ width: `${Math.min(avgRateEa, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Thẻ 5: Quy Mô Nhân Lực Ghi Nhận (Workforce Scale) */}
      <div className="kpi-card kpi-card--sky">
        <div className="kpi-card__header">
          <span className="kpi-card__title">Quy Mô Nhân Lực Đánh Giá</span>
          <div className="kpi-card__icon">
            <FiUsers size={15} />
          </div>
        </div>
        <div className="kpi-card__body">
          <div className="kpi-card__value">
            {uniqueEmplCount} <span className="kpi-card__unit">Nhân Sự</span>
          </div>
          <div className="kpi-card__subtext">
            <span>Tổng lượt ghi nhận: <strong>{totalRecords.toLocaleString("en-US")} lượt</strong></span>
          </div>
          <div className="kpi-card__tag-list">
            <span className="kpi-card__tag">SX PRECISION</span>
            <span className="kpi-card__tag">OPERATORS</span>
          </div>
        </div>
      </div>

      {/* Thẻ 6: Top Nhân Sự Dẫn Đầu Hiệu Suất (Best Performer) */}
      <div className="kpi-card kpi-card--purple">
        <div className="kpi-card__header">
          <span className="kpi-card__title">Nhân Sự Dẫn Đầu Sản Lượng</span>
          <div className="kpi-card__icon">
            <FiAward size={15} />
          </div>
        </div>
        <div className="kpi-card__body">
          <div className="kpi-card__value kpi-card__value--performer">
            {bestPerformerMet.empl}
          </div>
          <div className="kpi-card__subtext">
            <span>Sản lượng mét: <strong>{bestPerformerMet.outputMet.toLocaleString("en-US")} m</strong></span>
            <span className="kpi-card__badge-rate">Đạt {bestPerformerMet.rateM.toFixed(1)}%</span>
          </div>
          <div className="kpi-card__tag-list">
            <span className="kpi-card__tag kpi-card__tag--gold">TOP 1 PRODUCER</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKpiNvSxKpi);
