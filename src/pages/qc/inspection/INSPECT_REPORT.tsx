import moment from "moment";
import React, { startTransition, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, getGlobalSetting } from "../../../api/Api";
import InspectionDailyPPM from "../../../components/Chart/InspectionDailyPPM";
import InspectionMonthlyPPM from "../../../components/Chart/InspectionMonthlyPPM";
import InspectionWeeklyPPM from "../../../components/Chart/InspectionWeeklyPPM";
import InspectionYearlyPPM from "../../../components/Chart/InspectionYearlyPPM";
import CustomerPOBalanceByType from "../../../components/DataTable/CustomerPOBalanceByType";
import "./INSPECT_REPORT.scss";
import InspectionWorstTable from "../../../components/DataTable/InspectionWorstTable";
import ChartInspectionWorst from "../../../components/Chart/ChartInspectionWorst";
import { CodeListData, DEFECT_TRENDING_DATA, DailyPPMData, FCSTAmountData, InspectSummary, MonthlyPPMData, PATROL_HEADER_DATA, WEB_SETTING_DATA, WeeklyPPMData, WidgetData_POBalanceSummary, WorstData, YearlyPPMData } from "../../../api/GlobalInterface";
import CIRCLE_COMPONENT from "../../qlsx/QLSXPLAN/CAPA/CIRCLE_COMPONENT/CIRCLE_COMPONENT";
import { SaveExcel, deBounce, nFormatter } from "../../../api/GlobalFunction";
import { Autocomplete, Checkbox, FormControlLabel, FormGroup, TextField, Typography, createFilterOptions, IconButton } from "@mui/material";
import FCOSTTABLE from "./FCOSTTABLE";
import InspectionDailyFcost from "../../../components/Chart/InspectDailyFcost";
import InspectionWeeklyFcost from "../../../components/Chart/InspectWeeklyFcost";
import InspectionMonthlyFcost from "../../../components/Chart/InspectMonthlyFcost";
import InspectionYearlyFcost from "../../../components/Chart/InspectYearlyFcost";
import PATROL_HEADER from "../../sx/PATROL/PATROL_HEADER";
import InspectDailyDefectTrending from "../../../components/Chart/InspectDailyDefectTrending";
import WidgetInspection from "../../../components/Widget/WidgetInspection";
import { AiFillFileExcel } from "react-icons/ai";
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
  const [fromdate, setFromDate] = useState(moment().add(-14, "day").format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [worstby, setWorstBy] = useState('AMOUNT');
  const [ng_type, setNg_Type] = useState('ALL');
  const [worstdatatable, setWorstDataTable] = useState<Array<WorstData>>([]);
  const [inspectSummary, setInspectSummary] = useState<InspectSummary[]>([]);
  const [dailyDefectTrendingData, setDailyDefectTrendingData] = useState<DEFECT_TRENDING_DATA[]>([]);
  const [dailyFcostData, setDailyFcostData] = useState<InspectSummary[]>([]);
  const [cust_name, setCust_Name] = useState('');
  const [weeklyFcostData, setWeeklyFcostData] = useState<InspectSummary[]>([]);
  const [monthlyFcostData, setMonthlyFcostData] = useState<InspectSummary[]>([]);
  const [annualyFcostData, setAnnualyFcostData] = useState<InspectSummary[]>([]);
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const [searchCodeArray, setSearchCodeArray] = useState<string[]>([]);
  const [patrolheaderdata, setPatrolHeaderData] = useState<PATROL_HEADER_DATA[]>([]);
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
  const getPatrolHeaderData = async (from_date: string, to_date: string) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-12, "day").format("YYYY-MM-DD");
    await generalQuery("getpatrolheader", {
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: PATROL_HEADER_DATA[] = response.data.data.map(
            (element: PATROL_HEADER_DATA, index: number) => {
              return {
                ...element,
              };
            }
          );
          //console.log(loadeddata);          
          setPatrolHeaderData(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
          setPatrolHeaderData([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleGetInspectionWorst = async (from_date: string, to_date: string, worst_by: string, ng_type: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-7, "day").format("YYYY-MM-DD");
    generalQuery("getInspectionWorstTable", {
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      WORSTBY: worst_by,
      NG_TYPE: ng_type,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
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
          setWorstDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getDailyPPM = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-12, "day").format("YYYY-MM-DD");
    await generalQuery("inspect_daily_ppm", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
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
    await generalQuery("inspect_weekly_ppm", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
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
    await generalQuery("inspect_monthly_ppm", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
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
    await generalQuery("inspect_yearly_ppm", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
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
    await generalQuery("getInspectionSummary", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: InspectSummary[] = response.data.data.map(
            (element: InspectSummary, index: number) => {
              return {
                ...element,
                T_NG_AMOUNT: element.P_NG_AMOUNT + element.M_NG_AMOUNT,
                T_NG_QTY: element.P_NG_QTY + element.M_NG_QTY,
                M_RATE: element.ISP_TT_QTY !== 0 ? Number(element.M_NG_QTY) / Number(element.ISP_TT_QTY) : 0,
                P_RATE: element.ISP_TT_QTY !== 0 ? Number(element.P_NG_QTY) / Number(element.ISP_TT_QTY) : 0,
                T_RATE: element.ISP_TT_QTY !== 0 ? (Number(element.M_NG_QTY) + Number(element.P_NG_QTY)) / Number(element.ISP_TT_QTY) : 0,
                M_A_RATE: element.ISP_TT_QTY !== 0 ? Number(element.M_NG_AMOUNT) / Number(element.ISP_TT_AMOUNT) : 0,
                P_A_RATE: element.ISP_TT_QTY !== 0 ? Number(element.P_NG_AMOUNT) / Number(element.ISP_TT_AMOUNT) : 0,
                T_A_RATE: element.ISP_TT_QTY !== 0 ? Number(element.P_NG_AMOUNT + element.M_NG_AMOUNT) / Number(element.ISP_TT_AMOUNT) : 0,
              };
            },
          );
          //console.log(loadeddata);
          setInspectSummary(loadeddata);
        } else {
          setInspectSummary([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_getDailyFcost = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-14, "day").format("YYYY-MM-DD");
    await generalQuery("dailyFcost", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: InspectSummary[] = response.data.data.map(
            (element: InspectSummary, index: number) => {
              return {
                ...element,
                INSPECT_DATE: moment(element.INSPECT_DATE).format("YYYY-MM-DD"),
                T_NG_AMOUNT: element.P_NG_AMOUNT + element.M_NG_AMOUNT,
                T_NG_QTY: element.P_NG_QTY + element.M_NG_QTY,
                M_RATE: element.ISP_TT_QTY !== 0 ? Number(element.M_NG_QTY) / Number(element.ISP_TT_QTY) : 0,
                P_RATE: element.ISP_TT_QTY !== 0 ? Number(element.P_NG_QTY) / Number(element.ISP_TT_QTY) : 0,
                T_RATE: element.ISP_TT_QTY !== 0 ? (Number(element.M_NG_QTY) + Number(element.P_NG_QTY)) / Number(element.ISP_TT_QTY) : 0,
                M_A_RATE: element.ISP_TT_QTY !== 0 ? Number(element.M_NG_AMOUNT) / Number(element.ISP_TT_AMOUNT) : 0,
                P_A_RATE: element.ISP_TT_QTY !== 0 ? Number(element.P_NG_AMOUNT) / Number(element.ISP_TT_AMOUNT) : 0,
                T_A_RATE: element.ISP_TT_QTY !== 0 ? Number(element.P_NG_AMOUNT + element.M_NG_AMOUNT) / Number(element.ISP_TT_AMOUNT) : 0,
              };
            },
          );
          //console.log(loadeddata);
          setDailyFcostData(loadeddata);
        } else {
          setDailyFcostData([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_getWeeklyFcost = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-70, "day").format("YYYY-MM-DD");
    await generalQuery("weeklyFcost", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: InspectSummary[] = response.data.data.map(
            (element: InspectSummary, index: number) => {
              return {
                ...element,
                T_NG_AMOUNT: element.P_NG_AMOUNT + element.M_NG_AMOUNT,
                T_NG_QTY: element.P_NG_QTY + element.M_NG_QTY,
                M_RATE: element.ISP_TT_QTY !== 0 ? Number(element.M_NG_QTY) / Number(element.ISP_TT_QTY) : 0,
                P_RATE: element.ISP_TT_QTY !== 0 ? Number(element.P_NG_QTY) / Number(element.ISP_TT_QTY) : 0,
                T_RATE: element.ISP_TT_QTY !== 0 ? (Number(element.M_NG_QTY) + Number(element.P_NG_QTY)) / Number(element.ISP_TT_QTY) : 0,
                M_A_RATE: element.ISP_TT_QTY !== 0 ? Number(element.M_NG_AMOUNT) / Number(element.ISP_TT_AMOUNT) : 0,
                P_A_RATE: element.ISP_TT_QTY !== 0 ? Number(element.P_NG_AMOUNT) / Number(element.ISP_TT_AMOUNT) : 0,
                T_A_RATE: element.ISP_TT_QTY !== 0 ? Number(element.P_NG_AMOUNT + element.M_NG_AMOUNT) / Number(element.ISP_TT_AMOUNT) : 0,
              };
            },
          );
          //console.log(loadeddata);
          setWeeklyFcostData(loadeddata);
        } else {
          setWeeklyFcostData([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_getMonthlyFcost = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-365, "day").format("YYYY-MM-DD");
    await generalQuery("monthlyFcost", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: InspectSummary[] = response.data.data.map(
            (element: InspectSummary, index: number) => {
              return {
                ...element,
                T_NG_AMOUNT: element.P_NG_AMOUNT + element.M_NG_AMOUNT,
                T_NG_QTY: element.P_NG_QTY + element.M_NG_QTY,
                M_RATE: element.ISP_TT_QTY !== 0 ? Number(element.M_NG_QTY) / Number(element.ISP_TT_QTY) : 0,
                P_RATE: element.ISP_TT_QTY !== 0 ? Number(element.P_NG_QTY) / Number(element.ISP_TT_QTY) : 0,
                T_RATE: element.ISP_TT_QTY !== 0 ? (Number(element.M_NG_QTY) + Number(element.P_NG_QTY)) / Number(element.ISP_TT_QTY) : 0,
                M_A_RATE: element.ISP_TT_QTY !== 0 ? Number(element.M_NG_AMOUNT) / Number(element.ISP_TT_AMOUNT) : 0,
                P_A_RATE: element.ISP_TT_QTY !== 0 ? Number(element.P_NG_AMOUNT) / Number(element.ISP_TT_AMOUNT) : 0,
                T_A_RATE: element.ISP_TT_QTY !== 0 ? Number(element.P_NG_AMOUNT + element.M_NG_AMOUNT) / Number(element.ISP_TT_AMOUNT) : 0,
              };
            },
          );
          //console.log(loadeddata);
          setMonthlyFcostData(loadeddata);
        } else {
          setMonthlyFcostData([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_getAnnuallyFcost = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-3650, "day").format("YYYY-MM-DD");
    await generalQuery("annuallyFcost", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: InspectSummary[] = response.data.data.map(
            (element: InspectSummary, index: number) => {
              return {
                ...element,
                T_NG_AMOUNT: element.P_NG_AMOUNT + element.M_NG_AMOUNT,
                T_NG_QTY: element.P_NG_QTY + element.M_NG_QTY,
                M_RATE: element.ISP_TT_QTY !== 0 ? Number(element.M_NG_QTY) / Number(element.ISP_TT_QTY) : 0,
                P_RATE: element.ISP_TT_QTY !== 0 ? Number(element.P_NG_QTY) / Number(element.ISP_TT_QTY) : 0,
                T_RATE: element.ISP_TT_QTY !== 0 ? (Number(element.M_NG_QTY) + Number(element.P_NG_QTY)) / Number(element.ISP_TT_QTY) : 0,
                M_A_RATE: element.ISP_TT_QTY !== 0 ? Number(element.M_NG_AMOUNT) / Number(element.ISP_TT_AMOUNT) : 0,
                P_A_RATE: element.ISP_TT_QTY !== 0 ? Number(element.P_NG_AMOUNT) / Number(element.ISP_TT_AMOUNT) : 0,
                T_A_RATE: element.ISP_TT_QTY !== 0 ? Number(element.P_NG_AMOUNT + element.M_NG_AMOUNT) / Number(element.ISP_TT_AMOUNT) : 0,
              };
            },
          );
          //console.log(loadeddata);
          setAnnualyFcostData(loadeddata);
        } else {
          setAnnualyFcostData([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_getDailyDefectTrending = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-14, "day").format("YYYY-MM-DD");
    await generalQuery("dailyDefectTrending", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
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
      handleGetInspectionWorst(fromdate, todate, worstby, ng_type, searchCodeArray),
      handle_getInspectSummary(fromdate, todate, searchCodeArray),
      handle_getDailyFcost(fromdate, todate, searchCodeArray),
      handle_getWeeklyFcost(fromdate, todate, searchCodeArray),
      handle_getMonthlyFcost(fromdate, todate, searchCodeArray),
      handle_getAnnuallyFcost(fromdate, todate, searchCodeArray),
      handle_getDailyDefectTrending(fromdate, todate, searchCodeArray),
      getPatrolHeaderData(fromdate, todate),
    ]).then((values) => {
      Swal.fire("Thông báo", "Đã load xong báo cáo", 'success');
    });
  }
  useEffect(() => {
    getcodelist("");
    initFunction();
  }, []);
  return (
    <div className="inspectionreport">
      <div className="title">
        <span>INSPECTION REPORT</span>
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
        <br></br>
        <hr></hr>
        <div className="graph">
          <span className="section_title">2. NG Trending</span>
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
        </IconButton></span>
                <InspectionDailyPPM
                  dldata={[...dailyppm].reverse()}
                  processColor="#eeeb30"
                  materialColor="#53eb34"
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
                <InspectionWeeklyPPM
                  dldata={[...weeklyppm].reverse()}
                  processColor="#eeeb30"
                  materialColor="#53eb34"
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
                <InspectionMonthlyPPM
                  dldata={[...monthlyppm].reverse()}
                  processColor="#eeeb30"
                  materialColor="#53eb34"
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
                <InspectionYearlyPPM
                  dldata={yearlyppm}
                  processColor="#eeeb30"
                  materialColor="#53eb34"
                />
              </div>
            </div>
          </div>
          <span className="subsection_title">2.5 Defects Trending</span>
          <div className="dailygraphtotal">
            <div className="dailygraph" style={{ height: '600px' }}>
              <InspectDailyDefectTrending dldata={[...dailyDefectTrendingData].reverse()} />
            </div>
          </div>
          <span className="section_title">3. F-COST Status</span>
          <span className="subsection_title">F-Cost Summary</span>
          <FCOSTTABLE data={inspectSummary} />
          <span className="subsection_title">F-Cost Trending</span>
          <div className="fcosttrending">
            <div className="fcostgraph">
              <div className="dailygraph">
                <span className="subsection">Daily F-Cost <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(dailyFcostData, "DailyFcostData");
          }}
        >
          <AiFillFileExcel color='green' size={15} />
          Excel
        </IconButton></span>
                <InspectionDailyFcost
                  dldata={[...dailyFcostData].reverse()}
                  processColor="#89fc98"
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
            SaveExcel(weeklyFcostData, "WeeklyFcostData");
          }}
        >
          <AiFillFileExcel color='green' size={15} />
          Excel
        </IconButton></span>
                <InspectionWeeklyFcost
                  dldata={[...weeklyFcostData].reverse()}
                  processColor="#89fc98"
                  materialColor="#41d5fa"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Monthly F-Cost <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(monthlyFcostData, "MonthFcostData");
          }}
        >
          <AiFillFileExcel color='green' size={15} />
          Excel
        </IconButton></span>
                <InspectionMonthlyFcost
                  dldata={[...monthlyFcostData].reverse()}
                  processColor="#89fc98"
                  materialColor="#41d5fa"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Yearly F-Cost <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(annualyFcostData, "YearlyFcostData");
          }}
        >
          <AiFillFileExcel color='green' size={15} />
          Excel
        </IconButton></span>
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
              {worstdatatable.length > 0 && <InspectionWorstTable dailyClosingData={worstdatatable} worstby={worstby} from_date={fromdate} to_date={todate} ng_type={ng_type} listCode={searchCodeArray} cust_name={cust_name} />}
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
export default INSPECT_REPORT;
