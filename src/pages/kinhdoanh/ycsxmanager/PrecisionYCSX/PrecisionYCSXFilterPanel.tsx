import React, { memo } from "react";
import { FiFilter, FiZap } from "react-icons/fi";

export interface YCSXFilterState {
  fromdate: string;
  todate: string;
  codeKD: string;
  codeCMS: string;
  empl_name: string;
  cust_name: string;
  prod_type: string;
  prodrequestno: string;
  phanloai: string;
  phanloaihang: string;
  material: string;
  is_tam_thoi: string;
  alltime: boolean;
  materialYES: boolean;
  ycsxpendingcheck: boolean;
  inspectInputcheck: boolean;
}

interface Props {
  filters: YCSXFilterState;
  onFilterChange: (field: keyof YCSXFilterState, value: string | boolean) => void;
  onSearch: () => void;
  onReset: () => void;
  isHidden: boolean;
  isCMS: boolean;
}

const PrecisionYCSXFilterPanel: React.FC<Props> = ({
  filters,
  onFilterChange,
  onSearch,
  onReset,
  isHidden,
  isCMS,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <aside
      className={`precision-ycsx__filterPanel ${isHidden ? "precision-ycsx__filterPanel--hidden" : ""}`}
    >
      <div className="precision-ycsx__filterHeader">
        <div className="precision-ycsx__filterTitle">
          <FiFilter />
          <span>BỘ LỌC YCSX (SX-01)</span>
        </div>
        <button
          type="button"
          className="precision-ycsx__filterReset"
          onClick={onReset}
          title="Đặt lại bộ lọc mặc định"
        >
          Mặc định
        </button>
      </div>

      <div className="precision-ycsx__filterBody">
        {/* Date Range */}
        <div className="precision-ycsx__filterRow2">
          <div className="precision-ycsx__filterGroup">
            <span className="precision-ycsx__filterLabel">Từ ngày:</span>
            <input
              type="date"
              className="precision-ycsx__filterInput"
              value={filters.fromdate}
              onChange={(e) => onFilterChange("fromdate", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="precision-ycsx__filterGroup">
            <span className="precision-ycsx__filterLabel">Tới ngày:</span>
            <input
              type="date"
              className="precision-ycsx__filterInput"
              value={filters.todate}
              onChange={(e) => onFilterChange("todate", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {/* Code KD */}
        <div className="precision-ycsx__filterGroup">
          <span className="precision-ycsx__filterLabel">Code KD:</span>
          <input
            type="text"
            className="precision-ycsx__filterInput"
            placeholder="GH63-xxxxxx"
            value={filters.codeKD}
            onChange={(e) => onFilterChange("codeKD", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Code ERP */}
        <div className="precision-ycsx__filterGroup">
          <span className="precision-ycsx__filterLabel">Code ERP:</span>
          <input
            type="text"
            className="precision-ycsx__filterInput"
            placeholder="7C123xxx"
            value={filters.codeCMS}
            onChange={(e) => onFilterChange("codeCMS", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Employee & Customer */}
        <div className="precision-ycsx__filterRow2">
          <div className="precision-ycsx__filterGroup">
            <span className="precision-ycsx__filterLabel">Tên nhân viên:</span>
            <input
              type="text"
              className="precision-ycsx__filterInput"
              placeholder="Trang"
              value={filters.empl_name}
              onChange={(e) => onFilterChange("empl_name", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="precision-ycsx__filterGroup">
            <span className="precision-ycsx__filterLabel">Khách:</span>
            <input
              type="text"
              className="precision-ycsx__filterInput"
              placeholder="SEVT / ALL"
              value={filters.cust_name}
              onChange={(e) => onFilterChange("cust_name", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {/* Product Type & Prod Request No */}
        <div className="precision-ycsx__filterRow2">
          <div className="precision-ycsx__filterGroup">
            <span className="precision-ycsx__filterLabel">Loại SP:</span>
            <input
              type="text"
              className="precision-ycsx__filterInput"
              placeholder="TSP"
              value={filters.prod_type}
              onChange={(e) => onFilterChange("prod_type", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="precision-ycsx__filterGroup">
            <span className="precision-ycsx__filterLabel">Số YCSX:</span>
            <input
              type="text"
              className="precision-ycsx__filterInput"
              placeholder="12345"
              value={filters.prodrequestno}
              onChange={(e) => onFilterChange("prodrequestno", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {/* Classification */}
        <div className="precision-ycsx__filterRow2">
          <div className="precision-ycsx__filterGroup">
            <span className="precision-ycsx__filterLabel">Phân loại:</span>
            <select
              className="precision-ycsx__filterSelect"
              value={filters.phanloai}
              onChange={(e) => onFilterChange("phanloai", e.target.value)}
            >
              <option value="ALL">ALL</option>
              <option value="01">Thông thường</option>
              <option value="02">SDI</option>
              <option value="03">GC</option>
              <option value="04">SAMPLE</option>
            </select>
          </div>
          <div className="precision-ycsx__filterGroup">
            <span className="precision-ycsx__filterLabel">Loại hàng:</span>
            <select
              className="precision-ycsx__filterSelect"
              value={filters.phanloaihang}
              onChange={(e) => onFilterChange("phanloaihang", e.target.value)}
            >
              <option value="ALL">ALL</option>
              <option value="TT">Hàng Thường (TT)</option>
              <option value="SP">Sample sang FL (SP)</option>
              <option value="RB">Ribbon (RB)</option>
              <option value="HQ">Hàn Quốc (HQ)</option>
              <option value="VN">Việt Nam (VN)</option>
              <option value="AM">Amazon (AM)</option>
              <option value="DL">Đổi LOT (DL)</option>
              <option value="M4">NM4 (M4)</option>
              <option value="GC">Hàng Gia Công (GC)</option>
              <option value="TM">Hàng Thương Mại (TM)</option>
              {!isCMS && <option value="GD">Gia Công Đặc Biệt (GD)</option>}
            </select>
          </div>
        </div>

        {/* Material & Temporary Flag */}
        <div className="precision-ycsx__filterGroup">
          <span className="precision-ycsx__filterLabel">Vật liệu:</span>
          <input
            type="text"
            className="precision-ycsx__filterInput"
            placeholder="SJ-203020HC"
            value={filters.material}
            onChange={(e) => onFilterChange("material", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {isCMS && (
          <div className="precision-ycsx__filterGroup">
            <span className="precision-ycsx__filterLabel">YC Tạm thời:</span>
            <select
              className="precision-ycsx__filterSelect"
              value={filters.is_tam_thoi}
              onChange={(e) => onFilterChange("is_tam_thoi", e.target.value)}
            >
              <option value="N">Bình thường</option>
              <option value="Y">Tạm thời</option>
            </select>
          </div>
        )}

        {/* Checkbox Group */}
        <div className="precision-ycsx__filterCheckGroup">
          <label className="precision-ycsx__filterCheck">
            <input
              type="checkbox"
              checked={filters.alltime}
              onChange={(e) => onFilterChange("alltime", e.target.checked)}
            />
            <span>All Time (Toàn bộ)</span>
          </label>

          <label className="precision-ycsx__filterCheck">
            <input
              type="checkbox"
              checked={filters.materialYES}
              onChange={(e) => onFilterChange("materialYES", e.target.checked)}
            />
            <span>Material YES Only</span>
          </label>

          <label className="precision-ycsx__filterCheck precision-ycsx__filterCheck--pending">
            <input
              type="checkbox"
              checked={filters.ycsxpendingcheck}
              onChange={(e) => onFilterChange("ycsxpendingcheck", e.target.checked)}
            />
            <span>Chỉ YCSX Pending</span>
          </label>

          <label className="precision-ycsx__filterCheck">
            <input
              type="checkbox"
              checked={filters.inspectInputcheck}
              onChange={(e) => onFilterChange("inspectInputcheck", e.target.checked)}
            />
            <span>Vào kiểm</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          className="precision-ycsx__filterSearchBtn"
          onClick={onSearch}
        >
          <FiZap />
          <span>Tra Cứu YCSX</span>
        </button>
      </div>
    </aside>
  );
};

export default memo(PrecisionYCSXFilterPanel);
