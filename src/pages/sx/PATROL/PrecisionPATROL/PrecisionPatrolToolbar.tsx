import React from "react";
import { FiGrid, FiList, FiLayers, FiShield, FiCheckCircle } from "react-icons/fi";
import { PatrolFilterLane, PatrolLayoutMode, PatrolKpiStats } from "./usePatrolData";

interface PrecisionPatrolToolbarProps {
  layoutView: PatrolLayoutMode;
  onLayoutChange: (mode: PatrolLayoutMode) => void;
  filterLane: PatrolFilterLane;
  onFilterLaneChange: (filter: PatrolFilterLane) => void;
  kpis: PatrolKpiStats;
}

export const PrecisionPatrolToolbar: React.FC<PrecisionPatrolToolbarProps> = ({
  layoutView,
  onLayoutChange,
  filterLane,
  onFilterLaneChange,
  kpis,
}) => {
  return (
    <div className="precision-patrol-toolbar">
      <div className="precision-patrol-toolbar__left">
        <div className="segment-group">
          <button
            type="button"
            className={`segment-tab ${filterLane === "ALL" ? "active" : ""}`}
            onClick={() => onFilterLaneChange("ALL")}
            title="Hiển thị toàn bộ các phân hệ giám sát"
          >
            Tất Cả ({kpis.totalIncidents})
          </button>

          <button
            type="button"
            className={`segment-tab ${filterLane === "PQC3" ? "active" : ""}`}
            onClick={() => onFilterLaneChange("PQC3")}
            title="Chỉ hiển thị sự cố lỗi công đoạn PQC3"
          >
            <FiLayers size={12} /> PQC3 ({kpis.pqcCount})
          </button>

          <button
            type="button"
            className={`segment-tab ${filterLane === "DTC" ? "active" : ""}`}
            onClick={() => onFilterLaneChange("DTC")}
            title="Chỉ hiển thị kết quả thử nghiệm độ tin cậy DTC"
          >
            <FiShield size={12} /> DTC ({kpis.dtcCount})
          </button>

          <button
            type="button"
            className={`segment-tab ${filterLane === "INS" ? "active" : ""}`}
            onClick={() => onFilterLaneChange("INS")}
            title="Chỉ hiển thị kiểm tra ngoại quan nguyên liệu / phụ kiện"
          >
            <FiCheckCircle size={12} /> INS ({kpis.insCount})
          </button>
        </div>
      </div>

      <div className="precision-patrol-toolbar__right">
        <button
          type="button"
          className={`btn-view-mode ${layoutView === "LANES" ? "active" : ""}`}
          onClick={() => onLayoutChange("LANES")}
          title="Xem dạng hàng ngang theo từng phân hệ"
        >
          <FiList size={12} /> Hàng Ngang (Lanes)
        </button>

        <button
          type="button"
          className={`btn-view-mode ${layoutView === "GRID" ? "active" : ""}`}
          onClick={() => onLayoutChange("GRID")}
          title="Xem dạng lưới thẻ tổng hợp trực quan"
        >
          <FiGrid size={12} /> Lưới Thẻ (Grid)
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPatrolToolbar);
