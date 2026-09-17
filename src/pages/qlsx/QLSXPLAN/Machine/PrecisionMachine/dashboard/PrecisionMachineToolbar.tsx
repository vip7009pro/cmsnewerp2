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
  }) => {
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
          <div className="precision-machine__searchBox" title="Tìm nhanh theo G_NAME, G_NAME_KD, PLAN_ID, G_CODE, EQ_NAME...">
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
);
