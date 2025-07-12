import moment from "moment";
import { generalQuery, getCompany } from "../../../api/Api";
import { AUDIT_HISTORY_DATA, DTC_TEST_POINT, TestListTable } from "../interfaces/qcInterface";
import Swal from "sweetalert2";

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