import React from "react";
import {
  AiOutlineReload,
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
  AiOutlinePlus,
  AiOutlineBarChart,
  AiOutlineFilter,
} from "react-icons/ai";
import { UserData } from "../../../../api/GlobalInterface";

interface PrecisionNCRMobileHeaderProps {
  userData: UserData | undefined;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  onRefresh: () => void;
  onStartNewRegister: () => void;
  showKpi: boolean;
  toggleKpi: () => void;
  activeFilterCount: number;
  onOpenFilter: () => void;
}

export const PrecisionNCRMobileHeader: React.FC<PrecisionNCRMobileHeaderProps> = ({
  isFullscreen,
  toggleFullscreen,
  onRefresh,
  onStartNewRegister,
  showKpi,
  toggleKpi,
  activeFilterCount,
  onOpenFilter,
}) => {
  return (
    <header className="precision-ncr-mobile-header">
      <div className="precision-ncr-mobile-header__left">
        <span className="precision-ncr-mobile-header__badge">NCR</span>
        <span className="precision-ncr-mobile-header__pulse">
          <span className="pulse-dot" />
          <span>Online</span>
        </span>
      </div>

      <div className="precision-ncr-mobile-header__right">
        {/* Toggle KPI */}
        <button
          className={`mobile-hdr-btn ${showKpi ? "active" : ""}`}
          onClick={toggleKpi}
          title="Hiện/Ẩn KPI"
        >
          <AiOutlineBarChart size={16} />
        </button>

        {/* Filter button with badge */}
        <button
          className="mobile-hdr-btn"
          onClick={onOpenFilter}
          title="Bộ lọc nâng cao"
        >
          <AiOutlineFilter size={16} />
          {activeFilterCount > 0 && (
            <span className="filter-badge">{activeFilterCount}</span>
          )}
        </button>

        {/* New NCR */}
        <button
          className="mobile-hdr-btn btn-accent"
          onClick={onStartNewRegister}
          title="Đăng ký NCR mới"
        >
          <AiOutlinePlus size={16} />
        </button>

        {/* Refresh */}
        <button
          className="mobile-hdr-btn"
          onClick={onRefresh}
          title="Tải lại dữ liệu"
        >
          <AiOutlineReload size={14} />
        </button>

        {/* Fullscreen */}
        <button
          className="mobile-hdr-btn"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
        >
          {isFullscreen ? (
            <AiOutlineFullscreenExit size={14} />
          ) : (
            <AiOutlineFullscreen size={14} />
          )}
        </button>
      </div>
    </header>
  );
};
