import { generalQuery } from "../../../api/Api";

export const inspectionService = {
  getIns_Status: async (data: any = {}) => await generalQuery("getIns_Status", data),
  resetStatus: async (data: any) => await generalQuery("resetStatus", data),
  getpatrolheader: async (data: any) => await generalQuery("getpatrolheader", data),
  getInspectionWorstTable: async (data: any) => await generalQuery("getInspectionWorstTable", data),
  
  inspect_daily_ppm: async (data: any) => await generalQuery("inspect_daily_ppm", data),
  inspect_weekly_ppm: async (data: any) => await generalQuery("inspect_weekly_ppm", data),
  inspect_monthly_ppm: async (data: any) => await generalQuery("inspect_monthly_ppm", data),
  inspect_yearly_ppm: async (data: any) => await generalQuery("inspect_yearly_ppm", data),
  getInspectionSummary: async (data: any) => await generalQuery("getInspectionSummary", data),
  
  dailyFcost: async (data: any) => await generalQuery("dailyFcost", data),
  weeklyFcost: async (data: any) => await generalQuery("weeklyFcost", data),
  monthlyFcost: async (data: any) => await generalQuery("monthlyFcost", data),
  annuallyFcost: async (data: any) => await generalQuery("annuallyFcost", data),
  dailyDefectTrending: async (data: any) => await generalQuery("dailyDefectTrending", data),
  
  get_inspection: async (data: any) => await generalQuery("get_inspection", data),
  loadChoKiemGop_NEW: async (data: any) => await generalQuery("loadChoKiemGop_NEW", data),
  loadInspectionPatrol: async (data: any) => await generalQuery("loadInspectionPatrol", data),
  selectcodeList: async (data: any) => await generalQuery("selectcodeList", data),
};
