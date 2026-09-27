import React from "react";
import { FiCamera, FiRefreshCw } from "react-icons/fi";
import { IoQrCodeOutline } from "react-icons/io5";

interface PrecisionDataSampleSxMobileHeaderProps {
  planId: string;
  emplName: string;
  lineqcEmpl: string;
  onReset: () => void;
  onOpenScanner: () => void;
}

const PrecisionDataSampleSxMobileHeader: React.FC<PrecisionDataSampleSxMobileHeaderProps> = ({
  planId,
  emplName,
  lineqcEmpl,
  onReset,
  onOpenScanner,
}) => {
  // Lấy tên ngắn gọn của nhân viên cho mobile
  const shortEmplName = emplName
    ? emplName.split(" ").slice(-1)[0]
    : lineqcEmpl || "Chưa chọn";

  return (
    <div className="precision-datasample-mobile-header">
      {/* Brand Badge với chấm xanh Pulse */}
      <div className="header-left">
        <div className="mobile-brand-badge">
          <span className="live-pulse" />
          <FiCamera size={13} />
          <span>SX • SAMPLE QC</span>
        </div>
      </div>

      {/* Telemetry Chips & Hành Động Nhanh */}
      <div className="header-right">
        {planId && (
          <div className="mobile-telemetry-chip plan-chip" title={`Chỉ thị: ${planId}`}>
            <span className="chip-label">CT:</span>
            <strong className="chip-val font-mono">{planId}</strong>
          </div>
        )}

        <div className="mobile-telemetry-chip empl-chip" title={`Nhân viên: ${emplName || lineqcEmpl}`}>
          <span className="chip-label">NV:</span>
          <strong className="chip-val">{shortEmplName}</strong>
        </div>

        {/* Nút Quét Barcode / QR nhanh */}
        <button
          type="button"
          className="btn-header-action btn-scan"
          onClick={onOpenScanner}
          title="Quét Barcode / QR"
        >
          <IoQrCodeOutline size={15} />
          <span>Quét</span>
        </button>

        {/* Nút Reset Form */}
        <button
          type="button"
          className="btn-header-action btn-reset"
          onClick={onReset}
          title="Xóa form làm mới"
        >
          <FiRefreshCw size={14} />
        </button>
      </div>
    </div>
  );
};

export { PrecisionDataSampleSxMobileHeader };
export default React.memo(PrecisionDataSampleSxMobileHeader);
