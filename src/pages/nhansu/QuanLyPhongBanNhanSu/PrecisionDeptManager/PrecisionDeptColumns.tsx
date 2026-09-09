import React from "react";

export const getColumnsMainDept = () => [
  {
    field: "MAINDEPTCODE",
    headerName: "CODE",
    width: 65,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "#2563eb" }}>
        {params.value}
      </span>
    ),
  },
  {
    field: "MAINDEPTNAME",
    headerName: "Tên Bộ Phận",
    flex: 1,
    minWidth: 100,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 700, color: "#0f172a" }}>{params.value}</span>
    ),
  },
  {
    field: "MAINDEPTNAME_KR",
    headerName: "Tên Hàn (KR)",
    width: 100,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => (
      <span
        style={{
          background: "#f1f5f9",
          color: "#475569",
          padding: "1px 5px",
          borderRadius: "3px",
          fontSize: "10.5px",
        }}
      >
        {params.value || "---"}
      </span>
    ),
  },
];

export const getColumnsSubDept = () => [
  {
    field: "MAINDEPTCODE",
    headerName: "M_CODE",
    width: 70,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#64748b" }}>
        {params.value}
      </span>
    ),
  },
  {
    field: "SUBDEPTCODE",
    headerName: "S_CODE",
    width: 70,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "#6366f1" }}>
        {params.value}
      </span>
    ),
  },
  {
    field: "SUBDEPTNAME",
    headerName: "Tên Phòng Ban",
    flex: 1,
    minWidth: 110,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 700, color: "#0f172a" }}>{params.value}</span>
    ),
  },
  {
    field: "SUBDEPTNAME_KR",
    headerName: "Tên Hàn (KR)",
    width: 100,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => (
      <span
        style={{
          background: "#eef2ff",
          color: "#4338ca",
          padding: "1px 5px",
          borderRadius: "3px",
          fontSize: "10.5px",
        }}
      >
        {params.value || "---"}
      </span>
    ),
  },
];

export const getColumnsWorkPosition = () => [
  {
    field: "SUBDEPTCODE",
    headerName: "S_CODE",
    width: 65,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#64748b" }}>
        {params.value}
      </span>
    ),
  },
  {
    field: "WORK_POSITION_CODE",
    headerName: "POS_CODE",
    width: 80,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "#10b981" }}>
        {params.value}
      </span>
    ),
  },
  {
    field: "WORK_POSITION_NAME",
    headerName: "Tên Vị Trí",
    flex: 1,
    minWidth: 120,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 600, color: "#0f172a" }}>{params.value}</span>
    ),
  },
  {
    field: "WORK_POSITION_NAME_KR",
    headerName: "Tên Hàn (KR)",
    width: 100,
    resizable: true,
    editable: false,
  },
  {
    field: "ATT_GROUP_CODE",
    headerName: "ATT_GRP",
    width: 75,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => (
      <span
        style={{
          background: "#fef3c7",
          color: "#b45309",
          border: "1px solid #fde68a",
          borderRadius: "9999px",
          padding: "1px 6px",
          fontSize: "10px",
          fontWeight: 700,
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {params.value}
      </span>
    ),
  },
];
