import { useState, useEffect, useMemo, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { FULL_ROLL_DATA, MACHINE_LIST } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { f_getMachineListData } from "../../../qlsx/QLSXPLAN/utils/khsxUtils";
import { generalQuery } from "../../../../api/Api";
import { SaveExcel } from "../../../../api/services/excelService";

export const f_handleLoadFullRollData = async (data: any): Promise<FULL_ROLL_DATA[]> => {
  let kq: FULL_ROLL_DATA[] = [];
  try {
    const res = await generalQuery("loadFullRollData", data);
    if (res.data.tk_status !== "NG") {
      const loaded_data: FULL_ROLL_DATA[] = res.data.data.map((element: FULL_ROLL_DATA, index: number) => {
        return {
          ...element,
          PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
          id: index,
        };
      });
      kq = loaded_data;
    }
  } catch (error) {
    console.error("Error loading full roll data:", error);
  }
  return kq;
};

export const useBaoCaoFullRollData = () => {
  // 1. Filter states
  const [fromDate, setFromDate] = useState<string>(moment().add(-8, "day").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [codeKd, setCodeKd] = useState<string>("");
  const [codeCms, setCodeCms] = useState<string>("");
  const [mName, setMName] = useState<string>("");
  const [mCode, setMCode] = useState<string>("");
  const [prodRequestNo, setProdRequestNo] = useState<string>("");
  const [planId, setPlanId] = useState<string>("");
  const [custNameKd, setCustNameKd] = useState<string>("");
  const [factory, setFactory] = useState<string>("ALL");
  const [machine, setMachine] = useState<string>("ALL");
  const [allTime, setAllTime] = useState<boolean>(false);

  // 2. Auxiliary states
  const [machineList, setMachineList] = useState<MACHINE_LIST[]>([]);
  const [fullRollData, setFullRollData] = useState<FULL_ROLL_DATA[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [viewMode, setViewMode] = useState<"all" | "charts" | "grid">("all");

  // Load Machine List
  useEffect(() => {
    let isMounted = true;
    const loadMachines = async () => {
      try {
        const list = await f_getMachineListData();
        if (isMounted) setMachineList(list);
      } catch (e) {
        console.error("Failed to load machine list", e);
      }
    };
    loadMachines();
    return () => { isMounted = false; };
  }, []);

  // 3. Load Main Data
  const handleLoadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const kq = await f_handleLoadFullRollData({
        FROM_DATE: fromDate,
        TO_DATE: toDate,
        FACTORY: factory,
        MACHINE: machine,
        G_NAME: codeKd,
        G_CODE: codeCms,
        M_NAME: mName,
        M_CODE: mCode,
        PROD_REQUEST_NO: prodRequestNo,
        PLAN_ID: planId,
        CUST_NAME_KD: custNameKd,
        ALL_TIME: allTime,
      });

      if (kq.length > 0) {
        setFullRollData(kq);
        Swal.fire({
          icon: "success",
          title: "Đã tải dữ liệu",
          text: `Đã tải thành công ${kq.length.toLocaleString()} dòng dữ liệu.`,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        setFullRollData([]);
        Swal.fire("Thông báo", "Không tìm thấy dữ liệu phù hợp với điều kiện tra cứu.", "info");
      }
    } catch (error) {
      console.error("Load data error:", error);
      Swal.fire("Lỗi", "Không thể kết nối đến máy chủ", "error");
    } finally {
      setIsLoading(false);
    }
  }, [fromDate, toDate, factory, machine, codeKd, codeCms, mName, mCode, prodRequestNo, planId, custNameKd, allTime]);

  // 4. Quick search filtering (an toàn kiểu dữ liệu)
  const filteredData = useMemo(() => {
    if (!searchKeyword.trim()) return fullRollData;
    const kw = searchKeyword.toLowerCase().trim();
    return fullRollData.filter((item) => {
      return (
        String(item.PLAN_DATE ?? "").toLowerCase().includes(kw) ||
        String(item.G_NAME_KD ?? "").toLowerCase().includes(kw) ||
        String(item.PROD_MAIN_MATERIAL ?? "").toLowerCase().includes(kw) ||
        String(item.PROD_REQUEST_NO ?? "").toLowerCase().includes(kw) ||
        String(item.PLAN_ID ?? "").toLowerCase().includes(kw) ||
        String(item.M_LOT_NO ?? "").toLowerCase().includes(kw) ||
        String(item.PHAN_LOAI ?? "").toLowerCase().includes(kw)
      );
    });
  }, [fullRollData, searchKeyword]);

  // 5. Aggregate KPI Metrics
  const kpiData = useMemo(() => {
    let inputMet = 0;
    let outKhoMet = 0;
    let inputM2 = 0;
    let usedMet = 0;
    let remainMet = 0;
    let resultMet = 0;
    let resultEa = 0;
    let resultM2 = 0;
    let settingMet = 0;
    let settingEa = 0;
    let prNgMet = 0;
    let prNgEa = 0;
    let insTotalMet = 0;
    let insOkMet = 0;

    for (const row of fullRollData) {
      inputMet += Number(row.INPUT_QTY) || 0;
      outKhoMet += Number(row.OUT_KHO_QTY) || 0;
      inputM2 += Number(row.INPUT_M2) || 0;
      usedMet += Number(row.USED_QTY) || 0;
      remainMet += Number(row.REMAIN_QTY) || 0;
      resultMet += Number(row.RESULT_MET) || 0;
      resultEa += Number(row.RESULT_EA) || 0;
      resultM2 += Number(row.RESULT_M2) || 0;
      settingMet += Number(row.SETTING_MET) || 0;
      settingEa += Number(row.SETTING_EA) || 0;
      prNgMet += Number(row.PR_NG) || 0;
      prNgEa += Number(row.PR_NG_EA) || 0;
      insTotalMet += Number(row.INSPECT_TOTAL_MET) || 0;
      insOkMet += Number(row.INSPECT_OK_MET) || 0;
    }

    const yieldRate = inputMet > 0 ? (usedMet / inputMet) * 100 : 0;
    const settingLossRate = usedMet > 0 ? (settingMet / usedMet) * 100 : 0;
    const ngLossRate = usedMet > 0 ? (prNgMet / usedMet) * 100 : 0;
    const insOkRate = insTotalMet > 0 ? (insOkMet / insTotalMet) * 100 : 0;

    return {
      inputMet,
      outKhoMet,
      inputM2,
      usedMet,
      remainMet,
      yieldRate,
      resultMet,
      resultEa,
      resultM2,
      settingMet,
      settingEa,
      settingLossRate,
      prNgMet,
      prNgEa,
      ngLossRate,
      insTotalMet,
      insOkMet,
      insOkRate,
    };
  }, [fullRollData]);

  // 6. Aggregate Chart 1: Daily Production & Material Trend
  const dailyTrendData = useMemo(() => {
    const map = new Map<string, {
      date: string;
      input_met: number;
      used_met: number;
      result_met: number;
      setting_met: number;
      ng_met: number;
    }>();

    for (const row of fullRollData) {
      const d = row.PLAN_DATE || "N/A";
      const existing = map.get(d) || {
        date: d,
        input_met: 0,
        used_met: 0,
        result_met: 0,
        setting_met: 0,
        ng_met: 0,
      };

      existing.input_met += Number(row.INPUT_QTY) || 0;
      existing.used_met += Number(row.USED_QTY) || 0;
      existing.result_met += Number(row.RESULT_MET) || 0;
      existing.setting_met += Number(row.SETTING_MET) || 0;
      existing.ng_met += Number(row.PR_NG) || 0;

      map.set(d, existing);
    }

    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [fullRollData]);

  // 7. Aggregate Chart 3: Top 10 Products by Used Material
  const topProductsData = useMemo(() => {
    const map = new Map<string, { name: string; used_met: number; result_ea: number }>();
    for (const row of fullRollData) {
      const name = row.G_NAME_KD || "Khác";
      const existing = map.get(name) || { name, used_met: 0, result_ea: 0 };
      existing.used_met += Number(row.USED_QTY) || 0;
      existing.result_ea += Number(row.RESULT_EA) || 0;
      map.set(name, existing);
    }
    return Array.from(map.values())
      .sort((a, b) => b.used_met - a.used_met)
      .slice(0, 10);
  }, [fullRollData]);

  // 8. Aggregate Chart 4: Material Utilization Breakdown (Donut Chart)
  const materialBreakdownData = useMemo(() => {
    return [
      { name: "Thành Phẩm OK", value: kpiData.resultMet, color: "#10b981" },
      { name: "Cân Chỉnh (Setting)", value: kpiData.settingMet, color: "#f59e0b" },
      { name: "Hỏng Công Đoạn (NG)", value: kpiData.prNgMet, color: "#ef4444" },
      { name: "Tồn Dở Dang (Remain)", value: kpiData.remainMet, color: "#0284c7" },
    ].filter((item) => item.value > 0);
  }, [kpiData]);

  // 9. Aggregate Full Summary 3 Units (MET / EA / M2)
  const summaryMetrics = useMemo(() => {
    const sum = (field: keyof FULL_ROLL_DATA) =>
      fullRollData.reduce((acc, cur) => acc + (Number(cur[field]) || 0), 0);

    return {
      met: {
        iqc_in: sum("IQC_IN"),
        out_kho: sum("OUT_KHO_QTY"),
        input: sum("INPUT_QTY"),
        used: sum("USED_QTY"),
        remain: sum("REMAIN_QTY"),
        setting: sum("SETTING_MET"),
        ng: sum("PR_NG"),
        result: sum("RESULT_MET"),
        btp: sum("BTP_REMAIN_QTY"),
        ton_sx: sum("TON_KHO_SX"),
        return_kho: sum("RETURN_KHO_QTY"),
        ins_input: sum("INS_INPUT_MET"),
        ins_ok: sum("INSPECT_OK_MET"),
        ins_output: sum("INSPECT_OUTPUT_MET"),
      },
      ea: {
        iqc_in: sum("IQC_IN_EA"),
        out_kho: sum("OUT_KHO_EA"),
        input: sum("INPUT_EA"),
        used: sum("USED_EA"),
        remain: sum("REMAIN_EA"),
        setting: sum("SETTING_EA"),
        ng: sum("PR_NG_EA"),
        result: sum("RESULT_EA"),
        btp: sum("BTP_REMAIN_EA"),
        ton_sx: sum("TON_KHO_SX_EA"),
        return_kho: sum("RETURN_EA"),
        ins_input: sum("INS_INPUT_EA"),
        ins_ok: sum("INSPECT_OK_EA"),
        ins_output: sum("INSPECT_OUTPUT_EA"),
      },
      m2: {
        iqc_in: sum("IQC_IN_M2"),
        out_kho: sum("OUT_KHO_M2"),
        input: sum("INPUT_M2"),
        used: sum("USED_M2"),
        remain: sum("REMAIN_M2"),
        setting: sum("SETTING_M2"),
        ng: sum("PR_NG_M2"),
        result: sum("RESULT_M2"),
        btp: sum("BTP_REMAIN_M2"),
        ton_sx: sum("TON_KHO_SX_M2"),
        return_kho: sum("RETURN_KHO_M2"),
        ins_input: sum("INS_INPUT_M2"),
        ins_ok: sum("INSPECT_OK_M2"),
        ins_output: sum("INSPECT_OUTPUT_M2"),
      },
    };
  }, [fullRollData]);

  // 10. Excel Export Handlers
  const handleExportEX1 = useCallback(() => {
    if (filteredData.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu đang lọc để xuất Excel", "warning");
      return;
    }
    SaveExcel(filteredData, `BaoCaoFullRoll_Filtered_${moment().format("YYYYMMDD_HHmmss")}`);
  }, [filteredData]);

  const handleExportEX2 = useCallback(() => {
    if (fullRollData.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    SaveExcel(fullRollData, `BaoCaoFullRoll_All_${moment().format("YYYYMMDD_HHmmss")}`);
  }, [fullRollData]);

  return {
    // Filter props
    fromDate, setFromDate,
    toDate, setToDate,
    codeKd, setCodeKd,
    codeCms, setCodeCms,
    mName, setMName,
    mCode, setMCode,
    prodRequestNo, setProdRequestNo,
    planId, setPlanId,
    custNameKd, setCustNameKd,
    factory, setFactory,
    machine, setMachine,
    allTime, setAllTime,
    machineList,
    // Data & UI states
    fullRollData,
    filteredData,
    isLoading,
    searchKeyword, setSearchKeyword,
    viewMode, setViewMode,
    // Analytics
    kpiData,
    dailyTrendData,
    topProductsData,
    materialBreakdownData,
    summaryMetrics,
    // Handlers
    handleLoadData,
    handleExportEX1,
    handleExportEX2,
  };
};
