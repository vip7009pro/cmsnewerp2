import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./PrecisionNCR/PrecisionNCR.scss";
import { useNCRData } from "./PrecisionNCR/useNCRData";
import { usePrecisionNCRColumns } from "./PrecisionNCR/PrecisionNCRColumns";
import { PrecisionNCRHeader } from "./PrecisionNCR/PrecisionNCRHeader";
import { PrecisionNCRKpi } from "./PrecisionNCR/PrecisionNCRKpi";
import { PrecisionNCRSidebar } from "./PrecisionNCR/PrecisionNCRSidebar";
import { PrecisionNCRToolbar } from "./PrecisionNCR/PrecisionNCRToolbar";
import { PrecisionNCRTable } from "./PrecisionNCR/PrecisionNCRTable";
import { PrecisionNCRRightPanel } from "./PrecisionNCR/PrecisionNCRRightPanel";
// Mobile Components
import { PrecisionNCRMobileHeader } from "./PrecisionNCR/PrecisionNCRMobileHeader";
import { PrecisionNCRMobileKpi } from "./PrecisionNCR/PrecisionNCRMobileKpi";
import { PrecisionNCRMobileToolbar } from "./PrecisionNCR/PrecisionNCRMobileToolbar";
import { PrecisionNCRMobileFilterDrawer } from "./PrecisionNCR/PrecisionNCRMobileFilterDrawer";
import { PrecisionNCRMobileRegisterSheet } from "./PrecisionNCR/PrecisionNCRMobileRegisterSheet";

const NCR_MANAGER: React.FC = () => {
  // Viewport Detection
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mediaQuery.matches);
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  // Mobile UI states
  const [showMobileKpi, setShowMobileKpi] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showMobileRegister, setShowMobileRegister] = useState(false);

  const ncrData = useNCRData();

  const { ncrColumns, holdingColumns } = usePrecisionNCRColumns({
    onUploadDefectImage: ncrData.handleDefectImageUpload,
    onUploadCountermeasure: ncrData.handleCountermeasureUpload,
  });

  // Active filter count for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (ncrData.m_name.trim()) count++;
    if (ncrData.m_code.trim()) count++;
    if (ncrData.vendor.trim()) count++;
    if (ncrData.cmsLOT.trim()) count++;
    if (ncrData.vendorLot.trim()) count++;
    if (ncrData.pendingOnly) count++;
    return count;
  }, [ncrData.m_name, ncrData.m_code, ncrData.vendor, ncrData.cmsLOT, ncrData.vendorLot, ncrData.pendingOnly]);

  // Mobile: handle start new register
  const handleMobileNewRegister = useCallback(() => {
    ncrData.handleStartNewRegister();
    setShowMobileRegister(true);
  }, [ncrData]);

  // Mobile: handle apply filter (trigger search + close drawer)
  const handleMobileApplyFilter = useCallback(() => {
    ncrData.handletraNCRData();
  }, [ncrData]);

  return (
    <div className={`precision-ncr ${ncrData.isFullscreen ? "is-fullscreen" : ""} ${isMobile ? "is-mobile" : ""}`}>

      {/* ===== DESKTOP LAYOUT (unchanged) ===== */}
      {!isMobile && (
        <>
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
        </>
      )}

      {/* ===== MOBILE LAYOUT ===== */}
      {isMobile && (
        <>
          {/* 1. Mobile Header */}
          <PrecisionNCRMobileHeader
            userData={ncrData.userData}
            isFullscreen={ncrData.isFullscreen}
            toggleFullscreen={ncrData.toggleFullscreen}
            onRefresh={ncrData.handletraNCRData}
            onStartNewRegister={handleMobileNewRegister}
            showKpi={showMobileKpi}
            toggleKpi={() => setShowMobileKpi((v) => !v)}
            activeFilterCount={activeFilterCount}
            onOpenFilter={() => setShowMobileFilter(true)}
          />

          {/* 2. Mobile KPI (collapsible) */}
          {showMobileKpi && (
            <PrecisionNCRMobileKpi kpiStats={ncrData.kpiStats} />
          )}

          {/* 3. Scrollable Content Area */}
          <div className="precision-ncr-mobile-scrollable">
            {/* 3a. Mobile Toolbar */}
            <PrecisionNCRMobileToolbar
              quickFilterText={ncrData.quickFilterText}
              setQuickFilterText={ncrData.setQuickFilterText}
              onSearch={ncrData.handletraNCRData}
              onSetCompleted={() => ncrData.handleSetProcessStatus("Y")}
              onSetPending={() => ncrData.handleSetProcessStatus("P")}
              onExportExcel={ncrData.handleExportExcel}
              rowCount={ncrData.ncr_data_table.length}
              pendingOnly={ncrData.pendingOnly}
              setPendingOnly={ncrData.setPendingOnly}
            />

            {/* 3b. Data Table */}
            <div className="precision-ncr-mobile-grid">
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

            {/* 3c. Detail Panel (appears below grid when a row is selected) */}
            {ncrData.selectedNCR && (
              <div className="precision-ncr-mobile-detail">
                <PrecisionNCRRightPanel
                  selectedNCR={ncrData.selectedNCR}
                  holdingData={ncrData.holdingdatatable}
                  holdingColumns={holdingColumns}
                  onUploadDefectImage={ncrData.handleDefectImageUpload}
                  onExportHoldingExcel={ncrData.handleExportHoldingExcel}
                />
              </div>
            )}
          </div>

          {/* 4. Filter Drawer */}
          {showMobileFilter && (
            <PrecisionNCRMobileFilterDrawer
              isOpen={showMobileFilter}
              onClose={() => setShowMobileFilter(false)}
              fromdate={ncrData.fromdate}
              setFromDate={ncrData.setFromDate}
              todate={ncrData.todate}
              setToDate={ncrData.setToDate}
              vendor={ncrData.vendor}
              setVendor={ncrData.setVendor}
              m_name={ncrData.m_name}
              setM_Name={ncrData.setM_Name}
              m_code={ncrData.m_code}
              setM_Code={ncrData.setM_Code}
              cmsLOT={ncrData.cmsLOT}
              setCMSLOT={ncrData.setCMSLOT}
              vendorLot={ncrData.vendorLot}
              setVendorLot={ncrData.setVendorLot}
              pendingOnly={ncrData.pendingOnly}
              setPendingOnly={ncrData.setPendingOnly}
              onApply={handleMobileApplyFilter}
            />
          )}

          {/* 5. New NCR Registration Sheet */}
          {showMobileRegister && (
            <PrecisionNCRMobileRegisterSheet
              isOpen={showMobileRegister}
              onClose={() => setShowMobileRegister(false)}
              ncrData={ncrData}
            />
          )}
        </>
      )}
    </div>
  );
};

export default NCR_MANAGER;
