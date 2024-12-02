import { Button } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode } from "../../../api/Api";
import "./TRAPQC.scss";
import {
  CNDB_DATA,
  DAO_FILM_DATA,
  PQC3_DATA,
  TRA_PQC1_DATA,
} from "../../../api/GlobalInterface";
import PATROL_COMPONENT from "../../sx/PATROL/PATROL_COMPONENT";
import AGTable from "../../../components/DataTable/AGTable";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
const TRAPQC = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [showhideupdatennds, setShowHideUpdateNNDS] = useState(false);
  const [currentNN, setCurrentNN] = useState("");
  const [currentDS, setCurrentDS] = useState("");
  const [currentDefectRow, setCurrentDefectRow] = useState<PQC3_DATA>({
    CUST_NAME_KD: '',
    DEFECT_AMOUNT: 0,
    DEFECT_IMAGE_LINK: '',
    DEFECT_PHENOMENON: '',
    DEFECT_QTY: 0,
    ERR_CODE: '',
    FACTORY: '',
    G_CODE: '',
    G_NAME: '',
    G_NAME_KD: '',
    INSPECT_QTY: 0,
    LINE_NO: '',
    LINEQC_PIC: '',
    OCCURR_TIME: '',
    PQC1_ID: 0,
    PQC3_ID: 0,
    PROCESS_LOT_NO: '',
    PROD_LAST_PRICE: 0,
    PROD_LEADER: '',
    PROD_PIC: '',
    PROD_REQUEST_DATE: '',
    PROD_REQUEST_NO: '',
    REMARK: '',
    WORST5: '',
    WORST5_MONTH: '',
    YEAR_WEEK: '',
    DOI_SACH: '',
    NG_NHAN: "",
    STATUS: ''
  });
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
  const column_TRA_PQC1_DATA = [
    { field: "PQC1_ID", headerName: "PQC1_ID", width: 80 },
    { field: "YEAR_WEEK", headerName: "YEAR_WEEK", width: 80 },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 120 },
    { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", width: 80 },
    { field: "PROD_REQUEST_QTY", headerName: "PROD_REQUEST_QTY", width: 80 },
    { field: "PROD_REQUEST_DATE", headerName: "PROD_REQUEST_DATE", width: 80 },
    { field: "PLAN_ID", headerName: "PLAN_ID", width: 80 },
    { field: "PROCESS_LOT_NO", headerName: "PROCESS_LOT_NO", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 120 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    { field: "DESCR", headerName: "DESCR", width: 120 },
    { field: "LINEQC_PIC", headerName: "LINEQC_PIC", width: 80 },
    { field: "PROD_PIC", headerName: "PROD_PIC", width: 80 },
    { field: "PROD_LEADER", headerName: "PROD_LEADER", width: 80 },
    { field: "LINE_NO", headerName: "LINE_NO", width: 80 },
    { field: "STEPS", headerName: "STEPS", width: 80 },
    { field: "CAVITY", headerName: "CAVITY", width: 80 },
    {
      field: "SETTING_OK_TIME",
      cellDataType: "text",
      headerName: "SETTING_OK_TIME",
      width: 180,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {moment
              .utc(params.data.SETTING_OK_TIME)
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
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>
              {params.data.SAMPLE_AMOUNT?.toLocaleString("en-US", {
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
    {
      field: "DEFECT_RATE",
      headerName: "DEFECT_RATE",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            {params.data.DEFECT_RATE?.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}
            %
          </span>
        );
      },
    },
    { field: "DEFECT_PHENOMENON", headerName: "DEFECT_PHENOMENON", width: 150 },
    {
      field: "INS_DATE",
      cellDataType: "text",
      headerName: "INS_DATE",
      width: 180,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {moment.utc(params.data.INS_DATE).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        );
      },
    },
    {
      field: "UPD_DATE",
      cellDataType: "text",
      headerName: "UPD_DATE",
      width: 180,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {moment.utc(params.data.UPD_DATE).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        );
      },
    },
    {
      field: "IMG_1",
      headerName: "IMG_1",
      width: 100,
      cellRenderer: (params: any) => {
        let href_link = `/lineqc/${params.data.PLAN_ID}_1.jpg`
        if (params.data.IMG_1 ?? false) {
          return (
            <span style={{ color: "blue" }}>
              <a target="_blank" rel="noopener noreferrer" href={href_link}>
                LINK
              </a>
            </span>
          );
        }
        else {
          return (
            <span style={{ color: "blue" }}>
              NO
            </span>
          );
        }
      },
    },
    {
      field: "IMG_2",
      headerName: "IMG_2",
      width: 100,
      cellRenderer: (params: any) => {
        let href_link = `/lineqc/${params.data.PLAN_ID}_2.jpg`
        if (params.data.IMG_2 ?? false) {
          return (
            <span style={{ color: "blue" }}>
              <a target="_blank" rel="noopener noreferrer" href={href_link}>
                LINK
              </a>
            </span>
          );
        }
        else {
          return (
            <span style={{ color: "blue" }}>
              NO
            </span>
          );
        }
      },
    },
    {
      field: "IMG_3",
      headerName: "IMG_3",
      width: 100,
      cellRenderer: (params: any) => {
        let href_link = `/lineqc/${params.data.PLAN_ID}_3.jpg`
        if (params.data.IMG_3 ?? false) {
          return (
            <span style={{ color: "blue" }}>
              <a target="_blank" rel="noopener noreferrer" href={href_link}>
                LINK
              </a>
            </span>
          );
        }
        else {
          return (
            <span style={{ color: "blue" }}>
              NO
            </span>
          );
        }
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
    { field: "G_NAME", headerName: "G_NAME", width: 120 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    { field: "DESCR", headerName: "DESCR", width: 120 },
    { field: "PROD_LAST_PRICE", headerName: "PROD_LAST_PRICE", width: 80 },
    { field: "LINEQC_PIC", headerName: "LINEQC_PIC", width: 80 },
    { field: "PROD_PIC", headerName: "PROD_PIC", width: 80 },
    { field: "PROD_LEADER", headerName: "PROD_LEADER", width: 80 },
    { field: "LINE_NO", headerName: "LINE_NO", width: 80 },
    {
      field: "OCCURR_TIME",
      cellDataType: "text",
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
      cellRenderer: (params: any) => {
        let href_link = "/pqc/PQC3_" + (params.data.PQC3_ID + 1) + ".png";
        return (
          <span style={{ color: "blue" }}>
            <a target="_blank" rel="noopener noreferrer" href={href_link}>
              LINK
            </a>
          </span>
        );
      },
    },
    { field: "REMARK", headerName: "REMARK", width: 120 },
    { field: "WORST5", headerName: "WORST5", width: 80 },
    { field: "WORST5_MONTH", headerName: "WORST5_MONTH", width: 80 },
    {
      field: "UPDATE_NNDS", headerName: "UPDATE_NNDS", width: 120, cellRenderer: (params: any) => {
        return (
          <button onClick={() => {
            setCurrentDefectRow(params.data);
            setShowHideUpdateNNDS(true)
            setCurrentDS(params.data.DOI_SACH);
            setCurrentNN(params.data.NG_NHAN);
          }
          }>Update NNDS</button>
        );
      },
    },
    { field: "NG_NHAN", headerName: "NG_NHAN", width: 80 },
    { field: "DOI_SACH", headerName: "DOI_SACH", width: 80 },
  ];
  const column_daofilm_data = [
    { field: "KNIFE_FILM_ID", headerName: "ID", width: 80 },
    { field: "FACTORY_NAME", headerName: "FACTORY", width: 80 },
    {
      field: "NGAYBANGIAO",
      headerName: "NGAYBANGIAO",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {moment.utc(params.data.NGAYBANGIAO).format("YYYY-MM-DD")}
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
      cellRenderer: (params: any) => {
        switch (params.data.LOAIBANGIAO_PDP) {
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
      cellRenderer: (params: any) => {
        switch (params.data.LOAIPHATHANH) {
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
    { field: "CNDB_DATE", cellDataType: "text", headerName: "CNDB_DATE", width: 120 },
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
      cellDataType: "text",
      headerName: "INS_DATE",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {moment.utc(params.data.INS_DATE).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        );
      },
    },
    {
      field: "APPROVAL_STATUS",
      headerName: "APPROVAL_STATUS",
      width: 120,
      cellRenderer: (params: any) => {
        if (params.data.APPROVAL_STATUS === "Y")
          return <span style={{ color: "green" }}>Phê Duyệt</span>;
        return <span style={{ color: "red" }}>Chưa duyệt</span>;
      },
    },
    { field: "APPROVAL_EMPL", headerName: "APPROVAL_EMPL", width: 120 },
    {
      field: "APPROVAL_DATE",
      headerName: "APPROVAL_DATE",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.APPROVAL_DATE !== null)
          return (
            <span style={{ color: "blue" }}>
              {moment
                .utc(params.data.APPROVAL_DATE)
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
    useState<Array<any>>(column_TRA_PQC1_DATA);
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
          const loadeddata: TRA_PQC1_DATA[] = response.data.data.map(
            (element: TRA_PQC1_DATA, index: number) => {
              //summaryInput += element.INPUT_QTY_EA;
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',

                PROD_DATETIME: moment
                  .utc(element.INS_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                OCCURR_TIME:
                  element.OCCURR_TIME !== null
                    ? moment
                      .utc(element.OCCURR_TIME)
                      .format("YYYY-MM-DD HH:mm:ss")
                    : "",
                INPUT_DATETIME: moment
                  .utc(element.UPD_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                DEFECT_RATE:
                  element.INSPECT_QTY !== null
                    ? ((element.DEFECT_QTY !== null ? element.DEFECT_QTY : 0) /
                      element.INSPECT_QTY) *
                    100
                    : "",
                id: index,
              };
            },
          );
          //setSummaryInspect('Tổng Nhập: ' +  summaryInput.toLocaleString('en-US') + 'EA');
          setPqcDataTable(loadeddata);
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
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',

                OCCURR_TIME: moment
                  .utc(element.OCCURR_TIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            },
          );
          //setSummaryInspect('Tổng Xuất: ' +  summaryOutput.toLocaleString('en-US') + 'EA');
          setPqcDataTable(loadeddata);
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
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
                CNDB_DATE: moment.utc(element.CNDB_DATE).format("YYYY-MM-DD"),
                id: index,
              };
            },
          );
          setPqcDataTable(loadeddata);
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
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
                id: index,
              };
            },
          );
          setPqcDataTable(loadeddata);
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
  const updateNNDS =()=> {    
    generalQuery("updatenndspqc", {
      PQC3_ID: currentDefectRow.PQC3_ID,
      NG_NHAN: currentNN,
      DOI_SACH: currentDS
    })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {         
        Swal.fire(
          "Thông báo",
          "Update thành công",
          "success",
        );
      } else {
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");          
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const pqcDataTableAG = useMemo(()=> {
    return (
      <AGTable
        toolbar={
          <div>
          </div>}
        columns={columnDefinition}
        data={pqcdatatable}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          //console.log(e.data)
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    )
  },[pqcdatatable,columnDefinition])
  
  useEffect(() => {
    //setColumnDefinition(column_pqc3_data);
  }, []);
  return (
    <div className="trapqc">
      <div className="tracuuDataPqc">
        <div className="tracuuDataPQCform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <div className="forminput" >
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
                  placeholder="Ten Line QC"
                  value={empl_name}
                  onChange={(e) => setEmpl_Name(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Nhà máy:</b>
                <select
                  name="phanloai"
                  value={factory}
                  onChange={(e) => {
                    setFactory(e.target.value);
                  }}
                >
                  <option value="All">All</option>
                  <option value="NM1">NM1</option>
                  <option value="NM2">NM2</option>
                </select>
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
            <div className="forminputcolumn">
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
          </div>
          <div className="formbutton">
            <div className="btgroup">
              <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#69b1f5f' }} onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_TRA_PQC1_DATA);
                handletraInspectionInput();
              }}>Setting</Button>
              <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#9ddd49', color: 'black' }} onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_pqc3_data);
                handletraInspectionOutput();
              }}>Defect</Button>
            </div>
            <div className="btgroup">
              <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f396fc' }} onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_daofilm_data);
                handletraInspectionInOut();
              }}>Dao-film</Button>
              <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f7ab7e' }} onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_cndb_data);
                handletraInspectionNG();
              }}>CNĐB</Button>
            </div>
          </div>
        </div>
        <div className="tracuuPQCTable">
          {pqcDataTableAG}
          {/* {readyRender && (
            <DataGrid
              sx={{ fontSize: 12, flex: 1 }}
              components={{
                Toolbar: CustomToolbarPOTable,
                
              }}
              loading={isLoading}
              rowHeight={30}
              rows={pqcdatatable}
              columns={columnDefinition}
              pageSizeOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
              ]}
              editMode="row"
            />
          )} */}
        </div>
      </div>
      {showhideupdatennds && <div className="updatenndsform">
        <span style={{ fontWeight: 'bold' }}>Form update nguyên nhân đối sách</span>
        <div className="inputbox">
          1. Hiện tượng (현상)
          <PATROL_COMPONENT data={{
            CUST_NAME_KD: currentDefectRow.CUST_NAME_KD,
            DEFECT: currentDefectRow.ERR_CODE + ':' + currentDefectRow.DEFECT_PHENOMENON,
            EQ: currentDefectRow.LINE_NO,
            FACTORY: currentDefectRow.FACTORY,
            G_NAME_KD: currentDefectRow.G_NAME_KD,
            INSPECT_QTY: currentDefectRow.INSPECT_QTY,
            INSPECT_NG: currentDefectRow.DEFECT_QTY,
            LINK: `/pqc/PQC3_${currentDefectRow.PQC3_ID + 1}.png`,
            TIME: currentDefectRow.OCCURR_TIME,
            EMPL_NO: currentDefectRow.LINEQC_PIC
          }} />
          2. Nguyên nhân (원인)
          <textarea rows={8} style={{ width: '100%' }} value={currentNN} onChange={(e)=> {setCurrentNN(e.target.value)}}></textarea>
          3. Đối sách (대책)
          <textarea rows={8} style={{ width: '100%' }} value={currentDS} onChange={(e)=> {setCurrentDS(e.target.value)}}></textarea>
        </div>
        <div className="buttondiv">
          <button onClick={() => {
            updateNNDS();
          }}>Update</button>
          <button onClick={() => {
            setShowHideUpdateNNDS(false);
            setCurrentDS('');
            setCurrentNN('');
            setCurrentDefectRow({
              CUST_NAME_KD: '',
              DEFECT_AMOUNT: 0,
              DEFECT_IMAGE_LINK: '',
              DEFECT_PHENOMENON: '',
              DEFECT_QTY: 0,
              ERR_CODE: '',
              FACTORY: '',
              G_CODE: '',
              G_NAME: '',
              G_NAME_KD: '',
              INSPECT_QTY: 0,
              LINE_NO: '',
              LINEQC_PIC: '',
              OCCURR_TIME: '',
              PQC1_ID: 0,
              PQC3_ID: 0,
              PROCESS_LOT_NO: '',
              PROD_LAST_PRICE: 0,
              PROD_LEADER: '',
              PROD_PIC: '',
              PROD_REQUEST_DATE: '',
              PROD_REQUEST_NO: '',
              REMARK: '',
              WORST5: '',
              WORST5_MONTH: '',
              YEAR_WEEK: '',
              DOI_SACH: '',
              NG_NHAN: "",
              STATUS: ''
            });
          }}>Close</button>
        </div>
      </div>}
    </div>
  );
};
export default TRAPQC;
