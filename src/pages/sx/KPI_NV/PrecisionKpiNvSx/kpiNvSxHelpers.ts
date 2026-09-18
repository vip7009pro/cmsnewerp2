import { SX_KPI_NV_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

export interface KpiNvSxSummaryStats {
  totalRecords: number;
  totalPlanMet: number;
  totalOutputMetLt: number;
  totalOutputMetTt: number;
  totalPlanQty: number;
  totalOutputEaLt: number;
  totalOutputEaTt: number;
  avgRateM: number;
  avgRateEa: number;
  uniqueEmplCount: number;
  bestPerformerMet: {
    empl: string;
    outputMet: number;
    rateM: number;
  };
}

export interface KpiTrendDataPoint {
  period: string; // SX_DATE hoặc SX_YW hoặc SX_YM hoặc SX_YEAR
  planMet: number;
  outputMetTt: number;
  outputMetLt: number;
  planQty: number;
  outputEaTt: number;
  avgRateM: number;
}

export interface TopEmplMetData {
  empl: string;
  planMet: number;
  outputMetTt: number;
  rateM: number;
}

export interface TopEmplQtyData {
  empl: string;
  planQty: number;
  outputEaTt: number;
  rateEa: number;
}

export interface RateDistData {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export const ENTERPRISE_CHART_COLORS = [
  "#2563eb", // Royal Blue
  "#059669", // Emerald
  "#d97706", // Amber
  "#7c3aed", // Purple
  "#0284c7", // Sky Blue
  "#dc2626", // Rose Red
  "#0d9488", // Teal
  "#4f46e5", // Indigo
  "#ea580c", // Orange
  "#64748b", // Slate
];

const safeNumber = (val: any): number => {
  if (val === null || val === undefined || isNaN(Number(val))) return 0;
  return Number(val);
};

const safeRateNumber = (val: any): number => {
  const num = safeNumber(val);
  return num <= 1 && num > 0 ? num * 100 : num;
};

// 1. Tính toán Dashboard 6 Micro-Cards KPI
export const calculateKpiNvSxSummary = (data: SX_KPI_NV_DATA[]): KpiNvSxSummaryStats => {
  if (!data || data.length === 0) {
    return {
      totalRecords: 0,
      totalPlanMet: 0,
      totalOutputMetLt: 0,
      totalOutputMetTt: 0,
      totalPlanQty: 0,
      totalOutputEaLt: 0,
      totalOutputEaTt: 0,
      avgRateM: 0,
      avgRateEa: 0,
      uniqueEmplCount: 0,
      bestPerformerMet: { empl: "-", outputMet: 0, rateM: 0 },
    };
  }

  let totalPlanMet = 0;
  let totalOutputMetLt = 0;
  let totalOutputMetTt = 0;
  let totalPlanQty = 0;
  let totalOutputEaLt = 0;
  let totalOutputEaTt = 0;
  let sumRateM = 0;
  let sumRateEa = 0;
  let rateMCount = 0;
  let rateEaCount = 0;

  const emplMap = new Map<string, { outputMet: number; planMet: number }>();

  data.forEach((item) => {
    const pMet = safeNumber(item.PLAN_MET);
    const oMetLt = safeNumber(item.OUTPUT_M_LT);
    const oMetTt = safeNumber(item.OUTPUT_M_TT);
    const pQty = safeNumber(item.PLAN_QTY);
    const oEaLt = safeNumber(item.OUTPUT_EA_LT);
    const oEaTt = safeNumber(item.OUTPUT_EA_TT);

    totalPlanMet += pMet;
    totalOutputMetLt += oMetLt;
    totalOutputMetTt += oMetTt;
    totalPlanQty += pQty;
    totalOutputEaLt += oEaLt;
    totalOutputEaTt += oEaTt;

    if (item.RATE_M !== undefined && item.RATE_M !== null) {
      sumRateM += safeRateNumber(item.RATE_M);
      rateMCount++;
    }
    if (item.RATE_EA !== undefined && item.RATE_EA !== null) {
      sumRateEa += safeRateNumber(item.RATE_EA);
      rateEaCount++;
    }

    const empl = item.INS_EMPL ? String(item.INS_EMPL).trim() : "Unknown";
    const curr = emplMap.get(empl) || { outputMet: 0, planMet: 0 };
    curr.outputMet += oMetTt;
    curr.planMet += pMet;
    emplMap.set(empl, curr);
  });

  let bestEmpl = "-";
  let maxOutputMet = 0;
  let bestRateM = 0;

  emplMap.forEach((v, k) => {
    if (v.outputMet > maxOutputMet) {
      maxOutputMet = v.outputMet;
      bestEmpl = k;
      bestRateM = v.planMet > 0 ? (v.outputMet / v.planMet) * 100 : 100;
    }
  });

  return {
    totalRecords: data.length,
    totalPlanMet,
    totalOutputMetLt,
    totalOutputMetTt,
    totalPlanQty,
    totalOutputEaLt,
    totalOutputEaTt,
    avgRateM: rateMCount > 0 ? sumRateM / rateMCount : 0,
    avgRateEa: rateEaCount > 0 ? sumRateEa / rateEaCount : 0,
    uniqueEmplCount: emplMap.size,
    bestPerformerMet: {
      empl: bestEmpl,
      outputMet: maxOutputMet,
      rateM: bestRateM,
    },
  };
};

// 2. Tổng hợp biểu đồ 1: Xu hướng theo chu kỳ thời gian (Period Trend)
export const aggregatePeriodTrendData = (data: SX_KPI_NV_DATA[], option: string): KpiTrendDataPoint[] => {
  if (!data || data.length === 0) return [];

  const periodMap = new Map<string, {
    planMet: number;
    outputMetTt: number;
    outputMetLt: number;
    planQty: number;
    outputEaTt: number;
    rateMList: number[];
  }>();

  data.forEach((item) => {
    let key = "";
    if (option === "Daily") {
      key = item.SX_DATE ? String(item.SX_DATE) : (item.SX_YM ? String(item.SX_YM) : "Unknown");
    } else if (option === "Weekly") {
      key = item.SX_YW ? String(item.SX_YW) : (item.SX_WEEK ? `W${item.SX_WEEK}` : "Unknown");
    } else if (option === "Monthly") {
      key = item.SX_YM ? String(item.SX_YM) : (item.SX_MONTH ? `M${item.SX_MONTH}` : "Unknown");
    } else if (option === "Yearly") {
      key = item.SX_YEAR ? String(item.SX_YEAR) : "Unknown";
    }

    if (!key) key = "Unknown";

    const curr = periodMap.get(key) || {
      planMet: 0,
      outputMetTt: 0,
      outputMetLt: 0,
      planQty: 0,
      outputEaTt: 0,
      rateMList: [],
    };

    curr.planMet += safeNumber(item.PLAN_MET);
    curr.outputMetTt += safeNumber(item.OUTPUT_M_TT);
    curr.outputMetLt += safeNumber(item.OUTPUT_M_LT);
    curr.planQty += safeNumber(item.PLAN_QTY);
    curr.outputEaTt += safeNumber(item.OUTPUT_EA_TT);

    if (item.RATE_M !== undefined && item.RATE_M !== null) {
      curr.rateMList.push(safeRateNumber(item.RATE_M));
    }

    periodMap.set(key, curr);
  });

  const result: KpiTrendDataPoint[] = [];
  periodMap.forEach((v, k) => {
    const avgRate = v.rateMList.length > 0 ? v.rateMList.reduce((a, b) => a + b, 0) / v.rateMList.length : (v.planMet > 0 ? (v.outputMetTt / v.planMet) * 100 : 0);
    result.push({
      period: k,
      planMet: Math.round(v.planMet),
      outputMetTt: Math.round(v.outputMetTt),
      outputMetLt: Math.round(v.outputMetLt),
      planQty: Math.round(v.planQty),
      outputEaTt: Math.round(v.outputEaTt),
      avgRateM: Number(avgRate.toFixed(1)),
    });
  });

  return result.sort((a, b) => a.period.localeCompare(b.period));
};

// 3. Tổng hợp biểu đồ 2: Top 10 nhân viên có sản lượng mét cao nhất
export const aggregateTopEmplMetData = (data: SX_KPI_NV_DATA[]): TopEmplMetData[] => {
  if (!data || data.length === 0) return [];

  const map = new Map<string, { planMet: number; outputMetTt: number; rates: number[] }>();

  data.forEach((item) => {
    const empl = item.INS_EMPL ? String(item.INS_EMPL).trim() : "Unknown";
    const curr = map.get(empl) || { planMet: 0, outputMetTt: 0, rates: [] };
    curr.planMet += safeNumber(item.PLAN_MET);
    curr.outputMetTt += safeNumber(item.OUTPUT_M_TT);
    if (item.RATE_M !== undefined && item.RATE_M !== null) {
      curr.rates.push(safeRateNumber(item.RATE_M));
    }
    map.set(empl, curr);
  });

  const list: TopEmplMetData[] = [];
  map.forEach((v, k) => {
    const rate = v.rates.length > 0 ? v.rates.reduce((a, b) => a + b, 0) / v.rates.length : (v.planMet > 0 ? (v.outputMetTt / v.planMet) * 100 : 0);
    list.push({
      empl: k,
      planMet: Math.round(v.planMet),
      outputMetTt: Math.round(v.outputMetTt),
      rateM: Number(rate.toFixed(1)),
    });
  });

  return list.sort((a, b) => b.outputMetTt - a.outputMetTt).slice(0, 10);
};

// 4. Tổng hợp biểu đồ 3: Cơ cấu phân bổ tỷ lệ đạt KPI nhân viên (Rate Distribution)
export const aggregateRateDistData = (data: SX_KPI_NV_DATA[]): RateDistData[] => {
  if (!data || data.length === 0) return [];

  let tierExceed = 0; // >= 100%
  let tierGood = 0;   // 80% - 99%
  let tierAverage = 0;// 50% - 79%
  let tierLow = 0;    // < 50%

  data.forEach((item) => {
    const rate = safeRateNumber(item.RATE_M);
    if (rate >= 100) tierExceed++;
    else if (rate >= 80) tierGood++;
    else if (rate >= 50) tierAverage++;
    else tierLow++;
  });

  const total = data.length;
  return [
    { name: "Xuất Sắc (≥100%)", count: tierExceed, percentage: total > 0 ? Number(((tierExceed / total) * 100).toFixed(1)) : 0, color: "#059669" },
    { name: "Khá (80% - 99%)", count: tierGood, percentage: total > 0 ? Number(((tierGood / total) * 100).toFixed(1)) : 0, color: "#2563eb" },
    { name: "Trung Bình (50% - 79%)", count: tierAverage, percentage: total > 0 ? Number(((tierAverage / total) * 100).toFixed(1)) : 0, color: "#d97706" },
    { name: "Cần Cải Thiện (<50%)", count: tierLow, percentage: total > 0 ? Number(((tierLow / total) * 100).toFixed(1)) : 0, color: "#dc2626" },
  ];
};

// 5. Tổng hợp biểu đồ 4: So sánh Kế hoạch vs Thực tế EA của Top Nhân Viên
export const aggregateTopEmplQtyData = (data: SX_KPI_NV_DATA[]): TopEmplQtyData[] => {
  if (!data || data.length === 0) return [];

  const map = new Map<string, { planQty: number; outputEaTt: number; rates: number[] }>();

  data.forEach((item) => {
    const empl = item.INS_EMPL ? String(item.INS_EMPL).trim() : "Unknown";
    const curr = map.get(empl) || { planQty: 0, outputEaTt: 0, rates: [] };
    curr.planQty += safeNumber(item.PLAN_QTY);
    curr.outputEaTt += safeNumber(item.OUTPUT_EA_TT);
    if (item.RATE_EA !== undefined && item.RATE_EA !== null) {
      curr.rates.push(safeRateNumber(item.RATE_EA));
    }
    map.set(empl, curr);
  });

  const list: TopEmplQtyData[] = [];
  map.forEach((v, k) => {
    const rate = v.rates.length > 0 ? v.rates.reduce((a, b) => a + b, 0) / v.rates.length : (v.planQty > 0 ? (v.outputEaTt / v.planQty) * 100 : 0);
    list.push({
      empl: k,
      planQty: Math.round(v.planQty),
      outputEaTt: Math.round(v.outputEaTt),
      rateEa: Number(rate.toFixed(1)),
    });
  });

  return list.sort((a, b) => b.outputEaTt - a.outputEaTt).slice(0, 10);
};

// 6. Hàm lọc dữ liệu nhanh Quick Search an toàn đa trường
export const filterKpiNvSxData = (data: SX_KPI_NV_DATA[], keyword: string): SX_KPI_NV_DATA[] => {
  if (!keyword || !keyword.trim()) return data;
  const kw = keyword.toLowerCase().trim();

  const safeIncludes = (val: any) => {
    if (val === null || val === undefined) return false;
    return String(val).toLowerCase().includes(kw);
  };

  return data.filter((item) => {
    return (
      safeIncludes(item.INS_EMPL) ||
      safeIncludes(item.SX_DATE) ||
      safeIncludes(item.SX_YEAR) ||
      safeIncludes(item.SX_WEEK) ||
      safeIncludes(item.SX_MONTH) ||
      safeIncludes(item.SX_YW) ||
      safeIncludes(item.SX_YM) ||
      safeIncludes(item.PLAN_MET) ||
      safeIncludes(item.OUTPUT_M_TT) ||
      safeIncludes(item.PLAN_QTY) ||
      safeIncludes(item.OUTPUT_EA_TT)
    );
  });
};
