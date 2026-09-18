import moment from "moment";
import { DEFECT_PROCESS_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

export interface MainDefectsKpiSummary {
  totalDefects: number;
  uniqueProducts: number;
  activeCount: number;
  inactiveCount: number;
  activeRate: number;
  visualCount: number;
  visualRate: number;
  cd1Count: number;
  cd2Count: number;
  cd3Count: number;
  cd4PlusCount: number;
  uniqueTestItems: number;
  uniqueTestMethods: number;
  uniqueEmpls: number;
  recentUpdatedCount: number;
}

export interface TopDefectChartData {
  DEFECT: string;
  COUNT: number;
  PRODUCTS: number;
}

export interface ProcessDistChartData {
  name: string;
  value: number;
  percent: number;
}

export interface CreationTrendChartData {
  PERIOD: string;
  NEW_STANDARDS: number;
  TOTAL_CUMULATIVE: number;
}

export interface TopModelChartData {
  PROD_MODEL: string;
  ACTIVE: number;
  INACTIVE: number;
  TOTAL: number;
}

export const ENTERPRISE_CHART_COLORS = [
  "#2563eb", "#059669", "#d97706", "#7c3aed", "#e11d48", "#0891b2",
  "#ea580c", "#4f46e5", "#16a34a", "#9333ea", "#0284c7", "#ca8a04",
];

export const calculateDefectsKpi = (data: DEFECT_PROCESS_DATA[]): MainDefectsKpiSummary => {
  const totalDefects = data.length;
  if (totalDefects === 0) {
    return {
      totalDefects: 0,
      uniqueProducts: 0,
      activeCount: 0,
      inactiveCount: 0,
      activeRate: 0,
      visualCount: 0,
      visualRate: 0,
      cd1Count: 0,
      cd2Count: 0,
      cd3Count: 0,
      cd4PlusCount: 0,
      uniqueTestItems: 0,
      uniqueTestMethods: 0,
      uniqueEmpls: 0,
      recentUpdatedCount: 0,
    };
  }

  const productsSet = new Set<string>();
  const testItemsSet = new Set<string>();
  const testMethodsSet = new Set<string>();
  const emplsSet = new Set<string>();

  let activeCount = 0;
  let visualCount = 0;
  let cd1Count = 0;
  let cd2Count = 0;
  let cd3Count = 0;
  let cd4PlusCount = 0;
  let recentUpdatedCount = 0;

  const thirtyDaysAgo = moment().subtract(30, "days");

  data.forEach((item) => {
    if (item.G_CODE) productsSet.add(String(item.G_CODE));
    const testItem = safeStringTrim(item.TEST_ITEM);
    if (testItem) testItemsSet.add(testItem);
    const testMethod = safeStringTrim(item.TEST_METHOD);
    if (testMethod) testMethodsSet.add(testMethod);
    if (item.INS_EMPL) emplsSet.add(String(item.INS_EMPL));
    if (item.UPD_EMPL) emplsSet.add(String(item.UPD_EMPL));

    if (item.USE_YN === "Y") activeCount++;
    const patrolId = safeStringTrim(item.INS_PATROL_ID);
    if (item.IMAGE_YN === "Y" || patrolId !== "") {
      visualCount++;
    }

    const proc = Number(item.PROCESS_NUMBER);
    if (proc === 1) cd1Count++;
    else if (proc === 2) cd2Count++;
    else if (proc === 3) cd3Count++;
    else if (proc >= 4) cd4PlusCount++;

    if (item.UPD_DATE && moment(item.UPD_DATE).isAfter(thirtyDaysAgo)) {
      recentUpdatedCount++;
    }
  });

  const inactiveCount = totalDefects - activeCount;
  const activeRate = totalDefects > 0 ? (activeCount / totalDefects) * 100 : 0;
  const visualRate = totalDefects > 0 ? (visualCount / totalDefects) * 100 : 0;

  return {
    totalDefects,
    uniqueProducts: productsSet.size,
    activeCount,
    inactiveCount,
    activeRate,
    visualCount,
    visualRate,
    cd1Count,
    cd2Count,
    cd3Count,
    cd4PlusCount,
    uniqueTestItems: testItemsSet.size,
    uniqueTestMethods: testMethodsSet.size,
    uniqueEmpls: emplsSet.size,
    recentUpdatedCount,
  };
};

export const getTop10Defects = (data: DEFECT_PROCESS_DATA[]): TopDefectChartData[] => {
  const map: Record<string, { count: number; products: Set<string> }> = {};

  data.forEach((item) => {
    const defect = safeStringTrim(item.DEFECT) || "Chưa xác định";
    if (!map[defect]) {
      map[defect] = { count: 0, products: new Set() };
    }
    map[defect].count++;
    if (item.G_CODE) {
      map[defect].products.add(String(item.G_CODE));
    }
  });

  return Object.keys(map)
    .map((k) => ({
      DEFECT: k,
      COUNT: map[k].count,
      PRODUCTS: map[k].products.size,
    }))
    .sort((a, b) => b.COUNT - a.COUNT)
    .slice(0, 10);
};

export const getProcessDistribution = (data: DEFECT_PROCESS_DATA[]): ProcessDistChartData[] => {
  const map: Record<string, number> = {};
  const total = data.length || 1;

  data.forEach((item) => {
    const p = item.PROCESS_NUMBER;
    const name = p !== null && p !== undefined ? `Công Đoạn ${p}` : "Khác";
    map[name] = (map[name] || 0) + 1;
  });

  return Object.keys(map)
    .map((k) => ({
      name: k,
      value: map[k],
      percent: Number(((map[k] / total) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.value - a.value);
};

export const getCreationTrend = (data: DEFECT_PROCESS_DATA[]): CreationTrendChartData[] => {
  const map: Record<string, number> = {};

  data.forEach((item) => {
    if (item.INS_DATE) {
      const month = moment(item.INS_DATE).format("YYYY-MM");
      if (month !== "Invalid date") {
        map[month] = (map[month] || 0) + 1;
      }
    }
  });

  const sortedMonths = Object.keys(map).sort();
  let cumulative = 0;

  return sortedMonths.map((month) => {
    cumulative += map[month];
    return {
      PERIOD: month,
      NEW_STANDARDS: map[month],
      TOTAL_CUMULATIVE: cumulative,
    };
  });
};

export const getTop10Models = (data: DEFECT_PROCESS_DATA[]): TopModelChartData[] => {
  const map: Record<string, { active: number; inactive: number }> = {};

  data.forEach((item) => {
    const model = safeStringTrim(item.PROD_MODEL) || "Chưa phân loại";
    if (!map[model]) {
      map[model] = { active: 0, inactive: 0 };
    }
    if (item.USE_YN === "Y") {
      map[model].active++;
    } else {
      map[model].inactive++;
    }
  });

  return Object.keys(map)
    .map((k) => ({
      PROD_MODEL: k,
      ACTIVE: map[k].active,
      INACTIVE: map[k].inactive,
      TOTAL: map[k].active + map[k].inactive,
    }))
    .sort((a, b) => b.TOTAL - a.TOTAL)
    .slice(0, 10);
};

export const safeStringTrim = (val: any): string => {
  if (val === null || val === undefined) return "";
  return String(val).trim();
};

export const safeIncludes = (value: any, kw: string): boolean => {
  if (value === null || value === undefined) return false;
  return String(value).toLowerCase().includes(kw);
};


