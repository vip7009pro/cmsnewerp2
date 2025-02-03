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
import { MonthlyClosingData, WEB_SETTING_DATA } from "../../../api/GlobalInterface";
const ChartMonthLy = ({data}: {data: MonthlyClosingData[]}) => {
    const digit: number = getCompany()==='CMS' ? 1: 2;
  const [monthlyClosingData, setMonthlyClosingData] = useState<
    Array<MonthlyClosingData>
  >([]);
  const formatCash = (n: number) => {
    return nFormatter(n, digit) + ((getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD") === 'USD'?  " $": " đ");
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
          <p>Tháng {label}:</p>
          <p className='label'>
            QTY: {`${payload[0].value.toLocaleString("en-US")}`} EA
          </p>
          <p className='label'>
            AMOUNT:{" "}
            {`${payload[1].value.toLocaleString("en-US", {
              style: "currency",
              currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
            })}`}
          </p>
        </div>
      );
    }
    return null;
  };
  const labelFormatter = (value: number) => {
    return formatCash(value);
  };
  const handleGetMonthlyClosing = () => {
    generalQuery("kd_monthlyclosing", { YEAR: moment().format("YYYY") })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: MonthlyClosingData[] = response.data.data.map(
            (element: MonthlyClosingData, index: number) => {
              return {
                ...element,
              };
            }
          );
          setMonthlyClosingData(loadeddata.reverse());
          
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          generalQuery("kd_monthlyclosing", { YEAR: parseInt(moment().format("YYYY"))-1 })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              const loadeddata: MonthlyClosingData[] = response.data.data.map(
                (element: MonthlyClosingData, index: number) => {
                  return {
                    ...element,
                  };
                }
              );
              setMonthlyClosingData(loadeddata.reverse());              
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
    //handleGetMonthlyClosing();
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
        <XAxis dataKey='MONTH_YW' tick={{ fontSize: '0.7rem' }}>
          <Label value='Tháng' offset={0} position='insideBottom' style={{ fontWeight: 'normal', fontSize: '0.7rem' }} />
        </XAxis>
        <YAxis
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
        />
        <YAxis
          yAxisId='right-axis'
          orientation='right'
          label={{
            value: "Số tiền",
            angle: -90,
            position: "insideRight",
            fontSize: '0.7rem'
          }}
          tick={{ fontSize: '0.7rem' }}
          tickFormatter={(value) => nFormatter(value, 2) + (getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE==='USD'? ' $' : ' đ')}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          align="center"
          iconSize={15}
          iconType="diamond"
          formatter={(value, entry) => (
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color:'black' }}>{value}</span>
          )}
        />
        <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='DELIVERY_QTY'
          stroke='blue'
        />
        <Bar
          yAxisId='right-axis'
          type='monotone'
          dataKey='DELIVERED_AMOUNT'
          stroke='#196619'
          fill='#f1eda7'
          label={CustomLabel}
        ></Bar>
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default ChartMonthLy;
