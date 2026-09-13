// PrecisionINSPECTIONToolbar.tsx - Thanh công cụ phía trên bảng dữ liệu AG Grid

import React from "react";
import {
  FiTable,
  FiFileText,
  FiDownload,
  FiPieChart,
  FiSliders,
  FiFilter,
  FiSettings,
} from "react-icons/fi";

interface PrecisionINSPECTIONToolbarProps {
  totalColumns: number;
  summaryText?: string;
  onPivotClick: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onToggleFilter?: () => void;
}

const PrecisionINSPECTIONToolbar: React.FC<PrecisionINSPECTIONToolbarProps> = ({
  totalColumns,
  summaryText,
  onPivotClick,
  onExportEX1,
  onExportEX2,
  onToggleFilter,
}) => {
  return (
    <div className="precision-ins__toolbar">
      {/* Cụm nút trái: Pivot & Export Excel */}
      <div className="precision-ins__toolbarLeft">
        <button
          type="button"
          className="precision-ins__toolBtn precision-ins__toolBtn--pivot"
          onClick={onPivotClick}
          title="Mở bảng phân tích xoay đa chiều Pivot"
        >
          <FiTable />
          <span>Pivot</span>
        </button>

        <button
          type="button"
          className="precision-ins__toolBtn precision-ins__toolBtn--excel"
          onClick={onExportEX1}
          title="Xuất bảng tính Excel dữ liệu đang lọc"
        >
          <FiFileText />
          <span>EX1</span>
        </button>

        <button
          type="button"
          className="precision-ins__toolBtn precision-ins__toolBtn--excel"
          onClick={onExportEX2}
          title="Xuất toàn bộ dữ liệu ra Excel"
        >
          <FiDownload />
          <span>EX2</span>
        </button>

        <button
          type="button"
          className="precision-ins__toolBtn precision-ins__toolBtn--pivotAdv"
          onClick={onPivotClick}
          title="Phân tích Pivot chuyên sâu"
        >
          <FiPieChart />
          <span>PIVOT ADVANCED</span>
        </button>

        {summaryText && (
          <span className="precision-ins__summaryChip" title="Tổng số lượng">
            {summaryText}
          </span>
        )}
      </div>

      {/* Cụm công cụ bên phải: đếm cột & cài đặt */}
      <div className="precision-ins__toolbarRight">
        <div className="precision-ins__colCountBadge">
          <FiSliders />
          <span>
            Hiển thị: <strong>{totalColumns} / {totalColumns} cột</strong>
          </span>
        </div>

        {onToggleFilter && (
          <button
            type="button"
            className="precision-ins__iconToolBtn"
            onClick={onToggleFilter}
            title="Bật / tắt hàng lọc nhanh trên cột"
          >
            <FiFilter />
          </button>
        )}

        <button
          type="button"
          className="precision-ins__iconToolBtn"
          title="Cài đặt lưới"
        >
          <FiSettings />
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionINSPECTIONToolbar);
