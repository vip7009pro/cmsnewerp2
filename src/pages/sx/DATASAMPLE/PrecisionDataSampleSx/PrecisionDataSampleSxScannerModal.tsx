import React from "react";
import UniversalScannerModal from "../../../../components/Scanner/UniversalScannerModal";

interface PrecisionDataSampleSxScannerModalProps {
  open: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

const PrecisionDataSampleSxScannerModal: React.FC<PrecisionDataSampleSxScannerModalProps> = ({
  open,
  onClose,
  onScanSuccess,
}) => {
  return (
    <UniversalScannerModal
      open={open}
      onClose={onClose}
      onScanSuccess={onScanSuccess}
      title="Quét Mã Chỉ Thị Sản Xuất"
      description="Hướng camera vào mã vạch Barcode (1D) hoặc QR Code trên phiếu chỉ thị SX"
      allowManualInput={true}
      allowFileUpload={true}
    />
  );
};

export { PrecisionDataSampleSxScannerModal };
export default React.memo(PrecisionDataSampleSxScannerModal);
