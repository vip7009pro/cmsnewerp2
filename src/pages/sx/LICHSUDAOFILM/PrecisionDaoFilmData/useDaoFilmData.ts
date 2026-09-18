import { useState, useMemo, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode } from "../../../../api/Api";
import { SaveExcel } from "../../../../api/services/excelService";
import { DAO_FILM_DATA } from "../../../qc/interfaces/qcInterface";
import { QUANLYDAOFILM_DATA, XUATDAOFILM_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import {
  DaoFilmMode,
  DaoFilmView,
  filterDaoFilmData,
  calculateKpiData,
  calculateTypeDistribution,
  calculateTopPress,
  calculateDailyTrend,
  calculateFactoryStatus,
} from "./daoFilmDataHelpers";

export * from "./daoFilmDataHelpers";

export const useDaoFilmData = () => {
  const [mode, setMode] = useState<DaoFilmMode>("GIAO_NHAN");
  const [viewMode, setViewMode] = useState<DaoFilmView>("all");
  const [fromDate, setFromDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState<string>("");
  const [codeCMS, setCodeCMS] = useState<string>("");
  const [knifeType, setKnifeType] = useState<string>("All");
  const [factory, setFactory] = useState<string>("All");
  const [planId, setPlanId] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [allTime, setAllTime] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showGiaoNhan, setShowGiaoNhan] = useState<boolean>(false);
  const [rawData, setRawData] = useState<any[]>([]);

  // 1. Fetch Lịch Sử Giao Nhận
  const fetchGiaoNhan = useCallback(async () => {
    setLoading(true);
    try {
      const response = await generalQuery("tradaofilm", {
        ALLTIME: allTime,
        FROM_DATE: fromDate,
        TO_DATE: toDate,
        G_CODE: codeCMS,
        G_NAME: codeKD,
        FACTORY: factory,
      });

      if (response.data.tk_status !== "NG") {
        const loadeddata = response.data.data.map((el: DAO_FILM_DATA, idx: number) => ({
          ...el,
          NGAYBANGIAO: el.NGAYBANGIAO ? moment.utc(el.NGAYBANGIAO).format("YYYY-MM-DD") : "",
          CFM_DATE: el.CFM_DATE !== null ? moment.utc(el.CFM_DATE).format("YYYY-MM-DD HH:mm:ss") : "",
          G_NAME: getAuditMode() === 0 ? el?.G_NAME : el?.G_NAME?.search("CNDB") === -1 ? el?.G_NAME : "TEM_NOI_BO",
          id: idx,
        }));
        setRawData(loadeddata);
        setMode("GIAO_NHAN");
        Swal.fire("Thông báo", `Đã tải ${loadeddata.length} dòng dữ liệu giao nhận`, "success");
      } else {
        setRawData([]);
        Swal.fire("Thông báo", `Nội dung: ${response.data.message}`, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", "Không thể tải dữ liệu giao nhận", "error");
    } finally {
      setLoading(false);
    }
  }, [allTime, fromDate, toDate, codeCMS, codeKD, factory]);

  // 2. Fetch Quản Lý Dao Film
  const fetchQuanLy = useCallback(async () => {
    setLoading(true);
    try {
      const response = await generalQuery("loadquanlydaofilm", {
        ALLTIME: allTime,
        FROM_DATE: fromDate,
        TO_DATE: toDate,
        G_CODE: codeCMS,
        G_NAME: codeKD,
        FACTORY: factory,
        KNIFE_TYPE: knifeType,
      });

      if (response.data.tk_status !== "NG") {
        const loadeddata = response.data.data.map((el: QUANLYDAOFILM_DATA, idx: number) => ({
          ...el,
          INS_DATE: el.INS_DATE ? moment.utc(el.INS_DATE).format("YYYY-MM-DD HH:mm:ss") : "",
          UPD_DATE: el.UPD_DATE !== null ? moment.utc(el.UPD_DATE).format("YYYY-MM-DD HH:mm:ss") : "",
          G_NAME: getAuditMode() === 0 ? el?.G_NAME : el?.G_NAME?.search("CNDB") === -1 ? el?.G_NAME : "TEM_NOI_BO",
          id: idx,
        }));
        setRawData(loadeddata);
        setMode("QUAN_LY");
        Swal.fire("Thông báo", `Đã tải ${loadeddata.length} dòng quản lý dao film`, "success");
      } else {
        setRawData([]);
        Swal.fire("Thông báo", `Nội dung: ${response.data.message}`, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", "Không thể tải danh sách quản lý dao film", "error");
    } finally {
      setLoading(false);
    }
  }, [allTime, fromDate, toDate, codeCMS, codeKD, factory, knifeType]);

  // 3. Fetch Lịch Sử Xuất Dao Film
  const fetchLichSuXuat = useCallback(async () => {
    setLoading(true);
    try {
      const response = await generalQuery("lichsuxuatdaofilm", {
        ALLTIME: allTime,
        FROM_DATE: fromDate,
        TO_DATE: toDate,
        G_CODE: codeCMS,
        G_NAME: codeKD,
        FACTORY: factory,
        PLAN_ID: planId,
      });

      if (response.data.tk_status !== "NG") {
        const loadeddata = response.data.data.map((el: XUATDAOFILM_DATA, idx: number) => ({
          ...el,
          PLAN_DATE: el.PLAN_DATE !== null ? moment.utc(el.PLAN_DATE).format("YYYY-MM-DD") : "",
          INS_DATE: el.INS_DATE !== null ? moment.utc(el.INS_DATE).format("YYYY-MM-DD HH:mm:ss") : "",
          SX_DATE: el.SX_DATE !== null ? moment.utc(el.SX_DATE).format("YYYY-MM-DD") : "",
          UPD_DATE: el.UPD_DATE !== null ? moment.utc(el.UPD_DATE).format("YYYY-MM-DD HH:mm:ss") : "",
          G_NAME: getAuditMode() === 0 ? el?.G_NAME : el?.G_NAME?.search("CNDB") === -1 ? el?.G_NAME : "TEM_NOI_BO",
          id: idx,
        }));
        setRawData(loadeddata);
        setMode("XUAT_DAO_FILM");
        Swal.fire("Thông báo", `Đã tải ${loadeddata.length} dòng lịch sử xuất dao film`, "success");
      } else {
        setRawData([]);
        Swal.fire("Thông báo", `Nội dung: ${response.data.message}`, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", "Không thể tải lịch sử xuất dao film", "error");
    } finally {
      setLoading(false);
    }
  }, [allTime, fromDate, toDate, codeCMS, codeKD, factory, planId]);

  // Reload current mode
  const reloadCurrent = useCallback(() => {
    if (mode === "GIAO_NHAN") fetchGiaoNhan();
    else if (mode === "QUAN_LY") fetchQuanLy();
    else fetchLichSuXuat();
  }, [mode, fetchGiaoNhan, fetchQuanLy, fetchLichSuXuat]);

  // Quick select date preset
  const setQuickDate = useCallback((days: number) => {
    setAllTime(false);
    setToDate(moment().format("YYYY-MM-DD"));
    if (days === 1) {
      setFromDate(moment().format("YYYY-MM-DD"));
    } else {
      setFromDate(moment().subtract(days - 1, "days").format("YYYY-MM-DD"));
    }
  }, []);

  // Filtered Data via Quick Search
  const filteredData = useMemo(() => {
    return filterDaoFilmData(rawData, searchKeyword);
  }, [rawData, searchKeyword]);

  // Aggregated KPI
  const kpiData = useMemo(() => {
    return calculateKpiData(rawData);
  }, [rawData]);

  // Chart 1: Type Distribution
  const typeDistributionData = useMemo(() => {
    return calculateTypeDistribution(rawData);
  }, [rawData]);

  // Chart 2: Top Press vs Standard Press
  const topPressData = useMemo(() => {
    return calculateTopPress(rawData);
  }, [rawData]);

  // Chart 3: Daily Trend
  const dailyTrendData = useMemo(() => {
    return calculateDailyTrend(rawData);
  }, [rawData]);

  // Chart 4: Factory & Status Distribution
  const factoryStatusData = useMemo(() => {
    return calculateFactoryStatus(rawData);
  }, [rawData]);

  // Excel Handlers
  const handleExportEX1 = useCallback(() => {
    SaveExcel(filteredData, `DaoFilm_${mode}_Filtered`);
  }, [filteredData, mode]);

  const handleExportEX2 = useCallback(() => {
    SaveExcel(rawData, `DaoFilm_${mode}_All`);
  }, [rawData, mode]);

  return {
    mode,
    setMode,
    viewMode,
    setViewMode,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    codeKD,
    setCodeKD,
    codeCMS,
    setCodeCMS,
    knifeType,
    setKnifeType,
    factory,
    setFactory,
    planId,
    setPlanId,
    id,
    setId,
    allTime,
    setAllTime,
    searchKeyword,
    setSearchKeyword,
    loading,
    showGiaoNhan,
    setShowGiaoNhan,
    rawData,
    filteredData,
    kpiData,
    typeDistributionData,
    topPressData,
    dailyTrendData,
    factoryStatusData,
    fetchGiaoNhan,
    fetchQuanLy,
    fetchLichSuXuat,
    reloadCurrent,
    setQuickDate,
    handleExportEX1,
    handleExportEX2,
  };
};
