import React from "react";
import { AiOutlineBarChart } from "react-icons/ai";

interface PrecisionBaoCaoHeaderProps {
  totalCount?: number;
}

export const PrecisionBaoCaoHeader: React.FC<PrecisionBaoCaoHeaderProps> = ({ totalCount }) => {
  return (
    <header className="precision-baocao__header">
      <div className="precision-baocao__titleBox">
        <div className="precision-baocao__iconBadge">
          <AiOutlineBarChart size={20} />
        </div>
        <div className="precision-baocao__titleGroup">
          <span className="precision-baocao__subTitle">01. NHÂN SỰ & HÀNH CHÍNH</span>
          <h1 className="precision-baocao__title">
            NS6 - BÁO CÁO NHÂN SỰ & ĐIỂM DANH TỔNG HỢP
          </h1>
        </div>
      </div>

      <div className="precision-baocao__telemetry">
        <div className="precision-baocao__statusPill precision-baocao__statusPill--zkteco">
          <span className="pulse-dot" />
          <span>ZKTECO BIOMETRICS: 100% SYNC</span>
        </div>
        <div className="precision-baocao__statusPill precision-baocao__statusPill--realtime">
          <span>SOCKET REALTIME ACTIVE</span>
        </div>
      </div>
    </header>
  );
};

export default PrecisionBaoCaoHeader;
