import {
  Button,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
  createFilterOptions,
  Typography,
  AutocompleteRenderOptionState,
  AutocompleteOwnerState,
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
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { CustomerListData, MATERIAL_TABLE_DATA, MaterialListData, WH_M_INPUT_DATA } from "../../../../api/GlobalInterface";
import { generalQuery, getCompany } from "../../../../api/Api";
import { CustomResponsiveContainer, SaveExcel, zeroPad } from "../../../../api/GlobalFunction";
import PivotTable from "../../../../components/PivotChart/PivotChart";
import './NHAPLIEU.scss';
const NHAPLIEU = () => {
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [material_table_data, set_material_table_data] = useState<Array<WH_M_INPUT_DATA>>([]);
  const [datasxtable, setDataSXTable] = useState<Array<any>>([]);
  const [m_name, setM_Name] = useState("");
  const [invoice_no, setInvoiceNo] = useState("");
  const [loaink, setloaiNK] = useState("03");
  const [cust_cd, setCust_CD] = useState("");
  const [cust_name_kd, setCust_Name_KD] = useState("");
  const [selectedRows, setSelectedRows] = useState<MATERIAL_TABLE_DATA>({
    M_ID: 0,
    M_NAME: "",
    DESCR: "",
    CUST_CD: "",
    CUST_NAME_KD: "",
    SSPRICE: 0,
    CMSPRICE: 0,
    SLITTING_PRICE: 0,
    MASTER_WIDTH: 0,
    ROLL_LENGTH: 0,
    USE_YN: "Y",
    INS_DATE: "",
    INS_EMPL: "",
    UPD_DATE: "",
    UPD_EMPL: "",
    EXP_DATE:""
  });
  const [selectedFactory, setSelectedFactory] = useState("NM1");
  const [materialList, setMaterialList] = useState<MaterialListData[]>([
    {
      M_CODE: "A0000001",
      M_NAME: "#200",
      WIDTH_CD: 1200,
    },
  ]);
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialListData | null>({
      M_CODE: "A0000001",
      M_NAME: "#200",
      WIDTH_CD: 1200,
    });
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerListData | null>({
      CUST_CD: getCompany() === "CMS" ? "0049" : "KH000",
      CUST_NAME: getCompany() === "CMS" ? "SSJ CO., LTD" : "PVN",
      CUST_NAME_KD: getCompany() === "CMS" ? "SSJ" : "PVN", 
    });
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const seMaterialInfo = (keyname: string, value: any) => {
    let tempCustInfo: MATERIAL_TABLE_DATA = {
      ...selectedRows,
      [keyname]: value,
    };
    //console.log(tempcodefullinfo);
    setSelectedRows(tempCustInfo);
  };
  const addMaterial = async () => {
    let temp_m_invoie: WH_M_INPUT_DATA = {
      id: moment().format("YYYYMMDD_HHmmsss") + material_table_data.length.toString(),
      CUST_CD: selectedCustomer?.CUST_CD ?? "",
      CUST_NAME_KD: selectedCustomer?.CUST_NAME_KD ?? "",
      M_NAME: selectedMaterial?.M_NAME ?? "",
      M_CODE: selectedMaterial?.M_CODE ?? "",
      WIDTH_CD: selectedMaterial?.WIDTH_CD!,
      INVOICE_NO: invoice_no,
      EXP_DATE: todate,
      PROD_REQUEST_NO: "",
      REMARK: "",
      MET_PER_ROLL: 0,
      LOT_QTY: 0,
      ROLL_PER_LOT: 1,
    }
    if (temp_m_invoie.CUST_CD === '' || temp_m_invoie.M_CODE === '' || temp_m_invoie.INVOICE_NO === '' || temp_m_invoie.EXP_DATE === '') {
      Swal.fire("Thông báo", "Không được để trống thông tin cần thiết", "error");
    }
    else {
      set_material_table_data([...material_table_data, temp_m_invoie]);
    }
  };
  const getI221NextIN_NO= async () => {
    let next_in_no: string = "001";
    await generalQuery("getI221Lastest_IN_NO", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        console.log(response.data.data);
        const current_in_no:string = response.data.data[0].MAX_IN_NO ?? '000';        
        next_in_no = zeroPad(parseInt(current_in_no)+1,3);
      } else {
      }
    })
    .catch((error) => {
      //console.log(error);
    });
    console.log(next_in_no);
    return next_in_no;

  }
  const getI222Next_M_LOT_NO = async ()=> {
    let next_m_lot_no: string = "001";
    await generalQuery("getI222Lastest_M_LOT_NO", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        console.log(response.data.data);
        const current_m_lot_no:string = response.data.data[0].MAX_M_LOT_NO;
        let part1: string = current_m_lot_no.substring(0,8);
        let part2: string = current_m_lot_no.substring(8,12);
        next_m_lot_no = part1 + zeroPad(parseInt(part2)+1,4);
      } else {
      }
    })
    .catch((error) => {
      //console.log(error);
    });
    console.log(next_m_lot_no);
    return next_m_lot_no;
  }

  const nhapkho = async () => {
    if(material_table_data.length >0) {
      let next_in_no: string = await getI221NextIN_NO();
      console.log(next_in_no);
      let err_code: string = '';
    
     let checkmet: boolean = true;
     for(let i=0;i<material_table_data.length;i++)  {
      let ttmet =  material_table_data[i].LOT_QTY * material_table_data[i].ROLL_PER_LOT * material_table_data[i].MET_PER_ROLL;
      if(ttmet ===0) checkmet = false;
     }

     if(checkmet)  {
      for(let i=0;i<material_table_data.length;i++)  {
        if(material_table_data[i].LOT_QTY * material_table_data[i].ROLL_PER_LOT * material_table_data[i].MET_PER_ROLL >0)
        {
          let next_in_seq: string = zeroPad(i+1,3);
          await generalQuery("insert_I221", {
            IN_NO: next_in_no,
            IN_SEQ: next_in_seq,
            M_CODE: material_table_data[i].M_CODE,
            IN_CFM_QTY: material_table_data[i].LOT_QTY * material_table_data[i].ROLL_PER_LOT * material_table_data[i].MET_PER_ROLL,
            REMARK: material_table_data[i].REMARK,
            FACTORY: selectedFactory,
            CODE_50: loaink,
            INVOICE_NO: invoice_no,
            CUST_CD: selectedCustomer?.CUST_CD,
            ROLL_QTY: material_table_data[i].LOT_QTY * material_table_data[i].ROLL_PER_LOT,
            EXP_DATE: material_table_data[i].EXP_DATE
          })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              ////console.log(response.data.data);              
              //set_material_table_data([]);
              
                (async () => {
                  for(let j=0;j<material_table_data[i].LOT_QTY;j++) {
                  let next_m_lot_no: string = await getI222Next_M_LOT_NO();
                  await generalQuery("insert_I222", {
                    IN_NO: next_in_no,
                    IN_SEQ: next_in_seq,
                    M_LOT_NO: next_m_lot_no,
                    LOC_CD: selectedFactory==='NM1' ? 'BE010': 'HD001',
                    WAHS_CD: selectedFactory==='NM1' ? 'B': 'H',
                    M_CODE: material_table_data[i].M_CODE,
                    IN_CFM_QTY:  material_table_data[i].ROLL_PER_LOT * material_table_data[i].MET_PER_ROLL,                    
                    FACTORY: selectedFactory, 
                    CUST_CD: selectedCustomer?.CUST_CD,
                    ROLL_QTY: material_table_data[i].ROLL_PER_LOT,        
                    PROD_REQUEST_NO: material_table_data[i].PROD_REQUEST_NO,        
                  })
                  .then((response) => {
                    if (response.data.tk_status !== "NG") {
                      ////console.log(response.data.data);              
                      //set_material_table_data([]);
                     
                      
                    } else {
                      console.log(response.data.message);  
                      err_code += `Lỗi: ${response.data.message} | `;
                    }
                  })
                  .catch((error) => {
                    //console.log(error);
                  });
                }

                })()
            } else {
              err_code += `Lỗi: ${response.data.message} | `;
            }
          })
          .catch((error) => {
            //console.log(error);
          });
  
        }
        else {
          err_code += `Lỗi: Số roll hoặc số met phải lớn hơn 0 `;
        }  
       }
     }
     else {
      err_code = `Có dòng tổng met = 0 , check lại`;
     }
     

     if(err_code !=='') {
      set_material_table_data([]);
      Swal.fire('Thông báo','Nhập kho vật liệu thất bại: ' + err_code,'error');
     }
     else {
      Swal.fire('Thông báo','Nhập kho vật liệu thành công','success');
     }

    }
    else {
      Swal.fire("Thông báo", "Chưa có dòng nào",'error');

    }
  }
  const handleConfirmNhapKho= () => {
    Swal.fire({
      title: "Nhập liệu vào kho",
      text: "Chắc chắn muốn nhập kho các liệu đã nhập ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Nhập!",
    }).then((result) => {
      if (result.isConfirmed) {        
        nhapkho();
      }
    });
  };

  const materialDataTable = React.useMemo(
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
            dataSource={material_table_data}
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
            <Selection mode="multiple" selectAllMode="allPages" />
            <Editing
              allowUpdating={true}
              allowAdding={false}
              allowDeleting={true}
              mode="cell"
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
              <Item name="saveButton" />
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
            <Column dataField="CUST_NAME_KD" caption="CUST_NAME_KD" width={100} allowEditing={false} ></Column>
            <Column dataField="M_CODE" caption="M_CODE" width={100} allowEditing={false} ></Column>
            <Column dataField="M_NAME" caption="M_NAME" width={100} allowEditing={false} ></Column>
            <Column dataField="WIDTH_CD" caption="WIDTH_CD" width={100} allowEditing={false} ></Column>
            <Column
              dataField="LOT_QTY"
              caption="LOT_QTY"
              width={100}
             allowEditing={true} ></Column>
             <Column
              dataField="ROLL_PER_LOT"
              caption="ROLL_PER_LOT"
              width={100}
             allowEditing={true} ></Column>
            <Column
              dataField="MET_PER_ROLL"
              caption="MET_PER_ROLL"
              width={100}              
             allowEditing={true} ></Column>   
            <Column
              dataField="INVOICE_NO"
              caption="INVOICE_NO"
              width={100}
             allowEditing={false} ></Column>
            <Column
              dataField="REMARK"
              caption="REMARK"
              width={100}
             allowEditing={true} ></Column>
            <Column
              dataField="EXP_DATE"
              caption="EXP_DATE"
              width={100}
             allowEditing={false} ></Column>
            <Column dataField="PROD_REQUEST_NO" caption="PROD_REQUEST_NO" width={100} allowEditing={true} ></Column>
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
    [material_table_data],
  );
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const filterOptions1 = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });
  const getcustomerlist = () => {
    generalQuery("selectVendorList", {})
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
  const getmateriallist = () => {
    generalQuery("getMaterialList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          ////console.log(response.data.data);
          setMaterialList(response.data.data);
        } else {
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  useEffect(() => {
    getcustomerlist();
    getmateriallist();
  }, []);
  return (
    <div className="nhaplieu">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform">
          <div className="forminput">
            <div className="forminputcolumn">
              <div className="chonvatlieu" style={{ display: 'flex', alignItems: 'center' }}>
                <b>Vật liệu:</b>
                <label>
                  <Autocomplete
                    size="small"
                    disablePortal
                    options={materialList}
                    className="autocomplete"
                    filterOptions={filterOptions1}
                    isOptionEqualToValue={(option: any, value: any) =>
                      option.M_CODE === value.M_CODE
                    }
                    getOptionLabel={(option: MaterialListData | any) =>
                      `${option.M_NAME}|${option.WIDTH_CD}|${option.M_CODE}`
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Select material" />
                    )}
                    renderOption={(props, option: any)=> <Typography style={{ fontSize: '0.7rem' }} {...props}>
                    {`${option.M_NAME}|${option.WIDTH_CD}|${option.M_CODE}`}
                  </Typography>}
                    defaultValue={{
                      M_CODE: "A0007770",
                      M_NAME: "SJ-203020HC",
                      WIDTH_CD: 208,
                    }}
                    value={selectedMaterial}
                    onChange={(event: any, newValue: MaterialListData | any) => {
                      //console.log(newValue);
                      setSelectedMaterial(newValue);
                    }}
                  />
                </label>
              </div>
              <label style={{ display: "flex", alignItems: "center" }}>
                <b>Vendor:</b>
                <Autocomplete
                  sx={{
                    height: 10,
                    width: "160px",
                    margin: "1px",
                    fontSize: "0.7rem",
                    marginBottom: "20px",
                    backgroundColor: "white",
                  }}
                  size="small"
                  disablePortal
                  options={customerList}
                  className="autocomplete"
                  filterOptions={filterOptions1}
                  isOptionEqualToValue={(option: any, value: any) =>
                    option.CUST_CD === value.CUST_CD
                  }
                  getOptionLabel={(option: any) =>
                    `${option.CUST_CD !== null ? option.CUST_NAME_KD : ""}${option.CUST_CD !== null ? option.CUST_CD : ""
                    }`
                  }
                  renderInput={(params) => (
                    <TextField {...params} style={{ height: "10px" }} />
                  )}
                  renderOption={(props, option: any)=> <Typography style={{ fontSize: '0.7rem' }} {...props}>
                  {`${option.CUST_CD !== null ? option.CUST_NAME_KD : ""}${option.CUST_CD !== null ? option.CUST_CD : ""}`}
                 </Typography>}
                  defaultValue={{
                    CUST_CD: getCompany() === "CMS" ? "0000" : "KH000",
                    CUST_NAME: getCompany() === "CMS" ? "SEOJIN" : "PVN",
                    CUST_NAME_KD: getCompany() === "CMS" ? "SEOJIN" : "PVN",
                  }}
                  value={{
                    CUST_CD: selectedCustomer?.CUST_CD,
                    CUST_NAME: selectedCustomer?.CUST_NAME,
                    CUST_NAME_KD: selectedCustomer?.CUST_NAME_KD
                  }}
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue);
                    setSelectedCustomer(newValue);
                  }}
                />
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Factory:</b>
                <select
                  name='factory'
                  value={selectedFactory}
                  onChange={(e) => {
                    setSelectedFactory(e.target.value);
                  }}
                >
                  <option value='NM1'>NM1</option>
                  <option value='NM2'>NM2</option>
                </select>
              </label>
              <label>
                <b>PL Nhập Khẩu</b>
                <select
                  name="loaixh"
                  value={loaink}
                  onChange={(e) => {
                    setloaiNK(e.target.value);
                  }}
                >
                  <option value="01">GC</option>
                  <option value="02">SK</option>
                  <option value="03">KD</option>
                  <option value="04">VN</option>
                  <option value="05">SAMPLE</option>
                  <option value="06">Vai bac 4</option>
                  <option value="07">ETC</option>
                </select>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Ngày nhập kho:</b>
                <input
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Hạn Sử Dụng:</b>{" "}
                <input
                  type="date"
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Invoice No:</b>{" "}
                <input
                  type="text"
                  placeholder="Invoice No"
                  value={invoice_no}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                ></input>
              </label>
            </div>
          </div>
          <div className="formbutton">
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f05bd7' }} onClick={() => {
              addMaterial();
            }}>Add</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#ec9d52' }} onClick={() => {
              handleConfirmNhapKho();
            }}>Nhập kho</Button>
          </div>
        </div>
        <div className="tracuuYCSXTable">{materialDataTable}</div>
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
export default NHAPLIEU;
