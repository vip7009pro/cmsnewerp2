import React from "react";

const monoStyle: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
};

const renderMono = (params: any, align: "left" | "center" | "right" = "left", color?: string, bold?: boolean) => (
  <span style={{ ...monoStyle, textAlign: align, display: "block", color: color || "#475569", fontWeight: bold ? 700 : 500 }}>
    {params.value ?? "-"}
  </span>
);

export const getPrecisionSPECDTCColumns = () => [
  {
    field: "CUST_NAME_KD",
    headerName: "CUST_NAME_KD",
    resizable: true,
    width: 110,
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 700, color: "#334155" }}>{params.value || "-"}</span>
    ),
  },
  {
    field: "G_CODE",
    headerName: "G_CODE",
    resizable: true,
    width: 110,
    cellRenderer: (params: any) => renderMono(params, "left", "#2563eb", true),
  },
  {
    field: "G_NAME",
    headerName: "G_NAME",
    resizable: true,
    width: 150,
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 500, color: "#1e293b" }}>{params.value || "-"}</span>
    ),
  },
  {
    field: "TEST_NAME",
    headerName: "TEST_NAME",
    resizable: true,
    width: 120,
    cellRenderer: (params: any) => {
      const val = params.value || "";
      let bg = "#f1f5f9", color = "#475569", border = "#e2e8f0";

      if (val.includes("Kích thước")) {
        bg = "#f0f9ff"; color = "#0369a1"; border = "#bae6fd";
      } else if (val.includes("Mài mòn")) {
        bg = "#fffbeb"; color = "#b45309"; border = "#fde68a";
      } else if (val.includes("XRF") || val.includes("RoHS")) {
        bg = "#faf5ff"; color = "#7c3aed"; border = "#ddd6fe";
      } else if (val.includes("Scan") || val.includes("barcode")) {
        bg = "#eff6ff"; color = "#2563eb"; border = "#bfdbfe";
      }

      return (
        <span
          style={{
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "10.5px",
            fontWeight: 700,
            backgroundColor: bg,
            color,
            border: `1px solid ${border}`,
            display: "inline-block",
          }}
        >
          {val || "-"}
        </span>
      );
    },
  },
  {
    field: "POINT_NAME",
    headerName: "POINT_NAME",
    resizable: true,
    width: 90,
    cellRenderer: (params: any) => renderMono(params, "center"),
  },
  {
    field: "PRI",
    headerName: "PRI",
    resizable: true,
    width: 70,
    cellRenderer: (params: any) => renderMono(params, "center", "#64748b"),
  },
  {
    field: "CENTER_VALUE",
    headerName: "CENTER_VALUE",
    resizable: true,
    width: 105,
    cellRenderer: (params: any) => renderMono(params, "right", "#0f172a", true),
  },
  {
    field: "UPPER_TOR",
    headerName: "UPPER_TOR",
    resizable: true,
    width: 95,
    cellRenderer: (params: any) => renderMono(params, "right"),
  },
  {
    field: "LOWER_TOR",
    headerName: "LOWER_TOR",
    resizable: true,
    width: 95,
    cellRenderer: (params: any) => renderMono(params, "right"),
  },
  {
    field: "MIN_SPEC",
    headerName: "MIN_SPEC",
    resizable: true,
    width: 95,
    cellRenderer: (params: any) => renderMono(params, "right", "#047857", true),
  },
  {
    field: "MAX_SPEC",
    headerName: "MAX_SPEC",
    resizable: true,
    width: 95,
    cellRenderer: (params: any) => renderMono(params, "right", "#be123c", true),
  },
  {
    field: "BARCODE_CONTENT",
    headerName: "BARCODE_CONTENT",
    resizable: true,
    width: 130,
    cellRenderer: (params: any) => renderMono(params, "left"),
  },
  { field: "REMARK", headerName: "REMARK", resizable: true, width: 120 },
  { field: "M_NAME", headerName: "M_NAME", resizable: true, width: 130 },
  {
    field: "WIDTH_CD",
    headerName: "WIDTH_CD",
    resizable: true,
    width: 85,
    cellRenderer: (params: any) => renderMono(params, "center"),
  },
  {
    field: "M_CODE",
    headerName: "M_CODE",
    resizable: true,
    width: 100,
    cellRenderer: (params: any) => renderMono(params, "left"),
  },
  {
    field: "TDS",
    headerName: "TDS",
    resizable: true,
    width: 90,
    cellRenderer: (params: any) =>
      params.value ? (
        <a href={params.value} target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
          TDS
        </a>
      ) : <span>-</span>,
  },
  {
    field: "BANVE",
    headerName: "BANVE",
    resizable: true,
    width: 90,
    cellRenderer: (params: any) =>
      params.value ? (
        <a href={params.value} target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
          Bản Vẽ
        </a>
      ) : <span>-</span>,
  },
];
