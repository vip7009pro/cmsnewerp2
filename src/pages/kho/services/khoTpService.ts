import { generalQuery, getCompany } from "../../../api/Api";
import {
  KTP_IN,
  KTP_OUT,
  STOCK_G_CODE,
  STOCK_G_NAME_KD,
  STOCK_PROD_REQUEST_NO,
  WH_IN_OUT,
  XUATPACK_DATA,
  TONKIEMGOP_CMS,
  TONKIEMGOP_KD,
  TONKIEMTACH,
} from "../interfaces/khoInterface";

export const khoTpService = {
  async loadKTP_IN(data: any) {
    return await generalQuery("loadKTP_IN", data);
  },

  async loadKTP_OUT(data: any) {
    return await generalQuery("loadKTP_OUT", data);
  },

  async loadStockFull(data: any) {
    return await generalQuery("loadStockFull", data);
  },

  async loadSTOCKG_CODE(data: any) {
    return await generalQuery("loadSTOCKG_CODE", data);
  },

  async loadSTOCKG_NAME_KD(data: any) {
    return await generalQuery("loadSTOCKG_NAME_KD", data);
  },

  async loadSTOCK_YCSX(data: any) {
    return await generalQuery("loadSTOCK_YCSX", data);
  },

  async updatePheDuyetHuyO660(data: { AUTO_ID: string; AUTO_ID_IN: string }) {
    return await generalQuery("updatePheDuyetHuyO660", data);
  },

  async cancelPheDuyetHuyO660(data: { AUTO_ID: string; AUTO_ID_IN: string }) {
    return await generalQuery("cancelPheDuyetHuyO660", data);
  },

  async xuatpackkhotp(data: any) {
    return await generalQuery("xuatpackkhotp", data);
  },

  async trakhotpInOut(data: any) {
    return await generalQuery("trakhotpInOut", data);
  },

  async traSTOCKCMS(data: any) {
    const queryName = getCompany() === "CMS" ? "traSTOCKCMS_NEW" : "traSTOCKCMS";
    return await generalQuery(queryName, data);
  },

  async traSTOCKKD(data: any) {
    const queryName = getCompany() === "CMS" ? "traSTOCKKD_NEW" : "traSTOCKKD";
    return await generalQuery(queryName, data);
  },

  async traSTOCKTACH(data: any) {
    return await generalQuery("traSTOCKTACH", data);
  },
};
