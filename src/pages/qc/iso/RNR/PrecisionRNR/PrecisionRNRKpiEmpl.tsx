import React from "react";
import { RNRKpiMetrics } from "./rnrTypes";

interface Props {
  metrics: RNRKpiMetrics;
}

export const PrecisionRNRKpiEmpl: React.FC<Props> = React.memo(({ metrics }) => {
  return (
    <>
      <div className="precision-rnr__kpiGrid">
        {/* Card 1: Examinees */}
        <div className="precision-rnr__kpiCard precision-rnr__kpiCard--blue">
          <div className="precision-rnr__kpiHeader">
            <span className="precision-rnr__kpiTitle">Quân Số Tham Gia Dự Thi</span>
            <span className="material-symbols-outlined precision-rnr__kpiIcon">badge</span>
          </div>
          <div className="precision-rnr__kpiValueRow">
            <span className="precision-rnr__kpiValue precision-rnr__kpiValue--blue">
              {metrics.totalExaminees}
            </span>
            <span className="precision-rnr__kpiSub">thí sinh</span>
          </div>
          <div className="precision-rnr__kpiSub" style={{ marginTop: 4 }}>
            Thuộc <strong>{metrics.deptCount}</strong> phòng ban / bộ phận
          </div>
        </div>

        {/* Card 2: Pass Rate 1 */}
        <div className="precision-rnr__kpiCard precision-rnr__kpiCard--emerald">
          <div className="precision-rnr__kpiHeader">
            <span className="precision-rnr__kpiTitle">Tỷ Lệ Đạt Lần 1 (Pass Rate 1)</span>
            <span className="material-symbols-outlined precision-rnr__kpiIcon">verified_user</span>
          </div>
          <div className="precision-rnr__kpiValueRow">
            <span className="precision-rnr__kpiValue precision-rnr__kpiValue--emerald">
              {metrics.passRate1.toFixed(1)}%
            </span>
            <span className="precision-rnr__kpiSub">
              ({metrics.pass1Count} PASS / {metrics.fail1Count} FAIL)
            </span>
          </div>
          <div className="precision-rnr__kpiProgress">
            <div
              className="progress-bar progress-bar--emerald"
              style={{ width: `${Math.min(100, metrics.passRate1)}%` }}
            />
          </div>
        </div>

        {/* Card 3: Avg Score 1 */}
        <div className="precision-rnr__kpiCard precision-rnr__kpiCard--amber">
          <div className="precision-rnr__kpiHeader">
            <span className="precision-rnr__kpiTitle">Điểm Trung Bình Lần 1 (Score 1)</span>
            <span className="material-symbols-outlined precision-rnr__kpiIcon">analytics</span>
          </div>
          <div className="precision-rnr__kpiValueRow">
            <span className="precision-rnr__kpiValue precision-rnr__kpiValue--amber">
              {metrics.avgScore1.toFixed(1)}
            </span>
            <span className="precision-rnr__kpiSub">/ 100 điểm</span>
          </div>
          <div className="precision-rnr__kpiSub" style={{ marginTop: 4 }}>
            Cao nhất: <strong>{metrics.maxScore1}</strong> | Thấp nhất: <strong>{metrics.minScore1}</strong>
          </div>
        </div>

        {/* Card 4: Pass Rate 2 / Score 2 */}
        <div className="precision-rnr__kpiCard precision-rnr__kpiCard--purple">
          <div className="precision-rnr__kpiHeader">
            <span className="precision-rnr__kpiTitle">Đánh Giá Lần 2 (Gauge R&R)</span>
            <span className="material-symbols-outlined precision-rnr__kpiIcon">repeat</span>
          </div>
          <div className="precision-rnr__kpiValueRow">
            <span className="precision-rnr__kpiValue precision-rnr__kpiValue--purple">
              {metrics.passRate2 >= 0 ? `${metrics.passRate2.toFixed(1)}%` : "N/A"}
            </span>
            <span className="precision-rnr__kpiSub">
              {metrics.passRate2 >= 0 ? `(${metrics.pass2Count} PASS)` : "Không đo L2"}
            </span>
          </div>
          <div className="precision-rnr__kpiProgress">
            <div
              className="progress-bar progress-bar--blue"
              style={{ width: `${metrics.passRate2 >= 0 ? Math.min(100, metrics.passRate2) : 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="precision-rnr__strip">
        <div className="strip-item">
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#16a34a" }}>check_circle</span>
          <span>Số Thí Sinh Đạt (L1): <strong>{metrics.pass1Count}</strong> người</span>
        </div>
        <div className="strip-item">
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#dc2626" }}>cancel</span>
          <span>Số Thí Sinh Hỏng (L1): <strong>{metrics.fail1Count}</strong> người</span>
        </div>
        <div className="strip-item">
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#d97706" }}>report_problem</span>
          <span>Tỷ Lệ Bắt Nhầm TB: <strong>{(metrics.avgBNRate * 100).toFixed(2)}%</strong></span>
        </div>
        <div className="strip-item">
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#e11d48" }}>visibility_off</span>
          <span>Tỷ Lệ Bỏ Sót TB: <strong>{(metrics.avgBSRate * 100).toFixed(2)}%</strong></span>
        </div>
      </div>
    </>
  );
});
