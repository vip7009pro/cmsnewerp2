import React from "react";
import {
  FiLayers,
  FiTool,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrendingUp,
  FiSliders,
} from "react-icons/fi";
import { DaoFilmKpiData } from "./useDaoFilmData";

interface PrecisionDaoFilmDataKpiProps {
  kpiData: DaoFilmKpiData;
}

export const PrecisionDaoFilmDataKpi: React.FC<PrecisionDaoFilmDataKpiProps> = React.memo(
  ({ kpiData }) => {
    const okRate =
      kpiData.okCount + kpiData.ngCount > 0
        ? ((kpiData.okCount / (kpiData.okCount + kpiData.ngCount)) * 100).toFixed(1)
        : "100";

    return (
      <div className="precision-df-kpi">
        {/* Card 1: Tổng Bản Ghi */}
        <div className="kpi-card kpi-card--blue">
          <div className="kpi-info">
            <span className="kpi-label">Tổng Bản Ghi Tra Cứu</span>
            <span className="kpi-amount">{kpiData.totalRecords.toLocaleString("en-US")}</span>
            <div className="kpi-meta">
              <span>Đang hiển thị trên lưới</span>
            </div>
          </div>
          <div className="kpi-icon-wrap">
            <FiLayers />
          </div>
        </div>

        {/* Card 2: Chủng Loại Dao/Film */}
        <div className="kpi-card kpi-card--emerald">
          <div className="kpi-info">
            <span className="kpi-label">Phân Loại Dao / Film</span>
            <span className="kpi-amount">
              {kpiData.daoCount} <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>Dao</span>
            </span>
            <div className="kpi-meta">
              <span>Film: <strong className="qty-val">{kpiData.filmCount}</strong></span>
              <span>• TL: <strong className="qty-val">{kpiData.tlCount}</strong></span>
            </div>
          </div>
          <div className="kpi-icon-wrap">
            <FiTool />
          </div>
        </div>

        {/* Card 3: Trạng Thái OK/NG */}
        <div className="kpi-card kpi-card--teal">
          <div className="kpi-info">
            <span className="kpi-label">Tỷ Lệ Đạt (Khuôn OK)</span>
            <span className="kpi-amount">
              {okRate}%
            </span>
            <div className="kpi-meta">
              <span>OK: <strong className="rate-val">{kpiData.okCount}</strong></span>
              {kpiData.ngCount > 0 && (
                <span>• NG: <strong className="alert-val">{kpiData.ngCount}</strong></span>
              )}
            </div>
          </div>
          <div className="kpi-icon-wrap">
            <FiCheckCircle />
          </div>
        </div>

        {/* Card 4: Cảnh Báo Tuổi Thọ */}
        <div className="kpi-card kpi-card--rose">
          <div className="kpi-info">
            <span className="kpi-label">Vượt Định Mức Dập</span>
            <span className="kpi-amount" style={{ color: kpiData.overStandardCount > 0 ? "#e11d48" : "#0f172a" }}>
              {kpiData.overStandardCount} <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>bộ</span>
            </span>
            <div className="kpi-meta">
              {kpiData.overStandardCount > 0 ? (
                <span className="alert-val">Cần mài/bảo dưỡng gấp</span>
              ) : (
                <span style={{ color: "#16a34a" }}>An toàn trong định mức</span>
              )}
            </div>
          </div>
          <div className="kpi-icon-wrap">
            <FiAlertTriangle />
          </div>
        </div>

        {/* Card 5: Tổng Lượt Dập */}
        <div className="kpi-card kpi-card--violet">
          <div className="kpi-info">
            <span className="kpi-label">Tổng Lượt Dập (Press)</span>
            <span className="kpi-amount">
              {kpiData.totalPress.toLocaleString("en-US")}
            </span>
            <div className="kpi-meta">
              <span>Lũy kế dập thực tế</span>
            </div>
          </div>
          <div className="kpi-icon-wrap">
            <FiTrendingUp />
          </div>
        </div>

        {/* Card 6: Phân Bổ Nhà Máy */}
        <div className="kpi-card kpi-card--amber">
          <div className="kpi-info">
            <span className="kpi-label">Cơ Cấu Nhà Máy</span>
            <span className="kpi-amount">
              {kpiData.nm1Count} <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>NM1</span>
            </span>
            <div className="kpi-meta">
              <span>NM2: <strong className="qty-val">{kpiData.nm2Count}</strong> bộ</span>
            </div>
          </div>
          <div className="kpi-icon-wrap">
            <FiSliders />
          </div>
        </div>
      </div>
    );
  }
);

export default PrecisionDaoFilmDataKpi;
