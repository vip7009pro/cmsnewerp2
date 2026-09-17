import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EQ_STT } from "../../interfaces/khsxInterface";
import { f_handle_loadEQ_STATUS } from "../../utils/khsxUtils";

export const useEqStatusData = () => {
  // Cấu hình hiển thị TV
  const [showTime, setShowTime] = useState<number>(() => {
    const saved = localStorage.getItem("showtimeout");
    return saved ? Number(saved) : 10;
  });

  const [fullScreen, setFullScreen] = useState(false);
  const [autoSlide, setAutoSlide] = useState(true); // Mặc định tự chạy TV
  const [theme, setTheme] = useState<"theme-dark" | "theme-light">("theme-dark");

  // Bộ lọc máy
  const [factory, setFactory] = useState("NM1");
  const [machine, setMachine] = useState("ED");
  const [searchString, setSearchString] = useState("");
  const [onlyRunning, setOnlyRunning] = useState(false);
  const [machineNumber, setMachineNumber] = useState(12);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [countdownProgress, setCountdownProgress] = useState(0);

  // Dữ liệu thiết bị
  const [eq_status, setEQ_STATUS] = useState<EQ_STT[]>([]);
  const [eq_series, setEQ_SERIES] = useState<string[]>([]);

  // Tải dữ liệu API
  const handle_loadEQ_STATUS = useCallback(async () => {
    try {
      const eq_data = await f_handle_loadEQ_STATUS();
      if (eq_data) {
        setEQ_STATUS(eq_data.EQ_STATUS || []);
        setEQ_SERIES(eq_data.EQ_SERIES || []);
      }
    } catch (err) {
      console.error("Error loading EQ status:", err);
    }
  }, []);

  // 1. Lọc danh sách máy theo Factory & Machine Type
  const allCategoryMachines = useMemo(() => {
    return eq_status.filter((element: EQ_STT) => {
      const selected_eq_name = element?.EQ_NAME?.substring(0, 2) ?? "ED";
      const matchFactory = element.FACTORY === factory;
      const matchMachine =
        machine === "FR+SR"
          ? selected_eq_name === "FR" || selected_eq_name === "SR"
          : selected_eq_name === machine;

      return matchFactory && matchMachine;
    });
  }, [eq_status, factory, machine]);

  // Thống kê toàn xưởng (Andon KPI)
  const factoryMetrics = useMemo(() => {
    const total = allCategoryMachines.length;
    const running = allCategoryMachines.filter((x) => x.EQ_STATUS === "MASS").length;
    const setting = allCategoryMachines.filter((x) => x.EQ_STATUS === "SETTING").length;
    const stop = allCategoryMachines.filter((x) => x.EQ_STATUS === "STOP" || !x.EQ_STATUS).length;

    return {
      total,
      running,
      setting,
      stop,
    };
  }, [allCategoryMachines]);

  // Danh sách máy sau khi lọc thêm Only Running
  const filteredMachines = useMemo(() => {
    return allCategoryMachines.filter((element: EQ_STT) => {
      if (!onlyRunning) return true;
      return element?.EQ_STATUS === "MASS" || element?.EQ_STATUS === "SETTING";
    });
  }, [allCategoryMachines, onlyRunning]);

  // Tính tổng số trang
  const totalPages = Math.max(1, Math.ceil(filteredMachines.length / machineNumber));

  // Reset trang nếu vượt quá
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Máy của trang hiện tại
  const currentPageMachines = useMemo(() => {
    const start = (currentPage - 1) * machineNumber;
    const end = start + machineNumber;
    return filteredMachines.slice(start, end);
  }, [filteredMachines, currentPage, machineNumber]);

  const startMachineIdx = filteredMachines.length > 0 ? (currentPage - 1) * machineNumber + 1 : 0;
  const endMachineIdx = Math.min(currentPage * machineNumber, filteredMachines.length);

  // Điều hướng trang thủ công
  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages));
    setCountdownProgress(0);
  }, [totalPages]);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
    setCountdownProgress(0);
  }, [totalPages]);

  // Toggle Theme
  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "theme-dark" ? "theme-light" : "theme-dark"));
  }, []);

  // Toggle FullScreen
  const handleToggleFullScreen = useCallback(() => {
    setFullScreen((prev) => {
      const next = !prev;
      if (next && !document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => {});
      } else if (!next && document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
      return next;
    });
  }, []);

  // Polling API mỗi 3 giây
  useEffect(() => {
    handle_loadEQ_STATUS();
    const pollTimer = setInterval(() => {
      handle_loadEQ_STATUS();
    }, 3000);

    return () => clearInterval(pollTimer);
  }, [handle_loadEQ_STATUS]);

  // Auto-slide timer với Visual Countdown Bar
  useEffect(() => {
    if (!autoSlide || totalPages <= 1) {
      setCountdownProgress(0);
      return;
    }

    const intervalMs = 100;
    const totalMs = showTime * 1000;
    let elapsedMs = 0;

    const slideTimer = setInterval(() => {
      elapsedMs += intervalMs;
      const pct = Math.min(100, (elapsedMs / totalMs) * 100);
      setCountdownProgress(pct);

      if (elapsedMs >= totalMs) {
        elapsedMs = 0;
        setCountdownProgress(0);
        setCurrentPage((prev) => (prev >= totalPages ? 1 : prev + 1));
      }
    }, intervalMs);

    return () => clearInterval(slideTimer);
  }, [autoSlide, showTime, totalPages]);

  return {
    showTime,
    setShowTime,
    fullScreen,
    handleToggleFullScreen,
    autoSlide,
    setAutoSlide,
    theme,
    handleToggleTheme,
    factory,
    setFactory,
    machine,
    setMachine,
    searchString,
    setSearchString,
    onlyRunning,
    setOnlyRunning,
    machineNumber,
    setMachineNumber,
    currentPage,
    totalPages,
    startMachineIdx,
    endMachineIdx,
    totalFilteredCount: filteredMachines.length,
    currentPageMachines,
    factoryMetrics,
    eq_series,
    countdownProgress,
    handlePrevPage,
    handleNextPage,
  };
};
