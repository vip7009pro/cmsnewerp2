import React from "react";
import "./PrecisionNCR/PrecisionNCR.scss";
import { useNCRData } from "./PrecisionNCR/useNCRData";
import { usePrecisionNCRColumns } from "./PrecisionNCR/PrecisionNCRColumns";
import { PrecisionNCRHeader } from "./PrecisionNCR/PrecisionNCRHeader";
import { PrecisionNCRKpi } from "./PrecisionNCR/PrecisionNCRKpi";
import { PrecisionNCRSidebar } from "./PrecisionNCR/PrecisionNCRSidebar";
import { PrecisionNCRToolbar } from "./PrecisionNCR/PrecisionNCRToolbar";
import { PrecisionNCRTable } from "./PrecisionNCR/PrecisionNCRTable";
import { PrecisionNCRRightPanel } from "./PrecisionNCR/PrecisionNCRRightPanel";

const NCR_MANAGER: React.FC = () => {
  const ncrData = useNCRData();

  const { ncrColumns, holdingColumns } = usePrecisionNCRColumns({
    onUploadDefectImage: ncrData.handleDefectImageUpload,
    onUploadCountermeasure: ncrData.handleCountermeasureUpload,
  });

  return (
    <div className={`precision-ncr ${ncrData.isFullscreen ? "is-fullscreen" : ""}`}>
      {/* 1. Header Bar */}
      <PrecisionNCRHeader
        userData={ncrData.userData}
        isFullscreen={ncrData.isFullscreen}
        toggleFullscreen={ncrData.toggleFullscreen}
        onRefresh={ncrData.handletraNCRData}
      />

      {/* 2. Micro-cards KPI Strip */}
      <PrecisionNCRKpi kpiStats={ncrData.kpiStats} />

      {/* 3. Main Workspace: 3-Panel Split */}
      <main className="precision-ncr-workspace">
        {/* Left Sidebar (260px) */}
        <PrecisionNCRSidebar ncrData={ncrData} />

        {/* Center Main Panel */}
        <div className="precision-ncr-center">
          <PrecisionNCRToolbar
            onStartNewRegister={ncrData.handleStartNewRegister}
            onSearch={ncrData.handletraNCRData}
            onSetCompleted={() => ncrData.handleSetProcessStatus("Y")}
            onSetPending={() => ncrData.handleSetProcessStatus("P")}
            onExportExcel={ncrData.handleExportExcel}
            quickFilterText={ncrData.quickFilterText}
            setQuickFilterText={ncrData.setQuickFilterText}
            rowCount={ncrData.ncr_data_table.length}
          />

          <PrecisionNCRTable
            data={ncrData.ncr_data_table}
            columns={ncrColumns}
            quickFilterText={ncrData.quickFilterText}
            pendingOnly={ncrData.pendingOnly}
            onRowClick={(row) => {
              ncrData.setSelectedNCR(row);
              ncrData.handletraHoldingData(row);
            }}
            onSelectionChange={(selected) => {
              ncrData.selectedRowsData.current = selected;
            }}
          />
        </div>

        {/* Right Detail Panel (320px) */}
        <PrecisionNCRRightPanel
          selectedNCR={ncrData.selectedNCR}
          holdingData={ncrData.holdingdatatable}
          holdingColumns={holdingColumns}
          onUploadDefectImage={ncrData.handleDefectImageUpload}
          onExportHoldingExcel={ncrData.handleExportHoldingExcel}
        />
      </main>
    </div>
  );
};

export default NCR_MANAGER;
