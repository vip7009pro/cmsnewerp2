import React, { useMemo } from "react";
import "./AUDIT_HISTORY.scss";
import { useAUDITHistoryData } from "./PrecisionAUDITHistory/useAUDITHistoryData";
import { PrecisionAUDITHistoryHeader } from "./PrecisionAUDITHistory/PrecisionAUDITHistoryHeader";
import { PrecisionAUDITHistoryKpi } from "./PrecisionAUDITHistory/PrecisionAUDITHistoryKpi";
import { PrecisionAUDITHistoryToolbar } from "./PrecisionAUDITHistory/PrecisionAUDITHistoryToolbar";
import { PrecisionAUDITHistoryTable } from "./PrecisionAUDITHistory/PrecisionAUDITHistoryTable";
import { createAuditHistoryColumns } from "./PrecisionAUDITHistory/PrecisionAUDITHistoryColumns";
import { PrecisionAUDITHistoryDialog } from "./PrecisionAUDITHistory/PrecisionAUDITHistoryDialog";

const AUDIT_HISTORY: React.FC = () => {
  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    allTime,
    setAllTime,
    searchQuery,
    setSearchQuery,
    isLoading,
    isFullscreen,
    toggleFullscreen,
    filteredData,
    kpiData,
    selectedRows,
    setSelectedRows,
    selectedRowRef,
    dialogMode,
    customerList,
    formState,
    setFormState,
    loadData,
    handleApplyPreset,
    openAddModal,
    openEditModal,
    closeModal,
    handleSaveAudit,
    handleDeleteSelectedRows,
    handleUploadDoc,
    handleExportExcel,
  } = useAUDITHistoryData();

  // AGGrid column definitions preserving original schema & widths
  const columns = useMemo(
    () => createAuditHistoryColumns({ onUploadDoc: handleUploadDoc }),
    [handleUploadDoc]
  );

  return (
    <div
      className={`precision-audit-history audit-history-page ${
        isFullscreen ? "is-fullscreen" : ""
      }`}
    >
      {/* 1. Header & Live Telemetry */}
      <PrecisionAUDITHistoryHeader
        isLoading={isLoading}
        isFullscreen={isFullscreen}
        onRefresh={loadData}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* 2. Executive KPI Micro-Cards */}
      <PrecisionAUDITHistoryKpi kpiData={kpiData} />

      {/* 3. SaaS Control Toolbar */}
      <PrecisionAUDITHistoryToolbar
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        allTime={allTime}
        setAllTime={setAllTime}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
        selectedCount={selectedRows.length}
        totalCount={filteredData.length}
        onLoadData={loadData}
        onApplyPreset={handleApplyPreset}
        onOpenAddModal={openAddModal}
        onOpenEditModal={() => openEditModal()}
        onDeleteSelected={handleDeleteSelectedRows}
        onExportExcel={handleExportExcel}
      />

      {/* 4. High-Density AGGrid Table */}
      <PrecisionAUDITHistoryTable
        data={filteredData}
        columns={columns}
        onCellClick={(params) => {
          selectedRowRef.current = params.data;
        }}
        onSelectionChange={(params) => {
          setSelectedRows(params.api.getSelectedRows());
        }}
      />

      {/* 5. Unified Add/Edit Modal */}
      <PrecisionAUDITHistoryDialog
        dialogMode={dialogMode}
        formState={formState}
        setFormState={setFormState}
        customerList={customerList}
        onClose={closeModal}
        onSave={handleSaveAudit}
      />
    </div>
  );
};

export default AUDIT_HISTORY;
