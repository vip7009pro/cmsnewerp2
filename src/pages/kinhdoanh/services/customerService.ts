import { generalQuery } from "../../../api/Api";

export const customerService = {
  checkcustcd: async (data: any) => {
    return await generalQuery("checkcustcd", data);
  },
  get_listcustomer: async (data: any = {}) => {
    return await generalQuery("get_listcustomer", data);
  },
  add_customer: async (data: any) => {
    return await generalQuery("add_customer", data);
  },
  edit_customer: async (data: any) => {
    return await generalQuery("edit_customer", data);
  }
};
