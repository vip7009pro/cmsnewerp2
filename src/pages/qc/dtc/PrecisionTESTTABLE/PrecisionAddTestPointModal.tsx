import React, { useState, useEffect, useCallback } from "react";
import {
  IoLocateOutline,
  IoCloseOutline,
  IoPencilOutline,
  IoInformationCircleOutline,
  IoKeyOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";
import { TestListTable } from "../../interfaces/qcInterface";

interface PrecisionAddTestPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: TestListTable | null;
  suggestedPointCode: number;
  onSubmit: (pointCode: number, pointName: string) => Promise<boolean>;
}

const PrecisionAddTestPointModal: React.FC<PrecisionAddTestPointModalProps> = ({
  isOpen,
  onClose,
  selectedItem,
  suggestedPointCode,
  onSubmit,
}) => {
  const [pointCode, setPointCode] = useState<number>(suggestedPointCode);
  const [pointName, setPointName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Đồng bộ khi modal mở ra
  useEffect(() => {
    if (isOpen) {
      setPointCode(suggestedPointCode);
      setPointName("");
      setIsSubmitting(false);
    }
  }, [isOpen, suggestedPointCode]);

  const handleSubmit = useCallback(async () => {
    if (!pointName.trim() || !selectedItem) return;
    setIsSubmitting(true);
    const success = await onSubmit(pointCode, pointName);
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  }, [pointCode, pointName, selectedItem, onSubmit, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="precision-testtable__modalOverlay" onClick={onClose}>
      <div
        className="precision-testtable__modalCard"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Modal Header */}
        <div className="precision-testtable__modalHeader">
          <div className="precision-testtable__modalHeaderLeft">
            <div className="precision-testtable__modalIcon precision-testtable__modalIcon--indigo">
              <IoLocateOutline />
            </div>
            <div className="precision-testtable__modalTitles">
              <h2 className="precision-testtable__modalTitle">THÊM ĐIỂM ĐO MỚI</h2>
              <span className="precision-testtable__modalSubtitle">
                Cấu hình điểm kiểm tra chi tiết theo hạng mục đo độ tin cậy
              </span>
            </div>
          </div>
          <button
            type="button"
            className="precision-testtable__modalClose"
            onClick={onClose}
            title="Đóng cửa sổ (Esc)"
          >
            <IoCloseOutline />
          </button>
        </div>

        {/* Active Test Item Context Banner */}
        {selectedItem && (
          <div className="precision-testtable__modalContext">
            <span className="label">HẠNG MỤC LIÊN KẾT:</span>
            <span className="value">
              [{selectedItem.TEST_CODE}] {selectedItem.TEST_NAME}
            </span>
          </div>
        )}

        {/* Modal Body */}
        <div className="precision-testtable__modalBody">
          {/* Field: Mã Điểm Đo (POINT_CODE) */}
          <div className="precision-testtable__formGroup">
            <div className="precision-testtable__formLabelGroup">
              <label className="precision-testtable__formLabel">MÃ ĐIỂM ĐO (POINT CODE)</label>
              <span className="precision-testtable__formHintBadge">GỢI Ý TỰ ĐỘNG</span>
            </div>
            <div className="precision-testtable__inputWrapper">
              <IoKeyOutline className="input-icon" />
              <input
                type="number"
                className="font-mono"
                value={pointCode}
                onChange={(e) => setPointCode(Number(e.target.value))}
                placeholder="Nhập mã số điểm đo..."
              />
            </div>
          </div>

          {/* Field: Tên Điểm Đo (POINT_NAME) */}
          <div className="precision-testtable__formGroup">
            <div className="precision-testtable__formLabelGroup">
              <label className="precision-testtable__formLabel">
                TÊN ĐIỂM ĐO (POINT NAME) <span style={{ color: "#ef4444" }}>*</span>
              </label>
            </div>
            <div className="precision-testtable__inputWrapper">
              <IoPencilOutline className="input-icon" />
              <input
                type="text"
                autoFocus
                value={pointName}
                onChange={(e) => setPointName(e.target.value)}
                placeholder="Ví dụ: P1, P2, Br, Pb, Chiều dày mép, Độ lệch tâm..."
              />
            </div>
          </div>

          {/* Hộp hướng dẫn nhanh */}
          <div className="precision-testtable__guidanceBox">
            <IoInformationCircleOutline className="icon" />
            <div>
              Mỗi điểm đo đại diện cho một vị trí hoặc thông số vật lý cần đo thực tế (vd: P1, P2, hàm lượng chất, kích thước...) khi nhân viên QC tiến hành đo đạc.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="precision-testtable__modalFooter">
          <button
            type="button"
            className="precision-testtable__btnCancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            className="precision-testtable__btnSubmit precision-testtable__btnSubmit--indigo"
            onClick={handleSubmit}
            disabled={isSubmitting || !pointName.trim()}
          >
            <IoCheckmarkOutline size={16} />
            <span>{isSubmitting ? "Đang lưu..." : "LƯU ĐIỂM ĐO"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionAddTestPointModal);
