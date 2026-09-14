import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import moment from "moment";
import { generalQuery } from "../../../../api/Api";
import { RootState } from "../../../../redux/store";
import { UserData } from "../../../../api/GlobalInterface";
import { BLOCK_DATA } from "../../interfaces/qcInterface";
import { CustomerListData } from "../../../kinhdoanh/interfaces/kdInterface";
import { f_updateStockM090 } from "../../../../api/services/inventoryService";
import { f_updateNCRIDForFailing, f_updateNCRIDForHolding } from "../../utils/qcUtils";
import { SaveExcel } from "../../../../api/services/excelService";

export const useBlockData = () => {
  const theme = useSelector((state: RootState) => state.totalSlice.theme);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  // Search & Filter State
  const [onlyPending, setOnlyPending] = useState(true);
  const [testtype, setTestType] = useState("ALL");
  const [vendorLot, setVendorLot] = useState("");
  const [m_lot_no, setM_LOT_NO] = useState("");
  const [defect_phenomenon, setDefectPhenomenon] = useState("");
  const [remark, setReMark] = useState("");
  const [ncrId, setNCRID] = useState(0);

  // Table & Selection State
  const [blockingdatatable, setBlockingDataTable] = useState<BLOCK_DATA[]>([]);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectedRowsDataA = useRef<BLOCK_DATA[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);

  // Handlers for Grid Row Selection
  const onSelectionChange = useCallback((e: any) => {
    const selected = e?.api?.getSelectedRows() || [];
    selectedRowsDataA.current = selected;
    setSelectedCount(selected.length);
  }, []);

  // Fetch Blocking Data
  const handletraBlockingData = useCallback(() => {
    setIsLoading(true);
    generalQuery("loadBlockingData", {
      ONLY_PENDING: onlyPending,
      LOT_VENDOR: vendorLot,
      M_LOT_NO: m_lot_no,
      DEFECT: defect_phenomenon,
      NCR_ID: ncrId,
      PLSP: testtype,
    })
      .then((response) => {
        setIsLoading(false);
        if (response.data.tk_status !== "NG") {
          const loadeddata: BLOCK_DATA[] = response.data.data.map(
            (element: BLOCK_DATA, index: number) => ({
              ...element,
              INS_DATE: element.INS_DATE
                ? moment(element.INS_DATE).utc().format("YYYY-MM-DD HH:mm:ss")
                : "",
              UPD_DATE: element.UPD_DATE
                ? moment(element.UPD_DATE).utc().format("YYYY-MM-DD HH:mm:ss")
                : "",
              QC_PASS_DATE: element.QC_PASS_DATE
                ? moment(element.QC_PASS_DATE).utc().format("YYYY-MM-DD HH:mm:ss")
                : "",
              PROCESS_DATE: element.PROCESS_DATE
                ? moment(element.PROCESS_DATE).utc().format("YYYY-MM-DD")
                : "",
              id: index,
            })
          );
          setBlockingDataTable(loadeddata);
          selectedRowsDataA.current = [];
          setSelectedCount(0);
          Swal.fire("Thông báo", "Đã tải: " + loadeddata.length + " dòng", "success");
        } else {
          setBlockingDataTable([]);
          selectedRowsDataA.current = [];
          setSelectedCount(0);
          Swal.fire("Thông báo", "Không có dữ liệu", "error");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("loadBlockingData error:", error);
      });
  }, [onlyPending, vendorLot, m_lot_no, defect_phenomenon, ncrId, testtype]);

  // Action: SET PASS / FAIL
  const setQCPASS = useCallback(
    async (value: string) => {
      if (userData?.SUBDEPTNAME !== "IQC") {
        Swal.fire("Thông báo", "Bạn không phải người bộ phận IQC", "error");
        return;
      }
      if (selectedRowsDataA.current.length === 0) {
        Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
        return;
      }

      Swal.fire({
        title: "Xử lý phê duyệt Blocking",
        text: "Đang cập nhật dữ liệu, vui lòng chờ...",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      let err_code = "";
      for (let i = 0; i < selectedRowsDataA.current.length; i++) {
        const row = selectedRowsDataA.current[i];
        if (row.PL_BLOCK === "FAILING") {
          try {
            const response = await generalQuery("updateQCPASS_FAILING", {
              FAIL_ID: row.BLOCK_ID,
              M_LOT_NO: row.M_LOT_NO,
              PLAN_ID_SUDUNG: row.PLAN_ID,
              VALUE: value,
            });
            if (response.data.tk_status === "NG") {
              err_code += ` Lỗi FAILING (ID: ${row.BLOCK_ID}): ${response.data.message}`;
            }
          } catch (err: any) {
            err_code += ` Lỗi: ${err.message}`;
          }
        } else if (row.PL_BLOCK === "HOLDING") {
          try {
            const response = await generalQuery("updateQCPASS_HOLDING", {
              M_LOT_NO: row.M_LOT_NO,
              ID: row.BLOCK_ID,
              USE_YN: row.USE_YN,
              VALUE: value,
            });
            if (response.data.tk_status !== "NG") {
              let USE_YN_I222 = "X";
              const checkResp = await generalQuery("checkM_LOT_NO", {
                M_LOT_NO: row.M_LOT_NO,
              });
              if (checkResp.data.tk_status !== "NG" && checkResp.data.data.length > 0) {
                USE_YN_I222 = checkResp.data.data[0].USE_YN;
              }
              if (USE_YN_I222 !== "X") {
                const updateResp = await generalQuery("updateQCPASSI222_M_LOT_NO", {
                  M_LOT_NO: row.M_LOT_NO,
                  USE_YN: row.USE_YN,
                  VALUE: value,
                });
                if (updateResp.data.tk_status === "NG") {
                  err_code += ` Lỗi I222: ${updateResp.data.message}`;
                }
              }
            } else {
              err_code += ` Lỗi HOLDING: ${response.data.message}`;
            }
          } catch (err: any) {
            err_code += ` Lỗi: ${err.message}`;
          }
        }
      }

      if (err_code === "") {
        Swal.fire("Thông báo", "SET thành công", "success");
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
      f_updateStockM090();
      handletraBlockingData();
    },
    [userData, handletraBlockingData]
  );

  // Action: SET CLOSED / PENDING
  const setClose = useCallback(
    async (value: string) => {
      const isAllowed =
        userData?.SUBDEPTNAME === "MUA" ||
        userData?.SUBDEPTNAME === "IQC" ||
        userData?.EMPL_NO === "NHU1903";

      if (!isAllowed) {
        Swal.fire("Thông báo", "Bạn không có quyền thực hiện thao tác này (MUA/IQC)", "error");
        return;
      }
      if (selectedRowsDataA.current.length === 0) {
        Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
        return;
      }

      Swal.fire({
        title: "Đang cập nhật trạng thái",
        text: "Vui lòng chờ chút...",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      let err_code = "";
      for (let i = 0; i < selectedRowsDataA.current.length; i++) {
        const row = selectedRowsDataA.current[i];
        if (row.PL_BLOCK === "FAILING") {
          try {
            const resp = await generalQuery("updateCLOSE_FAILING", {
              FAIL_ID: row.BLOCK_ID,
              M_LOT_NO: row.M_LOT_NO,
              PLAN_ID_SUDUNG: row.PLAN_ID,
              VALUE: value,
            });
            if (resp.data.tk_status === "NG") {
              err_code += ` Lỗi FAILING: ${resp.data.message}`;
            }
          } catch (err: any) {
            err_code += ` Lỗi: ${err.message}`;
          }
        } else if (row.PL_BLOCK === "HOLDING") {
          try {
            const resp = await generalQuery("updateCLOSE_HOLDING", {
              HOLD_ID: row.BLOCK_ID,
              VALUE: value,
            });
            if (resp.data.tk_status === "NG") {
              err_code += ` Lỗi HOLDING: ${resp.data.message}`;
            }
          } catch (err: any) {
            err_code += ` Lỗi: ${err.message}`;
          }
        }
      }

      if (err_code === "") {
        Swal.fire("Thông báo", "SET thành công", "success");
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
      handletraBlockingData();
    },
    [userData, handletraBlockingData]
  );

  // Action: UPDATE NCR_ID
  const updateNCRIDBlocking = useCallback(async () => {
    if (userData?.SUBDEPTNAME !== "IQC") {
      Swal.fire("Thông báo", "Bạn không phải người bộ phận IQC", "error");
      return;
    }
    if (selectedRowsDataA.current.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
      return;
    }

    Swal.fire({
      title: "Cập nhật mã NCR",
      text: "Đang nạp dữ liệu, vui lòng chờ...",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    let err_code = "";
    for (let i = 0; i < selectedRowsDataA.current.length; i++) {
      const row = selectedRowsDataA.current[i];
      try {
        if (row.PL_BLOCK === "FAILING") {
          await f_updateNCRIDForFailing(row.BLOCK_ID, ncrId);
        } else if (row.PL_BLOCK === "HOLDING") {
          await f_updateNCRIDForHolding(row.BLOCK_ID, ncrId);
        }
      } catch (err: any) {
        err_code += ` Lỗi (ID: ${row.BLOCK_ID}): ${err.message}`;
      }
    }

    if (err_code === "") {
      Swal.fire("Thông báo", "Cập nhật NCR_ID thành công", "success");
    } else {
      Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
    }
    handletraBlockingData();
  }, [userData, ncrId, handletraBlockingData]);

  // Initial Load: Customers & IQC1 Sync
  useEffect(() => {
    generalQuery("selectcustomerList", {})
      .then((res) => {
        if (res.data.tk_status !== "NG") setCustomerList(res.data.data);
      })
      .catch(console.error);

    generalQuery("updateReasonHoldingFromIQC1", {}).catch(console.error);
  }, []);

  // Export Excel
  const handleExportExcel = useCallback(
    (type: "EX1" | "EX2") => {
      if (blockingdatatable.length === 0) {
        Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
        return;
      }
      const dataToExport =
        type === "EX1" && selectedRowsDataA.current.length > 0
          ? selectedRowsDataA.current
          : blockingdatatable;

      const formatted = dataToExport.map((row) => ({
        FACTORY: row.FACTORY,
        BLOCK_ID: row.BLOCK_ID,
        PL_BLOCK: row.PL_BLOCK,
        PLAN_ID: row.PLAN_ID,
        M_CODE: row.M_CODE,
        M_NAME: row.M_NAME,
        SIZE: row.WIDTH_CD,
        M_LOT_NO: row.M_LOT_NO,
        LOT_VENDOR: row.LOT_VENDOR,
        ROLL_QTY: row.BLOCK_ROLL_QTY,
        TOTAL_QTY: row.BLOCK_TOTAL_QTY,
        DEFECT: row.DEFECT,
        PLSP: row.USE_YN,
        QC_PASS: row.QC_PASS,
        QC_PASS_DATE: row.QC_PASS_DATE,
        QC_PASS_EMPL: row.QC_PASS_EMPL,
        STATUS: row.STATUS,
        NCR_ID: row.NCR_ID,
        LOT_SX: row.PROCESS_LOT_NO,
        INS_DATE: row.INS_DATE,
        INS_EMPL: row.INS_EMPL,
        UPD_DATE: row.UPD_DATE,
        UPD_EMPL: row.UPD_EMPL,
      }));

      SaveExcel(formatted, `IQC_BLOCKING_${moment().format("YYYYMMDD_HHmmss")}`);
    },
    [blockingdatatable]
  );

  // Reset Filters
  const handleResetFilters = useCallback(() => {
    setTestType("ALL");
    setVendorLot("");
    setM_LOT_NO("");
    setDefectPhenomenon("");
    setReMark("");
    setNCRID(0);
    setOnlyPending(true);
    setQuickFilterText("");
  }, []);

  // Toggle Fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // Calculate Realtime KPIs
  const kpiStats = useMemo(() => {
    const total = blockingdatatable.length;
    let passed = 0;
    let failed = 0;
    let pending = 0;

    for (let i = 0; i < total; i++) {
      const qp = blockingdatatable[i].QC_PASS;
      if (qp === "Y") passed++;
      else if (qp === "N") failed++;
      else pending++;
    }

    const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : "0.0";
    const failRate = total > 0 ? ((failed / total) * 100).toFixed(1) : "0.0";

    return {
      total,
      passed,
      failed,
      pending,
      passRate,
      failRate,
    };
  }, [blockingdatatable]);

  return {
    theme,
    userData,
    onlyPending,
    setOnlyPending,
    testtype,
    setTestType,
    vendorLot,
    setVendorLot,
    m_lot_no,
    setM_LOT_NO,
    defect_phenomenon,
    setDefectPhenomenon,
    remark,
    setReMark,
    ncrId,
    setNCRID,
    blockingdatatable,
    quickFilterText,
    setQuickFilterText,
    customerList,
    isLoading,
    isFullscreen,
    toggleFullscreen,
    selectedCount,
    onSelectionChange,
    handletraBlockingData,
    setQCPASS,
    setClose,
    updateNCRIDBlocking,
    handleExportExcel,
    handleResetFilters,
    kpiStats,
  };
};
