import {
  Button,
  IconButton,
} from "@mui/material";
import moment from "moment";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  AiFillFileExcel,
  AiFillSave,
  AiOutlineArrowRight,
  AiOutlineBarcode,
  AiOutlinePrinter,
} from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode, getCompany } from "../../../../api/Api";
import {
  checkBP,
  SaveExcel,
  zeroPad,
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
import {
  checkEQvsPROCESS,
  getCurrentDMToSave,
  renderBanVe,
  renderChiThi,
  renderChiThi2,
  renderYCSX,
} from "../Machine/MACHINE";
import { useReactToPrint } from "react-to-print";
import DrawComponent from "../../../kinhdoanh/ycsxmanager/DrawComponent/DrawComponent";
import QUICKPLAN from "../QUICKPLAN/QUICKPLAN";
import { AgGridReact } from "ag-grid-react";
/* import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; */
import AGTable from "../../../../components/DataTable/AGTable";
const PLAN_DATATB = () => {
  const myComponentRef = useRef();
  const dataGridRef = useRef<any>(null);
  const datatbTotalRow = useRef(0);
  const [showQuickPlan, setShowQuickPlan] = useState(false);
  const [ycsxlistrender, setYCSXListRender] = useState<Array<ReactElement>>();
  const [showkhoao, setShowKhoAo] = useState(false);
  const [maxLieu, setMaxLieu] = useState(12);
  const [chithidatatable, setChiThiDataTable] = useState<QLSXCHITHIDATA[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<QLSXPLANDATA>();
  const [currentPlanPD, setCurrentPlanPD] = useState(0);
  const [currentPlanCAVITY, setCurrentPlanCAVITY] = useState(0);
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
          loadeddata.push(
            { EQ_NAME: "ALL" },
            { EQ_NAME: "NO" },
            { EQ_NAME: "NA" }
          );
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
  const handle_DeleteLineCHITHI = () => {
    if (qlsxchithidatafilter.current.length > 0) {
      let datafilter = [...chithidatatable];
      for (let i = 0; i < qlsxchithidatafilter.current.length; i++) {
        for (let j = 0; j < datafilter.length; j++) {
          if (
            qlsxchithidatafilter.current[i].CHITHI_ID ===
            datafilter[j].CHITHI_ID
          ) {
            datafilter.splice(j, 1);
          }
        }
      }
      setChiThiDataTable(datafilter);
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất một dòng để xóa", "error");
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
        loadQLSXPlan(fromdate);
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
        : selectedPlan?.PROCESS_NUMBER,
      selectedPlan?.IS_SETTING ?? 'Y'
    );
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
        FACTORY: factory,
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
      loadQLSXPlan(fromdate);
    } else {
      Swal.fire("Thông báo", "Cần đăng ký ít nhất 1 met lòng");
    }
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
  const loadQLSXPlan = (plan_date: string) => {
    //console.log(todate);
    generalQuery("getqlsxplan2", {
      PLAN_DATE: plan_date,
      MACHINE: machine,
      FACTORY: factory,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: QLSXPLANDATA, index: number) => {
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
                ORG_LOSS_KT: getCompany() === 'CMS' ? element.LOSS_KT : 0,
                LOSS_KT: getCompany()==='CMS'? ((element?.LOSS_KT ?? 0) > 5 ? 5 : element.LOSS_KT ?? 0) : 0,
                G_NAME: getAuditMode() == 0 ? element?.G_NAME : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME : 'TEM_NOI_BO',
                G_NAME_KD: getAuditMode() == 0 ? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
                EQ_STATUS:
                  element.EQ_STATUS === "B"
                    ? "Đang setting"
                    : element.EQ_STATUS === "M"
                      ? "Đang Run"
                      : element.EQ_STATUS === "K"
                        ? "Chạy xong"
                        : element.EQ_STATUS === "K"
                          ? "KTST-KSX"
                          : "Chưa chạy",
                ACHIVEMENT_RATE: (element.KETQUASX / element.PLAN_QTY) * 100,
                CD1: element.CD1 === null ? 0 : element.CD1,
                CD2: element.CD2 === null ? 0 : element.CD2,
                CD3: element.CD3 === null ? 0 : element.CD3,
                CD4: element.CD4 === null ? 0 : element.CD4,
                TON_CD1: temp_TCD1,
                TON_CD2: temp_TCD2,
                TON_CD3: temp_TCD3,
                TON_CD4: temp_TCD4,
                SETTING_START_TIME:
                  element.SETTING_START_TIME === null
                    ? "X"
                    : moment.utc(element.SETTING_START_TIME).format("HH:mm:ss"),
                MASS_START_TIME:
                  element.MASS_START_TIME === null
                    ? "X"
                    : moment.utc(element.MASS_START_TIME).format("HH:mm:ss"),
                MASS_END_TIME:
                  element.MASS_END_TIME === null
                    ? "X"
                    : moment.utc(element.MASS_END_TIME).format("HH:mm:ss"),
                /* TON_CD1: element.TON_CD1 === null ? 0: element.TON_CD1,
                  TON_CD2: element.TON_CD2 === null ? 0: element.TON_CD2,
                  TON_CD3: element.TON_CD3 === null ? 0: element.TON_CD3,
                  TON_CD4: element.TON_CD4 === null ? 0: element.TON_CD4, */
                id: index,
              };
            }
          );
          //console.log(loadeddata);
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
          temp_plan_data.ACHIVEMENT_RATE =
            (temp_plan_data.KETQUASX / temp_plan_data.PLAN_QTY) * 100;
          setSummaryData(temp_plan_data);
          setPlanDataTable(loadeddata);
          datatbTotalRow.current = loadeddata.length;
          setReadyRender(true);
          setisLoading(false);
          clearSelection();
          clearSelectedRows();
          if (!showhideM)
            Swal.fire(
              "Thông báo",
              "Đã load: " + response.data.data.length + " dòng",
              "success"
            );
          updatePlanOrder(fromdate);
        } else {
          setPlanDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_movePlan = async () => {
    if (qlsxplandatafilter.current.length > 0) {
      let err_code: string = "0";
      for (let i = 0; i < qlsxplandatafilter.current.length; i++) {
        let checkplansetting: boolean = false;
        await generalQuery("checkplansetting", {
          PLAN_ID: qlsxplandatafilter.current[i].PLAN_ID,
        })
          .then((response) => {
            //console.log(response.data);
            if (response.data.tk_status !== "NG") {
              checkplansetting = true;
            } else {
              checkplansetting = false;
            }
          })
          .catch((error) => {
            console.log(error);
          });
        if (!checkplansetting) {
          generalQuery("move_plan", {
            PLAN_ID: qlsxplandatafilter.current[i].PLAN_ID,
            PLAN_DATE: todate,
          })
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
              } else {
                err_code += "Lỗi: " + response.data.message + "\n";
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          err_code +=
            "Lỗi: PLAN_ID " +
            qlsxplandatafilter.current[i].PLAN_ID +
            " đã setting nên không di chuyển được sang ngày khác, phải chốt";
        }
      }
      if (err_code !== "0") {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
      loadQLSXPlan(fromdate);
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất một chỉ thị để di chuyển", "error");
    }
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
        /*  checkBP(
          userData?.EMPL_NO,
          userData?.MAINDEPTNAME,
          ["QLSX"],
          handle_movePlan
        ); */
        checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], handle_movePlan);
        //handle_movePlan();
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
      let isOnOutKhoAo: boolean =false;
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
            FINAL_LOSS_SX = (rowdata.LOSS_SX1 ?? 0) + (rowdata.LOSS_SX2 ?? 0) + (rowdata.LOSS_SX3 ?? 0) + (rowdata.LOSS_SX4 ?? 0) + (selectedPlan?.LOSS_KT ?? 0);;
          } else if (PROCESS_NUMBER === 2) {
            FINAL_LOSS_SX = (rowdata.LOSS_SX2 ?? 0) + (rowdata.LOSS_SX3 ?? 0) + (rowdata.LOSS_SX4 ?? 0) + (selectedPlan?.LOSS_KT ?? 0);;
          } else if (PROCESS_NUMBER === 3) {
            FINAL_LOSS_SX = (rowdata.LOSS_SX3 ?? 0) + (rowdata.LOSS_SX4 ?? 0) + (selectedPlan?.LOSS_KT ?? 0);;
          } else if (PROCESS_NUMBER === 4) {
            FINAL_LOSS_SX = (rowdata.LOSS_SX4 ?? 0) + (selectedPlan?.LOSS_KT ?? 0);;
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
          //console.log(LOSS_SX1)
          //console.log(LOSS_SETTING1)
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
        //console.log(response.data.tk_status);
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
              //console.log(response.data.tk_status);
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
        PROCESS_NUMBER: number = selectedPlan?.PROCESS_NUMBER ?? 1,
        FINAL_LOSS_SX: number = 0,
        FINAL_LOSS_SETTING: number = 0,
        M_MET_NEEDED: number = 0;
      await generalQuery("getcodefullinfo", {
        G_CODE: selectedPlan?.G_CODE,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            const rowdata = response.data.data[0];
            PD = rowdata.PD;
            CAVITY_NGANG = rowdata.G_C_R;
            CAVITY_DOC = rowdata.G_C;
            let calc_loss_setting: boolean = selectedPlan?.IS_SETTING === 'Y' ? true : false;
            if (PROCESS_NUMBER === 1) {
              FINAL_LOSS_SX = (rowdata.LOSS_SX1 ?? 0) + (rowdata.LOSS_SX2 ?? 0) + (rowdata.LOSS_SX3 ?? 0) + (rowdata.LOSS_SX4 ?? 0) + (selectedPlan?.LOSS_KT ?? 0);;
            } else if (PROCESS_NUMBER === 2) {
              FINAL_LOSS_SX = (rowdata.LOSS_SX2 ?? 0) + (rowdata.LOSS_SX3 ?? 0) + (rowdata.LOSS_SX4 ?? 0) + (selectedPlan?.LOSS_KT ?? 0);;
            } else if (PROCESS_NUMBER === 3) {
              FINAL_LOSS_SX = (rowdata.LOSS_SX3 ?? 0) + (rowdata.LOSS_SX4 ?? 0) + (selectedPlan?.LOSS_KT ?? 0);;
            } else if (PROCESS_NUMBER === 4) {
              FINAL_LOSS_SX = (rowdata.LOSS_SX4 ?? 0) + (selectedPlan?.LOSS_KT ?? 0);;
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
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành RESET liệu", "Đang RESET liệu", "success");
        handleResetChiThiTable();
      }
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
            FACTORY: factory,
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
            FACTORY: factory,
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
    let selectedPlanTable: QLSXPLANDATA[] = qlsxplandatafilter.current;
    //console.log(selectedPlanTable);
    let err_code: string = "0";
    for (let i = 0; i < qlsxplandatafilter.current.length; i++) {
      let check_NEXT_PLAN_ID: boolean = true;
      let checkPlanIdP500: boolean = false;
      await generalQuery("checkP500PlanID_mobile", {
        PLAN_ID: qlsxplandatafilter.current[i].PLAN_ID,
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
        let {NEEDED_QTY,FINAL_LOSS_SX,FINAL_LOSS_KT, FINAL_LOSS_SETTING} = await getCurrentDMToSave(qlsxplandatafilter.current[i]); 
      if (
        parseInt(qlsxplandatafilter.current[i].PROCESS_NUMBER.toString()) >=
        1 &&
        parseInt(qlsxplandatafilter.current[i].PROCESS_NUMBER.toString()) <=
        4 &&
        qlsxplandatafilter.current[i].PLAN_QTY !== 0 &&
        qlsxplandatafilter.current[i].PLAN_QTY <=
        qlsxplandatafilter.current[i].PROD_REQUEST_QTY &&
        qlsxplandatafilter.current[i].PLAN_ID !==
        qlsxplandatafilter.current[i].NEXT_PLAN_ID &&
        qlsxplandatafilter.current[i].CHOTBC !== "V" &&
        check_NEXT_PLAN_ID &&
        parseInt(qlsxplandatafilter.current[i].STEP.toString()) >= 0 &&
        parseInt(qlsxplandatafilter.current[i].STEP.toString()) <= 9 &&
        checkEQvsPROCESS(
          qlsxplandatafilter.current[i].EQ1,
          qlsxplandatafilter.current[i].EQ2,
          qlsxplandatafilter.current[i].EQ3,
          qlsxplandatafilter.current[i].EQ4
        ) >= qlsxplandatafilter.current[i].PROCESS_NUMBER &&
        checkPlanIdP500 === false
      ) {
        await generalQuery("updatePlanQLSX", {
          PLAN_ID: qlsxplandatafilter.current[i].PLAN_ID,
          STEP: qlsxplandatafilter.current[i].STEP,
          PLAN_QTY: qlsxplandatafilter.current[i].PLAN_QTY,
          OLD_PLAN_QTY: qlsxplandatafilter.current[i].PLAN_QTY,
          PLAN_LEADTIME: qlsxplandatafilter.current[i].PLAN_LEADTIME,
          PLAN_EQ: qlsxplandatafilter.current[i].PLAN_EQ,
          PLAN_ORDER: qlsxplandatafilter.current[i].PLAN_ORDER,
          PROCESS_NUMBER: qlsxplandatafilter.current[i].PROCESS_NUMBER,
          KETQUASX: qlsxplandatafilter.current[i].KETQUASX === null ?? 0,
          NEXT_PLAN_ID: qlsxplandatafilter.current[i].NEXT_PLAN_ID ?? "X",
          IS_SETTING: qlsxplandatafilter.current[i].IS_SETTING?.toUpperCase(),
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
        err_code += "_" + qlsxplandatafilter.current[i].G_NAME_KD + ":";
        if (
          !(
            parseInt(qlsxplandatafilter.current[i].PROCESS_NUMBER.toString()) >=
            1 &&
            parseInt(qlsxplandatafilter.current[i].PROCESS_NUMBER.toString()) <=
            4
          )
        ) {
          err_code += "_: Process number chưa đúng";
        } else if (qlsxplandatafilter.current[i].PLAN_QTY === 0) {
          err_code += "_: Số lượng chỉ thị =0";
        } else if (
          qlsxplandatafilter.current[i].PLAN_QTY >
          qlsxplandatafilter.current[i].PROD_REQUEST_QTY
        ) {
          err_code += "_: Số lượng chỉ thị lớn hơn số lượng yêu cầu sx";
        } else if (
          qlsxplandatafilter.current[i].PLAN_ID ===
          qlsxplandatafilter.current[i].NEXT_PLAN_ID
        ) {
          err_code += "_: NEXT_PLAN_ID không được giống PLAN_ID hiện tại";
        } else if (!check_NEXT_PLAN_ID) {
          err_code +=
            "_: NEXT_PLAN_ID không giống với PLAN_ID ở dòng tiếp theo";
        } else if (qlsxplandatafilter.current[i].CHOTBC === "V") {
          err_code +=
            "_: Chỉ thị đã chốt báo cáo, sẽ ko sửa được, thông tin các chỉ thị khác trong máy được lưu thành công";
        } else if (
          !(
            parseInt(qlsxplandatafilter.current[i].STEP.toString()) >= 0 &&
            parseInt(qlsxplandatafilter.current[i].STEP.toString()) <= 9
          )
        ) {
          err_code += "_: Hãy nhập STEP từ 0 -> 9";
        } else if (
          !(
            parseInt(qlsxplandatafilter.current[i].PROCESS_NUMBER.toString()) >=
            1 &&
            parseInt(qlsxplandatafilter.current[i].PROCESS_NUMBER.toString()) <=
            4
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
      loadQLSXPlan(fromdate);
    }
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
            onClick={() => {
              handleGetChiThiTable(
                selectedPlan?.PLAN_ID === undefined
                  ? "xxx"
                  : selectedPlan?.PLAN_ID,
                selectedPlan?.G_CODE === undefined
                  ? "xxx"
                  : selectedPlan?.G_CODE,
                selectedPlan?.PLAN_QTY === undefined
                  ? 0
                  : selectedPlan?.PLAN_QTY,
                selectedPlan?.PROCESS_NUMBER === undefined
                  ? 0
                  : selectedPlan?.PROCESS_NUMBER,
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
          onRowClicked={(params: any) => {
            //setClickedRows(params.data)
            //console.log(params.data)
            clickedRow.current = params.data;
            setSelectedPlan(params.data);
            handleGetChiThiTable(
              params.data.PLAN_ID,
              params.data.G_CODE,
              params.data.PLAN_QTY,
              params.data.PROCESS_NUMBER,
              params.data.IS_SETTING ?? 'Y'
            );
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
                    setChiThiListRender(
                      renderChiThi(qlsxplandatafilter.current, myComponentRef)
                    );
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
                onClick={() => {
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
                          setShowChiThi2(true);
                          setChiThiListRender2(
                            renderChiThi2(qlsxplandatafilter.current, myComponentRef)
                          );
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
            <QUICKPLAN />
          </div>
        )
      }
    </div>
  );
};
export default PLAN_DATATB;
