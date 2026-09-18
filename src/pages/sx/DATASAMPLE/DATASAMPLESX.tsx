import React from "react";
import "./PrecisionDataSampleSx/PrecisionDataSampleSx.scss";
import { useDataSampleSxData } from "./PrecisionDataSampleSx/useDataSampleSxData";
import PrecisionDataSampleSxHeader from "./PrecisionDataSampleSx/PrecisionDataSampleSxHeader";
import PrecisionDataSampleSxForm from "./PrecisionDataSampleSx/PrecisionDataSampleSxForm";
import PrecisionDataSampleSxScannerModal from "./PrecisionDataSampleSx/PrecisionDataSampleSxScannerModal";

const DATASAMPLESX: React.FC = () => {
  const {
    planId,
    setPlanId,
    gName,
    gCode,
    lineqcEmpl,
    setLineqcEmpl,
    emplName,
    file1,
    file2,
    preview1,
    preview2,
    isSubmitting,
    showScanner,
    setShowScanner,
    userData,
    planInputRef,
    emplInputRef,
    checkPlanID,
    checkEmplName,
    handleFile1Change,
    handleFile2Change,
    submitDataSampleSX,
    handleScanSuccess,
    resetForm,
  } = useDataSampleSxData();

  return (
    <div className="precision-datasample">
      {/* 1. Header Bar công nghiệp */}
      <PrecisionDataSampleSxHeader
        planId={planId}
        emplName={emplName}
        onReset={resetForm}
      />

      {/* 2. Scrollable Body chứa Form Mobile-First */}
      <div className="precision-datasample__contentBody">
        <PrecisionDataSampleSxForm
          planId={planId}
          gName={gName}
          gCode={gCode}
          lineqcEmpl={lineqcEmpl}
          emplName={emplName}
          file1={file1}
          file2={file2}
          preview1={preview1}
          preview2={preview2}
          isSubmitting={isSubmitting}
          userData={userData}
          planInputRef={planInputRef}
          emplInputRef={emplInputRef}
          onPlanIdChange={(val) => {
            setPlanId(val);
            if (val.length >= 6) {
              checkPlanID(val);
            }
          }}
          onLineqcEmplChange={(val) => {
            setLineqcEmpl(val);
            if (val.length >= 5) {
              checkEmplName(val);
            }
          }}
          onOpenScanner={() => setShowScanner(true)}
          onFile1Change={handleFile1Change}
          onFile2Change={handleFile2Change}
          onSubmit={submitDataSampleSX}
        />
      </div>

      {/* 3. Modal Quét Barcode / QR Code tối ưu cho Camera điện thoại */}
      <PrecisionDataSampleSxScannerModal
        open={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
};

export default DATASAMPLESX;
