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
import { WeekLyPOData } from "../../api/GlobalInterface";

const ChartWeeklyPO = () => {
  const [runningPOData, setWeekLyPOData] = useState<Array<WeekLyPOData>>([]);
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
          className='custom-tooltip'
          style={{
            backgroundImage: "linear-gradient(to right, #ccffff, #00cccc)",
            padding: 20,
            borderRadius: 5,
          }}
        >
          <p>{label}:</p>
          <p className='label'>
            QTY: {`${payload[0].value.toLocaleString("en-US")}`} EA
          </p>
        </div>
      );
    }
    return null;
  };
  const handleGetDailyClosing = () => {
    generalQuery("kd_pooverweek", { YEAR: moment().format("YYYY") })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: WeekLyPOData[] = response.data.data.map(
            (element: WeekLyPOData, index: number) => {
              return {
                ...element,
              };
            }
          );
          setWeekLyPOData(loadeddata);
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
        <CartesianGrid strokeDasharray='3 3' className='chartGrid' />
        <XAxis dataKey='YEAR_WEEK'>
          {" "}
          <Label value='Tuần' offset={0} position='insideBottom' />
        </XAxis>
        <YAxis
          yAxisId='left-axis'
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
          tickCount={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          yAxisId='left-axis'
          type='monotone'
          dataKey='WEEKLY_PO_QTY'
          stroke='white'
          fill='#bb99ff'
          label={{ position: "top", formatter: labelFormatter }}
        ></Bar>
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default ChartWeeklyPO;
