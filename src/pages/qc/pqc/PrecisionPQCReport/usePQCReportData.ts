import { useState, useEffect, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import {
  DEFECT_TRENDING_DATA,
  PQC3_DATA,
  PQCSummary,
  PQC_PPM_DATA,
} from "../../interfaces/qcInterface";
import { CodeListData } from "../../../kinhdoanh/interfaces/kdInterface";
import { SaveExcel } from "../../../../api/services/excelService";

export const usePQCReportData = () => {
  const [dailyppm1, setDailyPPM1] = useState<PQC_PPM_DATA[]>([]);
  const [weeklyppm1, setWeeklyPPM1] = useState<PQC_PPM_DATA[]>([]);
  const [monthlyppm1, setMonthlyPPM1] = useState<PQC_PPM_DATA[]>([]);
  const [yearlyppm1, setYearlyPPM1] = useState<PQC_PPM_DATA[]>([]);
  const [dailyppm2, setDailyPPM2] = useState<PQC_PPM_DATA[]>([]);
  const [weeklyppm2, setWeeklyPPM2] = useState<PQC_PPM_DATA[]>([]);
  const [monthlyppm2, setMonthlyPPM2] = useState<PQC_PPM_DATA[]>([]);
  const [yearlyppm2, setYearlyPPM2] = useState<PQC_PPM_DATA[]>([]);
  const [dailyppm, setDailyPPM] = useState<PQC_PPM_DATA[]>([]);
  const [weeklyppm, setWeeklyPPM] = useState<PQC_PPM_DATA[]>([]);
  const [monthlyppm, setMonthlyPPM] = useState<PQC_PPM_DATA[]>([]);
  const [yearlyppm, setYearlyPPM] = useState<PQC_PPM_DATA[]>([]);

  const [fromdate, setFromDate] = useState(moment().add(-14, "day").format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [worstby, setWorstBy] = useState("AMOUNT");
  const [ng_type, setNg_Type] = useState("ALL");
  const [inspectSummary, setInspectSummary] = useState<PQCSummary[]>([]);
  const [dailyDefectTrendingData, setDailyDefectTrendingData] = useState<DEFECT_TRENDING_DATA[]>([]);
  const [cust_name, setCust_Name] = useState("");
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const [searchCodeArray, setSearchCodeArray] = useState<string[]>([]);
  const [pqcdatatable, setPqcDataTable] = useState<Array<PQC3_DATA>>([]);
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>({
    G_CODE: "6A00001B",
    G_NAME: "GT-I9500_SJ68-01284A",
    G_NAME_KD: "GT-I9500_SJ68-01284A",
    PROD_LAST_PRICE: 0,
    USE_YN: "N",
  });
  const [df, setDF] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handle_getDailyPPM = async (FACTORY: string, listCode: string[]) => {
    const td = moment().add(0, "day").format("YYYY-MM-DD");
    const frd = moment().add(-12, "day").format("YYYY-MM-DD");
    return generalQuery("pqcdailyppm", {
      FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    })
      .then((response: any) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC_PPM_DATA[] = response.data.data.map((element: PQC_PPM_DATA) => ({
            ...element,
            OK_LOT: element.TOTAL_LOT - element.NG_LOT,
            KPI_VALUE: (element.KPI_VALUE ?? 0) / 100,
            SETTING_DATE: moment.utc(element.SETTING_DATE).format("YYYY-MM-DD"),
          }));
          if (FACTORY === "NM1") setDailyPPM1(loadeddata);
          else if (FACTORY === "NM2") setDailyPPM2(loadeddata);
          else setDailyPPM(loadeddata);
        } else {
          if (FACTORY === "NM1") setDailyPPM1([]);
          else if (FACTORY === "NM2") setDailyPPM2([]);
          else setDailyPPM([]);
        }
      })
      .catch((err: any) => console.log(err));
  };

  const handle_getWeeklyPPM = async (FACTORY: string, listCode: string[]) => {
    const td = moment().add(0, "day").format("YYYY-MM-DD");
    const frd = moment().add(-70, "day").format("YYYY-MM-DD");
    return generalQuery("pqcweeklyppm", {
      FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    })
      .then((response: any) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC_PPM_DATA[] = response.data.data.map((element: PQC_PPM_DATA) => ({
            ...element,
            OK_LOT: element.TOTAL_LOT - element.NG_LOT,
            KPI_VALUE: (element.KPI_VALUE ?? 0) / 100,
          }));
          if (FACTORY === "NM1") setWeeklyPPM1(loadeddata);
          else if (FACTORY === "NM2") setWeeklyPPM2(loadeddata);
          else setWeeklyPPM(loadeddata);
        } else {
          if (FACTORY === "NM1") setWeeklyPPM1([]);
          else if (FACTORY === "NM2") setWeeklyPPM2([]);
          else setWeeklyPPM([]);
        }
      })
      .catch((err: any) => console.log(err));
  };

  const handle_getMonthlyPPM = async (FACTORY: string, listCode: string[]) => {
    const td = moment().add(0, "day").format("YYYY-MM-DD");
    const frd = moment().add(-365, "day").format("YYYY-MM-DD");
    return generalQuery("pqcmonthlyppm", {
      FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    })
      .then((response: any) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC_PPM_DATA[] = response.data.data.map((element: PQC_PPM_DATA) => ({
            ...element,
            OK_LOT: element.TOTAL_LOT - element.NG_LOT,
            KPI_VALUE: (element.KPI_VALUE ?? 0) / 100,
          }));
          if (FACTORY === "NM1") setMonthlyPPM1(loadeddata);
          else if (FACTORY === "NM2") setMonthlyPPM2(loadeddata);
          else setMonthlyPPM(loadeddata);
        } else {
          if (FACTORY === "NM1") setMonthlyPPM1([]);
          else if (FACTORY === "NM2") setMonthlyPPM2([]);
          else setMonthlyPPM([]);
        }
      })
      .catch((err: any) => console.log(err));
  };

  const handle_getYearlyPPM = async (FACTORY: string, listCode: string[]) => {
    const td = moment().add(0, "day").format("YYYY-MM-DD");
    const frd = moment().add(-3650, "day").format("YYYY-MM-DD");
    return generalQuery("pqcyearlyppm", {
      FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    })
      .then((response: any) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC_PPM_DATA[] = response.data.data.map((element: PQC_PPM_DATA) => ({
            ...element,
            OK_LOT: element.TOTAL_LOT - element.NG_LOT,
            KPI_VALUE: (element.KPI_VALUE ?? 0) / 100,
          }));
          if (FACTORY === "NM1") setYearlyPPM1(loadeddata);
          else if (FACTORY === "NM2") setYearlyPPM2(loadeddata);
          else setYearlyPPM(loadeddata);
        } else {
          if (FACTORY === "NM1") setYearlyPPM1([]);
          else if (FACTORY === "NM2") setYearlyPPM2([]);
          else setYearlyPPM([]);
        }
      })
      .catch((err: any) => console.log(err));
  };

  const handle_getInspectSummary = async (from_date: string, to_date: string, listCode: string[]) => {
    const td = moment().add(0, "day").format("YYYY-MM-DD");
    const frd = moment().add(-7, "day").format("YYYY-MM-DD");
    return generalQuery("getPQCSummary", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name,
    })
      .then((response: any) => {
        if (response.data.tk_status !== "NG") {
          setInspectSummary(response.data.data);
        } else {
          setInspectSummary([]);
        }
      })
      .catch((err: any) => console.log(err));
  };

  const handle_getDailyDefectTrending = async (from_date: string, to_date: string, listCode: string[]) => {
    const td = moment().add(0, "day").format("YYYY-MM-DD");
    const frd = moment().add(-14, "day").format("YYYY-MM-DD");
    return generalQuery("dailyPQCDefectTrending", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name,
    })
      .then((response: any) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: DEFECT_TRENDING_DATA[] = response.data.data.map(
            (element: DEFECT_TRENDING_DATA, index: number) => ({
              ...element,
              INSPECT_DATE: moment(element.INSPECT_DATE).format("YYYY-MM-DD"),
              id: index,
            })
          );
          setDailyDefectTrendingData(loadeddata);
        } else {
          setDailyDefectTrendingData([]);
        }
      })
      .catch((err: any) => console.log(err));
  };

  const traPQC3 = (from_date: string, to_date: string, listCode: string[]) => {
    const td = moment().add(0, "day").format("YYYY-MM-DD");
    const frd = moment().add(-7, "day").format("YYYY-MM-DD");
    return generalQuery("trapqc3data", {
      ALLTIME: false,
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      CUST_NAME: cust_name,
      PROCESS_LOT_NO: "",
      G_CODE: "",
      G_NAME: "",
      PROD_TYPE: "",
      EMPL_NAME: "",
      PROD_REQUEST_NO: "",
      ID: "",
      FACTORY: "All",
    })
      .then((response: any) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC3_DATA[] = response.data.data.map(
            (element: PQC3_DATA, index: number) => ({
              ...element,
              OCCURR_TIME: moment.utc(element.OCCURR_TIME).format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            })
          );
          setPqcDataTable(loadeddata);
        } else {
          setPqcDataTable([]);
        }
      })
      .catch((err: any) => console.log(err));
  };

  const traPQC32 = (from_date: string, to_date: string, listCode: string[]) => {
    return generalQuery("trapqc3data", {
      ALLTIME: false,
      FROM_DATE: from_date,
      TO_DATE: to_date,
      CUST_NAME: cust_name,
      PROCESS_LOT_NO: "",
      G_CODE: "",
      G_NAME: "",
      PROD_TYPE: "",
      EMPL_NAME: "",
      PROD_REQUEST_NO: "",
      ID: "",
      FACTORY: "All",
    })
      .then((response: any) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC3_DATA[] = response.data.data.map(
            (element: PQC3_DATA, index: number) => ({
              ...element,
              OCCURR_TIME: moment.utc(element.OCCURR_TIME).format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            })
          );
          setPqcDataTable(loadeddata);
        } else {
          setPqcDataTable([]);
        }
      })
      .catch((err: any) => console.log(err));
  };

  const getcodelist = (G_NAME: string) => {
    generalQuery("selectcodeList", { G_NAME })
      .then((response: any) => {
        if (response.data.tk_status !== "NG") {
          setCodeList(response.data.data);
        }
      })
      .catch((err: any) => console.log(err));
  };

  const initFunction = useCallback(async () => {
    setLoading(true);
    Swal.fire({
      title: "Đang tải báo cáo",
      text: "Đang nạp dữ liệu phân tích PQC, vui lòng đợi...",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    try {
      await Promise.all([
        handle_getDailyPPM("ALL", searchCodeArray),
        handle_getWeeklyPPM("ALL", searchCodeArray),
        handle_getMonthlyPPM("ALL", searchCodeArray),
        handle_getYearlyPPM("ALL", searchCodeArray),
        handle_getDailyDefectTrending(fromdate, todate, searchCodeArray),
        handle_getInspectSummary(fromdate, todate, searchCodeArray),
        traPQC3(fromdate, todate, searchCodeArray),
      ]);
      Swal.fire("Thông báo", "Đã load xong toàn bộ dữ liệu báo cáo", "success");
    } catch (err) {
      console.log(err);
      Swal.fire("Lỗi", "Có lỗi xảy ra khi nạp báo cáo", "error");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromdate, todate, df, cust_name, searchCodeArray]);

  const handleSelectCode = (code: CodeListData | null) => {
    setSelectedCode(code);
    if (code?.G_CODE && searchCodeArray.indexOf(code.G_CODE) === -1) {
      setSearchCodeArray([...searchCodeArray, code.G_CODE]);
    }
  };

  const handleRemoveCode = (codeToRemove: string) => {
    setSearchCodeArray(searchCodeArray.filter((c) => c !== codeToRemove));
  };

  const handleClearCodeArray = () => {
    setSearchCodeArray([]);
  };

  const handleDefectClick = (activeLabel: string) => {
    traPQC32(activeLabel, activeLabel, searchCodeArray);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Export Excel helpers
  const exportDailyPPM = () => SaveExcel(dailyppm, "PQC_DailyPPMData");
  const exportWeeklyPPM = () => SaveExcel(weeklyppm, "PQC_WeeklyPPMData");
  const exportMonthlyPPM = () => SaveExcel(monthlyppm, "PQC_MonthlyPPMData");
  const exportYearlyPPM = () => SaveExcel(yearlyppm, "PQC_YearlyPPMData");
  const exportDefectTrending = () => SaveExcel(dailyDefectTrendingData, "PQC_DefectTrending");
  const exportDailyFCost = () => SaveExcel(dailyppm, "PQC_DailyFcostData");
  const exportWeeklyFCost = () => SaveExcel(weeklyppm, "PQC_WeeklyFcostData");
  const exportMonthlyFCost = () => SaveExcel(monthlyppm, "PQC_MonthlyFcostData");
  const exportYearlyFCost = () => SaveExcel(yearlyppm, "PQC_YearlyFcostData");

  // Initial load - chỉ chạy 1 lần khi mount
  useEffect(() => {
    getcodelist("");
    initFunction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    dailyppm, weeklyppm, monthlyppm, yearlyppm,
    dailyppm1, weeklyppm1, monthlyppm1, yearlyppm1,
    dailyppm2, weeklyppm2, monthlyppm2, yearlyppm2,
    inspectSummary, dailyDefectTrendingData, pqcdatatable,
    fromdate, setFromDate, todate, setToDate,
    worstby, setWorstBy, ng_type, setNg_Type,
    cust_name, setCust_Name, codeList, searchCodeArray, selectedCode,
    df, setDF, activeTab, setActiveTab, loading,
    isFullscreen, toggleFullscreen,
    initFunction, handleSelectCode, handleRemoveCode, handleClearCodeArray,
    handleDefectClick,
    exportDailyPPM, exportWeeklyPPM, exportMonthlyPPM, exportYearlyPPM,
    exportDefectTrending,
    exportDailyFCost, exportWeeklyFCost, exportMonthlyFCost, exportYearlyFCost,
  };
};
