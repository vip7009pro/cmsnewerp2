import { Button, IconButton, createFilterOptions } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import "./OVER_MONITOR.scss";
import { generalQuery, getUserData, uploadQuery } from "../../../api/Api";
import { MdAdd, MdFaceUnlock, MdLock, MdOutlinePivotTableChart, MdRefresh } from "react-icons/md";
import { CustomerListData, FullBOM, PROD_OVER_DATA, SAMPLE_MONITOR_DATA } from "../../../api/GlobalInterface";
/* import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; */ // Optional Theme applied to the grid
import AGTable from "../../../components/DataTable/AGTable";
import { CustomCellRendererProps } from "ag-grid-react";
import { checkBP, f_loadProdOverData, f_updateProdOverData } from "../../../api/GlobalFunction";
import moment from "moment";
import { AiFillCloseCircle } from "react-icons/ai";
const OVER_MONITOR = () => {
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [data, setData] = useState<Array<PROD_OVER_DATA>>([]);
  const selectedSample = useRef<PROD_OVER_DATA[]>([]);
  const defautlClickedRow: PROD_OVER_DATA = {
    AUTO_ID: 0,
    PROD_REQUEST_NO: "",
    PLAN_ID: "",
    OVER_QTY: 0,
    KD_CFM: "",
    KD_EMPL_NO: "",
    KD_CF_DATETIME: "",
    HANDLE_STATUS: "",
    INS_DATE: "",
    INS_EMPL: "",
    UPD_DATE: "",
    UPD_EMPL: "",
    KD_REMARK: "",
    PROD_REQUEST_QTY: 0,
    CUST_NAME_KD: "",
    G_CODE: "",
    G_NAME: "",
    EMPL_NO: ""
  }
  const [clickedRows, setClickedRows] = useState<PROD_OVER_DATA>(defautlClickedRow);

  const [prod_request_no, setProd_Request_No]= useState('');
  const [ycsxInfo, setYCSXINFO]= useState<FullBOM[]>([]);
  const loadYCSXDataSAMPLE_MONITOR = (ycsx: string)=> {
    generalQuery("ycsx_fullinfo", {      
      PROD_REQUEST_NO: ycsx,      
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
         setYCSXINFO(response.data.data)
        } else {
          setYCSXINFO([])        
        }
      })
      .catch((error) => {
        console.log(error);
      });

  }
  const loadProdOverData = async ()=> {
    setData(await f_loadProdOverData());
  }

  const updateData = async (prod_over_data: PROD_OVER_DATA, updateValue: string) => {
    Swal.fire({
      title: "Chắc chắn muốn update Data ?",
      text: "Suy nghĩ kỹ trước khi hành động",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn update!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        switch (getUserData()?.MAINDEPTNAME) {
          case 'KD':
            await f_updateProdOverData(prod_over_data, updateValue)
            await loadProdOverData();
            break;
          default:
            Swal.fire('Thông báo', 'Bạn không thuộc bộ phận kinh doanh', 'success');
        }

      }
    });
  }
  const colDefs2 = [
    {
      field: 'AUTO_ID', headerName: 'ID', headerCheckboxSelection: true, checkboxSelection: true, width: 50, resizable: true, pinned:'left', floatingFilter: true, /* cellStyle: (params:any) => {     
       if (params.data.M_ID%2==0 ) {
        return { backgroundColor: '#d4edda', color: '#155724' };
      } else {
        return { backgroundColor: '#f8d7da', color: '#721c24' };
      } 
    } */},
    { field: 'EMPL_NO', headerName: 'KD_EMPL_NO', width: 90, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'CUST_NAME_KD', headerName: 'CUSTOMER', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'G_CODE', headerName: 'G_CODE', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false },    
    { field: 'G_NAME', headerName: 'G_NAME', width: 150, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'PROD_REQUEST_NO', headerName: 'PROD_REQUEST_NO', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'PLAN_ID', headerName: 'PLAN_ID', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'PROD_REQUEST_QTY', headerName: 'YCSX_QTY', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps)=> {
      return (
        <span style={{color:'blue', fontWeight:'bold'}}>{params.data.PROD_REQUEST_QTY?.toLocaleString('en-US')}</span>
      )
    } },
    { field: 'OVER_QTY', headerName: 'OVER_QTY', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps)=> {
      return (
        <span style={{color:'red', fontWeight:'bold'}}>{params.data.OVER_QTY?.toLocaleString('en-US')}</span>
      )
    } },
    {
      field: 'KD_CFM', headerName: 'KD_CFM', width: 110, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
        const [showhidecell, setshowHideCell] = useState(params.data.KD_CFM === 'P')
        return (
          <div className="checkboxcell">
            {!showhidecell && <>
              <label>
                <input
                  type="radio"
                  name={params.data.AUTO_ID + 'A'}
                  value="Y"
                  checked={params.data.KD_CFM === 'Y'}
                  onChange={(e) => {
                    checkBP(getUserData(), ["KD"], ["ALL"], ["ALL"], async () => {
                      if(params.data.HANDLE_STATUS==='P')
                      {
                        await updateData(params.data,'Y');
                      }
                      else
                      {
                        Swal.fire('Thông báo','Đã xử lý xong, không update lại trạng thái được nữa','error');
                      }            
                    })                    
                  }}
                />
                <span>NHẬP</span>
              </label>
              <label>
                <input
                  type="radio"
                  name={params.data.AUTO_ID + 'A'}
                  value="N"
                  checked={params.data.KD_CFM === 'N'}
                  onChange={(e) => {
                    checkBP(getUserData(), ["KD"], ["ALL"], ["ALL"], async () => {
                      if(params.data.HANDLE_STATUS==='P')
                      {
                        await updateData(params.data,'N');
                      }
                      else
                      {
                        Swal.fire('Thông báo','Đã xử lý xong, không update lại trạng thái được nữa','error');
                      }
                    })
                  }}
                />
                <span>HỦY</span>
              </label>
            </>}
            {showhidecell && <span style={{ color: 'black' }} onClick={() => { setshowHideCell(prev => !prev) }}>{params.data.KD_CFM === 'Y' ? 'NHẬP' : params.data.KD_CFM === 'N' ? 'HỦY' : 'PENDING'}</span>}
          </div>
        )
      },
      cellStyle: (params: any) => {
        if (params.data.KD_CFM === 'Y') {
          return { backgroundColor: '#77da41', color: 'white' };
        }
        else if (params.data.KD_CFM === 'N') {
          return { backgroundColor: '#ff0000', color: 'white' };
        }
        else {
          return { backgroundColor: '#e7a44b', color: 'white' };
        }
      }
    },
    { field: 'KD_EMPL_NO', headerName: 'KD_CFM_EMPL', width: 90, resizable: true, floatingFilter: true, filter: true, editable: false },    
    { field: 'KD_CF_DATETIME', headerName: 'KD_CF_DATETIME', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },    
    { field: 'KD_REMARK', headerName: 'KD_REMARK', width: 100, resizable: true, floatingFilter: true, filter: true, editable: true },    
    {
      field: 'HANDLE_STATUS', headerName: 'HANDLE_STATUS', width: 110, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
        if(params.data.HANDLE_STATUS==='P')
        return (
          <span style={{color:'black'}}>PENDING</span>
        )
        else 
        return (
          <span style={{color:'black'}}>CLOSED</span>
        )
      },
      cellStyle: (params: any) => {
        if (params.data.HANDLE_STATUS === 'C') {
          return { backgroundColor: '#77da41', color: 'white' };
        }
        else if (params.data.HANDLE_STATUS === 'Y') {
          return { backgroundColor: '#ff0000', color: 'white' };
        }
        else {
          return { backgroundColor: '#e7a44b', color: 'white' };
        }
      }
    }, 
    { field: 'INS_DATE', headerName: 'INS_DATE', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },    
    { field: 'INS_EMPL', headerName: 'INS_EMPL', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false },    
    { field: 'UPD_DATE', headerName: 'UPD_DATE', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },    
    { field: 'UPD_EMPL', headerName: 'UPD_EMPL', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false },    
  ];

  const material_data_ag_table = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        toolbar={
          <div className="headerform">
            <span style={{fontSize:'1rem', fontWeight:'bold'}}>PRODUCTION OVER MONITOR</span>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                loadProdOverData();
              }}
            >
              <MdRefresh color="#fb6812" size={20} />
              Reload
            </IconButton>           
          </div>}
        columns={colDefs2}
        data={data}
        onCellEditingStopped={(params: any) => {
          console.log(params)
        }}
        onCellClick={(params: any) => {
          setClickedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
          selectedSample.current = params!.api.getSelectedRows()
        }} />
    )
  }, [data, colDefs2])
  useEffect(() => {
    loadProdOverData();    
  }, []);
  return (
    <div className="sample_monitor">
      <div className="tracuuDataInspection">        
        <div className="tracuuYCSXTable">
          {material_data_ag_table}
        </div>
        {showhidePivotTable && (
          <div className="pivottable1">
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowHidePivotTable(false);
              }}
            >
              <AiFillCloseCircle color="blue" size={15} />
              Close
            </IconButton>    
          </div>
        )}
      </div>
      
    </div>
  );
};
export default OVER_MONITOR;