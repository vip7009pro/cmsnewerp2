import React, { useMemo, useCallback } from "react";
import "./PrecisionMainDefects/PrecisionMainDefects.scss";
import { useMainDefectsData, ModalImageData } from "./PrecisionMainDefects/useMainDefectsData";
import { createMainDefectsColumns } from "./PrecisionMainDefects/PrecisionMainDefectsColumns";
import PrecisionMainDefectsHeader from "./PrecisionMainDefects/PrecisionMainDefectsHeader";
import PrecisionMainDefectsToolbar from "./PrecisionMainDefects/PrecisionMainDefectsToolbar";
import PrecisionMainDefectsKpi from "./PrecisionMainDefects/PrecisionMainDefectsKpi";
import PrecisionMainDefectsCharts from "./PrecisionMainDefects/PrecisionMainDefectsCharts";
import PrecisionMainDefectsGrid from "./PrecisionMainDefects/PrecisionMainDefectsGrid";
import PrecisionMainDefectsModal from "./PrecisionMainDefects/PrecisionMainDefectsModal";

const MAINDEFECTS: React.FC = () => {
  const {
    rawData,
    filteredData,
    loading,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    allTime,
    setAllTime,
    codeKD,
    setCodeKD,
    codeCMS,
    setCodeCMS,
    prodModel,
    setProdModel,
    processNumber,
    setProcessNumber,
    processOptions,
    useYn,
    setUseYn,
    imageYn,
    setImageYn,
    quickSearch,
    setQuickSearch,
    activeTab,
    setActiveTab,
    selectedImage,
    setSelectedImage,
    kpiSummary,
    top10Defects,
    processDistribution,
    creationTrend,
    top10Models,
    handleLoadData,
    handleExportEX1,
    handleExportEX2,
  } = useMainDefectsData();

  const handleOpenImageModal = useCallback((imageSrc: string, title: string, item: any) => {
    setSelectedImage({ imageSrc, title, item });
  }, [setSelectedImage]);

  const handleCloseImageModal = useCallback(() => {
    setSelectedImage(null);
  }, [setSelectedImage]);

  const columns = useMemo(() => {
    return createMainDefectsColumns({
      onOpenImageModal: handleOpenImageModal,
    });
  }, [handleOpenImageModal]);

  const showKpiAndCharts = activeTab === "all" || activeTab === "charts";
  const showGrid = activeTab === "all" || activeTab === "grid";

  return (
    <div className="precision-maindefects">
      {/* 1. Header Bar công nghiệp */}
      <PrecisionMainDefectsHeader
        totalCount={rawData.length}
        filteredCount={filteredData.length}
        uniqueProducts={kpiSummary.uniqueProducts}
        loading={loading}
        onReload={handleLoadData}
      />

      {/* 2. Action Toolbar compact 2 hàng */}
      <PrecisionMainDefectsToolbar
        fromDate={fromDate}
        toDate={toDate}
        allTime={allTime}
        codeKD={codeKD}
        codeCMS={codeCMS}
        prodModel={prodModel}
        processNumber={processNumber}
        processOptions={processOptions}
        useYn={useYn}
        imageYn={imageYn}
        activeTab={activeTab}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onAllTimeChange={setAllTime}
        onCodeKDChange={setCodeKD}
        onCodeCMSChange={setCodeCMS}
        onProdModelChange={setProdModel}
        onProcessNumberChange={setProcessNumber}
        onUseYnChange={setUseYn}
        onImageYnChange={setImageYn}
        onTabChange={setActiveTab}
        onSearch={handleLoadData}
      />

      {/* 3. Dashboard Scrollable Body */}
      <div className="precision-maindefects__body">
        {/* Phân hệ 1: KPI & Biểu đồ Recharts Executive Dashboard */}
        {showKpiAndCharts && (
          <>
            <PrecisionMainDefectsKpi summary={kpiSummary} />
            <PrecisionMainDefectsCharts
              top10Defects={top10Defects}
              processDistribution={processDistribution}
              creationTrend={creationTrend}
              top10Models={top10Models}
            />
          </>
        )}

        {/* Phân hệ 2: Bảng Dữ Liệu AGTable High-Density */}
        {showGrid && (
          <PrecisionMainDefectsGrid
            columns={columns}
            data={filteredData}
            totalCount={rawData.length}
            searchKeyword={quickSearch}
            onSearchChange={setQuickSearch}
            onExportEX1={handleExportEX1}
            onExportEX2={handleExportEX2}
          />
        )}
      </div>

      {/* 4. Enterprise Modal xem ảnh lớn chất lượng cao */}
      <PrecisionMainDefectsModal
        modalData={selectedImage}
        onClose={handleCloseImageModal}
      />
    </div>
  );
};

export default MAINDEFECTS;
