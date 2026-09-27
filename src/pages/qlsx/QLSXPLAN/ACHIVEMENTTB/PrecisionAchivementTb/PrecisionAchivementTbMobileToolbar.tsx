import React from "react";
import moment from "moment";
import { BiSearch } from "react-icons/bi";
import { FiFilter, FiX } from "react-icons/fi";
import { AiOutlineDownload } from "react-icons/ai";

interface PrecisionAchivementTbMobileToolbarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  fromdate: string;
  onQuickDate: (date: string) => void;
  onOpenFilter: () => void;
  activeFilterCount: number;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onSearch: () => void;
  isLoading: boolean;
  totalRows: number;
}

export const PrecisionAchivementTbMobileToolbar: React.FC<
  PrecisionAchivementTbMobileToolbarProps
> = ({
  searchTerm,
  setSearchTerm,
  fromdate,
  onQuickDate,
  onOpenFilter,
  activeFilterCount,
  onExportEX1,
  onExportEX2,
  onSearch,
  isLoading,
  totalRows,
}) => {
  const today = moment().format("YYYY-MM-DD");
  const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
  const beforeYesterday = moment().subtract(2, "days").format("YYYY-MM-DD");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="precision-achivementtb__mobileToolbar">
      {/* HÀNG 1: Ô TÌM KIẾM NHANH + NÚT BỘ LỌC + NÚT TRA PLAN */}
      <div className="toolbar-row-top">
        <div className="mobile-search-box">
          <BiSearch className="search-icon" size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm máy, YCSX, Code KD..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchTerm("")}
              title="Xóa tìm kiếm"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        {/* Nút Bộ Lọc */}
        <button
          type="button"
          className={`btn-mobile-filter ${activeFilterCount > 0 ? "has-filters" : ""}`}
          onClick={onOpenFilter}
          title="Mở bộ lọc nâng cao"
        >
          <FiFilter size={15} />
          <span className="btn-text">LỌC</span>
          {activeFilterCount > 0 && (
            <span className="filter-badge">{activeFilterCount}</span>
          )}
        </button>

        {/* Nút Tra Plan */}
        <button
          type="button"
          className="btn-mobile-search"
          onClick={onSearch}
          disabled={isLoading}
          title="Tra cứu kế hoạch sản xuất"
        >
          <BiSearch size={15} />
          <span className="btn-text">{isLoading ? "TẢI..." : "TRA"}</span>
        </button>
      </div>

      {/* HÀNG 2: CHIPS NGÀY NHANH + NÚT EXPORT EXCEL + ĐẾM LỆNH */}
      <div className="toolbar-row-actions">
        <div className="quick-date-group">
          <button
            type="button"
            className={`date-chip ${fromdate === today ? "active" : ""}`}
            onClick={() => onQuickDate(today)}
          >
            Hôm nay
          </button>
          <button
            type="button"
            className={`date-chip ${fromdate === yesterday ? "active" : ""}`}
            onClick={() => onQuickDate(yesterday)}
          >
            Hôm qua
          </button>
          <button
            type="button"
            className={`date-chip ${fromdate === beforeYesterday ? "active" : ""}`}
            onClick={() => onQuickDate(beforeYesterday)}
          >
            Hôm kia
          </button>
        </div>

        <div className="action-divider" />

        <div className="export-btn-group">
          <button
            type="button"
            className="btn-export btn-export--ex1"
            onClick={onExportEX1}
            title="Xuất dữ liệu đang lọc"
          >
            <AiOutlineDownload size={13} />
            <span>EX1</span>
          </button>
          <button
            type="button"
            className="btn-export btn-export--ex2"
            onClick={onExportEX2}
            title="Xuất toàn bộ dữ liệu"
          >
            <AiOutlineDownload size={13} />
            <span>EX2</span>
          </button>
        </div>

        <div className="row-counter">
          <span>{totalRows} Lệnh</span>
        </div>
      </div>
    </div>
  );
};
