import React from "react";
import { FiX, FiImage, FiCheck, FiInfo } from "react-icons/fi";
import { ModalImageData } from "./useMainDefectsData";

interface PrecisionMainDefectsModalProps {
  modalData: ModalImageData | null;
  onClose: () => void;
}

const PrecisionMainDefectsModal: React.FC<PrecisionMainDefectsModalProps> = ({
  modalData,
  onClose,
}) => {
  if (!modalData) return null;

  const { imageSrc, title, item } = modalData;

  return (
    <div className="precision-maindefects__modalBackdrop" onClick={onClose}>
      <div
        className="precision-maindefects__modalDialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <FiImage color="#2563eb" />
            <span>{title}</span>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            title="Đóng cửa sổ"
          >
            <FiX />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="image-container">
            <img
              src={imageSrc}
              alt={item.DEFECT || item.G_CODE}
              onError={(e: any) => {
                e.currentTarget.alt = "Không tìm thấy file ảnh trên máy chủ";
              }}
            />
          </div>

          {/* Context details */}
          <div className="modal-details">
            <div className="detail-item">
              <span className="label">Mã Hàng (G_CODE):</span>
              <span className="value">{item.G_CODE} ({item.G_NAME || "-"})</span>
            </div>

            <div className="detail-item">
              <span className="label">Dòng Model (PROD_MODEL):</span>
              <span className="value">{item.PROD_MODEL || "-"}</span>
            </div>

            <div className="detail-item">
              <span className="label">Hạng Mục Lỗi (DEFECT):</span>
              <span className="value" style={{ color: "#b91c1c" }}>
                {item.DEFECT || "-"}
              </span>
            </div>

            <div className="detail-item">
              <span className="label">Công Đoạn (PROCESS_NUMBER):</span>
              <span className="value">Công Đoạn {item.PROCESS_NUMBER ?? "-"}</span>
            </div>

            <div className="detail-item">
              <span className="label">Hạng Mục Kiểm Tra (TEST_ITEM):</span>
              <span className="value">{item.TEST_ITEM || "-"}</span>
            </div>

            <div className="detail-item">
              <span className="label">Phương Pháp Kiểm Tra (TEST_METHOD):</span>
              <span className="value">{item.TEST_METHOD || "-"}</span>
            </div>

            <div className="detail-item">
              <span className="label">Mô Tả Quy Cách (DESCR):</span>
              <span className="value">{item.DESCR || "-"}</span>
            </div>

            <div className="detail-item">
              <span className="label">Trạng Thái Hiệu Lực:</span>
              <span className="value">
                {item.USE_YN === "Y" ? "Đang Áp Dụng (Active)" : "Tạm Dừng (Inactive)"}
              </span>
            </div>

            <div className="detail-item">
              <span className="label">Người Tạo / Ngày Tạo:</span>
              <span className="value">
                {item.INS_EMPL || "-"} • {item.INS_DATE || "-"}
              </span>
            </div>

            <div className="detail-item">
              <span className="label">Người Sửa / Ngày Sửa:</span>
              <span className="value">
                {item.UPD_EMPL || "-"} • {item.UPD_DATE || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="btn-dismiss" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionMainDefectsModal);
