import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./PrecisionHOLDING/PrecisionHOLDING.scss";
import { useHoldingData } from "./PrecisionHOLDING/useHoldingData";
import { PrecisionHoldingHeader } from "./PrecisionHOLDING/PrecisionHoldingHeader";
import { PrecisionHoldingKpi } from "./PrecisionHOLDING/PrecisionHoldingKpi";
import { PrecisionHoldingSidebar } from "./PrecisionHOLDING/PrecisionHoldingSidebar";
import { PrecisionHoldingToolbar } from "./PrecisionHOLDING/PrecisionHoldingToolbar";
import { PrecisionHoldingTable } from "./PrecisionHOLDING/PrecisionHoldingTable";
import { PrecisionHoldingMobileToolbar } from "./PrecisionHOLDING/PrecisionHoldingMobileToolbar";
import { PrecisionHoldingMobileFilterDrawer } from "./PrecisionHOLDING/PrecisionHoldingMobileFilterDrawer";

const HOLDING: React.FC = () => {
  // Viewport Conditional Rendering
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

  // Mobile Filter Drawer state
  const [showMobileFilter, setShowMobileFilter] = useState(false);

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
    selectedCount,
    onSelectionChange,
    handletraHoldingData,
    setQCPASS,
    updateNCRIDHolding,
    updateReason,
    handleExportExcel,
    handleResetFilters,
    kpiStats,
  } = useHoldingData();

  // Đếm số filter đang active (cho badge trên nút Lọc mobile)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (!alltime) count++; // đang lọc theo ngày
    if (m_name.trim()) count++;
    if (m_code.trim()) count++;
    if (mLotNo.trim()) count++;
    if (mStatus !== "ALL") count++;
    if (ncrId > 0) count++;
    if (id.trim()) count++;
    return count;
  }, [alltime, m_name, m_code, mLotNo, mStatus, ncrId, id]);

  // Handler mở filter drawer (mobile)
  const handleOpenFilterDrawer = useCallback(() => {
    setShowMobileFilter(true);
  }, []);

  // Handler áp dụng filter (từ drawer)
  const handleApplyFilter = useCallback(() => {
    handletraHoldingData();
  }, [handletraHoldingData]);

  // Handler reset filter (từ drawer)
  const handleResetFilterDrawer = useCallback(() => {
    handleResetFilters();
  }, [handleResetFilters]);

  return (
    <div className={`precision-holding ${isFullscreen ? "is-fullscreen" : ""} ${isMobile ? "is-mobile" : ""}`}>
      {/* 1. Header Sub-module — CHỈ DESKTOP */}
      {!isMobile && (
        <PrecisionHoldingHeader
          userData={userData}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onRefresh={handletraHoldingData}
        />
      )}

      {/* 2. Realtime KPI Micro-Cards — CHỈ DESKTOP */}
      {!isMobile && <PrecisionHoldingKpi kpiStats={kpiStats} />}

      {/* 3. Main Workspace */}
      {isMobile ? (
        /* ========== MOBILE LAYOUT ========== */
        <>
          {/* Mobile Toolbar 2 hàng công thái học */}
          <PrecisionHoldingMobileToolbar
            quickFilterText={quickFilterText}
            setQuickFilterText={setQuickFilterText}
            onSearch={handletraHoldingData}
            onOpenFilterDrawer={handleOpenFilterDrawer}
            activeFilterCount={activeFilterCount}
            onSetPass={setQCPASS}
            onUpdateNCR={updateNCRIDHolding}
            onUpdateReason={updateReason}
            onExportExcel={handleExportExcel}
            selectedCount={selectedCount}
            totalCount={holdingdatatable.length}
          />

          {/* Bảng dữ liệu chiếm trọn không gian còn lại */}
          <div className="precision-holding-mobile-grid">
            <PrecisionHoldingTable
              data={holdingdatatable}
              quickFilterText={quickFilterText}
              onSelectionChange={onSelectionChange}
            />
          </div>

          {/* Floating Filter Drawer (Bottom Sheet) — CHỈ HIỆN KHI MỞ */}
          {showMobileFilter && (
            <PrecisionHoldingMobileFilterDrawer
              isOpen={showMobileFilter}
              onClose={() => setShowMobileFilter(false)}
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
              onApply={handleApplyFilter}
              onReset={handleResetFilterDrawer}
            />
          )}
        </>
      ) : (
        /* ========== DESKTOP LAYOUT — 100% GIỮ NGUYÊN ========== */
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
      )}
    </div>
  );
};

export default HOLDING;
