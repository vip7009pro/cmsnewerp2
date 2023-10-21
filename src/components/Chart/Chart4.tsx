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
  Label,
} from "recharts";
import Swal from "sweetalert2";
import { generalQuery } from "../../api/Api";
import { CustomResponsiveContainer, nFormatter } from "../../api/GlobalFunction";
import { RunningPOData } from "../../api/GlobalInterface";

const ChartPOBalance = () => {
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
          className='custom-tooltip'
          style={{
            backgroundImage: "linear-gradient(to right, #ccffff, #00cccc)",
            padding: 20,
            borderRadius: 5,
          }}
        >
          <p>{label}:</p>
          <p className='label'>
            QTY: {`${payload[1].value.toLocaleString("en-US")}`} EA
            <br></br>
            AMOUNT: {`${payload[0].value.toLocaleString("en-US")}`} USD
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
                  ? index >0 ? response.data.data[index - 1].RUNNING_DEL_QTY: element.RUNNING_DEL_QTY
                  : element.RUNNING_DEL_QTY;
              let temp_amount_data: number =
                element.RUNNING_DEL_AMOUNT === 0
                  ? index >0 ? response.data.data[index - 1].RUNNING_DEL_AMOUNT: element.RUNNING_DEL_AMOUNT
                  : element.RUNNING_DEL_AMOUNT;
              return {
                ...element,
                RUNNING_DEL_QTY: temp_data,
                RUNNING_PO_BALANCE: element.RUNNING_PO_QTY - temp_data,
                RUNNING_DEL_AMOUNT: temp_amount_data,
                RUNNING_BALANCE_AMOUNT: element.RUNNING_PO_AMOUNT - temp_amount_data
              };
            }
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
  const CustomLabel = (props:any) => {
    //console.log(props);
    return (
      <g>
        <rect
          x={props.viewBox.x}
          y={props.viewBox.y}
          fill="#aaa" 
          style={{transform:`rotate(90deg)`}}
        />
        <text x={props.viewBox.x} y={props.viewBox.y} fill="#000000" dy={20} dx={15} fontSize={'0.7rem'} fontWeight={'bold'}>
          {formatCash(props.value)}
        </text>
      </g>
    );
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
        <XAxis dataKey='YEAR_WEEK'  height={40} tick={{fontSize:'0.7rem'}}>          
          <Label value='Tuần' offset={0} position='insideBottom' style={{fontWeight:'normal', fontSize:'0.7rem'}}  />
        </XAxis>
        <YAxis
          width={50}
          yAxisId='left-axis'
          label={{
            value: "Số lượng",
            angle: -90,
            position: "insideLeft",
            fontSize:'0.7rem' 
          }}
          tick={{fontSize:'0.7rem'}}
          tickFormatter={(value) =>
            new Intl.NumberFormat("en", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value)
          }
          tickCount={12}
        />
        <YAxis
          yAxisId='right-axis'
          orientation='right'
          label={{
            value: "Số tiền",
            angle: -90,
            position: "insideRight",
            fontSize:'0.7rem'    
          }}
          tick={{fontSize:'0.7rem'}}
          tickFormatter={(value) => nFormatter(value, 2) + "$"}
          tickCount={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
        verticalAlign="top"
        align="center"
        iconSize={15}
        iconType="diamond"
        formatter={(value, entry) => (
          <span style={{fontSize:'0.7rem', fontWeight:'bold'}}>{value}</span>
        )}
        />       
        <Bar
          yAxisId='right-axis'
          type='monotone'
          dataKey='RUNNING_BALANCE_AMOUNT'
          stroke='white'
          fill='#c69ff3'        
          label={CustomLabel}
        ></Bar>
         <Line
          yAxisId='left-axis'
          type='monotone'
          dataKey='RUNNING_PO_BALANCE'
          stroke='green'
          fill='#ff0000'
          label={{ position: "top", formatter: labelFormatter }}
        ></Line>
      </ComposedChart>
    </CustomResponsiveContainer>
  );
};
export default ChartPOBalance;
