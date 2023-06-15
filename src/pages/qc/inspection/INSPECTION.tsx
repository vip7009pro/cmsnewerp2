import {
  Autocomplete,
  IconButton,
  LinearProgress,
  TextField,
} from "@mui/material";
import {
  DataGrid,
  GridSelectionModel,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import moment from "moment";
import React, { useContext, useEffect, useState, useTransition } from "react";
import {
  AiFillCloseCircle,
  AiFillFileExcel,
  AiOutlineCloudUpload,
  AiOutlinePrinter,
} from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { SaveExcel } from "../../../api/GlobalFunction";
import "./INSPECTION.scss";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotTable from "../../../components/PivotChart/PivotChart";
interface INSPECT_OUTPUT_DATA {
  INSPECT_OUTPUT_ID: string;
  CUST_NAME_KD: string;
  EMPL_NAME: string;
  G_CODE: string;
  G_NAME: string;
  PROD_TYPE: string;
  G_NAME_KD: string;
  PROD_REQUEST_NO: string;
  PROD_REQUEST_DATE: string;
  PROD_REQUEST_QTY: number;
  PROCESS_LOT_NO: string;
  PROD_DATETIME: string;
  OUTPUT_DATETIME: string;
  OUTPUT_QTY_EA: number;
  REMARK: string;
  PIC_KD: string;
  CA_LAM_VIEC: string;
  NGAY_LAM_VIEC: string;
  STATUS: string;
}
interface INSPECT_INPUT_DATA {
  INSPECT_INPUT_ID: string;
  CUST_NAME_KD: string;
  EMPL_NAME: string;
  G_CODE: string;
  G_NAME: string;
  PROD_TYPE: string;
  G_NAME_KD: string;
  PROD_REQUEST_NO: string;
  PROD_REQUEST_DATE: string;
  PROD_REQUEST_QTY: number;
  PROCESS_LOT_NO: string;
  PROD_DATETIME: string;
  INPUT_DATETIME: string;
  INPUT_QTY_EA: number;
  INPUT_QTY_KG: number;
  REMARK: string;
  CNDB_ENCODES: string;
  PIC_KD: string;
}
interface INSPECT_INOUT_YCSX {
  PIC_KD: string;
  CUST_NAME_KD: string;
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  PROD_REQUEST_NO: string;
  PROD_REQUEST_DATE: string;
  PROD_REQUEST_QTY: number;
  LOT_TOTAL_INPUT_QTY_EA: number;
  LOT_TOTAL_OUTPUT_QTY_EA: number;
  DA_KIEM_TRA: number;
  OK_QTY: number;
  LOSS_NG_QTY: number;
  INSPECT_BALANCE: number;
}
interface INSPECT_NG_DATA {
  INSPECT_ID: number;
  YEAR_WEEK: string;
  CUST_NAME_KD: string;
  PROD_REQUEST_NO: string;
  G_NAME_KD: string;
  G_NAME: string;
  G_CODE: string;
  PROD_TYPE: string;
  M_LOT_NO: string;
  M_NAME: string;
  WIDTH_CD: number;
  INSPECTOR: string;
  LINEQC: string;
  PROD_PIC: string;
  UNIT: string;
  PROCESS_LOT_NO: string;
  PROCESS_IN_DATE: string;
  INSPECT_DATETIME: string;
  INSPECT_START_TIME: string;
  INSPECT_FINISH_TIME: string;
  FACTORY: string;
  LINEQC_PIC: string;
  MACHINE_NO: number;
  INSPECT_TOTAL_QTY: number;
  INSPECT_OK_QTY: number;
  INSPECT_SPEED: number;
  INSPECT_TOTAL_LOSS_QTY: number;
  INSPECT_TOTAL_NG_QTY: number;
  MATERIAL_NG_QTY: number;
  PROCESS_NG_QTY: number;
  PROD_PRICE: number;
  ERR1: number;
  ERR2: number;
  ERR3: number;
  ERR4: number;
  ERR5: number;
  ERR6: number;
  ERR7: number;
  ERR8: number;
  ERR9: number;
  ERR10: number;
  ERR11: number;
  ERR12: number;
  ERR13: number;
  ERR14: number;
  ERR15: number;
  ERR16: number;
  ERR17: number;
  ERR18: number;
  ERR19: number;
  ERR20: number;
  ERR21: number;
  ERR22: number;
  ERR23: number;
  ERR24: number;
  ERR25: number;
  ERR26: number;
  ERR27: number;
  ERR28: number;
  ERR29: number;
  ERR30: number;
  ERR31: number;
  ERR32: number;
  CNDB_ENCODES: string;
}
const INSPECTION = () => {
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [readyRender, setReadyRender] = useState(false);
  const [selection, setSelection] = useState<any>({
    trapo: true,
    thempohangloat: false,
    them1po: false,
    them1invoice: false,
    themycsx: false,
    suaycsx: false,
    inserttableycsx: false,
    renderycsx: false,
    renderbanve: false,
    amazontab: false,
  });
  const [userData, setUserData] = useContext(UserContext);
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [empl_name, setEmpl_Name] = useState("");
  const [cust_name, setCustName] = useState("");
  const [process_lot_no, setProcess_Lot_No] = useState("");
  const [prod_type, setProdType] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [id, setID] = useState("");
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<any>>(
    []
  );
  const [sumaryINSPECT, setSummaryInspect] = useState("");
  const column_inspect_input = [
    { field: "INSPECT_INPUT_ID", headerName: "ID", width: 80 },
    { field: "CUST_NAME_KD", headerName: "Khách", width: 120 },
    { field: "EMPL_NAME", headerName: "Nhân Viên", width: 150 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME", headerName: "Tên SP", width: 250 },
    { field: "INPUT_DATETIME", headerName: "Ngày nhập kiểm", width: 150 },
    {
      field: "INPUT_QTY_EA",
      headerName: "SL NHẬP EA",
      width: 100,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.row.INPUT_QTY_EA.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "PROD_TYPE", headerName: "Loại", width: 70 },
    { field: "G_NAME_KD", headerName: "Tên KD", width: 150 },
    { field: "PROD_REQUEST_NO", headerName: "Số YC", width: 80 },
    { field: "PROD_REQUEST_DATE", headerName: "Ngày YC", width: 80 },
    {
      field: "PROD_REQUEST_QTY",
      headerName: "SL YC",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.row.PROD_REQUEST_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "PROCESS_LOT_NO", headerName: "LOT SX", width: 80 },
    { field: "PROD_DATETIME", headerName: "NGÀY SX", width: 150 },
    {
      field: "INPUT_QTY_KG",
      headerName: "SL NHẬP GRAM",
      width: 100,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.row.INPUT_QTY_KG.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "REMARK", headerName: "FACTORY", width: 80 },
    { field: "CNDB_ENCODES", headerName: "CNDB_ENCODES", width: 80 },
  ];
  const column_inspect_output = [
    { field: "INSPECT_OUTPUT_ID", headerName: "ID", width: 80 },
    { field: "CUST_NAME_KD", headerName: "Khách hàng", width: 150 },
    { field: "EMPL_NAME", headerName: "Nhân viên", width: 150 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 180 },
    { field: "OUTPUT_DATETIME", headerName: "OUTPUT TIME", width: 150 },
    {
      field: "OUTPUT_QTY_EA",
      headerName: "OUTPUT QTY",
      width: 110,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.row.OUTPUT_QTY_EA.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 80 },
    { field: "G_NAME_KD", headerName: "Code KD", width: 120 },
    { field: "PROD_REQUEST_NO", headerName: "Số YC", width: 80 },
    { field: "PROD_REQUEST_DATE", headerName: "Ngày YC", width: 80 },
    {
      field: "PROD_REQUEST_QTY",
      headerName: "SL YC",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.row.PROD_REQUEST_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "PROCESS_LOT_NO", headerName: "LOT SX", width: 80 },
    { field: "PROD_DATETIME", headerName: "Ngày SX", width: 150 },
    { field: "REMARK", headerName: "REMARK", width: 80 },
    { field: "PIC_KD", headerName: "PIC_KD", width: 120 },
    { field: "CA_LAM_VIEC", headerName: "CA LV", width: 120 },
    { field: "NGAY_LAM_VIEC", headerName: "NGAY LV", width: 120 },
    {
      field: "STATUS",
      headerName: "NHẬP KHO",
      width: 120,
      renderCell: (params: any) => {
        if (params.row.STATUS.toUpperCase() === "PENDING") {
          return (
            <span style={{ color: "red" }}>
              <b>{params.row.STATUS.toUpperCase()}</b>
            </span>
          );
        } else if (params.row.STATUS.toUpperCase() === "PROGRS") {
          return (
            <span style={{ color: "orange" }}>
              <b>ĐANG NHẬP</b>
            </span>
          );
        } else {
          return (
            <span style={{ color: "green" }}>
              <b>{params.row.STATUS.toUpperCase()}</b>
            </span>
          );
        }
      },
    },
  ];
  const column_inspect_inoutycsx = [
    { field: "PIC_KD", headerName: "PIC_KD", width: 150 },
    { field: "CUST_NAME_KD", headerName: "Khách", width: 120 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 180 },
    { field: "G_NAME_KD", headerName: "Code KD", width: 120 },
    { field: "PROD_REQUEST_NO", headerName: "Số YC", width: 80 },
    { field: "PROD_REQUEST_DATE", headerName: "Ngày YC", width: 80 },
    {
      field: "PROD_REQUEST_QTY",
      headerName: "SL YC",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.row.PROD_REQUEST_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "LOT_TOTAL_INPUT_QTY_EA",
      headerName: "Nhập EA",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.LOT_TOTAL_INPUT_QTY_EA.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "LOT_TOTAL_OUTPUT_QTY_EA",
      headerName: "Xuất EA",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.LOT_TOTAL_OUTPUT_QTY_EA.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "DA_KIEM_TRA",
      headerName: "Đã Kiểm",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.row.DA_KIEM_TRA.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "OK_QTY",
      headerName: "OK_QTY",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.row.OK_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "LOSS_NG_QTY",
      headerName: "Loss và NG",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.LOSS_NG_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "INSPECT_BALANCE",
      headerName: "Tồn kiểm",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "purple" }}>
            <b>{params.row.INSPECT_BALANCE.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
  ];
  const column_inspection_NG = [
    { field: "INSPECT_ID", headerName: "INSPECT_ID", width: 80 },
    { field: "YEAR_WEEK", headerName: "YEAR_WEEK", width: 80 },
    { field: "CUST_NAME_KD", headerName: "Khách", width: 120 },
    { field: "PROD_REQUEST_NO", headerName: "Số YC", width: 80 },
    { field: "G_NAME_KD", headerName: "Code KD", width: 110 },
    { field: "G_NAME", headerName: "Code full", width: 150 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 80 },
    { field: "M_LOT_NO", headerName: "LOT VL", width: 80 },
    { field: "M_NAME", headerName: "M_NAME", width: 120 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 80 },
    { field: "INSPECTOR", headerName: "INSPECTOR", width: 80 },
    { field: "LINEQC", headerName: "LINEQC", width: 80 },
    { field: "PROD_PIC", headerName: "PROD_PIC", width: 80 },
    { field: "UNIT", headerName: "UNIT", width: 80 },
    { field: "PROCESS_LOT_NO", headerName: "LOT SX", width: 80 },
    { field: "PROCESS_IN_DATE", headerName: "NGÀY SX", width: 120 },
    { field: "INSPECT_DATETIME", headerName: "Ngày kiểm", width: 150 },
    {
      field: "INSPECT_START_TIME",
      headerName: "INSPECT_START_TIME",
      width: 150,
    },
    {
      field: "INSPECT_FINISH_TIME",
      headerName: "INSPECT_FINISH_TIME",
      width: 150,
    },
    { field: "FACTORY", headerName: "FACTORY", width: 80 },
    { field: "LINEQC_PIC", headerName: "LINEQC_PIC", width: 80 },
    { field: "MACHINE_NO", headerName: "MACHINE_NO", width: 80 },
    { field: "INSPECT_TOTAL_QTY", headerName: "Tổng Kiểm", width: 80 },
    { field: "INSPECT_OK_QTY", headerName: "Tổng OK", width: 80 },
    { field: "INSPECT_SPEED", headerName: "Tốc độ kiểm", width: 80 },
    { field: "INSPECT_TOTAL_LOSS_QTY", headerName: "Tổng Loss", width: 80 },
    { field: "INSPECT_TOTAL_NG_QTY", headerName: "Tông NG", width: 80 },
    { field: "MATERIAL_NG_QTY", headerName: "NG MATERIAL", width: 100 },
    { field: "PROCESS_NG_QTY", headerName: "NG PROCESS", width: 100 },
    { field: "PROD_PRICE", headerName: "PROD_PRICE", width: 100 },
    { field: "ERR1", headerName: "ERR1", width: 80 },
    { field: "ERR2", headerName: "ERR2", width: 80 },
    { field: "ERR3", headerName: "ERR3", width: 80 },
    { field: "ERR4", headerName: "ERR4", width: 80 },
    { field: "ERR5", headerName: "ERR5", width: 80 },
    { field: "ERR6", headerName: "ERR6", width: 80 },
    { field: "ERR7", headerName: "ERR7", width: 80 },
    { field: "ERR8", headerName: "ERR8", width: 80 },
    { field: "ERR9", headerName: "ERR9", width: 80 },
    { field: "ERR10", headerName: "ERR10", width: 80 },
    { field: "ERR11", headerName: "ERR11", width: 80 },
    { field: "ERR12", headerName: "ERR12", width: 80 },
    { field: "ERR13", headerName: "ERR13", width: 80 },
    { field: "ERR14", headerName: "ERR14", width: 80 },
    { field: "ERR15", headerName: "ERR15", width: 80 },
    { field: "ERR16", headerName: "ERR16", width: 80 },
    { field: "ERR17", headerName: "ERR17", width: 80 },
    { field: "ERR18", headerName: "ERR18", width: 80 },
    { field: "ERR19", headerName: "ERR19", width: 80 },
    { field: "ERR20", headerName: "ERR20", width: 80 },
    { field: "ERR21", headerName: "ERR21", width: 80 },
    { field: "ERR22", headerName: "ERR22", width: 80 },
    { field: "ERR23", headerName: "ERR23", width: 80 },
    { field: "ERR24", headerName: "ERR24", width: 80 },
    { field: "ERR25", headerName: "ERR25", width: 80 },
    { field: "ERR26", headerName: "ERR26", width: 80 },
    { field: "ERR27", headerName: "ERR27", width: 80 },
    { field: "ERR28", headerName: "ERR28", width: 80 },
    { field: "ERR29", headerName: "ERR29", width: 80 },
    { field: "ERR30", headerName: "ERR30", width: 80 },
    { field: "ERR31", headerName: "ERR31", width: 80 },
    { field: "ERR32", headerName: "ERR32", width: 80 },
    { field: "CNDB_ENCODES", headerName: "CNDB_ENCODES", width: 150 },
  ];
  const [columnDefinition, setColumnDefinition] =
    useState<Array<any>>(column_inspect_input);
  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(inspectiondatatable, "Inspection Data Table");
          }}
        >
          <AiFillFileExcel color='green' size={25} />
          SAVE
        </IconButton>
        <span
          style={{
            fontWeight: "bold",
            fontSize: 18,
            paddingLeft: 20,
            color: "blue",
          }}
        >
          {sumaryINSPECT}
        </span>
        <GridToolbarQuickFilter />
        <IconButton
          className='buttonIcon'
          onClick={() => {
            setShowHidePivotTable(!showhidePivotTable);
          }}
        >
          <MdOutlinePivotTableChart color='#ff33bb' size={25} />
          Pivot
        </IconButton>
      </GridToolbarContainer>
    );
  }
  const handletraInspectionInput = () => {
    setisLoading(true);
    let summaryInput: number = 0;
    generalQuery("get_inspection", {
      OPTIONS: "Nhập Kiểm (LOT)",
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      process_lot_no: process_lot_no,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name,
      PROD_REQUEST_NO: prodrequestno,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: INSPECT_INPUT_DATA[] = response.data.data.map(
            (element: INSPECT_INPUT_DATA, index: number) => {
              summaryInput += element.INPUT_QTY_EA;
              return {
                ...element,
                PROD_DATETIME: moment
                  .utc(element.PROD_DATETIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                INPUT_DATETIME: moment
                  .utc(element.INPUT_DATETIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            }
          );
          setSummaryInspect(
            "Tổng Nhập: " + summaryInput.toLocaleString("en-US") + "EA"
          );
          setInspectionDataTable(loadeddata);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fieldsinputkiem,
              store: loadeddata,
            })
          );

          setReadyRender(true);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success"
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handletraInspectionOutput = () => {
    let summaryOutput: number = 0;
    setisLoading(true);
    generalQuery("get_inspection", {
      OPTIONS: "Xuất Kiểm (LOT)",
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      process_lot_no: process_lot_no,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name,
      PROD_REQUEST_NO: prodrequestno,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: INSPECT_OUTPUT_DATA[] = response.data.data.map(
            (element: INSPECT_OUTPUT_DATA, index: number) => {
              summaryOutput += element.OUTPUT_QTY_EA;
              return {
                ...element,
                PROD_DATETIME: moment
                  .utc(element.PROD_DATETIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                OUTPUT_DATETIME: moment
                  .utc(element.OUTPUT_DATETIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                NGAY_LAM_VIEC: element.NGAY_LAM_VIEC.slice(0, 10),
                id: index,
              };
            }
          );
          setSummaryInspect(
            "Tổng Xuất: " + summaryOutput.toLocaleString("en-US") + "EA"
          );
          setInspectionDataTable(loadeddata);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fieldsoutputkiem,
              store: loadeddata,
            })
          );
          setReadyRender(true);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success"
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handletraInspectionNG = () => {
    setSummaryInspect("");
    setisLoading(true);
    generalQuery("get_inspection", {
      OPTIONS: "Nhật Ký Kiểm Tra",
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      process_lot_no: process_lot_no,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name,
      PROD_REQUEST_NO: prodrequestno,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: INSPECT_NG_DATA[] = response.data.data.map(
            (element: INSPECT_NG_DATA, index: number) => {
              return {
                ...element,
                INSPECT_DATETIME: moment(element.INSPECT_DATETIME).format(
                  "YYYY-MM-DD HH:mm:ss"
                ),
                INSPECT_START_TIME: moment(element.INSPECT_START_TIME).format(
                  "YYYY-MM-DD HH:mm:ss"
                ),
                INSPECT_FINISH_TIME: moment(element.INSPECT_FINISH_TIME).format(
                  "YYYY-MM-DD HH:mm:ss"
                ),
                id: index,
              };
            }
          );
          setInspectionDataTable(loadeddata);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fieldsnhatkykiem,
              store: loadeddata,
            })
          );
          setReadyRender(true);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success"
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handletraInspectionInOut = () => {
    setSummaryInspect("");
    setisLoading(true);
    generalQuery("get_inspection", {
      OPTIONS: "Nhập Xuất Kiểm (YCSX)",
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      process_lot_no: process_lot_no,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name,
      PROD_REQUEST_NO: prodrequestno,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: INSPECT_INOUT_YCSX[] = response.data.data.map(
            (element: INSPECT_INOUT_YCSX, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          setInspectionDataTable(loadeddata);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fieldsinoutputkiem,
              store: loadeddata,
            })
          );
          setReadyRender(true);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success"
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const setNav = (choose: number) => {
    if (choose === 1) {
      setSelection({
        ...selection,
        trapo: true,
        thempohangloat: false,
        them1po: false,
        them1invoice: false,
        inserttableycsx: false,
        amazontab: false,
      });
    } else if (choose === 2) {
      setSelection({
        ...selection,
        trapo: false,
        thempohangloat: true,
        them1po: true,
        them1invoice: false,
        themycsx: false,
        suaycsx: false,
        inserttableycsx: true,
        amazontab: false,
      });
    } else if (choose === 3) {
      setSelection({
        ...selection,
        trapo: false,
        thempohangloat: false,
        them1po: false,
        them1invoice: false,
        inserttableycsx: false,
        amazontab: true,
      });
    }
  };
  const fieldsinputkiem: any = [
    {
      caption: "INSPECT_INPUT_ID",
      width: 80,
      dataField: "INSPECT_INPUT_ID",
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
      caption: "PROD_REQUEST_DATE",
      width: 80,
      dataField: "PROD_REQUEST_DATE",
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
      caption: "PROD_REQUEST_QTY",
      width: 80,
      dataField: "PROD_REQUEST_QTY",
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
      caption: "PROCESS_LOT_NO",
      width: 80,
      dataField: "PROCESS_LOT_NO",
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
      caption: "PROD_DATETIME",
      width: 80,
      dataField: "PROD_DATETIME",
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
      caption: "INPUT_DATETIME",
      width: 80,
      dataField: "INPUT_DATETIME",
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
      caption: "INPUT_QTY_EA",
      width: 80,
      dataField: "INPUT_QTY_EA",
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
      caption: "INPUT_QTY_KG",
      width: 80,
      dataField: "INPUT_QTY_KG",
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
      caption: "CNDB_ENCODES",
      width: 80,
      dataField: "CNDB_ENCODES",
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
      caption: "PIC_KD",
      width: 80,
      dataField: "PIC_KD",
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
  const fieldsoutputkiem: any = [
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
      caption: "PROD_REQUEST_DATE",
      width: 80,
      dataField: "PROD_REQUEST_DATE",
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
      caption: "PROD_REQUEST_QTY",
      width: 80,
      dataField: "PROD_REQUEST_QTY",
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
      caption: "PROCESS_LOT_NO",
      width: 80,
      dataField: "PROCESS_LOT_NO",
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
      caption: "PROD_DATETIME",
      width: 80,
      dataField: "PROD_DATETIME",
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
      caption: "OUTPUT_DATETIME",
      width: 80,
      dataField: "OUTPUT_DATETIME",
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
      caption: "OUTPUT_QTY_EA",
      width: 80,
      dataField: "OUTPUT_QTY_EA",
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
      caption: "PIC_KD",
      width: 80,
      dataField: "PIC_KD",
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
      caption: "CA_LAM_VIEC",
      width: 80,
      dataField: "CA_LAM_VIEC",
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
      caption: "NGAY_LAM_VIEC",
      width: 80,
      dataField: "NGAY_LAM_VIEC",
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
  ];
  const fieldsinoutputkiem: any = [
    {
      caption: "PIC_KD",
      width: 80,
      dataField: "PIC_KD",
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
      caption: "PROD_REQUEST_DATE",
      width: 80,
      dataField: "PROD_REQUEST_DATE",
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
      caption: "PROD_REQUEST_QTY",
      width: 80,
      dataField: "PROD_REQUEST_QTY",
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
      caption: "LOT_TOTAL_INPUT_QTY_EA",
      width: 80,
      dataField: "LOT_TOTAL_INPUT_QTY_EA",
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
      caption: "LOT_TOTAL_OUTPUT_QTY_EA",
      width: 80,
      dataField: "LOT_TOTAL_OUTPUT_QTY_EA",
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
      caption: "DA_KIEM_TRA",
      width: 80,
      dataField: "DA_KIEM_TRA",
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
      caption: "OK_QTY",
      width: 80,
      dataField: "OK_QTY",
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
      caption: "LOSS_NG_QTY",
      width: 80,
      dataField: "LOSS_NG_QTY",
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
      caption: "INSPECT_BALANCE",
      width: 80,
      dataField: "INSPECT_BALANCE",
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
  ];
  const fieldsnhatkykiem: any = [
    {
      caption: "INSPECT_ID",
      width: 80,
      dataField: "INSPECT_ID",
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
      caption: "YEAR_WEEK",
      width: 80,
      dataField: "YEAR_WEEK",
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
      caption: "INSPECTOR",
      width: 80,
      dataField: "INSPECTOR",
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
      caption: "LINEQC",
      width: 80,
      dataField: "LINEQC",
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
      caption: "PROD_PIC",
      width: 80,
      dataField: "PROD_PIC",
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
      caption: "UNIT",
      width: 80,
      dataField: "UNIT",
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
      caption: "PROCESS_LOT_NO",
      width: 80,
      dataField: "PROCESS_LOT_NO",
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
      caption: "PROCESS_IN_DATE",
      width: 80,
      dataField: "PROCESS_IN_DATE",
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
      caption: "INSPECT_DATETIME",
      width: 80,
      dataField: "INSPECT_DATETIME",
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
      caption: "INSPECT_START_TIME",
      width: 80,
      dataField: "INSPECT_START_TIME",
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
      caption: "INSPECT_FINISH_TIME",
      width: 80,
      dataField: "INSPECT_FINISH_TIME",
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
      caption: "LINEQC_PIC",
      width: 80,
      dataField: "LINEQC_PIC",
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
      caption: "MACHINE_NO",
      width: 80,
      dataField: "MACHINE_NO",
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
      caption: "INSPECT_SPEED",
      width: 80,
      dataField: "INSPECT_SPEED",
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
      caption: "INSPECT_TOTAL_LOSS_QTY",
      width: 80,
      dataField: "INSPECT_TOTAL_LOSS_QTY",
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
      caption: "INSPECT_TOTAL_NG_QTY",
      width: 80,
      dataField: "INSPECT_TOTAL_NG_QTY",
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
      caption: "MATERIAL_NG_QTY",
      width: 80,
      dataField: "MATERIAL_NG_QTY",
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
      caption: "PROCESS_NG_QTY",
      width: 80,
      dataField: "PROCESS_NG_QTY",
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
      caption: "PROD_PRICE",
      width: 80,
      dataField: "PROD_PRICE",
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
      caption: "ERR1",
      width: 80,
      dataField: "ERR1",
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
      caption: "ERR2",
      width: 80,
      dataField: "ERR2",
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
      caption: "ERR3",
      width: 80,
      dataField: "ERR3",
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
      caption: "ERR4",
      width: 80,
      dataField: "ERR4",
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
      caption: "ERR5",
      width: 80,
      dataField: "ERR5",
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
      caption: "ERR6",
      width: 80,
      dataField: "ERR6",
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
      caption: "ERR7",
      width: 80,
      dataField: "ERR7",
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
      caption: "ERR8",
      width: 80,
      dataField: "ERR8",
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
      caption: "ERR9",
      width: 80,
      dataField: "ERR9",
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
      caption: "ERR10",
      width: 80,
      dataField: "ERR10",
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
      caption: "ERR11",
      width: 80,
      dataField: "ERR11",
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
      caption: "ERR12",
      width: 80,
      dataField: "ERR12",
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
      caption: "ERR13",
      width: 80,
      dataField: "ERR13",
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
      caption: "ERR14",
      width: 80,
      dataField: "ERR14",
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
      caption: "ERR15",
      width: 80,
      dataField: "ERR15",
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
      caption: "ERR16",
      width: 80,
      dataField: "ERR16",
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
      caption: "ERR17",
      width: 80,
      dataField: "ERR17",
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
      caption: "ERR18",
      width: 80,
      dataField: "ERR18",
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
      caption: "ERR19",
      width: 80,
      dataField: "ERR19",
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
      caption: "ERR20",
      width: 80,
      dataField: "ERR20",
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
      caption: "ERR21",
      width: 80,
      dataField: "ERR21",
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
      caption: "ERR22",
      width: 80,
      dataField: "ERR22",
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
      caption: "ERR23",
      width: 80,
      dataField: "ERR23",
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
      caption: "ERR24",
      width: 80,
      dataField: "ERR24",
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
      caption: "ERR25",
      width: 80,
      dataField: "ERR25",
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
      caption: "ERR26",
      width: 80,
      dataField: "ERR26",
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
      caption: "ERR27",
      width: 80,
      dataField: "ERR27",
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
      caption: "ERR28",
      width: 80,
      dataField: "ERR28",
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
      caption: "ERR29",
      width: 80,
      dataField: "ERR29",
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
      caption: "ERR30",
      width: 80,
      dataField: "ERR30",
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
      caption: "ERR31",
      width: 80,
      dataField: "ERR31",
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
      caption: "ERR32",
      width: 80,
      dataField: "ERR32",
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
      caption: "CNDB_ENCODES",
      width: 80,
      dataField: "CNDB_ENCODES",
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
        fields: fieldsinputkiem,
        store: inspectiondatatable,
      })
    );
  useEffect(() => {
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className='inspection'>
      <div className='tracuuDataInspection'>
        <div className='tracuuDataInspectionform'>
          <div className='forminput'>
            <div className='forminputcolumn'>
              <label>
                <b>Từ ngày:</b>
                <input
                  type='date'
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)} 
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
                  type='date'
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Code KD:</b>{" "}
                <input
                  type='text'
                  placeholder='GH63-xxxxxx'
                  value={codeKD}
                  onChange={(e) => setCodeKD(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Code CMS:</b>{" "}
                <input
                  type='text'
                  placeholder='7C123xxx'
                  value={codeCMS}
                  onChange={(e) => setCodeCMS(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Tên nhân viên:</b>{" "}
                <input
                  type='text'
                  placeholder='Trang'
                  value={empl_name}
                  onChange={(e) => setEmpl_Name(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Khách:</b>{" "}
                <input
                  type='text'
                  placeholder='SEVT'
                  value={cust_name}
                  onChange={(e) => setCustName(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Loại sản phẩm:</b>{" "}
                <input
                  type='text'
                  placeholder='TSP'
                  value={prod_type}
                  onChange={(e) => setProdType(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Số YCSX:</b>{" "}
                <input
                  type='text'
                  placeholder='1H23456'
                  value={prodrequestno}
                  onChange={(e) => setProdRequestNo(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>LOT SX:</b>{" "}
                <input
                  type='text'
                  placeholder='ED2H3076'
                  value={process_lot_no}
                  onChange={(e) => setProcess_Lot_No(e.target.value)}
                ></input>
              </label>
              <label>
                <b>ID:</b>{" "}
                <input
                  type='text'
                  placeholder='12345'
                  value={id}
                  onChange={(e) => setID(e.target.value)}
                ></input>
              </label>
            </div>
          </div>
          <div className='formbutton'>
            <label>
              <b>All Time:</b>
              <input
                type='checkbox'
                name='alltimecheckbox'
                defaultChecked={alltime}
                onChange={() => setAllTime(!alltime)}
              ></input>
            </label>
            <button
              className='tranhapkiembutton'
              onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_inspect_input);
                handletraInspectionInput();
              }}
            >
              Nhập Kiểm
            </button>
            <button
              className='traxuatkiembutton'
              onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_inspect_output);
                handletraInspectionOutput();
              }}
            >
              Xuất Kiểm
            </button>
            <button
              className='tranhapxuatkiembutton'
              onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_inspect_inoutycsx); 
                handletraInspectionInOut();
              }}
            >
              Nhập-Xuất(YCSX)
            </button>
            <button
              className='tranhatky'
              onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_inspection_NG);
                handletraInspectionNG();
              }}
            >
              Nhật Ký KT
            </button>
          </div>
        </div>
        <div className='tracuuYCSXTable'>
          {readyRender && (
            <DataGrid
              sx={{ fontSize: 12, flex: 1 }}
              components={{
                Toolbar: CustomToolbarPOTable,
                LoadingOverlay: LinearProgress,
              }}
              headerHeight={58}
              loading={isLoading}
              rowHeight={30}
              rows={inspectiondatatable}
              columns={columnDefinition}
              rowsPerPageOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
              ]}
              editMode='row'
            />
          )}
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
            <PivotTable
              datasource={selectedDataSource}
              tableID='inspectiontablepivot'
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default INSPECTION;
