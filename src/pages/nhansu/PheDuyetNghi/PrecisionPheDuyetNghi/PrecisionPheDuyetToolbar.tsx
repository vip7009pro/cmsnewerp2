import React from "react";

interface PrecisionPheDuyetToolbarProps {
  fromDate: string;
  toDate: string;
  onlyPending: boolean;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  onOnlyPendingChange: (val: boolean) => void;
  onSearch: () => void;
  onExportEX1?: () => void;
  onExportEX2?: () => void;
  onOpenPivot?: () => void;
}

export const PrecisionPheDuyetToolbar: React.FC<PrecisionPheDuyetToolbarProps> = ({
  fromDate,
  toDate,
  onlyPending,
  onFromDateChange,
  onToDateChange,
  onOnlyPendingChange,
  onSearch,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
}) => {
  return (
    <div className="precision-pheduyet__toolbar">
      <div className="toolbar-left">
        <div className="date-field">
          <label>Từ ngày:</label>
          <input
            type="date"
            value={fromDate.slice(0, 10)}
            onChange={(e) => onFromDateChange(e.target.value)}
          />
        </div>

        <div className="date-field">
          <label>Đến ngày:</label>
          <input
            type="date"
            value={toDate.slice(0, 10)}
            onChange={(e) => onToDateChange(e.target.value)}
          />
        </div>

        <label className="pending-checkbox-pill" title="Chỉ lọc các đơn đang chờ phê duyệt">
          <input
            type="checkbox"
            checked={onlyPending}
            onChange={(e) => onOnlyPendingChange(e.target.checked)}
          />
          <span>Chờ duyệt (Pending)</span>
        </label>

        <button
          type="button"
          className="btn-search"
          onClick={onSearch}
          title="Tải lại dữ liệu theo bộ lọc"
        >
          <span className="material-symbols-outlined">search</span>
          <span>Tìm kiếm</span>
        </button>
      </div>

      <div className="toolbar-right">
        {onExportEX1 && (
          <button
            type="button"
            className="grid-btn grid-btn--excel"
            onClick={onExportEX1}
            title="Xuất các dòng đang lọc ra file Excel"
          >
            <span className="material-symbols-outlined">description</span>
            <span>EX1</span>
            <span className="badge">Đang lọc</span>
          </button>
        )}

        {onExportEX2 && (
          <button
            type="button"
            className="grid-btn grid-btn--excel"
            onClick={onExportEX2}
            title="Xuất toàn bộ đơn trong kỳ ra file Excel"
          >
            <span className="material-symbols-outlined">file_download</span>
            <span>EX2</span>
            <span className="badge">Tất cả</span>
          </button>
        )}

        {onOpenPivot && (
          <button
            type="button"
            className="grid-btn grid-btn--pivot"
            onClick={onOpenPivot}
            title="Mở bảng phân tích Pivot đa chiều"
          >
            <span className="material-symbols-outlined">pivot_table_chart</span>
            <span>PIVOT</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(PrecisionPheDuyetToolbar);
