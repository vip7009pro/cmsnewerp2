import { useEffect } from "react";
import { Cell, Tooltip, Legend, PieChart, Pie } from "recharts";
import { getGlobalSetting } from "../../../api/Api";
import { CustomResponsiveContainer, generateMultiGradientColors, nFormatter } from "../../../api/GlobalFunction";
import { WEB_SETTING_DATA } from "../../../api/GlobalInterface";
import { CNT_GAP_DATA, IQC_FAIL_PENDING } from "../../../pages/qc/interfaces/qcInterface";

const IQC_FAILING_PENDING = ({ data }: { data: IQC_FAIL_PENDING[] }) => {
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
        <div className='custom-tooltip'>
          <p className='label'>{`${payload[0].value?.toLocaleString("en-US")} m`}</p>
        </div>
      );
    }
    return null;
  };
  const CustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
    index,
  }: {
    cx?: any;
    cy?: any;
    midAngle?: any;
    innerRadius?: any;
    outerRadius?: any;
    value?: any;
    index?: any;
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = 20 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill='#d84911'
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline='central'
        fontSize={'0.9rem'}
      >
        {data[index].CUST_NAME_KD}: (
         {data[index].FAIL_QTY} met
        )
      </text>
    );
  };
  useEffect(() => {
  }, []);


const COLORS = generateMultiGradientColors(['#3dff0c','#fbff00', '#ff1100'], data.length);
//console.log('Colors', COLORS);
  return (
    <CustomResponsiveContainer>
      <PieChart width={900} height={900}>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          align="center"
          iconSize={15}
          iconType="diamond"
          formatter={(value, entry) => (
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{value}</span>
          )}
          height={10}
        />
        <Pie
          dataKey='FAIL_QTY'
          nameKey='CUST_NAME_KD'
          isAnimationActive={false}
          data={data}
          cx='50%'
          cy='50%'
          outerRadius={150}
          fill='#8884d8'
          label={CustomLabel}
        >
          {data?.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[(index) % COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </CustomResponsiveContainer>
  );
};
export default IQC_FAILING_PENDING;
