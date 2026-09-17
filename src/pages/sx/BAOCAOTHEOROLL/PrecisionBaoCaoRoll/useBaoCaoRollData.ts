import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import { SaveExcel } from "../../../../api/services/excelService";
import {
  MACHINE_LIST,
  SX_BAOCAOROLLDATA,
  SX_LOSS_TREND_DATA,
  SX_TREND_LOSS_DATA,
} from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { f_getMachineListData } from "../../../qlsx/QLSXPLAN/utils/khsxUtils";

const EMPTY_SUMMARY: SX_BAOCAOROLLDATA = {
  id: -1, PHANLOAI: "MASS", EQUIPMENT_CD: "TOTAL", PROD_REQUEST_NO: "TOTAL",
  PLAN_ID: "TOTAL", PLAN_QTY: 0, SX_RESULT: 0, ACHIVEMENT_RATE: 0,
  PROD_MODEL: "TOTAL", G_NAME_KD: "TOTAL", M_LOT_NO: "TOTAL", M_NAME: "TOTAL",
  WIDTH_CD: 0, INPUT_QTY: 0, REMAIN_QTY: 0, USED_QTY: 0, RPM: 0,
  SETTING_MET: 0, PR_NG: 0, OK_MET_AUTO: 0, OK_MET_TT: 0,
  LOSS_ST: 0, LOSS_SX: 0, LOSS_TT: 0, LOSS_TT_KT: 0,
  OK_EA: 0, OUTPUT_EA: 0, INSPECT_INPUT: 0, INSPECT_TT_QTY: 0,
  INSPECT_OK_QTY: 0, INSPECT_OK_SQM: 0, TT_LOSS_SQM: 0, REMARK: "",
  PD: 0, CAVITY: 0, STEP: 0, PR_NB: 0, MAX_PROCESS_NUMBER: 0,
  LAST_PROCESS: 0, INPUT_DATE: "TOTAL", IS_SETTING: "Y",
  LOSS_SQM: 0, USED_SQM: 0, PURE_INPUT: 0, PURE_OUTPUT: 0,
  INSPECT_COMPLETED_DATE: "",
};

export const useBaoCaoRollData = () => {
  const dataGridRef = useRef<any>(null);
  const datatbTotalRow = useRef(0);
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const [fromdate, setFromDate] = useState(moment().add(-8, "day").format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [factory, setFactory] = useState("ALL");
  const [machine, setMachine] = useState("ALL");
  const [plandatatable, setPlanDataTable] = useState<SX_BAOCAOROLLDATA[]>([]);
  const [summarydata, setSummaryData] = useState<SX_BAOCAOROLLDATA>({ ...EMPTY_SUMMARY });
  const qlsxplandatafilter = useRef<SX_BAOCAOROLLDATA[]>([]);
  const [sxlosstrendingdata, setSXLossTrendingData] = useState<SX_LOSS_TREND_DATA[]>([]);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [dailyLossTrend, setDailyLossTrend] = useState<SX_TREND_LOSS_DATA[]>([]);
  const [weeklyLossTrend, setWeeklyLossTrend] = useState<SX_TREND_LOSS_DATA[]>([]);
  const [monthyLossTrend, setMonthlyLossTrend] = useState<SX_TREND_LOSS_DATA[]>([]);
  const [yearlyLossTrend, setYearlyLossTrend] = useState<SX_TREND_LOSS_DATA[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  const clearSelection = useCallback(() => {
    if (dataGridRef.current) {
      dataGridRef.current.instance.clearSelection();
      qlsxplandatafilter.current = [];
    }
  }, []);

  const getMachineList = useCallback(async () => {
    setMachine_List(await f_getMachineListData());
  }, []);

  const loadBaoCaoTheoRoll = useCallback(async () => {
    await generalQuery("loadBaoCaoTheoRoll", {
      FROM_DATE: fromdate, TO_DATE: todate, MACHINE: machine, FACTORY: factory,
    }).then((response) => {
      if (response.data.tk_status !== "NG") {
        const loadeddata: SX_BAOCAOROLLDATA[] = response.data.data.map(
          (element: SX_BAOCAOROLLDATA, index: number) => ({
            ...element,
            INPUT_DATE: moment(element.INPUT_DATE).format("YYYY-MM-DD"),
            INSPECT_COMPLETED_DATE: moment(element.INSPECT_COMPLETED_DATE).format("YYYY-MM-DD"),
            id: index,
          })
        );
        const temp: SX_BAOCAOROLLDATA = { ...EMPTY_SUMMARY };
        for (let i = 0; i < loadeddata.length; i++) {
          temp.PLAN_QTY += loadeddata[i].PLAN_QTY;
          temp.INPUT_QTY += loadeddata[i].INPUT_QTY;
          temp.REMAIN_QTY += loadeddata[i].REMAIN_QTY;
          temp.USED_QTY += loadeddata[i].USED_QTY;
          temp.SETTING_MET += loadeddata[i].SETTING_MET;
          temp.PR_NG += loadeddata[i].PR_NG;
          temp.OK_MET_AUTO += loadeddata[i].OK_MET_AUTO;
          temp.OK_MET_TT += loadeddata[i].OK_MET_TT;
          temp.OK_EA += loadeddata[i].OK_EA;
          temp.OUTPUT_EA += Number(loadeddata[i].OUTPUT_EA);
          temp.INSPECT_INPUT += Number(loadeddata[i].INSPECT_INPUT);
          temp.INSPECT_TT_QTY += Number(loadeddata[i].INSPECT_TT_QTY);
          temp.PURE_INPUT += Number(loadeddata[i].PURE_INPUT);
          temp.PURE_OUTPUT += Number(loadeddata[i].PURE_OUTPUT);
        }
        temp.LOSS_ST = (temp.SETTING_MET / temp.USED_QTY) * 100;
        temp.LOSS_SX = (temp.PR_NG / temp.USED_QTY) * 100;
        temp.LOSS_TT = ((temp.SETTING_MET + temp.PR_NG) / temp.USED_QTY) * 100;
        temp.REMARK = (100 - (temp.INSPECT_INPUT / temp.OUTPUT_EA) * 100).toLocaleString("en-US", { maximumFractionDigits: 1 }) + "%";
        temp.PD = 1 - temp.INSPECT_TT_QTY / temp.OUTPUT_EA;
        setSummaryData(temp);
        setPlanDataTable(loadeddata);
        datatbTotalRow.current = loadeddata.length;
        clearSelection();
        Swal.fire("Thông báo", "Đã load: " + response.data.data.length + " dòng", "success");
      } else {
        setPlanDataTable([]);
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
      }
    }).catch((error) => console.log(error));
  }, [fromdate, todate, machine, factory, clearSelection]);

  const getDailySXLossTrendingData = useCallback(async (mc: string, ft: string, fr: string, td: string) => {
    await generalQuery("trasxlosstrendingdata", { MACHINE: mc, FACTORY: ft, FROM_DATE: fr, TO_DATE: td })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setSXLossTrendingData(response.data.data.map((el: SX_LOSS_TREND_DATA) => ({
            ...el, LOSS_TT: el.LOSS_ST + el.LOSS_SX,
            INPUT_DATE: moment(el.INPUT_DATE).utc().format("YYYY-MM-DD"),
          })));
        } else { setSXLossTrendingData([]); }
      }).catch((e) => console.log(e));
  }, []);

  const getDailyLossTrend = useCallback(async (mc: string, ft: string, fr: string, td: string) => {
    await generalQuery("dailysxlosstrend", { MACHINE: mc, FACTORY: ft, FROM_DATE: fr, TO_DATE: td })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setDailyLossTrend(response.data.data.map((el: SX_TREND_LOSS_DATA) => ({
            ...el, INPUT_DATE: moment(el.INPUT_DATE).utc().format("YYYY-MM-DD"),
            LOSS_RATE: 1 - (el.PURE_OUTPUT * 1.0) / el.PURE_INPUT,
          })));
        } else { setDailyLossTrend([]); }
      }).catch((e) => console.log(e));
  }, []);

  const getWeeklyLossTrend = useCallback(async (mc: string, ft: string, fr: string, td: string) => {
    await generalQuery("weeklysxlosstrend", { MACHINE: mc, FACTORY: ft, FROM_DATE: fr, TO_DATE: td })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setWeeklyLossTrend(response.data.data.map((el: SX_TREND_LOSS_DATA) => ({
            ...el, LOSS_RATE: 1 - (el.PURE_OUTPUT * 1.0) / el.PURE_INPUT,
          })));
        } else { setWeeklyLossTrend([]); }
      }).catch((e) => console.log(e));
  }, []);

  const getMonthlyLossTrend = useCallback(async (mc: string, ft: string, fr: string, td: string) => {
    await generalQuery("monthlysxlosstrend", { MACHINE: mc, FACTORY: ft, FROM_DATE: fr, TO_DATE: td })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setMonthlyLossTrend(response.data.data.map((el: SX_TREND_LOSS_DATA) => ({
            ...el, LOSS_RATE: 1 - (el.PURE_OUTPUT * 1.0) / el.PURE_INPUT,
          })));
        } else { setMonthlyLossTrend([]); }
      }).catch((e) => console.log(e));
  }, []);

  const getYearlyLossTrend = useCallback(async (mc: string, ft: string, fr: string, td: string) => {
    await generalQuery("yearlysxlosstrend", { MACHINE: mc, FACTORY: ft, FROM_DATE: fr, TO_DATE: td })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setYearlyLossTrend(response.data.data.map((el: SX_TREND_LOSS_DATA) => ({
            ...el, LOSS_RATE: 1 - (el.PURE_OUTPUT * 1.0) / el.PURE_INPUT,
          })));
        } else { setYearlyLossTrend([]); }
      }).catch((e) => console.log(e));
  }, []);

  const initFunction = useCallback(async () => {
    Swal.fire({ title: "Đang tải báo cáo", text: "Đang tải dữ liệu, hãy chờ chút", icon: "info", showCancelButton: false, allowOutsideClick: false, confirmButtonText: "OK", showConfirmButton: false });
    Promise.all([
      loadBaoCaoTheoRoll(),
      getDailySXLossTrendingData(machine, factory, fromdate, todate),
      getDailyLossTrend(machine, factory, fromdate, todate),
      getWeeklyLossTrend(machine, factory, fromdate, todate),
      getMonthlyLossTrend(machine, factory, fromdate, todate),
      getYearlyLossTrend(machine, factory, fromdate, todate),
    ]).then(() => { Swal.fire("Thông báo", "Đã load xong báo cáo", "success"); });
  }, [loadBaoCaoTheoRoll, getDailySXLossTrendingData, getDailyLossTrend, getWeeklyLossTrend, getMonthlyLossTrend, getYearlyLossTrend, machine, factory, fromdate, todate]);

  // Quick search filter
  const filteredData = useMemo(() => {
    if (!searchKeyword.trim()) return plandatatable;
    const kw = searchKeyword.toLowerCase();
    return plandatatable.filter((item) => {
      const safeIncludes = (val: any) => String(val ?? "").toLowerCase().includes(kw);
      return (
        safeIncludes(item.PHANLOAI) || safeIncludes(item.EQUIPMENT_CD) ||
        safeIncludes(item.PROD_REQUEST_NO) || safeIncludes(item.PLAN_ID) ||
        safeIncludes(item.PROD_MODEL) || safeIncludes(item.G_NAME_KD) ||
        safeIncludes(item.M_NAME) || safeIncludes(item.M_LOT_NO) ||
        safeIncludes(item.INPUT_DATE) || safeIncludes(item.REMARK)
      );
    });
  }, [plandatatable, searchKeyword]);

  const handleExportEX1 = useCallback(() => {
    SaveExcel(filteredData, "BAOCAOROLL_Filtered");
  }, [filteredData]);

  const handleExportEX2 = useCallback(() => {
    SaveExcel(plandatatable, "BAOCAOROLL_All");
  }, [plandatatable]);

  useEffect(() => {
    getMachineList();
  }, [getMachineList]);

  return {
    // State
    fromdate, setFromDate, todate, setToDate,
    factory, setFactory, machine, setMachine,
    machine_list, plandatatable, summarydata,
    sxlosstrendingdata, dailyLossTrend, weeklyLossTrend,
    monthyLossTrend, yearlyLossTrend,
    showhidePivotTable, setShowHidePivotTable,
    activeTab, setActiveTab,
    searchKeyword, setSearchKeyword,
    filteredData, datatbTotalRow,
    // Actions
    initFunction, handleExportEX1, handleExportEX2,
  };
};
