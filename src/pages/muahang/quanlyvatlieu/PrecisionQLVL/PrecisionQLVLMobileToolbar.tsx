import React from "react";
import {
  FiPlus,
  FiEdit,
  FiRefreshCw,
  FiFolder,
  FiFileText,
  FiDownload,
  FiGrid,
  FiSearch,
  FiX,
  FiFilter,
  FiCheckCircle,
  FiAward,
} from "react-icons/fi";

interface PrecisionQLVLMobileToolbarProps {
  onAddMaterial: () => void;
  onUpdateMaterial: () => void;
  onReload: () => void;
  onOpenDocs: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  selectedMName?: string;
  activeFilterCount: number;
  onOpenFilterDrawer: () => void;
  // Quick filters
  filterUseYn: "ALL" | "Y" | "N";
  onFilterUseYnChange: (val: "ALL" | "Y" | "N") => void;
  filterFsc: "ALL" | "Y" | "N";
  onFilterFscChange: (val: "ALL" | "Y" | "N") => void;
  filterDocs: "ALL" | "HAS_DOCS" | "NO_DOCS";
  onFilterDocsChange: (val: "ALL" | "HAS_DOCS" | "NO_DOCS") => void;
}

const PrecisionQLVLMobileToolbar: React.FC<PrecisionQLVLMobileToolbarProps> = ({
  onAddMaterial,
  onUpdateMaterial,
  onReload,
  onOpenDocs,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  searchKeyword,
  onSearchChange,
  selectedMName,
  activeFilterCount,
  onOpenFilterDrawer,
  filterUseYn,
  onFilterUseYnChange,
  filterFsc,
  onFilterFscChange,
  filterDocs,
  onFilterDocsChange,
}) => {
  return (
    <div className="precision-qlvl__mobileToolbar">
      {/* Hàng 1: Search input thông minh + Nút Lọc + Nút Reload */}
      <div className="mobile-toolbar-search-row">
        <div className="search-input-box">
          <FiSearch size={15} className="search-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Tìm mã vật liệu, vendor, mô tả..."
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchKeyword && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange("")}
              title="Xóa tìm kiếm"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        <button
          type="button"
          className={`btn-trigger-filter ${activeFilterCount > 0 ? "active" : ""}`}
          onClick={onOpenFilterDrawer}
          title="Mở bộ lọc nâng cao"
        >
          <FiFilter size={14} />
          <span>Lọc</span>
          {activeFilterCount > 0 && <span className="badge-count">{activeFilterCount}</span>}
        </button>

        <button
          type="button"
          className="btn-trigger-reload"
          onClick={onReload}
          title="Tải lại dữ liệu"
        >
          <FiRefreshCw size={14} />
        </button>
      </div>

      {/* Hàng 2: Các nút hành động chính Touch Target lớn */}
      <div className="mobile-toolbar-action-buttons">
        <button
          type="button"
          className="mobile-btn mobile-btn--primary"
          onClick={onAddMaterial}
          title="Thêm mới vật liệu vào danh mục"
        >
          <FiPlus size={15} />
          <span>Thêm Vật Liệu</span>
        </button>

        <button
          type="button"
          className={`mobile-btn mobile-btn--warning ${selectedMName ? "has-selection" : ""}`}
          onClick={onUpdateMaterial}
          title={selectedMName ? `Cập nhật mã: ${selectedMName}` : "Chọn dòng trên bảng để cập nhật"}
        >
          <FiEdit size={14} />
          <span>{selectedMName ? `Sửa (${selectedMName})` : "Cập Nhật"}</span>
        </button>

        <button
          type="button"
          className="mobile-btn mobile-btn--docs"
          onClick={onOpenDocs}
          title="Tra cứu hồ sơ kỹ thuật TDS / SGS / MSDS"
        >
          <FiFolder size={14} />
          <span>Hồ Sơ (Docs)</span>
        </button>
      </div>

      {/* Hàng 3: Dải Pills Lọc Nhanh & Tiện Ích Xuất Cuộn Ngang */}
      <div className="mobile-toolbar-actions-scroll">
        {/* Quick Filter: Đang Dùng */}
        <button
          type="button"
          className={`action-pill ${filterUseYn === "Y" ? "active" : ""}`}
          onClick={() => onFilterUseYnChange(filterUseYn === "Y" ? "ALL" : "Y")}
          title="Lọc nhanh vật liệu đang sử dụng (USE_YN = Y)"
        >
          <FiCheckCircle size={12} />
          <span>{filterUseYn === "Y" ? "Đang Dùng ✓" : "Đang Dùng"}</span>
        </button>

        {/* Quick Filter: Đạt FSC */}
        <button
          type="button"
          className={`action-pill ${filterFsc === "Y" ? "active" : ""}`}
          onClick={() => onFilterFscChange(filterFsc === "Y" ? "ALL" : "Y")}
          title="Lọc nhanh vật liệu đạt chuẩn FSC (FSC = Y)"
        >
          <FiAward size={12} />
          <span>{filterFsc === "Y" ? "Đạt FSC ✓" : "Đạt FSC"}</span>
        </button>

        {/* Quick Filter: Có Hồ Sơ Kỹ Thuật */}
        <button
          type="button"
          className={`action-pill ${filterDocs === "HAS_DOCS" ? "active" : ""}`}
          onClick={() => onFilterDocsChange(filterDocs === "HAS_DOCS" ? "ALL" : "HAS_DOCS")}
          title="Lọc nhanh vật liệu đã có hồ sơ kỹ thuật TDS / SGS / MSDS"
        >
          <FiFolder size={12} />
          <span>{filterDocs === "HAS_DOCS" ? "Có Hồ Sơ ✓" : "Có Hồ Sơ"}</span>
        </button>

        <div className="pill-divider" />

        {/* Export EX1 */}
        <button
          type="button"
          className="action-pill action-pill--export"
          onClick={onExportEX1}
          title="Xuất Excel danh sách đang lọc"
        >
          <FiFileText size={12} />
          <span>EX1 (Lọc)</span>
        </button>

        {/* Export EX2 */}
        <button
          type="button"
          className="action-pill action-pill--export"
          onClick={onExportEX2}
          title="Xuất Excel toàn bộ danh mục vật liệu"
        >
          <FiDownload size={12} />
          <span>EX2 (Tất Cả)</span>
        </button>

        {/* Pivot */}
        <button
          type="button"
          className="action-pill action-pill--pivot"
          onClick={onOpenPivot}
          title="Mở bảng phân tích dữ liệu đa chiều PIVOT"
        >
          <FiGrid size={12} />
          <span>PIVOT</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionQLVLMobileToolbar);
