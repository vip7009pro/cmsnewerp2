import { generalQuery, getAuditMode, getCompany } from "../../../api/Api";
import { YCSXTableData, PONOLIST, POBALANCETDYCSX, TONKHOTDYCSX, FCSTTDYCSX, UploadAmazonData, YCTKData, YCTK_TREND_DATA, PO_BALANCE_DETAIL, PO_BALANCE_SUMMARY, PO_BALANCE_CUSTOMER, PROD_OVER_DATA } from "../interfaces/kdInterface";
import moment from "moment";
import Swal from "sweetalert2";

const zeroPad = (num: number, places: number) => String(num).padStart(places, "0");

export const monthArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
export const dayArray = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V"
];

export const ycsxService = {
  async loadPONOList(G_CODE?: string, CUST_CD?: string): Promise<PONOLIST[]> {
    if (!G_CODE || !CUST_CD) return [];
    try {
      const response = await generalQuery("loadpono", { G_CODE, CUST_CD });
      if (response.data.tk_status !== "NG") {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  async traYCSX(searchFilter: any): Promise<YCSXTableData[]> {
    try {
      const response = await generalQuery("traYCSXDataFull", {
        alltime: searchFilter.alltime,
        start_date: searchFilter.start_date,
        end_date: searchFilter.end_date,
        cust_name: searchFilter.cust_name,
        codeCMS: searchFilter.codeCMS,
        codeKD: searchFilter.codeKD,
        prod_type: searchFilter.prod_type,
        empl_name: searchFilter.empl_name,
        phanloai: searchFilter.phanloai,
        ycsx_pending: searchFilter.ycsx_pending,
        inspect_inputcheck: searchFilter.inspect_inputcheck,
        prod_request_no: searchFilter.prod_request_no,
        material: searchFilter.material,
        phanloaihang: searchFilter.phanloaihang,
        material_yes: searchFilter.material_yes,
      });

      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: YCSXTableData, index: number) => ({
          ...element,
          G_NAME: getAuditMode() == 0 ? element?.G_NAME : element?.G_NAME?.search("CNDB") == -1 ? element?.G_NAME : "TEM_NOI_BO",
          G_NAME_KD: getAuditMode() == 0 ? element?.G_NAME_KD : element?.G_NAME?.search("CNDB") == -1 ? element?.G_NAME_KD : "TEM_NOI_BO",
          PO_TDYCSX: element.PO_TDYCSX ?? 0,
          TOTAL_TKHO_TDYCSX: element.TOTAL_TKHO_TDYCSX ?? 0,
          TKHO_TDYCSX: element.TKHO_TDYCSX ?? 0,
          BTP_TDYCSX: element.BTP_TDYCSX ?? 0,
          CK_TDYCSX: element.CK_TDYCSX ?? 0,
          BLOCK_TDYCSX: element.BLOCK_TDYCSX ?? 0,
          FCST_TDYCSX: element.FCST_TDYCSX ?? 0,
          W1: element.W1 ?? 0,
          W2: element.W2 ?? 0,
          W3: element.W3 ?? 0,
          W4: element.W4 ?? 0,
          W5: element.W5 ?? 0,
          W6: element.W6 ?? 0,
          W7: element.W7 ?? 0,
          W8: element.W8 ?? 0,
          PROD_REQUEST_QTY: element.PROD_REQUEST_QTY ?? 0,
          INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
          UPD_DATE: moment.utc(element.UPD_DATE).format("YYYY-MM-DD HH:mm:ss"),
          id: index,
        }));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to load YCSX data");
    }
  },

  async checkG_CODE_ACTIVE(G_CODE: string): Promise<number> {
    try {
      const response = await generalQuery("checkGCodeVer", { G_CODE });
      if (response.data.tk_status !== "NG") {
        return response.data.data[0].USE_YN === "Y" ? 0 : 3;
      }
      return 4;
    } catch (error) {
      console.error(error);
      return 4;
    }
  },

  async isBOMGIA_HAS_MAIN(G_CODE: string): Promise<boolean> {
    try {
      const response = await generalQuery("checkmainBOM2", { G_CODE });
      return response.data.tk_status !== "NG";
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async isBOM_M_CODE_MATCHING(G_CODE: string): Promise<string> {
    try {
      const response = await generalQuery("checkmainBOM2_M140_M_CODE_MATCHING", { G_CODE });
      if (response.data.tk_status !== "NG") {
        const tempKQ = response.data.data[0];
        if (tempKQ.BOM2_M_CODE_COUNT > tempKQ.M140_M_CODE_COUNT) {
          return `NG: M_CODE trong bom Giá fai có đủ trong bom sản xuất, bom sx thiếu ${tempKQ.THIEU} M_CODE so với bom giá`;
        }
        return "OK";
      }
      return "NG: Chưa có BOM Giá";
    } catch (error) {
      console.error(error);
      return "NG: Lỗi kết nối";
    }
  },

  async check_G_NAME_2Ver_active(G_CODE: string): Promise<boolean> {
    try {
      const response = await generalQuery("check_G_NAME_2Ver_active", { G_CODE });
      return response.data.tk_status !== "NG" && response.data.data.length > 1;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async createYCSXHeader(): Promise<string> {
    try {
      const response = await generalQuery("getSystemDateTime", {});
      if (response.data.tk_status !== "NG") {
        const giohethong = response.data.data[0].SYSTEM_DATETIME;
        const month = moment.utc(giohethong).month();
        const day = moment.utc(giohethong).date();
        const yearstr = giohethong.substring(3, 4);
        const monthstr = monthArray[month];
        const daystr = dayArray[day - 1];
        return yearstr + monthstr + daystr;
      }
      throw new Error("Không lấy được giờ hệ thống");
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async generateNextProdRequestNo(): Promise<string> {
    try {
      const next_header = await this.createYCSXHeader();
      const response = await generalQuery("checkLastYCSX", {});
      if (response.data.tk_status !== "NG") {
        const last_prod_request_no = response.data.data[0].PROD_REQUEST_NO;
        return next_header + moment().format("YYYY").substring(2, 3) + zeroPad(Number(last_prod_request_no.substring(4, 7)) + 1, 3);
      }
      return next_header + moment().format("YYYY").substring(2, 3) + "001";
    } catch (error) {
      console.error(error);
      throw new Error("Failed to generate code");
    }
  },

  async checkG_CODE_PO_BALANCE(G_CODE: string): Promise<POBALANCETDYCSX> {
    try {
      const response = await generalQuery("checkpobalance_tdycsx", { G_CODE });
      if (response.data.tk_status !== "NG") {
        return response.data.data[0];
      }
      return { G_CODE: "", PO_BALANCE: 0 };
    } catch (error) {
      console.error(error);
      return { G_CODE: "", PO_BALANCE: 0 };
    }
  },

  async checkStock_G_CODE(G_CODE: string): Promise<TONKHOTDYCSX> {
    try {
      const response = await generalQuery("checktonkho_tdycsx", { G_CODE });
      if (response.data.tk_status !== "NG") {
        return response.data.data[0];
      }
      return { G_CODE: "", CHO_KIEM: 0, CHO_CS_CHECK: 0, CHO_KIEM_RMA: 0, TONG_TON_KIEM: 0, BTP: 0, TON_TP: 0, BLOCK_QTY: 0, GRAND_TOTAL_STOCK: 0 };
    } catch (error) {
      console.error(error);
      return { G_CODE: "", CHO_KIEM: 0, CHO_CS_CHECK: 0, CHO_KIEM_RMA: 0, TONG_TON_KIEM: 0, BTP: 0, TON_TP: 0, BLOCK_QTY: 0, GRAND_TOTAL_STOCK: 0 };
    }
  },

  async checkFCST_G_CODE(G_CODE: string): Promise<FCSTTDYCSX> {
    try {
      const response = await generalQuery("checkfcst_tdycsx", { G_CODE });
      if (response.data.tk_status !== "NG") {
        return response.data.data[0];
      }
      return { G_CODE: "", W1: 0, W2: 0, W3: 0, W4: 0, W5: 0, W6: 0, W7: 0, W8: 0 };
    } catch (error) {
      console.error(error);
      return { G_CODE: "", W1: 0, W2: 0, W3: 0, W4: 0, W5: 0, W6: 0, W7: 0, W8: 0 };
    }
  },

  async insertDMYCSX(ycsxDMData: any): Promise<void> {
    try {
      const response = await generalQuery("insertDBYCSX", { PROD_REQUEST_NO: ycsxDMData.PROD_REQUEST_NO, G_CODE: ycsxDMData.G_CODE });
      if (response.data.tk_status === "NG") {
        await this.updateDMYCSX(ycsxDMData);
      }
    } catch (error) {
      console.error(error);
    }
  },

  async insertDMYCSX_New(ycsxDMData: any): Promise<void> {
    try {
      const response = await generalQuery("insertDBYCSX_New", { PROD_REQUEST_NO: ycsxDMData.PROD_REQUEST_NO, G_CODE: ycsxDMData.G_CODE });
      if (response.data.tk_status === "NG") {
        await this.updateDMYCSX_New(ycsxDMData);
      }
    } catch (error) {
      console.error(error);
    }
  },

  async updateDMYCSX_New(ycsxDMData: any): Promise<void> {
    await generalQuery("updateDBYCSX_New", ycsxDMData).catch(console.error);
  },

  async updateDMYCSX(ycsxDMData: any): Promise<void> {
    await generalQuery("updateDBYCSX", {
      PROD_REQUEST_NO: ycsxDMData.PROD_REQUEST_NO,
      LOSS_SX1: ycsxDMData.LOSS_SX1,
      LOSS_SX2: ycsxDMData.LOSS_SX2,
      LOSS_SX3: ycsxDMData.LOSS_SX3,
      LOSS_SX4: ycsxDMData.LOSS_SX4,
      LOSS_SETTING1: ycsxDMData.LOSS_SETTING1,
      LOSS_SETTING2: ycsxDMData.LOSS_SETTING2,
      LOSS_SETTING3: ycsxDMData.LOSS_SETTING3,
      LOSS_SETTING4: ycsxDMData.LOSS_SETTING4,
      LOSS_KT: ycsxDMData.LOSS_KT,
    }).catch(console.error);
  },

  async insertYCSX(ycsxData: any): Promise<string> {
    try {
      const response = await generalQuery("insert_ycsx", {
        ...ycsxData,
        G_CODE: ycsxData.G_CODE?.trim(),
      });
      return response.data.tk_status !== "NG" ? "OK" : response.data.message;
    } catch (error: any) {
      return error.message;
    }
  },

  async process_lot_no_generate(machinename: string): Promise<string> {
    try {
      const in_date = moment().format("YYYYMMDD");
      let NEXT_PROCESS_LOT_NO = machinename + (await this.createYCSXHeader());
      const response = await generalQuery("getLastProcessLotNo", { machine: machinename, in_date });
      if (response.data.tk_status !== "NG") {
        NEXT_PROCESS_LOT_NO += zeroPad(Number(response.data.data[0].SEQ_NO) + 1, 3);
      } else {
        NEXT_PROCESS_LOT_NO += "001";
      }
      return NEXT_PROCESS_LOT_NO;
    } catch (error) {
      console.error(error);
      return "";
    }
  },

  async getNextP500_IN_NO(): Promise<string> {
    try {
      const response = await generalQuery("checkProcessInNoP500", {});
      return response.data.tk_status !== "NG" ? zeroPad(Number(response.data.data[0].PROCESS_IN_NO) + 1, 3) : "001";
    } catch (error) {
      console.error(error);
      return "001";
    }
  },

  async insertP500(P500Data: any): Promise<void> {
    await generalQuery("insert_p500", P500Data).catch(console.error);
  },

  async insertP501(P501Data: any): Promise<void> {
    await generalQuery("insert_p501", P501Data).catch(console.error);
  },

  async updateDMSX_LOSS_KT(): Promise<boolean> {
    try {
      const response = await generalQuery("updateDMLOSSKT_ZTB_DM_HISTORY", {});
      return response.data.tk_status !== "NG";
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async checkYCSX_EXIST(PROD_REQUEST_NO: string): Promise<boolean> {
    try {
      const response = await generalQuery("checkYcsxExist", { PROD_REQUEST_NO });
      return response.data.tk_status !== "NG";
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async updateYCSX(YCSXDATA: any): Promise<string> {
    try {
      const response = await generalQuery("update_ycsx", YCSXDATA);
      return response.data.tk_status !== "NG" ? "OK" : response.data.message;
    } catch (error: any) {
      return error.message;
    }
  },

  async checkYCSX_DKXL(PROD_REQUEST_NO: string): Promise<boolean> {
    try {
      const response = await generalQuery("checkYCSXQLSXPLAN", { PROD_REQUEST_NO });
      return response.data.tk_status !== "NG";
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async checkPlanIDExist(PROD_REQUEST_NO: string): Promise<boolean> {
    try {
      const response = await generalQuery("checkPLAN_ID_Exist", { PROD_REQUEST_NO });
      return response.data.tk_status !== "NG";
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async deleteYCSX(PROD_REQUEST_NO: string): Promise<string> {
    try {
      const response = await generalQuery("delete_ycsx", { PROD_REQUEST_NO });
      if (response.data.tk_status !== "NG") {
        await this.deleteDMYCSX(PROD_REQUEST_NO);
        await this.deleteDMYCSX2(PROD_REQUEST_NO);
        return "OK";
      }
      return response.data.message;
    } catch (error: any) {
      return error.message;
    }
  },

  async deleteDMYCSX(PROD_REQUEST_NO: string): Promise<void> {
    await generalQuery("deleteDMYCSX", { PROD_REQUEST_NO }).catch(console.error);
  },

  async deleteDMYCSX2(PROD_REQUEST_NO: string): Promise<void> {
    await generalQuery("deleteDMYCSX2", { PROD_REQUEST_NO }).catch(console.error);
  },

  async deleteP500_YCSX(PROD_REQUEST_NO: string, EMPL_NO: string): Promise<void> {
    await generalQuery("delete_P500_YCSX", { PROD_REQUEST_NO, INS_EMPL: EMPL_NO }).catch(console.error);
  },

  async deleteP501_YCSX(PLAN_ID: string, EMPL_NO: string): Promise<void> {
    await generalQuery("delete_P501_YCSX", { PLAN_ID, INS_EMPL: EMPL_NO }).catch(console.error);
  },

  async isHasInLaiCountAMZ(PROD_REQUEST_NO: string): Promise<boolean> {
    try {
      const response = await generalQuery("checkInLaiCount_AMZ", { PROD_REQUEST_NO });
      return response.data.tk_status !== "NG" && response.data.data[0].IN_LAI_QTY !== 0;
    } catch (error) {
      console.error(error);
      return true;
    }
  },

  async deleteDataAMZ(PROD_REQUEST_NO: string): Promise<void> {
    await generalQuery("deleteAMZ_DATA", { PROD_REQUEST_NO }).catch(console.error);
  },

  async checkG_CODE_EXISTS_AND_APPROVED_SAMPLE_MONITOR(G_CODE: string): Promise<boolean> {
    try {
      const response = await generalQuery("checkgcodeexists_approved_samplemonitor", { G_CODE });
      return response.data.tk_status !== "NG" && response.data.data.length > 0 && response.data.data[0].APPROVE_STATUS === "Y";
    } catch (error) {
      console.error(error);
      return true;
    }
  },

  async checktrungAMZ(): Promise<any> {
    try {
      const response = await generalQuery("checktrungAMZ", {});
      if (response.data.tk_status !== "NG") {
        return response.data.data.length > 0 ? response.data.data[0] : null;
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async checktrungAMZ_Full(): Promise<any[]> {
    try {
      const response = await generalQuery("checktrungAMZ_Full", {});
      if (response.data.tk_status !== "NG") {
        return response.data.data;
      }
      return [];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async getG_NAME_KD(G_CODE: string): Promise<string> {
    try {
      const response = await generalQuery("getG_NAME_KD", { G_CODE });
      if (response.data.tk_status !== "NG") {
        return response.data.data[0].G_NAME_KD;
      }
      return "";
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async isIDCongViecExist(NO_IN: string, PROD_REQUEST_NO: string): Promise<boolean> {
    try {
      const response = await generalQuery("checkIDCongViecAMZ", { NO_IN, PROD_REQUEST_NO });
      return response.data.tk_status !== "NG";
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  handleAmazonData(
    amazon_data: { id: number; DATA: string; CHECKSTATUS: string }[],
    cavity: number,
    G_CODE: string,
    PROD_REQUEST_NO: string,
    NO_IN: string
  ): UploadAmazonData[] {
    let handled_Amazon_Table: UploadAmazonData[] = [];
    if (amazon_data.length % cavity !== 0) {
      throw new Error("Số dòng lẻ so với cavity");
    } else {
      for (let i = 1; i <= amazon_data.length / cavity; i++) {
        let temp_amazon_row: UploadAmazonData = {};
        temp_amazon_row.G_CODE = G_CODE;
        temp_amazon_row.PROD_REQUEST_NO = PROD_REQUEST_NO;
        temp_amazon_row.NO_IN = NO_IN;
        temp_amazon_row.ROW_NO = i;
        if (cavity === 1) {
          temp_amazon_row.DATA1 = amazon_data[i * cavity - 1].DATA;
          temp_amazon_row.DATA2 = amazon_data[i * cavity - 1].DATA + "_NOT_USE";
        } else if (cavity === 2) {
          temp_amazon_row.DATA1 = amazon_data[i * cavity - 2].DATA;
          temp_amazon_row.DATA2 = amazon_data[i * cavity - 1].DATA;
        } else if (cavity === 3) {
          temp_amazon_row.DATA1 = amazon_data[i * cavity - 3].DATA;
          temp_amazon_row.DATA2 = amazon_data[i * cavity - 2].DATA;
          temp_amazon_row.DATA3 = amazon_data[i * cavity - 1].DATA;
        } else if (cavity === 4) {
          temp_amazon_row.DATA1 = amazon_data[i * cavity - 4].DATA;
          temp_amazon_row.DATA2 = amazon_data[i * cavity - 3].DATA;
          temp_amazon_row.DATA3 = amazon_data[i * cavity - 2].DATA;
          temp_amazon_row.DATA4 = amazon_data[i * cavity - 1].DATA;
        }
        temp_amazon_row.INLAI_COUNT = 0;
        temp_amazon_row.REMARK = "";
        handled_Amazon_Table.push(temp_amazon_row);
      }
    }
    return handled_Amazon_Table;
  },

  async load_YCTK(DATA: any): Promise<YCTKData[]> {
    try {
      const response = await generalQuery("loadyctkdata", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: YCTKData, index: number) => ({
          ...element,
          id: index,
        }));
      }
      return [];
    } catch (error: any) {
      throw new Error(error.message || "Failed to load YCTK");
    }
  },

  async insert_YCTK(DATA: any): Promise<string> {
    try {
      const response = await generalQuery("addYCTK", DATA);
      return response.data.tk_status !== "NG" ? "OK" : "NG: Lỗi SQL: " + response.data.message;
    } catch (error: any) {
      return "NG: Lỗi kết nối: " + error.message;
    }
  },

  async update_YCTK(DATA: any): Promise<string> {
    try {
      const response = await generalQuery("updateYCTK", DATA);
      return response.data.tk_status !== "NG" ? "OK" : "NG: Lỗi SQL: " + response.data.message;
    } catch (error: any) {
      return "NG: Lỗi kết nối: " + error.message;
    }
  },

  async load_YCTK_TREND_DAILY(DATA: any): Promise<YCTK_TREND_DATA[]> {
    try {
      const response = await generalQuery("loadyctkdatatrenddaily", { FROM_DATE: DATA.FROM_DATE, TO_DATE: DATA.TO_DATE });
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: YCTK_TREND_DATA, index: number) => ({
          ...element,
          RATE: element.TOTAL !== 0 ? element.COMPLETED / element.TOTAL : 0,
          REQ_DATE: moment(element.REQ_DATE).format("YYYY-MM-DD"),
          id: index,
        }));
      }
      return [];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async load_YCTK_TREND_WEEKLY(DATA: any): Promise<YCTK_TREND_DATA[]> {
    try {
      const response = await generalQuery("loadyctkdatatrendweekly", { FROM_DATE: DATA.FROM_DATE, TO_DATE: DATA.TO_DATE });
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: YCTK_TREND_DATA, index: number) => ({
          ...element,
          RATE: element.TOTAL !== 0 ? element.COMPLETED / element.TOTAL : 0,
          id: index,
        }));
      }
      return [];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async load_YCTK_TREND_MONTHLY(DATA: any): Promise<YCTK_TREND_DATA[]> {
    try {
      const response = await generalQuery("loadyctkdatatrendmonthly", { FROM_DATE: DATA.FROM_DATE, TO_DATE: DATA.TO_DATE });
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: YCTK_TREND_DATA, index: number) => ({
          ...element,
          RATE: element.TOTAL !== 0 ? element.COMPLETED / element.TOTAL : 0,
          id: index,
        }));
      }
      return [];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async load_YCTK_TREND_YEARLY(DATA: any): Promise<YCTK_TREND_DATA[]> {
    try {
      const response = await generalQuery("loadyctkdatatrendyearly", { FROM_DATE: DATA.FROM_DATE, TO_DATE: DATA.TO_DATE });
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: YCTK_TREND_DATA, index: number) => ({
          ...element,
          RATE: element.TOTAL !== 0 ? element.COMPLETED / element.TOTAL : 0,
          id: index,
        }));
      }
      return [];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async load_PO_BALANCE_DETAIL(DATA: any): Promise<PO_BALANCE_DETAIL[]> {
    try {
      const response = await generalQuery("pobalanceYearByWeekDetail", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: PO_BALANCE_DETAIL, index: number) => ({
          ...element,
          id: index,
        }));
      }
      return [];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async load_PO_BALANCE_SUMMARY(DATA: any): Promise<PO_BALANCE_SUMMARY[]> {
    try {
      const response = await generalQuery("pobalanceByYear", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: PO_BALANCE_SUMMARY, index: number) => ({
          ...element,
          id: index,
        }));
      }
      return [];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async load_PO_BALANCE_CUSTOMER(DATA: any): Promise<PO_BALANCE_CUSTOMER[]> {
    try {
      const response = await generalQuery("poBalanceByYearWeekCustomer", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: PO_BALANCE_CUSTOMER, index: number) => ({
          ...element,
          id: index,
        }));
      }
      return [];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async load_PO_BALANCE_CUSTOMER_BY_YEAR(DATA: any): Promise<PO_BALANCE_CUSTOMER[]> {
    try {
      const response = await generalQuery("poBalanceByYearWeekCustomerByYear", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: PO_BALANCE_CUSTOMER, index: number) => ({
          ...element,
          id: index,
        }));
      }
      return [];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async load_film_saving_daily(DATA: any): Promise<any[]> {
    try {
      const response = await generalQuery("tilefilmbandaily", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: any, index: number) => ({
          ...element,
          PLAN_DATE: moment(element.PLAN_DATE).format("YYYY-MM-DD"),
          SAVING_RATE: element.FILM_QTY_LT !== 0 ? 1 - element.FILM_QTY_TT / element.FILM_QTY_LT : 0,
          SQM_SAVING_RATE: element.SQM_LT !== 0 ? 1 - element.SQM_TT / element.SQM_LT : 0,
          id: index,
        }));
      }
      return [];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async load_film_saving_weekly(DATA: any): Promise<any[]> {
    try {
      const response = await generalQuery("tilefilmbanweekly", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: any, index: number) => ({
          ...element,
          SAVING_RATE: element.FILM_QTY_LT !== 0 ? 1 - element.FILM_QTY_TT / element.FILM_QTY_LT : 0,
          SQM_SAVING_RATE: element.SQM_LT !== 0 ? 1 - element.SQM_TT / element.SQM_LT : 0,
          id: index,
        }));
      }
      return [];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async load_film_saving_monthly(DATA: any): Promise<any[]> {
    try {
      const response = await generalQuery("tilefilmbanmonthly", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: any, index: number) => ({
          ...element,
          SAVING_RATE: element.FILM_QTY_LT !== 0 ? 1 - element.FILM_QTY_TT / element.FILM_QTY_LT : 0,
          SQM_SAVING_RATE: element.SQM_LT !== 0 ? 1 - element.SQM_TT / element.SQM_LT : 0,
          id: index,
        }));
      }
      return [];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async load_film_saving_yearly(DATA: any): Promise<any[]> {
    try {
      const response = await generalQuery("tilefilmbanyearly", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: any, index: number) => ({
          ...element,
          SAVING_RATE: element.FILM_QTY_LT !== 0 ? 1 - element.FILM_QTY_TT / element.FILM_QTY_LT : 0,
          SQM_SAVING_RATE: element.SQM_LT !== 0 ? 1 - element.SQM_TT / element.SQM_LT : 0,
          id: index,
        }));
      }
      return [];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async load_tilefilmbanBackData(DATA: any): Promise<any[]> {
    try {
      const response = await generalQuery("tilefilmbanbackdata", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: any, index: number) => ({
          ...element,
          PLAN_DATE: moment(element.PLAN_DATE).format("YYYY-MM-DD"),
          id: index,
        }));
      }
      return [];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async batchDeleteYCSX(DATA: YCSXTableData[]): Promise<{ success_count: number; fail_count: number }> {
    let success_count: number = 0;
    let fail_count: number = 0;
    for (let i = 0; i < DATA.length; i++) {
      const res = await this.deleteYCSX(DATA[i].PROD_REQUEST_NO);
      if (res === "OK") {
        success_count++;
      } else {
        fail_count++;
      }
    }
    return { success_count, fail_count };
  },

  async load_ProdOverData(only_pending: boolean): Promise<PROD_OVER_DATA[]> {
    try {
      const response = await generalQuery("loadProdOverData", { ONLY_PENDING: only_pending });
      if (response.data.tk_status !== "NG") {
        const loadeddata = response.data.data.map((element: PROD_OVER_DATA, index: number) => ({
          ...element,
          KD_CF_DATETIME: element.KD_CF_DATETIME ? moment.utc(element.KD_CF_DATETIME).format("YYYY-MM-DD HH:mm:ss") : "",
          UPD_DATE: element.UPD_DATE ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD HH:mm:ss") : "",
          INS_DATE: element.INS_DATE ? moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss") : "",
          id: index,
        }));
        Swal.fire("Thông báo", "Đã load: " + loadeddata.length + " dòng", "success");
        return loadeddata;
      } else {
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        return [];
      }
    } catch (error: any) {
      console.error(error);
      Swal.fire("Thông báo", "Lỗi tải dữ liệu", "error");
      return [];
    }
  },

  async update_ProdOverData(prod_over_data: PROD_OVER_DATA, KD_CFM_VALUE: string): Promise<string> {
    try {
      const response = await generalQuery("updateProdOverData", {
        AUTO_ID: prod_over_data.AUTO_ID,
        KD_CFM: KD_CFM_VALUE,
        KD_REMARK: prod_over_data.KD_REMARK ?? "",
      });
      if (response.data.tk_status !== "NG") {
        Swal.fire("Thông báo", "Update data thành công", "success");
        return "0";
      } else {
        Swal.fire("Thông báo", "Update data thất bại", "error");
        return response.data.message;
      }
    } catch (error: any) {
      console.error(error);
      Swal.fire("Thông báo", "Lỗi update data", "error");
      return error.message;
    }
  },

  async checkG_CODE_USE_YN(G_CODE: string): Promise<number> {
    try {
      const response = await generalQuery("checkGCodeVer", { G_CODE: G_CODE });
      if (response.data.tk_status !== "NG") {
        if (response.data.data[0].USE_YN === "Y") {
          return 0; // OK
        } else {
          return 1; // Locked
        }
      } else {
        return 2; // Not found
      }
    } catch (error: any) {
      console.log(error);
      return 2;
    }
  },
};
