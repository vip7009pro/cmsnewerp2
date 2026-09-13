// PrecisionKHOTPToolbar.tsx - Thanh công cụ phía trên bảng Kho Thành Phẩm

import React from "react";
import {
  FiFileText,
  FiDownload,
  FiTable,
  FiPieChart,
  FiSliders,
  FiFilter,
} from "react-icons/fi";

interface PrecisionKHOTPToolbarProps {
  totalColumns: number;
  currentMode: string;
  onModeChange: (mode: string) => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onPivotClick: () => void;
  onToggleFilter?: () => void;
}

const PrecisionKHOTPToolbar: React.FC<PrecisionKHOTPToolbarProps> = ({
  totalColumns,
  currentMode,
  onModeChange,
  onExportEX1,
  onExportEX2,
  onPivotClick,
  onToggleFilter,
}) => {
  return (
    <div className="precision-khotp__toolbar">
      {/* Cụm nút công cụ bên trái */}
      <div className="precision-khotp__toolbarLeft">
        {/* Nút EX1 */}
        <button
          type="button"
          className="precision-khotp__toolBtn precision-khotp__toolBtn--excel"
          onClick={onExportEX1}
          title="Xuất dữ liệu đang hiển thị ra Excel"
        >
          <FiFileText />
          <span>EX1 (Hiển thị)</span>
        </button>

        {/* Nút EX2 */}
        <button
          type="button"
          className="precision-khotp__toolBtn precision-khotp__toolBtn--excelDark"
          onClick={onExportEX2}
          title="Xuất toàn bộ dữ liệu ra Excel"
        >
          <FiDownload />
          <span>EX2 (Raw Data)</span>
        </button>

        {/* Nút PIVOT */}
        <button
          type="button"
          className="precision-khotp__toolBtn precision-khotp__toolBtn--pivot"
          onClick={onPivotClick}
          title="Mở bảng phân tích xoay đa chiều Pivot"
        >
          <FiTable />
          <span>PIVOT</span>
        </button>

        {/* Nút PIVOT ADVANCED */}
        <button
          type="button"
          className="precision-khotp__toolBtn precision-khotp__toolBtn--pivotAdv"
          onClick={onPivotClick}
          title="Phân tích Pivot chuyên sâu"
        >
          <FiPieChart />
          <span>PIVOT ADVANCED</span>
        </button>

        {/* Cụm nút chuyển nhanh chế độ xem */}
        <div className="precision-khotp__quickModes" role="group">
          <button
            type="button"
            className={currentMode === "GR" ? "is-active" : ""}
            onClick={() => onModeChange("GR")}
          >
            Nhập Kho
          </button>
          <button
            type="button"
            className={currentMode === "GI" ? "is-active" : ""}
            onClick={() => onModeChange("GI")}
          >
            Xuất Kho
          </button>
          <button
            type="button"
            className={currentMode === "GI_PACK" ? "is-active" : ""}
            onClick={() => onModeChange("GI_PACK")}
          >
            Xuất Pack
          </button>
          <button
            type="button"
            className={currentMode === "STOCKG_CODE" ? "is-active" : ""}
            onClick={() => onModeChange("STOCKG_CODE")}
          >
            Tồn G_CODE
          </button>
          <button
            type="button"
            className={currentMode === "STOCKG_NAME_KD" ? "is-active" : ""}
            onClick={() => onModeChange("STOCKG_NAME_KD")}
          >
            Tồn Code KD
          </button>
          <button
            type="button"
            className={currentMode === "STOCKG_TACH" ? "is-active" : ""}
            onClick={() => onModeChange("STOCKG_TACH")}
          >
            Tồn Vị Trí
          </button>
        </div>
      </div>

      {/* Cụm bên phải: đếm cột & filter toggle */}
      <div className="precision-khotp__toolbarRight">
        <div className="precision-khotp__colCountBadge">
          <FiSliders />
          <span>
            Hiển thị: <strong>{totalColumns} / {totalColumns} cột</strong>
          </span>
        </div>

        {onToggleFilter && (
          <button
            type="button"
            className="precision-khotp__iconToolBtn"
            onClick={onToggleFilter}
            title="Bật / tắt hàng lọc nhanh trên cột"
          >
            <FiFilter />
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(PrecisionKHOTPToolbar);
