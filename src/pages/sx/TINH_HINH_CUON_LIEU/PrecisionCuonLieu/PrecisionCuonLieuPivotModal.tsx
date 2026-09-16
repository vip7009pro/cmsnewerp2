import React, { useMemo } from "react";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotTable from "../../../../components/PivotChart/PivotChart";
import { MATERIAL_STATUS } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import CloseIcon from "@mui/icons-material/Close";

interface PrecisionCuonLieuPivotModalProps {
  data: MATERIAL_STATUS[];
  onClose: () => void;
}

export const PrecisionCuonLieuPivotModal: React.FC<
  PrecisionCuonLieuPivotModalProps
> = ({ data, onClose }) => {
  const dataSource = useMemo(() => {
    return new PivotGridDataSource({
      fields: [
        {
          caption: "INS_DATE",
          width: 90,
          dataField: "INS_DATE",
          dataType: "date",
          summaryType: "count",
          format: "fixedPoint",
        },
        {
          caption: "M_LOT_NO",
          width: 90,
          dataField: "M_LOT_NO",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "M_CODE",
          width: 80,
          dataField: "M_CODE",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "M_NAME",
          width: 100,
          dataField: "M_NAME",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "FACTORY",
          width: 70,
          dataField: "FACTORY",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "PLAN_EQ (Máy)",
          width: 80,
          dataField: "PLAN_EQ",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "G_CODE",
          width: 80,
          dataField: "G_CODE",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "G_NAME",
          width: 100,
          dataField: "G_NAME",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "XUAT_KHO",
          width: 70,
          dataField: "XUAT_KHO",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "VAO_FR",
          width: 70,
          dataField: "VAO_FR",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "VAO_SR",
          width: 70,
          dataField: "VAO_SR",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "VAO_DC",
          width: 70,
          dataField: "VAO_DC",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "VAO_ED",
          width: 70,
          dataField: "VAO_ED",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "VAO_KIEM",
          width: 70,
          dataField: "VAO_KIEM",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "RA_KIEM",
          width: 70,
          dataField: "RA_KIEM",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "ROLL_QTY",
          width: 80,
          dataField: "ROLL_QTY",
          dataType: "number",
          summaryType: "sum",
          format: "fixedPoint",
        },
        {
          caption: "TOTAL_OUT_QTY (Mét XK)",
          width: 90,
          dataField: "TOTAL_OUT_QTY",
          dataType: "number",
          summaryType: "sum",
          format: "fixedPoint",
        },
        {
          caption: "INSPECT_TOTAL_QTY (Mét KT)",
          width: 90,
          dataField: "INSPECT_TOTAL_QTY",
          dataType: "number",
          summaryType: "sum",
          format: "fixedPoint",
        },
        {
          caption: "INSPECT_OK_QTY (Mét OK)",
          width: 90,
          dataField: "INSPECT_OK_QTY",
          dataType: "number",
          summaryType: "sum",
          format: "fixedPoint",
        },
        {
          caption: "INS_OUT (Mét Xuất)",
          width: 90,
          dataField: "INS_OUT",
          dataType: "number",
          summaryType: "sum",
          format: "fixedPoint",
        },
        {
          caption: "TOTAL_OUT_EA",
          width: 90,
          dataField: "TOTAL_OUT_EA",
          dataType: "number",
          summaryType: "sum",
          format: "fixedPoint",
        },
        {
          caption: "INSPECT_OK_EA",
          width: 90,
          dataField: "INSPECT_OK_EA",
          dataType: "number",
          summaryType: "sum",
          format: "fixedPoint",
        },
        {
          caption: "INS_OUTPUT_EA",
          width: 90,
          dataField: "INS_OUTPUT_EA",
          dataType: "number",
          summaryType: "sum",
          format: "fixedPoint",
        },
        {
          caption: "ROLL_LOSS_KT",
          width: 85,
          dataField: "ROLL_LOSS_KT",
          dataType: "number",
          summaryType: "avg",
          format: "percent",
        },
        {
          caption: "ROLL_LOSS",
          width: 85,
          dataField: "ROLL_LOSS",
          dataType: "number",
          summaryType: "avg",
          format: "percent",
        },
        {
          caption: "PROD_REQUEST_NO",
          width: 90,
          dataField: "PROD_REQUEST_NO",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "PLAN_ID",
          width: 90,
          dataField: "PLAN_ID",
          dataType: "string",
          summaryType: "count",
        },
      ],
      store: data,
    });
  }, [data]);

  return (
    <div className="precision-cuonlieu__pivotModalBackdrop">
      <div className="precision-cuonlieu__pivotModalContent">
        <div className="pivot-modal-header">
          <span className="title">
            📊 PHÂN TÍCH ĐA CHIỀU PIVOT TABLE - TÌNH HÌNH CUỘN LIỆU
          </span>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
            title="Đóng bảng Pivot"
          >
            <CloseIcon style={{ fontSize: "1.1rem" }} />
            <span>Đóng</span>
          </button>
        </div>

        <div className="pivot-modal-body">
          <PivotTable datasource={dataSource} tableID="cuonlieutablepivot" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCuonLieuPivotModal);
