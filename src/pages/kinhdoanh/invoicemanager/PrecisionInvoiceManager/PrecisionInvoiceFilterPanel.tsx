import React, { memo } from "react";
import { FiFilter, FiRotateCcw, FiSearch } from "react-icons/fi";
import { InvoiceSummaryData } from "../../interfaces/kdInterface";
import { getGlobalSetting } from "../../../../api/Api";
import { WEB_SETTING_DATA } from "../../../../api/GlobalInterface";

export interface InvoiceFilterState {
  fromdate: string;
  todate: string;
  alltime: boolean;
  codeKD: string;
  codeCMS: string;
  empl_name: string;
  cust_name: string;
  prod_type: string;
  id: string;
  po_no: string;
  material: string;
  over: string;
  invoice_no: string;
}

interface Props {
  filters: InvoiceFilterState;
  onFilterChange: (key: keyof InvoiceFilterState, value: any) => void;
  onSearch: () => void;
  onReset: () => void;
  onEnterKey: () => void;
  invoiceSummary: InvoiceSummaryData;
  totalRows: number;
}

const PrecisionInvoiceFilterPanel: React.FC<Props> = ({
  filters,
  onFilterChange,
  onSearch,
  onReset,
  onEnterKey,
  invoiceSummary,
  totalRows,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onEnterKey();
  };

  const currency =
    getGlobalSetting()?.filter(
      (ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY"
    )[0]?.CURRENT_VALUE ?? "USD";

  return (
    <>
      {/* Header */}
      <div className="stitch-inv__sidebar-header">
        <div className="stitch-inv__sidebar-title">
          <FiFilter />
          <span>Bộ Lọc Tra Cứu</span>
        </div>
        <button className="stitch-inv__sidebar-reset" onClick={onReset}>
          <FiRotateCcw size={10} /> Làm mới
        </button>
      </div>

      {/* Form */}
      <div className="stitch-inv__sidebar-form">
        {/* Date Range */}
        <div className="stitch-inv__filter-group">
          <span className="stitch-inv__filter-label">Thời gian giao hàng</span>
          <div className="stitch-inv__filter-row">
            <div>
              <span style={{ fontSize: 9, color: "#94a3b8" }}>Từ ngày</span>
              <input
                className="stitch-inv__filter-input stitch-inv__filter-input--date"
                type="date"
                value={filters.fromdate.slice(0, 10)}
                onChange={(e) => onFilterChange("fromdate", e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div>
              <span style={{ fontSize: 9, color: "#94a3b8" }}>Tới ngày</span>
              <input
                className="stitch-inv__filter-input stitch-inv__filter-input--date"
                type="date"
                value={filters.todate.slice(0, 10)}
                onChange={(e) => onFilterChange("todate", e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>

        {/* All Time */}
        <div className="stitch-inv__filter-checkbox">
          <input
            type="checkbox"
            id="inv-alltime"
            checked={filters.alltime}
            onChange={() => onFilterChange("alltime", !filters.alltime)}
          />
          <label htmlFor="inv-alltime">Tra cứu toàn bộ thời gian (All Time)</label>
        </div>

        <div className="stitch-inv__filter-divider" />

        {/* Text Filters */}
        <FilterInput label="Code KD (Mã kinh doanh)" placeholder="GH63-xxxxxx" value={filters.codeKD} onChange={(v) => onFilterChange("codeKD", v)} onKeyDown={handleKeyDown} />
        <FilterInput label="Code ERP" placeholder="7C123xxx" value={filters.codeCMS} onChange={(v) => onFilterChange("codeCMS", v)} onKeyDown={handleKeyDown} mono />
        <FilterInput label="Nhân viên phụ trách" placeholder="Trang / Hùng..." value={filters.empl_name} onChange={(v) => onFilterChange("empl_name", v)} onKeyDown={handleKeyDown} />
        <FilterInput label="Khách hàng" placeholder="SEVT" value={filters.cust_name} onChange={(v) => onFilterChange("cust_name", v)} onKeyDown={handleKeyDown} />

        <div className="stitch-inv__filter-row">
          <FilterInput label="Loại SP" placeholder="TSP" value={filters.prod_type} onChange={(v) => onFilterChange("prod_type", v)} onKeyDown={handleKeyDown} />
          <FilterInput label="Over/OK" placeholder="OVER" value={filters.over} onChange={(v) => onFilterChange("over", v)} onKeyDown={handleKeyDown} />
        </div>

        <div className="stitch-inv__filter-row">
          <FilterInput label="Số PO" placeholder="PO-2026..." value={filters.po_no} onChange={(v) => onFilterChange("po_no", v)} onKeyDown={handleKeyDown} />
          <FilterInput label="Số Hóa Đơn" placeholder="INV-0909..." value={filters.invoice_no} onChange={(v) => onFilterChange("invoice_no", v)} onKeyDown={handleKeyDown} mono />
        </div>

        <FilterInput label="Mã vật liệu (Material Code)" placeholder="SJ-203020HC" value={filters.material} onChange={(v) => onFilterChange("material", v)} onKeyDown={handleKeyDown} mono />
        <FilterInput label="ID" placeholder="12345" value={filters.id} onChange={(v) => onFilterChange("id", v)} onKeyDown={handleKeyDown} />

        <button className="stitch-inv__search-btn" onClick={onSearch}>
          <FiSearch size={12} />
          <span>Tra Cứu Dữ Liệu</span>
        </button>
      </div>

      {/* KPI Summary */}
      <div className="stitch-inv__kpi-summary">
        <div className="stitch-inv__kpi-label">Chỉ số theo bộ lọc</div>
        <div className="stitch-inv__kpi-card stitch-inv__kpi-card--emerald">
          <span className="stitch-inv__kpi-card-title" style={{ color: "#065f46" }}>
            Delivered QTY (Đã giao)
          </span>
          <span className="stitch-inv__kpi-card-value" style={{ color: "#047857" }}>
            {invoiceSummary.total_delivered_qty.toLocaleString("en-US")} <span>EA</span>
          </span>
        </div>
        <div className="stitch-inv__kpi-card stitch-inv__kpi-card--blue">
          <span className="stitch-inv__kpi-card-title" style={{ color: "#1e40af" }}>
            Delivered Amount (Tổng tiền)
          </span>
          <span className="stitch-inv__kpi-card-value" style={{ color: "#1d4ed8" }}>
            {invoiceSummary.total_delivered_amount.toLocaleString("en-US", {
              style: "currency",
              currency: currency,
            })}{" "}
            <span>{currency}</span>
          </span>
        </div>
        <div className="stitch-inv__kpi-row">
          <span>Tổng số Invoices:</span>
          <span>{totalRows.toLocaleString("en-US")} đơn</span>
        </div>
      </div>
    </>
  );
};

/* ── Reusable Filter Input ── */
interface FilterInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  mono?: boolean;
}

const FilterInput: React.FC<FilterInputProps> = ({
  label, placeholder, value, onChange, onKeyDown, mono,
}) => (
  <div className="stitch-inv__filter-group">
    <span className="stitch-inv__filter-label">{label}</span>
    <input
      className={`stitch-inv__filter-input${mono ? " stitch-inv__filter-input--mono" : ""}`}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
    />
  </div>
);

export default memo(PrecisionInvoiceFilterPanel);
