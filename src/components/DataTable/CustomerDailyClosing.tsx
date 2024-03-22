import React, { useState, useEffect } from 'react'
import { CustomResponsiveContainer, SaveExcel } from '../../api/GlobalFunction';
import { DataGrid } from 'devextreme-react';
import { Column, FilterRow, KeyboardNavigation, Scrolling, Selection, Summary, TotalItem } from 'devextreme-react/data-grid';
import { generalQuery, getGlobalSetting } from '../../api/Api';
import Swal from 'sweetalert2';
import moment from 'moment';
import { AiFillFileExcel } from 'react-icons/ai';
import {
  IconButton,
} from "@mui/material";
import { WEB_SETTING_DATA } from '../../api/GlobalInterface';
const CustomerDailyClosing = ({data, columns} : {data: Array<any>, columns: Array<any>}) => {  
  const dailyClosingDataTable = React.useMemo(
    () => (
      <div className="datatb">        
        <CustomResponsiveContainer>
          <DataGrid
            style={{ fontSize: "0.7rem" }}
            autoNavigateToFocusedRow={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={data}
            columnWidth="auto"
            keyExpr="id"
            height={"100%"}
            showBorders={true}
            onSelectionChanged={(e) => {
              //console.log(e.selectedRowsData);
              //setselecterowfunction(e.selectedRowsData);
              //setSelectedRowsData(e.selectedRowsData);
            }}
            onRowClick={(e) => {
              //console.log(e.data);                  
            }}
            onRowUpdated={(e) => {
              //console.log(e);
            }}
            onRowPrepared={(e: any) => {
              if (e.data?.CUST_NAME_KD === 'TOTAL') {
                e.rowElement.style.background = "#e9fc40";
                e.rowElement.style.fontWeight = "bold";
              }

            }}
          >
            <FilterRow visible={true} />
            <KeyboardNavigation
              editOnKeyPress={true}
              enterKeyAction={"moveFocus"}
              enterKeyDirection={"column"}
            />
            <Selection mode="single" selectAllMode="allPages" />
            <Scrolling
              useNative={false}
              scrollByContent={true}
              scrollByThumb={true}
              showScrollbar="onHover"
              mode="virtual"
            />
            {columns.map((column, index) => {
              //console.log(column);
              return <Column key={index} {...column}></Column>;
            })}
            <Summary>
              <TotalItem
                alignment="right"
                column="PQC1_ID"
                summaryType="count"
                valueFormat={"decimal"}
              />
            </Summary>
          </DataGrid>
        </CustomResponsiveContainer>
      </div>
    ),
    [data, getGlobalSetting()]
  );
  useEffect(() => {    
    return () => {
    }
  }, [])
  return (
    <div className='customerdailyclosing'>
      {
        dailyClosingDataTable
      }
    </div>
  )
}
export default CustomerDailyClosing