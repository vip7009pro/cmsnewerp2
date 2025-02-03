import moment from "moment";
import React, { PureComponent, useEffect, useState } from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  Label,
} from "recharts";
import Swal from "sweetalert2";
import { generalQuery, getCompany, getGlobalSetting } from "../../../api/Api";
import { CustomResponsiveContainer, nFormatter } from "../../../api/GlobalFunction";
import { WEB_SETTING_DATA, WeekLyPOData } from "../../../api/GlobalInterface";

const ChartWeeklyPO = ({data}: {data: Array<WeekLyPOData>}) => {
  const digit: number = getCompany()==='CMS' ? 0: 2;
    const formatCash = (n: number) => {  
     return nFormatter(n, digit) + ((getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD") === 'USD'?  " $": " đ");
   };
  const labelFormatter = (value: number) => {
    return new Intl.NumberFormat("en", {
      notation: "compact",
      compactDisplay: "short",
    }).format(value);
  };
  const CustomLabel = (props:any) => {
    //console.log(props);
    return (
      <g>
        <rect
          x={props.viewBox.x}
          y={props.viewBox.y}
          fill="#aaa" 
          style={{transform:`rotate(90deg)`}}
        />
        <text x={props.viewBox.x} y={props.viewBox.y} fill="#000000" dy={20} dx={15} fontSize={'0.7rem'} fontWeight={'bold'}>
          {formatCash(props.value)}
        </text>
      </g>
    );
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
          <p>{label}:</p>
          <p className='label'>
            AMOUNT: {`${payload[0].value.toLocaleString("en-US")}`} USD
          </p>
          <p className='label'>
            QTY: {`${payload[1].value.toLocaleString("en-US")}`} EA
          </p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    
  }, []);
  return (
    <CustomResponsiveContainer>
      <ComposedChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >       
        <CartesianGrid strokeDasharray='3 3' className='chartGrid' />
        <XAxis dataKey='YEAR_WEEK'  height={40} tick={{fontSize:'0.7rem'}}>          
          <Label value='Tuần' offset={0} position='insideBottom' style={{fontWeight:'normal', fontSize:'0.7rem'}}  />
        </XAxis>
        <YAxis
          width={50}
          yAxisId='left-axis'
          label={{
            value: "Số lượng",
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
          tickCount={12}
        />
        <YAxis
          yAxisId='right-axis'
          orientation='right'
          label={{
            value: "Số tiền",
            angle: -90,
            position: "insideRight",
            fontSize:'0.7rem'    
          }}
          tick={{fontSize:'0.7rem'}}
          tickFormatter={(value) => nFormatter(value, 2) + (getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE==='USD'? ' $' : ' đ')}
          tickCount={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
        verticalAlign="top"
        align="center"
        iconSize={15}
        iconType="diamond"
        formatter={(value, entry) => (
          <span style={{fontSize:'0.7rem', fontWeight:'bold'}}>{value}</span>
        )}
        />       
        <Bar
          yAxisId='right-axis'
          type='monotone'
          dataKey='WEEKLY_PO_AMOUNT'
          stroke='white'
          fill='#7cb7e7'        
          label={CustomLabel}
        ></Bar>
         <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='WEEKLY_PO_QTY'
          stroke='green'
          fill='#ff0000'
          label={{ position: "top", formatter: labelFormatter }}
        ></Line>
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default ChartWeeklyPO;
