import moment from "moment";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import ChartWeekLy from "../../../components/Chart/Chart";
import Chart from "../../../components/Chart/Chart";
import Chart2 from "../../../components/Chart/Chart2";
import Chart3 from "../../../components/Chart/Chart3";
import Chart4 from "../../../components/Chart/Chart4";
import ChartMonthLy from "../../../components/Chart/Chart5";
import ChartYearly from "../../../components/Chart/Chart6";
import Chart7 from "../../../components/Chart/Chart7";
import ChartCustomerRevenue from "../../../components/Chart/ChartCustomerRevenue";
import ChartFCSTSamSung from "../../../components/Chart/ChartFCSTSamSung";
import ChartPICRevenue from "../../../components/Chart/ChartPICRevenue";
import ChartWeekLyDelivery from "../../../components/Chart/ChartWeeklyDelivery";
import ChartWeeklyPO from "../../../components/Chart/ChartWeekLyPO";
import CustomerPOBalanceByType from "../../../components/DataTable/CustomerPOBalanceByType";
import Widget from "../../../components/Widget/Widget";
import WidgetInspection from "../../../components/Widget/WidgetInspection";
import "./INSPECT_REPORT.scss";
interface InvoiceTableData {
  DELIVERY_ID: number;
  CUST_CD: string;
  CUST_NAME_KD: string;
  EMPL_NO: string;
  EMPL_NAME: string;
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  PO_NO: string;
  DELIVERY_DATE: string;
  DELIVERY_QTY: number;
  PROD_PRICE: string;
  DELIVERED_AMOUNT: number;
  REMARK: string;
  INVOICE_NO: string;
  PROD_TYPE: string;
  PROD_MODEL: string;
  PROD_PROJECT: string;
  YEARNUM: number;
  WEEKNUM: number;
}
interface InvoiceSummaryData {
  total_po_qty: number;
  total_delivered_qty: number;
  total_pobalance_qty: number;
  total_po_amount: number;
  total_delivered_amount: number;
  total_pobalance_amount: number;
}
interface WidgetData {
  yesterday_qty: number;
  yesterday_amount: number;
  before_yesterday_qty: number;
  before_yesterday_amount: number;
  yesterday_percentage: number;
  thisweek_qty: number;
  thisweek_amount: number;
  lastweek_qty: number;
  lastweek_amount: number;
  thisweek_percentage: number;
  thismonth_qty: number;
  thismonth_amount: number;
  lastmonth_qty: number;
  lastmonth_amount: number;
  thismonth_percentage: number;
  thisyear_qty: number;
  thisyear_amount: number;
  lastyear_qty: number;
  lastyear_amount: number;
}

interface YearlyClosingData {
  YEAR_NUM: string, 
  DELIVERY_QTY: number, 
  DELIVERED_AMOUNT: number
}
interface MonthlyClosingData {
  MONTH_NUM: string, 
  DELIVERY_QTY: number, 
  DELIVERED_AMOUNT: number
}
interface DailyClosingData {
  DELIVERY_DATE: string, 
  DELIVERY_QTY: number, 
  DELIVERED_AMOUNT: number
}
interface WeeklyClosingData {
  DEL_WEEK: string, 
  DELIVERY_QTY: number, 
  DELIVERED_AMOUNT: number
}
interface POBalanceSummaryData {
  PO_QTY: number,
  TOTAL_DELIVERED: number, 
  PO_BALANCE: number, 
  PO_AMOUNT: number, 
  DELIVERED_AMOUNT:number, 
  BALANCE_AMOUNT: number
}
interface FCSTAmountData {
  FCSTYEAR: number, 
  FCSTWEEKNO: number,
  FCST4W_QTY: number,
  FCST4W_AMOUNT: number,
  FCST8W_QTY: number,
  FCST8W_AMOUNT: number,  
}

interface WidgetData_FCST {
  fcstqty: number,
  fcstamount: number
}
interface WidgetData_Yesterday {
  yesterday_qty: number;
  yesterday_amount: number;
}
interface WidgetData_ThisWeek {
  thisweek_qty: number;
  thisweek_amount: number;
}
interface WidgetData_ThisMonth {
  thismonth_qty: number;
  thismonth_amount: number;
}
interface WidgetData_ThisYear {
  thisyear_qty: number;
  thisyear_amount: number;
}
interface WidgetData_POBalanceSummary {
  po_balance_qty: number;
  po_balance_amount: number;
}
const INSPECT_REPORT = () => {
  const [widgetdata_yesterday, setWidgetData_Yesterday] =
    useState<WidgetData_Yesterday>({
      yesterday_qty: 0,
      yesterday_amount: 0,
    });
  const [widgetdata_thisweek, setWidgetData_ThisWeek] =
    useState<WidgetData_ThisWeek>({
      thisweek_qty: 0,
      thisweek_amount: 0,
    });
  const [widgetdata_thismonth, setWidgetData_ThisMonth] =
    useState<WidgetData_ThisMonth>({
      thismonth_qty: 0,
      thismonth_amount: 0,
    });
  const [widgetdata_thisyear, setWidgetData_ThisYear] =
    useState<WidgetData_ThisYear>({
      thisyear_qty: 0,
      thisyear_amount: 0,
    });
  const [widgetdata_pobalancesummary, setWidgetData_PoBalanceSummary] =
    useState<WidgetData_POBalanceSummary>({
      po_balance_qty: 0,
      po_balance_amount: 0,
    });
  const [widgetdata_fcstAmount, setWidgetData_FcstAmount] =
    useState<FCSTAmountData>({
     FCSTYEAR:0,
     FCSTWEEKNO:1,
     FCST4W_QTY:0,
     FCST4W_AMOUNT:0,
     FCST8W_QTY:0,
     FCST8W_AMOUNT:0
    });


  const handleGetFCSTAmount = () => {
    let fcstweek2:number = moment().add(1,'days').isoWeek();
    let fcstyear2: number = moment().year(); 

    generalQuery("fcstamount", { FCSTYEAR: fcstyear2, FCSTWEEKNO: fcstweek2 })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        const loadeddata: FCSTAmountData[] =  response.data.data.map((element:FCSTAmountData,index: number)=> {
          return {
            ...element,                 
          }
        })
        setWidgetData_FcstAmount(loadeddata[0]);        
      } else {
        generalQuery("fcstamount", { FCSTYEAR: fcstyear2, FCSTWEEKNO: fcstweek2-1 })
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            const loadeddata: FCSTAmountData[] =  response.data.data.map((element:FCSTAmountData,index: number)=> {
              return {
                ...element,                 
              }
            })
            setWidgetData_FcstAmount(loadeddata[0]);        
          } else {
            //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
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
  }
  const handleGetDailyClosing = () => {
    let yesterday = moment().add(-1, "day").format("YYYY-MM-DD");
    generalQuery("kd_dailyclosing", { START_DATE: yesterday, END_DATE: yesterday })
    .then((response) => {
      
      if (response.data.tk_status !== "NG") {
        const loadeddata: DailyClosingData[] =  response.data.data.map((element:DailyClosingData,index: number)=> {
          return {
            ...element,
            DELIVERY_DATE : element.DELIVERY_DATE.slice(0,10),            
          }
        })
        setWidgetData_Yesterday({
          yesterday_qty:loadeddata[0].DELIVERY_QTY,
          yesterday_amount: loadeddata[0].DELIVERED_AMOUNT
        })        
      } else {
        //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }
  const handleGetWeeklyClosing = () => {
    generalQuery("kd_weeklyclosing", { YEAR: moment().format("YYYY") })
    .then((response) => {      
      if (response.data.tk_status !== "NG") {
        const loadeddata: WeeklyClosingData[] =  response.data.data.map((element:WeeklyClosingData,index: number)=> {
          return {
            ...element,
          }
        });
        setWidgetData_ThisWeek({
          thisweek_qty:loadeddata[loadeddata.length-1].DELIVERY_QTY,
          thisweek_amount: loadeddata[loadeddata.length-1].DELIVERED_AMOUNT
        }) 
       
      } else {
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }
  const handleGetMonthlyClosing = () => {
    generalQuery("kd_monthlyclosing", { YEAR: moment().format("YYYY") })
    .then((response) => {      
      if (response.data.tk_status !== "NG") {
        const loadeddata: MonthlyClosingData[] =  response.data.data.map((element:MonthlyClosingData,index: number)=> {
          return {
            ...element,
          }
        });
        setWidgetData_ThisMonth({
          thismonth_qty:loadeddata[loadeddata.length-1].DELIVERY_QTY,
          thismonth_amount: loadeddata[loadeddata.length-1].DELIVERED_AMOUNT
        }) 
      } else {
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }
  const handleGetYearlyClosing = () => {
    generalQuery("kd_annuallyclosing", {  })
    .then((response) => {      
      if (response.data.tk_status !== "NG") {
        const loadeddata: YearlyClosingData[] =  response.data.data.map((element:YearlyClosingData,index: number)=> {
          return {
            ...element,
          }
        });
        setWidgetData_ThisYear({
          thisyear_qty:loadeddata[loadeddata.length-1].DELIVERY_QTY,
          thisyear_amount: loadeddata[loadeddata.length-1].DELIVERED_AMOUNT
        }) 
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
  const handleGetPOBalanceSummary = () => {
    generalQuery("traPOSummaryTotal", {  })
    .then((response) => {      
      if (response.data.tk_status !== "NG") {
        const loadeddata: POBalanceSummaryData[] =  response.data.data.map((element:POBalanceSummaryData,index: number)=> {
          return {
            ...element,
          }
        });
        setWidgetData_PoBalanceSummary({
          po_balance_qty:loadeddata[0].PO_BALANCE,
          po_balance_amount: loadeddata[0].BALANCE_AMOUNT
        }) 
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


  useEffect(() => {
    /* let now = moment();
    let yesterday = moment().add(-1, "day").format("YYYY-MM-DD");
    let sunday = now.clone().weekday(0).format("YYYY-MM-DD");
    let monday = now.clone().weekday(6).format("YYYY-MM-DD");
    const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
    const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
    const startOfYear = moment().format("YYYY-01-01");
    const rightnow = now.format("YYYY-MM-DD"); */
    //handletraInvoice("day", "this", yesterday, yesterday);
    handleGetDailyClosing();
    //handletraInvoice("week", "this", sunday, monday);
    handleGetWeeklyClosing();
    //handletraInvoice("month", "this", startOfMonth, endOfMonth);
    handleGetMonthlyClosing();
    //handletraInvoice("year", "this", startOfYear, rightnow);
    handleGetYearlyClosing();
    handleGetPOBalanceSummary();
    handleGetFCSTAmount();
  }, []);
  return (
    <div className='inspectionreport'>
      <div className='doanhthureport'>
        <span className='section_title'>1. Summary</span>
        <div className='revenuewidget'>
          <div className='revenuwdg'>
            <WidgetInspection
              widgettype='revenue'
              label='Yesterday'
              topColor='#b3c6ff'
              botColor='#b3ecff'
              qty={13000}             
            />
          </div>
          <div className='revenuwdg'>
          <WidgetInspection
              widgettype='revenue'
              label='Yesterday'
              topColor='#b3c6ff'
              botColor='#b3ecff'
              qty={1000}             
            />
          </div>
          <div className='revenuwdg'>
          <WidgetInspection
              widgettype='revenue'
              label='Yesterday'
              topColor='#b3c6ff'
              botColor='#b3ecff'
              qty={1000}             
            />
          </div>
          <div className='revenuwdg'>
          <WidgetInspection
              widgettype='revenue'
              label='Yesterday'
              topColor='#b3c6ff'
              botColor='#b3ecff'
              qty={1000}             
            />
          </div>
        </div>
        <br></br>
        <hr></hr>
        <div className='graph'>
          <span className='section_title'>2. Closing</span>
          <div className='dailygraphtotal'>
            <div className='dailygraph'>
              <span className='subsection'>Daily Closing</span>
              <Chart2 />
            </div>
            <div className='dailygraph'>
              <span className='subsection'>Weekly Closing</span>
              <ChartWeekLy />
            </div>
          </div>
          <div className='monthlyweeklygraph'>
            <div className='dailygraph'>
              <span className='subsection'>Monthly Closing</span>
              <ChartMonthLy />
            </div>
            <div className='dailygraph'>
              <span className='subsection'>Yearly Closing</span>
              <ChartYearly />
            </div>
          </div>
          <div className='monthlyweeklygraph'>
            <div className='dailygraph'>
              <span className='subsection'>TOP 5 Customer Weekly Revenue</span>
              <ChartCustomerRevenue />
            </div>
            <div className='dailygraph'>
              <span className='subsection'>PIC Weekly Revenue</span>
              <ChartPICRevenue />
            </div>
          </div>
          <br></br>
          <hr></hr>
          <span className='section_title'>3. Purchase Order (PO)</span>
          <br></br>
          <div className='pobalancesummary'>
            <span className='subsection'>PO Balance info</span>
            <Widget
              widgettype='revenue'
              label='PO BALANCE INFOMATION'
              topColor='#ccff33'
              botColor='#99ccff'
              qty={widgetdata_pobalancesummary.po_balance_qty * 1}
              amount={widgetdata_pobalancesummary.po_balance_amount}
              percentage={20}
            />
          </div>
          <div className='monthlyweeklygraph'>
            <div className='dailygraph'>
              <span className='subsection'>PO By Week</span>
              <ChartWeeklyPO />
            </div>
            <div className='dailygraph'>
              <span className='subsection'>Delivery By Week</span>
              <ChartWeekLyDelivery />
            </div>
          </div>
          <div className='monthlyweeklygraph'>
            <div className='dailygraph'>
              <span className='subsection'>PO Balance Trending (By Week)</span>
              <Chart4 />
            </div>
          </div>
          <div className='datatable'>
            <div className='dailygraph'>
              <span className='subsection'>
                Customer PO Balance By Product Type
              </span>
              <CustomerPOBalanceByType />
            </div>
          </div>
          <br></br>
          <hr></hr>
          <span className='section_title'>4. Forecast</span>
          <br></br>
          <div className='fcstsummary'>
            <span className='subsection'>FCST Amount (FCST W{widgetdata_fcstAmount.FCSTWEEKNO})</span>
            <div className='fcstwidget'>
              <div className='fcstwidget1'>
                <Widget
                  widgettype='revenue'
                  label='FCST AMOUNT(4 WEEK)'
                  topColor='#eb99ff'
                  botColor='#99ccff'
                  qty={widgetdata_fcstAmount.FCST4W_QTY * 1}
                  amount={widgetdata_fcstAmount.FCST4W_AMOUNT}
                  percentage={20}
                />
              </div>
              <div className='fcstwidget1'>
                <Widget
                  widgettype='revenue'
                  label='FCST AMOUNT(8 WEEK)'
                  topColor='#e6e600'
                  botColor='#ff99c2'
                  qty={widgetdata_fcstAmount.FCST8W_QTY * 1}
                  amount={widgetdata_fcstAmount.FCST8W_AMOUNT}
                  percentage={20}
                />
              </div>
            </div>
          </div>
          <div className='monthlyweeklygraph'>
            <div className='dailygraph'>
              <span className='subsection'>
                SamSung ForeCast (So sánh FCST 2 tuần liền kề)
              </span>
              <ChartFCSTSamSung />
            </div>
          </div>
        </div>
      </div>
      <div className='poreport'></div>
    </div>
  );
};
export default INSPECT_REPORT;
