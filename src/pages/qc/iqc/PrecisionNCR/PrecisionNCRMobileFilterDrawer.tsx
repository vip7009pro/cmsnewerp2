import React, { useCallback } from "react";
import moment from "moment";
import {
  AiOutlineClose,
  AiOutlineReload,
  AiOutlineSearch,
} from "react-icons/ai";

interface PrecisionNCRMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  // Filter states
  fromdate: string;
  setFromDate: (val: string) => void;
  todate: string;
  setToDate: (val: string) => void;
  vendor: string;
  setVendor: (val: string) => void;
  m_name: string;
  setM_Name: (val: string) => void;
  m_code: string;
  setM_Code: (val: string) => void;
  cmsLOT: string;
  setCMSLOT: (val: string) => void;
  vendorLot: string;
  setVendorLot: (val: string) => void;
  pendingOnly: boolean;
  setPendingOnly: (val: boolean) => void;
  // Actions
  onApply: () => void;
}

export const PrecisionNCRMobileFilterDrawer: React.FC<PrecisionNCRMobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  fromdate,
  setFromDate,
  todate,
  setToDate,
  vendor,
  setVendor,
  m_name,
  setM_Name,
  m_code,
  setM_Code,
  cmsLOT,
  setCMSLOT,
  vendorLot,
  setVendorLot,
  pendingOnly,
  setPendingOnly,
  onApply,
}) => {
  const handleReset = useCallback(() => {
    setFromDate(moment().format("YYYY-MM-DD"));
    setToDate(moment().format("YYYY-MM-DD"));
    setVendor("");
    setM_Name("");
    setM_Code("");
    setCMSLOT("");
    setVendorLot("");
    setPendingOnly(false);
  }, [setFromDate, setToDate, setVendor, setM_Name, setM_Code, setCMSLOT, setVendorLot, setPendingOnly]);

  const handleApply = useCallback(() => {
    onApply();
    onClose();
  }, [onApply, onClose]);

  if (!isOpen) return null;

  return (
    <div className="precision-ncr-mobile-filter-overlay" onClick={onClose}>
      <div
        className="precision-ncr-mobile-filter-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sheet Header */}
        <div className="filter-sheet__header">
          <h3>
            <AiOutlineSearch size={16} />
            <span>Bộ lọc NCR</span>
          </h3>
          <button className="btn-close-sheet" onClick={onClose}>
            <AiOutlineClose size={18} />
          </button>
        </div>

        {/* Sheet Body */}
        <div className="filter-sheet__body">
          <div className="filter-field">
            <label>TỪ NGÀY</label>
            <input
              type="date"
              value={fromdate.slice(0, 10)}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label>TỚI NGÀY</label>
            <input
              type="date"
              value={todate.slice(0, 10)}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label>TÊN LIỆU (M_NAME)</label>
            <input
              type="text"
              placeholder="SJ-203020HC"
              value={m_name}
              onChange={(e) => setM_Name(e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label>MÃ LIỆU CMS (M_CODE)</label>
            <input
              type="text"
              placeholder="A123456"
              value={m_code}
              onChange={(e) => setM_Code(e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label>VENDOR NAME</label>
            <input
              type="text"
              placeholder="SSJ, JY TECH..."
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label>LOT CMS ERP</label>
            <input
              type="text"
              placeholder="2409040001"
              value={cmsLOT}
              onChange={(e) => setCMSLOT(e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label>VENDOR LOT (LOT NCC)</label>
            <input
              type="text"
              placeholder="abcxyz123"
              value={vendorLot}
              onChange={(e) => setVendorLot(e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={pendingOnly}
                onChange={(e) => setPendingOnly(e.target.checked)}
              />
              <span>Chỉ hiện NCR Pending</span>
            </label>
          </div>
        </div>

        {/* Sheet Footer */}
        <div className="filter-sheet__footer">
          <button className="btn-reset" onClick={handleReset}>
            <AiOutlineReload size={14} />
            <span>Đặt lại</span>
          </button>
          <button className="btn-apply" onClick={handleApply}>
            <AiOutlineSearch size={14} />
            <span>Áp dụng</span>
          </button>
        </div>
      </div>
    </div>
  );
};
