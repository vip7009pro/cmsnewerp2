import { useEffect } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from "recharts";
import { getGlobalSetting } from "../../../api/Api";
import { CustomResponsiveContainer, nFormatter } from "../../../api/GlobalFunction";
import { WEB_SETTING_DATA } from "../../../api/GlobalInterface";
import { PO_BALANCE_DETAIL } from "../../../pages/kinhdoanh/interfaces/kdInterface";
const KDPOBalanceSummaryByWeek = ({ data, onClick }: { data: Array<PO_BALANCE_DETAIL>, onClick: (e: any) => void }) => {
  //const [runningPOData, setRunningPOData] = useState<Array<RunningPOData>>([]);
  const formatCash = (n: number) => {
    return nFormatter(n, 2) + ((getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD") === 'USD' ? " $" : " đ");
  };
  const labelFormatter = (value: number) => {
    return new Intl.NumberFormat("en", {
      notation: "compact",
      compactDisplay: "short",
    }).format(value);
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
            YEAR: {`${payload[0]?.payload?.PO_YW}`}
            <br></br>
            BALANCE: {`${payload[0]?.payload?.PO_BALANCE?.toLocaleString("en-US")}`} EA
          </p>
        </div>
      );
    }
    return null;
  };
  const CustomLabel = (props: any) => {
    return (
      <g>
        <rect
          x={props.viewBox.x}
          y={props.viewBox.y}
          fill="#aaa"
          style={{ transform: `rotate(90deg)` }}
        />
        <text x={props.viewBox.x} y={props.viewBox.y} fill="#000000" dy={20} dx={15} fontSize={'0.7rem'} fontWeight={'bold'}>
          {formatCash(props.value)}
        </text>
      </g>
    );
  };
  const handleClick = (e: any) => {
    // console.log(e)
    onClick(e);
  }
  useEffect(() => {
    //handleGetDailyClosing();
  }, []);
  return (
    <CustomResponsiveContainer>
      <ComposedChart
        onClick={(e) => { handleClick(e) }}
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
        {" "}
        <CartesianGrid strokeDasharray='3 3' className='chartGrid' />
        <XAxis dataKey='PO_YW' height={40} tick={{ fontSize: '0.7rem' }}>
          <Label value='Tuần' offset={0} position='insideBottom' style={{ fontWeight: 'normal', fontSize: '0.7rem' }} />
        </XAxis>
        <YAxis
          width={50}
          yAxisId='left-axis'
          label={{
            value: "Số lượng",
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
          tickCount={12}
        />
        <YAxis
          yAxisId='right-axis'
          orientation='right'
          label={{
            value: "Số tiền",
            angle: -90,
            position: "insideRight",
            fontSize: '0.7rem'
          }}
          tick={{ fontSize: '0.7rem' }}
          tickFormatter={(value) => nFormatter(value, 2) + (getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE === 'USD' ? ' $' : ' đ')}
          tickCount={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          align="center"
          iconSize={15}
          iconType="diamond"
          formatter={(value, entry) => (
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{value}</span>
          )}
        />
        <Bar
          yAxisId='left-axis'
          type='monotone'
          dataKey='PO_BALANCE'
          stroke='white'
          fill='#37b46b'
          label={{ position: "top", formatter: labelFormatter }}
        ></Bar>
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default KDPOBalanceSummaryByWeek;
