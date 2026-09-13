import React from "react";
import { FiBarChart2, FiPieChart, FiDownload, FiUsers, FiCalendar } from "react-icons/fi";
import { SaveExcel } from "../../../../api/services/excelService";
import ChartDaily from "../../../../components/Chart/KD/KDDailyClosing";
import ChartWeekLy from "../../../../components/Chart/KD/KDWeeklyClosing";
import ChartMonthLy from "../../../../components/Chart/KD/KDMonthlyClosing";
import ChartYearly from "../../../../components/Chart/KD/KDYearlyClosing";
import ChartCustomerRevenue from "../../../../components/Chart/KD/KDChartCustomerRevenue";
import ChartPICRevenue from "../../../../components/Chart/KD/ChartPICRevenue";
import { DailyClosingData, YearlyClosingData } from "./kdReportQueries";
import { CUSTOMER_REVENUE_DATA, MonthlyClosingData, PIC_REVENUE_DATA } from "../../interfaces/kdInterface";
import { WeeklyClosingData } from "../../../../api/GlobalInterface";

interface PrecisionKDClosingSectionProps {
  yesterdayData: DailyClosingData[];
  thisWeekData: WeeklyClosingData[];
  thisMonthData: MonthlyClosingData[];
  thisYearData: YearlyClosingData[];
  customerRevenue: CUSTOMER_REVENUE_DATA[];
  picRevenue: PIC_REVENUE_DATA[];
}

const PrecisionKDClosingSection: React.FC<PrecisionKDClosingSectionProps> = ({
  yesterdayData,
  thisWeekData,
  thisMonthData,
  thisYearData,
  customerRevenue,
  picRevenue,
}) => {
  return (
    <div className="precision-kd-section">
      <div className="precision-kd-section__header">
        <div className="section-badge-title">
          <span className="icon-circle"><FiBarChart2 /></span>
          <span>Biểu Đồ Doanh Thu & Chốt Số (Revenue & Closing Analytics)</span>
        </div>
      </div>

      {/* Cặp Biểu Đồ 1: Daily & Weekly */}
      <div className="two-col-grid">
        {/* Daily Closing */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiCalendar size={13} color="#2563eb" />
              <span className="executive-card__title">Daily Closing (Chốt Ngày)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(yesterdayData, "DailyClosing")}
              title="Xuất Excel dữ liệu chốt ngày"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <ChartDaily data={yesterdayData} />
          </div>
        </div>

        {/* Weekly Closing */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiBarChart2 size={13} color="#059669" />
              <span className="executive-card__title">Weekly Closing (Chốt Tuần)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(thisWeekData, "WeeklyClosing")}
              title="Xuất Excel dữ liệu chốt tuần"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <ChartWeekLy data={thisWeekData} />
          </div>
        </div>
      </div>

      {/* Cặp Biểu Đồ 2: Monthly & Yearly */}
      <div className="two-col-grid">
        {/* Monthly Closing */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiCalendar size={13} color="#d97706" />
              <span className="executive-card__title">Monthly Closing (Chốt Tháng)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(thisMonthData, "MonthlyClosing")}
              title="Xuất Excel dữ liệu chốt tháng"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <ChartMonthLy data={thisMonthData} />
          </div>
        </div>

        {/* Yearly Closing */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiBarChart2 size={13} color="#dc2626" />
              <span className="executive-card__title">Yearly Closing (Chốt Năm)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(thisYearData, "YearlyClosing")}
              title="Xuất Excel dữ liệu chốt năm"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <ChartYearly data={thisYearData} />
          </div>
        </div>
      </div>

      {/* Cặp Biểu Đồ 3: Top 5 Khách Hàng & Doanh Thu PIC */}
      <div className="two-col-grid">
        {/* Top 5 Customer Weekly Revenue */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiPieChart size={13} color="#7c3aed" />
              <span className="executive-card__title">Top 5 Customer Weekly Revenue</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(customerRevenue, "Customer Revenue")}
              title="Xuất Excel doanh thu top 5 khách hàng"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart-lg">
            <ChartCustomerRevenue data={customerRevenue} />
          </div>
        </div>

        {/* PIC Weekly Revenue */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiUsers size={13} color="#0284c7" />
              <span className="executive-card__title">PIC Weekly Revenue (Doanh Thu Phụ Trách)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(picRevenue, "PIC Revenue")}
              title="Xuất Excel doanh thu theo nhân viên"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart-lg">
            <ChartPICRevenue data={picRevenue} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKDClosingSection);
