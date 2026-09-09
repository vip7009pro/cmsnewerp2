import React, { useState } from "react";
import moment from "moment";
import * as XLSX from "xlsx";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PrecisionAttendanceTimelineProps {
  attendanceTimeline: Array<{ day: number; hours: number }>;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export default function PrecisionAttendanceTimeline({
  attendanceTimeline,
  isLoading,
  error,
  onRefresh,
}: PrecisionAttendanceTimelineProps) {
  const [chartMode, setChartMode] = useState<"bar" | "line">("bar");
  const currentMonthStr = moment().format("MM/YYYY");
  const todayDate = moment().date();

  // Total worked hours in current month
  const totalWorkedHours = attendanceTimeline.reduce((acc, curr) => acc + curr.hours, 0);
  const roundedTotalHours = Math.round(totalWorkedHours * 10) / 10;

  // Planned hours (assuming 24 standard working days * 8h = 192h)
  const plannedHours = 192;
  const targetPercent = Math.round((roundedTotalHours / plannedHours) * 100);

  const getDayOfWeek = (day: number) => {
    const dow = moment().startOf("month").date(day).day();
    if (dow === 0) return "CN";
    return `T${dow + 1}`;
  };

  const handleExportExcel = () => {
    const exportRows = attendanceTimeline.map((item) => ({
      "Ngày": `${item.day < 10 ? "0" + item.day : item.day}/${currentMonthStr}`,
      "Thứ": getDayOfWeek(item.day),
      "Số giờ làm thực tế": item.hours,
      "Định mức chuẩn": 8.0,
      "Tăng ca (OT)": item.hours > 8 ? Math.round((item.hours - 8) * 10) / 10 : 0,
      "Ghi chú":
        item.day === todayDate
          ? "Hôm nay"
          : item.day > todayDate
          ? "Kế hoạch"
          : item.hours >= 8
          ? "Đạt chuẩn"
          : "Dưới định mức",
    }));

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ChamCongThang");
    XLSX.writeFile(wb, `BaoCao_ChamCong_Thang_${moment().format("MM_YYYY")}.xlsx`);
  };

  // Recharts line chart data from AccountInfo.tsx
  const attendanceChartData = attendanceTimeline.map((d) => ({
    ...d,
    hoursPast: d.day < todayDate ? d.hours : null,
    hoursFuture: d.day >= todayDate ? d.hours : null,
  }));

  const AttendanceXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const day = Number(payload?.value);
    const dow = moment().startOf("month").date(day).day();
    const isSunday = dow === 0;
    const label = `${day} (${getDayOfWeek(day)})`;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill={isSunday ? "#d32f2f" : "#64748b"} fontSize={11}>
          {label}
        </text>
      </g>
    );
  };

  return (
    <div className="precision-hub__card">
      {/* Header & Controls */}
      <div className="precision-hub__cardHeader" style={{ marginBottom: 12 }}>
        <div className="precision-hub__cardHeaderLeft">
          <div className="precision-hub__headerIconWrap">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              calendar_month
            </span>
          </div>
          <div>
            <h2 className="precision-hub__cardTitle">
              Biểu Đồ Chấm Công & Giờ Làm Việc Thực Tế
            </h2>
            <p className="precision-hub__cardSubtitle">
              Thống kê chi tiết từng ngày trong Tháng {currentMonthStr}. Định mức chuẩn: 8.0 giờ/ngày.
            </p>
          </div>
        </div>

        <div className="precision-hub__chartHeaderActions">
          {/* Toggle between Stitch Bar Chart and Recharts Line Chart */}
          <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 6, padding: 2, border: "1px solid #e2e8f0" }}>
            <button
              type="button"
              onClick={() => setChartMode("bar")}
              style={{
                padding: "3px 10px",
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                background: chartMode === "bar" ? "#2563eb" : "transparent",
                color: chartMode === "bar" ? "#ffffff" : "#64748b",
              }}
            >
              Biểu đồ cột (Stitch)
            </button>
            <button
              type="button"
              onClick={() => setChartMode("line")}
              style={{
                padding: "3px 10px",
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                background: chartMode === "line" ? "#2563eb" : "transparent",
                color: chartMode === "line" ? "#ffffff" : "#64748b",
              }}
            >
              Biểu đồ đường (Recharts)
            </button>
          </div>

          <div className="precision-hub__dateChip">
            <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#64748b" }}>
              event
            </span>
            <span>Tháng {currentMonthStr}</span>
          </div>

          <button
            type="button"
            className="precision-hub__btnAction"
            onClick={onRefresh}
            title="Tải lại dữ liệu chấm công"
            disabled={isLoading}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 16,
                animation: isLoading ? "spin 1s linear infinite" : "none",
              }}
            >
              refresh
            </span>
            <span>Tải lại</span>
          </button>

          <button
            type="button"
            className="precision-hub__btnAction"
            style={{ background: "#059669", color: "#ffffff", borderColor: "#059669" }}
            onClick={handleExportExcel}
            title="Xuất bảng thống kê ra Excel"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              file_download
            </span>
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Strip & Legend */}
      <div className="precision-hub__chartLegendStrip">
        <div className="precision-hub__legendGroup">
          <div className="precision-hub__legendItem">
            <span className="precision-hub__legendColor precision-hub__legendColor--blue" />
            <span>Giờ chuẩn (8.0h)</span>
          </div>

          <div className="precision-hub__legendItem">
            <span className="precision-hub__legendColor precision-hub__legendColor--amber" />
            <span>Tăng ca OT (&gt;8.0h)</span>
          </div>

          <div className="precision-hub__legendItem">
            <span className="precision-hub__legendColor precision-hub__legendColor--today" />
            <span>Hôm nay ({todayDate < 10 ? "0" + todayDate : todayDate})</span>
          </div>

          <div className="precision-hub__legendItem">
            <span className="precision-hub__legendColor precision-hub__legendColor--gray" />
            <span>Chủ nhật / Nghỉ tuần</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600 }}>
          <span style={{ color: "#475569" }}>
            Tổng giờ thực tế:{" "}
            <strong style={{ color: "#1d4ed8", fontWeight: 700 }}>
              {roundedTotalHours} giờ
            </strong>{" "}
            / Kế hoạch: {plannedHours} giờ
          </span>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 4,
              background: "#dbeafe",
              color: "#1e40af",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            Đạt {targetPercent}% định mức
          </span>
        </div>
      </div>

      {/* Error / Loading notices */}
      {error && (
        <div
          style={{
            padding: "8px 12px",
            background: "#fff1f2",
            color: "#e11d48",
            borderRadius: 6,
            fontSize: 12,
            marginTop: 10,
            border: "1px solid #fecdd3",
          }}
        >
          {error}
        </div>
      )}

      {/* Chart Canvas */}
      {chartMode === "bar" ? (
        /* 30-Day High-Density Stitch Bar Chart */
        <div style={{ width: "100%", overflowX: "auto", paddingTop: 16, paddingBottom: 8 }}>
          <div style={{ minWidth: 840, display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                height: 180,
                position: "relative",
                background: "rgba(248, 250, 252, 0.7)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                borderRadius: 8,
                padding: "12px 14px",
                display: "flex",
                alignItems: "flex-end",
              }}
            >
              {/* 8.0h Guideline */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 80,
                  borderBottom: "1px dashed rgba(59, 130, 246, 0.4)",
                  pointerEvents: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 12px",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: "#1d4ed8",
                    fontWeight: 700,
                    background: "rgba(255,255,255,0.9)",
                    padding: "1px 4px",
                    borderRadius: 3,
                  }}
                >
                  Mức chuẩn: 8.0h/ngày
                </span>
                <span style={{ fontSize: 9, color: "#3b82f6", fontFamily: "JetBrains Mono, monospace" }}>
                  8.0 H
                </span>
              </div>

              {/* 10.0h Guideline */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 120,
                  borderBottom: "1px dashed rgba(245, 158, 11, 0.4)",
                  pointerEvents: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 12px",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: "#d97706",
                    fontWeight: 700,
                    background: "rgba(255,255,255,0.9)",
                    padding: "1px 4px",
                    borderRadius: 3,
                  }}
                >
                  Ngưỡng tăng ca: 10.0h+
                </span>
                <span style={{ fontSize: 9, color: "#f59e0b", fontFamily: "JetBrains Mono, monospace" }}>
                  10.0 H
                </span>
              </div>

              {/* Bars */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: 6,
                  zIndex: 2,
                }}
              >
                {attendanceTimeline.map((item) => {
                  const isSunday = getDayOfWeek(item.day) === "CN";
                  const isToday = item.day === todayDate;
                  const isFuture = item.day > todayDate;
                  const hours = item.hours;

                  const standardHours = Math.min(hours, 8);
                  const otHours = Math.max(0, hours - 8);

                  const standardHeight = Math.max(hours > 0 ? 6 : 0, Math.round(standardHours * 7.5));
                  const otHeight = Math.round(otHours * 7.5);

                  return (
                    <div
                      key={item.day}
                      title={`Ngày ${item.day}/${currentMonthStr} (${getDayOfWeek(item.day)}): ${hours} giờ`}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        cursor: "pointer",
                        position: "relative",
                        opacity: isFuture ? 0.4 : 1,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 9.5,
                          fontFamily: "JetBrains Mono, monospace",
                          fontWeight: 700,
                          color: isToday ? "#059669" : otHours > 0 ? "#d97706" : "#475569",
                          marginBottom: 2,
                        }}
                      >
                        {hours > 0 ? `${hours}h` : isSunday ? "CN" : "--"}
                      </div>

                      {isToday ? (
                        <div
                          style={{
                            width: "100%",
                            maxWidth: 20,
                            background: "#10b981",
                            height: Math.max(20, Math.round(hours * 7.5)),
                            borderRadius: "4px 4px 0 0",
                            boxShadow: "0 1px 3px rgba(16, 185, 129, 0.4)",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            maxWidth: 20,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                          }}
                        >
                          {otHeight > 0 && (
                            <div
                              style={{
                                width: "100%",
                                background: "#f59e0b",
                                height: otHeight,
                                borderRadius: "3px 3px 0 0",
                              }}
                            />
                          )}
                          <div
                            style={{
                              width: "100%",
                              background: isSunday ? "#e2e8f0" : hours === 0 ? "#f1f5f9" : "#2563eb",
                              height: isSunday && hours === 0 ? 6 : standardHeight,
                              borderRadius: otHeight > 0 ? 0 : "3px 3px 0 0",
                            }}
                          />
                        </div>
                      )}

                      <span
                        style={{
                          fontSize: 10,
                          fontFamily: "JetBrains Mono, monospace",
                          marginTop: 4,
                          fontWeight: isToday ? 800 : 500,
                          color: isToday ? "#059669" : isSunday ? "#f43f5e" : "#64748b",
                        }}
                      >
                        {item.day < 10 ? `0${item.day}` : item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Recharts Line Chart from AccountInfo.tsx */
        <div style={{ width: "100%", height: 230, paddingTop: 16 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceChartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={AttendanceXAxisTick} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} domain={[0, 12]} />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const item = payload.find((p: any) => p?.value != null);
                  if (!item) return null;
                  return (
                    <div
                      style={{
                        background: "white",
                        border: "1px solid #cbd5e1",
                        padding: "8px 12px",
                        borderRadius: 6,
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                        fontSize: 12,
                      }}
                    >
                      <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{`Ngày ${label} (${getDayOfWeek(Number(label))})`}</div>
                      <div style={{ color: "#2563eb", fontWeight: 600 }}>{`${item.value} giờ làm việc`}</div>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="hoursPast"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#10b981" }}
                isAnimationActive={!isLoading}
                name="Đã qua"
              />
              <Line
                type="monotone"
                dataKey="hoursFuture"
                stroke="#2563eb"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 2, fill: "#2563eb" }}
                isAnimationActive={!isLoading}
                name="Kế hoạch"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
