import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import { PATROL_HEADER_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { DTC_PATROL_DATA, INSP_PATROL_DATA, PQC3_DATA } from "../../../qc/interfaces/qcInterface";

export type PatrolLayoutMode = "LANES" | "GRID";
export type PatrolFilterLane = "ALL" | "PQC3" | "DTC" | "INS";

export interface PatrolKpiStats {
  totalIncidents: number;
  pqcCount: number;
  dtcCount: number;
  insCount: number;
}

export interface PatrolModalData {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  emplNo?: string;
  defect?: string;
  eq?: string;
  factory?: string;
  custName?: string;
  gName?: string;
  time?: string;
  ngRate?: string;
}

export const usePatrolData = () => {
  // Data states
  const [patrolheaderdata, setPatrolHeaderData] = useState<PATROL_HEADER_DATA[]>([]);
  const [pqcdatatable, setPqcDataTable] = useState<Array<PQC3_DATA>>([]);
  const [dtcPatrolTable, setDtcPatrolTable] = useState<Array<DTC_PATROL_DATA>>([]);
  const [inspectionPatrolTable, setInspectionPatrolTable] = useState<Array<INSP_PATROL_DATA>>([]);

  // Filter & Mode states
  const [isLive, setIsLive] = useState<boolean>(true);
  const [fromDate, setFromDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(10);
  const [layoutView, setLayoutView] = useState<PatrolLayoutMode>("LANES");
  const [filterLane, setFilterLane] = useState<PatrolFilterLane>("ALL");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modal preview
  const [previewModal, setPreviewModal] = useState<PatrolModalData>({
    isOpen: false,
    imageUrl: "",
    title: "",
  });

  // 1. Nạp dữ liệu Header tóm lược
  const getPatrolHeaderData = useCallback(async () => {
    setIsLoading(true);
    const targetFrom = isLive ? moment().format("YYYY-MM-DD") : fromDate;
    const targetTo = isLive ? moment().format("YYYY-MM-DD") : toDate;

    generalQuery("getpatrolheader", {
      FROM_DATE: targetFrom,
      TO_DATE: targetTo,
    })
      .then((response) => {
        setIsLoading(false);
        if (response.data.tk_status !== "NG") {
          setPatrolHeaderData(response.data.data || []);
        } else {
          setPatrolHeaderData([]);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("getPatrolHeaderData error:", error);
      });
  }, [isLive, fromDate, toDate]);

  // 2. Nạp dữ liệu PQC3 sự cố lỗi công đoạn
  const traPQC3 = useCallback(() => {
    const targetFrom = isLive ? moment().format("YYYY-MM-DD") : fromDate;
    const targetTo = isLive ? moment().format("YYYY-MM-DD") : toDate;

    generalQuery("trapqc3data", {
      ALLTIME: false,
      FROM_DATE: targetFrom,
      TO_DATE: targetTo,
      CUST_NAME: "",
      PROCESS_LOT_NO: "",
      G_CODE: "",
      G_NAME: "",
      PROD_TYPE: "",
      EMPL_NAME: "",
      PROD_REQUEST_NO: "",
      ID: "",
      FACTORY: "All",
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC3_DATA[] = (response.data.data || []).map(
            (element: PQC3_DATA, index: number) => ({
              ...element,
              OCCURR_TIME: moment
                .utc(element.OCCURR_TIME)
                .format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            })
          );
          setPqcDataTable(loadeddata);
        } else {
          setPqcDataTable([]);
        }
      })
      .catch((error) => {
        console.error("traPQC3 error:", error);
        setPqcDataTable([]);
      });
  }, [isLive, fromDate, toDate]);

  // 3. Nạp dữ liệu thử nghiệm độ tin cậy DTC
  const loadDTCPatrolData = useCallback(() => {
    const targetFrom = isLive ? moment().format("YYYY-MM-DD") : fromDate;
    const targetTo = isLive ? moment().format("YYYY-MM-DD") : toDate;

    generalQuery("loadDTCPatrol", {
      FROM_DATE: targetFrom,
      TO_DATE: targetTo,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: DTC_PATROL_DATA[] = (response.data.data || []).map(
            (element: DTC_PATROL_DATA, index: number) => ({
              ...element,
              INS_DATE: moment
                .utc(element.INS_DATE)
                .format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            })
          );
          setDtcPatrolTable(loadeddata);
        } else {
          setDtcPatrolTable([]);
        }
      })
      .catch((error) => {
        console.error("loadDTCPatrolData error:", error);
        setDtcPatrolTable([]);
      });
  }, [isLive, fromDate, toDate]);

  // 4. Nạp dữ liệu kiểm tra ngoại quan INS Patrol (NL & PK)
  const getInspectionPatrol = useCallback(() => {
    const targetFrom = isLive ? moment().format("YYYY-MM-DD") : fromDate;
    const targetTo = isLive ? moment().format("YYYY-MM-DD") : toDate;

    generalQuery("trainspectionpatrol", {
      FROM_DATE: targetFrom,
      TO_DATE: targetTo,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: INSP_PATROL_DATA[] = (response.data.data || []).map(
            (element: INSP_PATROL_DATA, index: number) => ({
              ...element,
              id: index,
            })
          );
          setInspectionPatrolTable(loadeddata);
        } else {
          setInspectionPatrolTable([]);
        }
      })
      .catch((error) => {
        console.error("getInspectionPatrol error:", error);
        setInspectionPatrolTable([]);
      });
  }, [isLive, fromDate, toDate]);

  // Hàm refresh toàn bộ
  const refreshAll = useCallback(() => {
    getPatrolHeaderData();
    traPQC3();
    loadDTCPatrolData();
    getInspectionPatrol();
    setCountdown(10);
  }, [getPatrolHeaderData, traPQC3, loadDTCPatrolData, getInspectionPatrol]);

  // Toggle Live mode
  const handleToggleLive = useCallback(() => {
    setIsLive((prev) => {
      const next = !prev;
      if (next) {
        setFromDate(moment().format("YYYY-MM-DD"));
        setToDate(moment().format("YYYY-MM-DD"));
      }
      return next;
    });
  }, []);

  // Filter INS Patrol cho NL & PK
  const filteredInsData = useMemo(() => {
    return inspectionPatrolTable.filter(
      (element: INSP_PATROL_DATA) =>
        element.PHANLOAI === "NL" || element.PHANLOAI === "PK"
    );
  }, [inspectionPatrolTable]);

  // Tính toán chỉ số KPI realtime
  const kpis: PatrolKpiStats = useMemo(() => {
    const pqcCount = pqcdatatable.length;
    const dtcCount = dtcPatrolTable.length;
    const insCount = filteredInsData.length;
    return {
      totalIncidents: pqcCount + dtcCount + insCount,
      pqcCount,
      dtcCount,
      insCount,
    };
  }, [pqcdatatable, dtcPatrolTable, filteredInsData]);

  // Effect chạy ban đầu & chu kỳ timer 10s auto-refresh
  useEffect(() => {
    refreshAll();
  }, [isLive, fromDate, toDate]);

  useEffect(() => {
    if (!autoRefresh) return;

    const timer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refreshAll();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefresh, refreshAll]);

  return {
    patrolheaderdata,
    pqcdatatable,
    dtcPatrolTable,
    filteredInsData,
    isLive,
    setIsLive,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    isFullScreen,
    setIsFullScreen,
    autoRefresh,
    setAutoRefresh,
    countdown,
    layoutView,
    setLayoutView,
    filterLane,
    setFilterLane,
    isLoading,
    previewModal,
    setPreviewModal,
    refreshAll,
    handleToggleLive,
    kpis,
  };
};
