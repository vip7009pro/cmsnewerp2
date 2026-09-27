import React from "react";
import UniversalScannerModal from "../../../../components/Scanner/UniversalScannerModal";

interface PrecisionLineQcScannerModalProps {
  open: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

const PrecisionLineQcScannerModal: React.FC<PrecisionLineQcScannerModalProps> = ({
  open,
  onClose,
  onScanSuccess,
}) => {
  return (
    <UniversalScannerModal
      open={open}
      onClose={onClose}
      onScanSuccess={onScanSuccess}
      title="Quét Mã Chỉ Thị LINE QC"
      description="Hướng camera vào mã vạch Barcode (1D) hoặc QR Code trên phiếu kiểm tra chất lượng"
      allowManualInput={true}
      allowFileUpload={true}
    />
  );
};

export { PrecisionLineQcScannerModal };
export default React.memo(PrecisionLineQcScannerModal);
