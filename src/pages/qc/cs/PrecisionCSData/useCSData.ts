import { useState, useMemo, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery, uploadQuery } from "../../../../api/Api";
import {
  CS_CNDB_DATA,
  CS_RMA_DATA,
  CS_TAXI_DATA,
  CSCONFIRM_DATA,
} from "../../interfaces/qcInterface";
import { SaveExcel } from "../../../../api/services/excelService";

export type CSOptionType =
  | "dataconfirm"
  | "datarma"
  | "datacndbkhachhang"
  | "datataxi";

export interface CSFilterState {
  FROM_DATE: string;
  TO_DATE: string;
  G_NAME: string;
  G_CODE: string;
  PROD_REQUEST_NO: string;
  CUST_NAME_KD: string;
}

export const useCSData = () => {
  const [option, setOption] = useState<CSOptionType>("dataconfirm");
  const [filterData, setFilterData] = useState<CSFilterState>({
    FROM_DATE: moment().format("YYYY-MM-DD"),
    TO_DATE: moment().format("YYYY-MM-DD"),
    G_NAME: "",
    G_CODE: "",
    PROD_REQUEST_NO: "",
    CUST_NAME_KD: "",
  });

  const [csData, setCsData] = useState<any[]>([]);
  const [quickSearchText, setQuickSearchText] = useState("");
  const [showPivotModal, setShowPivotModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modal NNDS State
  const [showNNDSModal, setShowNNDSModal] = useState(false);
  const [currentDefectRow, setCurrentDefectRow] = useState<CSCONFIRM_DATA | null>(null);
  const [currentNN, setCurrentNN] = useState("");
  const [currentDS, setCurrentDS] = useState("");

  const handleFilterChange = (field: keyof CSFilterState, value: string) => {
    setFilterData((prev) => ({ ...prev, [field]: value }));
  };

  // Tra cứu dữ liệu CS theo option đang chọn
  const loadCSData = useCallback(
    (targetOption?: CSOptionType) => {
      const activeOption = targetOption || option;
      Swal.fire({
        title: "Đang tải dữ liệu CS",
        text: "Vui lòng chờ trong giây lát...",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      let queryName = "";
      switch (activeOption) {
        case "dataconfirm":
          queryName = "tracsconfirm";
          break;
        case "datarma":
          queryName = "tracsrma";
          break;
        case "datacndbkhachhang":
          queryName = "tracsCNDB";
          break;
        case "datataxi":
          queryName = "tracsTAXI";
          break;
      }

      generalQuery(queryName, filterData)
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            const raw = response.data.data || [];
            let loaded: any[] = [];

            if (activeOption === "dataconfirm") {
              loaded = raw.map((el: CSCONFIRM_DATA, idx: number) => ({
                ...el,
                id: idx,
                PHANLOAI: el.PHANLOAI || "MD",
                CONFIRM_DATE: el.CONFIRM_DATE
                  ? moment.utc(el.CONFIRM_DATE).format("YYYY-MM-DD")
                  : "",
                INS_DATETIME: el.INS_DATETIME
                  ? moment.utc(el.INS_DATETIME).format("YYYY-MM-DD HH:mm:ss")
                  : "",
              }));
            } else if (activeOption === "datarma") {
              loaded = raw.map((el: CS_RMA_DATA, idx: number) => ({
                ...el,
                id: idx,
                CONFIRM_DATE: el.CONFIRM_DATE
                  ? moment.utc(el.CONFIRM_DATE).format("YYYY-MM-DD")
                  : "",
                RETURN_DATE: el.RETURN_DATE
                  ? moment.utc(el.RETURN_DATE).format("YYYY-MM-DD")
                  : "",
                INS_DATETIME: el.INS_DATETIME
                  ? moment.utc(el.INS_DATETIME).format("YYYY-MM-DD HH:mm:ss")
                  : "",
              }));
            } else if (activeOption === "datacndbkhachhang") {
              loaded = raw.map((el: CS_CNDB_DATA, idx: number) => ({
                ...el,
                id: idx,
                SA_REQUEST_DATE: el.SA_REQUEST_DATE
                  ? moment.utc(el.SA_REQUEST_DATE).format("YYYY-MM-DD")
                  : "",
                REQUEST_DATETIME: el.REQUEST_DATETIME
                  ? moment.utc(el.REQUEST_DATETIME).format("YYYY-MM-DD")
                  : "",
                INS_DATETIME: el.INS_DATETIME
                  ? moment.utc(el.INS_DATETIME).format("YYYY-MM-DD HH:mm:ss")
                  : "",
              }));
            } else if (activeOption === "datataxi") {
              loaded = raw.map((el: CS_TAXI_DATA, idx: number) => ({
                ...el,
                id: idx,
                TAXI_DATE: el.TAXI_DATE
                  ? moment.utc(el.TAXI_DATE).format("YYYY-MM-DD")
                  : "",
                INS_DATETIME: el.INS_DATETIME
                  ? moment.utc(el.INS_DATETIME).format("YYYY-MM-DD HH:mm:ss")
                  : "",
              }));
            }

            setCsData(loaded);
            Swal.fire({
              title: "Tải Hoàn Tất",
              text: `Đã nạp ${loaded.length.toLocaleString("en-US")} dòng dữ liệu`,
              icon: "success",
              timer: 1600,
              showConfirmButton: false,
            });
          } else {
            setCsData([]);
            Swal.fire("Thông Báo", "Nội dung: " + response.data.message, "error");
          }
        })
        .catch((error) => {
          console.error("Lỗi khi load CS data:", error);
          setCsData([]);
          Swal.fire("Lỗi Kết Nối", "Không thể kết nối máy chủ!", "error");
        });
    },
    [filterData, option]
  );

  // Quick search filter trên danh sách
  const filteredData = useMemo(() => {
    if (!quickSearchText.trim()) return csData;
    const query = quickSearchText.toLowerCase().trim();
    return csData.filter((row) => {
      return (
        String(row.G_CODE || "").toLowerCase().includes(query) ||
        String(row.G_NAME || "").toLowerCase().includes(query) ||
        String(row.G_NAME_KD || "").toLowerCase().includes(query) ||
        String(row.CUST_NAME_KD || "").toLowerCase().includes(query) ||
        String(row.PROD_REQUEST_NO || "").toLowerCase().includes(query) ||
        String(row.CONTENT || "").toLowerCase().includes(query) ||
        String(row.CS_EMPL_NO || "").toLowerCase().includes(query) ||
        String(row.EMPL_NAME || "").toLowerCase().includes(query) ||
        String(row.CONFIRM_ID || "").toLowerCase().includes(query) ||
        String(row.SA_ID || "").toLowerCase().includes(query) ||
        String(row.RMA_ID || "").toLowerCase().includes(query) ||
        String(row.TAXI_ID || "").toLowerCase().includes(query)
      );
    });
  }, [csData, quickSearchText]);

  // Đổi Option Segment
  const handleOptionChange = (newOpt: CSOptionType) => {
    setOption(newOpt);
    setCsData([]);
    loadCSData(newOpt);
  };

  // Mở modal NNDS
  const openNNDSModal = (row: CSCONFIRM_DATA) => {
    setCurrentDefectRow(row);
    setCurrentNN(row.NG_NHAN || "");
    setCurrentDS(row.DOI_SACH || "");
    setShowNNDSModal(true);
  };

  const closeNNDSModal = () => {
    setShowNNDSModal(false);
    setCurrentDefectRow(null);
    setCurrentNN("");
    setCurrentDS("");
  };

  // Cập nhật NNDS
  const updateNNDS = () => {
    if (!currentDefectRow) return;
    generalQuery("updatenndscs", {
      CONFIRM_ID: currentDefectRow.CONFIRM_ID,
      NG_NHAN: currentNN,
      DOI_SACH: currentDS,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thành Công", "Đã cập nhật Nguyên Nhân - Đối Sách", "success");
          // Cập nhật trực tiếp trên client row
          setCsData((prev) =>
            prev.map((item) =>
              item.CONFIRM_ID === currentDefectRow.CONFIRM_ID
                ? { ...item, NG_NHAN: currentNN, DOI_SACH: currentDS }
                : item
            )
          );
          closeNNDSModal();
        } else {
          Swal.fire("Lỗi Cập Nhật", response.data.message, "error");
        }
      })
      .catch((err) => {
        console.error("Lỗi updatenndscs:", err);
        Swal.fire("Lỗi", "Không thể cập nhật đối sách!", "error");
      });
  };

  // Upload ảnh lỗi CS
  const uploadCSImage = async (cs_ID: number, up_file: any) => {
    if (!up_file) {
      Swal.fire("Thông Báo", "Vui lòng chọn file ảnh JPG!", "warning");
      return;
    }
    uploadQuery(up_file, "CS_" + cs_ID + ".jpg", "cs")
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          generalQuery("updateCSImageStatus", { CONFIRM_ID: cs_ID }).then((res) => {
            if (res.data.tk_status !== "NG") {
              Swal.fire("Thành Công", "Upload ảnh khuyết tật thành công", "success");
              setCsData((prev) =>
                prev.map((item) =>
                  item.CONFIRM_ID === cs_ID ? { ...item, LINK: "Y" } : item
                )
              );
            }
          });
        } else {
          Swal.fire("Thất Bại", "Upload ảnh thất bại: " + response.data.message, "error");
        }
      })
      .catch((err) => console.error("Lỗi upload ảnh CS:", err));
  };

  // Upload file đối sách PPTX VN/KR
  const uploadCSDoiSach = async (cs_ID: number, up_file: any, lang: "VN" | "KR") => {
    if (!up_file) {
      Swal.fire("Thông Báo", "Vui lòng chọn file thuyết trình PPTX!", "warning");
      return;
    }
    uploadQuery(up_file, "CS_" + cs_ID + "_" + lang + ".pptx", "cs")
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const command =
            lang === "VN" ? "updateCSDoiSachVNStatus" : "updateCSDoiSachKRStatus";
          generalQuery(command, { CONFIRM_ID: cs_ID }).then((res) => {
            if (res.data.tk_status !== "NG") {
              Swal.fire("Thành Công", `Upload đối sách (${lang}) thành công`, "success");
              setCsData((prev) =>
                prev.map((item) =>
                  item.CONFIRM_ID === cs_ID
                    ? { ...item, [lang === "VN" ? "DS_VN" : "DS_KR"]: "Y" }
                    : item
                )
              );
            }
          });
        } else {
          Swal.fire("Thất Bại", response.data.message, "error");
        }
      })
      .catch((err) => console.error("Lỗi upload đối sách CS:", err));
  };

  // Tính toán KPI Realtime thích ứng theo từng phân hệ
  const kpiMetrics = useMemo(() => {
    const totalCount = csData.length;

    if (option === "dataconfirm") {
      let completedNNDS = 0;
      let totalReduceAmount = 0;
      let totalReduceQty = 0;
      let totalInspectQty = 0;
      let totalNGQty = 0;
      let hasImage = 0;
      let hasVN = 0;
      let hasKR = 0;
      const custSet = new Set<string>();
      const skuSet = new Set<string>();

      for (const r of csData) {
        if (r.DOI_SACH && r.DOI_SACH.trim() !== "") completedNNDS++;
        totalReduceAmount += r.REDUCE_AMOUNT || 0;
        totalReduceQty += r.REDUCE_QTY || 0;
        totalInspectQty += r.INSPECT_QTY || 0;
        totalNGQty += r.NG_QTY || 0;
        if (r.LINK === "Y") hasImage++;
        if (r.DS_VN === "Y") hasVN++;
        if (r.DS_KR === "Y") hasKR++;
        if (r.CUST_NAME_KD) custSet.add(r.CUST_NAME_KD);
        if (r.G_CODE) skuSet.add(r.G_CODE);
      }

      const nndsRate = totalCount > 0 ? (completedNNDS / totalCount) * 100 : 0;
      const avgReplaceRate =
        totalInspectQty > 0 ? (totalReduceQty / totalInspectQty) * 100 : 0;

      return {
        mode: "confirm",
        totalCount,
        completedNNDS,
        nndsRate,
        totalReduceAmount,
        totalReduceQty,
        totalInspectQty,
        totalNGQty,
        avgReplaceRate,
        uniqueCustomers: custSet.size,
        uniqueSKUs: skuSet.size,
        hasImage,
        hasVN,
        hasKR,
      };
    }

    if (option === "datarma") {
      let totalReturnQty = 0;
      let totalReturnAmount = 0;
      let sortingOk = 0;
      let sortingNG = 0;
      for (const r of csData) {
        totalReturnQty += r.RETURN_QTY || 0;
        totalReturnAmount += r.RETURN_AMOUNT || 0;
        sortingOk += r.SORTING_OK_QTY || 0;
        sortingNG += r.SORTING_NG_QTY || 0;
      }
      return {
        mode: "rma",
        totalCount,
        totalReturnQty,
        totalReturnAmount,
        sortingOk,
        sortingNG,
      };
    }

    if (option === "datacndbkhachhang") {
      let totalSAQty = 0;
      let okCount = 0;
      let ngCount = 0;
      for (const r of csData) {
        totalSAQty += r.SA_QTY || 0;
        if (r.RESULT === "OK" || r.RESULT === "Y") okCount++;
        else ngCount++;
      }
      return {
        mode: "cndb",
        totalCount,
        totalSAQty,
        okCount,
        ngCount,
      };
    }

    if (option === "datataxi") {
      let totalTaxiAmount = 0;
      const staffSet = new Set<string>();
      for (const r of csData) {
        totalTaxiAmount += r.TAXI_AMOUNT || 0;
        if (r.CS_EMPL_NO) staffSet.add(r.CS_EMPL_NO);
      }
      return {
        mode: "taxi",
        totalCount,
        totalTaxiAmount,
        uniqueStaff: staffSet.size,
      };
    }

    return { mode: "unknown", totalCount: 0 };
  }, [csData, option]);

  // Xuất Excel EX1 (dữ liệu lọc)
  const handleExportEX1 = useCallback(() => {
    const target = filteredData.length > 0 ? filteredData : csData;
    if (target.length === 0) {
      Swal.fire("Thông Báo", "Không có dữ liệu để xuất Excel!", "warning");
      return;
    }
    SaveExcel(target, `CS_${option.toUpperCase()}_FILTERED_${moment().format("YYYYMMDD_HHmmss")}`);
  }, [filteredData, csData, option]);

  // Xuất Excel EX2 (toàn bộ)
  const handleExportEX2 = useCallback(() => {
    if (csData.length === 0) {
      Swal.fire("Thông Báo", "Không có dữ liệu để xuất Excel!", "warning");
      return;
    }
    SaveExcel(csData, `CS_${option.toUpperCase()}_ALL_${moment().format("YYYYMMDD_HHmmss")}`);
  }, [csData, option]);

  // Toggle Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      }
    }
  }, []);

  return {
    option,
    handleOptionChange,
    filterData,
    handleFilterChange,
    csData,
    filteredData,
    quickSearchText,
    setQuickSearchText,
    loadCSData,
    kpiMetrics,
    showPivotModal,
    setShowPivotModal,
    isFullscreen,
    toggleFullscreen,
    showNNDSModal,
    currentDefectRow,
    currentNN,
    setCurrentNN,
    currentDS,
    setCurrentDS,
    openNNDSModal,
    closeNNDSModal,
    updateNNDS,
    uploadCSImage,
    uploadCSDoiSach,
    handleExportEX1,
    handleExportEX2,
  };
};
