import React from "react";

// Format số an toàn
const fmtNum = (val: any) => {
  if (val === undefined || val === null || isNaN(Number(val))) return "0";
  return Number(val).toLocaleString("en-US");
};

// Custom cell renderers
const renderNum = (color?: string, isBold?: boolean) => (params: any) => (
  <span style={{ color: color || "inherit", fontWeight: isBold ? 700 : 500 }}>
    {fmtNum(params.value)}
  </span>
);

const renderPoBalance = (params: any) => (
  <span
    style={{
      color: "#e11d48",
      fontWeight: 800,
      background: "#fff1f2",
      padding: "1px 6px",
      borderRadius: 4,
      display: "inline-block",
    }}
  >
    {fmtNum(params.value)}
  </span>
);

const renderThuaThieu = (params: any) => {
  const num = Number(params.value || 0);
  if (num < 0) {
    return (
      <span
        style={{
          color: "#e11d48",
          fontWeight: 800,
          background: "#ffe4e6",
          padding: "1px 6px",
          borderRadius: 4,
          display: "inline-block",
        }}
      >
        {num.toLocaleString("en-US")}
      </span>
    );
  }
  if (num > 0) {
    return (
      <span
        style={{
          color: "#059669",
          fontWeight: 800,
          background: "#ecfdf5",
          padding: "1px 6px",
          borderRadius: 4,
          display: "inline-block",
        }}
      >
        +{num.toLocaleString("en-US")}
      </span>
    );
  }
  return (
    <span
      style={{
        color: "#64748b",
        fontWeight: 600,
        background: "#f1f5f9",
        padding: "1px 6px",
        borderRadius: 4,
        display: "inline-block",
      }}
    >
      0
    </span>
  );
};

const renderStatus = (params: any) => {
  const isOk = params.value === "Y" || params.data?.USE_YN === "Y";
  return (
    <span
      style={{
        color: isOk ? "#065f46" : "#881337",
        background: isOk ? "#ecfdf5" : "#fff1f2",
        border: `1px solid ${isOk ? "#a7f3d0" : "#fecdd3"}`,
        fontWeight: 800,
        fontSize: "10px",
        padding: "1px 8px",
        borderRadius: 4,
      }}
    >
      {isOk ? "MỞ" : "KHÓA"}
    </span>
  );
};

// 1. Cột cho công ty CMS (Tra theo mã Code)
export const getColumnsCodeCMS = () => [
  { field: "id", headerName: "No", width: 65, pinned: "left" },
  {
    field: "G_CODE",
    headerName: "G_CODE",
    width: 95,
    pinned: "left",
    cellRenderer: (p: any) => (
      <strong style={{ color: "#2563eb", cursor: "pointer" }}>{p.value}</strong>
    ),
  },
  { field: "G_NAME", headerName: "G_NAME", width: 170 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 150 },
  { field: "PO_QTY", headerName: "PO_QTY", width: 85, cellRenderer: renderNum("#1e40af", true) },
  { field: "TOTAL_DELIVERED", headerName: "TOTAL_DELIV", width: 85, cellRenderer: renderNum("#334155") },
  { field: "PO_BALANCE", headerName: "PO_BALANCE", width: 95, cellRenderer: renderPoBalance },
  { field: "CHO_KIEM", headerName: "CHO_KIEM", width: 80, cellRenderer: renderNum("#b45309") },
  { field: "CHO_CS_CHECK", headerName: "CS", width: 65, cellRenderer: renderNum() },
  { field: "CHO_KIEM_RMA", headerName: "RMA", width: 65, cellRenderer: renderNum() },
  { field: "BTP", headerName: "BTP", width: 80, cellRenderer: renderNum("#4338ca", true) },
  { field: "TONG_TON_KIEM", headerName: "T.TKIEM", width: 80, cellRenderer: renderNum() },
  { field: "WAIT_INPUT_WH", headerName: "CHO_NHAP", width: 85, cellRenderer: renderNum("#0284c7") },
  { field: "TON_TP", headerName: "TON_TP", width: 85, cellRenderer: renderNum("#059669", true) },
  { field: "BLOCK_QTY", headerName: "BLOCK", width: 75, cellRenderer: renderNum("#ea580c") },
  { field: "GRAND_TOTAL_STOCK", headerName: "GRAND_STOCK", width: 95, cellRenderer: renderNum("#0f172a", true) },
  { field: "THUA_THIEU", headerName: "THUA_THIEU", width: 105, cellRenderer: renderThuaThieu },
  { field: "USE_YN", headerName: "STATUS", width: 75, cellRenderer: renderStatus },
];

// 2. Cột khi Tra theo Kinh Doanh (Search KD)
export const getColumnsCodeKD = () => [
  { field: "id", headerName: "No", width: 65, pinned: "left" },
  {
    field: "G_NAME_KD",
    headerName: "G_NAME_KD",
    width: 170,
    pinned: "left",
    cellRenderer: (p: any) => (
      <strong style={{ color: "#2563eb", cursor: "pointer" }}>{p.value}</strong>
    ),
  },
  { field: "PO_QTY", headerName: "PO_QTY", width: 85, cellRenderer: renderNum("#1e40af", true) },
  { field: "TOTAL_DELIVERED", headerName: "TOTAL_DELIV", width: 85, cellRenderer: renderNum("#334155") },
  { field: "PO_BALANCE", headerName: "PO_BALANCE", width: 95, cellRenderer: renderPoBalance },
  { field: "CHO_KIEM", headerName: "CHO_KIEM", width: 80, cellRenderer: renderNum("#b45309") },
  { field: "CHO_CS_CHECK", headerName: "CS", width: 65, cellRenderer: renderNum() },
  { field: "CHO_KIEM_RMA", headerName: "RMA", width: 65, cellRenderer: renderNum() },
  { field: "BTP", headerName: "BTP", width: 80, cellRenderer: renderNum("#4338ca", true) },
  { field: "TONG_TON_KIEM", headerName: "T.TKIEM", width: 80, cellRenderer: renderNum() },
  { field: "WAIT_INPUT_WH", headerName: "CHO_NHAP", width: 85, cellRenderer: renderNum("#0284c7") },
  { field: "TON_TP", headerName: "TON_TP", width: 85, cellRenderer: renderNum("#059669", true) },
  { field: "BLOCK_QTY", headerName: "BLOCK", width: 75, cellRenderer: renderNum("#ea580c") },
  { field: "GRAND_TOTAL_STOCK", headerName: "GRAND_STOCK", width: 95, cellRenderer: renderNum("#0f172a", true) },
  { field: "THUA_THIEU", headerName: "THUA_THIEU", width: 105, cellRenderer: renderThuaThieu },
];

// 3. Cột cho công ty PVN (Search G_CODE PVN kèm M_1 -> M_7)
export const getColumnsCodePVN = () => [
  { field: "id", headerName: "No", width: 65, pinned: "left" },
  {
    field: "G_CODE",
    headerName: "G_CODE",
    width: 95,
    pinned: "left",
    cellRenderer: (p: any) => (
      <strong style={{ color: "#2563eb", cursor: "pointer" }}>{p.value}</strong>
    ),
  },
  { field: "G_NAME", headerName: "G_NAME", width: 150 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 150 },
  { field: "M_7", headerName: "M_7", width: 70, cellRenderer: renderNum("#64748b") },
  { field: "M_6", headerName: "M_6", width: 70, cellRenderer: renderNum("#64748b") },
  { field: "M_5", headerName: "M_5", width: 70, cellRenderer: renderNum("#64748b") },
  { field: "M_4", headerName: "M_4", width: 70, cellRenderer: renderNum("#64748b") },
  { field: "M_3", headerName: "M_3", width: 70, cellRenderer: renderNum("#64748b") },
  { field: "M_2", headerName: "M_2", width: 70, cellRenderer: renderNum("#64748b") },
  { field: "M_1", headerName: "M_1", width: 70, cellRenderer: renderNum("#64748b") },
  { field: "PO_QTY", headerName: "PO_QTY", width: 85, cellRenderer: renderNum("#1e40af", true) },
  { field: "TOTAL_DELIVERED", headerName: "TOTAL_DELIV", width: 85, cellRenderer: renderNum("#334155") },
  { field: "PO_BALANCE", headerName: "PO_BALANCE", width: 95, cellRenderer: renderPoBalance },
  { field: "CHO_KIEM", headerName: "CHO_KIEM", width: 80, cellRenderer: renderNum("#b45309") },
  { field: "CHO_CS_CHECK", headerName: "CS", width: 65, cellRenderer: renderNum() },
  { field: "CHO_KIEM_RMA", headerName: "RMA", width: 65, cellRenderer: renderNum() },
  { field: "TONG_TON_KIEM", headerName: "T.TKIEM", width: 80, cellRenderer: renderNum() },
  { field: "BTP", headerName: "BTP", width: 80, cellRenderer: renderNum("#4338ca", true) },
  { field: "TON_TP", headerName: "TON_TP", width: 85, cellRenderer: renderNum("#059669", true) },
  { field: "BLOCK_QTY", headerName: "BLOCK", width: 75, cellRenderer: renderNum("#ea580c") },
  { field: "GRAND_TOTAL_STOCK", headerName: "GRAND_STOCK", width: 95, cellRenderer: renderNum("#0f172a", true) },
  { field: "THUA_THIEU", headerName: "THUA_THIEU", width: 105, cellRenderer: renderThuaThieu },
  { field: "YCSX_BALANCE", headerName: "YCSX_BALANCE", width: 95, cellRenderer: renderNum("#e11d48") },
  { field: "YCSX_QTY", headerName: "YCSX_QTY", width: 90, cellRenderer: renderNum("#64748b") },
  { field: "KETQUASX", headerName: "KETQUASX", width: 90, cellRenderer: renderNum("#64748b") },
  { field: "NHAPKHO", headerName: "NHAPKHO", width: 90, cellRenderer: renderNum("#64748b") },
];
