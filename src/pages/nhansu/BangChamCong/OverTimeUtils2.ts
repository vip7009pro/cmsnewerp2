interface TimeInput {
  date: string;
  inTime: string;
  outTime: string;
}

export interface WorkMinutesByPercentage {
  [percentage: string]: number;
}

export interface CalculationOptions {
  weeklyDaysOff: number[];
}

export function calculateWorkMinutesByPercentage(
  input: TimeInput,
  options: CalculationOptions
): WorkMinutesByPercentage {
  const VIETNAM_HOLIDAYS: string[] = ['01-01', '04-30', '05-01', '09-02'];

  const REGULAR_SHIFT_START_DAY = { hour: 8, minute: 0 };
  const REGULAR_SHIFT_END_DAY = { hour: 17, minute: 0 };
  const LUNCH_BREAK_START = { hour: 12, minute: 0 };
  const LUNCH_BREAK_END = { hour: 13, minute: 0 };

  const REGULAR_SHIFT_START_NIGHT = { hour: 20, minute: 0 };
  const REGULAR_SHIFT_END_NIGHT = { hour: 6, minute: 0 };
  const NIGHT_BREAK_START = { hour: 0, minute: 0 };
  const NIGHT_BREAK_END = { hour: 1, minute: 0 };

  const NIGHT_SHIFT_HOURS_START = 22;
  const NIGHT_SHIFT_HOURS_END = 6;

  const result: WorkMinutesByPercentage = {
    '100%': 0,
    '150%': 0,
    '200%': 0,
    '300%': 0,
    '100%+30%': 0,
    '150%+30%+20%': 0,
    '200%+30%': 0,
    '200%+30%+20%X200%': 0,
    '300%+30%': 0,
    '300%+30%+20%': 0,
  };

  const startDate = new Date(`${input.date}T${input.inTime}:00`);
  let endDate = new Date(`${input.date}T${input.outTime}:00`);

  if (endDate.getTime() <= startDate.getTime() && input.inTime !== input.outTime) {
    endDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
  }

  let currentTime = new Date(startDate);

  while (currentTime.getTime() < endDate.getTime()) {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentDayOfWeek = currentTime.getDay();
    const currentMonthDay = `${(currentTime.getMonth() + 1).toString().padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')}`;

    // Bỏ qua thời gian trước 20:00
    if (currentHour < REGULAR_SHIFT_START_NIGHT.hour && currentMinute < REGULAR_SHIFT_START_NIGHT.minute) {
      currentTime.setMinutes(currentTime.getMinutes() + 1);
      continue;
    }

    // Dừng khi vượt quá 8:00
    if (currentHour > 8) {
      break;
    }

    const isCurrentMinuteInNightTimeRange = (currentHour >= NIGHT_SHIFT_HOURS_START || currentHour < NIGHT_SHIFT_HOURS_END);
    const isCurrentDateHoliday = VIETNAM_HOLIDAYS.includes(currentMonthDay);
    const isCurrentDateWeeklyDayOff = options.weeklyDaysOff.includes(currentDayOfWeek);

    let isBreakTime = false;

    const isCurrentMinuteInLunchBreak =
      (currentHour > LUNCH_BREAK_START.hour || (currentHour === LUNCH_BREAK_START.hour && currentMinute >= LUNCH_BREAK_START.minute)) &&
      (currentHour < LUNCH_BREAK_END.hour || (currentHour === LUNCH_BREAK_END.hour && currentMinute < LUNCH_BREAK_END.minute));

    if (isCurrentMinuteInLunchBreak) {
      isBreakTime = true;
    }

    const isCurrentMinuteInRegularNightShiftFrame =
      (currentHour >= REGULAR_SHIFT_START_NIGHT.hour && currentHour <= 23) ||
      (currentHour >= NIGHT_BREAK_END.hour && currentHour < 5);

    const isCurrentMinuteInNightBreak =
      (currentHour > NIGHT_BREAK_START.hour || (currentHour === NIGHT_BREAK_START.hour && currentMinute >= NIGHT_BREAK_START.minute)) &&
      (currentHour < NIGHT_BREAK_END.hour || (currentHour === NIGHT_BREAK_END.hour && currentMinute < NIGHT_BREAK_END.minute));

    if (isCurrentMinuteInRegularNightShiftFrame && isCurrentMinuteInNightBreak) {
      isBreakTime = true;
    }

    if (!isBreakTime) {
      let basePercentageKey: '100%' | '150%' | '200%' | '300%';

      if (isCurrentDateHoliday) {
        basePercentageKey = '300%';
      } else if (isCurrentDateWeeklyDayOff) {
        basePercentageKey = '200%';
      } else {
        let isRegularWorkingHourForNormalDay = false;

        const isCurrentMinuteInRegularDayShift =
          (currentHour >= REGULAR_SHIFT_START_DAY.hour && currentHour < LUNCH_BREAK_START.hour) ||
          (currentHour >= LUNCH_BREAK_END.hour && currentHour < REGULAR_SHIFT_END_DAY.hour);

        const isCurrentMinuteInRegularNightShift =
          (currentHour >= REGULAR_SHIFT_START_NIGHT.hour && currentHour <= 23) ||
          (currentHour >= NIGHT_BREAK_END.hour && currentHour < 5);

        if (isCurrentMinuteInRegularDayShift || isCurrentMinuteInRegularNightShift) {
          isRegularWorkingHourForNormalDay = true;
        }

        if (isRegularWorkingHourForNormalDay) {
          basePercentageKey = '100%';
        } else {
          basePercentageKey = '150%';
        }
      }

      let finalKey: string = basePercentageKey;

      let isCurrentMinuteOvertimeForThisShift = true;
      if (input.inTime === '20:00' && input.outTime === '08:00') {
        const isInRegularNightShiftHours = 
          (currentHour >= REGULAR_SHIFT_START_NIGHT.hour && currentHour <= 23) ||
          (currentHour >= NIGHT_BREAK_END.hour && currentHour < 5);
        if (isInRegularNightShiftHours) {
          isCurrentMinuteOvertimeForThisShift = false;
        } else if (currentHour === 5 && isCurrentMinuteInNightTimeRange) {
          isCurrentMinuteOvertimeForThisShift = true; // 5h-6h là tăng ca ban đêm
        } else if (currentHour >= 6 && currentHour < 8) {
          isCurrentMinuteOvertimeForThisShift = true; // 6h-8h là tăng ca ban ngày
        }
      }

      if (isCurrentMinuteInNightTimeRange) {
        if (basePercentageKey === '100%') {
          finalKey = '100%+30%';
        } else if (basePercentageKey === '150%') {
          finalKey = '150%+30%+20%';
        } else if (basePercentageKey === '200%') {
          finalKey = '200%+30%';
          if (isCurrentMinuteOvertimeForThisShift) {
            finalKey = '200%+30%+20%X200%';
          }
        } else if (basePercentageKey === '300%') {
          finalKey = '300%+30%';
          if (isCurrentMinuteOvertimeForThisShift) {
            finalKey = '300%+30%+20%';
          }
        }
      } else {
        finalKey = basePercentageKey;
      }

      result[finalKey] = (result[finalKey] || 0) + 1;
    }

    currentTime.setMinutes(currentTime.getMinutes() + 1);
  }

  for (const key in result) {
    if (result[key] === 0) {
      delete result[key];
    }
  }

  return result;
}

// --- Ví dụ sử dụng hàm ---

// Định nghĩa cấu hình cho công ty của bạn (chỉ nghỉ Chủ nhật)
const companyOptions: CalculationOptions = {
  weeklyDaysOff: [0] // 0 là Chủ nhật
};

// Định nghĩa cấu hình cho công ty nghỉ cả T7 & CN
const companyOptionsFullWeekend: CalculationOptions = {
  weeklyDaysOff: [0, 6] // 0 là Chủ nhật, 6 là Thứ 7
};


console.log('--- TEST CA NGÀY: 8h-17h, làm thêm tới 20h (CÔNG TY CHỈ NGHỈ CHỦ NHẬT) ---');

// 1. **Ngày thường (Thứ 2 - Thứ 6)**
// Input: 2025-06-30 (Thứ 2), IN: 08:00, OUT: 20:00
// Expected: 480 phút 100% (8h-12h, 13h-17h), 180 phút 150% (17h-20h)
const normalDayResult = calculateWorkMinutesByPercentage({ date: '2025-06-30', inTime: '08:00', outTime: '20:00' }, companyOptions);
console.log('1. Ngày thường (Thứ 2):', normalDayResult);
// Expected Output: { '100%': 480, '150%': 180 }

// 2. **Ngày Thứ 7 (Làm việc bình thường, làm thêm)**
// Input: 2025-06-28 (Thứ 7), IN: 08:00, OUT: 20:00
// Expected: 480 phút 100% (8h-12h, 13h-17h), 180 phút 150% (17h-20h)
// Vì Thứ 7 không phải ngày nghỉ hàng tuần theo companyOptions
const saturdayWorkResult = calculateWorkMinutesByPercentage({ date: '2025-06-28', inTime: '08:00', outTime: '20:00' }, companyOptions);
console.log('2. Ngày Thứ 7 (không phải ngày nghỉ):', saturdayWorkResult);
// Expected Output: { '100%': 480, '150%': 180 }

// 3. **Ngày Chủ nhật (Ngày nghỉ hàng tuần)**
// Input: 2025-06-29 (Chủ nhật), IN: 08:00, OUT: 20:00
// Expected: 660 phút 200% (8h-12h, 13h-17h, 17h-20h)
const sundayResult = calculateWorkMinutesByPercentage({ date: '2025-06-29', inTime: '08:00', outTime: '20:00' }, companyOptions);
console.log('3. Ngày Chủ nhật (Ngày nghỉ hàng tuần):', sundayResult);
// Expected Output: { '200%': 660 }

// 4. **Ngày Lễ (ví dụ: Tết Dương lịch 2025)**
// Input: 2025-01-01, IN: 08:00, OUT: 20:00
// Expected: 660 phút 300% (8h-12h, 13h-17h, 17h-20h)
const holidayDayResult = calculateWorkMinutesByPercentage({ date: '2025-01-01', inTime: '08:00', outTime: '20:00' }, companyOptions);
console.log('4. Ngày Lễ:', holidayDayResult);
// Expected Output: { '300%': 660 }

console.log('\n--- TEST CA ĐÊM: 20h-5h, làm thêm tới 8h (CÔNG TY CHỈ NGHỈ CHỦ NHẬT) ---');

// 5. **Đêm thường (Đêm Thứ 2 sang Thứ 3)**
// Input: 2025-06-30 (Thứ 2), IN: 20:00, OUT: 08:00
// Expected:
// 20h-22h (120p): 100%+30%
// 22h-0h (120p):  100%+30%
// 1h-5h (240p):   100%+30%
// => Tổng 480 phút '100%+30%'
// 5h-6h (60p):    150%+30%+20%
// 6h-8h (120p):   150%
const normalNightResult = calculateWorkMinutesByPercentage({ date: '2025-06-30', inTime: '20:00', outTime: '08:00' }, companyOptions);
console.log('5. Đêm thường (Thứ 2 sang Thứ 3):', normalNightResult);
// Expected Output: { '150%': 120, '100%+30%': 480, '150%+30%+20%': 60 }

// 6. **Đêm Thứ 7 (Ca đêm của ngày Thứ 7, sang Chủ nhật)**
// Input: 2025-06-28 (Thứ 7), IN: 20:00, OUT: 08:00
// Expected:
// 20h-22h (120p): 100%+30% (Thứ 7 KHÔNG phải ngày nghỉ hàng tuần)
// 22h-0h (120p):  100%+30% (Đã sang Chủ nhật, là ngày nghỉ hàng tuần)
// 1h-5h (240p):   200%+30% (Chủ nhật, là ngày nghỉ hàng tuần)
// => Tổng 120 phút '100%+30%' (Thứ 7), 360 phút '200%+30%' (Chủ nhật)
// 5h-6h (60p):    200%+30%+20% (Chủ nhật, làm thêm giờ ban đêm)
// 6h-8h (120p):   200% (Chủ nhật, làm thêm giờ ban ngày)
const satNightResult = calculateWorkMinutesByPercentage({ date: '2025-06-28', inTime: '20:00', outTime: '08:00' }, companyOptions);
console.log('6. Đêm Thứ 7 (sang Chủ nhật):', satNightResult);
// Expected Output: { '200%': 120, '100%+30%': 120, '200%+30%': 360, '200%+30%+20%': 60 }


// 7. **Đêm Chủ nhật (Ca đêm của ngày Chủ nhật, sang Thứ 2)**
// Input: 2025-06-29 (Chủ nhật), IN: 20:00, OUT: 08:00
// Expected:
// 20h-22h (120p): 200%+30%
// 22h-0h (120p):  200%+30%
// => Tổng 240 phút '200%+30%'
// 1h-5h (240p):   100%+30% (Đã sang Thứ 2 - ngày thường)
// => Tổng 240 phút '100%+30%'
// 5h-6h (60p):    150%+30%+20%
// 6h-8h (120p):   150%
const sunNightResult = calculateWorkMinutesByPercentage({ date: '2025-06-29', inTime: '20:00', outTime: '08:00' }, companyOptions);
console.log('7. Đêm Chủ nhật (sang Thứ 2):', sunNightResult);
// Expected Output: { '150%': 120, '100%+30%': 240, '150%+30%+20%': 60, '200%+30%': 240 }

// 8. **Đêm trước ngày lễ (Ví dụ: Đêm 31/12/2024 sang 01/01/2025)**
// Input: 2024-12-31, IN: 20:00, OUT: 08:00
// Expected:
// 20h-22h (120p): 100%+30%
// 22h-0h (120p):  100%+30%
// => Tổng 240 phút '100%+30%'
// 1h-5h (240p):   300%+30% (Đã sang 01/01 - ngày lễ)
// => Tổng 240 phút '300%+30%'
// 5h-6h (60p):    300%+30%+20%
// 6h-8h (120p):   300%
const preHolidayNightResult = calculateWorkMinutesByPercentage({ date: '2024-12-31', inTime: '20:00', outTime: '08:00' }, companyOptions);
console.log('8. Đêm trước ngày lễ (31/12/2024 sang 01/01/2025):', preHolidayNightResult);
// Expected Output: { '300%': 120, '100%+30%': 240, '300%+30%': 240, '300%+30%+20%': 60 }

console.log('\n--- TEST VỚI CÔNG TY NGHỈ CẢ T7 & CN ---');
const satSunOffResult = calculateWorkMinutesByPercentage({ date: '2025-06-28', inTime: '08:00', outTime: '20:00' }, companyOptionsFullWeekend);
console.log('Thứ 7 (nghỉ T7 & CN):', satSunOffResult);
// Expected: { '200%': 660 }