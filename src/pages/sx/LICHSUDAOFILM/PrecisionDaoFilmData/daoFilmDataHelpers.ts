export type DaoFilmMode = "GIAO_NHAN" | "QUAN_LY" | "XUAT_DAO_FILM";
export type DaoFilmView = "all" | "charts" | "grid";

export interface DaoFilmKpiData {
  totalRecords: number;
  totalPress: number;
  okCount: number;
  ngCount: number;
  overStandardCount: number;
  daoCount: number;
  filmCount: number;
  tlCount: number;
  nm1Count: number;
  nm2Count: number;
}

export interface TypeDistributionItem {
  name: string;
  count: number;
  color: string;
}

export interface TopPressItem {
  name: string;
  totalPress: number;
  standardPress: number;
  gCode: string;
}

export interface DailyTrendItem {
  date: string;
  count: number;
  pressCount: number;
}

export interface FactoryStatusItem {
  factory: string;
  ok: number;
  ng: number;
}

// 1. Safe include search filter
export const filterDaoFilmData = (rawData: any[], searchKeyword: string): any[] => {
  if (!searchKeyword.trim()) return rawData;
  const kw = searchKeyword.trim().toLowerCase();
  const safeCheck = (val: any) =>
    val !== null && val !== undefined && String(val).toLowerCase().includes(kw);

  return rawData.filter((item) => {
    return (
      safeCheck(item.KNIFE_FILM_ID) ||
      safeCheck(item.G_CODE) ||
      safeCheck(item.G_NAME) ||
      safeCheck(item.G_NAME_KD) ||
      safeCheck(item.MA_DAO) ||
      safeCheck(item.MA_DAO_KT) ||
      safeCheck(item.FULL_KNIFE_CODE) ||
      safeCheck(item.PLAN_ID) ||
      safeCheck(item.FACTORY_NAME) ||
      safeCheck(item.KNIFE_TYPE) ||
      safeCheck(item.LOAIBANGIAO_PDP) ||
      safeCheck(item.LOAIPHATHANH) ||
      safeCheck(item.KNIFE_FILM_STATUS) ||
      safeCheck(item.KNIFE_STATUS) ||
      safeCheck(item.INS_EMPL) ||
      safeCheck(item.SX_EMPL_NO) ||
      safeCheck(item.VENDOR) ||
      safeCheck(item.REMARK)
    );
  });
};

// 2. Tính toán các chỉ số KPI
export const calculateKpiData = (rawData: any[]): DaoFilmKpiData => {
  let totalPress = 0;
  let okCount = 0;
  let ngCount = 0;
  let overStandardCount = 0;
  let daoCount = 0;
  let filmCount = 0;
  let tlCount = 0;
  let nm1Count = 0;
  let nm2Count = 0;

  rawData.forEach((item) => {
    const press = Number(item.TOTAL_PRESS ?? item.PRESS_QTY ?? 0);
    totalPress += isNaN(press) ? 0 : press;

    const stdPress = Number(item.STANDARD_PRESS_QTY ?? 0);
    if (stdPress > 0 && press > stdPress) {
      overStandardCount += 1;
    }

    const st = item.KNIFE_FILM_STATUS ?? item.KNIFE_STATUS;
    if (st === "OK") okCount += 1;
    else if (st) ngCount += 1;

    const pdp = item.LOAIBANGIAO_PDP;
    if (pdp === "D") daoCount += 1;
    else if (pdp === "F") filmCount += 1;
    else if (pdp === "T") tlCount += 1;

    const fac = String(item.FACTORY_NAME ?? item.FACTORY ?? "");
    if (fac.includes("1") || fac.toUpperCase().includes("NM1")) nm1Count += 1;
    else if (fac.includes("2") || fac.toUpperCase().includes("NM2")) nm2Count += 1;
  });

  return {
    totalRecords: rawData.length,
    totalPress,
    okCount,
    ngCount,
    overStandardCount,
    daoCount,
    filmCount,
    tlCount,
    nm1Count,
    nm2Count,
  };
};

// 3. Phân bổ chủng loại Dao & Film
export const calculateTypeDistribution = (rawData: any[]): TypeDistributionItem[] => {
  const counts: Record<string, number> = {};
  rawData.forEach((item) => {
    let t = item.KNIFE_TYPE || item.LOAIBANGIAO_PDP || "KHAC";
    if (t === "D") t = "DAO";
    else if (t === "F") t = "FILM";
    else if (t === "T") t = "TAI LIEU";
    counts[t] = (counts[t] || 0) + 1;
  });

  const palette = ["#0284c7", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];
  return Object.entries(counts).map(([name, count], i) => ({
    name,
    count,
    color: palette[i % palette.length],
  }));
};

// 4. Top 10 Dao dập nhiều nhất
export const calculateTopPress = (rawData: any[]): TopPressItem[] => {
  const list = [...rawData]
    .filter((item) => Number(item.TOTAL_PRESS ?? item.PRESS_QTY ?? 0) > 0)
    .sort(
      (a, b) =>
        Number(b.TOTAL_PRESS ?? b.PRESS_QTY ?? 0) - Number(a.TOTAL_PRESS ?? a.PRESS_QTY ?? 0)
    )
    .slice(0, 10);

  return list.map((item) => ({
    name: item.MA_DAO || item.FULL_KNIFE_CODE || item.G_CODE || "N/A",
    totalPress: Number(item.TOTAL_PRESS ?? item.PRESS_QTY ?? 0),
    standardPress: Number(item.STANDARD_PRESS_QTY ?? 0),
    gCode: item.G_CODE || item.G_NAME_KD || "",
  }));
};

// 5. Xu hướng theo ngày
export const calculateDailyTrend = (rawData: any[]): DailyTrendItem[] => {
  const dateMap: Record<string, { count: number; pressCount: number }> = {};
  rawData.forEach((item) => {
    const d = item.NGAYBANGIAO || item.INS_DATE?.slice(0, 10) || item.PLAN_DATE || "Khác";
    if (!dateMap[d]) dateMap[d] = { count: 0, pressCount: 0 };
    dateMap[d].count += 1;
    const p = Number(item.TOTAL_PRESS ?? item.PRESS_QTY ?? 0);
    if (!isNaN(p)) dateMap[d].pressCount += p;
  });

  return Object.entries(dateMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-15)
    .map(([date, val]) => ({
      date,
      count: val.count,
      pressCount: val.pressCount,
    }));
};

// 6. Phân bổ nhà máy & Sức khỏe OK/NG
export const calculateFactoryStatus = (rawData: any[]): FactoryStatusItem[] => {
  const res: Record<string, { ok: number; ng: number }> = {
    NM1: { ok: 0, ng: 0 },
    NM2: { ok: 0, ng: 0 },
    Khác: { ok: 0, ng: 0 },
  };

  rawData.forEach((item) => {
    const fac = String(item.FACTORY_NAME ?? item.FACTORY ?? "");
    let fKey = "Khác";
    if (fac.includes("1") || fac.toUpperCase().includes("NM1")) fKey = "NM1";
    else if (fac.includes("2") || fac.toUpperCase().includes("NM2")) fKey = "NM2";

    const st = item.KNIFE_FILM_STATUS ?? item.KNIFE_STATUS;
    if (st === "OK") res[fKey].ok += 1;
    else res[fKey].ng += 1;
  });

  return [
    { factory: "NM1", ok: res.NM1.ok, ng: res.NM1.ng },
    { factory: "NM2", ok: res.NM2.ok, ng: res.NM2.ng },
    ...(res["Khác"].ok + res["Khác"].ng > 0
      ? [{ factory: "Khác", ok: res["Khác"].ok, ng: res["Khác"].ng }]
      : []),
  ];
};
