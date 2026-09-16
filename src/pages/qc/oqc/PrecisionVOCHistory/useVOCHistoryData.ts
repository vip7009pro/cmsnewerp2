import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { f_checkG_CODE_From_PROCESS_LOT_NO, f_loadQTRData } from "../../utils/qcUtils";
import { QTR_DATA } from "../QTR_DATA";
export * from "./vocImageHelpers";

export const VOC_VISIBLE_LIMIT = 6;
export const VOC_DEFAULT_FROM_DATE = "2020-01-01";

// Non-blocking SweetAlert2 Toast helper for hands-free scanner workflow
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const useVOCHistoryData = () => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [appliedSearchValue, setAppliedSearchValue] = useState("");
  const [useMachineScan, setUseMachineScan] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [isTvMode, setIsTvMode] = useState(false);
  const [allVocData, setAllVocData] = useState<QTR_DATA[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Scanner Telemetry State
  const [lastScannedLot, setLastScannedLot] = useState<string>("");
  const [matchedCode, setMatchedCode] = useState<string>("");
  const [lastScanTime, setLastScanTime] = useState<string>("");

  const focusSearchInput = useCallback(() => {
    window.requestAnimationFrame(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
        searchInputRef.current.select?.();
      }
    });
  }, []);

  const loadVocHistoryData = useCallback(async () => {
    setIsLoading(true);
    try {
      const loadedData = await f_loadQTRData({
        FROM_DATE: VOC_DEFAULT_FROM_DATE,
        TO_DATE: moment().format("YYYY-MM-DD"),
      });
      const sortedData = [...loadedData].sort((left, right) => {
        const rightTime = moment(right.REGISTERED_DATE, "YYYY-MM-DD", true).valueOf();
        const leftTime = moment(left.REGISTERED_DATE, "YYYY-MM-DD", true).valueOf();
        return rightTime - leftTime;
      });
      setAllVocData(sortedData);
      if (sortedData.length === 0) {
        Toast.fire({
          icon: "info",
          title: "Không có dữ liệu VOC trong khoảng thời gian này",
        });
      }
    } catch (error) {
      console.error(error);
      Toast.fire({
        icon: "error",
        title: "Lỗi kết nối khi tải dữ liệu VOC",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVocHistoryData();
    focusSearchInput();
  }, [loadVocHistoryData, focusSearchInput]);

  // Native Browser Fullscreen (equivalent to F11)
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          await (document.documentElement as any).webkitRequestFullscreen();
        }
        setIsTvMode(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
        setIsTvMode(false);
      }
    } catch (error) {
      console.error("Fullscreen API error:", error);
      setIsTvMode((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsTvMode(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Global scanner hotkey listener: ensure barcode scans are routed to the search input
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if (useMachineScan && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [useMachineScan]);

  const commitSearch = async () => {
    const rawInput = searchInputValue.trim();
    if (!rawInput) {
      focusSearchInput();
      return;
    }

    let targetSearchTerm = rawInput;

    if (useMachineScan) {
      setIsLoading(true);
      try {
        const fetchedGNameKd = await f_checkG_CODE_From_PROCESS_LOT_NO(rawInput);
        if (!fetchedGNameKd) {
          Toast.fire({
            icon: "warning",
            title: `Không tìm thấy G_NAME_KD từ LOT: "${rawInput}"`,
          });
          setLastScannedLot(rawInput);
          setMatchedCode("KHÔNG TÌM THẤY");
          setLastScanTime(moment().format("HH:mm:ss"));
          focusSearchInput();
          setIsLoading(false);
          return;
        }
        targetSearchTerm = fetchedGNameKd;
        setLastScannedLot(rawInput);
        setMatchedCode(fetchedGNameKd);
        setLastScanTime(moment().format("HH:mm:ss"));
      } catch (error) {
        console.error(error);
        Toast.fire({
          icon: "error",
          title: "Lỗi truy vấn máy chủ cho Process Lot",
        });
        focusSearchInput();
        setIsLoading(false);
        return;
      } finally {
        setIsLoading(false);
      }
    }

    const normalizedQuery = targetSearchTerm.toLowerCase();
    const matchedData = allVocData.filter((item) => {
      const searchableFields = [
        item.MANAGEMENT_NUMBER,
        item.PART_CODE,
        item.PART_NAME,
        item.G_CODE,
        item.G_NAME,
        item.TITLE,
        item.PROJECT,
        item.BASIC_MODEL,
        item.MAIN_CATEGORY,
      ];
      return searchableFields.some((field) => (field ?? "").toString().toLowerCase().includes(normalizedQuery));
    });

    if (matchedData.length === 0) {
      const errorMsg = useMachineScan
        ? `Không có hồ sơ VOC cho "${targetSearchTerm}" (Lot: "${rawInput}")`
        : `Không tìm thấy hồ sơ VOC cho "${targetSearchTerm}"`;
      Toast.fire({
        icon: "info",
        title: errorMsg,
      });
      focusSearchInput();
      return;
    }

    Toast.fire({
      icon: "success",
      title: `Khớp ${matchedData.length} hồ sơ VOC cho "${targetSearchTerm}"`,
    });

    setAppliedSearchValue(normalizedQuery);
    setSearchInputValue("");
    focusSearchInput();
  };

  const clearSearch = () => {
    setAppliedSearchValue("");
    setSearchInputValue("");
    focusSearchInput();
  };

  const normalizedAppliedSearch = appliedSearchValue.trim().toLowerCase();

  const visibleData = useMemo(() => {
    if (!normalizedAppliedSearch) {
      if (showAll) {
        return allVocData;
      }
      return allVocData.slice(0, VOC_VISIBLE_LIMIT);
    }
    return allVocData.filter((item) => {
      const searchableFields = [
        item.MANAGEMENT_NUMBER,
        item.PART_CODE,
        item.PART_NAME,
        item.G_CODE,
        item.G_NAME,
        item.TITLE,
        item.PROJECT,
        item.BASIC_MODEL,
        item.MAIN_CATEGORY,
      ];
      return searchableFields.some((field) => (field ?? "").toString().toLowerCase().includes(normalizedAppliedSearch));
    });
  }, [allVocData, normalizedAppliedSearch, showAll]);

  return {
    searchInputRef,
    searchInputValue,
    setSearchInputValue,
    appliedSearchValue,
    useMachineScan,
    setUseMachineScan,
    showAll,
    setShowAll,
    isTvMode,
    setIsTvMode,
    toggleFullscreen,
    allVocData,
    visibleData,
    isLoading,
    loadVocHistoryData,
    commitSearch,
    clearSearch,
    focusSearchInput,
    lastScannedLot,
    matchedCode,
    lastScanTime,
  };
};
