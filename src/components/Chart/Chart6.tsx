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
} from "recharts";
import Swal from "sweetalert2";
import { generalQuery } from "../../api/Api";
import {
  CustomResponsiveContainer,
  nFormatter,
} from "../../api/GlobalFunction";

interface YearlyClosingData {
  YEAR_NUM: string;
  DELIVERY_QTY: number;
  DELIVERED_AMOUNT: number;
}

const ChartYearly = () => {
  const [yearlyClosingData, setYearlyClosingData] = useState<
    Array<YearlyClosingData>
  >([]);
  const formatCash = (n: number) => {
    return nFormatter(n, 2) + "$";
  };

  const labelFormatter = (value: number) => {
    return formatCash(value);
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
          className="custom-tooltip"
          style={{
            backgroundImage: "linear-gradient(to right, #ccffff, #00cccc)",
            padding: 20,
            borderRadius: 5,
          }}
        >
          <p>Năm {label}:</p>
          <p className="label">
            QTY: {`${payload[0].value.toLocaleString("en-US")}`} EA
          </p>
          <p className="label">
            AMOUNT:{" "}
            {`${payload[1].value.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleGetDailyClosing = () => {
    generalQuery("kd_annuallyclosing", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: YearlyClosingData[] = response.data.data.map(
            (element: YearlyClosingData, index: number) => {
              return {
                ...element,
              };
            },
          );
          setYearlyClosingData(loadeddata);
          //console.log(loadeddata);
          /*  Swal.fire(
          "Thông báo",
          "Đã load " + response.data.data.length + " dòng",
          "success"
        ); */
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    handleGetDailyClosing();
  }, []);
  return (
    <CustomResponsiveContainer>
      <ComposedChart
        width={500}
        height={300}
        data={yearlyClosingData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
        <XAxis dataKey="YEAR_NUM">
          <Label value="Năm" offset={0} position="insideBottom" />
        </XAxis>
        <YAxis
          yAxisId="left-axis"
          label={{
            value: "Số lượng",
            angle: -90,
            position: "insideLeft",
          }}
          tickFormatter={(value) =>
            new Intl.NumberFormat("en", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value)
          }
        />
        <YAxis
          yAxisId="right-axis"
          orientation="right"
          label={{
            value: "Số tiền",
            angle: -90,
            position: "insideRight",
          }}
          tickFormatter={(value) => nFormatter(value, 2) + "$"}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          yAxisId="left-axis"
          type="monotone"
          dataKey="DELIVERY_QTY"
          stroke="blue"
        />
        <Bar
          yAxisId="right-axis"
          type="monotone"
          dataKey="DELIVERED_AMOUNT"
          stroke="#ff6666"
          fill="#ff1a1a"
          label={{ position: "top", formatter: labelFormatter }}
        ></Bar>
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default ChartYearly;
