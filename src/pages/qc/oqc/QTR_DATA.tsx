import { Button } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./QTR_DATA.scss";
import AGTable from "../../../components/DataTable/AGTable";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { f_loadQTRData } from "../utils/qcUtils";

export interface QTR_DATA {
  MANAGEMENT_NUMBER: string;
  REGISTERED_DATE: string;
  PLANT: string;
  MONTH_QTR: string;
  PART_CODE: string;
  QTR_PPM: number;
  OCCUR_PLACE: string;
  DEFECT_QTY: number;
  WH_OUT_QTY: number;
  APPROVAL: string;
  TITLE: string;
  PART_NAME: string;
  PART_GROUP: string;
  MAIN_CATEGORY: string;
  PROJECT: string;
  BASIC_MODEL: string;
  DEFECT_DETAILS: string;
  SAMPLE_QTY: number;
  DEFECT_RATE: number;
  APPROVER: string;
  APPROVAL_DATE: string;
  REASON1: string;
  G_CODE: string;
  CUST_CD: string;
  G_NAME: string;
  UNIT: string;
  PROD_TYPE: string;
  INS_EMPL: string;
  INS_DATE: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  QTR_YN: string;
}




const QTR_DATA = () => {
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const theme = useSelector((state: RootState) => state.totalSlice.theme);

  const columns_qtr_data = [
    { field: "MANAGEMENT_NUMBER", headerName: "MANAGEMENT_NUMBER", width: 120 },
    { field: "REGISTERED_DATE", headerName: "REGISTERED_DATE", width: 100 },
    { field: "PLANT", headerName: "PLANT", width: 100 },
    { field: "MONTH_QTR", headerName: "MONTH_QTR", width: 100 },
    { field: "PART_CODE", headerName: "PART_CODE", width: 100 },
    { field: "QTR_PPM", headerName: "QTR_PPM", width: 100, cellRenderer: (params: any) => {
      return (
          <span style={{ color: params.value >=500 && params.data.OCCUR_PLACE === "Main" ? "red" : "green", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
    } },
    { field: "OCCUR_PLACE", headerName: "OCCUR_PLACE", width: 100 },
    { field: "DEFECT_QTY", headerName: "DEFECT_QTY", width: 100 },
    { field: "WH_OUT_QTY", headerName: "WH_OUT_QTY", width: 100, cellRenderer: (params: any) => {
      return (
          <span style={{ color: "blue", fontWeight: "normal" }}>
            {params.value?.toLocaleString("en-US")}
          </span>
        );
    } },
    { field: "APPROVAL", headerName: "APPROVAL", width: 100, cellRenderer: (params: any) => {
      return (
          <span style={{ color: params.value === "Hoàn thành" ? "red" : "green", fontWeight: "normal" }}>
            {params.value}
          </span>
        );
    } },
    { field: "TITLE", headerName: "TITLE", width: 100 },
    { field: "PART_NAME", headerName: "PART_NAME", width: 100 },
    { field: "PART_GROUP", headerName: "PART_GROUP", width: 100 },
    { field: "MAIN_CATEGORY", headerName: "MAIN_CATEGORY", width: 100 },
    { field: "PROJECT", headerName: "PROJECT", width: 100 },
    { field: "BASIC_MODEL", headerName: "BASIC_MODEL", width: 100 },
    { field: "DEFECT_DETAILS", headerName: "DEFECT_DETAILS", width: 100 },
    { field: "SAMPLE_QTY", headerName: "SAMPLE_QTY", width: 100 },
    { field: "DEFECT_RATE", headerName: "DEFECT_RATE", width: 100 },
    { field: "APPROVER", headerName: "APPROVER", width: 100 },
    { field: "APPROVAL_DATE", headerName: "APPROVAL_DATE", width: 100 },
    { field: "REASON1", headerName: "REASON1", width: 100 },
    { field: "G_CODE", headerName: "G_CODE", width: 100 },
    { field: "CUST_CD", headerName: "CUST_CD", width: 100 },
    { field: "G_NAME", headerName: "G_NAME", width: 100 },
    { field: "UNIT", headerName: "UNIT", width: 100 },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 100 },
    { field: "INS_EMPL", headerName: "INS_EMPL", width: 100 },
    { field: "INS_DATE", headerName: "INS_DATE", width: 100 },
    { field: "UPD_DATE", headerName: "UPD_DATE", width: 100 },
    { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 100 },
    { field: "QTR_YN", headerName: "QTR_YN", width: 100 },

    
  ];

  const [columnDefinition, setColumnDefinition] =
    useState<Array<any>>(columns_qtr_data);
  const [btpData, setBTPData] = useState<Array<any>>([]);
  const handleLoadQTRData = async () => {    
    let kq: QTR_DATA[] = [];
    kq = await f_loadQTRData({
      FROM_DATE: fromdate,
      TO_DATE: todate,
    });
    setBTPData(
      kq.map((ele: QTR_DATA, index: number) => {
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
                setColumnDefinition(columns_qtr_data);
                handleLoadQTRData();
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
  }, [btpData, columnDefinition, columns_qtr_data]);
  useEffect(() => {
    //handleLoadDefectProcessData();
    //handleLoadQTRData();
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
            </div>  
            <div className="btgroup">
              <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#00a54a' }} onClick={() => {               
                  setColumnDefinition(columns_qtr_data);
                  handleLoadQTRData();               
              }}>Load Data</Button>
            </div>       
          </div>        
        </div>
        <div className="tracuuPQCTable">{btpDataAG}</div>
      </div>    
    </div>
  );
};
export default QTR_DATA;
