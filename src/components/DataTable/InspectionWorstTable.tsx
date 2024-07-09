import React, { useState, useEffect } from 'react'
import { CustomResponsiveContainer, SaveExcel } from '../../api/GlobalFunction';
import { DataGrid } from 'devextreme-react';
import { Column, FilterRow, KeyboardNavigation, Scrolling, Selection, Summary, TotalItem } from 'devextreme-react/data-grid';
import { AiFillFileExcel } from 'react-icons/ai';
import {
  IconButton,
} from "@mui/material";
import { WEB_SETTING_DATA, WorstCodeData, WorstData } from '../../api/GlobalInterface';
import ChartWorstCodeByErrCode from '../Chart/INSPECTION/ChartWorstCodeByErrCode';
import { generalQuery, getGlobalSetting } from '../../api/Api';
import Swal from 'sweetalert2';
import './InspectionWorstTable.scss'
const InspectionWorstTable = ({ dailyClosingData, worstby, from_date, to_date, ng_type, listCode, cust_name }: { dailyClosingData: Array<WorstData>, worstby: string, from_date: string, to_date: string, ng_type: string, listCode: string[], cust_name: string }) => {
  //console.log(dailyClosingData)
  const [columns, setColumns] = useState<Array<any>>([]);
  const [worstByCodeData, setWorstByCodeData] = useState<Array<WorstCodeData>>([]); 
  const dailyClosingDataTable = React.useMemo(
    () => (
      <div className="datatb">
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(dailyClosingData, "DailyClosingData");
          }}
        >
          <AiFillFileExcel color='green' size={15} />
          Excel
        </IconButton>
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
            dataSource={dailyClosingData}
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
              getWorstByErrCode(e.data.ERR_CODE);
            }}
            onRowUpdated={(e) => {
              //console.log(e);
            }}
            onRowPrepared={(e: any) => {
              /*  if (e.data?.CUST_NAME_KD === 'TOTAL') {
                e.rowElement.style.background = "#e9fc40";
                e.rowElement.style.fontWeight = "bold";
              } */
            }}
          >
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
                column="id"
                summaryType="count"
                valueFormat={"decimal"}
              />
            </Summary>
          </DataGrid>
        </CustomResponsiveContainer>
      </div>
    ),
    [dailyClosingData, columns,getGlobalSetting()]
  );
  const getWorstByErrCode = (err_code: string) => {
    generalQuery("getInspectionWorstByCode", { FROM_DATE: from_date, TO_DATE: to_date, WORSTBY: worstby, NG_TYPE: ng_type, ERR_CODE: err_code, codeArray: listCode, CUST_NAME_KD: cust_name })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          let loadeddata = response.data.data.map(
            (element: WorstCodeData, index: number) => {
              return {
                ...element,
                NG_QTY: Number(element.NG_QTY),
                NG_AMOUNT: Number(element.NG_AMOUNT),
                INSPECT_TOTAL_QTY: Number(element.INSPECT_TOTAL_QTY),
                id: index
              };
            }
          );
          //console.log(loadeddata);
          setWorstByCodeData(loadeddata);
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    let keysArray = Object.getOwnPropertyNames(dailyClosingData[0]);
    let column_map = keysArray.map((e, index) => {
      if (e !== 'id')
        return {
          dataField: e,
          caption: e,
          width: 90,
          cellRender: (ele: any) => {
            if (e === 'NG_AMOUNT') {
              return <span style={{ color: "#050505", fontWeight: "bold" }}>
                {ele.data[e]?.toLocaleString("en-US", {
                  style: "currency",
                  currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                })}
              </span>
            }
            else if (e === 'NG_QTY') {
              return <span style={{ color: "#050505", fontWeight: "bold" }}>
                {ele.data[e]?.toLocaleString("en-US",)}
              </span>
            }
            else {
              return (<span style={{ color: "black", fontWeight: "normal" }}>
                {ele.data[e]}
              </span>)
            }
          },
        };
    });
    setColumns(column_map);    
    getWorstByErrCode(dailyClosingData[0].ERR_CODE);
    return () => {
    }
  }, [dailyClosingData])
  return (
    <div className='worstable'>
      <div className="table">
        {
          dailyClosingDataTable
        }
      </div>
      <div className="chartworstcode">
        {worstByCodeData.length > 0 && <ChartWorstCodeByErrCode dailyClosingData={worstByCodeData} worstby={worstby} />}
      </div>
    </div>
  )
}
export default InspectionWorstTable