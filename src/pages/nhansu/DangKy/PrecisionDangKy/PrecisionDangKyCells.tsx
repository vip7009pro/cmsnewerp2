import React from "react";

// Renderer Mã đơn nghỉ (OFF_ID)
export const LeaveCodeCellRenderer: React.FC<any> = (params) => {
  const data = params.data;
  if (!data || !data.OFF_ID) return <span style={{ color: "#94a3b8", fontSize: "10.5px" }}>—</span>;

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <span
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "11px",
          fontWeight: 700,
          color: "#2563eb",
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "4px",
          padding: "1px 6px",
          letterSpacing: "0.02em",
        }}
      >
        LV-{data.OFF_ID}
      </span>
    </div>
  );
};

// Renderer Kiểu nghỉ phép (Phép năm, Nửa phép, Việc riêng, Nghỉ ốm...)
export const LeaveTypeBadgeCellRenderer: React.FC<any> = (params) => {
  const data = params.data;
  if (!data || !data.REASON_NAME) {
    return <span style={{ color: "#94a3b8", fontSize: "11px" }}>—</span>;
  }

  const reason = data.REASON_NAME;

  let bg = "#eff6ff";
  let color = "#1d4ed8";
  let border = "#bfdbfe";
  let icon = "calendar_today";

  if (reason.includes("Nửa phép")) {
    bg = "#faf5ff";
    color = "#7e22ce";
    border = "#e9d5ff";
    icon = "hourglass_bottom";
  } else if (reason.includes("Việc riêng")) {
    bg = "#fff7ed";
    color = "#c2410c";
    border = "#fed7aa";
    icon = "person";
  } else if (reason.includes("ốm") || reason.includes("Khám")) {
    bg = "#f0fdfa";
    color = "#0f766e";
    border = "#99f6e4";
    icon = "medical_services";
  } else if (reason.includes("Chế độ")) {
    bg = "#eef2ff";
    color = "#4338ca";
    border = "#c7d2fe";
    icon = "verified";
  } else if (reason !== "Phép năm") {
    bg = "#f8fafc";
    color = "#475569";
    border = "#e2e8f0";
    icon = "info";
  }

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "2px 7px",
          borderRadius: "5px",
          fontSize: "11px",
          fontWeight: 700,
          background: bg,
          color: color,
          border: `1px solid ${border}`,
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
          {icon}
        </span>
        <span>{reason}</span>
      </span>
    </div>
  );
};

// Renderer Ca nghỉ
export const LeaveShiftCellRenderer: React.FC<any> = (params) => {
  const data = params.data;
  if (!data) return null;

  const caNghi = data.CA_NGHI;
  if (!caNghi) return <span style={{ color: "#94a3b8", fontSize: "11px" }}>—</span>;

  const isCa1 = String(caNghi).includes("1");
  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <span
        style={{
          fontSize: "10.5px",
          fontWeight: 600,
          color: isCa1 ? "#0284c7" : "#d97706",
          background: isCa1 ? "#f0f9ff" : "#fffbeb",
          border: `1px solid ${isCa1 ? "#bae6fd" : "#fde68a"}`,
          borderRadius: "4px",
          padding: "1px 5px",
        }}
      >
        {String(caNghi).includes("Ca") ? caNghi : `Ca ${caNghi}`}
      </span>
    </div>
  );
};

// Renderer Ngày nghỉ (chỉ hiển thị ngày YYYY-MM-DD)
export const LeaveDateCellRenderer: React.FC<any> = (params) => {
  const dateStr = params.value || params.data?.DATE_COLUMN || params.data?.APPLY_DATE || "";
  if (!dateStr) return <span style={{ color: "#94a3b8", fontSize: "11px" }}>—</span>;

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <span
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#1e293b",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {dateStr}
      </span>
    </div>
  );
};

// Renderer Thứ riêng biệt (Thứ 2, Thứ 3..., Chủ nhật màu đỏ)
export const WeekdayCellRenderer: React.FC<any> = (params) => {
  const weekday = params.value || params.data?.WEEKDAY || "";
  if (!weekday) return <span style={{ color: "#94a3b8", fontSize: "11px" }}>—</span>;

  const isSunday = weekday === "Sunday" || weekday === "Chủ Nhật" || weekday === "CN";
  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <span
        style={{
          fontSize: "11px",
          fontWeight: isSunday ? 800 : 600,
          color: isSunday ? "#ef4444" : "#475569",
        }}
      >
        {weekday}
      </span>
    </div>
  );
};

// Renderer Ngày nghỉ & Thứ (gộp nếu cần)
export const DateRangeCellRenderer: React.FC<any> = (params) => {
  const data = params.data;
  if (!data) return null;

  const dateStr = data.DATE_COLUMN || data.APPLY_DATE || "";
  const weekday = data.WEEKDAY || "";
  const isSunday = weekday === "Sunday" || weekday === "Chủ Nhật";

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", gap: "1px" }}>
      <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#1e293b", fontFamily: "JetBrains Mono, monospace" }}>
        {dateStr}
      </span>
      {weekday && (
        <span style={{ fontSize: "10px", fontWeight: 600, color: isSunday ? "#ef4444" : "#64748b" }}>
          {weekday}
        </span>
      )}
    </div>
  );
};

// Renderer Ngày làm đơn (REQUEST_DATE)
export const RequestDateCellRenderer: React.FC<any> = (params) => {
  const data = params.data;
  if (!data || !data.REQUEST_DATE) {
    return <span style={{ color: "#94a3b8", fontSize: "11px" }}>—</span>;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <span style={{ fontSize: "11px", color: "#475569", fontFamily: "JetBrains Mono, monospace" }}>
        {data.REQUEST_DATE}
      </span>
    </div>
  );
};

// Renderer Trạng thái phê duyệt đơn
export const ApprovalStatusCellRenderer: React.FC<any> = (params) => {
  const data = params.data;
  if (!data) return null;

  const status = data.APPROVAL_STATUS;
  if (status === 1) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "10.5px",
            fontWeight: 700,
            background: "#ecfdf5",
            color: "#047857",
            border: "1px solid #a7f3d0",
          }}
        >
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#10b981" }}></span>
          <span>Đã duyệt</span>
        </span>
      </div>
    );
  }

  if (status === 0 || status === 2) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "10.5px",
            fontWeight: 700,
            background: "#fffbeb",
            color: "#b45309",
            border: "1px solid #fde68a",
          }}
        >
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#f59e0b" }}></span>
          <span>Chờ duyệt</span>
        </span>
      </div>
    );
  }

  if (status === 3) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "10.5px",
            fontWeight: 700,
            background: "#f1f5f9",
            color: "#64748b",
            border: "1px solid #e2e8f0",
          }}
        >
          <span>Đã hủy / Xóa</span>
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "2px 8px",
          borderRadius: "12px",
          fontSize: "10.5px",
          fontWeight: 700,
          background: "#f8fafc",
          color: "#475569",
          border: "1px solid #e2e8f0",
        }}
      >
        <span>Ghi nhận</span>
      </span>
    </div>
  );
};

// Renderer Lý do / Chi tiết bàn giao
export const DetailReasonCellRenderer: React.FC<any> = (params) => {
  const data = params.data;
  if (!data) return null;

  const content = data.REMARK || data.REMARK_CONTENT || "—";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          fontSize: "11.5px",
          fontWeight: 500,
          color: "#334155",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        title={content}
      >
        {content}
      </span>
    </div>
  );
};
