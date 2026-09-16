import React, { useMemo } from "react";
import "./PrecisionOQCData/PrecisionOQCData.scss";
import { useOQCData } from "./PrecisionOQCData/useOQCData";
import PrecisionOQCDataHeader from "./PrecisionOQCData/PrecisionOQCDataHeader";
import PrecisionOQCDataKpi from "./PrecisionOQCData/PrecisionOQCDataKpi";
import PrecisionOQCDataToolbar from "./PrecisionOQCData/PrecisionOQCDataToolbar";
import PrecisionOQCDataTable from "./PrecisionOQCData/PrecisionOQCDataTable";
import { getOQCDataColumns } from "./PrecisionOQCData/PrecisionOQCDataColumns";

const OQC_DATA_TB: React.FC = () => {
  const {
    fromdate,
    setFromDate,
    todate,
    setToDate,
    oqc_table_data,
    filteredData,
    selectedRows,
    setOQCFormInfo,
    handleSearchCodeKeyDown,
    load_oqc_data,
    isLoading,
    quickFilterText,
    setQuickFilterText,
    isFullscreen,
    toggleFullscreen,
    kpiMetrics,
    exportExcelFiltered,
    exportExcelAll,
  } = useOQCData();

  const columns = useMemo(() => getOQCDataColumns(), []);

  return (
    <div className="precision-oqc-data">
      {/* 1. Header Sub-bar */}
      <PrecisionOQCDataHeader
        onRefresh={load_oqc_data}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* 2. Useful Widgets & KPI Micro-cards */}
      <PrecisionOQCDataKpi metrics={kpiMetrics} />

      {/* 3. SaaS Action Toolbar */}
      <PrecisionOQCDataToolbar
        fromdate={fromdate}
        setFromDate={setFromDate}
        todate={todate}
        setToDate={setToDate}
        selectedRows={selectedRows}
        setOQCFormInfo={setOQCFormInfo}
        handleSearchCodeKeyDown={handleSearchCodeKeyDown}
        onSearch={load_oqc_data}
        isLoading={isLoading}
        quickFilterText={quickFilterText}
        setQuickFilterText={setQuickFilterText}
        onExportExcelFiltered={exportExcelFiltered}
        onExportExcelAll={exportExcelAll}
        filteredCount={filteredData.length}
        totalCount={oqc_table_data.length}
      />

      {/* 4. Main AGTable High-Density Body */}
      <PrecisionOQCDataTable
        columns={columns}
        data={filteredData}
      />
    </div>
  );
};

export default OQC_DATA_TB;
