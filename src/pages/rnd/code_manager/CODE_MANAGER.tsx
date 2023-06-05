import { IconButton,  LinearProgress} from '@mui/material';
import { DataGrid, GridSelectionModel, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarQuickFilter ,GridColumns, GridRowsProp, GridCellEditStopParams, MuiEvent, GridCellEditStopReasons, GridCellEditCommitParams, MuiBaseEvent, GridCallbackDetails } from '@mui/x-data-grid';
import moment from 'moment';
import  { useContext, useEffect, useState, useTransition } from 'react'
import {FcCancel, FcSearch } from 'react-icons/fc';
import {AiFillCheckCircle, AiFillEdit, AiFillFileExcel, AiOutlineCheck, AiOutlineCloudUpload } from "react-icons/ai";
import Swal from 'sweetalert2';
import { generalQuery, uploadQuery } from '../../../api/Api';
import { UserContext } from '../../../api/Context';
import { SaveExcel } from '../../../api/GlobalFunction';
import "./CODE_MANAGER.scss"
import { BiReset } from 'react-icons/bi';
import { MdOutlineDraw, MdUpdate } from 'react-icons/md';
const axios = require('axios').default;
interface CODE_INFO {
    id: number,
    G_CODE: string,
    G_NAME: string,
    G_NAME_KD: string,
    PROD_TYPE: string,
    PROD_LAST_PRICE: number,
    PD: number,
    CAVITY: number,
    PACKING_QTY: number,
    G_WIDTH: number,
    G_LENGTH: number,
    PROD_PROJECT: string,
    PROD_MODEL: string,
    M_NAME_FULLBOM: string,
    BANVE: string,
    NO_INSPECTION: string,
    USE_YN: string,
    PDBV: string,
    PROD_DIECUT_STEP: number,
    PROD_PRINT_TIMES: number,
    FACTORY: string,
    EQ1: string,
    EQ2: string, 
    Setting1: string,
    Setting2: string,
    UPH1: number,
    UPH2: number,
    Step1: number,
    Step2: number,
    LOSS_SX1: number,
    LOSS_SX2: number,
    LOSS_SETTING1: number,
    LOSS_SETTING2: number,
    LOSS_ST_SX1: number,
    LOSS_ST_SX2: number,
    NOTE: string
}
const CODE_MANAGER = () => {
  const [uploadfile,setUploadFile] = useState<any>(null);
  const [codedatatablefilter, setCodeDataTableFilter] = useState<Array<CODE_INFO>>([]);
  const [selection, setSelection] = useState<any>({
    trapo: true,
    thempohangloat:false,
    them1po: false,
    them1invoice:false,
    testinvoicetable: false
  });
  const [userData, setUserData] = useContext(UserContext);
  const [isLoading, setisLoading] = useState(false); 
  const [codeCMS,setCodeCMS] =useState('');
  const [enableEdit, setEnableEdit] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleUploadFile = (ulf: any,newfilename:string)=> {
    console.log(ulf);
    uploadQuery(uploadfile,newfilename,'banve')
    .then((response)=> {
      if (response.data.tk_status !== "NG") {
        Swal.fire('Thông báo','Upload file thành công','success');             
      } else {
        Swal.fire('Thông báo','Upload file thất bại:' + response.data.message,'error'); 
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }
  let column_codeinfo = [
    { field: "id", headerName: "ID", width: 70,  editable: enableEdit },
    { field: "G_CODE", headerName: "G_CODE", width: 80,  editable: enableEdit  },
    { field: "G_NAME", headerName: "G_NAME", flex: 1, minWidth: 250,  editable: enableEdit  },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120,  editable: enableEdit  },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 80,  editable: enableEdit  },
    { field: "PROD_LAST_PRICE", headerName: "PRICE", width: 80,  editable: enableEdit  },
    { field: "PD", headerName: "PD", width: 80,  editable: enableEdit  },
    { field: "CAVITY", headerName: "CAVITY", width: 80,  editable: enableEdit  },
    { field: "PACKING_QTY", headerName: "PACKING_QTY", width: 80,  editable: enableEdit  },
    { field: "G_WIDTH", headerName: "G_WIDTH", width: 80,  editable: enableEdit  },
    { field: "G_LENGTH", headerName: "G_LENGTH", width: 80,  editable: enableEdit  },
    { field: "PROD_PROJECT", headerName: "PROD_PROJECT", width: 120,  editable: enableEdit  },
    { field: "PROD_MODEL", headerName: "PROD_MODEL", width: 120,  editable: enableEdit  },
    { field: "M_NAME_FULLBOM", headerName: "FULLBOM",  flex: 1, minWidth: 150,  editable: enableEdit  },
    { field: "BANVE", headerName: "BANVE", width: 260 , renderCell: (params:any) => {
      let file:any = null;
      const uploadFile2 = async (e:any) => {
        //console.log(file); 
        if(userData.MAINDEPTNAME==='KD')
        {
          uploadQuery(file,params.row.G_CODE +'.pdf','banve')
          .then((response)=> {
            if (response.data.tk_status !== "NG") {
                generalQuery("update_banve_value", { G_CODE: params.row.G_CODE, banvevalue: 'Y' })
                .then((response) => {        
                  if (response.data.tk_status !== "NG") 
                  {
                    Swal.fire('Thông báo','Upload bản vẽ thành công','success');
                    let tempcodeinfodatatable = rows.map((element, index)=> {                 
                      return ( element.G_CODE === params.row.G_CODE ? {...element, BANVE: 'Y'}: element);
                    });
                    setRows(tempcodeinfodatatable);
                  } 
                  else {
                    Swal.fire('Thông báo','Upload bản vẽ thất bại','error');
                  }
                })
                .catch((error) => {
                  console.log(error);
                });       
            } else {
              Swal.fire('Thông báo','Upload file thất bại:' + response.data.message,'error'); 
            }
          })
          .catch((error) => {
            console.log(error);
          });

        }
        else
        {
          Swal.fire('Thông báo','Chỉ bộ phận kinh doanh upload được bản vẽ','error');
        }
      }
      let hreftlink = '/banve/' + params.row.G_CODE + '.pdf';
      if (params.row.BANVE !== "N" && params.row.BANVE !== null)
      {
        return (
          <span style={{ color: "gray" }}>
            <a target='_blank' rel='noopener noreferrer' href={hreftlink}>
              LINK
            </a>
          </span>
        )
      }
      else
      {
        return <div className="uploadfile"> 
       <IconButton className='buttonIcon'onClick={uploadFile2}><AiOutlineCloudUpload color='yellow' size={25}/>Upload</IconButton>
       <input  accept=".pdf" type="file" onChange={(e:any)=> {file = e.target.files[0]; console.log(file);}} />
      </div>
      }        
    },  editable: enableEdit },
    { field: "NO_INSPECTION", headerName: "KT NGOAI QUAN", width: 120, renderCell: (params:any) => {     
      if(params.row.NO_INSPECTION !=='Y')
      return <span style={{color:'green'}}>
       Kiểm tra
      </span>
      return <span style={{color:'red'}}>
       Không kiểm tra
     </span>
    }, editable: enableEdit },
    { field: "USE_YN", headerName: "SỬ DỤNG", width: 80, renderCell: (params:any) => {     
      if(params.row.USE_YN !=='Y')
      return <span style={{color:'red'}}>
       KHÓA
      </span>
      return <span style={{color:'green'}}>
      MỞ
     </span>
    } ,editable: true},
    { field: "PDBV", headerName: "PD BANVE", width: 80 , renderCell: (params:any) => {
      if(params.row.PDBV==='P' || params.row.PDBV==='R' || params.row.PDBV===null)
      return <span style={{color:'red'}}><b>PENDING</b></span>
      return <span style={{color:'green'}}><b>APPROVED</b></span>
    } },
    { field: "TENCODE", headerName: "TENCODE", flex: 1, minWidth: 250,  editable: enableEdit ,renderCell: (params:any) => {           
      return <span style={{color:'black'}}>{params.row.G_NAME}</span>
    } },
    { field: "PROD_DIECUT_STEP", headerName: "BC DIECUT", width: 120 ,renderCell: (params:any) => {  
      
      if(params.row.PROD_DIECUT_STEP === null)
      {
        return <span style={{backgroundColor:'red', fontWeight:'bold'}}>NG</span>        
      }    
      else
      {
        return <span style={{fontWeight:'bold'}}>{params.row.PROD_DIECUT_STEP}</span>       
      }   
    }},
    { field: "PROD_PRINT_TIMES", headerName: "SO LAN IN", width: 120 ,renderCell: (params:any) => { 
      if(params.row.PROD_PRINT_TIMES === null)
      {
        return <span style={{backgroundColor:'red', fontWeight:'bold'}}>NG</span>       
      }    
      else
      {
        return <span style={{fontWeight:'bold'}}>{params.row.PROD_PRINT_TIMES}</span>       
      }   
    }},
    { field: "FACTORY", headerName: "FACTORY", width: 100 ,renderCell: (params:any) => { 
      if(params.row.FACTORY === null)
      {
        return <span style={{backgroundColor:'red', fontWeight:'bold'}}>NG</span>       
      }    
      else
      {
        return <span style={{fontWeight:'bold'}}>{params.row.FACTORY}</span>       
      }   
    }},
    { field: "EQ1", headerName: "EQ1", width: 80 ,renderCell: (params:any) => { 
      if(params.row.EQ1 === null)
      {
        return <span style={{backgroundColor:'red', fontWeight:'bold'}}>NG</span>       
      }    
      else
      {
        return <span style={{fontWeight:'bold'}}>{params.row.EQ1}</span>       
      }   
    }},
    { field: "EQ2", headerName: "EQ2", width: 80 ,renderCell: (params:any) => { 
      if(params.row.EQ2 === null)
      {
        return <span style={{backgroundColor:'red', fontWeight:'bold'}}>NG</span>       
      }    
      else
      {
        return <span style={{fontWeight:'bold'}}>{params.row.EQ2}</span>
      }   
    }},
    { field: "Setting1", headerName: "Setting1", width: 100 ,renderCell: (params:any) => { 
      if(params.row.Setting1 === null)
      {
        return <span style={{backgroundColor:'red', fontWeight:'bold'}}>NG</span>       
      }    
      else
      {
        return <span style={{fontWeight:'bold'}}>{params.row.Setting1}</span>       
      }   
    }},
    { field: "Setting2", headerName: "Setting2", width: 100 ,renderCell: (params:any) => { 
      if(params.row.Setting2 === null)
      {
        return <span style={{backgroundColor:'red', fontWeight:'bold'}}>NG</span>       
      }    
      else
      {
        return <span style={{fontWeight:'bold'}}>{params.row.Setting2}</span>       
      }   
    }}, 
    { field: "UPH1", headerName: "UPH1", width: 80 ,renderCell: (params:any) => { 
      if(params.row.UPH1 === null)
      {
        return <span style={{backgroundColor:'red', fontWeight:'bold'}}>NG</span>       
      }    
      else
      {
        return <span style={{fontWeight:'bold'}}>{params.row.UPH1}</span>       
      }   
    }},
    { field: "UPH2", headerName: "UPH2", width: 80 ,renderCell: (params:any) => { 
      if(params.row.UPH2 === null)
      {
        return <span style={{backgroundColor:'red', fontWeight:'bold'}}>NG</span>       
      }    
      else
      {
        return <span style={{fontWeight:'bold'}}>{params.row.UPH2}</span>       
      }   
    }},
    { field: "Step1", headerName: "Step1", width: 80 ,renderCell: (params:any) => { 
      if(params.row.Step1 === null)
      {
        return <span style={{backgroundColor:'red', fontWeight:'bold'}}>NG</span>       
      }    
      else
      {
        return <span style={{fontWeight:'bold'}}>{params.row.Step1}</span>       
      }   
    }},
    { field: "Step2", headerName: "Step2", width: 80 ,renderCell: (params:any) => { 
      if(params.row.Step2 === null)
      {
        return <span style={{backgroundColor:'red', fontWeight:'bold'}}>NG</span>       
      }    
      else
      {
        return <span style={{fontWeight:'bold'}}>{params.row.Step2}</span>       
      }   
    }},
    { field: "LOSS_SX1", headerName: "LOSS_SX1(%)", width: 100 ,renderCell: (params:any) => { 
      if(params.row.LOSS_SX1 === null)
      {
        return <span style={{backgroundColor:'red', fontWeight:'bold'}}>NG</span>       
      }    
      else
      {
        return <span style={{fontWeight:'bold'}}>{params.row.LOSS_SX1}</span>       
      }   
    }},
    { field: "LOSS_SX2", headerName: "LOSS_SX2(%)", width: 100 ,renderCell: (params:any) => { 
      if(params.row.LOSS_SX2 === null)
      {
        return <span style={{backgroundColor:'red', fontWeight:'bold'}}>NG</span>       
      }    
      else
      {
        return <span style={{fontWeight:'bold'}}>{params.row.LOSS_SX2}</span>       
      }   
    }},
    { field: "LOSS_SETTING1", headerName: "LOSS_SETTING1(m)", width: 130 ,renderCell: (params:any) => { 
      if(params.row.LOSS_SETTING1 === null)
      {
        return <span style={{backgroundColor:'red', fontWeight:'bold'}}>NG</span>       
      }    
      else
      {
        return <span style={{fontWeight:'bold'}}>{params.row.LOSS_SETTING1}</span>       
      }   
    }},
    { field: "LOSS_SETTING2", headerName: "LOSS_SETTING2(m)", width: 130 ,renderCell: (params:any) => { 
      if(params.row.LOSS_SETTING2 === null)
      {
        return <span style={{backgroundColor:'red', fontWeight:'bold'}}>NG</span>       
      }    
      else
      {
        return <span style={{fontWeight:'bold'}}>{params.row.LOSS_SETTING2}</span>       
      }   
    }},
    { field: "LOSS_ST_SX1", headerName: "LOSS_SETTING_SX1(m)", width: 130 ,renderCell: (params:any) => { 
      if(params.row.LOSS_ST_SX1 === null)
      {
        return <span style={{backgroundColor:'red', fontWeight:'bold'}}>NG</span>       
      }    
      else
      {
        return <span style={{fontWeight:'bold'}}>{params.row.LOSS_ST_SX1}</span>       
      }   
    }},
    { field: "LOSS_ST_SX2", headerName: "LOSS_SETTING_SX2(m)", width: 130 ,renderCell: (params:any) => { 
      if(params.row.LOSS_ST_SX2 === null)
      {
        return <span style={{backgroundColor:'red', fontWeight:'bold'}}>NG</span>       
      }    
      else
      {
        return <span style={{fontWeight:'bold'}}>{params.row.LOSS_ST_SX2}</span>       
      }   
    }},
    { field: "NOTE", headerName: "NOTE", width: 150 ,},
  ];
  const [rows, setRows] = useState<CODE_INFO[]>([]);
  const [columns, setColumns] = useState<GridColumns>(column_codeinfo);
  const [editedRows, setEditedRows] = useState<Array<GridCellEditCommitParams>>([]);
  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(column_codeinfo);
  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector /> 
        <IconButton className='buttonIcon'onClick={()=>{SaveExcel(rows,"Code Info Table")}}><AiFillFileExcel color='green' size={25}/>SAVE</IconButton> 
        <IconButton className='buttonIcon'onClick={()=>{ setNgoaiQuan('N');}}><AiFillCheckCircle color='blue' size={25}/>SET NGOAI QUAN</IconButton> 
        <IconButton className='buttonIcon'onClick={()=>{ setNgoaiQuan('Y');}}><FcCancel color='green' size={25}/>SET K NGOAI QUAN</IconButton> 
        <IconButton className='buttonIcon'onClick={()=>{resetBanVe('N'); }}><BiReset color='green' size={25}/>RESET BẢN VẼ</IconButton> 
        <IconButton className='buttonIcon'onClick={()=>{pdBanVe('Y'); }}><MdOutlineDraw color='red' size={25}/>PDUYET BẢN VẼ</IconButton> 
        <IconButton className='buttonIcon'onClick={()=>{
          handleSaveQLSX();
         }}><MdUpdate color='blue' size={25}/>Update TT QLSX</IconButton> 
        <IconButton className='buttonIcon'onClick={()=>{
          setColumns(columns.map((element, index:number)=> {
            return {...element, editable : !element.editable};
          }))
          Swal.fire("Thông báo","Bật/Tắt chế độ sửa","success");
        }}>
          <AiFillEdit color='yellow' size={25}/>Bật tắt sửa</IconButton> 
        <GridToolbarQuickFilter/>
        <IconButton className='buttonIcon'onClick={()=>{
          handleSaveLossSX();
         }}><MdUpdate color='blue' size={25}/>Update LOSS SX</IconButton> 
      </GridToolbarContainer>
    );
  }  
  const resetBanVe= async(value: string)=> {
    if(codedatatablefilter.length>=1)
    {
      if(userData.EMPL_NO==='NBT1901' ||userData.EMPL_NO==='VTT1901' || userData.EMPL_NO==='NHU1903'|| userData.EMPL_NO==='LVT1906')
      {
        for(let i=0;i<codedatatablefilter.length;i++)
        {        
            await generalQuery("resetbanve", {           
              G_CODE: codedatatablefilter[i].G_CODE,
              VALUE: value
            })
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
                //Swal.fire("Thông báo", "Delete Po thành công", "success");  
              } else {     
                //Swal.fire("Thông báo", "Update PO thất bại: " +response.data.message , "error");              
              }
            })
            .catch((error) => {
              console.log(error);
            });  
        } 
        Swal.fire("Thông báo", "RESET BAN VE THÀNH CÔNG", "success"); 
      }
      else
      {
        Swal.fire("Thông báo", "Không đủ quyền hạn!" , "error"); 
      }
    }
    else
    {
      Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để SET !" , "error"); 
    }
  }
  const pdBanVe= async(value: string)=> {
    if(codedatatablefilter.length>=1)
    {
      if(((userData.SUBDEPTNAME==='PQC1' || userData.SUBDEPTNAME==='PQC3') && (userData.JOB_NAME==='Sub Leader' || userData.JOB_NAME==='Leader')))
      {
        for(let i=0;i<codedatatablefilter.length;i++)
        {        
            await generalQuery("pdbanve", {           
              G_CODE: codedatatablefilter[i].G_CODE,
              VALUE: value
            })
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
                //Swal.fire("Thông báo", "Delete Po thành công", "success");  
              } else {     
                //Swal.fire("Thông báo", "Update PO thất bại: " +response.data.message , "error");              
              }
            })
            .catch((error) => {
              console.log(error);
            }); 
        } 
        Swal.fire("Thông báo", "Phê duyệt Bản Vẽ THÀNH CÔNG", "success"); 
      }
      else
      {
        Swal.fire("Thông báo", "Không đủ quyền hạn!" , "error"); 
      }  
    }
    else
    {
      Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để Phê Duyệt !" , "error"); 
    }
  }
  const handleCODEINFO = ()=> {
    setisLoading(true);
    setColumnDefinition(column_codeinfo);
    generalQuery('codeinfo',{     
        G_NAME: codeCMS    
    })
    .then(response => {
        //console.log(response.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: CODE_INFO[] =  response.data.data.map((element:CODE_INFO,index: number)=> {
            return {
              ...element,   id:  index
            }
          })
          setRows(loadeddata);
          //setCODEINFODataTable(loadeddata);
          setisLoading(false);
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");  
        }
        else
        {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");  
          setisLoading(false);
        }        
    })
    .catch(error => {
        console.log(error);
    });
  }
  const setNav = (choose: number) => {
    if(choose ===1 )
    {
      setSelection({...selection, trapo: true, thempohangloat:false, them1po:false,them1invoice:false,testinvoicetable: false});
    }
    else if(choose ===2 )
    {
      setSelection({...selection, trapo: false, thempohangloat:true, them1po:false,them1invoice:false,testinvoicetable: false});
    }
    else if(choose ===3 )
    {
      setSelection({...selection, trapo: false, thempohangloat:false, them1po:false,them1invoice:false,testinvoicetable: true});
    }
  }
  const handleCODESelectionforUpdate =(ids: GridSelectionModel) => {   
    const selectedID = new Set(ids);    
    let datafilter = rows.filter((element: CODE_INFO) => selectedID.has(element.id));    
    //console.log(datafilter);
    if(datafilter.length>0)
    {
      setCodeDataTableFilter(datafilter);
    }
    else
    {
      setCodeDataTableFilter([]);
    }
  }
  const setNgoaiQuan= async(value: string)=> {
    if(codedatatablefilter.length>=1)
    {
      if(userData.EMPL_NO==='VTT1901' || userData.EMPL_NO==='NHU1903'|| userData.EMPL_NO==='LVT1906')
      {
        for(let i=0;i<codedatatablefilter.length;i++)
        {        
            await generalQuery("setngoaiquan", {           
              G_CODE: codedatatablefilter[i].G_CODE,
              VALUE: value
            })
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
                //Swal.fire("Thông báo", "Delete Po thành công", "success");  
              } else {     
                //Swal.fire("Thông báo", "Update PO thất bại: " +response.data.message , "error");              
              }
            })
            .catch((error) => {
              console.log(error);
            });  
        } 
        Swal.fire("Thông báo", "SET TRẠNG KIỂM TRA NGOẠI QUAN THÀNH CÔNG", "success"); 
      }
      else
      {
        Swal.fire("Thông báo", "Không đủ quyền hạn!" , "error"); 
      }
    }
    else
    {
      Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để SET !" , "error"); 
    }
  }
  const handleSaveQLSX= async()=> {
    if(codedatatablefilter.length>=1)
    {
      if(userData.EMPL_NO==='NHU1903' || userData.MAINDEPTNAME==='QLSX')
      {
        let err_code: string ='0';
        for(let i=0;i<codedatatablefilter.length;i++)
        {        
            await generalQuery("saveQLSX", {           
              G_CODE: codedatatablefilter[i].G_CODE,
              PROD_DIECUT_STEP: codedatatablefilter[i].PROD_DIECUT_STEP,
              PROD_PRINT_TIMES: codedatatablefilter[i].PROD_PRINT_TIMES,
              FACTORY: codedatatablefilter[i].FACTORY,
              EQ1: codedatatablefilter[i].EQ1,
              EQ2: codedatatablefilter[i].EQ2,
              Setting1: codedatatablefilter[i].Setting1,
              Setting2: codedatatablefilter[i].Setting2,
              UPH1: codedatatablefilter[i].UPH1,
              UPH2: codedatatablefilter[i].UPH2,
              Step1: codedatatablefilter[i].Step1,
              Step2: codedatatablefilter[i].Step2,
              LOSS_SX1: codedatatablefilter[i].LOSS_SX1,
              LOSS_SX2: codedatatablefilter[i].LOSS_SX2,
              LOSS_SETTING1: codedatatablefilter[i].LOSS_SETTING1,
              LOSS_SETTING2: codedatatablefilter[i].LOSS_SETTING2,
              NOTE: codedatatablefilter[i].NOTE,             
            })
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
                
              } else {     
                         err_code ='1'; 
              }
            })
            .catch((error) => {
              console.log(error);
            });  
        } 
        if(err_code ==='1')
        {
          Swal.fire("Thông báo", "Lưu thất bại, không được để trống đỏ ô nào", "error"); 
        }
        else
        {
          Swal.fire("Thông báo", "Lưu thành công", "success"); 
          setCodeDataTableFilter([]);
        }
      }
      else
      {
        Swal.fire("Thông báo", "Không đủ quyền hạn!" , "error"); 
      }
    }
    else
    {
      Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để SET !" , "error"); 
    }
  }
  const handleSaveLossSX= async()=> {
    if(codedatatablefilter.length>=1)
    {
      if(userData.EMPL_NO==='NHU1903'||  userData.EMPL_NO==='DTL1906'|| userData.EMPL_NO==='LVQ0103')
      {
        let err_code: string ='0';
        for(let i=0;i<codedatatablefilter.length;i++)
        {        
            await generalQuery("saveLOSS_SETTING_SX", {           
              G_CODE: codedatatablefilter[i].G_CODE,             
              LOSS_ST_SX1: codedatatablefilter[i].LOSS_ST_SX1,
              LOSS_ST_SX2: codedatatablefilter[i].LOSS_ST_SX2,                          
            })
            // eslint-disable-next-line no-loop-func
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
                
              } else {     
                         err_code ='1'; 
              }
            })
            .catch((error) => {
              console.log(error);
            });  
        } 
        if(err_code ==='1')
        {
          Swal.fire("Thông báo", "Lưu thất bại, không được để trống đỏ ô nào", "error"); 
        }
        else
        {
          Swal.fire("Thông báo", "Lưu thành công", "success"); 
          setCodeDataTableFilter([]);
        }
      }
      else
      {
        Swal.fire("Thông báo", "Không đủ quyền hạn!" , "error"); 
      }
    }
    else
    {
      Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để SET !" , "error"); 
    }
  }

  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleCODEINFO();
    }
  };
  useEffect(()=>{
  },[]);
  return (
    <div className='codemanager'>
      <div className='mininavbar'>
        <div className='mininavitem' onClick={() => setNav(1)}>
          <span className='mininavtext'>Thông tin sản phẩm</span>
        </div>    
      </div>
      {selection.trapo && (
        <div className='tracuuFcst'>
          <div className='tracuuFcstform'>
            <div className='forminput'>
              <div className='forminputcolumn'>
                <label>
                  <b>Code:</b>{" "}
                  <input
                    type='text'
                    placeholder='Nhập code vào đây'
                    value={codeCMS}
                    onChange={(e) => setCodeCMS(e.target.value)}
                    onKeyDown={(e) => {
                      handleSearchCodeKeyDown(e);
                    }}
                  ></input>
                </label>
                <button
                  className='traxuatkiembutton'
                  onClick={() => {
                    handleCODEINFO();
                  }}                 
                >
                  Tìm code
                </button>
                {/* <input  accept=".pdf" type="file" onChange={(e:any)=> {let file = e.target.files[0];  setUploadFile(file); }} />
                <button
                  className='traxuatkiembutton'
                  onClick={() => {
                    handleUploadFile(uploadfile);
                  }}                 
                >
                  Upload File
                </button> */}
                
              </div>
            </div>
          </div>
          <div className='tracuuFcstTable'>
            <DataGrid
              components={{
                Toolbar: CustomToolbarPOTable,
                LoadingOverlay: LinearProgress,
              }}
              sx={{ fontSize: '0.7rem' }}
              loading={isLoading}
              rowHeight={30}
              rows = {rows}
              columns={columns}
              checkboxSelection
              onSelectionModelChange={(ids) => {handleCODESelectionforUpdate(ids);}}
             /*  rows={codeinfodatatable}
              columns={columnDefinition} */
              rowsPerPageOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
              ]}
              editMode='cell'
              /* experimentalFeatures={{ newEditingApi: true }}  */
              onCellEditCommit={(params: GridCellEditCommitParams, event: MuiEvent<MuiBaseEvent>, details: GridCallbackDetails) => {
                //console.log(params);
                let tempeditrows = editedRows;
                 tempeditrows.push(params);
                setEditedRows(tempeditrows);
                //console.log(editedRows);
                const keyvar = params.field;
                const newdata = rows.map((p) =>
                  p.id === params.id ? { ...p, [keyvar]: params.value } : p
                );
                startTransition(() => {
                  setRows(newdata);
                });
                
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
export default CODE_MANAGER