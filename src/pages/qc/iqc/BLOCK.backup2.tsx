import React from "react";
import "./PrecisionBLOCK/PrecisionBLOCK.scss";
import { useBlockData } from "./PrecisionBLOCK/useBlockData";
import { PrecisionBLOCKHeader } from "./PrecisionBLOCK/PrecisionBLOCKHeader";
import { PrecisionBLOCKKpi } from "./PrecisionBLOCK/PrecisionBLOCKKpi";
import { PrecisionBLOCKSidebar } from "./PrecisionBLOCK/PrecisionBLOCKSidebar";
import { PrecisionBLOCKToolbar } from "./PrecisionBLOCK/PrecisionBLOCKToolbar";
import { PrecisionBLOCKTable } from "./PrecisionBLOCK/PrecisionBLOCKTable";

const BLOCK: React.FC = () => {
  const {
    userData,
    isFullscreen,
    toggleFullscreen,
    onlyPending,
    setOnlyPending,
    testtype,
    setTestType,
    vendorLot,
    setVendorLot,
    m_lot_no,
    setM_LOT_NO,
    defect_phenomenon,
    setDefectPhenomenon,
    remark,
    setReMark,
    ncrId,
    setNCRID,
    blockingdatatable,
    quickFilterText,
    setQuickFilterText,
    selectedCount,
    onSelectionChange,
    handletraBlockingData,
    setQCPASS,
    setClose,
    updateNCRIDBlocking,
    handleExportExcel,
    handleResetFilters,
    kpiStats,
  } = useBlockData();

  return (
    <div className={`precision-blocking ${isFullscreen ? "is-fullscreen" : ""}`}>
      {/* 1. Header Sub-module */}
      <PrecisionBLOCKHeader
        userData={userData}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onRefresh={handletraBlockingData}
      />

      {/* 2. Realtime KPI Micro-Cards */}
      <PrecisionBLOCKKpi kpiStats={kpiStats} />

      {/* 3. Main Workspace: Sidebar Filter + Data Grid */}
      <main className="precision-block-workspace">
        <PrecisionBLOCKSidebar
          testtype={testtype}
          setTestType={setTestType}
          vendorLot={vendorLot}
          setVendorLot={setVendorLot}
          m_lot_no={m_lot_no}
          setM_LOT_NO={setM_LOT_NO}
          defect_phenomenon={defect_phenomenon}
          setDefectPhenomenon={setDefectPhenomenon}
          remark={remark}
          setReMark={setReMark}
          ncrId={ncrId}
          setNCRID={setNCRID}
          onlyPending={onlyPending}
          setOnlyPending={setOnlyPending}
          onSearch={handletraBlockingData}
          onReset={handleResetFilters}
          onSetPass={setQCPASS}
          onUpdateNCR={updateNCRIDBlocking}
        />

        <div className="precision-block-main-content">
          <PrecisionBLOCKToolbar
            onSearch={handletraBlockingData}
            onSetPass={setQCPASS}
            onSetClose={setClose}
            onUpdateNCR={updateNCRIDBlocking}
            quickFilterText={quickFilterText}
            setQuickFilterText={setQuickFilterText}
            onExportExcel={handleExportExcel}
          />

          <PrecisionBLOCKTable
            data={blockingdatatable}
            quickFilterText={quickFilterText}
            onSelectionChange={onSelectionChange}
          />
        </div>
      </main>
    </div>
  );
};

export default BLOCK;
