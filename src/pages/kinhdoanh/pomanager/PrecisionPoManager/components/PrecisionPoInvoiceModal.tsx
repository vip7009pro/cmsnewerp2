import React from "react";
import moment from "moment";
import { CodeListData, CustomerListData } from "../../../interfaces/kdInterface";
import { MdReceiptLong, MdClose, MdAdd } from "react-icons/md";
import "../PrecisionPoModals.scss";

interface PrecisionPoInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerList: CustomerListData[];
  codeList: CodeListData[];
  selectedCust: CustomerListData | null;
  selectedCode: CodeListData | null;
  poDate: string;
  rdDate: string;
  poNo: string;
  invoiceQty: number;
  onInvoiceQtyChange: (qty: number) => void;
  invoiceDate: string;
  onInvoiceDateChange: (date: string) => void;
  invoiceRemark: string;
  onInvoiceRemarkChange: (remark: string) => void;
  onAddInvoice: () => void;
  onClearInvoiceForm: () => void;
}

const PrecisionPoInvoiceModal: React.FC<PrecisionPoInvoiceModalProps> = ({
  isOpen,
  onClose,
  selectedCust,
  selectedCode,
  poDate,
  poNo,
  invoiceQty,
  onInvoiceQtyChange,
  invoiceDate,
  onInvoiceDateChange,
  invoiceRemark,
  onInvoiceRemarkChange,
  onAddInvoice,
  onClearInvoiceForm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="precision-modal-backdrop">
      <div className="precision-modal-card">
        {/* MODAL HEADER */}
        <header className="modal-header">
          <div className="header-left">
            <div className="header-icon-box icon-teal">
              <MdReceiptLong size={18} />
            </div>
            <div className="header-title-wrap">
              <div className="title-with-chip">
                <h2>Tạo Invoice Giao Hàng Mới (NEW INV)</h2>
                <span className="chip-badge chip-teal">
                  INV-{moment().format("YYYYMMDD")}-01
                </span>
              </div>
              <p className="header-subtitle">
                Xuất hóa đơn giao hàng đợt thực tế từ số đơn hàng PO khách hàng có sẵn
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
            title="Đóng cửa sổ"
          >
            <MdClose size={20} />
          </button>
        </header>

        {/* FORM BODY */}
        <form
          className="modal-body custom-scrollbar"
          onSubmit={(e) => {
            e.preventDefault();
            onAddInvoice();
          }}
        >
          {/* Row 1: Khách Hàng & Code Hàng */}
          <div className="form-grid-2">
            <div className="form-field">
              <label className="field-label">
                <span>Khách Hàng (Customer)</span>
                <span className="req-star">*</span>
              </label>
              <input
                type="text"
                readOnly
                value={`${selectedCust?.CUST_CD || ""}: ${selectedCust?.CUST_NAME_KD || ""}`}
                className="stitch-input readonly-input font-bold-blue"
              />
            </div>
            <div className="form-field">
              <label className="field-label">
                <span>Code Hàng (Part No)</span>
                <span className="req-star">*</span>
              </label>
              <input
                type="text"
                readOnly
                value={`${selectedCode?.G_CODE || ""}: ${selectedCode?.G_NAME_KD || ""}`}
                className="stitch-input readonly-input font-mono-val font-bold-blue"
              />
            </div>
          </div>

          {/* Row 2: Số PO Liên Kết & Số Lượng Giao */}
          <div className="form-grid-2">
            <div className="form-field">
              <label className="field-label">
                <span>Số PO (PO_NO) Liên Kết</span>
                <span className="req-star">*</span>
              </label>
              <input
                type="text"
                readOnly
                value={poNo}
                className="stitch-input readonly-input font-bold-blue"
              />
            </div>
            <div className="form-field">
              <div className="field-label">
                <span>
                  Số Lượng Giao (INVOICE QTY) <span className="req-star">*</span>
                </span>
                <span className="label-subtext-teal">
                  Tồn PO: {(selectedCode?.PO_BALANCE || 0).toLocaleString("en-US")} EA
                </span>
              </div>
              <div className="input-badge-wrap">
                <input
                  type="number"
                  placeholder="0"
                  value={invoiceQty || ""}
                  onChange={(e) => onInvoiceQtyChange(Number(e.target.value))}
                  style={{ color: "#0d9488", fontWeight: 700 }}
                />
                <span className="unit-badge">EA</span>
              </div>
            </div>
          </div>

          {/* Row 3: Ngày PO & Ngày Invoice */}
          <div className="form-grid-2">
            <div className="form-field">
              <label className="field-label">
                <span>Ngày PO (PO Date)</span>
              </label>
              <input
                type="date"
                readOnly
                value={poDate.slice(0, 10)}
                className="stitch-input readonly-input font-mono-val"
              />
            </div>
            <div className="form-field">
              <label className="field-label">
                <span>Ngày Invoice (Delivery Date)</span>
                <span className="req-star">*</span>
              </label>
              <input
                type="date"
                value={invoiceDate.slice(0, 10)}
                onChange={(e) => onInvoiceDateChange(e.target.value)}
                className="stitch-input font-mono-val"
              />
            </div>
          </div>

          {/* Row 4: Ghi Chú */}
          <div className="form-field">
            <label className="field-label">
              <span>Ghi Chú Invoice (Remark)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Ghi chú biển số xe giao hàng, phân xưởng giao nhận (VD: Giao kho SEVT Yên Bình Cổng 3)..."
              value={invoiceRemark}
              onChange={(e) => onInvoiceRemarkChange(e.target.value)}
              className="stitch-textarea"
            />
          </div>

          {/* Summary Shipping Notice */}
          <div className="shipping-notice-card">
            <div className="notice-dot"></div>
            <div className="notice-text">
              Sau khi bấm <strong>"Thêm Invoice"</strong>, hệ thống tự động trừ tồn đơn hàng PO và phát hành phiếu xuất kho kèm mã Barcode 128.
            </div>
          </div>
        </form>

        {/* MODAL FOOTER */}
        <footer className="modal-footer">
          <div className="footer-left">
            <button
              type="button"
              onClick={onClearInvoiceForm}
              className="btn-white"
            >
              Xóa Trắng
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
            >
              Đóng
            </button>
          </div>

          <button
            type="button"
            onClick={onAddInvoice}
            className="btn-submit-emerald"
          >
            <MdAdd size={16} />
            <span>Thêm Invoice (F8)</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPoInvoiceModal);
