import { Button, Checkbox } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./INNHANH_KPI.scss";
import AGTable from "../../../components/DataTable/AGTable";
import moment from "moment";
import { f_loadInNhanhData, f_loadInNhanhKPI, f_updateInNhanhData } from "../../qlsx/QLSXPLAN/utils/khsxUtils";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { DM_MACHINE, IN_NHANH_DATA, IN_NHANH_KPI_DATA } from "../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import IN_NHANH_KPI_GRAPH from "../../../components/Chart/SX/IN_NHANH_KPI_GRAPH";

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
const INNHANH_KPI = () => {
  const [df, setDf] = useState(true)
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [option, setOption] = useState(2);
  const theme = useSelector((state: RootState) => state.totalSlice.theme);
  const [innhanhkpidata, setInNhanhKPIData] = useState<IN_NHANH_KPI_DATA[]>([])

  const columns_innhanhdata =  [
    { field: "IN_ID", headerName: "IN_ID", width: 50 },
    { field: "SX_DATE", headerName: "SX_DATE", width: 80 },
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 80 },
    { field: "CONG_DOAN", headerName: "CONG_DOAN", width: 80 },
    { field: "DON_VI", headerName: "DON_VI", width: 80 },
    { field: "KPI_MUC_TIEU", headerName: "KPI_MUC_TIEU", width: 80 ,cellRenderer: (params: any) => {
      return (
           <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})}
          </span>
        );
    }    },
    { field: "SO_LUONG", headerName: "SO_LUONG", width: 80,cellRenderer: (params: any) => {
      return (
           <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})} 
          </span>
        );
    }     },
    { field: "SO_GIO", headerName: "SO_GIO", width: 80,cellRenderer: (params: any) => {
      return (
           <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})} h
          </span>
        );
    }     },
    { field: "SOLUONG_MUCTIEU", headerName: "SOLUONG_MUCTIEU", width: 100,cellRenderer: (params: any) => {
      return (
           <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})}
          </span>
        );
    }     },
    { field: "SOLUONG_THUCTE", headerName: "SOLUONG_THUCTE", width: 100,cellRenderer: (params: any) => {
      return (
           <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})}
          </span>
        );
    }     },
    { field: "TRU_DIEM", headerName: "TRU_DIEM", width: 80,cellRenderer: (params: any) => {
      return (
           <span style={{ color: "red", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})} %
          </span>
        );
    }     },
    { field: "GHI_CHU", headerName: "GHI_CHU", width: 80 },
  ]
  const columns_innhanhkpi = [
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 80 },
    { field: "SOLUONG_MUCTIEU", headerName: "SOLUONG_MUCTIEU", width: 100,cellRenderer: (params: any) => {
      return (
           <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})} EA
          </span>
        );
    }     },
    { field: "SOLUONG_THUCTE", headerName: "SOLUONG_THUCTE", width: 100,cellRenderer: (params: any) => {
      return (
           <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})} EA
          </span>
        );
    }     },
    { field: "HIEU_SUAT", headerName: "HIEU_SUAT", width: 80,cellRenderer: (params: any) => {
      return (
           <span style={{ color: "blue", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{style:'percent',minimumFractionDigits: 2, maximumFractionDigits: 2})} 
          </span>
        );
    }     },
    { field: "TRU_DIEM", headerName: "TRU_DIEM", width: 80,cellRenderer: (params: any) => {
      return (
           <span style={{ color: "red", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{style:'percent',minimumFractionDigits: 0, maximumFractionDigits: 0})} 
          </span>
        );
    }      },
    { field: "DIEM_CON", headerName: "DIEM_CON", width: 80,cellRenderer: (params: any) => {
      return (
           <span style={{ color: "blue", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{style:'percent',minimumFractionDigits: 0, maximumFractionDigits: 0})} 
          </span>
        );
    }      },
    { field: "FINAL_KPI", headerName: "FINAL_KPI", width: 80,cellRenderer: (params: any) => {
      return (
           <span style={{ color: "green", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{style:'percent',minimumFractionDigits: 2, maximumFractionDigits: 2})} 
          </span>
        );
    }      },
  ]


  const [columnDefinition, setColumnDefinition] =
    useState<Array<any>>(columns_innhanhdata);
  const [btpData, setBTPData] = useState<Array<any>>([]);




  const handleLoadLossTimeTheoNguoi = async (showMessage: boolean = true) => {   
    let kq: IN_NHANH_DATA[] = [];
    let kq2: IN_NHANH_KPI_DATA[]= [];
    let lastMonth = moment().subtract(1, 'month');
    let frd = lastMonth.startOf('month').format('YYYY-MM-DD');
    let td = lastMonth.endOf('month').format('YYYY-MM-DD');

    kq = await f_loadInNhanhData({
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
    });
    setBTPData(
      kq.map((ele: IN_NHANH_DATA, index: number) => {
        return {
          ...ele,
          id: index,
        };
      })
    );
    kq2 = await f_loadInNhanhKPI({
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
    });
    setInNhanhKPIData(kq2);


    if(showMessage) Swal.fire("Thông báo", "Đã load: " + kq.length + " dòng", "success");
  };
  const btpDataAG = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div>           
          </div>
        }
        columns={columnDefinition}
        data={btpData}
        onCellEditingStopped={async (e) => {
          //console.log(e.column.colId)
          if(['KPI_MUC_TIEU', 'SO_LUONG', 'SO_GIO','TRU_DIEM','GHI_CHU'].includes(e.column.colId)){
            await f_updateInNhanhData(e.data)
            handleLoadLossTimeTheoNguoi(false);
           
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
  }, [btpData, columnDefinition]);

  const dinhmucCodeAGTable = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div>           
          </div>
        }
        columns={columns_innhanhkpi}
        data={innhanhkpidata}
        onCellEditingStopped={async (e) => {
          //console.log(e.column.colId)
          if(e.column.colId === 'DM_SX' ||e.column.colId === 'DM_KT'  ){
            console.log(e.value)
             
            
            
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
  }, [innhanhkpidata,columns_innhanhkpi]);

  useEffect(() => {
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
             {/*   <label>
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
              </label> */}
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
                 setColumnDefinition(columns_innhanhdata);
                  handleLoadLossTimeTheoNguoi(true);
              }}>Load Data</Button>
            </div>       
          </div>        
        </div>
     
        {option === 2 && <div className="kpigraph"><IN_NHANH_KPI_GRAPH dldata={innhanhkpidata}/></div>}
        {/* <div className="tracuuPQCTable">{btpDataAG}</div> */}
        <div className="dinhmuctb">
              <div className="tb1">
                {btpDataAG}                
              </div>
              <div className="tb1">
                 {dinhmucCodeAGTable}                
              </div>
        </div>
      </div>
    </div>
  );
};
export default INNHANH_KPI;
