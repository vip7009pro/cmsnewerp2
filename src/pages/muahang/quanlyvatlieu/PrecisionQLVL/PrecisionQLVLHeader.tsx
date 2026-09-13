import React from "react";
import { FiLayers } from "react-icons/fi";

interface PrecisionQLVLHeaderProps {
  totalCount: number;
}

const PrecisionQLVLHeader: React.FC<PrecisionQLVLHeaderProps> = ({ totalCount }) => {
  return (
    <div className="precision-qlvl__header">
      <div className="precision-qlvl__titleWrap">
        <div className="precision-qlvl__iconBadge">
          <FiLayers size={16} />
        </div>
        <div>
          <div className="precision-qlvl__title">
            <span>Quản Lý Vật Liệu (Material Master)</span>
            <span className="sub-code">M090</span>
          </div>
        </div>
      </div>

      <div className="precision-qlvl__telemetry">
        <span>Tổng mã: <strong>{totalCount.toLocaleString("en-US")}</strong></span>
        <div className="live-indicator">
          <span className="dot" />
          <span>Hệ Thống Trực Tuyến</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionQLVLHeader);
