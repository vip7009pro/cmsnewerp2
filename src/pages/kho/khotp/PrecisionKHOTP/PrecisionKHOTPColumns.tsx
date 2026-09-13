// PrecisionKHOLIEUColumns.tsx / PrecisionKHOTPColumns.tsx - Cấu hình 5 bộ cột AG Grid chuẩn 100% theo bản gốc cho phân hệ Kho Thành Phẩm

import React from "react";

// Helper renderer số có phân tách hàng nghìn
export const renderNumber = (val: any, color: string = "#0f172a", bold: boolean = true) => {
  if (val === null || val === undefined) return "";
  return (
    <span style={{ color, fontWeight: bold ? 700 : 500, fontFamily: "monospace" }}>
      {Number(val).toLocaleString("en-US")}
    </span>
  );
};

// Helper renderer mã code link xanh
export const renderCodeLink = (val: any) => {
  if (!val) return "";
  return (
    <span style={{ color: "#2563eb", fontWeight: 700, cursor: "pointer" }}>
      {val}
    </span>
  );
};

// Helper renderer kết quả kiểm tra chất lượng (KQ Kích thước, Kéo keo, XRF, Điện trở)
export const renderKQQuality = (val: any) => {
  if (val === null || val === undefined) {
    return <span style={{ color: "#64748b" }}>-</span>;
  }
  const num = Number(val);
  if (num > 0) {
    return (
      <span style={{ display: "inline-block", padding: "1px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 800, background: "#10b981", color: "#ffffff", textAlign: "center", minWidth: "32px" }}>
        OK
      </span>
    );
  }
  if (num === 0) {
    return (
      <span style={{ display: "inline-block", padding: "1px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 800, background: "#ef4444", color: "#ffffff", textAlign: "center", minWidth: "32px" }}>
        NG
      </span>
    );
  }
  return (
    <span style={{ display: "inline-block", padding: "1px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 800, background: "#94a3b8", color: "#ffffff", textAlign: "center", minWidth: "32px" }}>
      N/A
    </span>
  );
};

// ==========================================
// 1. CỘT NHẬP / XUẤT KHO (column_WH_IN_OUT)
// ==========================================
export const column_WH_IN_OUT = [
  { field: "G_CODE", headerName: "G_CODE", width: 90, headerCheckboxSelection: true, checkboxSelection: true },
  { field: "G_NAME", headerName: "G_NAME", width: 180 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
  { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 150 },
  { field: "Customer_ShortName", headerName: "Customer_ShortName", width: 100 },
  { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", width: 100 },
  { field: "PROD_REQUEST_DATE", headerName: "PROD_REQUEST_DATE", width: 100 },
  { field: "PLAN_ID", headerName: "PLAN_ID", width: 100 },
  { field: "IO_TYPE", headerName: "IO_TYPE", width: 80 },
  { field: "IO_Date", headerName: "IO_Date", width: 100 },
  { field: "INPUT_DATETIME", headerName: "INPUT_DATETIME", width: 100 },
  {
    field: "IO_Qty",
    headerName: "IO_Qty",
    width: 80,
    cellRenderer: (params: any) => (
      <span style={{ color: "green" }}>
        <b>{params.data.IO_Qty?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  { field: "IO_Note", headerName: "IO_Note", width: 150 },
  { field: "IO_Number", headerName: "IO_Number", width: 100 },
];

// ==========================================
// 2. CỘT XUẤT PACK (column_XUATPACK)
// ==========================================
export const column_XUATPACK = [
  { field: "G_CODE", headerName: "G_CODE", width: 90, headerCheckboxSelection: true, checkboxSelection: true },
  { field: "G_NAME", headerName: "G_NAME", width: 180 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 100 },
  { field: "PROD_MODEL", headerName: "PROD_MODEL", width: 90 },
  { field: "OutID", headerName: "OutID", width: 90 },
  {
    field: "CUST_NAME_KD",
    headerName: "CUST_NAME_KD",
    width: 110,
    cellRenderer: (params: any) => (
      <span style={{ color: "#B008B0" }}>
        <b>{params.data.CUST_NAME_KD}</b>
      </span>
    ),
  },
  { field: "Customer_SortName", headerName: "Customer_SortName", width: 110 },
  {
    field: "OUT_DATE",
    headerName: "OUT_DATE",
    width: 90,
    cellRenderer: (params: any) => (
      <span style={{ color: "blue" }}>
        <b>{params.data.OUT_DATE}</b>
      </span>
    ),
  },
  { field: "OUT_DATETIME", headerName: "OUT_DATETIME", width: 155 },
  {
    field: "Out_Qty",
    headerName: "Out_Qty",
    width: 90,
    cellRenderer: (params: any) => (
      <span style={{ color: "green" }}>
        <b>{params.data.Out_Qty?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  { field: "SX_DATE", headerName: "SX_DATE", width: 90 },
  { field: "INSPECT_LOT_NO", headerName: "INSPECT_LOT_NO", width: 110 },
  { field: "PROCESS_LOT_NO", headerName: "PROCESS_LOT_NO", width: 110 },
  { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 110 },
  { field: "LOTNCC", headerName: "LOTNCC", width: 110 },
  { field: "M_NAME", headerName: "M_NAME", width: 120 },
  { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 90 },
  { field: "SX_EMPL", headerName: "SX_EMPL", width: 90 },
  { field: "LINEQC_EMPL", headerName: "LINEQC_EMPL", width: 90 },
  { field: "INSPECT_EMPL", headerName: "INSPECT_EMPL", width: 100 },
  { field: "EXP_DATE", headerName: "EXP_DATE", width: 100 },
  { field: "Outtype", headerName: "Outtype", width: 90 },
  { field: "PLAN_ID", headerName: "PLAN_ID", width: 90 },
  { field: "PROD_REQUEST_NO", headerName: "YCSX_NO", width: 80 },
  {
    field: "KQ_Kích_thước",
    headerName: "KQ_Kích_thước",
    width: 80,
    cellRenderer: (p: any) => renderKQQuality(p.value),
  },
  {
    field: "KQ_Kéo_keo",
    headerName: "KQ_Kéo_keo",
    width: 80,
    cellRenderer: (p: any) => renderKQQuality(p.value),
  },
  {
    field: "KQ_XRF",
    headerName: "KQ_XRF",
    width: 80,
    cellRenderer: (p: any) => renderKQQuality(p.value),
  },
  {
    field: "KQ_Điện_trở",
    headerName: "KQ_Điện_trở",
    width: 80,
    cellRenderer: (p: any) => renderKQQuality(p.value),
  },
];

// ==========================================
// 3. CỘT TỒN THEO G_CODE (column_STOCK_CMS)
// ==========================================
export const column_STOCK_CMS = [
  { field: "G_CODE", headerName: "G_CODE", width: 90, headerCheckboxSelection: true, checkboxSelection: true },
  { field: "G_NAME", headerName: "G_NAME", width: 180 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 180 },
  {
    field: "CHO_KIEM",
    headerName: "CHO_KIEM",
    width: 120,
    cellRenderer: (params: any) => (
      <span style={{ color: "gray" }}>
        <b>{params.data.CHO_KIEM?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "CHO_CS_CHECK",
    headerName: "WAIT CS",
    width: 120,
    cellRenderer: (params: any) => (
      <span style={{ color: "gray" }}>
        <b>{params.data.CHO_CS_CHECK?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "CHO_KIEM_RMA",
    headerName: "WAIT RMA",
    width: 120,
    cellRenderer: (params: any) => (
      <span style={{ color: "gray" }}>
        <b>{params.data.CHO_KIEM_RMA?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "TONG_TON_KIEM",
    headerName: "TONG_TON_KIEM",
    width: 120,
    cellRenderer: (params: any) => (
      <span style={{ color: "blue" }}>
        <b>{params.data.TONG_TON_KIEM?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "BTP",
    headerName: "BTP",
    width: 100,
    cellRenderer: (params: any) => (
      <span style={{ color: "blue" }}>
        <b>{params.data.BTP?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "TON_TP",
    headerName: "TON_TP",
    width: 100,
    cellRenderer: (params: any) => (
      <span style={{ color: "blue" }}>
        <b>{params.data.TON_TP?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "PENDINGXK",
    headerName: "PENDINGXK",
    width: 100,
    cellRenderer: (params: any) => (
      <span style={{ color: "#9031FA" }}>
        <b>{params.data.PENDINGXK?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "TON_TPTT",
    headerName: "TON_TPTT",
    width: 100,
    cellRenderer: (params: any) => (
      <span style={{ color: "blue" }}>
        <b>{params.data.TON_TPTT?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "BLOCK_QTY",
    headerName: "BLOCK_QTY",
    width: 100,
    cellRenderer: (params: any) => (
      <span style={{ color: "red" }}>
        <b>{params.data.BLOCK_QTY?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "GRAND_TOTAL_STOCK",
    headerName: "GRAND_TOTAL_STOCK",
    width: 150,
    cellRenderer: (params: any) => (
      <span style={{ color: "green" }}>
        <b>{params.data.GRAND_TOTAL_STOCK?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
];

// ==========================================
// 4. CỘT TỒN THEO CODE KD (column_STOCK_KD)
// ==========================================
export const column_STOCK_KD = [
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 180, headerCheckboxSelection: true, checkboxSelection: true },
  {
    field: "CHO_KIEM",
    headerName: "CHO_KIEM",
    width: 120,
    cellRenderer: (params: any) => (
      <span style={{ color: "gray" }}>
        <b>{params.data.CHO_KIEM?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "CHO_CS_CHECK",
    headerName: "WAIT CS",
    width: 120,
    cellRenderer: (params: any) => (
      <span style={{ color: "gray" }}>
        <b>{params.data.CHO_CS_CHECK?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "CHO_KIEM_RMA",
    headerName: "WAIT RMA",
    width: 120,
    cellRenderer: (params: any) => (
      <span style={{ color: "gray" }}>
        <b>{params.data.CHO_KIEM_RMA?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "TONG_TON_KIEM",
    headerName: "TONG_TON_KIEM",
    width: 120,
    cellRenderer: (params: any) => (
      <span style={{ color: "blue" }}>
        <b>{params.data.TONG_TON_KIEM?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "BTP",
    headerName: "BTP",
    width: 100,
    cellRenderer: (params: any) => (
      <span style={{ color: "blue" }}>
        <b>{params.data.BTP?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "TON_TP",
    headerName: "TON_TP",
    width: 100,
    cellRenderer: (params: any) => (
      <span style={{ color: "blue" }}>
        <b>{params.data.TON_TP?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "PENDINGXK",
    headerName: "PENDINGXK",
    width: 100,
    cellRenderer: (params: any) => (
      <span style={{ color: "#9031FA" }}>
        <b>{params.data.PENDINGXK?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "TON_TPTT",
    headerName: "TON_TPTT",
    width: 100,
    cellRenderer: (params: any) => (
      <span style={{ color: "blue" }}>
        <b>{params.data.TON_TPTT?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "BLOCK_QTY",
    headerName: "BLOCK_QTY",
    width: 100,
    cellRenderer: (params: any) => (
      <span style={{ color: "red" }}>
        <b>{params.data.BLOCK_QTY?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "GRAND_TOTAL_STOCK",
    headerName: "GRAND_TOTAL_STOCK",
    width: 150,
    cellRenderer: (params: any) => (
      <span style={{ color: "green" }}>
        <b>{params.data.GRAND_TOTAL_STOCK?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
];

// ==========================================
// 5. CỘT TỒN THEO VỊ TRÍ KHO (column_STOCK_TACH)
// ==========================================
export const column_STOCK_TACH = [
  { field: "KHO_NAME", headerName: "KHO_NAME", width: 90, headerCheckboxSelection: true, checkboxSelection: true },
  { field: "LC_NAME", headerName: "LC_NAME", width: 90 },
  { field: "G_CODE", headerName: "G_CODE", width: 90 },
  { field: "G_NAME", headerName: "G_NAME", width: 180 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 180 },
  {
    field: "NHAPKHO",
    headerName: "NHAPKHO",
    width: 120,
    cellRenderer: (params: any) => (
      <span style={{ color: "gray" }}>
        <b>{params.data.NHAPKHO?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "XUATKHO",
    headerName: "XUATKHO",
    width: 120,
    cellRenderer: (params: any) => (
      <span style={{ color: "gray" }}>
        <b>{params.data.XUATKHO?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "TONKHO",
    headerName: "TONKHO",
    width: 120,
    cellRenderer: (params: any) => (
      <span style={{ color: "gray" }}>
        <b>{params.data.TONKHO?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "BLOCK_QTY",
    headerName: "BLOCK_QTY",
    width: 120,
    cellRenderer: (params: any) => (
      <span style={{ color: "red" }}>
        <b>{params.data.BLOCK_QTY?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  {
    field: "GRAND_TOTAL_TP",
    headerName: "GRAND_TOTAL_TP",
    width: 150,
    cellRenderer: (params: any) => (
      <span style={{ color: "gray" }}>
        <b>{params.data.GRAND_TOTAL_TP?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
];
