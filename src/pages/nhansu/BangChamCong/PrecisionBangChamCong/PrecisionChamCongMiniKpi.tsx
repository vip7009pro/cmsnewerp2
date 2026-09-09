import React, { useMemo } from "react";
import { BANGCHAMCONG_DATA2 } from "../../interfaces/nhansuInterface";
interface Props {
  data: BANGCHAMCONG_DATA2[];
}

export const PrecisionChamCongMiniKpi: React.FC<Props> = ({ data }) => {
  const stats = useMemo(() => {
    let onTime = 0;
    let missIn = 0;
    let missOut = 0;
    let working = 0;

    data.forEach((row) => {
      const isInValid = row.IN_TIME && !row.IN_TIME.includes("Thiếu") && row.IN_TIME !== "OFF";
      const isOutValid = row.OUT_TIME && !row.OUT_TIME.includes("Thiếu") && row.OUT_TIME !== "OFF";

      if (row.IN_TIME && row.IN_TIME.includes("Thiếu giờ vào")) {
        missIn++;
      }
      if (row.OUT_TIME && row.OUT_TIME.includes("Thiếu giờ ra")) {
        missOut++;
      }
      if (isInValid && isOutValid) {
        onTime++;
      }
      if (isInValid || isOutValid) {
        working++;
      }
    });

    return {
      total: data.length,
      onTime,
      missIn,
      missOut,
      working,
    };
  }, [data]);

  return (
    <div className="precision-chamcong__miniKpiBar">
      <div className="precision-chamcong__kpiPills">
        <div className="precision-chamcong__kpiItem">
          <span className="dot dot--total"></span>
          <span>
            Tổng số nhân sự:{" "}
            <strong className="val val--total">{stats.total}</strong>
          </span>
        </div>

        <div className="precision-chamcong__kpiItem">
          <span className="dot dot--onTime"></span>
          <span>
            Đúng giờ:{" "}
            <strong className="val val--onTime">{stats.onTime}</strong>
          </span>
        </div>

        <div className="precision-chamcong__kpiItem">
          <span className="dot dot--missIn"></span>
          <span>
            Thiếu giờ vào:{" "}
            <strong className="val val--missIn">{stats.missIn}</strong>
          </span>
        </div>

        <div className="precision-chamcong__kpiItem">
          <span className="dot dot--missOut"></span>
          <span>
            Thiếu giờ ra:{" "}
            <strong className="val val--missOut">{stats.missOut}</strong>
          </span>
        </div>

        <div className="precision-chamcong__kpiItem">
          <span className="dot dot--working"></span>
          <span>
            Đang làm việc:{" "}
            <strong className="val val--working">{stats.working}</strong>
          </span>
        </div>
      </div>

      <div className="precision-chamcong__kpiMeta">
        <span>Thời gian đối soát: <strong>Hôm nay</strong></span>
        <span>•</span>
        <span>Máy quẹt thẻ: <strong>Đồng bộ TCP/IP</strong></span>
      </div>
    </div>
  );
};

export default PrecisionChamCongMiniKpi;
