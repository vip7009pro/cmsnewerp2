import React from "react";

/* ── Cell Style Helpers ── */
const numFmt = (val: any) => val?.toLocaleString("en-US");
const blueBold = (params: any) => (
  <span style={{ color: "#1d4ed8", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
    {numFmt(params.value)}
  </span>
);
const greenBold = (params: any) => (
  <span style={{ color: "#059669", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
    {numFmt(params.value)}
  </span>
);

/* ── MANAGE TAB: Column Definitions ── */
export const getManageColumns = () => [
  { field: "PLAN_ID", headerName: "PLAN_ID", width: 100, checkboxSelection: true, headerCheckboxSelection: true },
  { field: "EMPL_NAME", headerName: "EMPL_NAME", width: 100 },
  { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 100 },
  {
    field: "G_CODE", headerName: "G_CODE", width: 70,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#1d4ed8" }}>
        {params.value}
      </span>
    ),
  },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 100 },
  {
    field: "G_NAME", headerName: "G_NAME", width: 120,
    cellRenderer: (params: any) => (
      <span style={{ color: "#e11d48", fontWeight: 700 }}>
        {params.value}
      </span>
    ),
  },
  { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 60 },
  { field: "PROD_MAIN_MATERIAL", headerName: "PROD_MAIN_MATERIAL", width: 120 },
  { field: "PLAN_DATE", headerName: "PLAN_DATE", width: 50 },
  { field: "D1", type: "number", headerName: "D1", width: 50 },
  { field: "D2", type: "number", headerName: "D2", width: 50 },
  { field: "D3", type: "number", headerName: "D3", width: 50 },
  { field: "D4", type: "number", headerName: "D4", width: 50 },
  { field: "D5", type: "number", headerName: "D5", width: 50 },
  { field: "D6", type: "number", headerName: "D6", width: 50 },
  { field: "D7", type: "number", headerName: "D7", width: 50 },
  { field: "D8", type: "number", headerName: "D8", width: 50 },
  { field: "D9", type: "number", headerName: "D9", width: 50 },
  { field: "D10", type: "number", headerName: "D10", width: 50 },
  { field: "D11", type: "number", headerName: "D11", width: 50 },
  { field: "D12", type: "number", headerName: "D12", width: 50 },
  { field: "D13", type: "number", headerName: "D13", width: 50 },
  { field: "D14", type: "number", headerName: "D14", width: 50 },
  { field: "D15", type: "number", headerName: "D15", width: 50 },
  { field: "REMARK", headerName: "REMARK", width: 120 },
  { field: "STATUS", headerName: "STATUS", width: 70 },
];

/* ── STATUS TAB: Cell Style for cumulative D columns ── */
const cumulativeDStyle = (dayFields: string[]) => (params: any) => {
  const sum = dayFields.reduce((acc, f) => acc + (params.data[f] || 0), 0);
  if (sum > (params.data.TOTAL_OUTPUT || 0)) {
    return { backgroundColor: "#fff1f2", color: "#e11d48", fontWeight: 700 };
  }
  return { backgroundColor: "#ecfdf5", color: "#059669", fontWeight: 700 };
};

const coverD1Style = (params: any) => {
  if (params.value === "OK") {
    return { backgroundColor: "#ecfdf5", color: "#059669", fontWeight: 700, textAlign: "center" as const };
  }
  return { backgroundColor: "#fff1f2", color: "#e11d48", fontWeight: 700, textAlign: "center" as const };
};

/* ── STATUS TAB: Column Definitions ── */
export const getStatusColumns = () => {
  const dayFields = ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "D14", "D15"];

  return [
    { field: "PLAN_DATE", type: "date", headerName: "PLAN_DATE", width: 70 },
    {
      field: "G_CODE", headerName: "G_CODE", width: 70,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#1d4ed8" }}>
          {params.value}
        </span>
      ),
    },
    { field: "G_NAME", headerName: "G_NAME", width: 150 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 90 },
    {
      field: "IS_INSPECTING", headerName: "IS_INSPECTING", width: 110,
      cellRenderer: (params: any) => {
        if (params.value !== null) {
          return (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "1px 8px", borderRadius: 9999,
              background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0",
              fontWeight: 700, fontSize: "10.5px", textTransform: "uppercase" as const,
            }}>
              INSPECTING
            </span>
          );
        }
        return (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "1px 8px", borderRadius: 9999,
            background: "#f1f5f9", color: "#94a3b8", border: "1px solid #e2e8f0",
            fontWeight: 700, fontSize: "10.5px", textTransform: "uppercase" as const,
          }}>
            NOT INSPECTING
          </span>
        );
      },
    },
    { field: "INS_DATE", headerName: "INIT_TIME", width: 100 },
    { field: "INIT_INSP_STOCK", type: "number", headerName: "TON_KIEM_BD", width: 100, cellRenderer: blueBold },
    { field: "INPUT_QTY", type: "number", headerName: "NHAP_KIEM", width: 70, cellRenderer: blueBold },
    {
      field: "FIRST_INPUT_TIME", headerName: "FIRST_INPUT", width: 100,
      cellRenderer: (params: any) => (
        <span style={{ color: "#64748b", fontWeight: 600 }}>{params.value}</span>
      ),
    },
    { field: "PRIORITY", type: "number", headerName: "PRIO", width: 50, cellRenderer: blueBold },
    { field: "PLAN_KT", headerName: "PLAN_KT", width: 70, cellRenderer: blueBold },
    { field: "CURRENT_INSP_STOCK", type: "number", headerName: "TON_KIEM_HT", width: 100, cellRenderer: blueBold },
    { field: "INIT_WH_STOCK", type: "number", headerName: "TON_KHO_BD", width: 100, cellRenderer: blueBold },
    { field: "OUTPUT_QTY", type: "number", headerName: "XUAT_KIEM", width: 70, cellRenderer: blueBold },
    { field: "TOTAL_OUTPUT", type: "number", headerName: "TONG_VAO_KHO", width: 100, cellRenderer: greenBold },
    { field: "WH_OUTPUT_QTY", type: "number", headerName: "XUAT_KHO", width: 90, cellRenderer: blueBold },
    { field: "CURRENT_WH_STOCK", type: "number", headerName: "TON_KHO_HT", width: 100, cellRenderer: blueBold },
    { field: "COVER_D1", headerName: "COVER_D1", width: 60, cellStyle: coverD1Style },
    // D1..D15 with cumulative conditional styling
    ...dayFields.map((f, idx) => ({
      field: f,
      type: "number" as const,
      headerName: f,
      width: 50,
      cellRenderer: (params: any) => (
        <span style={{ fontWeight: 700 }}>{numFmt(params.data[f])}</span>
      ),
      cellStyle: cumulativeDStyle(dayFields.slice(0, idx + 1)),
    })),
    { field: "STATUS", headerName: "STATUS", width: 70 },
  ];
};
