import React from "react";
import { FiActivity, FiRefreshCw } from "react-icons/fi";

interface PrecisionLineQcHeaderProps {
  factory: string;
  planId: string;
  emplName: string;
  isSettingOk: boolean;
  onReset: () => void;
}

const PrecisionLineQcHeader: React.FC<PrecisionLineQcHeaderProps> = ({
  factory,
  planId,
  emplName,
  isSettingOk,
  onReset,
}) => {
  return (
    <div className="precision-lineqc__header">
      <div className="precision-lineqc__headerLeft">
        <div className="precision-lineqc__badge">
          <FiActivity size={13} />
          <span>QC PRECISION • LINE QC</span>
        </div>
        <div className="precision-lineqc__titleWrap">
          <h1 className="precision-lineqc__title">
            Khai Báo & Kiểm Soát Chất Lượng Line QC
          </h1>
          <div className="precision-lineqc__breadcrumb">
            <span>Quản Lý Chất Lượng</span>
            <span className="separator">/</span>
            <span>PQC</span>
            <span className="separator">/</span>
            <span className="current">Kiểm Tra Đầu Ca & Giữa Chuyền ({factory})</span>
          </div>
        </div>
      </div>

      <div className="precision-lineqc__headerRight">
        {planId && (
          <div className="telemetry-pill">
            <span className="label">Chỉ Thị:</span>
            <strong className="value text-sky-600">{planId}</strong>
          </div>
        )}
        {planId && (
          <div className={`status-pill ${isSettingOk ? "status-pill--success" : "status-pill--warning"}`}>
            <span>{isSettingOk ? "Đã Bắn Setting OK" : "Chưa Bắn Setting"}</span>
          </div>
        )}
        {emplName && (
          <div className="telemetry-pill">
            <span className="label">Line QC:</span>
            <strong className="value text-emerald-600">{emplName}</strong>
          </div>
        )}

        <button
          type="button"
          className="precision-lineqc__btnReset"
          onClick={onReset}
          title="Xóa trắng form nhập liệu"
        >
          <FiRefreshCw size={13} />
          <span>Làm Mới</span>
        </button>
      </div>
    </div>
  );
};

export { PrecisionLineQcHeader };
export default React.memo(PrecisionLineQcHeader);
