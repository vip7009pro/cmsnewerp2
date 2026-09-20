import React, { useState } from "react";
import moment from "moment";
import * as XLSX from "xlsx";
import PrecisionAttendanceChart from "./PrecisionAttendanceChart";

interface PrecisionAttendanceTimelineProps {
  attendanceTimeline: Array<{ day: number; hours: number }>;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  /** Viewport ≤ 768px: rút gọn nhãn, ẩn phụ đề và nút dạng text */
  isMobile?: boolean;
}

export default function PrecisionAttendanceTimeline({
  attendanceTimeline,
  isLoading,
  error,
  onRefresh,
  isMobile = false,
}: PrecisionAttendanceTimelineProps) {
  const [chartMode, setChartMode] = useState<"bar" | "line">(isMobile ? "line" : "bar");
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

  // Recharts line chart data từ AccountInfo.tsx (đã chuyển sang PrecisionAttendanceChart)

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
              {isMobile ? "Công Tháng Này" : "Biểu Đồ Chấm Công & Giờ Làm Việc Thực Tế"}
            </h2>
            {!isMobile && (
              <p className="precision-hub__cardSubtitle">
                Thống kê chi tiết từng ngày trong Tháng {currentMonthStr}. Định mức chuẩn: 8.0 giờ/ngày.
              </p>
            )}
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
              {isMobile ? "Cột" : "Biểu đồ cột (Stitch)"}
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
              {isMobile ? "Đường" : "Biểu đồ đường (Recharts)"}
            </button>
          </div>

          {!isMobile && (
            <div className="precision-hub__dateChip">
              <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#64748b" }}>
                event
              </span>
              <span>Tháng {currentMonthStr}</span>
            </div>
          )}

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
            {!isMobile && <span>Tải lại</span>}
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
            {!isMobile && <span>Xuất Excel</span>}
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

          {!isMobile && (
            <div className="precision-hub__legendItem">
              <span className="precision-hub__legendColor precision-hub__legendColor--gray" />
              <span>Chủ nhật / Nghỉ tuần</span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, flexWrap: "wrap" }}>
          <span style={{ color: "#475569" }}>
            {isMobile ? "Tổng: " : "Tổng giờ thực tế: "}
            <strong style={{ color: "#1d4ed8", fontWeight: 700 }}>
              {roundedTotalHours}{isMobile ? "h" : " giờ"}
            </strong>{" "}
            {isMobile ? `/ 192h` : `/ Kế hoạch: ${plannedHours} giờ`}
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

      {/* Chart Canvas: tách sang PrecisionAttendanceChart (bar Stitch / line Recharts) */}
      <PrecisionAttendanceChart
        attendanceTimeline={attendanceTimeline}
        chartMode={chartMode}
        isLoading={isLoading}
        todayDate={todayDate}
        currentMonthStr={currentMonthStr}
        isMobile={isMobile}
      />
    </div>
  );
}
