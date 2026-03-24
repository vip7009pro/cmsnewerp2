import { generalQuery, getAuditMode } from "../../../api/Api";
import { InvoiceTableData } from "../interfaces/kdInterface";
import moment from "moment";

const datediff = (date1: string, date2: string) => {
  const d1 = moment.utc(date1);
  const d2 = moment.utc(date2);
  return d1.diff(d2, "days");
};

export const invoiceService = {
  async loadInvoiceDataFull(filterData: any): Promise<InvoiceTableData[]> {
    try {
      const response = await generalQuery("traInvoiceDataFull", filterData);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: InvoiceTableData, index: number) => {
          const date1 = moment.utc(element.RD_DATE).format("YYYY-MM-DD");
          const date2 = moment.utc(element.DELIVERY_DATE).format("YYYY-MM-DD");
          const diff: number = datediff(date1, date2);
          return {
            ...element,
            id: index,
            DELIVERY_DATE: element.DELIVERY_DATE.slice(0, 10),
            PO_DATE: element.PO_DATE.slice(0, 10),
            RD_DATE: element.RD_DATE.slice(0, 10),
            OVERDUE: diff < 0 ? "OVER" : "OK",
            G_NAME: getAuditMode() == 0 ? element?.G_NAME : element?.G_NAME?.search("CNDB") == -1 ? element?.G_NAME : "TEM_NOI_BO",
            G_NAME_KD: getAuditMode() == 0 ? element?.G_NAME_KD : element?.G_NAME?.search("CNDB") == -1 ? element?.G_NAME_KD : "TEM_NOI_BO",
          };
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to load invoice data");
    }
  },

  async insertInvoice(invoiceData: any): Promise<string> {
    try {
      const response = await generalQuery("insert_invoice", {
        G_CODE: invoiceData.G_CODE,
        CUST_CD: invoiceData.CUST_CD,
        PO_NO: invoiceData.PO_NO,
        EMPL_NO: invoiceData.EMPL_NO,
        DELIVERY_QTY: invoiceData.DELIVERY_QTY,
        PO_DATE: invoiceData.PO_DATE,
        RD_DATE: invoiceData.RD_DATE,
        DELIVERY_DATE: invoiceData.DELIVERY_DATE,
        REMARK: invoiceData.REMARK,
        INVOICE_NO: invoiceData.INVOICE_NO ?? "",
      });
      if (response.data.tk_status !== "NG") {
        return "OK";
      } else {
        return "NG: Lỗi SQL: " + response.data.message;
      }
    } catch (error: any) {
      return "NG: Lỗi kết nối: " + error.message;
    }
  },

  async updateInvoice(invoiceData: any): Promise<string> {
    try {
      const response = await generalQuery("update_invoice", {
        G_CODE: invoiceData.G_CODE,
        CUST_CD: invoiceData.CUST_CD,
        PO_NO: invoiceData.PO_NO,
        EMPL_NO: invoiceData.EMPL_NO,
        DELIVERY_DATE: invoiceData.DELIVERY_DATE,
        DELIVERY_QTY: invoiceData.DELIVERY_QTY,
        REMARK: invoiceData.REMARK,
        DELIVERY_ID: invoiceData.DELIVERY_ID,
      });
      if (response.data.tk_status !== "NG") {
        return "OK";
      } else {
        return "NG: Lỗi SQL: " + response.data.message;
      }
    } catch (error: any) {
      return "NG: Lỗi kết nối: " + error.message;
    }
  },

  async deleteInvoice(DELIVERY_ID: number): Promise<string> {
    try {
      const response = await generalQuery("delete_invoice", {
        DELIVERY_ID: DELIVERY_ID,
      });
      if (response.data.tk_status !== "NG") {
        return "OK";
      } else {
        return "NG: Lỗi SQL: " + response.data.message;
      }
    } catch (error: any) {
      return "NG: Lỗi kết nối: " + error.message;
    }
  },

  async updateInvoiceNo(DELIVERY_ID: number, INVOICE_NO: string): Promise<string> {
    try {
      const response = await generalQuery("update_invoice_no", {
        DELIVERY_ID: DELIVERY_ID,
        INVOICE_NO: INVOICE_NO,
      });
      if (response.data.tk_status !== "NG") {
        return "OK";
      } else {
        return "NG: Lỗi SQL: " + response.data.message;
      }
    } catch (error: any) {
      return "NG: Lỗi kết nối: " + error.message;
    }
  }
};
