import React from "react";
import { FiX, FiImage, FiCpu, FiClock, FiUser } from "react-icons/fi";
import { PatrolModalData } from "./usePatrolData";

interface PrecisionPatrolModalProps {
  data: PatrolModalData;
  onClose: () => void;
}

export const PrecisionPatrolModal: React.FC<PrecisionPatrolModalProps> = ({
  data,
  onClose,
}) => {
  if (!data.isOpen) return null;

  return (
    <div className="precision-patrol-modal" onClick={onClose}>
      <div
        className="precision-patrol-modal__dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="precision-patrol-modal__header">
          <span className="title">
            <FiImage style={{ verticalAlign: "middle", marginRight: "6px" }} />
            {data.title || "Chi tiết ảnh sự cố chất lượng"}
          </span>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            title="Đóng cửa sổ"
          >
            <FiX />
          </button>
        </div>

        <div className="precision-patrol-modal__body">
          <img
            src={data.imageUrl}
            alt={data.title}
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src =
                "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect width='100%' height='100%' fill='%230f172a'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-family='sans-serif' font-size='14'>Chưa có ảnh sự cố hoặc file không tồn tại</text></svg>";
            }}
          />

          <div className="modal-info-strip">
            <span>
              <FiCpu style={{ verticalAlign: "middle", marginRight: "3px" }} />
              Thiết bị: <strong>{data.eq || "---"} ({data.factory || ""})</strong>
            </span>
            <span>
              Sự cố: <strong style={{ color: "#fb7185" }}>{data.defect || "---"}</strong>
            </span>
            {data.ngRate && (
              <span>
                Tỷ lệ: <strong style={{ color: "#f59e0b" }}>{data.ngRate}</strong>
              </span>
            )}
            {data.time && (
              <span>
                <FiClock style={{ verticalAlign: "middle", marginRight: "3px" }} />
                Thời gian: <strong>{data.time}</strong>
              </span>
            )}
            {data.emplNo && (
              <span>
                <FiUser style={{ verticalAlign: "middle", marginRight: "3px" }} />
                Mã NV: <strong>{data.emplNo}</strong>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPatrolModal);
