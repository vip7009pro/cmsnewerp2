import React from "react";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaPrint,
  FaBan,
  FaFileExcel,
  FaBarcode,
} from "react-icons/fa";

interface PrecisionLichSuTemLotSxMobileToolbarProps {
  searchKeyword: string;
  onSearchKeywordChange: (kw: string) => void;
  onOpenFilter: () => void;
  activeFilterCount: number;
  onOpenPreview: () => void;
  onCancelLot: () => void;
  onExportExcel: (type: "EX1" | "EX2") => void;
  dataCount: number;
  totalCount: number;
  selectedLot?: string | null;
}

export const PrecisionLichSuTemLotSxMobileToolbar: React.FC<
  PrecisionLichSuTemLotSxMobileToolbarProps
> = ({
  searchKeyword,
  onSearchKeywordChange,
  onOpenFilter,
  activeFilterCount,
  onOpenPreview,
  onCancelLot,
  onExportExcel,
  dataCount,
  totalCount,
  selectedLot,
}) => {
  return (
    <div className="precision-lichsutemlotsx-mobile-toolbar">
      {/* Hàng 1: Ô Search Thông Minh 14px chống zoom + Nút Mở Bộ Lọc */}
      <div className="toolbar-search-row">
        <div className="mobile-search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="mobile-search-input"
            placeholder="Lọc nhanh (Lot, Mã hàng, YCSX, NVL...)"
            value={searchKeyword}
            onChange={(e) => onSearchKeywordChange(e.target.value)}
          />
          {searchKeyword && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => onSearchKeywordChange("")}
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
        {/* Nút Xem & In Tem Lót */}
        <button
          type="button"
          className="btn-mobile-action btn-mobile-action--preview"
          onClick={onOpenPreview}
          title="Xem trước và In Tem Lót"
        >
          <FaPrint size={11} />
          <span>Xem & In Tem</span>
        </button>

        {/* Nút Hủy LOT */}
        <button
          type="button"
          className="btn-mobile-action btn-mobile-action--cancel"
          onClick={onCancelLot}
          title="Hủy LOT sản xuất"
        >
          <FaBan size={11} />
          <span>Hủy LOT</span>
        </button>

        {/* Nút Xuất Excel EX1 */}
        <button
          type="button"
          className="btn-mobile-action btn-mobile-action--excel"
          onClick={() => onExportExcel("EX1")}
          title="Xuất Excel danh sách đang lọc"
        >
          <FaFileExcel size={11} />
          <span>EX1 (Lọc)</span>
        </button>

        {/* Nút Xuất Excel EX2 */}
        <button
          type="button"
          className="btn-mobile-action btn-mobile-action--excel-all"
          onClick={() => onExportExcel("EX2")}
          title="Xuất Excel toàn bộ dữ liệu"
        >
          <FaFileExcel size={11} />
          <span>EX2 (Tất cả)</span>
        </button>

        {/* Badge Số Dòng */}
        <span className="mobile-rows-count">
          {dataCount.toLocaleString("en-US")} / {totalCount.toLocaleString("en-US")} dòng
        </span>

        {/* Badge LOT đang chọn */}
        {selectedLot && (
          <span className="mobile-selected-lot-chip">
            <FaBarcode size={10} />
            <span>{selectedLot}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default React.memo(PrecisionLichSuTemLotSxMobileToolbar);
