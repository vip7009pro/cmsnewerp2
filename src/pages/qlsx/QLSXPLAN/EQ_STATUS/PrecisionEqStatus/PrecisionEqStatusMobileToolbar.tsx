import React from "react";
import {
  FiSearch,
  FiX,
  FiFilter,
  FiRotateCcw,
  FiCheckCircle,
} from "react-icons/fi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PrecisionEqStatusMobileToolbarProps {
  factory: string;
  setFactory: (val: string) => void;
  machine: string;
  setMachine: (val: string) => void;
  eqSeries: string[];
  machineNumber: number;
  setMachineNumber: (val: number) => void;
  onlyRunning: boolean;
  setOnlyRunning: (val: boolean | ((prev: boolean) => boolean)) => void;
  searchString: string;
  setSearchString: (val: string) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  currentPage: number;
  totalPages: number;
  startIdx: number;
  endIdx: number;
  totalFiltered: number;
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
  onReset: () => void;
}

export const PrecisionEqStatusMobileToolbar: React.FC<
  PrecisionEqStatusMobileToolbarProps
> = React.memo(({
  factory,
  setFactory,
  machine,
  setMachine,
  eqSeries,
  machineNumber,
  setMachineNumber,
  onlyRunning,
  setOnlyRunning,
  searchString,
  setSearchString,
  onPrevPage,
  onNextPage,
  currentPage,
  totalPages,
  startIdx,
  endIdx,
  totalFiltered,
  onOpenFilterDrawer,
  activeFilterCount,
  onReset,
}) => {
  return (
    <div className="precision-eq-mobile-toolbar">
      {/* HÀNG 1: Ô SEARCH NHANH + PHÂN TRANG GỌN + NÚT BỘ LỌC */}
      <div className="mobile-toolbar-row mobile-toolbar-row--search">
        {/* Search Input Box */}
        <div className="mobile-search-box">
          <FiSearch size={15} className="mobile-search-icon" />
          <input
            type="text"
            className="mobile-search-input"
            placeholder="Lọc mã máy, mã hàng, CT..."
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
          {searchString.length > 0 && (
            <button
              type="button"
              className="mobile-search-clear"
              onClick={() => setSearchString("")}
              title="Xóa tìm kiếm"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        {/* Cụm Phân Trang Nhanh */}
        <div className="mobile-page-controls">
          <button
            type="button"
            className="mobile-page-btn"
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            title="Trang trước"
          >
            <FaChevronLeft size={11} />
          </button>
          <span className="mobile-page-text">
            {currentPage}/{totalPages || 1}
          </span>
          <button
            type="button"
            className="mobile-page-btn"
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            title="Trang sau"
          >
            <FaChevronRight size={11} />
          </button>
        </div>

        {/* Nút Mở Bottom Sheet Filter Drawer */}
        <button
          type="button"
          className={`mobile-filter-btn ${
            activeFilterCount > 0 ? "mobile-filter-btn--active" : ""
          }`}
          onClick={onOpenFilterDrawer}
          title="Mở bộ lọc & cấu hình"
        >
          <FiFilter size={14} />
          <span>Lọc</span>
          {activeFilterCount > 0 && (
            <span className="mobile-filter-badge">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* HÀNG 2: DẢI NÚT HÀNH ĐỘNG CUỘN NGANG CÔNG THÁI HỌC */}
      <div className="mobile-toolbar-row mobile-toolbar-row--actions">
        {/* Chip Thống Kê Số Máy */}
        <div
          className="mobile-stat-chip"
          title="Khoảng máy đang xem trên tổng số máy tìm thấy"
        >
          <span>Máy:</span>
          <strong>
            {totalFiltered > 0 ? `${startIdx}-${endIdx}` : 0}/{totalFiltered}
          </strong>
        </div>

        {/* Segmented Switcher Chọn Xưởng Nhanh */}
        <div className="mobile-factory-switcher">
          <button
            type="button"
            className={`factory-btn ${factory === "NM1" ? "active" : ""}`}
            onClick={() => setFactory("NM1")}
          >
            NM1
          </button>
          <button
            type="button"
            className={`factory-btn ${factory === "NM2" ? "active" : ""}`}
            onClick={() => setFactory("NM2")}
          >
            NM2
          </button>
        </div>

        {/* Chọn Loại Máy Nhanh */}
        <div className="mobile-select-wrapper">
          <select
            className="mobile-quick-select"
            value={machine}
            onChange={(e) => setMachine(e.target.value)}
          >
            {eqSeries.map((ele: string, index: number) => (
              <option key={index} value={ele}>
                Loại {ele}
              </option>
            ))}
          </select>
        </div>

        {/* Chip Toggle "Chỉ máy đang chạy" */}
        <button
          type="button"
          className={`mobile-chip-toggle ${
            onlyRunning ? "mobile-chip-toggle--active" : ""
          }`}
          onClick={() => setOnlyRunning((prev: boolean) => !prev)}
          title="Chỉ hiển thị máy có trạng thái MASS hoặc SETTING"
        >
          <FiCheckCircle size={12} />
          <span>Chỉ máy chạy</span>
        </button>

        {/* Chọn số máy / trang nhanh */}
        <div className="mobile-select-wrapper">
          <select
            className="mobile-quick-select"
            value={machineNumber}
            onChange={(e) => setMachineNumber(Number(e.target.value))}
            title="Số máy hiển thị trên mỗi trang"
          >
            <option value={4}>4 máy / trang</option>
            <option value={6}>6 máy / trang</option>
            <option value={8}>8 máy / trang</option>
            <option value={12}>12 máy / trang</option>
            <option value={16}>16 máy / trang</option>
          </select>
        </div>

        {/* Nút Reset Bộ Lọc */}
        <button
          type="button"
          className="mobile-reset-btn"
          onClick={onReset}
          title="Khôi phục cài đặt mặc định"
        >
          <FiRotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
});

export default PrecisionEqStatusMobileToolbar;
