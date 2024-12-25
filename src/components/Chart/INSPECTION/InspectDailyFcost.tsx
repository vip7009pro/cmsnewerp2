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
import { DailyData, FcostData } from "../../../api/GlobalInterface";

const InspectionDailyFcost = ({
  dldata,
  dlppmdata,
  processColor,
  materialColor,
}: FcostData) => {
  const formatCash = (n: number) => {
    return nFormatter(n, 1);
  };

  let dldata_ppm = dldata?.map((item) => {
    let ppm = dlppmdata?.find((ppm) => ppm.INSPECT_DATE === item.INSPECT_DATE);
    return {
      ...item,
      TOTAL_PPM: (ppm?.TOTAL_PPM ?? 0)/10000,
      PROCESS_PPM: (ppm?.PROCESS_PPM ?? 0)/10000,
      MATERIAL_PPM: (ppm?.MATERIAL_PPM ?? 0)/10000,
    };
  }); 

  const labelFormatter = (value: number) => {
    return formatCash(value) + ' $'; 
  };
  const labelFormatter2 = (value: number) => {
    return (value?.toLocaleString("en-US") ?? 0)+'%'; 
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
          className='custom-tooltip'
          style={{
            backgroundImage: "linear-gradient(to right, #ccffff, #00cccc)",
            padding: 20,
            borderRadius: 5,
          }}
        >
          <p>Ngày {label}:</p>
          <p className='label'style={{color:'green'}}>
            PROCESS_NG: {`${payload[0].payload?.P_NG_AMOUNT?.toLocaleString("en-US")}`} $
          </p>
          <p className='label'style={{color:'green'}}>
            MATERIAL_NG: {`${payload[0].payload?.M_NG_AMOUNT?.toLocaleString("en-US")}`} $
          </p>
          <p className='label'style={{color:'green'}}>
            TOTAL_NG: {`${payload[0].payload?.T_NG_AMOUNT?.toLocaleString("en-US")}`} $
          </p>         
          <p className='label' style={{color:'blue'}}>
            PROCESS_PPM: {`${payload[0].payload?.PROCESS_PPM?.toLocaleString("en-US")}`} %
          </p>
          <p className='label' style={{color:'blue'}}>
            MATERIAL_PPM: {`${payload[0].payload?.MATERIAL_PPM?.toLocaleString("en-US")}`} %
          </p>
          <p className='label' style={{color:'blue'}}>
            TOTAL_PPM: {`${payload[0].payload?.TOTAL_PPM?.toLocaleString("en-US")}`} %
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
        <text x={props.viewBox.x} y={props.viewBox.y} fill="#000000" dy={-10} dx={0} fontSize={'0.7rem'} fontWeight={'bold'}>
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
        data={dldata_ppm}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' className='chartGrid' />
        <XAxis dataKey='INSPECT_DATE' height={40} tick={{fontSize:'0.7rem'}}>         
          <Label value='Ngày' offset={0} position='insideBottom' style={{fontWeight:'normal', fontSize:'0.7rem'}} />
        </XAxis>
        <YAxis
          yAxisId='left-axis'
          label={{
            value: "Fcost",
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
          tickCount={10}
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
        

        <YAxis yAxisId='right-axis' dataKey='TOTAL_PPM' tick={{ fontSize: '0.7rem' }} orientation='right' tickCount={10} tickFormatter={(value) =>
          new Intl.NumberFormat("en", {
            notation: "compact",
            compactDisplay: "short",
          }).format(value)
        }></YAxis>

        {/* <Bar
          stackId='a'
          yAxisId='right-axis'
          type='monotone'
          dataKey='PROCESS_PPM'          
          stroke='white'
          fill={`#d4f542`}
        >
          <LabelList dataKey="PROCESS_PPM" position="inside" formatter={labelFormatter2} fontSize={"0.7rem"} />
        </Bar>
        <Bar
          stackId='a'
          yAxisId='right-axis'
          type='monotone'
          dataKey='MATERIAL_PPM'
          stroke='white'
          fill={`#4be725`}
        >
          <LabelList dataKey="MATERIAL_PPM" position="inside" formatter={labelFormatter2} fontSize={"0.7rem"} />
        </Bar> */}


      
       {/*  <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='T_NG_AMOUNT'
          stroke='green'
          label={{ position: "top", formatter: labelFormatter, fontSize:'0.7rem', fontWeight:'bold', color:'black' }}         
        /> */}
        <Bar
          stackId='a'
          yAxisId='left-axis'
          type='monotone'
          dataKey='P_NG_AMOUNT'
          stroke='white'
          fill={processColor}          
        >
          <LabelList dataKey="P_NG_AMOUNT" position="inside" formatter={labelFormatter} fontSize={"0.7rem"} style={{fontWeight:'bold', color:'black'}}/>
        </Bar>
        <Bar
          stackId='a'
          yAxisId='left-axis'
          type='monotone'
          dataKey='M_NG_AMOUNT'
          stroke='white'
          fill={materialColor}          
        >
          <LabelList dataKey="M_NG_AMOUNT" position="inside" formatter={labelFormatter} fontSize={"0.7rem"} style={{fontWeight:'bold', color:'black'}}/>
        </Bar>

        


        <Line
          yAxisId='right-axis'
          type='monotone'
          dataKey='TOTAL_PPM'
          stroke='red'
          label={{ position: "top", formatter: labelFormatter2, fontSize:'0.7rem', fontWeight:'bold', color:'black' }}         
        />
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default InspectionDailyFcost;
