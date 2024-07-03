import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import MACHINE_COMPONENT from "../Machine/MACHINE_COMPONENT";
import "./QUICKPLAN.scss";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode, getGlobalSetting, uploadQuery } from "../../../../api/Api";
import moment from "moment";
import { UserContext } from "../../../../api/Context";
import {
  DataGrid,
  GridAddIcon,
  GridCallbackDetails,
  GridCellEditCommitParams,
  GridEventListener,
  GridSelectionModel,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  MuiBaseEvent,
  MuiEvent,
} from "@mui/x-data-grid";
import {
  Alert,
  Button,
  IconButton,
  LinearProgress,
  TextField,
} from "@mui/material";
import {
  AiFillAmazonCircle,
  AiFillEdit,
  AiFillFileAdd,
  AiFillFileExcel,
  AiFillFolderAdd,
  AiFillSave,
  AiOutlineBarcode,
  AiOutlineCaretRight,
  AiOutlineCloudUpload,
  AiOutlinePrinter,
  AiOutlineRollback,
  AiOutlineSave,
} from "react-icons/ai";
import { MdOutlineDelete, MdOutlinePendingActions } from "react-icons/md";
import { FaArrowRight, FaWarehouse } from "react-icons/fa";
import { FcApprove, FcCancel, FcDeleteRow, FcSearch } from "react-icons/fc";
import {
  checkBP,
  PLAN_ID_ARRAY,
  SaveExcel,
} from "../../../../api/GlobalFunction";
import YCSXComponent from "../../../kinhdoanh/ycsxmanager/YCSXComponent/YCSXComponent";
import DrawComponent from "../../../kinhdoanh/ycsxmanager/DrawComponent/DrawComponent";
import { useReactToPrint } from "react-to-print";
import CHITHI_COMPONENT from "../CHITHI/CHITHI_COMPONENT";
import { BiRefresh, BiReset, BiShow } from "react-icons/bi";
import YCKT from "../YCKT/YCKT";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import axios from "axios";
import {
  DINHMUC_QSLX,
  MACHINE_LIST,
  QLSXCHITHIDATA,
  QLSXPLANDATA,
  RecentDM,
  UserData,
  WEB_SETTING_DATA,
  YCSXTableData,
} from "../../../../api/GlobalInterface";           
const QUICKPLAN = () => {           
  const qtyFactor: number = parseInt(getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'DAILY_TIME')[0]?.CURRENT_VALUE ?? '840')/2/60;
  console.log(qtyFactor)
  const [recentDMData, setRecentDMData]= useState<RecentDM[]>([]);
                                                  
  const [currentPlanPD, setCurrentPlanPD] = useState(0);
  const [currentPlanCAVITY, setCurrentPlanCAVITY] = useState(0);
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
  const [chithidatatable, setChiThiDataTable] = useState<QLSXCHITHIDATA[]>([]);
  const [showplanwindow, setShowPlanWindow] = useState(false);
  const [showkhoao, setShowKhoAo] = useState(false);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
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
  const [qlsxplandatafilter, setQlsxPlanDataFilter] = useState<
    Array<QLSXPLANDATA>
  >([]);
  const [ycsxpendingcheck, setYCSXPendingCheck] = useState(false);
  const [inspectInputcheck, setInspectInputCheck] = useState(false);
  const [ycsxlistrender, setYCSXListRender] = useState<Array<ReactElement>>();
  const [chithilistrender, setChiThiListRender] =
    useState<Array<ReactElement>>();
  const [ycktlistrender, setYCKTListRender] = useState<Array<ReactElement>>();
  const [selectedCode, setSelectedCode] = useState("CODE: ");
  const [selectedG_Code, setSelectedG_Code] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<any>();

  const [showChiThi, setShowChiThi] = useState(false);
  const [showYCKT, setShowYCKT] = useState(false);
  const [editplan, seteditplan] = useState(true);
  const [temp_id, setTemID] = useState(0);
  const [showhideycsxtable, setShowHideYCSXTable] = useState(1);
  const [showhidedinhmuc, setShowHideDinhMuc] = useState(true);
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);

  const getRecentDM = (G_CODE: string) => {
    generalQuery("loadRecentDM", {G_CODE: G_CODE})
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
            },
          );
          loadeddata.push({ EQ_NAME: "NO" }, { EQ_NAME: "NA" });
          console.log(loadeddata);
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
  const ycsxprintref = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => ycsxprintref.current,
  });
  const column_ycsxtable = [
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
              {params.row.PROD_REQUEST_NO.toLocaleString("en-US")}
            </span>
          );
        } else {
          return (
            <span style={{ color: "green" }}>
              <b>{params.row.PROD_REQUEST_NO.toLocaleString("en-US")}</b>
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
            <b>{params.row.PO_BALANCE.toLocaleString("en", "US")}</b>
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
            <b>{params.row.PROD_REQUEST_QTY.toLocaleString("en-US")}</b>
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
            <b>{params.row.CD1.toLocaleString("en", "US")}</b>
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
            <b>{params.row.CD2.toLocaleString("en", "US")}</b>
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
            <b>{params.row.CD3.toLocaleString("en", "US")}</b>
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
            <b>{params.row.CD4.toLocaleString("en", "US")}</b>
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
            <b>{params.row.LOT_TOTAL_INPUT_QTY_EA.toLocaleString("en-US")}</b>
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
            <b>{params.row.LOT_TOTAL_OUTPUT_QTY_EA.toLocaleString("en-US")}</b>
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
            <b>{params.row.TON_CD1.toLocaleString("en", "US")}</b>
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
            <b>{params.row.TON_CD2.toLocaleString("en", "US")}</b>
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
            <b>{params.row.TON_CD3.toLocaleString("en", "US")}</b>
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
            <b>{params.row.TON_CD4.toLocaleString("en", "US")}</b>
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
            <b>{params.row.INSPECT_BALANCE.toLocaleString("en-US")}</b>
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
            <b>{params.row.SHORTAGE_YCSX.toLocaleString("en-US")}</b>
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
      editable: false,
      resizable: true,
    },
    {
      field: "PROD_REQUEST_NO",
      headerName: "YCSX_NO",
      width: 100,
      editable: true,
    },
    { field: "G_CODE", headerName: "G_CODE", width: 80, editable: false },
    { field: "G_NAME", headerName: "G_NAME", width: 130, editable: false },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 100,
      editable: false,
      renderCell: (params: any) => {
        if (
          params.row.FACTORY === null ||
          params.row.EQ1 === null ||
          params.row.EQ2 === null ||
          params.row.Setting1 === null ||
          params.row.Setting2 === null ||
          params.row.UPH1 === null ||
          params.row.UPH2 === null ||
          params.row.Step1 === null ||
          params.row.Step1 === null ||
          params.row.LOSS_SX1 === null ||
          params.row.LOSS_SX2 === null ||
          params.row.LOSS_SETTING1 === null ||
          params.row.LOSS_SETTING2 === null
        )
          return <span style={{ color: "red" }}>{params.row.G_NAME_KD}</span>;
        return <span style={{ color: "green" }}>{params.row.G_NAME_KD}</span>;
      },
    },
    {
      field: "PROD_REQUEST_QTY",
      headerName: "YCSX_QTY",
      width: 80,
      editable: false,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.PROD_REQUEST_QTY.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "CD1",
      headerName: "CD1",
      width: 60,
      editable: false,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.CD1?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "CD2",
      headerName: "CD2",
      width: 60,
      editable: false,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.CD2?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "CD3",
      headerName: "CD3",
      width: 60,
      editable: false,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.CD3?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "CD4",
      headerName: "CD4",
      width: 60,
      editable: false,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.CD4?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD1",
      headerName: "TCD1",
      width: 70,
      editable: false,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.TON_CD1.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD2",
      headerName: "TCD2",
      width: 70,
      editable: false,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.TON_CD2.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD3",
      headerName: "TCD3",
      width: 70,
      editable: false,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.TON_CD3.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD4",
      headerName: "TCD4",
      width: 70,
      editable: false,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.TON_CD4.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "PLAN_QTY",
      headerName: "PLAN_QTY",
      width: 80,
      editable: editplan,
      renderCell: (params: any) => {
        if (params.row.PLAN_QTY === 0) {
          return <span style={{ color: "red" }}>NG</span>;
        } else {
          return (
            <span style={{ color: "green" }}>
              {params.row.PLAN_QTY.toLocaleString("en", "US")}
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
      renderCell: (params: any) => {
        if (
          params.row.PROCESS_NUMBER === null ||
          params.row.PROCESS_NUMBER === 0
        ) {
          return <span style={{ color: "red" }}>NG</span>;
        } else {
          return (
            <span style={{ color: "green" }}>{params.row.PROCESS_NUMBER}</span>
          );
        }
      },
    },
    {
      field: "PLAN_ORDER",
      headerName: "ORDER",
      width: 60,
      editable: editplan,
    },
    { field: "EQ1", headerName: "EQ1", width: 50, editable: editplan },
    { field: "EQ2", headerName: "EQ2", width: 50, editable: editplan },
    { field: "EQ3", headerName: "EQ3", width: 50, editable: editplan },
    { field: "EQ4", headerName: "EQ4", width: 50, editable: editplan },
    {
      field: "PLAN_EQ",
      headerName: "PLAN_EQ",
      width: 80,
      editable: editplan,
      renderCell: (params: any) => {
        if (params.row.PLAN_EQ === null || params.row.PLAN_EQ === "") {
          return <span style={{ color: "red" }}>NG</span>;
        } else {
          return <span style={{ color: "green" }}>{params.row.PLAN_EQ}</span>;
        }
      },
    },
    { field: "STEP", headerName: "STEP", width: 50, editable: editplan },
    {
      field: "IS_SETTING",
      headerName: "IS_SETTING",
      width: 100,
      renderCell: (params: any) => {
        return (
          <input
          type='checkbox'
          name='alltimecheckbox'
          defaultChecked={params.row.IS_SETTING==='Y'}
          onChange={(value) => {  
            //console.log(value);
            const newdata = plandatatable.map((p) =>
              p.PLAN_ID === params.row.PLAN_ID
                ? { ...p, IS_SETTING: params.row.IS_SETTING==='Y'? 'N': 'Y' }
                : p
            );
            setPlanDataTable(newdata);
            setQlsxPlanDataFilter([]);
          }}
        ></input>
        )
      },
      editable: false,    
    },
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
  const loadQLSXPlan = (PROD_REQUEST_NO: string) => {
    //console.log(selectedPlanDate);
    generalQuery("getqlsxplan_table", { PROD_REQUEST_NO: PROD_REQUEST_NO })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: QLSXPLANDATA, index: number) => {
              return {
                ...element,
                PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setPlanDataTable(loadeddata);
        } else {
          setPlanDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
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
    if (qlsxplandatafilter.length > 0) {
      let datafilter = [...plandatatable];
      for (let i = 0; i < qlsxplandatafilter.length; i++) {
        for (let j = 0; j < datafilter.length; j++) {
          if (qlsxplandatafilter[i].id === datafilter[j].id) {
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
    if (qlsxplandatafilter.length !== 0) {
      localStorage.setItem("temp_plan_table", JSON.stringify(plandatatable));
      let err_code: string = "0";
      for (let i = 0; i < qlsxplandatafilter.length; i++) {
        if (
          (parseInt(qlsxplandatafilter[i].PROCESS_NUMBER.toString()) >= 1 ||
            parseInt(qlsxplandatafilter[i].PROCESS_NUMBER.toString()) <= 4) &&
          qlsxplandatafilter[i].PLAN_QTY !== 0 &&
          qlsxplandatafilter[i].PLAN_QTY <=
          qlsxplandatafilter[i].PROD_REQUEST_QTY &&
          qlsxplandatafilter[i].PLAN_EQ.substring(0, 2) !== "" &&
          (qlsxplandatafilter[i].PLAN_EQ.substring(0, 2) === "FR" ||
            qlsxplandatafilter[i].PLAN_EQ.substring(0, 2) === "SR" ||
            qlsxplandatafilter[i].PLAN_EQ.substring(0, 2) === "DC" ||
            qlsxplandatafilter[i].PLAN_EQ.substring(0, 2) === "ED") &&
          parseInt(qlsxplandatafilter[i].STEP.toString()) >= 0 &&
          parseInt(qlsxplandatafilter[i].STEP.toString()) <= 9
        ) {
          let check_ycsx_hethongcu: boolean = false;
          await generalQuery("checkProd_request_no_Exist_O302", {
            PROD_REQUEST_NO: qlsxplandatafilter[i].PROD_REQUEST_NO,
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
            qlsxplandatafilter[i].PROD_REQUEST_NO,
            qlsxplandatafilter[i],
          );
          let NextPlanID = nextPlan.NEXT_PLAN_ID;
          let NextPlanOrder = nextPlan.NEXT_PLAN_ORDER;
          if (check_ycsx_hethongcu === false) {
            generalQuery("addPlanQLSX", {
              STEP: qlsxplandatafilter[i].STEP,
              PLAN_QTY: qlsxplandatafilter[i].PLAN_QTY,
              PLAN_LEADTIME: qlsxplandatafilter[i].PLAN_LEADTIME,
              PLAN_EQ: qlsxplandatafilter[i].PLAN_EQ,
              PLAN_ORDER: NextPlanOrder,
              PROCESS_NUMBER: qlsxplandatafilter[i].PROCESS_NUMBER,
              KETQUASX:
                qlsxplandatafilter[i].KETQUASX === null
                  ? 0
                  : qlsxplandatafilter[i].KETQUASX,
              PLAN_ID: NextPlanID,
              PLAN_DATE: moment().format("YYYY-MM-DD"),
              PROD_REQUEST_NO: qlsxplandatafilter[i].PROD_REQUEST_NO,
              PLAN_FACTORY: qlsxplandatafilter[i].PLAN_FACTORY,
              G_CODE: qlsxplandatafilter[i].G_CODE,
              NEXT_PLAN_ID: qlsxplandatafilter[i].NEXT_PLAN_ID,
              IS_SETTING: qlsxplandatafilter[i].IS_SETTING
            })
              .then((response) => {
                //console.log(response.data.tk_status);
                if (response.data.tk_status !== "NG") {
                  handle_DeleteLinePLAN();
                } else {
                  err_code += "_" + response.data.message;
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            err_code +=
              "__Yc này đã chạy hệ thống cũ, chạy nốt bằng hệ thống cũ nhé";
          }
        } else {
          err_code +=
            "_" +
            qlsxplandatafilter[i].G_NAME_KD +
            ": Plan QTY =0 hoặc Process number trắng hoặc khác giá trị 1 or 2, hoặc chỉ thị nhiều hơn ycsx qty, hoặc PLAN_EQ rỗng, hoặc không hợp lệ, hoặc Step không nằm trong khoảng từ 0 đến 9 sẽ ko được lưu";
        }
      }
      if (err_code !== "0") {
        Swal.fire("Thông báo", "Có lỗi !" + err_code, "error");
      } else {
        Swal.fire("Thông báo", "Lưu PLAN thành công", "success");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để lưu", "error");
    }
  };
  const handleSaveQLSX = async () => {
    if (selectedG_Code !== undefined) {
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
          Swal.fire(
            "Thông báo",
            "Lưu thất bại, hãy nhập đủ thông tin",
            "error",
          );
        } else {
          await generalQuery("insertDBYCSX", {
            PROD_REQUEST_NO: selectedPlan.PROD_REQUEST_NO,
            G_CODE: selectedPlan.G_CODE,
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                
               
              } else {
                generalQuery("updateDBYCSX", {
                  PROD_REQUEST_NO: selectedPlan.PROD_REQUEST_NO,
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
            G_CODE: selectedG_Code,
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
  function CustomToolbarPLANTABLE() {
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
            SaveExcel(plandatatable, "Plan Table");
          }}
        >
          <AiFillFileExcel color="green" size={15} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
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
      </GridToolbarContainer>
    );
  }
  const handleYCSXSelectionforUpdate = (ids: GridSelectionModel) => {
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
  const handleQLSXPlanDataSelectionforUpdate = (ids: GridSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = plandatatable.filter((element: any) =>
      selectedID.has(element.PLAN_ID),
    );
    //console.log(datafilter);
    if (datafilter.length > 0) {
      setQlsxPlanDataFilter(datafilter);
    } else {
      setQlsxPlanDataFilter([]);
      //console.log("xoa filter");
    }
  };
  const get1YCSXDATA = async (PROD_REQUEST_NO: string) => {
    let temp_data: YCSXTableData[] = [];
    await generalQuery("traYCSXDataFull_QLSX", {
      alltime: true,
      start_date: fromdate,
      end_date: todate,
      cust_name: "",
      codeCMS: "",
      codeKD: "",
      prod_type: "",
      empl_name: "",
      phanloai: phanloai,
      ycsx_pending: false,
      inspect_inputcheck: false,
      prod_request_no: PROD_REQUEST_NO,
      material: "",
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          console.log(response.data.data);
          const loadeddata: YCSXTableData[] = response.data.data.map(
            (element: YCSXTableData, index: number) => {
              return {
                ...element,
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
  const handleEvent: GridEventListener<"rowClick"> = (
    params, // GridRowParams
    event, // MuiEvent<React.MouseEvent<HTMLElement>>
    details, // GridCallbackDetails
  ) => {
    let rowData: QLSXPLANDATA = params.row; 
    setSelectedPlan(rowData);
    setSelectedCode("CODE: " + rowData.G_NAME_KD);
    setSelectedG_Code(rowData.G_CODE);
    setDataDinhMuc({
      ...datadinhmuc,
      FACTORY: rowData.FACTORY === null ? "NM1" : rowData.FACTORY,
      EQ1: rowData.EQ1 === "" ? "NA" : rowData.EQ1,
      EQ2: rowData.EQ2 === "" ? "NA" : rowData.EQ2,
      EQ3: rowData.EQ3 === "" ? "NA" : rowData.EQ3,
      EQ4: rowData.EQ4 === "" ? "NA" : rowData.EQ4,
      Setting1: rowData.Setting1 === null ? 0 : rowData.Setting1,
      Setting2: rowData.Setting2 === null ? 0 : rowData.Setting2,
      Setting3: rowData.Setting3 === null ? 0 : rowData.Setting3,
      Setting4: rowData.Setting4 === null ? 0 : rowData.Setting4,
      UPH1: rowData.UPH1 === null ? 0 : rowData.UPH1,
      UPH2: rowData.UPH2 === null ? 0 : rowData.UPH2,
      UPH3: rowData.UPH3 === null ? 0 : rowData.UPH3,
      UPH4: rowData.UPH4 === null ? 0 : rowData.UPH4,
      Step1: rowData.Step1 === null ? 0 : rowData.Step1,
      Step2: rowData.Step2 === null ? 0 : rowData.Step2,
      Step3: rowData.Step3 === null ? 0 : rowData.Step3,
      Step4: rowData.Step4 === null ? 0 : rowData.Step4,
      LOSS_SX1: rowData.LOSS_SX1 === null ? 0 : rowData.LOSS_SX1,
      LOSS_SX2: rowData.LOSS_SX2 === null ? 0 : rowData.LOSS_SX2,
      LOSS_SX3: rowData.LOSS_SX3 === null ? 0 : rowData.LOSS_SX3,
      LOSS_SX4: rowData.LOSS_SX4 === null ? 0 : rowData.LOSS_SX4,
      LOSS_SETTING1: rowData.LOSS_SETTING1 === null ? 0 : rowData.LOSS_SETTING1,
      LOSS_SETTING2: rowData.LOSS_SETTING2 === null ? 0 : rowData.LOSS_SETTING2,
      LOSS_SETTING3: rowData.LOSS_SETTING3 === null ? 0 : rowData.LOSS_SETTING3,
      LOSS_SETTING4: rowData.LOSS_SETTING4 === null ? 0 : rowData.LOSS_SETTING4,
      NOTE: rowData.NOTE === null ? "" : rowData.NOTE,
    });

    if(rowData.G_CODE !=="")
    getRecentDM(rowData.G_CODE);
    //console.log(params.row);
  };
  const cellEditHandler = (
    params: GridCellEditCommitParams,
    event: MuiEvent<MuiBaseEvent>,
    details: GridCallbackDetails,
  ) => {
    (async () => {
      const keyvar = params.field;
      /* let temp_ycsx_data: YCSXTableData[] = ycsxdatatable.filter((element:YCSXTableData) => {
            return element.PROD_REQUEST_NO === params.value;
          }); */
      let temp_ycsx_data: YCSXTableData[] = [];
      if (keyvar === "PROD_REQUEST_NO") {
        temp_ycsx_data = await get1YCSXDATA(params.value);
        const newdata = plandatatable.map((p) => {
          if (p.PLAN_ID === params.id) {
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
                  CD1: temp_ycsx_data[0].CD1,
                  CD2: temp_ycsx_data[0].CD2,
                  CD3: temp_ycsx_data[0].CD3,
                  CD4: temp_ycsx_data[0].CD4,
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
        setPlanDataTable(newdata);
      } else if (keyvar === "PLAN_EQ") {
        let current_PROD_REQUEST_NO: string | undefined = plandatatable.find(
          (element) => element.PLAN_ID === params.id,
        )?.PROD_REQUEST_NO;
        if (current_PROD_REQUEST_NO !== undefined) {
          temp_ycsx_data = await get1YCSXDATA(current_PROD_REQUEST_NO);
        }
        const newdata = plandatatable.map((p) => {
          if (p.PLAN_ID === params.id) {
            if (keyvar === "PLAN_EQ") {
              if (params.value.length === 4) {
                let plan_temp = params.value.substring(0, 2);
                let UPH1: number = p.UPH1 === null ? 999999999 : p.UPH1;
                let UPH2: number = p.UPH2 === null ? 999999999 : p.UPH2;
                let UPH3: number = p.UPH3 === null ? 999999999 : p.UPH3;
                let UPH4: number = p.UPH4 === null ? 999999999 : p.UPH4;

                if (plan_temp === p.EQ1) {
                  return {
                    ...p,
                    [keyvar]: params.value,
                    PROCESS_NUMBER: 1,
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
      } else {
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
    })();
  };
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
    <div className="quickplan">
      <div className="planwindow">
        <span style={{ fontSize: 25, color: "blue", marginLeft: 20 }}>
          {selectedCode}
        </span>

        <div className="dinhmucdiv">
          {(showhideycsxtable === 1 || showhideycsxtable === 3) && (
            <div className="datadinhmucto">
              <div className="datadinhmuc">
                <div className="forminputcolumn">
                  <label>
                    <b>EQ1:</b>
                    <select
                      name="phanloai"
                      value={datadinhmuc.EQ1}
                      onChange={(e) =>
                        setDataDinhMuc({ ...datadinhmuc, EQ1: e.target.value })
                      }
                      style={{ width: 150, height: 22 }}
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
                    <b>EQ2:</b>
                    <select
                      name="phanloai"
                      value={datadinhmuc.EQ2}
                      onChange={(e) =>
                        setDataDinhMuc({ ...datadinhmuc, EQ2: e.target.value })
                      }
                      style={{ width: 150, height: 22 }}
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
                </div>
                <div className="forminputcolumn">
                  <label>
                    <b>Setting1(min):</b>{" "}
                    <input
                      type="text"
                      placeholder="Thời gian setting 1"
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
                      type="text"
                      placeholder="Thời gian setting 2"
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
                <div className="forminputcolumn">
                  <label>
                    <b>UPH1(EA/h):</b>{" "}
                    <input
                      type="text"
                      placeholder="Tốc độ sx 1"
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
                      type="text"
                      placeholder="Tốc độ sx 2"
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
                <div className="forminputcolumn">
                  <label>
                    <b>Step1:</b>{" "}
                    <input
                      type="text"
                      placeholder="Số bước 1"
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
                      type="text"
                      placeholder="Số bước 2"
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
                <div className="forminputcolumn">
                  <label>
                    <b>LOSS_SX1(%): <span style={{color: 'red', fontSize: '0.7rem'}}>({recentDMData.filter((e)=> e.PROCESS_NUMBER === 1)[0]?.LOSS_SX.toLocaleString('en-US',{minimumFractionDigits:0, maximumFractionDigits:0}) ?? ""}%)</span></b>{" "}
                    <input
                      type="text"
                      placeholder="% loss sx 1"
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
                    <b>LOSS_SX2(%):<span style={{color: 'red', fontSize: '0.7rem'}}>({recentDMData.filter((e)=> e.PROCESS_NUMBER === 2)[0]?.LOSS_SX.toLocaleString('en-US',{minimumFractionDigits:0, maximumFractionDigits:0}) ?? ""}%)</span></b>{" "}
                    <input
                      type="text"
                      placeholder="% loss sx 2"
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
                <div className="forminputcolumn">
                  <label>
                    <b>LOSS SETTING1 (m):<span style={{color: 'red', fontSize: '0.7rem'}}>({recentDMData.filter((e)=> e.PROCESS_NUMBER === 1)[0]?.TT_SETTING_MET.toLocaleString('en-US',{minimumFractionDigits:0, maximumFractionDigits:0}) ?? ""}m)</span></b>{" "}
                    <input
                      type="text"
                      placeholder="met setting 1"
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
                    <b>LOSS SETTING2 (m):<span style={{color: 'red', fontSize: '0.7rem'}}>({recentDMData.filter((e)=> e.PROCESS_NUMBER === 2)[0]?.TT_SETTING_MET.toLocaleString('en-US',{minimumFractionDigits:0, maximumFractionDigits:0}) ?? ""}m)</span></b>{" "}
                    <input
                      type="text"
                      placeholder="met setting 2"
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
                <div className="forminputcolumn">
                  <label>
                    <b>FACTORY:</b>
                    <select
                      name="phanloai"
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
                      <option value="NA">NA</option>
                      <option value="NM1">NM1</option>
                      <option value="NM2">NM2</option>
                    </select>
                  </label>
                  <label>
                    <b>NOTE (QLSX):</b>{" "}
                    <input
                      type="text"
                      placeholder="Chú ý"
                      value={datadinhmuc.NOTE}
                      onChange={(e) =>
                        setDataDinhMuc({ ...datadinhmuc, NOTE: e.target.value })
                      }
                    ></input>
                  </label>
                </div>
              </div>
              <div className="datadinhmuc">
                <div className="forminputcolumn">
                  <label>
                    <b>EQ3:</b>
                    <select
                      name="phanloai"
                      value={datadinhmuc.EQ3}
                      onChange={(e) =>
                        setDataDinhMuc({ ...datadinhmuc, EQ3: e.target.value })
                      }
                      style={{ width: 150, height: 22 }}
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
                    <b>EQ4:</b>
                    <select
                      name="phanloai"
                      value={datadinhmuc.EQ4}
                      onChange={(e) =>
                        setDataDinhMuc({ ...datadinhmuc, EQ4: e.target.value })
                      }
                      style={{ width: 150, height: 22 }}
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
                </div>
                <div className="forminputcolumn">
                  <label>
                    <b>Setting3(min):</b>{" "}
                    <input
                      type="text"
                      placeholder="Thời gian setting 3"
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
                      type="text"
                      placeholder="Thời gian setting 4"
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
                <div className="forminputcolumn">
                  <label>
                    <b>UPH3(EA/h):</b>{" "}
                    <input
                      type="text"
                      placeholder="Tốc độ sx 1"
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
                      type="text"
                      placeholder="Tốc độ sx 2"
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
                <div className="forminputcolumn">
                  <label>
                    <b>Step3:</b>{" "}
                    <input
                      type="text"
                      placeholder="Số bước 3"
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
                      type="text"
                      placeholder="Số bước 4"
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
                <div className="forminputcolumn">
                  <label>
                    <b>LOSS_SX3(%):<span style={{color: 'red', fontSize: '0.7rem'}}>({recentDMData.filter((e)=> e.PROCESS_NUMBER === 3)[0]?.LOSS_SX.toLocaleString('en-US',{minimumFractionDigits:0, maximumFractionDigits:0}) ?? ""}%)</span></b>{" "}
                    <input
                      type="text"
                      placeholder="% loss sx 3"
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
                    <b>LOSS_SX4(%):<span style={{color: 'red', fontSize: '0.7rem'}}>({recentDMData.filter((e)=> e.PROCESS_NUMBER === 4)[0]?.LOSS_SX.toLocaleString('en-US',{minimumFractionDigits:0, maximumFractionDigits:0}) ?? ""}%)</span></b>{" "}
                    <input
                      type="text"
                      placeholder="% loss sx 4"
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
                <div className="forminputcolumn">
                  <label>
                    <b>LOSS SETTING3 (m):<span style={{color: 'red', fontSize: '0.7rem'}}>({recentDMData.filter((e)=> e.PROCESS_NUMBER === 3)[0]?.TT_SETTING_MET.toLocaleString('en-US',{minimumFractionDigits:0, maximumFractionDigits:0}) ?? ""}m)</span></b>{" "}
                    <input
                      type="text"
                      placeholder="met setting 3"
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
                    <b>LOSS SETTING4 (m):<span style={{color: 'red', fontSize: '0.7rem'}}>({recentDMData.filter((e)=> e.PROCESS_NUMBER === 4)[0]?.TT_SETTING_MET.toLocaleString('en-US',{minimumFractionDigits:0, maximumFractionDigits:0}) ?? ""}m)</span></b>{" "}
                    <input
                      type="text"
                      placeholder="met setting 4"
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
                <div className="forminputcolumn">
                  <label>
                    <b>FACTORY:</b>
                    <select
                      name="phanloai"
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
                      <option value="NA">NA</option>
                      <option value="NM1">NM1</option>
                      <option value="NM2">NM2</option>
                    </select>
                  </label>
                  <label>
                    <b>NOTE (QLSX):</b>{" "}
                    <input
                      type="text"
                      placeholder="Chú ý"
                      value={datadinhmuc.NOTE}
                      onChange={(e) =>
                        setDataDinhMuc({ ...datadinhmuc, NOTE: e.target.value })
                      }
                    ></input>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
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
                    components={{
                      Toolbar: CustomToolbarPOTable,
                      LoadingOverlay: LinearProgress,
                    }}
                    loading={isLoading}
                    rowHeight={30}
                    rows={ycsxdatatable}
                    columns={column_ycsxtable}
                    rowsPerPageOptions={[
                      5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
                    ]}
                    editMode="row"
                    getRowId={(row) => row.PROD_REQUEST_NO}
                    onSelectionModelChange={(ids) => {
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
                          setChiThiListRender(renderChiThi(qlsxplandatafilter));
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
                          setYCKTListRender(renderYCKT(qlsxplandatafilter));
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
                <DataGrid
                  sx={{ fontSize: 12, flex: 1 }}
                  components={{
                    Toolbar: CustomToolbarPLANTABLE,
                    LoadingOverlay: LinearProgress,
                  }}
                  loading={isLoading}
                  rowHeight={30}
                  rows={plandatatable}
                  columns={column_plandatatable}
                  rowsPerPageOptions={[
                    5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
                  ]}
                  disableSelectionOnClick
                  checkboxSelection
                  editMode="cell"
                  getRowId={(row) => row.PLAN_ID}
                  onSelectionModelChange={(ids) => {
                    handleQLSXPlanDataSelectionforUpdate(ids);
                  }}
                  onCellEditCommit={cellEditHandler}
                  onRowClick={handleEvent}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default QUICKPLAN;
