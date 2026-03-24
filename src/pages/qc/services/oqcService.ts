import { generalQuery } from "../../../api/Api";

export const oqcService = {
  ngbyCustomerOQC: async (data: any) => await generalQuery("ngbyCustomerOQC", data),
  ngbyProTypeOQC: async (data: any) => await generalQuery("ngbyProTypeOQC", data),
  dailyOQCTrendingData: async (data: any) => await generalQuery("dailyOQCTrendingData", data),
  weeklyOQCTrendingData: async (data: any) => await generalQuery("weeklyOQCTrendingData", data),
  monthlyOQCTrendingData: async (data: any) => await generalQuery("monthlyOQCTrendingData", data),
  yearlyOQCTrendingData: async (data: any) => await generalQuery("yearlyOQCTrendingData", data),
  inspect_daily_ppm_oqc: async (data: any) => await generalQuery("inspect_daily_ppm_oqc", data),
  inspect_weekly_ppm_oqc: async (data: any) => await generalQuery("inspect_weekly_ppm_oqc", data),
  inspect_monthly_ppm_oqc: async (data: any) => await generalQuery("inspect_monthly_ppm_oqc", data),
  inspect_yearly_ppm_oqc: async (data: any) => await generalQuery("inspect_yearly_ppm_oqc", data),
  traOQCData: async (data: any) => await generalQuery("traOQCData", data),
};
