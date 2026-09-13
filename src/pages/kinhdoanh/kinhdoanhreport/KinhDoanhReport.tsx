import React from "react";
import "./PrecisionKinhDoanhReport/PrecisionKDReport.scss";
import { useKDReportData } from "./PrecisionKinhDoanhReport/useKDReportData";
import PrecisionKDHeader from "./PrecisionKinhDoanhReport/PrecisionKDHeader";
import PrecisionKDFilterToolbar from "./PrecisionKinhDoanhReport/PrecisionKDFilterToolbar";
import PrecisionKDSummaryKpi from "./PrecisionKinhDoanhReport/PrecisionKDSummaryKpi";
import PrecisionKDClosingSection from "./PrecisionKinhDoanhReport/PrecisionKDClosingSection";
import PrecisionKDCustomerClosingTables from "./PrecisionKinhDoanhReport/PrecisionKDCustomerClosingTables";
import PrecisionKDOverdueSection from "./PrecisionKinhDoanhReport/PrecisionKDOverdueSection";
import PrecisionKDPOSection from "./PrecisionKinhDoanhReport/PrecisionKDPOSection";
import PrecisionKDFcstSection from "./PrecisionKinhDoanhReport/PrecisionKDFcstSection";

const KinhDoanhReport: React.FC = () => {
  const {
    df, setDF,
    fromdate, setFromDate,
    todate, setToDate,
    in_nhanh, setInNhanh,
    selectedYW,
    activeTab, setActiveTab,
    widgetdata_yesterday,
    widgetdata_thisweek,
    widgetdata_thismonth,
    widgetdata_thisyear,
    customerRevenue,
    monthlyvRevenuebyCustomer,
    picRevenue,
    dailyClosingData,
    columns,
    weeklyClosingData,
    columnsweek,
    columnsmonth,
    runningPOData,
    customerNewPOByWeek,
    runningPOBalanceData,
    widgetdata_pobalancesummary,
    widgetdata_fcstAmount,
    dailyOverdueData,
    weeklyOverdueData,
    monthlyOverdueData,
    yearlyOverdueData,
    pobalanceDetail,
    pobalanceSummary,
    pobalanceCustomer,
    initFunction,
    handleSelectPOYear,
    handleSelectPOWeek,
  } = useKDReportData();

  const showSummary = activeTab === "all" || activeTab === "summary";
  const showTables = activeTab === "all" || activeTab === "tables";
  const showOverdue = activeTab === "all" || activeTab === "overdue";
  const showPO = activeTab === "all" || activeTab === "po";

  return (
    <div className="precision-kd-report">
      {/* 1. Header Bar công nghiệp */}
      <PrecisionKDHeader onReload={initFunction} />

      {/* 2. Bộ Lọc Điều Hành & Thanh Chuyển Tab Phân Hệ */}
      <PrecisionKDFilterToolbar
        fromDate={fromdate}
        toDate={todate}
        df={df}
        inNhanh={in_nhanh}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onDfChange={setDF}
        onInNhanhChange={setInNhanh}
        onSearch={initFunction}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 3. Dashboard Scrollable Body */}
      <div className="precision-kd-body">
        {/* Phân hệ 1: Doanh Thu & Chốt Số */}
        {showSummary && (
          <>
            <PrecisionKDSummaryKpi
              yesterdayData={widgetdata_yesterday}
              thisWeekData={widgetdata_thisweek}
              thisMonthData={widgetdata_thismonth}
              thisYearData={widgetdata_thisyear}
            />
            <PrecisionKDClosingSection
              yesterdayData={widgetdata_yesterday}
              thisWeekData={widgetdata_thisweek}
              thisMonthData={widgetdata_thismonth}
              thisYearData={widgetdata_thisyear}
              customerRevenue={customerRevenue}
              picRevenue={picRevenue}
            />
          </>
        )}

        {/* Phân hệ 2: Bảng Biểu Chi Tiết Khách Hàng */}
        {showTables && (
          <PrecisionKDCustomerClosingTables
            dailyClosingData={dailyClosingData}
            columns={columns}
            weeklyClosingData={weeklyClosingData}
            columnsweek={columnsweek}
            monthlyvRevenuebyCustomer={monthlyvRevenuebyCustomer}
            columnsmonth={columnsmonth}
          />
        )}

        {/* Phân hệ 3: Báo Cáo Trễ Hạn */}
        {showOverdue && (
          <PrecisionKDOverdueSection
            dailyOverdueData={dailyOverdueData}
            weeklyOverdueData={weeklyOverdueData}
            monthlyOverdueData={monthlyOverdueData}
            yearlyOverdueData={yearlyOverdueData}
          />
        )}

        {/* Phân hệ 4: Đơn Hàng PO & Tồn Đơn & Forecast */}
        {showPO && (
          <>
            <PrecisionKDPOSection
              poBalanceSummaryWdg={widgetdata_pobalancesummary}
              runningPOData={runningPOData}
              customerNewPOByWeek={customerNewPOByWeek}
              thisWeekData={widgetdata_thisweek}
              runningPOBalanceData={runningPOBalanceData}
              pobalanceSummary={pobalanceSummary}
              pobalanceDetail={pobalanceDetail}
              pobalanceCustomer={pobalanceCustomer}
              selectedYW={selectedYW}
              onSelectPOYear={handleSelectPOYear}
              onSelectPOWeek={handleSelectPOWeek}
            />
            <PrecisionKDFcstSection fcstData={widgetdata_fcstAmount} />
          </>
        )}
      </div>
    </div>
  );
};

export default KinhDoanhReport;
