import { DataGrid, GridSelectionModel, GridToolbar, GridToolbarContainer, GridToolbarExport, GridCsvExportOptions, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridRowsProp, GridToolbarQuickFilter  } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { generalQuery } from '../../../api/Api';
import "./PheDuyetNghi.scss"
import Swal from "sweetalert2";
import LinearProgress from '@mui/material/LinearProgress';
import {SaveExcel} from '../../../api/GlobalFunction';


interface DiemDanhNhomData {  
    id: string,
    EMPL_NO: string,
    REQUEST_DATE: string,
    APPLY_DATE: string,
    REASON_CODE: number,
    REMARK: string,
    APPROVAL_STATUS: number,
    OFF_ID: number,
    CA_NGHI: number,
    CMS_ID: string,
    FIRST_NAME: string,
    MIDLAST_NAME: string,
    DOB: string,
    HOMETOWN: string,
    SEX_CODE: number,
    ADD_PROVINCE: string,
    ADD_DISTRICT: string,
    ADD_COMMUNE: string,
    ADD_VILLAGE: string,
    PHONE_NUMBER: string,
    WORK_START_DATE: string,
    PASSWORD: string,
    EMAIL: string,
    WORK_POSITION_CODE: number,
    WORK_SHIFT_CODE: number,
    POSITION_CODE: number,
    JOB_CODE: number,
    FACTORY_CODE: number,
    WORK_STATUS_CODE: number,
    ONLINE_DATETIME: string,
    SEX_NAME: string,
    SEX_NAME_KR: string,
    WORK_STATUS_NAME: string,
    WORK_STATUS_NAME_KR: string,
    FACTORY_NAME: string,
    FACTORY_NAME_KR: string,
    JOB_NAME: string,
    JOB_NAME_KR: string,
    POSITION_NAME: string,
    POSITION_NAME_KR: string,
    WORK_SHIF_NAME: string,
    WORK_SHIF_NAME_KR: string,
    SUBDEPTCODE: number,
    WORK_POSITION_NAME: string,
    WORK_POSITION_NAME_KR: string,
    ATT_GROUP_CODE: number,
    MAINDEPTCODE: number,
    SUBDEPTNAME: string,
    SUBDEPTNAME_KR: string,
    MAINDEPTNAME: string,
    MAINDEPTNAME_KR: string,
    REASON_NAME: string,
    REASON_NAME_KR: string,
    ON_OFF: string,
    OVERTIME_INFO: string,
    OVERTIME: string,

}

const PheDuyetNghiBP = () => {
    const [isLoading, setisLoading] = useState(false); 
    const [diemdanhnhomtable,setDiemDanhNhomTable ] = useState<Array<DiemDanhNhomData>>([]);

    const columns_diemdanhnhom =[
        { field: "id", headerName: "ID", width: 100, valueGetter: (params: any) => {return params.row.OFF_ID} }, 
        { field: "PHE_DUYET", headerName: "PHE_DUYET", width: 200, 
            renderCell: (params:any) => {                 
                const onClick = (pheduyet_value: number) => { 

                    if(pheduyet_value === 3)
                    {
                      Swal.fire({
                        title: 'Chắc chắn muốn xóa đăng ký nghỉ đã chọn ?',
                        text: "Sẽ xóa đăng ký nghỉ",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Vẫn Xóa!'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          Swal.fire(
                            'Tiến hành Xóa',
                            'Đang Xóa Đăng ký nghỉ',
                            'success'
                          );
                          generalQuery("setpheduyetnhom", {                      
                            off_id: params.row.OFF_ID,
                            pheduyetvalue: pheduyet_value                    
                          })
                            .then((response) => {
                              console.log(response.data.tk_status);
                              if (response.data.tk_status === "OK") {
                                const newProjects = diemdanhnhomtable.map((p) =>
                                  p.OFF_ID === params.row.OFF_ID
                                    ? {
                                        ...p,
                                        APPROVAL_STATUS: pheduyet_value                                  
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
                      })

                    }
                    else if(pheduyet_value === 0)
                    {
                      generalQuery("setpheduyetnhom", {                      
                        off_id: params.row.OFF_ID,
                        pheduyetvalue: pheduyet_value                    
                      })
                        .then((response) => {
                          console.log(response.data.tk_status);
                          if (response.data.tk_status === "OK") {
                            const newProjects = diemdanhnhomtable.map((p) =>
                              p.OFF_ID === params.row.OFF_ID
                                ? {
                                    ...p,
                                    APPROVAL_STATUS: pheduyet_value                                  
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
                    else
                    {
                      if((params.row.ON_OFF === 0 || params.row.ON_OFF === null || params.row.REASON_NAME==='Nửa phép') && pheduyet_value === 1)
                      {
                        generalQuery("setpheduyetnhom", {                      
                          off_id: params.row.OFF_ID,
                          pheduyetvalue: pheduyet_value                    
                        })
                          .then((response) => {
                            console.log(response.data.tk_status);
                            if (response.data.tk_status === "OK") {
                              const newProjects = diemdanhnhomtable.map((p) =>
                                p.OFF_ID === params.row.OFF_ID
                                  ? {
                                      ...p,
                                      APPROVAL_STATUS: pheduyet_value                                  
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
                      else
                      {
                        Swal.fire('Thông báo', "Đã điểm danh đi làm, không phê duyệt nghỉ được");
                      }
                     
                    }
                                    
                } 

                const onReset =() => {
                    const newProjects = diemdanhnhomtable.map((p) =>
                            p.OFF_ID === params.row.OFF_ID
                              ? {
                                  ...p,
                                  APPROVAL_STATUS: 2                                  
                                }
                              : p
                          );             
                    setDiemDanhNhomTable(newProjects);
                }

                if(params.row.APPROVAL_STATUS===0)
                {
                    return (
                        <div className='onoffdiv'>
                            <span style={{fontWeight: 'bold', color:'red'}}>Từ chối</span>
                          <button className='resetbutton' onClick={()=>onReset()}>
                          RESET
                          </button>  
                          <button className='deletebutton' onClick={()=>onClick(3)}>
                      XÓA
                      </button>                                                                  
                        </div>
                      );
                }
                else if(params.row.APPROVAL_STATUS===1)
                {
                    return (
                        <div className='onoffdiv'>
                        <span style={{fontWeight: 'bold', color:'green'}}>Phê Duyệt</span>
                      <button className='resetbutton' onClick={()=>onReset()}>
                      RESET
                      </button>                                                                  
                      <button className='deletebutton' onClick={()=>onClick(3)}>
                      XÓA
                      </button>                                                                  
                    </div>          
                    );

                }
                else if(params.row.APPROVAL_STATUS===3)
                {
                    return (
                        <div className='onoffdiv'>
                        <span style={{fontWeight: 'bold', color:'red'}}>Đã xóa</span>
                                                                                 
                    </div>          
                    );

                }
                else
                {
                    return (
                        <div className='onoffdiv'>                            
                        <button className='onbutton' onClick={()=>onClick(1)}>
                        Duyệt
                        </button>
                        <button className='offbutton' onClick={()=>onClick(0)}>
                        Từ chối
                        </button>                                            
                      </div>              
                    );
                }
                
            }    
        },      
        { field: "EMPL_NO", headerName: "EMPL_NO", width: 120 },
        { field: "CMS_ID", headerName: "CMS_ID", width: 120 },
        { field: "MIDLAST_NAME", headerName: "MIDLAST_NAME", width: 170 },
        { field: "FIRST_NAME", headerName: "FIRST_NAME", width: 100 },
        { field: "REQUEST_DATE", headerName: "REQUEST_DATE", width: 110 ,valueGetter: (params: any) => {return params.row.REQUEST_DATE.slice(0,10)}},
        { field: "APPLY_DATE", headerName: "APPLY_DATE", width: 100,valueGetter: (params: any) => {return params.row.APPLY_DATE.slice(0,10)} },
        { field: "REASON_NAME", headerName: "REASON_NAME", width: 120 },
        { field: "CA_NGHI", headerName: "CA_NGHI", width: 80 },
        { field: "REMARK", headerName: "REMARK", width: 170 },
        { field: "ON_OFF", headerName: "ON_OFF", width: 120 },             
        { field: "DOB", headerName: "DOB", width: 170,valueGetter: (params: any) => {return params.row.DOB.slice(0,10)}  },
        { field: "POSITION_NAME", headerName: "POSITION_NAME", width: 170 },
        { field: "FACTORY_NAME", headerName: "FACTORY_NAME", width: 170 },
        { field: "WORK_SHIF_NAME", headerName: "WORK_SHIF_NAME", width: 170 },
        { field: "JOB_NAME", headerName: "JOB_NAME", width: 170 },
        { field: "MAINDEPTNAME", headerName: "MAINDEPT_NAME", width: 170 },
        { field: "SUBDEPTNAME", headerName: "SUBDEPT_NAME", width: 170 },
        { field: "WORK_POSITION_NAME", headerName: "WORK_POSITION_NAME", width: 170 },
       
    ];

    
    function CustomToolbar() {
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <button className='saveexcelbutton' onClick={()=>{SaveExcel(diemdanhnhomtable,"PheDuyetNghi")}}>Save Excel</button>
            <GridToolbarQuickFilter/>
          </GridToolbarContainer>
        );
      }

    useEffect(()=> {
        setisLoading(true);
        generalQuery('pheduyetnhomBP',{})
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
            setisLoading(false);
        });
    },[]);
  
  return (
    <div className='pheduyetnghi'> 
          <h3>Phê duyệt nghỉ</h3>        
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
              rowsPerPageOptions={[5, 10, 50, 100, 500,1000,2000,5000]}
              editMode='row'    
              getRowHeight={() => 'auto'} 
              checkboxSelection
              disableSelectionOnClick
            />
          </div>
        </div> 
  );
}

export default PheDuyetNghiBP