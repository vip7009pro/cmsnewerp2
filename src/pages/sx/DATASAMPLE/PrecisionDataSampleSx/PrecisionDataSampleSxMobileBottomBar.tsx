import React from "react";
import { FiSend, FiUploadCloud, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

interface PrecisionDataSampleSxMobileBottomBarProps {
  isValid: boolean;
  isSubmitting: boolean;
  hasPlan: boolean;
  hasEmpl: boolean;
  fileCount: number;
  onSubmit: () => void;
}

const PrecisionDataSampleSxMobileBottomBar: React.FC<PrecisionDataSampleSxMobileBottomBarProps> = ({
  isValid,
  isSubmitting,
  hasPlan,
  hasEmpl,
  fileCount,
  onSubmit,
}) => {
  // Chuẩn bị thông báo trạng thái
  let statusText = "Chờ nhập dữ liệu";
  let statusType: "pending" | "ready" = "pending";

  if (!hasPlan) {
    statusText = "Nhập / quét mã chỉ thị";
  } else if (!hasEmpl) {
    statusText = "Nhập mã nhân viên";
  } else if (fileCount === 0) {
    statusText = "Chụp / chọn ít nhất 1 ảnh";
  } else {
    statusText = `Sẵn sàng gửi (${fileCount}/2 ảnh)`;
    statusType = "ready";
  }

  return (
    <div className="precision-datasample-mobile-bottombar">
      <div className="bottombar-inner">
        {/* Thanh trạng thái nhỏ gọn */}
        <div className={`bottombar-status ${statusType === "ready" ? "is-ready" : ""}`}>
          {statusType === "ready" ? (
            <FiCheckCircle size={14} className="icon-status" />
          ) : (
            <FiAlertCircle size={14} className="icon-status" />
          )}
          <span className="status-label">{statusText}</span>
        </div>

        {/* Nút bấm Submit lớn công thái học */}
        <button
          type="button"
          className={`btn-mobile-submit ${isSubmitting ? "is-submitting" : ""}`}
          disabled={!isValid || isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? (
            <>
              <FiUploadCloud size={18} className="animate-spin" />
              <span>ĐANG GỬI DỮ LIỆU...</span>
            </>
          ) : (
            <>
              <FiSend size={18} />
              <span>LƯU DỮ LIỆU & TẢI ẢNH</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export { PrecisionDataSampleSxMobileBottomBar };
export default React.memo(PrecisionDataSampleSxMobileBottomBar);
