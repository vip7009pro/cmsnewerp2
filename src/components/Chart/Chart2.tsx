import moment from 'moment';
import React, { PureComponent, useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Label, LabelList, Line } from 'recharts';
import Swal from 'sweetalert2';
import { generalQuery } from '../../api/Api';
import { CustomResponsiveContainer } from '../../api/GlobalFunction';


interface DailyClosingData {
  DELIVERY_DATE: string, 
  DELIVERY_QTY: number, 
  DELIVERED_AMOUNT: number
}

const Chart2 = () => {  
  const [dailyClosingData, setDailyClosingData] = useState<Array<DailyClosingData>>([]);
  /* const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
  const endOfMonth = moment().endOf("month").format("YYYY-MM-DD"); */
  const startOfMonth = moment().add(-20, "day").format("YYYY-MM-DD");
  const endOfMonth = moment().format("YYYY-MM-DD");

  const formatCash = (n:number) => {
    if (n < 1e3) return n;
    if (n >= 1e3) return +(n / 1e3).toFixed(1) + "K$";
  };

  const labelFormatter = (value: number) => {
    return formatCash(value);
  };

  const CustomTooltip = ({ active, payload, label } : {active?:any, payload?:any, label?: any}) => {
    if (active && payload && payload.length) {
      return (
        <div className='custom-tooltip' style={{backgroundImage: "linear-gradient(to right, #ccffff, #00cccc)", padding: 20, borderRadius: 5}}>
		  <p>Ngày {label}:</p>
          <p className='label'>QTY: {`${payload[0].value.toLocaleString("en-US")}`} EA</p>
          <p className='label'>AMOUNT: {`${payload[1].value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}`}</p>
        </div>
      );
    }
    return null;
}

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
  }

  useEffect(()=> {
    handleGetDailyClosing();
  },[]);
  return (
    <CustomResponsiveContainer>
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
      <YAxis yAxisId="left-axis"  label={{
          value: "Số lượng",
          angle: -90,
          position: "insideLeft",
        }} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short" }).format(value)}  tickCount={6}/>
      <YAxis yAxisId="right-axis" orientation="right" 
       label={{
        value: "Số tiền",
        angle: -90,
        position: "insideRight",
      }} tickFormatter={(value) => new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3}).format(value) + '$'}  tickCount={10} />
      <Tooltip content={<CustomTooltip/>}/>
      <Legend />
      <Line yAxisId="left-axis" type="monotone" dataKey="DELIVERY_QTY" stroke="green"/>
      <Bar yAxisId="right-axis" type="monotone" dataKey="DELIVERED_AMOUNT" stroke="white" fill='#cc66ff' label={{ position: 'top', formatter: labelFormatter }}>      
      </Bar>
    </ComposedChart>
    </CustomResponsiveContainer>
  )
}
export default Chart2
