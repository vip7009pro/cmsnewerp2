import React from "react";
import moment from "moment";

interface PrecisionAchivementTbHeaderProps {
  factory: string;
  machine: string;
  fromdate: string;
}

export const PrecisionAchivementTbHeader: React.FC<
  PrecisionAchivementTbHeaderProps
> = ({ factory, machine, fromdate }) => {
  return (
    <div className="precision-achivementtb__header">
      <div className="header-left">
        <span className="brand-badge">03. SẢN XUẤT</span>
        <div className="header-title">
          <span>BẢNG TỶ LỆ ĐẠT KẾ HOẠCH SẢN XUẤT</span>
          <span className="sub-tag">
            [PRODUCTION ACHIEVEMENT RATE &amp; SHIFT PERFORMANCE]
          </span>
        </div>
      </div>

      <div className="header-right">
        <div className="telemetry-chip">
          <span className="pulse-dot" />
          <span>PHÂN XƯỞNG: <strong>{factory}</strong></span>
        </div>

        <div className="telemetry-chip">
          <span>THIẾT BỊ: <strong>{machine}</strong></span>
        </div>

        <div className="telemetry-chip">
          <span>NGÀY KẾ HOẠCH: <strong>{fromdate}</strong></span>
        </div>

        <div className="telemetry-chip">
          <span>CẬP NHẬT: <strong>{moment().format("HH:mm:ss")}</strong></span>
        </div>
      </div>
    </div>
  );
};
