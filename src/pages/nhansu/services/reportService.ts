import moment from "moment";
import { generalQuery } from "../../../api/Api";
import {
  DIEMDANHFULLSUMMARY,
  DIEMDANHMAINDEPT,
  DiemDanhFullData,
  DiemDanhHistoryData,
  DiemDanhNhomDataSummary,
  MainDeptData,
} from "../interfaces/nhansuInterface";
import { weekdayarray } from "../../../api/GlobalFunction";

export const reportService = {
  getMainDeptList: async (fromDate: string): Promise<MainDeptData[]> => {
    try {
      const response = await generalQuery("getmaindeptlist", { from_date: fromDate });
      if (response.data.tk_status !== "NG") {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  },

  getDiemDanhSummaryNhom: async (toDate: string): Promise<DiemDanhNhomDataSummary[]> => {
    try {
      const response = await generalQuery("diemdanhsummarynhom", { todate: toDate });
      if (response.data.tk_status !== "NG") {
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      throw error;
    }
  },

  getDiemDanhHistoryNhom: async (filters: {
    start_date: string;
    end_date: string;
    MAINDEPTCODE: number;
    WORK_SHIFT_CODE: number;
    FACTORY_CODE: number;
  }): Promise<DiemDanhHistoryData[]> => {
    try {
      const response = await generalQuery("diemdanhhistorynhom", filters);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((obj: { APPLY_DATE: string | any[] }) => ({
          ...obj,
          APPLY_DATE: obj.APPLY_DATE.slice(0, 10),
        }));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      throw error;
    }
  },

  getDiemDanhFull: async (
    fromDate: string,
    toDate: string
  ): Promise<DiemDanhFullData[]> => {
    try {
      const response = await generalQuery("diemdanhfull", {
        from_date: fromDate,
        to_date: toDate,
      });
      if (response.data.tk_status !== "NG") {
        return response.data.data.map(
          (element: DiemDanhFullData, index: number) => ({
            ...element,
            DATE_COLUMN: moment(element.DATE_COLUMN).utc().format("YYYY-MM-DD"),
            APPLY_DATE:
              element.APPLY_DATE === null
                ? ""
                : moment(element.APPLY_DATE).utc().format("YYYY-MM-DD"),
            WEEKDAY: weekdayarray[new Date(element.DATE_COLUMN).getDay()],
            id: index,
          })
        );
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      throw error;
    }
  },

  getDDMainDeptTB: async (
    fromDate: string,
    toDate: string
  ): Promise<DIEMDANHMAINDEPT[]> => {
    try {
      const response = await generalQuery("getddmaindepttb", {
        FROM_DATE: fromDate,
        TO_DATE: toDate,
      });
      if (response.data.tk_status !== "NG") {
        let temp_total: DIEMDANHMAINDEPT = {
          id: 1111,
          MAINDEPTNAME: "TOTAL",
          COUNT_TOTAL: 0,
          COUT_ON: 0,
          COUT_OFF: 0,
          COUNT_CDD: 0,
          ON_RATE: 0,
        };
        let loadeddata = response.data.data.map(
          (element: DIEMDANHMAINDEPT, index: number) => {
            temp_total = {
              ...temp_total,
              COUNT_TOTAL: temp_total.COUNT_TOTAL + element.COUNT_TOTAL,
              COUT_ON: temp_total.COUT_ON + element.COUT_ON,
              COUT_OFF: temp_total.COUT_OFF + element.COUT_OFF,
              COUNT_CDD: temp_total.COUNT_CDD + element.COUNT_CDD,
            };
            return {
              ...element,
              id: index,
            };
          }
        );
        temp_total = {
          ...temp_total,
          ON_RATE: (temp_total.COUT_ON / temp_total.COUNT_TOTAL) * 100,
        };
        loadeddata = [...loadeddata, temp_total];
        return loadeddata;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      throw error;
    }
  },

  loadDiemDanhFullSummary: async (
    fromDate: string,
    toDate: string
  ): Promise<DIEMDANHFULLSUMMARY[]> => {
    try {
      const response = await generalQuery("loadDiemDanhFullSummaryTable", {
        FROM_DATE: fromDate,
        TO_DATE: toDate,
      });
      if (response.data.tk_status !== "NG") {
        const loaded_data: DIEMDANHFULLSUMMARY[] = response.data.data.map(
          (element: DIEMDANHFULLSUMMARY, index: number) => ({
            ...element,
            id: index,
          })
        );
        let totalRow: DIEMDANHFULLSUMMARY = {
          id: -1,
          MAINDEPTNAME: "TOTAL",
          COUNT_TOTAL: 0,
          COUNT_ON: 0,
          COUNT_OFF: 0,
          COUNT_CDD: 0,
          T1_TOTAL: 0, T1_ON: 0, T1_OFF: 0, T1_CDD: 0,
          T2_TOTAL: 0, T2_ON: 0, T2_OFF: 0, T2_CDD: 0,
          HC_TOTAL: 0, HC_ON: 0, HC_OFF: 0, HC_CDD: 0,
          ON_RATE: 0, TOTAL: 0,
          PHEP_NAM: 0, NUA_PHEP: 0, NGHI_VIEC_RIENG: 0,
          NGHI_OM: 0, CHE_DO: 0, KHONG_LY_DO: 0,
        };
        for (let i = 0; i < loaded_data.length; i++) {
          totalRow.T1_CDD += loaded_data[i].T1_CDD;
          totalRow.T1_OFF += loaded_data[i].T1_OFF;
          totalRow.T1_ON += loaded_data[i].T1_ON;
          totalRow.T1_TOTAL += loaded_data[i].T1_TOTAL;
          totalRow.T2_CDD += loaded_data[i].T2_CDD;
          totalRow.T2_OFF += loaded_data[i].T2_OFF;
          totalRow.T2_ON += loaded_data[i].T2_ON;
          totalRow.T2_TOTAL += loaded_data[i].T2_TOTAL;
          totalRow.HC_CDD += loaded_data[i].HC_CDD;
          totalRow.HC_OFF += loaded_data[i].HC_OFF;
          totalRow.HC_ON += loaded_data[i].HC_ON;
          totalRow.HC_TOTAL += loaded_data[i].HC_TOTAL;
          totalRow.COUNT_CDD += loaded_data[i].COUNT_CDD;
          totalRow.COUNT_OFF += loaded_data[i].COUNT_OFF;
          totalRow.COUNT_ON += loaded_data[i].COUNT_ON;
          totalRow.COUNT_TOTAL += loaded_data[i].COUNT_TOTAL;
          totalRow.TOTAL += loaded_data[i].TOTAL;
          totalRow.PHEP_NAM += loaded_data[i].PHEP_NAM;
          totalRow.NUA_PHEP += loaded_data[i].NUA_PHEP;
          totalRow.NGHI_VIEC_RIENG += loaded_data[i].NGHI_VIEC_RIENG;
          totalRow.NGHI_OM += loaded_data[i].NGHI_OM;
          totalRow.CHE_DO += loaded_data[i].CHE_DO;
          totalRow.KHONG_LY_DO += loaded_data[i].KHONG_LY_DO;
        }
        totalRow.ON_RATE =
          (totalRow.COUNT_ON / totalRow.COUNT_TOTAL) * 100;
        return [...loaded_data, totalRow];
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      throw error;
    }
  },
};
