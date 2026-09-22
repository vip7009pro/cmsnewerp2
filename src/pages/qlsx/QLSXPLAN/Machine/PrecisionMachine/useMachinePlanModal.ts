import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { useReactToPrint } from "react-to-print";
import { generalQuery, getCompany, getSocket, getUserData } from "../../../../../api/Api";
import { checkBP } from "../../../../../api/services/permissionService";
import { f_insert_Notification_Data } from "../../../../../api/services/notificationService";
import { NotificationElement } from "../../../../../components/NotificationPanel/Notification";
import { YCSXTableData } from "../../../../kinhdoanh/interfaces/kdInterface";
import {
  MACHINE_LIST,
  QLSXCHITHIDATA,
  QLSXPLANDATA,
  RecentDM,
} from "../../interfaces/khsxInterface";
import {
  f_addQLSXPLAN,
  f_deleteChiThiMaterialLine,
  f_deleteQLSXPlan,
  f_getMachineListData,
  f_getRecentDMData,
  f_handle_xuatdao_sample,
  f_handle_xuatlieu_sample,
  f_handleDangKyXuatLieu,
  f_handleGetChiThiTable,
  f_handleResetChiThiTable,
  f_handletraYCSXQLSX,
  f_saveChiThiMaterialTable,
  f_saveQLSX,
  f_saveSinglePlan,
  f_setPendingYCSX,
  f_updateBatchPlan,
  f_updateLossKT_ZTB_DM_HISTORY,
  renderBanVe,
  renderChiThi,
  renderChiThi2,
  renderYCSX,
} from "../../utils/khsxUtils";
import { getSettingUPHUnitLoss } from "../../../../../components/JSONData/DinhMuc";
import { f_insertDMYCSX } from "../../../../kinhdoanh/utils/kdUtils";
import { DataDinhMucState, UseMachinePlanModalReturn, YCSXFilterState } from "./machineTypes";

export const defaultPlan: QLSXPLANDATA = {
  id: 0,
  PLAN_ID: "XXX",
  PLAN_DATE: "2024-01-01",
  PROD_REQUEST_NO: "123",
  PLAN_QTY: 0,
  PLAN_EQ: "FR01",
  PLAN_FACTORY: "NM1",
  PLAN_LEADTIME: 0,
  INS_EMPL: "XXX",
  INS_DATE: "XXX",
  UPD_EMPL: "XXX",
  UPD_DATE: "XXX",
  G_CODE: "7C123",
  G_NAME: "TEM",
  G_NAME_KD: "TEM",
  PROD_REQUEST_DATE: "2024-01-01",
  PROD_REQUEST_QTY: 0,
  DELIVERY_DT: "",
  STEP: 0,
  PLAN_ORDER: "XXX",
  PROCESS_NUMBER: 0,
  KQ_SX_TAM: 0,
  KETQUASX: 0,
  CD1: 0,
  CD2: 0,
  CD3: 0,
  CD4: 0,
  TON_CD1: 0,
  TON_CD2: 0,
  TON_CD3: 0,
  TON_CD4: 0,
  FACTORY: "NM1",
  EQ1: "FR01",
  EQ2: "",
  EQ3: "",
  EQ4: "",
  Setting1: 0,
  Setting2: 0,
  Setting3: 0,
  Setting4: 0,
  UPH1: 0,
  UPH2: 0,
  UPH3: 0,
  UPH4: 0,
  Step1: 0,
  Step2: 0,
  Step3: 0,
  Step4: 0,
  LOSS_SX1: 0,
  LOSS_SX2: 0,
  LOSS_SX3: 0,
  LOSS_SX4: 0,
  LOSS_SETTING1: 0,
  LOSS_SETTING2: 0,
  LOSS_SETTING3: 0,
  LOSS_SETTING4: 0,
  NOTE: "",
  NEXT_PLAN_ID: "",
  XUATDAOFILM: "",
  EQ_STATUS: "",
  MAIN_MATERIAL: "",
  INT_TEM: "",
  CHOTBC: "",
  DKXL: "",
  OLD_PLAN_QTY: 0,
  ACHIVEMENT_RATE: 0,
  PDBV: "",
  PD: 0,
  CAVITY: 0,
  SETTING_START_TIME: "",
  MASS_START_TIME: "",
  MASS_END_TIME: "",
  REQ_DF: "",
  AT_LEADTIME: 0,
  ACC_TIME: 0,
  IS_SETTING: "N",
  PDBV_EMPL: "",
  PDBV_DATE: "",
  LOSS_KT: 0,
  ORG_LOSS_KT: 0,
  USE_YN: "Y",
};

export const defaultDinhMuc: DataDinhMucState = {
  FACTORY: "",
  EQ1: "",
  EQ2: "",
  EQ3: "",
  EQ4: "",
  Setting1: 0,
  Setting2: 0,
  Setting3: 0,
  Setting4: 0,
  UPH1: 0,
  UPH2: 0,
  UPH3: 0,
  UPH4: 0,
  Step1: 0,
  Step2: 0,
  Step3: 0,
  Step4: 0,
  LOSS_SX1: 0,
  LOSS_SX2: 0,
  LOSS_SX3: 0,
  LOSS_SX4: 0,
  LOSS_SETTING1: 0,
  LOSS_SETTING2: 0,
  LOSS_SETTING3: 0,
  LOSS_SETTING4: 0,
  LOSS_KT: 0,
  NOTE: "",
};

interface UseMachinePlanModalProps {
  selectedMachine: string;
  selectedFactory: string;
  selectedPlanDate: string;
  /** Chi tiết chỉ thị của đúng máy đang chọn (do useMachineData tải theo máy) */
  machinePlans?: QLSXPLANDATA[];
  isMachinePlansLoading?: boolean;
  /** Tải lại chỉ thị + SLC của máy đang chọn */
  loadMachinePlans?: (machine: string, factory: string) => Promise<QLSXPLANDATA[]>;
  /** Fallback cho màn hình cũ: danh sách plan dùng chung toàn sàn */
  plandatatable?: QLSXPLANDATA[];
  onRefreshData: () => Promise<void>;
}

export const useMachinePlanModal = ({
  selectedMachine,
  selectedFactory,
  selectedPlanDate,
  machinePlans,
  isMachinePlansLoading,
  loadMachinePlans,
  plandatatable,
  onRefreshData,
}: UseMachinePlanModalProps): UseMachinePlanModalReturn => {
  const userData = getUserData();
  const myComponentRef = useRef<any>();
  const ycsxprintref = useRef<HTMLDivElement>(null);

  // State Kế hoạch & Định mức
  const [selectedPlan, setSelectedPlan] = useState<QLSXPLANDATA>(defaultPlan);
  const [datadinhmuc, setDataDinhMuc] = useState<DataDinhMucState>(defaultDinhMuc);
  const [recentDMData, setRecentDMData] = useState<RecentDM[]>([]);
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const [chithidatatable, setChiThiDataTable] = useState<QLSXCHITHIDATA[]>([]);
  const selectedMaterialRowsRef = useRef<QLSXCHITHIDATA[]>([]);
  const handleSelectedMaterialRowsChange = useCallback((rows: QLSXCHITHIDATA[]) => {
    selectedMaterialRowsRef.current = rows;
  }, []);

  const resetPlanModal = useCallback(() => {
    setSelectedPlan({ ...defaultPlan });
    setDataDinhMuc({ ...defaultDinhMuc });
    setRecentDMData([]);
    setChiThiDataTable([]);
    setIsDetailLoading(false);
  }, []);

  // State YCSX
  const [showYCSX, setShowYCSX] = useState<boolean>(true);
  const [ycsxDataTable, setYCSXDataTable] = useState<YCSXTableData[]>([]);
  const [ycsxFilter, setYCSXFilter] = useState<YCSXFilterState>({
    fromdate: moment().add(-7, "day").format("YYYY-MM-DD"),
    todate: moment().format("YYYY-MM-DD"),
    codeKD: "",
    codeCMS: "",
    empl_name: "",
    cust_name: "",
    prod_type: "",
    prodrequestno: "",
    phanloai: "00",
    material: "",
    ycsxpendingcheck: false,
    inspectInputcheck: false,
    materialYES: false,
    alltime: false,
    tempDM: false,
  });

  // State In ấn & Dialogs
  const [showChiThi, setShowChiThi] = useState<boolean>(false);
  const [showChiThi2, setShowChiThi2] = useState<boolean>(false);
  const [showKhoAo, setShowKhoAo] = useState<boolean>(false);
  const [showYCKT, setShowYCKT] = useState<boolean>(false);
  const [selection, setSelection] = useState<any>({
    tabycsx: false,
    tabbanve: false,
    tab1: true,
    tab2: false,
    tab3: false,
  });
  const [maxLieu, setMaxLieu] = useState<number>(() => {
    return Number(localStorage.getItem("maxLieu") || 16);
  });

  const [chithilistrender, setChiThiListRender] = useState<any>();
  const [chithilistrender2, setChiThiListRender2] = useState<any>();
  const [ycsxlistrender, setYCSXListRender] = useState<any>();
  const [ycktlistrender, setYCKTListRender] = useState<any>();

  // Loading state cho chi tiết plan (định mức + chỉ thị) - tránh nháy giao diện
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
  const [detailProgress, setDetailProgress] = useState(0);
  const [detailLoadingLabel, setDetailLoadingLabel] = useState("Đang chuẩn bị dữ liệu...");
  const [isMaterialActionLoading, setIsMaterialActionLoading] = useState(false);
  const [materialActionProgress, setMaterialActionProgress] = useState(0);
  const [materialActionLabel, setMaterialActionLabel] = useState("Đang xử lý vật liệu...");
  const [isAddPlanLoading, setIsAddPlanLoading] = useState(false);
  const [addPlanProgress, setAddPlanProgress] = useState(0);
  const [addPlanLoadingLabel, setAddPlanLoadingLabel] = useState("Đang chuẩn bị thêm kế hoạch...");
  const addPlanInFlightRef = useRef(false);
  const detailRequestRef = useRef(0);

  // In qua ReactToPrint
  const handlePrint = useReactToPrint({
    content: () => ycsxprintref.current,
  });

  // Lọc kế hoạch thuộc máy đang chọn
  // (machinePlans đã được backend lọc đúng PLAN_EQ + PLAN_FACTORY nên không cần filter lại;
  //  nếu màn hình cũ truyền plandatatable dùng chung thì fallback về danh sách đó)
  const sourcePlans = machinePlans ?? plandatatable;
  const currentMachinePlansFromProps = useMemo(() => {
    return (sourcePlans ?? []).filter(
      (p) =>
        p.PLAN_EQ === selectedMachine &&
        p.PLAN_FACTORY === (selectedFactory || "NM1")
    );
  }, [sourcePlans, selectedMachine, selectedFactory]);

  // Local state copy để IS_SETTING checkbox có thể update ngay lập tức mà không cần re-fetch
  const [localPlans, setLocalPlans] = useState<QLSXPLANDATA[]>([]);
  useEffect(() => {
    setLocalPlans(currentMachinePlansFromProps);
  }, [currentMachinePlansFromProps]);

  const currentMachinePlans = localPlans.length > 0 ? localPlans : currentMachinePlansFromProps;

  /**
   * Refresh RIÊNG chỉ thị của máy đang chọn.
   * Trước đây mỗi thao tác (thêm/xóa plan, xuất liệu, lưu định mức...) đều gọi onRefreshData()
   * => phải chạy lại query getqlsxplan2 nặng cho TOÀN BỘ máy. Nay chỉ tải lại 1 máy.
   */
  const refreshMachinePlans = useCallback(async () => {
    if (loadMachinePlans) {
      await loadMachinePlans(selectedMachine, selectedFactory || "NM1");
      return;
    }
    // Fallback cho màn hình cũ không có loader theo máy
    await onRefreshData();
  }, [loadMachinePlans, onRefreshData, selectedMachine, selectedFactory]);

  // Nạp danh sách máy cho dropdown EQ1-4
  useEffect(() => {
    const loadMachines = async () => {
      try {
        const list = await f_getMachineListData();
        setMachine_List(list || []);
      } catch (err) {
        console.error("Lỗi getMachineList:", err);
      }
    };
    loadMachines();
  }, []);

  // Refs ổn định để tránh re-renders và phá vỡ memo
  const selectedPlanRef = useRef<QLSXPLANDATA>(selectedPlan);
  selectedPlanRef.current = selectedPlan;
  const currentMachinePlansRef = useRef<QLSXPLANDATA[]>(currentMachinePlans);
  currentMachinePlansRef.current = currentMachinePlans;

  // Click vào 1 dòng trên bảng Kế hoạch -> Nhảy ngay lập tức 4 cột định mức CD1-CD4 và nạp chỉ thị đồng bộ (KHÔNG BỊ NHÁY)
  const handleSelectPlan = useCallback(
    async (rowData: QLSXPLANDATA) => {
      if (!rowData || rowData.PLAN_ID === "XXX") return;
      const requestId = ++detailRequestRef.current;

      setSelectedPlan(rowData);

      // Tạo đối tượng định mức mới trực tiếp từ rowData để đảm bảo chính xác 100%
      const nextDM: DataDinhMucState = {
        FACTORY: rowData.FACTORY ?? selectedFactory ?? "NA",
        EQ1: rowData.EQ1 ?? "NA",
        EQ2: rowData.EQ2 ?? "NA",
        EQ3: rowData.EQ3 ?? "NA",
        EQ4: rowData.EQ4 ?? "NA",
        Setting1: rowData.Setting1 ?? 0,
        Setting2: rowData.Setting2 ?? 0,
        Setting3: rowData.Setting3 ?? 0,
        Setting4: rowData.Setting4 ?? 0,
        UPH1: rowData.UPH1 ?? 0,
        UPH2: rowData.UPH2 ?? 0,
        UPH3: rowData.UPH3 ?? 0,
        UPH4: rowData.UPH4 ?? 0,
        Step1: rowData.Step1 ?? 0,
        Step2: rowData.Step2 ?? 0,
        Step3: rowData.Step3 ?? 0,
        Step4: rowData.Step4 ?? 0,
        LOSS_SX1: rowData.LOSS_SX1 ?? 0,
        LOSS_SX2: rowData.LOSS_SX2 ?? 0,
        LOSS_SX3: rowData.LOSS_SX3 ?? 0,
        LOSS_SX4: rowData.LOSS_SX4 ?? 0,
        LOSS_SETTING1: rowData.LOSS_SETTING1 ?? 0,
        LOSS_SETTING2: rowData.LOSS_SETTING2 ?? 0,
        LOSS_SETTING3: rowData.LOSS_SETTING3 ?? 0,
        LOSS_SETTING4: rowData.LOSS_SETTING4 ?? 0,
        LOSS_KT: rowData.LOSS_KT ?? 0,
        NOTE: rowData.NOTE ?? "",
      };
      setDataDinhMuc(nextDM);

      // Fetch song song recent định mức và bảng chỉ thị vật tư đúng theo dòng vừa chọn
      setIsDetailLoading(true);
      setDetailProgress(10);
      setDetailLoadingLabel("Đang tải định mức và danh sách vật liệu...");
      try {
        const recentPromise = rowData.G_CODE && rowData.G_CODE !== "7C123"
          ? f_getRecentDMData(rowData.G_CODE)
          : Promise.resolve([]);
        const chiThiPromise = f_handleGetChiThiTable(rowData, nextDM as any, ycsxFilter.tempDM);
        const recentRes = await recentPromise;
        if (requestId === detailRequestRef.current) {
          setDetailProgress(50);
          setDetailLoadingLabel("Đã tải định mức, đang tải danh sách vật liệu...");
          setRecentDMData(recentRes || []);
        }
        const chiThiRes = await chiThiPromise;
        if (requestId === detailRequestRef.current) {
          setDetailProgress(90);
          setDetailLoadingLabel("Đang hoàn thiện dữ liệu vật liệu...");
          setChiThiDataTable(chiThiRes || []);
        }
        /* Promise order is intentional: percentages represent completed steps. */
        /*
        const [recentRes, chiThiRes] = await Promise.all([
          rowData.G_CODE && rowData.G_CODE !== "7C123"
            ? f_getRecentDMData(rowData.G_CODE)
            : Promise.resolve([]),
          f_handleGetChiThiTable(rowData, nextDM as any, ycsxFilter.tempDM),
        ]);
        setRecentDMData(recentRes || []);
        setChiThiDataTable(chiThiRes || []);
        */
      } catch (err) {
        console.error("Lỗi fetch chi thi / recent DM:", err);
      } finally {
        if (requestId === detailRequestRef.current) {
          setDetailProgress(100);
          setIsDetailLoading(false);
        }
      }
    },
    [selectedFactory, ycsxFilter.tempDM]
  );

  // Tra cứu YCSX (Chuẩn hóa 100% tên tham số khớp backend)
  const handletraYCSX = useCallback(async () => {
    Swal.fire({
      title: "Tra YCSX",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    try {
      const data = await f_handletraYCSXQLSX({
        alltime: ycsxFilter.alltime,
        start_date: ycsxFilter.fromdate,
        end_date: ycsxFilter.todate,
        cust_name: ycsxFilter.cust_name,
        codeCMS: ycsxFilter.codeCMS,
        codeKD: ycsxFilter.codeKD,
        prod_type: ycsxFilter.prod_type,
        empl_name: ycsxFilter.empl_name,
        phanloai: ycsxFilter.phanloai,
        ycsx_pending: ycsxFilter.ycsxpendingcheck,
        inspect_inputcheck: ycsxFilter.inspectInputcheck,
        prod_request_no: ycsxFilter.prodrequestno,
        material: ycsxFilter.material,
        material_yes: ycsxFilter.materialYES,
      });
      setYCSXDataTable(data || []);
      if (data && data.length > 0) {
        Swal.fire("Thông báo", "Đã load " + data.length + " dòng", "success");
      } else {
        Swal.fire("Thông báo", "Không có dữ liệu", "warning");
      }
    } catch (err) {
      console.error("Lỗi tra cứu YCSX:", err);
      Swal.fire("Lỗi", "Không thể tải dữ liệu YCSX", "error");
    }
  }, [ycsxFilter]);

  // Thêm plan từ dòng YCSX
  const handleAddPlanFromYCSX = useCallback(
    async (ycsxRow: YCSXTableData) => {
      if (addPlanInFlightRef.current) return;
      addPlanInFlightRef.current = true;
      setIsAddPlanLoading(true);
      setAddPlanProgress(10);
      setAddPlanLoadingLabel("Đang kiểm tra quyền thêm kế hoạch...");
      checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], async () => {
        try {
          setAddPlanProgress(35);
          setAddPlanLoadingLabel("Đang tạo kế hoạch trên máy...");
          await f_addQLSXPLAN(
            [ycsxRow],
            selectedPlanDate,
            selectedMachine,
            selectedFactory || "NM1",
            datadinhmuc as any
          );
          setAddPlanProgress(70);
          setAddPlanLoadingLabel("Đang cập nhật danh sách kế hoạch...");
          await refreshMachinePlans();
          await onRefreshData();
          setAddPlanProgress(100);
          Swal.fire("Thành công", `Đã thêm kế hoạch cho ${selectedMachine}`, "success");
        } catch (err) {
          console.error("Lỗi add plan:", err);
          Swal.fire("Lỗi", "Không thể thêm kế hoạch", "error");
        } finally {
          addPlanInFlightRef.current = false;
          setIsAddPlanLoading(false);
        }
      });
    },
    [datadinhmuc, onRefreshData, refreshMachinePlans, selectedFactory, selectedMachine, selectedPlanDate, userData]
  );

  // Lưu thông tin single plan
  const handleSaveSinglePlan = useCallback(async () => {
    if (!selectedPlan || selectedPlan.PLAN_ID === "XXX") {
      Swal.fire("Thông báo", "Vui lòng chọn 1 kế hoạch để lưu", "warning");
      return;
    }

    checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], async () => {
      try {
        await f_saveSinglePlan(selectedPlan);
        const newNotification: NotificationElement = {
          CTR_CD: "002",
          NOTI_ID: -1,
          NOTI_TYPE: "info",
          TITLE: "Update thông tin chỉ thị",
          CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}) đã update chỉ thị ${selectedPlan.PLAN_ID}: ${selectedPlan.PROD_REQUEST_NO}: ${selectedPlan.G_NAME}`,
          SUBDEPTNAME: "KD,RND,SX_VP,QLSX",
          MAINDEPTNAME: "KD,RND,SX,QLSX",
          INS_EMPL: getUserData()?.EMPL_NO || "ADMIN",
          INS_DATE: moment().format("YYYY-MM-DD"),
          UPD_EMPL: getUserData()?.EMPL_NO || "ADMIN",
          UPD_DATE: moment().format("YYYY-MM-DD"),
        };
        if (await f_insert_Notification_Data(newNotification)) {
          getSocket().emit("notification_panel", newNotification);
        }
        await refreshMachinePlans();
        await onRefreshData();
        const updatedChiThi = await f_handleGetChiThiTable(
          selectedPlan,
          datadinhmuc as any,
          ycsxFilter.tempDM
        );
        setChiThiDataTable(updatedChiThi || []);
        Swal.fire("Thành công", "Đã lưu kế hoạch thành công", "success");
      } catch (err) {
        console.error("Lỗi save plan:", err);
        Swal.fire("Lỗi", "Không thể lưu kế hoạch", "error");
      }
    });
  }, [datadinhmuc, onRefreshData, refreshMachinePlans, selectedPlan, userData, ycsxFilter.tempDM]);

  // Xóa plan (dùng ref để giữ reference ổn định không làm re-render columns)
  // Khôi phục đúng logic bản gốc:
  //  - Xóa TẤT CẢ các dòng PLAN đã CHECK (multi-select) chứ không chỉ 1 dòng đang click.
  //  - f_deleteQLSXPlan đã kiểm tra đầy đủ điều kiện (CHOTBC, checkPLANID_O302, checkPLANID_OUT_KHO_AO)
  //    => phải đọc err_code trả về để báo lỗi, KHÔNG được luôn báo "xóa thành công".
  const handleDeletePlan = useCallback(
    async (plans: QLSXPLANDATA[]) => {
      if (!plans || plans.length === 0) {
        Swal.fire("Thông báo", "Chọn ít nhất một dòng để xóa", "error");
        return;
      }
      checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], async () => {
        const planIds = plans.map((p) => p.PLAN_ID).join(", ");
        const confirmResult = await Swal.fire({
          title: "Chắc chắn muốn xóa PLAN đã chọn ?",
          text:
            plans.length > 1
              ? `Sẽ xóa ${plans.length} chỉ thị: ${planIds}`
              : `Sẽ xóa chỉ thị: ${planIds}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#ef4444",
          cancelButtonColor: "#64748b",
          confirmButtonText: "Vẫn Xóa!",
          cancelButtonText: "Hủy",
        });
        if (!confirmResult.isConfirmed) return;

        Swal.fire({
          title: "Xóa Plan",
          text: "Đang xóa plan, hãy chờ một chút",
          icon: "info",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
          showConfirmButton: false,
        });

        // f_deleteQLSXPlan trả về "0" khi thành công, ngược lại là chuỗi lỗi chi tiết
        const err_code: string = await f_deleteQLSXPlan(plans);
        if (err_code === "0") {
          Swal.fire("Thông báo", "Xóa hoàn thành", "success");
        } else {
          Swal.fire("Thông báo", err_code, "error");
        }

        await refreshMachinePlans();
        await onRefreshData();

        const deletedIds = plans.map((p) => p.PLAN_ID);
        if (
          selectedPlanRef.current &&
          deletedIds.includes(selectedPlanRef.current.PLAN_ID)
        ) {
          setSelectedPlan(defaultPlan);
          setChiThiDataTable([]);
        }
      });
    },
    [onRefreshData, refreshMachinePlans, userData]
  );

  // Di chuyển thứ tự plan (Lên / Xuống) - dùng currentMachinePlansRef để giữ reference ổn định
  const handleMovePlan = useCallback(
    async (direction: "UP" | "DOWN", plan: QLSXPLANDATA) => {
      const plans = currentMachinePlansRef.current;
      const idx = plans.findIndex((p) => p.PLAN_ID === plan.PLAN_ID);
      if (idx < 0) return;
      if (direction === "UP" && idx === 0) return;
      if (direction === "DOWN" && idx === plans.length - 1) return;

      const targetIdx = direction === "UP" ? idx - 1 : idx + 1;
      const newPlans = [...plans];
      const temp = newPlans[idx];
      newPlans[idx] = newPlans[targetIdx];
      newPlans[targetIdx] = temp;

      try {
        await f_updateBatchPlan(newPlans);
        await refreshMachinePlans();
      } catch (err) {
        console.error("Lỗi cập nhật thứ tự plan:", err);
      }
    },
    [refreshMachinePlans]
  );

  // Bắt đầu / Kết thúc Plan
  const handleStartPlan = useCallback(
    async (plan: QLSXPLANDATA) => {
      await generalQuery("setPlanStatus", {
        PLAN_ID: plan.PLAN_ID,
        STATUS: "RUNNING",
      });
      await refreshMachinePlans();
    },
    [refreshMachinePlans]
  );

  const handleFinishPlan = useCallback(
    async (plan: QLSXPLANDATA) => {
      await generalQuery("setPlanStatus", {
        PLAN_ID: plan.PLAN_ID,
        STATUS: "COMPLETED",
      });
      await refreshMachinePlans();
    },
    [refreshMachinePlans]
  );

  // Lưu chỉ thị vật liệu, giữ nguyên quy tắc chọn dòng của bản gốc.
  const getMaterialRowsToSave = useCallback(() => {
    return getCompany() === "CMS" ? selectedMaterialRowsRef.current : chithidatatable;
  }, [chithidatatable]);

  const saveMaterialRows = useCallback(async (rows: QLSXCHITHIDATA[]) => {
    if (rows.length === 0) return "Chọn ít nhất một liệu để lưu";
    return f_saveChiThiMaterialTable(selectedPlan, rows);
  }, [selectedPlan]);

  const reloadMaterialRows = useCallback(async () => {
    const rows = await f_handleGetChiThiTable(selectedPlan, datadinhmuc as any, ycsxFilter.tempDM);
    setChiThiDataTable(rows || []);
  }, [datadinhmuc, selectedPlan, ycsxFilter.tempDM]);

  const handleSaveChiThiMaterial = useCallback(async () => {
    checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], async () => {
      setIsMaterialActionLoading(true);
      setMaterialActionProgress(10);
      setMaterialActionLabel("Đang kiểm tra dữ liệu vật liệu...");
      try {
        const errorCode = await saveMaterialRows(getMaterialRowsToSave());
        if (errorCode === "0") {
          setMaterialActionProgress(55);
          setMaterialActionLabel("Đã lưu vật liệu, đang tải lại chỉ thị...");
          await reloadMaterialRows();
          setMaterialActionProgress(80);
          setMaterialActionLabel("Đang cập nhật danh sách kế hoạch...");
          await refreshMachinePlans();
          setMaterialActionProgress(100);
          Swal.fire("Thành công", "Đã lưu bảng chỉ thị vật liệu", "success");
        } else {
          Swal.fire("Thông báo", errorCode, "error");
        }
      } catch (err) {
        Swal.fire("Lỗi", "Không thể lưu chỉ thị", "error");
      } finally {
        setIsMaterialActionLoading(false);
      }
    });
  }, [getMaterialRowsToSave, refreshMachinePlans, reloadMaterialRows, saveMaterialRows, userData]);

  // Đăng ký xuất liệu: lưu chỉ thị trước, sau đó mới đăng ký O300/O301.
  const handleDangKyXuatLieu = useCallback(async () => {
    const confirmResult = await Swal.fire({
      title: "Chắc chắn muốn đăng ký xuất liệu?",
      text: "Hệ thống sẽ lưu chỉ thị rồi đăng ký xuất liệu.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Vẫn đăng ký",
      cancelButtonText: "Hủy",
    });
    if (!confirmResult.isConfirmed) return;

    checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], async () => {
      setIsMaterialActionLoading(true);
      setMaterialActionProgress(10);
      setMaterialActionLabel("Đang lưu chỉ thị vật liệu...");
      try {
        const rows = getMaterialRowsToSave();
        const saveError = await saveMaterialRows(rows);
        if (saveError !== "0") {
          Swal.fire("Thông báo", saveError, "error");
          return;
        }
        setMaterialActionProgress(45);
        setMaterialActionLabel("Đang đăng ký xuất kho vật liệu...");
        const registerError = await f_handleDangKyXuatLieu(selectedPlan, selectedFactory, rows);
        if (registerError !== "0") {
          Swal.fire("Thông báo", registerError, "error");
          return;
        }

        const notification: NotificationElement = {
          CTR_CD: "002",
          NOTI_ID: -1,
          NOTI_TYPE: "info",
          TITLE: "Đăng ký xuất liệu cho chỉ thị",
          CONTENT: `${getUserData()?.EMPL_NO} đã đăng ký xuất liệu cho chỉ thị: ${selectedPlan.PLAN_ID}: ${selectedPlan.PROD_REQUEST_NO}: ${selectedPlan.G_NAME}`,
          SUBDEPTNAME: "KD,RND,SX_VP,QLSX,KHO_VP,MUA_VP",
          MAINDEPTNAME: "KD,RND,SX,QLSX,KHO,MUA",
          INS_EMPL: getUserData()?.EMPL_NO || "ADMIN",
          INS_DATE: moment().format("YYYY-MM-DD"),
          UPD_EMPL: getUserData()?.EMPL_NO || "ADMIN",
          UPD_DATE: moment().format("YYYY-MM-DD"),
        };
        if (await f_insert_Notification_Data(notification)) {
          getSocket().emit("notification_panel", notification);
        }
        setMaterialActionProgress(75);
        setMaterialActionLabel("Đang tải lại chỉ thị và kế hoạch...");
        selectedMaterialRowsRef.current = [];
        await reloadMaterialRows();
        setMaterialActionProgress(90);
        await refreshMachinePlans();
        setMaterialActionProgress(100);
        Swal.fire("Thành công", "Đã đăng ký xuất liệu thành công", "success");
      } catch (err) {
        Swal.fire("Lỗi", "Không thể đăng ký xuất liệu", "error");
      } finally {
        setIsMaterialActionLoading(false);
      }
    });
  }, [getMaterialRowsToSave, refreshMachinePlans, reloadMaterialRows, saveMaterialRows, selectedFactory, selectedPlan, userData]);

  // Xóa dòng chỉ thị
  const handleDeleteChiThiLine = useCallback(
    async (rows: QLSXCHITHIDATA[]) => {
      checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], async () => {
        try {
          const updatedRows = await f_deleteChiThiMaterialLine(rows, chithidatatable);
          setChiThiDataTable(updatedRows);
          selectedMaterialRowsRef.current = [];
          Swal.fire("Đã xóa", "Đã xóa dòng chỉ thị", "success");
        } catch (err) {
          Swal.fire("Lỗi", "Không thể xóa dòng chỉ thị", "error");
        }
      });
    },
    [chithidatatable, userData]
  );

  // Xuất dao & Liệu sample
  const handleXuatDaoSample = useCallback(async () => {
    checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], async () => {
      await f_handle_xuatdao_sample(selectedPlan);
    });
  }, [selectedPlan, userData]);

  const handleXuatLieuSample = useCallback(async () => {
    checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], async () => {
      await f_handle_xuatlieu_sample(selectedPlan);
    });
  }, [selectedPlan, userData]);

  // Reset vật liệu chỉ thị
  const handleResetChiThi = useCallback(async () => {
    const confirmResult = await Swal.fire({
      title: "Chắc chắn muốn reset liệu?",
      text: "Danh sách chỉ thị sẽ được dựng lại theo BOM sản xuất hiện tại.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Vẫn reset",
      cancelButtonText: "Hủy",
    });
    if (!confirmResult.isConfirmed) return;

    checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], async () => {
      setIsMaterialActionLoading(true);
      setMaterialActionProgress(10);
      setMaterialActionLabel("Đang dựng lại vật liệu theo BOM sản xuất...");
      try {
        const res = await f_handleResetChiThiTable(
          selectedPlan,
          datadinhmuc as any,
          ycsxFilter.tempDM
        );
        setChiThiDataTable(res || []);
        selectedMaterialRowsRef.current = [];
        setMaterialActionProgress(100);
        Swal.fire("Thành công", "Đã reset vật liệu thành công", "success");
      } catch (err) {
        Swal.fire("Lỗi", "Không thể reset vật liệu", "error");
      } finally {
        setIsMaterialActionLoading(false);
      }
    });
  }, [datadinhmuc, selectedPlan, userData, ycsxFilter.tempDM]);

  // Thiết lập số dòng in
  const handleSetMaxLieu = useCallback(() => {
    localStorage.setItem("maxLieu", maxLieu.toString());
    Swal.fire("Thông báo", `Đã thiết lập max dòng in: ${maxLieu}`, "success");
  }, [maxLieu]);

  // Render các bản in
  const renderPrintYCSX = useCallback(() => {
    setYCSXListRender(renderYCSX([selectedPlan] as any));
    setSelection((prev: any) => ({ ...prev, tabycsx: true }));
  }, [selectedPlan]);

  const renderPrintBanVe = useCallback(() => {
    setYCSXListRender(renderBanVe([selectedPlan] as any));
    setSelection((prev: any) => ({ ...prev, tabbanve: true }));
  }, [selectedPlan]);

  const renderPrintChiThi = useCallback((plansToRender?: QLSXPLANDATA[]) => {
    const targets = plansToRender && plansToRender.length > 0 ? plansToRender : [selectedPlan];
    setChiThiListRender(renderChiThi(targets as any, myComponentRef));
    setShowChiThi(true);
  }, [selectedPlan]);

  const renderPrintChiThi2 = useCallback((plansToRender?: QLSXPLANDATA[]) => {
    const targets = plansToRender && plansToRender.length > 0 ? plansToRender : [selectedPlan];
    setChiThiListRender2(renderChiThi2(targets as any, myComponentRef));
    setShowChiThi2(true);
  }, [selectedPlan]);

  const renderPrintYCKT = useCallback(() => {
    setYCKTListRender((renderChiThi as any)([selectedPlan]));
    setShowYCKT(true);
  }, [selectedPlan]);

  // Set Pending / Closed cho các YCSX đã chọn
  const handleSetPendingYCSX = useCallback(
    async (rows: YCSXTableData[], pending_value: number) => {
      if (!rows || rows.length === 0) {
        Swal.fire("Thông báo", "Vui lòng chọn ít nhất 1 YCSX", "warning");
        return;
      }
      const actionText = pending_value === 1 ? "SET PENDING" : "SET CLOSED";
      Swal.fire({
        title: `Chắc chắn muốn ${actionText} ${rows.length} YCSX đã chọn?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const err_code = await f_setPendingYCSX(rows, pending_value);
            if (err_code === "0") {
              Swal.fire("Thông báo", `${actionText} thành công!`, "success");
              await handletraYCSX();
            } else {
              Swal.fire("Thông báo", "Có lỗi: " + err_code, "error");
            }
          } catch (err) {
            console.error("Lỗi set pending YCSX:", err);
            Swal.fire("Lỗi", "Không thể cập nhật trạng thái YCSX", "error");
          }
        }
      });
    },
    [handletraYCSX]
  );

  // In danh sách YCSX từ các dòng đã chọn
  const handlePrintYCSXList = useCallback((rows: YCSXTableData[]) => {
    if (!rows || rows.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để in", "warning");
      return;
    }
    setSelection((prev: any) => ({ ...prev, tabycsx: true }));
    setYCSXListRender(renderYCSX(rows as any));
  }, []);

  // In danh sách Bản Vẽ từ các dòng đã chọn
  const handlePrintBanVeList = useCallback((rows: YCSXTableData[]) => {
    if (!rows || rows.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để in bản vẽ", "warning");
      return;
    }
    setSelection((prev: any) => ({ ...prev, tabbanve: true }));
    setYCSXListRender(renderBanVe(rows as any));
  }, []);

  // Refresh chỉ thị vật tư của kế hoạch đang chọn
  const handleRefreshChiThi = useCallback(async () => {
    if (!selectedPlan || selectedPlan.PLAN_ID === "XXX") {
      Swal.fire("Thông báo", "Vui lòng chọn 1 kế hoạch", "warning");
      return;
    }
    try {
      const res = await f_handleGetChiThiTable(
        selectedPlan,
        datadinhmuc as any,
        ycsxFilter.tempDM
      );
      setChiThiDataTable(res || []);
      Swal.fire("Thông báo", "Đã làm mới dữ liệu chỉ thị vật tư", "success");
    } catch (err) {
      console.error("Lỗi refresh chỉ thị:", err);
      Swal.fire("Lỗi", "Không thể làm mới chỉ thị vật tư", "error");
    }
  }, [datadinhmuc, selectedPlan, ycsxFilter.tempDM]);

  // Tổng thời gian tích lũy trên máy (Total time)
  const totalMachineTime = useMemo(() => {
    if (currentMachinePlans.length === 0) return 0;
    return currentMachinePlans[currentMachinePlans.length - 1]?.ACC_TIME || 0;
  }, [currentMachinePlans]);

  // Lưu toàn bộ PLAN trên máy (Lưu PLAN)
  const handleUpdateBatchPlan = useCallback(async () => {
    checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], async () => {
      Swal.fire({
        title: "Lưu Plan",
        text: "Đang lưu toàn bộ plan trên máy, hãy chờ một chút...",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "OK",
        showConfirmButton: false,
      });
      try {
        const err_code = await f_updateBatchPlan(currentMachinePlans);
        await f_updateLossKT_ZTB_DM_HISTORY();
        if (err_code !== "0") {
          Swal.fire("Thông báo", "Có lỗi: " + err_code, "error");
        } else {
          Swal.fire("Thông báo", "Lưu PLAN thành công", "success");
          await refreshMachinePlans();
          await onRefreshData();
        }
      } catch (err) {
        console.error("Lỗi update batch plan:", err);
        Swal.fire("Lỗi", "Không thể lưu danh sách kế hoạch", "error");
      }
    });
  }, [currentMachinePlans, onRefreshData, refreshMachinePlans, userData]);

  // Lưu Data Định Mức (f_saveQLSX)
  const handleSaveDataDinhMuc = useCallback(async () => {
    if (!selectedPlan?.G_CODE || selectedPlan.G_CODE === "7C123") {
      Swal.fire("Thông báo", "Vui lòng chọn một kế hoạch để lưu định mức", "warning");
      return;
    }
    if (ycsxFilter.tempDM) {
      Swal.fire("Lỗi", "Đang bật ĐM tạm thời, không lưu được, hãy tắt ĐM tạm thời", "error");
      return;
    }
    checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], async () => {
      try {
        if (
          datadinhmuc.FACTORY === "NA" ||
          datadinhmuc.EQ1 === "NA" ||
          datadinhmuc.EQ1 === "NO" ||
          datadinhmuc.EQ2 === "" ||
          datadinhmuc.Setting1 === 0 ||
          datadinhmuc.UPH1 === 0 ||
          datadinhmuc.Step1 === 0 ||
          datadinhmuc.LOSS_SX1 === 0
        ) {
          Swal.fire("Thông báo", "Lưu thất bại, hãy nhập đủ thông tin", "error");
          return;
        }

        await f_insertDMYCSX({
          PROD_REQUEST_NO: selectedPlan.PROD_REQUEST_NO,
          G_CODE: selectedPlan.G_CODE,
          LOSS_SX1: datadinhmuc.LOSS_SX1,
          LOSS_SX2: datadinhmuc.LOSS_SX2,
          LOSS_SX3: datadinhmuc.LOSS_SX3,
          LOSS_SX4: datadinhmuc.LOSS_SX4,
          LOSS_SETTING1: datadinhmuc.LOSS_SETTING1,
          LOSS_SETTING2: datadinhmuc.LOSS_SETTING2,
          LOSS_SETTING3: datadinhmuc.LOSS_SETTING3,
          LOSS_SETTING4: datadinhmuc.LOSS_SETTING4,
          LOSS_KT: datadinhmuc.LOSS_KT,
        });

        const saved = await f_saveQLSX({
          G_CODE: selectedPlan?.G_CODE,
          FACTORY: datadinhmuc.FACTORY,
          EQ1: datadinhmuc.EQ1,
          EQ2: datadinhmuc.EQ2,
          EQ3: datadinhmuc.EQ3,
          EQ4: datadinhmuc.EQ4,
          Setting1: datadinhmuc.Setting1,
          Setting2: datadinhmuc.Setting2,
          Setting3: datadinhmuc.Setting3,
          Setting4: datadinhmuc.Setting4,
          UPH1: datadinhmuc.UPH1,
          UPH2: datadinhmuc.UPH2,
          UPH3: datadinhmuc.UPH3,
          UPH4: datadinhmuc.UPH4,
          Step1: datadinhmuc.Step1,
          Step2: datadinhmuc.Step2,
          Step3: datadinhmuc.Step3,
          Step4: datadinhmuc.Step4,
          LOSS_SX1: datadinhmuc.LOSS_SX1,
          LOSS_SX2: datadinhmuc.LOSS_SX2,
          LOSS_SX3: datadinhmuc.LOSS_SX3,
          LOSS_SX4: datadinhmuc.LOSS_SX4,
          LOSS_SETTING1: datadinhmuc.LOSS_SETTING1,
          LOSS_SETTING2: datadinhmuc.LOSS_SETTING2,
          LOSS_SETTING3: datadinhmuc.LOSS_SETTING3,
          LOSS_SETTING4: datadinhmuc.LOSS_SETTING4,
          LOSS_KT: datadinhmuc.LOSS_KT,
        });
        if (saved) {
          const notification: NotificationElement = {
            CTR_CD: "002",
            NOTI_ID: -1,
            NOTI_TYPE: "info",
            TITLE: "Update định mức sản xuất",
            CONTENT: `${getUserData()?.EMPL_NO} đã update định mức sản xuất của code: ${selectedPlan.G_NAME_KD || selectedPlan.G_CODE}`,
            SUBDEPTNAME: "SX,QLSX",
            MAINDEPTNAME: "SX,QLSX",
            INS_EMPL: getUserData()?.EMPL_NO || "ADMIN",
            INS_DATE: moment().format("YYYY-MM-DD"),
            UPD_EMPL: getUserData()?.EMPL_NO || "ADMIN",
            UPD_DATE: moment().format("YYYY-MM-DD"),
          };
          if (await f_insert_Notification_Data(notification)) {
            getSocket().emit("notification_panel", notification);
          }

          /*
           * FIX: Sau khi lưu ĐM thành công, bảng Kế hoạch (plandatatable) vẫn đang giữ
           * snapshot ĐM CŨ. Vì handleSelectPlan() đọc ĐM trực tiếp từ rowData nên khi
           * click lại vào dòng plan sẽ hiển thị lại định mức cũ, phải bấm "Refresh Plan"
           * (tải lại getqlsxplan2) mới thấy ĐM mới.
           * => Cập nhật ngay dòng plan đang chọn bằng ĐM vừa lưu và nạp lại dữ liệu plan
           *    để lần click kế tiếp luôn ra định mức mới.
           */
          setSelectedPlan((prev) => ({ ...prev, ...(datadinhmuc as any) }));
          await refreshMachinePlans();

          Swal.fire("Thông báo", "Lưu Định mức thành công", "success");
        } else {
          Swal.fire("Thông báo", "Lỗi lưu định mức", "error");
        }
      } catch (err) {
        console.error("Lỗi save định mức:", err);
        Swal.fire("Lỗi", "Không thể lưu định mức", "error");
      }
    });
  }, [datadinhmuc, refreshMachinePlans, selectedPlan, userData, ycsxFilter.tempDM]);

  // Áp dụng Định Mức Mặc Định (ĐM MĐ)
  const handleSetDMMD = useCallback(() => {
    if (getCompany() === "CMS" && getUserData()?.EMPL_NO !== "NHU1903") {
      Swal.fire("Thông báo", "Bạn không có quyền áp dụng định mức mặc định", "error");
      return;
    }
    if (selectedPlan.PLAN_ID === "XXX") {
      Swal.fire("Thông báo", "Chọn Plan trước", "error");
      return;
    }
    const dmmacdinhRaw = getSettingUPHUnitLoss(
      selectedPlan.PLAN_EQ,
      (selectedPlan as any).PROD_PRINT_TIMES ?? 0,
      selectedPlan.CAVITY ? ((selectedPlan.PLAN_QTY * (selectedPlan.PD ?? 0)) / selectedPlan.CAVITY) / 1000 : 0
    );
    const dmmacdinh = {
      ...dmmacdinhRaw,
      UPH: Math.round(
        dmmacdinhRaw?.unit === "MET"
          ? ((dmmacdinhRaw.UPH / (selectedPlan.PD || 1)) * (selectedPlan.CAVITY || 1)) * 1000
          : (dmmacdinhRaw?.UPH ?? 0) * (selectedPlan.CAVITY || 1)
      ),
      setting: dmmacdinhRaw?.setting ?? 0,
      unit: dmmacdinhRaw?.unit ?? "",
      loss: dmmacdinhRaw?.loss ?? 0,
      loss_setting: dmmacdinhRaw?.loss_setting ?? 0,
    };
    const prefix = selectedPlan.PLAN_EQ ? selectedPlan.PLAN_EQ.substring(0, 2) : "";
    setDataDinhMuc((prev) => ({
      ...prev,
      Setting1: prefix === prev.EQ1 ? dmmacdinh.setting : prev.Setting1,
      UPH1: prefix === prev.EQ1 ? dmmacdinh.UPH : prev.UPH1,
      LOSS_SX1: prefix === prev.EQ1 ? dmmacdinh.loss : prev.LOSS_SX1,
      LOSS_SETTING1: prefix === prev.EQ1 ? dmmacdinh.loss_setting : prev.LOSS_SETTING1,

      Setting2: prefix === prev.EQ2 ? dmmacdinh.setting : prev.Setting2,
      UPH2: prefix === prev.EQ2 ? dmmacdinh.UPH : prev.UPH2,
      LOSS_SX2: prefix === prev.EQ2 ? dmmacdinh.loss : prev.LOSS_SX2,
      LOSS_SETTING2: prefix === prev.EQ2 ? dmmacdinh.loss_setting : prev.LOSS_SETTING2,

      Setting3: prefix === prev.EQ3 ? dmmacdinh.setting : prev.Setting3,
      UPH3: prefix === prev.EQ3 ? dmmacdinh.UPH : prev.UPH3,
      LOSS_SX3: prefix === prev.EQ3 ? dmmacdinh.loss : prev.LOSS_SX3,
      LOSS_SETTING3: prefix === prev.EQ3 ? dmmacdinh.loss_setting : prev.LOSS_SETTING3,

      Setting4: prefix === prev.EQ4 ? dmmacdinh.setting : prev.Setting4,
      UPH4: prefix === prev.EQ4 ? dmmacdinh.UPH : prev.UPH4,
      LOSS_SX4: prefix === prev.EQ4 ? dmmacdinh.loss : prev.LOSS_SX4,
      LOSS_SETTING4: prefix === prev.EQ4 ? dmmacdinh.loss_setting : prev.LOSS_SETTING4,
    }));
    Swal.fire("Thông báo", "Đã nạp định mức mặc định theo dòng máy", "success");
  }, [selectedPlan]);

  const canSetDMMD = getCompany() !== "CMS" || getUserData()?.EMPL_NO === "NHU1903";

  return {
    selectedPlan,
    setSelectedPlan,
    resetPlanModal,
    handleSelectPlan,
    currentMachinePlans,
    setCurrentMachinePlans: setLocalPlans,
    refreshMachinePlans,
    isMachinePlansLoading: isMachinePlansLoading ?? false,
    datadinhmuc,
    setDataDinhMuc,
    recentDMData,
    machine_list,
    showYCSX,
    setShowYCSX,
    ycsxFilter,
    setYCSXFilter,
    ycsxDataTable,
    handletraYCSX,
    handleAddPlanFromYCSX,
    handleSaveSinglePlan,
    handleDeletePlan,
    handleMovePlan,
    handleStartPlan,
    handleFinishPlan,
    chithidatatable,
    setChiThiDataTable,
    handleSaveChiThiMaterial,
    handleResetChiThi,
    handleDangKyXuatLieu,
    handleDeleteChiThiLine,
    handleSelectedMaterialRowsChange,
    handleXuatDaoSample,
    handleXuatLieuSample,
    showChiThi,
    setShowChiThi,
    showChiThi2,
    setShowChiThi2,
    showKhoAo,
    setShowKhoAo,
    showYCKT,
    setShowYCKT,
    selection,
    setSelection,
    maxLieu,
    setMaxLieu,
    handleSetMaxLieu,
    handlePrint,
    ycsxprintref,
    chithilistrender,
    chithilistrender2,
    ycsxlistrender,
    ycktlistrender,
    renderPrintYCSX,
    renderPrintBanVe,
    renderPrintChiThi,
    renderPrintChiThi2,
    renderPrintYCKT,
    handleUpdateBatchPlan,
    handleSaveDataDinhMuc,
    handleSetDMMD,
    canSetDMMD,
    totalMachineTime,
    onRefreshData: refreshMachinePlans,
    handleSetPendingYCSX,
    handlePrintYCSXList,
    handlePrintBanVeList,
    handleRefreshChiThi,
    isDetailLoading,
    detailProgress,
    detailLoadingLabel,
    isMaterialActionLoading,
    materialActionProgress,
    materialActionLabel,
    isAddPlanLoading,
    addPlanProgress,
    addPlanLoadingLabel,
  };
};
