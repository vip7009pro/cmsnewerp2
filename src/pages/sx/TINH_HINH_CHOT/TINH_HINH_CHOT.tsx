import React, { useMemo } from "react";
import "./PrecisionTinhHinhChot/PrecisionTinhHinhChot.scss";
import { useTinhHinhChotData } from "./PrecisionTinhHinhChot/useTinhHinhChotData";
import { getTinhHinhChotColumns } from "./PrecisionTinhHinhChot/PrecisionTinhHinhChotColumns";
import PrecisionTinhHinhChotHeader from "./PrecisionTinhHinhChot/PrecisionTinhHinhChotHeader";
import PrecisionTinhHinhChotKpi from "./PrecisionTinhHinhChot/PrecisionTinhHinhChotKpi";
import PrecisionTinhHinhChotCharts from "./PrecisionTinhHinhChot/PrecisionTinhHinhChotCharts";
import PrecisionTinhHinhChotGrid from "./PrecisionTinhHinhChot/PrecisionTinhHinhChotGrid";

const TINH_HINH_CHOT: React.FC = () => {
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
  } = useTinhHinhChotData();

  // Columns cấu hình chuẩn bảo toàn 100% headerName và width gốc
  const columns = useMemo(() => getTinhHinhChotColumns(), []);

  return (
    <div className="precision-thc">
      {/* 1. Header Bar Công Nghiệp & View Switcher */}
      <PrecisionTinhHinhChotHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showCharts={showCharts}
        onToggleCharts={() => setShowCharts((prev) => !prev)}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
        onRefreshAll={loadAll}
      />

      {/* 2. Micro-Cards KPI Thống Kê Realtime */}
      <PrecisionTinhHinhChotKpi stats={kpiStats} />

      {/* 3. Khối Biểu Đồ Recharts Executive (Hiển thị khi bật showCharts hoặc ở mode CHARTS) */}
      {(showCharts || viewMode === "CHARTS") && (
        <PrecisionTinhHinhChotCharts
          data={chartData}
          factoryFilter={chartFactoryFilter}
          onFactoryFilterChange={setChartFactoryFilter}
          onClose={viewMode !== "CHARTS" ? () => setShowCharts(false) : undefined}
        />
      )}

      {/* 4. Phân Vùng Bảng Lưới Dữ Liệu High-Density */}
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
            />
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(TINH_HINH_CHOT);
