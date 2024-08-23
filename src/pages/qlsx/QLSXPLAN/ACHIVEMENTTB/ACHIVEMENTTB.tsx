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
import { generalQuery } from "../../../../api/Api";
import { UserContext } from "../../../../api/Context";
import {
  checkBP,
  CustomResponsiveContainer,
  f_getMachineListData,
  SaveExcel,
  zeroPad,
} from "../../../../api/GlobalFunction";
import "./ACHIVEMENTTB.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
  MACHINE_LIST,
  QLSXCHITHIDATA,
  QLSXPLANDATA,
  SX_ACHIVE_DATE,
  UserData,
} from "../../../../api/GlobalInterface";

const ACHIVEMENTTB = () => {
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
  const getMachineList = async () => {
    setMachine_List(await f_getMachineListData());    
  };
  const [columns, setColumns] = useState<Array<any>>([]);
  const [readyRender, setReadyRender] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [factory, setFactory] = useState("NM1");
  const [machine, setMachine] = useState("ALL");
  const [plandatatable, setPlanDataTable] = useState<SX_ACHIVE_DATE[]>([]);
  const [summarydata, setSummaryData] = useState<SX_ACHIVE_DATE>({
    id:0,
    DAY_RATE: 0,
    EQ_NAME: 'TOTAL',
    G_NAME_KD:'TOTAL',
    NIGHT_RATE:0,
    PLAN_DAY:0,
    PLAN_NIGHT:0,
    PLAN_TOTAL:0,
    PROD_REQUEST_NO:'TOTAL',
    RESULT_DAY:0,
    RESULT_NIGHT:0,
    RESULT_TOTAL:0,
    STEP:0,
    TOTAL_RATE:0
  });
  const qlsxplandatafilter = useRef<SX_ACHIVE_DATE[]>([]);
  const loadTiLeDat = (plan_date: string) => {
    //console.log(todate);
    generalQuery("loadtiledat", {
      PLAN_DATE: plan_date,
      MACHINE: machine,
      FACTORY: factory,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata: SX_ACHIVE_DATE[] = response.data.data.map(
            (element: SX_ACHIVE_DATE, index: number) => {
              
              return {
                ...element,                
                id: index,
              };
            }
          );
          //console.log(loadeddata);
          let temp_plan_data: SX_ACHIVE_DATE = {
            id: -1,
            DAY_RATE: 0,
            EQ_NAME: 'TOTAL',
            G_NAME_KD: 'TOTAL',
            NIGHT_RATE: 0,
            PLAN_DAY: 0,
            PLAN_NIGHT: 0,
            PLAN_TOTAL: 0,
            PROD_REQUEST_NO: 'TOTAL',
            RESULT_DAY: 0,
            RESULT_NIGHT: 0,
            RESULT_TOTAL: 0,
            STEP: 0,
            TOTAL_RATE: 0
          };          
          for (let i = 0; i < loadeddata.length; i++) {
            temp_plan_data.PLAN_DAY += loadeddata[i].PLAN_DAY;
            temp_plan_data.PLAN_NIGHT += loadeddata[i].PLAN_NIGHT;
            temp_plan_data.PLAN_TOTAL += loadeddata[i].PLAN_TOTAL;                        
            temp_plan_data.RESULT_DAY += loadeddata[i].RESULT_DAY;                        
            temp_plan_data.RESULT_NIGHT += loadeddata[i].RESULT_NIGHT;                        
            temp_plan_data.RESULT_TOTAL += loadeddata[i].RESULT_TOTAL;                        
          }
          temp_plan_data.DAY_RATE = (temp_plan_data.RESULT_DAY / temp_plan_data.PLAN_DAY) * 100;
          temp_plan_data.NIGHT_RATE = (temp_plan_data.RESULT_NIGHT / temp_plan_data.PLAN_NIGHT) * 100;
          temp_plan_data.TOTAL_RATE = (temp_plan_data.RESULT_TOTAL / temp_plan_data.PLAN_TOTAL) * 100;

          setSummaryData(temp_plan_data);

          setPlanDataTable([temp_plan_data, ...loadeddata, ]);
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
            height={"93vh"}
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
              if(e.data?.EQ_NAME !=='TOTAL')
              {
                if (parseInt(e.data?.EQ_NAME.substring(2, 4)) % 2 === 0)
                e.rowElement.style.background = "#BEC7C0";
              }
              else
              {                
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
              allowUpdating={true}
              allowAdding={true}
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
            <Column
              dataField='EQ_NAME'
              caption='EQ_NAME'
              width={80}
              allowEditing={false}
            ></Column>            
            <Column
              dataField='PROD_REQUEST_NO'
              caption='YCSX_NO'
              width={100}
              allowEditing={false}
            ></Column>            
            <Column
              dataField='G_NAME_KD'
              caption='CODE KD'
              width={120}
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
              dataField='STEP'
              caption='STEP'
              width={50}
              allowEditing={false}
            ></Column>
            <Column
              dataField='PLAN_DAY'
              caption='PLAN_DAY'
              width={90}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "gray", fontWeight: "normal" }}>
                    {params.data.PLAN_DAY?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='PLAN_NIGHT'
              caption='PLAN_NIGHT'
              width={90}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "gray", fontWeight: "normal" }}>
                    {params.data.PLAN_NIGHT?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='PLAN_TOTAL'
              caption='PLAN_TOTAL'
              width={90}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "gray", fontWeight: "bold" }}>
                    {params.data.PLAN_TOTAL?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='RESULT_DAY'
              caption='RESULT_DAY'
              width={110}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "#175dff", fontWeight: "normal" }}>
                    {params.data.RESULT_DAY?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='RESULT_NIGHT'
              caption='RESULT_NIGHT'
              width={110}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "#175dff", fontWeight: "normal" }}>
                    {params.data.RESULT_NIGHT?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='RESULT_TOTAL'
              caption='RESULT_TOTAL'
              width={110}
              cellRender={(params: any) => {
                return (
                  <span style={{ color: "#175dff", fontWeight: "bold" }}>
                    {params.data.RESULT_TOTAL?.toLocaleString("en-US")}
                  </span>
                );
              }}
              allowEditing={false}
            ></Column>
            <Column
              dataField='DAY_RATE'
              caption='DAY_RATE'
              width={100}
              cellRender={(params: any) => {
                if (params.data.DAY_RATE !== undefined) {
                  if(params.data.PLAN_DAY !==0)
                  {
                    if (params.data.DAY_RATE === 100) {
                      return (
                        <span style={{ color: "green", fontWeight: "normal" }}>
                          {params.data.DAY_RATE.toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          })}
                          %
                        </span>
                      );
                    } else {
                      return (
                        <span style={{ color: "red", fontWeight: "normal" }}>
                          {params.data.DAY_RATE.toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          })}
                          %
                        </span>
                      );
                    }

                  }
                  else 
                  {
                    return (
                      <span style={{ color: "gray", fontWeight: "normal" }}>
                       N/A
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
              dataField='NIGHT_RATE'
              caption='NIGHT_RATE'
              width={100}
              cellRender={(params: any) => {
                
                if (params.data.NIGHT_RATE !== undefined) {
                  if(params.data.PLAN_NIGHT !==0)
                  {
                    if (params.data.NIGHT_RATE === 100) {
                      return (
                        <span style={{ color: "green", fontWeight: "normal" }}>
                          {params.data.NIGHT_RATE.toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          })}
                          %
                        </span>
                      );
                    } else {
                      return (
                        <span style={{ color: "red", fontWeight: "normal" }}>
                          {params.data.NIGHT_RATE.toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          })}
                          %
                        </span>
                      );
                    }

                  }
                  else 
                  {
                    return (
                      <span style={{ color: "gray", fontWeight: "normal" }}>
                       N/A
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
              dataField='TOTAL_RATE'
              caption='TOTAL_RATE'
              width={100}
              cellRender={(params: any) => {
                if (params.data.TOTAL_RATE !== undefined) {
                  if (params.data.TOTAL_RATE === 100) {
                    return (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        {params.data.TOTAL_RATE.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                        %
                      </span>
                    );
                  } else {
                    return (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        {params.data.TOTAL_RATE.toLocaleString("en-US", {
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
              dataField='id'
              caption='ID'
              width={50}
              allowEditing={false}
            ></Column> 
                   
            <Summary>
              {/* <TotalItem
                alignment='right'
                column='id'
                summaryType='count'
                valueFormat={"decimal"}
              />      */}         
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
    };
  }, []);
  return (
    <div className='plan_result'>
      <div className='tracuuDataInspection'>
        <div className='tracuuYCSXTable'>
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
                    loadTiLeDat(fromdate);
                  }}
                >
                  Tra PLAN
                </button>                            
              </div>
            </div>
          </div>
          {planDataTable}
        </div>
      </div> 
    </div>
  );
};
export default ACHIVEMENTTB;
