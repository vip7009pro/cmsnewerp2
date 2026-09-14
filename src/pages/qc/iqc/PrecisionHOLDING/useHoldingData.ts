import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import moment from "moment";
import { generalQuery } from "../../../../api/Api";
import { RootState } from "../../../../redux/store";
import { UserData } from "../../../../api/GlobalInterface";
import { HOLDING_DATA } from "../../interfaces/qcInterface";
import { f_updateNCRIDForHolding } from "../../utils/qcUtils";
import { SaveExcel } from "../../../../api/services/excelService";

export const useHoldingData = () => {
  const theme = useSelector((state: RootState) => state.totalSlice.theme);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  // Search Filters
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [alltime, setAllTime] = useState(true);
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [mLotNo, setMLotNo] = useState("");
  const [mStatus, setMStatus] = useState("ALL");
  const [ncrId, setNCRID] = useState(0);
  const [id, setID] = useState("");

  // Table & Selection
  const [holdingdatatable, setHoldingDataTable] = useState<HOLDING_DATA[]>([]);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectedRowsData = useRef<HOLDING_DATA[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);

  const onSelectionChange = useCallback((e: any) => {
    const selected = e?.api?.getSelectedRows() || [];
    selectedRowsData.current = selected;
    setSelectedCount(selected.length);
  }, []);

  // Fetch Holding Material Data
  const handletraHoldingData = useCallback(() => {
    setIsLoading(true);
    generalQuery("traholdingmaterial", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      M_NAME: m_name,
      M_CODE: m_code,
      M_LOT_NO: mLotNo,
      M_STATUS: mStatus,
      ID: id,
    })
      .then((response) => {
        setIsLoading(false);
        if (response.data.tk_status !== "NG") {
          const loadeddata: HOLDING_DATA[] = response.data.data.map(
            (element: HOLDING_DATA, index: number) => ({
              ...element,
              INS_DATE: element.INS_DATE
                ? moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss")
                : "",
              UPD_DATE: element.UPD_DATE
                ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD HH:mm:ss")
                : "",
              QC_PASS_DATE: element.QC_PASS_DATE
                ? moment.utc(element.QC_PASS_DATE).format("YYYY-MM-DD HH:mm:ss")
                : "",
              id: index,
            })
          );
          setHoldingDataTable(loadeddata);
          selectedRowsData.current = [];
          setSelectedCount(0);
          Swal.fire("Thông báo", `Đã tải ${loadeddata.length} dòng`, "success");
        } else {
          setHoldingDataTable([]);
          selectedRowsData.current = [];
          setSelectedCount(0);
          Swal.fire("Thông báo", `Nội dung: ${response.data.message}`, "error");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("traholdingmaterial error:", error);
      });
  }, [alltime, fromdate, todate, m_name, m_code, mLotNo, mStatus, id]);

  // SET PASS / FAIL
  const setQCPASS = useCallback(
    async (value: string) => {
      if (userData?.SUBDEPTNAME !== "IQC") {
        Swal.fire("Thông báo", "Bạn không phải người bộ phận IQC", "error");
        return;
      }
      if (selectedRowsData.current.length === 0) {
        Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
        return;
      }

      Swal.fire({
        title: "SET/RESET PASS",
        text: "Đang cập nhật trạng thái phê duyệt...",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      let err_code = "";
      for (let i = 0; i < selectedRowsData.current.length; i++) {
        const row = selectedRowsData.current[i];
        try {
          const response = await generalQuery("updateQCPASS_HOLDING", {
            M_LOT_NO: row.M_LOT_NO,
            ID: row.HOLD_ID,
            VALUE: value,
            USE_YN: row.USE_YN,
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
              await generalQuery("updateQCPASSI222_M_LOT_NO", {
                M_LOT_NO: row.M_LOT_NO,
                VALUE: value,
                USE_YN: row.USE_YN,
              });
            }
          } else {
            err_code += ` Lỗi HOLDING (ID: ${row.HOLD_ID}): ${response.data.message}`;
          }
        } catch (err: any) {
          err_code += ` Lỗi: ${err.message}`;
        }
      }

      if (err_code === "") {
        Swal.fire("Thông báo", "SET thành công", "success");
      } else {
        Swal.fire("Thông báo", `Lỗi: ${err_code}`, "error");
      }
      handletraHoldingData();
    },
    [userData, handletraHoldingData]
  );

  // UPDATE NCR ID
  const updateNCRIDHolding = useCallback(async () => {
    if (userData?.SUBDEPTNAME !== "IQC") {
      Swal.fire("Thông báo", "Bạn không phải người bộ phận IQC", "error");
      return;
    }
    if (selectedRowsData.current.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
      return;
    }
    if (!ncrId || ncrId === 0) {
      Swal.fire("Thông báo", "NCR ID phải khác 0", "error");
      return;
    }

    Swal.fire({
      title: "UPDATE NCR ID",
      text: "Đang cập nhật mã số NCR...",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    let err_code = "";
    for (let i = 0; i < selectedRowsData.current.length; i++) {
      try {
        await f_updateNCRIDForHolding(selectedRowsData.current[i].HOLD_ID, ncrId);
      } catch (err: any) {
        err_code += ` Lỗi: ${err.message}`;
      }
    }

    if (err_code === "") {
      Swal.fire("Thông báo", "UPDATE NCR ID thành công", "success");
    } else {
      Swal.fire("Thông báo", `Lỗi: ${err_code}`, "error");
    }
    handletraHoldingData();
  }, [userData, ncrId, handletraHoldingData]);

  // UPDATE REASON
  const updateReason = useCallback(async () => {
    if (selectedRowsData.current.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
      return;
    }

    Swal.fire({
      title: "Update hiện tượng lỗi",
      text: "Đang update thông tin lỗi...",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    let err_code = "";
    const reasonToUpdate = selectedRowsData.current[0].REASON || "";
    for (let i = 0; i < selectedRowsData.current.length; i++) {
      try {
        const response = await generalQuery("updateMaterialHoldingReason", {
          HOLD_ID: selectedRowsData.current[i].HOLD_ID,
          REASON: reasonToUpdate,
        });
        if (response.data.tk_status === "NG") {
          err_code += ` Lỗi ID ${selectedRowsData.current[i].HOLD_ID}: ${response.data.message}`;
        }
      } catch (err: any) {
        err_code += ` Lỗi: ${err.message}`;
      }
    }

    if (err_code === "") {
      Swal.fire("Thông báo", "Update lý do lỗi thành công", "success");
    } else {
      Swal.fire("Thông báo", `Lỗi: ${err_code}`, "error");
    }
    handletraHoldingData();
  }, [handletraHoldingData]);

  // Auto Sync Reason from IQC1
  useEffect(() => {
    generalQuery("updateReasonHoldingFromIQC1", {}).catch(console.error);
  }, []);

  // Export Excel
  const handleExportExcel = useCallback(
    (type: "EX1" | "EX2") => {
      if (holdingdatatable.length === 0) {
        Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
        return;
      }
      const dataToExport =
        type === "EX1" && selectedRowsData.current.length > 0
          ? selectedRowsData.current
          : holdingdatatable;

      const formatted = dataToExport.map((row) => ({
        HOLD_ID: row.HOLD_ID,
        NCR_ID: row.NCR_ID,
        HOLDING_MONTH: row.HOLDING_MONTH,
        FACTORY: row.FACTORY,
        WAHS_CD: row.WAHS_CD,
        LOC_CD: row.LOC_CD,
        M_LOT_NO: row.M_LOT_NO,
        M_CODE: row.M_CODE,
        M_NAME: row.M_NAME,
        WIDTH_CD: row.WIDTH_CD,
        ROLL_QTY: row.HOLDING_ROLL_QTY,
        QTY: row.HOLDING_QTY,
        TOTAL_QTY: row.HOLDING_TOTAL_QTY,
        REASON: row.REASON,
        IN_DATE: row.HOLDING_IN_DATE,
        OUT_DATE: row.HOLDING_OUT_DATE,
        VENDOR_LOT: row.VENDOR_LOT,
        USE_YN: row.USE_YN,
        QC_PASS: row.QC_PASS,
        QC_PASS_DATE: row.QC_PASS_DATE,
        QC_PASS_EMPL: row.QC_PASS_EMPL,
        PROCESS_STATUS: row.PROCESS_STATUS,
        PROCESS_DATE: row.PROCESS_DATE,
        PROCESS_EMPL: row.PROCESS_EMPL,
        INS_DATE: row.INS_DATE,
        INS_EMPL: row.INS_EMPL,
        UPD_DATE: row.UPD_DATE,
        UPD_EMPL: row.UPD_EMPL,
      }));

      SaveExcel(formatted, `IQC_HOLDING_${moment().format("YYYYMMDD_HHmmss")}`);
    },
    [holdingdatatable]
  );

  // Reset Filters
  const handleResetFilters = useCallback(() => {
    setFromDate(moment().format("YYYY-MM-DD"));
    setToDate(moment().format("YYYY-MM-DD"));
    setAllTime(true);
    setM_Name("");
    setM_Code("");
    setMLotNo("");
    setMStatus("ALL");
    setNCRID(0);
    setID("");
    setQuickFilterText("");
  }, []);

  // Toggle Fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // Calculate KPIs Realtime
  const kpiStats = useMemo(() => {
    const total = holdingdatatable.length;
    let passed = 0;
    let failed = 0;
    let pending = 0;

    for (let i = 0; i < total; i++) {
      const qp = holdingdatatable[i].QC_PASS;
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
  }, [holdingdatatable]);

  return {
    theme,
    userData,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    alltime,
    setAllTime,
    m_name,
    setM_Name,
    m_code,
    setM_Code,
    mLotNo,
    setMLotNo,
    mStatus,
    setMStatus,
    ncrId,
    setNCRID,
    id,
    setID,
    holdingdatatable,
    quickFilterText,
    setQuickFilterText,
    isLoading,
    isFullscreen,
    toggleFullscreen,
    selectedCount,
    onSelectionChange,
    handletraHoldingData,
    setQCPASS,
    updateNCRIDHolding,
    updateReason,
    handleExportExcel,
    handleResetFilters,
    kpiStats,
  };
};
