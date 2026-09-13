import moment from "moment";
import { generalQuery, getGlobalSetting } from "../../../../api/Api";
import { WEB_SETTING_DATA } from "../../../../api/GlobalInterface";
import { OVERDUE_DATA, RunningPOData, WeekLyPOData } from "../../interfaces/kdInterface";
import { POBalanceSummaryData, QueryParams } from "./kdReportQueries";

// Overdue Queries
export const queryOverdueData = async (
  type: "daily" | "weekly" | "monthly" | "yearly",
  { df, fromdate, todate }: QueryParams
): Promise<OVERDUE_DATA[]> => {
  const dplus =
    getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "KD_DPLUS")[0]?.CURRENT_VALUE ?? 6;
  const yesterday = moment().add(0, "day").format("YYYY-MM-DD");
  let startDate = fromdate;

  if (df) {
    if (type === "daily") startDate = moment().add(-12, "day").format("YYYY-MM-DD");
    else if (type === "weekly") startDate = moment().add(-70, "day").format("YYYY-MM-DD");
    else if (type === "monthly") startDate = moment().add(-365, "day").format("YYYY-MM-DD");
    else if (type === "yearly") startDate = moment().add(-3650, "day").format("YYYY-MM-DD");
  }

  const queryName = `${type}overduedata`;
  try {
    const res = await generalQuery(queryName, {
      START_DATE: startDate,
      END_DATE: df ? yesterday : todate,
      D_PLUS: dplus,
    });
    if (res.data.tk_status !== "NG") {
      return (res.data.data || []).map((element: OVERDUE_DATA) => ({
        ...element,
        OK_RATE: element.TOTAL_IV ? (element.OK_IV * 1.0) / element.TOTAL_IV : 0,
        DELIVERY_DATE: element.DELIVERY_DATE?.slice(0, 10),
      }));
    }
  } catch (err) {
    console.error(err);
  }
  return [];
};

// PO Balance Summary Total
export const queryPOBalanceSummary = async (): Promise<POBalanceSummaryData[]> => {
  try {
    const res = await generalQuery("traPOSummaryTotal", {});
    if (res.data.tk_status !== "NG") return res.data.data || [];
  } catch (err) {
    console.error(err);
  }
  return [];
};

// PO By Week
export const queryPoOverWeek = async ({ df, fromdate, todate, in_nhanh }: QueryParams): Promise<WeekLyPOData[]> => {
  try {
    const res = await generalQuery("kd_pooverweek", {
      FROM_DATE: df ? moment().add(-70, "day").format("YYYY-MM-DD") : fromdate,
      TO_DATE: df ? moment.utc().format("YYYY-MM-DD") : todate,
      IN_NHANH: in_nhanh,
    });
    if (res.data.tk_status !== "NG") return (res.data.data || []).reverse();
  } catch (err) {
    console.error(err);
  }
  return [];
};

// Running PO Balance
export const queryRunningPOBalance = async ({ df, todate }: QueryParams): Promise<RunningPOData[]> => {
  try {
    const res = await generalQuery("kd_runningpobalance", {
      TO_DATE: df ? moment().format("YYYY-MM-DD") : todate,
    });
    if (res.data.tk_status !== "NG") {
      const data = res.data.data || [];
      return df ? data.slice(0, 10).reverse() : data.reverse();
    }
  } catch (err) {
    console.error(err);
  }
  return [];
};

// Customer Weekly PO Qty
export const queryCustomerPoOverWeek = async ({ df, fromdate, todate, in_nhanh }: QueryParams): Promise<any[]> => {
  try {
    const res = await generalQuery("loadCustomerWeeklyPOQty", {
      FROM_DATE: df ? moment().add(-70, "day").format("YYYY-MM-DD") : fromdate,
      TO_DATE: df ? moment.utc().format("YYYY-MM-DD") : todate,
      IN_NHANH: in_nhanh,
    });
    if (res.data.tk_status !== "NG") return (res.data.data || []).reverse();
  } catch (err) {
    console.error(err);
  }
  return [];
};
