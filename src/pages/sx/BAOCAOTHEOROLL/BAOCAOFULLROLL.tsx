import React, { useState } from "react";
import "./PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRoll.scss";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import { useBaoCaoFullRollData, f_handleLoadFullRollData } from "./PrecisionBaoCaoFullRoll/useBaoCaoFullRollData";
import { PrecisionBaoCaoFullRollHeader } from "./PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollHeader";
import { PrecisionBaoCaoFullRollToolbar } from "./PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollToolbar";
import { PrecisionBaoCaoFullRollKpi } from "./PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollKpi";
import { PrecisionBaoCaoFullRollCharts } from "./PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollCharts";
import { PrecisionBaoCaoFullRollSummary } from "./PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollSummary";
import { PrecisionBaoCaoFullRollGrid } from "./PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollGrid";
import PrecisionBaoCaoFullRollMobileHeader from "./PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollMobileHeader";
import PrecisionBaoCaoFullRollMobileKpi from "./PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollMobileKpi";
import PrecisionBaoCaoFullRollMobileToolbar from "./PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollMobileToolbar";
import PrecisionBaoCaoFullRollMobileFilterDrawer from "./PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollMobileFilterDrawer";

// Re-export hàm tải dữ liệu để tương thích ngược hoàn toàn
export { f_handleLoadFullRollData };

const BAOCAOFULLROLL: React.FC = () => {
  const isMobile = useIsMobile();
  const [showMobileKpi, setShowMobileKpi] = useState<boolean>(false);
  const [showMobileChart, setShowMobileChart] = useState<boolean>(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

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
    activeFilterCount,
    resetFilters,
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

  const totalRowCount = fullRollData.length;
  const filteredRowCount = filteredData.length;

  const showKpiAndCharts = viewMode === "all" || viewMode === "charts";
  const showSummary = viewMode === "all" || viewMode === "charts";
  const showGrid = viewMode === "all" || viewMode === "grid";

  return (
    <div className={`precision-baocaofullroll ${isMobile ? "is-mobile" : ""}`}>
      {/* ========================================================= */}
      {/* 1. DESKTOP VIEW: BẢO TOÀN NGUYÊN VẸN 100% GIAO DIỆN GỐC  */}
      {/* ========================================================= */}
      {!isMobile && (
        <>
          {/* Header Bar công nghiệp */}
          <PrecisionBaoCaoFullRollHeader
            totalRows={totalRowCount}
            isLoading={isLoading}
            onReload={handleLoadData}
          />

          {/* Toolbar điều khiển lọc & Segmented Switcher */}
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

          {/* Dashboard Scrollable Body */}
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
                totalCount={totalRowCount}
                searchKeyword={searchKeyword}
                onSearchKeywordChange={setSearchKeyword}
                onExportEX1={handleExportEX1}
                onExportEX2={handleExportEX2}
                isMobile={false}
              />
            )}
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 2. MOBILE VIEW: CÔNG THÁI HỌC, SIÊU TINH GỌN & HIỆU NĂNG */}
      {/* ========================================================= */}
      {isMobile && (
        <>
          {/* Mobile Header Tinh Gọn */}
          <PrecisionBaoCaoFullRollMobileHeader
            totalCount={totalRowCount}
            filteredCount={filteredRowCount}
            inputMet={kpiData.inputMet}
            resultMet={kpiData.resultMet}
            yieldRate={kpiData.yieldRate}
            settingLossRate={kpiData.settingLossRate}
            showKpi={showMobileKpi}
            onToggleKpi={() => setShowMobileKpi((prev) => !prev)}
            showChart={showMobileChart}
            onToggleChart={() => setShowMobileChart((prev) => !prev)}
            onRefresh={handleLoadData}
            isLoading={isLoading}
          />

          {/* Dải Micro-KPI Cuộn Ngang (Chỉ hiện khi bật) */}
          {showMobileKpi && (
            <PrecisionBaoCaoFullRollMobileKpi
              kpiData={kpiData}
              onClose={() => setShowMobileKpi(false)}
            />
          )}

          {/* Biểu Đồ Phân Tích Trên Mobile (Chỉ hiện khi bật) */}
          {showMobileChart && (
            <div style={{ maxHeight: "300px", overflowY: "auto", flexShrink: 0 }}>
              <PrecisionBaoCaoFullRollCharts
                dailyTrendData={dailyTrendData}
                topProductsData={topProductsData}
                materialBreakdownData={materialBreakdownData}
              />
            </div>
          )}

          {/* Toolbar 2 Hàng Công Thái Học Di Động */}
          <PrecisionBaoCaoFullRollMobileToolbar
            searchKeyword={searchKeyword}
            onSearchChange={setSearchKeyword}
            onOpenFilter={() => setShowFilterDrawer(true)}
            activeFilterCount={activeFilterCount}
            onExportEX1={handleExportEX1}
            onExportEX2={handleExportEX2}
            totalRows={totalRowCount}
            filteredRows={filteredRowCount}
          />

          {/* AGTable Chiếm Trọn Không Gian Còn Lại */}
          <div className="precision-bcfr-body">
            <PrecisionBaoCaoFullRollGrid
              data={filteredData}
              totalCount={totalRowCount}
              searchKeyword={searchKeyword}
              onSearchKeywordChange={setSearchKeyword}
              onExportEX1={handleExportEX1}
              onExportEX2={handleExportEX2}
              isMobile={true}
            />
          </div>

          {/* Bottom Sheet Filter Drawer Zero-Blur */}
          {showFilterDrawer && (
            <PrecisionBaoCaoFullRollMobileFilterDrawer
              isOpen={showFilterDrawer}
              onClose={() => setShowFilterDrawer(false)}
              fromDate={fromDate}
              toDate={toDate}
              allTime={allTime}
              factory={factory}
              machine={machine}
              machineList={machineList}
              codeKd={codeKd}
              codeCms={codeCms}
              mName={mName}
              mCode={mCode}
              prodRequestNo={prodRequestNo}
              planId={planId}
              custNameKd={custNameKd}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
              onAllTimeChange={setAllTime}
              onFactoryChange={setFactory}
              onMachineChange={setMachine}
              onCodeKdChange={setCodeKd}
              onCodeCmsChange={setCodeCms}
              onMNameChange={setMName}
              onMCodeChange={setMCode}
              onProdRequestNoChange={setProdRequestNo}
              onPlanIdChange={setPlanId}
              onCustNameKdChange={setCustNameKd}
              onSearch={handleLoadData}
              onReset={resetFilters}
            />
          )}
        </>
      )}
    </div>
  );
};

export default React.memo(BAOCAOFULLROLL);
export { BAOCAOFULLROLL };
