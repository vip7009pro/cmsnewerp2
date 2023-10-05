import moment from "moment";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import Chart4 from "../../../components/Chart/Chart4";
import ChartFCSTSamSung from "../../../components/Chart/ChartFCSTSamSung";
import ChartWeekLyDelivery from "../../../components/Chart/ChartWeeklyDelivery";
import ChartWeeklyPO from "../../../components/Chart/ChartWeekLyPO";
import InspectionDailyPPM from "../../../components/Chart/InspectionDailyPPM";
import InspectionMonthlyPPM from "../../../components/Chart/InspectionMonthlyPPM";
import InspectionWeeklyPPM from "../../../components/Chart/InspectionWeeklyPPM";
import InspectionYearlyPPM from "../../../components/Chart/InspectionYearlyPPM";
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

  const [dailyppm, setDailyPPM] = useState<DailyPPMData[]>([]);
  const [weeklyppm, setWeeklyPPM] = useState<WeeklyPPMData[]>([]);
  const [monthlyppm, setMonthlyPPM] = useState<MonthlyPPMData[]>([]);
  const [yearlyppm, setYearlyPPM] = useState<YearlyPPMData[]>([]);


  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));

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
                INSPECT_DATE: moment
                  .utc(element.INSPECT_DATE)
                  .format("YYYY-MM-DD"),
              };
            },
          );
          //console.log(loadeddata);
          if (FACTORY === "NM1") {
            setDailyPPM1(loadeddata);
          } else if (FACTORY === "NM2") {
            setDailyPPM2(loadeddata);
          } else {
            setDailyPPM(loadeddata);
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
            },
          );
          if (FACTORY === "NM1") {
            setWeeklyPPM1(loadeddata);
          } else if (FACTORY === "NM2") {
            setWeeklyPPM2(loadeddata);
          } else {
            setWeeklyPPM(loadeddata);
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
            },
          );
          if (FACTORY === "NM1") {
            setMonthlyPPM1(loadeddata);
          } else if (FACTORY === "NM1") {
            setMonthlyPPM2(loadeddata);
          } else {
            setMonthlyPPM(loadeddata)
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
            },
          );
          if (FACTORY === "NM1") {
            setYearlyPPM1(loadeddata);
          } else if (FACTORY === "NM1") {
            setYearlyPPM2(loadeddata);
          } else {
            setYearlyPPM(loadeddata)
          }
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    /* handle_getDailyPPM("NM1");
    handle_getDailyPPM("NM2");
    handle_getWeeklyPPM("NM1");
    handle_getWeeklyPPM("NM2");
    handle_getMonthlyPPM("NM1");
    handle_getMonthlyPPM("NM2");
    handle_getYearlyPPM("NM1");
    handle_getYearlyPPM("NM2"); */
    handle_getDailyPPM("ALL");
    handle_getWeeklyPPM("ALL");
    handle_getMonthlyPPM("ALL");
    handle_getYearlyPPM("ALL");


  
  }, []);
  return (
    <div className="inspectionreport">
      <div className="doanhthureport">
        <span className="section_title">1. NG Rate Trending</span>        
        <div className="revenuewidget">
          <div className="revenuwdg">
            <WidgetInspection
              widgettype="revenue"
              label="Yesterday NG"
              topColor="#b3c6ff"
              botColor="#b3ecff"
              material_ppm={dailyppm[0]?.MATERIAL_PPM}
              process_ppm={dailyppm[0]?.PROCESS_PPM}
              total_ppm={dailyppm[0]?.TOTAL_PPM}
            />
          </div>
          <div className="revenuwdg">
            <WidgetInspection
              widgettype="revenue"
              label="This Week NG"
              topColor="#b3c6ff"
              botColor="#b3ecff"
              material_ppm={weeklyppm[0]?.MATERIAL_PPM}
              process_ppm={weeklyppm[0]?.PROCESS_PPM}
              total_ppm={weeklyppm[0]?.TOTAL_PPM}
            />
          </div>
          <div className="revenuwdg">
            <WidgetInspection
              widgettype="revenue"
              label="This month NG"
              topColor="#b3c6ff"
              botColor="#b3ecff"
              material_ppm={monthlyppm[0]?.MATERIAL_PPM}
              process_ppm={monthlyppm[0]?.PROCESS_PPM}
              total_ppm={monthlyppm[0]?.TOTAL_PPM}
            />
          </div>
          <div className="revenuwdg">
            <WidgetInspection
              widgettype="revenue"
              label="This year NG"
              topColor="#b3c6ff"
              botColor="#b3ecff"
              material_ppm={yearlyppm[0]?.MATERIAL_PPM}
              process_ppm={yearlyppm[0]?.PROCESS_PPM}
              total_ppm={yearlyppm[0]?.TOTAL_PPM}
            />
          </div>
        </div>
       {/*  <span className="subsection_title">a. FACTORY 1</span>
        <div className="revenuewidget">
          <div className="revenuwdg">
            <WidgetInspection
              widgettype="revenue"
              label="Yesterday NG"
              topColor="#b3c6ff"
              botColor="#b3ecff"
              material_ppm={dailyppm1[0]?.MATERIAL_PPM}
              process_ppm={dailyppm1[0]?.PROCESS_PPM}
              total_ppm={dailyppm1[0]?.TOTAL_PPM}
            />
          </div>
          <div className="revenuwdg">
            <WidgetInspection
              widgettype="revenue"
              label="This Week NG"
              topColor="#b3c6ff"
              botColor="#b3ecff"
              material_ppm={weeklyppm1[0]?.MATERIAL_PPM}
              process_ppm={weeklyppm1[0]?.PROCESS_PPM}
              total_ppm={weeklyppm1[0]?.TOTAL_PPM}
            />
          </div>
          <div className="revenuwdg">
            <WidgetInspection
              widgettype="revenue"
              label="This month NG"
              topColor="#b3c6ff"
              botColor="#b3ecff"
              material_ppm={monthlyppm1[0]?.MATERIAL_PPM}
              process_ppm={monthlyppm1[0]?.PROCESS_PPM}
              total_ppm={monthlyppm1[0]?.TOTAL_PPM}
            />
          </div>
          <div className="revenuwdg">
            <WidgetInspection
              widgettype="revenue"
              label="This year NG"
              topColor="#b3c6ff"
              botColor="#b3ecff"
              material_ppm={yearlyppm1[0]?.MATERIAL_PPM}
              process_ppm={yearlyppm1[0]?.PROCESS_PPM}
              total_ppm={yearlyppm1[0]?.TOTAL_PPM}
            />
          </div>
        </div>
        <span className="subsection_title">b. FACTORY 2</span>
        <div className="revenuewidget">
          <div className="revenuwdg">
            <WidgetInspection
              widgettype="revenue"
              label="Yesterday NG"
              topColor="#80ff80"
              botColor="#e6ffe6"
              material_ppm={dailyppm2[0]?.MATERIAL_PPM}
              process_ppm={dailyppm2[0]?.PROCESS_PPM}
              total_ppm={dailyppm2[0]?.TOTAL_PPM}
            />
          </div>
          <div className="revenuwdg">
            <WidgetInspection
              widgettype="revenue"
              label="This Week NG"
              topColor="#80ff80"
              botColor="#e6ffe6"
              material_ppm={weeklyppm2[0]?.MATERIAL_PPM}
              process_ppm={weeklyppm2[0]?.PROCESS_PPM}
              total_ppm={weeklyppm2[0]?.TOTAL_PPM}
            />
          </div>
          <div className="revenuwdg">
            <WidgetInspection
              widgettype="revenue"
              label="This month NG"
              topColor="#80ff80"
              botColor="#e6ffe6"
              material_ppm={monthlyppm2[0]?.MATERIAL_PPM}
              process_ppm={monthlyppm2[0]?.PROCESS_PPM}
              total_ppm={monthlyppm2[0]?.TOTAL_PPM}
            />
          </div>
          <div className="revenuwdg">
            <WidgetInspection
              widgettype="revenue"
              label="This year NG"
              topColor="#80ff80"
              botColor="#e6ffe6"
              material_ppm={yearlyppm2[0]?.MATERIAL_PPM}
              process_ppm={yearlyppm2[0]?.PROCESS_PPM}
              total_ppm={yearlyppm2[0]?.TOTAL_PPM}
            />
          </div>
        </div> */}
        <br></br>
        <hr></hr>
        <div className="graph">
          <span className="section_title">2. NG Trending</span>          
          <div className="dailygraphtotal">
          <div className="dailygraphtotal">
            <div className="dailygraph">
              <span className="subsection">Daily NG Rate</span>
              <InspectionDailyPPM
                dldata={dailyppm}
                processColor="#eb5c34"
                materialColor="#53eb34"
              />
            </div>
            <div className="dailygraph">
              <span className="subsection">Weekly NG Rate</span>
              <InspectionWeeklyPPM
                dldata={weeklyppm}
                processColor="#eb5c34"
                materialColor="#53eb34"
              />
            </div>
          </div>
          <div className="monthlyweeklygraph">
            <div className="dailygraph">
              <span className="subsection">Monthly NG Rate</span>
              <InspectionMonthlyPPM
                dldata={monthlyppm}
                processColor="#eb5c34"
                materialColor="#53eb34"
              />
            </div>
            <div className="dailygraph">
              <span className="subsection">Yearly NG Rate</span>
              <InspectionYearlyPPM
                dldata={yearlyppm}
                processColor="#eb5c34"
                materialColor="#53eb34"
              />
            </div>
          </div>


          </div>
         {/*  <span className="subsection_title">a. FACTORY 1 NG Trending</span>
          <div className="dailygraphtotal">
            <div className="dailygraph">
              <span className="subsection">Daily NG Rate</span>
              <InspectionDailyPPM
                dldata={dailyppm1}
                processColor="#eb4034"
                materialColor="#34eb92"
              />
            </div>
            <div className="dailygraph">
              <span className="subsection">Weekly NG Rate</span>
              <InspectionWeeklyPPM
                dldata={weeklyppm1}
                processColor="#eb4034"
                materialColor="#34eb92"
              />
            </div>
          </div>
          <div className="monthlyweeklygraph">
            <div className="dailygraph">
              <span className="subsection">Monthly NG Rate</span>
              <InspectionMonthlyPPM
                dldata={monthlyppm1}
                processColor="#eb4034"
                materialColor="#34eb92"
              />
            </div>
            <div className="dailygraph">
              <span className="subsection">Yearly NG Rate</span>
              <InspectionYearlyPPM
                dldata={yearlyppm1}
                processColor="#eb4034"
                materialColor="#34eb92"
              />
            </div>
          </div>
          <span className="subsection_title">b. FACTORY 2 NG Trending</span>
          <div className="dailygraphtotal">
            <div className="dailygraph">
              <span className="subsection">Daily NG Rate</span>
              <InspectionDailyPPM
                dldata={dailyppm2}
                processColor="#eb5c34"
                materialColor="#53eb34"
              />
            </div>
            <div className="dailygraph">
              <span className="subsection">Weekly NG Rate</span>
              <InspectionWeeklyPPM
                dldata={weeklyppm2}
                processColor="#eb5c34"
                materialColor="#53eb34"
              />
            </div>
          </div>
          <div className="monthlyweeklygraph">
            <div className="dailygraph">
              <span className="subsection">Monthly NG Rate</span>
              <InspectionMonthlyPPM
                dldata={monthlyppm2}
                processColor="#eb5c34"
                materialColor="#53eb34"
              />
            </div>
            <div className="dailygraph">
              <span className="subsection">Yearly NG Rate</span>
              <InspectionYearlyPPM
                dldata={yearlyppm2}
                processColor="#eb5c34"
                materialColor="#53eb34"
              />
            </div>
          </div>
          <br></br>
          <hr></hr> */}
          <span className="section_title">3. WORST</span>
          <br></br>
          <div className="pobalancesummary">
            <span className="subsection">Select Data Range: </span>
            <label>
              <b>Từ ngày:</b>
              <input
                type="date"
                value={fromdate.slice(0, 10)}
                onChange={(e) => setFromDate(e.target.value)}
              ></input>
            </label>
            <label>
              <b>Tới ngày:</b>{" "}
              <input
                type="date"
                value={todate.slice(0, 10)}
                onChange={(e) => setToDate(e.target.value)}
              ></input>
            </label>
          </div>
          <div className="monthlyweeklygraph">
            <div className="dailygraph">
              <span className="subsection">NG NM1</span>
              <ChartWeeklyPO />
            </div>
            <div className="dailygraph">
              <span className="subsection">NG NM2</span>
              <ChartWeekLyDelivery />
            </div>
          </div>
          <div className="monthlyweeklygraph">
            <div className="dailygraph">
              <span className="subsection">PO Balance Trending (By Week)</span>
              <Chart4 />
            </div>
          </div>
          <div className="datatable">
            <div className="dailygraph">
              <span className="subsection">
                Customer PO Balance By Product Type
              </span>
              <CustomerPOBalanceByType />
            </div>
          </div>
          <br></br>
          <hr></hr>
          <span className="section_title">4. Forecast</span>
          <br></br>
          <div className="fcstsummary">
            <span className="subsection">
              FCST Amount (FCST W{widgetdata_fcstAmount.FCSTWEEKNO})
            </span>
            <div className="fcstwidget">
              <div className="fcstwidget1">
                <Widget
                  widgettype="revenue"
                  label="FCST AMOUNT(4 WEEK)"
                  topColor="#eb99ff"
                  botColor="#99ccff"
                  qty={widgetdata_fcstAmount.FCST4W_QTY * 1}
                  amount={widgetdata_fcstAmount.FCST4W_AMOUNT}
                  percentage={20}
                />
              </div>
              <div className="fcstwidget1">
                <Widget
                  widgettype="revenue"
                  label="FCST AMOUNT(8 WEEK)"
                  topColor="#e6e600"
                  botColor="#ff99c2"
                  qty={widgetdata_fcstAmount.FCST8W_QTY * 1}
                  amount={widgetdata_fcstAmount.FCST8W_AMOUNT}
                  percentage={20}
                />
              </div>
            </div>
          </div>
          <div className="monthlyweeklygraph">
            <div className="dailygraph">
              <span className="subsection">
                SamSung ForeCast (So sánh FCST 2 tuần liền kề)
              </span>
              <ChartFCSTSamSung />
            </div>
          </div>
        </div>
      </div>
      <div className="poreport"></div>
    </div>
  );
};
export default INSPECT_REPORT;
