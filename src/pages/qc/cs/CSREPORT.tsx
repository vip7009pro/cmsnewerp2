import moment from "moment";
import React, { startTransition, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, getGlobalSetting } from "../../../api/Api";
import InspectionDailyPPM from "../../../components/Chart/InspectionDailyPPM";
import InspectionMonthlyPPM from "../../../components/Chart/InspectionMonthlyPPM";
import InspectionWeeklyPPM from "../../../components/Chart/InspectionWeeklyPPM";
import InspectionYearlyPPM from "../../../components/Chart/InspectionYearlyPPM";
import CustomerPOBalanceByType from "../../../components/DataTable/CustomerPOBalanceByType";
import "./CSREPORT.scss";
import InspectionWorstTable from "../../../components/DataTable/InspectionWorstTable";
import ChartInspectionWorst from "../../../components/Chart/ChartInspectionWorst";
import { CS_CONFIRM_BY_CUSTOMER_DATA, CS_CONFIRM_TRENDING_DATA, CS_REDUCE_AMOUNT_DATA, CS_RMA_AMOUNT_DATA, CodeListData, DEFECT_TRENDING_DATA, DailyPPMData, FCSTAmountData, InspectSummary, MonthlyPPMData, PATROL_HEADER_DATA, WEB_SETTING_DATA, WeeklyPPMData, WidgetData_POBalanceSummary, WorstData, YearlyPPMData } from "../../../api/GlobalInterface";
import CIRCLE_COMPONENT from "../../qlsx/QLSXPLAN/CAPA/CIRCLE_COMPONENT/CIRCLE_COMPONENT";
import { deBounce, nFormatter } from "../../../api/GlobalFunction";
import { Autocomplete, Checkbox, FormControlLabel, FormGroup, TextField, Typography, createFilterOptions } from "@mui/material";
import InspectionDailyFcost from "../../../components/Chart/InspectDailyFcost";
import InspectionWeeklyFcost from "../../../components/Chart/InspectWeeklyFcost";
import InspectionMonthlyFcost from "../../../components/Chart/InspectMonthlyFcost";
import InspectionYearlyFcost from "../../../components/Chart/InspectYearlyFcost";
import PATROL_HEADER from "../../sx/PATROL/PATROL_HEADER";
import InspectDailyDefectTrending from "../../../components/Chart/InspectDailyDefectTrending";
import WidgetInspection from "../../../components/Widget/WidgetInspection";
import FCOSTTABLE from "../inspection/FCOSTTABLE";
import WidgetCS from "../../../components/Widget/WidgetCS";
import CSDailyConfirm from "../../../components/Chart/CSDailyConfirm";
import CSWeeklyConfirm from "../../../components/Chart/CSWeeklyConfirm";
import CSMonthlyConfirm from "../../../components/Chart/CSMonthlyConfirm";
import CSIssueChart from "../../../components/Chart/CSIssueChart";
import CSIssuePICChart from "../../../components/Chart/CSIssuePICChart";
import CSDDailySavingChart from "../../../components/Chart/CSDDailySavingChart";
import CSWeeklySavingChart from "../../../components/Chart/CSWeeklySavingChart";
import CSMonthlySavingChart from "../../../components/Chart/CSMonthlySavingChart";
import CSYearlySavingChart from "../../../components/Chart/CSYearlySavingChart";
const CSREPORT = () => {
  const [dailyppm1, setDailyPPM1] = useState<DailyPPMData[]>([]);
  const [weeklyppm1, setWeeklyPPM1] = useState<WeeklyPPMData[]>([]);
  const [monthlyppm1, setMonthlyPPM1] = useState<MonthlyPPMData[]>([]);
  const [yearlyppm1, setYearlyPPM1] = useState<YearlyPPMData[]>([]);
  const [dailyppm2, setDailyPPM2] = useState<DailyPPMData[]>([]);
  const [weeklyppm2, setWeeklyPPM2] = useState<WeeklyPPMData[]>([]);
  const [monthlyppm2, setMonthlyPPM2] = useState<MonthlyPPMData[]>([]);
  const [yearlyppm2, setYearlyPPM2] = useState<YearlyPPMData[]>([]);
  const [dailyppm, setDailyPPM] = useState<CS_CONFIRM_TRENDING_DATA[]>([]);
  const [weeklyppm, setWeeklyPPM] = useState<CS_CONFIRM_TRENDING_DATA[]>([]);
  const [monthlyppm, setMonthlyPPM] = useState<CS_CONFIRM_TRENDING_DATA[]>([]);
  const [yearlyppm, setYearlyPPM] = useState<CS_CONFIRM_TRENDING_DATA[]>([]);
  const [fromdate, setFromDate] = useState(moment().add(-14, "day").format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [worstby, setWorstBy] = useState('AMOUNT');
  const [ng_type, setNg_Type] = useState('ALL');
  const [worstdatatable, setWorstDataTable] = useState<Array<WorstData>>([]);
  const [inspectSummary, setInspectSummary] = useState<InspectSummary[]>([]);
  const [dailyFcostData, setDailyFcostData] = useState<InspectSummary[]>([]);
  const [weeklyFcostData, setWeeklyFcostData] = useState<InspectSummary[]>([]);
  const [monthlyFcostData, setMonthlyFcostData] = useState<InspectSummary[]>([]);
  const [annualyFcostData, setAnnualyFcostData] = useState<InspectSummary[]>([]);
  const [csConfirmDataByCustomer, setCsConfirmDataByCustomer] = useState<CS_CONFIRM_BY_CUSTOMER_DATA[]>([]);
  const [csConfirmDataByPIC, setCsConfirmDataByPIC] = useState<CS_CONFIRM_BY_CUSTOMER_DATA[]>([]);
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const [searchCodeArray, setSearchCodeArray] = useState<string[]>([]);
  const [patrolheaderdata, setPatrolHeaderData] = useState<PATROL_HEADER_DATA[]>([]);

  const [csDailyReduceAmount, setCSDailyReduceAmount] = useState<CS_REDUCE_AMOUNT_DATA[]>([]);
  const [csWeeklyReduceAmount, setCSWeeklyReduceAmount] = useState<CS_REDUCE_AMOUNT_DATA[]>([]);
  const [csMonthlyReduceAmount, setCSMonthlyReduceAmount] = useState<CS_REDUCE_AMOUNT_DATA[]>([]);
  const [csYearlyReduceAmount, setCSYearlyReduceAmount] = useState<CS_REDUCE_AMOUNT_DATA[]>([]);

  const [csDailyRMAAmount, setCSDailyRMAAmount] = useState<CS_RMA_AMOUNT_DATA[]>([]);
  const [csWeeklyRMAAmount, setCSWeeklyRMAAmount] = useState<CS_RMA_AMOUNT_DATA[]>([]);
  const [csMonthlyRMAAmount, setCSDMonthyRMAAmount] = useState<CS_RMA_AMOUNT_DATA[]>([]);
  const [csYearlyRMAAmount, setCSYearlyRMAAmount] = useState<CS_RMA_AMOUNT_DATA[]>([]);

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
  const handle_getCSDailyConfirmData = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-14, "day").format("YYYY-MM-DD");
    await generalQuery("csdailyconfirmdata", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: CS_CONFIRM_TRENDING_DATA, index: number) => {
              return {
                ...element,
                CONFIRM_DATE: moment
                  .utc(element.CONFIRM_DATE)
                  .format("YYYY-MM-DD"),
                TOTAL: element.C + element.K,
                id: index,
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
  }
  const handle_getCSWeeklyConfirmData = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-70, "day").format("YYYY-MM-DD");
    await generalQuery("csweeklyconfirmdata", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: CS_CONFIRM_TRENDING_DATA, index: number) => {
              return {
                ...element,
                TOTAL: element.C + element.K,
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setWeeklyPPM(loadeddata);
        } else {
          setWeeklyPPM([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_getCSMonthlyConfirmData = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-365, "day").format("YYYY-MM-DD");
    await generalQuery("csmonthlyconfirmdata", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: CS_CONFIRM_TRENDING_DATA, index: number) => {
              return {
                ...element,
                TOTAL: element.C + element.K,
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setMonthlyPPM(loadeddata);
        } else {
          setMonthlyPPM([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_getCSYearlyConfirmData = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-3650, "day").format("YYYY-MM-DD");
    await generalQuery("csyearlyconfirmdata", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: CS_CONFIRM_TRENDING_DATA, index: number) => {
              return {
                ...element,
                TOTAL: element.C + element.K,
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setYearlyPPM(loadeddata);
        } else {
          setYearlyPPM([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_getCSConfirmDataByCustomer = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-14, "day").format("YYYY-MM-DD");
    await generalQuery("csConfirmDataByCustomer", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: CS_CONFIRM_BY_CUSTOMER_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setCsConfirmDataByCustomer(loadeddata);
        } else {
          setCsConfirmDataByCustomer([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_getCSConfirmDataByPIC = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-14, "day").format("YYYY-MM-DD");
    await generalQuery("csConfirmDataByPIC", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: CS_CONFIRM_BY_CUSTOMER_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setCsConfirmDataByPIC(loadeddata);
        } else {
          setCsConfirmDataByPIC([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_getCSDailyReduceAmount  = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-14, "day").format("YYYY-MM-DD");
    await generalQuery("csdailyreduceamount", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: CS_REDUCE_AMOUNT_DATA, index: number) => {
              return {
                ...element,
                CONFIRM_DATE: moment(element.CONFIRM_DATE).format("YYYY-MM-DD"),
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setCSDailyReduceAmount(loadeddata);
        } else {
          setCSDailyReduceAmount([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_getCSWeeklyReduceAmount  = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-70, "day").format("YYYY-MM-DD");
    await generalQuery("csweeklyreduceamount", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: CS_REDUCE_AMOUNT_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setCSWeeklyReduceAmount(loadeddata);
        } else {
          setCSWeeklyReduceAmount([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_getCSMonthlyReduceAmount  = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-365, "day").format("YYYY-MM-DD");
    await generalQuery("csmonthlyreduceamount", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: CS_REDUCE_AMOUNT_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setCSMonthlyReduceAmount(loadeddata);
        } else {
          setCSMonthlyReduceAmount([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_getCSYearlyReduceAmount  = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-3650, "day").format("YYYY-MM-DD");
    await generalQuery("csyearlyreduceamount", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: CS_REDUCE_AMOUNT_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setCSYearlyReduceAmount(loadeddata);
        } else {
          setCSYearlyReduceAmount([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handle_getCSDailyRMAAmount  = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-14, "day").format("YYYY-MM-DD");
    await generalQuery("csdailyRMAAmount", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: CS_RMA_AMOUNT_DATA, index: number) => {
              return {
                ...element,
                RT_DATE: moment(element.RT_DATE).format("YYYY-MM-DD"),
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setCSDailyRMAAmount(loadeddata);
        } else {
          setCSDailyRMAAmount([]);
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
      handle_getCSDailyConfirmData(fromdate, todate, searchCodeArray),
      handle_getCSWeeklyConfirmData(fromdate, todate, searchCodeArray),
      handle_getCSMonthlyConfirmData(fromdate, todate, searchCodeArray),
      handle_getCSYearlyConfirmData(fromdate, todate, searchCodeArray),
      handle_getCSConfirmDataByCustomer(fromdate, todate, searchCodeArray),
      handle_getCSConfirmDataByPIC(fromdate, todate, searchCodeArray),
      handle_getCSDailyReduceAmount(fromdate, todate, searchCodeArray),
      handle_getCSWeeklyReduceAmount(fromdate, todate, searchCodeArray),
      handle_getCSMonthlyReduceAmount(fromdate, todate, searchCodeArray),
      handle_getCSYearlyReduceAmount(fromdate, todate, searchCodeArray),
    ]).then((values) => {
      Swal.fire("Thông báo", "Đã load xong báo cáo", 'success');
    });
  }
  useEffect(() => {
    getcodelist("");
    initFunction();
  }, []);
  return (
    <div className="csreport">
      <div className="title">
        <span>CS REPORT</span>
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
        <span className="section_title">1. CS Issue OverView</span>
        <div className="revenuewidget">
          <div className="revenuwdg">
            <WidgetCS
              widgettype="revenue"
              label="Today issue"
              topColor="#b3c6ff"
              botColor="#b3ecff"
              material_ppm={dailyppm[0]?.C}
              process_ppm={dailyppm[0]?.K}
              total_ppm={dailyppm[0]?.C + dailyppm[0]?.K}
            />
          </div>
          <div className="revenuwdg">
            <WidgetCS
              widgettype="revenue"
              label="This Week issue"
              topColor="#b3c6ff"
              botColor="#b3ecff"
              material_ppm={weeklyppm[0]?.C}
              process_ppm={weeklyppm[0]?.K}
              total_ppm={weeklyppm[0]?.C + weeklyppm[0]?.K}
            />
          </div>
          <div className="revenuwdg">
            <WidgetCS
              widgettype="revenue"
              label="This month issue"
              topColor="#b3c6ff"
              botColor="#b3ecff"
              material_ppm={monthlyppm[0]?.C}
              process_ppm={monthlyppm[0]?.K}
              total_ppm={monthlyppm[0]?.C + monthlyppm[0]?.K}
            />
          </div>
          <div className="revenuwdg">
            <WidgetCS
              widgettype="revenue"
              label="This year issue"
              topColor="#b3c6ff"
              botColor="#b3ecff"
              material_ppm={yearlyppm[0]?.C}
              process_ppm={yearlyppm[0]?.K}
              total_ppm={yearlyppm[0]?.C + yearlyppm[0]?.K}
            />
          </div>
        </div>
        <br></br>
        <hr></hr>
        <div className="graph">
          <span className="section_title">2. Customer Issue Feedback Trending</span>
          <div className="dailygraphtotal">
            <div className="dailygraphtotal">
              <div className="dailygraph">
                <span className="subsection">Daily Issue</span>
                <CSDailyConfirm
                  dldata={[...dailyppm].reverse()}
                  processColor="#eeeb30"
                  materialColor="#53eb34"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Weekly Issue</span>
                <CSWeeklyConfirm
                  dldata={[...weeklyppm].reverse()}
                  processColor="#eeeb30"
                  materialColor="#53eb34"
                />
              </div>
            </div>
            <div className="monthlyweeklygraph">
              <div className="dailygraph">
                <span className="subsection">Monthly Issue</span>
                <CSMonthlyConfirm
                  dldata={[...monthlyppm].reverse()}
                  processColor="#eeeb30"
                  materialColor="#53eb34"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Yearly Issue</span>
                <CSDailyConfirm
                  dldata={[...yearlyppm].reverse()}
                  processColor="#eeeb30"
                  materialColor="#53eb34"
                />
              </div>
            </div>
          </div>
          <span className="subsection_title">2.5 Issue by Customer and PICs</span>
          <div className="dailygraphtotal">
            <div className="dailygraph" style={{ height: '600px' }}>
              <CSIssueChart data={csConfirmDataByCustomer} />
            </div>
            <div className="dailygraph" style={{ height: '600px' }}>
              <CSIssuePICChart data={csConfirmDataByPIC} />
            </div>
          </div>
          <span className="section_title">3. Cost Saving</span>        
          <span className="subsection_title">Cost Saving Trending</span>         
          <div className="fcosttrending">
            <div className="fcostgraph">
            <div className="dailygraph">
                <span className="subsection">Daily Saving</span>
                <CSDDailySavingChart
                  dldata={[...csDailyReduceAmount].reverse()}
                  processColor="#00da5b"
                  materialColor="#41d5fa"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Weekly Saving</span>
                <CSWeeklySavingChart
                  dldata={[...csWeeklyReduceAmount].reverse()}
                  processColor="#00da5b"
                  materialColor="#41d5fa"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Monthly Saving</span>
                <CSMonthlySavingChart
                  dldata={[...csMonthlyReduceAmount].reverse()}
                  processColor="#00da5b"
                  materialColor="#41d5fa"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Yearly Saving</span>
                <CSYearlySavingChart
                  dldata={[...csYearlyReduceAmount].reverse()}
                  processColor="#00da5b"
                  materialColor="#41d5fa"
                />
              </div>
            </div>
          </div>
          <span className="section_title">4. F-COST Status</span>
          <span className="subsection_title">F-Cost Summary</span>
          <FCOSTTABLE data={inspectSummary} />
          <span className="subsection_title">RMA Amount Trending</span>
          <div className="fcosttrending">
            <div className="fcostgraph">
            <div className="dailygraph">
                <span className="subsection">Daily F-Cost</span>
                <InspectionDailyFcost
                  dldata={[...dailyFcostData].reverse()}
                  processColor="#89fc98"
                  materialColor="#41d5fa"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Weekly F-Cost</span>
                <InspectionWeeklyFcost
                  dldata={[...weeklyFcostData].reverse()}
                  processColor="#89fc98"
                  materialColor="#41d5fa"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Monthly F-Cost</span>
                <InspectionMonthlyFcost
                  dldata={[...monthlyFcostData].reverse()}
                  processColor="#89fc98"
                  materialColor="#41d5fa"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Yearly F-Cost</span>
                <InspectionYearlyFcost
                  dldata={[...annualyFcostData].reverse()}
                  processColor="#89fc98"
                  materialColor="#41d5fa"
                />
              </div>
            </div>
          </div>
          <span className="subsection_title">Top 3 F-Cost Products ({fromdate} ~ {todate})</span>
          <div className="patrolheader1">
            <PATROL_HEADER data={patrolheaderdata} />
          </div>
          <span className="subsection_title">F-Cost by Defect</span>
          <div className="worstinspection">
            <div className="worsttable">
              <span className="subsection">Worst Table</span>
              {worstdatatable.length > 0 && <InspectionWorstTable dailyClosingData={worstdatatable} worstby={worstby} from_date={fromdate} to_date={todate} ng_type={ng_type} listCode={searchCodeArray} />}
            </div>
            <div className="worstgraph">
              <span className="subsection">WORST 5 BY {worstby}</span>
              {worstdatatable.length > 0 && <ChartInspectionWorst dailyClosingData={worstdatatable} worstby={worstby} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CSREPORT;
