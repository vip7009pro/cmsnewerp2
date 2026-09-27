import React from "react";
import { FiRefreshCw, FiBarChart2, FiPieChart, FiLayers } from "react-icons/fi";
import { DaoFilmMode, DaoFilmKpiData } from "./useDaoFilmData";

interface PrecisionDaoFilmDataMobileHeaderProps {
  mode: DaoFilmMode;
  totalRecords: number;
  filteredRecords: number;
  kpiData: DaoFilmKpiData;
  loading: boolean;
  showKpi: boolean;
  onToggleKpi: () => void;
  showChart: boolean;
  onToggleChart: () => void;
  onReload: () => void;
}

export const PrecisionDaoFilmDataMobileHeader: React.FC<PrecisionDaoFilmDataMobileHeaderProps> = ({
  mode,
  totalRecords,
  filteredRecords,
  kpiData,
  loading,
  showKpi,
  onToggleKpi,
  showChart,
  onToggleChart,
  onReload,
}) => {
  const getModeInfo = () => {
    switch (mode) {
      case "GIAO_NHAN":
        return { label: "01. GIAO NHẬN", badgeCls: "brand-badge--gn" };
      case "QUAN_LY":
        return { label: "02. QL DAO FILM", badgeCls: "brand-badge--ql" };
      case "XUAT_DAO_FILM":
        return { label: "03. XUẤT DF", badgeCls: "brand-badge--xuat" };
      default:
        return { label: "DAO FILM", badgeCls: "" };
    }
  };

  const modeInfo = getModeInfo();
  const okRate =
    kpiData.okCount + kpiData.ngCount > 0
      ? ((kpiData.okCount / (kpiData.okCount + kpiData.ngCount)) * 100).toFixed(1)
      : "100";

  return (
    <div className="precision-df-mobile-header">
      {/* Hàng 1: Brand badge, Pulse Live & Title + Nút điều khiển */}
      <div className="header-top-row">
        <div className="header-left">
          <span className={`brand-badge ${modeInfo.badgeCls}`}>{modeInfo.label}</span>
          <span className="live-pulse" title="Hệ thống dữ liệu khuôn dao & film trực tuyến" />
          <h1 className="header-title">QUẢN LÝ DAO FILM</h1>
        </div>

        <div className="header-actions">
          {/* Nút Toggle Micro-KPI */}
          <button
            type="button"
            className={`btn-mobile-header ${showKpi ? "btn-mobile-header--active" : ""}`}
            onClick={onToggleKpi}
            title="Bật/Tắt Micro-KPI Dao Film"
          >
            <FiBarChart2 size={11} />
            <span>KPI</span>
          </button>

          {/* Nút Toggle Biểu Đồ */}
          <button
            type="button"
            className={`btn-mobile-header ${showChart ? "btn-mobile-header--active" : ""}`}
            onClick={onToggleChart}
            title="Bật/Tắt Biểu Đồ Phân Tích"
          >
            <FiPieChart size={11} />
            <span>Biểu Đồ</span>
          </button>

          {/* Nút Làm Mới */}
          <button
            type="button"
            className="btn-mobile-header btn-mobile-header--refresh"
            onClick={onReload}
            disabled={loading}
            title="Tải lại toàn bộ dữ liệu theo mode hiện tại"
          >
            <FiRefreshCw size={11} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Hàng 2: Telemetry chips */}
      <div className="header-telemetry-row">
        <span className="telemetry-chip">
          Dòng: <strong>{filteredRecords.toLocaleString("en-US")}</strong>
          {filteredRecords !== totalRecords && ` / ${totalRecords.toLocaleString("en-US")}`}
        </span>
        <span className="telemetry-chip telemetry-chip--dao">
          <FiLayers size={10} />
          <span>Dao: {kpiData.daoCount} | Film: {kpiData.filmCount}</span>
        </span>
        <span className="telemetry-chip telemetry-chip--ok">
          <span>OK: <strong>{okRate}%</strong></span>
        </span>
        <span
          className={`telemetry-chip ${
            kpiData.overStandardCount > 0 ? "telemetry-chip--warn" : "telemetry-chip--safe"
          }`}
        >
          Vượt ĐM: <strong>{kpiData.overStandardCount}</strong>
        </span>
        <span className="telemetry-chip">
          Press: <strong>{kpiData.totalPress.toLocaleString("en-US")}</strong>
        </span>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDaoFilmDataMobileHeader);
