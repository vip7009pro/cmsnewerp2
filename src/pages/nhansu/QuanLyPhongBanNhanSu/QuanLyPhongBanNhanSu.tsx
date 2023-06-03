import { DataGrid, GridSelectionModel,  GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarQuickFilter } from '@mui/x-data-grid';
import  { useContext, useEffect, useState } from 'react'
import { generalQuery } from '../../../api/Api';
import "./QuanLyPhongBanNhanSu.scss"
import Swal from "sweetalert2";
import LinearProgress from '@mui/material/LinearProgress';
import {SaveExcel} from '../../../api/GlobalFunction';
import moment from 'moment';
import { UserContext } from '../../../api/Context';
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
interface EmployeeTableData {
    id: string,   
    EMPL_NO: string,
    CMS_ID: string,
    FIRST_NAME: string,
    MIDLAST_NAME: string,
    DOB: string,
    HOMETOWN: string,
    ADD_PROVINCE: string,
    ADD_DISTRICT: string,
    ADD_COMMUNE: string,
    ADD_VILLAGE: string,
    PHONE_NUMBER: string,
    WORK_START_DATE: string,
    PASSWORD: string,
    EMAIL: string,
    REMARK: string,
    ONLINE_DATETIME: string,
    CTR_CD: string,
    SEX_CODE: number,
    SEX_NAME: string,
    SEX_NAME_KR: string,
    WORK_STATUS_CODE: number,
    WORK_STATUS_NAME: string,
    WORK_STATUS_NAME_KR: string,
    FACTORY_CODE: number,
    FACTORY_NAME: string,
    FACTORY_NAME_KR: string,
    JOB_CODE: number,
    JOB_NAME: string,
    JOB_NAME_KR: string,
    POSITION_CODE: number,
    POSITION_NAME: string,
    POSITION_NAME_KR: string,
    WORK_SHIFT_CODE: number,
    WORK_SHIF_NAME: string,
    WORK_SHIF_NAME_KR: string,
    WORK_POSITION_CODE: number,
    WORK_POSITION_NAME: string,
    WORK_POSITION_NAME_KR: string,
    ATT_GROUP_CODE: number,
    SUBDEPTCODE: number,
    SUBDEPTNAME: string,
    SUBDEPTNAME_KR: string,
    MAINDEPTCODE: number,
    MAINDEPTNAME: string,
    MAINDEPTNAME_KR: string,
}
const QuanLyPhongBanNhanSu = () => {
    const [userData, setUserData] = useContext(UserContext);
    const [isLoading, setisLoading] = useState(false);
    const [workpositionload, setWorkPositionLoad] = useState<Array<WorkPositionTableData>>([]);
    const [EMPL_NO,setEMPL_NO]= useState("");
    const [CMS_ID,setCMS_ID]= useState("");
    const [FIRST_NAME,setFIRST_NAME]= useState("");
    const [MIDLAST_NAME,setMIDLAST_NAME]= useState("");
    const [DOB,setDOB]= useState(moment().format('YYYY-MM-DD'));
    const [HOMETOWN,setHOMETOWN]= useState("");
    const [SEX_CODE,setSEX_CODE]= useState(0);
    const [ADD_PROVINCE,setADD_PROVINCE]= useState("");
    const [ADD_DISTRICT,setADD_DISTRICT]= useState("");
    const [ADD_COMMUNE,setADD_COMMUNE]= useState("");
    const [ADD_VILLAGE,setADD_VILLAGE]= useState("");
    const [PHONE_NUMBER,setPHONE_NUMBER]= useState("");
    const [WORK_START_DATE,setWORK_START_DATE]= useState(moment().format('YYYY-MM-DD'));
    const [PASSWORD,setPASSWORD]= useState("");
    const [EMAIL,setEMAIL]= useState("");
    const [WORK_POSITION_CODE,setWORK_POSITION_CODE]= useState(0);
    const [WORK_SHIFT_CODE,setWORK_SHIFT_CODE]= useState(0);
    const [POSITION_CODE,setPOSITION_CODE]= useState(0);
    const [JOB_CODE,setJOB_CODE]= useState(0);
    const [FACTORY_CODE,setFACTORY_CODE]= useState(1);
    const [WORK_STATUS_CODE,setWORK_STATUS_CODE]= useState(0);
    const [employeeTable, setEmployeeTable] = useState<Array<EmployeeTableData>>([]);
    const [maindeptTable, setMainDeptTable] = useState<Array<MainDeptTableData>>([]);
    const [maindeptDataFilter, setMainDeptDataFilter] = useState<Array<MainDeptTableData>>([]);
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
    const [avatar, setAvatar] = useState('');
    const [enableEdit, setEnableEdit]= useState(false);

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
                Swal.fire("Thông báo", "Thêm thất bại !"+ response.data.message, "error");
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
                Swal.fire("Thông báo", "Sửa thất bại !"+ response.data.message, "error");
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
                Swal.fire("Thông báo", "Xoá thất bại !"+ response.data.message, "error");
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
                Swal.fire("Thông báo", "Thêm thất bại !"+ response.data.message, "error");
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
                Swal.fire("Thông báo", "Sửa thất bại !"+ response.data.message, "error");
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
                Swal.fire("Thông báo", "Xoá thất bại !"+ response.data.message, "error");
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
                Swal.fire("Thông báo", "Thêm thất bại !"+ response.data.message, "error");
            }
        })
        .catch(error => {
            console.log(error);
        });
    }
    const handle_sua_workposition = ()=> {
        const insertData = {
            CTR_CD: '002',           
            SUBDEPTCODE: subdeptcode,
            WORK_POSITION_CODE: workpositioncode,
            WORK_POSITION_NAME: workpositionname,
            WORK_POSITION_NAME_KR: workpositionnamekr,
            ATT_GROUP_CODE: att_group_code
        }   
        generalQuery('updateworkposition',insertData)
        .then(response => {
            console.log(response.data.data);  
            if(response.data.tk_status === "OK")
            {
                Swal.fire("Thông báo", "Chúc mừng bạn, sửa thành công !", "success");
                generalQuery('getworkposition',insertData)
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
                Swal.fire("Thông báo", "Sửa thất bại !"+ response.data.message, "error");
            }            
        })
        .catch(error => {
            console.log(error);
        })
    }
    const handle_xoa_workposition = ()=> {
        const insertData = {
            CTR_CD: '002',           
            SUBDEPTCODE: subdeptcode,
            WORK_POSITION_CODE: workpositioncode,
            WORK_POSITION_NAME: workpositionname,
            WORK_POSITION_NAME_KR: workpositionnamekr,
            ATT_GROUP_CODE: att_group_code
        }   
        generalQuery('deleteworkposition',insertData)
        .then(response => {
            console.log(response.data.data);  
            if(response.data.tk_status === "OK")
            {
                Swal.fire("Thông báo", "Chúc mừng bạn, xoá thành công !", "success");
                generalQuery('getworkposition',insertData)
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
                Swal.fire("Thông báo", "Xoá thất bại !" + response.data.message, "error");
            }            
        })
        .catch(error => {
            console.log(error);
        })
    }
    const handle_them_employee = ()=> {   
        const insertData = {            
            EMPL_NO: EMPL_NO,
            CMS_ID: CMS_ID,
            FIRST_NAME: FIRST_NAME,
            MIDLAST_NAME: MIDLAST_NAME,
            DOB: DOB.slice(0,10),
            HOMETOWN: HOMETOWN,
            SEX_CODE: SEX_CODE,
            ADD_PROVINCE: ADD_PROVINCE,
            ADD_DISTRICT: ADD_DISTRICT,
            ADD_COMMUNE: ADD_COMMUNE,
            ADD_VILLAGE: ADD_VILLAGE,
            PHONE_NUMBER: PHONE_NUMBER,
            WORK_START_DATE: WORK_START_DATE.slice(0,10),
            PASSWORD: PASSWORD,
            EMAIL: EMAIL,
            WORK_POSITION_CODE: WORK_POSITION_CODE,
            WORK_SHIFT_CODE: WORK_SHIFT_CODE,
            POSITION_CODE: POSITION_CODE,
            JOB_CODE: JOB_CODE,
            FACTORY_CODE: FACTORY_CODE,
            WORK_STATUS_CODE: WORK_STATUS_CODE,
        }    
        console.log(insertData); 
        generalQuery('insertemployee',insertData)
        .then(response => {            
            if(response.data.tk_status === "OK")
            {
                Swal.fire("Thông báo", "Chúc mừng bạn, thêm thành công !", "success");
                generalQuery('getemployee_full',{})
                .then(response => {
                    if(response.data.tk_status==='OK')
                    {
                        console.log(response.data.data);  
                        setEmployeeTable(response.data.data);
                    }                    
                })
                .catch(error => {
                    console.log(error);
                });
            }
            else
            {
                Swal.fire("Thông báo", "Thêm thất bại ! " + response.data.message, "error");
            }            
        })
        .catch(error => {
            console.log(error);
        });
    }
    const handle_sua_employee = ()=> {
        const insertData = {            
            EMPL_NO: EMPL_NO,
            CMS_ID: CMS_ID,
            FIRST_NAME: FIRST_NAME,
            MIDLAST_NAME: MIDLAST_NAME,
            DOB: DOB.slice(0,10),
            HOMETOWN: HOMETOWN,
            SEX_CODE: SEX_CODE,
            ADD_PROVINCE: ADD_PROVINCE,
            ADD_DISTRICT: ADD_DISTRICT,
            ADD_COMMUNE: ADD_COMMUNE,
            ADD_VILLAGE: ADD_VILLAGE,
            PHONE_NUMBER: PHONE_NUMBER,
            WORK_START_DATE: WORK_START_DATE.slice(0,10),
            PASSWORD: PASSWORD,
            EMAIL: EMAIL,
            WORK_POSITION_CODE: WORK_POSITION_CODE,
            WORK_SHIFT_CODE: WORK_SHIFT_CODE,
            POSITION_CODE: POSITION_CODE,
            JOB_CODE: JOB_CODE,
            FACTORY_CODE: FACTORY_CODE,
            WORK_STATUS_CODE: WORK_STATUS_CODE,
        }    
        generalQuery('updateemployee',insertData)
        .then(response => {
            console.log(response.data.data);  
            if(response.data.tk_status === "OK")
            {
                Swal.fire("Thông báo", "Chúc mừng bạn, sửa thành công !", "success");
                generalQuery('getemployee_full',insertData)
                .then(response => {
                    if(response.data.tk_status==='OK')
                    {
                        console.log(response.data.data);  
                        setEmployeeTable(response.data.data);
                    }  
                })
                .catch(error => {
                    console.log(error);
                });
            }
            else
            {
                Swal.fire("Thông báo", "Sửa thất bại !"+ response.data.message, "error");
            }            
        })
        .catch(error => {
            console.log(error);
        })
    }
    const handle_xoa_employee = ()=> {
        setEMPL_NO("");
        setCMS_ID("");
        setFIRST_NAME("");
        setMIDLAST_NAME("");
        setDOB("");
        setHOMETOWN("");
        setADD_PROVINCE("");
        setADD_DISTRICT("");
        setADD_COMMUNE("");
        setADD_VILLAGE("");
        setPHONE_NUMBER("");
        setWORK_START_DATE("");
        setPASSWORD("");
        setEMAIL("");          
        setSEX_CODE(0);
        setWORK_STATUS_CODE(1);
        setFACTORY_CODE(1);
        setJOB_CODE(1);
        setPOSITION_CODE(1);
        setWORK_SHIFT_CODE(1);
        setWORK_POSITION_CODE(1);
        setATT_GROUP_CODE(1);         
    }
    const [subdeptTable, setSubDeptTable] = useState<Array<SubDeptTableData>>([]);
    const [subdeptDataFilter, setSubDeptDataFilter] = useState<Array<SubDeptTableData>>([]);
    const [workpositionTable, setWorkPositionTable] = useState<Array<WorkPositionTableData>>([]);
    const [workpositionDataFilter, setWorkPositionDataFilter] = useState<Array<WorkPositionTableData>>([]);
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
    const columns_employee_table =[       
        { field: "EMPL_NO", headerName: "EMPL_NO", width: 170},  
        { field: "CMS_ID", headerName: "CMS_ID", width: 170},  
        { field: "FIRST_NAME", headerName: "FIRST_NAME", width: 170},  
        { field: "MIDLAST_NAME", headerName: "MIDLAST_NAME", width: 170},  
        { field: "DOB", headerName: "DOB", width: 170, valueGetter: (params: any) => {return params.row.DOB.slice(0,10)}},  
        { field: "HOMETOWN", headerName: "HOMETOWN", width: 170},  
        { field: "ADD_PROVINCE", headerName: "ADD_PROVINCE", width: 170},  
        { field: "ADD_DISTRICT", headerName: "ADD_DISTRICT", width: 170},  
        { field: "ADD_COMMUNE", headerName: "ADD_COMMUNE", width: 170},  
        { field: "ADD_VILLAGE", headerName: "ADD_VILLAGE", width: 170},  
        { field: "PHONE_NUMBER", headerName: "PHONE_NUMBER", width: 170},  
        { field: "WORK_START_DATE", headerName: "WORK_START_DATE", width: 170,valueGetter: (params: any) => {return params.row.WORK_START_DATE.slice(0,10)}},  
       /*  { field: "PASSWORD", headerName: "PASSWORD", width: 170},   */
        { field: "EMAIL", headerName: "EMAIL", width: 170},  
        { field: "REMARK", headerName: "REMARK", width: 170},  
        { field: "ONLINE_DATETIME", headerName: "ONLINE_DATETIME", width: 170},  
        { field: "CTR_CD", headerName: "CTR_CD", width: 170},  
        { field: "SEX_CODE", headerName: "SEX_CODE", width: 170},  
        { field: "SEX_NAME", headerName: "SEX_NAME", width: 170},  
        { field: "SEX_NAME_KR", headerName: "SEX_NAME_KR", width: 170},  
        { field: "WORK_STATUS_CODE", headerName: "WORK_STATUS_CODE", width: 170},  
        { field: "WORK_STATUS_NAME", headerName: "WORK_STATUS_NAME", width: 170},  
        { field: "WORK_STATUS_NAME_KR", headerName: "WORK_STATUS_NAME_KR", width: 170},  
        { field: "FACTORY_CODE", headerName: "FACTORY_CODE", width: 170},  
        { field: "FACTORY_NAME", headerName: "FACTORY_NAME", width: 170},  
        { field: "FACTORY_NAME_KR", headerName: "FACTORY_NAME_KR", width: 170},  
        { field: "JOB_CODE", headerName: "JOB_CODE", width: 170},  
        { field: "JOB_NAME", headerName: "JOB_NAME", width: 170},  
        { field: "JOB_NAME_KR", headerName: "JOB_NAME_KR", width: 170},  
        { field: "POSITION_CODE", headerName: "POSITION_CODE", width: 170},  
        { field: "POSITION_NAME", headerName: "POSITION_NAME", width: 170},  
        { field: "POSITION_NAME_KR", headerName: "POSITION_NAME_KR", width: 170},  
        { field: "WORK_SHIFT_CODE", headerName: "WORK_SHIFT_CODE", width: 170},  
        { field: "WORK_SHIF_NAME", headerName: "WORK_SHIF_NAME", width: 170},  
        { field: "WORK_SHIF_NAME_KR", headerName: "WORK_SHIF_NAME_KR", width: 170},  
        { field: "WORK_POSITION_CODE", headerName: "WORK_POSITION_CODE", width: 170},  
        { field: "WORK_POSITION_NAME", headerName: "WORK_POSITION_NAME", width: 170},  
        { field: "WORK_POSITION_NAME_KR", headerName: "WORK_POSITION_NAME_KR", width: 170},  
        { field: "ATT_GROUP_CODE", headerName: "ATT_GROUP_CODE", width: 170},  
        { field: "SUBDEPTCODE", headerName: "SUBDEPTCODE", width: 170},  
        { field: "SUBDEPTNAME", headerName: "SUBDEPTNAME", width: 170},  
        { field: "SUBDEPTNAME_KR", headerName: "SUBDEPTNAME_KR", width: 170},  
        { field: "MAINDEPTCODE", headerName: "MAINDEPTCODE", width: 170},  
        { field: "MAINDEPTNAME", headerName: "MAINDEPTNAME", width: 170},  
        { field: "MAINDEPTNAME_KR", headerName: "MAINDEPTNAME_KR", width: 170},  
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
        //console.log(datafilter);        
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
        //console.log(datafilter);        
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
        //console.log(datafilter);        
    }
    const handleEmployeeSelection = (ids:GridSelectionModel)=> {
        const selectedID = new Set(ids);
        var datafilter = employeeTable.filter((element: any) =>
          selectedID.has(element.id)
        );             
        if(datafilter.length >0)
        {
            setEMPL_NO(datafilter[datafilter.length-1].EMPL_NO);
            setCMS_ID(datafilter[datafilter.length-1].CMS_ID);
            setFIRST_NAME(datafilter[datafilter.length-1].FIRST_NAME);
            setMIDLAST_NAME(datafilter[datafilter.length-1].MIDLAST_NAME);
            setDOB(datafilter[datafilter.length-1].DOB);
            setHOMETOWN(datafilter[datafilter.length-1].HOMETOWN);
            setADD_PROVINCE(datafilter[datafilter.length-1].ADD_PROVINCE);
            setADD_DISTRICT(datafilter[datafilter.length-1].ADD_DISTRICT);
            setADD_COMMUNE(datafilter[datafilter.length-1].ADD_COMMUNE);
            setADD_VILLAGE(datafilter[datafilter.length-1].ADD_VILLAGE);
            setPHONE_NUMBER(datafilter[datafilter.length-1].PHONE_NUMBER);
            setWORK_START_DATE(datafilter[datafilter.length-1].WORK_START_DATE);
            setPASSWORD(datafilter[datafilter.length-1].PASSWORD);
            setEMAIL(datafilter[datafilter.length-1].EMAIL);          
            setSEX_CODE(datafilter[datafilter.length-1].SEX_CODE);
            setWORK_STATUS_CODE(datafilter[datafilter.length-1].WORK_STATUS_CODE);
            setFACTORY_CODE(datafilter[datafilter.length-1].FACTORY_CODE);
            setJOB_CODE(datafilter[datafilter.length-1].JOB_CODE);
            setPOSITION_CODE(datafilter[datafilter.length-1].POSITION_CODE);
            setWORK_SHIFT_CODE(datafilter[datafilter.length-1].WORK_SHIFT_CODE);
            setWORK_POSITION_CODE(datafilter[datafilter.length-1].WORK_POSITION_CODE);
            setATT_GROUP_CODE(datafilter[datafilter.length-1].ATT_GROUP_CODE);
            setAvatar(datafilter[datafilter.length-1].EMPL_NO);
        }       
        //console.log(datafilter);        
    }
    function CustomToolbar() {
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarQuickFilter/>
            <button className='saveexcelbutton' onClick={()=>{SaveExcel(employeeTable.map((element:EmployeeTableData, index: number)=>{
                return {
                    ...element,
                    PASSWORD:'xxx'
                }

            }),"DanhSachNhanVien")}}>Save Excel</button>
          </GridToolbarContainer>
        );
      }

      const [selection, setSelection] = useState<any>({
        tab1: true,
        tab2: false,
        tab3: false
      });

      const setNav = (choose: number) => {
        if(choose ===1 )
        {
          setSelection({...selection, tab1:true, tab2: false, tab3:false});
        }
        else if(choose ===2 )
        {
          setSelection({...selection, tab1:false, tab2: true, tab3:false});
        }
        else if(choose ===3 )
        {
          setSelection({...selection, tab1:false, tab2: false, tab3:true});
        }
      }
    useEffect(()=> {
        setisLoading(true);
        generalQuery('getmaindept',{})
        .then(response => {
            //console.log(response.data.data);  
            setMainDeptTable(response.data.data);
            setisLoading(false);
        })
        .catch(error => {
            console.log(error);
        });
        generalQuery('workpositionlist',{})
        .then(response => {
            //console.log(response.data.data);  
            setWorkPositionLoad(response.data.data);
            setisLoading(false);
        })
        .catch(error => {
            console.log(error);
        });
        generalQuery('getemployee_full',{})
        .then(response => {
            //console.log(response.data); 
            if(response.data.tk_status !=='NG')
            {
                setEmployeeTable(response.data.data);
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
    <div className='quanlyphongbannhansu'>
      <div className='mininavbar'>         
        <div className='mininavitem'  onClick={() => setNav(1)} style={{backgroundColor:selection.tab1 === true ? '#02c712':'#abc9ae', color: selection.tab1 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          Quản lý Nhân Sự
          </span>
        </div>  
        <div className='mininavitem'  onClick={() => setNav(2)} style={{backgroundColor:selection.tab2 === true ? '#02c712':'#abc9ae', color: selection.tab2 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          Quản Lý Phòng Ban
          </span>
        </div>      
      </div>

      <div className='quanlyphongban'>        
        {selection.tab2 && (
          <div className='maindept'>
            <div className='maindept_table'>
              <DataGrid
                sx={{fontSize:'0.7rem'}}
                rowHeight={25}
                rows={maindeptTable}
                columns={columns_maindept}
                rowsPerPageOptions={[5, 10, 50, 100]}
                /* checkboxSelection */
                onSelectionModelChange={(ids) => {
                  handleMainDeptSelection(ids);
                }}
              />
            </div>
            <div className='maindeptform'>
              <div className='maindeptinput'>
                <div className='maindeptinputlabel'>
                  MAIN DEPT CODE:<br></br>
                  <br></br>
                  MAIN DEPT NAME:<br></br>
                  <br></br>
                  MAIN DEPT NAME KR:
                </div>
                <div className='maindeptinputbox'>
                  <input
                    type='text'
                    value={maindeptcode}
                    onChange={(e) => setMainDeptCode(Number(e.target.value))}
                  ></input>
                  <input
                    type='text'
                    value={maindeptname}
                    onChange={(e) => setMainDeptName(e.target.value)}
                  ></input>
                  <input
                    type='text'
                    value={maindeptnamekr}
                    onChange={(e) => setMainDeptNameKR(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className='maindeptbutton'>
                <button className='thembutton' onClick={handle_them_maindept}>
                  Thêm
                </button>
                <button className='suabutton' onClick={handle_sua_maindept}>
                  Sửa
                </button>
                <button className='xoabutton' onClick={handle_xoa_maindept}>
                  Xoá
                </button>
              </div>
            </div>
          </div>
        )}
        {selection.tab2 && (
          <div className='subdept'>
            <div className='subdept_table'>
              <DataGrid
                sx={{fontSize:'0.7rem'}}
                rowHeight={25}
                rows={subdeptTable}
                columns={columns_subdept}
                rowsPerPageOptions={[5, 10, 50, 100]}
                /* checkboxSelection */
                onSelectionModelChange={(ids) => {
                  handlesubDeptSelection(ids);
                }}
              />
            </div>
            <div className='subdeptform'>
              <div className='subdeptinput'>
                <div className='subdeptinputlabel'>
                  SUB DEPT CODE:<br></br>
                  <br></br>
                  SUB DEPT NAME:<br></br>
                  <br></br>
                  SUB DEPT NAME KR:
                </div>
                <div className='subdeptinputbox'>
                  <input
                    type='text'
                    value={subdeptcode}
                    onChange={(e) => setSubDeptCode(Number(e.target.value))}
                  ></input>
                  <input
                    type='text'
                    value={subdeptname}
                    onChange={(e) => setSubDeptName(e.target.value)}
                  ></input>
                  <input
                    type='text'
                    value={subdeptnamekr}
                    onChange={(e) => setSubDeptNameKR(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className='subdeptbutton'>
                <button className='thembutton' onClick={handle_them_subdept}>
                  Thêm
                </button>
                <button className='suabutton' onClick={handle_sua_subdept}>
                  Sửa
                </button>
                <button className='xoabutton' onClick={handle_xoa_subdept}>
                  Xoá
                </button>
              </div>
            </div>
          </div>
        )}
        {selection.tab2 && (
          <div className='workposition'>
            <div className='workposition_table'>
              <DataGrid
                sx={{fontSize:'0.7rem'}}
                rowHeight={25}
                rows={workpositionTable}
                columns={columns_work_position}
                rowsPerPageOptions={[5, 10, 50, 100]}
                /* checkboxSelection */
                onSelectionModelChange={(ids) => {
                  handleworkPositionSelection(ids);
                }}
              />
            </div>
            <div className='workpositionform'>
              <div className='workpositioninput'>
                <div className='workpositioninputlabel'>
                  WORK POSITION CODE:<br></br>
                  <br></br>
                  WORK POSITION NAME:<br></br>
                  <br></br>
                  WORK POSITION NAME KR: <br></br>
                  <br></br>
                  ATT GROUP CDOE:
                </div>
                <div className='workpositioninputbox'>
                  <input
                    type='text'
                    value={workpositioncode}
                    onChange={(e) =>
                      setWorkPositionCode(Number(e.target.value))
                    }
                  ></input>
                  <input
                    type='text'
                    value={workpositionname}
                    onChange={(e) => setWorkPositionName(e.target.value)}
                  ></input>
                  <input
                    type='text'
                    value={workpositionnamekr}
                    onChange={(e) => setWorkPositionNameKR(e.target.value)}
                  ></input>
                  <input
                    type='text'
                    value={att_group_code}
                    onChange={(e) => setATT_GROUP_CODE(Number(e.target.value))}
                  ></input>
                </div>
              </div>
              <div className='workpositionbutton'>
                <button
                  className='thembutton'
                  onClick={handle_them_workposition}
                >
                  Thêm
                </button>
                <button className='suabutton' onClick={handle_sua_workposition}>
                  Sửa
                </button>
                <button className='xoabutton' onClick={handle_xoa_workposition}>
                  Xoá
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className='quanlynhansu'>       
        {selection.tab1 && (
          <div className='maindept'>
            <h3>Thông tin nhân lực</h3>
            <div className='maindeptform'>
              <div className="inputform">
                <div className="emplpicture">
                  {<img width={220} height={300} src={'/Picture_NS/NS_'+ avatar+'.jpg'} alt={avatar}></img>}
                </div>
                <div className='maindeptinput'>
                  <div className='maindeptinputbox'>
                    <label>
                      Mã ERP:{" "}
                      <input
                        disabled ={enableEdit}
                        type='text'
                        value={EMPL_NO}
                        onChange={(e) => setEMPL_NO(e.target.value)}
                      ></input>
                    </label>
                    <label>
                      Mã CMS:{" "}
                      <input
                      disabled ={enableEdit}
                        type='text'
                        value={CMS_ID}
                        onChange={(e) => setCMS_ID(e.target.value)}
                      ></input>
                    </label>
                    <label>
                      Tên:{" "}
                      <input
                        disabled ={enableEdit}
                        type='text'
                        value={FIRST_NAME}
                        onChange={(e) => setFIRST_NAME(e.target.value)}
                      ></input>
                    </label>
                    <label>
                      Họ và Đệm:{" "}
                      <input
                        disabled ={enableEdit}
                        type='text'
                        value={MIDLAST_NAME}
                        onChange={(e) => setMIDLAST_NAME(e.target.value)}
                      ></input>
                    </label>
                    <label>
                      Ngày tháng năm sinh:{" "}
                      <input
                        type='date'
                        value={DOB.slice(0, 10)}
                        onChange={(e) => setDOB(e.target.value)}
                      ></input>
                    </label>
                    <label>
                      Quê quán:{" "}
                      <input
                        type='text'
                        value={HOMETOWN}
                        onChange={(e) => setHOMETOWN(e.target.value)}
                      ></input>
                    </label>
                    <label>
                      Giới tính:
                      <select
                        name='gioitinh'
                        value={SEX_CODE}
                        onChange={(e) => setSEX_CODE(Number(e.target.value))}
                      >
                        <option value={0}>Nữ</option>
                        <option value={1}>Nam</option>
                      </select>
                    </label>
                  </div>
                  <div className='maindeptinputbox'>
                    <label>
                      Tỉnh/thành phố:{" "}
                      <input
                        type='text'
                        value={ADD_PROVINCE}
                        onChange={(e) => setADD_PROVINCE(e.target.value)}
                      ></input>
                    </label>
                    <label>
                      Quận/Huyện:{" "}
                      <input
                        type='text'
                        value={ADD_DISTRICT}
                        onChange={(e) => setADD_DISTRICT(e.target.value)}
                      ></input>
                    </label>
                    <label>
                      Xã/Thị trấn:{" "}
                      <input
                        type='text'
                        value={ADD_COMMUNE}
                        onChange={(e) => setADD_COMMUNE(e.target.value)}
                      ></input>
                    </label>
                    <label>
                      Thôn/xóm:{" "}
                      <input
                        type='text'
                        value={ADD_VILLAGE}
                        onChange={(e) => setADD_VILLAGE(e.target.value)}
                      ></input>
                    </label>
                    <label>
                      Số điện thoại:{" "}
                      <input
                        type='text'
                        value={PHONE_NUMBER}
                        onChange={(e) => setPHONE_NUMBER(e.target.value)}
                      ></input>
                    </label>
                    <label>
                      Ngày bắt đầu làm việc:{" "}
                      <input
                        type='date'
                        value={WORK_START_DATE.slice(0, 10)}
                        onChange={(e) => setWORK_START_DATE(e.target.value)}
                      ></input>
                    </label>
                    <label>
                      Password:{" "}
                      <input
                        type='password'
                        value={PASSWORD}
                        onChange={(e) => setPASSWORD(e.target.value)}
                      ></input>
                    </label>
                  </div>
                  <div className='maindeptinputbox'>
                    <label>
                      Email:{" "}
                      <input
                        type='text'
                        value={EMAIL}
                        onChange={(e) => setEMAIL(e.target.value)}
                      ></input>
                    </label>
                    <label>
                      Vị trí làm việc:
                      <select
                        name='vitrilamviec'
                        value={WORK_POSITION_CODE}
                        onChange={(e) => {
                          setWORK_POSITION_CODE(Number(e.target.value));
                        }}
                      >
                        {workpositionload.map((element, index) => (
                          <option key={index} value={element.WORK_POSITION_CODE}>
                            {element.WORK_POSITION_NAME}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Ca làm việc:
                      <select
                        name='calamviec'
                        value={WORK_SHIFT_CODE}
                        onChange={(e) =>
                          setWORK_SHIFT_CODE(Number(e.target.value))
                        }
                      >
                        <option value={0}>Hành chính</option>
                        <option value={1}>TEAM 1</option>
                        <option value={2}>TEAM 2</option>
                      </select>
                    </label>
                    <label>
                      Chức danh:
                      <select
                        name='chucdanh'
                        value={POSITION_CODE}
                        onChange={(e) => setPOSITION_CODE(Number(e.target.value))}
                      >
                        <option value={1}>AM</option>
                        <option value={2}>Senior</option>
                        <option value={3}>Staff</option>
                        <option value={4}>No Pos</option>
                      </select>
                    </label>
                    <label>
                      Chức vụ:
                      <select
                        name='chucvu'
                        value={JOB_CODE}
                        onChange={(e) => setJOB_CODE(Number(e.target.value))}
                      >
                        <option value={0}>ADMIN</option>
                        <option value={1}>Dept Staff</option>
                        <option value={2}>Leader</option>
                        <option value={3}>Sub Leader</option>
                        <option value={4}>Worker</option>
                      </select>
                    </label>
                    <label>
                      Nhà máy:
                      <select
                        name='nhamay'
                        value={FACTORY_CODE}
                        onChange={(e) => setFACTORY_CODE(Number(e.target.value))}
                      >
                        <option value={1}>Nhà máy 1</option>
                        <option value={2}>Nhà máy 2</option>
                      </select>
                    </label>
                    <label>
                      Trạng thái làm việc:
                      <select
                        name='trangthailamviec'
                        value={WORK_STATUS_CODE}
                        onChange={(e) =>
                          setWORK_STATUS_CODE(Number(e.target.value))
                        }
                      >
                        <option value={0}>Đã nghỉ</option>
                        <option value={1}>Đang làm</option>
                        <option value={2}>Nghỉ sinh</option>
                      </select>
                    </label>
                  </div>
                </div>
                <div className='maindeptbutton'>
                <button className='thembutton' onClick={handle_them_employee}>
                  Thêm
                </button>
                <button className='suabutton' onClick={handle_sua_employee}>
                  Update
                </button>
                <button className='xoabutton' onClick={handle_xoa_employee}>
                  Clear
                </button>
              </div>
              </div>              
              
            </div>
            <div className='maindept_table'>
              <DataGrid
              sx={{fontSize:'0.8rem'}}
                components={{
                  Toolbar: CustomToolbar,
                  LoadingOverlay: LinearProgress,
                }}
                loading={isLoading}
                rowHeight={35}
                rows={employeeTable}
                columns={columns_employee_table}
                rowsPerPageOptions={[5, 10, 50, 100, 500]}
                editMode='row'
                onSelectionModelChange={(ids) => {
                  handleEmployeeSelection(ids);
                }}
              />
            </div>
           
          </div>
        )}
      </div>
    </div>
  );
}
export default QuanLyPhongBanNhanSu