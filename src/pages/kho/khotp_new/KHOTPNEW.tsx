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
import React, {
  startTransition,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import "./KHOTPNEW.scss";
import { UserContext } from "../../../api/Context";
import { generalQuery, getAuditMode, getUserData } from "../../../api/Api";
import { CustomResponsiveContainer, SaveExcel, checkBP } from "../../../api/GlobalFunction";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotTable from "../../../components/PivotChart/PivotChart";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { ResponsiveContainer } from "recharts";
import {
  KTP_IN,
  KTP_OUT,
  STOCK_G_CODE,
  STOCK_G_NAME_KD,
  STOCK_PROD_REQUEST_NO,
} from "../../../api/GlobalInterface";

const KHOTPNEW = () => {
  const dataGridRef = useRef<any>(null);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [khotpinputdatatable, setKhoTPInputDataTable] = useState<Array<KTP_IN>>(
    [],
  );
  const [khotpoutputdatatable, setKhoTPOutputDataTable] = useState<
    Array<KTP_OUT>
  >([]);
  const [tonktp_gcode, setTonKTPG_CODE] = useState<Array<STOCK_G_CODE>>([]);
  const [tonktp_gnamekd, setTonKTP_G_NAME_KD] = useState<
    Array<STOCK_G_NAME_KD>
  >([]);
  const [tonktp_prod_request_no, setTonKTP_PROD_REQUEST_NO] = useState<
    Array<STOCK_PROD_REQUEST_NO>
  >([]);

  const [fromdate, setFromDate] = useState(moment.utc().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [machine, setMachine] = useState("ALL");
  const [factory, setFactory] = useState("ALL");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [custName, setCustName] = useState("");
  const [plan_id, setPlanID] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [plxk, setPLXK] = useState("ALL");
  const [rndEmpl, setRNDEMPL] = useState("");
  const [qcEmpl, setQCEMPL] = useState("");
  const [kdEmpl, setKDEMPL] = useState("");
  const [prod_type, setProdType] = useState("ALL");
  const [selectedRows, setSelectedRows] = useState<KTP_IN>();
  const [buttonselected, setbuttonselected] = useState("GR");
  const [trigger, setTrigger] = useState(false);
  const [selectedOUTRow, setSelectedOUTRow] = useState<KTP_OUT[]>([]);


  const ktp_in_fields: any = [
    {
      caption: "IN_DATE",
      width: 80,
      dataField: "IN_DATE",
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
    {
      caption: "PROD_TYPE",
      width: 80,
      dataField: "PROD_TYPE",
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
      caption: "AUTO_ID",
      width: 80,
      dataField: "AUTO_ID",
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
      caption: "INSPECT_OUTPUT_ID",
      width: 80,
      dataField: "INSPECT_OUTPUT_ID",
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
      caption: "PACK_ID",
      width: 80,
      dataField: "PACK_ID",
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
      caption: "EMPL_NAME",
      width: 80,
      dataField: "EMPL_NAME",
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
      caption: "CUST_NAME_KD",
      width: 80,
      dataField: "CUST_NAME_KD",
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
      caption: "G_NAME_KD",
      width: 80,
      dataField: "G_NAME_KD",
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
      caption: "IN_QTY",
      width: 80,
      dataField: "IN_QTY",
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
      caption: "USE_YN",
      width: 80,
      dataField: "USE_YN",
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
      caption: "EMPL_GIAO",
      width: 80,
      dataField: "EMPL_GIAO",
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
      caption: "EMPL_NHAN",
      width: 80,
      dataField: "EMPL_NHAN",
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
      caption: "INS_DATE",
      width: 80,
      dataField: "INS_DATE",
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
      caption: "INS_EMPL",
      width: 80,
      dataField: "INS_EMPL",
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
      caption: "UPD_DATE",
      width: 80,
      dataField: "UPD_DATE",
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
      caption: "UPD_EMPL",
      width: 80,
      dataField: "UPD_EMPL",
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
      caption: "STATUS",
      width: 80,
      dataField: "STATUS",
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
      caption: "REMARK",
      width: 80,
      dataField: "REMARK",
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
  ];
  const ktp_out_fields: any = [
    {
      caption: "OUT_DATE",
      width: 80,
      dataField: "OUT_DATE",
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
      caption: "PROD_TYPE",
      width: 80,
      dataField: "PROD_TYPE",
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
    {
      caption: "PO_NO",
      width: 80,
      dataField: "PO_NO",
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
      caption: "AUTO_ID",
      width: 80,
      dataField: "AUTO_ID",
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
      caption: "INSPECT_OUTPUT_ID",
      width: 80,
      dataField: "INSPECT_OUTPUT_ID",
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
      caption: "PACK_ID",
      width: 80,
      dataField: "PACK_ID",
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
      caption: "EMPL_NAME",
      width: 80,
      dataField: "EMPL_NAME",
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
      caption: "G_NAME_KD",
      width: 80,
      dataField: "G_NAME_KD",
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
      caption: "CUST_CD",
      width: 80,
      dataField: "CUST_CD",
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
      caption: "OUT_QTY",
      width: 80,
      dataField: "OUT_QTY",
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
      caption: "CUST_NAME_KD",
      width: 80,
      dataField: "CUST_NAME_KD",
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
      caption: "OUT_TYPE",
      width: 80,
      dataField: "OUT_TYPE",
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
      caption: "USE_YN",
      width: 80,
      dataField: "USE_YN",
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
      caption: "INS_DATE",
      width: 80,
      dataField: "INS_DATE",
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
      caption: "INS_EMPL",
      width: 80,
      dataField: "INS_EMPL",
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
      caption: "UPD_DATE",
      width: 80,
      dataField: "UPD_DATE",
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
      caption: "UPD_EMPL",
      width: 80,
      dataField: "UPD_EMPL",
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
      caption: "STATUS",
      width: 80,
      dataField: "STATUS",
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
      caption: "REMARK",
      width: 80,
      dataField: "REMARK",
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
      caption: "AUTO_ID_IN",
      width: 80,
      dataField: "AUTO_ID_IN",
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
      caption: "OUT_PRT_SEQ",
      width: 80,
      dataField: "OUT_PRT_SEQ",
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
  ];

  const [selectedDataSource, setSelectedDataSource] =
    useState<PivotGridDataSource>(
      new PivotGridDataSource({
        fields: ktp_in_fields,
        store: khotpinputdatatable,
      }),
    );

  const clearSelection = () => {
    if (dataGridRef.current) {
      dataGridRef.current.instance.clearSelection();
      setSelectedOUTRow([]);
      console.log(dataGridRef.current);
    }
  };
  const loadKTP_IN = () => {
    generalQuery("loadKTP_IN", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      OUT_TYPE: plxk,
      FACTORY: factory,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      PROD_TYPE: prod_type,
      PROD_REQUEST_NO: prodrequestno,
      KD_EMPL_NAME: kdEmpl,
      CUST_NAME_KD: custName,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: KTP_IN, index: number) => {
              return {
                ...element,
                IN_DATE: moment.utc(element.IN_DATE).format("YYYY-MM-DD"),
                INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD"),
                UPD_DATE:
                  element.UPD_DATE !== null
                    ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD")
                    : "",
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setKhoTPInputDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
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
    generalQuery("loadKTP_OUT", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      OUT_TYPE: plxk,
      FACTORY: factory,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      PROD_TYPE: prod_type,
      PROD_REQUEST_NO: prodrequestno,
      KD_EMPL_NAME: kdEmpl,
      CUST_NAME_KD: custName,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: KTP_OUT, index: number) => {
              return {
                ...element,
                OUT_DATE: moment.utc(element.OUT_DATE).format("YYYY-MM-DD"),
                INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD"),
                UPD_DATE:
                  element.UPD_DATE !== null
                    ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD")
                    : "",
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setKhoTPOutputDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
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
    generalQuery("loadStockFull", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      OUT_TYPE: plxk,
      FACTORY: factory,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      PROD_TYPE: prod_type,
      PROD_REQUEST_NO: prodrequestno,
      KD_EMPL_NAME: kdEmpl,
      CUST_NAME_KD: custName,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: KTP_IN, index: number) => {
              return {
                ...element,
                IN_DATE: moment.utc(element.IN_DATE).format("YYYY-MM-DD"),
                INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD"),
                UPD_DATE:
                  element.UPD_DATE !== null
                    ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD")
                    : "",
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setKhoTPInputDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
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
    generalQuery("loadSTOCKG_CODE", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      OUT_TYPE: plxk,
      FACTORY: factory,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      PROD_TYPE: prod_type,
      PROD_REQUEST_NO: prodrequestno,
      KD_EMPL_NAME: kdEmpl,
      CUST_NAME_KD: custName,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: STOCK_G_CODE, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setTonKTPG_CODE(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
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
  const loadSTOCK_G_NAME_KD = () => {
    generalQuery("loadSTOCKG_NAME_KD", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      OUT_TYPE: plxk,
      FACTORY: factory,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      PROD_TYPE: prod_type,
      PROD_REQUEST_NO: prodrequestno,
      KD_EMPL_NAME: kdEmpl,
      CUST_NAME_KD: custName,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: STOCK_G_NAME_KD, index: number) => {
              return {
                ...element,          
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME_KD?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setTonKTP_G_NAME_KD(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          setTonKTP_G_NAME_KD([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadSTOCK_YCSX = () => {
    generalQuery("loadSTOCK_YCSX", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      OUT_TYPE: plxk,
      FACTORY: factory,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      PROD_TYPE: prod_type,
      PROD_REQUEST_NO: prodrequestno,
      KD_EMPL_NAME: kdEmpl,
      CUST_NAME_KD: custName,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: STOCK_PROD_REQUEST_NO, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setTonKTP_PROD_REQUEST_NO(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          setTonKTP_PROD_REQUEST_NO([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };  
  const duyetHuy = async ()=> {
    if(selectedOUTRow.length>0)
    {
      for(let i=0;i<selectedOUTRow.length;i++)
      {
        //chuyen P -> X, them remark Xuat Huy  O660
        await generalQuery("updatePheDuyetHuyO660", {
          AUTO_ID: selectedOUTRow[i].AUTO_ID,
          AUTO_ID_IN: selectedOUTRow[i].AUTO_ID_IN
        })
          .then((response) => {            
            if (response.data.tk_status !== "NG") {
              
            } else {
              
            }
          })
          .catch((error) => {
            console.log(error);
          }); 
      }   
      Swal.fire('Thông báo','Duyệt thành công','success');
    }
    else {
      Swal.fire('Thông báo','Chọn ít nhất một dòng để thực hiện','error');
    }
  }
  const cancelHuy = async ()=> {
    if(selectedOUTRow.length>0)
    {
      for(let i=0;i<selectedOUTRow.length;i++)
      {
        //chuyen P -> X, them remark Xuat Huy  O660
        await generalQuery("cancelPheDuyetHuyO660", {
          AUTO_ID: selectedOUTRow[i].AUTO_ID,
          AUTO_ID_IN: selectedOUTRow[i].AUTO_ID_IN
        })
          .then((response) => {            
            if (response.data.tk_status !== "NG") {
              
            } else {
              
            }
          })
          .catch((error) => {
            console.log(error);
          }); 
      }   
      Swal.fire('Thông báo','Hủy xuất thành công','success');         
    }
    else {
      Swal.fire('Thông báo','Chọn ít nhất một dòng để thực hiện');
    }
  }
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      //loadKTP_IN();
      loadKTP_OUT();
    }
  };
  const KHOTP_INPUT = React.useMemo(
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
            dataSource={khotpinputdatatable}
            columnWidth="auto"
            keyExpr="id"
            height={"75vh"}
            showBorders={true}
            onRowPrepared={(e) => {}}
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
              onChangesChange={(e) => {}}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
              <Item location="before">
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(khotpinputdatatable, "MaterialStatus");
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
            <Summary>
              <TotalItem
                alignment="right"
                column="INSPECT_OUTPUT_ID"
                summaryType="count"
                valueFormat={"decimal"}
              />
              <TotalItem
                alignment="right"
                column="IN_QTY"
                summaryType="sum"
                valueFormat={"decimal"}
              />
            </Summary>
          </DataGrid>
        </CustomResponsiveContainer>
      </div>
    ),
    [khotpinputdatatable, selectedDataSource],
  );
  const KHOTP_OUTPUT = React.useMemo(
    () => (
      <div className="datatb">
        <CustomResponsiveContainer>
          <DataGrid
            ref={dataGridRef}
            autoNavigateToFocusedRow={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={khotpoutputdatatable}
            columnWidth="auto"
            keyExpr="id"
            height={"75vh"}
            showBorders={true}
            onRowPrepared={(e) => {}}
            onSelectionChanged={(e) => {
              //setSelectedRows(e.selectedRowsData[0]);
              setSelectedOUTRow(e.selectedRowsData)
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
              showScrollbar="onHover"
              mode="virtual"
            />
            <Selection mode="multiple" selectAllMode="allPages" />
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
                    SaveExcel(khotpinputdatatable, "MaterialStatus");
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
            <Summary>
              <TotalItem
                alignment="right"
                column="INSPECT_OUTPUT_ID"
                summaryType="count"
                valueFormat={"decimal"}
              />
              <TotalItem
                alignment="right"
                column="OUT_QTY"
                summaryType="sum"
                valueFormat={"decimal"}
              />
            </Summary>
          </DataGrid>
        </CustomResponsiveContainer>
      </div>
    ),
    [khotpoutputdatatable, selectedDataSource],
  );
  const KHOTP_STOCKG_CODE = React.useMemo(
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
            dataSource={tonktp_gcode}
            columnWidth="auto"
            keyExpr="id"
            height={"75vh"}
            showBorders={true}
            onRowPrepared={(e) => {}}
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
                    SaveExcel(khotpinputdatatable, "MaterialStatus");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  SAVE
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
    [tonktp_gcode, selectedDataSource],
  );
  const KHOTP_STOCKG_NAME_KD = React.useMemo(
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
            dataSource={tonktp_gnamekd}
            columnWidth="auto"
            keyExpr="id"
            height={"75vh"}
            showBorders={true}
            onRowPrepared={(e) => {}}
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
                    SaveExcel(khotpinputdatatable, "MaterialStatus");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  SAVE
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
    [tonktp_gnamekd,selectedDataSource],
  );
  const KHOTP_STOCK_YCSX = React.useMemo(
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
            dataSource={tonktp_prod_request_no}
            columnWidth="auto"
            keyExpr="id"
            height={"75vh"}
            showBorders={true}
            onRowPrepared={(e) => {}}
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
                    SaveExcel(khotpinputdatatable, "MaterialStatus");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  SAVE
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
    [tonktp_prod_request_no, selectedDataSource],
  );

  const filterOptions1 = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    //loadKTP_IN();
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className="khotpnew">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform">
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>From date:</b>
                <input
                  onKeyDown={(e) => {}}
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>To date:</b>
                <input
                  onKeyDown={(e) => {}}
                  type="date"
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>

              <label>
                <b>PL xuất Kho:</b>{" "}
                <select
                  name="vendor"
                  value={plxk}
                  onChange={(e) => {
                    setPLXK(e.target.value);
                  }}
                >
                  <option value="ALL">ALL</option>
                  <option value="N">NORMAL</option>
                  <option value="F">FREE</option>
                  <option value="L">THAY LOT</option>
                  <option value="D">XUẤT HỦY</option>
                  <option value="O">KHÁC</option>
                </select>
              </label>
            </div>

            <div className="forminputcolumn">
              <label>
                <b>Nhà máy:</b>{" "}
                <select
                  name="vendor"
                  value={factory}
                  onChange={(e) => {
                    setFactory(e.target.value);
                  }}
                >
                  <option value="ALL">ALL</option>
                  <option value="NM1">NM1</option>
                  <option value="NM2">NM2</option>
                </select>
              </label>
              <label>
                <b>Tên sản phẩm:</b>{" "}
                <input
                  type="text"
                  placeholder="Tên sản phẩm"
                  value={codeKD}
                  onChange={(e) => setCodeKD(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Code ERP:</b>{" "}
                <input
                  type="text"
                  placeholder="Code ERP"
                  value={codeCMS}
                  onChange={(e) => setCodeCMS(e.target.value)}
                ></input>
              </label>
              <label>
                <b>PL sản phẩm:</b>
                <select
                  name="phanloaisanpham"
                  value={prod_type}
                  onChange={(e) => {
                    setProdType(e.target.value);
                  }}
                >
                  <option value="ALL">ALL</option>
                  <option value="TSP">TSP</option>
                  <option value="OLED">OLED</option>
                  <option value="UV">UV</option>
                  <option value="TAPE">TAPE</option>
                  <option value="LABEL">LABEL</option>
                  <option value="RIBBON">RIBBON</option>
                  <option value="SPT">SPT</option>
                </select>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>YCSX:</b>{" "}
                <input
                  type="text"
                  placeholder="YCSX"
                  value={prodrequestno}
                  onChange={(e) => setProdRequestNo(e.target.value)}
                ></input>
              </label>
              <label>
                <b>NV KD:</b>{" "}
                <input
                  type="text"
                  placeholder="Tên nhân viên kinh doanh"
                  value={kdEmpl}
                  onChange={(e) => setKDEMPL(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Khách hàng:</b>{" "}
                <input
                  type="text"
                  placeholder="Khách hàng"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                ></input>
              </label>
              <label>
                <b>CHỌN:</b>
                <select
                  name="phanloaisanpham"
                  value={buttonselected}
                  onChange={(e) => {
                    setbuttonselected(e.target.value);
                  }}
                >
                  <option value="GR">Nhập Kho</option>
                  <option value="GI">Xuất Kho</option>
                  <option value="STOCKFULL">Tồn chi tiết</option>
                  <option value="STOCKG_CODE">Tồn theo G_CODE</option>
                  <option value="STOCKG_NAME_KD">Tồn theo Code KD</option>
                  <option value="STOCK_YCSX">Tồn theo YCSX</option>
                </select>
              </label>
            </div>
          </div>
          <div className="formbutton">
            <label>
              <b>All Time:</b>
              <input
                type="checkbox"
                name="alltimecheckbox"
                defaultChecked={alltime}
                onChange={() => setAllTime(!alltime)}
              ></input>
            </label>
            <button
              className="tranhatky"
              onClick={() => {
                switch (buttonselected) {
                  case "GR":
                    loadKTP_IN();
                    setSelectedDataSource(
                      new PivotGridDataSource({
                        fields: ktp_in_fields,
                        store: khotpinputdatatable,
                      }),
                    );
                    break;
                  case "GI":
                    loadKTP_OUT();
                    setSelectedDataSource(
                      new PivotGridDataSource({
                        fields: ktp_out_fields,
                        store: khotpoutputdatatable,
                      }),
                    );
                    break;
                  case "STOCKFULL":
                    loadSTOCKFULL();
                    setSelectedDataSource(
                      new PivotGridDataSource({
                        fields: ktp_in_fields,
                        store: khotpinputdatatable,
                      }),
                    );
                    break;
                  case "STOCKG_CODE":
                    loadSTOCK_G_CODE();
                    break;
                  case "STOCKG_NAME_KD":
                    loadSTOCK_G_NAME_KD();
                    break;
                  case "STOCK_YCSX":
                    loadSTOCK_YCSX();
                    break;
                }
                setTrigger(!trigger);
                clearSelection();
              }}
            >
              Search
            </button>
            <button
              className="tranhatky"
              onClick={() => {
                switch (buttonselected) {
                  case "GR":

                    break;
                  case "GI":
                    Swal.fire({
                      title: "Duyệt hủy hàng",
                      text: "Chắc chắn muốn phê duyệt hủy hàng ?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Vẫn duyệt!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        checkBP(getUserData(), ["Korean"], ["ALL"], ["ALL"], () => {
                          duyetHuy();  
                        })
                      }
                    });                    

                    break;
                  case "STOCKFULL":
                    
                    break;
                  case "STOCKG_CODE":
                    
                    break;
                  case "STOCKG_NAME_KD":
                    
                    break;
                  case "STOCK_YCSX":
                    
                    break;
                }
                setTrigger(!trigger);
              }}
            >
              Duyệt hủy
            </button>
            <button
              className="tranhatky"
              onClick={() => {
                switch (buttonselected) {
                  case "GR":

                    break;
                  case "GI":
                    Swal.fire({
                      title: "Cancel hủy hàng",
                      text: "Chắc chắn muốn cancel hủy hàng ?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Vẫn cancel!",
                    }).then((result) => {
                      if (result.isConfirmed) {   
                        checkBP(getUserData(), ["Korean"], ["ALL"], ["ALL"], () => {
                          cancelHuy();
                        }) 
                      }
                    }); 
                    
                    break;
                  case "STOCKFULL":
                    
                    break;
                  case "STOCKG_CODE":
                    
                    break;
                  case "STOCKG_NAME_KD":
                    
                    break;
                  case "STOCK_YCSX":
                    
                    break;
                }
                setTrigger(!trigger);
              }}
            >
              Cancel hủy
            </button>
          </div>
        </div>
        {buttonselected === "GR" && (
          <div className="tracuuYCSXTable">{KHOTP_INPUT}</div>
        )}
        {buttonselected === "GI" && (
          <div className="tracuuYCSXTable">{KHOTP_OUTPUT}</div>
        )}
        {buttonselected === "STOCKFULL" && (
          <div className="tracuuYCSXTable">{KHOTP_INPUT}</div>
        )}
        {buttonselected === "STOCKG_CODE" && (
          <div className="tracuuYCSXTable">{KHOTP_STOCKG_CODE}</div>
        )}
        {buttonselected === "STOCKG_NAME_KD" && (
          <div className="tracuuYCSXTable">{KHOTP_STOCKG_NAME_KD}</div>
        )}
        {buttonselected === "STOCK_YCSX" && (
          <div className="tracuuYCSXTable">{KHOTP_STOCK_YCSX}</div>
        )}
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
            <PivotTable
              datasource={selectedDataSource}
              tableID="invoicetablepivot"
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default KHOTPNEW;
