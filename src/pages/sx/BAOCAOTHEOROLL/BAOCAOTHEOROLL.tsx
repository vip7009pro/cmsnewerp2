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
import Swal from "sweetalert2";


import "./BAOCAOTHEOROLL.scss";
import { useSelector } from "react-redux";
import { MACHINE_LIST, SX_ACHIVE_DATE, SX_BAOCAOROLLDATA, UserData } from "../../../api/GlobalInterface";
import { generalQuery } from "../../../api/Api";
import { RootState } from "../../../redux/store";
import { CustomResponsiveContainer } from "../../../api/GlobalFunction";


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
      console.log(dataGridRef.current);
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
  const [readyRender, setReadyRender] = useState(false);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [factory, setFactory] = useState("ALL");
  const [machine, setMachine] = useState("ALL");
  const [plandatatable, setPlanDataTable] = useState<SX_BAOCAOROLLDATA[]>([]);
  const [summarydata, setSummaryData] = useState<SX_BAOCAOROLLDATA>({
    id: -1,
    EQUIPMENT_CD: 'TOTAL',
    PROD_REQUEST_NO: 'TOTAL',
    PLAN_ID: 'TOTAL',
    PLAN_QTY: 0,
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
    OK_EA: 0,
    OUTPUT_EA: 0,
    INSPECT_INPUT: 0,
    INSPECT_TT_QTY: 0,
    REMARK: '',
    PD: 0,
    CAVITY: 0,
    STEP: 0,
    PR_NB: 0,
    MAX_PROCESS_NUMBER: 0,
    LAST_PROCESS: 0,
    INPUT_DATE:'TOTAL',
    IS_SETTING:'Y'

  });
  const qlsxplandatafilter = useRef<SX_BAOCAOROLLDATA[]>([]);
  const loadBaoCaoTheoRoll = (from_date: string) => {
    //console.log(todate);
    generalQuery("loadBaoCaoTheoRoll", {
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
            EQUIPMENT_CD: 'TOTAL',
            PROD_REQUEST_NO: 'TOTAL',
            PLAN_ID: 'TOTAL',
            PLAN_QTY: 0,
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
            OK_EA: 0,
            OUTPUT_EA: 0,
            INSPECT_INPUT: 0,
            INSPECT_TT_QTY: 0,
            REMARK: '',
            PD: 0,
            CAVITY: 0,
            STEP: 0,
            PR_NB: 0,
            MAX_PROCESS_NUMBER: 0,
            LAST_PROCESS: 0,
            INPUT_DATE:'TOTAL',
            IS_SETTING:'Y'
          };
          for (let i = 0; i < loadeddata.length; i++) {
            temp_plan_data.PLAN_QTY += loadeddata[i].PLAN_QTY;
            temp_plan_data.INPUT_QTY += loadeddata[i].INPUT_QTY;
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
          }
          temp_plan_data.LOSS_ST = (temp_plan_data.SETTING_MET / temp_plan_data.USED_QTY) * 100;
          temp_plan_data.LOSS_SX = (temp_plan_data.PR_NG / temp_plan_data.USED_QTY) * 100;
          temp_plan_data.REMARK = (100 - (temp_plan_data.INSPECT_INPUT / temp_plan_data.OUTPUT_EA) * 100).toLocaleString('en-US', {maximumFractionDigits:1}) + "%";
          temp_plan_data.PD = (1-(temp_plan_data.INSPECT_TT_QTY / temp_plan_data.OUTPUT_EA));
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
              <Item location='before'>
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
            <Column dataField='INPUT_DATE' caption='INPUT_DATE' width={80}></Column>
            <Column dataField='CUST_NAME_KD' caption='CUST' width={80}></Column>
            <Column dataField='EQUIPMENT_CD' caption='EQUIPMENT_CD' width={100}></Column>
            <Column dataField='PROD_REQUEST_NO' caption='PROD_REQUEST_NO' width={100}></Column>
            <Column dataField='PLAN_ID' caption='PLAN_ID' width={100}></Column>            
            <Column
              dataField='IS_SETTING'
              caption='IS_SETTING'
              width={80}
              cellRender={(params: any) => {
                if(params.data.IS_SETTING ==='Y')
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
            <Column dataField='WIDTH_CD' caption='WIDTH_CD' width={100}></Column>
            <Column dataField='M_LOT_NO' caption='M_LOT_NO' width={100}></Column>
            <Column dataField='INPUT_QTY' caption='INPUT_QTY' width={100} cellRender={(params: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {params.data.INPUT_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}></Column>
            <Column dataField='REMAIN_QTY' caption='REMAIN_QTY' width={100} cellRender={(params: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {params.data.REMAIN_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}></Column>
            <Column dataField='USED_QTY' caption='USED_QTY' width={100} cellRender={(params: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {params.data.USED_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}></Column>
            <Column dataField='RPM' caption='RPM' width={100}></Column>
            <Column dataField='SETTING_MET' caption='SETTING_MET' width={100} cellRender={(params: any) => {
              return (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {params.data.SETTING_MET?.toLocaleString("en-US")}
                </span>
              );
            }}></Column>
            <Column dataField='PR_NG' caption='PR_NG' width={100} cellRender={(params: any) => {
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
            <Column dataField='LOSS_ST' caption='LOSS_ST' width={100} cellRender={(params: any) => {
              if (params.data.EQUIPMENT_CD === 'TOTAL') {
                return (
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {params.data.LOSS_ST?.toLocaleString("en-US")}
                  </span>
                );
              }
              else {
                return (
                  <span style={{ color: "gray", fontWeight: "bold" }}>
                    {params.data.LOSS_ST?.toLocaleString("en-US")}
                  </span>
                );
              }

            }}></Column>
            <Column dataField='LOSS_SX' caption='LOSS_SX' width={100} cellRender={(params: any) => {
              if (params.data.EQUIPMENT_CD === 'TOTAL') {
                return (
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {params.data.LOSS_SX?.toLocaleString("en-US")}
                  </span>
                );
              }
              else {
                return (
                  <span style={{ color: "gray", fontWeight: "bold" }}>
                    {params.data.LOSS_SX?.toLocaleString("en-US")}
                  </span>
                );
              }

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
            <Column dataField='PD' caption='PD' width={100} cellRender={(params: any) => {
              if (params.data.EQUIPMENT_CD === 'TOTAL') {
                return (
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {(params.data.PD*100).toLocaleString("en-US")}%
                  </span>
                );
              }
              else {
                return (
                  <span>
                    {params.data.PD}
                  </span>
                );

              }

            }}></Column>
            <Column dataField='CAVITY' caption='CAVITY' width={100}></Column>
            <Column dataField='STEP' caption='STEP' width={100}></Column>
            <Column dataField='PR_NB' caption='PR_NB' width={100}></Column>
            <Column dataField='MAX_PROCESS_NUMBER' caption='MAX_PROCESS_NUMBER' width={100}></Column>
            <Column dataField='LAST_PROCESS' caption='LAST_PROCESS' width={100}></Column>
            <Column dataField='id' caption='ID' width={100}></Column>
            <Summary>
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

  useEffect(() => {
    getMachineList();
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
                    loadBaoCaoTheoRoll(fromdate);
                  }}
                >
                  Tra PLAN
                </button>
              </div>
            </div>
          </div>
          <div className='lossinfo'>
              <table>
                <thead>
                  <tr>                  
                    <th style={{ color: "black", fontWeight: "normal" }}>
                      1.INPUT_QTY
                    </th>
                    <th style={{ color: "black", fontWeight: "normal" }}>
                      2.REMAIN_QTY
                    </th>
                    <th style={{ color: "black", fontWeight: "normal" }}>
                      3.USED_QTY
                    </th>
                    <th style={{ color: "black", fontWeight: "normal" }}>
                      4.SETTING_MET
                    </th>
                    <th style={{ color: "black", fontWeight: "normal" }}>
                      5.PROCESS_NG
                    </th>
                    <th style={{ color: "black", fontWeight: "normal" }}>
                      6.OK_MET_AUTO
                    </th>
                    <th style={{ color: "black", fontWeight: "normal" }}>
                      7.OK_MET_TT
                    </th>
                    <th style={{ color: "black", fontWeight: "normal" }}>
                      8.ST_LOSS
                    </th>
                    <th style={{ color: "black", fontWeight: "normal" }}>
                      9.SX_LOSS
                    </th>
                    <th style={{ color: "black", fontWeight: "normal" }}>
                      10.OK_EA
                    </th>
                    <th style={{ color: "black", fontWeight: "normal" }}>
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
                    </th>
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
                    <td style={{ color: "red", fontWeight: "bold" }}>
                      {summarydata.SETTING_MET?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "red", fontWeight: "bold" }}>
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
                    <td style={{ color: "red", fontWeight: "bold" }}>
                      {summarydata.LOSS_ST?.toLocaleString("en-US", {
                        maximumFractionDigits: 1,
                      })}
                      %
                    </td>
                    <td style={{ color: "red", fontWeight: "bold" }}>
                      {summarydata.LOSS_SX?.toLocaleString("en-US", {
                        maximumFractionDigits: 1,
                      })}
                      %
                    </td>
                    <td style={{ color: "green", fontWeight: "bold" }}>
                      {summarydata.OK_EA?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "green", fontWeight: "bold" }}>
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
                      {(summarydata.PD*100)?.toLocaleString("en-US", {
                        maximumFractionDigits: 1,
                      })}%                  
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>
          {planDataTable}
        </div>
      </div>
    </div>
  );
};
export default BAOCAOTHEOROLL;
