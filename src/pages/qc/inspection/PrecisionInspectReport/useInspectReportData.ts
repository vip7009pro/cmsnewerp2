import { useEffect, useState, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import { SaveExcel } from "../../../../api/services/excelService";
import { CodeListData } from "../../../kinhdoanh/interfaces/kdInterface";
import { PATROL_HEADER_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import {
  f_load_TREND_NGUOI_HANG_DATA_DAILY,
  f_load_TREND_NGUOI_HANG_DATA_MONTHLY,
  f_load_TREND_NGUOI_HANG_DATA_WEEKLY,
  f_load_TREND_NGUOI_HANG_DATA_YEARLY,
} from "../../../qlsx/QLSXPLAN/utils/khsxUtils";
import {
  DEFECT_TRENDING_DATA,
  DailyPPMData,
  InspectSummary,
  MonthlyPPMData,
  TREND_NGUOI_HANG_DATA,
  WeeklyPPMData,
  WorstData,
  YearlyPPMData,
} from "../../interfaces/qcInterface";
import { createFilterOptions } from "@mui/material";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

export const filterOptions1 = createFilterOptions({
  matchFrom: "any" as const,
  limit: 100,
});

export const useInspectReportData = () => {
  // PPM Data (ALL, NM1, NM2)
  const [dailyppm, setDailyPPM] = useState<DailyPPMData[]>([]);
  const [weeklyppm, setWeeklyPPM] = useState<WeeklyPPMData[]>([]);
  const [monthlyppm, setMonthlyPPM] = useState<MonthlyPPMData[]>([]);
  const [yearlyppm, setYearlyPPM] = useState<YearlyPPMData[]>([]);
  const [dailyppm1, setDailyPPM1] = useState<DailyPPMData[]>([]);
  const [weeklyppm1, setWeeklyPPM1] = useState<WeeklyPPMData[]>([]);
  const [monthlyppm1, setMonthlyPPM1] = useState<MonthlyPPMData[]>([]);
  const [yearlyppm1, setYearlyPPM1] = useState<YearlyPPMData[]>([]);
  const [dailyppm2, setDailyPPM2] = useState<DailyPPMData[]>([]);
  const [weeklyppm2, setWeeklyPPM2] = useState<WeeklyPPMData[]>([]);
  const [monthlyppm2, setMonthlyPPM2] = useState<MonthlyPPMData[]>([]);
  const [yearlyppm2, setYearlyPPM2] = useState<YearlyPPMData[]>([]);

  // F-Cost Data
  const [dailyFcostData, setDailyFcostData] = useState<InspectSummary[]>([]);
  const [weeklyFcostData, setWeeklyFcostData] = useState<InspectSummary[]>([]);
  const [monthlyFcostData, setMonthlyFcostData] = useState<InspectSummary[]>([]);
  const [annualyFcostData, setAnnualyFcostData] = useState<InspectSummary[]>([]);

  // Other Data
  const [inspectSummary, setInspectSummary] = useState<InspectSummary[]>([]);
  const [dailyDefectTrendingData, setDailyDefectTrendingData] = useState<DEFECT_TRENDING_DATA[]>([]);
  const [worstdatatable, setWorstDataTable] = useState<WorstData[]>([]);
  const [patrolheaderdata, setPatrolHeaderData] = useState<PATROL_HEADER_DATA[]>([]);

  // Nguoi Hang Data
  const [dailyNguoiHangData, setDailyNguoiHangData] = useState<TREND_NGUOI_HANG_DATA[]>([]);
  const [weeklyNguoiHangData, setWeeklyNguoiHangData] = useState<TREND_NGUOI_HANG_DATA[]>([]);
  const [monthlyNguoiHangData, setMonthlyNguoiHangData] = useState<TREND_NGUOI_HANG_DATA[]>([]);
  const [annualyNguoiHangData, setAnnualyNguoiHangData] = useState<TREND_NGUOI_HANG_DATA[]>([]);

  // Filters
  const [fromdate, setFromDate] = useState(moment().add(-14, "day").format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [worstby, setWorstBy] = useState("AMOUNT");
  const [ng_type, setNg_Type] = useState("ALL");
  const [cust_name, setCust_Name] = useState("");
  const [df, setDF] = useState(true);
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const [searchCodeArray, setSearchCodeArray] = useState<string[]>([]);
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>(null);

  // Navigation
  const [activeTab, setActiveTab] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- API Functions (preserved 100% from backup) ---
  const handle_getDailyPPM = async (FACTORY: string, listCode: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-12, "day").format("YYYY-MM-DD");
    const response = await generalQuery("inspect_daily_ppm", {
      FACTORY, FROM_DATE: df ? frd : fromdate, TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode, CUST_NAME_KD: cust_name, NG_TYPE: ng_type,
    });
    if (response.data.tk_status !== "NG") {
      const loadeddata: DailyPPMData[] = response.data.data.map((element: DailyPPMData) => ({
        ...element,
        TOTAL_PPM: ng_type === "ALL" ? element.TOTAL_PPM : ng_type === "P" ? element.PROCESS_PPM : element.MATERIAL_PPM,
        MATERIAL_PPM: ng_type === "ALL" ? element.MATERIAL_PPM : ng_type === "P" ? 0 : element.MATERIAL_PPM,
        PROCESS_PPM: ng_type === "ALL" ? element.PROCESS_PPM : ng_type === "M" ? 0 : element.PROCESS_PPM,
        INSPECT_DATE: moment.utc(element.INSPECT_DATE).format("YYYY-MM-DD"),
      }));
      if (FACTORY === "NM1") setDailyPPM1(loadeddata);
      else if (FACTORY === "NM2") setDailyPPM2(loadeddata);
      else setDailyPPM(loadeddata);
    } else { setDailyPPM([]); }
  };

  const handle_getWeeklyPPM = async (FACTORY: string, listCode: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-70, "day").format("YYYY-MM-DD");
    const response = await generalQuery("inspect_weekly_ppm", {
      FACTORY, FROM_DATE: df ? frd : fromdate, TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode, CUST_NAME_KD: cust_name, NG_TYPE: ng_type,
    });
    if (response.data.tk_status !== "NG") {
      const loadeddata: WeeklyPPMData[] = response.data.data.map((element: WeeklyPPMData) => ({
        ...element,
        TOTAL_PPM: ng_type === "ALL" ? element.TOTAL_PPM : ng_type === "P" ? element.PROCESS_PPM : element.MATERIAL_PPM,
        MATERIAL_PPM: ng_type === "ALL" ? element.MATERIAL_PPM : ng_type === "P" ? 0 : element.MATERIAL_PPM,
        PROCESS_PPM: ng_type === "ALL" ? element.PROCESS_PPM : ng_type === "M" ? 0 : element.PROCESS_PPM,
      }));
      if (FACTORY === "NM1") setWeeklyPPM1(loadeddata);
      else if (FACTORY === "NM2") setWeeklyPPM2(loadeddata);
      else setWeeklyPPM(loadeddata);
    } else { setWeeklyPPM([]); }
  };

  const handle_getMonthlyPPM = async (FACTORY: string, listCode: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-365, "day").format("YYYY-MM-DD");
    const response = await generalQuery("inspect_monthly_ppm", {
      FACTORY, FROM_DATE: df ? frd : fromdate, TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode, CUST_NAME_KD: cust_name, NG_TYPE: ng_type,
    });
    if (response.data.tk_status !== "NG") {
      const loadeddata: MonthlyPPMData[] = response.data.data.map((element: MonthlyPPMData) => ({
        ...element,
        TOTAL_PPM: ng_type === "ALL" ? element.TOTAL_PPM : ng_type === "P" ? element.PROCESS_PPM : element.MATERIAL_PPM,
        MATERIAL_PPM: ng_type === "ALL" ? element.MATERIAL_PPM : ng_type === "P" ? 0 : element.MATERIAL_PPM,
        PROCESS_PPM: ng_type === "ALL" ? element.PROCESS_PPM : ng_type === "M" ? 0 : element.PROCESS_PPM,
      }));
      if (FACTORY === "NM1") setMonthlyPPM1(loadeddata);
      else if (FACTORY === "NM2") setMonthlyPPM2(loadeddata);
      else setMonthlyPPM(loadeddata);
    } else { setMonthlyPPM([]); }
  };

  const handle_getYearlyPPM = async (FACTORY: string, listCode: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-3650, "day").format("YYYY-MM-DD");
    const response = await generalQuery("inspect_yearly_ppm", {
      FACTORY, FROM_DATE: df ? frd : fromdate, TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode, CUST_NAME_KD: cust_name, NG_TYPE: ng_type,
    });
    if (response.data.tk_status !== "NG") {
      const loadeddata: YearlyPPMData[] = response.data.data.map((element: YearlyPPMData) => ({
        ...element,
        TOTAL_PPM: ng_type === "ALL" ? element.TOTAL_PPM : ng_type === "P" ? element.PROCESS_PPM : element.MATERIAL_PPM,
        MATERIAL_PPM: ng_type === "ALL" ? element.MATERIAL_PPM : ng_type === "P" ? 0 : element.MATERIAL_PPM,
        PROCESS_PPM: ng_type === "ALL" ? element.PROCESS_PPM : ng_type === "M" ? 0 : element.PROCESS_PPM,
      }));
      if (FACTORY === "NM1") setYearlyPPM1(loadeddata);
      else if (FACTORY === "NM2") setYearlyPPM2(loadeddata);
      else setYearlyPPM(loadeddata);
    } else { setYearlyPPM([]); }
  };

  const handleGetInspectionWorst = async (listCode: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-7, "day").format("YYYY-MM-DD");
    const response = await generalQuery("getInspectionWorstTable", {
      FROM_DATE: df ? frd : fromdate, TO_DATE: df ? td : todate,
      WORSTBY: worstby, NG_TYPE: ng_type, codeArray: df ? [] : listCode, CUST_NAME_KD: cust_name,
    });
    if (response.data.tk_status !== "NG") {
      setWorstDataTable(response.data.data.map((e: WorstData, i: number) => ({
        ...e, NG_QTY: Number(e.NG_QTY), NG_AMOUNT: Number(e.NG_AMOUNT), id: i,
      })));
    } else { setWorstDataTable([]); }
  };

  const handle_getInspectSummary = async (listCode: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-7, "day").format("YYYY-MM-DD");
    const response = await generalQuery("getInspectionSummary", {
      FROM_DATE: df ? frd : fromdate, TO_DATE: df ? td : todate,
      codeArray: listCode, CUST_NAME_KD: cust_name, NG_TYPE: ng_type,
    });
    if (response.data.tk_status !== "NG") {
      setInspectSummary(response.data.data.map((e: InspectSummary) => ({
        ...e,
        T_NG_AMOUNT: e.P_NG_AMOUNT + e.M_NG_AMOUNT,
        T_NG_QTY: e.P_NG_QTY + e.M_NG_QTY,
        M_RATE: e.ISP_TT_QTY !== 0 ? Number(e.M_NG_QTY) / Number(e.ISP_TT_QTY) : 0,
        P_RATE: e.ISP_TT_QTY !== 0 ? Number(e.P_NG_QTY) / Number(e.ISP_TT_QTY) : 0,
        T_RATE: e.ISP_TT_QTY !== 0 ? (Number(e.M_NG_QTY) + Number(e.P_NG_QTY)) / Number(e.ISP_TT_QTY) : 0,
        M_A_RATE: e.ISP_TT_QTY !== 0 ? Number(e.M_NG_AMOUNT) / Number(e.ISP_TT_AMOUNT) : 0,
        P_A_RATE: e.ISP_TT_QTY !== 0 ? Number(e.P_NG_AMOUNT) / Number(e.ISP_TT_AMOUNT) : 0,
        T_A_RATE: e.ISP_TT_QTY !== 0 ? Number(e.P_NG_AMOUNT + e.M_NG_AMOUNT) / Number(e.ISP_TT_AMOUNT) : 0,
      })));
    } else { setInspectSummary([]); }
  };

  const mapFcostData = (element: InspectSummary): InspectSummary => ({
    ...element,
    INSPECT_DATE: moment(element.INSPECT_DATE).format("YYYY-MM-DD"),
    M_NG_AMOUNT: ng_type === "ALL" ? element.M_NG_AMOUNT : ng_type === "P" ? 0 : element.M_NG_AMOUNT,
    P_NG_AMOUNT: ng_type === "ALL" ? element.P_NG_AMOUNT : ng_type === "M" ? 0 : element.P_NG_AMOUNT,
    M_NG_QTY: ng_type === "ALL" ? element.M_NG_QTY : ng_type === "P" ? 0 : element.M_NG_QTY,
    P_NG_QTY: ng_type === "ALL" ? element.P_NG_QTY : ng_type === "M" ? 0 : element.P_NG_QTY,
    T_NG_AMOUNT: ng_type === "ALL" ? element.P_NG_AMOUNT + element.M_NG_AMOUNT : ng_type === "P" ? element.P_NG_AMOUNT : element.M_NG_AMOUNT,
    T_NG_QTY: ng_type === "ALL" ? element.P_NG_QTY + element.M_NG_QTY : ng_type === "P" ? element.P_NG_QTY : element.M_NG_QTY,
    M_RATE: element.ISP_TT_QTY !== 0 ? Number(element.M_NG_QTY) / Number(element.ISP_TT_QTY) : 0,
    P_RATE: element.ISP_TT_QTY !== 0 ? Number(element.P_NG_QTY) / Number(element.ISP_TT_QTY) : 0,
    T_RATE: element.ISP_TT_QTY !== 0 ? (Number(element.M_NG_QTY) + Number(element.P_NG_QTY)) / Number(element.ISP_TT_QTY) : 0,
    M_A_RATE: element.ISP_TT_QTY !== 0 ? Number(element.M_NG_AMOUNT) / Number(element.ISP_TT_AMOUNT) : 0,
    P_A_RATE: element.ISP_TT_QTY !== 0 ? Number(element.P_NG_AMOUNT) / Number(element.ISP_TT_AMOUNT) : 0,
    T_A_RATE: element.ISP_TT_QTY !== 0 ? Number(element.P_NG_AMOUNT + element.M_NG_AMOUNT) / Number(element.ISP_TT_AMOUNT) : 0,
  });

  const fetchFcost = async (api: string, dayRange: number, setter: (d: InspectSummary[]) => void, listCode: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-dayRange, "day").format("YYYY-MM-DD");
    const response = await generalQuery(api, {
      FROM_DATE: df ? frd : fromdate, TO_DATE: df ? td : todate,
      codeArray: listCode, CUST_NAME_KD: cust_name, NG_TYPE: ng_type,
    });
    if (response.data.tk_status !== "NG") {
      setter(response.data.data.map((e: InspectSummary) => mapFcostData(e)));
    } else { setter([]); }
  };

  const handle_getDailyDefectTrending = async (listCode: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-14, "day").format("YYYY-MM-DD");
    const response = await generalQuery("dailyDefectTrending", {
      FROM_DATE: df ? frd : fromdate, TO_DATE: df ? td : todate,
      codeArray: listCode, CUST_NAME_KD: cust_name, NG_TYPE: ng_type,
    });
    if (response.data.tk_status !== "NG") {
      setDailyDefectTrendingData(response.data.data.map((e: DEFECT_TRENDING_DATA, i: number) => ({
        ...e,
        ERR1: 0, ERR2: 0, ERR3: 0,
        ERR4: ng_type === "ALL" ? e.ERR4 : ng_type === "P" ? 0 : e.ERR4,
        ERR5: ng_type === "ALL" ? e.ERR5 : ng_type === "P" ? 0 : e.ERR5,
        ERR6: ng_type === "ALL" ? e.ERR6 : ng_type === "P" ? 0 : e.ERR6,
        ERR7: ng_type === "ALL" ? e.ERR7 : ng_type === "P" ? 0 : e.ERR7,
        ERR8: ng_type === "ALL" ? e.ERR8 : ng_type === "P" ? 0 : e.ERR8,
        ERR9: ng_type === "ALL" ? e.ERR9 : ng_type === "P" ? 0 : e.ERR9,
        ERR10: ng_type === "ALL" ? e.ERR10 : ng_type === "P" ? 0 : e.ERR10,
        ERR11: ng_type === "ALL" ? e.ERR11 : ng_type === "P" ? 0 : e.ERR11,
        ERR12: ng_type === "ALL" ? e.ERR12 : ng_type === "M" ? 0 : e.ERR12,
        ERR13: ng_type === "ALL" ? e.ERR13 : ng_type === "M" ? 0 : e.ERR13,
        ERR14: ng_type === "ALL" ? e.ERR14 : ng_type === "M" ? 0 : e.ERR14,
        ERR15: ng_type === "ALL" ? e.ERR15 : ng_type === "M" ? 0 : e.ERR15,
        ERR16: ng_type === "ALL" ? e.ERR16 : ng_type === "M" ? 0 : e.ERR16,
        ERR17: ng_type === "ALL" ? e.ERR17 : ng_type === "M" ? 0 : e.ERR17,
        ERR18: ng_type === "ALL" ? e.ERR18 : ng_type === "M" ? 0 : e.ERR18,
        ERR19: ng_type === "ALL" ? e.ERR19 : ng_type === "M" ? 0 : e.ERR19,
        ERR20: ng_type === "ALL" ? e.ERR20 : ng_type === "M" ? 0 : e.ERR20,
        ERR21: ng_type === "ALL" ? e.ERR21 : ng_type === "M" ? 0 : e.ERR21,
        ERR22: ng_type === "ALL" ? e.ERR22 : ng_type === "M" ? 0 : e.ERR22,
        ERR23: ng_type === "ALL" ? e.ERR23 : ng_type === "M" ? 0 : e.ERR23,
        ERR24: ng_type === "ALL" ? e.ERR24 : ng_type === "M" ? 0 : e.ERR24,
        ERR25: ng_type === "ALL" ? e.ERR25 : ng_type === "M" ? 0 : e.ERR25,
        ERR26: ng_type === "ALL" ? e.ERR26 : ng_type === "M" ? 0 : e.ERR26,
        ERR27: ng_type === "ALL" ? e.ERR27 : ng_type === "M" ? 0 : e.ERR27,
        ERR28: ng_type === "ALL" ? e.ERR28 : ng_type === "M" ? 0 : e.ERR28,
        ERR29: ng_type === "ALL" ? e.ERR29 : ng_type === "M" ? 0 : e.ERR29,
        ERR30: ng_type === "ALL" ? e.ERR30 : ng_type === "M" ? 0 : e.ERR30,
        ERR31: ng_type === "ALL" ? e.ERR31 : ng_type === "M" ? 0 : e.ERR31,
        ERR32: 0,
        INSPECT_DATE: moment(e.INSPECT_DATE).format("YYYY-MM-DD"),
        id: i,
      })));
    } else { setDailyDefectTrendingData([]); }
  };

  const fetchNguoiHang = async (loadFn: (data: any) => Promise<TREND_NGUOI_HANG_DATA[]>, dayRange: number, setter: (d: TREND_NGUOI_HANG_DATA[]) => void, listCode: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-dayRange, "day").format("YYYY-MM-DD");
    const data = {
      FROM_DATE: df ? frd : fromdate, TO_DATE: df ? td : todate,
      codeArray: listCode, CUST_NAME_KD: cust_name, NG_TYPE: ng_type,
    };
    setter(await loadFn(data));
  };

  const getPatrolHeaderData = async () => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-12, "day").format("YYYY-MM-DD");
    try {
      const response = await generalQuery("getpatrolheader", {
        FROM_DATE: df ? frd : fromdate, TO_DATE: df ? td : todate, NG_TYPE: ng_type,
      });
      if (response.data.tk_status !== "NG") {
        setPatrolHeaderData(response.data.data.map((e: PATROL_HEADER_DATA) => ({ ...e })));
      } else { setPatrolHeaderData([]); }
    } catch (err) { console.log(err); }
  };

  const getcodelist = useCallback((G_NAME: string) => {
    generalQuery("selectcodeList", { G_NAME }).then((response) => {
      if (response.data.tk_status !== "NG") setCodeList(response.data.data);
    }).catch(console.log);
  }, []);

  const initFunction = useCallback(async () => {
    setLoading(true);
    Toast.fire({ icon: "info", title: "Đang tải dữ liệu báo cáo Kiểm Tra..." });
    try {
      await Promise.all([
        handle_getDailyPPM("ALL", searchCodeArray),
        handle_getWeeklyPPM("ALL", searchCodeArray),
        handle_getMonthlyPPM("ALL", searchCodeArray),
        handle_getYearlyPPM("ALL", searchCodeArray),
        handleGetInspectionWorst(searchCodeArray),
        handle_getInspectSummary(searchCodeArray),
        fetchFcost("dailyFcost", 12, setDailyFcostData, searchCodeArray),
        fetchFcost("weeklyFcost", 70, setWeeklyFcostData, searchCodeArray),
        fetchFcost("monthlyFcost", 365, setMonthlyFcostData, searchCodeArray),
        fetchFcost("annuallyFcost", 3650, setAnnualyFcostData, searchCodeArray),
        handle_getDailyDefectTrending(searchCodeArray),
        getPatrolHeaderData(),
        fetchNguoiHang(f_load_TREND_NGUOI_HANG_DATA_DAILY, 12, setDailyNguoiHangData, searchCodeArray),
        fetchNguoiHang(f_load_TREND_NGUOI_HANG_DATA_WEEKLY, 70, setWeeklyNguoiHangData, searchCodeArray),
        fetchNguoiHang(f_load_TREND_NGUOI_HANG_DATA_MONTHLY, 365, setMonthlyNguoiHangData, searchCodeArray),
        fetchNguoiHang(f_load_TREND_NGUOI_HANG_DATA_YEARLY, 3650, setAnnualyNguoiHangData, searchCodeArray),
      ]);
      Toast.fire({ icon: "success", title: "Đã nạp xong báo cáo Kiểm Tra" });
    } catch (err) {
      console.error(err);
      Toast.fire({ icon: "error", title: "Có lỗi khi tải dữ liệu báo cáo" });
    } finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [df, fromdate, todate, cust_name, searchCodeArray, ng_type, worstby]);

  useEffect(() => { getcodelist(""); void initFunction(); }, []);

  // Fullscreen API
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) { console.error(err); setIsFullscreen((p) => !p); }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Code selection handler
  const handleSelectCode = useCallback((newValue: CodeListData | null) => {
    setSelectedCode(newValue);
    if (newValue && searchCodeArray.indexOf(newValue.G_CODE) === -1) {
      setSearchCodeArray((prev) => [...prev, newValue.G_CODE]);
    }
  }, [searchCodeArray]);

  const handleRemoveCode = useCallback((code: string) => {
    setSearchCodeArray((prev) => prev.filter((c) => c !== code));
  }, []);

  const handleClearCodes = useCallback(() => { setSearchCodeArray([]); }, []);

  // Export Excel functions
  const exportDailyFcost = () => SaveExcel(dailyFcostData, "DailyFcostData");
  const exportWeeklyFcost = () => SaveExcel(weeklyFcostData, "WeeklyFcostData");
  const exportMonthlyFcost = () => SaveExcel(monthlyFcostData, "MonthFcostData");
  const exportYearlyFcost = () => SaveExcel(annualyFcostData, "YearlyFcostData");
  const exportDailyNguoiHang = () => SaveExcel(dailyNguoiHangData, "DailyNguoiHangData");
  const exportWeeklyNguoiHang = () => SaveExcel(weeklyNguoiHangData, "WeeklyNguoiHangData");
  const exportMonthlyNguoiHang = () => SaveExcel(monthlyNguoiHangData, "MonthNguoiHangData");
  const exportYearlyNguoiHang = () => SaveExcel(annualyNguoiHangData, "YearlyNguoiHangData");
  const exportDefectTrending = () => SaveExcel(dailyDefectTrendingData, "DefectTrending");

  return {
    dailyppm, weeklyppm, monthlyppm, yearlyppm,
    dailyppm1, weeklyppm1, monthlyppm1, yearlyppm1,
    dailyppm2, weeklyppm2, monthlyppm2, yearlyppm2,
    dailyFcostData, weeklyFcostData, monthlyFcostData, annualyFcostData,
    inspectSummary, dailyDefectTrendingData, worstdatatable, patrolheaderdata,
    dailyNguoiHangData, weeklyNguoiHangData, monthlyNguoiHangData, annualyNguoiHangData,
    fromdate, setFromDate, todate, setToDate,
    worstby, setWorstBy, ng_type, setNg_Type,
    cust_name, setCust_Name, df, setDF,
    codeList, searchCodeArray, selectedCode,
    activeTab, setActiveTab, loading, isFullscreen,
    toggleFullscreen, initFunction,
    handleSelectCode, handleRemoveCode, handleClearCodes,
    exportDailyFcost, exportWeeklyFcost, exportMonthlyFcost, exportYearlyFcost,
    exportDailyNguoiHang, exportWeeklyNguoiHang, exportMonthlyNguoiHang, exportYearlyNguoiHang,
    exportDefectTrending,
  };
};
