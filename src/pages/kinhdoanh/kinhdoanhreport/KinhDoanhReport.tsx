import moment from 'moment'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { generalQuery } from '../../../api/Api'
import Chart from '../../../components/Chart/Chart'
import Chart2 from '../../../components/Chart/Chart2'
import Chart3 from '../../../components/Chart/Chart3'
import Chart4 from '../../../components/Chart/Chart4'
import Widget from '../../../components/Widget/Widget'
import './KinhDoanhReport.scss'

interface InvoiceTableData {
  DELIVERY_ID: number,
  CUST_CD: string,
  CUST_NAME_KD: string,
  EMPL_NO: string,
  EMPL_NAME: string,
  G_CODE: string,
  G_NAME: string,
  G_NAME_KD: string,
  PO_NO: string,
  DELIVERY_DATE: string,
  DELIVERY_QTY: number,
  PROD_PRICE: string,
  DELIVERED_AMOUNT: number,
  REMARK: string,
  INVOICE_NO: string,
  PROD_TYPE: string,
  PROD_MODEL: string,
  PROD_PROJECT: string,
  YEARNUM: number,
  WEEKNUM: number  
}
interface InvoiceSummaryData {
  total_po_qty :number,
  total_delivered_qty: number,
  total_pobalance_qty: number,
  total_po_amount :number,
  total_delivered_amount: number,
  total_pobalance_amount: number,
}
interface WidgetData {
  yesterday_qty: number,
  yesterday_amount: number,
  before_yesterday_qty: number,
  before_yesterday_amount: number,
  yesterday_percentage: number,
  thisweek_qty: number,
  thisweek_amount: number,
  lastweek_qty: number,
  lastweek_amount: number,
  thisweek_percentage: number,
  thismonth_qty: number,
  thismonth_amount: number,
  lastmonth_qty: number,
  lastmonth_amount: number,
  thismonth_percentage: number,
  thisyear_qty: number,
  thisyear_amount: number,
  lastyear_qty: number,
  lastyear_amount: number
}
interface WidgetData_Yesterday {
  yesterday_qty: number,
  yesterday_amount: number,  
}
interface WidgetData_ThisWeek{
  thisweek_qty: number,
  thisweek_amount: number,
}
interface WidgetData_ThisMonth{
  thismonth_qty: number,
  thismonth_amount: number,
}
interface WidgetData_ThisYear{
  thisyear_qty: number,
  thisyear_amount: number,
}
const KinhDoanhReport = () => {

  const [widgetdata_yesterday, setWidgetData_Yesterday] = useState<WidgetData_Yesterday>({
    yesterday_qty: 0,
    yesterday_amount: 0,  
  })
  const [widgetdata_thisweek, setWidgetData_ThisWeek] = useState<WidgetData_ThisWeek>({
    thisweek_qty: 0,
    thisweek_amount: 0,
  })
  const [widgetdata_thismonth, setWidgetData_ThisMonth] = useState<WidgetData_ThisMonth>({
    thismonth_qty: 0,
    thismonth_amount: 0,
  })
  const [widgetdata_thisyear, setWidgetData_ThisYear] = useState<WidgetData_ThisYear>({
    thisyear_qty: 0,
    thisyear_amount: 0,
  })
const handletraInvoice = (invoice_type: string, invoice_order: string, start_date: string, end_date:string)=> {  
    generalQuery('traInvoiceDataFull',{
    alltime: false,
    justPoBalance: false,
    start_date:  start_date,
    end_date: end_date,
    cust_name: '',
    codeCMS: '',
    codeKD: '',
    prod_type: '',
    empl_name: '',
    po_no: '',
    over:'',
    id: '',
    material: '',
  })
  .then(response => {
      //console.log(response.data);
      if(response.data.tk_status !=='NG')
      {
        const loadeddata: InvoiceTableData[] =  response.data.data.map((element:InvoiceTableData,index: number)=> {
          return {
            ...element,
            DELIVERY_DATE : element.DELIVERY_DATE.slice(0,10),              
          }
        })

        let total_qty:number =0;
        let total_amount:number =0;

        for(let i=0;i<loadeddata.length;i++)
        {            
          total_qty += loadeddata[i].DELIVERY_QTY;           
          total_amount += loadeddata[i].DELIVERED_AMOUNT;                  
        }
        /* console.log("TOTAL QTY = " + total_qty);
        console.log("TOTAL AMOUNT = " + total_amount); */

        if(invoice_type === 'day')
        {
          if(invoice_order==='this')
          {
            setWidgetData_Yesterday({
              yesterday_qty: total_qty,
              yesterday_amount: total_amount,  
            })
          }     
        }
        else if(invoice_type === 'week')
        {
          if(invoice_order==='this')
          {
            setWidgetData_ThisWeek({
              thisweek_qty: total_qty,
              thisweek_amount: total_amount,  
            })
          }
        }
        else if(invoice_type === 'month')
        {
          if(invoice_order==='this')
          {
            setWidgetData_ThisMonth({
              thismonth_qty: total_qty,
              thismonth_amount: total_amount,  
            })
          }
         
        }
        else if(invoice_type === 'year')
        {
          if(invoice_order==='this')
          {
            setWidgetData_ThisYear({
              thisyear_qty: total_qty,
              thisyear_amount: total_amount,  
            })
          }
          
        }
        ///Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
      }
      else
      {
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error"); 
      }        
  })
  .catch(error => {
      console.log(error);
  });
}
useEffect(()=> {      
  let now = moment();
  let yesterday = moment().add(-1, "day").format("YYYY-MM-DD");
  let sunday = now.clone().weekday(0).format('YYYY-MM-DD');
  let monday = now.clone().weekday(6).format('YYYY-MM-DD');
  const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
  const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
  const startOfYear =  moment().format("YYYY-01-01");
  const rightnow =  now.format("YYYY-MM-DD");

  handletraInvoice('day', 'this',yesterday,yesterday);
  handletraInvoice('week', 'this',sunday,monday);
  handletraInvoice('month', 'this',startOfMonth,endOfMonth);
  handletraInvoice('year', 'this',startOfYear,rightnow);
},[]);

  return (
    <div className='kinhdoanhreport'>
      <div className='doanhthureport'>
        <span className='section_title'>1. Doanh thu</span>
        <div className='revenuewidget'>
          <div className='revenuwdg'>
            <Widget widgettype='revenue' label='Hôm qua' topColor='#b3c6ff' botColor='#b3ecff' qty={widgetdata_yesterday.yesterday_qty} amount={widgetdata_yesterday.yesterday_amount} percentage={20}/> 
          </div>
          <div className='revenuwdg'>
            <Widget widgettype='revenue' label='Tuần này' topColor='#ccffcc' botColor='#80ff80' qty={widgetdata_thisweek.thisweek_qty} amount={widgetdata_thisweek.thisweek_amount} percentage={20}/>
          </div>
          <div className='revenuwdg'>
            <Widget widgettype='revenue' label='Tháng này'  topColor='#fff2e6' botColor='#ffbf80' qty={widgetdata_thismonth.thismonth_qty} amount={widgetdata_thismonth.thismonth_amount} percentage={20}/>
          </div>
          <div className='revenuwdg'>
            <Widget widgettype='revenue' label='Năm nay'   topColor='#ffe6e6' botColor='#ffb3b3' qty={widgetdata_thisyear.thisyear_qty} amount={widgetdata_thisyear.thisyear_amount} percentage={20}/>
          </div>
        </div>
        <span className='section_title'>2.Trending</span>
        <div className='graph'>
          <div className='dailygraphtotal'>
            <div className='dailygraph'>
              <Chart2 />
            </div>
          </div>
          <div className='monthlyweeklygraph'>
            <div className='dailygraph'>
              <Chart />
            </div>
            <div className='dailygraph'>
              <Chart />
            </div>
            <div className='dailygraph'>
              <Chart />
            </div>
          </div>
          <div className='monthlyweeklygraph'>
            <div className='dailygraph'>
              <Chart3 />
            </div>
            <div className='dailygraph'>
              <Chart3 />
            </div>           
          </div>         
          <div className='monthlyweeklygraph'>
            <div className='dailygraph'>
              <Chart4 />
            </div>                   
          </div>         
        </div>
      </div>
      <div className='poreport'></div>
    </div>
  );
}

export default KinhDoanhReport