import React from "react";
import { FiClock } from "react-icons/fi";

interface Props {
  totalCount: number;
}

export const PrecisionChamCongHeader: React.FC<Props> = ({ totalCount }) => {
  return (
    <div className="precision-chamcong__header">
      <div className="precision-chamcong__titleBox">
        <div className="precision-chamcong__iconBadge">
          <FiClock size={18} />
        </div>
        <div className="precision-chamcong__titleGroup">
          <span className="precision-chamcong__subTitle">
            01. NHÂN SỰ • HỆ THỐNG ĐỐI SOÁT CHẤM CÔNG NHÀ MÁY
          </span>
          <span className="precision-chamcong__title">
            BẢNG CHẤM CÔNG (ATTENDANCE MANAGEMENT)
          </span>
        </div>
      </div>

      <div className="precision-chamcong__telemetry">
        <span className="precision-chamcong__statusPill precision-chamcong__statusPill--server">
          <span className="pulse-dot"></span>
          NET_SERVER (15ms)
        </span>
        <span className="precision-chamcong__statusPill precision-chamcong__statusPill--zkteco">
          ZKTECO TCP/IP POOL ACTIVE
        </span>
      </div>
    </div>
  );
};

export default PrecisionChamCongHeader;
