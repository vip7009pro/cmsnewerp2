import moment from "moment";
import { generalQuery, getAuditMode } from "../../../api/Api";
import { CodeListData, CustomerListData, POTableData, PRICEWITHMOQ } from "../interfaces/kdInterface";
import { zeroPad } from "../../../api/GlobalFunction";

export const poService = {
  /**
   * Tải toàn bộ dữ liệu PO
   */
  loadPoDataFull: async (filterData: any): Promise<POTableData[]> => {
    try {
      const response = await generalQuery("traPODataFull", filterData);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: POTableData, index: number) => ({
          ...element,
          id: index,
          PO_DATE: element.PO_DATE.slice(0, 10),
          RD_DATE: element.RD_DATE.slice(0, 10),
          G_NAME: getAuditMode() == 0 ? element?.G_NAME : (element?.G_NAME?.search("CNDB") === -1 ? element?.G_NAME : "TEM_NOI_BO"),
          G_NAME_KD: getAuditMode() == 0 ? element?.G_NAME_KD : (element?.G_NAME?.search("CNDB") === -1 ? element?.G_NAME_KD : "TEM_NOI_BO"),
        }));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      throw new Error(error.message || "Lỗi khi tải dữ liệu PO");
    }
  },

  /**
   * Kiểm tra PO tồn tại
   */
  checkPOExist: async (G_CODE: string, CUST_CD: string, PO_NO: string): Promise<boolean> => {
    try {
      const response = await generalQuery("checkPOExist", { G_CODE, CUST_CD, PO_NO });
      return response.data.tk_status !== "NG";
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  /**
   * Lấy thông tin chi tiết PO để check
   */
  checkPOInfo: async (G_CODE: string, CUST_CD: string, PO_NO: string): Promise<any[]> => {
    try {
      const response = await generalQuery("checkPOExist", { G_CODE, CUST_CD, PO_NO });
      if (response.data.tk_status !== "NG") {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  /**
   * Thêm mới PO
   */
  insertPO: async (poData: any): Promise<string> => {
    try {
      const response = await generalQuery("insert_po", {
        G_CODE: poData.G_CODE,
        CUST_CD: poData.CUST_CD,
        PO_NO: poData.PO_NO,
        EMPL_NO: poData.EMPL_NO,
        PO_QTY: poData.PO_QTY,
        PO_DATE: poData.PO_DATE,
        RD_DATE: poData.RD_DATE,
        PROD_PRICE: poData.PROD_PRICE,
        BEP: poData.BEP ?? 0,
        REMARK: poData.REMARK,
      });
      if (response.data.tk_status !== "NG") {
        return "OK";
      } else {
        return "NG: Lỗi SQL: " + response.data.message;
      }
    } catch (error: any) {
      console.error(error);
      return "NG: Lỗi mạng hoặc server";
    }
  },

  /**
   * Cập nhật PO
   */
  updatePO: async (poData: any): Promise<string> => {
    try {
      const response = await generalQuery("update_po", {
        G_CODE: poData.G_CODE,
        CUST_CD: poData.CUST_CD,
        PO_NO: poData.PO_NO,
        EMPL_NO: poData.EMPL_NO,
        PO_QTY: poData.PO_QTY,
        PO_DATE: poData.PO_DATE,
        RD_DATE: poData.RD_DATE,
        PROD_PRICE: poData.PROD_PRICE,
        BEP: poData.BEP ?? 0,
        REMARK: poData.REMARK,
        PO_ID: poData.PO_ID,
      });
      if (response.data.tk_status !== "NG") {
        return "OK";
      } else {
        return "NG: Lỗi SQL: " + response.data.message;
      }
    } catch (error: any) {
      console.error(error);
      return "NG: Lỗi mạng hoặc server";
    }
  },

  /**
   * Xóa PO
   */
  deletePO: async (PO_ID: number): Promise<string> => {
    try {
      const response = await generalQuery("delete_po", { PO_ID });
      if (response.data.tk_status !== "NG") {
        return "OK";
      } else {
        return "NG: Lỗi SQL: " + response.data.message;
      }
    } catch (error: any) {
      console.error(error);
      return "NG: Lỗi mạng hoặc server";
    }
  },

  /**
   * Auto generate PO Number
   */
  autogeneratePONO: async (cust_cd: string): Promise<string> => {
    let po_no_to_check: string = cust_cd + "_" + moment.utc().format("YYMMDD");
    let next_po_no: string = po_no_to_check + "_001";
    try {
      const response = await generalQuery("checkcustomerpono", { CHECK_PO_NO: po_no_to_check });
      if (response.data.tk_status !== "NG" && response.data.data.length > 0) {
        let arr = response.data.data[0].PO_NO.split("_");
        next_po_no = po_no_to_check + "_" + zeroPad(parseInt(arr[2]) + 1, 3);
      }
      return next_po_no;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi tạo mã PO tự động");
    }
  },

  /**
   * Đồng bộ giá sản phẩm từ PO
   */
  dongboGiaPO: async (): Promise<void> => {
    try {
      const response = await generalQuery("dongbogiasptupo", {});
      if (response.data.tk_status === "NG") {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      throw new Error(error.message || "Lỗi đồng bộ giá PO");
    }
  },

  /**
   * Auto phê duyệt giá
   */
  autoPheDuyetGia: async (): Promise<void> => {
    try {
      await generalQuery("autopheduyetgiaall", {});
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * Lấy danh sách khách hàng
   */
  getCustomerList: async (): Promise<CustomerListData[]> => {
    try {
      const response = await generalQuery("selectcustomerList", {});
      if (response.data.tk_status !== "NG") {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  /**
   * Lấy danh sách Code sản phẩm
   */
  getCodeList: async (G_NAME: string): Promise<CodeListData[]> => {
    try {
      const response = await generalQuery("selectcodeList", { G_NAME });
      if (response.data.tk_status !== "NG") {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  /**
   * Tải bảng giá theo Code hoặc Khách hàng
   */
  loadPrice: async (G_CODE?: string, CUST_NAME?: string): Promise<PRICEWITHMOQ[]> => {
    if (!G_CODE || !CUST_NAME) return [];
    try {
      const response = await generalQuery("loadbanggiamoinhat", {
        ALLTIME: true,
        FROM_DATE: "",
        TO_DATE: "",
        M_NAME: "",
        G_CODE: G_CODE,
        G_NAME: "",
        CUST_NAME_KD: CUST_NAME,
      });

      if (response.data.tk_status !== "NG") {
        // Handle logic directly matching the original
        // CMS vs other companies check not possible here without getCompany(), 
        // passing it or calling it directly if imported from Api.ts
        const { getCompany } = await import("../../../api/Api");
        const company = getCompany();
        
        let loaded_data: PRICEWITHMOQ[] = response.data.data.map((element: PRICEWITHMOQ, index: number) => ({
          ...element,
          PRICE_DATE: element.PRICE_DATE !== null ? moment.utc(element.PRICE_DATE).format("YYYY-MM-DD") : "",
          id: index,
        }));

        if (company !== "CMS") {
          loaded_data = loaded_data.filter((element: PRICEWITHMOQ) => element.FINAL === "Y");
        }
        return loaded_data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      throw new Error(error.message || "Lỗi khi tải bảng giá");
    }
  },

  /**
   * Tải PO Full cho CMS (có check company CMS)
   */
  loadPOFullCMS: async (data: any): Promise<any> => {
    const { getCompany } = await import("../../../api/Api");
    const queryName = getCompany() === "CMS" ? "traPOFullCMS_New" : "traPOFullCMS2";
    return await generalQuery(queryName, data);
  },

  /**
   * Tải PO Full cho KD (có check company CMS)
   */
  loadPOFullKD: async (data: any): Promise<any> => {
    const { getCompany } = await import("../../../api/Api");
    const queryName = getCompany() === "CMS" ? "traPOFullKD_NEW" : "traPOFullKD2";
    return await generalQuery(queryName, data);
  }
};
