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
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import Swal from "sweetalert2";
import "./BAOCAOTHEOROLL.scss";
import { useSelector } from "react-redux";
import { MACHINE_LIST, SX_ACHIVE_DATE, SX_BAOCAOROLLDATA, SX_LOSS_TREND_DATA, SX_TREND_LOSS_DATA, UserData } from "../../../api/GlobalInterface";
import { generalQuery } from "../../../api/Api";
import { RootState } from "../../../redux/store";
import { CustomResponsiveContainer, f_getMachineListData, SaveExcel } from "../../../api/GlobalFunction";
import { Chart } from "devextreme-react";
import { ArgumentAxis, CommonSeriesSettings, Format, Label, Legend, Series, Title, ValueAxis } from "devextreme-react/chart";
import { IconButton } from "@mui/material";
import { AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotTable from "../../../components/PivotChart/PivotChart";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import SX_DailyLossTrend from "../../../components/Chart/SX/SX_DailyLossTrend";
import SX_WeeklyLossTrend from "../../../components/Chart/SX/SX_WeeklyLossTrend";
import SX_MonthlyLossTrend from "../../../components/Chart/SX/SX_MonthlyLossTrend";
import SX_YearlyLossTrend from "../../../components/Chart/SX/SX_YearlyLossTrend";
import AGTable from "../../../components/DataTable/AGTable";
const BAOCAOTHEOROLL = () => {
  const dataGridRef = useRef<any>(null);
  const datatbTotalRow = useRef(0);
  const [showhideM, setShowHideM] = useState(false);
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const clickedRow = useRef<any>(null);
  const [trigger, setTrigger] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const clearSelection = () => {
    if (dataGridRef.current) {
      dataGridRef.current.instance.clearSelection();
      qlsxplandatafilter.current = [];
      //console.log(dataGridRef.current);
    }
  };
  const getMachineList = async () => {
    setMachine_List(await f_getMachineListData());     
  };
  const [columns, setColumns] = useState<Array<any>>([]);
  const [readyRender, setReadyRender] = useState(false);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().add(-8, "day").format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [factory, setFactory] = useState("ALL");
  const [machine, setMachine] = useState("ALL");
  const [plandatatable, setPlanDataTable] = useState<SX_BAOCAOROLLDATA[]>([]);
  const [summarydata, setSummaryData] = useState<SX_BAOCAOROLLDATA>({
    id: -1,
    PHANLOAI: 'MASS',
    EQUIPMENT_CD: 'TOTAL',
    PROD_REQUEST_NO: 'TOTAL',
    PLAN_ID: 'TOTAL',
    PLAN_QTY: 0,
    SX_RESULT: 0,
    ACHIVEMENT_RATE: 0,
    PROD_MODEL: 'TOTAL',
    G_NAME_KD: 'TOTAL',
    M_LOT_NO: 'TOTAL',
    M_NAME: 'TOTAL',
    WIDTH_CD: 0,
    INPUT_QTY: 0,
    REMAIN_QTY: 0,
    USED_QTY: 0,
    RPM: 0,
    SETTING_MET: 0,
    PR_NG: 0,
    OK_MET_AUTO: 0,
    OK_MET_TT: 0,
    LOSS_ST: 0,
    LOSS_SX: 0,
    LOSS_TT:0,
    LOSS_TT_KT: 0,    
    OK_EA: 0,
    OUTPUT_EA: 0,
    INSPECT_INPUT: 0,
    INSPECT_TT_QTY: 0,
    INSPECT_OK_QTY: 0,
    INSPECT_OK_SQM: 0,
    TT_LOSS_SQM: 0,
    REMARK: '',
    PD: 0,
    CAVITY: 0,
    STEP: 0,
    PR_NB: 0,
    MAX_PROCESS_NUMBER: 0,
    LAST_PROCESS: 0,
    INPUT_DATE: 'TOTAL',
    IS_SETTING: 'Y',
    LOSS_SQM: 0,
    USED_SQM: 0,
    PURE_INPUT:0,
    PURE_OUTPUT:0
  });
  const qlsxplandatafilter = useRef<SX_BAOCAOROLLDATA[]>([]);
  const [sxlosstrendingdata, setSXLossTrendingData] = useState<SX_LOSS_TREND_DATA[]>([]);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [dailyLossTrend, setDailyLossTrend] = useState<SX_TREND_LOSS_DATA[]>([]);
  const [weeklyLossTrend, setWeeklyLossTrend] = useState<SX_TREND_LOSS_DATA[]>([]);
  const [monthyLossTrend, setMonthlyLossTrend] = useState<SX_TREND_LOSS_DATA[]>([]);
  const [yearlyLossTrend, setYearlyLossTrend] = useState<SX_TREND_LOSS_DATA[]>([]);
  const loadBaoCaoTheoRoll = async () => {
    //console.log(todate);
    await generalQuery("loadBaoCaoTheoRoll", {
      FROM_DATE: fromdate,
      TO_DATE: todate,
      MACHINE: machine,
      FACTORY: factory,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata: SX_BAOCAOROLLDATA[] = response.data.data.map(
            (element: SX_BAOCAOROLLDATA, index: number) => {
              return {
                ...element,
                INPUT_DATE: moment(element.INPUT_DATE).format('YYYY-MM-DD'),
                id: index,
              };
            }
          );
          //console.log(loadeddata);
          let temp_plan_data: SX_BAOCAOROLLDATA = {
            id: -1,
            PHANLOAI: 'MASS',
            EQUIPMENT_CD: 'TOTAL',
            PROD_REQUEST_NO: 'TOTAL',
            PLAN_ID: 'TOTAL',
            PLAN_QTY: 0,
            SX_RESULT: 0,
            ACHIVEMENT_RATE: 0,
            PROD_MODEL: 'TOTAL',
            G_NAME_KD: 'TOTAL',
            M_LOT_NO: 'TOTAL',
            M_NAME: 'TOTAL',
            WIDTH_CD: 0,
            INPUT_QTY: 0,
            REMAIN_QTY: 0,
            USED_QTY: 0,
            RPM: 0,
            SETTING_MET: 0,
            PR_NG: 0,
            OK_MET_AUTO: 0,
            OK_MET_TT: 0,
            LOSS_ST: 0,
            LOSS_SX: 0,
            LOSS_TT:0, 
            LOSS_TT_KT: 0,
            OK_EA: 0,
            OUTPUT_EA: 0,
            INSPECT_INPUT: 0,
            INSPECT_TT_QTY: 0,          
            INSPECT_OK_SQM:0,
            INSPECT_OK_QTY: 0,
            TT_LOSS_SQM: 0,            
            REMARK: '',
            PD: 0,
            CAVITY: 0,
            STEP: 0,
            PR_NB: 0,
            MAX_PROCESS_NUMBER: 0,
            LAST_PROCESS: 0,
            INPUT_DATE: 'TOTAL',
            IS_SETTING: 'Y',
            LOSS_SQM: 0,
            USED_SQM: 0,
            PURE_INPUT:0,
            PURE_OUTPUT:0
          };
          for (let i = 0; i < loadeddata.length; i++) {
            temp_plan_data.PLAN_QTY += loadeddata[i].PLAN_QTY;
            temp_plan_data.INPUT_QTY +=  loadeddata[i].INPUT_QTY;
            temp_plan_data.REMAIN_QTY += loadeddata[i].REMAIN_QTY;
            temp_plan_data.USED_QTY += loadeddata[i].USED_QTY;
            temp_plan_data.SETTING_MET += loadeddata[i].SETTING_MET;
            temp_plan_data.PR_NG += loadeddata[i].PR_NG;
            temp_plan_data.OK_MET_AUTO += loadeddata[i].OK_MET_AUTO;
            temp_plan_data.OK_MET_TT += loadeddata[i].OK_MET_TT;
            temp_plan_data.OK_EA += loadeddata[i].OK_EA;
            temp_plan_data.OUTPUT_EA += Number(loadeddata[i].OUTPUT_EA);
            temp_plan_data.INSPECT_INPUT += Number(loadeddata[i].INSPECT_INPUT);
            temp_plan_data.INSPECT_TT_QTY += Number(loadeddata[i].INSPECT_TT_QTY);
            temp_plan_data.PURE_INPUT += Number(loadeddata[i].PURE_INPUT);
            temp_plan_data.PURE_OUTPUT += Number(loadeddata[i].PURE_OUTPUT);
          }
          temp_plan_data.LOSS_ST = (temp_plan_data.SETTING_MET / temp_plan_data.USED_QTY) * 100;
          temp_plan_data.LOSS_SX = (temp_plan_data.PR_NG / temp_plan_data.USED_QTY) * 100;
          temp_plan_data.LOSS_TT = ((temp_plan_data.SETTING_MET  + temp_plan_data.PR_NG) / temp_plan_data.USED_QTY) * 100;
          temp_plan_data.REMARK = (100 - (temp_plan_data.INSPECT_INPUT / temp_plan_data.OUTPUT_EA) * 100).toLocaleString('en-US', { maximumFractionDigits: 1 }) + "%";
          temp_plan_data.PD = (1 - (temp_plan_data.INSPECT_TT_QTY / temp_plan_data.OUTPUT_EA));
          setSummaryData(temp_plan_data);
          setPlanDataTable(loadeddata);
          //console.log('loadeddata', loadeddata);
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
  const getDailySXLossTrendingData = async (mc: string, ft: string, fr: string, td: string) => {
    await generalQuery("trasxlosstrendingdata", {
      MACHINE: mc,
      FACTORY: ft,
      FROM_DATE: fr,
      TO_DATE: td,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: SX_LOSS_TREND_DATA[] = response.data.data.map(
            (element: SX_LOSS_TREND_DATA, index: number) => {
              return {
                ...element,
                LOSS_TT: element.LOSS_ST + element.LOSS_SX,
                INPUT_DATE: moment(element.INPUT_DATE).utc().format("YYYY-MM-DD"),               
              };
            }
          );
          setSXLossTrendingData(loaded_data);
        } else {
          setSXLossTrendingData([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getDailyLossTrend = async (mc: string, ft: string, fr: string, td: string) => {
    await generalQuery("dailysxlosstrend", {
    MACHINE: mc,
    FACTORY: ft,
    FROM_DATE: fr,
    TO_DATE: td,
    })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        const loaded_data: SX_TREND_LOSS_DATA[] = response.data.data.map(
          (element: SX_TREND_LOSS_DATA, index: number) => {
            return {
              ...element,                
              INPUT_DATE: moment(element.INPUT_DATE).utc().format("YYYY-MM-DD"),   
              LOSS_RATE:  1-element.PURE_OUTPUT*1.0/element.PURE_INPUT         
            };
          }
        );
        console.log(loaded_data)
        setDailyLossTrend(loaded_data);
      } else {
        setDailyLossTrend([]);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  };
  const getWeeklyLossTrend = async (mc: string, ft: string, fr: string, td: string) => {
    await generalQuery("weeklysxlosstrend", {
      MACHINE: mc,
      FACTORY: ft,
      FROM_DATE: fr,
      TO_DATE: td,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: SX_TREND_LOSS_DATA[] = response.data.data.map(
            (element: SX_TREND_LOSS_DATA, index: number) => {
              return {
                ...element,
                LOSS_RATE:  1-element.PURE_OUTPUT*1.0/element.PURE_INPUT 
              };
            }
          );
          setWeeklyLossTrend(loaded_data);
        } else {
          setWeeklyLossTrend([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getMonthlyLossTrend = async (mc: string, ft: string, fr: string, td: string) => {
    await generalQuery("monthlysxlosstrend", {
      MACHINE: mc,
      FACTORY: ft,
      FROM_DATE: fr,
      TO_DATE: td,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: SX_TREND_LOSS_DATA[] = response.data.data.map(
            (element: SX_TREND_LOSS_DATA, index: number) => {
              return {
                ...element,
                LOSS_RATE:  1-element.PURE_OUTPUT*1.0/element.PURE_INPUT 
              };
            }
          );
          setMonthlyLossTrend(loaded_data);
        } else {
          setMonthlyLossTrend([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getYearlyLossTrend = async (mc: string, ft: string, fr: string, td: string) => {
    await generalQuery("yearlysxlosstrend", {
      MACHINE: mc,
      FACTORY: ft,
      FROM_DATE: fr,
      TO_DATE: td,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: SX_TREND_LOSS_DATA[] = response.data.data.map(
            (element: SX_TREND_LOSS_DATA, index: number) => {
              return {
                ...element,
                LOSS_RATE:  1-element.PURE_OUTPUT*1.0/element.PURE_INPUT 
              };
            }
          );
          setYearlyLossTrend(loaded_data);
        } else {
          setYearlyLossTrend([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
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
            keyExpr='id'
            height={"90vh"}
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
            }}
            onRowPrepared={(e: any) => {
              if (e.data?.EQUIPMENT_CD !== 'TOTAL') {
              }
              else {
                e.rowElement.style.background = "#ccec3a";
                e.rowElement.style.fontSize = "0.9rem";
              }
            }}
            onRowDblClick={(params: any) => {
              //console.log(params.data);
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
            <Editing
              allowUpdating={false}
              allowAdding={false}
              allowDeleting={false}
              mode='cell'
              confirmDelete={true}
              onChangesChange={(e) => { }}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
            

            <Item location="before">
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(plandatatable, "DataByRoll");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  SAVE
                </IconButton>

                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    setShowHidePivotTable(!showhidePivotTable);
                  }}
                >
                  <MdOutlinePivotTableChart color="#ff33bb" size={15} />
                  Pivot
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
            <Column dataField='PHANLOAI' caption='PHANLOAI' width={80}></Column>
            <Column dataField='INPUT_DATE' caption='INPUT_DATE' width={80}></Column>
            <Column dataField='EQUIPMENT_CD' caption='EQUIPMENT_CD' width={100}></Column>
            <Column dataField='PROD_REQUEST_NO' caption='PROD_REQUEST_NO' width={100}></Column>
            <Column dataField='PLAN_ID' caption='PLAN_ID' width={80}></Column>
            <Column dataField='PLAN_QTY' caption='PLAN_QTY' width={80} cellRender={(params: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {params.data.PLAN_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}></Column>
            <Column dataField='SX_RESULT' caption='SX_RESULT' width={80} cellRender={(params: any) => {
              return (
                <span style={{ color: "purple", fontWeight: "bold" }}>
                  {params.data.SX_RESULT?.toLocaleString("en-US")}
                </span>
              );
            }}></Column>
            <Column dataField='ACHIVEMENT_RATE' caption='ACH_RATE' width={80} cellRender={(params: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {params.data.ACHIVEMENT_RATE?.toLocaleString("en-US", {
                    style: 'percent'
                  })}
                </span>
              );
            }}></Column>
            <Column
              dataField='IS_SETTING'
              caption='IS_SETTING'
              width={80}
              cellRender={(params: any) => {
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
              }}
              allowEditing={true}
            ></Column>
            <Column dataField='PROD_MODEL' caption='PROD_MODEL' width={100}></Column>
            <Column dataField='G_NAME_KD' caption='G_NAME_KD' width={100}></Column>
            <Column dataField='M_NAME' caption='M_NAME' width={100}></Column>
            <Column dataField='WIDTH_CD' caption='WIDTH_CD' width={70}></Column>
            <Column dataField='M_LOT_NO' caption='M_LOT_NO' width={80}></Column>
            <Column dataField='INPUT_QTY' caption='INPUT_QTY' width={90} cellRender={(params: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {params.data.INPUT_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}></Column>
            <Column dataField='REMAIN_QTY' caption='REMAIN_QTY' width={90} cellRender={(params: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {params.data.REMAIN_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}></Column>
            <Column dataField='USED_QTY' caption='USED_QTY' width={90} cellRender={(params: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {params.data.USED_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}></Column>
            <Column dataField='RPM' caption='RPM' width={50}></Column>
            <Column dataField='SETTING_MET' caption='SETTING_MET' width={90} cellRender={(params: any) => {
              return (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {params.data.SETTING_MET?.toLocaleString("en-US")}
                </span>
              );
            }}></Column>
            <Column dataField='PR_NG' caption='PR_NG' width={60} cellRender={(params: any) => {
              return (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {params.data.PR_NG?.toLocaleString("en-US")}
                </span>
              );
            }}></Column>
            <Column dataField='OK_MET_AUTO' caption='OK_MET_AUTO' width={100} cellRender={(params: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {params.data.OK_MET_AUTO?.toLocaleString("en-US", {
                  })}
                </span>
              );
            }}></Column>
            <Column dataField='OK_MET_TT' caption='OK_MET_TT' width={100} cellRender={(params: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {params.data.OK_MET_TT?.toLocaleString("en-US")}
                </span>
              );
            }}></Column>
             <Column dataField='USED_SQM' caption='USED_SQM' width={70} cellRender={(params: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {params.data.USED_SQM?.toLocaleString("en-US",)}
                </span>
              );
            }}></Column>
             <Column dataField='LOSS_SQM' caption='LOSS_SQM' width={70} cellRender={(params: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {params.data.LOSS_SQM?.toLocaleString("en-US",)}
                </span>
              );
            }}></Column>
             <Column dataField='TT_LOSS_SQM' caption='TT_LOSS_SQM' width={70} cellRender={(params: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {params.data.TT_LOSS_SQM?.toLocaleString("en-US",)}
                </span>
              );
            }}></Column>

            <Column dataField='LOSS_ST' caption='LOSS_ST' width={70} cellRender={(params: any) => {
              return (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {params.data.LOSS_ST?.toLocaleString("en-US", {
                    style: 'percent'
                  })}
                </span>
              );
            }}></Column>
            <Column dataField='LOSS_SX' caption='LOSS_SX' width={70} cellRender={(params: any) => {
              return (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {params.data.LOSS_SX?.toLocaleString("en-US", {
                    style: 'percent'
                  })}
                </span>
              );
            }}></Column>
            <Column dataField='LOSS_TT' caption='LOSS_TT' width={70} cellRender={(params: any) => {
              return (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {params.data.LOSS_TT?.toLocaleString("en-US", {
                    style: 'percent'
                  })}
                </span>
              );
            }}></Column>
            <Column dataField='LOSS_TT_KT' caption='LOSS_TT_KT' width={70} cellRender={(params: any) => {
              return (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {params.data.LOSS_TT_KT?.toLocaleString("en-US", {
                    style: 'percent'
                  })}
                </span>
              );
            }}></Column>
            <Column dataField='OK_EA' caption='OK_EA' width={100} cellRender={(params: any) => {
              return (
                <span style={{ color: "gray", fontWeight: "bold" }}>
                  {params.data.OK_EA?.toLocaleString("en-US")}
                </span>
              );
            }}></Column>
            <Column dataField='OUTPUT_EA' caption='OUTPUT_EA' width={100} cellRender={(params: any) => {
              return (
                <span style={{ color: "gray", fontWeight: "bold" }}>
                  {params.data.OUTPUT_EA?.toLocaleString("en-US")}
                </span>
              );
            }}></Column>
            <Column dataField='INSPECT_INPUT' caption='INSPECT_INPUT' width={100} cellRender={(params: any) => {
              return (
                <span style={{ color: "gray", fontWeight: "bold" }}>
                  {params.data.INSPECT_INPUT?.toLocaleString("en-US")}
                </span>
              );
            }}></Column>
            <Column dataField='INSPECT_TT_QTY' caption='INSPECT_TT_QTY' width={100} cellRender={(params: any) => {
              return (
                <span style={{ color: "gray", fontWeight: "bold" }}>
                  {params.data.INSPECT_TT_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}></Column>
            <Column dataField='INSPECT_OK_QTY' caption='INSPECT_OK_QTY' width={100} cellRender={(params: any) => {
              return (
                <span style={{ color: "gray", fontWeight: "bold" }}>
                  {params.data.INSPECT_OK_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}></Column>
            <Column dataField='INSPECT_OK_SQM' caption='INSPECT_OK_SQM' width={100} cellRender={(params: any) => {
              return (
                <span style={{ color: "gray", fontWeight: "bold" }}>
                  {params.data.INSPECT_OK_SQM?.toLocaleString("en-US")}
                </span>
              );
            }}></Column>
            <Column dataField='REMARK' caption='REMARK' width={100} cellRender={(params: any) => {
              if (params.data.EQUIPMENT_CD === 'TOTAL') {
                return (
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {params.data.REMARK}
                  </span>
                );
              }
              else {
                return (
                  <span>
                    {params.data.REMARK}
                  </span>
                );
              }
            }}></Column>
            <Column dataField='PD' caption='PD' width={50} cellRender={(params: any) => {
              return (
                <span>
                  {params.data.PD}
                </span>
              );
            }}></Column>
            <Column dataField='CAVITY' caption='CAVITY' width={50}></Column>
            <Column dataField='STEP' caption='STEP' width={50}></Column>
            <Column dataField='PR_NB' caption='PR_NB' width={50}></Column>
            <Column dataField='MAX_PROCESS_NUMBER' caption='MAX_PROCESS_NUMBER' width={50}></Column>
            <Column dataField='LAST_PROCESS' caption='LAST_PROCESS' width={50}></Column>
            <Column dataField='id' caption='ID' width={50}></Column>
            <Summary>
              <TotalItem
                alignment='right'
                column='id'
                summaryType='count'
                valueFormat={"decimal"}
              />
              <TotalItem
                alignment='right'
                column='M_LOT_NO'
                summaryType='count'
                valueFormat={"decimal"}
              />
              <TotalItem
                alignment="right"
                column="INPUT_QTY"
                summaryType="sum"
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment="right"
                column="REMAIN_QTY"
                summaryType="sum"
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment="right"
                column="USED_QTY"
                summaryType="sum"
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment="right"
                column="SETTING_MET"
                summaryType="sum"
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment="right"
                column="PR_NG"
                summaryType="sum"
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment="right"
                column="OK_MET_AUTO"
                summaryType="sum"
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment="right"
                column="OK_MET_TT"
                summaryType="sum"
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment="right"
                column="OK_EA"
                summaryType="sum"
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment="right"
                column="OUTPUT_EA"
                summaryType="sum"
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment="right"
                column="INSPECT_INPUT"
                summaryType="sum"
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment="right"
                column="INSPECT_TT_QTY"
                summaryType="sum"
                valueFormat={"thousands"}
              />
            </Summary>
          </DataGrid>
        </CustomResponsiveContainer>
      </div>
    ),
    [plandatatable, columns, trigger]
  );
  const productionLossTrendingchartMM = useMemo(() => {
    return (
      <Chart
        id='workforcechart'
        dataSource={sxlosstrendingdata}
        height={500}
        width={'2000px'}
        resolveLabelOverlapping='stack'
      >
        <Title
          text={`DAILY PRODUCTION LOSS TRENDING`}
          subtitle={`[${fromdate} ~ ${todate}] [${machine}] -[${factory}]`}
        />
        <ArgumentAxis title='PRODUCTION DATE' />
        <ValueAxis position='left' title='Loss (%)' />    
       
        <CommonSeriesSettings
          argumentField='INPUT_DATE'
          hoverMode='allArgumentPoints'
          selectionMode='allArgumentPoints'
        >
          <Label visible={true}>
            <Format type='fixedPoint' precision={0} />
          </Label>
        </CommonSeriesSettings>
        <Series        
          argumentField='INPUT_DATE'
          valueField='LOSS_ST'
          name='SETTING LOSS'
          color='#019623'
          type='line'
        >
          <Label
            visible={true}
            customizeText={(e: any) => {
              return `${e.value.toLocaleString("en-US", {
                maximumFractionDigits: 1,
              })}%`;
            }}
          />
        </Series>
        <Series         
          argumentField='INPUT_DATE'
          valueField='LOSS_SX'
          name='SX LOSS'
          color='#ce45ed'
          type='line'
        >
          <Label
            visible={true}
            customizeText={(e: any) => {
              return `${e.value.toLocaleString("en-US", {
                maximumFractionDigits: 1,
              })}%`;
            }}
          />
        </Series>        
        <Series         
          argumentField='INPUT_DATE'
          valueField='LOSS_TT'
          name='LOSS_TT'
          color='#f5aa42'
          type='bar'
        >
          <Label
            visible={true}
            customizeText={(e: any) => {
              return `${e.value.toLocaleString("en-US", {
                maximumFractionDigits: 1,
              })}%`;
            }}
          />
        </Series>        
        <Legend
          verticalAlignment='bottom'
          horizontalAlignment='center'
        ></Legend>
      </Chart>
    );
  }, [sxlosstrendingdata]);
  const columns_loss = [
    {
      field: 'PHANLOAI',
      headerName: 'PHANLOAI',
      width: 60
    },
    {
      field: 'INPUT_DATE',
      headerName: 'INPUT_DATE',
      width: 60
    },
    {
      field: 'EQUIPMENT_CD',
      headerName: 'EQ',
      width: 30
    },
    {
      field: 'PROD_REQUEST_NO',
      headerName: 'YCSX_NO',
      width: 50
    },
    {
      field: 'PLAN_ID',
      headerName: 'PLAN_ID',
      width: 50,
    
    },
    {
      field: 'PLAN_QTY',
      headerName: 'PLAN_QTY',
      width: 60,
      cellRenderer :(params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {params.data.PLAN_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
      
    },
    {
      field: 'SX_RESULT',
      headerName: 'SX_RESULT',
      width: 70,      
      cellRenderer :(params: any) => {
        return (
          <span style={{ color: "purple", fontWeight: "bold" }}>
            {params.data.SX_RESULT?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'ACHIVEMENT_RATE',
      headerName: 'ACH_RATE',
      width: 70,
      cellRenderer : (params: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {params.data.ACHIVEMENT_RATE?.toLocaleString("en-US", {
              style: 'percent'
            })}
          </span>
        );
      }
    },
    {
      field: 'IS_SETTING',
      headerName: 'IS_SETTING',
      width: 70,
      cellRenderer :(params: any) => {
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
      field: 'PROD_MODEL',
      headerName: 'PROD_MODEL',
      width: 70
    },
    {
      field: 'G_NAME_KD',
      headerName: 'G_NAME_KD',
      width: 70
    },
    {
      field: 'M_NAME',
      headerName: 'M_NAME',
      width: 70
    },
    {
      field: 'WIDTH_CD',
      headerName: 'WIDTH_CD',
      width: 70
    },
    {
      field: 'M_LOT_NO',
      headerName: 'M_LOT_NO',
      width: 70
    },
    {
      field: 'INPUT_QTY',
      headerName: 'INPUT_QTY',
      width: 70,
      cellRenderer:(params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {params.data.INPUT_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'REMAIN_QTY',
      headerName: 'REMAIN_QTY',
      width: 70,
      cellRenderer:(params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {params.data.REMAIN_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'USED_QTY',
      headerName: 'USED_QTY',
      width: 70,
      cellRenderer:(params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {params.data.USED_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'RPM',
      headerName: 'RPM',
      width: 70
    },
    {
      field: 'SETTING_MET',
      headerName: 'SETTING_MET',
      width: 70,
      cellRenderer:(params: any) => {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {params.data.SETTING_MET?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'PR_NG',
      headerName: 'PR_NG',
      width: 70,
      cellRenderer:(params: any) => {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {params.data.PR_NG?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'OK_MET_AUTO',
      headerName: 'OK_MET_AUTO',
      width: 80,
      cellRender:(params: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {params.data.OK_MET_AUTO?.toLocaleString("en-US", {
            })}
          </span>
        );
      }
    },
    {
      field: 'OK_MET_TT',
      headerName: 'OK_MET_TT',
      width: 70,
      cellRenderer:(params: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {params.data.OK_MET_TT?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'USED_SQM',
      headerName: 'USED_SQM',
      width: 70,
      cellRenderer:(params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {params.data.USED_SQM?.toLocaleString("en-US",)}
          </span>
        );
      }
    },
    {
      field: 'LOSS_SQM',
      headerName: 'LOSS_SQM',
      width: 70,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {params.data.LOSS_SQM?.toLocaleString("en-US",)}
          </span>
        );
      }
    },
    {
      field: 'TT_LOSS_SQM',
      headerName: 'TT_LOSS_SQM',
      width: 70,
      cellRenderer:(params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {params.data.TT_LOSS_SQM?.toLocaleString("en-US",)}
          </span>
        );
      }
    },
    {
      field: 'LOSS_ST',
      headerName: 'LOSS_ST',
      width: 70,
      cellRenderer:(params: any) => {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {params.data.LOSS_ST?.toLocaleString("en-US", {
              style: 'percent'
            })}
          </span>
        );
      }
    },
    {
      field: 'LOSS_SX',
      headerName: 'LOSS_SX',
      width: 70,
      cellRenderer:(params: any) => {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {params.data.LOSS_SX?.toLocaleString("en-US", {
              style: 'percent'
            })}
          </span>
        );
      }
    },
    {
      field: 'LOSS_TT',
      headerName: 'LOSS_TT',
      width: 70,
      cellRenderer:(params: any) => {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {params.data.LOSS_TT?.toLocaleString("en-US", {
              style: 'percent'
            })}
          </span>
        );
      }
    },
    {
      field: 'LOSS_TT_KT',
      headerName: 'LOSS_TT_KT',
      width: 70,
      cellRenderer:(params: any) => {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {params.data.LOSS_TT_KT?.toLocaleString("en-US", {
              style: 'percent'
            })}
          </span>
        );
      }
    },
    {
      field: 'OK_EA',
      headerName: 'OK_EA',
      width: 70,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray", fontWeight: "bold" }}>
            {params.data.OK_EA?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'OUTPUT_EA',
      headerName: 'OUTPUT_EA',
      width: 70,
      cellRenderer:(params: any) => {
        return (
          <span style={{ color: "gray", fontWeight: "bold" }}>
            {params.data.OUTPUT_EA?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'INSPECT_INPUT',
      headerName: 'INSPECT_INPUT',
      width: 90,
      cellRenderer:(params: any) => {
        return (
          <span style={{ color: "gray", fontWeight: "bold" }}>
            {params.data.INSPECT_INPUT?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'INSPECT_TT_QTY',
      headerName: 'INSPECT_TT_QTY',
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray", fontWeight: "bold" }}>
            {params.data.INSPECT_TT_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'INSPECT_OK_QTY',
      headerName: 'INSPECT_OK_QTY',
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray", fontWeight: "bold" }}>
            {params.data.INSPECT_OK_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'INSPECT_OK_SQM',
      headerName: 'INSPECT_OK_SQM',
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray", fontWeight: "bold" }}>
            {params.data.INSPECT_OK_SQM?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'REMARK',
      headerName: 'REMARK',
      width: 70,
      cellRenderer: (params: any) => {
        if (params.data.EQUIPMENT_CD === 'TOTAL') {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.data.REMARK}
            </span>
          );
        }
        else {
          return (
            <span>
              {params.data.REMARK}
            </span>
          );
        }
      }
    },
    {
      field: 'PD',
      headerName: 'PD',
      width: 70
    },
    {
      field: 'CAVITY',
      headerName: 'CAVITY',
      width: 70
    },
    {
      field: 'STEP',
      headerName: 'STEP',
      width: 70
    },
    {
      field: 'PR_NB',
      headerName: 'PR_NB',
      width: 70
    },
    {
      field: 'MAX_PROCESS_NUMBER',
      headerName: 'MAX_PRNB',
      width: 70
    },
    {
      field: 'LAST_PROCESS',
      headerName: 'LAST_PROCESS',
      width: 80
    },
    {
      field: 'id',
      headerName: 'ID',
      width: 40
    },
  ]

  const loss_data_ag_table = useMemo(() => {
    return (
      <AGTable        
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={
          <div>           
          </div>}
        columns={columns_loss}
        data={plandatatable}
        onCellEditingStopped={(params: any) => {
        }}
        onCellClick={async (params: any) => {
          //setSelectedRows(params.data)
         

        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
         
        }}     />   
    )
  }, [plandatatable, columns_loss]);

  const dataSource = new PivotGridDataSource({
    fields: [
      {
        caption: 'PHANLOAI',
        width: 80,
        dataField: 'PHANLOAI',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'INPUT_DATE',
        width: 80,
        dataField: 'INPUT_DATE',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'IS_SETTING',
        width: 80,
        dataField: 'IS_SETTING',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'EQUIPMENT_CD',
        width: 80,
        dataField: 'EQUIPMENT_CD',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'PROD_REQUEST_NO',
        width: 80,
        dataField: 'PROD_REQUEST_NO',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'PLAN_ID',
        width: 80,
        dataField: 'PLAN_ID',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'PLAN_QTY',
        width: 80,
        dataField: 'PLAN_QTY',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'SX_RESULT',
        width: 80,
        dataField: 'SX_RESULT',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'ACHIVEMENT_RATE',
        width: 80,
        dataField: 'ACHIVEMENT_RATE',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'PROD_MODEL',
        width: 80,
        dataField: 'PROD_MODEL',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'G_NAME_KD',
        width: 80,
        dataField: 'G_NAME_KD',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'M_NAME',
        width: 80,
        dataField: 'M_NAME',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'WIDTH_CD',
        width: 80,
        dataField: 'WIDTH_CD',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'WH_OUT',
        width: 80,
        dataField: 'WH_OUT',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'M_LOT_NO',
        width: 80,
        dataField: 'M_LOT_NO',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'INPUT_QTY',
        width: 80,
        dataField: 'INPUT_QTY',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'REMAIN_QTY',
        width: 80,
        dataField: 'REMAIN_QTY',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'USED_QTY',
        width: 80,
        dataField: 'USED_QTY',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'RPM',
        width: 80,
        dataField: 'RPM',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'SETTING_MET',
        width: 80,
        dataField: 'SETTING_MET',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'PR_NG',
        width: 80,
        dataField: 'PR_NG',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'OK_MET_AUTO',
        width: 80,
        dataField: 'OK_MET_AUTO',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'OK_MET_TT',
        width: 80,
        dataField: 'OK_MET_TT',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'LOSS_ST',
        width: 80,
        dataField: 'LOSS_ST',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'LOSS_SX',
        width: 80,
        dataField: 'LOSS_SX',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'OK_EA',
        width: 80,
        dataField: 'OK_EA',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'OUTPUT_EA',
        width: 80,
        dataField: 'OUTPUT_EA',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'INSPECT_INPUT',
        width: 80,
        dataField: 'INSPECT_INPUT',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'INSPECT_TT_QTY',
        width: 80,
        dataField: 'INSPECT_TT_QTY',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'REMARK',
        width: 80,
        dataField: 'REMARK',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'PD',
        width: 80,
        dataField: 'PD',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'CAVITY',
        width: 80,
        dataField: 'CAVITY',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'STEP',
        width: 80,
        dataField: 'STEP',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'PR_NB',
        width: 80,
        dataField: 'PR_NB',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'MAX_PROCESS_NUMBER',
        width: 80,
        dataField: 'MAX_PROCESS_NUMBER',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'LAST_PROCESS',
        width: 80,
        dataField: 'LAST_PROCESS',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      },
    ],
    store: plandatatable,
  });
  const initFunction = async () => {
    Swal.fire({
      title: "Đang tải báo cáo",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    
    Promise.all([
      loadBaoCaoTheoRoll(),
      getDailySXLossTrendingData(machine, factory, fromdate,todate),
      getDailyLossTrend(machine, factory, fromdate,todate),
      getWeeklyLossTrend(machine, factory, fromdate,todate),
      getMonthlyLossTrend(machine, factory, fromdate,todate),
      getYearlyLossTrend(machine, factory, fromdate,todate)
      /* getPatrolHeaderData(fromdate, todate), */
    ]).then((values) => {
      Swal.fire("Thông báo", "Đã load xong báo cáo", 'success');
    });    
  }
    
  useEffect(() => {
    getMachineList();
    //initFunction();
    /* getDailySXLossTrendingData(machine,factory, moment().add(-8, "day").format("YYYY-MM-DD"), moment().add(0, "day").format("YYYY-MM-DD"));
    loadBaoCaoTheoRoll(); */
    
    return () => {
      /* window.clearInterval(intervalID);       */
    };
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className='baocaotheoroll'>
      <div className='tracuuDataInspection'>
        <div className='tracuuYCSXTable'>
          <div className='header'>
            <div className='forminput'>
              <div className='forminputcolumn'>
                <label>
                  <b>From Date:</b>
                  <input
                    type='date'
                    value={fromdate.slice(0, 10)}
                    onChange={(e) => setFromDate(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>To Date:</b>
                  <input
                    type='date'
                    value={todate.slice(0, 10)}
                    onChange={(e) => setToDate(e.target.value)}
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
                    <option value='NM1'>ALL</option>
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
              </div>
              <div className='forminputcolumn'>
                <button
                  className='tranhatky'
                  onClick={() => {
                    setisLoading(true);
                    setReadyRender(false);
                    initFunction();
                  }}
                >
                  Tra PLAN
                </button>
              </div>
            </div>
          </div>
          <div className="graph">           
             {productionLossTrendingchartMM}          
          </div>
         
          
          <div className="graph2">   
            <div className="childgraph">
              <SX_DailyLossTrend dldata={dailyLossTrend} processColor="#53eb34" materialColor="#ff0000" />
            </div>
            <div className="childgraph">
              <SX_WeeklyLossTrend dldata={[...weeklyLossTrend].reverse()} processColor="#53eb34" materialColor="#ff0000" />
            </div>
            <div className="childgraph">
              <SX_MonthlyLossTrend dldata={[...monthyLossTrend].reverse()} processColor="#53eb34" materialColor="#ff0000" />
            </div>
            <div className="childgraph">
              <SX_YearlyLossTrend dldata={[...yearlyLossTrend].reverse()} processColor="#53eb34" materialColor="#ff0000" />
            </div> 
          </div>
          <div className='lossinfo'>
            <table>
              <thead>
                <tr>
                  <td style={{ color: "black", fontWeight: "normal" }}>
                    1.INPUT_QTY
                  </td>
                  <td style={{ color: "black", fontWeight: "normal" }}>
                    2.REMAIN_QTY
                  </td>
                  <td style={{ color: "black", fontWeight: "normal" }}>
                    3.USED_QTY
                  </td>
                  <td style={{ color: "black", fontWeight: "normal" }}>
                    4.SETTING_MET
                  </td>
                  <td style={{ color: "black", fontWeight: "normal" }}>
                    5.PROCESS_NG
                  </td>
                  <td style={{ color: "black", fontWeight: "normal" }}>
                    6.OK_MET_AUTO
                  </td>
                  <td style={{ color: "black", fontWeight: "normal" }}>
                    7.OK_MET_TT
                  </td>
                  <td style={{ color: "black", fontWeight: "normal" }}>
                    8.ST_LOSS
                  </td>
                  <td style={{ color: "black", fontWeight: "normal" }}>
                    9.SX_LOSS
                  </td>
                  <td style={{ color: "black", fontWeight: "normal" }}>
                    10.LOSS_TT
                  </td>
                  <td style={{ color: "black", fontWeight: "normal" }}>
                    11.OK_EA
                  </td>
                  <td style={{ color: "black", fontWeight: "normal" }}>
                    11.PURE_IN
                  </td>
                  <td style={{ color: "black", fontWeight: "normal" }}>
                    12.PURE_OUT
                  </td>
                  <td style={{ color: "black", fontWeight: "normal" }}>
                    13.ALL_LOSS
                  </td>
                  {/* <th style={{ color: "black", fontWeight: "normal" }}>
                    11.OUTPUT_EA
                  </th>
                  <th style={{ color: "black", fontWeight: "normal" }}>
                    12.INSPECT_INPUT
                  </th>
                  <th style={{ color: "black", fontWeight: "normal" }}>
                    13.INSPECT_TOTAL
                  </th>
                  <th style={{ color: "black", fontWeight: "normal" }}>
                    14.RATE1
                  </th>
                  <th style={{ color: "black", fontWeight: "normal" }}>
                    15.RATE2
                  </th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ color: "#360EEA", fontWeight: "bold" }}>
                    {summarydata.INPUT_QTY?.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {summarydata.REMAIN_QTY?.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {summarydata.USED_QTY?.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td style={{ color: "red", fontWeight: "normal" }}>
                    {summarydata.SETTING_MET?.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td style={{ color: "red", fontWeight: "normal" }}>
                    {summarydata.PR_NG?.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {summarydata.OK_MET_AUTO?.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {summarydata.OK_MET_TT?.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td style={{ color: "red", fontWeight: "normal" }}>
                    {summarydata.LOSS_ST?.toLocaleString("en-US", {
                      maximumFractionDigits: 1,
                    })}
                    %
                  </td>
                  <td style={{ color: "red", fontWeight: "normal" }}>
                    {summarydata.LOSS_SX?.toLocaleString("en-US", {
                      maximumFractionDigits: 1,
                    })}
                    %
                  </td>
                  <td style={{ color: "red", fontWeight: "bold" }}>
                    {summarydata.LOSS_TT?.toLocaleString("en-US", {
                      maximumFractionDigits: 1,
                    })}
                    %
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {summarydata.OK_EA?.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td style={{ color: "blue", fontWeight: "bold" }}>
                    {summarydata.PURE_INPUT?.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td style={{ color: "blue", fontWeight: "bold" }}>
                    {summarydata.PURE_OUTPUT?.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td style={{ color: "red", fontWeight: "bold" }}>
                    {(1-summarydata.PURE_OUTPUT*1.0/summarydata.PURE_INPUT)?.toLocaleString("en-US", {
                      style: 'percent',
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  {/* <td style={{ color: "green", fontWeight: "bold" }}>
                    {summarydata.OUTPUT_EA?.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {summarydata.INSPECT_INPUT?.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {summarydata.INSPECT_TT_QTY?.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td style={{ color: "#EA0EBA", fontWeight: "bold" }}>
                    {summarydata.REMARK}
                  </td>
                  <td style={{ color: "#EA0EBA", fontWeight: "bold" }}>
                    {(summarydata.PD * 100)?.toLocaleString("en-US", {
                      maximumFractionDigits: 1,
                    })}%
                  </td> */}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="datatable">
          {loss_data_ag_table}
          </div>
          
        </div>
      </div>      
      {showhidePivotTable && (
          <div className="pivottable1">
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowHidePivotTable(false);
              }}
            >
              <AiFillCloseCircle color="blue" size={15} />
              Close
            </IconButton>
            <PivotTable datasource={dataSource} tableID="invoicetablepivot" />
          </div>
        )}

    </div>
  );
};
export default BAOCAOTHEOROLL;
