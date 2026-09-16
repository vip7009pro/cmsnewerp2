import { useEffect, useState, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { getCompany } from "../../../../api/Api";
import { SaveExcel } from "../../../../api/services/excelService";
import {
  OQC_TREND_DATA,
  OQC_NG_BY_CUSTOMER,
  OQC_NG_BY_PRODTYPE,
  DailyPPMData,
  WeeklyPPMData,
  MonthlyPPMData,
  YearlyPPMData,
} from "../../interfaces/qcInterface";
import {
  fetchOQCNGByCustomer,
  fetchOQCNGByProdType,
  fetchOQCTrend,
  fetchInspPPM,
} from "./oqcReportApi";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

export const useOQCReportData = () => {
  const [dailyppm, setDailyPPM] = useState<OQC_TREND_DATA[]>([]);
  const [weeklyppm, setWeeklyPPM] = useState<OQC_TREND_DATA[]>([]);
  const [monthlyppm, setMonthlyPPM] = useState<OQC_TREND_DATA[]>([]);
  const [yearlyppm, setYearlyPPM] = useState<OQC_TREND_DATA[]>([]);

  const [insp_dailyppm, set_InspDailyPPM] = useState<DailyPPMData[]>([]);
  const [insp_weeklyppm, set_InspWeeklyPPM] = useState<WeeklyPPMData[]>([]);
  const [insp_monthlyppm, set_InspMonthlyPPM] = useState<MonthlyPPMData[]>([]);
  const [insp_yearlyppm, set_InspYearlyPPM] = useState<YearlyPPMData[]>([]);

  const [oqcNGByCustomer, setOQCNGByCustomer] = useState<OQC_NG_BY_CUSTOMER[]>([]);
  const [oqcNGByProdType, setOQCNGByProdType] = useState<OQC_NG_BY_PRODTYPE[]>([]);

  const [fromdate, setFromDate] = useState(moment().add(-14, "day").format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [cust_name, setCust_Name] = useState("");
  const [searchCodeArray, setSearchCodeArray] = useState<string[]>([]);
  const [df, setDF] = useState(true);
  const [ng_type, setNg_Type] = useState("ALL");

  const [activeTab, setActiveTab] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isCMS = getCompany() === "CMS";

  const initFunction = useCallback(async () => {
    setLoading(true);
    Toast.fire({
      icon: "info",
      title: "Đang tải dữ liệu báo cáo OQC...",
    });

    const queryParams = { df, fromdate, todate, cust_name, listCode: searchCodeArray };

    try {
      const [custData, prodData, dailyData, weeklyData, monthlyData, yearlyData] = await Promise.all([
        fetchOQCNGByCustomer(queryParams),
        fetchOQCNGByProdType(queryParams),
        fetchOQCTrend("dailyOQCTrendingData", 12, queryParams),
        fetchOQCTrend("weeklyOQCTrendingData", 70, queryParams),
        fetchOQCTrend("monthlyOQCTrendingData", 365, queryParams),
        fetchOQCTrend("yearlyOQCTrendingData", 3650, queryParams),
      ]);

      setOQCNGByCustomer(custData);
      setOQCNGByProdType(prodData);
      setDailyPPM(dailyData);
      setWeeklyPPM(weeklyData);
      setMonthlyPPM(monthlyData);
      setYearlyPPM(yearlyData);

      if (isCMS) {
        const [inspDaily, inspWeekly, inspMonthly, inspYearly] = await Promise.all([
          fetchInspPPM<DailyPPMData>("inspect_daily_ppm_oqc", 12, ng_type, queryParams),
          fetchInspPPM<WeeklyPPMData>("inspect_weekly_ppm_oqc", 70, ng_type, queryParams),
          fetchInspPPM<MonthlyPPMData>("inspect_monthly_ppm_oqc", 365, ng_type, queryParams),
          fetchInspPPM<YearlyPPMData>("inspect_yearly_ppm_oqc", 3650, ng_type, queryParams),
        ]);

        set_InspDailyPPM(inspDaily);
        set_InspWeeklyPPM(inspWeekly);
        set_InspMonthlyPPM(inspMonthly);
        set_InspYearlyPPM(inspYearly);
      }

      Toast.fire({
        icon: "success",
        title: "Đã nạp xong báo cáo OQC",
      });
    } catch (error) {
      console.error(error);
      Toast.fire({
        icon: "error",
        title: "Có lỗi khi tải dữ liệu báo cáo",
      });
    } finally {
      setLoading(false);
    }
  }, [df, fromdate, todate, cust_name, searchCodeArray, ng_type, isCMS]);

  useEffect(() => {
    void initFunction();
  }, [initFunction]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error(err);
      setIsFullscreen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Export functions
  const exportDailyNGRate = () => SaveExcel(dailyppm, "OQC_Daily_NGRate");
  const exportWeeklyNGRate = () => SaveExcel(weeklyppm, "OQC_Weekly_NGRate");
  const exportMonthlyNGRate = () => SaveExcel(monthlyppm, "OQC_Monthly_NGRate");
  const exportYearlyNGRate = () => SaveExcel(yearlyppm, "OQC_Yearly_NGRate");

  const exportDailyInspPPM = () => SaveExcel(insp_dailyppm, "OQC_Daily_InspPPM");
  const exportWeeklyInspPPM = () => SaveExcel(insp_weeklyppm, "OQC_Weekly_InspPPM");
  const exportMonthlyInspPPM = () => SaveExcel(insp_monthlyppm, "OQC_Monthly_InspPPM");
  const exportYearlyInspPPM = () => SaveExcel(insp_yearlyppm, "OQC_Yearly_InspPPM");

  const exportNGByCustomer = () => SaveExcel(oqcNGByCustomer, "OQC_NG_By_Customer");
  const exportNGByProdType = () => SaveExcel(oqcNGByProdType, "OQC_NG_By_ProdType");

  return {
    dailyppm,
    weeklyppm,
    monthlyppm,
    yearlyppm,
    insp_dailyppm,
    insp_weeklyppm,
    insp_monthlyppm,
    insp_yearlyppm,
    oqcNGByCustomer,
    oqcNGByProdType,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    cust_name,
    setCust_Name,
    df,
    setDF,
    ng_type,
    setNg_Type,
    searchCodeArray,
    setSearchCodeArray,
    activeTab,
    setActiveTab,
    loading,
    isFullscreen,
    toggleFullscreen,
    initFunction,
    isCMS,
    exportDailyNGRate,
    exportWeeklyNGRate,
    exportMonthlyNGRate,
    exportYearlyNGRate,
    exportDailyInspPPM,
    exportWeeklyInspPPM,
    exportMonthlyInspPPM,
    exportYearlyInspPPM,
    exportNGByCustomer,
    exportNGByProdType,
  };
};
