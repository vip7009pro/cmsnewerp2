import moment from "moment";
import { generalQuery, getUserData } from "../../../api/Api";
import {
  EmployeeTableData,
  MainDeptTableData,
  SubDeptTableData,
  WORK_POSITION_DATA,
} from "../interfaces/nhansuInterface";

export const employeeService = {
  // ==================== Employee CRUD ====================

  getEmployeeList: async (): Promise<EmployeeTableData[]> => {
    try {
      const res = await generalQuery("getemployee_full", {});
      if (res.data.tk_status !== "NG") {
        return res.data.data.map(
          (element: EmployeeTableData, index: number) => ({
            ...element,
            DOB: element.DOB !== null ? moment.utc(element.DOB).format("YYYY-MM-DD") : "",
            WORK_START_DATE: element.WORK_START_DATE !== null ? moment.utc(element.WORK_START_DATE).format("YYYY-MM-DD") : "",
            RESIGN_DATE: element.RESIGN_DATE !== null ? moment.utc(element.RESIGN_DATE).format("YYYY-MM-DD") : "",
            ONLINE_DATETIME: element.ONLINE_DATETIME !== null ? moment.utc(element.ONLINE_DATETIME).format("YYYY-MM-DD HH:mm:ss") : "",
            FULL_NAME: element.MIDLAST_NAME + " " + element.FIRST_NAME,
            PASS_WORD: getUserData()?.EMPL_NO === "NHU1903" ? element.PASSWORD : "********",
          })
        );
      } else {
        console.log("fetch error");
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  },

  addEmployee: async (DATA: any): Promise<string> => {
    let kq: string = "";
    await generalQuery("insertemployee", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
          kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;
  },

  updateEmployee: async (DATA: any): Promise<string> => {
    let kq: string = "";
    await generalQuery("updateemployee", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
          kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;
  },

  // ==================== Main Dept CRUD ====================

  loadMainDeptList: async (): Promise<MainDeptTableData[]> => {
    try {
      const res = await generalQuery("getmaindept", {});
      if (res.data.tk_status !== "NG") {
        return res.data.data.map(
          (element: MainDeptTableData, index: number) => ({
            ...element,
            id: index,
          })
        );
      } else {
        console.log("fetch error");
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  },

  addMainDept: async (DATA: any): Promise<string> => {
    let kq: string = "";
    await generalQuery("insertmaindept", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
          kq = response.data.message;
        }
      })
      .catch((error) => {
        kq = error.message;
      });
    return kq;
  },

  updateMainDept: async (DATA: any): Promise<string> => {
    let kq: string = "";
    await generalQuery("updatemaindept", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
          kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;
  },

  deleteMainDept: async (DATA: any): Promise<string> => {
    let kq: string = "";
    await generalQuery("deletemaindept", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
          kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;
  },

  // ==================== Sub Dept CRUD ====================

  loadSubDeptList: async (MAINDEPTCODE?: number): Promise<SubDeptTableData[]> => {
    try {
      const res = await generalQuery(
        "getsubdeptall",
        MAINDEPTCODE === undefined ? {} : { MAINDEPTCODE: MAINDEPTCODE }
      );
      if (res.data.tk_status !== "NG") {
        return res.data.data.map(
          (element: SubDeptTableData, index: number) => ({
            ...element,
            id: index,
          })
        );
      } else {
        console.log("fetch error");
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  },

  addSubDept: async (DATA: any): Promise<string> => {
    let kq: string = "";
    await generalQuery("insertsubdept", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
          kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;
  },

  updateSubDept: async (DATA: any): Promise<string> => {
    let kq: string = "";
    await generalQuery("updatesubdept", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
          kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;
  },

  deleteSubDept: async (DATA: any): Promise<string> => {
    let kq: string = "";
    await generalQuery("deletesubdept", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
          kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;
  },

  // ==================== Work Position CRUD ====================

  loadWorkPositionList: async (SUBDEPTCODE?: number): Promise<WORK_POSITION_DATA[]> => {
    try {
      const res = await generalQuery(
        "workpositionlist",
        SUBDEPTCODE === undefined ? {} : { SUBDEPTCODE: SUBDEPTCODE }
      );
      if (res.data.tk_status !== "NG") {
        return res.data.data.map(
          (element: WORK_POSITION_DATA, index: number) => ({
            ...element,
            id: index,
          })
        );
      } else {
        console.log("fetch error");
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  },

  addWorkPosition: async (DATA: any): Promise<string> => {
    let kq: string = "";
    await generalQuery("insertworkposition", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
          kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;
  },

  updateWorkPosition: async (DATA: any): Promise<string> => {
    let kq: string = "";
    await generalQuery("updateworkposition", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
          kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;
  },

  deleteWorkPosition: async (DATA: any): Promise<string> => {
    let kq: string = "";
    await generalQuery("deleteworkposition", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
          kq = response.data.message;
        }
      })
      .catch((error) => {});
    return kq;
  },

  // ==================== Face ID ====================

  updateFaceID: async (DATA: any): Promise<boolean> => {
    let kq: boolean = false;
    await generalQuery("updatefaceid", {
      EMPL_NO: DATA.EMPL_NO,
      FACE_ID: DATA.FACE_ID,
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
  },

  recognizeFaceID: async (DATA: any): Promise<any> => {
    let kq: any = null;
    await generalQuery("recognizeface", {
      FACE_ID: DATA.FACE_ID,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          kq = response.data;
        } else {
          kq = response.data;
        }
      })
      .catch((error) => {
        console.log(error);
        kq = error.message;
      });
    return kq;
  },
};
