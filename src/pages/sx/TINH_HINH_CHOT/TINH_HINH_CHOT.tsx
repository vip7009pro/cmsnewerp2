import React, { useMemo, useState, useCallback } from "react";
import "./PrecisionTinhHinhChot/PrecisionTinhHinhChot.scss";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import { useTinhHinhChotData } from "./PrecisionTinhHinhChot/useTinhHinhChotData";
import { getTinhHinhChotColumns } from "./PrecisionTinhHinhChot/PrecisionTinhHinhChotColumns";
import PrecisionTinhHinhChotHeader from "./PrecisionTinhHinhChot/PrecisionTinhHinhChotHeader";
import PrecisionTinhHinhChotKpi from "./PrecisionTinhHinhChot/PrecisionTinhHinhChotKpi";
import PrecisionTinhHinhChotCharts from "./PrecisionTinhHinhChot/PrecisionTinhHinhChotCharts";
import PrecisionTinhHinhChotGrid from "./PrecisionTinhHinhChot/PrecisionTinhHinhChotGrid";
import PrecisionTinhHinhChotMobileHeader from "./PrecisionTinhHinhChot/PrecisionTinhHinhChotMobileHeader";
import PrecisionTinhHinhChotMobileKpi from "./PrecisionTinhHinhChot/PrecisionTinhHinhChotMobileKpi";
import PrecisionTinhHinhChotMobileToolbar from "./PrecisionTinhHinhChot/PrecisionTinhHinhChotMobileToolbar";
import PrecisionTinhHinhChotMobileFilterDrawer from "./PrecisionTinhHinhChot/PrecisionTinhHinhChotMobileFilterDrawer";

const TINH_HINH_CHOT: React.FC = () => {
  const isMobile = useIsMobile();

  const {
    rawDataNM1,
    rawDataNM2,
    filteredDataNM1,
    filteredDataNM2,
    kpiStats,
    chartData,
    isLoading,
    lastUpdated,
    searchNM1,
    setSearchNM1,
    searchNM2,
    setSearchNM2,
    viewMode,
    setViewMode,
    showCharts,
    setShowCharts,
    chartFactoryFilter,
    setChartFactoryFilter,
    loadTinhHinhBaoCao,
    loadAll,
    handleExportExcel,
    statusChotFilter,
    setStatusChotFilter,
    statusHSFilter,
    setStatusHSFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    activeFilterCount,
    resetFilters,
  } = useTinhHinhChotData();

  // State điều khiển giao diện mobile
  const [showMobileKpi, setShowMobileKpi] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [mobileSearch, setMobileSearch] = useState("");

  // Đồng bộ search text trên mobile cho cả 2 nhà máy
  const handleMobileSearchChange = useCallback(
    (val: string) => {
      setMobileSearch(val);
      setSearchNM1(val);
      setSearchNM2(val);
    },
    [setSearchNM1, setSearchNM2]
  );

  // Xuất Excel nhanh theo tab đang xem trên mobile
  const handleMobileExportEX1 = useCallback(() => {
    if (viewMode === "NM2") {
      handleExportExcel("NM2", "EX1");
    } else {
      handleExportExcel("NM1", "EX1");
    }
  }, [viewMode, handleExportExcel]);

  const handleMobileExportEX2 = useCallback(() => {
    if (viewMode === "NM2") {
      handleExportExcel("NM2", "EX2");
    } else {
      handleExportExcel("NM1", "EX2");
    }
  }, [viewMode, handleExportExcel]);

  const handleMobileRefreshCurrent = useCallback(() => {
    if (viewMode === "NM1") {
      loadTinhHinhBaoCao("NM1");
    } else if (viewMode === "NM2") {
      loadTinhHinhBaoCao("NM2");
    } else {
      loadAll();
    }
  }, [viewMode, loadTinhHinhBaoCao, loadAll]);

  // Columns cấu hình chuẩn bảo toàn 100% headerName và width gốc
  const columns = useMemo(() => getTinhHinhChotColumns(), []);

  // Đếm dữ liệu hiển thị hiện tại cho toolbar mobile
  const currentMobileDataLength =
    viewMode === "NM2"
      ? filteredDataNM2.length
      : viewMode === "NM1"
      ? filteredDataNM1.length
      : filteredDataNM1.length + filteredDataNM2.length;

  const totalMobileDataLength =
    viewMode === "NM2"
      ? rawDataNM2.length
      : viewMode === "NM1"
      ? rawDataNM1.length
      : rawDataNM1.length + rawDataNM2.length;

  return (
    <div className={`precision-thc ${isMobile ? "is-mobile" : ""}`}>
      {/* ========================================================= */}
      {/* 1. DESKTOP VIEW: BẢO TOÀN NGUYÊN VẸN 100% GIAO DIỆN GỐC  */}
      {/* ========================================================= */}
      {!isMobile && (
        <>
          {/* Header Bar Công Nghiệp & View Switcher */}
          <PrecisionTinhHinhChotHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showCharts={showCharts}
            onToggleCharts={() => setShowCharts((prev) => !prev)}
            isLoading={isLoading}
            lastUpdated={lastUpdated}
            onRefreshAll={loadAll}
          />

          {/* Micro-Cards KPI Thống Kê Realtime */}
          <PrecisionTinhHinhChotKpi stats={kpiStats} />
        </>
      )}

      {/* ========================================================= */}
      {/* 2. MOBILE VIEW: CÔNG THÁI HỌC, SIÊU TINH GỌN & THÔNG MINH */}
      {/* ========================================================= */}
      {isMobile && (
        <>
          {/* Mobile Header Tinh Gọn */}
          <PrecisionTinhHinhChotMobileHeader
            lastUpdated={lastUpdated}
            isLoading={isLoading}
            showKpi={showMobileKpi}
            onToggleKpi={() => setShowMobileKpi((prev) => !prev)}
            showCharts={showCharts}
            onToggleCharts={() => setShowCharts((prev) => !prev)}
            onRefreshAll={loadAll}
            totalCommands={kpiStats.totalCommands}
            totalChuaChot={kpiStats.totalChuaChot}
            nm1Count={filteredDataNM1.length}
            nm2Count={filteredDataNM2.length}
          />

          {/* Micro-KPI Bar Cuộn Ngang (chỉ hiện khi bật) */}
          {showMobileKpi && (
            <PrecisionTinhHinhChotMobileKpi
              stats={kpiStats}
              onClose={() => setShowMobileKpi(false)}
            />
          )}

          {/* Mobile Toolbar 2 Hàng Công Thái Học */}
          <PrecisionTinhHinhChotMobileToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchValue={mobileSearch}
            onSearchChange={handleMobileSearchChange}
            onOpenFilter={() => setShowFilterDrawer(true)}
            activeFilterCount={activeFilterCount}
            statusChotFilter={statusChotFilter}
            onToggleChotFilter={setStatusChotFilter}
            statusHSFilter={statusHSFilter}
            onToggleHSFilter={setStatusHSFilter}
            onExportEX1={handleMobileExportEX1}
            onExportEX2={handleMobileExportEX2}
            onRefreshCurrent={handleMobileRefreshCurrent}
            isLoading={isLoading}
            currentDataLength={currentMobileDataLength}
            totalDataLength={totalMobileDataLength}
          />
        </>
      )}

      {/* ========================================================= */}
      {/* 3. KHỐI BIỂU ĐỒ RECHARTS (CẢ DESKTOP & MOBILE KHI KÍCH HOẠT)*/}
      {/* ========================================================= */}
      {(showCharts || viewMode === "CHARTS") && (
        <PrecisionTinhHinhChotCharts
          data={chartData}
          factoryFilter={chartFactoryFilter}
          onFactoryFilterChange={setChartFactoryFilter}
          onClose={viewMode !== "CHARTS" ? () => setShowCharts(false) : undefined}
        />
      )}

      {/* ========================================================= */}
      {/* 4. PHÂN VÙNG BẢNG LƯỚI DỮ LIỆU TỐI ĐA HÓA KHÔNG GIAN     */}
      {/* ========================================================= */}
      {viewMode !== "CHARTS" && (
        <div
          className={`precision-thc-body ${
            viewMode === "SPLIT" ? "precision-thc-body--split" : "precision-thc-body--single"
          }`}
        >
          {/* Bảng Nhà Máy 1 (Hiện ở chế độ SPLIT hoặc NM1) */}
          {(viewMode === "SPLIT" || viewMode === "NM1") && (
            <PrecisionTinhHinhChotGrid
              factory="NM1"
              title="Nhà Máy 1"
              data={filteredDataNM1}
              allData={rawDataNM1}
              columns={columns}
              searchValue={searchNM1}
              onSearchChange={setSearchNM1}
              onRefresh={() => loadTinhHinhBaoCao("NM1")}
              onExportExcel={handleExportExcel}
              isLoading={isLoading}
              isMobile={isMobile}
            />
          )}

          {/* Bảng Nhà Máy 2 (Hiện ở chế độ SPLIT hoặc NM2) */}
          {(viewMode === "SPLIT" || viewMode === "NM2") && (
            <PrecisionTinhHinhChotGrid
              factory="NM2"
              title="Nhà Máy 2"
              data={filteredDataNM2}
              allData={rawDataNM2}
              columns={columns}
              searchValue={searchNM2}
              onSearchChange={setSearchNM2}
              onRefresh={() => loadTinhHinhBaoCao("NM2")}
              onExportExcel={handleExportExcel}
              isLoading={isLoading}
              isMobile={isMobile}
            />
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. BOTTOM SHEET FILTER DRAWER (CHỈ HIỂN THỊ TRÊN MOBILE)  */}
      {/* ========================================================= */}
      {isMobile && showFilterDrawer && (
        <PrecisionTinhHinhChotMobileFilterDrawer
          isOpen={showFilterDrawer}
          onClose={() => setShowFilterDrawer(false)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          statusChotFilter={statusChotFilter}
          onStatusChotChange={setStatusChotFilter}
          statusHSFilter={statusHSFilter}
          onStatusHSChange={setStatusHSFilter}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          onReset={resetFilters}
        />
      )}
    </div>
  );
};

export default React.memo(TINH_HINH_CHOT);
