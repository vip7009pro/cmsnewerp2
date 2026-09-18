import React from "react";
import { FiTarget, FiCalendar, FiBarChart2, FiDownload } from "react-icons/fi";
import { SaveExcel } from "../../../../api/services/excelService";
import { SX_ACHIVE_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import SXDailyAchiveTrend from "../../../../components/Chart/SX/SXDailyAchiveTrend";
import SXWeeklyAchiveTrend from "../../../../components/Chart/SX/SXWeeklyAchiveTrend";
import SXMonthlyAchiveTrend from "../../../../components/Chart/SX/SXMonthlyAchiveTrend";
import SXYearlyAchiveTrend from "../../../../components/Chart/SX/SXYearlyAchiveTrend";

interface PrecisionSxReportAchiveSectionProps {
  dailyAchiveData: SX_ACHIVE_DATA[];
  weeklyAchiveData: SX_ACHIVE_DATA[];
  monthlyAchiveData: SX_ACHIVE_DATA[];
  yearlyAchiveData: SX_ACHIVE_DATA[];
}

const PrecisionSxReportAchiveSection: React.FC<PrecisionSxReportAchiveSectionProps> = ({
  dailyAchiveData,
  weeklyAchiveData,
  monthlyAchiveData,
  yearlyAchiveData,
}) => {
  return (
    <div className="precision-sx-section">
      <div className="precision-sx-section__header">
        <div className="section-badge-title">
          <span className="icon-circle">
            <FiTarget />
          </span>
          <span>2. Báo Cáo Tỷ Lệ Đạt Kế Hoạch Sản Xuất (Achievement Rate Analytics)</span>
        </div>
      </div>

      {/* Cặp Biểu Đồ 1: Daily & Weekly Achive */}
      <div className="two-col-grid">
        {/* Daily Achive */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiCalendar size={13} color="#0284c7" />
              <span className="executive-card__title">Daily Achievement Rate (Tỷ Lệ Đạt Theo Ngày)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(dailyAchiveData, "Daily_Achive_Data")}
              title="Xuất Excel Daily Achive"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <SXDailyAchiveTrend
              dldata={dailyAchiveData}
              processColor="#f1f5c8"
              materialColor="#74c938"
            />
          </div>
        </div>

        {/* Weekly Achive */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiBarChart2 size={13} color="#059669" />
              <span className="executive-card__title">Weekly Achievement Rate (Tỷ Lệ Đạt Theo Tuần)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(weeklyAchiveData, "Weekly_Achive_Data")}
              title="Xuất Excel Weekly Achive"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <SXWeeklyAchiveTrend
              dldata={[...weeklyAchiveData].reverse()}
              processColor="#f1f5c8"
              materialColor="#74c938"
            />
          </div>
        </div>
      </div>

      {/* Cặp Biểu Đồ 2: Monthly & Yearly Achive */}
      <div className="two-col-grid">
        {/* Monthly Achive */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiCalendar size={13} color="#d97706" />
              <span className="executive-card__title">Monthly Achievement Rate (Tỷ Lệ Đạt Theo Tháng)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(monthlyAchiveData, "Monthly_Achive_Data")}
              title="Xuất Excel Monthly Achive"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <SXMonthlyAchiveTrend
              dldata={[...monthlyAchiveData].reverse()}
              processColor="#f1f5c8"
              materialColor="#74c938"
            />
          </div>
        </div>

        {/* Yearly Achive */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiBarChart2 size={13} color="#dc2626" />
              <span className="executive-card__title">Yearly Achievement Rate (Tỷ Lệ Đạt Theo Năm)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(yearlyAchiveData, "Yearly_Achive_Data")}
              title="Xuất Excel Yearly Achive"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <SXYearlyAchiveTrend
              dldata={[...yearlyAchiveData].reverse()}
              processColor="#f1f5c8"
              materialColor="#74c938"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { PrecisionSxReportAchiveSection };
export default React.memo(PrecisionSxReportAchiveSection);
