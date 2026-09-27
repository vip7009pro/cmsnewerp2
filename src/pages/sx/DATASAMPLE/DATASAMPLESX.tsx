import React, { useMemo } from "react";
import "./PrecisionDataSampleSx/PrecisionDataSampleSx.scss";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import { useDataSampleSxData } from "./PrecisionDataSampleSx/useDataSampleSxData";
import PrecisionDataSampleSxHeader from "./PrecisionDataSampleSx/PrecisionDataSampleSxHeader";
import PrecisionDataSampleSxMobileHeader from "./PrecisionDataSampleSx/PrecisionDataSampleSxMobileHeader";
import PrecisionDataSampleSxMobileStatusBar from "./PrecisionDataSampleSx/PrecisionDataSampleSxMobileStatusBar";
import PrecisionDataSampleSxMobileBottomBar from "./PrecisionDataSampleSx/PrecisionDataSampleSxMobileBottomBar";
import PrecisionDataSampleSxForm from "./PrecisionDataSampleSx/PrecisionDataSampleSxForm";
import PrecisionDataSampleSxScannerModal from "./PrecisionDataSampleSx/PrecisionDataSampleSxScannerModal";

const DATASAMPLESX: React.FC = () => {
  const isMobile = useIsMobile();
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

  // Đếm số lượng ảnh đã chọn/chụp
  const fileCount = useMemo(() => {
    return (file1 ? 1 : 0) + (file2 ? 1 : 0);
  }, [file1, file2]);

  // Kiểm tra điều kiện sẵn sàng gửi
  const isReadyToSubmit = useMemo(() => {
    return Boolean(planId.trim() && gName && lineqcEmpl.trim() && fileCount > 0);
  }, [planId, gName, lineqcEmpl, fileCount]);

  return (
    <div className={`precision-datasample ${isMobile ? "is-mobile-view" : ""}`}>
      {/* 1. HEADER CONDITIONAL RENDERING */}
      {!isMobile ? (
        // Header Desktop chuẩn công nghiệp với breadcrumb và telemetry
        <PrecisionDataSampleSxHeader
          planId={planId}
          emplName={emplName}
          onReset={resetForm}
        />
      ) : (
        // Header Mobile siêu tinh gọn với Brand Badge live pulse & nút thao tác nhanh
        <PrecisionDataSampleSxMobileHeader
          planId={planId}
          emplName={emplName}
          lineqcEmpl={lineqcEmpl}
          onReset={resetForm}
          onOpenScanner={() => setShowScanner(true)}
        />
      )}

      {/* 2. MOBILE STATUS / CHECKLIST BAR (Chỉ hiển thị trên Mobile) */}
      {isMobile && (
        <PrecisionDataSampleSxMobileStatusBar
          hasPlan={Boolean(planId && gName)}
          hasEmpl={Boolean(lineqcEmpl && emplName)}
          fileCount={fileCount}
          gName={gName}
        />
      )}

      {/* 3. SCROLLABLE BODY CHỨA FORM HIỆN TRƯỜNG */}
      <div className="precision-datasample__contentBody">
        <PrecisionDataSampleSxForm
          isMobile={isMobile}
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

      {/* 4. STICKY BOTTOM SUBMIT BAR CÔNG THÁI HỌC (Chỉ hiển thị trên Mobile) */}
      {isMobile && (
        <PrecisionDataSampleSxMobileBottomBar
          isValid={isReadyToSubmit}
          isSubmitting={isSubmitting}
          hasPlan={Boolean(planId && gName)}
          hasEmpl={Boolean(lineqcEmpl)}
          fileCount={fileCount}
          onSubmit={submitDataSampleSX}
        />
      )}

      {/* 5. MODAL QUÉT BARCODE / QR CODE TỐI ƯU CAMERA */}
      <PrecisionDataSampleSxScannerModal
        open={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
};

export { DATASAMPLESX };
export default DATASAMPLESX;
