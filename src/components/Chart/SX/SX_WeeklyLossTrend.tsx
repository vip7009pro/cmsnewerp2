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
import { DailyData, PQC_PPM_DATA, SX_TREND_LOSS_DATA } from "../../../api/GlobalInterface";
const SX_WeeklyLossTrend = ({
  dldata,
  processColor,
  materialColor,
}: { dldata: SX_TREND_LOSS_DATA[], processColor: string, materialColor: string }) => {  
  const formatCash = (n: number) => {
    return nFormatter(n, 1);
  };
  const labelFormatter = (value: number) => {
    return formatCash(value);
  };
  const labelFormatterPercent = (value: number) => {
    return (value.toLocaleString('en-US', { style: 'percent' }));
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
      //console.log('payload',payload)
      return (
        <div
          className='custom-tooltip'
          style={{
            backgroundImage: "linear-gradient(to right, #ccffff, #00cccc)",
            padding: 20,
            borderRadius: 5,
          }}
        >
          <p>Tuần {label}:</p>         
          <p className='label'>
            LOSS RATE: {`${payload[0].value.toLocaleString("en-US", { style: 'percent' })}`}
          </p>
        </div>
      );
    }
    return null;
  };
  useEffect(() => { }, []);
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
        <CartesianGrid strokeDasharray='3 3' className='chartGrid' />
        <XAxis dataKey='INPUT_YW' height={40} tick={{ fontSize: '0.7rem' }}>
          <Label value='Tuần' offset={0} position='insideBottom' style={{ fontWeight: 'normal', fontSize: '0.7rem' }} />
        </XAxis>
        <YAxis
          yAxisId='left-axis'
          label={{
            value: "Loss Rate",
            angle: -90,
            position: "insideLeft",
            fontSize: '0.7rem'
          }}
          tick={{ fontSize: '0.7rem' }}
          tickFormatter={(value) =>
            new Intl.NumberFormat("en", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value)
          }
          tickCount={7}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          align="center"
          iconSize={15}
          iconType="diamond"
          formatter={(value, entry) => (
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{value}</span>
          )} />
        <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='LOSS_RATE'
          stroke='green'
          label={{ position: "top", fill: 'black', formatter: labelFormatterPercent, fontSize: '0.7rem', fontWeight: 'bold', color: 'black' }}
        />
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default SX_WeeklyLossTrend;
