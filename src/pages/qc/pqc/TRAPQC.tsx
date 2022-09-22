import { Autocomplete,  IconButton,  LinearProgress,TextField } from '@mui/material';
import { DataGrid, GridSelectionModel,GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import moment from 'moment';
import React, { useContext, useEffect, useState, useTransition } from 'react'
import {AiFillFileExcel, AiOutlineCloudUpload, AiOutlinePrinter } from "react-icons/ai";
import Swal from 'sweetalert2';
import { generalQuery } from '../../../api/Api';
import { UserContext } from '../../../api/Context';
import { SaveExcel } from '../../../api/GlobalFunction';
import "./TRAPQC.scss"

interface PQC1_DATA {
    PQC1_ID: string,
    YEAR_WEEK: string,
    PROD_REQUEST_NO: string,
    PROD_REQUEST_QTY: number,
    PROD_REQUEST_DATE: string,
    PROCESS_LOT_NO: string,
    G_NAME: string,
    G_NAME_KD: string,
    LINEQC_PIC: string,
    PROD_PIC: string,
    PROD_LEADER: string,
    LINE_NO: number,
    STEPS: string,
    CAVITY: number,
    SETTING_OK_TIME: string,
    FACTORY: string,
    INSPECT_SAMPLE_QTY: number,
    PROD_LAST_PRICE: number,
    SAMPLE_AMOUNT: number,
    REMARK: string,
    INS_DATE: string,
    UPD_DATE: string,    
}
interface PQC3_DATA {
    YEAR_WEEK: string,
    PQC3_ID: number,
    PQC1_ID: number,
    FACTORY: string,
    PROD_REQUEST_NO: string,
    PROD_REQUEST_DATE: string,
    PROCESS_LOT_NO: string,
    G_CODE: string,
    G_NAME: string,
    G_NAME_KD: string,
    PROD_LAST_PRICE: number,
    LINEQC_PIC: string,
    PROD_PIC: string,
    PROD_LEADER: string,
    LINE_NO: number,
    OCCURR_TIME: string,
    INSPECT_QTY: number,
    DEFECT_QTY: number,
    DEFECT_AMOUNT: number,
    DEFECT_PHENOMENON: string,
    DEFECT_IMAGE_LINK: string,
    REMARK: string,
    WORST5: string,
    WORST5_MONTH: string,
    
}
interface DAO_FILM_DATA {
  PIC_KD: string,
  CUST_NAME_KD: string,
  G_CODE: string,
  G_NAME: string,
  G_NAME_KD: string,
  PROD_REQUEST_NO: string,
  PROD_REQUEST_DATE: string,
  PROD_REQUEST_QTY: number,
  LOT_TOTAL_INPUT_QTY_EA: number,
  LOT_TOTAL_OUTPUT_QTY_EA: number,
  DA_KIEM_TRA: number,
  OK_QTY: number,
  LOSS_NG_QTY: number,
  INSPECT_BALANCE: number,

}
interface CNDB_DATA  {
  INSPECT_ID: number,
  YEAR_WEEK: string,
  CUST_NAME_KD: string,
  PROD_REQUEST_NO: string,
  G_NAME_KD: string,
  G_NAME: string,
  G_CODE: string,
  PROD_TYPE: string,
  M_LOT_NO: string,
  M_NAME: string,
  WIDTH_CD: number,
  INSPECTOR: string,
  LINEQC: string,
  PROD_PIC: string,
  UNIT: string,
  PROCESS_LOT_NO: string,
  PROCESS_IN_DATE: string,
  INSPECT_DATETIME: string,
  INSPECT_START_TIME: string,
  INSPECT_FINISH_TIME: string,
  FACTORY: string,
  LINEQC_PIC: string,
  MACHINE_NO: number,
  INSPECT_TOTAL_QTY: number,
  INSPECT_OK_QTY: number,
  INSPECT_SPEED: number,
  INSPECT_TOTAL_LOSS_QTY: number,
  INSPECT_TOTAL_NG_QTY: number,
  MATERIAL_NG_QTY: number,
  PROCESS_NG_QTY: number,
  PROD_PRICE: number,
  ERR1: number,
  ERR2: number,
  ERR3: number,
  ERR4: number,
  ERR5: number,
  ERR6: number,
  ERR7: number,
  ERR8: number,
  ERR9: number,
  ERR10: number,
  ERR11: number,
  ERR12: number,
  ERR13: number,
  ERR14: number,
  ERR15: number,
  ERR16: number,
  ERR17: number,
  ERR18: number,
  ERR19: number,
  ERR20: number,
  ERR21: number,
  ERR22: number,
  ERR23: number,
  ERR24: number,
  ERR25: number,
  ERR26: number,
  ERR27: number,
  ERR28: number,
  ERR29: number,
  ERR30: number,
  ERR31: number,
  ERR32: number,
  CNDB_ENCODES: string,
}

const TRAPQC = () => { 
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
  const [empl_name,setEmpl_Name] =useState('');
  const [cust_name,setCustName] =useState('');
  const [process_lot_no,setProcess_Lot_No] =useState('');
  const [prod_type,setProdType] =useState('');
  const [prodrequestno,setProdRequestNo] =useState('');
  const [alltime, setAllTime] = useState(false); 
  const [id,setID] =useState('');
  const [factory,setFactory] =useState('All');
  const [pqcdatatable, setPqcDataTable] = useState<Array<any>>([]);
  const [sumaryINSPECT, setSummaryInspect] = useState('');

  const column_pqc1_data = [
    { field: "PQC1_ID", headerName: "PQC1_ID", width: 80 },
    { field: "YEAR_WEEK", headerName: "YEAR_WEEK", width: 80 },
    { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", width: 80 },
    { field: "PROD_REQUEST_QTY", headerName: "PROD_REQUEST_QTY", width: 80 },
    { field: "PROD_REQUEST_DATE", headerName: "PROD_REQUEST_DATE", width: 80 },
    { field: "PROCESS_LOT_NO", headerName: "PROCESS_LOT_NO", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 250 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    { field: "LINEQC_PIC", headerName: "LINEQC_PIC", width: 80 },
    { field: "PROD_PIC", headerName: "PROD_PIC", width: 80 },
    { field: "PROD_LEADER", headerName: "PROD_LEADER", width: 80 },
    { field: "LINE_NO", headerName: "LINE_NO", width: 80 },
    { field: "STEPS", headerName: "STEPS", width: 80 },
    { field: "CAVITY", headerName: "CAVITY", width: 80 },
    { field: "SETTING_OK_TIME", type:'date',headerName: "SETTING_OK_TIME", width: 180, renderCell: (params:any) => {return <span style={{color:'blue'}}>{moment.utc(params.row.SETTING_OK_TIME).format("YYYY-MM-DD HH:mm:ss")}</span>} },
    { field: "FACTORY", headerName: "FACTORY", width: 80 },
    { field: "INSPECT_SAMPLE_QTY", headerName: "SAMPLE_QTY", width: 100 },
    { field: "PROD_LAST_PRICE", headerName: "PRICE", width: 80 },
    { field: "SAMPLE_AMOUNT", headerName: "SAMPLE_AMOUNT", width: 80 , renderCell: (params:any) => {return <span style={{color:'gray'}}><b>{params.row.SAMPLE_AMOUNT.toLocaleString('en-US' ,{style:'decimal',maximumFractionDigits:8})}</b></span>}},
    { field: "REMARK", headerName: "REMARK", width: 80 },
    { field: "INS_DATE", type:'date', headerName: "INS_DATE", width: 180, renderCell: (params:any) => {return <span style={{color:'blue'}}>{moment.utc(params.row.INS_DATE).format("YYYY-MM-DD HH:mm:ss")}</span>} },
    { field: "UPD_DATE", type:'date', headerName: "UPD_DATE", width: 180, renderCell: (params:any) => {return <span style={{color:'blue'}}>{moment.utc(params.row.UPD_DATE).format("YYYY-MM-DD HH:mm:ss")}</span>} },

  ]
  const column_pqc3_data = [
    { field: "YEAR_WEEK", headerName: "YEAR_WEEK", width: 80 },
    { field: "PQC3_ID", headerName: "PQC3_ID", width: 80 },
    { field: "PQC1_ID", headerName: "PQC1_ID", width: 80 },
    { field: "FACTORY", headerName: "FACTORY", width: 80 },
    { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", width: 80 },
    { field: "PROD_REQUEST_DATE", headerName: "PROD_REQUEST_DATE", width: 80 },
    { field: "PROCESS_LOT_NO", headerName: "PROCESS_LOT_NO", width: 80 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 250 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    { field: "PROD_LAST_PRICE", headerName: "PROD_LAST_PRICE", width: 80 },
    { field: "LINEQC_PIC", headerName: "LINEQC_PIC", width: 80 },
    { field: "PROD_PIC", headerName: "PROD_PIC", width: 80 },
    { field: "PROD_LEADER", headerName: "PROD_LEADER", width: 80 },
    { field: "LINE_NO", headerName: "LINE_NO", width: 80 },
    { field: "OCCURR_TIME", type: 'date', headerName: "OCCURR_TIME", width: 180 },
    { field: "INSPECT_QTY", type:'number', headerName: "SL KT", width: 80 },
    { field: "DEFECT_QTY", type:'number',headerName: "SL NG", width: 80 },
    { field: "DEFECT_AMOUNT", type:'number',headerName: "DEFECT_AMOUNT", width: 120 },
    { field: "DEFECT_PHENOMENON", headerName: "HIEN TUONG", width: 150 },
    { field: "DEFECT_IMAGE_LINK", headerName: "IMAGE LINK", width: 80, renderCell: (params:any) => {return <span style={{color:'blue'}}><a target='_blank' rel='noopener noreferrer' href={params.row.DEFECT_IMAGE_LINK}>
    LINK
  </a></span>}  },
    { field: "REMARK", headerName: "REMARK", width: 120 },
    { field: "WORST5", headerName: "WORST5", width: 80 },
    { field: "WORST5_MONTH", headerName: "WORST5_MONTH", width: 80 },  

  ]
  const column_daofilm_data = [
    { field: "PIC_KD", headerName: "PIC_KD", width: 150 },
    { field: "CUST_NAME_KD", headerName: "Khách", width: 120 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 180 },
    { field: "G_NAME_KD", headerName: "Code KD", width: 120 },
    { field: "PROD_REQUEST_NO", headerName: "Số YC", width: 80 },
    { field: "PROD_REQUEST_DATE", headerName: "Ngày YC", width: 80 },
    { field: "PROD_REQUEST_QTY", headerName: "SL YC", width: 80  , renderCell: (params:any) => {return <span style={{color:'black'}}><b>{params.row.PROD_REQUEST_QTY.toLocaleString('en-US')}</b></span>}},
    { field: "LOT_TOTAL_INPUT_QTY_EA", headerName: "Nhập EA", width: 80  , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.LOT_TOTAL_INPUT_QTY_EA.toLocaleString('en-US')}</b></span>}},
    { field: "LOT_TOTAL_OUTPUT_QTY_EA", headerName: "Xuất EA", width: 80  , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.LOT_TOTAL_OUTPUT_QTY_EA.toLocaleString('en-US')}</b></span>}},
    { field: "DA_KIEM_TRA", headerName: "Đã Kiểm", width: 80  , renderCell: (params:any) => {return <span style={{color:'gray'}}><b>{params.row.DA_KIEM_TRA.toLocaleString('en-US')}</b></span>}},
    { field: "OK_QTY", headerName: "OK_QTY", width: 80 , renderCell: (params:any) => {return <span style={{color:'green'}}><b>{params.row.OK_QTY.toLocaleString('en-US')}</b></span>} },
    { field: "LOSS_NG_QTY", headerName: "Loss và NG", width: 80 , renderCell: (params:any) => {return <span style={{color:'red'}}><b>{params.row.LOSS_NG_QTY.toLocaleString('en-US')}</b></span>} },
    { field: "INSPECT_BALANCE", headerName: "Tồn kiểm", width: 80  , renderCell: (params:any) => {return <span style={{color:'purple'}}><b>{params.row.INSPECT_BALANCE.toLocaleString('en-US')}</b></span>}}, 

  ]

  const column_cndb_data = [
    { field: "INSPECT_ID", headerName: "INSPECT_ID", width: 80 },
    { field: "YEAR_WEEK", headerName: "YEAR_WEEK", width: 80 },
    { field: "CUST_NAME_KD", headerName: "Khách", width: 120 },
    { field: "PROD_REQUEST_NO", headerName: "Số YC", width: 80 },
    { field: "G_NAME_KD", headerName: "Code KD", width: 110 },
    { field: "G_NAME", headerName: "Code full", width: 150 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 80 },
    { field: "M_LOT_NO", headerName: "LOT VL", width: 80 },
    { field: "M_NAME", headerName: "M_NAME", width: 120 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 80 },
    { field: "INSPECTOR", headerName: "INSPECTOR", width: 80 },
    { field: "LINEQC", headerName: "LINEQC", width: 80 },
    { field: "PROD_PIC", headerName: "PROD_PIC", width: 80 },
    { field: "UNIT", headerName: "UNIT", width: 80 },
    { field: "PROCESS_LOT_NO", headerName: "LOT SX", width: 80 },
    { field: "PROCESS_IN_DATE", headerName: "NGÀY SX", width: 120 },
    { field: "INSPECT_DATETIME", headerName: "Ngày kiểm", width: 150 },
    { field: "INSPECT_START_TIME", headerName: "INSPECT_START_TIME", width: 150 },
    { field: "INSPECT_FINISH_TIME", headerName: "INSPECT_FINISH_TIME", width: 150 },
    { field: "FACTORY", headerName: "FACTORY", width: 80 },
    { field: "LINEQC_PIC", headerName: "LINEQC_PIC", width: 80 },
    { field: "MACHINE_NO", headerName: "MACHINE_NO", width: 80 },
    { field: "INSPECT_TOTAL_QTY", headerName: "Tổng Kiểm", width: 80 },
    { field: "INSPECT_OK_QTY", headerName: "Tổng OK", width: 80 },
    { field: "INSPECT_SPEED", headerName: "Tốc độ kiểm", width: 80 },
    { field: "INSPECT_TOTAL_LOSS_QTY", headerName: "Tổng Loss", width: 80 },
    { field: "INSPECT_TOTAL_NG_QTY", headerName: "Tông NG", width: 80 },
    { field: "MATERIAL_NG_QTY", headerName: "NG MATERIAL", width: 100 },
    { field: "PROCESS_NG_QTY", headerName: "NG PROCESS", width: 100 },
    { field: "PROD_PRICE", headerName: "PROD_PRICE", width: 100 },
    { field: "ERR1", headerName: "ERR1", width: 80 },
    { field: "ERR2", headerName: "ERR2", width: 80 },
    { field: "ERR3", headerName: "ERR3", width: 80 },
    { field: "ERR4", headerName: "ERR4", width: 80 },
    { field: "ERR5", headerName: "ERR5", width: 80 },
    { field: "ERR6", headerName: "ERR6", width: 80 },
    { field: "ERR7", headerName: "ERR7", width: 80 },
    { field: "ERR8", headerName: "ERR8", width: 80 },
    { field: "ERR9", headerName: "ERR9", width: 80 },
    { field: "ERR10", headerName: "ERR10", width: 80 },
    { field: "ERR11", headerName: "ERR11", width: 80 },
    { field: "ERR12", headerName: "ERR12", width: 80 },
    { field: "ERR13", headerName: "ERR13", width: 80 },
    { field: "ERR14", headerName: "ERR14", width: 80 },
    { field: "ERR15", headerName: "ERR15", width: 80 },
    { field: "ERR16", headerName: "ERR16", width: 80 },
    { field: "ERR17", headerName: "ERR17", width: 80 },
    { field: "ERR18", headerName: "ERR18", width: 80 },
    { field: "ERR19", headerName: "ERR19", width: 80 },
    { field: "ERR20", headerName: "ERR20", width: 80 },
    { field: "ERR21", headerName: "ERR21", width: 80 },
    { field: "ERR22", headerName: "ERR22", width: 80 },
    { field: "ERR23", headerName: "ERR23", width: 80 },
    { field: "ERR24", headerName: "ERR24", width: 80 },
    { field: "ERR25", headerName: "ERR25", width: 80 },
    { field: "ERR26", headerName: "ERR26", width: 80 },
    { field: "ERR27", headerName: "ERR27", width: 80 },
    { field: "ERR28", headerName: "ERR28", width: 80 },
    { field: "ERR29", headerName: "ERR29", width: 80 },
    { field: "ERR30", headerName: "ERR30", width: 80 },
    { field: "ERR31", headerName: "ERR31", width: 80 },
    { field: "ERR32", headerName: "ERR32", width: 80 },
    { field: "CNDB_ENCODES", headerName: "CNDB_ENCODES", width: 150 },
   
    
  ]

  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(column_pqc1_data);



  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>      
        <IconButton className='buttonIcon'onClick={()=>{SaveExcel(pqcdatatable,"Inspection Data Table")}}
        ><AiFillFileExcel color='green' size={25}/>SAVE</IconButton>
        <span style={{fontWeight:'bold', fontSize: 18, paddingLeft:20, color: 'blue'}}>{sumaryINSPECT}</span>
       </GridToolbarContainer>
    );
  }

  const handletraInspectionInput = ()=> {    
    setisLoading(true);
    let summaryInput:number =0;

    generalQuery('trapqc1data',{      
      ALLTIME: alltime,      
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      PROCESS_LOT_NO: process_lot_no,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name, 
      PROD_REQUEST_NO: prodrequestno,
      ID: id,
      FACTORY: factory
    })
    .then(response => {
        //console.log(response.data.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: PQC1_DATA[] =  response.data.data.map((element:PQC1_DATA,index: number)=> {
            //summaryInput += element.INPUT_QTY_EA;
            return {
              ...element, 
              PROD_DATETIME: moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
              INPUT_DATETIME: moment.utc(element.UPD_DATE).format("YYYY-MM-DD HH:mm:ss"), 
              id: index
            }
          })     
          //setSummaryInspect('Tổng Nhập: ' +  summaryInput.toLocaleString('en-US') + 'EA');    
          setPqcDataTable(loadeddata);
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
  const handletraInspectionOutput = ()=> { 
    let summaryOutput:number = 0;  
    setisLoading(true);
    generalQuery('trapqc3data',{      
      ALLTIME: alltime,      
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      PROCESS_LOT_NO: process_lot_no,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name, 
      PROD_REQUEST_NO: prodrequestno,
      ID: id,
      FACTORY: factory
    })
    .then(response => {
        //console.log(response.data.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: PQC3_DATA[] =  response.data.data.map((element:PQC3_DATA,index: number)=> {
            //summaryOutput += element.OUTPUT_QTY_EA;
            return {
              ...element,              
              OCCURR_TIME: moment.utc(element.OCCURR_TIME).format("YYYY-MM-DD HH:mm:ss"),
              id: index              
            }
          })         
          //setSummaryInspect('Tổng Xuất: ' +  summaryOutput.toLocaleString('en-US') + 'EA');    
          setPqcDataTable(loadeddata);
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
  const handletraInspectionNG = ()=> {   
    setSummaryInspect('');
    setisLoading(true);
    generalQuery('get_inspection',{
      OPTIONS: 'Nhật Ký Kiểm Tra',
      ALLTIME: alltime,      
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      process_lot_no: process_lot_no,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name, 
      PROD_REQUEST_NO: prodrequestno,
    })
    .then(response => {
        //console.log(response.data.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: CNDB_DATA[] =  response.data.data.map((element:CNDB_DATA,index: number)=> {
            return {
              ...element, 
              INSPECT_DATETIME: moment(element.INSPECT_DATETIME).format("YYYY-MM-DD HH:mm:ss"),
              INSPECT_START_TIME: moment(element.INSPECT_START_TIME).format("YYYY-MM-DD HH:mm:ss"),
              INSPECT_FINISH_TIME: moment(element.INSPECT_FINISH_TIME).format("YYYY-MM-DD HH:mm:ss"),
              id: index
            }
          })         
          setPqcDataTable(loadeddata);
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
  const handletraInspectionInOut = ()=> {   
    setSummaryInspect('');
    setisLoading(true);
    generalQuery('get_inspection',{
      OPTIONS: 'Nhập Xuất Kiểm (YCSX)',
      ALLTIME: alltime,      
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      process_lot_no: process_lot_no,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name, 
      PROD_REQUEST_NO: prodrequestno,
    })
    .then(response => {
        //console.log(response.data.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: DAO_FILM_DATA[] =  response.data.data.map((element:DAO_FILM_DATA,index: number)=> {
            return {
              ...element, 
              id: index
            }
          })         
          setPqcDataTable(loadeddata);
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
    //setColumnDefinition(column_pqc3_data);
  },[]);
  return (
    <div className='trapqc'>
        <div className='tracuuDataPqc'>
          <div className='tracuuDataPQCform'>
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
                  <b>Tên nhân viên:</b>{" "}
                  <input
                    type='text'
                    placeholder='Ten Line QC'
                    value={empl_name}
                    onChange={(e) => setEmpl_Name(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Nhà máy:</b>
                  <select
                    name='phanloai'
                    value={factory}
                    onChange={(e) => {
                      setFactory(e.target.value);
                    }}
                  >
                    <option value='All'>All</option>
                    <option value='NM1'>NM1</option>
                    <option value='NM2'>NM2</option>                   
                  </select>
                </label>
              </div>
              <div className='forminputcolumn'>
                <label>
                  <b>Loại sản phẩm:</b>{" "}
                  <input
                    type='text'
                    placeholder='TSP'
                    value={prod_type}
                    onChange={(e) => setProdType(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Số YCSX:</b>{" "}
                  <input
                    type='text'
                    placeholder='1H23456'
                    value={prodrequestno}
                    onChange={(e) => setProdRequestNo(e.target.value)}
                  ></input>
                </label>
              </div>                    
              <div className='forminputcolumn'>
                <label>
                  <b>LOT SX:</b>{" "}
                  <input
                    type='text'
                    placeholder='ED2H3076'
                    value={process_lot_no}
                    onChange={(e) => setProcess_Lot_No(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>ID:</b>{" "}
                  <input
                    type='text'
                    placeholder='12345'
                    value={id}
                    onChange={(e) => setID(e.target.value)}
                  ></input>
                </label>
              </div>                    
            </div>
            <div className='formbutton'>
              <label>
                <b>All Time:</b>
                <input
                  type='checkbox'
                  name='alltimecheckbox'
                  defaultChecked={alltime}
                  onChange={() => setAllTime(!alltime)}
                ></input>
              </label>
              <button className='pqc1button'  onClick={() => {
                  setisLoading(true);
                  setReadyRender(false);
                  setColumnDefinition(column_pqc1_data);
                  handletraInspectionInput();                  
                }}>
                  PQC1-Setting
              </button>             
              <button className='pqc3button'  onClick={() => {
                  setisLoading(true);
                setReadyRender(false);
                 setColumnDefinition(column_pqc3_data);
                  handletraInspectionOutput();
                }}>
                  PQC3-Defect
              </button>             
              <button className='daofilmbutton'  onClick={() => {
                  setisLoading(true);
                  setReadyRender(false);
                  setColumnDefinition(column_daofilm_data);
                  handletraInspectionInOut();
                }}>
                  Dao-film-TL
              </button>             
              <button className='lichsucndbbutton'  onClick={() => {
                  setisLoading(true);
                  setReadyRender(false);
                  setColumnDefinition(column_cndb_data);
                  handletraInspectionNG();
                }}>
                  LS CNĐB
              </button>             
            </div>
          </div>
          <div className='tracuuPQCTable'>
            {readyRender && <DataGrid
              sx={{ fontSize: 12, flex: 1 }}
              components={{
                Toolbar: CustomToolbarPOTable,
                LoadingOverlay: LinearProgress,
              }}
              loading={isLoading}
              rowHeight={30}
              rows={pqcdatatable}
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
export default TRAPQC