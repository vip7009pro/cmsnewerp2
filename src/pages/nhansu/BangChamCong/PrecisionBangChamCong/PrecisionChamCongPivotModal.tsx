import React from "react";
import { FiX, FiBarChart2 } from "react-icons/fi";
import PivotTable from "../../../../components/PivotChart/PivotChart";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dataSource: any;
}

export const PrecisionChamCongPivotModal: React.FC<Props> = ({
  isOpen,
  onClose,
  dataSource,
}) => {
  if (!isOpen) return null;

  return (
    <div className="precision-chamcong-pivot-modal" onClick={onClose}>
      <div
        className="precision-chamcong-pivot-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="precision-chamcong-pivot-modal__header">
          <div className="title">
            <FiBarChart2 size={16} color="#86198f" />
            <span>PHÂN TÍCH ĐA CHIỀU CHẤM CÔNG (PIVOT GRID)</span>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            title="Đóng modal"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="precision-chamcong-pivot-modal__body">
          <PivotTable datasource={dataSource} tableID="datasxtablepivot" />
        </div>
      </div>
    </div>
  );
};

export default PrecisionChamCongPivotModal;
