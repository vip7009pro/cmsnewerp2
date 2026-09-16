import React from "react";
import { RNRKpiMetrics } from "./rnrTypes";

interface Props {
  metrics: RNRKpiMetrics;
}

export const PrecisionRNRKpiDetail: React.FC<Props> = React.memo(({ metrics }) => {
  return (
    <>
      <div className="precision-rnr__kpiGrid">
        {/* Card 1: Total Questions */}
        <div className="precision-rnr__kpiCard precision-rnr__kpiCard--blue">
          <div className="precision-rnr__kpiHeader">
            <span className="precision-rnr__kpiTitle">Tổng Lượt Phép Đo / Câu Thi</span>
            <span className="material-symbols-outlined precision-rnr__kpiIcon">quiz</span>
          </div>
          <div className="precision-rnr__kpiValueRow">
            <span className="precision-rnr__kpiValue precision-rnr__kpiValue--blue">
              {metrics.totalQuestions.toLocaleString("en-US")}
            </span>
            <span className="precision-rnr__kpiSub">câu</span>
          </div>
          <div className="precision-rnr__kpiSub" style={{ marginTop: 4 }}>
            Số mã đề thi: <strong>{metrics.testCount}</strong> mã
          </div>
        </div>

        {/* Card 2: Accuracy Rate 1 */}
        <div className="precision-rnr__kpiCard precision-rnr__kpiCard--emerald">
          <div className="precision-rnr__kpiHeader">
            <span className="precision-rnr__kpiTitle">Độ Chính Xác Lần 1 (Accuracy 1)</span>
            <span className="material-symbols-outlined precision-rnr__kpiIcon">verified</span>
          </div>
          <div className="precision-rnr__kpiValueRow">
            <span className="precision-rnr__kpiValue precision-rnr__kpiValue--emerald">
              {metrics.accuracyRate1.toFixed(1)}%
            </span>
            <span className="precision-rnr__kpiSub">
              ({metrics.true1Count.toLocaleString("en-US")} / {metrics.eval1Count.toLocaleString("en-US")})
            </span>
          </div>
          <div className="precision-rnr__kpiProgress">
            <div
              className="progress-bar progress-bar--emerald"
              style={{ width: `${Math.min(100, metrics.accuracyRate1)}%` }}
            />
          </div>
        </div>

        {/* Card 3: Accuracy Rate 2 */}
        <div className="precision-rnr__kpiCard precision-rnr__kpiCard--purple">
          <div className="precision-rnr__kpiHeader">
            <span className="precision-rnr__kpiTitle">Độ Chính Xác Lần 2 (Accuracy 2)</span>
            <span className="material-symbols-outlined precision-rnr__kpiIcon">fact_check</span>
          </div>
          <div className="precision-rnr__kpiValueRow">
            <span className="precision-rnr__kpiValue precision-rnr__kpiValue--purple">
              {metrics.eval2Count > 0 ? `${metrics.accuracyRate2.toFixed(1)}%` : "N/A"}
            </span>
            <span className="precision-rnr__kpiSub">
              {metrics.eval2Count > 0 ? `(${metrics.true2Count} / ${metrics.eval2Count})` : "1 lần đo"}
            </span>
          </div>
          <div className="precision-rnr__kpiProgress">
            <div
              className="progress-bar progress-bar--blue"
              style={{ width: `${metrics.eval2Count > 0 ? Math.min(100, metrics.accuracyRate2) : 0}%` }}
            />
          </div>
        </div>

        {/* Card 4: Examinees Scope */}
        <div className="precision-rnr__kpiCard precision-rnr__kpiCard--amber">
          <div className="precision-rnr__kpiHeader">
            <span className="precision-rnr__kpiTitle">Phạm Vi Nhân Sự Kiểm Tra</span>
            <span className="material-symbols-outlined precision-rnr__kpiIcon">groups</span>
          </div>
          <div className="precision-rnr__kpiValueRow">
            <span className="precision-rnr__kpiValue precision-rnr__kpiValue--amber">
              {metrics.uniqueEmpls}
            </span>
            <span className="precision-rnr__kpiSub">nhân sự tham gia</span>
          </div>
          <div className="precision-rnr__kpiSub" style={{ marginTop: 4 }}>
            Mẫu chuẩn OK: <strong>{metrics.totalOkStandard}</strong> | NG: <strong>{metrics.totalNgStandard}</strong>
          </div>
        </div>
      </div>

      <div className="precision-rnr__strip">
        <div className="strip-item">
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#16a34a" }}>check_circle</span>
          <span>Mẫu chuẩn OK: <strong>{metrics.totalOkStandard.toLocaleString("en-US")}</strong></span>
        </div>
        <div className="strip-item">
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#dc2626" }}>cancel</span>
          <span>Mẫu chuẩn NG: <strong>{metrics.totalNgStandard.toLocaleString("en-US")}</strong></span>
        </div>
        <div className="strip-item">
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#2563eb" }}>assignment_turned_in</span>
          <span>Phán đoán đúng L1: <strong>{metrics.true1Count.toLocaleString("en-US")}</strong></span>
        </div>
        <div className="strip-item">
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#9333ea" }}>assignment</span>
          <span>Phán đoán đúng L2: <strong>{metrics.true2Count.toLocaleString("en-US")}</strong></span>
        </div>
      </div>
    </>
  );
});
