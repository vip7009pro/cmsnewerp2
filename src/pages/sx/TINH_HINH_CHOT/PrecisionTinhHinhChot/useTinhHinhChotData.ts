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
  nm1RateChot: number;
  nm2Total: number;
  nm2DaChot: number;
  nm2ChuaChot: number;
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

  // Bộ lọc tìm kiếm nhanh cho NM1
  const filteredDataNM1 = useMemo(() => {
    if (!searchNM1.trim()) return rawDataNM1;
    const query = searchNM1.toLowerCase().trim();
    return rawDataNM1.filter((item) => {
      return (
        item.SX_DATE?.toLowerCase().includes(query) ||
        String(item.TOTAL).includes(query) ||
        String(item.DA_CHOT).includes(query) ||
        String(item.CHUA_CHOT).includes(query) ||
        String(item.DA_NHAP_HIEUSUAT).includes(query) ||
        String(item.CHUA_NHAP_HIEUSUAT).includes(query)
      );
    });
  }, [rawDataNM1, searchNM1]);

  // Bộ lọc tìm kiếm nhanh cho NM2
  const filteredDataNM2 = useMemo(() => {
    if (!searchNM2.trim()) return rawDataNM2;
    const query = searchNM2.toLowerCase().trim();
    return rawDataNM2.filter((item) => {
      return (
        item.SX_DATE?.toLowerCase().includes(query) ||
        String(item.TOTAL).includes(query) ||
        String(item.DA_CHOT).includes(query) ||
        String(item.CHUA_CHOT).includes(query) ||
        String(item.DA_NHAP_HIEUSUAT).includes(query) ||
        String(item.CHUA_NHAP_HIEUSUAT).includes(query)
      );
    });
  }, [rawDataNM2, searchNM2]);

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
      nm1RateChot,
      nm2Total,
      nm2DaChot,
      nm2ChuaChot,
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
  };
};
