import {
    IconButton,
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
  import {
    AiFillCloseCircle,
    AiFillFileExcel,
  } from "react-icons/ai";
  import Swal from "sweetalert2";
  import "./PRODUCT_BARCODE_MANAGER.scss";
  import { UserContext } from "../../../api/Context";
  import { generalQuery } from "../../../api/Api";
  import { SaveExcel } from "../../../api/GlobalFunction";
  import { MdOutlinePivotTableChart } from "react-icons/md";
  import PivotTable from "../../../components/PivotChart/PivotChart";
  import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
  import { ResponsiveContainer } from "recharts";

  interface CustomerListData {
    CUST_CD: string;
    CUST_NAME_KD: string;
    CUST_NAME: string;
  }
  interface MATERIAL_TABLE_DATA {
    M_ID: number,
    M_NAME: string,
    DESCR: string,
    CUST_CD: string,
    CUST_NAME_KD: string,
    SSPRICE: number,
    CMSPRICE: number,
    SLITTING_PRICE: number,
    MASTER_WIDTH: number,
    ROLL_LENGTH: number,
    USE_YN: string,
    INS_DATE: string,
    INS_EMPL: string, 
    UPD_DATE: string,
    UPD_EMPL: string,
  }

  interface BARCODE_DATA {
    G_CODE: string,
    G_NAME: string,
    BARCODE_STT: string,
    BARCODE_TYPE: string,
    BARCODE_RND: string,
    BARCODE_INSP: string,
    BARCODE_RELI: string,
    STATUS: string,
  }

  const PRODUCT_BARCODE_MANAGER = () => {
    const [showhidePivotTable, setShowHidePivotTable] = useState(false);
    const [material_table_data, set_material_table_data] = useState<Array<MATERIAL_TABLE_DATA>>([]);
    const [barcodedatatable, setBarCodeDataTable] = useState<Array<BARCODE_DATA>>([]);
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
        G_CODE:'',
        BARCODE_INSP:'',
        BARCODE_RELI:'',
        BARCODE_RND:'',
        BARCODE_STT:'',
        BARCODE_TYPE:'',
        G_NAME:'',
        STATUS:'',
    });
    const load_material_table = () => {
        generalQuery("get_material_table", {
            M_NAME: m_name,          
        })
            .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
                let loadeddata = response.data.data.map(
                (element: MATERIAL_TABLE_DATA, index: number) => {
                    return {
                    ...element,
                    DESCR: element.DESCR === null? '': element.DESCR,
                    SSPRICE: element.SSPRICE === null? 0: element.SSPRICE,
                    CMSPRICE: element.CMSPRICE === null? 0: element.CMSPRICE,
                    SLITTING_PRICE: element.SLITTING_PRICE === null? 0: element.SLITTING_PRICE,
                    MASTER_WIDTH: element.MASTER_WIDTH === null? 0: element.MASTER_WIDTH,
                    ROLL_LENGTH: element.ROLL_LENGTH === null? 0: element.ROLL_LENGTH,
                    INS_DATE: moment.utc(element.INS_DATE).format('YYYY-MM-DD HH:mm:ss'),
                    UPD_DATE: moment.utc(element.UPD_DATE).format('YYYY-MM-DD HH:mm:ss'),
                    id: index,
                    };
                }
                );
                //console.log(loadeddata);
                set_material_table_data(loadeddata);
                Swal.fire(
                "Thông báo",
                "Đã load: " + response.data.data.length + " dòng",
                "success"
                );
            } else {
                set_material_table_data([]);
                Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
            }
            })
            .catch((error) => {
            console.log(error);
            });
        };
    const setBarCodeInfo = (keyname: string, value: any) => {
      console.log(keyname)
      console.log(value)
      let tempCustInfo:BARCODE_DATA  = { ...selectedRows, [keyname]: value };
      //console.log(tempcodefullinfo);
      setSelectedRows(tempCustInfo);
    };
    const addBarcode = async ()=> {
        let materialExist: boolean = false;
        await generalQuery("checkbarcode", selectedRows)
        .then((response) => {       
        if (response.data.tk_status !== "NG") {   
            materialExist = true;
            
        } else { 
            materialExist = false;
        }
        })
        .catch((error) => {
        console.log(error);
        });
        if(materialExist === false)
        {
            await generalQuery("addBarcode", selectedRows)
            .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {   
                Swal.fire('Thông báo','Thêm vật liệu thành công','success'); 
            } else {
               
            }
            })
            .catch((error) => {
            console.log(error);
            });
            
        }
        else
        {
            Swal.fire('Thông báo','Vật liệu đã tồn tại','error');
        }  
    }

    const updateMaterial = async ()=> {
             generalQuery("updateMaterial", selectedRows)
            .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") { 
                Swal.fire('Thông báo','Update vật liệu thành công','success');
            } else {
               
            }
            })
            .catch((error) => {
            console.log(error);
            });
            
        
    }

    const handleSearchCodeKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "Enter") {                      
        load_material_table();
      }
    };    
    const BarcodeDataTable = React.useMemo(
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
            dataSource={barcodedatatable}
            columnWidth='auto'
            keyExpr='id'
            height={"75vh"}
            showBorders={true}
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
                    SaveExcel(datasxtable, "MaterialStatus");
                  }}
                >
                  <AiFillFileExcel color='green' size={25} />
                  SAVE
                </IconButton>
                <IconButton
            className='buttonIcon'
            onClick={() => {
              setShowHidePivotTable(!showhidePivotTable);
            }}
          >
            <MdOutlinePivotTableChart color='#ff33bb' size={25} />
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
            <Column dataField='G_CODE' caption='G_CODE' width={100}></Column>
            <Column dataField='G_NAME' caption='G_NAME' width={100}></Column>
            <Column dataField='BARCODE_STT' caption='BARCODE_STT' width={100}></Column>
            <Column dataField='BARCODE_TYPE' caption='BARCODE_TYPE' width={100}></Column>
            <Column dataField='BARCODE_RND' caption='BARCODE_RND' width={100}></Column>
            <Column dataField='BARCODE_INSP' caption='BARCODE_INSP' width={100}></Column>
            <Column dataField='BARCODE_RELI' caption='BARCODE_RELI' width={100}></Column>
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
      [material_table_data]
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
    useEffect(() => {
        load_material_table();
        getcustomerlist();      
      //setColumnDefinition(column_inspect_output);
    }, []);
    return (
      <div className='qlvl'>
        <div className='tracuuDataInspection'>
          <div className='tracuuDataInspectionform'>
            <div className='forminput'>             
              <div className='forminputcolumn'>
                <label>
                  <b>Code ERP:</b>{" "}
                  <input 
                    type='text'
                    placeholder='Code hệ thống'
                    value={selectedRows?.G_CODE}
                    onChange={(e) => setBarCodeInfo('G_CODE',e.target.value)}
                  ></input>
                </label>
                
              </div> 
              <div className='forminputcolumn'>
                <label>
                  <b>G_NAME</b>{" "}
                  <input 
                    type='text'
                    placeholder='Tên sản phẩm'
                    value={selectedRows?.G_NAME}
                    onChange={(e) => setBarCodeInfo('G_NAME',e.target.value)}
                  ></input>
                </label>               
                <label>
                  <b>STT BARCODE:</b>{" "}
                  <input 
                    type='text'
                    placeholder='Số thứ tự barcode'
                    value={selectedRows?.BARCODE_STT}
                    onChange={(e) => setBarCodeInfo('SSPRICE',e.target.value)}
                  ></input>
                </label>               
              </div>                          
              <div className='forminputcolumn'>
              <label>
                <b>Barcode Type:</b>{" "}
                      <select
                        name='vendor'
                        value={selectedRows?.BARCODE_TYPE}
                        onChange={(e) => {
                          setBarCodeInfo("BARCODE_TYPE", e.target.value);
                        }}
                      >                      
                          <option value='1D'>1D BARCODE</option>                        
                          <option value='2D'>2D MATRIX</option>                        
                          <option value='QR'>QR CODE</option>                        
                      </select>
                </label>             
                <label>
                  <b>BARCODE RND:</b>{" "}
                  <input 
                    type='text'
                    placeholder='BARCODE RND'
                    value={selectedRows?.BARCODE_RND}
                    onChange={(e) => setBarCodeInfo('BARCODE_RND',e.target.value)}
                  ></input>
                </label>  
              </div>                          
              <div className='forminputcolumn'>
              <label>
                  <b>BARCODE DTC:</b>{" "}
                  <input 
                    type='text'
                    placeholder='BARCODE DTC'
                    value={selectedRows?.BARCODE_RELI}
                    onChange={(e) => setBarCodeInfo('BARCODE_RELI',e.target.value)}
                  ></input>
                </label>  
                <label>
                  <b>BARCODE KT:</b>{" "}
                  <input 
                    type='text'
                    placeholder='BARCODE KT'
                    value={selectedRows?.BARCODE_INSP}
                    onChange={(e) => setBarCodeInfo('BARCODE_INSP',e.target.value)}
                  ></input>
                </label>
              </div>                          
            </div>
            <div className='formbutton'>             
              <button
                className='tranhatky'
                onClick={() => { 
                    load_material_table();
                }}
              >
                Refesh
              </button>
              <button
                className='tranhatky'
                onClick={() => { 
                    addBarcode();
                }}
              >
                Add
              </button>
              <button
                className='traxuatkiembutton'
                onClick={() => {  
                    updateMaterial(); 
                }}
              >
                Update
              </button>
            </div>
          </div>
          <div className='tracuuYCSXTable'>            
            {BarcodeDataTable}
          </div>
          {showhidePivotTable && (
          <div className='pivottable1'>
            <IconButton
              className='buttonIcon'
              onClick={() => {
                setShowHidePivotTable(false);
              }}
            >
              <AiFillCloseCircle color='blue' size={25} />
              Close
            </IconButton>
            <PivotTable datasource={dataSource} tableID='invoicetablepivot' />
          </div>
        )}
        </div>
      </div>
    );
  };
  export default PRODUCT_BARCODE_MANAGER;