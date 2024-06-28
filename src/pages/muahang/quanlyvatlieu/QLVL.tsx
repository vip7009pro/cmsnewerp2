import {
  Button,
  Autocomplete,
  IconButton,
  TextField,
  createFilterOptions,
} from "@mui/material";
import moment from "moment";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import "./QLVL.scss";
import { generalQuery, getCompany, getUserData, uploadQuery } from "../../../api/Api";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotTable from "../../../components/PivotChart/PivotChart";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import {
  CustomerListData,
  FSC_LIST_DATA,
  MATERIAL_TABLE_DATA,
} from "../../../api/GlobalInterface";
import {CustomCellRendererProps } from 'ag-grid-react'; // React Data Grid Component
/* import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; */ // Optional Theme applied to the grid
import AGTable from "../../../components/DataTable/AGTable";
import { checkBP } from "../../../api/GlobalFunction";
const QLVL = () => {
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [data, set_material_table_data] = useState<Array<MATERIAL_TABLE_DATA>>([]);
  const [m_name, setM_Name] = useState("");
  const [fscList, setFSCList] = useState<FSC_LIST_DATA[]>([]);
  const [clickedRows, setClickedRows] = useState<MATERIAL_TABLE_DATA>({
    M_ID: 0,
    M_NAME: "",
    DESCR: "",
    CUST_CD: "0049",
    CUST_NAME_KD: "SSJ",
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
    EXP_DATE: "-",
    FSC: "N",
    FSC_CODE: "01",
    FSC_NAME: "NA",
    TDS: "N"
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
                FSC: element.FSC ?? 'N',
                FSC_CODE: element.FSC_CODE ?? '01',
                FSC_NAME: element.FSC_NAME ?? 'NO_FSC',
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
    let tempMaterialInfo: MATERIAL_TABLE_DATA = {
      ...clickedRows,
      [keyname]: value,
    };
    //console.log(tempcodefullinfo);
    setClickedRows(tempMaterialInfo);
  };
  const addMaterial = async () => {
    let materialExist: boolean = false;
    await generalQuery("checkMaterialExist", {
      M_NAME: clickedRows.M_NAME,
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
      await generalQuery("addMaterial", clickedRows)
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
    await generalQuery("updateMaterial", clickedRows)
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {

          generalQuery("updateM090FSC", clickedRows)
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
                Swal.fire("Thông báo", "Update vật liệu thành công", "success");
              } else {
                Swal.fire("Thông báo", "Update vật liệu thất bại", "error");
              }
            })
            .catch((error) => {
              console.log(error);
            });
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
  const getFSCList = () => {
    generalQuery("getFSCList", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        //console.log(response.data.data)
        setFSCList(response.data.data);
      } else {
        setFSCList([])
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }
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
    store: data,
  });
  const [colDefs, setColDefs] = useState<Array<any>>([
    {
      field: 'M_ID', headerName: 'M_ID', headerCheckboxSelection: true, checkboxSelection: true, width: 90, resizable: true, floatingFilter: true, /* cellStyle: (params:any) => {     
       if (params.data.M_ID%2==0 ) {
        return { backgroundColor: '#d4edda', color: '#155724' };
      } else {
        return { backgroundColor: '#f8d7da', color: '#721c24' };
      } 
    } */},
    { field: 'M_NAME', headerName: 'M_NAME', width: 90, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'DESCR', headerName: 'DESCR', width: 90, resizable: true, floatingFilter: true, filter: true, },
    { field: 'CUST_CD', headerName: 'CUST_CD', width: 90, resizable: true, floatingFilter: true, filter: true, },
    { field: 'CUST_NAME_KD', headerName: 'CUST_NAME_KD', width: 90, resizable: true, floatingFilter: true, filter: true, },
    { field: 'SSPRICE', headerName: 'OPEN_PRICE', width: 90, resizable: true, floatingFilter: true, filter: true, cellDataType: "number" },
    { field: 'CMSPRICE', headerName: 'ORIGIN_PRICE', width: 90, resizable: true, floatingFilter: true, filter: true, cellDataType: "number" },
    { field: 'SLITTING_PRICE', headerName: 'SLITTING_PRICE', width: 90, resizable: true, floatingFilter: true, filter: true, cellDataType: "number" },
    { field: 'MASTER_WIDTH', headerName: 'MASTER_WIDTH', width: 90, resizable: true, floatingFilter: true, filter: true, cellDataType: "number" },
    { field: 'ROLL_LENGTH', headerName: 'ROLL_LENGTH', width: 90, resizable: true, floatingFilter: true, filter: true, cellDataType: "number" },
    { field: 'FSC', headerName: 'FSC', width: 90, resizable: true, floatingFilter: true, filter: true, },
    { field: 'FSC_CODE', headerName: 'FSC_CODE', width: 90, resizable: true, floatingFilter: true, filter: true, },
    { field: 'FSC_NAME', headerName: 'FSC_NAME', width: 90, resizable: true, floatingFilter: true, filter: true, },
    { field: 'USE_YN', headerName: 'USE_YN', width: 90, resizable: true, floatingFilter: true, filter: true, },
    { field: 'EXP_DATE', headerName: 'EXP_DATE', width: 90, resizable: true, floatingFilter: true, filter: true, },
    {
      field: 'TDS', headerName: 'TDS', width: 90, resizable: true, cellRenderer: (params: CustomCellRendererProps) => {
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
      }, floatingFilter: true, filter: true,
    },
    { field: 'INS_DATE', headerName: 'INS_DATE', width: 90, resizable: true, floatingFilter: true, filter: true, },
    { field: 'INS_EMPL', headerName: 'INS_EMPL', width: 90, resizable: true, floatingFilter: true, filter: true, },
    { field: 'UPD_DATE', headerName: 'UPD_DATE', width: 90, resizable: true, floatingFilter: true, filter: true, },
    { field: 'UPD_EMPL', headerName: 'UPD_EMPL', width: 90, resizable: true, floatingFilter: true, filter: true, },
  ]);
  const material_data_ag_table = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        toolbar={
          <div>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowHidePivotTable(!showhidePivotTable);
              }}
            >
              <MdOutlinePivotTableChart color="#ff33bb" size={15} />
              Pivot
            </IconButton>
          </div>}
        columns={colDefs}
        data={data}
        onCellEditingStopped={(params: any) => {
        }}
        onCellClick={(params: any) => {
          setClickedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
        }} />
    )
  }, [data, colDefs])
  useEffect(() => {
    load_material_table();
    getcustomerlist();
    getFSCList();
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
                  value={clickedRows?.M_NAME}
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
                    `${option.CUST_CD !== null ? option.CUST_NAME_KD : "SSJ"}${option.CUST_CD !== null ? option.CUST_CD : "0049"
                    }`
                  }
                  renderInput={(params) => (
                    <TextField {...params} style={{ height: "10px" }} />
                  )}
                  defaultValue={{
                    CUST_CD: getCompany() === "CMS" ? "0049" : "KH000",
                    CUST_NAME: getCompany() === "CMS" ? "SSJ" : "PVN",
                    CUST_NAME_KD: getCompany() === "CMS" ? "SSJ" : "PVN",
                  }}
                  value={{
                    CUST_CD: clickedRows?.CUST_CD,
                    CUST_NAME: customerList.filter(
                      (e: CustomerListData, index: number) =>
                        e.CUST_CD === clickedRows?.CUST_CD,
                    )[0]?.CUST_NAME,
                    CUST_NAME_KD:
                      customerList.filter(
                        (e: CustomerListData, index: number) =>
                          e.CUST_CD === clickedRows?.CUST_CD,
                      )[0]?.CUST_NAME_KD === undefined
                        ? ""
                        : customerList.filter(
                          (e: CustomerListData, index: number) =>
                            e.CUST_CD === clickedRows?.CUST_CD,
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
                  value={clickedRows?.DESCR}
                  onChange={(e) => seMaterialInfo("DESCR", e.target.value)}
                ></input>
              </label>
              <label>
                <b>Open Price:</b>{" "}
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={clickedRows?.SSPRICE}
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
                  value={clickedRows?.CMSPRICE}
                  onChange={(e) => seMaterialInfo("CMSPRICE", e.target.value)}
                ></input>
              </label>
              <label>
                <b>Slitting Price:</b>{" "}
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={clickedRows?.SLITTING_PRICE}
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
                  value={clickedRows?.MASTER_WIDTH}
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
                  value={clickedRows?.ROLL_LENGTH}
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
                  value={clickedRows?.EXP_DATE}
                  onChange={(e) => seMaterialInfo("EXP_DATE", e.target.value)}
                ></input>
              </label>
              <div className="forminputcolumn">
              <label>
                    <b>FSC:</b>
                    <select
                      name='fsc'
                      value={clickedRows?.FSC}
                      onChange={(e) => {
                        let tempMaterialInfo: MATERIAL_TABLE_DATA = {
                          ...clickedRows,
                          FSC: e.target.value,
                          FSC_CODE: e.target.value ==='N' ? '01': clickedRows.FSC_CODE
                        };
                        setClickedRows(tempMaterialInfo);                       
                      }}
                    >
                      <option value='Y'> Y </option>
                      <option value='N'> N </option>                      
                    </select>
              </label>
              <label>
                    <b>Loại FSC:</b>
                    <select
                    disabled={clickedRows?.FSC ==='N'}
                      name='fsc'
                      value={clickedRows?.FSC_CODE}
                      onChange={(e) => {
                        seMaterialInfo(
                          "FSC_CODE", e.target.value,
                        );                       

                      }}
                    >
                      {
                        fscList.map((ele: FSC_LIST_DATA,index: number )=> {
                          return (
                            <option key={index} value={ele.FSC_CODE}> {ele.FSC_NAME} </option>
                          )
                        })
                      }
                                         
                    </select>
              </label>

            </div>
              <label>
                <b>Mở/Khóa:</b>
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type='checkbox'
                  name='pobalancecheckbox'
                  checked={clickedRows?.USE_YN === "Y"}
                  onChange={(e) => {
                    seMaterialInfo(
                      "USE_YN", e.target.checked === true ? "Y" : "N",
                    );
                  }}
                ></input>
              </label>
            </div>
            
          </div>
          <div className="formbutton">
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#129232' }} onClick={() => {
              load_material_table();
            }}>Refresh</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f05bd7' }} onClick={() => {
               checkBP(getUserData(), ["MUA","KETOAN"], ["ALL"], ["ALL"], () => {                
                addMaterial();
              })
              
            }}>Add</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#ec9d52' }} onClick={() => {
              checkBP(getUserData(), ["MUA","KETOAN"], ["ALL"], ["ALL"], () => {
                updateMaterial();
              })
              
            }}>Update</Button>
          </div>
        </div>
        <div className="tracuuYCSXTable">
          {material_data_ag_table}
        </div>
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
