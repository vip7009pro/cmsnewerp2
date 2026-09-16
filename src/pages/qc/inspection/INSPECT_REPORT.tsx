import React from "react";
import { useInspectReportData } from "./PrecisionInspectReport/useInspectReportData";
import { PrecisionInspectReportHeader } from "./PrecisionInspectReport/PrecisionInspectReportHeader";
import { PrecisionInspectReportToolbar } from "./PrecisionInspectReport/PrecisionInspectReportToolbar";
import { PrecisionInspectReportKpi } from "./PrecisionInspectReport/PrecisionInspectReportKpi";
import { PrecisionInspectReportFCostSection } from "./PrecisionInspectReport/PrecisionInspectReportFCostSection";
import { PrecisionInspectReportNguoiHangSection } from "./PrecisionInspectReport/PrecisionInspectReportNguoiHangSection";
import { PrecisionInspectReportDefectsSection } from "./PrecisionInspectReport/PrecisionInspectReportDefectsSection";
import { PrecisionInspectReportWorstSection } from "./PrecisionInspectReport/PrecisionInspectReportWorstSection";
import "./PrecisionInspectReport/PrecisionInspectReport.scss";

/**
 * INSPECT_REPORT - Báo cáo toàn diện chất lượng kiểm tra
 * Chuẩn thiết kế: Google Stitch High-Density Enterprise
 * Đồng bộ phong cách Báo Cáo OQC, PQC & Kinh Doanh
 */
const INSPECT_REPORT: React.FC = () => {
  const d = useInspectReportData();

  const showFCost = d.activeTab === "all" || d.activeTab === "fcost";
  const showNguoiHang = d.activeTab === "all" || d.activeTab === "nguoihang";
  const showDefects = d.activeTab === "all" || d.activeTab === "defects";
  const showWorst = d.activeTab === "all" || d.activeTab === "worst";

  return (
    <div className="inspectionreport precision-inspect-report">
      {/* 1. Header Bar chuẩn Google Stitch */}
      <PrecisionInspectReportHeader
        onReload={d.initFunction}
        isFullscreen={d.isFullscreen}
        onToggleFullscreen={d.toggleFullscreen}
        loading={d.loading}
      />

      {/* 2. SaaS Control Toolbar 2 Tầng & Segment Switcher */}
      <PrecisionInspectReportToolbar
        fromDate={d.fromdate}
        toDate={d.todate}
        onFromDateChange={d.setFromDate}
        onToDateChange={d.setToDate}
        worstBy={d.worstby}
        onWorstByChange={d.setWorstBy}
        ngType={d.ng_type}
        onNgTypeChange={d.setNg_Type}
        codeList={d.codeList}
        searchCodeArray={d.searchCodeArray}
        onSelectCode={d.handleSelectCode}
        onRemoveCode={d.handleRemoveCode}
        onClearCodes={d.handleClearCodes}
        custName={d.cust_name}
        onCustNameChange={d.setCust_Name}
        df={d.df}
        onDfChange={d.setDF}
        onSearch={d.initFunction}
        activeTab={d.activeTab}
        onTabChange={d.setActiveTab}
        loading={d.loading}
      />

      {/* 3. Vùng hiển thị cuộn mượt mà */}
      <div className="pir-body">
        {/* Micro-cards KPI tổng quan */}
        <PrecisionInspectReportKpi
          dailyppm={d.dailyppm}
          weeklyppm={d.weeklyppm}
          monthlyppm={d.monthlyppm}
          yearlyppm={d.yearlyppm}
        />

        {/* Phân hệ 1: Chi phí tổn thất F-Cost */}
        {showFCost && (
          <PrecisionInspectReportFCostSection
            dailyFcostData={d.dailyFcostData}
            weeklyFcostData={d.weeklyFcostData}
            monthlyFcostData={d.monthlyFcostData}
            annualyFcostData={d.annualyFcostData}
            dailyppm={d.dailyppm}
            weeklyppm={d.weeklyppm}
            monthlyppm={d.monthlyppm}
            yearlyppm={d.yearlyppm}
            onExportDaily={d.exportDailyFcost}
            onExportWeekly={d.exportWeeklyFcost}
            onExportMonthly={d.exportMonthlyFcost}
            onExportYearly={d.exportYearlyFcost}
          />
        )}

        {/* Phân hệ 2: Tỉ lệ Người Hàng */}
        {showNguoiHang && (
          <PrecisionInspectReportNguoiHangSection
            dailyNguoiHangData={d.dailyNguoiHangData}
            weeklyNguoiHangData={d.weeklyNguoiHangData}
            monthlyNguoiHangData={d.monthlyNguoiHangData}
            annualyNguoiHangData={d.annualyNguoiHangData}
            onExportDaily={d.exportDailyNguoiHang}
            onExportWeekly={d.exportWeeklyNguoiHang}
            onExportMonthly={d.exportMonthlyNguoiHang}
            onExportYearly={d.exportYearlyNguoiHang}
          />
        )}

        {/* Phân hệ 3: Xu hướng khuyết tật & Patrol */}
        {showDefects && (
          <PrecisionInspectReportDefectsSection
            dailyDefectTrendingData={d.dailyDefectTrendingData}
            patrolheaderdata={d.patrolheaderdata}
            fromdate={d.fromdate}
            todate={d.todate}
            onExportDefect={d.exportDefectTrending}
          />
        )}

        {/* Phân hệ 4: Worst Products */}
        {showWorst && (
          <PrecisionInspectReportWorstSection
            worstdatatable={d.worstdatatable}
            worstby={d.worstby}
            fromdate={d.fromdate}
            todate={d.todate}
            ng_type={d.ng_type}
            searchCodeArray={d.searchCodeArray}
            cust_name={d.cust_name}
          />
        )}
      </div>
    </div>
  );
};

export default INSPECT_REPORT;
