import React, { useMemo, useState } from "react";
import "./PrecisionCuonLieu/PrecisionCuonLieu.scss";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import { useCuonLieuData } from "./PrecisionCuonLieu/useCuonLieuData";
import { PrecisionCuonLieuHeader } from "./PrecisionCuonLieu/PrecisionCuonLieuHeader";
import { PrecisionCuonLieuKpi } from "./PrecisionCuonLieu/PrecisionCuonLieuKpi";
import { PrecisionCuonLieuToolbar } from "./PrecisionCuonLieu/PrecisionCuonLieuToolbar";
import { PrecisionCuonLieuChart } from "./PrecisionCuonLieu/PrecisionCuonLieuChart";
import { buildCuonLieuColumns } from "./PrecisionCuonLieu/PrecisionCuonLieuColumns";
import { PrecisionCuonLieuTable } from "./PrecisionCuonLieu/PrecisionCuonLieuTable";
import PrecisionCuonLieuMobileHeader from "./PrecisionCuonLieu/PrecisionCuonLieuMobileHeader";
import PrecisionCuonLieuMobileKpi from "./PrecisionCuonLieu/PrecisionCuonLieuMobileKpi";
import PrecisionCuonLieuMobileToolbar from "./PrecisionCuonLieu/PrecisionCuonLieuMobileToolbar";
import PrecisionCuonLieuMobileFilterDrawer from "./PrecisionCuonLieu/PrecisionCuonLieuMobileFilterDrawer";
import { lazyComponent } from "../../../components/PivotChart/lazyOpenable";

// Pivot modal chỉ nạp ĐỘNG khi user mở (module kéo theo DevExtreme) — page đã render có điều kiện
// `{showPivotModal && ...}` nên chỉ cần lazy, xem lazyOpenable.tsx.
const PrecisionCuonLieuPivotModal = lazyComponent(() =>
  import("./PrecisionCuonLieu/PrecisionCuonLieuPivotModal").then(
    (m) => m.PrecisionCuonLieuPivotModal,
  ),
);

const TINHHINHCUONLIEU: React.FC = () => {
  const isMobile = useIsMobile();
  const [showMobileKpi, setShowMobileKpi] = useState<boolean>(false);
  const [showMobileChart, setShowMobileChart] = useState<boolean>(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  const {
    filters,
    handleFilterChange,
    machineList,
    datasxtable,
    filteredData,
    quickSearchText,
    setQuickSearchText,
    showChart,
    setShowChart,
    dailyGraph,
    toggleDailyWeekly,
    showPivotModal,
    setShowPivotModal,
    isFullscreen,
    toggleFullscreen,
    lossRollData,
    lossTableInfo,
    pipelineSummary,
    extraKpi,
    handleLoadData,
    handleExportEX1,
    handleExportEX2,
    activeFilterCount,
    resetFilters,
  } = useCuonLieuData();

  // Tạo định nghĩa cột AG-Grid dựa trên dữ liệu thực tế
  const columns = useMemo(() => {
    return buildCuonLieuColumns(datasxtable.length > 0 ? datasxtable[0] : null);
  }, [datasxtable]);

  return (
    <div className={`precision-cuonlieu tinhinhcuonlieu ${isMobile ? "is-mobile" : ""}`}>
      {/* ========================================================= */}
      {/* 1. DESKTOP VIEW: BẢO TOÀN NGUYÊN VẸN 100% GIAO DIỆN GỐC  */}
      {/* ========================================================= */}
      {!isMobile && (
        <>
          {/* Header chuẩn Google Stitch */}
          <PrecisionCuonLieuHeader
            onRefresh={handleLoadData}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />

          {/* Cụm Widgets KPI & Chuỗi Tiến Độ Công Đoạn */}
          <PrecisionCuonLieuKpi
            lossTableInfo={lossTableInfo}
            pipelineSummary={pipelineSummary}
            extraKpi={extraKpi}
          />

          {/* SaaS Action Toolbar 2 Tầng */}
          <PrecisionCuonLieuToolbar
            filters={filters}
            onFilterChange={handleFilterChange}
            machineList={machineList}
            onSearch={handleLoadData}
            showChart={showChart}
            onToggleChart={() => setShowChart((prev) => !prev)}
            dailyGraph={dailyGraph}
            onToggleDailyWeekly={toggleDailyWeekly}
            quickSearchText={quickSearchText}
            onQuickSearchChange={setQuickSearchText}
            onExportEX1={handleExportEX1}
            onExportEX2={handleExportEX2}
            onOpenPivot={() => setShowPivotModal(true)}
            totalRows={datasxtable.length}
            filteredRows={filteredData.length}
          />

          {/* Executive Chart Card (Tùy chọn ẩn/hiện) */}
          {showChart && (
            <PrecisionCuonLieuChart
              lossRollData={lossRollData}
              dailyGraph={dailyGraph}
              onClose={() => setShowChart(false)}
            />
          )}

          {/* AGTable High-Density Data Grid */}
          <PrecisionCuonLieuTable columns={columns} data={filteredData} isMobile={false} />
        </>
      )}

      {/* ========================================================= */}
      {/* 2. MOBILE VIEW: CÔNG THÁI HỌC, SIÊU TINH GỌN & HIỆU NĂNG */}
      {/* ========================================================= */}
      {isMobile && (
        <>
          {/* Mobile Header Tinh Gọn */}
          <PrecisionCuonLieuMobileHeader
            totalCount={datasxtable.length}
            filteredCount={filteredData.length}
            totalMeters={lossTableInfo.XUATKHO_MET}
            lossPercent={lossTableInfo.TOTAL_LOSS_KT}
            showKpi={showMobileKpi}
            onToggleKpi={() => setShowMobileKpi((prev) => !prev)}
            showChart={showMobileChart}
            onToggleChart={() => setShowMobileChart((prev) => !prev)}
            onRefresh={handleLoadData}
          />

          {/* Dải Micro-KPI Cuộn Ngang (Chỉ hiện khi bật) */}
          {showMobileKpi && (
            <PrecisionCuonLieuMobileKpi
              lossTableInfo={lossTableInfo}
              pipelineSummary={pipelineSummary}
              extraKpi={extraKpi}
              onClose={() => setShowMobileKpi(false)}
            />
          )}

          {/* Biểu đồ xu hướng tổn thất cuộn liệu trên mobile (Chỉ hiện khi bật) */}
          {showMobileChart && (
            <PrecisionCuonLieuChart
              lossRollData={lossRollData}
              dailyGraph={dailyGraph}
              onClose={() => setShowMobileChart(false)}
            />
          )}

          {/* Toolbar 2 Hàng Công Thái Học Di Động */}
          <PrecisionCuonLieuMobileToolbar
            quickSearchText={quickSearchText}
            onQuickSearchChange={setQuickSearchText}
            onOpenFilter={() => setShowFilterDrawer(true)}
            activeFilterCount={activeFilterCount}
            onExportEX1={handleExportEX1}
            onExportEX2={handleExportEX2}
            onOpenPivot={() => setShowPivotModal(true)}
            dailyGraph={dailyGraph}
            onToggleDailyWeekly={toggleDailyWeekly}
            totalRows={datasxtable.length}
            filteredRows={filteredData.length}
          />

          {/* AGTable Chiếm Trọn Không Gian Còn Lại */}
          <PrecisionCuonLieuTable columns={columns} data={filteredData} isMobile={true} />

          {/* Bottom Sheet Filter Drawer Zero-Blur */}
          {showFilterDrawer && (
            <PrecisionCuonLieuMobileFilterDrawer
              isOpen={showFilterDrawer}
              onClose={() => setShowFilterDrawer(false)}
              filters={filters}
              onFilterChange={handleFilterChange}
              machineList={machineList}
              onSearch={handleLoadData}
              onReset={resetFilters}
            />
          )}
        </>
      )}

      {/* ========================================================= */}
      {/* 3. MODAL PHÂN TÍCH PIVOT TABLE (DÙNG CHUNG CẢ HAI CHẾ ĐỘ) */}
      {/* ========================================================= */}
      {showPivotModal && (
        <PrecisionCuonLieuPivotModal
          data={datasxtable}
          onClose={() => setShowPivotModal(false)}
        />
      )}
    </div>
  );
};

export default React.memo(TINHHINHCUONLIEU);
