import React from "react";
import { FiTrendingUp, FiDownload, FiCalendar } from "react-icons/fi";
import { SaveExcel } from "../../../../api/services/excelService";
import CSDailyConfirm from "../../../../components/Chart/CS/CSDailyConfirm";
import CSWeeklyConfirm from "../../../../components/Chart/CS/CSWeeklyConfirm";
import CSMonthlyConfirm from "../../../../components/Chart/CS/CSMonthlyConfirm";
import CSYearlyConfirm from "../../../../components/Chart/CS/CSYearlyConfirm";
import { CS_CONFIRM_TRENDING_DATA } from "../../interfaces/qcInterface";

interface Props {
  dailyppm: CS_CONFIRM_TRENDING_DATA[];
  weeklyppm: CS_CONFIRM_TRENDING_DATA[];
  monthlyppm: CS_CONFIRM_TRENDING_DATA[];
  yearlyppm: CS_CONFIRM_TRENDING_DATA[];
}

export const PrecisionCSReportFeedbackSection: React.FC<Props> = ({
  dailyppm,
  weeklyppm,
  monthlyppm,
  yearlyppm,
}) => {
  return (
    <div className="pcs-section">
      <div className="pcs-section__header">
        <div className="pcs-section__title-group">
          <FiTrendingUp size={14} color="#2563eb" />
          <h2 className="pcs-section__title">Xu Hướng Phản Hồi Sự Cố Khách Hàng (Customer Issue Feedback Trending)</h2>
          <span className="pcs-section__tag">4 Chu Kỳ</span>
        </div>
      </div>

      <div className="pcs-section__grid">
        {/* Daily Issue Card */}
        <div className="pcs-chart-card">
          <div className="pcs-chart-card__top">
            <div className="pcs-chart-card__title-area">
              <FiCalendar size={12} color="#2563eb" />
              <span className="pcs-chart-card__title">Daily Issue (Theo Ngày)</span>
              <span className="pcs-chart-card__badge">14 Ngày</span>
            </div>
            <button
              type="button"
              className="pcs-chart-card__btn-excel"
              onClick={() => SaveExcel(dailyppm, "CS_Daily_Issues")}
              title="Xuất Excel dữ liệu sự cố theo ngày"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="pcs-chart-card__chart-body">
            <CSDailyConfirm
              dldata={[...dailyppm].reverse()}
              processColor="#3b82f6"
              materialColor="#10b981"
            />
          </div>
        </div>

        {/* Weekly Issue Card */}
        <div className="pcs-chart-card">
          <div className="pcs-chart-card__top">
            <div className="pcs-chart-card__title-area">
              <FiTrendingUp size={12} color="#059669" />
              <span className="pcs-chart-card__title">Weekly Issue (Theo Tuần)</span>
              <span className="pcs-chart-card__badge">10 Tuần</span>
            </div>
            <button
              type="button"
              className="pcs-chart-card__btn-excel"
              onClick={() => SaveExcel(weeklyppm, "CS_Weekly_Issues")}
              title="Xuất Excel dữ liệu sự cố theo tuần"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="pcs-chart-card__chart-body">
            <CSWeeklyConfirm
              dldata={[...weeklyppm].reverse()}
              processColor="#3b82f6"
              materialColor="#10b981"
            />
          </div>
        </div>

        {/* Monthly Issue Card */}
        <div className="pcs-chart-card">
          <div className="pcs-chart-card__top">
            <div className="pcs-chart-card__title-area">
              <FiCalendar size={12} color="#d97706" />
              <span className="pcs-chart-card__title">Monthly Issue (Theo Tháng)</span>
              <span className="pcs-chart-card__badge">12 Tháng</span>
            </div>
            <button
              type="button"
              className="pcs-chart-card__btn-excel"
              onClick={() => SaveExcel(monthlyppm, "CS_Monthly_Issues")}
              title="Xuất Excel dữ liệu sự cố theo tháng"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="pcs-chart-card__chart-body">
            <CSMonthlyConfirm
              dldata={[...monthlyppm].reverse()}
              processColor="#3b82f6"
              materialColor="#10b981"
            />
          </div>
        </div>

        {/* Yearly Issue Card */}
        <div className="pcs-chart-card">
          <div className="pcs-chart-card__top">
            <div className="pcs-chart-card__title-area">
              <FiTrendingUp size={12} color="#7c3aed" />
              <span className="pcs-chart-card__title">Yearly Issue (Theo Năm)</span>
              <span className="pcs-chart-card__badge">10 Năm</span>
            </div>
            <button
              type="button"
              className="pcs-chart-card__btn-excel"
              onClick={() => SaveExcel(yearlyppm, "CS_Yearly_Issues")}
              title="Xuất Excel dữ liệu sự cố theo năm"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="pcs-chart-card__chart-body">
            <CSYearlyConfirm
              dldata={[...yearlyppm].reverse()}
              processColor="#3b82f6"
              materialColor="#10b981"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCSReportFeedbackSection);
