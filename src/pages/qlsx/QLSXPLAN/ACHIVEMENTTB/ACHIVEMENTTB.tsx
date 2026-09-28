import React, { useState, useMemo, useCallback, useRef } from "react";
import moment from "moment";
import useIsMobile from "../../../../components/Navbar/AccountInfo/useIsMobile";
import { useAchivementTbData } from "./PrecisionAchivementTb/useAchivementTbData";
import { PrecisionAchivementTbHeader } from "./PrecisionAchivementTb/PrecisionAchivementTbHeader";
import { PrecisionAchivementTbToolbar } from "./PrecisionAchivementTb/PrecisionAchivementTbToolbar";
import { PrecisionAchivementTbKpi } from "./PrecisionAchivementTb/PrecisionAchivementTbKpi";
import { PrecisionAchivementTbGrid } from "./PrecisionAchivementTb/PrecisionAchivementTbGrid";
import { PrecisionAchivementTbMobileHeader } from "./PrecisionAchivementTb/PrecisionAchivementTbMobileHeader";
import { PrecisionAchivementTbMobileToolbar } from "./PrecisionAchivementTb/PrecisionAchivementTbMobileToolbar";
import { PrecisionAchivementTbMobileKpi } from "./PrecisionAchivementTb/PrecisionAchivementTbMobileKpi";
import { PrecisionAchivementTbMobileFilterDrawer } from "./PrecisionAchivementTb/PrecisionAchivementTbMobileFilterDrawer";
import { getDisplayedGridRows } from "../../../../components/DataTable/gridExportUtils";
import "./PrecisionAchivementTb/PrecisionAchivementTb.scss";

const ACHIVEMENTTB: React.FC = () => {
  const isMobile = useIsMobile();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [showKpiSummary, setShowKpiSummary] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Giữ GridApi để EX1 xuất đúng các dòng đang hiển thị trên lưới.
  const gridApiRef = useRef<any>(null);
  const handleGridApiReady = useCallback((api: any) => {
    gridApiRef.current = api;
  }, []);

  const {
    machine_list,
    fromdate,
    setFromDate,
    factory,
    setFactory,
    machine,
    setMachine,
    plandatatable,
    summarydata,
    isLoading,
    loadTiLeDat,
    exportExcel,
  } = useAchivementTbData();

  // Đếm số điều kiện lọc đang active so với mặc định
  const activeFilterCount = useMemo(() => {
    let count = 0;
    const today = moment().format("YYYY-MM-DD");
    if (fromdate.slice(0, 10) !== today) count++;
    if (factory !== "NM1") count++;
    if (machine !== "ALL") count++;
    return count;
  }, [fromdate, factory, machine]);

  // Lọc nhanh dữ liệu cho thao tác xuất Excel và đếm số lượng trên mobile
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return plandatatable;
    const term = searchTerm.toLowerCase();
    return plandatatable.filter(
      (row) =>
        row.EQ_NAME === "TOTAL" ||
        row.EQ_NAME?.toLowerCase().includes(term) ||
        row.PROD_REQUEST_NO?.toLowerCase().includes(term) ||
        row.G_NAME_KD?.toLowerCase().includes(term) ||
        row.PLAN_TOTAL?.toString().includes(term) ||
        row.RESULT_TOTAL?.toString().includes(term)
    );
  }, [plandatatable, searchTerm]);

  // Xử lý chọn ngày nhanh trên mobile
  const handleQuickDate = useCallback(
    (d: string) => {
      setFromDate(d);
      loadTiLeDat(d);
    },
    [setFromDate, loadTiLeDat]
  );

  // Áp dụng bộ lọc từ drawer mobile
  const handleApplyFilter = useCallback(() => {
    setIsMobileFilterOpen(false);
    loadTiLeDat();
  }, [loadTiLeDat]);

  // Đặt lại bộ lọc mobile về mặc định
  const handleResetFilter = useCallback(() => {
    setFromDate(moment().format("YYYY-MM-DD"));
    setFactory("NM1");
    setMachine("ALL");
  }, [setFromDate, setFactory, setMachine]);

  // Số lượng lệnh hợp lệ (không tính dòng TOTAL)
  const totalOrders = useMemo(
    () => plandatatable.filter((r) => r.EQ_NAME !== "TOTAL").length,
    [plandatatable]
  );

  return (
    <div className={`precision-achivementtb ${isMobile ? "is-mobile" : ""}`}>
      {/* 1. HEADER SECTION (DESKTOP vs MOBILE) */}
      {!isMobile ? (
        <PrecisionAchivementTbHeader
          factory={factory}
          machine={machine}
          fromdate={fromdate}
        />
      ) : (
        <PrecisionAchivementTbMobileHeader
          factory={factory}
          machine={machine}
          fromdate={fromdate}
          showKpi={showKpiSummary}
          onToggleKpi={() => setShowKpiSummary((prev) => !prev)}
          onRefresh={() => loadTiLeDat()}
          isLoading={isLoading}
          totalOrders={totalOrders}
        />
      )}

      {/* 2. TOOLBAR SECTION (DESKTOP vs MOBILE) */}
      {!isMobile ? (
        <PrecisionAchivementTbToolbar
          fromdate={fromdate}
          setFromDate={setFromDate}
          factory={factory}
          setFactory={setFactory}
          machine={machine}
          setMachine={setMachine}
          machine_list={machine_list}
          onSearch={loadTiLeDat}
          isLoading={isLoading}
        />
      ) : (
        <PrecisionAchivementTbMobileToolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          fromdate={fromdate}
          onQuickDate={handleQuickDate}
          onOpenFilter={() => setIsMobileFilterOpen(true)}
          activeFilterCount={activeFilterCount}
          onExportEX1={() =>
            exportExcel(getDisplayedGridRows(gridApiRef.current, filteredData), "TI_LE_DAT_LOC")
          }
          onExportEX2={() => exportExcel(plandatatable, "TI_LE_DAT_ALL")}
          onSearch={() => loadTiLeDat()}
          isLoading={isLoading}
          totalRows={totalOrders}
        />
      )}

      {/* 3. KPI SECTION (DESKTOP: Grid 6 Cards | MOBILE: Micro Bar Cuộn Ngang) */}
      {!isMobile && (
        <PrecisionAchivementTbKpi
          summaryData={summarydata}
          planDataTable={plandatatable}
        />
      )}
      {isMobile && showKpiSummary && (
        <PrecisionAchivementTbMobileKpi
          summaryData={summarydata}
          planDataTable={plandatatable}
          onClose={() => setShowKpiSummary(false)}
        />
      )}

      {/* 4. AG-GRID BẢNG DỮ LIỆU CHÍNH */}
      <PrecisionAchivementTbGrid
        data={plandatatable}
        isMobile={isMobile}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onExportEX1={(rows) => exportExcel(rows, "TI_LE_DAT_LOC")}
        onExportEX2={(rows) => exportExcel(rows, "TI_LE_DAT_ALL")}
        onGridApiReady={handleGridApiReady}
      />

      {/* 5. MOBILE ONLY: Zero-Blur Bottom Sheet Filter Drawer */}
      {isMobile && (
        <PrecisionAchivementTbMobileFilterDrawer
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          fromdate={fromdate}
          setFromDate={setFromDate}
          factory={factory}
          setFactory={setFactory}
          machine={machine}
          setMachine={setMachine}
          machine_list={machine_list}
          onApply={handleApplyFilter}
          onReset={handleResetFilter}
        />
      )}
    </div>
  );
};

export default ACHIVEMENTTB;
