import React from "react";
import moment from "moment";

const renderUtcDate = (val?: string) => {
  if (!val) return "";
  return (
    <span className="pqc1-cell-date">
      {moment.utc(val).format("YYYY-MM-DD HH:mm:ss")}
    </span>
  );
};

const renderImgLink = (params: any, num: number) => {
  const key = `IMG_${num}`;
  if (params.data?.[key]) {
    return (
      <a
        className="pqc1-cell-img-link"
        target="_blank"
        rel="noopener noreferrer"
        href={`/lineqc/${params.data?.PLAN_ID}_${num}.jpg`}
      >
        LINK
      </a>
    );
  }
  return <span className="pqc1-cell-no-img">NO</span>;
};

export const getPQC1Columns = () => [
  { field: "PQC1_ID", headerName: "PQC1_ID", width: 80, cellClass: "pqc1-cell-mono" },
  { field: "YEAR_WEEK", headerName: "YEAR_WEEK", width: 80, cellClass: "pqc1-cell-mono" },
  { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 120 },
  { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", width: 80, cellClass: "pqc1-cell-mono" },
  {
    field: "PROD_REQUEST_QTY",
    headerName: "PROD_REQUEST_QTY",
    width: 80,
    cellRenderer: (params: any) => params.data?.PROD_REQUEST_QTY?.toLocaleString("en-US") || "",
  },
  { field: "PROD_REQUEST_DATE", headerName: "PROD_REQUEST_DATE", width: 80 },
  { field: "PLAN_ID", headerName: "PLAN_ID", width: 80, cellClass: "pqc1-cell-mono" },
  { field: "PROCESS_LOT_NO", headerName: "PROCESS_LOT_NO", width: 80, cellClass: "pqc1-cell-mono" },
  { field: "G_NAME", headerName: "G_NAME", width: 250 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
  { field: "LINEQC_PIC", headerName: "LINEQC_PIC", width: 80, cellClass: "pqc1-cell-mono" },
  { field: "PROD_PIC", headerName: "PROD_PIC", width: 80, cellClass: "pqc1-cell-mono" },
  { field: "PROD_LEADER", headerName: "PROD_LEADER", width: 80, cellClass: "pqc1-cell-mono" },
  { field: "LINE_NO", headerName: "LINE_NO", width: 80 },
  { field: "STEPS", headerName: "STEPS", width: 80 },
  { field: "CAVITY", headerName: "CAVITY", width: 80 },
  {
    field: "SETTING_OK_TIME",
    cellDataType: "text",
    headerName: "SETTING_OK_TIME",
    width: 180,
    cellRenderer: (params: any) => renderUtcDate(params.data?.SETTING_OK_TIME),
  },
  { field: "FACTORY", headerName: "FACTORY", width: 80 },
  { field: "INSPECT_SAMPLE_QTY", headerName: "SAMPLE_QTY", width: 100, editable: true },
  { field: "PROD_LAST_PRICE", headerName: "PRICE", width: 80 },
  {
    field: "SAMPLE_AMOUNT",
    headerName: "SAMPLE_AMOUNT",
    width: 80,
    cellRenderer: (params: any) => (
      <span style={{ color: "#475569" }}>
        <b>
          {params.data.SAMPLE_AMOUNT?.toLocaleString("en-US", {
            style: "decimal",
            maximumFractionDigits: 8,
          })}
        </b>
      </span>
    ),
  },
  { field: "REMARK", headerName: "REMARK", width: 80 },
  { field: "PQC3_ID", headerName: "PQC3_ID", width: 80, cellClass: "pqc1-cell-mono" },
  { field: "OCCURR_TIME", headerName: "OCCURR_TIME", width: 150 },
  {
    field: "INSPECT_QTY",
    headerName: "INSPECT_QTY",
    width: 120,
    cellRenderer: (params: any) => params.data?.INSPECT_QTY?.toLocaleString("en-US") || "",
  },
  {
    field: "DEFECT_QTY",
    headerName: "DEFECT_QTY",
    width: 120,
    cellRenderer: (params: any) => params.data?.DEFECT_QTY?.toLocaleString("en-US") || "",
  },
  {
    field: "DEFECT_RATE",
    headerName: "DEFECT_RATE",
    width: 120,
    cellRenderer: (params: any) => {
      const rate = params.data?.DEFECT_RATE;
      if (rate === null || rate === undefined) return "";
      return (
        <span className="pqc1-cell-rate">
          {rate.toLocaleString("en-US", { maximumFractionDigits: 0 })}%
        </span>
      );
    },
  },
  { field: "DEFECT_PHENOMENON", headerName: "DEFECT_PHENOMENON", width: 150 },
  {
    field: "INS_DATE",
    cellDataType: "text",
    headerName: "INS_DATE",
    width: 180,
    cellRenderer: (params: any) => renderUtcDate(params.data?.INS_DATE),
  },
  {
    field: "UPD_DATE",
    cellDataType: "text",
    headerName: "UPD_DATE",
    width: 180,
    cellRenderer: (params: any) => renderUtcDate(params.data?.UPD_DATE),
  },
  {
    field: "IMG_1",
    headerName: "IMG_1",
    width: 100,
    cellRenderer: (params: any) => renderImgLink(params, 1),
  },
  {
    field: "IMG_2",
    headerName: "IMG_2",
    width: 100,
    cellRenderer: (params: any) => renderImgLink(params, 2),
  },
  {
    field: "IMG_3",
    headerName: "IMG_3",
    width: 100,
    cellRenderer: (params: any) => renderImgLink(params, 3),
  },
];
