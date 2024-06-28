import React, { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './AGTable.scss'
import { AgGridReact } from 'ag-grid-react';
import { IconButton } from '@mui/material';
import { AiFillFileExcel } from 'react-icons/ai';
import { SaveExcel } from '../../api/GlobalFunction';
interface AGInterface {
  data: Array<any>,
  columns: Array<any>,
  toolbar?: ReactElement,
  showFilter?: boolean,
  suppressRowClickSelection?: boolean,
  onRowClick?: (e: any) => void,
  onCellClick?: (e: any) => void,
  onRowDoubleClick?: (e: any) => void,
  onSelectionChange: (e: any) => void,
  onCellEditingStopped?: (e: any) => void,
  getRowStyle?: (e: any) => any
}
const AGTable = (ag_data: AGInterface) => {
  const [selectedrow, setSelectedrow] = useState(0);
  const rowStyle = { backgroundColor: 'transparent', height: '20px' };
  const getRowStyle = (params: any) => {
    return { backgroundColor: '#eaf5e1', fontSize: '0.6rem' };
  };
  const onRowdoubleClick = (params: any) => {
  }
  const gridRef = useRef<AgGridReact<any>>(null);
  const tableSelectionChange = useCallback(() => {
    const selectedrows = gridRef.current!.api.getSelectedRows().length;
    setSelectedrow(selectedrows);
  }, []);
  /*   function setIdText(id: string, value: string | number | undefined) {
      document.getElementById(id)!.textContent =
        value == undefined ? "undefined" : value + "";
    } */
  const setHeaderHeight = useCallback((value?: number) => {
    gridRef.current!.api.setGridOption("headerHeight", value);
    //setIdText("headerHeight", value);
  }, []);
  const defaultColDef = useMemo(() => {
    return {
      initialWidth: 100,
      wrapHeaderText: true,
      autoHeaderHeight: false,
      editable: true,
      floatingFilter: ag_data.showFilter ?? true,
      filter: true,
      headerCheckboxSelectionFilteredOnly: true,
    };
  }, []);
  const onExportClick = () => {
    gridRef.current!.api.exportDataAsCsv();
  };

  useEffect(() => {
  }, [])
  return (
    <div className='agtable'>
      {ag_data.toolbar !== undefined && <div className="toolbar">
        {ag_data.toolbar}
        <IconButton
          className="buttonIcon"
          onClick={() => {
            onExportClick();            
          }}
        >
          <AiFillFileExcel color="green" size={15} />
          CSV
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {           
            SaveExcel(ag_data.data, "Data Table");
          }}
        >
          <AiFillFileExcel color="green" size={15} />
          EXCEL
        </IconButton>
      </div>}
      <div className="ag-theme-quartz">
        <AgGridReact
          rowData={ag_data.data}
          columnDefs={ag_data.columns}
          rowHeight={25}
          defaultColDef={defaultColDef}
          ref={gridRef}
          onGridReady={() => {
            setHeaderHeight(20);
          }}
          columnHoverHighlight={true}
          rowStyle={rowStyle}
          getRowStyle={ag_data.getRowStyle ?? getRowStyle}
          getRowId={(params: any) => params.data.id}
          rowSelection={"multiple"}
          rowMultiSelectWithClick={false}
          suppressRowClickSelection={ag_data.suppressRowClickSelection ?? true}
          enterNavigatesVertically={true}
          enterNavigatesVerticallyAfterEdit={true}
          stopEditingWhenCellsLoseFocus={true}
          rowBuffer={10}
          debounceVerticalScrollbar={false}
          enableCellTextSelection={true}
          floatingFiltersHeight={23}
          onSelectionChanged={(params: any) => {
            ag_data.onSelectionChange(params);
            tableSelectionChange();
          }}
          onRowClicked={ag_data.onRowClick}
          onRowDoubleClicked={ag_data.onRowDoubleClick ?? onRowdoubleClick}
          onCellEditingStopped={ag_data.onCellEditingStopped}
          onCellClicked={ag_data.onCellClick}          
        />
      </div>
      <div className="bottombar">
        <div className="selected">
          {selectedrow !== 0 && <span>
            Selected: {selectedrow}/{ag_data.data.length} rows
          </span>}
        </div>
        <div className="totalrow">
          <span>
            Total: {ag_data.data.length} rows
          </span>
        </div>
      </div>
    </div>
  )
}
export default AGTable