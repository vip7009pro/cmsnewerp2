import React from "react";
import { FaSyncAlt, FaChartPie, FaChartBar, FaRulerCombined, FaCheckCircle } from "react-icons/fa";

interface PrecisionBaoCaoRollMobileHeaderProps {
  totalCount: number;
  filteredCount: number;
  inputMeters: number;
  okMeters: number;
  allLossPercent: number;
  showKpi: boolean;
  onToggleKpi: () => void;
  showChart: boolean;
  onToggleChart: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const PrecisionBaoCaoRollMobileHeader: React.FC<PrecisionBaoCaoRollMobileHeaderProps> = ({
  totalCount,
  filteredCount,
  inputMeters,
  okMeters,
  allLossPercent,
  showKpi,
  onToggleKpi,
  showChart,
  onToggleChart,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <div className="precision-bcr-mobile-header">
      {/* Hàng 1: Brand badge, Pulse Live & Title + Nút điều khiển */}
      <div className="header-top-row">
        <div className="header-left">
          <span className="brand-badge">05. THEO ROLL</span>
          <span className="live-pulse" title="Hệ thống theo dõi báo cáo cuộn liệu trực tuyến" />
          <h1 className="header-title">BÁO CÁO THEO ROLL</h1>
        </div>

        <div className="header-actions">
          {/* Nút Toggle Micro-KPI */}
          <button
            type="button"
            className={`btn-mobile-header ${showKpi ? "btn-mobile-header--active" : ""}`}
            onClick={onToggleKpi}
            title="Bật/Tắt Micro-KPI Dây Chuyền"
          >
            <FaChartBar size={11} />
            <span>KPI</span>
          </button>

          {/* Nút Toggle Biểu Đồ */}
          <button
            type="button"
            className={`btn-mobile-header ${showChart ? "btn-mobile-header--active" : ""}`}
            onClick={onToggleChart}
            title="Bật/Tắt Biểu Đồ Tổn Thất & Xu Hướng"
          >
            <FaChartPie size={11} />
            <span>Biểu Đồ</span>
          </button>

          {/* Nút Làm Mới */}
          <button
            type="button"
            className="btn-mobile-header btn-mobile-header--refresh"
            onClick={onRefresh}
            disabled={isLoading}
            title="Tải lại toàn bộ dữ liệu báo cáo"
          >
            <FaSyncAlt size={11} className={isLoading ? "fa-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Hàng 2: Telemetry chips */}
      <div className="header-telemetry-row">
        <span className="telemetry-chip">
          Dòng: <strong>{filteredCount.toLocaleString("en-US")}</strong>
          {filteredCount !== totalCount && ` / ${totalCount.toLocaleString("en-US")}`}
        </span>
        <span className="telemetry-chip telemetry-chip--meters">
          <FaRulerCombined size={10} />
          <span>In: {inputMeters.toLocaleString("en-US")} m</span>
        </span>
        <span className="telemetry-chip telemetry-chip--ok">
          <FaCheckCircle size={10} />
          <span>OK: {okMeters.toLocaleString("en-US")} m</span>
        </span>
        <span
          className={`telemetry-chip telemetry-chip--loss ${
            allLossPercent <= 3 ? "loss-good" : allLossPercent <= 7 ? "loss-warn" : "loss-high"
          }`}
        >
          All Loss: <strong>{allLossPercent.toFixed(1)}%</strong>
        </span>
      </div>
    </div>
  );
};

export default React.memo(PrecisionBaoCaoRollMobileHeader);
