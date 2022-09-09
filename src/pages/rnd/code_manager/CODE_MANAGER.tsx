import { IconButton,  LinearProgress} from '@mui/material';
import { DataGrid, GridSelectionModel, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import moment from 'moment';
import  { useContext, useEffect, useState, useTransition } from 'react'
import {FcSearch } from 'react-icons/fc';
import {AiFillFileExcel } from "react-icons/ai";
import Swal from 'sweetalert2';
import { generalQuery } from '../../../api/Api';
import { UserContext } from '../../../api/Context';
import { SaveExcel } from '../../../api/GlobalFunction';
import "./CODE_MANAGER.scss"

interface POFullCMS {
  G_CODE: string,
  G_NAME: string,
  G_NAME_KD: string,
  PO_QTY: number,
  TOTAL_DELIVERED: number,
  PO_BALANCE: number,
  CHO_KIEM: number,
  CHO_CS_CHECK: number,
  CHO_KIEM_RMA: number,
  TONG_TON_KIEM: number,
  BTP: number,
  TON_TP: number,
  BLOCK_QTY: number,
  GRAND_TOTAL_STOCK: number,
  THUA_THIEU: number,
}
interface POFullSummary {
  PO_BALANCE: number, 
  TP: number, 
  BTP: number,
  CK: number,
  BLOCK: number,
  TONG_TON: number,
  THUATHIEU: number
}

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
  const [pofullSummary, setPOFullSummary] = useState<POFullSummary>({
    PO_BALANCE: 0, 
    TP: 0, 
    BTP: 0,
    CK: 0,
    BLOCK: 0,
    TONG_TON: 0,
    THUATHIEU: 0
  });
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
  const [alltime, setAllTime] = useState(true); 
  const [codeinfodatatable, setCODEINFODataTable] = useState<Array<any>>([]);

  const column_codeinfo = [
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 180 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 80 },
    { field: "PROD_LAST_PRICE", headerName: "PRICE", width: 80 },
    { field: "PD", headerName: "PD", width: 80 },
    { field: "CAVITY", headerName: "CAVITY", width: 80 },
    { field: "PACKING_QTY", headerName: "PACKING_QTY", width: 80 },
    { field: "G_WIDTH", headerName: "G_WIDTH", width: 80 },
    { field: "G_LENGTH", headerName: "G_LENGTH", width: 80 },
    { field: "PROD_PROJECT", headerName: "PROD_PROJECT", width: 120 },
    { field: "PROD_MODEL", headerName: "PROD_MODEL", width: 120 },
    { field: "M_NAME_FULLBOM", headerName: "FULLBOM", width: 250 },
    { field: "BANVE", headerName: "BANVE", width: 80 , renderCell: (params:any) => {
      let hreftlink = '/banve/' + params.row.G_CODE + '.pdf';
      if(params.row.BANVE !=='N')
      return <span style={{color:'gray'}}>
        <a target="_blank" rel="noopener noreferrer" href={hreftlink}>LINK</a>
      </span>
    }},
    { field: "NO_INSPECTION", headerName: "NO_INSPECTION", width: 100 },
    { field: "USE_YN", headerName: "USE_YN", width: 80 },
  ];

  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(column_codeinfo);
  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector /> 
        <IconButton className='buttonIcon'onClick={()=>{SaveExcel(codeinfodatatable,"Code Info Table")}}><AiFillFileExcel color='green' size={25}/>SAVE</IconButton> 
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
          setCODEINFODataTable(loadeddata);
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
    //handleCODEINFO();
  },[]);

  return (
    <div className='poandstockfull'>
      <div className='mininavbar'>
        <div className='mininavitem' onClick={() => setNav(1)}>
          <span className='mininavtext'>Thông tin sản phẩm</span>
        </div>       
      </div>
      {
        selection.trapo && (
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
                <button className='traxuatkiembutton'  onClick={() => {
                   handleCODEINFO();
                }}>
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
              rows={codeinfodatatable}
              columns={columnDefinition}
              rowsPerPageOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
              ]}
              editMode='row'              
            />
          </div>
        </div>
        )
      }
     
    </div>
  );
}
export default CODE_MANAGER