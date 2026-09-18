import React from "react";
import { FiCamera, FiRefreshCw } from "react-icons/fi";

interface PrecisionDataSampleSxHeaderProps {
  planId: string;
  emplName: string;
  onReset: () => void;
}

const PrecisionDataSampleSxHeader: React.FC<PrecisionDataSampleSxHeaderProps> = ({
  planId,
  emplName,
  onReset,
}) => {
  return (
    <div className="precision-datasample__header">
      <div className="precision-datasample__headerLeft">
        <div className="precision-datasample__badge">
          <FiCamera size={13} />
          <span>SX PRECISION • SAMPLE QC</span>
        </div>
        <div className="precision-datasample__titleWrap">
          <h1 className="precision-datasample__title">
            Khai Báo Dữ Liệu & Upload Ảnh Sample Sản Xuất
          </h1>
          <div className="precision-datasample__breadcrumb">
            <span>Sản Xuất</span>
            <span className="separator">/</span>
            <span>Quản Lý Mẫu</span>
            <span className="separator">/</span>
            <span className="current">Chụp & Lưu Dữ Liệu Hiện Trường</span>
          </div>
        </div>
      </div>

      <div className="precision-datasample__headerRight">
        {planId && (
          <div className="telemetry-pill">
            <span className="label">Chỉ Thị:</span>
            <strong className="value text-blue-600">{planId}</strong>
          </div>
        )}
        {emplName && (
          <div className="telemetry-pill">
            <span className="label">Nhân Viên:</span>
            <strong className="value text-emerald-600">{emplName}</strong>
          </div>
        )}
        <button
          type="button"
          className="precision-datasample__btnReset"
          onClick={onReset}
          title="Xóa trắng form nhập"
        >
          <FiRefreshCw size={13} />
          <span>Làm Mới</span>
        </button>
      </div>
    </div>
  );
};

export { PrecisionDataSampleSxHeader };
export default React.memo(PrecisionDataSampleSxHeader);
