import {
  Button,
  IconButton,
} from "@mui/material";
import moment from "moment";
import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AiFillFileExcel,
  AiFillSave,
  AiOutlineArrowRight,
  AiOutlineBarcode,
  AiOutlinePrinter,
} from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import {
  checkBP,
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
  f_updatePlanOrder,
  renderChiThi,
  renderChiThi2,
  SaveExcel,
} from "../../../../api/GlobalFunction";
import "./PLAN_DATATB.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
  MACHINE_LIST,
  QLSXCHITHIDATA,
  QLSXPLANDATA,
  UserData,
} from "../../../../api/GlobalInterface";
import { FaWarehouse } from "react-icons/fa";
import { FcDeleteRow } from "react-icons/fc";
import { BiRefresh, BiReset } from "react-icons/bi";
import { GiCurvyKnife } from "react-icons/gi";
import KHOAO from "../KHOAO/KHOAO";
import { useReactToPrint } from "react-to-print";
import DrawComponent from "../../../kinhdoanh/ycsxmanager/DrawComponent/DrawComponent";
import { AgGridReact } from "ag-grid-react";
/* import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; */
import AGTable from "../../../../components/DataTable/AGTable";
import QUICKPLAN2 from "../QUICKPLAN/QUICKPLAN2";
const PLAN_DATATB = () => {
  const myComponentRef = useRef();
  const dataGridRef = useRef<any>(null);
  const datatbTotalRow = useRef(0);
  const [showQuickPlan, setShowQuickPlan] = useState(false);
  const [ycsxlistrender, setYCSXListRender] = useState<Array<ReactElement>>();
  const [showkhoao, setShowKhoAo] = useState(false);
  const [maxLieu, setMaxLieu] = useState(12);
  const [chithidatatable, setChiThiDataTable] = useState<QLSXCHITHIDATA[]>([]);
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
  const [showhideM, setShowHideM] = useState(false);
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const clickedRow = useRef<any>(null);
  const [showChiThi, setShowChiThi] = useState(false);
  const [showChiThi2, setShowChiThi2] = useState(false);
  const [showBV, setShowBV] = useState(false);
  const rowStyle = { backgroundColor: 'transparent', height: '20px' };
  const getRowStyle = (params: any) => {
    //return { backgroundColor: 'white', fontSize: '0.6rem' };
    if (Number(params.data?.PLAN_EQ.substring(2, 4)) % 2 === 0) {
      return { backgroundColor: 'white', fontSize: '0.6rem' };
    }
    else {
      return { backgroundColor: '#d3d7cf', fontSize: '0.6rem' };
    }
  };
  const onSelectionChanged = useCallback(() => {
    const selectedrow = gridRef.current!.api.getSelectedRows();
    qlsxplandatafilter.current = selectedrow;
  }, []);
  /*  function setIdText(id: string, value: string | number | undefined) {
     document.getElementById(id)!.textContent =
       value == undefined ? "undefined" : value + "";
   } */
  const setHeaderHeight = useCallback((value?: number) => {
    gridRef.current!.api.setGridOption("headerHeight", value);
    //setIdText("headerHeight", value);
  }, []);
  const clearSelectedRows = useCallback(() => {
    gridRef.current!.api.deselectAll();
    qlsxplandatafilter.current = [];
  }, []);
  const gridRef = useRef<AgGridReact<QLSXPLANDATA>>(null);
  const defaultColDef = useMemo(() => {
    return {
      initialWidth: 100,
      wrapHeaderText: true,
      autoHeaderHeight: false,
      editable: false,
      floatingFilter: true,
      filter: true,
      headerCheckboxSelectionFilteredOnly: true,
    };
  }, []);
  const clearSelection = () => {
    if (dataGridRef.current) {
      dataGridRef.current.instance.clearSelection();
      qlsxplandatafilter.current = [];
      console.log(dataGridRef.current);
    }
  };
  const ycsxprintref = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => ycsxprintref.current,
  });
  const renderBanVe2 = (ycsxlist: QLSXPLANDATA[]) => {
    return ycsxlist.map((element, index) => (
      <DrawComponent
        key={index}
        G_CODE={element.G_CODE}
        PDBV={element.PDBV}
        PROD_REQUEST_NO={element.PROD_REQUEST_NO}
        PDBV_EMPL={element.PDBV_EMPL}
        PDBV_DATE={element.PDBV_DATE}
      />
    ));
  };
  const getMachineList = async () => {
    setMachine_List(await f_getMachineListData());
  };
  const column_plandatatable = [
    {
      field: "PLAN_FACTORY",
      headerName: "FACTORY",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 80,
      editable: false,
    },
    {
      field: "PLAN_DATE",
      headerName: "PLAN_DATE",
      width: 70,
      editable: false,
    },
    {
      field: "PLAN_ID",
      headerName: "PLAN_ID",
      width: 70,
      editable: false,
      resizable: true,
    },
    {
      field: "G_CODE",
      headerName: "G_CODE",
      width: 70,
      editable: false,
      resizable: true,
    },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 120,
      editable: false,
      resizable: true,
    },
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
      field: "PLAN_EQ", headerName: "PLAN_EQ", width: 50, editable: true, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {params.data.PLAN_EQ}
          </span>
        );
      }
    },
    {
      field: "PLAN_ORDER", headerName: "STT", width: 40, editable: true, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "purple", fontWeight: "normarl" }}>
            {params.data.PLAN_ORDER}
          </span>
        );
      }
    },
    {
      field: "PROCESS_NUMBER",
      headerName: "PR_NUM",
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
    { field: "STEP", headerName: "STEP", width: 45, editable: true, },
    {
      field: "PLAN_QTY",
      headerName: "PLAN_QTY",
      width: 60,
      editable: true,
      cellRenderer: (params: any) => {
        if (params.data.PLAN_QTY === 0) {
          return <span style={{ color: "red", fontWeight: "bold" }}>NG</span>;
        } else {
          return (
            <span style={{ color: "gray", fontWeight: "bold" }}>
              {params.data.PLAN_QTY?.toLocaleString("en", "US")}
            </span>
          );
        }
      },
    },
    {
      field: "KETQUASX",
      headerName: "RESULT_QTY",
      width: 75,
      cellRenderer: (params: any) => {
        if (params.data.KETQUASX !== null) {
          return (
            <span style={{ color: "#F117FF", fontWeight: "bold" }}>
              {params.data.KETQUASX?.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <span>0</span>;
        }
      },
    },
    {
      field: "ACHIVEMENT_RATE",
      headerName: "ACHIV_RATE",
      width: 75,
      cellRenderer: (params: any) => {
        if (params.data.ACHIVEMENT_RATE !== undefined) {
          if (params.data.ACHIVEMENT_RATE === 100) {
            return (
              <span style={{ color: "green", fontWeight: "bold" }}>
                {params.data.ACHIVEMENT_RATE?.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
                %
              </span>
            );
          } else {
            return (
              <span style={{ color: "red", fontWeight: "bold" }}>
                {params.data.ACHIVEMENT_RATE?.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
                %
              </span>
            );
          }
        } else {
          return <span>0</span>;
        }
      },
    },
    {
      field: "EQ_STATUS",
      headerName: "EQ_STATUS",
      width: 120,
      cellRenderer: (params: any) => {
        if (params.data.EQ_STATUS === "KTST-KSX") {
          return <span style={{ color: "green" }}>KTST-KSX</span>;
        } else if (params.data.EQ_STATUS === "Đang setting") {
          return (
            <span style={{ color: "orange" }}>
              Đang Setting{" "}
              <img
                alt='running'
                src='/setting3.gif'
                width={10}
                height={10}
              ></img>
            </span>
          );
        } else if (params.data.EQ_STATUS === "Đang Run") {
          return (
            <span style={{ color: "blue" }}>
              Đang Run{" "}
              <img
                alt='running'
                src='/blink.gif'
                width={40}
                height={15}
              ></img>
            </span>
          );
        } else if (params.data.EQ_STATUS === "Chạy xong") {
          return (
            <span style={{ color: "green", fontWeight: "bold" }}>
              Chạy xong
            </span>
          );
        } else {
          return <span style={{ color: "red" }}>Chưa chạy</span>;
        }
      },
    },
    {
      field: "SETTING_START_TIME", headerName: "SETTING_START", width: 60, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "normarl" }}>
            {params.data.SETTING_START_TIME}
          </span>
        );
      }
    },
    {
      field: "MASS_START_TIME", headerName: "MASS_START", width: 60, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "normarl" }}>
            {params.data.MASS_START_TIME}
          </span>
        );
      }
    },
    {
      field: "MASS_END_TIME", headerName: "MASS_END", width: 60, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "normarl" }}>
            {params.data.MASS_END_TIME}
          </span>
        );
      }
    },
    {
      field: "IS_SETTING", headerName: "IS_SETTING", width: 50, editable: true, cellRenderer: (params: any) => {
        if (params.data.IS_SETTING === 'Y')
          return (
            <span style={{ color: "blue", fontWeight: "bold" }}>
              {params.data.IS_SETTING}
            </span>
          );
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {params.data.IS_SETTING}
          </span>
        );
      }
    },
    {
      field: "XUATDAOFILM", headerName: "Xuất Dao", width: 80, cellRenderer: (params: any) => {
        if (params.data.XUATDAOFILM === "V") {
          return (
            <div
              style={{
                color: "white",
                fontWeight: "bold",
                height: "20px",
                width: "60px",
                backgroundImage: `linear-gradient(90deg, rgba(9,199,155,1) 0%, rgba(20,233,0,0.9920343137254902) 18%, rgba(79,228,23,1) 100%)`,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              V
            </div>
          );
        } else {
          return (
            <div
              style={{
                color: "white",
                fontWeight: "bold",
                height: "20px",
                width: "50px",
                backgroundImage: `linear-gradient(90deg, rgba(199,9,9,1) 0%, rgba(233,0,106,0.9920343137254902) 42%, rgba(246,101,158,1) 100%)`,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              N
            </div>
          );
        }
      }
    },
    {
      field: "DKXL", headerName: "ĐK Xuất liệu", width: 80, cellRenderer: (params: any) => {
        if (params.data.DKXL === "V") {
          return (
            <div
              style={{
                color: "white",
                fontWeight: "bold",
                height: "20px",
                width: "60px",
                backgroundImage: `linear-gradient(90deg, rgba(9,199,155,1) 0%, rgba(20,233,0,0.9920343137254902) 18%, rgba(79,228,23,1) 100%)`,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: "5px",
              }}
              onClick={() => {
                //console.log(params.data);
                setShowHideM(true);
              }}
            >
              V
            </div>
          );
        } else {
          return (
            <div
              style={{
                color: "white",
                fontWeight: "bold",
                height: "20px",
                width: "50px",
                backgroundImage: `linear-gradient(90deg, rgba(199,9,9,1) 0%, rgba(233,0,106,0.9920343137254902) 42%, rgba(246,101,158,1) 100%)`,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: "5px",
              }}
              onClick={() => {
                //console.log(params.data);
                setShowHideM(true);
              }}
            >
              N
            </div>
          );
        }
      }
    },
    {
      field: "MAIN_MATERIAL", headerName: "Xuất liệu", width: 80, cellRenderer: (params: any) => {
        if (params.data.MAIN_MATERIAL === "V") {
          return (
            <div
              style={{
                color: "white",
                fontWeight: "bold",
                height: "20px",
                width: "60px",
                backgroundImage: `linear-gradient(90deg, rgba(9,199,155,1) 0%, rgba(20,233,0,0.9920343137254902) 18%, rgba(79,228,23,1) 100%)`,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              V
            </div>
          );
        } else {
          return (
            <div
              style={{
                color: "white",
                fontWeight: "bold",
                height: "20px",
                width: "50px",
                backgroundImage: `linear-gradient(90deg, rgba(199,9,9,1) 0%, rgba(233,0,106,0.9920343137254902) 42%, rgba(246,101,158,1) 100%)`,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              N
            </div>
          );
        }
      }
    },
    {
      field: "INT_TEM", headerName: "In Tem", width: 60, cellRenderer: (params: any) => {
        if (params.data.INT_TEM === "V") {
          return (
            <div
              style={{
                color: "white",
                fontWeight: "bold",
                height: "20px",
                width: "60px",
                backgroundImage: `linear-gradient(90deg, rgba(9,199,155,1) 0%, rgba(20,233,0,0.9920343137254902) 18%, rgba(79,228,23,1) 100%)`,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              V
            </div>
          );
        } else {
          return (
            <div
              style={{
                color: "white",
                fontWeight: "bold",
                height: "20px",
                width: "50px",
                backgroundImage: `linear-gradient(90deg, rgba(199,9,9,1) 0%, rgba(233,0,106,0.9920343137254902) 42%, rgba(246,101,158,1) 100%)`,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              N
            </div>
          );
        }
      }
    },
    {
      field: "CHOTBC", headerName: "Chốt báo cáo", width: 80, cellRenderer: (params: any) => {
        if (params.data.CHOTBC === "V") {
          return (
            <div
              style={{
                color: "white",
                fontWeight: "bold",
                height: "20px",
                width: "60px",
                backgroundImage: `linear-gradient(90deg, rgba(9,199,155,1) 0%, rgba(20,233,0,0.9920343137254902) 18%, rgba(79,228,23,1) 100%)`,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              V
            </div>
          );
        } else {
          return (
            <div
              style={{
                color: "white",
                fontWeight: "bold",
                height: "20px",
                width: "50px",
                backgroundImage: `linear-gradient(90deg, rgba(199,9,9,1) 0%, rgba(233,0,106,0.9920343137254902) 42%, rgba(246,101,158,1) 100%)`,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              N
            </div>
          );
        }
      }
    },
    {
      field: "AT_LEADTIME",
      headerName: "AT_LEADTIME",
      width: 90,
      editable: false,
      hide: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#4178D2", fontWeight: "bold" }}>
            {params.data.AT_LEADTIME.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 })}
          </span>
        );
      }
    },
    {
      field: "ACC_TIME",
      headerName: "ACC_TIME",
      width: 80,
      editable: false,
      hide: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#4178D2", fontWeight: "bold" }}>
            {params.data.ACC_TIME.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 })}
          </span>
        );
      }
    },
    {
      field: "KQ_SX_TAM",
      headerName: "CURRENT_RESULT",
      width: 120,
      editable: false,
      hide: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#3394D8", fontWeight: "bold" }}>
            {params.data.KQ_SX_TAM?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: "REQ_DF",
      headerName: "REQ DAO FILM",
      width: 100,
      editable: false,
      hide: false,
      cellRenderer: (params: any) => {
        if (params.data.REQ_DF === "R") {
          return (
            <span style={{ color: "red", fontWeight: "normarl" }}>
              REQUESTED
            </span>
          );
        } else {
          return (
            <span style={{ color: "green", fontWeight: "normarl" }}>
              COMPLETED
            </span>
          );
        }
      }
    },
    {
      field: "PROD_REQUEST_NO",
      headerName: "YCSX NO",
      width: 80,
      editable: false,
      hide: false,
    },
    {
      field: "PROD_REQUEST_DATE",
      headerName: "YCSX DATE",
      width: 80,
      editable: false,
    },
    {
      field: "PROD_REQUEST_QTY",
      headerName: "YCSX QTY",
      width: 80,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.PROD_REQUEST_QTY.toLocaleString("en", "US")}
          </span>
        );
      },
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
    {
      field: "CD1",
      headerName: "CD1",
      width: 50,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data?.CD1.toLocaleString("en", "US")}
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
            {params.data?.CD2.toLocaleString("en", "US")}
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
            {params.data?.CD3.toLocaleString("en", "US")}
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
            {params.data?.CD4.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD1",
      headerName: "TCD1",
      width: 55,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            {params.data?.TON_CD1.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD2",
      headerName: "TCD2",
      width: 55,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            {params.data?.TON_CD2.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD3",
      headerName: "TCD3",
      width: 55,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            {params.data?.TON_CD3.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD4",
      headerName: "TCD4",
      width: 55,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            {params.data?.TON_CD4.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    { field: "EQ1", headerName: "EQ1", width: 40, editable: false },
    { field: "EQ2", headerName: "EQ2", width: 40, editable: false },
    { field: "EQ3", headerName: "EQ3", width: 40, editable: false },
    { field: "EQ4", headerName: "EQ4", width: 40, editable: false },
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
  const [columns, setColumns] = useState<Array<any>>(column_plandatatable);
  const [readyRender, setReadyRender] = useState(false);
  const userData: UserData | undefined = useSelector((state: RootState) => state.totalSlice.userData);
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [factory, setFactory] = useState("NM1");
  const [machine, setMachine] = useState("ALL");
  const [plandatatable, setPlanDataTable] = useState<QLSXPLANDATA[]>([]);
  const [summarydata, setSummaryData] = useState<QLSXPLANDATA>({
    id: -1,
    PLAN_ID: "",
    PLAN_DATE: "",
    PROD_REQUEST_NO: "",
    PLAN_QTY: 0,
    PLAN_EQ: "",
    PLAN_FACTORY: "",
    PLAN_LEADTIME: 0,
    INS_EMPL: "",
    INS_DATE: "",
    UPD_EMPL: "",
    UPD_DATE: "",
    G_CODE: "",
    G_NAME: "",
    G_NAME_KD: "",
    PROD_REQUEST_DATE: "",
    PROD_REQUEST_QTY: 0,
    STEP: 0,
    PLAN_ORDER: "",
    PROCESS_NUMBER: 0,
    KQ_SX_TAM: 0,
    KETQUASX: 0,
    ACHIVEMENT_RATE: 0,
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
    XUATDAOFILM: "",
    EQ_STATUS: "",
    MAIN_MATERIAL: "",
    INT_TEM: "",
    CHOTBC: "",
    DKXL: "",
    NEXT_PLAN_ID: "",
    CD3: 0,
    CD4: 0,
    EQ3: "",
    EQ4: "",
    LOSS_SETTING3: 0,
    LOSS_SETTING4: 0,
    LOSS_SX3: 0,
    LOSS_SX4: 0,
    Setting3: 0,
    Setting4: 0,
    Step3: 0,
    Step4: 0,
    TON_CD3: 0,
    TON_CD4: 0,
    UPH3: 0,
    UPH4: 0,
    OLD_PLAN_QTY: 0,
  });
  const [chithilistrender2, setChiThiListRender2] = useState<ReactElement>();
  const [chithilistrender, setChiThiListRender] =
    useState<Array<ReactElement>>();
  const qlsxplandatafilter = useRef<QLSXPLANDATA[]>([]);
  const qlsxchithidatafilter = useRef<QLSXCHITHIDATA[]>([]);
  const handle_DeleteLineCHITHI = async () => {
    let kq = await f_deleteChiThiMaterialLine(qlsxchithidatafilter.current, chithidatatable);
    setChiThiDataTable(kq);
  };
  const hanlde_SaveChiThi = async () => {
    let err_code: string = await f_saveChiThiMaterialTable(selectedPlan, chithidatatable);
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
    setPlanDataTable(await f_loadQLSXPLANDATA(fromdate, machine, factory));
  };
  const handleDangKyXuatLieu = async () => {
    let err_code: string = await f_handleDangKyXuatLieu(selectedPlan, factory, chithidatatable);
    if (err_code === '0') {
      Swal.fire("Thông báo", "Đăng ký xuất liệu thành công!", "success");
    }
    else {
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
        Swal.fire({
          title: "Đăng ký xuất liệu kho thật",
          text: "Đang đăng ký xuất liệu, hay chờ cho tới khi hoàn thành",
          icon: "info",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
          showConfirmButton: false,
        });
        if (selectedPlan !== undefined) {
          await hanlde_SaveChiThi();
          await handleDangKyXuatLieu();
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
  const loadQLSXPlan = async (plan_date: string) => {
    let loadeddata: QLSXPLANDATA[] = [];
    loadeddata = await f_loadQLSXPLANDATA(plan_date, machine, factory);
    let temp_plan_data: QLSXPLANDATA = {
      id: -1,
      PLAN_ID: "",
      PLAN_DATE: "",
      PROD_REQUEST_NO: "",
      PLAN_QTY: 0,
      PLAN_EQ: "",
      PLAN_FACTORY: "",
      PLAN_LEADTIME: 0,
      INS_EMPL: "",
      INS_DATE: "",
      UPD_EMPL: "",
      UPD_DATE: "",
      G_CODE: "",
      G_NAME: "",
      G_NAME_KD: "",
      PROD_REQUEST_DATE: "",
      PROD_REQUEST_QTY: 0,
      STEP: 0,
      PLAN_ORDER: "",
      PROCESS_NUMBER: 0,
      KQ_SX_TAM: 0,
      KETQUASX: 0,
      ACHIVEMENT_RATE: 0,
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
      XUATDAOFILM: "",
      EQ_STATUS: "",
      MAIN_MATERIAL: "",
      INT_TEM: "",
      CHOTBC: "",
      DKXL: "",
      NEXT_PLAN_ID: "",
      CD3: 0,
      CD4: 0,
      EQ3: "",
      EQ4: "",
      LOSS_SETTING3: 0,
      LOSS_SETTING4: 0,
      LOSS_SX3: 0,
      LOSS_SX4: 0,
      Setting3: 0,
      Setting4: 0,
      Step3: 0,
      Step4: 0,
      TON_CD3: 0,
      TON_CD4: 0,
      UPH3: 0,
      UPH4: 0,
      OLD_PLAN_QTY: 0,
      ACC_TIME: 0,
      AT_LEADTIME: 0,
      CAVITY: 1,
      MASS_END_TIME: '',
      MASS_START_TIME: '',
      PD: 1,
      PDBV: 'N',
      REQ_DF: 'R',
      SETTING_START_TIME: ''
    };
    for (let i = 0; i < loadeddata.length; i++) {
      temp_plan_data.PLAN_QTY += loadeddata[i].PLAN_QTY;
      temp_plan_data.KETQUASX += loadeddata[i].KETQUASX;
    }
    temp_plan_data.ACHIVEMENT_RATE = (temp_plan_data.KETQUASX / temp_plan_data.PLAN_QTY) * 100;
    setSummaryData(temp_plan_data);
    setPlanDataTable(loadeddata);
    datatbTotalRow.current = loadeddata.length;
    setReadyRender(true);
    setisLoading(false);
    clearSelection();
    clearSelectedRows();
    if (!showhideM)
      Swal.fire("Thông báo", "Đã load: " + loadeddata.length + " dòng", "success");
    f_updatePlanOrder(fromdate);
  };
  const handle_movePlan = async () => {
    let err_code: string = await f_handle_movePlan(qlsxplandatafilter.current, todate);
    if (err_code !== "0") {
      Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
    }
    else {
      Swal.fire('Thông báo', 'Move plan thành công', 'success');
    }
    loadQLSXPlan(fromdate);
  };
  const handleConfirmMovePlan = () => {
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
        Swal.fire("Tiến hành chuyển ngày PLAN", "Đang ngày plan", "success");
        checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], handle_movePlan);
      }
    });
  };
  const handleConfirmDeletePlan = () => {
    Swal.fire({
      title: "Chắc chắn muốn xóa plan đã chọn ?",
      text: "Sẽ bắt đầu xóa plan đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn chuyển!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành xóa PLAN", "Đang xóa plan", "success");
        checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], handle_DeletePlan);
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
      if (selectedPlanTable[i].XUATDAOFILM !== "V" && selectedPlanTable[i].MAIN_MATERIAL !== "V" && selectedPlanTable[i].INT_TEM !== "V" && selectedPlanTable[i].CHOTBC !== "V" && !isOnOutKhoAo) {
        await generalQuery("deletePlanQLSX", {
          PLAN_ID: selectedPlanTable[i].PLAN_ID,
        })
          .then((response) => {
            //console.log(response.data.tk_status);
            if (response.data.tk_status !== "NG") {
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        err_code += `${selectedPlanTable[i].PLAN_ID}: Đã xuất dao, xuất liệu hoặc in tem hoặc chốt báo cáo, ko xóa được !`
      }
    }
    if (err_code !== "0") {
      Swal.fire("Thông báo", "Có lỗi !" + err_code, "error");
    } else {
      Swal.fire("Thông báo", "Xóa PLAN thành công", "success");
      loadQLSXPlan(fromdate);
    }
  }
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
  const handle_xuatdao_sample = async () => {
    let err_code: string = await f_handle_xuatdao_sample(selectedPlan);
    if (err_code === '0') {
      Swal.fire('Thông báo', 'Xuất dao ảo thành công', 'success');
    }
    else {
      Swal.fire('Thông báo', err_code, 'error');
    }
  };
  const handle_xuatlieu_sample = async () => {
    let err_code: string = await f_handle_xuatlieu_sample(selectedPlan);
    if (err_code === '0') {
      Swal.fire('Thông báo', 'Xuất liệu ảo thành công', 'success');
    }
    else {
      Swal.fire('Thông báo', err_code, 'error');
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
    let err_code: string = "0";
    err_code = await f_updateBatchPlan(qlsxplandatafilter.current);
    if (err_code !== "0") {
      Swal.fire("Thông báo", "Có lỗi !" + err_code, "error");
    } else {
      Swal.fire("Thông báo", "Lưu PLAN thành công", "success");
      loadQLSXPlan(fromdate);
    }
  };
  const handleClick = () => {
    if (myComponentRef.current) {
      //myComponentRef.current?.handleInternalClick();
    }
  };
  const planMaterialTableAG = useMemo(() =>
    <AGTable
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
        </div>}
      columns={column_planmaterialtable}
      data={chithidatatable}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        clickedRow.current = params.data;
        //console.log(e.data) 
      }} onSelectionChange={(params: any) => {
        //console.log(params)
        //setSelectedRows(params!.api.getSelectedRows()[0]);
        //console.log(e!.api.getSelectedRows())
        qlsxchithidatafilter.current = params!.api.getSelectedRows();
      }}
    />
    , [chithidatatable]);
  const planDataTableAG = useMemo(() => {
    return (
      <div className="ag-theme-quartz"
        style={{ height: '100%', }}
      >
        <AgGridReact
          rowData={plandatatable}
          columnDefs={columns}
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
          onSelectionChanged={onSelectionChanged}
          onRowClicked={async (params: any) => {
            //setClickedRows(params.data)
            //console.log(params.data)
            clickedRow.current = params.data;
            setSelectedPlan(params.data);
            setChiThiDataTable(await f_handleGetChiThiTable(params.data));
          }}
          onRowDoubleClicked={
            (params: any) => {
              setShowHideM(true);
            }
          }
          onCellEditingStopped={(params: any) => {
            //console.log(params)
          }}
        />
      </div>
    )
  }, [plandatatable])
  useEffect(() => {
    getMachineList();
    return () => {
    };
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className='lichsuplanTable'>
      <div className='tracuuDataInspection'>
        <div className='tracuuYCSXTable'>
          <div className="toolbar">
            <div className='header'>
              <div className='forminput'>
                <div className='forminputcolumn'>
                  <label>
                    <b>PLAN DATE</b>
                    <input
                      type='date'
                      value={fromdate.slice(0, 10)}
                      onChange={(e) => setFromDate(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>FACTORY:</b>
                    <select
                      name='phanloai'
                      value={factory}
                      onChange={(e) => {
                        setFactory(e.target.value);
                      }}
                    >
                      <option value='NM1'>NM1</option>
                      <option value='NM2'>NM2</option>
                    </select>
                  </label>
                </div>
                <div className='forminputcolumn'>
                  <label>
                    <b>MACHINE:</b>
                    <select
                      name='machine2'
                      value={machine}
                      onChange={(e) => {
                        setMachine(e.target.value);
                      }}
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
                    <b>MOVE TO DATE</b>
                    <input
                      type='date'
                      value={todate.slice(0, 10)}
                      onChange={(e) => setToDate(e.target.value)}
                    ></input>
                  </label>
                </div>
                <div className='forminputcolumn'>
                  <button
                    className='tranhatky'
                    onClick={() => {
                      setShowQuickPlan(!showQuickPlan);
                    }}
                  >
                    QUICK PLAN
                  </button>
                  <button
                    className='tranhatky'
                    onClick={() => {
                      setisLoading(true);
                      setReadyRender(false);
                      loadQLSXPlan(fromdate);
                      //updatePlanOrder();
                    }}
                  >
                    Tra PLAN
                  </button>
                  <button
                    className='tranhatky'
                    onClick={() => {
                      handleConfirmMovePlan();
                    }}
                  >
                    MOVE PLAN
                  </button>
                  <button
                    className='deleteplanbutton'
                    onClick={() => {
                      handleConfirmDeletePlan();
                    }}
                  >
                    DELETE PLAN
                  </button>
                </div>
              </div>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  SaveExcel(plandatatable, "PlanDataTable");
                }}
              >
                <AiFillFileExcel color="green" size={15} />
                SAVE
              </IconButton>
              <IconButton
                className='buttonIcon'
                onClick={() => {
                  checkBP(
                    userData,
                    ["QLSX"],
                    ["ALL"],
                    ["ALL"],
                    handle_UpdatePlan
                  );
                }}
              >
                <AiFillSave color='blue' size={20} />
                Lưu PLAN
              </IconButton>
              <IconButton
                className='buttonIcon'
                onClick={async () => {
                  if (qlsxplandatafilter.current.length > 0) {
                    if (userData?.EMPL_NO !== "NHU1903") {
                      checkBP(
                        userData,
                        ["QLSX"],
                        ["ALL"],
                        ["ALL"],
                        async () => {
                          await handle_UpdatePlan();
                          setShowChiThi(true);
                          setChiThiListRender(
                            renderChiThi(qlsxplandatafilter.current, myComponentRef)
                          );
                        }
                      );
                    }
                    else {
                      setShowChiThi(true);
                      setChiThiListRender(
                        renderChiThi(qlsxplandatafilter.current, myComponentRef)
                      );
                    }
                    //console.log(ycsxdatatablefilter);
                  } else {
                    setShowChiThi(false);
                    Swal.fire(
                      "Thông báo",
                      "Chọn ít nhất 1 Plan để in",
                      "error"
                    );
                  }
                }}
              >
                <AiOutlinePrinter color='#0066ff' size={15} />
                Print Chỉ Thị
              </IconButton>
              <IconButton
                className='buttonIcon'
                onClick={async () => {
                  let ycsx_number: number = [
                    ...new Set(
                      qlsxplandatafilter.current.map(
                        (e: QLSXPLANDATA, index: number) => {
                          return e.PROD_REQUEST_NO;
                        }
                      )
                    ),
                  ].length;
                  // console.log("ycsx_number", ycsx_number);
                  if (
                    qlsxplandatafilter.current !== undefined &&
                    qlsxplandatafilter.current.length > 0
                  ) {
                    if (
                      qlsxplandatafilter.current[0].FACTORY === null ||
                      qlsxplandatafilter.current[0].EQ1 === null ||
                      qlsxplandatafilter.current[0].EQ2 === null ||
                      qlsxplandatafilter.current[0].Setting1 === null ||
                      qlsxplandatafilter.current[0].Setting2 === null ||
                      qlsxplandatafilter.current[0].UPH1 === null ||
                      qlsxplandatafilter.current[0].UPH2 === null ||
                      qlsxplandatafilter.current[0].Step1 === null ||
                      qlsxplandatafilter.current[0].Step1 === null ||
                      qlsxplandatafilter.current[0].LOSS_SX1 === null ||
                      qlsxplandatafilter.current[0].LOSS_SX2 === null ||
                      qlsxplandatafilter.current[0].LOSS_SETTING1 === null ||
                      qlsxplandatafilter.current[0].LOSS_SETTING2 === null
                    ) {
                      Swal.fire(
                        "Thông báo",
                        "Nhập data định mức trước khi chỉ thị",
                        "error"
                      );
                    } else {
                      if (ycsx_number === 1) {
                        let chithimain: QLSXPLANDATA[] =
                          qlsxplandatafilter.current.filter(
                            (element: QLSXPLANDATA, index: number) =>
                              element.STEP === 0
                          );
                        if (chithimain.length === 1) {                         
                          
                          if (userData?.EMPL_NO !== "NHU1903") 
                          {
                            await handle_UpdatePlan();
                            setShowChiThi2(true);
                            setChiThiListRender2(
                              renderChiThi2(qlsxplandatafilter.current, myComponentRef)
                            );
                          }
                          else
                          {
                            await handle_UpdatePlan();
                            setShowChiThi2(true);
                            setChiThiListRender2(
                              renderChiThi2(qlsxplandatafilter.current, myComponentRef)
                            );
                          }

                          
                        } else if (chithimain.length === 0) {
                          Swal.fire(
                            "Thông báo",
                            "Chưa có chỉ thị chính (B0)",
                            "error"
                          );
                        } else {
                          Swal.fire(
                            "Thông báo",
                            "Chỉ được chọn 1 chỉ thị B0",
                            "error"
                          );
                        }
                      } else {
                        Swal.fire(
                          "Thông báo",
                          "Chỉ được chọn các chỉ thị của 1 YCSX",
                          "error"
                        );
                      }
                    }
                    //console.log(ycsxdatatablefilter);
                  } else {
                    setShowChiThi2(false);
                    Swal.fire(
                      "Thông báo",
                      "Chọn ít nhất 1 Plan để in",
                      "error"
                    );
                  }
                }}
              >
                <AiOutlinePrinter color='#0066ff' size={15} />
                Print Chỉ Thị Combo
              </IconButton>
              <IconButton
                className='buttonIcon'
                onClick={() => {
                  if (qlsxplandatafilter.current.length > 0) {
                    setShowBV(!showBV);
                    setYCSXListRender(
                      renderBanVe2(qlsxplandatafilter.current)
                    );
                  } else {
                    Swal.fire(
                      "Thông báo",
                      "Chọn ít nhất 1 YCSX để in",
                      "error"
                    );
                  }
                }}
              >
                <AiOutlinePrinter color='#ff751a' size={15} />
                Print Bản Vẽ
              </IconButton>
            </div>
          </div>
          {planDataTableAG}
        </div>
      </div>
      {showhideM && (
        <div className='listlieuchithi'>
          <div className='chithiheader'>
            <Button
              onClick={() => {
                setShowHideM(false);
                loadQLSXPlan(fromdate);
              }}
              size='small'
            >
              Close
            </Button>
            <span style={{ fontSize: 20, fontWeight: "bold", color: "red" }}>
              {selectedPlan?.PLAN_ID}
            </span>{" "}
            ___
            <span style={{ fontSize: 20, fontWeight: "bold", color: "blue" }}>
              {selectedPlan?.G_NAME}
            </span>
            <span style={{ fontSize: 20, fontWeight: "bold", color: "green" }}>
              ___PD:
              {selectedPlan.PD}
            </span>
            <span style={{ fontSize: 20, fontWeight: "bold", color: "green" }}>
              ___CAVITY:
              {selectedPlan.CAVITY}
            </span>
            <span style={{ fontSize: 20, fontWeight: "bold", color: "green" }}>
              ___PLAN_QTY:
              {selectedPlan?.PLAN_QTY.toLocaleString("en-US")}
            </span>
          </div>
          {planMaterialTableAG}
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
                Swal.fire("Thông báo", "Đã set lại max dòng", "success");
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
                Swal.fire("Thông báo", "Đã set lại max dòng", "success");
              }}
            >
              Set dòng
            </button>
            <button
              onClick={() => {
                setChiThiListRender2(renderChiThi2(qlsxplandatafilter.current, myComponentRef));
              }}
            >
              Render Chỉ Thị 2
            </button>
            <button onClick={() => {
              handleClick();
              handlePrint();
            }}>Print Chỉ Thị</button>
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
      {showBV && (
        <div className='printycsxpage'>
          <div className='buttongroup'>
            <Button
              onClick={() => {
                setYCSXListRender(renderBanVe2(qlsxplandatafilter.current));
              }}
            >
              Render Bản Vẽ
            </Button>
            <Button onClick={handlePrint}>Print Bản Vẽ</Button>
            <Button
              onClick={() => {
                setShowBV(!showBV);
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
      {
        showQuickPlan && (
          <div className="quickplandiv">
            <QUICKPLAN2 />
          </div>
        )
      }
    </div>
  );
};
export default PLAN_DATATB;
