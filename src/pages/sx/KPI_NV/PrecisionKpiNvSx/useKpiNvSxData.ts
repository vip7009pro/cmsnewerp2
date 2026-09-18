import { useState, useCallback, useMemo, useEffect } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { SX_KPI_NV_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import {
  f_load_SX_NV_KPI_DATA_Daily,
  f_load_SX_NV_KPI_DATA_Monthly,
  f_load_SX_NV_KPI_DATA_Weekly,
  f_load_SX_NV_KPI_DATA_Yearly,
} from "../../../qlsx/QLSXPLAN/utils/khsxUtils";
import { SaveExcel } from "../../../../api/services/excelService";
import {
  calculateKpiNvSxSummary,
  aggregatePeriodTrendData,
  aggregateTopEmplMetData,
  aggregateRateDistData,
  aggregateTopEmplQtyData,
  filterKpiNvSxData,
} from "./kpiNvSxHelpers";
import {
  getKpiNvSxDailyColumns,
  getKpiNvSxWeeklyColumns,
  getKpiNvSxMonthlyColumns,
  getKpiNvSxYearlyColumns,
} from "./PrecisionKpiNvSxColumns";

export type KpiOption = "Daily" | "Weekly" | "Monthly" | "Yearly";
export type KpiViewTab = "all" | "charts" | "grid";

export const useKpiNvSxData = () => {
  const [fromDate, setFromDate] = useState<string>(
    moment().subtract(8, "days").format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [option, setOption] = useState<KpiOption>("Daily");
  const [allTime, setAllTime] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<KpiViewTab>("all");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [rawKpiData, setRawKpiData] = useState<SX_KPI_NV_DATA[]>([]);

  // Lựa chọn cột AG Grid tương ứng với Option hiện tại
  const columns = useMemo(() => {
    switch (option) {
      case "Weekly":
        return getKpiNvSxWeeklyColumns();
      case "Monthly":
        return getKpiNvSxMonthlyColumns();
      case "Yearly":
        return getKpiNvSxYearlyColumns();
      case "Daily":
      default:
        return getKpiNvSxDailyColumns();
    }
  }, [option]);

  // Tải dữ liệu từ API tương ứng với chu kỳ lựa chọn
  const loadKpiData = useCallback(async () => {
    setIsLoading(true);
    let result: SX_KPI_NV_DATA[] = [];
    const queryPayload = {
      FROM_DATE: allTime ? "2000-01-01" : fromDate,
      TO_DATE: allTime ? "2099-12-31" : toDate,
    };

    try {
      if (option === "Daily") {
        result = await f_load_SX_NV_KPI_DATA_Daily(queryPayload);
      } else if (option === "Weekly") {
        result = await f_load_SX_NV_KPI_DATA_Weekly(queryPayload);
      } else if (option === "Monthly") {
        result = await f_load_SX_NV_KPI_DATA_Monthly(queryPayload);
      } else if (option === "Yearly") {
        result = await f_load_SX_NV_KPI_DATA_Yearly(queryPayload);
      }

      if (result && result.length > 0) {
        Swal.fire({
          title: "Thành công",
          text: `Đã tải thành công ${result.length} bản ghi KPI (${option})`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        setRawKpiData(result);
      } else {
        Swal.fire("Thông báo", "Không có dữ liệu KPI trong khoảng thời gian này", "info");
        setRawKpiData([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu KPI nhân viên:", err);
      Swal.fire("Lỗi", "Không thể kết nối đến máy chủ", "error");
      setRawKpiData([]);
    } finally {
      setIsLoading(false);
    }
  }, [fromDate, toDate, option, allTime]);

  // Lọc dữ liệu qua Quick Search
  const filteredData = useMemo(() => {
    return filterKpiNvSxData(rawKpiData, searchKeyword);
  }, [rawKpiData, searchKeyword]);

  // Tổng hợp Dashboard KPI realtime
  const summaryKpi = useMemo(() => {
    return calculateKpiNvSxSummary(filteredData);
  }, [filteredData]);

  // Dữ liệu 4 biểu đồ Recharts
  const periodTrendChartData = useMemo(() => {
    return aggregatePeriodTrendData(filteredData, option);
  }, [filteredData, option]);

  const topEmplMetChartData = useMemo(() => {
    return aggregateTopEmplMetData(filteredData);
  }, [filteredData]);

  const rateDistChartData = useMemo(() => {
    return aggregateRateDistData(filteredData);
  }, [filteredData]);

  const topEmplQtyChartData = useMemo(() => {
    return aggregateTopEmplQtyData(filteredData);
  }, [filteredData]);

  // Xuất Excel EX1 (dữ liệu đang lọc)
  const handleExportEX1 = useCallback(() => {
    if (!filteredData || filteredData.length === 0) {
      Swal.fire("Cảnh báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    SaveExcel(filteredData, `KPI_NVSX_${option}_Filtered`);
  }, [filteredData, option]);

  // Xuất Excel EX2 (toàn bộ dữ liệu)
  const handleExportEX2 = useCallback(() => {
    if (!rawKpiData || rawKpiData.length === 0) {
      Swal.fire("Cảnh báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    SaveExcel(rawKpiData, `KPI_NVSX_${option}_All`);
  }, [rawKpiData, option]);

  // Thiết lập dải ngày nhanh
  const handleQuickDate = useCallback((days: number) => {
    setAllTime(false);
    setToDate(moment().format("YYYY-MM-DD"));
    if (days === 0) {
      setFromDate(moment().format("YYYY-MM-DD"));
    } else {
      setFromDate(moment().subtract(days, "days").format("YYYY-MM-DD"));
    }
  }, []);

  return {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    option,
    setOption,
    allTime,
    setAllTime,
    activeTab,
    setActiveTab,
    searchKeyword,
    setSearchKeyword,
    isLoading,
    rawKpiData,
    filteredData,
    columns,
    summaryKpi,
    periodTrendChartData,
    topEmplMetChartData,
    rateDistChartData,
    topEmplQtyChartData,
    loadKpiData,
    handleExportEX1,
    handleExportEX2,
    handleQuickDate,
  };
};
