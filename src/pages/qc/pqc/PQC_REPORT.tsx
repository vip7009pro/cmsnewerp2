import moment from "moment";
import React, { startTransition, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, getGlobalSetting } from "../../../api/Api";
import "./PQC_REPORT.scss";
import { CodeListData, DEFECT_TRENDING_DATA, DailyPPMData, FCSTAmountData, InspectSummary, MonthlyPPMData, PATROL_HEADER_DATA, PQC3_DATA, PQCSummary, PQC_PPM_DATA, WEB_SETTING_DATA, WeeklyPPMData, WidgetData_POBalanceSummary, WorstData, YearlyPPMData } from "../../../api/GlobalInterface";
import { Autocomplete, Checkbox, FormControlLabel, FormGroup, IconButton, TextField, Typography, createFilterOptions } from "@mui/material";
import PQCDailyNGRate from "../../../components/Chart/PQC/PQCDailyNGRate";
import PQCWeeklyNGRate from "../../../components/Chart/PQC/PQCWeeklyNGRate";
import PQCMonthlyNGRate from "../../../components/Chart/PQC/PQCMonthlyNGRate";
import PQCYearlyNGRate from "../../../components/Chart/PQC/PQCYearlyNGRate";
import WidgetPQC from "../../../components/Widget/WidgetPQC";
import PQCDailyDefectTrending from "../../../components/Chart/PQC/PQCDailyDefectTrending";
import PQCFCOSTTABLE from "../inspection/PQCFCOSTTABLE";
import PQCDailyFcost from "../../../components/Chart/PQC/PQCDailyFcost";
import PQCWeeklyFcost from "../../../components/Chart/PQC/PQCWeeklyFcost";
import PQCMonthlyFcost from "../../../components/Chart/PQC/PQCMonthlyFcost";
import PQCYearlyFcost from "../../../components/Chart/PQC/PQCYearlyFcost";
import PATROL_COMPONENT from "../../sx/PATROL/PATROL_COMPONENT";
import PATROL_COMPONENT2 from "../../sx/PATROL/PATROL_COMPONENT2";
import { SaveExcel } from "../../../api/GlobalFunction";
import { AiFillFileExcel } from "react-icons/ai";
const PQC_REPORT = () => {
  const [dailyppm1, setDailyPPM1] = useState<PQC_PPM_DATA[]>([]);
  const [weeklyppm1, setWeeklyPPM1] = useState<PQC_PPM_DATA[]>([]);
  const [monthlyppm1, setMonthlyPPM1] = useState<PQC_PPM_DATA[]>([]);
  const [yearlyppm1, setYearlyPPM1] = useState<PQC_PPM_DATA[]>([]);
  const [dailyppm2, setDailyPPM2] = useState<PQC_PPM_DATA[]>([]);
  const [weeklyppm2, setWeeklyPPM2] = useState<PQC_PPM_DATA[]>([]);
  const [monthlyppm2, setMonthlyPPM2] = useState<PQC_PPM_DATA[]>([]);
  const [yearlyppm2, setYearlyPPM2] = useState<PQC_PPM_DATA[]>([]);
  const [dailyppm, setDailyPPM] = useState<PQC_PPM_DATA[]>([]);
  const [weeklyppm, setWeeklyPPM] = useState<PQC_PPM_DATA[]>([]);
  const [monthlyppm, setMonthlyPPM] = useState<PQC_PPM_DATA[]>([]);
  const [yearlyppm, setYearlyPPM] = useState<PQC_PPM_DATA[]>([]);
  const [fromdate, setFromDate] = useState(moment().add(-14, "day").format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [worstby, setWorstBy] = useState('AMOUNT');
  const [ng_type, setNg_Type] = useState('ALL');
  const [inspectSummary, setInspectSummary] = useState<PQCSummary[]>([]);
  const [dailyDefectTrendingData, setDailyDefectTrendingData] = useState<DEFECT_TRENDING_DATA[]>([]);
  const [cust_name, setCust_Name] = useState('');
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const [searchCodeArray, setSearchCodeArray] = useState<string[]>([]);
  const [pqcdatatable, setPqcDataTable] = useState<Array<PQC3_DATA>>([]);
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>({
    G_CODE: "6A00001B",
    G_NAME: "GT-I9500_SJ68-01284A",
    G_NAME_KD: "GT-I9500_SJ68-01284A",
    PROD_LAST_PRICE: 0,
    USE_YN: "N",
  });
  const [df, setDF] = useState(true);
  const filterOptions1 = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });
  const handle_getDailyPPM = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-12, "day").format("YYYY-MM-DD");
    await generalQuery("pqcdailyppm", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC_PPM_DATA[] = response.data.data.map(
            (element: PQC_PPM_DATA, index: number) => {
              return {
                ...element,
                OK_LOT: element.TOTAL_LOT - element.NG_LOT,
                SETTING_DATE: moment
                  .utc(element.SETTING_DATE)
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
    await generalQuery("pqcweeklyppm", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC_PPM_DATA[] = response.data.data.map(
            (element: PQC_PPM_DATA, index: number) => {
              return {
                ...element,
                OK_LOT: element.TOTAL_LOT - element.NG_LOT,
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
    await generalQuery("pqcmonthlyppm", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC_PPM_DATA[] = response.data.data.map(
            (element: PQC_PPM_DATA, index: number) => {
              return {
                ...element,
                OK_LOT: element.TOTAL_LOT - element.NG_LOT,
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
    await generalQuery("pqcyearlyppm", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC_PPM_DATA[] = response.data.data.map(
            (element: PQC_PPM_DATA, index: number) => {
              return {
                ...element,
                OK_LOT: element.TOTAL_LOT - element.NG_LOT,
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
          setYearlyPPM([])
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getInspectSummary = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-7, "day").format("YYYY-MM-DD");
    await generalQuery("getPQCSummary", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQCSummary[] = response.data.data.map(
            (element: PQCSummary, index: number) => {
              return {
                ...element,
              };
            },
          );
          //console.log(loadeddata);
          setInspectSummary(loadeddata);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_getDailyDefectTrending = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-14, "day").format("YYYY-MM-DD");
    await generalQuery("dailyPQCDefectTrending", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        // console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: DEFECT_TRENDING_DATA[] = response.data.data.map(
            (element: DEFECT_TRENDING_DATA, index: number) => {
              return {
                ...element,
                INSPECT_DATE: moment(element.INSPECT_DATE).format("YYYY-MM-DD"),
                id: index
              };
            },
          );
          //console.log(loadeddata);
          setDailyDefectTrendingData(loadeddata);
        } else {
          setDailyDefectTrendingData([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const traPQC3 = (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-7, "day").format("YYYY-MM-DD");
    generalQuery("trapqc3data", {
      ALLTIME: false,
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      CUST_NAME: cust_name,
      PROCESS_LOT_NO: '',
      G_CODE: '',
      G_NAME: '',
      PROD_TYPE: '',
      EMPL_NAME: '',
      PROD_REQUEST_NO: '',
      ID: '',
      FACTORY: 'All',
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC3_DATA[] = response.data.data.map(
            (element: PQC3_DATA, index: number) => {
              //summaryOutput += element.OUTPUT_QTY_EA;
              return {
                ...element,
                OCCURR_TIME: moment
                  .utc(element.OCCURR_TIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            },
          );
          //Swal.fire("Thông báo", "Đã load: " + loadeddata.length + "dong", "success");
          //setSummaryInspect('Tổng Xuất: ' +  summaryOutput.toLocaleString('en-US') + 'EA');
          if (loadeddata.length > 3) {
            setPqcDataTable(loadeddata);
          }
          else {
            setPqcDataTable(loadeddata);
          }
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setPqcDataTable([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const traPQC32 = (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-7, "day").format("YYYY-MM-DD");
    generalQuery("trapqc3data", {
      ALLTIME: false,
      FROM_DATE: from_date,
      TO_DATE: to_date,
      CUST_NAME: cust_name,
      PROCESS_LOT_NO: '',
      G_CODE: '',
      G_NAME: '',
      PROD_TYPE: '',
      EMPL_NAME: '',
      PROD_REQUEST_NO: '',
      ID: '',
      FACTORY: 'All',
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC3_DATA[] = response.data.data.map(
            (element: PQC3_DATA, index: number) => {
              //summaryOutput += element.OUTPUT_QTY_EA;
              return {
                ...element,
                OCCURR_TIME: moment
                  .utc(element.OCCURR_TIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            },
          );
          //Swal.fire("Thông báo", "Đã load: " + loadeddata.length + "dong", "success");
          //setSummaryInspect('Tổng Xuất: ' +  summaryOutput.toLocaleString('en-US') + 'EA');
          if (loadeddata.length > 3) {
            setPqcDataTable(loadeddata);
          }
          else {
            setPqcDataTable(loadeddata);
          }
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setPqcDataTable([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getcodelist = (G_NAME: string) => {
    generalQuery("selectcodeList", { G_NAME: G_NAME })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setCodeList(response.data.data);
        } else {
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
      handle_getDailyPPM("ALL", searchCodeArray),
      handle_getWeeklyPPM("ALL", searchCodeArray),
      handle_getMonthlyPPM("ALL", searchCodeArray),
      handle_getYearlyPPM("ALL", searchCodeArray),
      handle_getDailyDefectTrending(fromdate, todate, searchCodeArray),
      handle_getInspectSummary(fromdate, todate, searchCodeArray),
      traPQC3(fromdate, todate, searchCodeArray)
    ]).then((values) => {
      Swal.fire("Thông báo", "Đã load xong báo cáo", 'success');
    });
  }
  useEffect(() => {
    getcodelist("");
    initFunction();
  }, []);
  return (
    <div className="pqcreport">
      <div className="title">
        <span>PQC REPORT</span>
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
            <b>Worst by:</b>{" "}
            <select
              name="worstby"
              value={worstby}
              onChange={(e) => {
                setWorstBy(e.target.value);
                //handleGetInspectionWorst(fromdate, todate, e.target.value, ng_type);
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
                //handleGetInspectionWorst(fromdate, todate, worstby, e.target.value);
              }}
            >
              <option value={"ALL"}>ALL</option>
              <option value={"P"}>PROCESS</option>
              <option value={"M"}>MATERIAL</option>
            </select>
          </label>
          <b>Code hàng:</b>{" "}
          <label>
            <Autocomplete
              disableCloseOnSelect
              /* multiple={true} */
              sx={{ fontSize: "0.6rem" }}
              ListboxProps={{ style: { fontSize: "0.7rem", } }}
              size='small'
              disablePortal
              options={codeList}
              className='autocomplete1'
              filterOptions={filterOptions1}
              getOptionLabel={(option: CodeListData | any) =>
                `${option.G_CODE}: ${option.G_NAME_KD}:${option.G_NAME}`
              }
              renderInput={(params) => (
                <TextField {...params} label='Select code' />
              )}
              /*  renderOption={(props, option: any, { selected }) => (
                 <li {...props}>
                   <Checkbox
                     sx={{ marginRight: 0 }}
                     checked={selected}
                   />
                   {`${option.G_CODE}: ${option.G_NAME_KD}:${option.G_NAME}`}
                 </li>
               )} */
              renderOption={(props, option: any) => <Typography style={{ fontSize: '0.7rem' }} {...props}>
                {`${option.G_CODE}: ${option.G_NAME_KD}:${option.G_NAME}`}
              </Typography>}
              onChange={(event: any, newValue: CodeListData | any) => {
                //console.log(newValue);
                setSelectedCode(newValue);
                if (searchCodeArray.indexOf(newValue?.G_CODE ?? "") === -1)
                  setSearchCodeArray([...searchCodeArray, newValue?.G_CODE ?? ""]);
                /* setSelectedCodes(newValue); */
              }}
              isOptionEqualToValue={(option: any, value: any) => option.G_CODE === value.G_CODE}
            />
          </label>
          <label>
            <input
              type="text"
              value={searchCodeArray.concat()}
              onChange={(e) => {
                setSearchCodeArray([]);
              }}
            ></input> ({searchCodeArray.length})
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
            <WidgetPQC
              widgettype="revenue"
              label="Today NG"
              topColor="#ace73d"
              botColor="#ffbf6b"
              material_ppm={dailyppm[0]?.NG_RATE}
              process_ppm={dailyppm[0]?.NG_RATE}
              total_ppm={dailyppm[0]?.NG_RATE}
            />
          </div>
          <div className="revenuwdg">
            <WidgetPQC
              widgettype="revenue"
              label="This Week NG"
              topColor="#ace73d"
              botColor="#ffbf6b"
              material_ppm={weeklyppm[0]?.NG_RATE}
              process_ppm={weeklyppm[0]?.NG_RATE}
              total_ppm={weeklyppm[0]?.NG_RATE}
            />
          </div>
          <div className="revenuwdg">
            <WidgetPQC
              widgettype="revenue"
              label="This Month NG"
              topColor="#ace73d"
              botColor="#ffbf6b"
              material_ppm={monthlyppm[0]?.NG_RATE}
              process_ppm={monthlyppm[0]?.NG_RATE}
              total_ppm={monthlyppm[0]?.NG_RATE}
            />
          </div>
          <div className="revenuwdg">
            <WidgetPQC
              widgettype="revenue"
              label="This Year NG"
              topColor="#ace73d"
              botColor="#ffbf6b"
              material_ppm={yearlyppm[0]?.NG_RATE}
              process_ppm={yearlyppm[0]?.NG_RATE}
              total_ppm={yearlyppm[0]?.NG_RATE}
            />
          </div>
        </div>
        <br></br>
        <hr></hr>
        <div className="graph">
          <span className="section_title">2. PQC NG Trending</span>
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
                <PQCDailyNGRate
                  dldata={[...dailyppm].reverse()}
                  processColor="#53eb34"
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
                <PQCWeeklyNGRate
                  dldata={[...weeklyppm].reverse()}
                  processColor="#53eb34"
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
                <PQCMonthlyNGRate
                  dldata={[...monthlyppm].reverse()}
                  processColor="#53eb34"
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
                <PQCYearlyNGRate
                  dldata={[...yearlyppm].reverse()}
                  processColor="#53eb34"
                  materialColor="#ff0000"
                />
              </div>
            </div>
          </div>
          <span className="subsection_title">2.5 PQC Defects Trending <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(PQCDailyDefectTrending, "PQCDefectTrending");
          }}
        >
          <AiFillFileExcel color='green' size={15} />
          Excel
        </IconButton></span>
          <div className="defect_trending">
            <div className="dailygraph" style={{ height: '600px' }}>
              <PQCDailyDefectTrending dldata={[...dailyDefectTrendingData].reverse()} onClick={(e) => {
                console.log(e)
                traPQC32(e.activeLabel, e.activeLabel, searchCodeArray);
              }} />
            </div>
          </div>
          <div className="worstinspection">
            <div className="worsttable">
              {
                pqcdatatable.map((ele: PQC3_DATA, index: number) => {
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', color: 'black', fontWeight: 'bold' }}>
                      {`OCCURRED_TIME: ${ele.OCCURR_TIME}`}
                      <PATROL_COMPONENT2 key={index} data={{
                        CUST_NAME_KD: ele.CUST_NAME_KD,
                        DEFECT: ele.ERR_CODE + ':' + ele.DEFECT_PHENOMENON,
                        EQ: ele.LINE_NO,
                        FACTORY: ele.FACTORY,
                        G_NAME_KD: ele.G_NAME_KD,
                        INSPECT_QTY: ele.INSPECT_QTY,
                        INSPECT_NG: ele.DEFECT_QTY,
                        LINK: `/pqc/PQC3_${ele.PQC3_ID + 1}.png`,
                        TIME: ele.OCCURR_TIME,
                        EMPL_NO: ele.LINEQC_PIC,
                        DOI_SACH: ele.DOI_SACH,
                        NG_NHAN: ele.NG_NHAN,
                        STATUS: ele.STATUS
                      }} />
                    </div>
                  )
                })
              }
            </div>
          </div>
          <span className="section_title">3. PQC F-COST Status</span>
          <span className="subsection_title">PQC F-Cost Summary</span>
          <PQCFCOSTTABLE data={inspectSummary} />
          <span className="subsection_title">PQC F-Cost Trending</span>
          <div className="fcosttrending">
            <div className="fcostgraph">
              <div className="dailygraph">
                <span className="subsection">Daily F-Cost <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(dailyppm, "DailyFcostData");
          }}
        >
          <AiFillFileExcel color='green' size={15} />
          Excel
        </IconButton></span>
                <PQCDailyFcost
                  dldata={[...dailyppm].reverse()}
                  processColor="#8b89fc"
                  materialColor="#41d5fa"
                />
              </div>
            </div>
          </div>
          <div className="fcosttrending">
            <div className="fcostgraph">
              <div className="dailygraph">
                <span className="subsection">Weekly F-Cost <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(weeklyppm, "WeeklyFcostData");
          }}
        >
          <AiFillFileExcel color='green' size={15} />
          Excel
        </IconButton></span>
                <PQCWeeklyFcost
                  dldata={[...weeklyppm].reverse()}
                  processColor="#8b89fc"
                  materialColor="#41d5fa"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Monthly F-Cost <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(monthlyppm, "MonthlyFcostData");
          }}
        >
          <AiFillFileExcel color='green' size={15} />
          Excel
        </IconButton></span>
                <PQCMonthlyFcost
                  dldata={[...monthlyppm].reverse()}
                  processColor="#8b89fc"
                  materialColor="#41d5fa"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Yearly F-Cost <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(yearlyppm, "YearlyFcostData");
          }}
        >
          <AiFillFileExcel color='green' size={15} />
          Excel
        </IconButton></span>
                <PQCYearlyFcost
                  dldata={[...yearlyppm].reverse()}
                  processColor="#8b89fc"
                  materialColor="#41d5fa"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PQC_REPORT;
