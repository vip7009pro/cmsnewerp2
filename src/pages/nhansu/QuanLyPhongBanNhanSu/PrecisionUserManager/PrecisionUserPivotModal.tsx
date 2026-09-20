import React, { useMemo, useState } from "react";
import { EmployeeTableData } from "../../interfaces/nhansuInterface";
import { MdOutlinePivotTableChart } from "react-icons/md";

type GroupKey = "mainDept" | "subDept" | "status" | "job" | "shift";

interface PrecisionUserPivotModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EmployeeTableData[];
}

interface PivotRow {
  id: number;
  groupKey: string;
  total: number;
  working: number;
  resigned: number;
  maternity: number;
  workingRate: number;
}

const GROUP_OPTIONS: { value: GroupKey; label: string }[] = [
  { value: "mainDept", label: "Bộ phận chính" },
  { value: "subDept", label: "Phòng ban / Tổ" },
  { value: "status", label: "Trạng thái làm việc" },
  { value: "job", label: "Chức vụ" },
  { value: "shift", label: "Ca làm việc" },
];

const cellStyle: React.CSSProperties = {
  padding: "6px 10px",
  textAlign: "center",
  fontFamily: "JetBrains Mono, monospace",
  color: "#334155",
};

const getGroupValue = (
  item: EmployeeTableData,
  groupBy: GroupKey
): string => {
  switch (groupBy) {
    case "mainDept":
      return item.MAINDEPTNAME || "Chưa phân bộ phận";
    case "subDept":
      return item.SUBDEPTNAME || "Chưa phân tổ";
    case "status":
      return item.WORK_STATUS_NAME || "Chưa xác định";
    case "job":
      return item.JOB_NAME || "Chưa có chức vụ";
    case "shift":
      return item.WORK_SHIF_NAME || "Hành chính";
    default:
      return "Khác";
  }
};

export const PrecisionUserPivotModal: React.FC<
  PrecisionUserPivotModalProps
> = ({ isOpen, onClose, data }) => {
  const [groupBy, setGroupBy] = useState<GroupKey>("mainDept");

  const { rows, summary } = useMemo(() => {
    const source = data ?? [];
    const map = new Map<
      string,
      { total: number; working: number; resigned: number; maternity: number }
    >();

    source.forEach((item) => {
      const key = getGroupValue(item, groupBy);
      const acc =
        map.get(key) || { total: 0, working: 0, resigned: 0, maternity: 0 };
      acc.total += 1;
      // WORK_STATUS_CODE: 0 = Đã nghỉ, 1 = Đang làm, 2 = Nghỉ sinh
      if (item.WORK_STATUS_CODE === 1) acc.working += 1;
      else if (item.WORK_STATUS_CODE === 0) acc.resigned += 1;
      else acc.maternity += 1;
      map.set(key, acc);
    });

    const built: PivotRow[] = Array.from(map.entries())
      .map(([groupKey, stats], idx) => ({
        id: idx + 1,
        groupKey,
        ...stats,
        workingRate:
          stats.total > 0 ? Math.round((stats.working / stats.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    const totalSummary = built.reduce(
      (acc, row) => ({
        total: acc.total + row.total,
        working: acc.working + row.working,
        resigned: acc.resigned + row.resigned,
        maternity: acc.maternity + row.maternity,
      }),
      { total: 0, working: 0, resigned: 0, maternity: 0 }
    );

    return { rows: built, summary: totalSummary };
  }, [data, groupBy]);

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
          maxWidth: "860px",
          maxHeight: "85vh",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          border: "1px solid #cbd5e1",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
            padding: "12px 16px",
            borderBottom: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <MdOutlinePivotTableChart size={20} color="#6b21a8" />
            <span
              style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}
            >
              Phân Tích Pivot Hồ Sơ Nhân Sự
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label
              style={{ fontSize: "11px", fontWeight: 600, color: "#475569" }}
            >
              Nhóm theo:
            </label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupKey)}
              style={{
                height: 28,
                padding: "0 8px",
                fontSize: "11.5px",
                border: "1px solid #cbd5e1",
                borderRadius: 5,
                background: "#ffffff",
                color: "#0f172a",
                outline: "none",
              }}
            >
              {GROUP_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onClose}
              title="Đóng"
              style={{
                background: "transparent",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                fontSize: "18px",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Summary strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
            padding: "10px 16px",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          {[
            { label: "Tổng hồ sơ", value: summary.total, color: "#2563eb" },
            { label: "Đang làm", value: summary.working, color: "#059669" },
            { label: "Đã nghỉ", value: summary.resigned, color: "#dc2626" },
            { label: "Nghỉ sinh", value: summary.maternity, color: "#b45309" },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                padding: "6px 10px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                }}
              >
                {card.label}
              </span>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: card.color,
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {card.value}
              </span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "11.5px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f1f5f9" }}>
                {[
                  "Nhóm",
                  "Tổng",
                  "Đang làm",
                  "Đã nghỉ",
                  "Nghỉ sinh",
                  "Tỉ lệ đang làm",
                ].map((head) => (
                  <th
                    key={head}
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "#f1f5f9",
                      textAlign: head === "Nhóm" ? "left" : "center",
                      padding: "7px 10px",
                      fontWeight: 700,
                      color: "#475569",
                      textTransform: "uppercase",
                      fontSize: "10px",
                      borderBottom: "1px solid #cbd5e1",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "18px",
                      textAlign: "center",
                      color: "#94a3b8",
                    }}
                  >
                    Không có dữ liệu để phân tích
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "6px 10px", fontWeight: 600, color: "#0f172a" }}>
                    {row.groupKey}
                  </td>
                  <td style={cellStyle}>{row.total}</td>
                  <td style={{ ...cellStyle, color: "#059669", fontWeight: 700 }}>
                    {row.working}
                  </td>
                  <td style={{ ...cellStyle, color: "#dc2626", fontWeight: 700 }}>
                    {row.resigned}
                  </td>
                  <td style={{ ...cellStyle, color: "#b45309" }}>{row.maternity}</td>
                  <td style={cellStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      <div
                        style={{
                          width: 60,
                          height: 6,
                          borderRadius: 3,
                          background: "#e2e8f0",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${row.workingRate}%`,
                            height: "100%",
                            background: "#10b981",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "10.5px",
                          color: "#475569",
                        }}
                      >
                        {row.workingRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr style={{ backgroundColor: "#f8fafc", borderTop: "2px solid #cbd5e1" }}>
                  <td style={{ padding: "7px 10px", fontWeight: 700, color: "#0f172a" }}>
                    TỔNG CỘNG
                  </td>
                  <td style={{ ...cellStyle, fontWeight: 700 }}>{summary.total}</td>
                  <td style={{ ...cellStyle, fontWeight: 700, color: "#059669" }}>
                    {summary.working}
                  </td>
                  <td style={{ ...cellStyle, fontWeight: 700, color: "#dc2626" }}>
                    {summary.resigned}
                  </td>
                  <td style={{ ...cellStyle, fontWeight: 700, color: "#b45309" }}>
                    {summary.maternity}
                  </td>
                  <td style={{ ...cellStyle, fontWeight: 700 }}>
                    {summary.total > 0
                      ? Math.round((summary.working / summary.total) * 100)
                      : 0}
                    %
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrecisionUserPivotModal;
