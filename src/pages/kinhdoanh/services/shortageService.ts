import { generalQuery } from "../../../api/Api";

export const shortageService = {
  traShortageKD: async (data: any) => {
    return await generalQuery("traShortageKD", data);
  },
  delete_shortage: async (data: any) => {
    return await generalQuery("delete_shortage", data);
  },
  checkShortageExist: async (data: any) => {
    return await generalQuery("checkShortageExist", data);
  },
  checkGCodeVer: async (data: any) => {
    return await generalQuery("checkGCodeVer", data);
  },
  insert_shortage: async (data: any) => {
    return await generalQuery("insert_shortage", data);
  }
};
