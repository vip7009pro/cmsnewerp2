import React, { useEffect, useMemo } from "react";
import "./PrecisionDaoFilmData/PrecisionDaoFilmData.scss";
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

const DAOFILMDATA: React.FC = () => {
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

  const showKpiAndCharts = viewMode === "all" || viewMode === "charts";
  const showGrid = viewMode === "all" || viewMode === "grid";

  return (
    <div className="precision-daofilmdata">
      {/* 1. Header Bar công nghiệp */}
      <PrecisionDaoFilmDataHeader
        mode={mode}
        totalRecords={rawData.length}
        loading={loading}
        onReload={reloadCurrent}
      />

      {/* 2. Toolbar điều hành compact */}
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
        totalRecords={rawData.length}
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

      {/* 3. Dashboard Scrollable Body */}
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
            totalCount={rawData.length}
            searchKeyword={searchKeyword}
            onSearchChange={setSearchKeyword}
            onExportEX1={handleExportEX1}
            onExportEX2={handleExportEX2}
            onOpenGiaoNhan={() => setShowGiaoNhan(true)}
            onGanCode={() => {}}
            onXuatDaoFilm={() => {}}
          />
        )}
      </div>

      {/* 4. Enterprise Modal Thêm Giao Nhận QLGN */}
      <PrecisionDaoFilmDataModal
        isOpen={showGiaoNhan}
        onClose={() => setShowGiaoNhan(false)}
      />
    </div>
  );
};

export default DAOFILMDATA;
