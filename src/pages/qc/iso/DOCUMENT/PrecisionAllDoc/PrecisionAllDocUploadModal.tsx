import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
} from "@mui/material";
import {
  AiOutlineClose,
  AiOutlineCloudUpload,
  AiOutlineFile,
} from "react-icons/ai";
import {
  DOC_CATEGORY1_DATA,
  DOC_CATEGORY2_DATA,
  DOC_LIST_DATA,
  UploadModalState,
} from "./allDocTypes";

interface UploadModalProps {
  uploadState: UploadModalState;
  setUploadState: React.Dispatch<React.SetStateAction<UploadModalState>>;
  docCategory1Data: DOC_CATEGORY1_DATA[];
  docCategory2Data: DOC_CATEGORY2_DATA[];
  docListData: DOC_LIST_DATA[];
  onClose: () => void;
  onSave: (file: File) => Promise<void>;
}

export const PrecisionAllDocUploadModal: React.FC<UploadModalProps> = ({
  uploadState,
  setUploadState,
  docCategory1Data,
  docCategory2Data,
  docListData,
  onClose,
  onSave,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!uploadState.isOpen) return null;

  const handleSaveClick = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      await onSave(selectedFile);
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog
      open={uploadState.isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="pad-dialog-custom"
    >
      <DialogTitle>
        <span>Upload Tài Liệu Mới</span>
        <IconButton size="small" onClick={onClose} disabled={isUploading}>
          <AiOutlineClose size={16} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={1.5}>
          {/* Phân loại 1 */}
          <Grid item xs={12} sm={6}>
            <FormControl size="small" fullWidth>
              <InputLabel>Phân loại (Cat 1) *</InputLabel>
              <Select
                value={uploadState.CAT_ID || ""}
                label="Phân loại (Cat 1) *"
                onChange={(e) =>
                  setUploadState((prev) => ({
                    ...prev,
                    CAT_ID: Number(e.target.value),
                  }))
                }
              >
                {docCategory1Data.map((c, idx) => (
                  <MenuItem key={c.CAT_ID} value={c.CAT_ID}>
                    {idx + 1}. {c.CAT_NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Phân loại 2 */}
          <Grid item xs={12} sm={6}>
            <FormControl size="small" fullWidth>
              <InputLabel>Loại tài liệu (Cat 2) *</InputLabel>
              <Select
                value={uploadState.DOC_CAT_ID || ""}
                label="Loại tài liệu (Cat 2) *"
                onChange={(e) =>
                  setUploadState((prev) => ({
                    ...prev,
                    DOC_CAT_ID: Number(e.target.value),
                  }))
                }
              >
                {docCategory2Data.map((c, idx) => (
                  <MenuItem key={c.DOC_CAT_ID} value={c.DOC_CAT_ID}>
                    {idx + 1}. {c.DOC_CAT_NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Chọn từ danh mục có sẵn */}
          <Grid item xs={12} sm={6}>
            <FormControl size="small" fullWidth>
              <InputLabel>Chọn từ danh mục tài liệu</InputLabel>
              <Select
                value={uploadState.DOC_ID || 0}
                label="Chọn từ danh mục tài liệu"
                onChange={(e) => {
                  const docId = Number(e.target.value);
                  const found = docListData.find((d) => d.DOC_ID === docId);
                  setUploadState((prev) => ({
                    ...prev,
                    DOC_ID: docId,
                    DOC_NAME: found ? found.DOC_NAME : prev.DOC_NAME,
                  }));
                }}
              >
                <MenuItem value={0}>-- Chọn văn bản có sẵn --</MenuItem>
                {docListData
                  .filter((item) => {
                    if (uploadState.CAT_ID && item.CAT_ID !== uploadState.CAT_ID)
                      return false;
                    if (
                      uploadState.DOC_CAT_ID &&
                      item.DOC_CAT_ID !== uploadState.DOC_CAT_ID
                    )
                      return false;
                    return true;
                  })
                  .map((item, idx) => (
                    <MenuItem key={item.DOC_ID} value={item.DOC_ID}>
                      {idx + 1}. {item.DOC_NAME}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Tên tài liệu chi tiết */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tên tài liệu văn bản *"
              placeholder="VD: Quy trình kiểm tra IQC..."
              size="small"
              fullWidth
              value={uploadState.DOC_NAME}
              onChange={(e) =>
                setUploadState((prev) => ({
                  ...prev,
                  DOC_NAME: e.target.value,
                }))
              }
            />
          </Grid>

          {/* Ngày phát hành */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Ngày ban hành (REG_DATE)"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={uploadState.REG_DATE}
              onChange={(e) =>
                setUploadState((prev) => ({
                  ...prev,
                  REG_DATE: e.target.value,
                }))
              }
            />
          </Grid>

          {/* Ngày hết hạn */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Ngày hết hạn (EXP_DATE)"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={uploadState.EXP_DATE}
              disabled={uploadState.HSD_YN === "N"}
              onChange={(e) =>
                setUploadState((prev) => ({
                  ...prev,
                  EXP_DATE: e.target.value,
                }))
              }
            />
          </Grid>

          {/* HSD_YN */}
          <Grid item xs={12} sm={4}>
            <FormControl size="small" fullWidth>
              <InputLabel>Có hạn dùng (HSD)</InputLabel>
              <Select
                value={uploadState.HSD_YN}
                label="Có hạn dùng (HSD)"
                onChange={(e) =>
                  setUploadState((prev) => ({
                    ...prev,
                    HSD_YN: e.target.value as string,
                  }))
                }
              >
                <MenuItem value="Y">Có hạn dùng (HSD)</MenuItem>
                <MenuItem value="N">Vô hạn (Không HSD)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Dropzone File */}
          <Grid item xs={12}>
            <div className="doc-dropzone-box">
              <div className="dropzone-left">
                <AiOutlineFile size={26} color="#2563eb" />
                <div>
                  <div className="dropzone-file-name">
                    {selectedFile
                      ? selectedFile.name
                      : "Chưa chọn tệp tin văn bản nào"}
                  </div>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>
                    {selectedFile
                      ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                      : "Hỗ trợ PDF, Word, Excel, PowerPoint, ZIP..."}
                  </span>
                </div>
              </div>

              <div>
                <input
                  type="file"
                  id="alldoc-upload-file-input"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
                <label
                  htmlFor="alldoc-upload-file-input"
                  className="btn-choose-file"
                >
                  {selectedFile ? "Đổi tệp khác" : "Chọn tệp"}
                </label>
              </div>
            </div>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isUploading}>
          Hủy
        </Button>
        <Button
          onClick={handleSaveClick}
          variant="contained"
          color="primary"
          disabled={!selectedFile || isUploading}
          startIcon={<AiOutlineCloudUpload />}
        >
          {isUploading ? "Đang tải lên..." : "Tải Lên Máy Chủ"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
