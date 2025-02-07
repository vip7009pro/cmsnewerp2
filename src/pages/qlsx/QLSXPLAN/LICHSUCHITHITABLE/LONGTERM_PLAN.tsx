import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { checkBP, f_deleteLongtermPlan, f_getMachineListData, f_getProductionPlanLeadTimeCapaData, f_insertLongTermPlan, f_loadLongTermPlan, f_moveLongTermPlan } from "../../../../api/GlobalFunction";
import "./PLAN_DATATB.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { MACHINE_LIST, LONGTERM_PLAN_DATA, UserData, PROD_PLAN_CAPA_DATA } from "../../../../api/GlobalInterface";
/* import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; */
import AGTable from "../../../../components/DataTable/AGTable";
import ProductionPlanCapaChart from "../../../../components/Chart/KHSX/ProductionPlanCapa";
const LONGTERM_PLAN = () => {
  const [showQuickPlan, setShowQuickPlan] = useState(false);
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
    const [productionplancapadata, setProductionPlanCapaData] = useState<PROD_PLAN_CAPA_DATA[]>([]);
  const getMachineList = async () => {
    setMachine_List(await f_getMachineListData());
  };

  const getProductionPlanLeadTimeCapaData = async (PLAN_DATE: string) => {
    setProductionPlanCapaData(await f_getProductionPlanLeadTimeCapaData(PLAN_DATE));    
  }

  const userData: UserData | undefined = useSelector((state: RootState) => state.totalSlice.userData);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [factory, setFactory] = useState("NM1");
  const [machine, setMachine] = useState("ALL");
  const [longterm_plan, setLongterm_plan] = useState<LONGTERM_PLAN_DATA[]>([]);
  const selectedLongTermPlan = useRef<LONGTERM_PLAN_DATA[]>([]);
  const weekdayarray = [
    "CN",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
  ]
  
  const columns_longterm_plan = [   
    {
      field: "G_CODE",
      headerName: "G_CODE",
      width: 100,
      editable: false,
      headerCheckboxSelection: true, 
      checkboxSelection: true, 
      cellRenderer: (params: any) => {
        if(params.data.PLAN_DATE === '')
        return (
          <span style={{ color: "red" }}>
            {params.value}
          </span>
        );
        return (
          <span style={{ color: "blue" }}>
            {params.value}
          </span>
        );
      }
    },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 150,
      editable: false,
    },
    {
      field: "PROCESS_NUMBER",
      headerName: "CD",
      width: 30,
      editable: false,
    },
    {
      field: "EQ_NAME",
      headerName: "EQ_NAME",
      width: 50,
      editable: false,
    },
    {
      field: "PROD_REQUEST_QTY",
      headerName: "YCSX_QTY",
      width: 60,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.PROD_REQUEST_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: "KETQUASX",
      headerName: "KETQUASX",
      width: 60,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            {params.data.KETQUASX?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: "TON_YCSX",
      headerName: "TON_YCSX",
      width: 60,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            {params.data.TON_YCSX?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: "UPH",
      headerName: "UPH",
      width: 60,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.UPH?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: "PLAN_DATE",
      headerName: "PLAN_DATE",
      width: 90,
      editable: false,
    },
    {
      field: "D1",
      headerName: moment.utc(fromdate).add(0, "days").format("DD/MM") + " (" + weekdayarray[(moment.utc(fromdate).add(0, "days").weekday())]+ ")",
      width: 60,
      editable: true,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: "D2",
      headerName: moment.utc(fromdate).add(1, "days").format("DD/MM") + " (" + weekdayarray[(moment.utc(fromdate).add(1, "days").weekday())]+ ")",
      width: 60,
      editable: true,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: "D3",
      headerName: moment.utc(fromdate).add(2, "days").format("DD/MM") + " (" + weekdayarray[(moment.utc(fromdate).add(2, "days").weekday())]+ ")",
      width: 60,
      editable: true,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: "D4",
      headerName: moment.utc(fromdate).add(4-1, "days").format("DD/MM") + " (" + weekdayarray[(moment.utc(fromdate).add(4-1, "days").weekday())]+ ")",
      width: 60,
      editable: true,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: "D5",
      headerName: moment.utc(fromdate).add(5-1, "days").format("DD/MM") + " (" + weekdayarray[(moment.utc(fromdate).add(5-1, "days").weekday())]+ ")",
      width: 60,
      editable: true,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: "D6",
      headerName: moment.utc(fromdate).add(6-1, "days").format("DD/MM") + " (" + weekdayarray[(moment.utc(fromdate).add(6-1, "days").weekday())]+ ")",
      width: 60,
      editable: true,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: "D7",
      headerName: moment.utc(fromdate).add(7-1, "days").format("DD/MM") + " (" + weekdayarray[(moment.utc(fromdate).add(7-1, "days").weekday())]+ ")",
      width: 60,
      editable: true,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: "D8",
      headerName: moment.utc(fromdate).add(8-1, "days").format("DD/MM") + " (" + weekdayarray[(moment.utc(fromdate).add(8-1, "days").weekday())]+ ")",
      width: 60,
      editable: true,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: "D9",
      headerName: moment.utc(fromdate).add(9-1, "days").format("DD/MM") + " (" + weekdayarray[(moment.utc(fromdate).add(9-1, "days").weekday())]+ ")",
      width: 60,
      editable: true,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: "D10",
      headerName: moment.utc(fromdate).add(10-1, "days").format("DD/MM") + " (" + weekdayarray[(moment.utc(fromdate).add(10-1, "days").weekday())]+ ")",
      width: 60,
      editable: true,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: "D11",
      headerName: moment.utc(fromdate).add(11-1, "days").format("DD/MM") + " (" + weekdayarray[(moment.utc(fromdate).add(11-1, "days").weekday())]+ ")",
      width: 60,
      editable: true,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: "D12",
      headerName: moment.utc(fromdate).add(12-1, "days").format("DD/MM") + " (" + weekdayarray[(moment.utc(fromdate).add(12-1, "days").weekday())]+ ")",
      width: 60,
      editable: true,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: "D13",
      headerName: moment.utc(fromdate).add(13-1, "days").format("DD/MM") + " (" + weekdayarray[(moment.utc(fromdate).add(13-1, "days").weekday())]+ ")",
      width: 60,
      editable: true,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: "D14",
      headerName: moment.utc(fromdate).add(14-1, "days").format("DD/MM") + " (" + weekdayarray[(moment.utc(fromdate).add(14-1, "days").weekday())]+ ")",
      width: 60,
      editable: true,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: "D15",
      headerName: moment.utc(fromdate).add(15-1, "days").format("DD/MM") + " (" + weekdayarray[(moment.utc(fromdate).add(15-1, "days").weekday())]+ ")",
      width: 60,
      editable: true,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      }      
    },
    {
      field: "D16",
      headerName: moment.utc(fromdate).add(16-1, "days").format("DD/MM") + " (" + weekdayarray[(moment.utc(fromdate).add(16-1, "days").weekday())]+ ")",
      width: 60,
      editable: true,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    
  ]
 
  const loadQLSXPlan = async (plan_date: string) => {
    setLongterm_plan(await f_loadLongTermPlan(plan_date));   
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
        checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], ()=> {
          handleMovePlan(fromdate, todate);
        });
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
        checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], ()=> {
          handleDeletePlan(selectedLongTermPlan.current);
        });   
      }
    });
  };
  
  const handleDeletePlan = async (longTermPlanList: LONGTERM_PLAN_DATA[]) => {
    if(longTermPlanList.length ===0) {
      Swal.fire('Thông báo', 'Chọn ít nhất 1 dòng để xóa', 'error');
      return;
    }
    for (let index = 0; index < longTermPlanList.length; index++) {
      const element = longTermPlanList[index];
      await f_deleteLongtermPlan(element);
    }
    await loadQLSXPlan(fromdate);
  }
  const handleMovePlan = async (FROM_DATE: string, TO_DATE: string) => {
    await f_moveLongTermPlan(FROM_DATE, TO_DATE);
  }
  const chartCapaFR = useMemo(() => {
    return (
      <ProductionPlanCapaChart dldata={productionplancapadata.filter((element:PROD_PLAN_CAPA_DATA, index: number) => element.EQ_SERIES === 'FR')} materialColor="#3DC23D" processColor="#3DC23D"/>     
    );
  }, [productionplancapadata]);
  const chartCapaSR = useMemo(() => {
    return (
      <ProductionPlanCapaChart dldata={productionplancapadata.filter((element:PROD_PLAN_CAPA_DATA, index: number) => element.EQ_SERIES === 'SR')} materialColor="#3DC23D" processColor="#3DC23D"/>     
    );
  }, [productionplancapadata]);
  const chartCapaDC = useMemo(() => {
    return (
      <ProductionPlanCapaChart dldata={productionplancapadata.filter((element:PROD_PLAN_CAPA_DATA, index: number) => element.EQ_SERIES === 'DC')} materialColor="#3DC23D" processColor="#3DC23D"/>     
    );
  }, [productionplancapadata]);
  const chartCapaED = useMemo(() => {
    return (
      <ProductionPlanCapaChart dldata={productionplancapadata.filter((element:PROD_PLAN_CAPA_DATA, index: number) => element.EQ_SERIES === 'ED')} materialColor="#3DC23D" processColor="#3DC23D"/>     
    );
  }, [productionplancapadata]);
 
  const KHSXDataTableAG = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1rem",
              paddingLeft: 20,
              color: "blue",
            }}
          >
         
          </div>}
          suppressRowClickSelection={false}
        columns={columns_longterm_plan}
        data={longterm_plan}
        onCellEditingStopped={async (e) => {
          //console.log(e.data)
          //console.log(fromdate);
          await f_insertLongTermPlan(e.data, fromdate);
          let kq: PROD_PLAN_CAPA_DATA[] = [];
          kq = (await f_getProductionPlanLeadTimeCapaData(fromdate));
          let filteredkq: PROD_PLAN_CAPA_DATA[] = [];
          filteredkq = kq.filter((element:PROD_PLAN_CAPA_DATA, index: number) => element.EQ_SERIES === e.data.EQ_NAME);
          //console.log(kq);
          setProductionPlanCapaData(kq);   
          await loadQLSXPlan(fromdate);
        }} onRowClick={async (e) => {
          //console.log(e.data)
          let kq: PROD_PLAN_CAPA_DATA[] = [];
          kq = (await f_getProductionPlanLeadTimeCapaData(fromdate));
          let filteredkq: PROD_PLAN_CAPA_DATA[] = [];
          filteredkq = kq.filter((element:PROD_PLAN_CAPA_DATA, index: number) => element.EQ_SERIES === e.data.EQ_NAME);
          //console.log(kq);
          setProductionPlanCapaData(kq);   
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
          selectedLongTermPlan.current = e!.api.getSelectedRows();
        }}
      />
    )
  }, [longterm_plan,columns_longterm_plan, fromdate])

  useEffect(() => {
    getMachineList();
    getProductionPlanLeadTimeCapaData(fromdate);
    loadQLSXPlan(fromdate);
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
                      loadQLSXPlan(fromdate);
                      getProductionPlanLeadTimeCapaData(fromdate);
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
            </div>
          </div>
          <div className="chardiv" style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div className="subchart" style={{display:'flex', flexDirection:'column', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
              <span style={{fontSize: '1rem', fontWeight: 'bold'}}>FR PLAN CAPA</span>
            {chartCapaFR}
            </div>
            <div className="subchart" style={{display:'flex', flexDirection:'column', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
              <span style={{fontSize: '1rem', fontWeight: 'bold'}}>SR PLAN CAPA</span>
            {chartCapaSR}
            </div>
            <div className="subchart" style={{display:'flex', flexDirection:'column', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
              <span style={{fontSize: '1rem', fontWeight: 'bold'}}>DC PLAN CAPA</span>
            {chartCapaDC}
            </div>
            <div className="subchart" style={{display:'flex', flexDirection:'column', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
              <span style={{fontSize: '1rem', fontWeight: 'bold'}}>ED PLAN CAPA</span>
            {chartCapaED}
            </div>          
          </div>
         
          {KHSXDataTableAG}
        </div>
      </div>     
                  
    </div>
  );
};
export default LONGTERM_PLAN;
