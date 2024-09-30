import {
  DataGrid,
  GridRowSelectionModel,
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
import { DiemDanhLichSuData, UserData } from "../../../api/GlobalInterface";

const LichSu = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const [isLoading, setisLoading] = useState(false);
  const [diemdanhnhomtable, setDiemDanhNhomTable] = useState<
    Array<DiemDanhLichSuData>
  >([]);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-01"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const columns_diemdanhnhom = [
    {
      field: "DATE_COLUMN",
      headerName: "DATE_COLUMN",
      width: 120,headerClassName: 'super-app-theme--header',      
    },
    {
      field: "WEEKDAY",
      headerName: "WEEKDAY",
      width: 120,headerClassName: 'super-app-theme--header',
      renderCell: (params: any) => {
        if (params.row.WEEKDAY === "Sunday") {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "red" }}>
                {params.row.WEEKDAY}
              </span>
            </div>
          );
        } else {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "#4268F4" }}>
                {params.row.WEEKDAY}
              </span>
            </div>
          );
        }
      },
    },
    {
      field: "ON_OFF",
      headerName: "ON_OFF",
      width: 120,headerClassName: 'super-app-theme--header',
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
        } else {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "#754EFA" }}>
                Chưa điểm danh
              </span>
            </div>
          );
        }
      },
    },
    {
      field: "CHECK1",
      headerName: "CHECK1",
      width: 120,headerClassName: 'super-app-theme--header',
      renderCell: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.row.CHECK1}
            </span>
          </div>
        );
      },
    },
    {
      field: "CHECK2",
      headerName: "CHECK2",
      width: 120,headerClassName: 'super-app-theme--header',
      renderCell: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.row.CHECK2}
            </span>
          </div>
        );
      },
    },
    {
      field: "CHECK3",
      headerName: "CHECK3",
      width: 120,headerClassName: 'super-app-theme--header',
      renderCell: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.row.CHECK3}
            </span>
          </div>
        );
      },
    },
    {
      field: "PHE_DUYET",
      headerName: "PHE_DUYET",
      width: 120,headerClassName: 'super-app-theme--header',
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
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 120,headerClassName: 'super-app-theme--header' },
    { field: "CMS_ID", headerName: "NS_ID", width: 120,headerClassName: 'super-app-theme--header' },
    { field: "MIDLAST_NAME", headerName: "MIDLAST_NAME", width: 170,headerClassName: 'super-app-theme--header' },
    { field: "FIRST_NAME", headerName: "FIRST_NAME", width: 120,headerClassName: 'super-app-theme--header' },
    { field: "CA_NGHI", headerName: "CA_NGHI", width: 100,headerClassName: 'super-app-theme--header' },
    { field: "OVERTIME_INFO", headerName: "OVERTIME_INFO", width: 120,headerClassName: 'super-app-theme--header' },
    { field: "OVERTIME", headerName: "OVERTIME", width: 100,headerClassName: 'super-app-theme--header' },
    { field: "REASON_NAME", headerName: "REASON_NAME", width: 120,headerClassName: 'super-app-theme--header' },
    { field: "REMARK", headerName: "REMARK", width: 170,headerClassName: 'super-app-theme--header' },
    { field: "XACNHAN", headerName: "XACNHAN", width: 120,headerClassName: 'super-app-theme--header' },
    { field: "PHONE_NUMBER", headerName: "PHONE_NUMBER", width: 120,headerClassName: 'super-app-theme--header' },
    { field: "SEX_NAME", headerName: "SEX_NAME", width: 120,headerClassName: 'super-app-theme--header' },
    { field: "WORK_STATUS_NAME", headerName: "WORK_STATUS_NAME", width: 120,headerClassName: 'super-app-theme--header' },
    { field: "FACTORY_NAME", headerName: "FACTORY_NAME", width: 120,headerClassName: 'super-app-theme--header' },
    { field: "JOB_NAME", headerName: "JOB_NAME", width: 120,headerClassName: 'super-app-theme--header' },
    { field: "WORK_SHIF_NAME", headerName: "WORK_SHIF_NAME", width: 120,headerClassName: 'super-app-theme--header' },
    {
      field: "WORK_POSITION_NAME",
      headerName: "WORK_POSITION_NAME",
      width: 120,headerClassName: 'super-app-theme--header',
    },
    { field: "SUBDEPTNAME", headerName: "SUBDEPTNAME", width: 120,headerClassName: 'super-app-theme--header' },
    { field: "MAINDEPTNAME", headerName: "MAINDEPTNAME", width: 120,headerClassName: 'super-app-theme--header' },
    {
      field: "REQUEST_DATE",
      headerName: "REQUEST_DATE",
      width: 120,headerClassName: 'super-app-theme--header',  
      renderCell: (params: any) => {
        return (
         
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.row.REQUEST_DATE}
            </span>
          
        );
      },  
    },
    { field: "OFF_ID", headerName: "OFF_ID", width: 120,headerClassName: 'super-app-theme--header' },
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
          const loaded_data: DiemDanhLichSuData[] = response.data.data.map(
            (element: DiemDanhLichSuData, index: number) => {
              return {
                ...element,
                EMPL_NO: userData?.EMPL_NO,
                DATE_COLUMN: moment(element.DATE_COLUMN)
                  .utc()
                  .format("YYYY-MM-DD"),
                  REQUEST_DATE: element.REQUEST_DATE === null ? "" :  moment(element.REQUEST_DATE)
                  .utc()
                  .format("YYYY-MM-DD"),
                APPLY_DATE:
                  element.APPLY_DATE === null
                    ? ""
                    : moment(element.APPLY_DATE).utc().format("YYYY-MM-DD"),
                WEEKDAY: weekdayarray[new Date(element.DATE_COLUMN).getDay()],
                CHECK1:
                  element.CHECK1 !== null
                    ? moment.utc(element.CHECK1).format("HH:mm:ss")
                    : "",
                CHECK2:
                  element.CHECK2 !== null
                    ? moment.utc(element.CHECK2).format("HH:mm:ss")
                    : "",
                CHECK3:
                  element.CHECK3 !== null
                    ? moment.utc(element.CHECK3).format("HH:mm:ss")
                    : "",
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
    (<div className='lichsu'>
      <div className='filterform'>
        <label>
          <b>From Date:</b>
          <input
            type='date'
            value={fromdate.slice(0, 10)}
            onChange={(e) => setFromDate(e.target.value)}
          ></input>
        </label>
        <label>
          <b>To Date:</b>{" "}
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
          sx={{
            fontSize: "0.7rem", '& .super-app-theme--header': {
              backgroundColor: 'rgba(10, 138, 170, 0.775)',
              fontSize:'0.8rem',
              color:'white'
            },
          }}
          columnHeaderHeight={20}
          slots={{
            toolbar: CustomToolbar,
            
          }}
          loading={isLoading}
          rowHeight={35}
          rows={diemdanhnhomtable}
          columns={columns_diemdanhnhom}
          pageSizeOptions={[5, 10, 50, 100, 500]}
          editMode='row'
          getRowHeight={() => "auto"}
        />
      </div>
    </div>)
  );
};
export default LichSu;
