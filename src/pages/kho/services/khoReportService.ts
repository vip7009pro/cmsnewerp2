import { generalQuery } from "../../../api/Api";
import {
  M_INPUT_BY_POPULAR_DATA,
  M_INPUT_BY_POPULAR_DETAIL_DATA,
  M_OUTPUT_BY_POPULAR_DATA,
  M_OUTPUT_BY_POPULAR_DETAIL_DATA,
  M_STOCK_BY_MONTH_DATA,
  M_STOCK_BY_MONTH_DETAIL_DATA,
  MSTOCK_BY_POPULAR_DATA,
  MSTOCK_BY_POPULAR_DETAIL_DATA,
  P_STOCK_BY_MONTH_DATA,
  P_STOCK_BY_MONTH_DETAIL_DATA,
} from "../interfaces/khoInterface";

export const khoReportService = {
  async loadMSTOCK_BY_POPULAR(DATA: any): Promise<MSTOCK_BY_POPULAR_DATA[]> {
    try {
      const response = await generalQuery("loadMSTOCK_BY_POPULAR", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: MSTOCK_BY_POPULAR_DATA, index: number) => ({
          ...element,
          id: index,
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  async loadMSTOCK_BY_POPULAR_DETAIL(DATA: any): Promise<MSTOCK_BY_POPULAR_DETAIL_DATA[]> {
    try {
      const response = await generalQuery("loadMSTOCK_BY_POPULAR_DETAIL", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: MSTOCK_BY_POPULAR_DETAIL_DATA, index: number) => ({
          ...element,
          id: index,
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  async load_M_INPUT_BY_POPULAR(DATA: any): Promise<M_INPUT_BY_POPULAR_DATA[]> {
    try {
      const response = await generalQuery("load_M_INPUT_BY_POPULAR", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: M_INPUT_BY_POPULAR_DATA, index: number) => ({
          ...element,
          id: index,
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  async load_M_INPUT_BY_POPULAR_DETAIL(DATA: any): Promise<M_INPUT_BY_POPULAR_DETAIL_DATA[]> {
    try {
      const response = await generalQuery("load_M_INPUT_BY_POPULAR_DETAIL", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: M_INPUT_BY_POPULAR_DETAIL_DATA, index: number) => ({
          ...element,
          id: index,
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  async load_M_OUTPUT_BY_POPULAR(DATA: any): Promise<M_OUTPUT_BY_POPULAR_DATA[]> {
    try {
      const response = await generalQuery("load_M_OUTPUT_BY_POPULAR", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: M_OUTPUT_BY_POPULAR_DATA, index: number) => ({
          ...element,
          id: index,
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  async load_M_OUTPUT_BY_POPULAR_DETAIL(DATA: any): Promise<M_OUTPUT_BY_POPULAR_DETAIL_DATA[]> {
    try {
      const response = await generalQuery("load_M_OUTPUT_BY_POPULAR_DETAIL", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: M_OUTPUT_BY_POPULAR_DETAIL_DATA, index: number) => ({
          ...element,
          id: index,
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  async load_M_STOCK_BY_MONTH(DATA: any): Promise<M_OUTPUT_BY_POPULAR_DETAIL_DATA[]> {
    try {
      const response = await generalQuery("load_M_STOCK_BY_MONTH", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: M_OUTPUT_BY_POPULAR_DETAIL_DATA, index: number) => ({
          ...element,
          id: index,
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  async load_Stock_By_Month(DATA: any): Promise<M_STOCK_BY_MONTH_DATA[]> {
    try {
      const response = await generalQuery("load_M_STOCK_BY_MONTH", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: M_STOCK_BY_MONTH_DATA, index: number) => ({
          ...element,
          id: index,
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  async load_Stock_By_Month_Detail(DATA: any): Promise<M_STOCK_BY_MONTH_DETAIL_DATA[]> {
    try {
      const response = await generalQuery("load_M_STOCK_BY_MONTH_DETAIL", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: M_STOCK_BY_MONTH_DETAIL_DATA, index: number) => ({
          ...element,
          id: index,
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  async load_P_Stock_By_Month(DATA: any): Promise<P_STOCK_BY_MONTH_DATA[]> {
    try {
      const response = await generalQuery("load_P_STOCK_BY_MONTH", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: P_STOCK_BY_MONTH_DATA, index: number) => ({
          ...element,
          id: index,
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  async load_P_Stock_By_Month_Detail(DATA: any): Promise<P_STOCK_BY_MONTH_DETAIL_DATA[]> {
    try {
      const response = await generalQuery("load_P_STOCK_BY_MONTH_DETAIL", DATA);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((element: P_STOCK_BY_MONTH_DETAIL_DATA, index: number) => ({
          ...element,
          id: index,
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  },
};
