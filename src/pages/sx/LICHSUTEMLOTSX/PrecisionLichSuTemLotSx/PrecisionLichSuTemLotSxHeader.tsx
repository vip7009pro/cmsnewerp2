import React from "react";
import { FaSyncAlt, FaLayerGroup, FaTable, FaChartPie } from "react-icons/fa";

export type ViewMode = "ALL" | "GRID" | "CHARTS";

interface PrecisionLichSuTemLotSxHeaderProps {
  totalCount: number;
  filteredCount: number;
  totalQty: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const PrecisionLichSuTemLotSxHeader: React.FC<PrecisionLichSuTemLotSxHeaderProps> = ({
  totalCount,
  filteredCount,
  totalQty,
  viewMode,
  onViewModeChange,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <div className="precision-lichsutemlotsx__header">
      <div className="precision-lichsutemlotsx__headerLeft">
        <span className="precision-lichsutemlotsx__badge">04. SX PRECISION</span>
        <div className="precision-lichsutemlotsx__title">
          <span>LỊCH SỬ TEM LÓT SẢN XUẤT</span>
          <span className="breadcrumb-sep">•</span>
          <span className="sub-title">Tra Cứu, Giám Sát & In Tem Lót Công Đoạn</span>
        </div>
      </div>

      <div className="precision-lichsutemlotsx__headerRight">
        {/* Telemetry */}
        <div className="precision-lichsutemlotsx__telemetry">
          <span>
            Bản ghi: <strong>{filteredCount.toLocaleString("en-US")}</strong>
            {filteredCount !== totalCount && ` / ${totalCount.toLocaleString("en-US")}`}
          </span>
          <span>
            Tổng EA: <strong>{totalQty.toLocaleString("en-US")}</strong>
          </span>
        </div>

        {/* Segmented View Switcher */}
        <div className="precision-lichsutemlotsx__viewSwitcher">
          <button
            type="button"
            className={`precision-lichsutemlotsx__viewBtn ${viewMode === "ALL" ? "precision-lichsutemlotsx__viewBtn--active" : ""}`}
            onClick={() => onViewModeChange("ALL")}
            title="Xem toàn diện (Dashboard & Bảng dữ liệu)"
          >
            <FaLayerGroup size={11} />
            <span>Toàn Bộ</span>
          </button>
          <button
            type="button"
            className={`precision-lichsutemlotsx__viewBtn ${viewMode === "GRID" ? "precision-lichsutemlotsx__viewBtn--active" : ""}`}
            onClick={() => onViewModeChange("GRID")}
            title="Tập trung Bảng lưới dữ liệu"
          >
            <FaTable size={11} />
            <span>Bảng Lưới</span>
          </button>
          <button
            type="button"
            className={`precision-lichsutemlotsx__viewBtn ${viewMode === "CHARTS" ? "precision-lichsutemlotsx__viewBtn--active" : ""}`}
            onClick={() => onViewModeChange("CHARTS")}
            title="Tập trung Biểu đồ xu hướng"
          >
            <FaChartPie size={11} />
            <span>Biểu Đồ</span>
          </button>
        </div>

        {/* Nút Làm mới */}
        <button
          type="button"
          className="precision-lichsutemlotsx__refreshBtn"
          onClick={onRefresh}
          disabled={isLoading}
          title="Tải lại dữ liệu mới nhất"
        >
          <FaSyncAlt size={11} className={isLoading ? "fa-spin" : ""} />
          <span>Làm Mới</span>
        </button>
      </div>
    </div>
  );
};

export default PrecisionLichSuTemLotSxHeader;
