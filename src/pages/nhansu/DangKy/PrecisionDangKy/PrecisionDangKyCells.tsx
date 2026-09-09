import React from "react";

// Renderer loại sự kiện / đơn đăng ký
export const RecordTypeCellRenderer: React.FC<any> = (params) => {
  const data = params.data;
  if (!data) return null;

  // Xác định loại sự kiện
  if (data.REASON_NAME || data.OFF_ID) {
    // Nghỉ phép
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
            background: "#eff6ff",
            color: "#1d4ed8",
            border: "1px solid #bfdbfe",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
            calendar_today
          </span>
          <span>{data.REASON_NAME || "Nghỉ phép"}</span>
        </span>
      </div>
    );
  }

  if (data.OVER_START || data.OVER_FINISH) {
    // Tăng ca
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
            background: "#fffbeb",
            color: "#b45309",
            border: "1px solid #fde68a",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
            schedule
          </span>
          <span>Tăng ca (OT)</span>
        </span>
      </div>
    );
  }

  if (data.CONFIRM_WORKTIME) {
    // Giải trình công
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
            background: "#faf5ff",
            color: "#7e22ce",
            border: "1px solid #e9d5ff",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
            fingerprint
          </span>
          <span>Xác nhận công</span>
        </span>
      </div>
    );
  }

  // Đi làm bình thường
  const isPresent = data.ON_OFF === 1;
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
          background: isPresent ? "#ecfdf5" : "#fff1f2",
          color: isPresent ? "#047857" : "#be123c",
          border: `1px solid ${isPresent ? "#a7f3d0" : "#fecdd3"}`,
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
          {isPresent ? "check_circle" : "cancel"}
        </span>
        <span>{isPresent ? "Đi làm" : "Nghỉ làm"}</span>
      </span>
    </div>
  );
};

// Renderer Ngày áp dụng & Thứ
export const DateRangeCellRenderer: React.FC<any> = (params) => {
  const data = params.data;
  if (!data) return null;

  const dateStr = data.DATE_COLUMN || data.APPLY_DATE || data.REQUEST_DATE || "";
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

// Renderer Trạng thái phê duyệt
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
          <span>Đã hủy</span>
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

// Renderer Lý do / Chi tiết
export const DetailReasonCellRenderer: React.FC<any> = (params) => {
  const data = params.data;
  if (!data) return null;

  const content = data.REMARK || data.CONFIRM_WORKTIME || data.REMARK_CONTENT || "—";
  const subContent = data.CA_NGHI ? `Ca: ${data.CA_NGHI}` : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", gap: "1px", overflow: "hidden" }}>
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
      {subContent && (
        <span style={{ fontSize: "10px", color: "#64748b" }}>
          {subContent}
        </span>
      )}
    </div>
  );
};
