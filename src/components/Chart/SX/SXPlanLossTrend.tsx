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
import { DailyData, PLAN_LOSS_DATA, PQC_PPM_DATA, SX_ACHIVE_DATA } from "../../../api/GlobalInterface";

const SXPlanLossTrend = ({
  dldata,
  processColor,
  materialColor,
}: {dldata: PLAN_LOSS_DATA[], processColor: string, materialColor: string}) => {
  const formatCash = (n: number) => {
    return nFormatter(n, 1);
  };

  const labelFormatter = (value: number) => {
    return formatCash(value); 
  };
  const labelFormatterPercent = (value: number) => {
    return (value.toLocaleString('en-US',{style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1})); 
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
          <p>Tháng {label}:</p>
          <p className='label'>
            PLAN_INPUTMET: {`${payload[0].value?.toLocaleString("en-US",{maximumFractionDigits:0})}`} m
          </p>          
          <p className='label'>
          ACTUAL_INPUTMET: {`${payload[1].value?.toLocaleString("en-US",{maximumFractionDigits:0})}`} m
          </p>          
          <p className='label'>
            PLAN_LOSS_RATE: {`${payload[2].value?.toLocaleString("en-US",{style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1})}`}
          </p>          
          <p className='label'>
            ACTUAL_LOSS_RATE: {`${payload[3].value?.toLocaleString("en-US",{style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1})}`}
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
        <XAxis dataKey='YW' height={40} tick={{fontSize:'0.7rem'}}>         
          <Label value='Tháng' offset={0} position='insideBottom' style={{fontWeight:'normal', fontSize:'0.7rem'}} />
        </XAxis>
        <YAxis
          yAxisId='left-axis'
          label={{
            value: "SX QTY",
            angle: -90,
            position: "insideLeft",
            fontSize:'0.7rem'    
          }}
          tick={{fontSize:'0.7rem'}}
          tickFormatter={(value) =>
            new Intl.NumberFormat("en", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value)
          }
          tickCount={7}
        />
        <YAxis
        orientation="right"
          yAxisId='right-axis'
          label={{
            value: "Achiv Rate",
            angle: -90,
            position: "insideLeft",
            fontSize:'0.7rem'    
          }}
          tick={{fontSize:'0.7rem'}}
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
          <span style={{fontSize:'0.7rem', fontWeight:'bold'}}>{value}</span>
        )}/>
       
        <Bar
          stackId='a'
          yAxisId='left-axis'
          type='monotone'
          dataKey='PLAN_INPUT_MET'
          stroke='white'
          fill={processColor}
          /* label={{ position: "insideTop", formatter: labelFormatter, fontSize:'0.7rem', fontWeight:'bold', color:'black' }}     */     
        >          
          <LabelList dataKey="PLAN_INPUT_MET" fill="black" position="inside" formatter={labelFormatter} fontSize={"0.7rem"} />
        </Bar>
        <Bar
          stackId='b'
          yAxisId='left-axis'
          type='monotone'
          dataKey='ACTUAL_INPUT_MET'
          stroke='white'
          fill={materialColor}
          /* label={{ position: "insideTop", formatter: labelFormatter,fontSize:'0.7rem', fontWeight:'bold', color:'black' }}    */      
        >
          <LabelList dataKey="ACTUAL_INPUT_MET" fill="black" position="inside" formatter={labelFormatter} fontSize={"0.7rem"} />
        </Bar>
        <Line
          yAxisId='right-axis'
          type='monotone'
          dataKey='PLAN_LOSS_RATE'
          stroke='#1548d4'
          label={{ position: "top", fill:'black', formatter: labelFormatterPercent, fontSize:'0.7rem', fontWeight:'bold', color:'black' }} 
        />
        <Line
          yAxisId='right-axis'
          type='monotone'
          dataKey='ACTUAL_LOSS_RATE'
          stroke='#03ca0d'
          label={{ position: "top", fill:'black', formatter: labelFormatterPercent, fontSize:'0.7rem', fontWeight:'bold', color:'black' }} 
        />
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default SXPlanLossTrend;
