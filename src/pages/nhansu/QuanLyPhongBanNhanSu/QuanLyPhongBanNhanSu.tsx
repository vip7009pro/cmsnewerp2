import { DataGrid, GridSelectionModel } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { generalQuery } from '../../../api/Api';
import DataTable from '../../../components/DataTable/DataTable';
import "./QuanLyPhongBanNhanSu.scss"
import Swal from "sweetalert2";

interface MainDeptTableData {
  id: number;
  CTR_CD: string;
  MAINDEPTCODE: number;
  MAINDEPTNAME: string;
  MAINDEPTNAME_KR: string;
}
interface SubDeptTableData {
  id: number;
  CTR_CD: string;
  MAINDEPTCODE: number;
  SUBDEPTCODE: number;
  SUBDEPTNAME: string;
  SUBDEPTNAME_KR: string;
}

interface WorkPositionTableData {
  id: number;
  CTR_CD: string; 
  SUBDEPTCODE: number;
  WORK_POSITION_CODE: number;
  WORK_POSITION_NAME: string;
  WORK_POSITION_NAME_KR: string;
  ATT_GROUP_CODE: number;
}
const QuanLyPhongBanNhanSu = () => {

    const [maindeptTable, setMainDeptTable] = useState<Array<MainDeptTableData>>([{      
      id: 1,
      CTR_CD: "002",
      MAINDEPTCODE: 1,
      MAINDEPTNAME: "QC",
      MAINDEPTNAME_KR: "품질",      
    }]);
    const [maindeptDataFilter, setMainDeptDataFilter] = useState<Array<MainDeptTableData>>([{      
        id: 1,
        CTR_CD: "002",
        MAINDEPTCODE: 1,
        MAINDEPTNAME: "QC",
        MAINDEPTNAME_KR: "품질",      
      }]);
    
      
    const [maindeptcode,setMainDeptCode] = useState(1);
    const [maindeptname,setMainDeptName] = useState("");
    const [maindeptnamekr,setMainDeptNameKR] = useState("");

    const [subdeptcode,setSubDeptCode] = useState(1);
    const [subdeptname,setSubDeptName] = useState("");
    const [subdeptnamekr,setSubDeptNameKR] = useState("");

    const [workpositioncode,setWorkPositionCode] = useState(1);
    const [workpositionname,setWorkPositionName] = useState("");
    const [workpositionnamekr,setWorkPositionNameKR] = useState("");
    const [att_group_code,setATT_GROUP_CODE] = useState(1);



    const handle_them_maindept = ()=> {   
        const insertData = {
            CTR_CD: '002',
            MAINDEPTCODE: maindeptcode,
            MAINDEPTNAME: maindeptname,
            MAINDEPTNAME_KR: maindeptnamekr
        }     
        generalQuery('insertmaindept',insertData)
        .then(response => {
            console.log(response.data.data);  
            if(response.data.tk_status === "OK")
            {
                Swal.fire("Thông báo", "Chúc mừng bạn, thêm thành công !", "success");
                generalQuery('getmaindept',insertData)
                .then(response => {
                    if(response.data.tk_status==='OK')
                    {
                        console.log(response.data.data);  
                        setMainDeptTable(response.data.data);
                    }
                    
                })
                .catch(error => {
                    console.log(error);
                });
            }
            else
            {
                Swal.fire("Thông báo", "Thêm thất bại !", "error");
            }
            
        })
        .catch(error => {
            console.log(error);
        });

        

        
    }
    const handle_sua_maindept = ()=> {
        const insertData = {
            CTR_CD: '002',
            MAINDEPTCODE: maindeptcode,
            MAINDEPTNAME: maindeptname,
            MAINDEPTNAME_KR: maindeptnamekr
        }     
        generalQuery('updatemaindept',insertData)
        .then(response => {
            console.log(response.data.data);  
            if(response.data.tk_status === "OK")
            {
                Swal.fire("Thông báo", "Chúc mừng bạn, sửa thành công !", "success");
                generalQuery('getmaindept',insertData)
                .then(response => {
                    if(response.data.tk_status==='OK')
                    {
                        console.log(response.data.data);  
                        setMainDeptTable(response.data.data);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            }
            else
            {
                Swal.fire("Thông báo", "Sửa thất bại !", "error");
            }            
        })
        .catch(error => {
            console.log(error);
        })
    }
    const handle_xoa_maindept = ()=> {
        const insertData = {
            CTR_CD: '002',
            MAINDEPTCODE: maindeptcode,
            MAINDEPTNAME: maindeptname,
            MAINDEPTNAME_KR: maindeptnamekr
        }     
        generalQuery('deletemaindept',insertData)
        .then(response => {
            console.log(response.data.data);  
            if(response.data.tk_status === "OK")
            {
                Swal.fire("Thông báo", "Chúc mừng bạn, xoá thành công !", "success");
                generalQuery('getmaindept',insertData)
                .then(response => {
                    if(response.data.tk_status==='OK')
                    {
                        console.log(response.data.data);  
                        setMainDeptTable(response.data.data);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            }
            else
            {
                Swal.fire("Thông báo", "Xoá thất bại !", "error");
            }            
        })
        .catch(error => {
            console.log(error);
        })
    }


    const handle_them_subdept = ()=> {   
        const insertData = {
            CTR_CD: '002',
            MAINDEPTCODE: maindeptcode,
            SUBDEPTCODE: subdeptcode,
            SUBDEPTNAME: subdeptname,
            SUBDEPTNAME_KR: subdeptnamekr
        }     
        generalQuery('insertsubdept',insertData)
        .then(response => {
            console.log(response.data.data);  
            if(response.data.tk_status === "OK")
            {
                Swal.fire("Thông báo", "Chúc mừng bạn, thêm thành công !", "success");
                generalQuery('getsubdept',{MAINDEPTCODE: maindeptcode})
                .then(response => {
                    if(response.data.tk_status==='OK')
                    {
                        console.log(response.data.data);  
                        setSubDeptTable(response.data.data);
                    }                    
                })
                .catch(error => {
                    console.log(error);
                });
            }
            else
            {
                Swal.fire("Thông báo", "Thêm thất bại !", "error");
            }
            
        })
        .catch(error => {
            console.log(error);
        });

        

        
    }
    const handle_sua_subdept = ()=> {
        const insertData = {
            CTR_CD: '002',
            MAINDEPTCODE: maindeptcode,
            SUBDEPTCODE: subdeptcode,
            SUBDEPTNAME: subdeptname,
            SUBDEPTNAME_KR: subdeptnamekr
        }     
        generalQuery('updatesubdept',insertData)
        .then(response => {
            console.log(response.data.data);  
            if(response.data.tk_status === "OK")
            {
                Swal.fire("Thông báo", "Chúc mừng bạn, sửa thành công !", "success");
                generalQuery('getsubdept',insertData)
                .then(response => {
                    if(response.data.tk_status==='OK')
                    {
                        console.log(response.data.data);  
                        setSubDeptTable(response.data.data);
                    }  
                })
                .catch(error => {
                    console.log(error);
                });
            }
            else
            {
                Swal.fire("Thông báo", "Sửa thất bại !", "error");
            }            
        })
        .catch(error => {
            console.log(error);
        })
    }
    const handle_xoa_subdept = ()=> {
        const insertData = {
            CTR_CD: '002',
            MAINDEPTCODE: maindeptcode,
            SUBDEPTCODE: subdeptcode,
            SUBDEPTNAME: subdeptname,
            SUBDEPTNAME_KR: subdeptnamekr
        }     
        generalQuery('deletesubdept',insertData)
        .then(response => {
            console.log(response.data.data);  
            if(response.data.tk_status === "OK")
            {
                Swal.fire("Thông báo", "Chúc mừng bạn, xoá thành công !", "success");
                generalQuery('getsubdept',insertData)
                .then(response => {
                    if(response.data.tk_status==='OK')
                    {
                        console.log(response.data.data);  
                        setSubDeptTable(response.data.data);
                    }  
                })
                .catch(error => {
                    console.log(error);
                });
            }
            else
            {
                Swal.fire("Thông báo", "Xoá thất bại !", "error");
            }            
        })
        .catch(error => {
            console.log(error);
        })
    }
    const handle_them_workposition = ()=> {   
        const insertData = {
            CTR_CD: '002',           
            SUBDEPTCODE: subdeptcode,
            WORK_POSITION_CODE: workpositioncode,
            WORK_POSITION_NAME: workpositionname,
            WORK_POSITION_NAME_KR: workpositionnamekr,
            ATT_GROUP_CODE: att_group_code
        }     
        generalQuery('insertworkposition',insertData)
        .then(response => {
            console.log(response.data.data);  
            if(response.data.tk_status === "OK")
            {
                Swal.fire("Thông báo", "Chúc mừng bạn, thêm thành công !", "success");
                generalQuery('getworkposition',{SUBDEPTCODE: subdeptcode})
                .then(response => {
                    if(response.data.tk_status==='OK')
                    {
                        console.log(response.data.data);  
                        setWorkPositionTable(response.data.data);
                    }                    
                })
                .catch(error => {
                    console.log(error);
                });
            }
            else
            {
                Swal.fire("Thông báo", "Thêm thất bại !", "error");
            }
            
        })
        .catch(error => {
            console.log(error);
        });

        

        
    }
    const handle_sua_workposition = ()=> {
        const insertData = {
            CTR_CD: '002',
            MAINDEPTCODE: maindeptcode,
            SUBDEPTCODE: subdeptcode,
            SUBDEPTNAME: subdeptname,
            SUBDEPTNAME_KR: subdeptnamekr
        }     
        generalQuery('updatesubdept',insertData)
        .then(response => {
            console.log(response.data.data);  
            if(response.data.tk_status === "OK")
            {
                Swal.fire("Thông báo", "Chúc mừng bạn, sửa thành công !", "success");
                generalQuery('getsubdept',insertData)
                .then(response => {
                    if(response.data.tk_status==='OK')
                    {
                        console.log(response.data.data);  
                        setSubDeptTable(response.data.data);
                    }  
                })
                .catch(error => {
                    console.log(error);
                });
            }
            else
            {
                Swal.fire("Thông báo", "Sửa thất bại !", "error");
            }            
        })
        .catch(error => {
            console.log(error);
        })
    }
    const handle_xoa_workposition = ()=> {
        const insertData = {
            CTR_CD: '002',
            MAINDEPTCODE: maindeptcode,
            SUBDEPTCODE: subdeptcode,
            SUBDEPTNAME: subdeptname,
            SUBDEPTNAME_KR: subdeptnamekr
        }     
        generalQuery('deletesubdept',insertData)
        .then(response => {
            console.log(response.data.data);  
            if(response.data.tk_status === "OK")
            {
                Swal.fire("Thông báo", "Chúc mừng bạn, xoá thành công !", "success");
                generalQuery('getsubdept',insertData)
                .then(response => {
                    if(response.data.tk_status==='OK')
                    {
                        console.log(response.data.data);  
                        setSubDeptTable(response.data.data);
                    }  
                })
                .catch(error => {
                    console.log(error);
                });
            }
            else
            {
                Swal.fire("Thông báo", "Xoá thất bại !", "error");
            }            
        })
        .catch(error => {
            console.log(error);
        })
    }

    const [subdeptTable, setSubDeptTable] = useState<Array<SubDeptTableData>>([{
        id: 1,
        CTR_CD: "002",
        MAINDEPTCODE: 1,
        SUBDEPTCODE: 1,
        SUBDEPTNAME: "QC",
        SUBDEPTNAME_KR: "품질",     
    }]);

    const [subdeptDataFilter, setSubDeptDataFilter] = useState<Array<SubDeptTableData>>([{
        id: 1,
        CTR_CD: "002",
        MAINDEPTCODE: 1,
        SUBDEPTCODE: 1,
        SUBDEPTNAME: "QC",
        SUBDEPTNAME_KR: "품질",     
    }]);

    const [workpositionTable, setWorkPositionTable] = useState<Array<WorkPositionTableData>>([{
        id: 1,
        CTR_CD: "002", 
        SUBDEPTCODE: 1,
        WORK_POSITION_CODE: 1,
        WORK_POSITION_NAME: "QC",
        WORK_POSITION_NAME_KR: "QC",
        ATT_GROUP_CODE: 1,
    }]);
    const [workpositionDataFilter, setWorkPositionDataFilter] = useState<Array<WorkPositionTableData>>([{
        id: 1,
        CTR_CD: "002", 
        SUBDEPTCODE: 1,
        WORK_POSITION_CODE: 1,
        WORK_POSITION_NAME: "QC",
        WORK_POSITION_NAME_KR: "QC",
        ATT_GROUP_CODE: 1,
    }]);



    const columns_maindept =[
        { field: "id", headerName: "ID", width: 70 },
        { field: "CTR_CD", headerName: "CTR_CD", width: 70 },
        { field: "MAINDEPTCODE", headerName: "MAINDEPTCODE", width: 170 },
        { field: "MAINDEPTNAME", headerName: "MAINDEPTNAME", width: 130 },
        { field: "MAINDEPTNAME_KR", headerName: "MAINDEPTNAME_KR", width: 170},        
    ];
    const columns_subdept =[
        { field: "id", headerName: "ID", width: 70 },
        { field: "CTR_CD", headerName: "CTR_CD", width: 70 },
        { field: "MAINDEPTCODE", headerName: "MAINDEPTCODE", width: 170 },
        { field: "SUBDEPTCODE", headerName: "SUBDEPTCODE", width: 170 },
        { field: "SUBDEPTNAME", headerName: "SUBDEPTNAME", width: 130 },
        { field: "SUBDEPTNAME_KR", headerName: "SUBDEPTNAME_KR", width: 170},        
    ];
    const columns_work_position =[
        { field: "id", headerName: "ID", width: 70 },
        { field: "CTR_CD", headerName: "CTR_CD", width: 70 },        
        { field: "SUBDEPTCODE", headerName: "SUBDEPTCODE", width: 170 },
        { field: "WORK_POSITION_CODE", headerName: "WORK_POSITION_CODE", width: 170 },
        { field: "WORK_POSITION_NAME", headerName: "WORK_POSITION_NAME", width: 130 },
        { field: "WORK_POSITION_NAME_KR", headerName: "WORK_POSITION_NAME_KR", width: 170},        
        { field: "ATT_GROUP_CODE", headerName: "ATT_GROUP_CODE", width: 170},        
    ];
    
    const handleMainDeptSelection = (ids:GridSelectionModel)=> {
        const selectedID = new Set(ids);
        var datafilter = maindeptTable.filter((element: any) =>
          selectedID.has(element.id)
        );             
        if(datafilter.length >0)
        {
            setMainDeptCode(datafilter[datafilter.length-1].MAINDEPTCODE);
            setMainDeptName(datafilter[datafilter.length-1].MAINDEPTNAME);
            setMainDeptNameKR(datafilter[datafilter.length-1].MAINDEPTNAME_KR);
            generalQuery('getsubdept',{MAINDEPTCODE:datafilter[datafilter.length-1].MAINDEPTCODE})
                .then(response => {
                    if(response.data.tk_status === 'OK')
                    {
                        console.log(response.data.data);  
                        setSubDeptTable(response.data.data);
                    }
                    
                })
                .catch(error => {
                    console.log(error);
                });

        }
        setMainDeptDataFilter(datafilter); 
        console.log(datafilter);        
    }

    const handlesubDeptSelection = (ids:GridSelectionModel)=> {
        const selectedID = new Set(ids);
        var datafilter = subdeptTable.filter((element: any) =>
          selectedID.has(element.id)
        );             
        if(datafilter.length >0)
        {
            setSubDeptCode(datafilter[datafilter.length-1].SUBDEPTCODE);
            setSubDeptName(datafilter[datafilter.length-1].SUBDEPTNAME);
            setSubDeptNameKR(datafilter[datafilter.length-1].SUBDEPTNAME_KR);
            generalQuery('getworkposition',{SUBDEPTCODE:datafilter[datafilter.length-1].SUBDEPTCODE})
                .then(response => {
                    if(response.data.tk_status === 'OK')
                    {
                        console.log(response.data.data);  
                        setWorkPositionTable(response.data.data);
                    }                    
                })
                .catch(error => {
                    console.log(error);
                });

        }
        setSubDeptDataFilter(datafilter); 
        console.log(datafilter);        
    }
    const handleworkPositionSelection = (ids:GridSelectionModel)=> {
        const selectedID = new Set(ids);
        var datafilter = workpositionTable.filter((element: any) =>
          selectedID.has(element.id)
        );             
        if(datafilter.length >0)
        {
            setWorkPositionCode(datafilter[datafilter.length-1].WORK_POSITION_CODE);
            setWorkPositionName(datafilter[datafilter.length-1].WORK_POSITION_NAME);
            setWorkPositionNameKR(datafilter[datafilter.length-1].WORK_POSITION_NAME_KR);
            setATT_GROUP_CODE(datafilter[datafilter.length-1].ATT_GROUP_CODE);            
        }
        setWorkPositionDataFilter(datafilter); 
        console.log(datafilter);        
    }

    useEffect(()=> {
        generalQuery('getmaindept',{})
        .then(response => {
            console.log(response.data.data);  
            setMainDeptTable(response.data.data);
        })
        .catch(error => {
            console.log(error);
        });
    },[]);

  return (
    <div className='quanlyphongbannhansu'>
      <div className='quanlyphongban'>
        <div className='maindept'>
          <div className='maindept_table'>
            <DataGrid
              rowHeight={35}
              rows={maindeptTable}
              columns={columns_maindept}
              rowsPerPageOptions={[5, 10, 50, 100]}
              checkboxSelection
              onSelectionModelChange={(ids) => {
                handleMainDeptSelection(ids);
              }}
            />
          </div>
          <div className='maindeptform'>
            <div className='maindeptinput'>
              <div className='maindeptinputlabel'>
                MAIN DEPT CODE:<br></br><br></br>
                MAIN DEPT NAME:<br></br><br></br>
                MAIN DEPT NAME KR:
              </div>
              <div className='maindeptinputbox'>
                <input type='text' value={maindeptcode} onChange={e => setMainDeptCode(Number(e.target.value))}></input>
                <input type='text' value={maindeptname} onChange={e => setMainDeptName(e.target.value)}></input>
                <input type='text' value={maindeptnamekr} onChange={e => setMainDeptNameKR(e.target.value)}></input>                
              </div>
            </div>
            <div className='maindeptbutton'>
                <button className='thembutton' onClick={handle_them_maindept}>Thêm</button>
                <button className='suabutton' onClick={handle_sua_maindept}>Sửa</button>
                <button className='xoabutton' onClick={handle_xoa_maindept}>Xoá</button>
            </div>
          </div>
        </div>
        <div className='subdept'>
          <div className='subdept_table'>
            <DataGrid
              rowHeight={35}
              rows={subdeptTable}
              columns={columns_subdept}
              rowsPerPageOptions={[5, 10, 50, 100]}
              checkboxSelection
              onSelectionModelChange={(ids) => {
                handlesubDeptSelection(ids);
              }}
            />
          </div>
          <div className='subdeptform'>
            <div className='subdeptinput'>
              <div className='subdeptinputlabel'>
                SUB DEPT CODE:<br></br><br></br>
                SUB DEPT NAME:<br></br><br></br>
                SUB DEPT NAME KR:
              </div>
              <div className='subdeptinputbox'>
                <input type='text' value={subdeptcode} onChange={e => setSubDeptCode(Number(e.target.value))}></input>
                <input type='text' value={subdeptname} onChange={e => setSubDeptName(e.target.value)}></input>
                <input type='text' value={subdeptnamekr} onChange={e => setSubDeptNameKR(e.target.value)}></input>
              </div>
            </div>
            <div className='subdeptbutton'>
                <button className='thembutton' onClick={handle_them_subdept}>Thêm</button>
                <button className='suabutton' onClick={handle_sua_subdept}>Sửa</button>
                <button className='xoabutton' onClick={handle_xoa_subdept}>Xoá</button>
            </div>
          </div>
        </div>
        <div className='workposition'>
          <div className='workposition_table'>
            <DataGrid
              rowHeight={35}
              rows={workpositionTable}
              columns={columns_work_position}
              rowsPerPageOptions={[5, 10, 50, 100]}
              checkboxSelection
              onSelectionModelChange={(ids) => {
                handleworkPositionSelection(ids);
              }}
            />
          </div>
          <div className='workpositionform'>
            <div className='workpositioninput'>
              <div className='workpositioninputlabel'>
                WORK POSITION CODE:<br></br><br></br>
                WORK POSITION NAME:<br></br><br></br>
                WORK POSITION NAME KR: <br></br><br></br>
                ATT GROUP CDOE: 
              </div>
              <div className='workpositioninputbox'>
                <input type='text' value={workpositioncode} onChange={e => setWorkPositionCode(Number(e.target.value))}></input>
                <input type='text' value={workpositionname} onChange={e => setWorkPositionName(e.target.value)}></input>
                <input type='text' value={workpositionnamekr} onChange={e => setWorkPositionNameKR(e.target.value)}></input>
                <input type='text' value={att_group_code} onChange={e => setATT_GROUP_CODE(Number(e.target.value))}></input>
              </div>
            </div>
            <div className='workpositionbutton'>
                <button className='thembutton' onClick={handle_them_workposition}>Thêm</button>
                <button className='suabutton' onClick={handle_sua_workposition}>Sửa</button>
                <button className='xoabutton' onClick={handle_xoa_workposition}>Xoá</button>
            </div>
          </div>
        </div>


        <div className='workpostion'></div>
        <div className='attendance_group'></div>
      </div>
      <div className='quanlynhansu'></div>
    </div>
  );
}

export default QuanLyPhongBanNhanSu