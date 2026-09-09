import React from "react";

export const getColumnsUserManager = () => [
  {
    field: "EMPL_NO",
    headerName: "ERP_ID",
    width: 95,
    resizable: true,
    editable: false,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    cellRenderer: (params: any) => {
      return (
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: 700,
            color: "#2563eb",
          }}
        >
          {params.value}
        </span>
      );
    },
  },
  {
    field: "IMAGE",
    headerName: "Ảnh",
    width: 55,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => {
      const hasImage = params.data?.EMPL_IMAGE === "Y";
      const src = hasImage
        ? `/Picture_NS/NS_${params.data?.EMPL_NO}.jpg`
        : "/noimage.webp";
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <img
            src={src}
            alt={params.data?.EMPL_NO || "Avatar"}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
            onError={(e: any) => {
              e.target.src = "/noimage.webp";
            }}
          />
        </div>
      );
    },
  },
  {
    field: "NV_CCID",
    headerName: "Mã CC",
    width: 65,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#64748b" }}>
        {params.value}
      </span>
    ),
  },
  {
    field: "CMS_ID",
    headerName: "Mã CMS",
    width: 75,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: "#334155" }}>
        {params.value}
      </span>
    ),
  },
  {
    field: "FULL_NAME",
    headerName: "Họ và Tên",
    width: 140,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => {
      return (
        <span style={{ fontWeight: 700, color: "#0f172a" }}>
          {params.value}
        </span>
      );
    },
  },
  {
    field: "SUBDEPTNAME",
    headerName: "Tổ / Line",
    width: 80,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => (
      <span
        style={{
          background: "#eff6ff",
          color: "#1d4ed8",
          border: "1px solid #bfdbfe",
          borderRadius: "3px",
          padding: "1px 5px",
          fontSize: "10.5px",
          fontWeight: 600,
        }}
      >
        {params.value}
      </span>
    ),
  },
  {
    field: "MAINDEPTNAME",
    headerName: "Bộ Phận",
    width: 80,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 600, color: "#475569" }}>{params.value}</span>
    ),
  },
  {
    field: "WORK_POSITION_NAME",
    headerName: "Vị Trí Công Đoạn",
    width: 110,
    resizable: true,
    editable: false,
  },
  {
    field: "POSITION_NAME",
    headerName: "Cấp Bậc",
    width: 80,
    resizable: true,
    editable: false,
  },
  {
    field: "JOB_NAME",
    headerName: "Chức Vụ",
    width: 85,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => {
      const isLeader = params.value === "Leader";
      return (
        <span
          style={{
            color: isLeader ? "#2563eb" : "#475569",
            fontWeight: isLeader ? 700 : 500,
          }}
        >
          {params.value}
        </span>
      );
    },
  },
  {
    field: "WORK_SHIF_NAME",
    headerName: "Ca Trực",
    width: 85,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => {
      const isTeam1 = params.value === "TEAM 1";
      return (
        <span
          style={{
            background: isTeam1 ? "#fffbeb" : "#eff6ff",
            color: isTeam1 ? "#b45309" : "#1e40af",
            border: isTeam1 ? "1px solid #fde68a" : "1px solid #bfdbfe",
            borderRadius: "9999px",
            padding: "1px 7px",
            fontSize: "10px",
            fontWeight: 700,
          }}
        >
          {params.value}
        </span>
      );
    },
  },
  {
    field: "WORK_STATUS_NAME",
    headerName: "Trạng Thái",
    width: 85,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => {
      const isWorking = params.data?.WORK_STATUS_CODE === 1;
      return (
        <span
          style={{
            color: isWorking ? "#059669" : "#dc2626",
            fontWeight: 700,
            fontSize: "10.5px",
          }}
        >
          {isWorking ? "● Đang làm" : "● Đã nghỉ"}
        </span>
      );
    },
  },
  {
    field: "DOB",
    headerName: "Ngày Sinh",
    width: 90,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#64748b" }}>
        {params.value ? String(params.value).slice(0, 10) : ""}
      </span>
    ),
  },
  {
    field: "PHONE_NUMBER",
    headerName: "Số ĐT",
    width: 95,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: "#2563eb" }}>
        {params.value}
      </span>
    ),
  },
  {
    field: "HOMETOWN",
    headerName: "Quê Quán",
    width: 150,
    resizable: true,
    editable: false,
  },
  {
    field: "FACTORY_NAME",
    headerName: "Nhà Máy",
    width: 80,
    resizable: true,
    editable: false,
  },
  {
    field: "WORK_START_DATE",
    headerName: "Ngày Vào",
    width: 90,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#64748b" }}>
        {params.value ? String(params.value).slice(0, 10) : ""}
      </span>
    ),
  },
  {
    field: "RESIGN_DATE",
    headerName: "Ngày Nghỉ",
    width: 90,
    resizable: true,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#ef4444" }}>
        {params.value ? String(params.value).slice(0, 10) : ""}
      </span>
    ),
  },
];
