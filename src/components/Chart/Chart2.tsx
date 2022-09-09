import moment from 'moment';
import React, { PureComponent, useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Label, LabelList, Line } from 'recharts';
import Swal from 'sweetalert2';
import { generalQuery } from '../../api/Api';


interface DailyClosingData {
  DELIVERY_DATE: string, 
  DELIVERY_QTY: number, 
  DELIVERED_AMOUNT: number
}

const Chart2 = () => {  
  const [dailyClosingData, setDailyClosingData] = useState<Array<DailyClosingData>>([]);
  const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
  const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");

  const handleGetDailyClosing = () => {
    generalQuery("kd_dailyclosing", { START_DATE: startOfMonth, END_DATE: endOfMonth })
    .then((response) => {
      
      if (response.data.tk_status !== "NG") {
        const loadeddata: DailyClosingData[] =  response.data.data.map((element:DailyClosingData,index: number)=> {
          return {
            ...element,
            DELIVERY_DATE : element.DELIVERY_DATE.slice(0,10),            
          }
        })

        setDailyClosingData(loadeddata);
        console.log(loadeddata);
        Swal.fire(
          "Thông báo",
          "Đã load " + response.data.data.length + " dòng",
          "success"
        );
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
      data={dailyClosingData}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray='3 3' className='chartGrid' />
      <XAxis dataKey='DELIVERY_DATE'>
        {" "}
        <Label value='Ngày tháng' offset={0} position='insideBottom' />
      </XAxis>
      <YAxis
        label={{
          value: "Số lượng",
          angle: -90,
          position: "insideLeft",
        }}
      />
      <Tooltip />
      <Legend />
      <Bar dataKey='DELIVERY_QTY'  fill='#8884d8'>
        <LabelList dataKey='DELIVERY_QTY' position='inside' />
      </Bar>     
      <Line
        type='monotone'
        dataKey='DELIVERED_AMOUNT'
        stroke='#FF0000'
        activeDot={{ r: 8 }}
      ></Line>
    </ComposedChart>
  </ResponsiveContainer>
  )
}
export default Chart2

