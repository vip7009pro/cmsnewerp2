import { IconButton,  LinearProgress,} from '@mui/material';
import { DataGrid, GridToolbarContainer,   GridToolbarQuickFilter } from '@mui/x-data-grid';
import moment from 'moment';
import React, { useContext, useEffect, useState, } from 'react'
import {AiFillFileExcel } from "react-icons/ai";
import Swal from 'sweetalert2';
import { generalQuery } from '../../../api/Api';
import { UserContext } from '../../../api/Context';
import { SaveExcel } from '../../../api/GlobalFunction';
import "./KHOTP.scss"
interface WH_IN_OUT {
  Product_MaVach: string,
  G_NAME: string,
  G_NAME_KD: string,
  Customer_ShortName: string,
  IO_Date: string,
  INPUT_DATETIME: string,
  IO_Shift: string,
  IO_Type: string,
  IO_Qty: number,
  CUST_NAME_KD: string,
}
interface TONKIEMGOP_CMS {
  G_CODE: string,
  G_NAME: string,
  G_NAME_KD: string,
  CHO_KIEM: number,
  CHO_CS_CHECK: number,
  CHO_KIEM_RMA: number,
  TONG_TON_KIEM: number,
  BTP: number,
  TON_TP: number,
  BLOCK_QTY: number,
  GRAND_TOTAL_STOCK: number,
}
interface TONKIEMGOP_KD {
  G_NAME_KD: string,
  CHO_KIEM: number,
  CHO_CS_CHECK: number,
  CHO_KIEM_RMA: number,
  TONG_TON_KIEM: number,
  BTP: number,
  TON_TP: number,
  BLOCK_QTY: number,
  GRAND_TOTAL_STOCK: number,
}
interface TONKIEMTACH {
  KHONAME: string,
  LC_NAME: string,
  G_CODE: string,
  G_NAME: string,
  G_NAME_KD: string, 
  NHAPKHO: number,
  XUATKHO: number,
  TONKHO: number,
  BLOCK_QTY: number,
  GRAND_TOTAL_TP: number,
}
const KHOTP = () => { 
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
  const [codeKD,setCodeKD] =useState('');
  const [codeCMS,setCodeCMS] =useState('');
  const [cust_name,setCustName] =useState('');
  const [alltime, setAllTime] = useState(false); 
  const [capbu, setCapBu] = useState(false); 
  const [justbalancecode, setJustBalanceCode] = useState(true); 
  const [whdatatable, setWhDataTable] = useState<Array<any>>([]);
  const [sumaryWH, setSummaryWH] = useState('');
  const column_STOCK_TACH = [
    { field: "KHO_NAME", headerName: "KHO_NAME", width: 90 },
    { field: "LC_NAME", headerName: "LC_NAME", width: 90 },
    { field: "G_CODE", headerName: "G_CODE", width: 90 },
    { field: "G_NAME", headerName: "G_NAME", width: 180 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 180 },
    { field: "NHAPKHO", headerName: "NHAPKHO", width: 120, renderCell: (params:any) => {return <span style={{color:'gray'}}><b>{params.row.NHAPKHO.toLocaleString('en-US')}</b></span>} },
    { field: "XUATKHO", headerName: "XUATKHO", width: 120 , renderCell: (params:any) => {return <span style={{color:'gray'}}><b>{params.row.XUATKHO.toLocaleString('en-US')}</b></span>}},
    { field: "TONKHO", headerName: "TONKHO", width: 100 , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.TONKHO.toLocaleString('en-US')}</b></span>}},
    { field: "BLOCK_QTY", headerName: "BLOCK_QTY", width: 100 , renderCell: (params:any) => {return <span style={{color:'red'}}><b>{params.row.BLOCK_QTY.toLocaleString('en-US')}</b></span>}},
    { field: "GRAND_TOTAL_TP", headerName: "GRAND_TOTAL_TP", width: 150, renderCell: (params:any) => {return <span style={{color:'green'}}><b>{params.row.GRAND_TOTAL_TP.toLocaleString('en-US')}</b></span>} },    
  ]
  const column_STOCK_CMS = [
    { field: "G_CODE", headerName: "G_CODE", width: 90 },
    { field: "G_NAME", headerName: "G_NAME", width: 180 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 180 },
    { field: "CHO_KIEM", headerName: "CHO_KIEM", width: 120 , renderCell: (params:any) => {return <span style={{color:'gray'}}><b>{params.row.CHO_KIEM.toLocaleString('en-US')}</b></span>} },
    { field: "CHO_CS_CHECK", headerName: "WAIT CS", width: 120 , renderCell: (params:any) => {return <span style={{color:'gray'}}><b>{params.row.CHO_CS_CHECK.toLocaleString('en-US')}</b></span>} },
    { field: "CHO_KIEM_RMA", headerName: "WAIT RMA", width: 120, renderCell: (params:any) => {return <span style={{color:'gray'}}><b>{params.row.CHO_KIEM_RMA.toLocaleString('en-US')}</b></span>}  },
    { field: "TONG_TON_KIEM", headerName: "TONG_TON_KIEM", width: 120 , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.TONG_TON_KIEM.toLocaleString('en-US')}</b></span>} },
    { field: "BTP", headerName: "BTP", width: 100 , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.BTP.toLocaleString('en-US')}</b></span>} },
    { field: "TON_TP", headerName: "TON_TP", width: 100 , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.TON_TP.toLocaleString('en-US')}</b></span>} },
    { field: "BLOCK_QTY", headerName: "BLOCK_QTY", width: 100 , renderCell: (params:any) => {return <span style={{color:'red'}}><b>{params.row.BLOCK_QTY.toLocaleString('en-US')}</b></span>} },
    { field: "GRAND_TOTAL_STOCK", headerName: "GRAND_TOTAL_STOCK", width: 150 , renderCell: (params:any) => {return <span style={{color:'green'}}><b>{params.row.GRAND_TOTAL_STOCK.toLocaleString('en-US')}</b></span>} },    
  ];
  const column_STOCK_KD = [   
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 180 },
    { field: "CHO_KIEM", headerName: "CHO_KIEM", width: 120 , renderCell: (params:any) => {return <span style={{color:'gray'}}><b>{params.row.CHO_KIEM.toLocaleString('en-US')}</b></span>}},
    { field: "CHO_CS_CHECK", headerName: "WAIT CS", width: 120 , renderCell: (params:any) => {return <span style={{color:'gray'}}><b>{params.row.CHO_CS_CHECK.toLocaleString('en-US')}</b></span>}},
    { field: "CHO_KIEM_RMA", headerName: "WAIT RMA", width: 120 , renderCell: (params:any) => {return <span style={{color:'gray'}}><b>{params.row.CHO_KIEM_RMA.toLocaleString('en-US')}</b></span>}},
    { field: "TONG_TON_KIEM", headerName: "TONG_TON_KIEM", width: 120, renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.TONG_TON_KIEM.toLocaleString('en-US')}</b></span>} },
    { field: "BTP", headerName: "BTP", width: 100 , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.BTP.toLocaleString('en-US')}</b></span>}},
    { field: "TON_TP", headerName: "TON_TP", width: 100 , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.TON_TP.toLocaleString('en-US')}</b></span>}},
    { field: "BLOCK_QTY", headerName: "BLOCK_QTY", width: 100 , renderCell: (params:any) => {return <span style={{color:'red'}}><b>{params.row.BLOCK_QTY.toLocaleString('en-US')}</b></span>}},
    { field: "GRAND_TOTAL_STOCK", headerName: "GRAND_TOTAL_STOCK", width: 150 , renderCell: (params:any) => {return <span style={{color:'green'}}><b>{params.row.GRAND_TOTAL_STOCK.toLocaleString('en-US')}</b></span>}},    
  ];
  const column_WH_IN_OUT = [
    { field: "G_CODE", headerName: "G_CODE", width: 90 },
    { field: "G_NAME", headerName: "G_NAME", width: 180 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 150 },
    { field: "Customer_ShortName", headerName: "Customer_ShortName", width: 150 },
    { field: "IO_Date", headerName: "IO_Date", width: 150 },
    { field: "INPUT_DATETIME", headerName: "IN_OUT_TIME", width: 150 },
    { field: "IO_Shift", headerName: "IO_Shift", width: 80 },
    { field: "IO_Type", headerName: "IO_Type", width: 80 },
    { field: "IO_Qty", headerName: "IO_Qty", width: 80 , renderCell: (params:any) => {return <span style={{color:'green'}}><b>{params.row.IO_Qty.toLocaleString('en-US')}</b></span>}},   
  ];
  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(column_STOCK_CMS);
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
  const handletraWHInOut = (inout: string)=> {   
    let inout_qty:number = 0;  
    setSummaryWH('');
    setisLoading(true);
    generalQuery('trakhotpInOut',{   
      G_CODE: codeCMS,
      G_NAME: codeKD,
      ALLTIME: alltime,
      JUSTBALANCE: justbalancecode,    
      CUST_NAME: cust_name,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      INOUT: inout,
      CAPBU: capbu
    })
    .then(response => {
        //console.log(response.data.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: WH_IN_OUT[] =  response.data.data.map((element:WH_IN_OUT,index: number)=> {
            inout_qty += element.IO_Qty;
            return {
              ...element, 
              id: index,  
              IO_Date: moment.utc(element.IO_Date).format("YYYY-MM-DD"),
              INPUT_DATETIME: moment.utc(element.INPUT_DATETIME).format("YYYY-MM-DD HH:mm:ss"),
            }
          })         
          setWhDataTable(loadeddata);
          setReadyRender(true);
          setisLoading(false);
          setSummaryWH('TOTAL QTY: ' +  inout_qty.toLocaleString('en-US') + 'EA');    
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
  const handletraWHSTOCKCMS = ()=> {   
    setSummaryWH('');
    setisLoading(true);
    generalQuery('traSTOCKCMS',{   
      G_CODE: codeCMS,
      G_NAME: codeKD,
      ALLTIME: alltime,
      JUSTBALANCE: justbalancecode,    
      CUST_NAME: cust_name,
      FROM_DATE: fromdate,
      TO_DATE: todate,      
    })
    .then(response => {
        //console.log(response.data.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: TONKIEMGOP_CMS[] =  response.data.data.map((element:TONKIEMGOP_CMS,index: number)=> {
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
  const handletraWHSTOCKKD = ()=> {   
    setSummaryWH('');
    setisLoading(true);
    generalQuery('traSTOCKKD',{   
      G_CODE: codeCMS,
      G_NAME: codeKD,
      ALLTIME: alltime,
      JUSTBALANCE: justbalancecode,    
      CUST_NAME: cust_name,
      FROM_DATE: fromdate,
      TO_DATE: todate,      
    })
    .then(response => {
        //console.log(response.data.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: TONKIEMGOP_KD[] =  response.data.data.map((element:TONKIEMGOP_KD,index: number)=> {
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
  const handletraWHSTOCKTACH = ()=> {   
    setSummaryWH('');
    setisLoading(true);
    generalQuery('traSTOCKTACH',{   
      G_CODE: codeCMS,
      G_NAME: codeKD,
      ALLTIME: alltime,
      JUSTBALANCE: justbalancecode,    
      CUST_NAME: cust_name,
      FROM_DATE: fromdate,
      TO_DATE: todate,      
    })
    .then(response => {
        //console.log(response.data.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: TONKIEMTACH[] =  response.data.data.map((element:TONKIEMTACH,index: number)=> {
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
    <div className='khotp'>
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
                  <b>Code KD:</b>{" "}
                  <input
                    type='text'
                    placeholder='GH63-xxxxxx'
                    value={codeKD}
                    onChange={(e) => setCodeKD(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Code CMS:</b>{" "}
                  <input
                    type='text'
                    placeholder='7C123xxx'
                    value={codeCMS}
                    onChange={(e) => setCodeCMS(e.target.value)}
                  ></input>
                </label>
              </div>
              <div className='forminputcolumn'>                
                <label>
                  <b>Khách:</b>{" "}
                  <input
                    type='text'
                    placeholder='SEVT'
                    value={cust_name}
                    onChange={(e) => setCustName(e.target.value)}
                  ></input>
                </label>
                <label>
                <b>All Time:</b>
                <input
                  type='checkbox'
                  name='alltimecheckbox'
                  defaultChecked={alltime}
                  onChange={() => setAllTime(!alltime)}
                ></input>
              </label>  
              </div>        
              <div className='forminputcolumn'>
              <label>
                <b>Tính cả xuất cấp bù:</b>
                <input
                  type='checkbox'
                  name='alltimecheckbox'
                  defaultChecked={capbu}
                  onChange={() => setCapBu(!capbu)}
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
                  setColumnDefinition(column_WH_IN_OUT);
                  handletraWHInOut('IN');
                }}>
                  Nhập Kho
              </button>             
              <button className='tranhapkiembutton'  onClick={() => {
                  setisLoading(true);
                  setReadyRender(false);
                  setColumnDefinition(column_WH_IN_OUT);
                  handletraWHInOut('OUT');
                }}>
                  Xuất Kho
              </button>             
              <button className='traxuatkiembutton'  onClick={() => {
                  setisLoading(true);
                setReadyRender(false);
                 setColumnDefinition(column_STOCK_CMS);
                 handletraWHSTOCKCMS();
                }}>
                  Tồn Kho (CMS)
              </button>             
              <button className='tranhapxuatkiembutton'  onClick={() => {
                  setisLoading(true);
                  setReadyRender(false);
                  setColumnDefinition(column_STOCK_KD);
                  handletraWHSTOCKKD();
                }}>
                  Tồn Kho (KD)
              </button>             
              <button className='tranhatky'  onClick={() => {
                  setisLoading(true);
                  setReadyRender(false);
                  setColumnDefinition(column_STOCK_TACH);
                  handletraWHSTOCKTACH();                 
                }}>
                  Tồn Kho(Tách kho)
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
export default KHOTP