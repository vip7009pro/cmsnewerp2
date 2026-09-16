import React, { useMemo } from "react";
import "./ALLDOC.scss";
import { useAllDocData } from "./PrecisionAllDoc/useAllDocData";
import { PrecisionAllDocHeader } from "./PrecisionAllDoc/PrecisionAllDocHeader";
import { PrecisionAllDocKpi } from "./PrecisionAllDoc/PrecisionAllDocKpi";
import { PrecisionAllDocToolbar } from "./PrecisionAllDoc/PrecisionAllDocToolbar";
import { PrecisionAllDocTable } from "./PrecisionAllDoc/PrecisionAllDocTable";
import { createAllDocColumns } from "./PrecisionAllDoc/PrecisionAllDocColumns";
import { PrecisionAllDocUploadModal } from "./PrecisionAllDoc/PrecisionAllDocUploadModal";
import { PrecisionAllDocUpdateModal } from "./PrecisionAllDoc/PrecisionAllDocUpdateModal";

const ALLDOC: React.FC = () => {
  const {
    filteredDocData,
    selectedRows,
    setSelectedRows,
    isLoading,
    searchQuery,
    setSearchQuery,
    isFullscreen,
    toggleFullscreen,
    filterValues,
    setFilterValues,
    docCategory1Data,
    docCategory2Data,
    docListData,
    kpiData,
    loadAllDoc,
    uploadModalState,
    setUploadModalState,
    handleOpenUploadModal,
    handleCloseUploadModal,
    handleSaveUpload,
    updateModalState,
    setUpdateModalState,
    handleOpenUpdateModal,
    handleCloseUpdateModal,
    handleSaveBatchUpdate,
    handleExportExcel,
  } = useAllDocData();

  // Columns preserving 100% original schema and widths
  const columns = useMemo(() => createAllDocColumns(), []);

  return (
    <div
      className={`precision-alldoc documentmanager-page ${
        isFullscreen ? "is-fullscreen" : ""
      }`}
    >
      {/* 1. Header & Live Telemetry */}
      <PrecisionAllDocHeader
        isLoading={isLoading}
        isFullscreen={isFullscreen}
        onRefresh={() => loadAllDoc()}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* 2. Executive KPI Micro-Cards */}
      <PrecisionAllDocKpi kpiData={kpiData} />

      {/* 3. SaaS Control Toolbar */}
      <PrecisionAllDocToolbar
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
        selectedCount={selectedRows.length}
        totalCount={filteredDocData.length}
        docCategory1Data={docCategory1Data}
        docCategory2Data={docCategory2Data}
        docListData={docListData}
        onSearch={() => loadAllDoc()}
        onOpenUploadModal={handleOpenUploadModal}
        onOpenUpdateModal={handleOpenUpdateModal}
        onExportExcel={handleExportExcel}
      />

      {/* 4. High-Density AGGrid Table */}
      <PrecisionAllDocTable
        data={filteredDocData}
        columns={columns}
        onSelectionChange={setSelectedRows}
      />

      {/* 5. Modals */}
      <PrecisionAllDocUploadModal
        uploadState={uploadModalState}
        setUploadState={setUploadModalState}
        docCategory1Data={docCategory1Data}
        docCategory2Data={docCategory2Data}
        docListData={docListData}
        onClose={handleCloseUploadModal}
        onSave={handleSaveUpload}
      />

      <PrecisionAllDocUpdateModal
        updateState={updateModalState}
        setUpdateState={setUpdateModalState}
        selectedRows={selectedRows}
        onClose={handleCloseUpdateModal}
        onSave={handleSaveBatchUpdate}
      />
    </div>
  );
};

export default ALLDOC;
