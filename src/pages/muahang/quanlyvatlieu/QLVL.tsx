import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
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
import React, { useContext, useEffect, useState } from "react";
import { AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import "./QLVL.scss";
import { UserContext } from "../../../api/Context";
import { generalQuery, getCompany } from "../../../api/Api";
import { CustomResponsiveContainer, SaveExcel } from "../../../api/GlobalFunction";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotTable from "../../../components/PivotChart/PivotChart";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import {
  CustomerListData,
  MATERIAL_TABLE_DATA,
} from "../../../api/GlobalInterface";

const QLVL = () => {
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [material_table_data, set_material_table_data] = useState<
    Array<MATERIAL_TABLE_DATA>
  >([]);
  const [datasxtable, setDataSXTable] = useState<Array<any>>([]);
  const [m_name, setM_Name] = useState("");
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
                DESCR: element.DESCR === null ? "" : element.DESCR,
                SSPRICE: element.SSPRICE === null ? 0 : element.SSPRICE,
                CMSPRICE: element.CMSPRICE === null ? 0 : element.CMSPRICE,
                SLITTING_PRICE:
                  element.SLITTING_PRICE === null ? 0 : element.SLITTING_PRICE,
                MASTER_WIDTH:
                  element.MASTER_WIDTH === null ? 0 : element.MASTER_WIDTH,
                ROLL_LENGTH:
                  element.ROLL_LENGTH === null ? 0 : element.ROLL_LENGTH,
                INS_DATE: moment
                  .utc(element.INS_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                UPD_DATE: moment
                  .utc(element.UPD_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          set_material_table_data(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
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
  const seMaterialInfo = (keyname: string, value: any) => {
    console.log(keyname);
    console.log(value);
    let tempCustInfo: MATERIAL_TABLE_DATA = {
      ...selectedRows,
      [keyname]: value,
    };
    //console.log(tempcodefullinfo);
    setSelectedRows(tempCustInfo);
  };
  const addMaterial = async () => {
    let materialExist: boolean = false;
    await generalQuery("checkMaterialExist", {
      M_NAME: selectedRows.M_NAME,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          materialExist = true;
        } else {
          materialExist = false;
        }
      })
      .catch((error) => {
        console.log(error);
      });

    if (materialExist === false) {
      await generalQuery("addMaterial", selectedRows)
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            Swal.fire("Thông báo", "Thêm vật liệu thành công", "success");
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      Swal.fire("Thông báo", "Vật liệu đã tồn tại", "error");
    }
  };

  const updateMaterial = async () => {
    generalQuery("updateMaterial", selectedRows)
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Update vật liệu thành công", "success");
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      load_material_table();
    }
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
              setSelectedRows(e.selectedRowsData[0]);
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
              onChangesChange={(e) => {}}
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
                  <AiFillFileExcel color="green" size={25} />
                  SAVE
                </IconButton>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    setShowHidePivotTable(!showhidePivotTable);
                  }}
                >
                  <MdOutlinePivotTableChart color="#ff33bb" size={25} />
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
            <Column dataField="M_ID" caption="M_ID" width={100}></Column>
            <Column dataField="M_NAME" caption="M_NAME" width={100}></Column>
            <Column dataField="DESCR" caption="DESCR" width={100}></Column>
            <Column dataField="CUST_CD" caption="CUST_CD" width={100}></Column>
            <Column
              dataField="CUST_NAME_KD"
              caption="CUST_NAME_KD"
              width={100}
            ></Column>
            <Column
              dataField="SSPRICE"
              caption="OPEN_PRICE"
              width={100}
            ></Column>
            <Column
              dataField="CMSPRICE"
              caption="ORIGIN_PRICE"
              width={100}
            ></Column>
            <Column
              dataField="SLITTING_PRICE"
              caption="SLITTING_PRICE"
              width={100}
            ></Column>
            <Column
              dataField="MASTER_WIDTH"
              caption="MASTER_WIDTH"
              width={100}
            ></Column>
            <Column
              dataField="ROLL_LENGTH"
              caption="ROLL_LENGTH"
              width={100}
            ></Column>
            <Column dataField="USE_YN" caption="USE_YN" width={100}></Column>
            <Column
              dataField="INS_DATE"
              caption="INS_DATE"
              width={100}
            ></Column>
            <Column
              dataField="INS_EMPL"
              caption="INS_EMPL"
              width={100}
            ></Column>
            <Column
              dataField="UPD_DATE"
              caption="UPD_DATE"
              width={100}
            ></Column>
            <Column
              dataField="UPD_EMPL"
              caption="UPD_EMPL"
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

  useEffect(() => {
    load_material_table();
    getcustomerlist();
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className="qlvl">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform">
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Mã Vật Liệu:</b>{" "}
                <input
                  type="text"
                  placeholder="Mã Vật Liệu"
                  value={selectedRows?.M_NAME}
                  onChange={(e) => seMaterialInfo("M_NAME", e.target.value)}
                ></input>
              </label>
              <label style={{ display: "flex", alignItems: "center" }}>
                <b>Vendor:</b>{" "}
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
                    `${option.CUST_CD !== null ? option.CUST_NAME_KD : ""}${
                      option.CUST_CD !== null ? option.CUST_CD : ""
                    }`
                  }
                  renderInput={(params) => (
                    <TextField {...params} style={{ height: "10px" }} />
                  )}
                  defaultValue={{
                    CUST_CD: getCompany() === "CMS" ? "0000" : "KH000",
                    CUST_NAME: getCompany() === "CMS" ? "SEOJIN" : "PVN",
                    CUST_NAME_KD: getCompany() === "CMS" ? "SEOJIN" : "PVN",
                  }}
                  value={{
                    CUST_CD: selectedRows.CUST_CD,
                    CUST_NAME: customerList.filter(
                      (e: CustomerListData, index: number) =>
                        e.CUST_CD === selectedRows.CUST_CD,
                    )[0]?.CUST_NAME,
                    CUST_NAME_KD:
                      customerList.filter(
                        (e: CustomerListData, index: number) =>
                          e.CUST_CD === selectedRows.CUST_CD,
                      )[0]?.CUST_NAME_KD === undefined
                        ? ""
                        : customerList.filter(
                            (e: CustomerListData, index: number) =>
                              e.CUST_CD === selectedRows.CUST_CD,
                          )[0]?.CUST_NAME_KD,
                  }}
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue);
                    seMaterialInfo(
                      "CUST_CD",
                      newValue === null ? "" : newValue.CUST_CD,
                    );
                  }}
                />
              </label>

              {/* <label>
                <b>Vendor:</b>{" "}
                      <select
                        name='vendor'
                        value={selectedRows?.CUST_CD}
                        onChange={(e) => {
                            seMaterialInfo("CUST_CD", e.target.value);
                            console.log(selectedRows);
                        }}
                      >
                        {customerList.map((element, index) => (
                          <option key={index} value={element.CUST_CD}>
                            {element.CUST_NAME_KD}
                          </option>
                        ))}
                      </select>
                </label> */}
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Mô tả:</b>{" "}
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={selectedRows?.DESCR}
                  onChange={(e) => seMaterialInfo("DESCR", e.target.value)}
                ></input>
              </label>
              <label>
                <b>Open Price:</b>{" "}
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={selectedRows?.SSPRICE}
                  onChange={(e) => seMaterialInfo("SSPRICE", e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Origin Price:</b>{" "}
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={selectedRows?.CMSPRICE}
                  onChange={(e) => seMaterialInfo("CMSPRICE", e.target.value)}
                ></input>
              </label>
              <label>
                <b>Slitting Price:</b>{" "}
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={selectedRows?.SLITTING_PRICE}
                  onChange={(e) =>
                    seMaterialInfo("SLITTING_PRICE", e.target.value)
                  }
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Master Width:</b>{" "}
                <input
                  type="text"
                  placeholder="Master width"
                  value={selectedRows?.MASTER_WIDTH}
                  onChange={(e) =>
                    seMaterialInfo("MASTER_WIDTH", e.target.value)
                  }
                ></input>
              </label>
              <label>
                <b>Roll Length:</b>{" "}
                <input
                  type="text"
                  placeholder="Roll length"
                  value={selectedRows?.ROLL_LENGTH}
                  onChange={(e) =>
                    seMaterialInfo("ROLL_LENGTH", e.target.value)
                  }
                ></input>
              </label>
              <label>
                <FormControlLabel
                  label="Mở/Khóa"
                  control={
                    <Checkbox
                      checked={selectedRows?.USE_YN === "Y"}
                      onChange={(e) => {
                        seMaterialInfo(
                          "USE_YN",
                          e.target.checked === true ? "Y" : "N",
                        );
                      }}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                />
              </label>
            </div>
          </div>
          <div className="formbutton">
            <button
              className="tranhatky"
              onClick={() => {
                load_material_table();
              }}
            >
              Refesh
            </button>
            <button
              className="tranhatky"
              onClick={() => {
                addMaterial();
              }}
            >
              Add
            </button>
            <button
              className="traxuatkiembutton"
              onClick={() => {
                updateMaterial();
              }}
            >
              Update
            </button>
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
              <AiFillCloseCircle color="blue" size={25} />
              Close
            </IconButton>
            <PivotTable datasource={dataSource} tableID="invoicetablepivot" />
          </div>
        )}
      </div>
    </div>
  );
};
export default QLVL;
