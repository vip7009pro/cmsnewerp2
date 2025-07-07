import moment from "moment";
import React, { PureComponent, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Label,
  LabelList,
  Line,
} from "recharts";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import {
  CustomResponsiveContainer,
  nFormatter,
} from "../../../api/GlobalFunction";
import {
  DailyData,
  FcostData,
  NguoiHangData,
} from "../../../api/GlobalInterface";
const InspectWeeklyNguoiHangTrending = ({
  dldata,
  processColor,
  materialColor,
}: NguoiHangData) => {
  const formatCash = (n: number) => {
    return nFormatter(n, 1);
  };
  const labelFormatter = (value: number) => {
    return formatCash(value);
  };
  const labelFormatter2 = (value: number) => {
    return (value?.toLocaleString("en-US") ?? 0) + "h";
  };
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: any;
    payload?: any;
    label?: any;
  }) => {
    if (active && payload && payload.length) {
      //console.log(payload);
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundImage: "linear-gradient(to right, #ccffff, #00cccc)",
            padding: 20,
            borderRadius: 5,
          }}
        >
          <p>Tuân {label}:</p>
          <p className="label" style={{ color: "green" }}>
            INSPECT_YW:{" "}
            {`${payload[0]?.payload?.INSPECT_YW}`}
          </p>
          <p className="label" style={{ color: "green" }}>
            EMPL_NUMBER:{" "}
            {`${payload[0]?.payload?.EMPL_NUMBER?.toLocaleString("en-US")}`}
          </p>
          <p className="label" style={{ color: "green" }}>
            INSPECT_HOUR:{" "}
            {`${payload[0]?.payload?.INSPECT_HOUR?.toLocaleString("en-US")}`}
          </p>
        </div>
      );
    }
    return null;
  };
  const CustomLabel = (props: any) => {
    //console.log(props);
    return (
      <g>
        <rect
          x={props.viewBox.x}
          y={props.viewBox.y}
          fill="#aaa"
          style={{ transform: `rotate(90deg)` }}
        />
        <text
          x={props.viewBox.x}
          y={props.viewBox.y}
          fill="#000000"
          dy={-10}
          dx={0}
          fontSize={"0.7rem"}
          fontWeight={"bold"}
        >
          {formatCash(props.value)}
        </text>
      </g>
    );
  };
  useEffect(() => {}, []);
  return (
    <CustomResponsiveContainer>
      <ComposedChart
        width={500}
        height={300}
        data={dldata}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
        <XAxis dataKey="INSPECT_YW" height={40} tick={{ fontSize: "0.7rem" }}>
          <Label
            value="Tuần"
            offset={0}
            position="insideBottom"
            style={{ fontWeight: "normal", fontSize: "0.7rem" }}
          />
        </XAxis>
        <YAxis
          yAxisId="left-axis"
          label={{
            value: "Fcost",
            angle: -90,
            position: "insideLeft",
            fontSize: "0.7rem",
          }}
          tick={{ fontSize: "0.7rem" }}
          tickFormatter={(value) =>
            new Intl.NumberFormat("en", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value) + "$"
          }
          tickCount={10}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          align="center"
          iconSize={15}
          iconType="diamond"
          formatter={(value, entry) => (
            <span style={{ fontSize: "0.7rem", fontWeight: "bold" }}>
              {value}
            </span>
          )}
        />
        <YAxis
          yAxisId="right-axis"
          dataKey="INSPECT_HOUR"
          tick={{ fontSize: "0.7rem" }}
          orientation="right"
          tickCount={10}
          tickFormatter={(value) =>
            new Intl.NumberFormat("en", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value)
          }
        ></YAxis>
        <Bar
          stackId="a"
          yAxisId="left-axis"
          type="monotone"
          dataKey="EMPL_NUMBER"
          stroke="white"
          fill={processColor}
        >
          <LabelList
            dataKey="EMPL_NUMBER"
            position="inside"
            formatter={labelFormatter}
            fontSize={"0.7rem"}
            style={{ fontWeight: "bold", color: "black" }}
          />
        </Bar>
        <Line
          yAxisId="right-axis"
          type="monotone"
          dataKey="INSPECT_HOUR"
          stroke="red"
          label={{
            position: "top",
            formatter: labelFormatter2,
            fontSize: "0.7rem",
            fontWeight: "bold",
            color: "black",
          }}
        />
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default InspectWeeklyNguoiHangTrending;
