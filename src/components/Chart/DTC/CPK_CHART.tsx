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
import { CPK_DATA, XBAR_DATA } from "../../../api/GlobalInterface";
const CPK_CHART = ({
  dldata
}: {dldata: CPK_DATA[]}) => {
  const formatCash = (n: number) => {
    return nFormatter(n, 1);
  };
  const labelFormatter = (value: number) => {
    return formatCash(value); 
  };
  const labelFormatterNumber = (value: number) => {
    return (value.toLocaleString('en-US',{style: 'decimal'})); 
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
          <p>GROUP {label}:</p>          
          <p className='label'>
            CPK: {`${payload[0].payload.CPK?.toLocaleString("en-US")}`}
          </p>           
        </div>
      );
    }
    return null;
  };
  
let maxValue = dldata[0].CPK;

for (let i = 1; i < dldata.length; i++) {
    if (dldata[i].CPK > maxValue) {
        maxValue = dldata[i].CPK;
    }
}
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
        title="CPK CHART"
      >
        <CartesianGrid strokeDasharray='5 5' className='chartGrid' />
        <XAxis dataKey='GRP_ID' height={40} tick={{fontSize:'0.7rem'}}>         
          <Label value='Sample Group' offset={0} position='insideBottom' style={{fontWeight:'normal', fontSize:'0.7rem'}} />
        </XAxis>
        <YAxis
          yAxisId='left-axis'
          label={{
            value: "Value",
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
          domain={[0, maxValue]} 
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
        <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='CPK'
          stroke='green'
          dot={false}
        />        
        <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='CPK1'
          stroke='red'
          strokeDasharray="5 5"
          dot={false}
        />        
        <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='CPK2'
          stroke='red'
          strokeDasharray="5 5"
          dot={false}
        />        
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default CPK_CHART;
