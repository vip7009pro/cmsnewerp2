import React from "react";

// 1. Cột DATE
export const DateCellRenderer = (params: any) => {
  const val = params.value || params.data?.DATE_COLUMN;
  if (!val) return <span style={{ color: "#94a3b8" }}>-</span>;
  return <span className="cell-mono" style={{ color: "#0f172a" }}>{val}</span>;
};

// 2. Cột WEEKDAY
export const WeekdayCellRenderer = (params: any) => {
  const weekday = params.value || params.data?.WEEKDAY;
  if (!weekday) return <span style={{ color: "#94a3b8" }}>-</span>;
  const isSunday = weekday === "Sunday";

  return (
    <span
      className={`cell-weekday ${isSunday ? "cell-weekday--sunday" : "cell-weekday--normal"}`}
    >
      {weekday}
    </span>
  );
};

// 3. Cột ON_OFF
export const OnOffCellRenderer = (params: any) => {
  const onOff = params.data?.ON_OFF;
  if (onOff === 1) {
    return (
      <span className="cell-onoff-badge cell-onoff-badge--on">
        Đi làm
      </span>
    );
  } else if (onOff === 0) {
    return (
      <span className="cell-onoff-badge cell-onoff-badge--off">
        Nghỉ làm
      </span>
    );
  } else {
    return (
      <span className="cell-onoff-badge cell-onoff-badge--pending">
        Chưa điểm danh
      </span>
    );
  }
};

// 4. Cột Giờ quẹt thẻ CHECK1, CHECK2, CHECK3
export const CheckTimeCellRenderer = (params: any) => {
  const val = params.value;
  if (!val || val === "OFF") {
    return <span style={{ color: "#94a3b8" }}>-</span>;
  }
  return <span className="cell-mono" style={{ color: "#0f172a" }}>{val}</span>;
};

// 5. Cột FIXED_IN, FIXED_OUT
export const FixedTimeCellRenderer = (params: any) => {
  const val = params.value;
  if (!val || val === "OFF") {
    return (
      <span className="cell-mono" style={{ color: "#dc2626", fontWeight: 700 }}>
        OFF
      </span>
    );
  }
  return (
    <span className="cell-mono" style={{ color: "#2563eb", fontWeight: 700 }}>
      {val}
    </span>
  );
};

// 6. Cột Phút chênh lệch (DI_SOM, DI_MUON, VE_SOM, TANG_CA)
export const MinuteDiffCellRenderer = (params: any, type: "early_in" | "late_in" | "early_out" | "ot" | "working") => {
  const val = Number(params.value || 0);

  if (val === 0) {
    return <span className="cell-minute-highlight cell-minute-highlight--zero">0</span>;
  }

  if (type === "early_in") {
    return <span className="cell-minute-highlight cell-minute-highlight--green">{val}</span>;
  }
  if (type === "late_in" || type === "early_out") {
    return <span className="cell-minute-highlight cell-minute-highlight--red">{val}</span>;
  }
  if (type === "ot") {
    return <span className="cell-minute-highlight cell-minute-highlight--purple">{val}</span>;
  }
  return <span className="cell-minute-highlight cell-minute-highlight--blue">{val}</span>;
};

// 7. Cột Phê duyệt (PHE_DUYET)
export const ApprovalStatusCellRenderer = (params: any) => {
  const status = params.data?.APPROVAL_STATUS;
  if (status === 1) {
    return (
      <span className="cell-approval-badge cell-approval-badge--approved">
        Phê duyệt
      </span>
    );
  } else if (status === 0) {
    return (
      <span className="cell-approval-badge cell-approval-badge--rejected">
        Từ chối
      </span>
    );
  } else if (status === 2) {
    return (
      <span className="cell-approval-badge cell-approval-badge--waiting">
        Chờ duyệt
      </span>
    );
  }
  return <span style={{ color: "#94a3b8" }}>-</span>;
};

// 8. Cột EMPL_NO & NS_ID
export const EmplBadgeCellRenderer = (params: any, isNsId = false) => {
  const val = params.value;
  if (!val) return <span style={{ color: "#94a3b8" }}>-</span>;
  return (
    <span
      className="cell-mono"
      style={{
        color: isNsId ? "#2563eb" : "#475569",
        fontWeight: isNsId ? 700 : 500,
      }}
    >
      {val}
    </span>
  );
};
