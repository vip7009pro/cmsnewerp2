import React, { useEffect, useRef } from "react";
import {
  FiDownload,
  FiEdit3,
  FiFileText,
  FiPieChart,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiX,
  FiZap,
} from "react-icons/fi";

export type CustFilterType = "ALL" | "KH" | "NCC" | "USE" | "NOT_USE";

interface PrecisionCustToolbarProps {
  currentFilter: CustFilterType;
  onChangeFilter: (type: CustFilterType) => void;
  searchKeyword: string;
  onChangeSearch: (val: string) => void;
  onAddNew: () => void;
  onEditSelected: () => void;
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
  isMobile?: boolean;
  onOpenActionDrawer?: () => void;
  selectedCode?: string;
}

const PrecisionCustToolbar: React.FC<PrecisionCustToolbarProps> = ({
  currentFilter,
  onChangeFilter,
  searchKeyword,
  onChangeSearch,
  onAddNew,
  onEditSelected,
  onRefresh,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  counts,
  isMobile = false,
  onOpenActionDrawer,
  selectedCode,
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

  // GIAO DIỆN DESKTOP (> 768px): GIỮ NGUYÊN 100% CẤU TRÚC VÀ STYLES BAN ĐẦU
  if (!isMobile) {
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

          {/* Nút Sửa dòng đang chọn (khôi phục luồng legacy: click dòng -> Sửa) */}
          <button
            type="button"
            className="btn-action btn-action--refresh"
            onClick={onEditSelected}
            title="Sửa hồ sơ của dòng đang chọn trong bảng"
          >
            <FiEdit3 size={13} />
            <span>Sửa Đối Tác</span>
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
  }

  // GIAO DIỆN MOBILE (≤ 768px): TỐI ƯU CÔNG THÁI HỌC VỚI TOUCH TARGET ≥ 38PX & ZERO-BLUR
  return (
    <section className="precision-cust__toolbar is-mobile">
      {/* Hàng 1: Search Omnibar to rõ chống zoom iOS + Nút Thêm Mới + Nút Tác Vụ */}
      <div className="toolbar-mobile-row1">
        <div className="search-box">
          <FiSearch size={15} color="#94a3b8" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Tìm mã, tên, MST, SĐT..."
            value={searchKeyword}
            onChange={(e) => onChangeSearch(e.target.value)}
          />
          {searchKeyword && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => onChangeSearch("")}
              title="Xóa tìm kiếm"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        <button
          type="button"
          className="btn-action btn-action--primary btn-mobile-add"
          onClick={onAddNew}
          title="Thêm mới đối tác"
        >
          <FiPlus size={16} />
          <span>Thêm</span>
        </button>

        {onOpenActionDrawer && (
          <button
            type="button"
            className="btn-action btn-action--drawer"
            onClick={onOpenActionDrawer}
            title="Mở bảng tác vụ ERP"
          >
            <FiZap size={15} />
            <span>Tác Vụ</span>
            {selectedCode && <span className="dot-selected" />}
          </button>
        )}
      </div>

      {/* Hàng 2: Dải cuộn ngang Segment Filter & Quick Shortcuts */}
      <div className="toolbar-mobile-row2">
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
          <span>KH ({counts.kh})</span>
        </button>

        <button
          type="button"
          className={`segment-btn segment-btn--ncc ${currentFilter === "NCC" ? "active" : ""}`}
          onClick={() => onChangeFilter("NCC")}
        >
          <span className="dot dot--indigo" />
          <span>NCC ({counts.ncc})</span>
        </button>

        <button
          type="button"
          className={`segment-btn segment-btn--use ${currentFilter === "USE" ? "active" : ""}`}
          onClick={() => onChangeFilter("USE")}
        >
          <span className="dot dot--green" />
          <span>USE ({counts.use})</span>
        </button>

        <button
          type="button"
          className={`segment-btn segment-btn--off ${currentFilter === "NOT_USE" ? "active" : ""}`}
          onClick={() => onChangeFilter("NOT_USE")}
        >
          <span className="dot dot--red" />
          <span>OFF ({counts.off})</span>
        </button>

        <div className="divider-v" />

        <button
          type="button"
          className="segment-btn action-shortcut"
          onClick={onEditSelected}
          title="Sửa dòng đang chọn"
        >
          <FiEdit3 size={13} />
          <span>Sửa</span>
        </button>

        <button
          type="button"
          className="segment-btn action-shortcut"
          onClick={onRefresh}
          title="Tải lại dữ liệu"
        >
          <FiRefreshCw size={13} />
          <span>Load</span>
        </button>

        <button
          type="button"
          className="segment-btn action-shortcut"
          onClick={onExportEX1}
          title="Xuất Excel lọc"
        >
          <FiFileText size={13} />
          <span>EX1</span>
        </button>

        <button
          type="button"
          className="segment-btn action-shortcut"
          onClick={onExportEX2}
          title="Xuất Excel full"
        >
          <FiDownload size={13} />
          <span>EX2</span>
        </button>

        <button
          type="button"
          className="segment-btn action-shortcut"
          onClick={onOpenPivot}
          title="Phân tích Pivot"
        >
          <FiPieChart size={13} />
          <span>PIVOT</span>
        </button>
      </div>
    </section>
  );
};

export default React.memo(PrecisionCustToolbar);
