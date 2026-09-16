import { useState, useMemo, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import { OQC_DATA } from "../../interfaces/qcInterface";
import { SaveExcel } from "../../../../api/services/excelService";

export const useOQCData = () => {
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [oqc_table_data, set_oqc_table_data] = useState<Array<OQC_DATA>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [selectedRows, setSelectedRows] = useState<OQC_DATA>({
    CUST_NAME_KD: "",
    DELIVERY_AMOUNT: 0,
    DELIVERY_DATE: "",
    DELIVERY_QTY: 0,
    FACTORY_NAME: "",
    FULL_NAME: "",
    G_CODE: "",
    G_NAME: "",
    G_NAME_KD: "",
    LABEL_ID: "",
    OQC_ID: 0,
    PROCESS_LOT_NO: "",
    M_LOT_NO: "",
    LOTNCC: "",
    PROD_LAST_PRICE: 0,
    PROD_REQUEST_DATE: "",
    PROD_REQUEST_NO: "",
    PROD_REQUEST_QTY: 0,
    REMARK: "",
    RUNNING_COUNT: 0,
    SAMPLE_NG_AMOUNT: 0,
    SAMPLE_NG_QTY: 0,
    SAMPLE_QTY: 0,
    SHIFT_CODE: "",
  });

  // Tải dữ liệu OQC
  const load_oqc_data = useCallback(() => {
    setIsLoading(true);
    generalQuery("traOQCData", {
      CUST_NAME_KD: selectedRows.CUST_NAME_KD,
      PROD_REQUEST_NO: selectedRows.PROD_REQUEST_NO,
      G_NAME: selectedRows.G_NAME,
      G_CODE: selectedRows.G_CODE,
      FROM_DATE: fromdate,
      TO_DATE: todate,
    })
      .then((response: any) => {
        setIsLoading(false);
        if (response.data.tk_status !== "NG") {
          const loadeddata = response.data.data.map(
            (element: OQC_DATA, index: number) => ({
              ...element,
              DELIVERY_DATE: moment.utc(element.DELIVERY_DATE).format("YYYY-MM-DD"),
              id: index,
            })
          );
          set_oqc_table_data(loadeddata);
          Swal.fire(
            "Thông báo",
            `Đã load: ${response.data.data.length} dòng`,
            "success"
          );
        } else {
          set_oqc_table_data([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error: any) => {
        setIsLoading(false);
        console.error("Lỗi traOQCData:", error);
        Swal.fire("Lỗi kết nối", "Không thể kết nối máy chủ", "error");
      });
  }, [selectedRows, fromdate, todate]);

  // Cập nhật thông tin form tra cứu
  const setOQCFormInfo = useCallback((keyname: string, value: any) => {
    setSelectedRows((prev: OQC_DATA) => ({
      ...prev,
      [keyname]: value,
    }));
  }, []);

  // Xử lý phím Enter
  const handleSearchCodeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        load_oqc_data();
      }
    },
    [load_oqc_data]
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
    if (!quickFilterText.trim()) return oqc_table_data;
    const q = quickFilterText.toLowerCase().trim();
    return oqc_table_data.filter((item) => {
      return (
        item.G_CODE?.toLowerCase().includes(q) ||
        item.G_NAME_KD?.toLowerCase().includes(q) ||
        item.CUST_NAME_KD?.toLowerCase().includes(q) ||
        item.PROD_REQUEST_NO?.toLowerCase().includes(q) ||
        item.PROCESS_LOT_NO?.toLowerCase().includes(q) ||
        item.FULL_NAME?.toLowerCase().includes(q) ||
        item.FACTORY_NAME?.toLowerCase().includes(q)
      );
    });
  }, [oqc_table_data, quickFilterText]);

  // Tính toán Realtime KPI & Widgets Thống Kê Hữu Ích
  const kpiMetrics = useMemo(() => {
    const totalLots = oqc_table_data.length;
    let okLots = 0;
    let ngLots = 0;
    let totalDeliveryQty = 0;
    let totalDeliveryAmount = 0;
    let totalSampleQty = 0;
    let totalSampleNGQty = 0;
    let totalSampleNGAmount = 0;
    let nm1Count = 0;
    let nm2Count = 0;
    let shiftDayCount = 0;
    let shiftNightCount = 0;

    const uniqueCodes = new Set<string>();
    const uniqueCustomers = new Set<string>();

    for (let i = 0; i < totalLots; i++) {
      const row = oqc_table_data[i];
      const sampleNg = Number(row.SAMPLE_NG_QTY) || 0;
      if (sampleNg > 0) {
        ngLots++;
      } else {
        okLots++;
      }

      totalDeliveryQty += Number(row.DELIVERY_QTY) || 0;
      totalDeliveryAmount += Number(row.DELIVERY_AMOUNT) || 0;
      totalSampleQty += Number(row.SAMPLE_QTY) || 0;
      totalSampleNGQty += sampleNg;
      totalSampleNGAmount += Number(row.SAMPLE_NG_AMOUNT) || 0;

      if (row.G_CODE) uniqueCodes.add(row.G_CODE);
      if (row.CUST_NAME_KD) uniqueCustomers.add(row.CUST_NAME_KD);

      const fName = String(row.FACTORY_NAME || "").toUpperCase();
      if (fName.includes("NM1") || fName.includes("1")) nm1Count++;
      else if (fName.includes("NM2") || fName.includes("2")) nm2Count++;

      const sCode = String(row.SHIFT_CODE || "").toUpperCase();
      if (sCode.includes("A") || sCode.includes("DAY") || sCode.includes("1")) shiftDayCount++;
      else if (sCode.includes("B") || sCode.includes("NIGHT") || sCode.includes("2")) shiftNightCount++;
    }

    const passRate = totalLots > 0 ? (okLots / totalLots) * 100 : 100;
    const sampleNGRate = totalSampleQty > 0 ? (totalSampleNGQty / totalSampleQty) * 100 : 0;
    const sampleNGPPM = totalSampleQty > 0 ? Math.round((totalSampleNGQty / totalSampleQty) * 1000000) : 0;

    return {
      totalLots,
      okLots,
      ngLots,
      passRate,
      totalDeliveryQty,
      totalDeliveryAmount,
      totalSampleQty,
      totalSampleNGQty,
      sampleNGRate,
      sampleNGPPM,
      totalSampleNGAmount,
      uniqueCodesCount: uniqueCodes.size,
      uniqueCustomersCount: uniqueCustomers.size,
      nm1Count,
      nm2Count,
      shiftDayCount,
      shiftNightCount,
    };
  }, [oqc_table_data]);

  // Xuất file Excel
  const exportExcelFiltered = useCallback(() => {
    if (filteredData.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    SaveExcel(filteredData, `OQC_DATA_Filtered_${fromdate}_${todate}`);
  }, [filteredData, fromdate, todate]);

  const exportExcelAll = useCallback(() => {
    if (oqc_table_data.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    SaveExcel(oqc_table_data, `OQC_DATA_All_${fromdate}_${todate}`);
  }, [oqc_table_data, fromdate, todate]);

  return {
    fromdate,
    setFromDate,
    todate,
    setToDate,
    oqc_table_data,
    filteredData,
    selectedRows,
    setOQCFormInfo,
    handleSearchCodeKeyDown,
    load_oqc_data,
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
