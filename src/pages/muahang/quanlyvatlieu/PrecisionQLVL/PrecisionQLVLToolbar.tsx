import React from "react";
import { FiPlus, FiEdit, FiRefreshCw, FiFolder, FiFileText, FiDownload, FiGrid, FiSearch } from "react-icons/fi";

interface PrecisionQLVLToolbarProps {
  onAddMaterial: () => void;
  onUpdateMaterial: () => void;
  onReload: () => void;
  onOpenDocs: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  totalCount: number;
  filteredCount: number;
  selectedMName?: string;
}

const PrecisionQLVLToolbar: React.FC<PrecisionQLVLToolbarProps> = ({
  onAddMaterial,
  onUpdateMaterial,
  onReload,
  onOpenDocs,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  searchKeyword,
  onSearchChange,
  totalCount,
  filteredCount,
  selectedMName,
}) => {
  return (
    <div className="precision-qlvl__actionToolbar">
      <div className="precision-qlvl__actionGroupLeft">
        {/* Nút Thêm Mới */}
        <button
          type="button"
          className="precision-qlvl__btn precision-qlvl__btn--primary"
          onClick={onAddMaterial}
          title="Thêm mới vật liệu vào danh mục"
        >
          <FiPlus size={13} />
          <span>Thêm Vật Liệu</span>
        </button>

        {/* Nút Cập Nhật / Sửa Vật Liệu */}
        <button
          type="button"
          className="precision-qlvl__btn precision-qlvl__btn--warning"
          onClick={onUpdateMaterial}
          title={`Mở form cập nhật cho vật liệu: ${selectedMName || "Đang chọn"}`}
        >
          <FiEdit size={13} />
          <span>Cập Nhật (Update)</span>
        </button>

        {/* Nút Nạp Dữ Liệu */}
        <button
          type="button"
          className="precision-qlvl__btn precision-qlvl__btn--load"
          onClick={onReload}
          title="Tải lại toàn bộ dữ liệu vật liệu"
        >
          <FiRefreshCw size={12} color="#059669" />
          <span>Load Data</span>
        </button>

        {/* Nút Mở Hồ Sơ Kỹ Thuật */}
        <button
          type="button"
          className="precision-qlvl__btn precision-qlvl__btn--docs"
          onClick={onOpenDocs}
          title="Mở bảng tra cứu hồ sơ kỹ thuật MSDS / TDS / SGS"
        >
          <FiFolder size={12} />
          <span>Tra Cứu Hồ Sơ (Docs)</span>
        </button>

        <div style={{ width: 1, height: 18, backgroundColor: "#e2e8f0", margin: "0 2px" }} />

        {/* Nút Xuất Excel & Pivot */}
        <button
          type="button"
          className="precision-qlvl__btn precision-qlvl__btn--excel"
          onClick={onExportEX1}
          title="Xuất dữ liệu đang lọc ra file Excel"
        >
          <FiFileText size={12} />
          <span>EX1 (Lọc)</span>
        </button>

        <button
          type="button"
          className="precision-qlvl__btn precision-qlvl__btn--excel"
          onClick={onExportEX2}
          title="Xuất toàn bộ cơ sở dữ liệu ra file Excel"
        >
          <FiDownload size={12} />
          <span>EX2 (Tất cả)</span>
        </button>

        <button
          type="button"
          className="precision-qlvl__btn precision-qlvl__btn--pivot"
          onClick={onOpenPivot}
          title="Mở bảng phân tích Pivot đa chiều"
        >
          <FiGrid size={12} />
          <span>PIVOT</span>
        </button>
      </div>

      <div className="precision-qlvl__actionGroupRight">
        <div className="precision-qlvl__searchBox">
          <FiSearch size={13} color="#94a3b8" />
          <input
            type="text"
            placeholder="Lọc nhanh mã, mô tả, vendor..."
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="precision-qlvl__gridMeta">
          <span>
            Hiển thị: <strong>{filteredCount.toLocaleString("en-US")}</strong> / {totalCount.toLocaleString("en-US")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionQLVLToolbar);
