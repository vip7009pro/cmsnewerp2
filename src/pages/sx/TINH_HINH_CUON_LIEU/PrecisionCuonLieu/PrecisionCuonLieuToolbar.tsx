import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TableChartIcon from "@mui/icons-material/TableChart";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import { CuonLieuFilterState } from "./useCuonLieuData";
import { MACHINE_LIST } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

interface PrecisionCuonLieuToolbarProps {
  filters: CuonLieuFilterState;
  onFilterChange: (field: keyof CuonLieuFilterState, value: any) => void;
  machineList: MACHINE_LIST[];
  onSearch: () => void;
  showChart: boolean;
  onToggleChart: () => void;
  dailyGraph: boolean;
  onToggleDailyWeekly: (isDaily: boolean) => void;
  quickSearchText: string;
  onQuickSearchChange: (text: string) => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  totalRows: number;
  filteredRows: number;
}

export const PrecisionCuonLieuToolbar: React.FC<PrecisionCuonLieuToolbarProps> = ({
  filters,
  onFilterChange,
  machineList,
  onSearch,
  showChart,
  onToggleChart,
  dailyGraph,
  onToggleDailyWeekly,
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
    <div className="precision-cuonlieu__toolbar">
      {/* Hàng 1: Bộ lọc đa trường compact */}
      <div className="filter-row">
        <div className="filter-group">
          <label>Từ ngày:</label>
          <input
            type="date"
            value={filters.fromdate}
            onChange={(e) => onFilterChange("fromdate", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>Đến ngày:</label>
          <input
            type="date"
            value={filters.todate}
            onChange={(e) => onFilterChange("todate", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="filter-group">
          <label className="checkbox-label" title="Tra cứu toàn bộ thời gian">
            <input
              type="checkbox"
              checked={filters.alltime}
              onChange={(e) => onFilterChange("alltime", e.target.checked)}
            />
            <span>All Time</span>
          </label>
        </div>

        <div className="filter-group">
          <label>Nhà máy:</label>
          <select
            value={filters.factory}
            onChange={(e) => onFilterChange("factory", e.target.value)}
          >
            <option value="ALL">ALL (Tất cả)</option>
            <option value="NM1">NM1</option>
            <option value="NM2">NM2</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Máy (Line):</label>
          <select
            value={filters.machine}
            onChange={(e) => onFilterChange("machine", e.target.value)}
          >
            <option value="ALL">ALL (Tất cả)</option>
            {machineList.map((m, idx) => (
              <option key={idx} value={m.EQ_NAME}>
                {m.EQ_NAME}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Code KD:</label>
          <input
            type="text"
            placeholder="GH63-..."
            value={filters.codekd}
            onChange={(e) => onFilterChange("codekd", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>Code ERP:</label>
          <input
            type="text"
            placeholder="7C123..."
            value={filters.codecms}
            onChange={(e) => onFilterChange("codecms", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>Tên Liệu:</label>
          <input
            type="text"
            placeholder="SJ-2030..."
            value={filters.m_name}
            onChange={(e) => onFilterChange("m_name", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>Mã Liệu:</label>
          <input
            type="text"
            placeholder="A123..."
            value={filters.m_code}
            onChange={(e) => onFilterChange("m_code", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>Số YCSX:</label>
          <input
            type="text"
            placeholder="1F8..."
            value={filters.prodrequestno}
            onChange={(e) => onFilterChange("prodrequestno", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>Số Chỉ Thị:</label>
          <input
            type="text"
            placeholder="PLAN_ID"
            value={filters.plan_id}
            onChange={(e) => onFilterChange("plan_id", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="filter-group">
          <label>Khách:</label>
          <input
            type="text"
            placeholder="SEV..."
            style={{ width: "85px" }}
            value={filters.cust_name_kd}
            onChange={(e) => onFilterChange("cust_name_kd", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button
          type="button"
          className="btn-search"
          onClick={onSearch}
          title="Nhấn để nạp dữ liệu cuộn liệu (hoặc nhấn Enter ở bất kỳ ô nhập nào)"
        >
          <SearchIcon style={{ fontSize: "0.95rem" }} />
          <span>TRA LIỆU</span>
        </button>
      </div>

      {/* Hàng 2: Grid Toolbar Actions & Controls */}
      <div className="action-row">
        <div className="action-left">
          <button
            type="button"
            className={`btn-toggle-chart ${showChart ? "active" : ""}`}
            onClick={onToggleChart}
            title="Bật hoặc thu gọn biểu đồ tổn thất cuộn liệu để tối đa diện tích bảng"
          >
            <InsertChartIcon style={{ fontSize: "0.9rem" }} />
            <span>{showChart ? "Ẩn Biểu Đồ" : "Hiện Biểu Đồ"}</span>
          </button>

          {showChart && (
            <div className="chart-mode-switcher">
              <button
                type="button"
                className={`mode-btn ${!dailyGraph ? "active" : ""}`}
                onClick={() => onToggleDailyWeekly(false)}
              >
                📊 Theo Tuần
              </button>
              <button
                type="button"
                className={`mode-btn ${dailyGraph ? "active" : ""}`}
                onClick={() => onToggleDailyWeekly(true)}
              >
                📅 Theo Ngày
              </button>
            </div>
          )}

          <div className="search-box">
            <SearchIcon style={{ fontSize: "0.9rem", color: "#64748b" }} />
            <input
              type="text"
              placeholder="Lọc nhanh lot, mã hàng, tên liệu, YCSX..."
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
            title="Xuất toàn bộ dữ liệu cuộn liệu ra file Excel"
          >
            <FileDownloadIcon style={{ fontSize: "0.85rem" }} />
            <span>EX2</span>
            <span className="badge-pill">Tất Cả</span>
          </button>

          <button
            type="button"
            className="btn-grid-action pivot"
            onClick={onOpenPivot}
            title="Mở bảng Pivot Table phân tích đa chiều"
          >
            <TableChartIcon style={{ fontSize: "0.85rem" }} />
            <span>PIVOT</span>
          </button>

          <span className="row-counter">
            Đang hiển thị: <strong>{filteredRows.toLocaleString("en-US")}</strong> /{" "}
            {totalRows.toLocaleString("en-US")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCuonLieuToolbar);
