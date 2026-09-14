import React from "react";

const renderTruncated = (val: any) => {
  if (val === null || val === undefined || val === "") return "-";
  const str = String(val);
  return (
    <span className="cell-truncate" title={str}>
      {str}
    </span>
  );
};

const renderMono = (val: any, colorClass = "text-slate-700") => (
  <span className={`mono-code cell-truncate ${colorClass}`} title={val ? String(val) : "-"}>
    {val || "-"}
  </span>
);

const renderRightNum = (val: any, colorClass = "") => (
  <div style={{ textAlign: "right", width: "100%" }} className={`mono-code ${colorClass}`}>
    {val != null ? Number(val).toLocaleString() : "-"}
  </div>
);

export const getHoldingColumns = () => [
  {
    field: "HOLD_ID",
    headerName: "HOLD_ID",
    headerCheckboxSelection: true,
    checkboxSelection: true,
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderMono(p.value, "text-slate-800 font-semibold"),
  },
  {
    field: "NCR_ID",
    headerName: "NCR_ID",
    resizable: true,
    width: 40,
    cellRenderer: (p: any) => renderMono(p.value, "font-bold text-rose-600"),
  },
  {
    field: "HOLDING_MONTH",
    headerName: "HOLDING_MONTH",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderMono(p.value),
  },
  {
    field: "FACTORY",
    headerName: "FACTORY",
    resizable: true,
    width: 50,
    cellRenderer: (p: any) => renderTruncated(p.value),
  },
  {
    field: "WAHS_CD",
    headerName: "WAHS_CD",
    resizable: true,
    width: 50,
    cellRenderer: (p: any) => renderMono(p.value),
  },
  {
    field: "LOC_CD",
    headerName: "LOC_CD",
    resizable: true,
    width: 50,
    cellRenderer: (p: any) => renderMono(p.value),
  },
  {
    field: "M_LOT_NO",
    headerName: "M_LOT_NO",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => {
      const isPass = p.data?.QC_PASS === "Y";
      return (
        <span
          className={`lot-highlight cell-truncate ${isPass ? "lot-highlight--pass" : "lot-highlight--other"}`}
          title={p.value}
        >
          {p.value || "-"}
        </span>
      );
    },
  },
  {
    field: "M_CODE",
    headerName: "M_CODE",
    resizable: true,
    width: 60,
    cellRenderer: (p: any) => renderMono(p.value, "text-blue-600 font-semibold"),
  },
  {
    field: "M_NAME",
    headerName: "M_NAME",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderTruncated(p.value),
  },
  {
    field: "WIDTH_CD",
    headerName: "WIDTH_CD",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderRightNum(p.value, "text-slate-700"),
  },
  {
    field: "HOLDING_ROLL_QTY",
    headerName: "HOLDING_ROLL_QTY",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderRightNum(p.value, "font-semibold"),
  },
  {
    field: "HOLDING_QTY",
    headerName: "HOLDING_QTY",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderRightNum(p.value, "font-semibold"),
  },
  {
    field: "HOLDING_TOTAL_QTY",
    headerName: "HOLDING_TOTAL_QTY",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderRightNum(p.value, "font-bold text-emerald-600"),
  },
  {
    field: "REASON",
    headerName: "REASON",
    resizable: true,
    editable: true,
    width: 80,
    cellRenderer: (p: any) => renderTruncated(p.value),
  },
  {
    field: "HOLDING_IN_DATE",
    headerName: "HOLDING_IN_DATE",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderMono(p.value, "text-slate-600"),
  },
  {
    field: "HOLDING_OUT_DATE",
    headerName: "HOLDING_OUT_DATE",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderMono(p.value, "text-slate-600"),
  },
  {
    field: "VENDOR_LOT",
    headerName: "VENDOR_LOT",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderTruncated(p.value),
  },
  {
    field: "USE_YN",
    headerName: "USE_YN",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => {
      const isY = p.value === "Y";
      return (
        <span className={`badge-pill badge-pill--${isY ? "active" : "inactive"}`}>
          {p.value || "-"}
        </span>
      );
    },
  },
  {
    field: "INS_DATE",
    headerName: "INS_DATE",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderMono(p.value, "text-slate-500"),
  },
  {
    field: "INS_EMPL",
    headerName: "INS_EMPL",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderMono(p.value, "text-slate-600"),
  },
  {
    field: "UPD_DATE",
    headerName: "UPD_DATE",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderMono(p.value, "text-slate-500"),
  },
  {
    field: "UPD_EMPL",
    headerName: "UPD_EMPL",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderMono(p.value, "text-slate-600"),
  },
  {
    field: "QC_PASS",
    headerName: "QC_PASS",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => {
      const v = p.value;
      if (v === "Y") return <span className="badge-pill badge-pill--pass">PASSED</span>;
      if (v === "N") return <span className="badge-pill badge-pill--fail">FAILED</span>;
      return <span className="badge-pill badge-pill--pending">PENDING</span>;
    },
  },
  {
    field: "QC_PASS_DATE",
    headerName: "QC_PASS_DATE",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderMono(p.value, "text-slate-500"),
  },
  {
    field: "QC_PASS_EMPL",
    headerName: "QC_PASS_EMPL",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderMono(p.value, "text-slate-600"),
  },
  {
    field: "PROCESS_STATUS",
    headerName: "PROCESS_STATUS",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderTruncated(p.value),
  },
  {
    field: "PROCESS_DATE",
    headerName: "PROCESS_DATE",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderMono(p.value, "text-slate-500"),
  },
  {
    field: "PROCESS_EMPL",
    headerName: "PROCESS_EMPL",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderMono(p.value, "text-slate-600"),
  },
];
