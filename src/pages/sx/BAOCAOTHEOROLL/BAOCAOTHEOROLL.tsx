import React from "react";
import "./PrecisionBaoCaoRoll/PrecisionBaoCaoRoll.scss";
import { useBaoCaoRollData } from "./PrecisionBaoCaoRoll/useBaoCaoRollData";
import { PrecisionBaoCaoRollHeader } from "./PrecisionBaoCaoRoll/PrecisionBaoCaoRollHeader";
import { PrecisionBaoCaoRollToolbar } from "./PrecisionBaoCaoRoll/PrecisionBaoCaoRollToolbar";
import { PrecisionBaoCaoRollKpi } from "./PrecisionBaoCaoRoll/PrecisionBaoCaoRollKpi";
import { PrecisionBaoCaoRollCharts } from "./PrecisionBaoCaoRoll/PrecisionBaoCaoRollCharts";
import { PrecisionBaoCaoRollSummary } from "./PrecisionBaoCaoRoll/PrecisionBaoCaoRollSummary";
import { PrecisionBaoCaoRollGrid } from "./PrecisionBaoCaoRoll/PrecisionBaoCaoRollGrid";
import { PrecisionBaoCaoRollPivotModal } from "./PrecisionBaoCaoRoll/PrecisionBaoCaoRollPivotModal";

const BAOCAOTHEOROLL: React.FC = () => {
  const {
    fromdate,
    setFromDate,
    todate,
    setToDate,
    factory,
    setFactory,
    machine,
    setMachine,
    activeTab,
    setActiveTab,
    machine_list,
    plandatatable,
    summarydata,
    sxlosstrendingdata,
    dailyLossTrend,
    weeklyLossTrend,
    monthyLossTrend,
    yearlyLossTrend,
    searchKeyword,
    setSearchKeyword,
    filteredData,
    datatbTotalRow,
    showhidePivotTable,
    setShowHidePivotTable,
    initFunction,
    handleExportEX1,
    handleExportEX2,
  } = useBaoCaoRollData();

  const showKpiCharts = activeTab === "all" || activeTab === "kpi_charts";
  const showDataTable = activeTab === "all" || activeTab === "data_table";

  return (
    <div className="precision-baocaoroll">
      {/* 1. Header Bar công nghiệp */}
      <PrecisionBaoCaoRollHeader
        onReload={initFunction}
        totalRows={datatbTotalRow ?? plandatatable?.length ?? 0}
      />

      {/* 2. Bộ Lọc Điều Hành & Thanh Chuyển Tab */}
      <PrecisionBaoCaoRollToolbar
        fromDate={fromdate}
        toDate={todate}
        factory={factory}
        machine={machine}
        machineList={machine_list}
        activeTab={activeTab}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onFactoryChange={setFactory}
        onMachineChange={setMachine}
        onTabChange={setActiveTab}
        onSearch={initFunction}
      />

      {/* 3. Dashboard Scrollable Body */}
      <div className="precision-bcr-body">
        {/* Section 1: KPI & Biểu Đồ Phân Tích */}
        {showKpiCharts && (
          <>
            {/* KPI Cards */}
            <PrecisionBaoCaoRollKpi summarydata={summarydata} />

            {/* Visual Analytics: DevExtreme + 4 Loss Trend Recharts in Two-Column Grid */}
            <PrecisionBaoCaoRollCharts
              sxlosstrendingdata={sxlosstrendingdata}
              fromdate={fromdate}
              todate={todate}
              machine={machine}
              factory={factory}
              dailyLossTrend={dailyLossTrend}
              weeklyLossTrend={weeklyLossTrend}
              monthyLossTrend={monthyLossTrend}
              yearlyLossTrend={yearlyLossTrend}
            />
          </>
        )}

        {/* Section 2: Bảng Tổng Kết Chỉ Số & AG-Grid Dữ Liệu Chi Tiết */}
        {showDataTable && (
          <>
            {/* High-Density Metric Summary Table */}
            <PrecisionBaoCaoRollSummary summarydata={summarydata} />

            {/* AG-Grid Data Table with Search & Action Controls */}
            <PrecisionBaoCaoRollGrid
              filteredData={filteredData}
              plandatatable={plandatatable}
              totalCount={datatbTotalRow}
              searchKeyword={searchKeyword}
              onSearchChange={setSearchKeyword}
              onExportEX1={handleExportEX1}
              onExportEX2={handleExportEX2}
              onOpenPivot={() => setShowHidePivotTable(true)}
            />
          </>
        )}
      </div>

      {/* 4. Pivot Modal Phân Tích Đa Chiều */}
      <PrecisionBaoCaoRollPivotModal
        isOpen={showhidePivotTable}
        onClose={() => setShowHidePivotTable(false)}
        plandatatable={plandatatable}
      />
    </div>
  );
};

export default BAOCAOTHEOROLL;
