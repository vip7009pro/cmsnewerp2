import React from "react";
import { FiCheckCircle, FiAlertTriangle, FiLayers, FiX, FiBookmark } from "react-icons/fi";
import { DaoFilmReportWidgetData } from "../../utils/daoFilmReportUtils";

interface PrecisionDaoFilmReportMobileKpiProps {
  widgetData: DaoFilmReportWidgetData;
  selectedKnife: { MA_DAO: string; MA_DAO_KT: string } | null;
  onClose: () => void;
}

export const PrecisionDaoFilmReportMobileKpi: React.FC<PrecisionDaoFilmReportMobileKpiProps> = ({
  widgetData,
  selectedKnife,
  onClose,
}) => {
  const okRate =
    widgetData.Total_Knife > 0
      ? ((widgetData.Total_OK_Knife / widgetData.Total_Knife) * 100).toFixed(1)
      : "100";

  return (
    <div className="precision-dfr-mobile-kpi-bar">
      <div className="kpi-scroll-track">
        {/* Card 1: Tổng số dao */}
        <div className="kpi-card kpi-card--total">
          <div className="kpi-card__header">
            <FiLayers size={13} className="kpi-icon" />
            <span className="kpi-label">Tổng Số Dao</span>
          </div>
          <div className="kpi-card__main">
            <span className="kpi-value">{widgetData.Total_Knife.toLocaleString("en-US")}</span>
            <span className="kpi-unit">dao</span>
          </div>
          <div className="kpi-card__sub">Toàn bộ danh mục</div>
        </div>

        {/* Card 2: Số dao OK */}
        <div className="kpi-card kpi-card--ok">
          <div className="kpi-card__header">
            <FiCheckCircle size={13} className="kpi-icon" />
            <span className="kpi-label">Dao Đạt Chuẩn</span>
          </div>
          <div className="kpi-card__main">
            <span className="kpi-value">{widgetData.Total_OK_Knife.toLocaleString("en-US")}</span>
            <span className="kpi-unit">{okRate}%</span>
          </div>
          <div className="kpi-card__sub">Trong định mức dập</div>
        </div>

        {/* Card 3: Số dao NG / Vượt ĐM */}
        <div
          className={`kpi-card ${
            widgetData.Total_NG_Knife > 0 ? "kpi-card--warn" : "kpi-card--safe"
          }`}
        >
          <div className="kpi-card__header">
            <FiAlertTriangle size={13} className="kpi-icon" />
            <span className="kpi-label">Vượt Định Mức</span>
          </div>
          <div className="kpi-card__main">
            <span className="kpi-value">{widgetData.Total_NG_Knife.toLocaleString("en-US")}</span>
            <span className="kpi-unit">dao NG</span>
          </div>
          <div className="kpi-card__sub">Cần bảo dưỡng / thay thế</div>
        </div>

        {/* Card 4: Dao đang chọn */}
        <div className="kpi-card kpi-card--selected">
          <div className="kpi-card__header">
            <FiBookmark size={13} className="kpi-icon" />
            <span className="kpi-label">Dao Đang Chọn</span>
          </div>
          <div className="kpi-card__main">
            <span className="kpi-value kpi-value--knife">
              {selectedKnife ? selectedKnife.MA_DAO : "—"}
            </span>
          </div>
          <div className="kpi-card__sub">
            {selectedKnife ? selectedKnife.MA_DAO_KT : "Chạm 1 dòng để xem"}
          </div>
        </div>
      </div>

      {/* Nút đóng nhanh dải KPI để giải phóng 100% diện tích màn hình */}
      <button
        type="button"
        className="kpi-close-btn"
        onClick={onClose}
        title="Đóng dải KPI để mở rộng bảng"
      >
        <FiX size={12} />
      </button>
    </div>
  );
};

export default React.memo(PrecisionDaoFilmReportMobileKpi);
