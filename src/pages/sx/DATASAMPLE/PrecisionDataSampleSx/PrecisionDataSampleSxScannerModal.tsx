import React, { useEffect, useRef } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { IoCloseOutline, IoQrCodeOutline } from "react-icons/io5";
import { Html5QrcodeScanner } from "html5-qrcode";

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
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        try {
          const scanner = new Html5QrcodeScanner(
            "precision-sample-reader",
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              rememberLastUsedCamera: true,
              showTorchButtonIfSupported: true,
            },
            false
          );
          scannerRef.current = scanner;

          scanner.render(
            (decodedText: string) => {
              onScanSuccess(decodedText.trim());
              scanner.clear().catch(() => {});
              onClose();
            },
            () => {
              // Bỏ qua các frame chưa quét được
            }
          );
        } catch (err) {
          console.error("Scanner init error:", err);
        }
      }, 250);

      return () => {
        clearTimeout(timer);
        if (scannerRef.current) {
          scannerRef.current.clear().catch(() => {});
          scannerRef.current = null;
        }
      };
    } else {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    }
  }, [open, onClose, onScanSuccess]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(() => {});
          scannerRef.current = null;
        }
        onClose();
      }}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
          margin: "12px",
          maxHeight: "calc(100vh - 24px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
          color: "#ffffff",
          fontSize: "13px",
          fontWeight: 700,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <IoQrCodeOutline size={18} />
          <span>Quét Mã Chỉ Thị Sản Xuất</span>
        </div>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: "#ffffff", padding: "4px" }}
        >
          <IoCloseOutline size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: "12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          id="precision-sample-reader"
          style={{ width: "100%", minHeight: "280px" }}
        />
        <div
          style={{
            fontSize: "11px",
            color: "#64748b",
            marginTop: "10px",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Hướng camera vào mã vạch Barcode hoặc mã QR trên chỉ thị sản xuất (PLAN_ID)
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { PrecisionDataSampleSxScannerModal };
export default React.memo(PrecisionDataSampleSxScannerModal);
