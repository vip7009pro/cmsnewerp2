import moment from "moment";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import "./OQC_REPORT.scss";
import { OQC_TREND_DATA, OQC_NG_BY_CUSTOMER, OQC_NG_BY_PRODTYPE } from "../../../api/GlobalInterface";
import { Checkbox, IconButton } from "@mui/material";
import { SaveExcel } from "../../../api/GlobalFunction";
import { AiFillFileExcel } from "react-icons/ai";
import OQCDailyNGRate from "../../../components/Chart/OQC/OQCDailyNGRate";
import OQCWeeklyNGRate from "../../../components/Chart/OQC/OQCWeeklyNGRate";
import OQCMonthlyNGRate from "../../../components/Chart/OQC/OQCMonthlyNGRate";
import OQCYearlyNGRate from "../../../components/Chart/OQC/OQCYearlyNGRate";
import WidgetOQC from "../../../components/Widget/WidgetOQC";
import OQCNGByCustomer from "../../../components/Chart/OQC/OQCNGByCustomer";
import OQCNGByProdType from "../../../components/Chart/OQC/OQCNGByProdType";
const OQC_REPORT = () => {
  const [dailyppm, setDailyPPM] = useState<OQC_TREND_DATA[]>([]);
  const [weeklyppm, setWeeklyPPM] = useState<OQC_TREND_DATA[]>([]);
  const [monthlyppm, setMonthlyPPM] = useState<OQC_TREND_DATA[]>([]);
  const [yearlyppm, setYearlyPPM] = useState<OQC_TREND_DATA[]>([]);
  const [oqcNGByCustomer, setOQCNGByCustomer] = useState<OQC_NG_BY_CUSTOMER[]>([]);
  const [oqcNGByProdType, setOQCNGByProdType] = useState<OQC_NG_BY_PRODTYPE[]>([]);
  const [fromdate, setFromDate] = useState(moment().add(-14, "day").format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [cust_name, setCust_Name] = useState('');
  const [searchCodeArray, setSearchCodeArray] = useState<string[]>([]);
  const [df, setDF] = useState(true);
  const handle_getOQCNGByCustomer = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-12, "day").format("YYYY-MM-DD");
    await generalQuery("ngbyCustomerOQC", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: OQC_NG_BY_CUSTOMER[] = response.data.data.map(
            (element: OQC_NG_BY_CUSTOMER, index: number) => {
              return {
                ...element,                            
              };
            },
          );
          //console.log(loadeddata);         
          setOQCNGByCustomer(loadeddata);
        } else {
          setOQCNGByCustomer([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getOQCNGByProdType = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-12, "day").format("YYYY-MM-DD");
    await generalQuery("ngbyProTypeOQC", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: OQC_NG_BY_PRODTYPE[] = response.data.data.map(
            (element: OQC_NG_BY_PRODTYPE, index: number) => {
              return {
                ...element,                            
              };
            },
          );
          //console.log(loadeddata);         
          setOQCNGByProdType(loadeddata);
        } else {
          setOQCNGByProdType([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getDailyPPM = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-12, "day").format("YYYY-MM-DD");
    await generalQuery("dailyOQCTrendingData", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: OQC_TREND_DATA[] = response.data.data.map(
            (element: OQC_TREND_DATA, index: number) => {
              return {
                ...element,
                OK_LOT: element.TOTAL_LOT - element.NG_LOT,
                NG_RATE: element.NG_LOT * 100 / element.TOTAL_LOT,
                DELIVERY_DATE: moment
                  .utc(element.DELIVERY_DATE)
                  .format("YYYY-MM-DD"),
              };
            },
          );
          //console.log(loadeddata);         
          setDailyPPM(loadeddata);
        } else {
          setDailyPPM([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getWeeklyPPM = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-70, "day").format("YYYY-MM-DD");
    await generalQuery("weeklyOQCTrendingData", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: OQC_TREND_DATA[] = response.data.data.map(
            (element: OQC_TREND_DATA, index: number) => {
              return {
                ...element,
                OK_LOT: element.TOTAL_LOT - element.NG_LOT,
                NG_RATE: element.NG_LOT * 100 / element.TOTAL_LOT,
              };
            },
          );
          setWeeklyPPM(loadeddata);
        } else {
          setWeeklyPPM([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getMonthlyPPM = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-365, "day").format("YYYY-MM-DD");
    await generalQuery("monthlyOQCTrendingData", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: OQC_TREND_DATA[] = response.data.data.map(
            (element: OQC_TREND_DATA, index: number) => {
              return {
                ...element,
                OK_LOT: element.TOTAL_LOT - element.NG_LOT,
                NG_RATE: element.NG_LOT * 100 / element.TOTAL_LOT,
              };
            },
          );
          setMonthlyPPM(loadeddata)
        } else {
          setMonthlyPPM([])
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getYearlyPPM = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-3650, "day").format("YYYY-MM-DD");
    await generalQuery("yearlyOQCTrendingData", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: OQC_TREND_DATA[] = response.data.data.map(
            (element: OQC_TREND_DATA, index: number) => {
              return {
                ...element,
                OK_LOT: element.TOTAL_LOT - element.NG_LOT,
                NG_RATE: element.NG_LOT * 100 / element.TOTAL_LOT,
              };
            },
          );
          setYearlyPPM(loadeddata)
        } else {
          setYearlyPPM([])
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
      handle_getOQCNGByCustomer("ALL", searchCodeArray),
      handle_getOQCNGByProdType("ALL", searchCodeArray),
      handle_getDailyPPM("ALL", searchCodeArray),
      handle_getWeeklyPPM("ALL", searchCodeArray),
      handle_getMonthlyPPM("ALL", searchCodeArray),
      handle_getYearlyPPM("ALL", searchCodeArray),
    ]).then((values) => {
      Swal.fire("Thông báo", "Đã load xong báo cáo", 'success');
    });
  }
  useEffect(() => {
    initFunction();
  }, []);
  return (
    <div className="oqcreport">
      <div className="title">
        <span>OQC REPORT</span>
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
                //handleGetInspectionWorst(e.target.value, todate, worstby, ng_type);
                //handle_getInspectSummary(e.target.value, todate);
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
                //handleGetInspectionWorst(fromdate, e.target.value, worstby, ng_type);
                //handle_getInspectSummary(fromdate,e.target.value);
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
            ></input>
          </label>
          <label>
            <b>Default:</b>{" "}
            <Checkbox
              checked={df}
              onChange={(e) => {
                //console.log(e.target.checked);
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
        <span className="section_title">1. OverView</span>
        <div className="revenuewidget">
          <div className="revenuwdg">
            <WidgetOQC
              widgettype="revenue"
              label="Today NG"
              topColor="#ffffff"
              botColor="#4bb7e9"
              material_ppm={dailyppm[0]?.NG_RATE}
              process_ppm={dailyppm[0]?.NG_RATE}
              total_ppm={dailyppm[0]?.NG_RATE}
            />
          </div>
          <div className="revenuwdg">
            <WidgetOQC
              widgettype="revenue"
              label="This Week NG"
              topColor="#ffffff"
              botColor="#4bb7e9"
              material_ppm={weeklyppm[0]?.NG_RATE}
              process_ppm={weeklyppm[0]?.NG_RATE}
              total_ppm={weeklyppm[0]?.NG_RATE}
            />
          </div>
          <div className="revenuwdg">
            <WidgetOQC
              widgettype="revenue"
              label="This Month NG"
              topColor="#ffffff"
              botColor="#4bb7e9"
              material_ppm={monthlyppm[0]?.NG_RATE}
              process_ppm={monthlyppm[0]?.NG_RATE}
              total_ppm={monthlyppm[0]?.NG_RATE}
            />
          </div>
          <div className="revenuwdg">
            <WidgetOQC
              widgettype="revenue"
              label="This Year NG"
              topColor="#ffffff"
              botColor="#4bb7e9"
              material_ppm={yearlyppm[0]?.NG_RATE}
              process_ppm={yearlyppm[0]?.NG_RATE}
              total_ppm={yearlyppm[0]?.NG_RATE}
            />
          </div>
        </div>
        <br></br>
        <hr></hr>
        <div className="graph">
          <span className="section_title">2. OQC NG Trending</span>
          <div className="dailygraphtotal">
            <div className="dailygraphtotal">
              <div className="dailygraph">
                <span className="subsection">Daily NG Rate <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(dailyppm, "DailyPPMData");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton>
                </span>
                <OQCDailyNGRate
                  dldata={[...dailyppm].reverse()}
                  processColor="#85d9f3"
                  materialColor="#ff0000"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Weekly NG Rate <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(weeklyppm, "WeeklyPPMData");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <OQCWeeklyNGRate
                  dldata={[...weeklyppm].reverse()}
                  processColor="#85d9f3"
                  materialColor="#ff0000"
                />
              </div>
            </div>
            <div className="monthlyweeklygraph">
              <div className="dailygraph">
                <span className="subsection">Monthly NG Rate <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(monthlyppm, "MonthlyPPMData");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <OQCMonthlyNGRate
                  dldata={[...monthlyppm].reverse()}
                  processColor="#85d9f3"
                  materialColor="#ff0000"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Yearly NG Rate <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(yearlyppm, "YearlyPPMData");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <OQCYearlyNGRate
                  dldata={[...yearlyppm].reverse()}
                  processColor="#85d9f3"
                  materialColor="#ff0000"
                />
              </div>
            </div>
          </div>
          <span className="subsection_title">2.5 NG by Customer and Prod Type <IconButton
            className='buttonIcon'
            onClick={() => {
            }}
          >
            <AiFillFileExcel color='green' size={15} />
            Excel
          </IconButton></span>
          <div className="defect_trending">
            <div className="dailygraph" style={{ height: '600px' }}>
              <span className="subsection">NG By Customer <IconButton
                className='buttonIcon'
                onClick={() => {
                }}
              >
                <AiFillFileExcel color='green' size={15} />
                Excel
              </IconButton>
              </span>
              <OQCNGByCustomer data={[...oqcNGByCustomer].reverse()} />
            </div>
            <div className="dailygraph" style={{ height: '600px' }}>
              <span className="subsection">NG By Product Type <IconButton
                className='buttonIcon'
                onClick={() => {
                }}
              >
                <AiFillFileExcel color='green' size={15} />
                Excel
              </IconButton>
              </span>
              <OQCNGByProdType data={[...oqcNGByProdType].reverse()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OQC_REPORT;
