// PrecisionBNKModal.tsx - Luxury A4 Print-Ready Preview Modal for BNK Checksheet
import React from "react";
import { FiPrinter, FiX } from "react-icons/fi";
import BNK_COMPONENT from "../BNK_COMPONENT";
import { DTC_DATA, IQC_INCOMMING_DATA } from "../../interfaces/qcInterface";

interface PrecisionBNKModalProps {
  show: boolean;
  onClose: () => void;
  printRef: React.RefObject<HTMLDivElement>;
  onPrint: () => void;
  clickedRow: IQC_INCOMMING_DATA | null;
  dtcData: DTC_DATA[];
  onDataChange: (updatedFields: Partial<IQC_INCOMMING_DATA>) => void;
}

export const PrecisionBNKModal: React.FC<PrecisionBNKModalProps> = ({
  show,
  onClose,
  printRef,
  onPrint,
  clickedRow,
  dtcData,
  onDataChange,
}) => {
  if (!show) return null;

  return (
    <div className="precision-bnk-modal">
      {/* SaaS Modern Glassmorphism Modal Header */}
      <div className="precision-bnk-modal__header">
        <div className="header-title-group">
          <span className="title">📄 BIÊN BẢN NGHIỆM THU & CHECKSHEET KIỂM TRA INCOMING (CHUẨN A4)</span>
          {clickedRow && (
            <span className="lot-pill">
              LÔ: <strong>{clickedRow.M_LOT_NO}</strong> ({clickedRow.M_NAME})
            </span>
          )}
        </div>

        <div className="header-actions">
          <button
            className="precision-incoming__btn precision-incoming__btn--primary"
            style={{ padding: "0 14px", height: "32px", fontSize: "12px", opacity: !clickedRow ? 0.6 : 1 }}
            disabled={!clickedRow}
            onClick={onPrint}
            title={!clickedRow ? "Vui lòng chọn lô kiểm tra trước khi in" : "In trực tiếp ra máy in khổ A4 (Print to A4)"}
          >
            <FiPrinter size={15} />
            <span>IN CHECKSHEET (A4)</span>
          </button>

          <button
            className="precision-incoming__icon-btn"
            style={{ width: "32px", height: "32px" }}
            onClick={onClose}
            title="Đóng cửa sổ"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>

      {/* Dark Slate PDF-Style Preview Canvas */}
      <div className="precision-bnk-modal__viewport">
        {!clickedRow ? (
          <div
            style={{
              background: "#ffffff",
              padding: "40px 30px",
              borderRadius: "8px",
              color: "#64748b",
              textAlign: "center",
              fontSize: "13px",
              maxWidth: "450px",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
              margin: "auto",
            }}
          >
            <p style={{ fontWeight: 700, fontSize: "15px", color: "#1e293b", marginBottom: "8px" }}>
              ⚠️ Chưa chọn lô kiểm tra nào
            </p>
            <p>Vui lòng nhấp chọn một dòng kiểm tra trên bảng dữ liệu trước khi xem hoặc in biên bản nghiệm thu BNK.</p>
          </div>
        ) : (
          <div className="precision-bnk-modal__paper-sheet" ref={printRef}>
            <BNK_COMPONENT
              data={clickedRow}
              dtc_data={dtcData}
              onDataChange={onDataChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
