import React from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import getsentence from "../../../String/String";

interface PrecisionKpiGridProps {
  workday: number;
  days: number;
  overtimeday: number;
  countxacnhan: number;
  nghiday: number;
  thuongphat: {
    count_thuong: number;
    count_phat: number;
  };
}

export default function PrecisionKpiGrid({
  workday,
  days,
  overtimeday,
  countxacnhan,
  nghiday,
  thuongphat,
}: PrecisionKpiGridProps) {
  const lang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang
  );

  const currentYear = moment().year();
  const currentMonth = moment().format("MM");

  // Exact formulas from AccountInfo.tsx
  const workdayProgress = days > 0 ? Math.min(100, Math.round((workday / Math.floor(days)) * 100)) : 0;
  const overtimeProgress = workday > 0 ? Math.min(100, Math.round((overtimeday / workday) * 100)) : 0;
  const forgotProgress = workday > 0 ? Math.min(100, Math.round((countxacnhan / workday) * 100)) : 0;

  return (
    <div className="precision-hub__card">
      <div className="precision-hub__cardHeader" style={{ marginBottom: 16 }}>
        <div className="precision-hub__cardHeaderLeft">
          <div className="precision-hub__headerIconWrap">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              analytics
            </span>
          </div>
          <div>
            <h2 className="precision-hub__cardTitle">
              {/* Summary / Thống Kê Công Tác */}
              {lang === "vi"
                ? "Thống Kê Công Tác & Kỷ Luật Lao Động"
                : lang === "kr"
                ? "업무 및 근태 통계 요약"
                : "Work & Attendance Summary"}
            </h2>
            <p className="precision-hub__cardSubtitle">
              {lang === "vi"
                ? `Đánh giá thời lượng làm việc, chuyên cần và kỷ luật năm ${currentYear}`
                : `Annual evaluation of work hours and discipline ${currentYear}`}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 6,
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            color: "#1d4ed8",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            verified
          </span>
          <span>{workdayProgress}% Chuyên cần ({workday}/{Math.floor(days)})</span>
        </div>
      </div>

      {/* 6 Balanced KPI Cards */}
      <div className="precision-hub__kpiGrid">
        {/* Card 1: Ngày làm năm nay (Formula: workday / days) */}
        <div className="precision-hub__kpiCard">
          <div className="precision-hub__kpiHeader">
            <span>
              1. {getsentence(30, lang ?? "en")} : {Math.floor(days)} {getsentence(31, lang ?? "en")}
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#2563eb" }}>
              event_available
            </span>
          </div>

          <div>
            <div className="precision-hub__kpiValue precision-hub__kpiValue--primary">
              {workday} <span className="precision-hub__kpiSubText">/ {Math.floor(days)} {getsentence(31, lang ?? "en")}</span>
            </div>
            {/* Progress bar */}
            <div style={{ width: "100%", height: 6, background: "#e2e8f0", borderRadius: 999, overflow: "hidden", marginTop: 8 }}>
              <div style={{ width: `${workdayProgress}%`, height: "100%", background: "#2563eb", borderRadius: 999 }} />
            </div>
          </div>

          <div className="precision-hub__kpiFooter precision-hub__kpiFooter--success">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              trending_up
            </span>
            <span>{workdayProgress}% {getsentence(30, lang ?? "en")}</span>
          </div>
        </div>

        {/* Card 2: Số ngày bạn đi làm (Formula: overtimeday / workday) */}
        <div className="precision-hub__kpiCard">
          <div className="precision-hub__kpiHeader">
            <span>
              2. {getsentence(32, lang ?? "en")}
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#64748b" }}>
              calendar_month
            </span>
          </div>

          <div>
            <div className="precision-hub__kpiValue">
              {workday} <span className="precision-hub__kpiSubText">/ {overtimeday} {getsentence(31, lang ?? "en")}</span>
            </div>
            <div style={{ width: "100%", height: 6, background: "#e2e8f0", borderRadius: 999, overflow: "hidden", marginTop: 8 }}>
              <div style={{ width: `${overtimeProgress}%`, height: "100%", background: "#059669", borderRadius: 999 }} />
            </div>
          </div>

          <div className="precision-hub__kpiFooter precision-hub__kpiFooter--primary">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              timelapse
            </span>
            <span>Tháng {currentMonth}: {workday} {getsentence(31, lang ?? "en")}</span>
          </div>
        </div>

        {/* Card 3: Số ngày bạn tăng ca */}
        <div className="precision-hub__kpiCard">
          <div className="precision-hub__kpiHeader">
            <span>
              3. {getsentence(33, lang ?? "en")}
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#d97706" }}>
              more_time
            </span>
          </div>

          <div>
            <div className="precision-hub__kpiValue precision-hub__kpiValue--amber">
              {overtimeday} <span className="precision-hub__kpiSubText">{getsentence(31, lang ?? "en")}</span>
            </div>
            <div style={{ width: "100%", height: 6, background: "#e2e8f0", borderRadius: 999, overflow: "hidden", marginTop: 8 }}>
              <div style={{ width: `${overtimeProgress}%`, height: "100%", background: "#f59e0b", borderRadius: 999 }} />
            </div>
          </div>

          <div className="precision-hub__kpiFooter">
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#d97706" }}>
              bolt
            </span>
            <span>{overtimeProgress}% tỷ lệ tăng ca</span>
          </div>
        </div>

        {/* Card 4: Số ngày quên chấm công */}
        <div className="precision-hub__kpiCard">
          <div className="precision-hub__kpiHeader">
            <span>
              4. {getsentence(34, lang ?? "en")}
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: countxacnhan > 0 ? "#f43f5e" : "#059669" }}>
              fingerprint
            </span>
          </div>

          <div>
            <div
              className="precision-hub__kpiValue"
              style={{ color: countxacnhan > 0 ? "#e11d48" : "#059669" }}
            >
              {countxacnhan} <span className="precision-hub__kpiSubText">{getsentence(31, lang ?? "en")}</span>
            </div>
            <div style={{ width: "100%", height: 6, background: "#e2e8f0", borderRadius: 999, overflow: "hidden", marginTop: 8 }}>
              <div style={{ width: `${forgotProgress}%`, height: "100%", background: countxacnhan > 0 ? "#f43f5e" : "#10b981", borderRadius: 999 }} />
            </div>
          </div>

          <div className="precision-hub__kpiFooter">
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: countxacnhan === 0 ? "#059669" : "#e11d48" }}>
              {countxacnhan === 0 ? "task_alt" : "warning"}
            </span>
            <span>{countxacnhan === 0 ? "Không quên lần nào" : "Cần xác nhận bổ sung"}</span>
          </div>
        </div>

        {/* Card 5: Số ngày bạn đăng ký nghỉ */}
        <div className="precision-hub__kpiCard">
          <div className="precision-hub__kpiHeader">
            <span>
              5. {getsentence(35, lang ?? "en")}
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#0284c7" }}>
              beach_access
            </span>
          </div>

          <div>
            <div className="precision-hub__kpiValue">
              {nghiday} <span className="precision-hub__kpiSubText">{getsentence(31, lang ?? "en")}</span>
            </div>
            <div style={{ width: "100%", height: 6, background: "#e2e8f0", borderRadius: 999, overflow: "hidden", marginTop: 8 }}>
              <div style={{ width: `${Math.min(100, (nghiday / 12) * 100)}%`, height: "100%", background: "#0284c7", borderRadius: 999 }} />
            </div>
          </div>

          <div className="precision-hub__kpiFooter">
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#64748b" }}>
              info
            </span>
            <span>Ko tính CN & nửa phép</span>
          </div>
        </div>

        {/* Card 6: Thưởng phạt */}
        <div className="precision-hub__kpiCard">
          <div className="precision-hub__kpiHeader">
            <span>
              6. {getsentence(36, lang ?? "en")}
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#4f46e5" }}>
              military_tech
            </span>
          </div>

          <div>
            <div className="precision-hub__kpiValue" style={{ color: "#4f46e5" }}>
              {thuongphat.count_thuong}{" "}
              <span className="precision-hub__kpiSubText">
                {getsentence(37, lang ?? "en")} / {thuongphat.count_phat} {getsentence(38, lang ?? "en")}
              </span>
            </div>
            <div style={{ width: "100%", height: 6, background: "#e2e8f0", borderRadius: 999, overflow: "hidden", marginTop: 8 }}>
              <div style={{ width: `${Math.min(100, thuongphat.count_thuong * 25)}%`, height: "100%", background: "#4f46e5", borderRadius: 999 }} />
            </div>
          </div>

          <div className="precision-hub__kpiFooter">
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#4f46e5" }}>
              award_star
            </span>
            <span>Hồ sơ thi đua khen thưởng</span>
          </div>
        </div>
      </div>
    </div>
  );
}
