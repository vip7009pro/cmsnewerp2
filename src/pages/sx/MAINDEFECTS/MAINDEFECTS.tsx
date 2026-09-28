import React, { useState, useMemo, useCallback, useRef } from "react";
import moment from "moment";
import "./PrecisionMainDefects/PrecisionMainDefects.scss";
import { useMainDefectsData, ModalImageData } from "./PrecisionMainDefects/useMainDefectsData";
import { createMainDefectsColumns } from "./PrecisionMainDefects/PrecisionMainDefectsColumns";
import PrecisionMainDefectsHeader from "./PrecisionMainDefects/PrecisionMainDefectsHeader";
import PrecisionMainDefectsToolbar from "./PrecisionMainDefects/PrecisionMainDefectsToolbar";
import PrecisionMainDefectsKpi from "./PrecisionMainDefects/PrecisionMainDefectsKpi";
import PrecisionMainDefectsCharts from "./PrecisionMainDefects/PrecisionMainDefectsCharts";
import PrecisionMainDefectsGrid from "./PrecisionMainDefects/PrecisionMainDefectsGrid";
import PrecisionMainDefectsModal from "./PrecisionMainDefects/PrecisionMainDefectsModal";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import PrecisionMainDefectsMobileHeader from "./PrecisionMainDefects/PrecisionMainDefectsMobileHeader";
import PrecisionMainDefectsMobileKpi from "./PrecisionMainDefects/PrecisionMainDefectsMobileKpi";
import PrecisionMainDefectsMobileToolbar from "./PrecisionMainDefects/PrecisionMainDefectsMobileToolbar";
import PrecisionMainDefectsMobileFilterDrawer from "./PrecisionMainDefects/PrecisionMainDefectsMobileFilterDrawer";

const MAINDEFECTS: React.FC = () => {
  const isMobile = useIsMobile();
  // Mobile specific UI states
  const [showMobileKpi, setShowMobileKpi] = useState<boolean>(false);
  const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);

  // Giữ GridApi để EX1 xuất đúng các dòng đang hiển thị (search/filter/sort).
  const gridApiRef = useRef<any>(null);
  const handleGridApiReady = useCallback((api: any) => {
    gridApiRef.current = api;
  }, []);

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

  // Đếm số điều kiện lọc đang active
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (!allTime) count++;
    if (codeKD.trim() !== "") count++;
    if (codeCMS.trim() !== "") count++;
    if (prodModel.trim() !== "") count++;
    if (processNumber !== "All") count++;
    if (useYn !== "All") count++;
    if (imageYn !== "All") count++;
    return count;
  }, [allTime, codeKD, codeCMS, prodModel, processNumber, useYn, imageYn]);

  // Đặt lại bộ lọc về mặc định
  const handleResetFilter = useCallback(() => {
    setAllTime(true);
    setFromDate(moment().subtract(90, "days").format("YYYY-MM-DD"));
    setToDate(moment().format("YYYY-MM-DD"));
    setCodeKD("");
    setCodeCMS("");
    setProdModel("");
    setProcessNumber("All");
    setUseYn("All");
    setImageYn("All");
  }, [setAllTime, setFromDate, setToDate, setCodeKD, setCodeCMS, setProdModel, setProcessNumber, setUseYn, setImageYn]);

  const showKpiAndCharts = activeTab === "all" || activeTab === "charts";
  const showGrid = activeTab === "all" || activeTab === "grid";

  return (
    <div className={`precision-maindefects ${isMobile ? "is-mobile" : ""}`}>
      {/* 1. Header Bar: Phân biệt Desktop vs Mobile */}
      {!isMobile ? (
        <PrecisionMainDefectsHeader
          totalCount={rawData.length}
          filteredCount={filteredData.length}
          uniqueProducts={kpiSummary.uniqueProducts}
          loading={loading}
          onReload={handleLoadData}
        />
      ) : (
        <PrecisionMainDefectsMobileHeader
          totalCount={rawData.length}
          filteredCount={filteredData.length}
          uniqueProducts={kpiSummary.uniqueProducts}
          loading={loading}
          showKpi={showMobileKpi}
          onToggleKpi={() => setShowMobileKpi((prev) => !prev)}
          onOpenFilterDrawer={() => setShowMobileFilter(true)}
          onReload={handleLoadData}
          activeFilterCount={activeFilterCount}
        />
      )}

      {/* 2. Dải Micro-KPI cuộn ngang (Mobile Only khi bật) */}
      {isMobile && showMobileKpi && (
        <PrecisionMainDefectsMobileKpi
          summary={kpiSummary}
          onClose={() => setShowMobileKpi(false)}
        />
      )}

      {/* 3. Action Toolbar: Phân biệt Desktop vs Mobile */}
      {!isMobile ? (
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
      ) : (
        <PrecisionMainDefectsMobileToolbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          quickSearch={quickSearch}
          onQuickSearchChange={setQuickSearch}
          imageYn={imageYn}
          onImageYnChange={setImageYn}
          useYn={useYn}
          onUseYnChange={setUseYn}
          onExportEX1={() => handleExportEX1(gridApiRef.current)}
          onExportEX2={handleExportEX2}
          onOpenFilterDrawer={() => setShowMobileFilter(true)}
          onSearch={handleLoadData}
          activeFilterCount={activeFilterCount}
          filteredCount={filteredData.length}
          totalCount={rawData.length}
        />
      )}

      {/* 4. Dashboard Scrollable Body */}
      <div className="precision-maindefects__body">
        {/* Phân hệ Desktop: KPI & Biểu đồ Recharts Executive Dashboard */}
        {!isMobile && showKpiAndCharts && (
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

        {/* Phân hệ Mobile: Chỉ render Charts khi activeTab là charts hoặc all */}
        {isMobile && showKpiAndCharts && (
          <PrecisionMainDefectsCharts
            top10Defects={top10Defects}
            processDistribution={processDistribution}
            creationTrend={creationTrend}
            top10Models={top10Models}
          />
        )}

        {/* Phân hệ Bảng Dữ Liệu AGTable High-Density */}
        {showGrid && (
          <PrecisionMainDefectsGrid
            columns={columns}
            data={filteredData}
            totalCount={rawData.length}
            searchKeyword={quickSearch}
            onSearchChange={setQuickSearch}
            onExportEX1={() => handleExportEX1(gridApiRef.current)}
            onExportEX2={handleExportEX2}
            isMobile={isMobile}
            onGridApiReady={handleGridApiReady}
          />
        )}
      </div>

      {/* 5. Enterprise Modal xem ảnh lớn chất lượng cao */}
      <PrecisionMainDefectsModal
        modalData={selectedImage}
        onClose={handleCloseImageModal}
      />

      {/* 6. Mobile Bottom Sheet Filter Drawer */}
      {isMobile && (
        <PrecisionMainDefectsMobileFilterDrawer
          isOpen={showMobileFilter}
          onClose={() => setShowMobileFilter(false)}
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
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onAllTimeChange={setAllTime}
          onCodeKDChange={setCodeKD}
          onCodeCMSChange={setCodeCMS}
          onProdModelChange={setProdModel}
          onProcessNumberChange={setProcessNumber}
          onUseYnChange={setUseYn}
          onImageYnChange={setImageYn}
          onApply={handleLoadData}
          onReset={handleResetFilter}
        />
      )}
    </div>
  );
};

export default React.memo(MAINDEFECTS);
