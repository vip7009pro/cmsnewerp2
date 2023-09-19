import {
  Autocomplete,
  Button,
  IconButton,
  LinearProgress,
  TextField,
} from "@mui/material";
import {
  Column,
  Editing,
  FilterRow,
  Pager,
  Scrolling,
  SearchPanel,
  Selection,
  DataGrid,
  Paging,
  Toolbar,
  Item,
  Export,
  ColumnChooser,
  Summary,
  TotalItem,
  KeyboardNavigation,
} from "devextreme-react/data-grid";
import moment from "moment";
import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  AiFillFileExcel,
  AiFillSave,
  AiOutlineArrowRight,
  AiOutlineBarcode,
  AiOutlineCloudUpload,
  AiOutlinePrinter,
} from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import { UserContext } from "../../../../api/Context";
import {
  checkBP,
  CustomResponsiveContainer,
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
  renderBanVe,
  renderChiThi,
  renderChiThi2,
  renderYCSX,
} from "../Machine/MACHINE";
import { useReactToPrint } from "react-to-print";
import DrawComponent from "../../../kinhdoanh/ycsxmanager/DrawComponent/DrawComponent";
import { setTimeout } from "timers/promises";
const PLAN_DATATB = () => {
  const dataGridRef = useRef(null);
  const currentRow = useRef(0);
  const datatbTotalRow = useRef(0);

  const [ycsxlistrender, setYCSXListRender] = useState<Array<ReactElement>>();
  const [showkhoao, setShowKhoAo] = useState(false);
  const [maxLieu, setMaxLieu] = useState(12);
  const [chithidatatable, setChiThiDataTable] = useState<QLSXCHITHIDATA[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<QLSXPLANDATA>();
  const [currentPlanPD, setCurrentPlanPD] = useState(0);
  const [currentPlanCAVITY, setCurrentPlanCAVITY] = useState(0);
  const [calc_loss_setting, setCalc_Loss_Setting] = useState(true);
  const [showhideM, setShowHideM] = useState(false);
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const clickedRow = useRef<any>(null);
  const [showChiThi, setShowChiThi] = useState(false);
  const [showChiThi2, setShowChiThi2] = useState(false);
  const [showBV, setShowBV] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const clearSelection = () => {
    if (dataGridRef.current) {
      dataGridRef.current.instance.clearSelection();
      qlsxplandatafilter.current = [];
      console.log(dataGridRef.current);
    }
  };
  const navigateToRow = (rowKey: any) => {
    if (dataGridRef.current) {
      dataGridRef.current.instance.navigateToRow(rowKey);
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
        PDBV_EMPL={"QLSX"}
        PDBV_DATE={"QLSX"}
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
  const [columns, setColumns] = useState<Array<any>>([]);
  const [selectionModel_INPUTSX, setSelectionModel_INPUTSX] = useState<any>([]);
  const [readyRender, setReadyRender] = useState(false);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
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
  /*   const [qlsxplandatafilter, setQlsxPlanDataFilter] = useState<
    Array<QLSXPLANDATA>
  >([]); */
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
  const column_plandatatable = [
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
      field: "PLAN_ID",
      headerName: "PLAN_ID",
      width: 90,
      editable: false,
      resizeable: true,
    },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 200,
      editable: false,
      resizeable: true,
    },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 180,
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
      field: "PLAN_QTY",
      headerName: "PLAN_QTY",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.PLAN_QTY === 0) {
          return <span style={{ color: "red", fontWeight: "bold" }}>NG</span>;
        } else {
          return (
            <span style={{ color: "green", fontWeight: "bold" }}>
              {params.row.PLAN_QTY.toLocaleString("en", "US")}
            </span>
          );
        }
      },
    },
    {
      field: "KETQUASX",
      headerName: "RESULT_QTY",
      width: 110,
      renderCell: (params: any) => {
        if (params.row.KETQUASX !== null) {
          return (
            <span style={{ color: "blue", fontWeight: "bold" }}>
              {params.row.KETQUASX.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <span>0</span>;
        }
      },
    },
    {
      field: "ACHIVEMENT_RATE",
      headerName: "ACHIVEMENT_RATE",
      width: 150,
      renderCell: (params: any) => {
        if (params.row.ACHIVEMENT_RATE !== undefined) {
          if (params.row.ACHIVEMENT_RATE === 100) {
            return (
              <span style={{ color: "green", fontWeight: "bold" }}>
                {params.row.ACHIVEMENT_RATE.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
                %
              </span>
            );
          } else {
            return (
              <span style={{ color: "red", fontWeight: "bold" }}>
                {params.row.ACHIVEMENT_RATE.toLocaleString("en-US", {
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
    { field: "PLAN_EQ", headerName: "PLAN_EQ", width: 80 },
    {
      field: "EQ_STATUS",
      headerName: "Trạng thái",
      width: 100,
      renderCell: (params: any) => {
        if (params.row.EQ_STATUS === "KTST-KSX") {
          return <span style={{ color: "green" }}>KTST-KSX</span>;
        } else if (params.row.EQ_STATUS === "Đang setting") {
          return <span style={{ color: "yellow" }}>Đang Setting</span>;
        } else if (params.row.EQ_STATUS === "Đang Run") {
          return <span style={{ color: "blue" }}>Đang Run</span>;
        } else if (params.row.EQ_STATUS === "Chạy xong") {
          return <span style={{ color: "green" }}>Chạy xong</span>;
        } else {
          return <span style={{ color: "red" }}>Chưa chạy</span>;
        }
      },
    },
    { field: "XUATDAOFILM", headerName: "Xuất Dao", width: 80 },
    { field: "DKXL", headerName: "ĐK Xuất liệu", width: 80 },
    { field: "MAIN_MATERIAL", headerName: "Xuất liệu", width: 80 },
    { field: "CHOTBC", headerName: "Chốt báo cáo", width: 80 },
    {
      field: "INS_EMPL",
      headerName: "INS_EMPL",
      width: 120,
      editable: false,
      hide: false,
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
    { field: "G_CODE", headerName: "G_CODE", width: 100, editable: false },
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
    { field: "EQ1", headerName: "EQ1", width: 30, editable: false },
    { field: "EQ2", headerName: "EQ2", width: 30, editable: false },
    { field: "EQ3", headerName: "EQ3", width: 30, editable: false },
    { field: "EQ4", headerName: "EQ4", width: 30, editable: false },
    {
      field: "CD1",
      headerName: "CD1",
      width: 60,
      editable: false,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row?.CD1.toLocaleString("en", "US")}
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
            {params.row?.CD2.toLocaleString("en", "US")}
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
            {params.row?.CD3.toLocaleString("en", "US")}
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
            {params.row?.CD4.toLocaleString("en", "US")}
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
          <span style={{ color: "red" }}>
            {params.row?.TON_CD1.toLocaleString("en", "US")}
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
          <span style={{ color: "red" }}>
            {params.row?.TON_CD2.toLocaleString("en", "US")}
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
          <span style={{ color: "red" }}>
            {params.row?.TON_CD3.toLocaleString("en", "US")}
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
          <span style={{ color: "red" }}>
            {params.row?.TON_CD4.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "PROCESS_NUMBER",
      headerName: "PROCESS_NUMBER",
      width: 110,
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
    { field: "STEP", headerName: "STEP", width: 60 },
    { field: "PLAN_ORDER", headerName: "PLAN_ORDER", width: 110 },
  ];
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
        : selectedPlan?.PROCESS_NUMBER
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
          if (!showhideM)
            Swal.fire(
              "Thông báo",
              "Đã load: " + response.data.data.length + " dòng",
              "success"
            );
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
          LOSS_SX1 =
            response.data.data[0].LOSS_SX1 === null
              ? 0
              : response.data.data[0].LOSS_SX1;
          LOSS_SX2 =
            response.data.data[0].LOSS_SX2 === null
              ? 0
              : response.data.data[0].LOSS_SX2;
          LOSS_SETTING1 =
            response.data.data[0].LOSS_SETTING1 === null
              ? 0
              : response.data.data[0].LOSS_SETTING1;
          LOSS_SETTING2 =
            response.data.data[0].LOSS_SETTING2 === null
              ? 0
              : response.data.data[0].LOSS_SETTING2;
          FINAL_LOSS_SX = PROCESS_NUMBER === 1 ? LOSS_SX1 : LOSS_SX2;
          if (PROCESS_NUMBER === 1) {
            FINAL_LOSS_SX =
              response.data.data[0].LOSS_SX1 === null
                ? 0
                : response.data.data[0].LOSS_SX1;
          } else if (PROCESS_NUMBER === 2) {
            FINAL_LOSS_SX =
              response.data.data[0].LOSS_SX2 === null
                ? 0
                : response.data.data[0].LOSS_SX2;
          } else if (PROCESS_NUMBER === 3) {
            FINAL_LOSS_SX =
              response.data.data[0].LOSS_SX3 === null
                ? 0
                : response.data.data[0].LOSS_SX3;
          } else if (PROCESS_NUMBER === 4) {
            FINAL_LOSS_SX =
              response.data.data[0].LOSS_SX4 === null
                ? 0
                : response.data.data[0].LOSS_SX4;
          }
          FINAL_LOSS_SETTING =
            PROCESS_NUMBER === 1
              ? calc_loss_setting
                ? LOSS_SETTING1
                : 0
              : calc_loss_setting
              ? LOSS_SETTING2
              : 0;
          if (PROCESS_NUMBER === 1) {
            FINAL_LOSS_SETTING = calc_loss_setting
              ? response.data.data[0].LOSS_SETTING1 === null
                ? 0
                : response.data.data[0].LOSS_SETTING1
              : 0;
          } else if (PROCESS_NUMBER === 2) {
            FINAL_LOSS_SETTING = calc_loss_setting
              ? response.data.data[0].LOSS_SETTING2 === null
                ? 0
                : response.data.data[0].LOSS_SETTING2
              : 0;
          } else if (PROCESS_NUMBER === 3) {
            FINAL_LOSS_SETTING = calc_loss_setting
              ? response.data.data[0].LOSS_SETTING3 === null
                ? 0
                : response.data.data[0].LOSS_SETTING3
              : 0;
          } else if (PROCESS_NUMBER === 4) {
            FINAL_LOSS_SETTING = calc_loss_setting
              ? response.data.data[0].LOSS_SETTING4 === null
                ? 0
                : response.data.data[0].LOSS_SETTING4
              : 0;
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
        PLAN_QTY: number =
          selectedPlan?.PLAN_QTY === undefined ? 0 : selectedPlan?.PLAN_QTY,
        PROCESS_NUMBER: number =
          selectedPlan?.PROCESS_NUMBER === undefined
            ? 1
            : selectedPlan?.PROCESS_NUMBER,
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
            LOSS_SX1 =
              response.data.data[0].LOSS_SX1 === null
                ? 0
                : response.data.data[0].LOSS_SX1;
            LOSS_SX2 =
              response.data.data[0].LOSS_SX2 === null
                ? 0
                : response.data.data[0].LOSS_SX2;
            LOSS_SETTING1 =
              response.data.data[0].LOSS_SETTING1 === null
                ? 0
                : response.data.data[0].LOSS_SETTING1;
            LOSS_SETTING2 =
              response.data.data[0].LOSS_SETTING2 === null
                ? 0
                : response.data.data[0].LOSS_SETTING2;
            FINAL_LOSS_SX = PROCESS_NUMBER === 1 ? LOSS_SX1 : LOSS_SX2;
            FINAL_LOSS_SETTING =
              PROCESS_NUMBER === 1
                ? calc_loss_setting
                  ? LOSS_SETTING1
                  : 0
                : calc_loss_setting
                ? LOSS_SETTING2
                : 0;
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
    console.log(selectedPlanTable);
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
          KETQUASX:
            qlsxplandatafilter.current[i].KETQUASX === null
              ? 0
              : qlsxplandatafilter.current[i].KETQUASX,
          NEXT_PLAN_ID:
            qlsxplandatafilter.current[i].NEXT_PLAN_ID === null
              ? "X"
              : qlsxplandatafilter.current[i].NEXT_PLAN_ID,
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
  const planDataTable2 = React.useMemo(
    () => (
      <div className='datatb'>
        <CustomResponsiveContainer>
          <DataGrid
            autoNavigateToFocusedRow={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={plandatatable}
            columnWidth='auto'
            keyExpr='id'
            height={"88vh"}
            showBorders={true}
            onSelectionChanged={(e) => {
              qlsxplandatafilter.current = e.selectedRowsData;
              //console.log(e.selectedRowKeys);
              setSelectedRowKeys(e.selectedRowKeys);
            }}
            /* selectedRowKeys={selectedRowKeys} */
            onRowClick={(e) => {
              //console.log(e.data);
              clickedRow.current = e.data;
              setSelectedPlan(e.data);
              handleGetChiThiTable(
                e.data.PLAN_ID,
                e.data.G_CODE,
                e.data.PLAN_QTY,
                e.data.PROCESS_NUMBER
              );
            }}
            onRowPrepared={(e: any) => {
              if (parseInt(e.data?.PLAN_EQ.substring(2, 4)) % 2 === 0)
                e.rowElement.style.background = "#BEC7C0";
            }}
            onRowDblClick={(params: any) => {
              //console.log(params.data);
              setShowHideM(true);
            }}
          >
            <KeyboardNavigation
              editOnKeyPress={true}
              enterKeyAction={"moveFocus"}
              enterKeyDirection={"column"}
            />
            <Scrolling
              useNative={true}
              scrollByContent={true}
              scrollByThumb={true}
              showScrollbar='onHover'
              mode='virtual'
            />
            <Selection mode='multiple' selectAllMode='allPages' />
            <Editing
              allowUpdating={true}
              allowAdding={true}
              allowDeleting={false}
              mode='cell'
              confirmDelete={true}
              onChangesChange={(e) => {}}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
              <Item location='before'>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    /* checkBP(
              userData?.EMPL_NO,
              userData?.MAINDEPTNAME,
              ["QLSX"],
              handle_UpdatePlan
            ); */
                    checkBP(
                      userData,
                      ["QLSX"],
                      ["ALL"],
                      ["ALL"],
                      handle_UpdatePlan
                    );
                    //handle_UpdatePlan();
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
                        renderChiThi(qlsxplandatafilter.current)
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
                  <AiOutlinePrinter color='#0066ff' size={25} />
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

                    console.log("ycsx_number", ycsx_number);

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
                              renderChiThi2(qlsxplandatafilter.current)
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
                  <AiOutlinePrinter color='#0066ff' size={25} />
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
                  <AiOutlinePrinter color='#ff751a' size={25} />
                  Print Bản Vẽ
                </IconButton>
              </Item>
              <Item name='searchPanel' />
              <Item name='exportButton' />
              <Item name='columnChooser' />
            </Toolbar>
            <FilterRow visible={true} />
            <SearchPanel visible={true} />
            <ColumnChooser enabled={true} />
            <Paging defaultPageSize={15} />
            <Pager
              showPageSizeSelector={true}
              allowedPageSizes={[5, 10, 15, 20, 100, 1000, 10000, "all"]}
              showNavigationButtons={true}
              showInfo={true}
              infoText='Page #{0}. Total: {1} ({2} items)'
              displayMode='compact'
            />
            <Column
              dataField='id'
              caption='ID'
              width={80}
              allowEditing={false}
            ></Column>
            <Column
              dataField='PROD_REQUEST_NO'
              caption='YCSX NO'
              width={80}
              allowEditing={false}
            ></Column>
            <Column
              dataField='PLAN_ID'
              caption='PLAN_ID'
              width={80}
              allowEditing={false}
            ></Column>
            <Column
              dataField='G_NAME_KD'
              caption='CODE KD'
              width={100}
              cellRender={(params: any) => {
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
                ) {
                  return (
                    <span style={{ color: "red" }}>
                      {params.data.G_NAME_KD}
                    </span>
                  );
                } else {
                  return (
                    <span style={{ color: "green" }}>
                      {params.data.G_NAME_KD}
                    </span>
                  );
                }
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='PLAN_EQ'
              caption='PLAN EQ'
              width={70}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "bold" }}>
                    {params.data.PLAN_EQ}
                  </span>
                );
              }}
              allowEditing={true}
            ></Column>
            <Column
              dataField='PLAN_QTY'
              caption='PLAN_QTY'
              width={70}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "gray", fontWeight: "bold" }}>
                    {params.data.PLAN_QTY?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={true}
            ></Column>
            <Column
              dataField='KETQUASX'
              caption='RESULT_QTY'
              width={80}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "#F117FF", fontWeight: "bold" }}>
                    {params.data.KETQUASX?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='ACHIVEMENT_RATE'
              caption='ACHIV_RATE'
              width={80}
              cellRender={(params: any) => {
                if (params.data.ACHIVEMENT_RATE !== undefined) {
                  if (params.data.ACHIVEMENT_RATE === 100) {
                    return (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        {params.data.ACHIVEMENT_RATE.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                        %
                      </span>
                    );
                  } else {
                    return (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        {params.data.ACHIVEMENT_RATE.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                        %
                      </span>
                    );
                  }
                } else {
                  return <span>0</span>;
                }
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='EQ_STATUS'
              caption='EQ_STATUS'
              width={120}
              cellRender={(params: any) => {
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
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='SETTING_START_TIME'
              caption='SETTING_START'
              width={100}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normarl" }}>
                    {params.data.SETTING_START_TIME}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='MASS_START_TIME'
              caption='MASS_START'
              width={90}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normarl" }}>
                    {params.data.MASS_START_TIME}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='MASS_END_TIME'
              caption='MASS_END'
              width={80}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normarl" }}>
                    {params.data.MASS_END_TIME}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>

            <Column
              dataField='XUATDAOFILM'
              caption='Xuất Dao'
              width={80}
              cellRender={(params: any) => {
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
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='DKXL'
              caption='ĐK Xuất Liệu'
              width={80}
              cellRender={(params: any) => {
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
                        console.log(params.data);
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
                        console.log(params.data);
                        setShowHideM(true);
                      }}
                    >
                      N
                    </div>
                  );
                }
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='MAIN_MATERIAL'
              caption='Xuất liệu'
              width={60}
              cellRender={(params: any) => {
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
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='INT_TEM'
              caption='In tem'
              width={60}
              cellRender={(params: any) => {
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
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='CHOTBC'
              caption='Chốt BC'
              width={70}
              cellRender={(params: any) => {
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
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='KQ_SX_TAM'
              caption='CURRENT_RESULT'
              width={120}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "#3394D8", fontWeight: "bold" }}>
                    {params.data.KQ_SX_TAM?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>

            <Summary>
              <TotalItem
                alignment='right'
                column='PO_ID'
                summaryType='count'
                valueFormat={"decimal"}
              />
              <TotalItem
                alignment='right'
                column='PO_QTY'
                summaryType='sum'
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment='right'
                column='TOTAL_DELIVERED'
                summaryType='sum'
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment='right'
                column='PO_BALANCE'
                summaryType='sum'
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment='right'
                column='PO_AMOUNT'
                summaryType='sum'
                valueFormat={"currency"}
              />
              <TotalItem
                alignment='right'
                column='DELIVERED_AMOUNT'
                summaryType='sum'
                valueFormat={"currency"}
              />
              <TotalItem
                alignment='right'
                column='BALANCE_AMOUNT'
                summaryType='sum'
                valueFormat={"currency"}
              />
            </Summary>
          </DataGrid>
        </CustomResponsiveContainer>
      </div>
    ),
    [plandatatable, columns, trigger]
  );
  const planDataTable = React.useMemo(
    () => (
      <div className='datatb'>
        <CustomResponsiveContainer>
          <DataGrid
            ref={dataGridRef}
            autoNavigateToFocusedRow={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={plandatatable}
            columnWidth='auto'
            keyExpr='PLAN_ID'
            height={"88vh"}
            showBorders={true}
            onSelectionChanged={(e) => {
              qlsxplandatafilter.current = e.selectedRowsData;
              //console.log(e.selectedRowKeys);
              setSelectedRowKeys(e.selectedRowKeys);
            }}
            /* selectedRowKeys={selectedRowKeys} */
            onRowClick={(e) => {
              //console.log(e.data);
              clickedRow.current = e.data;
              setSelectedPlan(e.data);
              handleGetChiThiTable(
                e.data.PLAN_ID,
                e.data.G_CODE,
                e.data.PLAN_QTY,
                e.data.PROCESS_NUMBER
              );
            }}
            onRowPrepared={(e: any) => {
              if (parseInt(e.data?.PLAN_EQ.substring(2, 4)) % 2 === 0)
                e.rowElement.style.background = "#BEC7C0";
            }}
            onRowDblClick={(params: any) => {
              //console.log(params.data);
              setShowHideM(true);
            }}
          >
            <KeyboardNavigation
              editOnKeyPress={true}
              enterKeyAction={"moveFocus"}
              enterKeyDirection={"column"}
            />
            <Scrolling
              useNative={true}
              scrollByContent={true}
              scrollByThumb={true}
              showScrollbar='onHover'
              mode='virtual'
            />
            <Selection mode='multiple' selectAllMode='allPages' />
            <Editing
              allowUpdating={true}
              allowAdding={true}
              allowDeleting={false}
              mode='cell'
              confirmDelete={true}
              onChangesChange={(e) => {}}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
              <Item location='before'>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    /* checkBP(
              userData?.EMPL_NO,
              userData?.MAINDEPTNAME,
              ["QLSX"],
              handle_UpdatePlan
            ); */
                    checkBP(
                      userData,
                      ["QLSX"],
                      ["ALL"],
                      ["ALL"],
                      handle_UpdatePlan
                    );
                    //handle_UpdatePlan();
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
                        renderChiThi(qlsxplandatafilter.current)
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
                  <AiOutlinePrinter color='#0066ff' size={25} />
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

                    console.log("ycsx_number", ycsx_number);

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
                              renderChiThi2(qlsxplandatafilter.current)
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
                  <AiOutlinePrinter color='#0066ff' size={25} />
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
                  <AiOutlinePrinter color='#ff751a' size={25} />
                  Print Bản Vẽ
                </IconButton>
              </Item>
              <Item name='searchPanel' />
              <Item name='exportButton' />
              <Item name='columnChooser' />
            </Toolbar>
            <FilterRow visible={true} />
            <SearchPanel visible={true} />
            <ColumnChooser enabled={true} />
            <Paging defaultPageSize={15} />
            <Pager
              showPageSizeSelector={true}
              allowedPageSizes={[5, 10, 15, 20, 100, 1000, 10000, "all"]}
              showNavigationButtons={true}
              showInfo={true}
              infoText='Page #{0}. Total: {1} ({2} items)'
              displayMode='compact'
            />
            <Column
              dataField='PLAN_FACTORY'
              caption='NM'
              width={50}
              allowEditing={false}
            ></Column>
            <Column
              dataField='PLAN_DATE'
              caption='PLAN_DATE'
              width={80}
              allowEditing={false}
            ></Column>
            <Column
              dataField='PLAN_ID'
              caption='PLAN_ID'
              width={80}
              allowEditing={false}
            ></Column>
            <Column
              dataField='G_CODE'
              caption='G_CODE'
              width={80}
              allowEditing={false}
            ></Column>
            <Column
              dataField='G_NAME'
              caption='G_NAME'
              width={120}
              allowEditing={false}
            ></Column>
            <Column
              dataField='G_NAME_KD'
              caption='CODE KD'
              width={100}
              cellRender={(params: any) => {
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
                ) {
                  return (
                    <span style={{ color: "red" }}>
                      {params.data.G_NAME_KD}
                    </span>
                  );
                } else {
                  return (
                    <span style={{ color: "green" }}>
                      {params.data.G_NAME_KD}
                    </span>
                  );
                }
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='PLAN_EQ'
              caption='PLAN EQ'
              width={70}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "bold" }}>
                    {params.data.PLAN_EQ}
                  </span>
                );
              }}
              allowEditing={true}
            ></Column>
            <Column
              dataField='PROCESS_NUMBER'
              caption='PROC_NUMBER'
              width={100}
              allowEditing={true}
            ></Column>
            <Column
              dataField='STEP'
              caption='STEP'
              width={50}
              allowEditing={true}
            ></Column>
            <Column
              dataField='PLAN_QTY'
              caption='PLAN_QTY'
              width={70}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "gray", fontWeight: "bold" }}>
                    {params.data.PLAN_QTY?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={true}
            ></Column>
            <Column
              dataField='KETQUASX'
              caption='RESULT_QTY'
              width={80}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "#F117FF", fontWeight: "bold" }}>
                    {params.data.KETQUASX?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='ACHIVEMENT_RATE'
              caption='ACHIV_RATE'
              width={80}
              cellRender={(params: any) => {
                if (params.data.ACHIVEMENT_RATE !== undefined) {
                  if (params.data.ACHIVEMENT_RATE === 100) {
                    return (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        {params.data.ACHIVEMENT_RATE.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                        %
                      </span>
                    );
                  } else {
                    return (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        {params.data.ACHIVEMENT_RATE.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                        %
                      </span>
                    );
                  }
                } else {
                  return <span>0</span>;
                }
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='EQ_STATUS'
              caption='EQ_STATUS'
              width={120}
              cellRender={(params: any) => {
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
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='SETTING_START_TIME'
              caption='SETTING_START'
              width={80}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normarl" }}>
                    {params.data.SETTING_START_TIME}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='MASS_START_TIME'
              caption='MASS_START'
              width={90}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normarl" }}>
                    {params.data.MASS_START_TIME}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='MASS_END_TIME'
              caption='MASS_END'
              width={80}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normarl" }}>
                    {params.data.MASS_END_TIME}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>

            <Column
              dataField='XUATDAOFILM'
              caption='Xuất Dao'
              width={80}
              cellRender={(params: any) => {
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
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='DKXL'
              caption='ĐK Xuất Liệu'
              width={80}
              cellRender={(params: any) => {
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
                        console.log(params.data);
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
                        console.log(params.data);
                        setShowHideM(true);
                      }}
                    >
                      N
                    </div>
                  );
                }
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='MAIN_MATERIAL'
              caption='Xuất liệu'
              width={60}
              cellRender={(params: any) => {
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
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='INT_TEM'
              caption='In tem'
              width={60}
              cellRender={(params: any) => {
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
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='CHOTBC'
              caption='Chốt BC'
              width={70}
              cellRender={(params: any) => {
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
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='KQ_SX_TAM'
              caption='CURRENT_RESULT'
              width={120}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "#3394D8", fontWeight: "bold" }}>
                    {params.data.KQ_SX_TAM?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='PROD_REQUEST_NO'
              caption='YCSX NO'
              width={80}
              allowEditing={false}
            ></Column>
            {/*<Column dataField='PLAN_LEADTIME' caption='PLAN_LEADTIME' width={80} allowEditing={false}  
            ></Column>
             <Column dataField='INS_EMPL' caption='INS_EMPL' width={80} allowEditing={false}  
            ></Column>
             <Column dataField='PLAN_ORDER' caption='PLAN_ORDER' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='INS_DATE' caption='INS_DATE' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='UPD_EMPL' caption='UPD_EMPL' width={80} allowEditing={false}  
            ></Column>
             <Column dataField='NEXT_PLAN_ID' caption='NEXT_PLAN_ID' width={80} allowEditing={false}  
            ></Column>
          <Column dataField='UPD_DATE' caption='UPD_DATE' width={80} allowEditing={false}  
            ></Column> 
          <Column dataField='PROD_REQUEST_DATE' caption='PROD_REQUEST_DATE' width={80} allowEditing={false}  
            ></Column>*/}
            <Column
              dataField='PROD_REQUEST_QTY'
              caption='YCSX QTY'
              width={70}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "#7C59B9", fontWeight: "bold" }}>
                    {params.data.PROD_REQUEST_QTY?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='CD1'
              caption='CD1'
              width={60}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "#1D7A9C", fontWeight: "normal" }}>
                    {params.data.CD1?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='CD2'
              caption='CD2'
              width={60}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "#1D7A9C", fontWeight: "normal" }}>
                    {params.data.CD2?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='CD3'
              caption='CD3'
              width={60}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "#1D7A9C", fontWeight: "normal" }}>
                    {params.data.CD3?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='CD4'
              caption='CD4'
              width={60}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "#1D7A9C", fontWeight: "normal" }}>
                    {params.data.CD4?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='TON_CD1'
              caption='TCD1'
              width={60}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "red", fontWeight: "normal" }}>
                    {params.data.TON_CD1?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='TON_CD2'
              caption='TCD2'
              width={60}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "red", fontWeight: "normal" }}>
                    {params.data.TON_CD2?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='TON_CD3'
              caption='TCD3'
              width={60}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "red", fontWeight: "normal" }}>
                    {params.data.TON_CD3?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='TON_CD4'
              caption='TCD4'
              width={60}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "red", fontWeight: "normal" }}>
                    {params.data.TON_CD4?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='FACTORY'
              caption='NM'
              width={60}
              allowEditing={false}
            ></Column>
            <Column
              dataField='EQ1'
              caption='EQ1'
              width={50}
              allowEditing={false}
            ></Column>
            <Column
              dataField='EQ2'
              caption='EQ2'
              width={50}
              allowEditing={false}
            ></Column>
            <Column
              dataField='EQ3'
              caption='EQ3'
              width={50}
              allowEditing={false}
            ></Column>
            <Column
              dataField='EQ4'
              caption='EQ4'
              width={50}
              allowEditing={false}
            ></Column>
            {/* <Column dataField='Setting1' caption='Setting1' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='Setting2' caption='Setting2' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='Setting3' caption='Setting3' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='Setting4' caption='Setting4' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='UPH1' caption='UPH1' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='UPH2' caption='UPH2' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='UPH3' caption='UPH3' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='UPH4' caption='UPH4' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='Step1' caption='Step1' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='Step2' caption='Step2' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='Step3' caption='Step3' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='Step4' caption='Step4' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='LOSS_SX1' caption='LOSS_SX1' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='LOSS_SX2' caption='LOSS_SX2' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='LOSS_SX3' caption='LOSS_SX3' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='LOSS_SX4' caption='LOSS_SX4' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='LOSS_SETTING1' caption='LOSS_SETTING1' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='LOSS_SETTING2' caption='LOSS_SETTING2' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='LOSS_SETTING3' caption='LOSS_SETTING3' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='LOSS_SETTING4' caption='LOSS_SETTING4' width={80} allowEditing={false}  
            ></Column>
            <Column dataField='NOTE' caption='NOTE' width={80} allowEditing={false}  
            ></Column>      */}
            <Summary>
              <TotalItem
                alignment='right'
                column='PO_ID'
                summaryType='count'
                valueFormat={"decimal"}
              />
              <TotalItem
                alignment='right'
                column='PO_QTY'
                summaryType='sum'
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment='right'
                column='TOTAL_DELIVERED'
                summaryType='sum'
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment='right'
                column='PO_BALANCE'
                summaryType='sum'
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment='right'
                column='PO_AMOUNT'
                summaryType='sum'
                valueFormat={"currency"}
              />
              <TotalItem
                alignment='right'
                column='DELIVERED_AMOUNT'
                summaryType='sum'
                valueFormat={"currency"}
              />
              <TotalItem
                alignment='right'
                column='BALANCE_AMOUNT'
                summaryType='sum'
                valueFormat={"currency"}
              />
            </Summary>
          </DataGrid>
        </CustomResponsiveContainer>
      </div>
    ),
    [plandatatable, columns, trigger]
  );
  const planMaterialTable = React.useMemo(
    () => (
      <div className='datatb'>
        <CustomResponsiveContainer>
          <DataGrid
            autoNavigateToFocusedRow={false}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={chithidatatable}
            columnWidth='auto'
            keyExpr='CHITHI_ID'
            height={"70vh"}
            showBorders={true}
            onSelectionChanged={(e) => {
              qlsxchithidatafilter.current = e.selectedRowsData;
            }}
            onRowClick={(e) => {
              //console.log(e.data);
              clickedRow.current = e.data;
            }}
            onRowPrepared={(e: any) => {
              /* if (parseInt(e.data?.PLAN_EQ.substring(2, 4)) % 2 === 0)
                e.rowElement.style.background = "#BEC7C0"; */
            }}
          >
            <KeyboardNavigation
              editOnKeyPress={true}
              enterKeyAction={"moveFocus"}
              enterKeyDirection={"column"}
            />
            <Scrolling
              useNative={true}
              scrollByContent={true}
              scrollByThumb={true}
              showScrollbar='onHover'
              mode='virtual'
            />
            {/* <Selection mode='single' selectAllMode='allPages' /> */}
            <Editing
              allowUpdating={true}
              allowAdding={true}
              allowDeleting={true}
              mode='cell'
              confirmDelete={true}
              onChangesChange={(e) => {}}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
              <Item location='before'>
                <IconButton className='buttonIcon' onClick={() => {}}>
                  <AiFillFileExcel color='green' size={15} />
                  SAVE
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
              </Item>
              <Item name='searchPanel' />
              <Item name='exportButton' />
              <Item name='columnChooser' />
            </Toolbar>
            <FilterRow visible={true} />
            <SearchPanel visible={true} />
            <ColumnChooser enabled={true} />
            <Paging defaultPageSize={15} />
            <Pager
              showPageSizeSelector={true}
              allowedPageSizes={[5, 10, 15, 20, 100, 1000, 10000, "all"]}
              showNavigationButtons={true}
              showInfo={true}
              infoText='Page #{0}. Total: {1} ({2} items)'
              displayMode='compact'
            />
            <Column
              dataField='CHITHI_ID'
              caption='CT_ID'
              width={60}
              allowEditing={false}
            ></Column>
            <Column
              dataField='PLAN_ID'
              caption='PLAN_ID'
              width={80}
              allowEditing={false}
            ></Column>
            <Column
              dataField='M_CODE'
              caption='M_CODE'
              width={80}
              allowEditing={false}
            ></Column>
            <Column
              dataField='M_NAME'
              caption='M_NAME'
              width={120}
              cellRender={(params: any) => {
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
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='WIDTH_CD'
              caption='SIZE'
              width={50}
              allowEditing={false}
            ></Column>
            <Column
              dataField='M_MET_QTY'
              caption='M_MET_QTY'
              width={80}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {params.data.M_MET_QTY}
                  </span>
                );
              }}
              allowEditing={true}
            ></Column>
            <Column
              dataField='M_QTY'
              caption='HE_SO'
              width={60}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "#F117FF", fontWeight: "bold" }}>
                    {params.data.M_QTY}
                  </span>
                );
              }}
              allowEditing={true}
            ></Column>
            <Column
              dataField='LIEUQL_SX'
              caption='LIEUQL_SX'
              width={80}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "#F117FF", fontWeight: "bold" }}>
                    {params.data.LIEUQL_SX}
                  </span>
                );
              }}
              allowEditing={true}
            ></Column>
            <Column
              dataField='M_STOCK'
              caption='M_STOCK'
              width={80}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "gray", fontWeight: "bold" }}>
                    {params.data.M_STOCK?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={true}
            ></Column>
            <Column
              dataField='OUT_KHO_SX'
              caption='OUT_KHO_SX'
              width={100}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "#F117FF", fontWeight: "bold" }}>
                    {params.data.OUT_KHO_SX}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='OUT_CFM_QTY'
              caption='OUT_KHO_THAT'
              width={80}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "#F117FF", fontWeight: "bold" }}>
                    {params.data.OUT_CFM_QTY}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Summary>
              <TotalItem
                alignment='right'
                column='PO_ID'
                summaryType='count'
                valueFormat={"decimal"}
              />
              <TotalItem
                alignment='right'
                column='PO_QTY'
                summaryType='sum'
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment='right'
                column='TOTAL_DELIVERED'
                summaryType='sum'
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment='right'
                column='PO_BALANCE'
                summaryType='sum'
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment='right'
                column='PO_AMOUNT'
                summaryType='sum'
                valueFormat={"currency"}
              />
              <TotalItem
                alignment='right'
                column='DELIVERED_AMOUNT'
                summaryType='sum'
                valueFormat={"currency"}
              />
              <TotalItem
                alignment='right'
                column='BALANCE_AMOUNT'
                summaryType='sum'
                valueFormat={"currency"}
              />
            </Summary>
          </DataGrid>
        </CustomResponsiveContainer>
      </div>
    ),
    [chithidatatable]
  );

  useEffect(() => {
    getMachineList();
    /*  let intervalID = window.setInterval(() => {
      console.log('current row',currentRow);
      navigateToRow(currentRow.current);      
      if(datatbTotalRow.current >0)
      currentRow.current +=10;
      if(currentRow.current >= datatbTotalRow.current) currentRow.current=0;
    }, 2000); */

    return () => {
      /* window.clearInterval(intervalID);       */
    };

    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className='lichsuplanTable'>
      <div className='tracuuDataInspection'>
        <div className='tracuuYCSXTable'>
          <div className='header'>
            {/* <div className='lossinfo'>
            <table>
              <thead>
                <tr>
                  <th style={{ color: "black", fontWeight: "normal" }}>
                    FACTORY
                  </th>
                  <th style={{ color: "black", fontWeight: "normal" }}>
                    MACHINE
                  </th>
                  <th style={{ color: "black", fontWeight: "normal" }}>
                    TOTAL PLAN
                  </th>
                  <th style={{ color: "black", fontWeight: "normal" }}>
                    TOTAL RESULT
                  </th>
                  <th style={{ color: "black", fontWeight: "normal" }}>
                    ACHIVEMENT RATE
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ color: "blue", fontWeight: "bold" }}>
                    {factory}
                  </td>
                  <td style={{ color: "#360EEA", fontWeight: "bold" }}>
                    {machine}
                  </td>
                  <td style={{ color: "#360EEA", fontWeight: "bold" }}>
                    {summarydata.PLAN_QTY?.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {summarydata.KETQUASX?.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td style={{ color: "#EA0EBA", fontWeight: "bold" }}>
                    {summarydata.ACHIVEMENT_RATE?.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                    %
                  </td>
                </tr>
              </tbody>
            </table>
          </div> */}
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
                    style={{ width: 160, height: 30 }}
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
                    setisLoading(true);
                    setReadyRender(false);
                    loadQLSXPlan(fromdate);
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
                {/* <button
                  className='tranhatky'
                  onClick={() => {
                    console.log(" da xoa");
                    //setSelectedRowKeys([]);
                    clearSelection();
                    //navigateToRow(26)
                  }}
                >
                  Reset selection
                </button> */}
              </div>
            </div>
          </div>
          {planDataTable}
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
            Có setting hay không?
            <input
              type='checkbox'
              name='alltimecheckbox'
              defaultChecked={calc_loss_setting}
              onChange={() => setCalc_Loss_Setting(!calc_loss_setting)}
            ></input>
          </div>
          {planMaterialTable}
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
                setChiThiListRender2(renderChiThi2(qlsxplandatafilter.current));
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
    </div>
  );
};
export default PLAN_DATATB;
