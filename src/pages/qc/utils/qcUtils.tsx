import moment from "moment";
import { generalQuery, getCompany } from "../../../api/Api";
import { AUDIT_HISTORY_DATA, DTC_TEST_POINT, INSPECT_STATUS_DATA, IQC_FAIL_PENDING, IQC_FAILING_TREND_DATA, IQC_TREND_DATA, IQC_VENDOR_NGRATE_DATA, KHKT_DATA, TEMLOTKT_DATA, TestListTable } from "../interfaces/qcInterface";
import Swal from "sweetalert2";
import { LOSS_TIME_DATA_KIEMTRA_THEO_BAN, LOSS_TIME_DATA_KIEMTRA_THEO_NGUOI } from "../inspection/LOSS_TIME_DATA/LOSS_TIME_DATA";
import { QTR_DATA } from "../oqc/QTR_DATA";


  export const f_load_AUDIT_HISTORY_DATA = async (DATA: any) => {
      let kq: AUDIT_HISTORY_DATA[] = [];
      await generalQuery("loadAUDIT_HISTORY_DATA", DATA)
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            let loaded_data: AUDIT_HISTORY_DATA[] = response.data.data.map(
              (element: AUDIT_HISTORY_DATA, index: number) => {
                return {
                  ...element,
                  AUDIT_DATE: moment.utc(element.AUDIT_DATE).format("YYYY-MM-DD"),
                  id: index,
                };
              }
            );
            kq = loaded_data;
          } else {
            kq = [];
          }
        })
        .catch((error) => {});
      return kq;
    };
  export const f_add_AUDIT_HISTORY_DATA = async (DATA: any) => {
      let kq: string = "";
      await generalQuery("add_AUDIT_HISTORY_DATA", DATA)
        .then((response) => {
          if (response.data.tk_status !== "NG") {
          } else {
            kq = response.data.message;
          }
        })
        .catch((error) => {
          console.log(error);
          kq = error.message;
        });
      return kq;
  };
  export const f_update_AUDIT_HISTORY_DATA = async (DATA: any) => {
    let kq: string = "";
    await generalQuery("update_AUDIT_HISTORY_DATA", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
          kq = response.data.message;
        }
      })
      .catch((error) => {
        console.log(error);
        kq = error.message;
      });
    return kq;
  };
  export const f_delete_AUDIT_HISTORY_DATA = async (DATA: any) => {
    let kq: string = "";
    await generalQuery("delete_AUDIT_HISTORY_DATA", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
          kq = response.data.message;
        }
      })
      .catch((error) => {
        console.log(error);
        kq = error.message;
      });
    return kq;
  };
  export const f_updateFileInfo_AUDIT_HISTORY = async (DATA: any) => {
    let kq: string = "";
    await generalQuery("updateFileInfo_AUDIT_HISTORY", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
          kq = response.data.message;
        }
      })
      .catch((error) => {
        console.log(error);
        kq = error.message;
      });
    return kq;
  };
  
  // dtc
  export const f_loadDTC_TestList = async () => {
    let kq: TestListTable[] = [];
    await generalQuery("loadDtcTestList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: TestListTable[] = response.data.data.map(
            (element: TestListTable, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          kq = loadeddata;
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  };

  //create load test point list from test code
  export const f_loadDTC_TestPointList = async (testCode: number) => {
    let kq: DTC_TEST_POINT[] = [];
    await generalQuery("loadDtcTestPointList", {
      TEST_CODE: testCode,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: DTC_TEST_POINT[] = response.data.data.map(
            (element: DTC_TEST_POINT, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          kq = loadeddata;
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  };
  //create add test item
  export const f_addTestItem = async (testCode: number, testName: string) => {
    await generalQuery("addTestItem", {
      TEST_CODE: getCompany() !== "CMS" ? testCode : -1,
      TEST_NAME: testName,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Thêm thành công", "success");
        } else {
          Swal.fire("Thông báo", "Thêm thất bại", "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //create add test point
  export const f_addTestPoint = async (
    testCode: number,
    pointCode: number,
    pointName: string
  ) => {
    await generalQuery("addTestPoint", {
      TEST_CODE: testCode,
      POINT_CODE: pointCode,
      POINT_NAME: pointName,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Thêm thành công", "success");
        } else {
          Swal.fire("Thông báo", "Thêm thất bại", "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  export const f_isM_LOT_NO_in_IN_KHO_SX = async (
    PLAN_ID: string,
    M_LOT_NO: string
  ) => {
    let kq: boolean = false;
    await generalQuery("isM_LOT_NO_in_IN_KHO_SX", {
      PLAN_ID: PLAN_ID,
      M_LOT_NO: M_LOT_NO,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          kq = true;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  };
  export const f_isM_CODE_in_M140_Main = async (
    M_CODE: string,
    G_CODE: string
  ) => {
    let kq: boolean = false;
    await generalQuery("check_m_code_m140_main", {
      M_CODE: M_CODE,
      G_CODE: G_CODE,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          kq = true;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  };

  export const f_isM_LOT_NO_in_O302 = async (
    planId: string,
    m_lot_no: string
  ) => {
    let kq: boolean = false;
    await generalQuery("isM_LOT_NO_in_O302", {
      PLAN_ID: planId,
      M_LOT_NO: m_lot_no,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          kq = true;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  };

  export const f_resetIN_KHO_SX_IQC1 = async (
    PLAN_ID: string,
    M_LOT_NO: string
  ) => {
    let kq: boolean = false;
    await generalQuery("resetKhoSX_IQC1", {
      PLAN_ID: PLAN_ID,
      M_LOT_NO: M_LOT_NO,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          kq = true;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  };
  export const f_resetIN_KHO_SX_IQC2 = async (
    PLAN_ID: string,
    M_LOT_NO: string
  ) => {
    let kq: boolean = false;
    await generalQuery("resetKhoSX_IQC2", {
      PLAN_ID: PLAN_ID,
      M_LOT_NO: M_LOT_NO,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          kq = true;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  };
  
  //update ncr id for holding material
  export const f_updateNCRIDForHolding = async (
    HOLD_ID: number,
    ncrId: number
  ) => {
    await generalQuery("updateNCRIDForHolding", {
      HOLD_ID: HOLD_ID,
      NCR_ID: ncrId,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //Swal.fire("Thông báo", "Cập nhật thành công", "success");
        } else {
          Swal.fire("Thông báo", "Cập nhật thất bại", "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //update ncr id for failing material
  export const f_updateNCRIDForFailing = async (
    FAIL_ID: number,
    ncrId: number
  ) => {
    await generalQuery("updateNCRIDForFailing", {
      FAIL_ID: FAIL_ID,
      NCR_ID: ncrId,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //Swal.fire("Thông báo", "Cập nhật thành công", "success");
        } else {
          Swal.fire("Thông báo", "Cập nhật thất bại", "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  export const f_loadTemLotKTHistory = async (
    FROM_DATE: string,
    TO_DATE: string
  ) => {
    let kq: TEMLOTKT_DATA[] = [];
    await generalQuery("temlotktraHistory", {
      FROM_DATE: FROM_DATE,
      TO_DATE: TO_DATE,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Load data thành công", "success");
          let loaded_data: TEMLOTKT_DATA[] = response.data.data.map(
            (element: TEMLOTKT_DATA, index: number) => {
              return {
                ...element,
                LOT_PRINT_DATE: moment
                  .utc(element.LOT_PRINT_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                EXP_DATE: moment.utc(element.EXP_DATE).format("YYYY-MM-DD"),
                MFT_DATE: moment.utc(element.MFT_DATE).format("YYYY-MM-DD"),
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          //kq = response.data.message;
          Swal.fire("Thông báo", "Không có data", "error");
        }
      })
      .catch((error) => {});
    return kq;
  };
  
  export const f_loadKHKT_ADUNG = async (FROM_DATE: string) => {
    let kq: KHKT_DATA[] = [];
    await generalQuery("khkt_a_dung", {
      FROM_DATE: FROM_DATE,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Load data thành công", "success");
          let loaded_data: KHKT_DATA[] = response.data.data.map(
            (element: KHKT_DATA, index: number) => {
              return {
                ...element,
                PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          //kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;
  };

  export const f_loadInspect_status_G_CODE = async (PLAN_DATE: string) => {
    let kq: INSPECT_STATUS_DATA[] = [];
    await generalQuery("tinh_hinh_kiemtra_G_CODE", {
      PLAN_DATE: PLAN_DATE,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: INSPECT_STATUS_DATA[] = response.data.data.map(
            (element: INSPECT_STATUS_DATA, index: number) => {
              return {
                ...element,
                PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
                FIRST_INPUT_TIME:
                  element.FIRST_INPUT_TIME !== null
                    ? moment
                        .utc(element.FIRST_INPUT_TIME)
                        .format("YYYY-MM-DD HH:mm:ss")
                    : "",
                INS_DATE: moment
                  .utc(element.INS_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                TOTAL_OUTPUT: element.INIT_WH_STOCK + element.OUTPUT_QTY,
                COVER_D1:
                  element.INIT_WH_STOCK + element.OUTPUT_QTY >= element.D1
                    ? "OK"
                    : "NG",
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          //kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;
  };
  
  export const f_loadIQCDailyNGTrend = async(DATA: any) => {
    let kq: IQC_TREND_DATA[] = [];
    await generalQuery("dailyIncomingData", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: IQC_TREND_DATA[] = response.data.data.map(
            (element: IQC_TREND_DATA, index: number) => {
              return {
                ...element,      
                NG_RATE: element.NG_CNT / element.TEST_CNT,      
                INSPECT_DATE: moment.utc(element.INSPECT_DATE).format("YYYY-MM-DD"),    
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          //kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;
  }

  export const f_loadIQCWeeklyTrend = async(DATA:any) => {
    let kq: IQC_TREND_DATA[] = [];
    await generalQuery("weeklyIncomingData", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: IQC_TREND_DATA[] = response.data.data.map(
            (element: IQC_TREND_DATA, index: number) => {
              return {
                ...element,     
                NG_RATE: element.NG_CNT / element.TEST_CNT,               
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          //kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;
  }
  export const f_loadIQCMonthlyTrend = async(DATA:any) => {
    let kq: IQC_TREND_DATA[] = [];
    await generalQuery("monthlyIncomingData", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: IQC_TREND_DATA[] = response.data.data.map(
            (element: IQC_TREND_DATA, index: number) => {
              return {
                ...element,      
                NG_RATE: element.NG_CNT / element.TEST_CNT,              
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          //kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;
  }

  export const f_loadIQCYearlyTrend = async(DATA:any) => {
    let kq: IQC_TREND_DATA[] = [];
    await generalQuery("yearlyIncomingData", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: IQC_TREND_DATA[] = response.data.data.map(
            (element: IQC_TREND_DATA, index: number) => {
              return {
                ...element,      
                NG_RATE: element.NG_CNT / element.TEST_CNT,              
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          //kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;
  }
  

  export const f_loadVendorIncomingNGRateByWeek = async(DATA:any) => {
    let kq: IQC_VENDOR_NGRATE_DATA[] = [];
    await generalQuery("vendorIncommingNGRatebyWeek", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: IQC_VENDOR_NGRATE_DATA[] = response.data.data.map(
            (element: IQC_VENDOR_NGRATE_DATA, index: number) => {
              return {
                ...element,                
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          //kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;
  }
  
  export const f_loadVendorIncomingNGRateByMonth = async(DATA:any) => {
    let kq: IQC_VENDOR_NGRATE_DATA[] = [];
    await generalQuery("vendorIncommingNGRatebyMonth", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: IQC_VENDOR_NGRATE_DATA[] = response.data.data.map(
            (element: IQC_VENDOR_NGRATE_DATA, index: number) => {
              return {
                ...element,                
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          //kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;
  }
  
  export const f_loadIQCFailTrending = async (DATA: any) => {
    let kq: IQC_FAILING_TREND_DATA[] = [];
    await generalQuery("iqcfailtrending", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: IQC_FAILING_TREND_DATA[] = response.data.data.map(
            (element: IQC_FAILING_TREND_DATA, index: number) => {
              return {
                ...element,                
                COMPLETE_RATE: element.CLOSED_QTY / element.TOTAL_QTY,
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          //kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;
  }

  export const f_loadIQCHoldingTrending = async (DATA: any) => {
    let kq: IQC_FAILING_TREND_DATA[] = [];
    await generalQuery("iqcholdingtrending", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: IQC_FAILING_TREND_DATA[] = response.data.data.map(
            (element: IQC_FAILING_TREND_DATA, index: number) => {
              return {
                ...element,       
                COMPLETE_RATE: element.CLOSED_QTY / element.TOTAL_QTY,         
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          //kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;

  }
  
  export const f_loadIQCFailPending = async (DATA: any) => {
    let kq: IQC_FAIL_PENDING[] = [];
    await generalQuery("iqcfailpending", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: IQC_FAIL_PENDING[] = response.data.data.map(
            (element: IQC_FAIL_PENDING, index: number) => {
              return {
                ...element, 
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          //kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;

  }
  
  export const f_loadIQCHoldingPending = async (DATA: any) => {
    let kq: IQC_FAIL_PENDING[] = [];
    await generalQuery("iqcholdingpending", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data: IQC_FAIL_PENDING[] = response.data.data.map(
            (element: IQC_FAIL_PENDING, index: number) => {
              return {
                ...element, 
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          //kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;

  }
  
  export const f_loadLossTimeKiemTraTheoBan = async (DATA: any) => {
    let kq: LOSS_TIME_DATA_KIEMTRA_THEO_BAN[] = [];
    await generalQuery("loadlosstimekiemtratheonguoiban", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {        
          let loaded_data: LOSS_TIME_DATA_KIEMTRA_THEO_BAN[] = response.data.data.map(
            (element: LOSS_TIME_DATA_KIEMTRA_THEO_BAN, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          kq = [];
        }
      })
      .catch((error) => {});
    return kq;
  };
  
  export const f_loadLossTimeKiemTraTheoNguoi = async (DATA: any) => {
    let kq: LOSS_TIME_DATA_KIEMTRA_THEO_NGUOI[] = [];
    await generalQuery("loadlosstimekiemtratheonguoi", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {        
          let loaded_data: LOSS_TIME_DATA_KIEMTRA_THEO_NGUOI[] = response.data.data.map(
            (element: LOSS_TIME_DATA_KIEMTRA_THEO_NGUOI, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          kq = [];
        }
      })
      .catch((error) => {});
    return kq;
  };
  
  export const f_loadQTRData = async (DATA: any) => {
    let kq: QTR_DATA[] = [];
    await generalQuery("loadQTRData", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {        
          let loaded_data: QTR_DATA[] = response.data.data.map(
            (element: QTR_DATA, index: number) => {
              return {
                ...element,
                REGISTERED_DATE: moment(element.REGISTERED_DATE).format("YYYY-MM-DD"),
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          kq = [];
        }
      })
      .catch((error) => {});
    return kq;
  };

  export const f_insertPhanLoaiBanKiemTraAuto = async (DATA: any) => {
    let kq: any = [];
    await generalQuery("autoInsertPhanLoaiBanKiemTra", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {        
          let loaded_data: any[] = response.data.data.map(
            (element: any, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          kq = loaded_data;
        } else {
          kq = [];
        }
      })
      .catch((error) => {});
    return kq;
  };

  export const f_updateKPIBanKiemTra = (DATA:any) => {
    let kq: boolean = false;
    generalQuery("updateKPIBanKiemTra", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {        
            kq = true;
        } else {
          kq = false;
        }
      })
      .catch((error) => {});
    return kq;
  }

    export const f_updateTrueDiemKiemTra = (DATA:any) => {
    let kq: boolean = false;
    generalQuery("updateTruDiemKiemTra", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {        
            kq = true;
        } else {
          kq = false;
        }
      })
      .catch((error) => {});
    return kq;
  }