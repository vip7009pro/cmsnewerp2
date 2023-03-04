import React from "react";
import "devextreme/dist/css/dx.light.css";

import { Column, DataGrid } from "devextreme-react/data-grid";
import { employees } from "./employees";

function DATATBNEW() {
  return (
    <div className='App'>
      <DataGrid
      autoNavigateToFocusedRow={true}      
     
        allowColumnReordering={true}
        allowColumnResizing={true}
        columnAutoWidth={false}
        dataSource={employees}
        keyExpr='EmployeeID'
      >
        <Column dataField='EmployeeID' fixed={false} ></Column>
        <Column dataField='FullName' fixed={true} ></Column>
        <Column dataField='Position' fixed={false} ></Column>
        <Column dataField='TitleOfCourtesy' fixed={false} ></Column>
        <Column dataField='BirthDate' fixed={false} ></Column>
        <Column dataField='HireDate' fixed={false} ></Column>
        <Column dataField='Address' fixed={false} ></Column>
        <Column dataField='City' fixed={false} ></Column>
        <Column dataField='Region' fixed={false} ></Column>
        <Column dataField='PostalCode' fixed={false} ></Column>
        <Column dataField='Country' fixed={false} ></Column>
        <Column dataField='HomePhone' fixed={false} ></Column>
        <Column dataField='Extension' fixed={false} ></Column>
        <Column dataField='Photo' fixed={false} ></Column>
        <Column dataField='Notes' fixed={false} ></Column>
        <Column dataField='ReportsTo' fixed={false} ></Column>     
        
      </DataGrid>
    </div>
  );
}

export default DATATBNEW;
