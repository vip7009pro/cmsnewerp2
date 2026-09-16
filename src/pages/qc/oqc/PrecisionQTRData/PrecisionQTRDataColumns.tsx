import React from "react";

export const getQTRDataColumns = () => {
  return [
    {
      field: "MANAGEMENT_NUMBER",
      headerName: "MANAGEMENT_NUMBER",
      width: 120,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: "#2563eb" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "REGISTERED_DATE",
      headerName: "REGISTERED_DATE",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.74rem" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "PLANT",
      headerName: "PLANT",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontWeight: 600, color: "#334155" }}>{params.value}</span>
      ),
    },
    {
      field: "MONTH_QTR",
      headerName: "MONTH_QTR",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{params.value}</span>
      ),
    },
    {
      field: "PART_CODE",
      headerName: "PART_CODE",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: "#0f172a" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "QTR_PPM",
      headerName: "QTR_PPM",
      width: 100,
      cellRenderer: (params: any) => {
        const isCritical =
          (params.data?.WH_OUT_QTY || 0) >= 100000 &&
          (params.value || 0) >= 500 &&
          params.data?.OCCUR_PLACE === "Main";
        return (
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              color: isCritical ? "#dc2626" : "#16a34a",
              fontWeight: isCritical ? 700 : 600,
              textAlign: "right",
              display: "block",
            }}
          >
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "OCCUR_PLACE",
      headerName: "OCCUR_PLACE",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontWeight: params.value === "Main" ? 600 : 400, color: params.value === "Main" ? "#d97706" : "#64748b" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "DEFECT_QTY",
      headerName: "DEFECT_QTY",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#dc2626", fontWeight: 600, textAlign: "right", display: "block" }}>
          {params.value?.toLocaleString("en-US")}
        </span>
      ),
    },
    {
      field: "WH_OUT_QTY",
      headerName: "WH_OUT_QTY",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#2563eb", fontWeight: 600, textAlign: "right", display: "block" }}>
          {params.value?.toLocaleString("en-US")}
        </span>
      ),
    },
    {
      field: "APPROVAL",
      headerName: "APPROVAL",
      width: 100,
      cellRenderer: (params: any) => {
        const isDone = params.value === "Hoàn thành";
        return (
          <span
            style={{
              display: "inline-block",
              padding: "1px 6px",
              borderRadius: "4px",
              fontSize: "0.7rem",
              fontWeight: 700,
              background: isDone ? "#ecfdf5" : "#fff1f2",
              color: isDone ? "#059669" : "#e11d48",
              border: `1px solid ${isDone ? "#a7f3d0" : "#fecdd3"}`,
            }}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      field: "TITLE",
      headerName: "TITLE",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontWeight: 500 }} title={params.value}>{params.value}</span>
      ),
    },
    {
      field: "PART_NAME",
      headerName: "PART_NAME",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontWeight: 500 }} title={params.value}>{params.value}</span>
      ),
    },
    { field: "PART_GROUP", headerName: "PART_GROUP", width: 100 },
    { field: "MAIN_CATEGORY", headerName: "MAIN_CATEGORY", width: 100 },
    {
      field: "PROJECT",
      headerName: "PROJECT",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontWeight: 600, color: "#0284c7" }}>{params.value}</span>
      ),
    },
    { field: "BASIC_MODEL", headerName: "BASIC_MODEL", width: 100 },
    {
      field: "DEFECT_DETAILS",
      headerName: "DEFECT_DETAILS",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ color: "#334155" }} title={params.value}>{params.value}</span>
      ),
    },
    {
      field: "SAMPLE_QTY",
      headerName: "SAMPLE_QTY",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", textAlign: "right", display: "block" }}>
          {params.value?.toLocaleString("en-US")}
        </span>
      ),
    },
    {
      field: "DEFECT_RATE",
      headerName: "DEFECT_RATE",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", textAlign: "right", display: "block" }}>
          {params.value}
        </span>
      ),
    },
    { field: "APPROVER", headerName: "APPROVER", width: 100 },
    {
      field: "APPROVAL_DATE",
      headerName: "APPROVAL_DATE",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.74rem" }}>
          {params.value}
        </span>
      ),
    },
    { field: "REASON1", headerName: "REASON1", width: 100 },
    {
      field: "G_CODE",
      headerName: "G_CODE",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#2563eb", fontWeight: 600 }}>
          {params.value}
        </span>
      ),
    },
    { field: "CUST_CD", headerName: "CUST_CD", width: 100 },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 100,
      cellRenderer: (params: any) => (
        <span title={params.value}>{params.value}</span>
      ),
    },
    { field: "UNIT", headerName: "UNIT", width: 100 },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 100 },
    { field: "INS_EMPL", headerName: "INS_EMPL", width: 100 },
    {
      field: "INS_DATE",
      headerName: "INS_DATE",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.74rem" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "UPD_DATE",
      headerName: "UPD_DATE",
      width: 100,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.74rem" }}>
          {params.value}
        </span>
      ),
    },
    { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 100 },
    { field: "QTR_YN", headerName: "QTR_YN", width: 100 },
  ];
};
