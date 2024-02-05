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
import './CustomerPoBalanceByTypeNew.scss'
import { WEB_SETTING_DATA } from '../../api/GlobalInterface';
const CustomerPobalancebyTypeNew = () => {
    const [pobalancecustomerbytypedata, setPoBalanceCustomerData] = useState<any>([]);
    const [columns, setColumns] = useState<Array<any>>([]);
    const loadpobalance = () => {
        generalQuery("customerpobalancebyprodtype_new", {
        })
            .then((response) => {
                if (response.data.tk_status !== "NG") {
                    let loadeddata =
                        response.data.data.map(
                            (element: any, index: number) => {
                                return {                                   
                                    ...element,
                                    id: index,                                    
                                };
                            },
                        );
                    setPoBalanceCustomerData(loadeddata);
                    let keysArray = Object.getOwnPropertyNames(loadeddata[0]);
                    let column_map = keysArray.map((e, index) => {
                        return {
                            dataField: e,
                            caption: e,
                            width: 100,
                            cellRender: (ele: any) => {
                                //console.log(ele);
                                if (['CUST_NAME_KD', 'id'].indexOf(e) > -1) {
                                    return <span style={{fontWeight:'bold'}}>{ele.data[e]}</span>;
                                }
                                else if (e === 'TOTAL_QTY') {
                                    return <span style={{ color: "#2515fc", fontWeight: "bold" }}>
                                        {ele.data[e]?.toLocaleString("en-US", )}
                                    </span>
                                }
                                else if (e === 'TOTAL_AMOUNT') {
                                    return <span style={{ color: "#8105a0", fontWeight: "bold" }}>
                                        {ele.data[e]?.toLocaleString("en-US", {
                                            style: "currency",
                                            currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                                        })}
                                    </span>
                                }
                                else if (e.indexOf('QTY') > -1) {
                                    return <span style={{ color: "#0011ff", fontWeight: "normal" }}>
                                        {ele.data[e]?.toLocaleString("en-US", )}
                                    </span>
                                }
                                else {
                                    return <span style={{ color: "green", fontWeight: "normal" }}>
                                        {ele.data[e]?.toLocaleString("en-US", {
                                            style: "currency",
                                            currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                                        })}
                                    </span>
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
    
    const pobalancecustomerbytypedatatable = React.useMemo(
        () => (
            <div className="datatb">
                <IconButton
                    className='buttonIcon'
                    onClick={() => {
                        SaveExcel(pobalancecustomerbytypedata, "POBalanceTable");
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
                        dataSource={pobalancecustomerbytypedata}
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
        [pobalancecustomerbytypedata]
    );
    useEffect(() => {
        loadpobalance();
        return () => {
        }
    }, [])
    return (
        <div className='customerpobalance'>
        {
         pobalancecustomerbytypedatatable
        }
        </div>
    )
}
export default CustomerPobalancebyTypeNew