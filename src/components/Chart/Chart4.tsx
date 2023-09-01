import moment from "moment";
import React, { PureComponent, useEffect, useState } from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
  Label,
} from "recharts";
import Swal from "sweetalert2";
import { generalQuery } from "../../api/Api";
import { CustomResponsiveContainer } from "../../api/GlobalFunction";
interface RunningPOData {
  PO_YEAR: number;
  PO_WEEK: number;
  YEAR_WEEK: string;
  RUNNING_PO_QTY: number;
  RUNNING_DEL_QTY: number;
  RUNNING_PO_BALANCE: number;
}
const Chart4 = () => {
  const [runningPOData, setRunningPOData] = useState<Array<RunningPOData>>([]);
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
        <div
          className="custom-tooltip"
          style={{
            backgroundImage: "linear-gradient(to right, #ccffff, #00cccc)",
            padding: 20,
            borderRadius: 5,
          }}
        >
          <p>{label}:</p>
          <p className="label">
            QTY: {`${payload[0].value.toLocaleString("en-US")}`} EA
          </p>
        </div>
      );
    }
    return null;
  };

  const handleGetDailyClosing = () => {
    generalQuery("kd_runningpobalance", { YEAR: moment().format("YYYY") })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: RunningPOData[] = response.data.data.map(
            (element: RunningPOData, index: number) => {
              let temp_data: number =
                element.RUNNING_DEL_QTY === 0
                  ? response.data.data[index - 1].RUNNING_DEL_QTY
                  : element.RUNNING_DEL_QTY;
              return {
                ...element,
                RUNNING_DEL_QTY: temp_data,
                RUNNING_PO_BALANCE: element.RUNNING_PO_QTY - temp_data,
              };
            },
          );
          setRunningPOData(loadeddata);
          //console.log(loadeddata);
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
        data={runningPOData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {" "}
        <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
        <XAxis dataKey="YEAR_WEEK">
          {" "}
          <Label value="Tuần" offset={0} position="insideBottom" />
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
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          yAxisId="left-axis"
          type="monotone"
          dataKey="RUNNING_PO_BALANCE"
          stroke="white"
          fill="#00b3b3"
          label={{ position: "top", formatter: labelFormatter }}
        ></Bar>
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default Chart4;
