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
import { DailyData, PLAN_LOSS_DATA, PQC_PPM_DATA, PROD_PLAN_CAPA_DATA, SX_ACHIVE_DATA } from "../../../api/GlobalInterface";

const ProductionPlanCapaChart = ({
  dldata,
  processColor,
  materialColor,
}: {dldata: PROD_PLAN_CAPA_DATA[], processColor: string, materialColor: string}) => {
  const formatCash = (n: number) => {
    return nFormatter(n, 1);
  };

  const labelFormatter = (value: number) => {
    return formatCash(value); 
  };
  const labelFormatterPercent = (value: number) => {
    return (value.toLocaleString('en-US',{style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1,})); 
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
            Lead Time: {`${payload[0].value?.toLocaleString("en-US",{maximumFractionDigits:0})}`} hours
          </p>          
          <p className='label'>
          EQ_CAPA: {`${payload[1].value?.toLocaleString("en-US",{maximumFractionDigits:0})}`} hours
          </p>          
          <p className='label'>
            RETAIN_WF_CAPA: {`${payload[2].value?.toLocaleString("en-US",{maximumFractionDigits:0})}`} hours
          </p>          
          <p className='label'>
          ATT_WF_CAPA: {`${payload[3].value?.toLocaleString("en-US",{maximumFractionDigits:0})}`} hours 
          </p>          
          {/* <p className='label'>
            RETAIN_WF_CAPA_12H: {`${payload[4].value?.toLocaleString("en-US",{maximumFractionDigits:0})}`} hours
          </p>          
          <p className='label'>
          ATT_WF_CAPA_12H: {`${payload[5].value?.toLocaleString("en-US",{maximumFractionDigits:0})}`} hours 
          </p>     */}      
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
        <XAxis dataKey='PROD_DATE' height={40} tick={{fontSize:'0.7rem'}}>         
          <Label value='Ngày' offset={0} position='insideBottom' style={{fontWeight:'normal', fontSize:'0.7rem'}} />
        </XAxis>
        <YAxis
          yAxisId='left-axis'
          label={{
            value: "LeadTime",
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
          dataKey='LEADTIME'
          stroke='white'
          fill={processColor}
          /* label={{ position: "insideTop", formatter: labelFormatter, fontSize:'0.7rem', fontWeight:'bold', color:'black' }}     */     
        >          
          <LabelList dataKey="LEADTIME" fill="black" position="inside" formatter={labelFormatter} fontSize={"0.5rem"} />
        </Bar>       
        <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='EQ_CAPA'
          stroke='#1548d4'
          label={{ position: "top", fill:'black', formatter: labelFormatter, fontSize:'0.5rem', fontWeight:'bold', color:'black' }} 
        />
        <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='EQ_CAPA_12H'
          stroke='#1548d4'
          label={{ position: "top", fill:'black', formatter: labelFormatter, fontSize:'0.5rem', fontWeight:'bold', color:'black' }} 
        />
        <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='RETAIN_WF_CAPA_12H'
          stroke='#d00ae2'
          label={{ position: "top", fill:'black', formatter: labelFormatter, fontSize:'0.5rem', fontWeight:'bold', color:'black' }} 
        />
        <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='RETAIN_WF_CAPA'
          stroke='#d00ae2'
          label={{ position: "top", fill:'black', formatter: labelFormatter, fontSize:'0.5rem', fontWeight:'bold', color:'black' }} 
        />
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default ProductionPlanCapaChart;
