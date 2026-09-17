import React from "react";

export const getColumnAchivementTable = () => [
  {
    field: "MACHINE_NAME",
    headerName: "MACHINE_NAME",
    width: 110,
    cellRenderer: (params: any) => {
      const isTotal = params.value === "TOTAL";
      return (
        <span
          style={{
            fontWeight: 800,
            color: isTotal ? "#dc2626" : "#0284c7",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {params.value}
        </span>
      );
    },
  },
  {
    field: "PLAN_QTY",
    headerName: "PLAN_QTY",
    width: 95,
    cellRenderer: (params: any) => (
      <span className="cell-mono-bold" style={{ color: "#360EEA" }}>
        {params.value !== undefined && params.value !== null
          ? params.value.toLocaleString("en-US", { maximumFractionDigits: 0 })
          : "-"}
      </span>
    ),
  },
  {
    field: "WH_OUTPUT",
    headerName: "WH_OUTPUT",
    width: 95,
    cellRenderer: (params: any) => (
      <span className="cell-mono" style={{ color: "#B09403" }}>
        {params.value !== undefined && params.value !== null
          ? params.value.toLocaleString("en-US", { maximumFractionDigits: 0 })
          : "-"}
      </span>
    ),
  },
  {
    field: "SX_RESULT_TOTAL",
    headerName: "SX_RESULT_TOTAL",
    width: 110,
    cellRenderer: (params: any) => (
      <span className="cell-mono-bold" style={{ color: "#EA0EBA" }}>
        {params.value !== undefined && params.value !== null
          ? params.value.toLocaleString("en-US", { maximumFractionDigits: 0 })
          : "-"}
      </span>
    ),
  },
  {
    field: "RESULT_STEP_FINAL",
    headerName: "RESULT_STEP_FINAL",
    width: 110,
    cellRenderer: (params: any) => (
      <span className="cell-mono" style={{ color: "#EA0EBA" }}>
        {params.value !== undefined && params.value !== null
          ? params.value.toLocaleString("en-US", { maximumFractionDigits: 0 })
          : "-"}
      </span>
    ),
  },
  {
    field: "RESULT_TO_NEXT_PROCESS",
    headerName: "RESULT_TO_NEXT_PROCESS",
    width: 120,
    cellRenderer: (params: any) => (
      <span className="cell-mono" style={{ color: "#F16E05" }}>
        {params.value !== undefined && params.value !== null
          ? params.value.toLocaleString("en-US", { maximumFractionDigits: 0 })
          : "-"}
      </span>
    ),
  },
  {
    field: "RESULT_TO_INSPECTION",
    headerName: "RESULT_TO_INSPECTION",
    width: 120,
    cellRenderer: (params: any) => (
      <span className="cell-mono" style={{ color: "#F16E05" }}>
        {params.value !== undefined && params.value !== null
          ? params.value.toLocaleString("en-US", { maximumFractionDigits: 0 })
          : "-"}
      </span>
    ),
  },
  {
    field: "INS_INPUT",
    headerName: "INS_INPUT",
    width: 95,
    cellRenderer: (params: any) => (
      <span className="cell-mono" style={{ color: "#009E4D" }}>
        {params.value !== undefined && params.value !== null
          ? params.value.toLocaleString("en-US", { maximumFractionDigits: 0 })
          : "-"}
      </span>
    ),
  },
  {
    field: "INSPECT_TOTAL_QTY",
    headerName: "INSPECT_TOTAL_QTY",
    width: 110,
    cellRenderer: (params: any) => (
      <span className="cell-mono" style={{ color: "#009E4D" }}>
        {params.value !== undefined && params.value !== null
          ? params.value.toLocaleString("en-US", { maximumFractionDigits: 0 })
          : "-"}
      </span>
    ),
  },
  {
    field: "INSPECT_OK_QTY",
    headerName: "INSPECT_OK_QTY",
    width: 100,
    cellRenderer: (params: any) => (
      <span className="cell-mono-bold" style={{ color: "#1C9E00" }}>
        {params.value !== undefined && params.value !== null
          ? params.value.toLocaleString("en-US", { maximumFractionDigits: 0 })
          : "-"}
      </span>
    ),
  },
  {
    field: "INSPECT_NG_QTY",
    headerName: "INSPECT_NG_QTY",
    width: 95,
    cellRenderer: (params: any) => (
      <span className="cell-mono-bold" style={{ color: "#dc2626" }}>
        {params.value !== undefined && params.value !== null
          ? params.value.toLocaleString("en-US", { maximumFractionDigits: 0 })
          : "-"}
      </span>
    ),
  },
  {
    field: "INS_OUTPUT",
    headerName: "INS_OUTPUT",
    width: 95,
    cellRenderer: (params: any) => (
      <span className="cell-mono" style={{ color: "#929E00" }}>
        {params.value !== undefined && params.value !== null
          ? params.value.toLocaleString("en-US", { maximumFractionDigits: 0 })
          : "-"}
      </span>
    ),
  },
  {
    field: "TOTAL_LOSS",
    headerName: "TOTAL_LOSS",
    width: 95,
    cellRenderer: (params: any) => (
      <span className="cell-mono-bold" style={{ color: "#dc2626" }}>
        {params.value !== undefined && params.value !== null
          ? `${params.value.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`
          : "-"}
      </span>
    ),
  },
  {
    field: "ACHIVEMENT_RATE",
    headerName: "ACHIVEMENT_RATE",
    width: 110,
    cellRenderer: (params: any) => (
      <span className="cell-mono-bold" style={{ color: "#16a34a" }}>
        {params.value !== undefined && params.value !== null
          ? `${params.value.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`
          : "-"}
      </span>
    ),
  },
];

export const getColumnTimeEfficiencyTable = () => [
  {
    field: "PLAN_FACTORY",
    headerName: "PLAN_FACTORY",
    width: 100,
    cellRenderer: (params: any) => {
      const isTotal = params.value === "TOTAL";
      return (
        <span
          className={isTotal ? "cell-mono-bold" : "cell-badge cell-badge--blue"}
          style={isTotal ? { color: "#dc2626" } : undefined}
        >
          {params.value || "-"}
        </span>
      );
    },
  },
  {
    field: "MACHINE",
    headerName: "MACHINE",
    width: 90,
    cellClass: "cell-mono-bold",
  },
  {
    field: "TOTAL_TIME",
    headerName: "TOTAL_TIME",
    width: 95,
    cellRenderer: (params: any) => (
      <span className="cell-mono" style={{ color: "#360EEA" }}>
        {params.value !== undefined && params.value !== null
          ? params.value.toLocaleString("en-US", { maximumFractionDigits: 0 })
          : "-"}
      </span>
    ),
  },
  {
    field: "RUN_TIME_SX",
    headerName: "RUN_TIME_SX",
    width: 95,
    cellRenderer: (params: any) => {
      const actualRunTime =
        params.data?.RUN_TIME_SX !== undefined && params.data?.LOSS_TIME !== undefined
          ? params.data.RUN_TIME_SX - params.data.LOSS_TIME
          : params.value;
      return (
        <span className="cell-mono-bold" style={{ color: "#EA0EBA" }}>
          {actualRunTime !== undefined && actualRunTime !== null
            ? actualRunTime.toLocaleString("en-US", { maximumFractionDigits: 0 })
            : "-"}
        </span>
      );
    },
  },
  {
    field: "SETTING_TIME",
    headerName: "SETTING_TIME",
    width: 95,
    cellRenderer: (params: any) => (
      <span className="cell-mono" style={{ color: "#EA0EBA" }}>
        {params.value !== undefined && params.value !== null
          ? params.value.toLocaleString("en-US", { maximumFractionDigits: 0 })
          : "-"}
      </span>
    ),
  },
  {
    field: "LOSS_TIME",
    headerName: "LOSS_TIME",
    width: 95,
    cellRenderer: (params: any) => (
      <span className="cell-mono-bold" style={{ color: "#dc2626" }}>
        {params.value !== undefined && params.value !== null
          ? params.value.toLocaleString("en-US", { maximumFractionDigits: 0 })
          : "-"}
      </span>
    ),
  },
  {
    field: "PROD_EFFICIENCY",
    headerName: "PROD_EFFICIENCY",
    width: 110,
    cellRenderer: (params: any) => {
      let val = params.value;
      if (val === undefined && params.data) {
        val =
          ((params.data.RUN_TIME_SX + params.data.SETTING_TIME - params.data.LOSS_TIME) /
            params.data.TOTAL_TIME) *
          100;
      }
      return (
        <span className="cell-mono-bold" style={{ color: "#16a34a" }}>
          {val !== undefined && val !== null && !isNaN(val)
            ? `${val.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`
            : "-"}
        </span>
      );
    },
  },
  {
    field: "EQ_EFFICIENCY",
    headerName: "EQ_EFFICIENCY",
    width: 100,
    cellRenderer: (params: any) => {
      let val = params.value;
      if (val === undefined && params.data) {
        val =
          ((params.data.RUN_TIME_SX - params.data.LOSS_TIME) / params.data.TOTAL_TIME) * 100;
      }
      return (
        <span className="cell-mono-bold" style={{ color: "#16a34a" }}>
          {val !== undefined && val !== null && !isNaN(val)
            ? `${val.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`
            : "-"}
        </span>
      );
    },
  },
  {
    field: "SETTING_TIME_RATE",
    headerName: "SETTING_TIME_RATE",
    width: 110,
    cellRenderer: (params: any) => {
      let val = params.value;
      if (val === undefined && params.data) {
        val = (params.data.SETTING_TIME / params.data.TOTAL_TIME) * 100;
      } else if (val !== undefined && val <= 1) {
        val = val * 100;
      }
      return (
        <span className="cell-mono" style={{ color: "#B09403" }}>
          {val !== undefined && val !== null && !isNaN(val)
            ? `${val.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`
            : "-"}
        </span>
      );
    },
  },
  {
    field: "LOSS_TIME_RATE",
    headerName: "LOSS_TIME_RATE",
    width: 105,
    cellRenderer: (params: any) => {
      let val = params.value;
      if (val === undefined && params.data) {
        val = (params.data.LOSS_TIME / params.data.TOTAL_TIME) * 100;
      } else if (val !== undefined && val <= 1) {
        val = val * 100;
      }
      return (
        <span className="cell-mono-bold" style={{ color: "#dc2626" }}>
          {val !== undefined && val !== null && !isNaN(val)
            ? `${val.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`
            : "-"}
        </span>
      );
    },
  },
];
