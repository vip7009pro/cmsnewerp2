import moment from "moment";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import "./SX_REPORT.scss";
import {
  MACHINE_LIST,
  PLAN_LOSS_DATA,
  PQC3_DATA,
  PRODUCTION_EFFICIENCY_DATA,
  RND_NEWCODE_BY_CUSTOMER,
  RND_NEWCODE_BY_PRODTYPE,
  SX_ACHIVE_DATA,
  SX_LOSSTIME_BY_EMPL,
  SX_LOSSTIME_REASON_DATA,
  SX_TREND_LOSS_DATA,
} from "../../../api/GlobalInterface";
import { Checkbox, IconButton } from "@mui/material";
import { f_getMachineListData, nFormatter, SaveExcel } from "../../../api/GlobalFunction";
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

const SX_REPORT = () => {
  const [planLossData, setPlanLossData] = useState<PLAN_LOSS_DATA[]>([]);
  const [machineList, setMachineList] = useState<MACHINE_LIST[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<string>("ALL");

  const [dailysxloss, setDailySXLoss] = useState<SX_TREND_LOSS_DATA[]>([]);
  const [weeklysxloss, setWeeklySXLoss] = useState<SX_TREND_LOSS_DATA[]>([]);
  const [monthlysxloss, setMonthlySXLoss] = useState<SX_TREND_LOSS_DATA[]>([]);
  const [yearlysxloss, setYearlySXLoss] = useState<SX_TREND_LOSS_DATA[]>([]);  

  const [dailysxachive, setDailySXAchive] = useState<SX_ACHIVE_DATA[]>([]);
  const [weeklysxachive, setWeeklySXAchive] = useState<SX_ACHIVE_DATA[]>([]);
  const [monthlysxachive, setMonthlySXAchive] = useState<SX_ACHIVE_DATA[]>([]);
  const [yearlysxachive, setYearlySXAchive] = useState<SX_ACHIVE_DATA[]>([]);
  
  const [dailysxaeff, setDailySXEff] = useState<PRODUCTION_EFFICIENCY_DATA[]>([]);
  const [weeklysxaeff, setWeeklySXEff] = useState<PRODUCTION_EFFICIENCY_DATA[]>([]);
  const [monthlysxaeff, setMonthlySXEff] = useState<PRODUCTION_EFFICIENCY_DATA[]>([]);
  const [yearlysxaeff, setYearlySXEff] = useState<PRODUCTION_EFFICIENCY_DATA[]>([]);
  const [selectedSXAffOverView, setSelectedSXAffOverView] = useState<PRODUCTION_EFFICIENCY_DATA>({
    ALVB_TIME: 0,
    HIEU_SUAT_TIME:0,
    LOSS_TIME:0,
    LOSS_TIME_RATE:0,
    OPERATION_RATE:0,
    PURE_RUN_RATE:0,
    PURE_RUN_TIME:0,
    RUN_TIME_SX:0,
    SETTING_TIME:0,
    SETTING_TIME_RATE:0,
    TOTAL_TIME:0,
  })

  const [sxLossTimeByReason, setSXLossTimeByReason] = useState<SX_LOSSTIME_REASON_DATA[]>([]);
  const [sxLossTimeByEmpl, setSXLossTimeByEmpl] = useState<SX_LOSSTIME_BY_EMPL[]>([]);

  const [fromdate, setFromDate] = useState(moment().add(-14, "day").format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [cust_name, setCust_Name] = useState('');
  const [searchCodeArray, setSearchCodeArray] = useState<string[]>([]);
  const [df, setDF] = useState(true);
  const [newcodebycustomer, setNewCodeByCustomer] = useState<RND_NEWCODE_BY_CUSTOMER[]>([]);
  const [newcodebyprodtype, setNewCodeByProdType] = useState<RND_NEWCODE_BY_PRODTYPE[]>([]);
  
  const handle_getMachineList = async (FACTORY: string) => {
    setMachineList(await f_getMachineListData());    
  } 
  const handle_getPlanLossData = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-365, "day").format("YYYY-MM-DD");
    await generalQuery("traDataPlanLossSX", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name, 
    })
      .then((response) => {
        //
        if (response.data.tk_status !== "NG") {
          const loadeddata: PLAN_LOSS_DATA[] = response.data.data.map(
            (element: PLAN_LOSS_DATA, index: number) => {
              return {
                ...element,
                id: index
              };
            },
          );
          setPlanLossData(loadeddata)
        } else {
          setPlanLossData([])
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
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
                LOSS_RATE: 1 - element.PURE_OUTPUT * 1.0 / element.PURE_INPUT,
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
        if (response.data.tk_status !== "NG") {
          const loadeddata: SX_TREND_LOSS_DATA[] = response.data.data.map(
            (element: SX_TREND_LOSS_DATA, index: number) => {
              return {
                ...element,
                LOSS_RATE: 1 - element.PURE_OUTPUT * 1.0 / element.PURE_INPUT,
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
                LOSS_RATE: 1 - element.PURE_OUTPUT * 1.0 / element.PURE_INPUT,
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
                LOSS_RATE: 1 - element.PURE_OUTPUT * 1.0 / element.PURE_INPUT,
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

  const handle_getDailyEffData = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-12, "day").format("YYYY-MM-DD");
    await generalQuery("dailyEQEffTrending", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: PRODUCTION_EFFICIENCY_DATA[] = response.data.data.map(
            (element: PRODUCTION_EFFICIENCY_DATA, index: number) => {
              return {
                ...element,
                PURE_RUN_RATE: element.PURE_RUN_TIME * 1.0 / element.TOTAL_TIME,
                OPERATION_RATE: element.TOTAL_TIME*1.0/element.ALVB_TIME,
                SX_DATE: moment.utc(element.SX_DATE).format("YYYY-MM-DD"),
              };
            },
          );  
          let temp_aff: PRODUCTION_EFFICIENCY_DATA =  {
            ALVB_TIME: 0,
            HIEU_SUAT_TIME:0,
            LOSS_TIME:0,
            LOSS_TIME_RATE:0,
            OPERATION_RATE:0,
            PURE_RUN_RATE:0,
            PURE_RUN_TIME:0,
            RUN_TIME_SX:0,
            SETTING_TIME:0,
            SETTING_TIME_RATE:0,
            TOTAL_TIME:0,
          }
          for(let i=0;i<loadeddata.length;i++) 
          {
            temp_aff.ALVB_TIME += loadeddata[i].ALVB_TIME;
            temp_aff.LOSS_TIME += loadeddata[i].LOSS_TIME;
            temp_aff.PURE_RUN_TIME += loadeddata[i].PURE_RUN_TIME;
            temp_aff.RUN_TIME_SX += loadeddata[i].RUN_TIME_SX;
            temp_aff.SETTING_TIME += loadeddata[i].SETTING_TIME;
            temp_aff.TOTAL_TIME += loadeddata[i].TOTAL_TIME;
          }
          temp_aff.OPERATION_RATE = temp_aff.TOTAL_TIME/temp_aff.ALVB_TIME; // ti le van hanh
          temp_aff.HIEU_SUAT_TIME = temp_aff.RUN_TIME_SX/temp_aff.TOTAL_TIME; // hieu suat may
          temp_aff.SETTING_TIME_RATE = temp_aff.PURE_RUN_TIME/temp_aff.TOTAL_TIME; //hieu suat san xuat
          setSelectedSXAffOverView(temp_aff)
          setDailySXEff(loadeddata);
        } else {
          setDailySXEff([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getWeeklyEffData = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-35, "day").format("YYYY-MM-DD");
    await generalQuery("weeklyEQEffTrending", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: PRODUCTION_EFFICIENCY_DATA[] = response.data.data.map(
            (element: PRODUCTION_EFFICIENCY_DATA, index: number) => {
              return {
                ...element,
                PURE_RUN_RATE: element.PURE_RUN_TIME * 1.0 / element.TOTAL_TIME,              
                OPERATION_RATE: element.TOTAL_TIME*1.0/element.ALVB_TIME,  
              };
            },
          );
          setWeeklySXEff(loadeddata);
        } else {
          setWeeklySXEff([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getMonthlyEffData = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-365, "day").format("YYYY-MM-DD");
    await generalQuery("monthlyEQEffTrending", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: PRODUCTION_EFFICIENCY_DATA[] = response.data.data.map(
            (element: PRODUCTION_EFFICIENCY_DATA, index: number) => {
              return {
                ...element,
                PURE_RUN_RATE: element.PURE_RUN_TIME * 1.0 / element.TOTAL_TIME,     
                OPERATION_RATE: element.TOTAL_TIME*1.0/element.ALVB_TIME,           
              };
            },
          );
          setMonthlySXEff(loadeddata);
        } else {
          setMonthlySXEff([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getYearlyEffData = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-3650, "day").format("YYYY-MM-DD");
    await generalQuery("yearlyEQEffTrending", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: PRODUCTION_EFFICIENCY_DATA[] = response.data.data.map(
            (element: PRODUCTION_EFFICIENCY_DATA, index: number) => {
              return {
                ...element,
                PURE_RUN_RATE: element.PURE_RUN_TIME * 1.0 / element.TOTAL_TIME,  
                OPERATION_RATE: element.TOTAL_TIME*1.0/element.ALVB_TIME,              
              };
            },
          );          
          setYearlySXEff(loadeddata);
        } else {
          setYearlySXEff([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
                ACHIVE_RATE: element.SX_RESULT * 1.0 / element.PLAN_QTY,
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
                ACHIVE_RATE: element.SX_RESULT * 1.0 / element.PLAN_QTY,
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
                ACHIVE_RATE: element.SX_RESULT * 1.0 / element.PLAN_QTY,
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
                ACHIVE_RATE: element.SX_RESULT * 1.0 / element.PLAN_QTY,
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

  const handle_getSXLossTimeByReason = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-12, "day").format("YYYY-MM-DD");
    await generalQuery("sxLossTimeByReason", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: SX_LOSSTIME_REASON_DATA[] = response.data.data.map(
            (element: SX_LOSSTIME_REASON_DATA, index: number) => {
              return {
                ...element,               
              };
            },
          );            
          setSXLossTimeByReason(loadeddata);
        } else {
          setSXLossTimeByReason([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_getSXLossTimeByEmpl = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-12, "day").format("YYYY-MM-DD");
    await generalQuery("sxLossTimeByEmpl", {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: SX_LOSSTIME_BY_EMPL[] = response.data.data.map(
            (element: SX_LOSSTIME_BY_EMPL, index: number) => {
              return {
                ...element,               
              };
            },
          );            
          setSXLossTimeByEmpl(loadeddata);
        } else {
          setSXLossTimeByEmpl([]);
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
      handle_getDailyEffData("ALL", searchCodeArray),
      handle_getWeeklyEffData("ALL", searchCodeArray),
      handle_getMonthlyEffData("ALL", searchCodeArray),
      handle_getYearlyEffData("ALL", searchCodeArray),
      handle_getSXLossTimeByReason("ALL", searchCodeArray),
      handle_getSXLossTimeByEmpl("ALL", searchCodeArray),
      handle_newCodeByCustomer(fromdate, todate, searchCodeArray),
      handle_newCodeByProdType(fromdate, todate, searchCodeArray),
      handle_getPlanLossData(selectedMachine, searchCodeArray),
    ]).then((values) => {
      Swal.fire("Thông báo", "Đã load xong báo cáo", 'success');
    });
  }
  useEffect(() => {
    handle_getMachineList("ALL");
    //initFunction();
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
                handle_getPlanLossData(e.target.value, searchCodeArray)
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
              material_ppm={dailysxloss[dailysxloss.length - 2]?.PURE_INPUT}
              process_ppm={dailysxloss[dailysxloss.length - 2]?.PURE_OUTPUT}
              total_ppm={dailysxloss[dailysxloss.length - 2]?.LOSS_RATE}
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
          <div className="dailygraphtotal">
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
                handle_getPlanLossData(e.target.value, searchCodeArray)
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
          </div>
          <span className="section_title">3. PRODUCTION ACHIVEMENT OVERVIEW</span>
          <div className="revenuewidget">
            <div className="revenuwdg">
              <WidgetSXAchive
                widgettype="revenue"
                label="Yesterday achivement"
                topColor="#b1e64e"
                botColor="#ffffff"
                material_ppm={dailysxachive[dailysxachive.length - 2]?.ACHIVE_RATE}
                process_ppm={dailysxachive[dailysxachive.length - 2]?.ACHIVE_RATE}
                total_ppm={dailysxachive[dailysxachive.length - 2]?.ACHIVE_RATE}
              />
            </div>
            <div className="revenuwdg">
              <WidgetSXAchive
                widgettype="revenue"
                label="This Week achivement"
                topColor="#b1e64e"
                botColor="#ffffff"
                material_ppm={weeklysxachive[0]?.ACHIVE_RATE}
                process_ppm={weeklysxachive[0]?.ACHIVE_RATE}
                total_ppm={weeklysxachive[0]?.ACHIVE_RATE}
              />
            </div>
            <div className="revenuwdg">
              <WidgetSXAchive
                widgettype="revenue"
                label="This Month achivement"
                topColor="#b1e64e"
                botColor="#ffffff"
                material_ppm={monthlysxachive[0]?.ACHIVE_RATE}
                process_ppm={monthlysxachive[0]?.ACHIVE_RATE}
                total_ppm={monthlysxachive[0]?.ACHIVE_RATE}
              />
            </div>
            <div className="revenuwdg">
              <WidgetSXAchive
                widgettype="revenue"
                label="This Year achivement"
                topColor="#b1e64e"
                botColor="#ffffff"
                material_ppm={yearlysxachive[0]?.ACHIVE_RATE}
                process_ppm={yearlysxachive[0]?.ACHIVE_RATE}
                total_ppm={yearlysxachive[0]?.ACHIVE_RATE}
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
          <br></br>
          <hr></hr>
          <span className="section_title">5. PRODUCTION EFFICIENCY OVERVIEW</span>
          <div className='mainprogressdiv'>
            <div className='subprogressdiv'>
              <div className='sectiondiv'>
                <div className='efficiencydiv'>
                  <CIRCLE_COMPONENT
                    type='timesummary'
                    value={`${selectedSXAffOverView.OPERATION_RATE.toLocaleString('en-US',{style:'percent'})}`}
                    title='OPERATION RATE'
                    color='red'
                  />
                  <CIRCLE_COMPONENT
                    type='timesummary'
                    value={`${selectedSXAffOverView.HIEU_SUAT_TIME.toLocaleString('en-US',{style:'percent'})}`}
                    title='PROD EFFICIENCY'
                    color='#FE28A7'
                  />
                  <CIRCLE_COMPONENT
                    type='timesummary'
                    value={`${selectedSXAffOverView.SETTING_TIME_RATE.toLocaleString('en-US',{style:'percent'})}`}
                    title='EQ EFFICIENCY'
                    color='#00B215'
                  />
                  <CIRCLE_COMPONENT
                    type='time'
                    value={`${selectedSXAffOverView.ALVB_TIME.toLocaleString('en-US')} min`}
                    title='AVLB TIME'
                    color='blue'
                  />
                  <CIRCLE_COMPONENT
                    type='time'
                    value={`${selectedSXAffOverView.TOTAL_TIME.toLocaleString('en-US')} min`}
                    title='TT PROD TIME'
                    color='#742BFE'
                  />
                  <CIRCLE_COMPONENT
                    type='time'
                    value={`${selectedSXAffOverView.SETTING_TIME.toLocaleString('en-US')} min`}
                    title='SETTING TIME'
                    color='#FE5E2B'
                  />
                  <CIRCLE_COMPONENT
                    type='time'
                    value={`${selectedSXAffOverView.PURE_RUN_TIME.toLocaleString('en-US')} min`}
                    title='RUN TIME'
                    color='#21B800'
                  />
                  <CIRCLE_COMPONENT
                    type='time'
                    value={`${selectedSXAffOverView.LOSS_TIME.toLocaleString('en-US')} min`}
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
                    SaveExcel(dailysxaeff, "Daily EFF Rate");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton>
                </span>
                <SXDailyEffTrend
                  dldata={[...dailysxaeff].reverse()}
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
                    SaveExcel(weeklysxaeff, "Weekly EFF Rate");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <SXWeeklyEffTrend
                  dldata={[...weeklysxaeff].reverse()}
                  processColor="#f1f5c8"
                  materialColor="#74c938"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Monthly EFF Rate <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(monthlysxaeff, "Monthly EFF Rate");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <SXMonthlyEffTrend
                  dldata={[...monthlysxaeff].reverse()}
                  processColor="#f1f5c8"
                  materialColor="#74c938"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Yearly EFF Rate <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(yearlysxaeff, "Yearly EFF Rate");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton></span>
                <SXYearlyEffTrend
                  dldata={[...yearlysxaeff].reverse()}
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
                  SaveExcel(sxLossTimeByReason, "SX LOSS TIME BY REASON");
                }}
              >
                <AiFillFileExcel color='green' size={15} />
                Excel
              </IconButton>
              </span>
              <SXLossTimeByReason data={[...sxLossTimeByReason].reverse()} />
            </div>
            <div className="dailygraph" style={{ height: '600px' }}>
              <span className="subsection">Loss Time by Employee <IconButton
                className='buttonIcon'
                onClick={() => {
                  SaveExcel(sxLossTimeByEmpl, "Loss Time by Employee");
                }}
              >
                <AiFillFileExcel color='green' size={15} />
                Excel
              </IconButton>
              </span>
              <SXLossTimeByEmpl data={[...sxLossTimeByEmpl].slice(0,10).reverse()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SX_REPORT;
