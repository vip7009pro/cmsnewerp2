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
import { f_loadLossTimeKiemTraTheoBan, f_loadLossTimeKiemTraTheoNguoi } from "../../utils/qcUtils";

export interface LOSS_TIME_DATA_KIEMTRA_THEO_BAN {
    EMPL_NO: string;
    PHANLOAI: string;
    CODE_COUNT: number;
    INSPECT_MINUTE: number;
    INSPECT_TOTAL_QTY: number;
    PROD_SQM: number;
}

export interface LOSS_TIME_DATA_KIEMTRA_THEO_NGUOI {
    EMPL_NO: string;
    CODE_COUNT: number;
    WORK_MINUTE: number;
    INSPECT_MINUTE: number;
    INSPECT_TOTAL_QTY: number;
    PROD_SQM: number;
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
  const columns_loss_time_data_theo_nguoi = [
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 100 },
    { field: "CODE_COUNT", headerName: "CODE_COUNT", width: 100 },
    { field: "WORK_MINUTE", headerName: "WORK_MINUTE", width: 100 },
    { field: "INSPECT_MINUTE", headerName: "INSPECT_MINUTE", width: 100 },
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
  const handleLoadLossTimeTheoMay = async () => {    
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
    Swal.fire("Thông báo", "Đã load: " + kq.length + " dòng", "success");
  };
  const handleLoadLossTimeTheoNguoi = async () => {   
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
    Swal.fire("Thông báo", "Đã load: " + kq.length + " dòng", "success");
  };
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
        onCellEditingStopped={(e) => {
          //console.log(e.data)
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
    //handleLoadDefectProcessData();
    //handleLoadLossTimeTheoMay();
  }, []);
  return (
    <div className="maindefects">
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
                if(option === 1){
                  setColumnDefinition(columns_loss_time_data_theo_may);
                  handleLoadLossTimeTheoMay();
                }else{
                  setColumnDefinition(columns_loss_time_data_theo_nguoi);
                  handleLoadLossTimeTheoNguoi();
                }
              }}>Load Data</Button>
            </div>       
          </div>        
        </div>
        <div className="tracuuPQCTable">{btpDataAG}</div>
      </div>      
    </div>
  );
};
export default LOSS_TIME_DATA;
