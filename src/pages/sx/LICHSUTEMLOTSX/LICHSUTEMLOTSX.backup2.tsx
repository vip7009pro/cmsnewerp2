import React from "react";
import "./PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSx.scss";
import { useLichSuTemLotSxData } from "./PrecisionLichSuTemLotSx/useLichSuTemLotSxData";
import { PrecisionLichSuTemLotSxHeader } from "./PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxHeader";
import { PrecisionLichSuTemLotSxToolbar } from "./PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxToolbar";
import { PrecisionLichSuTemLotSxKpi } from "./PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxKpi";
import { PrecisionLichSuTemLotSxCharts } from "./PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxCharts";
import { PrecisionLichSuTemLotSxGrid } from "./PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxGrid";
import { PrecisionLichSuTemLotSxModal } from "./PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxModal";

const LICHSUTEMLOTSX: React.FC = () => {
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
  } = useLichSuTemLotSxData();

  // Tính tổng sản lượng EA
  const totalQty = React.useMemo(() => {
    return filteredData.reduce((acc, cur) => acc + (Number(cur.TEMP_QTY) || 0), 0);
  }, [filteredData]);

  return (
    <div className="precision-lichsutemlotsx">
      {/* 1. Header Bar công nghiệp */}
      <PrecisionLichSuTemLotSxHeader
        totalCount={lichsutemlotdata.length}
        filteredCount={filteredData.length}
        totalQty={totalQty}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={load_lichsutemlot_data}
        isLoading={isLoading}
      />

      {/* 2. Bộ lọc Compact */}
      <PrecisionLichSuTemLotSxToolbar
        filterData={filterData}
        onFilterChange={setFilterFormInfo}
        onSearch={load_lichsutemlot_data}
        isLoading={isLoading}
      />

      {/* 3. Dashboard 6 Micro-Cards KPI Realtime */}
      <PrecisionLichSuTemLotSxKpi data={filteredData} />

      {/* 4. Executive Dashboard Biểu đồ Recharts */}
      {(viewMode === "ALL" || viewMode === "CHARTS") && (
        <PrecisionLichSuTemLotSxCharts
          data={filteredData}
          isCollapsed={isChartCollapsed && viewMode === "ALL"}
          onToggleCollapse={() => setIsChartCollapsed(!isChartCollapsed)}
        />
      )}

      {/* 5. Bảng Lưới AG Grid High-Density */}
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
        />
      )}

      {/* 6. Modal Xem Trước & In Tem Lót Chuyên Nghiệp */}
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

export default LICHSUTEMLOTSX;
