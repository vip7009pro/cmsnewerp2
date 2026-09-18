import React from "react";
import { FiSearch, FiCalendar } from "react-icons/fi";

interface PrecisionKhoTPToolbarProps {
  fromDate: string;
  toDate: string;
  df: boolean;
  moc1: number;
  moc2: number;
  onFromDateChange: (v: string) => void;
  onToDateChange: (v: string) => void;
  onDfChange: (v: boolean) => void;
  onMoc1Change: (v: number) => void;
  onMoc2Change: (v: number) => void;
  onSearch: () => void;
}

const PrecisionKhoTPToolbar: React.FC<PrecisionKhoTPToolbarProps> = ({
  fromDate, toDate, df, moc1, moc2,
  onFromDateChange, onToDateChange, onDfChange,
  onMoc1Change, onMoc2Change, onSearch,
}) => {
  return (
    <div className="precision-khotp__toolbar">
      <div className="precision-khotp__toolbar-controls">
        {/* From Date */}
        <div className="precision-khotp__toolbar-date-picker">
          <FiCalendar size={12} color="#64748b" />
          <label>Từ ngày:</label>
          <input
            type="date"
            value={fromDate.slice(0, 10)}
            onChange={(e) => onFromDateChange(e.target.value)}
          />
        </div>

        {/* To Date */}
        <div className="precision-khotp__toolbar-date-picker">
          <FiCalendar size={12} color="#64748b" />
          <label>Đến ngày:</label>
          <input
            type="date"
            value={toDate.slice(0, 10)}
            onChange={(e) => onToDateChange(e.target.value)}
          />
        </div>

        {/* Mốc 1 */}
        <div className="precision-khotp__toolbar-moc-picker">
          <label>Mốc 1 (tháng):</label>
          <input
            type="number"
            value={moc1}
            min={1}
            max={24}
            onChange={(e) => onMoc1Change(Number(e.target.value))}
          />
        </div>

        {/* Mốc 2 */}
        <div className="precision-khotp__toolbar-moc-picker">
          <label>Mốc 2 (tháng):</label>
          <input
            type="number"
            value={moc2}
            min={1}
            max={36}
            onChange={(e) => onMoc2Change(Number(e.target.value))}
          />
        </div>

        {/* Default checkbox */}
        <label className="precision-khotp__toolbar-checkbox">
          <input
            type="checkbox"
            checked={df}
            onChange={(e) => onDfChange(e.target.checked)}
          />
          <span>Mặc định</span>
        </label>

        {/* Search Button */}
        <button
          type="button"
          className="precision-khotp__toolbar-btn-search"
          onClick={onSearch}
        >
          <FiSearch size={12} />
          <span>Tra Cứu</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKhoTPToolbar);
