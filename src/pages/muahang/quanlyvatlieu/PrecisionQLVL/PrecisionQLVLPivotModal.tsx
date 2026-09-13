import React from "react";
import { IconButton } from "@mui/material";
import { AiFillCloseCircle } from "react-icons/ai";
import PivotTable from "../../../../components/PivotChart/PivotChart";

interface PrecisionQLVLPivotModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataSource: any;
}

const PrecisionQLVLPivotModal: React.FC<PrecisionQLVLPivotModalProps> = ({
  isOpen,
  onClose,
  dataSource,
}) => {
  if (!isOpen) return null;

  return (
    <div className="precision-qlvl-pivot-overlay">
      <div className="precision-qlvl-pivot-modal">
        <div className="precision-qlvl-pivot-header">
          <div className="precision-qlvl-pivot-title">
            <span className="material-symbols-outlined" style={{ color: "#7c3aed" }}>
              pivot_table_chart
            </span>
            <span>Báo Cáo Phân Tích Pivot - Quản Lý Vật Liệu</span>
          </div>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ color: "#64748b", "&:hover": { color: "#ef4444" } }}
            title="Đóng bảng Pivot"
          >
            <AiFillCloseCircle size={20} />
          </IconButton>
        </div>
        <div className="precision-qlvl-pivot-body">
          <PivotTable datasource={dataSource} tableID="materialtablepivot" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionQLVLPivotModal);
