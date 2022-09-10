import moment from 'moment';
import React, { PureComponent, useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Label, LabelList, Line } from 'recharts';
import Swal from 'sweetalert2';
import { generalQuery } from '../../api/Api';


interface YearlyClosingData {
  YEAR_NUM: string, 
  DELIVERY_QTY: number, 
  DELIVERED_AMOUNT: number
}

const ChartYearly = () => {  
  const [yearlyClosingData, setYearlyClosingData] = useState<Array<YearlyClosingData>>([]);
  const formatCash = (n:number) => {
    if (n < 1e3) return n;
    if (n >= 1e3) return +(n / 1e3).toFixed(1) + "K$";
  };

  const labelFormatter = (value: number) => {
    return formatCash(value);
  };

  const handleGetDailyClosing = () => {
    generalQuery("kd_annuallyclosing", {  })
    .then((response) => {      
      if (response.data.tk_status !== "NG") {
        const loadeddata: YearlyClosingData[] =  response.data.data.map((element:YearlyClosingData,index: number)=> {
          return {
            ...element,
          }
        });
        setYearlyClosingData(loadeddata);
        console.log(loadeddata);
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
      data={yearlyClosingData}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray='3 3' className='chartGrid' />
      <XAxis dataKey='YEAR_NUM'>        
        <Label value='Năm' offset={0} position='insideBottom' />
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
      <Bar yAxisId="right-axis" type="monotone" dataKey="DELIVERED_AMOUNT" stroke="#ff6666" fill='#ff1a1a' label={{ position: 'top', formatter: labelFormatter }}>      
      </Bar>
    </ComposedChart>
  </ResponsiveContainer>
  )
}
export default ChartYearly

