// SAMPLE_MONITOR.tsx - Master Controller for Sample Progress Monitoring (Google Stitch High-Density Enterprise)
import React, { useCallback, useMemo, useState } from "react";
import "./SAMPLE_MONITOR.scss";
import { useSampleMonitorData } from "./PrecisionSampleMonitor/useSampleMonitorData";
import { PrecisionSampleMonitorHeader } from "./PrecisionSampleMonitor/PrecisionSampleMonitorHeader";
import { PrecisionSampleMonitorKpi } from "./PrecisionSampleMonitor/PrecisionSampleMonitorKpi";
import { PrecisionSampleMonitorToolbar } from "./PrecisionSampleMonitor/PrecisionSampleMonitorToolbar";
import { getSampleMonitorColumns } from "./PrecisionSampleMonitor/PrecisionSampleMonitorColumns";
import { PrecisionSampleMonitorTable } from "./PrecisionSampleMonitor/PrecisionSampleMonitorTable";
import { ExtendedSampleData } from "./PrecisionSampleMonitor/sampleMonitorTypes";

const SAMPLE_MONITOR: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Hook quản lý 100% dữ liệu, state, API và KPI
  const {
    data,
    filteredData,
    selectedSampleRef,
    setClickedRow,
    prodRequestNo,
    setProdRequestNo,
    ycsxInfo,
    isLoading,
    userDept,
    kpiData,
    statusFilter,
    setStatusFilter,
    searchKeyword,
    setSearchKeyword,
    loadSampleListTable,
    handleAddSample,
    handleUpdateDataRow,
    handleLockSample,
    updateDataTable,
    handleCellCheckboxChange,
    handleExportExcel,
  } = useSampleMonitorData();

  // Chế độ toàn màn hình Studio
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Xử lý thay đổi radio cell
  const handleCellRadioChange = useCallback(
    (row: ExtendedSampleData, key: string, value: string) => {
      updateDataTable(row, key, value);
    },
    [updateDataTable]
  );

  // Đồng bộ selection dòng chọn
  const handleSelectionChange = useCallback(
    (selected: ExtendedSampleData[]) => {
      selectedSampleRef.current = selected;
    },
    [selectedSampleRef]
  );

  // Cấu hình 100% nhóm cột AG-Grid theo đúng chuẩn bản gốc
  const columns = useMemo(() => {
    return getSampleMonitorColumns({
      onCheckboxChange: handleCellCheckboxChange,
      onRadioChange: handleCellRadioChange,
    });
  }, [handleCellCheckboxChange, handleCellRadioChange]);

  return (
    <div className="sample_monitor">
      <div className="precision-sample-monitor">
        {/* 1. Header & Telemetry */}
        <PrecisionSampleMonitorHeader
          totalCount={data.length}
          userDept={userDept}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          onRefresh={() => loadSampleListTable(false)}
        />

        {/* 2. Micro-cards KPI Realtime */}
        <PrecisionSampleMonitorKpi kpi={kpiData} />

        {/* 3. Action Toolbar & Quick Add Sample */}
        <PrecisionSampleMonitorToolbar
          prodRequestNo={prodRequestNo}
          setProdRequestNo={setProdRequestNo}
          ycsxInfo={ycsxInfo}
          onAddSample={handleAddSample}
          onSaveData={handleUpdateDataRow}
          onLockSample={handleLockSample}
          onExportExcel={handleExportExcel}
          onReload={() => loadSampleListTable(false)}
          userDept={userDept}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          isLoading={isLoading}
        />

        {/* 4. High-Density AG-Grid Table */}
        <PrecisionSampleMonitorTable
          data={filteredData}
          columns={columns}
          onSelectionChange={handleSelectionChange}
          onCellClick={setClickedRow}
          totalCount={data.length}
          filteredCount={filteredData.length}
        />
      </div>
    </div>
  );
};

export default SAMPLE_MONITOR;
