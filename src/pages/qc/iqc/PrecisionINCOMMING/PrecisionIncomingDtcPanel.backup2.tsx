// PrecisionIncomingDtcPanel.tsx - Right DTC Results Panel with AGTable & Criteria Box
import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { DTC_DATA, IQC_INCOMMING_DATA } from "../../interfaces/qcInterface";
import { getDtcColumns } from "./PrecisionIncomingColumns";
import { AiOutlineDownload } from "react-icons/ai";
import { FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

interface PrecisionIncomingDtcPanelProps {
  dtcData: DTC_DATA[];
  clickedRow: IQC_INCOMMING_DATA | null;
  onExportDtcExcel: (type: "EX1" | "EX2") => void;
}

export const PrecisionIncomingDtcPanel: React.FC<PrecisionIncomingDtcPanelProps> = ({
  dtcData,
  clickedRow,
  onExportDtcExcel,
}) => {
  const columns = useMemo(() => getDtcColumns(), []);

  const hasNg = useMemo(() => {
    return dtcData.some((row) => {
      const { RESULT, CENTER_VALUE, LOWER_TOR, UPPER_TOR } = row;
      return RESULT < CENTER_VALUE - LOWER_TOR || RESULT > CENTER_VALUE + UPPER_TOR;
    });
  }, [dtcData]);

  return (
    <aside className="precision-incoming__right-panel">
      {/* Header Banner */}
      <div className="precision-incoming__dtc-header">
        <div className="dtc-title">
          <span>📊 Kết quả ĐTC (Độ Tin Cậy)</span>
        </div>
        <span className="dtc-lot-pill">{clickedRow?.M_NAME || "DTC LOT"}</span>
      </div>

      {/* Sub Toolbar */}
      <div className="precision-incoming__dtc-toolbar">
        <span className="label">Test Specification:</span>
        <div className="tools">
          <button
            className="precision-incoming__btn precision-incoming__btn--outline precision-incoming__btn--dense"
            style={{ color: "#047857" }}
            title="Xuất bảng kết quả ĐTC ra Excel"
            onClick={() => onExportDtcExcel("EX1")}
          >
            <AiOutlineDownload size={11} />
            <span>EX1</span>
          </button>
          <button
            className="precision-incoming__btn precision-incoming__btn--outline precision-incoming__btn--dense"
            style={{ color: "#047857" }}
            title="Xuất toàn bộ kết quả ĐTC ra Excel"
            onClick={() => onExportDtcExcel("EX2")}
          >
            <AiOutlineDownload size={11} />
            <span>EX2</span>
          </button>
        </div>
      </div>

      {/* AGTable */}
      <div className="precision-incoming__dtc-grid">
        <AGTable
          columns={columns}
          data={dtcData}
          suppressRowClickSelection={false}
        />
      </div>

      {/* DTC Tolerance Note Box */}
      <div className="precision-incoming__dtc-summary">
        <div className="summary-header">
          <span>Tiêu chuẩn ĐTC:</span>
          <span style={{ color: hasNg ? "#e11d48" : "#059669", display: "inline-flex", alignItems: "center", gap: 4 }}>
            {hasNg ? <FiAlertTriangle size={12} /> : <FiCheckCircle size={12} />}
            {hasNg ? "CÓ ĐIỂM LỖI (NG)" : "ĐẠT (PASS)"}
          </span>
        </div>
        <p className="summary-text">
          {clickedRow ? (
            <>
              Lô NVL: <strong>{clickedRow.M_LOT_NO}</strong>. Chỉ tiêu kiểm tra: Lực kéo dính bóc keo, độ dày, ngoại quan theo quy cách tiêu chuẩn IQC CMS VINA.
            </>
          ) : (
            "Vui lòng nhấp chọn 1 dòng lô nguyên vật liệu ở bảng giữa để xem dữ liệu độ tin cậy tương ứng."
          )}
        </p>
      </div>

      {/* Footer */}
      <div className="precision-incoming__dtc-footer">
        <span>
          Total: <strong>{dtcData.length} records</strong>
        </span>
        <span style={{ color: hasNg ? "#e11d48" : "#059669", fontWeight: 700 }}>
          {dtcData.length === 0 ? "Chưa có dữ liệu" : hasNg ? "⚠ Có mẫu NG" : "✓ 100% OK"}
        </span>
      </div>
    </aside>
  );
};
