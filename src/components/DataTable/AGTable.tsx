import React, { forwardRef, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  rowHeight?: number,
  onRowClick?: (e: any) => void,
  onCellClick?: (e: any) => void,
  onRowDoubleClick?: (e: any) => void,
  onSelectionChange: (e: any) => void,
  onCellEditingStopped?: (e: any) => void,
  onRowDragEnd?: (e: any) => void,
  getRowStyle?: (e: any) => any
}
const AGTable = forwardRef((ag_data: AGInterface, gridRef:any) => {
  const [selectedrow, setSelectedrow] = useState(0);
  const rowStyle = { backgroundColor: 'transparent', height: '20px' };
  const getRowStyle = (params: any) => {
    return { backgroundColor: '#eaf5e1', fontSize: '0.6rem' };
  };
  const onRowdoubleClick = (params: any) => {
  }
  const onRowDragEnd = (params: any) => {
  }
  const gridRefDefault = useRef<AgGridReact<any>>(null);
  const tableSelectionChange = useCallback(() => {
      if (gridRef !== null) {
      const selectedrows = gridRef.current!.api.getSelectedRows().length;
      setSelectedrow(selectedrows);
    }
    else {
      const selectedrows = gridRefDefault.current!.api.getSelectedRows().length;
      setSelectedrow(selectedrows);
    }
  }, []);
  /*   function setIdText(id: string, value: string | number | undefined) {
      document.getElementById(id)!.textContent =
        value == undefined ? "undefined" : value + "";
    } */
  const setHeaderHeight = useCallback((value?: number) => {
    if (gridRef !== null) {
      gridRef.current!.api.setGridOption("headerHeight", value);
      //setIdText("headerHeight", value);
    }
    else {
      gridRefDefault.current!.api.setGridOption("headerHeight", value);
      //setIdText("headerHeight", value);
    }
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
    if (gridRef !== null) {
      gridRef.current!.api.exportDataAsCsv();
    }
    else {
      gridRefDefault.current!.api.exportDataAsCsv();
    }
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
          rowDragManaged={true} // Bật tính năng kéo hàng
          animateRows={true}
          rowData={ag_data.data ?? []}
          columnDefs={ag_data.columns ?? []}
          rowHeight={ag_data.rowHeight? ag_data.rowHeight : 25}
          defaultColDef={defaultColDef}
          ref={gridRef ?? gridRefDefault}
          onGridReady={() => {
            setHeaderHeight(20);
          }}
          columnHoverHighlight={true}
          rowStyle={rowStyle}
          getRowStyle={ag_data.getRowStyle ?? getRowStyle}
          getRowId={(params: any) => params.data.id?.toString() ?? params.data.id}
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
          onRowDragMove={ (e) => {}}
          onRowDragEnd={ag_data.onRowDragEnd ?? onRowDragEnd}
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
});
export default AGTable