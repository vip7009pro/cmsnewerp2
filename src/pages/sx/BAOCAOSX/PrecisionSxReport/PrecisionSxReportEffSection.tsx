import React from "react";
import { FiZap, FiCalendar, FiBarChart2, FiDownload, FiPieChart } from "react-icons/fi";
import { SaveExcel } from "../../../../api/services/excelService";
import { PRODUCTION_EFFICIENCY_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import CIRCLE_COMPONENT from "../../../qlsx/QLSXPLAN/CAPA/CIRCLE_COMPONENT/CIRCLE_COMPONENT";
import SXDailyEffTrend from "../../../../components/Chart/SX/SXDailyEffTrend";
import SXWeeklyEffTrend from "../../../../components/Chart/SX/SXWeeklyEffTrend";
import SXMonthlyEffTrend from "../../../../components/Chart/SX/SXMonthlyEffTrend";
import SXYearlyEffTrend from "../../../../components/Chart/SX/SXYearlyEffTrend";

interface PrecisionSxReportEffSectionProps {
  overview: PRODUCTION_EFFICIENCY_DATA;
  dailyEffData: PRODUCTION_EFFICIENCY_DATA[];
  weeklyEffData: PRODUCTION_EFFICIENCY_DATA[];
  monthlyEffData: PRODUCTION_EFFICIENCY_DATA[];
  yearlyEffData: PRODUCTION_EFFICIENCY_DATA[];
}

const PrecisionSxReportEffSection: React.FC<PrecisionSxReportEffSectionProps> = ({
  overview,
  dailyEffData,
  weeklyEffData,
  monthlyEffData,
  yearlyEffData,
}) => {
  return (
    <div className="precision-sx-section">
      <div className="precision-sx-section__header">
        <div className="section-badge-title">
          <span className="icon-circle">
            <FiZap />
          </span>
          <span>3. Báo Cáo Hiệu Suất Vận Hành Sản Xuất (OEE & Efficiency Analytics)</span>
        </div>
      </div>

      {/* Khối OEE Tổng Quan (Vòng Tròn Tỷ Lệ & Thời Gian) */}
      <div className="oee-overview-panel">
        <div className="oee-overview-panel__header">
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <FiPieChart size={13} color="#0284c7" />
            <span>Tổng Quan Thời Gian Vận Hành & Hiệu Suất Máy (OEE Summary)</span>
          </div>
        </div>
        <div className="oee-overview-panel__circles-grid">
          <CIRCLE_COMPONENT
            type="timesummary"
            value={`${overview?.OPERATION_RATE?.toLocaleString("en-US", { style: "percent" }) ?? "0%"}`}
            title="OPERATION RATE"
            color="#ef4444"
          />
          <CIRCLE_COMPONENT
            type="timesummary"
            value={`${overview?.HIEU_SUAT_TIME?.toLocaleString("en-US", { style: "percent" }) ?? "0%"}`}
            title="PROD EFFICIENCY"
            color="#ec4899"
          />
          <CIRCLE_COMPONENT
            type="timesummary"
            value={`${overview?.SETTING_TIME_RATE?.toLocaleString("en-US", { style: "percent" }) ?? "0%"}`}
            title="EQ EFFICIENCY"
            color="#10b981"
          />
          <CIRCLE_COMPONENT
            type="time"
            value={`${overview?.ALVB_TIME?.toLocaleString("en-US") ?? 0} min`}
            title="AVLB TIME"
            color="#2563eb"
          />
          <CIRCLE_COMPONENT
            type="time"
            value={`${overview?.TOTAL_TIME?.toLocaleString("en-US") ?? 0} min`}
            title="TT PROD TIME"
            color="#8b5cf6"
          />
          <CIRCLE_COMPONENT
            type="time"
            value={`${overview?.SETTING_TIME?.toLocaleString("en-US") ?? 0} min`}
            title="SETTING TIME"
            color="#f97316"
          />
          <CIRCLE_COMPONENT
            type="time"
            value={`${overview?.PURE_RUN_TIME?.toLocaleString("en-US") ?? 0} min`}
            title="RUN TIME"
            color="#16a34a"
          />
          <CIRCLE_COMPONENT
            type="time"
            value={`${overview?.LOSS_TIME?.toLocaleString("en-US") ?? 0} min`}
            title="LOSS TIME"
            color="#dc2626"
          />
        </div>
      </div>

      {/* Cặp Biểu Đồ 1: Daily & Weekly Eff */}
      <div className="two-col-grid">
        {/* Daily Eff */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiCalendar size={13} color="#0284c7" />
              <span className="executive-card__title">Daily Efficiency Rate (Hiệu Suất Theo Ngày)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(dailyEffData, "Daily_EFF_Rate")}
              title="Xuất Excel Daily EFF"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <SXDailyEffTrend
              dldata={[...dailyEffData].reverse()}
              processColor="#f1f5c8"
              materialColor="#74c938"
            />
          </div>
        </div>

        {/* Weekly Eff */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiBarChart2 size={13} color="#059669" />
              <span className="executive-card__title">Weekly Efficiency Rate (Hiệu Suất Theo Tuần)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(weeklyEffData, "Weekly_EFF_Rate")}
              title="Xuất Excel Weekly EFF"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <SXWeeklyEffTrend
              dldata={[...weeklyEffData].reverse()}
              processColor="#f1f5c8"
              materialColor="#74c938"
            />
          </div>
        </div>
      </div>

      {/* Cặp Biểu Đồ 2: Monthly & Yearly Eff */}
      <div className="two-col-grid">
        {/* Monthly Eff */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiCalendar size={13} color="#d97706" />
              <span className="executive-card__title">Monthly Efficiency Rate (Hiệu Suất Theo Tháng)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(monthlyEffData, "Monthly_EFF_Rate")}
              title="Xuất Excel Monthly EFF"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <SXMonthlyEffTrend
              dldata={[...monthlyEffData].reverse()}
              processColor="#f1f5c8"
              materialColor="#74c938"
            />
          </div>
        </div>

        {/* Yearly Eff */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiBarChart2 size={13} color="#dc2626" />
              <span className="executive-card__title">Yearly Efficiency Rate (Hiệu Suất Theo Năm)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(yearlyEffData, "Yearly_EFF_Rate")}
              title="Xuất Excel Yearly EFF"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <SXYearlyEffTrend
              dldata={[...yearlyEffData].reverse()}
              processColor="#f1f5c8"
              materialColor="#74c938"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { PrecisionSxReportEffSection };
export default React.memo(PrecisionSxReportEffSection);
