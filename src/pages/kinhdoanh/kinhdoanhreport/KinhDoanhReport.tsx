import moment from "moment";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, getGlobalSetting } from "../../../api/Api";
import ChartWeekLy from "../../../components/Chart/Chart";
import ChartMonthLy from "../../../components/Chart/Chart5";
import ChartYearly from "../../../components/Chart/Chart6";
import ChartCustomerRevenue from "../../../components/Chart/ChartCustomerRevenue";
import ChartFCSTSamSung from "../../../components/Chart/ChartFCSTSamSung";
import ChartPICRevenue from "../../../components/Chart/ChartPICRevenue";
import ChartWeeklyPO from "../../../components/Chart/ChartWeekLyPO";
import Widget from "../../../components/Widget/Widget";
import "./KinhDoanhReport.scss";
import ChartDaily from "../../../components/Chart/Chart2";
import ChartPOBalance from "../../../components/Chart/Chart4";
import CustomerDailyClosing from "../../../components/DataTable/CustomerDailyClosing";
import CustomerWeeklyClosing from "../../../components/DataTable/CustomerWeeklyClosing";
import CustomerPobalancebyTypeNew from "../../../components/DataTable/CustomerPoBalanceByTypeNew";
import { CUSTOMER_REVENUE_DATA, CustomerListData, MonthlyClosingData, PIC_REVENUE_DATA, RunningPOData, WEB_SETTING_DATA, WeekLyPOData, WeeklyClosingData } from "../../../api/GlobalInterface";
import { Checkbox } from "@mui/material";

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
  const [df, setDF] = useState(true);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [widgetdata_yesterday, setWidgetData_Yesterday] = useState<DailyClosingData[]>([]);
  const [widgetdata_thisweek, setWidgetData_ThisWeek] = useState<WeeklyClosingData[]>([]);
  const [widgetdata_thismonth, setWidgetData_ThisMonth] = useState<MonthlyClosingData[]>([]);
  const [widgetdata_thisyear, setWidgetData_ThisYear] = useState<YearlyClosingData[]>([]);
  const [customerRevenue, setCustomerRevenue] = useState<CUSTOMER_REVENUE_DATA[]>([]);
  const [picRevenue, setPICRevenue] = useState<PIC_REVENUE_DATA[]>([]);

  const [dailyClosingData, setDailyClosingData] = useState<any>([]);
  const [columns, setColumns] = useState<Array<any>>([]);

  const [weeklyClosingData, setWeeklyClosingData] = useState<any>([]);
  const [columnsweek, setColumnsWeek] = useState<Array<any>>([]);

  const [runningPOData, setWeekLyPOData] = useState<Array<WeekLyPOData>>([]);
  const [runningPOBalanceData, setRunningPOBalanceData] = useState<Array<RunningPOData>>([]);


  const [widgetdata_pobalancesummary, setWidgetData_PoBalanceSummary] = useState<WidgetData_POBalanceSummary>({
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
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [selectedCustomerList, setSelectedCustomerList] = useState<CustomerListData[]>([]);
  const handleGetFCSTAmount = async () => {
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
    generalQuery("fcstamount", { FCSTYEAR: fcstyear2, FCSTWEEKNO: fcstweek2 })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: FCSTAmountData[] = response.data.data.map(
            (element: FCSTAmountData, index: number) => {
              return {
                ...element,
              };
            },
          );
          setWidgetData_FcstAmount(loadeddata[0]);
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
                  },
                );
                setWidgetData_FcstAmount(loadeddata[0]);
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
  };
  const handleGetDailyClosing = () => {
    let yesterday = moment().add(0, "day").format("YYYY-MM-DD");
    let yesterday2 = moment().add(-12, "day").format("YYYY-MM-DD");
    generalQuery("kd_dailyclosing", {
      START_DATE: df? yesterday2 : fromdate,
      END_DATE: df? yesterday: todate,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: DailyClosingData[] = response.data.data.map(
            (element: DailyClosingData, index: number) => {
              return {
                ...element,
                DELIVERY_DATE: element.DELIVERY_DATE.slice(0, 10),
              };
            },
          );          
          setWidgetData_Yesterday(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleGetWeeklyClosing = () => {
    let yesterday = moment().add(0, "day").format("YYYY-MM-DD");
    let yesterday2 = moment().add(-56, "day").format("YYYY-MM-DD");    
    generalQuery("kd_weeklyclosing", {
      START_DATE: df? yesterday2 : fromdate,
      END_DATE: df? yesterday: todate,
     })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: WeeklyClosingData[] = response.data.data.map(
            (element: WeeklyClosingData, index: number) => {
              return {
                ...element,
              };
            },
          );
          setWidgetData_ThisWeek(loadeddata.reverse());
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleGetMonthlyClosing = () => {
    let yesterday = moment().add(0, "day").format("YYYY-MM-DD");
    let yesterday2 = moment().add(-365, "day").format("YYYY-MM-DD");  
    generalQuery("kd_monthlyclosing", {
      START_DATE: df? yesterday2 : fromdate,
      END_DATE: df? yesterday: todate,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: MonthlyClosingData[] = response.data.data.map(
            (element: MonthlyClosingData, index: number) => {
              return {
                ...element,
              };
            },
          );
          setWidgetData_ThisMonth(loadeddata.reverse());
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleGetYearlyClosing = () => {
    let yesterday = moment().add(0, "day").format("YYYY-MM-DD");
    let yesterday2 = "2020-01-01"; 
    generalQuery("kd_annuallyclosing", {
      START_DATE: df? yesterday2 : fromdate,
      END_DATE: df? yesterday: todate,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: YearlyClosingData[] = response.data.data.map(
            (element: YearlyClosingData, index: number) => {
              return {
                ...element,
              };
            },
          );
          setWidgetData_ThisYear(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleGetPOBalanceSummary = () => {
    generalQuery("traPOSummaryTotal", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: POBalanceSummaryData[] = response.data.data.map(
            (element: POBalanceSummaryData, index: number) => {
              return {
                ...element,
              };
            },
          );
          setWidgetData_PoBalanceSummary({
            po_balance_qty: loadeddata[0].PO_BALANCE,
            po_balance_amount: loadeddata[0].BALANCE_AMOUNT,
          });
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
  };
  const handleGetCustomerRevenue = () => {
    let sunday = moment().clone().weekday(0).format("YYYY-MM-DD");
    let monday = moment().clone().weekday(6).format("YYYY-MM-DD");
    generalQuery("customerRevenue", { 
      START_DATE: df? sunday : fromdate,
      END_DATE: df? monday: todate,      
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
          //console.log(loadeddata);
          setCustomerRevenue(loadeddata);
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
            START_DATE: df? sunday : fromdate,
            END_DATE: df? monday: todate, 
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
                //console.log(loadeddata);
                setCustomerRevenue(loadeddata);
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
  };
  const handleGetPICRevenue = () => {
    let sunday = moment().clone().weekday(0).format("YYYY-MM-DD");
    let monday = moment().clone().weekday(6).format("YYYY-MM-DD");
    generalQuery("PICRevenue", { 
      START_DATE: df? sunday : fromdate,
      END_DATE: df? monday: todate, 
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

          setPICRevenue(loadeddata);
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
            START_DATE: df? sunday : fromdate,
            END_DATE: df? monday: todate, 
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

                setPICRevenue(loadeddata);
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
  };
  const getcustomerlist = () => {
    generalQuery("selectcustomerList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setCustomerList(response.data.data);
        } else {
          setCustomerList([]);
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  const loadDailyClosing = () => {
    generalQuery("getDailyClosingKD", {
      FROM_DATE: df ? moment.utc().format('YYYY-MM-01'):fromdate,
      TO_DATE: df ? moment.utc().format('YYYY-MM-DD'): todate
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loadeddata =
            response.data.data.map(
              (element: any, index: number) => {
                return {
                  ...element,
                  id: index
                };
              },
            );
          setDailyClosingData(loadeddata);
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
          setColumns(column_map);
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          const lastmonth = moment().subtract(1, 'months');
          generalQuery("getDailyClosingKD", {            
            FROM_DATE: df ? lastmonth.startOf('month').format('YYYY-MM-DD'):fromdate,
            TO_DATE: df ? lastmonth.endOf('month').format('YYYY-MM-DD'): todate
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                let loadeddata =
                  response.data.data.map(
                    (element: any, index: number) => {
                      return {
                        ...element,
                        id: index
                      };
                    },
                  );
                setDailyClosingData(loadeddata);
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
                setColumns(column_map);
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
  }
  const loadWeeklyClosing = () => {    
    generalQuery("getWeeklyClosingKD", {
      FROM_DATE: df ? moment.utc().format('YYYY-MM-01'):fromdate,
      TO_DATE: df ? moment.utc().format('YYYY-MM-DD'): todate
    })
      .then((response) => {
        //console.log(response);
        if (response.data.tk_status !== "NG") {
          if (response.data.data.length > 0) {
            let loadeddata =
              response.data.data.map(
                (element: any, index: number) => {
                  return {
                    ...element,
                    id: index
                  };
                },
              );
            setWeeklyClosingData(loadeddata);
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
                        currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                      })}
                    </span>
                  }
                  else {
                    if (ele.data['CUST_NAME_KD'] === 'TOTAL') {
                      return (<span style={{ color: "green", fontWeight: "bold" }}>
                        {ele.data[e]?.toLocaleString("en-US", {
                          style: "currency",
                          currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                        })}
                      </span>)
                    }
                    else {
                      return (<span style={{ color: "green", fontWeight: "normal" }}>
                        {ele.data[e]?.toLocaleString("en-US", {
                          style: "currency",
                          currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                        })}
                      </span>)
                    }
                  }
                },
              };
            });
            setColumnsWeek(column_map);
          }
          else {
            const lastmonth = moment().subtract(1, 'months');
            generalQuery("getWeeklyClosingKD", {
              FROM_DATE: df ? lastmonth.startOf('month').format('YYYY-MM-DD'):fromdate,
              TO_DATE: df ? lastmonth.endOf('month').format('YYYY-MM-DD'): todate
            })
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  let loadeddata =
                    response.data.data.map(
                      (element: any, index: number) => {
                        return {
                          ...element,
                          id: index
                        };
                      },
                    );
                  setWeeklyClosingData(loadeddata);
                  let keysArray = Object.getOwnPropertyNames(loadeddata[0] ?? []);
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
                              currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                            })}
                          </span>
                        }
                        else {
                          if (ele.data['CUST_NAME_KD'] === 'TOTAL') {
                            return (<span style={{ color: "green", fontWeight: "bold" }}>
                              {ele.data[e]?.toLocaleString("en-US", {
                                style: "currency",
                                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                              })}
                            </span>)
                          }
                          else {
                            return (<span style={{ color: "green", fontWeight: "normal" }}>
                              {ele.data[e]?.toLocaleString("en-US", {
                                style: "currency",
                                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                              })}
                            </span>)
                          }
                        }
                      },
                    };
                  });
                  setColumnsWeek(column_map);
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
          const lastmonth = moment().subtract(1, 'months');
          generalQuery("getWeeklyClosingKD", {
            FROM_DATE: lastmonth.startOf('month').format('YYYY-MM-DD'),
            TO_DATE: lastmonth.endOf('month').format('YYYY-MM-DD')
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                let loadeddata =
                  response.data.data.map(
                    (element: any, index: number) => {
                      return {
                        ...element,
                        id: index
                      };
                    },
                  );
                setDailyClosingData(loadeddata);
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
                            currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                          })}
                        </span>
                      }
                      else {
                        if (ele.data['CUST_NAME_KD'] === 'TOTAL') {
                          return (<span style={{ color: "green", fontWeight: "bold" }}>
                            {ele.data[e]?.toLocaleString("en-US", {
                              style: "currency",
                              currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                            })}
                          </span>)
                        }
                        else {
                          return (<span style={{ color: "green", fontWeight: "normal" }}>
                            {ele.data[e]?.toLocaleString("en-US", {
                              style: "currency",
                              currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                            })}
                          </span>)
                        }
                      }
                    },
                  };
                });
                setColumns(column_map);
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
  }
  const loadPoOverWeek = () => {
    generalQuery("kd_pooverweek", { 
      FROM_DATE: df ? moment().add(-70, "day").format("YYYY-MM-DD"):fromdate,
      TO_DATE: df ? moment.utc().format('YYYY-MM-DD'): todate
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
          setWeekLyPOData(loadeddata.reverse());
          //console.log(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadRunningPOBalanceData = () => {
    generalQuery("kd_runningpobalance", {       
      TO_DATE: df ?  moment().format("YYYY-MM-DD"): todate
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
          setRunningPOBalanceData(loadeddata.splice(0,10).reverse());          
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const initFunction = () => {
    getcustomerlist();
    handleGetDailyClosing();    
    handleGetWeeklyClosing();    
    handleGetMonthlyClosing();
    handleGetYearlyClosing();
    loadDailyClosing();
    loadWeeklyClosing();
    loadPoOverWeek();
    loadRunningPOBalanceData();
    handleGetCustomerRevenue();
    handleGetPICRevenue();
    handleGetPOBalanceSummary();
    handleGetFCSTAmount();
  }
  useEffect(() => {
    initFunction();
  }, []);
  return (
    <div className="kinhdoanhreport">
      <div className='filterform'>
        <label>
          <b>From Date:</b>
          <input
            type='date'
            value={fromdate.slice(0, 10)}
            onChange={(e) => setFromDate(e.target.value)}
          ></input>
        </label>
        <label>
          <b>To Date:</b>{" "}
          <input
            type='date'
            value={todate.slice(0, 10)}
            onChange={(e) => setToDate(e.target.value)}
          ></input>
        </label>
        <label>
        <b>Default:</b>{" "}
        <Checkbox
          checked={df}          
          onChange={(e) => {
            //console.log(e.target.checked);
            setDF(e.target.checked);
          }}
          inputProps={{ "aria-label": "controlled" }}
        />
        </label>        
        <button
          className='searchbutton'
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
              qty={widgetdata_yesterday[widgetdata_yesterday.length-1]?.DELIVERY_QTY}
              amount={widgetdata_yesterday[widgetdata_yesterday.length-1]?.DELIVERED_AMOUNT}
              percentage={(1 - widgetdata_yesterday[widgetdata_yesterday.length-2]?.DELIVERED_AMOUNT * 1.0 / widgetdata_yesterday[widgetdata_yesterday.length-3]?.DELIVERED_AMOUNT) * 100}
            />
          </div>
          <div className="revenuwdg">
            <Widget
              widgettype="revenue"
              label="This week"
              topColor="#ccffcc"
              botColor="#80ff80"
              qty={widgetdata_thisweek[widgetdata_thisweek.length-1]?.DELIVERY_QTY}
              amount={widgetdata_thisweek[widgetdata_thisweek.length-1]?.DELIVERED_AMOUNT}
              percentage={(1 - widgetdata_thisweek[widgetdata_thisweek.length-1]?.DELIVERED_AMOUNT * 1.0 / widgetdata_thisweek[widgetdata_thisweek.length-2]?.DELIVERED_AMOUNT) * 100}
            />
          </div>
          <div className="revenuwdg">
            <Widget
              widgettype="revenue"
              label="This month"
              topColor="#fff2e6"
              botColor="#ffbf80"
              qty={widgetdata_thismonth[widgetdata_thismonth.length -1 ]?.DELIVERY_QTY}
              amount={widgetdata_thismonth[widgetdata_thismonth.length - 1]?.DELIVERED_AMOUNT}
              percentage={(1 - widgetdata_thismonth[widgetdata_thismonth.length - 1]?.DELIVERED_AMOUNT * 1.0 / widgetdata_thismonth[widgetdata_thismonth.length - 2]?.DELIVERED_AMOUNT) * 100}
            />
          </div>
          <div className="revenuwdg">
            <Widget
              widgettype="revenue"
              label="This year"
              topColor="#ffe6e6"
              botColor="#ffb3b3"
              qty={widgetdata_thisyear[widgetdata_thisyear.length - 1]?.DELIVERY_QTY}
              amount={widgetdata_thisyear[widgetdata_thisyear.length - 1]?.DELIVERED_AMOUNT}
              percentage={(1 - widgetdata_thismonth[widgetdata_thisyear.length - 1]?.DELIVERED_AMOUNT * 1.0 / widgetdata_thismonth[0]?.DELIVERED_AMOUNT) * 100}
            />
          </div>
        </div>
        <br></br>
        <hr></hr>
        <div className="graph">
          <span className="section_title">2. Closing</span>
          <div className="dailygraphtotal">
            <div className="dailygraph">
              <span className="subsection">Daily Closing</span>
              <ChartDaily data={widgetdata_yesterday}/>
            </div>
            <div className="dailygraph">
              <span className="subsection">Weekly Closing</span>
              <ChartWeekLy data={widgetdata_thisweek}/>
            </div>
          </div>
          <div className="monthlyweeklygraph">
            <div className="dailygraph">
              <span className="subsection">Monthly Closing</span>
              <ChartMonthLy data={widgetdata_thismonth}/>
            </div>
            <div className="dailygraph">
              <span className="subsection">Yearly Closing</span>
              <ChartYearly data={widgetdata_thisyear}/>
            </div>
          </div>
          <div className="monthlyweeklygraph">
            <div className="dailygraph">
              <span className="subsection">TOP 5 Customer Weekly Revenue</span>
              <ChartCustomerRevenue data={customerRevenue}/>
            </div>
            <div className="dailygraph">
              <span className="subsection">PIC Weekly Revenue</span>
              <ChartPICRevenue data={picRevenue}/>
            </div>
          </div>
          <div className="monthlyweeklygraph">
            <div className="dailygraph">
              <span className="subsection">Customer Daily Closing</span>
              <CustomerDailyClosing data={dailyClosingData} columns={columns}/>
            </div>
            <div className="dailygraph">
              <span className="subsection">Customer Weekly Closing</span>
              <CustomerWeeklyClosing  data={weeklyClosingData} columns={columnsweek}/>
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
              <span className="subsection">PO By Week</span>
              <ChartWeeklyPO data={runningPOData}/>
            </div>
            <div className="dailygraph">
              <span className="subsection">Delivery By Week</span>
              <ChartWeekLy data={widgetdata_thisweek}/>
            </div>
          </div>
          <div className="monthlyweeklygraph">
            <div className="dailygraph">
              <span className="subsection">PO Balance Trending (By Week)</span>
              <ChartPOBalance data={runningPOBalanceData}/>
            </div>
          </div>
          <div className="datatable">
            <div className="dailygraph">
              <span className="subsection">
                Customer PO Balance By Product Type
              </span>
              <CustomerPobalancebyTypeNew />
              {/* <CustomerPOBalanceByType /> */}
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
