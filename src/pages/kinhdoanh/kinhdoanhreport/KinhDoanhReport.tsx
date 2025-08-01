import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, getCompany, getGlobalSetting } from "../../../api/Api";
import ChartWeekLy from "../../../components/Chart/KD/KDWeeklyClosing";
import ChartMonthLy from "../../../components/Chart/KD/KDMonthlyClosing";
import ChartYearly from "../../../components/Chart/KD/KDYearlyClosing";
import ChartCustomerRevenue from "../../../components/Chart/KD/KDChartCustomerRevenue";
import ChartFCSTSamSung from "../../../components/Chart/KD/ChartFCSTSamSung";
import ChartPICRevenue from "../../../components/Chart/KD/ChartPICRevenue";
import ChartWeeklyPO from "../../../components/Chart/KD/ChartWeekLyPO";
import Widget from "../../../components/Widget/Widget";
import "./KinhDoanhReport.scss";
import ChartDaily from "../../../components/Chart/KD/KDDailyClosing";
import ChartPOBalance from "../../../components/Chart/KD/KDPOBalanceChart";
import CustomerDailyClosing from "../../../components/DataTable/CustomerDailyClosing";
import CustomerWeeklyClosing from "../../../components/DataTable/CustomerWeeklyClosing";
import CustomerPobalancebyTypeNew from "../../../components/DataTable/CustomerPoBalanceByTypeNew";
import {
  WEB_SETTING_DATA,
  WeeklyClosingData,
} from "../../../api/GlobalInterface";
import { Checkbox, IconButton } from "@mui/material";
import { SaveExcel } from "../../../api/GlobalFunction";
import { AiFillFileExcel } from "react-icons/ai";
import CustomerMonthlyClosing from "../../../components/DataTable/CustomerMonthlyClosing";
import KDDailyOverdue from "../../../components/Chart/KD/KDDailyOverdue";
import KDWeeklyOverdue from "../../../components/Chart/KD/KDWeeklyOverdue";
import KDMonthlyOverdue from "../../../components/Chart/KD/KDMonthlyOverdue";
import KDYearlyOverdue from "../../../components/Chart/KD/KDYearlyOverdue";
import { CUSTOMER_REVENUE_DATA, CustomerListData, MonthlyClosingData, OVERDUE_DATA, PIC_REVENUE_DATA, RunningPOData, WeekLyPOData } from "../interfaces/kdInterface";
interface YearlyClosingData {
  YEAR_NUM: string;
  DELIVERY_QTY: number;
  DELIVERED_AMOUNT: number;
}
interface DailyClosingData {
  DELIVERY_DATE: string;
  DELIVERY_QTY: number;
  DELIVERED_AMOUNT: number;
}
interface POBalanceSummaryData {
  PO_QTY: number;
  TOTAL_DELIVERED: number;
  PO_BALANCE: number;
  PO_AMOUNT: number;
  DELIVERED_AMOUNT: number;
  BALANCE_AMOUNT: number;
}
interface FCSTAmountData {
  FCSTYEAR: number;
  FCSTWEEKNO: number;
  FCST4W_QTY: number;
  FCST4W_AMOUNT: number;
  FCST8W_QTY: number;
  FCST8W_AMOUNT: number;
}
interface WidgetData_POBalanceSummary {
  po_balance_qty: number;
  po_balance_amount: number;
}
const KinhDoanhReport = () => {
  const [in_nhanh, setInNhanh] = useState(false);
  const [df, setDF] = useState(true);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [widgetdata_yesterday, setWidgetData_Yesterday] = useState<
    DailyClosingData[]
  >([]);
  const [widgetdata_thisweek, setWidgetData_ThisWeek] = useState<
    WeeklyClosingData[]
  >([]);
  const [widgetdata_thismonth, setWidgetData_ThisMonth] = useState<
    MonthlyClosingData[]
  >([]);
  const [widgetdata_thisyear, setWidgetData_ThisYear] = useState<
    YearlyClosingData[]
  >([]);
  const [customerRevenue, setCustomerRevenue] = useState<
    CUSTOMER_REVENUE_DATA[]
  >([]);
  const [monthlyvRevenuebyCustomer, setMonthlyvRevenuebyCustomer] = useState<
    Array<any>
  >([]);
  const [picRevenue, setPICRevenue] = useState<PIC_REVENUE_DATA[]>([]);
  const [dailyClosingData, setDailyClosingData] = useState<any>([]);
  const [columns, setColumns] = useState<Array<any>>([]);
  const [weeklyClosingData, setWeeklyClosingData] = useState<any>([]);
  const [columnsweek, setColumnsWeek] = useState<Array<any>>([]);
  const [columnsmonth, setColumnsMonth] = useState<Array<any>>([]);
  const [runningPOData, setWeekLyPOData] = useState<Array<WeekLyPOData>>([]);
  const [runningPOBalanceData, setRunningPOBalanceData] = useState< Array<RunningPOData> >([]);
  const [widgetdata_pobalancesummary, setWidgetData_PoBalanceSummary] =
    useState<WidgetData_POBalanceSummary>({
      po_balance_qty: 0,
      po_balance_amount: 0,
    });
  const [widgetdata_fcstAmount, setWidgetData_FcstAmount] =
    useState<FCSTAmountData>({
      FCSTYEAR: 0,
      FCSTWEEKNO: 1,
      FCST4W_QTY: 0,
      FCST4W_AMOUNT: 0,
      FCST8W_QTY: 0,
      FCST8W_AMOUNT: 0,
    });
  const [dailyOverdueData, setDailyOverdueData] = useState<OVERDUE_DATA[]>([]);
  const [weeklyOverdueData, setweeklyOverdueData] = useState<OVERDUE_DATA[]>(
    []
  );
  const [monthlyOverdueData, setmonthyOverdueData] = useState<OVERDUE_DATA[]>(
    []
  );
  const [yearlyOverdueData, setyearlyOverdueData] = useState<OVERDUE_DATA[]>(
    []
  );

  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [selectedCustomerList, setSelectedCustomerList] = useState<
    CustomerListData[]
  >([]);
  const handleGetFCSTAmount = useCallback(async () => {
    let kq: FCSTAmountData[] = [];
    let fcstweek2: number = moment().add(1, "days").isoWeek();
    let fcstyear2: number = moment().year();
    await generalQuery("checklastfcstweekno", {
      FCSTWEEKNO: fcstyear2,
    })
      .then((response) => {
        //console.log(response.data.data)
        if (response.data.tk_status !== "NG") {
          fcstweek2 = response.data.data[0].FCSTWEEKNO;
          //console.log(response.data.data);
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    //console.log("fcst week2->: ", fcstweek2);
    await generalQuery("fcstamount", {
      FCSTYEAR: fcstyear2,
      FCSTWEEKNO: fcstweek2,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: FCSTAmountData[] = response.data.data.map(
            (element: FCSTAmountData, index: number) => {
              return {
                ...element,
              };
            }
          );
          kq = loadeddata;
          //setWidgetData_FcstAmount(loadeddata[0]);
        } else {
          generalQuery("fcstamount", {
            FCSTYEAR: fcstweek2 - 1 === 0 ? fcstyear2 - 1 : fcstyear2,
            FCSTWEEKNO: fcstweek2 - 1 === 0 ? 52 : fcstweek2 - 1,
          })
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
                const loadeddata: FCSTAmountData[] = response.data.data.map(
                  (element: FCSTAmountData, index: number) => {
                    return {
                      ...element,
                    };
                  }
                );
                kq = loadeddata;
                //setWidgetData_FcstAmount(loadeddata[0]);
              } else {
                //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
              }
            })
            .catch((error) => {
              console.log(error);
            });
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  }, [df, fromdate, todate]);
  const handleGetDailyClosing = useCallback(async () => {
    let yesterday = moment().add(0, "day").format("YYYY-MM-DD");
    let yesterday2 = moment().add(-12, "day").format("YYYY-MM-DD");
    let kq: DailyClosingData[] = [];    
    await generalQuery("kd_dailyclosing", {
      START_DATE: df ? yesterday2 : fromdate,
      END_DATE: df ? yesterday : todate,
      IN_NHANH: in_nhanh,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: DailyClosingData[] = response.data.data.map(
            (element: DailyClosingData, index: number) => {
              return {
                ...element,
                DELIVERY_DATE: element.DELIVERY_DATE.slice(0, 10),
              };
            }
          );
          kq = loadeddata;
          //setWidgetData_Yesterday(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  }, [df, fromdate, todate, in_nhanh]);
  const handleGetWeeklyClosing = useCallback(async () => {
    let yesterday = moment().add(1, "day").endOf("week").format("YYYY-MM-DD");
    let yesterday2 = moment().add(-56, "day").format("YYYY-MM-DD");
    let kq: WeeklyClosingData[] = [];
    await generalQuery("kd_weeklyclosing", {
      START_DATE: df ? yesterday2 : fromdate,
      END_DATE: df ? yesterday : todate,
      IN_NHANH: in_nhanh,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: WeeklyClosingData[] = response.data.data.map(
            (element: WeeklyClosingData, index: number) => {
              return {
                ...element,
              };
            }
          );
          kq = loadeddata.reverse();
          //setWidgetData_ThisWeek(loadeddata.reverse());
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  }, [df, fromdate, todate, in_nhanh]);
  const handleGetMonthlyClosing = useCallback(async () => {
    let yesterday = moment().endOf("month").format("YYYY-MM-DD");
    let yesterday2 = moment().add(-365, "day").format("YYYY-MM-DD");
    let kq: MonthlyClosingData[] = [];
    await generalQuery("kd_monthlyclosing", {
      START_DATE: df ? yesterday2 : fromdate,
      END_DATE: df ? yesterday : todate,
      IN_NHANH: in_nhanh,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: MonthlyClosingData[] = response.data.data.map(
            (element: MonthlyClosingData, index: number) => {
              return {
                ...element,
              };
            }
          );
          kq = loadeddata.reverse();
          //setWidgetData_ThisMonth(loadeddata.reverse());
          //console.log('length - 1', loadeddata.reverse()[loadeddata.length - 1]?.DELIVERED_AMOUNT);
          //console.log('length - 2', loadeddata.reverse()[loadeddata.length - 2]?.DELIVERED_AMOUNT);
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  }, [df, fromdate, todate, in_nhanh]);
  const handleGetYearlyClosing = useCallback(async () => {
    let yesterday = moment().endOf("year").format("YYYY-MM-DD");
    let yesterday2 = "2020-01-01";
    let kq: YearlyClosingData[] = [];
    await generalQuery("kd_annuallyclosing", {
      START_DATE: df ? yesterday2 : fromdate,
      END_DATE: df ? yesterday : todate,
      IN_NHANH: in_nhanh,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: YearlyClosingData[] = response.data.data.map(
            (element: YearlyClosingData, index: number) => {
              return {
                ...element,
              };
            }
          );
          kq = loadeddata;
          //setWidgetData_ThisYear(loadeddata);
          //console.log(loadeddata)
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  }, [df, fromdate, todate, in_nhanh]);
  const handleGetPOBalanceSummary = useCallback(async () => {
    let kq: POBalanceSummaryData[] = [];
    await generalQuery("traPOSummaryTotal", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: POBalanceSummaryData[] = response.data.data.map(
            (element: POBalanceSummaryData, index: number) => {
              return {
                ...element,
              };
            }
          );
          kq = loadeddata;
          //setWidgetData_PoBalanceSummary({
          //  po_balance_qty: loadeddata[0].PO_BALANCE,
          //  po_balance_amount: loadeddata[0].BALANCE_AMOUNT,
          //});
          //console.log(loadeddata);
          /*  Swal.fire(
          "Thông báo",
          "Đã load " + response.data.data.length + " dòng",
          "success"
        ); */
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  }, [df, fromdate, todate, in_nhanh]);
  const handleGetCustomerRevenue = useCallback(async () => {
    let sunday = moment().clone().weekday(0).format("YYYY-MM-DD");
    let monday = moment().clone().weekday(6).format("YYYY-MM-DD");
    let kq: CUSTOMER_REVENUE_DATA[] = [];
    await generalQuery("customerRevenue", {
      START_DATE: df ? sunday : fromdate,
      END_DATE: df ? monday : todate,
      IN_NHANH: in_nhanh,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          let loadeddata: CUSTOMER_REVENUE_DATA[] = response.data.data.map(
            (element: CUSTOMER_REVENUE_DATA, index: number) => {
              return {
                ...element,
              };
            }
          );
          loadeddata = loadeddata.splice(0, 5);
          kq = loadeddata;
          //setCustomerRevenue(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          sunday = moment()
            .clone()
            .weekday(0)
            .add(-7, "days")
            .format("YYYY-MM-DD");
          monday = moment()
            .clone()
            .weekday(6)
            .add(-7, "days")
            .format("YYYY-MM-DD");
          generalQuery("customerRevenue", {
            START_DATE: df ? sunday : fromdate,
            END_DATE: df ? monday : todate,
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                //console.log(response.data.data);
                let loadeddata: CUSTOMER_REVENUE_DATA[] =
                  response.data.data.map(
                    (element: CUSTOMER_REVENUE_DATA, index: number) => {
                      return {
                        ...element,
                      };
                    }
                  );
                loadeddata = loadeddata.splice(0, 5);
                kq = loadeddata;
                //console.log(loadeddata);
                //setCustomerRevenue(loadeddata);
              } else {
                //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  }, [df, fromdate, todate, in_nhanh]);
  const handleGetPICRevenue = useCallback(async () => {
    let sunday = moment().clone().weekday(0).format("YYYY-MM-DD");
    let monday = moment().clone().weekday(6).format("YYYY-MM-DD");
    let kq: PIC_REVENUE_DATA[] = [];
    await generalQuery("PICRevenue", {
      START_DATE: df ? sunday : fromdate,
      END_DATE: df ? monday : todate,
      IN_NHANH: in_nhanh,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          let loadeddata: PIC_REVENUE_DATA[] = response.data.data.map(
            (element: PIC_REVENUE_DATA, index: number) => {
              return {
                ...element,
              };
            }
          );
          kq = loadeddata;
          //setPICRevenue(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          sunday = moment()
            .clone()
            .weekday(0)
            .add(-7, "days")
            .format("YYYY-MM-DD");
          monday = moment()
            .clone()
            .weekday(6)
            .add(-7, "days")
            .format("YYYY-MM-DD");
          generalQuery("PICRevenue", {
            START_DATE: df ? sunday : fromdate,
            END_DATE: df ? monday : todate,
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                //console.log(response.data.data);
                let loadeddata: PIC_REVENUE_DATA[] = response.data.data.map(
                  (element: PIC_REVENUE_DATA, index: number) => {
                    return {
                      ...element,
                    };
                  }
                );
                kq = loadeddata;
                //setPICRevenue(loadeddata);
              } else {
                //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  }, [df, fromdate, todate, in_nhanh]);
  const handleGetDailyOverdue = useCallback(async () => {
    let yesterday = moment().add(0, "day").format("YYYY-MM-DD");
    let yesterday2 = moment().add(-12, "day").format("YYYY-MM-DD");
    let kq: OVERDUE_DATA[] = [];
    await generalQuery("dailyoverduedata", {
      START_DATE: df ? yesterday2 : fromdate,
      END_DATE: df ? yesterday : todate,
      D_PLUS:
        getGlobalSetting()?.filter(
          (ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === "KD_DPLUS"
        )[0]?.CURRENT_VALUE ?? 6,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: OVERDUE_DATA[] = response.data.data.map(
            (element: OVERDUE_DATA, index: number) => {
              return {
                ...element,
                OK_RATE: (element.OK_IV * 1.0) / element.TOTAL_IV,
                DELIVERY_DATE: element.DELIVERY_DATE?.slice(0, 10),
              };
            }
          );
          kq = loadeddata;
          //setDailyOverdueData(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  }, [df, fromdate, todate, in_nhanh]);
  const handleGetWeeklyOverdue = useCallback(async () => {
    let yesterday = moment().add(0, "day").format("YYYY-MM-DD");
    let yesterday2 = moment().add(-70, "day").format("YYYY-MM-DD");
    let kq: OVERDUE_DATA[] = [];
    await generalQuery("weeklyoverduedata", {
      START_DATE: df ? yesterday2 : fromdate,
      END_DATE: df ? yesterday : todate,
      D_PLUS:
        getGlobalSetting()?.filter(
          (ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === "KD_DPLUS"
        )[0]?.CURRENT_VALUE ?? 6,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: OVERDUE_DATA[] = response.data.data.map(
            (element: OVERDUE_DATA, index: number) => {
              return {
                ...element,
                OK_RATE: (element.OK_IV * 1.0) / element.TOTAL_IV,
              };
            }
          );
          kq = loadeddata;
          //setweeklyOverdueData(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  }, [df, fromdate, todate]);
  const handleGetMonthlyOverdue = useCallback(async () => {
    let yesterday = moment().add(0, "day").format("YYYY-MM-DD");
    let yesterday2 = moment().add(-365, "day").format("YYYY-MM-DD");
    let kq: OVERDUE_DATA[] = [];
    await generalQuery("monthlyoverduedata", {
      START_DATE: df ? yesterday2 : fromdate,
      END_DATE: df ? yesterday : todate,
      D_PLUS:
        getGlobalSetting()?.filter(
          (ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === "KD_DPLUS"
        )[0]?.CURRENT_VALUE ?? 6,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: OVERDUE_DATA[] = response.data.data.map(
            (element: OVERDUE_DATA, index: number) => {
              return {
                ...element,
                OK_RATE: (element.OK_IV * 1.0) / element.TOTAL_IV,
              };
            }
          );
          kq = loadeddata;
          //setmonthyOverdueData(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  }, [df, fromdate, todate]);
  const handleGetYearlyOverdue = useCallback(async () => {
    let yesterday = moment().add(0, "day").format("YYYY-MM-DD");
    let yesterday2 = moment().add(-3650, "day").format("YYYY-MM-DD");
    let kq: OVERDUE_DATA[] = [];
    await generalQuery("yearlyoverduedata", {
      START_DATE: df ? yesterday2 : fromdate,
      END_DATE: df ? yesterday : todate,
      D_PLUS:
        getGlobalSetting()?.filter(
          (ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === "KD_DPLUS"
        )[0]?.CURRENT_VALUE ?? 6,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: OVERDUE_DATA[] = response.data.data.map(
            (element: OVERDUE_DATA, index: number) => {
              return {
                ...element,
                OK_RATE: (element.OK_IV * 1.0) / element.TOTAL_IV,
              };
            }
          );
          kq = loadeddata;
          //setyearlyOverdueData(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  }, [df, fromdate, todate]);
  const getcustomerlist = useCallback(async () => {
    let kq: any[] = [];
    await generalQuery("selectcustomerList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          kq = response.data.data;
          //setCustomerList(response.data.data);
        } else {
          //setCustomerList([]);
        }
      })
      .catch((error) => {
        //console.log(error);
      });
    return kq;
  }, [df, fromdate, todate]);
  const loadDailyClosing = useCallback(async () => {
    let kq: any[] = [];
    await generalQuery("getDailyClosingKD", {
      FROM_DATE: df ? moment.utc().format("YYYY-MM-01") : fromdate,
      TO_DATE: df ? moment.utc().format("YYYY-MM-DD") : todate,
      IN_NHANH: in_nhanh,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: any, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          //setDailyClosingData(loadeddata);
          kq = loadeddata;
          /*  let keysArray = Object.getOwnPropertyNames(loadeddata[0]);
          let column_map = keysArray.map((e, index) => {
            return {
              field: e,
              headerName: e,
              width: 100,
              cellRenderer: (ele: any) => {
                //console.log(ele);
                if (['CUST_NAME_KD', 'id'].indexOf(e) > -1) {
                  return <span>{ele.data[e]}</span>;
                }
                else if (e === 'DELIVERED_AMOUNT') {
                  return <span style={{ color: "#050505", fontWeight: "bold" }}>
                    {ele.data[e]?.toLocaleString("en-US", {
                      style: "currency",
                      currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                    })}
                  </span>
                }
                else {
                  if (ele.data['CUST_NAME_KD'] === 'TOTAL') {
                    return (<span style={{ color: "green", fontWeight: "bold" }}>
                      {ele.data[e]?.toLocaleString("en-US", {
                        style: "currency",
                        currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                      })}
                    </span>)
                  }
                  else {
                    return (<span style={{ color: "green", fontWeight: "normal" }}>
                      {ele.data[e]?.toLocaleString("en-US", {
                        style: "currency",
                        currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                      })}
                    </span>)
                  }
                }
              },
            };
          });
          setColumns(column_map); */
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          const lastmonth = moment().subtract(1, "months");
          generalQuery("getDailyClosingKD", {
            FROM_DATE: df
              ? lastmonth.startOf("month").format("YYYY-MM-DD")
              : fromdate,
            TO_DATE: df
              ? lastmonth.endOf("month").format("YYYY-MM-DD")
              : todate,
            IN_NHANH: in_nhanh,
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                let loadeddata = response.data.data.map(
                  (element: any, index: number) => {
                    return {
                      ...element,
                      id: index,
                    };
                  }
                );
                //setDailyClosingData(loadeddata);
                kq = loadeddata;
                /* let keysArray = Object.getOwnPropertyNames(loadeddata[0]);
                let column_map = keysArray.map((e, index) => {
                  return {
                    field: e,
                    headerName: e,
                    width: 100,
                    cellRenderer: (ele: any) => {
                      //console.log(ele);
                      if (['CUST_NAME_KD', 'id'].indexOf(e) > -1) {
                        return <span>{ele.data[e]}</span>;
                      }
                      else if (e === 'DELIVERED_AMOUNT') {
                        return <span style={{ color: "#050505", fontWeight: "bold" }}>
                          {ele.data[e]?.toLocaleString("en-US", {
                            style: "currency",
                            currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                          })}
                        </span>
                      }
                      else {
                        if (ele.data['CUST_NAME_KD'] === 'TOTAL') {
                          return (<span style={{ color: "green", fontWeight: "bold" }}>
                            {ele.data[e]?.toLocaleString("en-US", {
                              style: "currency",
                              currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                            })}
                          </span>)
                        }
                        else {
                          return (<span style={{ color: "green", fontWeight: "normal" }}>
                            {ele.data[e]?.toLocaleString("en-US", {
                              style: "currency",
                              currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                            })}
                          </span>)
                        }
                      }
                    },
                  };
                });
                setColumns(column_map); */
              } else {
                //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  }, [df, fromdate, todate, in_nhanh]);
  const loadWeeklyClosing = useCallback(async () => {
    let kq: any[] = [];
    await generalQuery("getWeeklyClosingKD", {
      FROM_DATE: df ? moment.utc().format("YYYY-MM-01") : fromdate,
      TO_DATE: df ? moment.utc().format("YYYY-MM-DD") : todate,
      IN_NHANH: in_nhanh,
    })
      .then((response) => {
        //console.log(response);
        if (response.data.tk_status !== "NG") {
          if (response.data.data.length > 0) {
            let loadeddata = response.data.data.map(
              (element: any, index: number) => {
                return {
                  ...element,
                  id: index,
                };
              }
            );
            //setWeeklyClosingData(loadeddata);
            kq = loadeddata;
            /*  let keysArray = Object.getOwnPropertyNames(loadeddata[0]);
            let column_map = keysArray.map((e, index) => {
              return {
                field: e,
                header: e,
                width: 100,
                cellRenderer: (ele: any) => {
                  //console.log(ele);
                  if (['CUST_NAME_KD', 'id'].indexOf(e) > -1) {
                    return <span>{ele.data[e]}</span>;
                  }
                  else if (e === 'TOTAL_AMOUNT') {
                    return <span style={{ color: "#F633EA", fontWeight: "bold" }}>
                      {ele.data[e]?.toLocaleString("en-US", {
                        style: "currency",
                        currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                      })}
                    </span>
                  }
                  else if (e === 'TOTAL_QTY') {
                    return <span style={{ color: "#052ee7", fontWeight: "bold" }}>
                      {ele.data[e]?.toLocaleString("en-US", {
                        style: "decimal",
                      })}
                    </span>
                  }
                  else if (e.indexOf("QTY") > -1) {
                    return <span style={{ color: "#052ee7", fontWeight: "normal" }}>
                      {ele.data[e]?.toLocaleString("en-US", {
                        style: "decimal",
                      })}
                    </span>
                  }
                  else {
                    if (ele.data['CUST_NAME_KD'] === 'TOTAL') {
                      return (<span style={{ color: "green", fontWeight: "bold" }}>
                        {ele.data[e]?.toLocaleString("en-US", {
                          style: "currency",
                          currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                        })}
                      </span>)
                    }
                    else {
                      return (<span style={{ color: "green", fontWeight: "normal" }}>
                        {ele.data[e]?.toLocaleString("en-US", {
                          style: "currency",
                          currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                        })}
                      </span>)
                    }
                  }
                },
              };
            });
            setColumnsWeek(column_map); */
          } else {
            const lastmonth = moment().subtract(1, "months");
            generalQuery("getWeeklyClosingKD", {
              FROM_DATE: df
                ? lastmonth.startOf("month").format("YYYY-MM-DD")
                : fromdate,
              TO_DATE: df
                ? lastmonth.endOf("month").format("YYYY-MM-DD")
                : todate,
            })
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  let loadeddata = response.data.data.map(
                    (element: any, index: number) => {
                      return {
                        ...element,
                        id: index,
                      };
                    }
                  );
                  kq = loadeddata;
                  //setWeeklyClosingData(loadeddata);
                  /* let keysArray = Object.getOwnPropertyNames(loadeddata[0] ?? []);
                  let column_map = keysArray.map((e, index) => {
                    return {
                      field: e,
                      headerName: e,
                      width: 100,
                      cellRenderer: (ele: any) => {
                        //console.log(ele);
                        if (['CUST_NAME_KD', 'id'].indexOf(e) > -1) {
                          return <span>{ele.data[e]}</span>;
                        }
                        else if (e === 'TOTAL_AMOUNT') {
                          return <span style={{ color: "#F633EA", fontWeight: "bold" }}>
                            {ele.data[e]?.toLocaleString("en-US", {
                              style: "currency",
                              currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                            })}
                          </span>
                        }
                        else if (e === 'TOTAL_QTY') {
                          return <span style={{ color: "#052ee7", fontWeight: "bold" }}>
                            {ele.data[e]?.toLocaleString("en-US", {
                              style: "decimal",
                            })}
                          </span>
                        }
                        else if (e.indexOf("QTY") > -1) {
                          return <span style={{ color: "#052ee7", fontWeight: "normal" }}>
                            {ele.data[e]?.toLocaleString("en-US", {
                              style: "decimal",
                            })}
                          </span>
                        }
                        else {
                          if (ele.data['CUST_NAME_KD'] === 'TOTAL') {
                            return (<span style={{ color: "green", fontWeight: "bold" }}>
                              {ele.data[e]?.toLocaleString("en-US", {
                                style: "currency",
                                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                              })}
                            </span>)
                          }
                          else {
                            return (<span style={{ color: "green", fontWeight: "normal" }}>
                              {ele.data[e]?.toLocaleString("en-US", {
                                style: "currency",
                                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                              })}
                            </span>)
                          }
                        }
                      },
                    };
                  });
                  setColumnsWeek(column_map); */
                } else {
                  //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          const lastmonth = moment().subtract(1, "months");
          generalQuery("getWeeklyClosingKD", {
            FROM_DATE: lastmonth.startOf("month").format("YYYY-MM-DD"),
            TO_DATE: lastmonth.endOf("month").format("YYYY-MM-DD"),
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                let loadeddata = response.data.data.map(
                  (element: any, index: number) => {
                    return {
                      ...element,
                      id: index,
                    };
                  }
                );
                kq = loadeddata;
                /* setWeeklyClosingData(loadeddata);
                let keysArray = Object.getOwnPropertyNames(loadeddata[0]);
                let column_map = keysArray.map((e, index) => {
                  return {
                    dataField: e,
                    caption: e,
                    width: 100,
                    cellRender: (ele: any) => {
                      //console.log(ele);
                      if (['CUST_NAME_KD', 'id'].indexOf(e) > -1) {
                        return <span>{ele.data[e]}</span>;
                      }
                      else if (e === 'TOTAL_AMOUNT') {
                        return <span style={{ color: "#F633EA", fontWeight: "bold" }}>
                          {ele.data[e]?.toLocaleString("en-US", {
                            style: "currency",
                            currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                          })}
                        </span>
                      }
                      else {
                        if (ele.data['CUST_NAME_KD'] === 'TOTAL') {
                          return (<span style={{ color: "green", fontWeight: "bold" }}>
                            {ele.data[e]?.toLocaleString("en-US", {
                              style: "currency",
                              currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                            })}
                          </span>)
                        }
                        else {
                          return (<span style={{ color: "green", fontWeight: "normal" }}>
                            {ele.data[e]?.toLocaleString("en-US", {
                              style: "currency",
                              currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                            })}
                          </span>)
                        }
                      }
                    },
                  };
                });
                setColumns(column_map); */
              } else {
                //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  }, [df, fromdate, todate, in_nhanh]);
  const loadPoOverWeek = useCallback(async () => {
    let kq: WeekLyPOData[] = [];
    await generalQuery("kd_pooverweek", {
      FROM_DATE: df ? moment().add(-70, "day").format("YYYY-MM-DD") : fromdate,
      TO_DATE: df ? moment.utc().format("YYYY-MM-DD") : todate,
      IN_NHANH: in_nhanh,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: WeekLyPOData[] = response.data.data.map(
            (element: WeekLyPOData, index: number) => {
              return {
                ...element,
              };
            }
          );
          kq = loadeddata.reverse();
          //setWeekLyPOData(loadeddata.reverse());
          //console.log(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  }, [df, fromdate, todate, in_nhanh]);
  const loadRunningPOBalanceData = useCallback(async () => {
    let kq: RunningPOData[] = [];
    await generalQuery("kd_runningpobalance", {
      TO_DATE: df ? moment().format("YYYY-MM-DD") : todate,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: RunningPOData[] = response.data.data.map(
            (element: RunningPOData, index: number) => {
              return {
                ...element,
              };
            }
          );
          if (df) {
            kq = loadeddata.splice(0, 10).reverse();
            //setRunningPOBalanceData(loadeddata.splice(0, 10).reverse());
          } else {
            kq = loadeddata.reverse();
            //setRunningPOBalanceData(loadeddata.reverse());
          }
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  }, [df, fromdate, todate, in_nhanh]);
  const loadMonthlyRevenueByCustomer = useCallback(async () => {
    let kq: any[] = [];
    await generalQuery("loadMonthlyRevenueByCustomer", {
      FROM_DATE: df ? moment.utc().format("YYYY-01-01") : fromdate,
      TO_DATE: df ? moment.utc().format("YYYY-MM-DD") : todate,
      IN_NHANH: in_nhanh,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata = response.data.data.map(
            (element: any, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          kq = loadeddata;
          //setMonthlyvRevenuebyCustomer(loadeddata);
          /* let keysArray = Object.getOwnPropertyNames(loadeddata[0]);
          let column_map = keysArray.map((e, index) => {
            return {
              field: e,
              headerName: e,
              width: 100,
              cellRenderer: (ele: any) => {
                //console.log(ele);
                if (['CUST_NAME_KD', 'id'].indexOf(e) > -1) {
                  return <span>{ele.data[e]}</span>;
                }
                else if (e === 'TOTAL_AMOUNT') {
                  return <span style={{ color: "#F633EA", fontWeight: "bold" }}>
                    {ele.data[e]?.toLocaleString("en-US", {
                      style: "currency",
                      currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                    })}
                  </span>
                }
                else if (e === 'TOTAL_QTY') {
                  return <span style={{ color: "#052ee7", fontWeight: "bold" }}>
                    {ele.data[e]?.toLocaleString("en-US", {
                      style: "decimal",
                    })}
                  </span>
                }
                else if (e.indexOf("QTY") > -1) {
                  return <span style={{ color: "#052ee7", fontWeight: "normal" }}>
                    {ele.data[e]?.toLocaleString("en-US", {
                      style: "decimal",
                    })}
                  </span>
                }
                else {
                  if (ele.data['CUST_NAME_KD'] === 'TOTAL') {
                    return (<span style={{ color: "green", fontWeight: "bold" }}>
                      {ele.data[e]?.toLocaleString("en-US", {
                        style: "currency",
                        currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                      })}
                    </span>)
                  }
                  else {
                    return (<span style={{ color: "green", fontWeight: "normal" }}>
                      {ele.data[e]?.toLocaleString("en-US", {
                        style: "currency",
                        currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                      })}
                    </span>)
                  }
                }
              },
            };
          });
          setColumnsMonth(column_map); */
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  }, [df, fromdate, todate, in_nhanh]);
  const loadMonthlyRevenueByCustomerAndEmpl = useCallback(async () => {
    let kq: any[] = [];
    await generalQuery("baocaodanhthutheokhachtheonguoimonthly", {
      FROM_DATE: df ? moment.utc().format("YYYY-01-01") : fromdate,
      TO_DATE: df ? moment.utc().format("YYYY-MM-DD") : todate,
      IN_NHANH: in_nhanh,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata = response.data.data.map(
            (element: any, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          kq = loadeddata;
          //setMonthlyvRevenuebyCustomer(loadeddata);
          /* let keysArray = Object.getOwnPropertyNames(loadeddata[0]);
          let column_map = keysArray.map((e, index) => {
            return {
              field: e,
              headerName: e,
              width: 100,
              cellRenderer: (ele: any) => {
                //console.log(ele);
                if (['CUST_NAME_KD', 'id'].indexOf(e) > -1) {
                  return <span>{ele.data[e]}</span>;
                }
                else if (e === 'TOTAL_AMOUNT') {
                  return <span style={{ color: "#F633EA", fontWeight: "bold" }}>
                    {ele.data[e]?.toLocaleString("en-US", {
                      style: "currency",
                      currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                    })}
                  </span>
                }
                else if (e === 'TOTAL_QTY') {
                  return <span style={{ color: "#052ee7", fontWeight: "bold" }}>
                    {ele.data[e]?.toLocaleString("en-US", {
                      style: "decimal",
                    })}
                  </span>
                }
                else if (e.indexOf("QTY") > -1) {
                  return <span style={{ color: "#052ee7", fontWeight: "normal" }}>
                    {ele.data[e]?.toLocaleString("en-US", {
                      style: "decimal",
                    })}
                  </span>
                }
                else {
                  if (ele.data['CUST_NAME_KD'] === 'TOTAL') {
                    return (<span style={{ color: "green", fontWeight: "bold" }}>
                      {ele.data[e]?.toLocaleString("en-US", {
                        style: "currency",
                        currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                      })}
                    </span>)
                  }
                  else {
                    return (<span style={{ color: "green", fontWeight: "normal" }}>
                      {ele.data[e]?.toLocaleString("en-US", {
                        style: "currency",
                        currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                      })}
                    </span>)
                  }
                }
              },
            };
          });
          setColumnsMonth(column_map); */
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  }, [df, fromdate, todate, in_nhanh]);
  const initFunction = useCallback(async () => {
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
      getcustomerlist(),
      handleGetDailyClosing(),
      handleGetWeeklyClosing(),
      handleGetMonthlyClosing(),
      handleGetYearlyClosing(),
      loadDailyClosing(),
      loadWeeklyClosing(),
      handleGetDailyOverdue(),
      handleGetWeeklyOverdue(),
      handleGetMonthlyOverdue(),
      handleGetYearlyOverdue(),
      loadPoOverWeek(),
      loadRunningPOBalanceData(),
      handleGetCustomerRevenue(),
      handleGetPICRevenue(),
      handleGetPOBalanceSummary(),
      handleGetFCSTAmount(),
      getCompany() === "CMS"
        ? loadMonthlyRevenueByCustomer()
        : loadMonthlyRevenueByCustomerAndEmpl(),
    ]).then((values) => {
      if (values.length > 0) {
        //danh sach khach hang
        if (values[0].length > 0) {
          setCustomerList(values[0]);
        } else {
          setCustomerList([]);
        }
        //daily closing
        if (values[1].length > 0) {
          setWidgetData_Yesterday(values[1]);
        } else {
          setWidgetData_Yesterday([]);
        }
        //weekly closing
        if (values[2].length > 0) {
          setWidgetData_ThisWeek(values[2]);
        } else {
          setWidgetData_ThisWeek([]);
        }
        //monthly closing
        if (values[3].length > 0) {
          setWidgetData_ThisMonth(values[3]);
        } else {
          setWidgetData_ThisMonth([]);
        }
        //yearly closing
        if (values[4].length > 0) {
          setWidgetData_ThisYear(values[4]);
        } else {
          setWidgetData_ThisYear([]);
        }
        //daily pivot closing
        if (values[5].length > 0) {
          setDailyClosingData(values[5]);
          let keysArray = Object.getOwnPropertyNames(values[5][0]);
          let column_map = keysArray.map((e, index) => {
            return {
              field: e,
              headerName: e,
              width: 100,
              cellRenderer: (ele: any) => {
                //console.log(ele);
                if (["CUST_NAME_KD", "id"].indexOf(e) > -1) {
                  return <span>{ele.data[e]}</span>;
                } else if (e === "DELIVERED_AMOUNT") {
                  return (
                    <span style={{ color: "#050505", fontWeight: "bold" }}>
                      {ele.data[e]?.toLocaleString("en-US", {
                        style: "currency",
                        currency:
                          getGlobalSetting()?.filter(
                            (ele: WEB_SETTING_DATA, index: number) =>
                              ele.ITEM_NAME === "CURRENCY"
                          )[0]?.CURRENT_VALUE ?? "USD",
                      })}
                    </span>
                  );
                } else {
                  if (ele.data["CUST_NAME_KD"] === "TOTAL") {
                    return (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        {ele.data[e]?.toLocaleString("en-US", {
                          style: "currency",
                          currency:
                            getGlobalSetting()?.filter(
                              (ele: WEB_SETTING_DATA, index: number) =>
                                ele.ITEM_NAME === "CURRENCY"
                            )[0]?.CURRENT_VALUE ?? "USD",
                        })}
                      </span>
                    );
                  } else {
                    return (
                      <span style={{ color: "green", fontWeight: "normal" }}>
                        {ele.data[e]?.toLocaleString("en-US", {
                          style: "currency",
                          currency:
                            getGlobalSetting()?.filter(
                              (ele: WEB_SETTING_DATA, index: number) =>
                                ele.ITEM_NAME === "CURRENCY"
                            )[0]?.CURRENT_VALUE ?? "USD",
                        })}
                      </span>
                    );
                  }
                }
              },
            };
          });
          setColumns(column_map);
        } else {
          setDailyClosingData([]);
        }
        //weekly pivot closing
        if (values[6].length > 0) {
          setWeeklyClosingData(values[6]);
          let keysArray = Object.getOwnPropertyNames(values[6][0]);
          let column_map = keysArray.map((e, index) => {
            return {
              field: e,
              header: e,
              width: 100,
              cellRenderer: (ele: any) => {
                //console.log(ele);
                if (["CUST_NAME_KD", "id"].indexOf(e) > -1) {
                  return <span>{ele.data[e]}</span>;
                } else if (e === "TOTAL_AMOUNT") {
                  return (
                    <span style={{ color: "#F633EA", fontWeight: "bold" }}>
                      {ele.data[e]?.toLocaleString("en-US", {
                        style: "currency",
                        currency:
                          getGlobalSetting()?.filter(
                            (ele: WEB_SETTING_DATA, index: number) =>
                              ele.ITEM_NAME === "CURRENCY"
                          )[0]?.CURRENT_VALUE ?? "USD",
                      })}
                    </span>
                  );
                } else if (e === "TOTAL_QTY") {
                  return (
                    <span style={{ color: "#052ee7", fontWeight: "bold" }}>
                      {ele.data[e]?.toLocaleString("en-US", {
                        style: "decimal",
                      })}
                    </span>
                  );
                } else if (e.indexOf("QTY") > -1) {
                  return (
                    <span style={{ color: "#052ee7", fontWeight: "normal" }}>
                      {ele.data[e]?.toLocaleString("en-US", {
                        style: "decimal",
                      })}
                    </span>
                  );
                } else {
                  if (ele.data["CUST_NAME_KD"] === "TOTAL") {
                    return (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        {ele.data[e]?.toLocaleString("en-US", {
                          style: "currency",
                          currency:
                            getGlobalSetting()?.filter(
                              (ele: WEB_SETTING_DATA, index: number) =>
                                ele.ITEM_NAME === "CURRENCY"
                            )[0]?.CURRENT_VALUE ?? "USD",
                        })}
                      </span>
                    );
                  } else {
                    return (
                      <span style={{ color: "green", fontWeight: "normal" }}>
                        {ele.data[e]?.toLocaleString("en-US", {
                          style: "currency",
                          currency:
                            getGlobalSetting()?.filter(
                              (ele: WEB_SETTING_DATA, index: number) =>
                                ele.ITEM_NAME === "CURRENCY"
                            )[0]?.CURRENT_VALUE ?? "USD",
                        })}
                      </span>
                    );
                  }
                }
              },
            };
          });
          setColumnsWeek(column_map);
        } else {
          setWeeklyClosingData([]);
        }
        //monthly pivot closing
        if (values[17].length > 0) {
          if (getCompany() === "PVN") {
            if (values[17].length > 0) {
              setMonthlyvRevenuebyCustomer(values[17]);
              let keysArray = Object.getOwnPropertyNames(values[17][0]);
              let column_map = keysArray.map((e, index) => {
                return {
                  field: e,
                  headerName: e,
                  width: 100,
                  cellRenderer: (ele: any) => {
                    //console.log(ele);
                    if (["CUST_NAME_KD", "id"].indexOf(e) > -1) {
                      return <span>{ele.data[e]}</span>;
                    } else if (e === "TOTAL_AMOUNT") {
                      return (
                        <span style={{ color: "#F633EA", fontWeight: "bold" }}>
                          {ele.data[e]?.toLocaleString("en-US", {
                            style: "currency",
                            currency:
                              getGlobalSetting()?.filter(
                                (ele: WEB_SETTING_DATA, index: number) =>
                                  ele.ITEM_NAME === "CURRENCY"
                              )[0]?.CURRENT_VALUE ?? "USD",
                          })}
                        </span>
                      );
                    } else if (e === "TOTAL_QTY") {
                      return (
                        <span style={{ color: "#052ee7", fontWeight: "bold" }}>
                          {ele.data[e]?.toLocaleString("en-US", {
                            style: "decimal",
                          })}
                        </span>
                      );
                    } else if (e.indexOf("QTY") > -1) {
                      return (
                        <span
                          style={{ color: "#052ee7", fontWeight: "normal" }}
                        >
                          {ele.data[e]?.toLocaleString("en-US", {
                            style: "decimal",
                          })}
                        </span>
                      );
                    } else {
                      if (ele.data["CUST_NAME_KD"] === "TOTAL") {
                        return (
                          <span style={{ color: "green", fontWeight: "bold" }}>
                            {ele.data[e]?.toLocaleString("en-US", {
                              style: "currency",
                              currency:
                                getGlobalSetting()?.filter(
                                  (ele: WEB_SETTING_DATA, index: number) =>
                                    ele.ITEM_NAME === "CURRENCY"
                                )[0]?.CURRENT_VALUE ?? "USD",
                            })}
                          </span>
                        );
                      } else {
                        return (
                          <span
                            style={{ color: "green", fontWeight: "normal" }}
                          >
                            {ele.data[e]?.toLocaleString("en-US", {
                              style: "currency",
                              currency:
                                getGlobalSetting()?.filter(
                                  (ele: WEB_SETTING_DATA, index: number) =>
                                    ele.ITEM_NAME === "CURRENCY"
                                )[0]?.CURRENT_VALUE ?? "USD",
                            })}
                          </span>
                        );
                      }
                    }
                  },
                };
              });
              setColumnsMonth(column_map);
            } else {
              setMonthlyvRevenuebyCustomer([]);
            }
          } else {
            setMonthlyvRevenuebyCustomer(values[17]);
            let keysArray = Object.getOwnPropertyNames(values[17][0]);
            let column_map = keysArray.map((e, index) => {
              return {
                field: e,
                headerName: e,
                width: 100,
                cellRenderer: (ele: any) => {
                  //console.log(ele);
                  if (["CUST_NAME_KD", "id"].indexOf(e) > -1) {
                    return <span>{ele.data[e]}</span>;
                  } else if (e === "TOTAL_AMOUNT") {
                    return (
                      <span style={{ color: "#F633EA", fontWeight: "bold" }}>
                        {ele.data[e]?.toLocaleString("en-US", {
                          style: "currency",
                          currency:
                            getGlobalSetting()?.filter(
                              (ele: WEB_SETTING_DATA, index: number) =>
                                ele.ITEM_NAME === "CURRENCY"
                            )[0]?.CURRENT_VALUE ?? "USD",
                        })}
                      </span>
                    );
                  } else if (e === "TOTAL_QTY") {
                    return (
                      <span style={{ color: "#052ee7", fontWeight: "bold" }}>
                        {ele.data[e]?.toLocaleString("en-US", {
                          style: "decimal",
                        })}
                      </span>
                    );
                  } else if (e.indexOf("QTY") > -1) {
                    return (
                      <span style={{ color: "#052ee7", fontWeight: "normal" }}>
                        {ele.data[e]?.toLocaleString("en-US", {
                          style: "decimal",
                        })}
                      </span>
                    );
                  } else {
                    if (ele.data["CUST_NAME_KD"] === "TOTAL") {
                      return (
                        <span style={{ color: "green", fontWeight: "bold" }}>
                          {ele.data[e]?.toLocaleString("en-US", {
                            style: "currency",
                            currency:
                              getGlobalSetting()?.filter(
                                (ele: WEB_SETTING_DATA, index: number) =>
                                  ele.ITEM_NAME === "CURRENCY"
                              )[0]?.CURRENT_VALUE ?? "USD",
                          })}
                        </span>
                      );
                    } else {
                      return (
                        <span style={{ color: "green", fontWeight: "normal" }}>
                          {ele.data[e]?.toLocaleString("en-US", {
                            style: "currency",
                            currency:
                              getGlobalSetting()?.filter(
                                (ele: WEB_SETTING_DATA, index: number) =>
                                  ele.ITEM_NAME === "CURRENCY"
                              )[0]?.CURRENT_VALUE ?? "USD",
                          })}
                        </span>
                      );
                    }
                  }
                },
              };
            });
            setColumnsMonth(column_map);
          }
        }
        //daily overdue
        if (values[7].length > 0) {
          setDailyOverdueData(values[7]);
        } else {
          setDailyOverdueData([]);
        }
        //weekly overdue
        if (values[8].length > 0) {
          setweeklyOverdueData(values[8]);
        } else {
          setweeklyOverdueData([]);
        }
        //monthly overdue
        if (values[9].length > 0) {
          setmonthyOverdueData(values[9]);
        } else {
          setmonthyOverdueData([]);
        }
        //yearly overdue
        if (values[10].length > 0) {
          setyearlyOverdueData(values[10]);
        } else {
          setyearlyOverdueData([]);
        }
        //po over week trending
        if (values[11].length > 0) {
          setWeekLyPOData(values[11]);
        } else {
          setWeekLyPOData([]);
        }
        //running po balance data
        if (values[12].length > 0) {
          setRunningPOBalanceData(values[12]);
        } else {
          setRunningPOBalanceData([]);
        }
        //revenue by customer top 5
        if (values[13].length > 0) {
          setCustomerRevenue(values[13]);
        } else {
          setCustomerRevenue([]);
        }
        //pic revenue
        if (values[14].length > 0) {
          setPICRevenue(values[14]);
        } else {
          setPICRevenue([]);
        }
        //po balance summary
        if (values[15].length > 0) {
          setWidgetData_PoBalanceSummary({
            po_balance_qty: values[15][0].PO_BALANCE,
            po_balance_amount: values[15][0].BALANCE_AMOUNT,
          });
        } else {
          setWidgetData_PoBalanceSummary({
            po_balance_qty: 0,
            po_balance_amount: 0,
          });
        }
        //fcst widget data
        if (values[16].length > 0) {
          setWidgetData_FcstAmount(values[16][0]);
        } else {
        }
      }
      Swal.close();
    });
  }, [df, fromdate, todate, in_nhanh]);
  useEffect(() => {
    initFunction();
  }, []);
  return (
    <div className="kinhdoanhreport">
      <div className="filterform">
        <label>
          <b>From Date:</b>
          <input
            type="date"
            value={fromdate.slice(0, 10)}
            onChange={(e) => setFromDate(e.target.value)}
          ></input>
        </label>
        <label>
          <b>To Date:</b>{" "}
          <input
            type="date"
            value={todate.slice(0, 10)}
            onChange={(e) => setToDate(e.target.value)}
          ></input>
        </label>
        <label>
          <b>Default:</b>{" "}
          <Checkbox
            checked={df}
            onChange={(e) => {
              console.log(e.target.checked);
              setDF(e.target.checked);
            }}
            inputProps={{ "aria-label": "controlled" }}
          />
        </label>
        {getCompany() === "PVN" && <label>
          <b>In nhanh:</b>{" "}
          <Checkbox
            checked={in_nhanh}
            onChange={(e) => {              
              setInNhanh(e.target.checked);
            }}
            inputProps={{ "aria-label": "controlled" }}
          />
        </label>}
        <button
          className="searchbutton"
          onClick={() => {
            initFunction();
          }}
        >
          Search
        </button>
      </div>
      <div className="doanhthureport">
        <span className="section_title">1. Summary</span>
        <div className="revenuewidget">
          <div className="revenuwdg">
            <Widget
              widgettype="revenue"
              label="Yesterday"
              topColor="#b3c6ff"
              botColor="#b3ecff"
              qty={
                widgetdata_yesterday[widgetdata_yesterday.length - 2]
                  ?.DELIVERY_QTY
              }
              amount={
                widgetdata_yesterday[widgetdata_yesterday.length - 2]
                  ?.DELIVERED_AMOUNT
              }
              percentage={
                ((widgetdata_yesterday[widgetdata_yesterday.length - 2]
                  ?.DELIVERED_AMOUNT *
                  1.0) /
                  widgetdata_yesterday[widgetdata_yesterday.length - 3]
                    ?.DELIVERED_AMOUNT -
                  1) *
                100
              }
            />
          </div>
          <div className="revenuwdg">
            <Widget
              widgettype="revenue"
              label="This week"
              topColor="#ccffcc"
              botColor="#80ff80"
              qty={
                widgetdata_thisweek[widgetdata_thisweek.length - 1]
                  ?.DELIVERY_QTY
              }
              amount={
                widgetdata_thisweek[widgetdata_thisweek.length - 1]
                  ?.DELIVERED_AMOUNT
              }
              percentage={
                ((widgetdata_thisweek[widgetdata_thisweek.length - 1]
                  ?.DELIVERED_AMOUNT *
                  1.0) /
                  widgetdata_thisweek[widgetdata_thisweek.length - 2]
                    ?.DELIVERED_AMOUNT -
                  1) *
                100
              }
            />
          </div>
          <div className="revenuwdg">
            <Widget
              widgettype="revenue"
              label="This month"
              topColor="#fff2e6"
              botColor="#ffbf80"
              qty={
                widgetdata_thismonth[widgetdata_thismonth.length - 1]
                  ?.DELIVERY_QTY
              }
              amount={
                widgetdata_thismonth[widgetdata_thismonth.length - 1]
                  ?.DELIVERED_AMOUNT
              }
              percentage={
                ((widgetdata_thismonth[widgetdata_thismonth.length - 1]
                  ?.DELIVERED_AMOUNT *
                  1.0) /
                  widgetdata_thismonth[widgetdata_thismonth.length - 2]
                    ?.DELIVERED_AMOUNT -
                  1) *
                100
              }
            />
          </div>
          <div className="revenuwdg">
            <Widget
              widgettype="revenue"
              label="This year"
              topColor="#ffe6e6"
              botColor="#ffb3b3"
              qty={
                widgetdata_thisyear[widgetdata_thisyear.length - 1]
                  ?.DELIVERY_QTY
              }
              amount={
                widgetdata_thisyear[widgetdata_thisyear.length - 1]
                  ?.DELIVERED_AMOUNT
              }
              percentage={
                ((widgetdata_thisyear[widgetdata_thisyear.length - 1]
                  ?.DELIVERED_AMOUNT *
                  1.0) /
                  widgetdata_thisyear[widgetdata_thisyear.length - 2]
                    ?.DELIVERED_AMOUNT -
                  1) *
                100
              }
            />
          </div>
        </div>
        <br></br>
        <hr></hr>
        <div className="graph">
          <span className="section_title">2. Closing</span>
          <div className="dailygraphtotal">
            <div className="dailygraph">
              <span className="subsection">
                Daily Closing{" "}
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(widgetdata_yesterday, "DailyClosing");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  Excel
                </IconButton>
              </span>
              <ChartDaily data={widgetdata_yesterday} />
            </div>
            <div className="dailygraph">
              <span className="subsection">
                Weekly Closing{" "}
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(widgetdata_thisweek, "WeeklyClosing");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  Excel
                </IconButton>
              </span>
              <ChartWeekLy data={widgetdata_thisweek} />
            </div>
          </div>
          <div className="monthlyweeklygraph">
            <div className="dailygraph">
              <span className="subsection">
                Monthly Closing{" "}
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(widgetdata_thismonth, "MonthlyClosing");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  Excel
                </IconButton>
              </span>
              <ChartMonthLy data={widgetdata_thismonth} />
            </div>
            <div className="dailygraph">
              <span className="subsection">
                Yearly Closing{" "}
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(widgetdata_thisyear, "YearlyClosing");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  Excel
                </IconButton>
              </span>
              <ChartYearly data={widgetdata_thisyear} />
            </div>
          </div>
          <div className="monthlyweeklygraph">
            <div className="dailygraph">
              <span className="subsection">
                TOP 5 Customer Weekly Revenue{" "}
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(customerRevenue, "Customer Revenue");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  Excel
                </IconButton>
              </span>
              <ChartCustomerRevenue data={customerRevenue} />
            </div>
            <div className="dailygraph">
              <span className="subsection">
                PIC Weekly Revenue{" "}
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(picRevenue, "PIC Revenue");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  Excel
                </IconButton>
              </span>
              <ChartPICRevenue data={picRevenue} />
            </div>
          </div>
          <div className="monthlyweeklygraph">
            <div className="dailygraph">
              <span className="subsection">
                Customer Daily Closing{" "}
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(dailyClosingData, "CustomerDailyClosing");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  Excel
                </IconButton>
              </span>
              <CustomerDailyClosing data={dailyClosingData} columns={columns} />
            </div>
            <div className="dailygraph">
              <span className="subsection">
                Customer Weekly Closing{" "}
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(weeklyClosingData, "CustomerWeeklyClosing");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  Excel
                </IconButton>
              </span>
              <CustomerWeeklyClosing
                data={weeklyClosingData}
                columns={columnsweek}
              />
            </div>
          </div>
          <div className="monthlyweeklygraph">
            <div className="dailygraph">
              <span className="subsection">
                Customer Monthly Closing{" "}
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(
                      monthlyvRevenuebyCustomer,
                      "CustomerMonthlyClosing"
                    );
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  Excel
                </IconButton>
              </span>
              <CustomerMonthlyClosing
                data={monthlyvRevenuebyCustomer}
                columns={columnsmonth}
              />
            </div>
          </div>
          <div className="monthlyweeklygraph">
            <div className="dailygraph">
              <span className="subsection">
                Daily Overdue
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(dailyOverdueData, "dailyOverdueData");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  Excel
                </IconButton>
              </span>
              <KDDailyOverdue
                processColor="#53eb34"
                materialColor="#ff0000"
                dldata={[...dailyOverdueData].reverse()}
              ></KDDailyOverdue>
            </div>
            <div className="dailygraph">
              <span className="subsection">
                Weekly Overdue
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(weeklyOverdueData, "weeklyOverdueData");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  Excel
                </IconButton>
              </span>
              <KDWeeklyOverdue
                processColor="#53eb34"
                materialColor="#ff0000"
                dldata={[...weeklyOverdueData].reverse()}
              ></KDWeeklyOverdue>
            </div>
            <div className="dailygraph">
              <span className="subsection">
                Monthly Overdue
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(monthlyOverdueData, "monthlyOverdueData");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  Excel
                </IconButton>
              </span>
              <KDMonthlyOverdue
                processColor="#53eb34"
                materialColor="#ff0000"
                dldata={[...monthlyOverdueData].reverse()}
              ></KDMonthlyOverdue>
            </div>
            <div className="dailygraph">
              <span className="subsection">
                Yearly Overdue
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(yearlyOverdueData, "yearlyOverdueData");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  Excel
                </IconButton>
              </span>
              <KDYearlyOverdue
                processColor="#53eb34"
                materialColor="#ff0000"
                dldata={[...yearlyOverdueData].reverse()}
              ></KDYearlyOverdue>
            </div>
          </div>
          <br></br>
          <hr></hr>
          <span className="section_title">3. Purchase Order (PO)</span>
          <br></br>
          <div className="pobalancesummary">
            <span className="subsection">PO Balance info</span>
            <Widget
              widgettype="revenue"
              label="PO BALANCE INFOMATION"
              topColor="#ccff33"
              botColor="#99ccff"
              qty={widgetdata_pobalancesummary.po_balance_qty * 1}
              amount={widgetdata_pobalancesummary.po_balance_amount}
              percentage={20}
            />
          </div>
          <div className="monthlyweeklygraph">
            <div className="dailygraph">
              <span className="subsection">
                PO By Week{" "}
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(runningPOData, "WeeklyPO");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  Excel
                </IconButton>
              </span>
              <ChartWeeklyPO data={runningPOData} />
            </div>
            <div className="dailygraph">
              <span className="subsection">
                Delivery By Week{" "}
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(widgetdata_thisweek, "WeeklyClosing");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  Excel
                </IconButton>
              </span>
              <ChartWeekLy data={widgetdata_thisweek} />
            </div>
          </div>
          <div className="monthlyweeklygraph">
            <div className="dailygraph">
              <span className="subsection">
                PO Balance Trending (By Week){" "}
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(runningPOBalanceData, "RunningPOBalance");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  Excel
                </IconButton>
              </span>
              <ChartPOBalance data={runningPOBalanceData} />
            </div>
          </div>
          <div className="datatable">
            <div className="dailygraph">
              <span className="subsection">
                Customer PO Balance By Product Type
              </span>
              <CustomerPobalancebyTypeNew />
            </div>
          </div>
          <br></br>
          <hr></hr>
          <span className="section_title">4. Forecast</span>
          <br></br>
          <div className="fcstsummary">
            <span className="subsection">
              FCST Amount (FCST W{widgetdata_fcstAmount.FCSTWEEKNO})
            </span>
            <div className="fcstwidget">
              <div className="fcstwidget1">
                <Widget
                  widgettype="revenue"
                  label="FCST AMOUNT(4 WEEK)"
                  topColor="#eb99ff"
                  botColor="#99ccff"
                  qty={widgetdata_fcstAmount.FCST4W_QTY * 1}
                  amount={widgetdata_fcstAmount.FCST4W_AMOUNT}
                  percentage={0}
                />
              </div>
              <div className="fcstwidget1">
                <Widget
                  widgettype="revenue"
                  label="FCST AMOUNT(8 WEEK)"
                  topColor="#e6e600"
                  botColor="#ff99c2"
                  qty={widgetdata_fcstAmount.FCST8W_QTY * 1}
                  amount={widgetdata_fcstAmount.FCST8W_AMOUNT}
                  percentage={0}
                />
              </div>
            </div>
          </div>
          <div className="monthlyweeklygraph">
            <div className="dailygraph">
              <span className="subsection">
                SamSung ForeCast (So sánh FCST 2 tuần liền kề)
              </span>
              <ChartFCSTSamSung />
            </div>
          </div>
        </div>
      </div>
      <div className="poreport"></div>
    </div>
  );
};
export default KinhDoanhReport;
