import { Autocomplete,  IconButton,  LinearProgress,TextField } from '@mui/material';
import { DataGrid, GridSelectionModel,GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import moment from 'moment';
import React, { useContext, useEffect, useState, useTransition } from 'react'
import {AiFillFileExcel, AiOutlineCloudUpload, AiOutlinePrinter } from "react-icons/ai";
import Swal from 'sweetalert2';
import { generalQuery } from '../../../../api/Api';
import { UserContext } from '../../../../api/Context';
import { SaveExcel } from '../../../../api/GlobalFunction';

import "./LICHSUINPUTLIEU.scss"


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

const LICHSUINPUTLIEU = () => { 
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
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<any>>([]);
  const [sumaryINSPECT, setSummaryInspect] = useState('');
  const [m_name,setM_Name] =useState('');
  const [m_code,setM_Code] =useState('');

  const column_lichsuinputlieusanxuat = [
    { field: "PROD_REQUEST_NO", headerName: "YCSX NO", minwidth: 80, flex:1},   
    { field: "PLAN_ID", headerName: "PLAN_ID", minwidth: 80, flex:1},   
    { field: "G_CODE", headerName: "G_CODE", minwidth: 80, flex:1},   
    { field: "G_NAME_KD", headerName: "G_NAME_KD", minwidth: 80, flex:1},   
    { field: "M_CODE", headerName: "M_CODE", minwidth: 80, flex:1 },
    { field: "M_NAME", headerName: "M_NAME", minwidth: 150, flex:2 },
    { field: "WIDTH_CD", headerName: "SIZE", minwidth: 40, flex:1 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", minwidth: 90, flex:1 },
    { field: "INPUT_QTY", headerName: "INPUT_QTY", minwidth: 120, flex:1 },
    { field: "USED_QTY", headerName: "USED_QTY", minwidth: 80, flex:1 },
    { field: "REMAIN_QTY", headerName: "REMAIN_QTY", minwidth: 90, flex:1 },
    { field: "EMPL_NO", headerName: "EMPL_NO", minwidth: 80, flex:1 },
    { field: "EQUIPMENT_CD", headerName: "MAY", minwidth: 40, flex:1 },
    { field: "INS_DATE", headerName: "INS_DATE", minwidth: 150, flex:1 },
  ];
  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(column_lichsuinputlieusanxuat);

  function CustomToolbarLICHSUINPUTSX() {
    return (
      <GridToolbarContainer>      
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(inspectiondatatable, "LICHSU INPUT Table");
          }}
        >
          <AiFillFileExcel color='green' size={25} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
        <div className="div" style={{fontSize:20, fontWeight:'bold'}}>Lịch sử input liệu sản xuất</div>
      </GridToolbarContainer>
    );
  }
  const handle_loadlichsuinputlieu = ()=>
  {
     generalQuery("lichsuinputlieusanxuat_full", {           
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
        const loaded_data: LICHSUINPUTLIEU_DATA[] = response.data.data.map((element: LICHSUINPUTLIEU_DATA, index: number)=> {
          return {
            ...element,
            INS_DATE: moment(element.INS_DATE).utc().format('YYYY-MM-DD HH:mm:ss'),
            id: index
          }
        })
        setInspectionDataTable(loaded_data); 
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
                setColumnDefinition(column_lichsuinputlieusanxuat);
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
            rows={inspectiondatatable}
            columns={column_lichsuinputlieusanxuat}
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
export default LICHSUINPUTLIEU