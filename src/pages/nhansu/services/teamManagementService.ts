import moment from "moment";
import { generalQuery } from "../../../api/Api";
import {
  DiemDanhNhomData,
  PheDuyetNghiData,
  WorkPositionTableData,
} from "../interfaces/nhansuInterface";

export const teamManagementService = {
  setTeamNhom: async (
    emplNo: string,
    teamValue: number
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await generalQuery("setteamnhom", {
        teamvalue: teamValue,
        EMPL_NO: emplNo,
      });
      if (response.data.tk_status === "OK") {
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  setCa: async (
    emplNo: string,
    calv: number
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await generalQuery("setca", {
        EMPL_NO: emplNo,
        CALV: calv,
      });
      if (response.data.tk_status === "OK") {
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  setFactory: async (
    emplNo: string,
    factory: number
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await generalQuery("setnhamay", {
        EMPL_NO: emplNo,
        FACTORY: factory,
      });
      if (response.data.tk_status === "OK") {
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  setWorkPosition: async (
    emplNo: string,
    workPositionCode: number
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await generalQuery("setEMPL_WORK_POSITION", {
        WORK_POSITION_CODE: workPositionCode,
        EMPL_NO: emplNo,
      });
      if (response.data.tk_status === "OK") {
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  loadDiemDanhNhom: async (
    option: string,
    teamNameList: number
  ): Promise<DiemDanhNhomData[]> => {
    try {
      const response = await generalQuery(option, {
        team_name_list: teamNameList,
      });
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((e: any, index: number) => ({
          ...e,
          REQUEST_DATE:
            e.REQUEST_DATE !== null
              ? moment.utc(e.REQUEST_DATE).format("YYYY-MM-DD")
              : "",
          APPLY_DATE:
            e.APPLY_DATE !== null
              ? moment.utc(e.APPLY_DATE).format("YYYY-MM-DD")
              : "",
          FULL_NAME: e.MIDLAST_NAME + " " + e.FIRST_NAME,
          id: index + 1,
        }));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.log(error);
      return [];
    }
  },

  loadWorkPositionTable: async (
    option: string
  ): Promise<WorkPositionTableData[]> => {
    try {
      const response = await generalQuery(option, {});
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((e: any, index: number) => ({
          ...e,
          id: index + 1,
        }));
      }
      return [];
    } catch (error: any) {
      console.log(error);
      return [];
    }
  },

  setPheDuyet: async (
    offId: number,
    pheDuyetValue: number
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await generalQuery("setpheduyetnhom", {
        off_id: offId,
        pheduyetvalue: pheDuyetValue,
      });
      if (response.data.tk_status === "OK") {
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      console.log(error);
      return { success: false, message: error.message };
    }
  },

  loadPheDuyetNghi: async (
    option: string,
    filters: { FROM_DATE: string; TO_DATE: string; ONLY_PENDING: boolean }
  ): Promise<PheDuyetNghiData[]> => {
    try {
      const response = await generalQuery(option, filters);
      if (response.data.tk_status !== "NG") {
        return response.data.data.map((e: any, index: number) => ({
          ...e,
          REQUEST_DATE:
            e.REQUEST_DATE !== null
              ? moment.utc(e.REQUEST_DATE).format("YYYY-MM-DD")
              : "",
          APPLY_DATE:
            e.APPLY_DATE !== null
              ? moment.utc(e.APPLY_DATE).format("YYYY-MM-DD")
              : "",
          DOB: e.DOB !== null ? moment.utc(e.DOB).format("YYYY-MM-DD") : "",
          FULL_NAME: e.MIDLAST_NAME + " " + e.FIRST_NAME,
          id: e.OFF_ID,
        }));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      throw error;
    }
  },
};
