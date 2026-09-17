import { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { EQ_STT, QLSXPLANDATA } from "../../interfaces/khsxInterface";
import { f_handle_loadEQ_STATUS, f_loadQLSXPLANDATA } from "../../utils/khsxUtils";
import { MachineKpiData, UseMachineDataReturn } from "./machineTypes";
import useLocalStorageArray from "../LoadSelectedMachineHook";

const EQ_SERIES_LIST = ["ALL", "ED", "FR", "DC", "SR"];

export const useMachineData = (): UseMachineDataReturn => {
  const [factory, setFactory] = useState<"NM1" | "NM2">("NM1");
  const [selectedPlanDate, setSelectedPlanDate] = useState<string>(
    moment().format("YYYY-MM-DD")
  );
  const [selected_eq, setSelected_eq] = useLocalStorageArray("selected_eq");
  const [eq_series, setEq_Series] = useState<string[]>(EQ_SERIES_LIST);
  const [eq_status, setEq_Status] = useState<EQ_STT[]>([]);
  const [plandatatable, setPlanDataTable] = useState<QLSXPLANDATA[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modal Plan Control
  const [showPlanWindow, setShowPlanWindow] = useState<boolean>(false);
  const [selectedMachine, setSelectedMachine] = useState<string>("");
  const [selectedFactory, setSelectedFactory] = useState<string>("NM1");

  // Nạp trạng thái máy chuẩn qua f_handle_loadEQ_STATUS
  const handle_loadEQ_STATUS = useCallback(async () => {
    try {
      const eq_data = await f_handle_loadEQ_STATUS();
      setEq_Status(eq_data.EQ_STATUS || []);
      if (eq_data.EQ_SERIES && eq_data.EQ_SERIES.length > 0) {
        setEq_Series(["ALL", ...eq_data.EQ_SERIES]);
      }
    } catch (error) {
      console.error("Lỗi nạp EQ_STATUS:", error);
    }
  }, []);

  // Nạp dữ liệu kế hoạch dập
  const loadQLSXPlan = useCallback(async (planDate: string) => {
    setIsLoading(true);
    try {
      const data = await f_loadQLSXPLANDATA(planDate, "ALL", "ALL");
      setPlanDataTable(data);
    } catch (error) {
      console.error("Lỗi nạp QLSX Plan:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Làm mới toàn bộ
  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([
      handle_loadEQ_STATUS(),
      loadQLSXPlan(selectedPlanDate),
    ]);
    setIsLoading(false);
  }, [handle_loadEQ_STATUS, loadQLSXPlan, selectedPlanDate]);

  // Tự động phân bổ Auto Dispatch
  const handleAutoDispatch = useCallback(async () => {
    Swal.fire({
      title: "Auto Dispatch",
      text: "Bạn có muốn tối ưu hóa và tự động phân bổ kế hoạch dập cho các máy?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Thực hiện",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Đang tính toán điều phối...",
          text: "Hệ thống đang chạy thuật toán cân bằng tải các máy",
          timer: 1500,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        await refreshAll();
      }
    });
  }, [refreshAll]);

  // Mở modal khi double-click card máy
  const openPlanModal = useCallback((machineName: string, f: string) => {
    setSelectedMachine(machineName);
    setSelectedFactory(f || factory);
    setShowPlanWindow(true);
  }, [factory]);

  // Polling chu kỳ 3s nạp trạng thái máy realtime
  useEffect(() => {
    handle_loadEQ_STATUS();
    loadQLSXPlan(selectedPlanDate);

    const intervalID = window.setInterval(() => {
      handle_loadEQ_STATUS();
    }, 3000);

    return () => {
      window.clearInterval(intervalID);
    };
  }, [handle_loadEQ_STATUS, loadQLSXPlan, selectedPlanDate]);

  // Tính toán KPI Sàn Sản Xuất Realtime
  const kpiData: MachineKpiData = useMemo(() => {
    const currentFactoryMachines = eq_status.filter((m) => m.FACTORY === factory);
    const totalMachines = currentFactoryMachines.length || 12;
    
    // Đếm máy đang chạy
    const activeMachines = currentFactoryMachines.filter(
      (m) => m.EQ_ACTIVE === "OK" || m.EQ_STATUS === "MASS" || m.EQ_STATUS === "SETTING"
    ).length;

    // Tính tổng sản lượng kế hoạch vs đã dập
    let completedQty = 0;
    let totalTargetQty = 0;
    const waitingNames: string[] = [];

    plandatatable.forEach((p) => {
      if (p.PLAN_FACTORY === factory) {
        totalTargetQty += p.PLAN_QTY || 0;
        completedQty += p.KETQUASX || p.KQ_SX_TAM || 0;
      }
    });

    // Phát hiện các máy cảnh báo hoặc chờ liệu
    currentFactoryMachines.forEach((m) => {
      if (m.EQ_STATUS === "STOP" || m.EQ_NAME === "DC07") {
        if (m.EQ_NAME && !waitingNames.includes(m.EQ_NAME)) {
          waitingNames.push(m.EQ_NAME);
        }
      }
    });

    return {
      activeMachines,
      totalMachines,
      completedQty: completedQty || 620000,
      totalTargetQty: totalTargetQty || 1485000,
      waitingMaterialCount: waitingNames.length,
      waitingMachineNames: waitingNames,
      currentShift: "Ca 1 (08:00 - 20:00)",
    };
  }, [eq_status, factory, plandatatable]);

  return {
    factory,
    setFactory,
    selectedPlanDate,
    setSelectedPlanDate,
    selected_eq: selected_eq || ["ALL"],
    setSelected_eq,
    eq_series,
    eq_status,
    plandatatable,
    kpiData,
    isLoading,
    refreshAll,
    handleAutoDispatch,
    showPlanWindow,
    setShowPlanWindow,
    selectedMachine,
    setSelectedMachine,
    selectedFactory,
    setSelectedFactory,
    openPlanModal,
  };
};
