import React from "react";
import { useCSReportData } from "./PrecisionCSReport/useCSReportData";
import { PrecisionCSReportHeader } from "./PrecisionCSReport/PrecisionCSReportHeader";
import { PrecisionCSReportToolbar } from "./PrecisionCSReport/PrecisionCSReportToolbar";
import { PrecisionCSReportKpi } from "./PrecisionCSReport/PrecisionCSReportKpi";
import { PrecisionCSReportFeedbackSection } from "./PrecisionCSReport/PrecisionCSReportFeedbackSection";
import { PrecisionCSReportBreakdownSection } from "./PrecisionCSReport/PrecisionCSReportBreakdownSection";
import { PrecisionCSReportCostSavingSection } from "./PrecisionCSReport/PrecisionCSReportCostSavingSection";
import { PrecisionCSReportFCostSection } from "./PrecisionCSReport/PrecisionCSReportFCostSection";
import "./PrecisionCSReport/PrecisionCSReport.scss";

/**
 * CSREPORT - Báo cáo Dịch vụ Khách hàng & Sự cố Chất lượng (CS Quality Analytics)
 * Chuẩn thiết kế: Google Stitch High-Density Enterprise & KinhDoanhReport
 */
const CSREPORT: React.FC = () => {
  const d = useCSReportData();

  return (
    <div className="csreport precision-cs-report">
      <PrecisionCSReportHeader
        onReload={d.initFunction}
        isFullscreen={d.isFullscreen}
        onToggleFullscreen={d.toggleFullscreen}
        loading={d.loading}
      />
      <PrecisionCSReportToolbar
        fromDate={d.fromdate}
        toDate={d.todate}
        onFromDateChange={d.setFromDate}
        onToDateChange={d.setToDate}
        worstby={d.worstby}
        onWorstByChange={d.setWorstBy}
        ng_type={d.ng_type}
        onNgTypeChange={d.setNg_Type}
        codeList={d.codeList}
        searchCodeArray={d.searchCodeArray}
        onAddCode={d.handleAddCode}
        onClearCodeArray={d.handleClearCodeArray}
        custName={d.cust_name}
        onCustNameChange={d.setCust_Name}
        df={d.df}
        onDfChange={d.setDF}
        onSearch={d.initFunction}
        activeTab={d.activeTab}
        onTabChange={d.setActiveTab}
        loading={d.loading}
      />
      <div className="pcs-body">
        <PrecisionCSReportKpi
          dailyppm={d.dailyppm}
          weeklyppm={d.weeklyppm}
          monthlyppm={d.monthlyppm}
          yearlyppm={d.yearlyppm}
          totalSavingAmount={d.totalSavingAmount}
          totalRMAAmount={d.totalRMAAmount}
          totalTaxiAmount={d.totalTaxiAmount}
        />
        {(d.activeTab === "all" || d.activeTab === "feedback") && (
          <PrecisionCSReportFeedbackSection
            dailyppm={d.dailyppm}
            weeklyppm={d.weeklyppm}
            monthlyppm={d.monthlyppm}
            yearlyppm={d.yearlyppm}
          />
        )}
        {(d.activeTab === "all" || d.activeTab === "breakdown") && (
          <PrecisionCSReportBreakdownSection
            csConfirmDataByCustomer={d.csConfirmDataByCustomer}
            csConfirmDataByPIC={d.csConfirmDataByPIC}
          />
        )}
        {(d.activeTab === "all" || d.activeTab === "saving") && (
          <PrecisionCSReportCostSavingSection
            csDailyReduceAmount={d.csDailyReduceAmount}
            csWeeklyReduceAmount={d.csWeeklyReduceAmount}
            csMonthlyReduceAmount={d.csMonthlyReduceAmount}
            csYearlyReduceAmount={d.csYearlyReduceAmount}
            fromDate={d.fromdate}
            toDate={d.todate}
          />
        )}
        {(d.activeTab === "all" || d.activeTab === "fcost") && (
          <PrecisionCSReportFCostSection
            csDailyRMAAmount={d.csDailyRMAAmount}
            csWeeklyRMAAmount={d.csWeeklyRMAAmount}
            csMonthlyRMAAmount={d.csMonthlyRMAAmount}
            csYearlyRMAAmount={d.csYearlyRMAAmount}
            csDailyTAXIAmount={d.csDailyTAXIAmount}
            csWeeklyTAXIAmount={d.csWeeklyTAXIAmount}
            csMonthlyTAXIAmount={d.csMonthlyTAXIAmount}
            csYearlyTAXIAmount={d.csYearlyTAXIAmount}
            fromDate={d.fromdate}
            toDate={d.todate}
          />
        )}
      </div>
    </div>
  );
};

export default CSREPORT;
