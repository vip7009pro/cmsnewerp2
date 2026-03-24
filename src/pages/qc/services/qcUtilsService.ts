import { generalQuery } from "../../../api/Api";

export const qcUtilsService = {
  loadAUDIT_HISTORY_DATA: async (data: any) => await generalQuery("loadAUDIT_HISTORY_DATA", data),
  add_AUDIT_HISTORY_DATA: async (data: any) => await generalQuery("add_AUDIT_HISTORY_DATA", data),
  update_AUDIT_HISTORY_DATA: async (data: any) => await generalQuery("update_AUDIT_HISTORY_DATA", data),
  delete_AUDIT_HISTORY_DATA: async (data: any) => await generalQuery("delete_AUDIT_HISTORY_DATA", data),
  updateFileInfo_AUDIT_HISTORY: async (data: any) => await generalQuery("updateFileInfo_AUDIT_HISTORY", data),
  
  loadDtcTestList: async (data: any = {}) => await generalQuery("loadDtcTestList", data),
  loadDtcTestPointList: async (data: any) => await generalQuery("loadDtcTestPointList", data),
  addTestItem: async (data: any) => await generalQuery("addTestItem", data),
  addTestPoint: async (data: any) => await generalQuery("addTestPoint", data),
  
  isM_LOT_NO_in_IN_KHO_SX: async (data: any) => await generalQuery("isM_LOT_NO_in_IN_KHO_SX", data),
  check_m_code_m140_main: async (data: any) => await generalQuery("check_m_code_m140_main", data),
  isM_LOT_NO_in_O302: async (data: any) => await generalQuery("isM_LOT_NO_in_O302", data),
  resetKhoSX_IQC1: async (data: any) => await generalQuery("resetKhoSX_IQC1", data),
  resetKhoSX_IQC2: async (data: any) => await generalQuery("resetKhoSX_IQC2", data),
  
  updateNCRIDForHolding: async (data: any) => await generalQuery("updateNCRIDForHolding", data),
  updateNCRIDForFailing: async (data: any) => await generalQuery("updateNCRIDForFailing", data),
  
  temlotktraHistory: async (data: any) => await generalQuery("temlotktraHistory", data),
  khkt_a_dung: async (data: any) => await generalQuery("khkt_a_dung", data),
  tinh_hinh_kiemtra_G_CODE: async (data: any) => await generalQuery("tinh_hinh_kiemtra_G_CODE", data),
  
  dailyIncomingData: async (data: any) => await generalQuery("dailyIncomingData", data),
  weeklyIncomingData: async (data: any) => await generalQuery("weeklyIncomingData", data),
  monthlyIncomingData: async (data: any) => await generalQuery("monthlyIncomingData", data),
  yearlyIncomingData: async (data: any) => await generalQuery("yearlyIncomingData", data),
  
  vendorIncommingNGRatebyWeek: async (data: any) => await generalQuery("vendorIncommingNGRatebyWeek", data),
  vendorIncommingNGRatebyMonth: async (data: any) => await generalQuery("vendorIncommingNGRatebyMonth", data),
  
  iqcfailtrending: async (data: any) => await generalQuery("iqcfailtrending", data),
  iqcholdingtrending: async (data: any) => await generalQuery("iqcholdingtrending", data),
  iqcfailpending: async (data: any) => await generalQuery("iqcfailpending", data),
  iqcholdingpending: async (data: any) => await generalQuery("iqcholdingpending", data),
  
  loadlosstimekiemtratheonguoiban: async (data: any) => await generalQuery("loadlosstimekiemtratheonguoiban", data),
  loadlosstimekiemtratheonguoi: async (data: any) => await generalQuery("loadlosstimekiemtratheonguoi", data),
  loadQTRData: async (data: any) => await generalQuery("loadQTRData", data),
  
  autoInsertPhanLoaiBanKiemTra: async (data: any) => await generalQuery("autoInsertPhanLoaiBanKiemTra", data),
  updateKPIBanKiemTra: async (data: any) => await generalQuery("updateKPIBanKiemTra", data),
  updateTruDiemKiemTra: async (data: any) => await generalQuery("updateTruDiemKiemTra", data),
  loadKpiNV_KiemTra_New2: async (data: any) => await generalQuery("loadKpiNV_KiemTra_New2", data),
  loadDinhMucViTriKiemTra: async (data: any = {}) => await generalQuery("loadDinhMucViTriKiemTra", data)
};
