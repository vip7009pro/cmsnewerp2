import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import SyncIcon from "@mui/icons-material/Sync";

interface PrecisionQLGNToolbarProps {
  onRefresh: () => void;
  showInputForm: boolean;
  onToggleForm: () => void;
  quickFilterText: string;
  onQuickFilterChange: (text: string) => void;
  onExportFiltered: () => void;
  onExportAll: () => void;
  totalRows: number;
  loading: boolean;
}

export const PrecisionQLGNToolbar: React.FC<PrecisionQLGNToolbarProps> = ({
  onRefresh,
  showInputForm,
  onToggleForm,
  quickFilterText,
  onQuickFilterChange,
  onExportFiltered,
  onExportAll,
  totalRows,
  loading,
}) => {
  return (
    <div className="precision-qlgn-toolbar">
      <div className="toolbar-left">
        <button
          className="btn-tool"
          onClick={onRefresh}
          disabled={loading}
          title="Tải lại toàn bộ dữ liệu bàn giao từ hệ thống"
        >
          <SyncIcon style={{ fontSize: "0.95rem" }} className={loading ? "animate-spin" : ""} />
          <span>Tra Data</span>
        </button>

        <button
          className={`btn-tool ${showInputForm ? "btn-active" : ""}`}
          onClick={onToggleForm}
          title={showInputForm ? "Thu gọn form nhập liệu để mở rộng bảng" : "Hiển thị form nhập liệu"}
        >
          <ViewSidebarIcon style={{ fontSize: "0.95rem" }} />
          <span>{showInputForm ? "Ẩn Form" : "Hiện Form"}</span>
        </button>
      </div>

      <div className="toolbar-right">
        <div className="search-box">
          <input
            type="text"
            placeholder="Lọc nhanh trên bảng..."
            value={quickFilterText}
            onChange={(e) => onQuickFilterChange(e.target.value)}
          />
          {quickFilterText ? (
            <ClearIcon className="search-clear" onClick={() => onQuickFilterChange("")} />
          ) : (
            <SearchIcon style={{ position: "absolute", right: 6, color: "#94a3b8", fontSize: "1rem" }} />
          )}
        </div>

        <button className="btn-excel" onClick={onExportFiltered} title="Xuất dữ liệu đang hiển thị ra Excel">
          <FileDownloadIcon style={{ fontSize: "0.9rem" }} />
          <span>EX1 (Lọc)</span>
        </button>

        <button className="btn-excel" onClick={onExportAll} title="Xuất toàn bộ dữ liệu bàn giao ra Excel">
          <FileDownloadIcon style={{ fontSize: "0.9rem" }} />
          <span>EX2 (Tất Cả)</span>
        </button>

        <div className="badge-counter" title="Tổng số bản ghi">
          {totalRows.toLocaleString()} dòng
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionQLGNToolbar);
