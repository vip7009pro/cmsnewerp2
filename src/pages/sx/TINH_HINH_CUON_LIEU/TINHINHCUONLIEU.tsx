import React, { useMemo } from "react";
import "./PrecisionCuonLieu/PrecisionCuonLieu.scss";
import { useCuonLieuData } from "./PrecisionCuonLieu/useCuonLieuData";
import { PrecisionCuonLieuHeader } from "./PrecisionCuonLieu/PrecisionCuonLieuHeader";
import { PrecisionCuonLieuKpi } from "./PrecisionCuonLieu/PrecisionCuonLieuKpi";
import { PrecisionCuonLieuToolbar } from "./PrecisionCuonLieu/PrecisionCuonLieuToolbar";
import { PrecisionCuonLieuChart } from "./PrecisionCuonLieu/PrecisionCuonLieuChart";
import { buildCuonLieuColumns } from "./PrecisionCuonLieu/PrecisionCuonLieuColumns";
import { PrecisionCuonLieuTable } from "./PrecisionCuonLieu/PrecisionCuonLieuTable";
import { lazyComponent } from "../../../components/PivotChart/lazyOpenable";
// Pivot modal chỉ nạp ĐỘNG khi user mở (module kéo theo DevExtreme) — page đã render có điều kiện
// `{showPivotModal && ...}` nên chỉ cần lazy, xem lazyOpenable.tsx.
const PrecisionCuonLieuPivotModal = lazyComponent(() =>
  import("./PrecisionCuonLieu/PrecisionCuonLieuPivotModal").then(
    (m) => m.PrecisionCuonLieuPivotModal,
  ),
);

const TINHHINHCUONLIEU: React.FC = () => {
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
  } = useCuonLieuData();

  // Tạo định nghĩa cột AG-Grid dựa trên dữ liệu thực tế
  const columns = useMemo(() => {
    return buildCuonLieuColumns(datasxtable.length > 0 ? datasxtable[0] : null);
  }, [datasxtable]);

  return (
    <div className="precision-cuonlieu tinhinhcuonlieu">
      {/* 1. Header chuẩn Google Stitch */}
      <PrecisionCuonLieuHeader
        onRefresh={handleLoadData}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* 2. Cụm Widgets KPI & Chuỗi Tiến Độ Công Đoạn */}
      <PrecisionCuonLieuKpi
        lossTableInfo={lossTableInfo}
        pipelineSummary={pipelineSummary}
        extraKpi={extraKpi}
      />

      {/* 3. SaaS Action Toolbar 2 Tầng */}
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

      {/* 4. Executive Chart Card (Tùy chọn ẩn/hiện) */}
      {showChart && (
        <PrecisionCuonLieuChart
          lossRollData={lossRollData}
          dailyGraph={dailyGraph}
          onClose={() => setShowChart(false)}
        />
      )}

      {/* 5. AGTable High-Density Data Grid */}
      <PrecisionCuonLieuTable columns={columns} data={filteredData} />

      {/* 6. Modal Phân Tích Pivot Table Đa Chiều */}
      {showPivotModal && (
        <PrecisionCuonLieuPivotModal
          data={datasxtable}
          onClose={() => setShowPivotModal(false)}
        />
      )}
    </div>
  );
};

export default TINHHINHCUONLIEU;
