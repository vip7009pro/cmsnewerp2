import React, { useMemo } from "react";
import "./PrecisionAUDIT/PrecisionAUDIT.scss";
import { useAUDITData } from "./PrecisionAUDIT/useAUDITData";
import PrecisionAUDITHeader from "./PrecisionAUDIT/PrecisionAUDITHeader";
import PrecisionAUDITToolbar from "./PrecisionAUDIT/PrecisionAUDITToolbar";
import PrecisionAUDITKpi from "./PrecisionAUDIT/PrecisionAUDITKpi";
import PrecisionAUDITBatchTable from "./PrecisionAUDIT/PrecisionAUDITBatchTable";
import PrecisionAUDITChecklistTable from "./PrecisionAUDIT/PrecisionAUDITChecklistTable";
import PrecisionAUDITAddFormModal from "./PrecisionAUDIT/PrecisionAUDITAddFormModal";
import PrecisionAUDITImagePreviewModal from "./PrecisionAUDIT/PrecisionAUDITImagePreviewModal";
import {
  getAuditBatchColumns,
  getAuditChecklistColumns,
} from "./PrecisionAUDIT/PrecisionAUDITColumns";

const AUDIT: React.FC = () => {
  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    selectedAuditID,
    setSelectedAuditID,
    selectedAuditResultID,
    auditList,
    auditResultList,
    auditResultCheckList,
    filteredChecklist,
    selectedChecklistCount,
    handleSelectBatch,
    loadAuditList,
    loadAuditResultList,
    createNewAudit,
    uploadAuditEvident,
    confirmSaveCheckSheet,
    confirmResetEvident,
    exportExcelChecklist,
    quickFilterText,
    setQuickFilterText,
    isBatchPanelOpen,
    setIsBatchPanelOpen,
    isFullscreen,
    toggleFullscreen,
    kpiMetrics,
    isLoading,
    handleSelectionChange,
    handleCellEditingStopped,
    // Add Form Modal
    showHideAddForm,
    setShowHideAddForm,
    customerList,
    selectedCust_CD,
    setSelectedCust_CD,
    passScore,
    setPassScore,
    auditName,
    setAuditName,
    uploadExcelJson,
    readUploadFile,
    handleAddRow,
    handleDeleteRow,
    insertNewAuditInfo,
    // Image Preview Modal
    previewImageUrl,
    isImagePreviewOpen,
    openImagePreview,
    closeImagePreview,
  } = useAUDITData();

  // Cấu hình các bộ cột AG-Grid
  const batchColumns = useMemo(() => getAuditBatchColumns(), []);

  const checklistColumns = useMemo(
    () => getAuditChecklistColumns(uploadAuditEvident, openImagePreview),
    [uploadAuditEvident, openImagePreview]
  );

  return (
    <div className="precision-audit">
      {/* 1. Header Sub-bar Stitch */}
      <PrecisionAUDITHeader
        onRefresh={() => {
          loadAuditList();
          if (selectedAuditID) loadAuditResultList(selectedAuditID);
        }}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        isBatchPanelOpen={isBatchPanelOpen}
        onToggleBatchPanel={() => setIsBatchPanelOpen(!isBatchPanelOpen)}
      />

      {/* 2. Cụm KPI Micro-cards */}
      <PrecisionAUDITKpi metrics={kpiMetrics} />

      {/* 3. SaaS Action Toolbar 2 Tầng */}
      <PrecisionAUDITToolbar
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        auditList={auditList}
        selectedAuditID={selectedAuditID}
        onSelectAuditID={(id) => {
          setSelectedAuditID(id);
          loadAuditResultList(id);
        }}
        onLoadAuditData={() => {
          loadAuditList();
          if (selectedAuditID) loadAuditResultList(selectedAuditID);
        }}
        onCreateNewAudit={createNewAudit}
        onOpenAddFormModal={() => setShowHideAddForm(true)}
        quickFilterText={quickFilterText}
        setQuickFilterText={setQuickFilterText}
        onSaveCheckSheet={confirmSaveCheckSheet}
        onResetEvident={confirmResetEvident}
        onExportExcel={exportExcelChecklist}
        totalChecklistCount={filteredChecklist.length}
        selectedChecklistCount={selectedChecklistCount}
      />

      {/* 4. Workspace 2 Panel: Master Batch List & Detail Checklist */}
      <div className="precision-audit__workspace">
        {isBatchPanelOpen && (
          <PrecisionAUDITBatchTable
            columns={batchColumns}
            data={auditResultList}
            onCellClick={(params) => handleSelectBatch(params.data)}
            selectedCount={auditResultList.length}
          />
        )}

        <PrecisionAUDITChecklistTable
          columns={checklistColumns}
          data={filteredChecklist}
          onSelectionChange={handleSelectionChange}
          onCellEditingStopped={handleCellEditingStopped}
        />
      </div>

      {/* 5. Modal Khởi Tạo Form Mẫu Mới (Add Form) */}
      <PrecisionAUDITAddFormModal
        isOpen={showHideAddForm}
        onClose={() => setShowHideAddForm(false)}
        customerList={customerList}
        selectedCust_CD={selectedCust_CD}
        setSelectedCust_CD={setSelectedCust_CD}
        passScore={passScore}
        setPassScore={setPassScore}
        auditName={auditName}
        setAuditName={setAuditName}
        uploadExcelJson={uploadExcelJson}
        onReadUploadFile={readUploadFile}
        onAddRow={handleAddRow}
        onDeleteRow={handleDeleteRow}
        onInsertNewAuditInfo={insertNewAuditInfo}
      />

      {/* 6. Modal Phóng To Ảnh Bằng Chứng Hiện Trường */}
      <PrecisionAUDITImagePreviewModal
        isOpen={isImagePreviewOpen}
        imageUrl={previewImageUrl}
        onClose={closeImagePreview}
      />
    </div>
  );
};

export default React.memo(AUDIT);
