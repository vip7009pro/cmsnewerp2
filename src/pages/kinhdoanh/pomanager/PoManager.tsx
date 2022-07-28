import { LinearProgress } from '@mui/material';
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { useState } from 'react'
import * as XLSX from 'xlsx';
import { SaveExcel } from '../../../api/GlobalFunction';
import "./PoManager.scss"

const PoManager = () => {
  const [uploadExcelJson, setUploadExcelJSon] = useState<Array<any>>([]);
  const [isLoading, setisLoading] = useState(false);   
  const [column_excel, setColumn_Excel]= useState<Array<any>>([]);

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />           
        <button className='saveexcelbutton' onClick={()=>{SaveExcel(uploadExcelJson,"Uploaded PO")}}>Save Excel</button>
        <GridToolbarQuickFilter/>
      </GridToolbarContainer>
    );
  }


  const readUploadFile = (e:any) => {
    e.preventDefault();    
    if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e:any) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json:any = XLSX.utils.sheet_to_json(worksheet); 
            const keys = Object.keys(json[0]);
            const uploadexcelcolumn = keys.map((element, index) => {
              return {
                 field: element, headerName: element, width: 100
              }
            });
            setColumn_Excel(uploadexcelcolumn);       

            setUploadExcelJSon(json.map((element:any, index:number) => {
              return {...element, id: index}
            }
            ));
        };
        reader.readAsArrayBuffer(e.target.files[0]);        
    }
}
  return (
    <div className='pomanager'>
      <div className="mininavbar">
        Mini Navbar
      </div>
      <div className="newpo">
        Thêm PO Hàng Loạt
        <div className="batchnewpo">
          
          <form className='formupload'>
            Chọn file excel
            <label htmlFor='upload'>Select File</label>
            <input
              type='file'
              name='upload'
              id='upload'
              onChange={(e:any)=> {readUploadFile(e)}}
            />
          </form>
          <div className='insertPOTable'>
            {1 &&<DataGrid
              components={{
                Toolbar: CustomToolbar, 
                LoadingOverlay: LinearProgress,
              }}
              loading={isLoading}
              rowHeight={35}
              rows={uploadExcelJson}
              columns={column_excel}
              rowsPerPageOptions={[5, 10, 50, 100, 500,1000,5000,10000,100000]}
              editMode='row'    
              getRowHeight={() => 'auto'}              
            />}
          </div>
        </div>
        <div className="singlenewpo">

        </div>
       
      </div>
      <div className="traform">

      </div>     
    </div>
  );
}

export default PoManager