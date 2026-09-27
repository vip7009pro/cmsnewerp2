import React from "react";
import { FiFilter, FiRefreshCw, FiCheck, FiX } from "react-icons/fi";

interface PrecisionBLOCKMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  testtype: string;
  setTestType: (v: string) => void;
  vendorLot: string;
  setVendorLot: (v: string) => void;
  m_lot_no: string;
  setM_LOT_NO: (v: string) => void;
  defect_phenomenon: string;
  setDefectPhenomenon: (v: string) => void;
  remark: string;
  setReMark: (v: string) => void;
  ncrId: number;
  setNCRID: (v: number) => void;
  onlyPending: boolean;
  setOnlyPending: React.Dispatch<React.SetStateAction<boolean>>;
  onApply: () => void;
  onReset: () => void;
}

export const PrecisionBLOCKMobileFilterDrawer: React.FC<PrecisionBLOCKMobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  testtype,
  setTestType,
  vendorLot,
  setVendorLot,
  m_lot_no,
  setM_LOT_NO,
  defect_phenomenon,
  setDefectPhenomenon,
  remark,
  setReMark,
  ncrId,
  setNCRID,
  onlyPending,
  setOnlyPending,
  onApply,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="precision-block-filter-drawer-backdrop" onClick={onClose}>
      <div
        className="precision-block-filter-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="filter-drawer-header">
          <div className="drawer-title">
            <FiFilter className="title-icon" />
            <span>BỘ LỌC TRA CỨU BLOCKING</span>
          </div>
          <button
            type="button"
            className="btn-close-drawer"
            onClick={onClose}
            title="Đóng bộ lọc"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="filter-drawer-body">
          {/* Phân loại hàng */}
          <div className="filter-group">
            <label className="filter-label">Phân Loại Hàng</label>
            <select
              className="filter-select"
              value={testtype}
              onChange={(e) => setTestType(e.target.value)}
            >
              <option value="ALL">ALL (Tất cả)</option>
              <option value="NVL">NVL - Nguyên vật liệu</option>
              <option value="BTP">BTP - Bán thành phẩm</option>
              <option value="SP">SP - Thành phẩm</option>
            </select>
          </div>

          {/* VENDOR LOT */}
          <div className="filter-group">
            <label className="filter-label">VENDOR LOT</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Nhập mã Lot NCC..."
              value={vendorLot}
              onChange={(e) => setVendorLot(e.target.value)}
            />
          </div>

          {/* M_LOT_NO */}
          <div className="filter-group">
            <label className="filter-label">M_LOT_NO (CMS)</label>
            <input
              type="text"
              className="filter-input font-mono"
              placeholder="Nhập mã Lot CMS ERP..."
              value={m_lot_no}
              onChange={(e) => setM_LOT_NO(e.target.value)}
            />
          </div>

          {/* DEFECT PHENOMENON */}
          <div className="filter-group">
            <label className="filter-label">Hiện Tượng Lỗi</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Nhăn, Lệch keo..."
              value={defect_phenomenon}
              onChange={(e) => setDefectPhenomenon(e.target.value)}
            />
          </div>

          {/* REMARK */}
          <div className="filter-group">
            <label className="filter-label">Remark (Ghi Chú)</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Ghi chú thẩm định..."
              value={remark}
              onChange={(e) => setReMark(e.target.value)}
            />
          </div>

          {/* NCR_ID */}
          <div className="filter-group">
            <label className="filter-label">NCR ID</label>
            <input
              type="number"
              className="filter-input font-mono font-bold"
              placeholder="0 (Tất cả NCR)"
              value={ncrId || ""}
              onChange={(e) => setNCRID(parseInt(e.target.value, 10) || 0)}
            />
          </div>

          {/* Toggle ONLY PENDING */}
          <div className="filter-checkbox-card">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={onlyPending}
                onChange={(e) => setOnlyPending(e.target.checked)}
              />
              <span className="checkbox-label">
                <strong>Chỉ Lọc Lô PENDING</strong> (Ẩn các lô đã hoàn tất)
              </span>
            </label>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="filter-drawer-footer">
          <button
            type="button"
            className="btn-drawer-reset"
            onClick={onReset}
          >
            <FiRefreshCw size={13} />
            <span>Đặt Lại</span>
          </button>

          <button
            type="button"
            className="btn-drawer-apply"
            onClick={() => {
              onApply();
              onClose();
            }}
          >
            <FiCheck size={14} />
            <span>Áp Dụng Lọc</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrecisionBLOCKMobileFilterDrawer;
