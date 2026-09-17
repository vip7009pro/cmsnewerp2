import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import { SaveExcel } from "../../../../api/services/excelService";
import {
  ACHIVEMENT_DATA,
  DAILY_SX_DATA,
  MACHINE_COUNTING,
  MACHINE_LIST,
  MONTHLY_SX_DATA,
  OPERATION_TIME_DATA,
  SX_LOSS_TREND_DATA,
  TOTAL_TIME,
  WEEKLY_SX_DATA,
} from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { f_getMachineListData } from "../../../qlsx/QLSXPLAN/utils/khsxUtils";
import { PlanResultTabType } from "./PrecisionPlanResultToolbar";

const dailytime1 = 1260;
const dailytime2 = 1260;

export const usePlanResultData = () => {
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const [fromdate, setFromDate] = useState(
    moment().add(-30, "day").format("YYYY-MM-DD")
  );
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [machine, setMachine] = useState("ALL");
  const [factory, setFactory] = useState("ALL");
  const [activeTab, setActiveTab] = useState<PlanResultTabType>("all");
  const [isLoading, setIsLoading] = useState(false);

  const [T_TIME_NM1, setT_TIME_NM1] = useState<TOTAL_TIME>({
    T_FR: 1,
    T_SR: 1,
    T_DC: 1,
    T_ED: 1,
    T_TOTAL: 1,
  });
  const [T_TIME_NM2, setT_TIME_NM2] = useState<TOTAL_TIME>({
    T_FR: 1,
    T_SR: 1,
    T_DC: 1,
    T_ED: 1,
    T_TOTAL: 1,
  });

  const [machinecount, setMachineCount] = useState<MACHINE_COUNTING[]>([]);
  const [daily_sx_data, setDailySXData] = useState<DAILY_SX_DATA[]>([]);
  const [weekly_sx_data, setWeeklySXData] = useState<WEEKLY_SX_DATA[]>([]);
  const [monthly_sx_data, setMonthlySXData] = useState<MONTHLY_SX_DATA[]>([]);
  const [sxachivementdata, setSXAchivementData] = useState<ACHIVEMENT_DATA[]>([]);
  const [sxlosstrendingdata, setSXLossTrendingData] = useState<SX_LOSS_TREND_DATA[]>([]);
  const [operation_time, setOperationTime] = useState<OPERATION_TIME_DATA[]>([]);

  // Tính số ngày làm việc (không tính chủ nhật)
  const getBusinessDatesCount = useCallback((st: any, ed: any) => {
    const startDate = new Date(moment(st).format("YYYY-MM-DD"));
    const endDate = new Date(moment(ed).format("YYYY-MM-DD"));
    let count = 0;
    const curDate = new Date(startDate.getTime());
    while (curDate <= endDate) {
      if (curDate.getDay() !== 0) count++;
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  }, []);

  const [dayrange, setDayRange] = useState(getBusinessDatesCount(fromdate, todate));

  // 1. Tải danh sách máy
  const getMachineList = useCallback(async () => {
    const list = await f_getMachineListData();
    setMachine_List(list);
  }, []);

  // 2. Tải đếm máy & tính tổng thời gian NM1, NM2
  const getMachineCounting = useCallback((ft: string, mc: string) => {
    generalQuery("machinecounting2", { FACTORY: ft, EQ_NAME: mc })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loaded_data: MACHINE_COUNTING[] = response.data.data.map(
            (element: MACHINE_COUNTING, index: number) => ({ ...element, id: index })
          );

          const getQty = (f: string, eq: string) =>
            loaded_data.find((e) => e?.FACTORY === f && e?.EQ_NAME === eq)?.EQ_QTY || 0;

          const temp_TIME_NM1: TOTAL_TIME = {
            T_FR: getQty("NM1", "FR") * dailytime1,
            T_SR: getQty("NM1", "SR") * dailytime1,
            T_DC: getQty("NM1", "DC") * dailytime1,
            T_ED: getQty("NM1", "ED") * dailytime1,
            T_TOTAL: 0,
          };
          temp_TIME_NM1.T_TOTAL =
            temp_TIME_NM1.T_FR + temp_TIME_NM1.T_SR + temp_TIME_NM1.T_DC + temp_TIME_NM1.T_ED;

          const temp_TIME_NM2: TOTAL_TIME = {
            T_FR: getQty("NM2", "FR") * dailytime2,
            T_SR: getQty("NM2", "SR") * dailytime2,
            T_DC: getQty("NM2", "DC") * dailytime2,
            T_ED: getQty("NM2", "ED") * dailytime2,
            T_TOTAL: 0,
          };
          temp_TIME_NM2.T_TOTAL =
            temp_TIME_NM2.T_FR + temp_TIME_NM2.T_SR + temp_TIME_NM2.T_DC + temp_TIME_NM2.T_ED;

          setT_TIME_NM1(temp_TIME_NM1);
          setT_TIME_NM2(temp_TIME_NM2);
          setMachineCount(loaded_data);
        } else {
          setMachineCount([]);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // 3. Tải dữ liệu xu hướng hao hụt ngày
  const getDailySXLossTrendingData = useCallback((mc: string, ft: string, fr: string, td: string) => {
    generalQuery("trasxlosstrendingdata", { MACHINE: mc, FACTORY: ft, FROM_DATE: fr, TO_DATE: td })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setSXLossTrendingData(
            response.data.data.map((element: SX_LOSS_TREND_DATA) => ({
              ...element,
              INPUT_DATE: moment(element.INPUT_DATE).utc().format("YYYY-MM-DD"),
            }))
          );
        } else {
          setSXLossTrendingData([]);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // 4. Tải dữ liệu sản xuất ngày
  const getDailySXData = useCallback((mc: string, ft: string, fr: string, td: string) => {
    generalQuery("dailysxdata", { MACHINE: mc, FACTORY: ft, FROM_DATE: fr, TO_DATE: td })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setDailySXData(
            response.data.data.map((element: DAILY_SX_DATA) => ({
              ...element,
              SX_DATE: moment(element.SX_DATE).utc().format("YYYY-MM-DD"),
              RATE: (element.SX_RESULT / element.PLAN_QTY) * 100,
            }))
          );
        } else {
          setDailySXData([]);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // 5. Tải dữ liệu xu hướng tuần
  const getWeeklySXData = useCallback((mc: string, ft: string, fr: string, td: string) => {
    generalQuery("sxweeklytrenddata", { MACHINE: mc, FACTORY: ft, FROM_DATE: fr, TO_DATE: td })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setWeeklySXData(
            response.data.data.map((element: WEEKLY_SX_DATA) => ({
              ...element,
              RATE: (element.SX_RESULT / element.PLAN_QTY) * 100,
            }))
          );
        } else {
          setWeeklySXData([]);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // 6. Tải dữ liệu xu hướng tháng
  const getMonthlySXData = useCallback((mc: string, ft: string, fr: string, td: string) => {
    generalQuery("sxmonthlytrenddata", { MACHINE: mc, FACTORY: ft, FROM_DATE: fr, TO_DATE: td })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setMonthlySXData(
            response.data.data.map((element: MONTHLY_SX_DATA) => ({
              ...element,
              RATE: (element.SX_RESULT / element.PLAN_QTY) * 100,
            }))
          );
        } else {
          setMonthlySXData([]);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // 7. Tải dữ liệu hiệu suất thời gian máy
  const getMachineTimeEfficiency = useCallback((mc: string, ft: string, fr: string, td: string) => {
    generalQuery("machineTimeEfficiency", { MACHINE: mc, FACTORY: ft, FROM_DATE: fr, TO_DATE: td })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: OPERATION_TIME_DATA[] = response.data.data.map((e: OPERATION_TIME_DATA) => ({ ...e }));
          let temp_time: OPERATION_TIME_DATA = {
            PLAN_FACTORY: "TOTAL",
            MACHINE: "TOTAL",
            TOTAL_TIME: 0,
            RUN_TIME_SX: 0,
            SETTING_TIME: 0,
            LOSS_TIME: 0,
            HIEU_SUAT_TIME: 0,
            SETTING_TIME_RATE: 0,
            LOSS_TIME_RATE: 0,
          };
          for (let i = 0; i < loaded_data.length; i++) {
            temp_time.TOTAL_TIME += loaded_data[i].TOTAL_TIME;
            temp_time.RUN_TIME_SX += loaded_data[i].RUN_TIME_SX;
            temp_time.SETTING_TIME += loaded_data[i].SETTING_TIME;
            temp_time.LOSS_TIME += loaded_data[i].LOSS_TIME;
          }
          temp_time.HIEU_SUAT_TIME = temp_time.TOTAL_TIME > 0 ? temp_time.RUN_TIME_SX / temp_time.TOTAL_TIME : 0;
          temp_time.SETTING_TIME_RATE = temp_time.TOTAL_TIME > 0 ? temp_time.SETTING_TIME / temp_time.TOTAL_TIME : 0;
          temp_time.LOSS_TIME_RATE = temp_time.TOTAL_TIME > 0 ? temp_time.LOSS_TIME / temp_time.TOTAL_TIME : 0;
          loaded_data.push(temp_time);
          setOperationTime(loaded_data);
        } else {
          setOperationTime([]);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // 8. Tải dữ liệu tiến độ và hao hụt
  const getSXAchiveMentData = useCallback((ft: string, fr: string, td: string) => {
    generalQuery("sxachivementdata", { FACTORY: ft, FROM_DATE: fr, TO_DATE: td })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: ACHIVEMENT_DATA[] = response.data.data.map((e: ACHIVEMENT_DATA) => ({
            ...e,
            TOTAL_LOSS: e.WH_OUTPUT > 0 ? 100 - (e.INS_OUTPUT / e.WH_OUTPUT) * 100 : 0,
            ACHIVEMENT_RATE: e.PLAN_QTY > 0 ? (e.SX_RESULT_TOTAL / e.PLAN_QTY) * 100 : 0,
          }));
          let temp_TOTAL: ACHIVEMENT_DATA = {
            MACHINE_NAME: "TOTAL",
            PLAN_QTY: 0,
            WH_OUTPUT: 0,
            SX_RESULT_TOTAL: 0,
            RESULT_STEP_FINAL: 0,
            RESULT_TO_NEXT_PROCESS: 0,
            RESULT_TO_INSPECTION: 0,
            INS_INPUT: 0,
            INSPECT_TOTAL_QTY: 0,
            INSPECT_OK_QTY: 0,
            INSPECT_NG_QTY: 0,
            INS_OUTPUT: 0,
            TOTAL_LOSS: 0,
            ACHIVEMENT_RATE: 0,
          };
          for (let i = 0; i < loaded_data.length; i++) {
            temp_TOTAL.PLAN_QTY += loaded_data[i].PLAN_QTY;
            temp_TOTAL.WH_OUTPUT += loaded_data[i].WH_OUTPUT;
            temp_TOTAL.SX_RESULT_TOTAL += loaded_data[i].SX_RESULT_TOTAL;
            temp_TOTAL.RESULT_STEP_FINAL += loaded_data[i].RESULT_STEP_FINAL;
            temp_TOTAL.RESULT_TO_NEXT_PROCESS += loaded_data[i].RESULT_TO_NEXT_PROCESS;
            temp_TOTAL.RESULT_TO_INSPECTION += loaded_data[i].RESULT_TO_INSPECTION;
            temp_TOTAL.INS_INPUT += loaded_data[i].INS_INPUT;
            temp_TOTAL.INSPECT_TOTAL_QTY += loaded_data[i].INSPECT_TOTAL_QTY;
            temp_TOTAL.INSPECT_OK_QTY += loaded_data[i].INSPECT_OK_QTY;
            temp_TOTAL.INSPECT_NG_QTY += loaded_data[i].INSPECT_NG_QTY;
            temp_TOTAL.INS_OUTPUT += loaded_data[i].INS_OUTPUT;
          }
          temp_TOTAL.ACHIVEMENT_RATE = temp_TOTAL.PLAN_QTY > 0 ? (temp_TOTAL.SX_RESULT_TOTAL / temp_TOTAL.PLAN_QTY) * 100 : 0;
          temp_TOTAL.TOTAL_LOSS = temp_TOTAL.WH_OUTPUT > 0 ? 100 - (temp_TOTAL.INS_OUTPUT / temp_TOTAL.WH_OUTPUT) * 100 : 0;
          loaded_data.push(temp_TOTAL);
          setSXAchivementData(loaded_data);
        } else {
          setSXAchivementData([]);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // 9. Tính Available Time
  const getAvailableTime = useCallback(() => {
    let totalAvailableTime = 0;
    if (machine === "ALL") {
      for (let i = 0; i < machinecount.length; i++) {
        totalAvailableTime += machinecount[i].EQ_QTY * dailytime1;
      }
    } else {
      totalAvailableTime =
        machinecount.filter((e) => e.EQ_NAME === machine).length * dailytime1;
    }
    return totalAvailableTime;
  }, [machine, machinecount]);

  // 10. Hàm Tra Cứu Toàn Diện
  const handleSearch = useCallback(() => {
    setIsLoading(true);
    const dRange = getBusinessDatesCount(fromdate, todate);
    setDayRange(dRange);

    Promise.all([
      getDailySXData(machine, factory, fromdate, todate),
      getSXAchiveMentData(factory, fromdate, todate),
      getWeeklySXData(machine, factory, fromdate, todate),
      getMachineTimeEfficiency(machine, factory, fromdate, todate),
      getMachineCounting(factory, machine),
      getDailySXLossTrendingData(machine, factory, fromdate, todate),
      getMonthlySXData(machine, factory, moment().format("YYYY") + "-01-01", moment().format("YYYY-MM-DD")),
    ]).finally(() => {
      setIsLoading(false);
    });
  }, [
    fromdate,
    todate,
    machine,
    factory,
    getBusinessDatesCount,
    getDailySXData,
    getSXAchiveMentData,
    getWeeklySXData,
    getMachineTimeEfficiency,
    getMachineCounting,
    getDailySXLossTrendingData,
    getMonthlySXData,
  ]);

  // 11. Quick Select
  const handleQuickSelect = useCallback((val: string) => {
    let st = "";
    let ed = moment().format("YYYY-MM-DD");
    if (val === "0") {
      st = moment().add(-30, "day").format("YYYY-MM-DD");
    } else if (val === "1") {
      st = moment().format("YYYY-MM-DD");
    } else if (val === "2") {
      st = moment().add(-1, "day").format("YYYY-MM-DD");
      ed = moment().add(-1, "day").format("YYYY-MM-DD");
    }
    setFromDate(st);
    setToDate(ed);
    const dRange = getBusinessDatesCount(st, ed);
    setDayRange(dRange);

    getDailySXData(machine, factory, st, ed);
    getSXAchiveMentData(factory, st, ed);
    getWeeklySXData(machine, factory, st, ed);
    getMachineTimeEfficiency(machine, factory, st, ed);
    getDailySXLossTrendingData(machine, factory, st, ed);
  }, [machine, factory, getBusinessDatesCount, getDailySXData, getSXAchiveMentData, getWeeklySXData, getMachineTimeEfficiency, getDailySXLossTrendingData]);

  // 12. Xuất Excel
  const exportExcel = useCallback((rows: any[], title: string) => {
    if (!rows || rows.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    SaveExcel(rows, `${title}_${moment().format("YYYYMMDD_HHmmss")}`);
  }, []);

  // Initial Load
  useEffect(() => {
    getMachineList();
    handleSearch();
  }, []);

  return {
    machine_list,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    machine,
    setMachine,
    factory,
    setFactory,
    activeTab,
    setActiveTab,
    isLoading,
    dayrange,
    daily_sx_data,
    weekly_sx_data,
    monthly_sx_data,
    sxachivementdata,
    sxlosstrendingdata,
    operation_time,
    availableTime: getAvailableTime(),
    t_time_total: T_TIME_NM1.T_TOTAL + T_TIME_NM2.T_TOTAL,
    handleSearch,
    handleQuickSelect,
    exportExcel,
  };
};
