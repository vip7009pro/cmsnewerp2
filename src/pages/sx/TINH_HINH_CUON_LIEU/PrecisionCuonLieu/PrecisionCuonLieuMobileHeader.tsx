import React from "react";
import { FaSyncAlt, FaChartPie, FaChartBar, FaRulerCombined } from "react-icons/fa";

interface PrecisionCuonLieuMobileHeaderProps {
  totalCount: number;
  filteredCount: number;
  totalMeters: number;
  lossPercent: number;
  showKpi: boolean;
  onToggleKpi: () => void;
  showChart: boolean;
  onToggleChart: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const PrecisionCuonLieuMobileHeader: React.FC<PrecisionCuonLieuMobileHeaderProps> = ({
  totalCount,
  filteredCount,
  totalMeters,
  lossPercent,
  showKpi,
  onToggleKpi,
  showChart,
  onToggleChart,
  onRefresh,
  isLoading = false,
}) => {
  const lossPct = (lossPercent || 0) * 100;

  return (
    <div className="precision-cuonlieu-mobile-header">
      {/* Hàng 1: Brand badge, Pulse Live & Title + Nút điều khiển */}
      <div className="header-top-row">
        <div className="header-left">
          <span className="brand-badge">03. CUỘN LIỆU</span>
          <span className="live-pulse" title="Hệ thống giám sát cuộn liệu trực tuyến" />
          <h1 className="header-title">THEO DÕI CUỘN LIỆU</h1>
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

          {/* Nút Toggle Biểu Đồ Tổn Thất */}
          <button
            type="button"
            className={`btn-mobile-header ${showChart ? "btn-mobile-header--active" : ""}`}
            onClick={onToggleChart}
            title="Bật/Tắt Biểu Đồ Tổn Thất Cuộn Liệu"
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
            title="Tải lại dữ liệu cuộn liệu"
          >
            <FaSyncAlt size={11} className={isLoading ? "fa-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Hàng 2: Telemetry chips */}
      <div className="header-telemetry-row">
        <span className="telemetry-chip">
          Cuộn: <strong>{filteredCount.toLocaleString("en-US")}</strong>
          {filteredCount !== totalCount && ` / ${totalCount.toLocaleString("en-US")}`}
        </span>
        <span className="telemetry-chip telemetry-chip--meters">
          <FaRulerCombined size={10} />
          <span>{totalMeters.toLocaleString("en-US")} m</span>
        </span>
        <span
          className={`telemetry-chip telemetry-chip--loss ${
            lossPct <= 2 ? "loss-good" : lossPct <= 5 ? "loss-warn" : "loss-high"
          }`}
        >
          Loss KT: <strong>{lossPct.toFixed(2)}%</strong>
        </span>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCuonLieuMobileHeader);
