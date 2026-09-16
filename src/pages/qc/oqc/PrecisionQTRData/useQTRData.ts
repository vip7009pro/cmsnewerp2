import { useState, useMemo, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { f_loadQTRData } from "../../utils/qcUtils";
import { SaveExcel } from "../../../../api/services/excelService";
import { QTR_DATA } from "../QTR_DATA";

export const useQTRData = () => {
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [btpData, setBTPData] = useState<Array<QTR_DATA>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Tải dữ liệu QTR
  const handleLoadQTRData = useCallback(async () => {
    setIsLoading(true);
    try {
      const kq: QTR_DATA[] = await f_loadQTRData({
        FROM_DATE: fromdate,
        TO_DATE: todate,
      });

      const loadedData = (kq || []).map((ele: QTR_DATA, index: number) => ({
        ...ele,
        id: index,
      }));

      setBTPData(loadedData);
      Swal.fire("Thông báo", `Đã load: ${loadedData.length} dòng`, "success");
    } catch (error) {
      console.error("Lỗi f_loadQTRData:", error);
      Swal.fire("Lỗi", "Không thể tải dữ liệu QTR", "error");
    } finally {
      setIsLoading(false);
    }
  }, [fromdate, todate]);

  // Xử lý phím Enter
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleLoadQTRData();
      }
    },
    [handleLoadQTRData]
  );

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch((err) => {
        console.error("Lỗi khi mở Fullscreen:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch((err) => {
        console.error("Lỗi khi thoát Fullscreen:", err);
      });
      setIsFullscreen(false);
    }
  }, []);

  // Lọc dữ liệu theo Quick Filter
  const filteredData = useMemo(() => {
    if (!quickFilterText.trim()) return btpData;
    const q = quickFilterText.toLowerCase().trim();
    return btpData.filter((item) => {
      return (
        item.MANAGEMENT_NUMBER?.toLowerCase().includes(q) ||
        item.PART_CODE?.toLowerCase().includes(q) ||
        item.PART_NAME?.toLowerCase().includes(q) ||
        item.PROJECT?.toLowerCase().includes(q) ||
        item.DEFECT_DETAILS?.toLowerCase().includes(q) ||
        item.TITLE?.toLowerCase().includes(q) ||
        item.PLANT?.toLowerCase().includes(q) ||
        item.APPROVAL?.toLowerCase().includes(q) ||
        item.G_CODE?.toLowerCase().includes(q) ||
        item.G_NAME?.toLowerCase().includes(q)
      );
    });
  }, [btpData, quickFilterText]);

  // Tính toán Realtime KPI & Widgets Thống Kê Hữu Ích
  const kpiMetrics = useMemo(() => {
    const totalCases = btpData.length;
    let completedCases = 0;
    let totalDefectQty = 0;
    let totalWHOutQty = 0;
    let totalSampleQty = 0;
    let criticalCases = 0;
    let plantNM1Count = 0;
    let plantNM2Count = 0;
    let occurMainCount = 0;
    let occurSubCount = 0;

    const uniqueProjects = new Set<string>();
    const uniqueParts = new Set<string>();

    for (let i = 0; i < totalCases; i++) {
      const row = btpData[i];
      if (row.APPROVAL === "Hoàn thành") {
        completedCases++;
      }

      const defQty = Number(row.DEFECT_QTY) || 0;
      const whQty = Number(row.WH_OUT_QTY) || 0;
      const qtrPpm = Number(row.QTR_PPM) || 0;
      const occurPlace = String(row.OCCUR_PLACE || "");

      totalDefectQty += defQty;
      totalWHOutQty += whQty;
      totalSampleQty += Number(row.SAMPLE_QTY) || 0;

      // Tiêu chuẩn cảnh báo nghiêm trọng
      if (whQty >= 100000 && qtrPpm >= 500 && occurPlace === "Main") {
        criticalCases++;
      }

      if (row.PROJECT) uniqueProjects.add(row.PROJECT);
      if (row.PART_CODE) uniqueParts.add(row.PART_CODE);

      const pName = String(row.PLANT || "").toUpperCase();
      if (pName.includes("NM1") || pName.includes("1")) plantNM1Count++;
      else if (pName.includes("NM2") || pName.includes("2")) plantNM2Count++;

      if (occurPlace.toLowerCase() === "main") occurMainCount++;
      else occurSubCount++;
    }

    const pendingCases = totalCases - completedCases;
    const resolutionRate = totalCases > 0 ? (completedCases / totalCases) * 100 : 0;
    const avgPPM =
      totalWHOutQty > 0
        ? Math.round((totalDefectQty / totalWHOutQty) * 1000000)
        : totalCases > 0
        ? Math.round(
            btpData.reduce((acc, x) => acc + (Number(x.QTR_PPM) || 0), 0) /
              totalCases
          )
        : 0;

    return {
      totalCases,
      completedCases,
      pendingCases,
      resolutionRate,
      totalDefectQty,
      totalWHOutQty,
      totalSampleQty,
      avgPPM,
      criticalCases,
      uniqueProjectsCount: uniqueProjects.size,
      uniquePartsCount: uniqueParts.size,
      plantNM1Count,
      plantNM2Count,
      occurMainCount,
      occurSubCount,
    };
  }, [btpData]);

  // Xuất file Excel
  const exportExcelFiltered = useCallback(() => {
    if (filteredData.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    SaveExcel(filteredData, `QTR_DATA_Filtered_${fromdate}_${todate}`);
  }, [filteredData, fromdate, todate]);

  const exportExcelAll = useCallback(() => {
    if (btpData.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    SaveExcel(btpData, `QTR_DATA_All_${fromdate}_${todate}`);
  }, [btpData, fromdate, todate]);

  return {
    fromdate,
    setFromDate,
    todate,
    setToDate,
    btpData,
    filteredData,
    handleLoadQTRData,
    handleSearchKeyDown,
    isLoading,
    quickFilterText,
    setQuickFilterText,
    isFullscreen,
    toggleFullscreen,
    kpiMetrics,
    exportExcelFiltered,
    exportExcelAll,
  };
};
