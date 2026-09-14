import React, { useState, useEffect, useCallback } from "react";
import {
  IoFlaskOutline,
  IoCloseOutline,
  IoPencilOutline,
  IoInformationCircleOutline,
  IoKeyOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";

interface PrecisionAddTestItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestedCode: number;
  onSubmit: (code: number, name: string) => Promise<boolean>;
}

const PrecisionAddTestItemModal: React.FC<PrecisionAddTestItemModalProps> = ({
  isOpen,
  onClose,
  suggestedCode,
  onSubmit,
}) => {
  const [testCode, setTestCode] = useState<number>(suggestedCode);
  const [testName, setTestName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Đồng bộ khi modal mở ra
  useEffect(() => {
    if (isOpen) {
      setTestCode(suggestedCode);
      setTestName("");
      setIsSubmitting(false);
    }
  }, [isOpen, suggestedCode]);

  const handleSubmit = useCallback(async () => {
    if (!testName.trim()) return;
    setIsSubmitting(true);
    const success = await onSubmit(testCode, testName);
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  }, [testCode, testName, onSubmit, onClose]);

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
            <div className="precision-testtable__modalIcon precision-testtable__modalIcon--emerald">
              <IoFlaskOutline />
            </div>
            <div className="precision-testtable__modalTitles">
              <h2 className="precision-testtable__modalTitle">THÊM HẠNG MỤC ĐO MỚI</h2>
              <span className="precision-testtable__modalSubtitle">
                Khởi tạo mã định danh và tên tiêu chuẩn kiểm tra độ tin cậy
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

        {/* Modal Body */}
        <div className="precision-testtable__modalBody">
          {/* Field: Mã Hạng Mục (TEST_CODE) */}
          <div className="precision-testtable__formGroup">
            <div className="precision-testtable__formLabelGroup">
              <label className="precision-testtable__formLabel">MÃ HẠNG MỤC (TEST CODE)</label>
              <span className="precision-testtable__formHintBadge">GỢI Ý TỰ ĐỘNG</span>
            </div>
            <div className="precision-testtable__inputWrapper">
              <IoKeyOutline className="input-icon" />
              <input
                type="number"
                className="font-mono"
                value={testCode}
                onChange={(e) => setTestCode(Number(e.target.value))}
                placeholder="Nhập mã số hạng mục..."
              />
            </div>
          </div>

          {/* Field: Tên Hạng Mục (TEST_NAME) */}
          <div className="precision-testtable__formGroup">
            <div className="precision-testtable__formLabelGroup">
              <label className="precision-testtable__formLabel">
                TÊN HẠNG MỤC KIỂM TRA <span style={{ color: "#ef4444" }}>*</span>
              </label>
            </div>
            <div className="precision-testtable__inputWrapper">
              <IoPencilOutline className="input-icon" />
              <input
                type="text"
                autoFocus
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Ví dụ: Đo quang phổ XRF, Độ bền uốn kéo, Nhiệt độ nóng chảy..."
              />
            </div>
          </div>

          {/* Hộp hướng dẫn nhanh */}
          <div className="precision-testtable__guidanceBox">
            <IoInformationCircleOutline className="icon" />
            <div>
              Mã hạng mục là khóa định danh duy nhất trong CSDL. Tên hạng mục nên ngắn gọn, phản ánh rõ thiết bị đo hoặc tiêu chuẩn đánh giá.
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
            className="precision-testtable__btnSubmit precision-testtable__btnSubmit--emerald"
            onClick={handleSubmit}
            disabled={isSubmitting || !testName.trim()}
          >
            <IoCheckmarkOutline size={16} />
            <span>{isSubmitting ? "Đang lưu..." : "LƯU HẠNG MỤC"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionAddTestItemModal);
