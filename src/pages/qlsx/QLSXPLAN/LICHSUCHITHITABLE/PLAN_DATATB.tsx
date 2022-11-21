import { Autocomplete,  IconButton,  LinearProgress,TextField } from '@mui/material';
import { DataGrid, GridSelectionModel,GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import moment from 'moment';
import React, { useContext, useEffect, useState, useTransition } from 'react'
import {AiFillFileExcel, AiOutlineCloudUpload, AiOutlinePrinter } from "react-icons/ai";
import Swal from 'sweetalert2';
import { generalQuery } from '../../../../api/Api';
import { UserContext } from '../../../../api/Context';
import { SaveExcel } from '../../../../api/GlobalFunction';

import "./PLAN_DATATB.scss"

interface QLSXPLANDATA {
    id: number,
    PLAN_ID: string;
    PLAN_DATE: string;
    PROD_REQUEST_NO: string;
    PLAN_QTY: number;
    PLAN_EQ: string;
    PLAN_FACTORY: string;
    PLAN_LEADTIME: number;
    INS_EMPL: string;
    INS_DATE: string;
    UPD_EMPL: string;
    UPD_DATE: string;
    G_CODE: string;
    G_NAME: string;
    G_NAME_KD: string;
    PROD_REQUEST_DATE: string;
    PROD_REQUEST_QTY: number;
    STEP: string;
    PLAN_ORDER: string;
    PROCESS_NUMBER: number;
    KQ_SX_TAM: number;
    KETQUASX: number;
    CD1: number;
    CD2: number;
    TON_CD1: number;
    TON_CD2: number;
    FACTORY: string,
    EQ1: string,
    EQ2: string,
    Setting1: number,
    Setting2: number,
    UPH1: number,
    UPH2: number,
    Step1: number,
    Step2: number,
    LOSS_SX1: number,
    LOSS_SX2: number,
    LOSS_SETTING1: number,
    LOSS_SETTING2: number,
    NOTE: string
  }

const PLAN_DATATB = () => { 
 const [selectionModel_INPUTSX, setSelectionModel_INPUTSX] = useState<any>([]);
  const [readyRender, setReadyRender] = useState(false);
  const [userData, setUserData] = useContext(UserContext);
  const [isLoading, setisLoading] = useState(false);  
  const [fromdate, setFromDate] = useState(moment().format('YYYY-MM-DD'));
  const [plandatatable, setPlanDataTable] = useState<QLSXPLANDATA[]>([]);


  const column_plandatatable =[
    { field: "PLAN_FACTORY", headerName: "FACTORY", width: 80, editable: false },
    { field: "PLAN_DATE", headerName: "PLAN_DATE", width: 110, editable: false },
    { field: "PROD_REQUEST_NO", headerName: "YCSX NO", width: 80, editable: false },
    { field: "PROD_REQUEST_DATE", headerName: "YCSX DATE", width: 80, editable: false },
    { field: "PLAN_ID", headerName: "PLAN_ID", width: 90 , editable: false, resizeable: true},   
    { field: "G_CODE", headerName: "G_CODE", width: 100, editable: false },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 180, editable: false, renderCell: (params: any) => {           
      if(params.row.FACTORY === null || params.row.EQ1 === null || params.row.EQ2 === null || params.row.Setting1 === null || params.row.Setting2 === null || params.row.UPH1 === null ||  params.row.UPH2 === null || params.row.Step1 === null || params.row.Step1 === null || params.row.LOSS_SX1 === null || params.row.LOSS_SX2 === null || params.row.LOSS_SETTING1 === null ||  params.row.LOSS_SETTING2 === null)
      return <span style={{color: 'red'}}>{params.row.G_NAME_KD}</span>
      return <span style={{color: 'green'}}>{params.row.G_NAME_KD}</span>    
 }  },
    { field: "PROD_REQUEST_QTY", headerName: "YCSX QTY", width: 80, editable: false , renderCell: (params: any) => {
           
        return <span style={{color: 'blue'}}>{params.row.PROD_REQUEST_QTY.toLocaleString('en','US')}</span>      
   } },
   { field: "EQ1", headerName: "EQ1", width: 30, editable: false },
   { field: "EQ2", headerName: "EQ2", width: 30, editable: false },
    { field: "CD1", headerName: "KQ_CD1", width: 80, editable: false , renderCell: (params: any) => {           
        return <span style={{color: 'blue'}}>{params.row.CD1.toLocaleString('en','US')}</span>      
   } },
    { field: "CD2", headerName: "KQ_CD2", width: 80, editable: false , renderCell: (params: any) => {
           
        return <span style={{color: 'blue'}}>{params.row.CD2.toLocaleString('en','US')}</span>
      
   } },
    { field: "TON_CD1", headerName: "TONYCSX_CD1", width: 120, editable: false , renderCell: (params: any) => {
           
        return <span style={{color: 'blue'}}>{params.row.TON_CD1.toLocaleString('en','US')}</span>
      
   } },
    { field: "TON_CD2", headerName: "TONYCSX_CD2", width: 120, editable: false , renderCell: (params: any) => {
           
        return <span style={{color: 'blue'}}>{params.row.TON_CD2.toLocaleString('en','US')}</span>
      
   } },
    { field: "PLAN_QTY", headerName: "PLAN_QTY", width: 80, renderCell: (params: any) => {
        if(params.row.PLAN_QTY ===0)
        {
          return <span style={{color: 'red'}}>NG</span>
        }
        else
        {
          return <span style={{color: 'green'}}>{params.row.PLAN_QTY.toLocaleString('en','US')}</span>
        }
     }  },
    { field: "PROCESS_NUMBER", headerName: "PROCESS_NUMBER", width: 110,   renderCell: (params: any) => {
      if(params.row.PROCESS_NUMBER ===null || params.row.PROCESS_NUMBER ===0 )
      {
        return <span style={{color: 'red'}}>NG</span>
      }
      else
      {
        return <span style={{color: 'green'}}>{params.row.PROCESS_NUMBER}</span>
      }
   } },
    { field: "STEP", headerName: "STEP", width: 60,  },
    { field: "PLAN_ORDER", headerName: "PLAN_ORDER", width: 110,  },
    { field: "KETQUASX", headerName: "KETQUASX", width: 110,   renderCell: (params: any)=> {
      if(params.row.KETQUASX !== null)
      {
        return <span>{params.row.KETQUASX.toLocaleString('en-US')}</span>
      }
      else
      {
        return <span>0</span>
      }
    }},
    { field: "KQ_SX_TAM", headerName: "KETQUASX_TAM", width: 120, renderCell: (params: any)=> {
      if(params.row.KQ_SX_TAM !== null)
      {
        return <span>{params.row.KQ_SX_TAM.toLocaleString('en-US')}</span>
      }
      else
      {
        return <span>0</span>
      }
    }},
    { field: "PLAN_EQ", headerName: "PLAN_EQ", width: 80,  },
  
    { field: "INS_EMPL", headerName: "INS_EMPL", width: 120, editable: false, hide: false  },
    { field: "INS_DATE", headerName: "INS_DATE", width: 120, editable: false, hide: true  },
    { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 120, editable: false , hide: true },
    { field: "UPD_DATE", headerName: "UPD_DATE", width: 120, editable: false, hide: true  },   
  ];

  function CustomToolbarLICHSUINPUTSX() {
    return (
      <GridToolbarContainer>      
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(plandatatable, "PLAN Table");
          }}
        >
          <AiFillFileExcel color='green' size={25} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
        <div className="div" style={{fontSize:20, fontWeight:'bold'}}>BẢNG PLAN THEO NGÀY</div>
      </GridToolbarContainer>
    );
  }

  const loadQLSXPlan = (plan_date: string) => {
    //console.log(selectedPlanDate);
    generalQuery("getqlsxplan", { PLAN_DATE: plan_date })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: QLSXPLANDATA, index: number) => {
              return {
                ...element,
                PLAN_DATE: moment.utc(element.PLAN_DATE).format('YYYY-MM-DD'),
                id: index,
              };
            }
          );
          //console.log(loadeddata);
          setPlanDataTable(loadeddata);
          setReadyRender(true);
          setisLoading(false);
        } else {
          setPlanDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(()=>{      
    //setColumnDefinition(column_inspect_output);
  },[]);
  return (
    <div className='lichsuplanTable'>
        <div className="section_title" style={{fontWeight:'bold', fontSize: 30}}>
            TRA CỨU PLAN THEO NGÀY
        </div>
      <div className='tracuuDataInspection'>
        <div className='tracuuDataInspectionform'>
          <div className='forminput'>
            <div className='forminputcolumn'>
              <label>
                <b>PLAN DATE</b>
                <input
                  type='date'
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>              
            </div>        
          </div>
          <div className='formbutton'>          
            <button
              className='tranhatky'
              onClick={() => {
                setisLoading(true);
                setReadyRender(false);                
                loadQLSXPlan(fromdate);
              }}
            >
              Tra PLAN
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
            rows={plandatatable}
            columns={column_plandatatable}
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
export default PLAN_DATATB