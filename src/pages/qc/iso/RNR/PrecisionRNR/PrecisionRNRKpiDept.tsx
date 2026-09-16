import React from "react";
import { RNRKpiMetrics } from "./rnrTypes";

interface Props {
  metrics: RNRKpiMetrics;
}

export const PrecisionRNRKpiDept: React.FC<Props> = React.memo(({ metrics }) => {
  return (
    <div className="precision-rnr__kpiGrid">
      <div className="precision-rnr__kpiCard precision-rnr__kpiCard--blue">
        <div className="precision-rnr__kpiHeader">
          <span className="precision-rnr__kpiTitle">Tổng Số Bộ Phận Đánh Giá</span>
          <span className="material-symbols-outlined precision-rnr__kpiIcon">corporate_fare</span>
        </div>
        <div className="precision-rnr__kpiValueRow">
          <span className="precision-rnr__kpiValue precision-rnr__kpiValue--blue">
            {metrics.totalDepts}
          </span>
          <span className="precision-rnr__kpiSub">phòng ban</span>
        </div>
        <div className="precision-rnr__kpiSub" style={{ marginTop: 4 }}>
          Quân số: <strong>{metrics.totalExaminees}</strong> nhân sự
        </div>
      </div>

      <div className="precision-rnr__kpiCard precision-rnr__kpiCard--emerald">
        <div className="precision-rnr__kpiHeader">
          <span className="precision-rnr__kpiTitle">Bộ Phận Dẫn Đầu Pass Rate</span>
          <span className="material-symbols-outlined precision-rnr__kpiIcon">military_tech</span>
        </div>
        <div className="precision-rnr__kpiValueRow">
          <span className="precision-rnr__kpiValue precision-rnr__kpiValue--emerald">
            {metrics.topDeptRate.toFixed(1)}%
          </span>
          <span className="precision-rnr__kpiSub">{metrics.topDeptName || "Chưa có"}</span>
        </div>
        <div className="precision-rnr__kpiProgress">
          <div
            className="progress-bar progress-bar--emerald"
            style={{ width: `${Math.min(100, metrics.topDeptRate)}%` }}
          />
        </div>
      </div>

      <div className="precision-rnr__kpiCard precision-rnr__kpiCard--amber">
        <div className="precision-rnr__kpiHeader">
          <span className="precision-rnr__kpiTitle">Điểm Trung Bình Toàn Xưởng</span>
          <span className="material-symbols-outlined precision-rnr__kpiIcon">speed</span>
        </div>
        <div className="precision-rnr__kpiValueRow">
          <span className="precision-rnr__kpiValue precision-rnr__kpiValue--amber">
            {metrics.overallAvgScore1.toFixed(1)}
          </span>
          <span className="precision-rnr__kpiSub">/ 100 điểm</span>
        </div>
        <div className="precision-rnr__kpiSub" style={{ marginTop: 4 }}>
          Thang điểm tiêu chuẩn $\ge 80$ điểm
        </div>
      </div>

      <div className="precision-rnr__kpiCard precision-rnr__kpiCard--rose">
        <div className="precision-rnr__kpiHeader">
          <span className="precision-rnr__kpiTitle">Bộ Phận Cần Cải Thiện</span>
          <span className="material-symbols-outlined precision-rnr__kpiIcon">warning</span>
        </div>
        <div className="precision-rnr__kpiValueRow">
          <span className="precision-rnr__kpiValue precision-rnr__kpiValue--rose">
            {metrics.lowestDeptRate.toFixed(1)}%
          </span>
          <span className="precision-rnr__kpiSub">{metrics.lowestDeptName || "Chưa có"}</span>
        </div>
        <div className="precision-rnr__kpiProgress">
          <div
            className="progress-bar progress-bar--rose"
            style={{ width: `${Math.min(100, metrics.lowestDeptRate)}%` }}
          />
        </div>
      </div>
    </div>
  );
});
