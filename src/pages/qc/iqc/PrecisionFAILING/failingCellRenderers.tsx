import React from "react";

export const renderTruncated = (val: any) => {
  if (val === null || val === undefined || val === "") return "-";
  const str = String(val);
  return (
    <span className="cell-truncate" title={str}>
      {str}
    </span>
  );
};

export const renderMono = (val: any, colorClass = "text-slate-700") => (
  <span className={`mono-code cell-truncate ${colorClass}`} title={val ? String(val) : "-"}>
    {val || "-"}
  </span>
);

export const renderRightNum = (val: any, colorClass = "") => (
  <div style={{ textAlign: "right", width: "100%" }} className={`mono-code ${colorClass}`}>
    {val != null ? Number(val).toLocaleString() : "-"}
  </div>
);

export const renderLotHighlight = (val: any, isPass: boolean) => (
  <span
    className={`lot-highlight cell-truncate ${isPass ? "lot-highlight--pass" : "lot-highlight--other"}`}
    title={val}
  >
    {val || "-"}
  </span>
);

export const renderVendorLot = (val: any, isOut: boolean) => (
  <span
    className={`lot-highlight cell-truncate ${isOut ? "bg-rose-500 text-white" : "bg-sky-100 text-slate-800"}`}
    title={val}
  >
    {val || "-"}
  </span>
);

export const renderUseYn = (isY: boolean) => (
  <span className={`badge-pill ${isY ? "badge-pill--active" : "badge-pill--inactive"}`}>
    {isY ? "Có tồn" : "Không tồn"}
  </span>
);

export const renderQcPass = (val: string) => {
  if (val === "Y") return <span className="badge-pill badge-pill--pass">PASSED</span>;
  if (val === "N") return <span className="badge-pill badge-pill--fail">FAILED</span>;
  return <span className="badge-pill badge-pill--pending">PENDING</span>;
};

export const renderCloseStatus = (val: string) => {
  if (val === "C") return <span className="badge-pill badge-pill--closed">CLOSED</span>;
  return <span className="badge-pill badge-pill--pending">PENDING</span>;
};
