import { parse, isSunday, isBefore, isAfter, differenceInHours, addHours } from 'date-fns';

// Danh sách ngày lễ (ví dụ, có thể thay bằng API hoặc cấu hình)
const HOLIDAYS = ['2025-01-01', '2025-04-30', '2025-05-01', '2025-09-02'];

// Cấu hình giờ làm việc bình thường, nghỉ, và khung giờ ban đêm
const NORMAL_WORK_START = '08:00';
const NORMAL_WORK_END = '17:00';
const NIGHT_EVENING_START = '20:00';
const NIGHT_SHIFT_START = '22:00';
const NIGHT_SHIFT_MID_END = '05:00';
const NIGHT_SHIFT_END = '08:00';
const LUNCH_BREAK_START = '12:00';
const LUNCH_BREAK_END = '13:00';
const NIGHT_BREAK_START = '00:00';
const NIGHT_BREAK_END = '01:00';

export interface OvertimeBreakdown {
  hours100: number; // Giờ làm việc bình thường ban đêm (20:00–22:00)
  hours130: number; // Ca đêm không phải tăng ca (22:00–05:00)
  hours150: number; // Ngày thường, ban ngày
  hours200: number; // Ngày thường, ban đêm (05:00–08:00)
  hours210: number; // Ngày thường, ban đêm (22:00–05:00, có làm thêm ban ngày)
  hours200Weekend: number; // Ngày nghỉ hàng tuần, ban ngày
  hours270: number; // Ngày nghỉ hàng tuần, ban đêm
  hours300: number; // Ngày lễ, ban ngày
  hours390: number; // Ngày lễ, ban đêm
}

export interface OvertimeInput {
  date: string; // YYYY-MM-DD
  inTime: string; // hh:mm
  outTime: string; // hh:mm
}

export function calculateOvertime(input: OvertimeInput): OvertimeBreakdown {
  const result: OvertimeBreakdown = {
    hours100: 0,
    hours130: 0,
    hours150: 0,
    hours200: 0,
    hours210: 0,
    hours200Weekend: 0,
    hours270: 0,
    hours300: 0,
    hours390: 0,
  };

  // Parse ngày và giờ
  const date = parse(input.date, 'yyyy-MM-dd', new Date());
  const inTime = parse(`${input.date} ${input.inTime}`, 'yyyy-MM-dd HH:mm', new Date());
  let outTime = parse(`${input.date} ${input.outTime}`, 'yyyy-MM-dd HH:mm', new Date());

  // Nếu outTime nhỏ hơn inTime, giả định ca kéo dài sang ngày hôm sau
  if (isBefore(outTime, inTime)) {
    outTime = addHours(outTime, 24);
  }

  // Xác định loại ngày
  const isHoliday = HOLIDAYS.includes(input.date);
  const isWeekend = isSunday(date);
  const isNormalDay = !isHoliday && !isWeekend;

  // Parse giờ làm việc và giờ nghỉ
  const workStart = parse(`${input.date} ${NORMAL_WORK_START}`, 'yyyy-MM-dd HH:mm', new Date());
  const workEnd = parse(`${input.date} ${NORMAL_WORK_END}`, 'yyyy-MM-dd HH:mm', new Date());
  const eveningStart = parse(`${input.date} ${NIGHT_EVENING_START}`, 'yyyy-MM-dd HH:mm', new Date());
  const nightStart = parse(`${input.date} ${NIGHT_SHIFT_START}`, 'yyyy-MM-dd HH:mm', new Date());
  const nightMidEnd = parse(`${input.date} ${NIGHT_SHIFT_MID_END}`, 'yyyy-MM-dd HH:mm', new Date());
  const nightEnd = parse(`${input.date} ${NIGHT_SHIFT_END}`, 'yyyy-MM-dd HH:mm', new Date());
  const lunchBreakStart = parse(`${input.date} ${LUNCH_BREAK_START}`, 'yyyy-MM-dd HH:mm', new Date());
  const lunchBreakEnd = parse(`${input.date} ${LUNCH_BREAK_END}`, 'yyyy-MM-dd HH:mm', new Date());
  const nightBreakStart = parse(`${input.date} ${NIGHT_BREAK_START}`, 'yyyy-MM-dd HH:mm', new Date());
  const nightBreakEnd = parse(`${input.date} ${NIGHT_BREAK_END}`, 'yyyy-MM-dd HH:mm', new Date());

  // Hàm tính giờ trong khoảng thời gian, loại bỏ giờ nghỉ
  const calculateHoursInRange = (start: Date, end: Date, from: Date, to: Date): number => {
    let rangeStart = isAfter(from, start) ? from : start;
    let rangeEnd = isBefore(to, end) ? to : end;
    if (isBefore(rangeEnd, rangeStart)) return 0;

    let totalHours = differenceInHours(rangeEnd, rangeStart);

    // Trừ giờ nghỉ ăn trưa (12:00–13:00)
    const lunchOverlap = calculateOverlap(rangeStart, rangeEnd, lunchBreakStart, lunchBreakEnd);
    totalHours -= lunchOverlap;

    // Trừ giờ nghỉ ăn đêm (00:00–01:00)
    const nightBreakOverlap = calculateOverlap(rangeStart, rangeEnd, nightBreakStart, nightBreakEnd);
    totalHours -= nightBreakOverlap;

    return totalHours < 0 ? 0 : totalHours;
  };

  // Hàm tính số giờ chồng lấn giữa hai khoảng thời gian
  const calculateOverlap = (rangeStart: Date, rangeEnd: Date, breakStart: Date, breakEnd: Date): number => {
    const overlapStart = isAfter(rangeStart, breakStart) ? rangeStart : breakStart;
    const overlapEnd = isBefore(rangeEnd, breakEnd) ? rangeEnd : breakEnd;
    if (isBefore(overlapEnd, overlapStart)) return 0;
    return differenceInHours(overlapEnd, overlapStart);
  };

  // Xác định giờ làm việc
  let normalHours = 0;
  let eveningNormalHours = 0; // 20:00–22:00
  let dayOvertimeHours = 0;
  let nightOvertimeHours130 = 0; // 22:00–05:00
  let nightOvertimeHours200 = 0; // 05:00–08:00
  let nightNonOvertimeHours = 0; // 22:00–05:00, không làm ban ngày

  // Giờ làm việc bình thường ban ngày (08:00–17:00, trừ 12:00–13:00)
  normalHours = calculateHoursInRange(workStart, workEnd, inTime, outTime);

  // Giờ làm việc bình thường buổi tối (20:00–22:00)
  eveningNormalHours = calculateHoursInRange(eveningStart, nightStart, inTime, outTime);

  // Giờ làm thêm ban ngày (ngoài 08:00–17:00, trước 20:00 hoặc sau 08:00)
  dayOvertimeHours += calculateHoursInRange(workEnd, eveningStart, inTime, outTime);
  dayOvertimeHours += calculateHoursInRange(nightEnd, addHours(workStart, 24), inTime, outTime);

  // Giờ làm việc ban đêm (22:00–05:00 và 05:00–08:00, trừ 00:00–01:00)
  nightOvertimeHours130 = calculateHoursInRange(nightStart, nightMidEnd, inTime, outTime);
  nightOvertimeHours200 = calculateHoursInRange(nightMidEnd, nightEnd, inTime, outTime);

  // Phân biệt giờ ban đêm là tăng ca hay không
  if (nightOvertimeHours130 > 0 || nightOvertimeHours200 > 0) {
    if (normalHours > 0 || dayOvertimeHours > 0) {
      // Nếu có làm ban ngày, giờ 22:00–05:00 là tăng ca (210%)
    } else {
      // Nếu chỉ làm ban đêm, giờ 22:00–05:00 là ca đêm không phải tăng ca (130%)
      nightNonOvertimeHours = nightOvertimeHours130;
      nightOvertimeHours130 = 0;
    }
  }

  // Phân loại giờ theo loại ngày
  if (isNormalDay) {
    result.hours100 = eveningNormalHours;
    result.hours130 = nightNonOvertimeHours;
    result.hours150 = dayOvertimeHours;
    result.hours200 = nightOvertimeHours200;
    result.hours210 = nightOvertimeHours130 && (normalHours > 0 || dayOvertimeHours > 0) ? nightOvertimeHours130 : 0;
  } else if (isWeekend) {
    result.hours200Weekend = dayOvertimeHours + eveningNormalHours;
    result.hours270 = nightOvertimeHours130 + nightOvertimeHours200;
  } else if (isHoliday) {
    result.hours300 = dayOvertimeHours + eveningNormalHours;
    result.hours390 = nightOvertimeHours130 + nightOvertimeHours200;
  }

  return result;
}

// Ví dụ sử dụng
const input: OvertimeInput = {
  date: '2025-06-16', // Thứ Hai (ngày thường)
  inTime: '17:00',
  outTime: ':00',
};

console.log(calculateOvertime(input));