import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { UserData } from "../../../../../api/GlobalInterface";
import { checkBP } from "../../../../../api/services/permissionService";
import { SaveExcel } from "../../../../../api/services/excelService";
import {
  LONGTERM_PLAN_DATA,
  MACHINE_LIST,
  PROD_PLAN_CAPA_DATA,
} from "../../interfaces/khsxInterface";
import {
  f_deleteLongtermPlan,
  f_getMachineListData,
  f_getProductionPlanLeadTimeCapaData,
  f_insertLongTermPlan,
  f_loadLongTermPlan,
  f_moveLongTermPlan,
} from "../../utils/khsxUtils";

export const useLongTermPlanData = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const [productionplancapadata, setProductionPlanCapaData] = useState<PROD_PLAN_CAPA_DATA[]>([]);
  const [longterm_plan, setLongterm_plan] = useState<LONGTERM_PLAN_DATA[]>([]);

  const [fromdate, setFromDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [factory, setFactory] = useState<string>("NM1");
  const [machine, setMachine] = useState<string>("ALL");

  const [quickSearchText, setQuickSearchText] = useState<string>("");
  const [activeCapaTab, setActiveCapaTab] = useState<"ALL" | "FR" | "SR" | "DC" | "ED">("ALL");
  const [isCapaCollapsed, setIsCapaCollapsed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectedLongTermPlan = useRef<LONGTERM_PLAN_DATA[]>([]);
  const gridApiRef = useRef<any>(null);

  // 1. Tải danh sách máy móc
  const getMachineList = useCallback(async () => {
    try {
      const data = await f_getMachineListData();
      setMachine_List(data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách máy:", error);
    }
  }, []);

  // 2. Tải năng lực kế hoạch LeadTime & Capa
  const getProductionPlanLeadTimeCapaData = useCallback(async (planDate: string) => {
    try {
      const data = await f_getProductionPlanLeadTimeCapaData(planDate);
      setProductionPlanCapaData(data || []);
      return data || [];
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Capa:", error);
      return [];
    }
  }, []);

  // 3. Tải kế hoạch dài hạn
  const loadQLSXPlan = useCallback(async (planDate: string) => {
    setIsLoading(true);
    try {
      const data = await f_loadLongTermPlan(planDate);
      setLongterm_plan(data || []);
    } catch (error) {
      console.error("Lỗi khi tải kế hoạch dài hạn:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 4. Tra cứu tổng hợp
  const handleSearchAll = useCallback(async () => {
    await Promise.all([
      loadQLSXPlan(fromdate),
      getProductionPlanLeadTimeCapaData(fromdate),
    ]);
  }, [fromdate, loadQLSXPlan, getProductionPlanLeadTimeCapaData]);

  // 5. Chuyển ngày kế hoạch đã chọn (MOVE PLAN)
  const handleMovePlan = useCallback(
    async (fromDateParam: string, toDateParam: string) => {
      try {
        await f_moveLongTermPlan(fromDateParam, toDateParam);
        await handleSearchAll();
      } catch (error) {
        console.error("Lỗi khi chuyển ngày kế hoạch:", error);
      }
    },
    [handleSearchAll]
  );

  const handleConfirmMovePlan = useCallback(() => {
    Swal.fire({
      title: "Chắc chắn muốn chuyển ngày cho plan đã chọn?",
      text: `Sẽ bắt đầu chuyển ngày từ ${fromdate} sang ${todate}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn chuyển!",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], () => {
          Swal.fire("Tiến hành chuyển ngày PLAN", "Đang xử lý chuyển ngày plan...", "success");
          handleMovePlan(fromdate, todate);
        });
      }
    });
  }, [userData, fromdate, todate, handleMovePlan]);

  // 6. Xóa kế hoạch đã chọn (DELETE PLAN)
  const handleDeletePlan = useCallback(
    async (longTermPlanList: LONGTERM_PLAN_DATA[]) => {
      if (longTermPlanList.length === 0) {
        Swal.fire("Thông báo", "Vui lòng chọn ít nhất 1 dòng để xóa", "warning");
        return;
      }
      try {
        for (let index = 0; index < longTermPlanList.length; index++) {
          const element = longTermPlanList[index];
          await f_deleteLongtermPlan(element);
        }
        await loadQLSXPlan(fromdate);
        Swal.fire("Thành công", "Đã xóa kế hoạch dài hạn đã chọn", "success");
      } catch (error) {
        console.error("Lỗi khi xóa kế hoạch:", error);
        Swal.fire("Lỗi", "Không thể xóa kế hoạch đã chọn", "error");
      }
    },
    [fromdate, loadQLSXPlan]
  );

  const handleConfirmDeletePlan = useCallback(() => {
    if (selectedLongTermPlan.current.length === 0) {
      Swal.fire("Thông báo", "Vui lòng chọn ít nhất 1 dòng kế hoạch để xóa", "warning");
      return;
    }

    Swal.fire({
      title: `Chắc chắn muốn xóa ${selectedLongTermPlan.current.length} plan đã chọn?`,
      text: "Hành động này sẽ xóa dữ liệu kế hoạch dài hạn đã lưu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Đồng ý xóa!",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], () => {
          handleDeletePlan(selectedLongTermPlan.current);
        });
      }
    });
  }, [userData, handleDeletePlan]);

  // 7. Lưu thay đổi khi sửa ô trên bảng (Inline Edit)
  const handleCellEditingStopped = useCallback(
    async (e: any) => {
      try {
        await f_insertLongTermPlan(e.data, fromdate);
        const kq = await f_getProductionPlanLeadTimeCapaData(fromdate);
        setProductionPlanCapaData(kq || []);
        await loadQLSXPlan(fromdate);
      } catch (error) {
        console.error("Lỗi khi cập nhật ô kế hoạch:", error);
      }
    },
    [fromdate, loadQLSXPlan]
  );

  // 8. Khi click vào 1 dòng trên bảng
  const handleRowClick = useCallback(
    async (e: any) => {
      try {
        const kq = await f_getProductionPlanLeadTimeCapaData(fromdate);
        setProductionPlanCapaData(kq || []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu Capa theo dòng:", error);
      }
    },
    [fromdate]
  );

  // 9. Khi chọn dòng trên bảng
  const handleSelectionChange = useCallback((e: any) => {
    if (e?.api) {
      selectedLongTermPlan.current = e.api.getSelectedRows();
      gridApiRef.current = e.api;
    }
  }, []);

  // 10. Bỏ chọn tất cả dòng
  const handleClearSelection = useCallback(() => {
    if (gridApiRef.current) {
      gridApiRef.current.deselectAll();
      selectedLongTermPlan.current = [];
    }
  }, []);

  // 11. Xuất Excel dữ liệu kế hoạch dài hạn
  const handleExportPlanExcel = useCallback(() => {
    if (!longterm_plan || longterm_plan.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "info");
      return;
    }
    SaveExcel(longterm_plan, `LongTermPlan_${fromdate}`);
  }, [longterm_plan, fromdate]);

  // Dữ liệu lọc phía client
  const filteredLongTermPlan = useMemo(() => {
    return longterm_plan.filter((item) => {
      const matchMachine = machine === "ALL" || item.EQ_NAME === machine;
      const matchSearch =
        !quickSearchText.trim() ||
        item.G_CODE?.toLowerCase().includes(quickSearchText.toLowerCase()) ||
        (item as any).G_NAME?.toLowerCase().includes(quickSearchText.toLowerCase()) ||
        item.EQ_NAME?.toLowerCase().includes(quickSearchText.toLowerCase());

      return matchMachine && matchSearch;
    });
  }, [longterm_plan, machine, quickSearchText]);

  // Khởi tạo ban đầu
  useEffect(() => {
    getMachineList();
    getProductionPlanLeadTimeCapaData(fromdate);
    loadQLSXPlan(fromdate);
  }, [getMachineList, getProductionPlanLeadTimeCapaData, loadQLSXPlan, fromdate]);

  return {
    machine_list,
    productionplancapadata,
    longterm_plan,
    filteredLongTermPlan,
    fromdate,
    todate,
    factory,
    machine,
    quickSearchText,
    activeCapaTab,
    isCapaCollapsed,
    isLoading,
    setFromDate,
    setToDate,
    setFactory,
    setMachine,
    setQuickSearchText,
    setActiveCapaTab,
    setIsCapaCollapsed,
    handleSearchAll,
    handleConfirmMovePlan,
    handleConfirmDeletePlan,
    handleCellEditingStopped,
    handleRowClick,
    handleSelectionChange,
    handleClearSelection,
    handleExportPlanExcel,
  };
};
