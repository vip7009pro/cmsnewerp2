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

interface DailyPPMData {
  INSPECT_DATE?: string;
  INSPECT_TOTAL_QTY?: number;
  MATERIAL_NG?: number;
  PROCESS_NG?: number;
  TOTAL_NG?: number;
  TOTAL_PPM?: number;
  MATERIAL_PPM?: number;
  PROCESS_PPM?: number;
}
interface MonthlyPPMData {
  YEAR_NUM?: number;
  MONTH_NUM?: number;
  INSPECT_TOTAL_QTY?: number;
  MATERIAL_NG?: number;
  PROCESS_NG?: number;
  TOTAL_NG?: number;
  TOTAL_PPM?: number;
  MATERIAL_PPM?: number;
  PROCESS_PPM?: number;
}
interface WeeklyPPMData {
  YEAR_NUM?: number;
  WEEK_NUM?: number;
  INSPECT_TOTAL_QTY?: number;
  MATERIAL_NG?: number;
  PROCESS_NG?: number;
  TOTAL_NG?: number;
  TOTAL_PPM?: number;
  MATERIAL_PPM?: number;
  PROCESS_PPM?: number;
}
interface YearlyPPMData {
  YEAR_NUM?: number;
  INSPECT_TOTAL_QTY?: number;
  MATERIAL_NG?: number;
  PROCESS_NG?: number;
  TOTAL_NG?: number;
  TOTAL_PPM?: number;
  MATERIAL_PPM?: number;
  PROCESS_PPM?: number;
}
interface POBalanceSummaryData {
  PO_QTY: number;
  TOTAL_DELIVERED: number;
  PO_BALANCE: number;
  PO_AMOUNT: number;
  DELIVERED_AMOUNT: number;
  BALANCE_AMOUNT: number;
}
interface FCSTAmountData {
  FCSTYEAR: number;
  FCSTWEEKNO: number;
  FCST4W_QTY: number;
  FCST4W_AMOUNT: number;
  FCST8W_QTY: number;
  FCST8W_AMOUNT: number;
}
interface WidgetData_POBalanceSummary {
  po_balance_qty: number;
  po_balance_amount: number;
}
const INSPECT_REPORT = () => {
  const [dailyppm1, setDailyPPM1] = useState<DailyPPMData[]>([]);
  const [weeklyppm1, setWeeklyPPM1] = useState<WeeklyPPMData[]>([]);
  const [monthlyppm1, setMonthlyPPM1] = useState<MonthlyPPMData[]>([]);
  const [yearlyppm1, setYearlyPPM1] = useState<YearlyPPMData[]>([]);

  const [dailyppm2, setDailyPPM2] = useState<DailyPPMData[]>([]);
  const [weeklyppm2, setWeeklyPPM2] = useState<WeeklyPPMData[]>([]);
  const [monthlyppm2, setMonthlyPPM2] = useState<MonthlyPPMData[]>([]);
  const [yearlyppm2, setYearlyPPM2] = useState<YearlyPPMData[]>([]);
  
  const [widgetdata_pobalancesummary, setWidgetData_PoBalanceSummary] =
    useState<WidgetData_POBalanceSummary>({
      po_balance_qty: 0,
      po_balance_amount: 0,
    });
  const [widgetdata_fcstAmount, setWidgetData_FcstAmount] =
    useState<FCSTAmountData>({
      FCSTYEAR: 0,
      FCSTWEEKNO: 1,
      FCST4W_QTY: 0,
      FCST4W_AMOUNT: 0,
      FCST8W_QTY: 0,
      FCST8W_AMOUNT: 0,
    });

  const handle_getDailyPPM = (FACTORY: string) => {
    generalQuery("inspect_daily_ppm", {
      FACTORY: FACTORY,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: DailyPPMData[] = response.data.data.map(
            (element: DailyPPMData, index: number) => {
              return {
                ...element,
              };
            }
          );
          if (FACTORY === "NM1") {
            setDailyPPM1(loadeddata);
          } else {
            setDailyPPM2(loadeddata);
          }
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getWeeklyPPM = (FACTORY: string) => {
    generalQuery("inspect_weekly_ppm", {
      FACTORY: FACTORY,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: WeeklyPPMData[] = response.data.data.map(
            (element: WeeklyPPMData, index: number) => {
              return {
                ...element,
              };
            }
          );
          if (FACTORY === "NM1") {
            setWeeklyPPM1(loadeddata);
          } else {
            setWeeklyPPM2(loadeddata);
          }
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getMonthlyPPM = (FACTORY: string) => {
    generalQuery("inspect_monthly_ppm", {
      FACTORY: FACTORY,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: MonthlyPPMData[] = response.data.data.map(
            (element: MonthlyPPMData, index: number) => {
              return {
                ...element,
              };
            }
          );
          if (FACTORY === "NM1") {
            setMonthlyPPM1(loadeddata);
          } else {
            setMonthlyPPM2(loadeddata);
          }
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getYearlyPPM = (FACTORY: string) => {
    generalQuery("inspect_yearly_ppm", {
      FACTORY: FACTORY,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: YearlyPPMData[] = response.data.data.map(
            (element: YearlyPPMData, index: number) => {
              return {
                ...element,
              };
            }
          );
          if (FACTORY === "NM1") {
            setYearlyPPM1(loadeddata);
          } else {
            setYearlyPPM2(loadeddata);
          }
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleGetFCSTAmount = () => {
    let fcstweek2: number = moment().add(1, "days").isoWeek();
    let fcstyear2: number = moment().year();

    generalQuery("fcstamount", { FCSTYEAR: fcstyear2, FCSTWEEKNO: fcstweek2 })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: FCSTAmountData[] = response.data.data.map(
            (element: FCSTAmountData, index: number) => {
              return {
                ...element,
              };
            }
          );
          setWidgetData_FcstAmount(loadeddata[0]);
        } else {
          generalQuery("fcstamount", {
            FCSTYEAR: fcstyear2,
            FCSTWEEKNO: fcstweek2 - 1,
          })
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
                const loadeddata: FCSTAmountData[] = response.data.data.map(
                  (element: FCSTAmountData, index: number) => {
                    return {
                      ...element,
                    };
                  }
                );
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
  };
  const handleGetPOBalanceSummary = () => {
    generalQuery("traPOSummaryTotal", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: POBalanceSummaryData[] = response.data.data.map(
            (element: POBalanceSummaryData, index: number) => {
              return {
                ...element,
              };
            }
          );
          setWidgetData_PoBalanceSummary({
            po_balance_qty: loadeddata[0].PO_BALANCE,
            po_balance_amount: loadeddata[0].BALANCE_AMOUNT,
          });
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
  };

  useEffect(() => {
    handle_getDailyPPM('NM1');
    handle_getDailyPPM('NM2');
    handle_getWeeklyPPM('NM1');
    handle_getWeeklyPPM('NM2');
    handle_getMonthlyPPM('NM1'); 
    handle_getMonthlyPPM('NM2');
    handle_getYearlyPPM('NM1');
    handle_getYearlyPPM('NM2');
    handleGetPOBalanceSummary();
    handleGetFCSTAmount();
  }, []);
  return (
    <div className='inspectionreport'>
      <div className='doanhthureport'>
        <span className='section_title'>1. Defect Summary</span>
        <div className='revenuewidget'>
          <div className='revenuwdg'>
            <WidgetInspection
              widgettype='revenue'
              label='Yesterday'
              topColor='#b3c6ff'
              botColor='#b3ecff'
              material_ppm={13000}
              process_ppm={13000}
              total_ppm={13000}
            />
          </div>
          <div className='revenuwdg'>
            <WidgetInspection
              widgettype='revenue'
              label='Yesterday'
              topColor='#b3c6ff'
              botColor='#b3ecff'
              material_ppm={13000}
              process_ppm={13000}
              total_ppm={13000}
            />
          </div>
          <div className='revenuwdg'>
            <WidgetInspection
              widgettype='revenue'
              label='Yesterday'
              topColor='#b3c6ff'
              botColor='#b3ecff'
              material_ppm={13000}
              process_ppm={13000}
              total_ppm={13000}
            />
          </div>
          <div className='revenuwdg'>
            <WidgetInspection
              widgettype='revenue'
              label='Yesterday'
              topColor='#b3c6ff'
              botColor='#b3ecff'
              material_ppm={13000}
              process_ppm={13000}
              total_ppm={13000}
            />
          </div>
        </div>
        <div className='revenuewidget'>
          <div className='revenuwdg'>
            <WidgetInspection
              widgettype='revenue'
              label='Yesterday'
              topColor='#b3c6ff'
              botColor='#b3ecff'
              material_ppm={13000}
              process_ppm={13000}
              total_ppm={13000}
            />
          </div>
          <div className='revenuwdg'>
            <WidgetInspection
              widgettype='revenue'
              label='Yesterday'
              topColor='#b3c6ff'
              botColor='#b3ecff'
              material_ppm={13000}
              process_ppm={13000}
              total_ppm={13000}
            />
          </div>
          <div className='revenuwdg'>
            <WidgetInspection
              widgettype='revenue'
              label='Yesterday'
              topColor='#b3c6ff'
              botColor='#b3ecff'
              material_ppm={13000}
              process_ppm={13000}
              total_ppm={13000}
            />
          </div>
          <div className='revenuwdg'>
            <WidgetInspection
              widgettype='revenue'
              label='Yesterday'
              topColor='#b3c6ff'
              botColor='#b3ecff'
              material_ppm={13000}
              process_ppm={13000}
              total_ppm={13000}
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
            <span className='subsection'>
              FCST Amount (FCST W{widgetdata_fcstAmount.FCSTWEEKNO})
            </span>
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
