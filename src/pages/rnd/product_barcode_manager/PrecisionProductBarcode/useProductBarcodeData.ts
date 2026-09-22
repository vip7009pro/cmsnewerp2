import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode } from "../../../../api/Api";
import { SaveExcel } from "../../../../api/services/excelService";
import { CodeListData } from "../../../kinhdoanh/interfaces/kdInterface";
import { BARCODE_DATA } from "../../interfaces/rndInterface";
import {
  BarcodeKpiData,
  BarcodeTypeFilter,
  ProductionStatusFilter,
  UseProductBarcodeDataReturn,
} from "./barcodeManagerTypes";
import { createPivotDataSource } from "../../../../components/PivotChart/lazyPivot";

const INITIAL_ROW_STATE: BARCODE_DATA = {
  G_CODE: "",
  BARCODE_INSP: "",
  BARCODE_RELI: "",
  BARCODE_RND: "",
  BARCODE_STT: "",
  BARCODE_TYPE: "1D",
  G_NAME: "",
  STATUS: "OK",
  SX_STATUS: "NO",
};

export const useProductBarcodeData = (): UseProductBarcodeDataReturn => {
  const [barcodedatatable, setBarCodeDataTable] = useState<BARCODE_DATA[]>([]);
  const [datasxtable, setDataSXTable] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<BARCODE_DATA>(INITIAL_ROW_STATE);
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>(null);
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showhidePivotTable, setShowHidePivotTable] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Filters
  const [quickSearch, setQuickSearch] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<BarcodeTypeFilter>("ALL");
  const [prodFilter, setProdFilter] = useState<ProductionStatusFilter>("ALL");

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // LOAD BARCODE TABLE
  const load_barcode_table = useCallback((showToast: boolean = true) => {
    setIsLoading(true);
    generalQuery("loadbarcodemanager", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: BARCODE_DATA[] = response.data.data.map(
            (element: BARCODE_DATA, index: number) => ({
              ...element,
              G_NAME:
                getAuditMode() === 0
                  ? element?.G_NAME
                  : element?.G_NAME?.search("CNDB") === -1
                  ? element?.G_NAME
                  : "TEM_NOI_BO",
              SX_STATUS: element?.SX_STATUS == null ? "NO" : element?.SX_STATUS,
              id: index,
            })
          );
          setBarCodeDataTable(loadeddata);
          setIsLoading(false);
          if (showToast) {
            Swal.fire("Thông báo", "Đã load: " + response.data.data.length + " dòng", "success");
          }
        } else {
          setBarCodeDataTable([]);
          setIsLoading(false);
          if (showToast) {
            Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          }
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  // GET CODE LIST CHO DROPDOWN
  const getcodelist = useCallback((G_NAME: string) => {
    generalQuery("selectcodeList", { G_NAME: G_NAME })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setCodeList(response.data.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // UPDATE FORM FIELD
  const setBarCodeInfo = useCallback((keyname: string, value: any) => {
    setSelectedRows((prev: BARCODE_DATA) => ({
      ...prev,
      [keyname]: value,
    }));
  }, []);

  // RESET FORM VỀ TRẠNG THÁI TRỐNG
  const resetForm = useCallback(() => {
    setSelectedRows(INITIAL_ROW_STATE);
    setSelectedCode(null);
  }, []);

  // ADD BARCODE
  const addBarcode = useCallback(async () => {
    if (!selectedRows.G_CODE || !selectedRows.BARCODE_RND) {
      Swal.fire("Cảnh báo", "Vui lòng chọn mã sản phẩm và nhập chuỗi Barcode R&D", "warning");
      return;
    }
    if (!String(selectedRows.BARCODE_STT ?? "").trim()) {
      Swal.fire("Cảnh báo", "Vui lòng nhập số thứ tự (STT) barcode", "warning");
      return;
    }

    // Kiểm tra trùng trước khi thêm: nếu chính request kiểm tra lỗi thì DỪNG,
    // không được insert mù (tránh tạo bản ghi trùng khi mất kết nối).
    let barcodeExist = false;
    try {
      const checkRes = await generalQuery("checkbarcodeExist", selectedRows);
      barcodeExist = checkRes.data?.tk_status !== "NG";
    } catch (error: any) {
      console.error(error);
      Swal.fire(
        "Lỗi",
        "Không kiểm tra được barcode trùng: " + (error?.message ?? "lỗi kết nối"),
        "error"
      );
      return;
    }

    if (barcodeExist) {
      Swal.fire("Thông báo", "Barcode đã tồn tại", "error");
      return;
    }

    try {
      const response = await generalQuery("addBarcode", selectedRows);
      if (response.data?.tk_status !== "NG") {
        Swal.fire("Thông báo", "Thêm barcode thành công", "success");
        load_barcode_table();
      } else {
        Swal.fire(
          "Lỗi",
          "Thêm barcode thất bại: " + (response.data?.message ?? "không rõ lỗi"),
          "error"
        );
      }
    } catch (error: any) {
      console.error(error);
      Swal.fire("Lỗi", "Thêm barcode thất bại: " + (error?.message ?? "lỗi kết nối"), "error");
    }
  }, [selectedRows, load_barcode_table]);

  // UPDATE BARCODE
  const updateBarcode = useCallback(async () => {
    if (!selectedRows.G_CODE) {
      Swal.fire("Cảnh báo", "Vui lòng chọn một barcode cần cập nhật", "warning");
      return;
    }
    if (!String(selectedRows.BARCODE_STT ?? "").trim()) {
      Swal.fire("Cảnh báo", "Vui lòng chọn/nhập số thứ tự (STT) barcode cần cập nhật", "warning");
      return;
    }

    try {
      const response = await generalQuery("updateBarcode", selectedRows);
      if (response.data?.tk_status !== "NG") {
        Swal.fire("Thông báo", "Update barcode thành công", "success");
        load_barcode_table();
      } else {
        Swal.fire(
          "Lỗi",
          "Update barcode thất bại: " + (response.data?.message ?? "không rõ lỗi"),
          "error"
        );
      }
    } catch (error: any) {
      console.error(error);
      Swal.fire("Lỗi", "Update barcode thất bại: " + (error?.message ?? "lỗi kết nối"), "error");
    }
  }, [selectedRows, load_barcode_table]);

  // DELETE BARCODE
  const deleteBarcode = useCallback(async () => {
    if (!selectedRows.G_CODE) {
      Swal.fire("Cảnh báo", "Vui lòng chọn một barcode cần xóa", "warning");
      return;
    }

    if (!String(selectedRows.BARCODE_STT ?? "").trim()) {
      Swal.fire("Cảnh báo", "Vui lòng chọn barcode (có số thứ tự) cần xóa", "warning");
      return;
    }

    if (selectedRows.SX_STATUS !== "NO") {
      Swal.fire("Thông báo", "Barcode đã được sản xuất, không thể xóa", "error");
      return;
    }

    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa barcode này không?",
      text: `Mã SP: ${selectedRows.G_CODE} | Loại: ${selectedRows.BARCODE_TYPE}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Đồng ý xóa",
      cancelButtonText: "Hủy bỏ",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await generalQuery("deleteBarcode", selectedRows);
          if (response.data?.tk_status !== "NG") {
            Swal.fire("Thông báo", "Delete barcode thành công", "success");
            load_barcode_table();
            resetForm();
          } else {
            Swal.fire(
              "Lỗi",
              "Xóa barcode thất bại: " + (response.data?.message ?? "không rõ lỗi"),
              "error"
            );
          }
        } catch (error: any) {
          console.error(error);
          Swal.fire("Lỗi", "Xóa barcode thất bại: " + (error?.message ?? "lỗi kết nối"), "error");
        }
      }
    });
  }, [selectedRows, load_barcode_table, resetForm]);

  // KPI DATA REALTIME
  const kpiData: BarcodeKpiData = useMemo(() => {
    const total = barcodedatatable.length;
    let count1D = 0;
    let countQR = 0;
    let countMatrix = 0;
    let producedCount = 0;
    let notProducedCount = 0;
    let statusOkCount = 0;
    let statusNgCount = 0;

    for (let i = 0; i < total; i++) {
      const row = barcodedatatable[i];
      if (row.BARCODE_TYPE === "1D") count1D++;
      else if (row.BARCODE_TYPE === "QR") countQR++;
      else if (row.BARCODE_TYPE === "MATRIX") countMatrix++;

      if (row.SX_STATUS === "YES") producedCount++;
      else notProducedCount++;

      if (row.STATUS === "OK") statusOkCount++;
      else statusNgCount++;
    }

    return {
      total,
      count1D,
      countQR,
      countMatrix,
      producedCount,
      notProducedCount,
      statusOkCount,
      statusNgCount,
    };
  }, [barcodedatatable]);

  // FILTERED DATA CHO AG-GRID
  const filteredBarcodeData = useMemo(() => {
    let result = barcodedatatable;

    // Filter theo loại mã
    if (typeFilter !== "ALL") {
      result = result.filter((x) => x.BARCODE_TYPE === typeFilter);
    }

    // Filter theo tiến độ sản xuất
    if (prodFilter !== "ALL") {
      result = result.filter((x) => (prodFilter === "YES" ? x.SX_STATUS === "YES" : x.SX_STATUS !== "YES"));
    }

    // Quick Search
    if (quickSearch.trim()) {
      const kw = quickSearch.toLowerCase().trim();
      result = result.filter(
        (x) =>
          x.G_CODE?.toLowerCase().includes(kw) ||
          x.G_NAME?.toLowerCase().includes(kw) ||
          x.BARCODE_RND?.toLowerCase().includes(kw) ||
          x.BARCODE_INSP?.toLowerCase().includes(kw) ||
          x.BARCODE_RELI?.toLowerCase().includes(kw) ||
          x.STATUS?.toLowerCase().includes(kw) ||
          x.BARCODE_TYPE?.toLowerCase().includes(kw)
      );
    }

    return result;
  }, [barcodedatatable, typeFilter, prodFilter, quickSearch]);

  // EXCEL EXPORT (EX1: dữ liệu đang lọc, EX2: toàn bộ dữ liệu)
  const handleExportExcel = useCallback(
    (type: "EX1" | "EX2" = "EX1") => {
      const rows = type === "EX1" ? filteredBarcodeData : barcodedatatable;
      if (rows.length === 0) {
        Swal.fire("Thông báo", "Không có dữ liệu barcode để xuất", "warning");
        return;
      }
      SaveExcel(
        rows,
        type === "EX1" ? "PRODUCT_BARCODE_DATA_DANG_LOC" : "PRODUCT_BARCODE_DATA_TOAN_BO"
      );
    },
    [filteredBarcodeData, barcodedatatable]
  );

  // PIVOT DATA SOURCE
  // ⚠️ DevExtreme chỉ được nạp khi user mở pivot (xem components/PivotChart/lazyPivot.ts).
  const [dataSource, setDataSource] = useState<any>(null);
  useEffect(() => {
    if (!showhidePivotTable) return; // chưa mở pivot -> không tải DevExtreme
    let cancelled = false;
    void (async () => {
      const ds = await createPivotDataSource(buildPivotConfig());
      if (!cancelled) setDataSource(ds);
    })();
    return () => {
      cancelled = true;
    };
  }, [showhidePivotTable, datasxtable]);
  const buildPivotConfig = () => ({
    fields: [
        { caption: "INS_DATE", width: 80, dataField: "INS_DATE", dataType: "date", summaryType: "count" },
        { caption: "M_LOT_NO", width: 80, dataField: "M_LOT_NO", dataType: "string", summaryType: "count" },
        { caption: "M_CODE", width: 80, dataField: "M_CODE", dataType: "string", summaryType: "count" },
        { caption: "M_NAME", width: 80, dataField: "M_NAME", dataType: "string", summaryType: "count" },
        { caption: "WIDTH_CD", width: 80, dataField: "WIDTH_CD", dataType: "string", summaryType: "count" },
        { caption: "XUAT_KHO", width: 80, dataField: "XUAT_KHO", dataType: "string", summaryType: "count" },
        { caption: "VAO_FR", width: 80, dataField: "VAO_FR", dataType: "string", summaryType: "count" },
        { caption: "VAO_SR", width: 80, dataField: "VAO_SR", dataType: "string", summaryType: "count" },
        { caption: "VAO_DC", width: 80, dataField: "VAO_DC", dataType: "string", summaryType: "count" },
        { caption: "VAO_ED", width: 80, dataField: "VAO_ED", dataType: "string", summaryType: "count" },
        { caption: "CONFIRM_GIAONHAN", width: 80, dataField: "CONFIRM_GIAONHAN", dataType: "string", summaryType: "count" },
        { caption: "VAO_KIEM", width: 80, dataField: "VAO_KIEM", dataType: "string", summaryType: "count" },
        { caption: "NHATKY_KT", width: 80, dataField: "NHATKY_KT", dataType: "string", summaryType: "count" },
        { caption: "RA_KIEM", width: 80, dataField: "RA_KIEM", dataType: "string", summaryType: "count" },
        { caption: "ROLL_QTY", width: 80, dataField: "ROLL_QTY", dataType: "number", summaryType: "sum" },
        { caption: "OUT_CFM_QTY", width: 80, dataField: "OUT_CFM_QTY", dataType: "number", summaryType: "sum" },
        { caption: "TOTAL_OUT_QTY", width: 80, dataField: "TOTAL_OUT_QTY", dataType: "number", summaryType: "sum" },
        { caption: "FR_RESULT", width: 80, dataField: "FR_RESULT", dataType: "number", summaryType: "sum" },
        { caption: "SR_RESULT", width: 80, dataField: "SR_RESULT", dataType: "number", summaryType: "sum" },
        { caption: "DC_RESULT", width: 80, dataField: "DC_RESULT", dataType: "number", summaryType: "sum" },
        { caption: "ED_RESULT", width: 80, dataField: "ED_RESULT", dataType: "number", summaryType: "sum" },
        { caption: "INSPECT_TOTAL_QTY", width: 80, dataField: "INSPECT_TOTAL_QTY", dataType: "number", summaryType: "sum" },
        { caption: "INSPECT_OK_QTY", width: 80, dataField: "INSPECT_OK_QTY", dataType: "number", summaryType: "sum" },
        { caption: "INS_OUT", width: 80, dataField: "INS_OUT", dataType: "number", summaryType: "sum" },
        { caption: "PD", width: 80, dataField: "PD", dataType: "number", summaryType: "sum" },
        { caption: "CAVITY", width: 80, dataField: "CAVITY", dataType: "number", summaryType: "sum" },
        { caption: "TOTAL_OUT_EA", width: 80, dataField: "TOTAL_OUT_EA", dataType: "number", summaryType: "sum" },
        { caption: "FR_EA", width: 80, dataField: "FR_EA", dataType: "number", summaryType: "sum" },
        { caption: "SR_EA", width: 80, dataField: "SR_EA", dataType: "number", summaryType: "sum" },
        { caption: "DC_EA", width: 80, dataField: "DC_EA", dataType: "number", summaryType: "sum" },
        { caption: "ED_EA", width: 80, dataField: "ED_EA", dataType: "number", summaryType: "sum" },
        { caption: "INSPECT_TOTAL_EA", width: 80, dataField: "INSPECT_TOTAL_EA", dataType: "number", summaryType: "sum" },
        { caption: "INSPECT_OK_EA", width: 80, dataField: "INSPECT_OK_EA", dataType: "number", summaryType: "sum" },
        { caption: "INS_OUTPUT_EA", width: 80, dataField: "INS_OUTPUT_EA", dataType: "number", summaryType: "sum" },
        { caption: "ROLL_LOSS_KT", width: 80, dataField: "ROLL_LOSS_KT", dataType: "number", summaryType: "sum" },
        { caption: "ROLL_LOSS", width: 80, dataField: "ROLL_LOSS", dataType: "number", summaryType: "sum" },
        { caption: "PROD_REQUEST_NO", width: 80, dataField: "PROD_REQUEST_NO", dataType: "string", summaryType: "count" },
        { caption: "PLAN_ID", width: 80, dataField: "PLAN_ID", dataType: "string", summaryType: "count" },
        { caption: "PLAN_EQ", width: 80, dataField: "PLAN_EQ", dataType: "string", summaryType: "count" },
        { caption: "G_CODE", width: 80, dataField: "G_CODE", dataType: "string", summaryType: "count" },
        { caption: "G_NAME", width: 80, dataField: "G_NAME", dataType: "string", summaryType: "count" },
        { caption: "FACTORY", width: 80, dataField: "FACTORY", dataType: "string", summaryType: "count" },
      ],
      store: datasxtable,
  });

  // ON MOUNT (Chỉ chạy đúng 1 lần duy nhất khi khởi tạo tab)
  useEffect(() => {
    load_barcode_table(false);
    getcodelist("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    barcodedatatable,
    filteredBarcodeData,
    codeList,
    selectedCode,
    setSelectedCode,
    selectedRows,
    setSelectedRows,
    setBarCodeInfo,
    isLoading,
    kpiData,
    quickSearch,
    setQuickSearch,
    typeFilter,
    setTypeFilter,
    prodFilter,
    setProdFilter,
    showhidePivotTable,
    setShowHidePivotTable,
    isFullscreen,
    toggleFullscreen,
    isFormOpen,
    setIsFormOpen,
    load_barcode_table,
    addBarcode,
    updateBarcode,
    deleteBarcode,
    resetForm,
    handleExportExcel,
    dataSource,
  };
};
