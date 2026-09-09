import React from "react";
import { checkBP } from "../../../../api/services/permissionService";
import { getUserData } from "../../../../api/Api";
import Swal from "sweetalert2";

interface PheDuyetActionCellProps {
  data: any;
  onApprove: (offId: number, applyDate: string, onOff: number, reasonName: string) => void;
  onReject: (offId: number) => void;
  onReset: (offId: number) => void;
  onDelete: (offId: number) => void;
}

// Renderer Cột Thao Tác Phê Duyệt (PHE_DUYET)
export const PheDuyetActionCell: React.FC<any> = (params) => {
  const data = params.data;
  if (!data) return null;

  const status = data.APPROVAL_STATUS;
  const offId = data.OFF_ID || data.id;

  const handleApproveClick = () => {
    checkBP(getUserData(), ["ALL"], ["ALL"], ["ALL"], () => {
      params.onApprove?.(offId, data.APPLY_DATE, data.ON_OFF, data.REASON_NAME);
    });
  };

  const handleRejectClick = () => {
    checkBP(getUserData(), ["ALL"], ["ALL"], ["ALL"], () => {
      params.onReject?.(offId);
    });
  };

  const handleResetClick = () => {
    checkBP(getUserData(), ["ALL"], ["ALL"], ["ALL"], () => {
      params.onReset?.(offId);
    });
  };

  const handleDeleteClick = () => {
    checkBP(getUserData(), ["ALL"], ["ALL"], ["ALL"], () => {
      params.onDelete?.(offId);
    });
  };

  // 1. Trạng thái Đã duyệt
  if (status === 1) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", height: "100%" }}>
        <span
          style={{
            fontSize: "10.5px",
            fontWeight: 700,
            color: "#047857",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          Đã duyệt
        </span>
        <button
          type="button"
          onClick={handleResetClick}
          style={{
            height: "20px",
            padding: "0 5px",
            fontSize: "9.5px",
            fontWeight: 600,
            color: "#ffffff",
            background: "#2563eb",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
          }}
          title="Đưa về trạng thái chờ duyệt"
        >
          RESET
        </button>
        <button
          type="button"
          onClick={handleDeleteClick}
          style={{
            height: "20px",
            padding: "0 5px",
            fontSize: "9.5px",
            fontWeight: 600,
            color: "#ffffff",
            background: "#dc2626",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
          }}
          title="Xóa đơn đăng ký này"
        >
          XÓA
        </button>
      </div>
    );
  }

  // 2. Trạng thái Từ chối (status === 0)
  if (status === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", height: "100%" }}>
        <span
          style={{
            fontSize: "10.5px",
            fontWeight: 700,
            color: "#b91c1c",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          Từ chối
        </span>
        <button
          type="button"
          onClick={handleResetClick}
          style={{
            height: "20px",
            padding: "0 5px",
            fontSize: "9.5px",
            fontWeight: 600,
            color: "#ffffff",
            background: "#2563eb",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          RESET
        </button>
        <button
          type="button"
          onClick={handleDeleteClick}
          style={{
            height: "20px",
            padding: "0 5px",
            fontSize: "9.5px",
            fontWeight: 600,
            color: "#ffffff",
            background: "#dc2626",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          XÓA
        </button>
      </div>
    );
  }

  // 3. Trạng thái Đã xóa (status === 3)
  if (status === 3) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <span
          style={{
            fontSize: "10.5px",
            fontWeight: 700,
            color: "#64748b",
            background: "#f1f5f9",
            border: "1px solid #e2e8f0",
            padding: "2px 8px",
            borderRadius: "4px",
          }}
        >
          Đã xóa
        </span>
      </div>
    );
  }

  // 4. Trạng thái Chờ duyệt (status === 2 hoặc khác)
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", height: "100%" }}>
      <button
        type="button"
        onClick={handleApproveClick}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "2px",
          height: "22px",
          padding: "0 8px",
          fontSize: "10.5px",
          fontWeight: 700,
          color: "#ffffff",
          background: "#10b981",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          boxShadow: "0 1px 2px rgba(16, 185, 129, 0.2)",
        }}
        title="Phê duyệt đơn nghỉ"
      >
        <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>check</span>
        <span>Duyệt</span>
      </button>

      <button
        type="button"
        onClick={handleRejectClick}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "2px",
          height: "22px",
          padding: "0 7px",
          fontSize: "10.5px",
          fontWeight: 700,
          color: "#ffffff",
          background: "#f43f5e",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          boxShadow: "0 1px 2px rgba(244, 63, 94, 0.2)",
        }}
        title="Từ chối đơn nghỉ"
      >
        <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>close</span>
        <span>Từ chối</span>
      </button>
    </div>
  );
};

// Renderer Tên nhân viên kèm Avatar và Status dot
export const PheDuyetEmployeeCell: React.FC<any> = (params) => {
  const data = params.data;
  if (!data) return null;

  const fullName = data.FULL_NAME || `${data.MIDLAST_NAME || ""} ${data.FIRST_NAME || ""}`.trim();
  const initial = data.FIRST_NAME ? data.FIRST_NAME.charAt(0).toUpperCase() : "E";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", height: "100%" }}>
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #2563eb, #6366f1)",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "9.5px",
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {initial}
      </div>
      <span
        style={{
          fontWeight: 700,
          color: "#1e3a8a",
          fontSize: "11.5px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {fullName}
      </span>
    </div>
  );
};

// Renderer Mã nhân viên (EMPL_NO / CMS_ID)
export const PheDuyetMonoBadge: React.FC<any> = (params) => {
  const val = params.value;
  if (!val) return <span style={{ color: "#94a3b8", fontSize: "10.5px" }}>—</span>;

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <span
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "11px",
          fontWeight: 600,
          color: "#2563eb",
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "4px",
          padding: "1px 5px",
        }}
      >
        {val}
      </span>
    </div>
  );
};

// Renderer Kiểu nghỉ
export const PheDuyetReasonBadge: React.FC<any> = (params) => {
  const reason = params.value;
  if (!reason) return <span style={{ color: "#94a3b8", fontSize: "11px" }}>—</span>;

  let bg = "#eff6ff";
  let color = "#1d4ed8";
  let border = "#bfdbfe";

  if (reason.includes("Nửa phép")) {
    bg = "#faf5ff";
    color = "#7e22ce";
    border = "#e9d5ff";
  } else if (reason.includes("Việc riêng")) {
    bg = "#fff7ed";
    color = "#c2410c";
    border = "#fed7aa";
  } else if (reason.includes("ốm") || reason.includes("Khám")) {
    bg = "#f0fdfa";
    color = "#0f766e";
    border = "#99f6e4";
  } else if (reason.includes("Chế độ")) {
    bg = "#eef2ff";
    color = "#4338ca";
    border = "#c7d2fe";
  }

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "1px 6px",
          borderRadius: "4px",
          fontSize: "10.5px",
          fontWeight: 700,
          background: bg,
          color: color,
          border: `1px solid ${border}`,
        }}
      >
        {reason}
      </span>
    </div>
  );
};
