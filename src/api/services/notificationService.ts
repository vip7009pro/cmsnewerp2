import { generalQuery, getUserData } from "../Api";
import moment from "moment";
import { NotificationElement } from "../../components/NotificationPanel/Notification";

/**
 * Notification service - extracted from GlobalFunction.tsx
 */
export const f_load_Notification_Data = async () => {
  let kq: NotificationElement[] = [];
  await generalQuery("load_Notification_Data", {
    MAINDEPTNAME: getUserData()?.MAINDEPTNAME,
    SUBDEPTNAME: getUserData()?.SUBDEPTNAME,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data.map((element: any, index: number) => {
          return {
            ...element,
            INS_DATE: moment
              .utc(element.INS_DATE)
              .format("YYYY-MM-DD HH:mm:ss"),
            id: index,
          };
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const f_insert_Notification_Data = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("insert_Notification_Data", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = true;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
