import { Autocomplete, IconButton,  LinearProgress, TextField} from '@mui/material';
import { DataGrid, GridSelectionModel, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import moment from 'moment';
import  { useContext, useEffect, useState, useTransition } from 'react'
import {FcSearch } from 'react-icons/fc';
import {AiFillFileExcel } from "react-icons/ai";
import Swal from 'sweetalert2';
import { generalQuery } from '../../../api/Api';
import { UserContext } from '../../../api/Context';
import { SaveExcel } from '../../../api/GlobalFunction';
import "./CUST_MANAGER.scss"

interface CUST_INFO {
   id: string,
   name: string, 
   CUST_NAME_KD: string

}
const CUST_MANAGER = () => {

  const [selection, setSelection] = useState<any>({
    trapo: true,
    thempohangloat:false,
    them1po: false,
    them1invoice:false,
    testinvoicetable: false
  });
  const [userData, setUserData] = useContext(UserContext);
  const [isLoading, setisLoading] = useState(false);
  const [custinfodatatable, setCUSTINFODataTable] = useState<Array<any>>([]);
  const [cust_cd, setCust_Cd] = useState('0000');
  const [cust_name, setCustName] = useState('Seojin Vina');
  const [cust_name_kd, setCust_Name_KD] = useState('SEOJIN');
  const [edittable,setEditTable] = useState(true);
  const handleEditTable = (e: React.ChangeEvent<HTMLInputElement>) => {
    

  }
  let column_custinfo = [
    { field: "id", headerName: "CUST_CD", width: 80, renderCell: (params:any) => {return <span style={{color:'gray'}}><b><input className='customerinput' disabled={edittable} onChange={(e:React.ChangeEvent<HTMLInputElement>)=> {handleEditTable(e);}} defaultValue={params.row.id}></input></b></span>}  },
    { field: "name", headerName: "CUST_NAME", width: 280, renderCell: (params:any) => {return <span style={{color:'gray'}}><b><input className='customerinput' disabled={edittable}   defaultValue={params.row.name}></input></b></span>}   },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 220 , renderCell: (params:any) => {return <span style={{color:'gray'}}><b><input className='customerinput' disabled={edittable} defaultValue={params.row.CUST_NAME_KD}></input></b></span>}},   
  ];

  const handleEmployeeSelection = (ids:GridSelectionModel)=> {
    const selectedID = new Set(ids);
    var datafilter = custinfodatatable.filter((element: any) =>
      selectedID.has(element.id)
    );             
    if(datafilter.length >0)
    {
        setCust_Cd(datafilter[datafilter.length-1].id);
        setCustName(datafilter[datafilter.length-1].name);
        setCust_Name_KD(datafilter[datafilter.length-1].CUST_NAME_KD);      
       
    } 
}

  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(column_custinfo);
  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector /> 
        <IconButton className='buttonIcon'onClick={()=>{SaveExcel(custinfodatatable,"Code Info Table")}}><AiFillFileExcel color='green' size={25}/>SAVE</IconButton> 
        <button onClick={()=>{setEditTable(!edittable); console.log(edittable); setColumnDefinition(column_custinfo)}}>Bật Tắt Sửa</button>
        <GridToolbarQuickFilter/>
      </GridToolbarContainer>
    );
  }  
  const handleCUSTINFO = ()=> {
    setisLoading(true);
    setColumnDefinition(column_custinfo);
    generalQuery('get_listcustomer',{ 
    })
    .then(response => {
       /// console.log(response.data.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: CUST_INFO[] =  response.data.data.map((element:CUST_INFO,index: number)=> {
            return {
              ...element, 
            }
          })
          setCUSTINFODataTable(loadeddata);
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

  const handle_addCustomer = ()=> {
    setisLoading(true);
    setColumnDefinition(column_custinfo);
    generalQuery('add_customer',{ 
        CUST_CD: cust_cd,
        CUST_NAME: cust_name,
        CUST_NAME_KD: cust_name_kd
    })
    .then(response => {
       /// console.log(response.data.data);
        if(response.data.tk_status !=='NG')
        {         
          setisLoading(false);
          Swal.fire("Thông báo", "Thêm khách thành công", "success");  
        }
        else
        {
          Swal.fire("Thông báo", "Thêm khách thất bại: " + response.data.message, "error");  
          setisLoading(false);
        }        
    })
    .catch(error => {
        console.log(error);
    });
  }
  
  const handle_editCustomer = ()=> {
    setisLoading(true);
    setColumnDefinition(column_custinfo);
    generalQuery('edit_customer',{ 
        CUST_CD: cust_cd,
        CUST_NAME: cust_name,
        CUST_NAME_KD: cust_name_kd
    })
    .then(response => {
       /// console.log(response.data.data);
        if(response.data.tk_status !=='NG')
        {         
          setisLoading(false);
          Swal.fire("Thông báo", "Sửa khách thành công", "success");  
        }
        else
        {
          Swal.fire("Thông báo", "Sửa khách thất bại: " + response.data.message, "error");  
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
    handleCUSTINFO();
  },[]);

  return (
  
    <div className='customermamanger'>   
      <span style={{fontWeight:'bold', fontSize:20, marginTop:5 }}>Quản lý Khách Hàng</span>
      {
        selection.trapo && (
        <div className='tracuuFcst'>     
            
          <div className='tracuuFcstTable'>            
            <DataGrid
              components={{
                Toolbar: CustomToolbarPOTable,
                LoadingOverlay: LinearProgress,
              }}
              sx={{ fontSize: 12 }}
              loading={isLoading}
              rowHeight={30}
              rows={custinfodatatable}
              columns={columnDefinition}
              rowsPerPageOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
              ]}
              editMode='row'   
              onSelectionModelChange={(ids) => {
                handleEmployeeSelection(ids);
              }}           
            />
          </div>
          <div className="editcustomerform">
          <div className='formnho'>
            <div className='dangkyform'>
            <h3>Thêm - Sửa khách hàng</h3>           
              <div className='dangkyinput'>
                <div className='dangkyinputbox'>                 
                  <label>
                    <b>Mã khách hàng:</b>{" "}
                  <TextField  value={cust_cd}  onChange={(e:React.ChangeEvent<HTMLInputElement>)=> {setCust_Cd(e.target.value)}} size="small" color="success" className='autocomplete' id="outlined-basic" label="Số PO" variant="outlined" />
                  </label>
                  <label>
                    <b>Tên khách hàng (dài):</b>{" "}
                  <TextField  value={cust_name}  onChange={(e:React.ChangeEvent<HTMLInputElement>)=> {setCustName(e.target.value)}} size="small" color="success" className='autocomplete' id="outlined-basic" label="INVOICE QTY" variant="outlined" />
                  </label>                               
                  <label>
                    <b>Tên khách hàng (KD):</b>{" "}
                  <TextField  value={cust_name_kd}   onChange={(e:React.ChangeEvent<HTMLInputElement>)=> {setCust_Name_KD(e.target.value)}} size="small"   className='autocomplete' id="outlined-basic" label="Remark" variant="outlined" />
                  </label>                
                </div>                
              </div>
              <div className='dangkybutton'>
                <button className='thembutton' onClick={()=>{handle_addCustomer();}}>Thêm</button>
                <button className='suabutton' onClick={()=>{handle_editCustomer();}}>Sửa</button>                
               
              </div>
            </div>
          </div>
          </div>
        </div>
        )
      }
     
    </div>
  );
}
export default CUST_MANAGER