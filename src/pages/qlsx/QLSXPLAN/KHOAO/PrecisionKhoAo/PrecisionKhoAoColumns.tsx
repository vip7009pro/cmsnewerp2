import React from "react";
import moment from "moment";
import { datediff } from "../../../../kinhdoanh/utils/kdUtils";

export const getColumnTonKhoAo = () => [
  {
    field: "IN_KHO_ID",
    headerName: "IN_KHO_ID",
    width: 100,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    cellClass: "cell-mono",
  },
  {
    field: "FACTORY",
    headerName: "NM",
    width: 60,
    editable: false,
    cellRenderer: (params: any) => (
      <span className="cell-badge cell-badge--blue">{params.value || "-"}</span>
    ),
  },
  {
    field: "PLAN_ID_INPUT",
    headerName: "PLAN_ID",
    width: 80,
    editable: false,
    cellClass: "cell-mono",
  },
  {
    field: "PHANLOAI",
    headerName: "PL",
    width: 40,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 700, color: params.value === "F" ? "#dc2626" : "#475569" }}>
        {params.value || "-"}
      </span>
    ),
  },
  {
    field: "M_CODE",
    headerName: "M_CODE",
    width: 80,
    editable: false,
    cellClass: "cell-mono",
  },
  {
    field: "M_NAME",
    headerName: "M_NAME",
    width: 120,
    editable: false,
    cellRenderer: (params: any) => {
      if (params.data?.LIEUQL_SX === 1) {
        return (
          <span style={{ color: "#dc2626", fontWeight: 700 }}>
            {params.value}
          </span>
        );
      }
      return <span style={{ color: "#1e293b", fontWeight: 500 }}>{params.value}</span>;
    },
  },
  {
    field: "WIDTH_CD",
    headerName: "SIZE",
    width: 50,
    editable: false,
    cellClass: "cell-mono",
  },
  {
    field: "M_LOT_NO",
    headerName: "M_LOT_NO",
    width: 90,
    editable: false,
    cellRenderer: (params: any) => {
      if (!params.value) return <span>-</span>;
      const date1 = moment.utc().format("YYYY-MM-DD");
      const date2 = params.data?.INS_DATE;
      let diff: number = datediff(date1, date2);
      const ins_weekday = moment.utc(date2).weekday();
      if (ins_weekday >= 5) diff = diff - 2;

      if (diff > 1) {
        return (
          <span className="cell-badge cell-badge--red" title={`Tồn ${diff} ngày (Quá hạn)`}>
            {params.value}
          </span>
        );
      }
      return (
        <span className="cell-badge cell-badge--green" title={`Tồn ${diff} ngày (An toàn)`}>
          {params.value}
        </span>
      );
    },
  },
  {
    field: "ROLL_QTY",
    headerName: "ROLL_QTY",
    width: 70,
    editable: false,
    cellRenderer: (params: any) => {
      const isF = params.data?.PHANLOAI === "F";
      return (
        <span className={isF ? "cell-qty-red" : "cell-qty-blue"}>
          {params.value !== null && params.value !== undefined ? params.value.toLocaleString("en-US") : "-"}
        </span>
      );
    },
  },
  {
    field: "IN_QTY",
    headerName: "IN_QTY",
    width: 70,
    editable: false,
    cellRenderer: (params: any) => {
      const isF = params.data?.PHANLOAI === "F";
      return (
        <span className={isF ? "cell-qty-red" : "cell-qty-blue"}>
          {params.value !== null && params.value !== undefined ? params.value.toLocaleString("en-US") : "-"}
        </span>
      );
    },
  },
  {
    field: "TOTAL_IN_QTY",
    headerName: "TOTAL_IN_QTY",
    width: 120,
    editable: false,
    cellRenderer: (params: any) => {
      const isF = params.data?.PHANLOAI === "F";
      return (
        <span className={isF ? "cell-qty-red" : "cell-qty-green"}>
          {params.value !== null && params.value !== undefined ? params.value.toLocaleString("en-US") : "-"}
        </span>
      );
    },
  },
  {
    field: "FSC",
    headerName: "FSC",
    width: 120,
    editable: false,
    cellRenderer: (params: any) => {
      const isYes = params.data?.PHANLOAI === "Y" || params.value === "Y" || params.value === "YES";
      return isYes ? (
        <span className="cell-badge cell-badge--green">YES</span>
      ) : (
        <span className="cell-badge cell-badge--red">NO</span>
      );
    },
  },
  {
    field: "PLAN_EQ",
    headerName: "MACHINE",
    width: 70,
    editable: false,
    cellClass: "cell-mono",
  },
  {
    field: "INS_DATE",
    headerName: "INS_DATE",
    width: 100,
    editable: false,
    cellClass: "cell-mono",
  },
  {
    field: "P500_X",
    headerName: "P500_X",
    width: 100,
    editable: false,
    cellClass: "cell-mono",
  },
];

export const getColumnNhapKhoAo = () => [
  {
    field: "IN_KHO_ID",
    headerName: "IN_KHO_ID",
    width: 100,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    cellClass: "cell-mono",
  },
  {
    field: "FACTORY",
    headerName: "FACTORY",
    width: 100,
    cellRenderer: (params: any) => (
      <span className="cell-badge cell-badge--blue">{params.value || "-"}</span>
    ),
  },
  { field: "PHANLOAI", headerName: "PHANLOAI", width: 80 },
  { field: "M_CODE", headerName: "M_CODE", width: 80, cellClass: "cell-mono" },
  { field: "M_NAME", headerName: "M_NAME", width: 150 },
  { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 80, cellClass: "cell-mono" },
  { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 120, cellClass: "cell-mono" },
  { field: "PLAN_ID_INPUT", headerName: "PLAN_ID_INPUT", width: 120, cellClass: "cell-mono" },
  {
    field: "ROLL_QTY",
    headerName: "ROLL_QTY",
    width: 80,
    cellRenderer: (params: any) => (
      <span className="cell-mono">{params.value?.toLocaleString("en-US")}</span>
    ),
  },
  {
    field: "IN_QTY",
    headerName: "IN_QTY",
    width: 80,
    cellRenderer: (params: any) => (
      <span className="cell-mono">{params.value?.toLocaleString("en-US")}</span>
    ),
  },
  {
    field: "TOTAL_IN_QTY",
    headerName: "TOTAL_IN_QTY",
    width: 120,
    cellRenderer: (params: any) => (
      <span className="cell-qty-green">{params.value?.toLocaleString("en-US")}</span>
    ),
  },
  { field: "PLAN_ID_SUDUNG", headerName: "PLAN_ID_SUDUNG", width: 120, cellClass: "cell-mono" },
  {
    field: "USE_YN",
    headerName: "USE_YN",
    width: 90,
    cellRenderer: (params: any) => (
      <span className={`cell-badge cell-badge--${params.value === "O" ? "amber" : "green"}`}>
        {params.value || "-"}
      </span>
    ),
  },
  { field: "REMARK", headerName: "REMARK", width: 90 },
  { field: "INS_DATE", headerName: "INS_DATE", width: 150, cellClass: "cell-mono" },
  { field: "INS_EMPL", headerName: "INS_EMPL", width: 150 },
  { field: "KHO_CFM_DATE", headerName: "KHO_CFM_DATE", width: 100, cellClass: "cell-mono" },
  { field: "RETURN_STATUS", headerName: "RETURN_STATUS", width: 100 },
];

export const getColumnXuatKhoAo = () => [
  { field: "OUT_KHO_ID", headerName: "OUT_KHO_ID", width: 100, cellClass: "cell-mono" },
  {
    field: "FACTORY",
    headerName: "FACTORY",
    width: 80,
    cellRenderer: (params: any) => (
      <span className="cell-badge cell-badge--blue">{params.value || "-"}</span>
    ),
  },
  { field: "PHANLOAI", headerName: "PHANLOAI", width: 80 },
  { field: "M_CODE", headerName: "M_CODE", width: 80, cellClass: "cell-mono" },
  { field: "M_NAME", headerName: "M_NAME", width: 150 },
  { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 80, cellClass: "cell-mono" },
  { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 120, cellClass: "cell-mono" },
  { field: "PLAN_ID_INPUT", headerName: "PLAN_ID_INPUT", width: 120, cellClass: "cell-mono" },
  { field: "PLAN_ID_OUTPUT", headerName: "PLAN_ID_OUTPUT", width: 120, cellClass: "cell-mono" },
  {
    field: "ROLL_QTY",
    headerName: "ROLL_QTY",
    width: 80,
    cellRenderer: (params: any) => (
      <span className="cell-mono">{params.value?.toLocaleString("en-US")}</span>
    ),
  },
  {
    field: "OUT_QTY",
    headerName: "OUT_QTY",
    width: 80,
    cellRenderer: (params: any) => (
      <span className="cell-mono">{params.value?.toLocaleString("en-US")}</span>
    ),
  },
  {
    field: "TOTAL_OUT_QTY",
    headerName: "TOTAL_OUT_QTY",
    width: 80,
    cellRenderer: (params: any) => (
      <span className="cell-qty-red">{params.value?.toLocaleString("en-US")}</span>
    ),
  },
  { field: "INS_DATE", headerName: "INS_DATE", width: 150, cellClass: "cell-mono" },
  { field: "INS_EMPL", headerName: "INS_EMPL", width: 150 },
];
