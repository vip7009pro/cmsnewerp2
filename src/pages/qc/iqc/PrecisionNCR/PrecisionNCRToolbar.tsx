import React from "react";
import {
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineExport,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCloseCircle,
  AiOutlineTable,
} from "react-icons/ai";

interface PrecisionNCRToolbarProps {
  onStartNewRegister: () => void;
  onSearch: () => void;
  onSetCompleted: () => void;
  onSetPending: () => void;
  onExportExcel: (type: 1 | 2) => void;
  quickFilterText: string;
  setQuickFilterText: (val: string) => void;
  rowCount: number;
}

export const PrecisionNCRToolbar: React.FC<PrecisionNCRToolbarProps> = ({
  onStartNewRegister,
  onSearch,
  onSetCompleted,
  onSetPending,
  onExportExcel,
  quickFilterText,
  setQuickFilterText,
  rowCount,
}) => {
  return (
    <div className="precision-ncr-toolbar">
      {/* Left Action Buttons */}
      <div className="precision-ncr-toolbar__left">
        <button
          className="btn-tb btn-new"
          onClick={onStartNewRegister}
          title="Đăng ký phiếu NCR mới"
        >
          <AiOutlinePlus />
          <span>NEW NCR</span>
        </button>

        <button
          className="btn-tb btn-search"
          onClick={onSearch}
          title="Tra cứu dữ liệu NCR"
        >
          <AiOutlineSearch />
          <span>Tra Data</span>
        </button>

        <button
          className="btn-tb btn-export"
          onClick={() => onExportExcel(2)}
          title="Xuất danh sách NCR ra Excel"
        >
          <AiOutlineExport />
          <span>Export NCR</span>
        </button>

        <button
          className="btn-tb btn-completed"
          onClick={onSetCompleted}
          title="Cập nhật trạng thái COMPLETED (Đã đóng)"
        >
          <AiOutlineCheckCircle />
          <span>SET COMPLETED</span>
        </button>

        <button
          className="btn-tb btn-pending"
          onClick={onSetPending}
          title="Cập nhật trạng thái PENDING (Đang xử lý)"
        >
          <AiOutlineClockCircle />
          <span>SET PENDING</span>
        </button>

        <div className="tb-divider" />

        {/* Excel & Pivot Buttons */}
        <button
          className="btn-tb btn-excel"
          onClick={() => onExportExcel(1)}
          title="Xuất dữ liệu đang lọc ra Excel"
        >
          EX1
        </button>
        <button
          className="btn-tb btn-excel"
          onClick={() => onExportExcel(2)}
          title="Xuất toàn bộ dữ liệu ra Excel"
        >
          EX2
        </button>
        <button
          className="btn-tb btn-pivot"
          onClick={() => onExportExcel(2)}
          title="Phân tích dữ liệu Pivot"
        >
          <AiOutlineTable />
          <span>PIVOT</span>
        </button>
      </div>

      {/* Right Search & Counter */}
      <div className="precision-ncr-toolbar__right">
        <div className="quick-search-box">
          <AiOutlineSearch className="icon-search" />
          <input
            type="text"
            placeholder="Lọc nhanh trên lưới..."
            value={quickFilterText}
            onChange={(e) => setQuickFilterText(e.target.value)}
          />
          {quickFilterText && (
            <AiOutlineCloseCircle
              className="icon-clear"
              onClick={() => setQuickFilterText("")}
            />
          )}
        </div>

        <span
          style={{
            fontSize: 10,
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: 700,
            color: "var(--pn-text-secondary)",
            background: "var(--pn-surface-dim)",
            padding: "2px 6px",
            borderRadius: 4,
            border: "1px solid var(--pn-border)",
            whiteSpace: "nowrap",
          }}
        >
          {rowCount} records
        </span>
      </div>
    </div>
  );
};
