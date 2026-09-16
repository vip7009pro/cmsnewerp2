import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface PrecisionQTRDataToolbarProps {
  fromdate: string;
  setFromDate: (val: string) => void;
  todate: string;
  setToDate: (val: string) => void;
  handleSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  isLoading: boolean;
  quickFilterText: string;
  setQuickFilterText: (val: string) => void;
  onExportExcelFiltered: () => void;
  onExportExcelAll: () => void;
  filteredCount: number;
  totalCount: number;
}

export const PrecisionQTRDataToolbar: React.FC<PrecisionQTRDataToolbarProps> = ({
  fromdate,
  setFromDate,
  todate,
  setToDate,
  handleSearchKeyDown,
  onSearch,
  isLoading,
  quickFilterText,
  setQuickFilterText,
  onExportExcelFiltered,
  onExportExcelAll,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="precision-qtr-toolbar">
      {/* Hàng 1: Bộ Lọc Tra Cứu */}
      <div className="toolbar-filters-row">
        <div className="filter-group">
          <label>Từ ngày:</label>
          <input
            type="date"
            className="date-input"
            value={fromdate.slice(0, 10)}
            onChange={(e) => setFromDate(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>Đến ngày:</label>
          <input
            type="date"
            className="date-input"
            value={todate.slice(0, 10)}
            onChange={(e) => setToDate(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        <button
          className="btn-search"
          onClick={onSearch}
          disabled={isLoading}
          title="Tra cứu dữ liệu sự cố QTR (Enter)"
        >
          <SearchIcon style={{ fontSize: "0.9rem" }} />
          <span>{isLoading ? "Đang Tải..." : "Tra Dữ Liệu QTR"}</span>
        </button>
      </div>

      {/* Hàng 2: Công Cụ Lưới Dữ Liệu */}
      <div className="toolbar-actions-row">
        <div className="actions-left">
          <div className="quick-filter-box">
            <SearchIcon style={{ fontSize: "0.85rem", color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Lọc nhanh sự cố (Mã QTR, Linh kiện, Dự án, Chi tiết lỗi...)..."
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
            />
          </div>
        </div>

        <div className="actions-right">
          <button
            className="btn-excel"
            onClick={onExportExcelFiltered}
            title="Xuất Excel danh sách sự cố đang lọc"
          >
            <FileDownloadIcon style={{ fontSize: "0.85rem" }} />
            <span>EX1 (Lọc)</span>
          </button>

          <button
            className="btn-excel"
            onClick={onExportExcelAll}
            title="Xuất Excel toàn bộ dữ liệu sự cố QTR"
          >
            <FileDownloadIcon style={{ fontSize: "0.85rem" }} />
            <span>EX2 (Toàn Bộ)</span>
          </button>

          <span className="row-count-badge">
            Hiển thị: {filteredCount} / {totalCount} vụ sự cố
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionQTRDataToolbar);
