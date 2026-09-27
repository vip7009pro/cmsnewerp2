import React from "react";
import {
  FiLayers,
  FiTool,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrendingUp,
  FiSliders,
  FiX,
} from "react-icons/fi";
import { DaoFilmKpiData } from "./useDaoFilmData";

interface PrecisionDaoFilmDataMobileKpiProps {
  kpiData: DaoFilmKpiData;
  onClose: () => void;
}

export const PrecisionDaoFilmDataMobileKpi: React.FC<PrecisionDaoFilmDataMobileKpiProps> = ({
  kpiData,
  onClose,
}) => {
  const okRate =
    kpiData.okCount + kpiData.ngCount > 0
      ? ((kpiData.okCount / (kpiData.okCount + kpiData.ngCount)) * 100).toFixed(1)
      : "100";

  return (
    <div className="precision-df-mobile-kpi">
      <div className="kpi-scroll-container">
        {/* 1. Tổng Bản Ghi */}
        <div className="mobile-kpi-chip mobile-kpi-chip--blue">
          <div className="chip-icon">
            <FiLayers />
          </div>
          <div className="chip-content">
            <span className="chip-label">TỔNG BẢN GHI</span>
            <span className="chip-value">{kpiData.totalRecords.toLocaleString("en-US")}</span>
            <span className="chip-sub">Trên toàn lưới</span>
          </div>
        </div>

        {/* 2. Chủng Loại Dao / Film */}
        <div className="mobile-kpi-chip mobile-kpi-chip--emerald">
          <div className="chip-icon">
            <FiTool />
          </div>
          <div className="chip-content">
            <span className="chip-label">DAO / FILM</span>
            <span className="chip-value">{kpiData.daoCount} <small>Dao</small></span>
            <span className="chip-sub">Film: {kpiData.filmCount} • TL: {kpiData.tlCount}</span>
          </div>
        </div>

        {/* 3. Tỷ Lệ Đạt OK */}
        <div className="mobile-kpi-chip mobile-kpi-chip--teal">
          <div className="chip-icon">
            <FiCheckCircle />
          </div>
          <div className="chip-content">
            <span className="chip-label">TỶ LỆ ĐẠT</span>
            <span className="chip-value">{okRate}%</span>
            <span className="chip-sub">OK: {kpiData.okCount} • NG: {kpiData.ngCount}</span>
          </div>
        </div>

        {/* 4. Vượt Định Mức Dập */}
        <div className="mobile-kpi-chip mobile-kpi-chip--rose">
          <div className="chip-icon">
            <FiAlertTriangle />
          </div>
          <div className="chip-content">
            <span className="chip-label">VƯỢT ĐỊNH MỨC</span>
            <span
              className="chip-value"
              style={{ color: kpiData.overStandardCount > 0 ? "#e11d48" : "#0f172a" }}
            >
              {kpiData.overStandardCount} <small>bộ</small>
            </span>
            <span className="chip-sub">
              {kpiData.overStandardCount > 0 ? "Cần mài/bảo dưỡng" : "An toàn"}
            </span>
          </div>
        </div>

        {/* 5. Tổng Lượt Dập */}
        <div className="mobile-kpi-chip mobile-kpi-chip--purple">
          <div className="chip-icon">
            <FiTrendingUp />
          </div>
          <div className="chip-content">
            <span className="chip-label">LƯỢT DẬP PRESS</span>
            <span className="chip-value">{kpiData.totalPress.toLocaleString("en-US")}</span>
            <span className="chip-sub">Lũy kế dập thực tế</span>
          </div>
        </div>

        {/* 6. Phân Bổ Nhà Máy */}
        <div className="mobile-kpi-chip mobile-kpi-chip--amber">
          <div className="chip-icon">
            <FiSliders />
          </div>
          <div className="chip-content">
            <span className="chip-label">CƠ CẤU NHÀ MÁY</span>
            <span className="chip-value">{kpiData.nm1Count} <small>NM1</small></span>
            <span className="chip-sub">NM2: {kpiData.nm2Count} bộ</span>
          </div>
        </div>
      </div>

      {/* Nút đóng nhanh giải phóng không gian */}
      <button
        type="button"
        className="btn-close-mobile-kpi"
        onClick={onClose}
        title="Đóng dải KPI"
      >
        <FiX size={13} />
      </button>
    </div>
  );
};

export default React.memo(PrecisionDaoFilmDataMobileKpi);
