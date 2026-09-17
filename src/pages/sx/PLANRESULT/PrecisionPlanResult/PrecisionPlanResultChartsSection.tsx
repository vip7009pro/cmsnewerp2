import React from "react";
import { AiOutlineDownload } from "react-icons/ai";
import {
  DAILY_SX_DATA,
  MONTHLY_SX_DATA,
  SX_LOSS_TREND_DATA,
  WEEKLY_SX_DATA,
} from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import {
  DailyProductionResultChart,
  DailyProductionLossChart,
  WeeklyProductionChart,
  MonthlyProductionChart,
} from "./planResultChartRenderers";

interface PrecisionPlanResultChartsSectionProps {
  daily_sx_data: DAILY_SX_DATA[];
  sxlosstrendingdata: SX_LOSS_TREND_DATA[];
  weekly_sx_data: WEEKLY_SX_DATA[];
  monthly_sx_data: MONTHLY_SX_DATA[];
  fromdate: string;
  todate: string;
  machine: string;
  factory: string;
  onExportDailyResult?: () => void;
  onExportDailyLoss?: () => void;
  onExportWeekly?: () => void;
  onExportMonthly?: () => void;
}

export const PrecisionPlanResultChartsSection: React.FC<
  PrecisionPlanResultChartsSectionProps
> = ({
  daily_sx_data,
  sxlosstrendingdata,
  weekly_sx_data,
  monthly_sx_data,
  fromdate,
  todate,
  machine,
  factory,
  onExportDailyResult,
  onExportDailyLoss,
  onExportWeekly,
  onExportMonthly,
}) => {
  return (
    <div className="precision-planresult__chartsGrid">
      {/* 1. DAILY PRODUCTION RESULT CHART */}
      <div className="executive-card">
        <div className="card-header">
          <div className="header-title-box">
            <span className="main-title">1. TIẾN ĐỘ SẢN XUẤT THEO NGÀY</span>
            <span className="sub-title">
              DAILY PRODUCTION RESULT • [{fromdate} ~ {todate}]
            </span>
          </div>
          <div className="header-actions">
            {onExportDailyResult && (
              <button
                className="btn-card-action"
                onClick={onExportDailyResult}
                title="Xuất dữ liệu Excel"
              >
                <AiOutlineDownload size={13} />
                <span>EXCEL</span>
              </button>
            )}
          </div>
        </div>
        <div className="card-body">
          <DailyProductionResultChart
            data={daily_sx_data}
            fromdate={fromdate}
            todate={todate}
            machine={machine}
            factory={factory}
          />
        </div>
      </div>

      {/* 2. DAILY PRODUCTION LOSS TRENDING CHART */}
      <div className="executive-card">
        <div className="card-header">
          <div className="header-title-box">
            <span className="main-title">2. XU HƯỚNG HAO HỤT SẢN XUẤT THEO NGÀY</span>
            <span className="sub-title">
              DAILY LOSS TRENDING • [{fromdate} ~ {todate}]
            </span>
          </div>
          <div className="header-actions">
            {onExportDailyLoss && (
              <button
                className="btn-card-action"
                onClick={onExportDailyLoss}
                title="Xuất dữ liệu Excel"
              >
                <AiOutlineDownload size={13} />
                <span>EXCEL</span>
              </button>
            )}
          </div>
        </div>
        <div className="card-body">
          <DailyProductionLossChart
            data={sxlosstrendingdata}
            fromdate={fromdate}
            todate={todate}
            machine={machine}
            factory={factory}
          />
        </div>
      </div>

      {/* 3. WEEKLY PRODUCTION TRENDING CHART */}
      <div className="executive-card">
        <div className="card-header">
          <div className="header-title-box">
            <span className="main-title">3. XU HƯỚNG SẢN XUẤT THEO TUẦN</span>
            <span className="sub-title">
              WEEKLY PRODUCTION TRENDING • [{fromdate} ~ {todate}]
            </span>
          </div>
          <div className="header-actions">
            {onExportWeekly && (
              <button
                className="btn-card-action"
                onClick={onExportWeekly}
                title="Xuất dữ liệu Excel"
              >
                <AiOutlineDownload size={13} />
                <span>EXCEL</span>
              </button>
            )}
          </div>
        </div>
        <div className="card-body">
          <WeeklyProductionChart
            data={weekly_sx_data}
            fromdate={fromdate}
            todate={todate}
          />
        </div>
      </div>

      {/* 4. MONTHLY PRODUCTION TRENDING CHART */}
      <div className="executive-card">
        <div className="card-header">
          <div className="header-title-box">
            <span className="main-title">4. XU HƯỚNG SẢN XUẤT THEO THÁNG</span>
            <span className="sub-title">
              MONTHLY PRODUCTION TRENDING • NĂM TOÀN DIỆN
            </span>
          </div>
          <div className="header-actions">
            {onExportMonthly && (
              <button
                className="btn-card-action"
                onClick={onExportMonthly}
                title="Xuất dữ liệu Excel"
              >
                <AiOutlineDownload size={13} />
                <span>EXCEL</span>
              </button>
            )}
          </div>
        </div>
        <div className="card-body">
          <MonthlyProductionChart data={monthly_sx_data} />
        </div>
      </div>
    </div>
  );
};
