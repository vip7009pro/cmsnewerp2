import { IconButton, LinearProgress } from "@mui/material";
import {
  DataGrid,
  GridSelectionModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import moment from "moment";
import { useContext, useEffect, useState, useTransition } from "react";
import { FcSearch } from "react-icons/fc";
import { AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { generalQuery, getAuditMode } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { checkBP, SaveExcel } from "../../../api/GlobalFunction";
import { MdOutlineDelete, MdOutlinePivotTableChart } from "react-icons/md";
import "./PlanManager.scss";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotTable from "../../../components/PivotChart/PivotChart";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { TbLogout } from "react-icons/tb";
import { PlanTableData, UserData } from "../../../api/GlobalInterface";

const PlanManager = () => {
  const [showhidesearchdiv, setShowHideSearchDiv] = useState(true);
  const [selection, setSelection] = useState<any>({
    trapo: true,
    thempohangloat: false,
    them1po: false,
    them1invoice: false,
    testinvoicetable: false,
  });
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [uploadExcelJson, setUploadExcelJSon] = useState<Array<any>>([]);
  const [isLoading, setisLoading] = useState(false);
  const [column_excel, setColumn_Excel] = useState<Array<any>>([]);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [empl_name, setEmpl_Name] = useState("");
  const [cust_name, setCust_Name] = useState("");
  const [prod_type, setProdType] = useState("");
  const [id, setID] = useState("");
  const [alltime, setAllTime] = useState(true);
  const [justpobalance, setJustPOBalance] = useState(true);

  const [po_no, setPo_No] = useState("");
  const [material, setMaterial] = useState("");
  const [over, setOver] = useState("");
  const [invoice_no, setInvoice_No] = useState("");
  const [plandatatable, setPlanDataTable] = useState<Array<PlanTableData>>([]);
  const [plandatatablefilter, setPlanDataTableFilter] = useState<
    Array<PlanTableData>
  >([]);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);

  const column_plantable = [
    { field: "PLAN_ID", headerName: "PLAN_ID", width: 80 },
    { field: "EMPL_NAME", headerName: "EMPL_NAME", width: 180 },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 120 },
    { field: "G_CODE", headerName: "G_CODE", width: 90 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.G_NAME}</b>
          </span>
        );
      },
    },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 100 },
    {
      field: "PROD_MAIN_MATERIAL",
      headerName: "PROD_MAIN_MATERIAL",
      width: 120,
    },
    { field: "PLAN_DATE", type: "date", headerName: "PLAN_DATE", width: 120 },
    {
      field: "D1",
      type: "number",
      headerName: "D1",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D1.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D2",
      type: "number",
      headerName: "D2",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D2.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D3",
      type: "number",
      headerName: "D3",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D3.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D4",
      type: "number",
      headerName: "D4",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D4.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D5",
      type: "number",
      headerName: "D5",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D5.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D6",
      type: "number",
      headerName: "D6",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D6.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D7",
      type: "number",
      headerName: "D7",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D7.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D8",
      type: "number",
      headerName: "D8",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D8.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D9",
      type: "number",
      headerName: "D9",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D9.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D10",
      type: "number",
      headerName: "D10",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D10.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D11",
      type: "number",
      headerName: "D11",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D11.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D12",
      type: "number",
      headerName: "D12",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D12.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D13",
      type: "number",
      headerName: "D13",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D13.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D14",
      type: "number",
      headerName: "D14",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D14.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D15",
      type: "number",
      headerName: "D15",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D15.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "REMARK", headerName: "REMARK", width: 120 },
  ];

  const column_excelplan2 = [
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 120 },
    { field: "CUST_CD", headerName: "CUST_CD", width: 120 },
    { field: "G_CODE", headerName: "G_CODE", width: 120 },
    { field: "PLAN_DATE", type: "date", headerName: "PLAN_DATE", width: 120 },
    {
      field: "D1",
      type: "number",
      headerName: "D1",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D1.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D2",
      type: "number",
      headerName: "D2",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D2.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D3",
      type: "number",
      headerName: "D3",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D3.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D4",
      type: "number",
      headerName: "D4",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D4.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D5",
      type: "number",
      headerName: "D5",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D5.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D6",
      type: "number",
      headerName: "D6",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D6.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D7",
      type: "number",
      headerName: "D7",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D7.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D8",
      type: "number",
      headerName: "D8",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D8.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D9",
      type: "number",
      headerName: "D9",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D9.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D10",
      type: "number",
      headerName: "D10",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D10.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D11",
      type: "number",
      headerName: "D11",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D11.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D12",
      type: "number",
      headerName: "D12",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D12.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D13",
      type: "number",
      headerName: "D13",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D13.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D14",
      type: "number",
      headerName: "D14",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D14.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D15",
      type: "number",
      headerName: "D15",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.D15.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "REMARK", headerName: "REMARK", width: 120 },
    {
      field: "CHECKSTATUS",
      headerName: "CHECKSTATUS",
      width: 200,
      renderCell: (params: any) => {
        if (params.row.CHECKSTATUS.slice(0, 2) === "OK")
          return (
            <span style={{ color: "green" }}>
              <b>{params.row.CHECKSTATUS}</b>
            </span>
          );
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.CHECKSTATUS}</b>
          </span>
        );
      },
    },
  ];
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <button
          className="saveexcelbutton"
          onClick={() => {
            SaveExcel(uploadExcelJson, "Uploaded Plan");
          }}
        >
          Save Excel
        </button>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }
  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            setShowHideSearchDiv(!showhidesearchdiv);
          }}
        >
          <TbLogout color="green" size={15} />
          Show/Hide
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            SaveExcel(plandatatable, "Plan Table");
          }}
        >
          <AiFillFileExcel color="green" size={15} />
          SAVE
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            /*  checkBP(
              userData?.EMPL_NO,
              userData?.MAINDEPTNAME,
              ["KD"],
              handleConfirmDeletePlan
            ); */
            checkBP(
              userData,
              ["KD"],
              ["ALL"],
              ["ALL"],
              handleConfirmDeletePlan,
            );
            //handleConfirmDeletePlan();
          }}
        >
          <MdOutlineDelete color="red" size={15} />
          XÓA PLAN
        </IconButton>
        <GridToolbarQuickFilter />
        <IconButton
          className="buttonIcon"
          onClick={() => {
            setShowHidePivotTable(!showhidePivotTable);
          }}
        >
          <MdOutlinePivotTableChart color="#ff33bb" size={15} />
          Pivot
        </IconButton>
      </GridToolbarContainer>
    );
  }
  const readUploadFile = (e: any) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any = XLSX.utils.sheet_to_json(worksheet);
        const keys = Object.keys(json[0]);
        let uploadexcelcolumn = keys.map((element, index) => {
          return {
            field: element,
            headerName: element,
            width: 150,
          };
        });
        uploadexcelcolumn.push({
          field: "CHECKSTATUS",
          headerName: "CHECKSTATUS",
          width: 350,
        });
        setColumn_Excel(uploadexcelcolumn);
        setUploadExcelJSon(
          json.map((element: any, index: number) => {
            return {
              ...element,
              id: index,
              CHECKSTATUS: "Waiting",
              D1:
                element.D1 === undefined || element.D1 === "" ? 0 : element.D1,
              D2:
                element.D2 === undefined || element.D2 === "" ? 0 : element.D2,
              D3:
                element.D3 === undefined || element.D3 === "" ? 0 : element.D3,
              D4:
                element.D4 === undefined || element.D4 === "" ? 0 : element.D4,
              D5:
                element.D5 === undefined || element.D5 === "" ? 0 : element.D5,
              D6:
                element.D6 === undefined || element.D6 === "" ? 0 : element.D6,
              D7:
                element.D7 === undefined || element.D7 === "" ? 0 : element.D7,
              D8:
                element.D8 === undefined || element.D8 === "" ? 0 : element.D8,
              D9:
                element.D9 === undefined || element.D9 === "" ? 0 : element.D9,
              D10:
                element.D10 === undefined || element.D10 === ""
                  ? 0
                  : element.D10,
              D11:
                element.D11 === undefined || element.D11 === ""
                  ? 0
                  : element.D11,
              D12:
                element.D12 === undefined || element.D12 === ""
                  ? 0
                  : element.D12,
              D13:
                element.D13 === undefined || element.D13 === ""
                  ? 0
                  : element.D13,
              D14:
                element.D14 === undefined || element.D14 === ""
                  ? 0
                  : element.D14,
              D15:
                element.D15 === undefined || element.D15 === ""
                  ? 0
                  : element.D15,
            };
          }),
        );
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  const handletraPlan = () => {
    setisLoading(true);
    generalQuery("traPlanDataFull", {
      alltime: alltime,
      justPoBalance: justpobalance,
      start_date: fromdate,
      end_date: todate,
      cust_name: cust_name,
      codeCMS: codeCMS,
      codeKD: codeKD,
      prod_type: prod_type,
      empl_name: empl_name,
      po_no: po_no,
      over: over,
      id: id,
      material: material,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: PlanTableData[] = response.data.data.map(
            (element: PlanTableData, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                PLAN_DATE: element.PLAN_DATE.slice(0, 10),
                D1: element.D1 === null ? 0 : element.D1,
                D2: element.D2 === null ? 0 : element.D2,
                D3: element.D3 === null ? 0 : element.D3,
                D4: element.D4 === null ? 0 : element.D4,
                D5: element.D5 === null ? 0 : element.D5,
                D6: element.D6 === null ? 0 : element.D6,
                D7: element.D7 === null ? 0 : element.D7,
                D8: element.D8 === null ? 0 : element.D8,
                D9: element.D9 === null ? 0 : element.D9,
                D10: element.D10 === null ? 0 : element.D10,
                D11: element.D11 === null ? 0 : element.D11,
                D12: element.D12 === null ? 0 : element.D12,
                D13: element.D13 === null ? 0 : element.D13,
                D14: element.D14 === null ? 0 : element.D14,
                D15: element.D15 === null ? 0 : element.D15,
              };
            },
          );
          setPlanDataTable(loadeddata);
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
  const handle_checkPlanHangLoat = async () => {
    setisLoading(true);
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      await generalQuery("checkPlanExist", {
        G_CODE: uploadExcelJson[i].G_CODE,
        CUST_CD: uploadExcelJson[i].CUST_CD,
        PLAN_DATE: uploadExcelJson[i].PLAN_DATE,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            err_code = 1; //tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PLAN";
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      let now = moment();
      let plandate = moment(uploadExcelJson[i].PLAN_DATE);
      if (now < plandate) {
        err_code = 2;
        //tempjson[i].CHECKSTATUS = "NG: Ngày PLAN không được trước ngày hôm nay";
      } else {
        //tempjson[i].CHECKSTATUS = "OK";
      }
      await generalQuery("checkGCodeVer", {
        G_CODE: uploadExcelJson[i].G_CODE,
      })
        .then((response) => {
          //console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            //console.log(response.data.data);
            if (response.data.data[0].USE_YN === "Y") {
              //tempjson[i].CHECKSTATUS = "OK";
            } else {
              //tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
              err_code = 3;
            }
          } else {
            //tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
            err_code = 4;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      if (err_code === 0) {
        tempjson[i].CHECKSTATUS = "OK";
      } else if (err_code === 1) {
        tempjson[i].CHECKSTATUS = "NG:Plan đã tồn tại";
      } else if (err_code === 2) {
        tempjson[i].CHECKSTATUS = "NG: Ngày Plan không được sau ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      } else if (err_code === 5) {
        tempjson[i].CHECKSTATUS = "NG: Giao hàng nhiều hơn PO";
      }
    }
    setisLoading(false);
    Swal.fire("Thông báo", "Đã hoàn thành check Plan hàng loạt", "success");
    setUploadExcelJSon(tempjson);
  };
  const handle_upPlanHangLoat = async () => {
    setisLoading(true);
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      await generalQuery("checkPlanExist", {
        G_CODE: uploadExcelJson[i].G_CODE,
        CUST_CD: uploadExcelJson[i].CUST_CD,
        PLAN_DATE: uploadExcelJson[i].PLAN_DATE,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            err_code = 1; //tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PLAN";
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      let now = moment();
      let plandate = moment(uploadExcelJson[i].PLAN_DATE);
      if (now < plandate) {
        err_code = 2;
        //tempjson[i].CHECKSTATUS = "NG: Ngày PLAN không được trước ngày hôm nay";
      } else {
        //tempjson[i].CHECKSTATUS = "OK";
      }
      await generalQuery("checkGCodeVer", {
        G_CODE: uploadExcelJson[i].G_CODE,
      })
        .then((response) => {
          //console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            //console.log(response.data.data);
            if (response.data.data[0].USE_YN === "Y") {
              //tempjson[i].CHECKSTATUS = "OK";
            } else {
              //tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
              err_code = 3;
            }
          } else {
            //tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
            err_code = 4;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      if (err_code === 0) {
        await generalQuery("insert_plan", {
          REMARK: uploadExcelJson[i].REMARK,
          G_CODE: uploadExcelJson[i].G_CODE,
          CUST_CD: uploadExcelJson[i].CUST_CD,
          PLAN_DATE: uploadExcelJson[i].PLAN_DATE,
          EMPL_NO: userData?.EMPL_NO,
          D1: uploadExcelJson[i].D1,
          D2: uploadExcelJson[i].D2,
          D3: uploadExcelJson[i].D3,
          D4: uploadExcelJson[i].D4,
          D5: uploadExcelJson[i].D5,
          D6: uploadExcelJson[i].D6,
          D7: uploadExcelJson[i].D7,
          D8: uploadExcelJson[i].D8,
          D9: uploadExcelJson[i].D9,
          D10: uploadExcelJson[i].D10,
          D11: uploadExcelJson[i].D11,
          D12: uploadExcelJson[i].D12,
          D13: uploadExcelJson[i].D13,
          D14: uploadExcelJson[i].D14,
          D15: uploadExcelJson[i].D15,
        })
          .then((response) => {
            console.log(response.data.tk_status);
            if (response.data.tk_status !== "NG") {
              tempjson[i].CHECKSTATUS = "OK";
            } else {
              err_code = 5;
              tempjson[i].CHECKSTATUS = "NG: Lỗi SQL: " + response.data.message;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (err_code === 1) {
        tempjson[i].CHECKSTATUS = "NG:Plan đã tồn tại";
      } else if (err_code === 2) {
        tempjson[i].CHECKSTATUS = "NG: Ngày Plan không được sau ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      } else if (err_code === 5) {
        tempjson[i].CHECKSTATUS = "NG: Giao hàng nhiều hơn PO";
      }
    }
    setisLoading(false);
    Swal.fire("Thông báo", "Đã hoàn thành check Plan hàng loạt", "success");
    setUploadExcelJSon(tempjson);
  };

  const confirmUpPlanHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn thêm Plan hàng loạt ?",
      text: "Thêm rồi mà sai, sửa là hơi vất đấy",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn thêm!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành thêm", "Đang thêm Plan hàng loạt", "success");
        handle_upPlanHangLoat();
      }
    });
  };
  const confirmCheckPlanHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn check Plan hàng loạt ?",
      text: "Sẽ bắt đầu check Plan hàng loạt",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn check!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành check", "Đang check Plan hàng loạt", "success");
        handle_checkPlanHangLoat();
      }
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
        testinvoicetable: false,
      });
    } else if (choose === 2) {
      setSelection({
        ...selection,
        trapo: false,
        thempohangloat: true,
        them1po: false,
        them1invoice: false,
        testinvoicetable: false,
      });
    } else if (choose === 3) {
      setSelection({
        ...selection,
        trapo: false,
        thempohangloat: false,
        them1po: false,
        them1invoice: false,
        testinvoicetable: true,
      });
    }
  };

  const handlePlanSelectionforUpdate = (ids: GridSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = plandatatable.filter((element: any) =>
      selectedID.has(element.PLAN_ID),
    );
    if (datafilter.length > 0) {
      setPlanDataTableFilter(datafilter);
    } else {
      setPlanDataTableFilter([]);
    }
  };

  const deletePlan = async () => {
    if (plandatatablefilter.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < plandatatablefilter.length; i++) {
        if (plandatatablefilter[i].EMPL_NO === userData?.EMPL_NO) {
          await generalQuery("delete_plan", {
            PLAN_ID: plandatatablefilter[i].PLAN_ID,
          })
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
                //Swal.fire("Thông báo", "Delete Po thành công", "success");
              } else {
                //Swal.fire("Thông báo", "Update PO thất bại: " +response.data.message , "error");
                err_code = true;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
      if (!err_code) {
        Swal.fire(
          "Thông báo",
          "Xóa Plan thành công (chỉ Plan của người đăng nhập)!",
          "success",
        );
      } else {
        Swal.fire("Thông báo", "Có lỗi SQL!", "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 Plan để xóa !", "error");
    }
  };
  const handleConfirmDeletePlan = () => {
    Swal.fire({
      title: "Chắc chắn muốn xóa Plan đã chọn ?",
      text: "Sẽ chỉ xóa Plan do bạn up lên",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Xóa", "Đang Xóa Plan hàng loạt", "success");
        /*  checkBP(userData?.EMPL_NO, userData?.MAINDEPTNAME, ["KD"], deletePlan); */
        checkBP(userData, ["KD"], ["ALL"], ["ALL"], deletePlan);
        //deletePlan();
      }
    });
  };
  const dataSource = new PivotGridDataSource({
    fields: [
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
        caption: "EMPL_NO",
        width: 80,
        dataField: "EMPL_NO",
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
        caption: "PROD_MAIN_MATERIAL",
        width: 80,
        dataField: "PROD_MAIN_MATERIAL",
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
        caption: "PLAN_DATE",
        width: 80,
        dataField: "PLAN_DATE",
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
        caption: "D1",
        width: 80,
        dataField: "D1",
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
        caption: "D2",
        width: 80,
        dataField: "D2",
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
        caption: "D3",
        width: 80,
        dataField: "D3",
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
        caption: "D4",
        width: 80,
        dataField: "D4",
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
        caption: "D5",
        width: 80,
        dataField: "D5",
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
        caption: "D6",
        width: 80,
        dataField: "D6",
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
        caption: "D7",
        width: 80,
        dataField: "D7",
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
        caption: "D8",
        width: 80,
        dataField: "D8",
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
        caption: "",
        width: 80,
        dataField: "",
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
    store: plandatatable,
  });
  useEffect(() => { }, []);
  return (
    <div className="planmanager">
      <div className="mininavbar">
        <div
          className="mininavitem"
          onClick={() => setNav(1)}
          style={{
            backgroundColor: selection.trapo === true ? "#02c712" : "#abc9ae",
            color: selection.trapo === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">Tra PLAN</span>
        </div>
        <div
          className="mininavitem"
          onClick={() =>
            /* checkBP(userData?.EMPL_NO, userData?.MAINDEPTNAME, ["KD"], () => {
              setNav(2);
            }) */
            checkBP(userData, ["KD"], ["ALL"], ["ALL"], () => {
              setNav(2);
            })
          }
          style={{
            backgroundColor:
              selection.thempohangloat === true ? "#02c712" : "#abc9ae",
            color: selection.thempohangloat === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">Thêm PLAN</span>
        </div>
      </div>
      {selection.thempohangloat && (
        <div className="newplan">
          <div className="batchnewplan">
            <h3>Thêm Plan Hàng Loạt</h3>
            <form className="formupload">
              <label htmlFor="upload">
                <b>Chọn file Excel: </b>
                <input
                  className="selectfilebutton"
                  type="file"
                  name="upload"
                  id="upload"
                  onChange={(e: any) => {
                    readUploadFile(e);
                  }}
                />
              </label>
              <div
                className="checkpobutton"
                onClick={(e) => {
                  e.preventDefault();
                  confirmCheckPlanHangLoat();
                }}
              >
                Check Plan
              </div>
              <div
                className="uppobutton"
                onClick={(e) => {
                  e.preventDefault();
                  confirmUpPlanHangLoat();
                }}
              >
                Up Plan
              </div>
            </form>
            <div className="insertPlanTable">
              {true && (
                <DataGrid
                  sx={{ fontSize: "0.7rem" }}
                  components={{
                    Toolbar: CustomToolbar,
                    LoadingOverlay: LinearProgress,
                  }}
                  loading={isLoading}
                  rowHeight={35}
                  rows={uploadExcelJson}
                  columns={column_excelplan2}
                  rowsPerPageOptions={[
                    5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
                  ]}
                  editMode="row"
                />
              )}
            </div>
          </div>
        </div>
      )}
      {selection.trapo && (
        <div className="tracuuPlan">
          {showhidesearchdiv && (
            <div className="tracuuPlanform">
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
                      onChange={(e) => setCust_Name(e.target.value)}
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
                    <b>PO NO:</b>{" "}
                    <input
                      type="text"
                      placeholder="123abc"
                      value={po_no}
                      onChange={(e) => setPo_No(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Vật liệu:</b>{" "}
                    <input
                      type="text"
                      placeholder="SJ-203020HC"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                    ></input>
                  </label>
                </div>
                <div className="forminputcolumn">
                  <label>
                    <b>Over/OK:</b>{" "}
                    <input
                      type="text"
                      placeholder="OVER"
                      value={over}
                      onChange={(e) => setOver(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Invoice No:</b>{" "}
                    <input
                      type="text"
                      placeholder="số invoice"
                      value={invoice_no}
                      onChange={(e) => setInvoice_No(e.target.value)}
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
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    handletraPlan();
                  }}
                >
                  <FcSearch color="green" size={30} />
                  Search
                </IconButton>
              </div>
            </div>
          )}
          <div className="tracuuPlanTable">
            <DataGrid
              sx={{ fontSize: "0.7rem" }}
              components={{
                Toolbar: CustomToolbarPOTable,
                LoadingOverlay: LinearProgress,
              }}
              loading={isLoading}
              rowHeight={30}
              rows={plandatatable}
              columns={column_plantable}
              rowsPerPageOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
              ]}
              editMode="row"
              getRowId={(row) => row.PLAN_ID}
              checkboxSelection
              disableSelectionOnClick
              onSelectionModelChange={(ids) => {
                handlePlanSelectionforUpdate(ids);
              }}
            />
          </div>
        </div>
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
          <PivotTable datasource={dataSource} tableID="invoicetablepivot" />
        </div>
      )}
    </div>
  );
};
export default PlanManager;
