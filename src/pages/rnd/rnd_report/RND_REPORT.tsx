import moment from "moment";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import "./RND_REPORT.scss";
import {
  PQC3_DATA,
  RND_NEWCODE_BY_CUSTOMER,
  RND_NEWCODE_BY_PRODTYPE,
  RND_NEWCODE_TREND_DATA,
} from "../../../api/GlobalInterface";
import { Checkbox, IconButton } from "@mui/material";
import { SaveExcel } from "../../../api/GlobalFunction";
import { AiFillFileExcel } from "react-icons/ai";
import WidgetRND from "../../../components/Widget/WidgetRND";
import RNDDailyNewCode from "../../../components/Chart/RND/RNDDailyNewCode";
import RNDWeeklyNewCode from "../../../components/Chart/RND/RNDWeeklyNewCode";
import RNDMonthlyNewCode from "../../../components/Chart/RND/RNDMonthlyNewCode";
import RNDYearlyNewCode from "../../../components/Chart/RND/RNDYearlyNewCode";
import RNDNewCodeByCustomer from "../../../components/Chart/RND/RNDNewCodeByCustomer";
import RNDNewCodeByProdType from "../../../components/Chart/RND/RNDNewCodeByProdType";
const RND_REPORT = () => {
  const [dailynewcode, setDailyNewCode] = useState<RND_NEWCODE_TREND_DATA[]>([]);
  const [weeklynewcode, setWeeklyNewCode] = useState<RND_NEWCODE_TREND_DATA[]>([]);
  const [monthlynewcode, setMonthlyNewCode] = useState<RND_NEWCODE_TREND_DATA[]>([]);
  const [yearlynewcode, setYearlyNewCode] = useState<RND_NEWCODE_TREND_DATA[]>([]);
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
    await generalQuery("rnddailynewcode", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: RND_NEWCODE_TREND_DATA[] = response.data.data.map(
            (element: RND_NEWCODE_TREND_DATA, index: number) => {
              return {
                ...element,
                TOTAL: element.NEWCODE + element.ECN,
                CREATED_DATE: moment.utc(element.CREATED_DATE).format("YYYY-MM-DD"),
              };
            },
          );
          setDailyNewCode(loadeddata);
        } else {
          setDailyNewCode([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getWeeklyNewCodeData = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-70, "day").format("YYYY-MM-DD");
    await generalQuery("rndweeklynewcode", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: RND_NEWCODE_TREND_DATA[] = response.data.data.map(
            (element: RND_NEWCODE_TREND_DATA, index: number) => {
              return {
                ...element,
                TOTAL: element.NEWCODE + element.ECN,
              };
            },
          );
          setWeeklyNewCode(loadeddata);
        } else {
          setWeeklyNewCode([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getMonthlyNewCodeData = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-365, "day").format("YYYY-MM-DD");
    await generalQuery("rndmonthlynewcode", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: RND_NEWCODE_TREND_DATA[] = response.data.data.map(
            (element: RND_NEWCODE_TREND_DATA, index: number) => {
              return {
                ...element,
                TOTAL: element.NEWCODE + element.ECN,
              };
            },
          );
          setMonthlyNewCode(loadeddata)
        } else {
          setMonthlyNewCode([])
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getYearlyNewCodeData = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-3650, "day").format("YYYY-MM-DD");
    await generalQuery("rndyearlynewcode", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: RND_NEWCODE_TREND_DATA[] = response.data.data.map(
            (element: RND_NEWCODE_TREND_DATA, index: number) => {
              return {
                ...element,
                TOTAL: element.NEWCODE + element.ECN,
              };
            },
          );
          setYearlyNewCode(loadeddata)
        } else {
          setYearlyNewCode([])
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
        // console.log(response.data.data);
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
        // console.log(response.data.data);
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
        <span>RND REPORT</span>
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
        <span className="section_title">1. OverView</span>
        <div className="revenuewidget">
          <div className="revenuwdg">
            <WidgetRND
              widgettype="revenue"
              label="Today Code"
              topColor="#4e9ce6"
              botColor="#ffffff"
              material_ppm={dailynewcode[0]?.NEWCODE}
              process_ppm={dailynewcode[0]?.ECN}
              total_ppm={dailynewcode[0]?.NEWCODE + dailynewcode[0]?.ECN}
            />
          </div>
          <div className="revenuwdg">
            <WidgetRND
              widgettype="revenue"
              label="This Week Code"
              topColor="#4e9ce6"
              botColor="#ffffff"
              material_ppm={weeklynewcode[0]?.NEWCODE}
              process_ppm={weeklynewcode[0]?.ECN}
              total_ppm={weeklynewcode[0]?.NEWCODE + weeklynewcode[0]?.ECN}
            />
          </div>
          <div className="revenuwdg">
            <WidgetRND
              widgettype="revenue"
              label="This Month Code"
              topColor="#4e9ce6"
              botColor="#ffffff"
              material_ppm={monthlynewcode[0]?.NEWCODE}
              process_ppm={monthlynewcode[0]?.ECN}
              total_ppm={monthlynewcode[0]?.NEWCODE + monthlynewcode[0]?.ECN}
            />
          </div>
          <div className="revenuwdg">
            <WidgetRND
              widgettype="revenue"
              label="This Year Code"
              topColor="#4e9ce6"
              botColor="#ffffff"
              material_ppm={yearlynewcode[0]?.NEWCODE}
              process_ppm={yearlynewcode[0]?.ECN}
              total_ppm={yearlynewcode[0]?.NEWCODE + yearlynewcode[0]?.ECN}
            />
          </div>
        </div>
        <br></br>
        <hr></hr>
        <div className="graph">
          <span className="section_title">2. RND NewCode Trending</span>
          <div className="dailygraphtotal">
            <div className="dailygraphtotal">
              <div className="dailygraph">
                <span className="subsection">Daily New Code <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(dailynewcode, "Daily New Code Data");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton>
                </span>
                <RNDDailyNewCode
                  dldata={[...dailynewcode].reverse()}
                  processColor="#53eb34"
                  materialColor="#ff0000"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Weekly New Code <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(weeklynewcode, "Weekly New Code Data");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <RNDWeeklyNewCode
                  dldata={[...weeklynewcode].reverse()}
                  processColor="#53eb34"
                  materialColor="#ff0000"
                />
              </div>
            </div>
            <div className="monthlyweeklygraph">
              <div className="dailygraph">
                <span className="subsection">Monthly New Code <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(monthlynewcode, "Monthly New Code Data");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <RNDMonthlyNewCode
                  dldata={[...monthlynewcode].reverse()}
                  processColor="#53eb34"
                  materialColor="#ff0000"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Yearly New Code <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(yearlynewcode, "Yearly New Code Data");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <RNDYearlyNewCode
                  dldata={[...yearlynewcode].reverse()}
                  processColor="#53eb34"
                  materialColor="#ff0000"
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
export default RND_REPORT;
