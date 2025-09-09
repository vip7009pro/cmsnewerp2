import { useEffect } from "react";
import {
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
  COLORS,
  CustomResponsiveContainer,
  ERR_TABLE,
  dynamicSort,
  nFormatter,
} from "../../../api/GlobalFunction";
import { IQC_VENDOR_NGRATE_DATA } from "../../../pages/qc/interfaces/qcInterface";
const IQcMonthlyVendorNGRateTrending = ({ dldata, onClick }: { dldata: IQC_VENDOR_NGRATE_DATA[], onClick: (e: any) => void }) => {
  const formatCash = (n: number) => {
    return nFormatter(n, 1);
  };
  const labelFormatter = (value: number) => {
    return value.toLocaleString('en-US', { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + '%';
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
      let newPayLoad = payload.sort(dynamicSort("-value"));
      //console.log(newPayLoad); 
      return (
        <div className="custom-tooltip">
          <p className="label">{`Date: ${label}`}</p>
          {Object.keys(newPayLoad[0].payload).map((key) => {
            if (key !== 'INSPECT_YM') {
              return (
                <div key={key}>
                  <p className="label">{`${key}:${newPayLoad[0].payload[key]?.toLocaleString('en-US', {                   
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}%`}</p>                 
                </div>
              );
            }
          })}
        </div>
      );
    }
    return null;
  };
  const handleClick = (e: any) => {
    // console.log(e)
    onClick(e);
  }
// Tạo danh sách các tuần duy nhất
  const months = Array.from(new Set(dldata.map(item => item.INSPECT_YM))).sort();
// Tạo dữ liệu pivot cho Recharts
const chartData = months.map(month => {
  const dataPoint: { INSPECT_YM: string; [key: string]: string | number } = { INSPECT_YM: month || '' };
  dldata.forEach(item => {
    if (item.INSPECT_YM === month) {
      dataPoint[item.CUST_NAME_KD] = item.NG_RATE * 100; // Chuyển NG_RATE thành %
    }
  });
  return dataPoint;
});

console.log('dlData',dldata)
console.log('chartData',chartData)
const customers = Array.from(new Set(dldata.map(item => item.CUST_NAME_KD)));
  
  useEffect(() => { }, []);
  return (
    <CustomResponsiveContainer>
      <ComposedChart
        onClick={(e) => { handleClick(e) }}
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' className='chartGrid' />
        <XAxis dataKey='INSPECT_YM' height={40} tick={{ fontSize: '0.7rem' }}>
          <Label value='Tháng' offset={0} position='insideBottom' style={{ fontWeight: 'normal', fontSize: '0.7rem' }} />
        </XAxis>
        <YAxis
          yAxisId='left-axis'
          label={{
            value: "NG Rate",
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
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          align="center"
          iconSize={15}
          iconType="diamond"
          formatter={(value, entry) => {
            
            return (
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{`${value}`}</span>
            )
          }} />
        {customers.map((customer, index) => (
            <Line             
            yAxisId='left-axis'
            key={customer}
            type="monotone"
            dataKey={customer}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
            connectNulls={true} // Không nối các điểm null
            dot={true} // Không hiển thị điểm trên đường line
          >
          <LabelList dataKey={`${customer}`} fill="black" position="top" formatter={labelFormatter} fontSize={"0.7rem"} />
          </Line>
          ))} 
       
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default IQcMonthlyVendorNGRateTrending;
