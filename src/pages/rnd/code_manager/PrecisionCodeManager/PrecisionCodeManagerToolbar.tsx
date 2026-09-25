// PrecisionCodeManagerToolbar.tsx - Specialized ERP Action Toolbar for Product Master (Google Stitch)

import React from "react";
import {
  MdSearch,
  MdSave,
  MdCheckCircle,
  MdBlock,
  MdRestartAlt,
  MdEditDocument,
  MdTune,
  MdBolt,
  MdTrendingDown,
  MdPriceChange,
  MdQueryStats,
  MdFileDownload,
  MdTableChart,
  MdAnalytics,
} from "react-icons/md";
import { FiX } from "react-icons/fi";

interface PrecisionCodeManagerToolbarProps {
  isMobile?: boolean;
  codeCMS: string;
  setCodeCMS: (val: string) => void;
  activeOnly: boolean;
  setActiveOnly: (val: boolean) => void;
  cndb: boolean;
  setCNDB: (val: boolean) => void;
  selectedProdType: string;
  onProdTypeChange: (val: string) => void;
  prodTypeList: string[];
  enableEdit: boolean;
  onToggleEnableEdit: () => void;
  onSearchCode: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  onSaveExcel: () => void;
  onSetNgoaiQuan: (isNoInspection: "N" | "Y") => void;
  onResetBanVe: () => void;
  onPdBanVe: () => void;
  onSaveQLSX: () => void;
  onSaveLossSX: () => void;
  onUpdateBEP: () => void;
  onUpdateLossKT: () => void;
  selectedCount: number;
  filteredCount: number;
  totalCount: number;
}

const PrecisionCodeManagerToolbar: React.FC<PrecisionCodeManagerToolbarProps> = ({
  isMobile,
  codeCMS,
  setCodeCMS,
  activeOnly,
  setActiveOnly,
  cndb,
  setCNDB,
  selectedProdType,
  onProdTypeChange,
  prodTypeList,
  enableEdit,
  onToggleEnableEdit,
  onSearchCode,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  onSaveExcel,
  onSetNgoaiQuan,
  onResetBanVe,
  onPdBanVe,
  onSaveQLSX,
  onSaveLossSX,
  onUpdateBEP,
  onUpdateLossKT,
  selectedCount,
  filteredCount,
  totalCount,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchCode();
    }
  };

  return (
    <div className={`precision-code-manager__toolbar ${isMobile ? "is-mobile" : ""}`}>
      {/* ROW 1: SEARCH, FILTER & COMMON EXPORT */}
      <div className="toolbar-row1">
        <div className="search-group">
          {/* Search Box */}
          <div className="search-input-box">
            <span className="input-prefix">Code:</span>
            <input
              type="text"
              placeholder={isMobile ? "Nhập code..." : "Nhập code (VD: 7A01..., GH68...)"}
              value={codeCMS}
              onChange={(e) => setCodeCMS(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {codeCMS && (
              <button
                type="button"
                className="search-icon-btn"
                onClick={() => setCodeCMS("")}
                title="Xóa nội dung tìm kiếm"
              >
                <FiX size={13} />
              </button>
            )}
          </div>

          {/* Button Search */}
          <button type="button" className="btn-search" onClick={onSearchCode} title="Tìm kiếm theo mã sản phẩm">
            <MdSearch size={15} />
            <span>Tìm Code</span>
          </button>

          {/* Checkbox Active */}
          <label className={`checkbox-pill ${activeOnly ? "checkbox-pill--active" : ""}`}>
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => setActiveOnly(e.target.checked)}
            />
            <span>Active</span>
          </label>

          {/* Checkbox CNDB */}
          <label className={`checkbox-pill ${cndb ? "checkbox-pill--cndb" : ""}`}>
            <input
              type="checkbox"
              checked={cndb}
              onChange={(e) => setCNDB(e.target.checked)}
            />
            <span>CNDB</span>
          </label>

          {/* Filter Phân Loại Dropdown (Ẩn trên mobile để tiết kiệm diện tích) */}
          {!isMobile && (
            <div className="filter-select-box">
              <span>Loại:</span>
              <select
                value={selectedProdType}
                onChange={(e) => onProdTypeChange(e.target.value)}
              >
                <option value="ALL">Tất cả ({prodTypeList.length})</option>
                {prodTypeList.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Cụm Export Buttons */}
        <div className="export-group">
          <button
            type="button"
            className="toolbar-btn toolbar-btn--ex1"
            onClick={onExportEX1}
            title="Xuất bảng dữ liệu đang hiển thị ra Excel"
          >
            <MdTableChart size={14} />
            <span>EX1</span>
          </button>

          <button
            type="button"
            className="toolbar-btn toolbar-btn--ex2"
            onClick={onExportEX2}
            title="Xuất toàn bộ dữ liệu gốc ra Excel"
          >
            <MdFileDownload size={14} />
            <span>EX2</span>
          </button>

          <button
            type="button"
            className="toolbar-btn toolbar-btn--pivot"
            onClick={onOpenPivot}
            title="Mở bảng phân tích Pivot đa chiều"
          >
            <MdAnalytics size={14} />
            <span>PIVOT</span>
          </button>

          {!isMobile && (
            <span className="counter-pill">
              Hiển thị: <strong>{filteredCount} / {totalCount}</strong>
            </span>
          )}
        </div>
      </div>

      {/* ROW 2: SPECIALIZED ERP OPERATIONS (STRICTLY COLOR-CODED) - CHỈ RENDER TRÊN DESKTOP */}
      {!isMobile && (
        <div className="toolbar-row2">
          <button
            type="button"
            className="btn-erp-action btn-erp-action--save"
            onClick={onSaveExcel}
            title="Lưu file dữ liệu ra Excel"
          >
            <MdSave />
            <span>SAVE</span>
          </button>

        <button
          type="button"
          className="btn-erp-action btn-erp-action--ngoai-quan"
          onClick={() => onSetNgoaiQuan("N")}
          disabled={selectedCount === 0}
          title="Thiết lập có kiểm tra ngoại quan"
        >
          <MdCheckCircle />
          <span>SET NGOẠI QUAN</span>
        </button>

        <button
          type="button"
          className="btn-erp-action btn-erp-action--k-ngoai-quan"
          onClick={() => onSetNgoaiQuan("Y")}
          disabled={selectedCount === 0}
          title="Thiết lập không kiểm tra ngoại quan"
        >
          <MdBlock />
          <span>SET K NGOẠI QUAN</span>
        </button>

        <button
          type="button"
          className="btn-erp-action btn-erp-action--reset-bv"
          onClick={onResetBanVe}
          disabled={selectedCount === 0}
          title="Reset trạng thái bản vẽ"
        >
          <MdRestartAlt />
          <span>RESET BẢN VẼ</span>
        </button>

        <button
          type="button"
          className="btn-erp-action btn-erp-action--pd-bv"
          onClick={onPdBanVe}
          disabled={selectedCount === 0}
          title="Phê duyệt bản vẽ kỹ thuật"
        >
          <MdEditDocument />
          <span>PHÊ DUYỆT BẢN VẼ</span>
        </button>

        <button
          type="button"
          className="btn-erp-action btn-erp-action--qlsx"
          onClick={onSaveQLSX}
          disabled={selectedCount === 0}
          title="Cập nhật thông tin Quản lý sản xuất"
        >
          <MdTune />
          <span>Update TT QLSX</span>
        </button>

        <button
          type="button"
          className={`btn-erp-action btn-erp-action--toggle-edit ${enableEdit ? "active" : ""}`}
          onClick={onToggleEnableEdit}
          title="Bật/Tắt chế độ chỉnh sửa trực tiếp trên ô"
        >
          <MdBolt />
          <span>{enableEdit ? "Đang Sửa" : "Bật Tất Sửa"}</span>
        </button>

        <button
          type="button"
          className="btn-erp-action btn-erp-action--loss-sx"
          onClick={onSaveLossSX}
          disabled={selectedCount === 0}
          title="Cập nhật tỷ lệ hao hụt sản xuất"
        >
          <MdTrendingDown />
          <span>Update LOSS SX</span>
        </button>

        <button
          type="button"
          className="btn-erp-action btn-erp-action--bep"
          onClick={onUpdateBEP}
          disabled={selectedCount === 0}
          title="Cập nhật điểm hòa vốn BEP"
        >
          <MdPriceChange />
          <span>Update BEP</span>
        </button>

        <button
          type="button"
          className="btn-erp-action btn-erp-action--loss-kt"
          onClick={onUpdateLossKT}
          disabled={selectedCount === 0}
          title="Cập nhật tỷ lệ hao hụt kiểm tra"
        >
          <MdQueryStats />
          <span>Update LOSS KT</span>
        </button>

        <span className="selected-chip">Đang chọn: {selectedCount} dòng</span>
      </div>
      )}
    </div>
  );
};

export default React.memo(PrecisionCodeManagerToolbar);
