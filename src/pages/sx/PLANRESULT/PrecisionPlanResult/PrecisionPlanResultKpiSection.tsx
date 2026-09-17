import React from "react";
import {
  ACHIVEMENT_DATA,
  MACHINE_LIST,
  OPERATION_TIME_DATA,
} from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { nFormatter } from "./planResultChartRenderers";

interface PrecisionPlanResultKpiSectionProps {
  sxachivementdata: ACHIVEMENT_DATA[];
  operation_time: OPERATION_TIME_DATA[];
  machine_list: MACHINE_LIST[];
  availableTime: number;
  dayrange: number;
  t_time_total: number;
}

export const PrecisionPlanResultKpiSection: React.FC<
  PrecisionPlanResultKpiSectionProps
> = ({
  sxachivementdata,
  operation_time,
  machine_list,
  availableTime,
  dayrange,
  t_time_total,
}) => {
  // Lấy dữ liệu TOTAL của Achivement
  const totalAchivement =
    sxachivementdata.find((ele) => ele.MACHINE_NAME === "TOTAL") || {
      ACHIVEMENT_RATE: 0,
      TOTAL_LOSS: 0,
      PLAN_QTY: 0,
      WH_OUTPUT: 0,
      SX_RESULT_TOTAL: 0,
      RESULT_TO_INSPECTION: 0,
      INS_INPUT: 0,
      INSPECT_TOTAL_QTY: 0,
      INSPECT_OK_QTY: 0,
      INSPECT_NG_QTY: 0,
      INS_OUTPUT: 0,
    };

  // Lấy dữ liệu TOTAL của Operation Time
  const totalOpTime =
    operation_time.find((ele) => ele.PLAN_FACTORY === "TOTAL") || {
      TOTAL_TIME: 0,
      RUN_TIME_SX: 0,
      SETTING_TIME: 0,
      LOSS_TIME: 0,
    };

  // Tính các chỉ số OEE
  const operationRate =
    t_time_total * dayrange > 0
      ? (totalOpTime.TOTAL_TIME / (t_time_total * dayrange)) * 100
      : 0;

  const prodEfficiency =
    totalOpTime.TOTAL_TIME > 0
      ? ((totalOpTime.RUN_TIME_SX - totalOpTime.LOSS_TIME + totalOpTime.SETTING_TIME) /
          totalOpTime.TOTAL_TIME) *
        100
      : 0;

  const eqEfficiency =
    totalOpTime.TOTAL_TIME > 0
      ? ((totalOpTime.RUN_TIME_SX - totalOpTime.LOSS_TIME) / totalOpTime.TOTAL_TIME) *
        100
      : 0;

  const runTimeActual = totalOpTime.RUN_TIME_SX - totalOpTime.LOSS_TIME;

  return (
    <div className="precision-planresult__kpiGrid">
      {/* KHỐI 1: TỶ LỆ ĐẠT KẾ HOẠCH THEO MÁY */}
      <div className="kpi-section-card">
        <div className="kpi-section-header">
          <span className="title">1. TIẾN ĐỘ ĐẠT KẾ HOẠCH THEO MÁY</span>
          <span className="badge-tag">ACHIEVEMENT RATE</span>
        </div>

        <div className="kpi-big-metric">
          <span className="val val--green">
            {totalAchivement.ACHIVEMENT_RATE?.toLocaleString("en-US", {
              maximumFractionDigits: 1,
            })}
          </span>
          <span className="unit">% TOÀN XƯỞNG</span>
        </div>

        <div className="machine-progress-list">
          {machine_list
            .filter(
              (ee) =>
                ee.EQ_NAME !== "NO" &&
                ee.EQ_NAME !== "NA" &&
                ee.EQ_NAME !== "ALL"
            )
            .map((machine, index) => {
              const machineAchive = sxachivementdata.find(
                (ele) => ele.MACHINE_NAME === machine.EQ_NAME
              );
              const rate = machineAchive?.ACHIVEMENT_RATE ?? 0;
              const fillClass =
                rate >= 80
                  ? "progress-fill--high"
                  : rate >= 50
                  ? "progress-fill--mid"
                  : "progress-fill--low";

              return (
                <div key={index} className="machine-progress-item">
                  <div className="label-row">
                    <span>{machine.EQ_NAME}</span>
                    <span className="rate-val">
                      {rate.toLocaleString("en-US", { maximumFractionDigits: 1 })}%
                    </span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div
                      className={`progress-fill ${fillClass}`}
                      style={{ width: `${Math.min(Math.max(rate, 0), 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* KHỐI 2: HAO HỤT SẢN XUẤT CÁC CÔNG ĐOẠN */}
      <div className="kpi-section-card">
        <div className="kpi-section-header">
          <span className="title">2. HAO HỤT SẢN XUẤT &amp; KIỂM TRA</span>
          <span className="badge-tag">PRODUCTION LOSS</span>
        </div>

        <div className="kpi-big-metric">
          <span className="val val--red">
            {totalAchivement.TOTAL_LOSS?.toLocaleString("en-US", {
              maximumFractionDigits: 1,
            })}
          </span>
          <span className="unit">% TỔNG HAO HỤT</span>
        </div>

        <div className="metric-pills-grid">
          <div className="metric-pill metric-pill--blue">
            <span className="pill-label">PLAN QTY</span>
            <span className="pill-val">{nFormatter(totalAchivement.PLAN_QTY)}</span>
          </div>

          <div className="metric-pill metric-pill--amber">
            <span className="pill-label">WH OUTPUT</span>
            <span className="pill-val">{nFormatter(totalAchivement.WH_OUTPUT)}</span>
          </div>

          <div className="metric-pill metric-pill--green">
            <span className="pill-label">RESULT TOTAL</span>
            <span className="pill-val">{nFormatter(totalAchivement.SX_RESULT_TOTAL)}</span>
          </div>

          <div className="metric-pill metric-pill--green">
            <span className="pill-label">RESULT INSP</span>
            <span className="pill-val">{nFormatter(totalAchivement.RESULT_TO_INSPECTION)}</span>
          </div>

          <div className="metric-pill metric-pill--purple">
            <span className="pill-label">INSP INPUT</span>
            <span className="pill-val">{nFormatter(totalAchivement.INS_INPUT)}</span>
          </div>

          <div className="metric-pill metric-pill--blue">
            <span className="pill-label">INSP TOTAL</span>
            <span className="pill-val">{nFormatter(totalAchivement.INSPECT_TOTAL_QTY)}</span>
          </div>

          <div className="metric-pill metric-pill--green">
            <span className="pill-label">INSP OK</span>
            <span className="pill-val">{nFormatter(totalAchivement.INSPECT_OK_QTY)}</span>
          </div>

          <div className="metric-pill metric-pill--rose">
            <span className="pill-label">INSP NG</span>
            <span className="pill-val">{nFormatter(totalAchivement.INSPECT_NG_QTY)}</span>
          </div>

          <div className="metric-pill metric-pill--green">
            <span className="pill-label">INSP OUTPUT</span>
            <span className="pill-val">{nFormatter(totalAchivement.INS_OUTPUT)}</span>
          </div>
        </div>
      </div>

      {/* KHỐI 3: HIỆU SUẤT THỜI GIAN & OEE */}
      <div className="kpi-section-card">
        <div className="kpi-section-header">
          <span className="title">3. HIỆU SUẤT THỜI GIAN &amp; VẬN HÀNH</span>
          <span className="badge-tag">EFFICIENCY &amp; OEE</span>
        </div>

        {/* 3 OEE Summary Cards */}
        <div className="metric-pills-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="metric-pill metric-pill--rose">
            <span className="pill-label">OPERATION RATE</span>
            <span className="pill-val">
              {operationRate.toLocaleString("en-US", { maximumFractionDigits: 1 })}%
            </span>
          </div>

          <div className="metric-pill metric-pill--purple">
            <span className="pill-label">PROD EFFICIENCY</span>
            <span className="pill-val">
              {prodEfficiency.toLocaleString("en-US", { maximumFractionDigits: 1 })}%
            </span>
          </div>

          <div className="metric-pill metric-pill--green">
            <span className="pill-label">EQ EFFICIENCY</span>
            <span className="pill-val">
              {eqEfficiency.toLocaleString("en-US", { maximumFractionDigits: 1 })}%
            </span>
          </div>
        </div>

        {/* 5 Time Detail Cards */}
        <div className="metric-pills-grid" style={{ marginTop: 4, gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="metric-pill metric-pill--blue">
            <span className="pill-label">AVLB TIME</span>
            <span className="pill-val">{nFormatter(availableTime * dayrange)} m</span>
          </div>

          <div className="metric-pill metric-pill--purple">
            <span className="pill-label">TT PROD TIME</span>
            <span className="pill-val">{nFormatter(totalOpTime.TOTAL_TIME)} m</span>
          </div>

          <div className="metric-pill metric-pill--amber">
            <span className="pill-label">SETTING TIME</span>
            <span className="pill-val">{nFormatter(totalOpTime.SETTING_TIME)} m</span>
          </div>

          <div className="metric-pill metric-pill--green">
            <span className="pill-label">RUN TIME</span>
            <span className="pill-val">{nFormatter(runTimeActual)} m</span>
          </div>

          <div className="metric-pill metric-pill--rose">
            <span className="pill-label">LOSS TIME</span>
            <span className="pill-val">{nFormatter(totalOpTime.LOSS_TIME)} m</span>
          </div>
        </div>
      </div>
    </div>
  );
};
