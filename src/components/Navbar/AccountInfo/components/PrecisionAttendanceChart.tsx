import React from "react";
import moment from "moment";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AttendancePoint {
  day: number;
  hours: number;
}

interface PrecisionAttendanceChartProps {
  attendanceTimeline: AttendancePoint[];
  chartMode: "bar" | "line";
  isLoading: boolean;
  todayDate: number;
  currentMonthStr: string;
  /** Viewport ≤ 768px: thu gọn canvas để không phải cuộn ngang */
  isMobile?: boolean;
}

/**
 * Canvas biểu đồ chấm công tháng (tách khỏi PrecisionAttendanceTimeline
 * để giữ mỗi file < 300 dòng, theo quy ước module hóa của dự án).
 *
 * - `bar`: biểu đồ cột high-density (Stitch)
 * - `line`: biểu đồ đường Recharts (đã có ở AccountInfo bản cũ)
 */
export default function PrecisionAttendanceChart({
  attendanceTimeline,
  chartMode,
  isLoading,
  todayDate,
  currentMonthStr,
  isMobile = false,
}: PrecisionAttendanceChartProps) {
  const getDayOfWeek = (day: number) => {
    const dow = moment().startOf("month").date(day).day();
    if (dow === 0) return "CN";
    return `T${dow + 1}`;
  };

  // Scale & kích thước: mobile dùng hệ số nhỏ hơn để vừa 1 màn hình
  const pxPerHour = isMobile ? 6 : 7.5;
  const chartHeight = isMobile ? 150 : 180;
  const barMaxWidth = isMobile ? 10 : 20;
  const barGap = isMobile ? 2 : 6;
  const canvasMinWidth = isMobile ? 0 : 840;
  const guide8Bottom = isMobile ? 60 : 80;
  const guide10Bottom = isMobile ? 92 : 120;
  const todayBarMinHeight = isMobile ? 14 : 20;

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
    const label = isMobile ? `${day}` : `${day} (${getDayOfWeek(day)})`;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill={isSunday ? "#d32f2f" : "#64748b"}
          fontSize={isMobile ? 10 : 11}
        >
          {label}
        </text>
      </g>
    );
  };

  if (chartMode !== "bar") {
    /* Recharts Line Chart from AccountInfo.tsx */
    return (
      <div style={{ width: "100%", height: isMobile ? 200 : 230, paddingTop: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={attendanceChartData}
            margin={{ top: 10, right: isMobile ? 8 : 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="day"
              tick={AttendanceXAxisTick}
              interval={isMobile ? 4 : 0}
              height={isMobile ? 22 : 30}
            />
            <YAxis
              tick={{ fontSize: isMobile ? 10 : 11, fill: "#64748b" }}
              width={isMobile ? 28 : 60}
              domain={[0, 12]}
            />
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
              dot={{ r: isMobile ? 2 : 3, fill: "#10b981" }}
              isAnimationActive={!isLoading}
              name="Đã qua"
            />
            <Line
              type="monotone"
              dataKey="hoursFuture"
              stroke="#2563eb"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: isMobile ? 2 : 2, fill: "#2563eb" }}
              isAnimationActive={!isLoading}
              name="Kế hoạch"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  /* 30-Day High-Density Stitch Bar Chart */
  return (
    <div
      style={{
        width: "100%",
        overflowX: isMobile ? "hidden" : "auto",
        paddingTop: 16,
        paddingBottom: 8,
      }}
    >
      <div style={{ minWidth: canvasMinWidth, display: "flex", flexDirection: "column", gap: 4 }}>
        <div
          style={{
            height: chartHeight,
            position: "relative",
            background: "rgba(248, 250, 252, 0.7)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            borderRadius: 8,
            padding: isMobile ? "10px 6px" : "12px 14px",
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
              bottom: guide8Bottom,
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
              bottom: guide10Bottom,
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
              {isMobile ? "Tăng ca: 10.0h+" : "Ngưỡng tăng ca: 10.0h+"}
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
              gap: barGap,
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

              const standardHeight = Math.max(
                hours > 0 ? 6 : 0,
                Math.round(standardHours * pxPerHour)
              );
              const otHeight = Math.round(otHours * pxPerHour);

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
                  {!isMobile && (
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
                  )}

                  {isToday ? (
                    <div
                      style={{
                        width: "100%",
                        maxWidth: barMaxWidth,
                        background: "#10b981",
                        height: Math.max(todayBarMinHeight, Math.round(hours * pxPerHour)),
                        borderRadius: "4px 4px 0 0",
                        boxShadow: "0 1px 3px rgba(16, 185, 129, 0.4)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        maxWidth: barMaxWidth,
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
                      fontSize: isMobile ? 9 : 10,
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
  );
}
