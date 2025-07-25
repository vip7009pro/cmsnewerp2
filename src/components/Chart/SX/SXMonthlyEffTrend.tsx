import { useEffect } from "react";
import { XAxis, YAxis, Tooltip, Legend, ComposedChart, Label, Line, Area } from "recharts";
import {
  CustomResponsiveContainer,
  nFormatter,
} from "../../../api/GlobalFunction";
import { PRODUCTION_EFFICIENCY_DATA } from "../../../pages/qlsx/QLSXPLAN/interfaces/khsxInterface";

const SXMonthlyEffTrend = ({
  dldata,
  processColor,
  materialColor,
}: {dldata: PRODUCTION_EFFICIENCY_DATA[], processColor: string, materialColor: string}) => {
  const formatCash = (n: number) => {
    return nFormatter(n, 1);
  };

  const labelFormatter = (value: number) => {
    return formatCash(value); 
  };
  const labelFormatterNumber = (value: number) => {
    return (value.toLocaleString('en-US',)); 
  };
  const labelFormatterPercent = (value: number) => {
    return (value.toLocaleString('en-US',{style:'percent'})); 
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
            PURE_RUN_RATE: {`${(payload[0].payload.PURE_RUN_RATE*100)?.toLocaleString("en-US")}`} %
          </p>          
          <p className='label'>
            SETTING_TIME_RATE: {`${(payload[0].payload.SETTING_TIME_RATE*100)?.toLocaleString("en-US")}`} %
          </p>          
          <p className='label'>
            LOSS_TIME_RATE: {`${(payload[0].payload.LOSS_TIME_RATE*100)?.toLocaleString("en-US")}`} %
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
    
        <XAxis dataKey='SX_YM' height={40} tick={{ fontSize: '0.7rem' }}>
          <Label value='Tháng' offset={0} position='insideBottom' style={{ fontWeight: 'normal', fontSize: '0.7rem' }} />
        </XAxis>
        <YAxis      
          yAxisId='left-axis'    
          label={{
            value: "Rate",
            angle: -90,
            position: "insideLeft",
            fontSize: '0.7rem'
          }}
          tick={{ fontSize: '0.7rem' }}
          tickFormatter={(value) =>
            new Intl.NumberFormat("en", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value*100)
          }
          tickCount={7}
        />
        <YAxis
          yAxisId='right-axis'
          orientation='right'
          label={{
            value: "Time (minutes)",
            angle: -90,
            position: "insideRight",
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
        <Area yAxisId='left-axis' stackId='a' dataKey="PURE_RUN_RATE" stroke="#87d884" fill="#25f71e" />
        <Area yAxisId='left-axis' stackId='a' dataKey="SETTING_TIME_RATE" stroke="#dfd006" fill="#fff562" />
        <Area yAxisId='left-axis' stackId='a' dataKey="LOSS_TIME_RATE" stroke="#ff0000" fill="#ff0000" />
        <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='OPERATION_RATE'
          stroke='#6a7eeb'
          label={{ position: "top", fill: 'black', formatter: labelFormatterPercent, fontSize: '0.7rem', fontWeight: 'bold', color: 'black' }}
        />
        <Line
          yAxisId='right-axis'
          type='monotone'
          dataKey='TOTAL_TIME'
          stroke='green'
          label={{ position: "top", fill: 'black', formatter: labelFormatterNumber, fontSize: '0.7rem', fontWeight: 'bold', color: 'black' }}
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
      
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default SXMonthlyEffTrend;
