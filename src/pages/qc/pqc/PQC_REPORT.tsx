import React from "react";
import "./PrecisionPQCReport/PrecisionPQCReport.scss";
import { usePQCReportData } from "./PrecisionPQCReport/usePQCReportData";
import PrecisionPQCReportHeader from "./PrecisionPQCReport/PrecisionPQCReportHeader";
import PrecisionPQCReportToolbar from "./PrecisionPQCReport/PrecisionPQCReportToolbar";
import PrecisionPQCReportKpi from "./PrecisionPQCReport/PrecisionPQCReportKpi";
import PrecisionPQCReportPPMSection from "./PrecisionPQCReport/PrecisionPQCReportPPMSection";
import PrecisionPQCReportDefectsSection from "./PrecisionPQCReport/PrecisionPQCReportDefectsSection";
import PrecisionPQCReportFCostSection from "./PrecisionPQCReport/PrecisionPQCReportFCostSection";

const PQC_REPORT: React.FC = () => {
  const {
    dailyppm, weeklyppm, monthlyppm, yearlyppm,
    inspectSummary, dailyDefectTrendingData, pqcdatatable,
    fromdate, setFromDate, todate, setToDate,
    worstby, setWorstBy, ng_type, setNg_Type,
    cust_name, setCust_Name, codeList, searchCodeArray, selectedCode,
    df, setDF, activeTab, setActiveTab, loading,
    isFullscreen, toggleFullscreen,
    initFunction, handleSelectCode, handleRemoveCode, handleClearCodeArray,
    handleDefectClick,
    exportDailyPPM, exportWeeklyPPM, exportMonthlyPPM, exportYearlyPPM,
    exportDefectTrending,
    exportDailyFCost, exportWeeklyFCost, exportMonthlyFCost, exportYearlyFCost,
  } = usePQCReportData();

  const showPpm = activeTab === "all" || activeTab === "ppm";
  const showDefects = activeTab === "all" || activeTab === "defects";
  const showFCost = activeTab === "all" || activeTab === "fcost";

  return (
    <div className="pqcreport precision-pqc-report">
      {/* 1. Header Bar công nghiệp chuẩn Google Stitch */}
      <PrecisionPQCReportHeader
        onReload={initFunction}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        loading={loading}
      />

      {/* 2. SaaS Control Toolbar & Phân hệ điều hướng */}
      <PrecisionPQCReportToolbar
        fromDate={fromdate}
        toDate={todate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        worstBy={worstby}
        onWorstByChange={setWorstBy}
        ngType={ng_type}
        onNgTypeChange={setNg_Type}
        custName={cust_name}
        onCustNameChange={setCust_Name}
        codeList={codeList}
        selectedCode={selectedCode}
        onSelectCode={handleSelectCode}
        searchCodeArray={searchCodeArray}
        onRemoveCode={handleRemoveCode}
        onClearCodeArray={handleClearCodeArray}
        df={df}
        onDfChange={setDF}
        onSearch={initFunction}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        loading={loading}
      />

      {/* 3. Vùng hiển thị cuộn mượt mà các biểu đồ và KPI */}
      <div className="precision-pqc-body">
        {/* Micro-cards KPI tổng quan */}
        <PrecisionPQCReportKpi
          dailyppm={dailyppm}
          weeklyppm={weeklyppm}
          monthlyppm={monthlyppm}
          yearlyppm={yearlyppm}
        />

        {/* Phân hệ 1: Xu hướng tỷ lệ lỗi PPM */}
        {showPpm && (
          <PrecisionPQCReportPPMSection
            dailyppm={dailyppm}
            weeklyppm={weeklyppm}
            monthlyppm={monthlyppm}
            yearlyppm={yearlyppm}
            onExportDaily={exportDailyPPM}
            onExportWeekly={exportWeeklyPPM}
            onExportMonthly={exportMonthlyPPM}
            onExportYearly={exportYearlyPPM}
          />
        )}

        {/* Phân hệ 2: Xu hướng lỗi khuyết tật & sự cố Patrol */}
        {showDefects && (
          <PrecisionPQCReportDefectsSection
            dailyDefectTrendingData={dailyDefectTrendingData}
            pqcdatatable={pqcdatatable}
            onDefectClick={handleDefectClick}
            onExportDefects={exportDefectTrending}
          />
        )}

        {/* Phân hệ 3: Chi phí tổn thất chất lượng F-Cost */}
        {showFCost && (
          <PrecisionPQCReportFCostSection
            inspectSummary={inspectSummary}
            dailyppm={dailyppm}
            weeklyppm={weeklyppm}
            monthlyppm={monthlyppm}
            yearlyppm={yearlyppm}
            onExportDailyFCost={exportDailyFCost}
            onExportWeeklyFCost={exportWeeklyFCost}
            onExportMonthlyFCost={exportMonthlyFCost}
            onExportYearlyFCost={exportYearlyFCost}
          />
        )}
      </div>
    </div>
  );
};

export default PQC_REPORT;
