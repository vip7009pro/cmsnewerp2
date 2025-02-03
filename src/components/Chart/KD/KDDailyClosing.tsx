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
import { generalQuery, getCompany, getGlobalSetting } from "../../../api/Api";
import {
  CustomResponsiveContainer,
  nFormatter,
} from "../../../api/GlobalFunction";
import { DailyClosingData, WEB_SETTING_DATA } from "../../../api/GlobalInterface";
const ChartDaily = ({ data }: { data: DailyClosingData[] }) => {
  const [dailyClosingData, setDailyClosingData] = useState<
    Array<DailyClosingData>
  >([]);
  /* const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
  const endOfMonth = moment().endOf("month").format("YYYY-MM-DD"); */
  const startOfMonth = moment().add(-12, "day").format("YYYY-MM-DD");
  const endOfMonth = moment().format("YYYY-MM-DD");
  const digit: number = getCompany()==='CMS' ? 0: 2;
  const formatCash = (n: number) => {
    /*  if (n < 1e3) return n;
     if (n >= 1e3) return +(n / 1e3).toFixed(1) + "K$"; */
    return nFormatter(n, digit) + ((getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD") === 'USD' ? " $" : " đ");
  };
  const labelFormatter = (value: number) => {
    return formatCash(value);
  };
  const CustomLegend = (payload: any) => {
    return (
      <ul>
        {payload.map((entry: any, index: number) => (
          <li key={`legend-${index}`} style={{ color: entry.color }}>
            <span>{entry.value}</span>
          </li>
        ))}
      </ul>
    );
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
          <p>Ngày {label}:</p>
          <p className='label'>
            QTY: {`${payload[0].value.toLocaleString("en-US")}`} EA
          </p>
          <p className='label'>
            AMOUNT:{" "}
            {`${payload[1].value.toLocaleString("en-US", {
              style: "currency",
              currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
            })}`}
          </p>
        </div>
      );
    }
    return null;
  };
  const handleGetDailyClosing = () => {
    generalQuery("kd_dailyclosing", {
      START_DATE: startOfMonth,
      END_DATE: endOfMonth,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: DailyClosingData[] = response.data.data.map(
            (element: DailyClosingData, index: number) => {
              return {
                ...element,
                DELIVERY_DATE: element.DELIVERY_DATE.slice(0, 10),
              };
            }
          );
          setDailyClosingData(loadeddata);
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const CustomLabel = (props: any) => {
    //console.log(props);
    return (
      <g>
        <rect
          x={props.viewBox.x}
          y={props.viewBox.y}
          fill="#aaa"
          style={{ transform: `rotate(90deg)` }}
        />
        <text x={props.viewBox.x} y={props.viewBox.y} fill="#000000" dy={-10} dx={0} fontSize={'0.7rem'} fontWeight={'bold'}>
          {formatCash(props.value)}
        </text>
      </g>
    );
  };
  useEffect(() => {
    //handleGetDailyClosing();
  }, []);
  return (
    <CustomResponsiveContainer>
      <ComposedChart
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
        <CartesianGrid strokeDasharray='3 3' className='chartGrid' />
        <XAxis dataKey='DELIVERY_DATE' height={40} tick={{ fontSize: '0.7rem' }}>
          <Label value='Ngày tháng' offset={0} position='insideBottom' style={{ fontWeight: 'normal', fontSize: '0.7rem' }} />
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
          tickCount={6}
        />
        <YAxis
          width={70}
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
          tickCount={10}
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
        <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='DELIVERY_QTY'
          stroke='green'
        />
        <Bar
          yAxisId='right-axis'
          type='monotone'
          dataKey='DELIVERED_AMOUNT'
          stroke='white'
          fill='#52aaf1'
          /*  label={{ position: "top", formatter: labelFormatter }} */
          label={CustomLabel}
        >
        </Bar>
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default ChartDaily;
