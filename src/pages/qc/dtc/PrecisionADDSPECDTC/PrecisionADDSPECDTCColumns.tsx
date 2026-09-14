import React from "react";

export const buildADDSPECColumns = () => [
  {
    field: "CUST_NAME_KD",
    headerName: "CUST_NAME_KD",
    resizable: true,
    width: 105,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    pinned: "left" as const,
    cellStyle: { display: "flex", alignItems: "center" },
  },
  {
    field: "G_CODE",
    headerName: "G_CODE",
    resizable: true,
    width: 95,
    cellRenderer: (params: any) => {
      if (!params.value) return <span style={{ color: "#94a3b8" }}>-</span>;
      return <span className="stitch-code-chip">{params.value}</span>;
    },
  },
  {
    field: "G_NAME",
    headerName: "G_NAME",
    resizable: true,
    width: 180,
    tooltipField: "G_NAME",
    cellStyle: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontSize: "11px",
      color: "#334155",
    },
  },
  {
    field: "M_CODE",
    headerName: "M_CODE",
    resizable: true,
    width: 95,
    cellRenderer: (params: any) => {
      if (!params.value) return <span style={{ color: "#94a3b8" }}>-</span>;
      return <span className="stitch-code-chip">{params.value}</span>;
    },
  },
  {
    field: "M_NAME",
    headerName: "M_NAME",
    resizable: true,
    width: 130,
    tooltipField: "M_NAME",
    cellStyle: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      color: "#475569",
    },
  },
  {
    field: "WIDTH_CD",
    headerName: "WIDTH_CD",
    resizable: true,
    width: 80,
    cellStyle: { textAlign: "center", fontFamily: "JetBrains Mono, monospace" },
  },
  {
    field: "TEST_CODE",
    headerName: "TEST_CODE",
    resizable: true,
    width: 85,
    cellStyle: { textAlign: "center", fontFamily: "JetBrains Mono, monospace" },
  },
  {
    field: "TEST_NAME",
    headerName: "TEST_NAME",
    resizable: true,
    width: 120,
    cellStyle: { fontWeight: 600, color: "#1e293b" },
  },
  {
    field: "POINT_CODE",
    headerName: "POINT_CODE",
    resizable: true,
    width: 85,
    cellStyle: { textAlign: "center", fontFamily: "JetBrains Mono, monospace" },
  },
  {
    field: "POINT_NAME",
    headerName: "POINT_NAME",
    resizable: true,
    width: 95,
    editable: true,
    cellRenderer: (params: any) => {
      if (!params.value) return <span style={{ color: "#94a3b8" }}>-</span>;
      return <span className="stitch-point-chip">{params.value}</span>;
    },
  },
  {
    field: "PRI",
    headerName: "PRI",
    resizable: true,
    width: 60,
    editable: true,
    cellStyle: { textAlign: "center", fontFamily: "JetBrains Mono, monospace" },
  },
  {
    field: "CENTER_VALUE",
    headerName: "CENTER_VALUE",
    resizable: true,
    width: 110,
    editable: true,
    cellStyle: {
      textAlign: "right",
      fontWeight: 800,
      color: "#0f172a",
      fontFamily: "JetBrains Mono, monospace",
      backgroundColor: "rgba(241, 245, 249, 0.4)",
    },
  },
  {
    field: "LOWER_TOR",
    headerName: "LOWER_TOR",
    resizable: true,
    width: 95,
    editable: true,
    cellStyle: {
      textAlign: "right",
      fontWeight: 700,
      color: "#e11d48",
      fontFamily: "JetBrains Mono, monospace",
    },
  },
  {
    field: "UPPER_TOR",
    headerName: "UPPER_TOR",
    resizable: true,
    width: 95,
    editable: true,
    cellStyle: {
      textAlign: "right",
      fontWeight: 700,
      color: "#059669",
      fontFamily: "JetBrains Mono, monospace",
    },
  },
  {
    field: "BARCODE_CONTENT",
    headerName: "BARCODE_CONTENT",
    resizable: true,
    width: 130,
    editable: true,
    cellStyle: { color: "#475569" },
  },
  {
    field: "REMARK",
    headerName: "REMARK",
    resizable: true,
    width: 120,
    editable: true,
    cellStyle: { color: "#64748b" },
  },
  {
    field: "TDS",
    headerName: "TDS",
    resizable: true,
    width: 75,
    cellRenderer: (params: any) => {
      const val = params.value ? String(params.value).toUpperCase() : "N";
      return (
        <span className={`stitch-yn-badge stitch-yn-badge--${val === "Y" ? "y" : "n"}`}>
          {val}
        </span>
      );
    },
  },
  {
    field: "BANVE",
    headerName: "BANVE",
    resizable: true,
    width: 75,
    cellRenderer: (params: any) => {
      const val = params.value ? String(params.value).toUpperCase() : "N";
      return (
        <span className={`stitch-yn-badge stitch-yn-badge--${val === "Y" ? "y" : "n"}`}>
          {val}
        </span>
      );
    },
  },
];
