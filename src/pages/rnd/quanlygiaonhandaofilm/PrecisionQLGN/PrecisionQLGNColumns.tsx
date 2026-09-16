import React from "react";

export const getPrecisionQLGNColumns = () => [
  {
    field: "KNIFE_FILM_ID",
    headerName: "KNIFE_FILM_ID",
    width: 100,
    editable: false,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 },
  },
  {
    field: "FACTORY_NAME",
    headerName: "FACTORY_NAME",
    width: 100,
    editable: false,
  },
  {
    field: "NGAYBANGIAO",
    headerName: "NGAYBANGIAO",
    width: 100,
    editable: false,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace" },
  },
  {
    field: "G_CODE",
    headerName: "G_CODE",
    width: 100,
    editable: false,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: "#1d4ed8" },
  },
  {
    field: "G_NAME",
    headerName: "G_NAME",
    width: 100,
    editable: false,
  },
  {
    field: "PROD_TYPE",
    headerName: "PROD_TYPE",
    width: 100,
    editable: false,
  },
  {
    field: "CUST_NAME_KD",
    headerName: "CUST_NAME_KD",
    width: 100,
    editable: false,
  },
  {
    field: "LOAIBANGIAO_PDP",
    headerName: "LOAIBANGIAO_PDP",
    width: 100,
    editable: false,
    cellRenderer: (params: any) => {
      if (!params.value) return "";
      return <span className="badge-pdp">{params.value}</span>;
    },
  },
  {
    field: "LOAIPHATHANH",
    headerName: "LOAIPHATHANH",
    width: 100,
    editable: false,
    cellRenderer: (params: any) => {
      if (!params.value) return "";
      const isPH = params.value === "PH";
      return <span className={isPH ? "badge-ph" : "badge-th"}>{params.value}</span>;
    },
  },
  {
    field: "SOLUONG",
    headerName: "SOLUONG",
    width: 100,
    editable: false,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, textAlign: "right" },
    valueFormatter: (params: any) => (params.value !== null && params.value !== undefined ? Number(params.value).toLocaleString() : ""),
  },
  {
    field: "SOLUONGOHP",
    headerName: "SOLUONGOHP",
    width: 100,
    editable: false,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace", textAlign: "right" },
    valueFormatter: (params: any) => (params.value !== null && params.value !== undefined ? Number(params.value).toLocaleString() : ""),
  },
  {
    field: "LYDOBANGIAO",
    headerName: "LYDOBANGIAO",
    width: 100,
    editable: false,
  },
  {
    field: "PQC_EMPL_NO",
    headerName: "PQC_EMPL_NO",
    width: 100,
    editable: false,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace" },
  },
  {
    field: "RND_EMPL_NO",
    headerName: "RND_EMPL_NO",
    width: 100,
    editable: false,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace" },
  },
  {
    field: "SX_EMPL_NO",
    headerName: "SX_EMPL_NO",
    width: 100,
    editable: false,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace" },
  },
  {
    field: "REMARK",
    headerName: "REMARK",
    width: 100,
    editable: false,
  },
  {
    field: "CFM_GIAONHAN",
    headerName: "CFM_GIAONHAN",
    width: 100,
    editable: false,
    cellRenderer: (params: any) => {
      const val = params.value;
      if (val === "Y" || val === "OK") {
        return <span className="badge-cfm-ok">ĐÃ DUYỆT</span>;
      }
      return <span className="badge-cfm-pending">CHỜ DUYỆT</span>;
    },
  },
  {
    field: "CFM_INS_EMPL",
    headerName: "CFM_INS_EMPL",
    width: 100,
    editable: false,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace" },
  },
  {
    field: "CFM_DATE",
    headerName: "CFM_DATE",
    width: 100,
    editable: false,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace" },
  },
  {
    field: "KNIFE_FILM_STATUS",
    headerName: "KNIFE_FILM_STATUS",
    width: 100,
    editable: false,
  },
  {
    field: "MA_DAO",
    headerName: "MA_DAO",
    width: 100,
    editable: false,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace" },
  },
  {
    field: "TOTAL_PRESS",
    headerName: "TOTAL_PRESS",
    width: 100,
    editable: false,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace", textAlign: "right" },
    valueFormatter: (params: any) => (params.value !== null && params.value !== undefined ? Number(params.value).toLocaleString() : ""),
  },
  {
    field: "CUST_CD",
    headerName: "CUST_CD",
    width: 100,
    editable: false,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace" },
  },
  {
    field: "KNIFE_TYPE",
    headerName: "KNIFE_TYPE",
    width: 100,
    editable: false,
  },
];
