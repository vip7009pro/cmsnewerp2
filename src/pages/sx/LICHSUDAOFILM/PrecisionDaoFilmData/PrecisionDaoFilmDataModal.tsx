import React from "react";
import { FiX, FiTool } from "react-icons/fi";
import QLGN from "../../../rnd/quanlygiaonhandaofilm/QLGN";

interface PrecisionDaoFilmDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrecisionDaoFilmDataModal: React.FC<PrecisionDaoFilmDataModalProps> = React.memo(
  ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="precision-df-modal-backdrop" onClick={onClose}>
        <div
          className="modal-container"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-container__header">
            <div className="modal-title-wrap">
              <FiTool size={14} color="#db2777" />
              <h3>Quản Lý Giao Nhận Dao Film (Tooling & Film Handover)</h3>
              <span className="tag">R&D • QC • SX</span>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              title="Đóng cửa sổ"
            >
              <FiX />
            </button>
          </div>

          <div className="modal-container__body">
            <QLGN />
          </div>
        </div>
      </div>
    );
  }
);

export default PrecisionDaoFilmDataModal;
