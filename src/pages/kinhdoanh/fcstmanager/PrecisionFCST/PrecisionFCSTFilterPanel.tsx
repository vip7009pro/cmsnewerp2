import React, { memo } from "react";
import { FiFilter, FiZap } from "react-icons/fi";

interface FilterState {
  fromdate: string;
  todate: string;
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
  alltime: boolean;
}

interface Props {
  filters: FilterState;
  onFilterChange: (field: keyof FilterState, value: string | boolean) => void;
  onSearch: () => void;
  onReset: () => void;
  isLoading: boolean;
}

const PrecisionFCSTFilterPanel: React.FC<Props> = ({
  filters,
  onFilterChange,
  onSearch,
  onReset,
  isLoading,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <aside className="precision-fcst__filterPanel">
      {/* Filter Header */}
      <div className="precision-fcst__filterHeader">
        <div className="precision-fcst__filterTitle">
          <FiFilter />
          <span>Bộ Lọc Dự Báo (FCST)</span>
        </div>
        <button
          type="button"
          className="precision-fcst__filterReset"
          onClick={onReset}
        >
          Mặc định
        </button>
      </div>

      {/* Filter Body */}
      <div className="precision-fcst__filterBody">
        {/* Từ ngày */}
        <div className="precision-fcst__filterGroup">
          <label className="precision-fcst__filterLabel">Từ ngày:</label>
          <input
            className="precision-fcst__filterInput"
            type="date"
            value={filters.fromdate.slice(0, 10)}
            onChange={(e) => onFilterChange("fromdate", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Tới ngày */}
        <div className="precision-fcst__filterGroup">
          <label className="precision-fcst__filterLabel">Tới ngày:</label>
          <input
            className="precision-fcst__filterInput"
            type="date"
            value={filters.todate.slice(0, 10)}
            onChange={(e) => onFilterChange("todate", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Code KD */}
        <div className="precision-fcst__filterGroup">
          <label className="precision-fcst__filterLabel">Code KD:</label>
          <input
            className="precision-fcst__filterInput"
            type="text"
            placeholder="GH63-xxxxxx"
            value={filters.codeKD}
            onChange={(e) => onFilterChange("codeKD", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Code ERP */}
        <div className="precision-fcst__filterGroup">
          <label className="precision-fcst__filterLabel">Code ERP:</label>
          <input
            className="precision-fcst__filterInput"
            type="text"
            placeholder="7C123xxx"
            value={filters.codeCMS}
            onChange={(e) => onFilterChange("codeCMS", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Tên nhân viên */}
        <div className="precision-fcst__filterGroup">
          <label className="precision-fcst__filterLabel">Tên nhân viên:</label>
          <input
            className="precision-fcst__filterInput"
            type="text"
            placeholder="Trang"
            value={filters.empl_name}
            onChange={(e) => onFilterChange("empl_name", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Khách hàng */}
        <div className="precision-fcst__filterGroup">
          <label className="precision-fcst__filterLabel">Khách hàng:</label>
          <input
            className="precision-fcst__filterInput"
            type="text"
            placeholder="SEVT"
            value={filters.cust_name}
            onChange={(e) => onFilterChange("cust_name", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Loại sản phẩm */}
        <div className="precision-fcst__filterGroup">
          <label className="precision-fcst__filterLabel">Loại sản phẩm:</label>
          <input
            className="precision-fcst__filterInput"
            type="text"
            placeholder="TSP"
            value={filters.prod_type}
            onChange={(e) => onFilterChange("prod_type", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* ID + PO NO (2 columns) */}
        <div className="precision-fcst__filterRow">
          <div className="precision-fcst__filterGroup">
            <label className="precision-fcst__filterLabel">ID:</label>
            <input
              className="precision-fcst__filterInput"
              type="text"
              placeholder="12345"
              value={filters.id}
              onChange={(e) => onFilterChange("id", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="precision-fcst__filterGroup">
            <label className="precision-fcst__filterLabel">PO NO:</label>
            <input
              className="precision-fcst__filterInput"
              type="text"
              placeholder="123abc"
              value={filters.po_no}
              onChange={(e) => onFilterChange("po_no", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {/* Vật liệu */}
        <div className="precision-fcst__filterGroup">
          <label className="precision-fcst__filterLabel">Vật liệu:</label>
          <input
            className="precision-fcst__filterInput"
            type="text"
            placeholder="SJ-203020HC"
            value={filters.material}
            onChange={(e) => onFilterChange("material", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Over/OK */}
        <div className="precision-fcst__filterGroup">
          <label className="precision-fcst__filterLabel">Over/OK:</label>
          <input
            className="precision-fcst__filterInput"
            type="text"
            placeholder="OVER"
            value={filters.over}
            onChange={(e) => onFilterChange("over", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Invoice No */}
        <div className="precision-fcst__filterGroup">
          <label className="precision-fcst__filterLabel">Invoice No:</label>
          <input
            className="precision-fcst__filterInput"
            type="text"
            placeholder="số invoice"
            value={filters.invoice_no}
            onChange={(e) => onFilterChange("invoice_no", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* All Time Checkbox */}
        <div className="precision-fcst__filterCheckbox">
          <input
            type="checkbox"
            id="fcst_alltime"
            checked={filters.alltime}
            onChange={() => onFilterChange("alltime", !filters.alltime)}
          />
          <label htmlFor="fcst_alltime">Tra cứu toàn thời gian (All Time)</label>
        </div>

        {/* Search Button */}
        <button
          type="button"
          className="precision-fcst__filterSearchBtn"
          onClick={onSearch}
          disabled={isLoading}
        >
          <FiZap />
          <span>{isLoading ? "Đang tải..." : "⚡ Tra Cứu Dữ Liệu"}</span>
        </button>
      </div>
    </aside>
  );
};

export default memo(PrecisionFCSTFilterPanel);
