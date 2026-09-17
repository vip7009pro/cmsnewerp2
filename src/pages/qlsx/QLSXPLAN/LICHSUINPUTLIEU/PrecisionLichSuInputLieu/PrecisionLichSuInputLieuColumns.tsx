import React from "react";

export const columnsLichSuInputLieu = [
  {
    field: "PROD_REQUEST_NO",
    headerName: "YCSX NO",
    width: 85,
    cellStyle: { fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "#2563eb" },
  },
  {
    field: "PLAN_ID",
    headerName: "PLAN_ID",
    width: 85,
    cellStyle: { fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "#0f172a" },
  },
  {
    field: "G_CODE",
    headerName: "G_CODE",
    width: 85,
    cellStyle: { fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: "#0284c7" },
  },
  {
    field: "G_NAME_KD",
    headerName: "G_NAME_KD",
    width: 150,
    tooltipField: "G_NAME_KD",
    cellStyle: { fontWeight: 500 },
  },
  {
    field: "M_CODE",
    headerName: "M_CODE",
    width: 85,
    cellStyle: { fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "#7c3aed" },
  },
  {
    field: "M_NAME",
    headerName: "M_NAME",
    width: 150,
    tooltipField: "M_NAME",
    cellStyle: { fontWeight: 500 },
  },
  {
    field: "WIDTH_CD",
    headerName: "SIZE",
    width: 60,
    cellStyle: { textAlign: "center", fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: "#64748b" },
    cellRenderer: (params: any) => {
      return params.value !== null && params.value !== undefined ? `${params.value}` : "";
    },
  },
  {
    field: "M_LOT_NO",
    headerName: "M_LOT_NO",
    width: 90,
    cellStyle: { fontFamily: "JetBrains Mono, monospace", fontSize: "10.5px", color: "#475569" },
  },
  {
    field: "LOTNCC",
    headerName: "LOTNCC",
    width: 100,
    cellStyle: { fontFamily: "JetBrains Mono, monospace", fontSize: "10.5px", color: "#475569" },
  },
  {
    field: "INPUT_QTY",
    headerName: "INPUT_QTY",
    width: 120,
    cellStyle: { textAlign: "right", fontFamily: "JetBrains Mono, monospace" },
    cellRenderer: (params: any) => {
      if (params.value === null || params.value === undefined) return "";
      return (
        <span style={{ color: "#0284c7", fontWeight: 700 }}>
          {Number(params.value).toLocaleString("en-US")}
        </span>
      );
    },
  },
  {
    field: "USED_QTY",
    headerName: "USED_QTY",
    width: 80,
    cellStyle: { textAlign: "right", fontFamily: "JetBrains Mono, monospace" },
    cellRenderer: (params: any) => {
      if (params.value === null || params.value === undefined) return "";
      return (
        <span style={{ color: "#16a34a", fontWeight: 700 }}>
          {Number(params.value).toLocaleString("en-US")}
        </span>
      );
    },
  },
  {
    field: "REMAIN_QTY",
    headerName: "REMAIN_QTY",
    width: 90,
    cellStyle: { textAlign: "right", fontFamily: "JetBrains Mono, monospace" },
    cellRenderer: (params: any) => {
      if (params.value === null || params.value === undefined) return "";
      return (
        <span style={{ color: "#ea580c", fontWeight: 700 }}>
          {Number(params.value).toLocaleString("en-US")}
        </span>
      );
    },
  },
  {
    field: "EMPL_NO",
    headerName: "EMPL_NO",
    width: 80,
    cellStyle: { textAlign: "center", fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: "#64748b" },
  },
  {
    field: "EQUIPMENT_CD",
    headerName: "MAY",
    width: 60,
    cellStyle: { textAlign: "center" },
    cellRenderer: (params: any) => {
      if (!params.value) return "";
      return (
        <span
          style={{
            backgroundColor: "#eff6ff",
            color: "#1d4ed8",
            padding: "1px 6px",
            borderRadius: "4px",
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: 700,
            fontSize: "10.5px",
            border: "1px solid #bfdbfe",
          }}
        >
          {params.value}
        </span>
      );
    },
  },
  {
    field: "INS_DATE",
    headerName: "INS_DATE",
    width: 150,
    cellStyle: { textAlign: "center", fontFamily: "JetBrains Mono, monospace", fontSize: "10.5px", color: "#64748b" },
  },
];
