import React from "react";

interface PrecisionAUDITImagePreviewModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

const PrecisionAUDITImagePreviewModal: React.FC<PrecisionAUDITImagePreviewModalProps> = ({
  isOpen,
  imageUrl,
  onClose,
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className="precision-audit__modalOverlay" onClick={onClose}>
      <div
        className="precision-audit__imageModalCard"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="precision-audit__modalHeader">
          <span className="modal-title">
            <span className="material-symbols-outlined" style={{ color: "#2563eb" }}>
              image
            </span>
            <span>XEM ẢNH BẰNG CHỨNG KIỂM TOÁN</span>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="precision-audit__btn precision-audit__btn--outline"
              style={{ height: 22, fontSize: 10 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>open_in_new</span>
              <span>Mở Tab Mới</span>
            </a>
            <button type="button" className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div style={{ padding: 12, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src={imageUrl} alt="Evident Large Preview" className="preview-img" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionAUDITImagePreviewModal);
