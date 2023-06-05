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
import "./POandStockFull.scss"
import INSPECTION from '../../qc/inspection/INSPECTION';
import KHOTP from '../../kho/khotp/KHOTP';
import KHOLIEU from '../../kho/kholieu/KHOLIEU';
interface FCSTTableData {
  EMPL_NO?: string,
  FCST_ID: number;
  FCSTYEAR: number;
  FCSTWEEKNO: number;
  G_CODE: string;
  G_NAME_KD: string;
  G_NAME: string;
  EMPL_NAME: string;
  CUST_NAME_KD: string;
  PROD_PROJECT: string;
  PROD_MODEL: string;
  PROD_MAIN_MATERIAL: string;
  PROD_PRICE: number;
  W1: number;
  W2: number;
  W3: number;
  W4: number;
  W5: number;
  W6: number;
  W7: number;
  W8: number;
  W9: number;
  W10: number;
  W11: number;
  W12: number;
  W13: number;
  W14: number;
  W15: number;
  W16: number;
  W17: number;
  W18: number;
  W19: number;
  W20: number;
  W21: number;
  W22: number;
  W1A: number;
  W2A: number;
  W3A: number;
  W4A: number;
  W5A: number;
  W6A: number;
  W7A: number;
  W8A: number;
  W9A: number;
  W10A: number;
  W11A: number;
  W12A: number;
  W13A: number;
  W14A: number;
  W15A: number;
  W16A: number;
  W17A: number;
  W18A: number;
  W19A: number;
  W20A: number;
  W21A: number;
  W22A: number;
}
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
interface POFullKD {
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
const POandStockFull = () => {
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
    testinvoicetable: false,
    kholieu: false
  });
  const [userData, setUserData] = useContext(UserContext);
  const [isLoading, setisLoading] = useState(false); 
  const [codeCMS,setCodeCMS] =useState('');
  const [alltime, setAllTime] = useState(true); 
  const [pofulldatatable, setPOFULLDataTable] = useState<Array<any>>([]);
  const column_codeCMS = [
    { field: "id", headerName: "No", width: 80 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 150 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 170 },
    { field: "PO_QTY", type: 'number', headerName: "PO_QTY", width: 80, renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.PO_QTY.toLocaleString('en-US')}</b></span>} },
    { field: "TOTAL_DELIVERED",type: 'number',  headerName: "TOTAL_DELIVERED", width: 80, renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.TOTAL_DELIVERED.toLocaleString('en-US')}</b></span>} },
    { field: "PO_BALANCE",type: 'number',  headerName: "PO_BALANCE", width: 90 , renderCell: (params:any) => {return <span style={{color:'red'}}><b>{params.row.PO_BALANCE.toLocaleString('en-US')}</b></span>}},
    { field: "CHO_KIEM", type: 'number', headerName: "CHO_KIEM", width: 90 , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.CHO_KIEM.toLocaleString('en-US')}</b></span>}},
    { field: "CHO_CS_CHECK", type: 'number', headerName: "CS", width: 90, renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.CHO_CS_CHECK.toLocaleString('en-US')}</b></span>} },
    { field: "CHO_KIEM_RMA", type: 'number', headerName: "RMA", width: 90 , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.CHO_KIEM_RMA.toLocaleString('en-US')}</b></span>}},
    { field: "TONG_TON_KIEM", type: 'number', headerName: "Total TKiem", width: 110 , renderCell: (params:any) => {return <span style={{color:'black'}}><b>{params.row.TONG_TON_KIEM.toLocaleString('en-US')}</b></span>}},
    { field: "BTP", type: 'number', headerName: "BTP", width: 90 , renderCell: (params:any) => {return <span style={{color:'black'}}><b>{params.row.BTP.toLocaleString('en-US')}</b></span>}},
    { field: "TON_TP", type: 'number', headerName: "TON_TP", width: 90, renderCell: (params:any) => {return <span style={{color:'black'}}><b>{params.row.TON_TP.toLocaleString('en-US')}</b></span>} },
    { field: "BLOCK_QTY", type: 'number', headerName: "BLOCK_QTY", width: 90 , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.BLOCK_QTY.toLocaleString('en-US')}</b></span>}},
    { field: "GRAND_TOTAL_STOCK", headerName: "GRAND_TOTAL_STOCK", width: 90 , renderCell: (params:any) => {return <span style={{color:'green'}}><b>{params.row.GRAND_TOTAL_STOCK.toLocaleString('en-US')}</b></span>}},
    { field: "THUA_THIEU", type: 'number', headerName: "THUA_THIEU", width: 120 , renderCell: (params:any) => {return <span style={{color:'black'}}><b>{params.row.THUA_THIEU.toLocaleString('en-US')}</b></span>}},
  ];
  const column_codeKD = [
    { field: "id", headerName: "No", width: 80 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 170 },
    { field: "PO_QTY", type: 'number',headerName: "PO_QTY", width: 80, renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.PO_QTY.toLocaleString('en-US')}</b></span>} },
    { field: "TOTAL_DELIVERED", type: 'number',headerName: "TOTAL_DELIVERED", width: 80, renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.TOTAL_DELIVERED.toLocaleString('en-US')}</b></span>} },
    { field: "PO_BALANCE", type: 'number',headerName: "PO_BALANCE", width: 90 , renderCell: (params:any) => {return <span style={{color:'red'}}><b>{params.row.PO_BALANCE.toLocaleString('en-US')}</b></span>}},
    { field: "CHO_KIEM", type: 'number',headerName: "CHO_KIEM", width: 90 , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.CHO_KIEM.toLocaleString('en-US')}</b></span>}},
    { field: "CHO_CS_CHECK", type: 'number',headerName: "CHO_CS_CHECK", width: 90, renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.CHO_CS_CHECK.toLocaleString('en-US')}</b></span>} },
    { field: "CHO_KIEM_RMA", type: 'number',headerName: "CHO_KIEM_RMA", width: 90 , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.CHO_KIEM_RMA.toLocaleString('en-US')}</b></span>}},
    { field: "TONG_TON_KIEM", type: 'number',headerName: "Total TKiem", width: 90 , renderCell: (params:any) => {return <span style={{color:'black'}}><b>{params.row.TONG_TON_KIEM.toLocaleString('en-US')}</b></span>}},
    { field: "BTP", type: 'number',headerName: "BTP", width: 90 , renderCell: (params:any) => {return <span style={{color:'black'}}><b>{params.row.BTP.toLocaleString('en-US')}</b></span>}},
    { field: "TON_TP", type: 'number',headerName: "TON_TP", width: 90, renderCell: (params:any) => {return <span style={{color:'black'}}><b>{params.row.TON_TP.toLocaleString('en-US')}</b></span>} },
    { field: "BLOCK_QTY", type: 'number',headerName: "BLOCK_QTY", width: 90 , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.BLOCK_QTY.toLocaleString('en-US')}</b></span>}},
    { field: "GRAND_TOTAL_STOCK", type: 'number',headerName: "GRAND_TOTAL_STOCK", width: 90 , renderCell: (params:any) => {return <span style={{color:'green'}}><b>{params.row.GRAND_TOTAL_STOCK.toLocaleString('en-US')}</b></span>}},
    { field: "THUA_THIEU", type: 'number',headerName: "THUA_THIEU", width: 90 , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.THUA_THIEU.toLocaleString('en-US')}</b></span>}},
  ]
  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(column_codeCMS);
  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector /> 
        <IconButton className='buttonIcon'onClick={()=>{SaveExcel(pofulldatatable,"Ton kho full Table")}}><AiFillFileExcel color='green' size={25}/>SAVE</IconButton> 
        <GridToolbarQuickFilter/>
      </GridToolbarContainer>
    );
  }  
  const handletraPOFullCMS = ()=> {
    setisLoading(true);
    setColumnDefinition(column_codeCMS);
    generalQuery('traPOFullCMS',{
      allcode: alltime,    
      codeSearch: codeCMS,        
    })
    .then(response => {
        //console.log(response.data);
        let temp_summary :POFullSummary = {
          PO_BALANCE: 0, 
          TP: 0, 
          BTP: 0,
          CK: 0,
          BLOCK: 0,
          TONG_TON: 0,
          THUATHIEU: 0
        };
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: POFullCMS[] =  response.data.data.map((element:POFullCMS,index: number)=> {
            temp_summary.PO_BALANCE += element.PO_BALANCE;
            temp_summary.TP += element.TON_TP;
            temp_summary.BTP += element.BTP;
            temp_summary.CK += element.TONG_TON_KIEM;
            temp_summary.BLOCK += element.BLOCK_QTY;
            temp_summary.TONG_TON += element.GRAND_TOTAL_STOCK;
            temp_summary.THUATHIEU += element.THUA_THIEU<0 ? element.THUA_THIEU : 0;
            return {
              ...element,   id:  index                  
            }
          }) ;
          setPOFullSummary(temp_summary);
          setPOFULLDataTable(loadeddata);
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
  const handletraPOFullKD = ()=> {
    setisLoading(true);
    setColumnDefinition(column_codeKD);
    generalQuery('traPOFullKD',{
      allcode: alltime,    
      codeSearch: codeCMS,        
    })
    .then(response => {
        //console.log(response.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: POFullCMS[] =  response.data.data.map((element:POFullCMS,index: number)=> {
            return {
              ...element,   id:  index                  
            }
          })   
          setPOFULLDataTable(loadeddata);
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
      setSelection({...selection, trapo: true, thempohangloat:false, them1po:false,them1invoice:false,testinvoicetable: false,
        kholieu: false});
    }
    else if(choose ===2 )
    {
      setSelection({...selection, trapo: false, thempohangloat:true, them1po:false,them1invoice:false,testinvoicetable: false,
        kholieu: false});
    }
    else if(choose ===3 )
    {
      setSelection({...selection, trapo: false, thempohangloat:false, them1po:false,them1invoice:false,testinvoicetable: true,
        kholieu: false});
    }
    else if(choose ===4 )
    {
      setSelection({...selection, trapo: false, thempohangloat:false, them1po:false,them1invoice:false,testinvoicetable: false,
      kholieu: true});
    }
  }
  useEffect(()=>{
  },[]);
  return (
    <div className='poandstockfull'>
      <div className='mininavbar'>
        <div className='mininavitem'  onClick={() => setNav(1)} style={{backgroundColor:selection.trapo === true ? '#02c712':'#abc9ae', color: selection.trapo === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          PO+TK FULL
          </span>
        </div>  
        <div className='mininavitem'  onClick={() => setNav(2)} style={{backgroundColor:selection.thempohangloat === true ? '#02c712':'#abc9ae', color: selection.thempohangloat === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          Phòng Kiểm Tra
          </span>
        </div>  
        <div className='mininavitem'  onClick={() => setNav(3)} style={{backgroundColor:selection.testinvoicetable === true ? '#02c712':'#abc9ae', color: selection.testinvoicetable === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          Kho Thành Phẩm
          </span>
        </div>  
        <div className='mininavitem'  onClick={() => setNav(4)} style={{backgroundColor:selection.kholieu === true ? '#02c712':'#abc9ae', color: selection.kholieu === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
          Kho Liệu
          </span>
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
                <label>
                  <b>Chỉ code tồn PO</b>
                  <input
                    type='checkbox'
                    name='alltimecheckbox'
                    defaultChecked={alltime}
                    onChange={() => setAllTime(!alltime)}
                  ></input>
                </label>    
                <button className='tranhapkiembutton'  onClick={() => {
                  handletraPOFullCMS();
                }}>
                  Search(CMS)
                </button>   
                <button className='traxuatkiembutton'  onClick={() => {
                   handletraPOFullKD();
                }}>
                  Search(KD)
              </button> 
              </div>
              <div className="forminputcolumn">
                <table>
                  <thead>
                    <tr>
                      <td>PO BALANCE</td>
                      <td>TP</td>
                      <td>BTP</td>
                      <td>CK</td>
                      <td>BLOCK</td>
                      <td>TONG TON</td>
                      <td>THUA THIEU</td>
                    </tr>                   
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{color:'blue'}}>{pofullSummary.PO_BALANCE.toLocaleString('en-US')}</td>
                      <td style={{color:'purple'}}>{pofullSummary.TP.toLocaleString('en-US')}</td>
                      <td style={{color:'purple'}}>{pofullSummary.BTP.toLocaleString('en-US')}</td>
                      <td style={{color:'purple'}}>{pofullSummary.CK.toLocaleString('en-US')}</td>
                      <td style={{color:'red'}}>{pofullSummary.BLOCK.toLocaleString('en-US')}</td>
                      <td style={{color:'blue', fontWeight:'bold'}}>{pofullSummary.TONG_TON.toLocaleString('en-US')}</td>
                      <td style={{color:'brown', fontWeight:'bold'}}>{pofullSummary.THUATHIEU.toLocaleString('en-US')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className='tracuuFcstTable'>
            <DataGrid              
              components={{
                Toolbar: CustomToolbarPOTable,
                LoadingOverlay: LinearProgress,
              }}
              sx={{ fontSize: '0.7rem' }}
              loading={isLoading}
              rowHeight={30}
              rows={pofulldatatable}
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
      {
        selection.thempohangloat && <div className="inspection">
          <INSPECTION/>
        </div>
      }
      {
        selection.testinvoicetable && <div className="inspection">
        <KHOTP/>
        </div>
      }
      {
        selection.kholieu && <div className="inspection">
        <KHOLIEU/>
        </div>
      }
    </div>
  );
}
export default POandStockFull