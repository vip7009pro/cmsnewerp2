import { useState, useEffect, useMemo, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery, getCtrCd, getUserData, uploadQuery } from "../../../../../api/Api";
import { checkBP } from "../../../../../api/services/permissionService";
import { SaveExcel } from "../../../../../api/services/excelService";
import { f_autoUpdateDocUSE_YN, f_updateMaterialDocData } from "../../../../muahang/utils/muaUtils";
import {
  DOCUMENT_DATA,
  DOC_CATEGORY1_DATA,
  DOC_CATEGORY2_DATA,
  DOC_LIST_DATA,
  AllDocFilterValues,
  AllDocKpiData,
  UploadModalState,
  UpdateModalState,
} from "./allDocTypes";

export const useAllDocData = () => {
  const [allDocData, setAllDocData] = useState<DOCUMENT_DATA[]>([]);
  const [selectedRows, setSelectedRows] = useState<DOCUMENT_DATA[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Metadata lists
  const [docCategory1Data, setDocCategory1Data] = useState<DOC_CATEGORY1_DATA[]>([]);
  const [docCategory2Data, setDocCategory2Data] = useState<DOC_CATEGORY2_DATA[]>([]);
  const [docListData, setDocListData] = useState<DOC_LIST_DATA[]>([]);

  // Filter values
  const [filterValues, setFilterValues] = useState<AllDocFilterValues>({
    DOC_NAME: "",
    DOC_ID: 0,
    CAT_ID: 0,
    DOC_CAT_ID: 0,
  });

  // Upload Modal State
  const [uploadModalState, setUploadModalState] = useState<UploadModalState>({
    isOpen: false,
    CAT_ID: 0,
    DOC_CAT_ID: 0,
    DOC_ID: 0,
    DOC_NAME: "",
    REG_DATE: moment().format("YYYY-MM-DD"),
    EXP_DATE: moment().add(2, "years").format("YYYY-MM-DD"),
    HSD_YN: "Y",
    file: null,
  });

  // Batch Update Modal State
  const [updateModalState, setUpdateModalState] = useState<UpdateModalState>({
    isOpen: false,
    REG_DATE: moment().format("YYYY-MM-DD"),
    EXP_DATE: moment().add(2, "years").format("YYYY-MM-DD"),
    HSD_YN: "Y",
    USE_YN: "Y",
  });

  // Load Categories & Metadata
  const loadCategories = useCallback(async () => {
    try {
      const [resCat1, resCat2, resList] = await Promise.all([
        generalQuery("loadDocCategory1", {}),
        generalQuery("loadDocCategory2", {}),
        generalQuery("loadDocList", {}),
      ]);

      if (resCat1.data.tk_status !== "NG") {
        setDocCategory1Data(
          resCat1.data.data.map((item: DOC_CATEGORY1_DATA, idx: number) => ({
            ...item,
            id: idx,
          }))
        );
      }
      if (resCat2.data.tk_status !== "NG") {
        setDocCategory2Data(
          resCat2.data.data.map((item: DOC_CATEGORY2_DATA, idx: number) => ({
            ...item,
            id: idx,
          }))
        );
      }
      if (resList.data.tk_status !== "NG") {
        setDocListData(
          resList.data.data.map((item: DOC_LIST_DATA, idx: number) => ({
            ...item,
            id: idx,
          }))
        );
      }
    } catch (err) {
      console.error("Error loading document metadata:", err);
    }
  }, []);

  // Load All Documents API
  const loadAllDoc = useCallback(async (filters?: AllDocFilterValues) => {
    setIsLoading(true);
    const targetFilters = filters || filterValues;
    try {
      const res = await generalQuery("loadDocuments", targetFilters);
      if (res.data.tk_status !== "NG") {
        const loaded: DOCUMENT_DATA[] = res.data.data.map(
          (element: DOCUMENT_DATA, index: number) => ({
            ...element,
            REG_DATE:
              element.REG_DATE !== null
                ? moment.utc(element.REG_DATE).format("YYYY-MM-DD")
                : "",
            REMAIN_DAYS:
              element.HSD_YN !== "N"
                ? moment.utc(element.EXP_DATE).diff(moment.utc(), "days") > 0
                  ? moment.utc(element.EXP_DATE).diff(moment.utc(), "days")
                  : ""
                : "",
            EXP_DATE:
              element.EXP_DATE !== null
                ? moment.utc(element.EXP_DATE).format("YYYY-MM-DD")
                : "",
            INS_DATE:
              element.INS_DATE !== null
                ? moment.utc(element.INS_DATE).format("YYYY-MM-DD")
                : "",
            UPD_DATE:
              element.UPD_DATE !== null
                ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD")
                : "",
            id: index,
          })
        );
        setAllDocData(loaded);
      } else {
        setAllDocData([]);
      }
    } catch (error) {
      console.error("Error loading documents:", error);
      setAllDocData([]);
    } finally {
      setIsLoading(false);
      setSelectedRows([]);
    }
  }, [filterValues]);

  useEffect(() => {
    loadCategories();
    loadAllDoc();
    f_autoUpdateDocUSE_YN({});
  }, [loadCategories, loadAllDoc]);

  // KPI Calculations
  const kpiData: AllDocKpiData = useMemo(() => {
    const totalCount = allDocData.length;
    let activeCount = 0;
    let expiredCount = 0;
    let expiringSoonCount = 0;
    let pdfCount = 0;
    let officeCount = 0;

    const today = moment().startOf("day");

    allDocData.forEach((doc) => {
      if (doc.USE_YN === "Y") activeCount++;

      if (doc.HSD_YN !== "N" && doc.EXP_DATE) {
        const exp = moment(doc.EXP_DATE).startOf("day");
        const daysDiff = exp.diff(today, "days");

        if (daysDiff < 0) expiredCount++;
        else if (daysDiff <= 30) expiringSoonCount++;
      }

      const ext = (doc.FORMAT_X || "").toLowerCase().replace(".", "");
      if (ext === "pdf") pdfCount++;
      else if (["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(ext)) {
        officeCount++;
      }
    });

    return {
      totalCount,
      activeCount,
      expiredCount,
      expiringSoonCount,
      pdfCount,
      officeCount,
    };
  }, [allDocData]);

  // Filtered Documents
  const filteredDocData = useMemo(() => {
    if (!searchQuery.trim()) return allDocData;
    const q = searchQuery.toLowerCase().trim();

    return allDocData.filter((doc) => {
      const docName = (doc.DOC_NAME || "").toLowerCase();
      const catName = (doc.CAT_NAME || "").toLowerCase();
      const docCatName = (doc.DOC_CAT_NAME || "").toLowerCase();
      const fileId = String(doc.FILE_ID || "");
      const docId = String(doc.DOC_ID || "");

      return (
        docName.includes(q) ||
        catName.includes(q) ||
        docCatName.includes(q) ||
        fileId.includes(q) ||
        docId.includes(q)
      );
    });
  }, [allDocData, searchQuery]);

  // Upload Handlers
  const handleOpenUploadModal = () => {
    checkBP(getUserData(), ["QC"], ["ALL"], ["ALL"], () => {
      setUploadModalState({
        isOpen: true,
        CAT_ID: filterValues.CAT_ID || (docCategory1Data[0]?.CAT_ID ?? 0),
        DOC_CAT_ID: filterValues.DOC_CAT_ID || (docCategory2Data[0]?.DOC_CAT_ID ?? 0),
        DOC_ID: filterValues.DOC_ID || 0,
        DOC_NAME: filterValues.DOC_NAME || "",
        REG_DATE: moment().format("YYYY-MM-DD"),
        EXP_DATE: moment().add(2, "years").format("YYYY-MM-DD"),
        HSD_YN: "Y",
        file: null,
      });
    });
  };

  const handleCloseUploadModal = () => {
    setUploadModalState((prev) => ({ ...prev, isOpen: false, file: null }));
  };

  const handleSaveUpload = async (file: File) => {
    if (!file) {
      Swal.fire("Lỗi", "Vui lòng chọn tệp tài liệu cần tải lên!", "error");
      return;
    }
    if (!uploadModalState.DOC_NAME.trim()) {
      Swal.fire("Lỗi", "Vui lòng nhập tên tài liệu!", "error");
      return;
    }

    try {
      Swal.fire({
        title: "Đang tải lên...",
        text: "Vui lòng chờ trong giây lát",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // Get last file ID
      let nextFileId = 1;
      const idRes = await generalQuery("checkLastFileID", {});
      if (idRes.data.tk_status !== "NG" && idRes.data.data?.[0]?.FILE_ID) {
        nextFileId = Number(idRes.data.data[0].FILE_ID) + 1;
      }

      const ext = file.name.split(".").pop();
      const filename = `${nextFileId}_${uploadModalState.DOC_ID}_${uploadModalState.DOC_CAT_ID}_${uploadModalState.CAT_ID}.${ext}`;
      const uploadFolder = "alldocs";

      const uploadRes = await uploadQuery(file, filename, uploadFolder);
      if (uploadRes.data.tk_status !== "NG") {
        await generalQuery("insertFileData", {
          FILE_ID: nextFileId,
          DOC_ID: uploadModalState.DOC_ID,
          DOC_CAT_ID: uploadModalState.DOC_CAT_ID,
          CAT_ID: uploadModalState.CAT_ID,
          REG_DATE: uploadModalState.REG_DATE,
          EXP_DATE: uploadModalState.EXP_DATE,
          FORMAT_X: `.${ext}`,
        });

        Swal.fire("Thành công", "Đã tải lên tài liệu mới thành công!", "success");
        handleCloseUploadModal();
        loadAllDoc();
      } else {
        Swal.fire("Lỗi", "Upload file lên máy chủ thất bại!", "error");
      }
    } catch (err) {
      console.error("Error saving document:", err);
      Swal.fire("Lỗi", "Có lỗi xảy ra khi lưu tài liệu!", "error");
    }
  };

  // Batch Update Handlers
  const handleOpenUpdateModal = () => {
    if (selectedRows.length === 0) {
      Swal.fire("Lưu ý", "Vui lòng chọn ít nhất 1 tài liệu để cập nhật!", "warning");
      return;
    }

    checkBP(getUserData(), ["MUA", "QC"], ["ALL"], ["ALL"], () => {
      const first = selectedRows[0];
      setUpdateModalState({
        isOpen: true,
        REG_DATE: first.REG_DATE || moment().format("YYYY-MM-DD"),
        EXP_DATE: first.EXP_DATE || moment().add(2, "years").format("YYYY-MM-DD"),
        HSD_YN: first.HSD_YN || "Y",
        USE_YN: first.USE_YN || "Y",
      });
    });
  };

  const handleCloseUpdateModal = () => {
    setUpdateModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSaveBatchUpdate = async () => {
    try {
      Swal.fire({
        title: "Đang cập nhật...",
        text: `Cập nhật ${selectedRows.length} tài liệu đã chọn`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      for (let i = 0; i < selectedRows.length; i++) {
        await f_updateMaterialDocData({
          FILE_ID: selectedRows[i].FILE_ID,
          REG_DATE: updateModalState.REG_DATE,
          EXP_DATE: updateModalState.EXP_DATE,
          EXP_YN: updateModalState.HSD_YN.toUpperCase(),
          USE_YN: updateModalState.USE_YN.toUpperCase(),
        });
      }

      Swal.fire("Thành công", `Đã cập nhật thành công ${selectedRows.length} tài liệu!`, "success");
      handleCloseUpdateModal();
      loadAllDoc();
    } catch (err) {
      console.error("Error updating documents:", err);
      Swal.fire("Lỗi", "Có lỗi xảy ra khi cập nhật tài liệu!", "error");
    }
  };

  // Excel Export
  const handleExportExcel = () => {
    if (filteredDocData.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel!", "info");
      return;
    }
    SaveExcel(filteredDocData, `ISO_Documents_${moment().format("YYYYMMDD_HHmmss")}`);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return {
    allDocData,
    filteredDocData,
    selectedRows,
    setSelectedRows,
    isLoading,
    searchQuery,
    setSearchQuery,
    isFullscreen,
    toggleFullscreen,
    filterValues,
    setFilterValues,
    docCategory1Data,
    docCategory2Data,
    docListData,
    kpiData,
    loadAllDoc,
    // Upload modal
    uploadModalState,
    setUploadModalState,
    handleOpenUploadModal,
    handleCloseUploadModal,
    handleSaveUpload,
    // Update modal
    updateModalState,
    setUpdateModalState,
    handleOpenUpdateModal,
    handleCloseUpdateModal,
    handleSaveBatchUpdate,
    handleExportExcel,
  };
};
