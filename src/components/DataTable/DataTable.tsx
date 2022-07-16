import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import "../DataTable/DataTable.scss";
export default function DataTable({ columns, rows, title } : {columns:any, rows:any, title?:string }) {
  return (
    <div className='datagrid'>
      <div className='grid_title'>{title}</div>
      <div className='grid_table'>
        <DataGrid
          rows={rows}
          columns={columns}         
          rowsPerPageOptions={[5,10,50,100]}
          checkboxSelection
          onSelectionModelChange={(ids) => {  
            const selectedID = new Set(ids);          
            var datafilter = rows.filter((element:any) => selectedID.has(element.id));
            console.log(datafilter);            
          }}
        />
      </div>
    </div>
  );
}
