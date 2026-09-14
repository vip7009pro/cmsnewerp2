import React from "react";
import { FiFilter, FiRotateCcw, FiSearch, FiCheck, FiAlertTriangle, FiFileText } from "react-icons/fi";

interface PrecisionBLOCKSidebarProps {
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
  onSearch: () => void;
  onReset: () => void;
  onSetPass: (val: string) => void;
  onUpdateNCR: () => void;
}

export const PrecisionBLOCKSidebar: React.FC<PrecisionBLOCKSidebarProps> = ({
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
  onSearch,
  onReset,
  onSetPass,
  onUpdateNCR,
}) => {
  return (
    <aside className="precision-block-sidebar">
      {/* Header */}
      <div className="precision-block-sidebar__header">
        <span className="title">
          <FiFilter size={12} />
          BỘ LỌC TRA CỨU
        </span>
        <button
          type="button"
          className="btn-reset"
          onClick={onReset}
          title="Khôi phục mặc định"
        >
          <FiRotateCcw size={11} />
        </button>
      </div>

      {/* Body */}
      <div className="precision-block-sidebar__body">
        {/* Field 1: Phân loại hàng */}
        <div className="form-group">
          <label>Phân loại hàng:</label>
          <select
            className="input-control"
            value={testtype}
            onChange={(e) => setTestType(e.target.value)}
          >
            <option value="ALL">ALL (Tất cả)</option>
            <option value="NVL">NVL - Nguyên vật liệu</option>
            <option value="BTP">BTP - Bán thành phẩm</option>
            <option value="SP">SP - Thành phẩm</option>
          </select>
        </div>

        {/* Field 2: VENDOR LOT */}
        <div className="form-group">
          <label>VENDOR LOT:</label>
          <input
            type="text"
            className="input-control input-control--mono"
            placeholder="Nhập mã Lot NCC..."
            value={vendorLot}
            onChange={(e) => setVendorLot(e.target.value)}
          />
        </div>

        {/* Field 3: M_LOT_NO */}
        <div className="form-group">
          <label>M_LOT_NO (CMS):</label>
          <input
            type="text"
            className="input-control input-control--mono"
            placeholder="Nhập mã Lot CMS ERP..."
            value={m_lot_no}
            onChange={(e) => setM_LOT_NO(e.target.value)}
          />
        </div>

        {/* Field 4: DEFECT PHENOMENON */}
        <div className="form-group">
          <label>HIỆN TƯỢNG LỖI:</label>
          <input
            type="text"
            className="input-control"
            placeholder="Nhăn, Lệch keo..."
            value={defect_phenomenon}
            onChange={(e) => setDefectPhenomenon(e.target.value)}
          />
        </div>

        {/* Field 5: REMARK */}
        <div className="form-group">
          <label>REMARK (Ghi chú):</label>
          <input
            type="text"
            className="input-control"
            placeholder="Ghi chú thẩm định..."
            value={remark}
            onChange={(e) => setReMark(e.target.value)}
          />
        </div>

        {/* Field 6: NCR_ID */}
        <div className="form-group">
          <label>NCR_ID:</label>
          <div className="input-with-btn">
            <input
              type="number"
              className="input-control input-control--mono"
              placeholder="0"
              value={ncrId || ""}
              onChange={(e) => setNCRID(parseInt(e.target.value, 10) || 0)}
            />
          </div>
        </div>

        {/* Field 7: Checkbox ONLY PENDING */}
        <label className="checkbox-panel">
          <input
            type="checkbox"
            checked={onlyPending}
            onChange={(e) => setOnlyPending(e.target.checked)}
          />
          <span>ONLY PENDING STATUS</span>
        </label>

        {/* Primary Action Button */}
        <button
          type="button"
          className="btn-search-main"
          onClick={onSearch}
        >
          <FiSearch size={13} />
          Tra Data Blocking
        </button>

        {/* Quick Actions Section */}
        <div className="quick-actions-section">
          <span className="section-label">Xử lý tác vụ nhanh:</span>
          <button
            type="button"
            className="btn-quick btn-quick--unblock"
            onClick={() => onSetPass("Y")}
            title="Phê duyệt mở khóa hàng loạt lô đã chọn"
          >
            <FiCheck size={12} />
            ✓ Mở Chặn (Unblock)
          </button>
          <button
            type="button"
            className="btn-quick btn-quick--holding"
            onClick={() => onSetPass("N")}
            title="Đánh giá không đạt / giữ hàng"
          >
            <FiAlertTriangle size={12} />
            ⚠️ Chuyển Holding
          </button>
          <button
            type="button"
            className="btn-quick btn-quick--ncr"
            onClick={onUpdateNCR}
            title="Cập nhật mã NCR cho các lô đang chọn"
          >
            <FiFileText size={12} />
            ❌ Gán NCR Báo Phế
          </button>
        </div>
      </div>
    </aside>
  );
};
