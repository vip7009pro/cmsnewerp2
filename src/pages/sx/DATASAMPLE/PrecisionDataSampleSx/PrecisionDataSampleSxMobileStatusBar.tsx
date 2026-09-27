import React from "react";
import { FiCheck, FiAlertCircle, FiImage } from "react-icons/fi";

interface PrecisionDataSampleSxMobileStatusBarProps {
  hasPlan: boolean;
  hasEmpl: boolean;
  fileCount: number; // 0, 1, hoặc 2
  gName: string;
}

const PrecisionDataSampleSxMobileStatusBar: React.FC<PrecisionDataSampleSxMobileStatusBarProps> = ({
  hasPlan,
  hasEmpl,
  fileCount,
  gName,
}) => {
  return (
    <div className="precision-datasample-mobile-status">
      <div className="status-steps-track">
        {/* Bước 1: Chỉ thị */}
        <div className={`step-pill ${hasPlan ? "is-valid" : "is-pending"}`}>
          <div className="step-indicator">
            {hasPlan ? <FiCheck size={11} /> : "1"}
          </div>
          <div className="step-text">
            <span className="step-name">Chỉ Thị</span>
            <span className="step-desc">
              {hasPlan ? (gName ? "Hợp lệ" : "Chờ dữ liệu") : "Chưa có"}
            </span>
          </div>
        </div>

        <div className="step-arrow">›</div>

        {/* Bước 2: Nhân viên */}
        <div className={`step-pill ${hasEmpl ? "is-valid" : "is-pending"}`}>
          <div className="step-indicator">
            {hasEmpl ? <FiCheck size={11} /> : "2"}
          </div>
          <div className="step-text">
            <span className="step-name">Nhân Sự</span>
            <span className="step-desc">{hasEmpl ? "Đã xác nhận" : "Chưa có"}</span>
          </div>
        </div>

        <div className="step-arrow">›</div>

        {/* Bước 3: Ảnh hiện trường */}
        <div className={`step-pill ${fileCount > 0 ? "is-valid" : "is-pending"}`}>
          <div className="step-indicator">
            {fileCount > 0 ? <FiImage size={11} /> : "3"}
          </div>
          <div className="step-text">
            <span className="step-name">Ảnh Mẫu</span>
            <span className="step-desc">{fileCount}/2 Ảnh</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PrecisionDataSampleSxMobileStatusBar };
export default React.memo(PrecisionDataSampleSxMobileStatusBar);
