import React from "react";
import { FiImage } from "react-icons/fi";

export const getPQC1Columns = (): Array<any> => [
  {
    field: "PQC1_ID",
    headerName: "PQC1_ID",
    width: 50,
    cellClass: "cell-code",
  },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 70 },
  { field: "LINE_NO", headerName: "LINE_NO", width: 50 },
  { field: "SETTING_OK_TIME", headerName: "SETTING_OK_TIME", width: 100 },
  {
    field: "PROCESS_LOT_NO",
    headerName: "LOT SX",
    width: 50,
    cellClass: "cell-code",
  },
  { field: "PLAN_ID", headerName: "PLAN_ID", width: 50, cellClass: "cell-code" },
  {
    field: "INSPECT_SAMPLE_QTY",
    headerName: "SAMPLE_QTY",
    width: 70,
    cellClass: "cell-number",
    cellRenderer: (params: any) =>
      params.value !== null && params.value !== undefined
        ? Number(params.value).toLocaleString()
        : "",
  },
  { field: "YEAR_WEEK", headerName: "YEAR_WEEK", width: 60 },
  { field: "FACTORY", headerName: "FACTORY", width: 50 },
  { field: "G_NAME", headerName: "G_NAME", width: 100 },
  { field: "LINEQC_PIC", headerName: "LINEQC_PIC", width: 100 },
  { field: "PROD_PIC", headerName: "PROD_PIC", width: 100 },
  { field: "PROD_LEADER", headerName: "PROD_LEADER", width: 100 },
  { field: "STEPS", headerName: "STEPS", width: 100 },
  { field: "CAVITY", headerName: "CAVITY", width: 100 },
  {
    field: "PROD_LAST_PRICE",
    headerName: "PROD_LAST_PRICE",
    width: 100,
    cellClass: "cell-number",
  },
  {
    field: "SAMPLE_AMOUNT",
    headerName: "SAMPLE_AMOUNT",
    width: 100,
    cellClass: "cell-number",
  },
  { field: "CNDB_ENCODES", headerName: "CNDB_ENCODES", width: 100 },
  { field: "REMARK", headerName: "REMARK", width: 100 },
  { field: "INS_DATE", headerName: "INS_DATE", width: 100 },
  { field: "UPD_DATE", headerName: "UPD_DATE", width: 100 },
  { field: "PQC3_ID", headerName: "PQC3_ID", width: 100 },
  { field: "OCCURR_TIME", headerName: "OCCURR_TIME", width: 100 },
  {
    field: "INSPECT_QTY",
    headerName: "INSPECT_QTY",
    width: 100,
    cellClass: "cell-number",
    cellRenderer: (params: any) =>
      params.value !== null && params.value !== undefined
        ? Number(params.value).toLocaleString()
        : "",
  },
  {
    field: "DEFECT_QTY",
    headerName: "DEFECT_QTY",
    width: 100,
    cellClass: "cell-number",
    cellRenderer: (params: any) =>
      params.value !== null && params.value !== undefined
        ? Number(params.value).toLocaleString()
        : "",
  },
  { field: "DEFECT_PHENOMENON", headerName: "DEFECT_PHENOMENON", width: 100 },
  { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", width: 100 },
  {
    field: "PROD_REQUEST_QTY",
    headerName: "PROD_REQUEST_QTY",
    width: 100,
    cellClass: "cell-number",
  },
  { field: "PROD_REQUEST_DATE", headerName: "PROD_REQUEST_DATE", width: 100 },
];

export const getPQC3Columns = (onViewImage?: (imageUrl: string, title: string) => void): Array<any> => [
  {
    field: "YEAR_WEEK",
    headerName: "YEAR_WEEK",
    width: 60,
    editable: false,
  },
  {
    field: "PQC3_ID",
    headerName: "PQC3_ID",
    width: 50,
    editable: false,
    cellClass: "cell-code",
  },
  {
    field: "PQC1_ID",
    headerName: "PQC1_ID",
    width: 50,
    editable: false,
    cellClass: "cell-code",
  },
  {
    field: "CUST_NAME_KD",
    headerName: "CUST_NAME_KD",
    width: 90,
    editable: false,
  },
  {
    field: "FACTORY",
    headerName: "FACTORY",
    width: 50,
    editable: false,
  },
  {
    field: "PROD_REQUEST_NO",
    headerName: "YCSX_NO",
    width: 60,
    editable: false,
    cellClass: "cell-code",
  },
  {
    field: "PROD_REQUEST_DATE",
    headerName: "YCSX_DATE",
    width: 60,
    editable: false,
  },
  {
    field: "PROCESS_LOT_NO",
    headerName: "LOTSX",
    width: 50,
    editable: false,
    cellClass: "cell-code",
  },
  {
    field: "G_CODE",
    headerName: "G_CODE",
    width: 50,
    editable: false,
    cellClass: "cell-code",
  },
  {
    field: "G_NAME",
    headerName: "G_NAME",
    width: 100,
    editable: false,
  },
  {
    field: "G_NAME_KD",
    headerName: "G_NAME_KD",
    width: 80,
    editable: false,
  },
  {
    field: "PROD_LAST_PRICE",
    headerName: "PRICE",
    width: 50,
    editable: false,
    cellClass: "cell-number",
  },
  {
    field: "LINEQC_PIC",
    headerName: "LINEQC_PIC",
    width: 60,
    editable: false,
  },
  {
    field: "PROD_PIC",
    headerName: "PROD_PIC",
    width: 60,
    editable: false,
  },
  {
    field: "PROD_LEADER",
    headerName: "PROD_LEADER",
    width: 80,
    editable: false,
  },
  {
    field: "LINE_NO",
    headerName: "LINE_NO",
    width: 50,
    editable: false,
  },
  {
    field: "OCCURR_TIME",
    headerName: "OCCURR_TIME",
    width: 70,
    editable: false,
  },
  {
    field: "INSPECT_QTY",
    headerName: "INSPECT_QTY",
    width: 70,
    editable: false,
    cellClass: "cell-number",
    cellRenderer: (params: any) =>
      params.value !== null && params.value !== undefined
        ? Number(params.value).toLocaleString()
        : "",
  },
  {
    field: "DEFECT_QTY",
    headerName: "DEFECT_QTY",
    width: 70,
    editable: false,
    cellClass: "cell-number",
    cellRenderer: (params: any) => {
      const val = Number(params.value) || 0;
      return (
        <span
          style={{
            fontWeight: 700,
            color: val > 0 ? "#e11d48" : "#475569",
          }}
        >
          {val.toLocaleString()}
        </span>
      );
    },
  },
  {
    field: "DEFECT_AMOUNT",
    headerName: "DEFECT_AMOUNT",
    width: 90,
    editable: false,
    cellClass: "cell-number",
    cellRenderer: (params: any) =>
      params.value !== null && params.value !== undefined
        ? Number(params.value).toLocaleString()
        : "",
  },
  {
    field: "DEFECT_PHENOMENON",
    headerName: "DEFECT_PHENOMENON",
    width: 100,
    editable: false,
  },
  {
    field: "DEFECT_IMAGE_LINK",
    headerName: "IMAGE_LINK",
    width: 70,
    editable: false,
    cellRenderer: (params: any) => {
      const pqc3Id = params.data?.PQC3_ID;
      if (!pqc3Id) return "";
      const imgUrl = `/pqc/PQC3_${pqc3Id}.png`;
      return (
        <button
          type="button"
          onClick={() =>
            onViewImage?.(imgUrl, `Ảnh lỗi PQC3 #${pqc3Id} (${params.data?.G_NAME || ""})`)
          }
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "3px",
            padding: "1px 6px",
            fontSize: "10px",
            fontWeight: 700,
            color: "#2563eb",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "3px",
            cursor: "pointer",
          }}
          title="Xem ảnh lỗi chi tiết"
        >
          <FiImage size={11} /> Xem ảnh
        </button>
      );
    },
  },
  {
    field: "REMARK",
    headerName: "REMARK",
    width: 100,
    editable: false,
  },
  {
    field: "WORST5",
    headerName: "WORST5",
    width: 150,
    editable: false,
  },
  {
    field: "WORST5_MONTH",
    headerName: "WORST5_MONTH",
    width: 50,
    editable: false,
  },
  {
    field: "ERR_CODE",
    headerName: "ERR_CODE",
    width: 60,
    editable: false,
    cellClass: "cell-code",
  },
  {
    field: "NG_NHAN",
    headerName: "NG_NHAN",
    width: 250,
    editable: false,
  },
  {
    field: "DOI_SACH",
    headerName: "DOI_SACH",
    width: 150,
    editable: false,
  },
  {
    field: "STATUS",
    headerName: "STATUS",
    width: 150,
    editable: false,
  },
];
