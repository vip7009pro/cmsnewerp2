import { generalQuery } from "../../../api/Api";

export const dtcService = {
  dtcspec: async (data: any) => await generalQuery("dtcspec", data),
  loadXbarData: async (data: any) => await generalQuery("loadXbarData", data),
  loadCPKTrend: async (data: any) => await generalQuery("loadCPKTrend", data),
  loadHistogram: async (data: any) => await generalQuery("loadHistogram", data),
  dtcdata: async (data: any) => await generalQuery("dtcdata", data),
  
  getinputdtcspec: async (data: any) => await generalQuery("getinputdtcspec", data),
  checkM_NAME_IQC: async (data: any) => await generalQuery("checkM_NAME_IQC", data),
  getidDTCfromlotNVL: async (data: any) => await generalQuery("getidDTCfromlotNVL", data),
  checkRegisterdDTCTEST: async (data: any) => await generalQuery("checkRegisterdDTCTEST", data),
  insert_dtc_result: async (data: any) => await generalQuery("insert_dtc_result", data),
  updateDTC_TEST_EMPL: async (data: any) => await generalQuery("updateDTC_TEST_EMPL", data),
  
  loadrecentRegisteredDTCData: async (data: any = {}) => await generalQuery("loadrecentRegisteredDTCData", data),
  checkEMPL_NO_mobile: async (data: any) => await generalQuery("checkEMPL_NO_mobile", data),
  ycsx_fullinfo: async (data: any) => await generalQuery("ycsx_fullinfo", data),
  checkMNAMEfromLotI222: async (data: any) => await generalQuery("checkMNAMEfromLotI222", data),
  getLastDTCID: async (data: any = {}) => await generalQuery("getLastDTCID", data),
  checkLabelID2: async (data: any) => await generalQuery("checkLabelID2", data),
  registerDTCTest: async (data: any) => await generalQuery("registerDTCTest", data),
  checkAddedSpec: async (data: any) => await generalQuery("checkAddedSpec", data),
  checkDTC_M_LOT_NO_TEST_CODE_REG: async (data: any) => await generalQuery("checkDTC_M_LOT_NO_TEST_CODE_REG", data),
  lichSuTestM_CODE: async (data: any) => await generalQuery("lichSuTestM_CODE", data),
  checkDTC_ID_FROM_M_LOT_NO: async (data: any) => await generalQuery("checkDTC_ID_FROM_M_LOT_NO", data),
  insertIQC1table: async (data: any) => await generalQuery("insertIQC1table", data),
  
  selectcodeList: async (data: any) => await generalQuery("selectcodeList", data),
  getMaterialList: async (data: any = {}) => await generalQuery("getMaterialList", data),
  checkSpecDTC: async (data: any) => await generalQuery("checkSpecDTC", data),
  checkSpecDTC2: async (data: any) => await generalQuery("checkSpecDTC2", data),
  insertSpecDTC: async (data: any) => await generalQuery("insertSpecDTC", data),
  updateSpecDTC: async (data: any) => await generalQuery("updateSpecDTC", data),
  copyXRFSpec: async (data: any) => await generalQuery("copyXRFSpec", data),
  copyXRFSpecSDI: async (data: any) => await generalQuery("copyXRFSpecSDI", data),
};
