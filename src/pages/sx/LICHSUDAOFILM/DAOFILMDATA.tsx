import React, { useEffect, useMemo, useState } from "react";
import "./PrecisionDaoFilmData/PrecisionDaoFilmData.scss";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import { useDaoFilmData } from "./PrecisionDaoFilmData/useDaoFilmData";
import {
  getColumnGiaoNhanDaoFilm,
  getColumnQuanLyDaoFilm,
  getColumnLichSuXuatDaoFilm,
} from "./PrecisionDaoFilmData/PrecisionDaoFilmDataColumns";
import PrecisionDaoFilmDataHeader from "./PrecisionDaoFilmData/PrecisionDaoFilmDataHeader";
import PrecisionDaoFilmDataToolbar from "./PrecisionDaoFilmData/PrecisionDaoFilmDataToolbar";
import PrecisionDaoFilmDataKpi from "./PrecisionDaoFilmData/PrecisionDaoFilmDataKpi";
import PrecisionDaoFilmDataCharts from "./PrecisionDaoFilmData/PrecisionDaoFilmDataCharts";
import PrecisionDaoFilmDataGrid from "./PrecisionDaoFilmData/PrecisionDaoFilmDataGrid";
import PrecisionDaoFilmDataModal from "./PrecisionDaoFilmData/PrecisionDaoFilmDataModal";
import PrecisionDaoFilmDataMobileHeader from "./PrecisionDaoFilmData/PrecisionDaoFilmDataMobileHeader";
import PrecisionDaoFilmDataMobileToolbar from "./PrecisionDaoFilmData/PrecisionDaoFilmDataMobileToolbar";
import PrecisionDaoFilmDataMobileKpi from "./PrecisionDaoFilmData/PrecisionDaoFilmDataMobileKpi";
import PrecisionDaoFilmDataMobileFilterDrawer from "./PrecisionDaoFilmData/PrecisionDaoFilmDataMobileFilterDrawer";

const DAOFILMDATA: React.FC = () => {
  const isMobile = useIsMobile();
  const [showMobileKpi, setShowMobileKpi] = useState<boolean>(false);
  const [showMobileChart, setShowMobileChart] = useState<boolean>(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  const {
    mode,
    viewMode,
    setViewMode,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    codeKD,
    setCodeKD,
    codeCMS,
    setCodeCMS,
    knifeType,
    setKnifeType,
    factory,
    setFactory,
    planId,
    setPlanId,
    id,
    setId,
    allTime,
    setAllTime,
    searchKeyword,
    setSearchKeyword,
    loading,
    showGiaoNhan,
    setShowGiaoNhan,
    rawData,
    filteredData,
    kpiData,
    typeDistributionData,
    topPressData,
    dailyTrendData,
    factoryStatusData,
    activeFilterCount,
    resetFilters,
    fetchGiaoNhan,
    fetchQuanLy,
    fetchLichSuXuat,
    reloadCurrent,
    setQuickDate,
    handleExportEX1,
    handleExportEX2,
  } = useDaoFilmData();

  // Load initial data
  useEffect(() => {
    fetchGiaoNhan();
  }, []);

  // Columns definition according to active mode
  const currentColumns = useMemo(() => {
    switch (mode) {
      case "GIAO_NHAN":
        return getColumnGiaoNhanDaoFilm();
      case "QUAN_LY":
        return getColumnQuanLyDaoFilm();
      case "XUAT_DAO_FILM":
        return getColumnLichSuXuatDaoFilm();
      default:
        return getColumnGiaoNhanDaoFilm();
    }
  }, [mode]);

  const totalRowCount = rawData.length;
  const filteredRowCount = filteredData.length;

  const showKpiAndCharts = viewMode === "all" || viewMode === "charts";
  const showGrid = viewMode === "all" || viewMode === "grid";

  return (
    <div className={`precision-daofilmdata ${isMobile ? "is-mobile" : ""}`}>
      {/* ========================================================= */}
      {/* 1. DESKTOP VIEW: BẢO TOÀN NGUYÊN VẸN 100% GIAO DIỆN GỐC  */}
      {/* ========================================================= */}
      {!isMobile && (
        <>
          {/* Header Bar công nghiệp */}
          <PrecisionDaoFilmDataHeader
            mode={mode}
            totalRecords={totalRowCount}
            loading={loading}
            onReload={reloadCurrent}
          />

          {/* Toolbar điều hành compact */}
          <PrecisionDaoFilmDataToolbar
            mode={mode}
            viewMode={viewMode}
            fromDate={fromDate}
            toDate={toDate}
            codeKD={codeKD}
            codeCMS={codeCMS}
            knifeType={knifeType}
            factory={factory}
            planId={planId}
            id={id}
            allTime={allTime}
            totalRecords={totalRowCount}
            loading={loading}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onCodeKDChange={setCodeKD}
            onCodeCMSChange={setCodeCMS}
            onKnifeTypeChange={setKnifeType}
            onFactoryChange={setFactory}
            onPlanIdChange={setPlanId}
            onIdChange={setId}
            onAllTimeChange={setAllTime}
            onQuickDate={setQuickDate}
            onViewModeChange={setViewMode}
            onFetchGiaoNhan={fetchGiaoNhan}
            onFetchQuanLy={fetchQuanLy}
            onFetchLichSuXuat={fetchLichSuXuat}
          />

          {/* Dashboard Scrollable Body */}
          <div className="precision-df-body">
            {showKpiAndCharts && (
              <>
                {/* Realtime KPI Micro-Cards */}
                <PrecisionDaoFilmDataKpi kpiData={kpiData} />

                {/* Recharts Executive Dashboard */}
                <PrecisionDaoFilmDataCharts
                  typeDistributionData={typeDistributionData}
                  topPressData={topPressData}
                  dailyTrendData={dailyTrendData}
                  factoryStatusData={factoryStatusData}
                />
              </>
            )}

            {/* AG-Grid Data Table Container */}
            {showGrid && (
              <PrecisionDaoFilmDataGrid
                mode={mode}
                columns={currentColumns}
                filteredData={filteredData}
                totalCount={totalRowCount}
                searchKeyword={searchKeyword}
                onSearchChange={setSearchKeyword}
                onExportEX1={handleExportEX1}
                onExportEX2={handleExportEX2}
                onOpenGiaoNhan={() => setShowGiaoNhan(true)}
                onGanCode={() => {}}
                onXuatDaoFilm={() => {}}
                isMobile={false}
              />
            )}
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 2. MOBILE VIEW: CÔNG THÁI HỌC, SIÊU TINH GỌN & HIỆU NĂNG */}
      {/* ========================================================= */}
      {isMobile && (
        <>
          {/* Header Mobile Tinh Gọn */}
          <PrecisionDaoFilmDataMobileHeader
            mode={mode}
            totalRecords={totalRowCount}
            filteredRecords={filteredRowCount}
            kpiData={kpiData}
            loading={loading}
            showKpi={showMobileKpi}
            onToggleKpi={() => setShowMobileKpi((prev) => !prev)}
            showChart={showMobileChart}
            onToggleChart={() => setShowMobileChart((prev) => !prev)}
            onReload={reloadCurrent}
          />

          {/* Dải Micro-KPI Cuộn Ngang (Chỉ hiện khi bật) */}
          {showMobileKpi && (
            <PrecisionDaoFilmDataMobileKpi
              kpiData={kpiData}
              onClose={() => setShowMobileKpi(false)}
            />
          )}

          {/* Biểu Đồ Phân Tích Trên Mobile (Chỉ hiện khi bật) */}
          {showMobileChart && (
            <div style={{ maxHeight: "300px", overflowY: "auto", flexShrink: 0 }}>
              <PrecisionDaoFilmDataCharts
                typeDistributionData={typeDistributionData}
                topPressData={topPressData}
                dailyTrendData={dailyTrendData}
                factoryStatusData={factoryStatusData}
              />
            </div>
          )}

          {/* Mobile Toolbar 3 Hàng Công Thái Học */}
          <PrecisionDaoFilmDataMobileToolbar
            mode={mode}
            loading={loading}
            totalRecords={totalRowCount}
            filteredRecords={filteredRowCount}
            searchKeyword={searchKeyword}
            onSearchChange={setSearchKeyword}
            onOpenFilter={() => setShowFilterDrawer(true)}
            activeFilterCount={activeFilterCount}
            onFetchGiaoNhan={fetchGiaoNhan}
            onFetchQuanLy={fetchQuanLy}
            onFetchLichSuXuat={fetchLichSuXuat}
            onExportEX1={handleExportEX1}
            onExportEX2={handleExportEX2}
            onOpenGiaoNhan={() => setShowGiaoNhan(true)}
            onGanCode={() => {}}
            onXuatDaoFilm={() => {}}
          />

          {/* AGTable Grid Chiếm Trọn Không Gian Còn Lại */}
          <div className="precision-df-body">
            <PrecisionDaoFilmDataGrid
              mode={mode}
              columns={currentColumns}
              filteredData={filteredData}
              totalCount={totalRowCount}
              searchKeyword={searchKeyword}
              onSearchChange={setSearchKeyword}
              onExportEX1={handleExportEX1}
              onExportEX2={handleExportEX2}
              onOpenGiaoNhan={() => setShowGiaoNhan(true)}
              onGanCode={() => {}}
              onXuatDaoFilm={() => {}}
              isMobile={true}
            />
          </div>

          {/* Bottom Sheet Filter Drawer Zero-Blur */}
          {showFilterDrawer && (
            <PrecisionDaoFilmDataMobileFilterDrawer
              isOpen={showFilterDrawer}
              onClose={() => setShowFilterDrawer(false)}
              mode={mode}
              fromDate={fromDate}
              toDate={toDate}
              allTime={allTime}
              codeKD={codeKD}
              codeCMS={codeCMS}
              knifeType={knifeType}
              factory={factory}
              planId={planId}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
              onAllTimeChange={setAllTime}
              onCodeKDChange={setCodeKD}
              onCodeCMSChange={setCodeCMS}
              onKnifeTypeChange={setKnifeType}
              onFactoryChange={setFactory}
              onPlanIdChange={setPlanId}
              onQuickDate={setQuickDate}
              onApply={reloadCurrent}
              onReset={resetFilters}
            />
          )}
        </>
      )}

      {/* 3. Enterprise Modal Thêm Giao Nhận QLGN (Chung Cả 2 Thiết Bị) */}
      <PrecisionDaoFilmDataModal
        isOpen={showGiaoNhan}
        onClose={() => setShowGiaoNhan(false)}
      />
    </div>
  );
};

export default React.memo(DAOFILMDATA);
export { DAOFILMDATA };
