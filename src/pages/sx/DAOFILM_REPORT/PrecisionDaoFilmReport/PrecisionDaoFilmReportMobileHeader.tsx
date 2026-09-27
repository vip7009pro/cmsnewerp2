import React from "react";
import { FiBarChart2, FiPieChart, FiRefreshCw } from "react-icons/fi";
import { DaoFilmReportWidgetData } from "../../utils/daoFilmReportUtils";

interface PrecisionDaoFilmReportMobileHeaderProps {
  totalRecords: number;
  filteredRecords: number;
  widgetData: DaoFilmReportWidgetData;
  loading: boolean;
  showKpi: boolean;
  onToggleKpi: () => void;
  showChartsModal: boolean;
  onToggleChartsModal: () => void;
  onReload: () => void;
}

export const PrecisionDaoFilmReportMobileHeader: React.FC<
  PrecisionDaoFilmReportMobileHeaderProps
> = ({
  totalRecords,
  filteredRecords,
  widgetData,
  loading,
  showKpi,
  onToggleKpi,
  showChartsModal,
  onToggleChartsModal,
  onReload,
}) => {
  const okRate =
    widgetData.Total_Knife > 0
      ? ((widgetData.Total_OK_Knife / widgetData.Total_Knife) * 100).toFixed(1)
      : "100";

  return (
    <div className="precision-dfr-mobile-header">
      {/* Hàng 1: Brand badge, Pulse Live & Title + Nút điều khiển */}
      <div className="header-top-row">
        <div className="header-left">
          <span className="brand-badge brand-badge--report">04. BÁO CÁO DAO FILM</span>
          <span className="live-pulse" title="Hệ thống báo cáo dao film trực tuyến" />
          <h1 className="header-title">BÁO CÁO DAO FILM</h1>
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

          {/* Nút Mở Biểu Đồ */}
          <button
            type="button"
            className={`btn-mobile-header ${showChartsModal ? "btn-mobile-header--active" : ""}`}
            onClick={onToggleChartsModal}
            title="Xem Biểu Đồ Phân Tích Dao Film"
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
            title="Tải lại toàn bộ dữ liệu báo cáo"
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
        <span className="telemetry-chip telemetry-chip--total">
          <span>Tổng: <strong>{widgetData.Total_Knife.toLocaleString("en-US")}</strong> dao</span>
        </span>
        <span className="telemetry-chip telemetry-chip--ok">
          <span>OK: <strong>{widgetData.Total_OK_Knife.toLocaleString("en-US")}</strong> ({okRate}%)</span>
        </span>
        <span
          className={`telemetry-chip ${
            widgetData.Total_NG_Knife > 0 ? "telemetry-chip--warn" : "telemetry-chip--safe"
          }`}
        >
          Vượt ĐM: <strong>{widgetData.Total_NG_Knife.toLocaleString("en-US")}</strong>
        </span>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDaoFilmReportMobileHeader);
