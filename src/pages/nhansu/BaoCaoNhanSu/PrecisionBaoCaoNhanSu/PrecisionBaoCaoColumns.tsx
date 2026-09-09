import React from "react";
import { ColDef, ColGroupDef } from "ag-grid-community";

// 1. Columns for Main Department Attendance Table
export const getColumnsMainDept = (): (ColDef | ColGroupDef)[] => [
  {
    field: "MAINDEPTNAME",
    headerName: "BP Chính",
    width: 140,
    pinned: "left",
    cellRenderer: (params: any) => {
      const isTotal = params.value === "TOTAL";
      return (
        <span style={{ fontWeight: isTotal ? 900 : 700, color: isTotal ? "#1e40af" : "#1e293b" }}>
          {params.value}
        </span>
      );
    },
  },
  {
    field: "COUNT_TOTAL",
    headerName: "Tổng",
    width: 90,
    type: "numericColumn",
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 700, color: "#0f172a" }}>{params.value ?? 0}</span>
    ),
  },
  {
    field: "COUT_ON",
    headerName: "Đi Làm",
    width: 90,
    type: "numericColumn",
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 700, color: "#16a34a" }}>{params.value ?? 0}</span>
    ),
  },
  {
    field: "COUT_OFF",
    headerName: "Nghỉ Làm",
    width: 90,
    type: "numericColumn",
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: params.value > 0 ? 700 : 400, color: params.value > 0 ? "#e11d48" : "#94a3b8" }}>
        {params.value ?? 0}
      </span>
    ),
  },
  {
    field: "COUNT_CDD",
    headerName: "Chưa ĐD",
    width: 90,
    type: "numericColumn",
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: params.value > 0 ? 700 : 400, color: params.value > 0 ? "#d97706" : "#94a3b8" }}>
        {params.value ?? 0}
      </span>
    ),
  },
  {
    field: "ON_RATE",
    headerName: "Tỉ Lệ Đi Làm",
    width: 110,
    type: "numericColumn",
    cellRenderer: (params: any) => {
      const rate = typeof params.value === "number" ? params.value : 0;
      const isHigh = rate >= 90;
      return (
        <span
          style={{
            fontWeight: 800,
            fontSize: "11px",
            padding: "2px 6px",
            borderRadius: "4px",
            backgroundColor: isHigh ? "#dcfce7" : "#fee2e2",
            color: isHigh ? "#15803d" : "#b91c1c",
          }}
        >
          {rate.toFixed(2)} %
        </span>
      );
    },
  },
];

// 2. Columns for Shift Matrix Table (Hierarchical Groups)
export const getColumnsShiftMatrix = (): (ColDef | ColGroupDef)[] => [
  {
    field: "MAINDEPTNAME",
    headerName: "Phòng Ban",
    width: 130,
    pinned: "left",
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: params.value === "TOTAL" ? 900 : 700, color: params.value === "TOTAL" ? "#1e40af" : "#1e293b" }}>
        {params.value}
      </span>
    ),
  },
  {
    headerName: "TỔNG HỢP",
    children: [
      { field: "COUNT_TOTAL", headerName: "Tổng", width: 65, cellStyle: { fontWeight: 700, color: "#1d4ed8" } },
      { field: "COUNT_ON", headerName: "ON", width: 60, cellStyle: { fontWeight: 700, color: "#16a34a" } },
      { field: "COUNT_OFF", headerName: "OFF", width: 60, cellStyle: { fontWeight: 600, color: "#e11d48" } },
      { field: "COUNT_CDD", headerName: "CĐD", width: 60, cellStyle: { fontWeight: 600, color: "#d97706" } },
    ],
  },
  {
    headerName: "TEAM 1 (CA NGÀY)",
    children: [
      { field: "T1_TOTAL", headerName: "T1_Tot", width: 65, cellStyle: { fontWeight: 600, color: "#0284c7" } },
      { field: "T1_ON", headerName: "T1_On", width: 60, cellStyle: { fontWeight: 600, color: "#16a34a" } },
      { field: "T1_OFF", headerName: "T1_Off", width: 60, cellStyle: { fontWeight: 500, color: "#e11d48" } },
      { field: "T1_CDD", headerName: "T1_Cdd", width: 60, cellStyle: { fontWeight: 500, color: "#d97706" } },
    ],
  },
  {
    headerName: "TEAM 2 (CA ĐÊM)",
    children: [
      { field: "T2_TOTAL", headerName: "T2_Tot", width: 65, cellStyle: { fontWeight: 600, color: "#7c3aed" } },
      { field: "T2_ON", headerName: "T2_On", width: 60, cellStyle: { fontWeight: 600, color: "#16a34a" } },
      { field: "T2_OFF", headerName: "T2_Off", width: 60, cellStyle: { fontWeight: 500, color: "#e11d48" } },
      { field: "T2_CDD", headerName: "T2_Cdd", width: 60, cellStyle: { fontWeight: 500, color: "#d97706" } },
    ],
  },
  {
    headerName: "HÀNH CHÍNH (HC)",
    children: [
      { field: "HC_TOTAL", headerName: "HC_Tot", width: 65, cellStyle: { fontWeight: 600, color: "#0d9488" } },
      { field: "HC_ON", headerName: "HC_On", width: 60, cellStyle: { fontWeight: 600, color: "#16a34a" } },
      { field: "HC_OFF", headerName: "HC_Off", width: 60, cellStyle: { fontWeight: 500, color: "#e11d48" } },
      { field: "HC_CDD", headerName: "HC_Cdd", width: 60, cellStyle: { fontWeight: 500, color: "#d97706" } },
    ],
  },
  {
    field: "ON_RATE",
    headerName: "Tỉ Lệ ON",
    width: 90,
    cellRenderer: (params: any) => {
      const val = typeof params.value === "number" ? params.value : 0;
      return (
        <span style={{ fontWeight: 800, color: val >= 90 ? "#15803d" : "#b91c1c" }}>
          {val.toFixed(1)} %
        </span>
      );
    },
  },
  {
    headerName: "CHI TIẾT NGHỈ",
    children: [
      { field: "TOTAL", headerName: "Tổng Nghỉ", width: 75, cellStyle: { fontWeight: 700, color: "#e11d48" } },
      { field: "PHEP_NAM", headerName: "Phép Năm", width: 75 },
      { field: "NUA_PHEP", headerName: "Nửa Phép", width: 75 },
      { field: "NGHI_VIEC_RIENG", headerName: "Việc Riêng", width: 75 },
      { field: "NGHI_OM", headerName: "Nghỉ Ốm", width: 70 },
      { field: "CHE_DO", headerName: "Chế Độ", width: 70 },
      { field: "KHONG_LY_DO", headerName: "Không Phép", width: 80, cellStyle: { fontWeight: 700, color: "#b91c1c" } },
    ],
  },
];

// 3. Columns for Sub-Department Attendance Table
export const getColumnsSubDept = (): (ColDef | ColGroupDef)[] => [
  { field: "MAINDEPTNAME", headerName: "BP Chính", width: 110, cellStyle: { fontWeight: 700, color: "#1e293b" } },
  { field: "SUBDEPTNAME", headerName: "BP Phụ", width: 120, cellStyle: { fontWeight: 600, color: "#334155" } },
  { field: "TOTAL_ALL", headerName: "Tổng", width: 75, cellStyle: { fontWeight: 700, color: "#1d4ed8" } },
  { field: "TOTAL_ON", headerName: "Đi Làm", width: 75, cellStyle: { fontWeight: 700, color: "#16a34a" } },
  { field: "TOTAL_OFF", headerName: "Nghỉ Làm", width: 75, cellStyle: { fontWeight: 600, color: "#e11d48" } },
  { field: "TOTAL_CDD", headerName: "Chưa ĐD", width: 75, cellStyle: { fontWeight: 600, color: "#d97706" } },
  {
    field: "TOTAL_ALL",
    headerName: "TL Đi Làm",
    width: 95,
    valueGetter: (params: any) => {
      const tot = params.data?.TOTAL_ALL || 0;
      const on = params.data?.TOTAL_ON || 0;
      return tot > 0 ? ((on / tot) * 100).toFixed(1) + "%" : "0%";
    },
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 800, color: "#15803d" }}>{params.value}</span>
    ),
  },
];

// 4. Columns for Full Raw Records Table (Lịch sử đi làm full info)
export const getColumnsFullInfo = (): (ColDef | ColGroupDef)[] => [
  {
    field: "DATE_COLUMN",
    headerName: "Ngày",
    width: 100,
    pinned: "left",
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>
        {params.value}
      </span>
    ),
  },
  {
    field: "WEEKDAY",
    headerName: "Thứ",
    width: 85,
    cellRenderer: (params: any) => {
      const isSunday = params.value === "Chủ Nhật" || params.value === "Sunday";
      return (
        <span style={{ fontWeight: 600, color: isSunday ? "#e11d48" : "#2563eb" }}>
          {params.value}
        </span>
      );
    },
  },
  {
    field: "ON_OFF",
    headerName: "Tình Trạng",
    width: 95,
    cellRenderer: (params: any) => {
      const val = params.value;
      let text = "Chưa ĐD";
      let bg = "#fef3c7";
      let color = "#b45309";
      if (val === 1) {
        text = "Đi làm";
        bg = "#dcfce7";
        color = "#15803d";
      } else if (val === 0) {
        text = "Nghỉ làm";
        bg = "#fee2e2";
        color = "#b91c1c";
      }
      return (
        <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", backgroundColor: bg, color: color }}>
          {text}
        </span>
      );
    },
  },
  {
    field: "EMPL_NO",
    headerName: "Mã Thẻ",
    width: 95,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "#1d4ed8" }}>
        {params.value}
      </span>
    ),
  },
  {
    field: "CMS_ID",
    headerName: "NS_ID",
    width: 85,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: "#64748b" }}>
        {params.value}
      </span>
    ),
  },
  {
    field: "MIDLAST_NAME",
    headerName: "Họ Đệm",
    width: 110,
    cellStyle: { fontWeight: 600, color: "#334155" },
  },
  {
    field: "FIRST_NAME",
    headerName: "Tên",
    width: 85,
    cellStyle: { fontWeight: 700, color: "#0f172a" },
  },
  { field: "MAINDEPTNAME", headerName: "BP Chính", width: 100 },
  { field: "SUBDEPTNAME", headerName: "BP Phụ", width: 100 },
  { field: "WORK_SHIF_NAME", headerName: "Ca Làm Việc", width: 100 },
  {
    field: "CHECK1",
    headerName: "Check 1",
    width: 85,
    cellStyle: { fontFamily: "JetBrains Mono, monospace", fontSize: "11px" },
  },
  {
    field: "CHECK2",
    headerName: "Check 2",
    width: 85,
    cellStyle: { fontFamily: "JetBrains Mono, monospace", fontSize: "11px" },
  },
  {
    field: "CHECK3",
    headerName: "Check 3",
    width: 85,
    cellStyle: { fontFamily: "JetBrains Mono, monospace", fontSize: "11px" },
  },
  {
    field: "WORKING_MINUTES",
    headerName: "Phút LV",
    width: 85,
    type: "numericColumn",
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600 }}>
        {params.value ?? 0}
      </span>
    ),
  },
  {
    field: "OVERTIME",
    headerName: "Tăng Ca",
    width: 85,
    type: "numericColumn",
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: params.value > 0 ? "#b45309" : "#94a3b8" }}>
        {params.value ?? 0}
      </span>
    ),
  },
  { field: "REASON_NAME", headerName: "Lý Do Nghỉ", width: 110 },
  { field: "REMARK", headerName: "Ghi Chú", width: 140 },
];
