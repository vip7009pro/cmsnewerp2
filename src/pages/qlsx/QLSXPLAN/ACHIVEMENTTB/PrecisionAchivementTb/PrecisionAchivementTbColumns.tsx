import React from "react";

export const getColumnAchivementTb = () => [
  {
    headerName: "EQ_NAME",
    field: "EQ_NAME",
    width: 80,
    editable: false,
    cellClass: "ag-header-cell-content",
    cellRenderer: (params: any) => {
      const isTotal = params.value === "TOTAL";
      return (
        <span
          className={isTotal ? "cell-mono-bold" : "cell-mono"}
          style={{ color: isTotal ? "#dc2626" : "#0284c7" }}
        >
          {params.value}
        </span>
      );
    },
  },
  {
    headerName: "YCSX_NO",
    field: "PROD_REQUEST_NO",
    width: 100,
    editable: false,
    cellClass: "ag-header-cell-content",
    cellRenderer: (params: any) => {
      const isTotal = params.value === "TOTAL";
      return (
        <span
          className={isTotal ? "cell-mono-bold" : "cell-mono"}
          style={{ color: isTotal ? "#dc2626" : "#1e293b" }}
        >
          {params.value}
        </span>
      );
    },
  },
  {
    headerName: "CODE KD",
    field: "G_NAME_KD",
    width: 120,
    editable: false,
    cellClass: "ag-header-cell-content",
    cellStyle: function (params: any) {
      if (!params.data || params.data.EQ_NAME === "TOTAL") {
        return { color: "#dc2626", fontWeight: "bold" };
      }
      if (
        params.data.FACTORY === null ||
        params.data.EQ1 === null ||
        params.data.EQ2 === null ||
        params.data.Setting1 === null ||
        params.data.Setting2 === null ||
        params.data.UPH1 === null ||
        params.data.UPH2 === null ||
        params.data.Step1 === null ||
        params.data.LOSS_SX1 === null ||
        params.data.LOSS_SX2 === null ||
        params.data.LOSS_SETTING1 === null ||
        params.data.LOSS_SETTING2 === null
      ) {
        return { color: "#dc2626", fontWeight: "600" };
      } else {
        return { color: "#16a34a", fontWeight: "600" };
      }
    },
  },
  {
    headerName: "STEP",
    field: "STEP",
    width: 50,
    editable: false,
    cellClass: "ag-header-cell-content",
    cellRenderer: (params: any) => (
      <span className="cell-mono" style={{ color: "#64748b" }}>
        {params.value || "-"}
      </span>
    ),
  },
  {
    headerName: "PLAN_DAY",
    field: "PLAN_DAY",
    width: 90,
    editable: false,
    cellClass: "ag-header-cell-content",
    cellRenderer: (params: any) => {
      const isTotal = params.data?.EQ_NAME === "TOTAL";
      return (
        <span
          className={isTotal ? "cell-mono-bold" : "cell-mono"}
          style={{ color: "#64748b" }}
        >
          {params.value !== undefined && params.value !== null
            ? params.value.toLocaleString("en-US")
            : "0"}
        </span>
      );
    },
  },
  {
    headerName: "PLAN_NIGHT",
    field: "PLAN_NIGHT",
    width: 90,
    editable: false,
    cellClass: "ag-header-cell-content",
    cellRenderer: (params: any) => {
      const isTotal = params.data?.EQ_NAME === "TOTAL";
      return (
        <span
          className={isTotal ? "cell-mono-bold" : "cell-mono"}
          style={{ color: "#64748b" }}
        >
          {params.value !== undefined && params.value !== null
            ? params.value.toLocaleString("en-US")
            : "0"}
        </span>
      );
    },
  },
  {
    headerName: "PLAN_TOTAL",
    field: "PLAN_TOTAL",
    width: 90,
    editable: false,
    cellClass: "ag-header-cell-content",
    cellRenderer: (params: any) => (
      <span className="cell-mono-bold" style={{ color: "#334155" }}>
        {params.value !== undefined && params.value !== null
          ? params.value.toLocaleString("en-US")
          : "0"}
      </span>
    ),
  },
  {
    headerName: "RESULT_DAY",
    field: "RESULT_DAY",
    width: 110,
    editable: false,
    cellClass: "ag-header-cell-content",
    cellRenderer: (params: any) => {
      const isTotal = params.data?.EQ_NAME === "TOTAL";
      return (
        <span
          className={isTotal ? "cell-mono-bold" : "cell-mono"}
          style={{ color: "#0284c7" }}
        >
          {params.value !== undefined && params.value !== null
            ? params.value.toLocaleString("en-US")
            : "0"}
        </span>
      );
    },
  },
  {
    headerName: "RESULT_NIGHT",
    field: "RESULT_NIGHT",
    width: 110,
    editable: false,
    cellClass: "ag-header-cell-content",
    cellRenderer: (params: any) => {
      const isTotal = params.data?.EQ_NAME === "TOTAL";
      return (
        <span
          className={isTotal ? "cell-mono-bold" : "cell-mono"}
          style={{ color: "#0284c7" }}
        >
          {params.value !== undefined && params.value !== null
            ? params.value.toLocaleString("en-US")
            : "0"}
        </span>
      );
    },
  },
  {
    headerName: "RESULT_TOTAL",
    field: "RESULT_TOTAL",
    width: 110,
    editable: false,
    cellClass: "ag-header-cell-content",
    cellRenderer: (params: any) => (
      <span className="cell-mono-bold" style={{ color: "#0369a1" }}>
        {params.value !== undefined && params.value !== null
          ? params.value.toLocaleString("en-US")
          : "0"}
      </span>
    ),
  },
  {
    headerName: "DAY_RATE",
    field: "DAY_RATE",
    width: 100,
    editable: false,
    cellClass: "ag-header-cell-content",
    cellRenderer: (params: any) => {
      if (params.data?.PLAN_DAY === 0) {
        return <span className="status-badge status-badge--gray">N/A</span>;
      }
      if (params.value !== undefined && params.value !== null) {
        const isOk = params.value >= 100;
        return (
          <span
            className={`status-badge ${
              isOk ? "status-badge--green" : "status-badge--red"
            }`}
          >
            {params.value.toLocaleString("en-US", { maximumFractionDigits: 0 })}%
          </span>
        );
      }
      return <span>0%</span>;
    },
  },
  {
    headerName: "NIGHT_RATE",
    field: "NIGHT_RATE",
    width: 100,
    editable: false,
    cellClass: "ag-header-cell-content",
    cellRenderer: (params: any) => {
      if (params.data?.PLAN_NIGHT === 0) {
        return <span className="status-badge status-badge--gray">N/A</span>;
      }
      if (params.value !== undefined && params.value !== null) {
        const isOk = params.value >= 100;
        return (
          <span
            className={`status-badge ${
              isOk ? "status-badge--green" : "status-badge--red"
            }`}
          >
            {params.value.toLocaleString("en-US", { maximumFractionDigits: 0 })}%
          </span>
        );
      }
      return <span>0%</span>;
    },
  },
  {
    headerName: "TOTAL_RATE",
    field: "TOTAL_RATE",
    width: 100,
    editable: false,
    cellClass: "ag-header-cell-content",
    cellRenderer: (params: any) => {
      if (params.data?.PLAN_TOTAL === 0) {
        return <span className="status-badge status-badge--gray">N/A</span>;
      }
      if (params.value !== undefined && params.value !== null) {
        const isOk = params.value >= 100;
        return (
          <span
            className={`status-badge ${
              isOk ? "status-badge--green" : "status-badge--red"
            }`}
          >
            {params.value.toLocaleString("en-US", { maximumFractionDigits: 0 })}%
          </span>
        );
      }
      return <span>0%</span>;
    },
  },
];
