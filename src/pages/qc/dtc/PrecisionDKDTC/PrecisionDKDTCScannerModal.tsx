import React, { useEffect, useRef } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { IoCloseOutline, IoQrCodeOutline } from "react-icons/io5";
import { Html5QrcodeScanner } from "html5-qrcode";

interface PrecisionDKDTCScannerModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

const PrecisionDKDTCScannerModal: React.FC<PrecisionDKDTCScannerModalProps> = ({
  open,
  title,
  onClose,
  onScanSuccess,
}) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        try {
          const scanner = new Html5QrcodeScanner(
            "precision-dtc-reader",
            { fps: 10, qrbox: { width: 220, height: 220 } },
            false
          );
          scannerRef.current = scanner;

          scanner.render(
            (decodedText: string) => {
              onScanSuccess(decodedText);
              scanner.clear().catch(() => {});
              onClose();
            },
            () => {
              // Lỗi đọc khung hình tạm thời, bỏ qua
            }
          );
        } catch (err) {
          console.error("Scanner init error:", err);
        }
      }, 200);

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
          borderRadius: "8px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
          color: "#ffffff",
          fontSize: "12px",
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <IoQrCodeOutline size={16} />
          <span>{title}</span>
        </div>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: "#ffffff", padding: "2px" }}
        >
          <IoCloseOutline size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: "12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          id="precision-dtc-reader"
          style={{ width: "100%", minHeight: "260px" }}
        />
        <div
          style={{
            fontSize: "11px",
            color: "#64748b",
            marginTop: "6px",
            textAlign: "center",
          }}
        >
          Hướng camera vào mã vạch Barcode / QR Code trên tem phiếu để quét tự động
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(PrecisionDKDTCScannerModal);
