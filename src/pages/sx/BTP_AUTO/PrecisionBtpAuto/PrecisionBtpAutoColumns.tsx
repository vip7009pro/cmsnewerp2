import React from "react";

/**
 * Cấu hình 2 bộ cột bảng AG-Grid cho BTP_AUTO:
 * - Detail: 24 cột chi tiết từng lot BTP
 * - Summary: 5 cột tổng hợp theo mã hàng (G_CODE), xưởng A/B
 *
 * Giữ nguyên 100% headerName, width và cell renderers gốc.
 */

// ========== DETAIL COLUMNS (columns_btp_auto_2) ==========
export const DETAIL_COLUMNS = [
  { field: "INS_DATE", headerName: "PROD_DATE", width: 100 },
  { field: "FACTORY", headerName: "FACTORY", width: 50 },
  { field: "XUONG", headerName: "XUONG", width: 50 },
  { field: "EQ_NAME", headerName: "EQ_NAME", width: 50 },
  { field: "G_CODE", headerName: "G_CODE", width: 50 },
  { field: "G_NAME", headerName: "G_NAME", width: 120 },
  { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 60 },
  { field: "UNIT", headerName: "UNIT", width: 50 },
  { field: "PROD_REQUEST_NO", headerName: "YCSX_NO", width: 60 },
  { field: "PLAN_ID", headerName: "PLAN_ID", width: 50 },
  { field: "PROCESS_NUMBER", headerName: "CD", width: 30, type: "number" },
  { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 60 },
  { field: "M_NAME", headerName: "M_NAME", width: 60 },
  { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 60 },
  { field: "PROCESS_LOT_NO", headerName: "LOTSX", width: 60 },
  { field: "REMAIN_QTY_M", headerName: "TON_MET", width: 50, type: "number" },
  {
    field: "TEMP_QTY_EA",
    headerName: "TON_EA",
    width: 50,
    type: "number",
    cellRenderer: (params: any) => (
      <span style={{ color: "#2563eb", fontWeight: "bold" }}>
        {params.value?.toLocaleString("en-US")}
      </span>
    ),
  },
  { field: "FINAL_FACTORY", headerName: "FINAL_FACTORY", width: 80 },
  { field: "FINAL_XUONG", headerName: "FINAL_XUONG", width: 70 },
  { field: "PHAN_LOAI", headerName: "PHAN_LOAI", width: 70 },
  { field: "USE_YN", headerName: "USE_YN", width: 60 },
  { field: "PD", headerName: "PD", width: 50, type: "number" },
  { field: "CAVITY", headerName: "CAVITY", width: 60, type: "number" },
  { field: "TRANS_LOT_NO", headerName: "TRANS_LOT_NO", width: 90 },
  { field: "BTP_TYPE", headerName: "BTP_TYPE", width: 90 },
];

// ========== SUMMARY COLUMNS (columns_btp_summary) ==========
export const SUMMARY_COLUMNS = [
  { field: "id", headerName: "STT", width: 30 },
  { field: "G_CODE", headerName: "G_CODE", width: 50 },
  { field: "G_NAME", headerName: "G_NAME", width: 150 },
  {
    field: "XA",
    headerName: "XA",
    width: 50,
    cellRenderer: (params: any) => (
      <span style={{ color: "#16a34a", fontWeight: "normal" }}>
        {params.value?.toLocaleString("en-US")}
      </span>
    ),
  },
  {
    field: "XB",
    headerName: "XB",
    width: 50,
    cellRenderer: (params: any) => (
      <span style={{ color: "#2563eb", fontWeight: "normal" }}>
        {params.value?.toLocaleString("en-US")}
      </span>
    ),
  },
  {
    field: "TOTAL_BTP",
    headerName: "TOTAL_BTP",
    width: 80,
    cellRenderer: (params: any) => (
      <span style={{ color: "#dc2626", fontWeight: "bold" }}>
        {params.value?.toLocaleString("en-US")}
      </span>
    ),
  },
];
