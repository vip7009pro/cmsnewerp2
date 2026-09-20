import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { generalQuery } from "../../../../api/Api";
import { isTkOk, getErrMessage } from "../../../../api/services/responseService";

/**
 * Thống kê chấm công / nghỉ phép / tăng ca CỦA CHÍNH NGƯỜI DÙNG trong tháng hiện tại.
 *
 * Nguồn dữ liệu: `mydiemdanhnhom` (practice1/services/nhansuService.js) trả về đúng 1 dòng cho
 * mỗi ngày trong khoảng `from_date..to_date`, kèm các cột đã tính sẵn ở SQL:
 *   ON_OFF, WORKING_MINUTES, LATE_IN_MINUTES, FINAL_OVERTIMES, OVERTIME_MINUTES,
 *   OVERTIME_INFO, XACNHAN, OFF_ID, REASON_NAME, APPROVAL_STATUS.
 * Toàn bộ KPI dưới đây được tính trực tiếp từ các cột đó — không còn số liệu giả cứng.
 */
export interface MyMonthAttendanceStats {
  /** Tháng đang thống kê, định dạng MM/YYYY */
  monthLabel: string;
  /** Số ngày đã trôi qua của tháng (1..hôm nay) — mẫu số của tỷ lệ đi làm */
  elapsedDays: number;
  /** Số ngày đã điểm danh đi làm (ON_OFF = 1) */
  presentDays: number;
  /** Tổng giờ làm việc thực tế trong tháng = SUM(WORKING_MINUTES)/60 */
  workingHours: number;
  /** Số ngày có đơn nghỉ trong tháng (có OFF_ID hoặc REASON_NAME) */
  leaveDays: number;
  /** Số ngày nghỉ đang chờ duyệt (APPROVAL_STATUS = 2) */
  pendingLeaveOrders: number;
  /** Số ngày có đăng ký tăng ca */
  otDays: number;
  /** Giờ tăng ca thực tế = SUM(FINAL_OVERTIMES)/60 (phút đã làm tròn 15') */
  otHours: number;
  /** Số lần giải trình chấm công đã gửi trong tháng (XACNHAN khác rỗng) */
  attConfirmCount: number;
  /** Số ngày đi muộn trong tháng (LATE_IN_MINUTES > 0) */
  lateCount: number;
  isLoading: boolean;
  /** Thông báo lỗi tải dữ liệu (nếu có) để hiển thị cảnh báo trên UI */
  loadError: string;
}

type StatsValues = Omit<
  MyMonthAttendanceStats,
  "monthLabel" | "elapsedDays" | "isLoading" | "loadError"
>;

const EMPTY_VALUES: StatsValues = {
  presentDays: 0,
  workingHours: 0,
  leaveDays: 0,
  pendingLeaveOrders: 0,
  otDays: 0,
  otHours: 0,
  attConfirmCount: 0,
  lateCount: 0,
};

/** Ép về số phút >= 0, chống null/undefined/chuỗi lạ từ SQL. */
const toMinutes = (value: any): number => {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : 0;
};

/** True khi backend trả về giá trị thực (khác null/undefined/"null"/rỗng). */
const hasValue = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  const text = String(value).trim();
  return text !== "" && text.toLowerCase() !== "null";
};

export const useMyMonthAttendance = (reloadTrigger = 0): MyMonthAttendanceStats => {
  const [values, setValues] = useState<StatsValues>(EMPTY_VALUES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string>("");

  const loadStats = useCallback(() => {
    const fromDate = moment().startOf("month").format("YYYY-MM-DD");
    const toDate = moment().endOf("month").format("YYYY-MM-DD");

    setIsLoading(true);
    generalQuery("mydiemdanhnhom", { from_date: fromDate, to_date: toDate })
      .then((response) => {
        if (!isTkOk(response) || !Array.isArray(response.data.data)) {
          setValues(EMPTY_VALUES);
          setLoadError("");
          return;
        }

        let presentDays = 0;
        let workingMinutes = 0;
        let leaveDays = 0;
        let pendingLeaveOrders = 0;
        let otDays = 0;
        let otMinutes = 0;
        let attConfirmCount = 0;
        let lateCount = 0;

        (response.data.data as any[]).forEach((row) => {
          // 1. Ngày công
          if (Number(row.ON_OFF) === 1) {
            presentDays += 1;
            workingMinutes += toMinutes(row.WORKING_MINUTES);
            if (toMinutes(row.LATE_IN_MINUTES) > 0) lateCount += 1;
          }

          // 2. Đơn nghỉ (mỗi ngày trong đơn là 1 dòng riêng)
          if (hasValue(row.OFF_ID) || hasValue(row.REASON_NAME)) {
            leaveDays += 1;
            if (Number(row.APPROVAL_STATUS) === 2) pendingLeaveOrders += 1;
          }

          // 3. Tăng ca: FINAL_OVERTIMES là số phút tăng ca thực tế (đã trừ giờ nghỉ, làm tròn 15')
          if (hasValue(row.OVERTIME_INFO)) {
            otDays += 1;
            otMinutes += toMinutes(row.FINAL_OVERTIMES) || toMinutes(row.OVERTIME_MINUTES);
          }

          // 4. Giải trình chấm công
          if (hasValue(row.XACNHAN)) attConfirmCount += 1;
        });

        setValues({
          presentDays,
          workingHours: Math.round((workingMinutes / 60) * 10) / 10,
          leaveDays,
          pendingLeaveOrders,
          otDays,
          otHours: Math.round((otMinutes / 60) * 10) / 10,
          attConfirmCount,
          lateCount,
        });
        setLoadError("");
      })
      .catch((error) => {
        console.error("Lỗi tải KPI chấm công tháng:", error);
        setValues(EMPTY_VALUES);
        setLoadError(getErrMessage(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats, reloadTrigger]);

  return {
    monthLabel: moment().format("MM/YYYY"),
    elapsedDays: moment().date(),
    isLoading,
    loadError,
    ...values,
  };
};

export default useMyMonthAttendance;
