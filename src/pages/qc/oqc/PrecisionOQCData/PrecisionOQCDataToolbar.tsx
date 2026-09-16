import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { OQC_DATA } from "../../interfaces/qcInterface";

interface PrecisionOQCDataToolbarProps {
  fromdate: string;
  setFromDate: (val: string) => void;
  todate: string;
  setToDate: (val: string) => void;
  selectedRows: OQC_DATA;
  setOQCFormInfo: (keyname: string, value: any) => void;
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

export const PrecisionOQCDataToolbar: React.FC<PrecisionOQCDataToolbarProps> = ({
  fromdate,
  setFromDate,
  todate,
  setToDate,
  selectedRows,
  setOQCFormInfo,
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
    <div className="precision-oqc-toolbar">
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
          <label>Code KD:</label>
          <input
            type="text"
            className="text-input"
            placeholder="Tên/Mã KD..."
            value={selectedRows?.G_NAME_KD || ""}
            onChange={(e) => setOQCFormInfo("G_NAME_KD", e.target.value)}
            onKeyDown={handleSearchCodeKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>Code ERP:</label>
          <input
            type="text"
            className="text-input"
            placeholder="Mã ERP..."
            value={selectedRows?.G_CODE || ""}
            onChange={(e) => setOQCFormInfo("G_CODE", e.target.value)}
            onKeyDown={handleSearchCodeKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>YCSX:</label>
          <input
            type="text"
            className="text-input"
            placeholder="Số chỉ thị..."
            value={selectedRows?.PROD_REQUEST_NO || ""}
            onChange={(e) => setOQCFormInfo("PROD_REQUEST_NO", e.target.value)}
            onKeyDown={handleSearchCodeKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>Khách hàng:</label>
          <input
            type="text"
            className="text-input"
            placeholder="Tên khách hàng..."
            value={selectedRows?.CUST_NAME_KD || ""}
            onChange={(e) => setOQCFormInfo("CUST_NAME_KD", e.target.value)}
            onKeyDown={handleSearchCodeKeyDown}
          />
        </div>

        <button
          className="btn-search"
          onClick={onSearch}
          disabled={isLoading}
          title="Tra cứu dữ liệu OQC (Enter)"
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
              placeholder="Lọc nhanh trên bảng (Code, Lot, Khách...)..."
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
            title="Xuất Excel toàn bộ dữ liệu OQC"
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

export default React.memo(PrecisionOQCDataToolbar);
