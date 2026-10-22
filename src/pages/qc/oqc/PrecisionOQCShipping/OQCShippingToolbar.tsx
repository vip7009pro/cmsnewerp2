import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface OQCShippingToolbarProps {
  fromdate: string;
  setFromDate: (val: string) => void;
  todate: string;
  setToDate: (val: string) => void;
  custName: string;
  setCustName: (val: string) => void;
  gName: string;
  setGName: (val: string) => void;
  gCode: string;
  setGCode: (val: string) => void;
  handleSearchCodeKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  isLoading: boolean;
  quickFilterText: string;
  setQuickFilterText: (val: string) => void;
  onExportExcelFiltered: () => void;
  onExportExcelAll: () => void;
  filteredCount: number;
  totalCount: number;
}

export const OQCShippingToolbar: React.FC<OQCShippingToolbarProps> = ({
  fromdate,
  setFromDate,
  todate,
  setToDate,
  custName,
  setCustName,
  gName,
  setGName,
  gCode,
  setGCode,
  handleSearchCodeKeyDown,
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
    <div className="precision-oqc-shipping-toolbar">
      {/* Hàng 1: Bộ Lọc Tra Cứu */}
      <div className="toolbar-filters-row">
        <div className="filter-group">
          <label>Từ ngày:</label>
          <input
            type="date"
            className="date-input"
            value={fromdate.slice(0, 10)}
            onChange={(e) => setFromDate(e.target.value)}
            onKeyDown={handleSearchCodeKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>Đến ngày:</label>
          <input
            type="date"
            className="date-input"
            value={todate.slice(0, 10)}
            onChange={(e) => setToDate(e.target.value)}
            onKeyDown={handleSearchCodeKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>Khách hàng:</label>
          <input
            type="text"
            className="text-input"
            placeholder="Tên khách hàng..."
            value={custName}
            onChange={(e) => setCustName(e.target.value)}
            onKeyDown={handleSearchCodeKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>Tên SP / Code (G_NAME):</label>
          <input
            type="text"
            className="text-input text-input--wide"
            placeholder="Tên/Mã sản phẩm..."
            value={gName}
            onChange={(e) => setGName(e.target.value)}
            onKeyDown={handleSearchCodeKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>Mã ERP (G_CODE):</label>
          <input
            type="text"
            className="text-input"
            placeholder="Mã G_CODE..."
            value={gCode}
            onChange={(e) => setGCode(e.target.value)}
            onKeyDown={handleSearchCodeKeyDown}
          />
        </div>

        <button
          className="btn-search"
          onClick={onSearch}
          disabled={isLoading}
          title="Tra cứu dữ liệu xuất hàng OQC (Enter)"
        >
          <SearchIcon style={{ fontSize: "0.9rem" }} />
          <span>{isLoading ? "Đang Tải..." : "Tra Dữ Liệu"}</span>
        </button>
      </div>

      {/* Hàng 2: Công Cụ Lưới Dữ Liệu */}
      <div className="toolbar-actions-row">
        <div className="actions-left">
          <div className="quick-filter-box">
            <SearchIcon style={{ fontSize: "0.85rem", color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Lọc nhanh trên bảng (Code, Khách, Ca, Plan, Trạng thái...)..."
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
            />
          </div>
        </div>

        <div className="actions-right">
          <button
            className="btn-excel"
            onClick={onExportExcelFiltered}
            title="Xuất Excel danh sách đang lọc trên bảng"
          >
            <FileDownloadIcon style={{ fontSize: "0.85rem" }} />
            <span>EX1 (Lọc)</span>
          </button>

          <button
            className="btn-excel"
            onClick={onExportExcelAll}
            title="Xuất Excel toàn bộ dữ liệu xuất hàng"
          >
            <FileDownloadIcon style={{ fontSize: "0.85rem" }} />
            <span>EX2 (Toàn Bộ)</span>
          </button>

          <span className="row-count-badge">
            Hiển thị: {filteredCount} / {totalCount} dòng
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OQCShippingToolbar);
