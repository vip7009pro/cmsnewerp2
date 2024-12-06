/* eslint-disable no-loop-func */
import React, { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import MACHINE_COMPONENT from "./MACHINE_COMPONENT";
import "./MACHINE.scss";
import Swal from "sweetalert2";
import { generalQuery, getCompany, uploadQuery } from "../../../../api/Api";
import moment from "moment";
import { Button, IconButton } from "@mui/material";
import {
  AiFillFolderAdd,
  AiFillSave,
  AiOutlineArrowRight,
  AiOutlineBarcode,
  AiOutlineCheck,
  AiOutlineCloudUpload,
  AiOutlinePrinter,
} from "react-icons/ai";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaArrowRight, FaWarehouse } from "react-icons/fa";
import { FcDeleteRow, FcSearch } from "react-icons/fc";
import {
  checkBP,
  f_getMachineListData,
  f_getRecentDMData,
  renderBanVe,
  renderChiThi,
  renderChiThi2,
  renderYCSX,
  f_saveSinglePlan,
  f_handle_loadEQ_STATUS,
  f_saveQLSX,
  f_insertDMYCSX,
  f_updateBatchPlan,
  f_loadQLSXPLANDATA,
  f_handleGetChiThiTable,
  f_handleResetChiThiTable,
  f_saveChiThiMaterialTable,
  f_handletraYCSXQLSX,
  f_setPendingYCSX,
  f_handleDangKyXuatLieu,
  f_deleteQLSXPlan,
  f_deleteChiThiMaterialLine,
  f_addQLSXPLAN,
  f_handle_xuatlieu_sample,
  f_handle_xuatdao_sample,
  f_neededSXQtyByYCSX,
  f_updateLossKT_ZTB_DM_HISTORY,
} from "../../../../api/GlobalFunction";
import { useReactToPrint } from "react-to-print";
import { BiRefresh, BiReset } from "react-icons/bi";
import YCKT from "../YCKT/YCKT";
import { GiCurvyKnife } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { resetChithiArray } from "../../../../redux/slices/globalSlice";
import KHOAO from "../KHOAO/KHOAO";
import { TbLogout } from "react-icons/tb";
import {
  DINHMUC_QSLX,
  EQ_STT,
  MACHINE_LIST,
  QLSXCHITHIDATA,
  QLSXPLANDATA,
  RecentDM,
  UserData,
  YCSX_SLC_DATA,
  YCSXTableData,
} from "../../../../api/GlobalInterface";
import AGTable from "../../../../components/DataTable/AGTable";
import { AgGridReact } from "ag-grid-react";
const MACHINE = () => {
  const myComponentRef = useRef();
  const [recentDMData, setRecentDMData] = useState<RecentDM[]>([])
  const getRecentDM = async (G_CODE: string) => {
    setRecentDMData(await f_getRecentDMData(G_CODE));
  }
  const chithiarray: QLSXPLANDATA[] | undefined = useSelector(
    (state: RootState) => state.totalSlice.multiple_chithi_array
  );
  const dispatch = useDispatch();
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
  const [eq_status, setEQ_STATUS] = useState<EQ_STT[]>([]);
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
  const defaultPlan: QLSXPLANDATA = {
    id: 0,
    PLAN_ID: 'XXX',
    PLAN_DATE: 'XXX',
    PROD_REQUEST_NO: 'XXX',
    PLAN_QTY: 0,
    PLAN_EQ: 'XXX',
    PLAN_FACTORY: 'XXX',
    PLAN_LEADTIME: 0,
    INS_EMPL: 'XXX',
    INS_DATE: 'XXX',
    UPD_EMPL: 'XXX',
    UPD_DATE: 'XXX',
    G_CODE: 'XXX',
    G_NAME: 'XXX',
    G_NAME_KD: 'XXX',
    PROD_REQUEST_DATE: 'XXX',
    PROD_REQUEST_QTY: 0,
    STEP: 0,
    PLAN_ORDER: 'XXX',
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
    FACTORY: 'XXX',
    EQ1: 'XXX',
    EQ2: 'XXX',
    EQ3: 'XXX',
    EQ4: 'XXX',
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
    NOTE: 'XXX',
    NEXT_PLAN_ID: 'XXX',
    XUATDAOFILM: 'XXX',
    EQ_STATUS: 'XXX',
    MAIN_MATERIAL: 'XXX',
    INT_TEM: 'XXX',
    CHOTBC: 'XXX',
    DKXL: 'XXX',
    OLD_PLAN_QTY: 0,
    ACHIVEMENT_RATE: 0,
    PDBV: 'XXX',
    PD: 0,
    CAVITY: 0,
    SETTING_START_TIME: 'XXX',
    MASS_START_TIME: 'XXX',
    MASS_END_TIME: 'XXX',
    REQ_DF: 'XXX',
    AT_LEADTIME: 0,
    ACC_TIME: 0,
    IS_SETTING: 'XXX',
    PDBV_EMPL: 'XXX',
    PDBV_DATE: 'XXX',
    LOSS_KT: 0,
    ORG_LOSS_KT: 0,
    USE_YN: 'XXX',
  };
  const [selectedPlan, setSelectedPlan] = useState<QLSXPLANDATA>(defaultPlan);
  const [showChiThi, setShowChiThi] = useState(false);
  const [showChiThi2, setShowChiThi2] = useState(false);
  const [showYCKT, setShowYCKT] = useState(false);
  const [trigger, setTrigger] = useState(true);
  const ycsxprintref = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => ycsxprintref.current,
  });
  const defaultSLCData: YCSX_SLC_DATA = {
    PROD_REQUEST_NO: "XXX",
    G_CODE: "XXX",
    PD: 0,
    CAVITY: 0,
    LOSS_SX1: 0,
    LOSS_SX2: 0,
    LOSS_SX3: 0,
    LOSS_SX4: 0,
    LOSS_SETTING1: 0,
    LOSS_SETTING2: 0,
    LOSS_SETTING3: 0,
    LOSS_SETTING4: 0,
    LOSS_KT: 0,
    PROD_REQUEST_QTY: 0,
    SLC_CD1: 0,
    SLC_CD2: 0,
    SLC_CD3: 0,
    SLC_CD4: 0
  }
  const [ycsxSLCData, setYCSXSLCDATA] = useState<YCSX_SLC_DATA>(defaultSLCData);
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
  const getMachineList = async () => {
    setMachine_List(await f_getMachineListData());
  };
  const column_ycsxtable = getCompany() === 'CMS' ? [
    {
      field: "PROD_REQUEST_NO", headerName: "SỐ YCSX", width: 50, cellRenderer: (params: any) => {
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
    {
      field: "G_CODE", headerName: "G_CODE", width: 50,
    },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.PDBV === "P" || params.data.PDBV === null)
          return <span style={{ color: "red" }}>{params.data.G_NAME_KD}</span>;
        return <span style={{ color: "green" }}>{params.data.G_NAME_KD}</span>;
      },
    },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 100,
      cellRenderer: (params: any) => {
        if (params.data.PDBV === "P" || params.data.PDBV === null)
          return <span style={{ color: "red" }}>{params.data.G_NAME}</span>;
        return <span style={{ color: "green" }}>{params.data.G_NAME}</span>;
      },
    },    
    {
      field: "PROD_REQUEST_QTY",
      cellDataType: "number",
      headerName: "SL_YCSX",
      width: 60,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#009933" }}>
            <b>{params.data.PROD_REQUEST_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_CD1",
      headerName: "TCD1",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.data.TON_CD1?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD2",
      headerName: "TCD2",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.data.TON_CD2?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD3",
      headerName: "TCD3",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.data.TON_CD3?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD4",
      headerName: "TCD4",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.data.TON_CD4?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "SLC_CD1",
      headerName: "SLC_CD1",
      width: 65,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data?.SLC_CD1?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "SLC_CD2",
      headerName: "SLC_CD2",
      width: 65,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data?.SLC_CD2?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "SLC_CD3",
      headerName: "SLC_CD3",
      width: 65,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data?.SLC_CD3?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "SLC_CD4",
      headerName: "SLC_CD4",
      width: 65,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data?.SLC_CD4?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "CD1",
      headerName: "CD1",
      width: 50,
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
      width: 50,
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
      width: 50,
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
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CD4?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    { field: "EMPL_NAME", headerName: "PIC KD", width: 100 },
    { field: "CUST_NAME_KD", headerName: "KHÁCH", width: 100 },    
    { field: "PROD_REQUEST_DATE", headerName: "NGÀY YCSX", width: 80 },
    { field: "DELIVERY_DT", headerName: "NGÀY GH", width: 80 },
    {
      field: "PO_BALANCE",
      headerName: "PO_BALANCE",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.PO_BALANCE?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },    
    {
      field: "EQ1",
      headerName: "EQ1",
      width: 40,
      cellRenderer: (params: any) => {
        return <span style={{ color: "black" }}>{params.data.EQ1}</span>;
      },
    },
    {
      field: "EQ2",
      headerName: "EQ2",
      width: 40,
      cellRenderer: (params: any) => {
        return <span style={{ color: "black" }}>{params.data.EQ2}</span>;
      },
    },
    {
      field: "EQ3",
      headerName: "EQ3",
      width: 40,
      cellRenderer: (params: any) => {
        return <span style={{ color: "black" }}>{params.data.EQ3}</span>;
      },
    },
    {
      field: "EQ4",
      headerName: "EQ4",
      width: 40,
      cellRenderer: (params: any) => {
        return <span style={{ color: "black" }}>{params.data.EQ4}</span>;
      },
    },    
    {
      field: "PHAN_LOAI",
      headerName: "PHAN_LOAI",
      width: 70,
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
    { field: "PL_HANG", headerName: "PL_HANG", width: 50 },
    { field: "REMARK", headerName: "REMARK", width: 60 },
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
      field: "G_CODE", headerName: "G_CODE", width: 50,
    },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 70,
      cellRenderer: (params: any) => {
        if (params.data.PDBV === "P" || params.data.PDBV === null)
          return <span style={{ color: "red" }}>{params.data.G_NAME_KD}</span>;
        return <span style={{ color: "green" }}>{params.data.G_NAME_KD}</span>;
      },
    },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 120,
      cellRenderer: (params: any) => {
        if (params.data.PDBV === "P" || params.data.PDBV === null)
          return <span style={{ color: "red" }}>{params.data.G_NAME}</span>;
        return <span style={{ color: "green" }}>{params.data.G_NAME}</span>;
      },
    },
    { field: "G_WIDTH", headerName: "WIDTH", width: 50 },
    { field: "G_LENGTH", headerName: "LENGTH", width: 50 },
    { field: "G_C", headerName: "CVT_C", width: 50 },
    { field: "G_C_R", headerName: "CVT_R", width: 50 },
    { field: "PROD_PRINT_TIMES", headerName: "SL_IN", width: 50 },
    { field: "CUST_NAME_KD", headerName: "KHÁCH", width: 70 },
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
    { field: "PROD_REQUEST_DATE", headerName: "NGÀY YCSX", width: 60 },
    { field: "DELIVERY_DT", headerName: "NGÀY GH", width: 80 },
    {
      field: "PO_BALANCE",
      headerName: "PO_BALANCE",
      width: 70,
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
      width: 50,
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
      width: 50,
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
      width: 50,
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
      width: 50,
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
      width: 50,
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
      width: 50,
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
      width: 50,
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
      width: 50,
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
      width: 50,
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
      width: 50,
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
      width: 40,
      cellRenderer: (params: any) => {
        return <span style={{ color: "black" }}>{params.data.EQ1}</span>;
      },
    },
    {
      field: "EQ2",
      headerName: "EQ2",
      width: 40,
      cellRenderer: (params: any) => {
        return <span style={{ color: "black" }}>{params.data.EQ2}</span>;
      },
    },
    {
      field: "EQ3",
      headerName: "EQ3",
      width: 40,
      cellRenderer: (params: any) => {
        return <span style={{ color: "black" }}>{params.data.EQ3}</span>;
      },
    },
    {
      field: "EQ4",
      headerName: "EQ4",
      width: 40,
      cellRenderer: (params: any) => {
        return <span style={{ color: "black" }}>{params.data.EQ4}</span>;
      },
    },
    /* {
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
    }, */
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
    { field: "PL_HANG", headerName: "PL_HANG", width: 60 },
    { field: "REMARK", headerName: "REMARK", width: 100 },
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
      width: 100,
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
    { field: "EMPL_NAME", headerName: "PIC KD", width: 100 },
  ];
  const column_plandatatable = [
    {
      field: "PLAN_ID",
      headerName: "PLAN_ID",
      width: 80,
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
    { field: "G_CODE", headerName: "G_CODE", width: 60, editable: false },
    { field: "G_NAME", headerName: "G_NAME", width: 100, editable: false },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 90,
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
      width: 60,
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
      field: "TON_CD1",
      headerName: "TCD1",
      width: 50,
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
      width: 50,
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
      width: 50,
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
      width: 50,
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
      width: 70,
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
      width: 50,
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
    { field: "PLAN_EQ", headerName: "PLAN_EQ", width: 50, editable: true },
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
    {
      field: "PLAN_FACTORY",
      headerName: "FACTORY",
      width: 70,
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
              //console.log(e.target.checked);
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
      field: "SLC_CD1",
      headerName: "SLC_CD1",
      width: 50,
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
      width: 50,
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
      width: 50,
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
      width: 50,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            {params.data?.SLC_CD4?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "CD1",
      headerName: "CD1",
      width: 50,
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
      width: 50,
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
      width: 50,
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
      width: 50,
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
      field: "PLAN_DATE",
      headerName: "PLAN_DATE",
      width: 60,
      editable: false,
    },
    {
      field: "PROD_REQUEST_NO",
      headerName: "YCSX NO",
      width: 60,
      editable: false,
    },
    {
      field: "PROD_REQUEST_DATE",
      headerName: "YCSX DATE",
      width: 60,
      editable: false,
    },
    {
      field: "NEXT_PLAN_ID",
      headerName: "NEXT_PLAN",
      width: 60,
      editable: true,
    },
    {
      field: "AT_LEADTIME",
      headerName: "LEADTIME",
      width: 60,
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
      width: 60,
      cellRenderer: (params: any) => {
        return (
          <span>{params.data?.ACC_TIME?.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
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
      field: 'OUT_KHO_SX', headerName: 'NEXT_IN', resizable: true, width: 80, editable: false, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#F117FF", fontWeight: "bold" }}>
            {params.data.OUT_KHO_SX}
          </span>
        );
      }
    },
    {
      field: 'OUT_CFM_QTY', headerName: 'WH_IN', resizable: true, width: 80, editable: false, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#F117FF", fontWeight: "bold" }}>
            {params.data.OUT_CFM_QTY}
          </span>
        );
      }
    },
  ]
  const handle_loadEQ_STATUS = async () => {
    let eq_data = await f_handle_loadEQ_STATUS();
    setEQ_STATUS(eq_data.EQ_STATUS);
    setEQ_SERIES(eq_data.EQ_SERIES);
  };
  const handleSaveQLSX = async () => {
    if (selectedPlan.PLAN_ID !== 'XXX') {
      checkBP(userData, ['QLSX'], ['ALL'], ['ALL'], async () => {
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
            PROD_REQUEST_NO: selectedPlan?.PROD_REQUEST_NO,
            G_CODE: selectedPlan?.G_CODE,
            LOSS_SX1: datadinhmuc.LOSS_SX1,
            LOSS_SX2: datadinhmuc.LOSS_SX2,
            LOSS_SX3: datadinhmuc.LOSS_SX3,
            LOSS_SX4: datadinhmuc.LOSS_SX4,
            LOSS_SETTING1: datadinhmuc.LOSS_SETTING1,
            LOSS_SETTING2: datadinhmuc.LOSS_SETTING2,
            LOSS_SETTING3: datadinhmuc.LOSS_SETTING3,
            LOSS_SETTING4: datadinhmuc.LOSS_SETTING4,   
            LOSS_KT: datadinhmuc.LOSS_KT         
          });
          err_code = (await f_saveQLSX({
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
          })) ? "0" : "1";
          if (err_code === "1") {
            Swal.fire("Thông báo", "Lưu thất bại, không được để trống ô cần thiết", "error");
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
  const loadQLSXPlan = async (plan_date: string) => {
    setPlanDataTable(await f_loadQLSXPLANDATA(plan_date, 'ALL', 'ALL'));
  };
  const handletraYCSX = async () => {
    Swal.fire({
      title: "Tra YCSX",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    let ycsxData: YCSXTableData[] = [];
    ycsxData = await f_handletraYCSXQLSX({
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
    });
    if (ycsxData.length > 0) {
      Swal.fire("Thông báo", "Đã load " + ycsxData.length + " dòng", "success");
    }
    else {
      Swal.fire("Thông báo", "Không có dữ liệu", "warning");
    }
    setYcsxDataTable(ycsxData);
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handletraYCSX();
    }
  };
  const setPendingYCSX = async (pending_value: number) => {
    let err_code: string = await f_setPendingYCSX(ycsxdatatablefilter.current, pending_value);
    if (err_code === '0') {
      Swal.fire(
        "Thông báo",
        "SET Pending/Closed thành công!",
        "success"
      );
    }
    else {
      Swal.fire("Thông báo", "Có lỗi: " + err_code, "error");
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành RESET liệu", "Đang RESET liệu", "success");
        setChiThiDataTable(await f_handleResetChiThiTable(selectedPlan));
      }
    });
  };
  const handleConfirmDKXL = async () => {
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
             
        if (selectedPlan.PLAN_ID !== 'XXX') {
          Swal.fire({
            title: "Đang lưu chỉ thị",
            text: "Đang lưu chỉ thị, hay chờ cho tới khi hoàn thành",
            icon: "info",
            showCancelButton: false,
            allowOutsideClick: false,
            confirmButtonText: "OK",
            showConfirmButton: false,
          }); 
            await f_saveChiThiMaterialTable(selectedPlan, getCompany()==='CMS' ? qlsxchithidatafilter.current : chithidatatable);
            //await hanlde_SaveChiThi();
            Swal.fire({
              title: "Đang đăng ký xuất liệu",
              text: "Đang đăng ký xuất liệu, hay chờ cho tới khi hoàn thành",
              icon: "info",
              showCancelButton: false,
              allowOutsideClick: false,
              confirmButtonText: "OK",
              showConfirmButton: false,
            });
            await handleDangKyXuatLieu();
            clearSelectedMaterialRows();
            setChiThiDataTable(await f_handleGetChiThiTable(selectedPlan));
            setPlanDataTable(await f_loadQLSXPLANDATA(selectedPlanDate, 'ALL', 'ALL'));
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
  const handle_DeleteLinePLAN = async () => {
    Swal.fire({
      title: "Xóa chỉ thị",
      text: "Đang xóa chỉ thị được chọn",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    let err_code: string = await f_deleteQLSXPlan(qlsxplandatafilter.current);
    if (err_code === '0') {
      Swal.fire('Thông báo', 'Xóa hoàn thành', 'success')
    }
    else {
      Swal.fire("Thông báo", err_code, "error");
    }
    clearSelectedRows();
    loadQLSXPlan(selectedPlanDate);
  }
  const handle_DeleteLineCHITHI = async () => {
    let kq = await f_deleteChiThiMaterialLine(qlsxchithidatafilter.current, chithidatatable);
    setChiThiDataTable(kq);
  };
  const handle_AddPlan = async () => {
    let err_code: string = await f_addQLSXPLAN(ycsxdatatablefilter.current, selectedPlanDate, selectedMachine, selectedFactory);
    if (err_code !== '0') {
      Swal.fire("Thông báo", err_code, "error");
    }
    else {
      loadQLSXPlan(selectedPlanDate);
    }
  };
  const handle_AddPlan2 = async (data: YCSXTableData[]) => {
    let err_code: string = await f_addQLSXPLAN(data, selectedPlanDate, selectedMachine, selectedFactory);
    if (err_code !== '0') {
      Swal.fire("Thông báo", err_code, "error");
    }
    else {
      loadQLSXPlan(selectedPlanDate);
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
    let err_code: string = "0";
    err_code = await f_updateBatchPlan(selectedPlanTable);
    await f_updateLossKT_ZTB_DM_HISTORY();
    if (err_code !== "0") {
      Swal.fire("Thông báo", "Có lỗi !" + err_code, "error");
    } else {
      Swal.fire("Thông báo", "Lưu PLAN thành công", "success");
      loadQLSXPlan(selectedPlanDate);
    }
  };
  const hanlde_SaveChiThi = async () => {
    let err_code: string = await f_saveChiThiMaterialTable(selectedPlan, getCompany()==='CMS' ? qlsxchithidatafilter.current : chithidatatable);
    if (err_code === "1") {
      Swal.fire(
        "Thông báo",
        "Phải chỉ định liệu quản lý, k để sót size nào, và chỉ chọn 1 loại liệu làm liệu chính, và nhập liệu quản lý chỉ 1 hoặc 0",
        "error"
      );
    }
    else if (err_code !== "0") {
      Swal.fire("Thông báo", "Có lỗi !" + err_code, "error");
    } else {
      Swal.fire("Thông báo", "Lưu Chỉ thị thành công", "success");
    }
    setChiThiDataTable(await f_handleGetChiThiTable(selectedPlan));
    setPlanDataTable(await f_loadQLSXPLANDATA(selectedPlanDate, 'ALL', 'ALL'));
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
    let err_code: string = await f_handle_xuatlieu_sample(selectedPlan);
    if (err_code === '0') {
      Swal.fire('Thông báo', 'Xuất liệu ảo thành công', 'success');
    }
    else {
      Swal.fire('Thông báo', err_code, 'error');
    }
  };
  const handle_xuatdao_sample = async () => {
    let err_code: string = await f_handle_xuatdao_sample(selectedPlan);
    if (err_code === '0') {
      Swal.fire('Thông báo', 'Xuất dao ảo thành công', 'success');
    }
    else {
      Swal.fire('Thông báo', err_code, 'error');
    }
  };
  const handleDangKyXuatLieu = async () => {
    let err_code: string = await f_handleDangKyXuatLieu(selectedPlan, selectedFactory, getCompany()==='CMS' ? qlsxchithidatafilter.current : chithidatatable);
    if (err_code === '0') {
      Swal.fire("Thông báo", "Đăng ký xuất liệu thành công!", "success");
    }
    else {
      Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
    }
    await loadQLSXPlan(selectedPlanDate);
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
      setSelectedPlan(defaultPlan);
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
        LOSS_KT: 0,
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
  const gridMaterialRef = useRef<AgGridReact<any>>(null);
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
  const clearSelectedMaterialRows = useCallback(() => {
    gridMaterialRef.current!.api.deselectAll();
    qlsxchithidatafilter.current = [];
  }, []);
  const selectMaterialRow = async () => {
    const api = gridMaterialRef.current?.api; // Access the grid API   
    api?.forEachNode((node: { data: { M_STOCK: number; }; setSelected: (arg0: boolean) => void; }) => {      
      if (node.data.M_STOCK > 0) {
        node.setSelected(true);
      }
      else {
        node.setSelected(false);
      }
    });
  };


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
          //console.log([params.data])
          ycsxdatatablefilter.current = [params.data]
          //setClickedRows(params.data)
          //console.log(params)
        }} onSelectionChange={(params: any) => {
          //console.log(params!.api.getSelectedRows())
          //ycsxdatatablefilter.current = params!.api.getSelectedRows();
        }} 
        onRowDoubleClick={(params: any) => {
          console.log([params.data])
          handle_AddPlan2([params.data])
        }}
        />
    )
  }, [ycsxdatatable, selectedMachine, selectedPlanDate])
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
            onCellClicked={async (params: any) => {
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
                LOSS_KT: rowData.LOSS_KT ?? 0,
                NOTE: rowData.NOTE ?? "",
              });
              getRecentDM(rowData.G_CODE);
              if (params.column.colId !== 'IS_SETTING') {
                clearSelectedMaterialRows();
                setChiThiDataTable(await f_handleGetChiThiTable(rowData));
                
                //await selectMaterialRow();
              }
              //setYCSXSLCDATA((await f_neededSXQtyByYCSX(rowData.PROD_REQUEST_NO, rowData.G_CODE))[0])
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
  }, [plandatatable, selectedMachine, selectedFactory, datadinhmuc])
  const planMaterialTableAG = useMemo(() =>
    <AGTable
      ref={gridMaterialRef}
      showFilter={false}
      toolbar={
        <div>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              selectMaterialRow();
            }}
          >
            <AiOutlineCheck color='green' size={20} />
            Select
          </IconButton> 
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
              if (selectedPlan.PLAN_ID !== 'XXX') {
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
            Kho SX Main
          </IconButton>
          <IconButton
            className='buttonIcon'
            onClick={async () => {
              setChiThiDataTable(await f_handleGetChiThiTable(selectedPlan));
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
                      (element: EQ_STT, index: number) =>
                        element.FACTORY === "NM1" &&
                        (element.EQ_NAME ?? "NA").substring(0, 2) === ele_series
                    )
                    .map((element: EQ_STT, index: number) => {
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
                            setSelectedFactory(element.FACTORY ?? "NM1");
                            setSelectedMachine(element.EQ_NAME ?? "NA");
                            setTrigger(!trigger);
                            setSelectedPlan(defaultPlan);
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
                      (element: EQ_STT, index: number) =>
                        element.FACTORY === "NM2" &&
                        (element.EQ_NAME ?? "NA").substring(0, 2) === ele_series
                    )
                    .map((element: EQ_STT, index: number) => {
                      return (
                        <MACHINE_COMPONENT
                          key={index}
                          factory={element.FACTORY}
                          machine_name={element.EQ_NAME}
                          eq_status={element.EQ_STATUS}
                          current_g_name={element.G_NAME ?? ""}
                          current_plan_id={element.CURR_PLAN_ID}
                          run_stop={element.EQ_ACTIVE === "OK" ? 1 : 0}
                          machine_data={plandatatable}
                          onClick={() => {
                            setShowPlanWindow(true);
                            setSelectedFactory(element.FACTORY ?? "NM1");
                            setSelectedMachine(element.EQ_NAME ?? "NA");
                            setSelectedPlan(defaultPlan);
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
                setSelectedPlan(defaultPlan);
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
                  LOSS_KT: 0,
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
              <div className="soluongcandiv">
                {(selectedPlan.EQ1 !=='NO' && selectedPlan.EQ1 !=='NA' )&&<div className="slcsub">
                SLC1: {selectedPlan.SLC_CD1?.toLocaleString('en-US',{maximumFractionDigits:0, minimumFractionDigits:0})} EA
                </div>}
                {(selectedPlan.EQ2 !=='NO' && selectedPlan.EQ2 !=='NA' )&&<div className="slcsub">
                SLC2: {selectedPlan.SLC_CD2?.toLocaleString('en-US',{maximumFractionDigits:0, minimumFractionDigits:0})} EA
                </div>}
                {(selectedPlan.EQ3 !=='NO' && selectedPlan.EQ3 !=='NA' )&&<div className="slcsub">
                SLC3: {selectedPlan.SLC_CD3?.toLocaleString('en-US',{maximumFractionDigits:0, minimumFractionDigits:0})} EA
                </div>}
                {(selectedPlan.EQ4 !=='NO' && selectedPlan.EQ4 !=='NA' )&&<div className="slcsub">
                SLC4: {selectedPlan.SLC_CD4?.toLocaleString('en-US',{maximumFractionDigits:0, minimumFractionDigits:0})} EA
                </div>}
                
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
                <div className="title" style={{ backgroundImage: (selectedPlan?.LOSS_KT ?? 0) > 0 ? "linear-gradient(0deg, #afd3d1, #25d468)" : "linear-gradient(0deg, #afd3d1, #ec4f4f)" }}>
                  <span style={{ fontSize: '2rem', fontWeight: "bold", color: "#8c03c2FF" }}>
                    {selectedPlan?.PLAN_ID}
                  </span>
                  <span style={{ fontSize: '1.2rem', fontWeight: "bold", color: "blue" }}>
                    {selectedPlan?.G_NAME_KD}
                  </span>
                  <div className="pdcavit">
                    <span style={{ fontSize: '1rem', fontWeight: "bold", color: "green" }}>
                      PD:{selectedPlan?.PD ?? 0}
                    </span> ---
                    <span style={{ fontSize: '1rem', fontWeight: "bold", color: "green" }}>
                      CAVITY:{selectedPlan?.CAVITY ?? 0}
                    </span>
                  </div>
                  <div className="losskt">
                    <span style={{ fontSize: '1rem', fontWeight: "bold", }}>
                      LOSS KT 10 LOT:{selectedPlan?.ORG_LOSS_KT?.toLocaleString('en-US',)}%
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
                          onBlur={async (e) => {
                            setChiThiDataTable(await f_handleGetChiThiTable(selectedPlan));
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
                          onChange={async (e) => {
                            setSelectedPlan((prevPlan: any) => {
                              return {
                                ...prevPlan,
                                IS_SETTING: e.target.checked ? 'Y' : 'N'
                              }
                            });
                            setChiThiDataTable(await f_handleGetChiThiTable({
                              ...selectedPlan,
                              IS_SETTING: e.target.checked ? 'Y' : 'N'
                            }));
                          }
                          }
                          onBlur={(e) => {
                          }}
                        ></input>
                      </label>
                    </div>
                    <div className="formbutton">
                      <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.8rem', padding: '3px', backgroundColor: '#0f20db' }} onClick={() => {
                        if (selectedPlan.PLAN_ID !== 'XXX') {
                          checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], async () => {
                            await f_saveSinglePlan(selectedPlan);
                            await loadQLSXPlan(selectedPlanDate);
                            setChiThiDataTable(await f_handleGetChiThiTable({
                              ...selectedPlan,
                            }));
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
