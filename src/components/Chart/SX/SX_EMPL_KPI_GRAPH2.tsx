import { useEffect } from "react";
import { XAxis, YAxis, Tooltip, Legend, ComposedChart, Label, Line, Area, Bar } from "recharts";
import {
  CustomResponsiveContainer,
  nFormatter,
} from "../../../api/GlobalFunction";
import { LOSS_TIME_DATA_THEO_NGUOI } from "../../../pages/sx/KPI_NV_NEW2/KPI_NV_NEW2";


const SX_EMPL_KPI_GRAPH2 = ({
  dldata,
}: {dldata: LOSS_TIME_DATA_THEO_NGUOI[]}) => {
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
    return (value.toLocaleString('en-US', {style:'percent',minimumFractionDigits: 1,maximumFractionDigits: 1})); 
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
          <p>Nhân viên {label}:</p> 
          <p className='label'>
            TIME_KPI: {`${(payload[0].payload.TIME_KPI)?.toLocaleString("en-US",{style: 'percent',minimumFractionDigits: 0,maximumFractionDigits: 0})}`}
          </p>          
          <p className='label'>
            TOTAL_MACHINE_KPI: {`${(payload[0].payload.TOTAL_MACHINE_KPI)?.toLocaleString("en-US",{style: 'percent',minimumFractionDigits: 0,maximumFractionDigits: 0})}`}
          </p>     
          <p className='label'>
            TOTAL_QUALITY_KPI: {`${(payload[0].payload.TOTAL_QUALITY_RATE)?.toLocaleString("en-US",{style: 'percent',minimumFractionDigits: 0,maximumFractionDigits: 0})}`}
          </p>       
          <p className='label'>
            FINAL_KPI: {`${(payload[0].payload.FINAL_KPI)?.toLocaleString("en-US",{style: 'percent',minimumFractionDigits: 0,maximumFractionDigits: 0})}`}
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
    
        <XAxis dataKey='INS_EMPL' height={40} tick={{ fontSize: '0.7rem' }}>
          <Label value='INS_EMPL' offset={0} position='insideBottom' style={{ fontWeight: 'normal', fontSize: '0.7rem' }} />
        </XAxis>
        <YAxis      
          yAxisId='left-axis'    
          label={{
            value: "FINAL_KPI",
            angle: -90,
            position: "insideLeft",
            fontSize: '0.7rem'
          }}
          tick={{ fontSize: '0.7rem' }}
          tickFormatter={(value) =>
            new Intl.NumberFormat("en", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value) + '%'
          }
          tickCount={7}
        />
        <YAxis
          yAxisId='right-axis'
          orientation='right'
          label={{
            value: "TOTAL_SQM",
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
        <Bar yAxisId='left-axis' stackId='a' dataKey="FINAL_KPI" stroke="#fffcfc" fill="#75f023" label={{ position: "top", fill: 'black', formatter: labelFormatterPercent, fontSize: '0.7rem', fontWeight: 'bold', color: 'black' }}/>
            
      
        {/* <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='RUN_COUNT'
          stroke='#6a7eeb'
          label={{ position: "top", fill: 'black', formatter: labelFormatterPercent, fontSize: '0.7rem', fontWeight: 'bold', color: 'black' }}
        />
        <Line
          yAxisId='right-axis'
          type='monotone'
          dataKey='TOTAL_SANLUONG'
          stroke='green'
          label={{ position: "top", fill: 'black', formatter: labelFormatterNumber, fontSize: '0.7rem', fontWeight: 'bold', color: 'black' }}
        /> */}
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
export default SX_EMPL_KPI_GRAPH2;
