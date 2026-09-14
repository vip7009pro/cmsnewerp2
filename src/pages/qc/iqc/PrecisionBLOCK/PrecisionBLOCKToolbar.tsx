import React from "react";
import { FiSearch, FiCheckCircle, FiXCircle, FiRefreshCw, FiLock, FiClock, FiFileText } from "react-icons/fi";

interface PrecisionBLOCKToolbarProps {
  onSearch: () => void;
  onSetPass: (val: string) => void;
  onSetClose: (val: string) => void;
  onUpdateNCR: () => void;
  quickFilterText: string;
  setQuickFilterText: (v: string) => void;
  onExportExcel: (type: "EX1" | "EX2") => void;
}

export const PrecisionBLOCKToolbar: React.FC<PrecisionBLOCKToolbarProps> = ({
  onSearch,
  onSetPass,
  onSetClose,
  onUpdateNCR,
  quickFilterText,
  setQuickFilterText,
  onExportExcel,
}) => {
  return (
    <div className="precision-block-toolbar">
      {/* Left Action Buttons */}
      <div className="precision-block-toolbar__left">
        <button
          type="button"
          className="btn-toolbar btn-toolbar--search"
          onClick={onSearch}
        >
          <FiSearch size={11} color="#2563eb" />
          <span>Tra Data</span>
        </button>

        <button
          type="button"
          className="btn-toolbar btn-toolbar--pass"
          onClick={() => onSetPass("Y")}
        >
          <FiCheckCircle size={11} />
          <span>SET PASS</span>
        </button>

        <button
          type="button"
          className="btn-toolbar btn-toolbar--fail"
          onClick={() => onSetPass("N")}
        >
          <FiXCircle size={11} />
          <span>SET FAIL</span>
        </button>

        <button
          type="button"
          className="btn-toolbar btn-toolbar--ncr"
          onClick={onUpdateNCR}
        >
          <FiRefreshCw size={11} />
          <span>UPDATE NCR_ID</span>
        </button>

        <button
          type="button"
          className="btn-toolbar btn-toolbar--closed"
          onClick={() => onSetClose("C")}
        >
          <FiLock size={11} />
          <span>SET CLOSED</span>
        </button>

        <button
          type="button"
          className="btn-toolbar btn-toolbar--pending"
          onClick={() => onSetClose("P")}
        >
          <FiClock size={11} />
          <span>SET PENDING</span>
        </button>
      </div>

      {/* Right Tools: Quick Search & Export Excel */}
      <div className="precision-block-toolbar__right">
        <div className="quick-search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Lọc nhanh trên lưới..."
            value={quickFilterText}
            onChange={(e) => setQuickFilterText(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="btn-excel"
          onClick={() => onExportExcel("EX1")}
          title="Xuất dữ liệu dòng đã chọn hoặc lọc"
        >
          <FiFileText size={11} />
          <span>EX1</span>
        </button>

        <button
          type="button"
          className="btn-excel"
          onClick={() => onExportExcel("EX2")}
          title="Xuất toàn bộ bảng dữ liệu"
        >
          <FiFileText size={11} />
          <span>EX2</span>
        </button>
      </div>
    </div>
  );
};
