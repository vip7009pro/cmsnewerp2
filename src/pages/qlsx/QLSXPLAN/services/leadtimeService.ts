import moment from "moment";
import { generalQuery } from "../../../../api/Api";
import { LEADTIME_DATA } from "../interfaces/khsxInterface";

/**
 * Load leadtime data from backend.
 * Fetches all LEADTIME_DATA records and formats dates to YYYY-MM-DD.
 * @returns Promise resolving to array of LEADTIME_DATA
 */
export const loadLeadtimeData = async (): Promise<LEADTIME_DATA[]> => {
  let kq: LEADTIME_DATA[] = [];
  await generalQuery("loadLeadtimeData", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const loadeddata: LEADTIME_DATA[] = response.data.data.map(
          (element: LEADTIME_DATA, index: number) => {
            return {
              ...element,
              PROD_REQUEST_DATE: moment
                .utc(element.PROD_REQUEST_DATE)
                .format("YYYY-MM-DD"),
              DELIVERY_DT: moment.utc(element.DELIVERY_DT).format("YYYY-MM-DD"),
              id: index,
            };
          }
        );
        kq = loadeddata;
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const leadtimeService = {
  loadLeadtimeData,
};
