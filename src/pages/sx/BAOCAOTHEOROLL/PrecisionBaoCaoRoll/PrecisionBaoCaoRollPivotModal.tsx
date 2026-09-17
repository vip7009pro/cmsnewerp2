import React, { useMemo } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { IconButton } from "@mui/material";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotTable from "../../../../components/PivotChart/PivotChart";
import { SX_BAOCAOROLLDATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { precisionBaoCaoRollPivotFields } from "./precisionBaoCaoRollPivotFields";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  plandatatable: SX_BAOCAOROLLDATA[];
}

export const PrecisionBaoCaoRollPivotModal: React.FC<Props> = React.memo(
  ({ isOpen, onClose, plandatatable }) => {
    const dataSource = useMemo(() => {
      return new PivotGridDataSource({
        fields: precisionBaoCaoRollPivotFields,
        store: plandatatable,
      });
    }, [plandatatable]);

    if (!isOpen) return null;

    return (
      <div className="precision-bcr-pivot-overlay" onClick={onClose}>
        <div
          className="precision-bcr-pivot-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="precision-bcr-pivot-header">
            <div className="title">
              📊 PHÂN TÍCH ĐA CHIỀU THEO ROLL (PIVOT GRID)
            </div>
            <IconButton
              size="small"
              onClick={onClose}
              className="close-btn"
              title="Đóng cửa sổ Pivot"
            >
              <AiFillCloseCircle color="#ef4444" size={22} />
            </IconButton>
          </div>
          <div className="precision-bcr-pivot-body">
            <PivotTable
              datasource={dataSource}
              tableID="invoicetablepivot"
            />
          </div>
        </div>
      </div>
    );
  }
);

PrecisionBaoCaoRollPivotModal.displayName = "PrecisionBaoCaoRollPivotModal";
