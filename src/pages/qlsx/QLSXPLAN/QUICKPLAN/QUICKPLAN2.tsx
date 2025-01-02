import React, { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import "./QUICKPLAN.scss";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode, getCompany, getGlobalSetting, getSocket, getUserData, uploadQuery } from "../../../../api/Api";
import moment from "moment";
import { DataGrid, GridRowSelectionModel, GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Button, IconButton, LinearProgress } from "@mui/material";
import {
  AiFillFileExcel,
  AiFillFolderAdd,
  AiFillSave,
  AiOutlineCloudUpload,
  AiOutlinePrinter,
} from "react-icons/ai";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { FcDeleteRow, FcSearch } from "react-icons/fc";
import {
  checkBP,
  f_addProcessDataTotalQLSX,
  f_checkEQ_SERIES_Exist_In_EQ_SERIES_LIST,
  f_checkProcessNumberContinuos,
  f_deleteProcessNotInCurrentListFromDataBase,
  f_deleteProdProcessData,
  f_getMachineListData,
  f_getRecentDMData,
  f_insert_Notification_Data,
  f_insertDMYCSX,
  f_insertDMYCSX_New,
  f_loadProdProcessData,
  f_saveQLSX,
  f_updateDMSX_LOSS_KT,
  PLAN_ID_ARRAY,
  SaveExcel,
} from "../../../../api/GlobalFunction";
import YCSXComponent from "../../../kinhdoanh/ycsxmanager/YCSXComponent/YCSXComponent";
import DrawComponent from "../../../kinhdoanh/ycsxmanager/DrawComponent/DrawComponent";
import { useReactToPrint } from "react-to-print";
import CHITHI_COMPONENT from "../CHITHI/CHITHI_COMPONENT";
import { BiShow } from "react-icons/bi";
import YCKT from "../YCKT/YCKT";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
  DINHMUC_QSLX,
  MACHINE_LIST,
  PROD_PROCESS_DATA,
  QLSXCHITHIDATA,
  QLSXPLANDATA,
  RecentDM,
  UserData,
  WEB_SETTING_DATA,
  YCSXTableData,
} from "../../../../api/GlobalInterface";
import AGTable from "../../../../components/DataTable/AGTable";
import { NotificationElement } from "../../../../components/NotificationPanel/Notification";
const QUICKPLAN2 = () => {
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
    LOSS_KT: 0,
    NOTE: "",
  });
  const [plandatatable, setPlanDataTable] = useState<QLSXPLANDATA[]>([]);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [tempSelectedMachine, setTempSelectedMachine] = useState<string>("NA");
  const [currentProcessList, setCurrentProcessList] = useState<PROD_PROCESS_DATA[]>([]);
  const tempSelectedProcess = useRef<PROD_PROCESS_DATA>({
    G_CODE: "xxx",
    PROCESS_NUMBER: 0,
    EQ_SERIES: "xxx",
    SETTING_TIME: 0,
    UPH: 0,
    STEP: 0,
    LOSS_SX: 0,
    LOSS_SETTING: 0,
    INS_DATE: "",
    INS_EMPL: "",
    UPD_DATE: "",
    UPD_EMPL: "",
    FACTORY: "NM1"
  });
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
  const [phanloai, setPhanLoai] = useState("00");
  const [material, setMaterial] = useState("");
  const [ycsxdatatable, setYcsxDataTable] = useState<Array<YCSXTableData>>([]);
  const [ycsxdatatablefilter, setYcsxDataTableFilter] = useState<
    Array<YCSXTableData>
  >([]);
  const qlsxplandatafilter = useRef<Array<QLSXPLANDATA>>([]);
  const [ycsxpendingcheck, setYCSXPendingCheck] = useState(false);
  const [inspectInputcheck, setInspectInputCheck] = useState(false);
  const [ycsxlistrender, setYCSXListRender] = useState<Array<ReactElement>>();
  const [chithilistrender, setChiThiListRender] =
    useState<Array<ReactElement>>();
  const [ycktlistrender, setYCKTListRender] = useState<Array<ReactElement>>();
  const [selectedCode, setSelectedCode] = useState("CODE: ");
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
  const selectedPlan = useRef<QLSXPLANDATA>(defaultPlan);
  const [showChiThi, setShowChiThi] = useState(false);
  const [showYCKT, setShowYCKT] = useState(false);
  const [editplan, seteditplan] = useState(true);
  const [temp_id, setTemID] = useState(0);
  const [showhideycsxtable, setShowHideYCSXTable] = useState(1);
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const loadProcessList = async (G_CODE: string) => {
    let loadeddata = await f_loadProdProcessData(G_CODE);
    setCurrentProcessList(loadeddata);
  }
  const getMachineList = async () => {
    setMachine_List(await f_getMachineListData());
  };
  const ycsxprintref = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => ycsxprintref.current,
  });
  const column_ycsxtable: any = [
    {
      field: "YCSX_PENDING",
      headerName: "YCSX_PENDING",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.YCSX_PENDING === 1)
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
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 100,
      renderCell: (params: any) => {
        if (params.row.PDBV === "P" || params.row.PDBV === null)
          return <span style={{ color: "red" }}>{params.row.G_NAME_KD}</span>;
        return <span style={{ color: "green" }}>{params.row.G_NAME_KD}</span>;
      },
    },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 250,
      renderCell: (params: any) => {
        if (params.row.PDBV === "P" || params.row.PDBV === null)
          return <span style={{ color: "red" }}>{params.row.G_NAME}</span>;
        return <span style={{ color: "green" }}>{params.row.G_NAME}</span>;
      },
    },
    { field: "EMPL_NAME", headerName: "PIC KD", width: 150 },
    { field: "CUST_NAME_KD", headerName: "KHÁCH", width: 120 },
    {
      field: "PROD_REQUEST_NO", headerName: "SỐ YCSX", width: 80, renderCell: (params: any) => {
        if (params.row.DACHITHI === null) {
          return (
            <span style={{ color: "black" }}>
              {params.row.PROD_REQUEST_NO}
            </span>
          );
        } else {
          return (
            <span style={{ color: "green" }}>
              <b>{params.row.PROD_REQUEST_NO}</b>
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
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.PO_BALANCE?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "PROD_REQUEST_QTY",
      type: "number",
      headerName: "SL YCSX",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#009933" }}>
            <b>{params.row.PROD_REQUEST_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CD1",
      headerName: "CD1",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.CD1?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "CD2",
      headerName: "CD2",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.CD2?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "CD3",
      headerName: "CD3",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.CD3?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "CD4",
      headerName: "CD4",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.CD4?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "LOT_TOTAL_INPUT_QTY_EA",
      type: "number",
      headerName: "NK",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#cc0099" }}>
            <b>{params.row.LOT_TOTAL_INPUT_QTY_EA?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "LOT_TOTAL_OUTPUT_QTY_EA",
      type: "number",
      headerName: "XK",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#cc0099" }}>
            <b>{params.row.LOT_TOTAL_OUTPUT_QTY_EA?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_CD1",
      headerName: "TCD1",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.TON_CD1?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_CD2",
      headerName: "TCD2",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.TON_CD2?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_CD3",
      headerName: "TCD3",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.TON_CD3?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_CD4",
      headerName: "TCD4",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.TON_CD4?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "INSPECT_BALANCE",
      type: "number",
      headerName: "TKIEM",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#cc0099" }}>
            <b>{params.row.INSPECT_BALANCE?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "EQ1",
      headerName: "EQ1",
      width: 50,
      renderCell: (params: any) => {
        return <span style={{ color: "black" }}>{params.row.EQ1}</span>;
      },
    },
    {
      field: "EQ2",
      headerName: "EQ2",
      width: 50,
      renderCell: (params: any) => {
        return <span style={{ color: "black" }}>{params.row.EQ2}</span>;
      },
    },
    {
      field: "EQ3",
      headerName: "EQ3",
      width: 50,
      renderCell: (params: any) => {
        return <span style={{ color: "black" }}>{params.row.EQ3}</span>;
      },
    },
    {
      field: "EQ4",
      headerName: "EQ4",
      width: 50,
      renderCell: (params: any) => {
        return <span style={{ color: "black" }}>{params.row.EQ4}</span>;
      },
    },
    {
      field: "SHORTAGE_YCSX",
      type: "number",
      headerName: "TỒN YCSX",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.SHORTAGE_YCSX?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "PHAN_LOAI",
      headerName: "PHAN_LOAI",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.PHAN_LOAI === "01")
          return (
            <span style={{ color: "black" }}>
              <b>Thông thường</b>
            </span>
          );
        else if (params.row.PHAN_LOAI === "02")
          return (
            <span style={{ color: "black" }}>
              <b>SDI</b>
            </span>
          );
        else if (params.row.PHAN_LOAI === "03")
          return (
            <span style={{ color: "black" }}>
              <b>GC</b>
            </span>
          );
        else if (params.row.PHAN_LOAI === "04")
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
      renderCell: (params: any) => {
        if (params.row.PDUYET === 1)
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
      renderCell: (params: any) => {
        let file: any = null;
        const uploadFile2 = async (e: any) => {
          //console.log(file);
          checkBP(userData, ['KD'], ['ALL'], ['ALL'], async () => {
            uploadQuery(file, params.row.G_CODE + ".pdf", "banve")
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  generalQuery("update_banve_value", {
                    G_CODE: params.row.G_CODE,
                    banvevalue: "Y",
                  })
                    .then((response) => {
                      if (response.data.tk_status !== "NG") {
                        Swal.fire(
                          "Thông báo",
                          "Upload bản vẽ thành công",
                          "success",
                        );
                        let tempcodeinfodatatable = ycsxdatatable.map(
                          (element: YCSXTableData, index) => {
                            return element.G_CODE === params.row.G_CODE
                              ? { ...element, BANVE: "Y" }
                              : element;
                          },
                        );
                        setYcsxDataTable(tempcodeinfodatatable);
                      } else {
                        Swal.fire(
                          "Thông báo",
                          "Upload bản vẽ thất bại",
                          "error",
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
                    "error",
                  );
                }
              })
              .catch((error) => {
                console.log(error);
              });
          })
        };
        let hreftlink = "/banve/" + params.row.G_CODE + ".pdf";
        if (params.row.BANVE !== "N" && params.row.BANVE !== null) {
          return (
            <span style={{ color: "gray" }}>
              <a target="_blank" rel="noopener noreferrer" href={hreftlink}>
                LINK
              </a>
            </span>
          );
        } else {
          return (
            <div className="uploadfile">
              <IconButton className="buttonIcon" onClick={uploadFile2}>
                <AiOutlineCloudUpload color="yellow" size={15} />
                Upload
              </IconButton>
              <input
                accept=".pdf"
                type="file"
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
      renderCell: (params: any) => {
        if (params.row.PDBV === "P" || params.row.PDBV === null)
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
      renderCell: (params: any) => {
        if (params.row.PDBV === "P" || params.row.PDBV === null)
          return <span style={{ color: "red" }}>{params.row.G_NAME}</span>;
        return <span style={{ color: "green" }}>{params.row.G_NAME}</span>;
      },
    },
  ];
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
      editable: editplan,
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
      editable: editplan,
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
      editable: editplan,
      cellRenderer: (params: any) => {
        if (params.data.PLAN_EQ === null || params.data.PLAN_EQ === "") {
          return <span style={{ color: "red" }}>NG</span>;
        } else {
          return <span style={{ color: "green" }}>{params.data.PLAN_EQ}</span>;
        }
      },
    },
    { field: "STEP", headerName: "STEP", width: 50, editable: editplan },
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
      editable: editplan,
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
    { field: "EQ1", headerName: "EQ1", width: 50, editable: editplan },
    { field: "EQ2", headerName: "EQ2", width: 50, editable: editplan },
    { field: "EQ3", headerName: "EQ3", width: 50, editable: editplan },
    { field: "EQ4", headerName: "EQ4", width: 50, editable: editplan },
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
  const renderYCKT = (planlist: QLSXPLANDATA[]) => {
    return planlist.map((element, index) => (
      <YCKT key={index} DATA={element} />
    ));
  };
  const renderChiThi = (planlist: QLSXPLANDATA[]) => {
    return planlist.map((element, index) => (
      <CHITHI_COMPONENT key={index} DATA={element} />
    ));
  };
  const renderYCSX = (ycsxlist: YCSXTableData[]) => {
    return ycsxlist.map((element, index) => (
      <YCSXComponent key={index} DATA={element} />
    ));
  };
  const renderBanVe = (ycsxlist: YCSXTableData[]) => {
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
      ),
    );
  };
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
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          const loadeddata: YCSXTableData[] = response.data.data.map(
            (element: YCSXTableData, index: number) => {
              let temp_TCD1: number =
                element.TON_CD1 === null ? 0 : element.TON_CD1;
              let temp_TCD2: number =
                element.TON_CD2 === null ? 0 : element.TON_CD2;
              let temp_TCD3: number =
                element.TON_CD3 === null ? 0 : element.TON_CD3;
              let temp_TCD4: number =
                element.TON_CD4 === null ? 0 : element.TON_CD4;
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
                G_NAME: getAuditMode() == 0 ? element?.G_NAME : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME : 'TEM_NOI_BO',
                G_NAME_KD: getAuditMode() == 0 ? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
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
                  element.TKHO_TDYCSX === undefined ||
                    element.TKHO_TDYCSX === null
                    ? 0
                    : element.TKHO_TDYCSX,
                BTP_TDYCSX:
                  element.BTP_TDYCSX === undefined ||
                    element.BTP_TDYCSX === null
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
                W1:
                  element.W1 === undefined || element.W1 === null
                    ? 0
                    : element.W1,
                W2:
                  element.W2 === undefined || element.W2 === null
                    ? 0
                    : element.W2,
                W3:
                  element.W3 === undefined || element.W3 === null
                    ? 0
                    : element.W3,
                W4:
                  element.W4 === undefined || element.W4 === null
                    ? 0
                    : element.W4,
                W5:
                  element.W5 === undefined || element.W5 === null
                    ? 0
                    : element.W5,
                W6:
                  element.W6 === undefined || element.W6 === null
                    ? 0
                    : element.W6,
                W7:
                  element.W7 === undefined || element.W7 === null
                    ? 0
                    : element.W7,
                W8:
                  element.W8 === undefined || element.W8 === null
                    ? 0
                    : element.W8,
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
            },
          );
          setYcsxDataTable(loadeddata);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
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
          "success",
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
    plan_row: QLSXPLANDATA,
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
      PLAN_DATE: plan_row.PLAN_DATE,
      PLAN_EQ: plan_row.PLAN_EQ,
      PLAN_FACTORY: plan_row.PLAN_FACTORY,
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
    let temp_: number = temp_id;
    temp_++;
    setTemID(temp_);
    localStorage.setItem("temp_plan_table_max_id", temp_.toString());
    if (ycsxdatatablefilter.length >= 1) {
      for (let i = 0; i < ycsxdatatablefilter.length; i++) {
        let temp_add_plan: QLSXPLANDATA = {
          id: temp_id + 1,
          PLAN_ID: "PL" + (temp_id + 1),
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
        setPlanDataTable([...plandatatable, temp_add_plan]);
        localStorage.setItem(
          "temp_plan_table",
          JSON.stringify([...plandatatable, temp_add_plan]),
        );
      }      
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
      IS_SETTING: 'Y'
    };
    setPlanDataTable([...plandatatable, temp_add_plan]);
    localStorage.setItem(
      "temp_plan_table",
      JSON.stringify([...plandatatable, temp_add_plan]),
    );
  };
  const handle_SavePlan = async () => {
    if (qlsxplandatafilter.current.length > 0) {
      let org_plan_tb = [...plandatatable];
      localStorage.setItem("temp_plan_table", JSON.stringify(plandatatable));
      let err_code: string = "0";
      for (let i = 0; i < qlsxplandatafilter.current.length; i++) {
        console.log('CURRENT_SLC', qlsxplandatafilter.current[i].CURRENT_SLC)
        if (
          (qlsxplandatafilter.current[i].PROCESS_NUMBER >= 1 && qlsxplandatafilter.current[i].PROCESS_NUMBER <= 4) &&
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
          qlsxplandatafilter.current[i].STEP >= 0 && qlsxplandatafilter.current[i].STEP <= 9
        ) {
          let check_ycsx_hethongcu: boolean = false;
          await generalQuery("checkProd_request_no_Exist_O302", {
            PROD_REQUEST_NO: qlsxplandatafilter.current[i].PROD_REQUEST_NO,
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
            qlsxplandatafilter.current[i].PROD_REQUEST_NO,
            qlsxplandatafilter.current[i],
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
              IS_SETTING: qlsxplandatafilter.current[i].IS_SETTING
            })
              .then((response) => {
                //console.log(response.data.tk_status);
                if (response.data.tk_status !== "NG") {
                  handle_DeleteCompletedPLAN(org_plan_tb, qlsxplandatafilter.current[i].PLAN_ID)
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
          if (!(qlsxplandatafilter.current[i].PROCESS_NUMBER >= 1 && qlsxplandatafilter.current[i].PROCESS_NUMBER <= 4)) {
            err_code += "_" + qlsxplandatafilter.current[i].G_NAME_KD + ": Process Number không hợp lệ";
          }
          else if (qlsxplandatafilter.current[i].PLAN_QTY <= 0) {
            err_code += "_" + qlsxplandatafilter.current[i].G_NAME_KD + ": Số lượng chỉ thị không hợp lệ";
          }
          else if (qlsxplandatafilter.current[i].PLAN_QTY > (qlsxplandatafilter.current[i].CURRENT_SLC ?? 0)) {
            err_code += "_" + qlsxplandatafilter.current[i].G_NAME_KD + ": Số lượng chỉ thị lớn hơn số lượng cần sx";
          }
          else if (qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "") {
            err_code += "_" + qlsxplandatafilter.current[i].G_NAME_KD + ": PLAN_EQ không được rỗng";
          }
          else if (!(qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "FR" ||
            qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "SR" ||
            qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "DC" ||
            qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "ED" ||
            qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "FX" ||
            qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "DG" ||
            qlsxplandatafilter.current[i].PLAN_EQ.substring(0, 2) === "SC")) {
            err_code += "_" + qlsxplandatafilter.current[i].G_NAME_KD + ": PLAN_EQ không hợp lệ";
          }
          else if (!(qlsxplandatafilter.current[i].STEP >= 0 && qlsxplandatafilter.current[i].STEP <= 9)) {
            err_code += "_" + qlsxplandatafilter.current[i].G_NAME_KD + ": STEP không hợp lệ";
          }
        }
      }
      setPlanDataTable(org_plan_tb);
      if (err_code !== "0") {
        Swal.fire("Thông báo", "Có lỗi !" + err_code, "error");
      } else {
        let newNotification: NotificationElement = {
          CTR_CD: '002',
          NOTI_ID: -1,
          NOTI_TYPE: "info",
          TITLE: 'YCSX được tạo chỉ thị sx mới',
          CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã tạo chỉ thị sx mới ${qlsxplandatafilter.current[0].PROD_REQUEST_NO}, CODE:  ${qlsxplandatafilter.current[0].G_NAME_KD} tại máy ${qlsxplandatafilter.current[0].PLAN_EQ} và có thể nhiều hơn nữa`,
          SUBDEPTNAME: "KD,RND,SX_VP,QLSX",
          MAINDEPTNAME: "KD,RND,SX,QLSX",
          INS_EMPL: 'NHU1903',
          INS_DATE: '2024-12-30',
          UPD_EMPL: 'NHU1903',
          UPD_DATE: '2024-12-30',
        }  
        if(await f_insert_Notification_Data(newNotification))
        {
          getSocket().emit("notification_panel", newNotification);
        }
        Swal.fire("Thông báo", "Lưu PLAN thành công", "success");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để lưu", "error");
    }
  };
  const handleSaveQLSX = async () => {
    if (selectedPlan.current?.G_CODE !== '') {
      checkBP(userData, ['QLSX'], ['ALL'], ['ALL'], async () => {
        console.log(datadinhmuc)
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
          Swal.fire(
            "Thông báo",
            "Lưu thất bại, hãy nhập đủ thông tin",
            "error",
          );
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
            LOSS_KT: datadinhmuc.LOSS_KT
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
          })) ? "0" : "1";
          if (err_code === "1") {
            Swal.fire(
              "Thông báo",
              "Lưu thất bại, không được để trống ô cần thiết",
              "error",
            );
          } else {
            //loadQLSXPlan(selectedPlanDate);
            let newNotification: NotificationElement = {
              CTR_CD: '002',
              NOTI_ID: -1,
              NOTI_TYPE: "info",
              TITLE: 'Update định mức sản xuất',
              CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã update định mức sản xuất của code: ${selectedPlan.current?.G_NAME_KD},`,
              SUBDEPTNAME: "SX,QLSX",
              MAINDEPTNAME: "SX,QLSX",
              INS_EMPL: 'NHU1903',
              INS_DATE: '2024-12-30',
              UPD_EMPL: 'NHU1903',
              UPD_DATE: '2024-12-30',
            }  
            if(await f_insert_Notification_Data(newNotification))
            {
              getSocket().emit("notification_panel", newNotification);
            }
            Swal.fire("Thông báo", "Lưu thành công", "success");
          }
        }
      })
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 Code để SET !", "error");
    }
  };
  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
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
            SaveExcel(ycsxdatatable, "YCSX Table");
          }}
        >
          <AiFillFileExcel color="green" size={15} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
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
            if (ycsxdatatablefilter.length > 0) {
              setSelection({
                ...selection,
                tabycsx: ycsxdatatablefilter.length > 0,
              });
              console.log(ycsxdatatablefilter);
              setYCSXListRender(renderYCSX(ycsxdatatablefilter));
            } else {
              Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để in", "error");
            }
          }}
        >
          <AiOutlinePrinter color="#0066ff" size={15} />
          Print YCSX
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            if (ycsxdatatablefilter.length > 0) {
              setSelection({
                ...selection,
                tabbanve: ycsxdatatablefilter.length > 0,
              });
              setYCSXListRender(renderBanVe(ycsxdatatablefilter));
            } else {
              Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để in", "error");
            }
          }}
        >
          <AiOutlinePrinter color="#ff751a" size={15} />
          Print Bản Vẽ
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            if (ycsxdatatablefilter.length > 0) {
              handle_AddPlan();
            } else {
              Swal.fire(
                "Thông báo",
                "Chọn ít nhất 1 YCSX để thêm PLAN",
                "error",
              );
            }
          }}
        >
          <AiFillFolderAdd color="#69f542" size={15} />
          Add to PLAN
        </IconButton>
      </GridToolbarContainer>
    );
  }
  const handleYCSXSelectionforUpdate = (ids: GridRowSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = ycsxdatatable.filter((element: any) =>
      selectedID.has(element.PROD_REQUEST_NO),
    );
    if (datafilter.length > 0) {
      setYcsxDataTableFilter(datafilter);
    } else {
      setYcsxDataTableFilter([]);
      console.log("xoa filter");
    }
  };
  const get1YCSXDATA = async (PROD_REQUEST_NO: string) => {
    let temp_data: YCSXTableData[] = [];
    await generalQuery("quickcheckycsx_New", {
      PROD_REQUEST_NO: PROD_REQUEST_NO,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          const loadeddata: YCSXTableData[] = response.data.data.map(
            (element: YCSXTableData, index: number) => {
              return {
                ...element,
                id: index,
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
  let column_eqlist = [
    { field: "PROCESS_NUMBER", headerName: "CD", flex: 1, editable: true },
    { field: "EQ_SERIES", headerName: "EQ", flex: 1, editable: true },
    { field: "SETTING_TIME", headerName: "SETTING_TIME (min)", flex: 1.1, editable: true },
    {
      field: "UPH", headerName: "UPH (EA/h)", flex: 1, editable: true, cellRenderer: (params: any) => {
        return (
          <span>{params.data?.UPH?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
        )
      }
    },
    { field: "STEP", headerName: "STEP", flex: 1, editable: true },
    { field: "LOSS_SX", headerName: "LOSS_SX (%)", flex: 1, editable: true },
    {
      field: "RECENT_LOSS_SX", headerName: "RECENT_LOSS_SX (%)", flex: 1.3, editable: false, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>{params.data?.RECENT_LOSS_SX?.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
        )
      }
    },
    { field: "LOSS_SETTING", headerName: "LOSS_ST (met)", flex: 1, editable: true },
    {
      field: "RECENT_LOSS_SETTING", headerName: "RECENT_LOSS_ST(met)", flex: 1.3, editable: false, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>{params.data?.RECENT_LOSS_SETTING?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
        )
      }
    },
    { field: "FACTORY", headerName: "FACTORY", flex: 1, editable: true },
  ];
  const eqListAGTable = useMemo(() => {
    return (
      <AGTable
        showFilter={false}
        columns={column_eqlist}
        data={currentProcessList}
        suppressRowClickSelection={true}
        onCellEditingStopped={(params: any) => {
        }} onRowClick={(params: any) => {
          ////console.log(datafilter[0]);        
          //console.log([params.data]);
          tempSelectedProcess.current = params.data;
        }} onSelectionChange={(params: any) => {
          //setCodeDataTableFilter(params!.api.getSelectedRows());
          //console.log(e!.api.getSelectedRows())
          //setCodeDataTableFilter(params!.api.getSelectedRows());
        }} />
    );
  }, [currentProcessList]);
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
          let currentUPH: number = 0;
          if (keyvar === "PROD_REQUEST_NO") {
            temp_ycsx_data = await get1YCSXDATA(params.value);
            currentUPH = currentProcessList.filter((e) => e.PROCESS_NUMBER === 1)[0]?.UPH ?? 0;
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
                      PLAN_QTY: temp_ycsx_data[0].TON_CD1 <= 0 ? 0 : temp_ycsx_data[0].TON_CD1 < currentUPH * qtyFactor ? temp_ycsx_data[0].TON_CD1 : currentUPH * qtyFactor,
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
                    let filteredProcess = currentProcessList.find((e) => e.EQ_SERIES === plan_temp);
                    if (filteredProcess) {
                      let currentSLC = filteredProcess.PROCESS_NUMBER === 1 ? temp_ycsx_data[0].SLC_CD1 : filteredProcess.PROCESS_NUMBER === 2 ? temp_ycsx_data[0].SLC_CD2 : filteredProcess.PROCESS_NUMBER === 3 ? temp_ycsx_data[0].SLC_CD3 : temp_ycsx_data[0].SLC_CD4;
                      let currentTON = filteredProcess.PROCESS_NUMBER === 1 ? temp_ycsx_data[0].TON_CD1 : filteredProcess.PROCESS_NUMBER === 2 ? temp_ycsx_data[0].TON_CD2 : filteredProcess.PROCESS_NUMBER === 3 ? temp_ycsx_data[0].TON_CD3 : temp_ycsx_data[0].TON_CD4;
                      return {
                        ...p,
                        [keyvar]: params.value,
                        PROCESS_NUMBER: 1,
                        CURRENT_SLC: currentSLC,
                        CD1: temp_ycsx_data[0].CD1,
                        CD2: temp_ycsx_data[0].CD2,
                        CD3: temp_ycsx_data[0].CD3,
                        CD4: temp_ycsx_data[0].CD4,
                        TON_CD1: temp_ycsx_data[0].TON_CD1,
                        TON_CD2: temp_ycsx_data[0].TON_CD2,
                        TON_CD3: temp_ycsx_data[0].TON_CD3,
                        TON_CD4: temp_ycsx_data[0].TON_CD4,
                        PLAN_QTY: currentTON <= 0 ? 0 : currentTON < filteredProcess.UPH * qtyFactor ? currentTON : filteredProcess.UPH * qtyFactor,
                      };
                    } else {
                      Swal.fire("Thông báo", "Máy đã nhập ko giống trong BOM", "warning");
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
          let thisProcessList: PROD_PROCESS_DATA[] = [];
          thisProcessList = await f_loadProdProcessData(rowData.G_CODE);
          let recentDMData: RecentDM[] = [];
          recentDMData = await f_getRecentDMData(rowData.G_CODE);
          let updatedThisProcessList: PROD_PROCESS_DATA[] = [];
          updatedThisProcessList = thisProcessList.map((element: PROD_PROCESS_DATA, index: number) => {
            return {
              ...element,
              RECENT_LOSS_SX: recentDMData.filter((e) => e.PROCESS_NUMBER === element.PROCESS_NUMBER)[0]?.LOSS_SX ?? 0,
              RECENT_LOSS_SETTING: recentDMData.filter((e) => e.PROCESS_NUMBER === element.PROCESS_NUMBER)[0]?.TT_SETTING_MET ?? 0,
            };
          });
          setRecentDMData(recentDMData);
          setCurrentProcessList(updatedThisProcessList);
        }}
        onSelectionChange={(params: any) => {
          qlsxplandatafilter.current = params!.api.getSelectedRows()
        }} />
    )
  }, [plandatatable, datadinhmuc])
  useEffect(() => {
    let temp_table: any = [];
    let temp_max: number = 0;
    let temp_string: any = localStorage.getItem("temp_plan_table")?.toString();
    let temp_string2: any = localStorage
      .getItem("temp_plan_table_max_id")
      ?.toString();
    //console.log(temp_string);
    //console.log(temp_string2);
    if (temp_string !== undefined && temp_string2 !== undefined) {
      temp_max = parseInt(temp_string2);
      temp_table = JSON.parse(temp_string);
      setPlanDataTable(temp_table);
      setTemID(temp_max);
    } else {
      setPlanDataTable([]);
      setTemID(0);
    }
    getMachineList();
  }, []);
  return (
    (<div className="quickplan">
      <div className="planwindow">
        <span style={{ fontSize: 25, color: "blue", marginLeft: 20 }}>
          {selectedCode}
        </span>
        {getCompany() === 'CMS' && getUserData()?.EMPL_NO === 'NHU1903' && <div className="processlist">
          <div className="selectmachine">
            Máy:
            <label>
              <select
                disabled={false}
                name="may1"
                value={tempSelectedMachine}
                onChange={(e) => {
                  setTempSelectedMachine(e.target.value);
                }}
              >
                {machine_list.filter(item => item.EQ_NAME !== 'NA' && item.EQ_NAME !== 'NO' && item.EQ_NAME !== 'ALL').
                  map(
                    (ele: MACHINE_LIST, index: number) => {
                      return (
                        <option key={index} value={ele.EQ_NAME}>
                          {ele.EQ_NAME}
                        </option>
                      );
                    },
                  )}
              </select>
            </label>
            <Button
              onClick={async () => {
                if (selectedPlan.current.G_CODE !== '-------') {
                  if (currentProcessList.length > 0) {
                    let nextProcessNo = Math.max(...currentProcessList.map(item => item.PROCESS_NUMBER)) + 1;
                    let tempProcess: PROD_PROCESS_DATA = {
                      G_CODE: selectedPlan.current.G_CODE,
                      PROCESS_NUMBER: nextProcessNo,
                      EQ_SERIES: tempSelectedMachine,
                      SETTING_TIME: 0,
                      UPH: 0,
                      STEP: 0,
                      LOSS_SX: 0,
                      LOSS_SETTING: 0,
                      INS_DATE: '',
                      INS_EMPL: '',
                      UPD_DATE: '',
                      UPD_EMPL: '',
                      FACTORY: 'NM1'
                    }
                    setCurrentProcessList([...currentProcessList, tempProcess]);
                    /* let kq = await f_addProdProcessData({
                      G_CODE: codefullinfo.G_CODE,
                      PROCESS_NUMBER: nextProcessNo,
                      EQ_SERIES: tempSelectedMachine
                    });
                    if (kq) {
                      loadProcessList(codefullinfo.G_CODE);
                      //Swal.fire("Thông báo", "Thêm process thành công", "success");
                    } else {
                      Swal.fire("Thông báo", "Thêm process thất bại", "error");
                    } */
                  } else {
                    let tempProcess: PROD_PROCESS_DATA = {
                      G_CODE: selectedPlan.current.G_CODE,
                      PROCESS_NUMBER: 1,
                      EQ_SERIES: tempSelectedMachine,
                      SETTING_TIME: 0,
                      UPH: 0,
                      STEP: 0,
                      LOSS_SX: 0,
                      LOSS_SETTING: 0,
                      INS_DATE: '',
                      INS_EMPL: '',
                      UPD_DATE: '',
                      UPD_EMPL: '',
                      FACTORY: 'NM1'
                    }
                    setCurrentProcessList([tempProcess]);
                    /* let kq = await f_addProdProcessData({
                      G_CODE: codefullinfo.G_CODE,
                      PROCESS_NUMBER: 1,
                      EQ_SERIES: tempSelectedMachine
                    });
                    if (kq) {
                      loadProcessList(codefullinfo.G_CODE);
                      //Swal.fire("Thông báo", "Thêm process thành công", "success");
                    } else {
                      Swal.fire("Thông báo", "Thêm process thất bại", "error");
                    } */
                  }
                } else {
                  Swal.fire("Thông báo", "Vui lòng chọn sản phẩm", "error");
                }
              }}
            >
              Add
            </Button>
            <Button
              color="error"
              onClick={async () => {
                setCurrentProcessList(currentProcessList.filter(item => item.PROCESS_NUMBER !== tempSelectedProcess.current.PROCESS_NUMBER));
              }
              }
            >
              Delete
            </Button>
            <Button
              onClick={async () => {
                Swal.fire({
                  title: "Cập nhật công đoạn",
                  text: "Đang cập nhật, hãy chờ chút",
                  icon: "info",
                  showCancelButton: false,
                  allowOutsideClick: false,
                  confirmButtonText: "OK",
                  showConfirmButton: false,
                });
                if (selectedPlan.current.PLAN_ID === 'XXX') {
                  Swal.fire('Thông báo', 'Vui lòng chọn plan', 'error');
                  return;
                }
                if (!await f_checkEQ_SERIES_Exist_In_EQ_SERIES_LIST(currentProcessList, machine_list)) {
                  Swal.fire('Thông báo', 'Máy không tồn tại, vui lòng sửa lại', 'error');
                  return;
                }
                if (await f_checkProcessNumberContinuos(currentProcessList)) {
                  //Swal.fire('Thông báo', 'Số thứ tự các công đoạn sản xuất liên tục', 'success');
                } else {
                  Swal.fire('Thông báo', 'Số thứ tự các công đoạn sản xuất không liên tục, vui lòng sửa lại', 'error');
                  return;
                }
                if (currentProcessList.length > 0) {
                  await f_deleteProcessNotInCurrentListFromDataBase(currentProcessList);
                  loadProcessList(selectedPlan.current.G_CODE);
                } else {
                  await f_deleteProdProcessData({
                    G_CODE: selectedPlan.current.G_CODE
                  });
                  loadProcessList(selectedPlan.current.G_CODE);
                }
                await f_addProcessDataTotalQLSX(currentProcessList);
                await f_insertDMYCSX_New({
                  PROD_REQUEST_NO: selectedPlan.current.PROD_REQUEST_NO,
                  G_CODE: selectedPlan.current.G_CODE,
                });
                loadProcessList(selectedPlan.current.G_CODE);
              }}
            >
              Save
            </Button>
          </div>
          {
            eqListAGTable
          }
        </div>}
        <div className="content">
          {(showhideycsxtable === 2 || showhideycsxtable === 3) && (
            <div className="ycsxlist">
              <div className="tracuuYCSX">
                <div className="tracuuYCSXform">
                  <div className="forminput">
                    <div className="forminputcolumn">
                      <label>
                        <b>Từ ngày:</b>
                        <input
                          onKeyDown={(e) => {
                            handleSearchCodeKeyDown(e);
                          }}
                          type="date"
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
                          type="date"
                          value={todate.slice(0, 10)}
                          onChange={(e) => setToDate(e.target.value)}
                        ></input>
                      </label>
                    </div>
                    <div className="forminputcolumn">
                      <label>
                        <b>Code KD:</b>{" "}
                        <input
                          onKeyDown={(e) => {
                            handleSearchCodeKeyDown(e);
                          }}
                          type="text"
                          placeholder="GH63-xxxxxx"
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
                          type="text"
                          placeholder="7C123xxx"
                          value={codeCMS}
                          onChange={(e) => setCodeCMS(e.target.value)}
                        ></input>
                      </label>
                    </div>
                    <div className="forminputcolumn">
                      <label>
                        <b>Tên nhân viên:</b>{" "}
                        <input
                          onKeyDown={(e) => {
                            handleSearchCodeKeyDown(e);
                          }}
                          type="text"
                          placeholder="Trang"
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
                          type="text"
                          placeholder="SEVT"
                          value={cust_name}
                          onChange={(e) => setCust_Name(e.target.value)}
                        ></input>
                      </label>
                    </div>
                    <div className="forminputcolumn">
                      <label>
                        <b>Loại sản phẩm:</b>{" "}
                        <input
                          onKeyDown={(e) => {
                            handleSearchCodeKeyDown(e);
                          }}
                          type="text"
                          placeholder="TSP"
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
                          type="text"
                          placeholder="12345"
                          value={prodrequestno}
                          onChange={(e) => setProdRequestNo(e.target.value)}
                        ></input>
                      </label>
                    </div>
                    <div className="forminputcolumn">
                      <label>
                        <b>Phân loại:</b>
                        <select
                          name="phanloai"
                          value={phanloai}
                          onChange={(e) => {
                            setPhanLoai(e.target.value);
                          }}
                        >
                          <option value="00">ALL</option>
                          <option value="01">Thông thường</option>
                          <option value="02">SDI</option>
                          <option value="03">GC</option>
                          <option value="04">SAMPLE</option>
                          <option value="22">NOT SAMPLE</option>
                        </select>
                      </label>
                      <label>
                        <b>Vật liệu:</b>{" "}
                        <input
                          onKeyDown={(e) => {
                            handleSearchCodeKeyDown(e);
                          }}
                          type="text"
                          placeholder="SJ-203020HC"
                          value={material}
                          onChange={(e) => setMaterial(e.target.value)}
                        ></input>
                      </label>
                    </div>
                    <div className="forminputcolumn">
                      <label>
                        <b>YCSX Pending:</b>
                        <input
                          onKeyDown={(e) => {
                            handleSearchCodeKeyDown(e);
                          }}
                          type="checkbox"
                          name="alltimecheckbox"
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
                          type="checkbox"
                          name="alltimecheckbox"
                          defaultChecked={inspectInputcheck}
                          onChange={() =>
                            setInspectInputCheck(!inspectInputcheck)
                          }
                        ></input>
                      </label>
                    </div>
                  </div>
                  <div className="formbutton">
                    <label>
                      <b>All Time:</b>
                      <input
                        type="checkbox"
                        name="alltimecheckbox"
                        defaultChecked={alltime}
                        onChange={() => setAllTime(!alltime)}
                      ></input>
                    </label>
                    <IconButton
                      className="buttonIcon"
                      onClick={() => {
                        handletraYCSX();
                      }}
                    >
                      <FcSearch color="green" size={30} />
                      Search
                    </IconButton>
                  </div>
                </div>
                <div className="tracuuYCSXTable">
                  <DataGrid
                    sx={{ fontSize: 12, flex: 1 }}
                    slots={{
                      toolbar: CustomToolbarPOTable,
                    }}
                    loading={isLoading}
                    rowHeight={30}
                    rows={ycsxdatatable}
                    columns={column_ycsxtable}
                    pageSizeOptions={[
                      5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
                    ]}
                    editMode="row"
                    getRowId={(row) => row.PROD_REQUEST_NO}
                    onRowSelectionModelChange={(ids: any) => {
                      handleYCSXSelectionforUpdate(ids);
                    }}
                  />
                </div>
                {selection.tabycsx && (
                  <div className="printycsxpage">
                    <div className="buttongroup">
                      <Button
                        onClick={() => {
                          setYCSXListRender(renderYCSX(ycsxdatatablefilter));
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
                    <div className="ycsxrender" ref={ycsxprintref}>
                      {ycsxlistrender}
                    </div>
                  </div>
                )}
                {selection.tabbanve && (
                  <div className="printycsxpage">
                    <div className="buttongroup">
                      <Button
                        onClick={() => {
                          setYCSXListRender(renderBanVe(ycsxdatatablefilter));
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
                    <div className="ycsxrender" ref={ycsxprintref}>
                      {ycsxlistrender}
                    </div>
                  </div>
                )}
                {showChiThi && (
                  <div className="printycsxpage">
                    <div className="buttongroup">
                      <button
                        onClick={() => {
                          setChiThiListRender(renderChiThi(qlsxplandatafilter.current));
                        }}
                      >
                        Render Chỉ Thị
                      </button>
                      <button onClick={handlePrint}>Print Chỉ Thị</button>
                      <button
                        onClick={() => {
                          setShowChiThi(!showChiThi);
                        }}
                      >
                        Close
                      </button>
                    </div>
                    <div className="ycsxrender" ref={ycsxprintref}>
                      {chithilistrender}
                    </div>
                  </div>
                )}
                {showYCKT && (
                  <div className="printycsxpage">
                    <div className="buttongroup">
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
                    <div className="ycsxrender" ref={ycsxprintref}>
                      {ycktlistrender}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {(showhideycsxtable === 1 || showhideycsxtable === 3) && (
            <div className="chithidiv">
              <div className="planlist">
                {planDataTableAG}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>)
  );
};
export default QUICKPLAN2;
