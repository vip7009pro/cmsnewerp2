import { Button, IconButton, createFilterOptions } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import "./SAMPLE_MONITOR.scss";
import { generalQuery, getUserData, uploadQuery } from "../../../api/Api";
import { MdAdd, MdFaceUnlock, MdLock, MdOutlinePivotTableChart, MdRefresh } from "react-icons/md";
import { CustomerListData, FullBOM, SAMPLE_MONITOR_DATA } from "../../../api/GlobalInterface";
/* import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; */ // Optional Theme applied to the grid
import AGTable from "../../../components/DataTable/AGTable";
import { CustomCellRendererProps } from "ag-grid-react";
import { checkBP } from "../../../api/GlobalFunction";
import moment from "moment";
import { AiFillCloseCircle } from "react-icons/ai";
const SAMPLE_MONITOR = () => {
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [data, setData] = useState<Array<SAMPLE_MONITOR_DATA>>([]);
  const selectedSample = useRef<SAMPLE_MONITOR_DATA[]>([]);
  const [clickedRows, setClickedRows] = useState<SAMPLE_MONITOR_DATA>({
    SAMPLE_ID: 0,
    PROD_REQUEST_NO: '',
    G_CODE: '',
    G_NAME_KD: '',
    G_NAME: '',
    FILE_MAKET: '',
    FILM_FILE: '',
    KNIFE_STATUS: '',
    KNIFE_CODE: '',
    FILM: '',
    RND_EMPL: '',
    RND_UPD_DATE: '',
    MATERIAL_STATUS:'',
    PUR_EMPL:'',
    PUR_UPD_DATE:'',
    PRINT_STATUS: '',
    DIECUT_STATUS: '',
    PR_EMPL: '',
    PR_UPD_DATE: '',
    QC_STATUS: '',
    QC_EMPL: '',
    QC_UPD_DATE: '',
    APPROVE_STATUS: '',
    APPROVE_DATE: '',
    USE_YN: '',
    REMARK: '',
    INS_DATE: '',
    INS_EMPL: '',
    CUST_CD: '',
    CUST_NAME_KD: '',
    DELIVERY_DT: '',    
    G_LENGTH: 0,
    G_WIDTH: 0,
    PROD_REQUEST_DATE: '',
    PROD_REQUEST_QTY: 0
  });
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
  const loadSampleListTable = () => {
    generalQuery("loadSampleMonitorTable", {
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: SAMPLE_MONITOR_DATA, index: number) => {
              return {
                ...element,
                DELIVERY_DT: element.APPROVE_DATE !== null? moment(element.DELIVERY_DT,'YYYYMMDD').format('YYYY-MM-DD'):'',
                APPROVE_DATE: element.APPROVE_DATE !== null? moment(element.APPROVE_DATE).format('YYYY-MM-DD'):'',
                INS_DATE: element.INS_DATE !== null? moment(element.INS_DATE).format('YYYY-MM-DD'):'',                
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setData(loadeddata);
          selectedSample.current=[];
          /* Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
          ); */
        } else {
          setData([]);
          selectedSample.current=[];
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const lockSample= async (lockValue: string)=> {
    let err_code: string ='';

    if(selectedSample.current.length>0)
      {
        for(let i=0;i<selectedSample.current.length;i++)
        {
          await generalQuery("lockSample", {      
            SAMPLE_ID: selectedSample.current[i].SAMPLE_ID,
            USE_YN: lockValue,      
          })
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
                          
              } else {
                err_code += '| ' + response.data.message;
                
              }
            })
            .catch((error) => {
              console.log(error);
            });
    
        }
        if(err_code === '')
        {
          Swal.fire('Thông báo','Cập nhật thành công','success')
          
        }
        else {
          Swal.fire('Thông báo','Cập nhật thất bại: '+ err_code,'success')
        }
        loadSampleListTable();

      }
      else
      {
        Swal.fire('Thông báo','Chọn ít nhất 1 dòng','error')
      }
    

  }
  const seMaterialInfo = (keyname: string, value: any) => {
    let tempMaterialInfo: SAMPLE_MONITOR_DATA = {
      ...clickedRows,
      [keyname]: value,
    };
    //console.log(tempcodefullinfo);
    setClickedRows(tempMaterialInfo);
  };
  const updateRND_STATUS =(datarow: SAMPLE_MONITOR_DATA) => {
    generalQuery("updateRND_SAMPLE_STATUS", {
      SAMPLE_ID: datarow.SAMPLE_ID,
      FILE_MAKET: datarow.FILE_MAKET,
      FILM_FILE: datarow.FILM_FILE,
      KNIFE_STATUS: datarow.KNIFE_STATUS,
      KNIFE_CODE: datarow.KNIFE_CODE,
      FILM: datarow.FILM
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          Swal.fire('Thông báo','Update data thành công','success');
        } else {
          Swal.fire('Thông báo','Update data thất bại','error');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const updateSX_STATUS =(datarow: SAMPLE_MONITOR_DATA) => {
    generalQuery("updateSX_SAMPLE_STATUS", {      
      SAMPLE_ID: datarow.SAMPLE_ID,
      PRINT_STATUS: datarow.PRINT_STATUS,
      DIECUT_STATUS: datarow.DIECUT_STATUS,      
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          Swal.fire('Thông báo','Update data thành công','success');
        } else {
          Swal.fire('Thông báo','Update data thất bại','error');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const updateQC_STATUS =(datarow: SAMPLE_MONITOR_DATA) => {
  generalQuery("updateQC_SAMPLE_STATUS", {      
      SAMPLE_ID: datarow.SAMPLE_ID,
      QC_STATUS: datarow.QC_STATUS,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          Swal.fire('Thông báo','Update data thành công','success');
        } else {
          Swal.fire('Thông báo','Update data thất bại','error');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const updateMATERIAL_STATUS =(datarow: SAMPLE_MONITOR_DATA) => {
  generalQuery("updateMATERIAL_STATUS", {      
      SAMPLE_ID: datarow.SAMPLE_ID,
      MATERIAL_STATUS: datarow.MATERIAL_STATUS,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          Swal.fire('Thông báo','Update data thành công','success');
        } else {
          Swal.fire('Thông báo','Update data thất bại','error');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const updateAPPROVE_STATUS = async (datarow: SAMPLE_MONITOR_DATA) => {
  generalQuery("updateAPPROVE_SAMPLE_STATUS", {      
      SAMPLE_ID: datarow.SAMPLE_ID,
      APPROVE_STATUS: datarow.APPROVE_STATUS,
      USE_YN: datarow.USE_YN,
      REMARK: datarow.REMARK
    })    
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          Swal.fire('Thông báo','Update data thành công','success');
        } else {
          Swal.fire('Thông báo','Update data thất bại','error');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const updateDataTable = (data_row: SAMPLE_MONITOR_DATA, key: string, value: any) => {
    Swal.fire({
      title: "Chắc chắn muốn update Data ?",
      text: "Suy nghĩ kỹ trước khi hành động",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn update!",
    }).then((result) => {
      if (result.isConfirmed) {
        let dataToUpdate: SAMPLE_MONITOR_DATA = data.filter((ele:SAMPLE_MONITOR_DATA, index: number)=> ele.SAMPLE_ID === data_row.SAMPLE_ID)[0];
        switch (getUserData()?.MAINDEPTNAME) {
          case 'RND':        
              updateRND_STATUS({ ...dataToUpdate, [key]: value });       
            break;
          case 'SX':        
              updateSX_STATUS({ ...dataToUpdate, [key]: value });       
            break;
          case 'QC':        
              updateQC_STATUS({ ...dataToUpdate, [key]: value });       
            break;
          case 'KD':        
              updateAPPROVE_STATUS({ ...dataToUpdate, [key]: value });        
            break;
          case 'MUA':        
              updateMATERIAL_STATUS({ ...dataToUpdate, [key]: value });        
            break;
          case 'KHO':        
              updateMATERIAL_STATUS({ ...dataToUpdate, [key]: value });        
            break;
          
        }
        setData(prev => {
          const newData = prev.map((p) =>
            p.SAMPLE_ID === data_row.SAMPLE_ID
              ? { ...p, [key]: value, }
              : p
          );
          return newData;
        });        
      }
    });   
  }
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      loadSampleListTable();
    }
  };
  const handleUpdateData = (e: React.ChangeEvent<HTMLInputElement>, rowdata: SAMPLE_MONITOR_DATA, key: string) => {
    if (e.target.checked) {
      updateDataTable(rowdata, key, 'Y')
    }
    else {
      updateDataTable(rowdata, key, 'N')
    }
  }
  const handle_Add_Sample =(ycsx: FullBOM) => {
    if(ycsxInfo.length>0)
    {
      generalQuery("addMonitoringSample", {      
        PROD_REQUEST_NO: ycsx.PROD_REQUEST_NO,   
        G_NAME_KD: ycsx.G_NAME_KD 
      })
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            Swal.fire("Thông báo","Thêm sample thành công","success");
            loadSampleListTable();
            
          } else {
            if(response.data.message.indexOf('PRIMARY KEY') > -1)
            {
              Swal.fire("Thông báo","Thêm sample thất bại, ycsx này đã thêm rồi","error");            
            }
            else
            {
              Swal.fire("Thông báo","Thêm sample thất bại:"+ response.data.message,"error");            
            }
            
          }
        })
        .catch((error) => {
          console.log(error);
        });

    }
    else 
    {
      Swal.fire("Thông báo","Hãy nhập số YCSX","error");        
    }
    


  }
  function CustomHeader({displayName}:{displayName: string}) {
    return (
      <div className="custom-header">
      <span className="custom-header-icon">🔍</span>
      <span className="custom-header-text">{displayName}</span>
      </div>
    )
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
                    handleUpdateData(e, params.data, 'FILE_MAKET')
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
                    handleUpdateData(e, params.data, 'FILM_FILE')
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
                    handleUpdateData(e, params.data, 'KNIFE_STATUS')
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
                    handleUpdateData(e, params.data, 'FILM')
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
                    handleUpdateData(e, params.data, 'MATERIAL_STATUS')
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
                    handleUpdateData(e, params.data, 'PRINT_STATUS')
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
                    handleUpdateData(e, params.data, 'DIECUT_STATUS')
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
                          updateDataTable(params.data, 'QC_STATUS', e.target.value)
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
                          updateDataTable(params.data, 'QC_STATUS', e.target.value)
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
                          updateDataTable(params.data, 'APPROVE_STATUS', e.target.value)
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
                          updateDataTable(params.data, 'APPROVE_STATUS', e.target.value)
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
                handle_Add_Sample(ycsxInfo[0]);
              }}
            >
              <MdAdd color="#05ac1b" size={15} />
              Add Sample
            </IconButton>
            <span style={{fontSize:'1rem', fontWeight:'bold'}}>SAMPLE MONITOR</span>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                loadSampleListTable();
              }}
            >
              <MdRefresh color="#fb6812" size={20} />
              Reload
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                checkBP(getUserData(), ["KD"], ["ALL"], ["ALL"], () => {
                  lockSample('N');
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
                  lockSample('Y');
                })                
              }}
            >
              <MdLock color="#02b81a" size={20} />
              Mở Sample
            </IconButton>
            
          </div>}
        columns={colDefs}
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
  }, [data, colDefs])
  useEffect(() => {
    loadSampleListTable();
  }, []);
  return (
    <div className="sample_monitor">
      <div className="tracuuDataInspection">
        {/* <div className="tracuuDataInspectionform">
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Mã Vật Liệu:</b>{" "}
                <input
                  type="text"
                  placeholder="Mã Vật Liệu"
                  value={clickedRows?.M_NAME}
                  onChange={(e) => seMaterialInfo("M_NAME", e.target.value)}
                ></input>
              </label>
              <label style={{ display: "flex", alignItems: "center" }}>
                <b>Vendor:</b>{" "}
                <Autocomplete
                  sx={{
                    height: 10,
                    width: "160px",
                    margin: "1px",
                    fontSize: "0.7rem",
                    marginBottom: "20px",
                    backgroundColor: "white",
                  }}
                  size="small"
                  disablePortal
                  options={customerList}
                  className="autocomplete"
                  filterOptions={filterOptions1}
                  isOptionEqualToValue={(option: any, value: any) =>
                    option.CUST_CD === value.CUST_CD
                  }
                  getOptionLabel={(option: any) =>
                    `${option.CUST_CD !== null ? option.CUST_NAME_KD : "SSJ"}${option.CUST_CD !== null ? option.CUST_CD : "0049"
                    }`
                  }
                  renderInput={(params) => (
                    <TextField {...params} style={{ height: "10px" }} />
                  )}
                  defaultValue={{
                    CUST_CD: getCompany() === "CMS" ? "0049" : "KH000",
                    CUST_NAME: getCompany() === "CMS" ? "SSJ" : "PVN",
                    CUST_NAME_KD: getCompany() === "CMS" ? "SSJ" : "PVN",
                  }}
                  value={{
                    CUST_CD: clickedRows?.CUST_CD,
                    CUST_NAME: customerList.filter(
                      (e: CustomerListData, index: number) =>
                        e.CUST_CD === clickedRows?.CUST_CD,
                    )[0]?.CUST_NAME,
                    CUST_NAME_KD:
                      customerList.filter(
                        (e: CustomerListData, index: number) =>
                          e.CUST_CD === clickedRows?.CUST_CD,
                      )[0]?.CUST_NAME_KD === undefined
                        ? ""
                        : customerList.filter(
                          (e: CustomerListData, index: number) =>
                            e.CUST_CD === clickedRows?.CUST_CD,
                        )[0]?.CUST_NAME_KD,
                  }}
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue);
                    seMaterialInfo(
                      "CUST_CD",
                      newValue === null ? "" : newValue.CUST_CD,
                    );
                  }}
                />
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Mô tả:</b>{" "}
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={clickedRows?.DESCR}
                  onChange={(e) => seMaterialInfo("DESCR", e.target.value)}
                ></input>
              </label>
              <label>
                <b>Open Price:</b>{" "}
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={clickedRows?.SSPRICE}
                  onChange={(e) => seMaterialInfo("SSPRICE", e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Origin Price:</b>{" "}
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={clickedRows?.CMSPRICE}
                  onChange={(e) => seMaterialInfo("CMSPRICE", e.target.value)}
                ></input>
              </label>
              <label>
                <b>Slitting Price:</b>{" "}
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={clickedRows?.SLITTING_PRICE}
                  onChange={(e) =>
                    seMaterialInfo("SLITTING_PRICE", e.target.value)
                  }
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Master Width:</b>{" "}
                <input
                  type="text"
                  placeholder="Master width"
                  value={clickedRows?.MASTER_WIDTH}
                  onChange={(e) =>
                    seMaterialInfo("MASTER_WIDTH", e.target.value)
                  }
                ></input>
              </label>
              <label>
                <b>Roll Length:</b>{" "}
                <input
                  type="text"
                  placeholder="Roll length"
                  value={clickedRows?.ROLL_LENGTH}
                  onChange={(e) =>
                    seMaterialInfo("ROLL_LENGTH", e.target.value)
                  }
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>HSD:</b>{" "}
                <input
                  type="text"
                  placeholder="Master width"
                  value={clickedRows?.EXP_DATE}
                  onChange={(e) => seMaterialInfo("EXP_DATE", e.target.value)}
                ></input>
              </label>           
              <label>
                <b>Mở/Khóa:</b>
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type='checkbox'
                  name='pobalancecheckbox'
                  checked={clickedRows?.USE_YN === "Y"}
                  onChange={(e) => {
                    seMaterialInfo(
                      "USE_YN", e.target.checked === true ? "Y" : "N",
                    );
                  }}
                ></input>
              </label>
            </div>
          </div>
          <div className="formbutton">
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#129232' }} onClick={() => {
              loadSampleListTable();
            }}>Refresh</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f05bd7' }} onClick={() => {
               checkBP(getUserData(), ["MUA"], ["ALL"], ["ALL"], () => {                
                addMaterial();
              })
            }}>Add</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#ec9d52' }} onClick={() => {
              checkBP(getUserData(), ["MUA"], ["ALL"], ["ALL"], () => {
                updateMaterial();
              })
            }}>Update</Button>
          </div>
        </div> */}
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
            <div>
              Dong thu 1
            </div>
            
          </div>
        )}
      </div>
      
    </div>
  );
};
export default SAMPLE_MONITOR;
