import React from "react";
import moment from "moment";
import { FaFilter, FaTimes, FaUndo, FaSearch, FaCalendarAlt } from "react-icons/fa";
import { TemLotFilterData } from "./PrecisionLichSuTemLotSxToolbar";

interface PrecisionLichSuTemLotSxMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filterData: TemLotFilterData;
  onFilterChange: (keyname: keyof TemLotFilterData, value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const PrecisionLichSuTemLotSxMobileFilterDrawer: React.FC<
  PrecisionLichSuTemLotSxMobileFilterDrawerProps
> = ({
  isOpen,
  onClose,
  filterData,
  onFilterChange,
  onSearch,
  onReset,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const handleQuickDays = (days: number) => {
    const to = moment().format("YYYY-MM-DD");
    const from = days === 0 ? to : moment().subtract(days, "days").format("YYYY-MM-DD");
    onFilterChange("TO_DATE", to);
    onFilterChange("FROM_DATE", from);
  };

  const isToday =
    filterData.FROM_DATE?.slice(0, 10) === moment().format("YYYY-MM-DD") &&
    filterData.TO_DATE?.slice(0, 10) === moment().format("YYYY-MM-DD");

  const handleApply = () => {
    onSearch();
    onClose();
  };

  return (
    <div className="precision-mobile-drawer-backdrop" onClick={onClose}>
      <div
        className="precision-mobile-drawer"
        onClick={(e) => e.stopPropagation()} // Chống đóng khi chạm vào drawer
      >
        {/* Thanh kéo trang trí */}
        <div className="drawer-drag-handle" />

        {/* Header Drawer */}
        <div className="drawer-header">
          <div className="drawer-title">
            <FaFilter className="filter-icon" />
            <span>BỘ LỌC TEM LÓT SẢN XUẤT</span>
          </div>
          <button
            type="button"
            className="btn-close-drawer"
            onClick={onClose}
            title="Đóng bộ lọc"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Nội Dung Điều Kiện Lọc */}
        <div className="drawer-body">
          {/* Nhóm 1: Khoảng ngày sản xuất */}
          <div className="filter-section">
            <label className="section-label">
              <FaCalendarAlt size={11} />
              <span>Khoảng ngày tạo tem:</span>
            </label>
            <div className="date-inputs-row">
              <div className="date-field">
                <span className="field-hint">Từ ngày</span>
                <input
                  type="date"
                  value={filterData.FROM_DATE ? filterData.FROM_DATE.slice(0, 10) : ""}
                  onChange={(e) => onFilterChange("FROM_DATE", e.target.value)}
                />
              </div>
              <div className="date-field">
                <span className="field-hint">Đến ngày</span>
                <input
                  type="date"
                  value={filterData.TO_DATE ? filterData.TO_DATE.slice(0, 10) : ""}
                  onChange={(e) => onFilterChange("TO_DATE", e.target.value)}
                />
              </div>
            </div>

            {/* Quick chọn ngày */}
            <div className="quick-dates-pills">
              <button
                type="button"
                className={`quick-pill ${isToday ? "quick-pill--active" : ""}`}
                onClick={() => handleQuickDays(0)}
              >
                Hôm nay
              </button>
              <button
                type="button"
                className="quick-pill"
                onClick={() => handleQuickDays(3)}
              >
                3 ngày
              </button>
              <button
                type="button"
                className="quick-pill"
                onClick={() => handleQuickDays(7)}
              >
                7 ngày
              </button>
              <button
                type="button"
                className="quick-pill"
                onClick={() => handleQuickDays(30)}
              >
                30 ngày
              </button>
            </div>
          </div>

          {/* Nhóm 2: Mã sản phẩm (Code KD, Code ERP) */}
          <div className="filter-section">
            <label className="section-label">Sản phẩm:</label>
            <div className="text-fields-grid">
              <div className="input-group">
                <span className="field-hint">Code KD</span>
                <input
                  type="text"
                  placeholder="Nhập Code KD..."
                  value={filterData.G_NAME}
                  onChange={(e) => onFilterChange("G_NAME", e.target.value)}
                />
              </div>
              <div className="input-group">
                <span className="field-hint">Code ERP</span>
                <input
                  type="text"
                  placeholder="Nhập Code ERP..."
                  value={filterData.G_CODE}
                  onChange={(e) => onFilterChange("G_CODE", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Nhóm 3: Lệnh sản xuất & Tem (YCSX, LOT SX) */}
          <div className="filter-section">
            <label className="section-label">Lệnh & Tem:</label>
            <div className="text-fields-grid">
              <div className="input-group">
                <span className="field-hint">Mã YCSX</span>
                <input
                  type="text"
                  placeholder="Nhập YCSX..."
                  value={filterData.PROD_REQUEST_NO}
                  onChange={(e) => onFilterChange("PROD_REQUEST_NO", e.target.value)}
                />
              </div>
              <div className="input-group">
                <span className="field-hint">Mã LOT SX</span>
                <input
                  type="text"
                  placeholder="Nhập LOT SX..."
                  value={filterData.PROCESS_LOT_NO}
                  onChange={(e) => onFilterChange("PROCESS_LOT_NO", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Nhóm 4: Khách hàng */}
          <div className="filter-section">
            <label className="section-label">Khách hàng:</label>
            <div className="input-group">
              <input
                type="text"
                placeholder="Nhập tên khách hàng..."
                value={filterData.CUST_NAME_KD}
                onChange={(e) => onFilterChange("CUST_NAME_KD", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer Drawer: Nút Đặt Lại & Nút Áp Dụng */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-drawer-reset"
            onClick={onReset}
            disabled={isLoading}
            title="Đặt lại toàn bộ bộ lọc về mặc định"
          >
            <FaUndo size={11} />
            <span>Đặt Lại</span>
          </button>
          <button
            type="button"
            className="btn-drawer-apply"
            onClick={handleApply}
            disabled={isLoading}
            title="Áp dụng bộ lọc và tra cứu dữ liệu"
          >
            <FaSearch size={12} />
            <span>{isLoading ? "Đang tải..." : "Áp Dụng"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionLichSuTemLotSxMobileFilterDrawer);
