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
const CustomerDailyClosing = () => {
  const [dailyClosingData, setDailyClosingData] = useState<any>([]);
  const [columns, setColumns] = useState<Array<any>>([]);
  const loadDailyClosing = () => {
    generalQuery("getDailyClosingKD", {
      FROM_DATE: moment.utc().format('YYYY-MM-01'),
      TO_DATE: moment.utc().format('YYYY-MM-DD')
    })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loadeddata =
        response.data.data.map(
          (element: any, index: number) => {
            return {
              ...element,
              id: index
            };
          },
          );
          setDailyClosingData(loadeddata);
          let keysArray = Object.getOwnPropertyNames(loadeddata[0]);
          let column_map = keysArray.map((e, index) => {
            return {
              dataField: e,
              caption: e,
              width: 100,
              cellRender: (ele: any) => {
                //console.log(ele);
                if (['CUST_NAME_KD', 'id'].indexOf(e) > -1) {
                  return <span>{ele.data[e]}</span>;
                }
                else if (e === 'DELIVERED_AMOUNT') {
                  return <span style={{ color: "#050505", fontWeight: "bold" }}>
                  {ele.data[e]?.toLocaleString("en-US", {
                    style: "currency",
                    currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                  })}
                  </span>
                }
                else {
                  if (ele.data['CUST_NAME_KD'] === 'TOTAL') {
                    return (<span style={{ color: "green", fontWeight: "bold" }}>
                    {ele.data[e]?.toLocaleString("en-US", {
                      style: "currency",
                      currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                    })}
                    </span>)
                  }
                  else {
                    return (<span style={{ color: "green", fontWeight: "normal" }}>
                    {ele.data[e]?.toLocaleString("en-US", {
                      style: "currency",
                      currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                    })}
                    </span>)
                  }
                }
              },
            };
          });
          setColumns(column_map);
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          const lastmonth = moment().subtract(1, 'months');
          generalQuery("getDailyClosingKD", {
            FROM_DATE: lastmonth.startOf('month').format('YYYY-MM-DD'),
            TO_DATE:lastmonth.endOf('month').format('YYYY-MM-DD')
          })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              let loadeddata =
              response.data.data.map(
                (element: any, index: number) => {
                  return {
                    ...element,
                    id: index
                  };
                },
                );
                setDailyClosingData(loadeddata);
                let keysArray = Object.getOwnPropertyNames(loadeddata[0]);
                let column_map = keysArray.map((e, index) => {
                  return {
                    dataField: e,
                    caption: e,
                    width: 100,
                    cellRender: (ele: any) => {
                      //console.log(ele);
                      if (['CUST_NAME_KD', 'id'].indexOf(e) > -1) {
                        return <span>{ele.data[e]}</span>;
                      }
                      else if (e === 'DELIVERED_AMOUNT') {
                        return <span style={{ color: "#050505", fontWeight: "bold" }}>
                        {ele.data[e]?.toLocaleString("en-US", {
                          style: "currency",
                          currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                        })}
                        </span>
                      }
                      else {
                        if (ele.data['CUST_NAME_KD'] === 'TOTAL') {
                          return (<span style={{ color: "green", fontWeight: "bold" }}>
                          {ele.data[e]?.toLocaleString("en-US", {
                            style: "currency",
                            currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                          })}
                          </span>)
                        }
                        else {
                          return (<span style={{ color: "green", fontWeight: "normal" }}>
                          {ele.data[e]?.toLocaleString("en-US", {
                            style: "currency",
                            currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                          })}
                          </span>)
                        }
                      }
                    },
                  };
                });
                setColumns(column_map);
              } else {
                //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
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
        [dailyClosingData, getGlobalSetting()]
        );
        useEffect(() => {
          loadDailyClosing();
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