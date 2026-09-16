import React from "react";
import {
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
  AiOutlineReload,
} from "react-icons/ai";

interface HeaderProps {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  onRefresh: () => void;
}

export const PrecisionRNDHeader: React.FC<HeaderProps> = React.memo(
  ({ isFullscreen, toggleFullscreen, onRefresh }) => {
    return (
      <header className="precision-rnd-report__header">
        <div className="precision-rnd-report__headerLeft">
          <span className="precision-rnd-report__brandBadge">
            <span>R&D</span>
            <span>•</span>
            <span>ANALYTICS</span>
          </span>

          <nav className="precision-rnd-report__breadcrumb">
            <span>02. R&D</span>
            <span className="sep">/</span>
            <span>BÁO CÁO ĐIỀU HÀNH</span>
            <span className="sep">/</span>
            <span className="current">TIẾN ĐỘ PHÁT TRIỂN MÃ MỚI & TIÊU CHUẨN KỸ THUẬT</span>
          </nav>

          <div className="precision-rnd-report__telemetry">
            <span className="dot" />
            <span>LIVE • R&D INTELLIGENCE</span>
          </div>
        </div>

        <div className="precision-rnd-report__headerRight">
          <button
            type="button"
            className="precision-rnd-report__iconBtn"
            onClick={onRefresh}
            title="Làm mới dữ liệu báo cáo"
          >
            <AiOutlineReload size={14} />
          </button>

          <button
            type="button"
            className="precision-rnd-report__iconBtn"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
          >
            {isFullscreen ? (
              <AiOutlineFullscreenExit size={15} />
            ) : (
              <AiOutlineFullscreen size={15} />
            )}
          </button>
        </div>
      </header>
    );
  }
);

PrecisionRNDHeader.displayName = "PrecisionRNDHeader";
