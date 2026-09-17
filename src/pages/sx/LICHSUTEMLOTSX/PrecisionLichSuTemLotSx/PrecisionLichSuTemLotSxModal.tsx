import React from "react";
import { FaBarcode, FaPrint, FaTimes } from "react-icons/fa";
import { renderElement } from "../../../../api/services/utilService";
import { COMPONENT_DATA } from "../../../rnd/interfaces/rndInterface";
import { TEMLOTSX_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

interface PrecisionLichSuTemLotSxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
  labelPrintRef: React.RefObject<HTMLDivElement>;
  componentList: COMPONENT_DATA[];
  selectedRow: TEMLOTSX_DATA | null;
}

export const PrecisionLichSuTemLotSxModal: React.FC<PrecisionLichSuTemLotSxModalProps> = ({
  isOpen,
  onClose,
  onPrint,
  labelPrintRef,
  componentList,
  selectedRow,
}) => {
  if (!isOpen) return null;

  return (
    <div className="precision-temlot-backdrop" onClick={onClose}>
      <div
        className="precision-temlot-dialog"
        onClick={(e) => e.stopPropagation()} // Chống đóng khi click bên trong dialog
      >
        {/* Header Modal */}
        <div className="precision-temlot-header">
          <div className="precision-temlot-title">
            <FaBarcode size={16} />
            <span>XEM TRƯỚC TEM LÓT SẢN XUẤT</span>
            <span className="lot-badge">{selectedRow?.PROCESS_LOT_NO || "CHƯA CHỌN LOT"}</span>
            <span className="spec-badge">
              {selectedRow?.G_NAME ? `${selectedRow.G_NAME.slice(0, 20)}...` : "Mẫu Amazon"}
            </span>
            <span className="spec-badge">125mm × 65mm</span>
          </div>

          <div className="precision-temlot-actions">
            <button
              type="button"
              className="btn-print-tem"
              onClick={onPrint}
              title="Kích hoạt in tem lót ngay"
            >
              <FaPrint size={12} />
              <span>IN TEM LÓT</span>
            </button>
            <button
              type="button"
              className="btn-close-tem"
              onClick={onClose}
              title="Đóng cửa sổ xem trước"
            >
              <FaTimes size={13} />
            </button>
          </div>
        </div>

        {/* Vùng xem trước tem nhãn */}
        <div className="precision-temlot-body">
          <div className="precision-temlot-paper">
            <div
              className="lotelement labeldiv precision-temlot-labeldiv"
              ref={labelPrintRef}
              style={{
                position: "relative",
                width: "125mm",
                height: "65mm",
                backgroundColor: "#ffffff",
                overflow: "hidden",
              }}
            >
              {renderElement(componentList)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="precision-temlot-footer">
          <div>
            <span>* Mã hàng: <strong>{selectedRow?.G_CODE || "-"}</strong> | </span>
            <span>YCSX: <strong>{selectedRow?.PROD_REQUEST_NO || "-"}</strong> | </span>
            <span>SL: <strong>{selectedRow?.TEMP_QTY?.toLocaleString("en-US") || 0} EA</strong> ({(selectedRow?.TEMP_MET || 0).toLocaleString("en-US", { maximumFractionDigits: 1 })} m)</span>
          </div>
          <div className="footer-btns">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Đóng
            </button>
            <button
              type="button"
              className="btn-print-tem"
              onClick={onPrint}
              style={{ height: "26px", fontSize: "11px" }}
            >
              <FaPrint size={11} />
              <span>In Bản Này</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrecisionLichSuTemLotSxModal;
