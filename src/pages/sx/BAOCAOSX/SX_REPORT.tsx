import moment from "moment";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import "./SX_REPORT.scss";
import {
  PQC3_DATA,
  RND_NEWCODE_BY_CUSTOMER,
  RND_NEWCODE_BY_PRODTYPE,
  SX_ACHIVE_DATA,
  SX_TREND_LOSS_DATA,
} from "../../../api/GlobalInterface";
import { Checkbox, IconButton } from "@mui/material";
import { SaveExcel } from "../../../api/GlobalFunction";
import { AiFillFileExcel } from "react-icons/ai";
import WidgetRND from "../../../components/Widget/WidgetRND";
import RNDNewCodeByCustomer from "../../../components/Chart/RND/RNDNewCodeByCustomer";
import RNDNewCodeByProdType from "../../../components/Chart/RND/RNDNewCodeByProdType";
import SX_DailyLossTrend from "../../../components/Chart/SX/SX_DailyLossTrend";
import SX_WeeklyLossTrend from "../../../components/Chart/SX/SX_WeeklyLossTrend";
import SX_MonthlyLossTrend from "../../../components/Chart/SX/SX_MonthlyLossTrend";
import SX_YearlyLossTrend from "../../../components/Chart/SX/SX_YearlyLossTrend";
import WidgetSXLOSS from "../../../components/Widget/WidgetSXLOSS";
import SXDailyAchiveTrend from "../../../components/Chart/SX/SXDailyAchiveTrend";
import SXWeeklyAchiveTrend from "../../../components/Chart/SX/SXWeeklyAchiveTrend";
import SXMonthlyAchiveTrend from "../../../components/Chart/SX/SXMonthlyAchiveTrend";
import SXYearlyAchiveTrend from "../../../components/Chart/SX/SXYearlyAchiveTrend";
const SX_REPORT = () => {
  const [dailysxloss, setDailySXLoss] = useState<SX_TREND_LOSS_DATA[]>([]);
  const [weeklysxloss, setWeeklySXLoss] = useState<SX_TREND_LOSS_DATA[]>([]);
  const [monthlysxloss, setMonthlySXLoss] = useState<SX_TREND_LOSS_DATA[]>([]);
  const [yearlysxloss, setYearlySXLoss] = useState<SX_TREND_LOSS_DATA[]>([]);

  const [dailysxachive, setDailySXAchive] = useState<SX_ACHIVE_DATA[]>([]);
  const [weeklysxachive, setWeeklySXAchive] = useState<SX_ACHIVE_DATA[]>([]);
  const [monthlysxachive, setMonthlySXAchive] = useState<SX_ACHIVE_DATA[]>([]);
  const [yearlysxachive, setYearlySXAchive] = useState<SX_ACHIVE_DATA[]>([]);
  const [fromdate, setFromDate] = useState(moment().add(-14, "day").format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [cust_name, setCust_Name] = useState('');
  const [searchCodeArray, setSearchCodeArray] = useState<string[]>([]);
  const [df, setDF] = useState(true);
  const [newcodebycustomer, setNewCodeByCustomer] = useState<RND_NEWCODE_BY_CUSTOMER[]>([]);
  const [newcodebyprodtype, setNewCodeByProdType] = useState<RND_NEWCODE_BY_PRODTYPE[]>([]);
  const handle_getDailyNewCodeData = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-12, "day").format("YYYY-MM-DD");
    await generalQuery("datasxdailylosstrend", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        
        if (response.data.tk_status !== "NG") {
          const loadeddata: SX_TREND_LOSS_DATA[] = response.data.data.map(
            (element: SX_TREND_LOSS_DATA, index: number) => {
              return {
                ...element,                
                LOSS_RATE: 1-element.PURE_OUTPUT*1.0/element.PURE_INPUT,
                INPUT_DATE: moment.utc(element.INPUT_DATE).format("YYYY-MM-DD"),
              };
            },
          );
          setDailySXLoss(loadeddata);
        } else {
          setDailySXLoss([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getWeeklyNewCodeData = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-70, "day").format("YYYY-MM-DD");
    await generalQuery("datasxweeklylosstrend", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //
        if (response.data.tk_status !== "NG") {
          const loadeddata: SX_TREND_LOSS_DATA[] = response.data.data.map(
            (element: SX_TREND_LOSS_DATA, index: number) => {
              return {
                ...element,  
                LOSS_RATE: 1-element.PURE_OUTPUT*1.0/element.PURE_INPUT,              
              };
            },
          );
          setWeeklySXLoss(loadeddata);
        } else {
          setWeeklySXLoss([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getMonthlyNewCodeData = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-365, "day").format("YYYY-MM-DD");
    await generalQuery("datasxmonthlylosstrend", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //
        if (response.data.tk_status !== "NG") {
          const loadeddata: SX_TREND_LOSS_DATA[] = response.data.data.map(
            (element: SX_TREND_LOSS_DATA, index: number) => {
              return {
                ...element,       
                LOSS_RATE: 1-element.PURE_OUTPUT*1.0/element.PURE_INPUT,                  
              };
            },
          );
          setMonthlySXLoss(loadeddata)
        } else {
          setMonthlySXLoss([])
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getYearlyNewCodeData = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-3650, "day").format("YYYY-MM-DD");
    await generalQuery("datasxyearlylosstrend", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //
        if (response.data.tk_status !== "NG") {
          const loadeddata: SX_TREND_LOSS_DATA[] = response.data.data.map(
            (element: SX_TREND_LOSS_DATA, index: number) => {
              return {
                ...element,        
                LOSS_RATE: 1-element.PURE_OUTPUT*1.0/element.PURE_INPUT,                       
              };
            },
          );
          setYearlySXLoss(loadeddata)
        } else {
          setYearlySXLoss([])
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_newCodeByCustomer = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-14, "day").format("YYYY-MM-DD");
    await generalQuery("rndNewCodeByCustomer", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        // 
        if (response.data.tk_status !== "NG") {
          const loadeddata: RND_NEWCODE_BY_CUSTOMER[] = response.data.data.map(
            (element: RND_NEWCODE_BY_CUSTOMER, index: number) => {
              return {
                ...element,
                id: index
              };
            },
          );
          //console.log(loadeddata);
          setNewCodeByCustomer(loadeddata);
        } else {
          setNewCodeByCustomer([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_newCodeByProdType = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-14, "day").format("YYYY-MM-DD");
    await generalQuery("rndNewCodeByProdType", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        // 
        if (response.data.tk_status !== "NG") {
          const loadeddata: RND_NEWCODE_BY_PRODTYPE[] = response.data.data.map(
            (element: RND_NEWCODE_BY_PRODTYPE, index: number) => {
              return {
                ...element,
                id: index
              };
            },
          );
          //console.log(loadeddata);
          setNewCodeByProdType(loadeddata);
        } else {
          setNewCodeByProdType([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handle_getDailyAchiveData = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-12, "day").format("YYYY-MM-DD");
    await generalQuery("sxdailyachivementtrending", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        
        if (response.data.tk_status !== "NG") {
          const loadeddata: SX_ACHIVE_DATA[] = response.data.data.map(
            (element: SX_ACHIVE_DATA, index: number) => {
              return {
                ...element,                
                ACHIVE_RATE: element.SX_RESULT*1.0/element.PLAN_QTY,
                SX_DATE: moment.utc(element.SX_DATE).format("YYYY-MM-DD"),
              };
            },
          );
          setDailySXAchive(loadeddata);
        } else {
          setDailySXAchive([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getWeeklyAchiveData = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-28, "day").format("YYYY-MM-DD");
    await generalQuery("sxweeklyachivementtrending", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        
        if (response.data.tk_status !== "NG") {
          const loadeddata: SX_ACHIVE_DATA[] = response.data.data.map(
            (element: SX_ACHIVE_DATA, index: number) => {
              return {
                ...element,                
                ACHIVE_RATE: element.SX_RESULT*1.0/element.PLAN_QTY,                
              };
            },
          );
          setWeeklySXAchive(loadeddata);
        } else {
          setWeeklySXAchive([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getMonthlyAchiveData = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-180, "day").format("YYYY-MM-DD");
    await generalQuery("sxmonthlyachivementtrending", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        
        if (response.data.tk_status !== "NG") {
          const loadeddata: SX_ACHIVE_DATA[] = response.data.data.map(
            (element: SX_ACHIVE_DATA, index: number) => {
              return {
                ...element,                
                ACHIVE_RATE: element.SX_RESULT*1.0/element.PLAN_QTY,                
              };
            },
          );
          setMonthlySXAchive(loadeddata);
        } else {
          setMonthlySXAchive([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getYearlyAchiveData = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-3650, "day").format("YYYY-MM-DD");
    await generalQuery("sxyearlyachivementtrending", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        
        if (response.data.tk_status !== "NG") {
          const loadeddata: SX_ACHIVE_DATA[] = response.data.data.map(
            (element: SX_ACHIVE_DATA, index: number) => {
              return {
                ...element,                
                ACHIVE_RATE: element.SX_RESULT*1.0/element.PLAN_QTY,                
              };
            },
          );
          setYearlySXAchive(loadeddata);
        } else {
          setYearlySXAchive([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      handle_getDailyNewCodeData("ALL", searchCodeArray),
      handle_getWeeklyNewCodeData("ALL", searchCodeArray),
      handle_getMonthlyNewCodeData("ALL", searchCodeArray),
      handle_getYearlyNewCodeData("ALL", searchCodeArray),
      handle_getDailyAchiveData("ALL", searchCodeArray),
      handle_getWeeklyAchiveData("ALL", searchCodeArray),
      handle_getMonthlyAchiveData("ALL", searchCodeArray),
      handle_getYearlyAchiveData("ALL", searchCodeArray),
      handle_newCodeByCustomer(fromdate, todate, searchCodeArray),
      handle_newCodeByProdType(fromdate, todate, searchCodeArray),
    ]).then((values) => {
      Swal.fire("Thông báo", "Đã load xong báo cáo", 'success');
    });
  }
  useEffect(() => {
    initFunction();
  }, []);
  return (
    <div className="rndreport">
      <div className="title">
        <span>PRODUCTION REPORT</span>
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
          <button
            className="searchbutton"
            onClick={() => {
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
              label="Today loss"
              topColor="#4e9ce6"
              botColor="#ffffff"
              material_ppm={dailysxloss[dailysxloss.length-1]?.PURE_INPUT}
              process_ppm={dailysxloss[dailysxloss.length-1]?.PURE_OUTPUT}
              total_ppm={dailysxloss[dailysxloss.length-1]?.LOSS_RATE}
            />
          </div>
          <div className="revenuwdg">
            <WidgetSXLOSS
              widgettype="revenue"
              label="This Week loss"
              topColor="#4e9ce6"
              botColor="#ffffff"
              material_ppm={weeklysxloss[0]?.PURE_INPUT}
              process_ppm={weeklysxloss[0]?.PURE_OUTPUT}
              total_ppm={weeklysxloss[0]?.LOSS_RATE}
            />
          </div>
          <div className="revenuwdg">
            <WidgetSXLOSS
              widgettype="revenue"
              label="This Month loss"
              topColor="#4e9ce6"
              botColor="#ffffff"
              material_ppm={monthlysxloss[0]?.PURE_INPUT}
              process_ppm={monthlysxloss[0]?.PURE_OUTPUT}
              total_ppm={monthlysxloss[0]?.LOSS_RATE}
            />
          </div>
          <div className="revenuwdg">
            <WidgetSXLOSS
              widgettype="revenue"
              label="This Year loss"
              topColor="#4e9ce6"
              botColor="#ffffff"
              material_ppm={yearlysxloss[0]?.PURE_INPUT}
              process_ppm={yearlysxloss[0]?.PURE_OUTPUT}
              total_ppm={yearlysxloss[0]?.LOSS_RATE}
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
                    SaveExcel(dailysxloss, "Daily Loss Data");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton>
                </span>
                <SX_DailyLossTrend
                  dldata={dailysxloss}
                  processColor="#53eb34"
                  materialColor="#ff0000"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Weekly Loss <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(weeklysxloss, "Weekly New Code Data");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <SX_WeeklyLossTrend
                  dldata={[...weeklysxloss].reverse()}
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
                    SaveExcel(monthlysxloss, "Monthly Loss Data");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <SX_MonthlyLossTrend
                  dldata={[...monthlysxloss].reverse()}
                  processColor="#53eb34"
                  materialColor="#ff0000"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Yearly Loss <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(yearlysxloss, "Yearly Loss Data");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <SX_YearlyLossTrend
                  dldata={[...yearlysxloss].reverse()}
                  processColor="#53eb34"
                  materialColor="#ff0000"
                />
              </div>
            </div>
          </div>
          <span className="section_title">3. PRODUCTION ACHIVEMENT TRENDING</span>
          <div className="dailygraphtotal">
            <div className="dailygraphtotal">
              <div className="dailygraph">
                <span className="subsection">Daily Achiv Rate <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(dailysxachive, "Daily Achive Data");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton>
                </span>
                <SXDailyAchiveTrend
                  dldata={dailysxachive}
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
                    SaveExcel(weeklysxachive, "Weekly SX Achive");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <SXWeeklyAchiveTrend
                  dldata={[...weeklysxachive].reverse()}
                  processColor="#f1f5c8"
                  materialColor="#74c938"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Monthly SX Achive <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(monthlysxachive, "Monthly SX Achive");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <SXMonthlyAchiveTrend
                  dldata={[...monthlysxachive].reverse()}
                  processColor="#f1f5c8"
                  materialColor="#74c938"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Yearly SX Achive <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(yearlysxachive, "Yearly SX Achive");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <SXYearlyAchiveTrend
                  dldata={[...yearlysxachive].reverse()}
                  processColor="#f1f5c8"
                  materialColor="#74c938"
                />
              </div>
            </div>
          </div>
          <span className="subsection_title">2.5 New Code By Customer and Prod Type ({fromdate}- {todate})
          </span>
          <div className="defect_trending">
            <div className="dailygraph" style={{ height: '600px' }}>
              <span className="subsection">New Code By Customer <IconButton
                className='buttonIcon'
                onClick={() => {
                  SaveExcel(newcodebycustomer, "Newcode by Customer");
                }}
              >
                <AiFillFileExcel color='green' size={15} />
                Excel
              </IconButton>
              </span>
              <RNDNewCodeByCustomer data={[...newcodebycustomer].reverse()} />
            </div>
            <div className="dailygraph" style={{ height: '600px' }}>
              <span className="subsection">New Code By Product Type <IconButton
                className='buttonIcon'
                onClick={() => {
                  SaveExcel(newcodebyprodtype, "Newcode by Prod Type");
                }}
              >
                <AiFillFileExcel color='green' size={15} />
                Excel
              </IconButton>
              </span>
              <RNDNewCodeByProdType data={[...newcodebyprodtype].reverse()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SX_REPORT;
