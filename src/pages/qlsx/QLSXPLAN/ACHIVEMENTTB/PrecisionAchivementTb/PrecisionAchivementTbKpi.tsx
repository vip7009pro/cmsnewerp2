import React, { useMemo } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineThunderbolt,
  AiOutlineTool,
  AiOutlineWarning,
  AiOutlineAppstore,
} from "react-icons/ai";
import { SX_ACHIVE_DATE } from "../../interfaces/khsxInterface";

interface PrecisionAchivementTbKpiProps {
  summaryData: SX_ACHIVE_DATE;
  planDataTable: SX_ACHIVE_DATE[];
}

export const PrecisionAchivementTbKpi: React.FC<
  PrecisionAchivementTbKpiProps
> = ({ summaryData, planDataTable }) => {
  const validRows = useMemo(
    () => planDataTable.filter((r) => r.EQ_NAME !== "TOTAL"),
    [planDataTable]
  );

  // 1. Toàn Ngày
  const totalRate = summaryData.TOTAL_RATE || 0;
  const deltaTotal = summaryData.RESULT_TOTAL - summaryData.PLAN_TOTAL;

  // 2. Ca Ngày
  const dayRate = summaryData.DAY_RATE || 0;
  const deltaDay = summaryData.RESULT_DAY - summaryData.PLAN_DAY;

  // 3. Ca Đêm
  const nightRate = summaryData.NIGHT_RATE || 0;
  const deltaNight = summaryData.RESULT_NIGHT - summaryData.PLAN_NIGHT;

  // 4. Quy mô sản xuất
  const totalOrders = validRows.length;
  const activeMachines = useMemo(
    () => new Set(validRows.map((r) => r.EQ_NAME).filter(Boolean)).size,
    [validRows]
  );

  // 5. Tình trạng định mức (Healthy vs Missing specs)
  const { goodSpecsCount, badSpecsCount } = useMemo(() => {
    let good = 0;
    let bad = 0;
    for (const r of validRows) {
      const row = r as any;
      if (
        row.FACTORY === null ||
        row.EQ1 === null ||
        row.EQ2 === null ||
        row.Setting1 === null ||
        row.Setting2 === null ||
        row.UPH1 === null ||
        row.UPH2 === null ||
        row.Step1 === null ||
        row.LOSS_SX1 === null ||
        row.LOSS_SX2 === null ||
        row.LOSS_SETTING1 === null ||
        row.LOSS_SETTING2 === null
      ) {
        bad++;
      } else {
        good++;
      }
    }
    return { goodSpecsCount: good, badSpecsCount: bad };
  }, [validRows]);

  // 6. Lệnh đạt 100%
  const completedOrders = useMemo(
    () => validRows.filter((r) => (r.TOTAL_RATE || 0) >= 100).length,
    [validRows]
  );
  const incompleteOrders = totalOrders - completedOrders;
  const orderSuccessRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  return (
    <div className="precision-achivementtb__kpiGrid">
      {/* THẺ 1: TIẾN ĐỘ TOÀN NGÀY */}
      <div className="kpi-card kpi-card--primary">
        <div className="kpi-card-header">
          <span className="card-label">TIẾN ĐỘ TOÀN NGÀY</span>
          <AiOutlineThunderbolt className="card-icon" />
        </div>
        <div className="kpi-card-body">
          <span
            className={`main-val ${
              totalRate >= 100
                ? "main-val--green"
                : totalRate >= 70
                ? "main-val--amber"
                : "main-val--red"
            }`}
          >
            {totalRate.toLocaleString("en-US", { maximumFractionDigits: 1 })}
          </span>
          <span className="unit">% ĐẠT</span>
        </div>
        <div className="kpi-card-progress">
          <div
            className={`progress-bar ${
              totalRate >= 100
                ? "progress-bar--green"
                : totalRate >= 70
                ? "progress-bar--amber"
                : "progress-bar--red"
            }`}
            style={{ width: `${Math.min(Math.max(totalRate, 0), 100)}%` }}
          />
        </div>
        <div className="kpi-card-footer">
          <span className="detail-text">
            {summaryData.RESULT_TOTAL.toLocaleString("en-US")} /{" "}
            {summaryData.PLAN_TOTAL.toLocaleString("en-US")} EA
          </span>
          <span
            className={`delta-tag ${
              deltaTotal >= 0 ? "delta-tag--plus" : "delta-tag--minus"
            }`}
          >
            {deltaTotal >= 0 ? "+" : ""}
            {deltaTotal.toLocaleString("en-US")}
          </span>
        </div>
      </div>

      {/* THẺ 2: CA NGÀY */}
      <div className="kpi-card kpi-card--success">
        <div className="kpi-card-header">
          <span className="card-label">CA NGÀY (DAY SHIFT)</span>
          <AiOutlineClockCircle className="card-icon" />
        </div>
        <div className="kpi-card-body">
          <span
            className={`main-val ${
              dayRate >= 100 ? "main-val--green" : "main-val--amber"
            }`}
          >
            {dayRate.toLocaleString("en-US", { maximumFractionDigits: 1 })}
          </span>
          <span className="unit">% ĐẠT</span>
        </div>
        <div className="kpi-card-progress">
          <div
            className={`progress-bar ${
              dayRate >= 100 ? "progress-bar--green" : "progress-bar--amber"
            }`}
            style={{ width: `${Math.min(Math.max(dayRate, 0), 100)}%` }}
          />
        </div>
        <div className="kpi-card-footer">
          <span className="detail-text">
            {summaryData.RESULT_DAY.toLocaleString("en-US")} /{" "}
            {summaryData.PLAN_DAY.toLocaleString("en-US")} EA
          </span>
          <span
            className={`delta-tag ${
              deltaDay >= 0 ? "delta-tag--plus" : "delta-tag--minus"
            }`}
          >
            {deltaDay >= 0 ? "+" : ""}
            {deltaDay.toLocaleString("en-US")}
          </span>
        </div>
      </div>

      {/* THẺ 3: CA ĐÊM */}
      <div className="kpi-card kpi-card--indigo">
        <div className="kpi-card-header">
          <span className="card-label">CA ĐÊM (NIGHT SHIFT)</span>
          <AiOutlineClockCircle className="card-icon" />
        </div>
        <div className="kpi-card-body">
          <span
            className={`main-val ${
              nightRate >= 100 ? "main-val--green" : "main-val--amber"
            }`}
          >
            {nightRate.toLocaleString("en-US", { maximumFractionDigits: 1 })}
          </span>
          <span className="unit">% ĐẠT</span>
        </div>
        <div className="kpi-card-progress">
          <div
            className={`progress-bar ${
              nightRate >= 100 ? "progress-bar--green" : "progress-bar--amber"
            }`}
            style={{ width: `${Math.min(Math.max(nightRate, 0), 100)}%` }}
          />
        </div>
        <div className="kpi-card-footer">
          <span className="detail-text">
            {summaryData.RESULT_NIGHT.toLocaleString("en-US")} /{" "}
            {summaryData.PLAN_NIGHT.toLocaleString("en-US")} EA
          </span>
          <span
            className={`delta-tag ${
              deltaNight >= 0 ? "delta-tag--plus" : "delta-tag--minus"
            }`}
          >
            {deltaNight >= 0 ? "+" : ""}
            {deltaNight.toLocaleString("en-US")}
          </span>
        </div>
      </div>

      {/* THẺ 4: QUY MÔ LỆNH & MÁY */}
      <div className="kpi-card kpi-card--amber">
        <div className="kpi-card-header">
          <span className="card-label">QUY MÔ SẢN XUẤT</span>
          <AiOutlineAppstore className="card-icon" />
        </div>
        <div className="kpi-card-body">
          <span className="main-val main-val--amber">{totalOrders}</span>
          <span className="unit">LỆNH KẾ HOẠCH</span>
        </div>
        <div className="kpi-card-progress">
          <div
            className="progress-bar progress-bar--blue"
            style={{ width: "100%" }}
          />
        </div>
        <div className="kpi-card-footer">
          <span className="detail-text">Thiết bị tham gia:</span>
          <span className="detail-text">
            <strong>{activeMachines}</strong> MÁY DẬP
          </span>
        </div>
      </div>

      {/* THẺ 5: CHẤT LƯỢNG ĐỊNH MỨC */}
      <div className="kpi-card kpi-card--purple">
        <div className="kpi-card-header">
          <span className="card-label">KHAI BÁO ĐỊNH MỨC</span>
          <AiOutlineTool className="card-icon" />
        </div>
        <div className="kpi-card-body">
          <span className="main-val main-val--green">{goodSpecsCount}</span>
          <span className="unit">/ {totalOrders} ĐỦ ĐM</span>
        </div>
        <div className="kpi-card-progress">
          <div
            className="progress-bar progress-bar--green"
            style={{
              width: `${
                totalOrders > 0 ? (goodSpecsCount / totalOrders) * 100 : 0
              }%`,
            }}
          />
        </div>
        <div className="kpi-card-footer">
          <span className="detail-text">Cần bổ sung ĐM:</span>
          <span
            className={`delta-tag ${
              badSpecsCount === 0 ? "delta-tag--plus" : "delta-tag--minus"
            }`}
          >
            {badSpecsCount} mã thiếu
          </span>
        </div>
      </div>

      {/* THẺ 6: LỆNH HOÀN THÀNH 100% */}
      <div className="kpi-card kpi-card--rose">
        <div className="kpi-card-header">
          <span className="card-label">TỶ LỆ LỆNH ĐẠT</span>
          <AiOutlineCheckCircle className="card-icon" />
        </div>
        <div className="kpi-card-body">
          <span className="main-val main-val--blue">
            {orderSuccessRate.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}
          </span>
          <span className="unit">% LỆNH ĐẠT</span>
        </div>
        <div className="kpi-card-progress">
          <div
            className="progress-bar progress-bar--blue"
            style={{ width: `${Math.min(orderSuccessRate, 100)}%` }}
          />
        </div>
        <div className="kpi-card-footer">
          <span className="detail-text">
            Đạt: <strong>{completedOrders}</strong>
          </span>
          <span className="detail-text">
            Chưa đạt: <strong>{incompleteOrders}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
