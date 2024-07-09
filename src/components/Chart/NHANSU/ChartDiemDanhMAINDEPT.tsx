import moment from "moment";
import React, { PureComponent, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Label,
  LabelList,
  Line,
  PieChart,
  Pie,
} from "recharts";

import Swal from "sweetalert2";
import { DiemDanhMainDeptData, WEB_SETTING_DATA } from "../../../api/GlobalInterface";
import { CustomResponsiveContainer, nFormatter } from "../../../api/GlobalFunction";
import { generalQuery, getGlobalSetting } from "../../../api/Api";

const ChartDiemDanhMAINDEPT = () => {
  const [diemdanhMainDeptData, setDiemDanhMainDeptData] = useState<
    Array<DiemDanhMainDeptData>
  >([]);
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
          <p className='label'>{`${payload[0].value.toLocaleString(
            "en-US"
          )} người`}</p>
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
    const radius = 50 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill='black'
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline='central'
        style={{ color: "white", fontSize: '1rem' }}
      >
        {diemdanhMainDeptData[index].MAINDEPTNAME} : (
        {value.toLocaleString("en-US")} ng)
      </text>
    );
  };

  const handleGetCustomerRevenue = () => {
    generalQuery("getddmaindepttb", {
      FROM_DATE: moment.utc().format('YYYY-MM-DD'),
      TO_DATE: moment.utc().format('YYYY-MM-DD'),
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: DiemDanhMainDeptData, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          setDiemDanhMainDeptData(loadeddata);
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    handleGetCustomerRevenue();
  }, []);
  const COLORS = [
    "#cc0000",
    "#cc3300",
    "#cc6600",
    "#cc9900",
    "#cccc00",
    "#99cc00",
    "#66cc00",
    "#33cc00",
    "#00cc00",
    "#00cc33",
    "#00cc66",
    "#00cc99",
    "#00cccc",
    "#0099cc",
    "#0066cc",
    "#0033cc",
    "#0000cc",
    "#3300cc",
    "#6600cc",
    "#9900cc",
    "#cc00cc",
    "#cc0099",
    "#cc0066",
    "#cc0033",
    "#cc0000",
  ];
  return (
    <CustomResponsiveContainer>
      <PieChart width={500} height={400}>
        <Tooltip content={<CustomTooltip />} />
        <Pie
          dataKey='COUNT_TOTAL'
          nameKey='MAINDEPTNAME'
          isAnimationActive={false}
          data={diemdanhMainDeptData}
          cx='50%'
          cy='50%'
          outerRadius={150}
          fill='#8884d8'
          label={CustomLabel}
          labelLine={true}
        >
          {diemdanhMainDeptData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[((2 + index) * 3) % COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </CustomResponsiveContainer>
  );
};
export default ChartDiemDanhMAINDEPT;
