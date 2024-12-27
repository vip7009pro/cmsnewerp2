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
import React, { useContext, useEffect, useMemo, useState } from "react";
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
  OQC_DATA,
} from "../../../api/GlobalInterface";
import { DataDiv, DataTBDiv, FormButtonColumn, FromInputColumn, FromInputDiv, PivotTableDiv, QueryFormDiv } from "../../../components/StyledComponents/ComponentLib";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import AGTable from "../../../components/DataTable/AGTable";
const OQC_DATA_TB = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [oqc_table_data, set_oqc_table_data] = useState<Array<OQC_DATA>>([]);
  const [selectedRows, setSelectedRows] = useState<OQC_DATA>({
    CUST_NAME_KD: '',
    DELIVERY_AMOUNT: 0,
    DELIVERY_DATE: '',
    DELIVERY_QTY: 0,
    FACTORY_NAME: '',
    FULL_NAME: '',
    G_CODE: '',
    G_NAME: '',
    G_NAME_KD: '',
    LABEL_ID: '',
    OQC_ID: 0,
    PROCESS_LOT_NO: '',
    M_LOT_NO: '',
    LOTNCC: '',
    PROD_LAST_PRICE: 0,
    PROD_REQUEST_DATE: '',
    PROD_REQUEST_NO: '',
    PROD_REQUEST_QTY: 0,
    REMARK: '',
    RUNNING_COUNT: 0,
    SAMPLE_NG_AMOUNT: 0,
    SAMPLE_NG_QTY: 0,
    SAMPLE_QTY: 0,
    SHIFT_CODE: ''
  });
  const load_oqc_data = () => {
    generalQuery("traOQCData", {
      CUST_NAME_KD: selectedRows.CUST_NAME_KD,
      PROD_REQUEST_NO: selectedRows.PROD_REQUEST_NO,
      G_NAME: selectedRows.G_NAME,
      G_CODE: selectedRows.G_CODE,
      FROM_DATE: fromdate,
      TO_DATE: todate
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: OQC_DATA, index: number) => {
              return {
                ...element,
                DELIVERY_DATE: moment
                  .utc(element.DELIVERY_DATE)
                  .format("YYYY-MM-DD"),
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          set_oqc_table_data(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          set_oqc_table_data([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const setOQCFormInfo = (keyname: string, value: any) => {
    console.log(keyname);
    console.log(value);
    let tempCustInfo: OQC_DATA = {
      ...selectedRows,
      [keyname]: value,
    };
    //console.log(tempcodefullinfo);
    setSelectedRows(tempCustInfo);
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      load_oqc_data();
    }
  };
  const materialDataTable = React.useMemo(
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
          dataSource={oqc_table_data}
          columnWidth="auto"
          keyExpr="id"
          height={"75vh"}
          showBorders={true}
          onSelectionChanged={(e) => {
            //setSelectedRows(e.selectedRowsData[0]);
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
                  SaveExcel(oqc_table_data, "MaterialStatus");
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
          <Column dataField='OQC_ID' caption='OQC_ID' width={100}></Column>
          <Column dataField='DELIVERY_DATE' caption='DELIVERY_DATE' width={100}></Column>
          <Column dataField='SHIFT_CODE' caption='SHIFT_CODE' width={100}></Column>
          <Column dataField='FACTORY_NAME' caption='FACTORY_NAME' width={100}></Column>
          <Column dataField='FULL_NAME' caption='FULL_NAME' width={100}></Column>
          <Column dataField='CUST_NAME_KD' caption='CUST_NAME_KD' width={100}></Column>
          <Column dataField='PROD_REQUEST_NO' caption='PROD_REQUEST_NO' width={100}></Column>
          <Column dataField='PROCESS_LOT_NO' caption='PROCESS_LOT_NO' width={100}></Column>
          <Column dataField='M_LOT_NO' caption='M_LOT_NO' width={100}></Column>
          <Column dataField='LOTNCC' caption='LOTNCC' width={100}></Column>
          <Column dataField='LABEL_ID' caption='LABEL_ID' width={100}></Column>
          <Column dataField='PROD_REQUEST_DATE' caption='PROD_REQUEST_DATE' width={100}></Column>
          <Column dataField='PROD_REQUEST_QTY' caption='PROD_REQUEST_QTY' width={100}></Column>
          <Column dataField='G_CODE' caption='G_CODE' width={100}></Column>
          <Column dataField='G_NAME' caption='G_NAME' width={100}></Column>
          <Column dataField='G_NAME_KD' caption='G_NAME_KD' width={100}></Column>
          <Column dataField='DELIVERY_QTY' caption='DELIVERY_QTY' width={100}></Column>
          <Column dataField='SAMPLE_QTY' caption='SAMPLE_QTY' width={100}></Column>
          <Column dataField='SAMPLE_NG_QTY' caption='SAMPLE_NG_QTY' width={100}></Column>
          <Column dataField='PROD_LAST_PRICE' caption='PROD_LAST_PRICE' width={100}></Column>
          <Column dataField='DELIVERY_AMOUNT' caption='DELIVERY_AMOUNT' width={100}></Column>
          <Column dataField='SAMPLE_NG_AMOUNT' caption='SAMPLE_NG_AMOUNT' width={100}></Column>
          <Column dataField='REMARK' caption='REMARK' width={100}></Column>
          <Column dataField='DEFECT_IMAGE_LINK' caption='DEFECT_IMAGE_LINK' width={100}></Column>
          <Column dataField='RUNNING_COUNT' caption='RUNNING_COUNT' width={100}></Column>
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
    [oqc_table_data],
  );
  const columns_def = [  
    { field: 'OQC_ID', headerName: 'OQC_ID', width: 50 },
    { field: 'DELIVERY_DATE', headerName: 'DELIVERY_DATE', width: 80 },
    { field: 'SHIFT_CODE', headerName: 'SHIFT_CODE', width: 70 },
    { field: 'FACTORY_NAME', headerName: 'FACTORY_NAME', width: 80 },
    { field: 'FULL_NAME', headerName: 'FULL_NAME', width: 100 },
    { field: 'CUST_NAME_KD', headerName: 'CUST_NAME_KD', width: 80 },
    { field: 'PROD_REQUEST_NO', headerName: 'PROD_REQUEST_NO', width: 100 },
    { field: 'PROCESS_LOT_NO', headerName: 'PROCESS_LOT_NO', width: 100 },
    { field: 'M_LOT_NO', headerName: 'M_LOT_NO', width: 100 },
    { field: 'LOTNCC', headerName: 'LOTNCC', width: 100 },
    { field: 'LABEL_ID', headerName: 'LABEL_ID', width: 60 },
    { field: 'PROD_REQUEST_DATE', headerName: 'YCSX_DATE', width: 60 },
    { field: 'PROD_REQUEST_QTY', headerName: 'YCSX_QTY', width: 60 },
    { field: 'G_CODE', headerName: 'G_CODE', width: 60 },
    { field: 'G_NAME', headerName: 'G_NAME', width: 100 },
    { field: 'G_NAME_KD', headerName: 'G_NAME_KD', width: 100 },
    { field: 'DELIVERY_QTY', headerName: 'DELIVERY_QTY', width: 80 },
    { field: 'SAMPLE_QTY', headerName: 'SAMPLE_QTY', width:70 },
    { field: 'SAMPLE_NG_QTY', headerName: 'SAMPLE_NG_QTY', width: 90 },
    { field: 'PROD_LAST_PRICE', headerName: 'PROD_LAST_PRICE', width: 100 },
    { field: 'DELIVERY_AMOUNT', headerName: 'DELIVERY_AMOUNT', width: 100 },
    { field: 'SAMPLE_NG_AMOUNT', headerName: 'SAMPLE_NG_AMOUNT', width: 100 },
    { field: 'REMARK', headerName: 'REMARK', width: 80 },
    { field: 'RUNNING_COUNT', headerName: 'RUNNING_COUNT', width: 90 },
    { field: 'id', headerName: 'id', width: 60 },
  ];
  const oqc_data_ag_table = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={
          <div>
          </div>}
        columns={columns_def}
        data={oqc_table_data}
        onCellEditingStopped={(params: any) => {
        }}
        onCellClick={(params: any) => {
          //setSelectedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
        }}     />   
    )
  }, [oqc_table_data, columns_def]);
  const dataSource = new PivotGridDataSource({
    fields: [
      {
        caption: 'OQC_ID',
        width: 80,
        dataField: 'OQC_ID',
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
        caption: 'DELIVERY_DATE',
        width: 80,
        dataField: 'DELIVERY_DATE',
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
        caption: 'SHIFT_CODE',
        width: 80,
        dataField: 'SHIFT_CODE',
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
        caption: 'FACTORY_NAME',
        width: 80,
        dataField: 'FACTORY_NAME',
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
        caption: 'FULL_NAME',
        width: 80,
        dataField: 'FULL_NAME',
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
        caption: 'PROCESS_LOT_NO',
        width: 80,
        dataField: 'PROCESS_LOT_NO',
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
        caption: 'LABEL_ID',
        width: 80,
        dataField: 'LABEL_ID',
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
        caption: 'PROD_REQUEST_DATE',
        width: 80,
        dataField: 'PROD_REQUEST_DATE',
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
        caption: 'PROD_REQUEST_QTY',
        width: 80,
        dataField: 'PROD_REQUEST_QTY',
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
        caption: 'DELIVERY_QTY',
        width: 80,
        dataField: 'DELIVERY_QTY',
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
        caption: 'SAMPLE_QTY',
        width: 80,
        dataField: 'SAMPLE_QTY',
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
        caption: 'SAMPLE_NG_QTY',
        width: 80,
        dataField: 'SAMPLE_NG_QTY',
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
        caption: 'DELIVERY_AMOUNT',
        width: 80,
        dataField: 'DELIVERY_AMOUNT',
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
        caption: 'SAMPLE_NG_AMOUNT',
        width: 80,
        dataField: 'SAMPLE_NG_AMOUNT',
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
        caption: 'DEFECT_IMAGE_LINK',
        width: 80,
        dataField: 'DEFECT_IMAGE_LINK',
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
        caption: 'RUNNING_COUNT',
        width: 80,
        dataField: 'RUNNING_COUNT',
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
    store: oqc_table_data,
  });
  useEffect(() => {
  }, []);
  return (
    <DataDiv>
      <QueryFormDiv style={{ backgroundImage: theme.CMS.backgroundImage }}>
        <FromInputDiv>
          <FromInputColumn >
            <label>
              <b>Từ ngày:</b>
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type='date'
                value={fromdate.slice(0, 10)}
                onChange={(e) => setFromDate(e.target.value)}
              ></input>
            </label>
            <label>
              <b>Tới ngày:</b>{" "}
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type='date'
                value={todate.slice(0, 10)}
                onChange={(e) => setToDate(e.target.value)}
              ></input>
            </label>
          </FromInputColumn>
          <FromInputColumn>
            <label>
              <b>Code KD:</b>{" "}
              <input
                type="text"
                placeholder="Code hàng"
                value={selectedRows?.G_NAME}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setOQCFormInfo("G_NAME_KD", e.target.value)}
              ></input>
            </label>
            <label style={{ display: "flex", alignItems: "center" }}>
              <b>Code ERP:</b>{" "}
              <input
                type="text"
                placeholder="Code hàng"
                value={selectedRows?.G_CODE}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setOQCFormInfo("G_CODE", e.target.value)}
              ></input>
            </label>
          </FromInputColumn>
          <FromInputColumn>
            <label>
              <b>YCSX:</b>{" "}
              <input
                type="text"
                placeholder="YCSX"
                value={selectedRows?.PROD_REQUEST_NO}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setOQCFormInfo("PROD_REQUEST_NO", e.target.value)}
              ></input>
            </label>
            <label>
              <b>Khách hàng:</b>{" "}
              <input
                type="text"
                placeholder="Khách hàng"
                value={selectedRows?.CUST_NAME_KD}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setOQCFormInfo("CUST_NAME_KD", e.target.value)}
              ></input>
            </label>
          </FromInputColumn>
        </FromInputDiv>
        <FormButtonColumn>
          <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#129232' }} onClick={() => {
            load_oqc_data();
          }}>Load</Button>
        </FormButtonColumn>
      </QueryFormDiv>
      <DataTBDiv>
        {oqc_data_ag_table}
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
export default OQC_DATA_TB;
