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
import { checkBP, f_loadProdOverData } from "../../../api/GlobalFunction";
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
    G_NAME: ""
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

  const colDefs = [    
    {
      field: 'SAMPLE_ID', headerName: 'ID', headerCheckboxSelection: true, checkboxSelection: true, width: 50, resizable: true, pinned:'left', floatingFilter: true, /* cellStyle: (params:any) => {     
       if (params.data.M_ID%2==0 ) {
        return { backgroundColor: '#d4edda', color: '#155724' };
      } else {
        return { backgroundColor: '#f8d7da', color: '#721c24' };
      } 
    } */},
    {
      headerName:'SAMPLE INFO',
      children: [
       
        { field: 'PROD_REQUEST_NO', headerName: 'YCSX', width: 50, resizable: true, floatingFilter: true, filter: true, editable: false },
        { field: 'CUST_NAME_KD', headerName: 'CUSTOMER', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
        { field: 'G_CODE', headerName: 'G_CODE', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false },
        { field: 'G_NAME_KD', headerName: 'G_NAME_KD', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
        { field: 'G_NAME', headerName: 'G_NAME', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
        { field: 'G_WIDTH', headerName: 'G_WIDTH', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false },
        { field: 'G_LENGTH', headerName: 'G_LENGTH', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false },
        { field: 'DELIVERY_DT', headerName: 'DELIVERY_DT', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false },
        { field: 'PROD_REQUEST_QTY', headerName: 'SAMPLE_QTY', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps)=> {
          return (
            <span>{params.data.PROD_REQUEST_QTY?.toLocaleString('en-US')}</span>
          )
        } },
        { field: 'BANVE', headerName: 'BANVE', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps)=> {
          let hreftlink = "/banve/" + params.data.G_CODE + ".pdf";
          return (
            <span style={{ color: "gray" }}>
              <a target="_blank" rel="noopener noreferrer" href={hreftlink}>
                LINK
              </a>
            </span>
          )
        } },
        
      ],
      headerClass: 'header'
    }, 
   
    {
      headerName:'RND',
      children: [
        {
          field: 'FILE_MAKET', headerName: 'FILE_MAKET', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
            return (
              <div className="checkboxcell">
                <input type="checkbox" checked={params.data.FILE_MAKET === 'Y'} onChange={(e) => {
                  checkBP(getUserData(), ["RND"], ["ALL"], ["ALL"], () => {
                    
                  })              
                  }}></input>
                <span style={{ color: 'black' }}>{params.data.FILE_MAKET === 'Y' ? 'COMPLETED' : 'PENDING'}</span>
              </div>
            )
          },
          cellStyle: (params: any) => {
            if (params.data.FILE_MAKET === 'Y') {
              return { backgroundColor: '#77da41', color: 'black' };
            } else {
              return { backgroundColor: '#e7a44b', color: 'white' };
            }
          }
        },
        {
          field: 'FILM_FILE', headerName: 'FILM_FILE', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
            return (
              <div className="checkboxcell">
                <input type="checkbox" checked={params.data.FILM_FILE === 'Y'} onChange={(e) => {
                  checkBP(getUserData(), ["RND"], ["ALL"], ["ALL"], () => {
                    
                  })              
                  }}></input>
                <span style={{ color: 'black' }}>{params.data.FILM_FILE === 'Y' ? 'COMPLETED' : 'PENDING'}</span>
              </div>
            )
          },
          cellStyle: (params: any) => {
            if (params.data.FILM_FILE === 'Y') {
              return { backgroundColor: '#77da41', color: 'white' };
            } else {
              return { backgroundColor: '#e7a44b', color: 'white' };
            }
          }
        },
        {
          field: 'KNIFE_STATUS', headerName: 'KNIFE_STATUS', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
            return (
              <div className="checkboxcell">
                <input type="checkbox" checked={params.data.KNIFE_STATUS === 'Y'} onChange={(e) => {
                  checkBP(getUserData(), ["RND"], ["ALL"], ["ALL"], () => {
                    
                  })              
                  }}></input>
                <span style={{ color: 'black' }}>{params.data.KNIFE_STATUS === 'Y' ? 'COMPLETED' : 'PENDING'}</span>
              </div>
            )
          },
          cellStyle: (params: any) => {
            if (params.data.KNIFE_STATUS === 'Y') {
              return { backgroundColor: '#77da41', color: 'white' };
            } else {
              return { backgroundColor: '#e7a44b', color: 'white' };
            }
          }
        },
        { field: 'KNIFE_CODE', headerName: 'KNIFE_CODE', width: 100, resizable: true, floatingFilter: true, filter: true, editable: true,  cellStyle: (params: any) => {
          if (params.data.KNIFE_CODE !== '' && params.data.KNIFE_CODE !== null ) {
            return { backgroundColor: '#77da41', color: 'black' };
          } else {
            return { backgroundColor: '#e7a44b', color: 'black' };
          }
        } },
        {
          field: 'FILM', headerName: 'FILM', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
            return (
              <div className="checkboxcell">
                <input type="checkbox" checked={params.data.FILM === 'Y'} onChange={(e) => {
                  checkBP(getUserData(), ["RND"], ["ALL"], ["ALL"], () => {
                    
                  })              
                  }}></input>
                <span style={{ color: 'black' }}>{params.data.FILM === 'Y' ? 'COMPLETED' : 'PENDING'}</span>
              </div>
            )
          },
          cellStyle: (params: any) => {
            if (params.data.FILM === 'Y') {
              return { backgroundColor: '#77da41', color: 'white' };
            } else {
              return { backgroundColor: '#e7a44b', color: 'white' };
            }
          }
        },

      ],
      headerClass: 'header'
    },
    {
      headerName:'MATERIAL',
      children: [     
        {
          field: 'MATERIAL_STATUS', headerName: 'MATERIAL_STATUS', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
            return (
              <div className="checkboxcell">
                <input type="checkbox" checked={params.data.MATERIAL_STATUS === 'Y'} onChange={(e) => {
                  checkBP(getUserData(), ["MUA","KHO"], ["ALL"], ["ALL"], () => {
                    
                  })              
                  }}></input>
                <span style={{ color: 'black' }}>{params.data.MATERIAL_STATUS === 'Y' ? 'COMPLETED' : 'PENDING'}</span>
              </div>
            )
          },
          cellStyle: (params: any) => {
            if (params.data.MATERIAL_STATUS === 'Y') {
              return { backgroundColor: '#77da41', color: 'black' };
            } else {
              return { backgroundColor: '#e7a44b', color: 'white' };
            }
          }
        },
      
      ],
      headerClass: 'header'
    }, 
   
    /* { field: 'RND_EMPL', headerName: 'RND_EMPL', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'RND_UPD_DATE', headerName: 'RND_UPD_DATE', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false }, */
    {
      headerName:'PRODUCTION',
      children: [
        {
          field: 'PRINT_STATUS', headerName: 'PRINT_STATUS', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
            return (
              <div className="checkboxcell">
                <input type="checkbox" checked={params.data.PRINT_STATUS === 'Y'} onChange={(e) => {
                  checkBP(getUserData(), ["SX"], ["ALL"], ["ALL"], () => {
                    
                  })              
                  }}></input>
                <span style={{ color: 'black' }}>{params.data.PRINT_STATUS === 'Y' ? 'COMPLETED' : 'PENDING'}</span>
              </div>
            )
          },
          cellStyle: (params: any) => {
            if (params.data.PRINT_STATUS === 'Y') {
              return { backgroundColor: '#77da41', color: 'white' };
            } else {
              return { backgroundColor: '#e7a44b', color: 'white' };
            }
          }
        },
        {
          field: 'DIECUT_STATUS', headerName: 'DIECUT_STATUS', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
            return (
              <div className="checkboxcell">
                <input type="checkbox" checked={params.data.DIECUT_STATUS === 'Y'} onChange={(e) => {
                  checkBP(getUserData(), ["SX"], ["ALL"], ["ALL"], () => {
                    
                  })              
                  }}></input>
                <span style={{ color: 'black' }}>{params.data.DIECUT_STATUS === 'Y' ? 'COMPLETED' : 'PENDING'}</span>
              </div>
            )
          },
          cellStyle: (params: any) => {
            if (params.data.DIECUT_STATUS === 'Y') {
              return { backgroundColor: '#77da41', color: 'white' };
            } else {
              return { backgroundColor: '#e7a44b', color: 'white' };
            }
          }
        },
      ],
      headerClass: 'header'
    },
   
    /* { field: 'PR_EMPL', headerName: 'PR_EMPL', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'PR_UPD_DATE', headerName: 'PR_UPD_DATE', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false }, */
    {
      headerName:'QC',
      children: [
        {
          field: 'QC_STATUS', headerName: 'QC_STATUS', width: 80, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
            const [showhidecell, setshowHideCell] = useState(params.data.QC_STATUS === 'P')
            return (
              <div className="checkboxcell">
                {!showhidecell && <>
                  <label>
                    <input
                      type="radio"
                      name={params.data.SAMPLE_ID + 'A'}
                      value="Y"
                      checked={params.data.QC_STATUS === 'Y'}
                      onChange={(e) => {
                        checkBP(getUserData(), ["QC"], ["ALL"], ["ALL"], () => {
                          
                        })
                        
                      }}
                    />
                    <span>OK</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={params.data.SAMPLE_ID + 'A'}
                      value="N"
                      checked={params.data.QC_STATUS === 'N'}
                      onChange={(e) => {
                        checkBP(getUserData(), ["QC"], ["ALL"], ["ALL"], () => {
                          
                        })
                      }}
                    />
                    <span>NG</span>
                  </label>
                </>}
                {showhidecell && <span style={{ color: 'black' }} onClick={() => { setshowHideCell(prev => !prev) }}>{params.data.QC_STATUS === 'Y' ? '' : params.data.QC_STATUS === 'N' ? '' : 'PENDING'}</span>}
              </div>
            )
          },
          cellStyle: (params: any) => {
            if (params.data.QC_STATUS === 'Y') {
              return { backgroundColor: '#77da41', color: 'white' };
            }
            else if (params.data.QC_STATUS === 'N') {
              return { backgroundColor: '#ff0000', color: 'white' };
            }
            else {
              return { backgroundColor: '#e7a44b', color: 'white' };
            }
          }
        },
        { field: 'TOTAL_STATUS', headerName: 'TOTAL_STATUS', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
          let total_check: boolean = true;
          total_check = params.data.FILE_MAKET==='Y' && params.data.FILM_FILE==='Y' && params.data.KNIFE_STATUS==='Y' && params.data.KNIFE_CODE!=='' && params.data.KNIFE_CODE!==null && params.data.FILM==='Y' && params.data.PRINT_STATUS==='Y' && params.data.DIECUT_STATUS==='Y' && params.data.QC_STATUS==='Y' && params.data.MATERIAL_STATUS ==='Y';      
          return (
              <span style={{ color: 'white', fontWeight:'bold' }}>{total_check ? 'COMPLETED' : 'NOT COMPLETED'}</span>
          )
        },
        cellStyle: (params: any) => {
          let total_check: boolean = true;
          total_check = params.data.FILE_MAKET==='Y' && params.data.FILM_FILE==='Y' && params.data.KNIFE_STATUS==='Y' && params.data.KNIFE_CODE!=='' && params.data.KNIFE_CODE!==null && params.data.FILM==='Y' && params.data.PRINT_STATUS==='Y' && params.data.DIECUT_STATUS==='Y' && params.data.QC_STATUS==='Y';
          if (total_check) {
            return { backgroundColor: '#0aa03c', color: 'white' };
          } else {
            return { backgroundColor: '#d8000e', color: 'white' };
          }
        },
        valueGetter: (params: any) => params.data.FILE_MAKET==='Y' && params.data.FILM_FILE==='Y' && params.data.KNIFE_STATUS==='Y' && params.data.KNIFE_CODE!=='' && params.data.KNIFE_CODE!==null && params.data.FILM==='Y' && params.data.PRINT_STATUS==='Y' && params.data.DIECUT_STATUS==='Y' && params.data.QC_STATUS==='Y' ? 'Y':'N'
        
       },
      ],
      headerClass: 'header'
    },
    
    /* { field: 'QC_EMPL', headerName: 'QC_EMPL', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'QC_UPD_DATE', headerName: 'QC_UPD_DATE', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false }, */

    {
      headerName:'CUSTOMER',
      children: [
        {
          field: 'APPROVE_STATUS', headerName: 'APPROVE_STATUS', width: 140, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
            const [showhidecell, setshowHideCell] = useState(params.data.APPROVE_STATUS === 'P')
            return (
              <div className="checkboxcell">
                {!showhidecell && <>
                  <label>
                    <input
                      type="radio"
                      name={params.data.SAMPLE_ID + 'B'}
                      value="Y"
                      checked={params.data.APPROVE_STATUS === 'Y'}
                      onChange={(e) => {
                        checkBP(getUserData(), ["KD"], ["ALL"], ["ALL"], () => {
                          
                        })                    
                      }}
                    />
                    <span>APPROVED</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={params.data.SAMPLE_ID + 'B'}
                      value="N"
                      checked={params.data.APPROVE_STATUS === 'N'}
                      onChange={(e) => {
                        checkBP(getUserData(), ["KD"], ["ALL"], ["ALL"], () => {
                          
                        })   
                      }}
                    />
                    <span>REJECTED</span>
                  </label>
                </>}
                {showhidecell && <span style={{ color: 'black' }} onClick={() => { setshowHideCell(prev => !prev) }}>{params.data.APPROVE_STATUS === 'Y' ? '' : params.data.APPROVE_STATUS === 'N' ? '' : 'PENDING'}</span>}
              </div>
            )
          },
          cellStyle: (params: any) => {
            if (params.data.APPROVE_STATUS === 'Y') {
              return { backgroundColor: '#06d436', color: 'white' };
            }
            else if (params.data.APPROVE_STATUS === 'N') {
              return { backgroundColor: '#ff0000', color: 'white' };
            }
            else {
              return { backgroundColor: '#e7a44b', color: 'white' };
            }
          }
        },    
        { field: 'APPROVE_DATE', headerName: 'APPROVE_DATE', width: 80, resizable: true, floatingFilter: true, filter: true, editable: false },
        { field: 'REMARK', headerName: 'REMARK', width: 100, resizable: true, floatingFilter: true, filter: true, editable: true },
        { field: 'USE_YN', headerName: 'USE_YN', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps)=> {
          if(params.data.USE_YN==='Y') {
            return (
              <span>MỞ</span>
            )
          }
          else {
            return (
              <span>KHÓA</span>
            )
          }

        },  cellStyle: (params: any) => {
          if (params.data.USE_YN === 'Y') {
            return { backgroundColor: '#06d436', color: 'white' };
          }
          else{
            return { backgroundColor: '#ff0000', color: 'white' };
          }         
        } },
        { field: 'INS_DATE', headerName: 'INS_DATE', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
        { field: 'INS_EMPL', headerName: 'PIC_KD', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
      ],
      headerClass: 'header'
    },
    
  ];
  const colDefs2 = [
    {
      field: 'AUTO_ID', headerName: 'ID', headerCheckboxSelection: true, checkboxSelection: true, width: 50, resizable: true, pinned:'left', floatingFilter: true, /* cellStyle: (params:any) => {     
       if (params.data.M_ID%2==0 ) {
        return { backgroundColor: '#d4edda', color: '#155724' };
      } else {
        return { backgroundColor: '#f8d7da', color: '#721c24' };
      } 
    } */},
    { field: 'CUST_NAME_KD', headerName: 'CUSTOMER', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'G_CODE', headerName: 'G_CODE', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false },    
    { field: 'G_NAME', headerName: 'G_NAME', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'PROD_REQUEST_NO', headerName: 'PROD_REQUEST_NO', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'PLAN_ID', headerName: 'PLAN_ID', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'PROD_REQUEST_QTY', headerName: 'PROD_REQUEST_QTY', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps)=> {
      return (
        <span>{params.data.PROD_REQUEST_QTY?.toLocaleString('en-US')}</span>
      )
    } },
    { field: 'OVER_QTY', headerName: 'OVER_QTY', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps)=> {
      return (
        <span>{params.data.OVER_QTY?.toLocaleString('en-US')}</span>
      )
    } },
    {
      field: 'KD_CFM', headerName: 'KD_CFM', width: 80, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
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
                    checkBP(getUserData(), ["QC"], ["ALL"], ["ALL"], () => {
                      
                    })
                    
                  }}
                />
                <span>OK</span>
              </label>
              <label>
                <input
                  type="radio"
                  name={params.data.AUTO_ID + 'A'}
                  value="N"
                  checked={params.data.KD_CFM === 'N'}
                  onChange={(e) => {
                    checkBP(getUserData(), ["QC"], ["ALL"], ["ALL"], () => {
                      
                    })
                  }}
                />
                <span>NG</span>
              </label>
            </>}
            {showhidecell && <span style={{ color: 'black' }} onClick={() => { setshowHideCell(prev => !prev) }}>{params.data.KD_CFM === 'Y' ? '' : params.data.QC_STATUS === 'N' ? '' : 'PENDING'}</span>}
          </div>
        )
      },
      cellStyle: (params: any) => {
        if (params.data.QC_STATUS === 'Y') {
          return { backgroundColor: '#77da41', color: 'white' };
        }
        else if (params.data.QC_STATUS === 'N') {
          return { backgroundColor: '#ff0000', color: 'white' };
        }
        else {
          return { backgroundColor: '#e7a44b', color: 'white' };
        }
      }
    },

  ];

  const material_data_ag_table = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        toolbar={
          <div className="headerform">
            <div className="forminputcolumn">
              <label>
                <span style={{fontSize:'0.8rem', fontWeight:'bold'}}>Số YCSX:</span>                
                <input
                  type='text'
                  placeholder='1F80008'
                  value={prod_request_no}
                  onChange={(e) => {
                    setProd_Request_No(e.target.value);
                    if(e.target.value.length==7)
                      {
                        loadYCSXDataSAMPLE_MONITOR(e.target.value)
                      }
                      else {
                        setYCSXINFO([])
                      }
                  }}
                ></input>
              </label>
              <span style={{fontSize:'0.8rem', fontWeight:'bold', color:'blueviolet'}}>{ycsxInfo.length>0 && ycsxInfo[0].G_NAME_KD} |  {ycsxInfo.length>0 && ycsxInfo[0].G_NAME}</span>
            </div>
            
            <IconButton
              className="buttonIcon"
              onClick={() => {
                //setShowHidePivotTable(!showhidePivotTable);
                
              }}
            >
              <MdAdd color="#05ac1b" size={15} />
              Add Sample
            </IconButton>
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
            <IconButton
              className="buttonIcon"
              onClick={() => {
                checkBP(getUserData(), ["KD"], ["ALL"], ["ALL"], () => {
                  
                })                
              }}
            >
              <MdLock color="#e70808" size={20} />
              Khóa Sample
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                checkBP(getUserData(), ["KD"], ["ALL"], ["ALL"], () => {
                  
                })                
              }}
            >
              <MdLock color="#02b81a" size={20} />
              Mở Sample
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
