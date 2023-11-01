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
import InspectionWorstTable from "../../../components/DataTable/InspectionWorstTable";
import ChartInspectionWorst from "../../../components/Chart/ChartInspectionWorst";
import { DailyPPMData, FCSTAmountData, InspectSummary, MonthlyPPMData, WeeklyPPMData, WidgetData_POBalanceSummary, WorstData, YearlyPPMData } from "../../../api/GlobalInterface";
import CIRCLE_COMPONENT from "../../qlsx/QLSXPLAN/CAPA/CIRCLE_COMPONENT/CIRCLE_COMPONENT";
import { nFormatter } from "../../../api/GlobalFunction";

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
  const [worstby, setWorstBy] = useState('AMOUNT');
  const [ng_type, setNg_Type] = useState('ALL'); 
  const [worstdatatable, setWorstDataTable] = useState<Array<WorstData>>([]);  
  const [inspectSummary, setInspectSummary] = useState<InspectSummary[]>([])
  const handleGetInspectionWorst = (from_date: string, to_date: string, worst_by: string, ng_type: string) => {
    generalQuery("getInspectionWorstTable", { FROM_DATE: from_date, TO_DATE: to_date, WORSTBY: worst_by, NG_TYPE: ng_type })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          let loadeddata = response.data.data.map(
            (element: WorstData, index: number) => {
              return {
                ...element,
                NG_QTY: Number(element.NG_QTY),
                NG_AMOUNT: Number(element.NG_AMOUNT),
                id: index
              };
            }
          );
          //console.log(loadeddata);
          setWorstDataTable(loadeddata);
          
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
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
          } else if (FACTORY === "NM2") {
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
          } else if (FACTORY === "NM2") {
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
  const handle_getInspectSummary = (from_date: string, to_date: string)=> {
    generalQuery("getInspectionSummary", {
      FROM_DATE: from_date, TO_DATE: to_date
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: InspectSummary[] = response.data.data.map(
            (element: InspectSummary, index: number) => {              
              return {
                ...element,
                M_RATE: element.ISP_TT_QTY !== 0 ? Number(element.M_NG_QTY)/Number(element.ISP_TT_QTY) : 0,
                P_RATE: element.ISP_TT_QTY !== 0 ? Number(element.P_NG_QTY)/Number(element.ISP_TT_QTY) : 0,
                T_RATE: element.ISP_TT_QTY !== 0 ? (Number(element.M_NG_QTY) + Number(element.P_NG_QTY))/Number(element.ISP_TT_QTY) : 0,
              };
            },
          );
          setInspectSummary(loadeddata);                 
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    handle_getDailyPPM("ALL");
    handle_getWeeklyPPM("ALL");
    handle_getMonthlyPPM("ALL");
    handle_getYearlyPPM("ALL");
    handleGetInspectionWorst(fromdate, todate, worstby, ng_type);
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
              material_ppm={yearlyppm[yearlyppm.length - 1]?.MATERIAL_PPM}
              process_ppm={yearlyppm[yearlyppm.length - 1]?.PROCESS_PPM}
              total_ppm={yearlyppm[yearlyppm.length - 1]?.TOTAL_PPM}
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
                  processColor="#eeeb30"
                  materialColor="#53eb34"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Weekly NG Rate</span>
                <InspectionWeeklyPPM
                  dldata={weeklyppm}
                  processColor="#eeeb30"
                  materialColor="#53eb34"
                />
              </div>
            </div>
            <div className="monthlyweeklygraph">
              <div className="dailygraph">
                <span className="subsection">Monthly NG Rate</span>
                <InspectionMonthlyPPM
                  dldata={monthlyppm}
                  processColor="#eeeb30"
                  materialColor="#53eb34"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Yearly NG Rate</span>
                <InspectionYearlyPPM
                  dldata={yearlyppm}
                  processColor="#eeeb30"
                  materialColor="#53eb34"
                />
              </div>
            </div>
          </div>
          <span className="section_title">3. WORST</span>          
          <div className="pobalancesummary">            
            <label>
              <b>Từ ngày:</b>
              <input
                type="date"
                value={fromdate.slice(0, 10)}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  handleGetInspectionWorst(e.target.value, todate, worstby, ng_type);
                  handle_getInspectSummary(e.target.value, todate);
                }}
              ></input>
            </label>
            <label>
              <b>Tới ngày:</b>{" "}
              <input
                type="date"
                value={todate.slice(0, 10)}
                onChange={(e) => {
                  setToDate(e.target.value)
                  handleGetInspectionWorst(fromdate, e.target.value, worstby, ng_type);
                  handle_getInspectSummary(fromdate,e.target.value);
                }}
              ></input>
            </label>
            <label>
              <b>Worst by:</b>{" "}
              <select
                name="worstby"
                value={worstby}
                onChange={(e) => {
                  setWorstBy(e.target.value);
                  handleGetInspectionWorst(fromdate, todate, e.target.value, ng_type);
                }}
              >
                <option value={"QTY"}>QTY</option>
                <option value={"AMOUNT"}>AMOUNT</option>
              </select>
            </label>
            <label>
              <b>NG TYPE:</b>{" "}
              <select
                name="ngtype"
                value={ng_type}
                onChange={(e) => {
                  setNg_Type(e.target.value);
                  handleGetInspectionWorst(fromdate, todate, worstby, e.target.value);
                }}
              >
                <option value={"ALL"}>ALL</option>
                <option value={"P"}>PROCESS</option>
                <option value={"M"}>MATERIAL</option>
              </select>
            </label>
          </div>
          <div className="ngtotalsummary">
            <CIRCLE_COMPONENT
              type='loss'
              value={`${nFormatter(inspectSummary[0]?.ISP_TT_QTY,2)}`}
              title='TOTAL QTY'
              color='blue'
            />
            <CIRCLE_COMPONENT
              type='loss'
              value={`${nFormatter(inspectSummary[0]?.INSP_OK_QTY,2)}`}
              title='TOTAL OK'
              color='green'
            />
            <CIRCLE_COMPONENT
              type='loss'
              value={`${nFormatter(inspectSummary[0]?.P_NG_QTY,2)}`}
              title='PROCESS NG'
              color='#F5890E'
            />
            <CIRCLE_COMPONENT
              type='loss'
              value={`${nFormatter(inspectSummary[0]?.M_NG_QTY,2)}`}
              title='MATERIAL NG'
              color='#E8279F'
            />
            <CIRCLE_COMPONENT
              type='loss'
              value={`${nFormatter(inspectSummary[0]?.P_RATE*1000000,2)}`}
              title='P NG RATE'
              color='#F5890E'
            />
            <CIRCLE_COMPONENT
              type='loss'
              value={`${nFormatter(inspectSummary[0]?.M_RATE*1000000,2)}`}
              title='M NG RATE'
              color='#E8279F'
            />
            <CIRCLE_COMPONENT
              type='loss'
              value={`${nFormatter(inspectSummary[0]?.T_RATE*1000000,2)}`}
              title='TOTAL RATE'
              color='red'
            />
          </div>
          <div className="worstinspection">
            <div className="worsttable">
              <span className="subsection">Worst Table</span>
              {worstdatatable.length > 0 && <InspectionWorstTable dailyClosingData={worstdatatable} worstby={worstby} from_date={fromdate} to_date={todate} ng_type={ng_type}/>}
            </div>
            <div className="worstgraph">
              <span className="subsection">WORST 5 BY {worstby}</span>
              {worstdatatable.length > 0 && <ChartInspectionWorst dailyClosingData={worstdatatable} worstby={worstby} />}
            </div>
          </div>
        </div>
      </div>
      <div className="poreport"></div>
    </div>
  );
};
export default INSPECT_REPORT;
