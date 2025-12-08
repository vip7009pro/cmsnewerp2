import { Button, Checkbox } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./KPI_NV_NEW2.scss";
import AGTable from "../../../components/DataTable/AGTable";
import moment from "moment";
import { f_load_KPI_SX_THEONGUOI_NEW, f_loadDinhMucCode, f_loadDinhMucMachine, f_loadLossTimeTheoMay, f_loadLossTimeTheoMayNew_EQ_NAME, f_loadLossTimeTheoMayNew_EQ_SERIES, f_loadLossTimeTheoNguoi, f_updateDMCodePS, f_updateSXDailyKPI, f_updateSXDailyKPITheoNguoi} from "../../qlsx/QLSXPLAN/utils/khsxUtils";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import SX_EQ_KPI_GRAPH from "../../../components/Chart/SX/SX_EQ_KPI_GRAPH";
import SX_EMPL_KPI_GRAPH2 from "../../../components/Chart/SX/SX_EMPL_KPI_GRAPH2";
import { DM_CODE_SX_KT, DM_MACHINE, KPI_MACHINE_DATA } from "../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import SX_EQ_KPI_GRAPH2 from "../../../components/Chart/SX/SX_EQ_KPI_GRAPH2";

export interface LOSS_TIME_DATA_THEO_MAY {
    EQ_NAME: string;
    AVLB_TIME: number;
    TOTAL_SX_TIME: number;
    SETTING_TIME: number;
    CODE_COUNT: number;
    TOTAL_EA: number;
    TOTAL_SQM: number;
    TOTAL_KPI: number;
    DAILY_KPI: number;
}

export interface LOSS_TIME_DATA_THEO_NGUOI {
    INS_EMPL: string;
    SX_RESULT: number;
    TOTAL_SX_TIME: number;
    RUN_TIME_SX: number;
    SETTING_TIME: number;
    TOTAL_LOSS_TIME: number;
    LOSS_NGOAI: number;
    LOSS_TRONG_SETTING: number;
    LOSS_TRONG_SX: number;
    CODE_COUNT: number;
    TOTAL_EA: number;
    TOTAL_SQM: number;
    LOSS_SQM: number;
    LOSS_EA: number;
    DM_CODE_KPI: string;
    DM_KPI: string;
    CODE_COUNT_PS: number;
    CODE_COUNT_TT: number;
    WORK_HOUR: number;
    WORK_MINUTE: number;
    TOTAL_KPI: number;
    DAILY_KPI: number; 
    QUALITY_KPI: number;
    QUALITY_CODE_KPI: string;
    COUNT_PS: number;
    COUNT_TT: number;
    INPUT_EA: number;
    INPUT_SQM: number;
    NG_EA: number;
    NG_SQM: number;
    OK_EA: number;
    OK_SQM: number;
    PS_RATE: number;
    TT_RATE: number;
    TIME_KPI: number;
    MACHINE_KPI: number;
    MACHINE_CODE_KPI: string;
    TOTAL_MACHINE_KPI: number;
    TOTAL_QUALITY_RATE: number;
    FINAL_KPI: number;
}

export const columns_dinhmuc_code = [
  { field: "G_CODE", headerName: "G_CODE", width: 60 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 100 },
  { field: "DM_SX", headerName: "DM_SX (EA/H)", width: 60 },
  { field: "DM_KT", headerName: "DM_KT (EA/H)", width: 60 },
  ];
const KPI_NV_NEW2 = () => {
  const [df, setDf] = useState(true)
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [option, setOption] = useState(1);
  const theme = useSelector((state: RootState) => state.totalSlice.theme);
  const [dmcodesxktra, setDMCodeSXKT] = useState<DM_CODE_SX_KT[]>([])
  const [dmmachine, setDMMachine] = useState<DM_MACHINE[]>([])
  const [kpi_machine_series,setKPIMachineSeries] = useState<KPI_MACHINE_DATA[]>([])

  const columns_loss_time_data_theo_may = [
    { field: "EQ_SERIES", headerName: "EQ_SERIES", width: 100 },
    { field: "EQ_NAME", headerName: "EQ_NAME", width: 100 },
    { field: "SX_YEAR", headerName: "SX_YEAR", width: 100 },
    { field: "SX_MONTH", headerName: "SX_MONTH", width: 100 },
    { field: "SX_YM", headerName: "SX_YM", width: 100 },
    { field: "TOTAL_RUN_TIME_SX", headerName: "TOTAL_RUN_TIME_SX", width: 100, cellRenderer: (params: any) => {
     return (
          <span style={{ color: "green", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0,maximumFractionDigits: 0})} min
          </span>
        );
    }},
    { field: "TOTAL_EA", headerName: "TOTAL_EA", width: 100, cellRenderer: (params: any) => {
     return (
          <span style={{ color: "green", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0,maximumFractionDigits: 0})} EA
          </span>
        );
    }},
    { field: "TOTAL_SQM", headerName: "TOTAL_SQM", width: 100, cellRenderer: (params: any) => {
     return (
          <span style={{ color: "green", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0,maximumFractionDigits: 0})} m²
          </span>
        );
    }},
    { field: "TOTAL_DM_SQM", headerName: "TOTAL_DM_SQM", width: 100, cellRenderer: (params: any) => {
     return (
          <span style={{ color: "green", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0,maximumFractionDigits: 0})} m²
          </span>
        );
    }},
    
  ];
  const columns_loss_time_data_theo_nguoi = [
    { field: "INS_EMPL", headerName: "INS_EMPL", width: 60 },
    { field: "WORK_HOUR", headerName: "WORK_HOUR", width: 60 },
    { field: "WORK_MINUTE", headerName: "WORK_MINUTE", width: 60 },
    { field: "TOTAL_SX_TIME", headerName: "TOTAL_SX_TIME", width: 60 },
    { field: "RUN_TIME_SX", headerName: "RUN_TIME_SX", width: 60 }, 
    { field: "CODE_COUNT", headerName: "CODE_COUNT", width: 60 },
    { field: "CODE_COUNT_TT", headerName: "CODE_COUNT_TT", width: 60 },
    { field: "CODE_COUNT_PS", headerName: "CODE_COUNT_PS", width: 60 },

    { field: "TOTAL_SQM", headerName: "TOTAL_SQM_TT", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{maximumFractionDigits: 0})} m²
          </span>
        );
    }    },
    { field: "DM_KPI", headerName: "DM_TT", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{maximumFractionDigits: 0})} m²
          </span>
        );
    }     },
    { field: "TOTAL_EA", headerName: "TOTAL_EA_PS", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{maximumFractionDigits: 0})} EA
          </span>
        );
    }     },
    { field: "DM_CODE_KPI", headerName: "DM_PS", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{maximumFractionDigits: 0})} EA
          </span>
        );
    }      },

    { field: "INPUT_EA", headerName: "INPUT_EA", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{maximumFractionDigits: 0})} EA
          </span>
        );
    }      },
    { field: "OK_EA", headerName: "OK_EA", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{maximumFractionDigits: 0})} EA
          </span>
        );
    }      },
    { field: "NG_EA", headerName: "NG_EA", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{maximumFractionDigits: 0})} EA
          </span>
        );
    }      },
    { field: "INPUT_SQM", headerName: "INPUT_SQM", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{maximumFractionDigits: 0})} m²
          </span>
        );
    }     },
    { field: "OK_SQM", headerName: "OK_SQM", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{maximumFractionDigits: 0})} m²
          </span>
        );
    }     },
    { field: "NG_SQM", headerName: "NG_SQM", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{maximumFractionDigits: 0})} m²
          </span>
        );
    }     },








    { field: "TIME_KPI", headerName: "TIME_KPI", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "blue", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{style: 'percent', minimumFractionDigits: 2})}
          </span>
        );
    }  },
    { field: "MACHINE_KPI", headerName: "MACHINE_KPI_TT", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "gray", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{style: 'percent', minimumFractionDigits: 2})}
          </span>
        );
    }   },
    { field: "MACHINE_CODE_KPI", headerName: "MACHINE_KPI_PS", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "gray", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{style: 'percent', minimumFractionDigits: 2})}
          </span>
        );
    }   },
    { field: "TOTAL_MACHINE_KPI", headerName: "TOTAL_MACHINE_KPI", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "blue", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{style: 'percent', minimumFractionDigits: 2})}
          </span>
        );
    }   },

    { field: "TT_RATE", headerName: "QUALITY_KPI_TT", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "gray", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{style: 'percent', minimumFractionDigits: 2})}
          </span>
        );
    }   },
    { field: "PS_RATE", headerName: "QUALITY_KPI_PS", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "gray", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{style: 'percent', minimumFractionDigits: 2})}
          </span>
        );
    }   },
    { field: "TOTAL_QUALITY_RATE", headerName: "TOTAL_QUALITY_KPI", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "blue", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{style: 'percent', minimumFractionDigits: 2})}
          </span>
        );
    }   },

    { field: "FINAL_KPI", headerName: "FINAL_KPI", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {params.value?.toLocaleString("en-US",{style: 'percent', minimumFractionDigits: 2})}
          </span>
        );
    }   },
    
  ];

  const columns_dinhmuc_machine = [
  { field: "EQ_NAME", headerName: "EQ_NAME", width: 60 },
  { field: "DM_EA", headerName: "DM_SQM (m²/H)", width: 60 },  
  ];
  const [columnDefinition, setColumnDefinition] =
    useState<Array<any>>(columns_loss_time_data_theo_may);
  const [btpData, setBTPData] = useState<Array<any>>([]);

  const handleLoadDMCode = async()=> {
    setDMCodeSXKT(await f_loadDinhMucCode());
  }
  const handleLoadDMMachine = async() => {
    setDMMachine(await f_loadDinhMucMachine())
  }



  const handleLoadLossTimeTheoMay = async (showMessage: boolean = true) => {    
    let kq: KPI_MACHINE_DATA[] = [];
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().startOf('year').format('YYYY-MM-DD');
    kq = await f_loadLossTimeTheoMayNew_EQ_NAME({
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
    });
    console.log('kq',kq)
    setBTPData(
      kq.map((ele: KPI_MACHINE_DATA, index: number) => {
        return {
          ...ele,          
          id: index,
        };
      })
    );

    let kq2: KPI_MACHINE_DATA[] = [];
    kq2 = await f_loadLossTimeTheoMayNew_EQ_SERIES({
       FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
    });
    console.log('kq2',kq2)
    setKPIMachineSeries(kq2);
    if(showMessage) Swal.fire("Thông báo", "Đã load: " + kq.length + " dòng", "success");
  };
  const handleLoadLossTimeTheoNguoi = async (showMessage: boolean = true) => {   
    let kq: LOSS_TIME_DATA_THEO_NGUOI[] = [];
    let lastMonth = moment().subtract(1, 'month');
    let frd = lastMonth.startOf('month').format('YYYY-MM-DD');
    let td = lastMonth.endOf('month').format('YYYY-MM-DD');

    kq = await f_load_KPI_SX_THEONGUOI_NEW({
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
    });
    setBTPData(
      kq.map((ele: LOSS_TIME_DATA_THEO_NGUOI, index: number) => {
        return {
          ...ele,
          id: index,
        };
      })
    );
    if(showMessage) Swal.fire("Thông báo", "Đã load: " + kq.length + " dòng", "success");
  };
  const btpDataAG = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div>
            {/* <IconButton
              className="buttonIcon"
              onClick={() => {
                setColumnDefinition(columns_loss_time_data_theo_may);
                handleLoadLossTimeTheoMay();
              }}
            >
              <BiLoader color="green" size={15} />
              Load Detail
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setColumnDefinition(columns_loss_time_data_theo_nguoi);
                handleLoadLossTimeTheoNguoi();
              }}
            >
              <BiLoader color="green" size={15} />
              Load Summary
            </IconButton> */}
          </div>
        }
        columns={columnDefinition}
        data={btpData}
        onCellEditingStopped={async (e) => {
          //console.log(e.column.colId)
          if(e.column.colId === 'DAILY_KPI'){
            console.log(e.value)
            if(option === 1){
              await f_updateSXDailyKPI(e.data)
              handleLoadLossTimeTheoMay(false)
            }
            if(option === 2){
              await f_updateSXDailyKPITheoNguoi(e.data)
              handleLoadLossTimeTheoNguoi(false)
            }
            
          }
        }}
        onRowClick={(e) => {
          //console.log(e.data)
        }}
        onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    );
  }, [btpData, columnDefinition, columns_loss_time_data_theo_may, columns_loss_time_data_theo_nguoi,dmmachine,dmcodesxktra]);

  const dinhmucCodeAGTable = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div>
            {/* <IconButton
              className="buttonIcon"
              onClick={() => {
                setColumnDefinition(columns_loss_time_data_theo_may);
                handleLoadLossTimeTheoMay();
              }}
            >
              <BiLoader color="green" size={15} />
              Load Detail
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setColumnDefinition(columns_loss_time_data_theo_nguoi);
                handleLoadLossTimeTheoNguoi();
              }}
            >
              <BiLoader color="green" size={15} />
              Load Summary
            </IconButton> */}
          </div>
        }
        columns={columns_dinhmuc_code}
        data={dmcodesxktra}
        onCellEditingStopped={async (e) => {
          //console.log(e.column.colId)
          if(e.column.colId === 'DM_SX' ||e.column.colId === 'DM_KT'  ){
            console.log(e.value)
             await f_updateDMCodePS(e.data)
             if(option === 1){              
              setColumnDefinition(columns_loss_time_data_theo_may);
              handleLoadLossTimeTheoMay(false)
            }
            if(option === 2){
              //await f_updateSXDailyKPITheoNguoi(e.data)
              setColumnDefinition(columns_loss_time_data_theo_nguoi);
              handleLoadLossTimeTheoNguoi(false)
            }
            
          }
        }}
        onRowClick={(e) => {
          //console.log(e.data)
        }}
        onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    );
  }, [dmcodesxktra,columns_dinhmuc_code]);
  const dinhmucMachineAGTable = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div>
            {/* <IconButton
              className="buttonIcon"
              onClick={() => {
                setColumnDefinition(columns_loss_time_data_theo_may);
                handleLoadLossTimeTheoMay();
              }}
            >
              <BiLoader color="green" size={15} />
              Load Detail
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setColumnDefinition(columns_loss_time_data_theo_nguoi);
                handleLoadLossTimeTheoNguoi();
              }}
            >
              <BiLoader color="green" size={15} />
              Load Summary
            </IconButton> */}
          </div>
        }
        columns={columns_dinhmuc_machine}
        data={dmmachine}
        onCellEditingStopped={async (e) => {
          //console.log(e.column.colId)
          if(e.column.colId === 'DM_EA'){
            console.log(e.value)
            await f_updateSXDailyKPI(e.data)

            if(option === 1){              
              setColumnDefinition(columns_loss_time_data_theo_may);
              handleLoadLossTimeTheoMay(false)
            }
            if(option === 2){
              //await f_updateSXDailyKPITheoNguoi(e.data)
              setColumnDefinition(columns_loss_time_data_theo_nguoi);
              handleLoadLossTimeTheoNguoi(false)
            }
            
          }
        }}
        onRowClick={(e) => {
          //console.log(e.data)
        }}
        onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    );
  }, [dmmachine,columns_dinhmuc_machine]);

  useEffect(() => {
    handleLoadDMCode();
    handleLoadDMMachine();
    //handleLoadDefectProcessData();
    //handleLoadLossTimeTheoMay();
  }, []);
  return (
    <div className="kpinvnew2">
      <div className="tracuuDataPqc">
        <div className="tracuuDataPQCform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Từ ngày:</b>
                <input
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
                  type="date"
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>
               <label>
                <b>Phân Loại:</b>
                <select
                  name="phanloai"
                  value={option}
                  onChange={(e) => {
                    setOption(Number(e.target.value));
                    setBTPData([])
                  }}
                >
                  <option value="1">Theo máy</option>
                  <option value="2">Theo người</option>                  
                </select>
              </label>
               <label>
                          <b>Default:</b>{' '}
                          <Checkbox
                            checked={df}
                            onChange={(e) => {
                              setDf(e.target.checked);                             
                            }}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        </label>
            </div>  
            <div className="btgroup">
              <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#00a54a' }} onClick={() => {
                if(option === 1){
                  setColumnDefinition(columns_loss_time_data_theo_may);
                  handleLoadLossTimeTheoMay(true);
                }else{
                  setColumnDefinition(columns_loss_time_data_theo_nguoi);
                  handleLoadLossTimeTheoNguoi(true);
                }
              }}>Load Data</Button>
            </div>       
          </div>        
        </div>
        {option === 1 && <div className="kpigraph"><div className="mutiplegraph">  {

          
            
            Array.from(new Set(kpi_machine_series.map(e => e.EQ_SERIES))).map((eqs: string, index: number)=> {
              return (
                <div className="singlegraph">
                  <span>{eqs}</span>
                <SX_EQ_KPI_GRAPH2 dldata={kpi_machine_series.filter(e => e.EQ_SERIES === eqs)}/>
                </div>
              )
            })
           

          
          } </div></div>}
        {option === 2 && <div className="kpigraph"><SX_EMPL_KPI_GRAPH2 dldata={btpData}/></div>}
        {/* <div className="tracuuPQCTable">{btpDataAG}</div> */}
        <div className="dinhmuctb">
              <div className="tb1">
                {btpDataAG}                
              </div>
              <div className="tb2">
                 {dinhmucCodeAGTable}                
              </div>
              <div className="tb3">
                 {dinhmucMachineAGTable}                
              </div>

        </div>
      </div>
    </div>
  );
};
export default KPI_NV_NEW2;
