import React from "react";
import { FiBarChart2, FiCalendar, FiDownload, FiTrendingUp } from "react-icons/fi";
import { SaveExcel } from "../../../../api/services/excelService";
import { RND_NEWCODE_TREND_DATA } from "../../interfaces/rndInterface";
import RNDDailyNewCode from "../../../../components/Chart/RND/RNDDailyNewCode";
import RNDWeeklyNewCode from "../../../../components/Chart/RND/RNDWeeklyNewCode";
import RNDMonthlyNewCode from "../../../../components/Chart/RND/RNDMonthlyNewCode";
import RNDYearlyNewCode from "../../../../components/Chart/RND/RNDYearlyNewCode";

interface TrendingSectionProps {
  dailyData: RND_NEWCODE_TREND_DATA[];
  weeklyData: RND_NEWCODE_TREND_DATA[];
  monthlyData: RND_NEWCODE_TREND_DATA[];
  yearlyData: RND_NEWCODE_TREND_DATA[];
}

export const PrecisionRNDTrendingSection: React.FC<TrendingSectionProps> = React.memo(
  ({ dailyData, weeklyData, monthlyData, yearlyData }) => {
    return (
      <div className="precision-rnd-report__section">
        <div className="precision-rnd-report__sectionHeader">
          <div className="section-badge-title">
            <span className="icon-circle">
              <FiTrendingUp />
            </span>
            <span>Xu Hướng Phát Triển Mã Mới (R&D New Code Trending)</span>
          </div>
        </div>

        {/* CẶP 1: DAILY & WEEKLY */}
        <div className="two-col-grid">
          {/* DAILY NEW CODE */}
          <div className="executive-card">
            <div className="executive-card__header">
              <div className="executive-card__title-wrap">
                <FiCalendar size={13} color="#2563eb" />
                <span>Daily New Code (Xu Hướng Theo Ngày)</span>
              </div>
              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={() => SaveExcel(dailyData, "Daily New Code Data")}
                title="Xuất Excel dữ liệu mã mới theo ngày"
              >
                <FiDownload size={11} />
                <span>Excel</span>
              </button>
            </div>
            <div className="executive-card__body">
              <RNDDailyNewCode
                dldata={[...dailyData].reverse()}
                processColor="#10b981"
                materialColor="#f43f5e"
              />
            </div>
          </div>

          {/* WEEKLY NEW CODE */}
          <div className="executive-card">
            <div className="executive-card__header">
              <div className="executive-card__title-wrap">
                <FiBarChart2 size={13} color="#059669" />
                <span>Weekly New Code (Xu Hướng Theo Tuần)</span>
              </div>
              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={() => SaveExcel(weeklyData, "Weekly New Code Data")}
                title="Xuất Excel dữ liệu mã mới theo tuần"
              >
                <FiDownload size={11} />
                <span>Excel</span>
              </button>
            </div>
            <div className="executive-card__body">
              <RNDWeeklyNewCode
                dldata={[...weeklyData].reverse()}
                processColor="#10b981"
                materialColor="#f43f5e"
              />
            </div>
          </div>
        </div>

        {/* CẶP 2: MONTHLY & YEARLY */}
        <div className="two-col-grid">
          {/* MONTHLY NEW CODE */}
          <div className="executive-card">
            <div className="executive-card__header">
              <div className="executive-card__title-wrap">
                <FiCalendar size={13} color="#d97706" />
                <span>Monthly New Code (Xu Hướng Theo Tháng)</span>
              </div>
              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={() => SaveExcel(monthlyData, "Monthly New Code Data")}
                title="Xuất Excel dữ liệu mã mới theo tháng"
              >
                <FiDownload size={11} />
                <span>Excel</span>
              </button>
            </div>
            <div className="executive-card__body">
              <RNDMonthlyNewCode
                dldata={[...monthlyData].reverse()}
                processColor="#10b981"
                materialColor="#f43f5e"
              />
            </div>
          </div>

          {/* YEARLY NEW CODE */}
          <div className="executive-card">
            <div className="executive-card__header">
              <div className="executive-card__title-wrap">
                <FiBarChart2 size={13} color="#7c3aed" />
                <span>Yearly New Code (Xu Hướng Theo Năm)</span>
              </div>
              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={() => SaveExcel(yearlyData, "Yearly New Code Data")}
                title="Xuất Excel dữ liệu mã mới theo năm"
              >
                <FiDownload size={11} />
                <span>Excel</span>
              </button>
            </div>
            <div className="executive-card__body">
              <RNDYearlyNewCode
                dldata={[...yearlyData].reverse()}
                processColor="#10b981"
                materialColor="#f43f5e"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PrecisionRNDTrendingSection.displayName = "PrecisionRNDTrendingSection";
