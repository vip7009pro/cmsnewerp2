import { useState, useEffect, useMemo, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery, getGlobalSetting } from "../../../../../api/Api";
import { WEB_SETTING_DATA } from "../../../../../api/GlobalInterface";
import {
  DELIVERY_PLAN_CAPA,
  EQ_STT,
  SX_CAPA_DATA,
} from "../../interfaces/khsxInterface";
import {
  f_handle_loadEQ_STATUS,
  f_loadcapabydeliveryplan,
} from "../../utils/khsxUtils";

export const useCapaSx2Data = () => {
  const dailytime: number = parseInt(
    getGlobalSetting()?.filter(
      (ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "DAILY_TIME"
    )[0]?.CURRENT_VALUE ?? "900"
  );

  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedPlanDate, setSelectedPlanDate] = useState<string>(
    moment.utc().format("YYYY-MM-DD")
  );
  const [selectedFactory, setSelectedFactory] = useState<string>("NM1");
  const [selectedMachine, setSelectedMachine] = useState<string>("FR");
  const [activePlanMachine, setActivePlanMachine] = useState<string>("ALL");

  const [eq_status, setEQ_STATUS] = useState<EQ_STT[]>([]);
  const [eq_series, setEQ_SERIES] = useState<string[]>([]);
  const [capadata, setCapaData] = useState<SX_CAPA_DATA[]>([]);
  const [dlleadtime, setDlLeadTime] = useState<DELIVERY_PLAN_CAPA[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. Tải trạng thái và danh sách dòng thiết bị
  const handle_loadEQ_STATUS = useCallback(async () => {
    try {
      const eq_data = await f_handle_loadEQ_STATUS();
      if (eq_data) {
        setEQ_STATUS(eq_data.EQ_STATUS || []);
        setEQ_SERIES(eq_data.EQ_SERIES || []);
        return eq_data;
      }
    } catch (error) {
      console.error("Lỗi handle_loadEQ_STATUS:", error);
    }
    return { EQ_STATUS: [], EQ_SERIES: [] };
  }, []);

  // 2. Tải dữ liệu Capa tổng hợp (getSXCapaData) - Khôi phục chính xác logic từ CAPASX2.backup.tsx
  const getCapaData = useCallback(async (showNotification: boolean = false): Promise<SX_CAPA_DATA[]> => {
    if (showNotification) {
      Swal.fire({
        title: "Tra cứu Capa",
        text: "Đang tải dữ liệu, hãy chờ chút...",
        icon: "info",
        showConfirmButton: false,
        timer: 1000,
        allowOutsideClick: false,
      });
    }

    try {
      const response = await generalQuery("getSXCapaData", { MAINDEPTCODE: 5 });
      if (response.data.tk_status !== "NG" && Array.isArray(response.data.data)) {
        const loaded_data: SX_CAPA_DATA[] = response.data.data.map(
          (element: SX_CAPA_DATA, index: number) => ({
            ...element,
            RETAIN_WF_LEADTIME_DAYS:
              element.YCSX_BALANCE <= 0 || element.RETAIN_WF <= 0
                ? 0
                : element.RETAIN_WF_LEADTIME_DAYS,
            ATT_WF_LEADTIME_DAYS:
              element.YCSX_BALANCE <= 0 || element.ATT_WF <= 0
                ? 0
                : element.ATT_WF_LEADTIME_DAYS,
            id: index,
          })
        );

        const totalRow: SX_CAPA_DATA = {
          EQ_SERIES: "TOTAL",
          EQ_QTY: 0,
          EQ_OP: 0,
          AVG_EQ_OP: 0,
          MAN_FULL_CAPA: 0,
          RETAIN_WF: 0,
          RETAIN_WF_CAPA: 0,
          ATT_WF: 0,
          ATT_WF_CAPA: 0,
          RETAIN_WF_TO_EQ: 0,
          RETAIN_WF_TO_EQ_CAPA: 0,
          ATT_WF_TO_EQ: 0,
          ATT_WF_TO_EQ_CAPA: 0,
          RETAIN_WF_MIN_CAPA: 0,
          ATT_WF_MIN_CAPA: 0,
          YCSX_BALANCE: 0,
          RETAIN_WF_LEADTIME_DAYS: 0,
          ATT_WF_LEADTIME_DAYS: 0,
        };

        for (let index = 0; index < loaded_data.length; index++) {
          totalRow.EQ_QTY += loaded_data[index].EQ_QTY || 0;
          totalRow.EQ_OP += loaded_data[index].EQ_OP || 0;
          totalRow.AVG_EQ_OP += loaded_data[index].AVG_EQ_OP || 0;
          totalRow.MAN_FULL_CAPA += loaded_data[index].MAN_FULL_CAPA || 0;
          totalRow.RETAIN_WF += loaded_data[index].RETAIN_WF || 0;
          totalRow.RETAIN_WF_CAPA += loaded_data[index].RETAIN_WF_CAPA || 0;
          totalRow.ATT_WF += loaded_data[index].ATT_WF || 0;
          totalRow.ATT_WF_CAPA += loaded_data[index].ATT_WF_CAPA || 0;
          totalRow.RETAIN_WF_TO_EQ += loaded_data[index].RETAIN_WF_TO_EQ || 0;
          totalRow.RETAIN_WF_TO_EQ_CAPA += loaded_data[index].RETAIN_WF_TO_EQ_CAPA || 0;
          totalRow.ATT_WF_TO_EQ += loaded_data[index].ATT_WF_TO_EQ || 0;
          totalRow.ATT_WF_TO_EQ_CAPA += loaded_data[index].ATT_WF_TO_EQ_CAPA || 0;
          totalRow.RETAIN_WF_MIN_CAPA += loaded_data[index].RETAIN_WF_MIN_CAPA || 0;
          totalRow.ATT_WF_MIN_CAPA += loaded_data[index].ATT_WF_MIN_CAPA || 0;
          totalRow.YCSX_BALANCE += loaded_data[index].YCSX_BALANCE || 0;
          totalRow.RETAIN_WF_LEADTIME_DAYS += loaded_data[index].RETAIN_WF_LEADTIME_DAYS || 0;
          totalRow.ATT_WF_LEADTIME_DAYS += loaded_data[index].ATT_WF_LEADTIME_DAYS || 0;
        }

        loaded_data.push(totalRow);
        setCapaData(loaded_data);

        if (showNotification) {
          Swal.fire({
            title: "Thông báo",
            text: "Tải dữ liệu Capa thành công!",
            icon: "success",
            timer: 1000,
            showConfirmButton: false,
          });
        }
        return loaded_data;
      } else {
        setCapaData([]);
        return [];
      }
    } catch (error) {
      console.error("Lỗi getCapaData:", error);
      setCapaData([]);
      return [];
    }
  }, []);

  // 3. Tải Kế hoạch Capa theo ngày giao hàng (Delivery Plan Capa)
  const getDailyDeliveryPlanCapa = useCallback(
    async (
      planDate: string,
      machine: string,
      factory: string,
      seriesList: string[] = [],
      baseCapaData?: SX_CAPA_DATA[]
    ) => {
      const currentCapa = baseCapaData && baseCapaData.length > 0 ? baseCapaData : capadata;
      const targetSeries =
        seriesList.length > 0
          ? seriesList
          : eq_series.length > 0
          ? eq_series
          : ["FR", "SR", "DC", "ED"];

      try {
        // Tải toàn bộ series để đáp ứng đầy đủ biểu đồ Delivery Plan cho tất cả các máy
        const queryList =
          machine === "ALL"
            ? targetSeries
            : targetSeries.includes(machine)
            ? [machine]
            : [machine, ...targetSeries];

        const results = await Promise.all(
          queryList.map((eq) =>
            f_loadcapabydeliveryplan({
              PLAN_DATE: planDate,
              EQ: eq,
              FACTORY: factory,
            })
          )
        );

        let merged = results.flat().map((ele: DELIVERY_PLAN_CAPA, idx: number) => {
          const matched = currentCapa.find((e) => e.EQ_SERIES === ele.EQ);
          const retainMin = matched?.RETAIN_WF_MIN_CAPA || 0;
          return {
            ...ele,
            AVL_CAPA: (retainMin * 1300) / 900,
            REAL_CAPA: retainMin,
            id: idx,
          };
        });

        setDlLeadTime(merged);
        return merged;
      } catch (error) {
        console.error("Lỗi getDailyDeliveryPlanCapa:", error);
        return [];
      }
    },
    [capadata, eq_series]
  );

  // 4. Hàm khởi tạo nạp toàn bộ dữ liệu
  const initFunction = useCallback(async () => {
    setIsLoading(true);
    try {
      const [eqData, loadedCapa] = await Promise.all([
        handle_loadEQ_STATUS(),
        getCapaData(false),
      ]);
      await getDailyDeliveryPlanCapa(
        selectedPlanDate,
        activePlanMachine,
        selectedFactory,
        eqData.EQ_SERIES,
        loadedCapa
      );
    } catch (error) {
      console.error("Lỗi initFunction CAPASX2:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    handle_loadEQ_STATUS,
    getCapaData,
    getDailyDeliveryPlanCapa,
    selectedPlanDate,
    activePlanMachine,
    selectedFactory,
  ]);

  // Nạp lần đầu khi mount
  useEffect(() => {
    initFunction();
  }, []);

  // Tính toán các chỉ số tổng hợp cho KPI từ totalRow
  const totalRow = useMemo(() => {
    return capadata.find((e) => e.EQ_SERIES === "TOTAL") || null;
  }, [capadata]);

  const totalReqWorkforce = totalRow?.EQ_OP || 0;
  const retainWorkforce = totalRow?.RETAIN_WF || 0;
  const realtimeWorkforce = totalRow?.ATT_WF || 0;
  const totalMachines = totalRow?.EQ_QTY || 0;
  const runningMachines = useMemo(() => {
    return eq_status.filter(
      (e) => e.EQ_STATUS === "MASS" || e.EQ_STATUS === "SETTING"
    ).length;
  }, [eq_status]);

  const maxDailyCapaMinutes = totalRow?.MAN_FULL_CAPA || 0;
  const totalYcsxBalanceMinutes = totalRow?.YCSX_BALANCE || 0;
  const avgLeadTimeDays = totalRow?.ATT_WF_LEADTIME_DAYS || 0;
  const retainLeadTimeDays = totalRow?.RETAIN_WF_LEADTIME_DAYS || 0;

  return {
    dailytime,
    activeTab,
    setActiveTab,
    selectedPlanDate,
    setSelectedPlanDate,
    selectedFactory,
    setSelectedFactory,
    selectedMachine,
    setSelectedMachine,
    activePlanMachine,
    setActivePlanMachine,
    eq_status,
    eq_series,
    capadata,
    dlleadtime,
    isLoading,
    totalRow,
    totalReqWorkforce,
    retainWorkforce,
    realtimeWorkforce,
    totalMachines,
    runningMachines,
    maxDailyCapaMinutes,
    totalYcsxBalanceMinutes,
    avgLeadTimeDays,
    retainLeadTimeDays,
    initFunction,
    getCapaData,
    getDailyDeliveryPlanCapa,
    handle_loadEQ_STATUS,
  };
};
