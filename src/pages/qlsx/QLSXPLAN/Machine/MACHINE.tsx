/* eslint-disable no-loop-func */
import React, { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import MACHINE_COMPONENT from "./MACHINE_COMPONENT";
import "./MACHINE.scss";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode, getCompany, uploadQuery } from "../../../../api/Api";
import moment from "moment";
import { Button, IconButton } from "@mui/material";
import {
  AiFillFolderAdd,
  AiFillSave,
  AiOutlineArrowRight,
  AiOutlineBarcode,
  AiOutlineCloudUpload,
  AiOutlinePrinter,
} from "react-icons/ai";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaArrowRight, FaWarehouse } from "react-icons/fa";
import { FcDeleteRow, FcSearch } from "react-icons/fc";
import { checkBP, PLAN_ID_ARRAY, zeroPad } from "../../../../api/GlobalFunction";
import YCSXComponent from "../../../kinhdoanh/ycsxmanager/YCSXComponent/YCSXComponent";
import DrawComponent from "../../../kinhdoanh/ycsxmanager/DrawComponent/DrawComponent";
import { useReactToPrint } from "react-to-print";
import CHITHI_COMPONENT from "../CHITHI/CHITHI_COMPONENT";
import { BiRefresh, BiReset } from "react-icons/bi";
import YCKT from "../YCKT/YCKT";
import { GiCurvyKnife } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { resetChithiArray } from "../../../../redux/slices/globalSlice";
import CHITHI_COMPONENT2 from "../CHITHI/CHITHI_COMPONENT2";
import KHOAO from "../KHOAO/KHOAO";
import { TbLogout } from "react-icons/tb";
import {
  DINHMUC_QSLX,
  EQ_STATUS,
  LICHSUINPUTLIEUSX,
  LICHSUNHAPKHOAO,
  LICHSUXUATKHOAO,
  MACHINE_LIST,
  QLSXCHITHIDATA,
  QLSXPLANDATA,
  RecentDM,
  TONLIEUXUONG,
  UserData,
  YCSXTableData,
} from "../../../../api/GlobalInterface";
import AGTable from "../../../../components/DataTable/AGTable";
import { AgGridReact } from "ag-grid-react";
export const checkEQvsPROCESS = (EQ1: string, EQ2: string, EQ3: string, EQ4: string) => {
  let maxprocess: number = 0;
  if (["NA", "NO", "", null].indexOf(EQ1) === -1) maxprocess++;
  if (["NA", "NO", "", null].indexOf(EQ2) === -1) maxprocess++;
  if (["NA", "NO", "", null].indexOf(EQ3) === -1) maxprocess++;
  if (["NA", "NO", "", null].indexOf(EQ4) === -1) maxprocess++;
  return maxprocess;
};
export const renderChiThi = (planlist: QLSXPLANDATA[], ref: any) => {
  return planlist.map((element, index) => (
    <CHITHI_COMPONENT ref={ref} key={index} DATA={element} />
    /*  <>
     <CHITHI_COMPONENT key={index} DATA={element} />
     <CHECKSHEETSX key={index+'A'} DATA={element}/>
     </> */
  ));
};
export const renderChiThi2 = (planlist: QLSXPLANDATA[], ref: any) => {
  //console.log(planlist);
  return <CHITHI_COMPONENT2 ref={ref} PLAN_LIST={planlist} />;
};
export const renderYCSX = (ycsxlist: YCSXTableData[]) => {
  return ycsxlist.map((element, index) => (
    <YCSXComponent key={index} DATA={element} />
  ));
};
export const renderBanVe = (ycsxlist: YCSXTableData[]) => {
  return ycsxlist.map((element, index) =>
    element.BANVE === "Y" ? (
      <DrawComponent
        key={index}
        G_CODE={element.G_CODE}
        PDBV={element.PDBV}
        PROD_REQUEST_NO={element.PROD_REQUEST_NO}
        PDBV_EMPL={element.PDBV_EMPL}
        PDBV_DATE={element.PDBV_DATE}
      />
    ) : (
      <div>Code: {element.G_NAME} : Không có bản vẽ</div>
    )
  );
};
export const saveSinglePlan = async (planToSave: QLSXPLANDATA) => {
  let check_NEXT_PLAN_ID: boolean = true;
  let checkPlanIdP500: boolean = false;
  let err_code: string = '0';
  await generalQuery("checkP500PlanID_mobile", {
    PLAN_ID: planToSave?.PLAN_ID,
  })
  .then((response) => {
    //console.log(response.data);
    if (response.data.tk_status !== "NG") {
      checkPlanIdP500 = true;
    } else {
      checkPlanIdP500 = false;
    }
  })
  .catch((error) => {
    console.log(error);
  });
  let {NEEDED_QTY,FINAL_LOSS_SX,FINAL_LOSS_KT, FINAL_LOSS_SETTING} = await getCurrentDMToSave(planToSave); 

  if (
    parseInt(planToSave?.PROCESS_NUMBER.toString()) >=
    1 &&
    parseInt(planToSave?.PROCESS_NUMBER.toString()) <=
    4 &&
    planToSave?.PLAN_QTY !== 0 &&
    planToSave?.PLAN_QTY <=
    planToSave?.PROD_REQUEST_QTY &&
    planToSave?.PLAN_ID !==
    planToSave?.NEXT_PLAN_ID &&
    planToSave?.CHOTBC !== "V" &&
    check_NEXT_PLAN_ID &&
    parseInt(planToSave?.STEP.toString()) >= 0 &&
    parseInt(planToSave?.STEP.toString()) <= 9 &&
    checkEQvsPROCESS(
      planToSave?.EQ1,
      planToSave?.EQ2,
      planToSave?.EQ3,
      planToSave?.EQ4
    ) >= planToSave?.PROCESS_NUMBER &&
    checkPlanIdP500 === false
  ) {
    await generalQuery("updatePlanQLSX", {
      PLAN_ID: planToSave?.PLAN_ID,
      STEP: planToSave?.STEP,
      PLAN_QTY: planToSave?.PLAN_QTY,
      OLD_PLAN_QTY: planToSave?.PLAN_QTY,
      PLAN_LEADTIME: planToSave?.PLAN_LEADTIME,
      PLAN_EQ: planToSave?.PLAN_EQ,
      PLAN_ORDER: planToSave?.PLAN_ORDER,
      PROCESS_NUMBER: planToSave?.PROCESS_NUMBER,
      KETQUASX: planToSave?.KETQUASX ?? 0,
      NEXT_PLAN_ID: planToSave?.NEXT_PLAN_ID ?? "X",
      IS_SETTING: planToSave?.IS_SETTING?.toUpperCase(),
      NEEDED_QTY:  NEEDED_QTY,
      CURRENT_LOSS_SX: FINAL_LOSS_SX,
      CURRENT_LOSS_KT: FINAL_LOSS_KT,
      CURRENT_SETTING_M: FINAL_LOSS_SETTING,
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
  } else {
    err_code += "_" + planToSave?.G_NAME_KD + ":";
    if (
      !(
        parseInt(planToSave?.PROCESS_NUMBER.toString()) >=
        1 &&
        parseInt(planToSave?.PROCESS_NUMBER.toString()) <=
        4
      )
    ) {
      err_code += "_: Process number chưa đúng";
    } else if (planToSave?.PLAN_QTY === 0) {
      err_code += "_: Số lượng chỉ thị =0";
    } else if (
      planToSave?.PLAN_QTY >
      planToSave?.PROD_REQUEST_QTY
    ) {
      err_code += "_: Số lượng chỉ thị lớn hơn số lượng yêu cầu sx";
    } else if (
      planToSave?.PLAN_ID ===
      planToSave?.NEXT_PLAN_ID
    ) {
      err_code += "_: NEXT_PLAN_ID không được giống PLAN_ID hiện tại";
    } else if (!check_NEXT_PLAN_ID) {
      err_code +=
        "_: NEXT_PLAN_ID không giống với PLAN_ID ở dòng tiếp theo";
    } else if (planToSave?.CHOTBC === "V") {
      err_code +=
        "_: Chỉ thị đã chốt báo cáo, sẽ ko sửa được, thông tin các chỉ thị khác trong máy được lưu thành công";
    } else if (
      !(
        parseInt(planToSave?.STEP.toString()) >= 0 &&
        parseInt(planToSave?.STEP.toString()) <= 9
      )
    ) {
      err_code += "_: Hãy nhập STEP từ 0 -> 9";
    } else if (
      !(
        parseInt(planToSave?.PROCESS_NUMBER.toString()) >=
        1 &&
        parseInt(planToSave?.PROCESS_NUMBER.toString()) <=
        4
      )
    ) {
      err_code += "_: Hãy nhập PROCESS NUMBER từ 1 đến 4";
    } else if (checkPlanIdP500) {
      err_code += "_: Đã bắn liệu vào sản xuất, không sửa chỉ thị được";
    }
  }
  if (err_code !== "0") {
    Swal.fire("Thông báo", "Có lỗi !" + err_code, "error");
  } else {
    Swal.fire("Thông báo", "Lưu PLAN thành công", "success");
  }
}
export const getCurrentDMToSave = async(planData: QLSXPLANDATA) => {
  let NEEDED_QTY: number = planData.PLAN_QTY ,FINAL_LOSS_SX: number = 0, FINAL_LOSS_KT: number = planData?.LOSS_KT ?? 0, FINAL_LOSS_SETTING: number = 0, PD: number = planData.PD ?? 0, CAVITY: number =  planData.CAVITY ?? 0;

        if (planData.PROCESS_NUMBER === 1) {
          FINAL_LOSS_SX = (planData.LOSS_SX2 ?? 0) + (planData.LOSS_SX3 ?? 0) + (planData.LOSS_SX4 ?? 0) ;
        } else if (planData.PROCESS_NUMBER === 2) {
          FINAL_LOSS_SX = (planData.LOSS_SX3 ?? 0) + (planData.LOSS_SX4 ?? 0) ;
        } else if (planData.PROCESS_NUMBER === 3) {
          FINAL_LOSS_SX = (planData.LOSS_SX4 ?? 0) ;
        } else if (planData.PROCESS_NUMBER === 4) {
          FINAL_LOSS_SX = 0;
        }
        if (planData.PROCESS_NUMBER === 1) {
          FINAL_LOSS_SETTING = (planData.LOSS_SETTING2 ?? 0) + (planData.LOSS_SETTING3 ?? 0) + (planData.LOSS_SETTING4 ?? 0);
        } else if (planData.PROCESS_NUMBER === 2) {
          FINAL_LOSS_SETTING = (planData.LOSS_SETTING3 ?? 0) + (planData.LOSS_SETTING4 ?? 0);
        } else if (planData.PROCESS_NUMBER === 3) {
          FINAL_LOSS_SETTING = (planData.LOSS_SETTING4 ?? 0);
        } else if (planData.PROCESS_NUMBER === 4) {
          FINAL_LOSS_SETTING = 0;
        }

        NEEDED_QTY = NEEDED_QTY*(100+FINAL_LOSS_SX+FINAL_LOSS_KT)/100 + FINAL_LOSS_SETTING/PD*CAVITY*1000;

        /* console.log("PD",PD);
        console.log("CAVITY",CAVITY);        
        console.log("sx loss",FINAL_LOSS_SX)
        console.log("sx setting",FINAL_LOSS_SETTING)
        console.log("kt lss",FINAL_LOSS_KT)
        console.log("Needed_qty",NEEDED_QTY); */

        return {
          NEEDED_QTY: Math.round(NEEDED_QTY),
          FINAL_LOSS_SX: FINAL_LOSS_SX,
          FINAL_LOSS_KT: planData.LOSS_KT,
          FINAL_LOSS_SETTING: FINAL_LOSS_SETTING
        }
}
const MACHINE = () => {
  const myComponentRef = useRef();
  const [recentDMData, setRecentDMData] = useState<RecentDM[]>([])
  const getRecentDM = (G_CODE: string) => {
    generalQuery("loadRecentDM", { G_CODE: G_CODE })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: RecentDM[] = response.data.data.map(
            (element: RecentDM, index: number) => {
              return {
                ...element,
              };
            },
          );
          setRecentDMData(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
          setRecentDMData([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const chithiarray: QLSXPLANDATA[] | undefined = useSelector(
    (state: RootState) => state.totalSlice.multiple_chithi_array
  );
  const dispatch = useDispatch();
  const [currentPlanPD, setCurrentPlanPD] = useState(0);
  const [currentPlanCAVITY, setCurrentPlanCAVITY] = useState(0);
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const [selection, setSelection] = useState<any>({
    tab1: true,
    tab2: false,
    tab3: false,
    tabycsx: false,
    tabbanve: false,
  });
  const setNav = (choose: number) => {
    if (choose === 1) {
      setSelection({ ...selection, tab1: true, tab2: false, tab3: false });
    } else if (choose === 2) {
      setSelection({ ...selection, tab1: false, tab2: true, tab3: false });
    } else if (choose === 3) {
      setSelection({ ...selection, tab1: false, tab2: false, tab3: true });
    }
  };
  const [eq_status, setEQ_STATUS] = useState<EQ_STATUS[]>([]);
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
  const [chithidatatable, setChiThiDataTable] = useState<QLSXCHITHIDATA[]>([]);
  const [showplanwindow, setShowPlanWindow] = useState(false);
  const [showkhoao, setShowKhoAo] = useState(false);
  const userData: UserData | undefined = useSelector((state: RootState) => state.totalSlice.userData);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [empl_name, setEmpl_Name] = useState("");
  const [cust_name, setCust_Name] = useState("");
  const [prod_type, setProdType] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [phanloai, setPhanLoai] = useState("00");
  const [material, setMaterial] = useState("");
  const [ycsxdatatable, setYcsxDataTable] = useState<Array<YCSXTableData>>([]);
  const ycsxdatatablefilter = useRef<YCSXTableData[]>([]);
  const qlsxplandatafilter = useRef<Array<QLSXPLANDATA>>([]);
  const qlsxchithidatafilter = useRef<Array<QLSXCHITHIDATA>>([]);
  const [showYCSX, setShowYCSX] = useState(true);
  const [ycsxpendingcheck, setYCSXPendingCheck] = useState(false);
  const [inspectInputcheck, setInspectInputCheck] = useState(false);
  const [ycsxlistrender, setYCSXListRender] = useState<Array<ReactElement>>();
  const [chithilistrender, setChiThiListRender] = useState<Array<ReactElement>>();
  const [chithilistrender2, setChiThiListRender2] = useState<ReactElement>();
  const [ycktlistrender, setYCKTListRender] = useState<Array<ReactElement>>();
  const [selectedMachine, setSelectedMachine] = useState("FR1");
  const [selectedFactory, setSelectedFactory] = useState("NM1");
  const [selectedPlanDate, setSelectedPlanDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectedPlan, setSelectedPlan] = useState<QLSXPLANDATA>();
  const [showChiThi, setShowChiThi] = useState(false);
  const [showChiThi2, setShowChiThi2] = useState(false);
  const [showYCKT, setShowYCKT] = useState(false);
  const [trigger, setTrigger] = useState(true);
  const ycsxprintref = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => ycsxprintref.current,
  });
  const [maxLieu, setMaxLieu] = useState(12);
  const [eq_series, setEQ_SERIES] = useState<string[]>([]);
  const checkMaxLieu = () => {
    let temp_maxLieu: any = localStorage.getItem("maxLieu")?.toString();
    if (temp_maxLieu !== undefined) {
      //console.log("temp max lieu: ", temp_maxLieu);
      setMaxLieu(temp_maxLieu);
    } else {
      localStorage.setItem("maxLieu", "12");
    }
  };
  const getMachineList = () => {
    generalQuery("getmachinelist", {})
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: MACHINE_LIST[] = response.data.data.map(
            (element: MACHINE_LIST, index: number) => {
              return {
                ...element,
              };
            }
          );
          loadeddata.push({ EQ_NAME: "NO" }, { EQ_NAME: "NA" });
          //console.log(loadeddata);
          setMachine_List(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
          setMachine_List([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const column_ycsxtable = getCompany() === 'CMS' ? [
    {
      field: "G_CODE", headerName: "G_CODE", width: 110, 
    },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 100,
      cellRenderer: (params: any) => {
        if (params.data.PDBV === "P" || params.data.PDBV === null)
          return <span style={{ color: "red" }}>{params.data.G_NAME_KD}</span>;
        return <span style={{ color: "green" }}>{params.data.G_NAME_KD}</span>;
      },
    },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 250,
      cellRenderer: (params: any) => {
        if (params.data.PDBV === "P" || params.data.PDBV === null)
          return <span style={{ color: "red" }}>{params.data.G_NAME}</span>;
        return <span style={{ color: "green" }}>{params.data.G_NAME}</span>;
      },
    },
    { field: "EMPL_NAME", headerName: "PIC KD", width: 150 },
    { field: "CUST_NAME_KD", headerName: "KHÁCH", width: 120 },
    {
      field: "PROD_REQUEST_NO", headerName: "SỐ YCSX", width: 80, cellRenderer: (params: any) => {
        if (params.data.DACHITHI === null) {
          return (
            <span style={{ color: "black" }}>
              {params.data.PROD_REQUEST_NO?.toLocaleString("en-US")}
            </span>
          );
        } else {
          return (
            <span style={{ color: "green" }}>
              <b>{params.data.PROD_REQUEST_NO?.toLocaleString("en-US")}</b>
            </span>
          );
        }
      },
    },
    { field: "PROD_REQUEST_DATE", headerName: "NGÀY YCSX", width: 80 },
    { field: "DELIVERY_DT", headerName: "NGÀY GH", width: 80 },
    {
      field: "PO_BALANCE",
      headerName: "PO_BALANCE",
      width: 110,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.PO_BALANCE?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "PROD_REQUEST_QTY",
      cellDataType: "number",
      headerName: "SL YCSX",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#009933" }}>
            <b>{params.data.PROD_REQUEST_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CD1",
      headerName: "CD1",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CD1?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "CD2",
      headerName: "CD2",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CD2?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "CD3",
      headerName: "CD3",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CD3?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "CD4",
      headerName: "CD4",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CD4?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "LOT_TOTAL_INPUT_QTY_EA",
      cellDataType: "number",
      headerName: "NK",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#cc0099" }}>
            <b>{params.data.LOT_TOTAL_INPUT_QTY_EA?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "LOT_TOTAL_OUTPUT_QTY_EA",
      cellDataType: "number",
      headerName: "XK",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#cc0099" }}>
            <b>{params.data.LOT_TOTAL_OUTPUT_QTY_EA?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_CD1",
      headerName: "TCD1",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.TON_CD1?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_CD2",
      headerName: "TCD2",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.TON_CD2?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_CD3",
      headerName: "TCD3",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.TON_CD3?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_CD4",
      headerName: "TCD4",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.TON_CD4?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "INSPECT_BALANCE",
      cellDataType: "number",
      headerName: "TỒN KIỂM",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#cc0099" }}>
            <b>{params.data.INSPECT_BALANCE?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "EQ1",
      headerName: "EQ1",
      width: 80,
      cellRenderer: (params: any) => {
        return <span style={{ color: "black" }}>{params.data.EQ1}</span>;
      },
    },
    {
      field: "EQ2",
      headerName: "EQ2",
      width: 80,
      cellRenderer: (params: any) => {
        return <span style={{ color: "black" }}>{params.data.EQ2}</span>;
      },
    },
    {
      field: "EQ3",
      headerName: "EQ3",
      width: 80,
      cellRenderer: (params: any) => {
        return <span style={{ color: "black" }}>{params.data.EQ3}</span>;
      },
    },
    {
      field: "EQ4",
      headerName: "EQ4",
      width: 80,
      cellRenderer: (params: any) => {
        return <span style={{ color: "black" }}>{params.data.EQ4}</span>;
      },
    },
    {
      field: "SHORTAGE_YCSX",
      cellDataType: "number",
      headerName: "TỒN YCSX",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.SHORTAGE_YCSX?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "PHAN_LOAI",
      headerName: "PHAN_LOAI",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.PHAN_LOAI === "01")
          return (
            <span style={{ color: "black" }}>
              <b>Thông thường</b>
            </span>
          );
        else if (params.data.PHAN_LOAI === "02")
          return (
            <span style={{ color: "black" }}>
              <b>SDI</b>
            </span>
          );
        else if (params.data.PHAN_LOAI === "03")
          return (
            <span style={{ color: "black" }}>
              <b>GC</b>
            </span>
          );
        else if (params.data.PHAN_LOAI === "04")
          return (
            <span style={{ color: "black" }}>
              <b>SAMPLE</b>
            </span>
          );
      },
    },
    { field: "PL_HANG", headerName: "PL_HANG", width: 120 },
    { field: "REMARK", headerName: "REMARK", width: 120 },
    {
      field: "PDUYET",
      headerName: "PDUYET",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.PDUYET === 1)
          return (
            <span style={{ color: "green" }}>
              <b>Đã Duyệt</b>
            </span>
          );
        else
          return (
            <span style={{ color: "red" }}>
              <b>Không Duyệt</b>
            </span>
          );
      },
    },
    {
      field: "BANVE",
      headerName: "BANVE",
      width: 260,
      cellRenderer: (params: any) => {
        let file: any = null;
        const uploadFile2 = async (e: any) => {
          //console.log(file);
          checkBP(userData, ['KD', 'RND'], ['ALL'], ['ALL'], async () => {
            uploadQuery(file, params.data.G_CODE + ".pdf", "banve")
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  generalQuery("update_banve_value", {
                    G_CODE: params.data.G_CODE,
                    banvevalue: "Y",
                  })
                    .then((response) => {
                      if (response.data.tk_status !== "NG") {
                        Swal.fire(
                          "Thông báo",
                          "Upload bản vẽ thành công",
                          "success"
                        );
                        let tempcodeinfodatatable = ycsxdatatable.map(
                          (element: YCSXTableData, index) => {
                            return element.G_CODE === params.data.G_CODE
                              ? { ...element, BANVE: "Y" }
                              : element;
                          }
                        );
                        setYcsxDataTable(tempcodeinfodatatable);
                      } else {
                        Swal.fire(
                          "Thông báo",
                          "Upload bản vẽ thất bại",
                          "error"
                        );
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Upload file thất bại:" + response.data.message,
                    "error"
                  );
                }
              })
              .catch((error) => {
                console.log(error);
              });
          })
        };
        let hreftlink = "/banve/" + params.data.G_CODE + ".pdf";
        if (params.data.BANVE !== "N" && params.data.BANVE !== null) {
          return (
            <span style={{ color: "gray" }}>
              <a target='_blank' rel='noopener noreferrer' href={hreftlink}>
                LINK
              </a>
            </span>
          );
        } else {
          return (
            <div className='uploadfile'>
              <IconButton className='buttonIcon' onClick={uploadFile2}>
                <AiOutlineCloudUpload color='yellow' size={15} />
                Upload
              </IconButton>
              <input
                accept='.pdf'
                type='file'
                onChange={(e: any) => {
                  file = e.target.files[0];
                  console.log(file);
                }}
              />
            </div>
          );
        }
      },
    },
    {
      field: "PDBV",
      headerName: "PD BANVE",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.PDBV === "P" || params.data.PDBV === null)
          return (
            <span style={{ color: "red" }}>
              <b>PENDING</b>
            </span>
          );
        return (
          <span style={{ color: "green" }}>
            <b>APPROVED</b>
          </span>
        );
      },
    },
    {
      field: "",
      headerName: "G_NAME",
      width: 250,
      cellRenderer: (params: any) => {
        if (params.data.PDBV === "P" || params.data.PDBV === null)
          return <span style={{ color: "red" }}>{params.data.G_NAME}</span>;
        return <span style={{ color: "green" }}>{params.data.G_NAME}</span>;
      },
    },
    {
      field: "YCSX_PENDING",
      headerName: "YCSX_PENDING",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.YCSX_PENDING === 1)
          return (
            <span style={{ color: "red" }}>
              <b>PENDING</b>
            </span>
          );
        else
          return (
            <span style={{ color: "green" }}>
              <b>CLOSED</b>
            </span>
          );
      },
    },
  ] : [
    {
      field: "G_CODE", headerName: "G_CODE", width: 110,
    },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 100,
      cellRenderer: (params: any) => {
        if (params.data.PDBV === "P" || params.data.PDBV === null)
          return <span style={{ color: "red" }}>{params.data.G_NAME_KD}</span>;
        return <span style={{ color: "green" }}>{params.data.G_NAME_KD}</span>;
      },
    },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 250,
      cellRenderer: (params: any) => {
        if (params.data.PDBV === "P" || params.data.PDBV === null)
          return <span style={{ color: "red" }}>{params.data.G_NAME}</span>;
        return <span style={{ color: "green" }}>{params.data.G_NAME}</span>;
      },
    },
    { field: "G_WIDTH", headerName: "WIDTH", width: 60 },
    { field: "G_LENGTH", headerName: "LENGTH", width: 60 },
    { field: "G_C", headerName: "CVT_C", width: 60 },
    { field: "G_C_R", headerName: "CVT_R", width: 60 },
    { field: "PROD_PRINT_TIMES", headerName: "SL_IN", width: 60 },
    { field: "CUST_NAME_KD", headerName: "KHÁCH", width: 120 },
    {
      field: "PROD_REQUEST_NO", headerName: "SỐ YCSX", width: 80, cellRenderer: (params: any) => {
        if (params.data.DACHITHI === null) {
          return (
            <span style={{ color: "black" }}>
              {params.data.PROD_REQUEST_NO?.toLocaleString("en-US")}
            </span>
          );
        } else {
          return (
            <span style={{ color: "green" }}>
              <b>{params.data.PROD_REQUEST_NO?.toLocaleString("en-US")}</b>
            </span>
          );
        }
      },
    },
    { field: "PROD_REQUEST_DATE", headerName: "NGÀY YCSX", width: 80 },
    { field: "DELIVERY_DT", headerName: "NGÀY GH", width: 80 },
    {
      field: "PO_BALANCE",
      headerName: "PO_BALANCE",
      width: 110,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.PO_BALANCE?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "PROD_REQUEST_QTY",
      cellDataType: "number",
      headerName: "SL YCSX",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#009933" }}>
            <b>{params.data.PROD_REQUEST_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CD1",
      headerName: "CD1",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CD1?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "CD2",
      headerName: "CD2",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CD2?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "CD3",
      headerName: "CD3",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CD3?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "CD4",
      headerName: "CD4",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CD4?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "LOT_TOTAL_INPUT_QTY_EA",
      cellDataType: "number",
      headerName: "NK",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#cc0099" }}>
            <b>{params.data.LOT_TOTAL_INPUT_QTY_EA?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "LOT_TOTAL_OUTPUT_QTY_EA",
      cellDataType: "number",
      headerName: "XK",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#cc0099" }}>
            <b>{params.data.LOT_TOTAL_OUTPUT_QTY_EA?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_CD1",
      headerName: "TCD1",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.TON_CD1?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_CD2",
      headerName: "TCD2",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.TON_CD2?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_CD3",
      headerName: "TCD3",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.TON_CD3?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_CD4",
      headerName: "TCD4",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.TON_CD4?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "INSPECT_BALANCE",
      cellDataType: "number",
      headerName: "TỒN KIỂM",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#cc0099" }}>
            <b>{params.data.INSPECT_BALANCE?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "EQ1",
      headerName: "EQ1",
      width: 80,
      cellRenderer: (params: any) => {
        return <span style={{ color: "black" }}>{params.data.EQ1}</span>;
      },
    },
    {
      field: "EQ2",
      headerName: "EQ2",
      width: 80,
      cellRenderer: (params: any) => {
        return <span style={{ color: "black" }}>{params.data.EQ2}</span>;
      },
    },
    {
      field: "EQ3",
      headerName: "EQ3",
      width: 80,
      cellRenderer: (params: any) => {
        return <span style={{ color: "black" }}>{params.data.EQ3}</span>;
      },
    },
    {
      field: "EQ4",
      headerName: "EQ4",
      width: 80,
      cellRenderer: (params: any) => {
        return <span style={{ color: "black" }}>{params.data.EQ4}</span>;
      },
    },
    {
      field: "SHORTAGE_YCSX",
      cellDataType: "number",
      headerName: "TỒN YCSX",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.SHORTAGE_YCSX?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "PHAN_LOAI",
      headerName: "PHAN_LOAI",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.PHAN_LOAI === "01")
          return (
            <span style={{ color: "black" }}>
              <b>Thông thường</b>
            </span>
          );
        else if (params.data.PHAN_LOAI === "02")
          return (
            <span style={{ color: "black" }}>
              <b>SDI</b>
            </span>
          );
        else if (params.data.PHAN_LOAI === "03")
          return (
            <span style={{ color: "black" }}>
              <b>GC</b>
            </span>
          );
        else if (params.data.PHAN_LOAI === "04")
          return (
            <span style={{ color: "black" }}>
              <b>SAMPLE</b>
            </span>
          );
      },
    },
    { field: "PL_HANG", headerName: "PL_HANG", width: 120 },
    { field: "REMARK", headerName: "REMARK", width: 120 },
    {
      field: "PDUYET",
      headerName: "PDUYET",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.PDUYET === 1)
          return (
            <span style={{ color: "green" }}>
              <b>Đã Duyệt</b>
            </span>
          );
        else
          return (
            <span style={{ color: "red" }}>
              <b>Không Duyệt</b>
            </span>
          );
      },
    },
    {
      field: "BANVE",
      headerName: "BANVE",
      width: 260,
      cellRenderer: (params: any) => {
        let file: any = null;
        const uploadFile2 = async (e: any) => {
          //console.log(file);
          checkBP(userData, ['KD', 'RND'], ['ALL'], ['ALL'], async () => {
            uploadQuery(file, params.data.G_CODE + ".pdf", "banve")
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  generalQuery("update_banve_value", {
                    G_CODE: params.data.G_CODE,
                    banvevalue: "Y",
                  })
                    .then((response) => {
                      if (response.data.tk_status !== "NG") {
                        Swal.fire(
                          "Thông báo",
                          "Upload bản vẽ thành công",
                          "success"
                        );
                        let tempcodeinfodatatable = ycsxdatatable.map(
                          (element: YCSXTableData, index) => {
                            return element.G_CODE === params.data.G_CODE
                              ? { ...element, BANVE: "Y" }
                              : element;
                          }
                        );
                        setYcsxDataTable(tempcodeinfodatatable);
                      } else {
                        Swal.fire(
                          "Thông báo",
                          "Upload bản vẽ thất bại",
                          "error"
                        );
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Upload file thất bại:" + response.data.message,
                    "error"
                  );
                }
              })
              .catch((error) => {
                console.log(error);
              });
          })
        };
        let hreftlink = "/banve/" + params.data.G_CODE + ".pdf";
        if (params.data.BANVE !== "N" && params.data.BANVE !== null) {
          return (
            <span style={{ color: "gray" }}>
              <a target='_blank' rel='noopener noreferrer' href={hreftlink}>
                LINK
              </a>
            </span>
          );
        } else {
          return (
            <div className='uploadfile'>
              <IconButton className='buttonIcon' onClick={uploadFile2}>
                <AiOutlineCloudUpload color='yellow' size={15} />
                Upload
              </IconButton>
              <input
                accept='.pdf'
                type='file'
                onChange={(e: any) => {
                  file = e.target.files[0];
                  console.log(file);
                }}
              />
            </div>
          );
        }
      },
    },
    {
      field: "PDBV",
      headerName: "PD BANVE",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.PDBV === "P" || params.data.PDBV === null)
          return (
            <span style={{ color: "red" }}>
              <b>PENDING</b>
            </span>
          );
        return (
          <span style={{ color: "green" }}>
            <b>APPROVED</b>
          </span>
        );
      },
    },
    {
      field: "",
      headerName: "G_NAME",
      width: 250,
      cellRenderer: (params: any) => {
        if (params.data.PDBV === "P" || params.data.PDBV === null)
          return <span style={{ color: "red" }}>{params.data.G_NAME}</span>;
        return <span style={{ color: "green" }}>{params.data.G_NAME}</span>;
      },
    },
    {
      field: "YCSX_PENDING",
      headerName: "YCSX_PENDING",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.YCSX_PENDING === 1)
          return (
            <span style={{ color: "red" }}>
              <b>PENDING</b>
            </span>
          );
        else
          return (
            <span style={{ color: "green" }}>
              <b>CLOSED</b>
            </span>
          );
      },
    },
    { field: "EMPL_NAME", headerName: "PIC KD", width: 150 },
  ];
  const column_plandatatable = [
    {
      field: "PLAN_ID",
      headerName: "PLAN_ID",
      width: 120,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      editable: false,
      resizable: true,
      cellRenderer: (params: any) => {
        if (params.data.DKXL === null) {
          return <span style={{ color: "red" }}>{params.data.PLAN_ID}</span>;
        } else {
          return <span style={{ color: "green" }}>{params.data.PLAN_ID}</span>;
        }
      },
    },
    { field: "G_CODE", headerName: "G_CODE", width: 90, editable: false },
    { field: "G_NAME", headerName: "G_NAME", width: 150, editable: false },
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
      headerName: "YCSX QTY",
      width: 70,
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
      width: 60,
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
      width: 60,
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
      width: 60,
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
      width: 60,
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
      editable: true,
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
      headerName: "PROC",
      width: 60,
      editable: true,
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
    { field: "STEP", headerName: "STEP", width: 50, editable: true },
    {
      field: "PLAN_ORDER",
      headerName: "STT",
      width: 50,
      editable: true,
    },
    {
      field: "KETQUASX",
      headerName: "KETQUASX",
      width: 70,
      editable: true,
      cellRenderer: (params: any) => {
        if (params.data.KETQUASX !== null) {
          return <span>{params.data.KETQUASX?.toLocaleString("en-US")}</span>;
        } else {
          return <span>0</span>;
        }
      },
    },
    {
      field: "KQ_SX_TAM",
      headerName: "KETQUASX_TAM",
      width: 80,
      editable: true,
      cellRenderer: (params: any) => {
        if (params.data.KQ_SX_TAM !== null) {
          return <span>{params.data.KQ_SX_TAM?.toLocaleString("en-US")}</span>;
        } else {
          return <span>0</span>;
        }
      },
    },
    { field: "PLAN_EQ", headerName: "PLAN_EQ", width: 70, editable: true },
    {
      field: "PLAN_FACTORY",
      headerName: "FACTORY",
      width: 70,
      editable: false,
    },
    {
      field: "PLAN_DATE",
      headerName: "PLAN_DATE",
      width: 90,
      editable: false,
    },
    {
      field: "PROD_REQUEST_NO",
      headerName: "YCSX NO",
      width: 80,
      editable: false,
    },
    {
      field: "PROD_REQUEST_DATE",
      headerName: "YCSX DATE",
      width: 80,
      editable: false,
    },
    {
      field: "NEXT_PLAN_ID",
      headerName: "NEXT_PLAN",
      width: 100,
      editable: true,
    },
    {
      field: "AT_LEADTIME",
      headerName: "LEADTIME",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span>{params.data?.AT_LEADTIME?.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
        )
      },
      editable: false,
    },
    {
      field: "ACC_TIME",
      headerName: "ACC_TIME",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span>{params.data?.ACC_TIME?.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
        )
      },
      editable: false,
    },
    {
      field: "IS_SETTING",
      headerName: "IS_SETTING",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <input
            type='checkbox'
            name='alltimecheckbox'
            //defaultChecked={params.data.IS_SETTING === 'Y'}
            checked={params.data.IS_SETTING === 'Y'}
            onChange={(e) => {
              console.log(e.target.checked);
              const newdata = plandatatable.map((p) =>
                p.PLAN_ID === params.data.PLAN_ID
                  ? { ...p, IS_SETTING: e.target.checked ? 'Y' : 'N' }
                  : p
              );
              setPlanDataTable(prev => newdata);
              qlsxplandatafilter.current = [];
            }}
          ></input>
        )
      },
      editable: false,
    },
    {
      field: "INS_EMPL",
      headerName: "INS_EMPL",
      width: 120,
      editable: false,
      hide: true,
    },
    {
      field: "INS_DATE",
      headerName: "INS_DATE",
      width: 120,
      editable: false,
      hide: true,
    },
    {
      field: "UPD_EMPL",
      headerName: "UPD_EMPL",
      width: 120,
      editable: false,
      hide: true,
    },
    {
      field: "UPD_DATE",
      headerName: "UPD_DATE",
      width: 120,
      editable: false,
      hide: true,
    },
  ];
  const column_planmaterialtable = [
    {
      field: 'CHITHI_ID', headerName: 'CT_ID', resizable: true, width: 100, editable: false, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { field: 'PLAN_ID', headerName: 'PLAN_ID', resizable: true, width: 80, editable: false },
    { field: 'M_CODE', headerName: 'M_CODE', resizable: true, width: 80, editable: false },
    {
      field: 'M_NAME', headerName: 'M_NAME', resizable: true, width: 80, editable: false, cellRenderer: (params: any) => {
        if (params.data.LIEUQL_SX === 1) {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.data.M_NAME}
            </span>
          );
        } else {
          return (
            <span style={{ color: "black" }}>{params.data.M_NAME}</span>
          );
        }
      }
    },
    { field: 'WIDTH_CD', headerName: 'WIDTH_CD', resizable: true, width: 80, editable: false },
    {
      field: 'M_MET_QTY', headerName: 'M_MET_QTY', resizable: true, width: 80, editable: true, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {params.data.M_MET_QTY}
          </span>
        );
      }
    },
    {
      field: 'M_QTY', headerName: 'M_QTY', resizable: true, width: 80, editable: true, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#F117FF", fontWeight: "bold" }}>
            {params.data.M_QTY}
          </span>
        );
      }
    },
    {
      field: 'LIEUQL_SX', headerName: 'LIEUQL_SX', resizable: true, width: 80, editable: true, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#F117FF", fontWeight: "bold" }}>
            {params.data.LIEUQL_SX}
          </span>
        );
      }
    },
    {
      field: 'M_STOCK', headerName: 'M_STOCK', resizable: true, width: 80, editable: false, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray", fontWeight: "bold" }}>
            {params.data.M_STOCK?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'OUT_KHO_SX', headerName: 'OUT_KHO_SX', resizable: true, width: 80, editable: false, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#F117FF", fontWeight: "bold" }}>
            {params.data.OUT_KHO_SX}
          </span>
        );
      }
    },
    {
      field: 'OUT_CFM_QTY', headerName: 'OUT_CFM_QTY', resizable: true, width: 80, editable: false, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#F117FF", fontWeight: "bold" }}>
            {params.data.OUT_CFM_QTY}
          </span>
        );
      }
    },
  ]
  const handle_loadEQ_STATUS = () => {
    generalQuery("checkEQ_STATUS", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: EQ_STATUS[] = response.data.data.map(
            (element: EQ_STATUS, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          setEQ_SERIES([
            ...new Set(
              loaded_data.map((e: EQ_STATUS, index: number) => {
                return e.EQ_SERIES;
              })
            ),
          ]);
          setEQ_STATUS(loaded_data);
        } else {
          setEQ_STATUS([]);
          setEQ_SERIES([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSaveQLSX = async () => {
    if (selectedPlan !== undefined) {
      checkBP(userData, ['QLSX'], ['ALL'], ['ALL'], async () => {
        let err_code: string = "0";
        console.log(datadinhmuc);
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
          Swal.fire(
            "Thông báo",
            "Lưu thất bại, hãy nhập đủ thông tin",
            "error"
          );
        } else {
          
          await generalQuery("insertDBYCSX", {
            PROD_REQUEST_NO: selectedPlan?.PROD_REQUEST_NO,
            G_CODE: selectedPlan?.G_CODE,
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                 
               
              } else {
                generalQuery("updateDBYCSX", {
                  PROD_REQUEST_NO: selectedPlan?.PROD_REQUEST_NO,
                  LOSS_SX1: datadinhmuc.LOSS_SX1,
                  LOSS_SX2: datadinhmuc.LOSS_SX2,
                  LOSS_SX3: datadinhmuc.LOSS_SX3,
                  LOSS_SX4: datadinhmuc.LOSS_SX4,
                  LOSS_SETTING1: datadinhmuc.LOSS_SETTING1,
                  LOSS_SETTING2: datadinhmuc.LOSS_SETTING2,
                  LOSS_SETTING3: datadinhmuc.LOSS_SETTING3,
                  LOSS_SETTING4: datadinhmuc.LOSS_SETTING4,            
                })
                  .then((response) => {
                    if (response.data.tk_status !== "NG") {
                     
                    } else {
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            })
            .catch((error) => {
              console.log(error);
            });  
            
          await generalQuery("saveQLSX", {
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
            NOTE: datadinhmuc.NOTE,
          })
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
              } else {
                err_code = "1";
              }
            })
            .catch((error) => {
              console.log(error);
            });
          if (err_code === "1") {
            Swal.fire(
              "Thông báo",
              "Lưu thất bại, không được để trống ô cần thiết",
              "error"
            );
          } else {
            loadQLSXPlan(selectedPlanDate);
            Swal.fire("Thông báo", "Lưu thành công", "success");
          }
        }
      })
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để SET !", "error");
    }
  };
  const renderYCKT = (planlist: QLSXPLANDATA[]) => {
    return planlist.map((element, index) => (
      <YCKT key={index} DATA={element} />
    ));
  };
  const updatePlanOrder = (plan_date: string) => {
    generalQuery("updatePlanOrder", {
      PLAN_DATE: plan_date
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
        } else {
          Swal.fire('Thông báo', 'Update plan order thất bại', 'error');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const loadQLSXPlan = async (plan_date: string) => {
    //console.log(selectedPlanDate);
    generalQuery("getqlsxplan", { PLAN_DATE: plan_date })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: QLSXPLANDATA, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0 ? element?.G_NAME : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME : 'TEM_NOI_BO',
                G_NAME_KD: getAuditMode() == 0 ? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
                ORG_LOSS_KT: getCompany()==='CMS'? element.LOSS_KT :0,
                LOSS_KT: getCompany()==='CMS'? ((element?.LOSS_KT ?? 0) > 5 ? 5 : element.LOSS_KT ?? 0) : 0,
                id: index,
              };
            }
          );
          //console.log(loadeddata);
          setPlanDataTable(loadeddata);
          updatePlanOrder(plan_date);
        } else {
          setPlanDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleGetChiThiTable = async (
    PLAN_ID: string,
    G_CODE: string,
    PLAN_QTY: number,
    PROCESS_NUMBER: number,
    IS_SETTING: string
  ) => {
    let PD: number = 0,
      CAVITY_NGANG: number = 0,
      CAVITY_DOC: number = 0,
      FINAL_LOSS_SX: number = 0,
      FINAL_LOSS_SETTING: number = 0,
      M_MET_NEEDED: number = 0;
    if (selectedPlan !== undefined) {
      await generalQuery("getcodefullinfo", {
        G_CODE: G_CODE,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            //console.log(response.data.data)
            const rowdata = response.data.data[0];
            PD = rowdata.PD;
            CAVITY_NGANG = rowdata.G_C_R;
            CAVITY_DOC = rowdata.G_C;
            let calc_loss_setting: boolean = IS_SETTING === 'Y' ? true : false;
            if (PROCESS_NUMBER === 1) {
              FINAL_LOSS_SX = (rowdata.LOSS_SX1 ?? 0) + (rowdata.LOSS_SX2 ?? 0) + (rowdata.LOSS_SX3 ?? 0) + (rowdata.LOSS_SX4 ?? 0) + (selectedPlan?.LOSS_KT ?? 0);
            } else if (PROCESS_NUMBER === 2) {
              FINAL_LOSS_SX = (rowdata.LOSS_SX2 ?? 0) + (rowdata.LOSS_SX3 ?? 0) + (rowdata.LOSS_SX4 ?? 0) + (selectedPlan?.LOSS_KT ?? 0);
            } else if (PROCESS_NUMBER === 3) {
              FINAL_LOSS_SX = (rowdata.LOSS_SX3 ?? 0) + (rowdata.LOSS_SX4 ?? 0) + (selectedPlan?.LOSS_KT ?? 0);
            } else if (PROCESS_NUMBER === 4) {
              FINAL_LOSS_SX = (rowdata.LOSS_SX4 ?? 0) + (selectedPlan?.LOSS_KT ?? 0);
            }
            if (PROCESS_NUMBER === 1) {
              FINAL_LOSS_SETTING = (calc_loss_setting ? rowdata.LOSS_SETTING1 ?? 0 : 0) + (rowdata.LOSS_SETTING2 ?? 0) + (rowdata.LOSS_SETTING3 ?? 0) + (rowdata.LOSS_SETTING4 ?? 0);
            } else if (PROCESS_NUMBER === 2) {
              FINAL_LOSS_SETTING = (rowdata.LOSS_SETTING2 ?? 0) + (rowdata.LOSS_SETTING3 ?? 0) + (rowdata.LOSS_SETTING4 ?? 0);
            } else if (PROCESS_NUMBER === 3) {
              FINAL_LOSS_SETTING = (rowdata.LOSS_SETTING3 ?? 0) + (rowdata.LOSS_SETTING4 ?? 0);
            } else if (PROCESS_NUMBER === 4) {
              FINAL_LOSS_SETTING = (rowdata.LOSS_SETTING4 ?? 0);
            }
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      setCurrentPlanPD(PD);
      setCurrentPlanCAVITY(CAVITY_NGANG * CAVITY_DOC);
      generalQuery("getchithidatatable", {
        PLAN_ID: PLAN_ID,
      })
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            const loaded_data: QLSXCHITHIDATA[] = response.data.data.map(
              (element: QLSXCHITHIDATA, index: number) => {
                return {
                  ...element,
                  id: index
                }
              });
            setChiThiDataTable(loaded_data);
          } else {
            M_MET_NEEDED = (PLAN_QTY * PD * 1.0) / (CAVITY_DOC * CAVITY_NGANG * 1.0) / 1000;
            generalQuery("getbomsx", {
              G_CODE: G_CODE,
            })
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  const loaded_data: QLSXCHITHIDATA[] = response.data.data.map(
                    (element: QLSXCHITHIDATA, index: number) => {
                      return {
                        CHITHI_ID: "NEW" + index,
                        PLAN_ID: PLAN_ID,
                        M_CODE: element.M_CODE,
                        M_NAME: element.M_NAME,
                        WIDTH_CD: element.WIDTH_CD,
                        M_ROLL_QTY: 0,
                        M_MET_QTY: parseInt(
                          "" +
                          (M_MET_NEEDED +
                            (M_MET_NEEDED * FINAL_LOSS_SX) / 100 +
                            FINAL_LOSS_SETTING)
                        ),
                        M_QTY: element.M_QTY,
                        LIEUQL_SX: element.LIEUQL_SX,
                        MAIN_M: element.MAIN_M,
                        OUT_KHO_SX: 0,
                        OUT_KHO_THAT: 0,
                        INS_EMPL: "",
                        INS_DATE: "",
                        UPD_EMPL: "",
                        UPD_DATE: "",
                        M_STOCK: element.M_STOCK,
                        id: index,
                      };
                    }
                  );
                  setChiThiDataTable(loaded_data);
                } else {
                  setChiThiDataTable([]);
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const handleResetChiThiTable = async () => {
    if (selectedPlan !== undefined) {
      let PD: number = 0,
        CAVITY_NGANG: number = 0,
        CAVITY_DOC: number = 0,
        PLAN_QTY: number = selectedPlan?.PLAN_QTY ?? 0,
        PROCESS_NUMBER: number = selectedPlan?.PROCESS_NUMBER ?? 0,
        FINAL_LOSS_SX: number = 0,
        FINAL_LOSS_SETTING: number = 0,
        M_MET_NEEDED: number = 0;
      await generalQuery("getcodefullinfo", {
        G_CODE: selectedPlan?.G_CODE,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            //console.log(response.data.data)
            const rowdata = response.data.data[0];
            PD = rowdata.PD;
            CAVITY_NGANG = rowdata.G_C_R;
            CAVITY_DOC = rowdata.G_C;
            let calc_loss_setting: boolean = selectedPlan?.IS_SETTING === 'Y' ? true : false;
            if (PROCESS_NUMBER === 1) {
              FINAL_LOSS_SX = (rowdata.LOSS_SX1 ?? 0) + (rowdata.LOSS_SX2 ?? 0) + (rowdata.LOSS_SX3 ?? 0) + (rowdata.LOSS_SX4 ?? 0) + (selectedPlan.LOSS_KT ?? 0);
            } else if (PROCESS_NUMBER === 2) {
              FINAL_LOSS_SX = (rowdata.LOSS_SX2 ?? 0) + (rowdata.LOSS_SX3 ?? 0) + (rowdata.LOSS_SX4 ?? 0) + (selectedPlan.LOSS_KT ?? 0);
            } else if (PROCESS_NUMBER === 3) {
              FINAL_LOSS_SX = (rowdata.LOSS_SX3 ?? 0) + (rowdata.LOSS_SX4 ?? 0) + (selectedPlan.LOSS_KT ?? 0);
            } else if (PROCESS_NUMBER === 4) {
              FINAL_LOSS_SX = (rowdata.LOSS_SX4 ?? 0) + (selectedPlan.LOSS_KT ?? 0);
            }
            if (PROCESS_NUMBER === 1) {
              FINAL_LOSS_SETTING = (calc_loss_setting ? rowdata.LOSS_SETTING1 ?? 0 : 0) + (rowdata.LOSS_SETTING2 ?? 0) + (rowdata.LOSS_SETTING3 ?? 0) + (rowdata.LOSS_SETTING4 ?? 0);
            } else if (PROCESS_NUMBER === 2) {
              FINAL_LOSS_SETTING = (rowdata.LOSS_SETTING2 ?? 0) + (rowdata.LOSS_SETTING3 ?? 0) + (rowdata.LOSS_SETTING4 ?? 0);
            } else if (PROCESS_NUMBER === 3) {
              FINAL_LOSS_SETTING = (rowdata.LOSS_SETTING3 ?? 0) + (rowdata.LOSS_SETTING4 ?? 0);
            } else if (PROCESS_NUMBER === 4) {
              FINAL_LOSS_SETTING = (rowdata.LOSS_SETTING4 ?? 0);
            }
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      setCurrentPlanPD(PD);
      setCurrentPlanCAVITY(CAVITY_NGANG * CAVITY_DOC);
      M_MET_NEEDED = (PLAN_QTY * PD * 1.0) / (CAVITY_DOC * CAVITY_NGANG * 1.0) / 1000;
      console.log(M_MET_NEEDED);
      await generalQuery("getbomsx", {
        G_CODE: selectedPlan?.G_CODE,
      })
        .then((response) => {
          console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            const loaded_data: QLSXCHITHIDATA[] = response.data.data.map(
              (element: QLSXCHITHIDATA, index: number) => {
                return {
                  CHITHI_ID: index,
                  PLAN_ID: selectedPlan?.PLAN_ID,
                  M_CODE: element.M_CODE,
                  M_NAME: element.M_NAME,
                  WIDTH_CD: element.WIDTH_CD,
                  M_ROLL_QTY: 0,
                  M_MET_QTY: parseInt(
                    "" +
                    (M_MET_NEEDED +
                      (M_MET_NEEDED * FINAL_LOSS_SX) / 100 +
                      FINAL_LOSS_SETTING)
                  ),
                  M_QTY: element.M_QTY,
                  LIEUQL_SX: element.LIEUQL_SX,
                  MAIN_M: element.MAIN_M,
                  OUT_KHO_SX: 0,
                  OUT_KHO_THAT: 0,
                  INS_EMPL: "",
                  INS_DATE: "",
                  UPD_EMPL: "",
                  UPD_DATE: "",
                  M_STOCK: element.M_STOCK,
                  id: index,
                };
              }
            );
            setChiThiDataTable(loaded_data);
          } else {
            setChiThiDataTable([]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 PLAN để RESET Liệu", "error");
    }
  };
  const handletraYCSX = () => {
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
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          const loadeddata: YCSXTableData[] = response.data.data.map(
            (element: YCSXTableData, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0 ? element?.G_NAME : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME : 'TEM_NOI_BO',
                G_NAME_KD: getAuditMode() == 0 ? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                PO_TDYCSX: element.PO_TDYCSX ?? 0,
                TOTAL_TKHO_TDYCSX: element.TOTAL_TKHO_TDYCSX ?? 0,
                TKHO_TDYCSX: element.TKHO_TDYCSX ?? 0,
                BTP_TDYCSX: element.BTP_TDYCSX ?? 0,
                CK_TDYCSX: element.CK_TDYCSX ?? 0,
                BLOCK_TDYCSX: element.BLOCK_TDYCSX ?? 0,
                FCST_TDYCSX: element.FCST_TDYCSX ?? 0,
                W1: element.W1 ?? 0,
                W2: element.W2 ?? 0,
                W3: element.W3 ?? 0,
                W4: element.W4 ?? 0,
                W5: element.W5 ?? 0,
                W6: element.W6 ?? 0,
                W7: element.W7 ?? 0,
                W8: element.W8 ?? 0,
                PROD_REQUEST_QTY: element.PROD_REQUEST_QTY ?? 0,
                id: index
              };
            }
          );
          setYcsxDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success"
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handletraYCSX();
    }
  };
  const setPendingYCSX = async (pending_value: number) => {
    if (ycsxdatatablefilter.current.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < ycsxdatatablefilter.current.length; i++) {
        await generalQuery("setpending_ycsx", {
          PROD_REQUEST_NO: ycsxdatatablefilter.current[i].PROD_REQUEST_NO,
          YCSX_PENDING: pending_value,
        })
          .then((response) => {
            console.log(response.data.tk_status);
            if (response.data.tk_status !== "NG") {
            } else {
              err_code = true;
            }
          })
          .catch((error) => {
            console.log(error);
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
        Swal.fire(
          "Tiến hành SET PENDING",
          "Đang SET PENDING YCSX hàng loạt",
          "success"
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
          "success"
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
  const handleConfirmRESETLIEU = () => {
    Swal.fire({
      title: "Chắc chắn muốn RESET liệu ?",
      text: "Sẽ bắt đầu RESET liệu",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn RESET liệu!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành RESET liệu", "Đang RESET liệu", "success");
        handleResetChiThiTable();
      }
    });
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
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Đăng ký xuất liệu kho thật",
          text: "Đang đăng ký xuất liệu, hay chờ cho tới khi hoàn thành",
          icon: "info",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
          showConfirmButton: false,
        });
        /*  Swal.fire(
          "Tiến hành ĐK liệu",
          "Đang ĐK liệu, hãy chờ cho tới khi hoàn thành",
          "info"
        ); */
        if (selectedPlan !== undefined) {
          hanlde_SaveChiThi();
          handleDangKyXuatLieu(
            selectedPlan?.PLAN_ID === undefined ? "xxx" : selectedPlan?.PLAN_ID,
            selectedPlan?.PROD_REQUEST_NO === undefined
              ? "xxx"
              : selectedPlan?.PROD_REQUEST_NO,
            selectedPlan?.PROD_REQUEST_DATE === undefined
              ? "xxx"
              : selectedPlan?.PROD_REQUEST_DATE
          );
        } else {
          Swal.fire(
            "Thông báo",
            "Chọn ít nhất 1 chỉ thị để đăng ký xuất liệu",
            "error"
          );
        }
      }
    });
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
  const handle_DeleteLinePLAN_backup = async () => {
    if (qlsxplandatafilter.current.length > 0) {
      let datafilter = [...plandatatable];
      for (let i = 0; i < qlsxplandatafilter.current.length; i++) {
        for (let j = 0; j < datafilter.length; j++) {
          if (qlsxplandatafilter.current[i].id === datafilter[j].id) {
            await generalQuery("checkPLANID_O302", {
              PLAN_ID: qlsxplandatafilter.current[i].PLAN_ID,
            })
              .then((response) => {
                //console.log(response.data);
                if (response.data.tk_status !== "NG") {
                } else {
                  if (qlsxplandatafilter.current[i].CHOTBC === null) {
                    generalQuery("deletePlanQLSX", {
                      PLAN_ID: qlsxplandatafilter.current[i].PLAN_ID,
                    })
                      .then((response) => {
                        //console.log(response.data);
                        if (response.data.tk_status !== "NG") {
                          Swal.fire(
                            "Thông báo",
                            "Nội dung: " + response.data.message,
                            "error"
                          );
                        } else {
                          datafilter.splice(j, 1);
                          setPlanDataTable(datafilter);
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  } else {
                    Swal.fire(
                      "Thông báo",
                      "Chỉ thị + " +
                      qlsxplandatafilter.current[i].PLAN_ID +
                      ":  +đã chốt báo cáo, ko xóa được chỉ thị",
                      "error"
                    );
                  }
                }
                /*  generalQuery("deletePlanQLSX", { PLAN_ID: qlsxplandatafilter.current[i].PLAN_ID })
            .then((response) => {
              //console.log(response.data);
              if (response.data.tk_status !== "NG") {
                Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
              } else {
                datafilter.splice(j,1);   
                setPlanDataTable(datafilter);   
              }
            })
            .catch((error) => {
              console.log(error);
            });  */
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất một dòng để xóa", "error");
    }
  };
  const handle_DeleteLinePLAN = async () => {
    if (qlsxplandatafilter.current.length > 0) {
      Swal.fire({
        title: "Xóa chỉ thị",
        text: "Đang xóa chỉ thị được chọn",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "OK",
        showConfirmButton: false,
      });
      for (let i = 0; i < qlsxplandatafilter.current.length; i++) { 
        let isOnO302: boolean = false, isChotBaoCao: boolean = (qlsxplandatafilter.current[i].CHOTBC === "V"), isOnOutKhoAo: boolean =false;
        
        await generalQuery("checkPLANID_O302", {
          PLAN_ID: qlsxplandatafilter.current[i].PLAN_ID,
        })
        .then((response) => {
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {
            isOnO302 = true;
          } else {
            
          }        
        })
        .catch((error) => {
          console.log(error);
        });

        await generalQuery("checkPLANID_OUT_KHO_AO", {
          PLAN_ID: qlsxplandatafilter.current[i].PLAN_ID,
        })
        .then((response) => {
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {
            isOnOutKhoAo = true;
          } else {
            
          }        
        })
        .catch((error) => {
          console.log(error);
        });


        if (!isChotBaoCao && !isOnO302 && !isOnOutKhoAo) {
          console.log('vao delete')
          generalQuery("deletePlanQLSX", {
            PLAN_ID: qlsxplandatafilter.current[i].PLAN_ID,
          })
            .then((response) => {
              //console.log(response.data);
              if (response.data.tk_status !== "NG") {                
                Swal.fire('Thông báo','Xóa thành công','success')
              } else {

              }
            })
            .catch((error) => {
              console.log(error);
            });
        } 
        else {
          if(isChotBaoCao)
          {
            Swal.fire(
              "Thông báo",
              "Chỉ thị + " +
              qlsxplandatafilter.current[i].PLAN_ID +
              ":  +đã chốt báo cáo, ko xóa được chỉ thị",
              "error"
            );

          }
          else if(isOnO302)
          {
            Swal.fire(
              "Thông báo",
              "Chỉ thị + " +
              qlsxplandatafilter.current[i].PLAN_ID +
              ":  +đã xuất kho thật",
              "error"
            );

          }   
          else if(isOnOutKhoAo)
          {
            Swal.fire(
              "Thông báo",
              "Chỉ thị + " +
              qlsxplandatafilter.current[i].PLAN_ID +
              ":  +đã xuất kho ảo",
              "error"
            );
            
          }
        }


        
      }
      clearSelectedRows();      
      loadQLSXPlan(selectedPlanDate);
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất một dòng để xóa", "error");
    }
  };
  const handle_DeleteLineCHITHI = () => {
    if (qlsxchithidatafilter.current.length > 0) {
      let datafilter = [...chithidatatable];
      for (let i = 0; i < qlsxchithidatafilter.current.length; i++) {
        for (let j = 0; j < datafilter.length; j++) {
          if (qlsxchithidatafilter.current[i].CHITHI_ID === datafilter[j].CHITHI_ID) {
            datafilter.splice(j, 1);
          }
        }
      }
      setChiThiDataTable(datafilter);
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất một dòng để xóa", "error");
    }
  };
  const getNextPLAN_ID = async (PROD_REQUEST_NO: string) => {
    let next_plan_id: string = PROD_REQUEST_NO;
    let next_plan_order: number = 1;
    await generalQuery("getLastestPLAN_ID", {
      PROD_REQUEST_NO: PROD_REQUEST_NO,
    })
      .then((response) => {
        //console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
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
          /*  next_plan_id =
            PROD_REQUEST_NO +
            String.fromCharCode(
              response.data.data[0].PLAN_ID.substring(7, 8).charCodeAt(0) + 1
            ); */
        } else {
          next_plan_id = PROD_REQUEST_NO + "A";
        }
      })
      .catch((error) => {
        console.log(error);
      });
    await generalQuery("getLastestPLANORDER", {
      PLAN_DATE: selectedPlanDate,
      PLAN_EQ: selectedMachine,
      PLAN_FACTORY: selectedFactory,
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
  const handle_AddPlan = async () => {
    console.log('ycsxdatatablefilter.current',ycsxdatatablefilter.current)
    if (ycsxdatatablefilter.current.length >= 1) {
      for (let i = 0; i < ycsxdatatablefilter.current.length; i++) {
        let check_ycsx_hethongcu: boolean = false;
        await generalQuery("checkProd_request_no_Exist_O302", {
          PROD_REQUEST_NO: ycsxdatatablefilter.current[i].PROD_REQUEST_NO,
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
          ycsxdatatablefilter.current[i].PROD_REQUEST_NO
        );
        let NextPlanID = nextPlan.NEXT_PLAN_ID;
        let NextPlanOrder = nextPlan.NEXT_PLAN_ORDER;
        if (check_ycsx_hethongcu === false) {
          //console.log(selectedMachine.substring(0,2));
          await generalQuery("addPlanQLSX", {
            PLAN_ID: NextPlanID,
            PLAN_DATE: selectedPlanDate,
            PROD_REQUEST_NO: ycsxdatatablefilter.current[i].PROD_REQUEST_NO,
            PLAN_QTY: 0,
            PLAN_EQ: selectedMachine,
            PLAN_FACTORY: selectedFactory,
            PLAN_LEADTIME: 0,
            STEP: 0,
            PLAN_ORDER: NextPlanOrder,
            PROCESS_NUMBER: selectedMachine.substring(0, 2) === ycsxdatatablefilter.current[i].EQ1   ? 1   : selectedMachine.substring(0, 2) === ycsxdatatablefilter.current[i].EQ2     ? 2     : 0,
            G_CODE: ycsxdatatablefilter.current[i].G_CODE,
            NEXT_PLAN_ID: "X",
            IS_SETTING: "Y"
          })
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
                loadQLSXPlan(selectedPlanDate);
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Swal.fire(
            "Thông báo",
            "Yêu cầu sản xuất này đã chạy từ hệ thống cũ, không chạy được lẫn lộn cũ mới, hãy chạy hết bằng hệ thống cũ với yc này",
            "error"
          );
        }
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để Add !", "error");
    }
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
    let selectedPlanTable: QLSXPLANDATA[] = plandatatable.filter(
      (element: QLSXPLANDATA, index: number) => {
        return (
          element.PLAN_EQ === selectedMachine &&
          element.PLAN_FACTORY === selectedFactory
        );
      }
    );
    //console.log(selectedPlanTable);
    let err_code: string = "0";
    for (let i = 0; i < selectedPlanTable.length; i++) {
      let check_NEXT_PLAN_ID: boolean = true;
      if (selectedPlanTable[i].NEXT_PLAN_ID !== "X") {
        if (
          selectedPlanTable[i].NEXT_PLAN_ID === selectedPlanTable[i + 1].PLAN_ID
        ) {
          check_NEXT_PLAN_ID = true;
        } else {
          check_NEXT_PLAN_ID = false;
        }
      }
      let checkPlanIdP500: boolean = false;
      await generalQuery("checkP500PlanID_mobile", {
        PLAN_ID: selectedPlanTable[i].PLAN_ID,
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {
            checkPlanIdP500 = true;
          } else {
            checkPlanIdP500 = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
        

        let {NEEDED_QTY,FINAL_LOSS_SX,FINAL_LOSS_KT,FINAL_LOSS_SETTING} = await getCurrentDMToSave(selectedPlanTable[i])

        /* console.log("PD",PD);
        console.log("CAVITY",CAVITY);        
        console.log("sx loss",FINAL_LOSS_SX)
        console.log("sx setting",FINAL_LOSS_SETTING)
        console.log("kt lss",FINAL_LOSS_KT)
        console.log("Needed_qty",NEEDED_QTY); */


        
      if (
        parseInt(selectedPlanTable[i].PROCESS_NUMBER.toString()) >= 1 &&
        parseInt(selectedPlanTable[i].PROCESS_NUMBER.toString()) <= 4 &&
        selectedPlanTable[i].PLAN_QTY !== 0 &&
        selectedPlanTable[i].PLAN_QTY <=
        selectedPlanTable[i].PROD_REQUEST_QTY &&
        selectedPlanTable[i].PLAN_ID !== selectedPlanTable[i].NEXT_PLAN_ID &&
        selectedPlanTable[i].CHOTBC !== "V" &&
        check_NEXT_PLAN_ID &&
        parseInt(selectedPlanTable[i].STEP.toString()) >= 0 &&
        parseInt(selectedPlanTable[i].STEP.toString()) <= 9 &&
        checkEQvsPROCESS(
          selectedPlanTable[i].EQ1,
          selectedPlanTable[i].EQ2,
          selectedPlanTable[i].EQ3,
          selectedPlanTable[i].EQ4
        ) >= selectedPlanTable[i].PROCESS_NUMBER &&
        checkPlanIdP500 === false
      ) {
        await generalQuery("updatePlanQLSX", {
          PLAN_ID: selectedPlanTable[i].PLAN_ID,
          STEP: selectedPlanTable[i].STEP,
          PLAN_QTY: selectedPlanTable[i].PLAN_QTY,
          OLD_PLAN_QTY: selectedPlanTable[i].PLAN_QTY,
          PLAN_LEADTIME: selectedPlanTable[i].PLAN_LEADTIME,
          PLAN_EQ: selectedPlanTable[i].PLAN_EQ,
          PLAN_ORDER: selectedPlanTable[i].PLAN_ORDER,
          PROCESS_NUMBER: selectedPlanTable[i].PROCESS_NUMBER,
          KETQUASX: selectedPlanTable[i].KETQUASX === null   ? 0   : selectedPlanTable[i].KETQUASX,
          NEXT_PLAN_ID: selectedPlanTable[i].NEXT_PLAN_ID === null   ? "X"   : selectedPlanTable[i].NEXT_PLAN_ID,
          IS_SETTING: selectedPlanTable[i].IS_SETTING,
          NEEDED_QTY:  NEEDED_QTY,
          CURRENT_LOSS_SX: FINAL_LOSS_SX,
          CURRENT_LOSS_KT: FINAL_LOSS_KT,
          CURRENT_SETTING_M: FINAL_LOSS_SETTING,
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
      } else {
        err_code += "_" + selectedPlanTable[i].G_NAME_KD + ":";
        if (
          !(
            parseInt(selectedPlanTable[i].PROCESS_NUMBER.toString()) >= 1 &&
            parseInt(selectedPlanTable[i].PROCESS_NUMBER.toString()) <= 4
          )
        ) {
          err_code += "_: Process number chưa đúng";
        } else if (selectedPlanTable[i].PLAN_QTY === 0) {
          err_code += "_: Số lượng chỉ thị =0";
        } else if (
          selectedPlanTable[i].PLAN_QTY > selectedPlanTable[i].PROD_REQUEST_QTY
        ) {
          err_code += "_: Số lượng chỉ thị lớn hơn số lượng yêu cầu sx";
        } else if (
          selectedPlanTable[i].PLAN_ID === selectedPlanTable[i].NEXT_PLAN_ID
        ) {
          err_code += "_: NEXT_PLAN_ID không được giống PLAN_ID hiện tại";
        } else if (!check_NEXT_PLAN_ID) {
          err_code +=
            "_: NEXT_PLAN_ID không giống với PLAN_ID ở dòng tiếp theo";
        } else if (selectedPlanTable[i].CHOTBC === "V") {
          err_code +=
            "_: Chỉ thị đã chốt báo cáo, sẽ ko sửa được, thông tin các chỉ thị khác trong máy được lưu thành công";
        } else if (
          !(
            parseInt(selectedPlanTable[i].STEP.toString()) >= 0 &&
            parseInt(selectedPlanTable[i].STEP.toString()) <= 9
          )
        ) {
          err_code += "_: Hãy nhập STEP từ 0 -> 9";
        } else if (
          !(
            parseInt(selectedPlanTable[i].PROCESS_NUMBER.toString()) >= 1 &&
            parseInt(selectedPlanTable[i].PROCESS_NUMBER.toString()) <= 4
          )
        ) {
          err_code += "_: Hãy nhập PROCESS NUMBER từ 1 đến 4";
        } else if (checkPlanIdP500) {
          err_code += "_: Đã bắn liệu vào sản xuất, không sửa chỉ thị được";
        }
      }
    }
    if (err_code !== "0") {
      Swal.fire("Thông báo", "Có lỗi !" + err_code, "error");
    } else {
      Swal.fire("Thông báo", "Lưu PLAN thành công", "success");
      loadQLSXPlan(selectedPlanDate);
    }
  };
  const hanlde_SaveChiThi = async () => {
    let err_code: string = "0";
    let total_lieuql_sx: number = 0;
    let check_lieuql_sx_sot: number = 0;
    let check_num_lieuql_sx: number = 1;
    let check_lieu_qlsx_khac1: number = 0;
    //console.log(chithidatatable);
    for (let i = 0; i < chithidatatable.length; i++) {
      total_lieuql_sx += chithidatatable[i].LIEUQL_SX;
      if (chithidatatable[i].LIEUQL_SX > 1) check_lieu_qlsx_khac1 += 1;
    }
    for (let i = 0; i < chithidatatable.length; i++) {
      //console.log(chithidatatable[i].LIEUQL_SX);
      if (parseInt(chithidatatable[i].LIEUQL_SX.toString()) === 1) {
        for (let j = 0; j < chithidatatable.length; j++) {
          if (
            chithidatatable[j].M_NAME === chithidatatable[i].M_NAME &&
            parseInt(chithidatatable[j].LIEUQL_SX.toString()) === 0
          ) {
            check_lieuql_sx_sot += 1;
          }
        }
      }
    }
    //console.log('bang chi thi', chithidatatable);
    for (let i = 0; i < chithidatatable.length; i++) {
      if (parseInt(chithidatatable[i].LIEUQL_SX.toString()) === 1) {
        for (let j = 0; j < chithidatatable.length; j++) {
          if (parseInt(chithidatatable[j].LIEUQL_SX.toString()) === 1) {
            //console.log('i', chithidatatable[i].M_NAME);
            //console.log('j', chithidatatable[j].M_NAME);
            if (chithidatatable[i].M_NAME !== chithidatatable[j].M_NAME) {
              check_num_lieuql_sx = 2;
            }
          }
        }
      }
    }
    //console.log('num lieu qlsx: ' + check_num_lieuql_sx);
    //console.log('tong lieu qly: '+ total_lieuql_sx);
    if (
      total_lieuql_sx > 0 &&
      check_lieuql_sx_sot === 0 &&
      check_num_lieuql_sx === 1 &&
      check_lieu_qlsx_khac1 === 0
    ) {
      await generalQuery("deleteMCODEExistIN_O302", {
        //PLAN_ID: qlsxplandatafilter.current[0].PLAN_ID,
        PLAN_ID: selectedPlan?.PLAN_ID,
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      for (let i = 0; i < chithidatatable.length; i++) {
        await generalQuery("updateLIEUQL_SX_M140", {
          //G_CODE: qlsxplandatafilter.current[0].G_CODE,
          G_CODE: selectedPlan?.G_CODE,
          M_CODE: chithidatatable[i].M_CODE,
          LIEUQL_SX: chithidatatable[i].LIEUQL_SX >= 1 ? 1 : 0,
        })
          .then((response) => {
            //console.log(response.data);
            if (response.data.tk_status !== "NG") {
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
        if (chithidatatable[i].M_MET_QTY > 0) {
          let checktontaiM_CODE: boolean = false;
          await generalQuery("checkM_CODE_PLAN_ID_Exist", {
            //PLAN_ID: qlsxplandatafilter.current[0].PLAN_ID,
            PLAN_ID: selectedPlan?.PLAN_ID,
            M_CODE: chithidatatable[i].M_CODE,
          })
            .then((response) => {
              //console.log(response.data);
              if (response.data.tk_status !== "NG") {
                checktontaiM_CODE = true;
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
          //console.log('checktontai',checktontaiM_CODE);
          if (checktontaiM_CODE) {
            await generalQuery("updateChiThi", {
              PLAN_ID: selectedPlan?.PLAN_ID,
              M_CODE: chithidatatable[i].M_CODE,
              M_ROLL_QTY: chithidatatable[i].M_ROLL_QTY,
              M_MET_QTY: chithidatatable[i].M_MET_QTY,
              M_QTY: chithidatatable[i].M_QTY,
              LIEUQL_SX: chithidatatable[i].LIEUQL_SX >= 1 ? 1 : 0,
            })
              .then((response) => {
                //console.log(response.data);
                if (response.data.tk_status !== "NG") {
                } else {
                  err_code += "_" + response.data.message;
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            await generalQuery("insertChiThi", {
              //PLAN_ID: qlsxplandatafilter.current[0].PLAN_ID,
              PLAN_ID: selectedPlan?.PLAN_ID,
              M_CODE: chithidatatable[i].M_CODE,
              M_ROLL_QTY: chithidatatable[i].M_ROLL_QTY,
              M_MET_QTY: chithidatatable[i].M_MET_QTY,
              M_QTY: chithidatatable[i].M_QTY,
              LIEUQL_SX: chithidatatable[i].LIEUQL_SX,
            })
              .then((response) => {
                //console.log(response.data);
                if (response.data.tk_status !== "NG") {
                } else {
                  err_code += "_" + response.data.message;
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        } else {
          err_code += "_" + chithidatatable[i].M_CODE + ": so met = 0";
        }
      }
      if (err_code !== "0") {
        Swal.fire("Thông báo", "Có lỗi !" + err_code, "error");
      } else {
        Swal.fire("Thông báo", "Lưu Chỉ thị thành công", "success");
        loadQLSXPlan(selectedPlanDate);
      }
    } else {
      Swal.fire(
        "Thông báo",
        "Phải chỉ định liệu quản lý, k để sót size nào, và chỉ chọn 1 loại liệu làm liệu chính, và nhập liệu quản lý chỉ 1 hoặc 0",
        "error"
      );
    }
    handleGetChiThiTable(
      selectedPlan?.PLAN_ID ?? 'xxx',
      selectedPlan?.G_CODE ?? 'xxx',
      selectedPlan?.PLAN_QTY ?? 0,
      selectedPlan?.PROCESS_NUMBER ?? 1,
      selectedPlan?.IS_SETTING ?? 'Y'
    );
  };
  function PlanTableAGToolbar() {
    return (
      <div className="toolbar">
        <IconButton
          className='buttonIcon'
          onClick={() => {
            //showHideRef.current = !showHideRef.current;
            //setShowYCSX(!showHideRef.current);
            setShowYCSX(prev => {
              return !prev
            });
          }}
        >
          <TbLogout color='red' size={20} />
          Show/Hide YCSX
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            if (qlsxplandatafilter.current.length > 0) {
              if (userData?.EMPL_NO !== "NHU1903") {
                checkBP(
                  userData,
                  ["QLSX"],
                  ["ALL"],
                  ["ALL"],
                  handle_UpdatePlan
                );
              }
              setShowChiThi(true);
              setChiThiListRender(renderChiThi(qlsxplandatafilter.current, myComponentRef));
              //console.log(ycsxdatatablefilter.current);
            } else {
              setShowChiThi(false);
              Swal.fire("Thông báo", "Chọn ít nhất 1 Plan để in", "error");
            }
          }}
        >
          <AiOutlinePrinter color='#0066ff' size={15} />
          Print Chỉ Thị
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            if (qlsxplandatafilter.current.length > 0) {
              setShowYCKT(true);
              setYCKTListRender(renderYCKT(qlsxplandatafilter.current));
              //console.log(ycsxdatatablefilter.current);
            } else {
              setShowYCKT(false);
              Swal.fire("Thông báo", "Chọn ít nhất 1 Plan để in", "error");
            }
          }}
        >
          <AiOutlinePrinter color='#9066ff' size={15} />
          Print YCKT
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            /* checkBP(
              userData?.EMPL_NO,
              userData?.MAINDEPTNAME,
              ["QLSX"],
              handle_UpdatePlan
            ); */
            checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], handle_UpdatePlan);
            //handle_UpdatePlan();
          }}
        >
          <AiFillSave color='blue' size={20} />
          Lưu PLAN
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            /*  checkBP(
              userData?.EMPL_NO,
              userData?.MAINDEPTNAME,
              ["QLSX"],
              handleConfirmDeletePlan
            ); */
            checkBP(
              userData,
              ["QLSX"],
              ["ALL"],
              ["ALL"],
              handleConfirmDeletePlan
            );
            //handleConfirmDeletePlan();
          }}
        >
          <FcDeleteRow color='yellow' size={20} />
          Xóa PLAN
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            loadQLSXPlan(selectedPlanDate);
          }}
        >
          <BiRefresh color='yellow' size={20} />
          Refresh PLAN
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            /*  checkBP(
              userData?.EMPL_NO,
              userData?.MAINDEPTNAME,
              ["QLSX"],
              handleSaveQLSX
            ); */
            checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], handleSaveQLSX);
            //handleSaveQLSX();
          }}
        >
          <AiFillSave color='lightgreen' size={20} />
          Lưu Data Định Mức
        </IconButton>
        <span style={{ fontSize: '0.7rem' }}>Total time: {plandatatable.filter(
          (element: QLSXPLANDATA, index: number) => {
            return (
              element.PLAN_EQ === selectedMachine &&
              element.PLAN_FACTORY === selectedFactory
            );
          }
        )[plandatatable.filter(
          (element: QLSXPLANDATA, index: number) => {
            return (
              element.PLAN_EQ === selectedMachine &&
              element.PLAN_FACTORY === selectedFactory
            );
          }
        ).length - 1]?.ACC_TIME?.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 })} min</span>
      </div>
    )
  }
  const handle_xuatlieu_sample = async () => {
    if (selectedPlan !== undefined) {
      let prod_request_no: string =
        selectedPlan?.PROD_REQUEST_NO === undefined
          ? "xxx"
          : selectedPlan?.PROD_REQUEST_NO;
      let check_ycsx_sample: boolean = false;
      let checkPLANID_EXIST_OUT_KHO_SX: boolean = false;
      await generalQuery("getP4002", { PROD_REQUEST_NO: prod_request_no })
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            //console.log(response.data.data);
            let loadeddata = response.data.data.map(
              (element: any, index: number) => {
                return {
                  ...element,
                  id: index,
                };
              }
            );
            if (loadeddata[0].CODE_55 === "04") {
              check_ycsx_sample = true;
            } else {
              check_ycsx_sample = false;
            }
          } else {
            check_ycsx_sample = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      //console.log('check ycsx sample', check_ycsx_sample);
      await generalQuery("check_PLAN_ID_KHO_AO", {
        PLAN_ID: selectedPlan?.PLAN_ID,
      })
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            console.log(response.data.data);
            if (response.data.data.length > 0) {
              checkPLANID_EXIST_OUT_KHO_SX = true;
            } else {
              checkPLANID_EXIST_OUT_KHO_SX = false;
            }
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      //console.log('check ton tai out kho ao',checkPLANID_EXIST_OUT_KHO_SX );
      if (check_ycsx_sample) {
        if (checkPLANID_EXIST_OUT_KHO_SX === false) {
          //nhap kho ao
          await generalQuery("nhapkhoao", {
            FACTORY: selectedFactory,
            PHANLOAI: "N",
            PLAN_ID_INPUT: selectedPlan?.PLAN_ID,
            PLAN_ID_SUDUNG: selectedPlan?.PLAN_ID,
            M_CODE: "A0009680",
            M_LOT_NO: "2201010001",
            ROLL_QTY: 1,
            IN_QTY: 1,
            TOTAL_IN_QTY: 1,
            USE_YN: "O",
          })
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
          //xuat kho ao
          await generalQuery("xuatkhoao", {
            FACTORY: selectedFactory,
            PHANLOAI: "N",
            PLAN_ID_INPUT: selectedPlan?.PLAN_ID,
            PLAN_ID_OUTPUT: selectedPlan?.PLAN_ID,
            M_CODE: "A0009680",
            M_LOT_NO: "2201010001",
            ROLL_QTY: 1,
            OUT_QTY: 1,
            TOTAL_OUT_QTY: 1,
            USE_YN: "O",
          })
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
                updateXUATLIEUCHINHPLAN(
                  selectedPlan?.PLAN_ID === undefined
                    ? "xxx"
                    : selectedPlan?.PLAN_ID
                );
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
          Swal.fire("Thông báo", "Đã xuất liệu ảo thành công", "info");
        } else {
          updateXUATLIEUCHINHPLAN(
            selectedPlan?.PLAN_ID === undefined ? "xxx" : selectedPlan?.PLAN_ID
          );
          Swal.fire("Thông báo", "Đã xuất liệu chính rồi", "info");
        }
      } else {
        Swal.fire("Thông báo", "Đây không phải ycsx sample", "info");
      }
    } else {
      Swal.fire("Thông báo", "Hãy chọn ít nhất 1 chỉ thị", "error");
    }
  };
  const handle_xuatdao_sample = async () => {
    if (selectedPlan !== undefined) {
      let prod_request_no: string =
        selectedPlan?.PROD_REQUEST_NO === undefined
          ? "xxx"
          : selectedPlan?.PROD_REQUEST_NO;
      let check_ycsx_sample: boolean = false;
      let checkPLANID_EXIST_OUT_KNIFE_FILM: boolean = false;
      await generalQuery("getP4002", { PROD_REQUEST_NO: prod_request_no })
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            //console.log(response.data.data);
            let loadeddata = response.data.data.map(
              (element: any, index: number) => {
                return {
                  ...element,
                  id: index,
                };
              }
            );
            if (loadeddata[0].CODE_55 === "04") {
              check_ycsx_sample = true;
            } else {
              check_ycsx_sample = false;
            }
          } else {
            check_ycsx_sample = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(check_ycsx_sample);
      await generalQuery("check_PLAN_ID_OUT_KNIFE_FILM", {
        PLAN_ID: selectedPlan?.PLAN_ID,
      })
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            //console.log(response.data.data);
            if (response.data.data.length > 0) {
              checkPLANID_EXIST_OUT_KNIFE_FILM = true;
            } else {
              checkPLANID_EXIST_OUT_KNIFE_FILM = false;
            }
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      if (check_ycsx_sample) {
        if (checkPLANID_EXIST_OUT_KNIFE_FILM === false) {
          await generalQuery("insert_OUT_KNIFE_FILM", {
            PLAN_ID: selectedPlan?.PLAN_ID,
            EQ_THUC_TE: selectedPlan?.PLAN_EQ,
            CA_LAM_VIEC: "Day",
            EMPL_NO: userData?.EMPL_NO,
            KNIFE_FILM_NO: "1K22LH20",
          })
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
                updateXUAT_DAO_FILM_PLAN(
                  selectedPlan?.PLAN_ID === undefined
                    ? "xxx"
                    : selectedPlan?.PLAN_ID
                );
                //console.log(response.data.data);
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
          Swal.fire("Thông báo", "Đã xuất dao ảo thành công", "success");
        } else {
          Swal.fire("Thông báo", "Đã xuất dao rồi", "info");
        }
      } else {
        Swal.fire("Thông báo", "Đây không phải ycsx sample", "info");
      }
    } else {
      Swal.fire("Thông báo", "Hãy chọn ít nhất 1 chỉ thị", "error");
    }
  };
  const updateDKXLPLAN = (PLAN_ID: string) => {
    generalQuery("updateDKXLPLAN", { PLAN_ID: PLAN_ID })
      .then((response) => {
        console.log(response.data);
        if (response.data.tk_status !== "NG") {
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateXUATLIEUCHINHPLAN = (PLAN_ID: string) => {
    generalQuery("updateXUATLIEUCHINH_PLAN", { PLAN_ID: PLAN_ID })
      .then((response) => {
        console.log(response.data);
        if (response.data.tk_status !== "NG") {
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateXUAT_DAO_FILM_PLAN = (PLAN_ID: string) => {
    generalQuery("update_XUAT_DAO_FILM_PLAN", { PLAN_ID: PLAN_ID })
      .then((response) => {
        console.log(response.data);
        if (response.data.tk_status !== "NG") {
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleDangKyXuatLieu = async (
    PLAN_ID: string,
    PROD_REQUEST_NO: string,
    PROD_REQUEST_DATE: string
  ) => {
    let checkPlanIdO300: boolean = true;
    let NEXT_OUT_NO: string = "001";
    let NEXT_OUT_DATE: string = moment().format("YYYYMMDD");
    await generalQuery("checkPLANID_O300", { PLAN_ID: PLAN_ID })
      .then((response) => {
        console.log(response.data);
        if (response.data.tk_status !== "NG") {
          checkPlanIdO300 = true;
          NEXT_OUT_DATE = response.data.data[0].OUT_DATE;
        } else {
          checkPlanIdO300 = false;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    //kiem tra xem  dang ky xuat lieu hay chua
    let checkPlanIdO301: boolean = true;
    let Last_O301_OUT_SEQ: number = 0;
    await generalQuery("checkPLANID_O301", { PLAN_ID: PLAN_ID })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          Last_O301_OUT_SEQ = parseInt(response.data.data[0].OUT_SEQ);
          checkPlanIdO301 = true;
        } else {
          checkPlanIdO301 = false;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    //console.log(checkPlanIdO302 +' _ '+checkPlanIdO301)
    //get Next_ out_ no
    console.log("check plan id o300", checkPlanIdO300);
    if (!checkPlanIdO300) {
      await generalQuery("getO300_LAST_OUT_NO", {})
        .then((response) => {
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {
            NEXT_OUT_NO = zeroPad(
              parseInt(response.data.data[0].OUT_NO) + 1,
              3
            );
            console.log("nextoutno_o300", NEXT_OUT_NO);
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      // get code_50 phan loai giao hang GC, SK, KD
      let CODE_50: string = "";
      await generalQuery("getP400", {
        PROD_REQUEST_NO: PROD_REQUEST_NO,
        PROD_REQUEST_DATE: PROD_REQUEST_DATE,
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {
            CODE_50 = response.data.data[0].CODE_50;
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(CODE_50);
      await generalQuery("insertO300", {
        OUT_DATE: NEXT_OUT_DATE,
        OUT_NO: NEXT_OUT_NO,
        CODE_03: "01",
        CODE_52: "01",
        CODE_50: CODE_50,
        USE_YN: "Y",
        PROD_REQUEST_DATE: PROD_REQUEST_DATE,
        PROD_REQUEST_NO: PROD_REQUEST_NO,
        FACTORY: selectedFactory,
        PLAN_ID: PLAN_ID,
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      await generalQuery("getO300_ROW", { PLAN_ID: PLAN_ID })
        .then((response) => {
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {
            NEXT_OUT_NO = zeroPad(parseInt(response.data.data[0].OUT_NO), 3);
            console.log("nextoutno_o300", NEXT_OUT_NO);
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    /* xoa dong O301 chua co xuat hien trong O302*/
    /*  await generalQuery("deleteMCODE_O301_Not_ExistIN_O302", {
      PLAN_ID: PLAN_ID,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      }); */
    let checkchithimettotal: number = 0;
    for (let i = 0; i < chithidatatable.length; i++) {
      checkchithimettotal += chithidatatable[i].M_MET_QTY;
    }
    if (checkchithimettotal > 0) {
      for (let i = 0; i < chithidatatable.length; i++) {
        if (chithidatatable[i].M_MET_QTY > 0) {
          console.log("M_MET", chithidatatable[i].M_MET_QTY);
          let TonTaiM_CODE_O301: boolean = false;
          await generalQuery("checkM_CODE_PLAN_ID_Exist_in_O301", {
            PLAN_ID: PLAN_ID,
            M_CODE: chithidatatable[i].M_CODE,
          })
            .then((response) => {
              console.log(response.data);
              if (response.data.tk_status !== "NG") {
                TonTaiM_CODE_O301 = true;
              } else {
                TonTaiM_CODE_O301 = false;
              }
            })
            .catch((error) => {
              console.log(error);
            });
          if (chithidatatable[i].LIEUQL_SX === 1) {
            updateDKXLPLAN(chithidatatable[i].PLAN_ID);
          }
          if (!TonTaiM_CODE_O301) {
            console.log("Next Out NO", NEXT_OUT_NO);
            await generalQuery("checkPLANID_O301", { PLAN_ID: PLAN_ID })
              .then((response) => {
                //console.log(response.data);
                if (response.data.tk_status !== "NG") {
                  Last_O301_OUT_SEQ = parseInt(response.data.data[0].OUT_SEQ);
                } else {
                }
              })
              .catch((error) => {
                console.log(error);
              });
            console.log("outseq", Last_O301_OUT_SEQ);
            await generalQuery("insertO301", {
              OUT_DATE: NEXT_OUT_DATE,
              OUT_NO: NEXT_OUT_NO,
              CODE_03: "01",
              OUT_SEQ: zeroPad(Last_O301_OUT_SEQ + i + 1, 3),
              USE_YN: "Y",
              M_CODE: chithidatatable[i].M_CODE,
              OUT_PRE_QTY:
                chithidatatable[i].M_MET_QTY * chithidatatable[i].M_QTY,
              PLAN_ID: PLAN_ID,
            })
              .then((response) => {
                //console.log(response.data);
                if (response.data.tk_status !== "NG") {
                } else {
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            await generalQuery("updateO301", {
              M_CODE: chithidatatable[i].M_CODE,
              OUT_PRE_QTY:
                chithidatatable[i].M_MET_QTY * chithidatatable[i].M_QTY,
              PLAN_ID: PLAN_ID,
            })
              .then((response) => {
                console.log(response.data);
                if (response.data.tk_status !== "NG") {
                } else {
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      }
      loadQLSXPlan(selectedPlanDate);
    } else {
      Swal.fire("Thông báo", "Cần đăng ký ít nhất 1 met lòng");
    }
  };
  let temp_key: string = "";
  let machine_array: string[] = [
    "F1",
    "F2",
    "F3",
    "F4",
    "S1",
    "S2",
    "S3",
    "S4",
    "S5",
    "S6",
    "S7",
    "S8",
    "D1",
    "D2",
    "D3",
    "D4",
    "D5",
    "E1",
    "E2",
    "E3",
    "E4",
    "E5",
    "E6",
    "E7",
    "E8",
    "E9",
    "E10",
    "E11",
    "E12",
    "E13",
    "E14",
    "E15",
    "E16",
    "E17",
    "E18",
    "E19",
    "E20",
    "E21",
    "E22",
    "E23",
    "E24",
    "E25",
    "E26",
    "E27",
    "E28",
    "E29",
    "E30",
    "E31",
    "E32",
    "E33",
    "E34",
    "E35",
    "E36",
    "E37",
    "E38",
  ];
  let machine_array2: string[] = [
    "FR01",
    "FR02",
    "FR03",
    "FR04",
    "SR01",
    "SR02",
    "SR03",
    "SR04",
    "SR05",
    "SR06",
    "SR07",
    "SR08",
    "DC01",
    "DC02",
    "DC03",
    "DC04",
    "DC05",
    "ED01",
    "ED02",
    "ED03",
    "ED04",
    "ED05",
    "ED06",
    "ED07",
    "ED08",
    "ED09",
    "ED10",
    "ED11",
    "ED12",
    "ED13",
    "ED14",
    "ED15",
    "ED16",
    "ED17",
    "ED18",
    "ED19",
    "ED20",
    "ED21",
    "ED22",
    "ED23",
    "ED24",
    "ED25",
    "ED26",
    "ED27",
    "ED28",
    "ED29",
    "ED30",
    "ED31",
    "ED32",
    "ED33",
    "ED34",
    "ED35",
    "ED36",
    "ED37",
    "ED38",
  ];
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    //console.log('User pressed: ', event.key);
    if (event.key !== "Enter") temp_key += event.key;
    if (event.key === "F2") {
      ////console.log('F2 pressed');
      loadQLSXPlan(selectedPlanDate);
      dispatch(resetChithiArray(""));
    } else if (event.key === "Enter" && showplanwindow === false) {
      //console.log(temp_key);
      if (machine_array.indexOf(temp_key.toUpperCase()) < 0) {
        alert("Không có máy này: " + temp_key.toUpperCase());
      } else {
        setShowPlanWindow(true);
        setSelectedFactory(selection.tab1 === true ? "NM1" : "NM2");
        setSelectedMachine(
          machine_array2[machine_array.indexOf(temp_key.toUpperCase())]
        );
        setChiThiDataTable([]);
      }
      temp_key = "";
    } else if (event.key === "[") {
      setNav(1);
    } else if (event.key === "]") {
      setNav(2);
    } else if (event.key === "Escape") {
      setShowPlanWindow(false);
      setSelectedPlan(undefined);
      setDataDinhMuc({
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
        NOTE: "",
      });
    }
  };
  const handleClick = () => {
    if (myComponentRef.current) {
      //myComponentRef.current?.handleInternalClick();
    }
  };
  const gridRef = useRef<AgGridReact<any>>(null);
  const setHeaderHeight = useCallback((value?: number) => {
    gridRef.current!.api.setGridOption("headerHeight", value);
    //setIdText("headerHeight", value);
  }, []);
  const defaultColDef = useMemo(() => {
    return {
      initialWidth: 100,
      wrapHeaderText: true,
      autoHeaderHeight: false,
      editable: true,
      floatingFilter: true,
      filter: true,
      headerCheckboxSelectionFilteredOnly: true,
    };
  }, []);
  const getRowStyle = (params: any) => {
    return { backgroundColor: '#eaf5e1', fontSize: '0.6rem' };
  };
  const rowStyle = { backgroundColor: 'transparent', height: '20px' };
  const clearSelectedRows = useCallback(() => {
    gridRef.current!.api.deselectAll();
    qlsxplandatafilter.current = [];
  }, []);
  const ycsxDataTableAG = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        toolbar={
          <div>
            <IconButton
              className='buttonIcon'
              onClick={() => {
                handleConfirmSetClosedYCSX();
              }}
            >
              <FaArrowRight color='green' size={15} />
              SET CLOSED
            </IconButton>
            <IconButton
              className='buttonIcon'
              onClick={() => {
                handleConfirmSetPendingYCSX();
              }}
            >
              <MdOutlinePendingActions color='red' size={15} />
              SET PENDING
            </IconButton>
            <IconButton
              className='buttonIcon'
              onClick={() => {
                if (ycsxdatatablefilter.current.length > 0) {
                  setSelection({
                    ...selection,
                    tabycsx: ycsxdatatablefilter.current.length > 0,
                  });
                  console.log(ycsxdatatablefilter.current);
                  setYCSXListRender(renderYCSX(ycsxdatatablefilter.current));
                } else {
                  Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để in", "error");
                }
              }}
            >
              <AiOutlinePrinter color='#0066ff' size={15} />
              Print YCSX
            </IconButton>
            <IconButton
              className='buttonIcon'
              onClick={() => {
                if (ycsxdatatablefilter.current.length > 0) {
                  setSelection({
                    ...selection,
                    tabbanve: ycsxdatatablefilter.current.length > 0,
                  });
                  setYCSXListRender(renderBanVe(ycsxdatatablefilter.current));
                } else {
                  Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để in", "error");
                }
              }}
            >
              <AiOutlinePrinter color='#ff751a' size={15} />
              Print Bản Vẽ
            </IconButton>
            <IconButton
              className='buttonIcon'
              onClick={() => {
                if (ycsxdatatablefilter.current.length > 0) {
                  handle_AddPlan();
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Chọn ít nhất 1 YCSX để thêm PLAN",
                    "error"
                  );
                }
              }}
            >
              <AiFillFolderAdd color='#69f542' size={15} />
              Add to PLAN
            </IconButton>
          </div>
        }
        suppressRowClickSelection={false}
        columns={column_ycsxtable}
        data={ycsxdatatable}
        onCellEditingStopped={(params: any) => {
          //console.log(e.data)
        }} onCellClick={(params: any) => {
          console.log([params.data])
          ycsxdatatablefilter.current = [params.data]
          //setClickedRows(params.data)
          //console.log(params)
        }} onSelectionChange={(params: any) => {
          //console.log(params!.api.getSelectedRows())
          //ycsxdatatablefilter.current = params!.api.getSelectedRows();
        }} />
    )
  }, [ycsxdatatable,selectedMachine,selectedPlanDate])
  const planDataTableAG = useMemo(() => {
    return (
      <div className="agtable">
        {PlanTableAGToolbar()}
      <div className="ag-theme-quartz"
        style={{ height: '100%', }}
      >
        <AgGridReact
          rowData={plandatatable.filter(
            (element: QLSXPLANDATA, index: number) => {
              return (
                element.PLAN_EQ === selectedMachine &&
                element.PLAN_FACTORY === selectedFactory
              );
            }
          )}
          columnDefs={column_plandatatable}
          rowHeight={25}
          defaultColDef={defaultColDef}
          ref={gridRef}
          onGridReady={() => {
            setHeaderHeight(20);
          }}
          columnHoverHighlight={true}
          rowStyle={rowStyle}
          getRowStyle={getRowStyle}
          getRowId={(params: any) => params.data.PLAN_ID}
          rowSelection={"multiple"}
          rowMultiSelectWithClick={true}
          suppressRowClickSelection={true}
          enterNavigatesVertically={true}
          enterNavigatesVerticallyAfterEdit={true}
          stopEditingWhenCellsLoseFocus={true}
          rowBuffer={10}
          debounceVerticalScrollbar={false}
          enableCellTextSelection={true}
          floatingFiltersHeight={23}
          onSelectionChanged={(params: any) => {
          qlsxplandatafilter.current = params!.api.getSelectedRows()
        }}
          onCellClicked={(params: any) => {
            let rowData: QLSXPLANDATA = params.data;
          setSelectedPlan(prev => rowData);
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
          handleGetChiThiTable(
            rowData.PLAN_ID,
            rowData.G_CODE,
            rowData.PLAN_QTY,
            rowData.PROCESS_NUMBER,
            rowData.IS_SETTING ?? 'Y'
          );
          getRecentDM(rowData.G_CODE);
            
          }}
          onRowDoubleClicked={
            (params: any) => {
              
            }
          }
          onCellEditingStopped={(params: any) => {
            //console.log(params)
          }}
        />
        
      </div>
      <div className="bottombar">
        <div className="selected">
          {ycsxdatatablefilter.current.length !== 0 && <span>
            Selected: {ycsxdatatablefilter.current.length}/{plandatatable.filter(
            (element: QLSXPLANDATA, index: number) => {
              return (
                element.PLAN_EQ === selectedMachine &&
                element.PLAN_FACTORY === selectedFactory
              );
            }
          ).length} rows
          </span>}
        </div>
        <div className="totalrow">
          <span>
            Total: {plandatatable.filter(
            (element: QLSXPLANDATA, index: number) => {
              return (
                element.PLAN_EQ === selectedMachine &&
                element.PLAN_FACTORY === selectedFactory
              );
            }
          ).length} rows
          </span>
        </div>
      </div>
      </div>
    )
   /*  return (
      <AGTable
        showFilter={false}
        toolbar={PlanTableAGToolbar()}
        columns={column_plandatatable}
        data={plandatatable.filter(
          (element: QLSXPLANDATA, index: number) => {
            return (
              element.PLAN_EQ === selectedMachine &&
              element.PLAN_FACTORY === selectedFactory
            );
          }
        )}
        onCellEditingStopped={(params: any) => {
          //console.log(e.data)
        }}
        onCellClick={(params: any) => {
          let rowData: QLSXPLANDATA = params.data;
          setSelectedPlan(prev => rowData);
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
          handleGetChiThiTable(
            rowData.PLAN_ID,
            rowData.G_CODE,
            rowData.PLAN_QTY,
            rowData.PROCESS_NUMBER,
            rowData.IS_SETTING ?? 'Y'
          );
          getRecentDM(rowData.G_CODE);
        }}
        onSelectionChange={(params: any) => {
          qlsxplandatafilter.current = params!.api.getSelectedRows()
        }} />
    ) */
  }, [plandatatable, selectedMachine, selectedFactory, datadinhmuc])
  const planMaterialTableAG = useMemo(() =>
    <AGTable
      showFilter={false}
      toolbar={
        <div>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              /*   checkBP(
        userData?.EMPL_NO,
        userData?.MAINDEPTNAME,
        ["QLSX"],
        handleConfirmDKXL
      ); */
              checkBP(
                userData,
                ["QLSX"],
                ["ALL"],
                ["ALL"],
                handleConfirmDKXL
              );
            }}
          >
            <AiOutlineBarcode color='green' size={20} />
            Lưu CT + ĐKXK
          </IconButton>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              /* checkBP(
        userData?.EMPL_NO,
        userData?.MAINDEPTNAME,
        ["QLSX"],
        handleConfirmDeleteLieu
      ); */
              checkBP(
                userData,
                ["QLSX"],
                ["ALL"],
                ["ALL"],
                handleConfirmDeleteLieu
              );
              //handleConfirmDeleteLieu();
            }}
          >
            <FcDeleteRow color='yellow' size={20} />
            Xóa Liệu
          </IconButton>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              /* checkBP(
        userData?.EMPL_NO,
        userData?.MAINDEPTNAME,
        ["QLSX"],
        handleConfirmRESETLIEU
      ); */
              checkBP(
                userData,
                ["QLSX"],
                ["ALL"],
                ["ALL"],
                handleConfirmRESETLIEU
              );
              //handleConfirmRESETLIEU();
            }}
          >
            <BiReset color='red' size={20} />
            RESET Liệu
          </IconButton>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              if (selectedPlan !== undefined) {
                /*  checkBP(userData?.EMPL_NO, userData?.MAINDEPTNAME, ["QLSX"], () => {
          setShowKhoAo(!showkhoao);
          handle_loadKhoAo();
          handle_loadlichsuxuatkhoao();
          handle_loadlichsunhapkhoao();
          handle_loadlichsuinputlieu(
            selectedPlan?.PLAN_ID === undefined
              ? "xxx"
              : selectedPlan?.PLAN_ID
          );
        }); */
                checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], () => {
                  setShowKhoAo(!showkhoao);
                });
              } else {
                Swal.fire("Thông báo", "Hãy chọn một chỉ thị", "error");
              }
            }}
          >
            <FaWarehouse color='blue' size={20} />
            KHO ẢO
          </IconButton>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              handleGetChiThiTable(
                selectedPlan?.PLAN_ID ?? 'xxx',
                selectedPlan?.G_CODE ?? 'xxx',
                selectedPlan?.PLAN_QTY ?? 0,
                selectedPlan?.PROCESS_NUMBER ?? 1,
                selectedPlan?.IS_SETTING ?? 'Y'
              );
            }}
          >
            <BiRefresh color='yellow' size={20} />
            Refresh chỉ thị
          </IconButton>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              checkBP(
                userData,
                ["QLSX"],
                ["ALL"],
                ["ALL"],
                handle_xuatdao_sample
              );
            }}
          >
            <GiCurvyKnife color='red' size={20} />
            Xuất dao sample
          </IconButton>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              checkBP(
                userData,
                ["QLSX"],
                ["ALL"],
                ["ALL"],
                handle_xuatlieu_sample
              );
              //handle_xuatlieu_sample();
            }}
          >
            <AiOutlineArrowRight color='blue' size={20} />
            Xuất liệu sample
          </IconButton>
        </div>}
      columns={column_planmaterialtable}
      data={chithidatatable}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        //clickedRow.current = params.data;
        //console.log(e.data) 
      }} onSelectionChange={(params: any) => {
        //console.log(params)
        //setSelectedRows(params!.api.getSelectedRows()[0]);
        //console.log(e!.api.getSelectedRows())
        qlsxchithidatafilter.current = params!.api.getSelectedRows();
      }}
    />
    , [chithidatatable]);
  useEffect(() => {
    checkMaxLieu();
    loadQLSXPlan(selectedPlanDate);
    handle_loadEQ_STATUS();
    getMachineList();
    let intervalID = window.setInterval(() => {
      handle_loadEQ_STATUS();
    }, 3000);
    return () => {
      window.clearInterval(intervalID);
    };
  }, []);
  return (
    <div className='machineplan' tabIndex={0} onKeyDown={handleKeyDown}>
      <div className='mininavbar'>
        <div className='mininavitem' onClick={() => setNav(1)}>
          <span className='mininavtext'>NM1</span>
        </div>
        <div className='mininavitem' onClick={() => setNav(2)}>
          <span className='mininavtext'>NM2</span>
        </div>
      </div>
      <div className='plandateselect'>
        <label>Plan Date</label>
        <input
          className='inputdata'
          type='date'
          value={selectedPlanDate}
          onChange={(e) => {
            setSelectedPlanDate(e.target.value.toString());
            console.log(e.target.value);
            loadQLSXPlan(e.target.value);
          }}
        ></input>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            loadQLSXPlan(selectedPlanDate);
            dispatch(resetChithiArray(""));
          }}
        >
          <BiRefresh color='blue' size={20} />
          Refresh PLAN
        </IconButton>
      </div>
      {selection.tab1 && (
        <div className='NM1'>
          {eq_series.map((ele_series: string, index: number) => {
            return (
              <div key={index}>
                <span className='machine_title'>{ele_series}-NM1</span>
                <div className='FRlist'>
                  {eq_status
                    .filter(
                      (element: EQ_STATUS, index: number) =>
                        element.FACTORY === "NM1" &&
                        element.EQ_NAME.substring(0, 2) === ele_series
                    )
                    .map((element: EQ_STATUS, index: number) => {
                      return (
                        <MACHINE_COMPONENT
                          key={index}
                          factory={element.FACTORY}
                          machine_name={element.EQ_NAME}
                          eq_status={element.EQ_STATUS}
                          current_g_name={element.G_NAME}
                          current_plan_id={element.CURR_PLAN_ID}
                          run_stop={element.EQ_ACTIVE === "OK" ? 1 : 0}
                          machine_data={plandatatable}
                          onClick={() => {
                            setShowPlanWindow(true);
                            setSelectedFactory(element.FACTORY);
                            setSelectedMachine(element.EQ_NAME);
                            setTrigger(!trigger);
                            setSelectedPlan(undefined);
                            setChiThiDataTable([]);
                          }}
                        />
                      );
                    })}
                </div>
              </div>
            );
          })}
          {/* <span className='machine_title'>FR-NM1</span>
          <div className='FRlist'>
            {eq_status
              .filter(
                (element: EQ_STATUS, index: number) =>
                  element.FACTORY === "NM1" &&
                  element.EQ_NAME.substring(0, 2) === "FR"
              )
              .map((element: EQ_STATUS, index: number) => {
                return (
                  <MACHINE_COMPONENT
                    key={index}
                    factory={element.FACTORY}
                    machine_name={element.EQ_NAME}
                    eq_status={element.EQ_STATUS}
                    current_g_name={element.G_NAME}
                    current_plan_id={element.CURR_PLAN_ID}
                    run_stop={element.EQ_ACTIVE === "OK" ? 1 : 0}
                    machine_data={plandatatable}
                    onClick={() => {
                      setShowPlanWindow(true);
                      setSelectedFactory(element.FACTORY);
                      setSelectedMachine(element.EQ_NAME);
                      setSelectedPlan(undefined);
                      setChiThiDataTable([]);
                    }}
                  />
                );
              })}
          </div>
          <span className='machine_title'>SR-NM1</span>
          <div className='SRlist'>
            {eq_status
              .filter(
                (element: EQ_STATUS, index: number) =>
                  element.FACTORY === "NM1" &&
                  element.EQ_NAME.substring(0, 2) === "SR"
              )
              .map((element: EQ_STATUS, index: number) => {
                return (
                  <MACHINE_COMPONENT
                    key={index}
                    factory={element.FACTORY}
                    eq_status={element.EQ_STATUS}
                    current_g_name={element.G_NAME}
                    current_plan_id={element.CURR_PLAN_ID}
                    machine_name={element.EQ_NAME}
                    run_stop={element.EQ_ACTIVE === "OK" ? 1 : 0}
                    machine_data={plandatatable}
                    onClick={() => {
                      setShowPlanWindow(true);
                      setSelectedFactory(element.FACTORY);
                      setSelectedMachine(element.EQ_NAME);
                      setChiThiDataTable([]);
                    }}
                  />
                );
              })}
          </div>
          <span className='machine_title'>DC-NM1</span>
          <div className='DClist'>
            {eq_status
              .filter(
                (element: EQ_STATUS, index: number) =>
                  element.FACTORY === "NM1" &&
                  element.EQ_NAME.substring(0, 2) === "DC"
              )
              .map((element: EQ_STATUS, index: number) => {
                return (
                  <MACHINE_COMPONENT
                    key={index}
                    factory={element.FACTORY}
                    machine_name={element.EQ_NAME}
                    eq_status={element.EQ_STATUS}
                    current_g_name={element.G_NAME}
                    current_plan_id={element.CURR_PLAN_ID}
                    run_stop={element.EQ_ACTIVE === "OK" ? 1 : 0}
                    machine_data={plandatatable}
                    onClick={() => {
                      setShowPlanWindow(true);
                      setSelectedFactory(element.FACTORY);
                      setSelectedMachine(element.EQ_NAME);
                      setChiThiDataTable([]);
                    }}
                  />
                );
              })}
          </div>
          <span className='machine_title'>ED-NM1</span>
          <div className='EDlist'>
            {eq_status
              .filter(
                (element: EQ_STATUS, index: number) =>
                  element.FACTORY === "NM1" &&
                  element.EQ_NAME.substring(0, 2) === "ED"
              )
              .map((element: EQ_STATUS, index: number) => {
                return (
                  <MACHINE_COMPONENT
                    key={index}
                    factory={element.FACTORY}
                    machine_name={element.EQ_NAME}
                    eq_status={element.EQ_STATUS}
                    current_g_name={element.G_NAME}
                    current_plan_id={element.CURR_PLAN_ID}
                    run_stop={element.EQ_ACTIVE === "OK" ? 1 : 0}
                    machine_data={plandatatable}
                    onClick={() => {
                      setShowPlanWindow(true);
                      setSelectedFactory(element.FACTORY);
                      setSelectedMachine(element.EQ_NAME);
                      setChiThiDataTable([]);
                    }}
                  />
                );
              })}
          </div> */}
        </div>
      )}
      {selection.tab2 && (
        <div className='NM2'>
          {eq_series.map((ele_series: string, index: number) => {
            return (
              <>
                <span className='machine_title'>{ele_series}-NM2</span>
                <div className='FRlist'>
                  {eq_status
                    .filter(
                      (element: EQ_STATUS, index: number) =>
                        element.FACTORY === "NM2" &&
                        element.EQ_NAME.substring(0, 2) === ele_series
                    )
                    .map((element: EQ_STATUS, index: number) => {
                      return (
                        <MACHINE_COMPONENT
                          key={index}
                          factory={element.FACTORY}
                          machine_name={element.EQ_NAME}
                          eq_status={element.EQ_STATUS}
                          current_g_name={element.G_NAME}
                          current_plan_id={element.CURR_PLAN_ID}
                          run_stop={element.EQ_ACTIVE === "OK" ? 1 : 0}
                          machine_data={plandatatable}
                          onClick={() => {
                            setShowPlanWindow(true);
                            setSelectedFactory(element.FACTORY);
                            setSelectedMachine(element.EQ_NAME);
                            setSelectedPlan(undefined);
                            setTrigger(!trigger);
                            setChiThiDataTable([]);
                          }}
                        />
                      );
                    })}
                </div>
              </>
            );
          })}
          {/* <span className='machine_title'>FR-NM2</span>
          <div className='FRlist'>
            {eq_status
              .filter(
                (element: EQ_STATUS, index: number) =>
                  element.FACTORY === "NM2" &&
                  element.EQ_NAME.substring(0, 2) === "FR"
              )
              .map((element: EQ_STATUS, index: number) => {
                return (
                  <MACHINE_COMPONENT
                    key={index}
                    factory={element.FACTORY}
                    machine_name={element.EQ_NAME}
                    eq_status={element.EQ_STATUS}
                    current_g_name={element.G_NAME}
                    current_plan_id={element.CURR_PLAN_ID}
                    run_stop={element.EQ_ACTIVE === "OK" ? 1 : 0}
                    machine_data={plandatatable}
                    onClick={() => {
                      setShowPlanWindow(true);
                      setSelectedFactory(element.FACTORY);
                      setSelectedMachine(element.EQ_NAME);
                      setChiThiDataTable([]);
                    }}
                  />
                );
              })}
          </div>
          <span className='machine_title'>ED-NM2</span>
          <div className='EDlist'>
            {eq_status
              .filter(
                (element: EQ_STATUS, index: number) =>
                  element.FACTORY === "NM2" &&
                  element.EQ_NAME.substring(0, 2) === "ED"
              )
              .map((element: EQ_STATUS, index: number) => {
                return (
                  <MACHINE_COMPONENT
                    key={index}
                    factory={element.FACTORY}
                    machine_name={element.EQ_NAME}
                    eq_status={element.EQ_STATUS}
                    current_g_name={element.G_NAME}
                    current_plan_id={element.CURR_PLAN_ID}
                    run_stop={element.EQ_ACTIVE === "OK" ? 1 : 0}
                    machine_data={plandatatable}
                    onClick={() => {
                      setShowPlanWindow(true);
                      setSelectedFactory(element.FACTORY);
                      setSelectedMachine(element.EQ_NAME);
                      setChiThiDataTable([]);
                    }}
                  />
                );
              })}
          </div> */}
        </div>
      )}
      {selection.tab3 && <div className='allinone'>ALL IN ONE</div>}
      {showplanwindow && (
        <div className='planwindow'>
          <div className='title'>
            {selectedMachine}: {selectedFactory}
            <Button
              onClick={() => {
                setShowPlanWindow(false);
                setSelectedPlan(undefined);
                setDataDinhMuc({
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
                  NOTE: "",
                });
              }}
            >
              Close
            </Button>
            Plan hiện tại trên máy {selectedMachine}
          </div>
          <div className='content'>
            {showYCSX && (
              <div className='ycsxlist'>
                <div className='tracuuYCSX'>
                  <div className='tracuuYCSXform'>
                    <div className='forminput'>
                      <div className='forminputcolumn'>
                        <label>
                          <b>Từ ngày:</b>
                          <input
                            onKeyDown={(e) => {
                              handleSearchCodeKeyDown(e);
                            }}
                            type='date'
                            value={fromdate.slice(0, 10)}
                            onChange={(e) => setFromDate(e.target.value)}
                          ></input>
                        </label>
                        <label>
                          <b>Tới ngày:</b>{" "}
                          <input
                            onKeyDown={(e) => {
                              handleSearchCodeKeyDown(e);
                            }}
                            type='date'
                            value={todate.slice(0, 10)}
                            onChange={(e) => setToDate(e.target.value)}
                          ></input>
                        </label>
                      </div>
                      <div className='forminputcolumn'>
                        <label>
                          <b>Code KD:</b>{" "}
                          <input
                            onKeyDown={(e) => {
                              handleSearchCodeKeyDown(e);
                            }}
                            type='text'
                            placeholder='GH63-xxxxxx'
                            value={codeKD}
                            onChange={(e) => setCodeKD(e.target.value)}
                          ></input>
                        </label>
                        <label>
                          <b>Code ERP:</b>{" "}
                          <input
                            onKeyDown={(e) => {
                              handleSearchCodeKeyDown(e);
                            }}
                            type='text'
                            placeholder='7C123xxx'
                            value={codeCMS}
                            onChange={(e) => setCodeCMS(e.target.value)}
                          ></input>
                        </label>
                      </div>
                      <div className='forminputcolumn'>
                        <label>
                          <b>Tên nhân viên:</b>{" "}
                          <input
                            onKeyDown={(e) => {
                              handleSearchCodeKeyDown(e);
                            }}
                            type='text'
                            placeholder='Trang'
                            value={empl_name}
                            onChange={(e) => setEmpl_Name(e.target.value)}
                          ></input>
                        </label>
                        <label>
                          <b>Khách:</b>{" "}
                          <input
                            onKeyDown={(e) => {
                              handleSearchCodeKeyDown(e);
                            }}
                            type='text'
                            placeholder='SEVT'
                            value={cust_name}
                            onChange={(e) => setCust_Name(e.target.value)}
                          ></input>
                        </label>
                      </div>
                      <div className='forminputcolumn'>
                        <label>
                          <b>Loại sản phẩm:</b>{" "}
                          <input
                            onKeyDown={(e) => {
                              handleSearchCodeKeyDown(e);
                            }}
                            type='text'
                            placeholder='TSP'
                            value={prod_type}
                            onChange={(e) => setProdType(e.target.value)}
                          ></input>
                        </label>
                        <label>
                          <b>Số YCSX:</b>{" "}
                          <input
                            onKeyDown={(e) => {
                              handleSearchCodeKeyDown(e);
                            }}
                            type='text'
                            placeholder='12345'
                            value={prodrequestno}
                            onChange={(e) => setProdRequestNo(e.target.value)}
                          ></input>
                        </label>
                      </div>
                      <div className='forminputcolumn'>
                        <label>
                          <b>Phân loại:</b>
                          <select
                            name='phanloai'
                            value={phanloai}
                            onChange={(e) => {
                              setPhanLoai(e.target.value);
                            }}
                          >
                            <option value='00'>ALL</option>
                            <option value='01'>Thông thường</option>
                            <option value='02'>SDI</option>
                            <option value='03'>GC</option>
                            <option value='04'>SAMPLE</option>
                            <option value='22'>NOT SAMPLE</option>
                          </select>
                        </label>
                        <label>
                          <b>Vật liệu:</b>{" "}
                          <input
                            onKeyDown={(e) => {
                              handleSearchCodeKeyDown(e);
                            }}
                            type='text'
                            placeholder='SJ-203020HC'
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                          ></input>
                        </label>
                      </div>
                      <div className='forminputcolumn'>
                        <label>
                          <b>YCSX Pending:</b>
                          <input
                            onKeyDown={(e) => {
                              handleSearchCodeKeyDown(e);
                            }}
                            type='checkbox'
                            name='alltimecheckbox'
                            defaultChecked={ycsxpendingcheck}
                            onChange={() =>
                              setYCSXPendingCheck(!ycsxpendingcheck)
                            }
                          ></input>
                        </label>
                        <label>
                          <b>Vào kiểm:</b>
                          <input
                            onKeyDown={(e) => {
                              handleSearchCodeKeyDown(e);
                            }}
                            type='checkbox'
                            name='alltimecheckbox'
                            defaultChecked={inspectInputcheck}
                            onChange={() =>
                              setInspectInputCheck(!inspectInputcheck)
                            }
                          ></input>
                        </label>
                      </div>
                      <div className="forminputcolumn">
                        <label>
                          <b>All Time:</b>
                          <input
                            type='checkbox'
                            name='alltimecheckbox'
                            defaultChecked={alltime}
                            onChange={() => setAllTime(!alltime)}
                          ></input>
                        </label>
                        <IconButton
                          className='buttonIcon'
                          onClick={() => {
                            handletraYCSX();
                          }}
                        >
                          <FcSearch color='green' size={15} />
                          Search
                        </IconButton>
                      </div>
                    </div>
                    <div className='formbutton'>
                    </div>
                  </div>
                  <div className='tracuuYCSXTable'>
                    {ycsxDataTableAG}
                  </div>
                </div>
              </div>
            )}
            <div className='chithidiv'>
              <div className='listchithi'>
                <div className='planlist'>
                  {planDataTableAG}
                </div>
              </div>
              <div className='datadinhmucto'>
                <div className='datadinhmuc'>
                  <div className='forminputcolumn'>
                    <label>
                      <b>EQ1:</b>
                      <select
                        name='phanloai'
                        value={datadinhmuc.EQ1}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            EQ1: e.target.value,
                          })
                        }
                        style={{ width: 150, height: 22 }}
                      >
                        {machine_list.map(
                          (ele: MACHINE_LIST, index: number) => {
                            return (
                              <option key={index} value={ele.EQ_NAME}>
                                {ele.EQ_NAME}
                              </option>
                            );
                          }
                        )}
                      </select>
                    </label>
                    <label>
                      <b>EQ2:</b>
                      <select
                        name='phanloai'
                        value={datadinhmuc.EQ2}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            EQ2: e.target.value,
                          })
                        }
                        style={{ width: 150, height: 22 }}
                      >
                        {machine_list.map(
                          (ele: MACHINE_LIST, index: number) => {
                            return (
                              <option key={index} value={ele.EQ_NAME}>
                                {ele.EQ_NAME}
                              </option>
                            );
                          }
                        )}
                      </select>
                    </label>
                  </div>
                  <div className='forminputcolumn'>
                    <label>
                      <b>Setting1(min):</b>{" "}
                      <input
                        type='text'
                        placeholder='Thời gian setting 1'
                        value={datadinhmuc.Setting1}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            Setting1: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                    <label>
                      <b>Setting2(min):</b>{" "}
                      <input
                        type='text'
                        placeholder='Thời gian setting 2'
                        value={datadinhmuc.Setting2}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            Setting2: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                  </div>
                  <div className='forminputcolumn'>
                    <label>
                      <b>UPH1(EA/h):</b>{" "}
                      <input
                        type='text'
                        placeholder='Tốc độ sx 1'
                        value={datadinhmuc.UPH1}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            UPH1: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                    <label>
                      <b>UPH2(EA/h):</b>{" "}
                      <input
                        type='text'
                        placeholder='Tốc độ sx 2'
                        value={datadinhmuc.UPH2}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            UPH2: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                  </div>
                  <div className='forminputcolumn'>
                    <label>
                      <b>Step1:</b>{" "}
                      <input
                        type='text'
                        placeholder='Số bước 1'
                        value={datadinhmuc.Step1}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            Step1: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                    <label>
                      <b>Step2:</b>{" "}
                      <input
                        type='text'
                        placeholder='Số bước 2'
                        value={datadinhmuc.Step2}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            Step2: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                  </div>
                  <div className='forminputcolumn'>
                    <label>
                      <b>LOSS_SX1(%): <span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 1)[0]?.LOSS_SX.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? "---"}%)</span></b>{" "}
                      <input
                        type='text'
                        placeholder='% loss sx 1'
                        value={datadinhmuc.LOSS_SX1}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            LOSS_SX1: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                    <label>
                      <b>LOSS_SX2(%):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 2)[0]?.LOSS_SX.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? "---"}%)</span></b>{" "}
                      <input
                        type='text'
                        placeholder='% loss sx 2'
                        value={datadinhmuc.LOSS_SX2}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            LOSS_SX2: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                  </div>
                  <div className='forminputcolumn'>
                    <label>
                      <b>LOSS ST1 (m):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 1)[0]?.TT_SETTING_MET.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? "---"}m)</span></b>{" "}
                      <input
                        type='text'
                        placeholder='met setting 1'
                        value={datadinhmuc.LOSS_SETTING1}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            LOSS_SETTING1: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                    <label>
                      <b>LOSS ST2 (m):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 2)[0]?.TT_SETTING_MET.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? "---"}m)</span></b>{" "}
                      <input
                        type='text'
                        placeholder='met setting 2'
                        value={datadinhmuc.LOSS_SETTING2}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            LOSS_SETTING2: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                  </div>
                  <div className='forminputcolumn'>
                    <label>
                      <b>FACTORY:</b>
                      <select
                        name='phanloai'
                        value={
                          datadinhmuc.FACTORY === null
                            ? "NA"
                            : datadinhmuc.FACTORY
                        }
                        onChange={(e) => {
                          setDataDinhMuc({
                            ...datadinhmuc,
                            FACTORY: e.target.value,
                          });
                        }}
                        style={{ width: 162, height: 22 }}
                      >
                        <option value='NA'>NA</option>
                        <option value='NM1'>NM1</option>
                        <option value='NM2'>NM2</option>
                      </select>
                    </label>
                  </div>
                </div>
                <div className='datadinhmuc'>
                  <div className='forminputcolumn'>
                    <label>
                      <b>EQ3:</b>
                      <select
                        name='phanloai'
                        value={datadinhmuc.EQ3}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            EQ3: e.target.value,
                          })
                        }
                        style={{ width: 150, height: 22 }}
                      >
                        {machine_list.map(
                          (ele: MACHINE_LIST, index: number) => {
                            return (
                              <option key={index} value={ele.EQ_NAME}>
                                {ele.EQ_NAME}
                              </option>
                            );
                          }
                        )}
                      </select>
                    </label>
                    <label>
                      <b>EQ4:</b>
                      <select
                        name='phanloai'
                        value={datadinhmuc.EQ4}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            EQ4: e.target.value,
                          })
                        }
                        style={{ width: 150, height: 22 }}
                      >
                        {machine_list.map(
                          (ele: MACHINE_LIST, index: number) => {
                            return (
                              <option key={index} value={ele.EQ_NAME}>
                                {ele.EQ_NAME}
                              </option>
                            );
                          }
                        )}
                      </select>
                    </label>
                  </div>
                  <div className='forminputcolumn'>
                    <label>
                      <b>Setting3(min):</b>{" "}
                      <input
                        type='text'
                        placeholder='Thời gian setting 3'
                        value={datadinhmuc.Setting3}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            Setting3: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                    <label>
                      <b>Setting4(min):</b>{" "}
                      <input
                        type='text'
                        placeholder='Thời gian setting 4'
                        value={datadinhmuc.Setting4}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            Setting4: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                  </div>
                  <div className='forminputcolumn'>
                    <label>
                      <b>UPH3(EA/h):</b>{" "}
                      <input
                        type='text'
                        placeholder='Tốc độ sx 1'
                        value={datadinhmuc.UPH3}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            UPH3: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                    <label>
                      <b>UPH4(EA/h):</b>{" "}
                      <input
                        type='text'
                        placeholder='Tốc độ sx 2'
                        value={datadinhmuc.UPH4}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            UPH4: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                  </div>
                  <div className='forminputcolumn'>
                    <label>
                      <b>Step3:</b>{" "}
                      <input
                        type='text'
                        placeholder='Số bước 3'
                        value={datadinhmuc.Step3}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            Step3: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                    <label>
                      <b>Step4:</b>{" "}
                      <input
                        type='text'
                        placeholder='Số bước 4'
                        value={datadinhmuc.Step4}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            Step4: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                  </div>
                  <div className='forminputcolumn'>
                    <label>
                      <b>LOSS_SX3(%):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 3)[0]?.LOSS_SX.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? "---"}%)</span></b>{" "}
                      <input
                        type='text'
                        placeholder='% loss sx 3'
                        value={datadinhmuc.LOSS_SX3}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            LOSS_SX3: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                    <label>
                      <b>LOSS_SX4(%):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 4)[0]?.LOSS_SX.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? "---"}%)</span></b>{" "}
                      <input
                        type='text'
                        placeholder='% loss sx 4'
                        value={datadinhmuc.LOSS_SX4}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            LOSS_SX4: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                  </div>
                  <div className='forminputcolumn'>
                    <label>
                      <b>LOSS ST3 (m):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 3)[0]?.TT_SETTING_MET.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? "---"}m)</span></b>{" "}
                      <input
                        type='text'
                        placeholder='met setting 3'
                        value={datadinhmuc.LOSS_SETTING3}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            LOSS_SETTING3: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                    <label>
                      <b>LOSS ST4 (m):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 4)[0]?.TT_SETTING_MET.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? "---"}m)</span></b>{" "}
                      <input
                        type='text'
                        placeholder='met setting 4'
                        value={datadinhmuc.LOSS_SETTING4}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            LOSS_SETTING4: Number(e.target.value),
                          })
                        }
                      ></input>
                    </label>
                  </div>
                  <div className='forminputcolumn'>
                    <label>
                      <b>NOTE (QLSX):</b>{" "}
                      <input
                        type='text'
                        placeholder='Chú ý'
                        value={datadinhmuc.NOTE}
                        onChange={(e) =>
                          setDataDinhMuc({
                            ...datadinhmuc,
                            NOTE: e.target.value,
                          })
                        }
                      ></input>
                    </label>
                  </div>
                </div>
              </div>
              <div className='listlieuchithi'>
                <div className="title">
                  <span style={{ fontSize: '2rem', fontWeight: "bold", color: "#8c03c2FF" }}>
                    {selectedPlan?.PLAN_ID}
                  </span>
                  <span style={{ fontSize: '1.2rem', fontWeight: "bold", color: "blue" }}>
                    {selectedPlan?.G_NAME_KD}
                  </span>
                  <div className="pdcavit">
                    <span style={{ fontSize: '1rem', fontWeight: "bold", color: "green" }}>
                      PD:{currentPlanPD}
                    </span> ---
                    <span style={{ fontSize: '1rem', fontWeight: "bold", color: "green" }}>
                      CAVITY:{currentPlanCAVITY}
                    </span>
                  </div>
                  <div className="losskt">
                    <span style={{ fontSize: '1rem', fontWeight: "bold", color: "#c7c406f" }}>
                      LOSS KT 10 LOT:{selectedPlan?.ORG_LOSS_KT?.toLocaleString('en-US',)}% (Max 5%)                      
                    </span>
                  </div>
                  <span style={{ fontSize: 20, fontWeight: "bold", color: "#491f49" }}>
                    PLAN_QTY:{selectedPlan?.PLAN_QTY?.toLocaleString("en-US")}
                  </span>
                  <div className="planinfo">
                    <div className='forminputcolumn'>
                      <label>
                        <b>PLAN QTY:</b>{" "}
                        <input
                          type='text'
                          placeholder='PLAN QTY'
                          value={selectedPlan?.PLAN_QTY}
                          onChange={(e) =>
                            setSelectedPlan((prevPlan: any) => {
                              return {
                                ...prevPlan,
                                PLAN_QTY: Number(e.target.value)
                              }
                            })
                          }
                          onBlur={(e) => {
                            handleGetChiThiTable(
                              selectedPlan?.PLAN_ID ?? 'xxx',
                              selectedPlan?.G_CODE ?? 'xxx',
                              Number(e.target.value),
                              selectedPlan?.PROCESS_NUMBER ?? 1,
                              selectedPlan?.IS_SETTING ?? 'Y'
                            );
                          }}
                        ></input>
                      </label>
                      <label>
                        <b>PROC_NUMBER:</b>{" "}
                        <input
                          type='text'
                          placeholder='PROCESS NUMBER'
                          value={selectedPlan?.PROCESS_NUMBER}
                          onChange={(e) =>
                            setSelectedPlan((prevPlan: any) => {
                              return {
                                ...prevPlan,
                                PROCESS_NUMBER: Number(e.target.value)
                              }
                            })
                          }
                        ></input>
                      </label>
                      <label>
                        <b>STEP:</b>{" "}
                        <input
                          type='text'
                          placeholder='STEP'
                          value={selectedPlan?.STEP}
                          onChange={(e) =>
                            setSelectedPlan((prevPlan: any) => {
                              return {
                                ...prevPlan,
                                STEP: Number(e.target.value)
                              }
                            })
                          }
                        ></input>
                      </label>
                      <label>
                        <b>PLAN_EQ:</b>{" "}
                        <input
                          type='text'
                          placeholder='PLAN_EQ'
                          value={selectedPlan?.PLAN_EQ}
                          onChange={(e) =>
                            setSelectedPlan((prevPlan: any) => {
                              return {
                                ...prevPlan,
                                PLAN_EQ: e.target.value
                              }
                            })
                          }
                        ></input>
                      </label>
                      <label>
                        <b>NEXT_PLAN:</b>{" "}
                        <input
                          type='text'
                          placeholder='NEXT_PLAN'
                          value={selectedPlan?.NEXT_PLAN_ID}
                          onChange={(e) =>
                            setSelectedPlan((prevPlan: any) => {
                              return {
                                ...prevPlan,
                                NEXT_PLAN_ID: e.target.value
                              }
                            })
                          }
                        ></input>
                      </label>
                      <label>
                        <b>IS_SETTING:</b>{" "}
                        <input
                          type='checkbox'
                          name='alltimecheckbox'
                          checked={selectedPlan?.IS_SETTING === 'Y'}
                          onChange={(e) => {
                            setSelectedPlan((prevPlan: any) => {
                              return {
                                ...prevPlan,
                                IS_SETTING: e.target.checked ? 'Y' : 'N'
                              }
                            });
                            handleGetChiThiTable(
                              selectedPlan?.PLAN_ID ?? 'xxx',
                              selectedPlan?.G_CODE ?? 'xxx',
                              selectedPlan?.PLAN_QTY ?? 0,
                              selectedPlan?.PROCESS_NUMBER ?? 1,
                              e.target.checked ? 'Y' : 'N'
                            );
                          }
                          }
                          onBlur={(e) => {
                          }}
                        ></input>
                      </label>
                    </div>
                    <div className="formbutton">
                      <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.8rem', padding: '3px', backgroundColor: '#0f20db' }} onClick={() => {
                        if (selectedPlan !== undefined) {
                          checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], async () => {
                            await saveSinglePlan(selectedPlan);
                            await loadQLSXPlan(selectedPlanDate);
                            await handleGetChiThiTable(
                              selectedPlan?.PLAN_ID ?? 'xxx',
                              selectedPlan?.G_CODE ?? 'xxx',
                              selectedPlan?.PLAN_QTY ?? 0,
                              selectedPlan?.PROCESS_NUMBER ?? 1,
                              selectedPlan?.IS_SETTING ?? 'Y'
                            );
                          });
                        }
                        else {
                          Swal.fire('Thông báo', 'Hãy chọn plan')
                        }
                      }}>SAVE PLAN</Button>
                    </div>
                  </div>
                </div>
                <div className='chithitable'>
                  {planMaterialTableAG}
                </div>
              </div>
              {selection.tabycsx && (
                <div className='printycsxpage'>
                  <div className='buttongroup'>
                    <Button
                      onClick={() => {
                        setYCSXListRender(renderYCSX(ycsxdatatablefilter.current));
                      }}
                    >
                      Render YCSX
                    </Button>
                    <Button onClick={handlePrint}>Print YCSX</Button>
                    <Button
                      onClick={() => {
                        setSelection({ ...selection, tabycsx: false });
                      }}
                    >
                      Close
                    </Button>
                  </div>
                  <div className='ycsxrender' ref={ycsxprintref}>
                    {ycsxlistrender}
                  </div>
                </div>
              )}
              {selection.tabbanve && (
                <div className='printycsxpage'>
                  <div className='buttongroup'>
                    <Button
                      onClick={() => {
                        setYCSXListRender(renderBanVe(ycsxdatatablefilter.current));
                      }}
                    >
                      Render Bản Vẽ
                    </Button>
                    <Button onClick={handlePrint}>Print Bản Vẽ</Button>
                    <Button
                      onClick={() => {
                        setSelection({ ...selection, tabbanve: false });
                      }}
                    >
                      Close
                    </Button>
                  </div>
                  <div className='ycsxrender' ref={ycsxprintref}>
                    {ycsxlistrender}
                  </div>
                </div>
              )}
              {showkhoao && (
                <div className='khoaodiv'>
                  <Button
                    onClick={() => {
                      setShowKhoAo(!showkhoao);
                    }}
                  >
                    Close
                  </Button>
                  <KHOAO NEXT_PLAN={selectedPlan?.PLAN_ID} />
                </div>
              )}
              {showChiThi && (
                <div className='printycsxpage'>
                  <div className='buttongroup'>
                    <input
                      type='text'
                      value={maxLieu}
                      onChange={(e) => {
                        setMaxLieu(Number(e.target.value));
                      }}
                    ></input>
                    <button
                      onClick={() => {
                        localStorage.setItem("maxLieu", maxLieu.toString());
                        Swal.fire(
                          "Thông báo",
                          "Đã set lại max dòng",
                          "success"
                        );
                      }}
                    >
                      Set dòng
                    </button>
                    <button
                      onClick={() => {
                        setChiThiListRender(renderChiThi(qlsxplandatafilter.current, myComponentRef));
                      }}
                    >
                      Render Chỉ Thị
                    </button>
                    <button onClick={() => {
                      handleClick();
                      handlePrint();
                    }}>Print Chỉ Thị</button>
                    <button
                      onClick={() => {
                        setShowChiThi(!showChiThi);
                      }}
                    >
                      Close
                    </button>
                  </div>
                  <div className='ycsxrender' ref={ycsxprintref}>
                    {chithilistrender}
                  </div>
                </div>
              )}
              {showChiThi2 && (
                <div className='printycsxpage'>
                  <div className='buttongroup'>
                    <input
                      type='text'
                      value={maxLieu}
                      onChange={(e) => {
                        setMaxLieu(Number(e.target.value));
                      }}
                    ></input>
                    <button
                      onClick={() => {
                        localStorage.setItem("maxLieu", maxLieu.toString());
                        Swal.fire(
                          "Thông báo",
                          "Đã set lại max dòng",
                          "success"
                        );
                      }}
                    >
                      Set dòng
                    </button>
                    <button
                      onClick={() => {
                        setChiThiListRender2(
                          renderChiThi2(
                            chithiarray !== undefined ? chithiarray : [], myComponentRef
                          )
                        );
                      }}
                    >
                      Render Chỉ Thị 2
                    </button>
                    <button onClick={handlePrint}>Print Chỉ Thị</button>
                    <button
                      onClick={() => {
                        setShowChiThi2(!showChiThi2);
                      }}
                    >
                      Close
                    </button>
                  </div>
                  <div className='ycsxrender' ref={ycsxprintref}>
                    {chithilistrender2}
                  </div>
                </div>
              )}
              {showYCKT && (
                <div className='printycsxpage'>
                  <div className='buttongroup'>
                    <button
                      onClick={() => {
                        setYCKTListRender(renderYCKT(qlsxplandatafilter.current));
                      }}
                    >
                      Render YCKT
                    </button>
                    <button onClick={handlePrint}>Print Chỉ Thị</button>
                    <button
                      onClick={() => {
                        setShowYCKT(!showYCKT);
                      }}
                    >
                      Close
                    </button>
                  </div>
                  <div className='ycsxrender' ref={ycsxprintref}>
                    {ycktlistrender}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MACHINE;
