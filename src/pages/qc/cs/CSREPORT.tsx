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
import { CS_CONFIRM_BY_CUSTOMER_DATA, CS_CONFIRM_TRENDING_DATA, CS_REDUCE_AMOUNT_DATA, CS_RMA_AMOUNT_DATA, CS_TAXI_AMOUNT_DATA, CodeListData, DEFECT_TRENDING_DATA, DailyPPMData, FCSTAmountData, InspectSummary, MonthlyPPMData, PATROL_HEADER_DATA, WEB_SETTING_DATA, WeeklyPPMData, WidgetData_POBalanceSummary, WorstData, YearlyPPMData } from "../../../api/GlobalInterface";
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
import CSDDailyRMAChart from "../../../components/Chart/CSDDailyRMAChart";
import CSDWeeklyRMAChart from "../../../components/Chart/CSDWeeklyRMAChart";
import CSMonthlyRMAChart from "../../../components/Chart/CSMonthlyRMAChart";
import CSYearlyRMAChart from "../../../components/Chart/CSYearlyRMAChart";
import CSYearlyConfirm from "../../../components/Chart/CSYearlyConfirm";
import CSDWeeklyTaxiChart from "../../../components/Chart/CSWeeklyTaxiChart";
import CSDDailyTaxiChart from "../../../components/Chart/CSDailyTaxiChart";
import CSDMonthlyTaxiChart from "../../../components/Chart/CSMonthlyTaxiChart";
import CSYearlyTaxiChart from "../../../components/Chart/CSYearlyTaxiChart";
import CSFCOSTTABLE from "./FCOSTTABLE";
import SAVINGTABLE from "./SAVINGTABLE";
const CSREPORT = () => {
  const [dailyppm, setDailyPPM] = useState<CS_CONFIRM_TRENDING_DATA[]>([]);
  const [weeklyppm, setWeeklyPPM] = useState<CS_CONFIRM_TRENDING_DATA[]>([]);
  const [monthlyppm, setMonthlyPPM] = useState<CS_CONFIRM_TRENDING_DATA[]>([]);
  const [yearlyppm, setYearlyPPM] = useState<CS_CONFIRM_TRENDING_DATA[]>([]);
  const [fromdate, setFromDate] = useState(moment().add(-14, "day").format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [worstby, setWorstBy] = useState('AMOUNT');
  const [ng_type, setNg_Type] = useState('ALL');

  const [csConfirmDataByCustomer, setCsConfirmDataByCustomer] = useState<CS_CONFIRM_BY_CUSTOMER_DATA[]>([]);
  const [csConfirmDataByPIC, setCsConfirmDataByPIC] = useState<CS_CONFIRM_BY_CUSTOMER_DATA[]>([]);
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const [searchCodeArray, setSearchCodeArray] = useState<string[]>([]);

  const [csDailyReduceAmount, setCSDailyReduceAmount] = useState<CS_REDUCE_AMOUNT_DATA[]>([]);
  const [csWeeklyReduceAmount, setCSWeeklyReduceAmount] = useState<CS_REDUCE_AMOUNT_DATA[]>([]);
  const [csMonthlyReduceAmount, setCSMonthlyReduceAmount] = useState<CS_REDUCE_AMOUNT_DATA[]>([]);
  const [csYearlyReduceAmount, setCSYearlyReduceAmount] = useState<CS_REDUCE_AMOUNT_DATA[]>([]);

  const [csDailyRMAAmount, setCSDailyRMAAmount] = useState<CS_RMA_AMOUNT_DATA[]>([]);
  const [csWeeklyRMAAmount, setCSWeeklyRMAAmount] = useState<CS_RMA_AMOUNT_DATA[]>([]);
  const [csMonthlyRMAAmount, setCSDMonthyRMAAmount] = useState<CS_RMA_AMOUNT_DATA[]>([]);
  const [csYearlyRMAAmount, setCSYearlyRMAAmount] = useState<CS_RMA_AMOUNT_DATA[]>([]);

  const [csDailyTAXIAmount, setCSDailyTAXIAmount] = useState<CS_TAXI_AMOUNT_DATA[]>([]);
  const [csWeeklyTAXIAmount, setCSWeeklyTAXIAmount] = useState<CS_TAXI_AMOUNT_DATA[]>([]);
  const [csMonthlyTAXIAmount, setCSDMonthyTAXIAmount] = useState<CS_TAXI_AMOUNT_DATA[]>([]);
  const [csYearlyTAXIAmount, setCSYearlyTAXIAmount] = useState<CS_TAXI_AMOUNT_DATA[]>([]);
  const [cust_name, setCust_Name] = useState('');
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
      codeArray: listCode,
      CUST_NAME_KD: cust_name,      
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
      codeArray: listCode,
      CUST_NAME_KD: cust_name,      
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
      codeArray: listCode,
      CUST_NAME_KD: cust_name
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
      codeArray: listCode,
      CUST_NAME_KD: cust_name
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
      codeArray: listCode,
      CUST_NAME_KD: cust_name
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
      codeArray: listCode,
      CUST_NAME_KD: cust_name
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
  const handle_getCSDailyReduceAmount = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-14, "day").format("YYYY-MM-DD");
    await generalQuery("csdailyreduceamount", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
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
  const handle_getCSWeeklyReduceAmount = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-70, "day").format("YYYY-MM-DD");
    await generalQuery("csweeklyreduceamount", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
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
  const handle_getCSMonthlyReduceAmount = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-365, "day").format("YYYY-MM-DD");
    await generalQuery("csmonthlyreduceamount", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
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
  const handle_getCSYearlyReduceAmount = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-1200, "day").format("YYYY-MM-DD");
    await generalQuery("csyearlyreduceamount", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
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
  const handle_getCSDailyRMAAmount = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-14, "day").format("YYYY-MM-DD");
    await generalQuery("csdailyRMAAmount", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: CS_RMA_AMOUNT_DATA, index: number) => {
              return {
                ...element,
                TT: element.CD + element.HT + element.MD,
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
  const handle_getCSWeeklyRMAAmount = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-70, "day").format("YYYY-MM-DD");
    await generalQuery("csweeklyRMAAmount", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: CS_RMA_AMOUNT_DATA, index: number) => {
              return {
                ...element,
                TT: element.CD + element.HT + element.MD,
                RT_DATE: moment(element.RT_DATE).format("YYYY-MM-DD"),
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setCSWeeklyRMAAmount(loadeddata);
        } else {
          setCSWeeklyRMAAmount([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_getCSMonthlyRMAAmount = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-365, "day").format("YYYY-MM-DD");
    await generalQuery("csmonthlyRMAAmount", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: CS_RMA_AMOUNT_DATA, index: number) => {
              return {
                ...element,
                TT: element.CD + element.HT + element.MD,
                RT_DATE: moment(element.RT_DATE).format("YYYY-MM-DD"),
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setCSDMonthyRMAAmount(loadeddata);
        } else {
          setCSDMonthyRMAAmount([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_getCSYearlyRMAAmount = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-3650, "day").format("YYYY-MM-DD");
    await generalQuery("csyearlyRMAAmount", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: CS_RMA_AMOUNT_DATA, index: number) => {
              return {
                ...element,
                TT: element.CD + element.HT + element.MD,
                RT_DATE: moment(element.RT_DATE).format("YYYY-MM-DD"),
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setCSYearlyRMAAmount(loadeddata);
        } else {
          setCSYearlyRMAAmount([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handle_getCSDailyTaxiAmount = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-14, "day").format("YYYY-MM-DD");
    await generalQuery("csdailyTaxiAmount", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: CS_TAXI_AMOUNT_DATA, index: number) => {
              return {
                ...element,
                TAXI_DATE: moment(element.TAXI_DATE).format('YYYY-MM-DD'),
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setCSDailyTAXIAmount(loadeddata);
        } else {
          setCSDailyTAXIAmount([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_getCSMonthlyTaxiAmount = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-365, "day").format("YYYY-MM-DD");
    await generalQuery("csmonthlyTaxiAmount", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: CS_TAXI_AMOUNT_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setCSDMonthyTAXIAmount(loadeddata);
        } else {
          setCSDMonthyTAXIAmount([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_getCSWeeklyTaxiAmount = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-70, "day").format("YYYY-MM-DD");
    await generalQuery("csweeklyTaxiAmount", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: CS_TAXI_AMOUNT_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setCSWeeklyTAXIAmount(loadeddata);
        } else {
          setCSWeeklyTAXIAmount([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handle_getCSYearlyTaxiAmount = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, "day").format("YYYY-MM-DD");
    let frd = moment().add(-3650, "day").format("YYYY-MM-DD");
    await generalQuery("csyearlyTaxiAmount", {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: listCode,
      CUST_NAME_KD: cust_name
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: CS_TAXI_AMOUNT_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setCSYearlyTAXIAmount(loadeddata);
        } else {
          setCSYearlyTAXIAmount([]);
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
      handle_getCSDailyRMAAmount(fromdate, todate, searchCodeArray),
      handle_getCSWeeklyRMAAmount(fromdate, todate, searchCodeArray),
      handle_getCSMonthlyRMAAmount(fromdate, todate, searchCodeArray),
      handle_getCSYearlyRMAAmount(fromdate, todate, searchCodeArray),
      handle_getCSDailyTaxiAmount(fromdate, todate, searchCodeArray),
      handle_getCSMonthlyTaxiAmount(fromdate, todate, searchCodeArray),
      handle_getCSWeeklyTaxiAmount(fromdate, todate, searchCodeArray),
      handle_getCSYearlyTaxiAmount(fromdate, todate, searchCodeArray),
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
                <CSYearlyConfirm
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
          <span className="subsection_title">CS Saving Summary ({fromdate}~ {todate})</span>
          <SAVINGTABLE data={csDailyReduceAmount} />

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
          <span className="subsection_title">CS F-Cost Summary ({fromdate}~ {todate})</span>
          <CSFCOSTTABLE data={{
            RMA_DATA: csDailyRMAAmount,
            TAXI_DATA: csDailyTAXIAmount
          }
          } />
          <span className="subsection_title">RMA Amount Trending</span>
          <div className="fcosttrending">
            <div className="fcostgraph">
              <div className="dailygraph">
                <span className="subsection">Daily RMA</span>
                <CSDDailyRMAChart
                  dldata={[...csDailyRMAAmount].reverse()}
                  HT="#00da5b"
                  CD="#41d5fa"
                  MD="#c0ec21"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Weekly RMA</span>
                <CSDWeeklyRMAChart
                  dldata={[...csWeeklyRMAAmount].reverse()}
                  HT="#00da5b"
                  CD="#41d5fa"
                  MD="#c0ec21"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Monthly RMA</span>
                <CSMonthlyRMAChart
                  dldata={[...csMonthlyRMAAmount].reverse()}
                  HT="#00da5b"
                  CD="#41d5fa"
                  MD="#c0ec21"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Yearly RMA</span>
                <CSYearlyRMAChart
                  dldata={[...csYearlyRMAAmount].reverse()}
                  HT="#00da5b"
                  CD="#41d5fa"
                  MD="#c0ec21"
                />
              </div>
            </div>
          </div>
          <span className="subsection_title">Taxi Amount Trending</span>
          <div className="fcosttrending">
            <div className="fcostgraph">
              <div className="dailygraph">
                <span className="subsection">Daily Taxi</span>
                <CSDDailyTaxiChart
                  dldata={[...csDailyTAXIAmount].reverse()}
                  processColor="#00da5b"
                  materialColor="#41d5fa"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Weekly Taxi</span>
                <CSDWeeklyTaxiChart
                  dldata={[...csWeeklyTAXIAmount].reverse()}
                  processColor="#00da5b"
                  materialColor="#41d5fa"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Monthly Taxi</span>
                <CSDMonthlyTaxiChart
                  dldata={[...csMonthlyTAXIAmount].reverse()}
                  processColor="#00da5b"
                  materialColor="#41d5fa"
                />
              </div>
              <div className="dailygraph">
                <span className="subsection">Yearly Taxi</span>
                <CSYearlyTaxiChart
                  dldata={[...csYearlyTAXIAmount].reverse()}
                  processColor="#00da5b"
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
export default CSREPORT;
