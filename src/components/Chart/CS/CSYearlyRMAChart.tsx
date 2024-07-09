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
import { CS_REDUCE_AMOUNT_DATA, CS_RMA_AMOUNT_DATA, DailyData, FcostData } from "../../../api/GlobalInterface";

const CSYearlyRMAChart = ({
  dldata,
  HT,
  CD,
  MD
}: {dldata: CS_RMA_AMOUNT_DATA[], HT: string, CD: string, MD: string}) => {
  const formatCash = (n: number) => {
    return nFormatter(n, 1);
  };
  const labelFormatter = (value: number) => {
    return formatCash(value) + ' $'; 
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
      return (
        <div
          className='custom-tooltip'
          style={{
            backgroundImage: "linear-gradient(to right, #ccffff, #00cccc)",
            padding: 20,
            borderRadius: 5,
          }}
        >
          <p>Năm {label}:</p>          
          <p className='label'>
            RMA HT Amount: {`${payload[0]?.value.toLocaleString("en-US")}`} $
          </p>
          <p className='label'>
            RMA CD Amount: {`${payload[1]?.value.toLocaleString("en-US")}`} $
          </p>
          <p className='label'>
            RMA MD Amount: {`${payload[2]?.value.toLocaleString("en-US")}`} $
          </p>
        </div>
      );
    }
    return null;
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
        <CartesianGrid strokeDasharray='3 3' className='chartGrid' />
        <XAxis dataKey='RT_YEAR' height={40} tick={{fontSize:'0.7rem'}}>         
          <Label value='Năm' offset={0} position='insideBottom' style={{fontWeight:'normal', fontSize:'0.7rem'}} />
        </XAxis>
        <YAxis
          yAxisId='left-axis'
          label={{
            value: "Saved Amount",
            angle: -90,
            position: "insideLeft",
            fontSize:'0.7rem'    
          }}
          tick={{fontSize:'0.7rem'}}
          tickFormatter={(value) =>
            new Intl.NumberFormat("en", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value) + "$"
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
          <span style={{fontSize:'0.7rem', fontWeight:'bold'}}>{value}</span>
        )}/>       
        <Bar
          stackId={'a'}
          yAxisId='left-axis'
          type='monotone'
          dataKey='MD'
          stroke='#1707fa'
          fill={MD}
        >
          {/* <LabelList dataKey="MD" fill="black" position="top" formatter={labelFormatter} fontSize={"0.7rem"} /> */}
        </Bar>
        <Bar
          stackId={'a'}
          yAxisId='left-axis'
          type='monotone'
          dataKey='HT'
          stroke='#1707fa'
          fill={HT}
        >
          {/* <LabelList dataKey="HT" fill="black" position="top" formatter={labelFormatter} fontSize={"0.7rem"} /> */}
        </Bar>
        <Bar
          stackId={'a'}
          yAxisId='left-axis'
          type='monotone'
          dataKey='CD'
          stroke='#1707fa'
          fill={CD}
        >
          {/* <LabelList dataKey="CD" fill="black" position="top" formatter={labelFormatter} fontSize={"0.7rem"} /> */}
        </Bar>
        <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='TT'
          stroke='green'
          label={{ position: "top", formatter: labelFormatter, fontSize:'0.7rem', fontWeight:'bold', color:'black' }} 
        />      
               
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default CSYearlyRMAChart;
