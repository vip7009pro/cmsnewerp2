import { useState, useEffect, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { MACHINE_LIST } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { f_getMachineListData } from "../../../qlsx/QLSXPLAN/utils/khsxUtils";
import {
  usehandle_loadYCSX_GAP_RATE_DATA,
  usehandle_loadSX_GAP_RATE_DATA,
  usehandle_loadKT_GAP_RATE_DATA,
  usehandle_loadALL_GAP_RATE_DATA,
  usehandle_loadALL_HOAN_THANH_TRUOC_HAN_RATE_DATA,
  usehandle_loadALL_HOAN_THANH_TRUOC_HAN_RATE_DATA2,
  usehandle_loadYCSX_GAP_RATE_BACKDATA,
  usehandle_loadSX_GAP_RATE_BACKDATA,
  usehandle_loadKT_GAP_RATE_BACKDATA,
  usehandle_loadALL_GAP_RATE_BACKDATA,
  usehandle_loadALL_HOAN_THANH_TRUOC_HAN_RATE_BACKDATA,
  usehandle_loadALL_HOAN_THANH_TRUOC_HAN_RATE_BACKDATA2,
  usehandle_load_SX_Daily_Loss_Trend,
  usehandle_load_SX_Weekly_Loss_Trend,
  usehandle_load_SX_Monthly_Loss_Trend,
  usehandle_load_SX_Yearly_Loss_Trend,
  usehandle_getDailyAchiveData,
  usehandle_getWeeklyAchiveData,
  usehandle_getMonthlyAchiveData,
  usehandle_getYearlyAchiveData,
  usehandle_getDailyEffData,
  usehandle_getWeeklyEffData,
  usehandle_getMonthlyEffData,
  usehandle_getYearlyEffData,
  usehandle_getPlanLossData,
  usehandle_getSXLossTimeByEmpl,
  usehandle_getSXLossTimeByReason,
} from "../hooks/BAOCAOSX_HOOKS";

export type SxReportTabType = "all" | "loss" | "achive" | "eff" | "leadtime";

export const useSxReportData = () => {
  const [activeTab, setActiveTab] = useState<SxReportTabType>("all");
  const [machineList, setMachineList] = useState<MACHINE_LIST[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<string>("ALL");

  const [fromdate, setFromDate] = useState(moment().add(-12, "day").format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [cust_name, setCust_Name] = useState("");
  const [searchCodeArray, setSearchCodeArray] = useState<string[]>([]);
  const [df, setDF] = useState(true);

  // GAP Rates
  const { data: ycgapData, triggerFetch: ycgapTriggerFetch } = usehandle_loadYCSX_GAP_RATE_DATA(fromdate, todate, df);
  const { data: sxgapData, triggerFetch: sxgapTriggerFetch } = usehandle_loadSX_GAP_RATE_DATA(fromdate, todate, df);
  const { data: ktgapData, triggerFetch: ktgapTriggerFetch } = usehandle_loadKT_GAP_RATE_DATA(fromdate, todate, df);
  const { data: allgapData, triggerFetch: allgapTriggerFetch } = usehandle_loadALL_GAP_RATE_DATA(fromdate, todate, df);
  const { data: allhoanthanhtruochanrateData, triggerFetch: allhoanthanhtruochanrateTriggerFetch } = usehandle_loadALL_HOAN_THANH_TRUOC_HAN_RATE_DATA(fromdate, todate, df);
  const { data: allhoanthanhtruochanrateData2, triggerFetch: allhoanthanhtruochanrateTriggerFetch2 } = usehandle_loadALL_HOAN_THANH_TRUOC_HAN_RATE_DATA2(fromdate, todate, df);

  const { data: ycsxgapbackData, triggerFetch: ycsxgapbackTriggerFetch } = usehandle_loadYCSX_GAP_RATE_BACKDATA(fromdate, todate, df);
  const { data: sxgapbackData, triggerFetch: sxgapbackTriggerFetch } = usehandle_loadSX_GAP_RATE_BACKDATA(fromdate, todate, df);
  const { data: ktgapbackData, triggerFetch: ktgapbackTriggerFetch } = usehandle_loadKT_GAP_RATE_BACKDATA(fromdate, todate, df);
  const { data: allgapbackData, triggerFetch: allgapbackTriggerFetch } = usehandle_loadALL_GAP_RATE_BACKDATA(fromdate, todate, df);
  const { data: allhoanthanhtruochanratebackData, triggerFetch: allhoanthanhtruochanratebackTriggerFetch } = usehandle_loadALL_HOAN_THANH_TRUOC_HAN_RATE_BACKDATA(fromdate, todate, df);
  const { data: allhoanthanhtruochanratebackData2, triggerFetch: allhoanthanhtruochanratebackTriggerFetch2 } = usehandle_loadALL_HOAN_THANH_TRUOC_HAN_RATE_BACKDATA2(fromdate, todate, df);

  // Loss Trends
  const { data: sxdailylosstrendData, triggerFetch: sxdailylosstrendTriggerFetch } = usehandle_load_SX_Daily_Loss_Trend(fromdate, todate, df);
  const { data: sxweeklylosstrendData, triggerFetch: sxweeklylosstrendTriggerFetch } = usehandle_load_SX_Weekly_Loss_Trend(fromdate, todate, df);
  const { data: sxmonthlylosstrendData, triggerFetch: sxmonthlylosstrendTriggerFetch } = usehandle_load_SX_Monthly_Loss_Trend(fromdate, todate, df);
  const { data: sxyearlylosstrendData, triggerFetch: sxyearlylosstrendTriggerFetch } = usehandle_load_SX_Yearly_Loss_Trend(fromdate, todate, df);

  // Achievement Trends
  const { data: sxdailyachiveData, triggerFetch: sxdailyachiveTriggerFetch } = usehandle_getDailyAchiveData(fromdate, todate, df);
  const { data: sxweeklyachiveData, triggerFetch: sxweeklyachiveTriggerFetch } = usehandle_getWeeklyAchiveData(fromdate, todate, df);
  const { data: sxmonthlyachiveData, triggerFetch: sxmonthlyachiveTriggerFetch } = usehandle_getMonthlyAchiveData(fromdate, todate, df);
  const { data: sxyearlyachiveData, triggerFetch: sxyearlyachiveTriggerFetch } = usehandle_getYearlyAchiveData(fromdate, todate, df);

  // Efficiency Trends & Overview
  const { data: sxdailyeffData, overview: sxEffOverview, triggerFetch: sxdailyeffTriggerFetch } = usehandle_getDailyEffData(fromdate, todate, df);
  const { data: sxweeklyeffData, triggerFetch: sxweeklyeffTriggerFetch } = usehandle_getWeeklyEffData(fromdate, todate, df);
  const { data: sxmonthlyeffData, triggerFetch: sxmonthlyeffTriggerFetch } = usehandle_getMonthlyEffData(fromdate, todate, df);
  const { data: sxyearlyeffData, triggerFetch: sxyearlyeffTriggerFetch } = usehandle_getYearlyEffData(fromdate, todate, df);

  // Plan Loss & Loss Time Details
  const { data: planLossData, triggerFetch: planLossTriggerFetch } = usehandle_getPlanLossData(fromdate, todate, df);
  const { data: sxlosstimebyemplData, triggerFetch: sxlosstimebyemplTriggerFetch } = usehandle_getSXLossTimeByEmpl(fromdate, todate, df);
  const { data: sxlosstimebyreasonData, triggerFetch: sxlosstimebyreasonTriggerFetch } = usehandle_getSXLossTimeByReason(fromdate, todate, df);

  const handle_getMachineList = async () => {
    try {
      const list = await f_getMachineListData();
      setMachineList(list || []);
    } catch (e) {
      console.error("Lỗi nạp danh sách máy:", e);
    }
  };

  const initFunction = useCallback(async () => {
    Swal.fire({
      title: "Đang tải báo cáo",
      text: "Đang đồng bộ dữ liệu sản xuất, vui lòng chờ...",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    try {
      await Promise.all([
        sxdailylosstrendTriggerFetch(),
        sxweeklylosstrendTriggerFetch(),
        sxmonthlylosstrendTriggerFetch(),
        sxyearlylosstrendTriggerFetch(),
        sxdailyachiveTriggerFetch(),
        sxweeklyachiveTriggerFetch(),
        sxmonthlyachiveTriggerFetch(),
        sxyearlyachiveTriggerFetch(),
        sxdailyeffTriggerFetch(),
        sxweeklyeffTriggerFetch(),
        sxmonthlyeffTriggerFetch(),
        sxyearlyeffTriggerFetch(),
        planLossTriggerFetch(),
        sxlosstimebyemplTriggerFetch(),
        sxlosstimebyreasonTriggerFetch(),
        ycgapTriggerFetch(),
        sxgapTriggerFetch(),
        ktgapTriggerFetch(),
        allgapTriggerFetch(),
        ycsxgapbackTriggerFetch(),
        sxgapbackTriggerFetch(),
        ktgapbackTriggerFetch(),
        allgapbackTriggerFetch(),
        allhoanthanhtruochanratebackTriggerFetch(),
        allhoanthanhtruochanrateTriggerFetch(),
        allhoanthanhtruochanrateTriggerFetch2(),
        allhoanthanhtruochanratebackTriggerFetch2(),
      ]);
      Swal.close();
    } catch (err) {
      console.error("Lỗi nạp báo cáo:", err);
      Swal.fire("Lỗi", "Không thể nạp toàn bộ báo cáo!", "error");
    }
  }, [
    sxdailylosstrendTriggerFetch,
    sxweeklylosstrendTriggerFetch,
    sxmonthlylosstrendTriggerFetch,
    sxyearlylosstrendTriggerFetch,
    sxdailyachiveTriggerFetch,
    sxweeklyachiveTriggerFetch,
    sxmonthlyachiveTriggerFetch,
    sxyearlyachiveTriggerFetch,
    sxdailyeffTriggerFetch,
    sxweeklyeffTriggerFetch,
    sxmonthlyeffTriggerFetch,
    sxyearlyeffTriggerFetch,
    planLossTriggerFetch,
    sxlosstimebyemplTriggerFetch,
    sxlosstimebyreasonTriggerFetch,
    ycgapTriggerFetch,
    sxgapTriggerFetch,
    ktgapTriggerFetch,
    allgapTriggerFetch,
    ycsxgapbackTriggerFetch,
    sxgapbackTriggerFetch,
    ktgapbackTriggerFetch,
    allgapbackTriggerFetch,
    allhoanthanhtruochanratebackTriggerFetch,
    allhoanthanhtruochanrateTriggerFetch,
    allhoanthanhtruochanrateTriggerFetch2,
    allhoanthanhtruochanratebackTriggerFetch2,
  ]);

  const handleQuickDateRange = (days: number) => {
    setDF(false);
    setFromDate(moment().subtract(days, "days").format("YYYY-MM-DD"));
    setToDate(moment().format("YYYY-MM-DD"));
  };

  const handleYearToDate = () => {
    setDF(false);
    setFromDate(moment().startOf("year").format("YYYY-MM-DD"));
    setToDate(moment().format("YYYY-MM-DD"));
  };

  useEffect(() => {
    handle_getMachineList();
    initFunction();
  }, []);

  return {
    activeTab,
    setActiveTab,
    machineList,
    selectedMachine,
    setSelectedMachine,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    cust_name,
    setCust_Name,
    searchCodeArray,
    setSearchCodeArray,
    df,
    setDF,
    initFunction,
    handleQuickDateRange,
    handleYearToDate,
    planLossTriggerFetch,

    // Dữ liệu Loss
    sxdailylosstrendData,
    sxweeklylosstrendData,
    sxmonthlylosstrendData,
    sxyearlylosstrendData,
    planLossData,

    // Dữ liệu Achive
    sxdailyachiveData,
    sxweeklyachiveData,
    sxmonthlyachiveData,
    sxyearlyachiveData,

    // Dữ liệu Eff
    sxdailyeffData,
    sxEffOverview,
    sxweeklyeffData,
    sxmonthlyeffData,
    sxyearlyeffData,

    // Dữ liệu Loss time & Lead time
    sxlosstimebyreasonData,
    sxlosstimebyemplData,
    ycgapData,
    ycsxgapbackData,
    sxgapData,
    sxgapbackData,
    ktgapData,
    ktgapbackData,
    allgapData,
    allgapbackData,
    allhoanthanhtruochanrateData,
    allhoanthanhtruochanratebackData,
    allhoanthanhtruochanrateData2,
    allhoanthanhtruochanratebackData2,
  };
};
