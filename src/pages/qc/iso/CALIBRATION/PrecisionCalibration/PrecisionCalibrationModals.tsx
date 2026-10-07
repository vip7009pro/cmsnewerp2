import React, { useState } from "react";
import moment from "moment";
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
  IconButton,
} from "@mui/material";
import {
  AiOutlineClose,
  AiOutlineSave,
  AiOutlineCamera,
  AiOutlineEye,
  AiOutlineCloudDownload,
  AiOutlineFilePdf,
} from "react-icons/ai";
import { Equipment, CalibrationHistory, ImagePreviewState } from "./calibrationTypes";

// 1. Equipment Modal
interface EquipmentModalProps {
  open: boolean;
  isEdit: boolean;
  formData: Partial<Equipment>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Equipment>>>;
  file: File | null;
  setFile: (file: File | null) => void;
  onClose: () => void;
  onSave: () => Promise<void>;
}

export const EquipmentModal: React.FC<EquipmentModalProps> = ({
  open,
  isEdit,
  formData,
  setFormData,
  file,
  setFile,
  onClose,
  onSave,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth className="pc-dialog-custom">
      <DialogTitle>
        <span>{isEdit ? "Cập Nhật Thông Tin Thiết Bị" : "Thêm Mới Thiết Bị Đo Lường"}</span>
        <IconButton size="small" onClick={onClose} disabled={isSaving}>
          <AiOutlineClose size={16} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <div className="pc-form-grid">
          <div className="pc-form-col col-12">
            <TextField
              label="Tên thiết bị *"
              placeholder="VD: Thước cặp điện tử Mitutoyo 150mm"
              size="small"
              fullWidth
              value={formData.EQ_NAME || ""}
              onChange={(e) => setFormData({ ...formData, EQ_NAME: e.target.value })}
            />
          </div>
          <div className="pc-form-col col-6">
            <TextField
              label="Số quản lý (CONTROL_NO) *"
              placeholder="VD: CAL-QC-001"
              size="small"
              fullWidth
              value={formData.CONTROL_NO || ""}
              onChange={(e) => setFormData({ ...formData, CONTROL_NO: e.target.value })}
            />
          </div>
          <div className="pc-form-col col-6">
            <TextField
              label="Số Series / Model"
              placeholder="VD: CD-6 CSX / 500-196-30"
              size="small"
              fullWidth
              value={formData.SERIES_MODEL || ""}
              onChange={(e) => setFormData({ ...formData, SERIES_MODEL: e.target.value })}
            />
          </div>
          <div className="pc-form-col col-6">
            <TextField
              label="Nhà sản xuất (Maker)"
              placeholder="VD: Mitutoyo / Japan"
              size="small"
              fullWidth
              value={formData.MAKER || ""}
              onChange={(e) => setFormData({ ...formData, MAKER: e.target.value })}
            />
          </div>
          <div className="pc-form-col col-6">
            <FormControl size="small" fullWidth>
              <InputLabel>Trạng thái sử dụng</InputLabel>
              <Select
                value={formData.STATUS || "IN_USE"}
                label="Trạng thái sử dụng"
                onChange={(e) => setFormData({ ...formData, STATUS: e.target.value as string })}
              >
                <MenuItem value="IN_USE">Đang sử dụng</MenuItem>
                <MenuItem value="BROKEN">Đã hỏng / Ngừng dùng</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="pc-form-col col-4">
            <TextField
              label="Chu kỳ HC (tháng)"
              type="number"
              size="small"
              fullWidth
              value={formData.CAL_PERIOD || 12}
              onChange={(e) => setFormData({ ...formData, CAL_PERIOD: Number(e.target.value) })}
            />
          </div>
          <div className="pc-form-col col-4">
            <TextField
              label="Bộ phận sử dụng"
              placeholder="VD: QC / SX / KHO"
              size="small"
              fullWidth
              value={formData.DEPARTMENT || ""}
              onChange={(e) => setFormData({ ...formData, DEPARTMENT: e.target.value })}
            />
          </div>
          <div className="pc-form-col col-4">
            <TextField
              label="Vị trí đặt"
              placeholder="VD: Tủ đo lường QC 1"
              size="small"
              fullWidth
              value={formData.LOCATION || ""}
              onChange={(e) => setFormData({ ...formData, LOCATION: e.target.value })}
            />
          </div>

          {/* Photo Dropzone Preview */}
          <div className="pc-form-col col-12">
            <div className="image-dropzone-box">
              <div className="dropzone-preview">
                {file ? (
                  <img
                    src={URL.createObjectURL(file)}
                    className="preview-img"
                    alt="Preview"
                  />
                ) : formData.IMAGE_URL ? (
                  <img
                    src={`/calibration/${formData.IMAGE_URL}`}
                    className="preview-img"
                    alt="Current"
                  />
                ) : (
                  <AiOutlineCamera size={28} color="#94a3b8" />
                )}
                <div className="preview-info">
                  <div className="preview-name">
                    {file ? file.name : formData.IMAGE_URL || "Chưa có ảnh thiết bị"}
                  </div>
                  <span style={{ color: "#94a3b8" }}>
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : "Định dạng JPG, PNG"}
                  </span>
                </div>
              </div>
              <div>
                <input
                  type="file"
                  id="eq-file-picker"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />
                <label htmlFor="eq-file-picker" className="btn-browse">
                  {file || formData.IMAGE_URL ? "Đổi ảnh" : "Chọn ảnh"}
                </label>
              </div>
            </div>
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

// 2. History Modal
interface HistoryModalProps {
  open: boolean;
  isEdit: boolean;
  formData: Partial<CalibrationHistory>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<CalibrationHistory>>>;
  file: File | null;
  setFile: (file: File | null) => void;
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;
  onClose: () => void;
  onSave: () => Promise<void>;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  open,
  isEdit,
  formData,
  setFormData,
  file,
  setFile,
  pdfFile,
  setPdfFile,
  onClose,
  onSave,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handlePeriodChange = (period: number) => {
    const calDate = formData.CAL_DATE || moment().format("YYYY-MM-DD");
    const nextCal = moment(calDate).add(period, "months").format("YYYY-MM-DD");
    setFormData({ ...formData, CAL_PERIOD: period, NEXT_CAL_DATE: nextCal });
  };

  const handleCalDateChange = (calDate: string) => {
    const period = formData.CAL_PERIOD || 12;
    const nextCal = moment(calDate).add(period, "months").format("YYYY-MM-DD");
    setFormData({ ...formData, CAL_DATE: calDate, NEXT_CAL_DATE: nextCal });
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth className="pc-dialog-custom">
      <DialogTitle>
        <span>{isEdit ? "Cập Nhật Lịch Sử Hiệu Chuẩn" : "Thêm Lịch Sử Hiệu Chuẩn Mới"}</span>
        <IconButton size="small" onClick={onClose} disabled={isSaving}>
          <AiOutlineClose size={16} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <div className="pc-form-grid">
          <div className="pc-form-col col-4">
            <TextField
              label="Ngày hiệu chuẩn *"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={formData.CAL_DATE || ""}
              onChange={(e) => handleCalDateChange(e.target.value)}
            />
          </div>
          <div className="pc-form-col col-4">
            <TextField
              label="Chu kỳ (tháng) *"
              type="number"
              size="small"
              fullWidth
              value={formData.CAL_PERIOD || 12}
              onChange={(e) => handlePeriodChange(Number(e.target.value))}
            />
          </div>
          <div className="pc-form-col col-4">
            <TextField
              label="Ngày HC kế tiếp *"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={formData.NEXT_CAL_DATE || ""}
              onChange={(e) => setFormData({ ...formData, NEXT_CAL_DATE: e.target.value })}
            />
          </div>
          <div className="pc-form-col col-12">
            <TextField
              label="Người / Đơn vị hiệu chuẩn *"
              placeholder="VD: TT Kỹ thuật Đo lường 1 (Quatest 1) / Nguyễn Văn A"
              size="small"
              fullWidth
              value={formData.CAL_PERSON || ""}
              onChange={(e) => setFormData({ ...formData, CAL_PERSON: e.target.value })}
            />
          </div>
          <div className="pc-form-col col-12">
            <TextField
              label="Ghi chú kết quả / Số tem"
              placeholder="VD: Sai số trong phạm vi cho phép +-0.02mm. Tem số: CAL-2026-098"
              size="small"
              fullWidth
              multiline
              rows={2}
              value={formData.REMARK || ""}
              onChange={(e) => setFormData({ ...formData, REMARK: e.target.value })}
            />
          </div>

          {/* Stamp Photo Dropzone */}
          <div className="pc-form-col col-12">
            <div className="image-dropzone-box">
              <div className="dropzone-preview">
                {file ? (
                  <img
                    src={URL.createObjectURL(file)}
                    className="preview-img"
                    alt="Preview"
                  />
                ) : formData.STAMP_IMAGE_URL ? (
                  <img
                    src={`/calibration/${formData.STAMP_IMAGE_URL}`}
                    className="preview-img"
                    alt="Current"
                  />
                ) : (
                  <AiOutlineCamera size={28} color="#94a3b8" />
                )}
                <div className="preview-info">
                  <div className="preview-name">
                    {file ? file.name : formData.STAMP_IMAGE_URL || "Chưa có ảnh tem hiệu chuẩn"}
                  </div>
                  <span style={{ color: "#94a3b8" }}>
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : "Chụp hoặc tải ảnh tem"}
                  </span>
                </div>
              </div>
              <div>
                <input
                  type="file"
                  id="stamp-file-picker"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />
                <label htmlFor="stamp-file-picker" className="btn-browse">
                  {file || formData.STAMP_IMAGE_URL ? "Đổi tem" : "Chọn ảnh tem"}
                </label>
              </div>
            </div>
          </div>

          {/* Calibration Result PDF Dropzone */}
          <div className="pc-form-col col-12">
            <div className="pdf-dropzone-box">
              <div className="dropzone-preview">
                <div className="pdf-icon-wrapper">
                  <AiOutlineFilePdf size={28} color="#ef4444" />
                </div>
                <div className="preview-info">
                  <div className="preview-name" title={pdfFile ? pdfFile.name : formData.RESULT_FILE_URL || ""}>
                    {pdfFile
                      ? pdfFile.name
                      : formData.RESULT_FILE_URL
                      ? formData.RESULT_FILE_URL
                      : "Chưa có file kết quả hiệu chuẩn (PDF)"}
                  </div>
                  <span style={{ color: "#94a3b8" }}>
                    {pdfFile
                      ? `${(pdfFile.size / 1024).toFixed(1)} KB (Đã chọn file mới)`
                      : formData.RESULT_FILE_URL
                      ? "File PDF hiện tại"
                      : "Hỗ trợ tệp định dạng .PDF"}
                  </span>
                </div>
              </div>
              <div className="pdf-dropzone-actions">
                {formData.RESULT_FILE_URL && !pdfFile && (
                  <button
                    type="button"
                    className="btn-view-pdf"
                    onClick={() =>
                      window.open(
                        `/calibration/${formData.RESULT_FILE_URL}`,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    Xem PDF
                  </button>
                )}
                {pdfFile && (
                  <button
                    type="button"
                    className="btn-remove-pdf"
                    onClick={() => setPdfFile(null)}
                    title="Hủy file đã chọn"
                  >
                    Hủy chọn
                  </button>
                )}
                <input
                  type="file"
                  id="result-pdf-picker"
                  accept="application/pdf,.pdf"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const selected = e.target.files[0];
                      if (!selected.name.toLowerCase().endsWith(".pdf")) {
                        alert("Vui lòng chọn file định dạng PDF!");
                        return;
                      }
                      setPdfFile(selected);
                    }
                  }}
                />
                <label htmlFor="result-pdf-picker" className="btn-browse-pdf">
                  {pdfFile || formData.RESULT_FILE_URL ? "Đổi file PDF" : "Tải lên PDF"}
                </label>
              </div>
            </div>
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
          {isSaving ? "Đang lưu..." : isEdit ? "Cập Nhật" : "Thêm Lịch Sử"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 3. Full-HD Image Preview Modal
interface ImagePreviewModalProps {
  imagePreview: ImagePreviewState;
  onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  imagePreview,
  onClose,
}) => {
  if (!imagePreview.isOpen) return null;

  const fullUrl = `/calibration/${imagePreview.imageUrl}`;

  return (
    <Dialog
      open={imagePreview.isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="pc-image-modal"
    >
      <div className="preview-modal-content">
        <img src={fullUrl} alt={imagePreview.title} />
      </div>
      <div className="preview-modal-actions">
        <span className="modal-img-title">{imagePreview.title}</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            style={{ color: "#ffffff", borderColor: "#475569" }}
            startIcon={<AiOutlineEye />}
            onClick={() => window.open(fullUrl, "_blank")}
          >
            Mở Tab Mới
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={onClose}
          >
            Đóng
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
