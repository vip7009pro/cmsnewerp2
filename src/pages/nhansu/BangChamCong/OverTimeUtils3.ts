interface RateRule {
  start: string; // "HH:mm"
  end: string;   // "HH:mm"
  rate: number;
}

// ======================= Utils =======================
function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function intervalToMinutes(start: string, end: string): [number, number] {
  let s = toMinutes(start);
  let e = toMinutes(end);
  if (e <= s) e += 24 * 60;
  return [s, e];
}

function overlapMinutes(a1: number, a2: number, b1: number, b2: number): number {
  const start = Math.max(a1, b1);
  const end = Math.min(a2, b2);
  return Math.max(0, end - start);
}

// Làm tròn OT: >=30 phút mới tính, sau đó làm tròn xuống bội số 15
function roundOvertime(mins: number): number {
  if (mins < 30) return 0;
  return Math.floor(mins / 15) * 15;
}

// ======================= Rule Definitions =======================
function buildRules(workType: number): RateRule[] {
  switch (workType) {
    case 1: // ngày thường
      return [
        { start: "08:00", end: "17:00", rate: 100 },
        { start: "17:00", end: "22:00", rate: 150 },
        { start: "22:00", end: "24:00", rate: 210 }
      ];
    case 2: // ngày nghỉ
      return [
        { start: "08:00", end: "22:00", rate: 200 },
        { start: "22:00", end: "24:00", rate: 270 }
      ];
    case 3: // ca đêm thường
      return [
        { start: "20:00", end: "22:00", rate: 100 },
        { start: "22:00", end: "05:00", rate: 130 },
        { start: "05:00", end: "08:00", rate: 210 }
      ];
    case 4: // ca đêm ngày nghỉ
      return [
        { start: "20:00", end: "22:00", rate: 100 },
        { start: "22:00", end: "24:00", rate: 130 },
        { start: "00:00", end: "05:00", rate: 200 },
        { start: "05:00", end: "08:00", rate: 270 }
      ];
    case 5: // ca đêm lễ
      return [
        { start: "20:00", end: "22:00", rate: 200 },
        { start: "22:00", end: "12:00", rate: 270 }
      ];
    case 6: // ngày lễ
      return [
        { start: "08:00", end: "22:00", rate: 300 },
        { start: "22:00", end: "24:00", rate: 390 }
      ];
    case 7: // đêm trước lễ
      return [
        { start: "20:00", end: "22:00", rate: 100 },
        { start: "22:00", end: "24:00", rate: 130 },
        { start: "00:00", end: "12:00", rate: 390 }
      ];
    case 8: // đêm trước nghỉ lễ
      return [
        { start: "20:00", end: "22:00", rate: 200 },
        { start: "22:00", end: "24:00", rate: 270 },
        { start: "00:00", end: "12:00", rate: 390 }
      ];
    case 9: // đêm trước lễ lớn
      return [
        { start: "20:00", end: "22:00", rate: 300 },
        { start: "22:00", end: "12:00", rate: 390 }
      ];
    default:
      return [];
  }
}

function classifyShift(
  inTimeStr: string,
  outTimeStr: string,
  dateStr: string,
  holidays: string[]
): number {
  const baseDate = new Date(dateStr + "T00:00:00");

  const [inH, inM] = inTimeStr.split(":").map(Number);
  const [outH, outM] = outTimeStr.split(":").map(Number);

  const inTime = new Date(baseDate);
  inTime.setHours(inH, inM, 0, 0);

  let outTime = new Date(baseDate);
  outTime.setHours(outH, outM, 0, 0);

  if (outTime <= inTime) {
    outTime.setDate(outTime.getDate() + 1);
  }

  const holidaysSet = new Set(holidays.map(d => new Date(d).toDateString()));

  const isHoliday = (d: Date) => holidaysSet.has(d.toDateString());
  const isSunday = (d: Date) => d.getDay() === 0;

  const inIsHoliday = isHoliday(inTime);
  const outIsHoliday = isHoliday(outTime);

  const inIsSunday = isSunday(inTime);
  const outIsSunday = isSunday(outTime);

  // --- Ca ngày ---
  if (inTimeStr < outTimeStr) {
    if (inIsHoliday) return 6;
    if (inIsSunday) return 2;
    return 1;
  }

  // --- Ca đêm ---
  if (inIsHoliday) return 9;
  if (!inIsHoliday && outIsHoliday && inIsSunday) return 8;
  if (!inIsHoliday && outIsHoliday && !inIsSunday) return 7;
  if (!inIsHoliday && inIsSunday && !outIsHoliday) return 5;
  if (!inIsHoliday && inTime.getDay() === 6 && outIsSunday) return 4;
  return 3;
}

const VIETNAM_HOLIDAYS: string[] = [
  '2025-01-01','2025-01-28','2025-01-29','2025-01-30','2025-01-31',
  '2025-04-30', '2025-05-01','2025-09-01','2025-09-02'
];

// ======================= Main Function =======================
export function calcMinutesByRate(
  inTime: string,
  outTime: string,
  date: string,
): Record<string, number> {
  const result: Record<string, number> = {
    "100%": 0,
    "130%": 0,
    "150%": 0,
    "200%": 0,
    "210%": 0,
    "270%": 0,
    "300%": 0,
    "390%": 0
  };
 
  if ((!inTime || !outTime || inTime === outTime || inTime === "X" || outTime === "X" ) && VIETNAM_HOLIDAYS.includes(date)) return  {...result,"100%": 480};
  if ((!inTime || !outTime || inTime === outTime || inTime === "X" || outTime === "X" ) && !VIETNAM_HOLIDAYS.includes(date)) return result;


  let [start, end] = intervalToMinutes(inTime, outTime);
  const workType = classifyShift(inTime, outTime, date, VIETNAM_HOLIDAYS);
  const rules = buildRules(workType);

  // nghỉ không lương
  const excludes: [number, number][] = [
    [toMinutes("12:00"), toMinutes("13:00")],
    [toMinutes("00:00"), toMinutes("01:00")]
  ];

  const expandedRules: { s: number; e: number; rate: number }[] = [];
  for (const r of rules) {
    let [rs, re] = intervalToMinutes(r.start, r.end);
    expandedRules.push({ s: rs, e: re, rate: r.rate });
    expandedRules.push({ s: rs + 1440, e: re + 1440, rate: r.rate });
  }

  for (const r of expandedRules) {
    const os = Math.max(start, r.s);
    const oe = Math.min(end, r.e);
    if (oe > os) {
      let mins = oe - os;

      for (const [es, ee] of excludes) {
        mins -= overlapMinutes(os, oe, es, ee);
        mins -= overlapMinutes(os, oe, es + 1440, ee + 1440);
      }

      if (mins > 0) {
        if (r.rate > 100) {
          result[`${r.rate}%`] += roundOvertime(mins);
        } else {
          result[`${r.rate}%`] += mins;
        }
      }
    }
  }

  return result;
}




export function calculatePersonalIncomeTax(taxableIncome: number): number {
  // Các khung bậc thuế thu nhập cá nhân (theo luật Việt Nam, đơn vị: triệu VNĐ)
  const taxBrackets = [
      { maxIncome: 5, rate: 0.05 },   // 5% cho thu nhập đến 5 triệu
      { maxIncome: 10, rate: 0.1 },   // 10% cho thu nhập từ trên 5 đến 10 triệu
      { maxIncome: 18, rate: 0.15 },  // 15% cho thu nhập từ trên 10 đến 18 triệu
      { maxIncome: 32, rate: 0.2 },   // 20% cho thu nhập từ trên 18 đến 32 triệu
      { maxIncome: 52, rate: 0.25 },  // 25% cho thu nhập từ trên 32 đến 52 triệu
      { maxIncome: 80, rate: 0.3 },   // 30% cho thu nhập từ trên 52 đến 80 triệu
      { maxIncome: Infinity, rate: 0.35 } // 35% cho thu nhập trên 80 triệu
  ];

  let tax = 0;
  let remainingIncome = taxableIncome / 1_000_000; // Chuyển đổi sang triệu VNĐ

  // Tính thuế theo từng bậc
  let prevBracket = 0;
  for (const bracket of taxBrackets) {
      if (remainingIncome <= 0) break;
      
      const taxableInBracket = Math.min(
          remainingIncome,
          bracket.maxIncome - prevBracket
      );
      tax += taxableInBracket * bracket.rate;
      remainingIncome -= taxableInBracket;
      prevBracket = bracket.maxIncome;
  }

  return tax * 1_000_000; // Chuyển đổi kết quả về VNĐ
}