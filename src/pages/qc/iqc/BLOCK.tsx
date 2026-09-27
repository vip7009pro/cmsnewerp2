import React, { useState, useMemo, useCallback } from "react";
import "./PrecisionBLOCK/PrecisionBLOCK.scss";
import { useBlockData } from "./PrecisionBLOCK/useBlockData";
import { PrecisionBLOCKHeader } from "./PrecisionBLOCK/PrecisionBLOCKHeader";
import { PrecisionBLOCKKpi } from "./PrecisionBLOCK/PrecisionBLOCKKpi";
import { PrecisionBLOCKSidebar } from "./PrecisionBLOCK/PrecisionBLOCKSidebar";
import { PrecisionBLOCKToolbar } from "./PrecisionBLOCK/PrecisionBLOCKToolbar";
import { PrecisionBLOCKTable } from "./PrecisionBLOCK/PrecisionBLOCKTable";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import { PrecisionBLOCKMobileToolbar } from "./PrecisionBLOCK/PrecisionBLOCKMobileToolbar";
import { PrecisionBLOCKMobileFilterDrawer } from "./PrecisionBLOCK/PrecisionBLOCKMobileFilterDrawer";

const BLOCK: React.FC = () => {
  const isMobile = useIsMobile();
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

  // Mobile-specific UI states
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Đếm số lượng điều kiện lọc đang active (cho badge mobile)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (testtype !== "ALL") count++;
    if (vendorLot.trim()) count++;
    if (m_lot_no.trim()) count++;
    if (defect_phenomenon.trim()) count++;
    if (remark.trim()) count++;
    if (ncrId > 0) count++;
    if (!onlyPending) count++;
    return count;
  }, [testtype, vendorLot, m_lot_no, defect_phenomenon, remark, ncrId, onlyPending]);

  // Reset bộ lọc mobile về mặc định
  const handleResetMobileFilter = useCallback(() => {
    handleResetFilters();
  }, [handleResetFilters]);

  // =========================================================================
  // 1. MOBILE VIEW (Viewport <= 768px): Tối đa không gian dữ liệu
  // =========================================================================
  if (isMobile) {
    return (
      <div className="precision-blocking is-mobile">
        {/* Mobile Toolbar 2 Hàng Công Thái Học */}
        <PrecisionBLOCKMobileToolbar
          quickFilterText={quickFilterText}
          setQuickFilterText={setQuickFilterText}
          onSearch={handletraBlockingData}
          onOpenFilterDrawer={() => setShowFilterDrawer(true)}
          activeFilterCount={activeFilterCount}
          onlyPending={onlyPending}
          onToggleOnlyPending={() => setOnlyPending(!onlyPending)}
          onSetPass={setQCPASS}
          onSetClose={setClose}
          onUpdateNCR={updateNCRIDBlocking}
          onExportExcel={handleExportExcel}
          selectedCount={selectedCount}
          totalCount={blockingdatatable.length}
        />

        {/* Bảng Dữ Liệu Chiếm Trọn 100% Chiều Cao Còn Lại */}
        <div className="precision-block-grid-container">
          <PrecisionBLOCKTable
            data={blockingdatatable}
            quickFilterText={quickFilterText}
            onSelectionChange={onSelectionChange}
          />
        </div>

        {/* Bottom Sheet Filter Drawer (Zero-Blur GPU-Friendly) */}
        {showFilterDrawer && (
          <PrecisionBLOCKMobileFilterDrawer
            isOpen={showFilterDrawer}
            onClose={() => setShowFilterDrawer(false)}
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
            onApply={handletraBlockingData}
            onReset={handleResetMobileFilter}
          />
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. DESKTOP VIEW (> 768px): BẢO TOÀN NGUYÊN VẸN 100% GIAO DIỆN
  // =========================================================================
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
