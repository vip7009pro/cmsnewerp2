import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { generalQuery, getUserData, uploadQuery } from "../../../../../api/Api";
import { SaveExcel } from "../../../../../api/services/excelService";
import {
  CustomerListData,
  AUDIT_LIST,
  AUDIT_RESULT,
  AUDIT_CHECKLIST_RESULT,
  AUDIT_CHECK_LIST,
  AUDITKpiMetrics,
} from "./auditTypes";

export const useAUDITData = () => {
  // State Bộ Lọc & Ngày Tháng
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectedAuditID, setSelectedAuditID] = useState<number>(1);
  const [selectedAuditResultID, setSelectedAuditResultID] = useState<number>(-1);

  // State Dữ Liệu
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [selectedCust_CD, setSelectedCust_CD] = useState<CustomerListData | null>(null);
  const [auditList, setAuditList] = useState<AUDIT_LIST[]>([]);
  const [auditResultList, setAuditResultList] = useState<AUDIT_RESULT[]>([]);
  const [auditResultCheckList, setAuditResultCheckList] = useState<AUDIT_CHECKLIST_RESULT[]>([]);
  const selectedChecklistRows = useRef<AUDIT_CHECKLIST_RESULT[]>([]);
  const [selectedChecklistCount, setSelectedChecklistCount] = useState<number>(0);

  // State Modal Tạo Mới Form Mẫu
  const [showHideAddForm, setShowHideAddForm] = useState<boolean>(false);
  const [passScore, setPassScore] = useState<number>(80);
  const [auditName, setAuditName] = useState<string>("");
  const [uploadExcelJson, setUploadExcelJson] = useState<Array<any>>([]);

  // State Image Preview Modal
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState<boolean>(false);

  // State UI
  const [quickFilterText, setQuickFilterText] = useState<string>("");
  const [isBatchPanelOpen, setIsBatchPanelOpen] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. Fullscreen API
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Lỗi fullscreen:", err);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.error("Lỗi thoát fullscreen:", err);
        });
      }
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // 2. Nạp Danh Sách Khách Hàng
  const getCustomerList = useCallback(() => {
    generalQuery("selectCustomerAndVendorList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setCustomerList(response.data.data);
          if (response.data.data.length > 0 && !selectedCust_CD) {
            setSelectedCust_CD(response.data.data[0]);
          }
        }
      })
      .catch((error) => console.error("selectCustomerAndVendorList error:", error));
  }, [selectedCust_CD]);

  // 3. Nạp Danh Sách Mẫu Audit (Master Audit List)
  const loadAuditList = useCallback(() => {
    generalQuery("auditlistcheck", {
      FROM_DATE: fromDate,
      TO_DATE: toDate,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loaded = response.data.data.map((el: AUDIT_LIST, idx: number) => ({
            ...el,
            id: idx,
          }));
          setAuditList(loaded);
          if (loaded.length > 0 && selectedAuditID === 1) {
            setSelectedAuditID(loaded[0].AUDIT_ID);
          }
        } else {
          setAuditList([]);
        }
      })
      .catch((error) => {
        console.error("auditlistcheck error:", error);
        setAuditList([]);
      });
  }, [fromDate, toDate, selectedAuditID]);

  // 4. Nạp Danh Sách Các Đợt Audit Của Mẫu Đang Chọn
  const loadAuditResultList = useCallback((auditId: number) => {
    setIsLoading(true);
    generalQuery("loadAuditResultList", { AUDIT_ID: auditId })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loaded = response.data.data.map((el: AUDIT_RESULT, idx: number) => ({
            ...el,
            AUDIT_DATE: moment(el.AUDIT_DATE).format("YYYY-MM-DD"),
            id: idx,
          }));
          setAuditResultList(loaded);
          setIsLoading(false);
          // Tự động chọn đợt đầu tiên nếu có
          if (loaded.length > 0) {
            handleSelectBatch(loaded[0]);
          } else {
            setAuditResultCheckList([]);
            setSelectedAuditResultID(-1);
          }
        } else {
          setAuditResultList([]);
          setAuditResultCheckList([]);
          setSelectedAuditResultID(-1);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("loadAuditResultList error:", error);
        setAuditResultList([]);
        setIsLoading(false);
      });
  }, []);

  // 5. Nạp Chi Tiết Checksheet Của Đợt Audit Đang Chọn
  const loadAuditResultCheckList = useCallback((auditResultId: number) => {
    generalQuery("loadAuditResultCheckList", { AUDIT_RESULT_ID: auditResultId })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loaded = response.data.data.map((el: AUDIT_CHECKLIST_RESULT, idx: number) => ({
            ...el,
            INS_DATE: moment(el.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
            UPD_DATE: el.UPD_DATE ? moment(el.UPD_DATE).format("YYYY-MM-DD HH:mm:ss") : "",
            id: idx,
          }));
          setAuditResultCheckList(loaded);
          selectedChecklistRows.current = [];
          setSelectedChecklistCount(0);
        } else {
          setAuditResultCheckList([]);
        }
      })
      .catch((error) => {
        console.error("loadAuditResultCheckList error:", error);
        setAuditResultCheckList([]);
      });
  }, []);

  // 6. Kiểm Tra Và Tạo Checksheet Cho Đợt Mới
  const checkAuditResultCheckListExist = async (auditResultId: number): Promise<boolean> => {
    try {
      const response = await generalQuery("checkAuditResultCheckListExist", { AUDIT_RESULT_ID: auditResultId });
      if (response.data.tk_status !== "NG" && response.data.data.length > 0) {
        return true;
      }
    } catch (err) {
      console.error("checkAuditResultCheckListExist error:", err);
    }
    return false;
  };

  const insertNewResultCheckList = async (auditResultId: number, auditId: number) => {
    try {
      await generalQuery("insertResultIDtoCheckList", {
        AUDIT_RESULT_ID: auditResultId,
        AUDIT_ID: auditId,
      });
    } catch (err) {
      console.error("insertResultIDtoCheckList error:", err);
    }
    loadAuditResultCheckList(auditResultId);
  };

  // Chọn 1 đợt audit
  const handleSelectBatch = useCallback(async (batch: AUDIT_RESULT) => {
    setSelectedAuditResultID(batch.AUDIT_RESULT_ID);
    const exists = await checkAuditResultCheckListExist(batch.AUDIT_RESULT_ID);
    if (exists) {
      loadAuditResultCheckList(batch.AUDIT_RESULT_ID);
    } else {
      insertNewResultCheckList(batch.AUDIT_RESULT_ID, batch.AUDIT_ID);
    }
  }, [loadAuditResultCheckList]);

  // 7. Tạo Mới Một Đợt Audit (New Audit)
  const createNewAudit = useCallback(() => {
    const currentAudit = auditList.find((a) => a.AUDIT_ID === selectedAuditID);
    if (!currentAudit) {
      Swal.fire("Cảnh báo", "Vui lòng chọn mẫu audit trước", "warning");
      return;
    }

    generalQuery("createNewAudit", {
      AUDIT_ID: selectedAuditID,
      AUDIT_NAME: currentAudit.AUDIT_NAME,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          Swal.fire({
            title: "Thành công",
            text: "Đã tạo đợt audit mới",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          loadAuditResultList(selectedAuditID);
        } else {
          Swal.fire("Lỗi", response.data.message, "error");
        }
      })
      .catch((error) => console.error("createNewAudit error:", error));
  }, [selectedAuditID, auditList, loadAuditResultList]);

  // 8. Upload File Ảnh Bằng Chứng (Upload Evident)
  const uploadAuditEvident = useCallback(
    async (auditResultId: number, auditResultDetailId: number, files: FileList | null) => {
      if (!files || files.length === 0) {
        Swal.fire("Thông báo", "Vui lòng chọn ít nhất một file ảnh", "warning");
        return;
      }

      let filenamelist = "";
      let isUploaded = true;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        filenamelist += file.name + ",";
        try {
          const res = await uploadQuery(
            file,
            `AUDIT_${auditResultId}_${auditResultDetailId}_${file.name}`,
            "audit"
          );
          if (res.data.tk_status === "NG") {
            isUploaded = false;
            Swal.fire("Lỗi", "Upload file thất bại: " + res.data.message, "error");
            break;
          }
        } catch (err) {
          isUploaded = false;
          console.error("uploadQuery error:", err);
          break;
        }
      }

      if (isUploaded) {
        filenamelist = filenamelist.substring(0, filenamelist.length - 1);
        try {
          const updateRes = await generalQuery("updateEvident", {
            AUDIT_RESULT_DETAIL_ID: auditResultDetailId,
            AUDIT_EVIDENT: filenamelist,
          });
          if (updateRes.data.tk_status !== "NG") {
            Swal.fire({
              title: "Thành công",
              text: "Đã tải lên ảnh bằng chứng hiện trường",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
            loadAuditResultCheckList(auditResultId);
          } else {
            Swal.fire("Lỗi", updateRes.data.message, "error");
          }
        } catch (err) {
          console.error("updateEvident error:", err);
        }
      }
    },
    [loadAuditResultCheckList]
  );

  // 9. Lưu Checksheet (Cập Nhật Điểm & Ghi Chú)
  const saveCheckSheet = useCallback(async () => {
    const rows = selectedChecklistRows.current;
    if (rows.length === 0) {
      Swal.fire("Thông báo", "Vui lòng tick chọn ít nhất một dòng để lưu", "warning");
      return;
    }

    try {
      for (let i = 0; i < rows.length; i++) {
        await generalQuery("updatechecksheetResultRow", {
          AUDIT_RESULT_DETAIL_ID: rows[i].AUDIT_RESULT_DETAIL_ID,
          REMARK: rows[i].REMARK,
          AUDIT_SCORE: rows[i].AUDIT_SCORE,
        });
      }
      Swal.fire({
        title: "Thành công",
        text: `Đã lưu cập nhật cho ${rows.length} mục checksheet`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      if (selectedAuditResultID !== -1) {
        loadAuditResultCheckList(selectedAuditResultID);
      }
    } catch (err) {
      console.error("saveCheckSheet error:", err);
      Swal.fire("Lỗi", "Quá trình lưu gặp sự cố, vui lòng thử lại", "error");
    }
  }, [selectedAuditResultID, loadAuditResultCheckList]);

  const confirmSaveCheckSheet = useCallback(() => {
    const rows = selectedChecklistRows.current;
    if (rows.length === 0) {
      Swal.fire("Thông báo", "Vui lòng tick chọn các dòng cần lưu checksheet", "warning");
      return;
    }
    Swal.fire({
      title: "Lưu Checksheet",
      text: `Bạn có chắc chắn lưu ${rows.length} dòng đã chọn?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Lưu Ngay",
      cancelButtonText: "Hủy Bỏ",
    }).then((res) => {
      if (res.isConfirmed) {
        saveCheckSheet();
      }
    });
  }, [saveCheckSheet]);

  // 10. Reset Evident (Phân Quyền ISO / NHU1903)
  const resetEvident = useCallback(async () => {
    const rows = selectedChecklistRows.current;
    if (rows.length === 0) {
      Swal.fire("Thông báo", "Chưa chọn dòng nào để reset bằng chứng", "warning");
      return;
    }

    try {
      for (let i = 0; i < rows.length; i++) {
        await generalQuery("resetEvident", {
          AUDIT_RESULT_DETAIL_ID: rows[i].AUDIT_RESULT_DETAIL_ID,
        });
      }
      Swal.fire({
        title: "Thành công",
        text: `Đã reset bằng chứng cho ${rows.length} dòng`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      if (selectedAuditResultID !== -1) {
        loadAuditResultCheckList(selectedAuditResultID);
      }
    } catch (err) {
      console.error("resetEvident error:", err);
    }
  }, [selectedAuditResultID, loadAuditResultCheckList]);

  const confirmResetEvident = useCallback(() => {
    const uData = getUserData();
    const hasPermission = uData?.SUBDEPTNAME === "ISO" || uData?.EMPL_NO === "NHU1903";

    if (!hasPermission) {
      Swal.fire("Cảnh báo", "Bạn không có quyền hạn reset bằng chứng (Chỉ dành cho ISO)", "warning");
      return;
    }

    const rows = selectedChecklistRows.current;
    if (rows.length === 0) {
      Swal.fire("Thông báo", "Vui lòng chọn ít nhất một dòng", "warning");
      return;
    }

    Swal.fire({
      title: "Reset Bằng Chứng",
      text: `Bạn có chắc chắn muốn xóa bằng chứng ảnh của ${rows.length} dòng đã chọn?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Xác Nhận Xóa",
      cancelButtonText: "Hủy Bỏ",
    }).then((res) => {
      if (res.isConfirmed) {
        resetEvident();
      }
    });
  }, [resetEvident]);

  // 11. Modal Tạo Form Mẫu Mới (Add Form)
  const readUploadFile = (e: any) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (evt: any) => {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any = XLSX.utils.sheet_to_json(worksheet);
        setUploadExcelJson(
          json.map((element: any, index: number) => ({
            ...element,
            id: index,
          }))
        );
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const handleAddRow = () => {
    const tempRow: AUDIT_CHECK_LIST = {
      id: uploadExcelJson.length,
      AUDIT_DETAIL_ID: 0,
      AUDIT_ID: 0,
      AUDIT_NAME: "",
      MAIN_ITEM_NO: 0,
      MAIN_ITEM_CONTENT: "",
      SUB_ITEM_NO: 0,
      SUB_ITEM_CONTENT: "",
      LEVEL_CAT: "",
      DETAIL_VN: "",
      DETAIL_KR: "",
      DETAIL_EN: "",
      MAX_SCORE: 0,
      INS_DATE: "",
      INS_EMPL: "",
      UPD_DATE: "",
      UPD_EMPL: "",
    };
    setUploadExcelJson([...uploadExcelJson, tempRow]);
  };

  const handleDeleteRow = (id: number) => {
    setUploadExcelJson(uploadExcelJson.filter((item) => item.id !== id));
  };

  const insertCheckSheetList = async () => {
    let errCode = 0;
    let lastAuditId = 1;
    try {
      const res = await generalQuery("checklastAuditID", {});
      if (res.data.tk_status !== "NG" && res.data.data.length > 0) {
        lastAuditId = res.data.data[0].MAX_AUDIT_ID;
      }
    } catch (err) {
      console.error("checklastAuditID error:", err);
    }

    for (let i = 0; i < uploadExcelJson.length; i++) {
      try {
        await generalQuery("insertCheckSheetData", {
          AUDIT_ID: lastAuditId,
          MAIN_ITEM_NO: uploadExcelJson[i].MAIN_ITEM_NO,
          MAIN_ITEM_CONTENT: uploadExcelJson[i].MAIN_ITEM_CONTENT,
          SUB_ITEM_NO: uploadExcelJson[i].SUB_ITEM_NO,
          SUB_ITEM_CONTENT: uploadExcelJson[i].SUB_ITEM_CONTENT,
          LEVEL_CAT: uploadExcelJson[i].LEVEL_CAT,
          DETAIL_VN: uploadExcelJson[i].DETAIL_VN,
          DETAIL_KR: uploadExcelJson[i].DETAIL_KR,
          DETAIL_EN: uploadExcelJson[i].DETAIL_EN,
          MAX_SCORE: uploadExcelJson[i].MAX_SCORE,
          DEPARTMENT: uploadExcelJson[i].DEPARTMENT,
        });
      } catch (err) {
        errCode = 1;
        console.error("insertCheckSheetData error:", err);
      }
    }

    if (errCode === 0) {
      Swal.fire("Thành công", "Đã tạo xong form mẫu checksheet audit", "success");
      setShowHideAddForm(false);
      loadAuditList();
    } else {
      Swal.fire("Lỗi", "Thêm checksheet có lỗi, vui lòng kiểm tra lại", "error");
    }
  };

  const insertNewAuditInfo = async () => {
    if (!auditName.trim()) {
      Swal.fire("Thông báo", "Vui lòng nhập tên Form Audit", "warning");
      return;
    }
    if (!selectedCust_CD) {
      Swal.fire("Thông báo", "Vui lòng chọn khách hàng", "warning");
      return;
    }
    if (uploadExcelJson.length === 0) {
      Swal.fire("Thông báo", "Nội dung checksheet trống! Vui lòng chọn file Excel hoặc thêm dòng", "warning");
      return;
    }

    try {
      const checkRes = await generalQuery("checkAuditNamebyCustomer", {
        AUDIT_NAME: auditName,
        CUST_CD: selectedCust_CD.CUST_CD,
      });

      if (checkRes.data.tk_status !== "NG" && checkRes.data.data.length > 0) {
        Swal.fire("Cảnh báo", "Audit này đã tồn tại với khách hàng này, hãy chọn tên khác", "warning");
        return;
      }

      const insertRes = await generalQuery("insertNewAuditInfo", {
        AUDIT_NAME: auditName,
        CUST_CD: selectedCust_CD.CUST_CD,
        PASS_SCORE: passScore,
      });

      if (insertRes.data.tk_status !== "NG") {
        insertCheckSheetList();
      } else {
        Swal.fire("Lỗi", insertRes.data.message, "error");
      }
    } catch (err) {
      console.error("insertNewAuditInfo error:", err);
    }
  };

  // 12. Cell Editing Stopped: đồng bộ dữ liệu ngay lập tức
  const handleCellEditingStopped = useCallback((params: any) => {
    const updatedData = params.data;
    setAuditResultCheckList((prev) =>
      prev.map((row) =>
        row.AUDIT_RESULT_DETAIL_ID === updatedData.AUDIT_RESULT_DETAIL_ID ? { ...row, ...updatedData } : row
      )
    );
  }, []);

  // 13. Selection Changed
  const handleSelectionChange = useCallback((params: any) => {
    const selected = params.api.getSelectedRows();
    selectedChecklistRows.current = selected;
    setSelectedChecklistCount(selected.length);
  }, []);

  // 14. Quick Filter Checklist
  const filteredChecklist = useMemo(() => {
    if (!quickFilterText.trim()) return auditResultCheckList;
    const q = quickFilterText.toLowerCase().trim();

    return auditResultCheckList.filter((row: any) =>
      Object.values(row).some((val) => {
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(q);
      })
    );
  }, [auditResultCheckList, quickFilterText]);

  // 15. KPI Metrics Realtime
  const kpiMetrics: AUDITKpiMetrics = useMemo(() => {
    const totalItems = auditResultCheckList.length;
    let evaluatedItems = 0;
    let totalScore = 0;
    let maxScore = 0;
    let evidentCount = 0;

    auditResultCheckList.forEach((item) => {
      maxScore += Number(item.MAX_SCORE ?? 0);
      if (item.AUDIT_SCORE !== null && item.AUDIT_SCORE !== undefined) {
        evaluatedItems += 1;
        totalScore += Number(item.AUDIT_SCORE);
      }
      if (item.AUDIT_EVIDENT && item.AUDIT_EVIDENT !== "N") {
        evidentCount += 1;
      }
    });

    const scoreRate = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const activeBatch = auditResultList.find((b) => b.AUDIT_RESULT_ID === selectedAuditResultID);

    return {
      totalItems,
      evaluatedItems,
      totalScore,
      maxScore,
      passScore,
      scoreRate,
      isPass: scoreRate >= passScore,
      evidentCount,
      evidentRate: totalItems > 0 ? (evidentCount / totalItems) * 100 : 0,
      selectedAuditName: activeBatch?.AUDIT_NAME || "",
      selectedAuditDate: activeBatch?.AUDIT_DATE || "",
      selectedInsEmpl: activeBatch?.INS_EMPL || "",
      totalBatches: auditResultList.length,
    };
  }, [auditResultCheckList, auditResultList, selectedAuditResultID, passScore]);

  // 16. Image Preview Modal
  const openImagePreview = useCallback((url: string) => {
    setPreviewImageUrl(url);
    setIsImagePreviewOpen(true);
  }, []);

  const closeImagePreview = useCallback(() => {
    setIsImagePreviewOpen(false);
    setPreviewImageUrl("");
  }, []);

  // 17. Xuất Excel
  const exportExcelChecklist = useCallback(() => {
    SaveExcel(auditResultCheckList, `AuditChecklist_${moment().format("YYYYMMDD_HHmmss")}`);
  }, [auditResultCheckList]);

  // Chạy nạp dữ liệu ban đầu
  useEffect(() => {
    getCustomerList();
    loadAuditList();
    loadAuditResultList(selectedAuditID);
  }, []);

  return {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    selectedAuditID,
    setSelectedAuditID,
    selectedAuditResultID,
    auditList,
    auditResultList,
    auditResultCheckList,
    filteredChecklist,
    selectedChecklistCount,
    handleSelectBatch,
    loadAuditList,
    loadAuditResultList,
    createNewAudit,
    uploadAuditEvident,
    confirmSaveCheckSheet,
    confirmResetEvident,
    exportExcelChecklist,
    quickFilterText,
    setQuickFilterText,
    isBatchPanelOpen,
    setIsBatchPanelOpen,
    isFullscreen,
    toggleFullscreen,
    kpiMetrics,
    isLoading,
    handleSelectionChange,
    handleCellEditingStopped,
    // Add Form Modal
    showHideAddForm,
    setShowHideAddForm,
    customerList,
    selectedCust_CD,
    setSelectedCust_CD,
    passScore,
    setPassScore,
    auditName,
    setAuditName,
    uploadExcelJson,
    readUploadFile,
    handleAddRow,
    handleDeleteRow,
    insertNewAuditInfo,
    // Image Preview Modal
    previewImageUrl,
    isImagePreviewOpen,
    openImagePreview,
    closeImagePreview,
  };
};
