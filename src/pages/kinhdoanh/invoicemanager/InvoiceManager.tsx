import { Autocomplete, IconButton, TextField, createFilterOptions } from "@mui/material";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { FcSearch } from "react-icons/fc";
import { AiFillCloseCircle, AiFillFileAdd, AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery, getCompany, getGlobalSetting, getSocket, getUserData } from "../../../api/Api";
import { checkBP, f_checkG_CODE_USE_YN, f_checkPOInfo, f_compareDateToNow, f_compareTwoDate, f_deleteInvoice, f_getcodelist, f_getcustomerlist, f_insert_Notification_Data, f_insertInvoice, f_loadInvoiceDataFull, f_readUploadFile, f_updateInvoice, f_updateInvoiceNo, SaveExcel } from "../../../api/GlobalFunction";
import { MdOutlineDelete, MdOutlinePivotTableChart, MdUpdate } from "react-icons/md";
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
  XUATKHOPODATA,
} from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import CustomDialog from "../../../components/Dialog/CustomDialog";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
const InvoiceManager = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const showhidesearchdiv = useRef(false);
  const [sh, setSH] = useState(true);
  const [selection, setSelection] = useState<any>({
    trapo: true,
    thempohangloat: false,
    them1po: false,
    them1invoice: false,
    testinvoicetable: false,
    checkkho: false
  });
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [columnsExcel, setColumnsExcel] = useState<Array<any>>([]);
  const [old_invoice_qty, setOld_Invoice_Qty] = useState(0);
  const [uploadExcelJson, setUploadExcelJSon] = useState<Array<any>>([]);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [empl_name, setEmpl_Name] = useState("");
  const [cust_name, setCust_Name] = useState("");
  const [prod_type, setProdType] = useState("");
  const [id, setID] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [justpobalance, setJustPOBalance] = useState(true);
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>();
  const [selectedCust_CD, setSelectedCust_CD] =
    useState<CustomerListData | null>();
  const [newpodate, setNewPoDate] = useState(moment().format("YYYY-MM-DD"));
  const [newrddate, setNewRdDate] = useState(moment().format("YYYY-MM-DD"));
  const [newpono, setNewPoNo] = useState("");
  const [newpoprice, setNewPoPrice] = useState("");
  const [newinvoiceQTY, setNewInvoiceQty] = useState<number>(0);
  const [oldinvoiceQTY, setOldInvoiceQty] = useState<number>(0);
  const [newinvoicedate, setNewInvoiceDate] = useState(moment().format("YYYY-MM-DD"));
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
  const [invoicedatatable, setInvoiceDataTable] = useState<Array<InvoiceTableData>>([]);
  const invoicedatatablefilter = useRef<InvoiceTableData[]>([]);
  const invoice_no_ref = useRef<string>("");
  const clickedRow = useRef<any>(null);
  const [selectedID, setSelectedID] = useState<number | null>();
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [trigger, setTrigger] = useState(true);
  const [xuatkhopotable, setXuatKhoPOTable] = useState<XUATKHOPODATA[]>([])
  const selectedxuatkhopo = useRef<XUATKHOPODATA[]>([])
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handletraInvoice();
    }
  };
  const loadFile = (e: any) => {
    f_readUploadFile(e, setUploadExcelJSon, setColumnsExcel);
  };
  const dataGridRef = useRef<any>(null);
  const clearSelection = () => {
    if (dataGridRef.current) {
      dataGridRef.current.instance.clearSelection();
      invoicedatatablefilter.current = [];
      //qlsxplandatafilter.current = [];
      //console.log(dataGridRef.current);
    }
  };
  const handletraInvoice = async () => {
    Swal.fire({
      title: "Tra cứu Invoices",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    clearSelection();
    let loadeddata: InvoiceTableData[] = [];
    loadeddata = await f_loadInvoiceDataFull({
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
      invoice_no: invoice_no
    });
    if (loadeddata.length > 0) {
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
      Swal.fire(
        "Thông báo",
        "Đã load " + loadeddata.length + " dòng",
        "success",
      );
    }
    else {
      setInvoiceDataTable([]);
      Swal.fire("Thông báo", "Không có dữ liệu", "success");
    }
  };
  const handle_checkInvoiceHangLoat = async () => {
    if (uploadExcelJson.length > 0) {
      let tempjson = uploadExcelJson;
      for (let i = 0; i < uploadExcelJson.length; i++) {
        let err_code: number = 0;
        let po_info: Array<any> = await f_checkPOInfo(uploadExcelJson[i].G_CODE ?? "", uploadExcelJson[i].CUST_CD ?? "", uploadExcelJson[i].PO_NO);
        err_code = po_info.length > 0 ? (uploadExcelJson[i].DELIVERY_QTY > po_info[0].PO_BALANCE) ? 5 : err_code : 1;
        let checkCompareIVDatevsPODate: number = po_info.length > 0 ? f_compareTwoDate(uploadExcelJson[i].DELIVERY_DATE, po_info[0]?.PO_DATE.substring(0, 10)) : err_code;
        err_code = checkCompareIVDatevsPODate === -1 ? 6 : err_code;
        err_code = f_compareDateToNow(uploadExcelJson[i].DELIVERY_DATE) ? 2 : err_code;
        let checkG_CODE: number = await f_checkG_CODE_USE_YN(uploadExcelJson[i].G_CODE);
        err_code = checkG_CODE == 1 ? 3 : checkG_CODE === 2 ? 4 : err_code;
        if (err_code === 0) {
          tempjson[i].CHECKSTATUS = "OK";
        } else if (err_code === 1) {
          tempjson[i].CHECKSTATUS = "NG: Không tồn tại PO";
        } else if (err_code === 2) {
          tempjson[i].CHECKSTATUS = "NG: Ngày Giao hàng không được trước ngày hôm nay";
        } else if (err_code === 3) {
          tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
        } else if (err_code === 4) {
          tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
        } else if (err_code === 5) {
          tempjson[i].CHECKSTATUS = "NG: Giao hàng nhiều hơn PO";
        } else if (err_code === 6) {
          tempjson[i].CHECKSTATUS = "NG: Ngày Invoice không được trước ngày PO";
        }
      }
      setUploadExcelJSon(tempjson);
      setTrigger(!trigger);
      Swal.fire("Thông báo", "Đã hoàn thành check Invoice hàng loạt", "success");
    }
    else {
      Swal.fire('Thông báo', 'Không có dòng nào', 'error');
    }
  };
  const handle_upInvoiceHangLoat = async () => {
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      let po_info: Array<any> = await f_checkPOInfo(uploadExcelJson[i].G_CODE ?? "", uploadExcelJson[i].CUST_CD ?? "", uploadExcelJson[i].PO_NO);
      err_code = po_info.length > 0 ? (uploadExcelJson[i].DELIVERY_QTY > po_info[0].PO_BALANCE) ? 5 : err_code : 1;
      let checkCompareIVDatevsPODate: number = po_info.length > 0 ? f_compareTwoDate(uploadExcelJson[i].DELIVERY_DATE, po_info[0].PO_DATE.substring(0, 10)) : err_code;
      err_code = checkCompareIVDatevsPODate === -1 ? 6 : err_code;
      err_code = f_compareDateToNow(uploadExcelJson[i].DELIVERY_DATE) ? 2 : err_code;
      let checkG_CODE: number = await f_checkG_CODE_USE_YN(uploadExcelJson[i].G_CODE);
      err_code = checkG_CODE == 1 ? 3 : checkG_CODE === 2 ? 4 : err_code;
      if (err_code === 0) {
        tempjson[i].CHECKSTATUS = await f_insertInvoice({
          DELIVERY_QTY: uploadExcelJson[i].DELIVERY_QTY,
          DELIVERY_DATE: uploadExcelJson[i].DELIVERY_DATE,
          REMARK: uploadExcelJson[i]?.REMARK ?? "",
          G_CODE: uploadExcelJson[i].G_CODE,
          CUST_CD: uploadExcelJson[i].CUST_CD,
          PO_NO: uploadExcelJson[i].PO_NO,
          EMPL_NO: userData?.EMPL_NO,
          INVOICE_NO: uploadExcelJson[i].INVOICE_NO,
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
      } else if (err_code === 6) {
        tempjson[i].CHECKSTATUS = "NG: Ngày Invoice không được trước ngày PO";
      }
    }
    let newNotification: NotificationElement = {
      CTR_CD: '002',
      NOTI_ID: -1,
      NOTI_TYPE: "success",
      TITLE: 'Invoice mới hàng loạt',
      CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm Invoice hàng loạt`, 
      SUBDEPTNAME: "KD",
      MAINDEPTNAME: "KD",
      INS_EMPL: 'NHU1903',
      INS_DATE: '2024-12-30',
      UPD_EMPL: 'NHU1903',
      UPD_DATE: '2024-12-30',
    }  
    if(await f_insert_Notification_Data(newNotification))
    {
      getSocket().emit("notification_panel", newNotification);
    }
    Swal.fire("Thông báo", "Đã hoàn thành thêm Invoice hàng loạt", "success");
    setUploadExcelJSon(tempjson);
    setTrigger(!trigger);
  };
  const handle_upInvoiceXKHL = async () => {
    if (selectedxuatkhopo.current.length > 0) {
      let err_code: number = 0;
      for (let i = 0; i < selectedxuatkhopo.current.length; i++) {
        if (selectedxuatkhopo.current[i].CHECKSTATUS.substring(0, 2) === 'OK') {
          let kq = await f_insertInvoice({
            DELIVERY_QTY: selectedxuatkhopo.current[i].THISDAY_OUT_QTY,
            DELIVERY_DATE: selectedxuatkhopo.current[i].OUT_DATE,
            REMARK: "",
            G_CODE: selectedxuatkhopo.current[i].G_CODE,
            CUST_CD: selectedxuatkhopo.current[i].CUST_CD,
            PO_NO: selectedxuatkhopo.current[i].PO_NO,
            EMPL_NO: userData?.EMPL_NO,
            INVOICE_NO: "",
          });
          if (kq !== 'OK') err_code = 1;
        }
      }
      if (err_code === 0) {
        let newNotification: NotificationElement = {
          CTR_CD: '002',
          NOTI_ID: -1,
          NOTI_TYPE: "success",
          TITLE: 'Invoice mới hàng loạt',
          CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm Invoice hàng loạt`, 
          SUBDEPTNAME: "KD",
          MAINDEPTNAME: "KD",
          INS_EMPL: 'NHU1903',
          INS_DATE: '2024-12-30',
          UPD_EMPL: 'NHU1903',
          UPD_DATE: '2024-12-30',
        }  
        if(await f_insert_Notification_Data(newNotification))
        {
          getSocket().emit("notification_panel",newNotification);
        }
        Swal.fire('Thông báo', 'Thêm invoice từ lịch sử xuất kho thành công', 'success');
      }
      else {
        Swal.fire('Thông báo', 'Có 1 hoặc nhiều invoice đã bị lỗi, hãy kiểm tra lại', 'error');
      }
      loadXuatKho();
    }
    else {
      Swal.fire('Cảnh báo', 'Chọn ít nhất 1 dòng để thực hiện', 'error');
    }
  }
  const loadXuatKho = () => {
    generalQuery("loadxuatkhopo", {
      OUT_DATE: moment.utc(newinvoicedate).format('YYYYMMDD')
    })
      .then((response) => {
        console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          const loadeddata: XUATKHOPODATA[] = response.data.data.map(
            (element: XUATKHOPODATA, index: number) => {
              return {
                ...element,
                OUT_DATE: moment.utc(element.OUT_DATE).format('YYYY-MM-DD'),
                id: index
              };
            }
          );
          setXuatKhoPOTable(loadeddata);
        } else {
          setXuatKhoPOTable([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
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
        Swal.fire({
          title: "Up Invoice",
          text: "Đang up invoice hàng loạt",
          icon: "info",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
          showConfirmButton: false,
        });
        handle_upInvoiceHangLoat();
      }
    });
  };
  const confirmUpInvoiceHangLoat2 = () => {
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
        Swal.fire({
          title: "Check Invoice",
          text: "Đang up invoice hàng loạt",
          icon: "info",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
          showConfirmButton: false,
        });
        handle_upInvoiceXKHL();
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
        Swal.fire({
          title: "Check Invoice",
          text: "Đang check Invoice hàng loạt",
          icon: "info",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
          showConfirmButton: false,
        });
        handle_checkInvoiceHangLoat();
      }
    });
  };
  const getcustomerlist = async () => {
    setCustomerList(await f_getcustomerlist());
  };
  const getcodelist = async (G_NAME: string) => {
    setCodeList(await f_getcodelist(G_NAME));
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
        checkkho: false
      });
    } else if (choose === 2) {
      setSelection({
        ...selection,
        trapo: false,
        thempohangloat: true,
        them1po: false,
        them1invoice: false,
        testinvoicetable: false,
        checkkho: false
      });
    } else if (choose === 3) {
      setSelection({
        ...selection,
        trapo: false,
        thempohangloat: false,
        them1po: false,
        them1invoice: false,
        testinvoicetable: false,
        checkkho: true
      });
    }
  };
  const handle_add_1Invoice = async () => {
    let err_code: number = 0;
    let po_info: Array<any> = await f_checkPOInfo(selectedCode?.G_CODE ?? "", selectedCust_CD?.CUST_CD ?? "", newpono);
    err_code = po_info.length > 0 ? (newinvoiceQTY > po_info[0].PO_BALANCE) ? 5 : err_code : 1;
    let checkCompareIVDatevsPODate: number = po_info.length > 0 ? f_compareTwoDate(newinvoicedate, po_info[0].PO_DATE.substring(0, 10)) : err_code;
    err_code = checkCompareIVDatevsPODate === -1 ? 6 : err_code;
    err_code = f_compareDateToNow(newinvoicedate) ? 2 : err_code;
    err_code = selectedCode?.USE_YN === "N" ? 3 : err_code;
    if (selectedCode?.G_CODE === "" || selectedCust_CD?.CUST_CD === "" || newinvoicedate === "" || userData?.EMPL_NO === "" || newinvoiceQTY === 0) {
      err_code = 4;
    }
    if (err_code === 0) {
      let kq = await f_insertInvoice({
        G_CODE: selectedCode?.G_CODE,
        CUST_CD: selectedCust_CD?.CUST_CD,
        PO_NO: newpono,
        EMPL_NO: userData?.EMPL_NO,
        DELIVERY_QTY: newinvoiceQTY,
        DELIVERY_DATE: newinvoicedate,
        REMARK: newinvoiceRemark,
        INVOICE_NO: "",
      });
      if (kq === "OK") {
      let newNotification: NotificationElement = {
        CTR_CD: '002',
        NOTI_ID: -1,
        NOTI_TYPE: "success",
        TITLE: 'Invoice mới',
        CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm Invoice mới code G_NAME ${selectedCode?.G_CODE} - (${selectedCode?.G_NAME}), với số lượng: ${newinvoiceQTY} cho khách hàng ${selectedCust_CD?.CUST_CD} - ${selectedCust_CD?.CUST_NAME_KD} .`, 
        SUBDEPTNAME: "KD",
        MAINDEPTNAME: "KD",
        INS_EMPL: 'NHU1903',
        INS_DATE: '2024-12-30',
        UPD_EMPL: 'NHU1903',
        UPD_DATE: '2024-12-30',
      }  
      if(await f_insert_Notification_Data(newNotification))
      {
        getSocket().emit("notification_panel", newNotification);
      }
        Swal.fire("Thông báo", "Thêm Invoice mới thành công", "success");
      } else {
        Swal.fire("Thông báo", "Thêm Invoice mới thất bại: " + kq, "error");
      }
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
    } else if (err_code === 6) {
      Swal.fire("Thông báo", "NG: Ngày Invoice không được trước ngày PO", "error");
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
  const handle_fillsuaformInvoice = () => {
    if (invoicedatatablefilter.current.length === 1) {
      handleOpenDialog();
      const selectedCodeFilter: CodeListData = {
        G_CODE: clickedRow.current?.G_CODE ?? "",
        G_NAME: clickedRow.current?.G_NAME ?? "",
        G_NAME_KD: clickedRow.current?.G_NAME_KD ?? "",
        PROD_LAST_PRICE: Number(clickedRow.current?.PROD_PRICE),
        USE_YN: "Y",
      };
      const selectedCustomerFilter: CustomerListData = {
        CUST_CD: clickedRow.current?.CUST_CD ?? "",
        CUST_NAME_KD: clickedRow.current?.CUST_NAME_KD ?? "",
      };
      setSelectedCode(selectedCodeFilter);
      setSelectedCust_CD(selectedCustomerFilter);
      setNewInvoiceQty(clickedRow.current?.DELIVERY_QTY ?? 0);
      setOldInvoiceQty(clickedRow.current?.DELIVERY_QTY ?? 0);
      setNewPoNo(clickedRow.current?.PO_NO ?? "");
      setNewInvoiceDate(moment().format("YYYY-MM-DD"));
      setNewInvoiceRemark(clickedRow.current?.REMARK ?? "");
      setSelectedID(clickedRow.current?.DELIVERY_ID ?? "");
      setOld_Invoice_Qty(clickedRow.current?.DELIVERY_QTY ?? 0);
    } else {
      clearInvoiceform();
      Swal.fire("Thông báo", "Lỗi: Chọn ít nhất 1 Invoice để sửa", "error");
    }
  };
  const updateInvoice = async () => {
    let err_code: number = 0;
    //validating invoice information
    let po_info: Array<any> = await f_checkPOInfo(selectedCode?.G_CODE ?? "", selectedCust_CD?.CUST_CD ?? "", newpono);
    err_code = po_info.length > 0 ? (newinvoiceQTY > (po_info[0].PO_BALANCE+old_invoice_qty)) ? 5 : err_code : 1;
    let checkCompareIVDatevsPODate: number = f_compareTwoDate(newinvoicedate, po_info[0].PO_DATE.substring(0, 10));
    err_code = checkCompareIVDatevsPODate === -1 ? 6 : err_code;
    err_code = f_compareDateToNow(newinvoicedate) ? 2 : err_code;
    err_code = selectedCode?.USE_YN === "N" ? 3 : err_code;
    if (selectedCode?.G_CODE === "" || selectedCust_CD?.CUST_CD === "" || newinvoicedate === "" || userData?.EMPL_NO === "" || newinvoiceQTY === 0) {
      err_code = 4;
    }
    err_code = newinvoiceQTY > po_info[0].PO_BALANCE ? 5 : err_code;
    if (err_code === 0) {
      let kq = await f_updateInvoice({
        G_CODE: selectedCode?.G_CODE,
        CUST_CD: selectedCust_CD?.CUST_CD,
        PO_NO: newpono,
        EMPL_NO: userData?.EMPL_NO,
        DELIVERY_DATE: newinvoicedate,
        DELIVERY_QTY: newinvoiceQTY,
        REMARK: newinvoiceRemark,
        DELIVERY_ID: selectedID,
      });
      if (kq === "OK") {
        Swal.fire("Thông báo", "Update Invoice thành công", "success");
      } else {
        Swal.fire(
          "Thông báo",
          "Update Invoice thất bại: " + kq,
          "error",
        );
      }
    } else if (err_code === 1) {
      Swal.fire("Thông báo", "NG: Không tồn tại PO", "error");
    } else if (err_code === 2) {
      Swal.fire("Thông báo", "NG: Ngày Giao Hàng không được trước ngày hôm nay", "error");
    } else if (err_code === 3) {
      Swal.fire("Thông báo", "NG: Ver này đã bị khóa", "error");
    } else if (err_code === 4) {
      Swal.fire("Thông báo", "NG: Không để trống thông tin bắt buộc", "error");
    } else if (err_code === 5) {
      Swal.fire("Thông báo", "NG: Giao hàng nhiều hơn PO Balance", "error");
    }
    else {
      Swal.fire("Thông báo", "Lỗi", "error");
    }
  };
  const deleteInvoice = async () => {
    if (invoicedatatablefilter.current.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < invoicedatatablefilter.current.length; i++) {
        if (invoicedatatablefilter.current[i].EMPL_NO === userData?.EMPL_NO) {
          if ((await f_deleteInvoice(invoicedatatablefilter.current[i].DELIVERY_ID)) !== 'OK') {
            err_code = true;
          }
        }
      }
      if (!err_code) {
        let newNotification: NotificationElement = {
          CTR_CD: '002',
          NOTI_ID: -1,
          NOTI_TYPE: 'warning',
          TITLE: 'Xóa Invoice',
          CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã xóa PO_NO ${invoicedatatablefilter.current.map((x: InvoiceTableData) => x.PO_NO).join(', ')} - CODE: ${invoicedatatablefilter.current.map((x: InvoiceTableData) => x.G_NAME_KD).join(', ')}`, 
          SUBDEPTNAME: "KD",
          MAINDEPTNAME: "KD",
          INS_EMPL: 'NHU1903',
          INS_DATE: '2024-12-30',
          UPD_EMPL: 'NHU1903',
          UPD_DATE: '2024-12-30',
        }  
        if(await f_insert_Notification_Data(newNotification))
        {
          getSocket().emit("notification_panel",newNotification);
        }
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
  const updateInvoiceNo = async (invoice_no: string) => {
    if (invoicedatatablefilter.current.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < invoicedatatablefilter.current.length; i++) {
        if (invoicedatatablefilter.current[i].EMPL_NO === userData?.EMPL_NO) {
          if ((await f_updateInvoiceNo(invoicedatatablefilter.current[i].DELIVERY_ID, invoice_no)) !== 'OK') {
            err_code = true;
          }
        }
      }
      if (!err_code) {
        Swal.fire("Thông báo", "Update invoice no!", "success",);
      } else {
        Swal.fire("Thông báo", "Có lỗi SQL!", "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 Invoice để update invoice no !", "error");
    }
  }
  const column_invoicetable = getCompany()==='CMS'?  [
    { field: "DELIVERY_ID", headerName: "DELIVERY_ID", width: 90, headerCheckboxSelection: true, checkboxSelection: true, },
    { field: "CUST_CD", headerName: "CUST_CD", width: 70 },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 110 },
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 80 },
    { field: "EMPL_NAME", headerName: "EMPL_NAME", width: 110 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      flex: 1,
      minWidth: 180,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#0660c7" }}>
            <b>{params.data.G_NAME}</b>
          </span>
        );
      },
    },
    { field: "DESCR", headerName: "DESCR", width: 120 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    { field: "PO_ID", headerName: "PO_ID", width: 70 },
    { field: "PO_NO", headerName: "PO_NO", width: 80 },
    { field: "PO_DATE", headerName: "PO_DATE", width: 100, },
    { field: "RD_DATE", headerName: "RD_DATE", width: 100, },
    { field: "DELIVERY_DATE", headerName: "DELIVERY_DATE", width: 100, },
    { field: "OVERDUE", headerName: "OVERDUE", width: 100, },
    {
      field: "DELIVERY_QTY",
      cellDataType: "number",
      headerName: "DELIVERY_QTY",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.DELIVERY_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "BEP",
      cellDataType: "number",
      headerName: "BEP",
      width: 60,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#5983f8" }}>
            <b>
              {params.data.BEP?.toLocaleString("en-US", {
                style: "decimal",
                maximumFractionDigits: 8,
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "PROD_PRICE",
      cellDataType: "number",
      headerName: "PROD_PRICE",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>
              {params.data.PROD_PRICE?.toLocaleString("en-US", {
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
      cellDataType: "number",
      headerName: "DELIVERED_AMOUNT",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.DELIVERED_AMOUNT?.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "DELIVERED_BEP_AMOUNT",
      cellDataType: "number",
      headerName: "DELIVERED_BEP_AMOUNT",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#1485cfFF" }}>
            <b>
              {params.data.DELIVERED_BEP_AMOUNT?.toLocaleString("en-US", {
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
    { field: "PROD_MAIN_MATERIAL", headerName: "PROD_MAIN_MATERIAL", width: 120 },
    { field: "YEARNUM", cellDataType: "number", headerName: "YEARNUM", width: 80 },
    { field: "WEEKNUM", cellDataType: "number", headerName: "WEEKNUM", width: 80 },
    { field: "INVOICE_NO", cellDataType: "string", headerName: "INVOICE_NO", width: 120 },
    { field: "REMARK", headerName: "REMARK", width: 120 },
  ]:[
    { field: "DELIVERY_ID", headerName: "DELIVERY_ID", width: 90, headerCheckboxSelection: true, checkboxSelection: true, },
    { field: "CUST_CD", headerName: "CUST_CD", width: 70 },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 110 },
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 80 },
    { field: "EMPL_NAME", headerName: "EMPL_NAME", width: 110 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      flex: 1,
      minWidth: 180,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#0660c7" }}>
            <b>{params.data.G_NAME}</b>
          </span>
        );
      },
    },   
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    { field: "PO_ID", headerName: "PO_ID", width: 70 },
    { field: "PO_NO", headerName: "PO_NO", width: 80 },
    { field: "PO_DATE", headerName: "PO_DATE", width: 100, },
    { field: "RD_DATE", headerName: "RD_DATE", width: 100, },
    { field: "DELIVERY_DATE", headerName: "DELIVERY_DATE", width: 100, },
    { field: "OVERDUE", headerName: "OVERDUE", width: 100, },
    {
      field: "DELIVERY_QTY",
      cellDataType: "number",
      headerName: "DELIVERY_QTY",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.DELIVERY_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "BEP",
      cellDataType: "number",
      headerName: "BEP",
      width: 60,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#5983f8" }}>
            <b>
              {params.data.BEP?.toLocaleString("en-US", {
                style: "decimal",
                maximumFractionDigits: 8,
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "PROD_PRICE",
      cellDataType: "number",
      headerName: "PROD_PRICE",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>
              {params.data.PROD_PRICE?.toLocaleString("en-US", {
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
      cellDataType: "number",
      headerName: "DELIVERED_AMOUNT",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.DELIVERED_AMOUNT?.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "DELIVERED_BEP_AMOUNT",
      cellDataType: "number",
      headerName: "DELIVERED_BEP_AMOUNT",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#1485cfFF" }}>
            <b>
              {params.data.DELIVERED_BEP_AMOUNT?.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    { field: "INVOICE_NO", cellDataType: "string", headerName: "INVOICE_NO", width: 120 },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 90 },
    { field: "PROD_MODEL", headerName: "PROD_MODEL", width: 120 },
    { field: "PROD_PROJECT", headerName: "PROD_PROJECT", width: 120 },
    { field: "PROD_MAIN_MATERIAL", headerName: "PROD_MAIN_MATERIAL", width: 120 },
    { field: "DESCR", headerName: "DESCR", width: 120 },
    { field: "YEARNUM", cellDataType: "number", headerName: "YEARNUM", width: 80 },
    { field: "WEEKNUM", cellDataType: "number", headerName: "WEEKNUM", width: 80 },   
    { field: "REMARK", headerName: "REMARK", width: 120 },
  ];
  const column_xuatkho = [
    { field: "CUST_CD", headerName: "CUST_CD", width: 90, headerCheckboxSelection: true, checkboxSelection: true, },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 90, },
    { field: "G_CODE", headerName: "G_CODE", width: 90, },
    { field: "G_NAME", headerName: "G_NAME", width: 90, },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 90, },
    { field: "OUT_DATE", headerName: "OUT_DATE", width: 90, },
    { field: "PO_NO", headerName: "PO_NO", width: 90, },
    { field: "PO_QTY", headerName: "PO_QTY", width: 90, },
    { field: "DELIVERY_QTY", headerName: "DELIVERY_QTY", width: 90, },
    { field: "PO_BALANCE", headerName: "PO_BALANCE", width: 90, },
    { field: "THISDAY_OUT_QTY", headerName: "THISDAY_OUT_QTY", width: 90, },
    { field: "CHECKSTATUS", headerName: "CHECKSTATUS", width: 90, },
  ]
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
  const invoiceDataAGTable = useMemo(() =>
    <AGTable
      suppressRowClickSelection={false}
      showFilter={true}
      toolbar={
        <div>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              showhidesearchdiv.current = !showhidesearchdiv.current;
              setSH(!showhidesearchdiv.current);
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
                handleOpenDialog();
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
          <IconButton
            className="buttonIcon"
            onClick={() => {
              setShowHidePivotTable(!showhidePivotTable);
            }}
          >
            <MdOutlinePivotTableChart color="#ff33bb" size={15} />
            Pivot
          </IconButton>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              updateInvoiceNo(invoice_no_ref.current);
            }}
          >
            <MdUpdate color="#dc3240" size={15} />
            Update I.V No
          </IconButton>
        </div>
      }
      columns={column_invoicetable}
      data={invoicedatatable}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        clickedRow.current = params.data;
      }} onSelectionChange={(params: any) => {
        invoicedatatablefilter.current = params!.api.getSelectedRows();
      }}
    />
    , [invoicedatatable, getGlobalSetting()]);
  const excelDataAGTable = useMemo(() =>
    <AGTable
      showFilter={true}
      toolbar={
        <div>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              setShowHidePivotTable(!showhidePivotTable);
            }}
          >
            <MdOutlinePivotTableChart color='#ff33bb' size={15} />
            Pivot
          </IconButton>
        </div>
      }
      columns={columnsExcel}
      data={uploadExcelJson}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        //clickedRow.current = params.data;        
      }} onSelectionChange={(params: any) => {
        //setSelectedRows(params!.api.getSelectedRows()[0]);        
      }}
    />
    , [uploadExcelJson, columnsExcel, trigger]);
  const xuatkhoPOAGTable = useMemo(() =>
    <AGTable
      showFilter={true}
      toolbar={
        <div>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              setShowHidePivotTable(!showhidePivotTable);
            }}
          >
            <MdOutlinePivotTableChart color='#ff33bb' size={15} />
            Pivot
          </IconButton>
        </div>
      }
      columns={column_xuatkho}
      data={xuatkhopotable}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        //clickedRow.current = params.data;        
      }} onSelectionChange={(params: any) => {
        //setSelectedRows(params!.api.getSelectedRows()[0]);  
        selectedxuatkhopo.current = params!.api.getSelectedRows();
      }}
    />
    , [xuatkhopotable, trigger]);
  useEffect(() => {
    getcustomerlist();
    getcodelist("");
  }, []);
  return (
    <div className="invoicemanager">     
      <Tabs className="tabs">
        <TabList className="tablist" style={{backgroundImage: theme.CMS.backgroundImage, color: 'gray'}}>
          <Tab><span className="mininavtext">Tra Invoice</span></Tab>
          <Tab><span className="mininavtext">Thêm Invoice</span></Tab>
        </TabList>
        <TabPanel>
        <div className="tracuuInvoice">
          {sh && (
            <div className="tracuuInvoiceform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
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
                      onChange={(e) => {
                        setInvoice_No(e.target.value)
                        invoice_no_ref.current = e.target.value;
                      }}
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
              </div>
            </div>
          )}
          <div className="tracuuInvoiceTable">
            {invoiceDataAGTable}
          </div>
        </div>
        </TabPanel>
        <TabPanel>
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
                    loadFile(e);
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
              {excelDataAGTable}
            </div>
          </div>
        </div>          
        </TabPanel>        
        </Tabs>
     
      <CustomDialog
        isOpen={openDialog}
        onClose={handleCloseDialog}
        title="Thêm Invoice mới"
        content={<div className="dangkyinput">
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
        </div>}
        actions={<div className="dangkybutton">
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
              handleCloseDialog();
            }}
          >
            Close
          </button>
        </div>}
      />
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
      {
        selection.checkkho && (
          <div className="newinvoice">
            <div className="batchnewinvoice">
              <h3>Check Giao Hàng Theo PO</h3>
              <form className="formupload">
                <label>
                  <b>DATE:</b>{" "}
                  <input
                    onKeyDown={(e) => {
                    }}
                    className="inputdata"
                    type="date"
                    value={newinvoicedate.slice(0, 10)}
                    onChange={(e) => setNewInvoiceDate(e.target.value)}
                  ></input>
                </label>
                <div
                  className="checkpobutton"
                  onClick={(e) => {
                    e.preventDefault();
                    loadXuatKho();
                  }}
                >
                  Load Xuất Kho
                </div>
                <div
                  className="uppobutton"
                  onClick={(e) => {
                    e.preventDefault();
                    confirmUpInvoiceHangLoat2();
                  }}
                >
                  Up Invoice XK
                </div>
              </form>
              <div className="insertInvoiceTable">
                {xuatkhoPOAGTable}
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};
export default InvoiceManager;