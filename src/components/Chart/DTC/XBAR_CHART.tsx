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
import { XBAR_DATA } from "../../../api/GlobalInterface";
const XBAR_CHART = ({
  dldata
}: { dldata: XBAR_DATA[] }) => {
  const formatCash = (n: number) => {
    return nFormatter(n, 1);
  };
  const labelFormatter = (value: number) => {
    return formatCash(value);
  };
  const labelFormatterNumber = (value: number) => {
    return (value.toLocaleString('en-US', { style: 'decimal' }));
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
            XBAR: {`${payload[0].payload.AVG_VALUE.toLocaleString("en-US")}`}
          </p>
          <p className='label'>
            X_LCL: {`${payload[0].payload.X_LCL.toLocaleString("en-US")}`}
          </p>
          <p className='label'>
            X_CL: {`${payload[0].payload.X_CL.toLocaleString("en-US")}`}
          </p>
          <p className='label'>
            X_UCL: {`${payload[0].payload.X_UCL.toLocaleString("en-US")}`}
          </p>
        </div>
      );
    }
    return null;
  };
  useEffect(() => { }, []);
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
        title="XBAR_CHART"
      >
        <CartesianGrid strokeDasharray='5 5' className='chartGrid' />
        <XAxis dataKey='GRP_ID' height={40} tick={{ fontSize: '0.7rem' }}>
          <Label value='Sample Group' offset={0} position='insideBottom' style={{ fontWeight: 'normal', fontSize: '0.7rem' }} />
        </XAxis>
        <YAxis
          yAxisId='left-axis'
          label={{
            value: "Value",
            angle: -90,
            position: "insideLeft",
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
          domain={[dldata[0].X_LCL, dldata[0].X_UCL]}
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
        <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='AVG_VALUE'
          stroke='green'
          dot={false}
        />
        <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='X_UCL'
          stroke='red'
          strokeDasharray="5 5"
          dot={false}
        />
        <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='X_LCL'
          stroke='red'
          strokeDasharray="5 5"
          dot={false}
        />
        <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='X_CL'
          stroke='blue'
          strokeDasharray="5 5"
          dot={false}
        />
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default XBAR_CHART;
