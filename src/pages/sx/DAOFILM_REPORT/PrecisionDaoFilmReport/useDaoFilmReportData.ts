import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  DaoFilmReportBackData,
  DaoFilmReportDetailData,
  DaoFilmReportPieData,
  DaoFilmReportQueryPayload,
  DaoFilmReportWidgetData,
  f_loadDaoFilmReportBackData,
  f_loadDaoFilmReportDetailData,
  f_loadDaoFilmReportExportPieData,
  f_loadDaoFilmReportUsagePieData,
  f_loadDaoFilmReportWidgetData,
} from "../../utils/daoFilmReportUtils";

export const defaultWidgetData: DaoFilmReportWidgetData = {
  Total_Knife: 0,
  Total_OK_Knife: 0,
  Total_NG_Knife: 0,
};

export const usageColors = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
export const exportColors = ["#1d4ed8", "#059669", "#d97706", "#dc2626", "#7c3aed", "#0f766e"];

export type MobileTabType = "BACK_DATA" | "DETAIL_DATA";

export function useDaoFilmReportData() {
  const [fromDate, setFromDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [useAllTime, setUseAllTime] = useState<boolean>(true);

  const [tableData, setTableData] = useState<DaoFilmReportBackData[]>([]);
  const [detailTableData, setDetailTableData] = useState<DaoFilmReportDetailData[]>([]);
  const [selectedKnife, setSelectedKnife] = useState<{ MA_DAO: string; MA_DAO_KT: string } | null>(
    null,
  );
  const [activePayload, setActivePayload] = useState<DaoFilmReportQueryPayload | null>(null);
  const [widgetData, setWidgetData] = useState<DaoFilmReportWidgetData>(defaultWidgetData);
  const [usagePieData, setUsagePieData] = useState<DaoFilmReportPieData[]>([]);
  const [exportPieData, setExportPieData] = useState<DaoFilmReportPieData[]>([]);

  // Mobile-specific state
  const [loading, setLoading] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTabType>("BACK_DATA");
  const [showKpi, setShowKpi] = useState<boolean>(true);
  const [showChartsModal, setShowChartsModal] = useState<boolean>(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  const buildPayload = useCallback((): DaoFilmReportQueryPayload => {
    const today = moment().format("YYYY-MM-DD");

    if (useAllTime) {
      return {
        FROM_DATE: "2020-01-01",
        TO_DATE: today,
        USE_ALL_TIME: true,
      };
    }

    return {
      FROM_DATE: fromDate,
      TO_DATE: toDate,
      USE_ALL_TIME: false,
    };
  }, [useAllTime, fromDate, toDate]);

  const loadData = useCallback(async () => {
    setLoading(true);
    Swal.fire({
      title: "Tra data",
      text: "Dang tai Dao Film Report",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const payload = buildPayload();
      setActivePayload(payload);
      const [loadedTableData, loadedWidgetData, loadedUsagePieData, loadedExportPieData] =
        await Promise.all([
          f_loadDaoFilmReportBackData(payload),
          f_loadDaoFilmReportWidgetData(payload),
          f_loadDaoFilmReportUsagePieData(payload),
          f_loadDaoFilmReportExportPieData(payload),
        ]);

      setTableData(loadedTableData);
      setDetailTableData([]);
      setSelectedKnife(null);
      setWidgetData(loadedWidgetData);
      setUsagePieData(loadedUsagePieData);
      setExportPieData(loadedExportPieData);
      setLoading(false);

      Swal.fire("Thong bao", `Da load ${loadedTableData.length} dong`, "success");
    } catch (error: any) {
      setTableData([]);
      setDetailTableData([]);
      setSelectedKnife(null);
      setActivePayload(null);
      setWidgetData(defaultWidgetData);
      setUsagePieData([]);
      setExportPieData([]);
      setLoading(false);
      Swal.fire("Thong bao", `Loi: ${error?.message ?? error}`, "error");
    }
  }, [buildPayload]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalUsagePie = useMemo(() => {
    return usagePieData.reduce((sum, item) => sum + item.value, 0);
  }, [usagePieData]);

  const totalExportPie = useMemo(() => {
    return exportPieData.reduce((sum, item) => sum + item.value, 0);
  }, [exportPieData]);

  const loadDetailDataByRow = useCallback(
    async (row: DaoFilmReportBackData, autoSwitchTabOnMobile?: boolean) => {
      const selectedMA_DAO = row?.MA_DAO ?? "";
      const selectedMA_DAO_KT = row?.MA_DAO_KT ?? "";

      if (selectedMA_DAO === "" || selectedMA_DAO_KT === "") {
        setSelectedKnife(null);
        setDetailTableData([]);
        return;
      }

      setSelectedKnife({ MA_DAO: selectedMA_DAO, MA_DAO_KT: selectedMA_DAO_KT });

      try {
        const payload = {
          ...(activePayload ?? buildPayload()),
          MA_DAO: selectedMA_DAO,
          MA_DAO_KT: selectedMA_DAO_KT,
        };
        const loadedDetailData = await f_loadDaoFilmReportDetailData(payload);
        setDetailTableData(loadedDetailData);

        if (autoSwitchTabOnMobile) {
          setActiveMobileTab("DETAIL_DATA");
        }
      } catch (error: any) {
        setDetailTableData([]);
        Swal.fire("Thong bao", `Loi tai bang chi tiet: ${error?.message ?? error}`, "error");
      }
    },
    [activePayload, buildPayload],
  );

  const resetFilters = useCallback(() => {
    setUseAllTime(true);
    setFromDate(moment().format("YYYY-MM-DD"));
    setToDate(moment().format("YYYY-MM-DD"));
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (!useAllTime) count += 1;
    return count;
  }, [useAllTime]);

  const filteredTableData = useMemo(() => {
    if (!searchKeyword.trim()) return tableData;
    const kw = searchKeyword.trim().toLowerCase();
    return tableData.filter((item) => {
      return (
        item.MA_DAO.toLowerCase().includes(kw) ||
        item.MA_DAO_KT.toLowerCase().includes(kw) ||
        item.OVER_STATUS.toLowerCase().includes(kw) ||
        item.NGAY_BAN_GIAO.toLowerCase().includes(kw)
      );
    });
  }, [tableData, searchKeyword]);

  const filteredDetailTableData = useMemo(() => {
    if (!searchKeyword.trim()) return detailTableData;
    const kw = searchKeyword.trim().toLowerCase();
    return detailTableData.filter((item) => {
      return (
        item.G_CODE.toLowerCase().includes(kw) ||
        item.G_NAME.toLowerCase().includes(kw) ||
        item.PLAN_ID.toLowerCase().includes(kw) ||
        item.SX_EMPL.toLowerCase().includes(kw) ||
        item.EMPL_NO.toLowerCase().includes(kw) ||
        item.MA_DAO.toLowerCase().includes(kw) ||
        item.MA_DAO_KT.toLowerCase().includes(kw)
      );
    });
  }, [detailTableData, searchKeyword]);

  return {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    useAllTime,
    setUseAllTime,
    tableData,
    filteredTableData,
    detailTableData,
    filteredDetailTableData,
    selectedKnife,
    setSelectedKnife,
    widgetData,
    usagePieData,
    exportPieData,
    totalUsagePie,
    totalExportPie,
    loading,
    searchKeyword,
    setSearchKeyword,
    activeMobileTab,
    setActiveMobileTab,
    showKpi,
    setShowKpi,
    showChartsModal,
    setShowChartsModal,
    showFilterDrawer,
    setShowFilterDrawer,
    activeFilterCount,
    loadData,
    loadDetailDataByRow,
    resetFilters,
  };
}
