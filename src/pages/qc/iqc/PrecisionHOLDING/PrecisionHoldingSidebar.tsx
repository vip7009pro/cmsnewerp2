import React from "react";
import { FiFilter, FiRotateCcw, FiSearch, FiCheck, FiX, FiFileText, FiEdit3 } from "react-icons/fi";

interface PrecisionHoldingSidebarProps {
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
  onSearch: () => void;
  onReset: () => void;
  onSetPass: (val: string) => void;
  onUpdateNCR: () => void;
  onUpdateReason: () => void;
}

export const PrecisionHoldingSidebar: React.FC<PrecisionHoldingSidebarProps> = ({
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
  onSearch,
  onReset,
  onSetPass,
  onUpdateNCR,
  onUpdateReason,
}) => {
  return (
    <aside className="precision-holding-sidebar">
      {/* Header */}
      <div className="precision-holding-sidebar__header">
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
      <div className="precision-holding-sidebar__body">
        {/* Checkbox All Time */}
        <label className="checkbox-panel">
          <input
            type="checkbox"
            checked={alltime}
            onChange={(e) => setAllTime(e.target.checked)}
          />
          <span>ALL TIME (Không lọc ngày)</span>
        </label>

        {/* Field: Từ ngày */}
        <div className="form-group">
          <label>Từ ngày:</label>
          <input
            type="date"
            className="input-control"
            disabled={alltime}
            value={fromdate.slice(0, 10)}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        {/* Field: Tới ngày */}
        <div className="form-group">
          <label>Tới ngày:</label>
          <input
            type="date"
            className="input-control"
            disabled={alltime}
            value={todate.slice(0, 10)}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        {/* Field: Tên Liệu */}
        <div className="form-group">
          <label>TÊN LIỆU:</label>
          <input
            type="text"
            className="input-control"
            placeholder="SJ-203020HC..."
            value={m_name}
            onChange={(e) => setM_Name(e.target.value)}
          />
        </div>

        {/* Field: Mã Liệu CMS */}
        <div className="form-group">
          <label>MÃ LIỆU CMS:</label>
          <input
            type="text"
            className="input-control input-control--mono"
            placeholder="A0001234..."
            value={m_code}
            onChange={(e) => setM_Code(e.target.value)}
          />
        </div>

        {/* Field: LOT CMS */}
        <div className="form-group">
          <label>LOT CMS:</label>
          <input
            type="text"
            className="input-control input-control--mono"
            placeholder="2204280689..."
            value={mLotNo}
            onChange={(e) => setMLotNo(e.target.value)}
          />
        </div>

        {/* Field: Trạng Thái */}
        <div className="form-group">
          <label>TRẠNG THÁI PHÊ DUYỆT:</label>
          <select
            className="input-control"
            value={mStatus}
            onChange={(e) => setMStatus(e.target.value)}
          >
            <option value="ALL">ALL (Tất cả)</option>
            <option value="Y">ĐÃ PASS (Đạt)</option>
            <option value="N">CHƯA PASS (Chờ/Không đạt)</option>
          </select>
        </div>

        {/* Field: NCR ID */}
        <div className="form-group">
          <label>NCR ID:</label>
          <input
            type="number"
            className="input-control input-control--mono"
            placeholder="0"
            value={ncrId || ""}
            onChange={(e) => setNCRID(parseInt(e.target.value, 10) || 0)}
          />
        </div>

        {/* Field: HOLD ID */}
        <div className="form-group">
          <label>MÃ ID GIỮ HÀNG:</label>
          <input
            type="text"
            className="input-control input-control--mono"
            placeholder="ID giữ hàng..."
            value={id}
            onChange={(e) => setID(e.target.value)}
          />
        </div>

        {/* Search Action Button */}
        <button
          type="button"
          className="btn-search-main"
          onClick={onSearch}
        >
          <FiSearch size={13} />
          Tra Data Holding
        </button>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <span className="section-label">Xử lý tác vụ nhanh:</span>
          <button
            type="button"
            className="btn-quick btn-quick--pass"
            onClick={() => onSetPass("Y")}
            title="Phê duyệt mở khóa hàng loạt lô đã chọn"
          >
            <FiCheck size={12} />
            ✓ Phê Duyệt PASS
          </button>
          <button
            type="button"
            className="btn-quick btn-quick--fail"
            onClick={() => onSetPass("N")}
            title="Đánh giá không đạt cho các lô đã chọn"
          >
            <FiX size={12} />
            ❌ Đánh Giá FAIL
          </button>
          <button
            type="button"
            className="btn-quick btn-quick--ncr"
            onClick={onUpdateNCR}
            title="Cập nhật mã NCR cho các lô đang chọn"
          >
            <FiFileText size={12} />
            🏷️ Gán Mã NCR
          </button>
          <button
            type="button"
            className="btn-quick btn-quick--reason"
            onClick={onUpdateReason}
            title="Cập nhật lý do lỗi cho các dòng được chọn"
          >
            <FiEdit3 size={12} />
            📝 Update Lý Do Lỗi
          </button>
        </div>
      </div>
    </aside>
  );
};
