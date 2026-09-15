import React, { useMemo, useCallback } from "react";
import "./PrecisionPQC3/PrecisionPQC3.scss";
import { usePQC3Data } from "./PrecisionPQC3/usePQC3Data";
import { getPQC1Columns, getPQC3Columns } from "./PrecisionPQC3/PrecisionPQC3Columns";
import PrecisionPQC3Header from "./PrecisionPQC3/PrecisionPQC3Header";
import PrecisionPQC3Kpi from "./PrecisionPQC3/PrecisionPQC3Kpi";
import PrecisionPQC3DirectiveCard from "./PrecisionPQC3/PrecisionPQC3DirectiveCard";
import PrecisionPQC3InputCard from "./PrecisionPQC3/PrecisionPQC3InputCard";
import PrecisionPQC3Toolbar from "./PrecisionPQC3/PrecisionPQC3Toolbar";
import PrecisionPQC3Table from "./PrecisionPQC3/PrecisionPQC3Table";
import PrecisionPQC3ImageModal from "./PrecisionPQC3/PrecisionPQC3ImageModal";

const PQC3: React.FC = () => {
  const pqc3 = usePQC3Data();

  // Mở modal xem trước ảnh lỗi
  const handleViewImage = useCallback((url: string, title: string) => {
    pqc3.setPreviewImage({
      isOpen: true,
      url,
      title,
    });
  }, [pqc3]);

  // Cột cho 2 bảng dữ liệu
  const pqc1Columns = useMemo(() => getPQC1Columns(), []);
  const pqc3Columns = useMemo(() => getPQC3Columns(handleViewImage), [handleViewImage]);

  return (
    <div className={`precision-pqc3 ${pqc3.isFullScreen ? "fullscreen" : ""}`}>
      {/* 1. Header chuẩn Stitch */}
      <PrecisionPQC3Header
        userData={pqc3.userData}
        isFullScreen={pqc3.isFullScreen}
        onToggleFullScreen={() => pqc3.setIsFullScreen((prev) => !prev)}
        onReload={pqc3.handleTraPQC3Data}
      />

      {/* 2. Micro-cards KPI realtime */}
      <PrecisionPQC3Kpi kpis={pqc3.kpis} />

      {/* 3. Vùng nhập liệu & Banner chỉ thị kỹ thuật */}
      <div className={`precision-pqc3-workarea ${!pqc3.showhideinput ? "collapsed" : ""}`}>
        <PrecisionPQC3InputCard
          userData={pqc3.userData}
          factory={pqc3.factory}
          setFactory={pqc3.setFactory}
          process_lot_no={pqc3.process_lot_no}
          setProcessLotNo={pqc3.setProcessLotNo}
          lineqc_empl={pqc3.lineqc_empl}
          setLineqc_empl={pqc3.setLineqc_empl}
          empl_name={pqc3.empl_name}
          err_code={pqc3.err_code}
          setErr_Code={pqc3.setErr_Code}
          error_tb={pqc3.error_tb}
          defect_phenomenon={pqc3.defect_phenomenon}
          setDefectPhenomenon={pqc3.setDefectPhenomenon}
          occurr_time={pqc3.occurr_time}
          setOccurrTime={pqc3.setOccurrTime}
          remark={pqc3.remark}
          setReMark={pqc3.setReMark}
          sample_qty={pqc3.sample_qty}
          setSample_Qty={pqc3.setSample_Qty}
          defect_qty={pqc3.defect_qty}
          setDefect_Qty={pqc3.setDefect_Qty}
          file={pqc3.file}
          setFile={pqc3.setFile}
          pqc1Id={pqc3.pqc1Id}
          pqc3Id={pqc3.pqc3Id}
          refArray={pqc3.refArray}
          handleKeyDown={pqc3.handleKeyDown}
          checkProcessLotNo={pqc3.checkProcessLotNo}
          checkEMPL_NAME={pqc3.checkEMPL_NAME}
          checkInput={pqc3.checkInput}
          onSaveDefect={pqc3.inputDataPqc3}
          onUpdatePhoto={pqc3.uploadFile2}
          onResetForm={pqc3.handleResetForm}
        />

        <PrecisionPQC3DirectiveCard
          planId={pqc3.planId}
          g_name={pqc3.g_name}
          g_code={pqc3.g_code}
          prodrequestno={pqc3.prodrequestno}
          prodreqdate={pqc3.prodreqdate}
          process_lot_no={pqc3.process_lot_no}
          pqc1Id={pqc3.pqc1Id}
          pqc3Id={pqc3.pqc3Id}
        />
      </div>

      {/* 4. Action Toolbar phía trên bảng */}
      <PrecisionPQC3Toolbar
        showhideinput={pqc3.showhideinput}
        onToggleShowHideInput={() => pqc3.setShowHideInput((prev) => !prev)}
        onTraData={pqc3.handleTraPQC3Data}
        activeView={pqc3.activeView}
        onActiveViewChange={pqc3.setActiveView}
        quickFilter={pqc3.quickFilter}
        onQuickFilterChange={pqc3.setQuickFilter}
        onExportExcel={pqc3.exportExcel}
        pqc3Count={pqc3.pqc3datatable.length}
        pqc1Count={pqc3.pqc1datatable.length}
      />

      {/* 5. Khung bảng AGTable High-Density tràn viền (zero footer) */}
      <PrecisionPQC3Table
        activeView={pqc3.activeView}
        pqc3Data={pqc3.pqc3datatable}
        pqc1Data={pqc3.pqc1datatable}
        pqc3Columns={pqc3Columns}
        pqc1Columns={pqc1Columns}
        quickFilterText={pqc3.quickFilter}
        onPqc3RowClick={pqc3.handleSelectPqc3Row}
        onPqc1RowClick={pqc3.handleSelectPqc1Row}
      />

      {/* 6. Modal xem trước ảnh lỗi */}
      <PrecisionPQC3ImageModal
        isOpen={pqc3.previewImage.isOpen}
        imageUrl={pqc3.previewImage.url}
        title={pqc3.previewImage.title}
        onClose={() =>
          pqc3.setPreviewImage({ isOpen: false, url: "", title: "" })
        }
      />
    </div>
  );
};

export default React.memo(PQC3);
