import React from "react";
import {
  FiSearch,
  FiX,
  FiFilter,
  FiRefreshCw,
  FiFileText,
  FiDownload,
} from "react-icons/fi";
import {
  AiOutlineSwapRight,
  AiOutlineDelete,
  AiOutlineEyeInvisible,
  AiOutlineLock,
  AiOutlineFileExcel,
} from "react-icons/ai";
import { BiLayer, BiImport, BiExport } from "react-icons/bi";

interface PrecisionKhoAoMobileToolbarProps {
  activeTab: "TON" | "LS_IN" | "LS_OUT";
  onTabChange: (tab: "TON" | "LS_IN" | "LS_OUT") => void;
  searchKeyword: string;
  setSearchKeyword: (val: string) => void;
  onClearSearch: () => void;
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
  nextPlan: string;
  setNextPlan: (val: string) => void;
  onXuatNext: () => void;
  onXoaRac: () => void;
  onAnRac: () => void;
  onRefresh: () => void;
  onExportExcel: (type: "EX1" | "EX2") => void;
  isLoading: boolean;
}

export const PrecisionKhoAoMobileToolbar: React.FC<
  PrecisionKhoAoMobileToolbarProps
> = React.memo(({
  activeTab,
  onTabChange,
  searchKeyword,
  setSearchKeyword,
  onClearSearch,
  onOpenFilterDrawer,
  activeFilterCount,
  nextPlan,
  setNextPlan,
  onXuatNext,
  onXoaRac,
  onAnRac,
  onRefresh,
  onExportExcel,
  isLoading,
}) => {
  return (
    <div className="precision-khoao-mobile-toolbar">
      {/* HÀNG 1: Ô TÌM KIẾM NHANH + NÚT BỘ LỌC + NÚT TẢI LẠI */}
      <div className="mobile-toolbar-row mobile-toolbar-row--search">
        <div className="mobile-search-box">
          <FiSearch size={15} className="mobile-search-icon" />
          <input
            type="text"
            className="mobile-search-input"
            placeholder="Tìm mã liệu, tên liệu, số lot, plan..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          {searchKeyword.length > 0 && (
            <button
              type="button"
              className="mobile-search-clear"
              onClick={onClearSearch}
              title="Xóa tìm kiếm"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        <button
          type="button"
          className={`mobile-filter-btn ${activeFilterCount > 0 ? "has-filter" : ""}`}
          onClick={onOpenFilterDrawer}
          title="Mở bộ lọc nâng cao"
        >
          <FiFilter size={15} />
          <span>Bộ Lọc</span>
          {activeFilterCount > 0 && (
            <span className="mobile-filter-badge">{activeFilterCount}</span>
          )}
        </button>

        <button
          type="button"
          className="mobile-refresh-btn"
          onClick={onRefresh}
          disabled={isLoading}
          title="Tải lại dữ liệu"
        >
          <FiRefreshCw
            size={14}
            className={isLoading ? "spin-animation" : ""}
          />
        </button>
      </div>

      {/* HÀNG 2: SEGMENTED TABS & DẢI NÚT HÀNH ĐỘNG CUỘN NGANG */}
      <div className="mobile-toolbar-row mobile-toolbar-row--actions">
        {/* Segmented Switcher Tabs */}
        <div className="mobile-segmented-tabs">
          <button
            type="button"
            className={`mobile-tab-btn ${activeTab === "TON" ? "active" : ""}`}
            onClick={() => onTabChange("TON")}
          >
            <BiLayer size={13} />
            <span>TỒN MAIN</span>
          </button>

          <button
            type="button"
            className={`mobile-tab-btn ${activeTab === "LS_IN" ? "active" : ""}`}
            onClick={() => onTabChange("LS_IN")}
          >
            <BiImport size={13} />
            <span>NHẬP (IN)</span>
          </button>

          <button
            type="button"
            className={`mobile-tab-btn ${activeTab === "LS_OUT" ? "active" : ""}`}
            onClick={() => onTabChange("LS_OUT")}
          >
            <BiExport size={13} />
            <span>XUẤT (OUT)</span>
          </button>
        </div>

        {/* Action Buttons Scroll */}
        <div className="mobile-action-scroll">
          {activeTab === "TON" && (
            <>
              <div className="mobile-nextplan-control">
                <input
                  type="text"
                  className="mobile-nextplan-input"
                  placeholder="NEXT PLAN"
                  value={nextPlan}
                  onChange={(e) => setNextPlan(e.target.value.toUpperCase())}
                  title="Mã chỉ thị tiếp nhận"
                />
                <button
                  type="button"
                  className="mobile-action-btn mobile-action-btn--primary"
                  onClick={onXuatNext}
                  disabled={isLoading}
                  title="Xuất các cuộn đã chọn sang chỉ thị NEXT PLAN"
                >
                  <AiOutlineSwapRight size={14} />
                  <span>XUẤT NEXT</span>
                </button>
              </div>

              <button
                type="button"
                className="mobile-action-btn mobile-action-btn--danger"
                onClick={onXoaRac}
                disabled={isLoading}
                title="Xóa rác (Yêu cầu mật khẩu)"
              >
                <AiOutlineLock size={12} />
                <AiOutlineDelete size={13} />
                <span>Xóa Rác</span>
              </button>

              <button
                type="button"
                className="mobile-action-btn mobile-action-btn--warning"
                onClick={onAnRac}
                disabled={isLoading}
                title="Ẩn các cuộn rác đã chọn"
              >
                <AiOutlineEyeInvisible size={13} />
                <span>Ẩn Rác</span>
              </button>
            </>
          )}

          <button
            type="button"
            className="mobile-action-btn mobile-action-btn--excel"
            onClick={() => onExportExcel("EX1")}
            title="Xuất file Excel dữ liệu đang lọc"
          >
            <AiOutlineFileExcel size={13} />
            <span>EX1</span>
            <span className="mini-tag">Lọc</span>
          </button>

          <button
            type="button"
            className="mobile-action-btn mobile-action-btn--excel"
            onClick={() => onExportExcel("EX2")}
            title="Xuất toàn bộ dữ liệu ra Excel"
          >
            <AiOutlineFileExcel size={13} />
            <span>EX2</span>
            <span className="mini-tag">Tất cả</span>
          </button>
        </div>
      </div>
    </div>
  );
});
