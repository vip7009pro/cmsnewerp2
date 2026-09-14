import React from "react";
import moment from "moment";

export const getDKDTCColumnDefs = () => [
  {
    field: "DTC_ID",
    headerName: "DTC ID",
    width: 80,
    pinned: "left",
    cellRenderer: (params: any) => {
      if (!params.value) return "";
      return (
        <span
          style={{
            fontFamily: "ui-monospace, monospace",
            fontWeight: 700,
            color: "#1d4ed8",
            background: "#eff6ff",
            padding: "1px 6px",
            borderRadius: "4px",
            fontSize: "11px",
          }}
        >
          #{params.value}
        </span>
      );
    },
  },
  {
    field: "TEST_TYPE_NAME",
    headerName: "PHÂN LOẠI",
    width: 130,
    cellRenderer: (params: any) => {
      const val = params.value || "";
      let bg = "#f1f5f9";
      let color = "#475569";
      let border = "#cbd5e1";

      if (val.includes("MASS")) {
        bg = "#ecfdf5";
        color = "#047857";
        border = "#a7f3d0";
      } else if (val.includes("FIRST")) {
        bg = "#eff6ff";
        color = "#1d4ed8";
        border = "#bfdbfe";
      } else if (val.includes("ECN")) {
        bg = "#fffbeb";
        color = "#b45309";
        border = "#fde68a";
      } else if (val.includes("SAMPLE")) {
        bg = "#f5f3ff";
        color = "#6d28d9";
        border = "#ddd6fe";
      }

      return (
        <span
          style={{
            background: bg,
            color: color,
            border: `1px solid ${border}`,
            padding: "1px 6px",
            borderRadius: "4px",
            fontSize: "10px",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {val}
        </span>
      );
    },
  },
  {
    field: "TEST_NAME",
    headerName: "HẠNG MỤC TEST",
    width: 140,
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 600, color: "#0f172a" }}>
        {params.value || ""}
      </span>
    ),
  },
  {
    field: "TEST_FINISH_TIME",
    headerName: "TRẠNG THÁI TEST",
    width: 140,
    cellRenderer: (params: any) => {
      const finished = Boolean(params.value);
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "1px 6px",
            borderRadius: "4px",
            fontSize: "10px",
            fontWeight: 600,
            background: finished ? "#ecfdf5" : "#fffbeb",
            color: finished ? "#047857" : "#b45309",
            border: `1px solid ${finished ? "#a7f3d0" : "#fde68a"}`,
          }}
        >
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: finished ? "#10b981" : "#f59e0b",
            }}
          />
          {finished ? moment(params.value).format("YYYY-MM-DD HH:mm") : "ĐANG TEST..."}
        </span>
      );
    },
  },
  {
    field: "PROD_REQUEST_NO",
    headerName: "MÃ YCSX",
    width: 95,
    cellRenderer: (params: any) => {
      if (!params.value) return "";
      return (
        <span
          style={{
            fontFamily: "ui-monospace, monospace",
            fontWeight: 600,
            color: "#334155",
          }}
        >
          {params.value}
        </span>
      );
    },
  },
  {
    field: "G_NAME",
    headerName: "TÊN SẢN PHẨM",
    width: 150,
    cellRenderer: (params: any) => (
      <span title={params.value || ""} style={{ fontWeight: 500 }}>
        {params.value || ""}
      </span>
    ),
  },
  {
    field: "G_CODE",
    headerName: "MÃ SẢN PHẨM",
    width: 95,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "11px", color: "#64748b" }}>
        {params.value || ""}
      </span>
    ),
  },
  {
    field: "M_NAME",
    headerName: "TÊN NGUYÊN VẬT LIỆU",
    width: 150,
    cellRenderer: (params: any) => (
      <span title={params.value || ""} style={{ fontWeight: 500 }}>
        {params.value || ""}
      </span>
    ),
  },
  {
    field: "LOTCMS",
    headerName: "LOT CMS / NVL",
    width: 110,
    cellRenderer: (params: any) => (
      <span
        style={{
          fontFamily: "ui-monospace, monospace",
          fontSize: "11px",
          color: "#059669",
          fontWeight: 600,
        }}
      >
        {params.value || ""}
      </span>
    ),
  },
  {
    field: "REQUEST_EMPL_NO",
    headerName: "NV YÊU CẦU",
    width: 95,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "11px", fontWeight: 600 }}>
        {params.value || ""}
      </span>
    ),
  },
  {
    field: "WORK_POSITION_NAME",
    headerName: "BỘ PHẬN Y/C",
    width: 110,
    cellRenderer: (params: any) => (
      <span style={{ fontSize: "11px", color: "#475569" }}>
        {params.value || ""}
      </span>
    ),
  },
  {
    field: "REQUEST_DATETIME",
    headerName: "THỜI ĐIỂM YÊU CẦU",
    width: 130,
    cellRenderer: (params: any) => {
      if (!params.value) return "";
      return (
        <span style={{ fontSize: "10.5px", color: "#64748b" }}>
          {moment(params.value).format("YYYY-MM-DD HH:mm")}
        </span>
      );
    },
  },
  {
    field: "TEST_EMPL_NO",
    headerName: "NV THỰC HIỆN",
    width: 100,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "11px", color: "#2563eb" }}>
        {params.value || ""}
      </span>
    ),
  },
  {
    field: "SIZE",
    headerName: "QUY CÁCH",
    width: 100,
  },
  {
    field: "FACTORY",
    headerName: "NHÀ MÁY",
    width: 80,
  },
  {
    field: "REMARK",
    headerName: "GHI CHÚ",
    width: 140,
    cellRenderer: (params: any) => (
      <span style={{ fontStyle: "italic", color: "#64748b", fontSize: "11px" }}>
        {params.value || ""}
      </span>
    ),
  },
];
