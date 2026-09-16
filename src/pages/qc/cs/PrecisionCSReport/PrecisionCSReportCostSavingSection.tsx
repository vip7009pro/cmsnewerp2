import React from "react";
import { FiDollarSign, FiDownload, FiCalendar, FiTrendingUp } from "react-icons/fi";
import { SaveExcel } from "../../../../api/services/excelService";
import { CS_REDUCE_AMOUNT_DATA } from "../../interfaces/qcInterface";
import { nFormatter } from "../../../../api/services/utilService";
import { getGlobalSetting } from "../../../../api/Api";
import { WEB_SETTING_DATA } from "../../../../api/GlobalInterface";
import CSDDailySavingChart from "../../../../components/Chart/CS/CSDDailySavingChart";
import CSWeeklySavingChart from "../../../../components/Chart/CS/CSWeeklySavingChart";
import CSMonthlySavingChart from "../../../../components/Chart/CS/CSMonthlySavingChart";
import CSYearlySavingChart from "../../../../components/Chart/CS/CSYearlySavingChart";

interface Props {
  csDailyReduceAmount: CS_REDUCE_AMOUNT_DATA[];
  csWeeklyReduceAmount: CS_REDUCE_AMOUNT_DATA[];
  csMonthlyReduceAmount: CS_REDUCE_AMOUNT_DATA[];
  csYearlyReduceAmount: CS_REDUCE_AMOUNT_DATA[];
  fromDate: string;
  toDate: string;
}

export const PrecisionCSReportCostSavingSection: React.FC<Props> = ({
  csDailyReduceAmount,
  csWeeklyReduceAmount,
  csMonthlyReduceAmount,
  csYearlyReduceAmount,
  fromDate,
  toDate,
}) => {
  const currency =
    getGlobalSetting()?.filter((e: WEB_SETTING_DATA) => e.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ?? "USD";
  const currSymbol = currency === "USD" ? "$" : "₫";

  const totalSaving = csDailyReduceAmount.reduce((sum, item) => sum + (item.REDUCE_AMOUNT || 0), 0);

  return (
    <div className="pcs-section">
      <div className="pcs-section__header">
        <div className="pcs-section__title-group">
          <FiDollarSign size={14} color="#059669" />
          <h2 className="pcs-section__title">Báo Cáo Tiết Kiệm Chi Phí (Cost Saving Analytics)</h2>
          <span className="pcs-section__tag">Finance & Efficiency</span>
        </div>
      </div>

      {/* High-Density Summary Table Card */}
      <div className="pcs-summary-card">
        <div className="pcs-summary-card__title">
          <FiDollarSign size={13} color="#059669" />
          <span>Tóm Tắt Tiết Kiệm Chi Phí ({fromDate.slice(0, 10)} ~ {toDate.slice(0, 10)})</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Hạng Mục (Category)</th>
              <th style={{ textAlign: "right" }}>Giá Trị Tiết Kiệm (Saving Amount)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cost Saving (Giảm trừ chi phí)</td>
              <td className="mono-val text-emerald">
                {currSymbol}{nFormatter(totalSaving, 2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Grid 4 Biểu Đồ Trending */}
      <div className="pcs-section__grid">
        {/* Daily Saving Card */}
        <div className="pcs-chart-card">
          <div className="pcs-chart-card__top">
            <div className="pcs-chart-card__title-area">
              <FiCalendar size={12} color="#059669" />
              <span className="pcs-chart-card__title">Daily Saving (Theo Ngày)</span>
              <span className="pcs-chart-card__badge">14 Ngày</span>
            </div>
            <button
              type="button"
              className="pcs-chart-card__btn-excel"
              onClick={() => SaveExcel(csDailyReduceAmount, "CS_Daily_Cost_Saving")}
              title="Xuất Excel dữ liệu tiết kiệm chi phí theo ngày"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="pcs-chart-card__chart-body">
            <CSDDailySavingChart
              dldata={[...csDailyReduceAmount].reverse()}
              processColor="#00da5b"
              materialColor="#41d5fa"
            />
          </div>
        </div>

        {/* Weekly Saving Card */}
        <div className="pcs-chart-card">
          <div className="pcs-chart-card__top">
            <div className="pcs-chart-card__title-area">
              <FiTrendingUp size={12} color="#059669" />
              <span className="pcs-chart-card__title">Weekly Saving (Theo Tuần)</span>
              <span className="pcs-chart-card__badge">10 Tuần</span>
            </div>
            <button
              type="button"
              className="pcs-chart-card__btn-excel"
              onClick={() => SaveExcel(csWeeklyReduceAmount, "CS_Weekly_Cost_Saving")}
              title="Xuất Excel dữ liệu tiết kiệm chi phí theo tuần"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="pcs-chart-card__chart-body">
            <CSWeeklySavingChart
              dldata={[...csWeeklyReduceAmount].reverse()}
              processColor="#00da5b"
              materialColor="#41d5fa"
            />
          </div>
        </div>

        {/* Monthly Saving Card */}
        <div className="pcs-chart-card">
          <div className="pcs-chart-card__top">
            <div className="pcs-chart-card__title-area">
              <FiCalendar size={12} color="#d97706" />
              <span className="pcs-chart-card__title">Monthly Saving (Theo Tháng)</span>
              <span className="pcs-chart-card__badge">12 Tháng</span>
            </div>
            <button
              type="button"
              className="pcs-chart-card__btn-excel"
              onClick={() => SaveExcel(csMonthlyReduceAmount, "CS_Monthly_Cost_Saving")}
              title="Xuất Excel dữ liệu tiết kiệm chi phí theo tháng"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="pcs-chart-card__chart-body">
            <CSMonthlySavingChart
              dldata={[...csMonthlyReduceAmount].reverse()}
              processColor="#00da5b"
              materialColor="#41d5fa"
            />
          </div>
        </div>

        {/* Yearly Saving Card */}
        <div className="pcs-chart-card">
          <div className="pcs-chart-card__top">
            <div className="pcs-chart-card__title-area">
              <FiTrendingUp size={12} color="#7c3aed" />
              <span className="pcs-chart-card__title">Yearly Saving (Theo Năm)</span>
              <span className="pcs-chart-card__badge">10 Năm</span>
            </div>
            <button
              type="button"
              className="pcs-chart-card__btn-excel"
              onClick={() => SaveExcel(csYearlyReduceAmount, "CS_Yearly_Cost_Saving")}
              title="Xuất Excel dữ liệu tiết kiệm chi phí theo năm"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="pcs-chart-card__chart-body">
            <CSYearlySavingChart
              dldata={[...csYearlyReduceAmount].reverse()}
              processColor="#00da5b"
              materialColor="#41d5fa"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCSReportCostSavingSection);
