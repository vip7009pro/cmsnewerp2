import { useState, useEffect, useTransition, useMemo, useCallback } from "react";
import moment from "moment";
import { generalQuery } from "../../../../api/Api";
import { TINH_HINH_CHOT_BC } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { SaveExcel } from "../../../../api/services/excelService";

export interface ExtendedTinhHinhChot extends TINH_HINH_CHOT_BC {
  id: number;
  TL_CHOT: number;
  TL_HIEUSUAT: number;
  FACTORY?: string;
}

export interface TinhHinhChotKpiStats {
  totalCommands: number;
  totalDaChot: number;
  totalChuaChot: number;
  totalDaNhapHS: number;
  totalChuaNhapHS: number;
  rateChot: number;
  rateHS: number;
  nm1Total: number;
  nm1DaChot: number;
  nm1ChuaChot: number;
  nm1DaNhapHS: number;
  nm1RateChot: number;
  nm2Total: number;
  nm2DaChot: number;
  nm2ChuaChot: number;
  nm2DaNhapHS: number;
  nm2RateChot: number;
}

export interface DailyChartItem {
  SX_DATE: string;
  TOTAL: number;
  DA_CHOT: number;
  CHUA_CHOT: number;
  DA_NHAP_HIEUSUAT: number;
  CHUA_NHAP_HIEUSUAT: number;
  TL_CHOT: number;
  TL_HIEUSUAT: number;
}

export type ViewMode = "SPLIT" | "NM1" | "NM2" | "CHARTS";
export type StatusChotFilter = "ALL" | "CHUA_CHOT" | "DA_CHOT";
export type StatusHSFilter = "ALL" | "CHUA_HS" | "DA_HS";

export const useTinhHinhChotData = () => {
  const [isPending, startTransition] = useTransition();
  const [rawDataNM1, setRawDataNM1] = useState<ExtendedTinhHinhChot[]>([]);
  const [rawDataNM2, setRawDataNM2] = useState<ExtendedTinhHinhChot[]>([]);
  const [loadingCount, setLoadingCount] = useState(0);
  const [searchNM1, setSearchNM1] = useState("");
  const [searchNM2, setSearchNM2] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("SPLIT");
  const [showCharts, setShowCharts] = useState(true);
  const [chartFactoryFilter, setChartFactoryFilter] = useState<"ALL" | "NM1" | "NM2">("ALL");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Bộ lọc mở rộng cho Mobile & Drawer
  const [statusChotFilter, setStatusChotFilter] = useState<StatusChotFilter>("ALL");
  const [statusHSFilter, setStatusHSFilter] = useState<StatusHSFilter>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (statusChotFilter !== "ALL") count++;
    if (statusHSFilter !== "ALL") count++;
    if (dateFrom) count++;
    if (dateTo) count++;
    return count;
  }, [statusChotFilter, statusHSFilter, dateFrom, dateTo]);

  const resetFilters = useCallback(() => {
    setStatusChotFilter("ALL");
    setStatusHSFilter("ALL");
    setDateFrom("");
    setDateTo("");
  }, []);

  const isLoading = loadingCount > 0;

  const loadTinhHinhBaoCao = useCallback((factory: "NM1" | "NM2") => {
    setLoadingCount((c) => c + 1);
    generalQuery("tinhhinhchotbaocaosx", {
      FACTORY: factory,
    })
      .then((response) => {
        if (response.data && response.data.tk_status !== "NG" && Array.isArray(response.data.data)) {
          const loadedData: ExtendedTinhHinhChot[] = response.data.data.map(
            (element: TINH_HINH_CHOT_BC, index: number) => {
              const total = Number(element.TOTAL) || 0;
              const daChot = Number(element.DA_CHOT) || 0;
              const daNhapHS = Number(element.DA_NHAP_HIEUSUAT) || 0;
              const tlChot = total > 0 ? Math.min(100, Math.round((daChot / total) * 1000) / 10) : 0;
              const tlHS = total > 0 ? Math.min(100, Math.round((daNhapHS / total) * 1000) / 10) : 0;

              return {
                ...element,
                SX_DATE: moment.utc(element.SX_DATE).format("YYYY-MM-DD"),
                id: index,
                TL_CHOT: tlChot,
                TL_HIEUSUAT: tlHS,
                FACTORY: factory,
              };
            }
          );

          startTransition(() => {
            if (factory === "NM1") {
              setRawDataNM1(loadedData);
            } else {
              setRawDataNM2(loadedData);
            }
            setLastUpdated(moment().format("HH:mm:ss DD/MM/YYYY"));
          });
        }
      })
      .catch((error) => {
        console.error(`Lỗi tải tình hình chốt báo cáo ${factory}:`, error);
      })
      .finally(() => {
        setLoadingCount((c) => Math.max(0, c - 1));
      });
  }, []);

  const loadAll = useCallback(() => {
    loadTinhHinhBaoCao("NM1");
    loadTinhHinhBaoCao("NM2");
  }, [loadTinhHinhBaoCao]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Hàm lọc đa chiều (Search + Trạng thái chốt + Trạng thái HS + Khoảng ngày)
  const matchesFilter = useCallback(
    (item: ExtendedTinhHinhChot, query: string) => {
      if (query) {
        const q = query.toLowerCase().trim();
        const matchText =
          item.SX_DATE?.toLowerCase().includes(q) ||
          String(item.TOTAL).includes(q) ||
          String(item.DA_CHOT).includes(q) ||
          String(item.CHUA_CHOT).includes(q) ||
          String(item.DA_NHAP_HIEUSUAT).includes(q) ||
          String(item.CHUA_NHAP_HIEUSUAT).includes(q);
        if (!matchText) return false;
      }

      if (statusChotFilter === "CHUA_CHOT" && !(Number(item.CHUA_CHOT) > 0)) return false;
      if (statusChotFilter === "DA_CHOT" && (Number(item.CHUA_CHOT) > 0 || Number(item.TOTAL) === 0)) return false;

      if (statusHSFilter === "CHUA_HS" && !(Number(item.CHUA_NHAP_HIEUSUAT) > 0)) return false;
      if (statusHSFilter === "DA_HS" && (Number(item.CHUA_NHAP_HIEUSUAT) > 0 || Number(item.TOTAL) === 0)) return false;

      if (dateFrom && item.SX_DATE < dateFrom) return false;
      if (dateTo && item.SX_DATE > dateTo) return false;

      return true;
    },
    [statusChotFilter, statusHSFilter, dateFrom, dateTo]
  );

  // Bộ lọc tìm kiếm nhanh cho NM1
  const filteredDataNM1 = useMemo(() => {
    return rawDataNM1.filter((item) => matchesFilter(item, searchNM1));
  }, [rawDataNM1, searchNM1, matchesFilter]);

  // Bộ lọc tìm kiếm nhanh cho NM2
  const filteredDataNM2 = useMemo(() => {
    return rawDataNM2.filter((item) => matchesFilter(item, searchNM2));
  }, [rawDataNM2, searchNM2, matchesFilter]);

  // Thống kê KPI tổng hợp
  const kpiStats = useMemo<TinhHinhChotKpiStats>(() => {
    const sumField = (arr: ExtendedTinhHinhChot[], field: keyof ExtendedTinhHinhChot) =>
      arr.reduce((acc, cur) => acc + (Number(cur[field]) || 0), 0);

    const nm1Total = sumField(rawDataNM1, "TOTAL");
    const nm1DaChot = sumField(rawDataNM1, "DA_CHOT");
    const nm1ChuaChot = sumField(rawDataNM1, "CHUA_CHOT");
    const nm1DaNhapHS = sumField(rawDataNM1, "DA_NHAP_HIEUSUAT");
    const nm1ChuaNhapHS = sumField(rawDataNM1, "CHUA_NHAP_HIEUSUAT");
    const nm1RateChot = nm1Total > 0 ? Math.round((nm1DaChot / nm1Total) * 1000) / 10 : 0;

    const nm2Total = sumField(rawDataNM2, "TOTAL");
    const nm2DaChot = sumField(rawDataNM2, "DA_CHOT");
    const nm2ChuaChot = sumField(rawDataNM2, "CHUA_CHOT");
    const nm2DaNhapHS = sumField(rawDataNM2, "DA_NHAP_HIEUSUAT");
    const nm2ChuaNhapHS = sumField(rawDataNM2, "CHUA_NHAP_HIEUSUAT");
    const nm2RateChot = nm2Total > 0 ? Math.round((nm2DaChot / nm2Total) * 1000) / 10 : 0;

    const totalCommands = nm1Total + nm2Total;
    const totalDaChot = nm1DaChot + nm2DaChot;
    const totalChuaChot = nm1ChuaChot + nm2ChuaChot;
    const totalDaNhapHS = nm1DaNhapHS + nm2DaNhapHS;
    const totalChuaNhapHS = nm1ChuaNhapHS + nm2ChuaNhapHS;

    const rateChot = totalCommands > 0 ? Math.round((totalDaChot / totalCommands) * 1000) / 10 : 0;
    const rateHS = totalCommands > 0 ? Math.round((totalDaNhapHS / totalCommands) * 1000) / 10 : 0;

    return {
      totalCommands,
      totalDaChot,
      totalChuaChot,
      totalDaNhapHS,
      totalChuaNhapHS,
      rateChot,
      rateHS,
      nm1Total,
      nm1DaChot,
      nm1ChuaChot,
      nm1DaNhapHS,
      nm1RateChot,
      nm2Total,
      nm2DaChot,
      nm2ChuaChot,
      nm2DaNhapHS,
      nm2RateChot,
    };
  }, [rawDataNM1, rawDataNM2]);

  // Dữ liệu biểu đồ xu hướng theo ngày
  const chartData = useMemo<DailyChartItem[]>(() => {
    let source: ExtendedTinhHinhChot[] = [];

    if (chartFactoryFilter === "NM1") {
      source = [...rawDataNM1];
    } else if (chartFactoryFilter === "NM2") {
      source = [...rawDataNM2];
    } else {
      // Ghép hợp nhất theo ngày
      const dateMap = new Map<string, DailyChartItem>();

      [...rawDataNM1, ...rawDataNM2].forEach((item) => {
        const d = item.SX_DATE;
        if (!dateMap.has(d)) {
          dateMap.set(d, {
            SX_DATE: d,
            TOTAL: 0,
            DA_CHOT: 0,
            CHUA_CHOT: 0,
            DA_NHAP_HIEUSUAT: 0,
            CHUA_NHAP_HIEUSUAT: 0,
            TL_CHOT: 0,
            TL_HIEUSUAT: 0,
          });
        }
        const record = dateMap.get(d)!;
        record.TOTAL += Number(item.TOTAL) || 0;
        record.DA_CHOT += Number(item.DA_CHOT) || 0;
        record.CHUA_CHOT += Number(item.CHUA_CHOT) || 0;
        record.DA_NHAP_HIEUSUAT += Number(item.DA_NHAP_HIEUSUAT) || 0;
        record.CHUA_NHAP_HIEUSUAT += Number(item.CHUA_NHAP_HIEUSUAT) || 0;
      });

      const combined = Array.from(dateMap.values()).map((r) => {
        r.TL_CHOT = r.TOTAL > 0 ? Math.min(100, Math.round((r.DA_CHOT / r.TOTAL) * 1000) / 10) : 0;
        r.TL_HIEUSUAT = r.TOTAL > 0 ? Math.min(100, Math.round((r.DA_NHAP_HIEUSUAT / r.TOTAL) * 1000) / 10) : 0;
        return r;
      });

      return combined.sort((a, b) => a.SX_DATE.localeCompare(b.SX_DATE));
    }

    return source
      .map((item) => ({
        SX_DATE: item.SX_DATE,
        TOTAL: Number(item.TOTAL) || 0,
        DA_CHOT: Number(item.DA_CHOT) || 0,
        CHUA_CHOT: Number(item.CHUA_CHOT) || 0,
        DA_NHAP_HIEUSUAT: Number(item.DA_NHAP_HIEUSUAT) || 0,
        CHUA_NHAP_HIEUSUAT: Number(item.CHUA_NHAP_HIEUSUAT) || 0,
        TL_CHOT: item.TL_CHOT,
        TL_HIEUSUAT: item.TL_HIEUSUAT,
      }))
      .sort((a, b) => a.SX_DATE.localeCompare(b.SX_DATE));
  }, [rawDataNM1, rawDataNM2, chartFactoryFilter]);

  // Xuất file Excel
  const handleExportExcel = useCallback(
    (factory: "NM1" | "NM2", mode: "EX1" | "EX2") => {
      const dataToExport =
        factory === "NM1"
          ? mode === "EX1"
            ? filteredDataNM1
            : rawDataNM1
          : mode === "EX1"
          ? filteredDataNM2
          : rawDataNM2;

      if (!dataToExport || dataToExport.length === 0) {
        alert("Không có dữ liệu để xuất Excel");
        return;
      }

      const formattedRows = dataToExport.map((row) => ({
        SX_DATE: row.SX_DATE,
        "Tổng SL Chỉ Thị": row.TOTAL,
        "Đã Chốt Báo Cáo": row.DA_CHOT,
        "Chưa Chốt Báo Cáo": row.CHUA_CHOT,
        "Tỷ Lệ Chốt (%)": `${row.TL_CHOT}%`,
        "Đã Nhập Hiệu Suất": row.DA_NHAP_HIEUSUAT,
        "Chưa Nhập Hiệu Suất": row.CHUA_NHAP_HIEUSUAT,
        "Tỷ Lệ Nhập HS (%)": `${row.TL_HIEUSUAT}%`,
      }));

      const filename = `Tinh_Hinh_Chot_BC_${factory}_${mode}_${moment().format("YYYYMMDD_HHmmss")}`;
      SaveExcel(formattedRows, filename);
    },
    [filteredDataNM1, rawDataNM1, filteredDataNM2, rawDataNM2]
  );

  return {
    rawDataNM1,
    rawDataNM2,
    filteredDataNM1,
    filteredDataNM2,
    kpiStats,
    chartData,
    isLoading,
    lastUpdated,
    searchNM1,
    setSearchNM1,
    searchNM2,
    setSearchNM2,
    viewMode,
    setViewMode,
    showCharts,
    setShowCharts,
    chartFactoryFilter,
    setChartFactoryFilter,
    loadTinhHinhBaoCao,
    loadAll,
    handleExportExcel,
    statusChotFilter,
    setStatusChotFilter,
    statusHSFilter,
    setStatusHSFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    activeFilterCount,
    resetFilters,
  };
};
