import React, { useMemo } from "react";
import "./PrecisionQTRData/PrecisionQTRData.scss";
import { useQTRData } from "./PrecisionQTRData/useQTRData";
import PrecisionQTRDataHeader from "./PrecisionQTRData/PrecisionQTRDataHeader";
import PrecisionQTRDataKpi from "./PrecisionQTRData/PrecisionQTRDataKpi";
import PrecisionQTRDataToolbar from "./PrecisionQTRData/PrecisionQTRDataToolbar";
import PrecisionQTRDataTable from "./PrecisionQTRData/PrecisionQTRDataTable";
import { getQTRDataColumns } from "./PrecisionQTRData/PrecisionQTRDataColumns";

export interface QTR_DATA {
  MANAGEMENT_NUMBER: string;
  REGISTERED_DATE: string;
  PLANT: string;
  MONTH_QTR: string;
  PART_CODE: string;
  QTR_PPM: number;
  OCCUR_PLACE: string;
  DEFECT_QTY: number;
  WH_OUT_QTY: number;
  APPROVAL: string;
  TITLE: string;
  PART_NAME: string;
  PART_GROUP: string;
  MAIN_CATEGORY: string;
  PROJECT: string;
  BASIC_MODEL: string;
  DEFECT_DETAILS: string;
  SAMPLE_QTY: number;
  DEFECT_RATE: number;
  APPROVER: string;
  APPROVAL_DATE: string;
  REASON1: string;
  G_CODE: string;
  CUST_CD: string;
  G_NAME: string;
  UNIT: string;
  PROD_TYPE: string;
  INS_EMPL: string;
  INS_DATE: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  QTR_YN: string;
  PART_CODE_OTHERS?: string;
  id?: number;
}

const QTR_DATA: React.FC = () => {
  const {
    fromdate,
    setFromDate,
    todate,
    setToDate,
    btpData,
    filteredData,
    handleLoadQTRData,
    handleSearchKeyDown,
    isLoading,
    quickFilterText,
    setQuickFilterText,
    isFullscreen,
    toggleFullscreen,
    kpiMetrics,
    exportExcelFiltered,
    exportExcelAll,
  } = useQTRData();

  const columns = useMemo(() => getQTRDataColumns(), []);

  return (
    <div className="precision-qtr-data">
      {/* 1. Header Sub-bar */}
      <PrecisionQTRDataHeader
        onRefresh={handleLoadQTRData}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* 2. Useful Widgets & KPI Micro-cards */}
      <PrecisionQTRDataKpi metrics={kpiMetrics} />

      {/* 3. SaaS Action Toolbar */}
      <PrecisionQTRDataToolbar
        fromdate={fromdate}
        setFromDate={setFromDate}
        todate={todate}
        setToDate={setToDate}
        handleSearchKeyDown={handleSearchKeyDown}
        onSearch={handleLoadQTRData}
        isLoading={isLoading}
        quickFilterText={quickFilterText}
        setQuickFilterText={setQuickFilterText}
        onExportExcelFiltered={exportExcelFiltered}
        onExportExcelAll={exportExcelAll}
        filteredCount={filteredData.length}
        totalCount={btpData.length}
      />

      {/* 4. Main AGTable High-Density Body */}
      <PrecisionQTRDataTable
        columns={columns}
        data={filteredData}
      />
    </div>
  );
};

export default QTR_DATA;
