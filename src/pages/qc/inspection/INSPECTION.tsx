import { Button, IconButton } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode } from "../../../api/Api";
import "./INSPECTION.scss";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotTable from "../../../components/PivotChart/PivotChart";
import {
  CHO_KIEM_DATA,
  INSPECT_INOUT_YCSX,
  INSPECT_INPUT_DATA,
  INSPECT_NG_DATA,
  INSPECT_OUTPUT_DATA,
  INSPECT_PATROL,
} from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { f_updateTONKIEM_M100 } from "../../../api/GlobalFunction";
const INSPECTION = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [readyRender, setReadyRender] = useState(false);
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
    [],
  );
  const [sumaryINSPECT, setSummaryInspect] = useState("");
  const column_inspect_input = [
    {
      field: "INSPECT_INPUT_ID", headerName: "ID", width: 100, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { field: "CUST_NAME_KD", headerName: "Khách", width: 120 },
    { field: "EMPL_NAME", headerName: "Nhân Viên", width: 150 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME", headerName: "Tên SP", width: 250 },
    { field: "INPUT_DATETIME", headerName: "Ngày nhập kiểm", width: 150 },
    {
      field: "INPUT_QTY_EA",
      headerName: "SL NHẬP EA",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.INPUT_QTY_EA?.toLocaleString("en-US")}</b>
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
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.data.PROD_REQUEST_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "PROCESS_LOT_NO", headerName: "LOT SX", width: 80 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 100 },
    { field: "LOTNCC", headerName: "LOTNCC", width: 100 },
    { field: "PROD_DATETIME", headerName: "NGÀY SX", width: 150 },
    {
      field: "INPUT_QTY_KG",
      headerName: "SL NHẬP GRAM",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.data.INPUT_QTY_KG?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "REMARK", headerName: "FACTORY", width: 80 },
    { field: "CNDB_ENCODES", headerName: "CNDB_ENCODES", width: 80 },
  ];
  const column_inspect_output = [
    {
      field: "INSPECT_OUTPUT_ID", headerName: "ID", width: 100, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { field: "CUST_NAME_KD", headerName: "Khách hàng", width: 150 },
    { field: "EMPL_NAME", headerName: "Nhân viên", width: 150 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 180 },
    { field: "OUTPUT_DATETIME", headerName: "OUTPUT TIME", width: 150 },
    {
      field: "OUTPUT_QTY_EA",
      headerName: "OUTPUT QTY",
      width: 110,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.OUTPUT_QTY_EA?.toLocaleString("en-US")}</b>
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
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.data.PROD_REQUEST_QTY?.toLocaleString("en-US")}</b>
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
      cellRenderer: (params: any) => {
        if (params.data.STATUS?.toUpperCase() === "PENDING") {
          return (
            <span style={{ color: "red" }}>
              <b>{params.data.STATUS?.toUpperCase()}</b>
            </span>
          );
        } else if (params.data.STATUS?.toUpperCase() === "PROGRS") {
          return (
            <span style={{ color: "orange" }}>
              <b>ĐANG NHẬP</b>
            </span>
          );
        } else {
          return (
            <span style={{ color: "green" }}>
              <b>{params.data.STATUS?.toUpperCase()}</b>
            </span>
          );
        }
      },
    },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 100 },
    { field: "LOTNCC", headerName: "LOTNCC", width: 100 },
  ];
  const column_inspect_inoutycsx = [
    {
      field: "PIC_KD", headerName: "PIC_KD", width: 150, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
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
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.data.PROD_REQUEST_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "LOT_TOTAL_INPUT_QTY_EA",
      headerName: "Nhập EA",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.LOT_TOTAL_INPUT_QTY_EA?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "LOT_TOTAL_OUTPUT_QTY_EA",
      headerName: "Xuất EA",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.LOT_TOTAL_OUTPUT_QTY_EA?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "DA_KIEM_TRA",
      headerName: "Đã Kiểm",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.data.DA_KIEM_TRA?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "OK_QTY",
      headerName: "OK_QTY",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.OK_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "LOSS_NG_QTY",
      headerName: "Loss và NG",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.LOSS_NG_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "INSPECT_BALANCE",
      headerName: "Tồn kiểm",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "purple" }}>
            <b>{params.data.INSPECT_BALANCE?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
  ];
  const column_inspection_NG = [
    {
      field: "INSPECT_ID", headerName: "INSPECT_ID", width: 100, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { field: "YEAR_WEEK", headerName: "YEAR_WEEK", width: 80 },
    { field: "CUST_NAME_KD", headerName: "Khách", width: 120 },
    { field: "PROD_REQUEST_NO", headerName: "Số YC", width: 80 },
    { field: "G_NAME_KD", headerName: "Code KD", width: 110 },
    { field: "G_NAME", headerName: "Code full", width: 150 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 80 },
    { field: "M_LOT_NO", headerName: "LOT VL", width: 100 },
    { field: "LOTNCC", headerName: "LOTNCC", width: 100 },
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
    { field: "ERR1", headerName: "ERR1", width: 60 },
    { field: "ERR2", headerName: "ERR2", width: 60 },
    { field: "ERR3", headerName: "ERR3", width: 60 },
    { field: "ERR4", headerName: "ERR4", width: 60 },
    { field: "ERR5", headerName: "ERR5", width: 60 },
    { field: "ERR6", headerName: "ERR6", width: 60 },
    { field: "ERR7", headerName: "ERR7", width: 60 },
    { field: "ERR8", headerName: "ERR8", width: 60 },
    { field: "ERR9", headerName: "ERR9", width: 60 },
    { field: "ERR10", headerName: "ERR10", width: 60 },
    { field: "ERR11", headerName: "ERR11", width: 60 },
    { field: "ERR12", headerName: "ERR12", width: 60 },
    { field: "ERR13", headerName: "ERR13", width: 60 },
    { field: "ERR14", headerName: "ERR14", width: 60 },
    { field: "ERR15", headerName: "ERR15", width: 60 },
    { field: "ERR16", headerName: "ERR16", width: 60 },
    { field: "ERR17", headerName: "ERR17", width: 60 },
    { field: "ERR18", headerName: "ERR18", width: 60 },
    { field: "ERR19", headerName: "ERR19", width: 60 },
    { field: "ERR20", headerName: "ERR20", width: 60 },
    { field: "ERR21", headerName: "ERR21", width: 60 },
    { field: "ERR22", headerName: "ERR22", width: 60 },
    { field: "ERR23", headerName: "ERR23", width: 60 },
    { field: "ERR24", headerName: "ERR24", width: 60 },
    { field: "ERR25", headerName: "ERR25", width: 60 },
    { field: "ERR26", headerName: "ERR26", width: 60 },
    { field: "ERR27", headerName: "ERR27", width: 60 },
    { field: "ERR28", headerName: "ERR28", width: 60 },
    { field: "ERR29", headerName: "ERR29", width: 60 },
    { field: "ERR30", headerName: "ERR30", width: 60 },
    { field: "ERR31", headerName: "ERR31", width: 60 },
    { field: "ERR32", headerName: "ERR32", width: 60 },
    { field: "CNDB_ENCODES", headerName: "CNDB_ENCODES", width: 150 },
  ];
  const column_inspect_balance = [
    {
      field: "G_CODE", headerName: "G_CODE", width: 120, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { field: "G_NAME", headerName: "G_NAME", width: 130 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 150 },
    {
      field: "INSPECT_BALANCE_QTY", headerName: "TON_KIEM", width: 100, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.data.INSPECT_BALANCE_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "WAIT_CS_QTY", headerName: "CHO_CS", width: 100, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.data.WAIT_CS_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "WAIT_SORTING_RMA", headerName: "RMA_CHO_SORTING", width: 100, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.data.WAIT_SORTING_RMA?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TOTAL_WAIT", headerName: "TOTAL_WAIT", width: 100, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.TOTAL_WAIT?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
  ];
  const column_inspect_patrol = [
    {
      field: 'INS_PATROL_ID', headerName: 'INS_PATROL_ID', width: 120, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { field: 'G_NAME', headerName: 'G_NAME', width: 80 },
    { field: 'G_NAME_KD', headerName: 'G_NAME_KD', width: 80 },
    { field: 'CUST_NAME_KD', headerName: 'CUST_NAME_KD', width: 80 },
    { field: 'PROD_REQUEST_NO', headerName: 'PROD_REQUEST_NO', width: 80 },
    { field: 'PLAN_ID', headerName: 'PLAN_ID', width: 80 },
    { field: 'PROCESS_LOT_NO', headerName: 'PROCESS_LOT_NO', width: 80 },
    { field: 'G_CODE', headerName: 'G_CODE', width: 80 },
    { field: 'ERR_CODE', headerName: 'ERR_CODE', width: 80 },
    { field: 'INSPECT_QTY', headerName: 'INSPECT_QTY', width: 80 },
    { field: 'DEFECT_QTY', headerName: 'DEFECT_QTY', width: 80 },
    { field: 'DEFECT_PHENOMENON', headerName: 'DEFECT_PHENOMENON', width: 80 },
    { field: 'LINEQC_PIC', headerName: 'LINEQC_PIC', width: 80 },
    { field: 'INSP_PIC', headerName: 'INSP_PIC', width: 80 },
    { field: 'PROD_PIC', headerName: 'PROD_PIC', width: 80 },
    { field: 'INS_DATE', headerName: 'INS_DATE', width: 80 },
    { field: 'PHANLOAI', headerName: 'PHANLOAI', width: 80 },
    { field: 'REMARK', headerName: 'REMARK', width: 80 },
    { field: 'OCCURR_TIME', headerName: 'OCCURR_TIME', width: 80 },
    { field: 'LABEL_ID', headerName: 'LABEL_ID', width: 80 },
    { field: 'EQUIPMENT_CD', headerName: 'EQUIPMENT_CD', width: 80 },
    { field: 'CUST_CD', headerName: 'CUST_CD', width: 80 },
    { field: 'FACTORY', headerName: 'FACTORY', width: 80 },
  ];
  const [columnDefinition, setColumnDefinition] =
    useState<Array<any>>(column_inspect_input);
  const handletraInspectionInput = () => {
    setisLoading(true);   
    Swal.fire({
      title: "Loading data",
      text: "Data is being loaded, please wait",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
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
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',

                PROD_DATETIME: moment
                  .utc(element.PROD_DATETIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                INPUT_DATETIME: moment
                  .utc(element.INPUT_DATETIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            },
          );
          setSummaryInspect(
            "Tổng Nhập: " + summaryInput.toLocaleString("en-US") + "EA",
          );
          setInspectionDataTable(loadeddata);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fieldsinputkiem,
              store: loadeddata,
            }),
          );
          setReadyRender(true);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
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
    Swal.fire({
      title: "Loading data",
      text: "Data is being loaded, please wait",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
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
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',

                PROD_DATETIME: moment
                  .utc(element.PROD_DATETIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                OUTPUT_DATETIME: moment
                  .utc(element.OUTPUT_DATETIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                NGAY_LAM_VIEC: element.NGAY_LAM_VIEC.slice(0, 10),
                id: index,
              };
            },
          );
          setSummaryInspect(
            "Tổng Xuất: " + summaryOutput.toLocaleString("en-US") + "EA",
          );
          setInspectionDataTable(loadeddata);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fieldsoutputkiem,
              store: loadeddata,
            }),
          );
          setReadyRender(true);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
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
    Swal.fire({
      title: "Loading data",
      text: "Data is being loaded, please wait",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
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
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',

                INSPECT_DATETIME: moment.utc(element.INSPECT_DATETIME).format(
                  "YYYY-MM-DD HH:mm:ss",
                ),
                INSPECT_START_TIME: moment.utc(element.INSPECT_START_TIME).format(
                  "YYYY-MM-DD HH:mm:ss",
                ),
                INSPECT_FINISH_TIME: moment.utc(element.INSPECT_FINISH_TIME).format(
                  "YYYY-MM-DD HH:mm:ss",
                ),
                id: index,
              };
            },
          );
          setInspectionDataTable(loadeddata);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fieldsnhatkykiem,
              store: loadeddata,
            }),
          );
          setReadyRender(true);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
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
    Swal.fire({
      title: "Loading data",
      text: "Data is being loaded, please wait",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
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
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',

                id: index,
              };
            },
          );
          setInspectionDataTable(loadeddata);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fieldsinoutputkiem,
              store: loadeddata,
            }),
          );
          setReadyRender(true);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
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
  const handleLoadChoKiem = async() => {
    Swal.fire({
      title: "Loading data",
      text: "Data is being loaded, please wait",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    setSummaryInspect("");
    setisLoading(true);
    await f_updateTONKIEM_M100();
    await generalQuery("loadChoKiemGop_NEW", {
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
          const loadeddata: CHO_KIEM_DATA[] = response.data.data.map(
            (element: CHO_KIEM_DATA, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',

                id: index,
              };
            },
          );
          setInspectionDataTable(loadeddata);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fieldsinspectbalance,
              store: loadeddata,
            }),
          );
          setReadyRender(true);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          setInspectionDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleGetInspectionPatrol = () => {
    Swal.fire({
      title: "Loading data",
      text: "Data is being loaded, please wait",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    setSummaryInspect("");
    setisLoading(true);
    generalQuery("loadInspectionPatrol", {
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
          const loadeddata: INSPECT_PATROL[] = response.data.data.map(
            (element: INSPECT_PATROL, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',

                id: index,
              };
            },
          );
          setInspectionDataTable(loadeddata);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fieldsinspectionpatrol,
              store: loadeddata,
            }),
          );
          setReadyRender(true);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          setInspectionDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const fieldsinspectbalance: any = [
    {
      caption: "ID",
      width: 80,
      dataField: "id",
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
      caption: "INSPECT_BALANCE_QTY",
      width: 80,
      dataField: "INSPECT_BALANCE_QTY",
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
      caption: "WAIT_CS_QTY",
      width: 80,
      dataField: "WAIT_CS_QTY",
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
      caption: "WAIT_SORTING_RMA",
      width: 80,
      dataField: "WAIT_SORTING_RMA",
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
      caption: "TOTAL_WAIT",
      width: 80,
      dataField: "TOTAL_WAIT",
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
  const fieldsinspectionpatrol: any = [
  ]
  const [selectedDataSource, setSelectedDataSource] =
    useState<PivotGridDataSource>(
      new PivotGridDataSource({
        fields: fieldsinputkiem,
        store: inspectiondatatable,
      }),
    );
  const inspectionDataTableAG = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1rem",
              paddingLeft: 20,
              color: "blue",
            }}
          >
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowHidePivotTable(!showhidePivotTable);
              }}
            >
              <MdOutlinePivotTableChart color="#ff33bb" size={15} />
              Pivot
            </IconButton>
            {sumaryINSPECT}
          </div>}
        columns={columnDefinition}
        data={inspectiondatatable}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          //console.log(e.data)
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    )
  }, [inspectiondatatable,columnDefinition])
  useEffect(() => {
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className="inspection">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Từ ngày:</b>
                <input
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
                  type="date"
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Code KD:</b>{" "}
                <input
                  type="text"
                  placeholder="GH63-xxxxxx"
                  value={codeKD}
                  onChange={(e) => setCodeKD(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Code ERP:</b>{" "}
                <input
                  type="text"
                  placeholder="7C123xxx"
                  value={codeCMS}
                  onChange={(e) => setCodeCMS(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Tên nhân viên:</b>{" "}
                <input
                  type="text"
                  placeholder="Trang"
                  value={empl_name}
                  onChange={(e) => setEmpl_Name(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Khách:</b>{" "}
                <input
                  type="text"
                  placeholder="SEVT"
                  value={cust_name}
                  onChange={(e) => setCustName(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Loại sản phẩm:</b>{" "}
                <input
                  type="text"
                  placeholder="TSP"
                  value={prod_type}
                  onChange={(e) => setProdType(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Số YCSX:</b>{" "}
                <input
                  type="text"
                  placeholder="1H23456"
                  value={prodrequestno}
                  onChange={(e) => setProdRequestNo(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>LOT SX:</b>{" "}
                <input
                  type="text"
                  placeholder="ED2H3076"
                  value={process_lot_no}
                  onChange={(e) => setProcess_Lot_No(e.target.value)}
                ></input>
              </label>
              <label>
                <b>ID:</b>{" "}
                <input
                  type="text"
                  placeholder="12345"
                  value={id}
                  onChange={(e) => setID(e.target.value)}
                ></input>
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
          </div>
          <div className="formbutton">
            <Button color={'success'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#36da59' }} onClick={() => {
              setisLoading(true);
              setReadyRender(false);
              setColumnDefinition(column_inspect_input);
              handletraInspectionInput();
            }}>Nhập Kiểm</Button>
            <Button color={'success'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#fac83f' }} onClick={() => {
              setisLoading(true);
              setReadyRender(false);
              setColumnDefinition(column_inspect_output);
              handletraInspectionOutput();
            }}> Xuất Kiểm</Button>
            <Button color={'success'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#52aeeb' }} onClick={() => {
              setisLoading(true);
              setReadyRender(false);
              setColumnDefinition(column_inspect_inoutycsx);
              handletraInspectionInOut();
            }}> Nhập-Xuất</Button>
            <Button color={'success'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#df73fa' }} onClick={() => {
              setisLoading(true);
              setReadyRender(false);
              setColumnDefinition(column_inspection_NG);
              handletraInspectionNG();
            }}> Nhật Ký KT</Button>
            <Button color={'success'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#ff0e1a' }} onClick={() => {
              setisLoading(true);
              setReadyRender(false);
              setColumnDefinition(column_inspect_balance);
              handleLoadChoKiem();
            }}> Chờ kiểm</Button>
            <Button color={'success'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#0656c0' }} onClick={() => {
              setisLoading(true);
              setReadyRender(false);
              setColumnDefinition(column_inspect_patrol);
              handleGetInspectionPatrol();
            }}> Data Patrol</Button>
          </div>
        </div>
        <div className="tracuuYCSXTable">
          {inspectionDataTableAG}
          {/* {false && (
            <DataGrid
              sx={{ fontSize: "0.7rem", flex: 1 }}
              components={{
                Toolbar: CustomToolbarPOTable,
                
              }}
              headerHeight={58}
              loading={isLoading}
              rowHeight={30}
              rows={inspectiondatatable}
              columns={columnDefinition}
              pageSizeOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
              ]}
              editMode="row"
            />
          )} */}
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
            <PivotTable
              datasource={selectedDataSource}
              tableID="inspectiontablepivot"
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default INSPECTION;