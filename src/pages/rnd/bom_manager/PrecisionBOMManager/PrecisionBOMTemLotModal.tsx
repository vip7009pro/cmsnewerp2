import React from "react";
import { FaBarcode, FaPrint } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { renderElement } from "../../../../api/services/utilService";
import { CODE_FULL_INFO, COMPONENT_DATA } from "../../interfaces/rndInterface";

interface PrecisionBOMTemLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
  codeFullInfo: CODE_FULL_INFO;
  componentList: COMPONENT_DATA[];
  labelPrintRef: React.RefObject<HTMLDivElement>;
}

export const PrecisionBOMTemLotModal: React.FC<PrecisionBOMTemLotModalProps> = ({
  isOpen,
  onClose,
  onPrint,
  codeFullInfo,
  componentList,
  labelPrintRef,
}) => {
  if (!isOpen) return null;

  return (
    <div className="precision-bom-temlot-backdrop">
      <div className="precision-bom-temlot-dialog">
        {/* Header Modal */}
        <div className="precision-bom-temlot-header">
          <div className="precision-bom-temlot-title">
            <FaBarcode className="icon-barcode" size={16} />
            <span>XEM TRƯỚC TEM LOT (LOT LABEL PREVIEW)</span>
            <span className="badge-code">{codeFullInfo.G_CODE || "6E00004A"}</span>
            <span className="badge-spec">125mm × 65mm</span>
          </div>
          <div className="precision-bom-temlot-actions">
            <button
              type="button"
              className="btn-print-tem"
              onClick={onPrint}
              title="In Tem LOT (Print)"
            >
              <FaPrint size={12} style={{ marginRight: 4 }} />
              IN TEM LOT
            </button>
            <button
              type="button"
              className="btn-close-tem"
              onClick={onClose}
              title="Đóng xem trước"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>

        {/* Vùng xem trước tem nhãn */}
        <div className="precision-bom-temlot-body">
          <div className="precision-bom-temlot-workspace">
            <div className="precision-bom-temlot-paper">
              <div
                className="lotelement"
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
        </div>

        {/* Footer hướng dẫn */}
        <div className="precision-bom-temlot-footer">
          <span className="footer-hint">
            * Nhãn in kích thước chuẩn công nghiệp 125mm × 65mm. Dữ liệu đối tượng được render động theo bản vẽ Amazon Design.
          </span>
          <div className="footer-btns">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Đóng
            </button>
            <button type="button" className="btn-confirm-print" onClick={onPrint}>
              <FaPrint size={12} style={{ marginRight: 4 }} />
              In Tem Này
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrecisionBOMTemLotModal;
