import React from "react";
import "./PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRoll.scss";
import { useBaoCaoFullRollData, f_handleLoadFullRollData } from "./PrecisionBaoCaoFullRoll/useBaoCaoFullRollData";
import { PrecisionBaoCaoFullRollHeader } from "./PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollHeader";
import { PrecisionBaoCaoFullRollToolbar } from "./PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollToolbar";
import { PrecisionBaoCaoFullRollKpi } from "./PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollKpi";
import { PrecisionBaoCaoFullRollCharts } from "./PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollCharts";
import { PrecisionBaoCaoFullRollSummary } from "./PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollSummary";
import { PrecisionBaoCaoFullRollGrid } from "./PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollGrid";

// Re-export hàm tải dữ liệu để tương thích ngược hoàn toàn
export { f_handleLoadFullRollData };

const BAOCAOFULLROLL: React.FC = () => {
  const {
    // Filter props
    fromDate, setFromDate,
    toDate, setToDate,
    codeKd, setCodeKd,
    codeCms, setCodeCms,
    mName, setMName,
    mCode, setMCode,
    prodRequestNo, setProdRequestNo,
    planId, setPlanId,
    custNameKd, setCustNameKd,
    factory, setFactory,
    machine, setMachine,
    allTime, setAllTime,
    machineList,
    // Data & UI states
    fullRollData,
    filteredData,
    isLoading,
    searchKeyword, setSearchKeyword,
    viewMode, setViewMode,
    // Analytics
    kpiData,
    dailyTrendData,
    topProductsData,
    materialBreakdownData,
    summaryMetrics,
    // Handlers
    handleLoadData,
    handleExportEX1,
    handleExportEX2,
  } = useBaoCaoFullRollData();

  const showKpiAndCharts = viewMode === "all" || viewMode === "charts";
  const showSummary = viewMode === "all" || viewMode === "charts";
  const showGrid = viewMode === "all" || viewMode === "grid";

  return (
    <div className="precision-baocaofullroll">
      {/* 1. Header Bar công nghiệp */}
      <PrecisionBaoCaoFullRollHeader
        totalRows={fullRollData.length}
        isLoading={isLoading}
        onReload={handleLoadData}
      />

      {/* 2. Toolbar điều khiển lọc & Segmented Switcher */}
      <PrecisionBaoCaoFullRollToolbar
        fromDate={fromDate}
        toDate={toDate}
        codeKd={codeKd}
        codeCms={codeCms}
        mName={mName}
        mCode={mCode}
        prodRequestNo={prodRequestNo}
        planId={planId}
        custNameKd={custNameKd}
        factory={factory}
        machine={machine}
        allTime={allTime}
        machineList={machineList}
        isLoading={isLoading}
        viewMode={viewMode}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onCodeKdChange={setCodeKd}
        onCodeCmsChange={setCodeCms}
        onMNameChange={setMName}
        onMCodeChange={setMCode}
        onProdRequestNoChange={setProdRequestNo}
        onPlanIdChange={setPlanId}
        onCustNameKdChange={setCustNameKd}
        onFactoryChange={setFactory}
        onMachineChange={setMachine}
        onAllTimeChange={setAllTime}
        onViewModeChange={setViewMode}
        onSearch={handleLoadData}
      />

      {/* 3. Dashboard Scrollable Body */}
      <div className="precision-bcfr-body">
        {/* Phân hệ 1: Dashboard Micro-Cards KPI */}
        {showKpiAndCharts && (
          <PrecisionBaoCaoFullRollKpi kpiData={kpiData} />
        )}

        {/* Phân hệ 2: Hệ thống biểu đồ Recharts phong cách KinhDoanhReport */}
        {showKpiAndCharts && (
          <PrecisionBaoCaoFullRollCharts
            dailyTrendData={dailyTrendData}
            topProductsData={topProductsData}
            materialBreakdownData={materialBreakdownData}
          />
        )}

        {/* Phân hệ 3: Bảng tổng kết chỉ số 3 hệ đơn vị Mét / EA / M2 */}
        {showSummary && (
          <PrecisionBaoCaoFullRollSummary summaryMetrics={summaryMetrics} />
        )}

        {/* Phân hệ 4: Bảng dữ liệu AGTable High-Density */}
        {showGrid && (
          <PrecisionBaoCaoFullRollGrid
            data={filteredData}
            totalCount={fullRollData.length}
            searchKeyword={searchKeyword}
            onSearchKeywordChange={setSearchKeyword}
            onExportEX1={handleExportEX1}
            onExportEX2={handleExportEX2}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(BAOCAOFULLROLL);
export { BAOCAOFULLROLL };
