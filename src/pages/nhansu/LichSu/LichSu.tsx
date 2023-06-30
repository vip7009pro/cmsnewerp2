import {
  DataGrid,
  GridSelectionModel,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarExport,
  GridCsvExportOptions,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridRowsProp,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { generalQuery } from "../../../api/Api";
import "./LichSu.scss";
import Swal from "sweetalert2";
import LinearProgress from "@mui/material/LinearProgress";
import { SaveExcel, weekdayarray } from "../../../api/GlobalFunction";
import moment from "moment";
import { RootState } from "../../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { UserData } from "../../../redux/slices/globalSlice";
interface DiemDanhNhomData {
  DATE_COLUMN: string;
  WEEKDAY: string;
  id: string;
  EMPL_NO: string;
  CMS_ID: string;
  MIDLAST_NAME: string;
  FIRST_NAME: string;
  PHONE_NUMBER: string;
  SEX_NAME: string;
  WORK_STATUS_NAME: string;
  FACTORY_NAME: string;
  JOB_NAME: string;
  WORK_SHIF_NAME: string;
  WORK_POSITION_NAME: string;
  SUBDEPTNAME: string;
  MAINDEPTNAME: string;
  REQUEST_DATE: string;
  APPLY_DATE: string;
  APPROVAL_STATUS: number;
  OFF_ID: number;
  CA_NGHI: number;
  ON_OFF: number;
  OVERTIME_INFO: string;
  OVERTIME: number;
  REASON_NAME: string;
  REMARK: string;
  XACNHAN: string;
}
const LichSu = () => {
    const userData: UserData | undefined = useSelector(
        (state: RootState) => state.totalSlice.userData
        );
    
  const [isLoading, setisLoading] = useState(false);
  const [diemdanhnhomtable, setDiemDanhNhomTable] = useState<
    Array<DiemDanhNhomData>
  >([]);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-01"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const columns_diemdanhnhom = [
    {
      field: "DATE_COLUMN",
      headerName: "DATE_COLUMN",
      width: 120,
      valueGetter: (params: any) => {
        return params.row.DATE_COLUMN ? params.row.DATE_COLUMN.slice(0, 10) : "";
      },
    },
    {
      field: "WEEKDAY",
      headerName: "WEEKDAY", 
      width: 120,
      renderCell: (params: any) => {
        if (params.row.WEEKDAY === 'Sunday') {
            return (
              <div className='onoffdiv'>
                <span style={{ fontWeight: "bold", color: "red" }}>{params.row.WEEKDAY}</span>
              </div>
            );
          } else {
            return (
              <div className='onoffdiv'>
                <span style={{ fontWeight: "bold", color: "#4268F4" }}>{params.row.WEEKDAY}</span>
              </div>
            );
        }
      }
    },
    {
      field: "ON_OFF",
      headerName: "ON_OFF",
      width: 120,
      renderCell: (params: any) => {
        if (params.row.ON_OFF === 1) {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "green" }}>Đi làm</span>
            </div>
          );
        } else if (params.row.ON_OFF === 0) {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "red" }}>Nghỉ làm</span>
            </div>
          );
        }
        else 
        {
            return (
            <div className='onoffdiv'>
                <span style={{ fontWeight: "bold", color: "#754EFA" }}>Chưa điểm danh</span>
            </div>
            );
        }
      },
    },
    {
      field: "PHE_DUYET",
      headerName: "PHE_DUYET",
      width: 120,
      renderCell: (params: any) => {
        if (params.row.APPROVAL_STATUS === 0) {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "red" }}>Từ chối</span>
            </div>
          );
        } else if (params.row.APPROVAL_STATUS === 1) {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "green" }}>
                Phê duyệt
              </span>
            </div>
          );
        } else if (params.row.APPROVAL_STATUS === 2) {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "white" }}>
                Chờ duyệt
              </span>
            </div>
          );
        } else {
          return <div className='onoffdiv'></div>;
        }
      },
    },
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 120 },
    { field: "CMS_ID", headerName: "CMS_ID", width: 120 },
    { field: "MIDLAST_NAME", headerName: "MIDLAST_NAME", width: 170 },
    { field: "FIRST_NAME", headerName: "FIRST_NAME", width: 120 },
    { field: "CA_NGHI", headerName: "CA_NGHI", width: 100 },
    { field: "OVERTIME_INFO", headerName: "OVERTIME_INFO", width: 120 },
    { field: "OVERTIME", headerName: "OVERTIME", width: 100 },
    { field: "REASON_NAME", headerName: "REASON_NAME", width: 120 },
    { field: "REMARK", headerName: "REMARK", width: 170 },
    { field: "XACNHAN", headerName: "XACNHAN", width: 120 },
    { field: "PHONE_NUMBER", headerName: "PHONE_NUMBER", width: 120 },
    { field: "SEX_NAME", headerName: "SEX_NAME", width: 120 },
    { field: "WORK_STATUS_NAME", headerName: "WORK_STATUS_NAME", width: 120 },
    { field: "FACTORY_NAME", headerName: "FACTORY_NAME", width: 120 },
    { field: "JOB_NAME", headerName: "JOB_NAME", width: 120 },
    { field: "WORK_SHIF_NAME", headerName: "WORK_SHIF_NAME", width: 120 },
    {
      field: "WORK_POSITION_NAME",
      headerName: "WORK_POSITION_NAME",
      width: 120,
    },
    { field: "SUBDEPTNAME", headerName: "SUBDEPTNAME", width: 120 },
    { field: "MAINDEPTNAME", headerName: "MAINDEPTNAME", width: 120 },
    {
      field: "REQUEST_DATE",
      headerName: "REQUEST_DATE",
      width: 120,
      valueGetter: (params: any) => {
        return params.row.REQUEST_DATE
          ? params.row.REQUEST_DATE.slice(0, 10)
          : "";
      },
    },
    { field: "OFF_ID", headerName: "OFF_ID", width: 120 },
  ];
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <button
          className='saveexcelbutton'
          onClick={() => {
            SaveExcel(diemdanhnhomtable, "LichSuLamViec");
          }}
        >
          Save Excel
        </button>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }
 
  const handleSearch = () => {
    generalQuery("mydiemdanhnhom", { from_date: fromdate, to_date: todate })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: DiemDanhNhomData[] = response.data.data.map(
            (element: DiemDanhNhomData, index: number) => {
              return {
                ...element,
                EMPL_NO: userData?.EMPL_NO,          
                DATE_COLUMN: moment(element.DATE_COLUMN).utc().format('YYYY-MM-DD'),      
                APPLY_DATE: element.APPLY_DATE===null?'' : moment(element.APPLY_DATE).utc().format('YYYY-MM-DD'),      
                WEEKDAY: weekdayarray[new Date(element.DATE_COLUMN).getDay()],
                id: index,
              };
            }
          );
          //console.log(loaded_data )
          setDiemDanhNhomTable(loaded_data);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success"
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  useEffect(() => {
    setisLoading(true);
    handleSearch();
  }, []);
  return (
    <div className='lichsu'>
      <h3>Lịch Sử Làm Việc Của Tôi</h3>
      <div className='filterform'>
        <label>
          <b>Từ ngày:</b>
          <input
            type='date'
            value={fromdate.slice(0, 10)}
            onChange={(e) => setFromDate(e.target.value)}
          ></input>
        </label>
        <label>
          <b>Tới ngày:</b>{" "}
          <input
            type='date'
            value={todate.slice(0, 10)}
            onChange={(e) => setToDate(e.target.value)}
          ></input>
        </label>
        <button
          className='searchbutton'
          onClick={() => {
            handleSearch();
          }}
        >
          Search
        </button>
      </div>
      <div className='maindept_table'>
        <DataGrid
          sx={{ fontSize: "0.8rem" }}
          components={{
            Toolbar: CustomToolbar,
            LoadingOverlay: LinearProgress,
          }}
          loading={isLoading}
          rowHeight={35}
          rows={diemdanhnhomtable}
          columns={columns_diemdanhnhom}
          rowsPerPageOptions={[5, 10, 50, 100, 500]}
          editMode='row'
          getRowHeight={() => "auto"}
        />
      </div>
    </div>
  );
};
export default LichSu;
