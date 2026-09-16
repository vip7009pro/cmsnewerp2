import React, { useMemo } from "react";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotTable from "../../../../components/PivotChart/PivotChart";
import CloseIcon from "@mui/icons-material/Close";

interface PrecisionCSDataPivotModalProps {
  data: any[];
  onClose: () => void;
}

export const PrecisionCSDataPivotModal: React.FC<
  PrecisionCSDataPivotModalProps
> = ({ data, onClose }) => {
  const dataSource = useMemo(() => {
    return new PivotGridDataSource({
      fields: [
        {
          caption: "YEAR_WEEK",
          width: 80,
          dataField: "YEAR_WEEK",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "CONFIRM_ID",
          width: 80,
          dataField: "CONFIRM_ID",
          dataType: "number",
          summaryType: "sum",
        },
        {
          caption: "CONFIRM_DATE",
          width: 85,
          dataField: "CONFIRM_DATE",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "CS_EMPL_NO",
          width: 80,
          dataField: "CS_EMPL_NO",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "EMPL_NAME",
          width: 100,
          dataField: "EMPL_NAME",
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
          caption: "G_NAME_KD",
          width: 100,
          dataField: "G_NAME_KD",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "PROD_REQUEST_NO",
          width: 90,
          dataField: "PROD_REQUEST_NO",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "CUST_CD",
          width: 75,
          dataField: "CUST_CD",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "CUST_NAME_KD",
          width: 90,
          dataField: "CUST_NAME_KD",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "CONTENT",
          width: 120,
          dataField: "CONTENT",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "INSPECT_QTY",
          width: 90,
          dataField: "INSPECT_QTY",
          dataType: "number",
          summaryType: "sum",
          format: "fixedPoint",
        },
        {
          caption: "NG_QTY",
          width: 85,
          dataField: "NG_QTY",
          dataType: "number",
          summaryType: "sum",
          format: "fixedPoint",
        },
        {
          caption: "REPLACE_RATE",
          width: 90,
          dataField: "REPLACE_RATE",
          dataType: "number",
          summaryType: "avg",
          format: "percent",
        },
        {
          caption: "REDUCE_QTY",
          width: 90,
          dataField: "REDUCE_QTY",
          dataType: "number",
          summaryType: "sum",
          format: "fixedPoint",
        },
        {
          caption: "FACTOR",
          width: 85,
          dataField: "FACTOR",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "RESULT",
          width: 80,
          dataField: "RESULT",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "CONFIRM_STATUS",
          width: 95,
          dataField: "CONFIRM_STATUS",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "PHANLOAI",
          width: 80,
          dataField: "PHANLOAI",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "PROD_TYPE",
          width: 80,
          dataField: "PROD_TYPE",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "PROD_MODEL",
          width: 85,
          dataField: "PROD_MODEL",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "PROD_PROJECT",
          width: 90,
          dataField: "PROD_PROJECT",
          dataType: "string",
          summaryType: "count",
        },
        {
          caption: "PROD_LAST_PRICE",
          width: 95,
          dataField: "PROD_LAST_PRICE",
          dataType: "number",
          summaryType: "avg",
          format: "fixedPoint",
        },
        {
          caption: "REDUCE_AMOUNT",
          width: 95,
          dataField: "REDUCE_AMOUNT",
          dataType: "number",
          summaryType: "sum",
          format: "fixedPoint",
        },
      ],
      store: data,
    });
  }, [data]);

  return (
    <div className="precision-cs__pivotModalBackdrop">
      <div className="precision-cs__pivotModalContent">
        <div className="pivot-modal-header">
          <span className="title">
            📊 PHÂN TÍCH ĐA CHIỀU PIVOT TABLE - SỰ CỐ CHẤT LƯỢNG CS
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
          <PivotTable datasource={dataSource} tableID="cspivottable" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCSDataPivotModal);
