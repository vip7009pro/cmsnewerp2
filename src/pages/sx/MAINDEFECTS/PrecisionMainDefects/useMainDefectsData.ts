import { useState, useEffect, useMemo, useCallback } from "react";
import moment from "moment";
import { DEFECT_PROCESS_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { f_loadDefectProcessData } from "../../../qlsx/QLSXPLAN/utils/khsxUtils";
import { SaveExcel } from "../../../../api/services/excelService";
import {
  calculateDefectsKpi,
  getTop10Defects,
  getProcessDistribution,
  getCreationTrend,
  getTop10Models,
  safeIncludes,
  safeStringTrim,
} from "./mainDefectsHelpers";

export interface ModalImageData {
  imageSrc: string;
  title: string;
  item: DEFECT_PROCESS_DATA;
}

export const useMainDefectsData = () => {
  const [rawData, setRawData] = useState<DEFECT_PROCESS_DATA[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Filters
  const [fromDate, setFromDate] = useState<string>(moment().subtract(90, "days").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [allTime, setAllTime] = useState<boolean>(true);
  const [codeKD, setCodeKD] = useState<string>("");
  const [codeCMS, setCodeCMS] = useState<string>("");
  const [prodModel, setProdModel] = useState<string>("");
  const [processNumber, setProcessNumber] = useState<string>("All");
  const [useYn, setUseYn] = useState<string>("All");
  const [imageYn, setImageYn] = useState<string>("All");
  const [quickSearch, setQuickSearch] = useState<string>("");

  // Tabs & Modal
  const [activeTab, setActiveTab] = useState<"all" | "charts" | "grid">("all");
  const [selectedImage, setSelectedImage] = useState<ModalImageData | null>(null);

  const handleLoadData = useCallback(async () => {
    setLoading(true);
    try {
      const kq = await f_loadDefectProcessData("", -1);
      const formatted = (kq || []).map((ele: DEFECT_PROCESS_DATA, idx: number) => ({
        ...ele,
        id: ele.NG_SX100_ID !== undefined && ele.NG_SX100_ID !== null ? String(ele.NG_SX100_ID) : `defect_${idx}`,
        INS_DATE: ele.INS_DATE ? moment(ele.INS_DATE).format("YYYY-MM-DD HH:mm:ss") : "",
        UPD_DATE: ele.UPD_DATE ? moment(ele.UPD_DATE).format("YYYY-MM-DD HH:mm:ss") : "",
      }));
      setRawData(formatted);
    } catch (err) {
      console.error("Lỗi khi tải danh sách tiêu chuẩn lỗi:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleLoadData();
  }, [handleLoadData]);

  // Unique Process Numbers for filter dropdown
  const processOptions = useMemo(() => {
    const set = new Set<number>();
    rawData.forEach((item) => {
      if (item.PROCESS_NUMBER !== null && item.PROCESS_NUMBER !== undefined) {
        set.add(Number(item.PROCESS_NUMBER));
      }
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [rawData]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    const kw = quickSearch.trim().toLowerCase();
    const kd = codeKD.trim().toLowerCase();
    const cms = codeCMS.trim().toLowerCase();
    const mdl = prodModel.trim().toLowerCase();

    return rawData.filter((item) => {
      // Date filter
      if (!allTime && item.INS_DATE) {
        const itemDate = moment(item.INS_DATE);
        if (itemDate.isBefore(moment(fromDate).startOf("day")) || itemDate.isAfter(moment(toDate).endOf("day"))) {
          return false;
        }
      }

      // Dropdown Process Number
      if (processNumber !== "All" && String(item.PROCESS_NUMBER) !== processNumber) {
        return false;
      }

      // Dropdown USE_YN
      if (useYn !== "All" && item.USE_YN !== useYn) {
        return false;
      }

      // Dropdown IMAGE_YN
      if (imageYn === "YES") {
        const hasImg = item.IMAGE_YN === "Y" || safeStringTrim(item.INS_PATROL_ID) !== "";
        if (!hasImg) return false;
      } else if (imageYn === "NO") {
        const hasImg = item.IMAGE_YN === "Y" || safeStringTrim(item.INS_PATROL_ID) !== "";
        if (hasImg) return false;
      }

      // Input codeKD
      if (kd && !safeIncludes(item.G_NAME, kd) && !safeIncludes(item.DESCR, kd)) {
        return false;
      }

      // Input codeCMS
      if (cms && !safeIncludes(item.G_CODE, cms)) {
        return false;
      }

      // Input Model
      if (mdl && !safeIncludes(item.PROD_MODEL, mdl)) {
        return false;
      }

      // Quick Search across multiple fields
      if (kw) {
        const match =
          safeIncludes(item.NG_SX100_ID, kw) ||
          safeIncludes(item.G_CODE, kw) ||
          safeIncludes(item.G_NAME, kw) ||
          safeIncludes(item.PROD_MODEL, kw) ||
          safeIncludes(item.DEFECT, kw) ||
          safeIncludes(item.DESCR, kw) ||
          safeIncludes(item.TEST_ITEM, kw) ||
          safeIncludes(item.TEST_METHOD, kw) ||
          safeIncludes(item.INS_PATROL_ID, kw) ||
          safeIncludes(item.INS_EMPL, kw) ||
          safeIncludes(item.UPD_EMPL, kw);
        if (!match) return false;
      }

      return true;
    });
  }, [rawData, allTime, fromDate, toDate, processNumber, useYn, imageYn, codeKD, codeCMS, prodModel, quickSearch]);

  // Realtime KPIs
  const kpiSummary = useMemo(() => calculateDefectsKpi(filteredData), [filteredData]);

  // Recharts Chart datasets
  const top10Defects = useMemo(() => getTop10Defects(filteredData), [filteredData]);
  const processDistribution = useMemo(() => getProcessDistribution(filteredData), [filteredData]);
  const creationTrend = useMemo(() => getCreationTrend(filteredData), [filteredData]);
  const top10Models = useMemo(() => getTop10Models(filteredData), [filteredData]);

  // Excel exports
  const handleExportEX1 = useCallback(() => {
    SaveExcel(filteredData, `MainDefects_Filtered_${moment().format("YYYYMMDD_HHmm")}`);
  }, [filteredData]);

  const handleExportEX2 = useCallback(() => {
    SaveExcel(rawData, `MainDefects_All_${moment().format("YYYYMMDD_HHmm")}`);
  }, [rawData]);

  return {
    rawData,
    filteredData,
    loading,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    allTime,
    setAllTime,
    codeKD,
    setCodeKD,
    codeCMS,
    setCodeCMS,
    prodModel,
    setProdModel,
    processNumber,
    setProcessNumber,
    processOptions,
    useYn,
    setUseYn,
    imageYn,
    setImageYn,
    quickSearch,
    setQuickSearch,
    activeTab,
    setActiveTab,
    selectedImage,
    setSelectedImage,
    kpiSummary,
    top10Defects,
    processDistribution,
    creationTrend,
    top10Models,
    handleLoadData,
    handleExportEX1,
    handleExportEX2,
  };
};
