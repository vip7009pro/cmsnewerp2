import React from "react";
import "./PrecisionHOLDING/PrecisionHOLDING.scss";
import { useHoldingData } from "./PrecisionHOLDING/useHoldingData";
import { PrecisionHoldingHeader } from "./PrecisionHOLDING/PrecisionHoldingHeader";
import { PrecisionHoldingKpi } from "./PrecisionHOLDING/PrecisionHoldingKpi";
import { PrecisionHoldingSidebar } from "./PrecisionHOLDING/PrecisionHoldingSidebar";
import { PrecisionHoldingToolbar } from "./PrecisionHOLDING/PrecisionHoldingToolbar";
import { PrecisionHoldingTable } from "./PrecisionHOLDING/PrecisionHoldingTable";

const HOLDING: React.FC = () => {
  const {
    userData,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    alltime,
    setAllTime,
    m_name,
    setM_Name,
    m_code,
    setM_Code,
    mLotNo,
    setMLotNo,
    mStatus,
    setMStatus,
    ncrId,
    setNCRID,
    id,
    setID,
    holdingdatatable,
    quickFilterText,
    setQuickFilterText,
    isFullscreen,
    toggleFullscreen,
    onSelectionChange,
    handletraHoldingData,
    setQCPASS,
    updateNCRIDHolding,
    updateReason,
    handleExportExcel,
    handleResetFilters,
    kpiStats,
  } = useHoldingData();

  return (
    <div className={`precision-holding ${isFullscreen ? "is-fullscreen" : ""}`}>
      {/* 1. Header Sub-module */}
      <PrecisionHoldingHeader
        userData={userData}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onRefresh={handletraHoldingData}
      />

      {/* 2. Realtime KPI Micro-Cards */}
      <PrecisionHoldingKpi kpiStats={kpiStats} />

      {/* 3. Main Workspace: Sidebar Filter + Data Content */}
      <main className="precision-holding-workspace">
        <PrecisionHoldingSidebar
          fromdate={fromdate}
          setFromDate={setFromDate}
          todate={todate}
          setToDate={setToDate}
          alltime={alltime}
          setAllTime={setAllTime}
          m_name={m_name}
          setM_Name={setM_Name}
          m_code={m_code}
          setM_Code={setM_Code}
          mLotNo={mLotNo}
          setMLotNo={setMLotNo}
          mStatus={mStatus}
          setMStatus={setMStatus}
          ncrId={ncrId}
          setNCRID={setNCRID}
          id={id}
          setID={setID}
          onSearch={handletraHoldingData}
          onReset={handleResetFilters}
          onSetPass={setQCPASS}
          onUpdateNCR={updateNCRIDHolding}
          onUpdateReason={updateReason}
        />

        <div className="precision-holding-main-content">
          <PrecisionHoldingToolbar
            onSearch={handletraHoldingData}
            onSetPass={setQCPASS}
            onUpdateNCR={updateNCRIDHolding}
            onUpdateReason={updateReason}
            quickFilterText={quickFilterText}
            setQuickFilterText={setQuickFilterText}
            onExportExcel={handleExportExcel}
          />

          <PrecisionHoldingTable
            data={holdingdatatable}
            quickFilterText={quickFilterText}
            onSelectionChange={onSelectionChange}
          />
        </div>
      </main>
    </div>
  );
};

export default HOLDING;
