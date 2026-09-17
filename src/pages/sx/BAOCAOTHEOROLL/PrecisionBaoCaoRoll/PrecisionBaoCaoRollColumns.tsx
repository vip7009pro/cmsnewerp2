import React from "react";

const numCell = (color: string) => (params: any) => (
  <span style={{ color, fontWeight: "bold" }}>
    {params.value?.toLocaleString("en-US")}
  </span>
);

const pctCell = (color: string) => (params: any) => (
  <span style={{ color, fontWeight: "bold" }}>
    {params.value?.toLocaleString("en-US", { style: "percent" })}
  </span>
);

export const getBaoCaoRollColumns = () => [
  { field: "PHANLOAI", headerName: "PHANLOAI", width: 60 },
  { field: "INPUT_DATE", headerName: "INPUT_DATE", width: 60 },
  { field: "EQUIPMENT_CD", headerName: "EQ", width: 30 },
  { field: "PROD_REQUEST_NO", headerName: "YCSX_NO", width: 50 },
  { field: "PLAN_ID", headerName: "PLAN_ID", width: 50 },
  { field: "PLAN_QTY", headerName: "PLAN_QTY", width: 60, cellRenderer: numCell("blue") },
  { field: "SX_RESULT", headerName: "SX_RESULT", width: 70, cellRenderer: numCell("purple") },
  { field: "ACHIVEMENT_RATE", headerName: "ACH_RATE", width: 70, cellRenderer: pctCell("green") },
  {
    field: "IS_SETTING", headerName: "IS_SETTING", width: 70,
    cellRenderer: (params: any) => (
      <span style={{ color: params.data.IS_SETTING === "Y" ? "blue" : "red", fontWeight: "bold" }}>
        {params.data.IS_SETTING}
      </span>
    ),
  },
  { field: "PROD_MODEL", headerName: "PROD_MODEL", width: 70 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 70 },
  { field: "M_NAME", headerName: "M_NAME", width: 70 },
  { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 70 },
  { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 70 },
  { field: "INPUT_QTY", headerName: "INPUT_QTY", width: 70, cellRenderer: numCell("blue") },
  { field: "REMAIN_QTY", headerName: "REMAIN_QTY", width: 70, cellRenderer: numCell("blue") },
  { field: "USED_QTY", headerName: "USED_QTY", width: 70, cellRenderer: numCell("blue") },
  { field: "USED_EA", headerName: "USED_EA", width: 70, cellRenderer: numCell("blue") },
  { field: "RPM", headerName: "RPM", width: 70 },
  { field: "SETTING_MET", headerName: "SETTING_MET", width: 70, cellRenderer: numCell("red") },
  { field: "SETTING_EA", headerName: "SETTING_EA", width: 70, cellRenderer: numCell("red") },
  { field: "PR_NG", headerName: "PR_NG", width: 70, cellRenderer: numCell("red") },
  { field: "SX_NG_EA", headerName: "SX_NG_EA", width: 70, cellRenderer: numCell("red") },
  { field: "OK_MET_AUTO", headerName: "OK_MET_AUTO", width: 80, cellRenderer: numCell("green") },
  { field: "OK_MET_TT", headerName: "OK_MET_TT", width: 70, cellRenderer: numCell("green") },
  { field: "USED_SQM", headerName: "USED_SQM", width: 70, cellRenderer: numCell("blue") },
  { field: "LOSS_SQM", headerName: "LOSS_SQM", width: 70, cellRenderer: numCell("blue") },
  { field: "TT_LOSS_SQM", headerName: "TT_LOSS_SQM", width: 70, cellRenderer: numCell("blue") },
  { field: "LOSS_ST", headerName: "LOSS_ST", width: 70, cellRenderer: pctCell("red") },
  { field: "LOSS_SX", headerName: "LOSS_SX", width: 70, cellRenderer: pctCell("red") },
  { field: "LOSS_TT", headerName: "LOSS_TT", width: 70, cellRenderer: pctCell("red") },
  { field: "LOSS_TT_KT", headerName: "LOSS_TT_KT", width: 70, cellRenderer: pctCell("red") },
  { field: "OK_EA", headerName: "OK_EA", width: 70, cellRenderer: numCell("gray") },
  { field: "OUTPUT_EA", headerName: "OUTPUT_EA", width: 70, cellRenderer: numCell("gray") },
  { field: "INSPECT_INPUT", headerName: "INSPECT_INPUT", width: 90, cellRenderer: numCell("gray") },
  { field: "INSPECT_TT_QTY", headerName: "INSPECT_TT_QTY", width: 90, cellRenderer: numCell("gray") },
  { field: "INSPECT_OK_QTY", headerName: "INSPECT_OK_QTY", width: 90, cellRenderer: numCell("gray") },
  { field: "TOTAL_NG", headerName: "TOTAL_NG", width: 90, cellRenderer: numCell("gray") },
  { field: "PROCESS_NG", headerName: "PROCESS_NG", width: 90, cellRenderer: numCell("gray") },
  { field: "MATERIAL_NG", headerName: "MATERIAL_NG", width: 90, cellRenderer: numCell("gray") },
  { field: "INSPECT_OK_SQM", headerName: "INSPECT_OK_SQM", width: 90, cellRenderer: numCell("gray") },
  { field: "INSPECT_COMPLETED_DATE", headerName: "INSP_DATE", width: 80 },
  {
    field: "REMARK", headerName: "REMARK", width: 70,
    cellRenderer: (params: any) => (
      <span style={{ color: params.data.EQUIPMENT_CD === "TOTAL" ? "red" : undefined, fontWeight: params.data.EQUIPMENT_CD === "TOTAL" ? "bold" : undefined }}>
        {params.data.REMARK}
      </span>
    ),
  },
  { field: "PD", headerName: "PD", width: 70 },
  { field: "CAVITY", headerName: "CAVITY", width: 70 },
  { field: "STEP", headerName: "STEP", width: 70 },
  { field: "PR_NB", headerName: "PR_NB", width: 70 },
  { field: "MAX_PROCESS_NUMBER", headerName: "MAX_PRNB", width: 70 },
  { field: "LAST_PROCESS", headerName: "LAST_PROCESS", width: 80 },
  { field: "id", headerName: "ID", width: 40 },
];
