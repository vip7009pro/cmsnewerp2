import React from "react";
import { FiUsers } from "react-icons/fi";

interface PrecisionUserHeaderProps {
  totalCount: number;
  filteredCount: number;
}

export const PrecisionUserHeader: React.FC<PrecisionUserHeaderProps> = ({
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="precision-usermanager__header">
      <div className="precision-usermanager__titleBox">
        <div className="precision-usermanager__iconBadge">
          <FiUsers size={18} />
        </div>
        <div className="precision-usermanager__titleGroup">
          <span className="precision-usermanager__subTitle">
            HỆ THỐNG QUẢN TRỊ NHÂN SỰ & HỒ SƠ DOANH NGHIỆP
          </span>
          <h1 className="precision-usermanager__title">
            QUẢN LÝ HỒ SƠ NHÂN SỰ (NS1)
          </h1>
        </div>
      </div>

      <div className="precision-usermanager__telemetry">
        <div className="precision-usermanager__statusPill precision-usermanager__statusPill--server">
          <span className="pulse-dot" />
          <span>PORT 4370 CONNECTED</span>
          <span>•</span>
          <span>DIRECT SQL POOL</span>
        </div>

        <div className="precision-usermanager__statusPill precision-usermanager__statusPill--zkteco">
          <span>ZKTECO TCP/IP ACTIVE</span>
          <span>•</span>
          <b>{filteredCount} / {totalCount} HỒ SƠ</b>
        </div>
      </div>
    </div>
  );
};

export default PrecisionUserHeader;
