import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import { FiImage } from "react-icons/fi";

interface PrecisionDataSampleSxImagePreviewModalProps {
  open: boolean;
  title: string;
  imageUrl: string | null;
  fileName?: string;
  fileSize?: number;
  onClose: () => void;
}

const PrecisionDataSampleSxImagePreviewModal: React.FC<PrecisionDataSampleSxImagePreviewModalProps> = ({
  open,
  title,
  imageUrl,
  fileName,
  fileSize,
  onClose,
}) => {
  if (!imageUrl) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
          margin: "12px",
          maxHeight: "calc(100vh - 24px)",
          background: "#0f172a",
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
          background: "#1e293b",
          color: "#f8fafc",
          fontSize: "13px",
          fontWeight: 700,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FiImage size={16} color="#60a5fa" />
          <span>{title}</span>
        </div>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: "#94a3b8", "&:hover": { color: "#ffffff" }, padding: "4px" }}
        >
          <IoCloseOutline size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "300px",
          background: "#0f172a",
        }}
      >
        <img
          src={imageUrl}
          alt={title}
          style={{
            maxWidth: "100%",
            maxHeight: "70vh",
            objectFit: "contain",
            borderRadius: "6px",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "10px",
            fontSize: "11px",
            color: "#94a3b8",
          }}
        >
          <span>{fileName || "Ảnh hiện trường"}</span>
          {fileSize && (
            <span style={{ fontFamily: "monospace", color: "#e2e8f0" }}>
              {(fileSize / 1024).toFixed(0)} KB
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { PrecisionDataSampleSxImagePreviewModal };
export default React.memo(PrecisionDataSampleSxImagePreviewModal);
