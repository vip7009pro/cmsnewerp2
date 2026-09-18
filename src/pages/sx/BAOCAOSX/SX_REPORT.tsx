import React from "react";
import "./PrecisionSxReport/PrecisionSxReport.scss";
import { useSxReportData } from "./PrecisionSxReport/useSxReportData";
import PrecisionSxReportHeader from "./PrecisionSxReport/PrecisionSxReportHeader";
import PrecisionSxReportToolbar from "./PrecisionSxReport/PrecisionSxReportToolbar";
import PrecisionSxReportKpi from "./PrecisionSxReport/PrecisionSxReportKpi";
import PrecisionSxReportLossSection from "./PrecisionSxReport/PrecisionSxReportLossSection";
import PrecisionSxReportAchiveSection from "./PrecisionSxReport/PrecisionSxReportAchiveSection";
import PrecisionSxReportEffSection from "./PrecisionSxReport/PrecisionSxReportEffSection";
import PrecisionSxReportLeadTimeSection from "./PrecisionSxReport/PrecisionSxReportLeadTimeSection";

const SX_REPORT: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    machineList,
    selectedMachine,
    setSelectedMachine,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    cust_name,
    setCust_Name,
    searchCodeArray,
    df,
    setDF,
    initFunction,
    handleQuickDateRange,
    handleYearToDate,
    planLossTriggerFetch,

    // Loss
    sxdailylosstrendData,
    sxweeklylosstrendData,
    sxmonthlylosstrendData,
    sxyearlylosstrendData,
    planLossData,

    // Achive
    sxdailyachiveData,
    sxweeklyachiveData,
    sxmonthlyachiveData,
    sxyearlyachiveData,

    // Eff
    sxdailyeffData,
    sxEffOverview,
    sxweeklyeffData,
    sxmonthlyeffData,
    sxyearlyeffData,

    // Loss time & Lead time
    sxlosstimebyreasonData,
    sxlosstimebyemplData,
    ycgapData,
    ycsxgapbackData,
    sxgapData,
    sxgapbackData,
    ktgapData,
    ktgapbackData,
    allgapData,
    allgapbackData,
    allhoanthanhtruochanrateData,
    allhoanthanhtruochanratebackData,
    allhoanthanhtruochanrateData2,
    allhoanthanhtruochanratebackData2,
  } = useSxReportData();

  const showLoss = activeTab === "all" || activeTab === "loss";
  const showAchive = activeTab === "all" || activeTab === "achive";
  const showEff = activeTab === "all" || activeTab === "eff";
  const showLeadTime = activeTab === "all" || activeTab === "leadtime";

  return (
    <div className="precision-sx-report">
      {/* 1. Header Bar công nghiệp */}
      <PrecisionSxReportHeader onReload={initFunction} />

      {/* 2. Toolbar Điều Hành & Chuyển Tab Phân Hệ */}
      <PrecisionSxReportToolbar
        fromDate={fromdate}
        toDate={todate}
        custName={cust_name}
        df={df}
        selectedMachine={selectedMachine}
        machineList={machineList}
        activeTab={activeTab}
        searchCodeCount={searchCodeArray.length}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onCustNameChange={setCust_Name}
        onDfChange={(val) => {
          setDF(val);
          if (!val) setCust_Name("");
        }}
        onMachineChange={(m) => {
          setSelectedMachine(m);
          planLossTriggerFetch();
        }}
        onSearch={initFunction}
        onTabChange={setActiveTab}
        onQuickDateRange={handleQuickDateRange}
        onYearToDate={handleYearToDate}
      />

      {/* 3. Vùng Thân Báo Cáo Cuộn Toàn Diện */}
      <div className="precision-sx-body">
        {/* Micro-cards KPI Realtime */}
        <PrecisionSxReportKpi
          dailyLossData={sxdailylosstrendData}
          weeklyLossData={sxweeklylosstrendData}
          monthlyLossData={sxmonthlylosstrendData}
          yearlyLossData={sxyearlylosstrendData}
          dailyAchiveData={sxdailyachiveData}
          weeklyAchiveData={sxweeklyachiveData}
          monthlyAchiveData={sxmonthlyachiveData}
          yearlyAchiveData={sxyearlyachiveData}
        />

        {/* Phân hệ 1: Tổn Thất Sản Xuất */}
        {showLoss && (
          <PrecisionSxReportLossSection
            dailyLossData={sxdailylosstrendData}
            weeklyLossData={sxweeklylosstrendData}
            monthlyLossData={sxmonthlylosstrendData}
            yearlyLossData={sxyearlylosstrendData}
            planLossData={planLossData}
            selectedMachine={selectedMachine}
          />
        )}

        {/* Phân hệ 2: Tỷ Lệ Đạt Kế Hoạch */}
        {showAchive && (
          <PrecisionSxReportAchiveSection
            dailyAchiveData={sxdailyachiveData}
            weeklyAchiveData={sxweeklyachiveData}
            monthlyAchiveData={sxmonthlyachiveData}
            yearlyAchiveData={sxyearlyachiveData}
          />
        )}

        {/* Phân hệ 3: Hiệu Suất & OEE */}
        {showEff && (
          <PrecisionSxReportEffSection
            overview={sxEffOverview}
            dailyEffData={sxdailyeffData}
            weeklyEffData={sxweeklyeffData}
            monthlyEffData={sxmonthlyeffData}
            yearlyEffData={sxyearlyeffData}
          />
        )}

        {/* Phân hệ 4: Lead Time & Giao Hàng */}
        {showLeadTime && (
          <PrecisionSxReportLeadTimeSection
            fromDate={fromdate}
            toDate={todate}
            lossTimeReasonData={sxlosstimebyreasonData}
            lossTimeEmplData={sxlosstimebyemplData}
            ycgapData={ycgapData}
            ycsxgapbackData={ycsxgapbackData}
            sxgapData={sxgapData}
            sxgapbackData={sxgapbackData}
            ktgapData={ktgapData}
            ktgapbackData={ktgapbackData}
            allgapData={allgapData}
            allgapbackData={allgapbackData}
            allhoanthanhtruochanrateData={allhoanthanhtruochanrateData}
            allhoanthanhtruochanratebackData={allhoanthanhtruochanratebackData}
            allhoanthanhtruochanrateData2={allhoanthanhtruochanrateData2}
            allhoanthanhtruochanratebackData2={allhoanthanhtruochanratebackData2}
          />
        )}
      </div>
    </div>
  );
};

export default SX_REPORT;
