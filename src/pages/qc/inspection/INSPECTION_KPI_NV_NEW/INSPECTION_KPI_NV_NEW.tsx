import { Button } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./INSPECTION_KPI_NV_NEW.scss";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import AGTable from "../../../../components/DataTable/AGTable";
import {
  f_insertPhanLoaiBanKiemTraAuto,
  f_loadDinhMucViTriKiemTra,
  f_loadKPINVKiemtra,
  f_loadLossTimeKiemTraTheoBan,
  f_updateKPIBanKiemTra,
} from "../../utils/qcUtils";
import { DM_VITRI_DATA, KPI_NV_KIEMTRA } from "../../interfaces/qcInterface";
import Inspect_EMPL_KPI_GRAPH2 from "../../../../components/Chart/INSPECTION/Inspect_EMPL_KPI_GRAPH2";
import { DM_CODE_SX_KT } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { f_loadDinhMucCode, f_updateDMCodePS } from "../../../qlsx/QLSXPLAN/utils/khsxUtils";
import { columns_dinhmuc_code } from "../../../sx/KPI_NV_NEW2/KPI_NV_NEW2";

export interface LOSS_TIME_DATA_KIEMTRA_THEO_BAN {
    EMPL_NO: string;
    PHANLOAI: string;
    CODE_COUNT: number;
    INSPECT_MINUTE: number;
    INSPECT_TOTAL_QTY: number;
    PROD_SQM: number;
    TOTAL_KPI: number;
    HOUR_KPI: number;
    INSPECT_HOUR: number;
}

export interface LOSS_TIME_DATA_KIEMTRA_THEO_NGUOI {
    EMPL_NO: string;
    CODE_COUNT: number;
    WORK_MINUTE: number;
    INSPECT_MINUTE: number;
    INSPECT_TOTAL_QTY: number;
    PROD_SQM: number;
    WORK_HOUR: number;
    TOTAL_KPI: number;

}


const INSPECTION_KPI_NV_NEW = () => {
  const [showGiaoNhan, setShowGiaoNhan] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [option, setOption] = useState(2);
  const [dmcodesxktra, setDMCodeSXKT] = useState<DM_CODE_SX_KT[]>([])
  const [dmvitrikiemtra, setDMViTriKT]=  useState<DM_VITRI_DATA[]>([])
  const theme = useSelector((state: RootState) => state.totalSlice.theme);

  const columns_loss_time_data_theo_may = [
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 100 },
    { field: "PHANLOAI", headerName: "PHANLOAI", width: 100 },
    { field: "CODE_COUNT", headerName: "CODE_COUNT", width: 100 },
    { field: "INSPECT_MINUTE", headerName: "INSPECT_MINUTE", width: 100 },
    { field: "INSPECT_HOUR", headerName: "INSPECT_HOUR", width: 100, cellRenderer: (params: any) => {
      return (
          <span style={{ color: "green", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 2, maximumFractionDigits: 2})} h
          </span>
        );
    } },
    { field: "INSPECT_TOTAL_QTY", headerName: "INSPECT_TOTAL_QTY", width: 100, cellRenderer: (params: any) => {
      return (
          <span style={{ color: "green", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US")} EA
          </span>
        );
    } },
    { field: "PROD_SQM", headerName: "PROD_SQM", width: 100, cellRenderer: (params: any) => {
      return (
          <span style={{ color: "blue", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})} m²
          </span>
        );
    } },
    { field: "TOTAL_KPI", headerName: "TOTAL_KPI", width: 100, cellRenderer: (params: any) => {
      return (
          <span style={{ color: "red", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})} EA
          </span>
        );
    } },
    { field: "HOUR_KPI", headerName: "HOUR_KPI", width: 100, cellRenderer: (params: any) => {
      return (
          <span style={{ color: "red", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})} EA
          </span>
        );
    } },

  ];
  const columns_loss_time_data_theo_nguoi = [
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 100 },
    { field: "CODE_COUNT", headerName: "CODE_COUNT", width: 100 },
    { field: "WORK_MINUTE", headerName: "WORK_MINUTE", width: 100 },
    { field: "INSPECT_MINUTE", headerName: "INSPECT_MINUTE", width: 100 },
    { field: "WORK_HOUR", headerName: "WORK_HOUR", width: 100, cellRenderer: (params: any) => {
      return (
          <span style={{ color: "green", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 2, maximumFractionDigits: 2})} h
          </span>
        );
    } },
    { field: "TOTAL_KPI", headerName: "TOTAL_KPI", width: 100, cellRenderer: (params: any) => {
      return (
          <span style={{ color: "red", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})} EA
          </span>
        );
    } },
    { field: "INSPECT_TOTAL_QTY", headerName: "INSPECT_TOTAL_QTY", width: 100, cellRenderer: (params: any) => {
      return (
          <span style={{ color: "green", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US")} EA
          </span>
        );
    } },
    { field: "PROD_SQM", headerName: "PROD_SQM", width: 100, cellRenderer: (params: any) => {
      return (
          <span style={{ color: "blue", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})} m²
          </span>
        );
    } },
  ];
  const columns_kpi_nv_ktra = [
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 80 },
    { field: "CODE_COUNT", headerName: "CODE_COUNT", width: 80 },
    { field: "INSPECT_MINUTE", headerName: "INSPECT_MINUTE", width: 80 },
    { field: "COUNT_TT", headerName: "COUNT_TT", width: 80 },
    { field: "COUNT_PS", headerName: "COUNT_PS", width: 80 },
    { field: "INSPECT_QTY_TT", headerName: "INSPECT_QTY_TT", width: 80,cellRenderer: (params: any) => {
      return (
           <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})} EA
          </span>
        );
    }    },
    { field: "INSPECT_QTY_PS", headerName: "INSPECT_QTY_PS", width: 80,cellRenderer: (params: any) => {
      return (
           <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})} EA
          </span>
        );
    }    },
    { field: "TRU_DIEM", headerName: "TRU_DIEM", width: 80 },
   
    { field: "DM_VITRI", headerName: "DM_VITRI", width: 80,cellRenderer: (params: any) => {
      return (
           <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})} EA
          </span>
        );
    }    },
    { field: "DM_CODE", headerName: "DM_CODE", width: 80,cellRenderer: (params: any) => {
      return (
           <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})} EA
          </span>
        );
    }    },
    { field: "INSPECT_TOTAL_QTY", headerName: "INSPECT_TOTAL_QTY", width: 80,cellRenderer: (params: any) => {
      return (
           <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})} EA
          </span>
        );
    }   },
    { field: "PROD_SQM", headerName: "PROD_SQM", width: 80, cellRenderer: (params: any) => {
      return (
           <span style={{ color: "black", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})} m²
          </span>
        );
    }  },
    { field: "RATE_PS", headerName: "RATE_PS", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "gray", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{style: 'percent', minimumFractionDigits: 2})}
          </span>
        );
    }    },
    { field: "RATE_TT", headerName: "RATE_TT", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "gray", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{style: 'percent', minimumFractionDigits: 2})}
          </span>
        );
    }    },
    { field: "TOTAL_KIEMTRA_KPI", headerName: "TOTAL_KIEMTRA_KPI", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "blue", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{style: 'percent', minimumFractionDigits: 2})}
          </span>
        );
    }    },
     { field: "DIEM_CON", headerName: "DIEM_CON", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "blue", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{style: 'percent', minimumFractionDigits: 2})}
          </span>
        );
    }    },
    { field: "FINAL_KPI", headerName: "FINAL_KPI", width: 80,cellRenderer: (params: any) => {
      return (
          <span style={{ color: "green", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{style: 'percent', minimumFractionDigits: 2})}
          </span>
        );
    }    },

  ]
  const colulmns_dinhmuc_vitri = [
    { field: "PHANLOAI", headerName: "PHANLOAI", width: 80 },
    { field: "KPI_VALUE", headerName: "KPI_VALUE", width: 80 },
  ]
  const [columnDefinition, setColumnDefinition] =
    useState<Array<any>>(columns_loss_time_data_theo_may);
  const [btpData, setBTPData] = useState<Array<any>>([]);
  const handleLoadLossTimeTheoMay = async (showSwal: boolean = true) => {    
    let kq: LOSS_TIME_DATA_KIEMTRA_THEO_BAN[] = [];
    kq = await f_loadLossTimeKiemTraTheoBan({
      FROM_DATE: fromdate,
      TO_DATE: todate,
    });
    setBTPData(
      kq.map((ele: LOSS_TIME_DATA_KIEMTRA_THEO_BAN, index: number) => {
        return {
          ...ele,          
          id: index,
        };
      })
    );
    if(showSwal){
      Swal.fire("Thông báo", "Đã load: " + kq.length + " dòng", "success");
    }
  };
  const handleLoadLossTimeTheoNguoi = async (showSwal: boolean = true) => {   
    let kq: KPI_NV_KIEMTRA[] = [];
    kq = await f_loadKPINVKiemtra({
      FROM_DATE: fromdate,
      TO_DATE: todate,
    });
    setBTPData(
      kq.map((ele: KPI_NV_KIEMTRA, index: number) => {
        return {
          ...ele,
          id: index,
        };
      })
    );
    if(showSwal){
      Swal.fire("Thông báo", "Đã load: " + kq.length + " dòng", "success");
    }
  };
  const handleAutoInsertPhanLoai = () => {
    f_insertPhanLoaiBanKiemTraAuto({});
  }
  const btpDataAG = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div>
           {/*  <IconButton
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
          //console.log(e.data)
          if(e.column.colId === 'HOUR_KPI'){
            console.log(e.value)
            if(option === 1){
              await f_updateKPIBanKiemTra(e.data)
              handleLoadLossTimeTheoMay(false)
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
  }, [btpData, columnDefinition, columns_loss_time_data_theo_may, columns_loss_time_data_theo_nguoi]);
  
  const dinhmucCodeAGTable = useMemo(() => {
  return (
    <AGTable
      toolbar={
        <div>         
        </div>
      }
      columns={columns_dinhmuc_code}
      data={dmcodesxktra}
      onCellEditingStopped={async (e) => {
        //console.log(e.column.colId)
        if(e.column.colId === 'DM_SX' ||e.column.colId === 'DM_KT'  )
        {
          console.log(e.value)
            await f_updateDMCodePS(e.data)
            setColumnDefinition(columns_kpi_nv_ktra);
            handleLoadLossTimeTheoNguoi(false)
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
  const dinhmucViTriAGTable = useMemo(() => {
  return (
    <AGTable
      toolbar={
        <div>
        </div>
      }
      columns={colulmns_dinhmuc_vitri}
      data={dmvitrikiemtra}
      onCellEditingStopped={async (e) => {
        //console.log(e.column.colId)
        if(e.column.colId === 'KPI_VALUE'){
          console.log(e.value)        
          //await f_updateDMCodePS(e.data)
          await f_updateKPIBanKiemTra(e.data)
          setColumnDefinition(columns_kpi_nv_ktra);
          handleLoadLossTimeTheoNguoi(false)
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
}, [dmvitrikiemtra,colulmns_dinhmuc_vitri]);
  const handleLoadDMCode = async()=> {
    setDMCodeSXKT(await f_loadDinhMucCode());
  }

  const handleLoadDMViTri = async() => {
    setDMViTriKT(await f_loadDinhMucViTriKiemTra());
  }
  useEffect(() => {
    handleAutoInsertPhanLoai();
    handleLoadDMCode();
    handleLoadDMViTri();
    //handleLoadDefectProcessData();
    //handleLoadLossTimeTheoMay();
  }, []);
  return (
    <div className="losstimedatakiemtra2">
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
              {/*  <label>
                <b>Phân Loại:</b>
                <select
                  name="phanloai"
                  value={option}
                  onChange={(e) => {
                    setOption(Number(e.target.value));
                  }}
                >
                  <option value="1">Theo máy</option>
                  <option value="2">Theo người</option>                  
                </select>
              </label> */}
            </div>  
            <div className="btgroup">
              <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#00a54a' }} onClick={() => {
                  handleAutoInsertPhanLoai();              
                  setColumnDefinition(columns_kpi_nv_ktra);
                  handleLoadLossTimeTheoNguoi(true);                
              }}>Load Data</Button>
            </div>       
          </div>        
        </div>
        <div className = 'kpigraph'><Inspect_EMPL_KPI_GRAPH2 dldata={btpData}/></div>
         <div className="dinhmuctb">
              <div className="tb1">
                {btpDataAG}                
              </div>
              <div className="tb2">
                {dinhmucCodeAGTable}                
              </div>
              <div className="tb3">
                {dinhmucViTriAGTable}                                               
              </div>
        </div>
      </div>      
    </div>
  );
};
export default INSPECTION_KPI_NV_NEW;
