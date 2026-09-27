import React from "react";
import moment from "moment";
import {
  FaFilter,
  FaTimes,
  FaUndo,
  FaSearch,
  FaCalendarAlt,
  FaIndustry,
  FaBoxOpen,
  FaClipboardList,
} from "react-icons/fa";
import { CuonLieuFilterState } from "./useCuonLieuData";
import { MACHINE_LIST } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

interface PrecisionCuonLieuMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: CuonLieuFilterState;
  onFilterChange: (field: keyof CuonLieuFilterState, value: any) => void;
  machineList: MACHINE_LIST[];
  onSearch: () => void;
  onReset: () => void;
}

export const PrecisionCuonLieuMobileFilterDrawer: React.FC<
  PrecisionCuonLieuMobileFilterDrawerProps
> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  machineList,
  onSearch,
  onReset,
}) => {
  if (!isOpen) return null;

  const handleQuickDays = (days: number) => {
    const to = moment().format("YYYY-MM-DD");
    const from =
      days === 0 ? to : moment().subtract(days, "days").format("YYYY-MM-DD");
    onFilterChange("todate", to);
    onFilterChange("fromdate", from);
    if (filters.alltime) {
      onFilterChange("alltime", false);
    }
  };

  const isToday =
    filters.fromdate?.slice(0, 10) === moment().format("YYYY-MM-DD") &&
    filters.todate?.slice(0, 10) === moment().format("YYYY-MM-DD") &&
    !filters.alltime;

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
            <span>BỘ LỌC TÌNH HÌNH CUỘN LIỆU</span>
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
          {/* Nhóm 1: Khoảng ngày nạp liệu & Thời gian */}
          <div className="filter-section">
            <label className="section-label">
              <FaCalendarAlt size={11} />
              <span>Khoảng ngày sản xuất / nạp liệu:</span>
            </label>
            <div className="date-inputs-row">
              <div className="date-field">
                <span className="field-hint">Từ ngày</span>
                <input
                  type="date"
                  value={filters.fromdate ? filters.fromdate.slice(0, 10) : ""}
                  onChange={(e) => onFilterChange("fromdate", e.target.value)}
                />
              </div>
              <div className="date-field">
                <span className="field-hint">Đến ngày</span>
                <input
                  type="date"
                  value={filters.todate ? filters.todate.slice(0, 10) : ""}
                  onChange={(e) => onFilterChange("todate", e.target.value)}
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

            {/* Checkbox All Time */}
            <label className="drawer-checkbox-label">
              <input
                type="checkbox"
                checked={filters.alltime}
                onChange={(e) => onFilterChange("alltime", e.target.checked)}
              />
              <span>Tra cứu toàn bộ thời gian (All Time)</span>
            </label>
          </div>

          {/* Nhóm 2: Nhà máy & Máy sản xuất */}
          <div className="filter-section">
            <label className="section-label">
              <FaIndustry size={11} />
              <span>Khu vực sản xuất:</span>
            </label>
            <div className="text-fields-grid">
              <div className="input-group">
                <span className="field-hint">Nhà máy</span>
                <select
                  value={filters.factory}
                  onChange={(e) => onFilterChange("factory", e.target.value)}
                >
                  <option value="ALL">ALL (Tất cả NM)</option>
                  <option value="NM1">NM1</option>
                  <option value="NM2">NM2</option>
                </select>
              </div>
              <div className="input-group">
                <span className="field-hint">Máy (Line)</span>
                <select
                  value={filters.machine}
                  onChange={(e) => onFilterChange("machine", e.target.value)}
                >
                  <option value="ALL">ALL (Tất cả máy)</option>
                  {machineList.map((m, idx) => (
                    <option key={idx} value={m.EQ_NAME}>
                      {m.EQ_NAME}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Nhóm 3: Mã sản phẩm & Vật tư */}
          <div className="filter-section">
            <label className="section-label">
              <FaBoxOpen size={11} />
              <span>Sản phẩm & Vật tư:</span>
            </label>
            <div className="text-fields-grid">
              <div className="input-group">
                <span className="field-hint">Code KD</span>
                <input
                  type="text"
                  placeholder="GH63-..."
                  value={filters.codekd}
                  onChange={(e) => onFilterChange("codekd", e.target.value)}
                />
              </div>
              <div className="input-group">
                <span className="field-hint">Code ERP</span>
                <input
                  type="text"
                  placeholder="7C123..."
                  value={filters.codecms}
                  onChange={(e) => onFilterChange("codecms", e.target.value)}
                />
              </div>
            </div>
            <div className="text-fields-grid" style={{ marginTop: "4px" }}>
              <div className="input-group">
                <span className="field-hint">Tên Liệu</span>
                <input
                  type="text"
                  placeholder="SJ-2030..."
                  value={filters.m_name}
                  onChange={(e) => onFilterChange("m_name", e.target.value)}
                />
              </div>
              <div className="input-group">
                <span className="field-hint">Mã Liệu</span>
                <input
                  type="text"
                  placeholder="A123..."
                  value={filters.m_code}
                  onChange={(e) => onFilterChange("m_code", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Nhóm 4: Lệnh sản xuất & Khách hàng */}
          <div className="filter-section">
            <label className="section-label">
              <FaClipboardList size={11} />
              <span>Lệnh & Khách hàng:</span>
            </label>
            <div className="text-fields-grid">
              <div className="input-group">
                <span className="field-hint">Số YCSX</span>
                <input
                  type="text"
                  placeholder="Nhập YCSX..."
                  value={filters.prodrequestno}
                  onChange={(e) =>
                    onFilterChange("prodrequestno", e.target.value)
                  }
                />
              </div>
              <div className="input-group">
                <span className="field-hint">Số Chỉ Thị (PLAN_ID)</span>
                <input
                  type="text"
                  placeholder="Nhập PLAN_ID..."
                  value={filters.plan_id}
                  onChange={(e) => onFilterChange("plan_id", e.target.value)}
                />
              </div>
            </div>
            <div className="input-group" style={{ marginTop: "4px" }}>
              <span className="field-hint">Khách hàng</span>
              <input
                type="text"
                placeholder="Nhập tên khách hàng (SEV, VT...)"
                value={filters.cust_name_kd}
                onChange={(e) =>
                  onFilterChange("cust_name_kd", e.target.value)
                }
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
            title="Đặt lại toàn bộ bộ lọc về mặc định"
          >
            <FaUndo size={11} />
            <span>Đặt Lại</span>
          </button>
          <button
            type="button"
            className="btn-drawer-apply"
            onClick={handleApply}
            title="Áp dụng bộ lọc và tra cứu dữ liệu"
          >
            <FaSearch size={12} />
            <span>Áp Dụng</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCuonLieuMobileFilterDrawer);
