import React from "react";
import { FiTrendingDown, FiCalendar, FiBarChart2, FiDownload, FiCpu } from "react-icons/fi";
import { SaveExcel } from "../../../../api/services/excelService";
import { getCompany } from "../../../../api/Api";
import { PLAN_LOSS_DATA, SX_TREND_LOSS_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import SX_DailyLossTrend from "../../../../components/Chart/SX/SX_DailyLossTrend";
import SX_WeeklyLossTrend from "../../../../components/Chart/SX/SX_WeeklyLossTrend";
import SX_MonthlyLossTrend from "../../../../components/Chart/SX/SX_MonthlyLossTrend";
import SX_YearlyLossTrend from "../../../../components/Chart/SX/SX_YearlyLossTrend";
import SXPlanLossTrend from "../../../../components/Chart/SX/SXPlanLossTrend";

interface PrecisionSxReportLossSectionProps {
  dailyLossData: SX_TREND_LOSS_DATA[];
  weeklyLossData: SX_TREND_LOSS_DATA[];
  monthlyLossData: SX_TREND_LOSS_DATA[];
  yearlyLossData: SX_TREND_LOSS_DATA[];
  planLossData: PLAN_LOSS_DATA[];
  selectedMachine: string;
}

const PrecisionSxReportLossSection: React.FC<PrecisionSxReportLossSectionProps> = ({
  dailyLossData,
  weeklyLossData,
  monthlyLossData,
  yearlyLossData,
  planLossData,
  selectedMachine,
}) => {
  return (
    <div className="precision-sx-section">
      <div className="precision-sx-section__header">
        <div className="section-badge-title">
          <span className="icon-circle">
            <FiTrendingDown />
          </span>
          <span>1. Báo Cáo Xu Hướng Tổn Thất Sản Xuất (Production Loss Analytics)</span>
        </div>
      </div>

      {/* Cặp Biểu Đồ 1: Daily & Weekly Loss */}
      <div className="two-col-grid">
        {/* Daily Loss */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiCalendar size={13} color="#0284c7" />
              <span className="executive-card__title">Daily Loss Trend (Tổn Thất Theo Ngày)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(dailyLossData, "Daily_Loss_Data")}
              title="Xuất Excel Daily Loss"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <SX_DailyLossTrend
              dldata={dailyLossData}
              processColor="#53eb34"
              materialColor="#ff0000"
            />
          </div>
        </div>

        {/* Weekly Loss */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiBarChart2 size={13} color="#059669" />
              <span className="executive-card__title">Weekly Loss Trend (Tổn Thất Theo Tuần)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(weeklyLossData, "Weekly_Loss_Data")}
              title="Xuất Excel Weekly Loss"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <SX_WeeklyLossTrend
              dldata={[...weeklyLossData].reverse()}
              processColor="#53eb34"
              materialColor="#ff0000"
            />
          </div>
        </div>
      </div>

      {/* Cặp Biểu Đồ 2: Monthly & Yearly Loss */}
      <div className="two-col-grid">
        {/* Monthly Loss */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiCalendar size={13} color="#d97706" />
              <span className="executive-card__title">Monthly Loss Trend (Tổn Thất Theo Tháng)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(monthlyLossData, "Monthly_Loss_Data")}
              title="Xuất Excel Monthly Loss"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <SX_MonthlyLossTrend
              dldata={[...monthlyLossData].reverse()}
              processColor="#53eb34"
              materialColor="#ff0000"
            />
          </div>
        </div>

        {/* Yearly Loss */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiBarChart2 size={13} color="#dc2626" />
              <span className="executive-card__title">Yearly Loss Trend (Tổn Thất Theo Năm)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(yearlyLossData, "Yearly_Loss_Data")}
              title="Xuất Excel Yearly Loss"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <SX_YearlyLossTrend
              dldata={[...yearlyLossData].reverse()}
              processColor="#53eb34"
              materialColor="#ff0000"
            />
          </div>
        </div>
      </div>

      {/* Biểu đồ Plan Loss theo máy (chỉ hiện khi CMS) */}
      {getCompany() === "CMS" && (
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiCpu size={13} color="#7c3aed" />
              <span className="executive-card__title">
                Plan Loss Graph By Machine (Tổn Thất Theo Kế Hoạch Máy: {selectedMachine})
              </span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(planLossData, `SX_Plan_Loss_${selectedMachine}`)}
              title="Xuất Excel Plan Loss"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <SXPlanLossTrend
              dldata={planLossData}
              processColor="#72c7ff"
              materialColor="#ad9f26"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { PrecisionSxReportLossSection };
export default React.memo(PrecisionSxReportLossSection);
