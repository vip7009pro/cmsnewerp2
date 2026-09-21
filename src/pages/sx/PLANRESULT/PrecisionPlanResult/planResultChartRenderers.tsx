import React from "react";
import moment from "moment";
import "../../../../theme/devextremeTheme";
import {
  Chart,
  Legend,
  Label,
  Series,
  Title,
  CommonSeriesSettings,
  Format,
  ArgumentAxis,
  ValueAxis,
} from "devextreme-react/chart";
import {
  DAILY_SX_DATA,
  MONTHLY_SX_DATA,
  SX_LOSS_TREND_DATA,
  WEEKLY_SX_DATA,
} from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

export const nFormatter = (num: number) => {
  if (!num) return "0";
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
};

interface DailyResultChartProps {
  data: DAILY_SX_DATA[];
  fromdate: string;
  todate: string;
  machine: string;
  factory: string;
}

export const DailyProductionResultChart: React.FC<DailyResultChartProps> = ({
  data,
  fromdate,
  todate,
  machine,
  factory,
}) => {
  return (
    <Chart
      id="dailyProductionResultChart"
      dataSource={data}
      height={420}
      resolveLabelOverlapping="hide"
    >
      <Title
        text="DAILY PRODUCTION RESULT"
        subtitle={`[${fromdate} ~ ${todate}] • [${machine}] • [${factory}]`}
      />
      <ArgumentAxis title="PRODUCTION DATE" />
      <ValueAxis name="quantity" position="left" title="QUANTITY (EA)" />
      <ValueAxis
        name="rate"
        position="right"
        title="Achivement Rate (%)"
        maxValueMargin={0.05}
      />
      <CommonSeriesSettings
        argumentField="SX_DATE"
        hoverMode="allArgumentPoints"
        selectionMode="allArgumentPoints"
      >
        <Label visible={true}>
          <Format type="fixedPoint" precision={0} />
        </Label>
      </CommonSeriesSettings>
      <Series
        axis="rate"
        argumentField="SX_DATE"
        valueField="RATE"
        name="ACHIVEMENT RATE"
        color="#16a34a"
        type="line"
      >
        <Label
          visible={true}
          customizeText={(e: any) =>
            `${e.value?.toLocaleString("en-US", { maximumFractionDigits: 0 })}%`
          }
        />
      </Series>
      <Series
        axis="quantity"
        argumentField="SX_DATE"
        valueField="PLAN_QTY"
        name="PLAN_QTY"
        color="#94a3b8"
        type="line"
      >
        <Label visible={true} customizeText={(e: any) => nFormatter(e.value)} />
      </Series>
      <Series
        axis="quantity"
        argumentField="SX_DATE"
        valueField="SX_RESULT"
        name="SX_RESULT"
        color="#0284c7"
        type="bar"
      >
        <Label visible={true} customizeText={(e: any) => nFormatter(e.value)} />
      </Series>
      <Legend verticalAlignment="bottom" horizontalAlignment="center" />
    </Chart>
  );
};

interface DailyLossChartProps {
  data: SX_LOSS_TREND_DATA[];
  fromdate: string;
  todate: string;
  machine: string;
  factory: string;
}

export const DailyProductionLossChart: React.FC<DailyLossChartProps> = ({
  data,
  fromdate,
  todate,
  machine,
  factory,
}) => {
  return (
    <Chart
      id="dailyProductionLossChart"
      dataSource={data}
      height={420}
      resolveLabelOverlapping="hide"
    >
      <Title
        text="DAILY PRODUCTION LOSS TRENDING"
        subtitle={`[${fromdate} ~ ${todate}] • [${machine}] • [${factory}]`}
      />
      <ArgumentAxis title="PRODUCTION DATE" />
      <ValueAxis name="percentage" position="left" title="Loss (%)" />
      <ValueAxis name="percentage2" position="right" title="Rate1 (%)" />
      <CommonSeriesSettings
        argumentField="INPUT_DATE"
        hoverMode="allArgumentPoints"
        selectionMode="allArgumentPoints"
      >
        <Label visible={true}>
          <Format type="fixedPoint" precision={0} />
        </Label>
      </CommonSeriesSettings>
      <Series
        axis="percentage"
        argumentField="INPUT_DATE"
        valueField="LOSS_ST"
        name="SETTING LOSS"
        color="#16a34a"
        type="line"
      >
        <Label
          visible={true}
          customizeText={(e: any) =>
            `${e.value?.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`
          }
        />
      </Series>
      <Series
        axis="percentage"
        argumentField="INPUT_DATE"
        valueField="LOSS_SX"
        name="SX LOSS"
        color="#c026d3"
        type="line"
      >
        <Label
          visible={true}
          customizeText={(e: any) =>
            `${e.value?.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`
          }
        />
      </Series>
      <Series
        axis="percentage2"
        argumentField="INPUT_DATE"
        valueField="RATE1"
        name="RATE1"
        color="#f59e0b"
        type="bar"
      >
        <Label
          visible={true}
          customizeText={(e: any) =>
            `${e.value?.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`
          }
        />
      </Series>
      <Legend verticalAlignment="bottom" horizontalAlignment="center" />
    </Chart>
  );
};

interface WeeklyChartProps {
  data: WEEKLY_SX_DATA[];
  fromdate: string;
  todate: string;
}

export const WeeklyProductionChart: React.FC<WeeklyChartProps> = ({
  data,
  fromdate,
  todate,
}) => {
  return (
    <Chart
      id="weeklyProductionChart"
      dataSource={data}
      height={420}
      resolveLabelOverlapping="hide"
    >
      <Title
        text="WEEKLY PRODUCTION TRENDING"
        subtitle={`[${fromdate} ~ ${todate}]`}
      />
      <ArgumentAxis title="PRODUCTION WEEK" allowDecimals={false} />
      <ValueAxis name="quantity" position="left" title="QUANTITY (EA)" />
      <ValueAxis
        name="rate"
        position="right"
        title="Achivement Rate (%)"
        maxValueMargin={0.05}
      />
      <CommonSeriesSettings argumentField="SX_WEEK" type="stackedBar">
        <Label visible={true}>
          <Format type="fixedPoint" precision={0} />
        </Label>
      </CommonSeriesSettings>
      <Series
        axis="rate"
        argumentField="SX_WEEK"
        valueField="RATE"
        name="ACHIVEMENT RATE"
        color="#16a34a"
        type="line"
      >
        <Label
          visible={true}
          customizeText={(e: any) =>
            `${e.value?.toLocaleString("en-US", { maximumFractionDigits: 0 })}%`
          }
        />
      </Series>
      <Series
        axis="quantity"
        argumentField="SX_WEEK"
        valueField="PLAN_QTY"
        name="PLAN_QTY"
        color="#94a3b8"
        type="line"
      >
        <Label visible={true} customizeText={(e: any) => nFormatter(e.value)} />
      </Series>
      <Series
        axis="quantity"
        argumentField="SX_WEEK"
        valueField="SX_RESULT"
        name="SX_RESULT"
        color="#f97316"
        type="bar"
      >
        <Label visible={true} customizeText={(e: any) => nFormatter(e.value)} />
      </Series>
      <Legend verticalAlignment="bottom" horizontalAlignment="center" />
    </Chart>
  );
};

interface MonthlyChartProps {
  data: MONTHLY_SX_DATA[];
}

export const MonthlyProductionChart: React.FC<MonthlyChartProps> = ({ data }) => {
  return (
    <Chart
      id="monthlyProductionChart"
      dataSource={data}
      height={420}
      resolveLabelOverlapping="stack"
    >
      <Title
        text="MONTHLY PRODUCTION TRENDING"
        subtitle={`[Năm ${moment().format("YYYY")}]`}
      />
      <ArgumentAxis title="PRODUCTION MONTH" />
      <ValueAxis name="quantity" position="left" title="QUANTITY (EA)" />
      <ValueAxis
        name="rate"
        position="right"
        title="Achivement Rate (%)"
        maxValueMargin={0.05}
      />
      <CommonSeriesSettings argumentField="SX_MONTH" type="stackedBar">
        <Label visible={true}>
          <Format type="fixedPoint" precision={0} />
        </Label>
      </CommonSeriesSettings>
      <Series
        axis="rate"
        argumentField="SX_MONTH"
        valueField="RATE"
        name="ACHIVEMENT RATE"
        color="#16a34a"
        type="line"
      >
        <Label
          visible={true}
          customizeText={(e: any) =>
            `${e.value?.toLocaleString("en-US", { maximumFractionDigits: 0 })}%`
          }
        />
      </Series>
      <Series
        axis="quantity"
        argumentField="SX_MONTH"
        valueField="PLAN_QTY"
        name="PLAN_QTY"
        color="#94a3b8"
        type="line"
      >
        <Label visible={true} customizeText={(e: any) => nFormatter(e.value)} />
      </Series>
      <Series
        axis="quantity"
        argumentField="SX_MONTH"
        valueField="SX_RESULT"
        name="SX_RESULT"
        color="#ec4899"
        type="bar"
      >
        <Label visible={true} customizeText={(e: any) => nFormatter(e.value)} />
      </Series>
      <Legend verticalAlignment="bottom" horizontalAlignment="center" />
    </Chart>
  );
};
