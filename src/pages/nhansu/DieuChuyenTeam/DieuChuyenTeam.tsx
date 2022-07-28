import { DataGrid, GridSelectionModel, GridToolbar, GridToolbarContainer, GridToolbarExport, GridCsvExportOptions, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridRowsProp, GridToolbarQuickFilter  } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { generalQuery } from '../../../api/Api';
import "./DieuChuyenTeam.scss"
import Swal from "sweetalert2";
import LinearProgress from '@mui/material/LinearProgress';
import SaveExcel from '../../../api/GlobalFunction';


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

const DieuChuyenTeam = () => {
    const [isLoading, setisLoading] = useState(false);   
    const [WORK_SHIFT_CODE, setWORK_SHIFT_CODE]= useState(0);
    const [diemdanhnhomtable,setDiemDanhNhomTable ] = useState<Array<DiemDanhNhomData>>([]);

    const columns_diemdanhnhom =[
        { field: "id", headerName: "ID", width: 100, valueGetter: (params: any) => {return params.row.EMPL_NO} },      
          
        { field: "SET_TEAM", headerName: "SET_TEAM", width: 200, 
            renderCell: (params:any) => {                 
                const onClick = (teamvalue_info: number) => {                
                    //Swal.fire("Thông báo", "Gia tri = " + params.row.EMPL_NO, "success");  
                    generalQuery("setteamnhom", {
                      teamvalue: teamvalue_info,
                      EMPL_NO: params.row.EMPL_NO                      
                    })
                      .then((response) => {
                        console.log(response.data.tk_status);
                        if (response.data.tk_status === "OK") {
                          const newProjects = diemdanhnhomtable.map((p) =>
                            p.EMPL_NO === params.row.EMPL_NO
                              ? {
                                  ...p,
                                  WORK_SHIF_NAME: teamvalue_info===0? "Hành Chính": teamvalue_info===1 ? "TEAM 1" :"TEAM 2"                                  
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


                if(params.row.WORK_SHIF_NAME==='Hành Chính')
                {
                    return (
                        <div className='onoffdiv'>
                          <button className='team1bt' onClick={()=>onClick(1)}>
                          TEAM1
                          </button>
                          <button className='team2bt' onClick={()=>onClick(2)}>
                          TEAM2
                          </button>                                            
                        </div>
                      );
                }
                else if(params.row.WORK_SHIF_NAME==='TEAM 1')
                {
                    return (
                        <div className='onoffdiv'>
                        <button className='hcbt' onClick={()=>onClick(0)}>
                        HanhChinh
                        </button>
                        <button className='team2bt' onClick={()=>onClick(2)}>
                        TEAM2
                        </button>                                            
                      </div>              
                    );

                }
                else
                {
                    return (
                        <div className='onoffdiv'>
                        <button className='team1bt' onClick={()=>onClick(1)}>
                        TEAM1
                        </button>
                        <button className='hcbt' onClick={()=>onClick(0)}>
                        HanhChinh
                        </button>                                            
                      </div>              
                    );
                }
                
            }    
        },      
        { field: "EMPL_NO", headerName: "EMPL_NO", width: 170 },
        { field: "CMS_ID", headerName: "CMS_ID", width: 100 },
        { field: "MIDLAST_NAME", headerName: "MIDLAST_NAME", width: 130 },
        { field: "FIRST_NAME", headerName: "FIRST_NAME", width: 130 },
        { field: "SUBDEPTNAME", headerName: "SUBDEPTNAME", width: 130 },
        { field: "MAINDEPTNAME", headerName: "MAINDEPTNAME", width: 130 }, 
        { field: "WORK_SHIF_NAME", headerName: "WORK_SHIF_NAME", width: 130 },
        { field: "WORK_POSITION_NAME", headerName: "WORK_POSITION_NAME", width: 130 },     
        { field: "PHONE_NUMBER", headerName: "PHONE_NUMBER", width: 130 },
        { field: "SEX_NAME", headerName: "SEX_NAME", width: 130 },
        { field: "WORK_STATUS_NAME", headerName: "WORK_STATUS_NAME", width: 130 },
        { field: "FACTORY_NAME", headerName: "FACTORY_NAME", width: 130 },
        { field: "JOB_NAME", headerName: "JOB_NAME", width: 130 },
        
         
             
    ];

    
    function CustomToolbar() {
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <button className='saveexcelbutton' onClick={()=>{SaveExcel(diemdanhnhomtable,"DieuChuyenTeam")}}>Save Excel</button>
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
    <div className='dieuchuyenteam'> 
          <h3>Điều chuyển team</h3>
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

export default DieuChuyenTeam