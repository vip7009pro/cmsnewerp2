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
} from "recharts";
import Swal from "sweetalert2";
import { generalQuery, getGlobalSetting } from "../../../api/Api";
import { CustomResponsiveContainer, nFormatter } from "../../../api/GlobalFunction";
import { WEB_SETTING_DATA, WeeklyClosingData } from "../../../api/GlobalInterface";

const ChartWeekLyDelivery = () => {
  const [weeklyClosingData, setWeeklyClosingData] = useState<
    Array<WeeklyClosingData>
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
        <div
          className='custom-tooltip'
          style={{
            backgroundImage: "linear-gradient(to right, #ccffff, #00cccc)",
            padding: 20,
            borderRadius: 5,
          }}
        >
          <p>W{label}:</p>
          <p className='label'>
            BALANCE QTY: {`${payload[0].value.toLocaleString("en-US")}`} EA
          </p>
        </div>
      );
    }
    return null;
  };
  const handleGetDailyClosing = () => {
    console.log('vao day');
    generalQuery("kd_weeklyclosing", { YEAR: moment().format("YYYY") })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: WeeklyClosingData[] = response.data.data.map(
            (element: WeeklyClosingData, index: number) => {
              return {
                ...element,
              };
            }
          );
          setWeeklyClosingData(loadeddata);
          //console.log(loadeddata);
          /* Swal.fire(
          "Thông báo",
          "Đã load " + response.data.data.length + " dòng",
          "success"
        ); */
        } else {

          let lastyear: number = parseInt(moment().year.toString())-1;
          console.log('lastyear',lastyear);
          generalQuery("kd_weeklyclosing", { YEAR: lastyear })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              const loadeddata: WeeklyClosingData[] = response.data.data.map(
                (element: WeeklyClosingData, index: number) => {
                  return {
                    ...element,
                  };
                }
              );
              setWeeklyClosingData(loadeddata);
              //console.log(loadeddata);
              /* Swal.fire(
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


          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
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
        data={weeklyClosingData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' className='chartGrid' />
        <XAxis dataKey='DEL_WEEK'>
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
          tickCount={7}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          yAxisId='left-axis'
          type='monotone'
          dataKey='DELIVERY_QTY'
          stroke='#804d00'
          fill='#77b300'
          label={{ position: "top", formatter: labelFormatter }}
        ></Bar>
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default ChartWeekLyDelivery;
