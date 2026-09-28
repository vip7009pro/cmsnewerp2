import React, { useCallback, useMemo, useRef, useState } from "react";
import "./PrecisionBaoCaoRoll/PrecisionBaoCaoRoll.scss";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import { useBaoCaoRollData } from "./PrecisionBaoCaoRoll/useBaoCaoRollData";
import { PrecisionBaoCaoRollHeader } from "./PrecisionBaoCaoRoll/PrecisionBaoCaoRollHeader";
import { PrecisionBaoCaoRollToolbar } from "./PrecisionBaoCaoRoll/PrecisionBaoCaoRollToolbar";
import { PrecisionBaoCaoRollKpi } from "./PrecisionBaoCaoRoll/PrecisionBaoCaoRollKpi";
import { PrecisionBaoCaoRollCharts } from "./PrecisionBaoCaoRoll/PrecisionBaoCaoRollCharts";
import { PrecisionBaoCaoRollSummary } from "./PrecisionBaoCaoRoll/PrecisionBaoCaoRollSummary";
import { PrecisionBaoCaoRollGrid } from "./PrecisionBaoCaoRoll/PrecisionBaoCaoRollGrid";
import PrecisionBaoCaoRollMobileHeader from "./PrecisionBaoCaoRoll/PrecisionBaoCaoRollMobileHeader";
import PrecisionBaoCaoRollMobileKpi from "./PrecisionBaoCaoRoll/PrecisionBaoCaoRollMobileKpi";
import PrecisionBaoCaoRollMobileToolbar from "./PrecisionBaoCaoRoll/PrecisionBaoCaoRollMobileToolbar";
import PrecisionBaoCaoRollMobileFilterDrawer from "./PrecisionBaoCaoRoll/PrecisionBaoCaoRollMobileFilterDrawer";
import { lazyOpenable } from "../../../components/PivotChart/lazyOpenable";

// Pivot modal chỉ nạp ĐỘNG khi mở (module kéo theo DevExtreme) — xem lazyOpenable.tsx.
const PrecisionBaoCaoRollPivotModal = lazyOpenable(() =>
  import("./PrecisionBaoCaoRoll/PrecisionBaoCaoRollPivotModal").then(
    (m) => m.PrecisionBaoCaoRollPivotModal,
  ),
);

const BAOCAOTHEOROLL: React.FC = () => {
  const isMobile = useIsMobile();
  const [showMobileKpi, setShowMobileKpi] = useState<boolean>(false);
  const [showMobileChart, setShowMobileChart] = useState<boolean>(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  // Giữ GridApi để EX1 xuất đúng các dòng đang hiển thị (search/filter/sort).
  const gridApiRef = useRef<any>(null);
  const handleGridApiReady = useCallback((api: any) => {
    gridApiRef.current = api;
  }, []);

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
    activeFilterCount,
    resetFilters,
    initFunction,
    handleExportEX1,
    handleExportEX2,
  } = useBaoCaoRollData();

  const totalRowCount = datatbTotalRow ?? plandatatable?.length ?? 0;
  const filteredRowCount = filteredData?.length ?? 0;

  const allLossPercent = useMemo(() => {
    if (!summarydata || summarydata.PURE_INPUT <= 0) return 0;
    return (1 - (summarydata.PURE_OUTPUT * 1.0) / summarydata.PURE_INPUT) * 100;
  }, [summarydata]);

  const showKpiCharts = activeTab === "all" || activeTab === "kpi_charts";
  const showDataTable = activeTab === "all" || activeTab === "data_table";

  return (
    <div className={`precision-baocaoroll ${isMobile ? "is-mobile" : ""}`}>
      {/* ========================================================= */}
      {/* 1. DESKTOP VIEW: BẢO TOÀN NGUYÊN VẸN 100% GIAO DIỆN GỐC  */}
      {/* ========================================================= */}
      {!isMobile && (
        <>
          {/* Header Bar công nghiệp */}
          <PrecisionBaoCaoRollHeader
            onReload={initFunction}
            totalRows={totalRowCount}
          />

          {/* Bộ Lọc Điều Hành & Thanh Chuyển Tab */}
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

          {/* Dashboard Scrollable Body */}
          <div className="precision-bcr-body">
            {/* Section 1: KPI & Biểu Đồ Phân Tích */}
            {showKpiCharts && (
              <>
                <PrecisionBaoCaoRollKpi summarydata={summarydata} />
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
                <PrecisionBaoCaoRollSummary summarydata={summarydata} />
                <PrecisionBaoCaoRollGrid
                  filteredData={filteredData}
                  plandatatable={plandatatable}
                  totalCount={totalRowCount}
                  searchKeyword={searchKeyword}
                  onSearchChange={setSearchKeyword}
                  onExportEX1={() => handleExportEX1(gridApiRef.current)}
                  onExportEX2={handleExportEX2}
                  onOpenPivot={() => setShowHidePivotTable(true)}
                  isMobile={false}
                  onGridApiReady={handleGridApiReady}
                />
              </>
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
          <PrecisionBaoCaoRollMobileHeader
            totalCount={totalRowCount}
            filteredCount={filteredRowCount}
            inputMeters={summarydata.INPUT_QTY}
            okMeters={summarydata.OK_MET_TT}
            allLossPercent={allLossPercent}
            showKpi={showMobileKpi}
            onToggleKpi={() => setShowMobileKpi((prev) => !prev)}
            showChart={showMobileChart}
            onToggleChart={() => setShowMobileChart((prev) => !prev)}
            onRefresh={initFunction}
          />

          {/* Dải Micro-KPI Cuộn Ngang (Chỉ hiện khi bật) */}
          {showMobileKpi && (
            <PrecisionBaoCaoRollMobileKpi
              summarydata={summarydata}
              onClose={() => setShowMobileKpi(false)}
            />
          )}

          {/* Biểu Đồ Phân Tích Trên Mobile (Chỉ hiện khi bật) */}
          {showMobileChart && (
            <div style={{ maxHeight: "300px", overflowY: "auto", flexShrink: 0 }}>
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
            </div>
          )}

          {/* Toolbar 2 Hàng Công Thái Học Di Động */}
          <PrecisionBaoCaoRollMobileToolbar
            searchKeyword={searchKeyword}
            onSearchChange={setSearchKeyword}
            onOpenFilter={() => setShowFilterDrawer(true)}
            activeFilterCount={activeFilterCount}
            onExportEX1={() => handleExportEX1(gridApiRef.current)}
            onExportEX2={handleExportEX2}
            onOpenPivot={() => setShowHidePivotTable(true)}
            totalRows={totalRowCount}
            filteredRows={filteredRowCount}
          />

          {/* AG-Grid Chiếm Trọn Không Gian Còn Lại */}
          <div className="precision-bcr-body">
            <PrecisionBaoCaoRollGrid
              filteredData={filteredData}
              plandatatable={plandatatable}
              totalCount={totalRowCount}
              searchKeyword={searchKeyword}
              onSearchChange={setSearchKeyword}
              onExportEX1={() => handleExportEX1(gridApiRef.current)}
              onExportEX2={handleExportEX2}
              onOpenPivot={() => setShowHidePivotTable(true)}
              isMobile={true}
              onGridApiReady={handleGridApiReady}
            />
          </div>

          {/* Bottom Sheet Filter Drawer Zero-Blur */}
          {showFilterDrawer && (
            <PrecisionBaoCaoRollMobileFilterDrawer
              isOpen={showFilterDrawer}
              onClose={() => setShowFilterDrawer(false)}
              fromDate={fromdate}
              toDate={todate}
              factory={factory}
              machine={machine}
              machineList={machine_list}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
              onFactoryChange={setFactory}
              onMachineChange={setMachine}
              onSearch={initFunction}
              onReset={resetFilters}
            />
          )}
        </>
      )}

      {/* ========================================================= */}
      {/* 3. MODAL PHÂN TÍCH PIVOT TABLE (DÙNG CHUNG CẢ HAI CHẾ ĐỘ) */}
      {/* ========================================================= */}
      <PrecisionBaoCaoRollPivotModal
        isOpen={showhidePivotTable}
        onClose={() => setShowHidePivotTable(false)}
        plandatatable={plandatatable}
      />
    </div>
  );
};

export default React.memo(BAOCAOTHEOROLL);
