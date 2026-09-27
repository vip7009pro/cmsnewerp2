import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  DaoFilmReportPieData,
  DaoFilmReportWidgetData,
} from "../../utils/daoFilmReportUtils";
import { exportColors, usageColors } from "./useDaoFilmReportData";

interface PrecisionDaoFilmReportDesktopTopProps {
  widgetData: DaoFilmReportWidgetData;
  usagePieData: DaoFilmReportPieData[];
  exportPieData: DaoFilmReportPieData[];
  totalUsagePie: number;
  totalExportPie: number;
}

export const renderPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="daoFilmPieTooltip">
        <p>{payload[0].name}</p>
        <p>{`${Number(payload[0].value ?? 0).toLocaleString("en-US")} dao`}</p>
      </div>
    );
  }
  return null;
};

export const renderPieLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, name, percent, value, fill } = props;
  const RADIAN = Math.PI / 180;
  const startX = cx + outerRadius * Math.cos(-midAngle * RADIAN);
  const startY = cy + outerRadius * Math.sin(-midAngle * RADIAN);
  const endX = cx + (outerRadius + 14) * Math.cos(-midAngle * RADIAN);
  const endY = cy + (outerRadius + 14) * Math.sin(-midAngle * RADIAN);
  const textX = cx + (outerRadius + 30) * Math.cos(-midAngle * RADIAN);
  const textY = cy + (outerRadius + 30) * Math.sin(-midAngle * RADIAN);
  const isRightSide = textX > cx;
  const anchor = isRightSide ? "start" : "end";
  const lineEndX = isRightSide ? textX - 6 : textX + 6;

  const knifeCount = Number(value) || 0;
  const ratio = ((Number(percent) || 0) * 100).toFixed(0);

  return (
    <g>
      <path
        d={`M${startX},${startY}L${endX},${endY}L${lineEndX},${textY}`}
        stroke={fill}
        strokeWidth={1}
        fill="none"
      />
      <text
        x={textX}
        y={textY}
        fill={fill}
        textAnchor={anchor}
        dominantBaseline="central"
        fontSize="0.72rem"
        fontWeight={700}
      >
        {`${name}: ${knifeCount.toLocaleString("en-US")} dao (${ratio}%)`}
      </text>
    </g>
  );
};

export const PrecisionDaoFilmReportDesktopTop: React.FC<
  PrecisionDaoFilmReportDesktopTopProps
> = ({
  widgetData,
  usagePieData,
  exportPieData,
  totalUsagePie,
  totalExportPie,
}) => {
  return (
    <div className="daoFilmReportTop">
      <div className="daoFilmWidgetColumn">
        <div className="daoFilmWidgetCard total">
          <span className="widgetTitle">Tổng số dao / 총 칼 수량</span>
          <span className="widgetValue">{widgetData.Total_Knife.toLocaleString("en-US")}</span>
        </div>

        <div className="daoFilmWidgetCard ok">
          <span className="widgetTitle">Số dao OK / OK 칼 수량</span>
          <span className="widgetValue">{widgetData.Total_OK_Knife.toLocaleString("en-US")}</span>
        </div>

        <div className="daoFilmWidgetCard ng">
          <span className="widgetTitle">Số dao NG (Over) / Over 칼 수량</span>
          <span className="widgetValue">{widgetData.Total_NG_Knife.toLocaleString("en-US")}</span>
        </div>
      </div>

      <div className="daoFilmPieCard">
        <div className="daoFilmPieTitle">
          Tỉ trọng số dao theo % sử dụng / %사용 에 따른 칼 수량의 비중{" "}
        </div>
        <div className="daoFilmPieSummary">Tong: {totalUsagePie.toLocaleString("en-US")} dao</div>
        <div className="daoFilmPieBody">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={renderPieTooltip} />
              <Pie
                data={usagePieData}
                dataKey="value"
                nameKey="name"
                isAnimationActive={false}
                outerRadius={95}
                labelLine={false}
                label={renderPieLabel}
              >
                {usagePieData.map((entry, index) => (
                  <Cell
                    key={`usage-${entry.name}-${index}`}
                    fill={usageColors[index % usageColors.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="daoFilmPieCard">
        <div className="daoFilmPieTitle">
          Tỉ trọng số dao theo số lần xuất / 출고 횟수에 따른 비중
        </div>
        <div className="daoFilmPieSummary">Tổng: {totalExportPie.toLocaleString("en-US")} dao</div>
        <div className="daoFilmPieBody">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={renderPieTooltip} />
              <Pie
                data={exportPieData}
                dataKey="value"
                nameKey="name"
                isAnimationActive={false}
                outerRadius={95}
                labelLine={false}
                label={renderPieLabel}
              >
                {exportPieData.map((entry, index) => (
                  <Cell
                    key={`export-${entry.name}-${index}`}
                    fill={exportColors[index % exportColors.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDaoFilmReportDesktopTop);
