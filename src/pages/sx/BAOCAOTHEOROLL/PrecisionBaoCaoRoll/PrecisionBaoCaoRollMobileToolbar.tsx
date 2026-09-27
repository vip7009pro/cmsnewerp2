import React from "react";
import { FaSearch, FaFilter, FaTimes, FaFileExcel, FaTable } from "react-icons/fa";

interface PrecisionBaoCaoRollMobileToolbarProps {
  searchKeyword: string;
  onSearchChange: (text: string) => void;
  onOpenFilter: () => void;
  activeFilterCount: number;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  totalRows: number;
  filteredRows: number;
}

export const PrecisionBaoCaoRollMobileToolbar: React.FC<PrecisionBaoCaoRollMobileToolbarProps> = ({
  searchKeyword,
  onSearchChange,
  onOpenFilter,
  activeFilterCount,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  totalRows,
  filteredRows,
}) => {
  return (
    <div className="precision-bcr-mobile-toolbar">
      {/* Hàng 1: Ô Search Thông Minh 14px chống zoom Safari iOS + Nút Mở Bộ Lọc */}
      <div className="toolbar-search-row">
        <div className="mobile-search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="mobile-search-input"
            placeholder="Lọc nhanh (YCSX, PLAN, Code, Tên liệu, Lot...)"
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchKeyword && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => onSearchChange("")}
              title="Xóa tìm kiếm"
            >
              <FaTimes size={11} />
            </button>
          )}
        </div>

        <button
          type="button"
          className={`btn-mobile-filter-trigger ${
            activeFilterCount > 0 ? "btn-mobile-filter-trigger--active" : ""
          }`}
          onClick={onOpenFilter}
          title="Mở bảng lọc điều kiện nâng cao"
        >
          <FaFilter size={12} />
          <span>Bộ Lọc</span>
          {activeFilterCount > 0 && (
            <span className="filter-count-badge">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Hàng 2: Dải Nút Thao Tác Cuộn Ngang Công Thái Học */}
      <div className="toolbar-actions-scroll">
        {/* Nút Xuất Excel EX1 */}
        <button
          type="button"
          className="btn-mobile-action btn-mobile-action--excel"
          onClick={onExportEX1}
          title="Xuất Excel danh sách đang hiển thị"
        >
          <FaFileExcel size={11} />
          <span>EX1 (Lọc)</span>
        </button>

        {/* Nút Xuất Excel EX2 */}
        <button
          type="button"
          className="btn-mobile-action btn-mobile-action--excel-all"
          onClick={onExportEX2}
          title="Xuất Excel toàn bộ dữ liệu báo cáo"
        >
          <FaFileExcel size={11} />
          <span>EX2 (Tất cả)</span>
        </button>

        {/* Nút Mở Pivot Table */}
        <button
          type="button"
          className="btn-mobile-action btn-mobile-action--pivot"
          onClick={onOpenPivot}
          title="Mở phân tích Pivot Table"
        >
          <FaTable size={11} />
          <span>PIVOT</span>
        </button>

        {/* Badge Số Dòng */}
        <span className="mobile-rows-count">
          <strong>{filteredRows.toLocaleString("en-US")}</strong> / {totalRows.toLocaleString("en-US")} dòng
        </span>
      </div>
    </div>
  );
};

export default React.memo(PrecisionBaoCaoRollMobileToolbar);
