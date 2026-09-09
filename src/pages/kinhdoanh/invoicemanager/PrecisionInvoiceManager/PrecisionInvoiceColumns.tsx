import React from "react";
import { getCompany, getGlobalSetting } from "../../../../api/Api";
import { WEB_SETTING_DATA } from "../../../../api/GlobalInterface";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { InvoiceTableData } from "../../interfaces/kdInterface";

const getCurrency = (): string =>
  getGlobalSetting()?.filter(
    (ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY"
  )[0]?.CURRENT_VALUE ?? "USD";

/* ── Cell Renderers ── */
const GNameCell = (params: any) => (
  <span style={{ color: "#1d4ed8", fontWeight: 700 }}>
    {params.data?.G_NAME}
  </span>
);

const DeliveryQtyCell = (params: any) => (
  <span style={{ color: "#1d4ed8", fontWeight: 700 }}>
    {params.data?.DELIVERY_QTY?.toLocaleString("en-US")}
  </span>
);

const BepCell = (params: any) => (
  <span style={{ color: "#3b82f6", fontWeight: 700 }}>
    {params.data?.BEP?.toLocaleString("en-US", {
      style: "decimal",
      maximumFractionDigits: 8,
    })}
  </span>
);

const ProdPriceCell = (params: any) => (
  <span style={{ color: "#64748b", fontWeight: 700 }}>
    {params.data?.PROD_PRICE?.toLocaleString("en-US", {
      style: "decimal",
      maximumFractionDigits: 8,
    })}
  </span>
);

const DeliveredAmountCell = (params: any) => (
  <span style={{ color: "#059669", fontWeight: 700 }}>
    {params.data?.DELIVERED_AMOUNT?.toLocaleString("en-US", {
      style: "currency",
      currency: getCurrency(),
    })}
  </span>
);

const DeliveredBepAmountCell = (params: any) => (
  <span style={{ color: "#0ea5e9", fontWeight: 700 }}>
    {params.data?.DELIVERED_BEP_AMOUNT?.toLocaleString("en-US", {
      style: "currency",
      currency: getCurrency(),
    })}
  </span>
);

/* ── Column Definitions ── */
const BASE_COLUMNS = [
  { field: "DELIVERY_ID", headerName: "DELIVERY_ID", width: 90, headerCheckboxSelection: true, checkboxSelection: true },
  { field: "CUST_CD", headerName: "CUST_CD", width: 70 },
  { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 110 },
  { field: "EMPL_NO", headerName: "EMPL_NO", width: 80 },
  { field: "EMPL_NAME", headerName: "EMPL_NAME", width: 110 },
  { field: "G_CODE", headerName: "G_CODE", width: 80 },
  { field: "G_NAME", headerName: "G_NAME", flex: 1, minWidth: 180, cellRenderer: GNameCell },
];

const CMS_EXTRA_COLUMNS = [
  { field: "DESCR", headerName: "DESCR", width: 120 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
];

const NON_CMS_EXTRA_COLUMNS = [
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
];

const SHARED_MID_COLUMNS = [
  { field: "PO_ID", headerName: "PO_ID", width: 70 },
  { field: "PO_NO", headerName: "PO_NO", width: 80 },
  { field: "PO_DATE", headerName: "PO_DATE", width: 100 },
  { field: "RD_DATE", headerName: "RD_DATE", width: 100 },
  { field: "DELIVERY_DATE", headerName: "DELIVERY_DATE", width: 100 },
  { field: "OVERDUE", headerName: "OVERDUE", width: 100 },
  { field: "DELIVERY_QTY", cellDataType: "number", headerName: "DELIVERY_QTY", width: 90, cellRenderer: DeliveryQtyCell },
  { field: "BEP", cellDataType: "number", headerName: "BEP", width: 60, cellRenderer: BepCell },
  { field: "PROD_PRICE", cellDataType: "number", headerName: "PROD_PRICE", width: 100, cellRenderer: ProdPriceCell },
  { field: "DELIVERED_AMOUNT", cellDataType: "number", headerName: "DELIVERED_AMOUNT", width: 120, cellRenderer: DeliveredAmountCell },
  { field: "DELIVERED_BEP_AMOUNT", cellDataType: "number", headerName: "DELIVERED_BEP_AMOUNT", width: 120, cellRenderer: DeliveredBepAmountCell },
];

const CMS_TAIL_COLUMNS = [
  { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 90 },
  { field: "PROD_MODEL", headerName: "PROD_MODEL", width: 120 },
  { field: "PROD_PROJECT", headerName: "PROD_PROJECT", width: 120 },
  { field: "PROD_MAIN_MATERIAL", headerName: "PROD_MAIN_MATERIAL", width: 120 },
  { field: "YEARNUM", cellDataType: "number", headerName: "YEARNUM", width: 80 },
  { field: "WEEKNUM", cellDataType: "number", headerName: "WEEKNUM", width: 80 },
  { field: "INVOICE_NO", cellDataType: "string", headerName: "INVOICE_NO", width: 120 },
  { field: "REMARK", headerName: "REMARK", width: 120 },
];

const NON_CMS_TAIL_COLUMNS = [
  { field: "INVOICE_NO", cellDataType: "string", headerName: "INVOICE_NO", width: 120 },
  { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 90 },
  { field: "PROD_MODEL", headerName: "PROD_MODEL", width: 120 },
  { field: "PROD_PROJECT", headerName: "PROD_PROJECT", width: 120 },
  { field: "PROD_MAIN_MATERIAL", headerName: "PROD_MAIN_MATERIAL", width: 120 },
  { field: "DESCR", headerName: "DESCR", width: 120 },
  { field: "YEARNUM", cellDataType: "number", headerName: "YEARNUM", width: 80 },
  { field: "WEEKNUM", cellDataType: "number", headerName: "WEEKNUM", width: 80 },
  { field: "REMARK", headerName: "REMARK", width: 120 },
];

export const getInvoiceColumns = (): any[] => {
  const isCMS = getCompany() === "CMS";
  return [
    ...BASE_COLUMNS,
    ...(isCMS ? CMS_EXTRA_COLUMNS : NON_CMS_EXTRA_COLUMNS),
    ...SHARED_MID_COLUMNS,
    ...(isCMS ? CMS_TAIL_COLUMNS : NON_CMS_TAIL_COLUMNS),
  ];
};

export const XUATKHO_COLUMNS = [
  { field: "CUST_CD", headerName: "CUST_CD", width: 90, headerCheckboxSelection: true, checkboxSelection: true },
  { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 90 },
  { field: "G_CODE", headerName: "G_CODE", width: 90 },
  { field: "G_NAME", headerName: "G_NAME", width: 90 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 90 },
  { field: "OUT_DATE", headerName: "OUT_DATE", width: 90 },
  { field: "PO_NO", headerName: "PO_NO", width: 90 },
  { field: "PO_QTY", headerName: "PO_QTY", width: 90 },
  { field: "DELIVERY_QTY", headerName: "DELIVERY_QTY", width: 90 },
  { field: "PO_BALANCE", headerName: "PO_BALANCE", width: 90 },
  { field: "THISDAY_OUT_QTY", headerName: "THISDAY_OUT_QTY", width: 90 },
  { field: "CHECKSTATUS", headerName: "CHECKSTATUS", width: 90 },
];

/* ── Pivot Fields ── */
const makePivotField = (
  caption: string,
  dataField: string,
  dataType: "string" | "number" | "date",
  summaryType: "count" | "sum"
) => ({
  caption,
  width: 80,
  dataField,
  allowSorting: true,
  allowFiltering: true,
  dataType,
  summaryType,
  format: summaryType === "sum" && dataType === "number" ? "fixedPoint" : "fixedPoint",
  headerFilter: { allowSearch: true, height: 500, width: 300 },
});

export const createPivotDataSource = (data: InvoiceTableData[]) =>
  new PivotGridDataSource({
    fields: [
      makePivotField("PROD_MAIN_MATERIAL", "PROD_MAIN_MATERIAL", "string", "count"),
      makePivotField("DELIVERY_ID", "DELIVERY_ID", "number", "sum"),
      makePivotField("CUST_CD", "CUST_CD", "string", "count"),
      makePivotField("CUST_NAME_KD", "CUST_NAME_KD", "string", "count"),
      makePivotField("EMPL_NO", "EMPL_NO", "string", "count"),
      makePivotField("EMPL_NAME", "EMPL_NAME", "string", "count"),
      makePivotField("G_CODE", "G_CODE", "string", "count"),
      makePivotField("G_NAME", "G_NAME", "string", "count"),
      makePivotField("G_NAME_KD", "G_NAME_KD", "string", "count"),
      makePivotField("PO_NO", "PO_NO", "string", "count"),
      makePivotField("DELIVERY_DATE", "DELIVERY_DATE", "date", "count"),
      makePivotField("DELIVERY_QTY", "DELIVERY_QTY", "number", "sum"),
      makePivotField("PROD_PRICE", "PROD_PRICE", "number", "sum"),
      makePivotField("DELIVERED_AMOUNT", "DELIVERED_AMOUNT", "number", "sum"),
      makePivotField("REMARK", "REMARK", "string", "count"),
      makePivotField("INVOICE_NO", "INVOICE_NO", "string", "count"),
      makePivotField("PROD_TYPE", "PROD_TYPE", "string", "count"),
      makePivotField("PROD_MODEL", "PROD_MODEL", "string", "count"),
      makePivotField("PROD_PROJECT", "PROD_PROJECT", "string", "count"),
      makePivotField("YEARNUM", "YEARNUM", "number", "sum"),
      makePivotField("WEEKNUM", "WEEKNUM", "number", "sum"),
    ],
    store: data,
  });
