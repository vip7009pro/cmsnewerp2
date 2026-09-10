/**
 * PrecisionFCSTColumns.tsx
 * Column definitions cho bảng FCST ManageTab.
 * Sử dụng loop pattern để tạo W1-W22 (quantity) và W1A-W22A (amount) columns.
 */
import React from "react";
import { getGlobalSetting } from "../../../../api/Api";
import { WEB_SETTING_DATA } from "../../../../api/GlobalInterface";

/* ── Helper: Lấy currency từ global settings ── */
const getCurrency = (): string => {
  const settings = getGlobalSetting();
  return (
    settings?.filter((e: WEB_SETTING_DATA) => e.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ?? "USD"
  );
};

/* ── Week quantity columns (W1-W22): blue bold ── */
const createWeekQtyColumns = () =>
  Array.from({ length: 22 }, (_, i) => ({
    field: `W${i + 1}`,
    type: "number",
    headerName: `W${i + 1}`,
    width: 80,
    cellRenderer: (params: any) => (
      <span style={{ color: "#2563eb" }}>
        <b>{params.data[`W${i + 1}`]?.toLocaleString("en-US")}</b>
      </span>
    ),
  }));

/* ── Week amount columns (W1A-W22A): green bold currency ── */
const createWeekAmtColumns = () =>
  Array.from({ length: 22 }, (_, i) => ({
    field: `W${i + 1}A`,
    type: "number",
    headerName: `W${i + 1}A`,
    width: 80,
    cellRenderer: (params: any) => (
      <span style={{ color: "#059669" }}>
        <b>
          {params.data[`W${i + 1}A`]?.toLocaleString("en-US", {
            style: "currency",
            currency: getCurrency(),
          })}
        </b>
      </span>
    ),
  }));

/* ── Base columns (FCST_ID → PROD_PRICE) ── */
const BASE_COLUMNS: any[] = [
  {
    field: "FCST_ID",
    headerName: "FCST_ID",
    width: 80,
    headerCheckboxSelection: true,
    checkboxSelection: true,
  },
  { field: "FCSTYEAR", headerName: "FCSTYEAR", width: 80 },
  { field: "FCSTWEEKNO", headerName: "FCSTWEEKNO", width: 80 },
  { field: "G_CODE", headerName: "G_CODE", width: 80 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
  {
    field: "G_NAME",
    headerName: "G_NAME",
    width: 250,
    cellRenderer: (params: any) => (
      <span style={{ color: "#e11d48" }}>
        <b>{params.data.G_NAME}</b>
      </span>
    ),
  },
  { field: "DESCR", headerName: "DESCR", width: 120 },
  { field: "EMPL_NAME", headerName: "EMPL_NAME", width: 150 },
  { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 80 },
  { field: "PROD_PROJECT", headerName: "PROD_PROJECT", width: 80 },
  { field: "PROD_MODEL", headerName: "PROD_MODEL", width: 80 },
  { field: "PROD_MAIN_MATERIAL", headerName: "PROD_MAIN_MATERIAL", width: 80 },
  { field: "PROD_PRICE", type: "number", headerName: "PROD_PRICE", width: 80 },
];

/* ── Export combined columns ── */
export const getFCSTManageColumns = (): any[] => [
  ...BASE_COLUMNS,
  ...createWeekQtyColumns(),
  ...createWeekAmtColumns(),
];

/* ── Excel upload columns (for AddModal) ── */
export const FCST_EXCEL_COLUMNS: any[] = [
  { field: "EMPL_NO", headerName: "EMPL_NO", width: 50 },
  { field: "CUST_CD", headerName: "CUST_CD", width: 50 },
  { field: "G_CODE", headerName: "G_CODE", width: 50 },
  { field: "PROD_PRICE", headerName: "PROD_PRICE", width: 50 },
  { field: "YEAR", headerName: "YEAR", width: 50 },
  { field: "WEEKNO", headerName: "WEEKNO", width: 50 },
  ...Array.from({ length: 22 }, (_, i) => ({
    field: `W${i + 1}`,
    type: "number",
    headerName: `W${i + 1}`,
    width: 50,
  })),
  { field: "CHECKSTATUS", headerName: "CHECKSTATUS", width: 200 },
];
