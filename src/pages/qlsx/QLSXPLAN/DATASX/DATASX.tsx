import { Autocomplete,  IconButton,  LinearProgress,TextField } from '@mui/material';
import { DataGrid, GridSelectionModel,GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import moment from 'moment';
import React, { useContext, useEffect, useState, useTransition } from 'react'
import {AiFillFileExcel, AiOutlineCloudUpload, AiOutlinePrinter } from "react-icons/ai";
import Swal from 'sweetalert2';
import { generalQuery } from '../../../../api/Api';
import { UserContext } from '../../../../api/Context';
import { SaveExcel } from '../../../../api/GlobalFunction';
import "./DATASX.scss"

interface SX_DATA {
  PLAN_ID: string,
  PLAN_DATE: string,
  PROD_REQUEST_NO: string,
  G_NAME: string,
  G_NAME_KD: string,
  PLAN_QTY: number,
  PLAN_EQ: string,
  PLAN_FACTORY: string,
  PROCESS_NUMBER: number,
  STEP: number,
  M_NAME: string,
  TOTAL_OUT_QTY: number,
  USED_QTY: number,
  REMAIN_QTY: number,
  PD: number,
  CAVITY: number,
  SETTING_MET: number,
  ESTIMATED_QTY: number,
  KETQUASX: number,
  LOSS_SX: number,
  INS_INPUT: number,
  LOSS_SX_KT: number,
  INS_OUTPUT: number,
  LOSS_KT: number,
  SETTING_START_TIME: string,
  MASS_START_TIME: string,
  MASS_END_TIME: string,
  RPM: number,
  EQ_NAME_TT: string,
  SX_DATE: string,
  WORK_SHIFT: string,
  INS_EMPL: string,
  FACTORY: string,
  BOC_KIEM: number,
  LAY_DO: number,
  MAY_HONG: number,
  DAO_NG: number,
  CHO_LIEU: number,
  CHO_BTP: number,
  HET_LIEU: number,
  LIEU_NG: number,
  CAN_HANG: number,
  HOP_FL: number,
  CHO_QC: number,
  CHOT_BAOCAO: number,
  CHUYEN_CODE: number,
  KHAC: number,
  REMARK: string,
}
interface LICHSUINPUTLIEU_DATA {
    id: string,
    PLAN_ID: string,
    G_NAME: string,
    G_NAME_KD: string,
    M_CODE: string,
    M_NAME: string,
    M_LOT_NO: string,
    WIDTH_CD: number,
    INPUT_QTY: number,
    USED_QTY: number,
    REMAIN_QTY: number,
    EMPL_NO: string,
    EQUIPMENT_CD: string,
    INS_DATE: string,
    PROD_REQUEST_NO: string,
}
const DATASX = () => { 
 const [selectionModel_INPUTSX, setSelectionModel_INPUTSX] = useState<any>([]);
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

  const [prodrequestno,setProdRequestNo] =useState('');
  const [plan_id,setPlanID] =useState('');
  const [alltime, setAllTime] = useState(false); 
  const [id,setID] =useState('');
  const [datasxtable, setDataSXTable] = useState<Array<any>>([]);
  const [sumaryINSPECT, setSummaryInspect] = useState('');
  const [m_name,setM_Name] =useState('');
  const [m_code,setM_Code] =useState('');

  const column_datasx = [
    { field: "PLAN_ID", headerName: "PLAN_ID", minWidth: 120 , flex: 1},
    { field: "PLAN_DATE", headerName: "PLAN_DATE", minWidth: 120 , flex: 1},
    { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", minWidth: 120 , flex: 1},
    { field: "G_NAME", headerName: "G_NAME", minWidth: 120 , flex: 1},
    { field: "G_NAME_KD", headerName: "G_NAME_KD", minWidth: 120 , flex: 1},
    { field: "PLAN_QTY", headerName: "PLAN_QTY", minWidth: 120 , flex: 1},
    { field: "PLAN_EQ", headerName: "PLAN_EQ", minWidth: 120 , flex: 1},
    { field: "PLAN_FACTORY", headerName: "PLAN_FACTORY", minWidth: 120 , flex: 1},
    { field: "PROCESS_NUMBER", headerName: "PROCESS_NUMBER", minWidth: 120 , flex: 1},
    { field: "STEP", headerName: "STEP", minWidth: 120 , flex: 1},
    { field: "M_NAME", headerName: "M_NAME", minWidth: 120 , flex: 1},
    { field: "TOTAL_OUT_QTY", headerName: "TOTAL_OUT_QTY", minWidth: 120 , flex: 1},
    { field: "USED_QTY", headerName: "USED_QTY", minWidth: 120 , flex: 1},
    { field: "REMAIN_QTY", headerName: "REMAIN_QTY", minWidth: 120 , flex: 1},
    { field: "PD", headerName: "PD", minWidth: 120 , flex: 1},
    { field: "CAVITY", headerName: "CAVITY", minWidth: 120 , flex: 1},
    { field: "SETTING_MET", headerName: "SETTING_MET", minWidth: 120 , flex: 1},
    { field: "ESTIMATED_QTY", headerName: "ESTIMATED_QTY", minWidth: 120 , flex: 1},
    { field: "KETQUASX", headerName: "KETQUASX", minWidth: 120 , flex: 1},
    { field: "LOSS_SX", headerName: "LOSS_SX", minWidth: 120 , flex: 1},
    { field: "INS_INPUT", headerName: "INS_INPUT", minWidth: 120 , flex: 1},
    { field: "LOSS_SX_KT", headerName: "LOSS_SX_KT", minWidth: 120 , flex: 1},
    { field: "INS_OUTPUT", headerName: "INS_OUTPUT", minWidth: 120 , flex: 1},
    { field: "LOSS_KT", headerName: "LOSS_KT", minWidth: 120 , flex: 1},
    { field: "SETTING_START_TIME", headerName: "SETTING_START_TIME", minWidth: 120 , flex: 1},
    { field: "MASS_START_TIME", headerName: "MASS_START_TIME", minWidth: 120 , flex: 1},
    { field: "MASS_END_TIME", headerName: "MASS_END_TIME", minWidth: 120 , flex: 1},
    { field: "RPM", headerName: "RPM", minWidth: 120 , flex: 1},
    { field: "EQ_NAME_TT", headerName: "EQ_NAME_TT", minWidth: 120 , flex: 1},
    { field: "SX_DATE", headerName: "SX_DATE", minWidth: 120 , flex: 1},
    { field: "WORK_SHIFT", headerName: "WORK_SHIFT", minWidth: 120 , flex: 1},
    { field: "INS_EMPL", headerName: "INS_EMPL", minWidth: 120 , flex: 1},
    { field: "FACTORY", headerName: "FACTORY", minWidth: 120 , flex: 1},
    { field: "BOC_KIEM", headerName: "BOC_KIEM", minWidth: 120 , flex: 1},
    { field: "LAY_DO", headerName: "LAY_DO", minWidth: 120 , flex: 1},
    { field: "MAY_HONG", headerName: "MAY_HONG", minWidth: 120 , flex: 1},
    { field: "DAO_NG", headerName: "DAO_NG", minWidth: 120 , flex: 1},
    { field: "CHO_LIEU", headerName: "CHO_LIEU", minWidth: 120 , flex: 1},
    { field: "CHO_BTP", headerName: "CHO_BTP", minWidth: 120 , flex: 1},
    { field: "HET_LIEU", headerName: "HET_LIEU", minWidth: 120 , flex: 1},
    { field: "LIEU_NG", headerName: "LIEU_NG", minWidth: 120 , flex: 1},
    { field: "CAN_HANG", headerName: "CAN_HANG", minWidth: 120 , flex: 1},
    { field: "HOP_FL", headerName: "HOP_FL", minWidth: 120 , flex: 1},
    { field: "CHO_QC", headerName: "CHO_QC", minWidth: 120 , flex: 1},
    { field: "CHOT_BAOCAO", headerName: "CHOT_BAOCAO", minWidth: 120 , flex: 1},
    { field: "CHUYEN_CODE", headerName: "CHUYEN_CODE", minWidth: 120 , flex: 1},
    { field: "KHAC", headerName: "KHAC", minWidth: 120 , flex: 1},
    { field: "REMARK", headerName: "REMARK", minWidth: 120 , flex: 1},   

  ];
  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(column_datasx);

  function CustomToolbarLICHSUINPUTSX() {
    return (
      <GridToolbarContainer>      
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(datasxtable, "Data SX Table");
          }}
        >
          <AiFillFileExcel color='green' size={25} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
        <div className="div" style={{fontSize:20, fontWeight:'bold'}}>DATA SẢN XUẤT THEO CHỈ THỊ</div>
      </GridToolbarContainer>
    );
  }
  const handle_loadlichsuinputlieu = ()=>
  {
     generalQuery("loadDataSX", {           
        ALLTIME: alltime,
        FROM_DATE: fromdate,
        TO_DATE: todate,
        PROD_REQUEST_NO: prodrequestno,
        PLAN_ID: plan_id,
        M_NAME: m_name,
        M_CODE: m_code,
        G_NAME: codeKD,
        G_CODE: codeCMS             
    })
    .then((response) => {
      console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        const loaded_data: SX_DATA[] = response.data.data.map((element: SX_DATA, index: number)=> {
          return {
            ...element,   
            PLAN_DATE: moment.utc(element.PLAN_DATE).format('YYYY-MM-DD'),
            SETTING_START_TIME: element.SETTING_START_TIME === null ? '' : moment.utc(element.SETTING_START_TIME).format('YYYY-MM-DD HH:mm:ss'),
            MASS_START_TIME: element.MASS_START_TIME === null ? '' : moment.utc(element.MASS_START_TIME).format('YYYY-MM-DD HH:mm:ss'),
            MASS_END_TIME: element.MASS_END_TIME === null ? '' : moment.utc(element.MASS_END_TIME).format('YYYY-MM-DD HH:mm:ss'),
            SX_DATE: element.SX_DATE === null ? '' :  moment.utc(element.SX_DATE).format('YYYY-MM-DD'),
            id: index
          }
        })
        setDataSXTable(loaded_data); 
        setReadyRender(true); 
        setisLoading(false);      
      } else {     
          
      }
    })
    .catch((error) => {
      console.log(error);
    });     
  }

  useEffect(()=>{      
    //setColumnDefinition(column_inspect_output);
  },[]);
  return (
    <div className='lichsuinputlieu'>
       <div className="section_title" style={{fontWeight:'bold', fontSize: 30}}>
            TRA CỨU LỊCH SỬ INPUT LIỆU
        </div>
      <div className='tracuuDataInspection'>
        <div className='tracuuDataInspectionform'>
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
                <b>Số YCSX:</b>{" "}
                <input
                  type='text'
                  placeholder='1F80008'
                  value={prodrequestno}
                  onChange={(e) => setProdRequestNo(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Số chỉ thị:</b>{" "}
                <input
                  type='text'
                  placeholder='A123456'
                  value={plan_id}
                  onChange={(e) => setPlanID(e.target.value)}
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
            <button
              className='tranhatky'
              onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_datasx);
                handle_loadlichsuinputlieu();
              }}
            >
              Tra lịch sử
            </button>
          </div>
        </div>
        <div className='tracuuYCSXTable'>
          {readyRender && (
            <DataGrid
            sx={{ fontSize: 12, flex: 1 }}
            components={{
              Toolbar: CustomToolbarLICHSUINPUTSX,
              LoadingOverlay: LinearProgress,
            }}
            getRowId={(row) => row.id}
            loading={isLoading}
            rowHeight={30}
            rows={datasxtable}
            columns={column_datasx}
            rowsPerPageOptions={[
              5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
            ]} 
          />
          )}
        </div>
      </div>
    </div>
  );
}
export default DATASX