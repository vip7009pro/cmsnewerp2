import React from "react";
import { MdTune, MdChevronLeft, MdSearch, MdRestartAlt } from "react-icons/md";
import "../PrecisionPoManager.scss";

export interface PrecisionPoFilterState {
  fromdate: string;
  todate: string;
  alltime: boolean;
  justpobalance: boolean;
  urgentOnly: boolean;
  pendingApproval: boolean;
  cust_name: string;
  codeKD: string;
  codeCMS: string;
  prod_type: string;
  po_no: string;
  empl_name: string;
  material: string;
  over: string;
  id: string;
  invoice_no: string;
}

interface PrecisionPoFilterPanelProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  filters: PrecisionPoFilterState;
  onFilterChange: <K extends keyof PrecisionPoFilterState>(
    key: K,
    value: PrecisionPoFilterState[K]
  ) => void;
  onSearch: () => void;
  onReset: () => void;
  isSearching?: boolean;
}

const PrecisionPoFilterPanel: React.FC<PrecisionPoFilterPanelProps> = ({
  collapsed,
  onToggleCollapse,
  filters,
  onFilterChange,
  onSearch,
  onReset,
  isSearching = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <aside className={`po-filter-panel ${collapsed ? "collapsed" : ""}`}>
      {/* Header */}
      <div className="filter-header">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <MdTune size={16} color="#004ac6" />
          <span>Bộ Lọc Đơn Hàng</span>
        </div>
        <button
          type="button"
          className="btn-toggle-filter"
          onClick={onToggleCollapse}
          title="Thu gọn bộ lọc"
        >
          <MdChevronLeft size={18} />
        </button>
      </div>

      {/* Filter Form Body */}
      <form
        className="filter-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <div className="filter-scrollable-content custom-scrollbar">
          {/* Date Group */}
        <div className="filter-group">
          <div className="filter-group-title">
            <span>Khoảng Thời Gian</span>
            <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={filters.alltime}
                onChange={(e) => onFilterChange("alltime", e.target.checked)}
              />
              <span style={{ textTransform: "none", fontWeight: 500 }}>Tất cả</span>
            </label>
          </div>
          <div className="date-input-row">
            <span>Từ ngày (From)</span>
            <input
              type="date"
              value={filters.fromdate.slice(0, 10)}
              onChange={(e) => onFilterChange("fromdate", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="date-input-row">
            <span>Đến ngày (To)</span>
            <input
              type="date"
              value={filters.todate.slice(0, 10)}
              onChange={(e) => onFilterChange("todate", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="filter-quick-toggles">
          <label>
            <input
              type="checkbox"
              checked={filters.justpobalance}
              onChange={(e) => onFilterChange("justpobalance", e.target.checked)}
            />
            <span style={{ fontWeight: 600, color: "#1d4ed8" }}>Chỉ hiện PO Còn Tồn</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.urgentOnly}
              onChange={(e) => onFilterChange("urgentOnly", e.target.checked)}
            />
            <span style={{ color: "#e11d48", fontWeight: 500 }}>Hàng giao gấp (&lt; 24h)</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.pendingApproval}
              onChange={(e) => onFilterChange("pendingApproval", e.target.checked)}
            />
            <span style={{ color: "#d97706", fontWeight: 500 }}>Chờ phê duyệt</span>
          </label>
        </div>

        {/* Detailed Input Fields */}
        <div className="filter-fields-container">
          <div className="field-item">
            <label>Khách Hàng (Customer)</label>
            <input
              type="text"
              placeholder="VD: SEVT, Dongkwang..."
              value={filters.cust_name}
              onChange={(e) => onFilterChange("cust_name", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="field-item">
            <label>Mã Kinh Doanh (Code KD)</label>
            <input
              type="text"
              placeholder="GH63-xxxxxx"
              value={filters.codeKD}
              onChange={(e) => onFilterChange("codeKD", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="field-item">
            <label>Mã ERP Nội Bộ (Code CMS)</label>
            <input
              type="text"
              placeholder="7C09076A, 7B..."
              value={filters.codeCMS}
              onChange={(e) => onFilterChange("codeCMS", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="field-item">
            <label>Phân Loại (Prod Type)</label>
            <select
              value={filters.prod_type}
              onChange={(e) => onFilterChange("prod_type", e.target.value)}
            >
              <option value="">Tất cả phân loại</option>
              <option value="TSP">TSP (Màng cảm ứng)</option>
              <option value="TAPE">TAPE (Băng dính)</option>
              <option value="LABEL">LABEL (Nhãn tem barcode)</option>
              <option value="FILM">FILM (Phim kỹ thuật)</option>
              <option value="FOAM">FOAM (Mút đệm chống sốc)</option>
            </select>
          </div>

          <div className="field-item">
            <label>Số PO Khách Hàng (PO NO)</label>
            <input
              type="text"
              placeholder="DK260908, 3122..."
              value={filters.po_no}
              onChange={(e) => onFilterChange("po_no", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="field-item">
            <label>Nhân Viên Kinh Doanh</label>
            <input
              type="text"
              placeholder="Tên nhân viên..."
              value={filters.empl_name}
              onChange={(e) => onFilterChange("empl_name", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="field-item">
            <label>Vật Liệu (Material)</label>
            <input
              type="text"
              placeholder="SJ-203020HC..."
              value={filters.material}
              onChange={(e) => onFilterChange("material", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="field-item">
            <label>Over / OK</label>
            <input
              type="text"
              placeholder="OVER"
              value={filters.over}
              onChange={(e) => onFilterChange("over", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="field-item">
            <label>ID Đơn Hàng</label>
            <input
              type="text"
              placeholder="12345..."
              value={filters.id}
              onChange={(e) => onFilterChange("id", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="field-item">
            <label>Số Invoice (Invoice No)</label>
            <input
              type="text"
              placeholder="Số invoice..."
              value={filters.invoice_no}
              onChange={(e) => onFilterChange("invoice_no", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        </div>

        {/* Action Buttons Pinned at Bottom */}
        <div className="filter-actions">
          <button type="submit" className="btn-search" disabled={isSearching}>
            <MdSearch size={16} />
            <span>{isSearching ? "Đang tìm..." : "Tìm kiếm (F2)"}</span>
          </button>
          <button type="button" className="btn-reset" onClick={onReset}>
            <MdRestartAlt size={14} />
            <span>Đặt lại bộ lọc</span>
          </button>
        </div>
      </form>
    </aside>
  );
};

export default React.memo(PrecisionPoFilterPanel);
