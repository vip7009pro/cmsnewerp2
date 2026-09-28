import React, { useCallback } from "react";
import {
  AiOutlineSearch,
  AiOutlineCloseCircle,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineExport,
  AiOutlineTable,
} from "react-icons/ai";

interface PrecisionNCRMobileToolbarProps {
  quickFilterText: string;
  setQuickFilterText: (val: string) => void;
  onSearch: () => void;
  onSetCompleted: () => void;
  onSetPending: () => void;
  onExportExcel: (type: 1 | 2) => void;
  rowCount: number;
  pendingOnly: boolean;
  setPendingOnly: (val: boolean) => void;
}

export const PrecisionNCRMobileToolbar: React.FC<PrecisionNCRMobileToolbarProps> = ({
  quickFilterText,
  setQuickFilterText,
  onSearch,
  onSetCompleted,
  onSetPending,
  onExportExcel,
  rowCount,
  pendingOnly,
  setPendingOnly,
}) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSearch();
      }
    },
    [onSearch]
  );

  return (
    <div className="precision-ncr-mobile-toolbar">
      {/* Row 1: Search + Tra Data */}
      <div className="toolbar-main-row">
        <div className="search-input-box">
          <AiOutlineSearch className="icon-search" />
          <input
            type="text"
            placeholder="Lọc nhanh NCR..."
            value={quickFilterText}
            onChange={(e) => setQuickFilterText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {quickFilterText && (
            <AiOutlineCloseCircle
              className="icon-clear"
              onClick={() => setQuickFilterText("")}
            />
          )}
        </div>
        <button className="btn-search" onClick={onSearch}>
          <AiOutlineSearch size={14} />
          <span>Tra</span>
        </button>
      </div>

      {/* Row 2: Action chips scrollable */}
      <div className="toolbar-action-scroll">
        <button
          className={`chip-btn ${pendingOnly ? "chip-active" : ""}`}
          onClick={() => setPendingOnly(!pendingOnly)}
        >
          <AiOutlineClockCircle size={12} />
          <span>Pending</span>
        </button>

        <button className="chip-btn chip-success" onClick={onSetCompleted}>
          <AiOutlineCheckCircle size={12} />
          <span>COMPLETED</span>
        </button>

        <button className="chip-btn chip-warning" onClick={onSetPending}>
          <AiOutlineClockCircle size={12} />
          <span>PENDING</span>
        </button>

        <button className="chip-btn chip-indigo" onClick={() => onExportExcel(2)}>
          <AiOutlineExport size={12} />
          <span>Export</span>
        </button>

        <button className="chip-btn chip-excel" onClick={() => onExportExcel(1)}>
          EX1
        </button>
        <button className="chip-btn chip-excel" onClick={() => onExportExcel(2)}>
          EX2
        </button>
        <button className="chip-btn chip-pivot" onClick={() => onExportExcel(2)}>
          <AiOutlineTable size={12} />
          <span>PIVOT</span>
        </button>

        <span className="row-counter">{rowCount}</span>
      </div>
    </div>
  );
};
