import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { AUDIT_HISTORY_DATA } from "../../../interfaces/qcInterface";
import {
  f_load_AUDIT_HISTORY_DATA,
  f_add_AUDIT_HISTORY_DATA,
  f_update_AUDIT_HISTORY_DATA,
  f_delete_AUDIT_HISTORY_DATA,
  f_updateFileInfo_AUDIT_HISTORY,
} from "../../../utils/qcUtils";
import { f_getcustomerlist } from "../../../../kinhdoanh/utils/kdUtils";
import { getCtrCd, uploadQuery } from "../../../../../api/Api";
import { SaveExcel } from "../../../../../api/services/excelService";
import {
  AuditHistoryKpiData,
  CustomerOption,
  AuditFormState,
  DialogMode,
} from "./auditHistoryTypes";

export const useAUDITHistoryData = () => {
  // 1. Date & Filter states
  const [fromDate, setFromDate] = useState(
    moment().subtract(30, "days").format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [allTime, setAllTime] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Data & loading states
  const [auditHistoryData, setAuditHistoryData] = useState<AUDIT_HISTORY_DATA[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 3. Selection references
  const [selectedRows, setSelectedRows] = useState<AUDIT_HISTORY_DATA[]>([]);
  const selectedRowRef = useRef<AUDIT_HISTORY_DATA | null>(null);

  // 4. Dialog & Customer states
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [customerList, setCustomerList] = useState<CustomerOption[]>([]);
  const [formState, setFormState] = useState<AuditFormState>({
    CUST_CD: "",
    CUST_NAME_KD: "",
    AUDIT_ID: "",
    AUDIT_DATE: moment().format("YYYY-MM-DD"),
    AUDIT_NAME: "",
    AUDIT_MAX_SCORE: 100,
    AUDIT_SCORE: 0,
    AUDIT_PASS_SCORE: 80,
    AUDIT_RESULT: "",
    AUDIT_FILE_EXT: "",
  });

  // Load customer list
  const fetchCustomerList = useCallback(async () => {
    try {
      const data = await f_getcustomerlist();
      if (Array.isArray(data)) {
        setCustomerList(data);
      }
    } catch (err) {
      console.error("Error loading customer list:", err);
    }
  }, []);

  useEffect(() => {
    fetchCustomerList();
  }, [fetchCustomerList]);

  // Load Audit History data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await f_load_AUDIT_HISTORY_DATA({
        FROM_DATE: fromDate,
        TO_DATE: toDate,
        ALLTIME: allTime,
      });
      if (res && res.length > 0) {
        setAuditHistoryData(res);
        Swal.fire({
          icon: "success",
          title: "Đã tải dữ liệu",
          text: `Đã nạp thành công ${res.length} đợt kiểm toán!`,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        setAuditHistoryData([]);
        Swal.fire({
          icon: "info",
          title: "Thông báo",
          text: "Không có dữ liệu trong khoảng thời gian đã chọn!",
          timer: 1800,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error loading audit history data:", error);
      Swal.fire("Lỗi", "Không thể nạp dữ liệu kiểm toán!", "error");
    } finally {
      setIsLoading(false);
      setSelectedRows([]);
      selectedRowRef.current = null;
    }
  }, [fromDate, toDate, allTime]);

  useEffect(() => {
    loadData();
  }, []);

  // Preset date handler
  const handleApplyPreset = (days: number) => {
    setAllTime(false);
    setToDate(moment().format("YYYY-MM-DD"));
    setFromDate(moment().subtract(days, "days").format("YYYY-MM-DD"));
  };

  // KPI Calculations
  const kpiData: AuditHistoryKpiData = useMemo(() => {
    const totalCount = auditHistoryData.length;
    if (totalCount === 0) {
      return {
        totalCount: 0,
        passCount: 0,
        failCount: 0,
        passRate: 0,
        avgScore: 0,
        avgMaxScore: 0,
        hasFileCount: 0,
        hasFileRate: 0,
      };
    }

    let passCount = 0;
    let failCount = 0;
    let scoreSum = 0;
    let maxScoreSum = 0;
    let hasFileCount = 0;

    auditHistoryData.forEach((row) => {
      if (row.AUDIT_RESULT === "PASS") passCount++;
      else failCount++;

      scoreSum += Number(row.AUDIT_SCORE || 0);
      maxScoreSum += Number(row.AUDIT_MAX_SCORE || 0);

      if (row.AUDIT_FILE_EXT && row.AUDIT_FILE_EXT.trim() !== "") {
        hasFileCount++;
      }
    });

    const passRate = Math.round((passCount / totalCount) * 100);
    const avgScore = Number((scoreSum / totalCount).toFixed(1));
    const avgMaxScore = Number((maxScoreSum / totalCount).toFixed(1));
    const hasFileRate = Math.round((hasFileCount / totalCount) * 100);

    return {
      totalCount,
      passCount,
      failCount,
      passRate,
      avgScore,
      avgMaxScore,
      hasFileCount,
      hasFileRate,
    };
  }, [auditHistoryData]);

  // Quick Filter
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return auditHistoryData;
    const q = searchQuery.toLowerCase().trim();
    return auditHistoryData.filter((item) => {
      const custCd = (item.CUST_CD || "").toLowerCase();
      const custName = (item.CUST_NAME_KD || "").toLowerCase();
      const auditId = String(item.AUDIT_ID || "");
      const auditName = (item.AUDIT_NAME || "").toLowerCase();
      const auditDate = (item.AUDIT_DATE || "").toLowerCase();
      const result = (item.AUDIT_RESULT || "").toLowerCase();

      return (
        custCd.includes(q) ||
        custName.includes(q) ||
        auditId.includes(q) ||
        auditName.includes(q) ||
        auditDate.includes(q) ||
        result.includes(q)
      );
    });
  }, [auditHistoryData, searchQuery]);

  // Dialog Controls
  const openAddModal = () => {
    setFormState({
      CUST_CD: "",
      CUST_NAME_KD: "",
      AUDIT_ID: auditHistoryData.length > 0 ? Math.max(...auditHistoryData.map((d) => Number(d.AUDIT_ID) || 0)) + 1 : 1,
      AUDIT_DATE: moment().format("YYYY-MM-DD"),
      AUDIT_NAME: "",
      AUDIT_MAX_SCORE: 100,
      AUDIT_SCORE: 0,
      AUDIT_PASS_SCORE: 80,
      AUDIT_RESULT: "PASS",
      AUDIT_FILE_EXT: "",
    });
    setDialogMode("add");
  };

  const openEditModal = (targetRow?: AUDIT_HISTORY_DATA) => {
    const row = targetRow || selectedRowRef.current || selectedRows[0];
    if (!row) {
      Swal.fire("Lưu ý", "Vui lòng chọn 1 đợt audit để chỉnh sửa!", "warning");
      return;
    }
    setFormState({
      id: row.id,
      CTR_CD: row.CTR_CD,
      CUST_CD: row.CUST_CD || "",
      CUST_NAME_KD: row.CUST_NAME_KD || "",
      AUDIT_ID: row.AUDIT_ID,
      AUDIT_DATE: row.AUDIT_DATE || moment().format("YYYY-MM-DD"),
      AUDIT_NAME: row.AUDIT_NAME || "",
      AUDIT_MAX_SCORE: row.AUDIT_MAX_SCORE,
      AUDIT_SCORE: row.AUDIT_SCORE,
      AUDIT_PASS_SCORE: row.AUDIT_PASS_SCORE,
      AUDIT_RESULT: row.AUDIT_RESULT,
      AUDIT_FILE_EXT: row.AUDIT_FILE_EXT,
    });
    setDialogMode("edit");
  };

  const closeModal = () => {
    setDialogMode(null);
  };

  // Upload attachment file logic
  const handleUploadFileForAudit = async (auditId: number | string, file: File) => {
    const ext = file.name.split(".").pop();
    const filename = `${getCtrCd()}_${auditId}.${ext}`;
    const uploadFolder = "audithistory";

    try {
      const response = await uploadQuery(file, filename, uploadFolder);
      if (response.data.tk_status !== "NG") {
        const updateRes = await f_updateFileInfo_AUDIT_HISTORY({
          AUDIT_ID: Number(auditId),
          AUDIT_FILE_EXT: `.${ext}`,
        });
        if (updateRes === "") {
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error("Error uploading audit file:", err);
      return false;
    }
  };

  // Standalone file upload trigger from cell
  const handleUploadDoc = (auditRow: AUDIT_HISTORY_DATA) => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      Swal.fire({
        title: "Đang tải lên...",
        text: "Vui lòng chờ trong giây lát",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const success = await handleUploadFileForAudit(auditRow.AUDIT_ID, file);
      if (success) {
        Swal.fire("Thành công", "Đã tải lên tệp đính kèm!", "success");
        loadData();
      } else {
        Swal.fire("Lỗi", "Tải lên tệp thất bại!", "error");
      }
    };
    input.click();
  };

  // Save Add / Edit
  const handleSaveAudit = async (pendingFile?: File | null) => {
    if (!formState.CUST_CD) {
      Swal.fire("Lỗi", "Vui lòng chọn khách hàng!", "error");
      return;
    }
    if (!formState.AUDIT_NAME) {
      Swal.fire("Lỗi", "Vui lòng nhập tên đợt kiểm toán (AUDIT_NAME)!", "error");
      return;
    }

    const maxScore = Number(formState.AUDIT_MAX_SCORE) || 0;
    const score = Number(formState.AUDIT_SCORE) || 0;
    const passScore = Number(formState.AUDIT_PASS_SCORE) || 0;
    const result = score >= passScore ? "PASS" : "FAIL";

    const payload: any = {
      ...formState,
      AUDIT_ID: Number(formState.AUDIT_ID),
      AUDIT_MAX_SCORE: maxScore,
      AUDIT_SCORE: score,
      AUDIT_PASS_SCORE: passScore,
      AUDIT_RESULT: result,
    };

    if (dialogMode === "add") {
      const addRes = await f_add_AUDIT_HISTORY_DATA(payload);
      if (addRes) {
        Swal.fire("Lỗi", addRes, "error");
        return;
      }

      if (pendingFile) {
        await handleUploadFileForAudit(payload.AUDIT_ID, pendingFile);
      }
      Swal.fire("Thành công", "Đã thêm mới đợt kiểm toán thành công!", "success");
    } else if (dialogMode === "edit") {
      const editRes = await f_update_AUDIT_HISTORY_DATA(payload);
      if (editRes) {
        Swal.fire("Lỗi", editRes, "error");
        return;
      }

      if (pendingFile) {
        await handleUploadFileForAudit(payload.AUDIT_ID, pendingFile);
      }
      Swal.fire("Thành công", "Đã cập nhật thông tin kiểm toán!", "success");
    }

    closeModal();
    loadData();
  };

  // Delete selected rows
  const handleDeleteSelectedRows = async () => {
    if (selectedRows.length === 0) {
      Swal.fire("Lưu ý", "Vui lòng chọn ít nhất 1 đợt audit để xóa!", "warning");
      return;
    }

    const confirm = await Swal.fire({
      title: "Xác nhận xóa?",
      text: `Bạn có chắc chắn muốn xóa ${selectedRows.length} đợt kiểm toán đã chọn?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Đồng ý xóa",
      cancelButtonText: "Hủy",
    });

    if (!confirm.isConfirmed) return;

    for (let i = 0; i < selectedRows.length; i++) {
      await f_delete_AUDIT_HISTORY_DATA(selectedRows[i]);
    }

    Swal.fire("Đã xóa", `Đã xóa thành công ${selectedRows.length} dòng!`, "success");
    loadData();
  };

  // Excel Export
  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel!", "info");
      return;
    }
    SaveExcel(
      filteredData,
      `Audit_History_${moment().format("YYYYMMDD_HHmmss")}`
    );
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    allTime,
    setAllTime,
    searchQuery,
    setSearchQuery,
    isLoading,
    isFullscreen,
    toggleFullscreen,
    filteredData,
    kpiData,
    selectedRows,
    setSelectedRows,
    selectedRowRef,
    dialogMode,
    customerList,
    formState,
    setFormState,
    loadData,
    handleApplyPreset,
    openAddModal,
    openEditModal,
    closeModal,
    handleSaveAudit,
    handleDeleteSelectedRows,
    handleUploadDoc,
    handleExportExcel,
  };
};
