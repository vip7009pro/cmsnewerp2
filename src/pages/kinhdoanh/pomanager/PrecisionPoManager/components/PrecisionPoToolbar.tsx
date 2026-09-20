import React from "react";
import {
  MdMenuOpen,
  MdMenu,
  MdSearch,
  MdAdd,
  MdEdit,
  MdDeleteOutline,
  MdReceiptLong,
  MdVerified,
  MdPivotTableChart,
  MdFileDownload,
} from "react-icons/md";

interface PrecisionPoToolbarProps {
  filterCollapsed: boolean;
  onToggleFilter: () => void;
  quickSearchText: string;
  onQuickSearchChange: (text: string) => void;
  totalDisplayCount: number;
  onOpenAddModal: () => void;
  onEditSelected: () => void;
  onDeleteSelected: () => void;
  onOpenInvoiceModal: () => void;
  onApprovePO: () => void;
  onTogglePivot: () => void;
  onExportExcel: () => void;
  /** Mobile: các nút phụ thu gọn icon-only để toolbar không chiếm nhiều dòng */
  isMobile?: boolean;
}

const PrecisionPoToolbar: React.FC<PrecisionPoToolbarProps> = ({
  filterCollapsed,
  onToggleFilter,
  quickSearchText,
  onQuickSearchChange,
  totalDisplayCount,
  onOpenAddModal,
  onEditSelected,
  onDeleteSelected,
  onOpenInvoiceModal,
  onApprovePO,
  onTogglePivot,
  onExportExcel,
  isMobile = false,
}) => {
  // Desktop: icon + label. Mobile: chỉ icon (title đã có tooltip) để toolbar gọn 2 hàng.
  const actionClass = (variant = "") =>
    `btn-grid-action ${variant} ${isMobile ? "is-icon-only" : ""}`.trim();

  return (
    <div className="po-grid-toolbar">
      {/* Left controls */}
      <div className="toolbar-left">
        <button
          type="button"
          className="btn-toggle-left"
          onClick={onToggleFilter}
          title={filterCollapsed ? "Mở bộ lọc" : "Ẩn bộ lọc"}
        >
          {filterCollapsed ? <MdMenu size={16} /> : <MdMenuOpen size={16} />}
          <span>{isMobile ? "Bộ lọc" : filterCollapsed ? "Hiện bộ lọc" : "Ẩn bộ lọc"}</span>
        </button>

        <div className="table-quick-search">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder={isMobile ? "Lọc nhanh..." : "Lọc nhanh tại bảng..."}
            value={quickSearchText}
            onChange={(e) => onQuickSearchChange(e.target.value)}
          />
        </div>

        <span className="toolbar-divider">|</span>

        <span className="count-label">
          Hiển thị: <strong className="font-mono-num">{totalDisplayCount.toLocaleString("en-US")}</strong> đơn hàng
        </span>
      </div>

      {/* Right Action buttons */}
      <div className="toolbar-right">
        {/* PRIMARY ACTION: THÊM PO MỚI (HỢP NHẤT SINGLE VÀ BULK EXCEL) */}
        <button
          type="button"
          className="btn-grid-action btn-action-primary"
          onClick={onOpenAddModal}
          title="Tạo đơn hàng mới hoặc import Excel hàng loạt"
        >
          <MdAdd size={16} />
          <span>Thêm PO Mới</span>
        </button>

        {/* SECONDARY ACTIONS */}
        <button
          type="button"
          className={actionClass("btn-action-edit")}
          onClick={onEditSelected}
          title="Chỉnh sửa PO đang chọn"
        >
          <MdEdit size={15} color="#004ac6" />
          {!isMobile && <span>Sửa</span>}
        </button>

        <button
          type="button"
          className={actionClass("btn-action-invoice")}
          onClick={onOpenInvoiceModal}
          title="Tạo Invoice giao hàng cho PO đã chọn"
        >
          <MdReceiptLong size={15} color="#10b981" />
          {!isMobile && <span>Tạo Invoice</span>}
        </button>

        <button
          type="button"
          className={actionClass("btn-action-danger")}
          onClick={onDeleteSelected}
          title="Xóa các PO đã chọn"
        >
          <MdDeleteOutline size={15} color="#f43f5e" />
          {!isMobile && <span>Xóa</span>}
        </button>

        <button
          type="button"
          className={actionClass("btn-action-success")}
          onClick={onApprovePO}
          title="Phê duyệt giá và đồng bộ PO"
        >
          <MdVerified size={15} color="#10b981" />
          {!isMobile && <span>Phê duyệt</span>}
        </button>

        {!isMobile && <span className="toolbar-divider">|</span>}

        {/* UTILITY ACTIONS */}
        <button
          type="button"
          className={actionClass("btn-action-pivot")}
          onClick={onTogglePivot}
          title="Mở bảng phân tích xoay đa chiều Pivot"
        >
          <MdPivotTableChart size={15} color="#8b5cf6" />
          {!isMobile && <span>Pivot</span>}
        </button>

        <button
          type="button"
          className={actionClass("btn-action-excel")}
          onClick={onExportExcel}
          title="Xuất file Excel danh sách PO"
        >
          <MdFileDownload size={15} color="#059669" />
          {!isMobile && <span>Xuất Excel</span>}
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPoToolbar);
