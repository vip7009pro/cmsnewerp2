import { useState, useEffect, useMemo, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery, uploadQuery } from "../../../../../api/Api";
import { SaveExcel } from "../../../../../api/services/excelService";
import {
  Equipment,
  CalibrationHistory,
  CalibrationKpiData,
  UrgencyFilter,
  ImagePreviewState,
} from "./calibrationTypes";

export const getEquipmentUrgency = (item: Equipment): "BROKEN" | "OVERDUE" | "DUE_SOON" | "VALID" => {
  if (item.STATUS === "BROKEN") return "BROKEN";
  if (!item.NEXT_CAL_DATE) return "VALID";

  const nextCal = moment(item.NEXT_CAL_DATE).startOf("day");
  const today = moment().startOf("day");
  const daysDiff = nextCal.diff(today, "days");

  if (daysDiff < 0) return "OVERDUE";
  if (daysDiff <= 30) return "DUE_SOON";
  return "VALID";
};

export const useCalibrationData = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [selectedEqId, setSelectedEqId] = useState<number | null>(null);
  const [historyList, setHistoryList] = useState<CalibrationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>("ALL");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals state
  const [openEqModal, setOpenEqModal] = useState(false);
  const [isEditEq, setIsEditEq] = useState(false);
  const [eqFormData, setEqFormData] = useState<Partial<Equipment>>({});
  const [eqFile, setEqFile] = useState<File | null>(null);

  const [openHistModal, setOpenHistModal] = useState(false);
  const [isEditHist, setIsEditHist] = useState(false);
  const [histFormData, setHistFormData] = useState<Partial<CalibrationHistory>>({});
  const [histFile, setHistFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<ImagePreviewState>({
    isOpen: false,
    title: "",
    imageUrl: "",
  });

  // Selected Equipment Object
  const selectedEquipment = useMemo(() => {
    return equipmentList.find((eq) => eq.EQ_ID === selectedEqId) || null;
  }, [equipmentList, selectedEqId]);

  // Load Equipment API
  const loadEquipment = useCallback(() => {
    setIsLoading(true);
    generalQuery("qc_get_equipment_list", {})
      .then((res) => {
        if (res.data.tk_status !== "NG") {
          const list: Equipment[] = res.data.data.map((item: any, idx: number) => ({
            ...item,
            LAST_CAL_DATE: item.LAST_CAL_DATE ? moment(item.LAST_CAL_DATE).format("YYYY-MM-DD") : "",
            NEXT_CAL_DATE: item.NEXT_CAL_DATE ? moment(item.NEXT_CAL_DATE).format("YYYY-MM-DD") : "",
            id: idx,
          }));
          setEquipmentList(list);
        } else {
          setEquipmentList([]);
        }
      })
      .catch((err) => {
        console.error("Error loading equipment list:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Load History API
  const loadHistory = useCallback((eqId: number) => {
    generalQuery("qc_get_calibration_history", { EQ_ID: eqId })
      .then((res) => {
        if (res.data.tk_status !== "NG") {
          const list: CalibrationHistory[] = res.data.data.map((item: any, idx: number) => ({
            ...item,
            CAL_DATE: moment(item.CAL_DATE).format("YYYY-MM-DD"),
            NEXT_CAL_DATE: moment(item.NEXT_CAL_DATE).format("YYYY-MM-DD"),
            id: idx,
          }));
          setHistoryList(list);
        } else {
          setHistoryList([]);
        }
      })
      .catch((err) => {
        console.error("Error loading history:", err);
        setHistoryList([]);
      });
  }, []);

  useEffect(() => {
    loadEquipment();
  }, [loadEquipment]);

  useEffect(() => {
    if (selectedEqId !== null) {
      loadHistory(selectedEqId);
    } else {
      setHistoryList([]);
    }
  }, [selectedEqId, loadHistory]);

  // KPI Calculations
  const kpiData: CalibrationKpiData = useMemo(() => {
    let inUseCount = 0;
    let brokenCount = 0;
    let overdueCount = 0;
    let dueSoonCount = 0;
    let validCount = 0;

    equipmentList.forEach((eq) => {
      const urgency = getEquipmentUrgency(eq);
      if (eq.STATUS === "BROKEN") brokenCount++;
      else inUseCount++;

      if (urgency === "OVERDUE") overdueCount++;
      else if (urgency === "DUE_SOON") dueSoonCount++;
      else if (urgency === "VALID") validCount++;
    });

    return {
      totalCount: equipmentList.length,
      inUseCount,
      brokenCount,
      overdueCount,
      dueSoonCount,
      validCount,
    };
  }, [equipmentList]);

  // Filtered Equipment Data
  const filteredEquipment = useMemo(() => {
    return equipmentList.filter((eq) => {
      // 1. Urgency Filter
      if (urgencyFilter !== "ALL") {
        const urgency = getEquipmentUrgency(eq);
        if (urgency !== urgencyFilter) return false;
      }

      // 2. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (eq.EQ_NAME || "").toLowerCase();
        const controlNo = (eq.CONTROL_NO || "").toLowerCase();
        const series = (eq.SERIES_MODEL || "").toLowerCase();
        const maker = (eq.MAKER || "").toLowerCase();
        const dept = (eq.DEPARTMENT || "").toLowerCase();
        const location = (eq.LOCATION || "").toLowerCase();
        const id = String(eq.EQ_ID || "");

        return (
          name.includes(q) ||
          controlNo.includes(q) ||
          series.includes(q) ||
          maker.includes(q) ||
          dept.includes(q) ||
          location.includes(q) ||
          id.includes(q)
        );
      }

      return true;
    });
  }, [equipmentList, urgencyFilter, searchQuery]);

  // Image Preview Handlers
  const openImagePreview = (title: string, imageUrl: string) => {
    if (!imageUrl) return;
    setImagePreview({
      isOpen: true,
      title,
      imageUrl,
    });
  };

  const closeImagePreview = () => {
    setImagePreview({ isOpen: false, title: "", imageUrl: "" });
  };

  // Equipment Modal Handlers
  const handleOpenAddEq = () => {
    setEqFormData({
      STATUS: "IN_USE",
      DEPARTMENT: "QC",
      LOCATION: "Xưởng 1",
    });
    setEqFile(null);
    setIsEditEq(false);
    setOpenEqModal(true);
  };

  const handleOpenEditEq = (eq: Equipment) => {
    setEqFormData(eq);
    setEqFile(null);
    setIsEditEq(true);
    setOpenEqModal(true);
  };

  const handleSaveEq = async () => {
    if (!eqFormData.EQ_NAME) {
      Swal.fire("Lưu ý", "Vui lòng nhập tên thiết bị!", "warning");
      return;
    }

    let imageUrl = eqFormData.IMAGE_URL || "";
    if (eqFile) {
      const fileName = `EQ_${Date.now()}_${eqFile.name}`;
      const res = await uploadQuery(eqFile, fileName, "calibration");
      if (res.data.tk_status !== "NG") {
        imageUrl = fileName;
      } else {
        Swal.fire("Lỗi", "Upload ảnh thiết bị thất bại", "error");
        return;
      }
    }

    const payload = { ...eqFormData, IMAGE_URL: imageUrl };
    const cmd = isEditEq ? "qc_update_equipment" : "qc_insert_equipment";

    generalQuery(cmd, payload).then((res) => {
      if (res.data.tk_status !== "NG") {
        Swal.fire("Thành công", "Lưu thiết bị thành công", "success");
        setOpenEqModal(false);
        loadEquipment();
      } else {
        Swal.fire("Lỗi", res.data.message, "error");
      }
    });
  };

  const handleDeleteEq = (eqId: number) => {
    Swal.fire({
      title: "Xác nhận xóa thiết bị?",
      text: "Xóa thiết bị sẽ xóa toàn bộ lịch sử hiệu chuẩn liên quan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Đồng ý xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        generalQuery("qc_delete_equipment", { EQ_ID: eqId }).then((res) => {
          if (res.data.tk_status !== "NG") {
            Swal.fire("Đã xóa", "Xóa thiết bị thành công", "success");
            loadEquipment();
            if (selectedEqId === eqId) setSelectedEqId(null);
          }
        });
      }
    });
  };

  // History Modal Handlers
  const handleOpenAddHist = () => {
    if (!selectedEqId) {
      Swal.fire("Lưu ý", "Vui lòng chọn 1 thiết bị để thêm lịch sử hiệu chuẩn!", "warning");
      return;
    }

    const defaultPeriod = selectedEquipment?.CAL_PERIOD || 12;
    const calDate = moment().format("YYYY-MM-DD");
    const nextCalDate = moment().add(defaultPeriod, "months").format("YYYY-MM-DD");

    setHistFormData({
      CAL_DATE: calDate,
      NEXT_CAL_DATE: nextCalDate,
      CAL_PERIOD: defaultPeriod,
      CAL_PERSON: "",
      REMARK: "",
    });
    setHistFile(null);
    setIsEditHist(false);
    setOpenHistModal(true);
  };

  const handleOpenEditHist = (hist: CalibrationHistory) => {
    setHistFormData(hist);
    setHistFile(null);
    setIsEditHist(true);
    setOpenHistModal(true);
  };

  const handleSaveHist = async () => {
    if (!selectedEqId) return;

    let stampUrl = histFormData.STAMP_IMAGE_URL || "";
    if (histFile) {
      const fileName = `CAL_${Date.now()}_${histFile.name}`;
      const res = await uploadQuery(histFile, fileName, "calibration");
      if (res.data.tk_status !== "NG") {
        stampUrl = fileName;
      } else {
        Swal.fire("Lỗi", "Upload ảnh tem thất bại", "error");
        return;
      }
    }

    const payload = {
      ...histFormData,
      EQ_ID: selectedEqId,
      STAMP_IMAGE_URL: stampUrl,
    };
    const cmd = isEditHist ? "qc_update_calibration" : "qc_insert_calibration";

    generalQuery(cmd, payload).then((res) => {
      if (res.data.tk_status !== "NG") {
        Swal.fire("Thành công", "Lưu lịch sử hiệu chuẩn thành công", "success");
        setOpenHistModal(false);
        loadHistory(selectedEqId);
        loadEquipment();
      } else {
        Swal.fire("Lỗi", res.data.message, "error");
      }
    });
  };

  const handleDeleteHist = (calId: number) => {
    Swal.fire({
      title: "Xóa lượt hiệu chuẩn?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        generalQuery("qc_delete_calibration", { CAL_ID: calId }).then((res) => {
          if (res.data.tk_status !== "NG") {
            Swal.fire("Đã xóa", "Xóa lịch sử thành công", "success");
            if (selectedEqId) {
              loadHistory(selectedEqId);
              loadEquipment();
            }
          }
        });
      }
    });
  };

  // Excel Export
  const handleExportExcel = () => {
    if (filteredEquipment.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu thiết bị để xuất Excel!", "info");
      return;
    }
    SaveExcel(
      filteredEquipment,
      `Equipment_Calibration_${moment().format("YYYYMMDD_HHmmss")}`
    );
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return {
    equipmentList,
    filteredEquipment,
    selectedEqId,
    setSelectedEqId,
    selectedEquipment,
    historyList,
    isLoading,
    searchQuery,
    setSearchQuery,
    urgencyFilter,
    setUrgencyFilter,
    isFullscreen,
    toggleFullscreen,
    kpiData,
    loadEquipment,
    loadHistory,
    imagePreview,
    openImagePreview,
    closeImagePreview,
    // Eq modal
    openEqModal,
    setOpenEqModal,
    isEditEq,
    eqFormData,
    setEqFormData,
    eqFile,
    setEqFile,
    handleOpenAddEq,
    handleOpenEditEq,
    handleSaveEq,
    handleDeleteEq,
    // Hist modal
    openHistModal,
    setOpenHistModal,
    isEditHist,
    histFormData,
    setHistFormData,
    histFile,
    setHistFile,
    handleOpenAddHist,
    handleOpenEditHist,
    handleSaveHist,
    handleDeleteHist,
    handleExportExcel,
  };
};
