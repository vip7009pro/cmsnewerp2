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
  import { generalQuery } from "../../../../api/Api";
  import moment from "moment";
  import { UserContext } from "../../../../api/Context";
  import {
    DataGrid,
    GridAddIcon,
    GridCallbackDetails,
    GridCellEditCommitParams,
    GridSelectionModel,
    GridToolbarContainer,
    GridToolbarQuickFilter,
    MuiBaseEvent,
    MuiEvent,
  } from "@mui/x-data-grid";
  import { Alert, Button, IconButton, LinearProgress, TextField } from "@mui/material";
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
  import { SaveExcel } from "../../../../api/GlobalFunction";
  import YCSXComponent from "../../../kinhdoanh/ycsxmanager/YCSXComponent/YCSXComponent";
  import DrawComponent from "../../../kinhdoanh/ycsxmanager/DrawComponent/DrawComponent";
  import { useReactToPrint } from "react-to-print";
  import CHITHI_COMPONENT from "../CHITHI/CHITHI_COMPONENT";
  import { BiRefresh, BiReset } from "react-icons/bi";
  import YCKT from "../YCKT/YCKT";
  const axios = require("axios").default;

  interface DINHMUC_QSLX {
    FACTORY: string,
    EQ1: string,
    EQ2: string,
    Setting1: number,
    Setting2: number,
    UPH1: number,
    UPH2: number,
    Step1: number,
    Step2: number,
    LOSS_SX1: number,
    LOSS_SX2: number,
    LOSS_SETTING1: number,
    LOSS_SETTING2: number,
    NOTE: string
  }
  interface QLSXPLANDATA {
    id: string,
    PLAN_ID: string;
    PLAN_DATE: string;
    PROD_REQUEST_NO: string;
    PLAN_QTY: number;
    PLAN_EQ: string;
    PLAN_FACTORY: string;
    PLAN_LEADTIME: number;
    INS_EMPL: string;
    INS_DATE: string;
    UPD_EMPL: string;
    UPD_DATE: string;
    G_CODE: string;
    G_NAME: string;
    G_NAME_KD: string;
    PROD_REQUEST_DATE: string;
    PROD_REQUEST_QTY: number;
    STEP: string;
    PLAN_ORDER: string;
    PROCESS_NUMBER: number;
    KETQUASX: number;
    KQ_SX_TAM: number;
    CD1: number;
    CD2: number;
    TON_CD1: number;
    TON_CD2: number;
    FACTORY: string,
    EQ1: string,
    EQ2: string,
    Setting1: number,
    Setting2: number,
    UPH1: number,
    UPH2: number,
    Step1: number,
    Step2: number,
    LOSS_SX1: number,
    LOSS_SX2: number,
    LOSS_SETTING1: number,
    LOSS_SETTING2: number,
    NOTE: string,
    NEXT_PLAN_ID: string,
  }
  interface YCSXTableData {
    DESCR?: string;
    PDBV_EMPL?: string;
    PDBV_DATE?: string;
    PDBV?: string;
    BANVE?: string;
    PROD_MAIN_MATERIAL?: string;
    PROD_TYPE?: string;
    EMPL_NO: string;
    CUST_CD: string;
    G_CODE: string;
    G_NAME: string;
    EMPL_NAME: string;
    CUST_NAME_KD: string;
    PROD_REQUEST_NO: string;
    PROD_REQUEST_DATE: string;
    PROD_REQUEST_QTY: number;
    LOT_TOTAL_INPUT_QTY_EA: number;
    LOT_TOTAL_OUTPUT_QTY_EA: number;
    INSPECT_BALANCE: number;
    SHORTAGE_YCSX: number;
    YCSX_PENDING: number;
    PHAN_LOAI: string;
    REMARK: string;
    PO_TDYCSX: number;
    TOTAL_TKHO_TDYCSX: number;
    TKHO_TDYCSX: number;
    BTP_TDYCSX: number;
    CK_TDYCSX: number;
    BLOCK_TDYCSX: number;
    FCST_TDYCSX: number;
    W1: number;
    W2: number;
    W3: number;
    W4: number;
    W5: number;
    W6: number;
    W7: number;
    W8: number;
    PDUYET: number;
    LOAIXH: string;
    PO_BALANCE: number,
    EQ1: string,
    EQ2: string,
    CD1: number,
    CD2: number,
    CD_IN: number,
    CD_DIECUT: number,
    TON_CD1: number,
    TON_CD2: number
  }
  interface QLSXCHITHIDATA {
      id: string,
      CHITHI_ID: number,
      PLAN_ID: string,    
      M_CODE: string,
      M_NAME: string, 
      WIDTH_CD: number,
      M_ROLL_QTY: number,
      M_MET_QTY: number,
      M_QTY: number,
      LIEUQL_SX: number,
      MAIN_M: number,
      OUT_KHO_SX: number,
      OUT_CFM_QTY: number,
      INS_EMPL: string,
      INS_DATE: string,
      UPD_EMPL: string,
      UPD_DATE: string,
  }
  const QUICKPLAN = () => {
    const [currentPlanPD, setCurrentPlanPD]= useState(0);
    const [currentPlanCAVITY, setCurrentPlanCAVITY]= useState(0);
    const [selection, setSelection] = useState<any>({
      tab1: true,
      tab2: false,
      tab3: false,
      tabycsx: false,
      tabbanve: false,
    });
    const [datadinhmuc, setDataDinhMuc] = useState<DINHMUC_QSLX>({
      FACTORY: '',
      EQ1: '',
      EQ2: '',
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
      NOTE: ''
    });
    const [plandatatable, setPlanDataTable] = useState<QLSXPLANDATA[]>([]);
    const [chithidatatable, setChiThiDataTable] = useState<QLSXCHITHIDATA[]>([]);
    const [showplanwindow, setShowPlanWindow] = useState(false);
    const [showkhoao, setShowKhoAo] = useState(false);
    const [userData, setUserData] = useContext(UserContext);
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
    const [ycsxdatatablefilter, setYcsxDataTableFilter] = useState<Array<YCSXTableData>>([]);
    const [qlsxplandatafilter, setQlsxPlanDataFilter] = useState<Array<QLSXPLANDATA>>([]);
    const [ycsxpendingcheck, setYCSXPendingCheck] = useState(false);
    const [inspectInputcheck, setInspectInputCheck] = useState(false);
    const [ycsxlistrender, setYCSXListRender] = useState<Array<ReactElement>>();
    const [chithilistrender, setChiThiListRender] = useState<Array<ReactElement>>();
    const [ycktlistrender, setYCKTListRender] = useState<Array<ReactElement>>();
    const [selectedMachine, setSelectedMachine]= useState('FR01');
    const [selectedFactory, setSelectedFactory]= useState('NM1');
    const [selectedPlanDate, setSelectedPlanDate] = useState(moment().format("YYYY-MM-DD"));
    const [showChiThi, setShowChiThi] = useState(false);
    const [showYCKT, setShowYCKT] = useState(false);
    const [editplan, seteditplan] = useState(true);
    const [temp_id, setTemID] = useState(0);
    const ycsxprintref = useRef(null);
    const handlePrint = useReactToPrint({
      content: () => ycsxprintref.current,
    });
    const column_ycsxtable = [
      { field: "G_CODE", headerName: "G_CODE", width: 80 },
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
      { field: "PROD_REQUEST_NO", headerName: "SỐ YCSX", width: 80 },
      { field: "PROD_REQUEST_DATE", headerName: "NGÀY YCSX", width: 80 },
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
        field: "LOT_TOTAL_INPUT_QTY_EA",
        type: "number",
        headerName: "NHẬP KIỂM",
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
        headerName: "XUẤT KIỂM",
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
        width: 250,
        renderCell: (params: any) => {
          let file: any = null;
          let upload_url = "http://14.160.33.94:5011/upload";
          const uploadFile = async (e: any) => {
            console.log(file);
            const formData = new FormData();
            formData.append("banve", file);
            formData.append("filename", params.row.G_CODE);
            if (userData.MAINDEPTNAME === "KD") {
              try {
                const response = await axios.post(upload_url, formData);
                //console.log("ket qua");
                //console.log(response);
                if (response.data.tk_status === "OK") {
                  //Swal.fire('Thông báo','Upload bản vẽ thành công','success');
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
                        let tempycsxdatatable = ycsxdatatable.map(
                          (element, index) => {
                            return element.PROD_REQUEST_NO ===
                              params.row.PROD_REQUEST_NO
                              ? { ...element, BANVE: "Y" }
                              : element;
                          }
                        );
                        setYcsxDataTable(tempycsxdatatable);
                      } else {
                        Swal.fire("Thông báo", "Upload bản vẽ thất bại", "error");
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                } else {
                  Swal.fire("Thông báo", response.data.message, "error");
                }
                //console.log(response.data);
              } catch (ex) {
                console.log(ex);
              }
            } else {
              Swal.fire(
                "Thông báo",
                "Chỉ bộ phận kinh doanh upload được bản vẽ",
                "error"
              );
            }
          };
          let hreftlink = "/banve/" + params.row.G_CODE + ".pdf";
          if (params.row.BANVE === "Y")
            return (
              <span style={{ color: "green" }}>
                <b>
                  <a target='_blank' rel='noopener noreferrer' href={hreftlink}>
                    LINK
                  </a>
                </b>
              </span>
            );
          else
            return (
              <div className='uploadfile'>
                <IconButton className='buttonIcon' onClick={uploadFile}>
                  <AiOutlineCloudUpload color='yellow' size={25} />
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
        field: "PO_BALANCE",
        headerName: "PO_BALANCE",
        width: 110,
        renderCell: (params: any) => {       
          return (
            <span style={{ color: "blue" }}>
              <b>{params.row.PO_BALANCE.toLocaleString('en','US')}</b>
            </span>
          );
        },
      },
      {
        field: "EQ1",
        headerName: "EQ1",
        width: 80,
        renderCell: (params: any) => {       
          return (
            <span style={{ color: "black" }}>
             {params.row.EQ1}
            </span>
          );
        },
      },
      {
        field: "EQ2",
        headerName: "EQ2",
        width: 80,
        renderCell: (params: any) => {       
          return (
            <span style={{ color: "black" }}>
             {params.row.EQ2}
            </span>
          );
        },
      },
      {
        field: "CD1",
        headerName: "XUAT_CD1",
        width: 100,
        renderCell: (params: any) => {       
          return (
            <span style={{ color: "blue" }}>
              <b>{params.row.CD1.toLocaleString('en','US')}</b>
            </span>
          );
        },
      },
      {
        field: "CD2",
        headerName: "XUAT_CD2",
        width: 100,
        renderCell: (params: any) => {       
          return (
            <span style={{ color: "blue" }}>
              <b>{params.row.CD2.toLocaleString('en','US')}</b>
            </span>
          );
        },
      },
      {
        field: "LOT_TOTAL_OUTPUT_QTY_EA",
        type: "number",
        headerName: "XUẤT KIỂM",
        width: 100,
        renderCell: (params: any) => {
          return (
            <span style={{ color: "#cc0099" }}>
              <b>{params.row.LOT_TOTAL_OUTPUT_QTY_EA.toLocaleString("en-US")}</b>
            </span>
          );
        },
      },
      {
        field: "CD_IN",
        headerName: "CD_IN",
        width: 80,
        renderCell: (params: any) => {       
          return (
            <span style={{ color: "gray" }}>
              <b>{params.row.CD_IN.toLocaleString('en','US')}</b>
            </span>
          );
        },
      },
      {
        field: "CD_DIECUT",
        headerName: "CD_DIECUT",
        width: 80,
        renderCell: (params: any) => {       
          return (
            <span style={{ color: "gray" }}>
              <b>{params.row.CD_DIECUT.toLocaleString('en','US')}</b>
            </span>
          );
        },
      },
      {
        field: "TON_CD1",
        headerName: "TONYCSX_CD1",
        width: 120,
        renderCell: (params: any) => {       
          return (
            <span style={{ color: "red" }}>
              <b>{params.row.TON_CD1.toLocaleString('en','US')}</b>
            </span>
          );
        },
      },
      {
        field: "TON_CD2",
        headerName: "TONYCSX_CD2",
        width: 120,
        renderCell: (params: any) => {       
          return (
            <span style={{ color: "red" }}>
              <b>{params.row.TON_CD2.toLocaleString('en','US')}</b>
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
    const column_plandatatable =[    
      { field: "PLAN_ID", headerName: "PLAN_ID", width: 90 , editable: false, resizeable: true},   
      { field: "G_CODE", headerName: "G_CODE", width: 80, editable: false },
      { field: "PROD_REQUEST_NO", headerName: "YCSX NO", width: 80, editable: false },
      { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 180, editable: false, renderCell: (params: any) => {           
        if(params.row.FACTORY === null || params.row.EQ1 === null || params.row.EQ2 === null || params.row.Setting1 === null || params.row.Setting2 === null || params.row.UPH1 === null ||  params.row.UPH2 === null || params.row.Step1 === null || params.row.Step1 === null || params.row.LOSS_SX1 === null || params.row.LOSS_SX2 === null || params.row.LOSS_SETTING1 === null ||  params.row.LOSS_SETTING2 === null)
        return <span style={{color: 'red'}}>{params.row.G_NAME_KD}</span>
        return <span style={{color: 'green'}}>{params.row.G_NAME_KD}</span>    
   }  },
      { field: "PROD_REQUEST_QTY", headerName: "YCSX QTY", width: 80, editable: false , renderCell: (params: any) => {
          return <span style={{color: 'blue'}}>{params.row.PROD_REQUEST_QTY.toLocaleString('en','US')}</span>
     } },  
     { field: "CD1", headerName: "KQ_CD1", width: 80, editable: false , renderCell: (params: any) => {
      return <span style={{color: 'blue'}}>{params.row.CD1.toLocaleString('en','US')}</span>
 } },
  { field: "CD2", headerName: "KQ_CD2", width: 80, editable: false , renderCell: (params: any) => {
      return <span style={{color: 'blue'}}>{params.row.CD2.toLocaleString('en','US')}</span>
 } },
  { field: "TON_CD1", headerName: "TONYCSX_CD1", width: 120, editable: false , renderCell: (params: any) => {
      return <span style={{color: 'blue'}}>{params.row.TON_CD1.toLocaleString('en','US')}</span>
 } },
  { field: "TON_CD2", headerName: "TONYCSX_CD2", width: 120, editable: false , renderCell: (params: any) => {
      return <span style={{color: 'blue'}}>{params.row.TON_CD2.toLocaleString('en','US')}</span>
 } }, 
      { field: "PLAN_QTY", headerName: "PLAN_QTY", width: 80, editable: editplan, renderCell: (params: any) => {
          if(params.row.PLAN_QTY ===0)
          {
            return <span style={{color: 'red'}}>NG</span>
          }
          else
          {
            return <span style={{color: 'green'}}>{params.row.PLAN_QTY.toLocaleString('en','US')}</span>
          }
       }  },
      { field: "PROCESS_NUMBER", headerName: "PROCESS_NUMBER", width: 110, editable: editplan , renderCell: (params: any) => {
        if(params.row.PROCESS_NUMBER ===null || params.row.PROCESS_NUMBER ===0 )
        {
          return <span style={{color: 'red'}}>NG</span>
        }
        else
        {
          return <span style={{color: 'green'}}>{params.row.PROCESS_NUMBER}</span>
        }
     } },
      { field: "STEP", headerName: "STEP", width: 60, editable: editplan },
      { field: "PLAN_ORDER", headerName: "PLAN_ORDER", width: 110, editable: editplan },
      { field: "PLAN_EQ", headerName: "PLAN_EQ", width: 80, editable: editplan, renderCell: (params: any) => {
        if(params.row.PLAN_EQ ===null || params.row.PLAN_EQ ==='' )
        {
          return <span style={{color: 'red'}}>NG</span>
        }
        else
        {
          return <span style={{color: 'green'}}>{params.row.PLAN_EQ}</span>
        }
     }  },
      { field: "PLAN_FACTORY", headerName: "FACTORY", width: 80, editable: false },
      { field: "PLAN_DATE", headerName: "PLAN_DATE", width: 110, editable: false },
      { field: "NEXT_PLAN_ID", headerName: "NEXT_PLAN_ID", width: 120, editable: true },
    ];
    const renderYCKT = (planlist: QLSXPLANDATA[]) => {
      return planlist.map((element, index) => (
        <YCKT   
        key={index}     
        PLAN_ID={element.PLAN_ID}
        PLAN_DATE = {element.PLAN_DATE}     
        PROD_REQUEST_NO={element.PROD_REQUEST_NO}
        PLAN_QTY={element.PLAN_QTY}
        PLAN_EQ={element.PLAN_EQ}        
        PLAN_FACTORY={element.PLAN_FACTORY}        
        PLAN_LEADTIME={element.PLAN_LEADTIME}        
        G_CODE={element.G_CODE}        
        G_NAME={element.G_NAME}        
        G_NAME_KD={element.G_NAME_KD}        
        PROD_REQUEST_DATE={element.PROD_REQUEST_DATE}        
        PROD_REQUEST_QTY={element.PROD_REQUEST_QTY}        
        STEP={element.STEP}        
        PLAN_ORDER={element.PLAN_ORDER}
        />
      ));
    };
    const renderChiThi = (planlist: QLSXPLANDATA[]) => {
      return planlist.map((element, index) => (
        <CHITHI_COMPONENT   
        key={index}     
        PLAN_ID={element.PLAN_ID}
        PLAN_DATE = {element.PLAN_DATE}     
        PROD_REQUEST_NO={element.PROD_REQUEST_NO}
        PLAN_QTY={element.PLAN_QTY}
        PLAN_EQ={element.PLAN_EQ}        
        PLAN_FACTORY={element.PLAN_FACTORY}        
        PLAN_LEADTIME={element.PLAN_LEADTIME}        
        G_CODE={element.G_CODE}        
        G_NAME={element.G_NAME}        
        G_NAME_KD={element.G_NAME_KD}        
        PROD_REQUEST_DATE={element.PROD_REQUEST_DATE}        
        PROD_REQUEST_QTY={element.PROD_REQUEST_QTY}        
        STEP={element.STEP}        
        PLAN_ORDER={element.PLAN_ORDER}
        />
      ));
    };
    const renderYCSX = (ycsxlist: YCSXTableData[]) => {
      return ycsxlist.map((element, index) => (
        <YCSXComponent
          key={index}
          PROD_REQUEST_NO={element.PROD_REQUEST_NO}
          G_CODE={element.G_CODE}
          PO_TDYCSX={element.PO_TDYCSX}
          TOTAL_TKHO_TDYCSX={element.TOTAL_TKHO_TDYCSX}
          TKHO_TDYCSX={element.TKHO_TDYCSX}
          BTP_TDYCSX={element.BTP_TDYCSX}
          CK_TDYCSX={element.CK_TDYCSX}
          BLOCK_TDYCSX={element.BLOCK_TDYCSX}
          FCST_TDYCSX={element.FCST_TDYCSX}
          PDBV={element.PDBV}
          PDBV_EMPL={element.PDBV_EMPL}
          PDBV_DATE={element.PDBV_DATE}
          DESCR={element.DESCR}
        />
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
        )
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
                  PLAN_DATE: moment.utc(element.PLAN_DATE).format('YYYY-MM-DD'),
                  id: index,
                };
              }
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
          Swal.fire(
            "Tiến hành Xóa Plan",
            "Đang xóa Plan",
            "success"
          );
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
          Swal.fire(
            "Tiến hành Lưu PLAN",
            "Đang Lưu PLAN hàng loạt",
            "success"
          );
          handle_SavePlan();
        }
      });
    };
    const handle_DeleteLinePLAN = async() => {    
      if(qlsxplandatafilter.length>0)
      {     
        let datafilter = [...plandatatable];
        for(let i=0;i<qlsxplandatafilter.length; i++)
        {
          for(let j=0;j<datafilter.length;j++)
          {          
            if(qlsxplandatafilter[i].id === datafilter[j].id)
            {
              let prev_length: number = datafilter.length;
              datafilter.splice(j,1);   
              let len: number = datafilter.length-1;
              if(prev_length === 1)
              {
                console.log('vao day');
                setTemID(0);
                localStorage.setItem('temp_plan_table_max_id','0');
              }
              else
              {
                setTemID(parseInt(datafilter[len].id));
                localStorage.setItem('temp_plan_table_max_id',datafilter[len].id);
              }
              setPlanDataTable(datafilter);             
              localStorage.setItem('temp_plan_table',JSON.stringify(datafilter));
            }
          }
        } 
      }
      else
      {
        Swal.fire("Thông báo", "Chọn ít nhất một dòng để xóa", "error"); 
      } 
    }
    const getNextPLAN_ID =async (PROD_REQUEST_NO: string, plan_row: QLSXPLANDATA) => {
      let next_plan_id: string =PROD_REQUEST_NO;
      let next_plan_order: number =1;
      await generalQuery("getLastestPLAN_ID", {
            PROD_REQUEST_NO: PROD_REQUEST_NO
      })
        .then((response) => {
          //console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            //console.log(response.data.data[0].PLAN_ID);
            next_plan_id = PROD_REQUEST_NO +  String.fromCharCode(response.data.data[0].PLAN_ID.substring(7,8).charCodeAt(0) + 1);
          } else {
            next_plan_id = PROD_REQUEST_NO+'A'; 
          }
        })
        .catch((error) => {
          console.log(error);
        });
        await generalQuery("getLastestPLANORDER", {
          PLAN_DATE: plan_row.PLAN_DATE,
          PLAN_EQ: plan_row.PLAN_EQ,
          PLAN_FACTORY: plan_row.PLAN_FACTORY
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
        return {NEXT_PLAN_ID: next_plan_id, NEXT_PLAN_ORDER: next_plan_order};
    }
    const handle_AddPlan = async ()=> {
      let temp_:number = temp_id;
      temp_++;
      setTemID(temp_);
      localStorage.setItem('temp_plan_table_max_id',temp_.toString());
        if (ycsxdatatablefilter.length >= 1) {      
          for (let i = 0; i < ycsxdatatablefilter.length; i++) {         
            let temp_add_plan: QLSXPLANDATA = {
              id: temp_id+1+'',
              PLAN_ID: 'PL'+ (temp_id+1),
              PLAN_DATE: moment().format('YYYY-MM-DD'),
              PROD_REQUEST_NO: ycsxdatatablefilter[i].PROD_REQUEST_NO,
              PLAN_QTY: 0,
              PLAN_EQ: '',
              PLAN_FACTORY: userData.FACTORY_CODE===1? 'NM1': 'NM2',
              PLAN_LEADTIME: 0,
              INS_EMPL: userData.EMPL_NO,
              INS_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
              UPD_EMPL: userData.EMPL_NO,
              UPD_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
              G_CODE: ycsxdatatablefilter[i].G_CODE,
              G_NAME: ycsxdatatablefilter[i].G_NAME,
              G_NAME_KD: ycsxdatatablefilter[i].G_NAME,
              PROD_REQUEST_DATE: ycsxdatatablefilter[i].PROD_REQUEST_DATE,
              PROD_REQUEST_QTY: ycsxdatatablefilter[i].PROD_REQUEST_QTY,
              STEP: '1',
              PLAN_ORDER: '1',
              PROCESS_NUMBER: 1,
              KETQUASX: 0,
              KQ_SX_TAM: 0,
              CD1: ycsxdatatablefilter[i].CD1,
              CD2: ycsxdatatablefilter[i].CD2,
              TON_CD1: ycsxdatatablefilter[i].TON_CD1,
              TON_CD2: ycsxdatatablefilter[i].TON_CD2,
              FACTORY: '',
              EQ1: ycsxdatatablefilter[i].EQ1,
              EQ2: ycsxdatatablefilter[i].EQ2,
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
              NOTE: '',
              NEXT_PLAN_ID: 'X'
            }
            setPlanDataTable([...plandatatable,
              temp_add_plan
            ])
            localStorage.setItem('temp_plan_table',JSON.stringify([...plandatatable,
              temp_add_plan
            ]));
          }     
        } else {
          Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để Add !", "error");
        }
      }
    const handle_SavePlan = async ()=> {
      if(qlsxplandatafilter.length !==0)
      {
        localStorage.setItem('temp_plan_table',JSON.stringify(plandatatable));
        let err_code:string = '0';
        for(let i=0; i< qlsxplandatafilter.length;i++)
        { 
            if(qlsxplandatafilter[i].PROCESS_NUMBER !== null && qlsxplandatafilter[i].PLAN_QTY !== 0 && qlsxplandatafilter[i].PLAN_QTY <= qlsxplandatafilter[i].PROD_REQUEST_QTY && (qlsxplandatafilter[i].PLAN_EQ !=='' && (qlsxplandatafilter[i].PLAN_EQ !=='FR'|| qlsxplandatafilter[i].PLAN_EQ !=='SR'|| qlsxplandatafilter[i].PLAN_EQ !=='DC'|| qlsxplandatafilter[i].PLAN_EQ !=='ED') ))
            {
              let nextPlan =  (await getNextPLAN_ID(qlsxplandatafilter[i].PROD_REQUEST_NO,qlsxplandatafilter[i] ));
              let NextPlanID = nextPlan.NEXT_PLAN_ID;
              let NextPlanOrder = nextPlan.NEXT_PLAN_ORDER;
              generalQuery("addPlanQLSX", {           
                STEP: qlsxplandatafilter[i].STEP,
                PLAN_QTY: qlsxplandatafilter[i].PLAN_QTY,
                PLAN_LEADTIME: qlsxplandatafilter[i].PLAN_LEADTIME,
                PLAN_EQ: qlsxplandatafilter[i].PLAN_EQ,
                PLAN_ORDER: NextPlanOrder,
                PROCESS_NUMBER: qlsxplandatafilter[i].PROCESS_NUMBER,
                KETQUASX: qlsxplandatafilter[i].KETQUASX=== null? 0: qlsxplandatafilter[i].KETQUASX,
                PLAN_ID: NextPlanID,
                PLAN_DATE: moment().format('YYYY-MM-DD'),
                PROD_REQUEST_NO: qlsxplandatafilter[i].PROD_REQUEST_NO,           
                PLAN_FACTORY: qlsxplandatafilter[i].PLAN_FACTORY,
                G_CODE: qlsxplandatafilter[i].G_CODE,
                NEXT_PLAN_ID: qlsxplandatafilter[i].NEXT_PLAN_ID,
              })
                .then((response) => {
                  //console.log(response.data.tk_status);
                  if (response.data.tk_status !== "NG") {
                  } else {
                    err_code += '_'+ response.data.message;
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }
            else
            {
              err_code +='_'+  qlsxplandatafilter[i].G_NAME_KD + ': Plan QTY =0 hoặc Process number trắng, hoặc chỉ thị nhiều hơn ycsx qty, hoặc PLAN_EQ rỗng, hoặc không hợp lệ sẽ ko được lưu';
            }
          }
          if(err_code  !=='0')
          {
            Swal.fire('Thông báo', 'Có lỗi !'+ err_code,'error');
          }
          else
          {
            Swal.fire('Thông báo', 'Lưu PLAN thành công','success');        
          }
      }
      else
      {
        Swal.fire('Thông báo', 'Chọn ít nhất 1 dòng để lưu','error');
      }
    }
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
            <AiFillFileExcel color='green' size={25} />
            SAVE
          </IconButton>
          <GridToolbarQuickFilter />
          <IconButton
            className='buttonIcon'
            onClick={() => {
              handleConfirmSetClosedYCSX();
            }}
          >
            <FaArrowRight color='green' size={25} />
            SET CLOSED
          </IconButton>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              handleConfirmSetPendingYCSX();
            }}
          >
            <MdOutlinePendingActions color='red' size={25} />
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
            <AiOutlinePrinter color='#0066ff' size={25} />
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
            <AiOutlinePrinter color='#ff751a' size={25} />
            Print Bản Vẽ
          </IconButton>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              if (ycsxdatatablefilter.length > 0) {
                handle_AddPlan();
              } else {
                Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để thêm PLAN", "error");
              }
            }}
          >
            <AiFillFolderAdd color='#69f542' size={25} />
            Add to PLAN
          </IconButton> 
        </GridToolbarContainer>
      );
    }
    function CustomToolbarPLANTABLE() {
      return (
        <GridToolbarContainer>          
          <IconButton
            className='buttonIcon'
            onClick={() => {
              SaveExcel(plandatatable, "Plan Table");
            }}
          >
            <AiFillFileExcel color='green' size={25} />
            SAVE
          </IconButton>
          <GridToolbarQuickFilter /> 
          <span style={{fontSize:20,  fontWeight:'bold'}}>Bảng tạm xắp PLAN</span>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              handleConfirmSavePlan();
            }}
          >
            <AiFillSave color='blue' size={20} />
            LƯU PLAN
          </IconButton> 
          <IconButton
            className='buttonIcon'
            onClick={() => {
              handleConfirmDeletePlan();
            }}
          >
            <FcDeleteRow color='yellow' size={20} />
            XÓA PLAN NHÁP
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
      } else {
          setQlsxPlanDataFilter([]);          
        //console.log("xoa filter");
      }
    };   
    const zeroPad = (num:number, places:number) => String(num).padStart(places, '0');
    useEffect(() => {   
      let temp_table: any = [];    
      let temp_max: number = 0;    
      let temp_string: any =  localStorage.getItem('temp_plan_table')?.toString();
      let temp_string2: any =  localStorage.getItem('temp_plan_table_max_id')?.toString();
      //console.log(temp_string);
      //console.log(temp_string2);
      if(temp_string !== undefined && temp_string2 !== undefined)
      {
        temp_max = parseInt(temp_string2);
        temp_table = JSON.parse(temp_string); 
        setPlanDataTable(temp_table);
        setTemID(temp_max);
      }
      else
      {
        setPlanDataTable([]);
        setTemID(0);
      }
      
    }, []);
    return (
      <div className='quickplan'>       
          <div className='planwindow'>          
            <div className='content'>
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
                          <b>Code CMS:</b>{" "}
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
                  {showChiThi && (
                    <div className='printycsxpage'>
                      <div className='buttongroup'>
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
              <div className='chithidiv'>
                <div className='planlist'>
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
                    checkboxSelection
                    editMode='cell'
                    getRowId={(row) => row.PLAN_ID}
                    onSelectionModelChange={(ids) => {
                      handleQLSXPlanDataSelectionforUpdate(ids);
                    }}
                    onCellEditCommit={(
                      params: GridCellEditCommitParams,
                      event: MuiEvent<MuiBaseEvent>,
                      details: GridCallbackDetails
                    ) => {
                      const keyvar = params.field;
                      const newdata = plandatatable.map((p) =>
                        p.PLAN_ID === params.id ? { ...p, [keyvar]: params.value } : p
                      );
                      setPlanDataTable(newdata);
                      //console.log(plandatatable);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>       
      </div>
    );
  };
  export default QUICKPLAN;