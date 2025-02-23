import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import { f_getMachineListData } from "../../../../api/GlobalFunction";
import "./ACHIVEMENTTB.scss";
import { MACHINE_LIST, SX_ACHIVE_DATE } from "../../../../api/GlobalInterface";
import AGTable from "../../../../components/DataTable/AGTable";

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
  const columns_planresult = [
    {
      headerName: "EQ_NAME",
      field: "EQ_NAME",
      width: 80,
      editable: false,
      cellClass: "ag-header-cell-content",
    },
    {
      headerName: "YCSX_NO",
      field: "PROD_REQUEST_NO",
      width: 100,
      editable: false,
      cellClass: "ag-header-cell-content",
    },
    {
      headerName: "CODE KD",
      field: "G_NAME_KD",
      width: 120,
      editable: false,
      cellClass: "ag-header-cell-content",
      cellStyle: function (params: any) {
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
          return { color: "red" };
        } else {
          return { color: "green" };
        }
      },
    },
    {
      headerName: "STEP",
      field: "STEP",
      width: 50,
      editable: false,
      cellClass: "ag-header-cell-content",
    },
    {
      headerName: "PLAN_DAY",
      field: "PLAN_DAY",
      width: 90,
      editable: false,
      cellClass: "ag-header-cell-content",
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray", fontWeight: "normal" }}>
            {params.data.PLAN_DAY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      headerName: "PLAN_NIGHT",
      field: "PLAN_NIGHT",
      width: 90,
      editable: false,
      cellClass: "ag-header-cell-content",
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray", fontWeight: "normal" }}>
            {params.data.PLAN_NIGHT?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      headerName: "PLAN_TOTAL",
      field: "PLAN_TOTAL",
      width: 90,
      editable: false,
      cellClass: "ag-header-cell-content",
      cellRenderer:(params: any) => {
        return (
          <span style={{ color: "gray", fontWeight: "bold" }}>
            {params.data.PLAN_TOTAL?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      headerName: "RESULT_DAY",
      field: "RESULT_DAY",
      width: 110,
      editable: false,
      cellClass: "ag-header-cell-content",
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#175dff", fontWeight: "normal" }}>
            {params.data.RESULT_DAY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      headerName: "RESULT_NIGHT",
      field: "RESULT_NIGHT",
      width: 110,
      editable: false,
      cellClass: "ag-header-cell-content",
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#175dff", fontWeight: "normal" }}>
            {params.data.RESULT_NIGHT?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      headerName: "RESULT_TOTAL",
      field: "RESULT_TOTAL",
      width: 110,
      editable: false,
      cellClass: "ag-header-cell-content",
      cellRenderer:(params: any) => {
        return (
          <span style={{ color: "#175dff", fontWeight: "bold" }}>
            {params.data.RESULT_TOTAL?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      headerName: "DAY_RATE",
      field: "DAY_RATE",
      width: 100,
      editable: false,
      cellClass: "ag-header-cell-content",
      cellRenderer: (params: any) => {
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
      }
    },
    {
      headerName: "NIGHT_RATE",
      field: "NIGHT_RATE",
      width: 100,
      editable: false,
      cellClass: "ag-header-cell-content",
      cellRenderer: (params: any) => {
                
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
      }
    },
    {
      headerName: "TOTAL_RATE",
      field: "TOTAL_RATE",
      width: 100,
      editable: false,
      cellClass: "ag-header-cell-content",
      cellRenderer:(params: any) => {
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
      }
    },
  ]
  const planDataTableAG = useMemo(() =>
    <AGTable      
      showFilter={true}
      toolbar={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
          
        </div>
      }
      columns={columns_planresult}
      data={plandatatable}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(e: any) => {
        //clickedRow.current = params.data;
        //clickedRow.current = params.data;
        //console.log(e.data) 
        //console.log(e.data.CUST_CD);       
      }} onSelectionChange={(params: any) => {
        //console.log(params)
        //setSelectedRows(params!.api.getSelectedRows()[0]);
        //console.log(e!.api.getSelectedRows())        
      }}
    />
    , [plandatatable]);
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
          <div className="agtb">
          {planDataTableAG}
          </div>
        </div>
      </div> 
    </div>
  );
};
export default ACHIVEMENTTB;
