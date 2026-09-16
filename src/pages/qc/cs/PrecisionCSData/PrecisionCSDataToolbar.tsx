import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TableChartIcon from "@mui/icons-material/TableChart";
import { CSFilterState, CSOptionType } from "./useCSData";

interface PrecisionCSDataToolbarProps {
  filters: CSFilterState;
  onFilterChange: (field: keyof CSFilterState, value: string) => void;
  onSearch: () => void;
  activeOption: CSOptionType;
  onOptionChange: (option: CSOptionType) => void;
  quickSearchText: string;
  onQuickSearchChange: (text: string) => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  totalRows: number;
  filteredRows: number;
}

export const PrecisionCSDataToolbar: React.FC<PrecisionCSDataToolbarProps> = ({
  filters,
  onFilterChange,
  onSearch,
  activeOption,
  onOptionChange,
  quickSearchText,
  onQuickSearchChange,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  totalRows,
  filteredRows,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="precision-cs__toolbar">
      {/* Hàng 1: Bộ lọc đa trường compact */}
      <div className="filter-row">
        <div className="filter-group">
          <label>Từ ngày:</label>
          <input
            type="date"
            value={filters.FROM_DATE.slice(0, 10)}
            onChange={(e) => onFilterChange("FROM_DATE", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>Đến ngày:</label>
          <input
            type="date"
            value={filters.TO_DATE.slice(0, 10)}
            onChange={(e) => onFilterChange("TO_DATE", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>Code KD:</label>
          <input
            type="text"
            placeholder="GH63-..."
            value={filters.G_NAME}
            onChange={(e) => onFilterChange("G_NAME", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>Code ERP:</label>
          <input
            type="text"
            placeholder="7C123..."
            value={filters.G_CODE}
            onChange={(e) => onFilterChange("G_CODE", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>Số YCSX:</label>
          <input
            type="text"
            placeholder="1F8..."
            value={filters.PROD_REQUEST_NO}
            onChange={(e) => onFilterChange("PROD_REQUEST_NO", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>Khách hàng:</label>
          <input
            type="text"
            placeholder="SEV..."
            value={filters.CUST_NAME_KD}
            onChange={(e) => onFilterChange("CUST_NAME_KD", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button
          type="button"
          className="btn-search"
          onClick={onSearch}
          title="Nhấn để nạp dữ liệu CS (hoặc nhấn Enter ở bất kỳ ô nhập nào)"
        >
          <SearchIcon style={{ fontSize: "0.95rem" }} />
          <span>TRA DỮ LIỆU</span>
        </button>
      </div>

      {/* Hàng 2: Segment Switcher & Action Bar */}
      <div className="action-row">
        <div className="action-left">
          {/* Switcher 4 Chế Độ Phân Hệ CS */}
          <div className="segment-switcher">
            <button
              type="button"
              className={`segment-btn ${activeOption === "dataconfirm" ? "active" : ""}`}
              onClick={() => onOptionChange("dataconfirm")}
              title="Lịch sử xác nhận lỗi khiếu nại khách hàng CS"
            >
              📋 Xác Nhận Lỗi (CS)
            </button>
            <button
              type="button"
              className={`segment-btn ${activeOption === "datarma" ? "active" : ""}`}
              onClick={() => onOptionChange("datarma")}
              title="Lịch sử hàng trả về khách hàng RMA"
            >
              🔄 Lịch Sử RMA
            </button>
            <button
              type="button"
              className={`segment-btn ${activeOption === "datacndbkhachhang" ? "active" : ""}`}
              onClick={() => onOptionChange("datacndbkhachhang")}
              title="Lịch sử xin chấp nhận đặc biệt từ khách hàng (Special Acceptance)"
            >
              ⚠️ Xin CNĐB (SA)
            </button>
            <button
              type="button"
              className={`segment-btn ${activeOption === "datataxi" ? "active" : ""}`}
              onClick={() => onOptionChange("datataxi")}
              title="Lịch sử chi phí taxi hỗ trợ khách hàng tại hiện trường"
            >
              🚕 Chi Phí Taxi
            </button>
          </div>

          <div className="search-box">
            <SearchIcon style={{ fontSize: "0.9rem", color: "#64748b" }} />
            <input
              type="text"
              placeholder="Lọc nhanh mã hàng, khách, YCSX, nội dung..."
              value={quickSearchText}
              onChange={(e) => onQuickSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="action-right">
          <button
            type="button"
            className="btn-grid-action excel-filtered"
            onClick={onExportEX1}
            title="Xuất dữ liệu đang hiển thị theo bộ lọc ra file Excel"
          >
            <FileDownloadIcon style={{ fontSize: "0.85rem" }} />
            <span>EX1</span>
            <span className="badge-pill">Lọc</span>
          </button>

          <button
            type="button"
            className="btn-grid-action excel-all"
            onClick={onExportEX2}
            title="Xuất toàn bộ dữ liệu ra file Excel"
          >
            <FileDownloadIcon style={{ fontSize: "0.85rem" }} />
            <span>EX2</span>
            <span className="badge-pill">Tất Cả</span>
          </button>

          {activeOption === "dataconfirm" && (
            <button
              type="button"
              className="btn-grid-action pivot"
              onClick={onOpenPivot}
              title="Mở bảng Pivot Table phân tích đa chiều sự cố CS"
            >
              <TableChartIcon style={{ fontSize: "0.85rem" }} />
              <span>PIVOT</span>
            </button>
          )}

          <span className="row-counter">
            Đang hiển thị: <strong>{filteredRows.toLocaleString("en-US")}</strong> /{" "}
            {totalRows.toLocaleString("en-US")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCSDataToolbar);
