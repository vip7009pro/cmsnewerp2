import React from "react";
import { AiFillFileExcel, AiOutlineSearch } from "react-icons/ai";
import { MdOutlinePivotTableChart } from "react-icons/md";
import { BarcodeTypeFilter, ProductionStatusFilter } from "./barcodeManagerTypes";

interface ToolbarProps {
  typeFilter: BarcodeTypeFilter;
  setTypeFilter: (val: BarcodeTypeFilter) => void;
  prodFilter: ProductionStatusFilter;
  setProdFilter: (val: ProductionStatusFilter) => void;
  quickSearch: string;
  setQuickSearch: (val: string) => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  totalCount: number;
  filteredCount: number;
}

export const PrecisionProductBarcodeToolbar: React.FC<ToolbarProps> = React.memo(
  ({
    typeFilter,
    setTypeFilter,
    prodFilter,
    setProdFilter,
    quickSearch,
    setQuickSearch,
    onExportEX1,
    onExportEX2,
    onOpenPivot,
    totalCount,
    filteredCount,
  }) => {
    return (
      <div className="precision-barcode__toolbar">
        {/* PHÍA TRÁI: BỘ LỌC NHANH LOẠI MÃ & TIẾN ĐỘ SẢN XUẤT */}
        <div className="precision-barcode__toolbarLeft">
          {/* LOẠI MÃ VẠCH */}
          <div className="precision-barcode__filterGroup">
            <button
              type="button"
              className={`filterBtn ${typeFilter === "ALL" ? "filterBtn--active" : ""}`}
              onClick={() => setTypeFilter("ALL")}
            >
              Tất Cả Loại
            </button>
            <button
              type="button"
              className={`filterBtn ${typeFilter === "1D" ? "filterBtn--active" : ""}`}
              onClick={() => setTypeFilter("1D")}
            >
              1D Barcode
            </button>
            <button
              type="button"
              className={`filterBtn ${typeFilter === "QR" ? "filterBtn--active" : ""}`}
              onClick={() => setTypeFilter("QR")}
            >
              QR Code
            </button>
            <button
              type="button"
              className={`filterBtn ${typeFilter === "MATRIX" ? "filterBtn--active" : ""}`}
              onClick={() => setTypeFilter("MATRIX")}
            >
              2D Matrix
            </button>
          </div>

          {/* TRẠNG THÁI SẢN XUẤT */}
          <div className="precision-barcode__filterGroup">
            <button
              type="button"
              className={`filterBtn ${prodFilter === "ALL" ? "filterBtn--active" : ""}`}
              onClick={() => setProdFilter("ALL")}
            >
              Toàn Bộ
            </button>
            <button
              type="button"
              className={`filterBtn ${prodFilter === "YES" ? "filterBtn--active" : ""}`}
              onClick={() => setProdFilter("YES")}
            >
              Đã Sản Xuất
            </button>
            <button
              type="button"
              className={`filterBtn ${prodFilter === "NO" ? "filterBtn--active" : ""}`}
              onClick={() => setProdFilter("NO")}
            >
              Chưa Sản Xuất
            </button>
          </div>
        </div>

        {/* PHÍA PHẢI: TÌM KIẾM NHANH, EXCEL, PIVOT */}
        <div className="precision-barcode__toolbarRight">
          <div className="precision-barcode__quickSearch">
            <span className="icon">
              <AiOutlineSearch />
            </span>
            <input
              type="text"
              placeholder="Lọc nhanh mã, tên, chuỗi..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="precision-barcode__btn precision-barcode__btn--excel"
            onClick={onExportEX1}
            title="Xuất dữ liệu đang lọc ra file Excel"
          >
            <AiFillFileExcel size={14} />
            <span>EX1</span>
            <span className="badge">Đang lọc</span>
          </button>

          <button
            type="button"
            className="precision-barcode__btn precision-barcode__btn--excel"
            onClick={onExportEX2}
            title="Xuất toàn bộ dữ liệu ra file Excel"
          >
            <AiFillFileExcel size={14} />
            <span>EX2</span>
            <span className="badge">Tất cả</span>
          </button>

          <button
            type="button"
            className="precision-barcode__btn precision-barcode__btn--pivot"
            onClick={onOpenPivot}
            title="Mở bảng phân tích Pivot đa chiều"
          >
            <MdOutlinePivotTableChart size={14} />
            <span>PIVOT</span>
          </button>

          <div className="precision-barcode__metaBadge">
            Hiển thị: <strong>{filteredCount} / {totalCount}</strong>
          </div>
        </div>
      </div>
    );
  }
);

PrecisionProductBarcodeToolbar.displayName = "PrecisionProductBarcodeToolbar";
