import React from "react";
import { FiX, FiImage } from "react-icons/fi";

interface PrecisionPQC3ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  onClose: () => void;
}

export const PrecisionPQC3ImageModal: React.FC<PrecisionPQC3ImageModalProps> = ({
  isOpen,
  imageUrl,
  title,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="precision-pqc3-image-modal" onClick={onClose}>
      <div
        className="precision-pqc3-image-modal__dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="precision-pqc3-image-modal__header">
          <span className="title">
            <FiImage style={{ verticalAlign: "middle", marginRight: "6px" }} />
            {title || "Xem ảnh lỗi PQC3"}
          </span>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            title="Đóng cửa sổ xem ảnh"
          >
            <FiX />
          </button>
        </div>

        <div className="precision-pqc3-image-modal__body">
          <img
            src={imageUrl}
            alt={title}
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src =
                "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'><rect width='100%' height='100%' fill='%231e293b'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='14'>Chưa có ảnh lỗi hoặc không tìm thấy file</text></svg>";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPQC3ImageModal);
