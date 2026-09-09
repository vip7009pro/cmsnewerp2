import React, { useCallback, useEffect, useRef, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getSocket, getUserData } from "../../../api/Api";
import { checkBP } from "../../../api/services/permissionService";
import { f_insert_Notification_Data } from "../../../api/services/notificationService";
import { SaveExcel } from "../../../api/services/excelService";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
import { UserData } from "../../../api/GlobalInterface";
import PivotTable from "../../../components/PivotChart/PivotChart";
import {
  CodeListData,
  CustomerListData,
  InvoiceSummaryData,
  InvoiceTableData,
} from "../interfaces/kdInterface";
import {
  f_checkPOInfo,
  f_compareDateToNow,
  f_compareTwoDate,
  f_deleteInvoice,
  f_getcodelist,
  f_getcustomerlist,
  f_insertInvoice,
  f_loadInvoiceDataFull,
  f_updateInvoice,
  f_updateInvoiceNo,
} from "../utils/kdUtils";

import "./PrecisionInvoiceManager/PrecisionInvoiceManager.scss";
import PrecisionInvoiceFilterPanel, {
  InvoiceFilterState,
} from "./PrecisionInvoiceManager/PrecisionInvoiceFilterPanel";
import PrecisionInvoiceToolbar from "./PrecisionInvoiceManager/PrecisionInvoiceToolbar";
import PrecisionInvoiceTable from "./PrecisionInvoiceManager/PrecisionInvoiceTable";
import PrecisionInvoiceModals from "./PrecisionInvoiceManager/PrecisionInvoiceModals";
import PrecisionInvoiceBulkImport from "./PrecisionInvoiceManager/PrecisionInvoiceBulkImport";
import {
  getInvoiceColumns,
  createPivotDataSource,
} from "./PrecisionInvoiceManager/PrecisionInvoiceColumns";
import { FiX } from "react-icons/fi";

const initialFilters: InvoiceFilterState = {
  fromdate: moment().format("YYYY-MM-DD"),
  todate: moment().format("YYYY-MM-DD"),
  alltime: false,
  codeKD: "",
  codeCMS: "",
  empl_name: "",
  cust_name: "",
  prod_type: "",
  id: "",
  po_no: "",
  material: "",
  over: "",
  invoice_no: "",
};

const InvoiceManager: React.FC = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  // ── Modal & View states ──
  const [openBulkModal, setOpenBulkModal] = useState(false);
  const [filterCollapsed, setFilterCollapsed] = useState(false);

  // ── Data states ──
  const [invoicedatatable, setInvoiceDataTable] = useState<InvoiceTableData[]>([]);
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

  // ── Filter states ──
  const [filters, setFilters] = useState<InvoiceFilterState>(initialFilters);

  // ── Modal states ──
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>(null);
  const [selectedCust, setSelectedCust] = useState<CustomerListData | null>(null);
  const [newpono, setNewPoNo] = useState("");
  const [newinvoiceQTY, setNewInvoiceQty] = useState<number>(0);
  const [newinvoicedate, setNewInvoiceDate] = useState(moment().format("YYYY-MM-DD"));
  const [newinvoiceRemark, setNewInvoiceRemark] = useState("");
  const [selectedID, setSelectedID] = useState<number | null>(null);
  const [old_invoice_qty, setOldInvoiceQty] = useState(0);

  // ── Pivot ──
  const [showPivot, setShowPivot] = useState(false);

  // ── Refs ──
  const invoicedatatablefilter = useRef<InvoiceTableData[]>([]);
  const clickedRow = useRef<any>(null);
  const invoice_no_ref = useRef<string>("");

  // ── Columns (memoized at module level) ──
  const columns = getInvoiceColumns();

  // ── Init ──
  useEffect(() => {
    (async () => {
      setCustomerList(await f_getcustomerlist());
      setCodeList(await f_getcodelist(""));
    })();
  }, []);

  // ── Filter handlers ──
  const handleFilterChange = useCallback(
    (key: keyof InvoiceFilterState, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  // ── Search ──
  const handleSearch = useCallback(async () => {
    Swal.fire({
      title: "Tra cứu Invoices",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    invoicedatatablefilter.current = [];
    const loadeddata = await f_loadInvoiceDataFull({
      alltime: filters.alltime,
      justPoBalance: true,
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
      invoice_no: filters.invoice_no,
    });
    if (loadeddata.length > 0) {
      const summary: InvoiceSummaryData = {
        total_po_qty: 0,
        total_delivered_qty: 0,
        total_pobalance_qty: 0,
        total_po_amount: 0,
        total_delivered_amount: 0,
        total_pobalance_amount: 0,
      };
      for (const row of loadeddata) {
        summary.total_delivered_qty += row.DELIVERY_QTY;
        summary.total_delivered_amount += row.DELIVERED_AMOUNT;
      }
      setInvoiceSummary(summary);
      setInvoiceDataTable(loadeddata);
      Swal.fire("Thông báo", "Đã load " + loadeddata.length + " dòng", "success");
    } else {
      setInvoiceDataTable([]);
      Swal.close();
    }
  }, [filters]);

  // ── Clear modal form ──
  const clearForm = useCallback(() => {
    setNewPoNo("");
    setNewInvoiceQty(0);
    setNewInvoiceDate(moment().format("YYYY-MM-DD"));
    setNewInvoiceRemark("");
    setSelectedCode(null);
    setSelectedCust(null);
    setSelectedID(null);
    setIsEditMode(false);
  }, []);

  // ── NEW Invoice ──
  const handleNewInvoice = useCallback(() => {
    checkBP(userData, ["KD"], ["ALL"], ["ALL"], () => {
      clearForm();
      setIsEditMode(false);
      setOpenModal(true);
    });
  }, [userData, clearForm]);

  // ── EDIT Invoice ──
  const handleEditInvoice = useCallback(() => {
    checkBP(userData, ["KD"], ["ALL"], ["ALL"], () => {
      if (invoicedatatablefilter.current.length === 1) {
        const row = clickedRow.current;
        setSelectedCode({
          G_CODE: row?.G_CODE ?? "",
          G_NAME: row?.G_NAME ?? "",
          G_NAME_KD: row?.G_NAME_KD ?? "",
          PROD_LAST_PRICE: Number(row?.PROD_PRICE),
          USE_YN: "Y",
        });
        setSelectedCust({
          CUST_CD: row?.CUST_CD ?? "",
          CUST_NAME_KD: row?.CUST_NAME_KD ?? "",
        });
        setNewInvoiceQty(row?.DELIVERY_QTY ?? 0);
        setNewPoNo(row?.PO_NO ?? "");
        setNewInvoiceDate(moment().format("YYYY-MM-DD"));
        setNewInvoiceRemark(row?.REMARK ?? "");
        setSelectedID(row?.DELIVERY_ID ?? null);
        setOldInvoiceQty(row?.DELIVERY_QTY ?? 0);
        setIsEditMode(true);
        setOpenModal(true);
      } else {
        Swal.fire("Thông báo", "Lỗi: Chọn đúng 1 Invoice để sửa", "error");
      }
    });
  }, [userData]);

  // ── ADD 1 Invoice ──
  const handleAdd1Invoice = useCallback(async () => {
    let err_code: number = 0;
    let po_info = await f_checkPOInfo(selectedCode?.G_CODE ?? "", selectedCust?.CUST_CD ?? "", newpono);
    err_code = po_info.length > 0 ? (newinvoiceQTY > po_info[0].PO_BALANCE ? 5 : err_code) : 1;
    let cmp = po_info.length > 0 ? f_compareTwoDate(newinvoicedate, po_info[0].PO_DATE.substring(0, 10)) : err_code;
    err_code = cmp === -1 ? 6 : err_code;
    err_code = f_compareDateToNow(newinvoicedate) ? 2 : err_code;
    err_code = selectedCode?.USE_YN === "N" ? 3 : err_code;
    if (!selectedCode?.G_CODE || !selectedCust?.CUST_CD || !newinvoicedate || !userData?.EMPL_NO || newinvoiceQTY === 0) {
      err_code = 4;
    }
    if (err_code === 0) {
      const kq = await f_insertInvoice({
        G_CODE: selectedCode?.G_CODE,
        CUST_CD: selectedCust?.CUST_CD,
        PO_NO: newpono,
        EMPL_NO: userData?.EMPL_NO,
        DELIVERY_QTY: newinvoiceQTY,
        DELIVERY_DATE: newinvoicedate,
        REMARK: newinvoiceRemark,
        INVOICE_NO: "",
      });
      if (kq === "OK") {
        const noti: NotificationElement = {
          CTR_CD: "002", NOTI_ID: -1, NOTI_TYPE: "success",
          TITLE: "Invoice mới",
          CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm Invoice mới code ${selectedCode?.G_CODE} - (${selectedCode?.G_NAME}), số lượng: ${newinvoiceQTY} cho KH ${selectedCust?.CUST_CD} - ${selectedCust?.CUST_NAME_KD}.`,
          SUBDEPTNAME: "KD", MAINDEPTNAME: "KD",
          INS_EMPL: "NHU1903", INS_DATE: "2024-12-30", UPD_EMPL: "NHU1903", UPD_DATE: "2024-12-30",
        };
        if (await f_insert_Notification_Data(noti)) getSocket().emit("notification_panel", noti);
        Swal.fire("Thông báo", "Thêm Invoice mới thành công", "success");
      } else {
        Swal.fire("Thông báo", "Thêm Invoice thất bại: " + kq, "error");
      }
    } else {
      const msgs: Record<number, string> = {
        1: "NG: Không tồn tại PO", 2: "NG: Ngày Invoice không được trước ngày hôm nay",
        3: "NG: Ver này đã bị khóa", 4: "NG: Không để trống thông tin bắt buộc",
        5: "NG: Số lượng giao hàng nhiều hơn PO BALANCE", 6: "NG: Ngày Invoice không được trước ngày PO",
      };
      Swal.fire("Thông báo", msgs[err_code] ?? "Lỗi", "error");
    }
  }, [selectedCode, selectedCust, newpono, newinvoiceQTY, newinvoicedate, newinvoiceRemark, userData]);

  // ── UPDATE Invoice ──
  const handleUpdateInvoice = useCallback(async () => {
    let err_code: number = 0;
    let po_info = await f_checkPOInfo(selectedCode?.G_CODE ?? "", selectedCust?.CUST_CD ?? "", newpono);
    err_code = po_info.length > 0 ? (newinvoiceQTY > po_info[0].PO_BALANCE + old_invoice_qty ? 5 : err_code) : 1;
    let cmp = f_compareTwoDate(newinvoicedate, po_info[0]?.PO_DATE?.substring(0, 10));
    err_code = cmp === -1 ? 6 : err_code;
    err_code = f_compareDateToNow(newinvoicedate) ? 2 : err_code;
    err_code = selectedCode?.USE_YN === "N" ? 3 : err_code;
    if (!selectedCode?.G_CODE || !selectedCust?.CUST_CD || !newinvoicedate || !userData?.EMPL_NO || newinvoiceQTY === 0) {
      err_code = 4;
    }
    if (err_code === 0) {
      const kq = await f_updateInvoice({
        G_CODE: selectedCode?.G_CODE, CUST_CD: selectedCust?.CUST_CD, PO_NO: newpono,
        EMPL_NO: userData?.EMPL_NO, DELIVERY_DATE: newinvoicedate, DELIVERY_QTY: newinvoiceQTY,
        REMARK: newinvoiceRemark, DELIVERY_ID: selectedID,
      });
      Swal.fire("Thông báo", kq === "OK" ? "Update Invoice thành công" : "Update thất bại: " + kq, kq === "OK" ? "success" : "error");
    } else {
      const msgs: Record<number, string> = {
        1: "NG: Không tồn tại PO", 2: "NG: Ngày không được trước hôm nay",
        3: "NG: Ver đã bị khóa", 4: "NG: Không để trống thông tin bắt buộc",
        5: "NG: Giao hàng nhiều hơn PO Balance", 6: "NG: Ngày Invoice trước ngày PO",
      };
      Swal.fire("Thông báo", msgs[err_code] ?? "Lỗi", "error");
    }
  }, [selectedCode, selectedCust, newpono, newinvoiceQTY, newinvoicedate, newinvoiceRemark, userData, selectedID, old_invoice_qty]);

  // ── DELETE Invoice ──
  const handleDeleteInvoice = useCallback(() => {
    checkBP(userData, ["KD"], ["ALL"], ["ALL"], () => {
      if (invoicedatatablefilter.current.length >= 1) {
        Swal.fire({
          title: "Chắc chắn muốn xóa Invoice đã chọn ?",
          text: "Sẽ chỉ xóa invoice do bạn up lên",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Vẫn Xóa!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            let err = false;
            for (const row of invoicedatatablefilter.current) {
              if (row.EMPL_NO === userData?.EMPL_NO) {
                if ((await f_deleteInvoice(row.DELIVERY_ID)) !== "OK") err = true;
              }
            }
            if (!err) {
              const noti: NotificationElement = {
                CTR_CD: "002", NOTI_ID: -1, NOTI_TYPE: "warning",
                TITLE: "Xóa Invoice",
                CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}) đã xóa PO_NO ${invoicedatatablefilter.current.map((x) => x.PO_NO).join(", ")}`,
                SUBDEPTNAME: "KD", MAINDEPTNAME: "KD",
                INS_EMPL: "NHU1903", INS_DATE: "2024-12-30", UPD_EMPL: "NHU1903", UPD_DATE: "2024-12-30",
              };
              if (await f_insert_Notification_Data(noti)) getSocket().emit("notification_panel", noti);
              Swal.fire("Thông báo", "Xóa Invoice thành công!", "success");
            } else {
              Swal.fire("Thông báo", "Có lỗi SQL!", "error");
            }
          }
        });
      } else {
        Swal.fire("Thông báo", "Chọn ít nhất 1 Invoice để xóa!", "error");
      }
    });
  }, [userData]);

  // ── UPDATE Invoice No ──
  const handleUpdateInvoiceNo = useCallback(() => {
    if (invoicedatatablefilter.current.length >= 1) {
      (async () => {
        let err = false;
        for (const row of invoicedatatablefilter.current) {
          if (row.EMPL_NO === userData?.EMPL_NO) {
            if ((await f_updateInvoiceNo(row.DELIVERY_ID, invoice_no_ref.current)) !== "OK") err = true;
          }
        }
        Swal.fire("Thông báo", err ? "Có lỗi SQL!" : "Update invoice no!", err ? "error" : "success");
      })();
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 Invoice để update!", "error");
    }
  }, [userData]);

  // ── Export ──
  const handleExport = useCallback(() => {
    SaveExcel(invoicedatatable, "Invoice Table");
  }, [invoicedatatable]);

  return (
    <div className="stitch-inv">
      {/* ── Main Workspace ── */}
      <div className="stitch-inv__workspace">
        {/* Filter Sidebar */}
        <aside className={`stitch-inv__sidebar${filterCollapsed ? " stitch-inv__sidebar--collapsed" : ""}`}>
          <PrecisionInvoiceFilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onReset={handleResetFilters}
            onEnterKey={handleSearch}
            invoiceSummary={invoiceSummary}
            totalRows={invoicedatatable.length}
          />
        </aside>

        {/* Content */}
        <section className="stitch-inv__content">
          <PrecisionInvoiceToolbar
            onToggleSidebar={() => setFilterCollapsed(!filterCollapsed)}
            onNewInvoice={handleNewInvoice}
            onBulkImport={() => setOpenBulkModal(true)}
            onEditInvoice={handleEditInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onUpdateInvoiceNo={handleUpdateInvoiceNo}
            onTogglePivot={() => setShowPivot(!showPivot)}
            onExport={handleExport}
            invoiceNoRef={invoice_no_ref}
          />

          <PrecisionInvoiceTable
            columns={columns}
            data={invoicedatatable}
            onRowClick={(params: any) => {
              clickedRow.current = params.data;
            }}
            onSelectionChange={(params: any) => {
              invoicedatatablefilter.current = params!.api.getSelectedRows();
            }}
          />
        </section>
      </div>

      {/* ── Bulk Import Modal ── */}
      {openBulkModal && (
        <div className="stitch-inv__modal-overlay" onClick={() => setOpenBulkModal(false)}>
          <div className="stitch-inv__modal stitch-inv__modal--bulk" onClick={(e) => e.stopPropagation()}>
            <PrecisionInvoiceBulkImport onClose={() => setOpenBulkModal(false)} />
          </div>
        </div>
      )}

      {/* ── Modal ── */}
      <PrecisionInvoiceModals
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        customerList={customerList}
        codeList={codeList}
        selectedCust={selectedCust}
        selectedCode={selectedCode}
        newpono={newpono}
        newinvoiceQTY={newinvoiceQTY}
        newinvoicedate={newinvoicedate}
        newinvoiceRemark={newinvoiceRemark}
        isEditMode={isEditMode}
        onCustChange={setSelectedCust}
        onCodeChange={(v) => { setSelectedCode(v); }}
        onPoNoChange={setNewPoNo}
        onQtyChange={setNewInvoiceQty}
        onDateChange={setNewInvoiceDate}
        onRemarkChange={setNewInvoiceRemark}
        onAdd={handleAdd1Invoice}
        onUpdate={handleUpdateInvoice}
        onClear={clearForm}
      />

      {/* ── Pivot Overlay ── */}
      {showPivot && (
        <div className="stitch-inv__pivot-overlay" onClick={() => setShowPivot(false)}>
          <div className="stitch-inv__pivot-container" onClick={(e) => e.stopPropagation()}>
            <div className="stitch-inv__pivot-header">
              <span style={{ fontWeight: 700, fontSize: 12 }}>Pivot Grid — Invoice Analysis</span>
              <button className="stitch-inv__btn stitch-inv__btn--outline" onClick={() => setShowPivot(false)}>
                <FiX size={12} /> Đóng
              </button>
            </div>
            <div className="stitch-inv__pivot-body">
              <PivotTable datasource={createPivotDataSource(invoicedatatable)} tableID="invoicePivot" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceManager;