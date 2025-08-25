import moment from "moment";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getCompany } from "../../../api/Api";
import "./SX_REPORT.scss";
import { Checkbox, IconButton } from "@mui/material";
import { SaveExcel } from "../../../api/GlobalFunction";
import { AiFillFileExcel } from "react-icons/ai";
import SX_DailyLossTrend from "../../../components/Chart/SX/SX_DailyLossTrend";
import SX_WeeklyLossTrend from "../../../components/Chart/SX/SX_WeeklyLossTrend";
import SX_MonthlyLossTrend from "../../../components/Chart/SX/SX_MonthlyLossTrend";
import SX_YearlyLossTrend from "../../../components/Chart/SX/SX_YearlyLossTrend";
import WidgetSXLOSS from "../../../components/Widget/WidgetSXLOSS";
import SXDailyAchiveTrend from "../../../components/Chart/SX/SXDailyAchiveTrend";
import SXWeeklyAchiveTrend from "../../../components/Chart/SX/SXWeeklyAchiveTrend";
import SXMonthlyAchiveTrend from "../../../components/Chart/SX/SXMonthlyAchiveTrend";
import SXYearlyAchiveTrend from "../../../components/Chart/SX/SXYearlyAchiveTrend";
import WidgetSXAchive from "../../../components/Widget/WidgetSXAchive";
import SXDailyEffTrend from "../../../components/Chart/SX/SXDailyEffTrend";
import SXWeeklyEffTrend from "../../../components/Chart/SX/SXWeeklyEffTrend";
import SXMonthlyEffTrend from "../../../components/Chart/SX/SXMonthlyEffTrend";
import SXYearlyEffTrend from "../../../components/Chart/SX/SXYearlyEffTrend";
import CIRCLE_COMPONENT from "../../qlsx/QLSXPLAN/CAPA/CIRCLE_COMPONENT/CIRCLE_COMPONENT";
import SXLossTimeByReason from "../../../components/Chart/SX/SXLossTimeByReason";
import SXLossTimeByEmpl from "../../../components/Chart/SX/SXLossTimeByEmpl";
import SXPlanLossTrend from "../../../components/Chart/SX/SXPlanLossTrend";
import YCSX_GAP_RATE from "../../../components/Chart/SX/YCSX_GAP_RATE";
import { MACHINE_LIST } from "../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { f_getMachineListData } from "../../qlsx/QLSXPLAN/utils/khsxUtils";
import { usehandle_loadYCSX_GAP_RATE_DATA, usehandle_loadSX_GAP_RATE_DATA, usehandle_loadKT_GAP_RATE_DATA, usehandle_loadALL_GAP_RATE_DATA, usehandle_loadALL_HOAN_THANH_TRUOC_HAN_RATE_DATA, usehandle_load_SX_Daily_Loss_Trend, usehandle_load_SX_Weekly_Loss_Trend, usehandle_load_SX_Monthly_Loss_Trend, usehandle_load_SX_Yearly_Loss_Trend, usehandle_getWeeklyAchiveData, usehandle_getDailyAchiveData, usehandle_getMonthlyAchiveData, usehandle_getYearlyAchiveData, usehandle_getDailyEffData, usehandle_getWeeklyEffData, usehandle_getMonthlyEffData, usehandle_getYearlyEffData, usehandle_getPlanLossData, usehandle_getSXLossTimeByEmpl, usehandle_getSXLossTimeByReason, usehandle_loadYCSX_GAP_RATE_BACKDATA, usehandle_loadSX_GAP_RATE_BACKDATA, usehandle_loadKT_GAP_RATE_BACKDATA, usehandle_loadALL_GAP_RATE_BACKDATA, usehandle_loadALL_HOAN_THANH_TRUOC_HAN_RATE_BACKDATA, usehandle_loadALL_HOAN_THANH_TRUOC_HAN_RATE_DATA2, usehandle_loadALL_HOAN_THANH_TRUOC_HAN_RATE_BACKDATA2 } from "./hooks/BAOCAOSX_HOOKS";
import YCSX_GAP_RATE_KD from "../../../components/Chart/SX/YCSX_GAP_RATE_KD";
import YCSX_GAP_RATE2 from "../../../components/Chart/SX/YCSX_GAP_RATE2";

const SX_REPORT = () => {
  const [machineList, setMachineList] = useState<MACHINE_LIST[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<string>("ALL");

  const [fromdate, setFromDate] = useState(moment().add(-12, "day").format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [cust_name, setCust_Name] = useState('');
  const [searchCodeArray, setSearchCodeArray] = useState<string[]>([]);
  const [df, setDF] = useState(true);
  
  const { data: ycgapData, loading: ycgapLoading, error: ycgapError, triggerFetch: ycgapTriggerFetch } = usehandle_loadYCSX_GAP_RATE_DATA(fromdate, todate, df);
  const { data: sxgapData, loading: sxgapLoading, error: sxgapError, triggerFetch: sxgapTriggerFetch } = usehandle_loadSX_GAP_RATE_DATA(fromdate, todate, df);
  const { data: ktgapData, loading: ktgapLoading, error: ktgapError, triggerFetch: ktgapTriggerFetch } = usehandle_loadKT_GAP_RATE_DATA(fromdate, todate, df);
  const { data: allgapData, loading: allgapLoading, error: allgapError, triggerFetch: allgapTriggerFetch } = usehandle_loadALL_GAP_RATE_DATA(fromdate, todate, df);
  const { data: allhoanthanhtruochanrateData, loading: allhoanthanhtruochanrateLoading, error: allhoanthanhtruochanrateError, triggerFetch: allhoanthanhtruochanrateTriggerFetch } = usehandle_loadALL_HOAN_THANH_TRUOC_HAN_RATE_DATA(fromdate, todate, df);
  const { data: allhoanthanhtruochanrateData2, loading: allhoanthanhtruochanrateLoading2, error: allhoanthanhtruochanrateError2, triggerFetch: allhoanthanhtruochanrateTriggerFetch2 } = usehandle_loadALL_HOAN_THANH_TRUOC_HAN_RATE_DATA2(fromdate, todate, df);

  const { data: ycsxgapbackData, loading: ycsxgapbackLoading, error: ycsxgapbackError, triggerFetch: ycsxgapbackTriggerFetch } = usehandle_loadYCSX_GAP_RATE_BACKDATA(fromdate, todate, df);
  const { data: sxgapbackData, loading: sxgapbackLoading, error: sxgapbackError, triggerFetch: sxgapbackTriggerFetch } = usehandle_loadSX_GAP_RATE_BACKDATA(fromdate, todate, df);
  const { data: ktgapbackData, loading: ktgapbackLoading, error: ktgapbackError, triggerFetch: ktgapbackTriggerFetch } = usehandle_loadKT_GAP_RATE_BACKDATA(fromdate, todate, df);
  const { data: allgapbackData, loading: allgapbackLoading, error: allgapbackError, triggerFetch: allgapbackTriggerFetch } = usehandle_loadALL_GAP_RATE_BACKDATA(fromdate, todate, df);
  const { data: allhoanthanhtruochanratebackData, loading: allhoanthanhtruochanratebackLoading, error: allhoanthanhtruochanratebackError, triggerFetch: allhoanthanhtruochanratebackTriggerFetch } = usehandle_loadALL_HOAN_THANH_TRUOC_HAN_RATE_BACKDATA(fromdate, todate, df);
  const { data: allhoanthanhtruochanratebackData2, loading: allhoanthanhtruochanratebackLoading2, error: allhoanthanhtruochanratebackError2, triggerFetch: allhoanthanhtruochanratebackTriggerFetch2 } = usehandle_loadALL_HOAN_THANH_TRUOC_HAN_RATE_BACKDATA2(fromdate, todate, df);




  const { data: sxdailylosstrendData, loading: sxdailylosstrendLoading, error: sxdailylosstrendError, triggerFetch: sxdailylosstrendTriggerFetch } = usehandle_load_SX_Daily_Loss_Trend(fromdate, todate, df);
  const { data: sxweeklylosstrendData, loading: sxweeklylosstrendLoading, error: sxweeklylosstrendError, triggerFetch: sxweeklylosstrendTriggerFetch } = usehandle_load_SX_Weekly_Loss_Trend(fromdate, todate, df);
  const { data: sxmonthlylosstrendData, loading: sxmonthlylosstrendLoading, error: sxmonthlylosstrendError, triggerFetch: sxmonthlylosstrendTriggerFetch } = usehandle_load_SX_Monthly_Loss_Trend(fromdate, todate, df);
  const { data: sxyearlylosstrendData, loading: sxyearlylosstrendLoading, error: sxyearlylosstrendError, triggerFetch: sxyearlylosstrendTriggerFetch } = usehandle_load_SX_Yearly_Loss_Trend(fromdate, todate, df);

  const { data: sxdailyachiveData, loading: sxdailyachiveLoading, error: sxdailyachiveError, triggerFetch: sxdailyachiveTriggerFetch } = usehandle_getDailyAchiveData(fromdate, todate, df);
  const { data: sxweeklyachiveData, loading: sxweeklyachiveLoading, error: sxweeklyachiveError, triggerFetch: sxweeklyachiveTriggerFetch } = usehandle_getWeeklyAchiveData(fromdate, todate, df);
  const { data: sxmonthlyachiveData, loading: sxmonthlyachiveLoading, error: sxmonthlyachiveError, triggerFetch: sxmonthlyachiveTriggerFetch } = usehandle_getMonthlyAchiveData(fromdate, todate, df);
  const { data: sxyearlyachiveData, loading: sxyearlyachiveLoading, error: sxyearlyachiveError, triggerFetch: sxyearlyachiveTriggerFetch } = usehandle_getYearlyAchiveData(fromdate, todate, df);

  const { data: sxdailyeffData, overview: sxEffOverview, loading: sxdailyeffLoading, error: sxdailyeffError, triggerFetch: sxdailyeffTriggerFetch } = usehandle_getDailyEffData(fromdate, todate, df);
  const { data: sxweeklyeffData, loading: sxweeklyeffLoading, error: sxweeklyeffError, triggerFetch: sxweeklyeffTriggerFetch } = usehandle_getWeeklyEffData(fromdate, todate, df);
  const { data: sxmonthlyeffData, loading: sxmonthlyeffLoading, error: sxmonthlyeffError, triggerFetch: sxmonthlyeffTriggerFetch } = usehandle_getMonthlyEffData(fromdate, todate, df);
  const { data: sxyearlyeffData, loading: sxyearlyeffLoading, error: sxyearlyeffError, triggerFetch: sxyearlyeffTriggerFetch } = usehandle_getYearlyEffData(fromdate, todate, df);

  const {data: planLossData, loading: planLossLoading, error: planLossError, triggerFetch: planLossTriggerFetch } = usehandle_getPlanLossData(fromdate, todate, df);
  const { data: sxlosstimebyemplData, loading: sxlosstimebyemplLoading, error: sxlosstimebyemplError, triggerFetch: sxlosstimebyemplTriggerFetch } = usehandle_getSXLossTimeByEmpl(fromdate, todate, df);
  const { data: sxlosstimebyreasonData, loading: sxlosstimebyreasonLoading, error: sxlosstimebyreasonError, triggerFetch: sxlosstimebyreasonTriggerFetch } = usehandle_getSXLossTimeByReason(fromdate, todate, df);
  const handle_getMachineList = async (FACTORY: string) => {
    setMachineList(await f_getMachineListData());    
  } 
  const initFunction = async () => {
    Swal.fire({
      title: "Đang tải báo cáo",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    Promise.all([
      sxdailylosstrendTriggerFetch(),
      sxweeklylosstrendTriggerFetch(),
      sxmonthlylosstrendTriggerFetch(),
      sxyearlylosstrendTriggerFetch(),
      sxdailyachiveTriggerFetch(),
      sxweeklyachiveTriggerFetch(),
      sxmonthlyachiveTriggerFetch(),
      sxyearlyachiveTriggerFetch(),
      sxdailyeffTriggerFetch(),
      sxweeklyeffTriggerFetch(),
      sxmonthlyeffTriggerFetch(),
      sxyearlyeffTriggerFetch(),
      planLossTriggerFetch(),
      sxlosstimebyemplTriggerFetch(),
      sxlosstimebyreasonTriggerFetch(),
      ycgapTriggerFetch(),
      sxgapTriggerFetch(),
      ktgapTriggerFetch(),
      allgapTriggerFetch(),
      ycsxgapbackTriggerFetch(),
      sxgapbackTriggerFetch(),
      ktgapbackTriggerFetch(),
      allgapbackTriggerFetch(),
      allhoanthanhtruochanratebackTriggerFetch(),
      allhoanthanhtruochanrateTriggerFetch(),
      allhoanthanhtruochanrateTriggerFetch2(),
      allhoanthanhtruochanratebackTriggerFetch2()
    ]).then((values) => {
      Swal.fire("Thông báo", "Đã load xong báo cáo", 'success');
    });
  }
  useEffect(() => {
    handle_getMachineList("ALL");
    initFunction();
  }, []);
  return (
    <div className="sxreport">
      <div className="title">
        <span>PRODUCTION PERFORMANCE REPORT</span>
      </div>
      <div className="doanhthureport">
        <div className="pobalancesummary">
          <label>
            <b>Từ ngày:</b>
            <input
              type="date"
              value={fromdate.slice(0, 10)}
              onChange={(e) => {
                setFromDate(e.target.value);
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
              }}
            ></input>
          </label>
          <label>
            <b>Customer:</b>{" "}
            <input
              type="text"
              value={cust_name}
              onChange={(e) => {
                setCust_Name(e.target.value);
              }}
            ></input> ({searchCodeArray.length})
          </label>
          <label>
            <b>Default:</b>{" "}
            <Checkbox
              checked={df}
              onChange={(e) => {
                setDF(e.target.checked);
                if (!df)
                  setSearchCodeArray([]);
              }}
              inputProps={{ "aria-label": "controlled" }}
            />
          </label>
          <label>
            <b>Machine:</b>{" "}
            <select
              value={selectedMachine}
              onChange={(e) => {
                setSelectedMachine(e.target.value);
                planLossTriggerFetch()
              }}  
            >             
              {machineList.map((machine: MACHINE_LIST, index: number) => (
                <option key={index} value={machine.EQ_NAME}>{machine.EQ_NAME}</option>
              ))}
            </select> 
          </label>
          <button
            className="searchbutton"
            onClick={() => {
              //ycgapTriggerFetch();
              //console.log(ycgapData);
              initFunction();
            }}
          >
            Search
          </button>
        </div>
        <span className="section_title">1. PRODUCTION LOSS OVERVIEW</span>
        <div className="revenuewidget">
          <div className="revenuwdg">
            <WidgetSXLOSS
              widgettype="revenue"
              label="Yesterday loss"
              topColor="#4e9ce6"
              botColor="#ffffff"
              material_ppm={sxdailylosstrendData[sxdailylosstrendData.length - 2]?.PURE_INPUT}
              process_ppm={sxdailylosstrendData[sxdailylosstrendData.length - 2]?.PURE_OUTPUT}
              total_ppm={sxdailylosstrendData[sxdailylosstrendData.length - 2]?.LOSS_RATE}
            />
          </div>
          <div className="revenuwdg">
            <WidgetSXLOSS
              widgettype="revenue"
              label="This Week loss"
              topColor="#4e9ce6"
              botColor="#ffffff"
              material_ppm={sxweeklylosstrendData[0]?.PURE_INPUT}
              process_ppm={sxweeklylosstrendData[0]?.PURE_OUTPUT}
              total_ppm={sxweeklylosstrendData[0]?.LOSS_RATE}
            />
          </div>
          <div className="revenuwdg">
            <WidgetSXLOSS
              widgettype="revenue"
              label="This Month loss"
              topColor="#4e9ce6"
              botColor="#ffffff"
              material_ppm={sxmonthlylosstrendData[0]?.PURE_INPUT}
              process_ppm={sxmonthlylosstrendData[0]?.PURE_OUTPUT}
              total_ppm={sxmonthlylosstrendData[0]?.LOSS_RATE}
            />
          </div>
          <div className="revenuwdg">
            <WidgetSXLOSS
              widgettype="revenue"
              label="This Year loss"
              topColor="#4e9ce6"
              botColor="#ffffff"
              material_ppm={sxyearlylosstrendData[0]?.PURE_INPUT}
              process_ppm={sxyearlylosstrendData[0]?.PURE_OUTPUT}
              total_ppm={sxyearlylosstrendData[0]?.LOSS_RATE}
            />
          </div>
        </div>
        <br></br>
        <hr></hr>
        <div className="graph">
          <span className="section_title">2. PRODUCTION LOSS TRENDING</span>
          <div className="dailygraphtotal">
            <div className="dailygraphtotal">
              <div className="dailygraph">
                <span className="subsection">Daily Loss <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(sxdailylosstrendData, "Daily Loss Data");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton>
                </span>
                <SX_DailyLossTrend
                  dldata={sxdailylosstrendData}
                  processColor="#53eb34"
                  materialColor="#ff0000"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Weekly Loss <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(sxweeklylosstrendData, "Weekly New Code Data");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <SX_WeeklyLossTrend
                  dldata={[...sxweeklylosstrendData].reverse()}
                  processColor="#53eb34"
                  materialColor="#ff0000"
                />
              </div>
            </div>
            <div className="monthlyweeklygraph">
              <div className="dailygraph">
                <span className="subsection">Monthly Loss <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(sxmonthlylosstrendData, "Monthly Loss Data");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <SX_MonthlyLossTrend
                  dldata={[...sxmonthlylosstrendData].reverse()}
                  processColor="#53eb34"
                  materialColor="#ff0000"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Yearly Loss <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(sxyearlylosstrendData, "Yearly Loss Data");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <SX_YearlyLossTrend
                  dldata={[...sxyearlylosstrendData].reverse()}
                  processColor="#53eb34"
                  materialColor="#ff0000"
                />
              </div>
            </div>
          </div>
          {getCompany() === "CMS" && <div className="dailygraphtotal">
            <div className="dailygraphtotal">
              <div className="dailygraph">
                <span className="subsection">PLAN LOSS GRAPH <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(planLossData, "SX PLan loss trend");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton>    
                <label>
            <b>Machine:</b>{" "}
            <select
              value={selectedMachine}
              onChange={(e) => {
                setSelectedMachine(e.target.value);
                planLossTriggerFetch()
              }}  
            >
              {machineList.map((machine: MACHINE_LIST, index: number) => (
                <option key={index} value={machine.EQ_NAME}>{machine.EQ_NAME}</option>
              ))}
            </select> 
          </label>            
                </span>
                <SXPlanLossTrend
                  dldata={planLossData}
                  processColor="#72c7ff"
                  materialColor="#ad9f26"
                />
              </div>
            </div>
          </div>}
          <span className="section_title">3. PRODUCTION ACHIVEMENT OVERVIEW</span>
          <div className="revenuewidget">
            <div className="revenuwdg">
              <WidgetSXAchive
                widgettype="revenue"
                label="Yesterday achivement"
                topColor="#b1e64e"
                botColor="#ffffff"
                material_ppm={sxdailyachiveData[sxdailyachiveData.length - 2]?.ACHIVE_RATE}
                process_ppm={sxdailyachiveData[sxdailyachiveData.length - 2]?.ACHIVE_RATE}
                total_ppm={sxdailyachiveData[sxdailyachiveData.length - 2]?.ACHIVE_RATE}
              />
            </div>
            <div className="revenuwdg">
              <WidgetSXAchive
                widgettype="revenue"
                label="This Week achivement"
                topColor="#b1e64e"
                botColor="#ffffff"
                material_ppm={sxweeklyachiveData[0]?.ACHIVE_RATE}
                process_ppm={sxweeklyachiveData[0]?.ACHIVE_RATE}
                total_ppm={sxweeklyachiveData[0]?.ACHIVE_RATE}
              />
            </div>
            <div className="revenuwdg">
              <WidgetSXAchive
                widgettype="revenue"
                label="This Month achivement"
                topColor="#b1e64e"
                botColor="#ffffff"
                material_ppm={sxmonthlyachiveData[0]?.ACHIVE_RATE}
                process_ppm={sxmonthlyachiveData[0]?.ACHIVE_RATE}
                total_ppm={sxmonthlyachiveData[0]?.ACHIVE_RATE}
              />
            </div>
            <div className="revenuwdg">
              <WidgetSXAchive
                widgettype="revenue"
                label="This Year achivement"
                topColor="#b1e64e"
                botColor="#ffffff"
                material_ppm={sxyearlyachiveData[0]?.ACHIVE_RATE}
                process_ppm={sxyearlyachiveData[0]?.ACHIVE_RATE}
                total_ppm={sxyearlyachiveData[0]?.ACHIVE_RATE}
              />
            </div>
          </div>
          <br></br>
          <hr></hr>
          <span className="section_title">4. PRODUCTION ACHIVEMENT TRENDING</span>
          <div className="dailygraphtotal">
            <div className="dailygraphtotal">
              <div className="dailygraph">
                <span className="subsection">Daily Achiv Rate <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(sxdailyachiveData, "Daily Achive Data");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton>
                </span>
                <SXDailyAchiveTrend
                  dldata={sxdailyachiveData}
                  processColor="#f1f5c8"
                  materialColor="#74c938"
                />
              </div>
            </div>
          </div>
          <div className="dailygraphtotal">
            <div className="monthlyweeklygraph">
              <div className="dailygraph">
                <span className="subsection">Weekly SX Achive <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(sxweeklyachiveData, "Weekly SX Achive");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <SXWeeklyAchiveTrend
                  dldata={[...sxweeklyachiveData].reverse()}
                  processColor="#f1f5c8"
                  materialColor="#74c938"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Monthly SX Achive <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(sxmonthlyachiveData, "Monthly SX Achive");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <SXMonthlyAchiveTrend
                  dldata={[...sxmonthlyachiveData].reverse()}
                  processColor="#f1f5c8"
                  materialColor="#74c938"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Yearly SX Achive <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(sxyearlyachiveData, "Yearly SX Achive");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <SXYearlyAchiveTrend
                  dldata={[...sxyearlyachiveData].reverse()}
                  processColor="#f1f5c8"
                  materialColor="#74c938"
                />
              </div>
            </div>
          </div>
          <br></br>
          <hr></hr>
          <span className="section_title">5. PRODUCTION EFFICIENCY OVERVIEW</span>
          <div className='mainprogressdiv'>
            <div className='subprogressdiv'>
              <div className='sectiondiv'>
                <div className='efficiencydiv'>
                  <CIRCLE_COMPONENT
                    type='timesummary'
                    value={`${sxEffOverview.OPERATION_RATE.toLocaleString('en-US',{style:'percent'})}`}
                    title='OPERATION RATE'
                    color='red'
                  />
                  <CIRCLE_COMPONENT
                    type='timesummary'
                    value={`${sxEffOverview.HIEU_SUAT_TIME.toLocaleString('en-US',{style:'percent'})}`}
                    title='PROD EFFICIENCY'
                    color='#FE28A7'
                  />
                  <CIRCLE_COMPONENT
                    type='timesummary'
                    value={`${sxEffOverview.SETTING_TIME_RATE.toLocaleString('en-US',{style:'percent'})}`}
                    title='EQ EFFICIENCY'
                    color='#00B215'
                  />
                  <CIRCLE_COMPONENT
                    type='time'
                    value={`${sxEffOverview.ALVB_TIME.toLocaleString('en-US')} min`}
                    title='AVLB TIME'
                    color='blue'
                  />
                  <CIRCLE_COMPONENT
                    type='time'
                    value={`${sxEffOverview.TOTAL_TIME.toLocaleString('en-US')} min`}
                    title='TT PROD TIME'
                    color='#742BFE'
                  />
                  <CIRCLE_COMPONENT
                    type='time'
                    value={`${sxEffOverview.SETTING_TIME.toLocaleString('en-US')} min`}
                    title='SETTING TIME'
                    color='#FE5E2B'
                  />
                  <CIRCLE_COMPONENT
                    type='time'
                    value={`${sxEffOverview.PURE_RUN_TIME.toLocaleString('en-US')} min`}
                    title='RUN TIME'
                    color='#21B800'
                  />
                  <CIRCLE_COMPONENT
                    type='time'
                    value={`${sxEffOverview.LOSS_TIME.toLocaleString('en-US')} min`}
                    title='LOSS TIME'
                    color='red'
                  />
                </div>
              </div>             
            </div>
          </div>


          <br></br>
          <hr></hr>
          <span className="section_title">6. PRODUCTION EFFICIENCY TRENDING</span>
          <div className="dailygraphtotal">
            <div className="dailygraphtotal">
              <div className="dailygraph">
                <span className="subsection">Daily EFF Rate <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(sxdailyeffData, "Daily EFF Rate");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton>
                </span>
                <SXDailyEffTrend
                  dldata={[...sxdailyeffData].reverse()}
                  processColor="#f1f5c8"
                  materialColor="#74c938"
                />
              </div>
            </div>
          </div>
          <div className="dailygraphtotal">
            <div className="monthlyweeklygraph">
              <div className="dailygraph">
                <span className="subsection">Weekly EFF Rate <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(sxweeklyeffData, "Weekly EFF Rate");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <SXWeeklyEffTrend
                  dldata={[...sxweeklyeffData].reverse()}
                  processColor="#f1f5c8"
                  materialColor="#74c938"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Monthly EFF Rate <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(sxmonthlyeffData, "Monthly EFF Rate");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <SXMonthlyEffTrend
                  dldata={[...sxmonthlyeffData].reverse()}
                  processColor="#f1f5c8"
                  materialColor="#74c938"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Yearly EFF Rate <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(sxyearlyeffData, "Yearly EFF Rate");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <SXYearlyEffTrend
                  dldata={[...sxyearlyeffData].reverse()}
                  processColor="#f1f5c8"
                  materialColor="#74c938"
                />
              </div>
            </div>
          </div>
          <span className="subsection_title">2.5 Production Loss Time Details ({fromdate}- {todate})
          </span>
          <div className="defect_trending">
            <div className="dailygraph" style={{ height: '600px' }}>
              <span className="subsection">Loss Time By Reason <IconButton
                className='buttonIcon'
                onClick={() => {
                  SaveExcel(sxlosstimebyreasonData, "SX LOSS TIME BY REASON");
                }}
              >
                <AiFillFileExcel color='green' size={15} />
                Excel
              </IconButton>
              </span>
              <SXLossTimeByReason data={[...sxlosstimebyreasonData].reverse()} />
            </div>
            <div className="dailygraph" style={{ height: '600px' }}>
              <span className="subsection">Loss Time by Employee <IconButton
                className='buttonIcon'
                onClick={() => {
                  SaveExcel(sxlosstimebyemplData, "Loss Time by Employee");
                }}
              >
                <AiFillFileExcel color='green' size={15} />
                Excel
              </IconButton>
              </span>
              <SXLossTimeByEmpl data={[...sxlosstimebyemplData].slice(0,10).reverse()} />
            </div>
          </div>
          <span className="subsection_title">2.5 Production Lead Time Details ({fromdate}- {todate})
          </span>
          <div className="defect_trending">
            <div className="dailygraph" style={{ height: '600px' }}>
              <span className="subsection">Tỉ trọng YCSX gấp theo số ngày (Ngày YC- Ngày Giao)<IconButton
                className='buttonIcon'
                onClick={() => {
                  SaveExcel(ycsxgapbackData, "YCSX GAP RATE");
                }}
              >
                <AiFillFileExcel color='green' size={15} />
                Excel
              </IconButton>
              </span>
              <YCSX_GAP_RATE_KD data={[...ycgapData].reverse()} />
            </div>
            <div className="dailygraph" style={{ height: '600px' }}>
              <span className="subsection">Tỉ trọng số ngày hoàn thành YCSX (Ngày yc- Ngày nhập kiểm cuối) <IconButton
                className='buttonIcon'
                onClick={() => {
                  SaveExcel(sxgapbackData, "SX GAP RATE");
                }}
              >
                <AiFillFileExcel color='green' size={15} />
                Excel
              </IconButton>
              </span>
              <YCSX_GAP_RATE data={[...sxgapData].reverse()} />
            </div>
          </div>
          <div className="defect_trending">
            <div className="dailygraph" style={{ height: '600px' }}>
              <span className="subsection">Tỉ trọng số ngày hoàn thành YCSX (Ngày nhập kiểm đầu- Ngày xuất kiểm cuối) <IconButton
                className='buttonIcon'
                onClick={() => {
                  SaveExcel(ktgapbackData, "KT GAP RATE");
                }}
              >
                <AiFillFileExcel color='green' size={15} />
                Excel
              </IconButton>
              </span>
              <YCSX_GAP_RATE data={[...ktgapData].reverse()} />
            </div>
            <div className="dailygraph" style={{ height: '600px' }}>
              <span className="subsection">Tỉ trọng số ngày hoàn thành YCSX ALL CĐ (Từ lúc lên yc tới ngày kiểm cuối) <IconButton
                className='buttonIcon'
                onClick={() => {
                  SaveExcel(allgapbackData, "ALL GAP RATE");
                }}
              >
                <AiFillFileExcel color='green' size={15} />
                Excel
              </IconButton>
              </span>
              <YCSX_GAP_RATE data={[...allgapData].reverse()} />
            </div>
          </div>
          <div className="defect_trending">
            <div className="dailygraph" style={{ height: '600px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span className="subsection">Tỉ trọng số ngày hoàn thành trước hạn (Dương: trước hạn, Âm: quá hạn) <IconButton
                className='buttonIcon'
                onClick={() => {
                  SaveExcel(allhoanthanhtruochanratebackData, "ALL HOAN THANH TRUOC HAN RATE");
                }}
              >
                <AiFillFileExcel color='green' size={15} />
                Excel
              </IconButton>
              </span>
              <YCSX_GAP_RATE data={[...allhoanthanhtruochanrateData].reverse()} />
            </div>
            <div className="dailygraph" style={{ height: '600px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span className="subsection">Chi tiết tỉ trọng giao chậm theo bộ phận <IconButton
                className='buttonIcon'
                onClick={() => {
                  SaveExcel(allhoanthanhtruochanratebackData2, "ALL HOAN THANH TRUOC HAN RATE2");
                }}
              >
                <AiFillFileExcel color='green' size={15} />
                Excel
              </IconButton>
              </span> 
              <YCSX_GAP_RATE2 dldata={[...allhoanthanhtruochanrateData2].reverse()} processColor="#dda224" materialColor="#74c938" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SX_REPORT;
