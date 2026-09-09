import React, { memo } from "react";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import { FiX, FiInfo, FiCheck, FiPlusCircle } from "react-icons/fi";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { CodeListData, CustomerListData } from "../../interfaces/kdInterface";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /* Data */
  customerList: CustomerListData[];
  codeList: CodeListData[];
  selectedCust: CustomerListData | null | undefined;
  selectedCode: CodeListData | null | undefined;
  newpono: string;
  newinvoiceQTY: number;
  newinvoicedate: string;
  newinvoiceRemark: string;
  isEditMode: boolean;
  /* Handlers */
  onCustChange: (value: CustomerListData | null) => void;
  onCodeChange: (value: CodeListData | null) => void;
  onPoNoChange: (value: string) => void;
  onQtyChange: (value: number) => void;
  onDateChange: (value: string) => void;
  onRemarkChange: (value: string) => void;
  onAdd: () => void;
  onUpdate: () => void;
  onClear: () => void;
}

const filterOptions = createFilterOptions({ matchFrom: "any" as const, limit: 100 });

const PrecisionInvoiceModals: React.FC<Props> = ({
  isOpen,
  onClose,
  customerList,
  codeList,
  selectedCust,
  selectedCode,
  newpono,
  newinvoiceQTY,
  newinvoicedate,
  newinvoiceRemark,
  isEditMode,
  onCustChange,
  onCodeChange,
  onPoNoChange,
  onQtyChange,
  onDateChange,
  onRemarkChange,
  onAdd,
  onUpdate,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="stitch-inv__modal-overlay" onClick={onClose}>
      <div className="stitch-inv__modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="stitch-inv__modal-header">
          <div className="stitch-inv__modal-header-left">
            <div className="stitch-inv__modal-header-icon">
              <FaFileInvoiceDollar />
            </div>
            <div className="stitch-inv__modal-header-text">
              <h3>{isEditMode ? "Cập Nhật Invoice" : "Thêm Invoice Mới"} (KD2)</h3>
              <p>Invoice Entry • Direct ERP Sync</p>
            </div>
          </div>
          <button className="stitch-inv__modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Body */}
        <div className="stitch-inv__modal-body stitch-inv-autocomplete">
          <div className="stitch-inv__modal-grid">
            {/* Col 1 */}
            <div className="stitch-inv__modal-col">
              <div className="stitch-inv__modal-field">
                <span className="stitch-inv__modal-label">
                  Khách hàng <span className="required">*</span>
                </span>
                <Autocomplete
                  size="small"
                  disablePortal
                  options={customerList}
                  getOptionLabel={(opt: CustomerListData) =>
                    `${opt.CUST_CD}: ${opt.CUST_NAME_KD}`
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Select customer" />
                  )}
                  value={selectedCust ?? null}
                  onChange={(_, newValue) => onCustChange(newValue)}
                />
              </div>

              <div className="stitch-inv__modal-field">
                <span className="stitch-inv__modal-label">
                  Code Hàng (Product Code) <span className="required">*</span>
                </span>
                <Autocomplete
                  size="small"
                  disablePortal
                  options={codeList}
                  filterOptions={filterOptions}
                  getOptionLabel={(opt: CodeListData | any) =>
                    `${opt.G_CODE}: ${opt.G_NAME_KD}:${opt.G_NAME}`
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Select code" />
                  )}
                  value={selectedCode ?? null}
                  onChange={(_, newValue) => onCodeChange(newValue)}
                />
              </div>

              <div className="stitch-inv__modal-field">
                <span className="stitch-inv__modal-label">
                  Số PO (PO Number) <span className="required">*</span>
                </span>
                <TextField
                  size="small"
                  value={newpono}
                  onChange={(e) => onPoNoChange(e.target.value)}
                  label="Nhập số PO..."
                  variant="outlined"
                />
              </div>
            </div>

            {/* Col 2 */}
            <div className="stitch-inv__modal-col">
              <div className="stitch-inv__modal-field">
                <span className="stitch-inv__modal-label">
                  Invoice QTY (Số lượng giao) <span className="required">*</span>
                </span>
                <TextField
                  size="small"
                  type="number"
                  value={newinvoiceQTY}
                  onChange={(e) => onQtyChange(Number(e.target.value))}
                  label="INVOICE QTY"
                  variant="outlined"
                />
              </div>

              <div className="stitch-inv__modal-field">
                <span className="stitch-inv__modal-label">
                  Ngày Invoice / Delivery Date
                </span>
                <input
                  className="stitch-inv__filter-input stitch-inv__filter-input--date"
                  type="date"
                  value={newinvoicedate.slice(0, 10)}
                  onChange={(e) => onDateChange(e.target.value)}
                />
              </div>

              <div className="stitch-inv__modal-field">
                <span className="stitch-inv__modal-label">Ghi Chú (Remark)</span>
                <TextField
                  size="small"
                  value={newinvoiceRemark}
                  onChange={(e) => onRemarkChange(e.target.value)}
                  label="Nhập ghi chú đơn giao..."
                  variant="outlined"
                />
              </div>
            </div>
          </div>

          {/* Info bar */}
          <div className="stitch-inv__modal-info">
            <FiInfo size={12} />
            <span>
              Invoice ID sẽ tự động khởi tạo theo quy tắc{" "}
              <strong>DLV-YYYY-NNNNN</strong> sau khi nhấn lưu.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="stitch-inv__modal-footer">
          <button className="stitch-inv__btn stitch-inv__btn--outline" onClick={onClear}>
            Làm Mới (Clear)
          </button>
          <div className="stitch-inv__modal-footer-right">
            <button className="stitch-inv__btn stitch-inv__btn--outline" onClick={onClose}>
              Đóng (Close)
            </button>
            {isEditMode ? (
              <button className="stitch-inv__btn stitch-inv__btn--primary" onClick={onUpdate}>
                <FiCheck size={12} /> Cập Nhật Invoice
              </button>
            ) : (
              <button className="stitch-inv__btn stitch-inv__btn--emerald" onClick={onAdd}>
                <FiPlusCircle size={12} /> + Thêm Mới
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PrecisionInvoiceModals);
