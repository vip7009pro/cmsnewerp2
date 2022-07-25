import { DataGrid, GridSelectionModel, GridToolbar, GridToolbarContainer, GridToolbarExport, GridCsvExportOptions, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridRowsProp  } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { generalQuery } from '../../../api/Api';
import "./BaoCaoNhanSu.scss"
import Swal from "sweetalert2";
import LinearProgress from '@mui/material/LinearProgress';
import SaveExcel from '../../../api/GlobalFunction';
import moment from 'moment';
import { elementAcceptingRef } from '@mui/utils';

const  addId = (arr:Array<any>)  => {
    return arr.map((obj:any, index: number) => {
      return Object.assign({}, obj, { id: index });
    });
  };

interface DiemDanhNhomData {  
    id: string,
    MAINDEPTNAME: string,
    SUBDEPTNAME: string,
    TOTAL_ALL: number,
    TOTAL_ON: number,
    TOTAL_OFF: number,
    TOTAL_CDD: number,
    TOTAL_NM1: number,
    TOTAL_NM2: number,
    ON_NM1: number,
    ON_NM2: number,
    OFF_NM1: number,
    OFF_NM2: number,
    CDD_NM1: number,
    CDD_NM2: number,    
}

interface MainDeptData  {
    id: number,
    MAINDEPTCODE: number, 
    MAINDEPTNAME: string, 
    MAINDEPTNAME_KR: string
}

const BaoCaoNhanSu = () => {
    const [isLoading, setisLoading] = useState(false); 
    const [diemdanhnhomtable,setDiemDanhNhomTable ] = useState<Array<DiemDanhNhomData>>([]);
    const [fromdate, setFromDate] = useState(moment().format('YYYY-MM-DD'));
    const [ca, setCa] = useState(6);
    const [nhamay, setNhaMay] = useState(0);
    const [maindepttable, setMainDeptTable] = useState<Array<MainDeptData>>([]);



    const columns_diemdanhnhom =[        
        { field: "MAINDEPTNAME", headerName: "MAINDEPTNAME", width: 120,renderCell: (params:any) => {
            return (
                <div className='onoffdiv'>
                    <span style={{fontWeight: 'bold', color:'black'}}>{params.row.MAINDEPTNAME}</span>                                                      
                </div>)                      
    }  },
        { field: "SUBDEPTNAME", headerName: "SUBDEPTNAME", width: 120 ,renderCell: (params:any) => {
            return (
                <div className='onoffdiv'>
                    <span style={{fontWeight: 'bold', color:'black'}}>{params.row.SUBDEPTNAME}</span>                                                      
                </div>)                      
    } },
        { field: "TOTAL_ALL", headerName: "TOTAL_ALL", width: 90 ,renderCell: (params:any) => {
                return (
                    <div className='onoffdiv'>
                        <span style={{fontWeight: 'bold', color:'blue'}}>{params.row.TOTAL_ALL}</span>                                                      
                    </div>)                      
        }   },
        { field: "TOTAL_ON", headerName: "TOTAL_ON", width: 90 ,renderCell: (params:any) => {
            return (
                <div className='onoffdiv'>
                    <span style={{fontWeight: 'bold', color:'green'}}>{params.row.TOTAL_ON}</span>                                                      
                </div>)                      
    } },
        { field: "TOTAL_OFF", headerName: "TOTAL_OFF", width: 90 ,renderCell: (params:any) => {
            return (
                <div className='onoffdiv'>
                    <span style={{fontWeight: 'bold', color:'red'}}>{params.row.TOTAL_OFF}</span>                                                      
                </div>)                      
    } },
        { field: "TOTAL_CDD", headerName: "TOTAL_CDD", width: 90 ,renderCell: (params:any) => {
            return (
                <div className='onoffdiv'>
                    <span style={{fontWeight: 'bold', color:'black'}}>{params.row.TOTAL_CDD}</span>                                                      
                </div>)                      
    } },
        { field: "TOTAL_NM1", headerName: "TOTAL_NM1", width: 90 },
        { field: "TOTAL_NM2", headerName: "TOTAL_NM2", width: 90 },
        { field: "ON_NM1", headerName: "ON_NM1", width: 90 },
        { field: "ON_NM2", headerName: "ON_NM2", width: 90 },
        { field: "OFF_NM1", headerName: "OFF_NM1", width: 90 },
        { field: "OFF_NM2", headerName: "OFF_NM2", width: 90 },
        { field: "CDD_NM1", headerName: "CDD_NM1", width: 90 },
        { field: "CDD_NM2", headerName: "CDD_NM2", width: 90 },

    ];

    
    function CustomToolbar() {
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <button className='saveexcelbutton' onClick={()=>{SaveExcel(diemdanhnhomtable,"BaoCaoNhanSu")}}>Save Excel</button>
          </GridToolbarContainer>
        );
      }

    const handleSearch = ()=>{
        generalQuery('diemdanhsummarynhom',{from_date: fromdate})
        .then(response => {
            //console.log(response.data.data);
            if(response.data.tk_status !=='NG')
            {
                setDiemDanhNhomTable(addTotal(response.data.data));
                setisLoading(false);
            }
            else
            {
              Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");  
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    const addTotal = (tabledata: Array<DiemDanhNhomData>) => {
        var TOTAL_ALL:number = 0;
        var TOTAL_OFF:number = 0;
        var TOTAL_ON:number = 0;
        var TOTAL_CDD:number = 0;
        var TOTAL_NM1:number = 0;
        var TOTAL_NM2:number = 0;
        var ON_NM1:number = 0;
        var ON_NM2:number = 0;
        var OFF_NM1:number = 0;
        var OFF_NM2:number = 0;
        var CDD_NM1:number = 0;
        var CDD_NM2:number = 0;

        for(var i=0; i<tabledata.length; i++){
            var obj = tabledata[i];
            TOTAL_ALL += obj.TOTAL_ALL;
            TOTAL_ON += obj.TOTAL_ON;
            TOTAL_OFF += obj.TOTAL_OFF;
            TOTAL_CDD += obj.TOTAL_CDD;
            TOTAL_NM1 += obj.TOTAL_NM1;
            TOTAL_NM2 += obj.TOTAL_NM2;
            ON_NM1 += obj.ON_NM1;
            ON_NM2 += obj.ON_NM2;
            OFF_NM1 += obj.OFF_NM1;
            OFF_NM2 += obj.OFF_NM2;
            CDD_NM1 += obj.CDD_NM1;
            CDD_NM2 += obj.CDD_NM2;
        }
        var grandTotalOBJ : DiemDanhNhomData = {
            id: "GRAND_TOTAL",
            MAINDEPTNAME: "GRAND_TOTAL",
            SUBDEPTNAME: "GRAND_TOTAL",
            TOTAL_ALL: TOTAL_ALL,
            TOTAL_ON: TOTAL_ON,
            TOTAL_OFF: TOTAL_OFF,
            TOTAL_CDD: TOTAL_CDD,
            TOTAL_NM1: TOTAL_NM1,
            TOTAL_NM2: TOTAL_NM2,
            ON_NM1: ON_NM1,
            ON_NM2: ON_NM2,
            OFF_NM1: OFF_NM1,
            OFF_NM2: OFF_NM2,
            CDD_NM1: CDD_NM1,
            CDD_NM2: CDD_NM2, 
        }

        tabledata.push(grandTotalOBJ);
        return tabledata;
    }
    useEffect(()=> {
        setisLoading(true);
        generalQuery('getmaindeptlist',{from_date: fromdate})
        .then(response => {
            //console.log(response.data.data);                        
            if(response.data.tk_status !=='NG')
            {
                setMainDeptTable((response.data.data));                
            }            
        })
        .catch(error => {
            console.log(error);
        });

        generalQuery('diemdanhsummarynhom',{from_date: fromdate})
        .then(response => {
            //console.log(response.data.data);                        
            if(response.data.tk_status !=='NG')
            {
                setDiemDanhNhomTable(addTotal(response.data.data));
                setisLoading(false);
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
    <div className='baocaonhansu'> 
          <h3>Lịch Sử Làm Việc</h3>    
          <div className='filterform'> 
          <label><b>Chọn bộ phận:</b>
                    <select name='bophan' value={0}  onChange={e=> {}}>
                    <option value = {0}>Tất cả</option>  
                    {
                        maindepttable.map((element, index) => (<option value={element.MAINDEPTCODE}>{element.MAINDEPTNAME}</option>))
                    }
                    </select>
            </label>          
            <label><b>Chọn nhà máy:</b>
                    <select name='nhamay' value={nhamay}  onChange={e=> {setNhaMay(Number(e.target.value))}}>
                        <option value = {1}>Nhà máy 1</option>  
                        <option value = {2}>Nhà máy 2</option>
                        <option value = {0}>Tất cả</option>
                    </select>
            </label>    
            <label><b>Chọn ca:</b>
                    <select name='ca' value={ca}  onChange={e=>{setCa(Number(e.target.value))}}>
                        <option value = {1}>Ca 1</option>  
                        <option value = {2}>Ca 2</option>
                        <option value = {3}>Hành chính</option>
                        <option value = {4}>Ca 1 + Hành Chính</option>
                        <option value = {5}>Ca 2 + Hành Chính</option>
                        <option value = {6}>Tất cả</option>
                    </select>
            </label>            
            <label><b>Chọn ngày:</b><input type='date' value={fromdate.slice(0,10)} onChange={e => setFromDate(e.target.value)}></input></label>                
           
            <button className='searchbutton' onClick={()=>{handleSearch();}}>Search</button>
          </div>     
          <div className='maindept_table'>
            <DataGrid
              components={{
                Toolbar: CustomToolbar,
                LoadingOverlay: LinearProgress,
              }}
              style={{padding:'20px'}}
              loading={isLoading}
              rowHeight={35}
              rows={diemdanhnhomtable}
              columns={columns_diemdanhnhom}
              rowsPerPageOptions={[5,10,30,50,100, 500]}
              editMode='row'
              getRowHeight={() => 'auto'} 
            />
          </div>
        </div> 
  );
}

export default BaoCaoNhanSu