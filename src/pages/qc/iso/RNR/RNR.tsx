import React, { useMemo } from "react";
import "./PrecisionRNR/PrecisionRNR.scss";
import { useRNRData } from "./PrecisionRNR/useRNRData";
import PrecisionRNRHeader from "./PrecisionRNR/PrecisionRNRHeader";
import PrecisionRNRKpi from "./PrecisionRNR/PrecisionRNRKpi";
import PrecisionRNRToolbar from "./PrecisionRNR/PrecisionRNRToolbar";
import PrecisionRNRTable from "./PrecisionRNR/PrecisionRNRTable";
import {
  getRNRDetailColumns,
  getRNRSummaryColumns,
  getRNRDeptColumns,
} from "./PrecisionRNR/PrecisionRNRColumns";

const RNR: React.FC = () => {
  const {
    isLoading,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    alltime,
    setAllTime,
    factory,
    setFactory,
    testType,
    setTestType,
    testID,
    setTestID,
    empl_name,
    setEmpl_Name,
    selectedData,
    handleSelectDataChange,
    handletraRNRData,
    handleSearchKeyDown,
    currentData,
    filteredData,
    quickFilterText,
    setQuickFilterText,
    kpiMetrics,
    isFullscreen,
    toggleFullscreen,
    exportExcelFiltered,
    exportExcelAll,
  } = useRNRData();

  // Chọn bộ cột tương ứng theo phân hệ đang kích hoạt
  const columns = useMemo(() => {
    switch (selectedData) {
      case "detail":
        return getRNRDetailColumns();
      case "summaryByDept":
        return getRNRDeptColumns();
      case "summaryByEmpl":
      default:
        return getRNRSummaryColumns();
    }
  }, [selectedData]);

  return (
    <div className="precision-rnr">
      {/* 1. Header Sub-bar Stitch */}
      <PrecisionRNRHeader
        onRefresh={() => handletraRNRData()}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* 2. Cụm KPI Micro-cards & Widgets hữu ích */}
      <PrecisionRNRKpi metrics={kpiMetrics} />

      {/* 3. SaaS Action Toolbar 2 Tầng */}
      <PrecisionRNRToolbar
        fromdate={fromdate}
        setFromDate={setFromDate}
        todate={todate}
        setToDate={setToDate}
        alltime={alltime}
        setAllTime={setAllTime}
        factory={factory}
        setFactory={setFactory}
        testType={testType}
        setTestType={setTestType}
        testID={testID}
        setTestID={setTestID}
        empl_name={empl_name}
        setEmpl_Name={setEmpl_Name}
        selectedData={selectedData}
        onSelectDataChange={handleSelectDataChange}
        onSearch={() => handletraRNRData()}
        handleSearchKeyDown={handleSearchKeyDown}
        isLoading={isLoading}
        quickFilterText={quickFilterText}
        setQuickFilterText={setQuickFilterText}
        onExportExcelFiltered={exportExcelFiltered}
        onExportExcelAll={exportExcelAll}
        filteredCount={filteredData.length}
        totalCount={currentData.length}
      />

      {/* 4. AGTable High-Density Full-Height */}
      <PrecisionRNRTable
        columns={columns}
        data={filteredData}
      />
    </div>
  );
};

export default React.memo(RNR);
