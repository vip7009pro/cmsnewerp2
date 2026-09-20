import React, { useMemo } from "react";
import { createProductBarcodeColumns } from "./PrecisionProductBarcode/PrecisionProductBarcodeColumns";
import { PrecisionProductBarcodeForm } from "./PrecisionProductBarcode/PrecisionProductBarcodeForm";
import { PrecisionProductBarcodeHeader } from "./PrecisionProductBarcode/PrecisionProductBarcodeHeader";
import { PrecisionProductBarcodeKpi } from "./PrecisionProductBarcode/PrecisionProductBarcodeKpi";
import { PrecisionProductBarcodePivotModal } from "./PrecisionProductBarcode/PrecisionProductBarcodePivotModal";
import { PrecisionProductBarcodeTable } from "./PrecisionProductBarcode/PrecisionProductBarcodeTable";
import { PrecisionProductBarcodeToolbar } from "./PrecisionProductBarcode/PrecisionProductBarcodeToolbar";
import { useProductBarcodeData } from "./PrecisionProductBarcode/useProductBarcodeData";
import { BARCODE_DATA } from "../interfaces/rndInterface";
import "./PrecisionProductBarcode/PrecisionProductBarcode.scss";
import "./PRODUCT_BARCODE_MANAGER.scss";

const PRODUCT_BARCODE_MANAGER: React.FC = () => {
  const {
    barcodedatatable,
    filteredBarcodeData,
    codeList,
    selectedCode,
    setSelectedCode,
    selectedRows,
    setSelectedRows,
    setBarCodeInfo,
    kpiData,
    quickSearch,
    setQuickSearch,
    typeFilter,
    setTypeFilter,
    prodFilter,
    setProdFilter,
    showhidePivotTable,
    setShowHidePivotTable,
    isFullscreen,
    toggleFullscreen,
    isFormOpen,
    setIsFormOpen,
    load_barcode_table,
    addBarcode,
    updateBarcode,
    deleteBarcode,
    resetForm,
    handleExportExcel,
    dataSource,
  } = useProductBarcodeData();

  // Columns AG-Grid memoized
  const columns = useMemo(() => createProductBarcodeColumns(), []);

  // Xử lý khi chọn dòng trên bảng
  const handleSelectRow = (rowData: BARCODE_DATA) => {
    setSelectedRows(rowData);
    const matchedCode = codeList.find((x) => x.G_CODE === rowData.G_CODE) ?? {
      G_CODE: rowData.G_CODE,
      G_NAME: rowData.G_NAME,
      PROD_LAST_PRICE: 0,
      USE_YN: "N",
    };
    setSelectedCode(matchedCode);
  };

  return (
    <div className="precision-barcode product_barcode_mamanger">
      {/* 1. SUB-HEADER CHUẨN STITCH */}
      <PrecisionProductBarcodeHeader
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        onRefresh={load_barcode_table}
        isFormOpen={isFormOpen}
        onToggleForm={() => setIsFormOpen((prev) => !prev)}
      />

      {/* 2. KPI MICRO-CARDS REALTIME */}
      <PrecisionProductBarcodeKpi kpiData={kpiData} />

      {/* 3. LAYOUT 2 PANE (FORM + WORKSPACE TABLE) */}
      <div className="precision-barcode__layout">
        {/* PANE TRÁI: FORM THIẾT LẬP & LIVE VISUALIZER PREVIEW */}
        <PrecisionProductBarcodeForm
          isOpen={isFormOpen}
          codeList={codeList}
          selectedCode={selectedCode}
          setSelectedCode={setSelectedCode}
          selectedRows={selectedRows}
          setBarCodeInfo={setBarCodeInfo}
          onAdd={addBarcode}
          onUpdate={updateBarcode}
          onDelete={deleteBarcode}
          onReset={resetForm}
        />

        {/* PANE PHẢI: TOOLBAR VÀ BẢNG DỮ LIỆU AG-GRID */}
        <main className="precision-barcode__tablePane">
          <PrecisionProductBarcodeToolbar
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            prodFilter={prodFilter}
            setProdFilter={setProdFilter}
            quickSearch={quickSearch}
            setQuickSearch={setQuickSearch}
            onExportEX1={() => handleExportExcel("EX1")}
            onExportEX2={() => handleExportExcel("EX2")}
            onOpenPivot={() => setShowHidePivotTable(true)}
            totalCount={barcodedatatable.length}
            filteredCount={filteredBarcodeData.length}
          />

          <PrecisionProductBarcodeTable
            columns={columns}
            data={filteredBarcodeData}
            onSelectRow={handleSelectRow}
          />
        </main>
      </div>

      {/* 4. MODAL PIVOT GRID PHÂN TÍCH ĐA CHIỀU */}
      <PrecisionProductBarcodePivotModal
        isOpen={showhidePivotTable}
        onClose={() => setShowHidePivotTable(false)}
        dataSource={dataSource}
      />
    </div>
  );
};

export default PRODUCT_BARCODE_MANAGER;
