import { useEffect } from "react";
import {
  Bar,
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
import {
  CustomResponsiveContainer,
  nFormatter,
} from "../../../api/GlobalFunction";
import { YCTK_TREND_DATA } from "../../../pages/kinhdoanh/interfaces/kdInterface";

const RNDMonthlyDesignRequest = ({
  dldata,
  processColor,
  materialColor,
}: {dldata: YCTK_TREND_DATA[], processColor: string, materialColor: string}) => {
  const formatCash = (n: number) => {
    return nFormatter(n, 1);
  };

  const labelFormatter = (value: number) => {
    return formatCash(value); 
  };
  const labelFormatterPercent = (value: number) => {
    return (value.toLocaleString('en-US',{style: 'percent'})); 
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
            COMPLETED: {`${payload[0].payload.COMPLETED.toLocaleString("en-US")}`} code
          </p>
          <p className='label'>
            PENDING: {`${payload[0].payload.PENDING.toLocaleString("en-US")}`} code
          </p>          
          <p className='label'>
            TOTAL: {`${payload[0].payload.TOTAL.toLocaleString("en-US",)}`}
          </p>
          <p className='label'>
            RATE: {`${payload[0].payload.RATE.toLocaleString("en-US",{style: 'percent'})}`}
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
        <XAxis dataKey='REQ_YM' height={40} tick={{fontSize:'0.7rem'}}>         
          <Label value='Tháng' offset={0} position='insideBottom' style={{fontWeight:'normal', fontSize:'0.7rem'}} />
        </XAxis>
        <YAxis
          yAxisId='left-axis'
          label={{
            value: "CODE QTY",
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
            value: "NG Rate",
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
          dataKey='COMPLETED'
          stroke='white'
          fill={processColor}
          /* label={{ position: "insideTop", formatter: labelFormatter, fontSize:'0.7rem', fontWeight:'bold', color:'black' }}     */     
        >          
          <LabelList dataKey="COMPLETED" fill="gray" position="inside" formatter={labelFormatter} fontSize={"0.7rem"} />
        </Bar>
        <Bar
          stackId='a'
          yAxisId='left-axis'
          type='monotone'
          dataKey='PENDING'
          stroke='white'
          fill={materialColor}
          /* label={{ position: "insideTop", formatter: labelFormatter,fontSize:'0.7rem', fontWeight:'bold', color:'black' }}    */      
        >
          <LabelList dataKey="PENDING" fill="white" position="inside" formatter={labelFormatter} fontSize={"0.7rem"} />
        </Bar>
        <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='TOTAL'
          stroke='green'
          label={{ position: "top", fill:'black', formatter: labelFormatter, fontSize:'0.7rem', fontWeight:'bold', color:'black' }} 
        />
        <Line
          yAxisId='right-axis'
          type='monotone'
          dataKey='RATE'
          stroke='green'
          label={{ position: "top", fill:'black', formatter: labelFormatterPercent, fontSize:'0.7rem', fontWeight:'bold', color:'black' }} 
        />
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default RNDMonthlyDesignRequest;
