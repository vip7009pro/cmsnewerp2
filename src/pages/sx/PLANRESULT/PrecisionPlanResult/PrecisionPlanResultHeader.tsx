import React from "react";
import moment from "moment";

interface PrecisionPlanResultHeaderProps {
  machineCount: number;
  factory: string;
  fromdate: string;
  todate: string;
}

export const PrecisionPlanResultHeader: React.FC<
  PrecisionPlanResultHeaderProps
> = ({ machineCount, factory, fromdate, todate }) => {
  return (
    <div className="precision-planresult__header">
      <div className="header-left">
        <span className="brand-badge">03. SẢN XUẤT</span>
        <div className="header-title">
          <span>BÁO CÁO ĐIỀU HÀNH HIỆU SUẤT SẢN XUẤT &amp; THỜI GIAN MÁY</span>
          <span className="sub-tag">
            [OEE &amp; PRODUCTION PERFORMANCE MANAGEMENT]
          </span>
        </div>
      </div>

      <div className="header-right">
        <div className="telemetry-chip">
          <span className="pulse-dot" />
          <span>PHÂN XƯỞNG: <strong>{factory}</strong></span>
        </div>

        <div className="telemetry-chip">
          <span>THIẾT BỊ: <strong>{machineCount}</strong> MÁY</span>
        </div>

        <div className="telemetry-chip">
          <span>CẬP NHẬT: <strong>{moment().format("HH:mm:ss")}</strong></span>
        </div>
      </div>
    </div>
  );
};
