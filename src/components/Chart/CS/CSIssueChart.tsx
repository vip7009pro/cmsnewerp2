import { useEffect } from "react";
import { Cell, Tooltip, Legend, PieChart, Pie } from "recharts";
import { CustomResponsiveContainer, generateMultiGradientColors, nFormatter } from "../../../api/GlobalFunction";
import { CS_CONFIRM_BY_CUSTOMER_DATA } from "../../../pages/qc/interfaces/qcInterface";
import { getGlobalSetting } from "../../../api/Api";
import { WEB_SETTING_DATA } from "../../../api/GlobalInterface";

const CSIssueChart = ({data}: {data: CS_CONFIRM_BY_CUSTOMER_DATA[]}) => { 
    const formatCash = (n: number) => {  
     return nFormatter(n, 2) + ((getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD") === 'USD'?  " $": " đ");
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
          <p className='label'>{`${payload[0].value.toLocaleString("en-US", {
            style: "decimal",            
          })}`} issue</p>
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
        fill='#8884d8'
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline='central'
        fontSize={'0.9rem'}
      >
        {data[index].CUST_NAME_KD} : (
        {value.toLocaleString("en-US", {
          style: "decimal",
        })}
        -issue
        )
      </text>
    );
  };


  
  useEffect(() => {
    
  }, []);
const COLORS = generateMultiGradientColors(['#3dff0c','#fbff00', '#ff1100'], data.length);
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
          <span style={{fontSize:'0.7rem', fontWeight:'bold'}}>{value}</span>
        )}
        height={10}
        />
        <Pie
          dataKey='TOTAL'
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
              fill={COLORS[((2 * index) % COLORS.length) * 2]}
            />
          ))}
        </Pie>
      </PieChart>
    </CustomResponsiveContainer>
  );
};
export default CSIssueChart;
