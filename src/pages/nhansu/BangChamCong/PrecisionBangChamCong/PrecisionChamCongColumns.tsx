import React from "react";
import { getCompany } from "../../../../api/Api";

export const getChamCongColumns = () => {
  const isCMS = getCompany() === "CMS";

  const baseColumns: any[] = [
    {
      field: "DATE_COLUMN",
      headerName: "DATE_COLUMN",
      width: 105,
      type: "date",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: "left",
    },
    {
      field: "WEEKDAY",
      headerName: "WEEKDAY",
      width: 75,
    },
    {
      field: "NV_CCID",
      headerName: "NV_CCID",
      width: 65,
      cellStyle: { textAlign: "right", fontFamily: "JetBrains Mono" },
    },
    {
      field: "EMPL_NO",
      headerName: "EMPL_NO",
      width: 75,
      cellStyle: { fontFamily: "JetBrains Mono", fontWeight: "600" },
    },
    {
      field: "CMS_ID",
      headerName: "NS_ID",
      width: 70,
      cellStyle: { fontFamily: "JetBrains Mono", color: "#64748b" },
    },
    {
      field: "FULL_NAME",
      headerName: "FULL_NAME",
      width: 140,
      cellRenderer: (params: any) => {
        return (
          <span className="cell-user-name">
            {params.data?.FULL_NAME || ""}
          </span>
        );
      },
    },
    {
      field: "FACTORY_NAME",
      headerName: "FACTORY_NAME",
      width: 85,
    },
    {
      field: "WORK_SHIF_NAME",
      headerName: "WORK_SHIFT_NAME",
      width: 95,
      cellRenderer: (params: any) => {
        const val = params.value || "";
        const modifier =
          val === "TEAM 1"
            ? "team1"
            : val === "TEAM 2"
            ? "team2"
            : "hc";
        return (
          <span className={`cell-shift-chip cell-shift-chip--${modifier}`}>
            {val}
          </span>
        );
      },
    },
    {
      field: "CALV",
      headerName: "CALV",
      width: 80,
    },
    {
      field: "MAINDEPTNAME",
      headerName: "MAINDEPTNAME",
      width: 85,
      cellStyle: { fontWeight: "600" },
    },
    {
      field: "SUBDEPTNAME",
      headerName: "SUBDEPTNAME",
      width: 80,
    },
  ];

  if (!isCMS) {
    baseColumns.push({
      field: "WORK_HOUR",
      headerName: "WORK_HOUR",
      width: 80,
    });
  }

  const timeColumns: any[] = [
    {
      field: "FIXED_IN_TIME",
      headerName: "FIXED_IN",
      width: 75,
      cellStyle: { textAlign: "center" },
      cellRenderer: (params: any) => {
        const val = params.value;
        const isOff = val === "OFF" || val === "X";
        return (
          <span
            className={`cell-time-val ${isOff ? "cell-time-val--off" : ""}`}
          >
            {val}
          </span>
        );
      },
    },
    {
      field: "FIXED_OUT_TIME",
      headerName: "FIXED_OUT",
      width: 75,
      cellStyle: { textAlign: "center" },
      cellRenderer: (params: any) => {
        const val = params.value;
        const isOff = val === "OFF" || val === "X";
        return (
          <span
            className={`cell-time-val ${isOff ? "cell-time-val--off" : ""}`}
          >
            {val}
          </span>
        );
      },
    },
    {
      field: "IN_TIME",
      headerName: "AUTO_IN_TIME",
      width: 105,
      cellStyle: { textAlign: "center" },
      cellRenderer: (params: any) => {
        const val = params.value;
        if (val === "Thiếu giờ vào") {
          return <span className="cell-warn-badge">Thiếu giờ vào</span>;
        }
        return <span className="cell-time-val">{val}</span>;
      },
    },
    {
      field: "OUT_TIME",
      headerName: "AUTO_OUT_TIME",
      width: 105,
      cellStyle: { textAlign: "center" },
      cellRenderer: (params: any) => {
        const val = params.value;
        if (val === "Thiếu giờ ra") {
          return <span className="cell-warn-badge">Thiếu giờ ra</span>;
        }
        return <span className="cell-time-val">{val}</span>;
      },
    },
  ];

  const otColumns: any[] = isCMS
    ? [
        { field: "L100", headerName: "L100", width: 50 },
        { field: "L130", headerName: "L130", width: 50 },
        { field: "L150", headerName: "L150", width: 50 },
        { field: "L200", headerName: "L200", width: 50 },
        { field: "L210", headerName: "L210", width: 50 },
        { field: "L270", headerName: "L270", width: 50 },
        { field: "L300", headerName: "L300", width: 50 },
        { field: "L390", headerName: "L390", width: 50 },
      ]
    : [];

  const extraColumns: any[] = [
    {
      field: "STATUS",
      headerName: "STATUS",
      width: 90,
      cellStyle: { textAlign: "center" },
      cellRenderer: (params: any) => {
        const isMiss = params.value === "Thiếu công";
        return (
          <span
            className={`cell-status-badge ${
              isMiss
                ? "cell-status-badge--miss"
                : "cell-status-badge--full"
            }`}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      field: "REASON_NAME",
      headerName: "REASON_NAME",
      width: 95,
    },
    {
      field: "CHECK1",
      headerName: "CHECK1",
      width: 85,
      cellStyle: { fontFamily: "JetBrains Mono" },
    },
    {
      field: "CHECK2",
      headerName: "CHECK2",
      width: 85,
      cellStyle: { fontFamily: "JetBrains Mono" },
    },
    {
      field: "CHECK3",
      headerName: "CHECK3",
      width: 85,
      cellStyle: { fontFamily: "JetBrains Mono" },
    },
    {
      field: "PREV_CHECK1",
      headerName: "PREV_CHECK1",
      width: 95,
      cellStyle: { fontFamily: "JetBrains Mono", color: "#64748b" },
    },
    {
      field: "PREV_CHECK2",
      headerName: "PREV_CHECK2",
      width: 95,
      cellStyle: { fontFamily: "JetBrains Mono", color: "#64748b" },
    },
    {
      field: "PREV_CHECK3",
      headerName: "PREV_CHECK3",
      width: 95,
      cellStyle: { fontFamily: "JetBrains Mono", color: "#64748b" },
    },
    {
      field: "NEXT_CHECK1",
      headerName: "NEXT_CHECK1",
      width: 95,
      cellStyle: { fontFamily: "JetBrains Mono", color: "#64748b" },
    },
    {
      field: "NEXT_CHECK2",
      headerName: "NEXT_CHECK2",
      width: 95,
      cellStyle: { fontFamily: "JetBrains Mono", color: "#64748b" },
    },
    {
      field: "NEXT_CHECK3",
      headerName: "NEXT_CHECK3",
      width: 95,
      cellStyle: { fontFamily: "JetBrains Mono", color: "#64748b" },
    },
  ];

  return [...baseColumns, ...timeColumns, ...otColumns, ...extraColumns];
};

/**
 * Cấu hình trường cho PivotGrid
 */
export const getPivotFieldsChamCong = () => {
  return [
    { caption: "DATE_COLUMN", width: 90, dataField: "DATE_COLUMN", area: "row" as const },
    { caption: "NV_CCID", width: 70, dataField: "NV_CCID", area: "row" as const },
    { caption: "EMPL_NO", width: 80, dataField: "EMPL_NO", area: "row" as const },
    { caption: "FULL_NAME", width: 120, dataField: "FULL_NAME", area: "row" as const },
    { caption: "FACTORY_NAME", width: 80, dataField: "FACTORY_NAME", area: "filter" as const },
    { caption: "WORK_SHIF_NAME", width: 90, dataField: "WORK_SHIF_NAME", area: "filter" as const },
    { caption: "CALV", width: 80, dataField: "CALV", area: "column" as const },
    { caption: "MAINDEPTNAME", width: 90, dataField: "MAINDEPTNAME", area: "filter" as const },
    { caption: "SUBDEPTNAME", width: 90, dataField: "SUBDEPTNAME", area: "filter" as const },
    { caption: "STATUS", width: 80, dataField: "STATUS", area: "filter" as const },
    { caption: "CHECK1", width: 80, dataField: "CHECK1", area: "filter" as const },
    { caption: "CHECK2", width: 80, dataField: "CHECK2", area: "filter" as const },
    { caption: "CHECK3", width: 80, dataField: "CHECK3", area: "filter" as const },
    { caption: "PREV_CHECK1", width: 90, dataField: "PREV_CHECK1", area: "filter" as const },
    { caption: "PREV_CHECK2", width: 90, dataField: "PREV_CHECK2", area: "filter" as const },
    { caption: "PREV_CHECK3", width: 90, dataField: "PREV_CHECK3", area: "filter" as const },
    { caption: "NEXT_CHECK1", width: 90, dataField: "NEXT_CHECK1", area: "filter" as const },
    { caption: "NEXT_CHECK2", width: 90, dataField: "NEXT_CHECK2", area: "filter" as const },
    { caption: "NEXT_CHECK3", width: 90, dataField: "NEXT_CHECK3", area: "filter" as const },
    { caption: "L100", width: 60, dataField: "L100", dataType: "number" as const, summaryType: "sum" as const, area: "data" as const },
    { caption: "L150", width: 60, dataField: "L150", dataType: "number" as const, summaryType: "sum" as const, area: "data" as const },
    { caption: "L200", width: 60, dataField: "L200", dataType: "number" as const, summaryType: "sum" as const, area: "data" as const },
  ];
};
