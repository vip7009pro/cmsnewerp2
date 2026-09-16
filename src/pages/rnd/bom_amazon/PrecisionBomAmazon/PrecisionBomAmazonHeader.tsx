import React from "react";
import {
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
  AiOutlineReload,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
} from "react-icons/ai";
import { BsLayoutSidebarReverse } from "react-icons/bs";

interface HeaderProps {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  onRefresh: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isInfoPanelOpen: boolean;
  onToggleInfoPanel: () => void;
}

export const PrecisionBomAmazonHeader: React.FC<HeaderProps> = React.memo(
  ({
    isFullscreen,
    toggleFullscreen,
    onRefresh,
    isSidebarOpen,
    onToggleSidebar,
    isInfoPanelOpen,
    onToggleInfoPanel,
  }) => {
    return (
      <header className="precision-bom-amz__header">
        <div className="precision-bom-amz__headerLeft">
          <button
            type="button"
            className="precision-bom-amz__iconBtn"
            onClick={onToggleSidebar}
            title={isSidebarOpen ? "Thu gọn thanh danh mục trái" : "Mở rộng thanh danh mục trái"}
          >
            {isSidebarOpen ? <AiOutlineMenuFold size={16} /> : <AiOutlineMenuUnfold size={16} />}
          </button>

          <span className="precision-bom-amz__brandBadge">
            <span>R&D</span>
            <span>•</span>
            <span>AMAZON</span>
          </span>

          <nav className="precision-bom-amz__breadcrumb">
            <span>02. R&D</span>
            <span className="sep">/</span>
            <span>THIẾT KẾ & ĐỊNH MỨC</span>
            <span className="sep">/</span>
            <span className="current">QUẢN LÝ & THIẾT LẬP BOM AMAZON</span>
          </nav>

          <div className="precision-bom-amz__telemetry">
            <span className="dot" />
            <span>LIVE • BOM ENGINE</span>
          </div>
        </div>

        <div className="precision-bom-amz__headerRight">
          <button
            type="button"
            className="precision-bom-amz__iconBtn"
            onClick={onToggleInfoPanel}
            title={isInfoPanelOpen ? "Ẩn khung thông tin phụ bên phải" : "Hiện khung thông tin phụ bên phải"}
            style={{ color: isInfoPanelOpen ? "#2563eb" : "#475569" }}
          >
            <BsLayoutSidebarReverse size={15} />
          </button>

          <button
            type="button"
            className="precision-bom-amz__iconBtn"
            onClick={onRefresh}
            title="Làm mới danh sách sản phẩm"
          >
            <AiOutlineReload size={15} />
          </button>

          <button
            type="button"
            className="precision-bom-amz__iconBtn"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
          >
            {isFullscreen ? <AiOutlineFullscreenExit size={16} /> : <AiOutlineFullscreen size={16} />}
          </button>
        </div>
      </header>
    );
  }
);

PrecisionBomAmazonHeader.displayName = "PrecisionBomAmazonHeader";
