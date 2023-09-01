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
  ResponsiveContainer,
  ComposedChart,
  Label,
  LabelList,
  Line,
  PieChart,
  Pie,
} from "recharts";

import Swal from "sweetalert2";
import { generalQuery } from "../../api/Api";
import { CustomResponsiveContainer } from "../../api/GlobalFunction";
interface WeeklyClosingData {
  CUST_NAME_KD: string;
  DELIVERY_AMOUNT: number;
}
const ChartCustomerRevenue = () => {
  const [weeklyClosingData, setWeeklyClosingData] = useState<
    Array<WeeklyClosingData>
  >([]);
  const formatCash = (n: number) => {
    if (n < 1e3) return n;
    if (n >= 1e3) return +(n / 1e3).toFixed(1) + "K$";
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
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}`}</p>
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
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="#8884d8"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {weeklyClosingData[index].CUST_NAME_KD} : (
        {value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
        )
      </text>
    );
  };

  const handleGetCustomerRevenue = () => {
    let sunday = moment().clone().weekday(0).format("YYYY-MM-DD");
    let monday = moment().clone().weekday(6).format("YYYY-MM-DD");
    generalQuery("customerRevenue", { START_DATE: sunday, END_DATE: monday })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          let loadeddata: WeeklyClosingData[] = response.data.data.map(
            (element: WeeklyClosingData, index: number) => {
              return {
                ...element,
              };
            },
          );

          loadeddata = loadeddata.splice(0, 5);
          //console.log(loadeddata);
          setWeeklyClosingData(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          sunday = moment()
            .clone()
            .weekday(0)
            .add(-7, "days")
            .format("YYYY-MM-DD");
          monday = moment()
            .clone()
            .weekday(6)
            .add(-7, "days")
            .format("YYYY-MM-DD");
          generalQuery("customerRevenue", {
            START_DATE: sunday,
            END_DATE: monday,
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                //console.log(response.data.data);
                let loadeddata: WeeklyClosingData[] = response.data.data.map(
                  (element: WeeklyClosingData, index: number) => {
                    return {
                      ...element,
                    };
                  },
                );

                loadeddata = loadeddata.splice(0, 5);
                //console.log(loadeddata);
                setWeeklyClosingData(loadeddata);
              } else {
                //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
              }
            })
            .catch((error) => {
              console.log(error);
            });
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
      <PieChart width={900} height={900}>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Pie
          dataKey="DELIVERY_AMOUNT"
          nameKey="CUST_NAME_KD"
          isAnimationActive={false}
          data={weeklyClosingData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label={CustomLabel}
        >
          {weeklyClosingData.map((entry, index) => (
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
export default ChartCustomerRevenue;
