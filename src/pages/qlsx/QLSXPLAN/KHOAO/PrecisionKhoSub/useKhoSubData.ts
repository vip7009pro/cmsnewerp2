import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { UserData } from "../../../../../api/GlobalInterface";
import { SaveExcel } from "../../../../../api/services/excelService";
import { TONLIEUXUONG, LICHSUNHAPKHOAO } from "../../interfaces/khsxInterface";
import {
  f_load_nhapkhosub,
  f_load_tonkhosub,
} from "../../utils/khsxUtils";
import {
  getColumnTonKhoSub,
  getColumnNhapKhoSub,
} from "./PrecisionKhoSubColumns";
import { handleXuatKhoSubAction } from "./khoSubActionHandlers";

export const useKhoSubData = (initialNextPlan?: string) => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const [activeTab, setActiveTab] = useState<"TON" | "LS_IN">("TON");
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
        return getColumnTonKhoSub();
      case "LS_IN":
        return getColumnNhapKhoSub();
    }
  }, [activeTab]);

  // Nạp tồn kho Sub
  const handle_loadKhoSub = useCallback(async (shownotification = true) => {
    setIsLoading(true);
    try {
      const tonkhosub: TONLIEUXUONG[] = await f_load_tonkhosub({ FACTORY: factory });
      setDataTable(tonkhosub);
      if (tonkhosub.length > 0) {
        if (shownotification) {
          Swal.fire("Thông báo", `Đã load: ${tonkhosub.length} dòng`, "success");
        }
      } else {
        if (shownotification) {
          Swal.fire("Thông báo", "Không có dòng nào", "info");
        }
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", "Không thể tải dữ liệu tồn Kho SX Sub", "error");
    } finally {
      setIsLoading(false);
    }
  }, [factory]);

  // Nạp lịch sử nhập Sub
  const load_nhapkhosub = useCallback(async () => {
    setIsLoading(true);
    try {
      const lsnhapkhosub: LICHSUNHAPKHOAO[] = await f_load_nhapkhosub({
        FROM_DATE: fromdate,
        TO_DATE: todate,
        FACTORY: factory,
      });
      setDataTable(lsnhapkhosub);
      if (lsnhapkhosub.length > 0) {
        Swal.fire("Thông báo", `Đã load: ${lsnhapkhosub.length} dòng`, "success");
      } else {
        Swal.fire("Thông báo", "Không có dòng nào", "info");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", "Không thể tải lịch sử nhập Kho SX Sub", "error");
    } finally {
      setIsLoading(false);
    }
  }, [fromdate, todate, factory]);

  // Khi chuyển tab
  const handleTabChange = (tab: "TON" | "LS_IN") => {
    setActiveTab(tab);
    setSearchKeyword("");
    tonkhoaodatafilter.current = [];
    if (tab === "TON") {
      handle_loadKhoSub(true);
    } else if (tab === "LS_IN") {
      load_nhapkhosub();
    }
  };

  // Nút Tải lại (Refresh)
  const handleRefresh = () => {
    if (activeTab === "TON") {
      handle_loadKhoSub(true);
    } else if (activeTab === "LS_IN") {
      load_nhapkhosub();
    }
  };

  // Xử lý Xuất Next
  const handle_xuatKhoSub = () => {
    handleXuatKhoSubAction({
      nextPlan,
      selectedRows: tonkhoaodatafilter.current,
      userData,
      activeTab,
      onSuccess: () => {
        handle_loadKhoSub(false);
        tonkhoaodatafilter.current = [];
      },
      onReload: () => {
        handle_loadKhoSub(false);
      },
    });
  };

  // Tìm kiếm nhanh (Quick Search)
  const filteredData = useMemo(() => {
    if (!searchKeyword.trim()) return datatable;
    const kw = searchKeyword.trim().toLowerCase();
    return datatable.filter((item) => {
      const mCode = (item.M_CODE || "").toLowerCase();
      const mName = (item.M_NAME || "").toLowerCase();
      const lotNo = (item.M_LOT_NO || "").toLowerCase();
      const planIn = (item.PLAN_ID_INPUT || "").toLowerCase();
      const planUse = (item.PLAN_ID_SUDUNG || "").toLowerCase();
      const factoryVal = (item.FACTORY || "").toLowerCase();
      return (
        mCode.includes(kw) ||
        mName.includes(kw) ||
        lotNo.includes(kw) ||
        planIn.includes(kw) ||
        planUse.includes(kw) ||
        factoryVal.includes(kw)
      );
    });
  }, [datatable, searchKeyword]);

  // Xuất Excel
  const exportExcel = (type: "EX1" | "EX2") => {
    const dataToExport = type === "EX1" ? filteredData : datatable;
    if (dataToExport.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    const tabName = activeTab === "TON" ? "TonKhoSub" : "LichSuNhapSub";
    SaveExcel(dataToExport, `${tabName}_${moment().format("YYYYMMDD_HHmmss")}`);
  };

  // Khởi chạy ban đầu
  useEffect(() => {
    handle_loadKhoSub(true);
  }, []);

  return {
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
    handle_xuatKhoSub,
    exportExcel,
  };
};
