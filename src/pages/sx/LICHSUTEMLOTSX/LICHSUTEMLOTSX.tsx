import {
  Button,
  IconButton,
  createFilterOptions,
} from "@mui/material";
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
  CS_RMA_DATA,
  CS_CNDB_DATA,
  CS_TAXI_DATA,
} from "../../../api/GlobalInterface";
import { DataDiv, DataTBDiv, FormButtonColumn, FromInputColumn, FromInputDiv, PivotTableDiv, QueryFormDiv } from "../../../components/StyledComponents/ComponentLib";

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';

//example data type
type Person = {
  YEAR_WEEK: string,
  CONFIRM_ID: number,
  CONFIRM_DATE: string,
  CONTACT_ID: number,
  CS_EMPL_NO: string,
  EMPL_NAME: string,
  G_CODE: string,
  G_NAME: string,
  G_NAME_KD: string,
  PROD_REQUEST_NO: string,
  CUST_CD: string,
  CUST_NAME_KD: string,
  CONTENT: string,
  INSPECT_QTY: number,
  NG_QTY: number,
  REPLACE_RATE: number,
  REDUCE_QTY: number,
  FACTOR: string,
  RESULT: string,
  CONFIRM_STATUS: string,
  REMARK: string,
  INS_DATETIME: string,
  PHANLOAI: string,
  LINK: string,
  PROD_TYPE: string,
  PROD_MODEL: string,
  PROD_PROJECT: string,
  PROD_LAST_PRICE: number,
  REDUCE_AMOUNT: number,
};


type CSCONFIRM_DATA = {
  YEAR_WEEK: string,
  CONFIRM_ID: number,
  CONFIRM_DATE: string,
  CONTACT_ID: number,
  CS_EMPL_NO: string,
  EMPL_NAME: string,
  G_CODE: string,
  G_NAME: string,
  G_NAME_KD: string,
  PROD_REQUEST_NO: string,
  CUST_CD: string,
  CUST_NAME_KD: string,
  CONTENT: string,
  INSPECT_QTY: number,
  NG_QTY: number,
  REPLACE_RATE: number,
  REDUCE_QTY: number,
  FACTOR: string,
  RESULT: string,
  CONFIRM_STATUS: string,
  REMARK: string,
  INS_DATETIME: string,
  PHANLOAI: string,
  LINK: string,
  PROD_TYPE: string,
  PROD_MODEL: string,
  PROD_PROJECT: string,
  PROD_LAST_PRICE: number,
  REDUCE_AMOUNT: number,
}

const LICHSUTEMLOTSX = () => {
  const [option, setOption] = useState("dataconfirm");
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [cs_table_data, set_cs_table_data] = useState<Array<CSCONFIRM_DATA>>([]);
  const [cs_rma_table_data, set_cs_rma_table_data] = useState<Array<CS_RMA_DATA>>([]);
  const [cs_cndb_table_data, set_cs_cndb_table_data] = useState<Array<CS_CNDB_DATA>>([]);
  const [cs_taxi_table_data, set_cs_taxi_table_data] = useState<Array<CS_TAXI_DATA>>([]);
  const [filterData, setFilterData] = useState({
    FROM_DATE: moment().format("YYYY-MM-DD"),
    TO_DATE: moment().format("YYYY-MM-DD"),
    CONFIRM_DATE: '',
    CONFIRM_ID: 0,
    CONFIRM_STATUS: '',
    CONTACT_ID: 0,
    CONTENT: '',
    CS_EMPL_NO: '',
    CUST_CD: '',
    CUST_NAME_KD: '',
    EMPL_NAME: '',
    FACTOR: '',
    G_CODE: '',
    G_NAME: '',
    G_NAME_KD: '',
    INS_DATETIME: '',
    INSPECT_QTY: 0,
    LINK: '',
    NG_QTY: 0,
    PHANLOAI: '',
    PROD_LAST_PRICE: 0,
    PROD_MODEL: '',
    PROD_PROJECT: '',
    PROD_REQUEST_NO: '',
    PROD_TYPE: '',
    REDUCE_QTY: 0,
    REMARK: '',
    REPLACE_RATE: 0,
    RESULT: '',
    YEAR_WEEK: '',
    REDUCE_AMOUNT: 0
  });
  const load_cs_data = () => {
    switch (option) {
      case 'dataconfirm':
        generalQuery("tracsconfirm", filterData)
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              let loadeddata = response.data.data.map(
                (element: CSCONFIRM_DATA, index: number) => {
                  return {
                    ...element,
                    CONFIRM_DATE: moment
                      .utc(element.CONFIRM_DATE)
                      .format("YYYY-MM-DD"),
                    INS_DATETIME: moment
                      .utc(element.INS_DATETIME)
                      .format("YYYY-MM-DD HH:mm:ss"),
                    id: index,
                  };
                },
              );
              //console.log(loadeddata);
              set_cs_table_data(loadeddata);
              Swal.fire(
                "Thông báo",
                "Đã load: " + response.data.data.length + " dòng",
                "success",
              );
            } else {
              set_cs_table_data([]);
              Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
            }
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      case 'datarma':
        generalQuery("tracsrma", filterData)
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              let loadeddata = response.data.data.map(
                (element: CS_RMA_DATA, index: number) => {
                  return {
                    ...element,
                    CONFIRM_DATE: moment
                      .utc(element.CONFIRM_DATE)
                      .format("YYYY-MM-DD"),
                    RETURN_DATE: moment
                      .utc(element.RETURN_DATE)
                      .format("YYYY-MM-DD"),
                    INS_DATETIME: moment
                      .utc(element.INS_DATETIME)
                      .format("YYYY-MM-DD HH:mm:ss"),
                    id: index,
                  };
                },
              );
              //console.log(loadeddata);
              set_cs_rma_table_data(loadeddata);
              Swal.fire(
                "Thông báo",
                "Đã load: " + response.data.data.length + " dòng",
                "success",
              );
            } else {
              set_cs_rma_table_data([]);
              Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
            }
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      case 'datacndbkhachhang':
        generalQuery("tracsCNDB", filterData)
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              let loadeddata = response.data.data.map(
                (element: CS_CNDB_DATA, index: number) => {
                  return {
                    ...element,
                    SA_REQUEST_DATE: moment
                      .utc(element.SA_REQUEST_DATE)
                      .format("YYYY-MM-DD"),
                    REQUEST_DATETIME: moment
                      .utc(element.REQUEST_DATETIME)
                      .format("YYYY-MM-DD"),
                    INS_DATETIME: moment
                      .utc(element.INS_DATETIME)
                      .format("YYYY-MM-DD HH:mm:ss"),
                    id: index,
                  };
                },
              );
              //console.log(loadeddata);
              set_cs_cndb_table_data(loadeddata);
              Swal.fire(
                "Thông báo",
                "Đã load: " + response.data.data.length + " dòng",
                "success",
              );
            } else {
              set_cs_cndb_table_data([]);
              Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
            }
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      case 'datataxi':
        generalQuery("tracsTAXI", filterData)
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              let loadeddata = response.data.data.map(
                (element: CS_TAXI_DATA, index: number) => {
                  return {
                    ...element,
                    TAXI_DATE: moment
                      .utc(element.TAXI_DATE)
                      .format("YYYY-MM-DD"),
                    INS_DATETIME: moment
                      .utc(element.INS_DATETIME)
                      .format("YYYY-MM-DD HH:mm:ss"),
                    id: index,
                  };
                },
              );
              //console.log(loadeddata);
              set_cs_taxi_table_data(loadeddata);
              Swal.fire(
                "Thông báo",
                "Đã load: " + response.data.data.length + " dòng",
                "success",
              );
            } else {
              set_cs_taxi_table_data([]);
              Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
            }
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      default:
        break;
    }
  };
  const setCSFormInfo = (keyname: string, value: any) => {
    let tempCSInfo = {
      ...filterData,
      [keyname]: value,
    };
    //console.log(tempcodefullinfo);
    setFilterData(tempCSInfo);
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      load_cs_data();
    }
  };

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
    store: cs_table_data,
  });

  
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
     
      {
        accessorKey: 'YEAR_WEEK',
        header: 'YEAR_WEEK',
        size: 100,
      }, {
        accessorKey: 'CF_ID',
        header: 'CF_ID',
        size: 100,
      }, {
        accessorKey: 'CF_DATE',
        header: 'CF_DATE',
        size: 100,
      }, {
        accessorKey: 'CONTACT_ID',
        header: 'CONTACT_ID',
        size: 100,
      }, {
        accessorKey: 'CS_EMPL_NO',
        header: 'CS_EMPL_NO',
        size: 100,
      }, {
        accessorKey: 'EMPL_NAME',
        header: 'EMPL_NAME',
        size: 100,
      }, {
        accessorKey: 'G_CODE',
        header: 'G_CODE',
        size: 100,
      }, {
        accessorKey: 'G_NAME',
        header: 'G_NAME',
        size: 100,
      }, {
        accessorKey: 'G_NAME_KD',
        header: 'G_NAME_KD',
        size: 100,
      }, {
        accessorKey: 'YCSX',
        header: 'YCSX',
        size: 100,
      }, {
        accessorKey: 'CUST_CD',
        header: 'CUST_CD',
        size: 100,
      }, {
        accessorKey: 'CUST_NAME_KD',
        header: 'CUST_NAME_KD',
        size: 100,
      }, {
        accessorKey: 'CONTENT',
        header: 'CONTENT',
        size: 100,
      }, {
        accessorKey: 'INSPECT_QTY',
        header: 'INSPECT_QTY',
        size: 100,
      }, {
        accessorKey: 'NG_QTY',
        header: 'NG_QTY',
        size: 100,
      }, {
        accessorKey: 'REPLACE_RATE',
        header: 'REPLACE_RATE',
        size: 100,
      }, {
        accessorKey: 'REDUCE_QTY',
        header: 'REDUCE_QTY',
        size: 100,
      }, {
        accessorKey: 'FACTOR',
        header: 'FACTOR',
        size: 100,
      }, {
        accessorKey: 'RESULT',
        header: 'RESULT',
        size: 100,
      }, {
        accessorKey: 'CF_STATUS',
        header: 'CF_STATUS',
        size: 100,
      }, {
        accessorKey: 'REMARK',
        header: 'REMARK',
        size: 100,
      }, {
        accessorKey: 'INS_DATETIME',
        header: 'INS_DATETIME',
        size: 100,
      }, {
        accessorKey: 'PHANLOAI',
        header: 'PHANLOAI',
        size: 100,
      }, {
        accessorKey: 'PROD_TYPE',
        header: 'PROD_TYPE',
        size: 100,
      }, {
        accessorKey: 'PROD_MODEL',
        header: 'PROD_MODEL',
        size: 100,
      }, {
        accessorKey: 'PROD_PROJECT',
        header: 'PROD_PROJECT',
        size: 100,
      }, {
        accessorKey: 'PROD_PRICE',
        header: 'PROD_PRICE',
        size: 100,
      }, {
        accessorKey: 'REDUCE_AMOUNT',
        header: 'REDUCE_AMOUNT',
        size: 100,
      }, {
        accessorKey: 'LINK',
        header: 'LINK',
        size: 100,
      },
    ],
    [],
  );
  
  const table = useMaterialReactTable({
    columns,
    cs_table_data,
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
                onChange={(e) => setCSFormInfo("FROM_DATE", e.target.value)}
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
                onChange={(e) => setCSFormInfo("TO_DATE", e.target.value)}
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
                onChange={(e) => setCSFormInfo("G_NAME", e.target.value)}
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
                onChange={(e) => setCSFormInfo("G_CODE", e.target.value)}
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
                onChange={(e) => setCSFormInfo("PROD_REQUEST_NO", e.target.value)}
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
                onChange={(e) => setCSFormInfo("CUST_NAME_KD", e.target.value)}
              ></input>
            </label>
          </FromInputColumn>
          <FromInputColumn>
            <label>
              <b>Chọn data:</b>{" "}
              <select
                name="datatimekiem"
                value={option}
                onChange={(e) => {
                  setOption(e.target.value);
                }}
              >
                <option value="dataconfirm">Lịch Sử Xác Nhận Lỗi</option>
                <option value="datarma">Lịch Sử RMA</option>
                <option value="datacndbkhachhang">Lịch Sử Xin CNĐB</option>
                <option value="datataxi">Lịch Sử Taxi</option>
              </select>
            </label>
          </FromInputColumn>
        </FromInputDiv>
        <FormButtonColumn>
          <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#129232' }} onClick={() => {
            load_cs_data();
          }}>Load Data</Button>
        </FormButtonColumn>
      </QueryFormDiv>
      <DataTBDiv>
        <MaterialReactTable table={table} />        
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
