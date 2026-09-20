import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { UserData } from "../../../../../api/GlobalInterface";
import { SaveExcel } from "../../../../../api/services/excelService";
import { TONLIEUXUONG, LICHSUNHAPKHOAO, LICHSUXUATKHOAO } from "../../interfaces/khsxInterface";
import {
  f_load_nhapkhoao,
  f_load_tonkhoao,
  f_load_xuatkhoao,
} from "../../utils/khsxUtils";
import {
  getColumnTonKhoAo,
  getColumnNhapKhoAo,
  getColumnXuatKhoAo,
} from "./PrecisionKhoAoColumns";
import {
  handleXuatKhoAoAction,
  handleXoaRacAction,
  handleAnRacAction,
} from "./khoAoActionHandlers";

export const useKhoAoData = (initialNextPlan?: string) => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const [activeTab, setActiveTab] = useState<"TON" | "LS_IN" | "LS_OUT">("TON");
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [factory, setFactory] = useState("ALL");
  const [nextPlan, setNextPlan] = useState(initialNextPlan || "");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [datatable, setDataTable] = useState<any[]>([]);

  const tonkhoaodatafilter = useRef<Array<TONLIEUXUONG>>([]);

  // Cột động theo activeTab
  const columns = useMemo(() => {
    switch (activeTab) {
      case "TON":
        return getColumnTonKhoAo();
      case "LS_IN":
        return getColumnNhapKhoAo();
      case "LS_OUT":
        return getColumnXuatKhoAo();
    }
  }, [activeTab]);

  // Nạp tồn kho ảo
  const handle_loadKhoAo = useCallback(async (shownotification = true) => {
    setIsLoading(true);
    try {
      const tonkhoao: TONLIEUXUONG[] = await f_load_tonkhoao({ FACTORY: factory });
      setDataTable(tonkhoao);
      if (tonkhoao.length > 0) {
        if (shownotification) {
          Swal.fire("Thông báo", `Đã load: ${tonkhoao.length} dòng`, "success");
        }
      } else {
        if (shownotification) {
          Swal.fire("Thông báo", "Không có dòng nào", "info");
        }
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", "Không thể tải dữ liệu tồn Kho SX Main", "error");
    } finally {
      setIsLoading(false);
    }
  }, [factory]);

  // Nạp lịch sử nhập
  const load_nhapkhoao = useCallback(async () => {
    setIsLoading(true);
    try {
      const lsnhapkhoao: LICHSUNHAPKHOAO[] = await f_load_nhapkhoao({
        FROM_DATE: fromdate,
        TO_DATE: todate,
        FACTORY: factory,
      });
      setDataTable(lsnhapkhoao);
      if (lsnhapkhoao.length > 0) {
        Swal.fire("Thông báo", `Đã load: ${lsnhapkhoao.length} dòng`, "success");
      } else {
        Swal.fire("Thông báo", "Không có dòng nào", "info");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", "Không thể tải lịch sử nhập Kho SX Main", "error");
    } finally {
      setIsLoading(false);
    }
  }, [fromdate, todate, factory]);

  // Nạp lịch sử xuất
  const load_xuatkhoao = useCallback(async () => {
    setIsLoading(true);
    try {
      const lsxuatkhoao: LICHSUXUATKHOAO[] = await f_load_xuatkhoao({
        FROM_DATE: fromdate,
        TO_DATE: todate,
        FACTORY: factory,
      });
      setDataTable(lsxuatkhoao);
      if (lsxuatkhoao.length > 0) {
        Swal.fire("Thông báo", `Đã load: ${lsxuatkhoao.length} dòng`, "success");
      } else {
        Swal.fire("Thông báo", "Không có dòng nào", "info");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", "Không thể tải lịch sử xuất Kho SX Main", "error");
    } finally {
      setIsLoading(false);
    }
  }, [fromdate, todate, factory]);

  // Chuyển Tab
  const handleTabChange = useCallback((tab: "TON" | "LS_IN" | "LS_OUT") => {
    setActiveTab(tab);
    setDataTable([]);
    setSearchKeyword("");
    tonkhoaodatafilter.current = [];
    if (tab === "TON") {
      handle_loadKhoAo(false);
    } else if (tab === "LS_IN") {
      load_nhapkhoao();
    } else if (tab === "LS_OUT") {
      load_xuatkhoao();
    }
  }, [handle_loadKhoAo, load_nhapkhoao, load_xuatkhoao]);

  // Làm mới theo tab hiện tại
  const handleRefresh = useCallback(() => {
    if (activeTab === "TON") {
      handle_loadKhoAo(true);
    } else if (activeTab === "LS_IN") {
      load_nhapkhoao();
    } else if (activeTab === "LS_OUT") {
      load_xuatkhoao();
    }
  }, [activeTab, handle_loadKhoAo, load_nhapkhoao, load_xuatkhoao]);

  // Logic Xuất Next
  const handle_xuatKhoAo = useCallback(() => {
    handleXuatKhoAoAction({
      nextPlan,
      selectedRows: tonkhoaodatafilter.current,
      userData,
      activeTab,
      onSuccess: () => {
        handle_loadKhoAo(true);
        tonkhoaodatafilter.current = [];
      },
      onReload: () => handle_loadKhoAo(false),
    });
  }, [nextPlan, userData, activeTab, handle_loadKhoAo]);

  // Logic Xóa Rác
  const handle_nhappassword_xoarac = useCallback(() => {
    handleXoaRacAction({
      selectedRows: tonkhoaodatafilter.current,
      userData,
      activeTab,
      onSuccess: () => handle_loadKhoAo(true),
      onReload: () => handle_loadKhoAo(false),
    });
  }, [userData, activeTab, handle_loadKhoAo]);

  // Logic Ẩn Rác
  const handle_nhappassword_anrac = useCallback(() => {
    handleAnRacAction({
      selectedRows: tonkhoaodatafilter.current,
      userData,
      activeTab,
      onSuccess: () => handle_loadKhoAo(false),
      onReload: () => handle_loadKhoAo(false),
    });
  }, [userData, activeTab, handle_loadKhoAo]);

  // Lọc dữ liệu theo searchKeyword
  const filteredData = useMemo(() => {
    if (!searchKeyword.trim()) return datatable;
    const kw = searchKeyword.trim().toLowerCase();
    return datatable.filter((item) => {
      return (
        item.M_CODE?.toLowerCase().includes(kw) ||
        item.M_NAME?.toLowerCase().includes(kw) ||
        item.M_LOT_NO?.toLowerCase().includes(kw) ||
        item.PLAN_ID_INPUT?.toLowerCase().includes(kw) ||
        item.PLAN_ID_OUTPUT?.toLowerCase().includes(kw) ||
        item.PLAN_ID_SUDUNG?.toLowerCase().includes(kw) ||
        item.FACTORY?.toLowerCase().includes(kw)
      );
    });
  }, [datatable, searchKeyword]);

  // Xuất Excel
  const exportExcel = useCallback((type: "EX1" | "EX2") => {
    const exportRows = type === "EX1" ? filteredData : datatable;
    if (exportRows.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    const fileName = `KHOAO_${activeTab}_${moment().format("YYYYMMDD_HHmmss")}`;
    SaveExcel(exportRows, fileName);
  }, [filteredData, datatable, activeTab]);

  // Load kho ảo lần đầu
  useEffect(() => {
    handle_loadKhoAo(true);
  }, []);

  return {
    userData,
    activeTab,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    factory,
    setFactory,
    nextPlan,
    setNextPlan,
    searchKeyword,
    setSearchKeyword,
    isLoading,
    datatable,
    filteredData,
    columns,
    tonkhoaodatafilter,
    handleTabChange,
    handleRefresh,
    handle_xuatKhoAo,
    handle_nhappassword_xoarac,
    handle_nhappassword_anrac,
    exportExcel,
  };
};
