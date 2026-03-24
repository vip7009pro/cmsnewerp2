import { generalQuery } from "../../../api/Api";

export const khoLieuService = {
  async checkEMPL_NO_mobile(data: { EMPL_NO: string }) {
    return await generalQuery("checkEMPL_NO_mobile", data);
  },

  async checkPLAN_ID(data: { PLAN_ID: string }) {
    return await generalQuery("checkPLAN_ID", data);
  },

  async checkMNAMEfromLotI222XuatKho(data: { M_LOT_NO: string; PLAN_ID: string }) {
    return await generalQuery("checkMNAMEfromLotI222XuatKho", data);
  },

  async checkPLANID_O301(data: { PLAN_ID: string }) {
    return await generalQuery("checkPLANID_O301", data);
  },

  async checksolanout_O302(data: { PLAN_ID: string }) {
    return await generalQuery("checksolanout_O302", data);
  },

  async selectCustomerAndVendorList(data: any = {}) {
    return await generalQuery("selectCustomerAndVendorList", data);
  },

  async selectVendorList(data: any = {}) {
    return await generalQuery("selectVendorList", data);
  },

  async getMaterialList(data: any = {}) {
    return await generalQuery("getMaterialList", data);
  },

  async tranhaplieu(data: any) {
    return await generalQuery("tranhaplieu", data);
  },

  async traxuatlieu(data: any) {
    return await generalQuery("traxuatlieu", data);
  },

  async tratonlieu(data: any) {
    return await generalQuery("tratonlieu", data);
  },

  async updatelieuncc(data: {
    M_LOT_NO: string,
    LOTNCC: string
  }) {
    return await generalQuery("updatelieuncc", data);
  },
};
