// PrecisionKHOLIEUColumns.tsx - Cấu hình cột AG-Grid chuẩn 100% theo bản gốc cho Kho Liệu

import React from "react";

// ==========================================
// 1. CỘT DATA XUẤT (column_XUATLIEUDATA)
// ==========================================
export const column_XUATLIEUDATA = [
  {
    field: "G_CODE",
    headerName: "G_CODE",
    width: 50,
    headerCheckboxSelection: true,
    checkboxSelection: true,
  },
  { field: "G_NAME", headerName: "G_NAME", width: 100 },
  { field: "PROD_REQUEST_NO", headerName: "SO YCSX", width: 50 },
  { field: "PLAN_ID", headerName: "PLAN_ID", width: 50 },
  { field: "M_CODE", headerName: "M_CODE", width: 50 },
  { field: "M_NAME", headerName: "M_NAME", width: 90 },
  { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 60 },
  { field: "LOTNCC", headerName: "LOTNCC", width: 90 },
  { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 60 },
  {
    field: "OUT_CFM_QTY",
    headerName: "UNIT_QTY",
    width: 60,
    cellRenderer: (params: any) => {
      return (
        <span style={{ color: "green" }}>
          <b>{params.data.OUT_CFM_QTY?.toLocaleString("en-US")}</b>
        </span>
      );
    },
  },
  { field: "ROLL_QTY", headerName: "ROLL_QTY", width: 60 },
  {
    field: "TOTAL_OUT_QTY",
    headerName: "OUTPUT QTY",
    width: 70,
    cellRenderer: (params: any) => {
      return (
        <span style={{ color: "green" }}>
          <b>{params.data.TOTAL_OUT_QTY?.toLocaleString("en-US")}</b>
        </span>
      );
    },
  },
  { field: "INS_DATE", headerName: "INS_DATE", width: 100 },
  { field: "INS_EMPL", headerName: "NV_GIAO", width: 60 },
  { field: "INS_RECEPTION", headerName: "NV_NHAN", width: 60 },
];

// ==========================================
// 2. CỘT DATA NHẬP (column_NHAPLIEUDATA)
// ==========================================
export const column_NHAPLIEUDATA = [
  {
    field: "MAKER",
    headerName: "MAKER",
    width: 80,
    headerCheckboxSelection: true,
    checkboxSelection: true,
  },
  { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 80 },
  { field: "LOTNCC", headerName: "LOTNCC", width: 60 },
  { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 70 },
  { field: "M_CODE", headerName: "M_CODE", width: 50 },
  { field: "M_NAME", headerName: "M_NAME", width: 100 },
  { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 60 },
  {
    field: "IN_CFM_QTY",
    headerName: "UNIT QTY",
    width: 60,
    cellRenderer: (params: any) => {
      return (
        <span style={{ color: "green" }}>
          <b>{params.data.IN_CFM_QTY?.toLocaleString("en-US")}</b>
        </span>
      );
    },
  },
  { field: "ROLL_QTY", headerName: "ROLL_QTY", width: 60 },
  {
    field: "TOTAL_IN_QTY",
    headerName: "INPUT QTY",
    width: 60,
    cellRenderer: (params: any) => {
      return (
        <span style={{ color: "green" }}>
          <b>{params.data.TOTAL_IN_QTY?.toLocaleString("en-US")}</b>
        </span>
      );
    },
  },
  {
    field: "USE_YN",
    headerName: "USE_YN",
    width: 60,
    cellStyle: (params: any) => {
      if (params.data.USE_YN !== "X") {
        return { backgroundColor: "green", color: "white", textAlign: "center" };
      } else {
        return { backgroundColor: "red", color: "white", textAlign: "center" };
      }
    },
  },
  { field: "INVOICE", headerName: "INVOICE", width: 100 },
  {
    field: "EXP_DATE",
    headerName: "EXP_DATE",
    width: 60,
    cellRenderer: (params: any) => {
      if (new Date(params.data.EXP_DATE) > new Date()) {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.EXP_DATE?.toLocaleString("en-US")}</b>
          </span>
        );
      } else {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.EXP_DATE?.toLocaleString("en-US")}</b>
          </span>
        );
      }
    },
  },
  { field: "PHAN_LOAI", headerName: "PHAN_LOAI", width: 60 },
  { field: "FACTORY", headerName: "FACTORY", width: 60 },
  { field: "LOC_CD", headerName: "LOC_CD", width: 60 },
  { field: "INS_DATE", headerName: "INS_DATE", width: 100 },
  { field: "QC_PASS", headerName: "QC_PASS", width: 70 },
  { field: "QC_PASS_EMPL", headerName: "QC_PASS_EMPL", width: 90 },
  { field: "QC_PASS_DATE", headerName: "QC_PASS_DATE", width: 90 },
];

// ==========================================
// 3. CỘT TỒN LIỆU (column_STOCK_LIEU)
// ==========================================
export const column_STOCK_LIEU = [
  {
    field: "M_CODE",
    headerName: "M_CODE",
    width: 100,
    headerCheckboxSelection: true,
    checkboxSelection: true,
  },
  { field: "M_NAME", headerName: "M_NAME", width: 100 },
  { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 60 },
  {
    field: "TON_NM1",
    headerName: "TON_NM1",
    width: 60,
    cellRenderer: (params: any) => {
      return (
        <span style={{ color: "gray" }}>
          <b>{params.data.TON_NM1?.toLocaleString("en-US")}</b>
        </span>
      );
    },
  },
  {
    field: "TON_NM2",
    headerName: "TON_NM2",
    width: 60,
    cellRenderer: (params: any) => {
      return (
        <span style={{ color: "gray" }}>
          <b>{params.data.TON_NM2?.toLocaleString("en-US")}</b>
        </span>
      );
    },
  },
  {
    field: "HOLDING_NM1",
    headerName: "HOLDING_NM1",
    width: 80,
    cellRenderer: (params: any) => {
      return (
        <span style={{ color: "red" }}>
          <b>{params.data.HOLDING_NM1?.toLocaleString("en-US")}</b>
        </span>
      );
    },
  },
  {
    field: "HOLDING_NM2",
    headerName: "HOLDING_NM2",
    width: 80,
    cellRenderer: (params: any) => {
      return (
        <span style={{ color: "red" }}>
          <b>{params.data.HOLDING_NM2?.toLocaleString("en-US")}</b>
        </span>
      );
    },
  },
  {
    field: "TOTAL_OK",
    headerName: "TOTAL_OK",
    width: 80,
    cellRenderer: (params: any) => {
      return (
        <span style={{ color: "green" }}>
          <b>{params.data.TOTAL_OK?.toLocaleString("en-US")}</b>
        </span>
      );
    },
  },
  {
    field: "TOTAL_HOLDING",
    headerName: "TOTAL_HOLDING",
    width: 110,
    cellRenderer: (params: any) => {
      return (
        <span style={{ color: "red" }}>
          <b>{params.data.TOTAL_HOLDING?.toLocaleString("en-US")}</b>
        </span>
      );
    },
  },
];
