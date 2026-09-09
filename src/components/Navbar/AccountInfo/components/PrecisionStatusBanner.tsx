import React, { useState, useEffect } from "react";
import moment from "moment";

interface PrecisionStatusBannerProps {
  shiftName?: string;
}

export default function PrecisionStatusBanner({
  shiftName = "CA SÁNG (08:00 - 17:00)",
}: PrecisionStatusBannerProps) {
  const [currentTime, setCurrentTime] = useState(moment().format("DD/MM/YYYY HH:mm:ss"));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format("DD/MM/YYYY HH:mm:ss"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="precision-hub__banner">
      <div className="precision-hub__bannerLeft">
        <span className="material-symbols-outlined precision-hub__bannerIcon">
          verified_user
        </span>
        <span className="precision-hub__bannerTitle">
          CỔNG THÔNG TIN NHÂN SỰ & CHẤM CÔNG CMS-ERP
        </span>
        <span className="precision-hub__bannerSep">|</span>
        <span className="precision-hub__bannerSub">
          Hồ sơ điện tử & Điểm danh thời gian thực
        </span>
      </div>

      <div className="precision-hub__bannerRight">
        <div className="precision-hub__shiftPill">
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "9999px",
              background: "#10b981",
              display: "inline-block",
            }}
          />
          <span>{shiftName}: HOẠT ĐỘNG</span>
        </div>

        <div className="precision-hub__syncTime">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            sync
          </span>
          <span>Đồng bộ: {currentTime} GMT+7</span>
        </div>
      </div>
    </div>
  );
}
