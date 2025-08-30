import { useEffect, useMemo, useState } from "react";
import { generalQuery, getCompany} from "../../../api/Api";
import "./LichSu_New.scss";
import Swal from "sweetalert2";
import { weekdayarray } from "../../../api/GlobalFunction";
import moment from "moment";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import {UserData } from "../../../api/GlobalInterface";
import { DiemDanhLichSuData } from "../interfaces/nhansuInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { IconButton } from "@mui/material";
import { BiLoaderCircle } from "react-icons/bi";
import { calculateOvertime, OvertimeInput } from "../BangChamCong/OverTimeUtils";
import {  calculateWorkMinutesByPercentage, CalculationOptions } from "../BangChamCong/OverTimeUtils2";

const LichSu_New = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const [totalTime, setTotalTime] = useState( {
    overtime: 0,
    workingtime:0,
    approvaltime:0
    });
  const [basicSalary, setBasicSalary] = useState(0);

  const [diemdanhnhomtable, setDiemDanhNhomTable] = useState<
    Array<DiemDanhLichSuData>
  >([]);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-01"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const columns_diemdanhnhom = getCompany()==='CMS' ? [
    {
      field: "DATE_COLUMN",
      headerName: "DATE",
      width: 60,headerClass: 'super-app-theme--header',      
    },
    {
      field: "WEEKDAY",
      headerName: "WEEKDAY",
      width: 60,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        if (params.data.WEEKDAY === "Sunday") {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "red" }}>
                {params.data.WEEKDAY}
              </span>
            </div>
          );
        } else {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "#4268F4" }}>
                {params.data.WEEKDAY}
              </span>
            </div>
          );
        }
      },
    },
    {
      field: "ON_OFF",
      headerName: "ON_OFF",
      width: 70,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        if (params.data.ON_OFF === 1) {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "green" }}>Đi làm</span>
            </div>
          );
        } else if (params.data.ON_OFF === 0) {
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
      width: 50,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.data.CHECK1}
            </span>
          </div>
        );
      },
    },
    {
      field: "CHECK2",
      headerName: "CHECK2",
      width: 50,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.data.CHECK2}
            </span>
          </div>
        );
      },
    },
    {
      field: "CHECK3",
      headerName: "CHECK3",
      width: 50,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.data.CHECK3}
            </span>
          </div>
        );
      },
    },
    {
      field: "IN_TIME",
      headerName: "FIXED_IN",
      width: 70,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        if(params.data.IN_TIME !== 'OFF')
        {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "blue" }}>
                {params.data.IN_TIME}
              </span>
            </div>
          );    
        }
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "red" }}>
              {params.data.IN_TIME}
            </span>
          </div>
        );
      },
    },
    {
      field: "OUT_TIME",
      headerName: "FIXED_OUT",
      width: 70,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        if(params.data.OUT_TIME !== 'OFF')
        {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "blue" }}>
                {params.data.OUT_TIME}
              </span>
            </div>
          );    
        }
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "red" }}>
              {params.data.OUT_TIME}
            </span>
          </div>
        );
      },
    },
    {
      field: "EARLY_IN_MINUTES",
      headerName: "DI_SOM",
      width: 50,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "green" }}>
              {params.data.EARLY_IN_MINUTES}
            </span>
          </div>
        );
      },
    },
    {
      field: "LATE_IN_MINUTES",
      headerName: "DI_MUON",
      width: 50,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "red" }}>
              {params.data.LATE_IN_MINUTES}
            </span>
          </div>
        );
      },
    },
    {
      field: "EARLY_OUT_MINUTES",
      headerName: "VE_SOM",
      width: 50,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "red" }}>
              {params.data.EARLY_OUT_MINUTES}
            </span>
          </div>
        );
      },
    },
    {
      field: "OVERTIME_MINUTES",
      headerName: "TANG_CA",
      width: 50,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "green" }}>
              {params.data.OVERTIME_MINUTES}
            </span>
          </div>
        );
      },
    },
    {
      field: "WORKING_MINUTES",
      headerName: "HANH_CHINH",
      width: 70,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "blue" }}>
              {params.data.WORKING_MINUTES}
            </span>
          </div>
        );
      },
    },
    {
      field: "FINAL_OVERTIMES",
      headerName: "FIX_TANG_CA",
      width: 70,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "blue" }}>
              {params.data.FINAL_OVERTIMES}
            </span>
          </div>
        );
      },
    },
    {
      field: "PHE_DUYET",
      headerName: "PHE_DUYET",
      width: 60,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        if (params.data.APPROVAL_STATUS === 0) {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "red" }}>Từ chối</span>
            </div>
          );
        } else if (params.data.APPROVAL_STATUS === 1) {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "green" }}>
                Phê duyệt
              </span>
            </div>
          );
        } else if (params.data.APPROVAL_STATUS === 2) {
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
    { field: "REASON_NAME", headerName: "REASON_NAME", width: 80,headerClass: 'super-app-theme--header' },
    { field: "REMARK", headerName: "REMARK", width: 100,headerClass: 'super-app-theme--header' },
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 50,headerClass: 'super-app-theme--header' },
    { field: "CMS_ID", headerName: "NS_ID", width: 50,headerClass: 'super-app-theme--header' },
    { field: "MIDLAST_NAME", headerName: "MIDLAST_NAME", width: 90,headerClass: 'super-app-theme--header' },
    { field: "FIRST_NAME", headerName: "FIRST_NAME", width: 70,headerClass: 'super-app-theme--header' },
    { field: "CA_NGHI", headerName: "CA_NGHI", width: 100,headerClass: 'super-app-theme--header' },
    { field: "OVERTIME_INFO", headerName: "OVERTIME_INFO", width: 120,headerClass: 'super-app-theme--header' },
    { field: "OVERTIME", headerName: "OVERTIME", width: 100,headerClass: 'super-app-theme--header' },
   
    { field: "XACNHAN", headerName: "XACNHAN", width: 120,headerClass: 'super-app-theme--header' },
    { field: "PHONE_NUMBER", headerName: "PHONE_NUMBER", width: 120,headerClass: 'super-app-theme--header' },
    { field: "SEX_NAME", headerName: "SEX_NAME", width: 120,headerClass: 'super-app-theme--header' },
    { field: "WORK_STATUS_NAME", headerName: "WORK_STATUS_NAME", width: 120,headerClass: 'super-app-theme--header' },
    { field: "FACTORY_NAME", headerName: "FACTORY_NAME", width: 120,headerClass: 'super-app-theme--header' },
    { field: "JOB_NAME", headerName: "JOB_NAME", width: 120,headerClass: 'super-app-theme--header' },
    { field: "WORK_SHIF_NAME", headerName: "WORK_SHIF_NAME", width: 120,headerClass: 'super-app-theme--header' },
    {
      field: "WORK_POSITION_NAME",
      headerName: "WORK_POSITION_NAME",
      width: 120,headerClass: 'super-app-theme--header',
    },
    { field: "SUBDEPTNAME", headerName: "SUBDEPTNAME", width: 120,headerClass: 'super-app-theme--header' },
    { field: "MAINDEPTNAME", headerName: "MAINDEPTNAME", width: 120,headerClass: 'super-app-theme--header' },
    {
      field: "REQUEST_DATE",
      headerName: "REQUEST_DATE",
      width: 120,headerClass: 'super-app-theme--header',  
      cellRenderer: (params: any) => {
        return (
         
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.data.REQUEST_DATE}
            </span>
          
        );
      },  
    },
    { field: "OFF_ID", headerName: "OFF_ID", width: 120,headerClass: 'super-app-theme--header' },
  ]: [
    {
      field: "DATE_COLUMN",
      headerName: "DATE_COLUMN",
      width: 120,headerClass: 'super-app-theme--header',      
    },
    {
      field: "WEEKDAY",
      headerName: "WEEKDAY",
      width: 120,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        if (params.data.WEEKDAY === "Sunday") {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "red" }}>
                {params.data.WEEKDAY}
              </span>
            </div>
          );
        } else {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "#4268F4" }}>
                {params.data.WEEKDAY}
              </span>
            </div>
          );
        }
      },
    },
    {
      field: "ON_OFF",
      headerName: "ON_OFF",
      width: 120,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        if (params.data.ON_OFF === 1) {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "green" }}>Đi làm</span>
            </div>
          );
        } else if (params.data.ON_OFF === 0) {
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
      width: 70,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.data.CHECK1}
            </span>
          </div>
        );
      },
    },
    {
      field: "CHECK2",
      headerName: "CHECK2",
      width: 70,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.data.CHECK2}
            </span>
          </div>
        );
      },
    },
    {
      field: "CHECK3",
      headerName: "CHECK3",
      width: 70,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.data.CHECK3}
            </span>
          </div>
        );
      },
    },    
    {
      field: "PHE_DUYET",
      headerName: "PHE_DUYET",
      width: 100,headerClass: 'super-app-theme--header',
      cellRenderer: (params: any) => {
        if (params.data.APPROVAL_STATUS === 0) {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "red" }}>Từ chối</span>
            </div>
          );
        } else if (params.data.APPROVAL_STATUS === 1) {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "green" }}>
                Phê duyệt
              </span>
            </div>
          );
        } else if (params.data.APPROVAL_STATUS === 2) {
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
    { field: "REASON_NAME", headerName: "REASON_NAME", width: 100,headerClass: 'super-app-theme--header' },
    { field: "REMARK", headerName: "REMARK", width: 100,headerClass: 'super-app-theme--header' },
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 120,headerClass: 'super-app-theme--header' },
    { field: "CMS_ID", headerName: "NS_ID", width: 120,headerClass: 'super-app-theme--header' },
    { field: "MIDLAST_NAME", headerName: "MIDLAST_NAME", width: 170,headerClass: 'super-app-theme--header' },
    { field: "FIRST_NAME", headerName: "FIRST_NAME", width: 120,headerClass: 'super-app-theme--header' },
    { field: "CA_NGHI", headerName: "CA_NGHI", width: 100,headerClass: 'super-app-theme--header' },
    { field: "OVERTIME_INFO", headerName: "OVERTIME_INFO", width: 120,headerClass: 'super-app-theme--header' },
    { field: "OVERTIME", headerName: "OVERTIME", width: 100,headerClass: 'super-app-theme--header' },
   
    { field: "XACNHAN", headerName: "XACNHAN", width: 120,headerClass: 'super-app-theme--header' },
    { field: "PHONE_NUMBER", headerName: "PHONE_NUMBER", width: 120,headerClass: 'super-app-theme--header' },
    { field: "SEX_NAME", headerName: "SEX_NAME", width: 120,headerClass: 'super-app-theme--header' },
    { field: "WORK_STATUS_NAME", headerName: "WORK_STATUS_NAME", width: 120,headerClass: 'super-app-theme--header' },
    { field: "FACTORY_NAME", headerName: "FACTORY_NAME", width: 120,headerClass: 'super-app-theme--header' },
    { field: "JOB_NAME", headerName: "JOB_NAME", width: 120,headerClass: 'super-app-theme--header' },
    { field: "WORK_SHIF_NAME", headerName: "WORK_SHIF_NAME", width: 120,headerClass: 'super-app-theme--header' },
    {
      field: "WORK_POSITION_NAME",
      headerName: "WORK_POSITION_NAME",
      width: 120,headerClass: 'super-app-theme--header',
    },
    { field: "SUBDEPTNAME", headerName: "SUBDEPTNAME", width: 120,headerClass: 'super-app-theme--header' },
    { field: "MAINDEPTNAME", headerName: "MAINDEPTNAME", width: 120,headerClass: 'super-app-theme--header' },
    {
      field: "REQUEST_DATE",
      headerName: "REQUEST_DATE",
      width: 120,headerClass: 'super-app-theme--header',  
      cellRenderer: (params: any) => {
        return (
         
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.data.REQUEST_DATE}
            </span>
          
        );
      },  
    },
    { field: "OFF_ID", headerName: "OFF_ID", width: 120,headerClass: 'super-app-theme--header' },
  ]; 
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
          const totalOvertime = loaded_data.reduce((total, item) => total + (item.FINAL_OVERTIMES || 0), 0);
          const totalWorkingTime = loaded_data.reduce((total, item) => total + (item.WORKING_MINUTES || 0), 0);
          const totalApprovalTime = loaded_data.reduce((total, item) => total + (item.ON_OFF===0 ? item.APPROVAL_STATUS === 1 ? 1 : 0 : 0), 0);
          setTotalTime({
            overtime: totalOvertime,
            workingtime: totalWorkingTime,
            approvaltime: totalApprovalTime,
          }); 
          setDiemDanhNhomTable(loaded_data);         
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

  const workHistoryAGTable = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
       
        toolbar={
          <div style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                handleSearch();                
              }}
            >
              <BiLoaderCircle color="#06cc70" size={15} />
              Load Data
            </IconButton>  
          </div>}
        columns={columns_diemdanhnhom}
        data={diemdanhnhomtable}
        onCellEditingStopped={(params: any) => {
          //console.log(e.data)
        }} onRowClick={(params: any) => {
          
          //console.log(e.data) 
        }} onSelectionChange={(params: any) => {
          //console.log(params)
          //setSelectedRows(params!.api.getSelectedRows()[0]);
          //console.log(e!.api.getSelectedRows())
        }} onRowDoubleClick={(params: any) => {
          
        }}
      />
    )
  }, [columns_diemdanhnhom, diemdanhnhomtable])

  useEffect(() => {
    handleSearch();
  }, []);
  return (
    (<div className='lichsu_new'>
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
      {getCompany() === 'CMS' && <div className='filterform'>
        <label>
          <b>Số ngày được phê duyệt nghỉ:</b>
          <input
          style={{width: '30px'}}
            type='number'
            value={totalTime.approvaltime}
            onChange={(e) => setTotalTime({...totalTime, approvaltime: parseInt(e.target.value)})}
          ></input> (ngày)
        </label>
        <label>
          <b>Số phút hành chính:</b>{" "}
          <input
          style={{width: '50px'}}
            type='number'
            value={totalTime.workingtime}
            onChange={(e) => setTotalTime({...totalTime, workingtime: parseInt(e.target.value)})}
          ></input>(phút)
        </label>
        <label>
          <b>Số phút tăng ca:</b>{" "}
          <input
          style={{width: '50px'}}
            type='number'
            value={totalTime.overtime}
            onChange={(e) => setTotalTime({...totalTime, overtime: parseInt(e.target.value)})}
          ></input>(phút)
        </label>
        <label>
          <b>Lương cơ bản:</b>{" "}
          <input
          style={{width: '50px'}}
            type='number'
            value={basicSalary}
            onChange={(e) => setBasicSalary(parseInt(e.target.value))}
          ></input>(VNĐ)
        </label>
        <button
          className='searchbutton'
          onClick={() => {
            
            // Ví dụ sử dụng
            const input: OvertimeInput = {
              date: '2025-06-28', // Thứ Hai (ngày thường)
              inTime: '19:59',
              outTime: '08:25',
            };
            const companyOptions: CalculationOptions = {
              weeklyDaysOff: [0] // 0 là Chủ nhật
            };
            console.log(input);            
            console.log(calculateWorkMinutesByPercentage(input, companyOptions));
           /*  Swal.fire(
              "Thông báo",
              "Lương lậu làm cái gì, được bao nhiêu đâu mà tính, khổ lắm !",
              "error"
            ); */
          }}
        >
          Tính lương
        </button>
       
       
      </div>}
      <div className='maindept_table'>
        {
          workHistoryAGTable
        }
       
      </div>
    </div>)
  );
};
export default LichSu_New;
