import { useEffect, useMemo, useState } from "react";
import { generalQuery, getCompany, getUserData} from "../../../api/Api";
import "./LichSu_New.scss";
import Swal from "sweetalert2";
import { weekdayarray } from "../../../api/GlobalFunction";
import moment from "moment";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import {UserData } from "../../../api/GlobalInterface";
import { DiemDanhLichSuData, DiemDanhNhomData } from "../interfaces/nhansuInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { IconButton } from "@mui/material";
import { BiLoaderCircle } from "react-icons/bi";
import { calculateOvertime, OvertimeInput } from "../BangChamCong/OverTimeUtils";
import {  calculateWorkMinutesByPercentage, CalculationOptions } from "../BangChamCong/OverTimeUtils2";
import { calcMinutesByRate, calculatePersonalIncomeTax } from "../BangChamCong/OverTimeUtils3";
import PhieuLuongBang, { PhieuLuong } from "../BangChamCong/PhieuLuong";
import { useForm } from "react-hook-form";




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
    /* {
      field: "L100",
      headerName: "L100",
      width: 50,headerClass: 'super-app-theme--header',
    },
    {
      field: "L130",
      headerName: "L130",
      width: 50,headerClass: 'super-app-theme--header',
    },
    {
      field: "L150",
      headerName: "L150",
      width: 50,headerClass: 'super-app-theme--header',
    },
    {
      field: "L200",
      headerName: "L200",
      width: 50,headerClass: 'super-app-theme--header',
    },
    {
      field: "L210",
      headerName: "L210",
      width: 50,headerClass: 'super-app-theme--header',
    },
    {
      field: "L270",
      headerName: "L270",
      width: 50,headerClass: 'super-app-theme--header',
    },
    {
      field: "L300",
      headerName: "L300",
      width: 50,headerClass: 'super-app-theme--header',
    },
    {
      field: "L390",
      headerName: "L390",
      width: 50,headerClass: 'super-app-theme--header',
    }, */
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
    generalQuery("mydiemdanhnhom", { from_date: watch("fromdate"), to_date: watch("todate") })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: DiemDanhLichSuData[] = response.data.data.map(
            (element: DiemDanhLichSuData, index: number) => {              
              const ratetb = calcMinutesByRate(element.IN_TIME, element.OUT_TIME, moment(element.DATE_COLUMN).utc().format("YYYY-MM-DD"));              
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
                L100: element.REASON_NAME==='Phép năm' ? 480 : element.REASON_NAME==='Nửa phép' ? 240 + Math.min(ratetb["100%"],240) : ratetb["100%"] ,
                L130: ratetb["130%"],
                L150: ratetb["150%"],
                L200: ratetb["200%"],
                L210: ratetb["210%"],
                L270: ratetb["270%"],
                L300: ratetb["300%"],
                L390: ratetb["390%"],
                id: index,
              };
            }
          );
          //tinhLuong(loaded_data);
          setPhieuLuong(tinhLuong(loaded_data));
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

  const getLocalStorageLuongInfo = () => {
    const luongInfo = localStorage.getItem('luongInfo');
    if (luongInfo) {
      return JSON.parse(luongInfo);
    }
    return null;
  };
  const setLocalStorageLuongInfo = (luongInfo: any) => {
    localStorage.setItem('luongInfo', JSON.stringify(luongInfo));
  };
  const {register,handleSubmit,watch, formState:{errors}} = useForm( {
    defaultValues:{
      fromdate:moment().format("YYYY-MM-01"),
      todate:moment().format("YYYY-MM-DD"),       
      luong_co_ban: getLocalStorageLuongInfo()?.luong_co_ban || 0,
      luong_dong_bao_hiem: getLocalStorageLuongInfo()?.luong_dong_bao_hiem || 0,
      nguoi_phu_thuoc: getLocalStorageLuongInfo()?.nguoi_phu_thuoc || 0,
      phu_cap_trach_nhiem: getLocalStorageLuongInfo()?.phu_cap_trach_nhiem || 0,
      phu_cap_ngonngu_chuyenmon: getLocalStorageLuongInfo()?.phu_cap_ngonngu_chuyenmon || 0,
      phu_cap_chuc_vu: getLocalStorageLuongInfo()?.phu_cap_chuc_vu || 0,
      tro_cap_danh_gia: getLocalStorageLuongInfo()?.tro_cap_danh_gia || 0,
      phu_cap_nguy_hiem_doc_hai: getLocalStorageLuongInfo()?.phu_cap_nguy_hiem_doc_hai || 0,
      tro_cap_xe_nang_xe_tai: getLocalStorageLuongInfo()?.tro_cap_xe_nang_xe_tai || 0,
      phu_cap_xray_pccc_vsv: getLocalStorageLuongInfo()?.phu_cap_xray_pccc_vsv || 0,
      che_do: getLocalStorageLuongInfo()?.che_do || 0,
    }
  });
  const [phieuLuong, setPhieuLuong] = useState<PhieuLuong | null>(null);

  const tinhLuong = (data : DiemDanhLichSuData[]) => {
    const luong_co_ban = parseInt(watch('luong_co_ban'));
    const luong_dong_bao_hiem = parseInt(watch('luong_dong_bao_hiem'));
    const nguoi_phu_thuoc = parseInt(watch('nguoi_phu_thuoc'));
    const phu_cap_trach_nhiem = parseInt(watch('phu_cap_trach_nhiem'));
    const phu_cap_ngonngu_chuyenmon = parseInt(watch('phu_cap_ngonngu_chuyenmon'));
    const phu_cap_chuc_vu = parseInt(watch('phu_cap_chuc_vu'));
    const tro_cap_danh_gia = parseInt(watch('tro_cap_danh_gia'));
    const phu_cap_nguy_hiem_doc_hai = parseInt(watch('phu_cap_nguy_hiem_doc_hai'));
    const tro_cap_xe_nang_xe_tai = parseInt(watch('tro_cap_xe_nang_xe_tai'));
    const phu_cap_xray_pccc_vsv = parseInt(watch('phu_cap_xray_pccc_vsv'));
    const che_do = parseInt(watch('che_do'));

    let so_bua_com = 0;
    let so_ngay_cong = 0;
    let so_ngay_cong_tinh_phu_cap=0;
    let L100 = 0, L130 = 0, L150 = 0, L200= 0, L210 = 0, L270 = 0, L300 = 0, L390 = 0;
    let luong_thuc_te_theo_ngay_cong = (luong_co_ban +  phu_cap_trach_nhiem + phu_cap_ngonngu_chuyenmon + phu_cap_chuc_vu + tro_cap_danh_gia + phu_cap_nguy_hiem_doc_hai + tro_cap_xe_nang_xe_tai + phu_cap_xray_pccc_vsv);
    let luong_tinh_tang_ca = luong_dong_bao_hiem;
    let chuyen_can = 0; 
    let tro_cap_dien_thoai = 0;
    let phu_cap_chuyen_can = 0;
    let tro_cap_an_uong = 0;
    let phu_cap_di_lai = 0;
    let luong_tang_ca = 0;
    let tong_luong_truoc_thue = 0;
    let luong_theo_ngay_cong = 0;
    let luong_mien_thue = 0;
    let tang_ca_khong_tinh_thue= 0;
    let bao_hiem_xa_hoi = 0;
    let luong_phu_thuoc = 0;
    let luong_chiu_thue =0;
    let luong_thuc_nhan =0;


    
    for(let i=0; i<data.length; i++) {
      L100 += data[i].L100;
      L130 += data[i].L130;
      L150 += data[i].L150;
      L200 += data[i].L200;
      L210 += data[i].L210;
      L270 += data[i].L270;
      L300 += data[i].L300;
      L390 += data[i].L390;
      if((data[i].REASON_NAME!=='Nửa phép' &&(data[i].ON_OFF ===  1)) || (data[i].APPROVAL_STATUS === 1 && (data[i].REASON_NAME==='Phép năm' || data[i].REASON_NAME==='Nửa phép'))|| (data[i].ON_OFF !== 1)&& data[i].L100 === 480) {
        so_ngay_cong++;
      }
      
      const inTime = moment(data[i].IN_TIME, 'HH:mm');
      const outTime = moment(data[i].OUT_TIME, 'HH:mm');

      if (inTime.isBefore(outTime)) {
        if(outTime.isAfter(moment('16:59', 'HH:mm'))) {
          so_bua_com++;
        }

        if(outTime.isAfter(moment('19:29', 'HH:mm'))) {
          so_bua_com++;
        }

        if((data[i].REASON_NAME==='Phép năm' || data[i].REASON_NAME==='Nửa phép') && data[i].APPROVAL_STATUS===1 && outTime.isBefore(moment('17:00', 'HH:mm'))) {
          so_bua_com++;
        }
      }
      else {
        if(outTime.isAfter(moment('04:59', 'HH:mm'))) {
          so_bua_com++;
        }
        if(outTime.isAfter(moment('07:29', 'HH:mm'))) {
          so_bua_com++;
        }
      }  
      // tinh ngay luong tinh phu cap
      if (data[i].REASON_NAME==='Nửa phép' && data[i].ON_OFF === 1) {   
        if(data[i].APPROVAL_STATUS===1 && !outTime.isAfter(moment('16:59', 'HH:mm'))) {
          so_ngay_cong_tinh_phu_cap++;
        }        
      }
      else {
        if(data[i].ON_OFF === 1) {
          so_ngay_cong_tinh_phu_cap++;
        }
      }  

      //chuyen can
      if(data[i].APPROVAL_STATUS===1) {
        chuyen_can++;
      }
      else if(data[i].ON_OFF === 1) {
        if((data[i].LATE_IN_MINUTES === 0 && data[i].EARLY_OUT_MINUTES === 0)) {
          chuyen_can++;
        }
      }
      else {
        if(L100 === 480) {
          chuyen_can++;
        }
      }
    }


    if (chuyen_can > 25) {
      phu_cap_chuyen_can = 200000;
    }

    let tong_phut_tang_ca_100 = L130 + L150 + L200 + L210 + L270 + L300 + L390;
    let tong_phut_tang_ca_full = L130*1.3 + L150*1.5 + L200*2 + L210*2.1 + L270*2.7 + L300*4 + L390*4.9;
    let tong_phut_Tang_ca_khong_tinh_thue = tong_phut_tang_ca_full - tong_phut_tang_ca_100;

    tro_cap_dien_thoai = 350000*so_ngay_cong_tinh_phu_cap/26;
    phu_cap_di_lai = 350000*so_ngay_cong_tinh_phu_cap/26;
    tro_cap_an_uong = so_bua_com*35000;
    luong_tang_ca = tong_phut_tang_ca_full*luong_tinh_tang_ca/26/8/60;
    luong_theo_ngay_cong = luong_thuc_te_theo_ngay_cong*so_ngay_cong/26;

    tong_luong_truoc_thue = luong_theo_ngay_cong + luong_tang_ca + tro_cap_an_uong + phu_cap_di_lai + tro_cap_dien_thoai + phu_cap_chuyen_can + che_do;
    tang_ca_khong_tinh_thue = tong_phut_Tang_ca_khong_tinh_thue*luong_tinh_tang_ca/26/8/60;
    bao_hiem_xa_hoi = luong_dong_bao_hiem*10.5/100;
    luong_phu_thuoc = (nguoi_phu_thuoc*4400000 + 11000000);

    luong_mien_thue= bao_hiem_xa_hoi + luong_phu_thuoc + (tro_cap_an_uong>730000? 730000 : tro_cap_an_uong) + tro_cap_dien_thoai + phu_cap_nguy_hiem_doc_hai + tro_cap_xe_nang_xe_tai + che_do + tang_ca_khong_tinh_thue;
    luong_chiu_thue = tong_luong_truoc_thue - luong_mien_thue;

    console.log('luong_mien_thue', luong_mien_thue);
    console.log('luong_chiu_thue', luong_chiu_thue);

    const tax = calculatePersonalIncomeTax(luong_chiu_thue);
    luong_thuc_nhan = tong_luong_truoc_thue - tax - bao_hiem_xa_hoi - 50000;
    console.log('tax', tax);
    console.log('luong_thuc_nhan', luong_thuc_nhan);


    let phieuLuongData: PhieuLuong = {
      ten_nhan_vien: data[0].MIDLAST_NAME + ' ' + data[0].FIRST_NAME,
      bo_phan: data[0].MAINDEPTNAME,
      ngan_hang: "Vietin bank",
      thang: moment(data[0].DATE_COLUMN).format('MM/YYYY'),
      chi_tiet: [
        { noi_dung: "Lương cơ bản", don_vi_tinh: "VND", so_tien: luong_co_ban },
        { noi_dung: "PC Trách nhiệm", don_vi_tinh: "VND", so_tien: phu_cap_trach_nhiem },
        { noi_dung: "Phụ cấp ngoại ngữ chuyên môn", don_vi_tinh: "VND", so_tien: phu_cap_ngonngu_chuyenmon },
        { noi_dung: "Phụ cấp chức vụ", don_vi_tinh: "VND", so_tien: phu_cap_chuc_vu },
        { noi_dung: "Trợ cấp đánh giá", don_vi_tinh: "VND", so_tien: tro_cap_danh_gia },
        { noi_dung: "Phụ cấp nguy hiểm độc hại", don_vi_tinh: "VND", so_tien: phu_cap_nguy_hiem_doc_hai },
        { noi_dung: "Trợ cấp xe nâng xe tải", don_vi_tinh: "VND", so_tien: tro_cap_xe_nang_xe_tai },
        { noi_dung: "Phụ cấp XRay, PCCC, VSV", don_vi_tinh: "VND", so_tien: phu_cap_xray_pccc_vsv },
    
        { noi_dung: "Ngày công/Tháng", don_vi_tinh: "Ngày", so_tien: so_ngay_cong },
        { noi_dung: "Lương thực tế theo ngày công", don_vi_tinh: "VND", so_tien: luong_theo_ngay_cong },
        { noi_dung: "Tiền cơm (35k)", don_vi_tinh: "VND", so_tien: tro_cap_an_uong },
        { noi_dung: "Trợ cấp điện thoại", don_vi_tinh: "VND", so_tien: tro_cap_dien_thoai },
        { noi_dung: "Chuyên cần", don_vi_tinh: "VND", so_tien: phu_cap_chuyen_can },
        { noi_dung: "Phụ cấp đi lại", don_vi_tinh: "VND", so_tien: phu_cap_di_lai },
    
        { noi_dung: "Thời gian 50% - luân phiên", don_vi_tinh: "Phút", so_tien: 0 },
        { noi_dung: "Làm 100%", don_vi_tinh: "Phút", so_tien: L100 },
        { noi_dung: "Làm ban đêm 130%", don_vi_tinh: "Phút", so_tien: L130 },
        { noi_dung: "Làm thêm giờ 150%", don_vi_tinh: "Phút", so_tien: L150 },
        { noi_dung: "Làm thêm giờ 210%", don_vi_tinh: "Phút", so_tien: L210 },
        { noi_dung: "Làm thêm giờ 200%", don_vi_tinh: "Phút", so_tien: L200 },
        { noi_dung: "Làm thêm giờ 300%", don_vi_tinh: "Phút", so_tien: L300 },
        { noi_dung: "Làm thêm giờ 270%", don_vi_tinh: "Phút", so_tien: L270 },
        { noi_dung: "Làm thêm giờ 390%", don_vi_tinh: "Phút", so_tien: L390 },
    
        { noi_dung: "Bù Lương", don_vi_tinh: "VND", so_tien: 0 },
        { noi_dung: "Thanh toán phép", don_vi_tinh: "VND", so_tien: 0 },
        { noi_dung: "Lương thưởng 150%", don_vi_tinh: "VND", so_tien: 0 },
        { noi_dung: "Lương 100%", don_vi_tinh: "VND", so_tien: 0 },
        { noi_dung: "Lương làm thêm giờ", don_vi_tinh: "VND", so_tien: luong_tang_ca },
        { noi_dung: "Lương nghỉ luân phiên hoặc hưởng 50%", don_vi_tinh: "VND", so_tien: 0 },
        { noi_dung: "Hưởng chế độ (kết hôn, ma chay, sinh nhật con nhỏ, thâm niên)", don_vi_tinh: "VND", so_tien: che_do },
        { noi_dung: "Trợ cấp thôi việc (TNLĐ)", don_vi_tinh: "VND", so_tien: 0 }
      ],
      cac_khoan_giam_tru: [
        { noi_dung: "Đi muộn - về sớm", don_vi_tinh: "Tiền", so_tien: 0 },
        { noi_dung: "Đóng BHXH", don_vi_tinh: "VND", so_tien: bao_hiem_xa_hoi },
        { noi_dung: "Đóng phí Công đoàn", don_vi_tinh: "VND", so_tien: 50000 },
        { noi_dung: "Thuế TNCN (cộng cả tiền thưởng)", don_vi_tinh: "VND", so_tien: tax }
      ],
      tong_luong_thang: luong_thuc_nhan
    }; 
    return phieuLuongData;   
  }

  useEffect(() => {
    handleSearch();
  }, []);
  return (
    <div className='lichsu_new'>
      <div className='filterform'>
        <label>
          <b>From Date:</b>
          <input {...register('fromdate')} type='date' value={watch('fromdate')}></input>
        </label>
        <label>
          <b>To Date:</b> <input {...register('todate')} type='date' value={watch('todate')}></input>
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
      {/* {getCompany() === 'CMS' && (
        <div className='filterform'>
          <label>
            <b>Số ngày được phê duyệt nghỉ:</b>
            <input style={{ width: '30px' }} type='number' value={totalTime.approvaltime} onChange={(e) => setTotalTime({ ...totalTime, approvaltime: parseInt(e.target.value) })}></input> (ngày)
          </label>
          <label>
            <b>Số phút hành chính:</b> <input style={{ width: '50px' }} type='number' value={totalTime.workingtime} onChange={(e) => setTotalTime({ ...totalTime, workingtime: parseInt(e.target.value) })}></input>(phút)
          </label>
          <label>
            <b>Số phút tăng ca:</b> <input style={{ width: '50px' }} type='number' value={totalTime.overtime} onChange={(e) => setTotalTime({ ...totalTime, overtime: parseInt(e.target.value) })}></input>(phút)
          </label>
          <label>
            <b>Lương cơ bản:</b> <input style={{ width: '50px' }} type='number' value={basicSalary} onChange={(e) => setBasicSalary(parseInt(e.target.value))}></input>(VNĐ)
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
                weeklyDaysOff: [0], // 0 là Chủ nhật
              };
              console.log(input);
              //console.log(calculateWorkMinutesByPercentage(input, companyOptions));
              console.log(calcMinutesByRate(input.inTime, input.outTime, input.date));
            }}
          >
            Tính lương
          </button>
        </div>
      )} */}
      {false && getCompany() === 'CMS' && (
        <div className='filterform'>
          <label>
            <b>Lương CB:</b>
            <input {...register('luong_co_ban')} style={{ width: '65px' }} type='number' defaultValue={getLocalStorageLuongInfo()?.luong_co_ban || 0} onChange={(e) => setLocalStorageLuongInfo({ ...getLocalStorageLuongInfo(), luong_co_ban: parseInt(e.target.value) })}></input> (VNĐ)
          </label>
          <label>
            <b>Lương đóng BH:</b>
            <input {...register('luong_dong_bao_hiem')} style={{ width: '65px' }} type='number' defaultValue={getLocalStorageLuongInfo()?.luong_dong_bao_hiem || 0} onChange={(e) => setLocalStorageLuongInfo({ ...getLocalStorageLuongInfo(), luong_dong_bao_hiem: parseInt(e.target.value) })}></input> (VNĐ)
          </label>
          <label>
            <b>Người phụ thuộc:</b>
            <input {...register('nguoi_phu_thuoc')} style={{ width: '65px' }} type='number' defaultValue={getLocalStorageLuongInfo()?.nguoi_phu_thuoc || 0} onChange={(e) => setLocalStorageLuongInfo({ ...getLocalStorageLuongInfo(), nguoi_phu_thuoc: parseInt(e.target.value) })}></input> (người)
          </label>
          <label>
            <b>PC trách nhiệm:</b>
            <input {...register('phu_cap_trach_nhiem')} style={{ width: '65px' }} type='number' defaultValue={getLocalStorageLuongInfo()?.phu_cap_trach_nhiem || 0} onChange={(e) => setLocalStorageLuongInfo({ ...getLocalStorageLuongInfo(), phu_cap_trach_nhiem: parseInt(e.target.value) })}></input> (VNĐ)
          </label>
          <label>
            <b>PC ngôn ngữ chuyên môn:</b>
            <input {...register('phu_cap_ngonngu_chuyenmon')} style={{ width: '65px' }} type='number' defaultValue={getLocalStorageLuongInfo()?.phu_cap_ngonngu_chuyenmon || 0} onChange={(e) => setLocalStorageLuongInfo({ ...getLocalStorageLuongInfo(), phu_cap_ngonngu_chuyenmon: parseInt(e.target.value) })}></input> (VNĐ)
          </label>          
        </div>
      )}
      {false && getCompany() === 'CMS' && (
        <div className='filterform'>          
          <label>
            <b>PC chức vụ:</b>
            <input {...register('phu_cap_chuc_vu')} style={{ width: '65px' }} type='number' defaultValue={getLocalStorageLuongInfo()?.phu_cap_chuc_vu || 0} onChange={(e) => setLocalStorageLuongInfo({ ...getLocalStorageLuongInfo(), phu_cap_chuc_vu: parseInt(e.target.value) })}></input> (VNĐ)
          </label>
          <label>
            <b>TC đánh giá:</b>
            <input {...register('tro_cap_danh_gia')} style={{ width: '65px' }} type='number' defaultValue={getLocalStorageLuongInfo()?.tro_cap_danh_gia || 0} onChange={(e) => setLocalStorageLuongInfo({ ...getLocalStorageLuongInfo(), tro_cap_danh_gia: parseInt(e.target.value) })}></input> (VNĐ)
          </label>
          <label>
            <b>TC nguy hiểm độc hại:</b>
            <input {...register('phu_cap_nguy_hiem_doc_hai')} style={{ width: '65px' }} type='number' defaultValue={getLocalStorageLuongInfo()?.phu_cap_nguy_hiem_doc_hai || 0} onChange={(e) => setLocalStorageLuongInfo({ ...getLocalStorageLuongInfo(), phu_cap_nguy_hiem_doc_hai: parseInt(e.target.value) })}></input> (VNĐ)
          </label>
          <label>
            <b>TC xe nâng xe tải:</b>
            <input {...register('tro_cap_xe_nang_xe_tai')} style={{ width: '65px' }} type='number' defaultValue={getLocalStorageLuongInfo()?.tro_cap_xe_nang_xe_tai || 0} onChange={(e) => setLocalStorageLuongInfo({ ...getLocalStorageLuongInfo(), tro_cap_xe_nang_xe_tai: parseInt(e.target.value) })}></input> (VNĐ)
          </label>
          <label>
            <b>PC X-ray, PCCC, VSV:</b>
            <input {...register('phu_cap_xray_pccc_vsv')} style={{ width: '65px' }} type='number' defaultValue={getLocalStorageLuongInfo()?.phu_cap_xray_pccc_vsv || 0} onChange={(e) => setLocalStorageLuongInfo({ ...getLocalStorageLuongInfo(), phu_cap_xray_pccc_vsv: parseInt(e.target.value) })}></input> (VNĐ)
          </label>
          <label>
            <b>Chế độ (ma chay, con nhỏ v.v.v):</b>
            <input {...register('che_do')} style={{ width: '65px' }} type='number' defaultValue={getLocalStorageLuongInfo()?.che_do || 0} onChange={(e) => setLocalStorageLuongInfo({ ...getLocalStorageLuongInfo(), che_do: parseInt(e.target.value) })}></input> (VNĐ)
          </label>
        </div>
      )}
      <div className='maindept_table'>
        {workHistoryAGTable}
        {/* {getCompany() === 'CMS' && (
          <div style={{ height: '87vh', backgroundColor: 'white', overflow: 'scroll', minWidth: '420px' }}>
            <PhieuLuongBang data={phieuLuong} />
          </div>
        )} */}
      </div>
    </div>
  );
};
export default LichSu_New;
