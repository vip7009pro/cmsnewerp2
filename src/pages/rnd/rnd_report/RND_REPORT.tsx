import React from "react";
import "./PrecisionRNDReport/PrecisionRNDReport.scss";
import "./RND_REPORT.scss";
import { useRNDReportData } from "./PrecisionRNDReport/useRNDReportData";
import { PrecisionRNDHeader } from "./PrecisionRNDReport/PrecisionRNDHeader";
import { PrecisionRNDFilterToolbar } from "./PrecisionRNDReport/PrecisionRNDFilterToolbar";
import { PrecisionRNDSummaryKpi } from "./PrecisionRNDReport/PrecisionRNDSummaryKpi";
import { PrecisionRNDTrendingSection } from "./PrecisionRNDReport/PrecisionRNDTrendingSection";
import { PrecisionRNDDistributionSection } from "./PrecisionRNDReport/PrecisionRNDDistributionSection";
import { PrecisionRNDFilmSavingSection } from "./PrecisionRNDReport/PrecisionRNDFilmSavingSection";
import { PrecisionRNDDaoFilmErrSection } from "./PrecisionRNDReport/PrecisionRNDDaoFilmErrSection";

const RND_REPORT: React.FC = () => {
  const {
    fromdate,
    setFromDate,
    todate,
    setToDate,
    cust_name,
    setCust_Name,
    df,
    setDF,
    searchCodeArray,
    activeTab,
    setActiveTab,
    isFullscreen,
    toggleFullscreen,
    kpiSummary,
    dailynewcode,
    weeklynewcode,
    monthlynewcode,
    yearlynewcode,
    newcodebycustomer,
    newcodebyprodtype,
    filmSavingDaily,
    filmSavingWeekly,
    filmSavingMonthly,
    filmSavingYearly,
    tilefilmbanBackData,
    yctkdailynewcode,
    yctkweeklynewcode,
    yctkmonthlynewcode,
    yctkyearlynewcode,
    daofilmerr,
    initFunction,
    company,
  } = useRNDReportData();

  const showTrending = activeTab === "all" || activeTab === "trending";
  const showDistribution = activeTab === "all" || activeTab === "distribution";
  const showFilmSaving = activeTab === "all" || activeTab === "filmsaving";
  const showDaoFilmErr = activeTab === "all" || activeTab === "daofilmerr";

  return (
    <div className="precision-rnd-report rndreport">
      {/* 1. SUB-HEADER BAR CÔNG NGHIỆP CHUẨN STITCH */}
      <PrecisionRNDHeader
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        onRefresh={() => initFunction(true)}
      />

      {/* 2. BỘ LỌC ĐIỀU HÀNH & THANH CHUYỂN TAB PHÂN HỆ */}
      <PrecisionRNDFilterToolbar
        fromDate={fromdate}
        toDate={todate}
        custName={cust_name}
        df={df}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onCustNameChange={setCust_Name}
        onDfChange={(checked) => {
          setDF(checked);
        }}
        onSearch={() => initFunction(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        company={company}
        codeCount={searchCodeArray.length}
      />

      {/* 3. VÙNG CUỘN DASHBOARD EXECUTIVE BODY */}
      <main className="precision-rnd-report__body">
        {/* KHỐI 1: 4 THẺ MICRO-CARDS KPI REALTIME */}
        <PrecisionRNDSummaryKpi kpiSummary={kpiSummary} />

        {/* KHỐI 2: XU HƯỚNG MÃ MỚI THEO THỜI GIAN (DAILY, WEEKLY, MONTHLY, YEARLY) */}
        {showTrending && (
          <PrecisionRNDTrendingSection
            dailyData={dailynewcode}
            weeklyData={weeklynewcode}
            monthlyData={monthlynewcode}
            yearlyData={yearlynewcode}
          />
        )}

        {/* KHỐI 3: PHÂN TÍCH CƠ CẤU PHÁT TRIỂN MÃ MỚI (KHÁCH HÀNG & LOẠI SẢN PHẨM) */}
        {showDistribution && (
          <PrecisionRNDDistributionSection
            customerData={newcodebycustomer}
            prodTypeData={newcodebyprodtype}
          />
        )}

        {/* KHỐI 4: XU HƯỚNG TIẾT KIỆM FILM (PVN) HOẶC YÊU CẦU THIẾT KẾ (XXX) */}
        {showFilmSaving && (
          <PrecisionRNDFilmSavingSection
            company={company}
            filmSavingDaily={filmSavingDaily}
            filmSavingWeekly={filmSavingWeekly}
            filmSavingMonthly={filmSavingMonthly}
            filmSavingYearly={filmSavingYearly}
            tilefilmbanBackData={tilefilmbanBackData}
            yctkdailynewcode={yctkdailynewcode}
            yctkweeklynewcode={yctkweeklynewcode}
            yctkmonthlynewcode={yctkmonthlynewcode}
            yctkyearlynewcode={yctkyearlynewcode}
          />
        )}

        {/* KHỐI 5: TỈ TRỌNG NGUYÊN NHÂN XUẤT DAO FILM */}
        {showDaoFilmErr && (
          <PrecisionRNDDaoFilmErrSection data={daofilmerr} />
        )}
      </main>
    </div>
  );
};

export default RND_REPORT;
