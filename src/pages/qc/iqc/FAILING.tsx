import React, { useState, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import "./PrecisionFAILING/PrecisionFAILING.scss";
import { useFailingData } from "./PrecisionFAILING/useFailingData";
import { PrecisionFailingHeader } from "./PrecisionFAILING/PrecisionFailingHeader";
import { PrecisionFailingKpi } from "./PrecisionFAILING/PrecisionFailingKpi";
import { PrecisionFailingSidebar } from "./PrecisionFAILING/PrecisionFailingSidebar";
import { PrecisionFailingToolbar } from "./PrecisionFAILING/PrecisionFailingToolbar";
import { PrecisionFailingTable } from "./PrecisionFAILING/PrecisionFailingTable";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import { PrecisionFailingMobileHeader } from "./PrecisionFAILING/PrecisionFailingMobileHeader";
import { PrecisionFailingMobileKpi } from "./PrecisionFAILING/PrecisionFailingMobileKpi";
import { PrecisionFailingMobileToolbar } from "./PrecisionFAILING/PrecisionFailingMobileToolbar";
import { PrecisionFailingMobileFilterDrawer } from "./PrecisionFAILING/PrecisionFailingMobileFilterDrawer";
import { PrecisionFailingMobileActionDrawer } from "./PrecisionFAILING/PrecisionFailingMobileActionDrawer";

const FAILING: React.FC = () => {
  const isMobile = useIsMobile();
  const failingData = useFailingData();
  const {
    userData,
    isFullscreen,
    toggleFullscreen,
    inspectiondatatable,
    selectedCount,
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
    cmsvcheck,
    setCMSVCheck,
    onlyPending,
    setOnlyPending,
    customerList,
    cust_cd,
    setCust_Cd,
    ncrId,
    setNCRID,
  } = failingData;

  // Mobile specific UI states
  const [showKpi, setShowKpi] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showActionDrawer, setShowActionDrawer] = useState(false);
  const [mobileActionTab, setMobileActionTab] = useState<"IN" | "OUT" | "ACTIONS">("ACTIONS");

  const handleOpenActionDrawer = useCallback((tab: "IN" | "OUT" | "ACTIONS" = "ACTIONS") => {
    setMobileActionTab(tab);
    setShowActionDrawer(true);
  }, []);

  const handleConfirm = useCallback(() => {
    if (request_empl2 === "") {
      Swal.fire("Thông báo", "Hãy nhập mã người xác nhận ở phần Thao Tác / Sidebar", "error");
    } else {
      setIQCConfirm(request_empl2);
    }
  }, [request_empl2, setIQCConfirm]);

  // Đếm số lượng điều kiện lọc đang active
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (!cmsvcheck) count++;
    if (!onlyPending) count++;
    if (ncrId > 0) count++;
    return count;
  }, [cmsvcheck, onlyPending, ncrId]);

  // Lọc số dòng hiển thị theo ô quick filter
  const filteredCount = useMemo(() => {
    if (!quickFilterText.trim()) return inspectiondatatable.length;
    const q = quickFilterText.toLowerCase().trim();
    return inspectiondatatable.filter(
      (r) =>
        r.M_LOT_NO?.toLowerCase().includes(q) ||
        r.VENDOR_LOT?.toLowerCase().includes(q) ||
        r.PROCESS_LOT_NO?.toLowerCase().includes(q) ||
        r.M_NAME?.toLowerCase().includes(q) ||
        r.M_CODE?.toLowerCase().includes(q) ||
        r.PLAN_ID_SUDUNG?.toLowerCase().includes(q) ||
        r.DEFECT_PHENOMENON?.toLowerCase().includes(q) ||
        String(r.FAIL_ID ?? "").includes(q) ||
        String(r.NCR_ID ?? "").includes(q)
    ).length;
  }, [inspectiondatatable, quickFilterText]);

  // Reset bộ lọc về mặc định
  const handleResetFilter = useCallback(() => {
    setCMSVCheck(true);
    setCust_Cd("6969");
    setOnlyPending(true);
    setNCRID(0);
  }, [setCMSVCheck, setCust_Cd, setOnlyPending, setNCRID]);

  // =========================================================================
  // 1. MOBILE VIEW (Viewport <= 768px): Tối đa không gian dữ liệu + Công thái học
  // =========================================================================
  if (isMobile) {
    return (
      <div className="precision-failing is-mobile">
        {/* Mobile Header Tinh Gọn */}
        <PrecisionFailingMobileHeader
          userData={userData}
          filteredCount={filteredCount}
          totalCount={inspectiondatatable.length}
          kpiStats={kpiStats}
          showKpi={showKpi}
          onToggleKpi={() => setShowKpi(!showKpi)}
          onOpenActionDrawer={() => handleOpenActionDrawer("ACTIONS")}
          onRefresh={handletraFailingData}
        />

        {/* Micro-KPI Bar Cuộn Ngang (Có nút đóng giải phóng không gian) */}
        {showKpi && (
          <PrecisionFailingMobileKpi
            kpiStats={kpiStats}
            onClose={() => setShowKpi(false)}
          />
        )}

        {/* Mobile Toolbar 2 Hàng Công Thái Học */}
        <PrecisionFailingMobileToolbar
          quickFilterText={quickFilterText}
          setQuickFilterText={setQuickFilterText}
          onSearch={handletraFailingData}
          onOpenFilterDrawer={() => setShowFilterDrawer(true)}
          activeFilterCount={activeFilterCount}
          onlyPending={onlyPending}
          onToggleOnlyPending={() => setOnlyPending(!onlyPending)}
          onOpenActionDrawer={handleOpenActionDrawer}
          onNewFailing={handleNewFailing}
          onSetPass={setQCPASS}
          onSetClose={setClose}
          onConfirm={handleConfirm}
          onUpdateNCR={updateNCRIDFailing}
          onExportExcel={handleExportExcel}
          selectedCount={selectedCount}
          filteredCount={filteredCount}
          totalCount={inspectiondatatable.length}
        />

        {/* Bảng Dữ Liệu Chiếm Trọn 100% Chiều Cao Còn Lại */}
        <div className="precision-failing-table-container">
          <PrecisionFailingTable
            data={inspectiondatatable}
            quickFilterText={quickFilterText}
            onSelectionChange={onSelectionChange}
          />
        </div>

        {/* Bottom Sheet Filter Drawer (Zero-Blur GPU-Friendly) */}
        {showFilterDrawer && (
          <PrecisionFailingMobileFilterDrawer
            isOpen={showFilterDrawer}
            onClose={() => setShowFilterDrawer(false)}
            customerList={customerList}
            cust_cd={cust_cd}
            setCust_Cd={setCust_Cd}
            cmsvcheck={cmsvcheck}
            setCMSVCheck={setCMSVCheck}
            onlyPending={onlyPending}
            setOnlyPending={setOnlyPending}
            ncrId={ncrId}
            setNCRID={setNCRID}
            onApply={handletraFailingData}
            onReset={handleResetFilter}
          />
        )}

        {/* Bottom Sheet Action Drawer (Nhập IN, Xuất OUT, Phê Duyệt Nhanh) */}
        {showActionDrawer && (
          <PrecisionFailingMobileActionDrawer
            isOpen={showActionDrawer}
            onClose={() => setShowActionDrawer(false)}
            actionTab={mobileActionTab}
            setActionTab={setMobileActionTab}
            {...failingData}
            onAddRow={handleAddFailingRow}
            onSaveData={saveFailingData}
            onOutputFail={updateQCFailTable}
            onLotKeyDown={failingData.handleLotKeyDown}
            onNewFailing={handleNewFailing}
            onSetPass={setQCPASS}
            onSetClose={setClose}
            onConfirm={handleConfirm}
            onUpdateNCR={updateNCRIDFailing}
            onExportExcel={handleExportExcel}
            selectedCount={selectedCount}
          />
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. DESKTOP VIEW (> 768px): BẢO TOÀN NGUYÊN VẸN 100% GIAO DIỆN & TRẢI NGHIỆM
  // =========================================================================
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
          onLotKeyDown={failingData.handleLotKeyDown}
        />

        <div className="precision-failing-main-content">
          <PrecisionFailingToolbar
            onNewFailing={handleNewFailing}
            onSearch={handletraFailingData}
            onSetPass={setQCPASS}
            onSetClose={setClose}
            onConfirm={handleConfirm}
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
