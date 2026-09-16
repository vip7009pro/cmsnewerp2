import { useState, useEffect, useMemo, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode } from "../../../../api/Api";
import {
  LOSS_TABLE_DATA_ROLL,
  MACHINE_LIST,
  MATERIAL_STATUS,
  SX_LOSS_ROLL_DATA,
} from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import {
  f_getMachineListData,
  f_loadRollLossData,
  f_loadRollLossDataDaily,
} from "../../../qlsx/QLSXPLAN/utils/khsxUtils";
import { SaveExcel } from "../../../../api/services/excelService";

export interface CuonLieuFilterState {
  fromdate: string;
  todate: string;
  codekd: string;
  codecms: string;
  machine: string;
  factory: string;
  prodrequestno: string;
  plan_id: string;
  alltime: boolean;
  m_name: string;
  m_code: string;
  cust_name_kd: string;
}

export interface PipelineStageCount {
  pass: number;
  warn: number;
  none: number;
}

export interface PipelineSummary {
  xuatKho: PipelineStageCount;
  vaoFR: PipelineStageCount;
  vaoSR: PipelineStageCount;
  vaoDC: PipelineStageCount;
  vaoED: PipelineStageCount;
  confirmGiaoNhan: PipelineStageCount;
  vaoKiem: PipelineStageCount;
  raKiem: PipelineStageCount;
}

export const useCuonLieuData = () => {
  const [filters, setFilters] = useState<CuonLieuFilterState>({
    fromdate: moment().format("YYYY-MM-DD"),
    todate: moment().format("YYYY-MM-DD"),
    codekd: "",
    codecms: "",
    machine: "ALL",
    factory: "ALL",
    prodrequestno: "",
    plan_id: "",
    alltime: false,
    m_name: "",
    m_code: "",
    cust_name_kd: "",
  });

  const [machineList, setMachineList] = useState<MACHINE_LIST[]>([]);
  const [datasxtable, setDataSXTable] = useState<MATERIAL_STATUS[]>([]);
  const [quickSearchText, setQuickSearchText] = useState("");
  const [showChart, setShowChart] = useState(true);
  const [dailyGraph, setDailyGraph] = useState(false);
  const [showPivotModal, setShowPivotModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lossRollData, setLossRollData] = useState<SX_LOSS_ROLL_DATA[]>([]);

  const [lossTableInfo, setLossTableInfo] = useState<LOSS_TABLE_DATA_ROLL>({
    XUATKHO_MET: 0,
    INSPECTION_INPUT: 0,
    INSPECTION_OK: 0,
    INSPECTION_OUTPUT: 0,
    TOTAL_LOSS_KT: 0,
    TOTAL_LOSS: 0,
  });

  // Tải danh sách máy khi component khởi tạo
  useEffect(() => {
    let isMounted = true;
    f_getMachineListData().then((res) => {
      if (isMounted && res) setMachineList(res);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleFilterChange = (field: keyof CuonLieuFilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Nạp dữ liệu biểu đồ tổn thất cuộn liệu
  const loadRollLoss = useCallback(async (isDaily: boolean, from: string, to: string) => {
    try {
      const kq = isDaily
        ? await f_loadRollLossDataDaily(from, to)
        : await f_loadRollLossData(from, to);
      setLossRollData(kq || []);
    } catch (err) {
      console.error("Lỗi khi tải roll loss chart:", err);
    }
  }, []);

  // Tra cứu dữ liệu trạng thái cuộn liệu từ backend
  const handleLoadData = useCallback(() => {
    Swal.fire({
      title: "Tra cứu trạng thái cuộn liệu",
      text: "Đang tải dữ liệu, vui lòng chờ trong giây lát...",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    loadRollLoss(dailyGraph, filters.fromdate, filters.todate);

    generalQuery("materialLotStatus", {
      ALLTIME: filters.alltime,
      FROM_DATE: filters.fromdate,
      TO_DATE: filters.todate,
      PROD_REQUEST_NO: filters.prodrequestno,
      PLAN_ID: filters.plan_id,
      M_NAME: filters.m_name,
      M_CODE: filters.m_code,
      G_NAME: filters.codekd,
      G_CODE: filters.codecms,
      FACTORY: filters.factory,
      PLAN_EQ: filters.machine,
      CUST_NAME_KD: filters.cust_name_kd,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const rawData = response.data.data || [];
          const auditMode = getAuditMode();

          const loadedData: MATERIAL_STATUS[] = rawData.map(
            (item: MATERIAL_STATUS, index: number) => ({
              id: index,
              ...item,
              G_NAME:
                auditMode === 0
                  ? item?.G_NAME
                  : item?.G_NAME?.search("CNDB") === -1
                  ? item?.G_NAME
                  : "TEM_NOI_BO",
              INS_DATE: item.INS_DATE
                ? moment.utc(item.INS_DATE).format("YYYY-MM-DD HH:mm:ss")
                : "",
              FIRST_INPUT_DATE: item.FIRST_INPUT_DATE
                ? moment.utc(item.FIRST_INPUT_DATE).format("YYYY-MM-DD HH:mm:ss")
                : "",
            })
          );

          Swal.fire({
            title: "Tra Cứu Hoàn Tất",
            text: `Đã nạp thành công ${loadedData.length.toLocaleString("en-US")} cuộn liệu`,
            icon: "success",
            timer: 1800,
            showConfirmButton: false,
          });

          // Tính toán tổn thất cuộn liệu
          const tempLoss: LOSS_TABLE_DATA_ROLL = {
            XUATKHO_MET: 0,
            INSPECTION_INPUT: 0,
            INSPECTION_OK: 0,
            INSPECTION_OUTPUT: 0,
            TOTAL_LOSS_KT: 0,
            TOTAL_LOSS: 0,
          };

          for (let i = 0; i < loadedData.length; i++) {
            tempLoss.XUATKHO_MET += loadedData[i].TOTAL_OUT_QTY || 0;
            tempLoss.INSPECTION_INPUT += loadedData[i].INSPECT_TOTAL_QTY || 0;
            tempLoss.INSPECTION_OK += loadedData[i].INSPECT_OK_QTY || 0;
            tempLoss.INSPECTION_OUTPUT += loadedData[i].INS_OUT || 0;
          }

          tempLoss.TOTAL_LOSS_KT =
            tempLoss.XUATKHO_MET > 0
              ? 1 - tempLoss.INSPECTION_OK / tempLoss.XUATKHO_MET
              : 0;
          tempLoss.TOTAL_LOSS =
            tempLoss.XUATKHO_MET > 0
              ? 1 - tempLoss.INSPECTION_OUTPUT / tempLoss.XUATKHO_MET
              : 0;

          setLossTableInfo(tempLoss);
          setDataSXTable(loadedData);
        } else {
          Swal.fire(
            "Thông báo",
            "Có lỗi khi tải dữ liệu: " + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Lỗi API materialLotStatus:", error);
        Swal.fire("Lỗi Kết Nối", "Không thể kết nối đến máy chủ!", "error");
      });
  }, [dailyGraph, filters, loadRollLoss]);

  // Quick search filter trên danh sách
  const filteredData = useMemo(() => {
    if (!quickSearchText.trim()) return datasxtable;
    const query = quickSearchText.toLowerCase().trim();
    return datasxtable.filter((row) => {
      return (
        String(row.M_LOT_NO || "").toLowerCase().includes(query) ||
        String(row.M_CODE || "").toLowerCase().includes(query) ||
        String(row.M_NAME || "").toLowerCase().includes(query) ||
        String(row.G_CODE || "").toLowerCase().includes(query) ||
        String(row.G_NAME || "").toLowerCase().includes(query) ||
        String(row.PROD_REQUEST_NO || "").toLowerCase().includes(query) ||
        String(row.PLAN_ID || "").toLowerCase().includes(query) ||
        String(row.PLAN_EQ || "").toLowerCase().includes(query) ||
        String(row.CUST_NAME_KD || "").toLowerCase().includes(query)
      );
    });
  }, [datasxtable, quickSearchText]);

  // Thống kê chuỗi tiến độ công đoạn dây chuyền cuộn liệu
  const pipelineSummary = useMemo<PipelineSummary>(() => {
    const helper = (field: keyof MATERIAL_STATUS): PipelineStageCount => {
      let pass = 0,
        warn = 0,
        none = 0;
      for (const row of datasxtable) {
        const val = row[field];
        if (val === "Y") pass++;
        else if (val === "R") warn++;
        else none++;
      }
      return { pass, warn, none };
    };

    return {
      xuatKho: helper("XUAT_KHO"),
      vaoFR: helper("VAO_FR"),
      vaoSR: helper("VAO_SR"),
      vaoDC: helper("VAO_DC"),
      vaoED: helper("VAO_ED"),
      confirmGiaoNhan: helper("CONFIRM_GIAONHAN"),
      vaoKiem: helper("VAO_KIEM"),
      raKiem: helper("RA_KIEM"),
    };
  }, [datasxtable]);

  // Thống kê bổ sung cho các Micro-cards KPI
  const extraKpi = useMemo(() => {
    const totalLots = datasxtable.length;
    const avgMetPerLot =
      totalLots > 0 ? lossTableInfo.XUATKHO_MET / totalLots : 0;
    const passRate =
      lossTableInfo.XUATKHO_MET > 0
        ? (lossTableInfo.INSPECTION_OK / lossTableInfo.XUATKHO_MET) * 100
        : 0;

    let totalInspectOkEA = 0;
    let totalInsOutputEA = 0;
    const planSet = new Set<string>();
    const matSet = new Set<string>();

    for (const r of datasxtable) {
      totalInspectOkEA += r.INSPECT_OK_EA || 0;
      totalInsOutputEA += r.INS_OUTPUT_EA || 0;
      if (r.PLAN_ID) planSet.add(r.PLAN_ID);
      if (r.M_NAME) matSet.add(r.M_NAME);
    }

    return {
      totalLots,
      avgMetPerLot,
      passRate,
      totalInspectOkEA,
      totalInsOutputEA,
      uniquePlans: planSet.size,
      uniqueMaterials: matSet.size,
    };
  }, [datasxtable, lossTableInfo]);

  // Chuyển đổi chế độ biểu đồ Ngày / Tuần
  const toggleDailyWeekly = useCallback(
    (isDaily: boolean) => {
      setDailyGraph(isDaily);
      loadRollLoss(isDaily, filters.fromdate, filters.todate);
    },
    [filters.fromdate, filters.todate, loadRollLoss]
  );

  // Xuất Excel EX1 (dữ liệu đang hiển thị theo bộ lọc)
  const handleExportEX1 = useCallback(() => {
    const targetData = filteredData.length > 0 ? filteredData : datasxtable;
    if (targetData.length === 0) {
      Swal.fire("Thông Báo", "Không có dữ liệu để xuất Excel!", "warning");
      return;
    }
    SaveExcel(
      targetData,
      `TINH_HINH_CUON_LIEU_FILTERED_${moment().format("YYYYMMDD_HHmmss")}`
    );
  }, [filteredData, datasxtable]);

  // Xuất Excel EX2 (toàn bộ dữ liệu)
  const handleExportEX2 = useCallback(() => {
    if (datasxtable.length === 0) {
      Swal.fire("Thông Báo", "Không có dữ liệu để xuất Excel!", "warning");
      return;
    }
    SaveExcel(
      datasxtable,
      `TINH_HINH_CUON_LIEU_ALL_${moment().format("YYYYMMDD_HHmmss")}`
    );
  }, [datasxtable]);

  // Toggle Toàn màn hình
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        });
      }
    }
  }, []);

  return {
    filters,
    handleFilterChange,
    machineList,
    datasxtable,
    filteredData,
    quickSearchText,
    setQuickSearchText,
    showChart,
    setShowChart,
    dailyGraph,
    toggleDailyWeekly,
    showPivotModal,
    setShowPivotModal,
    isFullscreen,
    toggleFullscreen,
    lossRollData,
    lossTableInfo,
    pipelineSummary,
    extraKpi,
    handleLoadData,
    handleExportEX1,
    handleExportEX2,
  };
};
