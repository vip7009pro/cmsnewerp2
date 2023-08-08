import {
    Autocomplete,
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
  import React, { startTransition, useContext, useEffect, useState, useTransition } from "react";
  import { AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
  import Swal from "sweetalert2";
  import "./KHOTPNEW.scss";
  import { UserContext } from "../../../api/Context";
  import { generalQuery } from "../../../api/Api";
  import { SaveExcel } from "../../../api/GlobalFunction";
  import { MdOutlinePivotTableChart } from "react-icons/md";
  import PivotTable from "../../../components/PivotChart/PivotChart";
  import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
  import { ResponsiveContainer } from "recharts";

  interface CodeListData {
    G_CODE: string;
    G_NAME: string;
    PROD_LAST_PRICE?: number;
    USE_YN: string;
    PO_BALANCE?: number;
  }
  interface HANDOVER_DATA {
    KNIFE_FILM_ID: string,
    FACTORY_NAME: string,
    NGAYBANGIAO: string,
    G_CODE: string,
    G_NAME: string,
    PROD_TYPE: string,
    CUST_NAME_KD: string,
    LOAIBANGIAO_PDP: string,
    LOAIPHATHANH: string,
    SOLUONG: number,
    SOLUONGOHP: number,
    LYDOBANGIAO: string,
    PQC_EMPL_NO: string,
    RND_EMPL_NO: string,
    SX_EMPL_NO: string,
    REMARK: string,
    CFM_GIAONHAN: string,
    CFM_INS_EMPL: string,
    CFM_DATE: string,
    KNIFE_FILM_STATUS: string,
    MA_DAO: string,
    TOTAL_PRESS: number,
    CUST_CD: string,
    KNIFE_TYPE: string,
  }
  
  interface KTP_IN {
    IN_DATE: string,
    FACTORY: string,
    AUTO_ID: string,
    INSPECT_OUTPUT_ID: string,
    PACK_ID: string,
    EMPL_NAME: string,
    PROD_REQUEST_NO: string,
    CUST_NAME_KD: string,
    G_CODE: string,
    G_NAME: string,
    G_NAME_KD: string,
    PLAN_ID: string,
    IN_QTY: number,
    USE_YN: string,
    EMPL_GIAO: string,
    EMPL_NHAN: string,
    INS_DATE: string,
    INS_EMPL: string,
    UPD_DATE: string,
    UPD_EMPL: string,
    STATUS: string,
    REMARK: string,
  }
  interface KTP_OUT {
    OUT_DATE: string,
    FACTORY: string,
    AUTO_ID: string,
    INSPECT_OUTPUT_ID: string,
    PACK_ID: string,
    EMPL_NAME: string,
    PROD_REQUEST_NO: string,
    G_CODE: string,
    G_NAME: string,
    G_NAME_KD: string,
    PLAN_ID: string,
    CUST_CD: string,
    OUT_QTY: number,
    CUST_NAME_KD: string,
    OUT_TYPE: string,
    USE_YN: string,
    INS_DATE: string,
    INS_EMPL: string,
    UPD_DATE: string,
    UPD_EMPL: string,
    STATUS: string,
    REMARK: string,
    AUTO_ID_IN: string,
    OUT_PRT_SEQ: string,
  }

  interface STOCK_G_CODE {
    G_CODE: string,
    G_NAME: string,
    G_NAME_KD: string,
    STOCK: number,
    BLOCK_QTY: number,
    TOTAL_STOCK: number,
  }

  interface STOCK_G_NAME_KD {
    G_NAME_KD: string,
    STOCK: number,
    BLOCK_QTY: number,
    TOTAL_STOCK: number,
  }

  interface STOCK_PROD_REQUEST_NO {
    PROD_REQUEST_NO: string,
    STOCK: number,
    BLOCK_QTY: string,
    TOTAL_STOCK: string,
  }
  const KHOTPNEW = () => {
    const [showhidePivotTable, setShowHidePivotTable] = useState(false);    
    const [khotpinputdatatable, setKhoTPInputDataTable] = useState<Array<KTP_IN>>([]);
    const [khotpoutputdatatable, setKhoTPOutputDataTable] = useState<Array<KTP_OUT>>([]);
    const [tonktp_gcode, setTonKTPG_CODE] = useState<Array<STOCK_G_CODE>>([]);
    const [tonktp_gnamekd, setTonKTP_G_NAME_KD] = useState<Array<STOCK_G_NAME_KD>>([]);
    const [tonktp_prod_request_no, setTonKTP_PROD_REQUEST_NO] = useState<Array<STOCK_PROD_REQUEST_NO>>([]);

    const [fromdate, setFromDate] = useState(moment.utc().format("YYYY-MM-DD"));
    const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
    const [codeKD, setCodeKD] = useState("");
    const [codeCMS, setCodeCMS] = useState("");
    const [machine, setMachine] = useState("ALL");
    const [factory, setFactory] = useState("ALL");
    const [prodrequestno, setProdRequestNo] = useState("");
    const [plan_id, setPlanID] = useState("");
    const [alltime, setAllTime] = useState(true);
    const [khotpdatatable, setkhotpdatatable] = useState<Array<any>>([]);
    const [m_name, setM_Name] = useState("");
    const [m_code, setM_Code] = useState("");
    const [plph, setPLPH] = useState("PH");
    const [pltl, setPLTL] = useState("PH");
    const [ldph, setLDPH] = useState("New Code");
    const [rndEmpl, setRNDEMPL] = useState("");
    const [qcEmpl, setQCEMPL] = useState("");
    const [sxEmpl, setSXEMPL] = useState("");
    const [selectedRows, setSelectedRows] = useState<KTP_IN>();
    const [buttonselected, setbuttonselected]= useState('GR');


    const loadKTP_IN = () => {
      generalQuery("loadKTP_IN", {})
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            let loadeddata = response.data.data.map(
              (element: KTP_IN, index: number) => {
                return {
                  ...element,   
                  IN_DATE: moment.utc(element.IN_DATE).format('YYYY-MM-DD'),
                  INS_DATE: moment.utc(element.INS_DATE).format('YYYY-MM-DD'),
                  UPD_DATE: element.UPD_DATE !== null ? moment.utc(element.UPD_DATE).format('YYYY-MM-DD'): '',
                  id: index,
                };
              }
            );
            //console.log(loadeddata);
            setKhoTPInputDataTable(loadeddata);
            Swal.fire(
              "Thông báo",
              "Đã load: " + response.data.data.length + " dòng",
              "success"
            );
          } else {
            setKhoTPInputDataTable([]);
            Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    
    const loadKTP_OUT = () => {
      generalQuery("loadKTP_OUT", {})
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            let loadeddata = response.data.data.map(
              (element: KTP_OUT, index: number) => {
                return {
                  ...element,   
                  OUT_DATE: moment.utc(element.OUT_DATE).format('YYYY-MM-DD'),
                  INS_DATE: moment.utc(element.INS_DATE).format('YYYY-MM-DD'),
                  UPD_DATE: element.UPD_DATE !== null ? moment.utc(element.UPD_DATE).format('YYYY-MM-DD'): '',
                  id: index,
                };
              }
            );
            //console.log(loadeddata);
            setKhoTPOutputDataTable(loadeddata);
            Swal.fire(
              "Thông báo",
              "Đã load: " + response.data.data.length + " dòng",
              "success"
            );
          } else {
            setKhoTPOutputDataTable([]);
            Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const loadSTOCKFULL = () => {
        generalQuery("loadKTP_IN", {})
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            let loadeddata = response.data.data.map(
              (element: KTP_IN, index: number) => {
                return {
                  ...element,   
                  IN_DATE: moment.utc(element.IN_DATE).format('YYYY-MM-DD'),
                  INS_DATE: moment.utc(element.INS_DATE).format('YYYY-MM-DD'),
                  UPD_DATE: element.UPD_DATE !== null ? moment.utc(element.UPD_DATE).format('YYYY-MM-DD'): '',
                  id: index,
                };
              }
            );
            //console.log(loadeddata);
            setKhoTPInputDataTable(loadeddata);
            Swal.fire(
              "Thông báo",
              "Đã load: " + response.data.data.length + " dòng",
              "success"
            );
          } else {
            setKhoTPInputDataTable([]);
            Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const loadSTOCK_G_CODE = () => {
        generalQuery("loadSTOCKG_CODE", {})
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            let loadeddata = response.data.data.map(
              (element: STOCK_G_CODE, index: number) => {
                return {
                  ...element,
                  id: index,
                };
              }
            );
            //console.log(loadeddata);
            setTonKTPG_CODE(loadeddata);
            Swal.fire(
              "Thông báo",
              "Đã load: " + response.data.data.length + " dòng",
              "success"
            );
          } else {
            setTonKTPG_CODE([]);
            Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    
    
    const handleSearchCodeKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "Enter") {
        //loadKTP_IN();
        loadKTP_OUT();
      }
    };
    const KHOTP_INPUT = React.useMemo(
      () => (
        <div className='datatb'>
          <ResponsiveContainer>
            <DataGrid
              autoNavigateToFocusedRow={true}
              allowColumnReordering={true}
              allowColumnResizing={true}
              columnAutoWidth={false}
              cellHintEnabled={true}
              columnResizingMode={"widget"}
              showColumnLines={true}
              dataSource={khotpinputdatatable}
              columnWidth='auto'
              keyExpr='id'
              height={"75vh"}
              showBorders={true}
              onRowPrepared={(e)=> {                             
              }
              }
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
                showScrollbar='onHover'
                mode='virtual'
              />
              <Selection mode='single' selectAllMode='allPages' />
              <Editing
                allowUpdating={false}
                allowAdding={true}
                allowDeleting={false}
                mode='batch'
                confirmDelete={true}
                onChangesChange={(e) => {}}
              />
              <Export enabled={true} />
              <Toolbar disabled={false}>
                <Item location='before'>
                  <IconButton
                    className='buttonIcon'
                    onClick={() => {
                      SaveExcel(khotpinputdatatable, "MaterialStatus");
                    }}
                  >
                    <AiFillFileExcel color='green' size={15} />
                    SAVE
                  </IconButton>
                  <IconButton
                    className='buttonIcon'
                    onClick={() => {
                      setShowHidePivotTable(!showhidePivotTable);
                    }}
                  >
                    <MdOutlinePivotTableChart color='#ff33bb' size={15} />
                    Pivot
                  </IconButton>
                </Item>
                <Item name='searchPanel' />
                <Item name='exportButton' />
                <Item name='columnChooser' />
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
                infoText='Page #{0}. Total: {1} ({2} items)'
                displayMode='compact'
              />              
              <Summary>
                <TotalItem
                  alignment='right'
                  column='id'
                  summaryType='count'
                  valueFormat={"decimal"}
                />
              </Summary>
            </DataGrid>
          </ResponsiveContainer>
        </div>
      ),
      [khotpinputdatatable]
    );
    const KHOTP_OUTPUT = React.useMemo(
      () => (
        <div className='datatb'>
          <ResponsiveContainer>
            <DataGrid
              autoNavigateToFocusedRow={true}
              allowColumnReordering={true}
              allowColumnResizing={true}
              columnAutoWidth={false}
              cellHintEnabled={true}
              columnResizingMode={"widget"}
              showColumnLines={true}
              dataSource={khotpoutputdatatable}
              columnWidth='auto'
              keyExpr='id'
              height={"75vh"}
              showBorders={true}
              onRowPrepared={(e)=> {                             
              }
              }
              onSelectionChanged={(e) => {
                //setSelectedRows(e.selectedRowsData[0]);
              }}
              onRowClick={(e) => {
                //setSelectedRows(e.data);
                //console.log(e.data);
              }}
            >
              <Scrolling
                useNative={true}
                scrollByContent={true}
                scrollByThumb={true}
                showScrollbar='onHover'
                mode='virtual'
              />
              <Selection mode='single' selectAllMode='allPages' />
              <Editing
                allowUpdating={false}
                allowAdding={true}
                allowDeleting={false}
                mode='batch'
                confirmDelete={true}
                onChangesChange={(e) => {}}
              />
              <Export enabled={true} />
              <Toolbar disabled={false}>
                <Item location='before'>
                  <IconButton
                    className='buttonIcon'
                    onClick={() => {
                      SaveExcel(khotpinputdatatable, "MaterialStatus");
                    }}
                  >
                    <AiFillFileExcel color='green' size={15} />
                    SAVE
                  </IconButton>
                  <IconButton
                    className='buttonIcon'
                    onClick={() => {
                      setShowHidePivotTable(!showhidePivotTable);
                    }}
                  >
                    <MdOutlinePivotTableChart color='#ff33bb' size={15} />
                    Pivot
                  </IconButton>
                </Item>
                <Item name='searchPanel' />
                <Item name='exportButton' />
                <Item name='columnChooser' />
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
                infoText='Page #{0}. Total: {1} ({2} items)'
                displayMode='compact'
              />              
              <Summary>
                <TotalItem
                  alignment='right'
                  column='id'
                  summaryType='count'
                  valueFormat={"decimal"}
                />
              </Summary>
            </DataGrid>
          </ResponsiveContainer>
        </div>
      ),
      [khotpoutputdatatable]
    );
    const KHOTP_STOCKG_CODE = React.useMemo(
      () => (
        <div className='datatb'>
          <ResponsiveContainer>
            <DataGrid
              autoNavigateToFocusedRow={true}
              allowColumnReordering={true}
              allowColumnResizing={true}
              columnAutoWidth={false}
              cellHintEnabled={true}
              columnResizingMode={"widget"}
              showColumnLines={true}
              dataSource={tonktp_gcode}
              columnWidth='auto'
              keyExpr='id'
              height={"75vh"}
              showBorders={true}
              onRowPrepared={(e)=> {                             
              }
              }
              onSelectionChanged={(e) => {
                //setSelectedRows(e.selectedRowsData[0]);
              }}
              onRowClick={(e) => {
                //setSelectedRows(e.data);
                //console.log(e.data);
              }}
            >
              <Scrolling
                useNative={true}
                scrollByContent={true}
                scrollByThumb={true}
                showScrollbar='onHover'
                mode='virtual'
              />
              <Selection mode='single' selectAllMode='allPages' />
              <Editing
                allowUpdating={false}
                allowAdding={true}
                allowDeleting={false}
                mode='batch'
                confirmDelete={true}
                onChangesChange={(e) => {}}
              />
              <Export enabled={true} />
              <Toolbar disabled={false}>
                <Item location='before'>
                  <IconButton
                    className='buttonIcon'
                    onClick={() => {
                      SaveExcel(khotpinputdatatable, "MaterialStatus");
                    }}
                  >
                    <AiFillFileExcel color='green' size={15} />
                    SAVE
                  </IconButton>
                  <IconButton
                    className='buttonIcon'
                    onClick={() => {
                      setShowHidePivotTable(!showhidePivotTable);
                    }}
                  >
                    <MdOutlinePivotTableChart color='#ff33bb' size={15} />
                    Pivot
                  </IconButton>
                </Item>
                <Item name='searchPanel' />
                <Item name='exportButton' />
                <Item name='columnChooser' />
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
                infoText='Page #{0}. Total: {1} ({2} items)'
                displayMode='compact'
              />              
              <Summary>
                <TotalItem
                  alignment='right'
                  column='id'
                  summaryType='count'
                  valueFormat={"decimal"}
                />
              </Summary>
            </DataGrid>
          </ResponsiveContainer>
        </div>
      ),
      [tonktp_gcode]
    );

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
      store: khotpdatatable,
    });
    const filterOptions1 = createFilterOptions({
      matchFrom: "any",
      limit: 100,
    });
    const [isPending, startTransition] = useTransition();
    
    useEffect(() => {    
      loadKTP_IN();
      //setColumnDefinition(column_inspect_output);
    }, []);
    return (
      <div className='khotpnew'>
        <div className='tracuuDataInspection'>
          <div className='tracuuDataInspectionform'>
            <div className='forminput'>
              <div className='forminputcolumn'> 
                <label>
                <b>Ngày bàn giao:</b>
                <input onKeyDown={(e)=> {}}
                  type='date'
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>    

              <label>
                  <b>Phân loại phát hành:</b>{" "}
                  <select
                    name='vendor'
                    value={plph}
                    onChange={(e) => {
                        setPLPH(e.target.value);                      
                    }}
                  >
                    <option value='PH'>PHÁT HÀNH</option>
                    <option value='TH'>THU HỒI</option>                    
                  </select>
                </label>  

              </div>
              <div className='forminputcolumn'>              
              <label>
                  <b>Phân loại tài liệu:</b>{" "}
                  <select
                    name='vendor'
                    value={pltl}
                    onChange={(e) => {
                        setPLTL(e.target.value);                      
                    }}
                  >
                    <option value='F'>FILM</option>
                    <option value='D'>DAO</option>                    
                    <option value='T'>TÀI LIỆU</option>                    
                    <option value='M'>MẮT DAO</option>                    
                  </select>
                </label>  
              </div>
              <div className='forminputcolumn'>
              <label>
                  <b>Phân loại bàn giao:</b>{" "}
                  <select
                    name='vendor'
                    value={ldph}
                    onChange={(e) => {
                        setLDPH(e.target.value);                      
                    }}
                  >
                    <option value='New Code'>New Code</option>
                    <option value='ECN'>ECN</option>                    
                    <option value='Update'>Update</option>                    
                    <option value='Amendment'>Amendment</option>                    
                  </select>
                </label>  

                <label>
                  <b>Mã nhân viên RND:</b>{" "}
                  <input
                    type='text'
                    placeholder='RND'
                    value={rndEmpl}
                    onChange={(e) =>
                      setRNDEMPL(e.target.value)
                    }
                  ></input>
                </label>
              </div>
              <div className='forminputcolumn'>
              <label>
                  <b>Mã nhân viên QC:</b>{" "}
                  <input
                    type='text'
                    placeholder='QC'
                    value={qcEmpl}
                    onChange={(e) =>
                      setQCEMPL(e.target.value)
                    }
                  ></input>
                </label>
              <label>
                  <b>Mã nhân viên SX:</b>{" "}
                  <input
                    type='text'
                    placeholder='SX'
                    value={sxEmpl}
                    onChange={(e) =>
                      setSXEMPL(e.target.value)
                    }
                  ></input>
                </label>
              </div>
            </div>
            <div className='formbutton'>
              <button
                className='tranhatky'
                onClick={() => {
                    setbuttonselected('GR');
                  loadKTP_IN();
                }}
              >
                GR History
              </button>
              <button
                className='tranhatky'
                onClick={() => {
                    setbuttonselected('GI');
                    loadKTP_OUT();                 
                }}
              >
                GI History
              </button>
              <button
                className='traxuatkiembutton'
                onClick={() => {
                    setbuttonselected('STOCKFULL');
                    loadSTOCKFULL();
                  
                }}
              >
                STOCK FULL
              </button>
              <button
                className='traxuatkiembutton'
                onClick={() => {
                    setbuttonselected('STOCKG_CODE');
                    loadSTOCK_G_CODE();
                  
                }}
              >
                STOCK G_CODE
              </button>
              <button
                className='traxuatkiembutton'
                onClick={() => {
                    setbuttonselected('STOCKG_NAME_KD');
                  
                }}
              >
                STOCK G_NAME_KD
              </button>
              <button
                className='traxuatkiembutton'
                onClick={() => {
                    setbuttonselected('STOCK_YCSX');
                  
                }}
              >
                STOCK_YCSX
              </button>
            </div>
          </div>
          { buttonselected ==='GR' && <div className='tracuuYCSXTable'>{KHOTP_INPUT}</div>}
          { buttonselected ==='GI' && <div className='tracuuYCSXTable'>{KHOTP_OUTPUT}</div>}
          { buttonselected ==='STOCKFULL' && <div className='tracuuYCSXTable'>{KHOTP_INPUT}</div>}
          { buttonselected ==='STOCKG_CODE' && <div className='tracuuYCSXTable'>{KHOTP_STOCKG_CODE}</div>}
          {showhidePivotTable && (
            <div className='pivottable1'>
              <IconButton
                className='buttonIcon'
                onClick={() => {
                  setShowHidePivotTable(false);
                }}
              >
                <AiFillCloseCircle color='blue' size={15} />
                Close
              </IconButton>
              <PivotTable datasource={dataSource} tableID='invoicetablepivot' />
            </div>
          )}
        </div>
      </div>
    );
  };
  export default KHOTPNEW;