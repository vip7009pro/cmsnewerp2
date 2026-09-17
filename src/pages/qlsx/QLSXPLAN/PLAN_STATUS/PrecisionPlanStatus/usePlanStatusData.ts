import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../../api/Api";
import { f_getMachineListData } from "../../utils/khsxUtils";
import { MACHINE_LIST, SX_DATA } from "../../interfaces/khsxInterface";
import { SaveExcel } from "../../../../../api/services/excelService";

export const usePlanStatusData = () => {
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const [readyRender, setReadyRender] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [machine, setMachine] = useState("ALL");
  const [factory, setFactory] = useState("ALL");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [plan_id, setPlanID] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [datasxtable, setDataSXTable] = useState<SX_DATA[]>([]);

  // UI state
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [quickSearch, setQuickSearch] = useState("");
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(0); // 0 = off, 30 = 30s, 60 = 60s

  const getMachineList = useCallback(async () => {
    try {
      const list = await f_getMachineListData();
      setMachine_List(list || []);
    } catch (err) {
      console.error("Error fetching machine list:", err);
    }
  }, []);

  const handle_loadplanStatus = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setisLoading(true);
    }

    try {
      const response = await generalQuery("checkQLSXPLANSTATUS", {
        ALLTIME: alltime,
        FROM_DATE: fromdate,
        TO_DATE: todate,
        G_NAME: codeKD,
        G_CODE: codeCMS,
        PLAN_ID: plan_id,
        PROD_REQUEST_NO: prodrequestno,
        FACTORY: factory,
        PLAN_EQ: machine,
      });

      if (response.data?.tk_status !== "NG" && Array.isArray(response.data?.data)) {
        const loaded_data: SX_DATA[] = response.data.data.map(
          (element: SX_DATA, index: number) => {
            return {
              ...element,
              PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
              id: index,
            };
          }
        );

        startTransition(() => {
          setDataSXTable(loaded_data);
        });
        setReadyRender(true);
      } else {
        if (!isSilent) {
          Swal.fire("Thông báo", "Không có dữ liệu phù hợp", "info");
        }
      }
    } catch (error) {
      console.error("Error loading plan status:", error);
      if (!isSilent) {
        Swal.fire("Lỗi", "Không thể tải dữ liệu trạng thái chỉ thị", "error");
      }
    } finally {
      if (!isSilent) {
        setisLoading(false);
      }
    }
  }, [alltime, fromdate, todate, codeKD, codeCMS, plan_id, prodrequestno, factory, machine]);

  // Lọc nhanh theo Quick Search
  const filteredData = useMemo(() => {
    if (!quickSearch.trim()) return datasxtable;
    const term = quickSearch.toLowerCase().trim();
    return datasxtable.filter((item) => {
      const planId = (item.PLAN_ID || "").toLowerCase();
      const codeKd = (item.G_NAME_KD || "").toLowerCase();
      const codeCms = (item.G_CODE || "").toLowerCase();
      const eq = (item.PLAN_EQ || "").toLowerCase();
      const fac = (item.PLAN_FACTORY || "").toLowerCase();
      const reqNo = (item.PROD_REQUEST_NO || "").toLowerCase();

      return (
        planId.includes(term) ||
        codeKd.includes(term) ||
        codeCms.includes(term) ||
        eq.includes(term) ||
        fac.includes(term) ||
        reqNo.includes(term)
      );
    });
  }, [datasxtable, quickSearch]);

  // Toggle Auto Refresh (0s -> 30s -> 60s -> 0s)
  const toggleAutoRefresh = useCallback(() => {
    setAutoRefreshInterval((prev) => {
      if (prev === 0) return 30;
      if (prev === 30) return 60;
      return 0;
    });
  }, []);

  // Xuất Excel
  const handleExportExcel = useCallback(() => {
    if (filteredData.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }

    const exportRows = filteredData.map((item, idx) => {
      const kq =
        item.CHOTBC === null
          ? item.KQ_SX_TAM === null
            ? 0
            : item.KQ_SX_TAM
          : item.KETQUASX || 0;
      const plan = item.PLAN_QTY || 0;
      const pct = plan === 0 ? 0 : Math.round((kq / plan) * 100);

      return {
        STT: idx + 1,
        PLAN_ID: item.PLAN_ID,
        CODE_KD: item.G_NAME_KD,
        CODE_CMS: item.G_CODE,
        PLAN_DATE: item.PLAN_DATE,
        WORK_SHIFT:
          item.WORK_SHIFT === null
            ? "CHƯA SX"
            : item.WORK_SHIFT === "DAY"
            ? "CA NGÀY"
            : "CA ĐÊM",
        XƯỞNG: item.PLAN_FACTORY,
        MÁY: item.PLAN_EQ,
        BƯỚC: item.STEP === 0 ? "F" : item.STEP,
        XUẤT_DAO: item.XUATDAO !== null ? "Đã xuất" : "Chưa xuất",
        BĐ_SETTING: item.SETTING_START_TIME !== null ? "Đã BĐ" : "Chưa BĐ",
        KT_SETTING: item.MASS_START_TIME !== null ? "Đã KT" : "Chưa KT",
        ĐK_LIỆU: item.DKXL !== null ? "Đã ĐK" : "Chưa ĐK",
        XUẤT_LIỆU: item.XUATLIEU !== null ? "Đã xuất" : "Chưa xuất",
        IN_TEM: item.IN_TEM !== null ? "Đã in" : "Chưa in",
        CHỐT_BC: item.CHOTBC !== null ? "Đã chốt" : "Chưa chốt",
        KẾ_HOẠCH: plan,
        KẾT_QUẢ: kq,
        TỶ_LỆ_ĐẠT: `${pct}%`,
      };
    });

    SaveExcel(exportRows, `PLAN_STATUS_${moment().format("YYYYMMDD_HHmmss")}`);
  }, [filteredData]);

  // Initial load
  useEffect(() => {
    getMachineList();
    handle_loadplanStatus();
  }, [getMachineList]);

  // Timer Auto Refresh
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;

    const timer = setInterval(() => {
      handle_loadplanStatus(true);
    }, autoRefreshInterval * 1000);

    return () => clearInterval(timer);
  }, [autoRefreshInterval, handle_loadplanStatus]);

  return {
    fromdate,
    setFromDate,
    todate,
    setToDate,
    codeKD,
    setCodeKD,
    codeCMS,
    setCodeCMS,
    machine,
    setMachine,
    factory,
    setFactory,
    prodrequestno,
    setProdRequestNo,
    plan_id,
    setPlanID,
    alltime,
    setAllTime,
    machine_list,
    datasxtable,
    filteredData,
    isLoading,
    readyRender,
    viewMode,
    setViewMode,
    quickSearch,
    setQuickSearch,
    autoRefreshInterval,
    toggleAutoRefresh,
    handle_loadplanStatus,
    handleExportExcel,
  };
};
