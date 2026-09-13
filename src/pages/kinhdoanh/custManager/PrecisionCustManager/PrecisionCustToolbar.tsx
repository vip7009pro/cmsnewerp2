import React, { useEffect, useRef } from "react";
import { FiDownload, FiFileText, FiPieChart, FiPlus, FiRefreshCw, FiSearch } from "react-icons/fi";

export type CustFilterType = "ALL" | "KH" | "NCC" | "USE" | "NOT_USE";

interface PrecisionCustToolbarProps {
  currentFilter: CustFilterType;
  onChangeFilter: (type: CustFilterType) => void;
  searchKeyword: string;
  onChangeSearch: (val: string) => void;
  onAddNew: () => void;
  onRefresh: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  counts: {
    total: number;
    kh: number;
    ncc: number;
    use: number;
    off: number;
  };
}

const PrecisionCustToolbar: React.FC<PrecisionCustToolbarProps> = ({
  currentFilter,
  onChangeFilter,
  searchKeyword,
  onChangeSearch,
  onAddNew,
  onRefresh,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  counts,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Lắng nghe phím tắt Ctrl + K để focus nhanh vào ô tìm kiếm
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="precision-cust__toolbar">
      {/* Cụm bộ lọc phân loại dạng Segment Pill */}
      <div className="toolbar-left">
        <button
          type="button"
          className={`segment-btn ${currentFilter === "ALL" ? "active" : ""}`}
          onClick={() => onChangeFilter("ALL")}
        >
          <span>Tất cả ({counts.total})</span>
        </button>

        <button
          type="button"
          className={`segment-btn segment-btn--kh ${currentFilter === "KH" ? "active" : ""}`}
          onClick={() => onChangeFilter("KH")}
        >
          <span className="dot dot--blue" />
          <span>🏢 Khách Hàng - KH ({counts.kh})</span>
        </button>

        <button
          type="button"
          className={`segment-btn segment-btn--ncc ${currentFilter === "NCC" ? "active" : ""}`}
          onClick={() => onChangeFilter("NCC")}
        >
          <span className="dot dot--indigo" />
          <span>🏭 Nhà Cung Cấp - NCC ({counts.ncc})</span>
        </button>

        <div className="divider-v" />

        <button
          type="button"
          className={`segment-btn segment-btn--use ${currentFilter === "USE" ? "active" : ""}`}
          onClick={() => onChangeFilter("USE")}
        >
          <span className="dot dot--green" />
          <span>Đang GD (USE: {counts.use})</span>
        </button>

        <button
          type="button"
          className={`segment-btn segment-btn--off ${currentFilter === "NOT_USE" ? "active" : ""}`}
          onClick={() => onChangeFilter("NOT_USE")}
        >
          <span className="dot dot--red" />
          <span>Tạm ngưng (OFF: {counts.off})</span>
        </button>
      </div>

      {/* Cụm công cụ tìm kiếm & nút hành động */}
      <div className="toolbar-right">
        {/* Search Omnibar */}
        <div className="search-box">
          <FiSearch size={13} color="#94a3b8" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Tìm mã, tên, MST, SĐT, Email... (Ctrl+K)"
            value={searchKeyword}
            onChange={(e) => onChangeSearch(e.target.value)}
          />
        </div>

        {/* Nút Thêm mới */}
        <button
          type="button"
          className="btn-action btn-action--primary"
          onClick={onAddNew}
          title="Thêm mới hồ sơ khách hàng hoặc nhà cung cấp"
        >
          <FiPlus size={14} />
          <span>Thêm Mới Đối Tác</span>
        </button>

        {/* Nút Load */}
        <button
          type="button"
          className="btn-action btn-action--refresh"
          onClick={onRefresh}
          title="Tải lại danh sách đối tác từ máy chủ"
        >
          <FiRefreshCw size={13} />
          <span>Load Data</span>
        </button>

        {/* Nút EX1 */}
        <button
          type="button"
          className="btn-action btn-action--excel"
          onClick={onExportEX1}
          title="Xuất dữ liệu đang lọc ra file Excel"
        >
          <FiFileText size={13} />
          <span>EX1 (Lọc)</span>
        </button>

        {/* Nút EX2 */}
        <button
          type="button"
          className="btn-action btn-action--excel"
          onClick={onExportEX2}
          title="Xuất toàn bộ dữ liệu ra file Excel"
        >
          <FiDownload size={13} />
          <span>EX2 (Raw)</span>
        </button>

        {/* Nút PIVOT */}
        <button
          type="button"
          className="btn-action btn-action--pivot"
          onClick={onOpenPivot}
          title="Phân tích báo cáo đối tác đa chiều qua Pivot Table"
        >
          <FiPieChart size={13} />
          <span>PIVOT</span>
        </button>
      </div>
    </section>
  );
};

export default React.memo(PrecisionCustToolbar);
