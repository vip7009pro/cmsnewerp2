import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { IoCloseOutline, IoQrCodeOutline } from "react-icons/io5";
import { UniversalScanner } from "./UniversalScanner";
import { UniversalScannerModalProps } from "./UniversalScanner.types";

export const UniversalScannerModal: React.FC<UniversalScannerModalProps> = ({
  open,
  onClose,
  onScanSuccess,
  title = "Quét Mã Barcode / QR Code",
  description = "Hướng camera vào mã vạch (1D) hoặc QR Code (2D)",
  mode = "single",
  allowManualInput = true,
  allowFileUpload = true,
}) => {
  const handleScanSuccess = (decodedText: string) => {
    onScanSuccess(decodedText);
    if (mode === "single") {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
          margin: "12px",
          backgroundColor: "#030712",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.9)",
          maxHeight: "calc(100vh - 24px)",
        },
      }}
    >
      {/* Enterprise Title Bar */}
      <DialogTitle
        sx={{
          m: 0,
          p: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #090d16 0%, #0f172a 100%)",
          color: "#ffffff",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(56, 189, 248, 0.12)",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              color: "#38bdf8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <IoQrCodeOutline size={18} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "0.2px",
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </div>
            {description && (
              <div
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  marginTop: "2px",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {description}
              </div>
            )}
          </div>
        </div>

        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: "#94a3b8",
            padding: "5px",
            marginLeft: "8px",
            borderRadius: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            "&:hover": {
              color: "#ffffff",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
            },
          }}
        >
          <IoCloseOutline size={20} />
        </IconButton>
      </DialogTitle>

      {/* Scanner Content */}
      <DialogContent sx={{ p: 0, backgroundColor: "#030712", overflow: "hidden" }}>
        {open && (
          <UniversalScanner
            mode={mode}
            onScanSuccess={handleScanSuccess}
            disableManualInput={!allowManualInput}
            disableFileUpload={!allowFileUpload}
            cameraHeight={340}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(UniversalScannerModal);
