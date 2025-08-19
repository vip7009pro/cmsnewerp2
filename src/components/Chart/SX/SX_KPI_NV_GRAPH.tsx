import { useEffect } from "react";
import { XAxis, YAxis, Tooltip, Legend, ComposedChart, Label, Line, Area, Bar } from "recharts";
import {
  CustomResponsiveContainer,
  nFormatter,
} from "../../../api/GlobalFunction";
import {SX_KPI_NEW_SUMMARY_DATA } from "../../../pages/qlsx/QLSXPLAN/interfaces/khsxInterface";

const SX_KPI_NV_GRAPH = ({
  dldata,
}: {dldata: SX_KPI_NEW_SUMMARY_DATA[]}) => {
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
    return (value.toLocaleString('en-US', {minimumFractionDigits: 2,maximumFractionDigits: 2})) + '%'; 
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
            RUN_COUNT: {`${(payload[0].payload.RUN_COUNT)?.toLocaleString("en-US")}`} lần
          </p>          
          <p className='label'>
            TOTAL_SANLUONG: {`${(payload[0].payload.TOTAL_SANLUONG)?.toLocaleString("en-US",{minimumFractionDigits: 0,maximumFractionDigits: 0})}`} m
          </p>          
          <p className='label'>
            KPI: {`${(payload[0].payload.KPI)?.toLocaleString("en-US",{minimumFractionDigits: 2,maximumFractionDigits: 2})}`}
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
        data={dldata.map((item,index) => {
          return {
            ...item,
            KPI: item.KPI * 100,
            TARGET: 100
          };
        })}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
    
        <XAxis dataKey='INS_EMPL' height={40} tick={{ fontSize: '0.7rem' }}>
          <Label value='Nhân viên' offset={0} position='insideBottom' style={{ fontWeight: 'normal', fontSize: '0.7rem' }} />
        </XAxis>
        <YAxis      
          yAxisId='left-axis'    
          label={{
            value: "KPI",
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
            value: "TOTAL_SANLUONG",
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
        <Bar yAxisId='left-axis' stackId='a' dataKey="KPI" stroke="#fffcfc" fill="#5efa3f" label={{ position: "top", fill: 'black', formatter: labelFormatterPercent, fontSize: '0.7rem', fontWeight: 'bold', color: 'black' }}/>
        <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='TARGET'
          stroke='#6a7eeb'
          label={{ position: "top", fill: 'black', formatter: labelFormatterPercent, fontSize: '0.7rem', fontWeight: 'bold', color: 'black' }}
        />
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
export default SX_KPI_NV_GRAPH;
