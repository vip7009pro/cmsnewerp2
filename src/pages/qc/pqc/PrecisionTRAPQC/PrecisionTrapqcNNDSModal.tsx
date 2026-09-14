import React from 'react';
import { FiX, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import PATROL_COMPONENT from '../../../sx/PATROL/PATROL_COMPONENT';
import { PQC3_DATA } from '../../interfaces/qcInterface';

interface PrecisionTrapqcNNDSModalProps {
  isOpen: boolean;
  onClose: () => void;
  defectRow: PQC3_DATA;
  currentNN: string;
  onNNChange: (val: string) => void;
  currentDS: string;
  onDSChange: (val: string) => void;
  onSave: () => void;
}

const PrecisionTrapqcNNDSModal: React.FC<PrecisionTrapqcNNDSModalProps> = ({
  isOpen,
  onClose,
  defectRow,
  currentNN,
  onNNChange,
  currentDS,
  onDSChange,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="precision-trapqc-modal-backdrop" onClick={onClose}>
      <div className="precision-trapqc-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="precision-trapqc-modal__header">
          <div className="modal-title">
            <FiAlertTriangle color="#f59e0b" size={15} />
            <span>Cập Nhật Nguyên Nhân & Đối Sách Lỗi PQC (PQC3 ID: {defectRow.PQC3_ID})</span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="Đóng">
            <FiX size={18} />
          </button>
        </div>

        {/* Body Modal */}
        <div className="precision-trapqc-modal__body">
          {/* 1. Hiện tượng lỗi */}
          <div>
            <div className="section-label">1. Hiện tượng lỗi (현상):</div>
            <PATROL_COMPONENT
              data={{
                CUST_NAME_KD: defectRow.CUST_NAME_KD,
                DEFECT: `${defectRow.ERR_CODE || ''}:${defectRow.DEFECT_PHENOMENON || ''}`,
                EQ: defectRow.LINE_NO,
                FACTORY: defectRow.FACTORY,
                G_NAME_KD: defectRow.G_NAME_KD,
                INSPECT_QTY: defectRow.INSPECT_QTY,
                INSPECT_NG: defectRow.DEFECT_QTY,
                LINK: `/pqc/PQC3_${defectRow.PQC3_ID + 1}.png`,
                TIME: defectRow.OCCURR_TIME,
                EMPL_NO: defectRow.LINEQC_PIC,
              }}
            />
          </div>

          {/* 2. Nguyên nhân */}
          <div>
            <div className="section-label">2. Nguyên nhân phân tích (원인):</div>
            <textarea
              rows={4}
              placeholder="Nhập chi tiết nguyên nhân phát sinh lỗi..."
              value={currentNN}
              onChange={(e) => onNNChange(e.target.value)}
            />
          </div>

          {/* 3. Đối sách */}
          <div>
            <div className="section-label">3. Đối sách phòng ngừa (대책):</div>
            <textarea
              rows={4}
              placeholder="Nhập đối sách xử lý và khắc phục triệt để..."
              value={currentDS}
              onChange={(e) => onDSChange(e.target.value)}
            />
          </div>
        </div>

        {/* Footer Modal */}
        <div className="precision-trapqc-modal__footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Đóng
          </button>
          <button type="button" className="btn-save" onClick={onSave}>
            <FiCheck size={13} />
            <span>Lưu Đối Sách</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionTrapqcNNDSModal);
