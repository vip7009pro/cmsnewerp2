import React, { memo } from "react";
import {
  FiFilter,
  FiZap,
  FiCheckCircle,
  FiGrid,
  FiRefreshCw,
  FiList,
  FiTrash2,
} from "react-icons/fi";

export interface PriceFilterState {
  fromdate: string;
  todate: string;
  codeKD: string;
  codeCMS: string;
  m_name: string;
  cust_name: string;
  alltime: boolean;
}

interface Props {
  filters: PriceFilterState;
  onFilterChange: (key: keyof PriceFilterState, value: any) => void;
  onLastPrice: () => void;
  onApprove: () => void;
  onGiaNgang: () => void;
  onUpdate: () => void;
  onGiaDoc: () => void;
  onDelete: () => void;
  isCollapsed?: boolean;
}

const PrecisionPriceFilter: React.FC<Props> = ({
  filters,
  onFilterChange,
  onLastPrice,
  onApprove,
  onGiaNgang,
  onUpdate,
  onGiaDoc,
  onDelete,
  isCollapsed = false,
}) => {
  if (isCollapsed) return null;

  return (
    <aside className="precision-quotation__sidebar">
      {/* Sidebar Header */}
      <div className="precision-quotation__sidebar-title">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FiFilter style={{ color: "#2563eb", fontSize: 16 }} />
          <span>Bộ Lọc Báo Giá</span>
        </div>
        <span className="badge">KD-01</span>
      </div>

      {/* Filter Fields */}
      <div className="precision-quotation__filter-fields">
        <div className="precision-quotation__field-group">
          <label>Từ ngày</label>
          <input
            type="date"
            value={filters.fromdate}
            onChange={(e) => onFilterChange("fromdate", e.target.value)}
          />
        </div>

        <div className="precision-quotation__field-group">
          <label>Tới ngày</label>
          <input
            type="date"
            value={filters.todate}
            onChange={(e) => onFilterChange("todate", e.target.value)}
          />
        </div>

        <div className="precision-quotation__field-group">
          <label>Code KD</label>
          <input
            type="text"
            placeholder="GH63-..."
            value={filters.codeKD}
            onChange={(e) => onFilterChange("codeKD", e.target.value)}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>

        <div className="precision-quotation__field-group">
          <label>Code ERP</label>
          <input
            type="text"
            placeholder="Mã ERP..."
            value={filters.codeCMS}
            onChange={(e) => onFilterChange("codeCMS", e.target.value)}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>

        <div className="precision-quotation__field-group">
          <label>Tên Liệu</label>
          <input
            type="text"
            placeholder="Mã liệu..."
            value={filters.m_name}
            onChange={(e) => onFilterChange("m_name", e.target.value)}
          />
        </div>

        <div className="precision-quotation__field-group">
          <label>Tên khách hàng</label>
          <input
            type="text"
            placeholder="Tên đối tác..."
            value={filters.cust_name}
            onChange={(e) => onFilterChange("cust_name", e.target.value)}
            style={{ fontWeight: 700, color: "#1d4ed8" }}
          />
        </div>

        {/* All time checkbox */}
        <div className="precision-quotation__checkbox-row">
          <span>All Time (Tất cả)</span>
          <input
            type="checkbox"
            checked={filters.alltime}
            onChange={(e) => onFilterChange("alltime", e.target.checked)}
          />
        </div>
      </div>

      {/* Action Command Palette (6 Buttons) */}
      <div className="precision-quotation__command-grid">
        <button
          className="precision-quotation__cmd-btn precision-quotation__cmd-btn--blue"
          onClick={onLastPrice}
          title="Tải bảng giá mới nhất theo bộ lọc"
        >
          <FiZap />
          <span>LAST PRICE</span>
        </button>

        <button
          className="precision-quotation__cmd-btn precision-quotation__cmd-btn--emerald"
          onClick={onApprove}
          title="Phê duyệt giá cho các dòng được chọn"
        >
          <FiCheckCircle />
          <span>APPROVE</span>
        </button>

        <button
          className="precision-quotation__cmd-btn precision-quotation__cmd-btn--neutral"
          onClick={onGiaNgang}
          title="Xem bảng giá theo dạng ngang (20 cột mốc giá)"
        >
          <FiGrid />
          <span>GIÁ NGANG</span>
        </button>

        <button
          className="precision-quotation__cmd-btn precision-quotation__cmd-btn--indigo"
          onClick={onUpdate}
          title="Cập nhật thông tin giá hàng loạt"
        >
          <FiRefreshCw />
          <span>UPDATE</span>
        </button>

        <button
          className="precision-quotation__cmd-btn precision-quotation__cmd-btn--neutral"
          onClick={onGiaDoc}
          title="Xem bảng giá theo dạng dọc chi tiết"
        >
          <FiList />
          <span>GIÁ DỌC</span>
        </button>

        <button
          className="precision-quotation__cmd-btn precision-quotation__cmd-btn--rose"
          onClick={onDelete}
          title="Xóa giá cho các dòng được chọn"
        >
          <FiTrash2 />
          <span>DELETE</span>
        </button>
      </div>

      {/* Server & Role Info Footer */}
      <div className="precision-quotation__sidebar-footer">
        <div className="row">
          <span>Server Sync:</span>
          <span className="active-dot">
            <span /> Active
          </span>
        </div>
        <div className="row">
          <span>Quyền hạn:</span>
          <span style={{ fontWeight: 700, color: "#1d4ed8" }}>KD Master</span>
        </div>
      </div>
    </aside>
  );
};

export default memo(PrecisionPriceFilter);
