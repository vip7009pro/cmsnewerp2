import React, { useRef } from "react";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiUploadCloud,
  FiTrash2,
  FiSend,
  FiFileText,
  FiCamera,
  FiLayers,
  FiBox,
  FiRefreshCw,
} from "react-icons/fi";
import { IoQrCodeOutline } from "react-icons/io5";
import { UserData } from "../../../../api/GlobalInterface";
import { SX_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

interface PrecisionLineQcFormProps {
  factory: string;
  planId: string;
  gName: string;
  gCode: string;
  prodRequestNo: string;
  processLotNo: string;
  inputNo: string;
  mName: string;
  widthCd: number;
  inCfmQty: number;
  ktdtc: string;
  sxData: SX_DATA[];
  lineqcEmpl: string;
  emplName: string;
  remark: string;
  file: File | null;
  preview: string | null;
  isSubmitting: boolean;
  isLoadingPlan: boolean;
  userData?: UserData;
  planInputRef: React.RefObject<HTMLInputElement>;
  emplInputRef: React.RefObject<HTMLInputElement>;
  onFactoryChange: (val: string) => void;
  onPlanIdChange: (val: string) => void;
  onLineqcEmplChange: (val: string) => void;
  onRemarkChange: (val: string) => void;
  onOpenScanner: () => void;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
  onReset: () => void;
}

const PrecisionLineQcForm: React.FC<PrecisionLineQcFormProps> = ({
  factory,
  planId,
  gName,
  gCode,
  prodRequestNo,
  processLotNo,
  inputNo,
  mName,
  widthCd,
  inCfmQty,
  ktdtc,
  sxData,
  lineqcEmpl,
  emplName,
  remark,
  file,
  preview,
  isSubmitting,
  isLoadingPlan,
  userData,
  planInputRef,
  emplInputRef,
  onFactoryChange,
  onPlanIdChange,
  onLineqcEmplChange,
  onRemarkChange,
  onOpenScanner,
  onFileChange,
  onSubmit,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectedFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) onFileChange(selectedFile);
  };

  const currentSx = sxData.length > 0 ? sxData[0] : null;
  const isSettingReady = Boolean(currentSx && currentSx.MASS_START_TIME);

  return (
    <div className="precision-lineqc__formWrapper">
      {/* KHỐI 1: CHỌN NHÀ MÁY & QUÉT CHỈ THỊ (PLAN_ID) - TỐI ƯU COMPACT */}
      <div className="mobile-action-card mobile-action-card--compact">
        <div className="mobile-action-card__body">
          {/* Hàng 1: Chọn nhà máy + Nút Làm mới form */}
          <div className="plan-top-bar">
            <div className="factory-toggle-compact">
              <span className="compact-label">NM:</span>
              <button
                type="button"
                className={`factory-pill ${factory === "NM1" ? "active" : ""}`}
                disabled={userData?.EMPL_NO !== "NHU1903"}
                onClick={() => onFactoryChange("NM1")}
              >
                NM1
              </button>
              <button
                type="button"
                className={`factory-pill ${factory === "NM2" ? "active" : ""}`}
                disabled={userData?.EMPL_NO !== "NHU1903"}
                onClick={() => onFactoryChange("NM2")}
              >
                NM2
              </button>
            </div>

            {/* Trạng thái setting badge ngay trên top bar */}
            {planId && !isLoadingPlan && sxData.length > 0 && (
              <div className={`status-pill-mini ${isSettingReady ? "status-pill-mini--ok" : "status-pill-mini--ng"}`}>
                {isSettingReady ? "Setting OK" : "Chưa Setting"}
              </div>
            )}

            <button
              type="button"
              className="btn-compact-reset"
              onClick={onReset}
              title="Làm mới form nhập liệu"
            >
              <FiRefreshCw size={12} />
              <span>Làm mới</span>
            </button>
          </div>

          {/* Hàng 2: Ô nhập chỉ thị & Nút Quét Barcode/QR */}
          <div className="plan-input-group">
            <input
              ref={planInputRef}
              type="text"
              className="plan-text-input font-mono"
              placeholder="Nhập hoặc quét mã chỉ thị..."
              value={planId}
              onChange={(e) => onPlanIdChange(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  emplInputRef.current?.focus();
                }
              }}
            />
            <button
              type="button"
              className="btn-scan-qr"
              onClick={onOpenScanner}
              title="Bật Camera Quét Barcode / QR Code"
            >
              <IoQrCodeOutline size={17} />
              <span>Quét</span>
            </button>
          </div>

          {/* Banner thông tin sản phẩm & máy dập hiển thị dạng 2 cột gọn */}
          {gName ? (
            <div className="product-info-compact">
              <div className="product-name-badge">
                <span className="g-name">{gName}</span>
                <span className="g-code font-mono">{gCode}</span>
              </div>
              <div className="product-chips-row">
                <span className="chip-item">YCSX: <strong className="font-mono">{prodRequestNo || "-"}</strong></span>
                <span className="chip-item">Máy: <strong className="font-mono text-sky-700">{currentSx?.EQ_NAME_TT || currentSx?.PLAN_EQ || "Chưa có"}</strong></span>
                <span className="chip-item">CĐ: <strong className="font-mono">{currentSx?.PROCESS_NUMBER ?? "-"}</strong></span>
                {currentSx?.MASS_START_TIME && (
                  <span className="chip-item chip-item--ok">Bắn lúc: <strong className="font-mono">{currentSx.MASS_START_TIME}</strong></span>
                )}
              </div>
            </div>
          ) : (
            (isLoadingPlan || planId.length >= 8) && (
              <div className="product-info-banner product-info-banner--pending">
                <span className="loading-spinner-inline"></span>
                <span>Đang tra cứu dữ liệu sản xuất cho chỉ thị {planId}...</span>
              </div>
            )
          )}

          {/* Cảnh báo tình trạng Setting */}
          {!isLoadingPlan && sxData.length > 0 && !isSettingReady && (
            <div className="setting-alert-compact setting-alert-compact--warning">
              <FiAlertCircle size={14} />
              <span>Cảnh báo: Chỉ thị chưa bắn Setting/Bắt đầu dập Mass!</span>
            </div>
          )}
        </div>
      </div>

      {/* KHỐI 2: THÔNG SỐ NVL VÀ NHÂN SỰ LINE QC - GHÉP GỌN 1 CARD */}
      <div className="mobile-action-card mobile-action-card--compact">
        <div className="mobile-action-card__body">
          {/* Thông số NVL nếu có planId */}
          {planId && (
            <div className="material-compact-wrap">
              <div className="material-header-row">
                <span className="section-mini-title">Thông số NVL:</span>
                <span className={`status-pill-mini ${ktdtc === "DKT" ? "status-pill-mini--ok" : "status-pill-mini--warn"}`}>
                  {ktdtc === "DKT" ? "DTC: Đã KT" : "DTC: Chưa KT"}
                </span>
              </div>
              <div className="material-mini-grid">
                <div className="mini-item">
                  <span className="mini-label"><FiBox size={10} /> Lot:</span>
                  <strong className="mini-val font-mono">{processLotNo || "-"}</strong>
                </div>
                <div className="mini-item">
                  <span className="mini-label"><FiLayers size={10} /> M_LOT:</span>
                  <strong className="mini-val font-mono">{inputNo || "-"}</strong>
                </div>
                <div className="mini-item mini-item--full">
                  <span className="mini-label">NVL:</span>
                  <strong className="mini-val">{mName || "Chưa có NVL"}</strong>
                </div>
                <div className="mini-item">
                  <span className="mini-label">Khổ:</span>
                  <strong className="mini-val font-mono">{widthCd ? `${widthCd}mm` : "-"}</strong>
                </div>
                <div className="mini-item">
                  <span className="mini-label">Cấp:</span>
                  <strong className="mini-val font-mono">{inCfmQty ? `${inCfmQty.toLocaleString("en-US")}m` : "-"}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Thông tin nhân sự (Hàng 1) và Ghi chú (Hàng 2 xuống dòng) */}
          <div className="qc-empl-compact-group">
            <div className="empl-input-row">
              <span className="compact-label">Mã QC:</span>
              <input
                ref={emplInputRef}
                type="text"
                className="empl-compact-input font-mono"
                placeholder="Mã QC..."
                value={lineqcEmpl}
                disabled={userData?.EMPL_NO !== "NHU1903"}
                onChange={(e) => onLineqcEmplChange(e.target.value.toUpperCase())}
              />
              {emplName && (
                <div className="empl-name-pill" title={emplName}>
                  <span className="empl-name-text">{emplName}</span>
                </div>
              )}
            </div>

            <div className="remark-input-row">
              <input
                type="text"
                className="remark-compact-input"
                placeholder="Ghi chú Line QC (nếu có)..."
                value={remark}
                onChange={(e) => onRemarkChange(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* KHỐI 3: CHỤP / TẢI ẢNH CHECKSHEET VÀ NÚT GỬI LIỀN KỀ */}
      <div className="mobile-action-card mobile-action-card--compact">
        <div className="mobile-action-card__body upload-card-body">
          <div className={`upload-box-compact ${file ? "has-file" : ""}`}>
            {preview ? (
              <div className="upload-preview-compact">
                <img src={preview} alt="Checksheet preview" className="preview-img-compact" />
                <div className="preview-info-compact">
                  <span className="file-name-compact">{file?.name}</span>
                  <span className="file-size-compact font-mono">
                    {((file?.size ?? 0) / 1024).toFixed(0)} KB
                  </span>
                </div>
                <div className="preview-actions-compact">
                  <button
                    type="button"
                    className="btn-rechoose-compact"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FiFileText size={12} />
                    <span>Chọn file</span>
                  </button>
                  <button
                    type="button"
                    className="btn-rechoose-compact btn-camera-compact"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <FiCamera size={12} />
                    <span>Chụp lại</span>
                  </button>
                  <button
                    type="button"
                    className="btn-remove-compact"
                    onClick={() => {
                      onFileChange(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    <FiTrash2 size={12} />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="upload-dropzone-compact">
                <div className="dropzone-icon-compact">
                  <FiFileText size={20} />
                </div>
                <div className="dropzone-text-group">
                  <span className="dropzone-text-main">Chọn ảnh checksheet Line QC</span>
                  <span className="dropzone-text-sub">Có thể chọn file từ máy hoặc chụp ảnh trực tiếp</span>
                </div>
                <div className="upload-choice-actions">
                  <button
                    type="button"
                    className="btn-upload-choice btn-upload-choice--file"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FiFileText size={14} />
                    <span>Chọn file</span>
                  </button>
                  <button
                    type="button"
                    className="btn-upload-choice btn-upload-choice--camera"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <FiCamera size={14} />
                    <span>Chụp ảnh</span>
                  </button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden-file-input"
              onChange={handleSelectedFile}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden-file-input"
              onChange={handleSelectedFile}
            />
          </div>

          {/* Nút gửi dữ liệu full-width ngay dưới ô chụp ảnh */}
          <button
            type="button"
            className={`btn-submit-compact ${isSubmitting ? "is-loading" : ""}`}
            disabled={!gName || !isSettingReady || isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? (
              <>
                <FiUploadCloud size={18} className="animate-spin" />
                <span>Đang Lưu Dữ Liệu & Tải Checksheet...</span>
              </>
            ) : (
              <>
                <FiSend size={18} />
                <span>GỬI DỮ LIỆU & TẢI CHECKSHEET LINE QC</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export { PrecisionLineQcForm };
export default React.memo(PrecisionLineQcForm);
