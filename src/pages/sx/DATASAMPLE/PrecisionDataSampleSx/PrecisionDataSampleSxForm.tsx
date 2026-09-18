import React, { useRef } from "react";
import {
  FiUser,
  FiFileText,
  FiCheckCircle,
  FiUploadCloud,
  FiTrash2,
  FiSend,
  FiImage,
  FiCamera,
} from "react-icons/fi";
import { IoQrCodeOutline } from "react-icons/io5";
import { UserData } from "../../../../api/GlobalInterface";

interface PrecisionDataSampleSxFormProps {
  planId: string;
  gName: string;
  gCode: string;
  lineqcEmpl: string;
  emplName: string;
  file1: File | null;
  file2: File | null;
  preview1: string | null;
  preview2: string | null;
  isSubmitting: boolean;
  userData?: UserData;
  planInputRef: React.RefObject<HTMLInputElement>;
  emplInputRef: React.RefObject<HTMLInputElement>;
  onPlanIdChange: (val: string) => void;
  onLineqcEmplChange: (val: string) => void;
  onOpenScanner: () => void;
  onFile1Change: (file: File | null) => void;
  onFile2Change: (file: File | null) => void;
  onSubmit: () => void;
}

const PrecisionDataSampleSxForm: React.FC<PrecisionDataSampleSxFormProps> = ({
  planId,
  gName,
  gCode,
  lineqcEmpl,
  emplName,
  file1,
  file2,
  preview1,
  preview2,
  isSubmitting,
  userData,
  planInputRef,
  emplInputRef,
  onPlanIdChange,
  onLineqcEmplChange,
  onOpenScanner,
  onFile1Change,
  onFile2Change,
  onSubmit,
}) => {
  const fileInputRef1 = useRef<HTMLInputElement | null>(null);
  const fileInputRef2 = useRef<HTMLInputElement | null>(null);

  return (
    <div className="precision-datasample__formWrapper">
      {/* KHỐI 1: NHẬP & QUÉT SỐ CHỈ THỊ (PLAN_ID) */}
      <div className="mobile-action-card">
        <div className="mobile-action-card__header">
          <div className="card-title">
            <span className="step-number">1</span>
            <span>Số Chỉ Thị Kế Hoạch Sản Xuất (PLAN_ID)</span>
          </div>
          <span className="required-badge">Bắt buộc</span>
        </div>

        <div className="mobile-action-card__body">
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
              <IoQrCodeOutline size={18} />
              <span>Quét Mã</span>
            </button>
          </div>

          {/* Banner thông tin sản phẩm nhận diện được */}
          {gName ? (
            <div className="product-info-banner product-info-banner--success">
              <div className="product-info-banner__left">
                <FiCheckCircle size={18} className="icon-success" />
                <div className="product-details">
                  <div className="product-name">{gName}</div>
                  <div className="product-code font-mono">Code: {gCode}</div>
                </div>
              </div>
              <span className="status-pill status-pill--valid">Hợp lệ</span>
            </div>
          ) : (
            planId.length >= 6 && (
              <div className="product-info-banner product-info-banner--pending">
                <span>Đang tra cứu thông tin sản phẩm từ chỉ thị {planId}...</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* KHỐI 2: THÔNG TIN NHÂN VIÊN THAO TÁC (LINE QC / SX) */}
      <div className="mobile-action-card">
        <div className="mobile-action-card__header">
          <div className="card-title">
            <span className="step-number">2</span>
            <span>Nhân Viên Thao Tác & Khai Báo</span>
          </div>
          <span className="required-badge">Bắt buộc</span>
        </div>

        <div className="mobile-action-card__body">
          <div className="empl-input-group">
            <div className="input-icon-wrap">
              <FiUser size={15} />
              <input
                ref={emplInputRef}
                type="text"
                className="empl-text-input font-mono"
                placeholder="Mã nhân viên (VD: NHU1903)..."
                value={lineqcEmpl}
                disabled={userData?.EMPL_NO !== "NHU1903"}
                onChange={(e) => onLineqcEmplChange(e.target.value.toUpperCase())}
              />
            </div>
            {emplName && (
              <div className="empl-name-tag">
                <span className="empl-label">Họ tên:</span>
                <strong className="empl-full">{emplName}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KHỐI 3: UPLOAD ẢNH HIỆN TRƯỜNG (BẢN VẼ & CHECKSHEET) */}
      <div className="mobile-action-card">
        <div className="mobile-action-card__header">
          <div className="card-title">
            <span className="step-number">3</span>
            <span>Chụp / Tải Lên 2 Ảnh Chứng Nhận Hiện Trường</span>
          </div>
          <span className="required-badge">Tối thiểu 1 ảnh</span>
        </div>

        <div className="mobile-action-card__body">
          <div className="image-upload-grid">
            {/* Ảnh 1: Bản vẽ sản xuất sample (PIC1) */}
            <div className={`upload-box ${file1 ? "has-file" : ""}`}>
              <div className="upload-box__header">
                <div className="box-title">
                  <FiImage size={13} color="#2563eb" />
                  <span>1. Bản Vẽ Sản Xuất Sample (PIC1)</span>
                </div>
                {file1 && (
                  <button
                    type="button"
                    className="btn-remove-file"
                    onClick={() => {
                      onFile1Change(null);
                      if (fileInputRef1.current) fileInputRef1.current.value = "";
                    }}
                    title="Xóa ảnh này"
                  >
                    <FiTrash2 size={12} />
                    <span>Xóa</span>
                  </button>
                )}
              </div>

              {preview1 ? (
                <div className="upload-preview-area">
                  <img src={preview1} alt="Bản vẽ sample preview" className="preview-img" />
                  <div className="preview-meta">
                    <span className="file-name">{file1?.name}</span>
                    <span className="file-size font-mono">
                      {((file1?.size ?? 0) / 1024).toFixed(0)} KB
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-rechoose"
                    onClick={() => fileInputRef1.current?.click()}
                  >
                    <FiCamera size={12} />
                    <span>Chụp / Chọn lại</span>
                  </button>
                </div>
              ) : (
                <div
                  className="upload-dropzone"
                  onClick={() => fileInputRef1.current?.click()}
                >
                  <div className="dropzone-icon">
                    <FiCamera size={24} />
                  </div>
                  <span className="dropzone-text">Chạm để chụp hoặc chọn ảnh bản vẽ</span>
                  <span className="dropzone-sub">Định dạng JPG / JPEG</span>
                </div>
              )}

              <input
                ref={fileInputRef1}
                type="file"
                accept="image/jpeg,image/jpg"
                capture="environment"
                className="hidden-file-input"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onFile1Change(e.target.files[0]);
                  }
                }}
              />
            </div>

            {/* Ảnh 2: Checksheet điều kiện sản xuất (PIC2) */}
            <div className={`upload-box ${file2 ? "has-file" : ""}`}>
              <div className="upload-box__header">
                <div className="box-title">
                  <FiFileText size={13} color="#059669" />
                  <span>2. Checksheet Điều Kiện SX (PIC2)</span>
                </div>
                {file2 && (
                  <button
                    type="button"
                    className="btn-remove-file"
                    onClick={() => {
                      onFile2Change(null);
                      if (fileInputRef2.current) fileInputRef2.current.value = "";
                    }}
                    title="Xóa ảnh này"
                  >
                    <FiTrash2 size={12} />
                    <span>Xóa</span>
                  </button>
                )}
              </div>

              {preview2 ? (
                <div className="upload-preview-area">
                  <img src={preview2} alt="Checksheet SX preview" className="preview-img" />
                  <div className="preview-meta">
                    <span className="file-name">{file2?.name}</span>
                    <span className="file-size font-mono">
                      {((file2?.size ?? 0) / 1024).toFixed(0)} KB
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-rechoose"
                    onClick={() => fileInputRef2.current?.click()}
                  >
                    <FiCamera size={12} />
                    <span>Chụp / Chọn lại</span>
                  </button>
                </div>
              ) : (
                <div
                  className="upload-dropzone"
                  onClick={() => fileInputRef2.current?.click()}
                >
                  <div className="dropzone-icon dropzone-icon--emerald">
                    <FiCamera size={24} />
                  </div>
                  <span className="dropzone-text">Chạm để chụp hoặc chọn checksheet</span>
                  <span className="dropzone-sub">Định dạng JPG / JPEG</span>
                </div>
              )}

              <input
                ref={fileInputRef2}
                type="file"
                accept="image/jpeg,image/jpg"
                capture="environment"
                className="hidden-file-input"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onFile2Change(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* KHỐI 4: NÚT BẤM HOÀN TẤT GỬI DỮ LIỆU CÔNG THÁI HỌC */}
      <div className="mobile-action-card mobile-action-card--submit">
        <button
          type="button"
          className={`btn-submit-sample ${isSubmitting ? "is-loading" : ""}`}
          disabled={!gName || isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? (
            <>
              <FiUploadCloud size={20} className="animate-spin" />
              <span>Đang Lưu Dữ Liệu & Tải Ảnh Lên...</span>
            </>
          ) : (
            <>
              <FiSend size={20} />
              <span>LƯU DỮ LIỆU & TẢI ẢNH SAMPLE</span>
            </>
          )}
        </button>
        <div className="submit-hint">
          Sau khi bấm, ảnh sẽ tự động được gán theo mã chỉ thị và lưu trữ trên hệ thống máy chủ QA/SX
        </div>
      </div>
    </div>
  );
};

export { PrecisionDataSampleSxForm };
export default React.memo(PrecisionDataSampleSxForm);
