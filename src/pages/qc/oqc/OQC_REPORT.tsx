import React from "react";
import { useOQCReportData } from "./PrecisionOQCReport/useOQCReportData";
import { PrecisionOQCReportHeader } from "./PrecisionOQCReport/PrecisionOQCReportHeader";
import { PrecisionOQCReportToolbar } from "./PrecisionOQCReport/PrecisionOQCReportToolbar";
import { PrecisionOQCReportKpi } from "./PrecisionOQCReport/PrecisionOQCReportKpi";
import { PrecisionOQCReportNGRateSection } from "./PrecisionOQCReport/PrecisionOQCReportNGRateSection";
import { PrecisionOQCReportInspectionPPMSection } from "./PrecisionOQCReport/PrecisionOQCReportInspectionPPMSection";
import { PrecisionOQCReportCustomerProdSection } from "./PrecisionOQCReport/PrecisionOQCReportCustomerProdSection";
import "./PrecisionOQCReport/PrecisionOQCReport.scss";

/**
 * OQC_REPORT - Báo cáo toàn diện chỉ số chất lượng xuất hàng OQC
 * Chuẩn thiết kế: Google Stitch High-Density Enterprise
 * Đồng bộ phong cách Báo Cáo PQC, IQC & Kinh Doanh
 */
const OQC_REPORT: React.FC = () => {
  const d = useOQCReportData();

  const showNGRate = d.activeTab === "all" || d.activeTab === "ngrate";
  const showInspectionPPM = d.isCMS && (d.activeTab === "all" || d.activeTab === "ppm");
  const showBreakdown = d.activeTab === "all" || d.activeTab === "breakdown";

  return (
    <div className="oqcreport precision-oqc-report">
      {/* 1. Header Bar công nghiệp chuẩn Google Stitch */}
      <PrecisionOQCReportHeader
        onReload={d.initFunction}
        isFullscreen={d.isFullscreen}
        onToggleFullscreen={d.toggleFullscreen}
        loading={d.loading}
      />

      {/* 2. SaaS Control Toolbar 2 Tầng & Segment Switcher */}
      <PrecisionOQCReportToolbar
        fromDate={d.fromdate}
        toDate={d.todate}
        onFromDateChange={d.setFromDate}
        onToDateChange={d.setToDate}
        custName={d.cust_name}
        onCustNameChange={d.setCust_Name}
        df={d.df}
        onDfChange={d.setDF}
        onSearch={d.initFunction}
        activeTab={d.activeTab}
        onTabChange={d.setActiveTab}
        isCMS={d.isCMS}
        loading={d.loading}
      />

      {/* 3. Vùng hiển thị cuộn mượt mà các biểu đồ và KPI */}
      <div className="poqc-body">
        {/* Micro-cards KPI tổng quan */}
        <PrecisionOQCReportKpi
          dailyppm={d.dailyppm}
          weeklyppm={d.weeklyppm}
          monthlyppm={d.monthlyppm}
          yearlyppm={d.yearlyppm}
        />

        {/* Phân hệ 1: Xu hướng tỷ lệ lỗi OQC */}
        {showNGRate && (
          <PrecisionOQCReportNGRateSection
            dailyppm={d.dailyppm}
            weeklyppm={d.weeklyppm}
            monthlyppm={d.monthlyppm}
            yearlyppm={d.yearlyppm}
            onExportDaily={d.exportDailyNGRate}
            onExportWeekly={d.exportWeeklyNGRate}
            onExportMonthly={d.exportMonthlyNGRate}
            onExportYearly={d.exportYearlyNGRate}
          />
        )}

        {/* Phân hệ 2: Xu hướng PPM kiểm tra xuất hàng CMS */}
        {showInspectionPPM && (
          <PrecisionOQCReportInspectionPPMSection
            insp_dailyppm={d.insp_dailyppm}
            insp_weeklyppm={d.insp_weeklyppm}
            insp_monthlyppm={d.insp_monthlyppm}
            insp_yearlyppm={d.insp_yearlyppm}
            onExportDaily={d.exportDailyInspPPM}
            onExportWeekly={d.exportWeeklyInspPPM}
            onExportMonthly={d.exportMonthlyInspPPM}
            onExportYearly={d.exportYearlyInspPPM}
          />
        )}

        {/* Phân hệ 3: Phân bổ sự cố theo Khách hàng và Chủng loại sản phẩm */}
        {showBreakdown && (
          <PrecisionOQCReportCustomerProdSection
            oqcNGByCustomer={d.oqcNGByCustomer}
            oqcNGByProdType={d.oqcNGByProdType}
            onExportCustomer={d.exportNGByCustomer}
            onExportProdType={d.exportNGByProdType}
          />
        )}
      </div>
    </div>
  );
};

export default OQC_REPORT;
