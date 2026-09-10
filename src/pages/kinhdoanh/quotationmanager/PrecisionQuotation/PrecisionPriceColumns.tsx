import React from "react";
import moment from "moment";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";

export const formatDecimal = (value: any, minDec = 2, maxDec = 6) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return "";
  return parsed.toLocaleString("en-US", {
    minimumFractionDigits: minDec,
    maximumFractionDigits: maxDec,
  });
};

/* ── Columns: Bảng Giá Dọc ── */
export const getColumnGiaDoc = () => [
  {
    field: "PROD_ID",
    headerName: "PROD_ID",
    width: 90,
    headerCheckboxSelection: true,
    checkboxSelection: true,
  },
  { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 110 },
  { field: "CUST_CD", headerName: "CUST_CD", width: 65 },
  { field: "G_CODE", headerName: "G_CODE", width: 85 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
  { field: "G_NAME", headerName: "G_NAME", width: 140 },
  { field: "PROD_MAIN_MATERIAL", headerName: "MATERIAL", width: 100 },
  { field: "DESCR", headerName: "DESCR", width: 140 },
  { field: "PRICE_DATE", headerName: "PRICE_DATE", width: 90, cellStyle: { textAlign: "center" } },
  { field: "MOQ", headerName: "MOQ", width: 65, cellStyle: { textAlign: "right" } },
  {
    field: "PROD_PRICE",
    headerName: "PROD_PRICE ($)",
    width: 100,
    cellStyle: { textAlign: "right" },
    cellRenderer: (e: any) => (
      <span style={{ color: "#1d4ed8", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
        {formatDecimal(e.data?.PROD_PRICE, 2, 6)}
      </span>
    ),
  },
  {
    field: "BEP",
    headerName: "BEP",
    width: 80,
    cellStyle: { textAlign: "right" },
    cellRenderer: (e: any) => (
      <span style={{ color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>
        {formatDecimal(e.data?.BEP, 2, 6)}
      </span>
    ),
  },
  {
    field: "FINAL",
    headerName: "APPROVAL",
    width: 90,
    cellStyle: { textAlign: "center" },
    cellRenderer: (e: any) =>
      e.data?.FINAL === "Y" ? (
        <span className="badge-approved-y">Y</span>
      ) : (
        <span className="badge-approved-n">Not Approved</span>
      ),
  },
  {
    field: "DUPLICATE",
    headerName: "DUPLICATE",
    width: 90,
    cellStyle: { textAlign: "center" },
    cellRenderer: (e: any) =>
      e.data?.DUPLICATE === 1 ? (
        <span className="badge-duplicate-ok">OK</span>
      ) : (
        <span className="badge-duplicate-ng">NG</span>
      ),
  },
  { field: "INS_DATE", headerName: "INS_DATE", width: 120 },
  { field: "INS_EMPL", headerName: "INS_EMPL", width: 75 },
  { field: "UPD_DATE", headerName: "UPD_DATE", width: 120 },
  { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 75 },
];

/* ── Columns: Bảng Giá Ngang ── */
export const getColumnGiaNgang = () => {
  const baseCols: any[] = [
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 110 },
    { field: "G_CODE", headerName: "G_CODE", width: 85 },
    { field: "G_NAME", headerName: "G_NAME", width: 140 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    { field: "PROD_MAIN_MATERIAL", headerName: "MATERIAL", width: 100 },
    { field: "MOQ", headerName: "MOQ", width: 65, cellStyle: { textAlign: "right" } },
  ];

  for (let i = 1; i <= 20; i++) {
    baseCols.push({
      field: `PRICE${i}`,
      headerName: `PRICE${i}`,
      width: 85,
      cellStyle: { textAlign: "right" },
      cellRenderer: (e: any) => {
        const val = e.data?.[`PRICE${i}`];
        return val ? (
          <span style={{ color: "#1d4ed8", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
            {formatDecimal(val, 2, 6)}
          </span>
        ) : null;
      },
    });
  }

  for (let i = 1; i <= 20; i++) {
    baseCols.push({
      field: `PRICE_DATE${i}`,
      headerName: `DATE${i}`,
      width: 85,
      cellStyle: { textAlign: "center" },
    });
  }

  return baseCols;
};

/* ── Columns: Upload Excel Preview ── */
export const getColumnsUploadExcel = (onDeleteRow?: (prodId: any) => void) => [
  { field: "PROD_ID", headerName: "PROD_ID", width: 70 },
  { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 110 },
  { field: "CUST_CD", headerName: "CUST_CD", width: 65 },
  { field: "G_CODE", headerName: "G_CODE", width: 85 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 110 },
  { field: "G_NAME", headerName: "G_NAME", width: 130 },
  { field: "PROD_MAIN_MATERIAL", headerName: "MATERIAL", width: 95 },
  { field: "MOQ", headerName: "MOQ", width: 70, cellStyle: { textAlign: "right" } },
  {
    field: "PROD_PRICE",
    headerName: "PROD_PRICE",
    width: 95,
    cellStyle: { textAlign: "right" },
    cellRenderer: (e: any) => (
      <span style={{ color: "#1d4ed8", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
        {formatDecimal(e.data?.PROD_PRICE, 2, 6)}
      </span>
    ),
  },
  {
    field: "BEP",
    headerName: "BEP",
    width: 80,
    cellStyle: { textAlign: "right" },
    cellRenderer: (e: any) => (
      <span style={{ color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>
        {formatDecimal(e.data?.BEP, 2, 6)}
      </span>
    ),
  },
  {
    field: "PRICE_DATE",
    headerName: "PRICE_DATE",
    width: 90,
    cellStyle: { textAlign: "center" },
    cellRenderer: (e: any) => (
      <span>{e.data?.PRICE_DATE ? moment.utc(e.data.PRICE_DATE).format("YYYY-MM-DD") : ""}</span>
    ),
  },
  {
    field: "CHECKSTATUS",
    headerName: "STATUS",
    width: 90,
    cellStyle: { textAlign: "center" },
    cellRenderer: (e: any) => (
      <span
        style={{
          backgroundColor: e.data?.CHECKSTATUS === "READY" ? "#10b981" : "#f43f5e",
          color: "white",
          padding: "2px 8px",
          borderRadius: "4px",
          fontWeight: 700,
          fontSize: "10px",
        }}
      >
        {e.data?.CHECKSTATUS}
      </span>
    ),
  },
  {
    field: "EDIT",
    headerName: "ACTION",
    width: 80,
    cellStyle: { textAlign: "center" },
    cellRenderer: (e: any) => (
      <button
        style={{
          color: "white",
          backgroundColor: "#f43f5e",
          border: "none",
          padding: "2px 8px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "10px",
          fontWeight: 600,
        }}
        onClick={() => onDeleteRow?.(e.data?.PROD_ID)}
      >
        Xóa
      </button>
    ),
  },
];

/* ── Pivot Fields ── */
export const fields_banggia2 = [
  { caption: "CUST_NAME_KD", width: 100, dataField: "CUST_NAME_KD", dataType: "string" },
  { caption: "G_NAME", width: 120, dataField: "G_NAME", dataType: "string" },
  { caption: "G_CODE", width: 90, dataField: "G_CODE", dataType: "string" },
  { caption: "G_NAME_KD", width: 110, dataField: "G_NAME_KD", dataType: "string" },
  { caption: "MATERIAL", width: 100, dataField: "PROD_MAIN_MATERIAL", dataType: "string" },
  { caption: "MOQ", width: 80, dataField: "MOQ", dataType: "number", summaryType: "sum" },
  { caption: "PROD_PRICE", width: 100, dataField: "PROD_PRICE", dataType: "number", summaryType: "sum", format: "fixedPoint" },
  { caption: "BEP", width: 90, dataField: "BEP", dataType: "number", summaryType: "sum", format: "fixedPoint" },
  { caption: "APPROVAL", width: 80, dataField: "FINAL", dataType: "string" },
  { caption: "DUPLICATE", width: 80, dataField: "DUPLICATE", dataType: "number" },
  { caption: "INS_DATE", width: 100, dataField: "INS_DATE", dataType: "string" },
  { caption: "INS_EMPL", width: 80, dataField: "INS_EMPL", dataType: "string" },
];

export const createPivotDataSource = (data: any[], fields: any = fields_banggia2) => {
  return new PivotGridDataSource({
    fields: fields as any,
    store: data,
  });
};
