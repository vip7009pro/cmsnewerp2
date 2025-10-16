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
import { RND_FILM_SAVING_TREND_DATA } from "../../../pages/rnd/interfaces/rndInterface";

const RNDWeeklyFilmSaving = ({
  dldata,
  processColor,
  materialColor,
}: {dldata: RND_FILM_SAVING_TREND_DATA[], processColor: string, materialColor: string}) => {
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
          <p>Tuần {label}:</p>
          <p className='label'>
          Tuần: {`${payload[0].payload.PLAN_YW?.toLocaleString("en-US")}`} EA
          </p>
          <p className='label'>
            FILM_QTY_LT: {`${payload[0].payload.FILM_QTY_LT?.toLocaleString("en-US")}`} EA
          </p>          
          <p className='label'>
            FILM_QTY_TT: {`${payload[0].payload.FILM_QTY_TT?.toLocaleString("en-US",)}`}
          </p>
          <p className='label'>
            SAVING_RATE: {`${payload[0].payload.SAVING_RATE?.toLocaleString("en-US",{style: 'percent'})}`}
          </p>
          <p className='label'>
            SQM_LT: {`${payload[0].payload.SQM_LT?.toLocaleString("en-US",)}`}
          </p>
          <p className='label'>
            SQM_TT: {`${payload[0].payload.SQM_TT?.toLocaleString("en-US",)}`}
          </p>
          <p className='label'>
            SQM_SAVING_RATE: {`${payload[0].payload.SQM_SAVING_RATE?.toLocaleString("en-US",{style: 'percent'})}`}
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
        <XAxis dataKey='PLAN_YW' height={40} tick={{fontSize:'0.7rem'}}>         
          <Label value='Tuần' offset={0} position='insideBottom' style={{fontWeight:'normal', fontSize:'0.7rem'}} />
        </XAxis>
        <YAxis
          yAxisId='left-axis'
          label={{
            value: "FILM SQM",
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
            value: "SQM Saving Rate",
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
          yAxisId='left-axis'
          type='monotone'
          dataKey='SQM_LT'
          stroke='white'
          fill={processColor}          
        >          
          <LabelList dataKey="SQM_LT" fill="black" position="inside" formatter={labelFormatter} fontSize={"0.7rem"} />
        </Bar>
        <Bar         
          yAxisId='left-axis'
          type='monotone'
          dataKey='SQM_TT'
          stroke='white'
          fill={materialColor}              
        >
          <LabelList dataKey="SQM_TT" fill="white" position="inside" formatter={labelFormatter} fontSize={"0.7rem"} />
        </Bar>       
        <Line
          yAxisId='right-axis'
          type='monotone'
          dataKey='SQM_SAVING_RATE'
          stroke='green'
          label={{ position: "top", fill:'blue', formatter: labelFormatterPercent, fontSize:'0.7rem', fontWeight:'bold', color:'black' }} 
        />
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default RNDWeeklyFilmSaving;
