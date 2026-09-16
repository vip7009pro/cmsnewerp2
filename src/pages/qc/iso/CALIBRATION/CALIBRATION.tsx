import React, { useMemo } from "react";
import "./CALIBRATION.scss";
import { useCalibrationData } from "./PrecisionCalibration/useCalibrationData";
import { PrecisionCalibrationHeader } from "./PrecisionCalibration/PrecisionCalibrationHeader";
import { PrecisionCalibrationKpi } from "./PrecisionCalibration/PrecisionCalibrationKpi";
import { PrecisionCalibrationToolbar } from "./PrecisionCalibration/PrecisionCalibrationToolbar";
import { PrecisionCalibrationTables } from "./PrecisionCalibration/PrecisionCalibrationTables";
import {
  createEquipmentColumns,
  createHistoryColumns,
} from "./PrecisionCalibration/PrecisionCalibrationColumns";
import {
  EquipmentModal,
  HistoryModal,
  ImagePreviewModal,
} from "./PrecisionCalibration/PrecisionCalibrationModals";

const CALIBRATION: React.FC = () => {
  const {
    filteredEquipment,
    selectedEqId,
    setSelectedEqId,
    selectedEquipment,
    historyList,
    isLoading,
    searchQuery,
    setSearchQuery,
    urgencyFilter,
    setUrgencyFilter,
    isFullscreen,
    toggleFullscreen,
    kpiData,
    loadEquipment,
    imagePreview,
    openImagePreview,
    closeImagePreview,
    openEqModal,
    setOpenEqModal,
    isEditEq,
    eqFormData,
    setEqFormData,
    eqFile,
    setEqFile,
    handleOpenAddEq,
    handleOpenEditEq,
    handleSaveEq,
    handleDeleteEq,
    openHistModal,
    setOpenHistModal,
    isEditHist,
    histFormData,
    setHistFormData,
    histFile,
    setHistFile,
    handleOpenAddHist,
    handleOpenEditHist,
    handleSaveHist,
    handleDeleteHist,
    handleExportExcel,
  } = useCalibrationData();

  // Columns for Master Equipment table
  const eqColumns = useMemo(
    () =>
      createEquipmentColumns({
        onPreviewImage: openImagePreview,
        onEditEq: handleOpenEditEq,
        onDeleteEq: handleDeleteEq,
      }),
    [openImagePreview, handleOpenEditEq, handleDeleteEq]
  );

  // Columns for Detail History table
  const histColumns = useMemo(
    () =>
      createHistoryColumns({
        onPreviewImage: openImagePreview,
        onEditHist: handleOpenEditHist,
        onDeleteHist: handleDeleteHist,
      }),
    [openImagePreview, handleOpenEditHist, handleDeleteHist]
  );

  return (
    <div
      className={`precision-calibration calibration-page ${
        isFullscreen ? "is-fullscreen" : ""
      }`}
    >
      {/* 1. Header & Live Telemetry */}
      <PrecisionCalibrationHeader
        isLoading={isLoading}
        isFullscreen={isFullscreen}
        onRefresh={loadEquipment}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* 2. Executive KPI Micro-Cards */}
      <PrecisionCalibrationKpi
        kpiData={kpiData}
        activeFilter={urgencyFilter}
        onSelectFilter={setUrgencyFilter}
      />

      {/* 3. SaaS Control Toolbar */}
      <PrecisionCalibrationToolbar
        urgencyFilter={urgencyFilter}
        setUrgencyFilter={setUrgencyFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
        selectedEquipment={selectedEquipment}
        totalCount={filteredEquipment.length}
        onLoadEquipment={loadEquipment}
        onOpenAddEq={handleOpenAddEq}
        onOpenAddHist={handleOpenAddHist}
        onUnselectEq={() => setSelectedEqId(null)}
        onExportExcel={handleExportExcel}
      />

      {/* 4. Master-Detail AGGrid Tables */}
      <PrecisionCalibrationTables
        equipmentData={filteredEquipment}
        eqColumns={eqColumns}
        selectedEqId={selectedEqId}
        selectedEquipment={selectedEquipment}
        onSelectEqId={setSelectedEqId}
        onCloseDetail={() => setSelectedEqId(null)}
        onOpenAddHist={handleOpenAddHist}
        historyData={historyList}
        histColumns={histColumns}
      />

      {/* 5. Modals */}
      <EquipmentModal
        open={openEqModal}
        isEdit={isEditEq}
        formData={eqFormData}
        setFormData={setEqFormData}
        file={eqFile}
        setFile={setEqFile}
        onClose={() => setOpenEqModal(false)}
        onSave={handleSaveEq}
      />

      <HistoryModal
        open={openHistModal}
        isEdit={isEditHist}
        formData={histFormData}
        setFormData={setHistFormData}
        file={histFile}
        setFile={setHistFile}
        onClose={() => setOpenHistModal(false)}
        onSave={handleSaveHist}
      />

      <ImagePreviewModal
        imagePreview={imagePreview}
        onClose={closeImagePreview}
      />
    </div>
  );
};

export default CALIBRATION;
