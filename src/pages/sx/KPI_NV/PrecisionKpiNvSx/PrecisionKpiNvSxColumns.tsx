import React from "react";
import { ColDef } from "ag-grid-community";

const formatNumber = (val: any, fractionDigits: number = 0) => {
  if (val === null || val === undefined || isNaN(Number(val))) return "0";
  return Number(val).toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

const formatPercent = (val: any) => {
  if (val === null || val === undefined || isNaN(Number(val))) return "0%";
  const num = Number(val);
  // Giá trị trong data có thể là 0.85 hoặc 85 tuỳ API, ở bản cũ: style: "percent" trên params.value (nghĩa là 0.85 -> 85%)
  const percentVal = num <= 1 && num > 0 ? num * 100 : num;
  return `${percentVal.toFixed(0)}%`;
};

const renderRateBadge = (val: any) => {
  if (val === null || val === undefined || isNaN(Number(val))) {
    return <span className="rate-badge rate-badge--muted">0%</span>;
  }
  const num = Number(val);
  const percentVal = num <= 1 && num > 0 ? num * 100 : num;
  let modifier = "normal";
  if (percentVal >= 100) modifier = "success";
  else if (percentVal >= 80) modifier = "primary";
  else if (percentVal >= 50) modifier = "warning";
  else modifier = "danger";

  return (
    <span className={`rate-badge rate-badge--${modifier}`}>
      {percentVal.toFixed(0)}%
    </span>
  );
};

// Cấu hình 16 cột Daily (giữ nguyên 100% headerName và width gốc)
export const getKpiNvSxDailyColumns = (): ColDef[] => [
  { field: "id", headerName: "ID", width: 45, cellClass: "cell-code font-mono text-center" },
  {
    field: "INS_EMPL",
    headerName: "INS_EMPL",
    width: 90,
    cellRenderer: (params: any) => (
      <div className="empl-cell">
        <span className="empl-badge">{params.value || "-"}</span>
      </div>
    ),
  },
  { field: "SX_DATE", headerName: "SX_DATE", width: 85, cellClass: "font-mono text-center text-slate-700" },
  { field: "SX_YEAR", headerName: "SX_YEAR", width: 65, cellClass: "font-mono text-center text-slate-500" },
  { field: "SX_WEEK", headerName: "SX_WEEK", width: 65, cellClass: "font-mono text-center text-slate-500" },
  { field: "SX_MONTH", headerName: "SX_MONTH", width: 65, cellClass: "font-mono text-center text-slate-500" },
  { field: "SX_YW", headerName: "SX_YW", width: 75, cellClass: "font-mono text-center text-slate-600 font-semibold" },
  { field: "SX_YM", headerName: "SX_YM", width: 75, cellClass: "font-mono text-center text-slate-600 font-semibold" },
  {
    field: "PLAN_MET",
    headerName: "PLAN_MET",
    width: 95,
    cellRenderer: (params: any) => (
      <span className="font-mono text-blue-600 font-semibold">
        {formatNumber(params.value)} m
      </span>
    ),
  },
  {
    field: "PLAN_QTY",
    headerName: "PLAN_QTY",
    width: 95,
    cellRenderer: (params: any) => (
      <span className="font-mono text-rose-600 font-semibold">
        {formatNumber(params.value)} EA
      </span>
    ),
  },
  {
    field: "OUTPUT_M_LT",
    headerName: "OUTPUT_M_LT",
    width: 95,
    cellRenderer: (params: any) => (
      <span className="font-mono text-emerald-600 font-semibold">
        {formatNumber(params.value)} m
      </span>
    ),
  },
  {
    field: "OUTPUT_M_TT",
    headerName: "OUTPUT_M_TT",
    width: 95,
    cellRenderer: (params: any) => (
      <span className="font-mono text-blue-700 font-bold">
        {formatNumber(params.value)} m
      </span>
    ),
  },
  {
    field: "OUTPUT_EA_LT",
    headerName: "OUTPUT_EA_LT",
    width: 95,
    cellRenderer: (params: any) => (
      <span className="font-mono text-blue-600 font-semibold">
        {formatNumber(params.value)} EA
      </span>
    ),
  },
  {
    field: "OUTPUT_EA_TT",
    headerName: "OUTPUT_EA_TT",
    width: 95,
    cellRenderer: (params: any) => (
      <span className="font-mono text-emerald-700 font-bold">
        {formatNumber(params.value)} EA
      </span>
    ),
  },
  {
    field: "RATE_M",
    headerName: "RATE_M",
    width: 90,
    cellRenderer: (params: any) => renderRateBadge(params.value),
  },
  {
    field: "RATE_EA",
    headerName: "RATE_EA",
    width: 90,
    cellRenderer: (params: any) => renderRateBadge(params.value),
  },
];

// Cấu hình 14 cột Weekly (giữ nguyên 100% headerName và width gốc)
export const getKpiNvSxWeeklyColumns = (): ColDef[] => [
  { field: "id", headerName: "ID", width: 45, cellClass: "cell-code font-mono text-center" },
  {
    field: "INS_EMPL",
    headerName: "INS_EMPL",
    width: 90,
    cellRenderer: (params: any) => (
      <div className="empl-cell">
        <span className="empl-badge">{params.value || "-"}</span>
      </div>
    ),
  },
  { field: "SX_YEAR", headerName: "SX_YEAR", width: 70, cellClass: "font-mono text-center text-slate-500" },
  { field: "SX_WEEK", headerName: "SX_WEEK", width: 70, cellClass: "font-mono text-center text-slate-500" },
  { field: "SX_YW", headerName: "SX_YW", width: 85, cellClass: "font-mono text-center text-slate-600 font-semibold" },
  {
    field: "PLAN_MET",
    headerName: "PLAN_MET",
    width: 100,
    cellRenderer: (params: any) => (
      <span className="font-mono text-blue-600 font-semibold">
        {formatNumber(params.value)} m
      </span>
    ),
  },
  {
    field: "PLAN_QTY",
    headerName: "PLAN_QTY",
    width: 100,
    cellRenderer: (params: any) => (
      <span className="font-mono text-rose-600 font-semibold">
        {formatNumber(params.value)} EA
      </span>
    ),
  },
  {
    field: "OUTPUT_M_LT",
    headerName: "OUTPUT_M_LT",
    width: 100,
    cellRenderer: (params: any) => (
      <span className="font-mono text-emerald-600 font-semibold">
        {formatNumber(params.value)} m
      </span>
    ),
  },
  {
    field: "OUTPUT_M_TT",
    headerName: "OUTPUT_M_TT",
    width: 100,
    cellRenderer: (params: any) => (
      <span className="font-mono text-blue-700 font-bold">
        {formatNumber(params.value)} m
      </span>
    ),
  },
  {
    field: "OUTPUT_EA_LT",
    headerName: "OUTPUT_EA_LT",
    width: 100,
    cellRenderer: (params: any) => (
      <span className="font-mono text-blue-600 font-semibold">
        {formatNumber(params.value)} EA
      </span>
    ),
  },
  {
    field: "OUTPUT_EA_TT",
    headerName: "OUTPUT_EA_TT",
    width: 100,
    cellRenderer: (params: any) => (
      <span className="font-mono text-emerald-700 font-bold">
        {formatNumber(params.value)} EA
      </span>
    ),
  },
  {
    field: "RATE_M",
    headerName: "RATE_M",
    width: 90,
    cellRenderer: (params: any) => renderRateBadge(params.value),
  },
  {
    field: "RATE_EA",
    headerName: "RATE_EA",
    width: 90,
    cellRenderer: (params: any) => renderRateBadge(params.value),
  },
];

// Cấu hình 14 cột Monthly (giữ nguyên 100% headerName và width gốc)
export const getKpiNvSxMonthlyColumns = (): ColDef[] => [
  { field: "id", headerName: "ID", width: 45, cellClass: "cell-code font-mono text-center" },
  {
    field: "INS_EMPL",
    headerName: "INS_EMPL",
    width: 90,
    cellRenderer: (params: any) => (
      <div className="empl-cell">
        <span className="empl-badge">{params.value || "-"}</span>
      </div>
    ),
  },
  { field: "SX_YEAR", headerName: "SX_YEAR", width: 70, cellClass: "font-mono text-center text-slate-500" },
  { field: "SX_MONTH", headerName: "SX_MONTH", width: 70, cellClass: "font-mono text-center text-slate-500" },
  { field: "SX_YM", headerName: "SX_YM", width: 85, cellClass: "font-mono text-center text-slate-600 font-semibold" },
  {
    field: "PLAN_MET",
    headerName: "PLAN_MET",
    width: 100,
    cellRenderer: (params: any) => (
      <span className="font-mono text-blue-600 font-semibold">
        {formatNumber(params.value)} m
      </span>
    ),
  },
  {
    field: "PLAN_QTY",
    headerName: "PLAN_QTY",
    width: 100,
    cellRenderer: (params: any) => (
      <span className="font-mono text-rose-600 font-semibold">
        {formatNumber(params.value)} EA
      </span>
    ),
  },
  {
    field: "OUTPUT_M_LT",
    headerName: "OUTPUT_M_LT",
    width: 100,
    cellRenderer: (params: any) => (
      <span className="font-mono text-emerald-600 font-semibold">
        {formatNumber(params.value)} m
      </span>
    ),
  },
  {
    field: "OUTPUT_M_TT",
    headerName: "OUTPUT_M_TT",
    width: 100,
    cellRenderer: (params: any) => (
      <span className="font-mono text-blue-700 font-bold">
        {formatNumber(params.value)} m
      </span>
    ),
  },
  {
    field: "OUTPUT_EA_LT",
    headerName: "OUTPUT_EA_LT",
    width: 100,
    cellRenderer: (params: any) => (
      <span className="font-mono text-blue-600 font-semibold">
        {formatNumber(params.value)} EA
      </span>
    ),
  },
  {
    field: "OUTPUT_EA_TT",
    headerName: "OUTPUT_EA_TT",
    width: 100,
    cellRenderer: (params: any) => (
      <span className="font-mono text-emerald-700 font-bold">
        {formatNumber(params.value)} EA
      </span>
    ),
  },
  {
    field: "RATE_M",
    headerName: "RATE_M",
    width: 90,
    cellRenderer: (params: any) => renderRateBadge(params.value),
  },
  {
    field: "RATE_EA",
    headerName: "RATE_EA",
    width: 90,
    cellRenderer: (params: any) => renderRateBadge(params.value),
  },
];

// Cấu hình 12 cột Yearly (giữ nguyên 100% headerName và width gốc)
export const getKpiNvSxYearlyColumns = (): ColDef[] => [
  { field: "id", headerName: "ID", width: 45, cellClass: "cell-code font-mono text-center" },
  {
    field: "INS_EMPL",
    headerName: "INS_EMPL",
    width: 90,
    cellRenderer: (params: any) => (
      <div className="empl-cell">
        <span className="empl-badge">{params.value || "-"}</span>
      </div>
    ),
  },
  { field: "SX_YEAR", headerName: "SX_YEAR", width: 80, cellClass: "font-mono text-center text-slate-600 font-semibold" },
  {
    field: "PLAN_MET",
    headerName: "PLAN_MET",
    width: 110,
    cellRenderer: (params: any) => (
      <span className="font-mono text-blue-600 font-semibold">
        {formatNumber(params.value)} m
      </span>
    ),
  },
  {
    field: "PLAN_QTY",
    headerName: "PLAN_QTY",
    width: 110,
    cellRenderer: (params: any) => (
      <span className="font-mono text-rose-600 font-semibold">
        {formatNumber(params.value)} EA
      </span>
    ),
  },
  {
    field: "OUTPUT_M_LT",
    headerName: "OUTPUT_M_LT",
    width: 110,
    cellRenderer: (params: any) => (
      <span className="font-mono text-emerald-600 font-semibold">
        {formatNumber(params.value)} m
      </span>
    ),
  },
  {
    field: "OUTPUT_M_TT",
    headerName: "OUTPUT_M_TT",
    width: 110,
    cellRenderer: (params: any) => (
      <span className="font-mono text-blue-700 font-bold">
        {formatNumber(params.value)} m
      </span>
    ),
  },
  {
    field: "OUTPUT_EA_LT",
    headerName: "OUTPUT_EA_LT",
    width: 110,
    cellRenderer: (params: any) => (
      <span className="font-mono text-blue-600 font-semibold">
        {formatNumber(params.value)} EA
      </span>
    ),
  },
  {
    field: "OUTPUT_EA_TT",
    headerName: "OUTPUT_EA_TT",
    width: 110,
    cellRenderer: (params: any) => (
      <span className="font-mono text-emerald-700 font-bold">
        {formatNumber(params.value)} EA
      </span>
    ),
  },
  {
    field: "RATE_M",
    headerName: "RATE_M",
    width: 90,
    cellRenderer: (params: any) => renderRateBadge(params.value),
  },
  {
    field: "RATE_EA",
    headerName: "RATE_EA",
    width: 90,
    cellRenderer: (params: any) => renderRateBadge(params.value),
  },
];
