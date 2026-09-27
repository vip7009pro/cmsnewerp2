import React from "react";
import { FaSyncAlt, FaChartPie, FaChartBar, FaRulerCombined, FaCheckCircle } from "react-icons/fa";

interface PrecisionBaoCaoFullRollMobileHeaderProps {
  totalCount: number;
  filteredCount: number;
  inputMet: number;
  resultMet: number;
  yieldRate: number;
  settingLossRate: number;
  showKpi: boolean;
  onToggleKpi: () => void;
  showChart: boolean;
  onToggleChart: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const PrecisionBaoCaoFullRollMobileHeader: React.FC<PrecisionBaoCaoFullRollMobileHeaderProps> = ({
  totalCount,
  filteredCount,
  inputMet,
  resultMet,
  yieldRate,
  settingLossRate,
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
          <span className="brand-badge">06. FULL ROLL</span>
          <span className="live-pulse" title="Hệ thống báo cáo Full Roll sản xuất trực tuyến" />
          <h1 className="header-title">BÁO CÁO FULL ROLL</h1>
        </div>

        <div className="header-actions">
          {/* Nút Toggle Micro-KPI */}
          <button
            type="button"
            className={`btn-mobile-header ${showKpi ? "btn-mobile-header--active" : ""}`}
            onClick={onToggleKpi}
            title="Bật/Tắt Micro-KPI Sản Xuất"
          >
            <FaChartBar size={11} />
            <span>KPI</span>
          </button>

          {/* Nút Toggle Biểu Đồ */}
          <button
            type="button"
            className={`btn-mobile-header ${showChart ? "btn-mobile-header--active" : ""}`}
            onClick={onToggleChart}
            title="Bật/Tắt Biểu Đồ & Xu Hướng"
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
          <span>In: {Math.round(inputMet).toLocaleString("en-US")} m</span>
        </span>
        <span className="telemetry-chip telemetry-chip--ok">
          <FaCheckCircle size={10} />
          <span>OK: {Math.round(resultMet).toLocaleString("en-US")} m</span>
        </span>
        <span
          className={`telemetry-chip telemetry-chip--loss ${
            yieldRate >= 90 ? "loss-good" : yieldRate >= 80 ? "loss-warn" : "loss-high"
          }`}
        >
          Yield: <strong>{yieldRate.toFixed(1)}%</strong>
        </span>
        <span className="telemetry-chip">
          ST: <strong>{settingLossRate.toFixed(1)}%</strong>
        </span>
      </div>
    </div>
  );
};

export default React.memo(PrecisionBaoCaoFullRollMobileHeader);
