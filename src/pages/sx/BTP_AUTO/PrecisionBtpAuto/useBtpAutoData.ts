import { useState, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import { BTP_AUTO_DATA2, BTP_AUTO_DATA_SUMMARY } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { f_load_BTP_Auto, f_load_BTP_Summary_Auto } from "../../../qlsx/QLSXPLAN/utils/khsxUtils";
import { f_updateBTP_M100 } from "../../../../api/services/inventoryService";
import { SaveExcel } from "../../../../api/services/excelService";

export type ViewMode = "detail" | "summary";
export type XuongFilter = "ALL" | "A" | "B";

export interface BtpKpiData {
  totalBtp: number;
  totalXA: number;
  totalXB: number;
  totalLots: number;
  uniqueGCodes: number;
  factoryBreakdown: Record<string, number>;
}

export const useBtpAutoData = () => {
  const [btpData, setBTPData] = useState<Array<any>>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("detail");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [showGiaoNhan, setShowGiaoNhan] = useState(false);

  // Bộ lọc mở rộng cho cả Desktop & Mobile
  const [filterXuong, setFilterXuong] = useState<XuongFilter>("ALL");
  const [filterFactory, setFilterFactory] = useState<string>("ALL");
  const [onlyPositive, setOnlyPositive] = useState<boolean>(false);

  // ===== API: Load Detail Data =====
  const handleLoadDetail = useCallback(async () => {
    setIsLoading(true);
    try {
      await f_updateBTP_M100();
      const kq: BTP_AUTO_DATA2[] = await f_load_BTP_Auto();
      setBTPData(
        kq.map((ele: BTP_AUTO_DATA2, index: number) => ({
          ...ele,
          INS_DATE:
            ele.INS_DATE !== null
              ? moment.utc(ele.INS_DATE).format("YYYY-MM-DD HH:mm:ss")
              : "",
          id: index,
        }))
      );
      setLastUpdated(moment().format("HH:mm:ss"));
      Swal.fire("Thông báo", "Đã load: " + kq.length + " dòng", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", "Không thể tải dữ liệu Detail", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ===== API: Load Summary Data =====
  const handleLoadSummary = useCallback(async () => {
    setIsLoading(true);
    try {
      await f_updateBTP_M100();
      const kq: BTP_AUTO_DATA_SUMMARY[] = await f_load_BTP_Summary_Auto();
      setBTPData(
        kq.map((ele: BTP_AUTO_DATA_SUMMARY, index: number) => ({
          ...ele,
          id: index,
        }))
      );
      setLastUpdated(moment().format("HH:mm:ss"));
      Swal.fire("Thông báo", "Đã load: " + kq.length + " dòng", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", "Không thể tải dữ liệu Summary", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ===== Switch View Mode =====
  const handleSwitchMode = useCallback(
    async (mode: ViewMode) => {
      setViewMode(mode);
      setSearchKeyword("");
      setBTPData([]);
      if (mode === "detail") {
        await handleLoadDetail();
      } else {
        await handleLoadSummary();
      }
    },
    [handleLoadDetail, handleLoadSummary]
  );

  // ===== Danh Sách Nhà Máy Động =====
  const factoryList = useMemo(() => {
    const set = new Set<string>();
    btpData.forEach((row) => {
      const f = row.FACTORY || row.FINAL_FACTORY;
      if (f) set.add(String(f).trim());
    });
    return ["ALL", ...Array.from(set).sort()];
  }, [btpData]);

  // ===== Bộ Lọc Dữ Liệu Đa Chiều =====
  const filteredData = useMemo(() => {
    let list = btpData;

    // 1. Lọc theo từ khóa tìm kiếm
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase().trim();
      list = list.filter((row) =>
        Object.values(row).some(
          (val) => val != null && String(val).toLowerCase().includes(kw)
        )
      );
    }

    // 2. Lọc theo Xưởng (A / B)
    if (filterXuong !== "ALL") {
      if (viewMode === "detail") {
        list = list.filter((row) => {
          const xuong = String(row.XUONG || row.FINAL_XUONG || "").toUpperCase();
          if (filterXuong === "A") return xuong.includes("A") || xuong === "XA";
          if (filterXuong === "B") return xuong.includes("B") || xuong === "XB";
          return true;
        });
      } else {
        // Summary mode
        list = list.filter((row) => {
          if (filterXuong === "A") return Number(row.XA) > 0;
          if (filterXuong === "B") return Number(row.XB) > 0;
          return true;
        });
      }
    }

    // 3. Lọc theo Nhà máy
    if (filterFactory !== "ALL") {
      list = list.filter((row) => {
        const f = String(row.FACTORY || row.FINAL_FACTORY || "").trim();
        return f === filterFactory;
      });
    }

    // 4. Lọc chỉ lấy dòng có tồn > 0
    if (onlyPositive) {
      if (viewMode === "detail") {
        list = list.filter(
          (row) =>
            (Number(row.TEMP_QTY_EA) || 0) > 0 ||
            (Number(row.REMAIN_QTY_M) || 0) > 0
        );
      } else {
        list = list.filter((row) => (Number(row.TOTAL_BTP) || 0) > 0);
      }
    }

    return list;
  }, [btpData, searchKeyword, filterXuong, filterFactory, onlyPositive, viewMode]);

  // ===== Đếm Số Lượng Bộ Lọc Đang Hoạt Động =====
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterXuong !== "ALL") count++;
    if (filterFactory !== "ALL") count++;
    if (onlyPositive) count++;
    return count;
  }, [filterXuong, filterFactory, onlyPositive]);

  // ===== Reset Bộ Lọc =====
  const resetFilters = useCallback(() => {
    setFilterXuong("ALL");
    setFilterFactory("ALL");
    setOnlyPositive(false);
    setSearchKeyword("");
  }, []);

  // ===== KPI Calculation =====
  const kpiData = useMemo<BtpKpiData>(() => {
    if (viewMode === "summary") {
      let totalXA = 0,
        totalXB = 0,
        totalBtp = 0;
      btpData.forEach((row) => {
        totalXA += Number(row.XA) || 0;
        totalXB += Number(row.XB) || 0;
        totalBtp += Number(row.TOTAL_BTP) || 0;
      });
      return {
        totalBtp,
        totalXA,
        totalXB,
        totalLots: btpData.length,
        uniqueGCodes: new Set(btpData.map((r) => r.G_CODE)).size,
        factoryBreakdown: {},
      };
    }
    // Detail mode
    let totalEA = 0;
    const gCodeSet = new Set<string>();
    const factoryMap: Record<string, number> = {};
    const xuongA: number[] = [];
    const xuongB: number[] = [];

    btpData.forEach((row) => {
      const ea = Number(row.TEMP_QTY_EA) || 0;
      totalEA += ea;
      if (row.G_CODE) gCodeSet.add(row.G_CODE);
      const factory = row.FACTORY || row.FINAL_FACTORY || "N/A";
      factoryMap[factory] = (factoryMap[factory] || 0) + ea;
      const xuong = row.XUONG || row.FINAL_XUONG || "";
      if (xuong.includes("A") || xuong === "XA") xuongA.push(ea);
      else if (xuong.includes("B") || xuong === "XB") xuongB.push(ea);
    });

    const sumA = xuongA.reduce((s, v) => s + v, 0);
    const sumB = xuongB.reduce((s, v) => s + v, 0);

    return {
      totalBtp: totalEA,
      totalXA: sumA,
      totalXB: sumB,
      totalLots: btpData.length,
      uniqueGCodes: gCodeSet.size,
      factoryBreakdown: factoryMap,
    };
  }, [btpData, viewMode]);

  // ===== Excel Export =====
  const handleExportExcel = useCallback(
    (type: "EX1" | "EX2") => {
      const dataToExport = type === "EX1" ? filteredData : btpData;
      if (dataToExport.length === 0) {
        Swal.fire("Thông báo", "Không có dữ liệu để xuất", "warning");
        return;
      }
      const suffix = viewMode === "detail" ? "Detail" : "Summary";
      const label = type === "EX1" ? "Filtered" : "All";
      SaveExcel(
        dataToExport,
        `BTP_${suffix}_${label}_${moment().format("YYYYMMDD_HHmmss")}`
      );
    },
    [filteredData, btpData, viewMode]
  );

  return {
    btpData,
    filteredData,
    viewMode,
    searchKeyword,
    setSearchKeyword,
    isLoading,
    lastUpdated,
    showGiaoNhan,
    setShowGiaoNhan,
    kpiData,
    filterXuong,
    setFilterXuong,
    filterFactory,
    setFilterFactory,
    onlyPositive,
    setOnlyPositive,
    activeFilterCount,
    factoryList,
    resetFilters,
    handleSwitchMode,
    handleLoadDetail,
    handleLoadSummary,
    handleExportExcel,
  };
};
