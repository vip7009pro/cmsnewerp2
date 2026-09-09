import React, { useMemo, useState } from "react";

interface PrecisionPheDuyetPivotModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
}

export const PrecisionPheDuyetPivotModal: React.FC<PrecisionPheDuyetPivotModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [pivotGroupBy, setPivotGroupBy] = useState<"reason" | "dept" | "factory">("reason");

  const pivotStats = useMemo(() => {
    if (!data || data.length === 0) return [];

    const map = new Map<string, { total: number; pending: number; approved: number; rejected: number }>();

    data.forEach((item) => {
      let key = "Khác";
      if (pivotGroupBy === "reason") {
        key = item.REASON_NAME || "Chưa xác định";
      } else if (pivotGroupBy === "dept") {
        key = item.MAINDEPTNAME || item.MAINDEPT_NAME || "Chưa phân ban";
      } else if (pivotGroupBy === "factory") {
        key = item.FACTORY_NAME || "Chưa chọn NM";
      }

      const existing = map.get(key) || { total: 0, pending: 0, approved: 0, rejected: 0 };
      existing.total += 1;

      if (item.APPROVAL_STATUS === 1) {
        existing.approved += 1;
      } else if (item.APPROVAL_STATUS === 0 || item.APPROVAL_STATUS === 2) {
        existing.pending += 1;
      } else if (item.APPROVAL_STATUS === 3) {
        existing.rejected += 1;
      }

      map.set(key, existing);
    });

    return Array.from(map.entries()).map(([groupKey, stats], idx) => ({
      id: idx + 1,
      groupKey,
      ...stats,
      approvedRate: stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0,
    }));
  }, [data, pivotGroupBy]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 11000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(4px)",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "780px",
          maxHeight: "85vh",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          border: "1px solid #cbd5e1",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ color: "#6b21a8", fontSize: "20px" }}>
              pivot_table_chart
            </span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
              Phân Tích Pivot Phê Duyệt Đơn Nghỉ
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Toolbar: Chọn nhóm phân tích */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderBottom: "1px solid #f1f5f9",
            backgroundColor: "#ffffff",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569" }}>
            Nhóm phân tích:
          </span>

          <button
            type="button"
            onClick={() => setPivotGroupBy("reason")}
            style={{
              padding: "4px 10px",
              borderRadius: "5px",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              border: `1px solid ${pivotGroupBy === "reason" ? "#a855f7" : "#cbd5e1"}`,
              background: pivotGroupBy === "reason" ? "#faf5ff" : "#ffffff",
              color: pivotGroupBy === "reason" ? "#7e22ce" : "#475569",
            }}
          >
            Theo Kiểu nghỉ
          </button>

          <button
            type="button"
            onClick={() => setPivotGroupBy("dept")}
            style={{
              padding: "4px 10px",
              borderRadius: "5px",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              border: `1px solid ${pivotGroupBy === "dept" ? "#a855f7" : "#cbd5e1"}`,
              background: pivotGroupBy === "dept" ? "#faf5ff" : "#ffffff",
              color: pivotGroupBy === "dept" ? "#7e22ce" : "#475569",
            }}
          >
            Theo Phòng ban
          </button>

          <button
            type="button"
            onClick={() => setPivotGroupBy("factory")}
            style={{
              padding: "4px 10px",
              borderRadius: "5px",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              border: `1px solid ${pivotGroupBy === "factory" ? "#a855f7" : "#cbd5e1"}`,
              background: pivotGroupBy === "factory" ? "#faf5ff" : "#ffffff",
              color: pivotGroupBy === "factory" ? "#7e22ce" : "#475569",
            }}
          >
            Theo Nhà máy
          </button>
        </div>

        {/* Modal Table Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "11.5px",
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ background: "#f1f5f9", color: "#475569", borderBottom: "2px solid #cbd5e1", height: "30px" }}>
                <th style={{ padding: "6px 8px", width: "40px", textAlign: "center" }}>STT</th>
                <th style={{ padding: "6px 8px" }}>
                  {pivotGroupBy === "reason" ? "Kiểu nghỉ" : pivotGroupBy === "dept" ? "Phòng ban" : "Nhà máy"}
                </th>
                <th style={{ padding: "6px 8px", textAlign: "center", color: "#2563eb" }}>Tổng đơn</th>
                <th style={{ padding: "6px 8px", textAlign: "center", color: "#b45309" }}>Chờ duyệt</th>
                <th style={{ padding: "6px 8px", textAlign: "center", color: "#047857" }}>Đã duyệt</th>
                <th style={{ padding: "6px 8px", textAlign: "center", color: "#be123c" }}>Đã xóa/Từ chối</th>
                <th style={{ padding: "6px 8px", textAlign: "center" }}>Tỷ lệ duyệt</th>
              </tr>
            </thead>
            <tbody>
              {pivotStats.map((row) => (
                <tr key={row.id} style={{ borderBottom: "1px solid #f1f5f9", height: "32px" }}>
                  <td style={{ padding: "6px 8px", textAlign: "center", color: "#64748b", fontFamily: "JetBrains Mono, monospace" }}>
                    {row.id}
                  </td>
                  <td style={{ padding: "6px 8px", fontWeight: 700, color: "#1e293b" }}>
                    {row.groupKey}
                  </td>
                  <td style={{ padding: "6px 8px", textAlign: "center", fontWeight: 700, color: "#2563eb" }}>
                    {row.total}
                  </td>
                  <td style={{ padding: "6px 8px", textAlign: "center", fontWeight: 700, color: "#b45309" }}>
                    {row.pending}
                  </td>
                  <td style={{ padding: "6px 8px", textAlign: "center", fontWeight: 700, color: "#047857" }}>
                    {row.approved}
                  </td>
                  <td style={{ padding: "6px 8px", textAlign: "center", fontWeight: 600, color: "#be123c" }}>
                    {row.rejected}
                  </td>
                  <td style={{ padding: "6px 8px", textAlign: "center" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "1px 6px",
                        borderRadius: "10px",
                        fontSize: "10px",
                        fontWeight: 700,
                        background: row.approvedRate >= 80 ? "#ecfdf5" : "#fffbeb",
                        color: row.approvedRate >= 80 ? "#047857" : "#b45309",
                        border: `1px solid ${row.approvedRate >= 80 ? "#a7f3d0" : "#fde68a"}`,
                      }}
                    >
                      {row.approvedRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "10px 16px",
            borderTop: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "5px 14px",
              borderRadius: "5px",
              fontSize: "11.5px",
              fontWeight: 600,
              color: "#334155",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              cursor: "pointer",
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPheDuyetPivotModal);
