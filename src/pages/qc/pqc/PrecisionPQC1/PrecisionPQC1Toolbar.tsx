import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiShow, BiHide } from "react-icons/bi";
import { FiDownload, FiCheckSquare } from "react-icons/fi";

interface PrecisionPQC1ToolbarProps {
  showhideinput: boolean;
  onToggleShowHideInput: () => void;
  onTraData: () => void;
  onUpdateSampleQty: () => void;
  quickFilter: string;
  onQuickFilterChange: (val: string) => void;
  onExportExcel: (filtered: boolean) => void;
  totalCount: number;
}

export const PrecisionPQC1Toolbar: React.FC<PrecisionPQC1ToolbarProps> = ({
  showhideinput,
  onToggleShowHideInput,
  onTraData,
  onUpdateSampleQty,
  quickFilter,
  onQuickFilterChange,
  onExportExcel,
  totalCount,
}) => {
  return (
    <div className="precision-pqc1-toolbar">
      <div className="precision-pqc1-toolbar__left">
        <button
          type="button"
          className="btn-action primary"
          onClick={onTraData}
          title="Tra cứu dữ liệu cài đặt công đoạn PQC1"
        >
          <AiOutlineSearch size={14} /> Tra Data
        </button>

        <button
          type="button"
          className="btn-action"
          onClick={onToggleShowHideInput}
          title="Ẩn hoặc hiện khung thông tin chỉ thị sản xuất"
        >
          {showhideinput ? <BiHide size={14} /> : <BiShow size={14} />}
          {showhideinput ? "Ẩn Chỉ Thị" : "Hiện Chỉ Thị"}
        </button>

        <div className="toolbar-divider" />

        <button
          type="button"
          className="btn-action"
          onClick={onUpdateSampleQty}
          title="Cập nhật lại số lượng mẫu kiểm tra"
        >
          <FiCheckSquare size={13} /> Update QTY
        </button>
      </div>

      <div className="precision-pqc1-toolbar__right">
        <div className="search-box">
          <input
            type="text"
            placeholder="Lọc nhanh trên lưới..."
            value={quickFilter}
            onChange={(e) => onQuickFilterChange(e.target.value)}
          />
          <span className="search-icon">
            <AiOutlineSearch />
          </span>
        </div>

        <button
          type="button"
          className="btn-export"
          onClick={() => onExportExcel(true)}
          title="Xuất các dòng đang chọn / đã lọc"
        >
          <FiDownload size={12} /> EX1 (Lọc)
        </button>

        <button
          type="button"
          className="btn-export"
          onClick={() => onExportExcel(false)}
          title="Xuất toàn bộ bảng dữ liệu ra file Excel"
        >
          <FiDownload size={12} /> EX2 (Toàn bộ)
        </button>

        <span className="count-chip">{totalCount} dòng</span>
      </div>
    </div>
  );
};
