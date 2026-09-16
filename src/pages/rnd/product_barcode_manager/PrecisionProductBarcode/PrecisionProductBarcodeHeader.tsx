import React from "react";
import {
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
  AiOutlineReload,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
} from "react-icons/ai";

interface HeaderProps {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  onRefresh: () => void;
  isFormOpen: boolean;
  onToggleForm: () => void;
}

export const PrecisionProductBarcodeHeader: React.FC<HeaderProps> = React.memo(
  ({ isFullscreen, toggleFullscreen, onRefresh, isFormOpen, onToggleForm }) => {
    return (
      <header className="precision-barcode__header">
        <div className="precision-barcode__headerLeft">
          <button
            type="button"
            className="precision-barcode__iconBtn"
            onClick={onToggleForm}
            title={isFormOpen ? "Thu gọn form thiết lập" : "Mở rộng form thiết lập"}
          >
            {isFormOpen ? <AiOutlineMenuFold size={16} /> : <AiOutlineMenuUnfold size={16} />}
          </button>

          <span className="precision-barcode__brandBadge">
            <span>R&D</span>
            <span>•</span>
            <span>BARCODE</span>
          </span>

          <nav className="precision-barcode__breadcrumb">
            <span>02. R&D</span>
            <span className="sep">/</span>
            <span>QUẢN LÝ MÃ SẢN PHẨM</span>
            <span className="sep">/</span>
            <span className="current">THIẾT LẬP & TRỰC QUAN HÓA MÃ VẠCH (BARCODE / QR / 2D MATRIX)</span>
          </nav>

          <div className="precision-barcode__telemetry">
            <span className="dot" />
            <span>LIVE • BARCODE INTEL</span>
          </div>
        </div>

        <div className="precision-barcode__headerRight">
          <button
            type="button"
            className="precision-barcode__iconBtn"
            onClick={onRefresh}
            title="Tải lại danh sách mã vạch"
          >
            <AiOutlineReload size={15} />
          </button>

          <button
            type="button"
            className="precision-barcode__iconBtn"
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

PrecisionProductBarcodeHeader.displayName = "PrecisionProductBarcodeHeader";
