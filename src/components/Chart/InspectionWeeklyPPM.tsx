import moment from 'moment';
import React, { PureComponent, useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Label, LabelList, Line } from 'recharts';
import Swal from 'sweetalert2';
import { generalQuery } from '../../api/Api';
import { CustomResponsiveContainer, nFormatter } from '../../api/GlobalFunction';

interface WeeklyPPMData {
  YEAR_NUM?: number;
  WEEK_NUM?: number;
  INSPECT_TOTAL_QTY?: number;
  MATERIAL_NG?: number;
  PROCESS_NG?: number;
  TOTAL_NG?: number;
  TOTAL_PPM?: number;
  MATERIAL_PPM?: number;
  PROCESS_PPM?: number;
}


interface WeeklyData {
  dldata?: WeeklyPPMData[],
  processColor?: string,
  materialColor?: string,
}
const InspectionWeeklyPPM = ({dldata, processColor, materialColor} : WeeklyData) => {
  const formatCash = (n:number) => {
    return nFormatter(n,1);
  };

  const labelFormatter = (value: number) => {
    return formatCash(value);
  };

  const CustomTooltip = ({ active, payload, label } : {active?:any, payload?:any, label?: any}) => {
    if (active && payload && payload.length) {
      console.log(payload);      
      return (
        <div className='custom-tooltip' style={{backgroundImage: "linear-gradient(to right, #ccffff, #00cccc)", padding: 20, borderRadius: 5}}>
		  <p>Ngày {label}:</p>
          <p className='label'>PROCESS_NG: {`${payload[1].value.toLocaleString("en-US")}`} ppm</p>
          <p className='label'>MATERIAL_NG: {`${payload[2].value.toLocaleString("en-US")}`} ppm</p>
          <p className='label'>TOTAL_NG: {`${(payload[0].value).toLocaleString("en-US")}`} ppm</p>
        </div>
      );
    }
    return null;
}

  useEffect(()=> {
    
  },[]);
  return (
    <CustomResponsiveContainer>
    <ComposedChart
      width={500}
      height={300}
      data={dldata?.slice(0,10).reverse()}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray='3 3' className='chartGrid' />
      <XAxis dataKey='WEEK_NUM'>
        {" "}
        <Label value='Tuần' offset={0} position='insideBottom' />
      </XAxis>
      <YAxis yAxisId="left-axis"  label={{
          value:"NG Rate",
          angle: -90,
          position: "insideLeft",
        }} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short" }).format(value)}  tickCount={6}/>   
      <Tooltip content={<CustomTooltip/>}/>
      <Legend />
      <Line yAxisId="left-axis" type="monotone" dataKey="TOTAL_PPM" stroke="green" />
      <Bar  stackId='a' yAxisId="left-axis" type="monotone" dataKey="PROCESS_PPM" stroke="white" fill={processColor} label={{ position: 'insideTop', formatter: labelFormatter }}>      
      </Bar>
      <Bar  stackId='a' yAxisId="left-axis" type="monotone" dataKey="MATERIAL_PPM" stroke="white" fill={materialColor} label={{ position: 'insideTop', formatter: labelFormatter }}>      
      </Bar>
    </ComposedChart>
    </CustomResponsiveContainer>
  )
}
export default InspectionWeeklyPPM
