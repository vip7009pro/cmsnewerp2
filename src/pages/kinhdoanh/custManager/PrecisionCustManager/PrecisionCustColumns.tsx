import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { CUST_INFO } from "../interfaces/kdInterface";

export const getPrecisionCustColumns = (onEditRow: (row: CUST_INFO) => void) => [
  {
    field: "CUST_TYPE",
    headerName: "PHÂN LOẠI",
    width: 95,
    pinned: "left",
    headerCheckboxSelection: true,
    checkboxSelection: true,
    cellRenderer: (params: any) => {
      const type = (params.data?.CUST_TYPE || "").trim().toUpperCase();
      const isKH = type === "KH";
      return (
        <span
          style={{
            display: "inline-block",
            padding: "1px 8px",
            borderRadius: "4px",
            fontSize: "10.5px",
            fontWeight: 800,
            background: isKH ? "#eff6ff" : "#eef2ff",
            color: isKH ? "#1d4ed8" : "#4338ca",
            border: `1px solid ${isKH ? "#bfdbfe" : "#c7d2fe"}`,
            textAlign: "center",
          }}
        >
          {isKH ? "KHÁCH HÀNG" : "VENDOR NCC"}
        </span>
      );
    },
  },
  {
    field: "CUST_CD",
    headerName: "MÃ ĐỐI TÁC",
    width: 105,
    pinned: "left",
    cellRenderer: (params: any) => (
      <span
        style={{
          color: "#2563eb",
          fontWeight: 800,
          fontFamily: "JetBrains Mono, monospace",
          cursor: "pointer",
        }}
        onClick={() => onEditRow(params.data)}
        title="Nhấp để xem hoặc sửa hồ sơ đối tác"
      >
        {params.data?.CUST_CD}
      </span>
    ),
  },
  {
    field: "CUST_NAME_KD",
    headerName: "TÊN VIẾT TẮT (KD)",
    width: 140,
    pinned: "left",
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 700, color: "#0f172a" }}>
        {params.data?.CUST_NAME_KD}
      </span>
    ),
  },
  {
    field: "CUST_NAME",
    headerName: "TÊN PHÁP NHÂN ĐẦY ĐỦ",
    width: 240,
    cellRenderer: (params: any) => (
      <span style={{ color: "#334155", fontWeight: 500 }}>
        {params.data?.CUST_NAME}
      </span>
    ),
  },
  {
    field: "CUST_ADDR1",
    headerName: "ĐỊA CHỈ TRỤ SỞ CHÍNH",
    width: 260,
    cellRenderer: (params: any) => (
      <span style={{ color: "#475569" }} title={params.data?.CUST_ADDR1}>
        {params.data?.CUST_ADDR1}
      </span>
    ),
  },
  {
    field: "TAX_NO",
    headerName: "MÃ SỐ THUẾ (MST)",
    width: 120,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: "#0f172a" }}>
        {params.data?.TAX_NO || "--"}
      </span>
    ),
  },
  {
    field: "BOSS_NAME",
    headerName: "NGƯỜI ĐẠI DIỆN",
    width: 130,
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 600, color: "#1e293b" }}>
        {params.data?.BOSS_NAME || "--"}
      </span>
    ),
  },
  {
    field: "TEL_NO1",
    headerName: "HOTLINE / SĐT",
    width: 125,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#2563eb" }}>
        {params.data?.TEL_NO1 || "--"}
      </span>
    ),
  },
  {
    field: "EMAIL",
    headerName: "EMAIL LIÊN HỆ",
    width: 180,
    cellRenderer: (params: any) => (
      <span style={{ color: "#0284c7", fontFamily: "JetBrains Mono, monospace", fontSize: "11px" }}>
        {params.data?.EMAIL || "--"}
      </span>
    ),
  },
  {
    field: "USE_YN",
    headerName: "TRẠNG THÁI",
    width: 90,
    cellRenderer: (params: any) => {
      const isUse = params.data?.USE_YN === "Y";
      return (
        <span
          style={{
            display: "inline-block",
            padding: "1px 8px",
            borderRadius: "9999px",
            fontSize: "10px",
            fontWeight: 800,
            background: isUse ? "#ecfdf5" : "#fff1f2",
            color: isUse ? "#059669" : "#e11d48",
            border: `1px solid ${isUse ? "#a7f3d0" : "#fecdd3"}`,
            textAlign: "center",
          }}
        >
          {isUse ? "USE (MỞ)" : "NOT USE"}
        </span>
      );
    },
  },
  {
    field: "CUST_NUMBER",
    headerName: "SỐ ĐIỆN THOẠI CỐ ĐỊNH",
    width: 130,
  },
  {
    field: "FAX_NO",
    headerName: "SỐ FAX",
    width: 110,
  },
  {
    field: "CUST_POSTAL",
    headerName: "MÃ BƯU CHÍNH",
    width: 110,
  },
  {
    field: "CUST_ADDR2",
    headerName: "ĐỊA CHỈ NHÀ MÁY / XƯỞNG 2",
    width: 220,
  },
  {
    field: "CUST_ADDR3",
    headerName: "ĐỊA CHỈ KHO / VĂN PHÒNG 3",
    width: 220,
  },
  {
    field: "REMK",
    headerName: "GHI CHÚ (REMARK)",
    width: 160,
  },
  {
    field: "INS_DATE",
    headerName: "NGÀY TẠO",
    width: 110,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#64748b" }}>
        {params.data?.INS_DATE || "--"}
      </span>
    ),
  },
  { field: "INS_EMPL", headerName: "NGƯỜI TẠO", width: 100 },
  {
    field: "UPD_DATE",
    headerName: "NGÀY SỬA",
    width: 110,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#64748b" }}>
        {params.data?.UPD_DATE || "--"}
      </span>
    ),
  },
  { field: "UPD_EMPL", headerName: "NGƯỜI SỬA", width: 100 },
  {
    field: "ACTIONS",
    headerName: "THAO TÁC",
    width: 80,
    pinned: "right",
    cellRenderer: (params: any) => (
      <button
        type="button"
        style={{
          background: "#eff6ff",
          color: "#2563eb",
          border: "1px solid #bfdbfe",
          borderRadius: "4px",
          padding: "2px 8px",
          fontSize: "11px",
          fontWeight: 700,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        }}
        onClick={() => onEditRow(params.data)}
        title="Chỉnh sửa thông tin đối tác"
      >
        <FiEdit2 size={11} />
        <span>Sửa</span>
      </button>
    ),
  },
];
