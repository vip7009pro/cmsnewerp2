// PrecisionIncomingMobileDtcSheet.tsx - Bottom Sheet (Zero-Blur) chứa bảng kết quả ĐTC + cập nhật NCR_ID
import React from "react";
import { FiX, FiRefreshCw } from "react-icons/fi";
import { DTC_DATA, IQC_INCOMMING_DATA } from "../../interfaces/qcInterface";
import { PrecisionIncomingDtcPanel } from "./PrecisionIncomingDtcPanel";

interface PrecisionIncomingMobileDtcSheetProps {
  dtcData: DTC_DATA[];
  clickedRow: IQC_INCOMMING_DATA | null;
  onExportDtcExcel: (type: "EX1" | "EX2") => void;
  ncrIdInput: string;
  setNcrIdInput: (v: string) => void;
  onUpdateNcrId: () => void;
  onClose: () => void;
}

export const PrecisionIncomingMobileDtcSheet: React.FC<PrecisionIncomingMobileDtcSheetProps> = ({
  dtcData,
  clickedRow,
  onExportDtcExcel,
  ncrIdInput,
  setNcrIdInput,
  onUpdateNcrId,
  onClose,
}) => {
  return (
    <div className="precision-incoming-drawer-overlay" onClick={onClose}>
      <div className="precision-incoming-drawer precision-incoming-drawer--dtc" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">
            <span className="drawer-mode-dot is-dtc" />
            <span>KẾT QUẢ ĐTC &amp; NCR</span>
            {clickedRow?.M_LOT_NO && <span className="drawer-lot-pill">{clickedRow.M_LOT_NO}</span>}
          </div>
          <button type="button" className="drawer-close" onClick={onClose} title="Đóng">
            <FiX size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {/* Cập nhật NCR_ID cho dòng đang chọn (tương đương ô NCR trên toolbar desktop) */}
          <div className="drawer-ncr-group">
            <input
              type="text"
              placeholder="Nhập NCR_ID..."
              value={ncrIdInput}
              onChange={(e) => setNcrIdInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onUpdateNcrId()}
            />
            <button type="button" onClick={onUpdateNcrId} title="Cập nhật NCR_ID cho dòng đang chọn">
              <FiRefreshCw size={13} />
              <span>Update NCR_ID</span>
            </button>
          </div>

          <div className="drawer-dtc-panel">
            <PrecisionIncomingDtcPanel
              dtcData={dtcData}
              clickedRow={clickedRow}
              onExportDtcExcel={onExportDtcExcel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrecisionIncomingMobileDtcSheet;
