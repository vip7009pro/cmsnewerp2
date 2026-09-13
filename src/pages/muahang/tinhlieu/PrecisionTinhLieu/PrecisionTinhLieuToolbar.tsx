import React from "react";
import {
  FiCalendar,
  FiLayers,
  FiPieChart,
  FiTrendingUp,
  FiUnlock,
  FiLock,
  FiSearch,
  FiDownload,
  FiFileText,
} from "react-icons/fi";

interface PrecisionTinhLieuToolbarProps {
  formData: {
    FROM_DATE: string;
    TO_DATE: string;
    ALLTIME: boolean;
    SHORTAGE_ONLY: boolean;
    NEWPO: boolean;
  };
  onFormChange: (keyname: string, value: any) => void;
  currentMode: "DETAIL" | "SUMMARY" | "PLAN";
  onLoadMRP: (mode: "DETAIL" | "SUMMARY" | "PLAN") => void;
  onLockMaterial: () => void;
  onUnLockMaterial: () => void;
  selectedYCSXCount: number;
  company: string;
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  totalCount: number;
  filteredCount: number;
}

const PrecisionTinhLieuToolbar: React.FC<PrecisionTinhLieuToolbarProps> = ({
  formData,
  onFormChange,
  currentMode,
  onLoadMRP,
  onLockMaterial,
  onUnLockMaterial,
  selectedYCSXCount,
  company,
  searchKeyword,
  onSearchChange,
  onExportEX1,
  onExportEX2,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="precision-tinhlieu__actionToolbar">
      {/* Hàng 1: Bộ Lọc Ngày, Bộ Lọc Tùy Chọn & Tìm Kiếm, Xuất Excel */}
      <div className="precision-tinhlieu__filterRow">
        <div className="precision-tinhlieu__filterGroupLeft">
          {/* Từ ngày */}
          <div className="precision-tinhlieu__filterItem">
            <FiCalendar size={13} color="#64748b" />
            <span>Từ:</span>
            <input
              type="date"
              value={formData.FROM_DATE ? formData.FROM_DATE.slice(0, 10) : ""}
              onChange={(e) => onFormChange("FROM_DATE", e.target.value)}
              disabled={formData.ALLTIME}
            />
          </div>

          {/* Tới ngày */}
          <div className="precision-tinhlieu__filterItem">
            <span>Đến:</span>
            <input
              type="date"
              value={formData.TO_DATE ? formData.TO_DATE.slice(0, 10) : ""}
              onChange={(e) => onFormChange("TO_DATE", e.target.value)}
              disabled={formData.ALLTIME}
            />
          </div>

          {/* Checkbox All Time */}
          <label
            className={`precision-tinhlieu__checkboxPill ${
              formData.ALLTIME ? "precision-tinhlieu__checkboxPill--active" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={formData.ALLTIME}
              onChange={(e) => onFormChange("ALLTIME", e.target.checked)}
            />
            <span>Tất Cả (All Time)</span>
          </label>

          {/* Checkbox Chỉ Liệu Thiếu */}
          <label
            className={`precision-tinhlieu__checkboxPill ${
              formData.SHORTAGE_ONLY ? "precision-tinhlieu__checkboxPill--warning" : ""
            }`}
            title="Chỉ hiển thị các vật liệu bị thiếu hụt"
          >
            <input
              type="checkbox"
              checked={formData.SHORTAGE_ONLY}
              onChange={(e) => onFormChange("SHORTAGE_ONLY", e.target.checked)}
            />
            <span>Chỉ Liệu Thiếu (Shortage)</span>
          </label>

          {/* Checkbox Chỉ PO Mới */}
          <label
            className={`precision-tinhlieu__checkboxPill ${
              formData.NEWPO ? "precision-tinhlieu__checkboxPill--active" : ""
            }`}
            title="Chỉ tính cho các đơn hàng PO mới phát sinh"
          >
            <input
              type="checkbox"
              checked={formData.NEWPO}
              onChange={(e) => onFormChange("NEWPO", e.target.checked)}
            />
            <span>Chỉ PO Mới</span>
          </label>
        </div>

        <div className="precision-tinhlieu__actionGroupRight">
          {/* Ô Tìm Kiếm Nhanh */}
          <div className="precision-tinhlieu__searchBox">
            <FiSearch size={13} color="#94a3b8" />
            <input
              type="text"
              placeholder={`Lọc nhanh ${filteredCount}/${totalCount} dòng...`}
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Nút Xuất Excel */}
          <button
            type="button"
            className="precision-tinhlieu__btn precision-tinhlieu__btn--excel"
            onClick={onExportEX1}
            title="Xuất bảng tính các dòng đang lọc hiển thị"
          >
            <FiDownload size={13} />
            <span>EX1 (Lọc)</span>
          </button>

          <button
            type="button"
            className="precision-tinhlieu__btn precision-tinhlieu__btn--excel"
            onClick={onExportEX2}
            title="Xuất toàn bộ dữ liệu ra Excel"
          >
            <FiFileText size={13} />
            <span>EX2 (Tất cả)</span>
          </button>
        </div>
      </div>

      {/* Hàng 2: Các Chế Độ Tra Cứu MRP & Cụm Khóa/Mở Liệu YCSX */}
      <div className="precision-tinhlieu__controlRow">
        <div className="precision-tinhlieu__tabButtonGroup">
          {/* Tab 1: MRP Chi Tiết */}
          <button
            type="button"
            className={`precision-tinhlieu__tabBtn ${
              currentMode === "DETAIL" ? "precision-tinhlieu__tabBtn--active" : ""
            }`}
            onClick={() => onLoadMRP("DETAIL")}
            title="Phân tích nhu cầu cấp liệu chi tiết theo từng đơn PO / YCSX"
          >
            <FiLayers size={13} />
            <span>MRP CHI TIẾT (Detail)</span>
          </button>

          {/* Tab 2: MRP Tổng Hợp */}
          <button
            type="button"
            className={`precision-tinhlieu__tabBtn ${
              currentMode === "SUMMARY" ? "precision-tinhlieu__tabBtn--active-purple" : ""
            }`}
            onClick={() => onLoadMRP("SUMMARY")}
            title="Tổng hợp nhu cầu, tồn kho và số lượng thiếu hụt theo từng mã vật liệu"
          >
            <FiPieChart size={13} />
            <span>MRP TỔNG HỢP (Summary)</span>
          </button>

          {/* Tab 3: MRP Kế Hoạch 15 Ngày */}
          {company === "CMS" && (
            <button
              type="button"
              className={`precision-tinhlieu__tabBtn ${
                currentMode === "PLAN" ? "precision-tinhlieu__tabBtn--active-emerald" : ""
              }`}
              onClick={() => onLoadMRP("PLAN")}
              title="Kế hoạch phân bổ nhu cầu vật liệu theo tiến độ sản xuất 15 ngày tới"
            >
              <FiTrendingUp size={13} />
              <span>MRP THEO KẾ HOẠCH (Plan 15D)</span>
            </button>
          )}
        </div>

        {/* Nhóm Thao Tác Quản Trị Liệu YCSX */}
        {(company === "CMS" || company === "PVN") && (
          <div className="precision-tinhlieu__actionGroupRight">
            <button
              type="button"
              className="precision-tinhlieu__btn precision-tinhlieu__btn--unlock"
              onClick={onUnLockMaterial}
              title="Mở liệu cho các YCSX được chọn trên bảng"
            >
              <FiUnlock size={13} />
              <span>MỞ LIỆU (Unlock)</span>
              {selectedYCSXCount > 0 && (
                <span className="badge-count">{selectedYCSXCount}</span>
              )}
            </button>

            <button
              type="button"
              className="precision-tinhlieu__btn precision-tinhlieu__btn--lock"
              onClick={onLockMaterial}
              title="Khóa liệu cho các YCSX được chọn trên bảng"
            >
              <FiLock size={13} />
              <span>KHÓA LIỆU (Lock)</span>
              {selectedYCSXCount > 0 && (
                <span className="badge-count">{selectedYCSXCount}</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(PrecisionTinhLieuToolbar);
