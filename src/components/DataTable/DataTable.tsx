import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import "../DataTable/DataTable.scss";
export default function DataTable({ columns, rows } : {columns:any, rows:any }) {
  return (
    <div className='datagrid'>
      <div className='grid_title'>Recent transactions</div>
      <div className='grid_table'>
        <DataGrid
          rows={rows}
          columns={columns}         
          rowsPerPageOptions={[5,10,50,100]}
          checkboxSelection
        />
      </div>
    </div>
  );
}
