import React from "react";
import { BiRefresh } from "react-icons/bi";
import { MdFlashOn } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";

interface ToolbarProps {
  factory: "NM1" | "NM2";
  onFactoryChange: (f: "NM1" | "NM2") => void;
  selectedPlanDate: string;
  onDateChange: (date: string) => void;
  onRefresh: () => void;
  onAutoDispatch: () => void;
  eq_series: string[];
  selected_eq: string[];
  onToggleEqSeries: (series: string, checked: boolean) => void;
  searchKeyword: string;
  onSearchKeywordChange: (kw: string) => void;
  isMobile?: boolean;
  onOpenActionDrawer?: () => void;
  onExportExcel?: () => void;
}

export const PrecisionMachineToolbar: React.FC<ToolbarProps> = React.memo(
  ({
    factory,
    onFactoryChange,
    selectedPlanDate,
    onDateChange,
    onRefresh,
    onAutoDispatch,
    eq_series,
    selected_eq,
    onToggleEqSeries,
    searchKeyword,
    onSearchKeywordChange,
    isMobile = false,
    onOpenActionDrawer,
    onExportExcel,
  }) => {
    // GIAO DIỆN DESKTOP (> 768px): GIỮ NGUYÊN 100% CẤU TRÚC VÀ STYLES BAN ĐẦU
    if (!isMobile) {
      return (
        <section className="precision-machine__toolbar">
          <div className="precision-machine__toolbarLeft">
            {/* Switcher NM1 / NM2 */}
            <div className="precision-machine__factorySwitcher">
              <button
                type="button"
                className={factory === "NM1" ? "active" : ""}
                onClick={() => onFactoryChange("NM1")}
              >
                NM1 (Nhà Máy 1)
              </button>
              <button
                type="button"
                className={factory === "NM2" ? "active" : ""}
                onClick={() => onFactoryChange("NM2")}
              >
                NM2
              </button>
            </div>

            {/* Chọn ngày kế hoạch */}
            <div className="precision-machine__dateBox">
              <label htmlFor="plan-date-picker">Plan Date:</label>
              <input
                id="plan-date-picker"
                type="date"
                value={selectedPlanDate}
                onChange={(e) => onDateChange(e.target.value)}
              />
            </div>

            {/* Nút Refresh & Auto Dispatch */}
            <button
              type="button"
              className="precision-machine__actionBtn precision-machine__actionBtn--refresh"
              onClick={onRefresh}
              title="Làm mới toàn bộ kế hoạch và trạng thái máy"
            >
              <BiRefresh size={16} />
              <span>Refresh PLAN</span>
            </button>

            <button
              type="button"
              className="precision-machine__actionBtn precision-machine__actionBtn--autoDispatch"
              onClick={onAutoDispatch}
              title="Tự động cân đối và phân bổ kế hoạch cho các chuyền"
            >
              <MdFlashOn size={16} />
              <span>Auto Dispatch</span>
            </button>

            {/* Checkbox bộ lọc Line máy */}
            <div className="precision-machine__lineFilters">
              <span className="label-title">Filter Line:</span>
              {eq_series.map((series) => {
                const isChecked = selected_eq.includes(series);
                return (
                  <label key={series} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => onToggleEqSeries(series, e.target.checked)}
                    />
                    <span>{series}</span>
                  </label>
                );
              })}
            </div>

            {/* Ô Tìm Kiếm Mã Hàng / PLAN_ID / Tên Máy */}
            <div
              className="precision-machine__searchBox"
              title="Tìm nhanh theo G_NAME, G_NAME_KD, PLAN_ID, G_CODE, EQ_NAME..."
            >
              <AiOutlineSearch size={14} className="search-icon" />
              <input
                type="text"
                placeholder="🔍 Tìm code, mã hàng, PLAN_ID..."
                value={searchKeyword}
                onChange={(e) => onSearchKeywordChange(e.target.value)}
              />
              {searchKeyword && (
                <button
                  type="button"
                  className="clear-btn"
                  onClick={() => onSearchKeywordChange("")}
                  title="Xóa tìm kiếm"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        </section>
      );
    }

    // GIAO DIỆN MOBILE (≤ 768px): TỐI ƯU CÔNG THÁI HỌC VỚI TOUCH TARGET ≥ 38PX & ZERO BLUR
    return (
      <section className="precision-machine__toolbar is-mobile">
        {/* Hàng 1: Search Omnibar to rõ chống zoom Safari + Nút Tác Vụ + Nút Refresh */}
        <div className="toolbar-mobile-row1">
          <div className="search-box">
            <AiOutlineSearch size={16} className="search-icon" />
            <input
              type="text"
              placeholder="🔍 Tìm máy, mã hàng, plan..."
              value={searchKeyword}
              onChange={(e) => onSearchKeywordChange(e.target.value)}
            />
            {searchKeyword && (
              <button
                type="button"
                className="clear-btn"
                onClick={() => onSearchKeywordChange("")}
                title="Xóa tìm kiếm"
              >
                &times;
              </button>
            )}
          </div>

          {onOpenActionDrawer && (
            <button
              type="button"
              className="btn-mobile-action btn-mobile-action--drawer"
              onClick={onOpenActionDrawer}
              title="Mở menu tác vụ ERP"
            >
              <MdFlashOn size={16} />
              <span>Tác Vụ</span>
            </button>
          )}

          <button
            type="button"
            className="btn-mobile-action btn-mobile-action--refresh"
            onClick={onRefresh}
            title="Làm mới kế hoạch"
          >
            <BiRefresh size={18} />
          </button>
        </div>

        {/* Hàng 2: Switcher NM1/NM2 & Dải cuộn ngang Line filter + shortcuts */}
        <div className="toolbar-mobile-row2">
          {/* Switcher NM1 / NM2 */}
          <div className="mobile-factory-switcher">
            <button
              type="button"
              className={factory === "NM1" ? "active" : ""}
              onClick={() => onFactoryChange("NM1")}
            >
              NM1
            </button>
            <button
              type="button"
              className={factory === "NM2" ? "active" : ""}
              onClick={() => onFactoryChange("NM2")}
            >
              NM2
            </button>
          </div>

          {/* Dải cuộn ngang */}
          <div className="mobile-scroll-strip">
            {/* Quick date chip */}
            <div className="mobile-date-chip">
              <label htmlFor="mobile-picker-trigger">📅 {selectedPlanDate}</label>
              <input
                id="mobile-picker-trigger"
                type="date"
                value={selectedPlanDate}
                onChange={(e) => onDateChange(e.target.value)}
              />
            </div>

            {/* Line Filter Chips */}
            {eq_series.map((series) => {
              const isChecked = selected_eq.includes(series);
              return (
                <button
                  key={series}
                  type="button"
                  className={`mobile-chip ${isChecked ? "active" : ""}`}
                  onClick={() => onToggleEqSeries(series, !isChecked)}
                >
                  {series}
                </button>
              );
            })}

            {/* Quick action buttons in scroll strip */}
            <button
              type="button"
              className="mobile-chip mobile-chip--action"
              onClick={onAutoDispatch}
              title="Tự động phân bổ kế hoạch"
            >
              <MdFlashOn size={12} />
              <span>Phân Bổ</span>
            </button>

            {onExportExcel && (
              <button
                type="button"
                className="mobile-chip mobile-chip--excel"
                onClick={onExportExcel}
                title="Xuất file Excel"
              >
                <span>Excel</span>
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }
);
