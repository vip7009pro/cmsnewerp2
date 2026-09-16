import moment from "moment";
import { generalQuery } from "../../../../api/Api";
import {
  OQC_TREND_DATA,
  OQC_NG_BY_CUSTOMER,
  OQC_NG_BY_PRODTYPE,
  DailyPPMData,
  WeeklyPPMData,
  MonthlyPPMData,
  YearlyPPMData,
} from "../../interfaces/qcInterface";

interface QueryParams {
  df: boolean;
  fromdate: string;
  todate: string;
  cust_name: string;
  listCode: string[];
}

export const fetchOQCNGByCustomer = async ({ df, fromdate, todate, cust_name, listCode }: QueryParams): Promise<OQC_NG_BY_CUSTOMER[]> => {
  const td = moment().format("YYYY-MM-DD");
  const frd = moment().add(-12, "day").format("YYYY-MM-DD");
  try {
    const res = await generalQuery("ngbyCustomerOQC", {
      FACTORY: "ALL",
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    });
    return res.data.tk_status !== "NG" ? (res.data.data ?? []) : [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchOQCNGByProdType = async ({ df, fromdate, todate, cust_name, listCode }: QueryParams): Promise<OQC_NG_BY_PRODTYPE[]> => {
  const td = moment().format("YYYY-MM-DD");
  const frd = moment().add(-12, "day").format("YYYY-MM-DD");
  try {
    const res = await generalQuery("ngbyProTypeOQC", {
      FACTORY: "ALL",
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    });
    return res.data.tk_status !== "NG" ? (res.data.data ?? []) : [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchOQCTrend = async (
  queryName: "dailyOQCTrendingData" | "weeklyOQCTrendingData" | "monthlyOQCTrendingData" | "yearlyOQCTrendingData",
  defaultDaysBack: number,
  { df, fromdate, todate, cust_name, listCode }: QueryParams
): Promise<OQC_TREND_DATA[]> => {
  const td = moment().format("YYYY-MM-DD");
  const frd = moment().add(-defaultDaysBack, "day").format("YYYY-MM-DD");
  try {
    const res = await generalQuery(queryName, {
      FACTORY: "ALL",
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    });
    if (res.data.tk_status !== "NG") {
      return res.data.data.map((el: OQC_TREND_DATA) => ({
        ...el,
        OK_LOT: el.TOTAL_LOT - el.NG_LOT,
        NG_RATE: (el.NG_LOT * 100) / el.TOTAL_LOT,
        DELIVERY_DATE: el.DELIVERY_DATE ? moment.utc(el.DELIVERY_DATE).format("YYYY-MM-DD") : undefined,
      }));
    }
    return [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchInspPPM = async <T extends DailyPPMData | WeeklyPPMData | MonthlyPPMData | YearlyPPMData>(
  queryName: "inspect_daily_ppm_oqc" | "inspect_weekly_ppm_oqc" | "inspect_monthly_ppm_oqc" | "inspect_yearly_ppm_oqc",
  defaultDaysBack: number,
  ng_type: string,
  { df, fromdate, todate, cust_name, listCode }: QueryParams
): Promise<T[]> => {
  const td = moment().format("YYYY-MM-DD");
  const frd = moment().add(-defaultDaysBack, "day").format("YYYY-MM-DD");
  try {
    const res = await generalQuery(queryName, {
      FACTORY: "ALL",
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
      NG_TYPE: ng_type,
    });
    if (res.data.tk_status !== "NG") {
      return res.data.data.map((el: any) => ({
        ...el,
        TOTAL_PPM: ng_type === "ALL" ? el.TOTAL_PPM : ng_type === "P" ? el.PROCESS_PPM : el.MATERIAL_PPM,
        MATERIAL_PPM: ng_type === "ALL" ? el.MATERIAL_PPM : ng_type === "P" ? 0 : el.MATERIAL_PPM,
        PROCESS_PPM: ng_type === "ALL" ? el.PROCESS_PPM : ng_type === "M" ? 0 : el.PROCESS_PPM,
        INSPECT_DATE: el.INSPECT_DATE ? moment.utc(el.INSPECT_DATE).format("YYYY-MM-DD") : undefined,
      }));
    }
    return [];
  } catch (err) {
    console.error(err);
    return [];
  }
};
