interface TimeInput {
  date: string; // Dạng 'YYYY-MM-DD'
  inTime: string; // Dạng 'HH:MM'
  outTime: string; // Dạng 'HH:MM'
}

export interface WorkMinutesByPercentage {
  [percentage: string]: number; // Ví dụ: '100%': 480, '150%': 180, '100%+30%': 120, v.v.
}

export interface CalculationOptions {
  weeklyDaysOff: number[]; // Mảng các số (0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7)
}

export function calculateWorkMinutesByPercentage(
  input: TimeInput,
  options: CalculationOptions // Thêm tham số options
): WorkMinutesByPercentage {
  // --- Định nghĩa các tham số cố định ---

  // Ngày nghỉ lễ của Việt Nam (Định dạng 'MM-DD' để dễ so sánh)
  // CẦN CẬP NHẬT CÁC NGÀY TẾT ÂM LỊCH VÀ GIỖ TỔ HÙNG VƯƠNG HÀNG NĂM
  const VIETNAM_HOLIDAYS: string[] = [
    '01-01', // Tết Dương lịch
    '04-30', // Giải phóng miền Nam
    '05-01', // Quốc tế Lao động
    '09-02', // Quốc khánh
    // Các ngày Tết Âm lịch 2025 (ví dụ, cần cập nhật cho năm thực tế):
    // '01-29', '01-30', '01-31', '02-01', '02-02',
    // Giỗ Tổ Hùng Vương 2025 (mùng 10/3 ÂL, ví dụ, cần tính toán/cập nhật):
    // '04-28'
  ];

  // Giờ làm việc chính quy và nghỉ giữa ca (phút)
  const REGULAR_SHIFT_START_DAY = { hour: 8, minute: 0 }; // 08:00
  const REGULAR_SHIFT_END_DAY = { hour: 17, minute: 0 }; // 17:00
  const LUNCH_BREAK_START = { hour: 12, minute: 0 }; // 12:00
  const LUNCH_BREAK_END = { hour: 13, minute: 0 }; // 13:00

  const REGULAR_SHIFT_START_NIGHT = { hour: 20, minute: 0 }; // 20:00
  const REGULAR_SHIFT_END_NIGHT = { hour: 5, minute: 0 }; // 05:00 (của ngày hôm sau)
  const NIGHT_BREAK_START = { hour: 0, minute: 0 }; // 00:00 (của ngày hôm sau)
  const NIGHT_BREAK_END = { hour: 1, minute: 0 }; // 01:00 (của ngày hôm sau)

  const NIGHT_SHIFT_HOURS_START = 22; // 22h tối (khung giờ ban đêm theo luật)
  const NIGHT_SHIFT_HOURS_END = 6; // 6h sáng hôm sau (khung giờ ban đêm theo luật)

  // --- Khởi tạo kết quả ---
  const result: WorkMinutesByPercentage = {
    '100%': 0,
    '150%': 0,
    '200%': 0,
    '300%': 0,
    '100%+30%': 0,
    '150%+30%+20%': 0,
    '200%+30%': 0,
    '200%+30%+20%': 0,
    '300%+30%': 0,
    '300%+30%+20%': 0,
  };

  // --- Chuyển đổi đầu vào thành đối tượng Date ---
  const startDate = new Date(`${input.date}T${input.inTime}:00`);
  let endDate = new Date(`${input.date}T${input.outTime}:00`);

  // Xử lý trường hợp làm việc qua nửa đêm (outTime nhỏ hơn inTime hoặc bằng inTime nhưng qua ngày)
  // Ví dụ: 20:00 -> 08:00
  if (endDate.getTime() <= startDate.getTime() && input.inTime !== input.outTime) {
      endDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000); // Thêm 1 ngày
  }


  // --- Lặp qua từng phút để tính toán ---
  let currentTime = new Date(startDate);

  while (currentTime.getTime() < endDate.getTime()) {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentDayOfWeek = currentTime.getDay(); // 0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7
    const currentMonthDay = `${(currentTime.getMonth() + 1).toString().padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')}`;

    // Kiểm tra các thuộc tính của PHÚT HIỆN TẠI
    const isCurrentMinuteInNightTimeRange = (currentHour >= NIGHT_SHIFT_HOURS_START || currentHour < NIGHT_SHIFT_HOURS_END);
    const isCurrentDateHoliday = VIETNAM_HOLIDAYS.includes(currentMonthDay);
    
    // Sử dụng options.weeklyDaysOff để xác định ngày nghỉ hàng tuần
    const isCurrentDateWeeklyDayOff = options.weeklyDaysOff.includes(currentDayOfWeek);

    let isBreakTime = false;

    // Kiểm tra giờ nghỉ trưa cho ca ngày (12h-13h)
    const isCurrentMinuteInLunchBreak =
      (currentHour > LUNCH_BREAK_START.hour || (currentHour === LUNCH_BREAK_START.hour && currentMinute >= LUNCH_BREAK_START.minute)) &&
      (currentHour < LUNCH_BREAK_END.hour || (currentHour === LUNCH_BREAK_END.hour && currentMinute < LUNCH_BREAK_END.minute));

    if (isCurrentMinuteInLunchBreak) {
      isBreakTime = true;
    }

    // Kiểm tra giờ nghỉ giữa ca cho ca đêm (0h-1h)
    // Chỉ áp dụng giờ nghỉ đêm nếu là giờ làm việc chính thức của ca đêm
    const isCurrentMinuteInRegularNightShiftFrame =
      (currentHour >= REGULAR_SHIFT_START_NIGHT.hour && currentHour <= 23) || // 20h-23h
      (currentHour >= 0 && currentHour < REGULAR_SHIFT_END_NIGHT.hour); // 0h-5h

    const isCurrentMinuteInNightBreak =
      (currentHour > NIGHT_BREAK_START.hour || (currentHour === NIGHT_BREAK_START.hour && currentMinute >= NIGHT_BREAK_START.minute)) &&
      (currentHour < NIGHT_BREAK_END.hour || (currentHour === NIGHT_BREAK_END.hour && currentMinute < NIGHT_BREAK_END.minute));

    if (isCurrentMinuteInRegularNightShiftFrame && isCurrentMinuteInNightBreak) {
      isBreakTime = true;
    }

    if (!isBreakTime) {
      // Mức lương cơ bản cho phút này (100%, 200%, 300%)
      let basePercentageKey: '100%' | '150%' | '200%' | '300%';

      // Xác định mức phần trăm cơ bản (không có cộng thêm 30% hoặc 20%)
      if (isCurrentDateHoliday) { // Dùng isCurrentDateHoliday để kiểm tra ngày lễ của phút hiện tại
        basePercentageKey = '300%';
      } else if (isCurrentDateWeeklyDayOff) { // Sử dụng biến mới isCurrentDateWeeklyDayOff
        basePercentageKey = '200%';
      } else { // Ngày thường
        // Xác định xem phút hiện tại có thuộc giờ làm việc bình thường của công ty trên ngày thường không
        let isRegularWorkingHourForNormalDay = false;
        
        // Ca ngày: 8h-17h (trừ nghỉ trưa)
        const isCurrentMinuteInRegularDayShift =
            (currentHour >= REGULAR_SHIFT_START_DAY.hour && currentHour < LUNCH_BREAK_START.hour) || // 8h-12h
            (currentHour >= LUNCH_BREAK_END.hour && currentHour < REGULAR_SHIFT_END_DAY.hour); // 13h-17h

        // Ca đêm: 20h-5h (trừ nghỉ đêm)
        const isCurrentMinuteInRegularNightShift =
            (currentHour >= REGULAR_SHIFT_START_NIGHT.hour && currentHour <= 23) || // 20h-23h
            (currentHour >= 1 && currentHour < REGULAR_SHIFT_END_NIGHT.hour); // 1h-5h


        if (isCurrentMinuteInRegularDayShift || isCurrentMinuteInRegularNightShift) {
             isRegularWorkingHourForNormalDay = true;
        }

        if (isRegularWorkingHourForNormalDay) {
          basePercentageKey = '100%';
        } else {
          basePercentageKey = '150%'; // Giờ làm thêm vào ngày thường
        }
      }

      // --- Cộng phút vào loại phù hợp ---
      let finalKey: string = basePercentageKey;

      // Xác định liệu phút hiện tại có phải là giờ làm thêm của ca đó hay không
      // Giờ làm thêm là khi vượt quá khung giờ làm việc bình thường của ca (không kể ngày nghỉ/lễ)
      let isCurrentMinuteOvertimeForThisShift = true; // Mặc định là làm thêm
      
      // Nếu là ca ngày 8h-17h
      if (input.inTime === '08:00' && input.outTime === '20:00') {
        const isInRegularDayShiftHours =
            (currentHour >= REGULAR_SHIFT_START_DAY.hour && currentHour < LUNCH_BREAK_START.hour) ||
            (currentHour >= LUNCH_BREAK_END.hour && currentHour < REGULAR_SHIFT_END_DAY.hour);
        if (isInRegularDayShiftHours) {
            isCurrentMinuteOvertimeForThisShift = false;
        }
      } 
      // Nếu là ca đêm 20h-5h
      else if (input.inTime === '20:00' && input.outTime === '08:00') {
         const isInRegularNightShiftHours = 
            (currentHour >= REGULAR_SHIFT_START_NIGHT.hour && currentHour <= 23) || // 20h-23h
            (currentHour >= 1 && currentHour < REGULAR_SHIFT_END_NIGHT.hour); // 1h-5h
         if (isInRegularNightShiftHours) {
            isCurrentMinuteOvertimeForThisShift = false;
         }
      }
      // Các trường hợp khác mặc định là làm thêm hoặc cần định nghĩa thêm giờ làm bình thường của ca đó.

      // Điều chỉnh finalKey dựa trên giờ làm đêm và làm thêm giờ ban đêm
      if (isCurrentMinuteInNightTimeRange) { // Nếu phút đó nằm trong khung giờ ban đêm theo luật (22h-6h)
          if (basePercentageKey === '100%') {
              finalKey = '100%+30%';
          } else if (basePercentageKey === '150%') {
              finalKey = '150%+30%+20%'; // Làm thêm giờ vào ban đêm của ngày thường
          } else if (basePercentageKey === '200%') {
              // Mặc định là 200%+30% nếu là giờ đêm
              finalKey = '200%+30%';
              if (isCurrentMinuteOvertimeForThisShift) { // Nếu phút này là làm thêm của ca đó
                  finalKey = '200%+30%+20%'; // Cộng thêm 20%
              }
          } else if (basePercentageKey === '300%') {
              // Mặc định là 300%+30% nếu là giờ đêm
              finalKey = '300%+30%';
              if (isCurrentMinuteOvertimeForThisShift) { // Nếu phút này là làm thêm của ca đó
                  finalKey = '300%+30%+20%'; // Cộng thêm 20%
              }
          }
      } else { // Nếu không phải giờ ban đêm theo luật (22h-6h)
         // Xử lý đặc biệt cho giờ 20h-22h của ca đêm, thường vẫn được hưởng +30% làm đêm dù không phải 22h-6h
         const isStartNightShiftHour = (currentHour >= REGULAR_SHIFT_START_NIGHT.hour && currentHour < NIGHT_SHIFT_HOURS_START); // 20h-21h
         if (isStartNightShiftHour && !isBreakTime) { // Nếu là giờ đầu ca đêm (20h-22h) và không phải giờ nghỉ
             if (basePercentageKey === '100%') {
                 finalKey = '100%+30%';
             } else if (basePercentageKey === '200%') {
                 finalKey = '200%+30%';
             } else if (basePercentageKey === '300%') {
                 finalKey = '300%+30%';
             }
         } else {
             finalKey = basePercentageKey; // Giữ nguyên basePercentageKey
         }
      }

      result[finalKey] = (result[finalKey] || 0) + 1;
    }

    currentTime.setMinutes(currentTime.getMinutes() + 1); // Tăng lên 1 phút
  }

  // Loại bỏ các key có giá trị 0 để kết quả gọn hơn
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