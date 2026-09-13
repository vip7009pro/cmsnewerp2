import React from "react";
import { FiAlertTriangle, FiDownload } from "react-icons/fi";
import { SaveExcel } from "../../../../api/services/excelService";
import KDDailyOverdue from "../../../../components/Chart/KD/KDDailyOverdue";
import KDWeeklyOverdue from "../../../../components/Chart/KD/KDWeeklyOverdue";
import KDMonthlyOverdue from "../../../../components/Chart/KD/KDMonthlyOverdue";
import KDYearlyOverdue from "../../../../components/Chart/KD/KDYearlyOverdue";
import { OVERDUE_DATA } from "../../interfaces/kdInterface";

interface PrecisionKDOverdueSectionProps {
  dailyOverdueData: OVERDUE_DATA[];
  weeklyOverdueData: OVERDUE_DATA[];
  monthlyOverdueData: OVERDUE_DATA[];
  yearlyOverdueData: OVERDUE_DATA[];
}

const PrecisionKDOverdueSection: React.FC<PrecisionKDOverdueSectionProps> = ({
  dailyOverdueData,
  weeklyOverdueData,
  monthlyOverdueData,
  yearlyOverdueData,
}) => {
  return (
    <div className="precision-kd-section">
      <div className="precision-kd-section__header">
        <div className="section-badge-title">
          <span className="icon-circle" style={{ backgroundColor: "#fff1f2", color: "#e11d48" }}>
            <FiAlertTriangle />
          </span>
          <span>Báo Cáo Tỷ Lệ Giao Hàng & Trễ Hạn (Delivery Overdue Analytics)</span>
        </div>
      </div>

      {/* 4 Biểu Đồ Overdue: Daily, Weekly, Monthly, Yearly */}
      <div className="two-col-grid">
        {/* Daily Overdue */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiAlertTriangle size={13} color="#e11d48" />
              <span className="executive-card__title">Daily Overdue (Trễ Hạn Ngày)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(dailyOverdueData, "dailyOverdueData")}
              title="Xuất Excel trễ hạn ngày"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <KDDailyOverdue processColor="#53eb34" materialColor="#ff0000" dldata={[...dailyOverdueData].reverse()} />
          </div>
        </div>

        {/* Weekly Overdue */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiAlertTriangle size={13} color="#f59e0b" />
              <span className="executive-card__title">Weekly Overdue (Trễ Hạn Tuần)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(weeklyOverdueData, "weeklyOverdueData")}
              title="Xuất Excel trễ hạn tuần"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <KDWeeklyOverdue processColor="#53eb34" materialColor="#ff0000" dldata={[...weeklyOverdueData].reverse()} />
          </div>
        </div>

        {/* Monthly Overdue */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiAlertTriangle size={13} color="#0284c7" />
              <span className="executive-card__title">Monthly Overdue (Trễ Hạn Tháng)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(monthlyOverdueData, "monthlyOverdueData")}
              title="Xuất Excel trễ hạn tháng"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <KDMonthlyOverdue processColor="#53eb34" materialColor="#ff0000" dldata={[...monthlyOverdueData].reverse()} />
          </div>
        </div>

        {/* Yearly Overdue */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiAlertTriangle size={13} color="#7c3aed" />
              <span className="executive-card__title">Yearly Overdue (Trễ Hạn Năm)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(yearlyOverdueData, "yearlyOverdueData")}
              title="Xuất Excel trễ hạn năm"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <KDYearlyOverdue processColor="#53eb34" materialColor="#ff0000" dldata={[...yearlyOverdueData].reverse()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKDOverdueSection);
