import { generalQuery } from "../../../api/Api";

export const csService = {
  updatenndscs: async (data: any) => await generalQuery("updatenndscs", data),
  updateCSImageStatus: async (data: any) => await generalQuery("updateCSImageStatus", data),
  executeCSCommand: async (command: string, data: any) => await generalQuery(command, data),
  tracsconfirm: async (data: any) => await generalQuery("tracsconfirm", data),
  tracsrma: async (data: any) => await generalQuery("tracsrma", data),
  tracsCNDB: async (data: any) => await generalQuery("tracsCNDB", data),
  tracsTAXI: async (data: any) => await generalQuery("tracsTAXI", data),
  selectcodeList: async (data: any) => await generalQuery("selectcodeList", data),
  
  csdailyconfirmdata: async (data: any) => await generalQuery("csdailyconfirmdata", data),
  csweeklyconfirmdata: async (data: any) => await generalQuery("csweeklyconfirmdata", data),
  csmonthlyconfirmdata: async (data: any) => await generalQuery("csmonthlyconfirmdata", data),
  csyearlyconfirmdata: async (data: any) => await generalQuery("csyearlyconfirmdata", data),
  
  csConfirmDataByCustomer: async (data: any) => await generalQuery("csConfirmDataByCustomer", data),
  csConfirmDataByPIC: async (data: any) => await generalQuery("csConfirmDataByPIC", data),
  
  csdailyreduceamount: async (data: any) => await generalQuery("csdailyreduceamount", data),
  csweeklyreduceamount: async (data: any) => await generalQuery("csweeklyreduceamount", data),
  csmonthlyreduceamount: async (data: any) => await generalQuery("csmonthlyreduceamount", data),
  csyearlyreduceamount: async (data: any) => await generalQuery("csyearlyreduceamount", data),
  
  csdailyRMAAmount: async (data: any) => await generalQuery("csdailyRMAAmount", data),
  csweeklyRMAAmount: async (data: any) => await generalQuery("csweeklyRMAAmount", data),
  csmonthlyRMAAmount: async (data: any) => await generalQuery("csmonthlyRMAAmount", data),
  csyearlyRMAAmount: async (data: any) => await generalQuery("csyearlyRMAAmount", data),

  csdailyTaxiAmount: async (data: any) => await generalQuery("csdailyTaxiAmount", data),
  csweeklyTaxiAmount: async (data: any) => await generalQuery("csweeklyTaxiAmount", data),
  csmonthlyTaxiAmount: async (data: any) => await generalQuery("csmonthlyTaxiAmount", data),
  csyearlyTaxiAmount: async (data: any) => await generalQuery("csyearlyTaxiAmount", data)
};
