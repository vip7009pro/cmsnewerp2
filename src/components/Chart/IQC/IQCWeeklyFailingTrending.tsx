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
import { IQC_FAILING_TREND_DATA } from "../../../pages/qc/interfaces/qcInterface";

const IQCWeeklyFailingTrending = ({
  dldata,
  processColor,
  materialColor,
}: {dldata: IQC_FAILING_TREND_DATA[], processColor: string, materialColor: string}) => {
  const formatCash = (n: number) => {
    return nFormatter(n, 1);
  };

  const labelFormatter = (value: number) => {
    return formatCash(value); 
  };
  const labelFormatterPercent = (value: number) => {
    return (value.toLocaleString('en-US',{style: 'percent', minimumFractionDigits: 2})); 
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
          <p>Tuần {label}:</p>
          <p className='label'>
            TOTAL QTY: {`${payload[0].payload.TOTAL_QTY?.toLocaleString("en-US")}`} met
          </p>
          <p className='label'>
            CLOSED_QTY: {`${payload[0].payload.CLOSED_QTY?.toLocaleString("en-US")}`} met
          </p>
          <p className='label'>
            PENDING_QTY: {`${payload[0].payload.PENDING_QTY?.toLocaleString("en-US")}`} met
          </p>  
          <p className='label'>
          COMPLETE RATE: {`${payload[0].payload.COMPLETE_RATE?.toLocaleString("en-US", {style:'percent', minimumFractionDigits: 2})}`}
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
        <XAxis dataKey='FAIL_YW' height={40} tick={{fontSize:'0.7rem'}}>         
          <Label value='Tuần' offset={0} position='insideBottom' style={{fontWeight:'normal', fontSize:'0.7rem'}} />
        </XAxis>
        <YAxis
          yAxisId='left-axis'
          label={{
            value: "MET QTY",
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
            value: "COMPLETE RATE",
            angle: -90,
            position: "insideLeft",
            fontSize:'0.7rem'    
          }}
          tick={{fontSize:'0.7rem'}}
          tickFormatter={(value) =>
            new Intl.NumberFormat("en", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value*100) + '%'
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
          dataKey='CLOSED_QTY'
          stroke='white'
          fill={processColor}
          /* label={{ position: "insideTop", formatter: labelFormatter, fontSize:'0.7rem', fontWeight:'bold', color:'black' }}     */     
        >          
          <LabelList dataKey="CLOSED_QTY" fill="gray" position="inside" formatter={labelFormatter} fontSize={"0.7rem"} />
        </Bar>        
        <Bar
          stackId='a'
          yAxisId='left-axis'
          type='monotone'
          dataKey='PENDING_QTY'
          stroke='white'
          fill={"#FFD700"}
          /* label={{ position: "insideTop", formatter: labelFormatter,fontSize:'0.7rem', fontWeight:'bold', color:'black' }}    */      
        >
          <LabelList dataKey="PENDING_QTY" fill="white" position="inside" formatter={labelFormatter} fontSize={"0.7rem"} />
        </Bar>
        <Line
          yAxisId='right-axis'
          type='monotone'
          dataKey='COMPLETE_RATE'
          stroke='green'
          label={{ position: "top", fill:'black', formatter: labelFormatterPercent, fontSize:'0.7rem', fontWeight:'bold', color:'black' }} 
        />       
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default IQCWeeklyFailingTrending;
