import moment from 'moment';
import React, { PureComponent, useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Label, LabelList, Line } from 'recharts';
import Swal from 'sweetalert2';
import { generalQuery } from '../../api/Api';


interface MonthlyClosingData {
  MONTH_NUM: string, 
  DELIVERY_QTY: number, 
  DELIVERED_AMOUNT: number
}

const ChartMonthLy = () => {  
  const [monthlyClosingData, setMonthlyClosingData] = useState<Array<MonthlyClosingData>>([]);
  const formatCash = (n:number) => {
    if (n < 1e3) return n;
    if (n >= 1e3) return +(n / 1e3).toFixed(1) + "K$";
  };

  const labelFormatter = (value: number) => {
    return formatCash(value);
  };

  const handleGetDailyClosing = () => {
    generalQuery("kd_monthlyclosing", { YEAR: moment().format("YYYY") })
    .then((response) => {      
      if (response.data.tk_status !== "NG") {
        const loadeddata: MonthlyClosingData[] =  response.data.data.map((element:MonthlyClosingData,index: number)=> {
          return {
            ...element,
          }
        });
        setMonthlyClosingData(loadeddata);
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
  }

  useEffect(()=> {
    handleGetDailyClosing();
  },[]);
  return (
    <ResponsiveContainer width='99%' height='100%'>
    <ComposedChart
      width={500}
      height={300}
      data={monthlyClosingData}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray='3 3' className='chartGrid' />
      <XAxis dataKey='MONTH_NUM'>        
        <Label value='Tháng' offset={0} position='insideBottom' />
      </XAxis>
      <YAxis yAxisId="left-axis"  label={{
          value: "Số lượng",
          angle: -90,
          position: "insideLeft",
        }} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short" }).format(value)}/>
      <YAxis yAxisId="right-axis" orientation="right" 
       label={{
        value: "Số tiền",
        angle: -90,
        position: "insideRight",
      }} tickFormatter={(value) => new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3}).format(value) + '$'}/>
      <Tooltip />
      <Legend />
      <Line yAxisId="left-axis" type="monotone" dataKey="DELIVERY_QTY" stroke="blue"/>
      <Bar yAxisId="right-axis" type="monotone" dataKey="DELIVERED_AMOUNT" stroke="#196619" fill='#33cc33' label={{ position: 'top', formatter: labelFormatter }}>      
      </Bar>
    </ComposedChart>
  </ResponsiveContainer>
  )
}
export default ChartMonthLy

