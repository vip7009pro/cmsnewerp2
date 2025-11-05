import { Button, IconButton } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./LOSS_TIME_DATA.scss";
import AGTable from "../../../components/DataTable/AGTable";
import { BiLoader } from "react-icons/bi";
import QLGN from "../../rnd/quanlygiaonhandaofilm/QLGN";
import moment from "moment";
import { f_loadLossTimeTheoMay, f_loadLossTimeTheoNguoi } from "../../qlsx/QLSXPLAN/utils/khsxUtils";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

export interface LOSS_TIME_DATA_THEO_MAY {
    EQ_NAME: string;
    AVLB_TIME: number;
    TOTAL_SX_TIME: number;
    SETTING_TIME: number;
    CODE_COUNT: number;
    TOTAL_EA: number;
    TOTAL_SQM: number;
}

export interface LOSS_TIME_DATA_THEO_NGUOI {
    INS_EMPL: string;
    WORK_HOUR: number;
    WORK_MINUTE: number;
    TOTAL_SX_TIME: number;
    SETTING_TIME: number;
    TOTAL_LOSS_TIME: number;
    LOSS_NGOAI: number;
    LOSS_TRONG_SETTING: number;
    CODE_COUNT: number;
    TOTAL_EA: number;
    TOTAL_SQM: number;
}

const LOSS_TIME_DATA = () => {
  const [showGiaoNhan, setShowGiaoNhan] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [option, setOption] = useState(1);
  const theme = useSelector((state: RootState) => state.totalSlice.theme);

  const columns_loss_time_data_theo_may = [
    { field: "EQ_NAME", headerName: "EQ_NAME", width: 100 },
    { field: "AVLB_TIME", headerName: "AVLB_TIME", width: 100 },
    { field: "TOTAL_SX_TIME", headerName: "TOTAL_SX_TIME", width: 100 },
    { field: "SETTING_TIME", headerName: "SETTING_TIME", width: 100 },
    { field: "CODE_COUNT", headerName: "CODE_COUNT", width: 100 },
    { field: "TOTAL_EA", headerName: "TOTAL_EA", width: 100, cellRenderer: (params: any) => {
     return (
          <span style={{ color: "green", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US")} EA
          </span>
        );
    }},
    { field: "TOTAL_SQM", headerName: "TOTAL_SQM", width: 100, cellRenderer: (params: any) => {
      return (
          <span style={{ color: "blue", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US",{minimumFractionDigits: 0, maximumFractionDigits: 0})} m²
          </span>
        );
    } },
  ];
  const columns_loss_time_data_theo_nguoi = [
    { field: "INS_EMPL", headerName: "INS_EMPL", width: 100 },
    { field: "WORK_HOUR", headerName: "WORK_HOUR", width: 100 },
    { field: "WORK_MINUTE", headerName: "WORK_MINUTE", width: 100 },
    { field: "TOTAL_SX_TIME", headerName: "TOTAL_SX_TIME", width: 100 },
    { field: "SETTING_TIME", headerName: "SETTING_TIME", width: 100 },
    { field: "TOTAL_LOSS_TIME", headerName: "TOTAL_LOSS_TIME", width: 100 },
    { field: "LOSS_NGOAI", headerName: "LOSS_NGOAI", width: 100 },
    { field: "LOSS_TRONG_SETTING", headerName: "LOSS_TRONG_SETTING", width: 100 },
    { field: "CODE_COUNT", headerName: "CODE_COUNT", width: 100 },
    { field: "TOTAL_EA", headerName: "TOTAL_EA", width: 100, cellRenderer: (params: any) => {
      return (
          <span style={{ color: "green", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US")} EA
          </span>
        );
    } },
    { field: "TOTAL_SQM", headerName: "TOTAL_SQM", width: 100, cellRenderer: (params: any) => {
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
    let kq: LOSS_TIME_DATA_THEO_MAY[] = [];
    kq = await f_loadLossTimeTheoMay({
      FROM_DATE: fromdate,
      TO_DATE: todate,
    });
    setBTPData(
      kq.map((ele: LOSS_TIME_DATA_THEO_MAY, index: number) => {
        return {
          ...ele,          
          id: index,
        };
      })
    );
    Swal.fire("Thông báo", "Đã load: " + kq.length + " dòng", "success");
  };
  const handleLoadLossTimeTheoNguoi = async () => {   
    let kq: LOSS_TIME_DATA_THEO_NGUOI[] = [];
    kq = await f_loadLossTimeTheoNguoi({
      FROM_DATE: fromdate,
      TO_DATE: todate,
    });
    setBTPData(
      kq.map((ele: LOSS_TIME_DATA_THEO_NGUOI, index: number) => {
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
      {showGiaoNhan && (
        <div className="updatenndsform">
          <Button
            color={"primary"}
            variant="contained"
            size="small"
            fullWidth={false}
            sx={{
              fontSize: "0.7rem",
              padding: "3px",
              backgroundColor: "#69b1f5f",
            }}
            onClick={() => {
              setShowGiaoNhan(false);
            }}
          >
            Close
          </Button>
          <QLGN />
        </div>
      )}
    </div>
  );
};
export default LOSS_TIME_DATA;
