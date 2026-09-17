import React from "react";

export interface PrecisionTemLotColumnsProps {
  onPreviewRow?: (row: any) => void;
}

export const getLichSuTemLotColumns = (props?: PrecisionTemLotColumnsProps) => [
  {
    field: "INS_DATE",
    headerName: "INS_DATE",
    width: 100,
    cellRenderer: (params: any) => {
      const val = params.data?.INS_DATE;
      if (!val) return "";
      return (
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#475569" }}>
          {val}
        </span>
      );
    },
  },
  {
    field: "G_CODE",
    headerName: "G_CODE",
    width: 60,
    cellRenderer: (params: any) => {
      return (
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: "#1e293b" }}>
          {params.data?.G_CODE}
        </span>
      );
    },
  },
  {
    field: "G_NAME",
    headerName: "G_NAME",
    width: 120,
    cellRenderer: (params: any) => {
      return (
        <span style={{ fontWeight: 600, color: "#0f172a" }} title={params.data?.G_NAME}>
          {params.data?.G_NAME}
        </span>
      );
    },
  },
  {
    field: "DESCR",
    headerName: "DESCR",
    width: 120,
    cellRenderer: (params: any) => {
      return (
        <span style={{ color: "#64748b" }} title={params.data?.DESCR}>
          {params.data?.DESCR}
        </span>
      );
    },
  },
  {
    field: "M_LOT_NO",
    headerName: "M_LOT_NO",
    width: 60,
    cellRenderer: (params: any) => {
      return (
        <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#334155" }}>
          {params.data?.M_LOT_NO}
        </span>
      );
    },
  },
  {
    field: "LOTNCC",
    headerName: "LOTNCC",
    width: 100,
    cellRenderer: (params: any) => {
      return (
        <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#475569" }}>
          {params.data?.LOTNCC}
        </span>
      );
    },
  },
  {
    field: "PROD_REQUEST_NO",
    headerName: "YCSX",
    width: 60,
    cellRenderer: (params: any) => {
      return (
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: "#2563eb" }}>
          {params.data?.PROD_REQUEST_NO}
        </span>
      );
    },
  },
  {
    field: "PROD_REQUEST_QTY",
    headerName: "YCSX_QTY",
    width: 60,
    cellRenderer: (ele: any) => {
      return (
        <span
          style={{
            color: "#067cca",
            fontWeight: 600,
            fontFamily: "JetBrains Mono, monospace",
            display: "block",
            textAlign: "right",
            width: "100%",
          }}
        >
          {ele.data?.PROD_REQUEST_QTY?.toLocaleString("en-US")}
        </span>
      );
    },
  },
  {
    field: "PROCESS_LOT_NO",
    headerName: "PROCESS_LOT_NO",
    width: 100,
    cellRenderer: (ele: any) => {
      return (
        <span
          style={{
            color: "#059669",
            fontWeight: "bold",
            fontFamily: "JetBrains Mono, monospace",
            background: "#ecfdf5",
            padding: "1px 6px",
            borderRadius: "4px",
            border: "1px solid #a7f3d0",
            fontSize: "11px",
          }}
          title={ele.data?.PROCESS_LOT_NO}
        >
          {ele.data?.PROCESS_LOT_NO}
        </span>
      );
    },
  },
  {
    field: "M_NAME",
    headerName: "M_NAME",
    width: 100,
    cellRenderer: (params: any) => {
      return (
        <span style={{ color: "#334155" }} title={params.data?.M_NAME}>
          {params.data?.M_NAME}
        </span>
      );
    },
  },
  {
    field: "WIDTH_CD",
    headerName: "WIDTH_CD",
    width: 60,
    cellRenderer: (params: any) => {
      return (
        <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#64748b", textAlign: "right", display: "block", width: "100%" }}>
          {params.data?.WIDTH_CD}
        </span>
      );
    },
  },
  {
    field: "EMPL_NAME",
    headerName: "EMPL_NAME",
    width: 100,
    cellRenderer: (params: any) => {
      return (
        <span style={{ color: "#1e293b", fontWeight: 500 }}>
          {params.data?.EMPL_NAME}
        </span>
      );
    },
  },
  {
    field: "PLAN_ID",
    headerName: "PLAN_ID",
    width: 100,
    cellRenderer: (params: any) => {
      return (
        <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#475569" }}>
          {params.data?.PLAN_ID}
        </span>
      );
    },
  },
  {
    field: "TEMP_QTY",
    headerName: "TEMP_QTY",
    width: 70,
    cellRenderer: (ele: any) => {
      return (
        <span
          style={{
            color: "#2563eb",
            fontWeight: "bold",
            fontFamily: "JetBrains Mono, monospace",
            display: "block",
            textAlign: "right",
            width: "100%",
          }}
        >
          {ele.data?.TEMP_QTY?.toLocaleString("en-US")}
        </span>
      );
    },
  },
  {
    field: "PROCESS_NUMBER",
    headerName: "PROCESS_NUMBER",
    width: 100,
    cellRenderer: (params: any) => {
      const num = params.data?.PROCESS_NUMBER;
      return (
        <span
          style={{
            display: "inline-block",
            padding: "1px 6px",
            borderRadius: "3px",
            fontSize: "10.5px",
            fontWeight: 600,
            background: "#f1f5f9",
            color: "#475569",
            border: "1px solid #e2e8f0",
          }}
        >
          CĐ: {num ?? "-"}
        </span>
      );
    },
  },
  {
    field: "LOT_STATUS",
    headerName: "LOT_STATUS",
    width: 100,
    cellRenderer: (params: any) => {
      const status = params.data?.LOT_STATUS;
      if (status === null || status === undefined || status === "") {
        return (
          <span
            style={{
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "10.5px",
              fontWeight: 600,
              background: "#eff6ff",
              color: "#1d4ed8",
              border: "1px solid #bfdbfe",
            }}
          >
            Chờ chuyển CĐ
          </span>
        );
      }
      return (
        <span
          style={{
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "10.5px",
            fontWeight: 600,
            background: "#f8fafc",
            color: "#64748b",
            border: "1px solid #cbd5e1",
          }}
        >
          {status}
        </span>
      );
    },
  },
  {
    field: "REMARK",
    headerName: "REMARK",
    width: 100,
    cellRenderer: (params: any) => {
      return (
        <span style={{ color: "#64748b", fontSize: "11px" }} title={params.data?.REMARK}>
          {params.data?.REMARK}
        </span>
      );
    },
  },
];
