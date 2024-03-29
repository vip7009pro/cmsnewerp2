/* eslint-disable no-loop-func */
import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import MACHINE_COMPONENT from "./MACHINE_COMPONENT";
import "./MACHINE.scss";
import Swal from "sweetalert2";
import { generalQuery, uploadQuery } from "../../../../api/Api";
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
  AiOutlineArrowRight,
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
import { BiRefresh, BiReset } from "react-icons/bi";
import YCKT from "../YCKT/YCKT";
// @ts-ignore
import { setInterval } from "timers/promises";
import { GiCurvyKnife } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
  addChithiArray,
  resetChithiArray,
} from "../../../../redux/slices/globalSlice";
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
import { trigger } from "devextreme/events";
import CHECKSHEETSX from "../CHITHI/CHECKSHEETSX";
export const checkEQvsPROCESS = (
  EQ1: string,
  EQ2: string,
  EQ3: string,
  EQ4: string
) => {
  console.log(EQ1);
  console.log(EQ2);
  console.log(EQ3);
  console.log(EQ4);
  let maxprocess: number = 0;
  if (["NA", "NO", "", null].indexOf(EQ1) === -1) maxprocess++;
  if (["NA", "NO", "", null].indexOf(EQ2) === -1) maxprocess++;
  if (["NA", "NO", "", null].indexOf(EQ3) === -1) maxprocess++;
  if (["NA", "NO", "", null].indexOf(EQ4) === -1) maxprocess++;
  return maxprocess;
};
export const renderChiThi = (planlist: QLSXPLANDATA[]) => {
  return planlist.map((element, index) => (
    <CHITHI_COMPONENT key={index} DATA={element} />
    /*  <>
     <CHITHI_COMPONENT key={index} DATA={element} />
     <CHECKSHEETSX key={index+'A'} DATA={element}/>
     </> */
  ));
};
export const renderChiThi2 = (planlist: QLSXPLANDATA[]) => {
  //console.log(planlist);
  return <CHITHI_COMPONENT2 PLAN_LIST={planlist} />;
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
const MACHINE = () => {
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
  const [isPending, startTransition] = useTransition();
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
  const [selectionModel, setSelectionModel] = useState<any>([]);
  const [selectionModel_XUATKHOAO, setSelectionModel_XUATKHOAO] = useState<any>(
    []
  );
  const [selectionModel_INPUTSX, setSelectionModel_INPUTSX] = useState<any>([]);
  const [lichsunhapkhoaotable, setLichSuNhapKhoAoTable] = useState<
    LICHSUNHAPKHOAO[]
  >([]);
  const [lichsunhapkhoaodatafilter, setLichSuNhapKhoAoDataFilter] = useState<
    Array<LICHSUNHAPKHOAO>
  >([]);
  /*  const [calc_loss_setting, setCalc_Loss_Setting] = useState(true); */
  const [lichsuxuatkhoaotable, setLichSuXuatKhoAoTable] = useState<
    LICHSUXUATKHOAO[]
  >([]);
  const [lichsuxuatkhoaodatafilter, setLichSuXuatKhoAoDataFilter] = useState<
    Array<LICHSUXUATKHOAO>
  >([]);
  const [lichsuinputlieutable, setLichSuInputLieuTable] = useState<
    LICHSUINPUTLIEUSX[]
  >([]);
  const [lichsuinputlieudatafilter, setLichSuInputLieuDataFilter] = useState<
    Array<LICHSUINPUTLIEUSX>
  >([]);
  const [plandatatable, setPlanDataTable] = useState<QLSXPLANDATA[]>([]);
  const [chithidatatable, setChiThiDataTable] = useState<QLSXCHITHIDATA[]>([]);
  const [showplanwindow, setShowPlanWindow] = useState(false);
  const [showkhoao, setShowKhoAo] = useState(false);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
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
  const [qlsxchithidatafilter, setQlsxChiThiDataFilter] = useState<
    Array<QLSXCHITHIDATA>
  >([]);
  const [tonlieuxuongdatatable, setTonLieuXuongDataTable] = useState<
    Array<TONLIEUXUONG>
  >([]);
  const [tonlieuxuongdatafilter, setTonLieuXuongDataFilter] = useState<
    Array<TONLIEUXUONG>
  >([]);
  const [showYCSX, setShowYCSX] = useState(true);
  const [ycsxpendingcheck, setYCSXPendingCheck] = useState(false);
  const [inspectInputcheck, setInspectInputCheck] = useState(false);
  const [ycsxlistrender, setYCSXListRender] = useState<Array<ReactElement>>();
  const [chithilistrender, setChiThiListRender] =
    useState<Array<ReactElement>>();
  const [chithilistrender2, setChiThiListRender2] = useState<ReactElement>();
  const [ycktlistrender, setYCKTListRender] = useState<Array<ReactElement>>();
  const [selectedMachine, setSelectedMachine] = useState("FR1");
  const [selectedFactory, setSelectedFactory] = useState("NM1");
  const [selectedPlanDate, setSelectedPlanDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [selectedPlan, setSelectedPlan] = useState<QLSXPLANDATA>();
  const [showChiThi, setShowChiThi] = useState(false);
  const [showChiThi2, setShowChiThi2] = useState(false);
  const [showYCKT, setShowYCKT] = useState(false);
  const [editplan, seteditplan] = useState(true);
  const [editchithi, seteditchithi] = useState(true);
  const [currentTotalLeadTime, setCurrentTotalLeadTime] = useState(0);
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
      console.log("temp max lieu: ", temp_maxLieu);
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
  const column_ycsxtable = [
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
      width: 80,
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
      width: 80,
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
      width: 80,
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
      width: 80,
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
      width: 80,
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
      width: 80,
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
      width: 80,
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
      width: 80,
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
      width: 80,
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
      width: 80,
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
      headerName: "TỒN KIỂM",
      width: 80,
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
      width: 80,
      renderCell: (params: any) => {
        return <span style={{ color: "black" }}>{params.row.EQ1}</span>;
      },
    },
    {
      field: "EQ2",
      headerName: "EQ2",
      width: 80,
      renderCell: (params: any) => {
        return <span style={{ color: "black" }}>{params.row.EQ2}</span>;
      },
    },
    {
      field: "EQ3",
      headerName: "EQ3",
      width: 80,
      renderCell: (params: any) => {
        return <span style={{ color: "black" }}>{params.row.EQ3}</span>;
      },
    },
    {
      field: "EQ4",
      headerName: "EQ4",
      width: 80,
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
          checkBP(userData, ['KD', 'RND'], ['ALL'], ['ALL'], async () => {
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
                          "success"
                        );
                        let tempcodeinfodatatable = ycsxdatatable.map(
                          (element: YCSXTableData, index) => {
                            return element.G_CODE === params.row.G_CODE
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
        let hreftlink = "/banve/" + params.row.G_CODE + ".pdf";
        if (params.row.BANVE !== "N" && params.row.BANVE !== null) {
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
  ];
  const column_plandatatable = [
    {
      field: "PLAN_ID",
      headerName: "PLAN_ID",
      width: 90,
      editable: false,
      resizeable: true,
      renderCell: (params: any) => {
        if (params.row.DKXL === null) {
          return <span style={{ color: "red" }}>{params.row.PLAN_ID}</span>;
        } else {
          return <span style={{ color: "green" }}>{params.row.PLAN_ID}</span>;
        }
      },
    },
    { field: "G_CODE", headerName: "G_CODE", width: 100, editable: false },
    { field: "G_NAME", headerName: "G_NAME", width: 150, editable: false },
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
      headerName: "YCSX QTY",
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
      width: 60,
      editable: false,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.TON_CD1?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD2",
      headerName: "TCD2",
      width: 60,
      editable: false,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.TON_CD2?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD3",
      headerName: "TCD3",
      width: 60,
      editable: false,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.TON_CD3?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD4",
      headerName: "TCD4",
      width: 60,
      editable: false,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.TON_CD4?.toLocaleString("en", "US")}
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
      headerName: "PROCESS_NUMBER",
      width: 110,
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
    { field: "STEP", headerName: "STEP", width: 60, editable: editplan },
    {
      field: "PLAN_ORDER",
      headerName: "PLAN_ORDER",
      width: 110,
      editable: editplan,
    },
    {
      field: "KETQUASX",
      headerName: "KETQUASX",
      width: 110,
      editable: editplan,
      renderCell: (params: any) => {
        if (params.row.KETQUASX !== null) {
          return <span>{params.row.KETQUASX.toLocaleString("en-US")}</span>;
        } else {
          return <span>0</span>;
        }
      },
    },
    {
      field: "KQ_SX_TAM",
      headerName: "KETQUASX_TAM",
      width: 120,
      editable: editplan,
      renderCell: (params: any) => {
        if (params.row.KQ_SX_TAM !== null) {
          return <span>{params.row.KQ_SX_TAM.toLocaleString("en-US")}</span>;
        } else {
          return <span>0</span>;
        }
      },
    },
    { field: "PLAN_EQ", headerName: "PLAN_EQ", width: 80, editable: editplan },
    {
      field: "PLAN_FACTORY",
      headerName: "FACTORY",
      width: 80,
      editable: false,
    },
    {
      field: "PLAN_DATE",
      headerName: "PLAN_DATE",
      width: 110,
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
      headerName: "NEXT_PLAN_ID",
      width: 120,
      editable: true,
    },
    {
      field: "AT_LEADTIME",
      headerName: "LEADTIME",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span>{params.row?.AT_LEADTIME.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
        )
      },
      editable: false,
    },
    {
      field: "ACC_TIME",
      headerName: "ACC_TIME",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span>{params.row?.ACC_TIME.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
        )
      },
      editable: false,
    },
    {
      field: "IS_SETTING",
      headerName: "IS_SETTING",
      width: 80,
      renderCell: (params: any) => {
        return (
          <input
            type='checkbox'
            name='alltimecheckbox'
            defaultChecked={params.row.IS_SETTING === 'Y'}
            onChange={(value) => {
              //console.log(value);
              const newdata = plandatatable.map((p) =>
                p.PLAN_ID === params.row.PLAN_ID
                  ? { ...p, IS_SETTING: params.row.IS_SETTING === 'Y' ? 'N' : 'Y' }
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
  const column_chithidatatable = [
    { field: "CHITHI_ID", headerName: "CHITHI_ID", width: 90, editable: false },
    { field: "PLAN_ID", headerName: "PLAN_ID", width: 90, editable: false },
    { field: "M_CODE", headerName: "M_CODE", width: 80, editable: false },
    {
      field: "M_NAME",
      headerName: "M_NAME",
      width: 120,
      editable: false,
      renderCell: (params: any) => {
        if (params.row.LIEUQL_SX === 1) {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.row.M_NAME}
            </span>
          );
        } else {
          return <span style={{ color: "black" }}>{params.row.M_NAME}</span>;
        }
      },
    },
    { field: "WIDTH_CD", headerName: "SIZE", width: 80, editable: false },
    {
      field: "M_MET_QTY",
      headerName: "M_MET_QTY",
      width: 110,
      editable: editchithi,
      renderCell: (params: any) => {
        if (params.row.M_MET_QTY === 0) {
          return <span style={{ color: "red" }}>NG</span>;
        } else {
          return <span style={{ color: "green" }}>{params.row.M_MET_QTY}</span>;
        }
      },
    },
    { field: "M_QTY", headerName: "M_QTY", width: 110, editable: editchithi },
    {
      field: "LIEUQL_SX",
      headerName: "LIEUQL_SX",
      width: 110,
      editable: editchithi,
    },
    {
      field: "M_STOCK",
      headerName: "M_STOCK",
      width: 110,
      editable: editchithi,
      renderCell: (params: any) => {
        return (
          <p style={{ color: "gray", fontWeight: "bold" }}>
            {params.row.M_STOCK !== null
              ? params.row.M_STOCK.toLocaleString("en", "US")
              : 0}
          </p>
        );
      },
    },
    {
      field: "OUT_KHO_SX",
      headerName: "OUT_KHO_SX",
      width: 110,
      editable: editchithi,
      renderCell: (params: any) => {
        return (
          <p style={{ color: "blue", fontWeight: "bold" }}>
            {params.row.OUT_KHO_SX !== null
              ? params.row.OUT_KHO_SX.toLocaleString("en", "US")
              : 0}
          </p>
        );
      },
    },
    {
      field: "OUT_CFM_QTY",
      headerName: "OUT_KHO_THAT",
      width: 110,
      editable: editchithi,
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
      editable: editchithi,
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
  const column_tonlieuxuongtable = [
    { field: "FACTORY", headerName: "NM", width: 40, editable: false },
    {
      field: "PLAN_ID_INPUT",
      headerName: "PLAN_ID",
      width: 80,
      editable: false,
    },
    { field: "PHANLOAI", headerName: "PL", width: 40, editable: false },
    { field: "M_CODE", headerName: "M_CODE", width: 80, editable: false },
    {
      field: "M_NAME",
      headerName: "M_NAME",
      width: 120,
      editable: false,
      renderCell: (params: any) => {
        if (params.row.LIEUQL_SX === 1) {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.row.M_NAME}
            </span>
          );
        } else {
          return <span style={{ color: "black" }}>{params.row.M_NAME}</span>;
        }
      },
    },
    { field: "WIDTH_CD", headerName: "SIZE", width: 30, editable: false },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 90, editable: false },
    {
      field: "ROLL_QTY",
      headerName: "ROLL_QTY",
      width: 70,
      editable: false,
      renderCell: (params: any) => {
        if (params.row.PHANLOAI !== "F") {
          return (
            <span style={{ color: "green" }}>
              {params.row.ROLL_QTY.toLocaleString("en", "US")}
            </span>
          );
        } else {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.row.ROLL_QTY.toLocaleString("en", "US")}
            </span>
          );
        }
      },
    },
    {
      field: "IN_QTY",
      headerName: "IN_QTY",
      width: 70,
      editable: false,
      renderCell: (params: any) => {
        if (params.row.PHANLOAI !== "F") {
          return (
            <span style={{ color: "green" }}>
              {params.row.IN_QTY.toLocaleString("en", "US")}
            </span>
          );
        } else {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.row.IN_QTY.toLocaleString("en", "US")}
            </span>
          );
        }
      },
    },
    {
      field: "TOTAL_IN_QTY",
      headerName: "TOTAL_IN_QTY",
      width: 70,
      editable: false,
      renderCell: (params: any) => {
        if (params.row.PHANLOAI !== "F") {
          return (
            <span style={{ color: "green" }}>
              {params.row.TOTAL_IN_QTY.toLocaleString("en", "US")}
            </span>
          );
        } else {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.row.TOTAL_IN_QTY.toLocaleString("en", "US")}
            </span>
          );
        }
      },
    },
  ];
  const column_lichsunhapkhoaotable = [
    { field: "FACTORY", headerName: "NM", width: 40 },
    { field: "PHANLOAI", headerName: "PL", width: 30 },
    { field: "M_CODE", headerName: "M_CODE", width: 80 },
    { field: "M_NAME", headerName: "M_NAME", width: 120 },
    { field: "WIDTH_CD", headerName: "SIZE", width: 30 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 90 },
    { field: "PLAN_ID_INPUT", headerName: "PLAN_ID", width: 80 },
    { field: "ROLL_QTY", headerName: "ROLLQTY", width: 70 },
    { field: "IN_QTY", headerName: "IN_QTY", width: 80 },
    { field: "TOTAL_IN_QTY", headerName: "TOTAL", width: 80 },
    { field: "INS_DATE", headerName: "INS_DATE", width: 150 },
  ];
  const column_lichsuxuatkhoaotable = [
    { field: "FACTORY", headerName: "NM", width: 40 },
    { field: "PHANLOAI", headerName: "PL", width: 30 },
    { field: "M_CODE", headerName: "M_CODE", width: 80 },
    { field: "M_NAME", headerName: "M_NAME", width: 120 },
    { field: "WIDTH_CD", headerName: "SIZE", width: 30 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 90 },
    { field: "PLAN_ID_INPUT", headerName: "PLAN_ID_IN", width: 90 },
    { field: "PLAN_ID_OUTPUT", headerName: "PLAN_ID_OUT", width: 90 },
    { field: "ROLL_QTY", headerName: "ROLL_QTY", width: 80 },
    { field: "OUT_QTY", headerName: "OUT_QTY", width: 80 },
    { field: "TOTAL_OUT_QTY", headerName: "TOTAL", width: 80 },
    { field: "INS_DATE", headerName: "INS_DATE", width: 150 },
  ];
  const column_lichsuinputlieusanxuat = [
    { field: "PLAN_ID", headerName: "PLAN_ID", width: 80 },
    { field: "M_CODE", headerName: "M_CODE", width: 80 },
    { field: "M_NAME", headerName: "M_NAME", width: 120 },
    { field: "WIDTH_CD", headerName: "SIZE", width: 40 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 90 },
    { field: "INPUT_QTY", headerName: "INPUT_QTY", width: 120 },
    { field: "USED_QTY", headerName: "USED_QTY", width: 80 },
    {
      field: "REMAIN_QTY",
      headerName: "REMAIN_QTY",
      width: 90,
      editable: true,
    },
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 80 },
    { field: "EQUIPMENT_CD", headerName: "MAY", width: 40 },
    { field: "INS_DATE", headerName: "INS_DATE", width: 150 },
  ];
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
  const handle_saveConfirmLieuTon = () => {
    if (lichsuinputlieudatafilter.length > 0) {
      let err_code: string = "0";
      for (let i = 0; i < lichsuinputlieudatafilter.length; i++) {
        if (
          lichsuinputlieudatafilter[i].INPUT_QTY >=
          lichsuinputlieudatafilter[i].REMAIN_QTY
        ) {
          generalQuery("confirmlieutonsx", {
            PLAN_ID: lichsuinputlieudatafilter[i].PLAN_ID,
            M_CODE: lichsuinputlieudatafilter[i].M_CODE,
            M_LOT_NO: lichsuinputlieudatafilter[i].M_LOT_NO,
            EQUIPMENT_CD: lichsuinputlieudatafilter[i].EQUIPMENT_CD,
            REMAIN_QTY: lichsuinputlieudatafilter[i].REMAIN_QTY,
          })
            .then((response) => {
              console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          err_code +=
            "| " +
            "Liệu: " +
            lichsuinputlieudatafilter[i].M_NAME +
            ": Confirm Tồn nhiều hơn xuất\n";
        }
      }
      if (err_code !== "0") {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      } else {
        Swal.fire("Thông báo", "Confirm tồn thành công", "success");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 liệu để lưu", "error");
    }
  };
  const handle_nhaplaivaokhoao = () => {
    if (lichsuinputlieudatafilter.length > 0) {
      let err_code: string = "0";
      for (let i = 0; i < lichsuinputlieudatafilter.length; i++) {
        if (
          lichsuinputlieudatafilter[i].INPUT_QTY >=
          lichsuinputlieudatafilter[i].REMAIN_QTY
        ) {
          generalQuery("confirmlieutonsx", {
            PLAN_ID: lichsuinputlieudatafilter[i].PLAN_ID,
            M_CODE: lichsuinputlieudatafilter[i].M_CODE,
            M_LOT_NO: lichsuinputlieudatafilter[i].M_LOT_NO,
            EQUIPMENT_CD: lichsuinputlieudatafilter[i].EQUIPMENT_CD,
            REMAIN_QTY: lichsuinputlieudatafilter[i].REMAIN_QTY,
          })
            .then((response) => {
              console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          err_code +=
            "| " +
            "Liệu: " +
            lichsuinputlieudatafilter[i].M_NAME +
            ": Confirm Tồn nhiều hơn xuất\n";
        }
      }
      if (err_code !== "0") {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      } else {
        Swal.fire("Thông báo", "Confirm tồn thành công", "success");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 liệu để lưu", "error");
    }
  };
  const handle_loadlichsuinputlieu = (PLAN_ID: string) => {
    generalQuery("lichsuinputlieusanxuat", {
      PLAN_ID: PLAN_ID,
    })
      .then((response) => {
        console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: LICHSUINPUTLIEUSX[] = response.data.data.map(
            (element: LICHSUINPUTLIEUSX, index: number) => {
              return {
                ...element,
                INS_DATE: moment(element.INS_DATE)
                  .utc()
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            }
          );
          setLichSuInputLieuTable(loaded_data);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_huyxuatkhoao = async () => {
    if (lichsuxuatkhoaodatafilter.length > 0) {
      let err_code: string = "0";
      let current_plan_id: string =
        selectedPlan?.PLAN_ID === undefined ? "xxx" : selectedPlan?.PLAN_ID;
      for (let i = 0; i < lichsuxuatkhoaodatafilter.length; i++) {
        await generalQuery("deleteXuatKhoAo", {
          CURRENT_PLAN_ID: current_plan_id,
          PLAN_ID_INPUT: lichsuxuatkhoaodatafilter[i].PLAN_ID_INPUT,
          PLAN_ID_OUTPUT: lichsuxuatkhoaodatafilter[0].PLAN_ID_OUTPUT,
          M_CODE: lichsuxuatkhoaodatafilter[i].M_CODE,
          M_LOT_NO: lichsuxuatkhoaodatafilter[i].M_LOT_NO,
          INS_DATE: lichsuxuatkhoaodatafilter[i].INS_DATE,
          TOTAL_OUT_QTY: lichsuxuatkhoaodatafilter[i].TOTAL_OUT_QTY,
          PHANLOAI: lichsuxuatkhoaodatafilter[i].PHANLOAI,
        })
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              generalQuery("setUSE_YN_KHO_AO_INPUT", {
                FACTORY: lichsuxuatkhoaodatafilter[i].FACTORY,
                PHANLOAI: lichsuxuatkhoaodatafilter[i].PHANLOAI,
                PLAN_ID_INPUT: lichsuxuatkhoaodatafilter[i].PLAN_ID_INPUT,
                M_CODE: lichsuxuatkhoaodatafilter[i].M_CODE,
                M_LOT_NO: lichsuxuatkhoaodatafilter[i].M_LOT_NO,
                TOTAL_IN_QTY: lichsuxuatkhoaodatafilter[i].TOTAL_OUT_QTY,
                USE_YN: "Y",
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
            } else {
              err_code += "| " + response.data.message;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (err_code !== "0") {
        Swal.fire("Thông báo", "Có lỗi: " + err_code, "error");
      }
      handle_loadKhoAo();
      handle_loadlichsunhapkhoao();
      handle_loadlichsuxuatkhoao();
      handle_loadlichsuinputlieu(
        selectedPlan?.PLAN_ID === undefined ? "xxx" : selectedPlan?.PLAN_ID
      );
      setSelectionModel_XUATKHOAO([]);
    }
  };
  const handle_loadlichsunhapkhoao = () => {
    generalQuery("lichsunhapkhoao", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: LICHSUNHAPKHOAO[] = response.data.data.map(
            (element: LICHSUNHAPKHOAO, index: number) => {
              return {
                ...element,
                INS_DATE: moment(element.INS_DATE)
                  .utc()
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            }
          );
          setLichSuNhapKhoAoTable(loaded_data);
        } else {
          setLichSuNhapKhoAoTable([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_loadlichsuxuatkhoao = () => {
    generalQuery("lichsuxuatkhoao", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: LICHSUXUATKHOAO[] = response.data.data.map(
            (element: LICHSUXUATKHOAO, index: number) => {
              return {
                ...element,
                INS_DATE: moment(element.INS_DATE)
                  .utc()
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            }
          );
          setLichSuXuatKhoAoTable(loaded_data);
        } else {
          setLichSuXuatKhoAoTable([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_xuatKhoAo = async () => {
    if (selectedPlan !== undefined) {
      if (tonlieuxuongdatafilter.length > 0) {
        let err_code: string = "0";
        for (let i = 0; i < tonlieuxuongdatafilter.length; i++) {
          let checklieuchithi: boolean = true;
          await generalQuery("checkM_CODE_CHITHI", {
            PLAN_ID_OUTPUT: selectedPlan?.PLAN_ID,
            M_CODE: tonlieuxuongdatafilter[i].M_CODE,
          })
            .then((response) => {
              console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
                checklieuchithi = true;
              } else {
                checklieuchithi = false;
              }
            })
            .catch((error) => {
              console.log(error);
            });
          if (checklieuchithi === true) {
            await generalQuery("xuatkhoao", {
              FACTORY: tonlieuxuongdatafilter[i].FACTORY,
              PHANLOAI: "N",
              PLAN_ID_INPUT: tonlieuxuongdatafilter[i].PLAN_ID_INPUT,
              PLAN_ID_OUTPUT: selectedPlan?.PLAN_ID,
              M_CODE: tonlieuxuongdatafilter[i].M_CODE,
              M_LOT_NO: tonlieuxuongdatafilter[i].M_LOT_NO,
              ROLL_QTY: tonlieuxuongdatafilter[i].ROLL_QTY,
              OUT_QTY: tonlieuxuongdatafilter[i].IN_QTY,
              TOTAL_OUT_QTY: tonlieuxuongdatafilter[i].TOTAL_IN_QTY,
              USE_YN: "O",
            })
              .then((response) => {
                console.log(response.data.tk_status);
                if (response.data.tk_status !== "NG") {
                  console.log("set yes no");
                  generalQuery("setUSE_YN_KHO_AO_INPUT", {
                    FACTORY: tonlieuxuongdatafilter[i].FACTORY,
                    PHANLOAI: tonlieuxuongdatafilter[i].PHANLOAI,
                    PLAN_ID_INPUT: tonlieuxuongdatafilter[i].PLAN_ID_INPUT,
                    PLAN_ID_SUDUNG: selectedPlan?.PLAN_ID,
                    M_CODE: tonlieuxuongdatafilter[i].M_CODE,
                    M_LOT_NO: tonlieuxuongdatafilter[i].M_LOT_NO,
                    TOTAL_IN_QTY: tonlieuxuongdatafilter[i].TOTAL_IN_QTY,
                    USE_YN: "O",
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
                } else {
                  err_code += "| " + response.data.message;
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            err_code +=
              "| " +
              "Liệu: " +
              tonlieuxuongdatafilter[i].M_NAME +
              " chưa được đăng ký xuất liệu \n Đã xuất các liệu hợp lệ";
          }
        }
        if (err_code !== "0") {
          Swal.fire("Thông báo", "Có lỗi: " + err_code, "error");
        }
        setTonLieuXuongDataFilter([]);
        handle_loadKhoAo();
        handle_loadlichsuxuatkhoao();
        handle_loadlichsuinputlieu(
          selectedPlan?.PLAN_ID === undefined ? "xxx" : selectedPlan?.PLAN_ID
        );
        setSelectionModel([]);
      } else {
        Swal.fire("Thông báo", "Chọn ít nhất 1 liệu để xuất kho", "error");
      }
    }
  };
  const handle_loadKhoAo = () => {
    generalQuery("checktonlieutrongxuong", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: TONLIEUXUONG[] = response.data.data.map(
            (element: TONLIEUXUONG, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          setTonLieuXuongDataTable(loaded_data);
        } else {
          setTonLieuXuongDataTable([]);
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
          generalQuery("saveQLSX", {
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
        console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
        } else {
          Swal.fire('Thông báo', 'Update plan order thất bại', 'error');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const loadQLSXPlan = (plan_date: string) => {
    //console.log(selectedPlanDate);
    generalQuery("getqlsxplan", { PLAN_DATE: plan_date })
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
    PROCESS_NUMBER: number
  ) => {
    let PD: number = 0,
      CAVITY_NGANG: number = 0,
      CAVITY_DOC: number = 0,
      LOSS_SX1: number = 0,
      LOSS_SX2: number = 0,
      LOSS_SETTING1: number = 0,
      LOSS_SETTING2: number = 0,
      FINAL_LOSS_SX: number = 0,
      FINAL_LOSS_SETTING: number = 0,
      M_MET_NEEDED: number = 0;
    await generalQuery("getcodefullinfo", {
      G_CODE: G_CODE,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data)
          PD = response.data.data[0].PD;
          CAVITY_NGANG = response.data.data[0].G_C_R;
          CAVITY_DOC = response.data.data[0].G_C;
          let calc_loss_setting: boolean = selectedPlan?.IS_SETTING === 'Y' ? true : false;
          if (PROCESS_NUMBER === 1) {
            FINAL_LOSS_SX = response.data.data[0].LOSS_SX1 ?? 0;
          } else if (PROCESS_NUMBER === 2) {
            FINAL_LOSS_SX = response.data.data[0].LOSS_SX2 ?? 0;
          } else if (PROCESS_NUMBER === 3) {
            FINAL_LOSS_SX = response.data.data[0].LOSS_SX3 ?? 0;
          } else if (PROCESS_NUMBER === 4) {
            FINAL_LOSS_SX = response.data.data[0].LOSS_SX4 ?? 0;
          }
          if (PROCESS_NUMBER === 1) {
            FINAL_LOSS_SETTING = calc_loss_setting ? response.data.data[0].LOSS_SETTING1 ?? 0 : 0;
          } else if (PROCESS_NUMBER === 2) {
            FINAL_LOSS_SETTING = calc_loss_setting ? response.data.data[0].LOSS_SETTING2 ?? 0 : 0;
          } else if (PROCESS_NUMBER === 3) {
            FINAL_LOSS_SETTING = calc_loss_setting ? response.data.data[0].LOSS_SETTING3 ?? 0 : 0;
          } else if (PROCESS_NUMBER === 4) {
            FINAL_LOSS_SETTING = calc_loss_setting ? response.data.data[0].LOSS_SETTING4 ?? 0 : 0;
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
          setChiThiDataTable(response.data.data);
        } else {
          M_MET_NEEDED = parseInt(
            ((PLAN_QTY * PD) / (CAVITY_DOC * CAVITY_NGANG) / 1000).toString()
          );
          /*  console.log('M_MET_NEEDED', M_MET_NEEDED);
          console.log('FINAL_LOSS_SX', FINAL_LOSS_SX);
          console.log('FINAL_LOSS_SETTING', FINAL_LOSS_SETTING); */
          generalQuery("getbomsx", {
            G_CODE: G_CODE,
          })
            .then((response) => {
              //console.log(response.data.data);
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
  };
  const handleResetChiThiTable = async () => {
    if (selectedPlan !== undefined) {
      let PD: number = 0,
        CAVITY_NGANG: number = 0,
        CAVITY_DOC: number = 0,
        PLAN_QTY: number = selectedPlan?.PLAN_QTY ?? 0,
        PROCESS_NUMBER: number = selectedPlan?.PROCESS_NUMBER ?? 0,
        LOSS_SX1: number = 0,
        LOSS_SX2: number = 0,
        LOSS_SETTING1: number = 0,
        LOSS_SETTING2: number = 0,
        FINAL_LOSS_SX: number = 0,
        FINAL_LOSS_SETTING: number = 0,
        M_MET_NEEDED: number = 0;
      await generalQuery("getcodefullinfo", {
        G_CODE: selectedPlan?.G_CODE,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            //console.log(response.data.data)
            PD = response.data.data[0].PD;
            CAVITY_NGANG = response.data.data[0].G_C_R;
            CAVITY_DOC = response.data.data[0].G_C;
            let calc_loss_setting: boolean = selectedPlan?.IS_SETTING === 'Y' ? true : false;
            if (PROCESS_NUMBER === 1) {
              FINAL_LOSS_SX = response.data.data[0].LOSS_SX1 ?? 0;
            } else if (PROCESS_NUMBER === 2) {
              FINAL_LOSS_SX = response.data.data[0].LOSS_SX2 ?? 0;
            } else if (PROCESS_NUMBER === 3) {
              FINAL_LOSS_SX = response.data.data[0].LOSS_SX3 ?? 0;
            } else if (PROCESS_NUMBER === 4) {
              FINAL_LOSS_SX = response.data.data[0].LOSS_SX4 ?? 0;
            }
            if (PROCESS_NUMBER === 1) {
              FINAL_LOSS_SETTING = calc_loss_setting ? response.data.data[0].LOSS_SETTING1 ?? 0 : 0;
            } else if (PROCESS_NUMBER === 2) {
              FINAL_LOSS_SETTING = calc_loss_setting ? response.data.data[0].LOSS_SETTING2 ?? 0 : 0;
            } else if (PROCESS_NUMBER === 3) {
              FINAL_LOSS_SETTING = calc_loss_setting ? response.data.data[0].LOSS_SETTING3 ?? 0 : 0;
            } else if (PROCESS_NUMBER === 4) {
              FINAL_LOSS_SETTING = calc_loss_setting ? response.data.data[0].LOSS_SETTING4 ?? 0 : 0;
            }
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      setCurrentPlanPD(PD);
      setCurrentPlanCAVITY(CAVITY_NGANG * CAVITY_DOC);
      M_MET_NEEDED = parseInt(
        ((PLAN_QTY * PD) / (CAVITY_DOC * CAVITY_NGANG) / 1000).toString()
      );
      //console.log(M_MET_NEEDED);
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
        console.log(error);
      });
  };
  const getCurrentTotalLeadtime = (): number => {
    let machinePlanList: QLSXPLANDATA[] = plandatatable.filter(
      (element: QLSXPLANDATA, index: number) => {
        return (
          element.PLAN_EQ === selectedMachine &&
          element.PLAN_FACTORY === selectedFactory
        );
      }
    );
    //console.log('machinePlanList',machinePlanList);
    let sum: number = 0;
    for (let i = 0; i < machinePlanList.length; i++) {
      sum += machinePlanList[i].AT_LEADTIME ?? 9990;
    }
    console.log('sum', sum)
    return sum;
  }
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
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
  const handle_DeleteLinePLAN = async () => {
    if (qlsxplandatafilter.length > 0) {
      let datafilter = [...plandatatable];
      for (let i = 0; i < qlsxplandatafilter.length; i++) {
        for (let j = 0; j < datafilter.length; j++) {
          if (qlsxplandatafilter[i].id === datafilter[j].id) {
            await generalQuery("checkPLANID_O302", {
              PLAN_ID: qlsxplandatafilter[i].PLAN_ID,
            })
              .then((response) => {
                //console.log(response.data);
                if (response.data.tk_status !== "NG") {
                } else {
                  if (qlsxplandatafilter[i].CHOTBC === null) {
                    generalQuery("deletePlanQLSX", {
                      PLAN_ID: qlsxplandatafilter[i].PLAN_ID,
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
                      qlsxplandatafilter[i].PLAN_ID +
                      ":  +đã chốt báo cáo, ko xóa được chỉ thị",
                      "error"
                    );
                  }
                }
                /*  generalQuery("deletePlanQLSX", { PLAN_ID: qlsxplandatafilter[i].PLAN_ID })
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
  const handle_DeleteLineCHITHI = () => {
    if (qlsxchithidatafilter.length > 0) {
      let datafilter = [...chithidatatable];
      for (let i = 0; i < qlsxchithidatafilter.length; i++) {
        for (let j = 0; j < datafilter.length; j++) {
          if (qlsxchithidatafilter[i].CHITHI_ID === datafilter[j].CHITHI_ID) {
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
    if (ycsxdatatablefilter.length >= 1) {
      for (let i = 0; i < ycsxdatatablefilter.length; i++) {
        let check_ycsx_hethongcu: boolean = false;
        await generalQuery("checkProd_request_no_Exist_O302", {
          PROD_REQUEST_NO: ycsxdatatablefilter[i].PROD_REQUEST_NO,
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
          ycsxdatatablefilter[i].PROD_REQUEST_NO
        );
        let NextPlanID = nextPlan.NEXT_PLAN_ID;
        let NextPlanOrder = nextPlan.NEXT_PLAN_ORDER;
        if (check_ycsx_hethongcu === false) {
          //console.log(selectedMachine.substring(0,2));
          await generalQuery("addPlanQLSX", {
            PLAN_ID: NextPlanID,
            PLAN_DATE: selectedPlanDate,
            PROD_REQUEST_NO: ycsxdatatablefilter[i].PROD_REQUEST_NO,
            PLAN_QTY: 0,
            PLAN_EQ: selectedMachine,
            PLAN_FACTORY: selectedFactory,
            PLAN_LEADTIME: 0,
            STEP: 0,
            PLAN_ORDER: NextPlanOrder,
            PROCESS_NUMBER:
              selectedMachine.substring(0, 2) === ycsxdatatablefilter[i].EQ1
                ? 1
                : selectedMachine.substring(0, 2) === ycsxdatatablefilter[i].EQ2
                  ? 2
                  : 0,
            G_CODE: ycsxdatatablefilter[i].G_CODE,
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
          KETQUASX:
            selectedPlanTable[i].KETQUASX === null
              ? 0
              : selectedPlanTable[i].KETQUASX,
          NEXT_PLAN_ID:
            selectedPlanTable[i].NEXT_PLAN_ID === null
              ? "X"
              : selectedPlanTable[i].NEXT_PLAN_ID,
          IS_SETTING: selectedPlanTable[i].IS_SETTING
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
        //PLAN_ID: qlsxplandatafilter[0].PLAN_ID,
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
          //G_CODE: qlsxplandatafilter[0].G_CODE,
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
            //PLAN_ID: qlsxplandatafilter[0].PLAN_ID,
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
              //PLAN_ID: qlsxplandatafilter[0].PLAN_ID,
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
      selectedPlan?.PLAN_ID === undefined ? "xxx" : selectedPlan?.PLAN_ID,
      selectedPlan?.G_CODE === undefined ? "xxx" : selectedPlan?.G_CODE,
      selectedPlan?.PLAN_QTY === undefined ? 0 : selectedPlan?.PLAN_QTY,
      selectedPlan?.PROCESS_NUMBER === undefined
        ? 1
        : selectedPlan?.PROCESS_NUMBER
    );
  };
  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
        {/*  <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />  */}
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(ycsxdatatable, "YCSX Table");
          }}
        >
          <AiFillFileExcel color='green' size={15} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
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
          <AiOutlinePrinter color='#0066ff' size={15} />
          Print YCSX
        </IconButton>
        <IconButton
          className='buttonIcon'
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
          <AiOutlinePrinter color='#ff751a' size={15} />
          Print Bản Vẽ
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            if (ycsxdatatablefilter.length > 0) {
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
      </GridToolbarContainer>
    );
  }
  function CustomToolbarPLANTABLE() {
    return (
      <GridToolbarContainer>
        {/*  <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />  */}
        <IconButton
          className='buttonIcon'
          onClick={() => {
            setShowYCSX(!showYCSX);
          }}
        >
          <TbLogout color='red' size={20} />
          Show/Hide YCSX
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(plandatatable, "Plan Table");
          }}
        >
          <AiFillFileExcel color='green' size={15} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
        <IconButton
          className='buttonIcon'
          onClick={() => {
            if (qlsxplandatafilter.length > 0) {
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
              setChiThiListRender(renderChiThi(qlsxplandatafilter));
              //console.log(ycsxdatatablefilter);
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
            if (chithiarray !== undefined && chithiarray.length > 0) {
              if (
                chithiarray[0].FACTORY === null ||
                chithiarray[0].EQ1 === null ||
                chithiarray[0].EQ2 === null ||
                chithiarray[0].Setting1 === null ||
                chithiarray[0].Setting2 === null ||
                chithiarray[0].UPH1 === null ||
                chithiarray[0].UPH2 === null ||
                chithiarray[0].Step1 === null ||
                chithiarray[0].Step1 === null ||
                chithiarray[0].LOSS_SX1 === null ||
                chithiarray[0].LOSS_SX2 === null ||
                chithiarray[0].LOSS_SETTING1 === null ||
                chithiarray[0].LOSS_SETTING2 === null
              ) {
                Swal.fire(
                  "Thông báo",
                  "Nhập data định mức trước khi chỉ thị",
                  "error"
                );
              } else {
                let chithimain: QLSXPLANDATA[] = chithiarray.filter(
                  (element: QLSXPLANDATA, index: number) => element.STEP === 0
                );
                if (chithimain.length > 0) {
                  setShowChiThi2(true);
                  setChiThiListRender2(renderChiThi2(chithiarray));
                } else {
                  Swal.fire("Thông báo", "Chưa có chỉ thị chính (B0)", "error");
                }
              }
              //console.log(ycsxdatatablefilter);
            } else {
              setShowChiThi2(false);
              Swal.fire("Thông báo", "Chọn ít nhất 1 Plan để in", "error");
            }
          }}
        >
          <AiOutlinePrinter color='#0066ff' size={15} />
          Print Chỉ Thị Combo
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            if (qlsxplandatafilter.length > 0) {
              setShowYCKT(true);
              setYCKTListRender(renderYCKT(qlsxplandatafilter));
              //console.log(ycsxdatatablefilter);
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
        <IconButton
          className='buttonIcon'
          onClick={() => {
            dispatch(addChithiArray(qlsxplandatafilter[0]));
          }}
        >
          <AiFillFolderAdd color='#69f542' size={20} />
          Add to Print Combo
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            dispatch(resetChithiArray(""));
          }}
        >
          <BiRefresh color='red' size={20} />
          Reset Print Combo
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            let temp_combo: string = "";
            if (chithiarray !== undefined) {
              for (let i = 0; i < chithiarray?.length; i++) {
                temp_combo +=
                  i +
                  1 +
                  "_PLAN_ID: " +
                  chithiarray[i].PLAN_ID +
                  "_CODE: " +
                  chithiarray[i].G_NAME_KD +
                  "_STEP: " +
                  chithiarray[i].STEP +
                  "*******";
              }
              Swal.fire("Thong bao", temp_combo, "info");
            } else {
              Swal.fire("Thong bao", "Chưa có chỉ thị trong combo", "info");
            }
          }}
        >
          <BiRefresh color='red' size={20} />
          Show Combo
        </IconButton>
        <span>Total time: {plandatatable.filter(
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
      </GridToolbarContainer>
    );
  }
  function CustomToolbarCHITHITABLE() {
    return (
      <GridToolbarContainer>
        {/*  <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />  */}
        <IconButton className='buttonIcon' onClick={() => { }}>
          <AiFillFileExcel color='green' size={15} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
        <IconButton
          className='buttonIcon'
          onClick={() => {
            /*   checkBP(
              userData?.EMPL_NO,
              userData?.MAINDEPTNAME,
              ["QLSX"],
              handleConfirmDKXL
            ); */
            checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], handleConfirmDKXL);
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
                handle_loadKhoAo();
                handle_loadlichsuxuatkhoao();
                handle_loadlichsunhapkhoao();
                handle_loadlichsuinputlieu(
                  selectedPlan?.PLAN_ID === undefined
                    ? "xxx"
                    : selectedPlan?.PLAN_ID
                );
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
              selectedPlan?.PLAN_ID === undefined
                ? "xxx"
                : selectedPlan?.PLAN_ID,
              selectedPlan?.G_CODE === undefined ? "xxx" : selectedPlan?.G_CODE,
              selectedPlan?.PLAN_QTY === undefined ? 0 : selectedPlan?.PLAN_QTY,
              selectedPlan?.PROCESS_NUMBER === undefined
                ? 0
                : selectedPlan?.PROCESS_NUMBER
            );
          }}
        >
          <BiRefresh color='yellow' size={20} />
          Refresh chỉ thị
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            /* checkBP(
              userData?.EMPL_NO,
              userData?.MAINDEPTNAME,
              ["QLSX"],
              handle_xuatdao_sample
            ); */
            checkBP(
              userData,
              ["QLSX"],
              ["ALL"],
              ["ALL"],
              handle_xuatdao_sample
            );
            //handle_xuatdao_sample();
          }}
        >
          <GiCurvyKnife color='red' size={20} />
          Xuất dao sample
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            /*  checkBP(
              userData?.EMPL_NO,
              userData?.MAINDEPTNAME,
              ["QLSX"],
              handle_xuatlieu_sample
            ); */
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
        <span style={{ fontSize: 20, fontWeight: "bold", color: "red" }}>
          {selectedPlan?.PLAN_ID}
        </span>{" "}
        ___
        <span style={{ fontSize: 20, fontWeight: "bold", color: "blue" }}>
          {selectedPlan?.G_NAME}
        </span>
        <span style={{ fontSize: 20, fontWeight: "bold", color: "green" }}>
          ___PD:
          {currentPlanPD}
        </span>
        <span style={{ fontSize: 20, fontWeight: "bold", color: "green" }}>
          ___CAVITY:
          {currentPlanCAVITY}
        </span>
        <span style={{ fontSize: 20, fontWeight: "bold", color: "green" }}>
          ___PLAN_QTY:
          {selectedPlan?.PLAN_QTY.toLocaleString("en-US")}
        </span>
        {/*  Có setting hay không?
        <input
          type='checkbox'
          name='alltimecheckbox'
          defaultChecked={selectedPlan?.IS_SETTING==='Y'}
          onChange={() => {
            const newdata = plandatatable.map((p) =>
            p.PLAN_ID === selectedPlan?.PLAN_ID
              ? { ...p, IS_SETTING: selectedPlan?.IS_SETTING==='Y'? 'N': 'Y' }
              : p
          );
          setPlanDataTable(newdata);
          setQlsxPlanDataFilter([]);
            //setCalc_Loss_Setting(!calc_loss_setting)
          }}
        ></input> */}
      </GridToolbarContainer>
    );
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
  function CustomToolbarKHOAO() {
    return (
      <GridToolbarContainer>
        {/*  <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />  */}
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(tonlieuxuongdatatable, "Ton kho ao Table");
          }}
        >
          <AiFillFileExcel color='green' size={15} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
        <div className='div' style={{ fontSize: 20, fontWeight: "bold" }}>
          Tồn kho ảo
        </div>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            handle_xuatKhoAo();
          }}
        >
          <AiOutlineCaretRight color='blue' size={20} />
          Xuất kho
        </IconButton>
      </GridToolbarContainer>
    );
  }
  function CustomToolbarLICHSUINPUTSX() {
    return (
      <GridToolbarContainer>
        {/*  <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />  */}
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(lichsuinputlieutable, "Lich Su Input Lieu Table");
          }}
        >
          <AiFillFileExcel color='green' size={15} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
        <div className='div' style={{ fontSize: 20, fontWeight: "bold" }}>
          Lịch sử input liệu sản xuất
        </div>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            Swal.fire("Thông báo", "Bên sản xuất sẽ confirm", "info");
            //handle_saveConfirmLieuTon();
          }}
        >
          <AiFillSave color='yellow' size={20} />
          Lưu tồn liệu
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            Swal.fire("Thông báo", "Bên sản xuất sẽ confirm", "info");
          }}
        >
          <AiOutlineRollback color='yellow' size={20} />
          Nhập lại vào kho ảo
        </IconButton>
      </GridToolbarContainer>
    );
  }
  function CustomToolbarNHAPKHOAO() {
    return (
      <GridToolbarContainer>
        {/*  <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />  */}
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(lichsunhapkhoaotable, "Lich Su Nhap Kho Ao Table");
          }}
        >
          <AiFillFileExcel color='green' size={15} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
        <div className='div' style={{ fontSize: 20, fontWeight: "bold" }}>
          Lịch sử nhập kho ảo
        </div>
      </GridToolbarContainer>
    );
  }
  function CustomToolbarXUATKHOAO() {
    return (
      <GridToolbarContainer>
        {/*  <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />  */}
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(lichsuxuatkhoaotable, "Xuat kho ao Table");
          }}
        >
          <AiFillFileExcel color='green' size={15} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
        <div className='div' style={{ fontSize: 20, fontWeight: "bold" }}>
          Lịch sử xuất kho ảo
        </div>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            Swal.fire("Thông báo", "Không được phép", "error");
            //handle_huyxuatkhoao();
          }}
        >
          <FcCancel color='white' size={20} />
          Hủy Xuất
        </IconButton>
      </GridToolbarContainer>
    );
  }
  const handleYCSXSelectionforUpdate = (ids: GridSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = ycsxdatatable.filter((element: any) =>
      selectedID.has(element.PROD_REQUEST_NO)
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
      selectedID.has(element.PLAN_ID)
    );
    //console.log(datafilter);
    if (datafilter.length > 0) {
      setQlsxPlanDataFilter(datafilter);
      /* setDataDinhMuc({
        ...datadinhmuc,
        FACTORY: datafilter[0].FACTORY === null ? "" : datafilter[0].FACTORY,
        EQ1:
          datafilter[0].EQ1 === null
            ? "NA"
            : datafilter[0].EQ1 === ""
            ? "NO"
            : datafilter[0].EQ1,
        EQ2:
          datafilter[0].EQ2 === null
            ? "NA"
            : datafilter[0].EQ2 === ""
            ? "NO"
            : datafilter[0].EQ2,
        Setting1: datafilter[0].Setting1 === null ? 0 : datafilter[0].Setting1,
        Setting2: datafilter[0].Setting2 === null ? 0 : datafilter[0].Setting2,
        UPH1: datafilter[0].UPH1 === null ? 0 : datafilter[0].UPH1,
        UPH2: datafilter[0].UPH2 === null ? 0 : datafilter[0].UPH2,
        Step1: datafilter[0].Step1 === null ? 0 : datafilter[0].Step1,
        Step2: datafilter[0].Step2 === null ? 0 : datafilter[0].Step2,
        LOSS_SX1: datafilter[0].LOSS_SX1 === null ? 0 : datafilter[0].LOSS_SX1,
        LOSS_SX2: datafilter[0].LOSS_SX2 === null ? 0 : datafilter[0].LOSS_SX2,
        LOSS_SETTING1:
          datafilter[0].LOSS_SETTING1 === null
            ? 0
            : datafilter[0].LOSS_SETTING1,
        LOSS_SETTING2:
          datafilter[0].LOSS_SETTING2 === null
            ? 0
            : datafilter[0].LOSS_SETTING2,
        NOTE: datafilter[0].NOTE === null ? "" : datafilter[0].NOTE,
      });
      handleGetChiThiTable(
        datafilter[0].PLAN_ID,
        datafilter[0].G_CODE,
        datafilter[0].PLAN_QTY,
        datafilter[0].PROCESS_NUMBER
      ); */
    } else {
      setQlsxPlanDataFilter([]);
      //setChiThiDataTable([]);
      //console.log("xoa filter");
    }
  };
  const handleQLSXCHITHIDataSelectionforUpdate = (ids: GridSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = chithidatatable.filter((element: any) =>
      selectedID.has(element.CHITHI_ID)
    );
    //console.log(datafilter);
    if (datafilter.length > 0) {
      setQlsxChiThiDataFilter(datafilter);
    } else {
      setQlsxChiThiDataFilter([]);
      //console.log("xoa filter");
    }
  };
  const handleTonLieuXuongDataSelectionforUpdate = (
    ids: GridSelectionModel
  ) => {
    const selectedID = new Set(ids);
    let datafilter = tonlieuxuongdatatable.filter((element: any) =>
      selectedID.has(element.id)
    );
    //console.log(datafilter);
    if (datafilter.length > 0) {
      setTonLieuXuongDataFilter(datafilter);
    } else {
      setTonLieuXuongDataFilter([]);
      //console.log("xoa filter");
    }
  };
  const handleLichSuXuatKhoAoDataSelectionforUpdate = (
    ids: GridSelectionModel
  ) => {
    const selectedID = new Set(ids);
    let datafilter = lichsuxuatkhoaotable.filter((element: any) =>
      selectedID.has(element.id)
    );
    //console.log(datafilter);
    if (datafilter.length > 0) {
      setLichSuXuatKhoAoDataFilter(datafilter);
    } else {
      setLichSuXuatKhoAoDataFilter([]);
      //console.log("xoa filter");
    }
  };
  const handleLichSuInputSXDataSelectionforUpdate = (
    ids: GridSelectionModel
  ) => {
    const selectedID = new Set(ids);
    let datafilter = lichsuinputlieutable.filter((element: any) =>
      selectedID.has(element.id)
    );
    //console.log(datafilter);
    if (datafilter.length > 0) {
      setLichSuInputLieuDataFilter(datafilter);
    } else {
      setLichSuInputLieuDataFilter([]);
      //console.log("xoa filter");
    }
  };
  const zeroPad = (num: number, places: number) =>
    String(num).padStart(places, "0");
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
  const handleEvent: GridEventListener<"rowClick"> = (
    params, // GridRowParams
    event, // MuiEvent<React.MouseEvent<HTMLElement>>
    details // GridCallbackDetails
  ) => {
    let rowData: QLSXPLANDATA = params.row;
    //console.log(rowData);
    setSelectedPlan(rowData);
    setDataDinhMuc({
      ...datadinhmuc,
      FACTORY: rowData.FACTORY === null ? "NA" : rowData.FACTORY,
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
    handleGetChiThiTable(
      rowData.PLAN_ID,
      rowData.G_CODE,
      rowData.PLAN_QTY,
      rowData.PROCESS_NUMBER
    );
    if (rowData.G_CODE !== "")
      console.log('da click row roi');
    getRecentDM(rowData.G_CODE);
    //console.log(params.row);
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
                            setCurrentTotalLeadTime(getCurrentTotalLeadtime());
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
                            setCurrentTotalLeadTime(getCurrentTotalLeadtime());
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
                    </div>
                    <div className='formbutton'>
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
                        <FcSearch color='green' size={30} />
                        Search
                      </IconButton>
                    </div>
                  </div>
                  <div className='tracuuYCSXTable'>
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
                      editMode='row'
                      getRowId={(row) => row.PROD_REQUEST_NO}
                      onSelectionModelChange={(ids) => {
                        handleYCSXSelectionforUpdate(ids);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className='chithidiv'>
              <div className='listchithi'>
                <div className='planlist'>
                  <DataGrid
                    sx={{ fontSize: 12, flex: 1 }}
                    components={{
                      Toolbar: CustomToolbarPLANTABLE,
                      LoadingOverlay: LinearProgress,
                    }}
                    loading={isLoading}
                    rowHeight={30}
                    rows={plandatatable.filter(
                      (element: QLSXPLANDATA, index: number) => {
                        return (
                          element.PLAN_EQ === selectedMachine &&
                          element.PLAN_FACTORY === selectedFactory
                        );
                      }
                    )}
                    columns={column_plandatatable}
                    rowsPerPageOptions={[
                      5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
                    ]}
                    editMode='cell'
                    getRowId={(row) => row.PLAN_ID}
                    checkboxSelection
                    onSelectionModelChange={(ids) => {
                      handleQLSXPlanDataSelectionforUpdate(ids);
                    }}
                    disableSelectionOnClick
                    onCellEditCommit={(
                      params: GridCellEditCommitParams,
                      event: MuiEvent<MuiBaseEvent>,
                      details: GridCallbackDetails
                    ) => {
                      const keyvar = params.field;
                      const newdata = plandatatable.map((p) =>
                        p.PLAN_ID === params.id
                          ? { ...p, [keyvar]: params.value }
                          : p
                      );
                      setPlanDataTable(newdata);
                      setQlsxPlanDataFilter([]);
                      //console.log(plandatatable);
                    }}
                    onRowClick={handleEvent}
                  />
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
                      <b>LOSS_SX1(%): <span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 1)[0]?.LOSS_SX.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? ""}%)</span></b>{" "}
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
                      <b>LOSS_SX2(%):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 2)[0]?.LOSS_SX.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? ""}%)</span></b>{" "}
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
                      <b>LOSS ST1 (m):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 1)[0]?.TT_SETTING_MET.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? ""}m)</span></b>{" "}
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
                      <b>LOSS ST2 (m):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 2)[0]?.TT_SETTING_MET.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? ""}m)</span></b>{" "}
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
                      <b>LOSS_SX3(%):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 3)[0]?.LOSS_SX.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? ""}%)</span></b>{" "}
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
                      <b>LOSS_SX4(%):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 4)[0]?.LOSS_SX.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? ""}%)</span></b>{" "}
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
                      <b>LOSS ST3 (m):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 3)[0]?.TT_SETTING_MET.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? ""}m)</span></b>{" "}
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
                      <b>LOSS ST4 (m):<span style={{ color: 'red', fontSize: '0.7rem' }}>({recentDMData.filter((e) => e.PROCESS_NUMBER === 4)[0]?.TT_SETTING_MET.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? ""}m)</span></b>{" "}
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
                <div className='chithitable'>
                  <DataGrid
                    sx={{ fontSize: 12, flex: 1 }}
                    components={{
                      Toolbar: CustomToolbarCHITHITABLE,
                      LoadingOverlay: LinearProgress,
                    }}
                    getRowId={(row) => row.CHITHI_ID}
                    loading={isLoading}
                    rowHeight={30}
                    rows={chithidatatable}
                    columns={column_chithidatatable}
                    rowsPerPageOptions={[
                      5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
                    ]}
                    editMode='cell'
                    checkboxSelection
                    onSelectionModelChange={(ids) => {
                      handleQLSXCHITHIDataSelectionforUpdate(ids);
                    }}
                    onCellEditCommit={(
                      params: GridCellEditCommitParams,
                      event: MuiEvent<MuiBaseEvent>,
                      details: GridCallbackDetails
                    ) => {
                      const keyvar = params.field;
                      const newdata = chithidatatable.map((p) =>
                        p.CHITHI_ID === params.id
                          ? { ...p, [keyvar]: params.value }
                          : p
                      );
                      //console.log(newdata);
                      setChiThiDataTable(newdata);
                    }}
                  />
                </div>
              </div>
              {selection.tabycsx && (
                <div className='printycsxpage'>
                  <div className='buttongroup'>
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
              {false && (
                <div className='khoaodiv'>
                  <div
                    className='khoaotieude'
                    style={{ fontSize: 25, fontWeight: "bold" }}
                  >
                    KHO ẢO
                    <Button
                      onClick={() => {
                        setShowKhoAo(!showkhoao);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        handle_loadKhoAo();
                        handle_loadlichsunhapkhoao();
                        handle_loadlichsuxuatkhoao();
                        handle_loadlichsuinputlieu(
                          selectedPlan?.PLAN_ID === undefined
                            ? "xxx"
                            : selectedPlan?.PLAN_ID
                        );
                      }}
                    >
                      Refresh
                    </Button>
                  </div>
                  <div className='khoaodivtable'>
                    <div
                      className='tablekhoao'
                      style={{ height: "100%", width: "50%" }}
                    >
                      <div className='tabletonkhoao'>
                        <DataGrid
                          sx={{ fontSize: 12, flex: 1 }}
                          components={{
                            Toolbar: CustomToolbarKHOAO,
                            LoadingOverlay: LinearProgress,
                          }}
                          getRowId={(row) => row.id}
                          loading={isLoading}
                          rowHeight={30}
                          rows={tonlieuxuongdatatable}
                          columns={column_tonlieuxuongtable}
                          rowsPerPageOptions={[
                            5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
                          ]}
                          checkboxSelection
                          selectionModel={selectionModel}
                          onSelectionModelChange={(ids) => {
                            setSelectionModel(ids);
                            handleTonLieuXuongDataSelectionforUpdate(ids);
                          }}
                          onCellEditCommit={(
                            params: GridCellEditCommitParams,
                            event: MuiEvent<MuiBaseEvent>,
                            details: GridCallbackDetails
                          ) => {
                            const keyvar = params.field;
                            const newdata = tonlieuxuongdatatable.map((p) =>
                              p.id === params.id
                                ? { ...p, [keyvar]: params.value }
                                : p
                            );
                            setTonLieuXuongDataFilter(newdata);
                            //console.log(chithidatatable);
                          }}
                        />
                      </div>
                      <div className='lichsuinputsanxuat'>
                        <DataGrid
                          sx={{ fontSize: 12, flex: 1 }}
                          components={{
                            Toolbar: CustomToolbarLICHSUINPUTSX,
                            LoadingOverlay: LinearProgress,
                          }}
                          getRowId={(row) => row.id}
                          loading={isLoading}
                          rowHeight={30}
                          rows={lichsuinputlieutable}
                          columns={column_lichsuinputlieusanxuat}
                          rowsPerPageOptions={[
                            5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
                          ]}
                          checkboxSelection
                          selectionModel={selectionModel_INPUTSX}
                          onSelectionModelChange={(ids) => {
                            setSelectionModel_INPUTSX(ids);
                            handleLichSuInputSXDataSelectionforUpdate(ids);
                          }}
                          onCellEditCommit={(
                            params: GridCellEditCommitParams,
                            event: MuiEvent<MuiBaseEvent>,
                            details: GridCallbackDetails
                          ) => {
                            const keyvar = params.field;
                            const newdata = lichsuinputlieutable.map((p) =>
                              p.id === params.id
                                ? { ...p, [keyvar]: params.value }
                                : p
                            );
                            setLichSuInputLieuTable(newdata);
                            //console.log(chithidatatable);
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className='nhapxuatkhoao'
                      style={{ height: "100%", width: "50%" }}
                    >
                      <div
                        className='nhapkhoao'
                        style={{ height: "100%", width: "100%" }}
                      >
                        <DataGrid
                          sx={{ fontSize: 12, flex: 1 }}
                          components={{
                            Toolbar: CustomToolbarNHAPKHOAO,
                            LoadingOverlay: LinearProgress,
                          }}
                          getRowId={(row) => row.id}
                          loading={isLoading}
                          rowHeight={30}
                          rows={lichsunhapkhoaotable}
                          columns={column_lichsunhapkhoaotable}
                          rowsPerPageOptions={[
                            5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
                          ]}
                          /*  checkboxSelection */
                          onSelectionModelChange={(ids) => {
                            handleTonLieuXuongDataSelectionforUpdate(ids);
                          }}
                          onCellEditCommit={(
                            params: GridCellEditCommitParams,
                            event: MuiEvent<MuiBaseEvent>,
                            details: GridCallbackDetails
                          ) => {
                            const keyvar = params.field;
                            const newdata = lichsunhapkhoaotable.map((p) =>
                              p.id === params.id
                                ? { ...p, [keyvar]: params.value }
                                : p
                            );
                            setLichSuNhapKhoAoTable(newdata);
                            //console.log(chithidatatable);
                          }}
                        />
                      </div>
                      <div
                        className='xuatkhoao'
                        style={{ height: "100%", width: "100%" }}
                      >
                        <DataGrid
                          sx={{ fontSize: 12, flex: 1 }}
                          components={{
                            Toolbar: CustomToolbarXUATKHOAO,
                            LoadingOverlay: LinearProgress,
                          }}
                          getRowId={(row) => row.id}
                          loading={isLoading}
                          rowHeight={30}
                          rows={lichsuxuatkhoaotable}
                          columns={column_lichsuxuatkhoaotable}
                          rowsPerPageOptions={[
                            5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
                          ]}
                          checkboxSelection
                          selectionModel={selectionModel_XUATKHOAO}
                          onSelectionModelChange={(ids) => {
                            setSelectionModel_XUATKHOAO(ids);
                            handleLichSuXuatKhoAoDataSelectionforUpdate(ids);
                          }}
                          onCellEditCommit={(
                            params: GridCellEditCommitParams,
                            event: MuiEvent<MuiBaseEvent>,
                            details: GridCallbackDetails
                          ) => {
                            const keyvar = params.field;
                            const newdata = lichsuxuatkhoaotable.map((p) =>
                              p.id === params.id
                                ? { ...p, [keyvar]: params.value }
                                : p
                            );
                            setLichSuXuatKhoAoTable(newdata);
                            //console.log(chithidatatable);
                          }}
                        />
                      </div>
                    </div>
                  </div>
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
                            chithiarray !== undefined ? chithiarray : []
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
