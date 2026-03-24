import { generalQuery } from "../../../api/Api";

export const fcstService = {
  traFcstDataFull: async (data: any) => {
    return await generalQuery("traFcstDataFull", data);
  },
  delete_fcst: async (data: any) => {
    return await generalQuery("delete_fcst", data);
  },
  checkFcstExist: async (data: any) => {
    return await generalQuery("checkFcstExist", data);
  },
  checkGCodeVer: async (data: any) => {
    return await generalQuery("checkGCodeVer", data);
  },
  insert_fcst: async (data: any) => {
    return await generalQuery("insert_fcst", data);
  }
};
