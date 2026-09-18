import React from "react";
import { useLineQcData } from "./PrecisionLineQc/useLineQcData";
import PrecisionLineQcForm from "./PrecisionLineQc/PrecisionLineQcForm";
import PrecisionLineQcScannerModal from "./PrecisionLineQc/PrecisionLineQcScannerModal";
import "./PrecisionLineQc/PrecisionLineQc.scss";

const LINEQC: React.FC = () => {
  const {
    factory,
    setFactory,
    planId,
    handlePlanIdChange,
    handleLineqcEmplChange,
    gName,
    gCode,
    prodRequestNo,
    processLotNo,
    inputNo,
    mName,
    widthCd,
    inCfmQty,
    ktdtc,
    sxData,
    lineqcEmpl,
    emplName,
    remark,
    setRemark,
    file,
    preview,
    isSubmitting,
    isLoadingPlan,
    showScanner,
    setShowScanner,
    userData,
    planInputRef,
    emplInputRef,
    handleFileChange,
    submitLineQcData,
    handleScanSuccess,
    resetForm,
  } = useLineQcData();

  return (
    <div className="precision-lineqc">
      {/* 1. Scrollable Container Form Mobile Action Cards */}
      <div className="precision-lineqc__scrollContainer">
        <PrecisionLineQcForm
          factory={factory}
          planId={planId}
          gName={gName}
          gCode={gCode}
          prodRequestNo={prodRequestNo}
          processLotNo={processLotNo}
          inputNo={inputNo}
          mName={mName}
          widthCd={widthCd}
          inCfmQty={inCfmQty}
          ktdtc={ktdtc}
          sxData={sxData}
          lineqcEmpl={lineqcEmpl}
          emplName={emplName}
          remark={remark}
          file={file}
          preview={preview}
          isSubmitting={isSubmitting}
          isLoadingPlan={isLoadingPlan}
          userData={userData}
          planInputRef={planInputRef}
          emplInputRef={emplInputRef}
          onFactoryChange={setFactory}
          onPlanIdChange={handlePlanIdChange}
          onLineqcEmplChange={handleLineqcEmplChange}
          onRemarkChange={setRemark}
          onOpenScanner={() => setShowScanner(true)}
          onFileChange={handleFileChange}
          onSubmit={submitLineQcData}
          onReset={resetForm}
        />
      </div>

      {/* 2. Modal Quét QR / Barcode */}
      <PrecisionLineQcScannerModal
        open={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleScanSuccess}
      />

      {/* 3. Fullscreen Backdrop Loading Indicator khi đang tải dữ liệu chỉ thị */}
      {isLoadingPlan && (
        <div className="precision-lineqc__backdrop-loader">
          <div className="backdrop-loader-card">
            <div className="spinner-ring"></div>
            <div className="loader-text-group">
              <span className="loader-title">Đang tra cứu dữ liệu sản xuất...</span>
              <span className="loader-subtitle">Chỉ thị: <strong className="font-mono text-sky-600">{planId}</strong></span>
              <span className="loader-detail">Đang đồng bộ thông tin sản phẩm, máy dập và quy cách nguyên vật liệu</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LINEQC;
