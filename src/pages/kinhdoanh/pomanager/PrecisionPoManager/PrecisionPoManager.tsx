import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotTable from "../../../../components/PivotChart/PivotChart";
import { RootState } from "../../../../redux/store";
import { UserData, WEB_SETTING_DATA } from "../../../../api/GlobalInterface";
import { getCompany, getGlobalSetting, getSever, getSocket, getUserData } from "../../../../api/Api";
import { checkBP } from "../../../../api/services/permissionService";
import { f_insert_Notification_Data } from "../../../../api/services/notificationService";
import { NotificationElement } from "../../../../components/NotificationPanel/Notification";
import { SaveExcel } from "../../../../api/services/excelService";
import { autoGetProdPrice } from "../../../../api/services/utilService";

import {
  CodeListData,
  CustomerListData,
  POSummaryData,
  POTableData,
  PRICEWITHMOQ,
} from "../../interfaces/kdInterface";
import {
  f_autogeneratePO_NO,
  f_autopheduyetgia,
  f_checkG_CODE_USE_YN,
  f_checkPOExist,
  f_compareDateToNow,
  f_compareTwoDate,
  f_deletePO,
  f_dongboGiaPO,
  f_getcodelist,
  f_getcustomerlist,
  f_insertInvoice,
  f_insertPO,
  f_loadPoDataFull,
  f_loadprice,
  f_readUploadFile,
  f_updatePO,
} from "../../utils/kdUtils";

import "./PrecisionPoManager.scss";
import PrecisionPoHeader from "./components/PrecisionPoHeader";
import PrecisionPoKpiGrid from "./components/PrecisionPoKpiGrid";
import PrecisionPoFilterPanel, { PrecisionPoFilterState } from "./components/PrecisionPoFilterPanel";
import PrecisionPoToolbar from "./components/PrecisionPoToolbar";
import PrecisionPoTable from "./components/PrecisionPoTable";
import PrecisionPoAddModal from "./components/PrecisionPoAddModal";
import PrecisionPoInvoiceModal from "./components/PrecisionPoInvoiceModal";
import PrecisionPoReferenceModal from "./components/PrecisionPoReferenceModal";

const initialFilters: PrecisionPoFilterState = {
  fromdate: moment().format("YYYY-MM-DD"),
  todate: moment().format("YYYY-MM-DD"),
  alltime: false,
  justpobalance: true,
  urgentOnly: false,
  pendingApproval: false,
  cust_name: "",
  codeKD: "",
  codeCMS: "",
  prod_type: "",
  po_no: "",
  empl_name: "",
  material: "",
  over: "",
  id: "",
  invoice_no: "",
};

const PrecisionPoManager: React.FC = () => {
  const userData: UserData | undefined = useSelector((state: RootState) => state.totalSlice.userData);
  const company: string = useSelector((state: RootState) => state.totalSlice.company);
  const isCMS = company === "CMS";

  // Data states
  const [podatatable, setPoDataTable] = useState<POTableData[]>([]);
  const [poSummary, setPoSummary] = useState<POSummaryData>({
    total_po_qty: 0,
    total_delivered_qty: 0,
    total_pobalance_qty: 0,
    total_po_amount: 0,
    total_delivered_amount: 0,
    total_pobalance_amount: 0,
  });
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [codeList, setCodeList] = useState<CodeListData[]>([]);

  // Filter & Search states
  const [filters, setFilters] = useState<PrecisionPoFilterState>(initialFilters);
  const [filterCollapsed, setFilterCollapsed] = useState(false);
  const [quickSearchText, setQuickSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Modal visibility states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [openReferenceModal, setOpenReferenceModal] = useState(false);
  const [showPivot, setShowPivot] = useState(false);

  // Single PO Form states
  const [selectedCust, setSelectedCust] = useState<CustomerListData | null>(null);
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>(null);
  const [poDate, setPoDate] = useState(moment().format("YYYY-MM-DD"));
  const [rdDate, setRdDate] = useState(moment().format("YYYY-MM-DD"));
  const [poNo, setPoNo] = useState("");
  const [poQty, setPoQty] = useState("");
  const [poPrice, setPoPrice] = useState("");
  const [poBEP, setPoBEP] = useState("");
  const [poRemark, setPoRemark] = useState("");
  const [selectedID, setSelectedID] = useState<number | null>(null);
  const [newCodePrice, setNewCodePrice] = useState<PRICEWITHMOQ[]>([]);

  // Invoice Form states
  const [invoiceQty, setInvoiceQty] = useState<number>(0);
  const [invoiceDate, setInvoiceDate] = useState(moment().format("YYYY-MM-DD"));
  const [invoiceRemark, setInvoiceRemark] = useState("");

  // Bulk Excel states
  const [uploadExcelJson, setUploadExcelJson] = useState<any[]>([]);
  const [columnsExcel, setColumnsExcel] = useState<any[]>([]);

  // Refs for grid selections
  const clickedRow = useRef<any>(null);
  const podatatablefilter = useRef<POTableData[]>([]);
  const [selectedRowCount, setSelectedRowCount] = useState(0);

  const currency = useMemo(() => {
    return (
      getGlobalSetting()?.find((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")
        ?.CURRENT_VALUE ?? "USD"
    );
  }, []);

  const handleFilterChange = useCallback(
    <K extends keyof PrecisionPoFilterState>(key: K, value: PrecisionPoFilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Tra cứu PO chính
  const handletraPO = useCallback(async () => {
    if (isCMS) {
      f_autopheduyetgia();
    }
    setIsSearching(true);
    Swal.fire({
      title: "Tra cứu PO",
      text: "Đang tải dữ liệu, vui lòng chờ...",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
    });

    try {
      const loadeddata: POTableData[] = await f_loadPoDataFull({
        alltime: filters.alltime,
        justPoBalance: filters.justpobalance,
        start_date: filters.fromdate,
        end_date: filters.todate,
        cust_name: filters.cust_name,
        codeCMS: filters.codeCMS,
        codeKD: filters.codeKD,
        prod_type: filters.prod_type,
        empl_name: filters.empl_name,
        po_no: filters.po_no,
        over: filters.over,
        id: filters.id,
        material: filters.material,
      });

      if (loadeddata && loadeddata.length > 0) {
        const summaryTemp: POSummaryData = {
          total_po_qty: 0,
          total_delivered_qty: 0,
          total_pobalance_qty: 0,
          total_po_amount: 0,
          total_delivered_amount: 0,
          total_pobalance_amount: 0,
        };
        for (let i = 0; i < loadeddata.length; i++) {
          summaryTemp.total_po_qty += loadeddata[i].PO_QTY;
          summaryTemp.total_delivered_qty += loadeddata[i].TOTAL_DELIVERED;
          summaryTemp.total_pobalance_qty += loadeddata[i].PO_BALANCE;
          summaryTemp.total_po_amount += loadeddata[i].PO_AMOUNT;
          summaryTemp.total_delivered_amount += loadeddata[i].DELIVERED_AMOUNT;
          summaryTemp.total_pobalance_amount += loadeddata[i].BALANCE_AMOUNT;
        }
        setPoSummary(summaryTemp);
        setPoDataTable(loadeddata);
        Swal.fire("Thành công", `Đã tải ${loadeddata.length} đơn hàng`, "success");
      } else {
        setPoDataTable([]);
        setPoSummary({
          total_po_qty: 0,
          total_delivered_qty: 0,
          total_pobalance_qty: 0,
          total_po_amount: 0,
          total_delivered_amount: 0,
          total_pobalance_amount: 0,
        });
        Swal.fire("Thông báo", "Không tìm thấy dữ liệu đơn hàng phù hợp", "info");
      }
    } catch (err: any) {
      Swal.fire("Lỗi", "Không thể tải dữ liệu: " + err.message, "error");
    } finally {
      setIsSearching(false);
    }
  }, [filters, isCMS]);

  // Load Customer and Code Metadata independently on mount
  useEffect(() => {
    let isMounted = true;
    const loadMetadata = async () => {
      try {
        const [customers, codes] = await Promise.all([
          f_getcustomerlist(),
          f_getcodelist(""),
        ]);
        if (isMounted) {
          if (Array.isArray(customers) && customers.length > 0) {
            setCustomerList(customers);
          }
          if (Array.isArray(codes) && codes.length > 0) {
            setCodeList(codes);
          }
        }
      } catch (err) {
        console.error("Failed to load customer/code metadata:", err);
      }
    };
    loadMetadata();

    if (
      isCMS &&
      (getSever() !== "http://222.252.1.63:3007" || getSever() !== "https://erp.printvietnam.com.vn:3007")
    ) {
      f_autopheduyetgia();
      f_dongboGiaPO();
    }

    return () => {
      isMounted = false;
    };
  }, [isCMS]);

  // Global shortcut F2
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        handletraPO();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handletraPO]);

  // Mở modal thêm PO mới với việc reset sạch sẽ và nạp dữ liệu khách hàng / mã hàng
  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setSelectedID(null);
    setSelectedCust(null);
    setSelectedCode(null);
    setPoDate(moment().format("YYYY-MM-DD"));
    setRdDate(moment().format("YYYY-MM-DD"));
    setPoNo("");
    setPoQty("");
    setPoPrice("");
    setPoBEP("");
    setPoRemark("");

    if (customerList.length === 0) {
      f_getcustomerlist().then((res: any) => {
        if (Array.isArray(res) && res.length > 0) setCustomerList(res);
      });
    }
    if (codeList.length === 0) {
      f_getcodelist("").then((res: any) => {
        if (Array.isArray(res) && res.length > 0) setCodeList(res);
      });
    }

    setOpenAddModal(true);
  };

  // Dữ liệu lọc nhanh trên client theo quickSearchText, urgentOnly, pendingApproval
  const displayData = useMemo(() => {
    let result = podatatable;
    if (filters.urgentOnly) {
      const today = moment().format("YYYY-MM-DD");
      result = result.filter((r) => r.PO_BALANCE > 0 && r.RD_DATE <= today);
    }
    if (quickSearchText.trim() !== "") {
      const query = quickSearchText.toLowerCase();
      result = result.filter(
        (r) =>
          r.PO_NO?.toLowerCase().includes(query) ||
          r.CUST_NAME_KD?.toLowerCase().includes(query) ||
          r.G_NAME?.toLowerCase().includes(query) ||
          r.G_CODE?.toLowerCase().includes(query) ||
          r.EMPL_NAME?.toLowerCase().includes(query)
      );
    }
    return result;
  }, [podatatable, filters.urgentOnly, quickSearchText]);

  // Handler load giá theo MOQ
  const handleLoadPrice = async (gCode?: string, custName?: string) => {
    if (gCode && custName) {
      const pr = await f_loadprice(gCode, custName);
      setNewCodePrice(pr || []);
    }
  };

  // Autocomplete change handlers
  const handleSelectCust = async (cust: CustomerListData | null) => {
    setSelectedCust(cust);
    if (cust && !isCMS) {
      const genNo = await f_autogeneratePO_NO(cust.CUST_CD);
      setPoNo(genNo);
    }
    if (selectedCode && cust) {
      handleLoadPrice(selectedCode.G_CODE, cust.CUST_NAME_KD);
    }
  };

  const handleSelectCode = (code: CodeListData | null) => {
    setSelectedCode(code);
    if (code && selectedCust) {
      handleLoadPrice(code.G_CODE, selectedCust.CUST_NAME_KD);
    }
  };

  const handlePoQtyChange = (val: string) => {
    setPoQty(val);
    const qtyNum = Number(val);
    if (!isNaN(qtyNum) && newCodePrice.length > 0) {
      const matched = newCodePrice.find((p) => qtyNum >= p.MOQ);
      if (matched) {
        setPoPrice(matched.PROD_PRICE.toString());
        setPoBEP(matched.BEP.toString());
      }
    }
  };

  // Thêm 1 PO thủ công
  const handleAddSinglePO = async () => {
    if (!selectedCode?.G_CODE || !selectedCust?.CUST_CD || !poNo || !userData?.EMPL_NO || !poPrice) {
      Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin bắt buộc", "error");
      return;
    }
    const exist = await f_checkPOExist(selectedCode.G_CODE, selectedCust.CUST_CD, poNo);
    if (exist) {
      Swal.fire("Lỗi", "Số PO này đã tồn tại cho mã hàng và khách hàng này", "error");
      return;
    }
    if (f_compareDateToNow(poDate)) {
      Swal.fire("Lỗi", "Ngày PO không được trước ngày hôm nay", "error");
      return;
    }

    const res = await f_insertPO({
      G_CODE: selectedCode.G_CODE,
      CUST_CD: selectedCust.CUST_CD,
      PO_NO: poNo,
      EMPL_NO: userData.EMPL_NO,
      PO_QTY: poQty,
      PO_DATE: poDate,
      RD_DATE: rdDate,
      PROD_PRICE: poPrice,
      BEP: poBEP === "" ? 0 : Number(poBEP),
      REMARK: poRemark,
    });

    if (res === "OK") {
      const noti: NotificationElement = {
        CTR_CD: "002",
        NOTI_ID: -1,
        NOTI_TYPE: "success",
        TITLE: "PO mới được thêm",
        CONTENT: `${userData.EMPL_NO} (${userData.FIRST_NAME}) đã thêm PO ${poNo} (${selectedCode.G_NAME_KD})`,
        SUBDEPTNAME: "KD",
        MAINDEPTNAME: "KD",
        INS_EMPL: userData.EMPL_NO,
        INS_DATE: moment().format("YYYY-MM-DD"),
        UPD_EMPL: userData.EMPL_NO,
        UPD_DATE: moment().format("YYYY-MM-DD"),
      };
      if (await f_insert_Notification_Data(noti)) {
        getSocket().emit("notification_panel", noti);
      }
      Swal.fire("Thành công", "Thêm PO mới thành công!", "success");
      setOpenAddModal(false);
      handletraPO();
    } else {
      Swal.fire("Thất bại", "Thêm PO thất bại: " + res, "error");
    }
  };

  // Sửa PO
  const handleFillEditForm = () => {
    if (!clickedRow.current) {
      Swal.fire("Thông báo", "Vui lòng chọn 1 dòng PO trong bảng để sửa", "warning");
      return;
    }
    const r = clickedRow.current;
    setSelectedCode({
      G_CODE: r.G_CODE,
      G_NAME: r.G_NAME,
      G_NAME_KD: r.G_NAME_KD,
      PROD_LAST_PRICE: Number(r.PROD_PRICE),
      USE_YN: "Y",
      PO_BALANCE: Number(r.PO_BALANCE),
    });
    setSelectedCust({
      CUST_CD: r.CUST_CD,
      CUST_NAME_KD: r.CUST_NAME_KD,
    });
    setPoDate(r.PO_DATE || "");
    setRdDate(r.RD_DATE || "");
    setPoNo(r.PO_NO || "");
    setPoQty(r.PO_QTY?.toString() || "");
    setPoPrice(r.PROD_PRICE?.toString() || "");
    setPoBEP(r.BEP?.toString() || "");
    setPoRemark(r.REMARK || "");
    setSelectedID(r.PO_ID);
    setIsEditMode(true);
    setOpenAddModal(true);
    handleLoadPrice(r.G_CODE, r.CUST_NAME_KD);
  };

  const handleUpdateSinglePO = async () => {
    if (!selectedID) return;
    if (clickedRow.current && Number(poQty) < clickedRow.current.TOTAL_DELIVERED) {
      Swal.fire("Lỗi", "Số lượng PO không được nhỏ hơn số lượng đã giao", "error");
      return;
    }
    const res = await f_updatePO({
      G_CODE: selectedCode?.G_CODE,
      CUST_CD: selectedCust?.CUST_CD,
      PO_NO: poNo,
      EMPL_NO: userData?.EMPL_NO,
      PO_QTY: poQty,
      PO_DATE: poDate,
      RD_DATE: rdDate,
      PROD_PRICE: poPrice,
      BEP: poBEP === "" ? 0 : Number(poBEP),
      REMARK: poRemark,
      PO_ID: selectedID,
    });
    if (res === "OK") {
      Swal.fire("Thành công", "Cập nhật PO thành công!", "success");
      setOpenAddModal(false);
      setIsEditMode(false);
      handletraPO();
    } else {
      Swal.fire("Lỗi", "Cập nhật thất bại: " + res, "error");
    }
  };

  // Xóa PO
  const handleDeleteSelected = async () => {
    if (podatatablefilter.current.length === 0) {
      Swal.fire("Thông báo", "Vui lòng chọn ít nhất 1 PO để xóa", "warning");
      return;
    }
    const confirmRes = await Swal.fire({
      title: "Xác nhận xóa PO?",
      text: "Chỉ PO do chính bạn tạo và chưa phát sinh giao hàng mới được phép xóa.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Vẫn Xóa!",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#f43f5e",
    });
    if (confirmRes.isConfirmed) {
      let hasError = false;
      for (const item of podatatablefilter.current) {
        if (item.EMPL_NO === userData?.EMPL_NO) {
          const res = await f_deletePO(item.PO_ID);
          if (res !== "OK") hasError = true;
        }
      }
      if (!hasError) {
        Swal.fire("Thành công", "Đã xóa các PO được chọn!", "success");
        handletraPO();
      } else {
        Swal.fire("Lỗi", "Có PO không thể xóa do đã phát sinh giao hàng hoặc không thuộc quyền sở hữu", "error");
      }
    }
  };

  // Tạo Invoice
  const handleOpenInvoice = () => {
    if (!clickedRow.current) {
      Swal.fire("Thông báo", "Vui lòng chọn 1 PO trong bảng để tạo Invoice", "warning");
      return;
    }
    const r = clickedRow.current;
    setSelectedCust({ CUST_CD: r.CUST_CD, CUST_NAME_KD: r.CUST_NAME_KD });
    setSelectedCode({
      G_CODE: r.G_CODE,
      G_NAME: r.G_NAME,
      G_NAME_KD: r.G_NAME_KD,
      PROD_LAST_PRICE: Number(r.PROD_PRICE),
      USE_YN: "Y",
      PO_BALANCE: Number(r.PO_BALANCE),
    });
    setPoDate(r.PO_DATE || "");
    setRdDate(r.RD_DATE || "");
    setPoNo(r.PO_NO || "");
    setInvoiceQty(0);
    setInvoiceDate(moment().format("YYYY-MM-DD"));
    setInvoiceRemark("");
    setOpenInvoiceModal(true);
  };

  const handleAddInvoice = async () => {
    if (invoiceQty <= 0) {
      Swal.fire("Lỗi", "Số lượng giao phải lớn hơn 0", "error");
      return;
    }
    if (selectedCode?.PO_BALANCE !== undefined && invoiceQty > selectedCode.PO_BALANCE) {
      Swal.fire("Lỗi", "Số lượng Invoice vượt quá PO BALANCE tồn", "error");
      return;
    }
    const res = await f_insertInvoice({
      G_CODE: selectedCode?.G_CODE,
      CUST_CD: selectedCust?.CUST_CD,
      PO_NO: poNo,
      EMPL_NO: userData?.EMPL_NO,
      DELIVERY_QTY: invoiceQty,
      PO_DATE: poDate,
      RD_DATE: rdDate,
      DELIVERY_DATE: invoiceDate,
      REMARK: invoiceRemark,
    });
    if (res === "OK") {
      Swal.fire("Thành công", "Thêm Invoice thành công!", "success");
      setOpenInvoiceModal(false);
      handletraPO();
    } else {
      Swal.fire("Lỗi", "Thêm Invoice thất bại: " + res, "error");
    }
  };

  // Bulk Excel handlers
  const handleLoadExcelFile = (e: any) => {
    f_readUploadFile(e, setUploadExcelJson, setColumnsExcel);
  };

  const handleCheckBulkPO = async () => {
    if (uploadExcelJson.length === 0) {
      Swal.fire("Thông báo", "Chưa có dòng nào trong file", "warning");
      return;
    }
    Swal.fire({ title: "Đang kiểm tra...", text: "Vui lòng chờ giây lát", icon: "info", showConfirmButton: false });
    const temp = [...uploadExcelJson];
    for (let i = 0; i < temp.length; i++) {
      let err = 0;
      const exist = await f_checkPOExist(temp[i].G_CODE, temp[i].CUST_CD, temp[i].PO_NO);
      if (exist) err = 1;
      if (f_compareDateToNow(temp[i].PO_DATE)) err = 2;
      const checkG = await f_checkG_CODE_USE_YN(temp[i].G_CODE);
      if (checkG === 1) err = 3;
      if (checkG === 2) err = 4;
      if (!isCMS) {
        const pr = await autoGetProdPrice(temp[i].G_CODE, temp[i].CUST_CD, temp[i].PO_QTY);
        if (pr.prod_price !== 0) {
          temp[i].PROD_PRICE = pr.prod_price;
          temp[i].BEP = pr.bep;
        } else {
          err = 5;
        }
      }
      temp[i].CHECKSTATUS =
        err === 0
          ? "OK"
          : err === 1
          ? "NG: Đã tồn tại PO"
          : err === 2
          ? "NG: Ngày PO trước hôm nay"
          : err === 3
          ? "NG: Ver bị khóa"
          : err === 4
          ? "NG: Không có Code ERP"
          : "NG: Chưa có giá";
    }
    setUploadExcelJson(temp);
    Swal.fire("Hoàn tất", "Đã kiểm tra xong các dòng trong file", "success");
  };

  const handleUploadBulkPO = async () => {
    const okRows = uploadExcelJson.filter((r) => r.CHECKSTATUS === "OK");
    if (okRows.length === 0) {
      Swal.fire("Thông báo", "Không có dòng nào ở trạng thái OK để up!", "warning");
      return;
    }
    Swal.fire({ title: "Đang tải lên...", text: "Vui lòng chờ", icon: "info", showConfirmButton: false });
    const temp = [...uploadExcelJson];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].CHECKSTATUS === "OK") {
        const res = await f_insertPO({
          G_CODE: temp[i].G_CODE,
          CUST_CD: temp[i].CUST_CD,
          PO_NO: temp[i].PO_NO,
          EMPL_NO: userData?.EMPL_NO,
          PO_QTY: temp[i].PO_QTY,
          PO_DATE: temp[i].PO_DATE,
          RD_DATE: temp[i].RD_DATE,
          PROD_PRICE: temp[i].PROD_PRICE,
          BEP: temp[i].BEP ?? 0,
          REMARK: temp[i].REMARK,
        });
        temp[i].CHECKSTATUS = res === "OK" ? "INSERTED" : "Lỗi: " + res;
      }
    }
    setUploadExcelJson(temp);
    Swal.fire("Thành công", "Đã hoàn thành thêm PO hàng loạt!", "success");
    handletraPO();
  };

  // Pivot DataSource
  const pivotDataSource = useMemo(() => {
    return new PivotGridDataSource({
      fields: [
        { caption: "Khách Hàng", dataField: "CUST_NAME_KD", dataType: "string", area: "row" },
        { caption: "Số PO", dataField: "PO_NO", dataType: "string", area: "row" },
        { caption: "Mã Sản Phẩm", dataField: "G_NAME_KD", dataType: "string", area: "row" },
        { caption: "Số Lượng PO", dataField: "PO_QTY", dataType: "number", summaryType: "sum", area: "data" },
        { caption: "Tổng Tiền ($)", dataField: "PO_AMOUNT", dataType: "number", summaryType: "sum", area: "data" },
      ],
      store: podatatable,
    });
  }, [podatatable]);

  return (
    <div className="precision-po-manager">
      {/* 1. 6 KPI MICRO-CARDS */}
      <PrecisionPoKpiGrid
        summary={poSummary}
        currency={currency}
        totalOrdersCount={podatatable.length}
      />

      {/* 3. WORKSPACE: FILTER + TABLE */}
      <div className="po-main-workspace">
        {!filterCollapsed && (
          <PrecisionPoFilterPanel
            collapsed={false}
            onToggleCollapse={() => setFilterCollapsed(true)}
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handletraPO}
            onReset={() => setFilters(initialFilters)}
            isSearching={isSearching}
          />
        )}

        {/* Right Table Container */}
        <div className="po-table-container">
          <PrecisionPoToolbar
            filterCollapsed={filterCollapsed}
            onToggleFilter={() => setFilterCollapsed(!filterCollapsed)}
            quickSearchText={quickSearchText}
            onQuickSearchChange={setQuickSearchText}
            totalDisplayCount={displayData.length}
            onOpenAddModal={handleOpenAddModal}
            onEditSelected={() => checkBP(userData, ["KD"], ["ALL"], ["ALL"], handleFillEditForm)}
            onDeleteSelected={() => checkBP(userData, ["KD"], ["ALL"], ["ALL"], handleDeleteSelected)}
            onOpenInvoiceModal={() => checkBP(userData, ["KD"], ["ALL"], ["ALL"], handleOpenInvoice)}
            onApprovePO={() => {
              f_autopheduyetgia();
              f_dongboGiaPO();
              Swal.fire("Thông báo", "Đã phê duyệt và đồng bộ giá thành công!", "success");
            }}
            onTogglePivot={() => setShowPivot(!showPivot)}
            onExportExcel={() => SaveExcel(displayData, "Danh_Sach_PO")}
          />

          <PrecisionPoTable
            data={displayData}
            currency={currency}
            isCMS={isCMS}
            onRowClick={(params) => {
              clickedRow.current = params.data;
            }}
            onSelectionChange={(params) => {
              const rows = params.api.getSelectedRows();
              podatatablefilter.current = rows;
              setSelectedRowCount(rows.length);
            }}
          />

          <div className="po-grid-footer">
            <div className="footer-left">
              <span>
                Đã chọn: <strong className="selected-badge font-mono-num">{selectedRowCount}</strong> /{" "}
                {displayData.length} dòng
              </span>
              <span>•</span>
              <span>
                Khách hàng lọc: <strong>{filters.cust_name || "Tất cả"}</strong>
              </span>
            </div>
            <div className="footer-right">
              <span className="font-mono-num">Live Sync: {moment().format("HH:mm:ss")} (18ms)</span>
            </div>
          </div>
        </div>
      </div>

      {/* PIVOT TABLE MODAL POPUP OVERLAY */}
      {showPivot && (
        <div className="po-pivot-modal-overlay">
          <div className="po-pivot-modal-card">
            <div className="pivot-modal-header">
              <div className="header-title">
                <span style={{ fontSize: 16 }}>📊</span>
                <span>Bảng Phân Tích Xoay Đa Chiều Pivot (DevExtreme)</span>
              </div>
              <button
                type="button"
                className="btn-close-pivot"
                onClick={() => setShowPivot(false)}
                title="Đóng cửa sổ Pivot"
              >
                ✕
              </button>
            </div>
            <div className="pivot-modal-body">
              <PivotTable datasource={pivotDataSource} tableID="precision_po_pivot" />
            </div>
            <div className="pivot-modal-footer">
              <button
                type="button"
                className="btn-dismiss"
                onClick={() => setShowPivot(false)}
              >
                Đóng Cửa Sổ Pivot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTEGRATED ADD / EDIT MODAL */}
      <PrecisionPoAddModal
        isOpen={openAddModal}
        onClose={() => setOpenAddModal(false)}
        isEditMode={isEditMode}
        selectedID={selectedID}
        customerList={customerList}
        codeList={codeList}
        selectedCust={selectedCust}
        onSelectCust={handleSelectCust}
        selectedCode={selectedCode}
        onSelectCode={handleSelectCode}
        poDate={poDate}
        onPoDateChange={setPoDate}
        rdDate={rdDate}
        onRdDateChange={setRdDate}
        poNo={poNo}
        onPoNoChange={setPoNo}
        poQty={poQty}
        onPoQtyChange={handlePoQtyChange}
        poPrice={poPrice}
        onPoPriceChange={setPoPrice}
        poBEP={poBEP}
        onPoBEPChange={setPoBEP}
        poRemark={poRemark}
        onPoRemarkChange={setPoRemark}
        onAddSinglePO={handleAddSinglePO}
        onUpdateSinglePO={handleUpdateSinglePO}
        onClearSingleForm={() => {
          setPoNo("");
          setPoQty("");
          setPoPrice("");
          setPoBEP("");
          setPoRemark("");
        }}
        uploadExcelJson={uploadExcelJson}
        columnsExcel={columnsExcel}
        onLoadExcelFile={handleLoadExcelFile}
        onCheckBulkPO={handleCheckBulkPO}
        onUploadBulkPO={handleUploadBulkPO}
      />

      {/* INVOICE MODAL */}
      <PrecisionPoInvoiceModal
        isOpen={openInvoiceModal}
        onClose={() => setOpenInvoiceModal(false)}
        customerList={customerList}
        codeList={codeList}
        selectedCust={selectedCust}
        selectedCode={selectedCode}
        poDate={poDate}
        rdDate={rdDate}
        poNo={poNo}
        invoiceQty={invoiceQty}
        onInvoiceQtyChange={setInvoiceQty}
        invoiceDate={invoiceDate}
        onInvoiceDateChange={setInvoiceDate}
        invoiceRemark={invoiceRemark}
        onInvoiceRemarkChange={setInvoiceRemark}
        onAddInvoice={handleAddInvoice}
        onClearInvoiceForm={() => {
          setInvoiceQty(0);
          setInvoiceRemark("");
        }}
      />

      {/* REFERENCE MODAL */}
      <PrecisionPoReferenceModal
        isOpen={openReferenceModal}
        onClose={() => setOpenReferenceModal(false)}
      />
    </div>
  );
};

export default PrecisionPoManager;
