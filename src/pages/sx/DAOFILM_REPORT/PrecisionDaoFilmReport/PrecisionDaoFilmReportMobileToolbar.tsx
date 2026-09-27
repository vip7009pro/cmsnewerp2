import React from "react";
import { FiCalendar, FiCheck, FiFilter, FiSearch, FiX } from "react-icons/fi";
import { MobileTabType } from "./useDaoFilmReportData";

interface PrecisionDaoFilmReportMobileToolbarProps {
  activeTab: MobileTabType;
  onChangeTab: (tab: MobileTabType) => void;
  totalBackRecords: number;
  totalDetailRecords: number;
  searchKeyword: string;
  onSearchChange: (val: string) => void;
  activeFilterCount: number;
  onOpenFilterDrawer: () => void;
  useAllTime: boolean;
  onToggleUseAllTime: () => void;
  selectedKnife: { MA_DAO: string; MA_DAO_KT: string } | null;
  filteredCount: number;
  totalCount: number;
}

export const PrecisionDaoFilmReportMobileToolbar: React.FC<
  PrecisionDaoFilmReportMobileToolbarProps
> = ({
  activeTab,
  onChangeTab,
  totalBackRecords,
  totalDetailRecords,
  searchKeyword,
  onSearchChange,
  activeFilterCount,
  onOpenFilterDrawer,
  useAllTime,
  onToggleUseAllTime,
  selectedKnife,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="precision-dfr-mobile-toolbar">
      {/* Hàng 1: Tab Switcher 2 Bảng */}
      <div className="toolbar-tab-row">
        <button
          type="button"
          className={`tab-btn ${activeTab === "BACK_DATA" ? "tab-btn--active" : ""}`}
          onClick={() => onChangeTab("BACK_DATA")}
        >
          <span>Báo Cáo Dao</span>
          <span className="tab-badge">{totalBackRecords.toLocaleString("en-US")}</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === "DETAIL_DATA" ? "tab-btn--active" : ""}`}
          onClick={() => onChangeTab("DETAIL_DATA")}
        >
          <span>Chi Tiết Dập</span>
          <span
            className={`tab-badge ${
              totalDetailRecords > 0 ? "tab-badge--has-data" : ""
            }`}
          >
            {totalDetailRecords.toLocaleString("en-US")}
          </span>
        </button>
      </div>

      {/* Hàng 2: Ô tìm kiếm thông minh 14px + Nút Bộ Lọc */}
      <div className="toolbar-search-row">
        <div className="search-box">
          <FiSearch size={14} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={
              activeTab === "BACK_DATA"
                ? "Tìm mã dao, kích thước, trạng thái..."
                : "Tìm code, tên sản phẩm, nhân viên, plan..."
            }
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchKeyword && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange("")}
              title="Xóa tìm kiếm"
            >
              <FiX size={13} />
            </button>
          )}
        </div>

        {/* Nút Kích Hoạt Bộ Lọc (Floating Filter Button) */}
        <button
          type="button"
          className={`filter-btn ${activeFilterCount > 0 ? "filter-btn--active" : ""}`}
          onClick={onOpenFilterDrawer}
          title="Mở bộ lọc ngày"
        >
          <FiFilter size={13} />
          <span>Lọc</span>
          {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
        </button>
      </div>

      {/* Hàng 3: Dải nút thao tác cuộn ngang */}
      <div className="toolbar-chips-row">
        {/* Quick chip All-time */}
        <button
          type="button"
          className={`chip-btn ${useAllTime ? "chip-btn--active" : ""}`}
          onClick={onToggleUseAllTime}
        >
          <FiCalendar size={11} />
          <span>All-Time (2020-nay)</span>
          {useAllTime && <FiCheck size={11} />}
        </button>

        {/* Chip hiển thị mã dao đang xem nếu có */}
        {selectedKnife && (
          <span className="knife-selected-chip" title="Dao đang chọn để xem chi tiết">
            Đang chọn: <strong>{selectedKnife.MA_DAO}</strong>
          </span>
        )}

        {/* Bộ đếm bản ghi */}
        <span className="count-chip">
          {filteredCount !== totalCount
            ? `Hiển thị ${filteredCount} / ${totalCount} dòng`
            : `${totalCount} dòng`}
        </span>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDaoFilmReportMobileToolbar);
