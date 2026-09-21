import React from "react";
import { FiBarChart2, FiTrendingUp, FiDownload, FiCalendar } from "react-icons/fi";
import "../../../../theme/devextremeTheme";
import { Chart } from "devextreme-react";
import { ArgumentAxis, CommonSeriesSettings, Format, Label, Legend, Series, Title, ValueAxis } from "devextreme-react/chart";
import { SaveExcel } from "../../../../api/services/excelService";
import SX_DailyLossTrend from "../../../../components/Chart/SX/SX_DailyLossTrend";
import SX_WeeklyLossTrend from "../../../../components/Chart/SX/SX_WeeklyLossTrend";
import SX_MonthlyLossTrend from "../../../../components/Chart/SX/SX_MonthlyLossTrend";
import SX_YearlyLossTrend from "../../../../components/Chart/SX/SX_YearlyLossTrend";
import { SX_LOSS_TREND_DATA, SX_TREND_LOSS_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

interface Props {
  sxlosstrendingdata: SX_LOSS_TREND_DATA[];
  dailyLossTrend: SX_TREND_LOSS_DATA[];
  weeklyLossTrend: SX_TREND_LOSS_DATA[];
  monthyLossTrend: SX_TREND_LOSS_DATA[];
  yearlyLossTrend: SX_TREND_LOSS_DATA[];
  fromdate: string;
  todate: string;
  machine: string;
  factory: string;
}

const PrecisionBaoCaoRollCharts: React.FC<Props> = ({
  sxlosstrendingdata, dailyLossTrend, weeklyLossTrend,
  monthyLossTrend, yearlyLossTrend,
  fromdate, todate, machine, factory,
}) => {
  const pctLabel = (e: any) => `${e.value.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;

  return (
    <div className="precision-bcr-section">
      <div className="precision-bcr-section__header">
        <div className="section-badge-title">
          <span className="icon-circle"><FiBarChart2 /></span>
          <span>Biểu Đồ Hao Hụt Sản Xuất (Production Loss Analytics)</span>
        </div>
      </div>

      {/* 1. Daily Production Loss Trending (DevExtreme) */}
      <div className="executive-card">
        <div className="executive-card__header">
          <div className="executive-card__title-wrap">
            <FiTrendingUp size={13} color="#2563eb" />
            <span className="executive-card__title">Daily Production Loss Trending</span>
          </div>
          <button type="button" className="executive-card__btn-excel"
            onClick={() => SaveExcel(sxlosstrendingdata, "DailyLossTrending")} title="Xuất Excel">
            <FiDownload size={11} /><span>Excel</span>
          </button>
        </div>
        <div className="executive-card__body" style={{ overflowX: "auto" }}>
          <Chart
            id="workforcechart"
            dataSource={sxlosstrendingdata}
            height={400}
            width="100%"
            resolveLabelOverlapping="stack"
          >
            <Title text="DAILY PRODUCTION LOSS TRENDING" subtitle={`[${fromdate} ~ ${todate}] [${machine}] -[${factory}]`} />
            <ArgumentAxis title="PRODUCTION DATE" />
            <ValueAxis position="left" title="Loss (%)" />
            <CommonSeriesSettings argumentField="INPUT_DATE" hoverMode="allArgumentPoints" selectionMode="allArgumentPoints">
              <Label visible={true}><Format type="fixedPoint" precision={0} /></Label>
            </CommonSeriesSettings>
            <Series argumentField="INPUT_DATE" valueField="LOSS_ST" name="SETTING LOSS" color="#019623" type="line">
              <Label visible={true} customizeText={pctLabel} />
            </Series>
            <Series argumentField="INPUT_DATE" valueField="LOSS_SX" name="SX LOSS" color="#ce45ed" type="line">
              <Label visible={true} customizeText={pctLabel} />
            </Series>
            <Series argumentField="INPUT_DATE" valueField="LOSS_TT" name="LOSS_TT" color="#f5aa42" type="bar">
              <Label visible={true} customizeText={pctLabel} />
            </Series>
            <Legend verticalAlignment="bottom" horizontalAlignment="center" />
          </Chart>
        </div>
      </div>

      {/* 2. Loss Trend Charts (Recharts) — 2x2 grid */}
      <div className="two-col-grid">
        {/* Daily */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiCalendar size={13} color="#2563eb" />
              <span className="executive-card__title">Daily Loss Trend (Xu Hướng Ngày)</span>
            </div>
            <button type="button" className="executive-card__btn-excel"
              onClick={() => SaveExcel(dailyLossTrend, "DailyLossTrend")} title="Xuất Excel">
              <FiDownload size={11} /><span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <SX_DailyLossTrend dldata={dailyLossTrend} processColor="#53eb34" materialColor="#ff0000" />
          </div>
        </div>

        {/* Weekly */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiBarChart2 size={13} color="#059669" />
              <span className="executive-card__title">Weekly Loss Trend (Xu Hướng Tuần)</span>
            </div>
            <button type="button" className="executive-card__btn-excel"
              onClick={() => SaveExcel(weeklyLossTrend, "WeeklyLossTrend")} title="Xuất Excel">
              <FiDownload size={11} /><span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <SX_WeeklyLossTrend dldata={[...weeklyLossTrend].reverse()} processColor="#53eb34" materialColor="#ff0000" />
          </div>
        </div>

        {/* Monthly */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiCalendar size={13} color="#d97706" />
              <span className="executive-card__title">Monthly Loss Trend (Xu Hướng Tháng)</span>
            </div>
            <button type="button" className="executive-card__btn-excel"
              onClick={() => SaveExcel(monthyLossTrend, "MonthlyLossTrend")} title="Xuất Excel">
              <FiDownload size={11} /><span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <SX_MonthlyLossTrend dldata={[...monthyLossTrend].reverse()} processColor="#53eb34" materialColor="#ff0000" />
          </div>
        </div>

        {/* Yearly */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiBarChart2 size={13} color="#dc2626" />
              <span className="executive-card__title">Yearly Loss Trend (Xu Hướng Năm)</span>
            </div>
            <button type="button" className="executive-card__btn-excel"
              onClick={() => SaveExcel(yearlyLossTrend, "YearlyLossTrend")} title="Xuất Excel">
              <FiDownload size={11} /><span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <SX_YearlyLossTrend dldata={[...yearlyLossTrend].reverse()} processColor="#53eb34" materialColor="#ff0000" />
          </div>
        </div>
      </div>
    </div>
  );
};

const MemoizedPrecisionBaoCaoRollCharts = React.memo(PrecisionBaoCaoRollCharts);
export { MemoizedPrecisionBaoCaoRollCharts as PrecisionBaoCaoRollCharts };
export default MemoizedPrecisionBaoCaoRollCharts;
