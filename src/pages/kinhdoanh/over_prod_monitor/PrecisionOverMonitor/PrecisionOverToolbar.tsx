import React from "react";
import { FiRefreshCw, FiCheckSquare, FiXCircle, FiSearch, FiDownload, FiGrid } from "react-icons/fi";

interface PrecisionOverToolbarProps {
  onlyPending: boolean;
  onToggleOnlyPending: (checked: boolean) => void;
  onReload: () => void;
  onNhapHangLoat: () => void;
  onHuyHangLoat: () => void;
  searchText: string;
  onSearchChange: (val: string) => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  selectedCount: number;
}

const PrecisionOverToolbar: React.FC<PrecisionOverToolbarProps> = ({
  onlyPending,
  onToggleOnlyPending,
  onReload,
  onNhapHangLoat,
  onHuyHangLoat,
  searchText,
  onSearchChange,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  selectedCount,
}) => {
  return (
    <div className="precision-over-toolbar">
      <div className="precision-over-toolbar__left">
        <div className="precision-over-toolbar__badge-title">
          <span className="pulse-indicator"></span>
          <span>PRODUCTION OVER MONITOR</span>
        </div>

        <label className="precision-over-toolbar__checkbox-wrap">
          <input
            type="checkbox"
            checked={onlyPending}
            onChange={(e) => onToggleOnlyPending(e.target.checked)}
          />
          <span>Only Pending</span>
        </label>

        {selectedCount > 0 && (
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#2563eb", background: "#eff6ff", padding: "2px 6px", borderRadius: "4px", border: "1px solid #bfdbfe" }}>
            Đã chọn: {selectedCount}
          </span>
        )}
      </div>

      <div className="precision-over-toolbar__right">
        {/* Quick Search */}
        <div className="precision-over-toolbar__search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Lọc nhanh..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Reload */}
        <button
          type="button"
          className="precision-over-toolbar__btn precision-over-toolbar__btn--reload"
          onClick={onReload}
          title="Tải lại bảng dữ liệu"
        >
          <FiRefreshCw size={12} />
          <span>Reload</span>
        </button>

        {/* Nhập hàng loạt */}
        <button
          type="button"
          className="precision-over-toolbar__btn precision-over-toolbar__btn--nhap"
          onClick={onNhapHangLoat}
          title="Xác nhận NHẬP cho các dòng đã chọn"
        >
          <FiCheckSquare size={12} />
          <span>Nhập hàng loạt</span>
        </button>

        {/* Hủy hàng loạt */}
        <button
          type="button"
          className="precision-over-toolbar__btn precision-over-toolbar__btn--huy"
          onClick={onHuyHangLoat}
          title="Xác nhận HỦY cho các dòng đã chọn"
        >
          <FiXCircle size={12} />
          <span>Hủy hàng loạt</span>
        </button>

        {/* Export EX1 */}
        <button
          type="button"
          className="precision-over-toolbar__btn precision-over-toolbar__btn--export"
          onClick={onExportEX1}
          title="Xuất Excel danh sách đang hiển thị"
        >
          <FiDownload size={11} />
          <span>EX1</span>
        </button>

        {/* Export EX2 */}
        <button
          type="button"
          className="precision-over-toolbar__btn precision-over-toolbar__btn--export"
          onClick={onExportEX2}
          title="Xuất Excel toàn bộ dữ liệu"
        >
          <FiDownload size={11} />
          <span>EX2</span>
        </button>

        {/* Pivot */}
        <button
          type="button"
          className="precision-over-toolbar__btn precision-over-toolbar__btn--pivot"
          onClick={onOpenPivot}
          title="Mở bảng phân tích đa chiều Pivot"
        >
          <FiGrid size={12} />
          <span>PIVOT</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionOverToolbar);
