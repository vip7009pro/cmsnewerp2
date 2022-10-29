import { IconButton,  LinearProgress,} from '@mui/material';
import { DataGrid, GridToolbarContainer,   GridToolbarQuickFilter } from '@mui/x-data-grid';
import moment from 'moment';
import React, { useContext, useEffect, useState, } from 'react'
import {AiFillFileExcel } from "react-icons/ai";
import Swal from 'sweetalert2';
import { generalQuery } from '../../../api/Api';
import { UserContext } from '../../../api/Context';
import { SaveExcel } from '../../../api/GlobalFunction';
import "./KHOLIEU.scss"


interface NHAPLIEUDATA {
  M_LOT_NO: string,
  M_CODE: string, 
  M_NAME:  string,
  WIDTH_CD: number,
  IN_CFM_QTY: number,
  ROLL_QTY: number,
  TOTAL_IN_QTY: number,
  INS_DATE: string,
  CUST_NAME_KD: string
}
interface XUATLIEUDATA {
  G_CODE: string, 
  G_NAME: string,
  PROD_REQUEST_NO: string,
  M_CODE: string,
  M_NAME: string, 
  WIDTH_CD: number,
  M_LOT_NO: string,
  OUT_CFM_QTY: number,
  ROLL_QTY: number,
  TOTAL_OUT_QTY: number,
  INS_DATE: string
}
interface TONLIEUDATA {
  M_CODE: string,
  M_NAME: string,
  WIDTH_CD: number,
  TON_NM1: number,
  TON_NM2: number,
  HOLDING_NM1: number,
  HOLDING_NM2: number,
  TOTAL_OK: number,
  TOTAL_HOLDING: number
}

const KHOLIEU = () => { 
  const [readyRender, setReadyRender] = useState(false);
  const [selection, setSelection] = useState<any>({
    trapo: true,
    thempohangloat:false,
    them1po: false,
    them1invoice:false,
    themycsx: false,
    suaycsx:false,
    inserttableycsx: false,
    renderycsx:false,
    renderbanve:false,
    amazontab: false
  });
  const [userData, setUserData] = useContext(UserContext);
  const [isLoading, setisLoading] = useState(false);  
  const [fromdate, setFromDate] = useState(moment().format('YYYY-MM-DD'));
  const [todate, setToDate] = useState(moment().format('YYYY-MM-DD'));
  const [m_name,setM_Name] =useState('');
  const [m_code,setM_Code] =useState('');
  const [codeKD,setCodeKD] =useState('');
  const [codeCMS,setCodeCMS] =useState('');
  const [cust_name,setCustName] =useState('');
  const [prod_request_no,setProd_Request_No] =useState('');
  const [alltime, setAllTime] = useState(false);  
  const [justbalancecode, setJustBalanceCode] = useState(true); 
  const [whdatatable, setWhDataTable] = useState<Array<any>>([]);
  const [sumaryWH, setSummaryWH] = useState('');
  const column_STOCK_LIEU = [
    { field: "M_CODE", headerName: "M_CODE", width: 90 },
    { field: "M_NAME", headerName: "M_NAME", width: 180 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 90 },
    { field: "TON_NM1", headerName: "TON_NM1", width: 120, renderCell: (params:any) => {return <span style={{color:'gray'}}><b>{params.row.TON_NM1.toLocaleString('en-US')}</b></span>} },
    { field: "TON_NM2", headerName: "TON_NM2", width: 120 , renderCell: (params:any) => {return <span style={{color:'gray'}}><b>{params.row.TON_NM2.toLocaleString('en-US')}</b></span>}},
    { field: "HOLDING_NM1", headerName: "HOLDING_NM1", width: 100 , renderCell: (params:any) => {return <span style={{color:'red'}}><b>{params.row.HOLDING_NM1.toLocaleString('en-US')}</b></span>}},
    { field: "HOLDING_NM2", headerName: "HOLDING_NM2", width: 100 , renderCell: (params:any) => {return <span style={{color:'red'}}><b>{params.row.HOLDING_NM2.toLocaleString('en-US')}</b></span>}},
    { field: "TOTAL_OK", headerName: "TOTAL_OK", width: 150, renderCell: (params:any) => {return <span style={{color:'green'}}><b>{params.row.TOTAL_OK.toLocaleString('en-US')}</b></span>} },    
    { field: "TOTAL_HOLDING", headerName: "TOTAL_HOLDING", width: 150, renderCell: (params:any) => {return <span style={{color:'red'}}><b>{params.row.TOTAL_HOLDING.toLocaleString('en-US')}</b></span>} },    
  ]
  const column_XUATLIEUDATA = [
    { field: "G_CODE", headerName: "G_CODE", width: 100 },    
    { field: "G_NAME", headerName: "G_NAME", width: 220 },
    { field: "PROD_REQUEST_NO", headerName: "SO YCSX", width: 90 },
    { field: "M_CODE", headerName: "M_CODE", width: 100 },
    { field: "M_NAME", headerName: "M_NAME", width: 180 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 90 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 100 },
    { field: "OUT_CFM_QTY", headerName: "UNIT_QTY", width: 120 , renderCell: (params:any) => {return <span style={{color:'green'}}><b>{params.row.OUT_CFM_QTY.toLocaleString('en-US')}</b></span>}},   
    { field: "ROLL_QTY", headerName: "ROLL_QTY", width: 100 },
    { field: "TOTAL_OUT_QTY", headerName: "OUTPUT QTY", width: 120 , renderCell: (params:any) => {return <span style={{color:'green'}}><b>{(params.row.TOTAL_OUT_QTY).toLocaleString('en-US')}</b></span>}},   
    { field: "INS_DATE", headerName: "INS_DATE", width: 180 },
  ];
  const column_NHAPLIEUDATA = [
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 150 },    
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 90 },
    { field: "M_CODE", headerName: "M_CODE", width: 100 },
    { field: "M_NAME", headerName: "M_NAME", width: 180 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 150 },
    { field: "IN_CFM_QTY", headerName: "UNIT QTY", width: 120 , renderCell: (params:any) => {return <span style={{color:'green'}}><b>{params.row.IN_CFM_QTY.toLocaleString('en-US')}</b></span>}},   
    { field: "ROLL_QTY", headerName: "ROLL_QTY", width: 100 },
    { field: "TOTAL_IN_QTY", headerName: "INPUT QTY", width: 120 , renderCell: (params:any) => {return <span style={{color:'green'}}><b>{(params.row.TOTAL_IN_QTY).toLocaleString('en-US')}</b></span>}},   
    { field: "INS_DATE", headerName: "INS_DATE", width: 150 },
  ];
  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(column_XUATLIEUDATA);
  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>      
        <IconButton className='buttonIcon'onClick={()=>{SaveExcel(whdatatable,"WareHouse Data Table")}}
        ><AiFillFileExcel color='green' size={25}/>SAVE</IconButton>
        <GridToolbarQuickFilter/>    
        <span style={{fontWeight:'bold', fontSize: 18, paddingLeft:20, color: 'blue'}}>{sumaryWH}</span>
       </GridToolbarContainer>
    );
  }
  const handletra_inputlieu = ()=> { 
    setSummaryWH('');
    setisLoading(true);
    generalQuery('tranhaplieu',{  
      M_NAME: m_name,
      FROM_DATE: fromdate,
      TO_DATE: todate,
     
    })
    .then(response => {
        //console.log(response.data.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: NHAPLIEUDATA[] =  response.data.data.map((element:NHAPLIEUDATA,index: number)=> {           
            return {
              ...element, 
              id: index,  
              INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
            }
          })         
          setWhDataTable(loadeddata);
          setReadyRender(true);
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
  const handletra_outputlieu = ()=> {
    setisLoading(true);
    generalQuery('traxuatlieu',{         
      G_NAME: codeKD,
      ALLTIME: alltime,
      JUSTBALANCE: justbalancecode,    
      PROD_REQUEST_NO: prod_request_no,
      M_NAME: m_name,
      M_CODE: m_code,
      FROM_DATE: fromdate,
      TO_DATE: todate,      
    })
    .then(response => {
        //console.log(response.data.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: XUATLIEUDATA[] =  response.data.data.map((element:XUATLIEUDATA,index: number)=> {
            return {
              ...element, 
              id: index, 
              INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
            }
          })         
          setWhDataTable(loadeddata);
          setReadyRender(true);
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
  const handletraWHSTOCKLIEU = ()=> {   
    setSummaryWH('');
    setisLoading(true);
    generalQuery('tratonlieu',{   
      M_CODE: m_code,
      M_NAME: m_name,     
      JUSTBALANCE: justbalancecode,  
    })
    .then(response => {
        //console.log(response.data.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: TONLIEUDATA[] =  response.data.data.map((element:TONLIEUDATA,index: number)=> {
            return {
              ...element, 
              id: index, 
            }
          })         
          setWhDataTable(loadeddata);
          setReadyRender(true);
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
  useEffect(()=>{      
  },[]);
  return (
    <div className='kholieu'>
        <div className='tracuuDataWH'>
          <div className='tracuuDataWHform'>
            <div className='forminput'>
              <div className='forminputcolumn'>
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
              </div>
              <div className='forminputcolumn'>
                <label>
                  <b>Tên Liệu:</b>{" "}
                  <input
                    type='text'
                    placeholder='SJ-203020HC'
                    value={m_name}
                    onChange={(e) => setM_Name(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Mã Liệu CMS:</b>{" "}
                  <input
                    type='text'
                    placeholder='A123456'
                    value={m_code}
                    onChange={(e) => setM_Code(e.target.value)}
                  ></input>
                </label>
              </div>
              <div className='forminputcolumn'>                
                <label>
                  <b>Code KD:</b>{" "}
                  <input
                    type='text'
                    placeholder='GH63-14904A'
                    value={codeKD}
                    onChange={(e) => setCodeKD(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>YCSX:</b>{" "}
                  <input
                    type='text'
                    placeholder='1F80008'
                    value={prod_request_no}
                    onChange={(e) => setProd_Request_No(e.target.value)}
                  ></input>
                </label>
              </div>        
              <div className='forminputcolumn'>
              <label>
                <b>All Time:</b>
                <input
                  type='checkbox'
                  name='alltimecheckbox'
                  defaultChecked={alltime}
                  onChange={() => setAllTime(!alltime)}
                ></input>
              </label>  
              <label>
                <b>Chỉ code có tồn:</b>
                <input
                  type='checkbox'
                  name='alltimecheckbox'
                  defaultChecked={justbalancecode}
                  onChange={() => setJustBalanceCode(!justbalancecode)}
                ></input>
              </label>
              </div>                    
            </div>
            <div className='formbutton'>              
              <button className='tranhapkiembutton'  onClick={() => {
                  setisLoading(true);
                  setReadyRender(false);
                  setColumnDefinition(column_NHAPLIEUDATA);
                  handletra_inputlieu();
                }}>
                  Nhập Liệu
              </button>             
              <button className='tranhapkiembutton'  onClick={() => {
                  setisLoading(true);
                  setReadyRender(false);
                  setColumnDefinition(column_XUATLIEUDATA);
                  handletra_outputlieu();
                }}>
                  Xuất Liệu
              </button>             
              <button className='traxuatkiembutton'  onClick={() => {
                  setisLoading(true);
                setReadyRender(false);
                 setColumnDefinition(column_STOCK_LIEU);
                 handletraWHSTOCKLIEU();
                }}>
                  Tồn Liệu
              </button>
            </div>
          </div>
          <div className='tracuuWHTable'>
            {readyRender && <DataGrid
              sx={{ fontSize: 12, flex: 1 }}
              components={{
                Toolbar: CustomToolbarPOTable,
                LoadingOverlay: LinearProgress,
              }}
              loading={isLoading}
              rowHeight={30}
              rows={whdatatable}
              columns={columnDefinition}
              rowsPerPageOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
              ]}
              editMode='row'               
            />}
          </div>
        </div>      
    </div>
  );
}
export default KHOLIEU