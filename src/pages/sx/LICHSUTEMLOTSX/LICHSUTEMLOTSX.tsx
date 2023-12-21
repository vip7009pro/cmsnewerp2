import {
  Button,
  IconButton,
  createFilterOptions,
} from "@mui/material";
import {
  Column,
  Editing,
  FilterRow,
  Pager,
  Scrolling,
  SearchPanel,
  Selection,
  DataGrid,
  Paging,
  Toolbar,
  Item,
  Export,
  ColumnChooser,
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import { UserContext } from "../../../api/Context";
import { generalQuery, getCompany } from "../../../api/Api";
import { CustomResponsiveContainer, SaveExcel } from "../../../api/GlobalFunction";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotTable from "../../../components/PivotChart/PivotChart";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import {
  CustomerListData,
  CSCONFIRM_DATA,
  CS_RMA_DATA,
  CS_CNDB_DATA,
  CS_TAXI_DATA,
  TEMLOTSX_DATA,
} from "../../../api/GlobalInterface";
import { DataDiv, DataTBDiv, FormButtonColumn, FromInputColumn, FromInputDiv, PivotTableDiv, QueryFormDiv } from "../../../components/StyledComponents/ComponentLib";
const LICHSUTEMLOTSX = () => {
  const [option, setOption] = useState("dataconfirm");
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [lichsutemlotdata, setlichsutemlotdata] = useState<Array<TEMLOTSX_DATA>>([]);
  const [cs_table_data, set_cs_table_data] = useState<Array<CSCONFIRM_DATA>>([]);
  const [filterData, setFilterData] = useState({
    FROM_DATE: moment().format("YYYY-MM-DD"),
    TO_DATE: moment().format("YYYY-MM-DD"),
    PROCESS_LOT_NO: '',   
    CUST_NAME_KD: '',   
    G_CODE: '',
    G_NAME: '',
    PROD_REQUEST_NO: '',   
  });
  const load_lichsutemlot_data = () => {   
        generalQuery("tralichsutemlotsx", filterData)
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              let loadeddata = response.data.data.map(
                (element: TEMLOTSX_DATA, index: number) => {
                  return {
                    ...element,                   
                    INS_DATE: moment
                      .utc(element.INS_DATE)
                      .format("YYYY-MM-DD HH:mm:ss"),
                    id: index,
                  };
                },
              );
              //console.log(loadeddata);
              setlichsutemlotdata(loadeddata);
              Swal.fire(
                "Thông báo",
                "Đã load: " + response.data.data.length + " dòng",
                "success",
              );
            } else {
              setlichsutemlotdata([]);
              Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
            }
          })
          .catch((error) => {
            console.log(error);
          });        
  };
  const setFilterFormInfo = (keyname: string, value: any) => {
    let tempCSInfo = {
      ...filterData,
      [keyname]: value,
    };    
    setFilterData(tempCSInfo);
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      load_lichsutemlot_data();
    }
  };
  const LichSuTemLotSXDataTable = React.useMemo(
    () => (
      <CustomResponsiveContainer>
        <DataGrid
          autoNavigateToFocusedRow={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={false}
          cellHintEnabled={true}
          columnResizingMode={"widget"}
          showColumnLines={true}
          dataSource={lichsutemlotdata}
          columnWidth="auto"
          keyExpr="id"
          height={"75vh"}
          showBorders={true}
          onSelectionChanged={(e) => {
            //setFilterData(e.selectedRowsData[0]);
          }}
          onRowClick={(e) => {
            //console.log(e.data);
          }}
        >
          <Scrolling
            useNative={true}
            scrollByContent={true}
            scrollByThumb={true}
            showScrollbar="onHover"
            mode="virtual"
          />
          <Selection mode="single" selectAllMode="allPages" />
          <Editing
            allowUpdating={false}
            allowAdding={true}
            allowDeleting={false}
            mode="batch"
            confirmDelete={true}
            onChangesChange={(e) => { }}
          />
          <Export enabled={true} />
          <Toolbar disabled={false}>
            <Item location="before">
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  SaveExcel(lichsutemlotdata, "Lich Su Tem Lot Table");
                }}
              >
                <AiFillFileExcel color="green" size={15} />
                SAVE
              </IconButton>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  setShowHidePivotTable(!showhidePivotTable);
                }}
              >
                <MdOutlinePivotTableChart color="#ff33bb" size={15} />
                Pivot
              </IconButton>
            </Item>
            <Item name="searchPanel" />
            <Item name="exportButton" />
            <Item name="columnChooser" />
          </Toolbar>
          <FilterRow visible={true} />
          <SearchPanel visible={true} />
          <ColumnChooser enabled={true} />
          <Paging defaultPageSize={15} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={[5, 10, 15, 20, 100, 1000, 10000, "all"]}
            showNavigationButtons={true}
            showInfo={true}
            infoText="Page #{0}. Total: {1} ({2} items)"
            displayMode="compact"
          />
          <Column dataField='INS_DATE' caption='INS_DATE' width={100}></Column>
          <Column dataField='G_CODE' caption='G_CODE' width={100}></Column>
          <Column dataField='G_NAME' caption='G_NAME' width={100}></Column>
          <Column dataField='M_LOT_NO' caption='M_LOT_NO' width={100}></Column>
          <Column dataField='LOTNCC' caption='LOTNCC' width={100}></Column>
          <Column dataField='PROD_REQUEST_NO' caption='YCSX' width={110}></Column>
          <Column dataField='PROCESS_LOT_NO' caption='PROCESS_LOT_NO' width={110}></Column>
          <Column dataField='M_NAME' caption='M_NAME' width={100}></Column>
          <Column dataField='WIDTH_CD' caption='WIDTH_CD' width={100}></Column>
          <Column dataField='EMPL_NAME' caption='EMPL_NAME' width={100}></Column>
          <Column dataField='PLAN_ID' caption='PLAN_ID' width={100}></Column>
          <Column dataField='TEMP_QTY' caption='TEMP_QTY' width={100} cellRender={(ele: any) => {
            return (
              <span style={{ color: 'blue', fontWeight: 'bold' }}>{ele.data.TEMP_QTY?.toLocaleString('en-US')}</span>
            )
          }}></Column>
          <Column dataField='PROCESS_NUMBER' caption='PROCESS_NUMBER' width={100}></Column>
          <Column dataField='LOT_STATUS' caption='LOT_STATUS' width={100}></Column>
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
    ),
    [lichsutemlotdata],
  );
  const dataSource = new PivotGridDataSource({
    fields: [
      {
        caption: 'YEAR_WEEK',
        width: 80,
        dataField: 'YEAR_WEEK',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'CONFIRM_ID',
        width: 80,
        dataField: 'CONFIRM_ID',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'CONFIRM_DATE',
        width: 80,
        dataField: 'CONFIRM_DATE',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'CONTACT_ID',
        width: 80,
        dataField: 'CONTACT_ID',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'CS_EMPL_NO',
        width: 80,
        dataField: 'CS_EMPL_NO',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'EMPL_NAME',
        width: 80,
        dataField: 'EMPL_NAME',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'G_CODE',
        width: 80,
        dataField: 'G_CODE',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'G_NAME',
        width: 80,
        dataField: 'G_NAME',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'G_NAME_KD',
        width: 80,
        dataField: 'G_NAME_KD',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'PROD_REQUEST_NO',
        width: 80,
        dataField: 'PROD_REQUEST_NO',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'CUST_CD',
        width: 80,
        dataField: 'CUST_CD',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'CUST_NAME_KD',
        width: 80,
        dataField: 'CUST_NAME_KD',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'CONTENT',
        width: 80,
        dataField: 'CONTENT',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'INSPECT_QTY',
        width: 80,
        dataField: 'INSPECT_QTY',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'NG_QTY',
        width: 80,
        dataField: 'NG_QTY',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'REPLACE_RATE',
        width: 80,
        dataField: 'REPLACE_RATE',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'REDUCE_QTY',
        width: 80,
        dataField: 'REDUCE_QTY',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'FACTOR',
        width: 80,
        dataField: 'FACTOR',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'RESULT',
        width: 80,
        dataField: 'RESULT',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'CONFIRM_STATUS',
        width: 80,
        dataField: 'CONFIRM_STATUS',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'REMARK',
        width: 80,
        dataField: 'REMARK',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'INS_DATETIME',
        width: 80,
        dataField: 'INS_DATETIME',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'PHANLOAI',
        width: 80,
        dataField: 'PHANLOAI',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'LINK',
        width: 80,
        dataField: 'LINK',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'PROD_TYPE',
        width: 80,
        dataField: 'PROD_TYPE',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'PROD_MODEL',
        width: 80,
        dataField: 'PROD_MODEL',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'PROD_PROJECT',
        width: 80,
        dataField: 'PROD_PROJECT',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'string',
        summaryType: 'count',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'PROD_LAST_PRICE',
        width: 80,
        dataField: 'PROD_LAST_PRICE',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      }, {
        caption: 'REDUCE_AMOUNT',
        width: 80,
        dataField: 'REDUCE_AMOUNT',
        allowSorting: true,
        allowFiltering: true,
        dataType: 'number',
        summaryType: 'sum',
        format: 'fixedPoint',
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        }
      },
    ],
    store: lichsutemlotdata,
  });
  useEffect(() => {
  }, []);
  return (
    <DataDiv>
      <QueryFormDiv>
        <FromInputDiv>
          <FromInputColumn>
            <label>
              <b>Từ ngày:</b>
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type='date'
                value={filterData?.FROM_DATE.slice(0, 10)}
                onChange={(e) => setFilterFormInfo("FROM_DATE", e.target.value)}
              ></input>
            </label>
            <label>
              <b>Tới ngày:</b>{" "}
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type='date'
                value={filterData?.TO_DATE.slice(0, 10)}
                onChange={(e) => setFilterFormInfo("TO_DATE", e.target.value)}
              ></input>
            </label>
          </FromInputColumn>
          <FromInputColumn>
            <label>
              <b>Code KD:</b>{" "}
              <input
                type="text"
                placeholder="Code hàng"
                value={filterData?.G_NAME}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setFilterFormInfo("G_NAME", e.target.value)}
              ></input>
            </label>
            <label style={{ display: "flex", alignItems: "center" }}>
              <b>Code ERP:</b>{" "}
              <input
                type="text"
                placeholder="Code hàng"
                value={filterData?.G_CODE}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setFilterFormInfo("G_CODE", e.target.value)}
              ></input>
            </label>
          </FromInputColumn>
          <FromInputColumn>
            <label>
              <b>YCSX:</b>{" "}
              <input
                type="text"
                placeholder="YCSX"
                value={filterData?.PROD_REQUEST_NO}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setFilterFormInfo("PROD_REQUEST_NO", e.target.value)}
              ></input>
            </label>
            <label>
              <b>Khách hàng:</b>{" "}
              <input
                type="text"
                placeholder="Khách hàng"
                value={filterData?.CUST_NAME_KD}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setFilterFormInfo("CUST_NAME_KD", e.target.value)}
              ></input>
            </label>
          </FromInputColumn>          
          <FromInputColumn>
            <label>
              <b>LOT SX:</b>{" "}
              <input
                type="text"
                placeholder="LOT SX"
                value={filterData?.PROCESS_LOT_NO}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setFilterFormInfo("PROCESS_LOT_NO", e.target.value)}
              ></input>
            </label>           
          </FromInputColumn>          
        </FromInputDiv>
        <FormButtonColumn>
          <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#129232' }} onClick={() => {
            load_lichsutemlot_data();
          }}>Load Data</Button>
        </FormButtonColumn>
      </QueryFormDiv>
      <DataTBDiv>
        {option === 'dataconfirm' && LichSuTemLotSXDataTable}   
      </DataTBDiv>
      {showhidePivotTable && (
        <PivotTableDiv>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              setShowHidePivotTable(false);
            }}
          >
            <AiFillCloseCircle color="blue" size={15} />
            Close
          </IconButton>
          <PivotTable datasource={dataSource} tableID="invoicetablepivot" />
        </PivotTableDiv>
      )}
    </DataDiv>
  );
};
export default LICHSUTEMLOTSX;
