import React, { useState } from "react";
import {
  FiUser,
  FiFileText,
  FiCheckCircle,
  FiUploadCloud,
  FiSend,
  FiImage,
  FiX,
} from "react-icons/fi";
import { IoQrCodeOutline } from "react-icons/io5";
import { UserData } from "../../../../api/GlobalInterface";
import PrecisionDataSampleSxImagePreviewModal from "./PrecisionDataSampleSxImagePreviewModal";
import PrecisionDataSampleSxImageUploadBox from "./PrecisionDataSampleSxImageUploadBox";

interface PrecisionDataSampleSxFormProps {
  isMobile?: boolean;
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
  isMobile = false,
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
  // State xem to ảnh
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const [modalFileName, setModalFileName] = useState("");
  const [modalFileSize, setModalFileSize] = useState<number | undefined>(undefined);

  const openPreview = (title: string, url: string, name?: string, size?: number) => {
    setModalTitle(title);
    setModalUrl(url);
    setModalFileName(name || "");
    setModalFileSize(size);
    setModalOpen(true);
  };

  return (
    <div className={`precision-datasample__formWrapper ${isMobile ? "is-mobile-form" : ""}`}>
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
            <div className="plan-input-wrap">
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
              {planId && (
                <button
                  type="button"
                  className="btn-clear-input"
                  onClick={() => onPlanIdChange("")}
                  title="Xóa mã chỉ thị"
                >
                  <FiX size={14} />
                </button>
              )}
            </div>

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

      {/* KHỐI 2: THÔNG TIN NHÂN VIÊN THAO TÁC */}
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
              {lineqcEmpl && userData?.EMPL_NO === "NHU1903" && (
                <button
                  type="button"
                  className="btn-clear-input"
                  onClick={() => onLineqcEmplChange("")}
                  title="Xóa mã nhân viên"
                >
                  <FiX size={14} />
                </button>
              )}
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

      {/* KHỐI 3: UPLOAD ẢNH HIỆN TRƯỜNG */}
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
            <PrecisionDataSampleSxImageUploadBox
              title="1. Bản Vẽ Sample (PIC1)"
              icon={<FiImage size={13} color="#2563eb" />}
              file={file1}
              preview={preview1}
              onFileChange={onFile1Change}
              onOpenPreview={openPreview}
            />

            {/* Ảnh 2: Checksheet điều kiện sản xuất (PIC2) */}
            <PrecisionDataSampleSxImageUploadBox
              title="2. Checksheet ĐK SX (PIC2)"
              icon={<FiFileText size={13} color="#059669" />}
              file={file2}
              preview={preview2}
              emeraldTheme={true}
              onFileChange={onFile2Change}
              onOpenPreview={openPreview}
            />
          </div>
        </div>
      </div>

      {/* KHỐI 4: NÚT SUBMIT CHO DESKTOP */}
      {!isMobile && (
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
      )}

      {/* Modal phóng to xem ảnh chi tiết */}
      <PrecisionDataSampleSxImagePreviewModal
        open={modalOpen}
        title={modalTitle}
        imageUrl={modalUrl}
        fileName={modalFileName}
        fileSize={modalFileSize}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export { PrecisionDataSampleSxForm };
export default React.memo(PrecisionDataSampleSxForm);
