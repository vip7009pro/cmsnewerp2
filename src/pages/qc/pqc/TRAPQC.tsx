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
  AiFillFileExcel,
  AiOutlineCloudUpload,
  AiOutlinePrinter,
} from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { SaveExcel } from "../../../api/GlobalFunction";
import "./TRAPQC.scss";
interface PQC1_DATA {
  PQC1_ID: string;
  YEAR_WEEK: string;
  PROD_REQUEST_NO: string;
  PROD_REQUEST_QTY: number;
  PROD_REQUEST_DATE: string;
  PLAN_ID: string;
  PROCESS_LOT_NO: string;
  G_NAME: string;
  G_NAME_KD: string;
  LINEQC_PIC: string;
  PROD_PIC: string;
  PROD_LEADER: string;
  LINE_NO: number;
  STEPS: string;
  CAVITY: number;
  SETTING_OK_TIME: string;
  FACTORY: string;
  INSPECT_SAMPLE_QTY: number;
  PROD_LAST_PRICE: number;
  SAMPLE_AMOUNT: number;
  REMARK: string;
  INS_DATE: string;
  UPD_DATE: string;
  PQC3_ID: string, 
  OCCURR_TIME: string,
  INSPECT_QTY: number,
  DEFECT_QTY: number,
  DEFECT_RATE: number,
  DEFECT_PHENOMENON: number,
}
interface PQC3_DATA {
  YEAR_WEEK: string;
  PQC3_ID: number;
  PQC1_ID: number;
  CUST_NAME_KD: string;
  FACTORY: string;
  PROD_REQUEST_NO: string;
  PROD_REQUEST_DATE: string;
  PROCESS_LOT_NO: string;
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  PROD_LAST_PRICE: number;
  LINEQC_PIC: string;
  PROD_PIC: string;
  PROD_LEADER: string;
  LINE_NO: number;
  OCCURR_TIME: string;
  INSPECT_QTY: number;
  DEFECT_QTY: number;
  DEFECT_AMOUNT: number;
  DEFECT_PHENOMENON: string;
  DEFECT_IMAGE_LINK: string;
  REMARK: string;
  WORST5: string;
  WORST5_MONTH: string;
  ERR_CODE: string;
}
interface DAO_FILM_DATA {
  KNIFE_FILM_ID: string;
  FACTORY_NAME: number;
  NGAYBANGIAO: number;
  G_CODE: string;
  G_NAME: string;
  LOAIBANGIAO_PDP: string;
  LOAIPHATHANH: string;
  SOLUONG: string;
  SOLUONGOHP: string;
  LYDOBANGIAO: string;
  PQC_EMPL_NO: number;
  RND_EMPL_NO: string;
  SX_EMPL_NO: string;
  MA_DAO: string;
  REMARK: number;
}
interface CNDB_DATA {
  CNDB_DATE: string;
  CNDB_NO: string;
  CNDB_ENCODE: string;
  M_NAME: string;
  DEFECT_NAME: string;
  DEFECT_CONTENT: string;
  REG_EMPL_NO: string;
  REMARK: string;
  M_NAME2: string;
  INS_DATE: string;
  APPROVAL_STATUS: string;
  APPROVAL_EMPL: string;
  APPROVAL_DATE: string;
  G_CODE: string;
  G_NAME: string;
}
const TRAPQC = () => {
  const [readyRender, setReadyRender] = useState(true);
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
  const [factory, setFactory] = useState("All");
  const [pqcdatatable, setPqcDataTable] = useState<Array<any>>([]);
  const [sumaryINSPECT, setSummaryInspect] = useState("");
  const column_pqc1_data = [
    { field: "PQC1_ID", headerName: "PQC1_ID", width: 80 },
    { field: "YEAR_WEEK", headerName: "YEAR_WEEK", width: 80 },
    { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", width: 80 },
    { field: "PROD_REQUEST_QTY", headerName: "PROD_REQUEST_QTY", width: 80 },
    { field: "PROD_REQUEST_DATE", headerName: "PROD_REQUEST_DATE", width: 80 },
    { field: "PLAN_ID", headerName: "PLAN_ID", width: 80 },
    { field: "PROCESS_LOT_NO", headerName: "PROCESS_LOT_NO", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 250 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    { field: "LINEQC_PIC", headerName: "LINEQC_PIC", width: 80 },
    { field: "PROD_PIC", headerName: "PROD_PIC", width: 80 },
    { field: "PROD_LEADER", headerName: "PROD_LEADER", width: 80 },
    { field: "LINE_NO", headerName: "LINE_NO", width: 80 },
    { field: "STEPS", headerName: "STEPS", width: 80 },
    { field: "CAVITY", headerName: "CAVITY", width: 80 },
    {
      field: "SETTING_OK_TIME",
      type: "date",
      headerName: "SETTING_OK_TIME",
      width: 180,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {moment
              .utc(params.row.SETTING_OK_TIME)
              .format("YYYY-MM-DD HH:mm:ss")}
          </span>
        );
      },
    },
    { field: "FACTORY", headerName: "FACTORY", width: 80 },
    { field: "INSPECT_SAMPLE_QTY", headerName: "SAMPLE_QTY", width: 100 },
    { field: "PROD_LAST_PRICE", headerName: "PRICE", width: 80 },
    {
      field: "SAMPLE_AMOUNT",
      headerName: "SAMPLE_AMOUNT",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>
              {params.row.SAMPLE_AMOUNT?.toLocaleString("en-US", {
                style: "decimal",
                maximumFractionDigits: 8,
              })}
            </b>
          </span>
        );
      },
    },
    { field: "REMARK", headerName: "REMARK", width: 80 },
    { field: "PQC3_ID", headerName: "PQC3_ID", width: 80 },
    { field: "OCCURR_TIME", headerName: "OCCURR_TIME", width: 150 },
    { field: "INSPECT_QTY", headerName: "INSPECT_QTY", width: 120 },
    { field: "DEFECT_QTY", headerName: "DEFECT_QTY", width: 120 },
    { field: "DEFECT_RATE", headerName: "DEFECT_RATE", width: 120, renderCell: (params: any) => {
      return (
        <span style={{ color: "red" }}>
          {params.row.DEFECT_RATE.toLocaleString('en-US',{ maximumFractionDigits: 0,})}%
        </span>
      );
    },},
    { field: "DEFECT_PHENOMENON", headerName: "DEFECT_PHENOMENON", width: 150 },
    {
      field: "INS_DATE",
      type: "date",
      headerName: "INS_DATE",
      width: 180,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {moment.utc(params.row.INS_DATE).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        );
      },
    },
    {
      field: "UPD_DATE",
      type: "date",
      headerName: "UPD_DATE",
      width: 180,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {moment.utc(params.row.UPD_DATE).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        );
      },
    },
  ];
  const column_pqc3_data = [
    { field: "YEAR_WEEK", headerName: "YEAR_WEEK", width: 80 },
    { field: "PQC3_ID", headerName: "PQC3_ID", width: 80 },
    { field: "PQC1_ID", headerName: "PQC1_ID", width: 80 },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 120 },
    { field: "FACTORY", headerName: "FACTORY", width: 80 },
    { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", width: 80 },
    { field: "PROD_REQUEST_DATE", headerName: "PROD_REQUEST_DATE", width: 80 },
    { field: "PROCESS_LOT_NO", headerName: "PROCESS_LOT_NO", width: 80 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 250 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    { field: "PROD_LAST_PRICE", headerName: "PROD_LAST_PRICE", width: 80 },
    { field: "LINEQC_PIC", headerName: "LINEQC_PIC", width: 80 },
    { field: "PROD_PIC", headerName: "PROD_PIC", width: 80 },
    { field: "PROD_LEADER", headerName: "PROD_LEADER", width: 80 },
    { field: "LINE_NO", headerName: "LINE_NO", width: 80 },
    {
      field: "OCCURR_TIME",
      type: "date",
      headerName: "OCCURR_TIME",
      width: 180,
    },
    { field: "INSPECT_QTY", type: "number", headerName: "SL KT", width: 80 },
    { field: "DEFECT_QTY", type: "number", headerName: "SL NG", width: 80 },
    {
      field: "DEFECT_AMOUNT",
      type: "number",
      headerName: "DEFECT_AMOUNT",
      width: 120,
    },
    { field: "ERR_CODE", headerName: "ERR_CODE", width: 80 },
    { field: "DEFECT_PHENOMENON", headerName: "HIEN TUONG", width: 150 },
    {
      field: "DEFECT_IMAGE_LINK",
      headerName: "IMAGE LINK",
      width: 80,
      renderCell: (params: any) => {
        let href_link = "/pqc/PQC3_" + (params.row.PQC3_ID + 1) + ".png";
        return (
          <span style={{ color: "blue" }}>
            <a target='_blank' rel='noopener noreferrer' href={href_link}>
              LINK
            </a>
          </span>
        );
      },
    },
    { field: "REMARK", headerName: "REMARK", width: 120 },
    { field: "WORST5", headerName: "WORST5", width: 80 },
    { field: "WORST5_MONTH", headerName: "WORST5_MONTH", width: 80 },
  ];
  const column_daofilm_data = [
    { field: "KNIFE_FILM_ID", headerName: "ID", width: 80 },
    { field: "FACTORY_NAME", headerName: "FACTORY", width: 80 },
    {
      field: "NGAYBANGIAO",
      headerName: "NGAYBANGIAO",
      width: 100,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {moment.utc(params.row.NGAYBANGIAO).format("YYYY-MM-DD")}
          </span>
        );
      },
    },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 250 },
    {
      field: "LOAIBANGIAO_PDP",
      headerName: "LOAIBANGIAO",
      width: 80,
      renderCell: (params: any) => {
        switch (params.row.LOAIBANGIAO_PDP) {
          case "D":
            return <span style={{ color: "blue" }}>DAO</span>;
            break;
          case "F":
            return <span style={{ color: "blue" }}>FILM</span>;
            break;
          case "T":
            return <span style={{ color: "blue" }}>TAI LIEU</span>;
            break;
          default:
            return <span style={{ color: "blue" }}>N/A</span>;
            break;
        }
      },
    },
    {
      field: "LOAIPHATHANH",
      headerName: "LOAIPHATHANH",
      width: 110,
      renderCell: (params: any) => {
        switch (params.row.LOAIPHATHANH) {
          case "PH":
            return <span style={{ color: "blue" }}>PHAT HANH</span>;
            break;
          case "TH":
            return <span style={{ color: "blue" }}>THU HOI</span>;
            break;
          default:
            return <span style={{ color: "blue" }}>N/A</span>;
            break;
        }
      },
    },
    { field: "SOLUONG", headerName: "SOLUONG", width: 80 },
    { field: "SOLUONGOHP", headerName: "SOLUONGOHP", width: 80 },
    { field: "LYDOBANGIAO", headerName: "LYDOBANGIAO", width: 120 },
    { field: "PQC_EMPL_NO", headerName: "PQC_EMPL_NO", width: 80 },
    { field: "RND_EMPL_NO", headerName: "RND_EMPL_NO", width: 80 },
    { field: "SX_EMPL_NO", headerName: "SX_EMPL_NO", width: 80 },
    { field: "MA_DAO", headerName: "MA_DAO", width: 100 },
    { field: "REMARK", headerName: "REMARK", width: 150 },
  ];
  const column_cndb_data = [
    { field: "CNDB_DATE", type: "date", headerName: "CNDB_DATE", width: 120 },
    { field: "CNDB_NO", headerName: "CNDB_NO", width: 80 },
    { field: "CNDB_ENCODE", headerName: "CNDB_ENCODE", width: 100 },
    { field: "M_NAME", headerName: "M_NAME", width: 150 },
    { field: "DEFECT_NAME", headerName: "DEFECT_NAME", width: 100 },
    { field: "DEFECT_CONTENT", headerName: "DEFECT_CONTENT", width: 150 },
    { field: "REG_EMPL_NO", headerName: "REG_EMPL_NO", width: 150 },
    { field: "REMARK", headerName: "REMARK", width: 80 },
    { field: "M_NAME2", headerName: "M_NAME2", width: 120 },
    {
      field: "INS_DATE",
      type: "date",
      headerName: "INS_DATE",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {moment.utc(params.row.INS_DATE).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        );
      },
    },
    {
      field: "APPROVAL_STATUS",
      headerName: "APPROVAL_STATUS",
      width: 120,
      renderCell: (params: any) => {
        if (params.row.APPROVAL_STATUS === "Y")
          return <span style={{ color: "green" }}>Phê Duyệt</span>;
        return <span style={{ color: "red" }}>Chưa duyệt</span>;
      },
    },
    { field: "APPROVAL_EMPL", headerName: "APPROVAL_EMPL", width: 120 },
    {
      field: "APPROVAL_DATE",
      headerName: "APPROVAL_DATE",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.APPROVAL_DATE !== null)
          return (
            <span style={{ color: "blue" }}>
              {moment
                .utc(params.row.APPROVAL_DATE)
                .format("YYYY-MM-DD HH:mm:ss")}
            </span>
          );
        return <span style={{ color: "red" }}>Chưa duyệt</span>;
      },
    },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 250 },
  ];
  const [columnDefinition, setColumnDefinition] =
    useState<Array<any>>(column_pqc1_data);
  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(pqcdatatable, "Inspection Data Table");
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
      </GridToolbarContainer>
    );
  }
  const handletraInspectionInput = () => {
    setisLoading(true);
    let summaryInput: number = 0;
    generalQuery("trapqc1data", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      PROCESS_LOT_NO: process_lot_no,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name,
      PROD_REQUEST_NO: prodrequestno,
      ID: id,
      FACTORY: factory,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC1_DATA[] = response.data.data.map(
            (element: PQC1_DATA, index: number) => {
              //summaryInput += element.INPUT_QTY_EA;
              return {
                ...element,
                PROD_DATETIME: moment
                  .utc(element.INS_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                OCCURR_TIME: element.OCCURR_TIME !== null ? moment
                  .utc(element.OCCURR_TIME)
                  .format("YYYY-MM-DD HH:mm:ss"):'',
                INPUT_DATETIME: moment
                  .utc(element.UPD_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                DEFECT_RATE: element.INSPECT_QTY !== null? (element.DEFECT_QTY !== null? element.DEFECT_QTY: 0)/(element.INSPECT_QTY)*100:'',
                id: index,
              };
            }
          );
          //setSummaryInspect('Tổng Nhập: ' +  summaryInput.toLocaleString('en-US') + 'EA');
          setPqcDataTable(loadeddata);
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
    generalQuery("trapqc3data", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      PROCESS_LOT_NO: process_lot_no,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name,
      PROD_REQUEST_NO: prodrequestno,
      ID: id,
      FACTORY: factory,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC3_DATA[] = response.data.data.map(
            (element: PQC3_DATA, index: number) => {
              //summaryOutput += element.OUTPUT_QTY_EA;
              return {
                ...element,
                OCCURR_TIME: moment
                  .utc(element.OCCURR_TIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            }
          );
          //setSummaryInspect('Tổng Xuất: ' +  summaryOutput.toLocaleString('en-US') + 'EA');
          setPqcDataTable(loadeddata);
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
    generalQuery("traCNDB", {
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
          const loadeddata: CNDB_DATA[] = response.data.data.map(
            (element: CNDB_DATA, index: number) => {
              return {
                ...element,
                CNDB_DATE: moment.utc(element.CNDB_DATE).format("YYYY-MM-DD"),
                id: index,
              };
            }
          );
          setPqcDataTable(loadeddata);
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
    generalQuery("tradaofilm", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      FACTORY: factory,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: DAO_FILM_DATA[] = response.data.data.map(
            (element: DAO_FILM_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          setPqcDataTable(loadeddata);
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
  useEffect(() => {
    //setColumnDefinition(column_pqc3_data);
  }, []);
  return (
    <div className='trapqc'>
      <div className='tracuuDataPqc'>
        <div className='tracuuDataPQCform'>
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
                <b>Code ERP:</b>{" "}
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
                  placeholder='Ten Line QC'
                  value={empl_name}
                  onChange={(e) => setEmpl_Name(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Nhà máy:</b>
                <select
                  name='phanloai'
                  value={factory}
                  onChange={(e) => {
                    setFactory(e.target.value);
                  }}
                >
                  <option value='All'>All</option>
                  <option value='NM1'>NM1</option>
                  <option value='NM2'>NM2</option>
                </select>
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
              className='pqc1button'
              onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_pqc1_data);
                handletraInspectionInput();
              }}
            >
              PQC1-Setting
            </button>
            <button
              className='pqc3button'
              onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_pqc3_data);
                handletraInspectionOutput();
              }}
            >
              PQC3-Defect
            </button>
            <button
              className='daofilmbutton'
              onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_daofilm_data);
                handletraInspectionInOut();
              }}
            >
              Dao-film-TL
            </button>
            <button
              className='lichsucndbbutton'
              onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_cndb_data);
                handletraInspectionNG();
              }}
            >
              LS CNĐB
            </button>
          </div>
        </div>
        <div className='tracuuPQCTable'>
          {readyRender && (
            <DataGrid
              sx={{ fontSize: 12, flex: 1 }}
              components={{
                Toolbar: CustomToolbarPOTable,
                LoadingOverlay: LinearProgress,
              }}
              loading={isLoading}
              rowHeight={30}
              rows={pqcdatatable}
              columns={columnDefinition}
              rowsPerPageOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
              ]}
              editMode='row'
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default TRAPQC;
