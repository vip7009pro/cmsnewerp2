import React, { useMemo } from "react";
import "./PrecisionCSData/PrecisionCSData.scss";
import { useCSData } from "./PrecisionCSData/useCSData";
import { PrecisionCSDataHeader } from "./PrecisionCSData/PrecisionCSDataHeader";
import { PrecisionCSDataKpi } from "./PrecisionCSData/PrecisionCSDataKpi";
import { PrecisionCSDataToolbar } from "./PrecisionCSData/PrecisionCSDataToolbar";
import { getCSDataColumns } from "./PrecisionCSData/PrecisionCSDataColumns";
import { PrecisionCSDataTable } from "./PrecisionCSData/PrecisionCSDataTable";
import { PrecisionCSDataNNDSModal } from "./PrecisionCSData/PrecisionCSDataNNDSModal";
import { PrecisionCSDataPivotModal } from "./PrecisionCSData/PrecisionCSDataPivotModal";

const CS_DATA_TB: React.FC = () => {
  const {
    option,
    handleOptionChange,
    filterData,
    handleFilterChange,
    csData,
    filteredData,
    quickSearchText,
    setQuickSearchText,
    loadCSData,
    kpiMetrics,
    showPivotModal,
    setShowPivotModal,
    isFullscreen,
    toggleFullscreen,
    showNNDSModal,
    currentDefectRow,
    currentNN,
    setCurrentNN,
    currentDS,
    setCurrentDS,
    openNNDSModal,
    closeNNDSModal,
    updateNNDS,
    uploadCSImage,
    uploadCSDoiSach,
    handleExportEX1,
    handleExportEX2,
  } = useCSData();

  // Tạo định nghĩa cột AG-Grid theo phân hệ đang chọn
  const columns = useMemo(() => {
    return getCSDataColumns({
      option,
      onOpenNNDS: openNNDSModal,
      onUploadImage: uploadCSImage,
      onUploadDoiSach: uploadCSDoiSach,
    });
  }, [option, openNNDSModal, uploadCSImage, uploadCSDoiSach]);

  return (
    <div className="precision-cs datacs">
      {/* 1. Header chuẩn Google Stitch */}
      <PrecisionCSDataHeader
        onRefresh={() => loadCSData()}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* 2. Cụm Widgets KPI & Status Strip Thích Ứng Động */}
      <PrecisionCSDataKpi metrics={kpiMetrics} />

      {/* 3. SaaS Action Toolbar 2 Tầng & Segment Switcher */}
      <PrecisionCSDataToolbar
        filters={filterData}
        onFilterChange={handleFilterChange}
        onSearch={() => loadCSData()}
        activeOption={option}
        onOptionChange={handleOptionChange}
        quickSearchText={quickSearchText}
        onQuickSearchChange={setQuickSearchText}
        onExportEX1={handleExportEX1}
        onExportEX2={handleExportEX2}
        onOpenPivot={() => setShowPivotModal(true)}
        totalRows={csData.length}
        filteredRows={filteredData.length}
      />

      {/* 4. AGTable High-Density Data Grid */}
      <PrecisionCSDataTable
        columns={columns}
        data={filteredData}
        option={option}
      />

      {/* 5. Modal Cập Nhật Nguyên Nhân - Đối Sách (NNDS) */}
      {showNNDSModal && currentDefectRow && (
        <PrecisionCSDataNNDSModal
          row={currentDefectRow}
          currentNN={currentNN}
          setCurrentNN={setCurrentNN}
          currentDS={currentDS}
          setCurrentDS={setCurrentDS}
          onSave={updateNNDS}
          onClose={closeNNDSModal}
        />
      )}

      {/* 6. Modal Phân Tích Pivot Table Đa Chiều */}
      {showPivotModal && (
        <PrecisionCSDataPivotModal
          data={csData}
          onClose={() => setShowPivotModal(false)}
        />
      )}
    </div>
  );
};

export default CS_DATA_TB;
