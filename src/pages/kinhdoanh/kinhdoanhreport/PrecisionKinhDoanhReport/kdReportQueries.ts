import moment from "moment";
import { generalQuery, getCompany, getGlobalSetting } from "../../../../api/Api";
import { WEB_SETTING_DATA, WeeklyClosingData } from "../../../../api/GlobalInterface";
import {
  CUSTOMER_REVENUE_DATA,
  CustomerListData,
  MonthlyClosingData,
  OVERDUE_DATA,
  PIC_REVENUE_DATA,
  PO_BALANCE_CUSTOMER,
  PO_BALANCE_DETAIL,
  PO_BALANCE_SUMMARY,
  RunningPOData,
  WeekLyPOData,
} from "../../interfaces/kdInterface";
import {
  f_load_PO_BALANCE_CUSTOMER,
  f_load_PO_BALANCE_CUSTOMER_BY_YEAR,
  f_load_PO_BALANCE_DETAIL,
  f_load_PO_BALANCE_SUMMARY,
} from "../../utils/kdUtils";

export interface YearlyClosingData {
  YEAR_NUM: string;
  DELIVERY_QTY: number;
  DELIVERED_AMOUNT: number;
}
export interface DailyClosingData {
  DELIVERY_DATE: string;
  DELIVERY_QTY: number;
  DELIVERED_AMOUNT: number;
}
export interface POBalanceSummaryData {
  PO_QTY: number;
  TOTAL_DELIVERED: number;
  PO_BALANCE: number;
  PO_AMOUNT: number;
  DELIVERED_AMOUNT: number;
  BALANCE_AMOUNT: number;
}
export interface FCSTAmountData {
  FCSTYEAR: number;
  FCSTWEEKNO: number;
  FCST4W_QTY: number;
  FCST4W_AMOUNT: number;
  FCST8W_QTY: number;
  FCST8W_AMOUNT: number;
}
export interface WidgetData_POBalanceSummary {
  po_balance_qty: number;
  po_balance_amount: number;
}

export interface QueryParams {
  df: boolean;
  fromdate: string;
  todate: string;
  in_nhanh: boolean;
}

// 1. FCST Amount
export const queryFCSTAmount = async (): Promise<FCSTAmountData[]> => {
  let kq: FCSTAmountData[] = [];
  let fcstweek2: number = moment().add(1, "days").isoWeek();
  let fcstyear2: number = moment().year();
  try {
    const res = await generalQuery("checklastfcstweekno", { FCSTWEEKNO: fcstyear2 });
    if (res.data.tk_status !== "NG" && res.data.data?.[0]) {
      fcstweek2 = res.data.data[0].FCSTWEEKNO;
    }
  } catch (err) {
    console.error(err);
  }

  try {
    const response = await generalQuery("fcstamount", { FCSTYEAR: fcstyear2, FCSTWEEKNO: fcstweek2 });
    if (response.data.tk_status !== "NG") {
      kq = response.data.data || [];
    } else {
      const fallback = await generalQuery("fcstamount", {
        FCSTYEAR: fcstweek2 - 1 === 0 ? fcstyear2 - 1 : fcstyear2,
        FCSTWEEKNO: fcstweek2 - 1 === 0 ? 52 : fcstweek2 - 1,
      });
      if (fallback.data.tk_status !== "NG") {
        kq = fallback.data.data || [];
      }
    }
  } catch (err) {
    console.error(err);
  }
  return kq;
};

// 2. Closing Summaries (Daily, Weekly, Monthly, Yearly)
export const queryDailyClosing = async ({ df, fromdate, todate, in_nhanh }: QueryParams): Promise<DailyClosingData[]> => {
  const yesterday = moment().add(0, "day").format("YYYY-MM-DD");
  const yesterday2 = moment().add(-12, "day").format("YYYY-MM-DD");
  try {
    const res = await generalQuery("kd_dailyclosing", {
      START_DATE: df ? yesterday2 : fromdate,
      END_DATE: df ? yesterday : todate,
      IN_NHANH: in_nhanh,
    });
    if (res.data.tk_status !== "NG") {
      return (res.data.data || []).map((el: DailyClosingData) => ({
        ...el,
        DELIVERY_DATE: el.DELIVERY_DATE ? el.DELIVERY_DATE.slice(0, 10) : "",
      }));
    }
  } catch (err) {
    console.error(err);
  }
  return [];
};

export const queryWeeklyClosing = async ({ df, fromdate, todate, in_nhanh }: QueryParams): Promise<WeeklyClosingData[]> => {
  const yesterday = moment().add(1, "day").endOf("week").format("YYYY-MM-DD");
  const yesterday2 = moment().add(-56, "day").format("YYYY-MM-DD");
  try {
    const res = await generalQuery("kd_weeklyclosing", {
      START_DATE: df ? yesterday2 : fromdate,
      END_DATE: df ? yesterday : todate,
      IN_NHANH: in_nhanh,
    });
    if (res.data.tk_status !== "NG") {
      return (res.data.data || []).reverse();
    }
  } catch (err) {
    console.error(err);
  }
  return [];
};

export const queryMonthlyClosing = async ({ df, fromdate, todate, in_nhanh }: QueryParams): Promise<MonthlyClosingData[]> => {
  const yesterday = moment().endOf("month").format("YYYY-MM-DD");
  const yesterday2 = moment().add(-365, "day").format("YYYY-MM-DD");
  try {
    const res = await generalQuery("kd_monthlyclosing", {
      START_DATE: df ? yesterday2 : fromdate,
      END_DATE: df ? yesterday : todate,
      IN_NHANH: in_nhanh,
    });
    if (res.data.tk_status !== "NG") {
      return (res.data.data || []).reverse();
    }
  } catch (err) {
    console.error(err);
  }
  return [];
};

export const queryYearlyClosing = async ({ df, fromdate, todate, in_nhanh }: QueryParams): Promise<YearlyClosingData[]> => {
  const yesterday = moment().endOf("year").format("YYYY-MM-DD");
  const yesterday2 = "2020-01-01";
  try {
    const res = await generalQuery("kd_annuallyclosing", {
      START_DATE: df ? yesterday2 : fromdate,
      END_DATE: df ? yesterday : todate,
      IN_NHANH: in_nhanh,
    });
    if (res.data.tk_status !== "NG") {
      return res.data.data || [];
    }
  } catch (err) {
    console.error(err);
  }
  return [];
};

// 3. Customer Revenue & PIC Revenue
export const queryCustomerRevenue = async ({ df, fromdate, todate, in_nhanh }: QueryParams): Promise<CUSTOMER_REVENUE_DATA[]> => {
  let sunday = moment().clone().weekday(0).format("YYYY-MM-DD");
  let monday = moment().clone().weekday(6).format("YYYY-MM-DD");
  try {
    const res = await generalQuery("customerRevenue", {
      START_DATE: df ? sunday : fromdate,
      END_DATE: df ? monday : todate,
      IN_NHANH: in_nhanh,
    });
    if (res.data.tk_status !== "NG") {
      return (res.data.data || []).slice(0, 5);
    }
    sunday = moment().clone().weekday(0).add(-7, "days").format("YYYY-MM-DD");
    monday = moment().clone().weekday(6).add(-7, "days").format("YYYY-MM-DD");
    const fallback = await generalQuery("customerRevenue", {
      START_DATE: df ? sunday : fromdate,
      END_DATE: df ? monday : todate,
    });
    if (fallback.data.tk_status !== "NG") {
      return (fallback.data.data || []).slice(0, 5);
    }
  } catch (err) {
    console.error(err);
  }
  return [];
};

export const queryPICRevenue = async ({ df, fromdate, todate, in_nhanh }: QueryParams): Promise<PIC_REVENUE_DATA[]> => {
  let sunday = moment().clone().weekday(0).format("YYYY-MM-DD");
  let monday = moment().clone().weekday(6).format("YYYY-MM-DD");
  try {
    const res = await generalQuery("PICRevenue", {
      START_DATE: df ? sunday : fromdate,
      END_DATE: df ? monday : todate,
      IN_NHANH: in_nhanh,
    });
    if (res.data.tk_status !== "NG") {
      return res.data.data || [];
    }
    sunday = moment().clone().weekday(0).add(-7, "days").format("YYYY-MM-DD");
    monday = moment().clone().weekday(6).add(-7, "days").format("YYYY-MM-DD");
    const fallback = await generalQuery("PICRevenue", {
      START_DATE: df ? sunday : fromdate,
      END_DATE: df ? monday : todate,
    });
    if (fallback.data.tk_status !== "NG") {
      return fallback.data.data || [];
    }
  } catch (err) {
    console.error(err);
  }
  return [];
};

// Re-export PO & Overdue Queries từ kdReportPOQueries
export {
  queryOverdueData,
  queryPOBalanceSummary,
  queryPoOverWeek,
  queryRunningPOBalance,
  queryCustomerPoOverWeek,
} from "./kdReportPOQueries";
