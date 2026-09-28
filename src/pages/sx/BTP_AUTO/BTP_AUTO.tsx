import React, { useState, useCallback, useRef } from "react";
import "./BTP_AUTO.scss";
import "./PrecisionBtpAuto/PrecisionBtpAuto.scss";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import { useBtpAutoData } from "./PrecisionBtpAuto/useBtpAutoData";
import PrecisionBtpAutoHeader from "./PrecisionBtpAuto/PrecisionBtpAutoHeader";
import PrecisionBtpAutoKpi from "./PrecisionBtpAuto/PrecisionBtpAutoKpi";
import PrecisionBtpAutoGrid from "./PrecisionBtpAuto/PrecisionBtpAutoGrid";
import PrecisionBtpAutoMobileHeader from "./PrecisionBtpAuto/PrecisionBtpAutoMobileHeader";
import PrecisionBtpAutoMobileKpi from "./PrecisionBtpAuto/PrecisionBtpAutoMobileKpi";
import PrecisionBtpAutoMobileToolbar from "./PrecisionBtpAuto/PrecisionBtpAutoMobileToolbar";
import PrecisionBtpAutoMobileFilterDrawer from "./PrecisionBtpAuto/PrecisionBtpAutoMobileFilterDrawer";
import QLGN from "../../rnd/quanlygiaonhandaofilm/QLGN";

/**
 * BTP_AUTO — Tra Cứu Bán Thành Phẩm (BTP) Tự Động
 * Controller chính tinh gọn kết nối subcomponents chuẩn Google Stitch Enterprise.
 * Áp dụng Viewport Conditional Rendering: Giữ nguyên 100% Desktop, tối ưu toàn diện Mobile.
 */
const BTP_AUTO: React.FC = () => {
  const isMobile = useIsMobile();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [showKpiSummary, setShowKpiSummary] = useState(false);

  // Giữ GridApi của AG Grid để EX1 xuất đúng các dòng đang hiển thị (search/filter/sort).
  const gridApiRef = useRef<any>(null);
  const handleGridApiReady = useCallback((api: any) => {
    gridApiRef.current = api;
  }, []);

  const {
    btpData,
    filteredData,
    viewMode,
    searchKeyword,
    setSearchKeyword,
    isLoading,
    lastUpdated,
    showGiaoNhan,
    setShowGiaoNhan,
    kpiData,
    filterXuong,
    setFilterXuong,
    filterFactory,
    setFilterFactory,
    onlyPositive,
    setOnlyPositive,
    activeFilterCount,
    factoryList,
    resetFilters,
    handleSwitchMode,
    handleLoadDetail,
    handleLoadSummary,
    handleExportExcel,
  } = useBtpAutoData();

  // Làm mới dữ liệu hiện tại
  const handleRefresh = useCallback(() => {
    if (viewMode === "detail") {
      handleLoadDetail();
    } else {
      handleLoadSummary();
    }
  }, [viewMode, handleLoadDetail, handleLoadSummary]);

  // Áp dụng bộ lọc mobile
  const handleApplyMobileFilter = useCallback(() => {
    setIsMobileFilterOpen(false);
  }, []);

  return (
    <div className={`precision-btpauto ${isMobile ? "is-mobile" : ""}`}>
      {/* ===== 1. HEADER (DESKTOP vs MOBILE) ===== */}
      {!isMobile ? (
        <PrecisionBtpAutoHeader
          dataLength={filteredData.length}
          lastUpdated={lastUpdated}
          viewMode={viewMode}
          isLoading={isLoading}
        />
      ) : (
        <PrecisionBtpAutoMobileHeader
          dataLength={filteredData.length}
          totalDataLength={btpData.length}
          lastUpdated={lastUpdated}
          viewMode={viewMode}
          isLoading={isLoading}
          showKpi={showKpiSummary}
          onToggleKpi={() => setShowKpiSummary((prev) => !prev)}
          onRefresh={handleRefresh}
          onOpenGiaoNhan={() => setShowGiaoNhan(true)}
        />
      )}

      {/* ===== 2. TOOLBAR TRÊN MOBILE ===== */}
      {isMobile && (
        <PrecisionBtpAutoMobileToolbar
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          viewMode={viewMode}
          onSwitchMode={handleSwitchMode}
          onOpenFilter={() => setIsMobileFilterOpen(true)}
          activeFilterCount={activeFilterCount}
          filterXuong={filterXuong}
          onSelectXuong={setFilterXuong}
          onlyPositive={onlyPositive}
          onToggleOnlyPositive={() => setOnlyPositive((prev) => !prev)}
          onExportEX1={() => handleExportExcel("EX1", gridApiRef.current)}
          onExportEX2={() => handleExportExcel("EX2", gridApiRef.current)}
          onOpenGiaoNhan={() => setShowGiaoNhan(true)}
          filteredCount={filteredData.length}
          totalCount={btpData.length}
          isLoading={isLoading}
        />
      )}

      {/* ===== 3. KPI DASHBOARD (DESKTOP vs MOBILE) ===== */}
      {!isMobile && (
        <PrecisionBtpAutoKpi
          kpiData={kpiData}
          viewMode={viewMode}
          dataLength={btpData.length}
        />
      )}
      {isMobile && showKpiSummary && (
        <PrecisionBtpAutoMobileKpi
          kpiData={kpiData}
          viewMode={viewMode}
          dataLength={btpData.length}
          onClose={() => setShowKpiSummary(false)}
        />
      )}

      {/* ===== 4. AG-GRID BẢNG DỮ LIỆU ===== */}
      <PrecisionBtpAutoGrid
        viewMode={viewMode}
        filteredData={filteredData}
        totalDataLength={btpData.length}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        isLoading={isLoading}
        onSwitchMode={handleSwitchMode}
        onExportExcel={handleExportExcel}
        isMobile={isMobile}
        onGridApiReady={handleGridApiReady}
      />

      {/* ===== 5. MOBILE FILTER DRAWER (BOTTOM SHEET ZERO-BLUR) ===== */}
      {isMobile && (
        <PrecisionBtpAutoMobileFilterDrawer
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          viewMode={viewMode}
          onSwitchMode={handleSwitchMode}
          filterXuong={filterXuong}
          setFilterXuong={setFilterXuong}
          filterFactory={filterFactory}
          setFilterFactory={setFilterFactory}
          factoryList={factoryList}
          onlyPositive={onlyPositive}
          setOnlyPositive={setOnlyPositive}
          onApply={handleApplyMobileFilter}
          onReset={resetFilters}
        />
      )}

      {/* ===== 6. QLGN OVERLAY (QUẢN LÝ GIAO NHẬN) ===== */}
      {showGiaoNhan && (
        <div className="precision-btpauto__qlgnOverlay">
          <button
            type="button"
            className="precision-btpauto__qlgnClose"
            onClick={() => setShowGiaoNhan(false)}
          >
            ✕ Đóng
          </button>
          <div className="precision-btpauto__qlgnContent">
            <QLGN />
          </div>
        </div>
      )}
    </div>
  );
};

export default BTP_AUTO;
