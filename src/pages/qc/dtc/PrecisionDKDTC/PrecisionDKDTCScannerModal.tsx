import React from "react";
import UniversalScannerModal from "../../../../components/Scanner/UniversalScannerModal";

interface PrecisionDKDTCScannerModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

const PrecisionDKDTCScannerModal: React.FC<PrecisionDKDTCScannerModalProps> = ({
  open,
  title = "Quét Mã Tem Phiếu DTC",
  onClose,
  onScanSuccess,
}) => {
  return (
    <UniversalScannerModal
      open={open}
      onClose={onClose}
      onScanSuccess={onScanSuccess}
      title={title}
      description="Hướng camera vào mã vạch Barcode (1D) hoặc QR Code trên tem phiếu để quét tự động"
      allowManualInput={true}
      allowFileUpload={true}
      // Scanner có thể được mở TỪ TRÊN bottom-sheet "Phiếu Đăng Ký" (mobile, z-index 10000).
      // MUI Dialog mặc định chỉ 1300 nên sẽ bị sheet che ⇒ phải nâng lên trên sheet.
      zIndex={13000}
    />
  );
};

export default React.memo(PrecisionDKDTCScannerModal);
