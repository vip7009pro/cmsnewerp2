import React from "react";

// Helpers format số JetBrains Mono sắc nét
const renderNumberCell = (params: any, color: string) => {
  if (params.value === null || params.value === undefined) return "";
  const num = typeof params.value === "number" ? params.value : Number(params.value);
  if (isNaN(num)) return params.value;
  return (
    <span
      style={{
        color,
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 600,
        display: "block",
        textAlign: "right",
        width: "100%",
      }}
    >
      {num.toLocaleString("en-US")}
    </span>
  );
};

export const getBaoCaoFullRollColumns = () => {
  const metFields = [
    "IQC_IN", "OUT_KHO_QTY", "LOCK_QTY", "INPUT_QTY", "USED_QTY", "REMAIN_QTY",
    "SETTING_MET", "PR_NG", "RESULT_MET", "BTP_REMAIN_QTY", "TON_KHO_SX",
    "RETURN_KHO_QTY", "RETURN_IQC_QTY", "INS_INPUT_MET", "TON_KIEM_MET",
    "INSPECT_TOTAL_MET", "INSPECT_OK_MET", "INSPECT_OUTPUT_MET"
  ];

  const eaFields = [
    "IQC_IN_EA", "OUT_KHO_EA", "LOCK_EA", "INPUT_EA", "USED_EA", "REMAIN_EA",
    "SETTING_EA", "PR_NG_EA", "RESULT_EA", "BTP_REMAIN_EA", "TON_KHO_SX_EA",
    "RETURN_EA", "RETURN_IQC_EA", "INS_INPUT_EA", "TON_KIEM_EA",
    "INSPECT_TOTAL_EA", "INSPECT_OK_EA", "INSPECT_OUTPUT_EA"
  ];

  const m2Fields = [
    "IQC_IN_M2", "OUT_KHO_M2", "LOCK_M2", "INPUT_M2", "USED_M2", "REMAIN_M2",
    "SETTING_M2", "PR_NG_M2", "RESULT_M2", "BTP_REMAIN_M2", "TON_KHO_SX_M2",
    "RETURN_KHO_M2", "RETURN_IQC_M2", "INS_INPUT_M2", "TON_KIEM_M2",
    "INSPECT_TOTAL_M2", "INSPECT_OK_M2", "INSPECT_OUTPUT_M2"
  ];

  const baseColumns = [
    { field: "PLAN_DATE", headerName: "PLAN_DATE", width: 85, filter: "agTextColumnFilter", pinned: "left" as const },
    { field: "PHAN_LOAI", headerName: "PHAN_LOAI", width: 75, filter: "agTextColumnFilter" },
    { field: "PROCESS_NUMBER", headerName: "PROCESS_NUMBER", width: 80, filter: "agTextColumnFilter" },
    { field: "STEP", headerName: "STEP", width: 70, filter: "agTextColumnFilter" },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 110, filter: "agTextColumnFilter" },
    { field: "PROD_MAIN_MATERIAL", headerName: "PROD_MAIN_MATERIAL", width: 120, filter: "agTextColumnFilter" },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 70, filter: "agTextColumnFilter" },
    { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", width: 90, filter: "agTextColumnFilter" },
    { field: "PLAN_ID", headerName: "PLAN_ID", width: 80, filter: "agTextColumnFilter" },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 90, filter: "agTextColumnFilter" },
  ];

  // 18 cột Mét (Xanh dương #2563eb)
  const metColumns = metFields.map((field) => ({
    field,
    headerName: field,
    width: 75,
    filter: "agNumberColumnFilter",
    cellRenderer: (params: any) => renderNumberCell(params, "#2563eb"),
  }));

  // 18 cột Con EA (Xanh lá #16a34a)
  const eaColumns = eaFields.map((field) => ({
    field,
    headerName: field,
    width: 75,
    filter: "agNumberColumnFilter",
    cellRenderer: (params: any) => renderNumberCell(params, "#16a34a"),
  }));

  // 18 cột Diện tích M2 (Đỏ #dc2626)
  const m2Columns = m2Fields.map((field) => ({
    field,
    headerName: field,
    width: 75,
    filter: "agNumberColumnFilter",
    cellRenderer: (params: any) => renderNumberCell(params, "#dc2626"),
  }));

  // Các cột thông số kỹ thuật cuối cùng
  const specColumns = [
    {
      field: "PD",
      headerName: "PD",
      width: 70,
      filter: "agNumberColumnFilter",
      cellRenderer: (params: any) => renderNumberCell(params, "#2563eb"),
    },
    {
      field: "CAVITY",
      headerName: "CAVITY",
      width: 70,
      filter: "agNumberColumnFilter",
      cellRenderer: (params: any) => renderNumberCell(params, "#2563eb"),
    },
  ];

  return [...baseColumns, ...metColumns, ...eaColumns, ...m2Columns, ...specColumns];
};
