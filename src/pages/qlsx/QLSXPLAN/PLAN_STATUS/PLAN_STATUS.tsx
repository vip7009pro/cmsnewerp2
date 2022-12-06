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
import PLAN_STATUS_COMPONENTS from './PLAN_STATUS_COMPONENTS';

interface SX_DATA {
    PLAN_ID: string,
    G_NAME: string,
    XUATDAO: string,
    SETTING_START_TIME: string,
    MASS_START_TIME: string,
    MASS_END_TIME: string,
    XUATLIEU: string,
    CHOTBC: number,    
}
const PLAN_STATUS = () => { 
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
    <div className='plan_status'>       
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
                handle_loadlichsuinputlieu();
              }}
            >
              Tra lịch sử
            </button>
          </div>
        </div>
        <div className='tracuuYCSXTable'>
          {readyRender && (
            <PLAN_STATUS_COMPONENTS/>
          )}
        </div>
      </div>
    </div>
  );
}
export default PLAN_STATUS