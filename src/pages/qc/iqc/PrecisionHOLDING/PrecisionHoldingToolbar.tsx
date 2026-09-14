import React from "react";
import {
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiEdit,
  FiFileText,
} from "react-icons/fi";

interface PrecisionHoldingToolbarProps {
  onSearch: () => void;
  onSetPass: (val: "Y" | "N") => void;
  onUpdateNCR: () => void;
  onUpdateReason: () => void;
  quickFilterText: string;
  setQuickFilterText: (v: string) => void;
  onExportExcel: (type: "EX1" | "EX2") => void;
}

export const PrecisionHoldingToolbar: React.FC<PrecisionHoldingToolbarProps> = ({
  onSearch,
  onSetPass,
  onUpdateNCR,
  onUpdateReason,
  quickFilterText,
  setQuickFilterText,
  onExportExcel,
}) => {
  return (
    <div className="precision-holding-toolbar">
      {/* Left Action Buttons */}
      <div className="precision-holding-toolbar__left">
        <button
          type="button"
          className="btn-toolbar btn-toolbar--search"
          onClick={onSearch}
          title="Tra cứu dữ liệu Holding"
        >
          <FiSearch size={12} color="#2563eb" />
          <span>Tra Data</span>
        </button>

        <button
          type="button"
          className="btn-toolbar btn-toolbar--pass"
          onClick={() => onSetPass("Y")}
          title="Xác nhận PASS cho các LOT đã chọn"
        >
          <FiCheckCircle size={12} />
          <span>SET PASS</span>
        </button>

        <button
          type="button"
          className="btn-toolbar btn-toolbar--fail"
          onClick={() => onSetPass("N")}
          title="Xác nhận FAIL cho các LOT đã chọn"
        >
          <FiXCircle size={12} />
          <span>SET FAIL</span>
        </button>

        <button
          type="button"
          className="btn-toolbar btn-toolbar--ncr"
          onClick={onUpdateNCR}
          title="Cập nhật mã NCR ID cho LOT"
        >
          <FiRefreshCw size={12} />
          <span>UPDATE NCR ID</span>
        </button>

        <button
          type="button"
          className="btn-toolbar btn-toolbar--reason"
          onClick={onUpdateReason}
          title="Cập nhật lý do Holding"
        >
          <FiEdit size={12} />
          <span>UPDATE REASON</span>
        </button>
      </div>

      {/* Right Tools: Quick Filter & Excel Export */}
      <div className="precision-holding-toolbar__right">
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
