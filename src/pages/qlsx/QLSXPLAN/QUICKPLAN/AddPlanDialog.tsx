import { useEffect, useMemo, useRef, useState } from "react";
import "./AddPlanDialog.scss";
import Swal from "sweetalert2";
import { generalQuery, getGlobalSetting } from "../../../../api/Api";
import moment from "moment";
import { IconButton } from "@mui/material";
import { AiFillFileExcel, AiFillFolderAdd, AiFillSave } from "react-icons/ai";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { FcDeleteRow } from "react-icons/fc";
import {
  checkBP,
  f_getMachineListData,
  f_getRecentDMData,
  f_insertDMYCSX,
  f_loadDMSX,
  f_saveQLSX,
  f_updateDMSX_LOSS_KT,
  PLAN_ID_ARRAY,
  SaveExcel,
} from "../../../../api/GlobalFunction";
import { BiShow } from "react-icons/bi";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
  DINHMUC_QSLX,
  MACHINE_LIST,
  QLSXPLANDATA,
  RecentDM,
  UserData,
  WEB_SETTING_DATA,
  YCSXTableData,
} from "../../../../api/GlobalInterface";
import AGTable from "../../../../components/DataTable/AGTable";
const AddPlanDialog = ({ PROD_REQUEST_NO, G_CODE, EQ_NAME }: { PROD_REQUEST_NO: string, G_CODE: string, EQ_NAME: string }) => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const qtyFactor: number = parseInt(getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'DAILY_TIME')[0]?.CURRENT_VALUE ?? '840') / 2 / 60;
  //console.log(qtyFactor)
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
    NOTE: "",
  });
  const [plandatatable, setPlanDataTable] = useState<QLSXPLANDATA[]>([]);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const qlsxplandatafilter = useRef<Array<QLSXPLANDATA>>([]);
  const selectedPlan = useRef<QLSXPLANDATA>();
  const [temp_id, setTemID] = useState(0);
  const [showhideycsxtable, setShowHideYCSXTable] = useState(1);
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const [planqty, setPlanQty] = useState(0);
  const [processnumber, setProcessNumber] = useState(0);
  const [stepnumber, setStepNumber] = useState(0);
  const [plan_date, setPlanDate] = useState(moment().format("YYYY-MM-DD"));
  const [plan_factory, setPlanFactory] = useState("NM1");
  const [planeq, setPlanEq] = useState(EQ_NAME);
  const [nextplan, setNextPlan] = useState("");
  const [isSetting, setIsSetting] = useState(true);
  const [tempYCSX, setTempYCSX] = useState<YCSXTableData[]>([]);
  const [temp_SLC, setTempSLC] = useState<number>(0);
  const [temp_TON_CD, setTempTON_CD] = useState<number>(0);
  const [temp_CD, setTempCD] = useState<number>(0);
  const getMachineList = async () => {
    setMachine_List(await f_getMachineListData());
  };
  const column_plandatatable = [
    {
      field: "PLAN_ID",
      headerName: "PLAN_ID",
      width: 90,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      pinned: 'left',
      editable: false,
      resizable: true,
    },
    {
      field: "PROD_REQUEST_NO",
      headerName: "YCSX_NO",
      width: 100,
      editable: true,
      pinned: 'left'
    },
    { field: "G_CODE", headerName: "G_CODE", width: 80, editable: false },
    { field: "G_NAME", headerName: "G_NAME", width: 130, editable: false },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 100,
      editable: false,
      cellRenderer: (params: any) => {
        if (
          params.data.FACTORY === null ||
          params.data.EQ1 === null ||
          params.data.EQ2 === null ||
          params.data.Setting1 === null ||
          params.data.Setting2 === null ||
          params.data.UPH1 === null ||
          params.data.UPH2 === null ||
          params.data.Step1 === null ||
          params.data.Step1 === null ||
          params.data.LOSS_SX1 === null ||
          params.data.LOSS_SX2 === null ||
          params.data.LOSS_SETTING1 === null ||
          params.data.LOSS_SETTING2 === null
        )
          return <span style={{ color: "red" }}>{params.data.G_NAME_KD}</span>;
        return <span style={{ color: "green" }}>{params.data.G_NAME_KD}</span>;
      },
    },
    {
      field: "PROD_REQUEST_QTY",
      headerName: "YCSX_QTY",
      width: 80,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.PROD_REQUEST_QTY?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "CD1",
      headerName: "CD1",
      width: 60,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.CD1?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "CD2",
      headerName: "CD2",
      width: 60,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.CD2?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "CD3",
      headerName: "CD3",
      width: 60,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.CD3?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "CD4",
      headerName: "CD4",
      width: 60,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.CD4?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD1",
      headerName: "TCD1",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.TON_CD1?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD2",
      headerName: "TCD2",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.TON_CD2?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD3",
      headerName: "TCD3",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.TON_CD3?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD4",
      headerName: "TCD4",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.TON_CD4?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "PLAN_QTY",
      headerName: "PLAN_QTY",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.PLAN_QTY === 0) {
          return <span style={{ color: "red" }}>NG</span>;
        } else {
          return (
            <span style={{ color: "green" }}>
              {params.data.PLAN_QTY?.toLocaleString("en", "US")}
            </span>
          );
        }
      },
    },
    {
      field: "PROCESS_NUMBER",
      headerName: "PROC_NUM",
      width: 80,
      cellRenderer: (params: any) => {
        if (
          params.data.PROCESS_NUMBER === null ||
          params.data.PROCESS_NUMBER === 0
        ) {
          return <span style={{ color: "red" }}>NG</span>;
        } else {
          return (
            <span style={{ color: "green" }}>{params.data.PROCESS_NUMBER}</span>
          );
        }
      },
    },
    {
      field: "PLAN_EQ",
      headerName: "PLAN_EQ",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.PLAN_EQ === null || params.data.PLAN_EQ === "") {
          return <span style={{ color: "red" }}>NG</span>;
        } else {
          return <span style={{ color: "green" }}>{params.data.PLAN_EQ}</span>;
        }
      },
    },
    { field: "STEP", headerName: "STEP", width: 50, },
    {
      field: "IS_SETTING",
      headerName: "IS_SETTING",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <input
            type='checkbox'
            name='alltimecheckbox'
            defaultChecked={params.data.IS_SETTING === 'Y'}
            onChange={(value) => {
              //console.log(value);
              const newdata = plandatatable.map((p) =>
                p.PLAN_ID === params.data.PLAN_ID
                  ? { ...p, IS_SETTING: params.data.IS_SETTING === 'Y' ? 'N' : 'Y' }
                  : p
              );
              setPlanDataTable(newdata);
              qlsxplandatafilter.current = [];
            }}
          ></input>
        )
      },
      editable: false,
    },
    {
      field: "PLAN_ORDER",
      headerName: "ORDER",
      width: 60,
    },
    {
      field: "SLC_CD1",
      headerName: "SLC_CD1",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            {params.data?.SLC_CD1?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "SLC_CD2",
      headerName: "SLC_CD2",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            {params.data?.SLC_CD2?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "SLC_CD3",
      headerName: "SLC_CD3",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            {params.data?.SLC_CD3?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "SLC_CD4",
      headerName: "SLC_CD4",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            {params.data?.SLC_CD4?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    { field: "EQ1", headerName: "EQ1", width: 50, },
    { field: "EQ2", headerName: "EQ2", width: 50, },
    { field: "EQ3", headerName: "EQ3", width: 50, },
    { field: "EQ4", headerName: "EQ4", width: 50, },
    {
      field: "PLAN_FACTORY",
      headerName: "NM",
      width: 50,
      editable: false,
    },
    {
      field: "PLAN_DATE",
      headerName: "PLAN_DATE",
      width: 110,
      editable: false,
    },
    {
      field: "NEXT_PLAN_ID",
      headerName: "NEXT_PLAN_ID",
      width: 120,
      editable: true,
    },
  ];
  const setPendingYCSX = async (pending_value: number) => {
    await generalQuery("setpending_ycsx", {
      PROD_REQUEST_NO: PROD_REQUEST_NO,
      YCSX_PENDING: pending_value,
    })
      .then((response) => {
        console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Đã SET Pending/Close thành công", "success");
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
        Swal.fire(
          "Tiến hành SET PENDING",
          "Đang SET PENDING YCSX hàng loạt",
          "success",
        );
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
        Swal.fire(
          "Tiến hành SET CLOSED",
          "Đang SET CLOSED YCSX hàng loạt",
          "success",
        );
        setPendingYCSX(0);
      }
    });
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
              //console.log('vao day');
              setTemID(0);
              localStorage.setItem("temp_plan_table_max_id", "0");
            } else {
              setTemID(datafilter[len].id);
              localStorage.setItem(
                "temp_plan_table_max_id",
                datafilter[len].id.toString(),
              );
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
          console.log('plan to delete: ', PLAN_ID)
          let prev_length: number = datafilter.length;
          datafilter.splice(j, 1);
          let len: number = datafilter.length - 1;
          if (prev_length === 1) {
            //console.log('vao day');
            setTemID(0);
            localStorage.setItem("temp_plan_table_max_id", "0");
          } else {
            setTemID(datafilter[len].id);
            localStorage.setItem(
              "temp_plan_table_max_id",
              datafilter[len].id.toString(),
            );
          }
          localStorage.setItem("temp_plan_table", JSON.stringify(datafilter));
        }
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất một dòng để xóa", "error");
    }
  };
  const getNextPLAN_ID = async (
    PROD_REQUEST_NO: string,
    PLAN_DATE: string,
    PLAN_EQ: string,
    PLAN_FACTORY: string,
  ) => {
    let next_plan_id: string = PROD_REQUEST_NO;
    let next_plan_order: number = 1;
    await generalQuery("getLastestPLAN_ID", {
      PROD_REQUEST_NO: PROD_REQUEST_NO,
    })
      .then((response) => {
        //console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data[0].PLAN_ID);
          let old_plan_id: string = response.data.data[0].PLAN_ID;
          if (old_plan_id.substring(7, 8) === "Z") {
            if (old_plan_id.substring(3, 4) === "0") {
              next_plan_id =
                old_plan_id.substring(0, 3) +
                "A" +
                old_plan_id.substring(4, 7) +
                "A";
            } else {
              next_plan_id =
                old_plan_id.substring(0, 3) +
                PLAN_ID_ARRAY[
                PLAN_ID_ARRAY.indexOf(old_plan_id.substring(3, 4)) + 1
                ] +
                old_plan_id.substring(4, 7) +
                "A";
            }
          } else {
            next_plan_id =
              old_plan_id.substring(0, 7) +
              PLAN_ID_ARRAY[
              PLAN_ID_ARRAY.indexOf(old_plan_id.substring(7, 8)) + 1
              ];
          }
          /* next_plan_id = PROD_REQUEST_NO +  String.fromCharCode(response.data.data[0].PLAN_ID.substring(7,8).charCodeAt(0) + 1); */
        } else {
          next_plan_id = PROD_REQUEST_NO + "A";
        }
      })
      .catch((error) => {
        console.log(error);
      });
    await generalQuery("getLastestPLANORDER", {
      PLAN_DATE: PLAN_DATE,
      PLAN_EQ: PLAN_EQ,
      PLAN_FACTORY: PLAN_FACTORY,
    })
      .then((response) => {
        //console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data[0].PLAN_ID);
          next_plan_order = response.data.data[0].PLAN_ORDER + 1;
        } else {
          next_plan_order = 1;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    //console.log(next_plan_id);
    return { NEXT_PLAN_ID: next_plan_id, NEXT_PLAN_ORDER: next_plan_order };
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
      IS_SETTING: 'Y'
    };
    setPlanDataTable([...plandatatable, temp_add_plan]);
    localStorage.setItem(
      "temp_plan_table",
      JSON.stringify([...plandatatable, temp_add_plan]),
    );
  };
  const handle_SavePlan = async () => {
    let err_code: string = "0";
    if (
      (processnumber >= 1 && processnumber <= 4) &&
      planqty !== 0 &&
      planqty <= temp_SLC &&
      planeq !== "" &&
      machine_list.map(e => e.EQ_NAME).indexOf(planeq.substring(0, 2)) > -1 &&
      stepnumber >= 0 && stepnumber <= 9
    ) {
      let check_ycsx_hethongcu: boolean = false;
      await generalQuery("checkProd_request_no_Exist_O302", {
        PROD_REQUEST_NO: PROD_REQUEST_NO,
      })
        .then((response) => {
          //console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            //console.log(response.data.data[0].PLAN_ID);
            if (response.data.data.length > 0) {
              check_ycsx_hethongcu = true;
            } else {
              check_ycsx_hethongcu = false;
            }
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      //check_ycsx_hethongcu = false;          
      let nextPlan = await getNextPLAN_ID(
        PROD_REQUEST_NO,
        plan_date,
        planeq,
        plan_factory
      );
      let NextPlanID = nextPlan.NEXT_PLAN_ID;
      let NextPlanOrder = nextPlan.NEXT_PLAN_ORDER;
      if (check_ycsx_hethongcu === false) {
        await generalQuery("addPlanQLSX", {
          STEP: stepnumber,
          PLAN_QTY: planqty,
          PLAN_LEADTIME: 0,
          PLAN_EQ: planeq,
          PLAN_ORDER: NextPlanOrder,
          PROCESS_NUMBER: processnumber,
          KETQUASX: 0,
          PLAN_ID: NextPlanID,
          PLAN_DATE: plan_date,
          PROD_REQUEST_NO: PROD_REQUEST_NO,
          PLAN_FACTORY: plan_factory,
          G_CODE: G_CODE,
          NEXT_PLAN_ID: nextplan,
          IS_SETTING: isSetting ? 'Y' : 'N'
        })
          .then((response) => {
            //console.log(response.data.tk_status);
            if (response.data.tk_status !== "NG") {
            } else {
              err_code += "_" + response.data.message;
            }
          })
          .catch((error) => {
            console.log(error);
          });
          await f_updateDMSX_LOSS_KT();
      } else {
        err_code +=
          "__Yc này đã chạy hệ thống cũ, chạy nốt bằng hệ thống cũ nhé";
      }
    } else {
      if (!(processnumber >= 1 && processnumber <= 4)) {
        err_code += "_" + tempYCSX[0]?.G_NAME_KD + ": Process Number không hợp lệ";
      }
      else if (planqty <= 0) {
        err_code += "_" + tempYCSX[0]?.G_NAME_KD + ": Số lượng chỉ thị không hợp lệ";
      }
      else if (planqty > (temp_SLC ?? 0)) {
        err_code += "_" + tempYCSX[0]?.G_NAME_KD + ": Số lượng chỉ thị lớn hơn số lượng cần sx";
      }
      else if (planeq === "") {
        err_code += "_" + tempYCSX[0]?.G_NAME_KD + ": Máy không được rỗng";
      }
      else if (!(machine_list.map(e => e.EQ_NAME).indexOf(planeq.substring(0, 2)) > -1)) {
        err_code += "_" + tempYCSX[0]?.G_NAME_KD + ": Máy không hợp lệ";
      }
      else if (!(stepnumber >= 0 && stepnumber <= 9)) {
        err_code += "_" + tempYCSX[0]?.G_NAME_KD + ": STEP không hợp lệ";
      }
    }
    if (err_code !== "0") {
      Swal.fire("Thông báo", "Có lỗi !" + err_code, "error");
    } else {
      Swal.fire("Thông báo", "Lưu PLAN thành công", "success");
    }
  };
  const handleSaveQLSX = async () => {
    if (selectedPlan.current?.G_CODE !== '') {
      checkBP(userData, ['QLSX'], ['ALL'], ['ALL'], async () => {
        console.log(datadinhmuc)
        let err_code: string = "0";
        if (
          datadinhmuc?.FACTORY === "NA" ||
          datadinhmuc?.EQ1 === "NA" ||
          datadinhmuc?.EQ1 === "NO" ||
          datadinhmuc?.EQ2 === "" ||
          datadinhmuc?.Setting1 === 0 ||
          datadinhmuc?.UPH1 === 0 ||
          datadinhmuc?.Step1 === 0 ||
          datadinhmuc?.LOSS_SX1 === 0
        ) {
          Swal.fire(
            "Thông báo",
            "Lưu thất bại, hãy nhập đủ thông tin",
            "error",
          );
        } else {
          await f_insertDMYCSX({
            PROD_REQUEST_NO: PROD_REQUEST_NO,
            G_CODE: G_CODE,
            LOSS_SX1: datadinhmuc?.LOSS_SX1,
            LOSS_SX2: datadinhmuc?.LOSS_SX2,
            LOSS_SX3: datadinhmuc?.LOSS_SX3,
            LOSS_SX4: datadinhmuc?.LOSS_SX4,
            LOSS_SETTING1: datadinhmuc?.LOSS_SETTING1,
            LOSS_SETTING2: datadinhmuc?.LOSS_SETTING2,
            LOSS_SETTING3: datadinhmuc?.LOSS_SETTING3,
            LOSS_SETTING4: datadinhmuc?.LOSS_SETTING4,
          });
          err_code = (await f_saveQLSX({
            G_CODE: G_CODE,
            FACTORY: datadinhmuc?.FACTORY,
            EQ1: datadinhmuc?.EQ1,
            EQ2: datadinhmuc?.EQ2,
            EQ3: datadinhmuc?.EQ3,
            EQ4: datadinhmuc?.EQ4,
            Setting1: datadinhmuc?.Setting1,
            Setting2: datadinhmuc?.Setting2,
            Setting3: datadinhmuc?.Setting3,
            Setting4: datadinhmuc?.Setting4,
            UPH1: datadinhmuc?.UPH1,
            UPH2: datadinhmuc?.UPH2,
            UPH3: datadinhmuc?.UPH3,
            UPH4: datadinhmuc?.UPH4,
            Step1: datadinhmuc?.Step1,
            Step2: datadinhmuc?.Step2,
            Step3: datadinhmuc?.Step3,
            Step4: datadinhmuc?.Step4,
            LOSS_SX1: datadinhmuc?.LOSS_SX1,
            LOSS_SX2: datadinhmuc?.LOSS_SX2,
            LOSS_SX3: datadinhmuc?.LOSS_SX3,
            LOSS_SX4: datadinhmuc?.LOSS_SX4,
            LOSS_SETTING1: datadinhmuc?.LOSS_SETTING1,
            LOSS_SETTING2: datadinhmuc?.LOSS_SETTING2,
            LOSS_SETTING3: datadinhmuc?.LOSS_SETTING3,
            LOSS_SETTING4: datadinhmuc?.LOSS_SETTING4,
            NOTE: datadinhmuc?.NOTE,
          })) ? "0" : "1";
          if (err_code === "1") {
            Swal.fire(
              "Thông báo",
              "Lưu thất bại, không được để trống ô cần thiết",
              "error",
            );
          } else {
            //loadQLSXPlan(selectedPlanDate);
            Swal.fire("Thông báo", "Lưu thành công", "success");
          }
        }
      })
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 Code để SET !", "error");
    }
  };
  const handleGetYCSXData = async () => {
    Swal.fire({
      title: 'Đang load dữ liệu YCSX...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
    let temp_dmsx = await f_loadDMSX(G_CODE);
    console.log(temp_dmsx)
    if (temp_dmsx.length > 0) {
      setDataDinhMuc(temp_dmsx[0]);
    }
    setRecentDMData(await f_getRecentDMData(G_CODE));
    let temp_data: YCSXTableData[] = await get1YCSXDATA(PROD_REQUEST_NO);
    setTempYCSX(temp_data);
    if (temp_data.length > 0) {
      let plan_temp = EQ_NAME.substring(0, 2);
      let UPH1: number = temp_data[0].UPH1 ?? 999999999;
      let UPH2: number = temp_data[0].UPH2 ?? 999999999;
      let UPH3: number = temp_data[0].UPH3 ?? 999999999;
      let UPH4: number = temp_data[0].UPH4 ?? 999999999;
      if (plan_temp === temp_data[0]?.EQ1) {
        setTempSLC(temp_data[0].SLC_CD1 ?? 0)
        setTempTON_CD(temp_data[0].TON_CD1 ?? 0)
        setTempCD(temp_data[0].CD1 ?? 0)
        setProcessNumber(1)
        setPlanEq(EQ_NAME)
        setPlanQty(temp_data[0].TON_CD1 <= 0 ? 0 : temp_data[0].TON_CD1 < UPH1 * qtyFactor ? temp_data[0].TON_CD1 : UPH1 * qtyFactor)
      }
      else if (plan_temp === temp_data[0]?.EQ2) {
        setTempSLC(temp_data[0].SLC_CD2 ?? 0)
        setTempTON_CD(temp_data[0].TON_CD2 ?? 0)
        setTempCD(temp_data[0].CD2 ?? 0)
        setProcessNumber(2)
        setPlanEq(EQ_NAME)
        setPlanQty(temp_data[0].TON_CD2 <= 0 ? 0 : temp_data[0].TON_CD2 < UPH2 * qtyFactor ? temp_data[0].TON_CD2 : UPH2 * qtyFactor)
      }
      else if (plan_temp === temp_data[0]?.EQ3) {
        setTempSLC(temp_data[0].SLC_CD3 ?? 0)
        setTempTON_CD(temp_data[0].TON_CD3 ?? 0)
        setTempCD(temp_data[0].CD3 ?? 0)
        setProcessNumber(3)
        setPlanEq(EQ_NAME)
        setPlanQty(temp_data[0].TON_CD3 <= 0 ? 0 : temp_data[0].TON_CD3 < UPH3 * qtyFactor ? temp_data[0].TON_CD3 : UPH3 * qtyFactor)
      }
      else if (plan_temp === temp_data[0]?.EQ4) {
        setTempSLC(temp_data[0].SLC_CD4 ?? 0)
        setTempTON_CD(temp_data[0].TON_CD4 ?? 0)
        setTempCD(temp_data[0].CD4 ?? 0)
        setProcessNumber(4)
        setPlanEq(EQ_NAME)
        setPlanQty(temp_data[0].TON_CD4 <= 0 ? 0 : temp_data[0].TON_CD4 < UPH4 * qtyFactor ? temp_data[0].TON_CD4 : UPH4 * qtyFactor)
      }
    }
    Swal.close();
  };
  const get1YCSXDATA = async (PROD_REQUEST_NO: string) => {
    let temp_data: YCSXTableData[] = [];
    await generalQuery("quickcheckycsx", {
      PROD_REQUEST_NO: PROD_REQUEST_NO,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          const loadeddata: YCSXTableData[] = response.data.data.map(
            (element: YCSXTableData, index: number) => {
              /* let DU1: number = element.PROD_REQUEST_QTY * (element.LOSS_SX1 * element.LOSS_SX2 + element.LOSS_SX1 * element.LOSS_SX3 + element.LOSS_SX1 * element.LOSS_SX4 + element.LOSS_SX1 * (element.LOSS_KT ?? 0)) * 1.0 / 10000;
              let DU2: number = element.PROD_REQUEST_QTY * (element.LOSS_SX2 * element.LOSS_SX3 + element.LOSS_SX2 * element.LOSS_SX4 + element.LOSS_SX2 * (element.LOSS_KT ?? 0)) * 1.0 / 10000;
              let DU3: number = element.PROD_REQUEST_QTY * (element.LOSS_SX3 * element.LOSS_SX4 + element.LOSS_SX3 * (element.LOSS_KT ?? 0)) * 1.0 / 10000;
              let DU4: number = element.PROD_REQUEST_QTY * (element.LOSS_SX4 * (element.LOSS_KT ?? 0)) * 1.0 / 10000; */
              let DU1: number = 0;
              let DU2: number = 0;
              let DU3: number = 0;
              let DU4: number = 0;
              let temp_TCD1: number = (element.EQ1 === 'NO' || element.EQ1 === 'NA') ? 0 : (element.SLC_CD1 ?? 0) - element.CD1 - Math.floor(DU1 * (1 - element.LOSS_SX1 * 1.0 / 100));
              let temp_TCD2: number = (element.EQ2 === 'NO' || element.EQ2 === 'NA') ? 0 : (element.SLC_CD2 ?? 0) - element.CD2 - Math.floor(DU2 * (1 - element.LOSS_SX2 * 1.0 / 100));
              let temp_TCD3: number = (element.EQ3 === 'NO' || element.EQ3 === 'NA') ? 0 : (element.SLC_CD3 ?? 0) - element.CD3 - Math.floor(DU3 * (1 - element.LOSS_SX3 * 1.0 / 100));
              let temp_TCD4: number = (element.EQ4 === 'NO' || element.EQ4 === 'NA') ? 0 : (element.SLC_CD4 ?? 0) - element.CD4 - Math.floor(DU4 * (1 - element.LOSS_SX4 * 1.0 / 100));
              /* if (temp_TCD1 < 0) {
                temp_TCD2 = temp_TCD2 - temp_TCD1;
              }
              if (temp_TCD2 < 0) {
                temp_TCD3 = temp_TCD3 - temp_TCD2;
              }
              if (temp_TCD3 < 0) {
                temp_TCD4 = temp_TCD4 - temp_TCD3;
              } */
              return {
                ...element,
                SLC_CD1: (element.EQ1 === 'NO' || element.EQ1 === 'NA') ? 0 : (element.SLC_CD1 ?? 0) - Math.floor(DU1 * (1 - element.LOSS_SX1 * 1.0 / 100)),
                SLC_CD2: (element.EQ2 === 'NO' || element.EQ2 === 'NA') ? 0 : (element.SLC_CD2 ?? 0) - Math.floor(DU2 * (1 - element.LOSS_SX2 * 1.0 / 100)),
                SLC_CD3: (element.EQ3 === 'NO' || element.EQ3 === 'NA') ? 0 : (element.SLC_CD3 ?? 0) - Math.floor(DU3 * (1 - element.LOSS_SX3 * 1.0 / 100)),
                SLC_CD4: (element.EQ4 === 'NO' || element.EQ4 === 'NA') ? 0 : (element.SLC_CD4 ?? 0) - Math.floor(DU4 * (1 - element.LOSS_SX4 * 1.0 / 100)),
                CD1: element.CD1 ?? 0,
                CD2: element.CD2 ?? 0,
                CD3: element.CD3 ?? 0,
                CD4: element.CD4 ?? 0,
                TON_CD1: (element.EQ1 === 'NO' || element.EQ1 === 'NA') ? 0 : temp_TCD1,
                TON_CD2: (element.EQ2 === 'NO' || element.EQ2 === 'NA') ? 0 : temp_TCD2,
                TON_CD3: (element.EQ3 === 'NO' || element.EQ3 === 'NA') ? 0 : temp_TCD3,
                TON_CD4: (element.EQ4 === 'NO' || element.EQ4 === 'NA') ? 0 : temp_TCD4,
              };
            },
          );
          temp_data = loadeddata;
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return temp_data;
  };
  const planDataTableAG = useMemo(() => {
    return (
      <AGTable
        showFilter={false}
        toolbar={
          <>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowHideYCSXTable(
                  showhideycsxtable === 3 ? 1 : showhideycsxtable + 1,
                );
              }}
            >
              <BiShow color="green" size={20} />
              Switch Tab
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                SaveExcel(plandatatable, "Plan Table");
              }}
            >
              <AiFillFileExcel color="green" size={15} />
              SAVE
            </IconButton>
            <span style={{ fontSize: 20, fontWeight: "bold" }}>
              Bảng tạm xắp PLAN
            </span>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                handle_AddBlankPlan();
              }}
            >
              <AiFillFolderAdd color="#69f542" size={15} />
              Add Blank PLAN
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                /* checkBP(
                  userData?.EMPL_NO,
                  userData?.MAINDEPTNAME,
                  ["QLSX"],
                  handleConfirmSavePlan
                ); */
                checkBP(
                  userData,
                  ["QLSX"],
                  ["ALL"],
                  ["ALL"],
                  handleConfirmSavePlan,
                );
                //handleConfirmSavePlan();
              }}
            >
              <AiFillSave color="blue" size={20} />
              LƯU PLAN
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                handleConfirmDeletePlan();
              }}
            >
              <FcDeleteRow color="yellow" size={20} />
              XÓA PLAN NHÁP
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                /* checkBP(
                  userData?.EMPL_NO,
                  userData?.MAINDEPTNAME,
                  ["QLSX"],
                  handleSaveQLSX
                ); */
                checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], handleSaveQLSX);
                //handleSaveQLSX();
              }}
            >
              <AiFillSave color="lightgreen" size={20} />
              Lưu Data Định Mức
            </IconButton>
          </>
        }
        columns={column_plandatatable}
        data={plandatatable}
        onCellEditingStopped={async (params: any) => {
          const keyvar = params.column.colId;
          let temp_ycsx_data: YCSXTableData[] = [];
          if (keyvar === "PROD_REQUEST_NO") {
            temp_ycsx_data = await get1YCSXDATA(params.value);
            //console.log('temp_ycsx_data',temp_ycsx_data)
            const newdata: QLSXPLANDATA[] = plandatatable.map((p) => {
              if (p.PLAN_ID === params.data.PLAN_ID) {
                if (keyvar === "PROD_REQUEST_NO") {
                  //console.log(keyvar);
                  if (temp_ycsx_data.length > 0) {
                    return {
                      ...p,
                      [keyvar]: params.value,
                      G_CODE: temp_ycsx_data[0].G_CODE,
                      G_NAME: temp_ycsx_data[0].G_NAME,
                      G_NAME_KD: temp_ycsx_data[0].G_NAME_KD,
                      PROD_REQUEST_QTY: temp_ycsx_data[0].PROD_REQUEST_QTY,
                      CURRENT_SLC: (temp_ycsx_data[0].SLC_CD1 ?? 0),
                      PLAN_QTY: temp_ycsx_data[0].TON_CD1 <= 0 ? 0 : temp_ycsx_data[0].TON_CD1 < temp_ycsx_data[0].UPH1 * qtyFactor ? temp_ycsx_data[0].TON_CD1 : temp_ycsx_data[0].UPH1 * qtyFactor,
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
                  //setPlanDataTable(newdata);
                  //console.log(temp_ycsx_data);
                } else {
                  console.log(keyvar);
                  return { ...p, [keyvar]: params.value };
                }
              } else {
                return p;
              }
            });
            localStorage.setItem("temp_plan_table", JSON.stringify(newdata));
            //console.table(newdata)
            setPlanDataTable(newdata);
          } else if (keyvar === "PLAN_EQ") {
            /* const newdata: QLSXPLANDATA[]= plandatatable.map((p) => {
              if (p.PLAN_ID === params.id) {
                if (keyvar === "PLAN_EQ") {
                  if (params.value.length === 4) {
                    let plan_temp = params.value.substring(0, 2);                    
                    if (plan_temp === p.EQ1 || plan_temp === p.EQ2 || plan_temp === p.EQ3 || plan_temp === p.EQ4) {
                      return { ...p, [keyvar]: params.value };
                    } else {
                      Swal.fire(
                        "Thông báo",
                        "Máy đã nhập ko giống trong BOM",
                        "warning",
                      );
                      return { ...p, [keyvar]: params.value };
                    }
                  } else {
                    Swal.fire("Thông báo", "Nhập máy không đúng", "error");
                    return { ...p, [keyvar]: "" };
                  }
                } else {
                  console.log(keyvar);
                  return { ...p, [keyvar]: params.value };
                }
              } else {
                return p;
              }
            }); */
            let current_PROD_REQUEST_NO: string | undefined = plandatatable.find(
              (element) => element.PLAN_ID === params.data.PLAN_ID,
            )?.PROD_REQUEST_NO;
            if (current_PROD_REQUEST_NO !== undefined) {
              temp_ycsx_data = await get1YCSXDATA(current_PROD_REQUEST_NO);
            }
            const newdata = plandatatable.map((p) => {
              if (p.PLAN_ID === params.data.PLAN_ID) {
                if (keyvar === "PLAN_EQ") {
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
                        CURRENT_SLC: (temp_ycsx_data[0].SLC_CD1 ?? 0),
                        CD1: temp_ycsx_data[0].CD1,
                        CD2: temp_ycsx_data[0].CD2,
                        CD3: temp_ycsx_data[0].CD3,
                        CD4: temp_ycsx_data[0].CD4,
                        TON_CD1: temp_ycsx_data[0].TON_CD1,
                        TON_CD2: temp_ycsx_data[0].TON_CD2,
                        TON_CD3: temp_ycsx_data[0].TON_CD3,
                        TON_CD4: temp_ycsx_data[0].TON_CD4,
                        PLAN_QTY:
                          temp_ycsx_data[0].TON_CD1 <= 0
                            ? 0
                            : temp_ycsx_data[0].TON_CD1 < UPH1 * qtyFactor
                              ? temp_ycsx_data[0].TON_CD1
                              : UPH1 * qtyFactor,
                      };
                    } else if (plan_temp === p.EQ2) {
                      return {
                        ...p,
                        [keyvar]: params.value,
                        PROCESS_NUMBER: 2,
                        CURRENT_SLC: (temp_ycsx_data[0].SLC_CD2 ?? 0),
                        CD1: temp_ycsx_data[0].CD1,
                        CD2: temp_ycsx_data[0].CD2,
                        CD3: temp_ycsx_data[0].CD3,
                        CD4: temp_ycsx_data[0].CD4,
                        TON_CD1: temp_ycsx_data[0].TON_CD1,
                        TON_CD2: temp_ycsx_data[0].TON_CD2,
                        TON_CD3: temp_ycsx_data[0].TON_CD3,
                        TON_CD4: temp_ycsx_data[0].TON_CD4,
                        PLAN_QTY:
                          temp_ycsx_data[0].TON_CD2 <= 0
                            ? 0
                            : temp_ycsx_data[0].TON_CD2 < UPH2 * qtyFactor
                              ? temp_ycsx_data[0].TON_CD2
                              : UPH2 * qtyFactor,
                      };
                    } else if (plan_temp === p.EQ3) {
                      return {
                        ...p,
                        [keyvar]: params.value,
                        PROCESS_NUMBER: 3,
                        CURRENT_SLC: (temp_ycsx_data[0].SLC_CD3 ?? 0),
                        CD1: temp_ycsx_data[0].CD1,
                        CD2: temp_ycsx_data[0].CD2,
                        CD3: temp_ycsx_data[0].CD3,
                        CD4: temp_ycsx_data[0].CD4,
                        TON_CD1: temp_ycsx_data[0].TON_CD1,
                        TON_CD2: temp_ycsx_data[0].TON_CD2,
                        TON_CD3: temp_ycsx_data[0].TON_CD3,
                        TON_CD4: temp_ycsx_data[0].TON_CD4,
                        PLAN_QTY:
                          temp_ycsx_data[0].TON_CD3 <= 0
                            ? 0
                            : temp_ycsx_data[0].TON_CD3 < UPH3 * qtyFactor
                              ? temp_ycsx_data[0].TON_CD3
                              : UPH3 * qtyFactor,
                      };
                    } else if (plan_temp === p.EQ4) {
                      return {
                        ...p,
                        [keyvar]: params.value,
                        PROCESS_NUMBER: 2,
                        CURRENT_SLC: (temp_ycsx_data[0].SLC_CD4 ?? 0),
                        CD1: temp_ycsx_data[0].CD1,
                        CD2: temp_ycsx_data[0].CD2,
                        CD3: temp_ycsx_data[0].CD3,
                        CD4: temp_ycsx_data[0].CD4,
                        TON_CD1: temp_ycsx_data[0].TON_CD1,
                        TON_CD2: temp_ycsx_data[0].TON_CD2,
                        TON_CD3: temp_ycsx_data[0].TON_CD3,
                        TON_CD4: temp_ycsx_data[0].TON_CD4,
                        PLAN_QTY:
                          temp_ycsx_data[0].TON_CD4 <= 0
                            ? 0
                            : temp_ycsx_data[0].TON_CD4 < UPH4 * qtyFactor
                              ? temp_ycsx_data[0].TON_CD4
                              : UPH4 * qtyFactor,
                      };
                    } else {
                      Swal.fire(
                        "Thông báo",
                        "Máy đã nhập ko giống trong BOM",
                        "warning",
                      );
                      return { ...p, [keyvar]: params.value };
                    }
                  } else {
                    Swal.fire("Thông báo", "Nhập máy không đúng", "error");
                    return { ...p, [keyvar]: "" };
                  }
                } else {
                  console.log(keyvar);
                  return { ...p, [keyvar]: params.value };
                }
              } else {
                return p;
              }
            });
            localStorage.setItem("temp_plan_table", JSON.stringify(newdata));
            setPlanDataTable(newdata);
          } else if (keyvar === "PROCESS_NUMBER") {
            let current_PROD_REQUEST_NO: string | undefined = plandatatable.find(
              (element) => element.PLAN_ID === params.data.PLAN_ID,
            )?.PROD_REQUEST_NO;
            if (current_PROD_REQUEST_NO !== undefined) {
              temp_ycsx_data = await get1YCSXDATA(current_PROD_REQUEST_NO);
            }
            const newdata = plandatatable.map((p) => {
              if (p.PLAN_ID === params.data.PLAN_ID) {
                if (keyvar === "PROCESS_NUMBER") {
                  let prnb: number = p.PROCESS_NUMBER;
                  if (prnb <= 4 && prnb >= 1) {
                    let UPH1: number = p.UPH1 ?? 999999999;
                    let UPH2: number = p.UPH2 ?? 999999999;
                    let UPH3: number = p.UPH3 ?? 999999999;
                    let UPH4: number = p.UPH4 ?? 999999999;
                    let UPH: number = prnb === 1 ? UPH1 : prnb === 2 ? UPH2 : prnb === 3 ? UPH3 : UPH4;
                    let TON: number = prnb === 1 ? (temp_ycsx_data[0].TON_CD1 ?? 0) : prnb === 2 ? (temp_ycsx_data[0].TON_CD2 ?? 0) : prnb === 3 ? (temp_ycsx_data[0].TON_CD3 ?? 0) : (temp_ycsx_data[0].TON_CD4 ?? 0);
                    let SLC: number = prnb === 1 ? (temp_ycsx_data[0].SLC_CD1 ?? 0) : prnb === 2 ? (temp_ycsx_data[0].SLC_CD2 ?? 0) : prnb === 3 ? (temp_ycsx_data[0].SLC_CD3 ?? 0) : (temp_ycsx_data[0].SLC_CD4 ?? 0);
                    return {
                      ...p,
                      [keyvar]: params.value,
                      CURRENT_SLC: SLC,
                      PLAN_EQ: '',
                      CD1: temp_ycsx_data[0].CD1,
                      CD2: temp_ycsx_data[0].CD2,
                      CD3: temp_ycsx_data[0].CD3,
                      CD4: temp_ycsx_data[0].CD4,
                      TON_CD1: temp_ycsx_data[0].TON_CD1,
                      TON_CD2: temp_ycsx_data[0].TON_CD2,
                      TON_CD3: temp_ycsx_data[0].TON_CD3,
                      TON_CD4: temp_ycsx_data[0].TON_CD4,
                      PLAN_QTY: TON <= 0 ? 0 : TON < UPH * qtyFactor ? TON : UPH * qtyFactor,
                    };
                  } else {
                    Swal.fire("Thông báo", "Nhập máy không đúng", "error");
                    return { ...p, [keyvar]: "" };
                  }
                } else {
                  console.log(keyvar);
                  return { ...p, [keyvar]: params.value };
                }
              } else {
                return p;
              }
            });
            localStorage.setItem("temp_plan_table", JSON.stringify(newdata));
            setPlanDataTable(newdata);
          }
          else {
            const newdata = plandatatable.map((p) => {
              if (p.PLAN_ID === params.id) {
                return { ...p, [keyvar]: params.value };
              } else {
                return p;
              }
            });
            localStorage.setItem("temp_plan_table", JSON.stringify(newdata));
            setPlanDataTable(newdata);
          }
        }}
        onCellClick={async (params: any) => {
          let rowData: QLSXPLANDATA = params.data;
          selectedPlan.current = rowData;
          setDataDinhMuc({
            ...datadinhmuc,
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
            NOTE: rowData.NOTE ?? "",
          });
          setRecentDMData(await f_getRecentDMData(rowData.G_CODE));
        }}
        onSelectionChange={(params: any) => {
          qlsxplandatafilter.current = params!.api.getSelectedRows()
        }} />
    )
  }, [plandatatable, datadinhmuc])
  useEffect(() => {
    handleGetYCSXData();
    getMachineList();
  }, []);
  return (
    <div className="addplandialog">
      <div className="planwindow">
        <span style={{ fontSize: '1rem', color: "#8f34b3", marginLeft: 20, fontWeight: 'bold' }}>
          {tempYCSX[0]?.G_CODE} | {PROD_REQUEST_NO} | {tempYCSX[0]?.G_NAME} |
          (<span style={{ color: 'blue' }}>
            {temp_SLC?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} EA
          </span> |
          <span style={{ color: 'green' }}>
            {temp_CD?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}EA
          </span> |
          <span style={{ color: 'red' }}>
            {temp_TON_CD?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}EA
          </span>)
        </span>
        <table className="table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', backgroundColor: 'rgba(255, 255, 255, 0.247)' }}>
          <thead>
            <tr style={{ alignItems: 'center' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 1 ? 'red' : 'black' }}>SLC1</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 2 ? 'red' : 'black' }}>SLC2</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 3 ? 'red' : 'black' }}>SLC3</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 4 ? 'red' : 'black' }}>SLC4</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 1 ? 'red' : 'black' }}>CD1</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 2 ? 'red' : 'black' }}>CD2</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 3 ? 'red' : 'black' }}>CD3</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 4 ? 'red' : 'black' }}>CD4</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 1 ? 'red' : 'black' }}>TC1</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 2 ? 'red' : 'black' }}>TC2</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 3 ? 'red' : 'black' }}>TC3</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 4 ? 'red' : 'black' }}>TC4</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 1 ? 'red' : 'black' }}>{tempYCSX[0]?.SLC_CD1?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? 0}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 2 ? 'red' : 'black' }}>{tempYCSX[0]?.SLC_CD2?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? 0}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 3 ? 'red' : 'black' }}>{tempYCSX[0]?.SLC_CD3?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? 0}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 4 ? 'red' : 'black' }}>{tempYCSX[0]?.SLC_CD4?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? 0}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 1 ? 'red' : 'black' }}>{tempYCSX[0]?.CD1?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? 0}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 2 ? 'red' : 'black' }}>{tempYCSX[0]?.CD2?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? 0}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 3 ? 'red' : 'black' }}>{tempYCSX[0]?.CD3?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? 0}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 4 ? 'red' : 'black' }}>{tempYCSX[0]?.CD4?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? 0}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 1 ? 'red' : 'black' }}>{tempYCSX[0]?.TON_CD1?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? 0}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 2 ? 'red' : 'black' }}>{tempYCSX[0]?.TON_CD2?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? 0}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 3 ? 'red' : 'black' }}>{tempYCSX[0]?.TON_CD3?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? 0}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: processnumber === 4 ? 'red' : 'black' }}>{tempYCSX[0]?.TON_CD4?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? 0}</td>
            </tr>
          </tbody>
        </table>
        <div className="dinhmucdiv" style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <div className="datadinhmucto">
            <div className="datadinhmuc" >
              <div className="forminputcolumn">
                <label>
                  <b>EQ1:</b>
                  <select
                    name="phanloai"
                    value={datadinhmuc?.EQ1}
                    onChange={(e) =>
                      setDataDinhMuc({ ...datadinhmuc, EQ1: e.target.value })
                    }
                    style={{ height: 22 }}
                  >
                    {machine_list.map((ele: MACHINE_LIST, index: number) => {
                      return (
                        <option key={index} value={ele.EQ_NAME}>
                          {ele.EQ_NAME}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <label>
                  <b>Setting1(min):</b>{" "}
                  <input
                    type="text"
                    placeholder="Thời gian setting 1"
                    value={datadinhmuc?.Setting1}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        Setting1: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>UPH1(EA/h):</b>{" "}
                  <input
                    type="text"
                    placeholder="Tốc độ sx 1"
                    value={datadinhmuc?.UPH1}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        UPH1: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>Step1:</b>{" "}
                  <input
                    type="text"
                    placeholder="Số bước 1"
                    value={datadinhmuc?.Step1}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        Step1: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>LOSS_SX1(%): <span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 1)[0]?.LOSS_SX?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? ""}%)</span></b>{" "}
                  <input
                    type="text"
                    placeholder="% loss sx 1"
                    value={datadinhmuc?.LOSS_SX1}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        LOSS_SX1: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>LOSS SETTING1 (m):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 1)[0]?.TT_SETTING_MET?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? ""}m)</span></b>{" "}
                  <input
                    type="text"
                    placeholder="met setting 1"
                    value={datadinhmuc?.LOSS_SETTING1}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        LOSS_SETTING1: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>FACTORY:</b>
                  <select
                    name="phanloai"
                    value={
                      datadinhmuc?.FACTORY === null
                        ? "NA"
                        : datadinhmuc?.FACTORY
                    }
                    onChange={(e) => {
                      setDataDinhMuc({
                        ...datadinhmuc,
                        FACTORY: e.target.value,
                      });
                    }}
                    style={{ height: 22 }}
                  >
                    <option value="NA">NA</option>
                    <option value="NM1">NM1</option>
                    <option value="NM2">NM2</option>
                  </select>
                </label>
              </div>
              <div className="forminputcolumn">
                <label>
                  <b>EQ2:</b>
                  <select
                    name="phanloai"
                    value={datadinhmuc?.EQ2}
                    onChange={(e) =>
                      setDataDinhMuc({ ...datadinhmuc, EQ2: e.target.value })
                    }
                    style={{ height: 22 }}
                  >
                    {machine_list.map((ele: MACHINE_LIST, index: number) => {
                      return (
                        <option key={index} value={ele.EQ_NAME}>
                          {ele.EQ_NAME}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <label>
                  <b>Setting2(min):</b>{" "}
                  <input
                    type="text"
                    placeholder="Thời gian setting 2"
                    value={datadinhmuc?.Setting2}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        Setting2: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>UPH2(EA/h):</b>{" "}
                  <input
                    type="text"
                    placeholder="Tốc độ sx 2"
                    value={datadinhmuc?.UPH2}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        UPH2: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>Step2:</b>{" "}
                  <input
                    type="text"
                    placeholder="Số bước 2"
                    value={datadinhmuc?.Step2}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        Step2: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>LOSS_SX2(%):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 2)[0]?.LOSS_SX?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? ""}%)</span></b>{" "}
                  <input
                    type="text"
                    placeholder="% loss sx 2"
                    value={datadinhmuc?.LOSS_SX2}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        LOSS_SX2: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>LOSS SETTING2 (m):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 2)[0]?.TT_SETTING_MET?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? ""}m)</span></b>{" "}
                  <input
                    type="text"
                    placeholder="met setting 2"
                    value={datadinhmuc?.LOSS_SETTING2}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        LOSS_SETTING2: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>NOTE (QLSX):</b>{" "}
                  <input
                    type="text"
                    placeholder="Chú ý"
                    value={datadinhmuc?.NOTE}
                    onChange={(e) =>
                      setDataDinhMuc({ ...datadinhmuc, NOTE: e.target.value })
                    }
                  ></input>
                </label>
              </div>
              <div className="forminputcolumn">
                <label>
                  <b>EQ3:</b>
                  <select
                    name="phanloai"
                    value={datadinhmuc?.EQ3}
                    onChange={(e) =>
                      setDataDinhMuc({ ...datadinhmuc, EQ3: e.target.value })
                    }
                    style={{ height: 22 }}
                  >
                    {machine_list.map((ele: MACHINE_LIST, index: number) => {
                      return (
                        <option key={index} value={ele.EQ_NAME}>
                          {ele.EQ_NAME}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <label>
                  <b>Setting3(min):</b>{" "}
                  <input
                    type="text"
                    placeholder="Thời gian setting 3"
                    value={datadinhmuc?.Setting3}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        Setting3: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>UPH3(EA/h):</b>{" "}
                  <input
                    type="text"
                    placeholder="Tốc độ sx 1"
                    value={datadinhmuc?.UPH3}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        UPH3: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>Step3:</b>{" "}
                  <input
                    type="text"
                    placeholder="Số bước 3"
                    value={datadinhmuc?.Step3}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        Step3: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>LOSS_SX3(%):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 3)[0]?.LOSS_SX?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? ""}%)</span></b>{" "}
                  <input
                    type="text"
                    placeholder="% loss sx 3"
                    value={datadinhmuc?.LOSS_SX3}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        LOSS_SX3: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>LOSS SETTING3 (m):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 3)[0]?.TT_SETTING_MET?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? ""}m)</span></b>{" "}
                  <input
                    type="text"
                    placeholder="met setting 3"
                    value={datadinhmuc?.LOSS_SETTING3}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        LOSS_SETTING3: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>FACTORY:</b>
                  <select
                    name="phanloai"
                    value={
                      datadinhmuc?.FACTORY === null
                        ? "NA"
                        : datadinhmuc?.FACTORY
                    }
                    onChange={(e) => {
                      setDataDinhMuc({
                        ...datadinhmuc,
                        FACTORY: e.target.value,
                      });
                    }}
                    style={{ height: 22 }}
                  >
                    <option value="NA">NA</option>
                    <option value="NM1">NM1</option>
                    <option value="NM2">NM2</option>
                  </select>
                </label>
              </div>
              <div className="forminputcolumn">
                <label>
                  <b>EQ4:</b>
                  <select
                    name="phanloai"
                    value={datadinhmuc?.EQ4}
                    onChange={(e) =>
                      setDataDinhMuc({ ...datadinhmuc, EQ4: e.target.value })
                    }
                    style={{ height: 22 }}
                  >
                    {machine_list.map((ele: MACHINE_LIST, index: number) => {
                      return (
                        <option key={index} value={ele.EQ_NAME}>
                          {ele.EQ_NAME}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <label>
                  <b>Setting4(min):</b>{" "}
                  <input
                    type="text"
                    placeholder="Thời gian setting 4"
                    value={datadinhmuc?.Setting4}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        Setting4: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>UPH4(EA/h):</b>{" "}
                  <input
                    type="text"
                    placeholder="Tốc độ sx 2"
                    value={datadinhmuc?.UPH4}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        UPH4: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>Step4:</b>{" "}
                  <input
                    type="text"
                    placeholder="Số bước 4"
                    value={datadinhmuc?.Step4}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        Step4: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>LOSS_SX4(%):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 4)[0]?.LOSS_SX?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? ""}%)</span></b>{" "}
                  <input
                    type="text"
                    placeholder="% loss sx 4"
                    value={datadinhmuc?.LOSS_SX4}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        LOSS_SX4: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>LOSS SETTING4 (m):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 4)[0]?.TT_SETTING_MET?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? ""}m)</span></b>{" "}
                  <input
                    type="text"
                    placeholder="met setting 4"
                    value={datadinhmuc?.LOSS_SETTING4}
                    onChange={(e) =>
                      setDataDinhMuc({
                        ...datadinhmuc,
                        LOSS_SETTING4: Number(e.target.value),
                      })
                    }
                  ></input>
                </label>
                <label>
                  <b>NOTE (QLSX):</b>{" "}
                  <input
                    type="text"
                    placeholder="Chú ý"
                    value={datadinhmuc?.NOTE}
                    onChange={(e) =>
                      setDataDinhMuc({ ...datadinhmuc, NOTE: e.target.value })
                    }
                  ></input>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>PLAN_DATE:</b>
                <input style={{ color: 'black', fontWeight: 'bold' }} type="date" value={plan_date.slice(0, 10)} onChange={(e) => setPlanDate(e.target.value)}></input>
              </label>
              <label>
                <b>PLAN_QTY:</b>
                <input style={{ color: 'black', fontWeight: 'bold' }} type="text" value={planqty} onChange={(e) => setPlanQty(Number(e.target.value))}></input>
              </label>
              <label>
                <b>PROCESS_NUMBER:</b>
                <input style={{ color: 'black', fontWeight: 'bold' }} type="text" value={processnumber} onChange={(e) => {
                  const temp_processnumber = Number(e.target.value)
                  if (temp_processnumber > 0 && temp_processnumber < 5) {
                    setProcessNumber(temp_processnumber)
                    let UPH1: number = tempYCSX[0].UPH1 ?? 999999999;
                    let UPH2: number = tempYCSX[0].UPH2 ?? 999999999;
                    let UPH3: number = tempYCSX[0].UPH3 ?? 999999999;
                    let UPH4: number = tempYCSX[0].UPH4 ?? 999999999;
                    if(temp_processnumber === 1)
                    {
                      setTempSLC(tempYCSX[0].SLC_CD1 ?? 0)
                      setTempCD(tempYCSX[0].CD1 ?? 0)
                      setTempTON_CD(tempYCSX[0].TON_CD1 ?? 0)
                      setPlanQty(tempYCSX[0].TON_CD1 <= 0 ? 0 : tempYCSX[0].TON_CD1 < UPH1 * qtyFactor ? tempYCSX[0].TON_CD1 : UPH1 * qtyFactor)
                    }
                    else if(temp_processnumber === 2)
                    {
                      setTempSLC(tempYCSX[0].SLC_CD2 ?? 0)
                      setTempCD(tempYCSX[0].CD2 ?? 0)
                      setTempTON_CD(tempYCSX[0].TON_CD2 ?? 0)
                      setPlanQty(tempYCSX[0].TON_CD2 <= 0 ? 0 : tempYCSX[0].TON_CD2 < UPH2 * qtyFactor ? tempYCSX[0].TON_CD2 : UPH2 * qtyFactor)
                    }
                    else if(temp_processnumber === 3)
                    {
                      setTempSLC(tempYCSX[0].SLC_CD3 ?? 0)
                      setTempCD(tempYCSX[0].CD3 ?? 0)
                      setTempTON_CD(tempYCSX[0].TON_CD3 ?? 0)
                      setPlanQty(tempYCSX[0].TON_CD3 <= 0 ? 0 : tempYCSX[0].TON_CD3 < UPH3 * qtyFactor ? tempYCSX[0].TON_CD3 : UPH3 * qtyFactor)
                    } 
                    else if(temp_processnumber === 4)
                    {
                      setTempSLC(tempYCSX[0].SLC_CD4 ?? 0)
                      setTempCD(tempYCSX[0].CD4 ?? 0)
                      setTempTON_CD(tempYCSX[0].TON_CD4 ?? 0)
                      setPlanQty(tempYCSX[0].TON_CD4 <= 0 ? 0 : tempYCSX[0].TON_CD4 < UPH4 * qtyFactor ? tempYCSX[0].TON_CD4 : UPH4 * qtyFactor)
                    } 

                  }
                  else {
                    setProcessNumber(0)
                  }
                  }}></input>
              </label>
              <label>
                <b>STEP:</b>
                <input style={{ color: 'black', fontWeight: 'bold' }} type="text" value={stepnumber} onChange={(e) => setStepNumber(Number(e.target.value))}></input>
              </label>
              <label>
                <b>PLAN_EQ:</b>
                <input style={{ color: 'black', fontWeight: 'bold' }} type="text" value={planeq} onChange={(e) =>{ 
                  setPlanEq(e.target.value.toUpperCase())
                  if(e.target.value.length > 3)
                  {
                    let plan_temp = e.target.value.substring(0, 2).toUpperCase();
                    let UPH1: number = tempYCSX[0].UPH1 ?? 999999999;
                  let UPH2: number = tempYCSX[0].UPH2 ?? 999999999;
                  let UPH3: number = tempYCSX[0].UPH3 ?? 999999999;
                  let UPH4: number = tempYCSX[0].UPH4 ?? 999999999;
                  if (plan_temp === tempYCSX[0]?.EQ1) {
                    setTempSLC(tempYCSX[0].SLC_CD1 ?? 0)
                    setTempTON_CD(tempYCSX[0].TON_CD1 ?? 0)
                    setTempCD(tempYCSX[0].CD1 ?? 0)
                    setProcessNumber(1)
                    setPlanQty(tempYCSX[0].TON_CD1 <= 0 ? 0 : tempYCSX[0].TON_CD1 < UPH1 * qtyFactor ? tempYCSX[0].TON_CD1 : UPH1 * qtyFactor)
                  }
                  else if (plan_temp === tempYCSX[0]?.EQ2) {
                    setTempSLC(tempYCSX[0].SLC_CD2 ?? 0)
                    setTempTON_CD(tempYCSX[0].TON_CD2 ?? 0)
                    setTempCD(tempYCSX[0].CD2 ?? 0)
                    setProcessNumber(2)
                    setPlanQty(tempYCSX[0].TON_CD2 <= 0 ? 0 : tempYCSX[0].TON_CD2 < UPH2 * qtyFactor ? tempYCSX[0].TON_CD2 : UPH2 * qtyFactor)
                  }
                  else if (plan_temp === tempYCSX[0]?.EQ3) {
                    setTempSLC(tempYCSX[0].SLC_CD3 ?? 0)
                    setTempTON_CD(tempYCSX[0].TON_CD3 ?? 0)
                    setTempCD(tempYCSX[0].CD3 ?? 0)
                    setProcessNumber(3)
                    setPlanQty(tempYCSX[0].TON_CD3 <= 0 ? 0 : tempYCSX[0].TON_CD3 < UPH3 * qtyFactor ? tempYCSX[0].TON_CD3 : UPH3 * qtyFactor)
                  }
                  else if (plan_temp === tempYCSX[0]?.EQ4) {
                    setTempSLC(tempYCSX[0].SLC_CD4 ?? 0)
                    setTempTON_CD(tempYCSX[0].TON_CD4 ?? 0)
                    setTempCD(tempYCSX[0].CD4 ?? 0)
                    setProcessNumber(4)
                    setPlanQty(tempYCSX[0].TON_CD4 <= 0 ? 0 : tempYCSX[0].TON_CD4 < UPH4 * qtyFactor ? tempYCSX[0].TON_CD4 : UPH4 * qtyFactor)
                  }
                }
                  }}></input>
              </label>
              <label>
                <b>NEXT PLAN:</b>
                <input style={{ color: 'black', fontWeight: 'bold' }} type="text" value={nextplan} onChange={(e) => setNextPlan(e.target.value)}></input>
              </label>
              <label>
                <b>FACTORY:</b>
                <select
                  style={{ color: 'black', fontWeight: 'bold' }}
                  value={plan_factory}
                  onChange={(e) => setPlanFactory(e.target.value)}
                >
                  <option value="NM1">NM1</option>
                  <option value="NM2">NM2</option>
                </select>
              </label>
              <label>
                <b>IS_SETTING:</b>{" "}
                <input
                  type='checkbox'
                  name='alltimecheckbox'
                  checked={isSetting}
                  onChange={async (e) => {
                    setIsSetting(e.target.checked);
                  }
                  }
                  onBlur={(e) => {
                  }}
                ></input>
              </label>
            </div>
          </div>
        </div>
        <div className="formbutton">
          <IconButton
            className="buttonIcon"
            onClick={() => {
              handleGetYCSXData();
              getMachineList();
            }}
          >
            <FaArrowRight color="green" size={15} />
            Reload
          </IconButton>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              handleConfirmSetClosedYCSX();
            }}
          >
            <FaArrowRight color="green" size={15} />
            SET CLOSED
          </IconButton>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              handleConfirmSetPendingYCSX();
            }}
          >
            <MdOutlinePendingActions color="red" size={15} />
            SET PENDING
          </IconButton>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], handleSaveQLSX);
            }}
          >
            <AiFillSave color="lightgreen" size={20} />
            Lưu Data Định Mức
          </IconButton>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              checkBP(
                userData,
                ["QLSX"],
                ["ALL"],
                ["ALL"],
                handleConfirmSavePlan,
              );
            }}
          >
            <AiFillSave color="blue" size={20} />
            LƯU PLAN
          </IconButton>
        </div>
      </div>
    </div>
  );
};
export default AddPlanDialog;
