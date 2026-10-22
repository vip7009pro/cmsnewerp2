import { useState, useMemo, useCallback, useEffect } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import { OQC_SHIPPING_ROW, OQCShippingKpiMetrics } from "./OQCShippingTypes";
import { SaveExcel } from "../../../../api/services/excelService";
import { getDisplayedGridRows } from "../../../../components/DataTable/gridExportUtils";

export const useOQCShippingData = () => {
  const [fromdate, setFromDate] = useState(
    moment().subtract(21, "days").format("YYYY-MM-DD")
  );
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [gName, setGName] = useState("");
  const [gCode, setGCode] = useState("");
  const [custName, setCustName] = useState("");

  const [shippingData, setShippingData] = useState<OQC_SHIPPING_ROW[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Tải dữ liệu Xuất Hàng OQC
  const loadShippingData = useCallback(() => {
    setIsLoading(true);
    generalQuery("traOQCShippingData", {
      FROM_DATE: fromdate,
      TO_DATE: todate,
      G_NAME: gName,
      G_CODE: gCode,
      CUST_NAME: custName,
    })
      .then((response: any) => {
        setIsLoading(false);
        if (response.data.tk_status !== "NG") {
          const loadedData = (response.data.data || []).map(
            (element: OQC_SHIPPING_ROW, index: number) => ({
              ...element,
              OUT_DATE: element.OUT_DATE
                ? moment.utc(element.OUT_DATE).format("YYYY-MM-DD")
                : "",
              OUT_QTY: Number(element.OUT_QTY) || 0,
              SAMPLING_QTY: Number(element.SAMPLING_QTY) || 0,
              SAMPLE_NG_QTY_TT: Number(element.SAMPLE_NG_QTY_TT) || 0,
              RATE_OK: Number(element.RATE_OK) || 0,
              id: index,
            })
          );
          setShippingData(loadedData);
          Swal.fire({
            title: "Thông báo",
            text: `Đã load: ${loadedData.length} dòng`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          setShippingData([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error: any) => {
        setIsLoading(false);
        console.error("Lỗi traOQCShippingData:", error);
        Swal.fire("Lỗi kết nối", "Không thể kết nối máy chủ", "error");
      });
  }, [fromdate, todate, gName, gCode, custName]);

  // Load ban đầu
  useEffect(() => {
    loadShippingData();
  }, []);

  // Xử lý phím Enter
  const handleSearchCodeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        loadShippingData();
      }
    },
    [loadShippingData]
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
    if (!quickFilterText.trim()) return shippingData;
    const q = quickFilterText.toLowerCase().trim();
    return shippingData.filter((item) => {
      return (
        item.G_CODE?.toLowerCase().includes(q) ||
        item.G_NAME?.toLowerCase().includes(q) ||
        item.CUST_NAME_KD?.toLowerCase().includes(q) ||
        item.OUT_CUST_NAME?.toLowerCase().includes(q) ||
        item.OUT_ID_KEY?.toLowerCase().includes(q) ||
        item.PLAN_ID?.toLowerCase().includes(q) ||
        item.OUT_STATUS_RESULT?.toLowerCase().includes(q) ||
        item.PO_TYPE?.toLowerCase().includes(q) ||
        item.OUT_SHIFT?.toLowerCase().includes(q)
      );
    });
  }, [shippingData, quickFilterText]);

  // Tính toán Realtime KPI Thống Kê
  const kpiMetrics = useMemo<OQCShippingKpiMetrics>(() => {
    const totalLots = shippingData.length;
    let passLots = 0;
    let pendingLots = 0;
    let totalOutQty = 0;
    let totalSamplingQty = 0;
    let totalSampleNgQty = 0;
    let sumRateOk = 0;
    let shiftDayCount = 0;
    let shiftNightCount = 0;

    const uniqueCodes = new Set<string>();
    const uniqueCustomers = new Set<string>();

    for (let i = 0; i < totalLots; i++) {
      const row = shippingData[i];
      const status = String(row.OUT_STATUS_RESULT || "").toUpperCase();
      if (status === "PASS") {
        passLots++;
      } else if (status === "PENDING") {
        pendingLots++;
      }

      totalOutQty += Number(row.OUT_QTY) || 0;
      totalSamplingQty += Number(row.SAMPLING_QTY) || 0;
      totalSampleNgQty += Number(row.SAMPLE_NG_QTY_TT) || 0;
      sumRateOk += Number(row.RATE_OK) || 0;

      if (row.G_CODE) uniqueCodes.add(row.G_CODE);
      if (row.CUST_NAME_KD) uniqueCustomers.add(row.CUST_NAME_KD);

      const shift = String(row.OUT_SHIFT || "").toUpperCase();
      if (shift.includes("DAY") || shift === "1" || shift.includes("NGAY")) {
        shiftDayCount++;
      } else if (shift.includes("NIGHT") || shift === "2" || shift.includes("DEM")) {
        shiftNightCount++;
      }
    }

    const passRate = totalLots > 0 ? (passLots / totalLots) * 100 : 100;
    const sampleNgPpm =
      totalSamplingQty > 0
        ? Math.round((totalSampleNgQty / totalSamplingQty) * 1000000)
        : 0;
    const avgRateOk = totalLots > 0 ? sumRateOk / totalLots : 100;

    return {
      totalLots,
      passLots,
      pendingLots,
      passRate,
      totalOutQty,
      totalSamplingQty,
      totalSampleNgQty,
      sampleNgPpm,
      avgRateOk,
      uniqueCodesCount: uniqueCodes.size,
      uniqueCustomersCount: uniqueCustomers.size,
      shiftDayCount,
      shiftNightCount,
    };
  }, [shippingData]);

  // Xuất file Excel
  const exportExcelFiltered = useCallback(() => {
    const rowsToExport = getDisplayedGridRows(undefined, filteredData);
    if (rowsToExport.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    SaveExcel(rowsToExport, `OQC_Shipping_Filtered_${fromdate}_${todate}`);
  }, [filteredData, fromdate, todate]);

  const exportExcelAll = useCallback(() => {
    if (shippingData.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    SaveExcel(shippingData, `OQC_Shipping_All_${fromdate}_${todate}`);
  }, [shippingData, fromdate, todate]);

  return {
    fromdate,
    setFromDate,
    todate,
    setToDate,
    gName,
    setGName,
    gCode,
    setGCode,
    custName,
    setCustName,
    shippingData,
    filteredData,
    isLoading,
    quickFilterText,
    setQuickFilterText,
    isFullscreen,
    toggleFullscreen,
    kpiMetrics,
    loadShippingData,
    handleSearchCodeKeyDown,
    exportExcelFiltered,
    exportExcelAll,
  };
};
