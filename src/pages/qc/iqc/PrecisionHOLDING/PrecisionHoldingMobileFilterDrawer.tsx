import React from "react";
import { FiFilter, FiRefreshCw, FiCheck, FiX } from "react-icons/fi";

interface PrecisionHoldingMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fromdate: string;
  setFromDate: (v: string) => void;
  todate: string;
  setToDate: (v: string) => void;
  alltime: boolean;
  setAllTime: React.Dispatch<React.SetStateAction<boolean>>;
  m_name: string;
  setM_Name: (v: string) => void;
  m_code: string;
  setM_Code: (v: string) => void;
  mLotNo: string;
  setMLotNo: (v: string) => void;
  mStatus: string;
  setMStatus: (v: string) => void;
  ncrId: number;
  setNCRID: (v: number) => void;
  id: string;
  setID: (v: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export const PrecisionHoldingMobileFilterDrawer: React.FC<PrecisionHoldingMobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  fromdate,
  setFromDate,
  todate,
  setToDate,
  alltime,
  setAllTime,
  m_name,
  setM_Name,
  m_code,
  setM_Code,
  mLotNo,
  setMLotNo,
  mStatus,
  setMStatus,
  ncrId,
  setNCRID,
  id,
  setID,
  onApply,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="holding-filter-drawer-backdrop" onClick={onClose}>
      <div
        className="holding-filter-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="filter-drawer-header">
          <div className="drawer-title">
            <FiFilter className="title-icon" />
            <span>BỘ LỌC TRA CỨU HOLDING</span>
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
          {/* Toggle ALL TIME */}
          <div className="filter-checkbox-card">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={alltime}
                onChange={(e) => setAllTime(e.target.checked)}
              />
              <span className="checkbox-label">
                <strong>ALL TIME</strong> (Không lọc theo ngày)
              </span>
            </label>
          </div>

          {/* Từ ngày */}
          <div className="filter-group">
            <label className="filter-label">Từ Ngày</label>
            <input
              type="date"
              className="filter-input"
              disabled={alltime}
              value={fromdate.slice(0, 10)}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          {/* Tới ngày */}
          <div className="filter-group">
            <label className="filter-label">Tới Ngày</label>
            <input
              type="date"
              className="filter-input"
              disabled={alltime}
              value={todate.slice(0, 10)}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          {/* Tên Liệu */}
          <div className="filter-group">
            <label className="filter-label">Tên Liệu</label>
            <input
              type="text"
              className="filter-input"
              placeholder="SJ-203020HC..."
              value={m_name}
              onChange={(e) => setM_Name(e.target.value)}
            />
          </div>

          {/* Mã Liệu CMS */}
          <div className="filter-group">
            <label className="filter-label">Mã Liệu CMS</label>
            <input
              type="text"
              className="filter-input font-mono"
              placeholder="A0001234..."
              value={m_code}
              onChange={(e) => setM_Code(e.target.value)}
            />
          </div>

          {/* LOT CMS */}
          <div className="filter-group">
            <label className="filter-label">LOT CMS</label>
            <input
              type="text"
              className="filter-input font-mono"
              placeholder="2204280689..."
              value={mLotNo}
              onChange={(e) => setMLotNo(e.target.value)}
            />
          </div>

          {/* Trạng Thái */}
          <div className="filter-group">
            <label className="filter-label">Trạng Thái Phê Duyệt</label>
            <select
              className="filter-select"
              value={mStatus}
              onChange={(e) => setMStatus(e.target.value)}
            >
              <option value="ALL">ALL (Tất cả)</option>
              <option value="Y">ĐÃ PASS (Đạt)</option>
              <option value="N">CHƯA PASS (Chờ/Không đạt)</option>
            </select>
          </div>

          {/* NCR ID */}
          <div className="filter-group">
            <label className="filter-label">NCR ID</label>
            <input
              type="number"
              className="filter-input font-mono"
              placeholder="0 (Tất cả NCR)"
              value={ncrId || ""}
              onChange={(e) => setNCRID(parseInt(e.target.value, 10) || 0)}
            />
          </div>

          {/* Mã ID Giữ Hàng */}
          <div className="filter-group">
            <label className="filter-label">Mã ID Giữ Hàng</label>
            <input
              type="text"
              className="filter-input font-mono"
              placeholder="ID giữ hàng..."
              value={id}
              onChange={(e) => setID(e.target.value)}
            />
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

export default PrecisionHoldingMobileFilterDrawer;
