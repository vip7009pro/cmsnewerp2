import React from "react";
import { ViewMode } from "./useTinhHinhChotData";

interface PrecisionTinhHinhChotHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showCharts: boolean;
  onToggleCharts: () => void;
  isLoading: boolean;
  lastUpdated: string;
  onRefreshAll: () => void;
}

const PrecisionTinhHinhChotHeader: React.FC<PrecisionTinhHinhChotHeaderProps> = ({
  viewMode,
  onViewModeChange,
  showCharts,
  onToggleCharts,
  isLoading,
  lastUpdated,
  onRefreshAll,
}) => {
  return (
    <header className="precision-thc-header">
      {/* Khối bên trái: Breadcrumb, Badge & Title */}
      <div className="precision-thc-header__left">
        <div className="precision-thc-header__brand">
          <span className="badge-system">SX PRECISION</span>
          <span className="badge-sub">SX-CHOTBC</span>
        </div>
        <div className="precision-thc-header__title-group">
          <h1 className="precision-thc-header__title">
            Tình Hình Chốt Báo Cáo & Nhập Hiệu Suất Sản Xuất
          </h1>
          <div className="precision-thc-header__telemetry">
            <span className="telemetry-item">
              <span className="pulse-dot" />
              Realtime Sync
            </span>
            {lastUpdated && (
              <span className="telemetry-item">
                <span className="material-symbols-outlined icon">schedule</span>
                Cập nhật: {lastUpdated}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Khối bên phải: View Switcher, Toggle Charts & Refresh */}
      <div className="precision-thc-header__right">
        {/* Segmented View Mode */}
        <div className="precision-thc-segmented-view">
          <button
            type="button"
            className={`segmented-item ${viewMode === "SPLIT" ? "active" : ""}`}
            onClick={() => onViewModeChange("SPLIT")}
            title="Xem song song cả 2 nhà máy"
          >
            <span className="material-symbols-outlined icon">view_column</span>
            <span>Song Song</span>
          </button>
          <button
            type="button"
            className={`segmented-item ${viewMode === "NM1" ? "active" : ""}`}
            onClick={() => onViewModeChange("NM1")}
            title="Chỉ hiển thị Nhà Máy 1"
          >
            <span className="material-symbols-outlined icon">factory</span>
            <span>Nhà Máy 1</span>
          </button>
          <button
            type="button"
            className={`segmented-item ${viewMode === "NM2" ? "active" : ""}`}
            onClick={() => onViewModeChange("NM2")}
            title="Chỉ hiển thị Nhà Máy 2"
          >
            <span className="material-symbols-outlined icon">domain</span>
            <span>Nhà Máy 2</span>
          </button>
          <button
            type="button"
            className={`segmented-item ${viewMode === "CHARTS" ? "active" : ""}`}
            onClick={() => onViewModeChange("CHARTS")}
            title="Xem toàn màn hình biểu đồ xu hướng"
          >
            <span className="material-symbols-outlined icon">monitoring</span>
            <span>Biểu Đồ</span>
          </button>
        </div>

        {/* Nút bật/tắt biểu đồ nhanh khi ở chế độ thường */}
        {viewMode !== "CHARTS" && (
          <button
            type="button"
            className={`precision-thc-btn precision-thc-btn--ghost ${showCharts ? "active" : ""}`}
            onClick={onToggleCharts}
            title={showCharts ? "Thu gọn biểu đồ xu hướng" : "Hiển thị biểu đồ xu hướng"}
          >
            <span className="material-symbols-outlined icon">
              {showCharts ? "expand_less" : "analytics"}
            </span>
            <span>{showCharts ? "Ẩn Biểu Đồ" : "Hiện Biểu Đồ"}</span>
          </button>
        )}

        {/* Nút Làm Mới Toàn Bộ */}
        <button
          type="button"
          className="precision-thc-btn precision-thc-btn--primary"
          onClick={onRefreshAll}
          disabled={isLoading}
          title="Tải lại toàn bộ dữ liệu 2 nhà máy"
        >
          <span className={`material-symbols-outlined icon ${isLoading ? "spinning" : ""}`}>
            refresh
          </span>
          <span>{isLoading ? "Đang nạp..." : "Làm Mới"}</span>
        </button>
      </div>
    </header>
  );
};

export default React.memo(PrecisionTinhHinhChotHeader);
