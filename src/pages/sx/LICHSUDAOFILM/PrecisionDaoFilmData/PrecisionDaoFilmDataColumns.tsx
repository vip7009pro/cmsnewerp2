import React from "react";

// Helper styles cho Cell Renderers chuẩn Stitch Enterprise
const badgeStyle = (bg: string, color: string, border: string): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1px 6px",
  borderRadius: "3px",
  fontSize: "10.5px",
  fontWeight: 700,
  backgroundColor: bg,
  color: color,
  border: `1px solid ${border}`,
  lineHeight: 1.2,
});

const monoNumStyle = (color: string = "#0f172a", bold: boolean = true): React.CSSProperties => ({
  fontFamily: "'JetBrains Mono', monospace",
  fontWeight: bold ? 700 : 500,
  color: color,
});

// 1. Cột Bảng Lịch Sử Giao Nhận Dao Film
export const getColumnGiaoNhanDaoFilm = () => [
  { field: "KNIFE_FILM_ID", headerName: "ID", width: 50 },
  { field: "FACTORY_NAME", headerName: "FACTORY", width: 50 },
  { field: "NGAYBANGIAO", headerName: "NGAYBANGIAO", width: 100 },
  { field: "G_CODE", headerName: "G_CODE", width: 80 },
  { field: "G_NAME", headerName: "G_NAME", width: 250 },
  {
    field: "LOAIBANGIAO_PDP",
    headerName: "LOAIBANGIAO",
    width: 80,
    cellRenderer: (params: any) => {
      switch (params.data?.LOAIBANGIAO_PDP) {
        case "D":
          return <span style={badgeStyle("#eff6ff", "#1d4ed8", "#bfdbfe")}>DAO</span>;
        case "F":
          return <span style={badgeStyle("#fdf2f8", "#be185d", "#fbcfe8")}>FILM</span>;
        case "T":
          return <span style={badgeStyle("#f0fdf4", "#15803d", "#bbf7d0")}>TAI LIEU</span>;
        default:
          return <span style={badgeStyle("#f1f5f9", "#475569", "#cbd5e1")}>N/A</span>;
      }
    },
  },
  {
    field: "LOAIPHATHANH",
    headerName: "LOAIPHATHANH",
    width: 110,
    cellRenderer: (params: any) => {
      switch (params.data?.LOAIPHATHANH) {
        case "PH":
          return <span style={badgeStyle("#ecfdf5", "#047857", "#a7f3d0")}>PHAT HANH</span>;
        case "TH":
          return <span style={badgeStyle("#fff1f2", "#be123c", "#fecdd3")}>THU HOI</span>;
        default:
          return <span style={badgeStyle("#f1f5f9", "#475569", "#cbd5e1")}>N/A</span>;
      }
    },
  },
  { field: "SOLUONG", headerName: "SOLUONG", width: 60, cellRenderer: (params: any) => <span style={monoNumStyle("#0f172a")}>{params.data?.SOLUONG?.toLocaleString("en-US")}</span> },
  { field: "SOLUONGOHP", headerName: "SOLUONGOHP", width: 80, cellRenderer: (params: any) => <span style={monoNumStyle("#0f172a")}>{params.data?.SOLUONGOHP?.toLocaleString("en-US")}</span> },
  { field: "LYDOBANGIAO", headerName: "LYDOBANGIAO", width: 80 },
  { field: "PQC_EMPL_NO", headerName: "PQC_EMPL_NO", width: 80 },
  { field: "RND_EMPL_NO", headerName: "RND_EMPL_NO", width: 80 },
  { field: "SX_EMPL_NO", headerName: "SX_EMPL_NO", width: 80 },
  { field: "MA_DAO", headerName: "MA_DAO", width: 100 },
  { field: "CFM_GIAONHAN", headerName: "CFM_GIAONHAN", width: 100 },
  { field: "CFM_INS_EMPL", headerName: "CFM_INS_EMPL", width: 100 },
  { field: "CFM_DATE", headerName: "CFM_DATE", width: 100 },
  { field: "KNIFE_TYPE", headerName: "KNIFE_TYPE", width: 100 },
  {
    field: "KNIFE_FILM_STATUS",
    headerName: "KNIFE_FILM_STATUS",
    width: 100,
    cellRenderer: (params: any) => {
      if (params.data?.KNIFE_FILM_STATUS === "OK") {
        return <span style={badgeStyle("#ecfdf5", "#047857", "#a7f3d0")}>OK</span>;
      }
      if (params.data?.KNIFE_FILM_STATUS) {
        return <span style={badgeStyle("#fff1f2", "#e11d48", "#fecdd3")}>{params.data.KNIFE_FILM_STATUS}</span>;
      }
      return null;
    },
  },
  { field: "G_WIDTH", headerName: "G_WIDTH", width: 100 },
  { field: "G_LENGTH", headerName: "G_LENGTH", width: 100 },
  { field: "VENDOR", headerName: "VENDOR", width: 100 },
  {
    field: "TOTAL_PRESS",
    headerName: "TOTAL_PRESS",
    width: 100,
    cellRenderer: (params: any) => (
      <span style={monoNumStyle("#2563eb")}>
        {params.data?.TOTAL_PRESS?.toLocaleString("en-US")}
      </span>
    ),
  },
  { field: "REMARK", headerName: "REMARK", width: 150 },
];

// 2. Cột Bảng Quản Lý Dao Film
export const getColumnQuanLyDaoFilm = () => [
  { field: "KNIFE_FILM_ID", headerName: "DF_ID", resizable: true, width: 60 },
  { field: "G_CODE", headerName: "G_CODE", resizable: true, width: 60 },
  { field: "G_NAME", headerName: "G_NAME", resizable: true, width: 80 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", resizable: true, width: 80 },
  { field: "KNIFE_TYPE", headerName: "TYPE", resizable: true, width: 50 },
  { field: "KNIFE_FILM_STEP", headerName: "STEP", resizable: true, width: 50 },
  { field: "KNIFE_FILM_QTY", headerName: "DF_QTY", resizable: true, width: 50 },
  { field: "FULL_KNIFE_CODE", headerName: "MA_DAO", resizable: true, width: 80 },
  { field: "KT_KNIFE_CODE", headerName: "MA_DAO_KT", resizable: true, width: 80 },
  { field: "KNIFE_BOX_NUMBER", headerName: "BOX_NUMBER", resizable: true, width: 80 },
  { field: "CAVITY_NGANG", headerName: "CAVITY_NGANG", resizable: true, width: 80 },
  { field: "CAVITY_DOC", headerName: "CAVITY_DOC", resizable: true, width: 80 },
  { field: "PD", headerName: "PD", resizable: true, width: 50 },
  { field: "BOGOC", headerName: "BOGOC", resizable: true, width: 50 },
  { field: "SONG_GIUA", headerName: "SONG_GIUA", resizable: true, width: 50 },
  {
    field: "KNIFE_STATUS",
    headerName: "STATUS",
    resizable: true,
    width: 50,
    cellRenderer: (params: any) => {
      if (params.data?.KNIFE_STATUS === "OK") {
        return <span style={badgeStyle("#ecfdf5", "#047857", "#a7f3d0")}>OK</span>;
      }
      return <span style={badgeStyle("#fff1f2", "#e11d48", "#fecdd3")}>{params.data?.KNIFE_STATUS ?? "NG"}</span>;
    },
  },
  {
    field: "STANDARD_PRESS_QTY",
    headerName: "STANDARD_PRESS",
    resizable: true,
    width: 80,
    cellRenderer: (params: any) => (
      <span style={monoNumStyle("#0284c7")}>
        {params.data?.STANDARD_PRESS_QTY?.toLocaleString("en-US")}
      </span>
    ),
  },
  {
    field: "TOTAL_PRESS",
    headerName: "TOTAL_PRESS",
    resizable: true,
    width: 80,
    cellRenderer: (params: any) => {
      const isOver = Number(params.data?.TOTAL_PRESS ?? 0) > Number(params.data?.STANDARD_PRESS_QTY ?? 0);
      return (
        <span style={monoNumStyle(isOver ? "#dc2626" : "#2563eb")}>
          {params.data?.TOTAL_PRESS?.toLocaleString("en-US")}
        </span>
      );
    },
  },
  { field: "FACTORY_NAME", headerName: "FACTORY_NAME", resizable: true, width: 80 },
  { field: "INS_EMPL", headerName: "INS_EMPL", resizable: true, width: 80 },
  { field: "PROD_TYPE", headerName: "PROD_TYPE", resizable: true, width: 80 },
  { field: "REV_NO", headerName: "REV_NO", resizable: true, width: 80 },
  { field: "VENDOR", headerName: "VENDOR", resizable: true, width: 80 },
  { field: "INS_DATE", headerName: "INS_DATE", resizable: true, width: 80 },
  { field: "UPD_EMPL", headerName: "UPD_EMPL", resizable: true, width: 80 },
  { field: "UPD_DATE", headerName: "UPD_DATE", resizable: true, width: 80 },
  { field: "REMARK", headerName: "REMARK", resizable: true, width: 80 },
  { field: "KNIFE_FILM_NO", headerName: "KNIFE_FILM_NO", resizable: true, width: 80 },
  { field: "KNIFE_FILM_SEQ", headerName: "KNIFE_FILM_SEQ", resizable: true, width: 80 },
  { field: "KCTD", headerName: "KCTD", resizable: true, width: 80 },
];

// 3. Cột Bảng Lịch Sử Xuất Dao Film
export const getColumnLichSuXuatDaoFilm = () => [
  { field: "INS_DATE", headerName: "INS_DATE", resizable: true, width: 100 },
  { field: "PLAN_DATE", headerName: "PLAN_DATE", resizable: true, width: 80 },
  { field: "CA_LAM_VIEC", headerName: "CA", resizable: true, width: 40 },
  { field: "MA_DAO", headerName: "MA_DAO", resizable: true, width: 50 },
  { field: "MA_DAO_KT", headerName: "MA_DAO_KT", resizable: true, width: 80 },
  { field: "PLAN_ID", headerName: "PLAN_ID", resizable: true, width: 50 },
  { field: "G_NAME", headerName: "G_NAME", resizable: true, width: 100 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", resizable: true, width: 70 },
  { field: "KNIFE_FILM_NO", headerName: "KNIFE_FILM_NO", resizable: true, width: 100 },
  { field: "QTY_KNIFE_FILM", headerName: "QTY", resizable: true, width: 50 },
  { field: "CAVITY", headerName: "CAVITY", resizable: true, width: 100 },
  { field: "PD", headerName: "PD", resizable: true, width: 100 },
  { field: "EQ_THUC_TE", headerName: "EQ", resizable: true, width: 40 },
  {
    field: "PRESS_QTY",
    headerName: "PRESS_QTY",
    resizable: true,
    width: 70,
    cellRenderer: (params: any) => (
      <span style={monoNumStyle("#2563eb")}>
        {params.data?.PRESS_QTY?.toLocaleString("en-US")}
      </span>
    ),
  },
  { field: "EMPL_NO", headerName: "EMPL_NO", resizable: true, width: 70 },
  {
    field: "LOAIBANGIAO_PDP",
    headerName: "PHANLOAI",
    resizable: true,
    width: 60,
    cellRenderer: (params: any) => {
      switch (params.data?.LOAIBANGIAO_PDP) {
        case "D":
          return <span style={badgeStyle("#eff6ff", "#1d4ed8", "#bfdbfe")}>DAO</span>;
        case "F":
          return <span style={badgeStyle("#fdf2f8", "#be185d", "#fbcfe8")}>FILM</span>;
        case "T":
          return <span style={badgeStyle("#f0fdf4", "#15803d", "#bbf7d0")}>TAI LIEU</span>;
        default:
          return <span style={badgeStyle("#f1f5f9", "#475569", "#cbd5e1")}>N/A</span>;
      }
    },
  },
  { field: "F_WIDTH", headerName: "F_WIDTH", resizable: true, width: 70 },
  { field: "F_LENGTH", headerName: "F_LENGTH", resizable: true, width: 70 },
  { field: "F_NEW", headerName: "F_NEW", resizable: true, width: 70 },
  { field: "INS_EMPL", headerName: "DF_EMPL", resizable: true, width: 70 },
  { field: "SX_EMPL_NO", headerName: "SX_EMPL", resizable: true, width: 70 },
  { field: "SX_DATE", headerName: "SX_DATE", resizable: true, width: 60 },
  { field: "ERR_CODE", headerName: "ERR_CODE", resizable: true, width: 60 },
  { field: "ERR_NAME", headerName: "ERR_NAME", resizable: true, width: 60 },
];
