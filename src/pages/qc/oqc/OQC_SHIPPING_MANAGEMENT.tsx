import React, { useMemo } from "react";
import "./PrecisionOQCShipping/OQCShipping.scss";
import { useOQCShippingData } from "./PrecisionOQCShipping/useOQCShippingData";
import OQCShippingHeader from "./PrecisionOQCShipping/OQCShippingHeader";
import OQCShippingKpi from "./PrecisionOQCShipping/OQCShippingKpi";
import OQCShippingToolbar from "./PrecisionOQCShipping/OQCShippingToolbar";
import OQCShippingTable from "./PrecisionOQCShipping/OQCShippingTable";
import { getOQCShippingColumns } from "./PrecisionOQCShipping/OQCShippingColumns";

const OQC_SHIPPING_MANAGEMENT: React.FC = () => {
  const {
    fromdate,
    setFromDate,
    todate,
    setToDate,
    gName,
    setGName,
    gCode,
    setGCode,
    custName,
    setCustName,
    shippingData,
    filteredData,
    isLoading,
    quickFilterText,
    setQuickFilterText,
    isFullscreen,
    toggleFullscreen,
    kpiMetrics,
    loadShippingData,
    handleSearchCodeKeyDown,
    exportExcelFiltered,
    exportExcelAll,
  } = useOQCShippingData();

  const columns = useMemo(() => getOQCShippingColumns(), []);

  return (
    <div className="precision-oqc-shipping">
      {/* 1. Header Sub-bar */}
      <OQCShippingHeader
        onRefresh={loadShippingData}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* 2. Useful Widgets & KPI Micro-cards */}
      <OQCShippingKpi metrics={kpiMetrics} />

      {/* 3. SaaS Action Toolbar */}
      <OQCShippingToolbar
        fromdate={fromdate}
        setFromDate={setFromDate}
        todate={todate}
        setToDate={setToDate}
        custName={custName}
        setCustName={setCustName}
        gName={gName}
        setGName={setGName}
        gCode={gCode}
        setGCode={setGCode}
        handleSearchCodeKeyDown={handleSearchCodeKeyDown}
        onSearch={loadShippingData}
        isLoading={isLoading}
        quickFilterText={quickFilterText}
        setQuickFilterText={setQuickFilterText}
        onExportExcelFiltered={exportExcelFiltered}
        onExportExcelAll={exportExcelAll}
        filteredCount={filteredData.length}
        totalCount={shippingData.length}
      />

      {/* 4. Main AGTable High-Density Body */}
      <OQCShippingTable columns={columns} data={filteredData} />
    </div>
  );
};

export default OQC_SHIPPING_MANAGEMENT;
