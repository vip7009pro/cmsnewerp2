import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
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
import {
  DailyClosingData,
  FCSTAmountData,
  WidgetData_POBalanceSummary,
  YearlyClosingData,
  queryCustomerPoOverWeek,
  queryCustomerRevenue,
  queryDailyClosing,
  queryFCSTAmount,
  queryMonthlyClosing,
  queryOverdueData,
  queryPICRevenue,
  queryPOBalanceSummary,
  queryPoOverWeek,
  queryRunningPOBalance,
  queryWeeklyClosing,
  queryYearlyClosing,
} from "./kdReportQueries";
import { buildKDClosingColumns } from "./precisionKDColumns";

export const useKDReportData = () => {
  const [in_nhanh, setInNhanh] = useState<boolean>(false);
  const [df, setDF] = useState<boolean>(true);
  const [fromdate, setFromDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [selectedYW, setSelectedYW] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<string>("summary");

  const [widgetdata_yesterday, setWidgetData_Yesterday] = useState<DailyClosingData[]>([]);
  const [widgetdata_thisweek, setWidgetData_ThisWeek] = useState<WeeklyClosingData[]>([]);
  const [widgetdata_thismonth, setWidgetData_ThisMonth] = useState<MonthlyClosingData[]>([]);
  const [widgetdata_thisyear, setWidgetData_ThisYear] = useState<YearlyClosingData[]>([]);
  const [customerRevenue, setCustomerRevenue] = useState<CUSTOMER_REVENUE_DATA[]>([]);
  const [monthlyvRevenuebyCustomer, setMonthlyvRevenuebyCustomer] = useState<any[]>([]);
  const [picRevenue, setPICRevenue] = useState<PIC_REVENUE_DATA[]>([]);
  const [dailyClosingData, setDailyClosingData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [weeklyClosingData, setWeeklyClosingData] = useState<any[]>([]);
  const [columnsweek, setColumnsWeek] = useState<any[]>([]);
  const [columnsmonth, setColumnsMonth] = useState<any[]>([]);
  const [runningPOData, setWeekLyPOData] = useState<WeekLyPOData[]>([]);
  const [customerNewPOByWeek, setCustomerNewPOByWeek] = useState<any[]>([]);
  const [runningPOBalanceData, setRunningPOBalanceData] = useState<RunningPOData[]>([]);
  const [widgetdata_pobalancesummary, setWidgetData_PoBalanceSummary] = useState<WidgetData_POBalanceSummary>({
    po_balance_qty: 0,
    po_balance_amount: 0,
  });
  const [widgetdata_fcstAmount, setWidgetData_FcstAmount] = useState<FCSTAmountData>({
    FCSTYEAR: 0,
    FCSTWEEKNO: 1,
    FCST4W_QTY: 0,
    FCST4W_AMOUNT: 0,
    FCST8W_QTY: 0,
    FCST8W_AMOUNT: 0,
  });
  const [dailyOverdueData, setDailyOverdueData] = useState<OVERDUE_DATA[]>([]);
  const [weeklyOverdueData, setweeklyOverdueData] = useState<OVERDUE_DATA[]>([]);
  const [monthlyOverdueData, setmonthyOverdueData] = useState<OVERDUE_DATA[]>([]);
  const [yearlyOverdueData, setyearlyOverdueData] = useState<OVERDUE_DATA[]>([]);
  const [pobalanceDetail, setPoBalanceDetail] = useState<PO_BALANCE_DETAIL[]>([]);
  const [pobalanceSummary, setPoBalanceSummary] = useState<PO_BALANCE_SUMMARY[]>([]);
  const [pobalanceCustomer, setPoBalanceCustomer] = useState<PO_BALANCE_CUSTOMER[]>([]);
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);

  // Tải danh sách khách hàng
  const getcustomerlist = useCallback(async () => {
    try {
      const res = await generalQuery("selectcustomerList", {});
      if (res.data.tk_status !== "NG") return res.data.data || [];
    } catch (err) {
      console.error(err);
    }
    return [];
  }, []);

  // Bảng Daily Closing KD
  const loadDailyClosing = useCallback(async () => {
    try {
      const res = await generalQuery("getDailyClosingKD", {
        FROM_DATE: df ? moment.utc().format("YYYY-MM-01") : fromdate,
        TO_DATE: df ? moment.utc().format("YYYY-MM-DD") : todate,
        IN_NHANH: in_nhanh,
      });
      if (res.data.tk_status !== "NG") {
        return (res.data.data || []).map((el: any, i: number) => ({ ...el, id: i }));
      }
    } catch (err) {
      console.error(err);
    }
    return [];
  }, [df, fromdate, todate, in_nhanh]);

  // Bảng Weekly Closing KD
  const loadWeeklyClosing = useCallback(async () => {
    try {
      const res = await generalQuery("getWeeklyClosingKD", {
        FROM_DATE: df ? moment.utc().format("YYYY-MM-01") : fromdate,
        TO_DATE: df ? moment.utc().format("YYYY-MM-DD") : todate,
        IN_NHANH: in_nhanh,
      });
      if (res.data.tk_status !== "NG") {
        return (res.data.data || []).map((el: any, i: number) => ({ ...el, id: i }));
      }
    } catch (err) {
      console.error(err);
    }
    return [];
  }, [df, fromdate, todate, in_nhanh]);

  // Bảng Monthly Revenue By Customer
  const loadMonthlyRevenueByCustomer = useCallback(async () => {
    const queryName = getCompany() === "CMS" ? "loadMonthlyRevenueByCustomer" : "baocaodanhthutheokhachtheonguoimonthly";
    try {
      const res = await generalQuery(queryName, {
        FROM_DATE: df ? moment.utc().format("YYYY-01-01") : fromdate,
        TO_DATE: df ? moment.utc().format("YYYY-MM-DD") : todate,
        IN_NHANH: in_nhanh,
      });
      if (res.data.tk_status !== "NG") {
        return (res.data.data || []).map((el: any, i: number) => ({ ...el, id: i }));
      }
    } catch (err) {
      console.error(err);
    }
    return [];
  }, [df, fromdate, todate, in_nhanh]);

  // Nạp toàn bộ dữ liệu song song (22 queries)
  const initFunction = useCallback(async () => {
    Swal.fire({
      title: "Đang tải báo cáo",
      text: "Đang tải toàn bộ dữ liệu kinh doanh, vui lòng đợi...",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });

    const qParams = { df, fromdate, todate, in_nhanh };
    try {
      const values = await Promise.all([
        getcustomerlist(),
        queryDailyClosing(qParams),
        queryWeeklyClosing(qParams),
        queryMonthlyClosing(qParams),
        queryYearlyClosing(qParams),
        loadDailyClosing(),
        loadWeeklyClosing(),
        queryOverdueData("daily", qParams),
        queryOverdueData("weekly", qParams),
        queryOverdueData("monthly", qParams),
        queryOverdueData("yearly", qParams),
        queryPoOverWeek(qParams),
        queryRunningPOBalance(qParams),
        queryCustomerRevenue(qParams),
        queryPICRevenue(qParams),
        queryPOBalanceSummary(),
        queryFCSTAmount(),
        loadMonthlyRevenueByCustomer(),
        f_load_PO_BALANCE_SUMMARY({ FROM_DATE: df ? moment().add(-70, "day").format("YYYY-MM-DD") : fromdate, TO_DATE: df ? moment.utc().format("YYYY-MM-DD") : todate, IN_NHANH: in_nhanh }),
        f_load_PO_BALANCE_DETAIL({ FROM_DATE: df ? moment().add(-70, "day").format("YYYY-MM-DD") : fromdate, TO_DATE: df ? moment.utc().format("YYYY-MM-DD") : todate, IN_NHANH: in_nhanh }),
        f_load_PO_BALANCE_CUSTOMER_BY_YEAR({ FROM_DATE: df ? moment().add(-70, "day").format("YYYY-MM-DD") : fromdate, TO_DATE: df ? moment.utc().format("YYYY-MM-DD") : todate, IN_NHANH: in_nhanh }),
        queryCustomerPoOverWeek(qParams),
      ]);

      if (values) {
        setCustomerList(values[0] || []);
        setWidgetData_Yesterday(values[1] || []);
        setWidgetData_ThisWeek(values[2] || []);
        setWidgetData_ThisMonth(values[3] || []);
        setWidgetData_ThisYear(values[4] || []);

        const dailyRows = values[5] || [];
        setDailyClosingData(dailyRows);
        setColumns(buildKDClosingColumns(dailyRows));

        const weeklyRows = values[6] || [];
        setWeeklyClosingData(weeklyRows);
        setColumnsWeek(buildKDClosingColumns(weeklyRows, true));

        setDailyOverdueData(values[7] || []);
        setweeklyOverdueData(values[8] || []);
        setmonthyOverdueData(values[9] || []);
        setyearlyOverdueData(values[10] || []);
        setWeekLyPOData(values[11] || []);
        setRunningPOBalanceData(values[12] || []);
        setCustomerRevenue(values[13] || []);
        setPICRevenue(values[14] || []);

        if (values[15]?.[0]) {
          setWidgetData_PoBalanceSummary({
            po_balance_qty: values[15][0].PO_BALANCE,
            po_balance_amount: values[15][0].BALANCE_AMOUNT,
          });
        }
        if (values[16]?.[0]) {
          setWidgetData_FcstAmount(values[16][0]);
        }

        const monthRows = values[17] || [];
        setMonthlyvRevenuebyCustomer(monthRows);
        setColumnsMonth(buildKDClosingColumns(monthRows));

        const summaryYears = values[18] || [];
        setPoBalanceSummary(summaryYears);

        // Tự động xác định năm mới nhất (năm lớn nhất) từ danh sách tồn đơn PO theo năm
        let targetYear = moment().year();
        const validYears = summaryYears
          .map((item: any) => Number(item.PO_YEAR))
          .filter((y: number) => !isNaN(y) && y > 2000)
          .sort((a: number, b: number) => b - a);

        if (validYears.length > 0) {
          targetYear = validYears[0];
        }
        setSelectedYW(`Y${targetYear}`);

        try {
          let detailData = await f_load_PO_BALANCE_DETAIL({ PO_YEAR: targetYear });
          let custData = await f_load_PO_BALANCE_CUSTOMER_BY_YEAR({ PO_YEAR: targetYear });

          // Nếu năm mới nhất không có chi tiết tuần mà còn các năm trước trong danh sách, tự động fallback về năm gần nhất có dữ liệu
          if ((!detailData || detailData.length === 0) && validYears.length > 1) {
            for (let i = 1; i < validYears.length; i++) {
              const fallbackYear = validYears[i];
              const fbDetail = await f_load_PO_BALANCE_DETAIL({ PO_YEAR: fallbackYear });
              if (fbDetail && fbDetail.length > 0) {
                targetYear = fallbackYear;
                detailData = fbDetail;
                custData = await f_load_PO_BALANCE_CUSTOMER_BY_YEAR({ PO_YEAR: fallbackYear });
                setSelectedYW(`Y${targetYear}`);
                break;
              }
            }
          }

          setPoBalanceDetail(detailData || []);
          setPoBalanceCustomer(custData || []);
        } catch (detailErr) {
          console.error("Lỗi nạp chi tiết PO Balance:", detailErr);
          setPoBalanceDetail(values[19] || []);
          setPoBalanceCustomer(values[20] || []);
        }

        setCustomerNewPOByWeek(values[21] || []);
      }
    } catch (err) {
      console.error("Lỗi nạp báo cáo kinh doanh:", err);
    } finally {
      Swal.close();
    }
  }, [df, fromdate, todate, in_nhanh, getcustomerlist, loadDailyClosing, loadWeeklyClosing, loadMonthlyRevenueByCustomer]);

  // Click chọn Năm trên biểu đồ PO Balance
  const handleSelectPOYear = useCallback(async (e: any) => {
    const poYear = e?.activePayload?.[0]?.payload?.PO_YEAR;
    if (!poYear) return;
    setSelectedYW(`Y${poYear}`);
    setPoBalanceDetail(await f_load_PO_BALANCE_DETAIL({ PO_YEAR: poYear }));
    setPoBalanceCustomer(await f_load_PO_BALANCE_CUSTOMER_BY_YEAR({ PO_YEAR: poYear }));
  }, []);

  // Click chọn Tuần trên biểu đồ PO Balance
  const handleSelectPOWeek = useCallback(async (e: any) => {
    const poYear = e?.activePayload?.[0]?.payload?.PO_YEAR;
    const poWeek = e?.activePayload?.[0]?.payload?.PO_WEEK;
    if (!poYear || !poWeek) return;
    setSelectedYW(`Y${poYear}-W${poWeek}`);
    setPoBalanceCustomer(await f_load_PO_BALANCE_CUSTOMER({ PO_YEAR: poYear, PO_WEEK: poWeek }));
  }, []);

  useEffect(() => {
    initFunction();
  }, []);

  return {
    df, setDF,
    fromdate, setFromDate,
    todate, setToDate,
    in_nhanh, setInNhanh,
    selectedYW,
    activeTab, setActiveTab,
    widgetdata_yesterday,
    widgetdata_thisweek,
    widgetdata_thismonth,
    widgetdata_thisyear,
    customerRevenue,
    monthlyvRevenuebyCustomer,
    picRevenue,
    dailyClosingData,
    columns,
    weeklyClosingData,
    columnsweek,
    columnsmonth,
    runningPOData,
    customerNewPOByWeek,
    runningPOBalanceData,
    widgetdata_pobalancesummary,
    widgetdata_fcstAmount,
    dailyOverdueData,
    weeklyOverdueData,
    monthlyOverdueData,
    yearlyOverdueData,
    pobalanceDetail,
    pobalanceSummary,
    pobalanceCustomer,
    customerList,
    initFunction,
    handleSelectPOYear,
    handleSelectPOWeek,
  };
};
