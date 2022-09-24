import { IconButton, LinearProgress } from '@mui/material'
import { DataGrid, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarQuickFilter } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { AiFillFileExcel } from 'react-icons/ai'
import Swal from 'sweetalert2'
import { generalQuery } from '../../api/Api'
import { SaveExcel } from '../../api/GlobalFunction'
import './CustomerPOBalanceByType.scss'

interface CustomerPOBalanceByTypeData {
    CUST_NAME_KD: string,
    TOTAL_PO_BALANCE: string,
    TSP: number,
    LABEL: number,
    UV: number,
    OLED: number,
    TAPE: number,
    RIBBON: number,
    SPT: number,
    OTHERS: number
}
const CustomerPOBalanceByType = () => {

    const [customerpobalancebytypedata, setCustomerPoBalanceByType] = useState<Array<CustomerPOBalanceByTypeData>>([]);
    const [isLoading, setIsLoading] =useState(false);

    const customerpobalancebytype_potable = [   
        { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 120 },
        { field: "TOTAL_PO_BALANCE", type:'number',headerName: "TOTAL_PO_BALANCE", width: 90  , renderCell: (params:any) => {return <span style={{color:'red'}}><b>{params.row.TOTAL_PO_BALANCE.toLocaleString('en-US')}</b></span>}},
        { field: "TSP", type:'number',headerName: "TSP", width: 90 , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.TSP.toLocaleString('en-US')}</b></span>} },
        { field: "LABEL", type:'number',headerName: "LABEL", width: 90 , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.LABEL.toLocaleString('en-US')}</b></span>} },
        { field: "UV", type:'number',headerName: "UV", width: 90  , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.UV.toLocaleString('en-US')}</b></span>}},
        { field: "OLED", type:'number',headerName: "OLED", width: 90  , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.OLED.toLocaleString('en-US')}</b></span>}},
        { field: "TAPE", type:'number',headerName: "TAPE", width: 90  , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.TAPE.toLocaleString('en-US')}</b></span>}},
        { field: "RIBBON", type:'number',headerName: "RIBBON", width: 90  , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.RIBBON.toLocaleString('en-US')}</b></span>}},
        { field: "SPT", type:'number',headerName: "SPT", width: 90  , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.SPT.toLocaleString('en-US')}</b></span>}},
        { field: "OTHERS", type:'number',headerName: "OTHERS", width: 90 , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.OTHERS.toLocaleString('en-US')}</b></span>}},
       
      ];

    function CustomToolbarPOTable() {
        return (
          <GridToolbarContainer>             
            <IconButton className='buttonIcon'onClick={()=>{SaveExcel(customerpobalancebytypedata,"Customer PO Balance Table")}}><AiFillFileExcel color='green' size={25}/>SAVE</IconButton>               
            <GridToolbarQuickFilter/>
          </GridToolbarContainer>
        );
      }

    const handleGetYearlyClosing = () => {

        generalQuery("POBalanceByCustomer", {  })
        .then((response) => {  
          if (response.data.tk_status !== "NG") {
            const loadeddata: CustomerPOBalanceByTypeData[] =  response.data.data.map((element:CustomerPOBalanceByTypeData,index: number)=> {
              return {
                ...element,
              }
            });
            setCustomerPoBalanceByType(loadeddata);
            //console.log(loadeddata);
           /*  Swal.fire(
              "Thông báo",
              "Đã load " + response.data.data.length + " dòng",
              "success"
            ); */
          } else {
            Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
      }
      useEffect(()=>{
        handleGetYearlyClosing();
      },[])
  return (
    <div className='customerpobalancebytype'>
        <DataGrid
                sx={{fontSize:12, flex:1}}
                components={{
                Toolbar: CustomToolbarPOTable,
                LoadingOverlay: LinearProgress,
                }}
                loading={isLoading}
                rowHeight={30}
                rows={customerpobalancebytypedata}
                columns={customerpobalancebytype_potable}
                getRowId={(row) => row.CUST_NAME_KD}
            />
        
    </div>
  )
}

export default CustomerPOBalanceByType