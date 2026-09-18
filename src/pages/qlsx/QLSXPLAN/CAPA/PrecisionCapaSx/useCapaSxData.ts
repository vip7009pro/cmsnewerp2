import { useState, useEffect, useMemo, useCallback } from "react";
import moment from "moment";
import { generalQuery, getGlobalSetting } from "../../../../../api/Api";
import { WEB_SETTING_DATA } from "../../../../../api/GlobalInterface";
import {
  DATA_DIEM_DANH,
  DELIVERY_PLAN_CAPA,
  EQ_STT,
  MACHINE_COUNTING,
  PROD_PLAN_CAPA_DATA,
  YCSX_BALANCE_CAPA_DATA,
} from "../../interfaces/khsxInterface";
import {
  f_getProductionPlanLeadTimeCapaData,
  f_handle_loadEQ_STATUS,
} from "../../utils/khsxUtils";

export const useCapaSxData = () => {
  const dailytime: number = parseInt(
    getGlobalSetting()?.filter(
      (ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "DAILY_TIME"
    )[0]?.CURRENT_VALUE ?? "900"
  );
  const dailytime2: number = dailytime + 300;

  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedPlanDate, setSelectedPlanDate] = useState<string>(
    moment.utc().format("YYYY-MM-DD")
  );
  const [selectedFactory, setSelectedFactory] = useState<string>("NM1");
  const [selectedMachine, setSelectedMachine] = useState<string>("FR");
  const [activePlanMachine, setActivePlanMachine] = useState<string>("ALL");

  const [eq_status, setEQ_STATUS] = useState<EQ_STT[]>([]);
  const [datadiemdanh, setDataDiemDanh] = useState<DATA_DIEM_DANH[]>([]);
  const [machinecount, setMachineCount] = useState<MACHINE_COUNTING[]>([]);
  const [ycsxbalance, setYCSXBALANCE] = useState<YCSX_BALANCE_CAPA_DATA[]>([]);
  const [productionplancapadata, setProductionPlanCapaData] = useState<
    PROD_PLAN_CAPA_DATA[]
  >([]);
  const [dlleadtime, setDlLeadTime] = useState<DELIVERY_PLAN_CAPA[]>([]);

  const [FR_EMPL, setFR_EMPL] = useState({ TNM1: 0, TNM2: 0, NM1: 0, NM2: 0 });
  const [SR_EMPL, setSR_EMPL] = useState({ TNM1: 0, TNM2: 0, NM1: 0, NM2: 0 });
  const [DC_EMPL, setDC_EMPL] = useState({ TNM1: 0, TNM2: 0, NM1: 0, NM2: 0 });
  const [ED_EMPL, setED_EMPL] = useState({ TNM1: 0, TNM2: 0, NM1: 0, NM2: 0 });

  // 1. Tải trạng thái thiết bị thực tế
  const handle_loadEQ_STATUS = useCallback(async () => {
    try {
      const eq_data = await f_handle_loadEQ_STATUS();
      if (eq_data?.EQ_STATUS) {
        setEQ_STATUS(eq_data.EQ_STATUS);
      }
    } catch (error) {
      console.error("Lỗi handle_loadEQ_STATUS:", error);
    }
  }, []);

  // 2. Tải số lượng máy (Machine Counting)
  const getMachineCounting = useCallback(async () => {
    try {
      const response = await generalQuery("machinecounting", {});
      if (response.data.tk_status !== "NG") {
        const loaded_data: MACHINE_COUNTING[] = response.data.data.map(
          (element: MACHINE_COUNTING, index: number) => ({
            ...element,
            id: index,
          })
        );
        setMachineCount(loaded_data);
      } else {
        setMachineCount([]);
      }
    } catch (error) {
      console.error("Lỗi getMachineCounting:", error);
      setMachineCount([]);
    }
  }, []);

  // 3. Tải tồn yêu cầu sản xuất (YCSX Balance Capa)
  const getYCSXBALANCE = useCallback(async () => {
    try {
      const response = await generalQuery("ycsxbalancecapa", {});
      if (response.data.tk_status !== "NG") {
        const loaded_data: YCSX_BALANCE_CAPA_DATA[] = response.data.data.map(
          (element: YCSX_BALANCE_CAPA_DATA, index: number) => ({
            ...element,
            id: index,
          })
        );
        setYCSXBALANCE(loaded_data);
      } else {
        setYCSXBALANCE([]);
      }
    } catch (error) {
      console.error("Lỗi getYCSXBALANCE:", error);
      setYCSXBALANCE([]);
    }
  }, []);

  // 4. Tải điểm danh nhân lực sản xuất
  const getDiemDanhAllBP = useCallback(async () => {
    try {
      const response = await generalQuery("diemdanhallbp", { MAINDEPTCODE: 5 });
      if (response.data.tk_status !== "NG") {
        const loaded_data: DATA_DIEM_DANH[] = response.data.data.map(
          (element: DATA_DIEM_DANH) => ({
            ...element,
            REQUEST_DATE: moment(element.REQUEST_DATE).utc().format("YYYY-MM-DD"),
            APPLY_DATE: moment(element.APPLY_DATE).utc().format("YYYY-MM-DD"),
          })
        );
        setDataDiemDanh(loaded_data);

        setED_EMPL({
          TNM1: loaded_data.filter((e) => e.WORK_POSITION_NAME === "SX_ED1").length,
          TNM2: loaded_data.filter((e) => e.WORK_POSITION_NAME === "SX_ED3").length,
          NM1: loaded_data.filter((e) => e.WORK_POSITION_NAME === "SX_ED1" && e.ON_OFF === 1).length,
          NM2: loaded_data.filter((e) => e.WORK_POSITION_NAME === "SX_ED3" && e.ON_OFF === 1).length,
        });
        setSR_EMPL({
          TNM1: loaded_data.filter((e) => e.WORK_POSITION_NAME === "SX_SR1").length,
          TNM2: loaded_data.filter((e) => e.WORK_POSITION_NAME === "SX_SR3").length,
          NM1: loaded_data.filter((e) => e.WORK_POSITION_NAME === "SX_SR1" && e.ON_OFF === 1).length,
          NM2: loaded_data.filter((e) => e.WORK_POSITION_NAME === "SX_SR3" && e.ON_OFF === 1).length,
        });
        setDC_EMPL({
          TNM1: loaded_data.filter((e) => e.WORK_POSITION_NAME === "SX_DC1").length,
          TNM2: loaded_data.filter((e) => e.WORK_POSITION_NAME === "SX_DC3").length,
          NM1: loaded_data.filter((e) => e.WORK_POSITION_NAME === "SX_DC1" && e.ON_OFF === 1).length,
          NM2: loaded_data.filter((e) => e.WORK_POSITION_NAME === "SX_DC3" && e.ON_OFF === 1).length,
        });
        setFR_EMPL({
          TNM1: loaded_data.filter((e) => e.WORK_POSITION_NAME === "SX_FR1").length,
          TNM2: loaded_data.filter((e) => e.WORK_POSITION_NAME === "SX_FR3").length,
          NM1: loaded_data.filter((e) => e.WORK_POSITION_NAME === "SX_FR1" && e.ON_OFF === 1).length,
          NM2: loaded_data.filter((e) => e.WORK_POSITION_NAME === "SX_FR3" && e.ON_OFF === 1).length,
        });
      } else {
        setDataDiemDanh([]);
      }
    } catch (error) {
      console.error("Lỗi getDiemDanhAllBP:", error);
      setDataDiemDanh([]);
    }
  }, []);

  // 5. Tải dữ liệu Lead Time Capa theo Kế hoạch sản xuất
  const getProductionPlanLeadTimeCapaData = useCallback(async (plan_date: string) => {
    try {
      const data = await f_getProductionPlanLeadTimeCapaData(plan_date);
      setProductionPlanCapaData(data || []);
    } catch (error) {
      console.error("Lỗi getProductionPlanLeadTimeCapaData:", error);
      setProductionPlanCapaData([]);
    }
  }, []);

  // 6. Tính toán năng lực kế hoạch giao hàng
  const getDeliveryLeadTime = useCallback(
    async (factory: string, eq: string, plan_date: string) => {
      try {
        let eq_data: EQ_STT[] = [];
        const resEQ = await generalQuery("checkEQ_STATUS", {});
        if (resEQ.data.tk_status !== "NG") {
          eq_data = resEQ.data.data;
        }

        const FRNM1 = eq_data.filter((e) => e?.EQ_NAME?.startsWith("FR") && e.FACTORY === "NM1" && e.EQ_ACTIVE === "OK").length;
        const SRNM1 = eq_data.filter((e) => e?.EQ_NAME?.startsWith("SR") && e.FACTORY === "NM1" && e.EQ_ACTIVE === "OK").length;
        const DCNM1 = eq_data.filter((e) => e?.EQ_NAME?.startsWith("DC") && e.FACTORY === "NM1" && e.EQ_ACTIVE === "OK").length;
        const EDNM1 = eq_data.filter((e) => e?.EQ_NAME?.startsWith("ED") && e.FACTORY === "NM1" && e.EQ_ACTIVE === "OK").length;
        const FRNM2 = eq_data.filter((e) => e?.EQ_NAME?.startsWith("FR") && e.FACTORY === "NM2" && e.EQ_ACTIVE === "OK").length;
        const SRNM2 = eq_data.filter((e) => e?.EQ_NAME?.startsWith("SR") && e.FACTORY === "NM2" && e.EQ_ACTIVE === "OK").length;
        const DCNM2 = eq_data.filter((e) => e?.EQ_NAME?.startsWith("DC") && e.FACTORY === "NM2" && e.EQ_ACTIVE === "OK").length;
        const EDNM2 = eq_data.filter((e) => e?.EQ_NAME?.startsWith("ED") && e.FACTORY === "NM2" && e.EQ_ACTIVE === "OK").length;

        const eq_sttdata = { FR1: FRNM1, SR1: SRNM1, DC1: DCNM1, ED1: EDNM1, FR2: FRNM2, SR2: SRNM2, DC2: DCNM2, ED2: EDNM2 };
        const empl_info = { FR: FR_EMPL, SR: SR_EMPL, DC: DC_EMPL, ED: ED_EMPL };

        const resCapa = await generalQuery("capabydeliveryplan", { PLAN_DATE: plan_date, EQ: eq, FACTORY: factory });
        if (resCapa.data.tk_status !== "NG") {
          const loaded_data: DELIVERY_PLAN_CAPA[] = resCapa.data.data.map((element: DELIVERY_PLAN_CAPA) => ({
            ...element,
            PL_DATE: moment(element.PL_DATE).utc().format("YYYY-MM-DD"),
            AVL_CAPA: calculateStdCapa(element.FACTORY, element.EQ, eq_sttdata, empl_info, dailytime),
            REAL_CAPA: calculateStdCapa8(element.FACTORY, element.EQ, eq_sttdata, empl_info, dailytime, dailytime2),
          }));
          setDlLeadTime(loaded_data);
        } else {
          setDlLeadTime([]);
        }
      } catch (error) {
        console.error("Lỗi getDeliveryLeadTime:", error);
        setDlLeadTime([]);
      }
    },
    [FR_EMPL, SR_EMPL, DC_EMPL, ED_EMPL, dailytime, dailytime2]
  );

  const initFunction = useCallback(async () => {
    await Promise.all([
      getDiemDanhAllBP(),
      getMachineCounting(),
      getYCSXBALANCE(),
      handle_loadEQ_STATUS(),
      getDeliveryLeadTime(selectedFactory, selectedMachine, selectedPlanDate),
      getProductionPlanLeadTimeCapaData(selectedPlanDate),
    ]);
  }, [getDiemDanhAllBP, getMachineCounting, getYCSXBALANCE, handle_loadEQ_STATUS, getDeliveryLeadTime, getProductionPlanLeadTimeCapaData, selectedFactory, selectedMachine, selectedPlanDate]);

  useEffect(() => {
    initFunction();
  }, [initFunction]);

  return {
    dailytime,
    dailytime2,
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
    datadiemdanh,
    machinecount,
    ycsxbalance,
    productionplancapadata,
    dlleadtime,
    FR_EMPL,
    SR_EMPL,
    DC_EMPL,
    ED_EMPL,
    initFunction,
    getDeliveryLeadTime,
    getProductionPlanLeadTimeCapaData,
  };
};

// Các hàm tính chuẩn Capa bảo toàn 100% nguyên gốc
export const calculateStdCapa = (factory: string, eq: string, eq_stt: any, empl: any, dt: number): number => {
  const map: Record<string, { f: number; m: number }> = {
    FR: { f: 4, m: factory === "NM1" ? eq_stt.FR1 : eq_stt.FR2 },
    SR: { f: 4, m: factory === "NM1" ? eq_stt.SR1 : eq_stt.SR2 },
    DC: { f: 2, m: factory === "NM1" ? eq_stt.DC1 : eq_stt.DC2 },
    ED: { f: 2, m: factory === "NM1" ? eq_stt.ED1 : eq_stt.ED2 },
  };
  const c = map[eq];
  if (!c) return 0;
  const countEmpl = factory === "NM1" ? empl[eq]?.TNM1 || 0 : empl[eq]?.TNM2 || 0;
  return Math.min((countEmpl / c.f) * dt, c.m * dt);
};

export const calculateStdCapa8 = (factory: string, eq: string, eq_stt: any, empl: any, dt: number, dt2: number): number => {
  const map: Record<string, { f: number; m: number }> = {
    FR: { f: 4, m: factory === "NM1" ? eq_stt.FR1 : eq_stt.FR2 },
    SR: { f: 4, m: factory === "NM1" ? eq_stt.SR1 : eq_stt.SR2 },
    DC: { f: 2, m: factory === "NM1" ? eq_stt.DC1 : eq_stt.DC2 },
    ED: { f: 2, m: factory === "NM1" ? eq_stt.ED1 : eq_stt.ED2 },
  };
  const c = map[eq];
  if (!c) return 0;
  const countEmpl = factory === "NM1" ? empl[eq]?.TNM1 || 0 : empl[eq]?.TNM2 || 0;
  return Math.min((countEmpl / c.f) * dt, c.m * dt2);
};
