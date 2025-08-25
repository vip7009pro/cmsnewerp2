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
  Area,
} from "recharts";
import {
  CustomResponsiveContainer,
  nFormatter,
} from "../../../api/GlobalFunction";
import { CNT_GAP_DATA2, PQC_PPM_DATA } from "../../../pages/qc/interfaces/qcInterface";

const YCSX_GAP_RATE2 = ({
  dldata,
  processColor,
  materialColor,
}: {dldata: CNT_GAP_DATA2[], processColor: string, materialColor: string}) => {
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
          <p>GAP {label}:</p>
          <p className='label'>
            CNT_SX: {`${payload[0].payload.CNT_SX.toLocaleString("en-US")}`} YCSX
          </p>
          <p className='label'>
            CNT_QC: {`${payload[1].payload.CNT_QC.toLocaleString("en-US")}`} YCSX
          </p>          
          <p className='label'>
            CNT_OK: {`${payload[2].payload.CNT_OK.toLocaleString("en-US")}`} YCSX
          </p>          
          <p className='label'>
            RATE_SX: {`${payload[2].payload.RATE_SX.toLocaleString("en-US", {style:'percent'})}`}
          </p>
          <p className='label'>
            RATE_QC: {`${payload[2].payload.RATE_QC.toLocaleString("en-US", {style:'percent'})}`}
          </p>
          <p className='label'>
            RATE_OK: {`${payload[2].payload.RATE_OK.toLocaleString("en-US", {style:'percent'})}`}
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
        <XAxis dataKey='GAP' height={40} tick={{fontSize:'0.7rem'}} tickFormatter={(value) => value + ' ngày'}>         
          <Label value='Ngày quá hạn' offset={0} position='insideBottom' style={{fontWeight:'normal', fontSize:'0.7rem'}} />
        </XAxis>
        <YAxis
          yAxisId='left-axis'
          label={{
            value: "YCSX",
            angle: -90,
            position: "insideLeft",
            fontSize:'0.7rem'    
          }}
          tick={{fontSize:'0.7rem'}}
          tickFormatter={(value) =>
            new Intl.NumberFormat("en", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value)+ ' ycsx' 
          }
          tickCount={7}
        />
        <YAxis
        orientation="right"
          yAxisId='right-axis'
          label={{
            value: "RATE",
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
       <Area
          yAxisId='right-axis'
          type='monotone'
          stackId='b'
          dataKey='RATE_SX'
          stroke='green'
          fill='#00ccff'
          label={{ position: "top", fill:'black', formatter: labelFormatterPercent, fontSize:'0.7rem', fontWeight:'bold', color:'black' }} 
        />
        <Area
          yAxisId='right-axis'
          type='monotone'
          stackId='b'
          dataKey='RATE_QC'
          stroke='blue'
          fill='blue'
          label={{ position: "top", fill:'black', formatter: labelFormatterPercent, fontSize:'0.7rem', fontWeight:'bold', color:'black' }} 
        />
        <Area
          yAxisId='right-axis'
          type='monotone'
          stackId='b'
          dataKey='RATE_OK'
          stroke='#74c938'
          fill='#74c938'
          label={{ position: "top", fill:'black', formatter: labelFormatterPercent, fontSize:'0.7rem', fontWeight:'bold', color:'black' }} 
        />
        <Bar
          stackId='a'
          yAxisId='left-axis'
          type='monotone'
          dataKey='CNT_SX'
          stroke='white'
          fill={processColor}
          //label={{ position: "insideTop", formatter: labelFormatter, fontSize:'0.7rem', fontWeight:'bold', color:'black' }}         
        >          
          <LabelList dataKey="CNT_SX" fill="white" position="inside" formatter={labelFormatter} fontSize={"0.7rem"} />
        </Bar>
        <Bar
          stackId='a'
          yAxisId='left-axis'
          type='monotone'
          dataKey='CNT_QC'
          stroke='white'
          fill={'#d12efa'}
          //label={{ position: "insideTop", formatter: labelFormatter,fontSize:'0.7rem', fontWeight:'bold', color:'black' }}         
        >
          <LabelList dataKey="CNT_QC" fill="white" position="inside" formatter={labelFormatter} fontSize={"0.7rem"} />
        </Bar>
        <Bar
          stackId='a'
          yAxisId='left-axis'
          type='monotone'
          dataKey='CNT_OK'
          stroke='white'
          fill={materialColor}
          //label={{ position: "insideTop", formatter: labelFormatter,fontSize:'0.7rem', fontWeight:'bold', color:'black' }}         
        >
          <LabelList dataKey="CNT_OK" fill="white" position="inside" formatter={labelFormatter} fontSize={"0.7rem"} />
        </Bar>
        
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default YCSX_GAP_RATE2;
