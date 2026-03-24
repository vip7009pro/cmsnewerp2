import { generalQuery } from "../../../api/Api";

export const pqcService = {
  trapqc1data: async (data: any) => await generalQuery("trapqc1data", data),
  trapqc3data: async (data: any) => await generalQuery("trapqc3data", data),
  traCNDB: async (data: any) => await generalQuery("traCNDB", data),
  tradaofilm: async (data: any) => await generalQuery("tradaofilm", data),
  updatenndspqc: async (data: any) => await generalQuery("updatenndspqc", data),
  
  pqcdailyppm: async (data: any) => await generalQuery("pqcdailyppm", data),
  pqcweeklyppm: async (data: any) => await generalQuery("pqcweeklyppm", data),
  pqcmonthlyppm: async (data: any) => await generalQuery("pqcmonthlyppm", data),
  pqcyearlyppm: async (data: any) => await generalQuery("pqcyearlyppm", data),
  
  getPQCSummary: async (data: any) => await generalQuery("getPQCSummary", data),
  dailyPQCDefectTrending: async (data: any) => await generalQuery("dailyPQCDefectTrending", data),
  
  checkPROCESS_LOT_NO: async (data: any) => await generalQuery("checkPROCESS_LOT_NO", data),
  loadErrTable: async (data: any = {}) => await generalQuery("loadErrTable", data),
  insert_pqc3: async (data: any) => await generalQuery("insert_pqc3", data),
  getlastestPQC3_ID: async (data: any = {}) => await generalQuery("getlastestPQC3_ID", data),
  checkktdtc: async (data: any) => await generalQuery("checkktdtc", data),
  loadDataSX: async (data: any) => await generalQuery("loadDataSX", data),
  
  checkPlanIdP501: async (data: any) => await generalQuery("checkPlanIdP501", data),
  checkProcessLotNo_Prod_Req_No: async (data: any) => await generalQuery("checkProcessLotNo_Prod_Req_No", data),
  insert_pqc1: async (data: any) => await generalQuery("insert_pqc1", data),
  updatepqc1sampleqty: async (data: any) => await generalQuery("updatepqc1sampleqty", data),
  checkPlanIdChecksheet: async (data: any) => await generalQuery("checkPlanIdChecksheet", data),
  update_checksheet_image_status: async (data: any) => await generalQuery("update_checksheet_image_status", data),
  
  selectcustomerList: async (data: any = {}) => await generalQuery("selectcustomerList", data),
  checkPLAN_ID: async (data: any) => await generalQuery("checkPLAN_ID", data),
  checkEMPL_NO_mobile: async (data: any) => await generalQuery("checkEMPL_NO_mobile", data),
  checkMNAMEfromLot: async (data: any) => await generalQuery("checkMNAMEfromLot", data),
  selectcodeList: async (data: any) => await generalQuery("selectcodeList", data),
};
