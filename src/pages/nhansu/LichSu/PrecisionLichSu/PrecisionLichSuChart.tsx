import React from "react";
import moment from "moment";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LinearProgress } from "@mui/material";

interface PrecisionLichSuChartProps {
  timelineData: Array<{
    date: string;
    label: string;
    hours: number;
  }>;
  isLoading: boolean;
  errorMessage: string | null;
  isDefaultMonth: boolean;
  fromDate: string;
  toDate: string;
  onRefresh: () => void;
}

export const PrecisionLichSuChart: React.FC<PrecisionLichSuChartProps> = ({
  timelineData,
  isLoading,
  errorMessage,
  isDefaultMonth,
  fromDate,
  toDate,
  onRefresh,
}) => {
  const todayYmd = moment().format("YYYY-MM-DD");

  const chartData = timelineData.map((d, idx) => ({
    x: idx + 1,
    ...d,
    hoursPast: d.date < todayYmd ? d.hours : null,
    hoursFuture: d.date >= todayYmd ? d.hours : null,
  }));

  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const label = String(payload?.payload?.label ?? payload?.value ?? "");
    const v = Number(payload?.value);
    const base = isDefaultMonth
      ? moment().startOf("month")
      : moment(fromDate || "", "YYYY-MM-DD", true);
    const d = v && base.isValid() ? base.clone().add(v - 1, "day") : null;
    const isSunday = d != null ? d.day() === 0 : false;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={14}
          textAnchor="middle"
          fill={isSunday ? "#dc2626" : "#64748b"}
          fontSize={10.5}
          fontWeight={isSunday ? 700 : 500}
        >
          {label}
        </text>
      </g>
    );
  };

  const titleText = isDefaultMonth
    ? `TIME LINE ĐI LÀM (THÁNG ${moment().format("MM/YYYY")})`
    : `TIME LINE ĐI LÀM (${moment(fromDate).format("DD/MM")} - ${moment(toDate).format("DD/MM")})`;

  return (
    <div className="precision-lichsu__chartCard">
      <div className="precision-lichsu__chartHeader">
        <div className="precision-lichsu__chartTitleGroup">
          <span className="chart-indicator"></span>
          <span className="chart-title">{titleText}</span>
          <span className="chart-unit">| Đơn vị: Giờ làm việc thực tế / ngày</span>
        </div>

        <button
          type="button"
          className="precision-lichsu__btn precision-lichsu__btn--secondary precision-lichsu__btn--sm"
          onClick={onRefresh}
          title="Làm mới biểu đồ"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            refresh
          </span>
          <span>Refresh</span>
        </button>
      </div>

      {errorMessage && (
        <div style={{ color: "#dc2626", fontSize: "11px", fontWeight: 600 }}>
          {errorMessage}
        </div>
      )}

      {isLoading && <LinearProgress sx={{ height: 2, borderRadius: 1 }} />}

      <div className="precision-lichsu__chartCanvas">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 16, left: -20, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="x"
              tick={CustomXAxisTick}
              interval={0}
              minTickGap={6}
              stroke="#cbd5e1"
            />
            <YAxis
              tick={{ fontSize: 10.5, fill: "#64748b" }}
              domain={[0, 12]}
              stroke="#cbd5e1"
            />
            <Tooltip
              content={({ active, payload, label }: any) => {
                if (!active || !payload || payload.length === 0) return null;
                const item = payload.find((p: any) => p?.value != null);
                if (!item) return null;
                const dateLabel = String(item?.payload?.date ?? label);
                const hrs = item.value;
                return (
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: 6,
                      padding: "6px 10px",
                      boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.1)",
                      fontSize: 11,
                    }}
                  >
                    <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>
                      {dateLabel}
                    </div>
                    <div style={{ color: "#059669", fontWeight: 600 }}>
                      Giờ làm việc: {hrs} giờ
                    </div>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="hoursPast"
              stroke="#059669"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#059669", strokeWidth: 1.5, stroke: "#ffffff" }}
              isAnimationActive={!isLoading}
            />
            <Line
              type="monotone"
              dataKey="hoursFuture"
              stroke="#dc2626"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 2.5, fill: "#dc2626", strokeWidth: 1, stroke: "#ffffff" }}
              isAnimationActive={!isLoading}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PrecisionLichSuChart;
