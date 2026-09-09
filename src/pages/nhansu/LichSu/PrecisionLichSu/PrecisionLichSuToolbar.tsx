import React from "react";

interface PrecisionLichSuToolbarProps {
  fromDate: string;
  toDate: string;
  isDefaultMonth: boolean;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onDefaultMonthChange: (checked: boolean) => void;
  onSearch: () => void;
  onExportEx1: () => void;
  onExportEx2: () => void;
  onOpenPivot: () => void;
}

export const PrecisionLichSuToolbar: React.FC<PrecisionLichSuToolbarProps> = ({
  fromDate,
  toDate,
  isDefaultMonth,
  onFromDateChange,
  onToDateChange,
  onDefaultMonthChange,
  onSearch,
  onExportEx1,
  onExportEx2,
  onOpenPivot,
}) => {
  return (
    <div className="precision-lichsu__toolbar">
      {/* Left: Date Picker and Default Checkbox */}
      <div className="precision-lichsu__toolbarLeft">
        <div className="precision-lichsu__filterItem">
          <label htmlFor="filter-from-date">From Date:</label>
          <input
            id="filter-from-date"
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
          />
        </div>

        <div className="precision-lichsu__filterItem">
          <label htmlFor="filter-to-date">To Date:</label>
          <input
            id="filter-to-date"
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
          />
        </div>

        <label className="precision-lichsu__checkboxLabel">
          <input
            type="checkbox"
            checked={isDefaultMonth}
            onChange={(e) => onDefaultMonthChange(e.target.checked)}
          />
          <span>Default</span>
        </label>

        <button
          type="button"
          className="precision-lichsu__btn precision-lichsu__btn--primary"
          onClick={onSearch}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            search
          </span>
          <span>Search</span>
        </button>
      </div>

      {/* Right: Load Data & Export Actions */}
      <div className="precision-lichsu__toolbarRight">
        <button
          type="button"
          className="precision-lichsu__btn precision-lichsu__btn--success"
          onClick={onSearch}
          title="Tải lại dữ liệu chấm công"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            sync
          </span>
          <span>Load Data</span>
        </button>

        <button
          type="button"
          className="precision-lichsu__btn precision-lichsu__btn--excel"
          onClick={onExportEx1}
          title="Xuất bảng tính danh sách đang lọc"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            download
          </span>
          <span>EX1</span>
        </button>

        <button
          type="button"
          className="precision-lichsu__btn precision-lichsu__btn--excel"
          onClick={onExportEx2}
          title="Xuất toàn bộ dữ liệu ra Excel"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            file_download
          </span>
          <span>EX2</span>
        </button>

        <button
          type="button"
          className="precision-lichsu__btn precision-lichsu__btn--pivot"
          onClick={onOpenPivot}
          title="Phân tích tổng hợp đa chiều"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            pivot_table_chart
          </span>
          <span>PIVOT</span>
        </button>
      </div>
    </div>
  );
};

export default PrecisionLichSuToolbar;
