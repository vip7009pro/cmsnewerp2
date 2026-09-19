import React from "react";

export const getColumnBOMSX = (enableEdit: boolean) => [
  {
    field: "M_CODE",
    headerName: "M_CODE",
    width: 80,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    editable: enableEdit,
    cellRenderer: (params: any) => (
      <span style={{ color: "#2563eb", fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
        {params.data?.M_CODE}
      </span>
    ),
  },
  {
    field: "M_NAME",
    headerName: "M_NAME",
    width: 110,
    editable: enableEdit,
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 600, color: "#0f172a" }}>{params.data?.M_NAME}</span>
    ),
  },
  {
    field: "WIDTH_CD",
    headerName: "SIZE",
    width: 80,
    editable: enableEdit,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", textAlign: "right", display: "block" }}>
        {params.data?.WIDTH_CD}
      </span>
    ),
  },
  {
    field: "M_QTY",
    headerName: "M_QTY",
    width: 80,
    editable: enableEdit,
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 700, textAlign: "center", display: "block" }}>
        {params.data?.M_QTY}
      </span>
    ),
  },
  {
    field: "LIEUQL_SX",
    headerName: "LIEUQL_SX",
    width: 80,
    editable: enableEdit,
    cellRenderer: (params: any) => {
      const isQL = params.data?.LIEUQL_SX === 1 || params.data?.LIEUQL_SX === "1";
      return (
        <span
          style={{
            background: isQL ? "#ecfdf5" : "#f1f5f9",
            color: isQL ? "#059669" : "#64748b",
            border: `1px solid ${isQL ? "#a7f3d0" : "#cbd5e1"}`,
            borderRadius: "9999px",
            padding: "1px 6px",
            fontSize: "10px",
            fontWeight: 800,
          }}
        >
          {params.data?.LIEUQL_SX ?? 0}
        </span>
      );
    },
  },
  { field: "INS_EMPL", headerName: "INS_EMPL", width: 80, editable: enableEdit },
  { field: "INS_DATE", headerName: "INS_DATE", width: 150, editable: enableEdit },
  { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 80, editable: enableEdit },
  { field: "UPD_DATE", headerName: "UPD_DATE", width: 150, editable: enableEdit },
];

export const getColumnBOMGIA = (enableEdit: boolean) => [
  {
    field: "M_CODE",
    headerName: "M_CODE",
    width: 80,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    editable: enableEdit,
    cellRenderer: (params: any) => {
      const isSX = params.data?.M_CODE_SX !== null && params.data?.M_CODE_SX !== undefined;
      return (
        <span
          style={{
            color: isSX ? "#2563eb" : "#e11d48",
            fontWeight: 700,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {params.data?.M_CODE}
        </span>
      );
    },
  },
  {
    field: "M_NAME",
    headerName: "M_NAME",
    width: 150,
    editable: enableEdit,
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 600, color: "#0f172a" }}>{params.data?.M_NAME}</span>
    ),
  },
  {
    field: "CUST_CD",
    headerName: "Vendor",
    width: 80,
    editable: enableEdit,
    cellRenderer: (params: any) => {
      if (!params.data?.CUST_CD) {
        return <span style={{ color: "#e11d48", fontWeight: 800 }}>NG</span>;
      }
      return <span>{params.data.CUST_CD}</span>;
    },
  },
  {
    field: "USAGE",
    headerName: "USAGE",
    width: 80,
    editable: enableEdit,
    cellRenderer: (params: any) => {
      if (!params.data?.USAGE) {
        return <span style={{ color: "#e11d48", fontWeight: 800 }}>NG</span>;
      }
      return <span style={{ fontWeight: 600, color: "#4f46e5" }}>{params.data.USAGE}</span>;
    },
  },
  {
    field: "MAIN_M",
    headerName: "MAIN_M",
    width: 80,
    editable: enableEdit,
    cellRenderer: (params: any) => {
      const isMain = params.data?.MAIN_M === 1 || params.data?.MAIN_M === "1";
      return (
        <span
          style={{
            background: isMain ? "#eff6ff" : "#f8fafc",
            color: isMain ? "#2563eb" : "#94a3b8",
            fontWeight: 800,
            padding: "1px 5px",
            borderRadius: "3px",
          }}
        >
          {params.data?.MAIN_M ?? 0}
        </span>
      );
    },
  },
  {
    field: "MAT_MASTER_WIDTH",
    headerName: "Khổ liệu",
    width: 80,
    editable: enableEdit,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", textAlign: "right", display: "block" }}>
        {params.data?.MAT_MASTER_WIDTH === 0 ? "NG" : params.data?.MAT_MASTER_WIDTH}
      </span>
    ),
  },
  {
    field: "MAT_CUTWIDTH",
    headerName: "Khổ SD",
    width: 80,
    editable: enableEdit,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", textAlign: "right", display: "block" }}>
        {params.data?.MAT_CUTWIDTH}
      </span>
    ),
  },
  {
    field: "MAT_ROLL_LENGTH",
    headerName: "Dài liệu",
    width: 110,
    editable: enableEdit,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", textAlign: "right", display: "block" }}>
        {params.data?.MAT_ROLL_LENGTH === 0 ? "NG" : params.data?.MAT_ROLL_LENGTH}
      </span>
    ),
  },
  { field: "M_QTY", headerName: "M_QTY", width: 80, editable: enableEdit },
  { field: "REMARK", headerName: "REMARK", width: 80, editable: enableEdit },
  { field: "PROCESS_ORDER", headerName: "Thứ tự", width: 80, editable: enableEdit },
];

export const getColumnCodeInfo = (enableEdit: boolean) => [
  {
    field: "G_CODE",
    headerName: "G_CODE",
    width: 80,
    editable: enableEdit,
    cellRenderer: (params: any) => (
      <span style={{ color: "#2563eb", fontWeight: 800, fontFamily: "JetBrains Mono, monospace" }}>
        {params.data?.G_CODE}
      </span>
    ),
  },
  {
    field: "G_NAME_KD",
    headerName: "G_NAME_KD",
    width: 95,
    editable: enableEdit,
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 600, color: "#0f172a" }}>{params.data?.G_NAME_KD}</span>
    ),
  },
  {
    field: "PD",
    headerName: "PD",
    width: 50,
    editable: enableEdit,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", textAlign: "right", display: "block" }}>
        {params.data?.PD}
      </span>
    ),
  },
  {
    field: "CAVITY",
    headerName: "CAV",
    width: 45,
    editable: enableEdit,
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 700, textAlign: "center", display: "block" }}>
        {params.data?.CAVITY}
      </span>
    ),
  },
  { field: "PROD_MODEL", headerName: "MODEL", width: 80, editable: enableEdit },
  { field: "PROD_TYPE", headerName: "TYPE", width: 65, editable: enableEdit },
  { field: "CUST_CD", headerName: "CUST", width: 65, editable: enableEdit },
];
