import React from "react";
import { IconButton } from "@mui/material";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotTable from "../../../../../components/PivotChart/PivotChart";

interface PrecisionDataSxPivotModalProps {
  open: boolean;
  onClose: () => void;
  dataSource: PivotGridDataSource;
  tableID?: string;
}

export const PrecisionDataSxPivotModal: React.FC<PrecisionDataSxPivotModalProps> = React.memo(({
  open,
  onClose,
  dataSource,
  tableID = "datasxtablepivot",
}) => {
  if (!open) return null;

  return (
    <div className="precision-pivot-modal-overlay">
      <div className="precision-pivot-modal-content">
        <div className="pivot-modal-header">
          <div className="pivot-modal-title">
            <MdOutlinePivotTableChart className="pivot-icon" size={20} />
            <span>PHÂN TÍCH ĐA CHIỀU PIVOT DỮ LIỆU SẢN XUẤT</span>
          </div>
          <IconButton className="pivot-close-btn" onClick={onClose} size="small">
            <AiFillCloseCircle size={20} />
          </IconButton>
        </div>
        <div className="pivot-modal-body">
          <PivotTable datasource={dataSource} tableID={tableID} />
        </div>
      </div>
    </div>
  );
});
