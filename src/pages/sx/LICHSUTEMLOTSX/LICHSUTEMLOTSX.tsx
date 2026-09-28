import React, { useState, useCallback, useRef } from "react";
import "./PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSx.scss";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import { useLichSuTemLotSxData } from "./PrecisionLichSuTemLotSx/useLichSuTemLotSxData";
import { PrecisionLichSuTemLotSxHeader } from "./PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxHeader";
import { PrecisionLichSuTemLotSxToolbar } from "./PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxToolbar";
import { PrecisionLichSuTemLotSxKpi } from "./PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxKpi";
import { PrecisionLichSuTemLotSxCharts } from "./PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxCharts";
import { PrecisionLichSuTemLotSxGrid } from "./PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxGrid";
import { PrecisionLichSuTemLotSxModal } from "./PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxModal";
import PrecisionLichSuTemLotSxMobileHeader from "./PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxMobileHeader";
import PrecisionLichSuTemLotSxMobileKpi from "./PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxMobileKpi";
import PrecisionLichSuTemLotSxMobileToolbar from "./PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxMobileToolbar";
import PrecisionLichSuTemLotSxMobileFilterDrawer from "./PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxMobileFilterDrawer";

const LICHSUTEMLOTSX: React.FC = () => {
  const isMobile = useIsMobile();
  const [showMobileKpi, setShowMobileKpi] = useState<boolean>(false);
  const [showMobileCharts, setShowMobileCharts] = useState<boolean>(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  // Giữ GridApi để EX1 xuất đúng các dòng đang hiển thị (search/filter/sort).
  const gridApiRef = useRef<any>(null);
  const handleGridApiReady = useCallback((api: any) => {
    gridApiRef.current = api;
  }, []);

  const {
    lichsutemlotdata,
    filteredData,
    filterData,
    selectedRow,
    componentList,
    showhideTemLot,
    searchKeyword,
    viewMode,
    isChartCollapsed,
    isLoading,
    labelprintref,
    setShowHideTemLot,
    setSearchKeyword,
    setViewMode,
    setIsChartCollapsed,
    setFilterFormInfo,
    load_lichsutemlot_data,
    handleSelectRow,
    handleOpenPreview,
    handlePrint,
    handleCancelLot,
    handleExportExcel,
    activeFilterCount,
    resetFilters,
  } = useLichSuTemLotSxData();

  // Tính tổng sản lượng EA
  const totalQty = React.useMemo(() => {
    return filteredData.reduce((acc, cur) => acc + (Number(cur.TEMP_QTY) || 0), 0);
  }, [filteredData]);

  return (
    <div className={`precision-lichsutemlotsx ${isMobile ? "is-mobile" : ""}`}>
      {/* ========================================================= */}
      {/* 1. DESKTOP VIEW: BẢO TOÀN NGUYÊN VẸN 100% GIAO DIỆN GỐC  */}
      {/* ========================================================= */}
      {!isMobile && (
        <>
          {/* Header Bar công nghiệp */}
          <PrecisionLichSuTemLotSxHeader
            totalCount={lichsutemlotdata.length}
            filteredCount={filteredData.length}
            totalQty={totalQty}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onRefresh={load_lichsutemlot_data}
            isLoading={isLoading}
          />

          {/* Bộ lọc Compact */}
          <PrecisionLichSuTemLotSxToolbar
            filterData={filterData}
            onFilterChange={setFilterFormInfo}
            onSearch={load_lichsutemlot_data}
            isLoading={isLoading}
          />

          {/* Dashboard 6 Micro-Cards KPI Realtime */}
          <PrecisionLichSuTemLotSxKpi data={filteredData} />

          {/* Executive Dashboard Biểu đồ Recharts */}
          {(viewMode === "ALL" || viewMode === "CHARTS") && (
            <PrecisionLichSuTemLotSxCharts
              data={filteredData}
              isCollapsed={isChartCollapsed && viewMode === "ALL"}
              onToggleCollapse={() => setIsChartCollapsed(!isChartCollapsed)}
            />
          )}

          {/* Bảng Lưới AG Grid High-Density */}
          {(viewMode === "ALL" || viewMode === "GRID") && (
            <PrecisionLichSuTemLotSxGrid
              data={filteredData}
              totalCount={lichsutemlotdata.length}
              searchKeyword={searchKeyword}
              onSearchKeywordChange={setSearchKeyword}
              onSelectRow={handleSelectRow}
              onOpenPreview={handleOpenPreview}
              onCancelLot={handleCancelLot}
              onExportExcel={handleExportExcel}
              selectedRow={selectedRow}
              isMobile={false}
              onGridApiReady={handleGridApiReady}
            />
          )}
        </>
      )}

      {/* ========================================================= */}
      {/* 2. MOBILE VIEW: CÔNG THÁI HỌC, SIÊU TINH GỌN & HIỆU NĂNG */}
      {/* ========================================================= */}
      {isMobile && (
        <>
          {/* Mobile Header Tinh Gọn */}
          <PrecisionLichSuTemLotSxMobileHeader
            totalCount={lichsutemlotdata.length}
            filteredCount={filteredData.length}
            totalQty={totalQty}
            selectedLot={selectedRow?.PROCESS_LOT_NO}
            showKpi={showMobileKpi}
            onToggleKpi={() => setShowMobileKpi((prev) => !prev)}
            showCharts={showMobileCharts}
            onToggleCharts={() => setShowMobileCharts((prev) => !prev)}
            onRefresh={load_lichsutemlot_data}
            isLoading={isLoading}
          />

          {/* Micro-KPI Dải Cuộn Ngang (Chỉ hiện khi bật) */}
          {showMobileKpi && (
            <PrecisionLichSuTemLotSxMobileKpi
              data={filteredData}
              onClose={() => setShowMobileKpi(false)}
            />
          )}

          {/* Biểu đồ xu hướng trên mobile (Chỉ hiện khi bật) */}
          {showMobileCharts && (
            <PrecisionLichSuTemLotSxCharts
              data={filteredData}
              isCollapsed={false}
              onToggleCollapse={() => setShowMobileCharts(false)}
            />
          )}

          {/* Mobile Toolbar 2 Hàng Công Thái Học */}
          <PrecisionLichSuTemLotSxMobileToolbar
            searchKeyword={searchKeyword}
            onSearchKeywordChange={setSearchKeyword}
            onOpenFilter={() => setShowFilterDrawer(true)}
            activeFilterCount={activeFilterCount}
            onOpenPreview={() => handleOpenPreview()}
            onCancelLot={handleCancelLot}
            onExportExcel={(type) => handleExportExcel(type, gridApiRef.current)}
            dataCount={filteredData.length}
            totalCount={lichsutemlotdata.length}
            selectedLot={selectedRow?.PROCESS_LOT_NO}
          />

          {/* Bảng Dữ Liệu Chiếm Trọn Không Gian Còn Lại */}
          <PrecisionLichSuTemLotSxGrid
            data={filteredData}
            totalCount={lichsutemlotdata.length}
            searchKeyword={searchKeyword}
            onSearchKeywordChange={setSearchKeyword}
            onSelectRow={handleSelectRow}
            onOpenPreview={handleOpenPreview}
            onCancelLot={handleCancelLot}
            onExportExcel={handleExportExcel}
            selectedRow={selectedRow}
            isMobile={true}
            onGridApiReady={handleGridApiReady}
          />

          {/* Bottom Sheet Filter Drawer Zero-Blur */}
          {showFilterDrawer && (
            <PrecisionLichSuTemLotSxMobileFilterDrawer
              isOpen={showFilterDrawer}
              onClose={() => setShowFilterDrawer(false)}
              filterData={filterData}
              onFilterChange={setFilterFormInfo}
              onSearch={load_lichsutemlot_data}
              onReset={resetFilters}
              isLoading={isLoading}
            />
          )}
        </>
      )}

      {/* ========================================================= */}
      {/* 3. MODAL XEM TRƯỚC & IN TEM LÓT (DÙNG CHUNG CẢ HAI CHẾ ĐỘ)*/}
      {/* ========================================================= */}
      <PrecisionLichSuTemLotSxModal
        isOpen={showhideTemLot}
        onClose={() => setShowHideTemLot(false)}
        onPrint={handlePrint}
        labelPrintRef={labelprintref}
        componentList={componentList}
        selectedRow={selectedRow}
      />
    </div>
  );
};

export default React.memo(LICHSUTEMLOTSX);
