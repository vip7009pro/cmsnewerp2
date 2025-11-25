import { Button, IconButton } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./LOSS_TIME_DATA.scss";
import { BiLoader } from "react-icons/bi";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { f_loadLossTimeTheoMay, f_loadLossTimeTheoNguoi } from "../../../qlsx/QLSXPLAN/utils/khsxUtils";
import AGTable from "../../../../components/DataTable/AGTable";
import { f_insertPhanLoaiBanKiemTraAuto, f_loadLossTimeKiemTraTheoBan, f_loadLossTimeKiemTraTheoNguoi, f_updateKPIBanKiemTra } from "../../utils/qcUtils";
import Inspect_EMPL_KPI_GRAPH from "../../../../components/Chart/INSPECTION/Inspect_EMPL_KPI_GRAPH";

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

const LOSS_TIME_DATA = () => {
  const [showGiaoNhan, setShowGiaoNhan] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [option, setOption] = useState(1);
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
    let kq: LOSS_TIME_DATA_KIEMTRA_THEO_NGUOI[] = [];
    kq = await f_loadLossTimeKiemTraTheoNguoi({
      FROM_DATE: fromdate,
      TO_DATE: todate,
    });
    setBTPData(
      kq.map((ele: LOSS_TIME_DATA_KIEMTRA_THEO_NGUOI, index: number) => {
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
  useEffect(() => {
    handleAutoInsertPhanLoai();
    //handleLoadDefectProcessData();
    //handleLoadLossTimeTheoMay();
  }, []);
  return (
    <div className="losstimedatakiemtra">
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
                  }}
                >
                  <option value="1">Theo máy</option>
                  <option value="2">Theo người</option>                  
                </select>
              </label>
            </div>  
            <div className="btgroup">
              <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#00a54a' }} onClick={() => {
                handleAutoInsertPhanLoai();
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
        <div className = 'kpigraph'><Inspect_EMPL_KPI_GRAPH dldata={btpData} /></div>
        <div className="tracuuPQCTable">{btpDataAG}</div>
      </div>      
    </div>
  );
};
export default LOSS_TIME_DATA;
