import React from "react";
import Swal from "sweetalert2";
import "./PrecisionFAILING/PrecisionFAILING.scss";
import { useFailingData } from "./PrecisionFAILING/useFailingData";
import { PrecisionFailingHeader } from "./PrecisionFAILING/PrecisionFailingHeader";
import { PrecisionFailingKpi } from "./PrecisionFAILING/PrecisionFailingKpi";
import { PrecisionFailingSidebar } from "./PrecisionFAILING/PrecisionFailingSidebar";
import { PrecisionFailingToolbar } from "./PrecisionFAILING/PrecisionFailingToolbar";
import { PrecisionFailingTable } from "./PrecisionFAILING/PrecisionFailingTable";

const FAILING: React.FC = () => {
  const failingData = useFailingData();
  const {
    userData,
    isFullscreen,
    toggleFullscreen,
    inspectiondatatable,
    onSelectionChange,
    handletraFailingData,
    setQCPASS,
    setClose,
    setIQCConfirm,
    updateNCRIDFailing,
    handleExportExcel,
    handleNewFailing,
    kpiStats,
    quickFilterText,
    setQuickFilterText,
    updateQCFailTable,
    planId,
    request_empl2,
    handleAddFailingRow,
    saveFailingData,
  } = failingData;

  return (
    <div className={`precision-failing ${isFullscreen ? "is-fullscreen" : ""}`}>
      {/* 1. Sub-Header Component */}
      <PrecisionFailingHeader
        userData={userData}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onRefresh={handletraFailingData}
      />

      {/* 2. Realtime KPI Micro-cards */}
      <PrecisionFailingKpi kpiStats={kpiStats} />

      {/* 3. Main Workspace: 3-in-1 Sidebar + Data Table */}
      <main className="precision-failing-workspace">
        <PrecisionFailingSidebar
          {...failingData}
          onAddRow={handleAddFailingRow}
          onSaveData={saveFailingData}
          onOutputFail={updateQCFailTable}
          onSearch={handletraFailingData}
        />

        <div className="precision-failing-main-content">
          <PrecisionFailingToolbar
            onNewFailing={handleNewFailing}
            onSearch={handletraFailingData}
            onSetPass={setQCPASS}
            onSetClose={setClose}
            onConfirm={() => {
              if (request_empl2 === "") {
                Swal.fire("Thông báo", "Hãy nhập mã người xác nhận ở thanh bên", "error");
              } else {
                setIQCConfirm(request_empl2);
              }
            }}
            onUpdateNCR={updateNCRIDFailing}
            onOutputFail={updateQCFailTable}
            quickFilterText={quickFilterText}
            setQuickFilterText={setQuickFilterText}
            onExportExcel={handleExportExcel}
            planId={planId}
          />

          <PrecisionFailingTable
            data={inspectiondatatable}
            quickFilterText={quickFilterText}
            onSelectionChange={onSelectionChange}
          />
        </div>
      </main>
    </div>
  );
};

export default FAILING;
