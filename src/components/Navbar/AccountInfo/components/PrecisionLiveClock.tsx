import React from "react";
import moment from "moment";

interface MYCHAMCONG {
  MIN_TIME: string;
  MAX_TIME: string;
}

interface PrecisionLiveClockProps {
  mychamcong?: MYCHAMCONG;
}

export default function PrecisionLiveClock({ mychamcong }: PrecisionLiveClockProps) {
  const todayStr = moment().format("DD/MM/YYYY");
  const weekdayStr = () => {
    const d = moment().day();
    const map = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    return map[d] || "";
  };

  const hasIn = mychamcong?.MIN_TIME && mychamcong.MIN_TIME !== "Chưa chấm";
  const hasOut = mychamcong?.MAX_TIME && mychamcong.MAX_TIME !== "Chưa chấm";

  // Calculate work progress for today
  const calculateShiftProgress = () => {
    if (!hasIn) return { hours: 0, percent: 0, statusText: "Chưa vào ca" };

    const inMoment = moment(`${moment().format("YYYY-MM-DD")} ${mychamcong?.MIN_TIME}`, "YYYY-MM-DD HH:mm:ss");
    const endMoment = hasOut
      ? moment(`${moment().format("YYYY-MM-DD")} ${mychamcong?.MAX_TIME}`, "YYYY-MM-DD HH:mm:ss")
      : moment();

    if (!inMoment.isValid() || !endMoment.isValid()) {
      return { hours: 0, percent: 0, statusText: "Đang tính..." };
    }

    const totalMinutes = Math.max(0, endMoment.diff(inMoment, "minutes"));
    // Subtract 60m lunch if past 12:00
    const lunchMinutes = endMoment.hour() >= 13 ? 60 : 0;
    const workingMinutes = Math.max(0, totalMinutes - lunchMinutes);
    const hours = Math.round((workingMinutes / 60) * 10) / 10;
    const percent = Math.min(100, Math.round((hours / 8.0) * 100));

    return {
      hours,
      percent,
      statusText: hasOut ? "Đã hoàn thành ca" : "Đang trong ca làm việc",
    };
  };

  const shiftProgress = calculateShiftProgress();

  return (
    <div className="precision-hub__card precision-hub__clockCard">
      {/* Clock Header */}
      <div className="precision-hub__cardHeader">
        <div className="precision-hub__cardHeaderLeft">
          <div className="precision-hub__headerIconWrap">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              timer
            </span>
          </div>
          <div>
            <h2 className="precision-hub__cardTitle">Điểm Danh Thời Gian Thực</h2>
            <p className="precision-hub__cardSubtitle">Live Attendance Clock & Shift Monitoring</p>
          </div>
        </div>

        <div className="precision-hub__dateChip">
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#64748b" }}>
            calendar_today
          </span>
          <span>
            {todayStr} - {weekdayStr()}
          </span>
        </div>
      </div>

      {/* Dual Check Status Cards: IN & OUT */}
      <div className="precision-hub__dualCheckGrid">
        {/* IN Card */}
        <div className="precision-hub__checkCard precision-hub__checkCard--in">
          <div className="precision-hub__checkHeader precision-hub__checkHeader--in">
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                login
              </span>
              CHỐT VÀO CA (IN)
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              contactless
            </span>
          </div>

          <div className="precision-hub__checkTime precision-hub__checkTime--in">
            {hasIn ? mychamcong?.MIN_TIME : "Chưa chấm"}
          </div>

          <div className="precision-hub__checkStatus precision-hub__checkStatus--in">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              {hasIn ? "check_circle" : "pending"}
            </span>
            <span>{hasIn ? "Đã ghi nhận quẹt thẻ" : "Chưa có dữ liệu vào"}</span>
          </div>
        </div>

        {/* OUT Card */}
        <div className="precision-hub__checkCard precision-hub__checkCard--out">
          <div className="precision-hub__checkHeader precision-hub__checkHeader--out">
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                logout
              </span>
              CHỐT RA CA (OUT)
            </span>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "9999px",
                background: hasOut ? "#0284c7" : "#38bdf8",
              }}
            />
          </div>

          <div className="precision-hub__checkTime precision-hub__checkTime--out">
            {hasOut ? mychamcong?.MAX_TIME : "--:--:--"}
          </div>

          <div className="precision-hub__checkStatus precision-hub__checkStatus--out">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              {hasOut ? "task_alt" : "autorenew"}
            </span>
            <span>{shiftProgress.statusText}</span>
          </div>
        </div>
      </div>

      {/* Shift Progress Box */}
      <div className="precision-hub__shiftProgressBox">
        <div className="precision-hub__shiftProgressHeader">
          <span style={{ color: "#475569", fontWeight: 500 }}>
            Tiến độ giờ chuẩn:{" "}
            <strong style={{ color: "#0f172a", fontWeight: 700 }}>
              {shiftProgress.hours}h / 8.0h
            </strong>
          </span>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: 700,
              fontSize: 11,
              color: "#1d4ed8",
              background: "#dbeafe",
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            {shiftProgress.percent}% hoàn thành
          </span>
        </div>

        <div className="precision-hub__progressBarWrap">
          <div
            className="precision-hub__progressBarFill"
            style={{ width: `${shiftProgress.percent}%` }}
          />
        </div>

        <div className="precision-hub__shiftCheckpoints">
          <div className="precision-hub__checkpoint">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "9999px",
                background: hasIn ? "#10b981" : "#cbd5e1",
              }}
            />
            <span>08:00 Vào ca</span>
          </div>

          <div className="precision-hub__checkpoint">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "9999px",
                background: shiftProgress.hours >= 4 ? "#f59e0b" : "#cbd5e1",
              }}
            />
            <span>12:00 Nghỉ trưa</span>
          </div>

          <div className="precision-hub__checkpoint">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "9999px",
                background: hasOut ? "#2563eb" : "#cbd5e1",
              }}
            />
            <span>17:00 Kết ca</span>
          </div>
        </div>
      </div>
    </div>
  );
}
