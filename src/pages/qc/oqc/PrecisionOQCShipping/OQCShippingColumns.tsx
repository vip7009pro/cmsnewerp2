import React from "react";

export const getOQCShippingColumns = () => {
  return [
    {
      field: "OUT_ID_KEY",
      headerName: "MÃ ĐỢT XUẤT",
      width: 100,
      cellRenderer: (params: any) => (
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: 600,
            color: "#64748b",
          }}
          title={params.value}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "WEEK_",
      headerName: "TUẦN",
      width: 65,
      cellRenderer: (params: any) => (
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: 700,
            fontSize: "0.74rem",
            color: "#334155",
            background: "#f1f5f9",
            padding: "2px 6px",
            borderRadius: "4px",
            border: "1px solid #e2e8f0",
            display: "inline-block",
            textAlign: "center",
          }}
        >
          W{params.value}
        </span>
      ),
    },
    {
      field: "OUT_DATE",
      headerName: "NGÀY XUẤT",
      width: 95,
      cellRenderer: (params: any) => (
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.75rem",
            color: "#1e293b",
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "OUT_SHIFT",
      headerName: "CA",
      width: 75,
      cellRenderer: (params: any) => {
        const val = String(params.value || "").toUpperCase();
        const isDay = val.includes("DAY") || val === "1" || val.includes("NGAY");
        return (
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "2px 6px",
              borderRadius: "4px",
              background: isDay ? "#fffbeb" : "#eef2ff",
              color: isDay ? "#b45309" : "#4338ca",
              border: `1px solid ${isDay ? "#fde68a" : "#c7d2fe"}`,
              display: "inline-block",
            }}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      field: "PO_TYPE",
      headerName: "LOẠI PO",
      width: 80,
      cellRenderer: (params: any) => (
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "#475569",
            background: "#f8fafc",
            padding: "1px 5px",
            borderRadius: "3px",
            border: "1px solid #e2e8f0",
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "CUST_NAME_KD",
      headerName: "KHÁCH HÀNG (KD)",
      width: 140,
      cellRenderer: (params: any) => (
        <span
          style={{ fontWeight: 600, color: "#0284c7" }}
          title={params.value}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "OUT_CUST_NAME",
      headerName: "KH XUẤT KHO",
      width: 130,
      cellRenderer: (params: any) => (
        <span
          style={{ fontWeight: 500, color: "#475569" }}
          title={params.value}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "G_CODE",
      headerName: "MÃ ERP",
      width: 95,
      cellRenderer: (params: any) => (
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: 700,
            color: "#2563eb",
          }}
          title={params.value}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "G_NAME",
      headerName: "TÊN SẢN PHẨM",
      width: 180,
      cellRenderer: (params: any) => (
        <span
          style={{ fontWeight: 600, color: "#0f172a" }}
          title={params.value}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "PLAN_ID",
      headerName: "CHỈ THỊ (PLAN)",
      width: 100,
      cellRenderer: (params: any) => (
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.75rem",
            color: "#334155",
          }}
          title={params.value}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "OUT_QTY",
      headerName: "SL XUẤT (PCS)",
      width: 110,
      cellRenderer: (params: any) => {
        const val = Number(params.value) || 0;
        return (
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: 700,
              color: "#047857",
              textAlign: "right",
              display: "block",
            }}
          >
            {val.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "SAMPLING_QTY",
      headerName: "MẪU AQL",
      width: 90,
      cellRenderer: (params: any) => {
        const val = Number(params.value) || 0;
        return (
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              textAlign: "right",
              display: "block",
              color: "#334155",
              fontWeight: 600,
            }}
          >
            {val.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "SAMPLE_NG_QTY_TT",
      headerName: "MẪU LỖI (NG)",
      width: 100,
      cellRenderer: (params: any) => {
        const val = Number(params.value) || 0;
        return (
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: val > 0 ? 700 : 400,
              color: val > 0 ? "#dc2626" : "#64748b",
              textAlign: "right",
              display: "block",
            }}
          >
            {val.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "RATE_OK",
      headerName: "TỶ LỆ OK (%)",
      width: 100,
      cellRenderer: (params: any) => {
        const val = Number(params.value) || 0;
        const isPerfect = val >= 100;
        return (
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: 700,
              color: isPerfect ? "#16a34a" : "#dc2626",
              textAlign: "right",
              display: "block",
            }}
          >
            {val.toFixed(2)}%
          </span>
        );
      },
    },
    {
      field: "OUT_STATUS_RESULT",
      headerName: "KẾT QUẢ / TRẠNG THÁI",
      width: 120,
      cellRenderer: (params: any) => {
        const status = String(params.value || "").toUpperCase();
        let bg = "#f1f5f9";
        let color = "#475569";
        let border = "#cbd5e1";

        if (status === "PASS") {
          bg = "#ecfdf5";
          color = "#047857";
          border = "#a7f3d0";
        } else if (status === "PENDING") {
          bg = "#fffbeb";
          color = "#b45309";
          border = "#fde68a";
        } else if (status === "CLOSED") {
          bg = "#eff6ff";
          color = "#1d4ed8";
          border = "#bfdbfe";
        }

        return (
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "4px",
              background: bg,
              color: color,
              border: `1px solid ${border}`,
              display: "inline-block",
              textAlign: "center",
            }}
          >
            {params.value}
          </span>
        );
      },
    },
  ];
};
