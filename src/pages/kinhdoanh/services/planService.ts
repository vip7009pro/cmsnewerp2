import { generalQuery } from "../../../api/Api";

export const planService = {
  traPlanDataFull: async (data: any) => {
    return await generalQuery("traPlanDataFull", data);
  },
  delete_plan: async (data: any) => {
    return await generalQuery("delete_plan", data);
  },
  checkPlanExist: async (data: any) => {
    return await generalQuery("checkPlanExist", data);
  },
  checkGCodeVer: async (data: any) => {
    return await generalQuery("checkGCodeVer", data);
  },
  insert_plan: async (data: any) => {
    return await generalQuery("insert_plan", data);
  }
};
