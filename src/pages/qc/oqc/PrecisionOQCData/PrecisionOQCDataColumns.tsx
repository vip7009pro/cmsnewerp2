import React from "react";

export const getOQCDataColumns = () => {
  return [
    {
      field: "OQC_ID",
      headerName: "OQC_ID",
      width: 50,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: "#64748b" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "DELIVERY_DATE",
      headerName: "DELIVERY_DATE",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.74rem" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "SHIFT_CODE",
      headerName: "SHIFT_CODE",
      width: 70,
      cellRenderer: (params: any) => (
        <span style={{ fontWeight: 600, color: "#334155" }}>{params.value}</span>
      ),
    },
    {
      field: "FACTORY_NAME",
      headerName: "FACTORY_NAME",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ fontWeight: 600, color: "#2563eb" }}>{params.value}</span>
      ),
    },
    {
      field: "FULL_NAME",
      headerName: "FULL_NAME",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontWeight: 500 }}>{params.value}</span>
      ),
    },
    {
      field: "CUST_NAME_KD",
      headerName: "CUST_NAME_KD",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ fontWeight: 600, color: "#0284c7" }}>{params.value}</span>
      ),
    },
    {
      field: "PROD_REQUEST_NO",
      headerName: "PROD_REQUEST_NO",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#1e293b" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "PROCESS_LOT_NO",
      headerName: "PROCESS_LOT_NO",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: "#0f172a" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "M_LOT_NO",
      headerName: "M_LOT_NO",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.74rem" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "LOTNCC",
      headerName: "LOTNCC",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.74rem" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "LABEL_ID",
      headerName: "LABEL_ID",
      width: 60,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#64748b" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "PROD_REQUEST_DATE",
      headerName: "YCSX_DATE",
      width: 60,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.74rem" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "PROD_REQUEST_QTY",
      headerName: "YCSX_QTY",
      width: 60,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", textAlign: "right", display: "block" }}>
          {params.value?.toLocaleString?.("en-US") ?? params.value}
        </span>
      ),
    },
    {
      field: "G_CODE",
      headerName: "G_CODE",
      width: 60,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: "#2563eb" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontWeight: 500 }} title={params.value}>{params.value}</span>
      ),
    },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontWeight: 600, color: "#1e293b" }} title={params.value}>
          {params.value}
        </span>
      ),
    },
    {
      field: "DELIVERY_QTY",
      headerName: "DELIVERY_QTY",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: "#047857", textAlign: "right", display: "block" }}>
          {params.value?.toLocaleString?.("en-US") ?? params.value}
        </span>
      ),
    },
    {
      field: "SAMPLE_QTY",
      headerName: "SAMPLE_QTY",
      width: 70,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", textAlign: "right", display: "block" }}>
          {params.value?.toLocaleString?.("en-US") ?? params.value}
        </span>
      ),
    },
    {
      field: "SAMPLE_NG_QTY",
      headerName: "SAMPLE_NG_QTY",
      width: 90,
      cellRenderer: (params: any) => {
        const val = Number(params.value) || 0;
        return (
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: val > 0 ? 700 : 400,
              color: val > 0 ? "#dc2626" : "#64748b",
              textAlign: "right",
              display: "block",
            }}
          >
            {val.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "PROD_LAST_PRICE",
      headerName: "PROD_LAST_PRICE",
      width: 100,
      cellRenderer: (params: any) => {
        const val = Number(params.value) || 0;
        return (
          <span style={{ fontFamily: "JetBrains Mono, monospace", textAlign: "right", display: "block" }}>
            ${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </span>
        );
      },
    },
    {
      field: "DELIVERY_AMOUNT",
      headerName: "DELIVERY_AMOUNT",
      width: 100,
      cellRenderer: (params: any) => {
        const val = Number(params.value) || 0;
        return (
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: "#059669", textAlign: "right", display: "block" }}>
            ${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      field: "SAMPLE_NG_AMOUNT",
      headerName: "SAMPLE_NG_AMOUNT",
      width: 100,
      cellRenderer: (params: any) => {
        const val = Number(params.value) || 0;
        return (
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: val > 0 ? 700 : 400, color: val > 0 ? "#e11d48" : "#64748b", textAlign: "right", display: "block" }}>
            ${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      field: "REMARK",
      headerName: "REMARK",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "#64748b" }} title={params.value}>{params.value}</span>
      ),
    },
    {
      field: "RUNNING_COUNT",
      headerName: "RUNNING_COUNT",
      width: 90,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", textAlign: "right", display: "block" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "id",
      headerName: "id",
      width: 60,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#94a3b8" }}>
          {params.value}
        </span>
      ),
    },
  ];
};
