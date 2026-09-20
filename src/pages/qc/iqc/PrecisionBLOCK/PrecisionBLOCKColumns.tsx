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
  <span className={`mono-code ${colorClass}`}>{val || "-"}</span>
);

const renderRightNum = (val: any, colorClass = "") => (
  <div style={{ textAlign: "right", width: "100%" }} className={`mono-code ${colorClass}`}>
    {val != null ? Number(val).toLocaleString() : "-"}
  </div>
);

export const getBlockingColumns = () => [
  {
    field: "FACTORY",
    headerName: "FACTORY",
    resizable: true,
    width: 80,
    checkboxSelection: true,
    headerCheckboxSelection: true,
  },
  {
    field: "BLOCK_ID",
    headerName: "BLOCK_ID",
    resizable: true,
    width: 70,
    cellRenderer: (p: any) => renderMono(p.value),
  },
  {
    field: "PHAN_LOAI",
    headerName: "PHÂN LOẠI",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => {
      const val = p.data?.PHAN_LOAI;
      const isProc = val === "PROCESS";
      return (
        <span className={`badge-pill badge-pill--${isProc ? "process" : "fail"}`}>
          {val || "OTHER"}
        </span>
      );
    },
  },
  {
    field: "MAKER",
    headerName: "MAKER",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => renderTruncated(p.value),
  },
  {
    field: "SUPPLIER",
    headerName: "SUPPLIER",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => (
      <span className="font-semibold text-emerald-700">{p.value || "-"}</span>
    ),
  },
  {
    field: "PL_BLOCK",
    headerName: "PL_BLOCK",
    resizable: true,
    width: 75,
    cellRenderer: (p: any) => {
      const isFail = p.value === "FAILING";
      return (
        <span className={`badge-pill badge-pill--${isFail ? "failing" : "holding"}`}>
          {isFail ? "FAILING" : "HOLDING"}
        </span>
      );
    },
  },
  {
    field: "PLAN_ID",
    headerName: "PLAN_ID",
    resizable: true,
    width: 85,
    cellRenderer: (p: any) => renderMono(p.value, "text-slate-800"),
  },
  {
    field: "M_CODE",
    headerName: "M_CODE",
    resizable: true,
    width: 85,
    cellRenderer: (p: any) => renderMono(p.value, "text-blue-600 font-semibold"),
  },
  {
    field: "M_NAME",
    headerName: "TÊN NGUYÊN LIỆU",
    resizable: true,
    width: 150,
    cellRenderer: (p: any) => renderTruncated(p.value),
  },
  {
    field: "WIDTH_CD",
    headerName: "SIZE",
    resizable: true,
    width: 60,
    cellRenderer: (p: any) => renderRightNum(p.value, "text-slate-700"),
  },
  {
    field: "M_LOT_NO",
    headerName: "M_LOT_NO",
    resizable: true,
    width: 95,
    cellRenderer: (p: any) => {
      const isPass = p.data?.QC_PASS === "Y";
      return (
        <span
          className={`lot-highlight ${isPass ? "lot-highlight--pass" : "lot-highlight--other"}`}
          title={p.value}
        >
          {p.value || "-"}
        </span>
      );
    },
  },
  {
    field: "LOT_VENDOR",
    headerName: "LOT VENDOR",
    resizable: true,
    width: 130,
    cellRenderer: (p: any) => renderTruncated(p.value),
  },
  {
    field: "BLOCK_ROLL_QTY",
    headerName: "ROLL_QTY",
    resizable: true,
    width: 70,
    cellRenderer: (p: any) => renderRightNum(p.value, "font-semibold"),
  },
  {
    field: "BLOCK_TOTAL_QTY",
    headerName: "TOTAL_QTY",
    resizable: true,
    width: 85,
    cellRenderer: (p: any) => renderRightNum(p.value, "font-bold text-emerald-600"),
  },
  {
    field: "DEFECT",
    headerName: "HIỆN TƯỢNG LỖI",
    resizable: true,
    width: 140,
    cellRenderer: (p: any) => renderTruncated(p.value),
  },
  {
    field: "PLSP",
    headerName: "PLSP",
    resizable: true,
    width: 60,
    cellRenderer: (p: any) => {
      const v = (p.value || "").toLowerCase();
      const cls = v === "btp" ? "btp" : v === "sp" ? "sp" : "nvl";
      return <span className={`badge-pill badge-pill--${cls}`}>{p.value || "-"}</span>;
    },
  },
  {
    field: "QC_PASS",
    headerName: "QC_PASS/FAIL",
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
    width: 130,
    cellRenderer: (p: any) => renderMono(p.value, "text-slate-500"),
  },
  {
    field: "QC_PASS_EMPL",
    headerName: "QC_PASS_EMPL",
    resizable: true,
    width: 90,
    cellRenderer: (p: any) => renderMono(p.value, "text-slate-600"),
  },
  {
    field: "STATUS",
    headerName: "STATUS",
    resizable: true,
    width: 80,
    cellRenderer: (p: any) => {
      const v = p.value;
      if (v === "CLOSED") return <span className="badge-pill badge-pill--closed">CLOSED</span>;
      if (v === "PENDING") return <span className="badge-pill badge-pill--pending">PENDING</span>;
      return <span className="text-slate-500">{v || "-"}</span>;
    },
  },
  {
    field: "USE_YN",
    headerName: "USE_YN",
    resizable: true,
    width: 70,
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
    field: "NCR_ID",
    headerName: "NCR_ID",
    resizable: true,
    width: 65,
    cellRenderer: (p: any) => renderMono(p.value, "font-bold text-rose-600"),
  },
  {
    field: "PROCESS_LOT_NO",
    headerName: "LOT_SX",
    resizable: true,
    width: 85,
    cellRenderer: (p: any) => renderMono(p.value, "text-slate-600"),
  },
  {
    field: "INS_DATE",
    headerName: "NGÀY TẠO",
    resizable: true,
    width: 130,
    cellRenderer: (p: any) => renderMono(p.value, "text-slate-500"),
  },
  {
    field: "INS_EMPL",
    headerName: "NGƯỜI TẠO",
    resizable: true,
    width: 85,
    cellRenderer: (p: any) => renderMono(p.value, "text-slate-600"),
  },
  {
    field: "UPD_DATE",
    headerName: "NGÀY CẬP NHẬT",
    resizable: true,
    width: 130,
    cellRenderer: (p: any) => renderMono(p.value, "text-slate-500"),
  },
  {
    field: "UPD_EMPL",
    headerName: "NGƯỜI CẬP NHẬT",
    resizable: true,
    width: 90,
    cellRenderer: (p: any) => renderMono(p.value, "text-slate-600"),
  },
];
