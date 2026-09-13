import React from "react";
import { FiCpu } from "react-icons/fi";

interface PrecisionTinhLieuHeaderProps {
  currentMode: "DETAIL" | "SUMMARY" | "PLAN";
  totalCount: number;
}

const PrecisionTinhLieuHeader: React.FC<PrecisionTinhLieuHeaderProps> = ({
  currentMode,
  totalCount,
}) => {
  const getModeLabel = () => {
    switch (currentMode) {
      case "DETAIL":
        return "MRP Chi Tiết (Detail)";
      case "SUMMARY":
        return "MRP Tổng Hợp (Summary)";
      case "PLAN":
        return "MRP Theo Kế Hoạch 15 Ngày (Plan 15D)";
      default:
        return "MRP Engine";
    }
  };

  return (
    <div className="precision-tinhlieu__header">
      <div className="precision-tinhlieu__headerLeft">
        <div className="precision-tinhlieu__iconBadge">
          <FiCpu size={18} />
        </div>
        <div className="precision-tinhlieu__titleBlock">
          <div className="precision-tinhlieu__titleRow">
            <h1 className="precision-tinhlieu__title">
              Tính Liệu Sản Xuất • MRP Engine
            </h1>
            <span className="precision-tinhlieu__codeBadge">M120</span>
            <span className="precision-tinhlieu__modeBadge">{getModeLabel()}</span>
          </div>
          <span className="precision-tinhlieu__breadcrumb">
            Hệ Thống ERP / Mua Hàng / Phân Tích & Phân Bổ Nhu Cầu Vật Liệu
          </span>
        </div>
      </div>

      <div className="precision-tinhlieu__headerRight">
        <div className="precision-tinhlieu__telemetryBadge">
          <span className="precision-tinhlieu__pulseDot" />
          <span>Hệ Thống Trực Tuyến ({totalCount.toLocaleString()} dòng)</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionTinhLieuHeader);
