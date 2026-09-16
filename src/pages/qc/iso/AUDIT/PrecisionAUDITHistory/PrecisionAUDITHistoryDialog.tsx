import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Autocomplete,
  IconButton,
} from "@mui/material";
import {
  AiOutlineClose,
  AiOutlineSave,
  AiOutlinePaperClip,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import {
  AuditFormState,
  CustomerOption,
  DialogMode,
} from "./auditHistoryTypes";

interface DialogProps {
  dialogMode: DialogMode;
  formState: AuditFormState;
  setFormState: React.Dispatch<React.SetStateAction<AuditFormState>>;
  customerList: CustomerOption[];
  onClose: () => void;
  onSave: (pendingFile?: File | null) => Promise<void>;
}

export const PrecisionAUDITHistoryDialog: React.FC<DialogProps> = ({
  dialogMode,
  formState,
  setFormState,
  customerList,
  onClose,
  onSave,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!dialogMode) return null;

  const isEdit = dialogMode === "edit";
  const title = isEdit ? "Cập Nhật Thông Tin Audit" : "Thêm Đợt Audit Mới";

  const maxScore = Number(formState.AUDIT_MAX_SCORE) || 0;
  const score = Number(formState.AUDIT_SCORE) || 0;
  const passScore = Number(formState.AUDIT_PASS_SCORE) || 0;
  const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const isPass = score >= passScore;

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      await onSave(selectedFile);
      setSelectedFile(null);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={Boolean(dialogMode)}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="pah-dialog-custom"
    >
      <DialogTitle>
        <span>{title}</span>
        <IconButton size="small" onClick={onClose} disabled={isSaving}>
          <AiOutlineClose size={16} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Section 1: Thông tin chung */}
        <div className="dialog-section-title">1. Thông tin đợt kiểm toán</div>
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={customerList}
              size="small"
              getOptionLabel={(opt) =>
                opt.CUST_CD + (opt.CUST_NAME_KD ? ` - ${opt.CUST_NAME_KD}` : "")
              }
              value={
                customerList.find((c) => c.CUST_CD === formState.CUST_CD) || null
              }
              onChange={(_e, val) => {
                setFormState((prev) => ({
                  ...prev,
                  CUST_CD: val?.CUST_CD || "",
                  CUST_NAME_KD: val?.CUST_NAME_KD || "",
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Khách hàng (CUST_CD) *"
                  placeholder="Chọn mã khách hàng"
                  fullWidth
                  size="small"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Tên khách hàng (CUST_NAME_KD)"
              fullWidth
              size="small"
              value={formState.CUST_NAME_KD}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  CUST_NAME_KD: e.target.value,
                }))
              }
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Mã đợt Audit (AUDIT_ID) *"
              type="number"
              fullWidth
              size="small"
              value={formState.AUDIT_ID}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  AUDIT_ID: e.target.value,
                }))
              }
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Ngày thực hiện (AUDIT_DATE) *"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={formState.AUDIT_DATE}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  AUDIT_DATE: e.target.value,
                }))
              }
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Tên đợt kiểm toán (AUDIT_NAME) *"
              placeholder="VD: Audit Khách hàng định kỳ"
              fullWidth
              size="small"
              value={formState.AUDIT_NAME}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  AUDIT_NAME: e.target.value,
                }))
              }
            />
          </Grid>
        </Grid>

        {/* Section 2: Điểm số & Đánh giá */}
        <div className="dialog-section-title" style={{ marginTop: 14 }}>
          2. Điểm số & Đánh giá kết quả
        </div>
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Thang điểm tối đa (MAX_SCORE)"
              type="number"
              fullWidth
              size="small"
              value={formState.AUDIT_MAX_SCORE}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  AUDIT_MAX_SCORE: Number(e.target.value),
                }))
              }
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Điểm đạt chuẩn (PASS_SCORE)"
              type="number"
              fullWidth
              size="small"
              value={formState.AUDIT_PASS_SCORE}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  AUDIT_PASS_SCORE: Number(e.target.value),
                }))
              }
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Điểm thực tế (AUDIT_SCORE)"
              type="number"
              fullWidth
              size="small"
              value={formState.AUDIT_SCORE}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  AUDIT_SCORE: Number(e.target.value),
                }))
              }
            />
          </Grid>

          {/* Real-time score preview indicator */}
          <Grid item xs={12}>
            <div className="score-preview-card">
              <div className="preview-left">
                <span className="preview-label">Đánh giá tự động:</span>
                <span className="preview-stat">
                  {score} / {maxScore} điểm ({percent}%)
                </span>
              </div>
              <div className="preview-right">
                <span
                  className={`pah-status-badge ${isPass ? "pass" : "fail"}`}
                  style={{ fontSize: "12px", padding: "4px 12px" }}
                >
                  {isPass ? (
                    <AiOutlineCheckCircle style={{ marginRight: 4 }} />
                  ) : (
                    <AiOutlineCloseCircle style={{ marginRight: 4 }} />
                  )}
                  {isPass ? "ĐẠT YÊU CẦU (PASS)" : "KHÔNG ĐẠT (FAIL)"}
                </span>
              </div>
            </div>
          </Grid>
        </Grid>

        {/* Section 3: Tệp đính kèm */}
        <div className="dialog-section-title" style={{ marginTop: 14 }}>
          3. Tệp tài liệu / Báo cáo đính kèm
        </div>
        <div className="dialog-file-upload-box">
          <div className="file-info-side">
            <AiOutlinePaperClip size={18} color="#64748b" />
            <span>
              {selectedFile
                ? `Đã chọn: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`
                : formState.AUDIT_FILE_EXT
                ? `Đã có tệp đính kèm (loại: ${formState.AUDIT_FILE_EXT})`
                : "Chưa chọn tệp đính kèm nào"}
            </span>
          </div>
          <div>
            <input
              type="file"
              id="audit-dialog-file-input"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />
            <label
              htmlFor="audit-dialog-file-input"
              className="btn-choose-file"
            >
              {selectedFile || formState.AUDIT_FILE_EXT ? "Đổi tệp khác" : "Chọn tệp"}
            </label>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isSaving}>
          Hủy
        </Button>
        <Button
          onClick={handleSaveClick}
          variant="contained"
          color="primary"
          disabled={isSaving}
          startIcon={<AiOutlineSave />}
        >
          {isSaving ? "Đang lưu..." : isEdit ? "Cập Nhật" : "Thêm Mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
