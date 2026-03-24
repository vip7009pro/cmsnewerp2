import moment from "moment";
import { generalQuery } from "../../../api/Api";
import {
  BANG_CONG_DATA,
  BANG_CONG_THANG_DATA,
  DiemDanhNhomData,
} from "../interfaces/nhansuInterface";
import { weekdayarray } from "../../../api/GlobalFunction";

export const attendanceService = {
  // ==================== Ca / Shift ====================

  setCa: async (DATA: any): Promise<boolean> => {
    let kq: boolean = false;
    await generalQuery("setca", {
      EMPL_NO: DATA.EMPL_NO,
      CALV: DATA.CALV,
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

  setCaDiemDanh: async (DATA: any): Promise<boolean> => {
    let kq: boolean = false;
    await generalQuery("setcadiemdanh", {
      EMPL_NO: DATA.EMPL_NO,
      APPLY_DATE: DATA.APPLY_DATE,
      CALV: DATA.CALV,
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

  // ==================== DiemDanh Nhom ====================

  getDiemDanhNhom: async (
    option: string,
    teamnamelist: number
  ): Promise<DiemDanhNhomData[]> => {
    let kq: DiemDanhNhomData[] = [];
    await generalQuery(option, { team_name_list: teamnamelist })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data = response.data.data.map(
            (e: any, index: number) => ({
              ...e,
              REQUEST_DATE:
                e.REQUEST_DATE !== null
                  ? moment.utc(e.REQUEST_DATE).format("YYYY-MM-DD")
                  : "",
              APPLY_DATE:
                e.APPLY_DATE !== null
                  ? moment.utc(e.APPLY_DATE).format("YYYY-MM-DD")
                  : "",
              FULL_NAME: e.MIDLAST_NAME + " " + e.FIRST_NAME,
              id: index + 1,
            })
          );
          kq = loaded_data;
        } else {
          console.log(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  },

  // ==================== Work Hour ====================

  updateWorkHour: async (DATA: any, APPLY_DATE: string): Promise<boolean> => {
    let kq: boolean = false;
    await generalQuery("updateworkhour", {
      EMPL_NO: DATA.EMPL_NO,
      APPLY_DATE: APPLY_DATE,
      WORK_HOUR: DATA.WORK_HOUR,
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

  // ==================== Bang Cong CRUD ====================

  insertBangCong: async (DATA: any): Promise<string> => {
    let kq: string = "";
    await generalQuery("insertBangCong", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
          kq = response.data.message;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  },

  updateBangCong: async (DATA: any): Promise<string> => {
    let kq: string = "";
    await generalQuery("updateBangCong", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
          kq = response.data.message;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  },

  deleteBangCong: async (DATA: any): Promise<string> => {
    let kq: string = "";
    await generalQuery("deleteBangCong", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
          kq = response.data.message;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  },

  loadBangCong: async (DATA: any): Promise<BANG_CONG_DATA[]> => {
    let kq: BANG_CONG_DATA[] = [];
    await generalQuery("loadBangCong", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loaded_data = response.data.data.map(
            (e: any, index: number) => ({
              ...e,
              WEEKDAY: weekdayarray[new Date(e.APPLY_DATE).getDay()],
              INS_DATE:
                e.INS_DATE !== null
                  ? moment.utc(e.INS_DATE).format("YYYY-MM-DD")
                  : "",
              UPD_DATE:
                e.UPD_DATE !== null
                  ? moment.utc(e.UPD_DATE).format("YYYY-MM-DD")
                  : "",
              APPLY_DATE:
                e.APPLY_DATE !== null
                  ? moment.utc(e.APPLY_DATE).format("YYYY-MM-DD")
                  : "",
              id: index + 1,
            })
          );
          kq = loaded_data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  },

  loadBangCongTheoThang: async (DATA: any): Promise<BANG_CONG_THANG_DATA[]> => {
    let kq: BANG_CONG_THANG_DATA[] = [];
    await generalQuery("loadBangCongTheoThang", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          kq = response.data.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  },

  // ==================== NV Verification ====================

  checkNV: async (DATA: any): Promise<Array<any>> => {
    let kq: Array<any> = [];
    await generalQuery("checkNVCCID", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          kq = response.data.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  },

  syncBangCong: async (DATA: any): Promise<string> => {
    let kq: string = "";
    await generalQuery("syncBangCongSangDiemDanh", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
          kq = response.data.message;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  },

  checkDoubleNV_CCID: async (DATA: any): Promise<Array<any>> => {
    let kq: Array<any> = [];
    await generalQuery("checktrungNV_CCID", DATA)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          kq = response.data.data;
        } else {
          kq = [];
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return kq;
  },

  // ==================== Personal Attendance History ====================

  getMyDiemDanh: async (
    fromDate: string,
    toDate: string
  ): Promise<any> => {
    try {
      const response = await generalQuery("mydiemdanhnhom", {
        from_date: fromDate,
        to_date: toDate,
      });
      return response;
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  },
};
