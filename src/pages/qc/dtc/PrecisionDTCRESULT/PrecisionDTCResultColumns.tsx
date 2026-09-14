import React from "react";
import { DTC_RESULT_INPUT } from "./dtcResultUtils";

export const getDTCResultColumns = () => [
  {
    field: "DTC_ID",
    headerName: "DTC ID",
    width: 85,
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
    field: "SAMPLE_NO",
    headerName: "MẪU",
    width: 75,
    pinned: "left",
    cellRenderer: (params: any) => (
      <span
        style={{
          fontFamily: "ui-monospace, monospace",
          fontWeight: 600,
          background: "#f1f5f9",
          color: "#475569",
          padding: "1px 5px",
          borderRadius: "4px",
          fontSize: "10.5px",
        }}
      >
        M#{params.value || 1}
      </span>
    ),
  },
  {
    field: "POINT_NAME",
    headerName: "ĐIỂM ĐO",
    width: 100,
    pinned: "left",
    cellRenderer: (params: any) => (
      <span style={{ fontWeight: 700, color: "#0f172a" }}>
        {params.value || ""}
      </span>
    ),
  },
  {
    field: "CENTER_VALUE",
    headerName: "GIÁ TRỊ T.TÂM",
    width: 105,
    cellRenderer: (params: any) => {
      const val = Number(params.value);
      return (
        <span
          style={{
            fontFamily: "ui-monospace, monospace",
            fontWeight: 700,
            color: "#334155",
            fontSize: "11.5px",
          }}
        >
          {isNaN(val) ? params.value : val.toLocaleString("en-US")}
        </span>
      );
    },
  },
  {
    field: "LOWER_TOR",
    headerName: "D.SAI DƯỚI (-)",
    width: 105,
    cellRenderer: (params: any) => {
      const val = Number(params.value);
      return (
        <span
          style={{
            fontFamily: "ui-monospace, monospace",
            color: "#dc2626",
            fontWeight: 600,
            fontSize: "11px",
          }}
        >
          {isNaN(val) ? "" : `-${val.toLocaleString("en-US")}`}
        </span>
      );
    },
  },
  {
    field: "UPPER_TOR",
    headerName: "D.SAI TRÊN (+)",
    width: 105,
    cellRenderer: (params: any) => {
      const val = Number(params.value);
      return (
        <span
          style={{
            fontFamily: "ui-monospace, monospace",
            color: "#059669",
            fontWeight: 600,
            fontSize: "11px",
          }}
        >
          {isNaN(val) ? "" : `+${val.toLocaleString("en-US")}`}
        </span>
      );
    },
  },
  {
    field: "RESULT",
    headerName: "KẾT QUẢ ĐO",
    width: 125,
    editable: true,
    cellEditor: "agTextCellEditor",
    cellRenderer: (params: any) => {
      if (params.value === null || params.value === undefined || params.value === "") {
        return (
          <span style={{ color: "#94a3b8", fontStyle: "italic", fontSize: "11px" }}>
            Nhấp đúp nhập...
          </span>
        );
      }

      const rs = Number(params.value);
      const center = Number(params.data?.CENTER_VALUE || 0);
      const upper = Number(params.data?.UPPER_TOR || 0);
      const lower = Number(params.data?.LOWER_TOR || 0);

      const isNG = rs > center + upper || rs < center - lower;

      return (
        <span
          style={{
            fontFamily: "ui-monospace, monospace",
            fontWeight: 800,
            fontSize: "12px",
            color: isNG ? "#ef4444" : "#059669",
            background: isNG ? "#fff1f2" : "#ecfdf5",
            padding: "1px 6px",
            borderRadius: "4px",
            border: `1px solid ${isNG ? "#fecdd3" : "#a7f3d0"}`,
          }}
        >
          {isNaN(rs) ? params.value : rs.toLocaleString("en-US")}
        </span>
      );
    },
  },
  {
    field: "STATUS",
    headerName: "ĐÁNH GIÁ",
    width: 90,
    cellRenderer: (params: any) => {
      const row: DTC_RESULT_INPUT = params.data;
      if (row.RESULT === null || row.RESULT === undefined || isNaN(Number(row.RESULT))) {
        return (
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              padding: "1px 6px",
              borderRadius: "4px",
              background: "#f1f5f9",
              color: "#64748b",
            }}
          >
            CHỜ ĐO
          </span>
        );
      }

      const rs = Number(row.RESULT);
      const center = Number(row.CENTER_VALUE || 0);
      const upper = Number(row.UPPER_TOR || 0);
      const lower = Number(row.LOWER_TOR || 0);

      const isNG = rs > center + upper || rs < center - lower;

      return (
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: "4px",
            background: isNG ? "#fff1f2" : "#ecfdf5",
            color: isNG ? "#e11d48" : "#047857",
            border: `1px solid ${isNG ? "#fecdd3" : "#a7f3d0"}`,
          }}
        >
          {isNG ? "NG" : "OK"}
        </span>
      );
    },
  },
  {
    field: "TEST_NAME",
    headerName: "HẠNG MỤC TEST",
    width: 120,
    cellRenderer: (params: any) => (
      <span style={{ fontSize: "11px", color: "#475569" }}>
        {params.value || ""}
      </span>
    ),
  },
  {
    field: "G_NAME",
    headerName: "TÊN SẢN PHẨM",
    width: 150,
  },
  {
    field: "M_NAME",
    headerName: "TÊN VẬT LIỆU",
    width: 150,
  },
  {
    field: "REMARK",
    headerName: "GHI CHÚ",
    width: 140,
    editable: true,
    cellEditor: "agTextCellEditor",
    cellRenderer: (params: any) => (
      <span style={{ fontStyle: "italic", color: "#64748b", fontSize: "11px" }}>
        {params.value || "Nhấp để ghi chú..."}
      </span>
    ),
  },
];
