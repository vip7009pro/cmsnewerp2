import {
  Button,
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
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import "./QLVL.scss";
import { UserContext } from "../../../api/Context";
import { generalQuery, getCompany, uploadQuery } from "../../../api/Api";
import { CustomResponsiveContainer, SaveExcel } from "../../../api/GlobalFunction";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotTable from "../../../components/PivotChart/PivotChart";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import {
  CustomerListData,
  MATERIAL_TABLE_DATA,
} from "../../../api/GlobalInterface";
import {
  MRT_ColumnDef,
  MRT_RowSelectionState,
  MRT_RowVirtualizer,
  MRT_SortingState,
  MaterialReactTable,
  createMRTColumnHelper,
  useMaterialReactTable,
} from 'material-react-table';
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid



const QLVL = () => {
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [data, set_material_table_data] = useState<Array<MATERIAL_TABLE_DATA>>([]);
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
    EXP_DATE: "-"
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
                DESCR: element.DESCR ?? "",
                SSPRICE: element.SSPRICE ?? 0,
                CMSPRICE: element.CMSPRICE ?? 0,
                SLITTING_PRICE: element.SLITTING_PRICE ?? 0,
                MASTER_WIDTH: element.MASTER_WIDTH ?? 0,
                ROLL_LENGTH: element.ROLL_LENGTH ?? 0,
                INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
                UPD_DATE: moment.utc(element.UPD_DATE).format("YYYY-MM-DD HH:mm:ss"),
                EXP_DATE: element.EXP_DATE ?? '-',
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          set_material_table_data(loadeddata);
         /*  Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
          ); */
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
  const uploadTDS = async (M_ID: number, up_file: any) => {
    if (up_file !== null && up_file !== undefined) {
      uploadQuery(up_file, "NVL_" + M_ID + ".pdf", "tds2")
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            generalQuery("updateTDSStatus", { M_ID: M_ID })
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  //console.log(response.data.data);
                  Swal.fire(
                    "Thông báo",
                    "Upload file thành công",
                    "success"
                  );
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Upload file thất bại:" + response.data.message,
                    "error"
                  );
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            Swal.fire(
              "Thông báo",
              "Upload file thất bại:" + response.data.message,
              "error"
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    else {
      Swal.fire("Thông báo", "Hãy chọn file", "warning");
    }
  }
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
            dataSource={data}
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
              onChangesChange={(e) => { }}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
              <Item location="before">
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(data, "MaterialStatus");
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
            <Column dataField="EXP_DATE" caption="EXP_DATE" width={100}></Column>
            <Column dataField='TDS' caption='TDS' width={200} cellRender={(ele: any) => {
              let href = `/tds2/NVL_${ele.data.M_ID}.pdf`;
              let file: any = null;
              if (ele.data.TDS === 'Y') {
                return (
                  <a target="_blank" rel="noopener noreferrer" href={href} >LINK</a>
                )
              }
              else {
                return (
                  <div className="tdsuploadbutton">
                    <button onClick={() => {
                      uploadTDS(ele.data.M_ID, file);
                    }}>Upload</button>
                    <input
                      accept='.pdf'
                      type='file'
                      onChange={(e: any) => {
                        file = e.target.files[0];
                      }}
                    />
                  </div>
                )
              }
            }}></Column>
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
    [data],
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
  
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  

 
  const rowStyle = { backgroundColor: 'transparent', height:'20px' };

// set background colour on even rows again, this looks bad, should be using CSS classes
const getRowStyle = (params:any)  => {
  return { backgroundColor: 'white', fontSize:'0.6rem'};
    /* if (params.data.M_ID % 2 === 0) {
        return { backgroundColor: 'white', fontSize:'0.6rem'};
    }
    else {
      return { backgroundColor: '#fbfbfb',fontSize:'0.6rem' };

    } */
};

  const gridRef = useRef<AgGridReact<MATERIAL_TABLE_DATA>>(null);
  const defaultColDef = useMemo(() => {
    return {
      initialWidth: 100,
      wrapHeaderText: true,
      autoHeaderHeight: false,     
      editable: false
    };
  }, []);
  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: 'M_ID',headerName: 'M_ID', headerCheckboxSelection: true, checkboxSelection: true,width: 90, resizable: true,headerHeight: 100, floatingFilter: true, cellStyle: (params:any) => {     
      /* if (params.data.M_ID%2==0 ) {
        return { backgroundColor: '#d4edda', color: '#155724' };
      } else {
        return { backgroundColor: '#f8d7da', color: '#721c24' };
      } */
    }},
    { field: 'M_NAME',headerName: 'M_NAME', width: 90, resizable: true,headerHeight: 200,floatingFilter: true, filter: true, editable: false},
    { field: 'DESCR',headerName: 'DESCR', width: 90, resizable: true,headerHeight: 200,floatingFilter: true, filter: true,},
    { field: 'CUST_CD',headerName: 'CUST_CD', width: 90, resizable: true,headerHeight: 200,floatingFilter: true, filter: true, },
    { field: 'CUST_NAME_KD',headerName: 'CUST_NAME_KD', width: 90, resizable: true,headerHeight: 200,floatingFilter: true, filter: true, },
    { field: 'SSPRICE',headerName: 'SSPRICE', width: 90, resizable: true, floatingFilter: true, filter: true, type: "number", cellDataType: "number"},
    { field: 'CMSPRICE',headerName: 'CMSPRICE', width: 90, resizable: true, floatingFilter: true, filter: true, type: "number"},
    { field: 'SLITTING_PRICE',headerName: 'SLITTING_PRICE', width: 90, resizable: true, floatingFilter: true, filter: true, type: "number"},
    { field: 'MASTER_WIDTH',headerName: 'MASTER_WIDTH', width: 90, resizable: true, floatingFilter: true, filter: true, type: "number"},
    { field: 'ROLL_LENGTH',headerName: 'ROLL_LENGTH', width: 90, resizable: true, floatingFilter: true, filter: true, type: "number"},
    { field: 'USE_YN',headerName: 'USE_YN', width: 90, resizable: true, floatingFilter: true, filter: true, },
    { field: 'EXP_DATE',headerName: 'EXP_DATE', width: 90, resizable: true, floatingFilter: true, filter: true, },
    { field: 'TDS',headerName: 'TDS', width: 90, resizable: true, cellRenderer: (params: CustomCellRendererProps) => {
      let href = `/tds2/NVL_${params.data?.M_ID}.pdf`;
      let file: any = null;
      if (params.data?.TDS === 'Y') {
        return (
          <a target="_blank" rel="noopener noreferrer" href={href} >LINK</a>
        )
      }
      else {
        return (
          <div className="tdsuploadbutton">
            <button onClick={() => {
              uploadTDS(params.data?.M_ID, file);
            }}>Upload</button>
            <input
              accept='.pdf'
              type='file'
              onChange={(e: any) => {
                file = e.target.files[0];
              }}
            />
          </div>
        )
      }

    }, floatingFilter: true, filter: true, },
    { field: 'INS_DATE',headerName: 'INS_DATE', width: 90, resizable: true, floatingFilter: true, filter: true, },
    { field: 'INS_EMPL',headerName: 'INS_EMPL', width: 90, resizable: true, floatingFilter: true, filter: true, },
    { field: 'UPD_DATE',headerName: 'UPD_DATE', width: 90, resizable: true, floatingFilter: true, filter: true, },
    { field: 'UPD_EMPL',headerName: 'UPD_EMPL', width: 90, resizable: true, floatingFilter: true, filter: true, },    
  ]);
  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current!.api.getSelectedRows();
    console.log(selectedRows);
  }, []);

  function setIdText(id: string, value: string | number | undefined) {
    document.getElementById(id)!.textContent =
      value == undefined ? "undefined" : value + "";
  }
  const setHeaderHeight = useCallback((value?: number) => {
    gridRef.current!.api.setGridOption("headerHeight", value);
    setIdText("headerHeight", value);
  }, []);
  const columns = useMemo<MRT_ColumnDef<MATERIAL_TABLE_DATA>[]>(
    () => [     
      {        
        accessorKey: 'M_ID', //id required if you use accessorFn instead of accessorKey
        header: 'M_ID',
        id:'M_ID',
        Header: <b style={{ color: 'red', fontSize:'0.6rem' }}>M_ID</b>, //optional custom markup
        Cell: ({ cell }) => <span style={{ color: 'black', fontSize:'0.6rem' }}>{cell.getValue<number>()}</span>, //optional custom cell render
        size: 50,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
        muiTableFooterCellProps: {
          align: 'left',
        },
      },
      {
        
        accessorKey: 'M_NAME', //id required if you use accessorFn instead of accessorKey
        header: 'M_NAME',
        Header: <b style={{ color: 'green', fontSize:'0.6rem' }}>M_NAME</b>, //optional custom markup
        Cell: ({ cell }) => <span style={{ color: 'black', fontSize:'0.6rem' }}>{cell.getValue<string>()}</span>, //optional custom cell render
        size: 100,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
      },
      {
        
        accessorKey: 'DESCR', //id required if you use accessorFn instead of accessorKey
        header: 'DESCR',
        Header: <i style={{ color: 'green', fontSize:'0.6rem' }}>DESCR</i>, //optional custom markup
        Cell: ({ cell }) => <span style={{ color: 'black', fontSize:'0.6rem' }}>{cell.getValue<string>()}</span>, //optional custom cell render
        size: 100,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
      },
      {
        
        accessorKey: 'CUST_CD',
        header: 'CUST_CD',
        Header: <i style={{ color: 'green', fontSize:'0.6rem' }}>CUST_CD</i>,
        Cell: ({ cell }) => <span style={{ color: 'black', fontSize:'0.6rem' }}>{cell.getValue<string>()}</span>,
        size: 100,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
      },
      {
        
        accessorKey: 'CUST_NAME_KD',
        header: 'CUST_NAME_KD',
        Header: <i style={{ color: 'green', fontSize:'0.6rem' }}>CUST_NAME_KD</i>,
        Cell: ({ cell }) => <span style={{ color: 'black', fontSize:'0.6rem' }}>{cell.getValue<string>()}</span>,
        size: 100,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
      },
      {
        
        accessorKey: 'SSPRICE',
        header: 'SSPRICE',
        Header: <i style={{ color: 'green', fontSize:'0.6rem' }}>OPEN_PRICE</i>,
        Cell: ({ cell }) => <span style={{ color: 'black', fontSize:'0.6rem' }}>{cell.getValue<number>()?.toLocaleString('en-US')}</span>,
        size: 100,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
      },
      {
        
        accessorKey: 'CMSPRICE',
        header: 'CMSPRICE',
        Header: <i style={{ color: 'green', fontSize:'0.6rem' }}>ORIGIN_PRICE</i>,
        Cell: ({ cell }) => <span style={{ color: 'black', fontSize:'0.6rem' }}>{cell.getValue<number>()?.toLocaleString('en-US')}</span>,
        size: 100,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
      },
      {
        
        accessorKey: 'SLITTING_PRICE',
        header: 'SLITTING_PRICE',
        Header: <i style={{ color: 'green', fontSize:'0.6rem' }}>SLITTING_PRICE</i>,
        Cell: ({ cell }) => <span style={{ color: 'black', fontSize:'0.6rem' }}>{cell.getValue<number>()?.toLocaleString('en-US')}</span>,
        size: 100,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
      },
      {
        
        accessorKey: 'MASTER_WIDTH',
        header: 'MASTER_WIDTH',
        Header: <i style={{ color: 'green', fontSize:'0.6rem' }}>MASTER_WIDTH</i>,
        Cell: ({ cell }) => <span style={{ color: 'black', fontSize:'0.6rem' }}>{cell.getValue<number>()?.toLocaleString('en-US')}</span>,
        size: 100,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
      },
      {        
        accessorKey: 'ROLL_LENGTH',
        header: 'ROLL_LENGTH',
        Header: <i style={{ color: 'green', fontSize:'0.6rem' }}>ROLL_LENGTH</i>,
        Cell: ({ cell }) => <span style={{ color: 'black', fontSize:'0.6rem' }}>{cell.getValue<number>()?.toLocaleString('en-US')}</span>,
        size: 100,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
      },
      {        
        accessorKey: 'USE_YN',
        header: 'USE_YN',
        Header: <i style={{ color: 'green', fontSize:'0.6rem' }}>USE_YN</i>,
        Cell: ({ cell }) => <span style={{ color: 'black', fontSize:'0.6rem' }}>{cell.getValue<string>()}</span>,
        size: 60,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
      },      
      {        
        accessorKey: 'TDS',
        header: 'TDS',
        Header: <i style={{ color: 'green', fontSize:'0.6rem' }}>TDS</i>,
        Cell: ({ cell }) => <span style={{ color: 'black', fontSize:'0.6rem' }}>{cell.getValue<string>()}</span>,
        size: 50,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
      },
      {        
        accessorKey: 'INS_DATE',
        header: 'INS_DATE',
        Header: <i style={{ color: 'green', fontSize:'0.6rem' }}>INS_DATE</i>,
        Cell: ({ cell }) => <span style={{ color: 'black', fontSize:'0.6rem' }}>{moment(cell.getValue<string>()).format('YYYY-MM-DD HH:mm:ss')}</span>,
        size: 100,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
      },
      {        
        accessorKey: 'INS_EMPL',
        header: 'INS_EMPL',
        Header: <i style={{ color: 'green', fontSize:'0.6rem' }}>INS_EMPL</i>,
        Cell: ({ cell }) => <span style={{ color: 'black', fontSize:'0.6rem' }}>{cell.getValue<string>()}</span>,
        size: 80,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
      },
      {        
        accessorKey: 'UPD_DATE',
        header: 'UPD_DATE',
        Header: <i style={{ color: 'green', fontSize:'0.6rem' }}>UPD_DATE</i>,
        Cell: ({ cell }) => <span style={{ color: 'black', fontSize:'0.6rem' }}>{moment(cell.getValue<string>()).format('YYYY-MM-DD HH:mm:ss')}</span>,
        size: 100,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
      },
      {        
        accessorKey: 'UPD_EMPL',
        header: 'UPD_EMPL',
        Header: <i style={{ color: 'green', fontSize:'0.6rem' }}>UPD_EMPL</i>,
        Cell: ({ cell }) => <span style={{ color: 'black', fontSize:'0.6rem' }}>{cell.getValue<string>()}</span>,
        size: 80,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
      },
    ],
    [],
  );
  const table = useMaterialReactTable({
    columns,
    data,
    initialState: { density: 'compact' },
    enablePagination: false,    
    /* enableRowNumbers: true, */
    enableRowVirtualization: true,
    enableGlobalFilterModes: true,
    onSortingChange: setSorting,
    state: {sorting, rowSelection },
    rowVirtualizerInstanceRef,
    rowVirtualizerOptions: { overscan: 5 },
    enableColumnResizing: true,    
    enableMultiRowSelection: true,    
    enableBatchRowSelection: true,
    enableSelectAll: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    
    /* enableEditing: true, */
    /* enableRowActions: true, */
    /* enableBottomToolbar: true */
  });
  useEffect(() => {
    //load_material_table();
    getcustomerlist();
    
    //setColumnDefinition(column_inspect_output);
  }, [defaultColDef]);
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
                    `${option.CUST_CD !== null ? option.CUST_NAME_KD : ""}${option.CUST_CD !== null ? option.CUST_CD : ""
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
                    CUST_CD: selectedRows?.CUST_CD,
                    CUST_NAME: customerList.filter(
                      (e: CustomerListData, index: number) =>
                        e.CUST_CD === selectedRows?.CUST_CD,
                    )[0]?.CUST_NAME,
                    CUST_NAME_KD:
                      customerList.filter(
                        (e: CustomerListData, index: number) =>
                          e.CUST_CD === selectedRows?.CUST_CD,
                      )[0]?.CUST_NAME_KD === undefined
                        ? ""
                        : customerList.filter(
                          (e: CustomerListData, index: number) =>
                            e.CUST_CD === selectedRows?.CUST_CD,
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
            </div>
            <div className="forminputcolumn">
              <label>
                <b>HSD:</b>{" "}
                <input
                  type="text"
                  placeholder="Master width"
                  value={selectedRows?.EXP_DATE}
                  onChange={(e) => seMaterialInfo("EXP_DATE", e.target.value)}
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
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#129232' }} onClick={() => {
              load_material_table();
            }}>Refresh</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f05bd7' }} onClick={() => {
              addMaterial();
            }}>Add</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#ec9d52' }} onClick={() => {
              updateMaterial();
            }}>Update</Button>
            
           
          </div>
          <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#ec9d52' }} onClick={() => {
              console.log(data)
            }}>TEST</Button>
       
        </div>
       
        {/* <div className="tracuuYCSXTable"><Example/></div> */}
        {/* <div className="tracuuYCSXTable"><MaterialReactTable table={table} /></div> */}
        <div className="tracuuYCSXTable">
          <div className="toolbar">
          <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(data, "MaterialStatus");
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
          </div>
          <div
            className="ag-theme-quartz" // applying the grid theme
            style={{ height: '100%' }} // the grid will fill the size of the parent container
          >
            <AgGridReact
              rowData={data}
              columnDefs={colDefs}
              rowHeight={25}
              defaultColDef={defaultColDef} 
              ref={gridRef}
              onGridReady={()=> {
                setHeaderHeight(20);
              }}              
              columnHoverHighlight={true}
              rowStyle={rowStyle}
              getRowStyle={getRowStyle}
              getRowId={(params:any)=> params.data.M_ID}
              rowSelection={"multiple"}
              rowMultiSelectWithClick={true}    
              onSelectionChanged={onSelectionChanged}   
              onRowClicked={(params:any)=> {
                setSelectedRows(params.data)
                console.log(params.data)
              }}  
              suppressRowClickSelection={true}
              enterNavigatesVertically={true}
              enterNavigatesVerticallyAfterEdit={true}
              stopEditingWhenCellsLoseFocus ={true}   
              rowBuffer={10}   
              debounceVerticalScrollbar={false}
              enableRangeSelection={true}      
              floatingFiltersHeight={23} 
            />
          </div>
          </div>
        {/* <div className="tracuuYCSXTable">{materialDataTable}</div> */}
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
export default QLVL;
