import React, { useMemo } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { SX_ACHIVE_DATE } from "../../interfaces/khsxInterface";

interface PrecisionAchivementTbMobileKpiProps {
  summaryData: SX_ACHIVE_DATE;
  planDataTable: SX_ACHIVE_DATE[];
  onClose: () => void;
}

export const PrecisionAchivementTbMobileKpi: React.FC<
  PrecisionAchivementTbMobileKpiProps
> = ({ summaryData, planDataTable, onClose }) => {
  const validRows = useMemo(
    () => planDataTable.filter((r) => r.EQ_NAME !== "TOTAL"),
    [planDataTable]
  );

  // 1. Toàn Ngày
  const totalRate = summaryData.TOTAL_RATE || 0;
  const deltaTotal = summaryData.RESULT_TOTAL - summaryData.PLAN_TOTAL;

  // 2. Ca Ngày
  const dayRate = summaryData.DAY_RATE || 0;

  // 3. Ca Đêm
  const nightRate = summaryData.NIGHT_RATE || 0;

  // 4. Quy mô sản xuất
  const totalOrders = validRows.length;
  const activeMachines = useMemo(
    () => new Set(validRows.map((r) => r.EQ_NAME).filter(Boolean)).size,
    [validRows]
  );

  // 5. Tình trạng định mức
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
  const orderSuccessRate =
    totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  return (
    <div className="precision-achivementtb__mobileKpi">
      <div className="mobileKpi-scroll">
        {/* Chip 1: Tiến độ toàn ngày */}
        <div className="kpi-mini-card kpi-mini-card--total">
          <div className="kpi-mini-header">
            <span className="dot dot--primary" />
            <span className="label">TOÀN NGÀY</span>
          </div>
          <div className="kpi-mini-body">
            <span
              className={`rate-val ${
                totalRate >= 100
                  ? "val--green"
                  : totalRate >= 70
                  ? "val--amber"
                  : "val--red"
              }`}
            >
              {totalRate.toFixed(1)}%
            </span>
            <span className="count-val">
              {summaryData.RESULT_TOTAL.toLocaleString("en-US")} /{" "}
              {summaryData.PLAN_TOTAL.toLocaleString("en-US")}
            </span>
            <span
              className={`delta-mini ${
                deltaTotal >= 0 ? "delta--plus" : "delta--minus"
              }`}
            >
              {deltaTotal >= 0 ? "+" : ""}
              {deltaTotal.toLocaleString("en-US")}
            </span>
          </div>
        </div>

        {/* Chip 2: Ca ngày */}
        <div className="kpi-mini-card">
          <div className="kpi-mini-header">
            <span className="dot dot--success" />
            <span className="label">CA NGÀY</span>
          </div>
          <div className="kpi-mini-body">
            <span
              className={`rate-val ${
                dayRate >= 100 ? "val--green" : "val--amber"
              }`}
            >
              {dayRate.toFixed(1)}%
            </span>
            <span className="count-val">
              {summaryData.RESULT_DAY.toLocaleString("en-US")} /{" "}
              {summaryData.PLAN_DAY.toLocaleString("en-US")}
            </span>
          </div>
        </div>

        {/* Chip 3: Ca đêm */}
        <div className="kpi-mini-card">
          <div className="kpi-mini-header">
            <span className="dot dot--indigo" />
            <span className="label">CA ĐÊM</span>
          </div>
          <div className="kpi-mini-body">
            <span
              className={`rate-val ${
                nightRate >= 100 ? "val--green" : "val--amber"
              }`}
            >
              {nightRate.toFixed(1)}%
            </span>
            <span className="count-val">
              {summaryData.RESULT_NIGHT.toLocaleString("en-US")} /{" "}
              {summaryData.PLAN_NIGHT.toLocaleString("en-US")}
            </span>
          </div>
        </div>

        {/* Chip 4: Quy mô lệnh & máy */}
        <div className="kpi-mini-card">
          <div className="kpi-mini-header">
            <span className="dot dot--amber" />
            <span className="label">QUY MÔ</span>
          </div>
          <div className="kpi-mini-body">
            <span className="rate-val val--blue">{totalOrders}</span>
            <span className="count-val">Lệnh ({activeMachines} Máy)</span>
          </div>
        </div>

        {/* Chip 5: Tình trạng định mức */}
        <div className="kpi-mini-card">
          <div className="kpi-mini-header">
            <span className="dot dot--purple" />
            <span className="label">ĐỊNH MỨC</span>
          </div>
          <div className="kpi-mini-body">
            <span className="rate-val val--green">{goodSpecsCount}</span>
            <span className="count-val">
              Đủ {badSpecsCount > 0 ? `(${badSpecsCount} thiếu)` : ""}
            </span>
          </div>
        </div>

        {/* Chip 6: Tỷ lệ lệnh đạt 100% */}
        <div className="kpi-mini-card">
          <div className="kpi-mini-header">
            <span className="dot dot--rose" />
            <span className="label">LỆNH ĐẠT</span>
          </div>
          <div className="kpi-mini-body">
            <span className="rate-val val--blue">
              {orderSuccessRate.toFixed(0)}%
            </span>
            <span className="count-val">
              {completedOrders} / {totalOrders} Đạt
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="kpi-close-btn"
        onClick={onClose}
        title="Thu gọn dải chỉ số"
      >
        <AiOutlineClose size={13} />
      </button>
    </div>
  );
};
