import { generalQuery } from "../../../api/Api";

export const registrationService = {
  dangKyNghi: async (data: {
    canghi: number;
    reason_code: number;
    remark_content: string;
    ngaybatdau: string;
    ngayketthuc: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await generalQuery("dangkynghi2", data);
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

  dangKyTangCa: async (data: {
    over_start: string;
    over_finish: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await generalQuery("dangkytangcacanhan", data);
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

  xacNhanChamCong: async (data: {
    confirm_worktime: string;
    confirm_date: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await generalQuery("xacnhanchamcongnhom", data);
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
};
