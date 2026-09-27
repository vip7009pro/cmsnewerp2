import React from "react";
import {
  FiLayers,
  FiCheckCircle,
  FiTrendingUp,
  FiTarget,
  FiUsers,
  FiAward,
  FiX,
} from "react-icons/fi";
import { KpiNvSxSummaryStats } from "./kpiNvSxHelpers";

interface PrecisionKpiNvSxMobileKpiProps {
  summary: KpiNvSxSummaryStats;
  onClose: () => void;
}

const PrecisionKpiNvSxMobileKpi: React.FC<PrecisionKpiNvSxMobileKpiProps> = ({
  summary,
  onClose,
}) => {
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

  const overallRateM = totalPlanMet > 0 ? (totalOutputMetTt / totalPlanMet) * 100 : 0;
  const overallRateEa = totalPlanQty > 0 ? (totalOutputEaTt / totalPlanQty) * 100 : 0;

  return (
    <div className="precision-kpinvsx__mobileKpiWrapper">
      <div className="mobile-kpi-header">
        <span className="mobile-kpi-title">TỔNG QUAN CHỈ SỐ HIỆU SUẤT KPI</span>
        <button
          type="button"
          className="btn-close-kpi"
          onClick={onClose}
          title="Đóng chỉ số để giải phóng không gian màn hình"
        >
          <FiX size={14} />
        </button>
      </div>

      <div className="mobile-kpi-scroll">
        {/* Card 1: Tổng Mét */}
        <div className="micro-kpi-card micro-kpi-card--blue">
          <div className="micro-kpi-icon">
            <FiLayers />
          </div>
          <div className="micro-kpi-content">
            <span className="label">Tổng Mét Thực Tế</span>
            <span className="value">
              {totalOutputMetTt.toLocaleString("en-US")} <small>m</small>
            </span>
            <span className="sub">
              KH: {totalPlanMet.toLocaleString("en-US")} m • Đạt {overallRateM.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Card 2: Tổng EA */}
        <div className="micro-kpi-card micro-kpi-card--emerald">
          <div className="micro-kpi-icon">
            <FiCheckCircle />
          </div>
          <div className="micro-kpi-content">
            <span className="label">Tổng Con (EA)</span>
            <span className="value">
              {totalOutputEaTt.toLocaleString("en-US")} <small>EA</small>
            </span>
            <span className="sub">
              KH: {totalPlanQty.toLocaleString("en-US")} EA • Đạt {overallRateEa.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Card 3: Đạt Mét BQ */}
        <div className="micro-kpi-card micro-kpi-card--indigo">
          <div className="micro-kpi-icon">
            <FiTrendingUp />
          </div>
          <div className="micro-kpi-content">
            <span className="label">Đạt Mét Bình Quân</span>
            <span className="value">
              {avgRateM.toFixed(1)}%
            </span>
            <span className="sub">
              Định mức: 100% • {avgRateM >= 100 ? "Đạt chỉ tiêu" : "Dưới chỉ tiêu"}
            </span>
          </div>
        </div>

        {/* Card 4: Đạt Con BQ */}
        <div className="micro-kpi-card micro-kpi-card--amber">
          <div className="micro-kpi-icon">
            <FiTarget />
          </div>
          <div className="micro-kpi-content">
            <span className="label">Đạt Con Bình Quân</span>
            <span className="value">
              {avgRateEa.toFixed(1)}%
            </span>
            <span className="sub">
              Mục tiêu: 100% • {avgRateEa >= 100 ? "Xuất sắc" : "Cần cải thiện"}
            </span>
          </div>
        </div>

        {/* Card 5: Quy mô Nhân Sự */}
        <div className="micro-kpi-card micro-kpi-card--sky">
          <div className="micro-kpi-icon">
            <FiUsers />
          </div>
          <div className="micro-kpi-content">
            <span className="label">Quy Mô Nhân Sự</span>
            <span className="value">{uniqueEmplCount} NV</span>
            <span className="sub">{totalRecords.toLocaleString("en-US")} lượt ghi nhận</span>
          </div>
        </div>

        {/* Card 6: Top 1 Performer */}
        <div className="micro-kpi-card micro-kpi-card--purple">
          <div className="micro-kpi-icon">
            <FiAward />
          </div>
          <div className="micro-kpi-content">
            <span className="label">Top 1 Sản Lượng Mét</span>
            <span className="value">{bestPerformerMet.empl || "N/A"}</span>
            <span className="sub">
              {bestPerformerMet.outputMet.toLocaleString("en-US")} m ({bestPerformerMet.rateM.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKpiNvSxMobileKpi);
