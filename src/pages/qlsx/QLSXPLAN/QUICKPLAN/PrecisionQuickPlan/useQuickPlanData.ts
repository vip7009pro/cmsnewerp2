import { useEffect, useRef, useState, useCallback } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { RootState } from "../../../../../redux/store";
import { UserData, WEB_SETTING_DATA } from "../../../../../api/GlobalInterface";
import { generalQuery, getAuditMode, getGlobalSetting, uploadQuery } from "../../../../../api/Api";
import { DINHMUC_QSLX, MACHINE_LIST, QLSXPLANDATA, RecentDM } from "../../interfaces/khsxInterface";
import { YCSXTableData } from "../../../../kinhdoanh/interfaces/kdInterface";
import { f_getMachineListData, f_getRecentDMData, f_saveQLSX, PLAN_ID_ARRAY } from "../../utils/khsxUtils";
import { f_insertDMYCSX, f_updateDMSX_LOSS_KT } from "../../../../kinhdoanh/utils/kdUtils";
import { checkBP } from "../../../../../api/services/permissionService";
import {
  renderYCKT,
  renderChiThi,
  renderYCSX,
  renderBanVe,
} from "./quickPlanPrintRenderers";

export const useQuickPlanData = () => {
  const qtyFactor: number =
    parseInt(
      getGlobalSetting()?.filter(
        (ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "DAILY_TIME"
      )[0]?.CURRENT_VALUE ?? "840"
    ) / 2 / 60;

  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  // States
  const [recentDMData, setRecentDMData] = useState<RecentDM[]>([]);
  const [selection, setSelection] = useState<any>({
    tab1: true,
    tab2: false,
    tab3: false,
    tabycsx: false,
    tabbanve: false,
  });

  const [datadinhmuc, setDataDinhMuc] = useState<DINHMUC_QSLX>({
    FACTORY: "NM1",
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
  });

  const [plandatatable, setPlanDataTable] = useState<QLSXPLANDATA[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [empl_name, setEmpl_Name] = useState("");
  const [cust_name, setCust_Name] = useState("");
  const [prod_type, setProdType] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [materialYES, setMaterialYES] = useState(false);
  const [phanloai, setPhanLoai] = useState("00");
  const [material, setMaterial] = useState("");
  const [ycsxdatatable, setYcsxDataTable] = useState<Array<YCSXTableData>>([]);
  const [ycsxdatatablefilter, setYcsxDataTableFilter] = useState<Array<YCSXTableData>>([]);
  const qlsxplandatafilter = useRef<Array<QLSXPLANDATA>>([]);
  const [ycsxpendingcheck, setYCSXPendingCheck] = useState(false);
  const [inspectInputcheck, setInspectInputCheck] = useState(false);
  const [ycsxlistrender, setYCSXListRender] = useState<any[]>();
  const [chithilistrender, setChiThiListRender] = useState<any[]>();
  const [ycktlistrender, setYCKTListRender] = useState<any[]>();
  const [selectedCode, setSelectedCode] = useState("CODE: ");
  const selectedPlan = useRef<QLSXPLANDATA>();
  const [showChiThi, setShowChiThi] = useState(false);
  const [showYCKT, setShowYCKT] = useState(false);
  const [temp_id, setTemID] = useState(0);
  const [showhideycsxtable, setShowHideYCSXTable] = useState(1);
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);

  const ycsxprintref = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => ycsxprintref.current,
  });

  const getMachineList = async () => {
    setMachine_List(await f_getMachineListData());
  };

  // Initial loading from localStorage & API
  useEffect(() => {
    let temp_table: any = [];
    let temp_max: number = 0;
    let temp_string: any = localStorage.getItem("temp_plan_table")?.toString();
    let temp_string2: any = localStorage.getItem("temp_plan_table_max_id")?.toString();

    if (temp_string !== undefined && temp_string2 !== undefined && temp_string !== null && temp_string2 !== null) {
      try {
        temp_max = parseInt(temp_string2);
        temp_table = JSON.parse(temp_string);
        setPlanDataTable(temp_table);
        setTemID(temp_max);
      } catch (e) {
        console.error("Failed to parse temp_plan_table", e);
      }
    } else {
      setPlanDataTable([]);
      setTemID(0);
    }
    getMachineList();
  }, []);

  // Tra cứu YCSX
  const handletraYCSX = () => {
    setisLoading(true);
    generalQuery("traYCSXDataFull_QLSX", {
      alltime: alltime,
      start_date: fromdate,
      end_date: todate,
      cust_name: cust_name,
      codeCMS: codeCMS,
      codeKD: codeKD,
      prod_type: prod_type,
      empl_name: empl_name,
      phanloai: phanloai,
      ycsx_pending: ycsxpendingcheck,
      inspect_inputcheck: inspectInputcheck,
      prod_request_no: prodrequestno,
      material: material,
      material_yes: materialYES,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: YCSXTableData[] = response.data.data.map(
            (element: YCSXTableData) => {
              let temp_TCD1: number = element.TON_CD1 === null ? 0 : element.TON_CD1;
              let temp_TCD2: number = element.TON_CD2 === null ? 0 : element.TON_CD2;
              let temp_TCD3: number = element.TON_CD3 === null ? 0 : element.TON_CD3;
              let temp_TCD4: number = element.TON_CD4 === null ? 0 : element.TON_CD4;
              if (temp_TCD1 < 0) {
                temp_TCD2 = temp_TCD2 - temp_TCD1;
              }
              if (temp_TCD2 < 0) {
                temp_TCD3 = temp_TCD3 - temp_TCD2;
              }
              if (temp_TCD3 < 0) {
                temp_TCD4 = temp_TCD4 - temp_TCD3;
              }
              return {
                ...element,
                G_NAME:
                  getAuditMode() == 0
                    ? element?.G_NAME
                    : element?.G_NAME?.search("CNDB") == -1
                    ? element?.G_NAME
                    : "TEM_NOI_BO",
                G_NAME_KD:
                  getAuditMode() == 0
                    ? element?.G_NAME_KD
                    : element?.G_NAME?.search("CNDB") == -1
                    ? element?.G_NAME_KD
                    : "TEM_NOI_BO",
                PO_TDYCSX:
                  element.PO_TDYCSX === undefined || element.PO_TDYCSX === null
                    ? 0
                    : element.PO_TDYCSX,
                TOTAL_TKHO_TDYCSX:
                  element.TOTAL_TKHO_TDYCSX === undefined ||
                  element.TOTAL_TKHO_TDYCSX === null
                    ? 0
                    : element.TOTAL_TKHO_TDYCSX,
                TKHO_TDYCSX:
                  element.TKHO_TDYCSX === undefined || element.TKHO_TDYCSX === null
                    ? 0
                    : element.TKHO_TDYCSX,
                BTP_TDYCSX:
                  element.BTP_TDYCSX === undefined || element.BTP_TDYCSX === null
                    ? 0
                    : element.BTP_TDYCSX,
                CK_TDYCSX:
                  element.CK_TDYCSX === undefined || element.CK_TDYCSX === null
                    ? 0
                    : element.CK_TDYCSX,
                BLOCK_TDYCSX:
                  element.BLOCK_TDYCSX === undefined ||
                  element.BLOCK_TDYCSX === null
                    ? 0
                    : element.BLOCK_TDYCSX,
                FCST_TDYCSX:
                  element.FCST_TDYCSX === undefined ||
                  element.FCST_TDYCSX === null
                    ? 0
                    : element.FCST_TDYCSX,
                W1: element.W1 === undefined || element.W1 === null ? 0 : element.W1,
                W2: element.W2 === undefined || element.W2 === null ? 0 : element.W2,
                W3: element.W3 === undefined || element.W3 === null ? 0 : element.W3,
                W4: element.W4 === undefined || element.W4 === null ? 0 : element.W4,
                W5: element.W5 === undefined || element.W5 === null ? 0 : element.W5,
                W6: element.W6 === undefined || element.W6 === null ? 0 : element.W6,
                W7: element.W7 === undefined || element.W7 === null ? 0 : element.W7,
                W8: element.W8 === undefined || element.W8 === null ? 0 : element.W8,
                PROD_REQUEST_QTY:
                  element.PROD_REQUEST_QTY === undefined ||
                  element.PROD_REQUEST_QTY === null
                    ? 0
                    : element.PROD_REQUEST_QTY,
                CD1: element.CD1 === null ? 0 : element.CD1,
                CD2: element.CD2 === null ? 0 : element.CD2,
                CD3: element.CD3 === null ? 0 : element.CD3,
                CD4: element.CD4 === null ? 0 : element.CD4,
                TON_CD1: temp_TCD1,
                TON_CD2: temp_TCD2,
                TON_CD3: temp_TCD3,
                TON_CD4: temp_TCD4,
              };
            }
          );
          setYcsxDataTable(loadeddata);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success"
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setisLoading(false);
      });
  };

  const handleSearchCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handletraYCSX();
    }
  };

  const setPendingYCSX = async (pending_value: number) => {
    if (ycsxdatatablefilter.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < ycsxdatatablefilter.length; i++) {
        await generalQuery("setpending_ycsx", {
          PROD_REQUEST_NO: ycsxdatatablefilter[i].PROD_REQUEST_NO,
          YCSX_PENDING: pending_value,
        })
          .then((response) => {
            if (response.data.tk_status === "NG") {
              err_code = true;
            }
          })
          .catch((error) => {
            console.error(error);
            err_code = true;
          });
      }
      if (!err_code) {
        Swal.fire(
          "Thông báo",
          "SET YCSX thành công (chỉ PO của người đăng nhập)!",
          "success"
        );
      } else {
        Swal.fire("Thông báo", "Có lỗi SQL: ", "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để SET !", "error");
    }
  };

  const handleConfirmSetPendingYCSX = () => {
    Swal.fire({
      title: "Chắc chắn muốn SET PENDING YCSX đã chọn ?",
      text: "Sẽ bắt đầu SET PENDING YCSX đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành SET PENDING", "Đang SET PENDING YCSX hàng loạt", "success");
        setPendingYCSX(1);
      }
    });
  };

  const handleConfirmSetClosedYCSX = () => {
    Swal.fire({
      title: "Chắc chắn muốn SET CLOSED YCSX đã chọn ?",
      text: "Sẽ bắt đầu SET CLOSED YCSX đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành SET CLOSED", "Đang SET CLOSED YCSX hàng loạt", "success");
        setPendingYCSX(0);
      }
    });
  };

  const handleYCSXSelectionforUpdate = (ids: GridRowSelectionModel) => {
    const selectedID = new Set(ids as any);
    let datafilter = ycsxdatatable.filter((element: any) =>
      selectedID.has(element.PROD_REQUEST_NO)
    );
    if (datafilter.length > 0) {
      setYcsxDataTableFilter(datafilter);
    } else {
      setYcsxDataTableFilter([]);
    }
  };

  const handle_DeleteLinePLAN = async () => {
    if (qlsxplandatafilter.current.length > 0) {
      let datafilter = [...plandatatable];
      for (let i = 0; i < qlsxplandatafilter.current.length; i++) {
        for (let j = 0; j < datafilter.length; j++) {
          if (qlsxplandatafilter.current[i].id === datafilter[j].id) {
            let prev_length: number = datafilter.length;
            datafilter.splice(j, 1);
            let len: number = datafilter.length - 1;
            if (prev_length === 1) {
              setTemID(0);
              localStorage.setItem("temp_plan_table_max_id", "0");
            } else {
              setTemID(datafilter[len].id);
              localStorage.setItem("temp_plan_table_max_id", datafilter[len].id.toString());
            }
            setPlanDataTable(datafilter);
            localStorage.setItem("temp_plan_table", JSON.stringify(datafilter));
          }
        }
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất một dòng để xóa", "error");
    }
  };

  const handle_DeleteCompletedPLAN = (datafilter: QLSXPLANDATA[], PLAN_ID: string) => {
    if (qlsxplandatafilter.current.length > 0) {
      for (let j = 0; j < datafilter.length; j++) {
        if (PLAN_ID === datafilter[j].PLAN_ID) {
          let prev_length: number = datafilter.length;
          datafilter.splice(j, 1);
          let len: number = datafilter.length - 1;
          if (prev_length === 1) {
            setTemID(0);
            localStorage.setItem("temp_plan_table_max_id", "0");
          } else {
            setTemID(datafilter[len].id);
            localStorage.setItem("temp_plan_table_max_id", datafilter[len].id.toString());
          }
          localStorage.setItem("temp_plan_table", JSON.stringify(datafilter));
        }
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất một dòng để xóa", "error");
    }
  };

  const handleConfirmDeletePlan = () => {
    Swal.fire({
      title: "Chắc chắn muốn xóa PLan đã chọn ?",
      text: "Sẽ bắt đầu xóa Plan đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Xóa Plan", "Đang xóa Plan", "success");
        handle_DeleteLinePLAN();
      }
    });
  };

  const getNextPLAN_ID = async (
    PROD_REQUEST_NO: string,
    plan_row: QLSXPLANDATA
  ) => {
    let next_plan_id: string = PROD_REQUEST_NO;
    let next_plan_order: number = 1;
    await generalQuery("getLastestPLAN_ID", {
      PROD_REQUEST_NO: PROD_REQUEST_NO,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let old_plan_id: string = response.data.data[0].PLAN_ID;
          if (old_plan_id.substring(7, 8) === "Z") {
            if (old_plan_id.substring(3, 4) === "0") {
              next_plan_id =
                old_plan_id.substring(0, 3) + "A" + old_plan_id.substring(4, 7) + "A";
            } else {
              next_plan_id =
                old_plan_id.substring(0, 3) +
                PLAN_ID_ARRAY[PLAN_ID_ARRAY.indexOf(old_plan_id.substring(3, 4)) + 1] +
                old_plan_id.substring(4, 7) +
                "A";
            }
          } else {
            next_plan_id =
              old_plan_id.substring(0, 7) +
              PLAN_ID_ARRAY[PLAN_ID_ARRAY.indexOf(old_plan_id.substring(7, 8)) + 1];
          }
        } else {
          next_plan_id = PROD_REQUEST_NO + "A";
        }
      })
      .catch((error) => {
        console.error(error);
      });

    await generalQuery("getLastestPLANORDER", {
      PLAN_DATE: plan_row.PLAN_DATE,
      PLAN_EQ: plan_row.PLAN_EQ,
      PLAN_FACTORY: plan_row.PLAN_FACTORY,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          next_plan_order = response.data.data[0].PLAN_ORDER + 1;
        } else {
          next_plan_order = 1;
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return { NEXT_PLAN_ID: next_plan_id, NEXT_PLAN_ORDER: next_plan_order };
  };

  const handle_AddPlan = async () => {
    let temp_: number = temp_id;
    temp_++;
    setTemID(temp_);
    localStorage.setItem("temp_plan_table_max_id", temp_.toString());
    if (ycsxdatatablefilter.length >= 1) {
      let newPlans: QLSXPLANDATA[] = [...plandatatable];
      for (let i = 0; i < ycsxdatatablefilter.length; i++) {
        let temp_add_plan: QLSXPLANDATA = {
          id: temp_id + 1 + i,
          PLAN_ID: "PL" + (temp_id + 1 + i),
          PLAN_DATE: moment().format("YYYY-MM-DD"),
          PROD_REQUEST_NO: ycsxdatatablefilter[i].PROD_REQUEST_NO,
          PLAN_QTY: 0,
          PLAN_EQ: "",
          PLAN_FACTORY: userData?.FACTORY_CODE === 1 ? "NM1" : "NM2",
          PLAN_LEADTIME: 0,
          INS_EMPL: "",
          INS_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
          UPD_EMPL: "",
          UPD_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
          G_CODE: ycsxdatatablefilter[i].G_CODE,
          G_NAME: ycsxdatatablefilter[i].G_NAME,
          G_NAME_KD: ycsxdatatablefilter[i].G_NAME,
          PROD_REQUEST_DATE: ycsxdatatablefilter[i].PROD_REQUEST_DATE,
          PROD_REQUEST_QTY: ycsxdatatablefilter[i].PROD_REQUEST_QTY,
          STEP: 1,
          PLAN_ORDER: "1",
          PROCESS_NUMBER: 1,
          KETQUASX: 0,
          KQ_SX_TAM: 0,
          CD1: ycsxdatatablefilter[i].CD1,
          CD2: ycsxdatatablefilter[i].CD2,
          CD3: ycsxdatatablefilter[i].CD3,
          CD4: ycsxdatatablefilter[i].CD4,
          TON_CD1: ycsxdatatablefilter[i].TON_CD1,
          TON_CD2: ycsxdatatablefilter[i].TON_CD2,
          TON_CD3: ycsxdatatablefilter[i].TON_CD3,
          TON_CD4: ycsxdatatablefilter[i].TON_CD4,
          FACTORY: userData?.FACTORY_CODE === 1 ? "NM1" : "NM2",
          EQ1: ycsxdatatablefilter[i].EQ1,
          EQ2: ycsxdatatablefilter[i].EQ2,
          EQ3: ycsxdatatablefilter[i].EQ3,
          EQ4: ycsxdatatablefilter[i].EQ4,
          Setting1: ycsxdatatablefilter[i].Setting1,
          Setting2: ycsxdatatablefilter[i].Setting2,
          Setting3: ycsxdatatablefilter[i].Setting3,
          Setting4: ycsxdatatablefilter[i].Setting4,
          UPH1: ycsxdatatablefilter[i].UPH1,
          UPH2: ycsxdatatablefilter[i].UPH2,
          UPH3: ycsxdatatablefilter[i].UPH3,
          UPH4: ycsxdatatablefilter[i].UPH4,
          Step1: ycsxdatatablefilter[i].Step1,
          Step2: ycsxdatatablefilter[i].Step2,
          Step3: ycsxdatatablefilter[i].Step3,
          Step4: ycsxdatatablefilter[i].Step4,
          LOSS_SX1: ycsxdatatablefilter[i].LOSS_SX1,
          LOSS_SX2: ycsxdatatablefilter[i].LOSS_SX2,
          LOSS_SX3: ycsxdatatablefilter[i].LOSS_SX3,
          LOSS_SX4: ycsxdatatablefilter[i].LOSS_SX4,
          LOSS_SETTING1: ycsxdatatablefilter[i].LOSS_SETTING1,
          LOSS_SETTING2: ycsxdatatablefilter[i].LOSS_SETTING2,
          LOSS_SETTING3: ycsxdatatablefilter[i].LOSS_SETTING3,
          LOSS_SETTING4: ycsxdatatablefilter[i].LOSS_SETTING4,
          NOTE: ycsxdatatablefilter[i].NOTE,
          NEXT_PLAN_ID: "X",
        };
        newPlans.push(temp_add_plan);
      }
      setPlanDataTable(newPlans);
      localStorage.setItem("temp_plan_table", JSON.stringify(newPlans));
      Swal.fire("Thông báo", `Đã thêm ${ycsxdatatablefilter.length} dòng vào Plan nháp!`, "success");
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để Add !", "error");
    }
  };

  const handle_AddBlankPlan = async () => {
    let temp_: number = temp_id;
    temp_++;
    setTemID(temp_);
    localStorage.setItem("temp_plan_table_max_id", temp_.toString());
    let temp_add_plan: QLSXPLANDATA = {
      id: temp_id + 1,
      PLAN_ID: "PL" + (temp_id + 1),
      PLAN_DATE: moment().format("YYYY-MM-DD"),
      PROD_REQUEST_NO: "",
      PLAN_QTY: 0,
      PLAN_EQ: "",
      PLAN_FACTORY: userData?.FACTORY_CODE === 1 ? "NM1" : "NM2",
      PLAN_LEADTIME: 0,
      INS_EMPL: "",
      INS_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
      UPD_EMPL: "",
      UPD_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
      G_CODE: "",
      G_NAME: "",
      G_NAME_KD: "",
      PROD_REQUEST_DATE: "",
      PROD_REQUEST_QTY: 0,
      STEP: 1,
      PLAN_ORDER: "1",
      PROCESS_NUMBER: 1,
      KETQUASX: 0,
      KQ_SX_TAM: 0,
      CD1: 0,
      CD2: 0,
      TON_CD1: 0,
      TON_CD2: 0,
      FACTORY: "",
      EQ1: "",
      EQ2: "",
      Setting1: 0,
      Setting2: 0,
      UPH1: 0,
      UPH2: 0,
      Step1: 0,
      Step2: 0,
      LOSS_SX1: 0,
      LOSS_SX2: 0,
      LOSS_SETTING1: 0,
      LOSS_SETTING2: 0,
      NOTE: "",
      NEXT_PLAN_ID: "X",
      CD3: 0,
      CD4: 0,
      TON_CD3: 0,
      TON_CD4: 0,
      EQ3: "",
      EQ4: "",
      Setting3: 0,
      Setting4: 0,
      UPH3: 0,
      UPH4: 0,
      Step3: 0,
      Step4: 0,
      LOSS_SX3: 0,
      LOSS_SX4: 0,
      LOSS_SETTING3: 0,
      LOSS_SETTING4: 0,
      IS_SETTING: "Y",
    };
    const updated = [...plandatatable, temp_add_plan];
    setPlanDataTable(updated);
    localStorage.setItem("temp_plan_table", JSON.stringify(updated));
  };

  const handle_SavePlan = async () => {
    if (qlsxplandatafilter.current.length > 0) {
      let org_plan_tb = [...plandatatable];
      localStorage.setItem("temp_plan_table", JSON.stringify(plandatatable));
      let err_code: string = "0";
      for (let i = 0; i < qlsxplandatafilter.current.length; i++) {
        if (
          qlsxplandatafilter.current[i].PROCESS_NUMBER >= 1 &&
          qlsxplandatafilter.current[i].PROCESS_NUMBER <= 4 &&
          qlsxplandatafilter.current[i].PLAN_QTY !== 0 &&
          qlsxplandatafilter.current[i].PLAN_QTY <= (qlsxplandatafilter.current[i].CURRENT_SLC ?? 0) &&
          qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) !== "" &&
          (qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "FR" ||
            qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "SR" ||
            qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "DC" ||
            qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "ED" ||
            qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "FX" ||
            qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "DG" ||
            qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "SC") &&
          qlsxplandatafilter.current[i].STEP >= 0 &&
          qlsxplandatafilter.current[i].STEP <= 9
        ) {
          let check_ycsx_hethongcu: boolean = false;
          await generalQuery("checkProd_request_no_Exist_O302", {
            PROD_REQUEST_NO: qlsxplandatafilter.current[i].PROD_REQUEST_NO,
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                if (response.data.data.length > 0) {
                  check_ycsx_hethongcu = true;
                }
              }
            })
            .catch((error) => {
              console.error(error);
            });

          let nextPlan = await getNextPLAN_ID(
            qlsxplandatafilter.current[i].PROD_REQUEST_NO,
            qlsxplandatafilter.current[i]
          );
          let NextPlanID = nextPlan.NEXT_PLAN_ID;
          let NextPlanOrder = nextPlan.NEXT_PLAN_ORDER;
          if (check_ycsx_hethongcu === false) {
            await generalQuery("addPlanQLSX", {
              STEP: qlsxplandatafilter.current[i].STEP,
              PLAN_QTY: qlsxplandatafilter.current[i].PLAN_QTY,
              PLAN_LEADTIME: qlsxplandatafilter.current[i].PLAN_LEADTIME,
              PLAN_EQ: qlsxplandatafilter.current[i].PLAN_EQ,
              PLAN_ORDER: NextPlanOrder,
              PROCESS_NUMBER: qlsxplandatafilter.current[i].PROCESS_NUMBER,
              KETQUASX: qlsxplandatafilter.current[i].KETQUASX ?? 0,
              PLAN_ID: NextPlanID,
              PLAN_DATE: moment().format("YYYY-MM-DD"),
              PROD_REQUEST_NO: qlsxplandatafilter.current[i].PROD_REQUEST_NO,
              PLAN_FACTORY: qlsxplandatafilter.current[i].PLAN_FACTORY,
              G_CODE: qlsxplandatafilter.current[i].G_CODE,
              NEXT_PLAN_ID: qlsxplandatafilter.current[i].NEXT_PLAN_ID,
              IS_SETTING: qlsxplandatafilter.current[i].IS_SETTING,
            })
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  handle_DeleteCompletedPLAN(org_plan_tb, qlsxplandatafilter.current[i].PLAN_ID);
                } else {
                  err_code += "_" + response.data.message;
                }
              })
              .catch((error) => {
                console.error(error);
              });
            await f_updateDMSX_LOSS_KT();
          } else {
            err_code += "__Yc này đã chạy hệ thống cũ, chạy nốt bằng hệ thống cũ nhé";
          }
        } else {
          if (
            !(
              qlsxplandatafilter.current[i].PROCESS_NUMBER >= 1 &&
              qlsxplandatafilter.current[i].PROCESS_NUMBER <= 4
            )
          ) {
            err_code += "_" + qlsxplandatafilter.current[i].G_NAME_KD + ": Process Number không hợp lệ";
          } else if (qlsxplandatafilter.current[i].PLAN_QTY <= 0) {
            err_code += "_" + qlsxplandatafilter.current[i].G_NAME_KD + ": Số lượng chỉ thị không hợp lệ";
          } else if (
            qlsxplandatafilter.current[i].PLAN_QTY >
            (qlsxplandatafilter.current[i].CURRENT_SLC ?? 0)
          ) {
            err_code += "_" + qlsxplandatafilter.current[i].G_NAME_KD + ": Số lượng chỉ thị lớn hơn số lượng cần sx";
          } else if (qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "") {
            err_code += "_" + qlsxplandatafilter.current[i].G_NAME_KD + ": PLAN_EQ không được rỗng";
          } else if (
            !(
              qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "FR" ||
              qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "SR" ||
              qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "DC" ||
              qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "ED" ||
              qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "FX" ||
              qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "DG" ||
              qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "SC"
            )
          ) {
            err_code += "_" + qlsxplandatafilter.current[i].G_NAME_KD + ": PLAN_EQ không hợp lệ";
          } else if (
            !(
              qlsxplandatafilter.current[i].STEP >= 0 &&
              qlsxplandatafilter.current[i].STEP <= 9
            )
          ) {
            err_code += "_" + qlsxplandatafilter.current[i].G_NAME_KD + ": STEP không hợp lệ";
          }
        }
      }
      setPlanDataTable(org_plan_tb);
      if (err_code !== "0") {
        Swal.fire("Thông báo", "Có lỗi !" + err_code, "error");
      } else {
        Swal.fire("Thông báo", "Lưu PLAN thành công", "success");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để lưu", "error");
    }
  };

  const handleConfirmSavePlan = () => {
    Swal.fire({
      title: "Chắc chắn muốn Lưu PLAN đã chọn ?",
      text: "Sẽ bắt đầu Lưu PLAN đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Lưu!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Lưu PLAN", "Đang Lưu PLAN hàng loạt", "success");
        handle_SavePlan();
      }
    });
  };

  const handleSaveQLSX = async () => {
    if (selectedPlan.current?.G_CODE !== "") {
      checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], async () => {
        let err_code: string = "0";
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
        } else {
          await f_insertDMYCSX({
            PROD_REQUEST_NO: selectedPlan.current?.PROD_REQUEST_NO,
            G_CODE: selectedPlan.current?.G_CODE,
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
          err_code = (await f_saveQLSX({
            G_CODE: selectedPlan.current?.G_CODE,
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
            NOTE: datadinhmuc.NOTE,
          }))
            ? "0"
            : "1";
          if (err_code === "1") {
            Swal.fire("Thông báo", "Lưu thất bại, không được để trống ô cần thiết", "error");
          } else {
            Swal.fire("Thông báo", "Lưu thành công", "success");
          }
        }
      });
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 Code để SET !", "error");
    }
  };

  const get1YCSXDATA = async (PROD_REQUEST_NO: string) => {
    let temp_data: YCSXTableData[] = [];
    await generalQuery("quickcheckycsx", {
      PROD_REQUEST_NO: PROD_REQUEST_NO,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: YCSXTableData[] = response.data.data.map(
            (element: YCSXTableData) => {
              let DU1: number = 0;
              let DU2: number = 0;
              let DU3: number = 0;
              let DU4: number = 0;
              let temp_TCD1: number =
                element.EQ1 === "NO" || element.EQ1 === "NA"
                  ? 0
                  : (element.SLC_CD1 ?? 0) - element.CD1 - Math.floor(DU1 * (1 - (element.LOSS_SX1 * 1.0) / 100));
              let temp_TCD2: number =
                element.EQ2 === "NO" || element.EQ2 === "NA"
                  ? 0
                  : (element.SLC_CD2 ?? 0) - element.CD2 - Math.floor(DU2 * (1 - (element.LOSS_SX2 * 1.0) / 100));
              let temp_TCD3: number =
                element.EQ3 === "NO" || element.EQ3 === "NA"
                  ? 0
                  : (element.SLC_CD3 ?? 0) - element.CD3 - Math.floor(DU3 * (1 - (element.LOSS_SX3 * 1.0) / 100));
              let temp_TCD4: number =
                element.EQ4 === "NO" || element.EQ4 === "NA"
                  ? 0
                  : (element.SLC_CD4 ?? 0) - element.CD4 - Math.floor(DU4 * (1 - (element.LOSS_SX4 * 1.0) / 100));

              return {
                ...element,
                SLC_CD1:
                  element.EQ1 === "NO" || element.EQ1 === "NA"
                    ? 0
                    : (element.SLC_CD1 ?? 0) - Math.floor(DU1 * (1 - (element.LOSS_SX1 * 1.0) / 100)),
                SLC_CD2:
                  element.EQ2 === "NO" || element.EQ2 === "NA"
                    ? 0
                    : (element.SLC_CD2 ?? 0) - Math.floor(DU2 * (1 - (element.LOSS_SX2 * 1.0) / 100)),
                SLC_CD3:
                  element.EQ3 === "NO" || element.EQ3 === "NA"
                    ? 0
                    : (element.SLC_CD3 ?? 0) - Math.floor(DU3 * (1 - (element.LOSS_SX3 * 1.0) / 100)),
                SLC_CD4:
                  element.EQ4 === "NO" || element.EQ4 === "NA"
                    ? 0
                    : (element.SLC_CD4 ?? 0) - Math.floor(DU4 * (1 - (element.LOSS_SX4 * 1.0) / 100)),
                CD1: element.CD1 ?? 0,
                CD2: element.CD2 ?? 0,
                CD3: element.CD3 ?? 0,
                CD4: element.CD4 ?? 0,
                TON_CD1: element.EQ1 === "NO" || element.EQ1 === "NA" ? 0 : temp_TCD1,
                TON_CD2: element.EQ2 === "NO" || element.EQ2 === "NA" ? 0 : temp_TCD2,
                TON_CD3: element.EQ3 === "NO" || element.EQ3 === "NA" ? 0 : temp_TCD3,
                TON_CD4: element.EQ4 === "NO" || element.EQ4 === "NA" ? 0 : temp_TCD4,
              };
            }
          );
          temp_data = loadeddata;
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    return temp_data;
  };

  const handleUploadBanVe = async (file: any, gCode: string) => {
    checkBP(userData, ["KD"], ["ALL"], ["ALL"], async () => {
      uploadQuery(file, gCode + ".pdf", "banve")
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            generalQuery("update_banve_value", {
              G_CODE: gCode,
              banvevalue: "Y",
            })
              .then((res) => {
                if (res.data.tk_status !== "NG") {
                  Swal.fire("Thông báo", "Upload bản vẽ thành công", "success");
                  let tempcodeinfodatatable = ycsxdatatable.map((element: YCSXTableData) => {
                    return element.G_CODE === gCode ? { ...element, BANVE: "Y" } : element;
                  });
                  setYcsxDataTable(tempcodeinfodatatable);
                } else {
                  Swal.fire("Thông báo", "Upload bản vẽ thất bại", "error");
                }
              })
              .catch((err) => console.error(err));
          } else {
            Swal.fire("Thông báo", "Upload file thất bại:" + response.data.message, "error");
          }
        })
        .catch((err) => console.error(err));
    });
  };

  const onCellEditingStopped = useCallback(
    async (params: any) => {
      const keyvar = params.column.colId;
      let temp_ycsx_data: YCSXTableData[] = [];
      if (keyvar === "PROD_REQUEST_NO") {
        temp_ycsx_data = await get1YCSXDATA(params.value);
        const newdata: QLSXPLANDATA[] = plandatatable.map((p) => {
          if (p.PLAN_ID === params.data.PLAN_ID) {
            if (temp_ycsx_data.length > 0) {
              return {
                ...p,
                [keyvar]: params.value,
                G_CODE: temp_ycsx_data[0].G_CODE,
                G_NAME: temp_ycsx_data[0].G_NAME,
                G_NAME_KD: temp_ycsx_data[0].G_NAME_KD,
                PROD_REQUEST_QTY: temp_ycsx_data[0].PROD_REQUEST_QTY,
                CURRENT_SLC: temp_ycsx_data[0].SLC_CD1 ?? 0,
                PLAN_QTY:
                  temp_ycsx_data[0].TON_CD1 <= 0
                    ? 0
                    : temp_ycsx_data[0].TON_CD1 < temp_ycsx_data[0].UPH1 * qtyFactor
                    ? temp_ycsx_data[0].TON_CD1
                    : temp_ycsx_data[0].UPH1 * qtyFactor,
                CD1: temp_ycsx_data[0].CD1,
                CD2: temp_ycsx_data[0].CD2,
                CD3: temp_ycsx_data[0].CD3,
                CD4: temp_ycsx_data[0].CD4,
                SLC_CD1: temp_ycsx_data[0].SLC_CD1,
                SLC_CD2: temp_ycsx_data[0].SLC_CD2,
                SLC_CD3: temp_ycsx_data[0].SLC_CD3,
                SLC_CD4: temp_ycsx_data[0].SLC_CD4,
                TON_CD1: temp_ycsx_data[0].TON_CD1,
                TON_CD2: temp_ycsx_data[0].TON_CD2,
                TON_CD3: temp_ycsx_data[0].TON_CD3,
                TON_CD4: temp_ycsx_data[0].TON_CD4,
                EQ1: temp_ycsx_data[0].EQ1,
                EQ2: temp_ycsx_data[0].EQ2,
                EQ3: temp_ycsx_data[0].EQ3,
                EQ4: temp_ycsx_data[0].EQ4,
                UPH1: temp_ycsx_data[0].UPH1,
                UPH2: temp_ycsx_data[0].UPH2,
                UPH3: temp_ycsx_data[0].UPH3,
                UPH4: temp_ycsx_data[0].UPH4,
                FACTORY: temp_ycsx_data[0].FACTORY,
                Setting1: temp_ycsx_data[0].Setting1,
                Setting2: temp_ycsx_data[0].Setting2,
                Setting3: temp_ycsx_data[0].Setting3,
                Setting4: temp_ycsx_data[0].Setting4,
                Step1: temp_ycsx_data[0].Step1,
                Step2: temp_ycsx_data[0].Step2,
                Step3: temp_ycsx_data[0].Step3,
                Step4: temp_ycsx_data[0].Step4,
                LOSS_SX1: temp_ycsx_data[0].LOSS_SX1,
                LOSS_SX2: temp_ycsx_data[0].LOSS_SX2,
                LOSS_SX3: temp_ycsx_data[0].LOSS_SX3,
                LOSS_SX4: temp_ycsx_data[0].LOSS_SX4,
                LOSS_SETTING1: temp_ycsx_data[0].LOSS_SETTING1,
                LOSS_SETTING2: temp_ycsx_data[0].LOSS_SETTING2,
                LOSS_SETTING3: temp_ycsx_data[0].LOSS_SETTING3,
                LOSS_SETTING4: temp_ycsx_data[0].LOSS_SETTING4,
                NOTE: temp_ycsx_data[0].NOTE,
              };
            } else {
              Swal.fire("Thông báo", "Không có số yc này", "error");
              return { ...p, [keyvar]: "" };
            }
          }
          return p;
        });
        localStorage.setItem("temp_plan_table", JSON.stringify(newdata));
        setPlanDataTable(newdata);
      } else if (keyvar === "PLAN_EQ") {
        let current_PROD_REQUEST_NO: string | undefined = plandatatable.find(
          (element) => element.PLAN_ID === params.data.PLAN_ID
        )?.PROD_REQUEST_NO;
        if (current_PROD_REQUEST_NO !== undefined) {
          temp_ycsx_data = await get1YCSXDATA(current_PROD_REQUEST_NO);
        }
        const newdata = plandatatable.map((p) => {
          if (p.PLAN_ID === params.data.PLAN_ID) {
            if (params.value.length === 4) {
              let plan_temp = params.value.substring(0, 2);
              let UPH1: number = p.UPH1 ?? 999999999;
              let UPH2: number = p.UPH2 ?? 999999999;
              let UPH3: number = p.UPH3 ?? 999999999;
              let UPH4: number = p.UPH4 ?? 999999999;
              if (plan_temp === p.EQ1) {
                return {
                  ...p,
                  [keyvar]: params.value,
                  PROCESS_NUMBER: 1,
                  CURRENT_SLC: temp_ycsx_data[0]?.SLC_CD1 ?? 0,
                  CD1: temp_ycsx_data[0]?.CD1 ?? 0,
                  CD2: temp_ycsx_data[0]?.CD2 ?? 0,
                  CD3: temp_ycsx_data[0]?.CD3 ?? 0,
                  CD4: temp_ycsx_data[0]?.CD4 ?? 0,
                  TON_CD1: temp_ycsx_data[0]?.TON_CD1 ?? 0,
                  TON_CD2: temp_ycsx_data[0]?.TON_CD2 ?? 0,
                  TON_CD3: temp_ycsx_data[0]?.TON_CD3 ?? 0,
                  TON_CD4: temp_ycsx_data[0]?.TON_CD4 ?? 0,
                  PLAN_QTY:
                    (temp_ycsx_data[0]?.TON_CD1 ?? 0) <= 0
                      ? 0
                      : (temp_ycsx_data[0]?.TON_CD1 ?? 0) < UPH1 * qtyFactor
                      ? temp_ycsx_data[0]?.TON_CD1 ?? 0
                      : UPH1 * qtyFactor,
                };
              } else if (plan_temp === p.EQ2) {
                return {
                  ...p,
                  [keyvar]: params.value,
                  PROCESS_NUMBER: 2,
                  CURRENT_SLC: temp_ycsx_data[0]?.SLC_CD2 ?? 0,
                  CD1: temp_ycsx_data[0]?.CD1 ?? 0,
                  CD2: temp_ycsx_data[0]?.CD2 ?? 0,
                  CD3: temp_ycsx_data[0]?.CD3 ?? 0,
                  CD4: temp_ycsx_data[0]?.CD4 ?? 0,
                  TON_CD1: temp_ycsx_data[0]?.TON_CD1 ?? 0,
                  TON_CD2: temp_ycsx_data[0]?.TON_CD2 ?? 0,
                  TON_CD3: temp_ycsx_data[0]?.TON_CD3 ?? 0,
                  TON_CD4: temp_ycsx_data[0]?.TON_CD4 ?? 0,
                  PLAN_QTY:
                    (temp_ycsx_data[0]?.TON_CD2 ?? 0) <= 0
                      ? 0
                      : (temp_ycsx_data[0]?.TON_CD2 ?? 0) < UPH2 * qtyFactor
                      ? temp_ycsx_data[0]?.TON_CD2 ?? 0
                      : UPH2 * qtyFactor,
                };
              } else if (plan_temp === p.EQ3) {
                return {
                  ...p,
                  [keyvar]: params.value,
                  PROCESS_NUMBER: 3,
                  CURRENT_SLC: temp_ycsx_data[0]?.SLC_CD3 ?? 0,
                  CD1: temp_ycsx_data[0]?.CD1 ?? 0,
                  CD2: temp_ycsx_data[0]?.CD2 ?? 0,
                  CD3: temp_ycsx_data[0]?.CD3 ?? 0,
                  CD4: temp_ycsx_data[0]?.CD4 ?? 0,
                  TON_CD1: temp_ycsx_data[0]?.TON_CD1 ?? 0,
                  TON_CD2: temp_ycsx_data[0]?.TON_CD2 ?? 0,
                  TON_CD3: temp_ycsx_data[0]?.TON_CD3 ?? 0,
                  TON_CD4: temp_ycsx_data[0]?.TON_CD4 ?? 0,
                  PLAN_QTY:
                    (temp_ycsx_data[0]?.TON_CD3 ?? 0) <= 0
                      ? 0
                      : (temp_ycsx_data[0]?.TON_CD3 ?? 0) < UPH3 * qtyFactor
                      ? temp_ycsx_data[0]?.TON_CD3 ?? 0
                      : UPH3 * qtyFactor,
                };
              } else if (plan_temp === p.EQ4) {
                return {
                  ...p,
                  [keyvar]: params.value,
                  PROCESS_NUMBER: 4,
                  CURRENT_SLC: temp_ycsx_data[0]?.SLC_CD4 ?? 0,
                  CD1: temp_ycsx_data[0]?.CD1 ?? 0,
                  CD2: temp_ycsx_data[0]?.CD2 ?? 0,
                  CD3: temp_ycsx_data[0]?.CD3 ?? 0,
                  CD4: temp_ycsx_data[0]?.CD4 ?? 0,
                  TON_CD1: temp_ycsx_data[0]?.TON_CD1 ?? 0,
                  TON_CD2: temp_ycsx_data[0]?.TON_CD2 ?? 0,
                  TON_CD3: temp_ycsx_data[0]?.TON_CD3 ?? 0,
                  TON_CD4: temp_ycsx_data[0]?.TON_CD4 ?? 0,
                  PLAN_QTY:
                    (temp_ycsx_data[0]?.TON_CD4 ?? 0) <= 0
                      ? 0
                      : (temp_ycsx_data[0]?.TON_CD4 ?? 0) < UPH4 * qtyFactor
                      ? temp_ycsx_data[0]?.TON_CD4 ?? 0
                      : UPH4 * qtyFactor,
                };
              } else {
                Swal.fire("Thông báo", "Máy đã nhập ko giống trong BOM", "warning");
                return { ...p, [keyvar]: params.value };
              }
            } else {
              Swal.fire("Thông báo", "Nhập máy không đúng", "error");
              return { ...p, [keyvar]: "" };
            }
          }
          return p;
        });
        localStorage.setItem("temp_plan_table", JSON.stringify(newdata));
        setPlanDataTable(newdata);
      } else if (keyvar === "PROCESS_NUMBER") {
        let current_PROD_REQUEST_NO: string | undefined = plandatatable.find(
          (element) => element.PLAN_ID === params.data.PLAN_ID
        )?.PROD_REQUEST_NO;
        if (current_PROD_REQUEST_NO !== undefined) {
          temp_ycsx_data = await get1YCSXDATA(current_PROD_REQUEST_NO);
        }
        const newdata = plandatatable.map((p) => {
          if (p.PLAN_ID === params.data.PLAN_ID) {
            let prnb: number = Number(params.value);
            if (prnb <= 4 && prnb >= 1) {
              let UPH1: number = p.UPH1 ?? 999999999;
              let UPH2: number = p.UPH2 ?? 999999999;
              let UPH3: number = p.UPH3 ?? 999999999;
              let UPH4: number = p.UPH4 ?? 999999999;
              let UPH: number =
                prnb === 1 ? UPH1 : prnb === 2 ? UPH2 : prnb === 3 ? UPH3 : UPH4;
              let TON: number =
                prnb === 1
                  ? temp_ycsx_data[0]?.TON_CD1 ?? 0
                  : prnb === 2
                  ? temp_ycsx_data[0]?.TON_CD2 ?? 0
                  : prnb === 3
                  ? temp_ycsx_data[0]?.TON_CD3 ?? 0
                  : temp_ycsx_data[0]?.TON_CD4 ?? 0;
              let SLC: number =
                prnb === 1
                  ? temp_ycsx_data[0]?.SLC_CD1 ?? 0
                  : prnb === 2
                  ? temp_ycsx_data[0]?.SLC_CD2 ?? 0
                  : prnb === 3
                  ? temp_ycsx_data[0]?.SLC_CD3 ?? 0
                  : temp_ycsx_data[0]?.SLC_CD4 ?? 0;
              return {
                ...p,
                [keyvar]: params.value,
                CURRENT_SLC: SLC,
                PLAN_EQ: "",
                CD1: temp_ycsx_data[0]?.CD1 ?? 0,
                CD2: temp_ycsx_data[0]?.CD2 ?? 0,
                CD3: temp_ycsx_data[0]?.CD3 ?? 0,
                CD4: temp_ycsx_data[0]?.CD4 ?? 0,
                TON_CD1: temp_ycsx_data[0]?.TON_CD1 ?? 0,
                TON_CD2: temp_ycsx_data[0]?.TON_CD2 ?? 0,
                TON_CD3: temp_ycsx_data[0]?.TON_CD3 ?? 0,
                TON_CD4: temp_ycsx_data[0]?.TON_CD4 ?? 0,
                PLAN_QTY: TON <= 0 ? 0 : TON < UPH * qtyFactor ? TON : UPH * qtyFactor,
              };
            } else {
              Swal.fire("Thông báo", "Nhập máy không đúng", "error");
              return { ...p, [keyvar]: "" };
            }
          }
          return p;
        });
        localStorage.setItem("temp_plan_table", JSON.stringify(newdata));
        setPlanDataTable(newdata);
      } else {
        const newdata = plandatatable.map((p) => {
          if (p.PLAN_ID === params.data.PLAN_ID) {
            return { ...p, [keyvar]: params.value };
          }
          return p;
        });
        localStorage.setItem("temp_plan_table", JSON.stringify(newdata));
        setPlanDataTable(newdata);
      }
    },
    [plandatatable, qtyFactor]
  );

  const onCellClick = useCallback(
    async (params: any) => {
      let rowData: QLSXPLANDATA = params.data;
      selectedPlan.current = rowData;
      setSelectedCode(
        `CODE: ${rowData.G_CODE || "CHƯA CHỌN"} | ${rowData.G_NAME_KD || rowData.G_NAME || ""}`
      );
      setDataDinhMuc({
        FACTORY: rowData.FACTORY ?? "NA",
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
        LOSS_KT: 0,
        NOTE: rowData.NOTE ?? "",
      });
      if (rowData.G_CODE) {
        setRecentDMData(await f_getRecentDMData(rowData.G_CODE));
      }
    },
    []
  );

  const onSelectionChange = useCallback((params: any) => {
    qlsxplandatafilter.current = params!.api.getSelectedRows();
  }, []);

  /**
   * Bật/tắt cờ IS_SETTING ngay trên bảng Plan tạm (checkbox ở cột IS_SETTING).
   * Trước đây cột này KHÔNG tick được vì cellRenderer dùng `checked` (controlled input)
   * nhưng `getColumnQuickPlanDataTable()` được gọi mà không truyền `onToggleIsSetting`.
   * Giữ đúng hành vi của QUICKPLAN2 bản cũ: đảo Y <-> N, lưu localStorage, xoá selection.
   */
  const handleToggleIsSetting = useCallback(
    (row: QLSXPLANDATA) => {
      if (!row) return;
      const newdata = plandatatable.map((p) => {
        const isSameRow =
          p === row ||
          (row.id !== undefined && p.id !== undefined && p.id === row.id);
        if (!isSameRow) return p;
        return { ...p, IS_SETTING: p.IS_SETTING === "Y" ? "N" : "Y" };
      });
      localStorage.setItem("temp_plan_table", JSON.stringify(newdata));
      setPlanDataTable(newdata);
      qlsxplandatafilter.current = [];
    },
    [plandatatable]
  );

  return {
    userData,
    qtyFactor,
    recentDMData,
    setRecentDMData,
    selection,
    setSelection,
    datadinhmuc,
    setDataDinhMuc,
    plandatatable,
    setPlanDataTable,
    isLoading,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    codeKD,
    setCodeKD,
    codeCMS,
    setCodeCMS,
    empl_name,
    setEmpl_Name,
    cust_name,
    setCust_Name,
    prod_type,
    setProdType,
    prodrequestno,
    setProdRequestNo,
    alltime,
    setAllTime,
    materialYES,
    setMaterialYES,
    phanloai,
    setPhanLoai,
    material,
    setMaterial,
    ycsxdatatable,
    setYcsxDataTable,
    ycsxdatatablefilter,
    setYcsxDataTableFilter,
    qlsxplandatafilter,
    ycsxpendingcheck,
    setYCSXPendingCheck,
    inspectInputcheck,
    setInspectInputCheck,
    ycsxlistrender,
    setYCSXListRender,
    chithilistrender,
    setChiThiListRender,
    ycktlistrender,
    setYCKTListRender,
    selectedCode,
    setSelectedCode,
    selectedPlan,
    showChiThi,
    setShowChiThi,
    showYCKT,
    setShowYCKT,
    temp_id,
    setTemID,
    showhideycsxtable,
    setShowHideYCSXTable,
    machine_list,
    ycsxprintref,
    handlePrint,
    handletraYCSX,
    handleSearchCodeKeyDown,
    setPendingYCSX,
    handleConfirmSetPendingYCSX,
    handleConfirmSetClosedYCSX,
    handleConfirmDeletePlan,
    handleConfirmSavePlan,
    handle_DeleteLinePLAN,
    handle_DeleteCompletedPLAN,
    getNextPLAN_ID,
    handle_AddPlan,
    handle_AddBlankPlan,
    handle_SavePlan,
    handleSaveQLSX,
    handleYCSXSelectionforUpdate,
    get1YCSXDATA,
    handleUploadBanVe,
    onCellEditingStopped,
    onCellClick,
    onSelectionChange,
    handleToggleIsSetting,
    renderYCKT,
    renderChiThi,
    renderYCSX,
    renderBanVe,
  };
};

export default useQuickPlanData;
