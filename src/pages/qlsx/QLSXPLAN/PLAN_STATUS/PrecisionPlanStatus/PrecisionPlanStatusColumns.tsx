import React from "react";
import { SX_DATA } from "../../interfaces/khsxInterface";

const renderStatusPill = (condition: boolean, okText: string, ngText: string) => {
  return (
    <span className={`status-pill ${condition ? "pill-ok" : "pill-ng"}`}>
      {condition ? okText : ngText}
    </span>
  );
};

export const column_plan_status: any = [
  {
    field: "id",
    headerName: "STT",
    width: 50,
    resizable: true,
    cellRenderer: (params: any) => <span>{(params.data.id || 0) + 1}</span>,
  },
  {
    field: "PLAN_ID",
    headerName: "PLAN_ID",
    width: 80,
    pinned: "left",
    resizable: true,
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 700, color: "#0369a1" }}>{params.data.PLAN_ID}</span>
    ),
  },
  {
    field: "G_NAME_KD",
    headerName: "CODE KD",
    width: 140,
    pinned: "left",
    resizable: true,
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 600, color: "#0f172a" }}>{params.data.G_NAME_KD}</span>
    ),
  },
  {
    field: "PLAN_DATE",
    headerName: "PLAN_DATE",
    width: 95,
    resizable: true,
  },
  {
    field: "WORK_SHIFT",
    headerName: "CA SX",
    width: 85,
    resizable: true,
    cellRenderer: (params: any) => {
      const shift = params.data.WORK_SHIFT;
      const text = shift === null ? "CHƯA SX" : shift === "DAY" ? "CA NGÀY" : "CA ĐÊM";
      return <span>{text}</span>;
    },
  },
  {
    field: "PLAN_FACTORY",
    headerName: "XƯỞNG",
    width: 65,
    resizable: true,
  },
  {
    field: "PLAN_EQ",
    headerName: "MÁY",
    width: 75,
    resizable: true,
  },
  {
    field: "STEP",
    headerName: "STEP",
    width: 65,
    resizable: true,
    cellRenderer: (params: any) => (
      <span>{params.data.STEP === 0 ? "F" : params.data.STEP}</span>
    ),
  },
  {
    field: "XUATDAO",
    headerName: "XUẤT DAO",
    width: 95,
    resizable: true,
    cellRenderer: (params: any) =>
      renderStatusPill(params.data.XUATDAO !== null, "Đã xuất", "Chưa xuất"),
  },
  {
    field: "SETTING_START_TIME",
    headerName: "BĐ SETTING",
    width: 95,
    resizable: true,
    cellRenderer: (params: any) =>
      renderStatusPill(params.data.SETTING_START_TIME !== null, "Đã BĐ", "Chưa BĐ"),
  },
  {
    field: "MASS_START_TIME",
    headerName: "KT SETTING",
    width: 95,
    resizable: true,
    cellRenderer: (params: any) =>
      renderStatusPill(params.data.MASS_START_TIME !== null, "Đã KT", "Chưa KT"),
  },
  {
    field: "DKXL",
    headerName: "ĐK LIỆU",
    width: 95,
    resizable: true,
    cellRenderer: (params: any) =>
      renderStatusPill(params.data.DKXL !== null, "Đã ĐK", "Chưa ĐK"),
  },
  {
    field: "XUATLIEU",
    headerName: "XUẤT LIỆU",
    width: 95,
    resizable: true,
    cellRenderer: (params: any) =>
      renderStatusPill(params.data.XUATLIEU !== null, "Đã xuất", "Chưa xuất"),
  },
  {
    field: "IN_TEM",
    headerName: "IN TEM",
    width: 95,
    resizable: true,
    cellRenderer: (params: any) =>
      renderStatusPill(params.data.IN_TEM !== null, "Đã in", "Chưa in"),
  },
  {
    field: "CHOTBC",
    headerName: "CHỐT BC",
    width: 95,
    resizable: true,
    cellRenderer: (params: any) =>
      renderStatusPill(params.data.CHOTBC !== null, "Đã chốt", "Chưa chốt"),
  },
  {
    field: "PLAN_QTY",
    headerName: "PLAN QTY",
    width: 90,
    resizable: true,
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 600 }}>
        {(params.data.PLAN_QTY || 0).toLocaleString("en-US")}
      </span>
    ),
  },
  {
    field: "KETQUASX",
    headerName: "KẾT QUẢ",
    width: 90,
    resizable: true,
    cellRenderer: (params: any) => {
      const data: SX_DATA = params.data;
      const kq =
        data.CHOTBC === null
          ? data.KQ_SX_TAM === null
            ? 0
            : data.KQ_SX_TAM
          : data.KETQUASX || 0;
      return (
        <span style={{ fontWeight: 700, color: "#059669" }}>
          {kq.toLocaleString("en-US")}
        </span>
      );
    },
  },
  {
    field: "TIENDO",
    headerName: "TIẾN ĐỘ %",
    width: 90,
    resizable: true,
    cellRenderer: (params: any) => {
      const data: SX_DATA = params.data;
      const kq =
        data.CHOTBC === null
          ? data.KQ_SX_TAM === null
            ? 0
            : data.KQ_SX_TAM
          : data.KETQUASX || 0;
      const plan = data.PLAN_QTY || 0;
      const pct = plan === 0 ? 0 : Math.round((kq / plan) * 100);
      const color = pct >= 100 ? "#059669" : pct >= 50 ? "#0284c7" : "#d97706";
      return (
        <span style={{ fontWeight: 700, color }}>
          {pct}%
        </span>
      );
    },
  },
];
