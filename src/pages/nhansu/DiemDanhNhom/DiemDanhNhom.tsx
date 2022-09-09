import { DataGrid, GridSelectionModel, GridToolbar, GridToolbarContainer, GridToolbarExport, GridCsvExportOptions, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridRowsProp, GridToolbarQuickFilter  } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { generalQuery } from '../../../api/Api';
import "./DiemDanhNhom.scss"
import Swal from "sweetalert2";
import LinearProgress from '@mui/material/LinearProgress';
import {SaveExcel} from '../../../api/GlobalFunction';


interface DiemDanhNhomData {  
    id: string,
    APPLY_DATE: string
    APPROVAL_STATUS: number
    CA_NGHI: number
    CMS_ID: string
    EMPL_NO: string
    FACTORY_NAME: string
    FIRST_NAME: string
    JOB_NAME: string
    MAINDEPTNAME: string
    MIDLAST_NAME: string
    OFF_ID: number
    ON_OFF: any
    OVERTIME: any
    OVERTIME_INFO: any
    PHONE_NUMBER: string
    REASON_NAME: string
    REQUEST_DATE: string
    SEX_NAME: string
    SUBDEPTNAME: string
    WORK_POSITION_NAME: string
    WORK_SHIF_NAME: string
    WORK_STATUS_NAME: string
}



const DiemDanhNhom = () => {
    const [isLoading, setisLoading] = useState(false);   
    const [WORK_SHIFT_CODE, setWORK_SHIFT_CODE]= useState(0);
    const [diemdanhnhomtable,setDiemDanhNhomTable ] = useState<Array<DiemDanhNhomData>>([]);

    const columns_diemdanhnhom =[  
      { field: "EMPL_NO", headerName: "EMPL_NO", width: 170 },
      { field: "CMS_ID", headerName: "CMS_ID", width: 100 },      
        { field: "DIEMDANH", headerName: "DIEMDANH", width: 170, 
            renderCell: (params:any) => { 
                let typeclass:string =params.row.ON_OFF===1 ? "onbt": params.row.ON_OFF===0 ?"offbt" : "";
                const onClick = (type: number) => {                
                    //Swal.fire("Thông báo", "Gia tri = " + params.row.EMPL_NO, "success");

                    generalQuery("setdiemdanhnhom", {
                      diemdanhvalue: type,
                      EMPL_NO: params.row.EMPL_NO
                    })
                      .then((response) => {
                        console.log(response.data);
                        if (response.data.tk_status === "OK") {
                          const newProjects = diemdanhnhomtable.map((p) =>
                            p.EMPL_NO === params.row.EMPL_NO
                              ? { ...p, ON_OFF: type }
                              : p
                          );
                          setDiemDanhNhomTable(newProjects);
                        } else {
                          Swal.fire(
                            "Có lỗi",
                            "Nội dung: " + response.data.message,
                            "error"
                          );
                        }  
                      })
                      .catch((error) => {
                        console.log(error);
                      }); 
                   
                }     

                const onReset =() => {
                    const newProjects = diemdanhnhomtable.map(p =>
                        p.EMPL_NO === params.row.EMPL_NO
                          ? { ...p, ON_OFF: null }
                          : p
                    );                    
                    setDiemDanhNhomTable(newProjects);
                }

                if(params.row.ON_OFF===null)
                {
                    return (
                        <div className={`onoffdiv ${typeclass}`}>
                          <button className='onbutton' onClick={()=>onClick(1)}>
                            Làm
                          </button> <br></br>
                          <button className='offbutton' onClick={()=>onClick(0)}>
                            Nghỉ
                          </button>
                        </div>
                      );
                }
                return (
                  <div className='onoffdiv'>
                    <span className={`onoffshowtext A${params.row.ON_OFF}`}>{params.row.ON_OFF===1 ? "ON":"OFF"}</span>
                    <button className='resetbutton' onClick={()=>onReset()}>                      
                      RESET
                    </button>               
                  </div>
                );
            }    
        },      
        { field: "TANGCA", headerName: "TANGCA",minWidth: 200,  flex:1, 
            renderCell: (params:any) => { 
                let typeclass:string =params.row.OVERTIME===1 ? "onbt": params.row.OVERTIME===0 ?"offbt" : "";
                const onClick = (overtimeinfo: string) => {                
                    //Swal.fire("Thông báo", "Gia tri = " + params.row.EMPL_NO, "success");  
                    generalQuery("dangkytangcanhom", {
                      tangcavalue: overtimeinfo === "KTC" ? 0 : 1,
                      EMPL_NO: params.row.EMPL_NO,
                      overtime_info: overtimeinfo,
                    })
                      .then((response) => {
                        console.log(response.data);
                        if (response.data.tk_status === "OK") {
                          const newProjects = diemdanhnhomtable.map((p) =>
                            p.EMPL_NO === params.row.EMPL_NO
                              ? {
                                  ...p,
                                  OVERTIME: overtimeinfo === "KTC" ? 0 : 1,
                                  OVERTIME_INFO: overtimeinfo,
                                }
                              : p
                          );
                          setDiemDanhNhomTable(newProjects);
                        } else {
                          Swal.fire(
                            "Có lỗi",
                            "Nội dung: " + response.data.message,
                            "error"
                          );
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                      }); 



                }     

                const onReset =() => {
                    const newProjects = diemdanhnhomtable.map(p =>
                        p.EMPL_NO === params.row.EMPL_NO
                          ? { ...p, OVERTIME: null,OVERTIME_INFO: null }
                          : p
                    );              
                    //console.log(newProjects);
                    setDiemDanhNhomTable(newProjects);
                }
               

                if(params.row.OVERTIME===null)
                {
                    return (
                        <div className={`onoffdiv ${typeclass}`}>
                          <button className='tcbutton' onClick={()=>onClick("KTC")}>
                            KTC
                          </button>
                          <button className='tcbutton' onClick={()=>onClick("0200-0600")}>
                            02-06
                          </button>
                          <button className='tcbutton' onClick={()=>onClick("1700-2000")}>
                            17-20
                          </button>
                          <button className='tcbutton' onClick={()=>onClick("1700-1800")}>
                            17-18
                          </button>
                          <button className='tcbutton' onClick={()=>onClick("0500-0800")}>  
                            05-08
                          </button>
                          <button className='tcbutton' onClick={()=>onClick("1600-2000")}>
                            16-20
                          </button>                         
                        </div>
                      );
                }
                return (
                  <div className='onoffdiv'>
                    <span className={`onoffshowtext A${params.row.OVERTIME}`}>{params.row.OVERTIME_INFO}</span>
                    <button className='resetbutton' onClick={()=>onReset()}>                      
                      RESET
                    </button>               
                  </div>
                );
            }    
        },     
        { field: "MIDLAST_NAME", headerName: "MIDLAST_NAME", width: 130 },
        { field: "FIRST_NAME", headerName: "FIRST_NAME", width: 130 },
        { field: "PHONE_NUMBER", headerName: "PHONE_NUMBER", width: 130 },
        { field: "SEX_NAME", headerName: "SEX_NAME", width: 130 },
        { field: "WORK_STATUS_NAME", headerName: "WORK_STATUS_NAME", width: 130 },
        { field: "FACTORY_NAME", headerName: "FACTORY_NAME", width: 130 },
        { field: "JOB_NAME", headerName: "JOB_NAME", width: 130 },
        { field: "WORK_SHIF_NAME", headerName: "WORK_SHIF_NAME", width: 130 },
        { field: "WORK_POSITION_NAME", headerName: "WORK_POSITION_NAME", width: 130 },
        { field: "SUBDEPTNAME", headerName: "SUBDEPTNAME", width: 130 },
        { field: "MAINDEPTNAME", headerName: "MAINDEPTNAME", width: 130 },
        { field: "REQUEST_DATE", headerName: "REQUEST_DATE", width: 130, valueGetter: (params: any) => {if(params.row.REQUEST_DATE !== null) return params.row.REQUEST_DATE.slice(0,10)} },
        { field: "APPLY_DATE", headerName: "APPLY_DATE", width: 130 ,valueGetter: (params: any) => {if(params.row.APPLY_DATE !== null) return params.row.APPLY_DATE.slice(0,10)}},
        { field: "APPROVAL_STATUS", headerName: "APPROVAL_STATUS", width: 130 },
        { field: "OFF_ID", headerName: "OFF_ID", width: 130 },
        { field: "CA_NGHI", headerName: "CA_NGHI", width: 130 },
        { field: "ON_OFF", headerName: "ON_OFF", width: 130 },
        { field: "OVERTIME_INFO", headerName: "OVERTIME_INFO", width: 130 },
        { field: "OVERTIME", headerName: "OVERTIME", width: 130 },
        { field: "REASON_NAME", headerName: "REASON_NAME", width: 130 },
             
    ];

    
    function CustomToolbar() {
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />           
            <button className='saveexcelbutton' onClick={()=>{SaveExcel(diemdanhnhomtable,"DiemDanhNhom")}}>Save Excel</button>
            <GridToolbarQuickFilter/>
          </GridToolbarContainer>
        );
      }

    const onselectionteamhandle = (teamnamelist: number)=>{
      setWORK_SHIFT_CODE(teamnamelist);
      generalQuery('diemdanhnhom',{team_name_list:teamnamelist})
        .then(response => {
            //console.log(response.data.data);            
            setDiemDanhNhomTable(response.data.data);
            setisLoading(false);
            Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");  
        })
        .catch(error => {
            console.log(error);
        });
    }

    useEffect(()=> {
        setisLoading(true);
        generalQuery('diemdanhnhom',{team_name_list:WORK_SHIFT_CODE})
        .then(response => {
            //console.log(response.data.data);
            if(response.data.tk_status !=='NG')
            {
              setDiemDanhNhomTable(response.data.data);
              setisLoading(false);
              Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");  
            }
            else
            {
              Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");  
            }
            
        })
        .catch(error => {
            console.log(error);
        });
    },[]);
  
  return (
    <div className='diemdanhnhom'> 
          <h3>Điểm danh nhóm</h3>
          <div className='filterform'>            
            <label>Ca làm việc: 
                    <select name='calamviec' value={WORK_SHIFT_CODE}  onChange={e=> {onselectionteamhandle(Number(e.target.value))}}>
                        <option value = {0}>TEAM 1 + Hành chính</option>  
                        <option value = {1}>TEAM 2+ Hành chính</option>                                      
                        <option value = {2}>TEAM 1</option>                                      
                        <option value = {3}>TEAM 2</option>                                      
                        <option value = {4}>Hành chính</option>                                      
                        <option value = {5}>Tất cả</option>                                      
                    </select>
            </label>

          </div>
          <div className='maindept_table'>
            <DataGrid
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
              getRowHeight={() => 'auto'}
            />
          </div>
        </div> 
  );
}

export default DiemDanhNhom