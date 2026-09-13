import React from "react";
import { CustomCellRendererProps } from "ag-grid-react";
import { PROD_OVER_DATA } from "../../interfaces/kdInterface";
import { KdCfmCellRenderer, HandleStatusCellRenderer } from "./PrecisionOverCells";

interface ColumnsProps {
  onUpdateData: (row: PROD_OVER_DATA, updateValue: string) => Promise<void>;
}

export const getPrecisionOverColumns = ({ onUpdateData }: ColumnsProps) => {
  return [
    {
      field: "AUTO_ID",
      headerName: "ID",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 65,
      resizable: true,
      pinned: "left" as const,
      floatingFilter: true,
      filter: true,
      cellStyle: { display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 },
    },
    {
      field: "EMPL_NO",
      headerName: "KD_EMPL_NO",
      width: 95,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
    },
    {
      field: "CUST_NAME_KD",
      headerName: "CUSTOMER",
      width: 110,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
      cellStyle: { fontWeight: 700, color: "#1e40af" },
    },
    {
      field: "G_CODE",
      headerName: "G_CODE",
      width: 85,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
      cellStyle: { fontWeight: 600, color: "#475569" },
    },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 170,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
      cellStyle: { fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "10.5px" },
    },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 160,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
      cellStyle: { fontWeight: 600 },
    },
    {
      field: "PROD_REQUEST_NO",
      headerName: "PROD_REQUEST_NO",
      width: 105,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
    },
    {
      field: "PLAN_ID",
      headerName: "PLAN_ID",
      width: 105,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
    },
    {
      field: "PROD_REQUEST_QTY",
      headerName: "YCSX_QTY",
      width: 85,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
      cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <span style={{ color: "#2563eb", fontWeight: "bold" }}>
            {params.data?.PROD_REQUEST_QTY?.toLocaleString("en-US")}
          </span>
        );
      },
      cellStyle: { justifyContent: "flex-end" },
    },
    {
      field: "OVER_QTY",
      headerName: "OVER_QTY",
      width: 85,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
      cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <span style={{ color: "#e11d48", fontWeight: "800" }}>
            {params.data?.OVER_QTY?.toLocaleString("en-US")}
          </span>
        );
      },
      cellStyle: { justifyContent: "flex-end", backgroundColor: "#fff1f2" },
    },
    {
      field: "PROD_LAST_PRICE",
      headerName: "PRICE",
      width: 75,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
      cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <span style={{ color: "#475569", fontWeight: "600" }}>
            {params.data?.PROD_LAST_PRICE?.toLocaleString("en-US")}
          </span>
        );
      },
      cellStyle: { justifyContent: "flex-end" },
    },
    {
      field: "AMOUNT",
      headerName: "AMOUNT",
      width: 85,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
      cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <span style={{ color: "#7e22ce", fontWeight: "800" }}>
            {params.data?.AMOUNT?.toLocaleString("en-US", { style: "currency", currency: "USD" })}
          </span>
        );
      },
      cellStyle: { justifyContent: "flex-end", backgroundColor: "#faf5ff" },
    },
    {
      field: "KD_CFM",
      headerName: "KD_CFM",
      width: 125,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
      cellRenderer: (params: CustomCellRendererProps) => (
        <KdCfmCellRenderer {...params} onUpdateData={onUpdateData} />
      ),
      cellStyle: (params: any) => {
        if (params.data?.KD_CFM === "Y") {
          return { backgroundColor: "#f0fdf4" };
        } else if (params.data?.KD_CFM === "N") {
          return { backgroundColor: "#fff1f2" };
        } else {
          return { backgroundColor: "#fffbeb" };
        }
      },
    },
    {
      field: "KD_EMPL_NO",
      headerName: "KD_CFM_EMPL",
      width: 95,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
    },
    {
      field: "KD_CF_DATETIME",
      headerName: "KD_CF_DATETIME",
      width: 125,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
    },
    {
      field: "KD_REMARK",
      headerName: "KD_REMARK",
      width: 120,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: true,
      cellStyle: { backgroundColor: "#f8fafc" },
    },
    {
      field: "HANDLE_STATUS",
      headerName: "HANDLE_STATUS",
      width: 105,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
      cellRenderer: HandleStatusCellRenderer,
    },
    {
      field: "INS_DATE",
      headerName: "INS_DATE",
      width: 110,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
    },
    {
      field: "INS_EMPL",
      headerName: "INS_EMPL",
      width: 75,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
    },
    {
      field: "UPD_DATE",
      headerName: "UPD_DATE",
      width: 110,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
    },
    {
      field: "UPD_EMPL",
      headerName: "UPD_EMPL",
      width: 75,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
    },
  ];
};
