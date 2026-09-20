import React from "react";
import { MyMonthAttendanceStats } from "./useMyMonthAttendance";

export interface PrecisionDangKyKpiProps {
  stats: MyMonthAttendanceStats;
}

/** Định mức tăng ca tham chiếu (giờ/tháng) — theo quy chế hiển thị, không phải số liệu người dùng. */
const OT_MONTHLY_QUOTA = 40;
/** Quy chế: tối đa 3 lần giải trình chấm công mỗi tháng (khớp badge ở form Xác nhận chấm công). */
const ATT_CONFIRM_QUOTA = 3;

const percentOf = (value: number, total: number): number => {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.round((value / total) * 100));
};

/** Hiển thị "--" khi đang tải để không ghi số 0 gây hiểu nhầm. */
const display = (isLoading: boolean, value: string): string => (isLoading ? "--" : value);

export const PrecisionDangKyKpi: React.FC<PrecisionDangKyKpiProps> = ({ stats }) => {
  const {
    monthLabel,
    elapsedDays,
    presentDays,
    workingHours,
    leaveDays,
    pendingLeaveOrders,
    otDays,
    otHours,
    attConfirmCount,
    lateCount,
    isLoading,
  } = stats;

  const presentPercent = percentOf(presentDays, elapsedDays);
  const otPercent = percentOf(otHours, OT_MONTHLY_QUOTA);
  const attPercent = percentOf(attConfirmCount, ATT_CONFIRM_QUOTA);
  const pendingPercent = percentOf(pendingLeaveOrders, leaveDays);

  return (
    <div className="precision-dangky__kpis">
      {stats.loadError && (
        <div className="kpi-warning">
          <span className="material-symbols-outlined">warning</span>
          <span>Không tải được số liệu chấm công: {stats.loadError}</span>
        </div>
      )}
      {/* Card 1: Ngày công đi làm thực tế trong tháng */}
      <div className="kpi-card kpi-card--leave" title="Số ngày đã điểm danh đi làm / số ngày đã trôi qua của tháng">
        <div className="kpi-icon">
          <span className="material-symbols-outlined">event_available</span>
        </div>
        <div className="kpi-content">
          <span className="label">Ngày công đi làm (tháng {monthLabel})</span>
          <div className="metrics">
            <span className="main-num">{display(isLoading, String(presentDays))}</span>
            <span className="sub-num">/ {elapsedDays} ngày đã qua</span>
          </div>
          <div className="kpi-progress">
            <div className="fill" style={{ width: `${presentPercent}%` }}></div>
          </div>
          <span className="sub-num">
            Tổng {display(isLoading, workingHours.toFixed(1))}h làm việc thực tế
          </span>
        </div>
      </div>

      {/* Card 2: Tăng ca lũy kế tháng (phút thực tế đã làm, SQL đã trừ giờ nghỉ và làm tròn 15') */}
      <div className="kpi-card kpi-card--ot" title="Giờ tăng ca thực tế theo máy chấm công (FINAL_OVERTIMES)">
        <div className="kpi-icon">
          <span className="material-symbols-outlined">more_time</span>
        </div>
        <div className="kpi-content">
          <span className="label">Tăng ca lũy kế (tháng {monthLabel})</span>
          <div className="metrics">
            <span className="main-num">{display(isLoading, otHours.toFixed(1))}</span>
            <span className="sub-num">/ {OT_MONTHLY_QUOTA}h định mức</span>
          </div>
          <div className="kpi-progress">
            <div className="fill" style={{ width: `${otPercent}%` }}></div>
          </div>
          <span className="sub-num">
            {display(isLoading, String(otDays))} ngày có đăng ký OT
          </span>
        </div>
      </div>

      {/* Card 3: Ngày nghỉ đang chờ duyệt */}
      <div className="kpi-card kpi-card--pending" title="Số ngày nghỉ đã đăng ký và đang ở trạng thái Chờ duyệt (APPROVAL_STATUS = 2)">
        <div className="kpi-icon">
          <span className="material-symbols-outlined">pending_actions</span>
        </div>
        <div className="kpi-content">
          <span className="label">Nghỉ phép chờ duyệt</span>
          <div className="metrics">
            <span className="main-num">
              {display(isLoading, String(pendingLeaveOrders))}
            </span>
            <span className="sub-num">ngày nghỉ chờ duyệt</span>
          </div>
          <div className="kpi-progress">
            <div className="fill" style={{ width: `${pendingPercent}%` }}></div>
          </div>
          <span className="sub-num">
            {display(isLoading, String(leaveDays))} ngày nghỉ có đơn trong tháng
          </span>
        </div>
      </div>

      {/* Card 4: Giải trình chấm công */}
      <div className="kpi-card kpi-card--att" title="Số lần đã gửi xác nhận chấm công trong tháng (XACNHAN)">
        <div className="kpi-icon">
          <span className="material-symbols-outlined">fact_check</span>
        </div>
        <div className="kpi-content">
          <span className="label">Giải trình chấm công</span>
          <div className="metrics">
            <span className="main-num">{display(isLoading, String(attConfirmCount))}</span>
            <span className="sub-num">/ {ATT_CONFIRM_QUOTA} lần quy chế</span>
          </div>
          <div className="kpi-progress">
            <div className="fill" style={{ width: `${attPercent}%` }}></div>
          </div>
          <span className="sub-num">
            {display(isLoading, String(lateCount))} ngày đi muộn trong tháng
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDangKyKpi);
