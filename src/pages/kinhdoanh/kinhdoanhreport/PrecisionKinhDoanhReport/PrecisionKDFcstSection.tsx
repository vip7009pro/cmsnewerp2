import React from "react";
import { FiTarget, FiTrendingUp } from "react-icons/fi";
import ChartFCSTSamSung from "../../../../components/Chart/KD/ChartFCSTSamSung";
import Widget from "../../../../components/Widget/Widget";
import { FCSTAmountData } from "./kdReportQueries";

interface PrecisionKDFcstSectionProps {
  fcstData: FCSTAmountData;
}

const PrecisionKDFcstSection: React.FC<PrecisionKDFcstSectionProps> = ({ fcstData }) => {
  return (
    <div className="precision-kd-section">
      <div className="precision-kd-section__header">
        <div className="section-badge-title">
          <span className="icon-circle" style={{ backgroundColor: "#fdf4ff", color: "#a855f7" }}>
            <FiTarget />
          </span>
          <span>Dự Báo Kinh Doanh (Samsung Forecast Analytics)</span>
        </div>
      </div>

      {/* 2 Thẻ FCST 4 Tuần và 8 Tuần */}
      <div className="two-col-grid">
        {/* FCST 4W */}
        <div className="executive-card" style={{ borderLeft: "4px solid #a855f7" }}>
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiTarget size={13} color="#a855f7" />
              <span className="executive-card__title">FCST AMOUNT (4 WEEKS) - Tuần W{fcstData.FCSTWEEKNO}</span>
            </div>
          </div>
          <div className="executive-card__widget-slot">
            <Widget
              widgettype="revenue"
              label="FCST AMOUNT(4 WEEK)"
              topColor="#eb99ff"
              botColor="#99ccff"
              qty={fcstData.FCST4W_QTY * 1}
              amount={fcstData.FCST4W_AMOUNT}
              percentage={0}
            />
          </div>
        </div>

        {/* FCST 8W */}
        <div className="executive-card" style={{ borderLeft: "4px solid #f59e0b" }}>
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiTrendingUp size={13} color="#d97706" />
              <span className="executive-card__title">FCST AMOUNT (8 WEEKS) - Tuần W{fcstData.FCSTWEEKNO}</span>
            </div>
          </div>
          <div className="executive-card__widget-slot">
            <Widget
              widgettype="revenue"
              label="FCST AMOUNT(8 WEEK)"
              topColor="#e6e600"
              botColor="#ff99c2"
              qty={fcstData.FCST8W_QTY * 1}
              amount={fcstData.FCST8W_AMOUNT}
              percentage={0}
            />
          </div>
        </div>
      </div>

      {/* Biểu Đồ Samsung FCST 2 Tuần Liền Kề */}
      <div className="one-col-grid">
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiTarget size={13} color="#2563eb" />
              <span className="executive-card__title">Samsung Forecast (So Sánh FCST 2 Tuần Liền Kề)</span>
            </div>
          </div>
          <div className="executive-card__body executive-card__body--chart-lg">
            <ChartFCSTSamSung />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKDFcstSection);
