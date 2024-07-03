import {
  Autocomplete,
  IconButton,
  LinearProgress,
  TextField,
  createFilterOptions,
} from "@mui/material";
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
import React, { useContext, useEffect, useState, useTransition } from "react";
import { FcSearch } from "react-icons/fc";
import {
  AiFillCloseCircle,
  AiFillEdit,
  AiFillFileAdd,
  AiFillFileExcel,
} from "react-icons/ai";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { generalQuery, getAuditMode, getGlobalSetting } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { checkBP, SaveExcel } from "../../../api/GlobalFunction";
import { MdOutlineDelete, MdOutlinePivotTableChart } from "react-icons/md";
import "./InvoiceManager.scss";
import { FaFileInvoiceDollar } from "react-icons/fa";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotTable from "../../../components/PivotChart/PivotChart";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { TbLogout } from "react-icons/tb";
import {
  CodeListData,
  CustomerListData,
  InvoiceSummaryData,
  InvoiceTableData,
  UserData,
  WEB_SETTING_DATA,
} from "../../../api/GlobalInterface";
const InvoiceManager2 = () => {
  const [showhidesearchdiv, setShowHideSearchDiv] = useState(true);
  const [isPending, startTransition] = useTransition();
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
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>();
  const [selectedCust_CD, setSelectedCust_CD] =
    useState<CustomerListData | null>();
  const [newpodate, setNewPoDate] = useState(moment().format("YYYY-MM-DD"));
  const [newrddate, setNewRdDate] = useState(moment().format("YYYY-MM-DD"));
  const [newpono, setNewPoNo] = useState("");
  const [newpoqty, setNewPoQty] = useState("");
  const [newpoprice, setNewPoPrice] = useState("");
  const [newporemark, setNewPoRemark] = useState("");
  const [newinvoiceQTY, setNewInvoiceQty] = useState<number>(0);
  const [newinvoicedate, setNewInvoiceDate] = useState(
    moment().format("YYYY-MM-DD"),
  );
  const [newinvoiceRemark, setNewInvoiceRemark] = useState("");
  const [invoiceSummary, setInvoiceSummary] = useState<InvoiceSummaryData>({
    total_po_qty: 0,
    total_delivered_qty: 0,
    total_pobalance_qty: 0,
    total_po_amount: 0,
    total_delivered_amount: 0,
    total_pobalance_amount: 0,
  });
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const [po_no, setPo_No] = useState("");
  const [material, setMaterial] = useState("");
  const [over, setOver] = useState("");
  const [invoice_no, setInvoice_No] = useState("");
  const [invoicedatatable, setInvoiceDataTable] = useState<
    Array<InvoiceTableData>
  >([]);
  const [invoicedatatablefilter, setInvoiceDataTableFilter] = useState<
    Array<InvoiceTableData>
  >([]);
  const [selectedID, setSelectedID] = useState<number | null>();
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const column_invoicetable = [
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 110 },
    { field: "EMPL_NAME", headerName: "EMPL_NAME", width: 130 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      flex: 1,
      minWidth: 180,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.G_NAME}</b>
          </span>
        );
      },
    },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    { field: "PO_NO", headerName: "PO_NO", width: 100 },
    {
      field: "DELIVERY_DATE",
      type: "date",
      headerName: "DELIVERY_DATE",
      width: 120,
    },
    {
      field: "DELIVERY_QTY",
      type: "number",
      headerName: "DELIVERY_QTY",
      width: 100,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.DELIVERY_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "PROD_PRICE",
      type: "number",
      headerName: "PROD_PRICE",
      width: 100,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>
              {params.row.PROD_PRICE.toLocaleString("en-US", {
                style: "decimal",
                maximumFractionDigits: 8,
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "DELIVERED_AMOUNT",
      type: "number",
      headerName: "DELIVERED_AMOUNT",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.row.DELIVERED_AMOUNT.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 90 },
    { field: "PROD_MODEL", headerName: "PROD_MODEL", width: 120 },
    { field: "PROD_PROJECT", headerName: "PROD_PROJECT", width: 120 },
    {
      field: "PROD_MAIN_MATERIAL",
      headerName: "PROD_MAIN_MATERIAL",
      width: 120,
    },
    { field: "YEARNUM", type: "number", headerName: "YEARNUM", width: 80 },
    { field: "WEEKNUM", type: "number", headerName: "WEEKNUM", width: 80 },
    {
      field: "INVOICE_NO",
      type: "number",
      headerName: "INVOICE_NO",
      width: 120,
    },
    { field: "DELIVERY_ID", headerName: "DELIVERY_ID", width: 90 },
    { field: "REMARK", headerName: "REMARK", width: 120 },
  ];
  const column_excel2 = [
    { field: "CUST_CD", headerName: "CUST_CD", width: 120 },
    { field: "G_CODE", headerName: "G_CODE", width: 120 },
    { field: "PO_NO", type: "number", headerName: "PO_NO", width: 120 },
    {
      field: "PO_QTY",
      type: "number",
      headerName: "PO_QTY",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.PO_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "PO_DATE", type: "date", headerName: "PO_DATE", width: 200 },
    { field: "RD_DATE", type: "date", headerName: "RD_DATE", width: 200 },
    {
      field: "PROD_PRICE",
      type: "number",
      headerName: "PROD_PRICE",
      width: 200,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>
              {params.row.PROD_PRICE.toLocaleString("en-US", {
                style: "decimal",
                maximumFractionDigits: 8,
              })}
            </b>
          </span>
        );
      },
    },
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
  const column_excelinvoice2 = [
    { field: "CUST_CD", headerName: "CUST_CD", width: 120 },
    { field: "G_CODE", headerName: "G_CODE", width: 120 },
    { field: "PO_NO", headerName: "PO_NO", width: 120 },
    {
      field: "DELIVERY_QTY",
      type: "number",
      headerName: "DELIVERY_QTY",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.DELIVERY_QTY}</b>
          </span>
        );
      },
    },
    {
      field: "DELIVERY_DATE",
      type: "date",
      headerName: "DELIVERY_DATE",
      width: 200,
    },
    {
      field: "INVOICE_NO",
      type: "string",
      headerName: "INVOICE_NO",
      width: 200,
    },
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
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handletraInvoice();
    }
  };
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <button
          className="saveexcelbutton"
          onClick={() => {
            SaveExcel(uploadExcelJson, "Uploaded PO");
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
            SaveExcel(invoicedatatable, "Invoice Table");
          }}
        >
          <AiFillFileExcel color="green" size={15} />
          SAVE
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            /*  checkBP(userData?.EMPL_NO, userData?.MAINDEPTNAME, ["KD"], () => {
              setSelection({
                ...selection,
                trapo: true,
                thempohangloat: false,
                them1po: false,
                them1invoice: true,
              });
              clearInvoiceform();
            }); */
            checkBP(userData, ["KD"], ["ALL"], ["ALL"], () => {
              setSelection({
                ...selection,
                trapo: true,
                thempohangloat: false,
                them1po: false,
                them1invoice: true,
              });
              clearInvoiceform();
            });
          }}
        >
          <AiFillFileAdd color="blue" size={15} />
          NEW INV
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            /* checkBP(
              userData?.EMPL_NO,
              userData?.MAINDEPTNAME,
              ["KD"],
              handle_fillsuaformInvoice
            ); */
            checkBP(
              userData,
              ["KD"],
              ["ALL"],
              ["ALL"],
              handle_fillsuaformInvoice,
            );
            //handle_fillsuaformInvoice();
          }}
        >
          <FaFileInvoiceDollar color="lightgreen" size={15} />
          SỬA INV
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            /*  checkBP(
              userData?.EMPL_NO,
              userData?.MAINDEPTNAME,
              ["KD"],
              handleConfirmDeleteInvoice
            ); */
            checkBP(
              userData,
              ["KD"],
              ["ALL"],
              ["ALL"],
              handleConfirmDeleteInvoice,
            );
            //handleConfirmDeleteInvoice();
          }}
        >
          <MdOutlineDelete color="red" size={15} />
          XÓA INV
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
            return { ...element, id: index, CHECKSTATUS: "Waiting" };
          }),
        );
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  const handletraInvoice = () => {
    setisLoading(true);
    generalQuery("traInvoiceDataFull", {
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
          const loadeddata: InvoiceTableData[] = response.data.data.map(
            (element: InvoiceTableData, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0 ? element?.G_NAME : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME : 'TEM_NOI_BO',
                G_NAME_KD: getAuditMode() == 0 ? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                DELIVERY_DATE: element.DELIVERY_DATE.slice(0, 10),
              };
            },
          );
          let invoice_summary_temp: InvoiceSummaryData = {
            total_po_qty: 0,
            total_delivered_qty: 0,
            total_pobalance_qty: 0,
            total_po_amount: 0,
            total_delivered_amount: 0,
            total_pobalance_amount: 0,
          };
          for (let i = 0; i < loadeddata.length; i++) {
            invoice_summary_temp.total_delivered_qty +=
              loadeddata[i].DELIVERY_QTY;
            invoice_summary_temp.total_delivered_amount +=
              loadeddata[i].DELIVERED_AMOUNT;
          }
          setInvoiceSummary(invoice_summary_temp);
          setInvoiceDataTable(loadeddata);
          setisLoading(false);
          setShowHideSearchDiv(false);
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
  const handle_checkInvoiceHangLoat = async () => {
    setisLoading(true);
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      await generalQuery("checkPOExist", {
        G_CODE: uploadExcelJson[i].G_CODE,
        CUST_CD: uploadExcelJson[i].CUST_CD,
        PO_NO: uploadExcelJson[i].PO_NO,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            if (
              uploadExcelJson[i].DELIVERY_QTY > response.data.data[0].PO_BALANCE
            ) {
              err_code = 5; //giao hang nhieu hon PO balance
            }
          } else {
            //tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
            err_code = 1;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      let now = moment();
      let deliverydate = moment(uploadExcelJson[i].DELIVERY_DATE);
      if (now < deliverydate) {
        err_code = 2;
        //tempjson[i].CHECKSTATUS = "NG: Ngày PO không được trước ngày hôm nay";
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
      await generalQuery("checkcustcodeponoPOBALANCE", {
        G_CODE: selectedCode?.G_CODE,
        CUST_CD: selectedCust_CD?.CUST_CD,
        PO_NO: newpono,
      })
        .then((response) => {
          console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            let tem_this_po_balance: number = response.data.data[0].PO_BALANCE;
            if (tem_this_po_balance < newinvoiceQTY) err_code = 5;
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      if (err_code === 0) {
        tempjson[i].CHECKSTATUS = "OK";
      } else if (err_code === 1) {
        tempjson[i].CHECKSTATUS = "NG: Không tồn tại PO";
      } else if (err_code === 2) {
        tempjson[i].CHECKSTATUS =
          "NG: Ngày Giao hàng không được trước ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      } else if (err_code === 5) {
        tempjson[i].CHECKSTATUS = "NG: Giao hàng nhiều hơn PO";
      }
    }
    setisLoading(false);
    Swal.fire("Thông báo", "Đã hoàn thành check Invoice hàng loạt", "success");
    setUploadExcelJSon(tempjson);
  };
  const handle_upInvoiceHangLoat = async () => {
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      await generalQuery("checkPOExist", {
        G_CODE: uploadExcelJson[i].G_CODE,
        CUST_CD: uploadExcelJson[i].CUST_CD,
        PO_NO: uploadExcelJson[i].PO_NO,
      })
        .then((response) => {
          console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            if (
              uploadExcelJson[i].DELIVERY_QTY > response.data.data[0].PO_BALANCE
            ) {
              err_code = 5; //giao hang nhieu hon PO balance
            }
            //tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
          } else {
            err_code = 1;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      let now = moment();
      let deliverydate = moment(uploadExcelJson[i].DELIVERY_DATE);
      if (now < deliverydate) {
        err_code = 2;
        //tempjson[i].CHECKSTATUS = "NG: Ngày PO không được trước ngày hôm nay";
      } else {
        //tempjson[i].CHECKSTATUS = "OK";
      }
      await generalQuery("checkGCodeVer", {
        G_CODE: uploadExcelJson[i].G_CODE,
      })
        .then((response) => {
          console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            console.log(response.data.data);
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
      await generalQuery("checkcustcodeponoPOBALANCE", {
        G_CODE: selectedCode?.G_CODE,
        CUST_CD: selectedCust_CD?.CUST_CD,
        PO_NO: newpono,
      })
        .then((response) => {
          console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            let tem_this_po_balance: number = response.data.data[0].PO_BALANCE;
            if (tem_this_po_balance < newinvoiceQTY) err_code = 5;
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      if (err_code === 0) {
        await generalQuery("insert_invoice", {
          DELIVERY_QTY: uploadExcelJson[i].DELIVERY_QTY,
          DELIVERY_DATE: uploadExcelJson[i].DELIVERY_DATE,
          REMARK: "",
          G_CODE: uploadExcelJson[i].G_CODE,
          CUST_CD: uploadExcelJson[i].CUST_CD,
          PO_NO: uploadExcelJson[i].PO_NO,
          EMPL_NO: userData?.EMPL_NO,
          INVOICE_NO: uploadExcelJson[i].INVOICE_NO,
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
        tempjson[i].CHECKSTATUS = "NG: Không tồn tại PO";
      } else if (err_code === 2) {
        tempjson[i].CHECKSTATUS =
          "NG: Ngày Giao hàng không được trước ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      } else if (err_code === 5) {
        tempjson[i].CHECKSTATUS = "NG: Giao hàng nhiều hơn PO";
      }
    }
    Swal.fire("Thông báo", "Đã hoàn thành thêm Invoice hàng loạt", "success");
    setUploadExcelJSon(tempjson);
  };
  const confirmUpInvoiceHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn thêm Invoice hàng loạt ?",
      text: "Thêm rồi mà sai, sửa là hơi vất đấy",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn thêm!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành thêm", "Đang thêm Invoice hàng loạt", "success");
        handle_upInvoiceHangLoat();
      }
    });
  };
  const confirmCheckInvoiceHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn check Invoice hàng loạt ?",
      text: "Sẽ bắt đầu check Invoice hàng loạt",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn check!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành check", "Đang check Invoice hàng loạt", "success");
        handle_checkInvoiceHangLoat();
      }
    });
  };
  const getcustomerlist = () => {
    generalQuery("selectcustomerList", {})
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
  const getcodelist = (G_NAME: string) => {
    startTransition(() => {
      generalQuery("selectcodeList", { G_NAME: G_NAME })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            setCodeList(response.data.data);
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
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
  const handle_add_1Invoice = async () => {
    let err_code: number = 0;
    await generalQuery("checkPOExist", {
      G_CODE: selectedCode?.G_CODE,
      CUST_CD: selectedCust_CD?.CUST_CD,
      PO_NO: newpono,
    })
      .then((response) => {
        console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          if (newinvoiceQTY > response.data.data.PO_BALANCE) {
            err_code = 5; //giao hang nhieu hon PO balance
          }
          //tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
        } else {
          err_code = 1;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    let now = moment();
    let invoicedate = moment(newinvoicedate);
    if (now < invoicedate) {
      err_code = 2;
      //tempjson[i].CHECKSTATUS = "NG: Ngày PO không được trước ngày hôm nay";
    } else {
      //tempjson[i].CHECKSTATUS = "OK";
    }
    if (selectedCode?.USE_YN === "N") {
      err_code = 3;
    }
    if (
      selectedCode?.G_CODE === "" ||
      selectedCust_CD?.CUST_CD === "" ||
      newinvoicedate === "" ||
      userData?.EMPL_NO === "" ||
      newinvoiceQTY === 0
    ) {
      err_code = 4;
    }
    await generalQuery("checkcustcodeponoPOBALANCE", {
      G_CODE: selectedCode?.G_CODE,
      CUST_CD: selectedCust_CD?.CUST_CD,
      PO_NO: newpono,
    })
      .then((response) => {
        console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          let tem_this_po_balance: number = response.data.data[0].PO_BALANCE;
          if (tem_this_po_balance < newinvoiceQTY) err_code = 5;
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    if (err_code === 0) {
      await generalQuery("insert_invoice", {
        G_CODE: selectedCode?.G_CODE,
        CUST_CD: selectedCust_CD?.CUST_CD,
        PO_NO: newpono,
        EMPL_NO: userData?.EMPL_NO,
        DELIVERY_QTY: newinvoiceQTY,
        DELIVERY_DATE: newinvoicedate,
        REMARK: newinvoiceRemark,
        INVOICE_NO: "",
      })
        .then((response) => {
          console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            Swal.fire("Thông báo", "Thêm Invoice mới thành công", "success");
          } else {
            Swal.fire(
              "Thông báo",
              "Thêm Invoice mới thất bại: " + response.data.message,
              "error",
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (err_code === 1) {
      Swal.fire("Thông báo", "NG: Không tồn tại PO", "error");
    } else if (err_code === 2) {
      Swal.fire(
        "Thông báo",
        "NG: Ngày Invoice không được trước ngày hôm nay",
        "error",
      );
    } else if (err_code === 3) {
      Swal.fire("Thông báo", "NG: Ver này đã bị khóa", "error");
    } else if (err_code === 4) {
      Swal.fire("Thông báo", "NG: Không để trống thông tin bắt buộc", "error");
    } else if (err_code === 5) {
      Swal.fire(
        "Thông báo",
        "NG: Số lượng giao hàng nhiều hơn PO BALANCE",
        "error",
      );
    }
  };
  const clearInvoiceform = () => {
    setNewPoDate(moment().format("YYYY-MM-DD"));
    setNewRdDate(moment().format("YYYY-MM-DD"));
    setNewPoNo("");
    setNewInvoiceQty(0);
    setNewInvoiceDate(moment().format("YYYY-MM-DD"));
    setNewInvoiceRemark("");
  };
  const handleInvoiceSelectionforUpdate = (ids: GridSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = invoicedatatable.filter((element: any) =>
      selectedID.has(element.DELIVERY_ID),
    );
    if (datafilter.length > 0) {
      setInvoiceDataTableFilter(datafilter);
    } else {
      setInvoiceDataTableFilter([]);
    }
  };
  const handle_fillsuaformInvoice = () => {
    if (invoicedatatablefilter.length === 1) {
      setSelection({
        ...selection,
        trapo: true,
        thempohangloat: false,
        them1po: false,
        them1invoice: true,
      });
      const selectedCodeFilter: CodeListData = {
        G_CODE:
          invoicedatatablefilter[invoicedatatablefilter.length - 1].G_CODE,
        G_NAME:
          invoicedatatablefilter[invoicedatatablefilter.length - 1].G_NAME,
        G_NAME_KD:
          invoicedatatablefilter[invoicedatatablefilter.length - 1].G_NAME_KD,
        PROD_LAST_PRICE: Number(
          invoicedatatablefilter[invoicedatatablefilter.length - 1].PROD_PRICE,
        ),
        USE_YN: "Y",
      };
      const selectedCustomerFilter: CustomerListData = {
        CUST_CD:
          invoicedatatablefilter[invoicedatatablefilter.length - 1].CUST_CD,
        CUST_NAME_KD:
          invoicedatatablefilter[invoicedatatablefilter.length - 1]
            .CUST_NAME_KD,
      };
      setSelectedCode(selectedCodeFilter);
      setSelectedCust_CD(selectedCustomerFilter);
      setNewInvoiceQty(
        invoicedatatablefilter[invoicedatatablefilter.length - 1].DELIVERY_QTY,
      );
      setNewPoNo(
        invoicedatatablefilter[invoicedatatablefilter.length - 1].PO_NO,
      );
      setNewInvoiceDate(moment().format("YYYY-MM-DD"));
      setNewInvoiceRemark(
        invoicedatatablefilter[invoicedatatablefilter.length - 1].REMARK,
      );
      setSelectedID(
        invoicedatatablefilter[invoicedatatablefilter.length - 1].DELIVERY_ID,
      );
    } else if (invoicedatatablefilter.length === 0) {
      clearInvoiceform();
      Swal.fire("Thông báo", "Lỗi: Chọn ít nhất 1 Invoice để sửa", "error");
    } else {
      Swal.fire("Thông báo", "Lỗi: Chỉ tích chọn 1 dòng thêm thôi", "error");
    }
  };
  const updateInvoice = async () => {
    let err_code: number = 0;
    await generalQuery("checkPOExist", {
      G_CODE: selectedCode?.G_CODE,
      CUST_CD: selectedCust_CD?.CUST_CD,
      PO_NO: newpono,
    })
      .then((response) => {
        console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          //tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
        } else {
          err_code = 1;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    let now = moment();
    let invoicedate = moment(newinvoicedate);
    if (now < invoicedate) {
      err_code = 2;
      //tempjson[i].CHECKSTATUS = "NG: Ngày PO không được trước ngày hôm nay";
    } else {
      //tempjson[i].CHECKSTATUS = "OK";
    }
    if (selectedCode?.USE_YN === "N") {
      err_code = 3;
    }
    if (
      selectedCode?.G_CODE === "" ||
      selectedCust_CD?.CUST_CD === "" ||
      newpono === "" ||
      userData?.EMPL_NO === ""
    ) {
      err_code = 4;
    }
    if (err_code === 0) {
      await generalQuery("update_invoice", {
        G_CODE: selectedCode?.G_CODE,
        CUST_CD: selectedCust_CD?.CUST_CD,
        PO_NO: newpono,
        EMPL_NO: userData?.EMPL_NO,
        DELIVERY_DATE: newinvoicedate,
        DELIVERY_QTY: newinvoiceQTY,
        REMARK: newinvoiceRemark,
        DELIVERY_ID: selectedID,
      })
        .then((response) => {
          console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            Swal.fire("Thông báo", "Update Invoice thành công", "success");
          } else {
            Swal.fire(
              "Thông báo",
              "Update Invoice thất bại: " + response.data.message,
              "error",
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (err_code === 1) {
      Swal.fire("Thông báo", "NG: Không tồn tại PO", "error");
    } else if (err_code === 2) {
      Swal.fire(
        "Thông báo",
        "NG: Ngày Giao Hàng không được trước ngày hôm nay",
        "error",
      );
    } else if (err_code === 3) {
      Swal.fire("Thông báo", "NG: Ver này đã bị khóa", "error");
    } else if (err_code === 4) {
      Swal.fire("Thông báo", "NG: Không để trống thông tin bắt buộc", "error");
    } else {
      Swal.fire("Thông báo", "Lỗi", "error");
    }
  };
  const deleteInvoice = async () => {
    if (invoicedatatablefilter.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < invoicedatatablefilter.length; i++) {
        if (invoicedatatablefilter[i].EMPL_NO === userData?.EMPL_NO) {
          await generalQuery("delete_invoice", {
            DELIVERY_ID: invoicedatatablefilter[i].DELIVERY_ID,
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
          "Xóa Invoice thành công (chỉ Invoice của người đăng nhập)!",
          "success",
        );
      } else {
        Swal.fire("Thông báo", "Có lỗi SQL!", "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 Invoice để xóa !", "error");
    }
  };
  const handleConfirmDeleteInvoice = () => {
    Swal.fire({
      title: "Chắc chắn muốn xóa Invoice đã chọn ?",
      text: "Sẽ chỉ xóa invoice do bạn up lên",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Xóa", "Đang Xóa Invoice hàng loạt", "success");
        deleteInvoice();
      }
    });
  };
  const filterOptions1 = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });
  const dataSource = new PivotGridDataSource({
    fields: [
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
        caption: "DELIVERY_ID",
        width: 80,
        dataField: "DELIVERY_ID",
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
        caption: "DELIVERY_DATE",
        width: 80,
        dataField: "DELIVERY_DATE",
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
        caption: "DELIVERY_QTY",
        width: 80,
        dataField: "DELIVERY_QTY",
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
        format: "currency",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "DELIVERED_AMOUNT",
        width: 80,
        dataField: "DELIVERED_AMOUNT",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "currency",
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
        caption: "INVOICE_NO",
        width: 80,
        dataField: "INVOICE_NO",
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
        caption: "PROD_MODEL",
        width: 80,
        dataField: "PROD_MODEL",
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
        caption: "PROD_PROJECT",
        width: 80,
        dataField: "PROD_PROJECT",
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
        caption: "YEARNUM",
        width: 80,
        dataField: "YEARNUM",
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
        caption: "WEEKNUM",
        width: 80,
        dataField: "WEEKNUM",
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
    ],
    store: invoicedatatable,
  });
  useEffect(() => {
    getcustomerlist();
    getcodelist("");
  }, []);
  return (
    <div className="invoicemanager">
      <div className="mininavbar">
        <div
          className="mininavitem"
          onClick={() => setNav(1)}
          style={{
            backgroundColor: selection.trapo === true ? "#02c712" : "#abc9ae",
            color: selection.trapo === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">Tra Invoice</span>
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
          <span className="mininavtext">Thêm Invoice</span>
        </div>
      </div>
      {selection.thempohangloat && (
        <div className="newinvoice">
          <div className="batchnewinvoice">
            <h3>Thêm Invoice Hàng Loạt</h3>
            <form className="formupload">
              <label htmlFor="upload">
                <b>Chọn file Excel: </b>
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
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
                  confirmCheckInvoiceHangLoat();
                }}
              >
                Check Invoice
              </div>
              <div
                className="uppobutton"
                onClick={(e) => {
                  e.preventDefault();
                  confirmUpInvoiceHangLoat();
                }}
              >
                Up Invoice
              </div>
            </form>
            <div className="insertInvoiceTable">
              {true && (
                <DataGrid
                  sx={{ fontSize: "0.7rem", flex: 1 }}
                  components={{
                    Toolbar: CustomToolbar,
                    LoadingOverlay: LinearProgress,
                  }}
                  loading={isLoading}
                  rowHeight={35}
                  rows={uploadExcelJson}
                  columns={column_excelinvoice2}
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
        <div className="tracuuInvoice">
          {showhidesearchdiv && (
            <div className="tracuuInvoiceform">
              <div className="forminput">
                <div className="forminputcolumn">
                  <label>
                    <b>Từ ngày:</b>
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type="date"
                      value={fromdate.slice(0, 10)}
                      onChange={(e) => setFromDate(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Tới ngày:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
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
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type="text"
                      placeholder="GH63-xxxxxx"
                      value={codeKD}
                      onChange={(e) => setCodeKD(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Code ERP:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
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
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type="text"
                      placeholder="Trang"
                      value={empl_name}
                      onChange={(e) => setEmpl_Name(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Khách:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
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
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type="text"
                      placeholder="TSP"
                      value={prod_type}
                      onChange={(e) => setProdType(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>ID:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
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
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type="text"
                      placeholder="123abc"
                      value={po_no}
                      onChange={(e) => setPo_No(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Vật liệu:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
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
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type="text"
                      placeholder="OVER"
                      value={over}
                      onChange={(e) => setOver(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Invoice No:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
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
                    onKeyDown={(e) => {
                      handleSearchCodeKeyDown(e);
                    }}
                    type="checkbox"
                    name="alltimecheckbox"
                    defaultChecked={alltime}
                    onChange={() => setAllTime(!alltime)}
                  ></input>
                </label>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    handletraInvoice();
                  }}
                >
                  <FcSearch color="green" size={30} />
                  Search
                </IconButton>
              </div>
              <div className="formsummary">
                <table>
                  <thead>
                    <tr>
                      <td>DELIVERED QTY</td>
                      <td>DELIVERED AMOUNT</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ color: "purple", fontWeight: "bold" }}>
                        {" "}
                        {invoiceSummary.total_delivered_qty.toLocaleString(
                          "en-US",
                        )}{" "}
                        EA
                      </td>
                      <td style={{ color: "purple", fontWeight: "bold" }}>
                        {" "}
                        {invoiceSummary.total_delivered_amount.toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                          },
                        )}{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/*  <div className='summarygroup'>
                <div className='summaryvalue'>
                  <b>
                    DELIVERED QTY:{" "}
                    {invoiceSummary.total_delivered_qty.toLocaleString("en-US")} EA
                  </b>
                </div>
                <div className='summaryvalue'>
                  <b>
                    DELIVERED AMOUNT:{" "}
                    {invoiceSummary.total_delivered_amount.toLocaleString("en-US", {
                      style: "currency",
                      currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                    })}
                  </b>
                </div>
              </div>         */}
              </div>
            </div>
          )}
          <div className="tracuuInvoiceTable">
            <DataGrid
              sx={{ fontSize: "0.7rem" }}
              components={{
                Toolbar: CustomToolbarPOTable,
                LoadingOverlay: LinearProgress,
              }}
              loading={isLoading}
              rowHeight={30}
              rows={invoicedatatable}
              columns={column_invoicetable}
              rowsPerPageOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
              ]}
              editMode="row"
              getRowId={(row) => row.DELIVERY_ID}
              checkboxSelection
              disableSelectionOnClick
              onSelectionModelChange={(ids) => {
                handleInvoiceSelectionforUpdate(ids);
              }}
            />
          </div>
        </div>
      )}
      {selection.them1invoice && (
        <div className="them1invoice">
          <div className="formnho">
            <div className="dangkyform">
              <h3>Thêm Invoice mới</h3>
              <div className="dangkyinput">
                <div className="dangkyinputbox">
                  <label>
                    <b>Khách hàng:</b>{" "}
                    <Autocomplete
                      size="small"
                      disablePortal
                      options={customerList}
                      className="autocomplete"
                      getOptionLabel={(option: CustomerListData) =>
                        `${option.CUST_CD}: ${option.CUST_NAME_KD}`
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Select customer" />
                      )}
                      value={selectedCust_CD}
                      onChange={(
                        event: any,
                        newValue: CustomerListData | null,
                      ) => {
                        console.log(newValue);
                        setSelectedCust_CD(newValue);
                      }}
                    />
                  </label>
                  <label>
                    <b>Code hàng:</b>{" "}
                    <Autocomplete
                      size="small"
                      disablePortal
                      options={codeList}
                      className="autocomplete"
                      filterOptions={filterOptions1}
                      getOptionLabel={(option: CodeListData | any) =>
                        `${option.G_CODE}: ${option.G_NAME_KD}:${option.G_NAME}`
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Select code" />
                      )}
                      onChange={(event: any, newValue: CodeListData | any) => {
                        console.log(newValue);
                        setNewPoPrice(
                          newValue === null
                            ? ""
                            : newValue.PROD_LAST_PRICE.toString(),
                        );
                        setSelectedCode(newValue);
                      }}
                      value={selectedCode}
                    />
                  </label>
                  <label>
                    <b>PO NO:</b>{" "}
                    <TextField
                      value={newpono}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewPoNo(e.target.value)
                      }
                      size="small"
                      color="success"
                      className="autocomplete"
                      id="outlined-basic"
                      label="Số PO"
                      variant="outlined"
                    />
                  </label>
                </div>
                <div className="dangkyinputbox">
                  <label>
                    <b>Invoice QTY:</b>{" "}
                    <TextField
                      value={newinvoiceQTY}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewInvoiceQty(Number(e.target.value))
                      }
                      size="small"
                      color="success"
                      className="autocomplete"
                      id="outlined-basic"
                      label="INVOICE QTY"
                      variant="outlined"
                    />
                  </label>
                  <label>
                    <b>Invoice Date:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      className="inputdata"
                      type="date"
                      value={newinvoicedate.slice(0, 10)}
                      onChange={(e) => setNewInvoiceDate(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Remark:</b>{" "}
                    <TextField
                      value={newinvoiceRemark}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewInvoiceRemark(e.target.value)
                      }
                      size="small"
                      className="autocomplete"
                      id="outlined-basic"
                      label="Remark"
                      variant="outlined"
                    />
                  </label>
                </div>
              </div>
              <div className="dangkybutton">
                <button
                  className="thembutton"
                  onClick={() => {
                    handle_add_1Invoice();
                  }}
                >
                  Thêm Invoice
                </button>
                <button
                  className="closebutton"
                  onClick={() => {
                    updateInvoice();
                  }}
                >
                  Sửa Invoice
                </button>
                <button
                  className="suabutton"
                  onClick={() => {
                    clearInvoiceform();
                  }}
                >
                  Clear
                </button>
                <button
                  className="closebutton"
                  onClick={() => {
                    setSelection({
                      ...selection,
                      trapo: true,
                      thempohangloat: false,
                      them1po: false,
                      them1invoice: false,
                    });
                  }}
                >
                  Close
                </button>
              </div>
            </div>
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
export default InvoiceManager2;
