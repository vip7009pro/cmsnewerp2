import React from "react";
import { FiAlertOctagon, FiDownload, FiCalendar, FiTrendingDown } from "react-icons/fi";
import { SaveExcel } from "../../../../api/services/excelService";
import { CS_RMA_AMOUNT_DATA, CS_TAXI_AMOUNT_DATA } from "../../interfaces/qcInterface";
import { nFormatter } from "../../../../api/services/utilService";
import { getGlobalSetting } from "../../../../api/Api";
import { WEB_SETTING_DATA } from "../../../../api/GlobalInterface";
import CSDDailyRMAChart from "../../../../components/Chart/CS/CSDDailyRMAChart";
import CSDWeeklyRMAChart from "../../../../components/Chart/CS/CSDWeeklyRMAChart";
import CSMonthlyRMAChart from "../../../../components/Chart/CS/CSMonthlyRMAChart";
import CSYearlyRMAChart from "../../../../components/Chart/CS/CSYearlyRMAChart";
import CSDDailyTaxiChart from "../../../../components/Chart/CS/CSDailyTaxiChart";
import CSDWeeklyTaxiChart from "../../../../components/Chart/CS/CSWeeklyTaxiChart";
import CSDMonthlyTaxiChart from "../../../../components/Chart/CS/CSMonthlyTaxiChart";
import CSYearlyTaxiChart from "../../../../components/Chart/CS/CSYearlyTaxiChart";

interface Props {
  csDailyRMAAmount: CS_RMA_AMOUNT_DATA[];
  csWeeklyRMAAmount: CS_RMA_AMOUNT_DATA[];
  csMonthlyRMAAmount: CS_RMA_AMOUNT_DATA[];
  csYearlyRMAAmount: CS_RMA_AMOUNT_DATA[];
  csDailyTAXIAmount: CS_TAXI_AMOUNT_DATA[];
  csWeeklyTAXIAmount: CS_TAXI_AMOUNT_DATA[];
  csMonthlyTAXIAmount: CS_TAXI_AMOUNT_DATA[];
  csYearlyTAXIAmount: CS_TAXI_AMOUNT_DATA[];
  fromDate: string;
  toDate: string;
}

export const PrecisionCSReportFCostSection: React.FC<Props> = ({
  csDailyRMAAmount,
  csWeeklyRMAAmount,
  csMonthlyRMAAmount,
  csYearlyRMAAmount,
  csDailyTAXIAmount,
  csWeeklyTAXIAmount,
  csMonthlyTAXIAmount,
  csYearlyTAXIAmount,
  fromDate,
  toDate,
}) => {
  const currency =
    getGlobalSetting()?.filter((e: WEB_SETTING_DATA) => e.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ?? "USD";
  const currSymbol = currency === "USD" ? "$" : "₫";

  const totalRMA = csDailyRMAAmount.reduce((sum, item) => sum + (item.TT || 0), 0);
  const totalTaxi = csDailyTAXIAmount.reduce((sum, item) => sum + (item.TAXI_AMOUNT || 0), 0);
  const totalFCost = totalRMA + totalTaxi;

  const rmaCharts = [
    { title: "Daily RMA", badge: "14 Ngày", data: csDailyRMAAmount, filename: "CS_Daily_RMA", comp: <CSDDailyRMAChart dldata={[...csDailyRMAAmount].reverse()} HT="#00da5b" CD="#41d5fa" MD="#c0ec21" /> },
    { title: "Weekly RMA", badge: "10 Tuần", data: csWeeklyRMAAmount, filename: "CS_Weekly_RMA", comp: <CSDWeeklyRMAChart dldata={[...csWeeklyRMAAmount].reverse()} HT="#00da5b" CD="#41d5fa" MD="#c0ec21" /> },
    { title: "Monthly RMA", badge: "12 Tháng", data: csMonthlyRMAAmount, filename: "CS_Monthly_RMA", comp: <CSMonthlyRMAChart dldata={[...csMonthlyRMAAmount].reverse()} HT="#00da5b" CD="#41d5fa" MD="#c0ec21" /> },
    { title: "Yearly RMA", badge: "10 Năm", data: csYearlyRMAAmount, filename: "CS_Yearly_RMA", comp: <CSYearlyRMAChart dldata={[...csYearlyRMAAmount].reverse()} HT="#00da5b" CD="#41d5fa" MD="#c0ec21" /> },
  ];

  const taxiCharts = [
    { title: "Daily Taxi", badge: "14 Ngày", data: csDailyTAXIAmount, filename: "CS_Daily_Taxi", comp: <CSDDailyTaxiChart dldata={[...csDailyTAXIAmount].reverse()} processColor="#00da5b" materialColor="#41d5fa" /> },
    { title: "Weekly Taxi", badge: "10 Tuần", data: csWeeklyTAXIAmount, filename: "CS_Weekly_Taxi", comp: <CSDWeeklyTaxiChart dldata={[...csWeeklyTAXIAmount].reverse()} processColor="#00da5b" materialColor="#41d5fa" /> },
    { title: "Monthly Taxi", badge: "12 Tháng", data: csMonthlyTAXIAmount, filename: "CS_Monthly_Taxi", comp: <CSDMonthlyTaxiChart dldata={[...csMonthlyTAXIAmount].reverse()} processColor="#00da5b" materialColor="#41d5fa" /> },
    { title: "Yearly Taxi", badge: "10 Năm", data: csYearlyTAXIAmount, filename: "CS_Yearly_Taxi", comp: <CSYearlyTaxiChart dldata={[...csYearlyTAXIAmount].reverse()} processColor="#00da5b" materialColor="#41d5fa" /> },
  ];

  return (
    <div className="pcs-section">
      <div className="pcs-section__header">
        <div className="pcs-section__title-group">
          <FiAlertOctagon size={14} color="#e11d48" />
          <h2 className="pcs-section__title">Báo Cáo Chi Phí Thiệt Hại F-Cost (RMA & Taxi Analytics)</h2>
          <span className="pcs-section__tag">Failure Cost</span>
        </div>
      </div>

      {/* High-Density Summary Table Card */}
      <div className="pcs-summary-card">
        <div className="pcs-summary-card__title">
          <FiAlertOctagon size={13} color="#e11d48" />
          <span>Tóm Tắt Tổn Thất F-Cost ({fromDate.slice(0, 10)} ~ {toDate.slice(0, 10)})</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Hạng Mục Tổn Thất (Category)</th>
              <th style={{ textAlign: "right" }}>Giá Trị ($ USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Chi Phí RMA (Hàng trả về)</td>
              <td className="mono-val text-rose">{currSymbol}{nFormatter(totalRMA, 2)}</td>
            </tr>
            <tr>
              <td>Chi Phí Taxi (Hỗ trợ khẩn cấp)</td>
              <td className="mono-val text-blue">{currSymbol}{nFormatter(totalTaxi, 2)}</td>
            </tr>
            <tr>
              <td>TỔNG CHI PHÍ F-COST</td>
              <td className="mono-val text-rose">{currSymbol}{nFormatter(totalFCost, 2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sub-heading: RMA */}
      <div className="pcs-section__header" style={{ marginTop: "10px" }}>
        <div className="pcs-section__title-group">
          <FiTrendingDown size={13} color="#e11d48" />
          <h3 className="pcs-section__title" style={{ fontSize: "0.78rem" }}>Xu Hướng Chi Phí RMA (RMA Amount Trending)</h3>
        </div>
      </div>

      {/* Grid 4 Biểu Đồ RMA */}
      <div className="pcs-section__grid">
        {rmaCharts.map((item, idx) => (
          <div key={`rma-${idx}`} className="pcs-chart-card">
            <div className="pcs-chart-card__top">
              <div className="pcs-chart-card__title-area">
                <FiCalendar size={12} color="#e11d48" />
                <span className="pcs-chart-card__title">{item.title}</span>
                <span className="pcs-chart-card__badge">{item.badge}</span>
              </div>
              <button
                type="button"
                className="pcs-chart-card__btn-excel"
                onClick={() => SaveExcel(item.data, item.filename)}
                title={`Xuất Excel ${item.title}`}
              >
                <FiDownload size={11} />
                <span>Excel</span>
              </button>
            </div>
            <div className="pcs-chart-card__chart-body">{item.comp}</div>
          </div>
        ))}
      </div>

      {/* Sub-heading: Taxi */}
      <div className="pcs-section__header" style={{ marginTop: "14px" }}>
        <div className="pcs-section__title-group">
          <FiTrendingDown size={13} color="#2563eb" />
          <h3 className="pcs-section__title" style={{ fontSize: "0.78rem" }}>Xu Hướng Chi Phí Taxi (Taxi Amount Trending)</h3>
        </div>
      </div>

      {/* Grid 4 Biểu Đồ Taxi */}
      <div className="pcs-section__grid">
        {taxiCharts.map((item, idx) => (
          <div key={`taxi-${idx}`} className="pcs-chart-card">
            <div className="pcs-chart-card__top">
              <div className="pcs-chart-card__title-area">
                <FiCalendar size={12} color="#2563eb" />
                <span className="pcs-chart-card__title">{item.title}</span>
                <span className="pcs-chart-card__badge">{item.badge}</span>
              </div>
              <button
                type="button"
                className="pcs-chart-card__btn-excel"
                onClick={() => SaveExcel(item.data, item.filename)}
                title={`Xuất Excel ${item.title}`}
              >
                <FiDownload size={11} />
                <span>Excel</span>
              </button>
            </div>
            <div className="pcs-chart-card__chart-body">{item.comp}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PrecisionCSReportFCostSection);
