import {
  Autocomplete,
  Button,
  IconButton,
  TextField,
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
import React, {
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import "./PRODUCT_BARCODE_MANAGER.scss";
import { UserContext } from "../../../api/Context";
import { generalQuery, getAuditMode } from "../../../api/Api";
import { CustomResponsiveContainer, SaveExcel } from "../../../api/GlobalFunction";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotTable from "../../../components/PivotChart/PivotChart";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import QRCODE from "../design_amazon/design_components/QRCODE";
import BARCODE from "../design_amazon/design_components/BARCODE";
import DATAMATRIX from "../design_amazon/design_components/DATAMATRIX";
import {
  BARCODE_DATA,
  CodeListData,
  CustomerListData,
  MATERIAL_TABLE_DATA,
} from "../../../api/GlobalInterface";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import AGTable from "../../../components/DataTable/AGTable";
import { AgGridReact } from "ag-grid-react";
const PRODUCT_BARCODE_MANAGER = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [material_table_data, set_material_table_data] = useState<
    Array<MATERIAL_TABLE_DATA>
  >([]);
  const [barcodedatatable, setBarCodeDataTable] = useState<Array<BARCODE_DATA>>(
    [],
  );
  const [custinfodatatable, setBarCodeInfoDataTable] = useState<Array<any>>([]);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [machine, setMachine] = useState("ALL");
  const [factory, setFactory] = useState("ALL");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [plan_id, setPlanID] = useState("");
  const [alltime, setAllTime] = useState(true);
  const [datasxtable, setDataSXTable] = useState<Array<any>>([]);
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [selectedRows, setSelectedRows] = useState<BARCODE_DATA>({
    G_CODE: "",
    BARCODE_INSP: "",
    BARCODE_RELI: "",
    BARCODE_RND: "",
    BARCODE_STT: "",
    BARCODE_TYPE: "1D",
    G_NAME: "",
    STATUS: "",
    SX_STATUS: "",
  });
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>({
    G_CODE: "6A00001B",
    G_NAME: "GT-I9500_SJ68-01284A",
    PROD_LAST_PRICE: 0,
    USE_YN: "N",
  });
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const load_barcode_table = () => {
    generalQuery("loadbarcodemanager", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: BARCODE_DATA, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
                SX_STATUS: element?.SX_STATUS == null ? "NO" : element?.SX_STATUS,
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setBarCodeDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          setBarCodeDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const setBarCodeInfo = (keyname: string, value: any) => {
    //console.log(keyname);
    //console.log(value);
    let tempCustInfo: BARCODE_DATA = { ...selectedRows, [keyname]: value };
    //console.log(tempcodefullinfo);
    setSelectedRows(tempCustInfo);
  };
  const addBarcode = async () => {
    let barcodeExist: boolean = false;
    await generalQuery("checkbarcodeExist", selectedRows)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          barcodeExist = true;
        } else {
          barcodeExist = false;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("barcodeExist", barcodeExist);
    if (barcodeExist === false) {
      await generalQuery("addBarcode", selectedRows)
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            Swal.fire("Thông báo", "Thêm barcode thành công", "success");
            load_barcode_table();
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      Swal.fire("Thông báo", "Barcode đã tồn tại", "error");
    }
  };
  const updateBarcode = async () => {
    generalQuery("updateBarcode", selectedRows)
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Update barcode thành công", "success");
          load_barcode_table();
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const deleteBarcode = async () => {
    if (selectedRows.SX_STATUS !== "NO") {
      Swal.fire("Thông báo", "Barcode đã được sản xuất, không thể xóa", "error");
      return;
    } 
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa barcode này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        generalQuery("deleteBarcode", selectedRows)
          .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Delete barcode thành công", "success");
          load_barcode_table();
          } else {
          }
        })
        .catch((error) => {
            console.log(error);
          });
      }
    });
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      load_barcode_table();
    }
  };
  const columns_def = [
    { field: 'G_CODE', headerName: 'G_CODE', width: 60 },
    { field: 'G_NAME', headerName: 'G_NAME', width: 160 },
    { field: 'BARCODE_STT', headerName: 'BARCODE_STT', width: 80 },
    { field: 'BARCODE_TYPE', headerName: 'BARCODE_TYPE', width: 80 },
    { field: 'BARCODE_RND', headerName: 'BARCODE_RND', width: 80 },
    { field: 'BARCODE_INSP', headerName: 'BARCODE_INSP', width: 80 },
    { field: 'BARCODE_RELI', headerName: 'BARCODE_RELI', width: 80 },
    {
      field: 'STATUS', headerName: 'STATUS', width: 100, cellRenderer: (params: any) => {
        if (params.data.STATUS === "OK") {
          return (
            <div
              style={{
                color: "white",
                backgroundColor: "#13DC0C",
                width: "80px",
                textAlign: "center",
              }}
            >
              OK
            </div>
          );
        } else {
          return (
            <div
              style={{
                color: "white",
                backgroundColor: "red",
                width: "80px",
                textAlign: "center",
              }}
            >
              NG
            </div>
          );
        }
      }
    },
    { field: 'BARCODE_RND', headerName: 'CODE_VISUALIZE', width: 250, cellRenderer: (params: any) => {    
      if (params.data.BARCODE_TYPE === "QR") {      
        return (      
            <QRCODE
              DATA={{
                CAVITY_PRINT: 2,
                DOITUONG_NAME: "bc",
                DOITUONG_NO: 1,
                DOITUONG_STT: "0",
                FONT_NAME: "Arial",
                FONT_SIZE: 6,
                FONT_STYLE: "normal",
                G_CODE_MAU: "",
                GIATRI: params.data.BARCODE_RND,
                PHANLOAI_DT: "QR CODE",
                POS_X: 0,
                POS_Y: 0,
                SIZE_W: 10,
                SIZE_H: 10,
                REMARK: "",
                ROTATE: 0,
              }}
            />       
        );
      } else if (params.data.BARCODE_TYPE === "1D") {
        return (       
            <BARCODE
              DATA={{
                CAVITY_PRINT: 2,
                DOITUONG_NAME: "bc",
                DOITUONG_NO: 1,
                DOITUONG_STT: "0",
                FONT_NAME: "Arial",
                FONT_SIZE: 6,
                FONT_STYLE: "normal",
                G_CODE_MAU: "",
                GIATRI: params.data.BARCODE_RND,
                PHANLOAI_DT: "QR CODE",
                POS_X: 0,
                POS_Y: 0,
                SIZE_W: 60,
                SIZE_H: 10,
                REMARK: "",
                ROTATE: 0,
              }}
            />        
        );
      } else if (params.data.BARCODE_TYPE === "MATRIX") {
        return (       
            <DATAMATRIX
              DATA={{
                CAVITY_PRINT: 2,
                DOITUONG_NAME: "bc",
                DOITUONG_NO: 1,
                DOITUONG_STT: "0",
                FONT_NAME: "Arial",
                FONT_SIZE: 6,
                FONT_STYLE: "normal",
                G_CODE_MAU: "",
                GIATRI: params.data.BARCODE_RND,
                PHANLOAI_DT: "QR CODE",
                POS_X: 0,
                POS_Y: 0,
                SIZE_W: 10,
                SIZE_H: 10,
                REMARK: "",
                ROTATE: 0,
              }}
            />        
        );
      }
    }},
    { field: 'SX_STATUS', headerName: 'SX_STATUS', width: 100 },
  ];  
  const product_barcode_data_ag_table = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={
          <div>
           
          </div>}
        columns={columns_def}
        data={barcodedatatable}
        onCellEditingStopped={(params: any) => {
        }}
        onCellClick={(params: any) => {
          setSelectedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
        }}     />   
    )
  }, [barcodedatatable, columns_def]);

  const gridRef = useRef<AgGridReact<any>>(null);
  const setHeaderHeight = useCallback((value?: number) => {
    gridRef.current!.api.setGridOption("headerHeight", value);
    //setIdText("headerHeight", value);
  }, []);
  const rowStyle = { backgroundColor: 'transparent', height: '150px' };
  const getRowStyle = (params: any) => {
    return { backgroundColor: '#eaf5e1', fontSize: '0.6rem' };
  };

  const defaultColDef = useMemo(() => {
    return {
      initialWidth: 100,
      wrapHeaderText: true,
      autoHeaderHeight: false,
      editable: true,
      floatingFilter:  true,
      filter: true,
      headerCheckboxSelectionFilteredOnly: true,
    };
  }, []);

  const product_barcode_data_ag_table2 = useMemo(() => {
    return (
      <div className="agtable">       
        <div className="ag-theme-quartz"
          style={{ height: '100%', }}
        >
          <AgGridReact
            rowData={barcodedatatable}
            columnDefs={columns_def}
            rowHeight={50}            
            ref={gridRef}
            onGridReady={() => {
              setHeaderHeight(20);
            }}
            defaultColDef={defaultColDef}            
            columnHoverHighlight={true}
            rowStyle={rowStyle}
            getRowStyle={getRowStyle}
            getRowId={(params: any) => params.data.G_CODE}
            rowSelection={"multiple"}
            rowMultiSelectWithClick={true}
            suppressRowClickSelection={true}
            enterNavigatesVertically={true}
            enterNavigatesVerticallyAfterEdit={true}
            stopEditingWhenCellsLoseFocus={true}
            rowBuffer={10}
            debounceVerticalScrollbar={false}
            enableCellTextSelection={true}
            floatingFiltersHeight={23}
            onSelectionChanged={(params: any) => {
              
            }}
            onCellClicked={async (params: any) => {
              let rowData = params.data;
              setSelectedRows(rowData);
              
            }}
            onRowDoubleClicked={
              (params: any) => {

              }
            }
            onCellEditingStopped={(params: any) => {
              //console.log(params)
            }}
          />
        </div>
        <div className="bottombar">
        
        </div>
      </div>
    )
  }, [barcodedatatable,   columns_def])

  const BarcodeDataTable = React.useMemo(
    () => (
      <div className="datatb">
        <CustomResponsiveContainer>
          <DataGrid
            autoNavigateToFocusedRow={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={barcodedatatable}
            columnWidth="auto"
            keyExpr="id"
            height={"75vh"}
            showBorders={true}
            onRowPrepared={(e) => {
              e.rowElement.style.height = "15mm";
              e.rowElement.style.alignSelf = "center";
              e.rowElement.style.alignContent = "center";
              e.rowElement.style.alignItems = "center";
              e.rowElement.style.justifyContent = "center";
              e.rowElement.style.justifyItems = "center";
              e.rowElement.style.justifySelf = "center";
            }}
            onSelectionChanged={(e) => {
              //setSelectedRows(e.selectedRowsData[0]);
            }}
            onRowClick={(e) => {
              setSelectedRows(e.data);
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
                    SaveExcel(datasxtable, "MaterialStatus");
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
            <Column dataField="G_CODE" caption="G_CODE" width={100}></Column>
            <Column dataField="G_NAME" caption="G_NAME" width={200}></Column>
            <Column
              dataField="BARCODE_STT"
              caption="BARCODE_STT"
              width={100}
            ></Column>
            <Column
              dataField="BARCODE_TYPE"
              caption="BARCODE_TYPE"
              width={100}
            ></Column>
            <Column
              dataField="BARCODE_RND"
              caption="BARCODE_RND"
              width={100}
            ></Column>
            <Column
              dataField="BARCODE_INSP"
              caption="BARCODE_INSP"
              width={100}
            ></Column>
            <Column
              dataField="BARCODE_RELI"
              caption="BARCODE_RELI"
              width={100}
            ></Column>
            <Column
              dataField="STATUS"
              caption="STATUS"
              width={100}
              cellRender={(e: any) => {
                if (e.data.STATUS === "OK") {
                  return (
                    <div
                      style={{
                        color: "white",
                        backgroundColor: "#13DC0C",
                        width: "80px",
                        textAlign: "center",
                      }}
                    >
                      OK
                    </div>
                  );
                } else {
                  return (
                    <div
                      style={{
                        color: "white",
                        backgroundColor: "red",
                        width: "80px",
                        textAlign: "center",
                      }}
                    >
                      NG
                    </div>
                  );
                }
              }}
            ></Column>
            <Column
              dataField="BARCODE_RND"
              caption="CODE VISUALIZE"
              width={100}
              cellRender={(e: any) => {
                if (e.data.BARCODE_TYPE === "QR") {
                  return (
                    <div
                      style={{
                        color: "white",
                        backgroundColor: "#5d855b",
                        width: "80px",
                        textAlign: "center",
                        position: "relative",
                      }}
                    >
                      <QRCODE
                        DATA={{
                          CAVITY_PRINT: 2,
                          DOITUONG_NAME: "bc",
                          DOITUONG_NO: 1,
                          DOITUONG_STT: "0",
                          FONT_NAME: "Arial",
                          FONT_SIZE: 6,
                          FONT_STYLE: "normal",
                          G_CODE_MAU: "",
                          GIATRI: e.data.BARCODE_RND,
                          PHANLOAI_DT: "QR CODE",
                          POS_X: 0,
                          POS_Y: 0,
                          SIZE_W: 10,
                          SIZE_H: 10,
                          REMARK: "",
                          ROTATE: 0,
                        }}
                      />
                    </div>
                  );
                } else if (e.data.BARCODE_TYPE === "1D") {
                  return (
                    <div
                      style={{
                        color: "white",
                        backgroundColor: "#13DC0C",
                        width: "80px",
                        textAlign: "center",
                        position: "relative",
                      }}
                    >
                      <BARCODE
                        DATA={{
                          CAVITY_PRINT: 2,
                          DOITUONG_NAME: "bc",
                          DOITUONG_NO: 1,
                          DOITUONG_STT: "0",
                          FONT_NAME: "Arial",
                          FONT_SIZE: 6,
                          FONT_STYLE: "normal",
                          G_CODE_MAU: "",
                          GIATRI: e.data.BARCODE_RND,
                          PHANLOAI_DT: "QR CODE",
                          POS_X: 0,
                          POS_Y: 0,
                          SIZE_W: 60,
                          SIZE_H: 10,
                          REMARK: "",
                          ROTATE: 0,
                        }}
                      />
                    </div>
                  );
                } else if (e.data.BARCODE_TYPE === "MATRIX") {
                  return (
                    <div
                      style={{
                        color: "white",
                        backgroundColor: "#13DC0C",
                        width: "80px",
                        textAlign: "center",
                        position: "relative",
                      }}
                    >
                      <DATAMATRIX
                        DATA={{
                          CAVITY_PRINT: 2,
                          DOITUONG_NAME: "bc",
                          DOITUONG_NO: 1,
                          DOITUONG_STT: "0",
                          FONT_NAME: "Arial",
                          FONT_SIZE: 6,
                          FONT_STYLE: "normal",
                          G_CODE_MAU: "",
                          GIATRI: e.data.BARCODE_RND,
                          PHANLOAI_DT: "QR CODE",
                          POS_X: 0,
                          POS_Y: 0,
                          SIZE_W: 10,
                          SIZE_H: 10,
                          REMARK: "",
                          ROTATE: 0,
                        }}
                      />
                    </div>
                  );
                }
              }}
            ></Column>
            <Column
              dataField="SX_STATUS"
              caption="SX_STATUS"
              width={100}
            ></Column>
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
    [barcodedatatable],
  );
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const getcustomerlist = () => {
    generalQuery("selectcustomerList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setCustomerList(response.data.data);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const dataSource = new PivotGridDataSource({
    fields: [
      {
        caption: "INS_DATE",
        width: 80,
        dataField: "INS_DATE",
        allowSorting: true,
        allowFiltering: true,
        dataType: "date",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "M_LOT_NO",
        width: 80,
        dataField: "M_LOT_NO",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "M_CODE",
        width: 80,
        dataField: "M_CODE",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "M_NAME",
        width: 80,
        dataField: "M_NAME",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "WIDTH_CD",
        width: 80,
        dataField: "WIDTH_CD",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "XUAT_KHO",
        width: 80,
        dataField: "XUAT_KHO",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "VAO_FR",
        width: 80,
        dataField: "VAO_FR",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "VAO_SR",
        width: 80,
        dataField: "VAO_SR",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "VAO_DC",
        width: 80,
        dataField: "VAO_DC",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "VAO_ED",
        width: 80,
        dataField: "VAO_ED",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "CONFIRM_GIAONHAN",
        width: 80,
        dataField: "CONFIRM_GIAONHAN",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "VAO_KIEM",
        width: 80,
        dataField: "VAO_KIEM",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "NHATKY_KT",
        width: 80,
        dataField: "NHATKY_KT",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "RA_KIEM",
        width: 80,
        dataField: "RA_KIEM",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "ROLL_QTY",
        width: 80,
        dataField: "ROLL_QTY",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "OUT_CFM_QTY",
        width: 80,
        dataField: "OUT_CFM_QTY",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "TOTAL_OUT_QTY",
        width: 80,
        dataField: "TOTAL_OUT_QTY",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "FR_RESULT",
        width: 80,
        dataField: "FR_RESULT",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "SR_RESULT",
        width: 80,
        dataField: "SR_RESULT",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "DC_RESULT",
        width: 80,
        dataField: "DC_RESULT",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "ED_RESULT",
        width: 80,
        dataField: "ED_RESULT",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "INSPECT_TOTAL_QTY",
        width: 80,
        dataField: "INSPECT_TOTAL_QTY",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "INSPECT_OK_QTY",
        width: 80,
        dataField: "INSPECT_OK_QTY",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "INS_OUT",
        width: 80,
        dataField: "INS_OUT",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "PD",
        width: 80,
        dataField: "PD",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "CAVITY",
        width: 80,
        dataField: "CAVITY",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "TOTAL_OUT_EA",
        width: 80,
        dataField: "TOTAL_OUT_EA",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "FR_EA",
        width: 80,
        dataField: "FR_EA",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "SR_EA",
        width: 80,
        dataField: "SR_EA",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "DC_EA",
        width: 80,
        dataField: "DC_EA",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "ED_EA",
        width: 80,
        dataField: "ED_EA",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "INSPECT_TOTAL_EA",
        width: 80,
        dataField: "INSPECT_TOTAL_EA",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "INSPECT_OK_EA",
        width: 80,
        dataField: "INSPECT_OK_EA",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "INS_OUTPUT_EA",
        width: 80,
        dataField: "INS_OUTPUT_EA",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "ROLL_LOSS_KT",
        width: 80,
        dataField: "ROLL_LOSS_KT",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "ROLL_LOSS",
        width: 80,
        dataField: "ROLL_LOSS",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "PROD_REQUEST_NO",
        width: 80,
        dataField: "PROD_REQUEST_NO",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "PLAN_ID",
        width: 80,
        dataField: "PLAN_ID",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "PLAN_EQ",
        width: 80,
        dataField: "PLAN_EQ",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "G_CODE",
        width: 80,
        dataField: "G_CODE",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "G_NAME",
        width: 80,
        dataField: "G_NAME",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "FACTORY",
        width: 80,
        dataField: "FACTORY",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
    ],
    store: datasxtable,
  });
  const filterOptions1 = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });
  const [isPending, startTransition] = useTransition();
  const getcodelist = (G_NAME: string) => {
    generalQuery("selectcodeList", { G_NAME: G_NAME })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          if (!isPending) {
            startTransition(() => {
              setCodeList(response.data.data);
            });
          }
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    load_barcode_table();
    getcustomerlist();
    getcodelist("");
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className="product_barcode_mamanger">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <Autocomplete
                  sx={{ fontSize: "0.6rem", border: "none" }}
                  ListboxProps={{ style: { fontSize: "0.7rem" } }}
                  size="small"
                  disablePortal
                  options={codeList}
                  className="autocomplete1"
                  filterOptions={filterOptions1}
                  getOptionLabel={(option: CodeListData | any) =>
                    `${option.G_CODE}: ${option.G_NAME}`
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Select code" />
                  )}
                  onChange={(event: any, newValue: CodeListData | any) => {
                    console.log(newValue);
                    setSelectedCode(newValue);
                    setBarCodeInfo("G_CODE", newValue.G_CODE);
                  }}
                  value={
                    codeList.filter(
                      (e: CodeListData, index: number) =>
                        e.G_CODE === selectedRows.G_CODE,
                    )[0]
                  }
                  isOptionEqualToValue={(option: any, value: any) =>
                    option.G_CODE === value.G_CODE
                  }
                />
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>STT BARCODE:</b>{" "}
                <input
                  type="text"
                  placeholder="Số thứ tự barcode"
                  value={selectedRows?.BARCODE_STT}
                  onChange={(e) =>
                    setBarCodeInfo("BARCODE_STT", e.target.value)
                  }
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Barcode Type:</b>{" "}
                <select
                  name="vendor"
                  value={selectedRows?.BARCODE_TYPE}
                  onChange={(e) => {
                    setBarCodeInfo("BARCODE_TYPE", e.target.value);
                  }}
                >
                  <option value="1D">1D BARCODE</option>
                  <option value="MATRIX">2D MATRIX</option>
                  <option value="QR">QR CODE</option>
                </select>
              </label>
              <label>
                <b>BARCODE RND:</b>{" "}
                <input
                  type="text"
                  placeholder="BARCODE RND"
                  value={selectedRows?.BARCODE_RND}
                  onChange={(e) =>
                    setBarCodeInfo("BARCODE_RND", e.target.value)
                  }
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>BARCODE DTC:</b>{" "}
                <input
                  disabled={true}
                  type="text"
                  placeholder="BARCODE DTC"
                  value={selectedRows?.BARCODE_RELI}
                  onChange={(e) =>
                    setBarCodeInfo("BARCODE_RELI", e.target.value)
                  }
                ></input>
              </label>
              <label>
                <b>BARCODE KT:</b>{" "}
                <input
                  disabled={true}
                  type="text"
                  placeholder="BARCODE KT"
                  value={selectedRows?.BARCODE_INSP}
                  onChange={(e) =>
                    setBarCodeInfo("BARCODE_INSP", e.target.value)
                  }
                ></input>
              </label>
            </div>
          </div>
          <div className="formbutton">
            <button
              className="tranhatky"
              onClick={() => {
                load_barcode_table();
              }}
            >
              Refesh
            </button>
            <button
              className="tranhatky"
              onClick={() => {
                addBarcode();
              }}
            >
              Add
            </button>
            <button
              className="traxuatkiembutton"
              onClick={() => {
                updateBarcode();
              }}
            >
              Update
            </button>
            <Button
              color="error"
              onClick={() => {
                deleteBarcode();
              }}
            >
              Delete
            </Button>
          </div>
        </div>
        <div className="tracuuYCSXTable">{product_barcode_data_ag_table2}</div>
        {showhidePivotTable && (
          <div className="pivottable1">
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
          </div>
        )}
      </div>
    </div>
  );
};
export default PRODUCT_BARCODE_MANAGER;
