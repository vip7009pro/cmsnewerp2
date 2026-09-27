// PrecisionIncomingMobileToolbar.tsx - Mobile ergonomic toolbar: search row + horizontal action chips
import React from "react";
import {
  FiSearch,
  FiX,
  FiFilter,
  FiDownload,
  FiPlus,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiFileText,
  FiPrinter,
  FiActivity,
} from "react-icons/fi";

interface PrecisionIncomingMobileToolbarProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  onSearch: () => void;
  onOpenFilterSheet: () => void;
  activeFilterCount: number;
  onlyPending: boolean;
  onToggleOnlyPending: () => void;
  onOpenInputSheet: () => void;
  onSetPass: () => void;
  onSetFail: () => void;
  onUpdateSelected: () => void;
  onToggleBNK: () => void;
  onOpenDtcSheet: () => void;
  dtcCount: number;
  onExportExcel: (type: "EX1" | "EX2") => void;
  selectedCount: number;
  filteredCount: number;
  totalCount: number;
}

export const PrecisionIncomingMobileToolbar: React.FC<PrecisionIncomingMobileToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  onOpenFilterSheet,
  activeFilterCount,
  onlyPending,
  onToggleOnlyPending,
  onOpenInputSheet,
  onSetPass,
  onSetFail,
  onUpdateSelected,
  onToggleBNK,
  onOpenDtcSheet,
  dtcCount,
  onExportExcel,
  selectedCount,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="precision-incoming-mobile-toolbar">
      {/* Hàng 1: Ô search nhanh (14px chống auto-zoom) + Tra Data + Bộ lọc */}
      <div className="toolbar-search-row">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" size={14} />
          <input
            type="text"
            className="search-input"
            placeholder="Lọc nhanh Mã/Tên/Lot/Vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
          />
          {searchTerm && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => setSearchTerm("")}
              title="Xóa tìm kiếm"
            >
              <FiX size={12} />
            </button>
          )}
        </div>

        <button type="button" className="btn-search-trigger" onClick={onSearch} title="Tra cứu lại dữ liệu Incoming">
          <FiRefreshCw size={13} />
          <span>Tra</span>
        </button>

        <button
          type="button"
          className={`btn-filter-trigger ${activeFilterCount > 0 ? "has-filters" : ""}`}
          onClick={onOpenFilterSheet}
          title="Mở bộ lọc & phiếu đăng ký"
        >
          <FiFilter size={13} />
          <span>Lọc</span>
          {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
        </button>
      </div>

      {/* Hàng 2: Dải chips thao tác cuộn ngang */}
      <div className="toolbar-chips-scroll">
        <button
          type="button"
          className={`chip-btn ${onlyPending ? "chip-btn--active-pending" : ""}`}
          onClick={onToggleOnlyPending}
          title="Chỉ hiển thị các lô chưa có kết quả"
        >
          <span>Chờ KQ: {onlyPending ? "BẬT" : "TẤT CẢ"}</span>
        </button>

        <button
          type="button"
          className="chip-btn chip-btn--in"
          onClick={onOpenInputSheet}
          title="Mở phiếu đăng ký kiểm tra lô mới"
        >
          <FiPlus size={11} />
          <span>Nhập</span>
        </button>

        <button type="button" className="chip-btn chip-btn--pass" onClick={onSetPass} title="Phê duyệt ĐẠT cho dòng đã chọn">
          <FiCheckCircle size={11} />
          <span>SET PASS</span>
        </button>

        <button type="button" className="chip-btn chip-btn--fail" onClick={onSetFail} title="Đánh dấu KHÔNG ĐẠT cho dòng đã chọn">
          <FiXCircle size={11} />
          <span>SET FAIL</span>
        </button>

        <button
          type="button"
          className="chip-btn chip-btn--update"
          onClick={onUpdateSelected}
          title="Cập nhật kết quả các dòng đã chọn"
        >
          <FiRefreshCw size={11} />
          <span>Update</span>
        </button>

        <button
          type="button"
          className="chip-btn chip-btn--dtc"
          onClick={onOpenDtcSheet}
          title="Xem kết quả ĐTC & cập nhật NCR_ID của lô đang chọn"
        >
          <FiActivity size={11} />
          <span>ĐTC{dtcCount > 0 ? ` (${dtcCount})` : ""}</span>
        </button>

        <button type="button" className="chip-btn chip-btn--bnk" onClick={onToggleBNK} title="Xem / In biên bản kiểm tra A4 (Show BNK)">
          <FiPrinter size={11} />
          <span>BNK</span>
        </button>

        <button type="button" className="chip-btn chip-btn--excel" onClick={() => onExportExcel("EX1")} title="Xuất Excel các dòng đang lọc">
          <FiFileText size={11} />
          <span>EX1</span>
        </button>

        <button type="button" className="chip-btn chip-btn--excel" onClick={() => onExportExcel("EX2")} title="Xuất Excel toàn bộ dữ liệu">
          <FiDownload size={11} />
          <span>EX2</span>
        </button>

        <div className="chip-counter">
          {selectedCount > 0 ? (
            <span className="selected-text">{selectedCount} đã chọn</span>
          ) : (
            <span>
              {filteredCount}/{totalCount} dòng
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrecisionIncomingMobileToolbar;
