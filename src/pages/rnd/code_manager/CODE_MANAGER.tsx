import { IconButton,  LinearProgress} from '@mui/material';
import { DataGrid, GridSelectionModel, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarQuickFilter ,GridColumns, GridRowsProp, GridCellEditStopParams, MuiEvent, GridCellEditStopReasons, GridCellEditCommitParams, MuiBaseEvent, GridCallbackDetails } from '@mui/x-data-grid';
import moment from 'moment';
import  { useContext, useEffect, useState, useTransition } from 'react'
import {FcSearch } from 'react-icons/fc';
import {AiFillEdit, AiFillFileExcel } from "react-icons/ai";
import Swal from 'sweetalert2';
import { generalQuery } from '../../../api/Api';
import { UserContext } from '../../../api/Context';
import { SaveExcel } from '../../../api/GlobalFunction';
import "./CODE_MANAGER.scss"
interface CODE_INFO {
    G_CODE: string,
    G_NAME: string,
    G_NAME_KD: string,
    PROD_TYPE: string,
    PROD_LAST_PRICE: number,
    PD: number,
    CAVITY: number,
    PACKING_QTY: number,
    G_WIDTH: number,
    G_LENGTH: number,
    PROD_PROJECT: string,
    PROD_MODEL: string,
    M_NAME_FULLBOM: string,
    BANVE: string,
    NO_INSPECTION: string,
    USE_YN: string,
}

const CODE_MANAGER = () => {
  const [selection, setSelection] = useState<any>({
    trapo: true,
    thempohangloat:false,
    them1po: false,
    them1invoice:false,
    testinvoicetable: false
  });
  const [userData, setUserData] = useContext(UserContext);
  const [isLoading, setisLoading] = useState(false); 
  const [codeCMS,setCodeCMS] =useState('');
  const [codeinfodatatable, setCODEINFODataTable] = useState<Array<any>>([]);
  const [enableEdit, setEnableEdit] = useState(true);
  let column_codeinfo = [
    { field: "id", headerName: "ID", width: 70,  editable: enableEdit },
    { field: "G_CODE", headerName: "G_CODE", width: 80,  editable: enableEdit  },
    { field: "G_NAME", headerName: "G_NAME", flex: 1, minWidth: 150,  editable: enableEdit  },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120,  editable: enableEdit  },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 80,  editable: enableEdit  },
    { field: "PROD_LAST_PRICE", headerName: "PRICE", width: 80,  editable: enableEdit  },
    { field: "PD", headerName: "PD", width: 80,  editable: enableEdit  },
    { field: "CAVITY", headerName: "CAVITY", width: 80,  editable: enableEdit  },
    { field: "PACKING_QTY", headerName: "PACKING_QTY", width: 80,  editable: enableEdit  },
    { field: "G_WIDTH", headerName: "G_WIDTH", width: 80,  editable: enableEdit  },
    { field: "G_LENGTH", headerName: "G_LENGTH", width: 80,  editable: enableEdit  },
    { field: "PROD_PROJECT", headerName: "PROD_PROJECT", width: 120,  editable: enableEdit  },
    { field: "PROD_MODEL", headerName: "PROD_MODEL", width: 120,  editable: enableEdit  },
    { field: "M_NAME_FULLBOM", headerName: "FULLBOM",  flex: 1, minWidth: 150,  editable: enableEdit  },
    { field: "BANVE", headerName: "BANVE", width: 120 , renderCell: (params:any) => {
      let hreftlink = '/banve/' + params.row.G_CODE + '.pdf';
      if (params.row.BANVE !== "N")
      {
        return (
          <span style={{ color: "gray" }}>
            <a target='_blank' rel='noopener noreferrer' href={hreftlink}>
              LINK
            </a>
          </span>
        )
      }
      else
      {
        return <span style={{ color: "red" }}>Chưa có bản vẽ</span>;
      }        
    },  editable: enableEdit },
    { field: "NO_INSPECTION", headerName: "KT NGOAI QUAN", width: 120, renderCell: (params:any) => {     
      if(params.row.NO_INSPECTION !=='Y')
      return <span style={{color:'green'}}>
       Kiểm tra
      </span>
      return <span style={{color:'red'}}>
       Không kiểm tra
     </span>
    }, editable: enableEdit },
    { field: "USE_YN", headerName: "SỬ DỤNG", width: 80, renderCell: (params:any) => {     
      if(params.row.USE_YN !=='Y')
      return <span style={{color:'red'}}>
       KHÓA
      </span>
      return <span style={{color:'green'}}>
      MỞ
     </span>
    } ,editable: true},
  ];

  const [rows, setRows] = useState<GridRowsProp>([]);
  const [columns, setColumns] = useState<GridColumns>(column_codeinfo);
  const [editedRows, setEditedRows] = useState<Array<GridCellEditCommitParams>>([]);
  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(column_codeinfo);
  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector /> 
        <IconButton className='buttonIcon'onClick={()=>{SaveExcel(codeinfodatatable,"Code Info Table")}}><AiFillFileExcel color='green' size={25}/>SAVE</IconButton> 
        <IconButton className='buttonIcon'onClick={()=>{
          setColumns(columns.map((element, index:number)=> {
            return {...element, editable : !element.editable};
          }))
          Swal.fire("Thông báo","Bật/Tắt chế độ sửa","success");
        }}><AiFillEdit color='yellow' size={25}/>Bật tắt sửa</IconButton> 
        <GridToolbarQuickFilter/>
      </GridToolbarContainer>
    );
  }  
  const handleCODEINFO = ()=> {
    setisLoading(true);
    setColumnDefinition(column_codeinfo);
    generalQuery('codeinfo',{     
        G_NAME: codeCMS    
    })
    .then(response => {
        //console.log(response.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: CODE_INFO[] =  response.data.data.map((element:CODE_INFO,index: number)=> {
            return {
              ...element,   id:  index
            }
          })
          setRows(loadeddata);
          //setCODEINFODataTable(loadeddata);
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
  const setNav = (choose: number) => {
    if(choose ===1 )
    {
      setSelection({...selection, trapo: true, thempohangloat:false, them1po:false,them1invoice:false,testinvoicetable: false});
    }
    else if(choose ===2 )
    {
      setSelection({...selection, trapo: false, thempohangloat:true, them1po:false,them1invoice:false,testinvoicetable: false});
    }
    else if(choose ===3 )
    {
      setSelection({...selection, trapo: false, thempohangloat:false, them1po:false,them1invoice:false,testinvoicetable: true});
    }
  }
  useEffect(()=>{
  },[]);
  return (
    <div className='codemanager'>
      <div className='mininavbar'>
        <div className='mininavitem' onClick={() => setNav(1)}>
          <span className='mininavtext'>Thông tin sản phẩm</span>
        </div>    
      </div>
      {selection.trapo && (
        <div className='tracuuFcst'>
          <div className='tracuuFcstform'>
            <div className='forminput'>
              <div className='forminputcolumn'>
                <label>
                  <b>Code:</b>{" "}
                  <input
                    type='text'
                    placeholder='Nhập code vào đây'
                    value={codeCMS}
                    onChange={(e) => setCodeCMS(e.target.value)}
                  ></input>
                </label>
                <button
                  className='traxuatkiembutton'
                  onClick={() => {
                    handleCODEINFO();
                  }}
                >
                  Tìm code
                </button>
              </div>
            </div>
          </div>
          <div className='tracuuFcstTable'>       
            <DataGrid
              components={{
                Toolbar: CustomToolbarPOTable,
                LoadingOverlay: LinearProgress,
              }}
              sx={{ fontSize: 12 }}
              loading={isLoading}
              rowHeight={30}
              rows = {rows}
              columns={columns}
             /*  rows={codeinfodatatable}
              columns={columnDefinition} */
              rowsPerPageOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
              ]}
              editMode='cell'
              /* experimentalFeatures={{ newEditingApi: true }}  */
              onCellEditCommit={(params: GridCellEditCommitParams, event: MuiEvent<MuiBaseEvent>, details: GridCallbackDetails) => {
                //console.log(params);
                let tempeditrows = editedRows;
                 tempeditrows.push(params);
                setEditedRows(tempeditrows);
                //console.log(editedRows);
                const keyvar = params.field;
                const newdata = rows.map((p) =>
                  p.id === params.id ? { ...p, [keyvar]: params.value } : p
                );
                setRows(newdata);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
export default CODE_MANAGER