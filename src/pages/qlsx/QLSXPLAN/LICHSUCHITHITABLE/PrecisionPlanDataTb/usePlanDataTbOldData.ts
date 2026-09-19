import { useCallback, useEffect, useRef, useState, ReactElement } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { UserData } from "../../../../../api/GlobalInterface";
import { generalQuery, getCompany, getUserData } from "../../../../../api/Api";
import { checkBP } from "../../../../../api/services/permissionService";
import { useReactToPrint } from "react-to-print";
import { AgGridReact } from "ag-grid-react";
import {
  MACHINE_LIST,
  QLSXCHITHIDATA,
  QLSXPLANDATA,
} from "../../interfaces/khsxInterface";
import {
  f_deleteChiThiMaterialLine,
  f_getMachineListData,
  f_handle_movePlan,
  f_handle_xuatdao_sample,
  f_handle_xuatlieu_sample,
  f_handleDangKyXuatLieu,
  f_handleGetChiThiTable,
  f_handleResetChiThiTable,
  f_loadQLSXPLANDATA,
  f_saveChiThiMaterialTable,
  f_updateBatchPlan,
  f_updateLossKT_ZTB_DM_HISTORY,
  f_updatePlanOrder,
  renderChiThi,
  renderChiThi2,
} from "../../utils/khsxUtils";
import { renderBanVe2 } from "./planDataTbPrintRenderers";
import { defaultPlanData } from "./usePlanDataTbData";

export const usePlanDataTbOldData = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const myComponentRef = useRef<any>(null);
  const dataGridRef = useRef<any>(null);
  const datatbTotalRow = useRef(0);
  const gridRef = useRef<AgGridReact<QLSXPLANDATA>>(null);
  const gridMaterialRef = useRef<AgGridReact<QLSXCHITHIDATA>>(null);
  const ycsxprintref = useRef<any>(null);
  const clickedRow = useRef<any>(null);
  const planLoadRef = useRef<{ planId: string; promise: Promise<void> } | null>(null);
  const qlsxplandatafilter = useRef<QLSXPLANDATA[]>([]);
  const qlsxchithidatafilter = useRef<QLSXCHITHIDATA[]>([]);

  const [showQuickPlan, setShowQuickPlan] = useState(false);
  const [showkhoao, setShowKhoAo] = useState(false);
  const [maxLieu, setMaxLieu] = useState(12);
  const [chithidatatable, setChiThiDataTable] = useState<QLSXCHITHIDATA[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<QLSXPLANDATA>(defaultPlanData);
  const [showhideM, setShowHideM] = useState(false);
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const [showChiThi, setShowChiThi] = useState(false);
  const [showChiThi2, setShowChiThi2] = useState(false);
  const [showBV, setShowBV] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionProgress, setActionProgress] = useState(0);
  const [actionLoadingLabel, setActionLoadingLabel] = useState("Đang xử lý...");
  const [readyRender, setReadyRender] = useState(false);

  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [factory, setFactory] = useState("NM1");
  const [machine, setMachine] = useState("ALL");
  const [plandatatable, setPlanDataTable] = useState<QLSXPLANDATA[]>([]);

  const [ycsxlistrender, setYCSXListRender] = useState<ReactElement[]>();
  const [chithilistrender, setChiThiListRender] = useState<ReactElement[]>();
  const [chithilistrender2, setChiThiListRender2] = useState<ReactElement>();

  const [summarydata, setSummaryData] = useState<QLSXPLANDATA>({
    ...defaultPlanData,
    id: -1,
  });

  const handlePrint = useReactToPrint({
    content: () => ycsxprintref.current,
  });

  const getMachineList = async () => {
    setMachine_List(await f_getMachineListData());
  };

  const clearSelectedRows = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.deselectAll();
      qlsxplandatafilter.current = [];
    }
  }, []);

  const clearSelectedMaterialRows = useCallback(() => {
    if (gridMaterialRef.current?.api) {
      gridMaterialRef.current.api.deselectAll();
      qlsxchithidatafilter.current = [];
    }
  }, []);

  const onSelectionChanged = useCallback(() => {
    if (gridRef.current?.api) {
      const selectedrow = gridRef.current.api.getSelectedRows();
      qlsxplandatafilter.current = selectedrow;
    }
  }, []);

  const selectMaterialRow = async () => {
    const api = gridMaterialRef.current?.api;
    api?.forEachNode((node: any) => {
      if (node.data?.M_STOCK && node.data.M_STOCK > 0) {
        node.setSelected(true);
      } else {
        node.setSelected(false);
      }
    });
  };

  const loadQLSXPlan = async (plan_date: string) => {
    setisLoading(true);
    setReadyRender(false);
    let loadeddata: QLSXPLANDATA[] = await f_loadQLSXPLANDATA(plan_date, machine, factory);
    let temp_plan_data: QLSXPLANDATA = {
      ...defaultPlanData,
      id: -1,
      PLAN_QTY: 0,
      KETQUASX: 0,
      ACHIVEMENT_RATE: 0,
    };
    for (let i = 0; i < loadeddata.length; i++) {
      temp_plan_data.PLAN_QTY += loadeddata[i].PLAN_QTY;
      temp_plan_data.KETQUASX += loadeddata[i].KETQUASX;
    }
    temp_plan_data.ACHIVEMENT_RATE =
      temp_plan_data.PLAN_QTY > 0 ? (temp_plan_data.KETQUASX / temp_plan_data.PLAN_QTY) * 100 : 0;

    setSummaryData(temp_plan_data);
    setPlanDataTable(loadeddata);
    datatbTotalRow.current = loadeddata.length;
    setReadyRender(true);
    setisLoading(false);
    clearSelectedRows();
    if (!showhideM) {
      Swal.fire("Thông báo", "Đã load: " + loadeddata.length + " dòng", "success");
    }
    f_updatePlanOrder(fromdate);
  };

  const handle_movePlan = async () => {
    let err_code: string = await f_handle_movePlan(qlsxplandatafilter.current, todate);
    if (err_code !== "0") {
      Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
    } else {
      Swal.fire("Thông báo", "Move plan thành công", "success");
    }
    loadQLSXPlan(fromdate);
  };

  const handleConfirmMovePlan = () => {
    if (!qlsxplandatafilter.current || qlsxplandatafilter.current.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để chuyển ngày", "warning");
      return;
    }
    Swal.fire({
      title: "Chắc chắn muốn chuyển ngày cho plan đã chọn ?",
      text: "Sẽ bắt đầu chuyển ngày đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn chuyển!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành chuyển ngày PLAN", "Đang chuyển ngày plan", "info");
        checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], handle_movePlan);
      }
    });
  };

  const handle_DeletePlan = async () => {
    Swal.fire({
      title: "Xóa Plan",
      text: "Đang xóa plan, hãy chờ một chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    let selectedPlanTable: QLSXPLANDATA[] = qlsxplandatafilter.current;
    let err_code: string = "0";
    for (let i = 0; i < selectedPlanTable.length; i++) {
      let isOnOutKhoAo: boolean = false;
      await generalQuery("checkPLANID_OUT_KHO_AO", {
        PLAN_ID: selectedPlanTable[i].PLAN_ID,
      })
        .then((response: any) => {
          if (response.data?.tk_status !== "NG") {
            isOnOutKhoAo = true;
          }
        })
        .catch((error: any) => {
          console.log(error);
        });

      if (
        selectedPlanTable[i].XUATDAOFILM !== "V" &&
        selectedPlanTable[i].MAIN_MATERIAL !== "V" &&
        selectedPlanTable[i].INT_TEM !== "V" &&
        selectedPlanTable[i].CHOTBC !== "V" &&
        !isOnOutKhoAo
      ) {
        await generalQuery("deletePlanQLSX", {
          PLAN_ID: selectedPlanTable[i].PLAN_ID,
        }).catch((error: any) => console.log(error));
      } else {
        err_code += `${selectedPlanTable[i].PLAN_ID}: Đã xuất dao, xuất liệu hoặc in tem hoặc chốt báo cáo, ko xóa được ! `;
      }
    }
    if (err_code !== "0") {
      Swal.fire("Thông báo", "Có lỗi !" + err_code, "error");
    } else {
      Swal.fire("Thông báo", "Xóa PLAN thành công", "success");
      loadQLSXPlan(fromdate);
    }
  };

  const handleConfirmDeletePlan = () => {
    if (!qlsxplandatafilter.current || qlsxplandatafilter.current.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để xóa", "warning");
      return;
    }
    Swal.fire({
      title: "Chắc chắn muốn xóa plan đã chọn ?",
      text: "Sẽ bắt đầu xóa plan đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], handle_DeletePlan);
      }
    });
  };

  const handle_UpdatePlan = async () => {
    Swal.fire({
      title: "Lưu Plan",
      text: "Đang lưu plan, hãy chờ một chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    setActionLoading(true);
    setActionProgress(15);
    setActionLoadingLabel("Đang lưu thay đổi PLAN...");
      try {
        let err_code: string = await f_updateBatchPlan(qlsxplandatafilter.current);
        setActionProgress(65);
        setActionLoadingLabel("Đang cập nhật lịch sử định mức...");
        await f_updateLossKT_ZTB_DM_HISTORY();
        if (err_code !== "0") {
          Swal.fire("Thông báo", "Có lỗi !" + err_code, "error");
        } else {
          setActionProgress(85);
          setActionLoadingLabel("Đang tải lại danh sách PLAN...");
          await loadQLSXPlan(fromdate);
          setActionProgress(100);
          Swal.fire("Thông báo", "Lưu PLAN thành công", "success");
        }
      } catch (error) {
        console.error("Lỗi lưu PLAN:", error);
        Swal.fire("Lỗi", "Không thể lưu PLAN", "error");
      } finally {
        setActionLoading(false);
    }
  };

  const handleConfirmUpdatePlan = useCallback(() => {
    checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], handle_UpdatePlan);
  }, [userData, handle_UpdatePlan]);

  const handle_DeleteLineCHITHI = async () => {
    let kq = await f_deleteChiThiMaterialLine(qlsxchithidatafilter.current, chithidatatable);
    setChiThiDataTable(kq);
  };

  const handleConfirmDeleteLieu = () => {
    Swal.fire({
      title: "Chắc chắn muốn xóa Liệu đã chọn ?",
      text: "Sẽ bắt đầu xóa Liệu đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Xóa Liệu", "Đang xóa Liệu", "success");
        handle_DeleteLineCHITHI();
      }
    });
  };

  const handleConfirmRESETLIEU = () => {
    Swal.fire({
      title: "Chắc chắn muốn RESET liệu ?",
      text: "Sẽ bắt đầu RESET liệu",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn RESET liệu!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành RESET liệu", "Đang RESET liệu", "success");
        setChiThiDataTable(await f_handleResetChiThiTable(selectedPlan));
      }
    });
  };

  const hanlde_SaveChiThi = async () => {
    let err_code: string = await f_saveChiThiMaterialTable(
      selectedPlan,
      getCompany() === "CMS" ? qlsxchithidatafilter.current : chithidatatable
    );
    if (err_code === "1") {
      Swal.fire(
        "Thông báo",
        "Phải chỉ định liệu quản lý, k để sót size nào, và chỉ chọn 1 loại liệu làm liệu chính, và nhập liệu quản lý chỉ 1 hoặc 0",
        "error"
      );
    } else if (err_code !== "0") {
      Swal.fire("Thông báo", "Có lỗi !" + err_code, "error");
    } else {
      /* Swal.fire("Thông báo", "Lưu Chỉ thị thành công", "success"); */
    }
  };

  const handleDangKyXuatLieu = async () => {
    let err_code: string = await f_handleDangKyXuatLieu(
      selectedPlan,
      factory,
      getCompany() === "CMS" ? qlsxchithidatafilter.current : chithidatatable
    );
    if (err_code === "0") {
      Swal.fire("Thông báo", "Đăng ký xuất liệu thành công!", "success");
    } else {
      Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
    }
    await loadQLSXPlan(fromdate);
  };

  const handleConfirmDKXL = () => {
    Swal.fire({
      title: "Chắc chắn muốn Đăng ký xuất liệu ?",
      text: "Sẽ bắt đầu ĐK liệu",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn ĐK liệu!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (selectedPlan && selectedPlan.PLAN_ID !== "XXX") {
          /* Swal.fire({
            title: "Đang lưu chỉ thị",
            text: "Đang lưu chỉ thị, hãy chờ cho tới khi hoàn thành",
            icon: "info",
            showCancelButton: false,
            allowOutsideClick: false,
            showConfirmButton: false,
          }); */
          setActionLoading(true);
          setActionProgress(15);
          setActionLoadingLabel("Đang lưu chỉ thị vật liệu...");
          try {
            await hanlde_SaveChiThi();
            /* Swal.fire({
              title: "Đang đăng ký xuất liệu",
              text: "Đang đăng ký xuất liệu, hãy chờ cho tới khi hoàn thành",
              icon: "info",
              showCancelButton: false,
              allowOutsideClick: false,
              showConfirmButton: false,
            }); */
            setActionProgress(55);
            setActionLoadingLabel("Đang đăng ký xuất kho vật liệu...");
            await handleDangKyXuatLieu();

            clearSelectedMaterialRows();
            setActionProgress(80);
            setActionLoadingLabel("Đang tải lại chỉ thị và PLAN...");
            setChiThiDataTable(await f_handleGetChiThiTable(selectedPlan));
            setPlanDataTable(await f_loadQLSXPLANDATA(fromdate, machine, factory));
            setActionProgress(100);
          } catch (error) {
            console.error("Lỗi đăng ký xuất liệu:", error);
            Swal.fire("Lỗi", "Không thể đăng ký xuất liệu", "error");
          } finally {
            setActionLoading(false);
          }
        } else {
          Swal.fire("Thông báo", "Chọn ít nhất 1 chỉ thị để đăng ký xuất liệu", "error");
        }
      }
    });
  };

  const handle_xuatdao_sample = async () => {
    let err_code: string = await f_handle_xuatdao_sample(selectedPlan);
    if (err_code === "0") {
      Swal.fire("Thông báo", "Xuất dao ảo thành công", "success");
    } else {
      Swal.fire("Thông báo", err_code, "error");
    }
  };

  const handle_xuatlieu_sample = async () => {
    let err_code: string = await f_handle_xuatlieu_sample(selectedPlan);
    if (err_code === "0") {
      Swal.fire("Thông báo", "Xuất liệu ảo thành công", "success");
    } else {
      Swal.fire("Thông báo", err_code, "error");
    }
  };

  const handleSelectRowPlan = async (plan: QLSXPLANDATA) => {
    if (planLoadRef.current?.planId === plan.PLAN_ID) {
      return planLoadRef.current.promise;
    }

    clickedRow.current = plan;
    setSelectedPlan(plan);
    setChiThiDataTable([]);
    const loadPromise = (async () => {
      setChiThiDataTable(await f_handleGetChiThiTable(plan));
      clearSelectedMaterialRows();
    })();

    planLoadRef.current = { planId: plan.PLAN_ID, promise: loadPromise };
    try {
      await loadPromise;
    } finally {
      if (planLoadRef.current?.promise === loadPromise) {
        planLoadRef.current = null;
      }
    }
  };

  const handleOpenDangKyLieu = async (plan?: QLSXPLANDATA) => {
    const targetPlan = plan || selectedPlan;
    setShowHideM(true);
    if (targetPlan && targetPlan.PLAN_ID !== "XXX") {
      void handleSelectRowPlan(targetPlan);
    }
  };

  const handlePrintChiThi = async () => {
    if (qlsxplandatafilter.current.length > 0) {
      if (userData?.EMPL_NO !== "NHU1903") {
        checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], async () => {
          await handle_UpdatePlan();
          setShowChiThi(true);
          setChiThiListRender(renderChiThi(qlsxplandatafilter.current, myComponentRef));
        });
      } else {
        setShowChiThi(true);
        setChiThiListRender(renderChiThi(qlsxplandatafilter.current, myComponentRef));
      }
    } else {
      setShowChiThi(false);
      Swal.fire("Thông báo", "Chọn ít nhất 1 Plan để in", "error");
    }
  };

  const handlePrintChiThiCombo = async () => {
    const selected = qlsxplandatafilter.current;
    if (selected && selected.length > 0) {
      const ycsx_number = [...new Set(selected.map((e) => e.PROD_REQUEST_NO))].length;
      if (
        selected[0].FACTORY === null ||
        selected[0].EQ1 === null ||
        selected[0].EQ2 === null ||
        selected[0].Setting1 === null ||
        selected[0].Setting2 === null ||
        selected[0].UPH1 === null ||
        selected[0].UPH2 === null ||
        selected[0].Step1 === null ||
        selected[0].LOSS_SX1 === null ||
        selected[0].LOSS_SX2 === null ||
        selected[0].LOSS_SETTING1 === null ||
        selected[0].LOSS_SETTING2 === null
      ) {
        Swal.fire("Thông báo", "Nhập data định mức trước khi chỉ thị", "error");
        return;
      }

      if (ycsx_number === 1) {
        const chithimain = selected.filter((el) => el.STEP === 0);
        if (chithimain.length === 1) {
          if (userData?.EMPL_NO !== "NHU1903") {
            await handle_UpdatePlan();
          }
          setShowChiThi2(true);
          setChiThiListRender2(renderChiThi2(selected, myComponentRef));
        } else if (chithimain.length === 0) {
          Swal.fire("Thông báo", "Chưa có chỉ thị chính (B0)", "error");
        } else {
          Swal.fire("Thông báo", "Chỉ được chọn 1 chỉ thị B0", "error");
        }
      } else {
        Swal.fire("Thông báo", "Chỉ được chọn các chỉ thị của 1 YCSX", "error");
      }
    } else {
      setShowChiThi2(false);
      Swal.fire("Thông báo", "Chọn ít nhất 1 Plan để in", "error");
    }
  };

  const handlePrintBanVe = () => {
    if (qlsxplandatafilter.current.length > 0) {
      setShowBV(true);
      setYCSXListRender(renderBanVe2(qlsxplandatafilter.current));
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để in", "error");
    }
  };

  useEffect(() => {
    getMachineList();
  }, []);

  return {
    userData,
    myComponentRef,
    dataGridRef,
    datatbTotalRow,
    gridRef,
    gridMaterialRef,
    ycsxprintref,
    clickedRow,
    qlsxplandatafilter,
    qlsxchithidatafilter,
    showQuickPlan,
    setShowQuickPlan,
    showkhoao,
    setShowKhoAo,
    maxLieu,
    setMaxLieu,
    chithidatatable,
    setChiThiDataTable,
    selectedPlan,
    setSelectedPlan,
    showhideM,
    setShowHideM,
    machine_list,
    showChiThi,
    setShowChiThi,
    showChiThi2,
    setShowChiThi2,
    showBV,
    setShowBV,
    isLoading,
    actionLoading,
    actionProgress,
    actionLoadingLabel,
    readyRender,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    factory,
    setFactory,
    machine,
    setMachine,
    plandatatable,
    summarydata,
    ycsxlistrender,
    chithilistrender,
    chithilistrender2,
    setYCSXListRender,
    setChiThiListRender,
    setChiThiListRender2,
    handlePrint,
    clearSelectedRows,
    clearSelectedMaterialRows,
    onSelectionChanged,
    selectMaterialRow,
    loadQLSXPlan,
    handleConfirmMovePlan,
    handleConfirmDeletePlan,
    handle_UpdatePlan,
    handleConfirmUpdatePlan,
    handleConfirmDeleteLieu,
    handleConfirmRESETLIEU,
    hanlde_SaveChiThi,
    handleDangKyXuatLieu,
    handleConfirmDKXL,
    handle_xuatdao_sample,
    handle_xuatlieu_sample,
    handleSelectRowPlan,
    handleOpenDangKyLieu,
    handlePrintChiThi,
    handlePrintChiThiCombo,
    handlePrintBanVe,
  };
};
